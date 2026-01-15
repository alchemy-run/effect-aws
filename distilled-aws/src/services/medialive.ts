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
  sdkId: "MediaLive",
  serviceShapeName: "MediaLive",
});
const auth = T.AwsAuthSigv4({ name: "medialive" });
const ver = T.ServiceVersion("2017-10-14");
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
              `https://medialive-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://medialive-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://medialive.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://medialive.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __integerMin1 = number;
export type __stringMin0Max1024 = string;
export type __stringPatternS = string;
export type __stringMax64 = string;
export type __stringMin1Max255PatternS = string;
export type __integerMin10Max86400 = number;
export type __stringMin1Max256PatternS = string;
export type __stringMin1Max2048 = string;
export type MaxResults = number;
export type __stringPattern010920300 = string;
export type __stringMin1Max2048PatternArn = string;
export type __integerMin800Max3000 = number;
export type __integerMin1000000Max100000000 = number;
export type __integerMin0Max65535 = number;
export type __integerMin0Max100000000 = number;
export type __timestampIso8601 = Date;
export type __stringPatternArnMedialiveCloudwatchAlarmTemplateGroup = string;
export type __stringMin7Max11PatternAws097 = string;
export type __stringPatternArnMedialiveEventbridgeRuleTemplateGroup = string;
export type __stringPatternArnMedialiveSignalMap = string;
export type __timestamp = Date;
export type __stringPatternArnMedialiveCloudwatchAlarmTemplate = string;
export type __stringPatternArnMedialiveEventbridgeRuleTemplate = string;
export type __stringMin1 = string;
export type __stringMin1Max35 = string;
export type __stringMax255 = string;
export type __stringMin34Max34 = string;
export type __integerMinNegative60Max60 = number;
export type __stringMax32 = string;
export type __integerMin1Max1000000 = number;
export type __integerMin0Max100 = number;
export type __integerMin1Max5 = number;
export type __integerMin32Max8191 = number;
export type __stringMax256 = string;
export type __integerMin100000Max100000000 = number;
export type __integerMax5 = number;
export type __doubleMinNegative59Max0 = number;
export type __integerMin1Max16 = number;
export type __integerMin1Max8 = number;
export type __stringMax2048 = string;
export type __integerMin0Max1000000 = number;
export type __stringMin6Max6 = string;
export type __stringMin1Max255 = string;
export type __integerMinNegative5Max5 = number;
export type __stringMin1Max256 = string;
export type __longMin0Max86400000 = number;
export type __longMin0Max4294967295 = number;
export type __longMin0Max8589934591 = number;
export type __integerMin0 = number;
export type __integerMin0Max7 = number;
export type __integerMin1Max31 = number;
export type __integerMinNegative1000Max1000 = number;
export type __integerMin0Max255 = number;
export type __integerMin96Max600 = number;
export type __integerMin0Max10 = number;
export type __stringMax1000 = string;
export type __integerMin1Max800 = number;
export type __integerMin80Max800 = number;
export type __stringMin32Max32 = string;
export type __integerMin3 = number;
export type __integerMin0Max3600 = number;
export type __integerMin0Max10000 = number;
export type __integerMin30 = number;
export type __integerMin0Max2000 = number;
export type __stringMax100 = string;
export type __integerMin1Max3600000 = number;
export type __integerMin1000 = number;
export type __integerMin0Max30 = number;
export type __integerMin1Max6 = number;
export type __integerMin1Max10 = number;
export type __integerMin1Max32 = number;
export type __integerMin0Max128 = number;
export type __integerMin1Max51 = number;
export type __integerMin100000Max40000000 = number;
export type __integerMin100000Max80000000 = number;
export type __integerMin1Max3003 = number;
export type __integerMin64Max2160 = number;
export type __integerMin256Max3840 = number;
export type __integerMin0Max3 = number;
export type __integerMin0Max40000000 = number;
export type __integerMin50000Max24000000 = number;
export type __doubleMin0 = number;
export type __integerMin50000Max12000000 = number;
export type __integerMin0Max8000000 = number;
export type __stringMin2Max2 = string;
export type __stringMin1Max7 = string;
export type __doubleMin1Max65535 = number;
export type __integerMinNegative60Max6 = number;
export type __integerMin0Max15 = number;
export type __integerMin1Max4 = number;
export type __stringMin3Max3 = string;
export type __integerMin40Max16000 = number;
export type __integerMin100 = number;
export type __doubleMin0Max1 = number;
export type __integerMin0Max8191 = number;
export type __integerMin0Max32768 = number;
export type __integerMin0Max65536 = number;
export type __integerMin0Max600 = number;
export type __integerMin4Max20 = number;
export type __integerMin1Max20 = number;
export type __doubleMin0Max100 = number;
export type __longMin0Max1099511627775 = number;
export type __integerMin0Max1000 = number;
export type __integerMin0Max500 = number;
export type __doubleMin1 = number;
export type __doubleMin0Max5000 = number;
export type __integerMin25Max10000 = number;
export type __integerMin25Max2000 = number;
export type __integerMin1000Max30000 = number;

//# Schemas
export interface DescribeAccountConfigurationRequest {}
export const DescribeAccountConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/accountConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountConfigurationRequest",
}) as any as S.Schema<DescribeAccountConfigurationRequest>;
export interface ListVersionsRequest {}
export const ListVersionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVersionsRequest",
}) as any as S.Schema<ListVersionsRequest>;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type ChannelClass = "STANDARD" | "SINGLE_PIPELINE" | (string & {});
export const ChannelClass = S.String;
export type LogLevel =
  | "ERROR"
  | "WARNING"
  | "INFO"
  | "DEBUG"
  | "DISABLED"
  | (string & {});
export const LogLevel = S.String;
export type CloudWatchAlarmTemplateComparisonOperator =
  | "GreaterThanOrEqualToThreshold"
  | "GreaterThanThreshold"
  | "LessThanThreshold"
  | "LessThanOrEqualToThreshold"
  | (string & {});
export const CloudWatchAlarmTemplateComparisonOperator = S.String;
export type CloudWatchAlarmTemplateStatistic =
  | "SampleCount"
  | "Average"
  | "Sum"
  | "Minimum"
  | "Maximum"
  | (string & {});
export const CloudWatchAlarmTemplateStatistic = S.String;
export type CloudWatchAlarmTemplateTargetResourceType =
  | "CLOUDFRONT_DISTRIBUTION"
  | "MEDIALIVE_MULTIPLEX"
  | "MEDIALIVE_CHANNEL"
  | "MEDIALIVE_INPUT_DEVICE"
  | "MEDIAPACKAGE_CHANNEL"
  | "MEDIAPACKAGE_ORIGIN_ENDPOINT"
  | "MEDIACONNECT_FLOW"
  | "S3_BUCKET"
  | "MEDIATAILOR_PLAYBACK_CONFIGURATION"
  | (string & {});
export const CloudWatchAlarmTemplateTargetResourceType = S.String;
export type CloudWatchAlarmTemplateTreatMissingData =
  | "notBreaching"
  | "breaching"
  | "ignore"
  | "missing"
  | (string & {});
export const CloudWatchAlarmTemplateTreatMissingData = S.String;
export type ClusterType = "ON_PREMISES" | (string & {});
export const ClusterType = S.String;
export type EventBridgeRuleTemplateEventType =
  | "MEDIALIVE_MULTIPLEX_ALERT"
  | "MEDIALIVE_MULTIPLEX_STATE_CHANGE"
  | "MEDIALIVE_CHANNEL_ALERT"
  | "MEDIALIVE_CHANNEL_INPUT_CHANGE"
  | "MEDIALIVE_CHANNEL_STATE_CHANGE"
  | "MEDIAPACKAGE_INPUT_NOTIFICATION"
  | "MEDIAPACKAGE_KEY_PROVIDER_NOTIFICATION"
  | "MEDIAPACKAGE_HARVEST_JOB_NOTIFICATION"
  | "SIGNAL_MAP_ACTIVE_ALARM"
  | "MEDIACONNECT_ALERT"
  | "MEDIACONNECT_SOURCE_HEALTH"
  | "MEDIACONNECT_OUTPUT_HEALTH"
  | "MEDIACONNECT_FLOW_STATUS_CHANGE"
  | (string & {});
export const EventBridgeRuleTemplateEventType = S.String;
export type InputType =
  | "UDP_PUSH"
  | "RTP_PUSH"
  | "RTMP_PUSH"
  | "RTMP_PULL"
  | "URL_PULL"
  | "MP4_FILE"
  | "MEDIACONNECT"
  | "INPUT_DEVICE"
  | "AWS_CDI"
  | "TS_FILE"
  | "SRT_CALLER"
  | "MULTICAST"
  | "SMPTE_2110_RECEIVER_GROUP"
  | "SDI"
  | "MEDIACONNECT_ROUTER"
  | (string & {});
export const InputType = S.String;
export type InputNetworkLocation = "AWS" | "ON_PREMISES" | (string & {});
export const InputNetworkLocation = S.String;
export type InputSdiSources = string[];
export const InputSdiSources = S.Array(S.String);
export type NodeRole = "BACKUP" | "ACTIVE" | (string & {});
export const NodeRole = S.String;
export type SdiSourceMode = "QUADRANT" | "INTERLEAVE" | (string & {});
export const SdiSourceMode = S.String;
export type SdiSourceType = "SINGLE" | "QUAD" | (string & {});
export const SdiSourceType = S.String;
export type __listOf__stringPatternS = string[];
export const __listOf__stringPatternS = S.Array(S.String);
export type AcceptHeader = "image/jpeg" | (string & {});
export const AcceptHeader = S.String;
export type RebootInputDeviceForce = "NO" | "YES" | (string & {});
export const RebootInputDeviceForce = S.String;
export type ChannelPipelineIdToRestart =
  | "PIPELINE_0"
  | "PIPELINE_1"
  | (string & {});
export const ChannelPipelineIdToRestart = S.String;
export type __listOfChannelPipelineIdToRestart = ChannelPipelineIdToRestart[];
export const __listOfChannelPipelineIdToRestart = S.Array(
  ChannelPipelineIdToRestart,
);
export type UpdateNodeStateShape = "ACTIVE" | "DRAINING" | (string & {});
export const UpdateNodeStateShape = S.String;
export interface AcceptInputDeviceTransferRequest {
  InputDeviceId: string;
}
export const AcceptInputDeviceTransferRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/accept",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptInputDeviceTransferRequest",
}) as any as S.Schema<AcceptInputDeviceTransferRequest>;
export interface AcceptInputDeviceTransferResponse {}
export const AcceptInputDeviceTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptInputDeviceTransferResponse",
}) as any as S.Schema<AcceptInputDeviceTransferResponse>;
export interface BatchDeleteRequest {
  ChannelIds?: string[];
  InputIds?: string[];
  InputSecurityGroupIds?: string[];
  MultiplexIds?: string[];
}
export const BatchDeleteRequest = S.suspend(() =>
  S.Struct({
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    InputIds: S.optional(__listOf__string).pipe(T.JsonName("inputIds")),
    InputSecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroupIds"),
    ),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/batch/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteRequest",
}) as any as S.Schema<BatchDeleteRequest>;
export interface BatchStartRequest {
  ChannelIds?: string[];
  MultiplexIds?: string[];
}
export const BatchStartRequest = S.suspend(() =>
  S.Struct({
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/batch/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchStartRequest",
}) as any as S.Schema<BatchStartRequest>;
export interface BatchStopRequest {
  ChannelIds?: string[];
  MultiplexIds?: string[];
}
export const BatchStopRequest = S.suspend(() =>
  S.Struct({
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/batch/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchStopRequest",
}) as any as S.Schema<BatchStopRequest>;
export interface CancelInputDeviceTransferRequest {
  InputDeviceId: string;
}
export const CancelInputDeviceTransferRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelInputDeviceTransferRequest",
}) as any as S.Schema<CancelInputDeviceTransferRequest>;
export interface CancelInputDeviceTransferResponse {}
export const CancelInputDeviceTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelInputDeviceTransferResponse",
}) as any as S.Schema<CancelInputDeviceTransferResponse>;
export interface ClaimDeviceRequest {
  Id?: string;
}
export const ClaimDeviceRequest = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String).pipe(T.JsonName("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/claimDevice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ClaimDeviceRequest",
}) as any as S.Schema<ClaimDeviceRequest>;
export interface ClaimDeviceResponse {}
export const ClaimDeviceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "ClaimDeviceResponse",
}) as any as S.Schema<ClaimDeviceResponse>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export interface CreateChannelPlacementGroupRequest {
  ClusterId: string;
  Name?: string;
  Nodes?: string[];
  RequestId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateChannelPlacementGroupRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/clusters/{ClusterId}/channelplacementgroups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelPlacementGroupRequest",
}) as any as S.Schema<CreateChannelPlacementGroupRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateCloudWatchAlarmTemplateGroupRequest {
  Description?: string;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  RequestId?: string;
}
export const CreateCloudWatchAlarmTemplateGroupRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/cloudwatch-alarm-template-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCloudWatchAlarmTemplateGroupRequest",
}) as any as S.Schema<CreateCloudWatchAlarmTemplateGroupRequest>;
export interface CreateEventBridgeRuleTemplateGroupRequest {
  Description?: string;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  RequestId?: string;
}
export const CreateEventBridgeRuleTemplateGroupRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/eventbridge-rule-template-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventBridgeRuleTemplateGroupRequest",
}) as any as S.Schema<CreateEventBridgeRuleTemplateGroupRequest>;
export interface CreatePartnerInputRequest {
  InputId: string;
  RequestId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreatePartnerInputRequest = S.suspend(() =>
  S.Struct({
    InputId: S.String.pipe(T.HttpLabel("InputId")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/inputs/{InputId}/partners" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePartnerInputRequest",
}) as any as S.Schema<CreatePartnerInputRequest>;
export interface CreateSdiSourceRequest {
  Mode?: SdiSourceMode;
  Name?: string;
  RequestId?: string;
  Tags?: { [key: string]: string | undefined };
  Type?: SdiSourceType;
}
export const CreateSdiSourceRequest = S.suspend(() =>
  S.Struct({
    Mode: S.optional(SdiSourceMode).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(SdiSourceType).pipe(T.JsonName("type")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/sdiSources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSdiSourceRequest",
}) as any as S.Schema<CreateSdiSourceRequest>;
export interface CreateSignalMapRequest {
  CloudWatchAlarmTemplateGroupIdentifiers?: string[];
  Description?: string;
  DiscoveryEntryPointArn?: string;
  EventBridgeRuleTemplateGroupIdentifiers?: string[];
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  RequestId?: string;
}
export const CreateSignalMapRequest = S.suspend(() =>
  S.Struct({
    CloudWatchAlarmTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIdentifiers")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    EventBridgeRuleTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIdentifiers")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/signal-maps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSignalMapRequest",
}) as any as S.Schema<CreateSignalMapRequest>;
export interface CreateTagsRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateTagsRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTagsRequest",
}) as any as S.Schema<CreateTagsRequest>;
export interface CreateTagsResponse {}
export const CreateTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateTagsResponse",
}) as any as S.Schema<CreateTagsResponse>;
export interface DeleteChannelRequest {
  ChannelId: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({ ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/channels/{ChannelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelRequest",
}) as any as S.Schema<DeleteChannelRequest>;
export interface DeleteChannelPlacementGroupRequest {
  ChannelPlacementGroupId: string;
  ClusterId: string;
}
export const DeleteChannelPlacementGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelPlacementGroupRequest",
}) as any as S.Schema<DeleteChannelPlacementGroupRequest>;
export interface DeleteCloudWatchAlarmTemplateRequest {
  Identifier: string;
}
export const DeleteCloudWatchAlarmTemplateRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCloudWatchAlarmTemplateRequest",
}) as any as S.Schema<DeleteCloudWatchAlarmTemplateRequest>;
export interface DeleteCloudWatchAlarmTemplateResponse {}
export const DeleteCloudWatchAlarmTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudWatchAlarmTemplateResponse",
}) as any as S.Schema<DeleteCloudWatchAlarmTemplateResponse>;
export interface DeleteCloudWatchAlarmTemplateGroupRequest {
  Identifier: string;
}
export const DeleteCloudWatchAlarmTemplateGroupRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCloudWatchAlarmTemplateGroupRequest",
}) as any as S.Schema<DeleteCloudWatchAlarmTemplateGroupRequest>;
export interface DeleteCloudWatchAlarmTemplateGroupResponse {}
export const DeleteCloudWatchAlarmTemplateGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCloudWatchAlarmTemplateGroupResponse",
}) as any as S.Schema<DeleteCloudWatchAlarmTemplateGroupResponse>;
export interface DeleteClusterRequest {
  ClusterId: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({ ClusterId: S.String.pipe(T.HttpLabel("ClusterId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/clusters/{ClusterId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteEventBridgeRuleTemplateRequest {
  Identifier: string;
}
export const DeleteEventBridgeRuleTemplateRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/eventbridge-rule-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventBridgeRuleTemplateRequest",
}) as any as S.Schema<DeleteEventBridgeRuleTemplateRequest>;
export interface DeleteEventBridgeRuleTemplateResponse {}
export const DeleteEventBridgeRuleTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventBridgeRuleTemplateResponse",
}) as any as S.Schema<DeleteEventBridgeRuleTemplateResponse>;
export interface DeleteEventBridgeRuleTemplateGroupRequest {
  Identifier: string;
}
export const DeleteEventBridgeRuleTemplateGroupRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventBridgeRuleTemplateGroupRequest",
}) as any as S.Schema<DeleteEventBridgeRuleTemplateGroupRequest>;
export interface DeleteEventBridgeRuleTemplateGroupResponse {}
export const DeleteEventBridgeRuleTemplateGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventBridgeRuleTemplateGroupResponse",
}) as any as S.Schema<DeleteEventBridgeRuleTemplateGroupResponse>;
export interface DeleteInputRequest {
  InputId: string;
}
export const DeleteInputRequest = S.suspend(() =>
  S.Struct({ InputId: S.String.pipe(T.HttpLabel("InputId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/inputs/{InputId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInputRequest",
}) as any as S.Schema<DeleteInputRequest>;
export interface DeleteInputResponse {}
export const DeleteInputResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteInputResponse",
}) as any as S.Schema<DeleteInputResponse>;
export interface DeleteInputSecurityGroupRequest {
  InputSecurityGroupId: string;
}
export const DeleteInputSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInputSecurityGroupRequest",
}) as any as S.Schema<DeleteInputSecurityGroupRequest>;
export interface DeleteInputSecurityGroupResponse {}
export const DeleteInputSecurityGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInputSecurityGroupResponse",
}) as any as S.Schema<DeleteInputSecurityGroupResponse>;
export interface DeleteMultiplexRequest {
  MultiplexId: string;
}
export const DeleteMultiplexRequest = S.suspend(() =>
  S.Struct({ MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/multiplexes/{MultiplexId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMultiplexRequest",
}) as any as S.Schema<DeleteMultiplexRequest>;
export interface DeleteMultiplexProgramRequest {
  MultiplexId: string;
  ProgramName: string;
}
export const DeleteMultiplexProgramRequest = S.suspend(() =>
  S.Struct({
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMultiplexProgramRequest",
}) as any as S.Schema<DeleteMultiplexProgramRequest>;
export interface DeleteNetworkRequest {
  NetworkId: string;
}
export const DeleteNetworkRequest = S.suspend(() =>
  S.Struct({ NetworkId: S.String.pipe(T.HttpLabel("NetworkId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/networks/{NetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNetworkRequest",
}) as any as S.Schema<DeleteNetworkRequest>;
export interface DeleteNodeRequest {
  ClusterId: string;
  NodeId: string;
}
export const DeleteNodeRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNodeRequest",
}) as any as S.Schema<DeleteNodeRequest>;
export interface DeleteReservationRequest {
  ReservationId: string;
}
export const DeleteReservationRequest = S.suspend(() =>
  S.Struct({ ReservationId: S.String.pipe(T.HttpLabel("ReservationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/reservations/{ReservationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReservationRequest",
}) as any as S.Schema<DeleteReservationRequest>;
export interface DeleteScheduleRequest {
  ChannelId: string;
}
export const DeleteScheduleRequest = S.suspend(() =>
  S.Struct({ ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/channels/{ChannelId}/schedule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduleRequest",
}) as any as S.Schema<DeleteScheduleRequest>;
export interface DeleteScheduleResponse {}
export const DeleteScheduleResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteScheduleResponse" },
) as any as S.Schema<DeleteScheduleResponse>;
export interface DeleteSdiSourceRequest {
  SdiSourceId: string;
}
export const DeleteSdiSourceRequest = S.suspend(() =>
  S.Struct({ SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/sdiSources/{SdiSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSdiSourceRequest",
}) as any as S.Schema<DeleteSdiSourceRequest>;
export interface DeleteSignalMapRequest {
  Identifier: string;
}
export const DeleteSignalMapRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/signal-maps/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSignalMapRequest",
}) as any as S.Schema<DeleteSignalMapRequest>;
export interface DeleteSignalMapResponse {}
export const DeleteSignalMapResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSignalMapResponse",
}) as any as S.Schema<DeleteSignalMapResponse>;
export interface DeleteTagsRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const DeleteTagsRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prod/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsRequest",
}) as any as S.Schema<DeleteTagsRequest>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DescribeChannelRequest {
  ChannelId: string;
}
export const DescribeChannelRequest = S.suspend(() =>
  S.Struct({ ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelRequest",
}) as any as S.Schema<DescribeChannelRequest>;
export interface DescribeChannelPlacementGroupRequest {
  ChannelPlacementGroupId: string;
  ClusterId: string;
}
export const DescribeChannelPlacementGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelPlacementGroupRequest",
}) as any as S.Schema<DescribeChannelPlacementGroupRequest>;
export interface DescribeClusterRequest {
  ClusterId: string;
}
export const DescribeClusterRequest = S.suspend(() =>
  S.Struct({ ClusterId: S.String.pipe(T.HttpLabel("ClusterId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterRequest",
}) as any as S.Schema<DescribeClusterRequest>;
export interface DescribeInputRequest {
  InputId: string;
}
export const DescribeInputRequest = S.suspend(() =>
  S.Struct({ InputId: S.String.pipe(T.HttpLabel("InputId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputs/{InputId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInputRequest",
}) as any as S.Schema<DescribeInputRequest>;
export interface DescribeInputDeviceRequest {
  InputDeviceId: string;
}
export const DescribeInputDeviceRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputDevices/{InputDeviceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInputDeviceRequest",
}) as any as S.Schema<DescribeInputDeviceRequest>;
export interface DescribeInputDeviceThumbnailRequest {
  InputDeviceId: string;
  Accept?: AcceptHeader;
}
export const DescribeInputDeviceThumbnailRequest = S.suspend(() =>
  S.Struct({
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    Accept: S.optional(AcceptHeader).pipe(T.HttpHeader("accept")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/inputDevices/{InputDeviceId}/thumbnailData",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInputDeviceThumbnailRequest",
}) as any as S.Schema<DescribeInputDeviceThumbnailRequest>;
export interface DescribeInputSecurityGroupRequest {
  InputSecurityGroupId: string;
}
export const DescribeInputSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInputSecurityGroupRequest",
}) as any as S.Schema<DescribeInputSecurityGroupRequest>;
export interface DescribeMultiplexRequest {
  MultiplexId: string;
}
export const DescribeMultiplexRequest = S.suspend(() =>
  S.Struct({ MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/multiplexes/{MultiplexId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMultiplexRequest",
}) as any as S.Schema<DescribeMultiplexRequest>;
export interface DescribeMultiplexProgramRequest {
  MultiplexId: string;
  ProgramName: string;
}
export const DescribeMultiplexProgramRequest = S.suspend(() =>
  S.Struct({
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMultiplexProgramRequest",
}) as any as S.Schema<DescribeMultiplexProgramRequest>;
export interface DescribeNetworkRequest {
  NetworkId: string;
}
export const DescribeNetworkRequest = S.suspend(() =>
  S.Struct({ NetworkId: S.String.pipe(T.HttpLabel("NetworkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/networks/{NetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNetworkRequest",
}) as any as S.Schema<DescribeNetworkRequest>;
export interface DescribeNodeRequest {
  ClusterId: string;
  NodeId: string;
}
export const DescribeNodeRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNodeRequest",
}) as any as S.Schema<DescribeNodeRequest>;
export interface DescribeOfferingRequest {
  OfferingId: string;
}
export const DescribeOfferingRequest = S.suspend(() =>
  S.Struct({ OfferingId: S.String.pipe(T.HttpLabel("OfferingId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/offerings/{OfferingId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOfferingRequest",
}) as any as S.Schema<DescribeOfferingRequest>;
export interface DescribeReservationRequest {
  ReservationId: string;
}
export const DescribeReservationRequest = S.suspend(() =>
  S.Struct({ ReservationId: S.String.pipe(T.HttpLabel("ReservationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/reservations/{ReservationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservationRequest",
}) as any as S.Schema<DescribeReservationRequest>;
export interface DescribeScheduleRequest {
  ChannelId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScheduleRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/schedule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScheduleRequest",
}) as any as S.Schema<DescribeScheduleRequest>;
export interface DescribeSdiSourceRequest {
  SdiSourceId: string;
}
export const DescribeSdiSourceRequest = S.suspend(() =>
  S.Struct({ SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/sdiSources/{SdiSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSdiSourceRequest",
}) as any as S.Schema<DescribeSdiSourceRequest>;
export interface DescribeThumbnailsRequest {
  ChannelId: string;
  PipelineId?: string;
  ThumbnailType?: string;
}
export const DescribeThumbnailsRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    PipelineId: S.optional(S.String).pipe(T.HttpQuery("pipelineId")),
    ThumbnailType: S.optional(S.String).pipe(T.HttpQuery("thumbnailType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/thumbnails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeThumbnailsRequest",
}) as any as S.Schema<DescribeThumbnailsRequest>;
export interface GetCloudWatchAlarmTemplateRequest {
  Identifier: string;
}
export const GetCloudWatchAlarmTemplateRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCloudWatchAlarmTemplateRequest",
}) as any as S.Schema<GetCloudWatchAlarmTemplateRequest>;
export interface GetCloudWatchAlarmTemplateGroupRequest {
  Identifier: string;
}
export const GetCloudWatchAlarmTemplateGroupRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCloudWatchAlarmTemplateGroupRequest",
}) as any as S.Schema<GetCloudWatchAlarmTemplateGroupRequest>;
export interface GetEventBridgeRuleTemplateRequest {
  Identifier: string;
}
export const GetEventBridgeRuleTemplateRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/eventbridge-rule-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventBridgeRuleTemplateRequest",
}) as any as S.Schema<GetEventBridgeRuleTemplateRequest>;
export interface GetEventBridgeRuleTemplateGroupRequest {
  Identifier: string;
}
export const GetEventBridgeRuleTemplateGroupRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventBridgeRuleTemplateGroupRequest",
}) as any as S.Schema<GetEventBridgeRuleTemplateGroupRequest>;
export interface GetSignalMapRequest {
  Identifier: string;
}
export const GetSignalMapRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/signal-maps/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSignalMapRequest",
}) as any as S.Schema<GetSignalMapRequest>;
export interface ListAlertsRequest {
  ChannelId: string;
  MaxResults?: number;
  NextToken?: string;
  StateFilter?: string;
}
export const ListAlertsRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/alerts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAlertsRequest",
}) as any as S.Schema<ListAlertsRequest>;
export interface ListChannelPlacementGroupsRequest {
  ClusterId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelPlacementGroupsRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/clusters/{ClusterId}/channelplacementgroups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelPlacementGroupsRequest",
}) as any as S.Schema<ListChannelPlacementGroupsRequest>;
export interface ListChannelsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsRequest",
}) as any as S.Schema<ListChannelsRequest>;
export interface ListCloudWatchAlarmTemplateGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
  Scope?: string;
  SignalMapIdentifier?: string;
}
export const ListCloudWatchAlarmTemplateGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/cloudwatch-alarm-template-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCloudWatchAlarmTemplateGroupsRequest",
}) as any as S.Schema<ListCloudWatchAlarmTemplateGroupsRequest>;
export interface ListCloudWatchAlarmTemplatesRequest {
  GroupIdentifier?: string;
  MaxResults?: number;
  NextToken?: string;
  Scope?: string;
  SignalMapIdentifier?: string;
}
export const ListCloudWatchAlarmTemplatesRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/cloudwatch-alarm-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCloudWatchAlarmTemplatesRequest",
}) as any as S.Schema<ListCloudWatchAlarmTemplatesRequest>;
export interface ListClusterAlertsRequest {
  ClusterId: string;
  MaxResults?: number;
  NextToken?: string;
  StateFilter?: string;
}
export const ListClusterAlertsRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}/alerts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClusterAlertsRequest",
}) as any as S.Schema<ListClusterAlertsRequest>;
export interface ListClustersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface ListEventBridgeRuleTemplateGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
  SignalMapIdentifier?: string;
}
export const ListEventBridgeRuleTemplateGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/eventbridge-rule-template-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventBridgeRuleTemplateGroupsRequest",
}) as any as S.Schema<ListEventBridgeRuleTemplateGroupsRequest>;
export interface ListEventBridgeRuleTemplatesRequest {
  GroupIdentifier?: string;
  MaxResults?: number;
  NextToken?: string;
  SignalMapIdentifier?: string;
}
export const ListEventBridgeRuleTemplatesRequest = S.suspend(() =>
  S.Struct({
    GroupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/eventbridge-rule-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventBridgeRuleTemplatesRequest",
}) as any as S.Schema<ListEventBridgeRuleTemplatesRequest>;
export interface ListInputDevicesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInputDevicesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputDevices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputDevicesRequest",
}) as any as S.Schema<ListInputDevicesRequest>;
export interface ListInputDeviceTransfersRequest {
  MaxResults?: number;
  NextToken?: string;
  TransferType?: string;
}
export const ListInputDeviceTransfersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TransferType: S.optional(S.String).pipe(T.HttpQuery("transferType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputDeviceTransfers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputDeviceTransfersRequest",
}) as any as S.Schema<ListInputDeviceTransfersRequest>;
export interface ListInputsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInputsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputsRequest",
}) as any as S.Schema<ListInputsRequest>;
export interface ListInputSecurityGroupsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInputSecurityGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/inputSecurityGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInputSecurityGroupsRequest",
}) as any as S.Schema<ListInputSecurityGroupsRequest>;
export interface ListMultiplexAlertsRequest {
  MaxResults?: number;
  MultiplexId: string;
  NextToken?: string;
  StateFilter?: string;
}
export const ListMultiplexAlertsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/multiplexes/{MultiplexId}/alerts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultiplexAlertsRequest",
}) as any as S.Schema<ListMultiplexAlertsRequest>;
export interface ListMultiplexesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListMultiplexesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/multiplexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultiplexesRequest",
}) as any as S.Schema<ListMultiplexesRequest>;
export interface ListMultiplexProgramsRequest {
  MaxResults?: number;
  MultiplexId: string;
  NextToken?: string;
}
export const ListMultiplexProgramsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/prod/multiplexes/{MultiplexId}/programs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultiplexProgramsRequest",
}) as any as S.Schema<ListMultiplexProgramsRequest>;
export interface ListNetworksRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListNetworksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworksRequest",
}) as any as S.Schema<ListNetworksRequest>;
export interface ListNodesRequest {
  ClusterId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListNodesRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesRequest",
}) as any as S.Schema<ListNodesRequest>;
export interface ListOfferingsRequest {
  ChannelClass?: string;
  ChannelConfiguration?: string;
  Codec?: string;
  Duration?: string;
  MaxResults?: number;
  MaximumBitrate?: string;
  MaximumFramerate?: string;
  NextToken?: string;
  Resolution?: string;
  ResourceType?: string;
  SpecialFeature?: string;
  VideoQuality?: string;
}
export const ListOfferingsRequest = S.suspend(() =>
  S.Struct({
    ChannelClass: S.optional(S.String).pipe(T.HttpQuery("channelClass")),
    ChannelConfiguration: S.optional(S.String).pipe(
      T.HttpQuery("channelConfiguration"),
    ),
    Codec: S.optional(S.String).pipe(T.HttpQuery("codec")),
    Duration: S.optional(S.String).pipe(T.HttpQuery("duration")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MaximumBitrate: S.optional(S.String).pipe(T.HttpQuery("maximumBitrate")),
    MaximumFramerate: S.optional(S.String).pipe(
      T.HttpQuery("maximumFramerate"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Resolution: S.optional(S.String).pipe(T.HttpQuery("resolution")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    SpecialFeature: S.optional(S.String).pipe(T.HttpQuery("specialFeature")),
    VideoQuality: S.optional(S.String).pipe(T.HttpQuery("videoQuality")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/offerings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOfferingsRequest",
}) as any as S.Schema<ListOfferingsRequest>;
export interface ListReservationsRequest {
  ChannelClass?: string;
  Codec?: string;
  MaxResults?: number;
  MaximumBitrate?: string;
  MaximumFramerate?: string;
  NextToken?: string;
  Resolution?: string;
  ResourceType?: string;
  SpecialFeature?: string;
  VideoQuality?: string;
}
export const ListReservationsRequest = S.suspend(() =>
  S.Struct({
    ChannelClass: S.optional(S.String).pipe(T.HttpQuery("channelClass")),
    Codec: S.optional(S.String).pipe(T.HttpQuery("codec")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MaximumBitrate: S.optional(S.String).pipe(T.HttpQuery("maximumBitrate")),
    MaximumFramerate: S.optional(S.String).pipe(
      T.HttpQuery("maximumFramerate"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Resolution: S.optional(S.String).pipe(T.HttpQuery("resolution")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    SpecialFeature: S.optional(S.String).pipe(T.HttpQuery("specialFeature")),
    VideoQuality: S.optional(S.String).pipe(T.HttpQuery("videoQuality")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/reservations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReservationsRequest",
}) as any as S.Schema<ListReservationsRequest>;
export interface ListSdiSourcesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListSdiSourcesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/sdiSources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSdiSourcesRequest",
}) as any as S.Schema<ListSdiSourcesRequest>;
export interface ListSignalMapsRequest {
  CloudWatchAlarmTemplateGroupIdentifier?: string;
  EventBridgeRuleTemplateGroupIdentifier?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSignalMapsRequest = S.suspend(() =>
  S.Struct({
    CloudWatchAlarmTemplateGroupIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("cloudWatchAlarmTemplateGroupIdentifier"),
    ),
    EventBridgeRuleTemplateGroupIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("eventBridgeRuleTemplateGroupIdentifier"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/signal-maps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSignalMapsRequest",
}) as any as S.Schema<ListSignalMapsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prod/tags/{ResourceArn}" }),
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
export interface RebootInputDeviceRequest {
  Force?: RebootInputDeviceForce;
  InputDeviceId: string;
}
export const RebootInputDeviceRequest = S.suspend(() =>
  S.Struct({
    Force: S.optional(RebootInputDeviceForce).pipe(T.JsonName("force")),
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/reboot",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootInputDeviceRequest",
}) as any as S.Schema<RebootInputDeviceRequest>;
export interface RebootInputDeviceResponse {}
export const RebootInputDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RebootInputDeviceResponse",
}) as any as S.Schema<RebootInputDeviceResponse>;
export interface RejectInputDeviceTransferRequest {
  InputDeviceId: string;
}
export const RejectInputDeviceTransferRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/reject",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectInputDeviceTransferRequest",
}) as any as S.Schema<RejectInputDeviceTransferRequest>;
export interface RejectInputDeviceTransferResponse {}
export const RejectInputDeviceTransferResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectInputDeviceTransferResponse",
}) as any as S.Schema<RejectInputDeviceTransferResponse>;
export interface RestartChannelPipelinesRequest {
  ChannelId: string;
  PipelineIds?: ChannelPipelineIdToRestart[];
}
export const RestartChannelPipelinesRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    PipelineIds: S.optional(__listOfChannelPipelineIdToRestart).pipe(
      T.JsonName("pipelineIds"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/channels/{ChannelId}/restartChannelPipelines",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestartChannelPipelinesRequest",
}) as any as S.Schema<RestartChannelPipelinesRequest>;
export interface StartChannelRequest {
  ChannelId: string;
}
export const StartChannelRequest = S.suspend(() =>
  S.Struct({ ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/channels/{ChannelId}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartChannelRequest",
}) as any as S.Schema<StartChannelRequest>;
export interface StartDeleteMonitorDeploymentRequest {
  Identifier: string;
}
export const StartDeleteMonitorDeploymentRequest = S.suspend(() =>
  S.Struct({ Identifier: S.String.pipe(T.HttpLabel("Identifier")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/prod/signal-maps/{Identifier}/monitor-deployment",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartDeleteMonitorDeploymentRequest",
}) as any as S.Schema<StartDeleteMonitorDeploymentRequest>;
export interface StartInputDeviceRequest {
  InputDeviceId: string;
}
export const StartInputDeviceRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInputDeviceRequest",
}) as any as S.Schema<StartInputDeviceRequest>;
export interface StartInputDeviceResponse {}
export const StartInputDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartInputDeviceResponse",
}) as any as S.Schema<StartInputDeviceResponse>;
export interface StartInputDeviceMaintenanceWindowRequest {
  InputDeviceId: string;
}
export const StartInputDeviceMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/startInputDeviceMaintenanceWindow",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInputDeviceMaintenanceWindowRequest",
}) as any as S.Schema<StartInputDeviceMaintenanceWindowRequest>;
export interface StartInputDeviceMaintenanceWindowResponse {}
export const StartInputDeviceMaintenanceWindowResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartInputDeviceMaintenanceWindowResponse",
}) as any as S.Schema<StartInputDeviceMaintenanceWindowResponse>;
export interface StartMonitorDeploymentRequest {
  DryRun?: boolean;
  Identifier: string;
}
export const StartMonitorDeploymentRequest = S.suspend(() =>
  S.Struct({
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/signal-maps/{Identifier}/monitor-deployment",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMonitorDeploymentRequest",
}) as any as S.Schema<StartMonitorDeploymentRequest>;
export interface StartMultiplexRequest {
  MultiplexId: string;
}
export const StartMultiplexRequest = S.suspend(() =>
  S.Struct({ MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/multiplexes/{MultiplexId}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMultiplexRequest",
}) as any as S.Schema<StartMultiplexRequest>;
export interface StartUpdateSignalMapRequest {
  CloudWatchAlarmTemplateGroupIdentifiers?: string[];
  Description?: string;
  DiscoveryEntryPointArn?: string;
  EventBridgeRuleTemplateGroupIdentifiers?: string[];
  ForceRediscovery?: boolean;
  Identifier: string;
  Name?: string;
}
export const StartUpdateSignalMapRequest = S.suspend(() =>
  S.Struct({
    CloudWatchAlarmTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIdentifiers")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    EventBridgeRuleTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIdentifiers")),
    ForceRediscovery: S.optional(S.Boolean).pipe(
      T.JsonName("forceRediscovery"),
    ),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/prod/signal-maps/{Identifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartUpdateSignalMapRequest",
}) as any as S.Schema<StartUpdateSignalMapRequest>;
export interface StopChannelRequest {
  ChannelId: string;
}
export const StopChannelRequest = S.suspend(() =>
  S.Struct({ ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/channels/{ChannelId}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopChannelRequest",
}) as any as S.Schema<StopChannelRequest>;
export interface StopInputDeviceRequest {
  InputDeviceId: string;
}
export const StopInputDeviceRequest = S.suspend(() =>
  S.Struct({ InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopInputDeviceRequest",
}) as any as S.Schema<StopInputDeviceRequest>;
export interface StopInputDeviceResponse {}
export const StopInputDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopInputDeviceResponse",
}) as any as S.Schema<StopInputDeviceResponse>;
export interface StopMultiplexRequest {
  MultiplexId: string;
}
export const StopMultiplexRequest = S.suspend(() =>
  S.Struct({ MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/multiplexes/{MultiplexId}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopMultiplexRequest",
}) as any as S.Schema<StopMultiplexRequest>;
export interface TransferInputDeviceRequest {
  InputDeviceId: string;
  TargetCustomerId?: string;
  TargetRegion?: string;
  TransferMessage?: string;
}
export const TransferInputDeviceRequest = S.suspend(() =>
  S.Struct({
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    TargetCustomerId: S.optional(S.String).pipe(T.JsonName("targetCustomerId")),
    TargetRegion: S.optional(S.String).pipe(T.JsonName("targetRegion")),
    TransferMessage: S.optional(S.String).pipe(T.JsonName("transferMessage")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/inputDevices/{InputDeviceId}/transfer",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TransferInputDeviceRequest",
}) as any as S.Schema<TransferInputDeviceRequest>;
export interface TransferInputDeviceResponse {}
export const TransferInputDeviceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TransferInputDeviceResponse",
}) as any as S.Schema<TransferInputDeviceResponse>;
export interface AccountConfiguration {
  KmsKeyId?: string;
}
export const AccountConfiguration = S.suspend(() =>
  S.Struct({ KmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")) }),
).annotations({
  identifier: "AccountConfiguration",
}) as any as S.Schema<AccountConfiguration>;
export interface UpdateAccountConfigurationRequest {
  AccountConfiguration?: AccountConfiguration;
}
export const UpdateAccountConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountConfiguration: S.optional(AccountConfiguration)
      .pipe(T.JsonName("accountConfiguration"))
      .annotations({ identifier: "AccountConfiguration" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/accountConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountConfigurationRequest",
}) as any as S.Schema<UpdateAccountConfigurationRequest>;
export interface MediaPackageOutputDestinationSettings {
  ChannelId?: string;
  ChannelGroup?: string;
  ChannelName?: string;
  ChannelEndpointId?: string;
  MediaPackageRegionName?: string;
}
export const MediaPackageOutputDestinationSettings = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    ChannelGroup: S.optional(S.String).pipe(T.JsonName("channelGroup")),
    ChannelName: S.optional(S.String).pipe(T.JsonName("channelName")),
    ChannelEndpointId: S.optional(S.String).pipe(
      T.JsonName("channelEndpointId"),
    ),
    MediaPackageRegionName: S.optional(S.String).pipe(
      T.JsonName("mediaPackageRegionName"),
    ),
  }),
).annotations({
  identifier: "MediaPackageOutputDestinationSettings",
}) as any as S.Schema<MediaPackageOutputDestinationSettings>;
export type __listOfMediaPackageOutputDestinationSettings =
  MediaPackageOutputDestinationSettings[];
export const __listOfMediaPackageOutputDestinationSettings = S.Array(
  MediaPackageOutputDestinationSettings,
);
export interface MultiplexProgramChannelDestinationSettings {
  MultiplexId?: string;
  ProgramName?: string;
}
export const MultiplexProgramChannelDestinationSettings = S.suspend(() =>
  S.Struct({
    MultiplexId: S.optional(S.String).pipe(T.JsonName("multiplexId")),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  }),
).annotations({
  identifier: "MultiplexProgramChannelDestinationSettings",
}) as any as S.Schema<MultiplexProgramChannelDestinationSettings>;
export interface OutputDestinationSettings {
  PasswordParam?: string;
  StreamName?: string;
  Url?: string;
  Username?: string;
}
export const OutputDestinationSettings = S.suspend(() =>
  S.Struct({
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({
  identifier: "OutputDestinationSettings",
}) as any as S.Schema<OutputDestinationSettings>;
export type __listOfOutputDestinationSettings = OutputDestinationSettings[];
export const __listOfOutputDestinationSettings = S.Array(
  OutputDestinationSettings,
);
export interface SrtOutputDestinationSettings {
  EncryptionPassphraseSecretArn?: string;
  StreamId?: string;
  Url?: string;
}
export const SrtOutputDestinationSettings = S.suspend(() =>
  S.Struct({
    EncryptionPassphraseSecretArn: S.optional(S.String).pipe(
      T.JsonName("encryptionPassphraseSecretArn"),
    ),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "SrtOutputDestinationSettings",
}) as any as S.Schema<SrtOutputDestinationSettings>;
export type __listOfSrtOutputDestinationSettings =
  SrtOutputDestinationSettings[];
export const __listOfSrtOutputDestinationSettings = S.Array(
  SrtOutputDestinationSettings,
);
export interface OutputDestination {
  Id?: string;
  MediaPackageSettings?: MediaPackageOutputDestinationSettings[];
  MultiplexSettings?: MultiplexProgramChannelDestinationSettings;
  Settings?: OutputDestinationSettings[];
  SrtSettings?: SrtOutputDestinationSettings[];
  LogicalInterfaceNames?: string[];
}
export const OutputDestination = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MediaPackageSettings: S.optional(
      __listOfMediaPackageOutputDestinationSettings,
    ).pipe(T.JsonName("mediaPackageSettings")),
    MultiplexSettings: S.optional(MultiplexProgramChannelDestinationSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({
        identifier: "MultiplexProgramChannelDestinationSettings",
      }),
    Settings: S.optional(__listOfOutputDestinationSettings).pipe(
      T.JsonName("settings"),
    ),
    SrtSettings: S.optional(__listOfSrtOutputDestinationSettings).pipe(
      T.JsonName("srtSettings"),
    ),
    LogicalInterfaceNames: S.optional(__listOf__string).pipe(
      T.JsonName("logicalInterfaceNames"),
    ),
  }),
).annotations({
  identifier: "OutputDestination",
}) as any as S.Schema<OutputDestination>;
export type __listOfOutputDestination = OutputDestination[];
export const __listOfOutputDestination = S.Array(OutputDestination);
export interface UpdateChannelClassRequest {
  ChannelClass?: ChannelClass;
  ChannelId: string;
  Destinations?: OutputDestination[];
}
export const UpdateChannelClassRequest = S.suspend(() =>
  S.Struct({
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}/channelClass" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelClassRequest",
}) as any as S.Schema<UpdateChannelClassRequest>;
export interface UpdateChannelPlacementGroupRequest {
  ChannelPlacementGroupId: string;
  ClusterId: string;
  Name?: string;
  Nodes?: string[];
}
export const UpdateChannelPlacementGroupRequest = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelPlacementGroupRequest",
}) as any as S.Schema<UpdateChannelPlacementGroupRequest>;
export interface UpdateCloudWatchAlarmTemplateRequest {
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupIdentifier?: string;
  Identifier: string;
  MetricName?: string;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
}
export const UpdateCloudWatchAlarmTemplateRequest = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCloudWatchAlarmTemplateRequest",
}) as any as S.Schema<UpdateCloudWatchAlarmTemplateRequest>;
export interface UpdateCloudWatchAlarmTemplateGroupRequest {
  Description?: string;
  Identifier: string;
}
export const UpdateCloudWatchAlarmTemplateGroupRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCloudWatchAlarmTemplateGroupRequest",
}) as any as S.Schema<UpdateCloudWatchAlarmTemplateGroupRequest>;
export interface EventBridgeRuleTemplateTarget {
  Arn?: string;
}
export const EventBridgeRuleTemplateTarget = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String).pipe(T.JsonName("arn")) }),
).annotations({
  identifier: "EventBridgeRuleTemplateTarget",
}) as any as S.Schema<EventBridgeRuleTemplateTarget>;
export type __listOfEventBridgeRuleTemplateTarget =
  EventBridgeRuleTemplateTarget[];
export const __listOfEventBridgeRuleTemplateTarget = S.Array(
  EventBridgeRuleTemplateTarget,
);
export interface UpdateEventBridgeRuleTemplateRequest {
  Description?: string;
  EventTargets?: EventBridgeRuleTemplateTarget[];
  EventType?: EventBridgeRuleTemplateEventType;
  GroupIdentifier?: string;
  Identifier: string;
  Name?: string;
}
export const UpdateEventBridgeRuleTemplateRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/prod/eventbridge-rule-templates/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventBridgeRuleTemplateRequest",
}) as any as S.Schema<UpdateEventBridgeRuleTemplateRequest>;
export interface UpdateEventBridgeRuleTemplateGroupRequest {
  Description?: string;
  Identifier: string;
}
export const UpdateEventBridgeRuleTemplateGroupRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventBridgeRuleTemplateGroupRequest",
}) as any as S.Schema<UpdateEventBridgeRuleTemplateGroupRequest>;
export interface InputWhitelistRuleCidr {
  Cidr?: string;
}
export const InputWhitelistRuleCidr = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }),
).annotations({
  identifier: "InputWhitelistRuleCidr",
}) as any as S.Schema<InputWhitelistRuleCidr>;
export type __listOfInputWhitelistRuleCidr = InputWhitelistRuleCidr[];
export const __listOfInputWhitelistRuleCidr = S.Array(InputWhitelistRuleCidr);
export interface UpdateInputSecurityGroupRequest {
  InputSecurityGroupId: string;
  Tags?: { [key: string]: string | undefined };
  WhitelistRules?: InputWhitelistRuleCidr[];
}
export const UpdateInputSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRuleCidr).pipe(
      T.JsonName("whitelistRules"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInputSecurityGroupRequest",
}) as any as S.Schema<UpdateInputSecurityGroupRequest>;
export type PreferredChannelPipeline =
  | "CURRENTLY_ACTIVE"
  | "PIPELINE_0"
  | "PIPELINE_1"
  | (string & {});
export const PreferredChannelPipeline = S.String;
export interface MultiplexProgramServiceDescriptor {
  ProviderName?: string;
  ServiceName?: string;
}
export const MultiplexProgramServiceDescriptor = S.suspend(() =>
  S.Struct({
    ProviderName: S.optional(S.String).pipe(T.JsonName("providerName")),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  }),
).annotations({
  identifier: "MultiplexProgramServiceDescriptor",
}) as any as S.Schema<MultiplexProgramServiceDescriptor>;
export interface MultiplexStatmuxVideoSettings {
  MaximumBitrate?: number;
  MinimumBitrate?: number;
  Priority?: number;
}
export const MultiplexStatmuxVideoSettings = S.suspend(() =>
  S.Struct({
    MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
    MinimumBitrate: S.optional(S.Number).pipe(T.JsonName("minimumBitrate")),
    Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
  }),
).annotations({
  identifier: "MultiplexStatmuxVideoSettings",
}) as any as S.Schema<MultiplexStatmuxVideoSettings>;
export interface MultiplexVideoSettings {
  ConstantBitrate?: number;
  StatmuxSettings?: MultiplexStatmuxVideoSettings;
}
export const MultiplexVideoSettings = S.suspend(() =>
  S.Struct({
    ConstantBitrate: S.optional(S.Number).pipe(T.JsonName("constantBitrate")),
    StatmuxSettings: S.optional(MultiplexStatmuxVideoSettings)
      .pipe(T.JsonName("statmuxSettings"))
      .annotations({ identifier: "MultiplexStatmuxVideoSettings" }),
  }),
).annotations({
  identifier: "MultiplexVideoSettings",
}) as any as S.Schema<MultiplexVideoSettings>;
export interface MultiplexProgramSettings {
  PreferredChannelPipeline?: PreferredChannelPipeline;
  ProgramNumber?: number;
  ServiceDescriptor?: MultiplexProgramServiceDescriptor;
  VideoSettings?: MultiplexVideoSettings;
}
export const MultiplexProgramSettings = S.suspend(() =>
  S.Struct({
    PreferredChannelPipeline: S.optional(PreferredChannelPipeline).pipe(
      T.JsonName("preferredChannelPipeline"),
    ),
    ProgramNumber: S.optional(S.Number).pipe(T.JsonName("programNumber")),
    ServiceDescriptor: S.optional(MultiplexProgramServiceDescriptor)
      .pipe(T.JsonName("serviceDescriptor"))
      .annotations({ identifier: "MultiplexProgramServiceDescriptor" }),
    VideoSettings: S.optional(MultiplexVideoSettings)
      .pipe(T.JsonName("videoSettings"))
      .annotations({ identifier: "MultiplexVideoSettings" }),
  }),
).annotations({
  identifier: "MultiplexProgramSettings",
}) as any as S.Schema<MultiplexProgramSettings>;
export interface UpdateMultiplexProgramRequest {
  MultiplexId: string;
  MultiplexProgramSettings?: MultiplexProgramSettings;
  ProgramName: string;
}
export const UpdateMultiplexProgramRequest = S.suspend(() =>
  S.Struct({
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings)
      .pipe(T.JsonName("multiplexProgramSettings"))
      .annotations({ identifier: "MultiplexProgramSettings" }),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMultiplexProgramRequest",
}) as any as S.Schema<UpdateMultiplexProgramRequest>;
export interface UpdateNodeStateRequest {
  ClusterId: string;
  NodeId: string;
  State?: UpdateNodeStateShape;
}
export const UpdateNodeStateRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    State: S.optional(UpdateNodeStateShape).pipe(T.JsonName("state")),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}/state",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNodeStateRequest",
}) as any as S.Schema<UpdateNodeStateRequest>;
export type ReservationAutomaticRenewal =
  | "DISABLED"
  | "ENABLED"
  | "UNAVAILABLE"
  | (string & {});
export const ReservationAutomaticRenewal = S.String;
export interface RenewalSettings {
  AutomaticRenewal?: ReservationAutomaticRenewal;
  RenewalCount?: number;
}
export const RenewalSettings = S.suspend(() =>
  S.Struct({
    AutomaticRenewal: S.optional(ReservationAutomaticRenewal).pipe(
      T.JsonName("automaticRenewal"),
    ),
    RenewalCount: S.optional(S.Number).pipe(T.JsonName("renewalCount")),
  }),
).annotations({
  identifier: "RenewalSettings",
}) as any as S.Schema<RenewalSettings>;
export interface UpdateReservationRequest {
  Name?: string;
  RenewalSettings?: RenewalSettings;
  ReservationId: string;
}
export const UpdateReservationRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RenewalSettings: S.optional(RenewalSettings)
      .pipe(T.JsonName("renewalSettings"))
      .annotations({ identifier: "RenewalSettings" }),
    ReservationId: S.String.pipe(T.HttpLabel("ReservationId")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/reservations/{ReservationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReservationRequest",
}) as any as S.Schema<UpdateReservationRequest>;
export interface UpdateSdiSourceRequest {
  Mode?: SdiSourceMode;
  Name?: string;
  SdiSourceId: string;
  Type?: SdiSourceType;
}
export const UpdateSdiSourceRequest = S.suspend(() =>
  S.Struct({
    Mode: S.optional(SdiSourceMode).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")),
    Type: S.optional(SdiSourceType).pipe(T.JsonName("type")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/sdiSources/{SdiSourceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSdiSourceRequest",
}) as any as S.Schema<UpdateSdiSourceRequest>;
export type CdiInputResolution = "SD" | "HD" | "FHD" | "UHD" | (string & {});
export const CdiInputResolution = S.String;
export type InputCodec = "MPEG2" | "AVC" | "HEVC" | (string & {});
export const InputCodec = S.String;
export type InputMaximumBitrate =
  | "MAX_10_MBPS"
  | "MAX_20_MBPS"
  | "MAX_50_MBPS"
  | (string & {});
export const InputMaximumBitrate = S.String;
export type InputResolution = "SD" | "HD" | "UHD" | (string & {});
export const InputResolution = S.String;
export type MaintenanceDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"
  | (string & {});
export const MaintenanceDay = S.String;
export type RouterEncryptionType =
  | "AUTOMATIC"
  | "SECRETS_MANAGER"
  | (string & {});
export const RouterEncryptionType = S.String;
export type NetworkInterfaceMode = "NAT" | "BRIDGE" | (string & {});
export const NetworkInterfaceMode = S.String;
export type InputDeviceConfiguredInput =
  | "AUTO"
  | "HDMI"
  | "SDI"
  | (string & {});
export const InputDeviceConfiguredInput = S.String;
export type InputDeviceCodec = "HEVC" | "AVC" | (string & {});
export const InputDeviceCodec = S.String;
export interface BatchScheduleActionDeleteRequest {
  ActionNames?: string[];
}
export const BatchScheduleActionDeleteRequest = S.suspend(() =>
  S.Struct({
    ActionNames: S.optional(__listOf__string).pipe(T.JsonName("actionNames")),
  }),
).annotations({
  identifier: "BatchScheduleActionDeleteRequest",
}) as any as S.Schema<BatchScheduleActionDeleteRequest>;
export interface CdiInputSpecification {
  Resolution?: CdiInputResolution;
}
export const CdiInputSpecification = S.suspend(() =>
  S.Struct({
    Resolution: S.optional(CdiInputResolution).pipe(T.JsonName("resolution")),
  }),
).annotations({
  identifier: "CdiInputSpecification",
}) as any as S.Schema<CdiInputSpecification>;
export interface InputSpecification {
  Codec?: InputCodec;
  MaximumBitrate?: InputMaximumBitrate;
  Resolution?: InputResolution;
}
export const InputSpecification = S.suspend(() =>
  S.Struct({
    Codec: S.optional(InputCodec).pipe(T.JsonName("codec")),
    MaximumBitrate: S.optional(InputMaximumBitrate).pipe(
      T.JsonName("maximumBitrate"),
    ),
    Resolution: S.optional(InputResolution).pipe(T.JsonName("resolution")),
  }),
).annotations({
  identifier: "InputSpecification",
}) as any as S.Schema<InputSpecification>;
export interface MaintenanceCreateSettings {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceStartTime?: string;
}
export const MaintenanceCreateSettings = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceStartTime: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartTime"),
    ),
  }),
).annotations({
  identifier: "MaintenanceCreateSettings",
}) as any as S.Schema<MaintenanceCreateSettings>;
export interface VpcOutputSettings {
  PublicAddressAllocationIds?: string[];
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
}
export const VpcOutputSettings = S.suspend(() =>
  S.Struct({
    PublicAddressAllocationIds: S.optional(__listOf__string).pipe(
      T.JsonName("publicAddressAllocationIds"),
    ),
    SecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
  }),
).annotations({
  identifier: "VpcOutputSettings",
}) as any as S.Schema<VpcOutputSettings>;
export interface AnywhereSettings {
  ChannelPlacementGroupId?: string;
  ClusterId?: string;
}
export const AnywhereSettings = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroupId: S.optional(S.String).pipe(
      T.JsonName("channelPlacementGroupId"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  }),
).annotations({
  identifier: "AnywhereSettings",
}) as any as S.Schema<AnywhereSettings>;
export interface ChannelEngineVersionRequest {
  Version?: string;
}
export const ChannelEngineVersionRequest = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String).pipe(T.JsonName("version")) }),
).annotations({
  identifier: "ChannelEngineVersionRequest",
}) as any as S.Schema<ChannelEngineVersionRequest>;
export type ChannelPlacementGroupState =
  | "UNASSIGNED"
  | "ASSIGNING"
  | "ASSIGNED"
  | "DELETING"
  | "DELETE_FAILED"
  | "DELETED"
  | "UNASSIGNING"
  | (string & {});
export const ChannelPlacementGroupState = S.String;
export interface InputDeviceSettings {
  Id?: string;
}
export const InputDeviceSettings = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String).pipe(T.JsonName("id")) }),
).annotations({
  identifier: "InputDeviceSettings",
}) as any as S.Schema<InputDeviceSettings>;
export type __listOfInputDeviceSettings = InputDeviceSettings[];
export const __listOfInputDeviceSettings = S.Array(InputDeviceSettings);
export interface MediaConnectFlowRequest {
  FlowArn?: string;
}
export const MediaConnectFlowRequest = S.suspend(() =>
  S.Struct({ FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")) }),
).annotations({
  identifier: "MediaConnectFlowRequest",
}) as any as S.Schema<MediaConnectFlowRequest>;
export type __listOfMediaConnectFlowRequest = MediaConnectFlowRequest[];
export const __listOfMediaConnectFlowRequest = S.Array(MediaConnectFlowRequest);
export interface InputSourceRequest {
  PasswordParam?: string;
  Url?: string;
  Username?: string;
}
export const InputSourceRequest = S.suspend(() =>
  S.Struct({
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({
  identifier: "InputSourceRequest",
}) as any as S.Schema<InputSourceRequest>;
export type __listOfInputSourceRequest = InputSourceRequest[];
export const __listOfInputSourceRequest = S.Array(InputSourceRequest);
export interface InputVpcRequest {
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
}
export const InputVpcRequest = S.suspend(() =>
  S.Struct({
    SecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
  }),
).annotations({
  identifier: "InputVpcRequest",
}) as any as S.Schema<InputVpcRequest>;
export interface MultiplexSettings {
  MaximumVideoBufferDelayMilliseconds?: number;
  TransportStreamBitrate?: number;
  TransportStreamId?: number;
  TransportStreamReservedBitrate?: number;
}
export const MultiplexSettings = S.suspend(() =>
  S.Struct({
    MaximumVideoBufferDelayMilliseconds: S.optional(S.Number).pipe(
      T.JsonName("maximumVideoBufferDelayMilliseconds"),
    ),
    TransportStreamBitrate: S.optional(S.Number).pipe(
      T.JsonName("transportStreamBitrate"),
    ),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    TransportStreamReservedBitrate: S.optional(S.Number).pipe(
      T.JsonName("transportStreamReservedBitrate"),
    ),
  }),
).annotations({
  identifier: "MultiplexSettings",
}) as any as S.Schema<MultiplexSettings>;
export interface IpPoolCreateRequest {
  Cidr?: string;
}
export const IpPoolCreateRequest = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }),
).annotations({
  identifier: "IpPoolCreateRequest",
}) as any as S.Schema<IpPoolCreateRequest>;
export type __listOfIpPoolCreateRequest = IpPoolCreateRequest[];
export const __listOfIpPoolCreateRequest = S.Array(IpPoolCreateRequest);
export interface RouteCreateRequest {
  Cidr?: string;
  Gateway?: string;
}
export const RouteCreateRequest = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  }),
).annotations({
  identifier: "RouteCreateRequest",
}) as any as S.Schema<RouteCreateRequest>;
export type __listOfRouteCreateRequest = RouteCreateRequest[];
export const __listOfRouteCreateRequest = S.Array(RouteCreateRequest);
export interface NodeInterfaceMappingCreateRequest {
  LogicalInterfaceName?: string;
  NetworkInterfaceMode?: NetworkInterfaceMode;
  PhysicalInterfaceName?: string;
}
export const NodeInterfaceMappingCreateRequest = S.suspend(() =>
  S.Struct({
    LogicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("logicalInterfaceName"),
    ),
    NetworkInterfaceMode: S.optional(NetworkInterfaceMode).pipe(
      T.JsonName("networkInterfaceMode"),
    ),
    PhysicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("physicalInterfaceName"),
    ),
  }),
).annotations({
  identifier: "NodeInterfaceMappingCreateRequest",
}) as any as S.Schema<NodeInterfaceMappingCreateRequest>;
export type __listOfNodeInterfaceMappingCreateRequest =
  NodeInterfaceMappingCreateRequest[];
export const __listOfNodeInterfaceMappingCreateRequest = S.Array(
  NodeInterfaceMappingCreateRequest,
);
export interface NodeInterfaceMapping {
  LogicalInterfaceName?: string;
  NetworkInterfaceMode?: NetworkInterfaceMode;
  PhysicalInterfaceName?: string;
}
export const NodeInterfaceMapping = S.suspend(() =>
  S.Struct({
    LogicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("logicalInterfaceName"),
    ),
    NetworkInterfaceMode: S.optional(NetworkInterfaceMode).pipe(
      T.JsonName("networkInterfaceMode"),
    ),
    PhysicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("physicalInterfaceName"),
    ),
  }),
).annotations({
  identifier: "NodeInterfaceMapping",
}) as any as S.Schema<NodeInterfaceMapping>;
export type __listOfNodeInterfaceMapping = NodeInterfaceMapping[];
export const __listOfNodeInterfaceMapping = S.Array(NodeInterfaceMapping);
export type __listOf__stringMin7Max11PatternAws097 = string[];
export const __listOf__stringMin7Max11PatternAws097 = S.Array(S.String);
export type SignalMapStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_COMPLETE"
  | "UPDATE_REVERTED"
  | "UPDATE_FAILED"
  | "READY"
  | "NOT_READY"
  | (string & {});
export const SignalMapStatus = S.String;
export type ChannelState =
  | "CREATING"
  | "CREATE_FAILED"
  | "IDLE"
  | "STARTING"
  | "RUNNING"
  | "RECOVERING"
  | "STOPPING"
  | "DELETING"
  | "DELETED"
  | "UPDATING"
  | "UPDATE_FAILED"
  | (string & {});
export const ChannelState = S.String;
export type ClusterState =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETING"
  | "DELETE_FAILED"
  | "DELETED"
  | (string & {});
export const ClusterState = S.String;
export type MultiplexState =
  | "CREATING"
  | "CREATE_FAILED"
  | "IDLE"
  | "STARTING"
  | "RUNNING"
  | "RECOVERING"
  | "STOPPING"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const MultiplexState = S.String;
export type NetworkState =
  | "CREATING"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETING"
  | "IDLE"
  | "IN_USE"
  | "UPDATING"
  | "DELETE_FAILED"
  | "DELETED"
  | (string & {});
export const NetworkState = S.String;
export type NodeConnectionState = "CONNECTED" | "DISCONNECTED" | (string & {});
export const NodeConnectionState = S.String;
export type NodeState =
  | "CREATED"
  | "REGISTERING"
  | "READY_TO_ACTIVATE"
  | "REGISTRATION_FAILED"
  | "ACTIVATION_FAILED"
  | "ACTIVE"
  | "READY"
  | "IN_USE"
  | "DEREGISTERING"
  | "DRAINING"
  | "DEREGISTRATION_FAILED"
  | "DEREGISTERED"
  | (string & {});
export const NodeState = S.String;
export type OfferingDurationUnits = "MONTHS" | (string & {});
export const OfferingDurationUnits = S.String;
export type OfferingType = "NO_UPFRONT" | (string & {});
export const OfferingType = S.String;
export type ReservationState =
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELED"
  | "DELETED"
  | (string & {});
export const ReservationState = S.String;
export type InputClass = "STANDARD" | "SINGLE_PIPELINE" | (string & {});
export const InputClass = S.String;
export type InputSourceType = "STATIC" | "DYNAMIC" | (string & {});
export const InputSourceType = S.String;
export type InputState =
  | "CREATING"
  | "DETACHED"
  | "ATTACHED"
  | "DELETING"
  | "DELETED"
  | (string & {});
export const InputState = S.String;
export type InputDeviceConnectionState =
  | "DISCONNECTED"
  | "CONNECTED"
  | (string & {});
export const InputDeviceConnectionState = S.String;
export type DeviceSettingsSyncState = "SYNCED" | "SYNCING" | (string & {});
export const DeviceSettingsSyncState = S.String;
export type DeviceUpdateStatus =
  | "UP_TO_DATE"
  | "NOT_UP_TO_DATE"
  | "UPDATING"
  | (string & {});
export const DeviceUpdateStatus = S.String;
export type InputDeviceType = "HD" | "UHD" | (string & {});
export const InputDeviceType = S.String;
export type InputDeviceOutputType =
  | "NONE"
  | "MEDIALIVE_INPUT"
  | "MEDIACONNECT_FLOW"
  | (string & {});
export const InputDeviceOutputType = S.String;
export type ContentType = "image/jpeg" | (string & {});
export const ContentType = S.String;
export type InputSecurityGroupState =
  | "IDLE"
  | "IN_USE"
  | "UPDATING"
  | "DELETED"
  | (string & {});
export const InputSecurityGroupState = S.String;
export interface InputDestinationVpc {
  AvailabilityZone?: string;
  NetworkInterfaceId?: string;
}
export const InputDestinationVpc = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    NetworkInterfaceId: S.optional(S.String).pipe(
      T.JsonName("networkInterfaceId"),
    ),
  }),
).annotations({
  identifier: "InputDestinationVpc",
}) as any as S.Schema<InputDestinationVpc>;
export interface InputDestinationRoute {
  Cidr?: string;
  Gateway?: string;
}
export const InputDestinationRoute = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  }),
).annotations({
  identifier: "InputDestinationRoute",
}) as any as S.Schema<InputDestinationRoute>;
export type __listOfInputDestinationRoute = InputDestinationRoute[];
export const __listOfInputDestinationRoute = S.Array(InputDestinationRoute);
export interface InputDestination {
  Ip?: string;
  Port?: string;
  Url?: string;
  Vpc?: InputDestinationVpc;
  Network?: string;
  NetworkRoutes?: InputDestinationRoute[];
}
export const InputDestination = S.suspend(() =>
  S.Struct({
    Ip: S.optional(S.String).pipe(T.JsonName("ip")),
    Port: S.optional(S.String).pipe(T.JsonName("port")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Vpc: S.optional(InputDestinationVpc)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "InputDestinationVpc" }),
    Network: S.optional(S.String).pipe(T.JsonName("network")),
    NetworkRoutes: S.optional(__listOfInputDestinationRoute).pipe(
      T.JsonName("networkRoutes"),
    ),
  }),
).annotations({
  identifier: "InputDestination",
}) as any as S.Schema<InputDestination>;
export type __listOfInputDestination = InputDestination[];
export const __listOfInputDestination = S.Array(InputDestination);
export interface MediaConnectFlow {
  FlowArn?: string;
}
export const MediaConnectFlow = S.suspend(() =>
  S.Struct({ FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")) }),
).annotations({
  identifier: "MediaConnectFlow",
}) as any as S.Schema<MediaConnectFlow>;
export type __listOfMediaConnectFlow = MediaConnectFlow[];
export const __listOfMediaConnectFlow = S.Array(MediaConnectFlow);
export interface InputSource {
  PasswordParam?: string;
  Url?: string;
  Username?: string;
}
export const InputSource = S.suspend(() =>
  S.Struct({
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({ identifier: "InputSource" }) as any as S.Schema<InputSource>;
export type __listOfInputSource = InputSource[];
export const __listOfInputSource = S.Array(InputSource);
export type Algorithm = "AES128" | "AES192" | "AES256" | (string & {});
export const Algorithm = S.String;
export interface SrtCallerDecryption {
  Algorithm?: Algorithm;
  PassphraseSecretArn?: string;
}
export const SrtCallerDecryption = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(Algorithm).pipe(T.JsonName("algorithm")),
    PassphraseSecretArn: S.optional(S.String).pipe(
      T.JsonName("passphraseSecretArn"),
    ),
  }),
).annotations({
  identifier: "SrtCallerDecryption",
}) as any as S.Schema<SrtCallerDecryption>;
export interface SrtCallerSource {
  Decryption?: SrtCallerDecryption;
  MinimumLatency?: number;
  SrtListenerAddress?: string;
  SrtListenerPort?: string;
  StreamId?: string;
}
export const SrtCallerSource = S.suspend(() =>
  S.Struct({
    Decryption: S.optional(SrtCallerDecryption)
      .pipe(T.JsonName("decryption"))
      .annotations({ identifier: "SrtCallerDecryption" }),
    MinimumLatency: S.optional(S.Number).pipe(T.JsonName("minimumLatency")),
    SrtListenerAddress: S.optional(S.String).pipe(
      T.JsonName("srtListenerAddress"),
    ),
    SrtListenerPort: S.optional(S.String).pipe(T.JsonName("srtListenerPort")),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  }),
).annotations({
  identifier: "SrtCallerSource",
}) as any as S.Schema<SrtCallerSource>;
export type __listOfSrtCallerSource = SrtCallerSource[];
export const __listOfSrtCallerSource = S.Array(SrtCallerSource);
export interface SrtSettings {
  SrtCallerSources?: SrtCallerSource[];
}
export const SrtSettings = S.suspend(() =>
  S.Struct({
    SrtCallerSources: S.optional(__listOfSrtCallerSource).pipe(
      T.JsonName("srtCallerSources"),
    ),
  }),
).annotations({ identifier: "SrtSettings" }) as any as S.Schema<SrtSettings>;
export interface MulticastSource {
  SourceIp?: string;
  Url?: string;
}
export const MulticastSource = S.suspend(() =>
  S.Struct({
    SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "MulticastSource",
}) as any as S.Schema<MulticastSource>;
export type __listOfMulticastSource = MulticastSource[];
export const __listOfMulticastSource = S.Array(MulticastSource);
export interface MulticastSettings {
  Sources?: MulticastSource[];
}
export const MulticastSettings = S.suspend(() =>
  S.Struct({
    Sources: S.optional(__listOfMulticastSource).pipe(T.JsonName("sources")),
  }),
).annotations({
  identifier: "MulticastSettings",
}) as any as S.Schema<MulticastSettings>;
export interface InputSdpLocation {
  MediaIndex?: number;
  SdpUrl?: string;
}
export const InputSdpLocation = S.suspend(() =>
  S.Struct({
    MediaIndex: S.optional(S.Number).pipe(T.JsonName("mediaIndex")),
    SdpUrl: S.optional(S.String).pipe(T.JsonName("sdpUrl")),
  }),
).annotations({
  identifier: "InputSdpLocation",
}) as any as S.Schema<InputSdpLocation>;
export type __listOfInputSdpLocation = InputSdpLocation[];
export const __listOfInputSdpLocation = S.Array(InputSdpLocation);
export interface Smpte2110ReceiverGroupSdpSettings {
  AncillarySdps?: InputSdpLocation[];
  AudioSdps?: InputSdpLocation[];
  VideoSdp?: InputSdpLocation;
}
export const Smpte2110ReceiverGroupSdpSettings = S.suspend(() =>
  S.Struct({
    AncillarySdps: S.optional(__listOfInputSdpLocation).pipe(
      T.JsonName("ancillarySdps"),
    ),
    AudioSdps: S.optional(__listOfInputSdpLocation).pipe(
      T.JsonName("audioSdps"),
    ),
    VideoSdp: S.optional(InputSdpLocation)
      .pipe(T.JsonName("videoSdp"))
      .annotations({ identifier: "InputSdpLocation" }),
  }),
).annotations({
  identifier: "Smpte2110ReceiverGroupSdpSettings",
}) as any as S.Schema<Smpte2110ReceiverGroupSdpSettings>;
export interface Smpte2110ReceiverGroup {
  SdpSettings?: Smpte2110ReceiverGroupSdpSettings;
}
export const Smpte2110ReceiverGroup = S.suspend(() =>
  S.Struct({
    SdpSettings: S.optional(Smpte2110ReceiverGroupSdpSettings)
      .pipe(T.JsonName("sdpSettings"))
      .annotations({ identifier: "Smpte2110ReceiverGroupSdpSettings" }),
  }),
).annotations({
  identifier: "Smpte2110ReceiverGroup",
}) as any as S.Schema<Smpte2110ReceiverGroup>;
export type __listOfSmpte2110ReceiverGroup = Smpte2110ReceiverGroup[];
export const __listOfSmpte2110ReceiverGroup = S.Array(Smpte2110ReceiverGroup);
export interface Smpte2110ReceiverGroupSettings {
  Smpte2110ReceiverGroups?: Smpte2110ReceiverGroup[];
}
export const Smpte2110ReceiverGroupSettings = S.suspend(() =>
  S.Struct({
    Smpte2110ReceiverGroups: S.optional(__listOfSmpte2110ReceiverGroup).pipe(
      T.JsonName("smpte2110ReceiverGroups"),
    ),
  }),
).annotations({
  identifier: "Smpte2110ReceiverGroupSettings",
}) as any as S.Schema<Smpte2110ReceiverGroupSettings>;
export interface RouterDestination {
  AvailabilityZoneName?: string;
  RouterOutputArn?: string;
}
export const RouterDestination = S.suspend(() =>
  S.Struct({
    AvailabilityZoneName: S.optional(S.String).pipe(
      T.JsonName("availabilityZoneName"),
    ),
    RouterOutputArn: S.optional(S.String).pipe(T.JsonName("routerOutputArn")),
  }),
).annotations({
  identifier: "RouterDestination",
}) as any as S.Schema<RouterDestination>;
export type __listOfRouterDestination = RouterDestination[];
export const __listOfRouterDestination = S.Array(RouterDestination);
export interface RouterInputSettings {
  Destinations?: RouterDestination[];
  EncryptionType?: RouterEncryptionType;
  SecretArn?: string;
}
export const RouterInputSettings = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(__listOfRouterDestination).pipe(
      T.JsonName("destinations"),
    ),
    EncryptionType: S.optional(RouterEncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  }),
).annotations({
  identifier: "RouterInputSettings",
}) as any as S.Schema<RouterInputSettings>;
export interface Input {
  Arn?: string;
  AttachedChannels?: string[];
  Destinations?: InputDestination[];
  Id?: string;
  InputClass?: InputClass;
  InputDevices?: InputDeviceSettings[];
  InputPartnerIds?: string[];
  InputSourceType?: InputSourceType;
  MediaConnectFlows?: MediaConnectFlow[];
  Name?: string;
  RoleArn?: string;
  SecurityGroups?: string[];
  Sources?: InputSource[];
  State?: InputState;
  Tags?: { [key: string]: string | undefined };
  Type?: InputType;
  SrtSettings?: SrtSettings;
  InputNetworkLocation?: InputNetworkLocation;
  MulticastSettings?: MulticastSettings;
  Smpte2110ReceiverGroupSettings?: Smpte2110ReceiverGroupSettings;
  SdiSources?: string[];
  RouterSettings?: RouterInputSettings;
}
export const Input = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AttachedChannels: S.optional(__listOf__string).pipe(
      T.JsonName("attachedChannels"),
    ),
    Destinations: S.optional(__listOfInputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputClass: S.optional(InputClass).pipe(T.JsonName("inputClass")),
    InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
      T.JsonName("inputDevices"),
    ),
    InputPartnerIds: S.optional(__listOf__string).pipe(
      T.JsonName("inputPartnerIds"),
    ),
    InputSourceType: S.optional(InputSourceType).pipe(
      T.JsonName("inputSourceType"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlow).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    Sources: S.optional(__listOfInputSource).pipe(T.JsonName("sources")),
    State: S.optional(InputState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(InputType).pipe(T.JsonName("type")),
    SrtSettings: S.optional(SrtSettings)
      .pipe(T.JsonName("srtSettings"))
      .annotations({ identifier: "SrtSettings" }),
    InputNetworkLocation: S.optional(InputNetworkLocation).pipe(
      T.JsonName("inputNetworkLocation"),
    ),
    MulticastSettings: S.optional(MulticastSettings)
      .pipe(T.JsonName("multicastSettings"))
      .annotations({ identifier: "MulticastSettings" }),
    Smpte2110ReceiverGroupSettings: S.optional(Smpte2110ReceiverGroupSettings)
      .pipe(T.JsonName("smpte2110ReceiverGroupSettings"))
      .annotations({ identifier: "Smpte2110ReceiverGroupSettings" }),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    RouterSettings: S.optional(RouterInputSettings)
      .pipe(T.JsonName("routerSettings"))
      .annotations({ identifier: "RouterInputSettings" }),
  }),
).annotations({ identifier: "Input" }) as any as S.Schema<Input>;
export type __listOfInput = Input[];
export const __listOfInput = S.Array(Input);
export interface ChannelEngineVersionResponse {
  ExpirationDate?: Date;
  Version?: string;
}
export const ChannelEngineVersionResponse = S.suspend(() =>
  S.Struct({
    ExpirationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("expirationDate")),
    Version: S.optional(S.String).pipe(T.JsonName("version")),
  }),
).annotations({
  identifier: "ChannelEngineVersionResponse",
}) as any as S.Schema<ChannelEngineVersionResponse>;
export type __listOfChannelEngineVersionResponse =
  ChannelEngineVersionResponse[];
export const __listOfChannelEngineVersionResponse = S.Array(
  ChannelEngineVersionResponse,
);
export interface MaintenanceUpdateSettings {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceScheduledDate?: string;
  MaintenanceStartTime?: string;
}
export const MaintenanceUpdateSettings = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceScheduledDate: S.optional(S.String).pipe(
      T.JsonName("maintenanceScheduledDate"),
    ),
    MaintenanceStartTime: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartTime"),
    ),
  }),
).annotations({
  identifier: "MaintenanceUpdateSettings",
}) as any as S.Schema<MaintenanceUpdateSettings>;
export interface InputDeviceRequest {
  Id?: string;
}
export const InputDeviceRequest = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String).pipe(T.JsonName("id")) }),
).annotations({
  identifier: "InputDeviceRequest",
}) as any as S.Schema<InputDeviceRequest>;
export type __listOfInputDeviceRequest = InputDeviceRequest[];
export const __listOfInputDeviceRequest = S.Array(InputDeviceRequest);
export interface SpecialRouterSettings {
  RouterArn?: string;
}
export const SpecialRouterSettings = S.suspend(() =>
  S.Struct({ RouterArn: S.optional(S.String).pipe(T.JsonName("routerArn")) }),
).annotations({
  identifier: "SpecialRouterSettings",
}) as any as S.Schema<SpecialRouterSettings>;
export interface IpPoolUpdateRequest {
  Cidr?: string;
}
export const IpPoolUpdateRequest = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }),
).annotations({
  identifier: "IpPoolUpdateRequest",
}) as any as S.Schema<IpPoolUpdateRequest>;
export type __listOfIpPoolUpdateRequest = IpPoolUpdateRequest[];
export const __listOfIpPoolUpdateRequest = S.Array(IpPoolUpdateRequest);
export interface RouteUpdateRequest {
  Cidr?: string;
  Gateway?: string;
}
export const RouteUpdateRequest = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  }),
).annotations({
  identifier: "RouteUpdateRequest",
}) as any as S.Schema<RouteUpdateRequest>;
export type __listOfRouteUpdateRequest = RouteUpdateRequest[];
export const __listOfRouteUpdateRequest = S.Array(RouteUpdateRequest);
export interface SdiSourceMappingUpdateRequest {
  CardNumber?: number;
  ChannelNumber?: number;
  SdiSource?: string;
}
export const SdiSourceMappingUpdateRequest = S.suspend(() =>
  S.Struct({
    CardNumber: S.optional(S.Number).pipe(T.JsonName("cardNumber")),
    ChannelNumber: S.optional(S.Number).pipe(T.JsonName("channelNumber")),
    SdiSource: S.optional(S.String).pipe(T.JsonName("sdiSource")),
  }),
).annotations({
  identifier: "SdiSourceMappingUpdateRequest",
}) as any as S.Schema<SdiSourceMappingUpdateRequest>;
export type SdiSourceMappingsUpdateRequest = SdiSourceMappingUpdateRequest[];
export const SdiSourceMappingsUpdateRequest = S.Array(
  SdiSourceMappingUpdateRequest,
);
export type AudioType =
  | "CLEAN_EFFECTS"
  | "HEARING_IMPAIRED"
  | "UNDEFINED"
  | "VISUAL_IMPAIRED_COMMENTARY"
  | (string & {});
export const AudioType = S.String;
export type AudioDescriptionAudioTypeControl =
  | "FOLLOW_INPUT"
  | "USE_CONFIGURED"
  | (string & {});
export const AudioDescriptionAudioTypeControl = S.String;
export type AudioDescriptionLanguageCodeControl =
  | "FOLLOW_INPUT"
  | "USE_CONFIGURED"
  | (string & {});
export const AudioDescriptionLanguageCodeControl = S.String;
export type DashRoleAudio =
  | "ALTERNATE"
  | "COMMENTARY"
  | "DESCRIPTION"
  | "DUB"
  | "EMERGENCY"
  | "ENHANCED-AUDIO-INTELLIGIBILITY"
  | "KARAOKE"
  | "MAIN"
  | "SUPPLEMENTARY"
  | (string & {});
export const DashRoleAudio = S.String;
export type __listOfDashRoleAudio = DashRoleAudio[];
export const __listOfDashRoleAudio = S.Array(DashRoleAudio);
export type DvbDashAccessibility =
  | "DVBDASH_1_VISUALLY_IMPAIRED"
  | "DVBDASH_2_HARD_OF_HEARING"
  | "DVBDASH_3_SUPPLEMENTAL_COMMENTARY"
  | "DVBDASH_4_DIRECTORS_COMMENTARY"
  | "DVBDASH_5_EDUCATIONAL_NOTES"
  | "DVBDASH_6_MAIN_PROGRAM"
  | "DVBDASH_7_CLEAN_FEED"
  | (string & {});
export const DvbDashAccessibility = S.String;
export type AvailBlankingState = "DISABLED" | "ENABLED" | (string & {});
export const AvailBlankingState = S.String;
export type Scte35SegmentationScope =
  | "ALL_OUTPUT_GROUPS"
  | "SCTE35_ENABLED_OUTPUT_GROUPS"
  | (string & {});
export const Scte35SegmentationScope = S.String;
export type BlackoutSlateNetworkEndBlackout =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const BlackoutSlateNetworkEndBlackout = S.String;
export type BlackoutSlateState = "DISABLED" | "ENABLED" | (string & {});
export const BlackoutSlateState = S.String;
export type AccessibilityType =
  | "DOES_NOT_IMPLEMENT_ACCESSIBILITY_FEATURES"
  | "IMPLEMENTS_ACCESSIBILITY_FEATURES"
  | (string & {});
export const AccessibilityType = S.String;
export type DashRoleCaption =
  | "ALTERNATE"
  | "CAPTION"
  | "COMMENTARY"
  | "DESCRIPTION"
  | "DUB"
  | "EASYREADER"
  | "EMERGENCY"
  | "FORCED-SUBTITLE"
  | "KARAOKE"
  | "MAIN"
  | "METADATA"
  | "SUBTITLE"
  | "SUPPLEMENTARY"
  | (string & {});
export const DashRoleCaption = S.String;
export type __listOfDashRoleCaption = DashRoleCaption[];
export const __listOfDashRoleCaption = S.Array(DashRoleCaption);
export type FeatureActivationsInputPrepareScheduleActions =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const FeatureActivationsInputPrepareScheduleActions = S.String;
export type FeatureActivationsOutputStaticImageOverlayScheduleActions =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const FeatureActivationsOutputStaticImageOverlayScheduleActions =
  S.String;
export type GlobalConfigurationInputEndAction =
  | "NONE"
  | "SWITCH_AND_LOOP_INPUTS"
  | (string & {});
export const GlobalConfigurationInputEndAction = S.String;
export type GlobalConfigurationOutputLockingMode =
  | "EPOCH_LOCKING"
  | "PIPELINE_LOCKING"
  | "DISABLED"
  | (string & {});
export const GlobalConfigurationOutputLockingMode = S.String;
export type GlobalConfigurationOutputTimingSource =
  | "INPUT_CLOCK"
  | "SYSTEM_CLOCK"
  | (string & {});
export const GlobalConfigurationOutputTimingSource = S.String;
export type GlobalConfigurationLowFramerateInputs =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const GlobalConfigurationLowFramerateInputs = S.String;
export type MotionGraphicsInsertion = "DISABLED" | "ENABLED" | (string & {});
export const MotionGraphicsInsertion = S.String;
export type NielsenPcmToId3TaggingState =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const NielsenPcmToId3TaggingState = S.String;
export type TimecodeConfigSource =
  | "EMBEDDED"
  | "SYSTEMCLOCK"
  | "ZEROBASED"
  | (string & {});
export const TimecodeConfigSource = S.String;
export type VideoDescriptionRespondToAfd =
  | "NONE"
  | "PASSTHROUGH"
  | "RESPOND"
  | (string & {});
export const VideoDescriptionRespondToAfd = S.String;
export type VideoDescriptionScalingBehavior =
  | "DEFAULT"
  | "STRETCH_TO_OUTPUT"
  | (string & {});
export const VideoDescriptionScalingBehavior = S.String;
export type ThumbnailState = "AUTO" | "DISABLED" | (string & {});
export const ThumbnailState = S.String;
export type InputPreference =
  | "EQUAL_INPUT_PREFERENCE"
  | "PRIMARY_INPUT_PREFERRED"
  | (string & {});
export const InputPreference = S.String;
export type InputDeblockFilter = "DISABLED" | "ENABLED" | (string & {});
export const InputDeblockFilter = S.String;
export type InputDenoiseFilter = "DISABLED" | "ENABLED" | (string & {});
export const InputDenoiseFilter = S.String;
export type InputFilter = "AUTO" | "DISABLED" | "FORCED" | (string & {});
export const InputFilter = S.String;
export type Smpte2038DataPreference = "IGNORE" | "PREFER" | (string & {});
export const Smpte2038DataPreference = S.String;
export type InputSourceEndBehavior = "CONTINUE" | "LOOP" | (string & {});
export const InputSourceEndBehavior = S.String;
export type LinkedChannelType =
  | "FOLLOWING_CHANNEL"
  | "PRIMARY_CHANNEL"
  | (string & {});
export const LinkedChannelType = S.String;
export type InputDeviceConfigurableAudioChannelPairProfile =
  | "DISABLED"
  | "VBR-AAC_HHE-16000"
  | "VBR-AAC_HE-64000"
  | "VBR-AAC_LC-128000"
  | "CBR-AAC_HQ-192000"
  | "CBR-AAC_HQ-256000"
  | "CBR-AAC_HQ-384000"
  | "CBR-AAC_HQ-512000"
  | (string & {});
export const InputDeviceConfigurableAudioChannelPairProfile = S.String;
export type __listOf__integer = number[];
export const __listOf__integer = S.Array(S.Number);
export interface BatchFailedResultModel {
  Arn?: string;
  Code?: string;
  Id?: string;
  Message?: string;
}
export const BatchFailedResultModel = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Code: S.optional(S.String).pipe(T.JsonName("code")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "BatchFailedResultModel",
}) as any as S.Schema<BatchFailedResultModel>;
export type __listOfBatchFailedResultModel = BatchFailedResultModel[];
export const __listOfBatchFailedResultModel = S.Array(BatchFailedResultModel);
export interface BatchSuccessfulResultModel {
  Arn?: string;
  Id?: string;
  State?: string;
}
export const BatchSuccessfulResultModel = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    State: S.optional(S.String).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "BatchSuccessfulResultModel",
}) as any as S.Schema<BatchSuccessfulResultModel>;
export type __listOfBatchSuccessfulResultModel = BatchSuccessfulResultModel[];
export const __listOfBatchSuccessfulResultModel = S.Array(
  BatchSuccessfulResultModel,
);
export interface BatchStartResponse {
  Failed?: BatchFailedResultModel[];
  Successful?: BatchSuccessfulResultModel[];
}
export const BatchStartResponse = S.suspend(() =>
  S.Struct({
    Failed: S.optional(__listOfBatchFailedResultModel).pipe(
      T.JsonName("failed"),
    ),
    Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
      T.JsonName("successful"),
    ),
  }),
).annotations({
  identifier: "BatchStartResponse",
}) as any as S.Schema<BatchStartResponse>;
export interface BatchStopResponse {
  Failed?: BatchFailedResultModel[];
  Successful?: BatchSuccessfulResultModel[];
}
export const BatchStopResponse = S.suspend(() =>
  S.Struct({
    Failed: S.optional(__listOfBatchFailedResultModel).pipe(
      T.JsonName("failed"),
    ),
    Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
      T.JsonName("successful"),
    ),
  }),
).annotations({
  identifier: "BatchStopResponse",
}) as any as S.Schema<BatchStopResponse>;
export interface CreateChannelPlacementGroupResponse {
  Arn?: string;
  Channels?: string[];
  ClusterId?: string;
  Id?: string;
  Name?: string;
  Nodes?: string[];
  State?: ChannelPlacementGroupState;
}
export const CreateChannelPlacementGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    State: S.optional(ChannelPlacementGroupState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "CreateChannelPlacementGroupResponse",
}) as any as S.Schema<CreateChannelPlacementGroupResponse>;
export interface CreateCloudWatchAlarmTemplateRequest {
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupIdentifier?: string;
  MetricName?: string;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  Tags?: { [key: string]: string | undefined };
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
  RequestId?: string;
}
export const CreateCloudWatchAlarmTemplateRequest = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/cloudwatch-alarm-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCloudWatchAlarmTemplateRequest",
}) as any as S.Schema<CreateCloudWatchAlarmTemplateRequest>;
export interface CreateCloudWatchAlarmTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateCloudWatchAlarmTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateCloudWatchAlarmTemplateGroupResponse",
}) as any as S.Schema<CreateCloudWatchAlarmTemplateGroupResponse>;
export interface CreateEventBridgeRuleTemplateRequest {
  Description?: string;
  EventTargets?: EventBridgeRuleTemplateTarget[];
  EventType?: EventBridgeRuleTemplateEventType;
  GroupIdentifier?: string;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  RequestId?: string;
}
export const CreateEventBridgeRuleTemplateRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/eventbridge-rule-templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventBridgeRuleTemplateRequest",
}) as any as S.Schema<CreateEventBridgeRuleTemplateRequest>;
export interface CreateEventBridgeRuleTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateEventBridgeRuleTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateEventBridgeRuleTemplateGroupResponse",
}) as any as S.Schema<CreateEventBridgeRuleTemplateGroupResponse>;
export interface CreateInputSecurityGroupRequest {
  Tags?: { [key: string]: string | undefined };
  WhitelistRules?: InputWhitelistRuleCidr[];
}
export const CreateInputSecurityGroupRequest = S.suspend(() =>
  S.Struct({
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRuleCidr).pipe(
      T.JsonName("whitelistRules"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/inputSecurityGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInputSecurityGroupRequest",
}) as any as S.Schema<CreateInputSecurityGroupRequest>;
export interface CreateMultiplexRequest {
  AvailabilityZones?: string[];
  MultiplexSettings?: MultiplexSettings;
  Name?: string;
  RequestId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateMultiplexRequest = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/multiplexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMultiplexRequest",
}) as any as S.Schema<CreateMultiplexRequest>;
export interface CreateNetworkRequest {
  IpPools?: IpPoolCreateRequest[];
  Name?: string;
  RequestId?: string;
  Routes?: RouteCreateRequest[];
  Tags?: { [key: string]: string | undefined };
}
export const CreateNetworkRequest = S.suspend(() =>
  S.Struct({
    IpPools: S.optional(__listOfIpPoolCreateRequest).pipe(
      T.JsonName("ipPools"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Routes: S.optional(__listOfRouteCreateRequest).pipe(T.JsonName("routes")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkRequest",
}) as any as S.Schema<CreateNetworkRequest>;
export interface CreateNodeRequest {
  ClusterId: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMappingCreateRequest[];
  RequestId?: string;
  Role?: NodeRole;
  Tags?: { [key: string]: string | undefined };
}
export const CreateNodeRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(
      __listOfNodeInterfaceMappingCreateRequest,
    ).pipe(T.JsonName("nodeInterfaceMappings")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/clusters/{ClusterId}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNodeRequest",
}) as any as S.Schema<CreateNodeRequest>;
export interface CreateNodeRegistrationScriptRequest {
  ClusterId: string;
  Id?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  RequestId?: string;
  Role?: NodeRole;
}
export const CreateNodeRegistrationScriptRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/clusters/{ClusterId}/nodeRegistrationScript",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNodeRegistrationScriptRequest",
}) as any as S.Schema<CreateNodeRegistrationScriptRequest>;
export interface DeleteChannelPlacementGroupResponse {
  Arn?: string;
  Channels?: string[];
  ClusterId?: string;
  Id?: string;
  Name?: string;
  Nodes?: string[];
  State?: ChannelPlacementGroupState;
}
export const DeleteChannelPlacementGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    State: S.optional(ChannelPlacementGroupState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteChannelPlacementGroupResponse",
}) as any as S.Schema<DeleteChannelPlacementGroupResponse>;
export type SdiSourceState = "IDLE" | "IN_USE" | "DELETED" | (string & {});
export const SdiSourceState = S.String;
export interface SdiSource {
  Arn?: string;
  Id?: string;
  Inputs?: string[];
  Mode?: SdiSourceMode;
  Name?: string;
  State?: SdiSourceState;
  Type?: SdiSourceType;
}
export const SdiSource = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
    Mode: S.optional(SdiSourceMode).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    State: S.optional(SdiSourceState).pipe(T.JsonName("state")),
    Type: S.optional(SdiSourceType).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "SdiSource" }) as any as S.Schema<SdiSource>;
export interface DeleteSdiSourceResponse {
  SdiSource?: SdiSource;
}
export const DeleteSdiSourceResponse = S.suspend(() =>
  S.Struct({
    SdiSource: S.optional(SdiSource)
      .pipe(T.JsonName("sdiSource"))
      .annotations({ identifier: "SdiSource" }),
  }),
).annotations({
  identifier: "DeleteSdiSourceResponse",
}) as any as S.Schema<DeleteSdiSourceResponse>;
export interface DescribeAccountConfigurationResponse {
  AccountConfiguration?: AccountConfiguration;
}
export const DescribeAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    AccountConfiguration: S.optional(AccountConfiguration)
      .pipe(T.JsonName("accountConfiguration"))
      .annotations({ identifier: "AccountConfiguration" }),
  }),
).annotations({
  identifier: "DescribeAccountConfigurationResponse",
}) as any as S.Schema<DescribeAccountConfigurationResponse>;
export interface ChannelEgressEndpoint {
  SourceIp?: string;
}
export const ChannelEgressEndpoint = S.suspend(() =>
  S.Struct({ SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")) }),
).annotations({
  identifier: "ChannelEgressEndpoint",
}) as any as S.Schema<ChannelEgressEndpoint>;
export type __listOfChannelEgressEndpoint = ChannelEgressEndpoint[];
export const __listOfChannelEgressEndpoint = S.Array(ChannelEgressEndpoint);
export type AudioNormalizationAlgorithm =
  | "ITU_1770_1"
  | "ITU_1770_2"
  | (string & {});
export const AudioNormalizationAlgorithm = S.String;
export type AudioNormalizationAlgorithmControl =
  | "CORRECT_AUDIO"
  | (string & {});
export const AudioNormalizationAlgorithmControl = S.String;
export interface AudioNormalizationSettings {
  Algorithm?: AudioNormalizationAlgorithm;
  AlgorithmControl?: AudioNormalizationAlgorithmControl;
  TargetLkfs?: number;
}
export const AudioNormalizationSettings = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(AudioNormalizationAlgorithm).pipe(
      T.JsonName("algorithm"),
    ),
    AlgorithmControl: S.optional(AudioNormalizationAlgorithmControl).pipe(
      T.JsonName("algorithmControl"),
    ),
    TargetLkfs: S.optional(S.Number).pipe(T.JsonName("targetLkfs")),
  }),
).annotations({
  identifier: "AudioNormalizationSettings",
}) as any as S.Schema<AudioNormalizationSettings>;
export type NielsenWatermarksCbetStepaside =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const NielsenWatermarksCbetStepaside = S.String;
export interface NielsenCBET {
  CbetCheckDigitString?: string;
  CbetStepaside?: NielsenWatermarksCbetStepaside;
  Csid?: string;
}
export const NielsenCBET = S.suspend(() =>
  S.Struct({
    CbetCheckDigitString: S.optional(S.String).pipe(
      T.JsonName("cbetCheckDigitString"),
    ),
    CbetStepaside: S.optional(NielsenWatermarksCbetStepaside).pipe(
      T.JsonName("cbetStepaside"),
    ),
    Csid: S.optional(S.String).pipe(T.JsonName("csid")),
  }),
).annotations({ identifier: "NielsenCBET" }) as any as S.Schema<NielsenCBET>;
export type NielsenWatermarksDistributionTypes =
  | "FINAL_DISTRIBUTOR"
  | "PROGRAM_CONTENT"
  | (string & {});
export const NielsenWatermarksDistributionTypes = S.String;
export type NielsenWatermarkTimezones =
  | "AMERICA_PUERTO_RICO"
  | "US_ALASKA"
  | "US_ARIZONA"
  | "US_CENTRAL"
  | "US_EASTERN"
  | "US_HAWAII"
  | "US_MOUNTAIN"
  | "US_PACIFIC"
  | "US_SAMOA"
  | "UTC"
  | (string & {});
export const NielsenWatermarkTimezones = S.String;
export interface NielsenNaesIiNw {
  CheckDigitString?: string;
  Sid?: number;
  Timezone?: NielsenWatermarkTimezones;
}
export const NielsenNaesIiNw = S.suspend(() =>
  S.Struct({
    CheckDigitString: S.optional(S.String).pipe(T.JsonName("checkDigitString")),
    Sid: S.optional(S.Number).pipe(T.JsonName("sid")),
    Timezone: S.optional(NielsenWatermarkTimezones).pipe(
      T.JsonName("timezone"),
    ),
  }),
).annotations({
  identifier: "NielsenNaesIiNw",
}) as any as S.Schema<NielsenNaesIiNw>;
export interface NielsenWatermarksSettings {
  NielsenCbetSettings?: NielsenCBET;
  NielsenDistributionType?: NielsenWatermarksDistributionTypes;
  NielsenNaesIiNwSettings?: NielsenNaesIiNw;
}
export const NielsenWatermarksSettings = S.suspend(() =>
  S.Struct({
    NielsenCbetSettings: S.optional(NielsenCBET)
      .pipe(T.JsonName("nielsenCbetSettings"))
      .annotations({ identifier: "NielsenCBET" }),
    NielsenDistributionType: S.optional(
      NielsenWatermarksDistributionTypes,
    ).pipe(T.JsonName("nielsenDistributionType")),
    NielsenNaesIiNwSettings: S.optional(NielsenNaesIiNw)
      .pipe(T.JsonName("nielsenNaesIiNwSettings"))
      .annotations({ identifier: "NielsenNaesIiNw" }),
  }),
).annotations({
  identifier: "NielsenWatermarksSettings",
}) as any as S.Schema<NielsenWatermarksSettings>;
export interface AudioWatermarkSettings {
  NielsenWatermarksSettings?: NielsenWatermarksSettings;
}
export const AudioWatermarkSettings = S.suspend(() =>
  S.Struct({
    NielsenWatermarksSettings: S.optional(NielsenWatermarksSettings)
      .pipe(T.JsonName("nielsenWatermarksSettings"))
      .annotations({ identifier: "NielsenWatermarksSettings" }),
  }),
).annotations({
  identifier: "AudioWatermarkSettings",
}) as any as S.Schema<AudioWatermarkSettings>;
export type AacCodingMode =
  | "AD_RECEIVER_MIX"
  | "CODING_MODE_1_0"
  | "CODING_MODE_1_1"
  | "CODING_MODE_2_0"
  | "CODING_MODE_5_1"
  | (string & {});
export const AacCodingMode = S.String;
export type AacInputType = "BROADCASTER_MIXED_AD" | "NORMAL" | (string & {});
export const AacInputType = S.String;
export type AacProfile = "HEV1" | "HEV2" | "LC" | (string & {});
export const AacProfile = S.String;
export type AacRateControlMode = "CBR" | "VBR" | (string & {});
export const AacRateControlMode = S.String;
export type AacRawFormat = "LATM_LOAS" | "NONE" | (string & {});
export const AacRawFormat = S.String;
export type AacSpec = "MPEG2" | "MPEG4" | (string & {});
export const AacSpec = S.String;
export type AacVbrQuality =
  | "HIGH"
  | "LOW"
  | "MEDIUM_HIGH"
  | "MEDIUM_LOW"
  | (string & {});
export const AacVbrQuality = S.String;
export interface AacSettings {
  Bitrate?: number;
  CodingMode?: AacCodingMode;
  InputType?: AacInputType;
  Profile?: AacProfile;
  RateControlMode?: AacRateControlMode;
  RawFormat?: AacRawFormat;
  SampleRate?: number;
  Spec?: AacSpec;
  VbrQuality?: AacVbrQuality;
}
export const AacSettings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodingMode: S.optional(AacCodingMode).pipe(T.JsonName("codingMode")),
    InputType: S.optional(AacInputType).pipe(T.JsonName("inputType")),
    Profile: S.optional(AacProfile).pipe(T.JsonName("profile")),
    RateControlMode: S.optional(AacRateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    RawFormat: S.optional(AacRawFormat).pipe(T.JsonName("rawFormat")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
    Spec: S.optional(AacSpec).pipe(T.JsonName("spec")),
    VbrQuality: S.optional(AacVbrQuality).pipe(T.JsonName("vbrQuality")),
  }),
).annotations({ identifier: "AacSettings" }) as any as S.Schema<AacSettings>;
export type Ac3BitstreamMode =
  | "COMMENTARY"
  | "COMPLETE_MAIN"
  | "DIALOGUE"
  | "EMERGENCY"
  | "HEARING_IMPAIRED"
  | "MUSIC_AND_EFFECTS"
  | "VISUALLY_IMPAIRED"
  | "VOICE_OVER"
  | (string & {});
export const Ac3BitstreamMode = S.String;
export type Ac3CodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_1_1"
  | "CODING_MODE_2_0"
  | "CODING_MODE_3_2_LFE"
  | (string & {});
export const Ac3CodingMode = S.String;
export type Ac3DrcProfile = "FILM_STANDARD" | "NONE" | (string & {});
export const Ac3DrcProfile = S.String;
export type Ac3LfeFilter = "DISABLED" | "ENABLED" | (string & {});
export const Ac3LfeFilter = S.String;
export type Ac3MetadataControl =
  | "FOLLOW_INPUT"
  | "USE_CONFIGURED"
  | (string & {});
export const Ac3MetadataControl = S.String;
export type Ac3AttenuationControl = "ATTENUATE_3_DB" | "NONE" | (string & {});
export const Ac3AttenuationControl = S.String;
export interface Ac3Settings {
  Bitrate?: number;
  BitstreamMode?: Ac3BitstreamMode;
  CodingMode?: Ac3CodingMode;
  Dialnorm?: number;
  DrcProfile?: Ac3DrcProfile;
  LfeFilter?: Ac3LfeFilter;
  MetadataControl?: Ac3MetadataControl;
  AttenuationControl?: Ac3AttenuationControl;
}
export const Ac3Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(Ac3BitstreamMode).pipe(
      T.JsonName("bitstreamMode"),
    ),
    CodingMode: S.optional(Ac3CodingMode).pipe(T.JsonName("codingMode")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DrcProfile: S.optional(Ac3DrcProfile).pipe(T.JsonName("drcProfile")),
    LfeFilter: S.optional(Ac3LfeFilter).pipe(T.JsonName("lfeFilter")),
    MetadataControl: S.optional(Ac3MetadataControl).pipe(
      T.JsonName("metadataControl"),
    ),
    AttenuationControl: S.optional(Ac3AttenuationControl).pipe(
      T.JsonName("attenuationControl"),
    ),
  }),
).annotations({ identifier: "Ac3Settings" }) as any as S.Schema<Ac3Settings>;
export type Eac3AtmosCodingMode =
  | "CODING_MODE_5_1_4"
  | "CODING_MODE_7_1_4"
  | "CODING_MODE_9_1_6"
  | (string & {});
export const Eac3AtmosCodingMode = S.String;
export type Eac3AtmosDrcLine =
  | "FILM_LIGHT"
  | "FILM_STANDARD"
  | "MUSIC_LIGHT"
  | "MUSIC_STANDARD"
  | "NONE"
  | "SPEECH"
  | (string & {});
export const Eac3AtmosDrcLine = S.String;
export type Eac3AtmosDrcRf =
  | "FILM_LIGHT"
  | "FILM_STANDARD"
  | "MUSIC_LIGHT"
  | "MUSIC_STANDARD"
  | "NONE"
  | "SPEECH"
  | (string & {});
export const Eac3AtmosDrcRf = S.String;
export interface Eac3AtmosSettings {
  Bitrate?: number;
  CodingMode?: Eac3AtmosCodingMode;
  Dialnorm?: number;
  DrcLine?: Eac3AtmosDrcLine;
  DrcRf?: Eac3AtmosDrcRf;
  HeightTrim?: number;
  SurroundTrim?: number;
}
export const Eac3AtmosSettings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodingMode: S.optional(Eac3AtmosCodingMode).pipe(T.JsonName("codingMode")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DrcLine: S.optional(Eac3AtmosDrcLine).pipe(T.JsonName("drcLine")),
    DrcRf: S.optional(Eac3AtmosDrcRf).pipe(T.JsonName("drcRf")),
    HeightTrim: S.optional(S.Number).pipe(T.JsonName("heightTrim")),
    SurroundTrim: S.optional(S.Number).pipe(T.JsonName("surroundTrim")),
  }),
).annotations({
  identifier: "Eac3AtmosSettings",
}) as any as S.Schema<Eac3AtmosSettings>;
export type Eac3AttenuationControl = "ATTENUATE_3_DB" | "NONE" | (string & {});
export const Eac3AttenuationControl = S.String;
export type Eac3BitstreamMode =
  | "COMMENTARY"
  | "COMPLETE_MAIN"
  | "EMERGENCY"
  | "HEARING_IMPAIRED"
  | "VISUALLY_IMPAIRED"
  | (string & {});
export const Eac3BitstreamMode = S.String;
export type Eac3CodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_2_0"
  | "CODING_MODE_3_2"
  | (string & {});
export const Eac3CodingMode = S.String;
export type Eac3DcFilter = "DISABLED" | "ENABLED" | (string & {});
export const Eac3DcFilter = S.String;
export type Eac3DrcLine =
  | "FILM_LIGHT"
  | "FILM_STANDARD"
  | "MUSIC_LIGHT"
  | "MUSIC_STANDARD"
  | "NONE"
  | "SPEECH"
  | (string & {});
export const Eac3DrcLine = S.String;
export type Eac3DrcRf =
  | "FILM_LIGHT"
  | "FILM_STANDARD"
  | "MUSIC_LIGHT"
  | "MUSIC_STANDARD"
  | "NONE"
  | "SPEECH"
  | (string & {});
export const Eac3DrcRf = S.String;
export type Eac3LfeControl = "LFE" | "NO_LFE" | (string & {});
export const Eac3LfeControl = S.String;
export type Eac3LfeFilter = "DISABLED" | "ENABLED" | (string & {});
export const Eac3LfeFilter = S.String;
export type Eac3MetadataControl =
  | "FOLLOW_INPUT"
  | "USE_CONFIGURED"
  | (string & {});
export const Eac3MetadataControl = S.String;
export type Eac3PassthroughControl =
  | "NO_PASSTHROUGH"
  | "WHEN_POSSIBLE"
  | (string & {});
export const Eac3PassthroughControl = S.String;
export type Eac3PhaseControl = "NO_SHIFT" | "SHIFT_90_DEGREES" | (string & {});
export const Eac3PhaseControl = S.String;
export type Eac3StereoDownmix =
  | "DPL2"
  | "LO_RO"
  | "LT_RT"
  | "NOT_INDICATED"
  | (string & {});
export const Eac3StereoDownmix = S.String;
export type Eac3SurroundExMode =
  | "DISABLED"
  | "ENABLED"
  | "NOT_INDICATED"
  | (string & {});
export const Eac3SurroundExMode = S.String;
export type Eac3SurroundMode =
  | "DISABLED"
  | "ENABLED"
  | "NOT_INDICATED"
  | (string & {});
export const Eac3SurroundMode = S.String;
export interface Eac3Settings {
  AttenuationControl?: Eac3AttenuationControl;
  Bitrate?: number;
  BitstreamMode?: Eac3BitstreamMode;
  CodingMode?: Eac3CodingMode;
  DcFilter?: Eac3DcFilter;
  Dialnorm?: number;
  DrcLine?: Eac3DrcLine;
  DrcRf?: Eac3DrcRf;
  LfeControl?: Eac3LfeControl;
  LfeFilter?: Eac3LfeFilter;
  LoRoCenterMixLevel?: number;
  LoRoSurroundMixLevel?: number;
  LtRtCenterMixLevel?: number;
  LtRtSurroundMixLevel?: number;
  MetadataControl?: Eac3MetadataControl;
  PassthroughControl?: Eac3PassthroughControl;
  PhaseControl?: Eac3PhaseControl;
  StereoDownmix?: Eac3StereoDownmix;
  SurroundExMode?: Eac3SurroundExMode;
  SurroundMode?: Eac3SurroundMode;
}
export const Eac3Settings = S.suspend(() =>
  S.Struct({
    AttenuationControl: S.optional(Eac3AttenuationControl).pipe(
      T.JsonName("attenuationControl"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BitstreamMode: S.optional(Eac3BitstreamMode).pipe(
      T.JsonName("bitstreamMode"),
    ),
    CodingMode: S.optional(Eac3CodingMode).pipe(T.JsonName("codingMode")),
    DcFilter: S.optional(Eac3DcFilter).pipe(T.JsonName("dcFilter")),
    Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
    DrcLine: S.optional(Eac3DrcLine).pipe(T.JsonName("drcLine")),
    DrcRf: S.optional(Eac3DrcRf).pipe(T.JsonName("drcRf")),
    LfeControl: S.optional(Eac3LfeControl).pipe(T.JsonName("lfeControl")),
    LfeFilter: S.optional(Eac3LfeFilter).pipe(T.JsonName("lfeFilter")),
    LoRoCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoCenterMixLevel"),
    ),
    LoRoSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("loRoSurroundMixLevel"),
    ),
    LtRtCenterMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtCenterMixLevel"),
    ),
    LtRtSurroundMixLevel: S.optional(S.Number).pipe(
      T.JsonName("ltRtSurroundMixLevel"),
    ),
    MetadataControl: S.optional(Eac3MetadataControl).pipe(
      T.JsonName("metadataControl"),
    ),
    PassthroughControl: S.optional(Eac3PassthroughControl).pipe(
      T.JsonName("passthroughControl"),
    ),
    PhaseControl: S.optional(Eac3PhaseControl).pipe(T.JsonName("phaseControl")),
    StereoDownmix: S.optional(Eac3StereoDownmix).pipe(
      T.JsonName("stereoDownmix"),
    ),
    SurroundExMode: S.optional(Eac3SurroundExMode).pipe(
      T.JsonName("surroundExMode"),
    ),
    SurroundMode: S.optional(Eac3SurroundMode).pipe(T.JsonName("surroundMode")),
  }),
).annotations({ identifier: "Eac3Settings" }) as any as S.Schema<Eac3Settings>;
export type Mp2CodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_2_0"
  | (string & {});
export const Mp2CodingMode = S.String;
export interface Mp2Settings {
  Bitrate?: number;
  CodingMode?: Mp2CodingMode;
  SampleRate?: number;
}
export const Mp2Settings = S.suspend(() =>
  S.Struct({
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    CodingMode: S.optional(Mp2CodingMode).pipe(T.JsonName("codingMode")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "Mp2Settings" }) as any as S.Schema<Mp2Settings>;
export interface PassThroughSettings {}
export const PassThroughSettings = S.suspend(() => S.Struct({})).annotations({
  identifier: "PassThroughSettings",
}) as any as S.Schema<PassThroughSettings>;
export type WavCodingMode =
  | "CODING_MODE_1_0"
  | "CODING_MODE_2_0"
  | "CODING_MODE_4_0"
  | "CODING_MODE_8_0"
  | (string & {});
export const WavCodingMode = S.String;
export interface WavSettings {
  BitDepth?: number;
  CodingMode?: WavCodingMode;
  SampleRate?: number;
}
export const WavSettings = S.suspend(() =>
  S.Struct({
    BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
    CodingMode: S.optional(WavCodingMode).pipe(T.JsonName("codingMode")),
    SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  }),
).annotations({ identifier: "WavSettings" }) as any as S.Schema<WavSettings>;
export interface AudioCodecSettings {
  AacSettings?: AacSettings;
  Ac3Settings?: Ac3Settings;
  Eac3AtmosSettings?: Eac3AtmosSettings;
  Eac3Settings?: Eac3Settings;
  Mp2Settings?: Mp2Settings;
  PassThroughSettings?: PassThroughSettings;
  WavSettings?: WavSettings;
}
export const AudioCodecSettings = S.suspend(() =>
  S.Struct({
    AacSettings: S.optional(AacSettings)
      .pipe(T.JsonName("aacSettings"))
      .annotations({ identifier: "AacSettings" }),
    Ac3Settings: S.optional(Ac3Settings)
      .pipe(T.JsonName("ac3Settings"))
      .annotations({ identifier: "Ac3Settings" }),
    Eac3AtmosSettings: S.optional(Eac3AtmosSettings)
      .pipe(T.JsonName("eac3AtmosSettings"))
      .annotations({ identifier: "Eac3AtmosSettings" }),
    Eac3Settings: S.optional(Eac3Settings)
      .pipe(T.JsonName("eac3Settings"))
      .annotations({ identifier: "Eac3Settings" }),
    Mp2Settings: S.optional(Mp2Settings)
      .pipe(T.JsonName("mp2Settings"))
      .annotations({ identifier: "Mp2Settings" }),
    PassThroughSettings: S.optional(PassThroughSettings)
      .pipe(T.JsonName("passThroughSettings"))
      .annotations({ identifier: "PassThroughSettings" }),
    WavSettings: S.optional(WavSettings)
      .pipe(T.JsonName("wavSettings"))
      .annotations({ identifier: "WavSettings" }),
  }),
).annotations({
  identifier: "AudioCodecSettings",
}) as any as S.Schema<AudioCodecSettings>;
export interface InputChannelLevel {
  Gain?: number;
  InputChannel?: number;
}
export const InputChannelLevel = S.suspend(() =>
  S.Struct({
    Gain: S.optional(S.Number).pipe(T.JsonName("gain")),
    InputChannel: S.optional(S.Number).pipe(T.JsonName("inputChannel")),
  }),
).annotations({
  identifier: "InputChannelLevel",
}) as any as S.Schema<InputChannelLevel>;
export type __listOfInputChannelLevel = InputChannelLevel[];
export const __listOfInputChannelLevel = S.Array(InputChannelLevel);
export interface AudioChannelMapping {
  InputChannelLevels?: InputChannelLevel[];
  OutputChannel?: number;
}
export const AudioChannelMapping = S.suspend(() =>
  S.Struct({
    InputChannelLevels: S.optional(__listOfInputChannelLevel).pipe(
      T.JsonName("inputChannelLevels"),
    ),
    OutputChannel: S.optional(S.Number).pipe(T.JsonName("outputChannel")),
  }),
).annotations({
  identifier: "AudioChannelMapping",
}) as any as S.Schema<AudioChannelMapping>;
export type __listOfAudioChannelMapping = AudioChannelMapping[];
export const __listOfAudioChannelMapping = S.Array(AudioChannelMapping);
export interface RemixSettings {
  ChannelMappings?: AudioChannelMapping[];
  ChannelsIn?: number;
  ChannelsOut?: number;
}
export const RemixSettings = S.suspend(() =>
  S.Struct({
    ChannelMappings: S.optional(__listOfAudioChannelMapping).pipe(
      T.JsonName("channelMappings"),
    ),
    ChannelsIn: S.optional(S.Number).pipe(T.JsonName("channelsIn")),
    ChannelsOut: S.optional(S.Number).pipe(T.JsonName("channelsOut")),
  }),
).annotations({
  identifier: "RemixSettings",
}) as any as S.Schema<RemixSettings>;
export interface AudioDescription {
  AudioNormalizationSettings?: AudioNormalizationSettings;
  AudioSelectorName?: string;
  AudioType?: AudioType;
  AudioTypeControl?: AudioDescriptionAudioTypeControl;
  AudioWatermarkingSettings?: AudioWatermarkSettings;
  CodecSettings?: AudioCodecSettings;
  LanguageCode?: string;
  LanguageCodeControl?: AudioDescriptionLanguageCodeControl;
  Name?: string;
  RemixSettings?: RemixSettings;
  StreamName?: string;
  AudioDashRoles?: DashRoleAudio[];
  DvbDashAccessibility?: DvbDashAccessibility;
}
export const AudioDescription = S.suspend(() =>
  S.Struct({
    AudioNormalizationSettings: S.optional(AudioNormalizationSettings)
      .pipe(T.JsonName("audioNormalizationSettings"))
      .annotations({ identifier: "AudioNormalizationSettings" }),
    AudioSelectorName: S.optional(S.String).pipe(
      T.JsonName("audioSelectorName"),
    ),
    AudioType: S.optional(AudioType).pipe(T.JsonName("audioType")),
    AudioTypeControl: S.optional(AudioDescriptionAudioTypeControl).pipe(
      T.JsonName("audioTypeControl"),
    ),
    AudioWatermarkingSettings: S.optional(AudioWatermarkSettings)
      .pipe(T.JsonName("audioWatermarkingSettings"))
      .annotations({ identifier: "AudioWatermarkSettings" }),
    CodecSettings: S.optional(AudioCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "AudioCodecSettings" }),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageCodeControl: S.optional(AudioDescriptionLanguageCodeControl).pipe(
      T.JsonName("languageCodeControl"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RemixSettings: S.optional(RemixSettings)
      .pipe(T.JsonName("remixSettings"))
      .annotations({ identifier: "RemixSettings" }),
    StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
    AudioDashRoles: S.optional(__listOfDashRoleAudio).pipe(
      T.JsonName("audioDashRoles"),
    ),
    DvbDashAccessibility: S.optional(DvbDashAccessibility).pipe(
      T.JsonName("dvbDashAccessibility"),
    ),
  }),
).annotations({
  identifier: "AudioDescription",
}) as any as S.Schema<AudioDescription>;
export type __listOfAudioDescription = AudioDescription[];
export const __listOfAudioDescription = S.Array(AudioDescription);
export interface InputLocation {
  PasswordParam?: string;
  Uri?: string;
  Username?: string;
}
export const InputLocation = S.suspend(() =>
  S.Struct({
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    Uri: S.optional(S.String).pipe(T.JsonName("uri")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({
  identifier: "InputLocation",
}) as any as S.Schema<InputLocation>;
export interface AvailBlanking {
  AvailBlankingImage?: InputLocation;
  State?: AvailBlankingState;
}
export const AvailBlanking = S.suspend(() =>
  S.Struct({
    AvailBlankingImage: S.optional(InputLocation)
      .pipe(T.JsonName("availBlankingImage"))
      .annotations({ identifier: "InputLocation" }),
    State: S.optional(AvailBlankingState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "AvailBlanking",
}) as any as S.Schema<AvailBlanking>;
export interface Esam {
  AcquisitionPointId?: string;
  AdAvailOffset?: number;
  PasswordParam?: string;
  PoisEndpoint?: string;
  Username?: string;
  ZoneIdentity?: string;
}
export const Esam = S.suspend(() =>
  S.Struct({
    AcquisitionPointId: S.optional(S.String).pipe(
      T.JsonName("acquisitionPointId"),
    ),
    AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    PoisEndpoint: S.optional(S.String).pipe(T.JsonName("poisEndpoint")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
    ZoneIdentity: S.optional(S.String).pipe(T.JsonName("zoneIdentity")),
  }),
).annotations({ identifier: "Esam" }) as any as S.Schema<Esam>;
export type Scte35SpliceInsertNoRegionalBlackoutBehavior =
  | "FOLLOW"
  | "IGNORE"
  | (string & {});
export const Scte35SpliceInsertNoRegionalBlackoutBehavior = S.String;
export type Scte35SpliceInsertWebDeliveryAllowedBehavior =
  | "FOLLOW"
  | "IGNORE"
  | (string & {});
export const Scte35SpliceInsertWebDeliveryAllowedBehavior = S.String;
export interface Scte35SpliceInsert {
  AdAvailOffset?: number;
  NoRegionalBlackoutFlag?: Scte35SpliceInsertNoRegionalBlackoutBehavior;
  WebDeliveryAllowedFlag?: Scte35SpliceInsertWebDeliveryAllowedBehavior;
}
export const Scte35SpliceInsert = S.suspend(() =>
  S.Struct({
    AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
    NoRegionalBlackoutFlag: S.optional(
      Scte35SpliceInsertNoRegionalBlackoutBehavior,
    ).pipe(T.JsonName("noRegionalBlackoutFlag")),
    WebDeliveryAllowedFlag: S.optional(
      Scte35SpliceInsertWebDeliveryAllowedBehavior,
    ).pipe(T.JsonName("webDeliveryAllowedFlag")),
  }),
).annotations({
  identifier: "Scte35SpliceInsert",
}) as any as S.Schema<Scte35SpliceInsert>;
export type Scte35AposNoRegionalBlackoutBehavior =
  | "FOLLOW"
  | "IGNORE"
  | (string & {});
export const Scte35AposNoRegionalBlackoutBehavior = S.String;
export type Scte35AposWebDeliveryAllowedBehavior =
  | "FOLLOW"
  | "IGNORE"
  | (string & {});
export const Scte35AposWebDeliveryAllowedBehavior = S.String;
export interface Scte35TimeSignalApos {
  AdAvailOffset?: number;
  NoRegionalBlackoutFlag?: Scte35AposNoRegionalBlackoutBehavior;
  WebDeliveryAllowedFlag?: Scte35AposWebDeliveryAllowedBehavior;
}
export const Scte35TimeSignalApos = S.suspend(() =>
  S.Struct({
    AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
    NoRegionalBlackoutFlag: S.optional(
      Scte35AposNoRegionalBlackoutBehavior,
    ).pipe(T.JsonName("noRegionalBlackoutFlag")),
    WebDeliveryAllowedFlag: S.optional(
      Scte35AposWebDeliveryAllowedBehavior,
    ).pipe(T.JsonName("webDeliveryAllowedFlag")),
  }),
).annotations({
  identifier: "Scte35TimeSignalApos",
}) as any as S.Schema<Scte35TimeSignalApos>;
export interface AvailSettings {
  Esam?: Esam;
  Scte35SpliceInsert?: Scte35SpliceInsert;
  Scte35TimeSignalApos?: Scte35TimeSignalApos;
}
export const AvailSettings = S.suspend(() =>
  S.Struct({
    Esam: S.optional(Esam)
      .pipe(T.JsonName("esam"))
      .annotations({ identifier: "Esam" }),
    Scte35SpliceInsert: S.optional(Scte35SpliceInsert)
      .pipe(T.JsonName("scte35SpliceInsert"))
      .annotations({ identifier: "Scte35SpliceInsert" }),
    Scte35TimeSignalApos: S.optional(Scte35TimeSignalApos)
      .pipe(T.JsonName("scte35TimeSignalApos"))
      .annotations({ identifier: "Scte35TimeSignalApos" }),
  }),
).annotations({
  identifier: "AvailSettings",
}) as any as S.Schema<AvailSettings>;
export interface AvailConfiguration {
  AvailSettings?: AvailSettings;
  Scte35SegmentationScope?: Scte35SegmentationScope;
}
export const AvailConfiguration = S.suspend(() =>
  S.Struct({
    AvailSettings: S.optional(AvailSettings)
      .pipe(T.JsonName("availSettings"))
      .annotations({ identifier: "AvailSettings" }),
    Scte35SegmentationScope: S.optional(Scte35SegmentationScope).pipe(
      T.JsonName("scte35SegmentationScope"),
    ),
  }),
).annotations({
  identifier: "AvailConfiguration",
}) as any as S.Schema<AvailConfiguration>;
export interface BlackoutSlate {
  BlackoutSlateImage?: InputLocation;
  NetworkEndBlackout?: BlackoutSlateNetworkEndBlackout;
  NetworkEndBlackoutImage?: InputLocation;
  NetworkId?: string;
  State?: BlackoutSlateState;
}
export const BlackoutSlate = S.suspend(() =>
  S.Struct({
    BlackoutSlateImage: S.optional(InputLocation)
      .pipe(T.JsonName("blackoutSlateImage"))
      .annotations({ identifier: "InputLocation" }),
    NetworkEndBlackout: S.optional(BlackoutSlateNetworkEndBlackout).pipe(
      T.JsonName("networkEndBlackout"),
    ),
    NetworkEndBlackoutImage: S.optional(InputLocation)
      .pipe(T.JsonName("networkEndBlackoutImage"))
      .annotations({ identifier: "InputLocation" }),
    NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
    State: S.optional(BlackoutSlateState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "BlackoutSlate",
}) as any as S.Schema<BlackoutSlate>;
export interface AribDestinationSettings {}
export const AribDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AribDestinationSettings",
}) as any as S.Schema<AribDestinationSettings>;
export type BurnInAlignment = "CENTERED" | "LEFT" | "SMART" | (string & {});
export const BurnInAlignment = S.String;
export type BurnInBackgroundColor = "BLACK" | "NONE" | "WHITE" | (string & {});
export const BurnInBackgroundColor = S.String;
export type BurnInFontColor =
  | "BLACK"
  | "BLUE"
  | "GREEN"
  | "RED"
  | "WHITE"
  | "YELLOW"
  | (string & {});
export const BurnInFontColor = S.String;
export type BurnInOutlineColor =
  | "BLACK"
  | "BLUE"
  | "GREEN"
  | "RED"
  | "WHITE"
  | "YELLOW"
  | (string & {});
export const BurnInOutlineColor = S.String;
export type BurnInShadowColor = "BLACK" | "NONE" | "WHITE" | (string & {});
export const BurnInShadowColor = S.String;
export type BurnInTeletextGridControl = "FIXED" | "SCALED" | (string & {});
export const BurnInTeletextGridControl = S.String;
export type BurnInDestinationSubtitleRows =
  | "ROWS_16"
  | "ROWS_20"
  | "ROWS_24"
  | (string & {});
export const BurnInDestinationSubtitleRows = S.String;
export interface BurnInDestinationSettings {
  Alignment?: BurnInAlignment;
  BackgroundColor?: BurnInBackgroundColor;
  BackgroundOpacity?: number;
  Font?: InputLocation;
  FontColor?: BurnInFontColor;
  FontOpacity?: number;
  FontResolution?: number;
  FontSize?: string;
  OutlineColor?: BurnInOutlineColor;
  OutlineSize?: number;
  ShadowColor?: BurnInShadowColor;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  TeletextGridControl?: BurnInTeletextGridControl;
  XPosition?: number;
  YPosition?: number;
  SubtitleRows?: BurnInDestinationSubtitleRows;
}
export const BurnInDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(BurnInAlignment).pipe(T.JsonName("alignment")),
    BackgroundColor: S.optional(BurnInBackgroundColor).pipe(
      T.JsonName("backgroundColor"),
    ),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    Font: S.optional(InputLocation)
      .pipe(T.JsonName("font"))
      .annotations({ identifier: "InputLocation" }),
    FontColor: S.optional(BurnInFontColor).pipe(T.JsonName("fontColor")),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontSize: S.optional(S.String).pipe(T.JsonName("fontSize")),
    OutlineColor: S.optional(BurnInOutlineColor).pipe(
      T.JsonName("outlineColor"),
    ),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    ShadowColor: S.optional(BurnInShadowColor).pipe(T.JsonName("shadowColor")),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    TeletextGridControl: S.optional(BurnInTeletextGridControl).pipe(
      T.JsonName("teletextGridControl"),
    ),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
    SubtitleRows: S.optional(BurnInDestinationSubtitleRows).pipe(
      T.JsonName("subtitleRows"),
    ),
  }),
).annotations({
  identifier: "BurnInDestinationSettings",
}) as any as S.Schema<BurnInDestinationSettings>;
export type DvbSubDestinationAlignment =
  | "CENTERED"
  | "LEFT"
  | "SMART"
  | (string & {});
export const DvbSubDestinationAlignment = S.String;
export type DvbSubDestinationBackgroundColor =
  | "BLACK"
  | "NONE"
  | "WHITE"
  | (string & {});
export const DvbSubDestinationBackgroundColor = S.String;
export type DvbSubDestinationFontColor =
  | "BLACK"
  | "BLUE"
  | "GREEN"
  | "RED"
  | "WHITE"
  | "YELLOW"
  | (string & {});
export const DvbSubDestinationFontColor = S.String;
export type DvbSubDestinationOutlineColor =
  | "BLACK"
  | "BLUE"
  | "GREEN"
  | "RED"
  | "WHITE"
  | "YELLOW"
  | (string & {});
export const DvbSubDestinationOutlineColor = S.String;
export type DvbSubDestinationShadowColor =
  | "BLACK"
  | "NONE"
  | "WHITE"
  | (string & {});
export const DvbSubDestinationShadowColor = S.String;
export type DvbSubDestinationTeletextGridControl =
  | "FIXED"
  | "SCALED"
  | (string & {});
export const DvbSubDestinationTeletextGridControl = S.String;
export type DvbSubDestinationSubtitleRows =
  | "ROWS_16"
  | "ROWS_20"
  | "ROWS_24"
  | (string & {});
export const DvbSubDestinationSubtitleRows = S.String;
export interface DvbSubDestinationSettings {
  Alignment?: DvbSubDestinationAlignment;
  BackgroundColor?: DvbSubDestinationBackgroundColor;
  BackgroundOpacity?: number;
  Font?: InputLocation;
  FontColor?: DvbSubDestinationFontColor;
  FontOpacity?: number;
  FontResolution?: number;
  FontSize?: string;
  OutlineColor?: DvbSubDestinationOutlineColor;
  OutlineSize?: number;
  ShadowColor?: DvbSubDestinationShadowColor;
  ShadowOpacity?: number;
  ShadowXOffset?: number;
  ShadowYOffset?: number;
  TeletextGridControl?: DvbSubDestinationTeletextGridControl;
  XPosition?: number;
  YPosition?: number;
  SubtitleRows?: DvbSubDestinationSubtitleRows;
}
export const DvbSubDestinationSettings = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(DvbSubDestinationAlignment).pipe(
      T.JsonName("alignment"),
    ),
    BackgroundColor: S.optional(DvbSubDestinationBackgroundColor).pipe(
      T.JsonName("backgroundColor"),
    ),
    BackgroundOpacity: S.optional(S.Number).pipe(
      T.JsonName("backgroundOpacity"),
    ),
    Font: S.optional(InputLocation)
      .pipe(T.JsonName("font"))
      .annotations({ identifier: "InputLocation" }),
    FontColor: S.optional(DvbSubDestinationFontColor).pipe(
      T.JsonName("fontColor"),
    ),
    FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
    FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
    FontSize: S.optional(S.String).pipe(T.JsonName("fontSize")),
    OutlineColor: S.optional(DvbSubDestinationOutlineColor).pipe(
      T.JsonName("outlineColor"),
    ),
    OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
    ShadowColor: S.optional(DvbSubDestinationShadowColor).pipe(
      T.JsonName("shadowColor"),
    ),
    ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
    ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
    ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
    TeletextGridControl: S.optional(DvbSubDestinationTeletextGridControl).pipe(
      T.JsonName("teletextGridControl"),
    ),
    XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
    YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
    SubtitleRows: S.optional(DvbSubDestinationSubtitleRows).pipe(
      T.JsonName("subtitleRows"),
    ),
  }),
).annotations({
  identifier: "DvbSubDestinationSettings",
}) as any as S.Schema<DvbSubDestinationSettings>;
export type EbuTtDFillLineGapControl = "DISABLED" | "ENABLED" | (string & {});
export const EbuTtDFillLineGapControl = S.String;
export type EbuTtDDestinationStyleControl =
  | "EXCLUDE"
  | "INCLUDE"
  | (string & {});
export const EbuTtDDestinationStyleControl = S.String;
export interface EbuTtDDestinationSettings {
  CopyrightHolder?: string;
  FillLineGap?: EbuTtDFillLineGapControl;
  FontFamily?: string;
  StyleControl?: EbuTtDDestinationStyleControl;
  DefaultFontSize?: number;
  DefaultLineHeight?: number;
}
export const EbuTtDDestinationSettings = S.suspend(() =>
  S.Struct({
    CopyrightHolder: S.optional(S.String).pipe(T.JsonName("copyrightHolder")),
    FillLineGap: S.optional(EbuTtDFillLineGapControl).pipe(
      T.JsonName("fillLineGap"),
    ),
    FontFamily: S.optional(S.String).pipe(T.JsonName("fontFamily")),
    StyleControl: S.optional(EbuTtDDestinationStyleControl).pipe(
      T.JsonName("styleControl"),
    ),
    DefaultFontSize: S.optional(S.Number).pipe(T.JsonName("defaultFontSize")),
    DefaultLineHeight: S.optional(S.Number).pipe(
      T.JsonName("defaultLineHeight"),
    ),
  }),
).annotations({
  identifier: "EbuTtDDestinationSettings",
}) as any as S.Schema<EbuTtDDestinationSettings>;
export interface EmbeddedDestinationSettings {}
export const EmbeddedDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EmbeddedDestinationSettings",
}) as any as S.Schema<EmbeddedDestinationSettings>;
export interface EmbeddedPlusScte20DestinationSettings {}
export const EmbeddedPlusScte20DestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EmbeddedPlusScte20DestinationSettings",
}) as any as S.Schema<EmbeddedPlusScte20DestinationSettings>;
export interface RtmpCaptionInfoDestinationSettings {}
export const RtmpCaptionInfoDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RtmpCaptionInfoDestinationSettings",
}) as any as S.Schema<RtmpCaptionInfoDestinationSettings>;
export interface Scte20PlusEmbeddedDestinationSettings {}
export const Scte20PlusEmbeddedDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "Scte20PlusEmbeddedDestinationSettings",
}) as any as S.Schema<Scte20PlusEmbeddedDestinationSettings>;
export interface Scte27DestinationSettings {}
export const Scte27DestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "Scte27DestinationSettings",
}) as any as S.Schema<Scte27DestinationSettings>;
export interface SmpteTtDestinationSettings {}
export const SmpteTtDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SmpteTtDestinationSettings",
}) as any as S.Schema<SmpteTtDestinationSettings>;
export interface TeletextDestinationSettings {}
export const TeletextDestinationSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "TeletextDestinationSettings",
}) as any as S.Schema<TeletextDestinationSettings>;
export type TtmlDestinationStyleControl =
  | "PASSTHROUGH"
  | "USE_CONFIGURED"
  | (string & {});
export const TtmlDestinationStyleControl = S.String;
export interface TtmlDestinationSettings {
  StyleControl?: TtmlDestinationStyleControl;
}
export const TtmlDestinationSettings = S.suspend(() =>
  S.Struct({
    StyleControl: S.optional(TtmlDestinationStyleControl).pipe(
      T.JsonName("styleControl"),
    ),
  }),
).annotations({
  identifier: "TtmlDestinationSettings",
}) as any as S.Schema<TtmlDestinationSettings>;
export type WebvttDestinationStyleControl =
  | "NO_STYLE_DATA"
  | "PASSTHROUGH"
  | (string & {});
export const WebvttDestinationStyleControl = S.String;
export interface WebvttDestinationSettings {
  StyleControl?: WebvttDestinationStyleControl;
}
export const WebvttDestinationSettings = S.suspend(() =>
  S.Struct({
    StyleControl: S.optional(WebvttDestinationStyleControl).pipe(
      T.JsonName("styleControl"),
    ),
  }),
).annotations({
  identifier: "WebvttDestinationSettings",
}) as any as S.Schema<WebvttDestinationSettings>;
export interface CaptionDestinationSettings {
  AribDestinationSettings?: AribDestinationSettings;
  BurnInDestinationSettings?: BurnInDestinationSettings;
  DvbSubDestinationSettings?: DvbSubDestinationSettings;
  EbuTtDDestinationSettings?: EbuTtDDestinationSettings;
  EmbeddedDestinationSettings?: EmbeddedDestinationSettings;
  EmbeddedPlusScte20DestinationSettings?: EmbeddedPlusScte20DestinationSettings;
  RtmpCaptionInfoDestinationSettings?: RtmpCaptionInfoDestinationSettings;
  Scte20PlusEmbeddedDestinationSettings?: Scte20PlusEmbeddedDestinationSettings;
  Scte27DestinationSettings?: Scte27DestinationSettings;
  SmpteTtDestinationSettings?: SmpteTtDestinationSettings;
  TeletextDestinationSettings?: TeletextDestinationSettings;
  TtmlDestinationSettings?: TtmlDestinationSettings;
  WebvttDestinationSettings?: WebvttDestinationSettings;
}
export const CaptionDestinationSettings = S.suspend(() =>
  S.Struct({
    AribDestinationSettings: S.optional(AribDestinationSettings)
      .pipe(T.JsonName("aribDestinationSettings"))
      .annotations({ identifier: "AribDestinationSettings" }),
    BurnInDestinationSettings: S.optional(BurnInDestinationSettings)
      .pipe(T.JsonName("burnInDestinationSettings"))
      .annotations({ identifier: "BurnInDestinationSettings" }),
    DvbSubDestinationSettings: S.optional(DvbSubDestinationSettings)
      .pipe(T.JsonName("dvbSubDestinationSettings"))
      .annotations({ identifier: "DvbSubDestinationSettings" }),
    EbuTtDDestinationSettings: S.optional(EbuTtDDestinationSettings)
      .pipe(T.JsonName("ebuTtDDestinationSettings"))
      .annotations({ identifier: "EbuTtDDestinationSettings" }),
    EmbeddedDestinationSettings: S.optional(EmbeddedDestinationSettings)
      .pipe(T.JsonName("embeddedDestinationSettings"))
      .annotations({ identifier: "EmbeddedDestinationSettings" }),
    EmbeddedPlusScte20DestinationSettings: S.optional(
      EmbeddedPlusScte20DestinationSettings,
    )
      .pipe(T.JsonName("embeddedPlusScte20DestinationSettings"))
      .annotations({ identifier: "EmbeddedPlusScte20DestinationSettings" }),
    RtmpCaptionInfoDestinationSettings: S.optional(
      RtmpCaptionInfoDestinationSettings,
    )
      .pipe(T.JsonName("rtmpCaptionInfoDestinationSettings"))
      .annotations({ identifier: "RtmpCaptionInfoDestinationSettings" }),
    Scte20PlusEmbeddedDestinationSettings: S.optional(
      Scte20PlusEmbeddedDestinationSettings,
    )
      .pipe(T.JsonName("scte20PlusEmbeddedDestinationSettings"))
      .annotations({ identifier: "Scte20PlusEmbeddedDestinationSettings" }),
    Scte27DestinationSettings: S.optional(Scte27DestinationSettings)
      .pipe(T.JsonName("scte27DestinationSettings"))
      .annotations({ identifier: "Scte27DestinationSettings" }),
    SmpteTtDestinationSettings: S.optional(SmpteTtDestinationSettings)
      .pipe(T.JsonName("smpteTtDestinationSettings"))
      .annotations({ identifier: "SmpteTtDestinationSettings" }),
    TeletextDestinationSettings: S.optional(TeletextDestinationSettings)
      .pipe(T.JsonName("teletextDestinationSettings"))
      .annotations({ identifier: "TeletextDestinationSettings" }),
    TtmlDestinationSettings: S.optional(TtmlDestinationSettings)
      .pipe(T.JsonName("ttmlDestinationSettings"))
      .annotations({ identifier: "TtmlDestinationSettings" }),
    WebvttDestinationSettings: S.optional(WebvttDestinationSettings)
      .pipe(T.JsonName("webvttDestinationSettings"))
      .annotations({ identifier: "WebvttDestinationSettings" }),
  }),
).annotations({
  identifier: "CaptionDestinationSettings",
}) as any as S.Schema<CaptionDestinationSettings>;
export interface CaptionDescription {
  Accessibility?: AccessibilityType;
  CaptionSelectorName?: string;
  DestinationSettings?: CaptionDestinationSettings;
  LanguageCode?: string;
  LanguageDescription?: string;
  Name?: string;
  CaptionDashRoles?: DashRoleCaption[];
  DvbDashAccessibility?: DvbDashAccessibility;
}
export const CaptionDescription = S.suspend(() =>
  S.Struct({
    Accessibility: S.optional(AccessibilityType).pipe(
      T.JsonName("accessibility"),
    ),
    CaptionSelectorName: S.optional(S.String).pipe(
      T.JsonName("captionSelectorName"),
    ),
    DestinationSettings: S.optional(CaptionDestinationSettings)
      .pipe(T.JsonName("destinationSettings"))
      .annotations({ identifier: "CaptionDestinationSettings" }),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    CaptionDashRoles: S.optional(__listOfDashRoleCaption).pipe(
      T.JsonName("captionDashRoles"),
    ),
    DvbDashAccessibility: S.optional(DvbDashAccessibility).pipe(
      T.JsonName("dvbDashAccessibility"),
    ),
  }),
).annotations({
  identifier: "CaptionDescription",
}) as any as S.Schema<CaptionDescription>;
export type __listOfCaptionDescription = CaptionDescription[];
export const __listOfCaptionDescription = S.Array(CaptionDescription);
export interface FeatureActivations {
  InputPrepareScheduleActions?: FeatureActivationsInputPrepareScheduleActions;
  OutputStaticImageOverlayScheduleActions?: FeatureActivationsOutputStaticImageOverlayScheduleActions;
}
export const FeatureActivations = S.suspend(() =>
  S.Struct({
    InputPrepareScheduleActions: S.optional(
      FeatureActivationsInputPrepareScheduleActions,
    ).pipe(T.JsonName("inputPrepareScheduleActions")),
    OutputStaticImageOverlayScheduleActions: S.optional(
      FeatureActivationsOutputStaticImageOverlayScheduleActions,
    ).pipe(T.JsonName("outputStaticImageOverlayScheduleActions")),
  }),
).annotations({
  identifier: "FeatureActivations",
}) as any as S.Schema<FeatureActivations>;
export type InputLossImageType = "COLOR" | "SLATE" | (string & {});
export const InputLossImageType = S.String;
export interface InputLossBehavior {
  BlackFrameMsec?: number;
  InputLossImageColor?: string;
  InputLossImageSlate?: InputLocation;
  InputLossImageType?: InputLossImageType;
  RepeatFrameMsec?: number;
}
export const InputLossBehavior = S.suspend(() =>
  S.Struct({
    BlackFrameMsec: S.optional(S.Number).pipe(T.JsonName("blackFrameMsec")),
    InputLossImageColor: S.optional(S.String).pipe(
      T.JsonName("inputLossImageColor"),
    ),
    InputLossImageSlate: S.optional(InputLocation)
      .pipe(T.JsonName("inputLossImageSlate"))
      .annotations({ identifier: "InputLocation" }),
    InputLossImageType: S.optional(InputLossImageType).pipe(
      T.JsonName("inputLossImageType"),
    ),
    RepeatFrameMsec: S.optional(S.Number).pipe(T.JsonName("repeatFrameMsec")),
  }),
).annotations({
  identifier: "InputLossBehavior",
}) as any as S.Schema<InputLossBehavior>;
export interface EpochLockingSettings {
  CustomEpoch?: string;
  JamSyncTime?: string;
}
export const EpochLockingSettings = S.suspend(() =>
  S.Struct({
    CustomEpoch: S.optional(S.String).pipe(T.JsonName("customEpoch")),
    JamSyncTime: S.optional(S.String).pipe(T.JsonName("jamSyncTime")),
  }),
).annotations({
  identifier: "EpochLockingSettings",
}) as any as S.Schema<EpochLockingSettings>;
export type PipelineLockingMethod =
  | "SOURCE_TIMECODE"
  | "VIDEO_ALIGNMENT"
  | (string & {});
export const PipelineLockingMethod = S.String;
export interface PipelineLockingSettings {
  PipelineLockingMethod?: PipelineLockingMethod;
}
export const PipelineLockingSettings = S.suspend(() =>
  S.Struct({
    PipelineLockingMethod: S.optional(PipelineLockingMethod).pipe(
      T.JsonName("pipelineLockingMethod"),
    ),
  }),
).annotations({
  identifier: "PipelineLockingSettings",
}) as any as S.Schema<PipelineLockingSettings>;
export interface OutputLockingSettings {
  EpochLockingSettings?: EpochLockingSettings;
  PipelineLockingSettings?: PipelineLockingSettings;
}
export const OutputLockingSettings = S.suspend(() =>
  S.Struct({
    EpochLockingSettings: S.optional(EpochLockingSettings)
      .pipe(T.JsonName("epochLockingSettings"))
      .annotations({ identifier: "EpochLockingSettings" }),
    PipelineLockingSettings: S.optional(PipelineLockingSettings)
      .pipe(T.JsonName("pipelineLockingSettings"))
      .annotations({ identifier: "PipelineLockingSettings" }),
  }),
).annotations({
  identifier: "OutputLockingSettings",
}) as any as S.Schema<OutputLockingSettings>;
export interface GlobalConfiguration {
  InitialAudioGain?: number;
  InputEndAction?: GlobalConfigurationInputEndAction;
  InputLossBehavior?: InputLossBehavior;
  OutputLockingMode?: GlobalConfigurationOutputLockingMode;
  OutputTimingSource?: GlobalConfigurationOutputTimingSource;
  SupportLowFramerateInputs?: GlobalConfigurationLowFramerateInputs;
  OutputLockingSettings?: OutputLockingSettings;
}
export const GlobalConfiguration = S.suspend(() =>
  S.Struct({
    InitialAudioGain: S.optional(S.Number).pipe(T.JsonName("initialAudioGain")),
    InputEndAction: S.optional(GlobalConfigurationInputEndAction).pipe(
      T.JsonName("inputEndAction"),
    ),
    InputLossBehavior: S.optional(InputLossBehavior)
      .pipe(T.JsonName("inputLossBehavior"))
      .annotations({ identifier: "InputLossBehavior" }),
    OutputLockingMode: S.optional(GlobalConfigurationOutputLockingMode).pipe(
      T.JsonName("outputLockingMode"),
    ),
    OutputTimingSource: S.optional(GlobalConfigurationOutputTimingSource).pipe(
      T.JsonName("outputTimingSource"),
    ),
    SupportLowFramerateInputs: S.optional(
      GlobalConfigurationLowFramerateInputs,
    ).pipe(T.JsonName("supportLowFramerateInputs")),
    OutputLockingSettings: S.optional(OutputLockingSettings)
      .pipe(T.JsonName("outputLockingSettings"))
      .annotations({ identifier: "OutputLockingSettings" }),
  }),
).annotations({
  identifier: "GlobalConfiguration",
}) as any as S.Schema<GlobalConfiguration>;
export interface HtmlMotionGraphicsSettings {}
export const HtmlMotionGraphicsSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "HtmlMotionGraphicsSettings",
}) as any as S.Schema<HtmlMotionGraphicsSettings>;
export interface MotionGraphicsSettings {
  HtmlMotionGraphicsSettings?: HtmlMotionGraphicsSettings;
}
export const MotionGraphicsSettings = S.suspend(() =>
  S.Struct({
    HtmlMotionGraphicsSettings: S.optional(HtmlMotionGraphicsSettings)
      .pipe(T.JsonName("htmlMotionGraphicsSettings"))
      .annotations({ identifier: "HtmlMotionGraphicsSettings" }),
  }),
).annotations({
  identifier: "MotionGraphicsSettings",
}) as any as S.Schema<MotionGraphicsSettings>;
export interface MotionGraphicsConfiguration {
  MotionGraphicsInsertion?: MotionGraphicsInsertion;
  MotionGraphicsSettings?: MotionGraphicsSettings;
}
export const MotionGraphicsConfiguration = S.suspend(() =>
  S.Struct({
    MotionGraphicsInsertion: S.optional(MotionGraphicsInsertion).pipe(
      T.JsonName("motionGraphicsInsertion"),
    ),
    MotionGraphicsSettings: S.optional(MotionGraphicsSettings)
      .pipe(T.JsonName("motionGraphicsSettings"))
      .annotations({ identifier: "MotionGraphicsSettings" }),
  }),
).annotations({
  identifier: "MotionGraphicsConfiguration",
}) as any as S.Schema<MotionGraphicsConfiguration>;
export interface NielsenConfiguration {
  DistributorId?: string;
  NielsenPcmToId3Tagging?: NielsenPcmToId3TaggingState;
}
export const NielsenConfiguration = S.suspend(() =>
  S.Struct({
    DistributorId: S.optional(S.String).pipe(T.JsonName("distributorId")),
    NielsenPcmToId3Tagging: S.optional(NielsenPcmToId3TaggingState).pipe(
      T.JsonName("nielsenPcmToId3Tagging"),
    ),
  }),
).annotations({
  identifier: "NielsenConfiguration",
}) as any as S.Schema<NielsenConfiguration>;
export type S3CannedAcl =
  | "AUTHENTICATED_READ"
  | "BUCKET_OWNER_FULL_CONTROL"
  | "BUCKET_OWNER_READ"
  | "PUBLIC_READ"
  | (string & {});
export const S3CannedAcl = S.String;
export interface ArchiveS3Settings {
  CannedAcl?: S3CannedAcl;
}
export const ArchiveS3Settings = S.suspend(() =>
  S.Struct({
    CannedAcl: S.optional(S3CannedAcl).pipe(T.JsonName("cannedAcl")),
  }),
).annotations({
  identifier: "ArchiveS3Settings",
}) as any as S.Schema<ArchiveS3Settings>;
export interface ArchiveCdnSettings {
  ArchiveS3Settings?: ArchiveS3Settings;
}
export const ArchiveCdnSettings = S.suspend(() =>
  S.Struct({
    ArchiveS3Settings: S.optional(ArchiveS3Settings)
      .pipe(T.JsonName("archiveS3Settings"))
      .annotations({ identifier: "ArchiveS3Settings" }),
  }),
).annotations({
  identifier: "ArchiveCdnSettings",
}) as any as S.Schema<ArchiveCdnSettings>;
export interface OutputLocationRef {
  DestinationRefId?: string;
}
export const OutputLocationRef = S.suspend(() =>
  S.Struct({
    DestinationRefId: S.optional(S.String).pipe(T.JsonName("destinationRefId")),
  }),
).annotations({
  identifier: "OutputLocationRef",
}) as any as S.Schema<OutputLocationRef>;
export interface ArchiveGroupSettings {
  ArchiveCdnSettings?: ArchiveCdnSettings;
  Destination?: OutputLocationRef;
  RolloverInterval?: number;
}
export const ArchiveGroupSettings = S.suspend(() =>
  S.Struct({
    ArchiveCdnSettings: S.optional(ArchiveCdnSettings)
      .pipe(T.JsonName("archiveCdnSettings"))
      .annotations({ identifier: "ArchiveCdnSettings" }),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    RolloverInterval: S.optional(S.Number).pipe(T.JsonName("rolloverInterval")),
  }),
).annotations({
  identifier: "ArchiveGroupSettings",
}) as any as S.Schema<ArchiveGroupSettings>;
export interface FrameCaptureS3Settings {
  CannedAcl?: S3CannedAcl;
}
export const FrameCaptureS3Settings = S.suspend(() =>
  S.Struct({
    CannedAcl: S.optional(S3CannedAcl).pipe(T.JsonName("cannedAcl")),
  }),
).annotations({
  identifier: "FrameCaptureS3Settings",
}) as any as S.Schema<FrameCaptureS3Settings>;
export interface FrameCaptureCdnSettings {
  FrameCaptureS3Settings?: FrameCaptureS3Settings;
}
export const FrameCaptureCdnSettings = S.suspend(() =>
  S.Struct({
    FrameCaptureS3Settings: S.optional(FrameCaptureS3Settings)
      .pipe(T.JsonName("frameCaptureS3Settings"))
      .annotations({ identifier: "FrameCaptureS3Settings" }),
  }),
).annotations({
  identifier: "FrameCaptureCdnSettings",
}) as any as S.Schema<FrameCaptureCdnSettings>;
export interface FrameCaptureGroupSettings {
  Destination?: OutputLocationRef;
  FrameCaptureCdnSettings?: FrameCaptureCdnSettings;
}
export const FrameCaptureGroupSettings = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    FrameCaptureCdnSettings: S.optional(FrameCaptureCdnSettings)
      .pipe(T.JsonName("frameCaptureCdnSettings"))
      .annotations({ identifier: "FrameCaptureCdnSettings" }),
  }),
).annotations({
  identifier: "FrameCaptureGroupSettings",
}) as any as S.Schema<FrameCaptureGroupSettings>;
export type HlsAdMarkers =
  | "ADOBE"
  | "ELEMENTAL"
  | "ELEMENTAL_SCTE35"
  | (string & {});
export const HlsAdMarkers = S.String;
export type __listOfHlsAdMarkers = HlsAdMarkers[];
export const __listOfHlsAdMarkers = S.Array(HlsAdMarkers);
export interface CaptionLanguageMapping {
  CaptionChannel?: number;
  LanguageCode?: string;
  LanguageDescription?: string;
}
export const CaptionLanguageMapping = S.suspend(() =>
  S.Struct({
    CaptionChannel: S.optional(S.Number).pipe(T.JsonName("captionChannel")),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageDescription: S.optional(S.String).pipe(
      T.JsonName("languageDescription"),
    ),
  }),
).annotations({
  identifier: "CaptionLanguageMapping",
}) as any as S.Schema<CaptionLanguageMapping>;
export type __listOfCaptionLanguageMapping = CaptionLanguageMapping[];
export const __listOfCaptionLanguageMapping = S.Array(CaptionLanguageMapping);
export type HlsCaptionLanguageSetting =
  | "INSERT"
  | "NONE"
  | "OMIT"
  | (string & {});
export const HlsCaptionLanguageSetting = S.String;
export type HlsClientCache = "DISABLED" | "ENABLED" | (string & {});
export const HlsClientCache = S.String;
export type HlsCodecSpecification = "RFC_4281" | "RFC_6381" | (string & {});
export const HlsCodecSpecification = S.String;
export type HlsDirectoryStructure =
  | "SINGLE_DIRECTORY"
  | "SUBDIRECTORY_PER_STREAM"
  | (string & {});
export const HlsDirectoryStructure = S.String;
export type HlsDiscontinuityTags = "INSERT" | "NEVER_INSERT" | (string & {});
export const HlsDiscontinuityTags = S.String;
export type HlsEncryptionType = "AES128" | "SAMPLE_AES" | (string & {});
export const HlsEncryptionType = S.String;
export type HlsAkamaiHttpTransferMode =
  | "CHUNKED"
  | "NON_CHUNKED"
  | (string & {});
export const HlsAkamaiHttpTransferMode = S.String;
export interface HlsAkamaiSettings {
  ConnectionRetryInterval?: number;
  FilecacheDuration?: number;
  HttpTransferMode?: HlsAkamaiHttpTransferMode;
  NumRetries?: number;
  RestartDelay?: number;
  Salt?: string;
  Token?: string;
}
export const HlsAkamaiSettings = S.suspend(() =>
  S.Struct({
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    FilecacheDuration: S.optional(S.Number).pipe(
      T.JsonName("filecacheDuration"),
    ),
    HttpTransferMode: S.optional(HlsAkamaiHttpTransferMode).pipe(
      T.JsonName("httpTransferMode"),
    ),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
    Salt: S.optional(S.String).pipe(T.JsonName("salt")),
    Token: S.optional(S.String).pipe(T.JsonName("token")),
  }),
).annotations({
  identifier: "HlsAkamaiSettings",
}) as any as S.Schema<HlsAkamaiSettings>;
export interface HlsBasicPutSettings {
  ConnectionRetryInterval?: number;
  FilecacheDuration?: number;
  NumRetries?: number;
  RestartDelay?: number;
}
export const HlsBasicPutSettings = S.suspend(() =>
  S.Struct({
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    FilecacheDuration: S.optional(S.Number).pipe(
      T.JsonName("filecacheDuration"),
    ),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  }),
).annotations({
  identifier: "HlsBasicPutSettings",
}) as any as S.Schema<HlsBasicPutSettings>;
export type HlsMediaStoreStorageClass = "TEMPORAL" | (string & {});
export const HlsMediaStoreStorageClass = S.String;
export interface HlsMediaStoreSettings {
  ConnectionRetryInterval?: number;
  FilecacheDuration?: number;
  MediaStoreStorageClass?: HlsMediaStoreStorageClass;
  NumRetries?: number;
  RestartDelay?: number;
}
export const HlsMediaStoreSettings = S.suspend(() =>
  S.Struct({
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    FilecacheDuration: S.optional(S.Number).pipe(
      T.JsonName("filecacheDuration"),
    ),
    MediaStoreStorageClass: S.optional(HlsMediaStoreStorageClass).pipe(
      T.JsonName("mediaStoreStorageClass"),
    ),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  }),
).annotations({
  identifier: "HlsMediaStoreSettings",
}) as any as S.Schema<HlsMediaStoreSettings>;
export interface HlsS3Settings {
  CannedAcl?: S3CannedAcl;
}
export const HlsS3Settings = S.suspend(() =>
  S.Struct({
    CannedAcl: S.optional(S3CannedAcl).pipe(T.JsonName("cannedAcl")),
  }),
).annotations({
  identifier: "HlsS3Settings",
}) as any as S.Schema<HlsS3Settings>;
export type HlsWebdavHttpTransferMode =
  | "CHUNKED"
  | "NON_CHUNKED"
  | (string & {});
export const HlsWebdavHttpTransferMode = S.String;
export interface HlsWebdavSettings {
  ConnectionRetryInterval?: number;
  FilecacheDuration?: number;
  HttpTransferMode?: HlsWebdavHttpTransferMode;
  NumRetries?: number;
  RestartDelay?: number;
}
export const HlsWebdavSettings = S.suspend(() =>
  S.Struct({
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    FilecacheDuration: S.optional(S.Number).pipe(
      T.JsonName("filecacheDuration"),
    ),
    HttpTransferMode: S.optional(HlsWebdavHttpTransferMode).pipe(
      T.JsonName("httpTransferMode"),
    ),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  }),
).annotations({
  identifier: "HlsWebdavSettings",
}) as any as S.Schema<HlsWebdavSettings>;
export interface HlsCdnSettings {
  HlsAkamaiSettings?: HlsAkamaiSettings;
  HlsBasicPutSettings?: HlsBasicPutSettings;
  HlsMediaStoreSettings?: HlsMediaStoreSettings;
  HlsS3Settings?: HlsS3Settings;
  HlsWebdavSettings?: HlsWebdavSettings;
}
export const HlsCdnSettings = S.suspend(() =>
  S.Struct({
    HlsAkamaiSettings: S.optional(HlsAkamaiSettings)
      .pipe(T.JsonName("hlsAkamaiSettings"))
      .annotations({ identifier: "HlsAkamaiSettings" }),
    HlsBasicPutSettings: S.optional(HlsBasicPutSettings)
      .pipe(T.JsonName("hlsBasicPutSettings"))
      .annotations({ identifier: "HlsBasicPutSettings" }),
    HlsMediaStoreSettings: S.optional(HlsMediaStoreSettings)
      .pipe(T.JsonName("hlsMediaStoreSettings"))
      .annotations({ identifier: "HlsMediaStoreSettings" }),
    HlsS3Settings: S.optional(HlsS3Settings)
      .pipe(T.JsonName("hlsS3Settings"))
      .annotations({ identifier: "HlsS3Settings" }),
    HlsWebdavSettings: S.optional(HlsWebdavSettings)
      .pipe(T.JsonName("hlsWebdavSettings"))
      .annotations({ identifier: "HlsWebdavSettings" }),
  }),
).annotations({
  identifier: "HlsCdnSettings",
}) as any as S.Schema<HlsCdnSettings>;
export type HlsId3SegmentTaggingState = "DISABLED" | "ENABLED" | (string & {});
export const HlsId3SegmentTaggingState = S.String;
export type IFrameOnlyPlaylistType = "DISABLED" | "STANDARD" | (string & {});
export const IFrameOnlyPlaylistType = S.String;
export type HlsIncompleteSegmentBehavior = "AUTO" | "SUPPRESS" | (string & {});
export const HlsIncompleteSegmentBehavior = S.String;
export type InputLossActionForHlsOut =
  | "EMIT_OUTPUT"
  | "PAUSE_OUTPUT"
  | (string & {});
export const InputLossActionForHlsOut = S.String;
export type HlsIvInManifest = "EXCLUDE" | "INCLUDE" | (string & {});
export const HlsIvInManifest = S.String;
export type HlsIvSource = "EXPLICIT" | "FOLLOWS_SEGMENT_NUMBER" | (string & {});
export const HlsIvSource = S.String;
export interface StaticKeySettings {
  KeyProviderServer?: InputLocation;
  StaticKeyValue?: string;
}
export const StaticKeySettings = S.suspend(() =>
  S.Struct({
    KeyProviderServer: S.optional(InputLocation)
      .pipe(T.JsonName("keyProviderServer"))
      .annotations({ identifier: "InputLocation" }),
    StaticKeyValue: S.optional(S.String).pipe(T.JsonName("staticKeyValue")),
  }),
).annotations({
  identifier: "StaticKeySettings",
}) as any as S.Schema<StaticKeySettings>;
export interface KeyProviderSettings {
  StaticKeySettings?: StaticKeySettings;
}
export const KeyProviderSettings = S.suspend(() =>
  S.Struct({
    StaticKeySettings: S.optional(StaticKeySettings)
      .pipe(T.JsonName("staticKeySettings"))
      .annotations({ identifier: "StaticKeySettings" }),
  }),
).annotations({
  identifier: "KeyProviderSettings",
}) as any as S.Schema<KeyProviderSettings>;
export type HlsManifestCompression = "GZIP" | "NONE" | (string & {});
export const HlsManifestCompression = S.String;
export type HlsManifestDurationFormat =
  | "FLOATING_POINT"
  | "INTEGER"
  | (string & {});
export const HlsManifestDurationFormat = S.String;
export type HlsMode = "LIVE" | "VOD" | (string & {});
export const HlsMode = S.String;
export type HlsOutputSelection =
  | "MANIFESTS_AND_SEGMENTS"
  | "SEGMENTS_ONLY"
  | "VARIANT_MANIFESTS_AND_SEGMENTS"
  | (string & {});
export const HlsOutputSelection = S.String;
export type HlsProgramDateTime = "EXCLUDE" | "INCLUDE" | (string & {});
export const HlsProgramDateTime = S.String;
export type HlsProgramDateTimeClock =
  | "INITIALIZE_FROM_OUTPUT_TIMECODE"
  | "SYSTEM_CLOCK"
  | (string & {});
export const HlsProgramDateTimeClock = S.String;
export type HlsRedundantManifest = "DISABLED" | "ENABLED" | (string & {});
export const HlsRedundantManifest = S.String;
export type HlsSegmentationMode =
  | "USE_INPUT_SEGMENTATION"
  | "USE_SEGMENT_DURATION"
  | (string & {});
export const HlsSegmentationMode = S.String;
export type HlsStreamInfResolution = "EXCLUDE" | "INCLUDE" | (string & {});
export const HlsStreamInfResolution = S.String;
export type HlsTimedMetadataId3Frame = "NONE" | "PRIV" | "TDRL" | (string & {});
export const HlsTimedMetadataId3Frame = S.String;
export type HlsTsFileMode = "SEGMENTED_FILES" | "SINGLE_FILE" | (string & {});
export const HlsTsFileMode = S.String;
export interface HlsGroupSettings {
  AdMarkers?: HlsAdMarkers[];
  BaseUrlContent?: string;
  BaseUrlContent1?: string;
  BaseUrlManifest?: string;
  BaseUrlManifest1?: string;
  CaptionLanguageMappings?: CaptionLanguageMapping[];
  CaptionLanguageSetting?: HlsCaptionLanguageSetting;
  ClientCache?: HlsClientCache;
  CodecSpecification?: HlsCodecSpecification;
  ConstantIv?: string;
  Destination?: OutputLocationRef;
  DirectoryStructure?: HlsDirectoryStructure;
  DiscontinuityTags?: HlsDiscontinuityTags;
  EncryptionType?: HlsEncryptionType;
  HlsCdnSettings?: HlsCdnSettings;
  HlsId3SegmentTagging?: HlsId3SegmentTaggingState;
  IFrameOnlyPlaylists?: IFrameOnlyPlaylistType;
  IncompleteSegmentBehavior?: HlsIncompleteSegmentBehavior;
  IndexNSegments?: number;
  InputLossAction?: InputLossActionForHlsOut;
  IvInManifest?: HlsIvInManifest;
  IvSource?: HlsIvSource;
  KeepSegments?: number;
  KeyFormat?: string;
  KeyFormatVersions?: string;
  KeyProviderSettings?: KeyProviderSettings;
  ManifestCompression?: HlsManifestCompression;
  ManifestDurationFormat?: HlsManifestDurationFormat;
  MinSegmentLength?: number;
  Mode?: HlsMode;
  OutputSelection?: HlsOutputSelection;
  ProgramDateTime?: HlsProgramDateTime;
  ProgramDateTimeClock?: HlsProgramDateTimeClock;
  ProgramDateTimePeriod?: number;
  RedundantManifest?: HlsRedundantManifest;
  SegmentLength?: number;
  SegmentationMode?: HlsSegmentationMode;
  SegmentsPerSubdirectory?: number;
  StreamInfResolution?: HlsStreamInfResolution;
  TimedMetadataId3Frame?: HlsTimedMetadataId3Frame;
  TimedMetadataId3Period?: number;
  TimestampDeltaMilliseconds?: number;
  TsFileMode?: HlsTsFileMode;
}
export const HlsGroupSettings = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(__listOfHlsAdMarkers).pipe(T.JsonName("adMarkers")),
    BaseUrlContent: S.optional(S.String).pipe(T.JsonName("baseUrlContent")),
    BaseUrlContent1: S.optional(S.String).pipe(T.JsonName("baseUrlContent1")),
    BaseUrlManifest: S.optional(S.String).pipe(T.JsonName("baseUrlManifest")),
    BaseUrlManifest1: S.optional(S.String).pipe(T.JsonName("baseUrlManifest1")),
    CaptionLanguageMappings: S.optional(__listOfCaptionLanguageMapping).pipe(
      T.JsonName("captionLanguageMappings"),
    ),
    CaptionLanguageSetting: S.optional(HlsCaptionLanguageSetting).pipe(
      T.JsonName("captionLanguageSetting"),
    ),
    ClientCache: S.optional(HlsClientCache).pipe(T.JsonName("clientCache")),
    CodecSpecification: S.optional(HlsCodecSpecification).pipe(
      T.JsonName("codecSpecification"),
    ),
    ConstantIv: S.optional(S.String).pipe(T.JsonName("constantIv")),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    DirectoryStructure: S.optional(HlsDirectoryStructure).pipe(
      T.JsonName("directoryStructure"),
    ),
    DiscontinuityTags: S.optional(HlsDiscontinuityTags).pipe(
      T.JsonName("discontinuityTags"),
    ),
    EncryptionType: S.optional(HlsEncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    HlsCdnSettings: S.optional(HlsCdnSettings)
      .pipe(T.JsonName("hlsCdnSettings"))
      .annotations({ identifier: "HlsCdnSettings" }),
    HlsId3SegmentTagging: S.optional(HlsId3SegmentTaggingState).pipe(
      T.JsonName("hlsId3SegmentTagging"),
    ),
    IFrameOnlyPlaylists: S.optional(IFrameOnlyPlaylistType).pipe(
      T.JsonName("iFrameOnlyPlaylists"),
    ),
    IncompleteSegmentBehavior: S.optional(HlsIncompleteSegmentBehavior).pipe(
      T.JsonName("incompleteSegmentBehavior"),
    ),
    IndexNSegments: S.optional(S.Number).pipe(T.JsonName("indexNSegments")),
    InputLossAction: S.optional(InputLossActionForHlsOut).pipe(
      T.JsonName("inputLossAction"),
    ),
    IvInManifest: S.optional(HlsIvInManifest).pipe(T.JsonName("ivInManifest")),
    IvSource: S.optional(HlsIvSource).pipe(T.JsonName("ivSource")),
    KeepSegments: S.optional(S.Number).pipe(T.JsonName("keepSegments")),
    KeyFormat: S.optional(S.String).pipe(T.JsonName("keyFormat")),
    KeyFormatVersions: S.optional(S.String).pipe(
      T.JsonName("keyFormatVersions"),
    ),
    KeyProviderSettings: S.optional(KeyProviderSettings)
      .pipe(T.JsonName("keyProviderSettings"))
      .annotations({ identifier: "KeyProviderSettings" }),
    ManifestCompression: S.optional(HlsManifestCompression).pipe(
      T.JsonName("manifestCompression"),
    ),
    ManifestDurationFormat: S.optional(HlsManifestDurationFormat).pipe(
      T.JsonName("manifestDurationFormat"),
    ),
    MinSegmentLength: S.optional(S.Number).pipe(T.JsonName("minSegmentLength")),
    Mode: S.optional(HlsMode).pipe(T.JsonName("mode")),
    OutputSelection: S.optional(HlsOutputSelection).pipe(
      T.JsonName("outputSelection"),
    ),
    ProgramDateTime: S.optional(HlsProgramDateTime).pipe(
      T.JsonName("programDateTime"),
    ),
    ProgramDateTimeClock: S.optional(HlsProgramDateTimeClock).pipe(
      T.JsonName("programDateTimeClock"),
    ),
    ProgramDateTimePeriod: S.optional(S.Number).pipe(
      T.JsonName("programDateTimePeriod"),
    ),
    RedundantManifest: S.optional(HlsRedundantManifest).pipe(
      T.JsonName("redundantManifest"),
    ),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentationMode: S.optional(HlsSegmentationMode).pipe(
      T.JsonName("segmentationMode"),
    ),
    SegmentsPerSubdirectory: S.optional(S.Number).pipe(
      T.JsonName("segmentsPerSubdirectory"),
    ),
    StreamInfResolution: S.optional(HlsStreamInfResolution).pipe(
      T.JsonName("streamInfResolution"),
    ),
    TimedMetadataId3Frame: S.optional(HlsTimedMetadataId3Frame).pipe(
      T.JsonName("timedMetadataId3Frame"),
    ),
    TimedMetadataId3Period: S.optional(S.Number).pipe(
      T.JsonName("timedMetadataId3Period"),
    ),
    TimestampDeltaMilliseconds: S.optional(S.Number).pipe(
      T.JsonName("timestampDeltaMilliseconds"),
    ),
    TsFileMode: S.optional(HlsTsFileMode).pipe(T.JsonName("tsFileMode")),
  }),
).annotations({
  identifier: "HlsGroupSettings",
}) as any as S.Schema<HlsGroupSettings>;
export type CmafId3Behavior = "DISABLED" | "ENABLED" | (string & {});
export const CmafId3Behavior = S.String;
export type CmafKLVBehavior = "NO_PASSTHROUGH" | "PASSTHROUGH" | (string & {});
export const CmafKLVBehavior = S.String;
export type CmafNielsenId3Behavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const CmafNielsenId3Behavior = S.String;
export type Scte35Type =
  | "NONE"
  | "SCTE_35_WITHOUT_SEGMENTATION"
  | (string & {});
export const Scte35Type = S.String;
export type CmafIngestSegmentLengthUnits =
  | "MILLISECONDS"
  | "SECONDS"
  | (string & {});
export const CmafIngestSegmentLengthUnits = S.String;
export type CmafTimedMetadataId3Frame =
  | "NONE"
  | "PRIV"
  | "TDRL"
  | (string & {});
export const CmafTimedMetadataId3Frame = S.String;
export type CmafTimedMetadataPassthrough =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const CmafTimedMetadataPassthrough = S.String;
export interface MediaPackageAdditionalDestinations {
  Destination?: OutputLocationRef;
}
export const MediaPackageAdditionalDestinations = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
  }),
).annotations({
  identifier: "MediaPackageAdditionalDestinations",
}) as any as S.Schema<MediaPackageAdditionalDestinations>;
export type __listOfMediaPackageAdditionalDestinations =
  MediaPackageAdditionalDestinations[];
export const __listOfMediaPackageAdditionalDestinations = S.Array(
  MediaPackageAdditionalDestinations,
);
export interface MediaPackageV2GroupSettings {
  CaptionLanguageMappings?: CaptionLanguageMapping[];
  Id3Behavior?: CmafId3Behavior;
  KlvBehavior?: CmafKLVBehavior;
  NielsenId3Behavior?: CmafNielsenId3Behavior;
  Scte35Type?: Scte35Type;
  SegmentLength?: number;
  SegmentLengthUnits?: CmafIngestSegmentLengthUnits;
  TimedMetadataId3Frame?: CmafTimedMetadataId3Frame;
  TimedMetadataId3Period?: number;
  TimedMetadataPassthrough?: CmafTimedMetadataPassthrough;
  AdditionalDestinations?: MediaPackageAdditionalDestinations[];
}
export const MediaPackageV2GroupSettings = S.suspend(() =>
  S.Struct({
    CaptionLanguageMappings: S.optional(__listOfCaptionLanguageMapping).pipe(
      T.JsonName("captionLanguageMappings"),
    ),
    Id3Behavior: S.optional(CmafId3Behavior).pipe(T.JsonName("id3Behavior")),
    KlvBehavior: S.optional(CmafKLVBehavior).pipe(T.JsonName("klvBehavior")),
    NielsenId3Behavior: S.optional(CmafNielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    Scte35Type: S.optional(Scte35Type).pipe(T.JsonName("scte35Type")),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthUnits: S.optional(CmafIngestSegmentLengthUnits).pipe(
      T.JsonName("segmentLengthUnits"),
    ),
    TimedMetadataId3Frame: S.optional(CmafTimedMetadataId3Frame).pipe(
      T.JsonName("timedMetadataId3Frame"),
    ),
    TimedMetadataId3Period: S.optional(S.Number).pipe(
      T.JsonName("timedMetadataId3Period"),
    ),
    TimedMetadataPassthrough: S.optional(CmafTimedMetadataPassthrough).pipe(
      T.JsonName("timedMetadataPassthrough"),
    ),
    AdditionalDestinations: S.optional(
      __listOfMediaPackageAdditionalDestinations,
    ).pipe(T.JsonName("additionalDestinations")),
  }),
).annotations({
  identifier: "MediaPackageV2GroupSettings",
}) as any as S.Schema<MediaPackageV2GroupSettings>;
export interface MediaPackageGroupSettings {
  Destination?: OutputLocationRef;
  MediapackageV2GroupSettings?: MediaPackageV2GroupSettings;
}
export const MediaPackageGroupSettings = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    MediapackageV2GroupSettings: S.optional(MediaPackageV2GroupSettings)
      .pipe(T.JsonName("mediapackageV2GroupSettings"))
      .annotations({ identifier: "MediaPackageV2GroupSettings" }),
  }),
).annotations({
  identifier: "MediaPackageGroupSettings",
}) as any as S.Schema<MediaPackageGroupSettings>;
export type SmoothGroupAudioOnlyTimecodeControl =
  | "PASSTHROUGH"
  | "USE_CONFIGURED_CLOCK"
  | (string & {});
export const SmoothGroupAudioOnlyTimecodeControl = S.String;
export type SmoothGroupCertificateMode =
  | "SELF_SIGNED"
  | "VERIFY_AUTHENTICITY"
  | (string & {});
export const SmoothGroupCertificateMode = S.String;
export type SmoothGroupEventIdMode =
  | "NO_EVENT_ID"
  | "USE_CONFIGURED"
  | "USE_TIMESTAMP"
  | (string & {});
export const SmoothGroupEventIdMode = S.String;
export type SmoothGroupEventStopBehavior = "NONE" | "SEND_EOS" | (string & {});
export const SmoothGroupEventStopBehavior = S.String;
export type InputLossActionForMsSmoothOut =
  | "EMIT_OUTPUT"
  | "PAUSE_OUTPUT"
  | (string & {});
export const InputLossActionForMsSmoothOut = S.String;
export type SmoothGroupSegmentationMode =
  | "USE_INPUT_SEGMENTATION"
  | "USE_SEGMENT_DURATION"
  | (string & {});
export const SmoothGroupSegmentationMode = S.String;
export type SmoothGroupSparseTrackType =
  | "NONE"
  | "SCTE_35"
  | "SCTE_35_WITHOUT_SEGMENTATION"
  | (string & {});
export const SmoothGroupSparseTrackType = S.String;
export type SmoothGroupStreamManifestBehavior =
  | "DO_NOT_SEND"
  | "SEND"
  | (string & {});
export const SmoothGroupStreamManifestBehavior = S.String;
export type SmoothGroupTimestampOffsetMode =
  | "USE_CONFIGURED_OFFSET"
  | "USE_EVENT_START_DATE"
  | (string & {});
export const SmoothGroupTimestampOffsetMode = S.String;
export interface MsSmoothGroupSettings {
  AcquisitionPointId?: string;
  AudioOnlyTimecodeControl?: SmoothGroupAudioOnlyTimecodeControl;
  CertificateMode?: SmoothGroupCertificateMode;
  ConnectionRetryInterval?: number;
  Destination?: OutputLocationRef;
  EventId?: string;
  EventIdMode?: SmoothGroupEventIdMode;
  EventStopBehavior?: SmoothGroupEventStopBehavior;
  FilecacheDuration?: number;
  FragmentLength?: number;
  InputLossAction?: InputLossActionForMsSmoothOut;
  NumRetries?: number;
  RestartDelay?: number;
  SegmentationMode?: SmoothGroupSegmentationMode;
  SendDelayMs?: number;
  SparseTrackType?: SmoothGroupSparseTrackType;
  StreamManifestBehavior?: SmoothGroupStreamManifestBehavior;
  TimestampOffset?: string;
  TimestampOffsetMode?: SmoothGroupTimestampOffsetMode;
}
export const MsSmoothGroupSettings = S.suspend(() =>
  S.Struct({
    AcquisitionPointId: S.optional(S.String).pipe(
      T.JsonName("acquisitionPointId"),
    ),
    AudioOnlyTimecodeControl: S.optional(
      SmoothGroupAudioOnlyTimecodeControl,
    ).pipe(T.JsonName("audioOnlyTimecodeControl")),
    CertificateMode: S.optional(SmoothGroupCertificateMode).pipe(
      T.JsonName("certificateMode"),
    ),
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    EventId: S.optional(S.String).pipe(T.JsonName("eventId")),
    EventIdMode: S.optional(SmoothGroupEventIdMode).pipe(
      T.JsonName("eventIdMode"),
    ),
    EventStopBehavior: S.optional(SmoothGroupEventStopBehavior).pipe(
      T.JsonName("eventStopBehavior"),
    ),
    FilecacheDuration: S.optional(S.Number).pipe(
      T.JsonName("filecacheDuration"),
    ),
    FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
    InputLossAction: S.optional(InputLossActionForMsSmoothOut).pipe(
      T.JsonName("inputLossAction"),
    ),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
    SegmentationMode: S.optional(SmoothGroupSegmentationMode).pipe(
      T.JsonName("segmentationMode"),
    ),
    SendDelayMs: S.optional(S.Number).pipe(T.JsonName("sendDelayMs")),
    SparseTrackType: S.optional(SmoothGroupSparseTrackType).pipe(
      T.JsonName("sparseTrackType"),
    ),
    StreamManifestBehavior: S.optional(SmoothGroupStreamManifestBehavior).pipe(
      T.JsonName("streamManifestBehavior"),
    ),
    TimestampOffset: S.optional(S.String).pipe(T.JsonName("timestampOffset")),
    TimestampOffsetMode: S.optional(SmoothGroupTimestampOffsetMode).pipe(
      T.JsonName("timestampOffsetMode"),
    ),
  }),
).annotations({
  identifier: "MsSmoothGroupSettings",
}) as any as S.Schema<MsSmoothGroupSettings>;
export interface MultiplexGroupSettings {}
export const MultiplexGroupSettings = S.suspend(() => S.Struct({})).annotations(
  { identifier: "MultiplexGroupSettings" },
) as any as S.Schema<MultiplexGroupSettings>;
export type RtmpAdMarkers = "ON_CUE_POINT_SCTE35" | (string & {});
export const RtmpAdMarkers = S.String;
export type __listOfRtmpAdMarkers = RtmpAdMarkers[];
export const __listOfRtmpAdMarkers = S.Array(RtmpAdMarkers);
export type AuthenticationScheme = "AKAMAI" | "COMMON" | (string & {});
export const AuthenticationScheme = S.String;
export type RtmpCacheFullBehavior =
  | "DISCONNECT_IMMEDIATELY"
  | "WAIT_FOR_SERVER"
  | (string & {});
export const RtmpCacheFullBehavior = S.String;
export type RtmpCaptionData =
  | "ALL"
  | "FIELD1_608"
  | "FIELD1_AND_FIELD2_608"
  | (string & {});
export const RtmpCaptionData = S.String;
export type InputLossActionForRtmpOut =
  | "EMIT_OUTPUT"
  | "PAUSE_OUTPUT"
  | (string & {});
export const InputLossActionForRtmpOut = S.String;
export type IncludeFillerNalUnits = "AUTO" | "DROP" | "INCLUDE" | (string & {});
export const IncludeFillerNalUnits = S.String;
export interface RtmpGroupSettings {
  AdMarkers?: RtmpAdMarkers[];
  AuthenticationScheme?: AuthenticationScheme;
  CacheFullBehavior?: RtmpCacheFullBehavior;
  CacheLength?: number;
  CaptionData?: RtmpCaptionData;
  InputLossAction?: InputLossActionForRtmpOut;
  RestartDelay?: number;
  IncludeFillerNalUnits?: IncludeFillerNalUnits;
}
export const RtmpGroupSettings = S.suspend(() =>
  S.Struct({
    AdMarkers: S.optional(__listOfRtmpAdMarkers).pipe(T.JsonName("adMarkers")),
    AuthenticationScheme: S.optional(AuthenticationScheme).pipe(
      T.JsonName("authenticationScheme"),
    ),
    CacheFullBehavior: S.optional(RtmpCacheFullBehavior).pipe(
      T.JsonName("cacheFullBehavior"),
    ),
    CacheLength: S.optional(S.Number).pipe(T.JsonName("cacheLength")),
    CaptionData: S.optional(RtmpCaptionData).pipe(T.JsonName("captionData")),
    InputLossAction: S.optional(InputLossActionForRtmpOut).pipe(
      T.JsonName("inputLossAction"),
    ),
    RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
    IncludeFillerNalUnits: S.optional(IncludeFillerNalUnits).pipe(
      T.JsonName("includeFillerNalUnits"),
    ),
  }),
).annotations({
  identifier: "RtmpGroupSettings",
}) as any as S.Schema<RtmpGroupSettings>;
export type InputLossActionForUdpOut =
  | "DROP_PROGRAM"
  | "DROP_TS"
  | "EMIT_PROGRAM"
  | (string & {});
export const InputLossActionForUdpOut = S.String;
export type UdpTimedMetadataId3Frame = "NONE" | "PRIV" | "TDRL" | (string & {});
export const UdpTimedMetadataId3Frame = S.String;
export interface UdpGroupSettings {
  InputLossAction?: InputLossActionForUdpOut;
  TimedMetadataId3Frame?: UdpTimedMetadataId3Frame;
  TimedMetadataId3Period?: number;
}
export const UdpGroupSettings = S.suspend(() =>
  S.Struct({
    InputLossAction: S.optional(InputLossActionForUdpOut).pipe(
      T.JsonName("inputLossAction"),
    ),
    TimedMetadataId3Frame: S.optional(UdpTimedMetadataId3Frame).pipe(
      T.JsonName("timedMetadataId3Frame"),
    ),
    TimedMetadataId3Period: S.optional(S.Number).pipe(
      T.JsonName("timedMetadataId3Period"),
    ),
  }),
).annotations({
  identifier: "UdpGroupSettings",
}) as any as S.Schema<UdpGroupSettings>;
export interface CmafIngestCaptionLanguageMapping {
  CaptionChannel?: number;
  LanguageCode?: string;
}
export const CmafIngestCaptionLanguageMapping = S.suspend(() =>
  S.Struct({
    CaptionChannel: S.optional(S.Number).pipe(T.JsonName("captionChannel")),
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  }),
).annotations({
  identifier: "CmafIngestCaptionLanguageMapping",
}) as any as S.Schema<CmafIngestCaptionLanguageMapping>;
export type __listOfCmafIngestCaptionLanguageMapping =
  CmafIngestCaptionLanguageMapping[];
export const __listOfCmafIngestCaptionLanguageMapping = S.Array(
  CmafIngestCaptionLanguageMapping,
);
export interface AdditionalDestinations {
  Destination?: OutputLocationRef;
}
export const AdditionalDestinations = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
  }),
).annotations({
  identifier: "AdditionalDestinations",
}) as any as S.Schema<AdditionalDestinations>;
export type __listOfAdditionalDestinations = AdditionalDestinations[];
export const __listOfAdditionalDestinations = S.Array(AdditionalDestinations);
export interface CmafIngestGroupSettings {
  Destination?: OutputLocationRef;
  NielsenId3Behavior?: CmafNielsenId3Behavior;
  Scte35Type?: Scte35Type;
  SegmentLength?: number;
  SegmentLengthUnits?: CmafIngestSegmentLengthUnits;
  SendDelayMs?: number;
  KlvBehavior?: CmafKLVBehavior;
  KlvNameModifier?: string;
  NielsenId3NameModifier?: string;
  Scte35NameModifier?: string;
  Id3Behavior?: CmafId3Behavior;
  Id3NameModifier?: string;
  CaptionLanguageMappings?: CmafIngestCaptionLanguageMapping[];
  TimedMetadataId3Frame?: CmafTimedMetadataId3Frame;
  TimedMetadataId3Period?: number;
  TimedMetadataPassthrough?: CmafTimedMetadataPassthrough;
  AdditionalDestinations?: AdditionalDestinations[];
}
export const CmafIngestGroupSettings = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    NielsenId3Behavior: S.optional(CmafNielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    Scte35Type: S.optional(Scte35Type).pipe(T.JsonName("scte35Type")),
    SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
    SegmentLengthUnits: S.optional(CmafIngestSegmentLengthUnits).pipe(
      T.JsonName("segmentLengthUnits"),
    ),
    SendDelayMs: S.optional(S.Number).pipe(T.JsonName("sendDelayMs")),
    KlvBehavior: S.optional(CmafKLVBehavior).pipe(T.JsonName("klvBehavior")),
    KlvNameModifier: S.optional(S.String).pipe(T.JsonName("klvNameModifier")),
    NielsenId3NameModifier: S.optional(S.String).pipe(
      T.JsonName("nielsenId3NameModifier"),
    ),
    Scte35NameModifier: S.optional(S.String).pipe(
      T.JsonName("scte35NameModifier"),
    ),
    Id3Behavior: S.optional(CmafId3Behavior).pipe(T.JsonName("id3Behavior")),
    Id3NameModifier: S.optional(S.String).pipe(T.JsonName("id3NameModifier")),
    CaptionLanguageMappings: S.optional(
      __listOfCmafIngestCaptionLanguageMapping,
    ).pipe(T.JsonName("captionLanguageMappings")),
    TimedMetadataId3Frame: S.optional(CmafTimedMetadataId3Frame).pipe(
      T.JsonName("timedMetadataId3Frame"),
    ),
    TimedMetadataId3Period: S.optional(S.Number).pipe(
      T.JsonName("timedMetadataId3Period"),
    ),
    TimedMetadataPassthrough: S.optional(CmafTimedMetadataPassthrough).pipe(
      T.JsonName("timedMetadataPassthrough"),
    ),
    AdditionalDestinations: S.optional(__listOfAdditionalDestinations).pipe(
      T.JsonName("additionalDestinations"),
    ),
  }),
).annotations({
  identifier: "CmafIngestGroupSettings",
}) as any as S.Schema<CmafIngestGroupSettings>;
export interface SrtGroupSettings {
  InputLossAction?: InputLossActionForUdpOut;
}
export const SrtGroupSettings = S.suspend(() =>
  S.Struct({
    InputLossAction: S.optional(InputLossActionForUdpOut).pipe(
      T.JsonName("inputLossAction"),
    ),
  }),
).annotations({
  identifier: "SrtGroupSettings",
}) as any as S.Schema<SrtGroupSettings>;
export interface OutputGroupSettings {
  ArchiveGroupSettings?: ArchiveGroupSettings;
  FrameCaptureGroupSettings?: FrameCaptureGroupSettings;
  HlsGroupSettings?: HlsGroupSettings;
  MediaPackageGroupSettings?: MediaPackageGroupSettings;
  MsSmoothGroupSettings?: MsSmoothGroupSettings;
  MultiplexGroupSettings?: MultiplexGroupSettings;
  RtmpGroupSettings?: RtmpGroupSettings;
  UdpGroupSettings?: UdpGroupSettings;
  CmafIngestGroupSettings?: CmafIngestGroupSettings;
  SrtGroupSettings?: SrtGroupSettings;
}
export const OutputGroupSettings = S.suspend(() =>
  S.Struct({
    ArchiveGroupSettings: S.optional(ArchiveGroupSettings)
      .pipe(T.JsonName("archiveGroupSettings"))
      .annotations({ identifier: "ArchiveGroupSettings" }),
    FrameCaptureGroupSettings: S.optional(FrameCaptureGroupSettings)
      .pipe(T.JsonName("frameCaptureGroupSettings"))
      .annotations({ identifier: "FrameCaptureGroupSettings" }),
    HlsGroupSettings: S.optional(HlsGroupSettings)
      .pipe(T.JsonName("hlsGroupSettings"))
      .annotations({ identifier: "HlsGroupSettings" }),
    MediaPackageGroupSettings: S.optional(MediaPackageGroupSettings)
      .pipe(T.JsonName("mediaPackageGroupSettings"))
      .annotations({ identifier: "MediaPackageGroupSettings" }),
    MsSmoothGroupSettings: S.optional(MsSmoothGroupSettings)
      .pipe(T.JsonName("msSmoothGroupSettings"))
      .annotations({ identifier: "MsSmoothGroupSettings" }),
    MultiplexGroupSettings: S.optional(MultiplexGroupSettings)
      .pipe(T.JsonName("multiplexGroupSettings"))
      .annotations({ identifier: "MultiplexGroupSettings" }),
    RtmpGroupSettings: S.optional(RtmpGroupSettings)
      .pipe(T.JsonName("rtmpGroupSettings"))
      .annotations({ identifier: "RtmpGroupSettings" }),
    UdpGroupSettings: S.optional(UdpGroupSettings)
      .pipe(T.JsonName("udpGroupSettings"))
      .annotations({ identifier: "UdpGroupSettings" }),
    CmafIngestGroupSettings: S.optional(CmafIngestGroupSettings)
      .pipe(T.JsonName("cmafIngestGroupSettings"))
      .annotations({ identifier: "CmafIngestGroupSettings" }),
    SrtGroupSettings: S.optional(SrtGroupSettings)
      .pipe(T.JsonName("srtGroupSettings"))
      .annotations({ identifier: "SrtGroupSettings" }),
  }),
).annotations({
  identifier: "OutputGroupSettings",
}) as any as S.Schema<OutputGroupSettings>;
export type M2tsAbsentInputAudioBehavior =
  | "DROP"
  | "ENCODE_SILENCE"
  | (string & {});
export const M2tsAbsentInputAudioBehavior = S.String;
export type M2tsArib = "DISABLED" | "ENABLED" | (string & {});
export const M2tsArib = S.String;
export type M2tsAribCaptionsPidControl =
  | "AUTO"
  | "USE_CONFIGURED"
  | (string & {});
export const M2tsAribCaptionsPidControl = S.String;
export type M2tsAudioBufferModel = "ATSC" | "DVB" | (string & {});
export const M2tsAudioBufferModel = S.String;
export type M2tsAudioStreamType = "ATSC" | "DVB" | (string & {});
export const M2tsAudioStreamType = S.String;
export type M2tsBufferModel = "MULTIPLEX" | "NONE" | (string & {});
export const M2tsBufferModel = S.String;
export type M2tsCcDescriptor = "DISABLED" | "ENABLED" | (string & {});
export const M2tsCcDescriptor = S.String;
export interface DvbNitSettings {
  NetworkId?: number;
  NetworkName?: string;
  RepInterval?: number;
}
export const DvbNitSettings = S.suspend(() =>
  S.Struct({
    NetworkId: S.optional(S.Number).pipe(T.JsonName("networkId")),
    NetworkName: S.optional(S.String).pipe(T.JsonName("networkName")),
    RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
  }),
).annotations({
  identifier: "DvbNitSettings",
}) as any as S.Schema<DvbNitSettings>;
export type DvbSdtOutputSdt =
  | "SDT_FOLLOW"
  | "SDT_FOLLOW_IF_PRESENT"
  | "SDT_MANUAL"
  | "SDT_NONE"
  | (string & {});
export const DvbSdtOutputSdt = S.String;
export interface DvbSdtSettings {
  OutputSdt?: DvbSdtOutputSdt;
  RepInterval?: number;
  ServiceName?: string;
  ServiceProviderName?: string;
}
export const DvbSdtSettings = S.suspend(() =>
  S.Struct({
    OutputSdt: S.optional(DvbSdtOutputSdt).pipe(T.JsonName("outputSdt")),
    RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
    ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
    ServiceProviderName: S.optional(S.String).pipe(
      T.JsonName("serviceProviderName"),
    ),
  }),
).annotations({
  identifier: "DvbSdtSettings",
}) as any as S.Schema<DvbSdtSettings>;
export interface DvbTdtSettings {
  RepInterval?: number;
}
export const DvbTdtSettings = S.suspend(() =>
  S.Struct({
    RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
  }),
).annotations({
  identifier: "DvbTdtSettings",
}) as any as S.Schema<DvbTdtSettings>;
export type M2tsEbifControl = "NONE" | "PASSTHROUGH" | (string & {});
export const M2tsEbifControl = S.String;
export type M2tsAudioInterval =
  | "VIDEO_AND_FIXED_INTERVALS"
  | "VIDEO_INTERVAL"
  | (string & {});
export const M2tsAudioInterval = S.String;
export type M2tsEbpPlacement =
  | "VIDEO_AND_AUDIO_PIDS"
  | "VIDEO_PID"
  | (string & {});
export const M2tsEbpPlacement = S.String;
export type M2tsEsRateInPes = "EXCLUDE" | "INCLUDE" | (string & {});
export const M2tsEsRateInPes = S.String;
export type M2tsKlv = "NONE" | "PASSTHROUGH" | (string & {});
export const M2tsKlv = S.String;
export type M2tsNielsenId3Behavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const M2tsNielsenId3Behavior = S.String;
export type M2tsPcrControl =
  | "CONFIGURED_PCR_PERIOD"
  | "PCR_EVERY_PES_PACKET"
  | (string & {});
export const M2tsPcrControl = S.String;
export type M2tsRateMode = "CBR" | "VBR" | (string & {});
export const M2tsRateMode = S.String;
export type M2tsScte35Control = "NONE" | "PASSTHROUGH" | (string & {});
export const M2tsScte35Control = S.String;
export type M2tsSegmentationMarkers =
  | "EBP"
  | "EBP_LEGACY"
  | "NONE"
  | "PSI_SEGSTART"
  | "RAI_ADAPT"
  | "RAI_SEGSTART"
  | (string & {});
export const M2tsSegmentationMarkers = S.String;
export type M2tsSegmentationStyle =
  | "MAINTAIN_CADENCE"
  | "RESET_CADENCE"
  | (string & {});
export const M2tsSegmentationStyle = S.String;
export type M2tsTimedMetadataBehavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const M2tsTimedMetadataBehavior = S.String;
export interface M2tsSettings {
  AbsentInputAudioBehavior?: M2tsAbsentInputAudioBehavior;
  Arib?: M2tsArib;
  AribCaptionsPid?: string;
  AribCaptionsPidControl?: M2tsAribCaptionsPidControl;
  AudioBufferModel?: M2tsAudioBufferModel;
  AudioFramesPerPes?: number;
  AudioPids?: string;
  AudioStreamType?: M2tsAudioStreamType;
  Bitrate?: number;
  BufferModel?: M2tsBufferModel;
  CcDescriptor?: M2tsCcDescriptor;
  DvbNitSettings?: DvbNitSettings;
  DvbSdtSettings?: DvbSdtSettings;
  DvbSubPids?: string;
  DvbTdtSettings?: DvbTdtSettings;
  DvbTeletextPid?: string;
  Ebif?: M2tsEbifControl;
  EbpAudioInterval?: M2tsAudioInterval;
  EbpLookaheadMs?: number;
  EbpPlacement?: M2tsEbpPlacement;
  EcmPid?: string;
  EsRateInPes?: M2tsEsRateInPes;
  EtvPlatformPid?: string;
  EtvSignalPid?: string;
  FragmentTime?: number;
  Klv?: M2tsKlv;
  KlvDataPids?: string;
  NielsenId3Behavior?: M2tsNielsenId3Behavior;
  NullPacketBitrate?: number;
  PatInterval?: number;
  PcrControl?: M2tsPcrControl;
  PcrPeriod?: number;
  PcrPid?: string;
  PmtInterval?: number;
  PmtPid?: string;
  ProgramNum?: number;
  RateMode?: M2tsRateMode;
  Scte27Pids?: string;
  Scte35Control?: M2tsScte35Control;
  Scte35Pid?: string;
  SegmentationMarkers?: M2tsSegmentationMarkers;
  SegmentationStyle?: M2tsSegmentationStyle;
  SegmentationTime?: number;
  TimedMetadataBehavior?: M2tsTimedMetadataBehavior;
  TimedMetadataPid?: string;
  TransportStreamId?: number;
  VideoPid?: string;
  Scte35PrerollPullupMilliseconds?: number;
}
export const M2tsSettings = S.suspend(() =>
  S.Struct({
    AbsentInputAudioBehavior: S.optional(M2tsAbsentInputAudioBehavior).pipe(
      T.JsonName("absentInputAudioBehavior"),
    ),
    Arib: S.optional(M2tsArib).pipe(T.JsonName("arib")),
    AribCaptionsPid: S.optional(S.String).pipe(T.JsonName("aribCaptionsPid")),
    AribCaptionsPidControl: S.optional(M2tsAribCaptionsPidControl).pipe(
      T.JsonName("aribCaptionsPidControl"),
    ),
    AudioBufferModel: S.optional(M2tsAudioBufferModel).pipe(
      T.JsonName("audioBufferModel"),
    ),
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioPids: S.optional(S.String).pipe(T.JsonName("audioPids")),
    AudioStreamType: S.optional(M2tsAudioStreamType).pipe(
      T.JsonName("audioStreamType"),
    ),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BufferModel: S.optional(M2tsBufferModel).pipe(T.JsonName("bufferModel")),
    CcDescriptor: S.optional(M2tsCcDescriptor).pipe(T.JsonName("ccDescriptor")),
    DvbNitSettings: S.optional(DvbNitSettings)
      .pipe(T.JsonName("dvbNitSettings"))
      .annotations({ identifier: "DvbNitSettings" }),
    DvbSdtSettings: S.optional(DvbSdtSettings)
      .pipe(T.JsonName("dvbSdtSettings"))
      .annotations({ identifier: "DvbSdtSettings" }),
    DvbSubPids: S.optional(S.String).pipe(T.JsonName("dvbSubPids")),
    DvbTdtSettings: S.optional(DvbTdtSettings)
      .pipe(T.JsonName("dvbTdtSettings"))
      .annotations({ identifier: "DvbTdtSettings" }),
    DvbTeletextPid: S.optional(S.String).pipe(T.JsonName("dvbTeletextPid")),
    Ebif: S.optional(M2tsEbifControl).pipe(T.JsonName("ebif")),
    EbpAudioInterval: S.optional(M2tsAudioInterval).pipe(
      T.JsonName("ebpAudioInterval"),
    ),
    EbpLookaheadMs: S.optional(S.Number).pipe(T.JsonName("ebpLookaheadMs")),
    EbpPlacement: S.optional(M2tsEbpPlacement).pipe(T.JsonName("ebpPlacement")),
    EcmPid: S.optional(S.String).pipe(T.JsonName("ecmPid")),
    EsRateInPes: S.optional(M2tsEsRateInPes).pipe(T.JsonName("esRateInPes")),
    EtvPlatformPid: S.optional(S.String).pipe(T.JsonName("etvPlatformPid")),
    EtvSignalPid: S.optional(S.String).pipe(T.JsonName("etvSignalPid")),
    FragmentTime: S.optional(S.Number).pipe(T.JsonName("fragmentTime")),
    Klv: S.optional(M2tsKlv).pipe(T.JsonName("klv")),
    KlvDataPids: S.optional(S.String).pipe(T.JsonName("klvDataPids")),
    NielsenId3Behavior: S.optional(M2tsNielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    NullPacketBitrate: S.optional(S.Number).pipe(
      T.JsonName("nullPacketBitrate"),
    ),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(M2tsPcrControl).pipe(T.JsonName("pcrControl")),
    PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
    PcrPid: S.optional(S.String).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.String).pipe(T.JsonName("pmtPid")),
    ProgramNum: S.optional(S.Number).pipe(T.JsonName("programNum")),
    RateMode: S.optional(M2tsRateMode).pipe(T.JsonName("rateMode")),
    Scte27Pids: S.optional(S.String).pipe(T.JsonName("scte27Pids")),
    Scte35Control: S.optional(M2tsScte35Control).pipe(
      T.JsonName("scte35Control"),
    ),
    Scte35Pid: S.optional(S.String).pipe(T.JsonName("scte35Pid")),
    SegmentationMarkers: S.optional(M2tsSegmentationMarkers).pipe(
      T.JsonName("segmentationMarkers"),
    ),
    SegmentationStyle: S.optional(M2tsSegmentationStyle).pipe(
      T.JsonName("segmentationStyle"),
    ),
    SegmentationTime: S.optional(S.Number).pipe(T.JsonName("segmentationTime")),
    TimedMetadataBehavior: S.optional(M2tsTimedMetadataBehavior).pipe(
      T.JsonName("timedMetadataBehavior"),
    ),
    TimedMetadataPid: S.optional(S.String).pipe(T.JsonName("timedMetadataPid")),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    VideoPid: S.optional(S.String).pipe(T.JsonName("videoPid")),
    Scte35PrerollPullupMilliseconds: S.optional(S.Number).pipe(
      T.JsonName("scte35PrerollPullupMilliseconds"),
    ),
  }),
).annotations({ identifier: "M2tsSettings" }) as any as S.Schema<M2tsSettings>;
export interface RawSettings {}
export const RawSettings = S.suspend(() => S.Struct({})).annotations({
  identifier: "RawSettings",
}) as any as S.Schema<RawSettings>;
export interface ArchiveContainerSettings {
  M2tsSettings?: M2tsSettings;
  RawSettings?: RawSettings;
}
export const ArchiveContainerSettings = S.suspend(() =>
  S.Struct({
    M2tsSettings: S.optional(M2tsSettings)
      .pipe(T.JsonName("m2tsSettings"))
      .annotations({ identifier: "M2tsSettings" }),
    RawSettings: S.optional(RawSettings)
      .pipe(T.JsonName("rawSettings"))
      .annotations({ identifier: "RawSettings" }),
  }),
).annotations({
  identifier: "ArchiveContainerSettings",
}) as any as S.Schema<ArchiveContainerSettings>;
export interface ArchiveOutputSettings {
  ContainerSettings?: ArchiveContainerSettings;
  Extension?: string;
  NameModifier?: string;
}
export const ArchiveOutputSettings = S.suspend(() =>
  S.Struct({
    ContainerSettings: S.optional(ArchiveContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "ArchiveContainerSettings" }),
    Extension: S.optional(S.String).pipe(T.JsonName("extension")),
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  }),
).annotations({
  identifier: "ArchiveOutputSettings",
}) as any as S.Schema<ArchiveOutputSettings>;
export interface FrameCaptureOutputSettings {
  NameModifier?: string;
}
export const FrameCaptureOutputSettings = S.suspend(() =>
  S.Struct({
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  }),
).annotations({
  identifier: "FrameCaptureOutputSettings",
}) as any as S.Schema<FrameCaptureOutputSettings>;
export type HlsH265PackagingType = "HEV1" | "HVC1" | (string & {});
export const HlsH265PackagingType = S.String;
export type AudioOnlyHlsTrackType =
  | "ALTERNATE_AUDIO_AUTO_SELECT"
  | "ALTERNATE_AUDIO_AUTO_SELECT_DEFAULT"
  | "ALTERNATE_AUDIO_NOT_AUTO_SELECT"
  | "AUDIO_ONLY_VARIANT_STREAM"
  | (string & {});
export const AudioOnlyHlsTrackType = S.String;
export type AudioOnlyHlsSegmentType = "AAC" | "FMP4" | (string & {});
export const AudioOnlyHlsSegmentType = S.String;
export interface AudioOnlyHlsSettings {
  AudioGroupId?: string;
  AudioOnlyImage?: InputLocation;
  AudioTrackType?: AudioOnlyHlsTrackType;
  SegmentType?: AudioOnlyHlsSegmentType;
}
export const AudioOnlyHlsSettings = S.suspend(() =>
  S.Struct({
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioOnlyImage: S.optional(InputLocation)
      .pipe(T.JsonName("audioOnlyImage"))
      .annotations({ identifier: "InputLocation" }),
    AudioTrackType: S.optional(AudioOnlyHlsTrackType).pipe(
      T.JsonName("audioTrackType"),
    ),
    SegmentType: S.optional(AudioOnlyHlsSegmentType).pipe(
      T.JsonName("segmentType"),
    ),
  }),
).annotations({
  identifier: "AudioOnlyHlsSettings",
}) as any as S.Schema<AudioOnlyHlsSettings>;
export type Fmp4NielsenId3Behavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const Fmp4NielsenId3Behavior = S.String;
export type Fmp4TimedMetadataBehavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const Fmp4TimedMetadataBehavior = S.String;
export interface Fmp4HlsSettings {
  AudioRenditionSets?: string;
  NielsenId3Behavior?: Fmp4NielsenId3Behavior;
  TimedMetadataBehavior?: Fmp4TimedMetadataBehavior;
}
export const Fmp4HlsSettings = S.suspend(() =>
  S.Struct({
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    NielsenId3Behavior: S.optional(Fmp4NielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    TimedMetadataBehavior: S.optional(Fmp4TimedMetadataBehavior).pipe(
      T.JsonName("timedMetadataBehavior"),
    ),
  }),
).annotations({
  identifier: "Fmp4HlsSettings",
}) as any as S.Schema<Fmp4HlsSettings>;
export interface FrameCaptureHlsSettings {}
export const FrameCaptureHlsSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "FrameCaptureHlsSettings",
}) as any as S.Schema<FrameCaptureHlsSettings>;
export type M3u8NielsenId3Behavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const M3u8NielsenId3Behavior = S.String;
export type M3u8PcrControl =
  | "CONFIGURED_PCR_PERIOD"
  | "PCR_EVERY_PES_PACKET"
  | (string & {});
export const M3u8PcrControl = S.String;
export type M3u8Scte35Behavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const M3u8Scte35Behavior = S.String;
export type M3u8TimedMetadataBehavior =
  | "NO_PASSTHROUGH"
  | "PASSTHROUGH"
  | (string & {});
export const M3u8TimedMetadataBehavior = S.String;
export type M3u8KlvBehavior = "NO_PASSTHROUGH" | "PASSTHROUGH" | (string & {});
export const M3u8KlvBehavior = S.String;
export interface M3u8Settings {
  AudioFramesPerPes?: number;
  AudioPids?: string;
  EcmPid?: string;
  NielsenId3Behavior?: M3u8NielsenId3Behavior;
  PatInterval?: number;
  PcrControl?: M3u8PcrControl;
  PcrPeriod?: number;
  PcrPid?: string;
  PmtInterval?: number;
  PmtPid?: string;
  ProgramNum?: number;
  Scte35Behavior?: M3u8Scte35Behavior;
  Scte35Pid?: string;
  TimedMetadataBehavior?: M3u8TimedMetadataBehavior;
  TimedMetadataPid?: string;
  TransportStreamId?: number;
  VideoPid?: string;
  KlvBehavior?: M3u8KlvBehavior;
  KlvDataPids?: string;
}
export const M3u8Settings = S.suspend(() =>
  S.Struct({
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioPids: S.optional(S.String).pipe(T.JsonName("audioPids")),
    EcmPid: S.optional(S.String).pipe(T.JsonName("ecmPid")),
    NielsenId3Behavior: S.optional(M3u8NielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
    PcrControl: S.optional(M3u8PcrControl).pipe(T.JsonName("pcrControl")),
    PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
    PcrPid: S.optional(S.String).pipe(T.JsonName("pcrPid")),
    PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
    PmtPid: S.optional(S.String).pipe(T.JsonName("pmtPid")),
    ProgramNum: S.optional(S.Number).pipe(T.JsonName("programNum")),
    Scte35Behavior: S.optional(M3u8Scte35Behavior).pipe(
      T.JsonName("scte35Behavior"),
    ),
    Scte35Pid: S.optional(S.String).pipe(T.JsonName("scte35Pid")),
    TimedMetadataBehavior: S.optional(M3u8TimedMetadataBehavior).pipe(
      T.JsonName("timedMetadataBehavior"),
    ),
    TimedMetadataPid: S.optional(S.String).pipe(T.JsonName("timedMetadataPid")),
    TransportStreamId: S.optional(S.Number).pipe(
      T.JsonName("transportStreamId"),
    ),
    VideoPid: S.optional(S.String).pipe(T.JsonName("videoPid")),
    KlvBehavior: S.optional(M3u8KlvBehavior).pipe(T.JsonName("klvBehavior")),
    KlvDataPids: S.optional(S.String).pipe(T.JsonName("klvDataPids")),
  }),
).annotations({ identifier: "M3u8Settings" }) as any as S.Schema<M3u8Settings>;
export interface StandardHlsSettings {
  AudioRenditionSets?: string;
  M3u8Settings?: M3u8Settings;
}
export const StandardHlsSettings = S.suspend(() =>
  S.Struct({
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    M3u8Settings: S.optional(M3u8Settings)
      .pipe(T.JsonName("m3u8Settings"))
      .annotations({ identifier: "M3u8Settings" }),
  }),
).annotations({
  identifier: "StandardHlsSettings",
}) as any as S.Schema<StandardHlsSettings>;
export interface HlsSettings {
  AudioOnlyHlsSettings?: AudioOnlyHlsSettings;
  Fmp4HlsSettings?: Fmp4HlsSettings;
  FrameCaptureHlsSettings?: FrameCaptureHlsSettings;
  StandardHlsSettings?: StandardHlsSettings;
}
export const HlsSettings = S.suspend(() =>
  S.Struct({
    AudioOnlyHlsSettings: S.optional(AudioOnlyHlsSettings)
      .pipe(T.JsonName("audioOnlyHlsSettings"))
      .annotations({ identifier: "AudioOnlyHlsSettings" }),
    Fmp4HlsSettings: S.optional(Fmp4HlsSettings)
      .pipe(T.JsonName("fmp4HlsSettings"))
      .annotations({ identifier: "Fmp4HlsSettings" }),
    FrameCaptureHlsSettings: S.optional(FrameCaptureHlsSettings)
      .pipe(T.JsonName("frameCaptureHlsSettings"))
      .annotations({ identifier: "FrameCaptureHlsSettings" }),
    StandardHlsSettings: S.optional(StandardHlsSettings)
      .pipe(T.JsonName("standardHlsSettings"))
      .annotations({ identifier: "StandardHlsSettings" }),
  }),
).annotations({ identifier: "HlsSettings" }) as any as S.Schema<HlsSettings>;
export interface HlsOutputSettings {
  H265PackagingType?: HlsH265PackagingType;
  HlsSettings?: HlsSettings;
  NameModifier?: string;
  SegmentModifier?: string;
}
export const HlsOutputSettings = S.suspend(() =>
  S.Struct({
    H265PackagingType: S.optional(HlsH265PackagingType).pipe(
      T.JsonName("h265PackagingType"),
    ),
    HlsSettings: S.optional(HlsSettings)
      .pipe(T.JsonName("hlsSettings"))
      .annotations({ identifier: "HlsSettings" }),
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
    SegmentModifier: S.optional(S.String).pipe(T.JsonName("segmentModifier")),
  }),
).annotations({
  identifier: "HlsOutputSettings",
}) as any as S.Schema<HlsOutputSettings>;
export type HlsAutoSelect = "NO" | "OMIT" | "YES" | (string & {});
export const HlsAutoSelect = S.String;
export type HlsDefault = "NO" | "OMIT" | "YES" | (string & {});
export const HlsDefault = S.String;
export interface MediaPackageV2DestinationSettings {
  AudioGroupId?: string;
  AudioRenditionSets?: string;
  HlsAutoSelect?: HlsAutoSelect;
  HlsDefault?: HlsDefault;
}
export const MediaPackageV2DestinationSettings = S.suspend(() =>
  S.Struct({
    AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
    AudioRenditionSets: S.optional(S.String).pipe(
      T.JsonName("audioRenditionSets"),
    ),
    HlsAutoSelect: S.optional(HlsAutoSelect).pipe(T.JsonName("hlsAutoSelect")),
    HlsDefault: S.optional(HlsDefault).pipe(T.JsonName("hlsDefault")),
  }),
).annotations({
  identifier: "MediaPackageV2DestinationSettings",
}) as any as S.Schema<MediaPackageV2DestinationSettings>;
export interface MediaPackageOutputSettings {
  MediaPackageV2DestinationSettings?: MediaPackageV2DestinationSettings;
}
export const MediaPackageOutputSettings = S.suspend(() =>
  S.Struct({
    MediaPackageV2DestinationSettings: S.optional(
      MediaPackageV2DestinationSettings,
    )
      .pipe(T.JsonName("mediaPackageV2DestinationSettings"))
      .annotations({ identifier: "MediaPackageV2DestinationSettings" }),
  }),
).annotations({
  identifier: "MediaPackageOutputSettings",
}) as any as S.Schema<MediaPackageOutputSettings>;
export type MsSmoothH265PackagingType = "HEV1" | "HVC1" | (string & {});
export const MsSmoothH265PackagingType = S.String;
export interface MsSmoothOutputSettings {
  H265PackagingType?: MsSmoothH265PackagingType;
  NameModifier?: string;
}
export const MsSmoothOutputSettings = S.suspend(() =>
  S.Struct({
    H265PackagingType: S.optional(MsSmoothH265PackagingType).pipe(
      T.JsonName("h265PackagingType"),
    ),
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  }),
).annotations({
  identifier: "MsSmoothOutputSettings",
}) as any as S.Schema<MsSmoothOutputSettings>;
export interface MultiplexM2tsSettings {
  AbsentInputAudioBehavior?: M2tsAbsentInputAudioBehavior;
  Arib?: M2tsArib;
  AudioBufferModel?: M2tsAudioBufferModel;
  AudioFramesPerPes?: number;
  AudioStreamType?: M2tsAudioStreamType;
  CcDescriptor?: M2tsCcDescriptor;
  Ebif?: M2tsEbifControl;
  EsRateInPes?: M2tsEsRateInPes;
  Klv?: M2tsKlv;
  NielsenId3Behavior?: M2tsNielsenId3Behavior;
  PcrControl?: M2tsPcrControl;
  PcrPeriod?: number;
  Scte35Control?: M2tsScte35Control;
  Scte35PrerollPullupMilliseconds?: number;
}
export const MultiplexM2tsSettings = S.suspend(() =>
  S.Struct({
    AbsentInputAudioBehavior: S.optional(M2tsAbsentInputAudioBehavior).pipe(
      T.JsonName("absentInputAudioBehavior"),
    ),
    Arib: S.optional(M2tsArib).pipe(T.JsonName("arib")),
    AudioBufferModel: S.optional(M2tsAudioBufferModel).pipe(
      T.JsonName("audioBufferModel"),
    ),
    AudioFramesPerPes: S.optional(S.Number).pipe(
      T.JsonName("audioFramesPerPes"),
    ),
    AudioStreamType: S.optional(M2tsAudioStreamType).pipe(
      T.JsonName("audioStreamType"),
    ),
    CcDescriptor: S.optional(M2tsCcDescriptor).pipe(T.JsonName("ccDescriptor")),
    Ebif: S.optional(M2tsEbifControl).pipe(T.JsonName("ebif")),
    EsRateInPes: S.optional(M2tsEsRateInPes).pipe(T.JsonName("esRateInPes")),
    Klv: S.optional(M2tsKlv).pipe(T.JsonName("klv")),
    NielsenId3Behavior: S.optional(M2tsNielsenId3Behavior).pipe(
      T.JsonName("nielsenId3Behavior"),
    ),
    PcrControl: S.optional(M2tsPcrControl).pipe(T.JsonName("pcrControl")),
    PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
    Scte35Control: S.optional(M2tsScte35Control).pipe(
      T.JsonName("scte35Control"),
    ),
    Scte35PrerollPullupMilliseconds: S.optional(S.Number).pipe(
      T.JsonName("scte35PrerollPullupMilliseconds"),
    ),
  }),
).annotations({
  identifier: "MultiplexM2tsSettings",
}) as any as S.Schema<MultiplexM2tsSettings>;
export interface MultiplexContainerSettings {
  MultiplexM2tsSettings?: MultiplexM2tsSettings;
}
export const MultiplexContainerSettings = S.suspend(() =>
  S.Struct({
    MultiplexM2tsSettings: S.optional(MultiplexM2tsSettings)
      .pipe(T.JsonName("multiplexM2tsSettings"))
      .annotations({ identifier: "MultiplexM2tsSettings" }),
  }),
).annotations({
  identifier: "MultiplexContainerSettings",
}) as any as S.Schema<MultiplexContainerSettings>;
export interface MultiplexOutputSettings {
  Destination?: OutputLocationRef;
  ContainerSettings?: MultiplexContainerSettings;
}
export const MultiplexOutputSettings = S.suspend(() =>
  S.Struct({
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    ContainerSettings: S.optional(MultiplexContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "MultiplexContainerSettings" }),
  }),
).annotations({
  identifier: "MultiplexOutputSettings",
}) as any as S.Schema<MultiplexOutputSettings>;
export type RtmpOutputCertificateMode =
  | "SELF_SIGNED"
  | "VERIFY_AUTHENTICITY"
  | (string & {});
export const RtmpOutputCertificateMode = S.String;
export interface RtmpOutputSettings {
  CertificateMode?: RtmpOutputCertificateMode;
  ConnectionRetryInterval?: number;
  Destination?: OutputLocationRef;
  NumRetries?: number;
}
export const RtmpOutputSettings = S.suspend(() =>
  S.Struct({
    CertificateMode: S.optional(RtmpOutputCertificateMode).pipe(
      T.JsonName("certificateMode"),
    ),
    ConnectionRetryInterval: S.optional(S.Number).pipe(
      T.JsonName("connectionRetryInterval"),
    ),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  }),
).annotations({
  identifier: "RtmpOutputSettings",
}) as any as S.Schema<RtmpOutputSettings>;
export interface UdpContainerSettings {
  M2tsSettings?: M2tsSettings;
}
export const UdpContainerSettings = S.suspend(() =>
  S.Struct({
    M2tsSettings: S.optional(M2tsSettings)
      .pipe(T.JsonName("m2tsSettings"))
      .annotations({ identifier: "M2tsSettings" }),
  }),
).annotations({
  identifier: "UdpContainerSettings",
}) as any as S.Schema<UdpContainerSettings>;
export type FecOutputIncludeFec = "COLUMN" | "COLUMN_AND_ROW" | (string & {});
export const FecOutputIncludeFec = S.String;
export interface FecOutputSettings {
  ColumnDepth?: number;
  IncludeFec?: FecOutputIncludeFec;
  RowLength?: number;
}
export const FecOutputSettings = S.suspend(() =>
  S.Struct({
    ColumnDepth: S.optional(S.Number).pipe(T.JsonName("columnDepth")),
    IncludeFec: S.optional(FecOutputIncludeFec).pipe(T.JsonName("includeFec")),
    RowLength: S.optional(S.Number).pipe(T.JsonName("rowLength")),
  }),
).annotations({
  identifier: "FecOutputSettings",
}) as any as S.Schema<FecOutputSettings>;
export interface UdpOutputSettings {
  BufferMsec?: number;
  ContainerSettings?: UdpContainerSettings;
  Destination?: OutputLocationRef;
  FecOutputSettings?: FecOutputSettings;
}
export const UdpOutputSettings = S.suspend(() =>
  S.Struct({
    BufferMsec: S.optional(S.Number).pipe(T.JsonName("bufferMsec")),
    ContainerSettings: S.optional(UdpContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "UdpContainerSettings" }),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    FecOutputSettings: S.optional(FecOutputSettings)
      .pipe(T.JsonName("fecOutputSettings"))
      .annotations({ identifier: "FecOutputSettings" }),
  }),
).annotations({
  identifier: "UdpOutputSettings",
}) as any as S.Schema<UdpOutputSettings>;
export interface CmafIngestOutputSettings {
  NameModifier?: string;
}
export const CmafIngestOutputSettings = S.suspend(() =>
  S.Struct({
    NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  }),
).annotations({
  identifier: "CmafIngestOutputSettings",
}) as any as S.Schema<CmafIngestOutputSettings>;
export type SrtEncryptionType = "AES128" | "AES192" | "AES256" | (string & {});
export const SrtEncryptionType = S.String;
export interface SrtOutputSettings {
  BufferMsec?: number;
  ContainerSettings?: UdpContainerSettings;
  Destination?: OutputLocationRef;
  EncryptionType?: SrtEncryptionType;
  Latency?: number;
}
export const SrtOutputSettings = S.suspend(() =>
  S.Struct({
    BufferMsec: S.optional(S.Number).pipe(T.JsonName("bufferMsec")),
    ContainerSettings: S.optional(UdpContainerSettings)
      .pipe(T.JsonName("containerSettings"))
      .annotations({ identifier: "UdpContainerSettings" }),
    Destination: S.optional(OutputLocationRef)
      .pipe(T.JsonName("destination"))
      .annotations({ identifier: "OutputLocationRef" }),
    EncryptionType: S.optional(SrtEncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    Latency: S.optional(S.Number).pipe(T.JsonName("latency")),
  }),
).annotations({
  identifier: "SrtOutputSettings",
}) as any as S.Schema<SrtOutputSettings>;
export interface OutputSettings {
  ArchiveOutputSettings?: ArchiveOutputSettings;
  FrameCaptureOutputSettings?: FrameCaptureOutputSettings;
  HlsOutputSettings?: HlsOutputSettings;
  MediaPackageOutputSettings?: MediaPackageOutputSettings;
  MsSmoothOutputSettings?: MsSmoothOutputSettings;
  MultiplexOutputSettings?: MultiplexOutputSettings;
  RtmpOutputSettings?: RtmpOutputSettings;
  UdpOutputSettings?: UdpOutputSettings;
  CmafIngestOutputSettings?: CmafIngestOutputSettings;
  SrtOutputSettings?: SrtOutputSettings;
}
export const OutputSettings = S.suspend(() =>
  S.Struct({
    ArchiveOutputSettings: S.optional(ArchiveOutputSettings)
      .pipe(T.JsonName("archiveOutputSettings"))
      .annotations({ identifier: "ArchiveOutputSettings" }),
    FrameCaptureOutputSettings: S.optional(FrameCaptureOutputSettings)
      .pipe(T.JsonName("frameCaptureOutputSettings"))
      .annotations({ identifier: "FrameCaptureOutputSettings" }),
    HlsOutputSettings: S.optional(HlsOutputSettings)
      .pipe(T.JsonName("hlsOutputSettings"))
      .annotations({ identifier: "HlsOutputSettings" }),
    MediaPackageOutputSettings: S.optional(MediaPackageOutputSettings)
      .pipe(T.JsonName("mediaPackageOutputSettings"))
      .annotations({ identifier: "MediaPackageOutputSettings" }),
    MsSmoothOutputSettings: S.optional(MsSmoothOutputSettings)
      .pipe(T.JsonName("msSmoothOutputSettings"))
      .annotations({ identifier: "MsSmoothOutputSettings" }),
    MultiplexOutputSettings: S.optional(MultiplexOutputSettings)
      .pipe(T.JsonName("multiplexOutputSettings"))
      .annotations({ identifier: "MultiplexOutputSettings" }),
    RtmpOutputSettings: S.optional(RtmpOutputSettings)
      .pipe(T.JsonName("rtmpOutputSettings"))
      .annotations({ identifier: "RtmpOutputSettings" }),
    UdpOutputSettings: S.optional(UdpOutputSettings)
      .pipe(T.JsonName("udpOutputSettings"))
      .annotations({ identifier: "UdpOutputSettings" }),
    CmafIngestOutputSettings: S.optional(CmafIngestOutputSettings)
      .pipe(T.JsonName("cmafIngestOutputSettings"))
      .annotations({ identifier: "CmafIngestOutputSettings" }),
    SrtOutputSettings: S.optional(SrtOutputSettings)
      .pipe(T.JsonName("srtOutputSettings"))
      .annotations({ identifier: "SrtOutputSettings" }),
  }),
).annotations({
  identifier: "OutputSettings",
}) as any as S.Schema<OutputSettings>;
export interface Output {
  AudioDescriptionNames?: string[];
  CaptionDescriptionNames?: string[];
  OutputName?: string;
  OutputSettings?: OutputSettings;
  VideoDescriptionName?: string;
}
export const Output = S.suspend(() =>
  S.Struct({
    AudioDescriptionNames: S.optional(__listOf__string).pipe(
      T.JsonName("audioDescriptionNames"),
    ),
    CaptionDescriptionNames: S.optional(__listOf__string).pipe(
      T.JsonName("captionDescriptionNames"),
    ),
    OutputName: S.optional(S.String).pipe(T.JsonName("outputName")),
    OutputSettings: S.optional(OutputSettings)
      .pipe(T.JsonName("outputSettings"))
      .annotations({ identifier: "OutputSettings" }),
    VideoDescriptionName: S.optional(S.String).pipe(
      T.JsonName("videoDescriptionName"),
    ),
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type __listOfOutput = Output[];
export const __listOfOutput = S.Array(Output);
export interface OutputGroup {
  Name?: string;
  OutputGroupSettings?: OutputGroupSettings;
  Outputs?: Output[];
}
export const OutputGroup = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OutputGroupSettings: S.optional(OutputGroupSettings)
      .pipe(T.JsonName("outputGroupSettings"))
      .annotations({ identifier: "OutputGroupSettings" }),
    Outputs: S.optional(__listOfOutput).pipe(T.JsonName("outputs")),
  }),
).annotations({ identifier: "OutputGroup" }) as any as S.Schema<OutputGroup>;
export type __listOfOutputGroup = OutputGroup[];
export const __listOfOutputGroup = S.Array(OutputGroup);
export interface TimecodeConfig {
  Source?: TimecodeConfigSource;
  SyncThreshold?: number;
}
export const TimecodeConfig = S.suspend(() =>
  S.Struct({
    Source: S.optional(TimecodeConfigSource).pipe(T.JsonName("source")),
    SyncThreshold: S.optional(S.Number).pipe(T.JsonName("syncThreshold")),
  }),
).annotations({
  identifier: "TimecodeConfig",
}) as any as S.Schema<TimecodeConfig>;
export type FrameCaptureIntervalUnit =
  | "MILLISECONDS"
  | "SECONDS"
  | (string & {});
export const FrameCaptureIntervalUnit = S.String;
export type TimecodeBurninFontSize =
  | "EXTRA_SMALL_10"
  | "LARGE_48"
  | "MEDIUM_32"
  | "SMALL_16"
  | (string & {});
export const TimecodeBurninFontSize = S.String;
export type TimecodeBurninPosition =
  | "BOTTOM_CENTER"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "MIDDLE_CENTER"
  | "MIDDLE_LEFT"
  | "MIDDLE_RIGHT"
  | "TOP_CENTER"
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | (string & {});
export const TimecodeBurninPosition = S.String;
export interface TimecodeBurninSettings {
  FontSize?: TimecodeBurninFontSize;
  Position?: TimecodeBurninPosition;
  Prefix?: string;
}
export const TimecodeBurninSettings = S.suspend(() =>
  S.Struct({
    FontSize: S.optional(TimecodeBurninFontSize).pipe(T.JsonName("fontSize")),
    Position: S.optional(TimecodeBurninPosition).pipe(T.JsonName("position")),
    Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
  }),
).annotations({
  identifier: "TimecodeBurninSettings",
}) as any as S.Schema<TimecodeBurninSettings>;
export interface FrameCaptureSettings {
  CaptureInterval?: number;
  CaptureIntervalUnits?: FrameCaptureIntervalUnit;
  TimecodeBurninSettings?: TimecodeBurninSettings;
}
export const FrameCaptureSettings = S.suspend(() =>
  S.Struct({
    CaptureInterval: S.optional(S.Number).pipe(T.JsonName("captureInterval")),
    CaptureIntervalUnits: S.optional(FrameCaptureIntervalUnit).pipe(
      T.JsonName("captureIntervalUnits"),
    ),
    TimecodeBurninSettings: S.optional(TimecodeBurninSettings)
      .pipe(T.JsonName("timecodeBurninSettings"))
      .annotations({ identifier: "TimecodeBurninSettings" }),
  }),
).annotations({
  identifier: "FrameCaptureSettings",
}) as any as S.Schema<FrameCaptureSettings>;
export type H264AdaptiveQuantization =
  | "AUTO"
  | "HIGH"
  | "HIGHER"
  | "LOW"
  | "MAX"
  | "MEDIUM"
  | "OFF"
  | (string & {});
export const H264AdaptiveQuantization = S.String;
export type AfdSignaling = "AUTO" | "FIXED" | "NONE" | (string & {});
export const AfdSignaling = S.String;
export type H264ColorMetadata = "IGNORE" | "INSERT" | (string & {});
export const H264ColorMetadata = S.String;
export interface ColorSpacePassthroughSettings {}
export const ColorSpacePassthroughSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ColorSpacePassthroughSettings",
}) as any as S.Schema<ColorSpacePassthroughSettings>;
export interface Rec601Settings {}
export const Rec601Settings = S.suspend(() => S.Struct({})).annotations({
  identifier: "Rec601Settings",
}) as any as S.Schema<Rec601Settings>;
export interface Rec709Settings {}
export const Rec709Settings = S.suspend(() => S.Struct({})).annotations({
  identifier: "Rec709Settings",
}) as any as S.Schema<Rec709Settings>;
export interface H264ColorSpaceSettings {
  ColorSpacePassthroughSettings?: ColorSpacePassthroughSettings;
  Rec601Settings?: Rec601Settings;
  Rec709Settings?: Rec709Settings;
}
export const H264ColorSpaceSettings = S.suspend(() =>
  S.Struct({
    ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings)
      .pipe(T.JsonName("colorSpacePassthroughSettings"))
      .annotations({ identifier: "ColorSpacePassthroughSettings" }),
    Rec601Settings: S.optional(Rec601Settings)
      .pipe(T.JsonName("rec601Settings"))
      .annotations({ identifier: "Rec601Settings" }),
    Rec709Settings: S.optional(Rec709Settings)
      .pipe(T.JsonName("rec709Settings"))
      .annotations({ identifier: "Rec709Settings" }),
  }),
).annotations({
  identifier: "H264ColorSpaceSettings",
}) as any as S.Schema<H264ColorSpaceSettings>;
export type H264EntropyEncoding = "CABAC" | "CAVLC" | (string & {});
export const H264EntropyEncoding = S.String;
export type TemporalFilterPostFilterSharpening =
  | "AUTO"
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const TemporalFilterPostFilterSharpening = S.String;
export type TemporalFilterStrength =
  | "AUTO"
  | "STRENGTH_1"
  | "STRENGTH_2"
  | "STRENGTH_3"
  | "STRENGTH_4"
  | "STRENGTH_5"
  | "STRENGTH_6"
  | "STRENGTH_7"
  | "STRENGTH_8"
  | "STRENGTH_9"
  | "STRENGTH_10"
  | "STRENGTH_11"
  | "STRENGTH_12"
  | "STRENGTH_13"
  | "STRENGTH_14"
  | "STRENGTH_15"
  | "STRENGTH_16"
  | (string & {});
export const TemporalFilterStrength = S.String;
export interface TemporalFilterSettings {
  PostFilterSharpening?: TemporalFilterPostFilterSharpening;
  Strength?: TemporalFilterStrength;
}
export const TemporalFilterSettings = S.suspend(() =>
  S.Struct({
    PostFilterSharpening: S.optional(TemporalFilterPostFilterSharpening).pipe(
      T.JsonName("postFilterSharpening"),
    ),
    Strength: S.optional(TemporalFilterStrength).pipe(T.JsonName("strength")),
  }),
).annotations({
  identifier: "TemporalFilterSettings",
}) as any as S.Schema<TemporalFilterSettings>;
export type BandwidthReductionPostFilterSharpening =
  | "DISABLED"
  | "SHARPENING_1"
  | "SHARPENING_2"
  | "SHARPENING_3"
  | (string & {});
export const BandwidthReductionPostFilterSharpening = S.String;
export type BandwidthReductionFilterStrength =
  | "AUTO"
  | "STRENGTH_1"
  | "STRENGTH_2"
  | "STRENGTH_3"
  | "STRENGTH_4"
  | (string & {});
export const BandwidthReductionFilterStrength = S.String;
export interface BandwidthReductionFilterSettings {
  PostFilterSharpening?: BandwidthReductionPostFilterSharpening;
  Strength?: BandwidthReductionFilterStrength;
}
export const BandwidthReductionFilterSettings = S.suspend(() =>
  S.Struct({
    PostFilterSharpening: S.optional(
      BandwidthReductionPostFilterSharpening,
    ).pipe(T.JsonName("postFilterSharpening")),
    Strength: S.optional(BandwidthReductionFilterStrength).pipe(
      T.JsonName("strength"),
    ),
  }),
).annotations({
  identifier: "BandwidthReductionFilterSettings",
}) as any as S.Schema<BandwidthReductionFilterSettings>;
export interface H264FilterSettings {
  TemporalFilterSettings?: TemporalFilterSettings;
  BandwidthReductionFilterSettings?: BandwidthReductionFilterSettings;
}
export const H264FilterSettings = S.suspend(() =>
  S.Struct({
    TemporalFilterSettings: S.optional(TemporalFilterSettings)
      .pipe(T.JsonName("temporalFilterSettings"))
      .annotations({ identifier: "TemporalFilterSettings" }),
    BandwidthReductionFilterSettings: S.optional(
      BandwidthReductionFilterSettings,
    )
      .pipe(T.JsonName("bandwidthReductionFilterSettings"))
      .annotations({ identifier: "BandwidthReductionFilterSettings" }),
  }),
).annotations({
  identifier: "H264FilterSettings",
}) as any as S.Schema<H264FilterSettings>;
export type FixedAfd =
  | "AFD_0000"
  | "AFD_0010"
  | "AFD_0011"
  | "AFD_0100"
  | "AFD_1000"
  | "AFD_1001"
  | "AFD_1010"
  | "AFD_1011"
  | "AFD_1101"
  | "AFD_1110"
  | "AFD_1111"
  | (string & {});
export const FixedAfd = S.String;
export type H264FlickerAq = "DISABLED" | "ENABLED" | (string & {});
export const H264FlickerAq = S.String;
export type H264ForceFieldPictures = "DISABLED" | "ENABLED" | (string & {});
export const H264ForceFieldPictures = S.String;
export type H264FramerateControl =
  | "INITIALIZE_FROM_SOURCE"
  | "SPECIFIED"
  | (string & {});
export const H264FramerateControl = S.String;
export type H264GopBReference = "DISABLED" | "ENABLED" | (string & {});
export const H264GopBReference = S.String;
export type H264GopSizeUnits = "FRAMES" | "SECONDS" | (string & {});
export const H264GopSizeUnits = S.String;
export type H264Level =
  | "H264_LEVEL_1"
  | "H264_LEVEL_1_1"
  | "H264_LEVEL_1_2"
  | "H264_LEVEL_1_3"
  | "H264_LEVEL_2"
  | "H264_LEVEL_2_1"
  | "H264_LEVEL_2_2"
  | "H264_LEVEL_3"
  | "H264_LEVEL_3_1"
  | "H264_LEVEL_3_2"
  | "H264_LEVEL_4"
  | "H264_LEVEL_4_1"
  | "H264_LEVEL_4_2"
  | "H264_LEVEL_5"
  | "H264_LEVEL_5_1"
  | "H264_LEVEL_5_2"
  | "H264_LEVEL_AUTO"
  | (string & {});
export const H264Level = S.String;
export type H264LookAheadRateControl =
  | "HIGH"
  | "LOW"
  | "MEDIUM"
  | (string & {});
export const H264LookAheadRateControl = S.String;
export type H264ParControl =
  | "INITIALIZE_FROM_SOURCE"
  | "SPECIFIED"
  | (string & {});
export const H264ParControl = S.String;
export type H264Profile =
  | "BASELINE"
  | "HIGH"
  | "HIGH_10BIT"
  | "HIGH_422"
  | "HIGH_422_10BIT"
  | "MAIN"
  | (string & {});
export const H264Profile = S.String;
export type H264QualityLevel =
  | "ENHANCED_QUALITY"
  | "STANDARD_QUALITY"
  | (string & {});
export const H264QualityLevel = S.String;
export type H264RateControlMode =
  | "CBR"
  | "MULTIPLEX"
  | "QVBR"
  | "VBR"
  | (string & {});
export const H264RateControlMode = S.String;
export type H264ScanType = "INTERLACED" | "PROGRESSIVE" | (string & {});
export const H264ScanType = S.String;
export type H264SceneChangeDetect = "DISABLED" | "ENABLED" | (string & {});
export const H264SceneChangeDetect = S.String;
export type H264SpatialAq = "DISABLED" | "ENABLED" | (string & {});
export const H264SpatialAq = S.String;
export type H264SubGopLength = "DYNAMIC" | "FIXED" | (string & {});
export const H264SubGopLength = S.String;
export type H264Syntax = "DEFAULT" | "RP2027" | (string & {});
export const H264Syntax = S.String;
export type H264TemporalAq = "DISABLED" | "ENABLED" | (string & {});
export const H264TemporalAq = S.String;
export type H264TimecodeInsertionBehavior =
  | "DISABLED"
  | "PIC_TIMING_SEI"
  | (string & {});
export const H264TimecodeInsertionBehavior = S.String;
export interface H264Settings {
  AdaptiveQuantization?: H264AdaptiveQuantization;
  AfdSignaling?: AfdSignaling;
  Bitrate?: number;
  BufFillPct?: number;
  BufSize?: number;
  ColorMetadata?: H264ColorMetadata;
  ColorSpaceSettings?: H264ColorSpaceSettings;
  EntropyEncoding?: H264EntropyEncoding;
  FilterSettings?: H264FilterSettings;
  FixedAfd?: FixedAfd;
  FlickerAq?: H264FlickerAq;
  ForceFieldPictures?: H264ForceFieldPictures;
  FramerateControl?: H264FramerateControl;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopBReference?: H264GopBReference;
  GopClosedCadence?: number;
  GopNumBFrames?: number;
  GopSize?: number;
  GopSizeUnits?: H264GopSizeUnits;
  Level?: H264Level;
  LookAheadRateControl?: H264LookAheadRateControl;
  MaxBitrate?: number;
  MinIInterval?: number;
  NumRefFrames?: number;
  ParControl?: H264ParControl;
  ParDenominator?: number;
  ParNumerator?: number;
  Profile?: H264Profile;
  QualityLevel?: H264QualityLevel;
  QvbrQualityLevel?: number;
  RateControlMode?: H264RateControlMode;
  ScanType?: H264ScanType;
  SceneChangeDetect?: H264SceneChangeDetect;
  Slices?: number;
  Softness?: number;
  SpatialAq?: H264SpatialAq;
  SubgopLength?: H264SubGopLength;
  Syntax?: H264Syntax;
  TemporalAq?: H264TemporalAq;
  TimecodeInsertion?: H264TimecodeInsertionBehavior;
  TimecodeBurninSettings?: TimecodeBurninSettings;
  MinQp?: number;
  MinBitrate?: number;
}
export const H264Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(H264AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    AfdSignaling: S.optional(AfdSignaling).pipe(T.JsonName("afdSignaling")),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BufFillPct: S.optional(S.Number).pipe(T.JsonName("bufFillPct")),
    BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
    ColorMetadata: S.optional(H264ColorMetadata).pipe(
      T.JsonName("colorMetadata"),
    ),
    ColorSpaceSettings: S.optional(H264ColorSpaceSettings)
      .pipe(T.JsonName("colorSpaceSettings"))
      .annotations({ identifier: "H264ColorSpaceSettings" }),
    EntropyEncoding: S.optional(H264EntropyEncoding).pipe(
      T.JsonName("entropyEncoding"),
    ),
    FilterSettings: S.optional(H264FilterSettings)
      .pipe(T.JsonName("filterSettings"))
      .annotations({ identifier: "H264FilterSettings" }),
    FixedAfd: S.optional(FixedAfd).pipe(T.JsonName("fixedAfd")),
    FlickerAq: S.optional(H264FlickerAq).pipe(T.JsonName("flickerAq")),
    ForceFieldPictures: S.optional(H264ForceFieldPictures).pipe(
      T.JsonName("forceFieldPictures"),
    ),
    FramerateControl: S.optional(H264FramerateControl).pipe(
      T.JsonName("framerateControl"),
    ),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopBReference: S.optional(H264GopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(H264GopSizeUnits).pipe(T.JsonName("gopSizeUnits")),
    Level: S.optional(H264Level).pipe(T.JsonName("level")),
    LookAheadRateControl: S.optional(H264LookAheadRateControl).pipe(
      T.JsonName("lookAheadRateControl"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    NumRefFrames: S.optional(S.Number).pipe(T.JsonName("numRefFrames")),
    ParControl: S.optional(H264ParControl).pipe(T.JsonName("parControl")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    Profile: S.optional(H264Profile).pipe(T.JsonName("profile")),
    QualityLevel: S.optional(H264QualityLevel).pipe(T.JsonName("qualityLevel")),
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    RateControlMode: S.optional(H264RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    ScanType: S.optional(H264ScanType).pipe(T.JsonName("scanType")),
    SceneChangeDetect: S.optional(H264SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
    SpatialAq: S.optional(H264SpatialAq).pipe(T.JsonName("spatialAq")),
    SubgopLength: S.optional(H264SubGopLength).pipe(T.JsonName("subgopLength")),
    Syntax: S.optional(H264Syntax).pipe(T.JsonName("syntax")),
    TemporalAq: S.optional(H264TemporalAq).pipe(T.JsonName("temporalAq")),
    TimecodeInsertion: S.optional(H264TimecodeInsertionBehavior).pipe(
      T.JsonName("timecodeInsertion"),
    ),
    TimecodeBurninSettings: S.optional(TimecodeBurninSettings)
      .pipe(T.JsonName("timecodeBurninSettings"))
      .annotations({ identifier: "TimecodeBurninSettings" }),
    MinQp: S.optional(S.Number).pipe(T.JsonName("minQp")),
    MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
  }),
).annotations({ identifier: "H264Settings" }) as any as S.Schema<H264Settings>;
export type H265AdaptiveQuantization =
  | "AUTO"
  | "HIGH"
  | "HIGHER"
  | "LOW"
  | "MAX"
  | "MEDIUM"
  | "OFF"
  | (string & {});
export const H265AdaptiveQuantization = S.String;
export type H265AlternativeTransferFunction = "INSERT" | "OMIT" | (string & {});
export const H265AlternativeTransferFunction = S.String;
export type H265ColorMetadata = "IGNORE" | "INSERT" | (string & {});
export const H265ColorMetadata = S.String;
export interface DolbyVision81Settings {}
export const DolbyVision81Settings = S.suspend(() => S.Struct({})).annotations({
  identifier: "DolbyVision81Settings",
}) as any as S.Schema<DolbyVision81Settings>;
export interface Hdr10Settings {
  MaxCll?: number;
  MaxFall?: number;
}
export const Hdr10Settings = S.suspend(() =>
  S.Struct({
    MaxCll: S.optional(S.Number).pipe(T.JsonName("maxCll")),
    MaxFall: S.optional(S.Number).pipe(T.JsonName("maxFall")),
  }),
).annotations({
  identifier: "Hdr10Settings",
}) as any as S.Schema<Hdr10Settings>;
export interface Hlg2020Settings {}
export const Hlg2020Settings = S.suspend(() => S.Struct({})).annotations({
  identifier: "Hlg2020Settings",
}) as any as S.Schema<Hlg2020Settings>;
export interface H265ColorSpaceSettings {
  ColorSpacePassthroughSettings?: ColorSpacePassthroughSettings;
  DolbyVision81Settings?: DolbyVision81Settings;
  Hdr10Settings?: Hdr10Settings;
  Rec601Settings?: Rec601Settings;
  Rec709Settings?: Rec709Settings;
  Hlg2020Settings?: Hlg2020Settings;
}
export const H265ColorSpaceSettings = S.suspend(() =>
  S.Struct({
    ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings)
      .pipe(T.JsonName("colorSpacePassthroughSettings"))
      .annotations({ identifier: "ColorSpacePassthroughSettings" }),
    DolbyVision81Settings: S.optional(DolbyVision81Settings)
      .pipe(T.JsonName("dolbyVision81Settings"))
      .annotations({ identifier: "DolbyVision81Settings" }),
    Hdr10Settings: S.optional(Hdr10Settings)
      .pipe(T.JsonName("hdr10Settings"))
      .annotations({ identifier: "Hdr10Settings" }),
    Rec601Settings: S.optional(Rec601Settings)
      .pipe(T.JsonName("rec601Settings"))
      .annotations({ identifier: "Rec601Settings" }),
    Rec709Settings: S.optional(Rec709Settings)
      .pipe(T.JsonName("rec709Settings"))
      .annotations({ identifier: "Rec709Settings" }),
    Hlg2020Settings: S.optional(Hlg2020Settings)
      .pipe(T.JsonName("hlg2020Settings"))
      .annotations({ identifier: "Hlg2020Settings" }),
  }),
).annotations({
  identifier: "H265ColorSpaceSettings",
}) as any as S.Schema<H265ColorSpaceSettings>;
export interface H265FilterSettings {
  TemporalFilterSettings?: TemporalFilterSettings;
  BandwidthReductionFilterSettings?: BandwidthReductionFilterSettings;
}
export const H265FilterSettings = S.suspend(() =>
  S.Struct({
    TemporalFilterSettings: S.optional(TemporalFilterSettings)
      .pipe(T.JsonName("temporalFilterSettings"))
      .annotations({ identifier: "TemporalFilterSettings" }),
    BandwidthReductionFilterSettings: S.optional(
      BandwidthReductionFilterSettings,
    )
      .pipe(T.JsonName("bandwidthReductionFilterSettings"))
      .annotations({ identifier: "BandwidthReductionFilterSettings" }),
  }),
).annotations({
  identifier: "H265FilterSettings",
}) as any as S.Schema<H265FilterSettings>;
export type H265FlickerAq = "DISABLED" | "ENABLED" | (string & {});
export const H265FlickerAq = S.String;
export type H265GopSizeUnits = "FRAMES" | "SECONDS" | (string & {});
export const H265GopSizeUnits = S.String;
export type H265Level =
  | "H265_LEVEL_1"
  | "H265_LEVEL_2"
  | "H265_LEVEL_2_1"
  | "H265_LEVEL_3"
  | "H265_LEVEL_3_1"
  | "H265_LEVEL_4"
  | "H265_LEVEL_4_1"
  | "H265_LEVEL_5"
  | "H265_LEVEL_5_1"
  | "H265_LEVEL_5_2"
  | "H265_LEVEL_6"
  | "H265_LEVEL_6_1"
  | "H265_LEVEL_6_2"
  | "H265_LEVEL_AUTO"
  | (string & {});
export const H265Level = S.String;
export type H265LookAheadRateControl =
  | "HIGH"
  | "LOW"
  | "MEDIUM"
  | (string & {});
export const H265LookAheadRateControl = S.String;
export type H265Profile = "MAIN" | "MAIN_10BIT" | (string & {});
export const H265Profile = S.String;
export type H265RateControlMode = "CBR" | "MULTIPLEX" | "QVBR" | (string & {});
export const H265RateControlMode = S.String;
export type H265ScanType = "INTERLACED" | "PROGRESSIVE" | (string & {});
export const H265ScanType = S.String;
export type H265SceneChangeDetect = "DISABLED" | "ENABLED" | (string & {});
export const H265SceneChangeDetect = S.String;
export type H265Tier = "HIGH" | "MAIN" | (string & {});
export const H265Tier = S.String;
export type H265TimecodeInsertionBehavior =
  | "DISABLED"
  | "PIC_TIMING_SEI"
  | (string & {});
export const H265TimecodeInsertionBehavior = S.String;
export type H265MvOverPictureBoundaries =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const H265MvOverPictureBoundaries = S.String;
export type H265MvTemporalPredictor = "DISABLED" | "ENABLED" | (string & {});
export const H265MvTemporalPredictor = S.String;
export type H265TilePadding = "NONE" | "PADDED" | (string & {});
export const H265TilePadding = S.String;
export type H265TreeblockSize = "AUTO" | "TREE_SIZE_32X32" | (string & {});
export const H265TreeblockSize = S.String;
export type H265Deblocking = "DISABLED" | "ENABLED" | (string & {});
export const H265Deblocking = S.String;
export type H265GopBReference = "DISABLED" | "ENABLED" | (string & {});
export const H265GopBReference = S.String;
export type H265SubGopLength = "DYNAMIC" | "FIXED" | (string & {});
export const H265SubGopLength = S.String;
export interface H265Settings {
  AdaptiveQuantization?: H265AdaptiveQuantization;
  AfdSignaling?: AfdSignaling;
  AlternativeTransferFunction?: H265AlternativeTransferFunction;
  Bitrate?: number;
  BufSize?: number;
  ColorMetadata?: H265ColorMetadata;
  ColorSpaceSettings?: H265ColorSpaceSettings;
  FilterSettings?: H265FilterSettings;
  FixedAfd?: FixedAfd;
  FlickerAq?: H265FlickerAq;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopClosedCadence?: number;
  GopSize?: number;
  GopSizeUnits?: H265GopSizeUnits;
  Level?: H265Level;
  LookAheadRateControl?: H265LookAheadRateControl;
  MaxBitrate?: number;
  MinIInterval?: number;
  ParDenominator?: number;
  ParNumerator?: number;
  Profile?: H265Profile;
  QvbrQualityLevel?: number;
  RateControlMode?: H265RateControlMode;
  ScanType?: H265ScanType;
  SceneChangeDetect?: H265SceneChangeDetect;
  Slices?: number;
  Tier?: H265Tier;
  TimecodeInsertion?: H265TimecodeInsertionBehavior;
  TimecodeBurninSettings?: TimecodeBurninSettings;
  MvOverPictureBoundaries?: H265MvOverPictureBoundaries;
  MvTemporalPredictor?: H265MvTemporalPredictor;
  TileHeight?: number;
  TilePadding?: H265TilePadding;
  TileWidth?: number;
  TreeblockSize?: H265TreeblockSize;
  MinQp?: number;
  Deblocking?: H265Deblocking;
  GopBReference?: H265GopBReference;
  GopNumBFrames?: number;
  MinBitrate?: number;
  SubgopLength?: H265SubGopLength;
}
export const H265Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(H265AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    AfdSignaling: S.optional(AfdSignaling).pipe(T.JsonName("afdSignaling")),
    AlternativeTransferFunction: S.optional(
      H265AlternativeTransferFunction,
    ).pipe(T.JsonName("alternativeTransferFunction")),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
    ColorMetadata: S.optional(H265ColorMetadata).pipe(
      T.JsonName("colorMetadata"),
    ),
    ColorSpaceSettings: S.optional(H265ColorSpaceSettings)
      .pipe(T.JsonName("colorSpaceSettings"))
      .annotations({ identifier: "H265ColorSpaceSettings" }),
    FilterSettings: S.optional(H265FilterSettings)
      .pipe(T.JsonName("filterSettings"))
      .annotations({ identifier: "H265FilterSettings" }),
    FixedAfd: S.optional(FixedAfd).pipe(T.JsonName("fixedAfd")),
    FlickerAq: S.optional(H265FlickerAq).pipe(T.JsonName("flickerAq")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(H265GopSizeUnits).pipe(T.JsonName("gopSizeUnits")),
    Level: S.optional(H265Level).pipe(T.JsonName("level")),
    LookAheadRateControl: S.optional(H265LookAheadRateControl).pipe(
      T.JsonName("lookAheadRateControl"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    Profile: S.optional(H265Profile).pipe(T.JsonName("profile")),
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    RateControlMode: S.optional(H265RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    ScanType: S.optional(H265ScanType).pipe(T.JsonName("scanType")),
    SceneChangeDetect: S.optional(H265SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
    Tier: S.optional(H265Tier).pipe(T.JsonName("tier")),
    TimecodeInsertion: S.optional(H265TimecodeInsertionBehavior).pipe(
      T.JsonName("timecodeInsertion"),
    ),
    TimecodeBurninSettings: S.optional(TimecodeBurninSettings)
      .pipe(T.JsonName("timecodeBurninSettings"))
      .annotations({ identifier: "TimecodeBurninSettings" }),
    MvOverPictureBoundaries: S.optional(H265MvOverPictureBoundaries).pipe(
      T.JsonName("mvOverPictureBoundaries"),
    ),
    MvTemporalPredictor: S.optional(H265MvTemporalPredictor).pipe(
      T.JsonName("mvTemporalPredictor"),
    ),
    TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
    TilePadding: S.optional(H265TilePadding).pipe(T.JsonName("tilePadding")),
    TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
    TreeblockSize: S.optional(H265TreeblockSize).pipe(
      T.JsonName("treeblockSize"),
    ),
    MinQp: S.optional(S.Number).pipe(T.JsonName("minQp")),
    Deblocking: S.optional(H265Deblocking).pipe(T.JsonName("deblocking")),
    GopBReference: S.optional(H265GopBReference).pipe(
      T.JsonName("gopBReference"),
    ),
    GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
    MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
    SubgopLength: S.optional(H265SubGopLength).pipe(T.JsonName("subgopLength")),
  }),
).annotations({ identifier: "H265Settings" }) as any as S.Schema<H265Settings>;
export type Mpeg2AdaptiveQuantization =
  | "AUTO"
  | "HIGH"
  | "LOW"
  | "MEDIUM"
  | "OFF"
  | (string & {});
export const Mpeg2AdaptiveQuantization = S.String;
export type Mpeg2ColorMetadata = "IGNORE" | "INSERT" | (string & {});
export const Mpeg2ColorMetadata = S.String;
export type Mpeg2ColorSpace = "AUTO" | "PASSTHROUGH" | (string & {});
export const Mpeg2ColorSpace = S.String;
export type Mpeg2DisplayRatio =
  | "DISPLAYRATIO16X9"
  | "DISPLAYRATIO4X3"
  | (string & {});
export const Mpeg2DisplayRatio = S.String;
export interface Mpeg2FilterSettings {
  TemporalFilterSettings?: TemporalFilterSettings;
}
export const Mpeg2FilterSettings = S.suspend(() =>
  S.Struct({
    TemporalFilterSettings: S.optional(TemporalFilterSettings)
      .pipe(T.JsonName("temporalFilterSettings"))
      .annotations({ identifier: "TemporalFilterSettings" }),
  }),
).annotations({
  identifier: "Mpeg2FilterSettings",
}) as any as S.Schema<Mpeg2FilterSettings>;
export type Mpeg2GopSizeUnits = "FRAMES" | "SECONDS" | (string & {});
export const Mpeg2GopSizeUnits = S.String;
export type Mpeg2ScanType = "INTERLACED" | "PROGRESSIVE" | (string & {});
export const Mpeg2ScanType = S.String;
export type Mpeg2SubGopLength = "DYNAMIC" | "FIXED" | (string & {});
export const Mpeg2SubGopLength = S.String;
export type Mpeg2TimecodeInsertionBehavior =
  | "DISABLED"
  | "GOP_TIMECODE"
  | (string & {});
export const Mpeg2TimecodeInsertionBehavior = S.String;
export interface Mpeg2Settings {
  AdaptiveQuantization?: Mpeg2AdaptiveQuantization;
  AfdSignaling?: AfdSignaling;
  ColorMetadata?: Mpeg2ColorMetadata;
  ColorSpace?: Mpeg2ColorSpace;
  DisplayAspectRatio?: Mpeg2DisplayRatio;
  FilterSettings?: Mpeg2FilterSettings;
  FixedAfd?: FixedAfd;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopClosedCadence?: number;
  GopNumBFrames?: number;
  GopSize?: number;
  GopSizeUnits?: Mpeg2GopSizeUnits;
  ScanType?: Mpeg2ScanType;
  SubgopLength?: Mpeg2SubGopLength;
  TimecodeInsertion?: Mpeg2TimecodeInsertionBehavior;
  TimecodeBurninSettings?: TimecodeBurninSettings;
}
export const Mpeg2Settings = S.suspend(() =>
  S.Struct({
    AdaptiveQuantization: S.optional(Mpeg2AdaptiveQuantization).pipe(
      T.JsonName("adaptiveQuantization"),
    ),
    AfdSignaling: S.optional(AfdSignaling).pipe(T.JsonName("afdSignaling")),
    ColorMetadata: S.optional(Mpeg2ColorMetadata).pipe(
      T.JsonName("colorMetadata"),
    ),
    ColorSpace: S.optional(Mpeg2ColorSpace).pipe(T.JsonName("colorSpace")),
    DisplayAspectRatio: S.optional(Mpeg2DisplayRatio).pipe(
      T.JsonName("displayAspectRatio"),
    ),
    FilterSettings: S.optional(Mpeg2FilterSettings)
      .pipe(T.JsonName("filterSettings"))
      .annotations({ identifier: "Mpeg2FilterSettings" }),
    FixedAfd: S.optional(FixedAfd).pipe(T.JsonName("fixedAfd")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
    GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(Mpeg2GopSizeUnits).pipe(
      T.JsonName("gopSizeUnits"),
    ),
    ScanType: S.optional(Mpeg2ScanType).pipe(T.JsonName("scanType")),
    SubgopLength: S.optional(Mpeg2SubGopLength).pipe(
      T.JsonName("subgopLength"),
    ),
    TimecodeInsertion: S.optional(Mpeg2TimecodeInsertionBehavior).pipe(
      T.JsonName("timecodeInsertion"),
    ),
    TimecodeBurninSettings: S.optional(TimecodeBurninSettings)
      .pipe(T.JsonName("timecodeBurninSettings"))
      .annotations({ identifier: "TimecodeBurninSettings" }),
  }),
).annotations({
  identifier: "Mpeg2Settings",
}) as any as S.Schema<Mpeg2Settings>;
export interface Av1ColorSpaceSettings {
  ColorSpacePassthroughSettings?: ColorSpacePassthroughSettings;
  Hdr10Settings?: Hdr10Settings;
  Rec601Settings?: Rec601Settings;
  Rec709Settings?: Rec709Settings;
}
export const Av1ColorSpaceSettings = S.suspend(() =>
  S.Struct({
    ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings)
      .pipe(T.JsonName("colorSpacePassthroughSettings"))
      .annotations({ identifier: "ColorSpacePassthroughSettings" }),
    Hdr10Settings: S.optional(Hdr10Settings)
      .pipe(T.JsonName("hdr10Settings"))
      .annotations({ identifier: "Hdr10Settings" }),
    Rec601Settings: S.optional(Rec601Settings)
      .pipe(T.JsonName("rec601Settings"))
      .annotations({ identifier: "Rec601Settings" }),
    Rec709Settings: S.optional(Rec709Settings)
      .pipe(T.JsonName("rec709Settings"))
      .annotations({ identifier: "Rec709Settings" }),
  }),
).annotations({
  identifier: "Av1ColorSpaceSettings",
}) as any as S.Schema<Av1ColorSpaceSettings>;
export type Av1GopSizeUnits = "FRAMES" | "SECONDS" | (string & {});
export const Av1GopSizeUnits = S.String;
export type Av1Level =
  | "AV1_LEVEL_2"
  | "AV1_LEVEL_2_1"
  | "AV1_LEVEL_3"
  | "AV1_LEVEL_3_1"
  | "AV1_LEVEL_4"
  | "AV1_LEVEL_4_1"
  | "AV1_LEVEL_5"
  | "AV1_LEVEL_5_1"
  | "AV1_LEVEL_5_2"
  | "AV1_LEVEL_5_3"
  | "AV1_LEVEL_6"
  | "AV1_LEVEL_6_1"
  | "AV1_LEVEL_6_2"
  | "AV1_LEVEL_6_3"
  | "AV1_LEVEL_AUTO"
  | (string & {});
export const Av1Level = S.String;
export type Av1LookAheadRateControl = "HIGH" | "LOW" | "MEDIUM" | (string & {});
export const Av1LookAheadRateControl = S.String;
export type Av1SceneChangeDetect = "DISABLED" | "ENABLED" | (string & {});
export const Av1SceneChangeDetect = S.String;
export type Av1RateControlMode = "CBR" | "QVBR" | (string & {});
export const Av1RateControlMode = S.String;
export type Av1SpatialAq = "DISABLED" | "ENABLED" | (string & {});
export const Av1SpatialAq = S.String;
export type Av1TemporalAq = "DISABLED" | "ENABLED" | (string & {});
export const Av1TemporalAq = S.String;
export interface Av1Settings {
  AfdSignaling?: AfdSignaling;
  BufSize?: number;
  ColorSpaceSettings?: Av1ColorSpaceSettings;
  FixedAfd?: FixedAfd;
  FramerateDenominator?: number;
  FramerateNumerator?: number;
  GopSize?: number;
  GopSizeUnits?: Av1GopSizeUnits;
  Level?: Av1Level;
  LookAheadRateControl?: Av1LookAheadRateControl;
  MaxBitrate?: number;
  MinIInterval?: number;
  ParDenominator?: number;
  ParNumerator?: number;
  QvbrQualityLevel?: number;
  SceneChangeDetect?: Av1SceneChangeDetect;
  TimecodeBurninSettings?: TimecodeBurninSettings;
  Bitrate?: number;
  RateControlMode?: Av1RateControlMode;
  MinBitrate?: number;
  SpatialAq?: Av1SpatialAq;
  TemporalAq?: Av1TemporalAq;
}
export const Av1Settings = S.suspend(() =>
  S.Struct({
    AfdSignaling: S.optional(AfdSignaling).pipe(T.JsonName("afdSignaling")),
    BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
    ColorSpaceSettings: S.optional(Av1ColorSpaceSettings)
      .pipe(T.JsonName("colorSpaceSettings"))
      .annotations({ identifier: "Av1ColorSpaceSettings" }),
    FixedAfd: S.optional(FixedAfd).pipe(T.JsonName("fixedAfd")),
    FramerateDenominator: S.optional(S.Number).pipe(
      T.JsonName("framerateDenominator"),
    ),
    FramerateNumerator: S.optional(S.Number).pipe(
      T.JsonName("framerateNumerator"),
    ),
    GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
    GopSizeUnits: S.optional(Av1GopSizeUnits).pipe(T.JsonName("gopSizeUnits")),
    Level: S.optional(Av1Level).pipe(T.JsonName("level")),
    LookAheadRateControl: S.optional(Av1LookAheadRateControl).pipe(
      T.JsonName("lookAheadRateControl"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
    ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
    ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
    QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
    SceneChangeDetect: S.optional(Av1SceneChangeDetect).pipe(
      T.JsonName("sceneChangeDetect"),
    ),
    TimecodeBurninSettings: S.optional(TimecodeBurninSettings)
      .pipe(T.JsonName("timecodeBurninSettings"))
      .annotations({ identifier: "TimecodeBurninSettings" }),
    Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
    RateControlMode: S.optional(Av1RateControlMode).pipe(
      T.JsonName("rateControlMode"),
    ),
    MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
    SpatialAq: S.optional(Av1SpatialAq).pipe(T.JsonName("spatialAq")),
    TemporalAq: S.optional(Av1TemporalAq).pipe(T.JsonName("temporalAq")),
  }),
).annotations({ identifier: "Av1Settings" }) as any as S.Schema<Av1Settings>;
export interface VideoCodecSettings {
  FrameCaptureSettings?: FrameCaptureSettings;
  H264Settings?: H264Settings;
  H265Settings?: H265Settings;
  Mpeg2Settings?: Mpeg2Settings;
  Av1Settings?: Av1Settings;
}
export const VideoCodecSettings = S.suspend(() =>
  S.Struct({
    FrameCaptureSettings: S.optional(FrameCaptureSettings)
      .pipe(T.JsonName("frameCaptureSettings"))
      .annotations({ identifier: "FrameCaptureSettings" }),
    H264Settings: S.optional(H264Settings)
      .pipe(T.JsonName("h264Settings"))
      .annotations({ identifier: "H264Settings" }),
    H265Settings: S.optional(H265Settings)
      .pipe(T.JsonName("h265Settings"))
      .annotations({ identifier: "H265Settings" }),
    Mpeg2Settings: S.optional(Mpeg2Settings)
      .pipe(T.JsonName("mpeg2Settings"))
      .annotations({ identifier: "Mpeg2Settings" }),
    Av1Settings: S.optional(Av1Settings)
      .pipe(T.JsonName("av1Settings"))
      .annotations({ identifier: "Av1Settings" }),
  }),
).annotations({
  identifier: "VideoCodecSettings",
}) as any as S.Schema<VideoCodecSettings>;
export interface VideoDescription {
  CodecSettings?: VideoCodecSettings;
  Height?: number;
  Name?: string;
  RespondToAfd?: VideoDescriptionRespondToAfd;
  ScalingBehavior?: VideoDescriptionScalingBehavior;
  Sharpness?: number;
  Width?: number;
}
export const VideoDescription = S.suspend(() =>
  S.Struct({
    CodecSettings: S.optional(VideoCodecSettings)
      .pipe(T.JsonName("codecSettings"))
      .annotations({ identifier: "VideoCodecSettings" }),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RespondToAfd: S.optional(VideoDescriptionRespondToAfd).pipe(
      T.JsonName("respondToAfd"),
    ),
    ScalingBehavior: S.optional(VideoDescriptionScalingBehavior).pipe(
      T.JsonName("scalingBehavior"),
    ),
    Sharpness: S.optional(S.Number).pipe(T.JsonName("sharpness")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "VideoDescription",
}) as any as S.Schema<VideoDescription>;
export type __listOfVideoDescription = VideoDescription[];
export const __listOfVideoDescription = S.Array(VideoDescription);
export interface ThumbnailConfiguration {
  State?: ThumbnailState;
}
export const ThumbnailConfiguration = S.suspend(() =>
  S.Struct({ State: S.optional(ThumbnailState).pipe(T.JsonName("state")) }),
).annotations({
  identifier: "ThumbnailConfiguration",
}) as any as S.Schema<ThumbnailConfiguration>;
export type ColorSpace =
  | "HDR10"
  | "HLG_2020"
  | "REC_601"
  | "REC_709"
  | (string & {});
export const ColorSpace = S.String;
export interface ColorCorrection {
  InputColorSpace?: ColorSpace;
  OutputColorSpace?: ColorSpace;
  Uri?: string;
}
export const ColorCorrection = S.suspend(() =>
  S.Struct({
    InputColorSpace: S.optional(ColorSpace).pipe(T.JsonName("inputColorSpace")),
    OutputColorSpace: S.optional(ColorSpace).pipe(
      T.JsonName("outputColorSpace"),
    ),
    Uri: S.optional(S.String).pipe(T.JsonName("uri")),
  }),
).annotations({
  identifier: "ColorCorrection",
}) as any as S.Schema<ColorCorrection>;
export type __listOfColorCorrection = ColorCorrection[];
export const __listOfColorCorrection = S.Array(ColorCorrection);
export interface ColorCorrectionSettings {
  GlobalColorCorrections?: ColorCorrection[];
}
export const ColorCorrectionSettings = S.suspend(() =>
  S.Struct({
    GlobalColorCorrections: S.optional(__listOfColorCorrection).pipe(
      T.JsonName("globalColorCorrections"),
    ),
  }),
).annotations({
  identifier: "ColorCorrectionSettings",
}) as any as S.Schema<ColorCorrectionSettings>;
export interface EncoderSettings {
  AudioDescriptions?: AudioDescription[];
  AvailBlanking?: AvailBlanking;
  AvailConfiguration?: AvailConfiguration;
  BlackoutSlate?: BlackoutSlate;
  CaptionDescriptions?: CaptionDescription[];
  FeatureActivations?: FeatureActivations;
  GlobalConfiguration?: GlobalConfiguration;
  MotionGraphicsConfiguration?: MotionGraphicsConfiguration;
  NielsenConfiguration?: NielsenConfiguration;
  OutputGroups?: OutputGroup[];
  TimecodeConfig?: TimecodeConfig;
  VideoDescriptions?: VideoDescription[];
  ThumbnailConfiguration?: ThumbnailConfiguration;
  ColorCorrectionSettings?: ColorCorrectionSettings;
}
export const EncoderSettings = S.suspend(() =>
  S.Struct({
    AudioDescriptions: S.optional(__listOfAudioDescription).pipe(
      T.JsonName("audioDescriptions"),
    ),
    AvailBlanking: S.optional(AvailBlanking)
      .pipe(T.JsonName("availBlanking"))
      .annotations({ identifier: "AvailBlanking" }),
    AvailConfiguration: S.optional(AvailConfiguration)
      .pipe(T.JsonName("availConfiguration"))
      .annotations({ identifier: "AvailConfiguration" }),
    BlackoutSlate: S.optional(BlackoutSlate)
      .pipe(T.JsonName("blackoutSlate"))
      .annotations({ identifier: "BlackoutSlate" }),
    CaptionDescriptions: S.optional(__listOfCaptionDescription).pipe(
      T.JsonName("captionDescriptions"),
    ),
    FeatureActivations: S.optional(FeatureActivations)
      .pipe(T.JsonName("featureActivations"))
      .annotations({ identifier: "FeatureActivations" }),
    GlobalConfiguration: S.optional(GlobalConfiguration)
      .pipe(T.JsonName("globalConfiguration"))
      .annotations({ identifier: "GlobalConfiguration" }),
    MotionGraphicsConfiguration: S.optional(MotionGraphicsConfiguration)
      .pipe(T.JsonName("motionGraphicsConfiguration"))
      .annotations({ identifier: "MotionGraphicsConfiguration" }),
    NielsenConfiguration: S.optional(NielsenConfiguration)
      .pipe(T.JsonName("nielsenConfiguration"))
      .annotations({ identifier: "NielsenConfiguration" }),
    OutputGroups: S.optional(__listOfOutputGroup).pipe(
      T.JsonName("outputGroups"),
    ),
    TimecodeConfig: S.optional(TimecodeConfig)
      .pipe(T.JsonName("timecodeConfig"))
      .annotations({ identifier: "TimecodeConfig" }),
    VideoDescriptions: S.optional(__listOfVideoDescription).pipe(
      T.JsonName("videoDescriptions"),
    ),
    ThumbnailConfiguration: S.optional(ThumbnailConfiguration)
      .pipe(T.JsonName("thumbnailConfiguration"))
      .annotations({ identifier: "ThumbnailConfiguration" }),
    ColorCorrectionSettings: S.optional(ColorCorrectionSettings)
      .pipe(T.JsonName("colorCorrectionSettings"))
      .annotations({ identifier: "ColorCorrectionSettings" }),
  }),
).annotations({
  identifier: "EncoderSettings",
}) as any as S.Schema<EncoderSettings>;
export interface AudioSilenceFailoverSettings {
  AudioSelectorName?: string;
  AudioSilenceThresholdMsec?: number;
}
export const AudioSilenceFailoverSettings = S.suspend(() =>
  S.Struct({
    AudioSelectorName: S.optional(S.String).pipe(
      T.JsonName("audioSelectorName"),
    ),
    AudioSilenceThresholdMsec: S.optional(S.Number).pipe(
      T.JsonName("audioSilenceThresholdMsec"),
    ),
  }),
).annotations({
  identifier: "AudioSilenceFailoverSettings",
}) as any as S.Schema<AudioSilenceFailoverSettings>;
export interface InputLossFailoverSettings {
  InputLossThresholdMsec?: number;
}
export const InputLossFailoverSettings = S.suspend(() =>
  S.Struct({
    InputLossThresholdMsec: S.optional(S.Number).pipe(
      T.JsonName("inputLossThresholdMsec"),
    ),
  }),
).annotations({
  identifier: "InputLossFailoverSettings",
}) as any as S.Schema<InputLossFailoverSettings>;
export interface VideoBlackFailoverSettings {
  BlackDetectThreshold?: number;
  VideoBlackThresholdMsec?: number;
}
export const VideoBlackFailoverSettings = S.suspend(() =>
  S.Struct({
    BlackDetectThreshold: S.optional(S.Number).pipe(
      T.JsonName("blackDetectThreshold"),
    ),
    VideoBlackThresholdMsec: S.optional(S.Number).pipe(
      T.JsonName("videoBlackThresholdMsec"),
    ),
  }),
).annotations({
  identifier: "VideoBlackFailoverSettings",
}) as any as S.Schema<VideoBlackFailoverSettings>;
export interface FailoverConditionSettings {
  AudioSilenceSettings?: AudioSilenceFailoverSettings;
  InputLossSettings?: InputLossFailoverSettings;
  VideoBlackSettings?: VideoBlackFailoverSettings;
}
export const FailoverConditionSettings = S.suspend(() =>
  S.Struct({
    AudioSilenceSettings: S.optional(AudioSilenceFailoverSettings)
      .pipe(T.JsonName("audioSilenceSettings"))
      .annotations({ identifier: "AudioSilenceFailoverSettings" }),
    InputLossSettings: S.optional(InputLossFailoverSettings)
      .pipe(T.JsonName("inputLossSettings"))
      .annotations({ identifier: "InputLossFailoverSettings" }),
    VideoBlackSettings: S.optional(VideoBlackFailoverSettings)
      .pipe(T.JsonName("videoBlackSettings"))
      .annotations({ identifier: "VideoBlackFailoverSettings" }),
  }),
).annotations({
  identifier: "FailoverConditionSettings",
}) as any as S.Schema<FailoverConditionSettings>;
export interface FailoverCondition {
  FailoverConditionSettings?: FailoverConditionSettings;
}
export const FailoverCondition = S.suspend(() =>
  S.Struct({
    FailoverConditionSettings: S.optional(FailoverConditionSettings)
      .pipe(T.JsonName("failoverConditionSettings"))
      .annotations({ identifier: "FailoverConditionSettings" }),
  }),
).annotations({
  identifier: "FailoverCondition",
}) as any as S.Schema<FailoverCondition>;
export type __listOfFailoverCondition = FailoverCondition[];
export const __listOfFailoverCondition = S.Array(FailoverCondition);
export interface AutomaticInputFailoverSettings {
  ErrorClearTimeMsec?: number;
  FailoverConditions?: FailoverCondition[];
  InputPreference?: InputPreference;
  SecondaryInputId?: string;
}
export const AutomaticInputFailoverSettings = S.suspend(() =>
  S.Struct({
    ErrorClearTimeMsec: S.optional(S.Number).pipe(
      T.JsonName("errorClearTimeMsec"),
    ),
    FailoverConditions: S.optional(__listOfFailoverCondition).pipe(
      T.JsonName("failoverConditions"),
    ),
    InputPreference: S.optional(InputPreference).pipe(
      T.JsonName("inputPreference"),
    ),
    SecondaryInputId: S.optional(S.String).pipe(T.JsonName("secondaryInputId")),
  }),
).annotations({
  identifier: "AutomaticInputFailoverSettings",
}) as any as S.Schema<AutomaticInputFailoverSettings>;
export interface AudioHlsRenditionSelection {
  GroupId?: string;
  Name?: string;
}
export const AudioHlsRenditionSelection = S.suspend(() =>
  S.Struct({
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "AudioHlsRenditionSelection",
}) as any as S.Schema<AudioHlsRenditionSelection>;
export type AudioLanguageSelectionPolicy = "LOOSE" | "STRICT" | (string & {});
export const AudioLanguageSelectionPolicy = S.String;
export interface AudioLanguageSelection {
  LanguageCode?: string;
  LanguageSelectionPolicy?: AudioLanguageSelectionPolicy;
}
export const AudioLanguageSelection = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    LanguageSelectionPolicy: S.optional(AudioLanguageSelectionPolicy).pipe(
      T.JsonName("languageSelectionPolicy"),
    ),
  }),
).annotations({
  identifier: "AudioLanguageSelection",
}) as any as S.Schema<AudioLanguageSelection>;
export interface AudioPidSelection {
  Pid?: number;
}
export const AudioPidSelection = S.suspend(() =>
  S.Struct({ Pid: S.optional(S.Number).pipe(T.JsonName("pid")) }),
).annotations({
  identifier: "AudioPidSelection",
}) as any as S.Schema<AudioPidSelection>;
export interface AudioTrack {
  Track?: number;
}
export const AudioTrack = S.suspend(() =>
  S.Struct({ Track: S.optional(S.Number).pipe(T.JsonName("track")) }),
).annotations({ identifier: "AudioTrack" }) as any as S.Schema<AudioTrack>;
export type __listOfAudioTrack = AudioTrack[];
export const __listOfAudioTrack = S.Array(AudioTrack);
export type DolbyEProgramSelection =
  | "ALL_CHANNELS"
  | "PROGRAM_1"
  | "PROGRAM_2"
  | "PROGRAM_3"
  | "PROGRAM_4"
  | "PROGRAM_5"
  | "PROGRAM_6"
  | "PROGRAM_7"
  | "PROGRAM_8"
  | (string & {});
export const DolbyEProgramSelection = S.String;
export interface AudioDolbyEDecode {
  ProgramSelection?: DolbyEProgramSelection;
}
export const AudioDolbyEDecode = S.suspend(() =>
  S.Struct({
    ProgramSelection: S.optional(DolbyEProgramSelection).pipe(
      T.JsonName("programSelection"),
    ),
  }),
).annotations({
  identifier: "AudioDolbyEDecode",
}) as any as S.Schema<AudioDolbyEDecode>;
export interface AudioTrackSelection {
  Tracks?: AudioTrack[];
  DolbyEDecode?: AudioDolbyEDecode;
}
export const AudioTrackSelection = S.suspend(() =>
  S.Struct({
    Tracks: S.optional(__listOfAudioTrack).pipe(T.JsonName("tracks")),
    DolbyEDecode: S.optional(AudioDolbyEDecode)
      .pipe(T.JsonName("dolbyEDecode"))
      .annotations({ identifier: "AudioDolbyEDecode" }),
  }),
).annotations({
  identifier: "AudioTrackSelection",
}) as any as S.Schema<AudioTrackSelection>;
export interface AudioSelectorSettings {
  AudioHlsRenditionSelection?: AudioHlsRenditionSelection;
  AudioLanguageSelection?: AudioLanguageSelection;
  AudioPidSelection?: AudioPidSelection;
  AudioTrackSelection?: AudioTrackSelection;
}
export const AudioSelectorSettings = S.suspend(() =>
  S.Struct({
    AudioHlsRenditionSelection: S.optional(AudioHlsRenditionSelection)
      .pipe(T.JsonName("audioHlsRenditionSelection"))
      .annotations({ identifier: "AudioHlsRenditionSelection" }),
    AudioLanguageSelection: S.optional(AudioLanguageSelection)
      .pipe(T.JsonName("audioLanguageSelection"))
      .annotations({ identifier: "AudioLanguageSelection" }),
    AudioPidSelection: S.optional(AudioPidSelection)
      .pipe(T.JsonName("audioPidSelection"))
      .annotations({ identifier: "AudioPidSelection" }),
    AudioTrackSelection: S.optional(AudioTrackSelection)
      .pipe(T.JsonName("audioTrackSelection"))
      .annotations({ identifier: "AudioTrackSelection" }),
  }),
).annotations({
  identifier: "AudioSelectorSettings",
}) as any as S.Schema<AudioSelectorSettings>;
export interface AudioSelector {
  Name?: string;
  SelectorSettings?: AudioSelectorSettings;
}
export const AudioSelector = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SelectorSettings: S.optional(AudioSelectorSettings)
      .pipe(T.JsonName("selectorSettings"))
      .annotations({ identifier: "AudioSelectorSettings" }),
  }),
).annotations({
  identifier: "AudioSelector",
}) as any as S.Schema<AudioSelector>;
export type __listOfAudioSelector = AudioSelector[];
export const __listOfAudioSelector = S.Array(AudioSelector);
export interface AncillarySourceSettings {
  SourceAncillaryChannelNumber?: number;
}
export const AncillarySourceSettings = S.suspend(() =>
  S.Struct({
    SourceAncillaryChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("sourceAncillaryChannelNumber"),
    ),
  }),
).annotations({
  identifier: "AncillarySourceSettings",
}) as any as S.Schema<AncillarySourceSettings>;
export interface AribSourceSettings {}
export const AribSourceSettings = S.suspend(() => S.Struct({})).annotations({
  identifier: "AribSourceSettings",
}) as any as S.Schema<AribSourceSettings>;
export type DvbSubOcrLanguage =
  | "DEU"
  | "ENG"
  | "FRA"
  | "NLD"
  | "POR"
  | "SPA"
  | (string & {});
export const DvbSubOcrLanguage = S.String;
export interface DvbSubSourceSettings {
  OcrLanguage?: DvbSubOcrLanguage;
  Pid?: number;
}
export const DvbSubSourceSettings = S.suspend(() =>
  S.Struct({
    OcrLanguage: S.optional(DvbSubOcrLanguage).pipe(T.JsonName("ocrLanguage")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
  }),
).annotations({
  identifier: "DvbSubSourceSettings",
}) as any as S.Schema<DvbSubSourceSettings>;
export type EmbeddedConvert608To708 = "DISABLED" | "UPCONVERT" | (string & {});
export const EmbeddedConvert608To708 = S.String;
export type EmbeddedScte20Detection = "AUTO" | "OFF" | (string & {});
export const EmbeddedScte20Detection = S.String;
export interface EmbeddedSourceSettings {
  Convert608To708?: EmbeddedConvert608To708;
  Scte20Detection?: EmbeddedScte20Detection;
  Source608ChannelNumber?: number;
  Source608TrackNumber?: number;
}
export const EmbeddedSourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(EmbeddedConvert608To708).pipe(
      T.JsonName("convert608To708"),
    ),
    Scte20Detection: S.optional(EmbeddedScte20Detection).pipe(
      T.JsonName("scte20Detection"),
    ),
    Source608ChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("source608ChannelNumber"),
    ),
    Source608TrackNumber: S.optional(S.Number).pipe(
      T.JsonName("source608TrackNumber"),
    ),
  }),
).annotations({
  identifier: "EmbeddedSourceSettings",
}) as any as S.Schema<EmbeddedSourceSettings>;
export type Scte20Convert608To708 = "DISABLED" | "UPCONVERT" | (string & {});
export const Scte20Convert608To708 = S.String;
export interface Scte20SourceSettings {
  Convert608To708?: Scte20Convert608To708;
  Source608ChannelNumber?: number;
}
export const Scte20SourceSettings = S.suspend(() =>
  S.Struct({
    Convert608To708: S.optional(Scte20Convert608To708).pipe(
      T.JsonName("convert608To708"),
    ),
    Source608ChannelNumber: S.optional(S.Number).pipe(
      T.JsonName("source608ChannelNumber"),
    ),
  }),
).annotations({
  identifier: "Scte20SourceSettings",
}) as any as S.Schema<Scte20SourceSettings>;
export type Scte27OcrLanguage =
  | "DEU"
  | "ENG"
  | "FRA"
  | "NLD"
  | "POR"
  | "SPA"
  | (string & {});
export const Scte27OcrLanguage = S.String;
export interface Scte27SourceSettings {
  OcrLanguage?: Scte27OcrLanguage;
  Pid?: number;
}
export const Scte27SourceSettings = S.suspend(() =>
  S.Struct({
    OcrLanguage: S.optional(Scte27OcrLanguage).pipe(T.JsonName("ocrLanguage")),
    Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
  }),
).annotations({
  identifier: "Scte27SourceSettings",
}) as any as S.Schema<Scte27SourceSettings>;
export interface CaptionRectangle {
  Height?: number;
  LeftOffset?: number;
  TopOffset?: number;
  Width?: number;
}
export const CaptionRectangle = S.suspend(() =>
  S.Struct({
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    LeftOffset: S.optional(S.Number).pipe(T.JsonName("leftOffset")),
    TopOffset: S.optional(S.Number).pipe(T.JsonName("topOffset")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "CaptionRectangle",
}) as any as S.Schema<CaptionRectangle>;
export interface TeletextSourceSettings {
  OutputRectangle?: CaptionRectangle;
  PageNumber?: string;
}
export const TeletextSourceSettings = S.suspend(() =>
  S.Struct({
    OutputRectangle: S.optional(CaptionRectangle)
      .pipe(T.JsonName("outputRectangle"))
      .annotations({ identifier: "CaptionRectangle" }),
    PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")),
  }),
).annotations({
  identifier: "TeletextSourceSettings",
}) as any as S.Schema<TeletextSourceSettings>;
export interface CaptionSelectorSettings {
  AncillarySourceSettings?: AncillarySourceSettings;
  AribSourceSettings?: AribSourceSettings;
  DvbSubSourceSettings?: DvbSubSourceSettings;
  EmbeddedSourceSettings?: EmbeddedSourceSettings;
  Scte20SourceSettings?: Scte20SourceSettings;
  Scte27SourceSettings?: Scte27SourceSettings;
  TeletextSourceSettings?: TeletextSourceSettings;
}
export const CaptionSelectorSettings = S.suspend(() =>
  S.Struct({
    AncillarySourceSettings: S.optional(AncillarySourceSettings)
      .pipe(T.JsonName("ancillarySourceSettings"))
      .annotations({ identifier: "AncillarySourceSettings" }),
    AribSourceSettings: S.optional(AribSourceSettings)
      .pipe(T.JsonName("aribSourceSettings"))
      .annotations({ identifier: "AribSourceSettings" }),
    DvbSubSourceSettings: S.optional(DvbSubSourceSettings)
      .pipe(T.JsonName("dvbSubSourceSettings"))
      .annotations({ identifier: "DvbSubSourceSettings" }),
    EmbeddedSourceSettings: S.optional(EmbeddedSourceSettings)
      .pipe(T.JsonName("embeddedSourceSettings"))
      .annotations({ identifier: "EmbeddedSourceSettings" }),
    Scte20SourceSettings: S.optional(Scte20SourceSettings)
      .pipe(T.JsonName("scte20SourceSettings"))
      .annotations({ identifier: "Scte20SourceSettings" }),
    Scte27SourceSettings: S.optional(Scte27SourceSettings)
      .pipe(T.JsonName("scte27SourceSettings"))
      .annotations({ identifier: "Scte27SourceSettings" }),
    TeletextSourceSettings: S.optional(TeletextSourceSettings)
      .pipe(T.JsonName("teletextSourceSettings"))
      .annotations({ identifier: "TeletextSourceSettings" }),
  }),
).annotations({
  identifier: "CaptionSelectorSettings",
}) as any as S.Schema<CaptionSelectorSettings>;
export interface CaptionSelector {
  LanguageCode?: string;
  Name?: string;
  SelectorSettings?: CaptionSelectorSettings;
}
export const CaptionSelector = S.suspend(() =>
  S.Struct({
    LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SelectorSettings: S.optional(CaptionSelectorSettings)
      .pipe(T.JsonName("selectorSettings"))
      .annotations({ identifier: "CaptionSelectorSettings" }),
  }),
).annotations({
  identifier: "CaptionSelector",
}) as any as S.Schema<CaptionSelector>;
export type __listOfCaptionSelector = CaptionSelector[];
export const __listOfCaptionSelector = S.Array(CaptionSelector);
export type HlsScte35SourceType = "MANIFEST" | "SEGMENTS" | (string & {});
export const HlsScte35SourceType = S.String;
export interface HlsInputSettings {
  Bandwidth?: number;
  BufferSegments?: number;
  Retries?: number;
  RetryInterval?: number;
  Scte35Source?: HlsScte35SourceType;
}
export const HlsInputSettings = S.suspend(() =>
  S.Struct({
    Bandwidth: S.optional(S.Number).pipe(T.JsonName("bandwidth")),
    BufferSegments: S.optional(S.Number).pipe(T.JsonName("bufferSegments")),
    Retries: S.optional(S.Number).pipe(T.JsonName("retries")),
    RetryInterval: S.optional(S.Number).pipe(T.JsonName("retryInterval")),
    Scte35Source: S.optional(HlsScte35SourceType).pipe(
      T.JsonName("scte35Source"),
    ),
  }),
).annotations({
  identifier: "HlsInputSettings",
}) as any as S.Schema<HlsInputSettings>;
export type NetworkInputServerValidation =
  | "CHECK_CRYPTOGRAPHY_AND_VALIDATE_NAME"
  | "CHECK_CRYPTOGRAPHY_ONLY"
  | (string & {});
export const NetworkInputServerValidation = S.String;
export interface MulticastInputSettings {
  SourceIpAddress?: string;
}
export const MulticastInputSettings = S.suspend(() =>
  S.Struct({
    SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
  }),
).annotations({
  identifier: "MulticastInputSettings",
}) as any as S.Schema<MulticastInputSettings>;
export interface NetworkInputSettings {
  HlsInputSettings?: HlsInputSettings;
  ServerValidation?: NetworkInputServerValidation;
  MulticastInputSettings?: MulticastInputSettings;
}
export const NetworkInputSettings = S.suspend(() =>
  S.Struct({
    HlsInputSettings: S.optional(HlsInputSettings)
      .pipe(T.JsonName("hlsInputSettings"))
      .annotations({ identifier: "HlsInputSettings" }),
    ServerValidation: S.optional(NetworkInputServerValidation).pipe(
      T.JsonName("serverValidation"),
    ),
    MulticastInputSettings: S.optional(MulticastInputSettings)
      .pipe(T.JsonName("multicastInputSettings"))
      .annotations({ identifier: "MulticastInputSettings" }),
  }),
).annotations({
  identifier: "NetworkInputSettings",
}) as any as S.Schema<NetworkInputSettings>;
export type VideoSelectorColorSpace =
  | "FOLLOW"
  | "HDR10"
  | "HLG_2020"
  | "REC_601"
  | "REC_709"
  | (string & {});
export const VideoSelectorColorSpace = S.String;
export interface VideoSelectorColorSpaceSettings {
  Hdr10Settings?: Hdr10Settings;
}
export const VideoSelectorColorSpaceSettings = S.suspend(() =>
  S.Struct({
    Hdr10Settings: S.optional(Hdr10Settings)
      .pipe(T.JsonName("hdr10Settings"))
      .annotations({ identifier: "Hdr10Settings" }),
  }),
).annotations({
  identifier: "VideoSelectorColorSpaceSettings",
}) as any as S.Schema<VideoSelectorColorSpaceSettings>;
export type VideoSelectorColorSpaceUsage = "FALLBACK" | "FORCE" | (string & {});
export const VideoSelectorColorSpaceUsage = S.String;
export interface VideoSelectorPid {
  Pid?: number;
}
export const VideoSelectorPid = S.suspend(() =>
  S.Struct({ Pid: S.optional(S.Number).pipe(T.JsonName("pid")) }),
).annotations({
  identifier: "VideoSelectorPid",
}) as any as S.Schema<VideoSelectorPid>;
export interface VideoSelectorProgramId {
  ProgramId?: number;
}
export const VideoSelectorProgramId = S.suspend(() =>
  S.Struct({ ProgramId: S.optional(S.Number).pipe(T.JsonName("programId")) }),
).annotations({
  identifier: "VideoSelectorProgramId",
}) as any as S.Schema<VideoSelectorProgramId>;
export interface VideoSelectorSettings {
  VideoSelectorPid?: VideoSelectorPid;
  VideoSelectorProgramId?: VideoSelectorProgramId;
}
export const VideoSelectorSettings = S.suspend(() =>
  S.Struct({
    VideoSelectorPid: S.optional(VideoSelectorPid)
      .pipe(T.JsonName("videoSelectorPid"))
      .annotations({ identifier: "VideoSelectorPid" }),
    VideoSelectorProgramId: S.optional(VideoSelectorProgramId)
      .pipe(T.JsonName("videoSelectorProgramId"))
      .annotations({ identifier: "VideoSelectorProgramId" }),
  }),
).annotations({
  identifier: "VideoSelectorSettings",
}) as any as S.Schema<VideoSelectorSettings>;
export interface VideoSelector {
  ColorSpace?: VideoSelectorColorSpace;
  ColorSpaceSettings?: VideoSelectorColorSpaceSettings;
  ColorSpaceUsage?: VideoSelectorColorSpaceUsage;
  SelectorSettings?: VideoSelectorSettings;
}
export const VideoSelector = S.suspend(() =>
  S.Struct({
    ColorSpace: S.optional(VideoSelectorColorSpace).pipe(
      T.JsonName("colorSpace"),
    ),
    ColorSpaceSettings: S.optional(VideoSelectorColorSpaceSettings)
      .pipe(T.JsonName("colorSpaceSettings"))
      .annotations({ identifier: "VideoSelectorColorSpaceSettings" }),
    ColorSpaceUsage: S.optional(VideoSelectorColorSpaceUsage).pipe(
      T.JsonName("colorSpaceUsage"),
    ),
    SelectorSettings: S.optional(VideoSelectorSettings)
      .pipe(T.JsonName("selectorSettings"))
      .annotations({ identifier: "VideoSelectorSettings" }),
  }),
).annotations({
  identifier: "VideoSelector",
}) as any as S.Schema<VideoSelector>;
export interface InputSettings {
  AudioSelectors?: AudioSelector[];
  CaptionSelectors?: CaptionSelector[];
  DeblockFilter?: InputDeblockFilter;
  DenoiseFilter?: InputDenoiseFilter;
  FilterStrength?: number;
  InputFilter?: InputFilter;
  NetworkInputSettings?: NetworkInputSettings;
  Scte35Pid?: number;
  Smpte2038DataPreference?: Smpte2038DataPreference;
  SourceEndBehavior?: InputSourceEndBehavior;
  VideoSelector?: VideoSelector;
}
export const InputSettings = S.suspend(() =>
  S.Struct({
    AudioSelectors: S.optional(__listOfAudioSelector).pipe(
      T.JsonName("audioSelectors"),
    ),
    CaptionSelectors: S.optional(__listOfCaptionSelector).pipe(
      T.JsonName("captionSelectors"),
    ),
    DeblockFilter: S.optional(InputDeblockFilter).pipe(
      T.JsonName("deblockFilter"),
    ),
    DenoiseFilter: S.optional(InputDenoiseFilter).pipe(
      T.JsonName("denoiseFilter"),
    ),
    FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
    InputFilter: S.optional(InputFilter).pipe(T.JsonName("inputFilter")),
    NetworkInputSettings: S.optional(NetworkInputSettings)
      .pipe(T.JsonName("networkInputSettings"))
      .annotations({ identifier: "NetworkInputSettings" }),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    Smpte2038DataPreference: S.optional(Smpte2038DataPreference).pipe(
      T.JsonName("smpte2038DataPreference"),
    ),
    SourceEndBehavior: S.optional(InputSourceEndBehavior).pipe(
      T.JsonName("sourceEndBehavior"),
    ),
    VideoSelector: S.optional(VideoSelector)
      .pipe(T.JsonName("videoSelector"))
      .annotations({ identifier: "VideoSelector" }),
  }),
).annotations({
  identifier: "InputSettings",
}) as any as S.Schema<InputSettings>;
export interface InputAttachment {
  AutomaticInputFailoverSettings?: AutomaticInputFailoverSettings;
  InputAttachmentName?: string;
  InputId?: string;
  InputSettings?: InputSettings;
  LogicalInterfaceNames?: string[];
}
export const InputAttachment = S.suspend(() =>
  S.Struct({
    AutomaticInputFailoverSettings: S.optional(AutomaticInputFailoverSettings)
      .pipe(T.JsonName("automaticInputFailoverSettings"))
      .annotations({ identifier: "AutomaticInputFailoverSettings" }),
    InputAttachmentName: S.optional(S.String).pipe(
      T.JsonName("inputAttachmentName"),
    ),
    InputId: S.optional(S.String).pipe(T.JsonName("inputId")),
    InputSettings: S.optional(InputSettings)
      .pipe(T.JsonName("inputSettings"))
      .annotations({ identifier: "InputSettings" }),
    LogicalInterfaceNames: S.optional(__listOf__string).pipe(
      T.JsonName("logicalInterfaceNames"),
    ),
  }),
).annotations({
  identifier: "InputAttachment",
}) as any as S.Schema<InputAttachment>;
export type __listOfInputAttachment = InputAttachment[];
export const __listOfInputAttachment = S.Array(InputAttachment);
export interface MaintenanceStatus {
  MaintenanceDay?: MaintenanceDay;
  MaintenanceDeadline?: string;
  MaintenanceScheduledDate?: string;
  MaintenanceStartTime?: string;
}
export const MaintenanceStatus = S.suspend(() =>
  S.Struct({
    MaintenanceDay: S.optional(MaintenanceDay).pipe(
      T.JsonName("maintenanceDay"),
    ),
    MaintenanceDeadline: S.optional(S.String).pipe(
      T.JsonName("maintenanceDeadline"),
    ),
    MaintenanceScheduledDate: S.optional(S.String).pipe(
      T.JsonName("maintenanceScheduledDate"),
    ),
    MaintenanceStartTime: S.optional(S.String).pipe(
      T.JsonName("maintenanceStartTime"),
    ),
  }),
).annotations({
  identifier: "MaintenanceStatus",
}) as any as S.Schema<MaintenanceStatus>;
export interface PipelineDetail {
  ActiveInputAttachmentName?: string;
  ActiveInputSwitchActionName?: string;
  ActiveMotionGraphicsActionName?: string;
  ActiveMotionGraphicsUri?: string;
  PipelineId?: string;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
}
export const PipelineDetail = S.suspend(() =>
  S.Struct({
    ActiveInputAttachmentName: S.optional(S.String).pipe(
      T.JsonName("activeInputAttachmentName"),
    ),
    ActiveInputSwitchActionName: S.optional(S.String).pipe(
      T.JsonName("activeInputSwitchActionName"),
    ),
    ActiveMotionGraphicsActionName: S.optional(S.String).pipe(
      T.JsonName("activeMotionGraphicsActionName"),
    ),
    ActiveMotionGraphicsUri: S.optional(S.String).pipe(
      T.JsonName("activeMotionGraphicsUri"),
    ),
    PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
  }),
).annotations({
  identifier: "PipelineDetail",
}) as any as S.Schema<PipelineDetail>;
export type __listOfPipelineDetail = PipelineDetail[];
export const __listOfPipelineDetail = S.Array(PipelineDetail);
export interface VpcOutputSettingsDescription {
  AvailabilityZones?: string[];
  NetworkInterfaceIds?: string[];
  SecurityGroupIds?: string[];
  SubnetIds?: string[];
}
export const VpcOutputSettingsDescription = S.suspend(() =>
  S.Struct({
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    NetworkInterfaceIds: S.optional(__listOf__string).pipe(
      T.JsonName("networkInterfaceIds"),
    ),
    SecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroupIds"),
    ),
    SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
  }),
).annotations({
  identifier: "VpcOutputSettingsDescription",
}) as any as S.Schema<VpcOutputSettingsDescription>;
export interface DescribeAnywhereSettings {
  ChannelPlacementGroupId?: string;
  ClusterId?: string;
}
export const DescribeAnywhereSettings = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroupId: S.optional(S.String).pipe(
      T.JsonName("channelPlacementGroupId"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  }),
).annotations({
  identifier: "DescribeAnywhereSettings",
}) as any as S.Schema<DescribeAnywhereSettings>;
export interface DescribeFollowerChannelSettings {
  LinkedChannelType?: LinkedChannelType;
  PrimaryChannelArn?: string;
}
export const DescribeFollowerChannelSettings = S.suspend(() =>
  S.Struct({
    LinkedChannelType: S.optional(LinkedChannelType).pipe(
      T.JsonName("linkedChannelType"),
    ),
    PrimaryChannelArn: S.optional(S.String).pipe(
      T.JsonName("primaryChannelArn"),
    ),
  }),
).annotations({
  identifier: "DescribeFollowerChannelSettings",
}) as any as S.Schema<DescribeFollowerChannelSettings>;
export interface DescribePrimaryChannelSettings {
  FollowingChannelArns?: string[];
  LinkedChannelType?: LinkedChannelType;
}
export const DescribePrimaryChannelSettings = S.suspend(() =>
  S.Struct({
    FollowingChannelArns: S.optional(__listOf__string).pipe(
      T.JsonName("followingChannelArns"),
    ),
    LinkedChannelType: S.optional(LinkedChannelType).pipe(
      T.JsonName("linkedChannelType"),
    ),
  }),
).annotations({
  identifier: "DescribePrimaryChannelSettings",
}) as any as S.Schema<DescribePrimaryChannelSettings>;
export interface DescribeLinkedChannelSettings {
  FollowerChannelSettings?: DescribeFollowerChannelSettings;
  PrimaryChannelSettings?: DescribePrimaryChannelSettings;
}
export const DescribeLinkedChannelSettings = S.suspend(() =>
  S.Struct({
    FollowerChannelSettings: S.optional(DescribeFollowerChannelSettings)
      .pipe(T.JsonName("followerChannelSettings"))
      .annotations({ identifier: "DescribeFollowerChannelSettings" }),
    PrimaryChannelSettings: S.optional(DescribePrimaryChannelSettings)
      .pipe(T.JsonName("primaryChannelSettings"))
      .annotations({ identifier: "DescribePrimaryChannelSettings" }),
  }),
).annotations({
  identifier: "DescribeLinkedChannelSettings",
}) as any as S.Schema<DescribeLinkedChannelSettings>;
export interface DescribeChannelResponse {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings & {
    AudioDescriptions: (AudioDescription & {
      AudioSelectorName: string;
      Name: __stringMax255;
      AudioWatermarkingSettings: AudioWatermarkSettings & {
        NielsenWatermarksSettings: NielsenWatermarksSettings & {
          NielsenCbetSettings: NielsenCBET & {
            CbetCheckDigitString: __stringMin2Max2;
            CbetStepaside: NielsenWatermarksCbetStepaside;
            Csid: __stringMin1Max7;
          };
          NielsenNaesIiNwSettings: NielsenNaesIiNw & {
            CheckDigitString: __stringMin2Max2;
            Sid: __doubleMin1Max65535;
          };
        };
      };
      RemixSettings: RemixSettings & {
        ChannelMappings: (AudioChannelMapping & {
          InputChannelLevels: (InputChannelLevel & {
            Gain: __integerMinNegative60Max6;
            InputChannel: __integerMin0Max15;
          })[];
          OutputChannel: __integerMin0Max7;
        })[];
      };
    })[];
    OutputGroups: (OutputGroup & {
      OutputGroupSettings: OutputGroupSettings & {
        ArchiveGroupSettings: ArchiveGroupSettings & {
          Destination: OutputLocationRef;
        };
        FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
          Destination: OutputLocationRef;
        };
        HlsGroupSettings: HlsGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
            LanguageDescription: __stringMin1;
          })[];
          KeyProviderSettings: KeyProviderSettings & {
            StaticKeySettings: StaticKeySettings & {
              StaticKeyValue: __stringMin32Max32;
              KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
            };
          };
        };
        MediaPackageGroupSettings: MediaPackageGroupSettings & {
          Destination: OutputLocationRef;
          MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            AdditionalDestinations: (MediaPackageAdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        MsSmoothGroupSettings: MsSmoothGroupSettings & {
          Destination: OutputLocationRef;
        };
        CmafIngestGroupSettings: CmafIngestGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
          })[];
          AdditionalDestinations: (AdditionalDestinations & {
            Destination: OutputLocationRef;
          })[];
        };
      };
      Outputs: (Output & {
        OutputSettings: OutputSettings & {
          ArchiveOutputSettings: ArchiveOutputSettings & {
            ContainerSettings: ArchiveContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
          };
          HlsOutputSettings: HlsOutputSettings & {
            HlsSettings: HlsSettings & {
              AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
              };
              StandardHlsSettings: StandardHlsSettings & {
                M3u8Settings: M3u8Settings;
              };
            };
          };
          MultiplexOutputSettings: MultiplexOutputSettings & {
            Destination: OutputLocationRef;
          };
          RtmpOutputSettings: RtmpOutputSettings & {
            Destination: OutputLocationRef;
          };
          UdpOutputSettings: UdpOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
          SrtOutputSettings: SrtOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
        };
      })[];
    })[];
    TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
    VideoDescriptions: (VideoDescription & {
      Name: string;
      CodecSettings: VideoCodecSettings & {
        FrameCaptureSettings: FrameCaptureSettings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H264Settings: H264Settings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H265Settings: H265Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Mpeg2Settings: Mpeg2Settings & {
          FramerateDenominator: __integerMin1;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Av1Settings: Av1Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
      };
    })[];
    AvailBlanking: AvailBlanking & {
      AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
    };
    AvailConfiguration: AvailConfiguration & {
      AvailSettings: AvailSettings & {
        Esam: Esam & {
          AcquisitionPointId: __stringMax256;
          PoisEndpoint: __stringMax2048;
        };
      };
    };
    BlackoutSlate: BlackoutSlate & {
      BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
      NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
    };
    CaptionDescriptions: (CaptionDescription & {
      CaptionSelectorName: string;
      Name: string;
      DestinationSettings: CaptionDestinationSettings & {
        BurnInDestinationSettings: BurnInDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
        DvbSubDestinationSettings: DvbSubDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
      };
    })[];
    GlobalConfiguration: GlobalConfiguration & {
      InputLossBehavior: InputLossBehavior & {
        InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
      };
    };
    MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
      MotionGraphicsSettings: MotionGraphicsSettings;
    };
    ThumbnailConfiguration: ThumbnailConfiguration & { State: ThumbnailState };
    ColorCorrectionSettings: ColorCorrectionSettings & {
      GlobalColorCorrections: (ColorCorrection & {
        InputColorSpace: ColorSpace;
        OutputColorSpace: ColorSpace;
        Uri: string;
      })[];
    };
  };
  Id?: string;
  InputAttachments?: (InputAttachment & {
    AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
      SecondaryInputId: string;
      FailoverConditions: (FailoverCondition & {
        FailoverConditionSettings: FailoverConditionSettings & {
          AudioSilenceSettings: AudioSilenceFailoverSettings & {
            AudioSelectorName: string;
          };
        };
      })[];
    };
    InputSettings: InputSettings & {
      AudioSelectors: (AudioSelector & {
        Name: __stringMin1;
        SelectorSettings: AudioSelectorSettings & {
          AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
            GroupId: __stringMin1;
            Name: __stringMin1;
          };
          AudioLanguageSelection: AudioLanguageSelection & {
            LanguageCode: string;
          };
          AudioPidSelection: AudioPidSelection & { Pid: __integerMin0Max8191 };
          AudioTrackSelection: AudioTrackSelection & {
            Tracks: (AudioTrack & { Track: __integerMin1 })[];
            DolbyEDecode: AudioDolbyEDecode & {
              ProgramSelection: DolbyEProgramSelection;
            };
          };
        };
      })[];
      CaptionSelectors: (CaptionSelector & {
        Name: __stringMin1;
        SelectorSettings: CaptionSelectorSettings & {
          TeletextSourceSettings: TeletextSourceSettings & {
            OutputRectangle: CaptionRectangle & {
              Height: __doubleMin0Max100;
              LeftOffset: __doubleMin0Max100;
              TopOffset: __doubleMin0Max100;
              Width: __doubleMin0Max100;
            };
          };
        };
      })[];
    };
  })[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const DescribeChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "DescribeChannelResponse",
}) as any as S.Schema<DescribeChannelResponse>;
export interface DescribeChannelPlacementGroupResponse {
  Arn?: string;
  Channels?: string[];
  ClusterId?: string;
  Id?: string;
  Name?: string;
  Nodes?: string[];
  State?: ChannelPlacementGroupState;
}
export const DescribeChannelPlacementGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    State: S.optional(ChannelPlacementGroupState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeChannelPlacementGroupResponse",
}) as any as S.Schema<DescribeChannelPlacementGroupResponse>;
export interface InterfaceMapping {
  LogicalInterfaceName?: string;
  NetworkId?: string;
}
export const InterfaceMapping = S.suspend(() =>
  S.Struct({
    LogicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("logicalInterfaceName"),
    ),
    NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
  }),
).annotations({
  identifier: "InterfaceMapping",
}) as any as S.Schema<InterfaceMapping>;
export type __listOfInterfaceMapping = InterfaceMapping[];
export const __listOfInterfaceMapping = S.Array(InterfaceMapping);
export interface ClusterNetworkSettings {
  DefaultRoute?: string;
  InterfaceMappings?: InterfaceMapping[];
}
export const ClusterNetworkSettings = S.suspend(() =>
  S.Struct({
    DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
    InterfaceMappings: S.optional(__listOfInterfaceMapping).pipe(
      T.JsonName("interfaceMappings"),
    ),
  }),
).annotations({
  identifier: "ClusterNetworkSettings",
}) as any as S.Schema<ClusterNetworkSettings>;
export interface DescribeClusterResponse {
  Arn?: string;
  ChannelIds?: string[];
  ClusterType?: ClusterType;
  Id?: string;
  InstanceRoleArn?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettings;
  State?: ClusterState;
}
export const DescribeClusterResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettings" }),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeClusterResponse",
}) as any as S.Schema<DescribeClusterResponse>;
export interface DescribeInputDeviceThumbnailResponse {
  Body?: T.StreamingOutputBody;
  ContentType?: ContentType;
  ContentLength?: number;
  ETag?: string;
  LastModified?: Date;
}
export const DescribeInputDeviceThumbnailResponse = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingOutput).pipe(
      T.HttpPayload(),
      T.JsonName("body"),
    ),
    ContentType: S.optional(ContentType).pipe(T.HttpHeader("Content-Type")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
  }),
).annotations({
  identifier: "DescribeInputDeviceThumbnailResponse",
}) as any as S.Schema<DescribeInputDeviceThumbnailResponse>;
export interface MultiplexMediaConnectOutputDestinationSettings {
  EntitlementArn?: string;
}
export const MultiplexMediaConnectOutputDestinationSettings = S.suspend(() =>
  S.Struct({
    EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
  }),
).annotations({
  identifier: "MultiplexMediaConnectOutputDestinationSettings",
}) as any as S.Schema<MultiplexMediaConnectOutputDestinationSettings>;
export interface MultiplexOutputDestination {
  MediaConnectSettings?: MultiplexMediaConnectOutputDestinationSettings;
}
export const MultiplexOutputDestination = S.suspend(() =>
  S.Struct({
    MediaConnectSettings: S.optional(
      MultiplexMediaConnectOutputDestinationSettings,
    )
      .pipe(T.JsonName("mediaConnectSettings"))
      .annotations({
        identifier: "MultiplexMediaConnectOutputDestinationSettings",
      }),
  }),
).annotations({
  identifier: "MultiplexOutputDestination",
}) as any as S.Schema<MultiplexOutputDestination>;
export type __listOfMultiplexOutputDestination = MultiplexOutputDestination[];
export const __listOfMultiplexOutputDestination = S.Array(
  MultiplexOutputDestination,
);
export interface DescribeMultiplexResponse {
  Arn?: string;
  AvailabilityZones?: string[];
  Destinations?: MultiplexOutputDestination[];
  Id?: string;
  MultiplexSettings?: MultiplexSettings & {
    TransportStreamBitrate: __integerMin1000000Max100000000;
    TransportStreamId: __integerMin0Max65535;
  };
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeMultiplexResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DescribeMultiplexResponse",
}) as any as S.Schema<DescribeMultiplexResponse>;
export interface MultiplexProgramPacketIdentifiersMap {
  AudioPids?: number[];
  DvbSubPids?: number[];
  DvbTeletextPid?: number;
  EtvPlatformPid?: number;
  EtvSignalPid?: number;
  KlvDataPids?: number[];
  PcrPid?: number;
  PmtPid?: number;
  PrivateMetadataPid?: number;
  Scte27Pids?: number[];
  Scte35Pid?: number;
  TimedMetadataPid?: number;
  VideoPid?: number;
  AribCaptionsPid?: number;
  DvbTeletextPids?: number[];
  EcmPid?: number;
  Smpte2038Pid?: number;
}
export const MultiplexProgramPacketIdentifiersMap = S.suspend(() =>
  S.Struct({
    AudioPids: S.optional(__listOf__integer).pipe(T.JsonName("audioPids")),
    DvbSubPids: S.optional(__listOf__integer).pipe(T.JsonName("dvbSubPids")),
    DvbTeletextPid: S.optional(S.Number).pipe(T.JsonName("dvbTeletextPid")),
    EtvPlatformPid: S.optional(S.Number).pipe(T.JsonName("etvPlatformPid")),
    EtvSignalPid: S.optional(S.Number).pipe(T.JsonName("etvSignalPid")),
    KlvDataPids: S.optional(__listOf__integer).pipe(T.JsonName("klvDataPids")),
    PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
    PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
    PrivateMetadataPid: S.optional(S.Number).pipe(
      T.JsonName("privateMetadataPid"),
    ),
    Scte27Pids: S.optional(__listOf__integer).pipe(T.JsonName("scte27Pids")),
    Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
    TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
    VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
    AribCaptionsPid: S.optional(S.Number).pipe(T.JsonName("aribCaptionsPid")),
    DvbTeletextPids: S.optional(__listOf__integer).pipe(
      T.JsonName("dvbTeletextPids"),
    ),
    EcmPid: S.optional(S.Number).pipe(T.JsonName("ecmPid")),
    Smpte2038Pid: S.optional(S.Number).pipe(T.JsonName("smpte2038Pid")),
  }),
).annotations({
  identifier: "MultiplexProgramPacketIdentifiersMap",
}) as any as S.Schema<MultiplexProgramPacketIdentifiersMap>;
export interface MultiplexProgramPipelineDetail {
  ActiveChannelPipeline?: string;
  PipelineId?: string;
}
export const MultiplexProgramPipelineDetail = S.suspend(() =>
  S.Struct({
    ActiveChannelPipeline: S.optional(S.String).pipe(
      T.JsonName("activeChannelPipeline"),
    ),
    PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
  }),
).annotations({
  identifier: "MultiplexProgramPipelineDetail",
}) as any as S.Schema<MultiplexProgramPipelineDetail>;
export type __listOfMultiplexProgramPipelineDetail =
  MultiplexProgramPipelineDetail[];
export const __listOfMultiplexProgramPipelineDetail = S.Array(
  MultiplexProgramPipelineDetail,
);
export interface DescribeMultiplexProgramResponse {
  ChannelId?: string;
  MultiplexProgramSettings?: MultiplexProgramSettings & {
    ProgramNumber: __integerMin0Max65535;
    ServiceDescriptor: MultiplexProgramServiceDescriptor & {
      ProviderName: __stringMax256;
      ServiceName: __stringMax256;
    };
  };
  PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
  PipelineDetails?: MultiplexProgramPipelineDetail[];
  ProgramName?: string;
}
export const DescribeMultiplexProgramResponse = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings)
      .pipe(T.JsonName("multiplexProgramSettings"))
      .annotations({ identifier: "MultiplexProgramSettings" }),
    PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap)
      .pipe(T.JsonName("packetIdentifiersMap"))
      .annotations({ identifier: "MultiplexProgramPacketIdentifiersMap" }),
    PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  }),
).annotations({
  identifier: "DescribeMultiplexProgramResponse",
}) as any as S.Schema<DescribeMultiplexProgramResponse>;
export interface IpPool {
  Cidr?: string;
}
export const IpPool = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }),
).annotations({ identifier: "IpPool" }) as any as S.Schema<IpPool>;
export type __listOfIpPool = IpPool[];
export const __listOfIpPool = S.Array(IpPool);
export interface Route {
  Cidr?: string;
  Gateway?: string;
}
export const Route = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type __listOfRoute = Route[];
export const __listOfRoute = S.Array(Route);
export interface DescribeNetworkResponse {
  Arn?: string;
  AssociatedClusterIds?: string[];
  Id?: string;
  IpPools?: IpPool[];
  Name?: string;
  Routes?: Route[];
  State?: NetworkState;
}
export const DescribeNetworkResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AssociatedClusterIds: S.optional(__listOf__string).pipe(
      T.JsonName("associatedClusterIds"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
    State: S.optional(NetworkState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeNetworkResponse",
}) as any as S.Schema<DescribeNetworkResponse>;
export interface SdiSourceMapping {
  CardNumber?: number;
  ChannelNumber?: number;
  SdiSource?: string;
}
export const SdiSourceMapping = S.suspend(() =>
  S.Struct({
    CardNumber: S.optional(S.Number).pipe(T.JsonName("cardNumber")),
    ChannelNumber: S.optional(S.Number).pipe(T.JsonName("channelNumber")),
    SdiSource: S.optional(S.String).pipe(T.JsonName("sdiSource")),
  }),
).annotations({
  identifier: "SdiSourceMapping",
}) as any as S.Schema<SdiSourceMapping>;
export type SdiSourceMappings = SdiSourceMapping[];
export const SdiSourceMappings = S.Array(SdiSourceMapping);
export interface DescribeNodeResponse {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const DescribeNodeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "DescribeNodeResponse",
}) as any as S.Schema<DescribeNodeResponse>;
export type ReservationCodec =
  | "MPEG2"
  | "AVC"
  | "HEVC"
  | "AUDIO"
  | "LINK"
  | "AV1"
  | (string & {});
export const ReservationCodec = S.String;
export type ReservationMaximumBitrate =
  | "MAX_10_MBPS"
  | "MAX_20_MBPS"
  | "MAX_50_MBPS"
  | (string & {});
export const ReservationMaximumBitrate = S.String;
export type ReservationMaximumFramerate =
  | "MAX_30_FPS"
  | "MAX_60_FPS"
  | (string & {});
export const ReservationMaximumFramerate = S.String;
export type ReservationResolution = "SD" | "HD" | "FHD" | "UHD" | (string & {});
export const ReservationResolution = S.String;
export type ReservationResourceType =
  | "INPUT"
  | "OUTPUT"
  | "MULTIPLEX"
  | "CHANNEL"
  | (string & {});
export const ReservationResourceType = S.String;
export type ReservationSpecialFeature =
  | "ADVANCED_AUDIO"
  | "AUDIO_NORMALIZATION"
  | "MGHD"
  | "MGUHD"
  | (string & {});
export const ReservationSpecialFeature = S.String;
export type ReservationVideoQuality =
  | "STANDARD"
  | "ENHANCED"
  | "PREMIUM"
  | (string & {});
export const ReservationVideoQuality = S.String;
export interface ReservationResourceSpecification {
  ChannelClass?: ChannelClass;
  Codec?: ReservationCodec;
  MaximumBitrate?: ReservationMaximumBitrate;
  MaximumFramerate?: ReservationMaximumFramerate;
  Resolution?: ReservationResolution;
  ResourceType?: ReservationResourceType;
  SpecialFeature?: ReservationSpecialFeature;
  VideoQuality?: ReservationVideoQuality;
}
export const ReservationResourceSpecification = S.suspend(() =>
  S.Struct({
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Codec: S.optional(ReservationCodec).pipe(T.JsonName("codec")),
    MaximumBitrate: S.optional(ReservationMaximumBitrate).pipe(
      T.JsonName("maximumBitrate"),
    ),
    MaximumFramerate: S.optional(ReservationMaximumFramerate).pipe(
      T.JsonName("maximumFramerate"),
    ),
    Resolution: S.optional(ReservationResolution).pipe(
      T.JsonName("resolution"),
    ),
    ResourceType: S.optional(ReservationResourceType).pipe(
      T.JsonName("resourceType"),
    ),
    SpecialFeature: S.optional(ReservationSpecialFeature).pipe(
      T.JsonName("specialFeature"),
    ),
    VideoQuality: S.optional(ReservationVideoQuality).pipe(
      T.JsonName("videoQuality"),
    ),
  }),
).annotations({
  identifier: "ReservationResourceSpecification",
}) as any as S.Schema<ReservationResourceSpecification>;
export interface DescribeOfferingResponse {
  Arn?: string;
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: OfferingDurationUnits;
  FixedPrice?: number;
  OfferingDescription?: string;
  OfferingId?: string;
  OfferingType?: OfferingType;
  Region?: string;
  ResourceSpecification?: ReservationResourceSpecification;
  UsagePrice?: number;
}
export const DescribeOfferingResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(OfferingDurationUnits).pipe(
      T.JsonName("durationUnits"),
    ),
    FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
    OfferingType: S.optional(OfferingType).pipe(T.JsonName("offeringType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    ResourceSpecification: S.optional(ReservationResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ReservationResourceSpecification" }),
    UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
  }),
).annotations({
  identifier: "DescribeOfferingResponse",
}) as any as S.Schema<DescribeOfferingResponse>;
export interface DescribeReservationResponse {
  Arn?: string;
  Count?: number;
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: OfferingDurationUnits;
  End?: string;
  FixedPrice?: number;
  Name?: string;
  OfferingDescription?: string;
  OfferingId?: string;
  OfferingType?: OfferingType;
  Region?: string;
  RenewalSettings?: RenewalSettings;
  ReservationId?: string;
  ResourceSpecification?: ReservationResourceSpecification;
  Start?: string;
  State?: ReservationState;
  Tags?: { [key: string]: string | undefined };
  UsagePrice?: number;
}
export const DescribeReservationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(OfferingDurationUnits).pipe(
      T.JsonName("durationUnits"),
    ),
    End: S.optional(S.String).pipe(T.JsonName("end")),
    FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
    OfferingType: S.optional(OfferingType).pipe(T.JsonName("offeringType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    RenewalSettings: S.optional(RenewalSettings)
      .pipe(T.JsonName("renewalSettings"))
      .annotations({ identifier: "RenewalSettings" }),
    ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
    ResourceSpecification: S.optional(ReservationResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ReservationResourceSpecification" }),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    State: S.optional(ReservationState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
  }),
).annotations({
  identifier: "DescribeReservationResponse",
}) as any as S.Schema<DescribeReservationResponse>;
export interface HlsId3SegmentTaggingScheduleActionSettings {
  Tag?: string;
  Id3?: string;
}
export const HlsId3SegmentTaggingScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Tag: S.optional(S.String).pipe(T.JsonName("tag")),
    Id3: S.optional(S.String).pipe(T.JsonName("id3")),
  }),
).annotations({
  identifier: "HlsId3SegmentTaggingScheduleActionSettings",
}) as any as S.Schema<HlsId3SegmentTaggingScheduleActionSettings>;
export interface HlsTimedMetadataScheduleActionSettings {
  Id3?: string;
}
export const HlsTimedMetadataScheduleActionSettings = S.suspend(() =>
  S.Struct({ Id3: S.optional(S.String).pipe(T.JsonName("id3")) }),
).annotations({
  identifier: "HlsTimedMetadataScheduleActionSettings",
}) as any as S.Schema<HlsTimedMetadataScheduleActionSettings>;
export type InputTimecodeSource = "ZEROBASED" | "EMBEDDED" | (string & {});
export const InputTimecodeSource = S.String;
export interface StartTimecode {
  Timecode?: string;
}
export const StartTimecode = S.suspend(() =>
  S.Struct({ Timecode: S.optional(S.String).pipe(T.JsonName("timecode")) }),
).annotations({
  identifier: "StartTimecode",
}) as any as S.Schema<StartTimecode>;
export type LastFrameClippingBehavior =
  | "EXCLUDE_LAST_FRAME"
  | "INCLUDE_LAST_FRAME"
  | (string & {});
export const LastFrameClippingBehavior = S.String;
export interface StopTimecode {
  LastFrameClippingBehavior?: LastFrameClippingBehavior;
  Timecode?: string;
}
export const StopTimecode = S.suspend(() =>
  S.Struct({
    LastFrameClippingBehavior: S.optional(LastFrameClippingBehavior).pipe(
      T.JsonName("lastFrameClippingBehavior"),
    ),
    Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
  }),
).annotations({ identifier: "StopTimecode" }) as any as S.Schema<StopTimecode>;
export interface InputClippingSettings {
  InputTimecodeSource?: InputTimecodeSource;
  StartTimecode?: StartTimecode;
  StopTimecode?: StopTimecode;
}
export const InputClippingSettings = S.suspend(() =>
  S.Struct({
    InputTimecodeSource: S.optional(InputTimecodeSource).pipe(
      T.JsonName("inputTimecodeSource"),
    ),
    StartTimecode: S.optional(StartTimecode)
      .pipe(T.JsonName("startTimecode"))
      .annotations({ identifier: "StartTimecode" }),
    StopTimecode: S.optional(StopTimecode)
      .pipe(T.JsonName("stopTimecode"))
      .annotations({ identifier: "StopTimecode" }),
  }),
).annotations({
  identifier: "InputClippingSettings",
}) as any as S.Schema<InputClippingSettings>;
export interface InputPrepareScheduleActionSettings {
  InputAttachmentNameReference?: string;
  InputClippingSettings?: InputClippingSettings;
  UrlPath?: string[];
}
export const InputPrepareScheduleActionSettings = S.suspend(() =>
  S.Struct({
    InputAttachmentNameReference: S.optional(S.String).pipe(
      T.JsonName("inputAttachmentNameReference"),
    ),
    InputClippingSettings: S.optional(InputClippingSettings)
      .pipe(T.JsonName("inputClippingSettings"))
      .annotations({ identifier: "InputClippingSettings" }),
    UrlPath: S.optional(__listOf__string).pipe(T.JsonName("urlPath")),
  }),
).annotations({
  identifier: "InputPrepareScheduleActionSettings",
}) as any as S.Schema<InputPrepareScheduleActionSettings>;
export interface InputSwitchScheduleActionSettings {
  InputAttachmentNameReference?: string;
  InputClippingSettings?: InputClippingSettings;
  UrlPath?: string[];
}
export const InputSwitchScheduleActionSettings = S.suspend(() =>
  S.Struct({
    InputAttachmentNameReference: S.optional(S.String).pipe(
      T.JsonName("inputAttachmentNameReference"),
    ),
    InputClippingSettings: S.optional(InputClippingSettings)
      .pipe(T.JsonName("inputClippingSettings"))
      .annotations({ identifier: "InputClippingSettings" }),
    UrlPath: S.optional(__listOf__string).pipe(T.JsonName("urlPath")),
  }),
).annotations({
  identifier: "InputSwitchScheduleActionSettings",
}) as any as S.Schema<InputSwitchScheduleActionSettings>;
export interface MotionGraphicsActivateScheduleActionSettings {
  Duration?: number;
  PasswordParam?: string;
  Url?: string;
  Username?: string;
}
export const MotionGraphicsActivateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
    Username: S.optional(S.String).pipe(T.JsonName("username")),
  }),
).annotations({
  identifier: "MotionGraphicsActivateScheduleActionSettings",
}) as any as S.Schema<MotionGraphicsActivateScheduleActionSettings>;
export interface MotionGraphicsDeactivateScheduleActionSettings {}
export const MotionGraphicsDeactivateScheduleActionSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "MotionGraphicsDeactivateScheduleActionSettings",
}) as any as S.Schema<MotionGraphicsDeactivateScheduleActionSettings>;
export type PipelineId = "PIPELINE_0" | "PIPELINE_1" | (string & {});
export const PipelineId = S.String;
export interface PipelinePauseStateSettings {
  PipelineId?: PipelineId;
}
export const PipelinePauseStateSettings = S.suspend(() =>
  S.Struct({
    PipelineId: S.optional(PipelineId).pipe(T.JsonName("pipelineId")),
  }),
).annotations({
  identifier: "PipelinePauseStateSettings",
}) as any as S.Schema<PipelinePauseStateSettings>;
export type __listOfPipelinePauseStateSettings = PipelinePauseStateSettings[];
export const __listOfPipelinePauseStateSettings = S.Array(
  PipelinePauseStateSettings,
);
export interface PauseStateScheduleActionSettings {
  Pipelines?: PipelinePauseStateSettings[];
}
export const PauseStateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Pipelines: S.optional(__listOfPipelinePauseStateSettings).pipe(
      T.JsonName("pipelines"),
    ),
  }),
).annotations({
  identifier: "PauseStateScheduleActionSettings",
}) as any as S.Schema<PauseStateScheduleActionSettings>;
export type Scte35InputMode = "FIXED" | "FOLLOW_ACTIVE" | (string & {});
export const Scte35InputMode = S.String;
export interface Scte35InputScheduleActionSettings {
  InputAttachmentNameReference?: string;
  Mode?: Scte35InputMode;
}
export const Scte35InputScheduleActionSettings = S.suspend(() =>
  S.Struct({
    InputAttachmentNameReference: S.optional(S.String).pipe(
      T.JsonName("inputAttachmentNameReference"),
    ),
    Mode: S.optional(Scte35InputMode).pipe(T.JsonName("mode")),
  }),
).annotations({
  identifier: "Scte35InputScheduleActionSettings",
}) as any as S.Schema<Scte35InputScheduleActionSettings>;
export interface Scte35ReturnToNetworkScheduleActionSettings {
  SpliceEventId?: number;
}
export const Scte35ReturnToNetworkScheduleActionSettings = S.suspend(() =>
  S.Struct({
    SpliceEventId: S.optional(S.Number).pipe(T.JsonName("spliceEventId")),
  }),
).annotations({
  identifier: "Scte35ReturnToNetworkScheduleActionSettings",
}) as any as S.Schema<Scte35ReturnToNetworkScheduleActionSettings>;
export interface Scte35SpliceInsertScheduleActionSettings {
  Duration?: number;
  SpliceEventId?: number;
}
export const Scte35SpliceInsertScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    SpliceEventId: S.optional(S.Number).pipe(T.JsonName("spliceEventId")),
  }),
).annotations({
  identifier: "Scte35SpliceInsertScheduleActionSettings",
}) as any as S.Schema<Scte35SpliceInsertScheduleActionSettings>;
export type Scte35ArchiveAllowedFlag =
  | "ARCHIVE_NOT_ALLOWED"
  | "ARCHIVE_ALLOWED"
  | (string & {});
export const Scte35ArchiveAllowedFlag = S.String;
export type Scte35DeviceRestrictions =
  | "NONE"
  | "RESTRICT_GROUP0"
  | "RESTRICT_GROUP1"
  | "RESTRICT_GROUP2"
  | (string & {});
export const Scte35DeviceRestrictions = S.String;
export type Scte35NoRegionalBlackoutFlag =
  | "REGIONAL_BLACKOUT"
  | "NO_REGIONAL_BLACKOUT"
  | (string & {});
export const Scte35NoRegionalBlackoutFlag = S.String;
export type Scte35WebDeliveryAllowedFlag =
  | "WEB_DELIVERY_NOT_ALLOWED"
  | "WEB_DELIVERY_ALLOWED"
  | (string & {});
export const Scte35WebDeliveryAllowedFlag = S.String;
export interface Scte35DeliveryRestrictions {
  ArchiveAllowedFlag?: Scte35ArchiveAllowedFlag;
  DeviceRestrictions?: Scte35DeviceRestrictions;
  NoRegionalBlackoutFlag?: Scte35NoRegionalBlackoutFlag;
  WebDeliveryAllowedFlag?: Scte35WebDeliveryAllowedFlag;
}
export const Scte35DeliveryRestrictions = S.suspend(() =>
  S.Struct({
    ArchiveAllowedFlag: S.optional(Scte35ArchiveAllowedFlag).pipe(
      T.JsonName("archiveAllowedFlag"),
    ),
    DeviceRestrictions: S.optional(Scte35DeviceRestrictions).pipe(
      T.JsonName("deviceRestrictions"),
    ),
    NoRegionalBlackoutFlag: S.optional(Scte35NoRegionalBlackoutFlag).pipe(
      T.JsonName("noRegionalBlackoutFlag"),
    ),
    WebDeliveryAllowedFlag: S.optional(Scte35WebDeliveryAllowedFlag).pipe(
      T.JsonName("webDeliveryAllowedFlag"),
    ),
  }),
).annotations({
  identifier: "Scte35DeliveryRestrictions",
}) as any as S.Schema<Scte35DeliveryRestrictions>;
export type Scte35SegmentationCancelIndicator =
  | "SEGMENTATION_EVENT_NOT_CANCELED"
  | "SEGMENTATION_EVENT_CANCELED"
  | (string & {});
export const Scte35SegmentationCancelIndicator = S.String;
export interface Scte35SegmentationDescriptor {
  DeliveryRestrictions?: Scte35DeliveryRestrictions;
  SegmentNum?: number;
  SegmentationCancelIndicator?: Scte35SegmentationCancelIndicator;
  SegmentationDuration?: number;
  SegmentationEventId?: number;
  SegmentationTypeId?: number;
  SegmentationUpid?: string;
  SegmentationUpidType?: number;
  SegmentsExpected?: number;
  SubSegmentNum?: number;
  SubSegmentsExpected?: number;
}
export const Scte35SegmentationDescriptor = S.suspend(() =>
  S.Struct({
    DeliveryRestrictions: S.optional(Scte35DeliveryRestrictions)
      .pipe(T.JsonName("deliveryRestrictions"))
      .annotations({ identifier: "Scte35DeliveryRestrictions" }),
    SegmentNum: S.optional(S.Number).pipe(T.JsonName("segmentNum")),
    SegmentationCancelIndicator: S.optional(
      Scte35SegmentationCancelIndicator,
    ).pipe(T.JsonName("segmentationCancelIndicator")),
    SegmentationDuration: S.optional(S.Number).pipe(
      T.JsonName("segmentationDuration"),
    ),
    SegmentationEventId: S.optional(S.Number).pipe(
      T.JsonName("segmentationEventId"),
    ),
    SegmentationTypeId: S.optional(S.Number).pipe(
      T.JsonName("segmentationTypeId"),
    ),
    SegmentationUpid: S.optional(S.String).pipe(T.JsonName("segmentationUpid")),
    SegmentationUpidType: S.optional(S.Number).pipe(
      T.JsonName("segmentationUpidType"),
    ),
    SegmentsExpected: S.optional(S.Number).pipe(T.JsonName("segmentsExpected")),
    SubSegmentNum: S.optional(S.Number).pipe(T.JsonName("subSegmentNum")),
    SubSegmentsExpected: S.optional(S.Number).pipe(
      T.JsonName("subSegmentsExpected"),
    ),
  }),
).annotations({
  identifier: "Scte35SegmentationDescriptor",
}) as any as S.Schema<Scte35SegmentationDescriptor>;
export interface Scte35DescriptorSettings {
  SegmentationDescriptorScte35DescriptorSettings?: Scte35SegmentationDescriptor;
}
export const Scte35DescriptorSettings = S.suspend(() =>
  S.Struct({
    SegmentationDescriptorScte35DescriptorSettings: S.optional(
      Scte35SegmentationDescriptor,
    )
      .pipe(T.JsonName("segmentationDescriptorScte35DescriptorSettings"))
      .annotations({ identifier: "Scte35SegmentationDescriptor" }),
  }),
).annotations({
  identifier: "Scte35DescriptorSettings",
}) as any as S.Schema<Scte35DescriptorSettings>;
export interface Scte35Descriptor {
  Scte35DescriptorSettings?: Scte35DescriptorSettings;
}
export const Scte35Descriptor = S.suspend(() =>
  S.Struct({
    Scte35DescriptorSettings: S.optional(Scte35DescriptorSettings)
      .pipe(T.JsonName("scte35DescriptorSettings"))
      .annotations({ identifier: "Scte35DescriptorSettings" }),
  }),
).annotations({
  identifier: "Scte35Descriptor",
}) as any as S.Schema<Scte35Descriptor>;
export type __listOfScte35Descriptor = Scte35Descriptor[];
export const __listOfScte35Descriptor = S.Array(Scte35Descriptor);
export interface Scte35TimeSignalScheduleActionSettings {
  Scte35Descriptors?: Scte35Descriptor[];
}
export const Scte35TimeSignalScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Scte35Descriptors: S.optional(__listOfScte35Descriptor).pipe(
      T.JsonName("scte35Descriptors"),
    ),
  }),
).annotations({
  identifier: "Scte35TimeSignalScheduleActionSettings",
}) as any as S.Schema<Scte35TimeSignalScheduleActionSettings>;
export interface StaticImageActivateScheduleActionSettings {
  Duration?: number;
  FadeIn?: number;
  FadeOut?: number;
  Height?: number;
  Image?: InputLocation;
  ImageX?: number;
  ImageY?: number;
  Layer?: number;
  Opacity?: number;
  Width?: number;
}
export const StaticImageActivateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    FadeIn: S.optional(S.Number).pipe(T.JsonName("fadeIn")),
    FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Image: S.optional(InputLocation)
      .pipe(T.JsonName("image"))
      .annotations({ identifier: "InputLocation" }),
    ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
    ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
    Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
    Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "StaticImageActivateScheduleActionSettings",
}) as any as S.Schema<StaticImageActivateScheduleActionSettings>;
export interface StaticImageDeactivateScheduleActionSettings {
  FadeOut?: number;
  Layer?: number;
}
export const StaticImageDeactivateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
    Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
  }),
).annotations({
  identifier: "StaticImageDeactivateScheduleActionSettings",
}) as any as S.Schema<StaticImageDeactivateScheduleActionSettings>;
export interface StaticImageOutputActivateScheduleActionSettings {
  Duration?: number;
  FadeIn?: number;
  FadeOut?: number;
  Height?: number;
  Image?: InputLocation;
  ImageX?: number;
  ImageY?: number;
  Layer?: number;
  Opacity?: number;
  OutputNames?: string[];
  Width?: number;
}
export const StaticImageOutputActivateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    FadeIn: S.optional(S.Number).pipe(T.JsonName("fadeIn")),
    FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    Image: S.optional(InputLocation)
      .pipe(T.JsonName("image"))
      .annotations({ identifier: "InputLocation" }),
    ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
    ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
    Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
    Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
    OutputNames: S.optional(__listOf__string).pipe(T.JsonName("outputNames")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
  }),
).annotations({
  identifier: "StaticImageOutputActivateScheduleActionSettings",
}) as any as S.Schema<StaticImageOutputActivateScheduleActionSettings>;
export interface StaticImageOutputDeactivateScheduleActionSettings {
  FadeOut?: number;
  Layer?: number;
  OutputNames?: string[];
}
export const StaticImageOutputDeactivateScheduleActionSettings = S.suspend(() =>
  S.Struct({
    FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
    Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
    OutputNames: S.optional(__listOf__string).pipe(T.JsonName("outputNames")),
  }),
).annotations({
  identifier: "StaticImageOutputDeactivateScheduleActionSettings",
}) as any as S.Schema<StaticImageOutputDeactivateScheduleActionSettings>;
export interface Id3SegmentTaggingScheduleActionSettings {
  Id3?: string;
  Tag?: string;
}
export const Id3SegmentTaggingScheduleActionSettings = S.suspend(() =>
  S.Struct({
    Id3: S.optional(S.String).pipe(T.JsonName("id3")),
    Tag: S.optional(S.String).pipe(T.JsonName("tag")),
  }),
).annotations({
  identifier: "Id3SegmentTaggingScheduleActionSettings",
}) as any as S.Schema<Id3SegmentTaggingScheduleActionSettings>;
export interface TimedMetadataScheduleActionSettings {
  Id3?: string;
}
export const TimedMetadataScheduleActionSettings = S.suspend(() =>
  S.Struct({ Id3: S.optional(S.String).pipe(T.JsonName("id3")) }),
).annotations({
  identifier: "TimedMetadataScheduleActionSettings",
}) as any as S.Schema<TimedMetadataScheduleActionSettings>;
export interface ScheduleActionSettings {
  HlsId3SegmentTaggingSettings?: HlsId3SegmentTaggingScheduleActionSettings;
  HlsTimedMetadataSettings?: HlsTimedMetadataScheduleActionSettings;
  InputPrepareSettings?: InputPrepareScheduleActionSettings;
  InputSwitchSettings?: InputSwitchScheduleActionSettings;
  MotionGraphicsImageActivateSettings?: MotionGraphicsActivateScheduleActionSettings;
  MotionGraphicsImageDeactivateSettings?: MotionGraphicsDeactivateScheduleActionSettings;
  PauseStateSettings?: PauseStateScheduleActionSettings;
  Scte35InputSettings?: Scte35InputScheduleActionSettings;
  Scte35ReturnToNetworkSettings?: Scte35ReturnToNetworkScheduleActionSettings;
  Scte35SpliceInsertSettings?: Scte35SpliceInsertScheduleActionSettings;
  Scte35TimeSignalSettings?: Scte35TimeSignalScheduleActionSettings;
  StaticImageActivateSettings?: StaticImageActivateScheduleActionSettings;
  StaticImageDeactivateSettings?: StaticImageDeactivateScheduleActionSettings;
  StaticImageOutputActivateSettings?: StaticImageOutputActivateScheduleActionSettings;
  StaticImageOutputDeactivateSettings?: StaticImageOutputDeactivateScheduleActionSettings;
  Id3SegmentTaggingSettings?: Id3SegmentTaggingScheduleActionSettings;
  TimedMetadataSettings?: TimedMetadataScheduleActionSettings;
}
export const ScheduleActionSettings = S.suspend(() =>
  S.Struct({
    HlsId3SegmentTaggingSettings: S.optional(
      HlsId3SegmentTaggingScheduleActionSettings,
    )
      .pipe(T.JsonName("hlsId3SegmentTaggingSettings"))
      .annotations({
        identifier: "HlsId3SegmentTaggingScheduleActionSettings",
      }),
    HlsTimedMetadataSettings: S.optional(HlsTimedMetadataScheduleActionSettings)
      .pipe(T.JsonName("hlsTimedMetadataSettings"))
      .annotations({ identifier: "HlsTimedMetadataScheduleActionSettings" }),
    InputPrepareSettings: S.optional(InputPrepareScheduleActionSettings)
      .pipe(T.JsonName("inputPrepareSettings"))
      .annotations({ identifier: "InputPrepareScheduleActionSettings" }),
    InputSwitchSettings: S.optional(InputSwitchScheduleActionSettings)
      .pipe(T.JsonName("inputSwitchSettings"))
      .annotations({ identifier: "InputSwitchScheduleActionSettings" }),
    MotionGraphicsImageActivateSettings: S.optional(
      MotionGraphicsActivateScheduleActionSettings,
    )
      .pipe(T.JsonName("motionGraphicsImageActivateSettings"))
      .annotations({
        identifier: "MotionGraphicsActivateScheduleActionSettings",
      }),
    MotionGraphicsImageDeactivateSettings: S.optional(
      MotionGraphicsDeactivateScheduleActionSettings,
    )
      .pipe(T.JsonName("motionGraphicsImageDeactivateSettings"))
      .annotations({
        identifier: "MotionGraphicsDeactivateScheduleActionSettings",
      }),
    PauseStateSettings: S.optional(PauseStateScheduleActionSettings)
      .pipe(T.JsonName("pauseStateSettings"))
      .annotations({ identifier: "PauseStateScheduleActionSettings" }),
    Scte35InputSettings: S.optional(Scte35InputScheduleActionSettings)
      .pipe(T.JsonName("scte35InputSettings"))
      .annotations({ identifier: "Scte35InputScheduleActionSettings" }),
    Scte35ReturnToNetworkSettings: S.optional(
      Scte35ReturnToNetworkScheduleActionSettings,
    )
      .pipe(T.JsonName("scte35ReturnToNetworkSettings"))
      .annotations({
        identifier: "Scte35ReturnToNetworkScheduleActionSettings",
      }),
    Scte35SpliceInsertSettings: S.optional(
      Scte35SpliceInsertScheduleActionSettings,
    )
      .pipe(T.JsonName("scte35SpliceInsertSettings"))
      .annotations({ identifier: "Scte35SpliceInsertScheduleActionSettings" }),
    Scte35TimeSignalSettings: S.optional(Scte35TimeSignalScheduleActionSettings)
      .pipe(T.JsonName("scte35TimeSignalSettings"))
      .annotations({ identifier: "Scte35TimeSignalScheduleActionSettings" }),
    StaticImageActivateSettings: S.optional(
      StaticImageActivateScheduleActionSettings,
    )
      .pipe(T.JsonName("staticImageActivateSettings"))
      .annotations({ identifier: "StaticImageActivateScheduleActionSettings" }),
    StaticImageDeactivateSettings: S.optional(
      StaticImageDeactivateScheduleActionSettings,
    )
      .pipe(T.JsonName("staticImageDeactivateSettings"))
      .annotations({
        identifier: "StaticImageDeactivateScheduleActionSettings",
      }),
    StaticImageOutputActivateSettings: S.optional(
      StaticImageOutputActivateScheduleActionSettings,
    )
      .pipe(T.JsonName("staticImageOutputActivateSettings"))
      .annotations({
        identifier: "StaticImageOutputActivateScheduleActionSettings",
      }),
    StaticImageOutputDeactivateSettings: S.optional(
      StaticImageOutputDeactivateScheduleActionSettings,
    )
      .pipe(T.JsonName("staticImageOutputDeactivateSettings"))
      .annotations({
        identifier: "StaticImageOutputDeactivateScheduleActionSettings",
      }),
    Id3SegmentTaggingSettings: S.optional(
      Id3SegmentTaggingScheduleActionSettings,
    )
      .pipe(T.JsonName("id3SegmentTaggingSettings"))
      .annotations({ identifier: "Id3SegmentTaggingScheduleActionSettings" }),
    TimedMetadataSettings: S.optional(TimedMetadataScheduleActionSettings)
      .pipe(T.JsonName("timedMetadataSettings"))
      .annotations({ identifier: "TimedMetadataScheduleActionSettings" }),
  }),
).annotations({
  identifier: "ScheduleActionSettings",
}) as any as S.Schema<ScheduleActionSettings>;
export interface FixedModeScheduleActionStartSettings {
  Time?: string;
}
export const FixedModeScheduleActionStartSettings = S.suspend(() =>
  S.Struct({ Time: S.optional(S.String).pipe(T.JsonName("time")) }),
).annotations({
  identifier: "FixedModeScheduleActionStartSettings",
}) as any as S.Schema<FixedModeScheduleActionStartSettings>;
export type FollowPoint = "END" | "START" | (string & {});
export const FollowPoint = S.String;
export interface FollowModeScheduleActionStartSettings {
  FollowPoint?: FollowPoint;
  ReferenceActionName?: string;
}
export const FollowModeScheduleActionStartSettings = S.suspend(() =>
  S.Struct({
    FollowPoint: S.optional(FollowPoint).pipe(T.JsonName("followPoint")),
    ReferenceActionName: S.optional(S.String).pipe(
      T.JsonName("referenceActionName"),
    ),
  }),
).annotations({
  identifier: "FollowModeScheduleActionStartSettings",
}) as any as S.Schema<FollowModeScheduleActionStartSettings>;
export interface ImmediateModeScheduleActionStartSettings {}
export const ImmediateModeScheduleActionStartSettings = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ImmediateModeScheduleActionStartSettings",
}) as any as S.Schema<ImmediateModeScheduleActionStartSettings>;
export interface ScheduleActionStartSettings {
  FixedModeScheduleActionStartSettings?: FixedModeScheduleActionStartSettings;
  FollowModeScheduleActionStartSettings?: FollowModeScheduleActionStartSettings;
  ImmediateModeScheduleActionStartSettings?: ImmediateModeScheduleActionStartSettings;
}
export const ScheduleActionStartSettings = S.suspend(() =>
  S.Struct({
    FixedModeScheduleActionStartSettings: S.optional(
      FixedModeScheduleActionStartSettings,
    )
      .pipe(T.JsonName("fixedModeScheduleActionStartSettings"))
      .annotations({ identifier: "FixedModeScheduleActionStartSettings" }),
    FollowModeScheduleActionStartSettings: S.optional(
      FollowModeScheduleActionStartSettings,
    )
      .pipe(T.JsonName("followModeScheduleActionStartSettings"))
      .annotations({ identifier: "FollowModeScheduleActionStartSettings" }),
    ImmediateModeScheduleActionStartSettings: S.optional(
      ImmediateModeScheduleActionStartSettings,
    )
      .pipe(T.JsonName("immediateModeScheduleActionStartSettings"))
      .annotations({ identifier: "ImmediateModeScheduleActionStartSettings" }),
  }),
).annotations({
  identifier: "ScheduleActionStartSettings",
}) as any as S.Schema<ScheduleActionStartSettings>;
export interface ScheduleAction {
  ActionName?: string;
  ScheduleActionSettings?: ScheduleActionSettings;
  ScheduleActionStartSettings?: ScheduleActionStartSettings;
}
export const ScheduleAction = S.suspend(() =>
  S.Struct({
    ActionName: S.optional(S.String).pipe(T.JsonName("actionName")),
    ScheduleActionSettings: S.optional(ScheduleActionSettings)
      .pipe(T.JsonName("scheduleActionSettings"))
      .annotations({ identifier: "ScheduleActionSettings" }),
    ScheduleActionStartSettings: S.optional(ScheduleActionStartSettings)
      .pipe(T.JsonName("scheduleActionStartSettings"))
      .annotations({ identifier: "ScheduleActionStartSettings" }),
  }),
).annotations({
  identifier: "ScheduleAction",
}) as any as S.Schema<ScheduleAction>;
export type __listOfScheduleAction = ScheduleAction[];
export const __listOfScheduleAction = S.Array(ScheduleAction);
export interface DescribeScheduleResponse {
  NextToken?: string;
  ScheduleActions?: (ScheduleAction & {
    ActionName: string;
    ScheduleActionSettings: ScheduleActionSettings & {
      HlsTimedMetadataSettings: HlsTimedMetadataScheduleActionSettings & {
        Id3: string;
      };
      InputPrepareSettings: InputPrepareScheduleActionSettings & {
        InputClippingSettings: InputClippingSettings & {
          InputTimecodeSource: InputTimecodeSource;
        };
      };
      InputSwitchSettings: InputSwitchScheduleActionSettings & {
        InputAttachmentNameReference: string;
        InputClippingSettings: InputClippingSettings & {
          InputTimecodeSource: InputTimecodeSource;
        };
      };
      PauseStateSettings: PauseStateScheduleActionSettings & {
        Pipelines: (PipelinePauseStateSettings & { PipelineId: PipelineId })[];
      };
      Scte35InputSettings: Scte35InputScheduleActionSettings & {
        Mode: Scte35InputMode;
      };
      Scte35ReturnToNetworkSettings: Scte35ReturnToNetworkScheduleActionSettings & {
        SpliceEventId: __longMin0Max4294967295;
      };
      Scte35SpliceInsertSettings: Scte35SpliceInsertScheduleActionSettings & {
        SpliceEventId: __longMin0Max4294967295;
      };
      Scte35TimeSignalSettings: Scte35TimeSignalScheduleActionSettings & {
        Scte35Descriptors: (Scte35Descriptor & {
          Scte35DescriptorSettings: Scte35DescriptorSettings & {
            SegmentationDescriptorScte35DescriptorSettings: Scte35SegmentationDescriptor & {
              SegmentationCancelIndicator: Scte35SegmentationCancelIndicator;
              SegmentationEventId: __longMin0Max4294967295;
              DeliveryRestrictions: Scte35DeliveryRestrictions & {
                ArchiveAllowedFlag: Scte35ArchiveAllowedFlag;
                DeviceRestrictions: Scte35DeviceRestrictions;
                NoRegionalBlackoutFlag: Scte35NoRegionalBlackoutFlag;
                WebDeliveryAllowedFlag: Scte35WebDeliveryAllowedFlag;
              };
            };
          };
        })[];
      };
      StaticImageActivateSettings: StaticImageActivateScheduleActionSettings & {
        Image: InputLocation & { Uri: __stringMax2048 };
      };
      StaticImageOutputActivateSettings: StaticImageOutputActivateScheduleActionSettings & {
        Image: InputLocation & { Uri: __stringMax2048 };
        OutputNames: __listOf__string;
      };
      StaticImageOutputDeactivateSettings: StaticImageOutputDeactivateScheduleActionSettings & {
        OutputNames: __listOf__string;
      };
      TimedMetadataSettings: TimedMetadataScheduleActionSettings & {
        Id3: string;
      };
    };
    ScheduleActionStartSettings: ScheduleActionStartSettings & {
      FixedModeScheduleActionStartSettings: FixedModeScheduleActionStartSettings & {
        Time: string;
      };
      FollowModeScheduleActionStartSettings: FollowModeScheduleActionStartSettings & {
        FollowPoint: FollowPoint;
        ReferenceActionName: string;
      };
    };
  })[];
}
export const DescribeScheduleResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    ScheduleActions: S.optional(__listOfScheduleAction).pipe(
      T.JsonName("scheduleActions"),
    ),
  }),
).annotations({
  identifier: "DescribeScheduleResponse",
}) as any as S.Schema<DescribeScheduleResponse>;
export interface DescribeSdiSourceResponse {
  SdiSource?: SdiSource;
}
export const DescribeSdiSourceResponse = S.suspend(() =>
  S.Struct({
    SdiSource: S.optional(SdiSource)
      .pipe(T.JsonName("sdiSource"))
      .annotations({ identifier: "SdiSource" }),
  }),
).annotations({
  identifier: "DescribeSdiSourceResponse",
}) as any as S.Schema<DescribeSdiSourceResponse>;
export interface GetCloudWatchAlarmTemplateResponse {
  Arn?: string;
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  CreatedAt?: Date;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupId?: string;
  Id?: string;
  MetricName?: string;
  ModifiedAt?: Date;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  Tags?: { [key: string]: string | undefined };
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
}
export const GetCloudWatchAlarmTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
  }),
).annotations({
  identifier: "GetCloudWatchAlarmTemplateResponse",
}) as any as S.Schema<GetCloudWatchAlarmTemplateResponse>;
export interface GetCloudWatchAlarmTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const GetCloudWatchAlarmTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetCloudWatchAlarmTemplateGroupResponse",
}) as any as S.Schema<GetCloudWatchAlarmTemplateGroupResponse>;
export interface GetEventBridgeRuleTemplateResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  EventTargets?: (EventBridgeRuleTemplateTarget & {
    Arn: __stringMin1Max2048PatternArn;
  })[];
  EventType?: EventBridgeRuleTemplateEventType;
  GroupId?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const GetEventBridgeRuleTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetEventBridgeRuleTemplateResponse",
}) as any as S.Schema<GetEventBridgeRuleTemplateResponse>;
export interface GetEventBridgeRuleTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const GetEventBridgeRuleTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetEventBridgeRuleTemplateGroupResponse",
}) as any as S.Schema<GetEventBridgeRuleTemplateGroupResponse>;
export interface MediaResourceNeighbor {
  Arn?: string;
  Name?: string;
}
export const MediaResourceNeighbor = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "MediaResourceNeighbor",
}) as any as S.Schema<MediaResourceNeighbor>;
export type __listOfMediaResourceNeighbor = MediaResourceNeighbor[];
export const __listOfMediaResourceNeighbor = S.Array(MediaResourceNeighbor);
export interface MediaResource {
  Destinations?: MediaResourceNeighbor[];
  Name?: string;
  Sources?: MediaResourceNeighbor[];
}
export const MediaResource = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(__listOfMediaResourceNeighbor).pipe(
      T.JsonName("destinations"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Sources: S.optional(__listOfMediaResourceNeighbor).pipe(
      T.JsonName("sources"),
    ),
  }),
).annotations({
  identifier: "MediaResource",
}) as any as S.Schema<MediaResource>;
export type FailedMediaResourceMap = {
  [key: string]: MediaResource | undefined;
};
export const FailedMediaResourceMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(MediaResource),
});
export type SignalMapMonitorDeploymentStatus =
  | "NOT_DEPLOYED"
  | "DRY_RUN_DEPLOYMENT_COMPLETE"
  | "DRY_RUN_DEPLOYMENT_FAILED"
  | "DRY_RUN_DEPLOYMENT_IN_PROGRESS"
  | "DEPLOYMENT_COMPLETE"
  | "DEPLOYMENT_FAILED"
  | "DEPLOYMENT_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED"
  | "DELETE_IN_PROGRESS"
  | (string & {});
export const SignalMapMonitorDeploymentStatus = S.String;
export interface SuccessfulMonitorDeployment {
  DetailsUri?: string;
  Status?: SignalMapMonitorDeploymentStatus;
}
export const SuccessfulMonitorDeployment = S.suspend(() =>
  S.Struct({
    DetailsUri: S.optional(S.String).pipe(T.JsonName("detailsUri")),
    Status: S.optional(SignalMapMonitorDeploymentStatus).pipe(
      T.JsonName("status"),
    ),
  }),
).annotations({
  identifier: "SuccessfulMonitorDeployment",
}) as any as S.Schema<SuccessfulMonitorDeployment>;
export type MediaResourceMap = { [key: string]: MediaResource | undefined };
export const MediaResourceMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(MediaResource),
});
export interface MonitorDeployment {
  DetailsUri?: string;
  ErrorMessage?: string;
  Status?: SignalMapMonitorDeploymentStatus;
}
export const MonitorDeployment = S.suspend(() =>
  S.Struct({
    DetailsUri: S.optional(S.String).pipe(T.JsonName("detailsUri")),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    Status: S.optional(SignalMapMonitorDeploymentStatus).pipe(
      T.JsonName("status"),
    ),
  }),
).annotations({
  identifier: "MonitorDeployment",
}) as any as S.Schema<MonitorDeployment>;
export interface GetSignalMapResponse {
  Arn?: string;
  CloudWatchAlarmTemplateGroupIds?: string[];
  CreatedAt?: Date;
  Description?: string;
  DiscoveryEntryPointArn?: string;
  ErrorMessage?: string;
  EventBridgeRuleTemplateGroupIds?: string[];
  FailedMediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  Id?: string;
  LastDiscoveredAt?: Date;
  LastSuccessfulMonitorDeployment?: SuccessfulMonitorDeployment & {
    DetailsUri: __stringMin1Max2048;
    Status: SignalMapMonitorDeploymentStatus;
  };
  MediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  ModifiedAt?: Date;
  MonitorChangesPendingDeployment?: boolean;
  MonitorDeployment?: MonitorDeployment & {
    Status: SignalMapMonitorDeploymentStatus;
  };
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const GetSignalMapResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CloudWatchAlarmTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    EventBridgeRuleTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
    FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
      T.JsonName("failedMediaResourceMap"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LastDiscoveredAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastDiscoveredAt")),
    LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment)
      .pipe(T.JsonName("lastSuccessfulMonitorDeployment"))
      .annotations({ identifier: "SuccessfulMonitorDeployment" }),
    MediaResourceMap: S.optional(MediaResourceMap).pipe(
      T.JsonName("mediaResourceMap"),
    ),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
      T.JsonName("monitorChangesPendingDeployment"),
    ),
    MonitorDeployment: S.optional(MonitorDeployment)
      .pipe(T.JsonName("monitorDeployment"))
      .annotations({ identifier: "MonitorDeployment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetSignalMapResponse",
}) as any as S.Schema<GetSignalMapResponse>;
export interface ListInputsResponse {
  Inputs?: (Input & {
    MulticastSettings: MulticastSettings & {
      Sources: (MulticastSource & { Url: string })[];
    };
  })[];
  NextToken?: string;
}
export const ListInputsResponse = S.suspend(() =>
  S.Struct({
    Inputs: S.optional(__listOfInput).pipe(T.JsonName("inputs")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInputsResponse",
}) as any as S.Schema<ListInputsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListVersionsResponse {
  Versions?: ChannelEngineVersionResponse[];
}
export const ListVersionsResponse = S.suspend(() =>
  S.Struct({
    Versions: S.optional(__listOfChannelEngineVersionResponse).pipe(
      T.JsonName("versions"),
    ),
  }),
).annotations({
  identifier: "ListVersionsResponse",
}) as any as S.Schema<ListVersionsResponse>;
export interface PurchaseOfferingRequest {
  Count?: number;
  Name?: string;
  OfferingId: string;
  RenewalSettings?: RenewalSettings;
  RequestId?: string;
  Start?: string;
  Tags?: { [key: string]: string | undefined };
}
export const PurchaseOfferingRequest = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OfferingId: S.String.pipe(T.HttpLabel("OfferingId")),
    RenewalSettings: S.optional(RenewalSettings)
      .pipe(T.JsonName("renewalSettings"))
      .annotations({ identifier: "RenewalSettings" }),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/offerings/{OfferingId}/purchase" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseOfferingRequest",
}) as any as S.Schema<PurchaseOfferingRequest>;
export interface RestartChannelPipelinesResponse {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings & {
    AudioDescriptions: (AudioDescription & {
      AudioSelectorName: string;
      Name: __stringMax255;
      AudioWatermarkingSettings: AudioWatermarkSettings & {
        NielsenWatermarksSettings: NielsenWatermarksSettings & {
          NielsenCbetSettings: NielsenCBET & {
            CbetCheckDigitString: __stringMin2Max2;
            CbetStepaside: NielsenWatermarksCbetStepaside;
            Csid: __stringMin1Max7;
          };
          NielsenNaesIiNwSettings: NielsenNaesIiNw & {
            CheckDigitString: __stringMin2Max2;
            Sid: __doubleMin1Max65535;
          };
        };
      };
      RemixSettings: RemixSettings & {
        ChannelMappings: (AudioChannelMapping & {
          InputChannelLevels: (InputChannelLevel & {
            Gain: __integerMinNegative60Max6;
            InputChannel: __integerMin0Max15;
          })[];
          OutputChannel: __integerMin0Max7;
        })[];
      };
    })[];
    OutputGroups: (OutputGroup & {
      OutputGroupSettings: OutputGroupSettings & {
        ArchiveGroupSettings: ArchiveGroupSettings & {
          Destination: OutputLocationRef;
        };
        FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
          Destination: OutputLocationRef;
        };
        HlsGroupSettings: HlsGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
            LanguageDescription: __stringMin1;
          })[];
          KeyProviderSettings: KeyProviderSettings & {
            StaticKeySettings: StaticKeySettings & {
              StaticKeyValue: __stringMin32Max32;
              KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
            };
          };
        };
        MediaPackageGroupSettings: MediaPackageGroupSettings & {
          Destination: OutputLocationRef;
          MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            AdditionalDestinations: (MediaPackageAdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        MsSmoothGroupSettings: MsSmoothGroupSettings & {
          Destination: OutputLocationRef;
        };
        CmafIngestGroupSettings: CmafIngestGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
          })[];
          AdditionalDestinations: (AdditionalDestinations & {
            Destination: OutputLocationRef;
          })[];
        };
      };
      Outputs: (Output & {
        OutputSettings: OutputSettings & {
          ArchiveOutputSettings: ArchiveOutputSettings & {
            ContainerSettings: ArchiveContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
          };
          HlsOutputSettings: HlsOutputSettings & {
            HlsSettings: HlsSettings & {
              AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
              };
              StandardHlsSettings: StandardHlsSettings & {
                M3u8Settings: M3u8Settings;
              };
            };
          };
          MultiplexOutputSettings: MultiplexOutputSettings & {
            Destination: OutputLocationRef;
          };
          RtmpOutputSettings: RtmpOutputSettings & {
            Destination: OutputLocationRef;
          };
          UdpOutputSettings: UdpOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
          SrtOutputSettings: SrtOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
        };
      })[];
    })[];
    TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
    VideoDescriptions: (VideoDescription & {
      Name: string;
      CodecSettings: VideoCodecSettings & {
        FrameCaptureSettings: FrameCaptureSettings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H264Settings: H264Settings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H265Settings: H265Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Mpeg2Settings: Mpeg2Settings & {
          FramerateDenominator: __integerMin1;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Av1Settings: Av1Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
      };
    })[];
    AvailBlanking: AvailBlanking & {
      AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
    };
    AvailConfiguration: AvailConfiguration & {
      AvailSettings: AvailSettings & {
        Esam: Esam & {
          AcquisitionPointId: __stringMax256;
          PoisEndpoint: __stringMax2048;
        };
      };
    };
    BlackoutSlate: BlackoutSlate & {
      BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
      NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
    };
    CaptionDescriptions: (CaptionDescription & {
      CaptionSelectorName: string;
      Name: string;
      DestinationSettings: CaptionDestinationSettings & {
        BurnInDestinationSettings: BurnInDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
        DvbSubDestinationSettings: DvbSubDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
      };
    })[];
    GlobalConfiguration: GlobalConfiguration & {
      InputLossBehavior: InputLossBehavior & {
        InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
      };
    };
    MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
      MotionGraphicsSettings: MotionGraphicsSettings;
    };
    ThumbnailConfiguration: ThumbnailConfiguration & { State: ThumbnailState };
    ColorCorrectionSettings: ColorCorrectionSettings & {
      GlobalColorCorrections: (ColorCorrection & {
        InputColorSpace: ColorSpace;
        OutputColorSpace: ColorSpace;
        Uri: string;
      })[];
    };
  };
  Id?: string;
  InputAttachments?: (InputAttachment & {
    AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
      SecondaryInputId: string;
      FailoverConditions: (FailoverCondition & {
        FailoverConditionSettings: FailoverConditionSettings & {
          AudioSilenceSettings: AudioSilenceFailoverSettings & {
            AudioSelectorName: string;
          };
        };
      })[];
    };
    InputSettings: InputSettings & {
      AudioSelectors: (AudioSelector & {
        Name: __stringMin1;
        SelectorSettings: AudioSelectorSettings & {
          AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
            GroupId: __stringMin1;
            Name: __stringMin1;
          };
          AudioLanguageSelection: AudioLanguageSelection & {
            LanguageCode: string;
          };
          AudioPidSelection: AudioPidSelection & { Pid: __integerMin0Max8191 };
          AudioTrackSelection: AudioTrackSelection & {
            Tracks: (AudioTrack & { Track: __integerMin1 })[];
            DolbyEDecode: AudioDolbyEDecode & {
              ProgramSelection: DolbyEProgramSelection;
            };
          };
        };
      })[];
      CaptionSelectors: (CaptionSelector & {
        Name: __stringMin1;
        SelectorSettings: CaptionSelectorSettings & {
          TeletextSourceSettings: TeletextSourceSettings & {
            OutputRectangle: CaptionRectangle & {
              Height: __doubleMin0Max100;
              LeftOffset: __doubleMin0Max100;
              TopOffset: __doubleMin0Max100;
              Width: __doubleMin0Max100;
            };
          };
        };
      })[];
    };
  })[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  MaintenanceStatus?: string;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const RestartChannelPipelinesResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    MaintenanceStatus: S.optional(S.String).pipe(
      T.JsonName("maintenanceStatus"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "RestartChannelPipelinesResponse",
}) as any as S.Schema<RestartChannelPipelinesResponse>;
export interface StartChannelResponse {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings & {
    AudioDescriptions: (AudioDescription & {
      AudioSelectorName: string;
      Name: __stringMax255;
      AudioWatermarkingSettings: AudioWatermarkSettings & {
        NielsenWatermarksSettings: NielsenWatermarksSettings & {
          NielsenCbetSettings: NielsenCBET & {
            CbetCheckDigitString: __stringMin2Max2;
            CbetStepaside: NielsenWatermarksCbetStepaside;
            Csid: __stringMin1Max7;
          };
          NielsenNaesIiNwSettings: NielsenNaesIiNw & {
            CheckDigitString: __stringMin2Max2;
            Sid: __doubleMin1Max65535;
          };
        };
      };
      RemixSettings: RemixSettings & {
        ChannelMappings: (AudioChannelMapping & {
          InputChannelLevels: (InputChannelLevel & {
            Gain: __integerMinNegative60Max6;
            InputChannel: __integerMin0Max15;
          })[];
          OutputChannel: __integerMin0Max7;
        })[];
      };
    })[];
    OutputGroups: (OutputGroup & {
      OutputGroupSettings: OutputGroupSettings & {
        ArchiveGroupSettings: ArchiveGroupSettings & {
          Destination: OutputLocationRef;
        };
        FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
          Destination: OutputLocationRef;
        };
        HlsGroupSettings: HlsGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
            LanguageDescription: __stringMin1;
          })[];
          KeyProviderSettings: KeyProviderSettings & {
            StaticKeySettings: StaticKeySettings & {
              StaticKeyValue: __stringMin32Max32;
              KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
            };
          };
        };
        MediaPackageGroupSettings: MediaPackageGroupSettings & {
          Destination: OutputLocationRef;
          MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            AdditionalDestinations: (MediaPackageAdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        MsSmoothGroupSettings: MsSmoothGroupSettings & {
          Destination: OutputLocationRef;
        };
        CmafIngestGroupSettings: CmafIngestGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
          })[];
          AdditionalDestinations: (AdditionalDestinations & {
            Destination: OutputLocationRef;
          })[];
        };
      };
      Outputs: (Output & {
        OutputSettings: OutputSettings & {
          ArchiveOutputSettings: ArchiveOutputSettings & {
            ContainerSettings: ArchiveContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
          };
          HlsOutputSettings: HlsOutputSettings & {
            HlsSettings: HlsSettings & {
              AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
              };
              StandardHlsSettings: StandardHlsSettings & {
                M3u8Settings: M3u8Settings;
              };
            };
          };
          MultiplexOutputSettings: MultiplexOutputSettings & {
            Destination: OutputLocationRef;
          };
          RtmpOutputSettings: RtmpOutputSettings & {
            Destination: OutputLocationRef;
          };
          UdpOutputSettings: UdpOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
          SrtOutputSettings: SrtOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
        };
      })[];
    })[];
    TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
    VideoDescriptions: (VideoDescription & {
      Name: string;
      CodecSettings: VideoCodecSettings & {
        FrameCaptureSettings: FrameCaptureSettings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H264Settings: H264Settings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H265Settings: H265Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Mpeg2Settings: Mpeg2Settings & {
          FramerateDenominator: __integerMin1;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Av1Settings: Av1Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
      };
    })[];
    AvailBlanking: AvailBlanking & {
      AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
    };
    AvailConfiguration: AvailConfiguration & {
      AvailSettings: AvailSettings & {
        Esam: Esam & {
          AcquisitionPointId: __stringMax256;
          PoisEndpoint: __stringMax2048;
        };
      };
    };
    BlackoutSlate: BlackoutSlate & {
      BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
      NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
    };
    CaptionDescriptions: (CaptionDescription & {
      CaptionSelectorName: string;
      Name: string;
      DestinationSettings: CaptionDestinationSettings & {
        BurnInDestinationSettings: BurnInDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
        DvbSubDestinationSettings: DvbSubDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
      };
    })[];
    GlobalConfiguration: GlobalConfiguration & {
      InputLossBehavior: InputLossBehavior & {
        InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
      };
    };
    MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
      MotionGraphicsSettings: MotionGraphicsSettings;
    };
    ThumbnailConfiguration: ThumbnailConfiguration & { State: ThumbnailState };
    ColorCorrectionSettings: ColorCorrectionSettings & {
      GlobalColorCorrections: (ColorCorrection & {
        InputColorSpace: ColorSpace;
        OutputColorSpace: ColorSpace;
        Uri: string;
      })[];
    };
  };
  Id?: string;
  InputAttachments?: (InputAttachment & {
    AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
      SecondaryInputId: string;
      FailoverConditions: (FailoverCondition & {
        FailoverConditionSettings: FailoverConditionSettings & {
          AudioSilenceSettings: AudioSilenceFailoverSettings & {
            AudioSelectorName: string;
          };
        };
      })[];
    };
    InputSettings: InputSettings & {
      AudioSelectors: (AudioSelector & {
        Name: __stringMin1;
        SelectorSettings: AudioSelectorSettings & {
          AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
            GroupId: __stringMin1;
            Name: __stringMin1;
          };
          AudioLanguageSelection: AudioLanguageSelection & {
            LanguageCode: string;
          };
          AudioPidSelection: AudioPidSelection & { Pid: __integerMin0Max8191 };
          AudioTrackSelection: AudioTrackSelection & {
            Tracks: (AudioTrack & { Track: __integerMin1 })[];
            DolbyEDecode: AudioDolbyEDecode & {
              ProgramSelection: DolbyEProgramSelection;
            };
          };
        };
      })[];
      CaptionSelectors: (CaptionSelector & {
        Name: __stringMin1;
        SelectorSettings: CaptionSelectorSettings & {
          TeletextSourceSettings: TeletextSourceSettings & {
            OutputRectangle: CaptionRectangle & {
              Height: __doubleMin0Max100;
              LeftOffset: __doubleMin0Max100;
              TopOffset: __doubleMin0Max100;
              Width: __doubleMin0Max100;
            };
          };
        };
      })[];
    };
  })[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const StartChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "StartChannelResponse",
}) as any as S.Schema<StartChannelResponse>;
export interface StartDeleteMonitorDeploymentResponse {
  Arn?: string;
  CloudWatchAlarmTemplateGroupIds?: string[];
  CreatedAt?: Date;
  Description?: string;
  DiscoveryEntryPointArn?: string;
  ErrorMessage?: string;
  EventBridgeRuleTemplateGroupIds?: string[];
  FailedMediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  Id?: string;
  LastDiscoveredAt?: Date;
  LastSuccessfulMonitorDeployment?: SuccessfulMonitorDeployment & {
    DetailsUri: __stringMin1Max2048;
    Status: SignalMapMonitorDeploymentStatus;
  };
  MediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  ModifiedAt?: Date;
  MonitorChangesPendingDeployment?: boolean;
  MonitorDeployment?: MonitorDeployment & {
    Status: SignalMapMonitorDeploymentStatus;
  };
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const StartDeleteMonitorDeploymentResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CloudWatchAlarmTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    EventBridgeRuleTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
    FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
      T.JsonName("failedMediaResourceMap"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LastDiscoveredAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastDiscoveredAt")),
    LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment)
      .pipe(T.JsonName("lastSuccessfulMonitorDeployment"))
      .annotations({ identifier: "SuccessfulMonitorDeployment" }),
    MediaResourceMap: S.optional(MediaResourceMap).pipe(
      T.JsonName("mediaResourceMap"),
    ),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
      T.JsonName("monitorChangesPendingDeployment"),
    ),
    MonitorDeployment: S.optional(MonitorDeployment)
      .pipe(T.JsonName("monitorDeployment"))
      .annotations({ identifier: "MonitorDeployment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "StartDeleteMonitorDeploymentResponse",
}) as any as S.Schema<StartDeleteMonitorDeploymentResponse>;
export interface StartMonitorDeploymentResponse {
  Arn?: string;
  CloudWatchAlarmTemplateGroupIds?: string[];
  CreatedAt?: Date;
  Description?: string;
  DiscoveryEntryPointArn?: string;
  ErrorMessage?: string;
  EventBridgeRuleTemplateGroupIds?: string[];
  FailedMediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  Id?: string;
  LastDiscoveredAt?: Date;
  LastSuccessfulMonitorDeployment?: SuccessfulMonitorDeployment & {
    DetailsUri: __stringMin1Max2048;
    Status: SignalMapMonitorDeploymentStatus;
  };
  MediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  ModifiedAt?: Date;
  MonitorChangesPendingDeployment?: boolean;
  MonitorDeployment?: MonitorDeployment & {
    Status: SignalMapMonitorDeploymentStatus;
  };
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const StartMonitorDeploymentResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CloudWatchAlarmTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    EventBridgeRuleTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
    FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
      T.JsonName("failedMediaResourceMap"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LastDiscoveredAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastDiscoveredAt")),
    LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment)
      .pipe(T.JsonName("lastSuccessfulMonitorDeployment"))
      .annotations({ identifier: "SuccessfulMonitorDeployment" }),
    MediaResourceMap: S.optional(MediaResourceMap).pipe(
      T.JsonName("mediaResourceMap"),
    ),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
      T.JsonName("monitorChangesPendingDeployment"),
    ),
    MonitorDeployment: S.optional(MonitorDeployment)
      .pipe(T.JsonName("monitorDeployment"))
      .annotations({ identifier: "MonitorDeployment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "StartMonitorDeploymentResponse",
}) as any as S.Schema<StartMonitorDeploymentResponse>;
export interface StartMultiplexResponse {
  Arn?: string;
  AvailabilityZones?: string[];
  Destinations?: MultiplexOutputDestination[];
  Id?: string;
  MultiplexSettings?: MultiplexSettings & {
    TransportStreamBitrate: __integerMin1000000Max100000000;
    TransportStreamId: __integerMin0Max65535;
  };
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const StartMultiplexResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "StartMultiplexResponse",
}) as any as S.Schema<StartMultiplexResponse>;
export interface StartUpdateSignalMapResponse {
  Arn?: string;
  CloudWatchAlarmTemplateGroupIds?: string[];
  CreatedAt?: Date;
  Description?: string;
  DiscoveryEntryPointArn?: string;
  ErrorMessage?: string;
  EventBridgeRuleTemplateGroupIds?: string[];
  FailedMediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  Id?: string;
  LastDiscoveredAt?: Date;
  LastSuccessfulMonitorDeployment?: SuccessfulMonitorDeployment & {
    DetailsUri: __stringMin1Max2048;
    Status: SignalMapMonitorDeploymentStatus;
  };
  MediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  ModifiedAt?: Date;
  MonitorChangesPendingDeployment?: boolean;
  MonitorDeployment?: MonitorDeployment & {
    Status: SignalMapMonitorDeploymentStatus;
  };
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const StartUpdateSignalMapResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CloudWatchAlarmTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    EventBridgeRuleTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
    FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
      T.JsonName("failedMediaResourceMap"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LastDiscoveredAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastDiscoveredAt")),
    LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment)
      .pipe(T.JsonName("lastSuccessfulMonitorDeployment"))
      .annotations({ identifier: "SuccessfulMonitorDeployment" }),
    MediaResourceMap: S.optional(MediaResourceMap).pipe(
      T.JsonName("mediaResourceMap"),
    ),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
      T.JsonName("monitorChangesPendingDeployment"),
    ),
    MonitorDeployment: S.optional(MonitorDeployment)
      .pipe(T.JsonName("monitorDeployment"))
      .annotations({ identifier: "MonitorDeployment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "StartUpdateSignalMapResponse",
}) as any as S.Schema<StartUpdateSignalMapResponse>;
export interface StopChannelResponse {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings & {
    AudioDescriptions: (AudioDescription & {
      AudioSelectorName: string;
      Name: __stringMax255;
      AudioWatermarkingSettings: AudioWatermarkSettings & {
        NielsenWatermarksSettings: NielsenWatermarksSettings & {
          NielsenCbetSettings: NielsenCBET & {
            CbetCheckDigitString: __stringMin2Max2;
            CbetStepaside: NielsenWatermarksCbetStepaside;
            Csid: __stringMin1Max7;
          };
          NielsenNaesIiNwSettings: NielsenNaesIiNw & {
            CheckDigitString: __stringMin2Max2;
            Sid: __doubleMin1Max65535;
          };
        };
      };
      RemixSettings: RemixSettings & {
        ChannelMappings: (AudioChannelMapping & {
          InputChannelLevels: (InputChannelLevel & {
            Gain: __integerMinNegative60Max6;
            InputChannel: __integerMin0Max15;
          })[];
          OutputChannel: __integerMin0Max7;
        })[];
      };
    })[];
    OutputGroups: (OutputGroup & {
      OutputGroupSettings: OutputGroupSettings & {
        ArchiveGroupSettings: ArchiveGroupSettings & {
          Destination: OutputLocationRef;
        };
        FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
          Destination: OutputLocationRef;
        };
        HlsGroupSettings: HlsGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
            LanguageDescription: __stringMin1;
          })[];
          KeyProviderSettings: KeyProviderSettings & {
            StaticKeySettings: StaticKeySettings & {
              StaticKeyValue: __stringMin32Max32;
              KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
            };
          };
        };
        MediaPackageGroupSettings: MediaPackageGroupSettings & {
          Destination: OutputLocationRef;
          MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            AdditionalDestinations: (MediaPackageAdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        MsSmoothGroupSettings: MsSmoothGroupSettings & {
          Destination: OutputLocationRef;
        };
        CmafIngestGroupSettings: CmafIngestGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
          })[];
          AdditionalDestinations: (AdditionalDestinations & {
            Destination: OutputLocationRef;
          })[];
        };
      };
      Outputs: (Output & {
        OutputSettings: OutputSettings & {
          ArchiveOutputSettings: ArchiveOutputSettings & {
            ContainerSettings: ArchiveContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
          };
          HlsOutputSettings: HlsOutputSettings & {
            HlsSettings: HlsSettings & {
              AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
              };
              StandardHlsSettings: StandardHlsSettings & {
                M3u8Settings: M3u8Settings;
              };
            };
          };
          MultiplexOutputSettings: MultiplexOutputSettings & {
            Destination: OutputLocationRef;
          };
          RtmpOutputSettings: RtmpOutputSettings & {
            Destination: OutputLocationRef;
          };
          UdpOutputSettings: UdpOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
          SrtOutputSettings: SrtOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
        };
      })[];
    })[];
    TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
    VideoDescriptions: (VideoDescription & {
      Name: string;
      CodecSettings: VideoCodecSettings & {
        FrameCaptureSettings: FrameCaptureSettings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H264Settings: H264Settings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H265Settings: H265Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Mpeg2Settings: Mpeg2Settings & {
          FramerateDenominator: __integerMin1;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Av1Settings: Av1Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
      };
    })[];
    AvailBlanking: AvailBlanking & {
      AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
    };
    AvailConfiguration: AvailConfiguration & {
      AvailSettings: AvailSettings & {
        Esam: Esam & {
          AcquisitionPointId: __stringMax256;
          PoisEndpoint: __stringMax2048;
        };
      };
    };
    BlackoutSlate: BlackoutSlate & {
      BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
      NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
    };
    CaptionDescriptions: (CaptionDescription & {
      CaptionSelectorName: string;
      Name: string;
      DestinationSettings: CaptionDestinationSettings & {
        BurnInDestinationSettings: BurnInDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
        DvbSubDestinationSettings: DvbSubDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
      };
    })[];
    GlobalConfiguration: GlobalConfiguration & {
      InputLossBehavior: InputLossBehavior & {
        InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
      };
    };
    MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
      MotionGraphicsSettings: MotionGraphicsSettings;
    };
    ThumbnailConfiguration: ThumbnailConfiguration & { State: ThumbnailState };
    ColorCorrectionSettings: ColorCorrectionSettings & {
      GlobalColorCorrections: (ColorCorrection & {
        InputColorSpace: ColorSpace;
        OutputColorSpace: ColorSpace;
        Uri: string;
      })[];
    };
  };
  Id?: string;
  InputAttachments?: (InputAttachment & {
    AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
      SecondaryInputId: string;
      FailoverConditions: (FailoverCondition & {
        FailoverConditionSettings: FailoverConditionSettings & {
          AudioSilenceSettings: AudioSilenceFailoverSettings & {
            AudioSelectorName: string;
          };
        };
      })[];
    };
    InputSettings: InputSettings & {
      AudioSelectors: (AudioSelector & {
        Name: __stringMin1;
        SelectorSettings: AudioSelectorSettings & {
          AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
            GroupId: __stringMin1;
            Name: __stringMin1;
          };
          AudioLanguageSelection: AudioLanguageSelection & {
            LanguageCode: string;
          };
          AudioPidSelection: AudioPidSelection & { Pid: __integerMin0Max8191 };
          AudioTrackSelection: AudioTrackSelection & {
            Tracks: (AudioTrack & { Track: __integerMin1 })[];
            DolbyEDecode: AudioDolbyEDecode & {
              ProgramSelection: DolbyEProgramSelection;
            };
          };
        };
      })[];
      CaptionSelectors: (CaptionSelector & {
        Name: __stringMin1;
        SelectorSettings: CaptionSelectorSettings & {
          TeletextSourceSettings: TeletextSourceSettings & {
            OutputRectangle: CaptionRectangle & {
              Height: __doubleMin0Max100;
              LeftOffset: __doubleMin0Max100;
              TopOffset: __doubleMin0Max100;
              Width: __doubleMin0Max100;
            };
          };
        };
      })[];
    };
  })[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const StopChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "StopChannelResponse",
}) as any as S.Schema<StopChannelResponse>;
export interface StopMultiplexResponse {
  Arn?: string;
  AvailabilityZones?: string[];
  Destinations?: MultiplexOutputDestination[];
  Id?: string;
  MultiplexSettings?: MultiplexSettings & {
    TransportStreamBitrate: __integerMin1000000Max100000000;
    TransportStreamId: __integerMin0Max65535;
  };
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const StopMultiplexResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "StopMultiplexResponse",
}) as any as S.Schema<StopMultiplexResponse>;
export interface UpdateAccountConfigurationResponse {
  AccountConfiguration?: AccountConfiguration;
}
export const UpdateAccountConfigurationResponse = S.suspend(() =>
  S.Struct({
    AccountConfiguration: S.optional(AccountConfiguration)
      .pipe(T.JsonName("accountConfiguration"))
      .annotations({ identifier: "AccountConfiguration" }),
  }),
).annotations({
  identifier: "UpdateAccountConfigurationResponse",
}) as any as S.Schema<UpdateAccountConfigurationResponse>;
export interface FollowerChannelSettings {
  LinkedChannelType?: LinkedChannelType;
  PrimaryChannelArn?: string;
}
export const FollowerChannelSettings = S.suspend(() =>
  S.Struct({
    LinkedChannelType: S.optional(LinkedChannelType).pipe(
      T.JsonName("linkedChannelType"),
    ),
    PrimaryChannelArn: S.optional(S.String).pipe(
      T.JsonName("primaryChannelArn"),
    ),
  }),
).annotations({
  identifier: "FollowerChannelSettings",
}) as any as S.Schema<FollowerChannelSettings>;
export interface PrimaryChannelSettings {
  LinkedChannelType?: LinkedChannelType;
}
export const PrimaryChannelSettings = S.suspend(() =>
  S.Struct({
    LinkedChannelType: S.optional(LinkedChannelType).pipe(
      T.JsonName("linkedChannelType"),
    ),
  }),
).annotations({
  identifier: "PrimaryChannelSettings",
}) as any as S.Schema<PrimaryChannelSettings>;
export interface LinkedChannelSettings {
  FollowerChannelSettings?: FollowerChannelSettings;
  PrimaryChannelSettings?: PrimaryChannelSettings;
}
export const LinkedChannelSettings = S.suspend(() =>
  S.Struct({
    FollowerChannelSettings: S.optional(FollowerChannelSettings)
      .pipe(T.JsonName("followerChannelSettings"))
      .annotations({ identifier: "FollowerChannelSettings" }),
    PrimaryChannelSettings: S.optional(PrimaryChannelSettings)
      .pipe(T.JsonName("primaryChannelSettings"))
      .annotations({ identifier: "PrimaryChannelSettings" }),
  }),
).annotations({
  identifier: "LinkedChannelSettings",
}) as any as S.Schema<LinkedChannelSettings>;
export interface UpdateChannelRequest {
  CdiInputSpecification?: CdiInputSpecification;
  ChannelId: string;
  Destinations?: OutputDestination[];
  EncoderSettings?: EncoderSettings;
  InputAttachments?: InputAttachment[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceUpdateSettings;
  Name?: string;
  RoleArn?: string;
  ChannelEngineVersion?: ChannelEngineVersionRequest;
  DryRun?: boolean;
  AnywhereSettings?: AnywhereSettings;
  LinkedChannelSettings?: LinkedChannelSettings;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceUpdateSettings)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceUpdateSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    ChannelEngineVersion: S.optional(ChannelEngineVersionRequest)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionRequest" }),
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    AnywhereSettings: S.optional(AnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "AnywhereSettings" }),
    LinkedChannelSettings: S.optional(LinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "LinkedChannelSettings" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelRequest",
}) as any as S.Schema<UpdateChannelRequest>;
export interface UpdateChannelPlacementGroupResponse {
  Arn?: string;
  Channels?: string[];
  ClusterId?: string;
  Id?: string;
  Name?: string;
  Nodes?: string[];
  State?: ChannelPlacementGroupState;
}
export const UpdateChannelPlacementGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    State: S.optional(ChannelPlacementGroupState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "UpdateChannelPlacementGroupResponse",
}) as any as S.Schema<UpdateChannelPlacementGroupResponse>;
export interface UpdateCloudWatchAlarmTemplateResponse {
  Arn?: string;
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  CreatedAt?: Date;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupId?: string;
  Id?: string;
  MetricName?: string;
  ModifiedAt?: Date;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  Tags?: { [key: string]: string | undefined };
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
}
export const UpdateCloudWatchAlarmTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
  }),
).annotations({
  identifier: "UpdateCloudWatchAlarmTemplateResponse",
}) as any as S.Schema<UpdateCloudWatchAlarmTemplateResponse>;
export interface UpdateCloudWatchAlarmTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const UpdateCloudWatchAlarmTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateCloudWatchAlarmTemplateGroupResponse",
}) as any as S.Schema<UpdateCloudWatchAlarmTemplateGroupResponse>;
export interface UpdateEventBridgeRuleTemplateResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  EventTargets?: (EventBridgeRuleTemplateTarget & {
    Arn: __stringMin1Max2048PatternArn;
  })[];
  EventType?: EventBridgeRuleTemplateEventType;
  GroupId?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const UpdateEventBridgeRuleTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateEventBridgeRuleTemplateResponse",
}) as any as S.Schema<UpdateEventBridgeRuleTemplateResponse>;
export interface UpdateEventBridgeRuleTemplateGroupResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const UpdateEventBridgeRuleTemplateGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "UpdateEventBridgeRuleTemplateGroupResponse",
}) as any as S.Schema<UpdateEventBridgeRuleTemplateGroupResponse>;
export interface InputWhitelistRule {
  Cidr?: string;
}
export const InputWhitelistRule = S.suspend(() =>
  S.Struct({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }),
).annotations({
  identifier: "InputWhitelistRule",
}) as any as S.Schema<InputWhitelistRule>;
export type __listOfInputWhitelistRule = InputWhitelistRule[];
export const __listOfInputWhitelistRule = S.Array(InputWhitelistRule);
export interface InputSecurityGroup {
  Arn?: string;
  Id?: string;
  Inputs?: string[];
  State?: InputSecurityGroupState;
  Tags?: { [key: string]: string | undefined };
  WhitelistRules?: InputWhitelistRule[];
}
export const InputSecurityGroup = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
    State: S.optional(InputSecurityGroupState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRule).pipe(
      T.JsonName("whitelistRules"),
    ),
  }),
).annotations({
  identifier: "InputSecurityGroup",
}) as any as S.Schema<InputSecurityGroup>;
export interface UpdateInputSecurityGroupResponse {
  SecurityGroup?: InputSecurityGroup;
}
export const UpdateInputSecurityGroupResponse = S.suspend(() =>
  S.Struct({
    SecurityGroup: S.optional(InputSecurityGroup)
      .pipe(T.JsonName("securityGroup"))
      .annotations({ identifier: "InputSecurityGroup" }),
  }),
).annotations({
  identifier: "UpdateInputSecurityGroupResponse",
}) as any as S.Schema<UpdateInputSecurityGroupResponse>;
export interface UpdateNetworkRequest {
  IpPools?: IpPoolUpdateRequest[];
  Name?: string;
  NetworkId: string;
  Routes?: RouteUpdateRequest[];
}
export const UpdateNetworkRequest = S.suspend(() =>
  S.Struct({
    IpPools: S.optional(__listOfIpPoolUpdateRequest).pipe(
      T.JsonName("ipPools"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    Routes: S.optional(__listOfRouteUpdateRequest).pipe(T.JsonName("routes")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/networks/{NetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNetworkRequest",
}) as any as S.Schema<UpdateNetworkRequest>;
export interface UpdateNodeRequest {
  ClusterId: string;
  Name?: string;
  NodeId: string;
  Role?: NodeRole;
  SdiSourceMappings?: SdiSourceMappingUpdateRequest[];
}
export const UpdateNodeRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    SdiSourceMappings: S.optional(SdiSourceMappingsUpdateRequest).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNodeRequest",
}) as any as S.Schema<UpdateNodeRequest>;
export interface UpdateNodeStateResponse {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const UpdateNodeStateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "UpdateNodeStateResponse",
}) as any as S.Schema<UpdateNodeStateResponse>;
export interface Reservation {
  Arn?: string;
  Count?: number;
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: OfferingDurationUnits;
  End?: string;
  FixedPrice?: number;
  Name?: string;
  OfferingDescription?: string;
  OfferingId?: string;
  OfferingType?: OfferingType;
  Region?: string;
  RenewalSettings?: RenewalSettings;
  ReservationId?: string;
  ResourceSpecification?: ReservationResourceSpecification;
  Start?: string;
  State?: ReservationState;
  Tags?: { [key: string]: string | undefined };
  UsagePrice?: number;
}
export const Reservation = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(OfferingDurationUnits).pipe(
      T.JsonName("durationUnits"),
    ),
    End: S.optional(S.String).pipe(T.JsonName("end")),
    FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
    OfferingType: S.optional(OfferingType).pipe(T.JsonName("offeringType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    RenewalSettings: S.optional(RenewalSettings)
      .pipe(T.JsonName("renewalSettings"))
      .annotations({ identifier: "RenewalSettings" }),
    ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
    ResourceSpecification: S.optional(ReservationResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ReservationResourceSpecification" }),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    State: S.optional(ReservationState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
  }),
).annotations({ identifier: "Reservation" }) as any as S.Schema<Reservation>;
export interface UpdateReservationResponse {
  Reservation?: Reservation;
}
export const UpdateReservationResponse = S.suspend(() =>
  S.Struct({
    Reservation: S.optional(Reservation)
      .pipe(T.JsonName("reservation"))
      .annotations({ identifier: "Reservation" }),
  }),
).annotations({
  identifier: "UpdateReservationResponse",
}) as any as S.Schema<UpdateReservationResponse>;
export interface UpdateSdiSourceResponse {
  SdiSource?: SdiSource;
}
export const UpdateSdiSourceResponse = S.suspend(() =>
  S.Struct({
    SdiSource: S.optional(SdiSource)
      .pipe(T.JsonName("sdiSource"))
      .annotations({ identifier: "SdiSource" }),
  }),
).annotations({
  identifier: "UpdateSdiSourceResponse",
}) as any as S.Schema<UpdateSdiSourceResponse>;
export interface InterfaceMappingCreateRequest {
  LogicalInterfaceName?: string;
  NetworkId?: string;
}
export const InterfaceMappingCreateRequest = S.suspend(() =>
  S.Struct({
    LogicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("logicalInterfaceName"),
    ),
    NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
  }),
).annotations({
  identifier: "InterfaceMappingCreateRequest",
}) as any as S.Schema<InterfaceMappingCreateRequest>;
export type __listOfInterfaceMappingCreateRequest =
  InterfaceMappingCreateRequest[];
export const __listOfInterfaceMappingCreateRequest = S.Array(
  InterfaceMappingCreateRequest,
);
export interface InputRequestDestinationRoute {
  Cidr?: string;
  Gateway?: string;
}
export const InputRequestDestinationRoute = S.suspend(() =>
  S.Struct({
    Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  }),
).annotations({
  identifier: "InputRequestDestinationRoute",
}) as any as S.Schema<InputRequestDestinationRoute>;
export type __listOfInputRequestDestinationRoute =
  InputRequestDestinationRoute[];
export const __listOfInputRequestDestinationRoute = S.Array(
  InputRequestDestinationRoute,
);
export interface MulticastSourceCreateRequest {
  SourceIp?: string;
  Url?: string;
}
export const MulticastSourceCreateRequest = S.suspend(() =>
  S.Struct({
    SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "MulticastSourceCreateRequest",
}) as any as S.Schema<MulticastSourceCreateRequest>;
export type __listOfMulticastSourceCreateRequest =
  MulticastSourceCreateRequest[];
export const __listOfMulticastSourceCreateRequest = S.Array(
  MulticastSourceCreateRequest,
);
export interface RouterDestinationSettings {
  AvailabilityZoneName?: string;
}
export const RouterDestinationSettings = S.suspend(() =>
  S.Struct({
    AvailabilityZoneName: S.optional(S.String).pipe(
      T.JsonName("availabilityZoneName"),
    ),
  }),
).annotations({
  identifier: "RouterDestinationSettings",
}) as any as S.Schema<RouterDestinationSettings>;
export type __listOfRouterDestinationSettings = RouterDestinationSettings[];
export const __listOfRouterDestinationSettings = S.Array(
  RouterDestinationSettings,
);
export type InputDeviceActiveInput = "HDMI" | "SDI" | (string & {});
export const InputDeviceActiveInput = S.String;
export type InputDeviceState = "IDLE" | "STREAMING" | (string & {});
export const InputDeviceState = S.String;
export type InputDeviceScanType = "INTERLACED" | "PROGRESSIVE" | (string & {});
export const InputDeviceScanType = S.String;
export type InputDeviceIpScheme = "STATIC" | "DHCP" | (string & {});
export const InputDeviceIpScheme = S.String;
export type ChannelAlertState = "SET" | "CLEARED" | (string & {});
export const ChannelAlertState = S.String;
export type ClusterAlertState = "SET" | "CLEARED" | (string & {});
export const ClusterAlertState = S.String;
export type InputDeviceTransferType = "OUTGOING" | "INCOMING" | (string & {});
export const InputDeviceTransferType = S.String;
export type MultiplexAlertState = "SET" | "CLEARED" | (string & {});
export const MultiplexAlertState = S.String;
export interface InterfaceMappingUpdateRequest {
  LogicalInterfaceName?: string;
  NetworkId?: string;
}
export const InterfaceMappingUpdateRequest = S.suspend(() =>
  S.Struct({
    LogicalInterfaceName: S.optional(S.String).pipe(
      T.JsonName("logicalInterfaceName"),
    ),
    NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
  }),
).annotations({
  identifier: "InterfaceMappingUpdateRequest",
}) as any as S.Schema<InterfaceMappingUpdateRequest>;
export type __listOfInterfaceMappingUpdateRequest =
  InterfaceMappingUpdateRequest[];
export const __listOfInterfaceMappingUpdateRequest = S.Array(
  InterfaceMappingUpdateRequest,
);
export interface MulticastSourceUpdateRequest {
  SourceIp?: string;
  Url?: string;
}
export const MulticastSourceUpdateRequest = S.suspend(() =>
  S.Struct({
    SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
    Url: S.optional(S.String).pipe(T.JsonName("url")),
  }),
).annotations({
  identifier: "MulticastSourceUpdateRequest",
}) as any as S.Schema<MulticastSourceUpdateRequest>;
export type __listOfMulticastSourceUpdateRequest =
  MulticastSourceUpdateRequest[];
export const __listOfMulticastSourceUpdateRequest = S.Array(
  MulticastSourceUpdateRequest,
);
export interface InputDeviceMediaConnectConfigurableSettings {
  FlowArn?: string;
  RoleArn?: string;
  SecretArn?: string;
  SourceName?: string;
}
export const InputDeviceMediaConnectConfigurableSettings = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
    SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
  }),
).annotations({
  identifier: "InputDeviceMediaConnectConfigurableSettings",
}) as any as S.Schema<InputDeviceMediaConnectConfigurableSettings>;
export interface InputDeviceConfigurableAudioChannelPairConfig {
  Id?: number;
  Profile?: InputDeviceConfigurableAudioChannelPairProfile;
}
export const InputDeviceConfigurableAudioChannelPairConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number).pipe(T.JsonName("id")),
    Profile: S.optional(InputDeviceConfigurableAudioChannelPairProfile).pipe(
      T.JsonName("profile"),
    ),
  }),
).annotations({
  identifier: "InputDeviceConfigurableAudioChannelPairConfig",
}) as any as S.Schema<InputDeviceConfigurableAudioChannelPairConfig>;
export type __listOfInputDeviceConfigurableAudioChannelPairConfig =
  InputDeviceConfigurableAudioChannelPairConfig[];
export const __listOfInputDeviceConfigurableAudioChannelPairConfig = S.Array(
  InputDeviceConfigurableAudioChannelPairConfig,
);
export interface ClusterNetworkSettingsCreateRequest {
  DefaultRoute?: string;
  InterfaceMappings?: InterfaceMappingCreateRequest[];
}
export const ClusterNetworkSettingsCreateRequest = S.suspend(() =>
  S.Struct({
    DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
    InterfaceMappings: S.optional(__listOfInterfaceMappingCreateRequest).pipe(
      T.JsonName("interfaceMappings"),
    ),
  }),
).annotations({
  identifier: "ClusterNetworkSettingsCreateRequest",
}) as any as S.Schema<ClusterNetworkSettingsCreateRequest>;
export interface InputDestinationRequest {
  StreamName?: string;
  Network?: string;
  NetworkRoutes?: InputRequestDestinationRoute[];
  StaticIpAddress?: string;
}
export const InputDestinationRequest = S.suspend(() =>
  S.Struct({
    StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
    Network: S.optional(S.String).pipe(T.JsonName("network")),
    NetworkRoutes: S.optional(__listOfInputRequestDestinationRoute).pipe(
      T.JsonName("networkRoutes"),
    ),
    StaticIpAddress: S.optional(S.String).pipe(T.JsonName("staticIpAddress")),
  }),
).annotations({
  identifier: "InputDestinationRequest",
}) as any as S.Schema<InputDestinationRequest>;
export type __listOfInputDestinationRequest = InputDestinationRequest[];
export const __listOfInputDestinationRequest = S.Array(InputDestinationRequest);
export interface MulticastSettingsCreateRequest {
  Sources?: MulticastSourceCreateRequest[];
}
export const MulticastSettingsCreateRequest = S.suspend(() =>
  S.Struct({
    Sources: S.optional(__listOfMulticastSourceCreateRequest).pipe(
      T.JsonName("sources"),
    ),
  }),
).annotations({
  identifier: "MulticastSettingsCreateRequest",
}) as any as S.Schema<MulticastSettingsCreateRequest>;
export interface RouterSettings {
  Destinations?: RouterDestinationSettings[];
  EncryptionType?: RouterEncryptionType;
  SecretArn?: string;
}
export const RouterSettings = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(__listOfRouterDestinationSettings).pipe(
      T.JsonName("destinations"),
    ),
    EncryptionType: S.optional(RouterEncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  }),
).annotations({
  identifier: "RouterSettings",
}) as any as S.Schema<RouterSettings>;
export interface InputDeviceHdSettings {
  ActiveInput?: InputDeviceActiveInput;
  ConfiguredInput?: InputDeviceConfiguredInput;
  DeviceState?: InputDeviceState;
  Framerate?: number;
  Height?: number;
  MaxBitrate?: number;
  ScanType?: InputDeviceScanType;
  Width?: number;
  LatencyMs?: number;
}
export const InputDeviceHdSettings = S.suspend(() =>
  S.Struct({
    ActiveInput: S.optional(InputDeviceActiveInput).pipe(
      T.JsonName("activeInput"),
    ),
    ConfiguredInput: S.optional(InputDeviceConfiguredInput).pipe(
      T.JsonName("configuredInput"),
    ),
    DeviceState: S.optional(InputDeviceState).pipe(T.JsonName("deviceState")),
    Framerate: S.optional(S.Number).pipe(T.JsonName("framerate")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ScanType: S.optional(InputDeviceScanType).pipe(T.JsonName("scanType")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
  }),
).annotations({
  identifier: "InputDeviceHdSettings",
}) as any as S.Schema<InputDeviceHdSettings>;
export interface InputDeviceNetworkSettings {
  DnsAddresses?: string[];
  Gateway?: string;
  IpAddress?: string;
  IpScheme?: InputDeviceIpScheme;
  SubnetMask?: string;
}
export const InputDeviceNetworkSettings = S.suspend(() =>
  S.Struct({
    DnsAddresses: S.optional(__listOf__string).pipe(T.JsonName("dnsAddresses")),
    Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
    IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
    IpScheme: S.optional(InputDeviceIpScheme).pipe(T.JsonName("ipScheme")),
    SubnetMask: S.optional(S.String).pipe(T.JsonName("subnetMask")),
  }),
).annotations({
  identifier: "InputDeviceNetworkSettings",
}) as any as S.Schema<InputDeviceNetworkSettings>;
export interface ChannelAlert {
  AlertType?: string;
  ClearedTimestamp?: Date;
  Id?: string;
  Message?: string;
  PipelineId?: string;
  SetTimestamp?: Date;
  State?: ChannelAlertState;
}
export const ChannelAlert = S.suspend(() =>
  S.Struct({
    AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
    ClearedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("clearedTimestamp")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
    SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("setTimestamp"),
    ),
    State: S.optional(ChannelAlertState).pipe(T.JsonName("state")),
  }),
).annotations({ identifier: "ChannelAlert" }) as any as S.Schema<ChannelAlert>;
export type __listOfChannelAlert = ChannelAlert[];
export const __listOfChannelAlert = S.Array(ChannelAlert);
export interface DescribeChannelPlacementGroupSummary {
  Arn?: string;
  Channels?: string[];
  ClusterId?: string;
  Id?: string;
  Name?: string;
  Nodes?: string[];
  State?: ChannelPlacementGroupState;
}
export const DescribeChannelPlacementGroupSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    State: S.optional(ChannelPlacementGroupState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeChannelPlacementGroupSummary",
}) as any as S.Schema<DescribeChannelPlacementGroupSummary>;
export type __listOfDescribeChannelPlacementGroupSummary =
  DescribeChannelPlacementGroupSummary[];
export const __listOfDescribeChannelPlacementGroupSummary = S.Array(
  DescribeChannelPlacementGroupSummary,
);
export interface ChannelSummary {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  Id?: string;
  InputAttachments?: InputAttachment[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  UsedChannelEngineVersions?: ChannelEngineVersionResponse[];
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const ChannelSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    UsedChannelEngineVersions: S.optional(
      __listOfChannelEngineVersionResponse,
    ).pipe(T.JsonName("usedChannelEngineVersions")),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "ChannelSummary",
}) as any as S.Schema<ChannelSummary>;
export type __listOfChannelSummary = ChannelSummary[];
export const __listOfChannelSummary = S.Array(ChannelSummary);
export interface CloudWatchAlarmTemplateGroupSummary {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  TemplateCount?: number;
}
export const CloudWatchAlarmTemplateGroupSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TemplateCount: S.optional(S.Number).pipe(T.JsonName("templateCount")),
  }),
).annotations({
  identifier: "CloudWatchAlarmTemplateGroupSummary",
}) as any as S.Schema<CloudWatchAlarmTemplateGroupSummary>;
export type __listOfCloudWatchAlarmTemplateGroupSummary =
  CloudWatchAlarmTemplateGroupSummary[];
export const __listOfCloudWatchAlarmTemplateGroupSummary = S.Array(
  CloudWatchAlarmTemplateGroupSummary,
);
export interface CloudWatchAlarmTemplateSummary {
  Arn?: string;
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  CreatedAt?: Date;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupId?: string;
  Id?: string;
  MetricName?: string;
  ModifiedAt?: Date;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  Tags?: { [key: string]: string | undefined };
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
}
export const CloudWatchAlarmTemplateSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
  }),
).annotations({
  identifier: "CloudWatchAlarmTemplateSummary",
}) as any as S.Schema<CloudWatchAlarmTemplateSummary>;
export type __listOfCloudWatchAlarmTemplateSummary =
  CloudWatchAlarmTemplateSummary[];
export const __listOfCloudWatchAlarmTemplateSummary = S.Array(
  CloudWatchAlarmTemplateSummary,
);
export interface ClusterAlert {
  AlertType?: string;
  ChannelId?: string;
  ClearedTimestamp?: Date;
  Id?: string;
  Message?: string;
  NodeId?: string;
  SetTimestamp?: Date;
  State?: ClusterAlertState;
}
export const ClusterAlert = S.suspend(() =>
  S.Struct({
    AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    ClearedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("clearedTimestamp")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    NodeId: S.optional(S.String).pipe(T.JsonName("nodeId")),
    SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("setTimestamp"),
    ),
    State: S.optional(ClusterAlertState).pipe(T.JsonName("state")),
  }),
).annotations({ identifier: "ClusterAlert" }) as any as S.Schema<ClusterAlert>;
export type __listOfClusterAlert = ClusterAlert[];
export const __listOfClusterAlert = S.Array(ClusterAlert);
export interface DescribeClusterSummary {
  Arn?: string;
  ChannelIds?: string[];
  ClusterType?: ClusterType;
  Id?: string;
  InstanceRoleArn?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettings;
  State?: ClusterState;
}
export const DescribeClusterSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettings" }),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeClusterSummary",
}) as any as S.Schema<DescribeClusterSummary>;
export type __listOfDescribeClusterSummary = DescribeClusterSummary[];
export const __listOfDescribeClusterSummary = S.Array(DescribeClusterSummary);
export interface EventBridgeRuleTemplateGroupSummary {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
  TemplateCount?: number;
}
export const EventBridgeRuleTemplateGroupSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TemplateCount: S.optional(S.Number).pipe(T.JsonName("templateCount")),
  }),
).annotations({
  identifier: "EventBridgeRuleTemplateGroupSummary",
}) as any as S.Schema<EventBridgeRuleTemplateGroupSummary>;
export type __listOfEventBridgeRuleTemplateGroupSummary =
  EventBridgeRuleTemplateGroupSummary[];
export const __listOfEventBridgeRuleTemplateGroupSummary = S.Array(
  EventBridgeRuleTemplateGroupSummary,
);
export interface EventBridgeRuleTemplateSummary {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  EventTargetCount?: number;
  EventType?: EventBridgeRuleTemplateEventType;
  GroupId?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const EventBridgeRuleTemplateSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargetCount: S.optional(S.Number).pipe(T.JsonName("eventTargetCount")),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "EventBridgeRuleTemplateSummary",
}) as any as S.Schema<EventBridgeRuleTemplateSummary>;
export type __listOfEventBridgeRuleTemplateSummary =
  EventBridgeRuleTemplateSummary[];
export const __listOfEventBridgeRuleTemplateSummary = S.Array(
  EventBridgeRuleTemplateSummary,
);
export interface InputDeviceMediaConnectSettings {
  FlowArn?: string;
  RoleArn?: string;
  SecretArn?: string;
  SourceName?: string;
}
export const InputDeviceMediaConnectSettings = S.suspend(() =>
  S.Struct({
    FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
    SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
  }),
).annotations({
  identifier: "InputDeviceMediaConnectSettings",
}) as any as S.Schema<InputDeviceMediaConnectSettings>;
export type InputDeviceUhdAudioChannelPairProfile =
  | "DISABLED"
  | "VBR-AAC_HHE-16000"
  | "VBR-AAC_HE-64000"
  | "VBR-AAC_LC-128000"
  | "CBR-AAC_HQ-192000"
  | "CBR-AAC_HQ-256000"
  | "CBR-AAC_HQ-384000"
  | "CBR-AAC_HQ-512000"
  | (string & {});
export const InputDeviceUhdAudioChannelPairProfile = S.String;
export interface InputDeviceUhdAudioChannelPairConfig {
  Id?: number;
  Profile?: InputDeviceUhdAudioChannelPairProfile;
}
export const InputDeviceUhdAudioChannelPairConfig = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number).pipe(T.JsonName("id")),
    Profile: S.optional(InputDeviceUhdAudioChannelPairProfile).pipe(
      T.JsonName("profile"),
    ),
  }),
).annotations({
  identifier: "InputDeviceUhdAudioChannelPairConfig",
}) as any as S.Schema<InputDeviceUhdAudioChannelPairConfig>;
export type __listOfInputDeviceUhdAudioChannelPairConfig =
  InputDeviceUhdAudioChannelPairConfig[];
export const __listOfInputDeviceUhdAudioChannelPairConfig = S.Array(
  InputDeviceUhdAudioChannelPairConfig,
);
export interface InputDeviceUhdSettings {
  ActiveInput?: InputDeviceActiveInput;
  ConfiguredInput?: InputDeviceConfiguredInput;
  DeviceState?: InputDeviceState;
  Framerate?: number;
  Height?: number;
  MaxBitrate?: number;
  ScanType?: InputDeviceScanType;
  Width?: number;
  LatencyMs?: number;
  Codec?: InputDeviceCodec;
  MediaconnectSettings?: InputDeviceMediaConnectSettings;
  AudioChannelPairs?: InputDeviceUhdAudioChannelPairConfig[];
  InputResolution?: string;
}
export const InputDeviceUhdSettings = S.suspend(() =>
  S.Struct({
    ActiveInput: S.optional(InputDeviceActiveInput).pipe(
      T.JsonName("activeInput"),
    ),
    ConfiguredInput: S.optional(InputDeviceConfiguredInput).pipe(
      T.JsonName("configuredInput"),
    ),
    DeviceState: S.optional(InputDeviceState).pipe(T.JsonName("deviceState")),
    Framerate: S.optional(S.Number).pipe(T.JsonName("framerate")),
    Height: S.optional(S.Number).pipe(T.JsonName("height")),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    ScanType: S.optional(InputDeviceScanType).pipe(T.JsonName("scanType")),
    Width: S.optional(S.Number).pipe(T.JsonName("width")),
    LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
    Codec: S.optional(InputDeviceCodec).pipe(T.JsonName("codec")),
    MediaconnectSettings: S.optional(InputDeviceMediaConnectSettings)
      .pipe(T.JsonName("mediaconnectSettings"))
      .annotations({ identifier: "InputDeviceMediaConnectSettings" }),
    AudioChannelPairs: S.optional(
      __listOfInputDeviceUhdAudioChannelPairConfig,
    ).pipe(T.JsonName("audioChannelPairs")),
    InputResolution: S.optional(S.String).pipe(T.JsonName("inputResolution")),
  }),
).annotations({
  identifier: "InputDeviceUhdSettings",
}) as any as S.Schema<InputDeviceUhdSettings>;
export interface InputDeviceSummary {
  Arn?: string;
  ConnectionState?: InputDeviceConnectionState;
  DeviceSettingsSyncState?: DeviceSettingsSyncState;
  DeviceUpdateStatus?: DeviceUpdateStatus;
  HdDeviceSettings?: InputDeviceHdSettings;
  Id?: string;
  MacAddress?: string;
  Name?: string;
  NetworkSettings?: InputDeviceNetworkSettings;
  SerialNumber?: string;
  Type?: InputDeviceType;
  UhdDeviceSettings?: InputDeviceUhdSettings;
  Tags?: { [key: string]: string | undefined };
  AvailabilityZone?: string;
  MedialiveInputArns?: string[];
  OutputType?: InputDeviceOutputType;
}
export const InputDeviceSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ConnectionState: S.optional(InputDeviceConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    DeviceSettingsSyncState: S.optional(DeviceSettingsSyncState).pipe(
      T.JsonName("deviceSettingsSyncState"),
    ),
    DeviceUpdateStatus: S.optional(DeviceUpdateStatus).pipe(
      T.JsonName("deviceUpdateStatus"),
    ),
    HdDeviceSettings: S.optional(InputDeviceHdSettings)
      .pipe(T.JsonName("hdDeviceSettings"))
      .annotations({ identifier: "InputDeviceHdSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(InputDeviceNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "InputDeviceNetworkSettings" }),
    SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
    Type: S.optional(InputDeviceType).pipe(T.JsonName("type")),
    UhdDeviceSettings: S.optional(InputDeviceUhdSettings)
      .pipe(T.JsonName("uhdDeviceSettings"))
      .annotations({ identifier: "InputDeviceUhdSettings" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    MedialiveInputArns: S.optional(__listOf__string).pipe(
      T.JsonName("medialiveInputArns"),
    ),
    OutputType: S.optional(InputDeviceOutputType).pipe(
      T.JsonName("outputType"),
    ),
  }),
).annotations({
  identifier: "InputDeviceSummary",
}) as any as S.Schema<InputDeviceSummary>;
export type __listOfInputDeviceSummary = InputDeviceSummary[];
export const __listOfInputDeviceSummary = S.Array(InputDeviceSummary);
export interface TransferringInputDeviceSummary {
  Id?: string;
  Message?: string;
  TargetCustomerId?: string;
  TransferType?: InputDeviceTransferType;
}
export const TransferringInputDeviceSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    TargetCustomerId: S.optional(S.String).pipe(T.JsonName("targetCustomerId")),
    TransferType: S.optional(InputDeviceTransferType).pipe(
      T.JsonName("transferType"),
    ),
  }),
).annotations({
  identifier: "TransferringInputDeviceSummary",
}) as any as S.Schema<TransferringInputDeviceSummary>;
export type __listOfTransferringInputDeviceSummary =
  TransferringInputDeviceSummary[];
export const __listOfTransferringInputDeviceSummary = S.Array(
  TransferringInputDeviceSummary,
);
export type __listOfInputSecurityGroup = InputSecurityGroup[];
export const __listOfInputSecurityGroup = S.Array(InputSecurityGroup);
export interface MultiplexAlert {
  AlertType?: string;
  ClearedTimestamp?: Date;
  Id?: string;
  Message?: string;
  PipelineId?: string;
  SetTimestamp?: Date;
  State?: MultiplexAlertState;
}
export const MultiplexAlert = S.suspend(() =>
  S.Struct({
    AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
    ClearedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("clearedTimestamp")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
    SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("setTimestamp"),
    ),
    State: S.optional(MultiplexAlertState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "MultiplexAlert",
}) as any as S.Schema<MultiplexAlert>;
export type __listOfMultiplexAlert = MultiplexAlert[];
export const __listOfMultiplexAlert = S.Array(MultiplexAlert);
export interface MultiplexProgramSummary {
  ChannelId?: string;
  ProgramName?: string;
}
export const MultiplexProgramSummary = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  }),
).annotations({
  identifier: "MultiplexProgramSummary",
}) as any as S.Schema<MultiplexProgramSummary>;
export type __listOfMultiplexProgramSummary = MultiplexProgramSummary[];
export const __listOfMultiplexProgramSummary = S.Array(MultiplexProgramSummary);
export interface DescribeNetworkSummary {
  Arn?: string;
  AssociatedClusterIds?: string[];
  Id?: string;
  IpPools?: IpPool[];
  Name?: string;
  Routes?: Route[];
  State?: NetworkState;
}
export const DescribeNetworkSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AssociatedClusterIds: S.optional(__listOf__string).pipe(
      T.JsonName("associatedClusterIds"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
    State: S.optional(NetworkState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DescribeNetworkSummary",
}) as any as S.Schema<DescribeNetworkSummary>;
export type __listOfDescribeNetworkSummary = DescribeNetworkSummary[];
export const __listOfDescribeNetworkSummary = S.Array(DescribeNetworkSummary);
export interface DescribeNodeSummary {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  ManagedInstanceId?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const DescribeNodeSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    ManagedInstanceId: S.optional(S.String).pipe(
      T.JsonName("managedInstanceId"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "DescribeNodeSummary",
}) as any as S.Schema<DescribeNodeSummary>;
export type __listOfDescribeNodeSummary = DescribeNodeSummary[];
export const __listOfDescribeNodeSummary = S.Array(DescribeNodeSummary);
export interface Offering {
  Arn?: string;
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: OfferingDurationUnits;
  FixedPrice?: number;
  OfferingDescription?: string;
  OfferingId?: string;
  OfferingType?: OfferingType;
  Region?: string;
  ResourceSpecification?: ReservationResourceSpecification;
  UsagePrice?: number;
}
export const Offering = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(OfferingDurationUnits).pipe(
      T.JsonName("durationUnits"),
    ),
    FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
    OfferingType: S.optional(OfferingType).pipe(T.JsonName("offeringType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    ResourceSpecification: S.optional(ReservationResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ReservationResourceSpecification" }),
    UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
  }),
).annotations({ identifier: "Offering" }) as any as S.Schema<Offering>;
export type __listOfOffering = Offering[];
export const __listOfOffering = S.Array(Offering);
export type __listOfReservation = Reservation[];
export const __listOfReservation = S.Array(Reservation);
export interface SdiSourceSummary {
  Arn?: string;
  Id?: string;
  Inputs?: string[];
  Mode?: SdiSourceMode;
  Name?: string;
  State?: SdiSourceState;
  Type?: SdiSourceType;
}
export const SdiSourceSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
    Mode: S.optional(SdiSourceMode).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    State: S.optional(SdiSourceState).pipe(T.JsonName("state")),
    Type: S.optional(SdiSourceType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "SdiSourceSummary",
}) as any as S.Schema<SdiSourceSummary>;
export type __listOfSdiSourceSummary = SdiSourceSummary[];
export const __listOfSdiSourceSummary = S.Array(SdiSourceSummary);
export interface SignalMapSummary {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  Id?: string;
  ModifiedAt?: Date;
  MonitorDeploymentStatus?: SignalMapMonitorDeploymentStatus;
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const SignalMapSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorDeploymentStatus: S.optional(SignalMapMonitorDeploymentStatus).pipe(
      T.JsonName("monitorDeploymentStatus"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "SignalMapSummary",
}) as any as S.Schema<SignalMapSummary>;
export type __listOfSignalMapSummary = SignalMapSummary[];
export const __listOfSignalMapSummary = S.Array(SignalMapSummary);
export interface Channel {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings;
  Id?: string;
  InputAttachments?: InputAttachment[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const Channel = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export interface ClusterNetworkSettingsUpdateRequest {
  DefaultRoute?: string;
  InterfaceMappings?: InterfaceMappingUpdateRequest[];
}
export const ClusterNetworkSettingsUpdateRequest = S.suspend(() =>
  S.Struct({
    DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
    InterfaceMappings: S.optional(__listOfInterfaceMappingUpdateRequest).pipe(
      T.JsonName("interfaceMappings"),
    ),
  }),
).annotations({
  identifier: "ClusterNetworkSettingsUpdateRequest",
}) as any as S.Schema<ClusterNetworkSettingsUpdateRequest>;
export interface MulticastSettingsUpdateRequest {
  Sources?: MulticastSourceUpdateRequest[];
}
export const MulticastSettingsUpdateRequest = S.suspend(() =>
  S.Struct({
    Sources: S.optional(__listOfMulticastSourceUpdateRequest).pipe(
      T.JsonName("sources"),
    ),
  }),
).annotations({
  identifier: "MulticastSettingsUpdateRequest",
}) as any as S.Schema<MulticastSettingsUpdateRequest>;
export interface InputDeviceConfigurableSettings {
  ConfiguredInput?: InputDeviceConfiguredInput;
  MaxBitrate?: number;
  LatencyMs?: number;
  Codec?: InputDeviceCodec;
  MediaconnectSettings?: InputDeviceMediaConnectConfigurableSettings;
  AudioChannelPairs?: InputDeviceConfigurableAudioChannelPairConfig[];
  InputResolution?: string;
}
export const InputDeviceConfigurableSettings = S.suspend(() =>
  S.Struct({
    ConfiguredInput: S.optional(InputDeviceConfiguredInput).pipe(
      T.JsonName("configuredInput"),
    ),
    MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
    LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
    Codec: S.optional(InputDeviceCodec).pipe(T.JsonName("codec")),
    MediaconnectSettings: S.optional(
      InputDeviceMediaConnectConfigurableSettings,
    )
      .pipe(T.JsonName("mediaconnectSettings"))
      .annotations({
        identifier: "InputDeviceMediaConnectConfigurableSettings",
      }),
    AudioChannelPairs: S.optional(
      __listOfInputDeviceConfigurableAudioChannelPairConfig,
    ).pipe(T.JsonName("audioChannelPairs")),
    InputResolution: S.optional(S.String).pipe(T.JsonName("inputResolution")),
  }),
).annotations({
  identifier: "InputDeviceConfigurableSettings",
}) as any as S.Schema<InputDeviceConfigurableSettings>;
export type MultiplexPacketIdentifiersMapping = {
  [key: string]: MultiplexProgramPacketIdentifiersMap | undefined;
};
export const MultiplexPacketIdentifiersMapping = S.Record({
  key: S.String,
  value: S.UndefinedOr(MultiplexProgramPacketIdentifiersMap),
});
export interface MultiplexProgram {
  ChannelId?: string;
  MultiplexProgramSettings?: MultiplexProgramSettings;
  PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
  PipelineDetails?: MultiplexProgramPipelineDetail[];
  ProgramName?: string;
}
export const MultiplexProgram = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings)
      .pipe(T.JsonName("multiplexProgramSettings"))
      .annotations({ identifier: "MultiplexProgramSettings" }),
    PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap)
      .pipe(T.JsonName("packetIdentifiersMap"))
      .annotations({ identifier: "MultiplexProgramPacketIdentifiersMap" }),
    PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  }),
).annotations({
  identifier: "MultiplexProgram",
}) as any as S.Schema<MultiplexProgram>;
export interface SrtCallerDecryptionRequest {
  Algorithm?: Algorithm;
  PassphraseSecretArn?: string;
}
export const SrtCallerDecryptionRequest = S.suspend(() =>
  S.Struct({
    Algorithm: S.optional(Algorithm).pipe(T.JsonName("algorithm")),
    PassphraseSecretArn: S.optional(S.String).pipe(
      T.JsonName("passphraseSecretArn"),
    ),
  }),
).annotations({
  identifier: "SrtCallerDecryptionRequest",
}) as any as S.Schema<SrtCallerDecryptionRequest>;
export type ThumbnailType = "UNSPECIFIED" | "CURRENT_ACTIVE" | (string & {});
export const ThumbnailType = S.String;
export interface BatchDeleteResponse {
  Failed?: BatchFailedResultModel[];
  Successful?: BatchSuccessfulResultModel[];
}
export const BatchDeleteResponse = S.suspend(() =>
  S.Struct({
    Failed: S.optional(__listOfBatchFailedResultModel).pipe(
      T.JsonName("failed"),
    ),
    Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
      T.JsonName("successful"),
    ),
  }),
).annotations({
  identifier: "BatchDeleteResponse",
}) as any as S.Schema<BatchDeleteResponse>;
export interface CreateCloudWatchAlarmTemplateResponse {
  Arn?: string;
  ComparisonOperator?: CloudWatchAlarmTemplateComparisonOperator;
  CreatedAt?: Date;
  DatapointsToAlarm?: number;
  Description?: string;
  EvaluationPeriods?: number;
  GroupId?: string;
  Id?: string;
  MetricName?: string;
  ModifiedAt?: Date;
  Name?: string;
  Period?: number;
  Statistic?: CloudWatchAlarmTemplateStatistic;
  Tags?: { [key: string]: string | undefined };
  TargetResourceType?: CloudWatchAlarmTemplateTargetResourceType;
  Threshold?: number;
  TreatMissingData?: CloudWatchAlarmTemplateTreatMissingData;
}
export const CreateCloudWatchAlarmTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ComparisonOperator: S.optional(
      CloudWatchAlarmTemplateComparisonOperator,
    ).pipe(T.JsonName("comparisonOperator")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(CloudWatchAlarmTemplateStatistic).pipe(
      T.JsonName("statistic"),
    ),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.optional(
      CloudWatchAlarmTemplateTargetResourceType,
    ).pipe(T.JsonName("targetResourceType")),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(CloudWatchAlarmTemplateTreatMissingData).pipe(
      T.JsonName("treatMissingData"),
    ),
  }),
).annotations({
  identifier: "CreateCloudWatchAlarmTemplateResponse",
}) as any as S.Schema<CreateCloudWatchAlarmTemplateResponse>;
export interface CreateClusterRequest {
  ClusterType?: ClusterType;
  InstanceRoleArn?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettingsCreateRequest;
  RequestId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettingsCreateRequest)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettingsCreateRequest" }),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface CreateEventBridgeRuleTemplateResponse {
  Arn?: string;
  CreatedAt?: Date;
  Description?: string;
  EventTargets?: (EventBridgeRuleTemplateTarget & {
    Arn: __stringMin1Max2048PatternArn;
  })[];
  EventType?: EventBridgeRuleTemplateEventType;
  GroupId?: string;
  Id?: string;
  ModifiedAt?: Date;
  Name?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateEventBridgeRuleTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(EventBridgeRuleTemplateEventType).pipe(
      T.JsonName("eventType"),
    ),
    GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateEventBridgeRuleTemplateResponse",
}) as any as S.Schema<CreateEventBridgeRuleTemplateResponse>;
export interface CreateInputSecurityGroupResponse {
  SecurityGroup?: InputSecurityGroup;
}
export const CreateInputSecurityGroupResponse = S.suspend(() =>
  S.Struct({
    SecurityGroup: S.optional(InputSecurityGroup)
      .pipe(T.JsonName("securityGroup"))
      .annotations({ identifier: "InputSecurityGroup" }),
  }),
).annotations({
  identifier: "CreateInputSecurityGroupResponse",
}) as any as S.Schema<CreateInputSecurityGroupResponse>;
export interface CreateNetworkResponse {
  Arn?: string;
  AssociatedClusterIds?: string[];
  Id?: string;
  IpPools?: IpPool[];
  Name?: string;
  Routes?: Route[];
  State?: NetworkState;
}
export const CreateNetworkResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AssociatedClusterIds: S.optional(__listOf__string).pipe(
      T.JsonName("associatedClusterIds"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
    State: S.optional(NetworkState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "CreateNetworkResponse",
}) as any as S.Schema<CreateNetworkResponse>;
export interface CreateNodeResponse {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const CreateNodeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "CreateNodeResponse",
}) as any as S.Schema<CreateNodeResponse>;
export interface CreateNodeRegistrationScriptResponse {
  NodeRegistrationScript?: string;
}
export const CreateNodeRegistrationScriptResponse = S.suspend(() =>
  S.Struct({
    NodeRegistrationScript: S.optional(S.String).pipe(
      T.JsonName("nodeRegistrationScript"),
    ),
  }),
).annotations({
  identifier: "CreateNodeRegistrationScriptResponse",
}) as any as S.Schema<CreateNodeRegistrationScriptResponse>;
export interface CreatePartnerInputResponse {
  Input?: Input & {
    MulticastSettings: MulticastSettings & {
      Sources: (MulticastSource & { Url: string })[];
    };
  };
}
export const CreatePartnerInputResponse = S.suspend(() =>
  S.Struct({
    Input: S.optional(Input)
      .pipe(T.JsonName("input"))
      .annotations({ identifier: "Input" }),
  }),
).annotations({
  identifier: "CreatePartnerInputResponse",
}) as any as S.Schema<CreatePartnerInputResponse>;
export interface CreateSdiSourceResponse {
  SdiSource?: SdiSource;
}
export const CreateSdiSourceResponse = S.suspend(() =>
  S.Struct({
    SdiSource: S.optional(SdiSource)
      .pipe(T.JsonName("sdiSource"))
      .annotations({ identifier: "SdiSource" }),
  }),
).annotations({
  identifier: "CreateSdiSourceResponse",
}) as any as S.Schema<CreateSdiSourceResponse>;
export interface DeleteMultiplexProgramResponse {
  ChannelId?: string;
  MultiplexProgramSettings?: MultiplexProgramSettings & {
    ProgramNumber: __integerMin0Max65535;
    ServiceDescriptor: MultiplexProgramServiceDescriptor & {
      ProviderName: __stringMax256;
      ServiceName: __stringMax256;
    };
  };
  PacketIdentifiersMap?: MultiplexProgramPacketIdentifiersMap;
  PipelineDetails?: MultiplexProgramPipelineDetail[];
  ProgramName?: string;
}
export const DeleteMultiplexProgramResponse = S.suspend(() =>
  S.Struct({
    ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings)
      .pipe(T.JsonName("multiplexProgramSettings"))
      .annotations({ identifier: "MultiplexProgramSettings" }),
    PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap)
      .pipe(T.JsonName("packetIdentifiersMap"))
      .annotations({ identifier: "MultiplexProgramPacketIdentifiersMap" }),
    PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
  }),
).annotations({
  identifier: "DeleteMultiplexProgramResponse",
}) as any as S.Schema<DeleteMultiplexProgramResponse>;
export interface DeleteNetworkResponse {
  Arn?: string;
  AssociatedClusterIds?: string[];
  Id?: string;
  IpPools?: IpPool[];
  Name?: string;
  Routes?: Route[];
  State?: NetworkState;
}
export const DeleteNetworkResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AssociatedClusterIds: S.optional(__listOf__string).pipe(
      T.JsonName("associatedClusterIds"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
    State: S.optional(NetworkState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteNetworkResponse",
}) as any as S.Schema<DeleteNetworkResponse>;
export interface DeleteNodeResponse {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const DeleteNodeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "DeleteNodeResponse",
}) as any as S.Schema<DeleteNodeResponse>;
export interface DeleteReservationResponse {
  Arn?: string;
  Count?: number;
  CurrencyCode?: string;
  Duration?: number;
  DurationUnits?: OfferingDurationUnits;
  End?: string;
  FixedPrice?: number;
  Name?: string;
  OfferingDescription?: string;
  OfferingId?: string;
  OfferingType?: OfferingType;
  Region?: string;
  RenewalSettings?: RenewalSettings;
  ReservationId?: string;
  ResourceSpecification?: ReservationResourceSpecification;
  Start?: string;
  State?: ReservationState;
  Tags?: { [key: string]: string | undefined };
  UsagePrice?: number;
}
export const DeleteReservationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Count: S.optional(S.Number).pipe(T.JsonName("count")),
    CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
    Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
    DurationUnits: S.optional(OfferingDurationUnits).pipe(
      T.JsonName("durationUnits"),
    ),
    End: S.optional(S.String).pipe(T.JsonName("end")),
    FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OfferingDescription: S.optional(S.String).pipe(
      T.JsonName("offeringDescription"),
    ),
    OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
    OfferingType: S.optional(OfferingType).pipe(T.JsonName("offeringType")),
    Region: S.optional(S.String).pipe(T.JsonName("region")),
    RenewalSettings: S.optional(RenewalSettings)
      .pipe(T.JsonName("renewalSettings"))
      .annotations({ identifier: "RenewalSettings" }),
    ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
    ResourceSpecification: S.optional(ReservationResourceSpecification)
      .pipe(T.JsonName("resourceSpecification"))
      .annotations({ identifier: "ReservationResourceSpecification" }),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    State: S.optional(ReservationState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
  }),
).annotations({
  identifier: "DeleteReservationResponse",
}) as any as S.Schema<DeleteReservationResponse>;
export interface DescribeInputSecurityGroupResponse {
  Arn?: string;
  Id?: string;
  Inputs?: string[];
  State?: InputSecurityGroupState;
  Tags?: { [key: string]: string | undefined };
  WhitelistRules?: InputWhitelistRule[];
}
export const DescribeInputSecurityGroupResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
    State: S.optional(InputSecurityGroupState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRule).pipe(
      T.JsonName("whitelistRules"),
    ),
  }),
).annotations({
  identifier: "DescribeInputSecurityGroupResponse",
}) as any as S.Schema<DescribeInputSecurityGroupResponse>;
export interface ListAlertsResponse {
  Alerts?: ChannelAlert[];
  NextToken?: string;
}
export const ListAlertsResponse = S.suspend(() =>
  S.Struct({
    Alerts: S.optional(__listOfChannelAlert).pipe(T.JsonName("alerts")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListAlertsResponse",
}) as any as S.Schema<ListAlertsResponse>;
export interface ListChannelPlacementGroupsResponse {
  ChannelPlacementGroups?: DescribeChannelPlacementGroupSummary[];
  NextToken?: string;
}
export const ListChannelPlacementGroupsResponse = S.suspend(() =>
  S.Struct({
    ChannelPlacementGroups: S.optional(
      __listOfDescribeChannelPlacementGroupSummary,
    ).pipe(T.JsonName("channelPlacementGroups")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListChannelPlacementGroupsResponse",
}) as any as S.Schema<ListChannelPlacementGroupsResponse>;
export interface ListChannelsResponse {
  Channels?: (ChannelSummary & {
    InputAttachments: (InputAttachment & {
      AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
        SecondaryInputId: string;
        FailoverConditions: (FailoverCondition & {
          FailoverConditionSettings: FailoverConditionSettings & {
            AudioSilenceSettings: AudioSilenceFailoverSettings & {
              AudioSelectorName: string;
            };
          };
        })[];
      };
      InputSettings: InputSettings & {
        AudioSelectors: (AudioSelector & {
          Name: __stringMin1;
          SelectorSettings: AudioSelectorSettings & {
            AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
              GroupId: __stringMin1;
              Name: __stringMin1;
            };
            AudioLanguageSelection: AudioLanguageSelection & {
              LanguageCode: string;
            };
            AudioPidSelection: AudioPidSelection & {
              Pid: __integerMin0Max8191;
            };
            AudioTrackSelection: AudioTrackSelection & {
              Tracks: (AudioTrack & { Track: __integerMin1 })[];
              DolbyEDecode: AudioDolbyEDecode & {
                ProgramSelection: DolbyEProgramSelection;
              };
            };
          };
        })[];
        CaptionSelectors: (CaptionSelector & {
          Name: __stringMin1;
          SelectorSettings: CaptionSelectorSettings & {
            TeletextSourceSettings: TeletextSourceSettings & {
              OutputRectangle: CaptionRectangle & {
                Height: __doubleMin0Max100;
                LeftOffset: __doubleMin0Max100;
                TopOffset: __doubleMin0Max100;
                Width: __doubleMin0Max100;
              };
            };
          };
        })[];
      };
    })[];
  })[];
  NextToken?: string;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(__listOfChannelSummary).pipe(T.JsonName("channels")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface ListCloudWatchAlarmTemplateGroupsResponse {
  CloudWatchAlarmTemplateGroups?: (CloudWatchAlarmTemplateGroupSummary & {
    Arn: __stringPatternArnMedialiveCloudwatchAlarmTemplateGroup;
    CreatedAt: __timestampIso8601;
    Id: __stringMin7Max11PatternAws097;
    Name: __stringMin1Max255PatternS;
    TemplateCount: number;
  })[];
  NextToken?: string;
}
export const ListCloudWatchAlarmTemplateGroupsResponse = S.suspend(() =>
  S.Struct({
    CloudWatchAlarmTemplateGroups: S.optional(
      __listOfCloudWatchAlarmTemplateGroupSummary,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroups")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCloudWatchAlarmTemplateGroupsResponse",
}) as any as S.Schema<ListCloudWatchAlarmTemplateGroupsResponse>;
export interface ListCloudWatchAlarmTemplatesResponse {
  CloudWatchAlarmTemplates?: (CloudWatchAlarmTemplateSummary & {
    Arn: __stringPatternArnMedialiveCloudwatchAlarmTemplate;
    ComparisonOperator: CloudWatchAlarmTemplateComparisonOperator;
    CreatedAt: __timestampIso8601;
    EvaluationPeriods: __integerMin1;
    GroupId: __stringMin7Max11PatternAws097;
    Id: __stringMin7Max11PatternAws097;
    MetricName: __stringMax64;
    Name: __stringMin1Max255PatternS;
    Period: __integerMin10Max86400;
    Statistic: CloudWatchAlarmTemplateStatistic;
    TargetResourceType: CloudWatchAlarmTemplateTargetResourceType;
    Threshold: number;
    TreatMissingData: CloudWatchAlarmTemplateTreatMissingData;
  })[];
  NextToken?: string;
}
export const ListCloudWatchAlarmTemplatesResponse = S.suspend(() =>
  S.Struct({
    CloudWatchAlarmTemplates: S.optional(
      __listOfCloudWatchAlarmTemplateSummary,
    ).pipe(T.JsonName("cloudWatchAlarmTemplates")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCloudWatchAlarmTemplatesResponse",
}) as any as S.Schema<ListCloudWatchAlarmTemplatesResponse>;
export interface ListClusterAlertsResponse {
  Alerts?: ClusterAlert[];
  NextToken?: string;
}
export const ListClusterAlertsResponse = S.suspend(() =>
  S.Struct({
    Alerts: S.optional(__listOfClusterAlert).pipe(T.JsonName("alerts")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClusterAlertsResponse",
}) as any as S.Schema<ListClusterAlertsResponse>;
export interface ListClustersResponse {
  Clusters?: DescribeClusterSummary[];
  NextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({
    Clusters: S.optional(__listOfDescribeClusterSummary).pipe(
      T.JsonName("clusters"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ListEventBridgeRuleTemplateGroupsResponse {
  EventBridgeRuleTemplateGroups?: (EventBridgeRuleTemplateGroupSummary & {
    Arn: __stringPatternArnMedialiveEventbridgeRuleTemplateGroup;
    CreatedAt: __timestampIso8601;
    Id: __stringMin7Max11PatternAws097;
    Name: __stringMin1Max255PatternS;
    TemplateCount: number;
  })[];
  NextToken?: string;
}
export const ListEventBridgeRuleTemplateGroupsResponse = S.suspend(() =>
  S.Struct({
    EventBridgeRuleTemplateGroups: S.optional(
      __listOfEventBridgeRuleTemplateGroupSummary,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroups")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListEventBridgeRuleTemplateGroupsResponse",
}) as any as S.Schema<ListEventBridgeRuleTemplateGroupsResponse>;
export interface ListEventBridgeRuleTemplatesResponse {
  EventBridgeRuleTemplates?: (EventBridgeRuleTemplateSummary & {
    Arn: __stringPatternArnMedialiveEventbridgeRuleTemplate;
    CreatedAt: __timestampIso8601;
    EventTargetCount: __integerMax5;
    EventType: EventBridgeRuleTemplateEventType;
    GroupId: __stringMin7Max11PatternAws097;
    Id: __stringMin7Max11PatternAws097;
    Name: __stringMin1Max255PatternS;
  })[];
  NextToken?: string;
}
export const ListEventBridgeRuleTemplatesResponse = S.suspend(() =>
  S.Struct({
    EventBridgeRuleTemplates: S.optional(
      __listOfEventBridgeRuleTemplateSummary,
    ).pipe(T.JsonName("eventBridgeRuleTemplates")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListEventBridgeRuleTemplatesResponse",
}) as any as S.Schema<ListEventBridgeRuleTemplatesResponse>;
export interface ListInputDevicesResponse {
  InputDevices?: InputDeviceSummary[];
  NextToken?: string;
}
export const ListInputDevicesResponse = S.suspend(() =>
  S.Struct({
    InputDevices: S.optional(__listOfInputDeviceSummary).pipe(
      T.JsonName("inputDevices"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInputDevicesResponse",
}) as any as S.Schema<ListInputDevicesResponse>;
export interface ListInputDeviceTransfersResponse {
  InputDeviceTransfers?: TransferringInputDeviceSummary[];
  NextToken?: string;
}
export const ListInputDeviceTransfersResponse = S.suspend(() =>
  S.Struct({
    InputDeviceTransfers: S.optional(
      __listOfTransferringInputDeviceSummary,
    ).pipe(T.JsonName("inputDeviceTransfers")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInputDeviceTransfersResponse",
}) as any as S.Schema<ListInputDeviceTransfersResponse>;
export interface ListInputSecurityGroupsResponse {
  InputSecurityGroups?: InputSecurityGroup[];
  NextToken?: string;
}
export const ListInputSecurityGroupsResponse = S.suspend(() =>
  S.Struct({
    InputSecurityGroups: S.optional(__listOfInputSecurityGroup).pipe(
      T.JsonName("inputSecurityGroups"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInputSecurityGroupsResponse",
}) as any as S.Schema<ListInputSecurityGroupsResponse>;
export interface ListMultiplexAlertsResponse {
  Alerts?: MultiplexAlert[];
  NextToken?: string;
}
export const ListMultiplexAlertsResponse = S.suspend(() =>
  S.Struct({
    Alerts: S.optional(__listOfMultiplexAlert).pipe(T.JsonName("alerts")),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMultiplexAlertsResponse",
}) as any as S.Schema<ListMultiplexAlertsResponse>;
export interface ListMultiplexProgramsResponse {
  MultiplexPrograms?: MultiplexProgramSummary[];
  NextToken?: string;
}
export const ListMultiplexProgramsResponse = S.suspend(() =>
  S.Struct({
    MultiplexPrograms: S.optional(__listOfMultiplexProgramSummary).pipe(
      T.JsonName("multiplexPrograms"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMultiplexProgramsResponse",
}) as any as S.Schema<ListMultiplexProgramsResponse>;
export interface ListNetworksResponse {
  Networks?: DescribeNetworkSummary[];
  NextToken?: string;
}
export const ListNetworksResponse = S.suspend(() =>
  S.Struct({
    Networks: S.optional(__listOfDescribeNetworkSummary).pipe(
      T.JsonName("networks"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListNetworksResponse",
}) as any as S.Schema<ListNetworksResponse>;
export interface ListNodesResponse {
  NextToken?: string;
  Nodes?: DescribeNodeSummary[];
}
export const ListNodesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Nodes: S.optional(__listOfDescribeNodeSummary).pipe(T.JsonName("nodes")),
  }),
).annotations({
  identifier: "ListNodesResponse",
}) as any as S.Schema<ListNodesResponse>;
export interface ListOfferingsResponse {
  NextToken?: string;
  Offerings?: Offering[];
}
export const ListOfferingsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Offerings: S.optional(__listOfOffering).pipe(T.JsonName("offerings")),
  }),
).annotations({
  identifier: "ListOfferingsResponse",
}) as any as S.Schema<ListOfferingsResponse>;
export interface ListReservationsResponse {
  NextToken?: string;
  Reservations?: Reservation[];
}
export const ListReservationsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    Reservations: S.optional(__listOfReservation).pipe(
      T.JsonName("reservations"),
    ),
  }),
).annotations({
  identifier: "ListReservationsResponse",
}) as any as S.Schema<ListReservationsResponse>;
export interface ListSdiSourcesResponse {
  NextToken?: string;
  SdiSources?: SdiSourceSummary[];
}
export const ListSdiSourcesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    SdiSources: S.optional(__listOfSdiSourceSummary).pipe(
      T.JsonName("sdiSources"),
    ),
  }),
).annotations({
  identifier: "ListSdiSourcesResponse",
}) as any as S.Schema<ListSdiSourcesResponse>;
export interface ListSignalMapsResponse {
  NextToken?: string;
  SignalMaps?: (SignalMapSummary & {
    Arn: __stringPatternArnMedialiveSignalMap;
    CreatedAt: __timestampIso8601;
    Id: __stringMin7Max11PatternAws097;
    MonitorDeploymentStatus: SignalMapMonitorDeploymentStatus;
    Name: __stringMin1Max255PatternS;
    Status: SignalMapStatus;
  })[];
}
export const ListSignalMapsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    SignalMaps: S.optional(__listOfSignalMapSummary).pipe(
      T.JsonName("signalMaps"),
    ),
  }),
).annotations({
  identifier: "ListSignalMapsResponse",
}) as any as S.Schema<ListSignalMapsResponse>;
export interface PurchaseOfferingResponse {
  Reservation?: Reservation;
}
export const PurchaseOfferingResponse = S.suspend(() =>
  S.Struct({
    Reservation: S.optional(Reservation)
      .pipe(T.JsonName("reservation"))
      .annotations({ identifier: "Reservation" }),
  }),
).annotations({
  identifier: "PurchaseOfferingResponse",
}) as any as S.Schema<PurchaseOfferingResponse>;
export interface UpdateChannelResponse {
  Channel?: Channel & {
    EncoderSettings: EncoderSettings & {
      AudioDescriptions: (AudioDescription & {
        AudioSelectorName: string;
        Name: __stringMax255;
        AudioWatermarkingSettings: AudioWatermarkSettings & {
          NielsenWatermarksSettings: NielsenWatermarksSettings & {
            NielsenCbetSettings: NielsenCBET & {
              CbetCheckDigitString: __stringMin2Max2;
              CbetStepaside: NielsenWatermarksCbetStepaside;
              Csid: __stringMin1Max7;
            };
            NielsenNaesIiNwSettings: NielsenNaesIiNw & {
              CheckDigitString: __stringMin2Max2;
              Sid: __doubleMin1Max65535;
            };
          };
        };
        RemixSettings: RemixSettings & {
          ChannelMappings: (AudioChannelMapping & {
            InputChannelLevels: (InputChannelLevel & {
              Gain: __integerMinNegative60Max6;
              InputChannel: __integerMin0Max15;
            })[];
            OutputChannel: __integerMin0Max7;
          })[];
        };
      })[];
      OutputGroups: (OutputGroup & {
        OutputGroupSettings: OutputGroupSettings & {
          ArchiveGroupSettings: ArchiveGroupSettings & {
            Destination: OutputLocationRef;
          };
          FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
            Destination: OutputLocationRef;
          };
          HlsGroupSettings: HlsGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            KeyProviderSettings: KeyProviderSettings & {
              StaticKeySettings: StaticKeySettings & {
                StaticKeyValue: __stringMin32Max32;
                KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
              };
            };
          };
          MediaPackageGroupSettings: MediaPackageGroupSettings & {
            Destination: OutputLocationRef;
            MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
              CaptionLanguageMappings: (CaptionLanguageMapping & {
                CaptionChannel: __integerMin1Max4;
                LanguageCode: __stringMin3Max3;
                LanguageDescription: __stringMin1;
              })[];
              AdditionalDestinations: (MediaPackageAdditionalDestinations & {
                Destination: OutputLocationRef;
              })[];
            };
          };
          MsSmoothGroupSettings: MsSmoothGroupSettings & {
            Destination: OutputLocationRef;
          };
          CmafIngestGroupSettings: CmafIngestGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
            })[];
            AdditionalDestinations: (AdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        Outputs: (Output & {
          OutputSettings: OutputSettings & {
            ArchiveOutputSettings: ArchiveOutputSettings & {
              ContainerSettings: ArchiveContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
            };
            HlsOutputSettings: HlsOutputSettings & {
              HlsSettings: HlsSettings & {
                AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                  AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
                };
                StandardHlsSettings: StandardHlsSettings & {
                  M3u8Settings: M3u8Settings;
                };
              };
            };
            MultiplexOutputSettings: MultiplexOutputSettings & {
              Destination: OutputLocationRef;
            };
            RtmpOutputSettings: RtmpOutputSettings & {
              Destination: OutputLocationRef;
            };
            UdpOutputSettings: UdpOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
            SrtOutputSettings: SrtOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
          };
        })[];
      })[];
      TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
      VideoDescriptions: (VideoDescription & {
        Name: string;
        CodecSettings: VideoCodecSettings & {
          FrameCaptureSettings: FrameCaptureSettings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H264Settings: H264Settings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H265Settings: H265Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Mpeg2Settings: Mpeg2Settings & {
            FramerateDenominator: __integerMin1;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Av1Settings: Av1Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
        };
      })[];
      AvailBlanking: AvailBlanking & {
        AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
      };
      AvailConfiguration: AvailConfiguration & {
        AvailSettings: AvailSettings & {
          Esam: Esam & {
            AcquisitionPointId: __stringMax256;
            PoisEndpoint: __stringMax2048;
          };
        };
      };
      BlackoutSlate: BlackoutSlate & {
        BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
        NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
      };
      CaptionDescriptions: (CaptionDescription & {
        CaptionSelectorName: string;
        Name: string;
        DestinationSettings: CaptionDestinationSettings & {
          BurnInDestinationSettings: BurnInDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
          DvbSubDestinationSettings: DvbSubDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
        };
      })[];
      GlobalConfiguration: GlobalConfiguration & {
        InputLossBehavior: InputLossBehavior & {
          InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
        };
      };
      MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
        MotionGraphicsSettings: MotionGraphicsSettings;
      };
      ThumbnailConfiguration: ThumbnailConfiguration & {
        State: ThumbnailState;
      };
      ColorCorrectionSettings: ColorCorrectionSettings & {
        GlobalColorCorrections: (ColorCorrection & {
          InputColorSpace: ColorSpace;
          OutputColorSpace: ColorSpace;
          Uri: string;
        })[];
      };
    };
    InputAttachments: (InputAttachment & {
      AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
        SecondaryInputId: string;
        FailoverConditions: (FailoverCondition & {
          FailoverConditionSettings: FailoverConditionSettings & {
            AudioSilenceSettings: AudioSilenceFailoverSettings & {
              AudioSelectorName: string;
            };
          };
        })[];
      };
      InputSettings: InputSettings & {
        AudioSelectors: (AudioSelector & {
          Name: __stringMin1;
          SelectorSettings: AudioSelectorSettings & {
            AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
              GroupId: __stringMin1;
              Name: __stringMin1;
            };
            AudioLanguageSelection: AudioLanguageSelection & {
              LanguageCode: string;
            };
            AudioPidSelection: AudioPidSelection & {
              Pid: __integerMin0Max8191;
            };
            AudioTrackSelection: AudioTrackSelection & {
              Tracks: (AudioTrack & { Track: __integerMin1 })[];
              DolbyEDecode: AudioDolbyEDecode & {
                ProgramSelection: DolbyEProgramSelection;
              };
            };
          };
        })[];
        CaptionSelectors: (CaptionSelector & {
          Name: __stringMin1;
          SelectorSettings: CaptionSelectorSettings & {
            TeletextSourceSettings: TeletextSourceSettings & {
              OutputRectangle: CaptionRectangle & {
                Height: __doubleMin0Max100;
                LeftOffset: __doubleMin0Max100;
                TopOffset: __doubleMin0Max100;
                Width: __doubleMin0Max100;
              };
            };
          };
        })[];
      };
    })[];
  };
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({
    Channel: S.optional(Channel)
      .pipe(T.JsonName("channel"))
      .annotations({ identifier: "Channel" }),
  }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface UpdateChannelClassResponse {
  Channel?: Channel & {
    EncoderSettings: EncoderSettings & {
      AudioDescriptions: (AudioDescription & {
        AudioSelectorName: string;
        Name: __stringMax255;
        AudioWatermarkingSettings: AudioWatermarkSettings & {
          NielsenWatermarksSettings: NielsenWatermarksSettings & {
            NielsenCbetSettings: NielsenCBET & {
              CbetCheckDigitString: __stringMin2Max2;
              CbetStepaside: NielsenWatermarksCbetStepaside;
              Csid: __stringMin1Max7;
            };
            NielsenNaesIiNwSettings: NielsenNaesIiNw & {
              CheckDigitString: __stringMin2Max2;
              Sid: __doubleMin1Max65535;
            };
          };
        };
        RemixSettings: RemixSettings & {
          ChannelMappings: (AudioChannelMapping & {
            InputChannelLevels: (InputChannelLevel & {
              Gain: __integerMinNegative60Max6;
              InputChannel: __integerMin0Max15;
            })[];
            OutputChannel: __integerMin0Max7;
          })[];
        };
      })[];
      OutputGroups: (OutputGroup & {
        OutputGroupSettings: OutputGroupSettings & {
          ArchiveGroupSettings: ArchiveGroupSettings & {
            Destination: OutputLocationRef;
          };
          FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
            Destination: OutputLocationRef;
          };
          HlsGroupSettings: HlsGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            KeyProviderSettings: KeyProviderSettings & {
              StaticKeySettings: StaticKeySettings & {
                StaticKeyValue: __stringMin32Max32;
                KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
              };
            };
          };
          MediaPackageGroupSettings: MediaPackageGroupSettings & {
            Destination: OutputLocationRef;
            MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
              CaptionLanguageMappings: (CaptionLanguageMapping & {
                CaptionChannel: __integerMin1Max4;
                LanguageCode: __stringMin3Max3;
                LanguageDescription: __stringMin1;
              })[];
              AdditionalDestinations: (MediaPackageAdditionalDestinations & {
                Destination: OutputLocationRef;
              })[];
            };
          };
          MsSmoothGroupSettings: MsSmoothGroupSettings & {
            Destination: OutputLocationRef;
          };
          CmafIngestGroupSettings: CmafIngestGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
            })[];
            AdditionalDestinations: (AdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        Outputs: (Output & {
          OutputSettings: OutputSettings & {
            ArchiveOutputSettings: ArchiveOutputSettings & {
              ContainerSettings: ArchiveContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
            };
            HlsOutputSettings: HlsOutputSettings & {
              HlsSettings: HlsSettings & {
                AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                  AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
                };
                StandardHlsSettings: StandardHlsSettings & {
                  M3u8Settings: M3u8Settings;
                };
              };
            };
            MultiplexOutputSettings: MultiplexOutputSettings & {
              Destination: OutputLocationRef;
            };
            RtmpOutputSettings: RtmpOutputSettings & {
              Destination: OutputLocationRef;
            };
            UdpOutputSettings: UdpOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
            SrtOutputSettings: SrtOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
          };
        })[];
      })[];
      TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
      VideoDescriptions: (VideoDescription & {
        Name: string;
        CodecSettings: VideoCodecSettings & {
          FrameCaptureSettings: FrameCaptureSettings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H264Settings: H264Settings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H265Settings: H265Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Mpeg2Settings: Mpeg2Settings & {
            FramerateDenominator: __integerMin1;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Av1Settings: Av1Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
        };
      })[];
      AvailBlanking: AvailBlanking & {
        AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
      };
      AvailConfiguration: AvailConfiguration & {
        AvailSettings: AvailSettings & {
          Esam: Esam & {
            AcquisitionPointId: __stringMax256;
            PoisEndpoint: __stringMax2048;
          };
        };
      };
      BlackoutSlate: BlackoutSlate & {
        BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
        NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
      };
      CaptionDescriptions: (CaptionDescription & {
        CaptionSelectorName: string;
        Name: string;
        DestinationSettings: CaptionDestinationSettings & {
          BurnInDestinationSettings: BurnInDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
          DvbSubDestinationSettings: DvbSubDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
        };
      })[];
      GlobalConfiguration: GlobalConfiguration & {
        InputLossBehavior: InputLossBehavior & {
          InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
        };
      };
      MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
        MotionGraphicsSettings: MotionGraphicsSettings;
      };
      ThumbnailConfiguration: ThumbnailConfiguration & {
        State: ThumbnailState;
      };
      ColorCorrectionSettings: ColorCorrectionSettings & {
        GlobalColorCorrections: (ColorCorrection & {
          InputColorSpace: ColorSpace;
          OutputColorSpace: ColorSpace;
          Uri: string;
        })[];
      };
    };
    InputAttachments: (InputAttachment & {
      AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
        SecondaryInputId: string;
        FailoverConditions: (FailoverCondition & {
          FailoverConditionSettings: FailoverConditionSettings & {
            AudioSilenceSettings: AudioSilenceFailoverSettings & {
              AudioSelectorName: string;
            };
          };
        })[];
      };
      InputSettings: InputSettings & {
        AudioSelectors: (AudioSelector & {
          Name: __stringMin1;
          SelectorSettings: AudioSelectorSettings & {
            AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
              GroupId: __stringMin1;
              Name: __stringMin1;
            };
            AudioLanguageSelection: AudioLanguageSelection & {
              LanguageCode: string;
            };
            AudioPidSelection: AudioPidSelection & {
              Pid: __integerMin0Max8191;
            };
            AudioTrackSelection: AudioTrackSelection & {
              Tracks: (AudioTrack & { Track: __integerMin1 })[];
              DolbyEDecode: AudioDolbyEDecode & {
                ProgramSelection: DolbyEProgramSelection;
              };
            };
          };
        })[];
        CaptionSelectors: (CaptionSelector & {
          Name: __stringMin1;
          SelectorSettings: CaptionSelectorSettings & {
            TeletextSourceSettings: TeletextSourceSettings & {
              OutputRectangle: CaptionRectangle & {
                Height: __doubleMin0Max100;
                LeftOffset: __doubleMin0Max100;
                TopOffset: __doubleMin0Max100;
                Width: __doubleMin0Max100;
              };
            };
          };
        })[];
      };
    })[];
  };
}
export const UpdateChannelClassResponse = S.suspend(() =>
  S.Struct({
    Channel: S.optional(Channel)
      .pipe(T.JsonName("channel"))
      .annotations({ identifier: "Channel" }),
  }),
).annotations({
  identifier: "UpdateChannelClassResponse",
}) as any as S.Schema<UpdateChannelClassResponse>;
export interface UpdateClusterRequest {
  ClusterId: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettingsUpdateRequest;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettingsUpdateRequest)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettingsUpdateRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/clusters/{ClusterId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface SrtCallerSourceRequest {
  Decryption?: SrtCallerDecryptionRequest;
  MinimumLatency?: number;
  SrtListenerAddress?: string;
  SrtListenerPort?: string;
  StreamId?: string;
}
export const SrtCallerSourceRequest = S.suspend(() =>
  S.Struct({
    Decryption: S.optional(SrtCallerDecryptionRequest)
      .pipe(T.JsonName("decryption"))
      .annotations({ identifier: "SrtCallerDecryptionRequest" }),
    MinimumLatency: S.optional(S.Number).pipe(T.JsonName("minimumLatency")),
    SrtListenerAddress: S.optional(S.String).pipe(
      T.JsonName("srtListenerAddress"),
    ),
    SrtListenerPort: S.optional(S.String).pipe(T.JsonName("srtListenerPort")),
    StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  }),
).annotations({
  identifier: "SrtCallerSourceRequest",
}) as any as S.Schema<SrtCallerSourceRequest>;
export type __listOfSrtCallerSourceRequest = SrtCallerSourceRequest[];
export const __listOfSrtCallerSourceRequest = S.Array(SrtCallerSourceRequest);
export interface SrtSettingsRequest {
  SrtCallerSources?: SrtCallerSourceRequest[];
}
export const SrtSettingsRequest = S.suspend(() =>
  S.Struct({
    SrtCallerSources: S.optional(__listOfSrtCallerSourceRequest).pipe(
      T.JsonName("srtCallerSources"),
    ),
  }),
).annotations({
  identifier: "SrtSettingsRequest",
}) as any as S.Schema<SrtSettingsRequest>;
export interface UpdateInputRequest {
  Destinations?: InputDestinationRequest[];
  InputDevices?: InputDeviceRequest[];
  InputId: string;
  InputSecurityGroups?: string[];
  MediaConnectFlows?: MediaConnectFlowRequest[];
  Name?: string;
  RoleArn?: string;
  Sources?: InputSourceRequest[];
  SrtSettings?: SrtSettingsRequest;
  MulticastSettings?: MulticastSettingsUpdateRequest;
  Smpte2110ReceiverGroupSettings?: Smpte2110ReceiverGroupSettings;
  SdiSources?: string[];
  SpecialRouterSettings?: SpecialRouterSettings;
}
export const UpdateInputRequest = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(__listOfInputDestinationRequest).pipe(
      T.JsonName("destinations"),
    ),
    InputDevices: S.optional(__listOfInputDeviceRequest).pipe(
      T.JsonName("inputDevices"),
    ),
    InputId: S.String.pipe(T.HttpLabel("InputId")),
    InputSecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroups"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlowRequest).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Sources: S.optional(__listOfInputSourceRequest).pipe(T.JsonName("sources")),
    SrtSettings: S.optional(SrtSettingsRequest)
      .pipe(T.JsonName("srtSettings"))
      .annotations({ identifier: "SrtSettingsRequest" }),
    MulticastSettings: S.optional(MulticastSettingsUpdateRequest)
      .pipe(T.JsonName("multicastSettings"))
      .annotations({ identifier: "MulticastSettingsUpdateRequest" }),
    Smpte2110ReceiverGroupSettings: S.optional(Smpte2110ReceiverGroupSettings)
      .pipe(T.JsonName("smpte2110ReceiverGroupSettings"))
      .annotations({ identifier: "Smpte2110ReceiverGroupSettings" }),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    SpecialRouterSettings: S.optional(SpecialRouterSettings)
      .pipe(T.JsonName("specialRouterSettings"))
      .annotations({ identifier: "SpecialRouterSettings" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/inputs/{InputId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInputRequest",
}) as any as S.Schema<UpdateInputRequest>;
export interface UpdateInputDeviceRequest {
  HdDeviceSettings?: InputDeviceConfigurableSettings;
  InputDeviceId: string;
  Name?: string;
  UhdDeviceSettings?: InputDeviceConfigurableSettings;
  AvailabilityZone?: string;
}
export const UpdateInputDeviceRequest = S.suspend(() =>
  S.Struct({
    HdDeviceSettings: S.optional(InputDeviceConfigurableSettings)
      .pipe(T.JsonName("hdDeviceSettings"))
      .annotations({ identifier: "InputDeviceConfigurableSettings" }),
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    UhdDeviceSettings: S.optional(InputDeviceConfigurableSettings)
      .pipe(T.JsonName("uhdDeviceSettings"))
      .annotations({ identifier: "InputDeviceConfigurableSettings" }),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/inputDevices/{InputDeviceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInputDeviceRequest",
}) as any as S.Schema<UpdateInputDeviceRequest>;
export interface UpdateMultiplexRequest {
  MultiplexId: string;
  MultiplexSettings?: MultiplexSettings;
  Name?: string;
  PacketIdentifiersMapping?: {
    [key: string]: MultiplexProgramPacketIdentifiersMap | undefined;
  };
}
export const UpdateMultiplexRequest = S.suspend(() =>
  S.Struct({
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PacketIdentifiersMapping: S.optional(
      MultiplexPacketIdentifiersMapping,
    ).pipe(T.JsonName("packetIdentifiersMapping")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/multiplexes/{MultiplexId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMultiplexRequest",
}) as any as S.Schema<UpdateMultiplexRequest>;
export interface UpdateMultiplexProgramResponse {
  MultiplexProgram?: MultiplexProgram & {
    MultiplexProgramSettings: MultiplexProgramSettings & {
      ProgramNumber: __integerMin0Max65535;
      ServiceDescriptor: MultiplexProgramServiceDescriptor & {
        ProviderName: __stringMax256;
        ServiceName: __stringMax256;
      };
    };
  };
}
export const UpdateMultiplexProgramResponse = S.suspend(() =>
  S.Struct({
    MultiplexProgram: S.optional(MultiplexProgram)
      .pipe(T.JsonName("multiplexProgram"))
      .annotations({ identifier: "MultiplexProgram" }),
  }),
).annotations({
  identifier: "UpdateMultiplexProgramResponse",
}) as any as S.Schema<UpdateMultiplexProgramResponse>;
export interface UpdateNetworkResponse {
  Arn?: string;
  AssociatedClusterIds?: string[];
  Id?: string;
  IpPools?: IpPool[];
  Name?: string;
  Routes?: Route[];
  State?: NetworkState;
}
export const UpdateNetworkResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AssociatedClusterIds: S.optional(__listOf__string).pipe(
      T.JsonName("associatedClusterIds"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
    State: S.optional(NetworkState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "UpdateNetworkResponse",
}) as any as S.Schema<UpdateNetworkResponse>;
export interface UpdateNodeResponse {
  Arn?: string;
  ChannelPlacementGroups?: string[];
  ClusterId?: string;
  ConnectionState?: NodeConnectionState;
  Id?: string;
  InstanceArn?: string;
  Name?: string;
  NodeInterfaceMappings?: NodeInterfaceMapping[];
  Role?: NodeRole;
  State?: NodeState;
  SdiSourceMappings?: SdiSourceMapping[];
}
export const UpdateNodeResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelPlacementGroups: S.optional(__listOf__string).pipe(
      T.JsonName("channelPlacementGroups"),
    ),
    ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
    ConnectionState: S.optional(NodeConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    Role: S.optional(NodeRole).pipe(T.JsonName("role")),
    State: S.optional(NodeState).pipe(T.JsonName("state")),
    SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  }),
).annotations({
  identifier: "UpdateNodeResponse",
}) as any as S.Schema<UpdateNodeResponse>;
export interface Thumbnail {
  Body?: string;
  ContentType?: string;
  ThumbnailType?: ThumbnailType;
  TimeStamp?: Date;
}
export const Thumbnail = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String).pipe(T.JsonName("body")),
    ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
    ThumbnailType: S.optional(ThumbnailType).pipe(T.JsonName("thumbnailType")),
    TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("timeStamp"),
    ),
  }),
).annotations({ identifier: "Thumbnail" }) as any as S.Schema<Thumbnail>;
export type __listOfThumbnail = Thumbnail[];
export const __listOfThumbnail = S.Array(Thumbnail);
export interface MultiplexSettingsSummary {
  TransportStreamBitrate?: number;
}
export const MultiplexSettingsSummary = S.suspend(() =>
  S.Struct({
    TransportStreamBitrate: S.optional(S.Number).pipe(
      T.JsonName("transportStreamBitrate"),
    ),
  }),
).annotations({
  identifier: "MultiplexSettingsSummary",
}) as any as S.Schema<MultiplexSettingsSummary>;
export interface Multiplex {
  Arn?: string;
  AvailabilityZones?: string[];
  Destinations?: MultiplexOutputDestination[];
  Id?: string;
  MultiplexSettings?: MultiplexSettings;
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const Multiplex = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "Multiplex" }) as any as S.Schema<Multiplex>;
export interface ThumbnailDetail {
  PipelineId?: string;
  Thumbnails?: Thumbnail[];
}
export const ThumbnailDetail = S.suspend(() =>
  S.Struct({
    PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
    Thumbnails: S.optional(__listOfThumbnail).pipe(T.JsonName("thumbnails")),
  }),
).annotations({
  identifier: "ThumbnailDetail",
}) as any as S.Schema<ThumbnailDetail>;
export type __listOfThumbnailDetail = ThumbnailDetail[];
export const __listOfThumbnailDetail = S.Array(ThumbnailDetail);
export interface MultiplexSummary {
  Arn?: string;
  AvailabilityZones?: string[];
  Id?: string;
  MultiplexSettings?: MultiplexSettingsSummary;
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const MultiplexSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettingsSummary)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettingsSummary" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "MultiplexSummary",
}) as any as S.Schema<MultiplexSummary>;
export type __listOfMultiplexSummary = MultiplexSummary[];
export const __listOfMultiplexSummary = S.Array(MultiplexSummary);
export interface CreateClusterResponse {
  Arn?: string;
  ChannelIds?: string[];
  ClusterType?: ClusterType;
  Id?: string;
  InstanceRoleArn?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettings;
  State?: ClusterState;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettings" }),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateMultiplexResponse {
  Multiplex?: Multiplex & {
    MultiplexSettings: MultiplexSettings & {
      TransportStreamBitrate: __integerMin1000000Max100000000;
      TransportStreamId: __integerMin0Max65535;
    };
  };
}
export const CreateMultiplexResponse = S.suspend(() =>
  S.Struct({
    Multiplex: S.optional(Multiplex)
      .pipe(T.JsonName("multiplex"))
      .annotations({ identifier: "Multiplex" }),
  }),
).annotations({
  identifier: "CreateMultiplexResponse",
}) as any as S.Schema<CreateMultiplexResponse>;
export interface CreateMultiplexProgramRequest {
  MultiplexId: string;
  MultiplexProgramSettings?: MultiplexProgramSettings;
  ProgramName?: string;
  RequestId?: string;
}
export const CreateMultiplexProgramRequest = S.suspend(() =>
  S.Struct({
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings)
      .pipe(T.JsonName("multiplexProgramSettings"))
      .annotations({ identifier: "MultiplexProgramSettings" }),
    ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/prod/multiplexes/{MultiplexId}/programs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMultiplexProgramRequest",
}) as any as S.Schema<CreateMultiplexProgramRequest>;
export interface DeleteChannelResponse {
  Arn?: string;
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EgressEndpoints?: ChannelEgressEndpoint[];
  EncoderSettings?: EncoderSettings & {
    AudioDescriptions: (AudioDescription & {
      AudioSelectorName: string;
      Name: __stringMax255;
      AudioWatermarkingSettings: AudioWatermarkSettings & {
        NielsenWatermarksSettings: NielsenWatermarksSettings & {
          NielsenCbetSettings: NielsenCBET & {
            CbetCheckDigitString: __stringMin2Max2;
            CbetStepaside: NielsenWatermarksCbetStepaside;
            Csid: __stringMin1Max7;
          };
          NielsenNaesIiNwSettings: NielsenNaesIiNw & {
            CheckDigitString: __stringMin2Max2;
            Sid: __doubleMin1Max65535;
          };
        };
      };
      RemixSettings: RemixSettings & {
        ChannelMappings: (AudioChannelMapping & {
          InputChannelLevels: (InputChannelLevel & {
            Gain: __integerMinNegative60Max6;
            InputChannel: __integerMin0Max15;
          })[];
          OutputChannel: __integerMin0Max7;
        })[];
      };
    })[];
    OutputGroups: (OutputGroup & {
      OutputGroupSettings: OutputGroupSettings & {
        ArchiveGroupSettings: ArchiveGroupSettings & {
          Destination: OutputLocationRef;
        };
        FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
          Destination: OutputLocationRef;
        };
        HlsGroupSettings: HlsGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
            LanguageDescription: __stringMin1;
          })[];
          KeyProviderSettings: KeyProviderSettings & {
            StaticKeySettings: StaticKeySettings & {
              StaticKeyValue: __stringMin32Max32;
              KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
            };
          };
        };
        MediaPackageGroupSettings: MediaPackageGroupSettings & {
          Destination: OutputLocationRef;
          MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            AdditionalDestinations: (MediaPackageAdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        MsSmoothGroupSettings: MsSmoothGroupSettings & {
          Destination: OutputLocationRef;
        };
        CmafIngestGroupSettings: CmafIngestGroupSettings & {
          Destination: OutputLocationRef;
          CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
            CaptionChannel: __integerMin1Max4;
            LanguageCode: __stringMin3Max3;
          })[];
          AdditionalDestinations: (AdditionalDestinations & {
            Destination: OutputLocationRef;
          })[];
        };
      };
      Outputs: (Output & {
        OutputSettings: OutputSettings & {
          ArchiveOutputSettings: ArchiveOutputSettings & {
            ContainerSettings: ArchiveContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
          };
          HlsOutputSettings: HlsOutputSettings & {
            HlsSettings: HlsSettings & {
              AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
              };
              StandardHlsSettings: StandardHlsSettings & {
                M3u8Settings: M3u8Settings;
              };
            };
          };
          MultiplexOutputSettings: MultiplexOutputSettings & {
            Destination: OutputLocationRef;
          };
          RtmpOutputSettings: RtmpOutputSettings & {
            Destination: OutputLocationRef;
          };
          UdpOutputSettings: UdpOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
          SrtOutputSettings: SrtOutputSettings & {
            ContainerSettings: UdpContainerSettings & {
              M2tsSettings: M2tsSettings & {
                DvbNitSettings: DvbNitSettings & {
                  NetworkId: __integerMin0Max65536;
                  NetworkName: __stringMin1Max256;
                };
              };
            };
            Destination: OutputLocationRef;
          };
        };
      })[];
    })[];
    TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
    VideoDescriptions: (VideoDescription & {
      Name: string;
      CodecSettings: VideoCodecSettings & {
        FrameCaptureSettings: FrameCaptureSettings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H264Settings: H264Settings & {
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        H265Settings: H265Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Mpeg2Settings: Mpeg2Settings & {
          FramerateDenominator: __integerMin1;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
        Av1Settings: Av1Settings & {
          FramerateDenominator: __integerMin1Max3003;
          FramerateNumerator: __integerMin1;
          TimecodeBurninSettings: TimecodeBurninSettings & {
            FontSize: TimecodeBurninFontSize;
            Position: TimecodeBurninPosition;
          };
        };
      };
    })[];
    AvailBlanking: AvailBlanking & {
      AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
    };
    AvailConfiguration: AvailConfiguration & {
      AvailSettings: AvailSettings & {
        Esam: Esam & {
          AcquisitionPointId: __stringMax256;
          PoisEndpoint: __stringMax2048;
        };
      };
    };
    BlackoutSlate: BlackoutSlate & {
      BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
      NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
    };
    CaptionDescriptions: (CaptionDescription & {
      CaptionSelectorName: string;
      Name: string;
      DestinationSettings: CaptionDestinationSettings & {
        BurnInDestinationSettings: BurnInDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
        DvbSubDestinationSettings: DvbSubDestinationSettings & {
          Font: InputLocation & { Uri: __stringMax2048 };
        };
      };
    })[];
    GlobalConfiguration: GlobalConfiguration & {
      InputLossBehavior: InputLossBehavior & {
        InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
      };
    };
    MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
      MotionGraphicsSettings: MotionGraphicsSettings;
    };
    ThumbnailConfiguration: ThumbnailConfiguration & { State: ThumbnailState };
    ColorCorrectionSettings: ColorCorrectionSettings & {
      GlobalColorCorrections: (ColorCorrection & {
        InputColorSpace: ColorSpace;
        OutputColorSpace: ColorSpace;
        Uri: string;
      })[];
    };
  };
  Id?: string;
  InputAttachments?: (InputAttachment & {
    AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
      SecondaryInputId: string;
      FailoverConditions: (FailoverCondition & {
        FailoverConditionSettings: FailoverConditionSettings & {
          AudioSilenceSettings: AudioSilenceFailoverSettings & {
            AudioSelectorName: string;
          };
        };
      })[];
    };
    InputSettings: InputSettings & {
      AudioSelectors: (AudioSelector & {
        Name: __stringMin1;
        SelectorSettings: AudioSelectorSettings & {
          AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
            GroupId: __stringMin1;
            Name: __stringMin1;
          };
          AudioLanguageSelection: AudioLanguageSelection & {
            LanguageCode: string;
          };
          AudioPidSelection: AudioPidSelection & { Pid: __integerMin0Max8191 };
          AudioTrackSelection: AudioTrackSelection & {
            Tracks: (AudioTrack & { Track: __integerMin1 })[];
            DolbyEDecode: AudioDolbyEDecode & {
              ProgramSelection: DolbyEProgramSelection;
            };
          };
        };
      })[];
      CaptionSelectors: (CaptionSelector & {
        Name: __stringMin1;
        SelectorSettings: CaptionSelectorSettings & {
          TeletextSourceSettings: TeletextSourceSettings & {
            OutputRectangle: CaptionRectangle & {
              Height: __doubleMin0Max100;
              LeftOffset: __doubleMin0Max100;
              TopOffset: __doubleMin0Max100;
              Width: __doubleMin0Max100;
            };
          };
        };
      })[];
    };
  })[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceStatus;
  Name?: string;
  PipelineDetails?: PipelineDetail[];
  PipelinesRunningCount?: number;
  RoleArn?: string;
  State?: ChannelState;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettingsDescription;
  AnywhereSettings?: DescribeAnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionResponse;
  LinkedChannelSettings?: DescribeLinkedChannelSettings;
}
export const DeleteChannelResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
      T.JsonName("egressEndpoints"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceStatus)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceStatus" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
      T.JsonName("pipelineDetails"),
    ),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    State: S.optional(ChannelState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettingsDescription)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettingsDescription" }),
    AnywhereSettings: S.optional(DescribeAnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "DescribeAnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionResponse)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionResponse" }),
    LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "DescribeLinkedChannelSettings" }),
  }),
).annotations({
  identifier: "DeleteChannelResponse",
}) as any as S.Schema<DeleteChannelResponse>;
export interface DeleteClusterResponse {
  Arn?: string;
  ChannelIds?: string[];
  ClusterType?: ClusterType;
  Id?: string;
  InstanceRoleArn?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettings;
  State?: ClusterState;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettings" }),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteMultiplexResponse {
  Arn?: string;
  AvailabilityZones?: string[];
  Destinations?: MultiplexOutputDestination[];
  Id?: string;
  MultiplexSettings?: MultiplexSettings & {
    TransportStreamBitrate: __integerMin1000000Max100000000;
    TransportStreamId: __integerMin0Max65535;
  };
  Name?: string;
  PipelinesRunningCount?: number;
  ProgramCount?: number;
  State?: MultiplexState;
  Tags?: { [key: string]: string | undefined };
}
export const DeleteMultiplexResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AvailabilityZones: S.optional(__listOf__string).pipe(
      T.JsonName("availabilityZones"),
    ),
    Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MultiplexSettings: S.optional(MultiplexSettings)
      .pipe(T.JsonName("multiplexSettings"))
      .annotations({ identifier: "MultiplexSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PipelinesRunningCount: S.optional(S.Number).pipe(
      T.JsonName("pipelinesRunningCount"),
    ),
    ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
    State: S.optional(MultiplexState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "DeleteMultiplexResponse",
}) as any as S.Schema<DeleteMultiplexResponse>;
export interface DescribeInputDeviceResponse {
  Arn?: string;
  ConnectionState?: InputDeviceConnectionState;
  DeviceSettingsSyncState?: DeviceSettingsSyncState;
  DeviceUpdateStatus?: DeviceUpdateStatus;
  HdDeviceSettings?: InputDeviceHdSettings;
  Id?: string;
  MacAddress?: string;
  Name?: string;
  NetworkSettings?: InputDeviceNetworkSettings;
  SerialNumber?: string;
  Type?: InputDeviceType;
  UhdDeviceSettings?: InputDeviceUhdSettings;
  Tags?: { [key: string]: string | undefined };
  AvailabilityZone?: string;
  MedialiveInputArns?: string[];
  OutputType?: InputDeviceOutputType;
}
export const DescribeInputDeviceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ConnectionState: S.optional(InputDeviceConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    DeviceSettingsSyncState: S.optional(DeviceSettingsSyncState).pipe(
      T.JsonName("deviceSettingsSyncState"),
    ),
    DeviceUpdateStatus: S.optional(DeviceUpdateStatus).pipe(
      T.JsonName("deviceUpdateStatus"),
    ),
    HdDeviceSettings: S.optional(InputDeviceHdSettings)
      .pipe(T.JsonName("hdDeviceSettings"))
      .annotations({ identifier: "InputDeviceHdSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(InputDeviceNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "InputDeviceNetworkSettings" }),
    SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
    Type: S.optional(InputDeviceType).pipe(T.JsonName("type")),
    UhdDeviceSettings: S.optional(InputDeviceUhdSettings)
      .pipe(T.JsonName("uhdDeviceSettings"))
      .annotations({ identifier: "InputDeviceUhdSettings" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    MedialiveInputArns: S.optional(__listOf__string).pipe(
      T.JsonName("medialiveInputArns"),
    ),
    OutputType: S.optional(InputDeviceOutputType).pipe(
      T.JsonName("outputType"),
    ),
  }),
).annotations({
  identifier: "DescribeInputDeviceResponse",
}) as any as S.Schema<DescribeInputDeviceResponse>;
export interface DescribeThumbnailsResponse {
  ThumbnailDetails?: ThumbnailDetail[];
}
export const DescribeThumbnailsResponse = S.suspend(() =>
  S.Struct({
    ThumbnailDetails: S.optional(__listOfThumbnailDetail).pipe(
      T.JsonName("thumbnailDetails"),
    ),
  }),
).annotations({
  identifier: "DescribeThumbnailsResponse",
}) as any as S.Schema<DescribeThumbnailsResponse>;
export interface ListMultiplexesResponse {
  Multiplexes?: MultiplexSummary[];
  NextToken?: string;
}
export const ListMultiplexesResponse = S.suspend(() =>
  S.Struct({
    Multiplexes: S.optional(__listOfMultiplexSummary).pipe(
      T.JsonName("multiplexes"),
    ),
    NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMultiplexesResponse",
}) as any as S.Schema<ListMultiplexesResponse>;
export interface UpdateClusterResponse {
  Arn?: string;
  ChannelIds?: string[];
  ClusterType?: ClusterType;
  Id?: string;
  Name?: string;
  NetworkSettings?: ClusterNetworkSettings;
  State?: ClusterState;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    ClusterType: S.optional(ClusterType).pipe(T.JsonName("clusterType")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "ClusterNetworkSettings" }),
    State: S.optional(ClusterState).pipe(T.JsonName("state")),
  }),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface UpdateInputResponse {
  Input?: Input & {
    MulticastSettings: MulticastSettings & {
      Sources: (MulticastSource & { Url: string })[];
    };
  };
}
export const UpdateInputResponse = S.suspend(() =>
  S.Struct({
    Input: S.optional(Input)
      .pipe(T.JsonName("input"))
      .annotations({ identifier: "Input" }),
  }),
).annotations({
  identifier: "UpdateInputResponse",
}) as any as S.Schema<UpdateInputResponse>;
export interface UpdateInputDeviceResponse {
  Arn?: string;
  ConnectionState?: InputDeviceConnectionState;
  DeviceSettingsSyncState?: DeviceSettingsSyncState;
  DeviceUpdateStatus?: DeviceUpdateStatus;
  HdDeviceSettings?: InputDeviceHdSettings;
  Id?: string;
  MacAddress?: string;
  Name?: string;
  NetworkSettings?: InputDeviceNetworkSettings;
  SerialNumber?: string;
  Type?: InputDeviceType;
  UhdDeviceSettings?: InputDeviceUhdSettings;
  Tags?: { [key: string]: string | undefined };
  AvailabilityZone?: string;
  MedialiveInputArns?: string[];
  OutputType?: InputDeviceOutputType;
}
export const UpdateInputDeviceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    ConnectionState: S.optional(InputDeviceConnectionState).pipe(
      T.JsonName("connectionState"),
    ),
    DeviceSettingsSyncState: S.optional(DeviceSettingsSyncState).pipe(
      T.JsonName("deviceSettingsSyncState"),
    ),
    DeviceUpdateStatus: S.optional(DeviceUpdateStatus).pipe(
      T.JsonName("deviceUpdateStatus"),
    ),
    HdDeviceSettings: S.optional(InputDeviceHdSettings)
      .pipe(T.JsonName("hdDeviceSettings"))
      .annotations({ identifier: "InputDeviceHdSettings" }),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(InputDeviceNetworkSettings)
      .pipe(T.JsonName("networkSettings"))
      .annotations({ identifier: "InputDeviceNetworkSettings" }),
    SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
    Type: S.optional(InputDeviceType).pipe(T.JsonName("type")),
    UhdDeviceSettings: S.optional(InputDeviceUhdSettings)
      .pipe(T.JsonName("uhdDeviceSettings"))
      .annotations({ identifier: "InputDeviceUhdSettings" }),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
    MedialiveInputArns: S.optional(__listOf__string).pipe(
      T.JsonName("medialiveInputArns"),
    ),
    OutputType: S.optional(InputDeviceOutputType).pipe(
      T.JsonName("outputType"),
    ),
  }),
).annotations({
  identifier: "UpdateInputDeviceResponse",
}) as any as S.Schema<UpdateInputDeviceResponse>;
export interface UpdateMultiplexResponse {
  Multiplex?: Multiplex & {
    MultiplexSettings: MultiplexSettings & {
      TransportStreamBitrate: __integerMin1000000Max100000000;
      TransportStreamId: __integerMin0Max65535;
    };
  };
}
export const UpdateMultiplexResponse = S.suspend(() =>
  S.Struct({
    Multiplex: S.optional(Multiplex)
      .pipe(T.JsonName("multiplex"))
      .annotations({ identifier: "Multiplex" }),
  }),
).annotations({
  identifier: "UpdateMultiplexResponse",
}) as any as S.Schema<UpdateMultiplexResponse>;
export interface CreateInputRequest {
  Destinations?: InputDestinationRequest[];
  InputDevices?: InputDeviceSettings[];
  InputSecurityGroups?: string[];
  MediaConnectFlows?: MediaConnectFlowRequest[];
  Name?: string;
  RequestId?: string;
  RoleArn?: string;
  Sources?: InputSourceRequest[];
  Tags?: { [key: string]: string | undefined };
  Type?: InputType;
  Vpc?: InputVpcRequest;
  SrtSettings?: SrtSettingsRequest;
  InputNetworkLocation?: InputNetworkLocation;
  MulticastSettings?: MulticastSettingsCreateRequest;
  Smpte2110ReceiverGroupSettings?: Smpte2110ReceiverGroupSettings;
  SdiSources?: string[];
  RouterSettings?: RouterSettings;
}
export const CreateInputRequest = S.suspend(() =>
  S.Struct({
    Destinations: S.optional(__listOfInputDestinationRequest).pipe(
      T.JsonName("destinations"),
    ),
    InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
      T.JsonName("inputDevices"),
    ),
    InputSecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroups"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlowRequest).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Sources: S.optional(__listOfInputSourceRequest).pipe(T.JsonName("sources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(InputType).pipe(T.JsonName("type")),
    Vpc: S.optional(InputVpcRequest)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "InputVpcRequest" }),
    SrtSettings: S.optional(SrtSettingsRequest)
      .pipe(T.JsonName("srtSettings"))
      .annotations({ identifier: "SrtSettingsRequest" }),
    InputNetworkLocation: S.optional(InputNetworkLocation).pipe(
      T.JsonName("inputNetworkLocation"),
    ),
    MulticastSettings: S.optional(MulticastSettingsCreateRequest)
      .pipe(T.JsonName("multicastSettings"))
      .annotations({ identifier: "MulticastSettingsCreateRequest" }),
    Smpte2110ReceiverGroupSettings: S.optional(Smpte2110ReceiverGroupSettings)
      .pipe(T.JsonName("smpte2110ReceiverGroupSettings"))
      .annotations({ identifier: "Smpte2110ReceiverGroupSettings" }),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    RouterSettings: S.optional(RouterSettings)
      .pipe(T.JsonName("routerSettings"))
      .annotations({ identifier: "RouterSettings" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/inputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInputRequest",
}) as any as S.Schema<CreateInputRequest>;
export interface CreateMultiplexProgramResponse {
  MultiplexProgram?: MultiplexProgram & {
    MultiplexProgramSettings: MultiplexProgramSettings & {
      ProgramNumber: __integerMin0Max65535;
      ServiceDescriptor: MultiplexProgramServiceDescriptor & {
        ProviderName: __stringMax256;
        ServiceName: __stringMax256;
      };
    };
  };
}
export const CreateMultiplexProgramResponse = S.suspend(() =>
  S.Struct({
    MultiplexProgram: S.optional(MultiplexProgram)
      .pipe(T.JsonName("multiplexProgram"))
      .annotations({ identifier: "MultiplexProgram" }),
  }),
).annotations({
  identifier: "CreateMultiplexProgramResponse",
}) as any as S.Schema<CreateMultiplexProgramResponse>;
export interface CreateSignalMapResponse {
  Arn?: string;
  CloudWatchAlarmTemplateGroupIds?: string[];
  CreatedAt?: Date;
  Description?: string;
  DiscoveryEntryPointArn?: string;
  ErrorMessage?: string;
  EventBridgeRuleTemplateGroupIds?: string[];
  FailedMediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  Id?: string;
  LastDiscoveredAt?: Date;
  LastSuccessfulMonitorDeployment?: SuccessfulMonitorDeployment & {
    DetailsUri: __stringMin1Max2048;
    Status: SignalMapMonitorDeploymentStatus;
  };
  MediaResourceMap?: {
    [key: string]:
      | (MediaResource & {
          Destinations: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
          Sources: (MediaResourceNeighbor & {
            Arn: __stringMin1Max2048PatternArn;
          })[];
        })
      | undefined;
  };
  ModifiedAt?: Date;
  MonitorChangesPendingDeployment?: boolean;
  MonitorDeployment?: MonitorDeployment & {
    Status: SignalMapMonitorDeploymentStatus;
  };
  Name?: string;
  Status?: SignalMapStatus;
  Tags?: { [key: string]: string | undefined };
}
export const CreateSignalMapResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    CloudWatchAlarmTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    EventBridgeRuleTemplateGroupIds: S.optional(
      __listOf__stringMin7Max11PatternAws097,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
    FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
      T.JsonName("failedMediaResourceMap"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    LastDiscoveredAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastDiscoveredAt")),
    LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment)
      .pipe(T.JsonName("lastSuccessfulMonitorDeployment"))
      .annotations({ identifier: "SuccessfulMonitorDeployment" }),
    MediaResourceMap: S.optional(MediaResourceMap).pipe(
      T.JsonName("mediaResourceMap"),
    ),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("modifiedAt"),
    ),
    MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
      T.JsonName("monitorChangesPendingDeployment"),
    ),
    MonitorDeployment: S.optional(MonitorDeployment)
      .pipe(T.JsonName("monitorDeployment"))
      .annotations({ identifier: "MonitorDeployment" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Status: S.optional(SignalMapStatus).pipe(T.JsonName("status")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateSignalMapResponse",
}) as any as S.Schema<CreateSignalMapResponse>;
export interface DescribeInputResponse {
  Arn?: string;
  AttachedChannels?: string[];
  Destinations?: InputDestination[];
  Id?: string;
  InputClass?: InputClass;
  InputDevices?: InputDeviceSettings[];
  InputPartnerIds?: string[];
  InputSourceType?: InputSourceType;
  MediaConnectFlows?: MediaConnectFlow[];
  Name?: string;
  RoleArn?: string;
  SecurityGroups?: string[];
  Sources?: InputSource[];
  State?: InputState;
  Tags?: { [key: string]: string | undefined };
  Type?: InputType;
  SrtSettings?: SrtSettings;
  InputNetworkLocation?: InputNetworkLocation;
  MulticastSettings?: MulticastSettings & {
    Sources: (MulticastSource & { Url: string })[];
  };
  Smpte2110ReceiverGroupSettings?: Smpte2110ReceiverGroupSettings;
  SdiSources?: string[];
  RouterSettings?: RouterInputSettings;
}
export const DescribeInputResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String).pipe(T.JsonName("arn")),
    AttachedChannels: S.optional(__listOf__string).pipe(
      T.JsonName("attachedChannels"),
    ),
    Destinations: S.optional(__listOfInputDestination).pipe(
      T.JsonName("destinations"),
    ),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    InputClass: S.optional(InputClass).pipe(T.JsonName("inputClass")),
    InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
      T.JsonName("inputDevices"),
    ),
    InputPartnerIds: S.optional(__listOf__string).pipe(
      T.JsonName("inputPartnerIds"),
    ),
    InputSourceType: S.optional(InputSourceType).pipe(
      T.JsonName("inputSourceType"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlow).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    SecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("securityGroups"),
    ),
    Sources: S.optional(__listOfInputSource).pipe(T.JsonName("sources")),
    State: S.optional(InputState).pipe(T.JsonName("state")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(InputType).pipe(T.JsonName("type")),
    SrtSettings: S.optional(SrtSettings)
      .pipe(T.JsonName("srtSettings"))
      .annotations({ identifier: "SrtSettings" }),
    InputNetworkLocation: S.optional(InputNetworkLocation).pipe(
      T.JsonName("inputNetworkLocation"),
    ),
    MulticastSettings: S.optional(MulticastSettings)
      .pipe(T.JsonName("multicastSettings"))
      .annotations({ identifier: "MulticastSettings" }),
    Smpte2110ReceiverGroupSettings: S.optional(Smpte2110ReceiverGroupSettings)
      .pipe(T.JsonName("smpte2110ReceiverGroupSettings"))
      .annotations({ identifier: "Smpte2110ReceiverGroupSettings" }),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    RouterSettings: S.optional(RouterInputSettings)
      .pipe(T.JsonName("routerSettings"))
      .annotations({ identifier: "RouterInputSettings" }),
  }),
).annotations({
  identifier: "DescribeInputResponse",
}) as any as S.Schema<DescribeInputResponse>;
export interface ValidationError {
  ElementPath?: string;
  ErrorMessage?: string;
}
export const ValidationError = S.suspend(() =>
  S.Struct({
    ElementPath: S.optional(S.String).pipe(T.JsonName("elementPath")),
    ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  }),
).annotations({
  identifier: "ValidationError",
}) as any as S.Schema<ValidationError>;
export type __listOfValidationError = ValidationError[];
export const __listOfValidationError = S.Array(ValidationError);
export interface CreateInputResponse {
  Input?: Input & {
    MulticastSettings: MulticastSettings & {
      Sources: (MulticastSource & { Url: string })[];
    };
  };
}
export const CreateInputResponse = S.suspend(() =>
  S.Struct({
    Input: S.optional(Input)
      .pipe(T.JsonName("input"))
      .annotations({ identifier: "Input" }),
  }),
).annotations({
  identifier: "CreateInputResponse",
}) as any as S.Schema<CreateInputResponse>;
export interface BatchScheduleActionCreateRequest {
  ScheduleActions?: ScheduleAction[];
}
export const BatchScheduleActionCreateRequest = S.suspend(() =>
  S.Struct({
    ScheduleActions: S.optional(__listOfScheduleAction).pipe(
      T.JsonName("scheduleActions"),
    ),
  }),
).annotations({
  identifier: "BatchScheduleActionCreateRequest",
}) as any as S.Schema<BatchScheduleActionCreateRequest>;
export interface BatchUpdateScheduleRequest {
  ChannelId: string;
  Creates?: BatchScheduleActionCreateRequest;
  Deletes?: BatchScheduleActionDeleteRequest;
}
export const BatchUpdateScheduleRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Creates: S.optional(BatchScheduleActionCreateRequest)
      .pipe(T.JsonName("creates"))
      .annotations({ identifier: "BatchScheduleActionCreateRequest" }),
    Deletes: S.optional(BatchScheduleActionDeleteRequest)
      .pipe(T.JsonName("deletes"))
      .annotations({ identifier: "BatchScheduleActionDeleteRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}/schedule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateScheduleRequest",
}) as any as S.Schema<BatchUpdateScheduleRequest>;
export interface CreateChannelRequest {
  CdiInputSpecification?: CdiInputSpecification;
  ChannelClass?: ChannelClass;
  Destinations?: OutputDestination[];
  EncoderSettings?: EncoderSettings;
  InputAttachments?: InputAttachment[];
  InputSpecification?: InputSpecification;
  LogLevel?: LogLevel;
  Maintenance?: MaintenanceCreateSettings;
  Name?: string;
  RequestId?: string;
  Reserved?: string;
  RoleArn?: string;
  Tags?: { [key: string]: string | undefined };
  Vpc?: VpcOutputSettings;
  AnywhereSettings?: AnywhereSettings;
  ChannelEngineVersion?: ChannelEngineVersionRequest;
  DryRun?: boolean;
  LinkedChannelSettings?: LinkedChannelSettings;
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    CdiInputSpecification: S.optional(CdiInputSpecification)
      .pipe(T.JsonName("cdiInputSpecification"))
      .annotations({ identifier: "CdiInputSpecification" }),
    ChannelClass: S.optional(ChannelClass).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EncoderSettings: S.optional(EncoderSettings)
      .pipe(T.JsonName("encoderSettings"))
      .annotations({ identifier: "EncoderSettings" }),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification)
      .pipe(T.JsonName("inputSpecification"))
      .annotations({ identifier: "InputSpecification" }),
    LogLevel: S.optional(LogLevel).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceCreateSettings)
      .pipe(T.JsonName("maintenance"))
      .annotations({ identifier: "MaintenanceCreateSettings" }),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(
      T.JsonName("requestId"),
      T.IdempotencyToken(),
    ),
    Reserved: S.optional(S.String).pipe(T.JsonName("reserved")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettings)
      .pipe(T.JsonName("vpc"))
      .annotations({ identifier: "VpcOutputSettings" }),
    AnywhereSettings: S.optional(AnywhereSettings)
      .pipe(T.JsonName("anywhereSettings"))
      .annotations({ identifier: "AnywhereSettings" }),
    ChannelEngineVersion: S.optional(ChannelEngineVersionRequest)
      .pipe(T.JsonName("channelEngineVersion"))
      .annotations({ identifier: "ChannelEngineVersionRequest" }),
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    LinkedChannelSettings: S.optional(LinkedChannelSettings)
      .pipe(T.JsonName("linkedChannelSettings"))
      .annotations({ identifier: "LinkedChannelSettings" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prod/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelRequest",
}) as any as S.Schema<CreateChannelRequest>;
export interface CreateChannelResponse {
  Channel?: Channel & {
    EncoderSettings: EncoderSettings & {
      AudioDescriptions: (AudioDescription & {
        AudioSelectorName: string;
        Name: __stringMax255;
        AudioWatermarkingSettings: AudioWatermarkSettings & {
          NielsenWatermarksSettings: NielsenWatermarksSettings & {
            NielsenCbetSettings: NielsenCBET & {
              CbetCheckDigitString: __stringMin2Max2;
              CbetStepaside: NielsenWatermarksCbetStepaside;
              Csid: __stringMin1Max7;
            };
            NielsenNaesIiNwSettings: NielsenNaesIiNw & {
              CheckDigitString: __stringMin2Max2;
              Sid: __doubleMin1Max65535;
            };
          };
        };
        RemixSettings: RemixSettings & {
          ChannelMappings: (AudioChannelMapping & {
            InputChannelLevels: (InputChannelLevel & {
              Gain: __integerMinNegative60Max6;
              InputChannel: __integerMin0Max15;
            })[];
            OutputChannel: __integerMin0Max7;
          })[];
        };
      })[];
      OutputGroups: (OutputGroup & {
        OutputGroupSettings: OutputGroupSettings & {
          ArchiveGroupSettings: ArchiveGroupSettings & {
            Destination: OutputLocationRef;
          };
          FrameCaptureGroupSettings: FrameCaptureGroupSettings & {
            Destination: OutputLocationRef;
          };
          HlsGroupSettings: HlsGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
              LanguageDescription: __stringMin1;
            })[];
            KeyProviderSettings: KeyProviderSettings & {
              StaticKeySettings: StaticKeySettings & {
                StaticKeyValue: __stringMin32Max32;
                KeyProviderServer: InputLocation & { Uri: __stringMax2048 };
              };
            };
          };
          MediaPackageGroupSettings: MediaPackageGroupSettings & {
            Destination: OutputLocationRef;
            MediapackageV2GroupSettings: MediaPackageV2GroupSettings & {
              CaptionLanguageMappings: (CaptionLanguageMapping & {
                CaptionChannel: __integerMin1Max4;
                LanguageCode: __stringMin3Max3;
                LanguageDescription: __stringMin1;
              })[];
              AdditionalDestinations: (MediaPackageAdditionalDestinations & {
                Destination: OutputLocationRef;
              })[];
            };
          };
          MsSmoothGroupSettings: MsSmoothGroupSettings & {
            Destination: OutputLocationRef;
          };
          CmafIngestGroupSettings: CmafIngestGroupSettings & {
            Destination: OutputLocationRef;
            CaptionLanguageMappings: (CmafIngestCaptionLanguageMapping & {
              CaptionChannel: __integerMin1Max4;
              LanguageCode: __stringMin3Max3;
            })[];
            AdditionalDestinations: (AdditionalDestinations & {
              Destination: OutputLocationRef;
            })[];
          };
        };
        Outputs: (Output & {
          OutputSettings: OutputSettings & {
            ArchiveOutputSettings: ArchiveOutputSettings & {
              ContainerSettings: ArchiveContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
            };
            HlsOutputSettings: HlsOutputSettings & {
              HlsSettings: HlsSettings & {
                AudioOnlyHlsSettings: AudioOnlyHlsSettings & {
                  AudioOnlyImage: InputLocation & { Uri: __stringMax2048 };
                };
                StandardHlsSettings: StandardHlsSettings & {
                  M3u8Settings: M3u8Settings;
                };
              };
            };
            MultiplexOutputSettings: MultiplexOutputSettings & {
              Destination: OutputLocationRef;
            };
            RtmpOutputSettings: RtmpOutputSettings & {
              Destination: OutputLocationRef;
            };
            UdpOutputSettings: UdpOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
            SrtOutputSettings: SrtOutputSettings & {
              ContainerSettings: UdpContainerSettings & {
                M2tsSettings: M2tsSettings & {
                  DvbNitSettings: DvbNitSettings & {
                    NetworkId: __integerMin0Max65536;
                    NetworkName: __stringMin1Max256;
                  };
                };
              };
              Destination: OutputLocationRef;
            };
          };
        })[];
      })[];
      TimecodeConfig: TimecodeConfig & { Source: TimecodeConfigSource };
      VideoDescriptions: (VideoDescription & {
        Name: string;
        CodecSettings: VideoCodecSettings & {
          FrameCaptureSettings: FrameCaptureSettings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H264Settings: H264Settings & {
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          H265Settings: H265Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Mpeg2Settings: Mpeg2Settings & {
            FramerateDenominator: __integerMin1;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
          Av1Settings: Av1Settings & {
            FramerateDenominator: __integerMin1Max3003;
            FramerateNumerator: __integerMin1;
            TimecodeBurninSettings: TimecodeBurninSettings & {
              FontSize: TimecodeBurninFontSize;
              Position: TimecodeBurninPosition;
            };
          };
        };
      })[];
      AvailBlanking: AvailBlanking & {
        AvailBlankingImage: InputLocation & { Uri: __stringMax2048 };
      };
      AvailConfiguration: AvailConfiguration & {
        AvailSettings: AvailSettings & {
          Esam: Esam & {
            AcquisitionPointId: __stringMax256;
            PoisEndpoint: __stringMax2048;
          };
        };
      };
      BlackoutSlate: BlackoutSlate & {
        BlackoutSlateImage: InputLocation & { Uri: __stringMax2048 };
        NetworkEndBlackoutImage: InputLocation & { Uri: __stringMax2048 };
      };
      CaptionDescriptions: (CaptionDescription & {
        CaptionSelectorName: string;
        Name: string;
        DestinationSettings: CaptionDestinationSettings & {
          BurnInDestinationSettings: BurnInDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
          DvbSubDestinationSettings: DvbSubDestinationSettings & {
            Font: InputLocation & { Uri: __stringMax2048 };
          };
        };
      })[];
      GlobalConfiguration: GlobalConfiguration & {
        InputLossBehavior: InputLossBehavior & {
          InputLossImageSlate: InputLocation & { Uri: __stringMax2048 };
        };
      };
      MotionGraphicsConfiguration: MotionGraphicsConfiguration & {
        MotionGraphicsSettings: MotionGraphicsSettings;
      };
      ThumbnailConfiguration: ThumbnailConfiguration & {
        State: ThumbnailState;
      };
      ColorCorrectionSettings: ColorCorrectionSettings & {
        GlobalColorCorrections: (ColorCorrection & {
          InputColorSpace: ColorSpace;
          OutputColorSpace: ColorSpace;
          Uri: string;
        })[];
      };
    };
    InputAttachments: (InputAttachment & {
      AutomaticInputFailoverSettings: AutomaticInputFailoverSettings & {
        SecondaryInputId: string;
        FailoverConditions: (FailoverCondition & {
          FailoverConditionSettings: FailoverConditionSettings & {
            AudioSilenceSettings: AudioSilenceFailoverSettings & {
              AudioSelectorName: string;
            };
          };
        })[];
      };
      InputSettings: InputSettings & {
        AudioSelectors: (AudioSelector & {
          Name: __stringMin1;
          SelectorSettings: AudioSelectorSettings & {
            AudioHlsRenditionSelection: AudioHlsRenditionSelection & {
              GroupId: __stringMin1;
              Name: __stringMin1;
            };
            AudioLanguageSelection: AudioLanguageSelection & {
              LanguageCode: string;
            };
            AudioPidSelection: AudioPidSelection & {
              Pid: __integerMin0Max8191;
            };
            AudioTrackSelection: AudioTrackSelection & {
              Tracks: (AudioTrack & { Track: __integerMin1 })[];
              DolbyEDecode: AudioDolbyEDecode & {
                ProgramSelection: DolbyEProgramSelection;
              };
            };
          };
        })[];
        CaptionSelectors: (CaptionSelector & {
          Name: __stringMin1;
          SelectorSettings: CaptionSelectorSettings & {
            TeletextSourceSettings: TeletextSourceSettings & {
              OutputRectangle: CaptionRectangle & {
                Height: __doubleMin0Max100;
                LeftOffset: __doubleMin0Max100;
                TopOffset: __doubleMin0Max100;
                Width: __doubleMin0Max100;
              };
            };
          };
        })[];
      };
    })[];
  };
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({
    Channel: S.optional(Channel)
      .pipe(T.JsonName("channel"))
      .annotations({ identifier: "Channel" }),
  }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface BatchScheduleActionCreateResult {
  ScheduleActions?: ScheduleAction[];
}
export const BatchScheduleActionCreateResult = S.suspend(() =>
  S.Struct({
    ScheduleActions: S.optional(__listOfScheduleAction).pipe(
      T.JsonName("scheduleActions"),
    ),
  }),
).annotations({
  identifier: "BatchScheduleActionCreateResult",
}) as any as S.Schema<BatchScheduleActionCreateResult>;
export interface BatchScheduleActionDeleteResult {
  ScheduleActions?: ScheduleAction[];
}
export const BatchScheduleActionDeleteResult = S.suspend(() =>
  S.Struct({
    ScheduleActions: S.optional(__listOfScheduleAction).pipe(
      T.JsonName("scheduleActions"),
    ),
  }),
).annotations({
  identifier: "BatchScheduleActionDeleteResult",
}) as any as S.Schema<BatchScheduleActionDeleteResult>;
export interface BatchUpdateScheduleResponse {
  Creates?: BatchScheduleActionCreateResult & {
    ScheduleActions: (ScheduleAction & {
      ActionName: string;
      ScheduleActionSettings: ScheduleActionSettings & {
        HlsTimedMetadataSettings: HlsTimedMetadataScheduleActionSettings & {
          Id3: string;
        };
        InputPrepareSettings: InputPrepareScheduleActionSettings & {
          InputClippingSettings: InputClippingSettings & {
            InputTimecodeSource: InputTimecodeSource;
          };
        };
        InputSwitchSettings: InputSwitchScheduleActionSettings & {
          InputAttachmentNameReference: string;
          InputClippingSettings: InputClippingSettings & {
            InputTimecodeSource: InputTimecodeSource;
          };
        };
        PauseStateSettings: PauseStateScheduleActionSettings & {
          Pipelines: (PipelinePauseStateSettings & {
            PipelineId: PipelineId;
          })[];
        };
        Scte35InputSettings: Scte35InputScheduleActionSettings & {
          Mode: Scte35InputMode;
        };
        Scte35ReturnToNetworkSettings: Scte35ReturnToNetworkScheduleActionSettings & {
          SpliceEventId: __longMin0Max4294967295;
        };
        Scte35SpliceInsertSettings: Scte35SpliceInsertScheduleActionSettings & {
          SpliceEventId: __longMin0Max4294967295;
        };
        Scte35TimeSignalSettings: Scte35TimeSignalScheduleActionSettings & {
          Scte35Descriptors: (Scte35Descriptor & {
            Scte35DescriptorSettings: Scte35DescriptorSettings & {
              SegmentationDescriptorScte35DescriptorSettings: Scte35SegmentationDescriptor & {
                SegmentationCancelIndicator: Scte35SegmentationCancelIndicator;
                SegmentationEventId: __longMin0Max4294967295;
                DeliveryRestrictions: Scte35DeliveryRestrictions & {
                  ArchiveAllowedFlag: Scte35ArchiveAllowedFlag;
                  DeviceRestrictions: Scte35DeviceRestrictions;
                  NoRegionalBlackoutFlag: Scte35NoRegionalBlackoutFlag;
                  WebDeliveryAllowedFlag: Scte35WebDeliveryAllowedFlag;
                };
              };
            };
          })[];
        };
        StaticImageActivateSettings: StaticImageActivateScheduleActionSettings & {
          Image: InputLocation & { Uri: __stringMax2048 };
        };
        StaticImageOutputActivateSettings: StaticImageOutputActivateScheduleActionSettings & {
          Image: InputLocation & { Uri: __stringMax2048 };
          OutputNames: __listOf__string;
        };
        StaticImageOutputDeactivateSettings: StaticImageOutputDeactivateScheduleActionSettings & {
          OutputNames: __listOf__string;
        };
        TimedMetadataSettings: TimedMetadataScheduleActionSettings & {
          Id3: string;
        };
      };
      ScheduleActionStartSettings: ScheduleActionStartSettings & {
        FixedModeScheduleActionStartSettings: FixedModeScheduleActionStartSettings & {
          Time: string;
        };
        FollowModeScheduleActionStartSettings: FollowModeScheduleActionStartSettings & {
          FollowPoint: FollowPoint;
          ReferenceActionName: string;
        };
      };
    })[];
  };
  Deletes?: BatchScheduleActionDeleteResult & {
    ScheduleActions: (ScheduleAction & {
      ActionName: string;
      ScheduleActionSettings: ScheduleActionSettings & {
        HlsTimedMetadataSettings: HlsTimedMetadataScheduleActionSettings & {
          Id3: string;
        };
        InputPrepareSettings: InputPrepareScheduleActionSettings & {
          InputClippingSettings: InputClippingSettings & {
            InputTimecodeSource: InputTimecodeSource;
          };
        };
        InputSwitchSettings: InputSwitchScheduleActionSettings & {
          InputAttachmentNameReference: string;
          InputClippingSettings: InputClippingSettings & {
            InputTimecodeSource: InputTimecodeSource;
          };
        };
        PauseStateSettings: PauseStateScheduleActionSettings & {
          Pipelines: (PipelinePauseStateSettings & {
            PipelineId: PipelineId;
          })[];
        };
        Scte35InputSettings: Scte35InputScheduleActionSettings & {
          Mode: Scte35InputMode;
        };
        Scte35ReturnToNetworkSettings: Scte35ReturnToNetworkScheduleActionSettings & {
          SpliceEventId: __longMin0Max4294967295;
        };
        Scte35SpliceInsertSettings: Scte35SpliceInsertScheduleActionSettings & {
          SpliceEventId: __longMin0Max4294967295;
        };
        Scte35TimeSignalSettings: Scte35TimeSignalScheduleActionSettings & {
          Scte35Descriptors: (Scte35Descriptor & {
            Scte35DescriptorSettings: Scte35DescriptorSettings & {
              SegmentationDescriptorScte35DescriptorSettings: Scte35SegmentationDescriptor & {
                SegmentationCancelIndicator: Scte35SegmentationCancelIndicator;
                SegmentationEventId: __longMin0Max4294967295;
                DeliveryRestrictions: Scte35DeliveryRestrictions & {
                  ArchiveAllowedFlag: Scte35ArchiveAllowedFlag;
                  DeviceRestrictions: Scte35DeviceRestrictions;
                  NoRegionalBlackoutFlag: Scte35NoRegionalBlackoutFlag;
                  WebDeliveryAllowedFlag: Scte35WebDeliveryAllowedFlag;
                };
              };
            };
          })[];
        };
        StaticImageActivateSettings: StaticImageActivateScheduleActionSettings & {
          Image: InputLocation & { Uri: __stringMax2048 };
        };
        StaticImageOutputActivateSettings: StaticImageOutputActivateScheduleActionSettings & {
          Image: InputLocation & { Uri: __stringMax2048 };
          OutputNames: __listOf__string;
        };
        StaticImageOutputDeactivateSettings: StaticImageOutputDeactivateScheduleActionSettings & {
          OutputNames: __listOf__string;
        };
        TimedMetadataSettings: TimedMetadataScheduleActionSettings & {
          Id3: string;
        };
      };
      ScheduleActionStartSettings: ScheduleActionStartSettings & {
        FixedModeScheduleActionStartSettings: FixedModeScheduleActionStartSettings & {
          Time: string;
        };
        FollowModeScheduleActionStartSettings: FollowModeScheduleActionStartSettings & {
          FollowPoint: FollowPoint;
          ReferenceActionName: string;
        };
      };
    })[];
  };
}
export const BatchUpdateScheduleResponse = S.suspend(() =>
  S.Struct({
    Creates: S.optional(BatchScheduleActionCreateResult)
      .pipe(T.JsonName("creates"))
      .annotations({ identifier: "BatchScheduleActionCreateResult" }),
    Deletes: S.optional(BatchScheduleActionDeleteResult)
      .pipe(T.JsonName("deletes"))
      .annotations({ identifier: "BatchScheduleActionDeleteResult" }),
  }),
).annotations({
  identifier: "BatchUpdateScheduleResponse",
}) as any as S.Schema<BatchUpdateScheduleResponse>;

//# Errors
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class GatewayTimeoutException extends S.TaggedError<GatewayTimeoutException>()(
  "GatewayTimeoutException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withTimeoutError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ValidationErrors: S.optional(__listOfValidationError).pipe(
      T.JsonName("validationErrors"),
    ),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Create tags for a resource
 */
export const createTags: (
  input: CreateTagsRequest,
) => effect.Effect<
  CreateTagsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Retrieve a list of the existing multiplexes.
 */
export const listMultiplexes: {
  (
    input: ListMultiplexesRequest,
  ): effect.Effect<
    ListMultiplexesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultiplexesRequest,
  ) => stream.Stream<
    ListMultiplexesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMultiplexesRequest,
  ) => stream.Stream<
    MultiplexSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultiplexesRequest,
  output: ListMultiplexesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Multiplexes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete the specified ChannelPlacementGroup that exists in the specified Cluster.
 */
export const deleteChannelPlacementGroup: (
  input: DeleteChannelPlacementGroupRequest,
) => effect.Effect<
  DeleteChannelPlacementGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelPlacementGroupRequest,
  output: DeleteChannelPlacementGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a Cluster. The Cluster must be idle.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => effect.Effect<
  DeleteClusterResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a multiplex. The multiplex must be idle.
 */
export const deleteMultiplex: (
  input: DeleteMultiplexRequest,
) => effect.Effect<
  DeleteMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiplexRequest,
  output: DeleteMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the details for the input device
 */
export const describeInputDevice: (
  input: DescribeInputDeviceRequest,
) => effect.Effect<
  DescribeInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputDeviceRequest,
  output: DescribeInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Describe the latest thumbnails data.
 */
export const describeThumbnails: (
  input: DescribeThumbnailsRequest,
) => effect.Effect<
  DescribeThumbnailsResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThumbnailsRequest,
  output: DescribeThumbnailsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an input.
 */
export const updateInput: (
  input: UpdateInputRequest,
) => effect.Effect<
  UpdateInputResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputRequest,
  output: UpdateInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists cloudwatch alarm template groups.
 */
export const listCloudWatchAlarmTemplateGroups: {
  (
    input: ListCloudWatchAlarmTemplateGroupsRequest,
  ): effect.Effect<
    ListCloudWatchAlarmTemplateGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudWatchAlarmTemplateGroupsRequest,
  ) => stream.Stream<
    ListCloudWatchAlarmTemplateGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudWatchAlarmTemplateGroupsRequest,
  ) => stream.Stream<
    CloudWatchAlarmTemplateGroupSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCloudWatchAlarmTemplateGroupsRequest,
  output: ListCloudWatchAlarmTemplateGroupsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CloudWatchAlarmTemplateGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists cloudwatch alarm templates.
 */
export const listCloudWatchAlarmTemplates: {
  (
    input: ListCloudWatchAlarmTemplatesRequest,
  ): effect.Effect<
    ListCloudWatchAlarmTemplatesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCloudWatchAlarmTemplatesRequest,
  ) => stream.Stream<
    ListCloudWatchAlarmTemplatesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCloudWatchAlarmTemplatesRequest,
  ) => stream.Stream<
    CloudWatchAlarmTemplateSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCloudWatchAlarmTemplatesRequest,
  output: ListCloudWatchAlarmTemplatesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CloudWatchAlarmTemplates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists eventbridge rule template groups.
 */
export const listEventBridgeRuleTemplateGroups: {
  (
    input: ListEventBridgeRuleTemplateGroupsRequest,
  ): effect.Effect<
    ListEventBridgeRuleTemplateGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventBridgeRuleTemplateGroupsRequest,
  ) => stream.Stream<
    ListEventBridgeRuleTemplateGroupsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventBridgeRuleTemplateGroupsRequest,
  ) => stream.Stream<
    EventBridgeRuleTemplateGroupSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventBridgeRuleTemplateGroupsRequest,
  output: ListEventBridgeRuleTemplateGroupsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventBridgeRuleTemplateGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists eventbridge rule templates.
 */
export const listEventBridgeRuleTemplates: {
  (
    input: ListEventBridgeRuleTemplatesRequest,
  ): effect.Effect<
    ListEventBridgeRuleTemplatesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventBridgeRuleTemplatesRequest,
  ) => stream.Stream<
    ListEventBridgeRuleTemplatesResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventBridgeRuleTemplatesRequest,
  ) => stream.Stream<
    EventBridgeRuleTemplateSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventBridgeRuleTemplatesRequest,
  output: ListEventBridgeRuleTemplatesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EventBridgeRuleTemplates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists signal maps.
 */
export const listSignalMaps: {
  (
    input: ListSignalMapsRequest,
  ): effect.Effect<
    ListSignalMapsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSignalMapsRequest,
  ) => stream.Stream<
    ListSignalMapsResponse,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSignalMapsRequest,
  ) => stream.Stream<
    SignalMapSummary,
    | BadRequestException
    | ForbiddenException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSignalMapsRequest,
  output: ListSignalMapsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SignalMaps",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified cloudwatch alarm template.
 */
export const getCloudWatchAlarmTemplate: (
  input: GetCloudWatchAlarmTemplateRequest,
) => effect.Effect<
  GetCloudWatchAlarmTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudWatchAlarmTemplateRequest,
  output: GetCloudWatchAlarmTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the specified cloudwatch alarm template group.
 */
export const getCloudWatchAlarmTemplateGroup: (
  input: GetCloudWatchAlarmTemplateGroupRequest,
) => effect.Effect<
  GetCloudWatchAlarmTemplateGroupResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCloudWatchAlarmTemplateGroupRequest,
  output: GetCloudWatchAlarmTemplateGroupResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the specified eventbridge rule template.
 */
export const getEventBridgeRuleTemplate: (
  input: GetEventBridgeRuleTemplateRequest,
) => effect.Effect<
  GetEventBridgeRuleTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventBridgeRuleTemplateRequest,
  output: GetEventBridgeRuleTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the specified eventbridge rule template group.
 */
export const getEventBridgeRuleTemplateGroup: (
  input: GetEventBridgeRuleTemplateGroupRequest,
) => effect.Effect<
  GetEventBridgeRuleTemplateGroupResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventBridgeRuleTemplateGroupRequest,
  output: GetEventBridgeRuleTemplateGroupResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the specified signal map.
 */
export const getSignalMap: (
  input: GetSignalMapRequest,
) => effect.Effect<
  GetSignalMapResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSignalMapRequest,
  output: GetSignalMapResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces list of tags that have been created for a resource
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes tags for a resource
 */
export const deleteTags: (
  input: DeleteTagsRequest,
) => effect.Effect<
  DeleteTagsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Initiates a deployment to delete the monitor of the specified signal map.
 */
export const startDeleteMonitorDeployment: (
  input: StartDeleteMonitorDeploymentRequest,
) => effect.Effect<
  StartDeleteMonitorDeploymentResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeleteMonitorDeploymentRequest,
  output: StartDeleteMonitorDeploymentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates a deployment to deploy the latest monitor of the specified signal map.
 */
export const startMonitorDeployment: (
  input: StartMonitorDeploymentRequest,
) => effect.Effect<
  StartMonitorDeploymentResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMonitorDeploymentRequest,
  output: StartMonitorDeploymentResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates an update for the specified signal map. Will discover a new signal map if a changed discoveryEntryPointArn is provided.
 */
export const startUpdateSignalMap: (
  input: StartUpdateSignalMapRequest,
) => effect.Effect<
  StartUpdateSignalMapResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartUpdateSignalMapRequest,
  output: StartUpdateSignalMapResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the specified cloudwatch alarm template.
 */
export const updateCloudWatchAlarmTemplate: (
  input: UpdateCloudWatchAlarmTemplateRequest,
) => effect.Effect<
  UpdateCloudWatchAlarmTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCloudWatchAlarmTemplateRequest,
  output: UpdateCloudWatchAlarmTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the specified cloudwatch alarm template group.
 */
export const updateCloudWatchAlarmTemplateGroup: (
  input: UpdateCloudWatchAlarmTemplateGroupRequest,
) => effect.Effect<
  UpdateCloudWatchAlarmTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCloudWatchAlarmTemplateGroupRequest,
  output: UpdateCloudWatchAlarmTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the specified eventbridge rule template.
 */
export const updateEventBridgeRuleTemplate: (
  input: UpdateEventBridgeRuleTemplateRequest,
) => effect.Effect<
  UpdateEventBridgeRuleTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventBridgeRuleTemplateRequest,
  output: UpdateEventBridgeRuleTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the specified eventbridge rule template group.
 */
export const updateEventBridgeRuleTemplateGroup: (
  input: UpdateEventBridgeRuleTemplateGroupRequest,
) => effect.Effect<
  UpdateEventBridgeRuleTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventBridgeRuleTemplateGroupRequest,
  output: UpdateEventBridgeRuleTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a cloudwatch alarm template.
 */
export const deleteCloudWatchAlarmTemplate: (
  input: DeleteCloudWatchAlarmTemplateRequest,
) => effect.Effect<
  DeleteCloudWatchAlarmTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCloudWatchAlarmTemplateRequest,
  output: DeleteCloudWatchAlarmTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a cloudwatch alarm template group. You must detach this group from all signal maps and ensure its existing templates are moved to another group or deleted.
 */
export const deleteCloudWatchAlarmTemplateGroup: (
  input: DeleteCloudWatchAlarmTemplateGroupRequest,
) => effect.Effect<
  DeleteCloudWatchAlarmTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCloudWatchAlarmTemplateGroupRequest,
  output: DeleteCloudWatchAlarmTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an eventbridge rule template.
 */
export const deleteEventBridgeRuleTemplate: (
  input: DeleteEventBridgeRuleTemplateRequest,
) => effect.Effect<
  DeleteEventBridgeRuleTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventBridgeRuleTemplateRequest,
  output: DeleteEventBridgeRuleTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an eventbridge rule template group. You must detach this group from all signal maps and ensure its existing templates are moved to another group or deleted.
 */
export const deleteEventBridgeRuleTemplateGroup: (
  input: DeleteEventBridgeRuleTemplateGroupRequest,
) => effect.Effect<
  DeleteEventBridgeRuleTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventBridgeRuleTemplateGroupRequest,
  output: DeleteEventBridgeRuleTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the specified signal map.
 */
export const deleteSignalMap: (
  input: DeleteSignalMapRequest,
) => effect.Effect<
  DeleteSignalMapResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSignalMapRequest,
  output: DeleteSignalMapResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a cloudwatch alarm template group to group your cloudwatch alarm templates and to attach to signal maps for dynamically creating alarms.
 */
export const createCloudWatchAlarmTemplateGroup: (
  input: CreateCloudWatchAlarmTemplateGroupRequest,
) => effect.Effect<
  CreateCloudWatchAlarmTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCloudWatchAlarmTemplateGroupRequest,
  output: CreateCloudWatchAlarmTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an eventbridge rule template group to group your eventbridge rule templates and to attach to signal maps for dynamically creating notification rules.
 */
export const createEventBridgeRuleTemplateGroup: (
  input: CreateEventBridgeRuleTemplateGroupRequest,
) => effect.Effect<
  CreateEventBridgeRuleTemplateGroupResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventBridgeRuleTemplateGroupRequest,
  output: CreateEventBridgeRuleTemplateGroupResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a cloudwatch alarm template to dynamically generate cloudwatch metric alarms on targeted resource types.
 */
export const createCloudWatchAlarmTemplate: (
  input: CreateCloudWatchAlarmTemplateRequest,
) => effect.Effect<
  CreateCloudWatchAlarmTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCloudWatchAlarmTemplateRequest,
  output: CreateCloudWatchAlarmTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an eventbridge rule template to monitor events and send notifications to your targeted resources.
 */
export const createEventBridgeRuleTemplate: (
  input: CreateEventBridgeRuleTemplateRequest,
) => effect.Effect<
  CreateEventBridgeRuleTemplateResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventBridgeRuleTemplateRequest,
  output: CreateEventBridgeRuleTemplateResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a program from a multiplex.
 */
export const deleteMultiplexProgram: (
  input: DeleteMultiplexProgramRequest,
) => effect.Effect<
  DeleteMultiplexProgramResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiplexProgramRequest,
  output: DeleteMultiplexProgramResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a Network. The Network must have no resources associated with it.
 */
export const deleteNetwork: (
  input: DeleteNetworkRequest,
) => effect.Effect<
  DeleteNetworkResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkRequest,
  output: DeleteNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a Node. The Node must be IDLE.
 */
export const deleteNode: (
  input: DeleteNodeRequest,
) => effect.Effect<
  DeleteNodeResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNodeRequest,
  output: DeleteNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete an expired reservation.
 */
export const deleteReservation: (
  input: DeleteReservationRequest,
) => effect.Effect<
  DeleteReservationResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReservationRequest,
  output: DeleteReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces a summary of an Input Security Group
 */
export const describeInputSecurityGroup: (
  input: DescribeInputSecurityGroupRequest,
) => effect.Effect<
  DescribeInputSecurityGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputSecurityGroupRequest,
  output: DescribeInputSecurityGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * List the alerts for a channel with optional filtering based on alert state.
 */
export const listAlerts: {
  (
    input: ListAlertsRequest,
  ): effect.Effect<
    ListAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAlertsRequest,
  ) => stream.Stream<
    ListAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAlertsRequest,
  ) => stream.Stream<
    ChannelAlert,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAlertsRequest,
  output: ListAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Alerts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the alerts for a cluster with optional filtering based on alert state.
 */
export const listClusterAlerts: {
  (
    input: ListClusterAlertsRequest,
  ): effect.Effect<
    ListClusterAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClusterAlertsRequest,
  ) => stream.Stream<
    ListClusterAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClusterAlertsRequest,
  ) => stream.Stream<
    ClusterAlert,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClusterAlertsRequest,
  output: ListClusterAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Alerts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the alerts for a multiplex with optional filtering based on alert state.
 */
export const listMultiplexAlerts: {
  (
    input: ListMultiplexAlertsRequest,
  ): effect.Effect<
    ListMultiplexAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultiplexAlertsRequest,
  ) => stream.Stream<
    ListMultiplexAlertsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMultiplexAlertsRequest,
  ) => stream.Stream<
    MultiplexAlert,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultiplexAlertsRequest,
  output: ListMultiplexAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Alerts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the programs that currently exist for a specific multiplex.
 */
export const listMultiplexPrograms: {
  (
    input: ListMultiplexProgramsRequest,
  ): effect.Effect<
    ListMultiplexProgramsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultiplexProgramsRequest,
  ) => stream.Stream<
    ListMultiplexProgramsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMultiplexProgramsRequest,
  ) => stream.Stream<
    MultiplexProgramSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultiplexProgramsRequest,
  output: ListMultiplexProgramsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MultiplexPrograms",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Purchase an offering and create a reservation.
 */
export const purchaseOffering: (
  input: PurchaseOfferingRequest,
) => effect.Effect<
  PurchaseOfferingResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseOfferingRequest,
  output: PurchaseOfferingResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a channel
 */
export const describeChannel: (
  input: DescribeChannelRequest,
) => effect.Effect<
  DescribeChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a ChannelPlacementGroup.
 */
export const describeChannelPlacementGroup: (
  input: DescribeChannelPlacementGroupRequest,
) => effect.Effect<
  DescribeChannelPlacementGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelPlacementGroupRequest,
  output: DescribeChannelPlacementGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a Cluster.
 */
export const describeCluster: (
  input: DescribeClusterRequest,
) => effect.Effect<
  DescribeClusterResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get the latest thumbnail data for the input device.
 */
export const describeInputDeviceThumbnail: (
  input: DescribeInputDeviceThumbnailRequest,
) => effect.Effect<
  DescribeInputDeviceThumbnailResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputDeviceThumbnailRequest,
  output: DescribeInputDeviceThumbnailResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a multiplex.
 */
export const describeMultiplex: (
  input: DescribeMultiplexRequest,
) => effect.Effect<
  DescribeMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiplexRequest,
  output: DescribeMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get the details for a program in a multiplex.
 */
export const describeMultiplexProgram: (
  input: DescribeMultiplexProgramRequest,
) => effect.Effect<
  DescribeMultiplexProgramResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiplexProgramRequest,
  output: DescribeMultiplexProgramResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a Network.
 */
export const describeNetwork: (
  input: DescribeNetworkRequest,
) => effect.Effect<
  DescribeNetworkResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNetworkRequest,
  output: DescribeNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a Node in the specified Cluster.
 */
export const describeNode: (
  input: DescribeNodeRequest,
) => effect.Effect<
  DescribeNodeResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodeRequest,
  output: DescribeNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details for an offering.
 */
export const describeOffering: (
  input: DescribeOfferingRequest,
) => effect.Effect<
  DescribeOfferingResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOfferingRequest,
  output: DescribeOfferingResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details for a reservation.
 */
export const describeReservation: (
  input: DescribeReservationRequest,
) => effect.Effect<
  DescribeReservationResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReservationRequest,
  output: DescribeReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get a channel schedule
 */
export const describeSchedule: {
  (
    input: DescribeScheduleRequest,
  ): effect.Effect<
    DescribeScheduleResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScheduleRequest,
  ) => stream.Stream<
    DescribeScheduleResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScheduleRequest,
  ) => stream.Stream<
    ScheduleAction,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScheduleRequest,
  output: DescribeScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScheduleActions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets details about a SdiSource.
 */
export const describeSdiSource: (
  input: DescribeSdiSourceRequest,
) => effect.Effect<
  DescribeSdiSourceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSdiSourceRequest,
  output: DescribeSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an Input Security Group
 */
export const deleteInputSecurityGroup: (
  input: DeleteInputSecurityGroupRequest,
) => effect.Effect<
  DeleteInputSecurityGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInputSecurityGroupRequest,
  output: DeleteInputSecurityGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete all schedule actions on a channel.
 */
export const deleteSchedule: (
  input: DeleteScheduleRequest,
) => effect.Effect<
  DeleteScheduleResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleRequest,
  output: DeleteScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete an SdiSource. The SdiSource must not be part of any SidSourceMapping and must not be attached to any input.
 */
export const deleteSdiSource: (
  input: DeleteSdiSourceRequest,
) => effect.Effect<
  DeleteSdiSourceResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSdiSourceRequest,
  output: DeleteSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves an array of all the encoder engine versions that are available in this AWS account.
 */
export const listVersions: (
  input: ListVersionsRequest,
) => effect.Effect<
  ListVersionsResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVersionsRequest,
  output: ListVersionsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Restart pipelines in one channel that is currently running.
 */
export const restartChannelPipelines: (
  input: RestartChannelPipelinesRequest,
) => effect.Effect<
  RestartChannelPipelinesResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestartChannelPipelinesRequest,
  output: RestartChannelPipelinesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts an existing channel
 */
export const startChannel: (
  input: StartChannelRequest,
) => effect.Effect<
  StartChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChannelRequest,
  output: StartChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Start (run) the multiplex. Starting the multiplex does not start the channels. You must explicitly start each channel.
 */
export const startMultiplex: (
  input: StartMultiplexRequest,
) => effect.Effect<
  StartMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMultiplexRequest,
  output: StartMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a running channel
 */
export const stopChannel: (
  input: StopChannelRequest,
) => effect.Effect<
  StopChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopChannelRequest,
  output: StopChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a running multiplex. If the multiplex isn't running, this action has no effect.
 */
export const stopMultiplex: (
  input: StopMultiplexRequest,
) => effect.Effect<
  StopMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMultiplexRequest,
  output: StopMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Update an Input Security Group's Whilelists.
 */
export const updateInputSecurityGroup: (
  input: UpdateInputSecurityGroupRequest,
) => effect.Effect<
  UpdateInputSecurityGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputSecurityGroupRequest,
  output: UpdateInputSecurityGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Update reservation.
 */
export const updateReservation: (
  input: UpdateReservationRequest,
) => effect.Effect<
  UpdateReservationResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReservationRequest,
  output: UpdateReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the input end point
 */
export const deleteInput: (
  input: DeleteInputRequest,
) => effect.Effect<
  DeleteInputResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInputRequest,
  output: DeleteInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts existing resources
 */
export const batchStart: (
  input: BatchStartRequest,
) => effect.Effect<
  BatchStartResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStartRequest,
  output: BatchStartResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops running resources
 */
export const batchStop: (
  input: BatchStopRequest,
) => effect.Effect<
  BatchStopResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStopRequest,
  output: BatchStopResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts delete of resources.
 */
export const batchDelete: (
  input: BatchDeleteRequest,
) => effect.Effect<
  BatchDeleteResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteRequest,
  output: BatchDeleteResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts deletion of channel. The associated outputs are also deleted.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => effect.Effect<
  DeleteChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates the creation of a new signal map. Will discover a new mediaResourceMap based on the provided discoveryEntryPointArn.
 */
export const createSignalMap: (
  input: CreateSignalMapRequest,
) => effect.Effect<
  CreateSignalMapResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSignalMapRequest,
  output: CreateSignalMapResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Change the settings for a Cluster.
 */
export const updateCluster: (
  input: UpdateClusterRequest,
) => effect.Effect<
  UpdateClusterResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the list of ChannelPlacementGroups in the specified Cluster.
 */
export const listChannelPlacementGroups: {
  (
    input: ListChannelPlacementGroupsRequest,
  ): effect.Effect<
    ListChannelPlacementGroupsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelPlacementGroupsRequest,
  ) => stream.Stream<
    ListChannelPlacementGroupsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelPlacementGroupsRequest,
  ) => stream.Stream<
    DescribeChannelPlacementGroupSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelPlacementGroupsRequest,
  output: ListChannelPlacementGroupsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ChannelPlacementGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Produces list of channels that have been created
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): effect.Effect<
    ListChannelsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ListChannelsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ChannelSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Channels",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the list of Clusters.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): effect.Effect<
    ListClustersResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ListClustersResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => stream.Stream<
    DescribeClusterSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Clusters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List input devices
 */
export const listInputDevices: {
  (
    input: ListInputDevicesRequest,
  ): effect.Effect<
    ListInputDevicesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInputDevicesRequest,
  ) => stream.Stream<
    ListInputDevicesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInputDevicesRequest,
  ) => stream.Stream<
    InputDeviceSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInputDevicesRequest,
  output: ListInputDevicesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InputDevices",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Produces a list of Input Security Groups for an account
 */
export const listInputSecurityGroups: {
  (
    input: ListInputSecurityGroupsRequest,
  ): effect.Effect<
    ListInputSecurityGroupsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInputSecurityGroupsRequest,
  ) => stream.Stream<
    ListInputSecurityGroupsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInputSecurityGroupsRequest,
  ) => stream.Stream<
    InputSecurityGroup,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInputSecurityGroupsRequest,
  output: ListInputSecurityGroupsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InputSecurityGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the list of Networks.
 */
export const listNetworks: {
  (
    input: ListNetworksRequest,
  ): effect.Effect<
    ListNetworksResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNetworksRequest,
  ) => stream.Stream<
    ListNetworksResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNetworksRequest,
  ) => stream.Stream<
    DescribeNetworkSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNetworksRequest,
  output: ListNetworksResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Networks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the list of Nodes.
 */
export const listNodes: {
  (
    input: ListNodesRequest,
  ): effect.Effect<
    ListNodesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesRequest,
  ) => stream.Stream<
    ListNodesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesRequest,
  ) => stream.Stream<
    DescribeNodeSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Nodes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List offerings available for purchase.
 */
export const listOfferings: {
  (
    input: ListOfferingsRequest,
  ): effect.Effect<
    ListOfferingsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOfferingsRequest,
  ) => stream.Stream<
    ListOfferingsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOfferingsRequest,
  ) => stream.Stream<
    Offering,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Offerings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List purchased reservations.
 */
export const listReservations: {
  (
    input: ListReservationsRequest,
  ): effect.Effect<
    ListReservationsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    ListReservationsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReservationsRequest,
  ) => stream.Stream<
    Reservation,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReservationsRequest,
  output: ListReservationsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Reservations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all the SdiSources in the AWS account.
 */
export const listSdiSources: {
  (
    input: ListSdiSourcesRequest,
  ): effect.Effect<
    ListSdiSourcesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSdiSourcesRequest,
  ) => stream.Stream<
    ListSdiSourcesResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSdiSourcesRequest,
  ) => stream.Stream<
    SdiSourceSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSdiSourcesRequest,
  output: ListSdiSourcesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SdiSources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Change the settings for a Network.
 */
export const updateNetwork: (
  input: UpdateNetworkRequest,
) => effect.Effect<
  UpdateNetworkResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkRequest,
  output: UpdateNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Change the settings for a Node.
 */
export const updateNode: (
  input: UpdateNodeRequest,
) => effect.Effect<
  UpdateNodeResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodeRequest,
  output: UpdateNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Describe account configuration
 */
export const describeAccountConfiguration: (
  input: DescribeAccountConfigurationRequest,
) => effect.Effect<
  DescribeAccountConfigurationResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountConfigurationRequest,
  output: DescribeAccountConfigurationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces list of inputs that have been created
 */
export const listInputs: {
  (
    input: ListInputsRequest,
  ): effect.Effect<
    ListInputsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInputsRequest,
  ) => stream.Stream<
    ListInputsResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInputsRequest,
  ) => stream.Stream<
    Input,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInputsRequest,
  output: ListInputsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Inputs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a Input Security Group
 */
export const createInputSecurityGroup: (
  input: CreateInputSecurityGroupRequest,
) => effect.Effect<
  CreateInputSecurityGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInputSecurityGroupRequest,
  output: CreateInputSecurityGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a partner input
 */
export const createPartnerInput: (
  input: CreatePartnerInputRequest,
) => effect.Effect<
  CreatePartnerInputResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartnerInputRequest,
  output: CreatePartnerInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Change some of the settings in an SdiSource.
 */
export const updateSdiSource: (
  input: UpdateSdiSourceRequest,
) => effect.Effect<
  UpdateSdiSourceResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSdiSourceRequest,
  output: UpdateSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create as many Networks as you need. You will associate one or more Clusters with each Network.Each Network provides MediaLive Anywhere with required information about the network in your organization that you are using for video encoding using MediaLive.
 */
export const createNetwork: (
  input: CreateNetworkRequest,
) => effect.Effect<
  CreateNetworkResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkRequest,
  output: CreateNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create the Register Node script for all the nodes intended for a specific Cluster. You will then run the script on each hardware unit that is intended for that Cluster. The script creates a Node in the specified Cluster. It then binds the Node to this hardware unit, and activates the node hardware for use with MediaLive Anywhere.
 */
export const createNodeRegistrationScript: (
  input: CreateNodeRegistrationScriptRequest,
) => effect.Effect<
  CreateNodeRegistrationScriptResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodeRegistrationScriptRequest,
  output: CreateNodeRegistrationScriptResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create an SdiSource for each video source that uses the SDI protocol. You will reference the SdiSource when you create an SDI input in MediaLive. You will also reference it in an SdiSourceMapping, in order to create a connection between the logical SdiSource and the physical SDI card and port that the physical SDI source uses.
 */
export const createSdiSource: (
  input: CreateSdiSourceRequest,
) => effect.Effect<
  CreateSdiSourceResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSdiSourceRequest,
  output: CreateSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new Cluster.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => effect.Effect<
  CreateClusterResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces details about an input
 */
export const describeInput: (
  input: DescribeInputRequest,
) => effect.Effect<
  DescribeInputResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputRequest,
  output: DescribeInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create an input
 */
export const createInput: (
  input: CreateInputRequest,
) => effect.Effect<
  CreateInputResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInputRequest,
  output: CreateInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a channel.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => effect.Effect<
  UpdateChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates the parameters for the input device.
 */
export const updateInputDevice: (
  input: UpdateInputDeviceRequest,
) => effect.Effect<
  UpdateInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputDeviceRequest,
  output: UpdateInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates a multiplex.
 */
export const updateMultiplex: (
  input: UpdateMultiplexRequest,
) => effect.Effect<
  UpdateMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMultiplexRequest,
  output: UpdateMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
  ],
}));
/**
 * Changes the class of the channel.
 */
export const updateChannelClass: (
  input: UpdateChannelClassRequest,
) => effect.Effect<
  UpdateChannelClassResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelClassRequest,
  output: UpdateChannelClassResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Update a program in a multiplex.
 */
export const updateMultiplexProgram: (
  input: UpdateMultiplexProgramRequest,
) => effect.Effect<
  UpdateMultiplexProgramResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMultiplexProgramRequest,
  output: UpdateMultiplexProgramResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
  ],
}));
/**
 * Send a request to claim an AWS Elemental device that you have purchased from a third-party vendor. After the request succeeds, you will own the device.
 */
export const claimDevice: (
  input: ClaimDeviceRequest,
) => effect.Effect<
  ClaimDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClaimDeviceRequest,
  output: ClaimDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Send a reboot command to the specified input device. The device will begin rebooting within a few seconds of sending the command. When the reboot is complete, the device’s connection status will change to connected.
 */
export const rebootInputDevice: (
  input: RebootInputDeviceRequest,
) => effect.Effect<
  RebootInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootInputDeviceRequest,
  output: RebootInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Start an input device that is attached to a MediaConnect flow. (There is no need to start a device that is attached to a MediaLive input; MediaLive starts the device when the channel starts.)
 */
export const startInputDevice: (
  input: StartInputDeviceRequest,
) => effect.Effect<
  StartInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInputDeviceRequest,
  output: StartInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Start a maintenance window for the specified input device. Starting a maintenance window will give the device up to two hours to install software. If the device was streaming prior to the maintenance, it will resume streaming when the software is fully installed. Devices automatically install updates while they are powered on and their MediaLive channels are stopped. A maintenance window allows you to update a device without having to stop MediaLive channels that use the device. The device must remain powered on and connected to the internet for the duration of the maintenance.
 */
export const startInputDeviceMaintenanceWindow: (
  input: StartInputDeviceMaintenanceWindowRequest,
) => effect.Effect<
  StartInputDeviceMaintenanceWindowResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInputDeviceMaintenanceWindowRequest,
  output: StartInputDeviceMaintenanceWindowResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Stop an input device that is attached to a MediaConnect flow. (There is no need to stop a device that is attached to a MediaLive input; MediaLive automatically stops the device when the channel stops.)
 */
export const stopInputDevice: (
  input: StopInputDeviceRequest,
) => effect.Effect<
  StopInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopInputDeviceRequest,
  output: StopInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Cancel an input device transfer that you have requested.
 */
export const cancelInputDeviceTransfer: (
  input: CancelInputDeviceTransferRequest,
) => effect.Effect<
  CancelInputDeviceTransferResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelInputDeviceTransferRequest,
  output: CancelInputDeviceTransferResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Reject the transfer of the specified input device to your AWS account.
 */
export const rejectInputDeviceTransfer: (
  input: RejectInputDeviceTransferRequest,
) => effect.Effect<
  RejectInputDeviceTransferResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectInputDeviceTransferRequest,
  output: RejectInputDeviceTransferResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Start an input device transfer to another AWS account. After you make the request, the other account must accept or reject the transfer.
 */
export const transferInputDevice: (
  input: TransferInputDeviceRequest,
) => effect.Effect<
  TransferInputDeviceResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferInputDeviceRequest,
  output: TransferInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Accept an incoming input device transfer. The ownership of the device will transfer to your AWS account.
 */
export const acceptInputDeviceTransfer: (
  input: AcceptInputDeviceTransferRequest,
) => effect.Effect<
  AcceptInputDeviceTransferResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInputDeviceTransferRequest,
  output: AcceptInputDeviceTransferResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * List input devices that are currently being transferred. List input devices that you are transferring from your AWS account or input devices that another AWS account is transferring to you.
 */
export const listInputDeviceTransfers: {
  (
    input: ListInputDeviceTransfersRequest,
  ): effect.Effect<
    ListInputDeviceTransfersResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInputDeviceTransfersRequest,
  ) => stream.Stream<
    ListInputDeviceTransfersResponse,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInputDeviceTransfersRequest,
  ) => stream.Stream<
    TransferringInputDeviceSummary,
    | BadGatewayException
    | BadRequestException
    | ForbiddenException
    | GatewayTimeoutException
    | InternalServerErrorException
    | TooManyRequestsException
    | UnprocessableEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInputDeviceTransfersRequest,
  output: ListInputDeviceTransfersResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InputDeviceTransfers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update account configuration
 */
export const updateAccountConfiguration: (
  input: UpdateAccountConfigurationRequest,
) => effect.Effect<
  UpdateAccountConfigurationResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountConfigurationRequest,
  output: UpdateAccountConfigurationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a ChannelPlacementGroup in the specified Cluster. As part of the create operation, you specify the Nodes to attach the group to.After you create a ChannelPlacementGroup, you add Channels to the group (you do this by modifying the Channels to add them to a specific group). You now have an association of Channels to ChannelPlacementGroup, and ChannelPlacementGroup to Nodes. This association means that all the Channels in the group are able to run on any of the Nodes associated with the group.
 */
export const createChannelPlacementGroup: (
  input: CreateChannelPlacementGroupRequest,
) => effect.Effect<
  CreateChannelPlacementGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelPlacementGroupRequest,
  output: CreateChannelPlacementGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a Node in the specified Cluster. You can also create Nodes using the CreateNodeRegistrationScript. Note that you can't move a Node to another Cluster.
 */
export const createNode: (
  input: CreateNodeRequest,
) => effect.Effect<
  CreateNodeResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodeRequest,
  output: CreateNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Change the settings for a ChannelPlacementGroup.
 */
export const updateChannelPlacementGroup: (
  input: UpdateChannelPlacementGroupRequest,
) => effect.Effect<
  UpdateChannelPlacementGroupResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelPlacementGroupRequest,
  output: UpdateChannelPlacementGroupResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Update the state of a node.
 */
export const updateNodeState: (
  input: UpdateNodeStateRequest,
) => effect.Effect<
  UpdateNodeStateResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodeStateRequest,
  output: UpdateNodeStateResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a new multiplex.
 */
export const createMultiplex: (
  input: CreateMultiplexRequest,
) => effect.Effect<
  CreateMultiplexResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiplexRequest,
  output: CreateMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a new program in the multiplex.
 */
export const createMultiplexProgram: (
  input: CreateMultiplexProgramRequest,
) => effect.Effect<
  CreateMultiplexProgramResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiplexProgramRequest,
  output: CreateMultiplexProgramResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Creates a new channel
 */
export const createChannel: (
  input: CreateChannelRequest,
) => effect.Effect<
  CreateChannelResponse,
  | BadGatewayException
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Update a channel schedule
 */
export const batchUpdateSchedule: (
  input: BatchUpdateScheduleRequest,
) => effect.Effect<
  BatchUpdateScheduleResponse,
  | BadGatewayException
  | BadRequestException
  | ForbiddenException
  | GatewayTimeoutException
  | InternalServerErrorException
  | NotFoundException
  | TooManyRequestsException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateScheduleRequest,
  output: BatchUpdateScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
