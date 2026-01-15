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
  sdkId: "ConnectCampaignsV2",
  serviceShapeName: "AmazonConnectCampaignServiceV2",
});
const auth = T.AwsAuthSigv4({ name: "connect-campaigns" });
const ver = T.ServiceVersion("2024-04-23");
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
              `https://connect-campaigns-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://connect-campaigns-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://connect-campaigns.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://connect-campaigns.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CampaignName = string;
export type InstanceId = string;
export type ExternalCampaignType = string;
export type Arn = string;
export type CampaignId = string;
export type ChannelSubtype = string;
export type CommunicationLimitsConfigType = string;
export type CommunicationTimeConfigType = string;
export type CampaignDeletionPolicy = string;
export type MaxResults = number;
export type NextToken = string;
export type TagKey = string;
export type Iso8601Duration = string;
export type InstanceLimitsHandling = string;
export type TagValue = string;
export type ClientToken = string;
export type ProfileId = string;
export type Enabled = boolean;
export type EncryptionType = string;
export type EncryptionKey = string;
export type XAmazonErrorType = string;
export type CampaignState = string;
export type Capacity = number;
export type QueueId = string;
export type TimeZone = string;
export type LocalTimeZoneDetectionType = string;
export type LambdaArn = string;
export type InstanceIdFilterOperator = string;
export type CampaignArn = string;
export type GetCampaignStateBatchFailureCode = string;
export type ServiceLinkedRoleArn = string;
export type InstanceOnboardingJobStatusCode = string;
export type InstanceOnboardingJobFailureCode = string;
export type ContactFlowId = string;
export type SourcePhoneNumber = string;
export type RingTimeout = number;
export type EmailAddress = string | redacted.Redacted<string>;
export type EmailDisplayName = string | redacted.Redacted<string>;
export type CommunicationLimitTimeUnit = string;
export type EventType = string;
export type ObjectTypeName = string;
export type DestinationPhoneNumber = string | redacted.Redacted<string>;
export type BandwidthAllocation = number;
export type AgentAction = string;
export type DayOfWeek = string;
export type RestrictedPeriodName = string;
export type Iso8601Date = string;
export type AttributeName = string;
export type AttributeValue = string;
export type ProfileOutboundRequestId = string;
export type ProfileOutboundRequestFailureCode = string;
export type TimeoutDuration = number;
export type Iso8601Time = string;
export type DialRequestId = string;
export type FailureCode = string;

//# Schemas
export type CampaignIdList = string[];
export const CampaignIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteCampaignRequest {
  id: string;
}
export const DeleteCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/campaigns/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCampaignRequest",
}) as any as S.Schema<DeleteCampaignRequest>;
export interface DeleteCampaignResponse {}
export const DeleteCampaignResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteCampaignResponse" },
) as any as S.Schema<DeleteCampaignResponse>;
export interface DeleteCampaignChannelSubtypeConfigRequest {
  id: string;
  channelSubtype: string;
}
export const DeleteCampaignChannelSubtypeConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    channelSubtype: S.String.pipe(T.HttpQuery("channelSubtype")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/campaigns/{id}/channel-subtype-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCampaignChannelSubtypeConfigRequest",
}) as any as S.Schema<DeleteCampaignChannelSubtypeConfigRequest>;
export interface DeleteCampaignChannelSubtypeConfigResponse {}
export const DeleteCampaignChannelSubtypeConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCampaignChannelSubtypeConfigResponse",
}) as any as S.Schema<DeleteCampaignChannelSubtypeConfigResponse>;
export interface DeleteCampaignCommunicationLimitsRequest {
  id: string;
  config: string;
}
export const DeleteCampaignCommunicationLimitsRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    config: S.String.pipe(T.HttpQuery("config")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/campaigns/{id}/communication-limits",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCampaignCommunicationLimitsRequest",
}) as any as S.Schema<DeleteCampaignCommunicationLimitsRequest>;
export interface DeleteCampaignCommunicationLimitsResponse {}
export const DeleteCampaignCommunicationLimitsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCampaignCommunicationLimitsResponse",
}) as any as S.Schema<DeleteCampaignCommunicationLimitsResponse>;
export interface DeleteCampaignCommunicationTimeRequest {
  id: string;
  config: string;
}
export const DeleteCampaignCommunicationTimeRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    config: S.String.pipe(T.HttpQuery("config")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/campaigns/{id}/communication-time",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCampaignCommunicationTimeRequest",
}) as any as S.Schema<DeleteCampaignCommunicationTimeRequest>;
export interface DeleteCampaignCommunicationTimeResponse {}
export const DeleteCampaignCommunicationTimeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCampaignCommunicationTimeResponse",
}) as any as S.Schema<DeleteCampaignCommunicationTimeResponse>;
export interface DeleteConnectInstanceConfigRequest {
  connectInstanceId: string;
  campaignDeletionPolicy?: string;
}
export const DeleteConnectInstanceConfigRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    campaignDeletionPolicy: S.optional(S.String).pipe(
      T.HttpQuery("campaignDeletionPolicy"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/connect-instance/{connectInstanceId}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectInstanceConfigRequest",
}) as any as S.Schema<DeleteConnectInstanceConfigRequest>;
export interface DeleteConnectInstanceConfigResponse {}
export const DeleteConnectInstanceConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectInstanceConfigResponse",
}) as any as S.Schema<DeleteConnectInstanceConfigResponse>;
export interface DeleteInstanceOnboardingJobRequest {
  connectInstanceId: string;
}
export const DeleteInstanceOnboardingJobRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/connect-instance/{connectInstanceId}/onboarding",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInstanceOnboardingJobRequest",
}) as any as S.Schema<DeleteInstanceOnboardingJobRequest>;
export interface DeleteInstanceOnboardingJobResponse {}
export const DeleteInstanceOnboardingJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInstanceOnboardingJobResponse",
}) as any as S.Schema<DeleteInstanceOnboardingJobResponse>;
export interface DescribeCampaignRequest {
  id: string;
}
export const DescribeCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/campaigns/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCampaignRequest",
}) as any as S.Schema<DescribeCampaignRequest>;
export interface GetCampaignStateRequest {
  id: string;
}
export const GetCampaignStateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/campaigns/{id}/state" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCampaignStateRequest",
}) as any as S.Schema<GetCampaignStateRequest>;
export interface GetCampaignStateBatchRequest {
  campaignIds: string[];
}
export const GetCampaignStateBatchRequest = S.suspend(() =>
  S.Struct({ campaignIds: CampaignIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns-state" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCampaignStateBatchRequest",
}) as any as S.Schema<GetCampaignStateBatchRequest>;
export interface GetConnectInstanceConfigRequest {
  connectInstanceId: string;
}
export const GetConnectInstanceConfigRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/connect-instance/{connectInstanceId}/config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectInstanceConfigRequest",
}) as any as S.Schema<GetConnectInstanceConfigRequest>;
export interface GetInstanceCommunicationLimitsRequest {
  connectInstanceId: string;
}
export const GetInstanceCommunicationLimitsRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/connect-instance/{connectInstanceId}/communication-limits",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceCommunicationLimitsRequest",
}) as any as S.Schema<GetInstanceCommunicationLimitsRequest>;
export interface GetInstanceOnboardingJobStatusRequest {
  connectInstanceId: string;
}
export const GetInstanceOnboardingJobStatusRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/connect-instance/{connectInstanceId}/onboarding",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInstanceOnboardingJobStatusRequest",
}) as any as S.Schema<GetInstanceOnboardingJobStatusRequest>;
export interface ListConnectInstanceIntegrationsRequest {
  connectInstanceId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListConnectInstanceIntegrationsRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/connect-instance/{connectInstanceId}/integrations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectInstanceIntegrationsRequest",
}) as any as S.Schema<ListConnectInstanceIntegrationsRequest>;
export interface ListTagsForResourceRequest {
  arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/tags/{arn}" }),
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
export interface PauseCampaignRequest {
  id: string;
}
export const PauseCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/pause" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PauseCampaignRequest",
}) as any as S.Schema<PauseCampaignRequest>;
export interface PauseCampaignResponse {}
export const PauseCampaignResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PauseCampaignResponse",
}) as any as S.Schema<PauseCampaignResponse>;
export interface ResumeCampaignRequest {
  id: string;
}
export const ResumeCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/resume" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResumeCampaignRequest",
}) as any as S.Schema<ResumeCampaignRequest>;
export interface ResumeCampaignResponse {}
export const ResumeCampaignResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "ResumeCampaignResponse" },
) as any as S.Schema<ResumeCampaignResponse>;
export interface StartCampaignRequest {
  id: string;
}
export const StartCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCampaignRequest",
}) as any as S.Schema<StartCampaignRequest>;
export interface StartCampaignResponse {}
export const StartCampaignResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartCampaignResponse",
}) as any as S.Schema<StartCampaignResponse>;
export interface StopCampaignRequest {
  id: string;
}
export const StopCampaignRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopCampaignRequest",
}) as any as S.Schema<StopCampaignRequest>;
export interface StopCampaignResponse {}
export const StopCampaignResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopCampaignResponse",
}) as any as S.Schema<StopCampaignResponse>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  arn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/tags/{arn}" }),
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
  arn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/tags/{arn}" }),
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
export interface ProgressiveConfig {
  bandwidthAllocation: number;
}
export const ProgressiveConfig = S.suspend(() =>
  S.Struct({ bandwidthAllocation: S.Number }),
).annotations({
  identifier: "ProgressiveConfig",
}) as any as S.Schema<ProgressiveConfig>;
export interface PredictiveConfig {
  bandwidthAllocation: number;
}
export const PredictiveConfig = S.suspend(() =>
  S.Struct({ bandwidthAllocation: S.Number }),
).annotations({
  identifier: "PredictiveConfig",
}) as any as S.Schema<PredictiveConfig>;
export interface AgentlessConfig {}
export const AgentlessConfig = S.suspend(() => S.Struct({})).annotations({
  identifier: "AgentlessConfig",
}) as any as S.Schema<AgentlessConfig>;
export interface TimeoutConfig {
  durationInSeconds: number;
}
export const TimeoutConfig = S.suspend(() =>
  S.Struct({ durationInSeconds: S.Number }),
).annotations({
  identifier: "TimeoutConfig",
}) as any as S.Schema<TimeoutConfig>;
export type AgentActions = string[];
export const AgentActions = S.Array(S.String);
export interface PreviewConfig {
  bandwidthAllocation: number;
  timeoutConfig: TimeoutConfig;
  agentActions?: string[];
}
export const PreviewConfig = S.suspend(() =>
  S.Struct({
    bandwidthAllocation: S.Number,
    timeoutConfig: TimeoutConfig,
    agentActions: S.optional(AgentActions),
  }),
).annotations({
  identifier: "PreviewConfig",
}) as any as S.Schema<PreviewConfig>;
export type TelephonyOutboundMode =
  | {
      progressive: ProgressiveConfig;
      predictive?: never;
      agentless?: never;
      preview?: never;
    }
  | {
      progressive?: never;
      predictive: PredictiveConfig;
      agentless?: never;
      preview?: never;
    }
  | {
      progressive?: never;
      predictive?: never;
      agentless: AgentlessConfig;
      preview?: never;
    }
  | {
      progressive?: never;
      predictive?: never;
      agentless?: never;
      preview: PreviewConfig;
    };
export const TelephonyOutboundMode = S.Union(
  S.Struct({ progressive: ProgressiveConfig }),
  S.Struct({ predictive: PredictiveConfig }),
  S.Struct({ agentless: AgentlessConfig }),
  S.Struct({ preview: PreviewConfig }),
);
export interface AnswerMachineDetectionConfig {
  enableAnswerMachineDetection: boolean;
  awaitAnswerMachinePrompt?: boolean;
}
export const AnswerMachineDetectionConfig = S.suspend(() =>
  S.Struct({
    enableAnswerMachineDetection: S.Boolean,
    awaitAnswerMachinePrompt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AnswerMachineDetectionConfig",
}) as any as S.Schema<AnswerMachineDetectionConfig>;
export interface TelephonyOutboundConfig {
  connectContactFlowId: string;
  connectSourcePhoneNumber?: string;
  answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
  ringTimeout?: number;
}
export const TelephonyOutboundConfig = S.suspend(() =>
  S.Struct({
    connectContactFlowId: S.String,
    connectSourcePhoneNumber: S.optional(S.String),
    answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
    ringTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "TelephonyOutboundConfig",
}) as any as S.Schema<TelephonyOutboundConfig>;
export interface TelephonyChannelSubtypeConfig {
  capacity?: number;
  connectQueueId?: string;
  outboundMode: TelephonyOutboundMode;
  defaultOutboundConfig: TelephonyOutboundConfig;
}
export const TelephonyChannelSubtypeConfig = S.suspend(() =>
  S.Struct({
    capacity: S.optional(S.Number),
    connectQueueId: S.optional(S.String),
    outboundMode: TelephonyOutboundMode,
    defaultOutboundConfig: TelephonyOutboundConfig,
  }),
).annotations({
  identifier: "TelephonyChannelSubtypeConfig",
}) as any as S.Schema<TelephonyChannelSubtypeConfig>;
export type SmsOutboundMode = { agentless: AgentlessConfig };
export const SmsOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export interface SmsOutboundConfig {
  connectSourcePhoneNumberArn: string;
  wisdomTemplateArn: string;
}
export const SmsOutboundConfig = S.suspend(() =>
  S.Struct({
    connectSourcePhoneNumberArn: S.String,
    wisdomTemplateArn: S.String,
  }),
).annotations({
  identifier: "SmsOutboundConfig",
}) as any as S.Schema<SmsOutboundConfig>;
export interface SmsChannelSubtypeConfig {
  capacity?: number;
  outboundMode: SmsOutboundMode;
  defaultOutboundConfig: SmsOutboundConfig;
}
export const SmsChannelSubtypeConfig = S.suspend(() =>
  S.Struct({
    capacity: S.optional(S.Number),
    outboundMode: SmsOutboundMode,
    defaultOutboundConfig: SmsOutboundConfig,
  }),
).annotations({
  identifier: "SmsChannelSubtypeConfig",
}) as any as S.Schema<SmsChannelSubtypeConfig>;
export type EmailOutboundMode = { agentless: AgentlessConfig };
export const EmailOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export interface EmailOutboundConfig {
  connectSourceEmailAddress: string | redacted.Redacted<string>;
  sourceEmailAddressDisplayName?: string | redacted.Redacted<string>;
  wisdomTemplateArn: string;
}
export const EmailOutboundConfig = S.suspend(() =>
  S.Struct({
    connectSourceEmailAddress: SensitiveString,
    sourceEmailAddressDisplayName: S.optional(SensitiveString),
    wisdomTemplateArn: S.String,
  }),
).annotations({
  identifier: "EmailOutboundConfig",
}) as any as S.Schema<EmailOutboundConfig>;
export interface EmailChannelSubtypeConfig {
  capacity?: number;
  outboundMode: EmailOutboundMode;
  defaultOutboundConfig: EmailOutboundConfig;
}
export const EmailChannelSubtypeConfig = S.suspend(() =>
  S.Struct({
    capacity: S.optional(S.Number),
    outboundMode: EmailOutboundMode,
    defaultOutboundConfig: EmailOutboundConfig,
  }),
).annotations({
  identifier: "EmailChannelSubtypeConfig",
}) as any as S.Schema<EmailChannelSubtypeConfig>;
export type WhatsAppOutboundMode = { agentless: AgentlessConfig };
export const WhatsAppOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export interface WhatsAppOutboundConfig {
  connectSourcePhoneNumberArn: string;
  wisdomTemplateArn: string;
}
export const WhatsAppOutboundConfig = S.suspend(() =>
  S.Struct({
    connectSourcePhoneNumberArn: S.String,
    wisdomTemplateArn: S.String,
  }),
).annotations({
  identifier: "WhatsAppOutboundConfig",
}) as any as S.Schema<WhatsAppOutboundConfig>;
export interface WhatsAppChannelSubtypeConfig {
  capacity?: number;
  outboundMode: WhatsAppOutboundMode;
  defaultOutboundConfig: WhatsAppOutboundConfig;
}
export const WhatsAppChannelSubtypeConfig = S.suspend(() =>
  S.Struct({
    capacity: S.optional(S.Number),
    outboundMode: WhatsAppOutboundMode,
    defaultOutboundConfig: WhatsAppOutboundConfig,
  }),
).annotations({
  identifier: "WhatsAppChannelSubtypeConfig",
}) as any as S.Schema<WhatsAppChannelSubtypeConfig>;
export interface ChannelSubtypeConfig {
  telephony?: TelephonyChannelSubtypeConfig;
  sms?: SmsChannelSubtypeConfig;
  email?: EmailChannelSubtypeConfig;
  whatsApp?: WhatsAppChannelSubtypeConfig;
}
export const ChannelSubtypeConfig = S.suspend(() =>
  S.Struct({
    telephony: S.optional(TelephonyChannelSubtypeConfig),
    sms: S.optional(SmsChannelSubtypeConfig),
    email: S.optional(EmailChannelSubtypeConfig),
    whatsApp: S.optional(WhatsAppChannelSubtypeConfig),
  }),
).annotations({
  identifier: "ChannelSubtypeConfig",
}) as any as S.Schema<ChannelSubtypeConfig>;
export interface UpdateCampaignChannelSubtypeConfigRequest {
  id: string;
  channelSubtypeConfig: ChannelSubtypeConfig;
}
export const UpdateCampaignChannelSubtypeConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    channelSubtypeConfig: ChannelSubtypeConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/campaigns/{id}/channel-subtype-config",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignChannelSubtypeConfigRequest",
}) as any as S.Schema<UpdateCampaignChannelSubtypeConfigRequest>;
export interface UpdateCampaignChannelSubtypeConfigResponse {}
export const UpdateCampaignChannelSubtypeConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignChannelSubtypeConfigResponse",
}) as any as S.Schema<UpdateCampaignChannelSubtypeConfigResponse>;
export interface CommunicationLimit {
  maxCountPerRecipient: number;
  frequency: number;
  unit: string;
}
export const CommunicationLimit = S.suspend(() =>
  S.Struct({
    maxCountPerRecipient: S.Number,
    frequency: S.Number,
    unit: S.String,
  }),
).annotations({
  identifier: "CommunicationLimit",
}) as any as S.Schema<CommunicationLimit>;
export type CommunicationLimitList = CommunicationLimit[];
export const CommunicationLimitList = S.Array(CommunicationLimit);
export type CommunicationLimits = {
  communicationLimitsList: CommunicationLimit[];
};
export const CommunicationLimits = S.Union(
  S.Struct({ communicationLimitsList: CommunicationLimitList }),
);
export interface CommunicationLimitsConfig {
  allChannelSubtypes?: CommunicationLimits;
  instanceLimitsHandling?: string;
}
export const CommunicationLimitsConfig = S.suspend(() =>
  S.Struct({
    allChannelSubtypes: S.optional(CommunicationLimits),
    instanceLimitsHandling: S.optional(S.String),
  }),
).annotations({
  identifier: "CommunicationLimitsConfig",
}) as any as S.Schema<CommunicationLimitsConfig>;
export interface UpdateCampaignCommunicationLimitsRequest {
  id: string;
  communicationLimitsOverride: CommunicationLimitsConfig;
}
export const UpdateCampaignCommunicationLimitsRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    communicationLimitsOverride: CommunicationLimitsConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/campaigns/{id}/communication-limits",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignCommunicationLimitsRequest",
}) as any as S.Schema<UpdateCampaignCommunicationLimitsRequest>;
export interface UpdateCampaignCommunicationLimitsResponse {}
export const UpdateCampaignCommunicationLimitsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignCommunicationLimitsResponse",
}) as any as S.Schema<UpdateCampaignCommunicationLimitsResponse>;
export type LocalTimeZoneDetection = string[];
export const LocalTimeZoneDetection = S.Array(S.String);
export interface LocalTimeZoneConfig {
  defaultTimeZone?: string;
  localTimeZoneDetection?: string[];
}
export const LocalTimeZoneConfig = S.suspend(() =>
  S.Struct({
    defaultTimeZone: S.optional(S.String),
    localTimeZoneDetection: S.optional(LocalTimeZoneDetection),
  }),
).annotations({
  identifier: "LocalTimeZoneConfig",
}) as any as S.Schema<LocalTimeZoneConfig>;
export interface TimeRange {
  startTime: string;
  endTime: string;
}
export const TimeRange = S.suspend(() =>
  S.Struct({ startTime: S.String, endTime: S.String }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export type TimeRangeList = TimeRange[];
export const TimeRangeList = S.Array(TimeRange);
export type DailyHours = { [key: string]: TimeRange[] | undefined };
export const DailyHours = S.Record({
  key: S.String,
  value: S.UndefinedOr(TimeRangeList),
});
export type OpenHours = {
  dailyHours: { [key: string]: TimeRange[] | undefined };
};
export const OpenHours = S.Union(S.Struct({ dailyHours: DailyHours }));
export interface RestrictedPeriod {
  name?: string;
  startDate: string;
  endDate: string;
}
export const RestrictedPeriod = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    startDate: S.String,
    endDate: S.String,
  }),
).annotations({
  identifier: "RestrictedPeriod",
}) as any as S.Schema<RestrictedPeriod>;
export type RestrictedPeriodList = RestrictedPeriod[];
export const RestrictedPeriodList = S.Array(RestrictedPeriod);
export type RestrictedPeriods = { restrictedPeriodList: RestrictedPeriod[] };
export const RestrictedPeriods = S.Union(
  S.Struct({ restrictedPeriodList: RestrictedPeriodList }),
);
export interface TimeWindow {
  openHours: OpenHours;
  restrictedPeriods?: RestrictedPeriods;
}
export const TimeWindow = S.suspend(() =>
  S.Struct({
    openHours: OpenHours,
    restrictedPeriods: S.optional(RestrictedPeriods),
  }),
).annotations({ identifier: "TimeWindow" }) as any as S.Schema<TimeWindow>;
export interface CommunicationTimeConfig {
  localTimeZoneConfig: LocalTimeZoneConfig;
  telephony?: TimeWindow;
  sms?: TimeWindow;
  email?: TimeWindow;
  whatsApp?: TimeWindow;
}
export const CommunicationTimeConfig = S.suspend(() =>
  S.Struct({
    localTimeZoneConfig: LocalTimeZoneConfig,
    telephony: S.optional(TimeWindow),
    sms: S.optional(TimeWindow),
    email: S.optional(TimeWindow),
    whatsApp: S.optional(TimeWindow),
  }),
).annotations({
  identifier: "CommunicationTimeConfig",
}) as any as S.Schema<CommunicationTimeConfig>;
export interface UpdateCampaignCommunicationTimeRequest {
  id: string;
  communicationTimeConfig: CommunicationTimeConfig;
}
export const UpdateCampaignCommunicationTimeRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    communicationTimeConfig: CommunicationTimeConfig,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/communication-time" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignCommunicationTimeRequest",
}) as any as S.Schema<UpdateCampaignCommunicationTimeRequest>;
export interface UpdateCampaignCommunicationTimeResponse {}
export const UpdateCampaignCommunicationTimeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignCommunicationTimeResponse",
}) as any as S.Schema<UpdateCampaignCommunicationTimeResponse>;
export interface UpdateCampaignFlowAssociationRequest {
  id: string;
  connectCampaignFlowArn: string;
}
export const UpdateCampaignFlowAssociationRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    connectCampaignFlowArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignFlowAssociationRequest",
}) as any as S.Schema<UpdateCampaignFlowAssociationRequest>;
export interface UpdateCampaignFlowAssociationResponse {}
export const UpdateCampaignFlowAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignFlowAssociationResponse",
}) as any as S.Schema<UpdateCampaignFlowAssociationResponse>;
export interface UpdateCampaignNameRequest {
  id: string;
  name: string;
}
export const UpdateCampaignNameRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")), name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/name" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignNameRequest",
}) as any as S.Schema<UpdateCampaignNameRequest>;
export interface UpdateCampaignNameResponse {}
export const UpdateCampaignNameResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignNameResponse",
}) as any as S.Schema<UpdateCampaignNameResponse>;
export interface Schedule {
  startTime: Date;
  endTime: Date;
  refreshFrequency?: string;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    refreshFrequency: S.optional(S.String),
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export interface UpdateCampaignScheduleRequest {
  id: string;
  schedule: Schedule;
}
export const UpdateCampaignScheduleRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")), schedule: Schedule }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/schedule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignScheduleRequest",
}) as any as S.Schema<UpdateCampaignScheduleRequest>;
export interface UpdateCampaignScheduleResponse {}
export const UpdateCampaignScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignScheduleResponse",
}) as any as S.Schema<UpdateCampaignScheduleResponse>;
export interface EventTrigger {
  customerProfilesDomainArn?: string;
}
export const EventTrigger = S.suspend(() =>
  S.Struct({ customerProfilesDomainArn: S.optional(S.String) }),
).annotations({ identifier: "EventTrigger" }) as any as S.Schema<EventTrigger>;
export type Source =
  | { customerProfilesSegmentArn: string; eventTrigger?: never }
  | { customerProfilesSegmentArn?: never; eventTrigger: EventTrigger };
export const Source = S.Union(
  S.Struct({ customerProfilesSegmentArn: S.String }),
  S.Struct({ eventTrigger: EventTrigger }),
);
export interface UpdateCampaignSourceRequest {
  id: string;
  source: Source;
}
export const UpdateCampaignSourceRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")), source: Source }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns/{id}/source" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignSourceRequest",
}) as any as S.Schema<UpdateCampaignSourceRequest>;
export interface UpdateCampaignSourceResponse {}
export const UpdateCampaignSourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignSourceResponse",
}) as any as S.Schema<UpdateCampaignSourceResponse>;
export interface InstanceCommunicationLimitsConfig {
  allChannelSubtypes?: CommunicationLimits;
}
export const InstanceCommunicationLimitsConfig = S.suspend(() =>
  S.Struct({ allChannelSubtypes: S.optional(CommunicationLimits) }),
).annotations({
  identifier: "InstanceCommunicationLimitsConfig",
}) as any as S.Schema<InstanceCommunicationLimitsConfig>;
export interface ProfileOutboundRequest {
  clientToken: string;
  profileId: string;
  expirationTime?: Date;
}
export const ProfileOutboundRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    profileId: S.String,
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ProfileOutboundRequest",
}) as any as S.Schema<ProfileOutboundRequest>;
export type ProfileOutboundRequestList = ProfileOutboundRequest[];
export const ProfileOutboundRequestList = S.Array(ProfileOutboundRequest);
export interface EncryptionConfig {
  enabled: boolean;
  encryptionType?: string;
  keyArn?: string;
}
export const EncryptionConfig = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    encryptionType: S.optional(S.String),
    keyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionConfig",
}) as any as S.Schema<EncryptionConfig>;
export interface GetCampaignStateResponse {
  state?: string;
}
export const GetCampaignStateResponse = S.suspend(() =>
  S.Struct({ state: S.optional(S.String) }),
).annotations({
  identifier: "GetCampaignStateResponse",
}) as any as S.Schema<GetCampaignStateResponse>;
export interface GetInstanceCommunicationLimitsResponse {
  communicationLimitsConfig?: InstanceCommunicationLimitsConfig;
}
export const GetInstanceCommunicationLimitsResponse = S.suspend(() =>
  S.Struct({
    communicationLimitsConfig: S.optional(InstanceCommunicationLimitsConfig),
  }),
).annotations({
  identifier: "GetInstanceCommunicationLimitsResponse",
}) as any as S.Schema<GetInstanceCommunicationLimitsResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutInstanceCommunicationLimitsRequest {
  connectInstanceId: string;
  communicationLimitsConfig: InstanceCommunicationLimitsConfig;
}
export const PutInstanceCommunicationLimitsRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    communicationLimitsConfig: InstanceCommunicationLimitsConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/connect-instance/{connectInstanceId}/communication-limits",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutInstanceCommunicationLimitsRequest",
}) as any as S.Schema<PutInstanceCommunicationLimitsRequest>;
export interface PutInstanceCommunicationLimitsResponse {}
export const PutInstanceCommunicationLimitsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutInstanceCommunicationLimitsResponse",
}) as any as S.Schema<PutInstanceCommunicationLimitsResponse>;
export interface PutProfileOutboundRequestBatchRequest {
  id: string;
  profileOutboundRequests: ProfileOutboundRequest[];
}
export const PutProfileOutboundRequestBatchRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    profileOutboundRequests: ProfileOutboundRequestList,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/campaigns/{id}/profile-outbound-requests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutProfileOutboundRequestBatchRequest",
}) as any as S.Schema<PutProfileOutboundRequestBatchRequest>;
export interface StartInstanceOnboardingJobRequest {
  connectInstanceId: string;
  encryptionConfig: EncryptionConfig;
}
export const StartInstanceOnboardingJobRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    encryptionConfig: EncryptionConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/connect-instance/{connectInstanceId}/onboarding",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInstanceOnboardingJobRequest",
}) as any as S.Schema<StartInstanceOnboardingJobRequest>;
export interface CustomerProfilesIntegrationIdentifier {
  domainArn: string;
}
export const CustomerProfilesIntegrationIdentifier = S.suspend(() =>
  S.Struct({ domainArn: S.String }),
).annotations({
  identifier: "CustomerProfilesIntegrationIdentifier",
}) as any as S.Schema<CustomerProfilesIntegrationIdentifier>;
export interface QConnectIntegrationIdentifier {
  knowledgeBaseArn: string;
}
export const QConnectIntegrationIdentifier = S.suspend(() =>
  S.Struct({ knowledgeBaseArn: S.String }),
).annotations({
  identifier: "QConnectIntegrationIdentifier",
}) as any as S.Schema<QConnectIntegrationIdentifier>;
export interface LambdaIntegrationIdentifier {
  functionArn: string;
}
export const LambdaIntegrationIdentifier = S.suspend(() =>
  S.Struct({ functionArn: S.String }),
).annotations({
  identifier: "LambdaIntegrationIdentifier",
}) as any as S.Schema<LambdaIntegrationIdentifier>;
export interface InstanceIdFilter {
  value: string;
  operator: string;
}
export const InstanceIdFilter = S.suspend(() =>
  S.Struct({ value: S.String, operator: S.String }),
).annotations({
  identifier: "InstanceIdFilter",
}) as any as S.Schema<InstanceIdFilter>;
export interface QConnectIntegrationConfig {
  knowledgeBaseArn: string;
}
export const QConnectIntegrationConfig = S.suspend(() =>
  S.Struct({ knowledgeBaseArn: S.String }),
).annotations({
  identifier: "QConnectIntegrationConfig",
}) as any as S.Schema<QConnectIntegrationConfig>;
export interface LambdaIntegrationConfig {
  functionArn: string;
}
export const LambdaIntegrationConfig = S.suspend(() =>
  S.Struct({ functionArn: S.String }),
).annotations({
  identifier: "LambdaIntegrationConfig",
}) as any as S.Schema<LambdaIntegrationConfig>;
export type IntegrationIdentifier =
  | {
      customerProfiles: CustomerProfilesIntegrationIdentifier;
      qConnect?: never;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect: QConnectIntegrationIdentifier;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect?: never;
      lambda: LambdaIntegrationIdentifier;
    };
export const IntegrationIdentifier = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationIdentifier }),
  S.Struct({ qConnect: QConnectIntegrationIdentifier }),
  S.Struct({ lambda: LambdaIntegrationIdentifier }),
);
export interface Campaign {
  id: string;
  arn: string;
  name: string;
  connectInstanceId: string;
  channelSubtypeConfig?: ChannelSubtypeConfig;
  type?: string;
  source?: Source;
  connectCampaignFlowArn?: string;
  schedule?: Schedule;
  communicationTimeConfig?: CommunicationTimeConfig;
  communicationLimitsOverride?: CommunicationLimitsConfig;
  tags?: { [key: string]: string | undefined };
}
export const Campaign = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    connectInstanceId: S.String,
    channelSubtypeConfig: S.optional(ChannelSubtypeConfig),
    type: S.optional(S.String),
    source: S.optional(Source),
    connectCampaignFlowArn: S.optional(S.String),
    schedule: S.optional(Schedule),
    communicationTimeConfig: S.optional(CommunicationTimeConfig),
    communicationLimitsOverride: S.optional(CommunicationLimitsConfig),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Campaign" }) as any as S.Schema<Campaign>;
export interface SuccessfulCampaignStateResponse {
  campaignId?: string;
  state?: string;
}
export const SuccessfulCampaignStateResponse = S.suspend(() =>
  S.Struct({ campaignId: S.optional(S.String), state: S.optional(S.String) }),
).annotations({
  identifier: "SuccessfulCampaignStateResponse",
}) as any as S.Schema<SuccessfulCampaignStateResponse>;
export type SuccessfulCampaignStateResponseList =
  SuccessfulCampaignStateResponse[];
export const SuccessfulCampaignStateResponseList = S.Array(
  SuccessfulCampaignStateResponse,
);
export interface FailedCampaignStateResponse {
  campaignId?: string;
  failureCode?: string;
}
export const FailedCampaignStateResponse = S.suspend(() =>
  S.Struct({
    campaignId: S.optional(S.String),
    failureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedCampaignStateResponse",
}) as any as S.Schema<FailedCampaignStateResponse>;
export type FailedCampaignStateResponseList = FailedCampaignStateResponse[];
export const FailedCampaignStateResponseList = S.Array(
  FailedCampaignStateResponse,
);
export interface InstanceConfig {
  connectInstanceId: string;
  serviceLinkedRoleArn: string;
  encryptionConfig: EncryptionConfig;
}
export const InstanceConfig = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String,
    serviceLinkedRoleArn: S.String,
    encryptionConfig: EncryptionConfig,
  }),
).annotations({
  identifier: "InstanceConfig",
}) as any as S.Schema<InstanceConfig>;
export interface InstanceOnboardingJobStatus {
  connectInstanceId: string;
  status: string;
  failureCode?: string;
}
export const InstanceOnboardingJobStatus = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String,
    status: S.String,
    failureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceOnboardingJobStatus",
}) as any as S.Schema<InstanceOnboardingJobStatus>;
export interface CampaignFilters {
  instanceIdFilter?: InstanceIdFilter;
}
export const CampaignFilters = S.suspend(() =>
  S.Struct({ instanceIdFilter: S.optional(InstanceIdFilter) }),
).annotations({
  identifier: "CampaignFilters",
}) as any as S.Schema<CampaignFilters>;
export type ObjectTypeNamesMap = { [key: string]: string | undefined };
export const ObjectTypeNamesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type Attributes = { [key: string]: string | undefined };
export const Attributes = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SmsChannelSubtypeParameters {
  destinationPhoneNumber: string | redacted.Redacted<string>;
  connectSourcePhoneNumberArn?: string;
  templateArn?: string;
  templateParameters: { [key: string]: string | undefined };
}
export const SmsChannelSubtypeParameters = S.suspend(() =>
  S.Struct({
    destinationPhoneNumber: SensitiveString,
    connectSourcePhoneNumberArn: S.optional(S.String),
    templateArn: S.optional(S.String),
    templateParameters: Attributes,
  }),
).annotations({
  identifier: "SmsChannelSubtypeParameters",
}) as any as S.Schema<SmsChannelSubtypeParameters>;
export interface EmailChannelSubtypeParameters {
  destinationEmailAddress: string | redacted.Redacted<string>;
  connectSourceEmailAddress?: string | redacted.Redacted<string>;
  templateArn?: string;
  templateParameters: { [key: string]: string | undefined };
}
export const EmailChannelSubtypeParameters = S.suspend(() =>
  S.Struct({
    destinationEmailAddress: SensitiveString,
    connectSourceEmailAddress: S.optional(SensitiveString),
    templateArn: S.optional(S.String),
    templateParameters: Attributes,
  }),
).annotations({
  identifier: "EmailChannelSubtypeParameters",
}) as any as S.Schema<EmailChannelSubtypeParameters>;
export interface WhatsAppChannelSubtypeParameters {
  destinationPhoneNumber: string | redacted.Redacted<string>;
  connectSourcePhoneNumberArn?: string;
  templateArn?: string;
  templateParameters: { [key: string]: string | undefined };
}
export const WhatsAppChannelSubtypeParameters = S.suspend(() =>
  S.Struct({
    destinationPhoneNumber: SensitiveString,
    connectSourcePhoneNumberArn: S.optional(S.String),
    templateArn: S.optional(S.String),
    templateParameters: Attributes,
  }),
).annotations({
  identifier: "WhatsAppChannelSubtypeParameters",
}) as any as S.Schema<WhatsAppChannelSubtypeParameters>;
export interface DeleteConnectInstanceIntegrationRequest {
  connectInstanceId: string;
  integrationIdentifier: IntegrationIdentifier;
}
export const DeleteConnectInstanceIntegrationRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    integrationIdentifier: IntegrationIdentifier,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/connect-instance/{connectInstanceId}/integrations/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectInstanceIntegrationRequest",
}) as any as S.Schema<DeleteConnectInstanceIntegrationRequest>;
export interface DeleteConnectInstanceIntegrationResponse {}
export const DeleteConnectInstanceIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectInstanceIntegrationResponse",
}) as any as S.Schema<DeleteConnectInstanceIntegrationResponse>;
export interface DescribeCampaignResponse {
  campaign?: Campaign;
}
export const DescribeCampaignResponse = S.suspend(() =>
  S.Struct({ campaign: S.optional(Campaign) }),
).annotations({
  identifier: "DescribeCampaignResponse",
}) as any as S.Schema<DescribeCampaignResponse>;
export interface GetCampaignStateBatchResponse {
  successfulRequests?: SuccessfulCampaignStateResponse[];
  failedRequests?: FailedCampaignStateResponse[];
}
export const GetCampaignStateBatchResponse = S.suspend(() =>
  S.Struct({
    successfulRequests: S.optional(SuccessfulCampaignStateResponseList),
    failedRequests: S.optional(FailedCampaignStateResponseList),
  }),
).annotations({
  identifier: "GetCampaignStateBatchResponse",
}) as any as S.Schema<GetCampaignStateBatchResponse>;
export interface GetConnectInstanceConfigResponse {
  connectInstanceConfig?: InstanceConfig;
}
export const GetConnectInstanceConfigResponse = S.suspend(() =>
  S.Struct({ connectInstanceConfig: S.optional(InstanceConfig) }),
).annotations({
  identifier: "GetConnectInstanceConfigResponse",
}) as any as S.Schema<GetConnectInstanceConfigResponse>;
export interface GetInstanceOnboardingJobStatusResponse {
  connectInstanceOnboardingJobStatus?: InstanceOnboardingJobStatus;
}
export const GetInstanceOnboardingJobStatusResponse = S.suspend(() =>
  S.Struct({
    connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
  }),
).annotations({
  identifier: "GetInstanceOnboardingJobStatusResponse",
}) as any as S.Schema<GetInstanceOnboardingJobStatusResponse>;
export interface ListCampaignsRequest {
  maxResults?: number;
  nextToken?: string;
  filters?: CampaignFilters;
}
export const ListCampaignsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(CampaignFilters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/campaigns-summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCampaignsRequest",
}) as any as S.Schema<ListCampaignsRequest>;
export interface StartInstanceOnboardingJobResponse {
  connectInstanceOnboardingJobStatus?: InstanceOnboardingJobStatus;
}
export const StartInstanceOnboardingJobResponse = S.suspend(() =>
  S.Struct({
    connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
  }),
).annotations({
  identifier: "StartInstanceOnboardingJobResponse",
}) as any as S.Schema<StartInstanceOnboardingJobResponse>;
export interface CustomerProfilesIntegrationSummary {
  domainArn: string;
  objectTypeNames: { [key: string]: string | undefined };
}
export const CustomerProfilesIntegrationSummary = S.suspend(() =>
  S.Struct({ domainArn: S.String, objectTypeNames: ObjectTypeNamesMap }),
).annotations({
  identifier: "CustomerProfilesIntegrationSummary",
}) as any as S.Schema<CustomerProfilesIntegrationSummary>;
export interface QConnectIntegrationSummary {
  knowledgeBaseArn: string;
}
export const QConnectIntegrationSummary = S.suspend(() =>
  S.Struct({ knowledgeBaseArn: S.String }),
).annotations({
  identifier: "QConnectIntegrationSummary",
}) as any as S.Schema<QConnectIntegrationSummary>;
export interface LambdaIntegrationSummary {
  functionArn: string;
}
export const LambdaIntegrationSummary = S.suspend(() =>
  S.Struct({ functionArn: S.String }),
).annotations({
  identifier: "LambdaIntegrationSummary",
}) as any as S.Schema<LambdaIntegrationSummary>;
export interface CustomerProfilesIntegrationConfig {
  domainArn: string;
  objectTypeNames: { [key: string]: string | undefined };
}
export const CustomerProfilesIntegrationConfig = S.suspend(() =>
  S.Struct({ domainArn: S.String, objectTypeNames: ObjectTypeNamesMap }),
).annotations({
  identifier: "CustomerProfilesIntegrationConfig",
}) as any as S.Schema<CustomerProfilesIntegrationConfig>;
export type IntegrationSummary =
  | {
      customerProfiles: CustomerProfilesIntegrationSummary;
      qConnect?: never;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect: QConnectIntegrationSummary;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect?: never;
      lambda: LambdaIntegrationSummary;
    };
export const IntegrationSummary = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationSummary }),
  S.Struct({ qConnect: QConnectIntegrationSummary }),
  S.Struct({ lambda: LambdaIntegrationSummary }),
);
export type IntegrationSummaryList = IntegrationSummary[];
export const IntegrationSummaryList = S.Array(IntegrationSummary);
export type IntegrationConfig =
  | {
      customerProfiles: CustomerProfilesIntegrationConfig;
      qConnect?: never;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect: QConnectIntegrationConfig;
      lambda?: never;
    }
  | {
      customerProfiles?: never;
      qConnect?: never;
      lambda: LambdaIntegrationConfig;
    };
export const IntegrationConfig = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationConfig }),
  S.Struct({ qConnect: QConnectIntegrationConfig }),
  S.Struct({ lambda: LambdaIntegrationConfig }),
);
export interface SuccessfulProfileOutboundRequest {
  clientToken?: string;
  id?: string;
}
export const SuccessfulProfileOutboundRequest = S.suspend(() =>
  S.Struct({ clientToken: S.optional(S.String), id: S.optional(S.String) }),
).annotations({
  identifier: "SuccessfulProfileOutboundRequest",
}) as any as S.Schema<SuccessfulProfileOutboundRequest>;
export type SuccessfulProfileOutboundRequestList =
  SuccessfulProfileOutboundRequest[];
export const SuccessfulProfileOutboundRequestList = S.Array(
  SuccessfulProfileOutboundRequest,
);
export interface FailedProfileOutboundRequest {
  clientToken?: string;
  id?: string;
  failureCode?: string;
}
export const FailedProfileOutboundRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    id: S.optional(S.String),
    failureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedProfileOutboundRequest",
}) as any as S.Schema<FailedProfileOutboundRequest>;
export type FailedProfileOutboundRequestList = FailedProfileOutboundRequest[];
export const FailedProfileOutboundRequestList = S.Array(
  FailedProfileOutboundRequest,
);
export interface TelephonyChannelSubtypeParameters {
  destinationPhoneNumber: string | redacted.Redacted<string>;
  attributes: { [key: string]: string | undefined };
  connectSourcePhoneNumber?: string;
  answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
  ringTimeout?: number;
}
export const TelephonyChannelSubtypeParameters = S.suspend(() =>
  S.Struct({
    destinationPhoneNumber: SensitiveString,
    attributes: Attributes,
    connectSourcePhoneNumber: S.optional(S.String),
    answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
    ringTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "TelephonyChannelSubtypeParameters",
}) as any as S.Schema<TelephonyChannelSubtypeParameters>;
export interface ListConnectInstanceIntegrationsResponse {
  nextToken?: string;
  integrationSummaryList?: IntegrationSummary[];
}
export const ListConnectInstanceIntegrationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    integrationSummaryList: S.optional(IntegrationSummaryList),
  }),
).annotations({
  identifier: "ListConnectInstanceIntegrationsResponse",
}) as any as S.Schema<ListConnectInstanceIntegrationsResponse>;
export interface PutConnectInstanceIntegrationRequest {
  connectInstanceId: string;
  integrationConfig: IntegrationConfig;
}
export const PutConnectInstanceIntegrationRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    integrationConfig: IntegrationConfig,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/connect-instance/{connectInstanceId}/integrations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConnectInstanceIntegrationRequest",
}) as any as S.Schema<PutConnectInstanceIntegrationRequest>;
export interface PutConnectInstanceIntegrationResponse {}
export const PutConnectInstanceIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConnectInstanceIntegrationResponse",
}) as any as S.Schema<PutConnectInstanceIntegrationResponse>;
export interface PutProfileOutboundRequestBatchResponse {
  successfulRequests?: SuccessfulProfileOutboundRequest[];
  failedRequests?: FailedProfileOutboundRequest[];
}
export const PutProfileOutboundRequestBatchResponse = S.suspend(() =>
  S.Struct({
    successfulRequests: S.optional(SuccessfulProfileOutboundRequestList),
    failedRequests: S.optional(FailedProfileOutboundRequestList),
  }),
).annotations({
  identifier: "PutProfileOutboundRequestBatchResponse",
}) as any as S.Schema<PutProfileOutboundRequestBatchResponse>;
export type ChannelSubtypeList = string[];
export const ChannelSubtypeList = S.Array(S.String);
export type ChannelSubtypeParameters =
  | {
      telephony: TelephonyChannelSubtypeParameters;
      sms?: never;
      email?: never;
      whatsApp?: never;
    }
  | {
      telephony?: never;
      sms: SmsChannelSubtypeParameters;
      email?: never;
      whatsApp?: never;
    }
  | {
      telephony?: never;
      sms?: never;
      email: EmailChannelSubtypeParameters;
      whatsApp?: never;
    }
  | {
      telephony?: never;
      sms?: never;
      email?: never;
      whatsApp: WhatsAppChannelSubtypeParameters;
    };
export const ChannelSubtypeParameters = S.Union(
  S.Struct({ telephony: TelephonyChannelSubtypeParameters }),
  S.Struct({ sms: SmsChannelSubtypeParameters }),
  S.Struct({ email: EmailChannelSubtypeParameters }),
  S.Struct({ whatsApp: WhatsAppChannelSubtypeParameters }),
);
export interface CampaignSummary {
  id: string;
  arn: string;
  name: string;
  connectInstanceId: string;
  channelSubtypes: string[];
  type?: string;
  schedule?: Schedule;
  connectCampaignFlowArn?: string;
}
export const CampaignSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    connectInstanceId: S.String,
    channelSubtypes: ChannelSubtypeList,
    type: S.optional(S.String),
    schedule: S.optional(Schedule),
    connectCampaignFlowArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CampaignSummary",
}) as any as S.Schema<CampaignSummary>;
export type CampaignSummaryList = CampaignSummary[];
export const CampaignSummaryList = S.Array(CampaignSummary);
export interface OutboundRequest {
  clientToken: string;
  expirationTime: Date;
  channelSubtypeParameters: ChannelSubtypeParameters;
}
export const OutboundRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    expirationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    channelSubtypeParameters: ChannelSubtypeParameters,
  }),
).annotations({
  identifier: "OutboundRequest",
}) as any as S.Schema<OutboundRequest>;
export type OutboundRequestList = OutboundRequest[];
export const OutboundRequestList = S.Array(OutboundRequest);
export interface ListCampaignsResponse {
  nextToken?: string;
  campaignSummaryList?: CampaignSummary[];
}
export const ListCampaignsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    campaignSummaryList: S.optional(CampaignSummaryList),
  }),
).annotations({
  identifier: "ListCampaignsResponse",
}) as any as S.Schema<ListCampaignsResponse>;
export interface PutOutboundRequestBatchRequest {
  id: string;
  outboundRequests: OutboundRequest[];
}
export const PutOutboundRequestBatchRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    outboundRequests: OutboundRequestList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/campaigns/{id}/outbound-requests" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutOutboundRequestBatchRequest",
}) as any as S.Schema<PutOutboundRequestBatchRequest>;
export interface CreateCampaignRequest {
  name: string;
  connectInstanceId: string;
  channelSubtypeConfig?: ChannelSubtypeConfig;
  type?: string;
  source?: Source;
  connectCampaignFlowArn?: string;
  schedule?: Schedule;
  communicationTimeConfig?: CommunicationTimeConfig;
  communicationLimitsOverride?: CommunicationLimitsConfig;
  tags?: { [key: string]: string | undefined };
}
export const CreateCampaignRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    connectInstanceId: S.String,
    channelSubtypeConfig: S.optional(ChannelSubtypeConfig),
    type: S.optional(S.String),
    source: S.optional(Source),
    connectCampaignFlowArn: S.optional(S.String),
    schedule: S.optional(Schedule),
    communicationTimeConfig: S.optional(CommunicationTimeConfig),
    communicationLimitsOverride: S.optional(CommunicationLimitsConfig),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/campaigns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCampaignRequest",
}) as any as S.Schema<CreateCampaignRequest>;
export interface SuccessfulRequest {
  clientToken?: string;
  id?: string;
}
export const SuccessfulRequest = S.suspend(() =>
  S.Struct({ clientToken: S.optional(S.String), id: S.optional(S.String) }),
).annotations({
  identifier: "SuccessfulRequest",
}) as any as S.Schema<SuccessfulRequest>;
export type SuccessfulRequestList = SuccessfulRequest[];
export const SuccessfulRequestList = S.Array(SuccessfulRequest);
export interface FailedRequest {
  clientToken?: string;
  id?: string;
  failureCode?: string;
}
export const FailedRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    id: S.optional(S.String),
    failureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedRequest",
}) as any as S.Schema<FailedRequest>;
export type FailedRequestList = FailedRequest[];
export const FailedRequestList = S.Array(FailedRequest);
export interface CreateCampaignResponse {
  id?: string;
  arn?: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateCampaignResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "CreateCampaignResponse",
}) as any as S.Schema<CreateCampaignResponse>;
export interface PutOutboundRequestBatchResponse {
  successfulRequests?: SuccessfulRequest[];
  failedRequests?: FailedRequest[];
}
export const PutOutboundRequestBatchResponse = S.suspend(() =>
  S.Struct({
    successfulRequests: S.optional(SuccessfulRequestList),
    failedRequests: S.optional(FailedRequestList),
  }),
).annotations({
  identifier: "PutOutboundRequestBatchResponse",
}) as any as S.Schema<PutOutboundRequestBatchResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withConflictError) {}
export class InvalidCampaignStateException extends S.TaggedError<InvalidCampaignStateException>()(
  "InvalidCampaignStateException",
  {
    state: S.String,
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withConflictError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Deletes a campaign from the specified Amazon Connect account.
 */
export const deleteCampaign: (
  input: DeleteCampaignRequest,
) => effect.Effect<
  DeleteCampaignResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides summary information about the campaigns under the specified Amazon Connect account.
 */
export const listCampaigns: {
  (
    input: ListCampaignsRequest,
  ): effect.Effect<
    ListCampaignsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    ListCampaignsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    CampaignSummary,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCampaignsRequest,
  output: ListCampaignsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "campaignSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get state of campaigns for the specified Amazon Connect account.
 */
export const getCampaignStateBatch: (
  input: GetCampaignStateBatchRequest,
) => effect.Effect<
  GetCampaignStateBatchResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignStateBatchRequest,
  output: GetCampaignStateBatchResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides summary information about the integration under the specified Connect instance.
 */
export const listConnectInstanceIntegrations: {
  (
    input: ListConnectInstanceIntegrationsRequest,
  ): effect.Effect<
    ListConnectInstanceIntegrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectInstanceIntegrationsRequest,
  ) => stream.Stream<
    ListConnectInstanceIntegrationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectInstanceIntegrationsRequest,
  ) => stream.Stream<
    IntegrationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectInstanceIntegrationsRequest,
  output: ListConnectInstanceIntegrationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "integrationSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Put or update the integration for the specified Amazon Connect instance.
 */
export const putConnectInstanceIntegration: (
  input: PutConnectInstanceIntegrationRequest,
) => effect.Effect<
  PutConnectInstanceIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConnectInstanceIntegrationRequest,
  output: PutConnectInstanceIntegrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a connect instance config from the specified AWS account.
 */
export const deleteConnectInstanceConfig: (
  input: DeleteConnectInstanceConfigRequest,
) => effect.Effect<
  DeleteConnectInstanceConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectInstanceConfigRequest,
  output: DeleteConnectInstanceConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete the integration for the specified Amazon Connect instance.
 */
export const deleteConnectInstanceIntegration: (
  input: DeleteConnectInstanceIntegrationRequest,
) => effect.Effect<
  DeleteConnectInstanceIntegrationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectInstanceIntegrationRequest,
  output: DeleteConnectInstanceIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the specific campaign.
 */
export const describeCampaign: (
  input: DescribeCampaignRequest,
) => effect.Effect<
  DescribeCampaignResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCampaignRequest,
  output: DescribeCampaignResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get the specific Connect instance config.
 */
export const getConnectInstanceConfig: (
  input: GetConnectInstanceConfigRequest,
) => effect.Effect<
  GetConnectInstanceConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectInstanceConfigRequest,
  output: GetConnectInstanceConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Get the specific instance onboarding job status.
 */
export const getInstanceOnboardingJobStatus: (
  input: GetInstanceOnboardingJobStatusRequest,
) => effect.Effect<
  GetInstanceOnboardingJobStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceOnboardingJobStatusRequest,
  output: GetInstanceOnboardingJobStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Put the instance communication limits. This API is idempotent.
 */
export const putInstanceCommunicationLimits: (
  input: PutInstanceCommunicationLimitsRequest,
) => effect.Effect<
  PutInstanceCommunicationLimitsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInstanceCommunicationLimitsRequest,
  output: PutInstanceCommunicationLimitsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Onboard the specific Amazon Connect instance to Connect Campaigns.
 */
export const startInstanceOnboardingJob: (
  input: StartInstanceOnboardingJobRequest,
) => effect.Effect<
  StartInstanceOnboardingJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInstanceOnboardingJobRequest,
  output: StartInstanceOnboardingJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get state of a campaign for the specified Amazon Connect account.
 */
export const getCampaignState: (
  input: GetCampaignStateRequest,
) => effect.Effect<
  GetCampaignStateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignStateRequest,
  output: GetCampaignStateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the instance communication limits.
 */
export const getInstanceCommunicationLimits: (
  input: GetInstanceCommunicationLimitsRequest,
) => effect.Effect<
  GetInstanceCommunicationLimitsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInstanceCommunicationLimitsRequest,
  output: GetInstanceCommunicationLimitsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * List tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tag a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Untag a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the channel subtype config of a campaign. This API is idempotent.
 */
export const deleteCampaignChannelSubtypeConfig: (
  input: DeleteCampaignChannelSubtypeConfigRequest,
) => effect.Effect<
  DeleteCampaignChannelSubtypeConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignChannelSubtypeConfigRequest,
  output: DeleteCampaignChannelSubtypeConfigResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the channel subtype config of a campaign. This API is idempotent.
 */
export const updateCampaignChannelSubtypeConfig: (
  input: UpdateCampaignChannelSubtypeConfigRequest,
) => effect.Effect<
  UpdateCampaignChannelSubtypeConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignChannelSubtypeConfigRequest,
  output: UpdateCampaignChannelSubtypeConfigResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the name of a campaign. This API is idempotent.
 */
export const updateCampaignName: (
  input: UpdateCampaignNameRequest,
) => effect.Effect<
  UpdateCampaignNameResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignNameRequest,
  output: UpdateCampaignNameResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the communication limits config for a campaign. This API is idempotent.
 */
export const deleteCampaignCommunicationLimits: (
  input: DeleteCampaignCommunicationLimitsRequest,
) => effect.Effect<
  DeleteCampaignCommunicationLimitsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignCommunicationLimitsRequest,
  output: DeleteCampaignCommunicationLimitsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Delete the Connect Campaigns onboarding job for the specified Amazon Connect instance.
 */
export const deleteInstanceOnboardingJob: (
  input: DeleteInstanceOnboardingJobRequest,
) => effect.Effect<
  DeleteInstanceOnboardingJobResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInstanceOnboardingJobRequest,
  output: DeleteInstanceOnboardingJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the communication time config for a campaign. This API is idempotent.
 */
export const deleteCampaignCommunicationTime: (
  input: DeleteCampaignCommunicationTimeRequest,
) => effect.Effect<
  DeleteCampaignCommunicationTimeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignCommunicationTimeRequest,
  output: DeleteCampaignCommunicationTimeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Pauses a campaign for the specified Amazon Connect account.
 */
export const pauseCampaign: (
  input: PauseCampaignRequest,
) => effect.Effect<
  PauseCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseCampaignRequest,
  output: PauseCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a campaign for the specified Amazon Connect account.
 */
export const resumeCampaign: (
  input: ResumeCampaignRequest,
) => effect.Effect<
  ResumeCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeCampaignRequest,
  output: ResumeCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a campaign for the specified Amazon Connect account.
 */
export const startCampaign: (
  input: StartCampaignRequest,
) => effect.Effect<
  StartCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCampaignRequest,
  output: StartCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a campaign for the specified Amazon Connect account.
 */
export const stopCampaign: (
  input: StopCampaignRequest,
) => effect.Effect<
  StopCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCampaignRequest,
  output: StopCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the communication limits config for a campaign. This API is idempotent.
 */
export const updateCampaignCommunicationLimits: (
  input: UpdateCampaignCommunicationLimitsRequest,
) => effect.Effect<
  UpdateCampaignCommunicationLimitsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignCommunicationLimitsRequest,
  output: UpdateCampaignCommunicationLimitsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the communication time config for a campaign. This API is idempotent.
 */
export const updateCampaignCommunicationTime: (
  input: UpdateCampaignCommunicationTimeRequest,
) => effect.Effect<
  UpdateCampaignCommunicationTimeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignCommunicationTimeRequest,
  output: UpdateCampaignCommunicationTimeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the campaign flow associated with a campaign. This API is idempotent.
 */
export const updateCampaignFlowAssociation: (
  input: UpdateCampaignFlowAssociationRequest,
) => effect.Effect<
  UpdateCampaignFlowAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignFlowAssociationRequest,
  output: UpdateCampaignFlowAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the schedule for a campaign. This API is idempotent.
 */
export const updateCampaignSchedule: (
  input: UpdateCampaignScheduleRequest,
) => effect.Effect<
  UpdateCampaignScheduleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignScheduleRequest,
  output: UpdateCampaignScheduleResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the campaign source with a campaign. This API is idempotent.
 */
export const updateCampaignSource: (
  input: UpdateCampaignSourceRequest,
) => effect.Effect<
  UpdateCampaignSourceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignSourceRequest,
  output: UpdateCampaignSourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Takes in a list of profile outbound requests to be placed as part of an outbound campaign. This API is idempotent.
 */
export const putProfileOutboundRequestBatch: (
  input: PutProfileOutboundRequestBatchRequest,
) => effect.Effect<
  PutProfileOutboundRequestBatchResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProfileOutboundRequestBatchRequest,
  output: PutProfileOutboundRequestBatchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates outbound requests for the specified campaign Amazon Connect account. This API is idempotent.
 */
export const putOutboundRequestBatch: (
  input: PutOutboundRequestBatchRequest,
) => effect.Effect<
  PutOutboundRequestBatchResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidCampaignStateException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOutboundRequestBatchRequest,
  output: PutOutboundRequestBatchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidCampaignStateException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a campaign for the specified Amazon Connect account. This API is idempotent.
 */
export const createCampaign: (
  input: CreateCampaignRequest,
) => effect.Effect<
  CreateCampaignResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCampaignRequest,
  output: CreateCampaignResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
