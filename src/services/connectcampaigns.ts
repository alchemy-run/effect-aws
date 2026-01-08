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
  sdkId: "ConnectCampaigns",
  serviceShapeName: "AmazonConnectCampaignService",
});
const auth = T.AwsAuthSigv4({ name: "connect-campaigns" });
const ver = T.ServiceVersion("2021-01-30");
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
export type CampaignId = string;
export type MaxResults = number;
export type NextToken = string;
export type Arn = string;
export type TagKey = string;
export type ContactFlowId = string;
export type SourcePhoneNumber = string;
export type QueueId = string;
export type TagValue = string;
export type ClientToken = string;
export type DestinationPhoneNumber = string | Redacted.Redacted<string>;
export type EncryptionType = string;
export type EncryptionKey = string;
export type XAmazonErrorType = string;
export type CampaignState = string;
export type BandwidthAllocation = number;
export type DialingCapacity = number;
export type InstanceIdFilterOperator = string;
export type AttributeName = string;
export type AttributeValue = string;
export type CampaignArn = string;
export type GetCampaignStateBatchFailureCode = string;
export type ServiceLinkedRoleArn = string;
export type InstanceOnboardingJobStatusCode = string;
export type InstanceOnboardingJobFailureCode = string;
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
      T.Http({ method: "DELETE", uri: "/campaigns/{id}" }),
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
export interface DeleteConnectInstanceConfigRequest {
  connectInstanceId: string;
}
export const DeleteConnectInstanceConfigRequest = S.suspend(() =>
  S.Struct({
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/connect-instance/{connectInstanceId}/config",
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
        uri: "/connect-instance/{connectInstanceId}/onboarding",
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
      T.Http({ method: "GET", uri: "/campaigns/{id}" }),
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
      T.Http({ method: "GET", uri: "/campaigns/{id}/state" }),
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
  campaignIds: CampaignIdList;
}
export const GetCampaignStateBatchRequest = S.suspend(() =>
  S.Struct({ campaignIds: CampaignIdList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/campaigns-state" }),
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
        uri: "/connect-instance/{connectInstanceId}/config",
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
        uri: "/connect-instance/{connectInstanceId}/onboarding",
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
export interface ListTagsForResourceRequest {
  arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{arn}" }),
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
      T.Http({ method: "POST", uri: "/campaigns/{id}/pause" }),
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
      T.Http({ method: "POST", uri: "/campaigns/{id}/resume" }),
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
      T.Http({ method: "POST", uri: "/campaigns/{id}/start" }),
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
      T.Http({ method: "POST", uri: "/campaigns/{id}/stop" }),
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  arn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export interface ProgressiveDialerConfig {
  bandwidthAllocation: number;
  dialingCapacity?: number;
}
export const ProgressiveDialerConfig = S.suspend(() =>
  S.Struct({
    bandwidthAllocation: S.Number,
    dialingCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProgressiveDialerConfig",
}) as any as S.Schema<ProgressiveDialerConfig>;
export interface PredictiveDialerConfig {
  bandwidthAllocation: number;
  dialingCapacity?: number;
}
export const PredictiveDialerConfig = S.suspend(() =>
  S.Struct({
    bandwidthAllocation: S.Number,
    dialingCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "PredictiveDialerConfig",
}) as any as S.Schema<PredictiveDialerConfig>;
export interface AgentlessDialerConfig {
  dialingCapacity?: number;
}
export const AgentlessDialerConfig = S.suspend(() =>
  S.Struct({ dialingCapacity: S.optional(S.Number) }),
).annotations({
  identifier: "AgentlessDialerConfig",
}) as any as S.Schema<AgentlessDialerConfig>;
export type DialerConfig =
  | { progressiveDialerConfig: ProgressiveDialerConfig }
  | { predictiveDialerConfig: PredictiveDialerConfig }
  | { agentlessDialerConfig: AgentlessDialerConfig };
export const DialerConfig = S.Union(
  S.Struct({ progressiveDialerConfig: ProgressiveDialerConfig }),
  S.Struct({ predictiveDialerConfig: PredictiveDialerConfig }),
  S.Struct({ agentlessDialerConfig: AgentlessDialerConfig }),
);
export interface UpdateCampaignDialerConfigRequest {
  id: string;
  dialerConfig: (typeof DialerConfig)["Type"];
}
export const UpdateCampaignDialerConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    dialerConfig: DialerConfig,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/campaigns/{id}/dialer-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignDialerConfigRequest",
}) as any as S.Schema<UpdateCampaignDialerConfigRequest>;
export interface UpdateCampaignDialerConfigResponse {}
export const UpdateCampaignDialerConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignDialerConfigResponse",
}) as any as S.Schema<UpdateCampaignDialerConfigResponse>;
export interface UpdateCampaignNameRequest {
  id: string;
  name: string;
}
export const UpdateCampaignNameRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")), name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/campaigns/{id}/name" }),
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
export interface OutboundCallConfig {
  connectContactFlowId: string;
  connectSourcePhoneNumber?: string;
  connectQueueId?: string;
  answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
}
export const OutboundCallConfig = S.suspend(() =>
  S.Struct({
    connectContactFlowId: S.String,
    connectSourcePhoneNumber: S.optional(S.String),
    connectQueueId: S.optional(S.String),
    answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
  }),
).annotations({
  identifier: "OutboundCallConfig",
}) as any as S.Schema<OutboundCallConfig>;
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
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
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
        uri: "/connect-instance/{connectInstanceId}/onboarding",
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
export interface UpdateCampaignOutboundCallConfigRequest {
  id: string;
  connectContactFlowId?: string;
  connectSourcePhoneNumber?: string;
  answerMachineDetectionConfig?: AnswerMachineDetectionConfig;
}
export const UpdateCampaignOutboundCallConfigRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    connectContactFlowId: S.optional(S.String),
    connectSourcePhoneNumber: S.optional(S.String),
    answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/campaigns/{id}/outbound-call-config" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCampaignOutboundCallConfigRequest",
}) as any as S.Schema<UpdateCampaignOutboundCallConfigRequest>;
export interface UpdateCampaignOutboundCallConfigResponse {}
export const UpdateCampaignOutboundCallConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCampaignOutboundCallConfigResponse",
}) as any as S.Schema<UpdateCampaignOutboundCallConfigResponse>;
export interface InstanceIdFilter {
  value: string;
  operator: string;
}
export const InstanceIdFilter = S.suspend(() =>
  S.Struct({ value: S.String, operator: S.String }),
).annotations({
  identifier: "InstanceIdFilter",
}) as any as S.Schema<InstanceIdFilter>;
export type Attributes = { [key: string]: string };
export const Attributes = S.Record({ key: S.String, value: S.String });
export interface Campaign {
  id: string;
  arn: string;
  name: string;
  connectInstanceId: string;
  dialerConfig: (typeof DialerConfig)["Type"];
  outboundCallConfig: OutboundCallConfig;
  tags?: TagMap;
}
export const Campaign = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    connectInstanceId: S.String,
    dialerConfig: DialerConfig,
    outboundCallConfig: OutboundCallConfig,
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
export interface DialRequest {
  clientToken: string;
  phoneNumber: string | Redacted.Redacted<string>;
  expirationTime: Date;
  attributes: Attributes;
}
export const DialRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String,
    phoneNumber: SensitiveString,
    expirationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    attributes: Attributes,
  }),
).annotations({ identifier: "DialRequest" }) as any as S.Schema<DialRequest>;
export type DialRequestList = DialRequest[];
export const DialRequestList = S.Array(DialRequest);
export interface CreateCampaignRequest {
  name: string;
  connectInstanceId: string;
  dialerConfig: (typeof DialerConfig)["Type"];
  outboundCallConfig: OutboundCallConfig;
  tags?: TagMap;
}
export const CreateCampaignRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    connectInstanceId: S.String,
    dialerConfig: DialerConfig,
    outboundCallConfig: OutboundCallConfig,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/campaigns" }),
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
export interface DescribeCampaignResponse {
  campaign?: Campaign;
}
export const DescribeCampaignResponse = S.suspend(() =>
  S.Struct({ campaign: S.optional(Campaign) }),
).annotations({
  identifier: "DescribeCampaignResponse",
}) as any as S.Schema<DescribeCampaignResponse>;
export interface GetCampaignStateBatchResponse {
  successfulRequests?: SuccessfulCampaignStateResponseList;
  failedRequests?: FailedCampaignStateResponseList;
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
      T.Http({ method: "POST", uri: "/campaigns-summary" }),
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
export interface PutDialRequestBatchRequest {
  id: string;
  dialRequests: DialRequestList;
}
export const PutDialRequestBatchRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    dialRequests: DialRequestList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/campaigns/{id}/dial-requests" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDialRequestBatchRequest",
}) as any as S.Schema<PutDialRequestBatchRequest>;
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
export interface CreateCampaignResponse {
  id?: string;
  arn?: string;
  tags?: TagMap;
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
export interface CampaignSummary {
  id: string;
  arn: string;
  name: string;
  connectInstanceId: string;
}
export const CampaignSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    connectInstanceId: S.String,
  }),
).annotations({
  identifier: "CampaignSummary",
}) as any as S.Schema<CampaignSummary>;
export type CampaignSummaryList = CampaignSummary[];
export const CampaignSummaryList = S.Array(CampaignSummary);
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
export interface ListCampaignsResponse {
  nextToken?: string;
  campaignSummaryList?: CampaignSummaryList;
}
export const ListCampaignsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    campaignSummaryList: S.optional(CampaignSummaryList),
  }),
).annotations({
  identifier: "ListCampaignsResponse",
}) as any as S.Schema<ListCampaignsResponse>;
export interface PutDialRequestBatchResponse {
  successfulRequests?: SuccessfulRequestList;
  failedRequests?: FailedRequestList;
}
export const PutDialRequestBatchResponse = S.suspend(() =>
  S.Struct({
    successfulRequests: S.optional(SuccessfulRequestList),
    failedRequests: S.optional(FailedRequestList),
  }),
).annotations({
  identifier: "PutDialRequestBatchResponse",
}) as any as S.Schema<PutDialRequestBatchResponse>;

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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListCampaignsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCampaignsRequest,
  ) => Stream.Stream<
    ListCampaignsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCampaignsRequest,
  ) => Stream.Stream<
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
 * Creates dials requests for the specified campaign Amazon Connect account. This API is idempotent.
 */
export const putDialRequestBatch: (
  input: PutDialRequestBatchRequest,
) => Effect.Effect<
  PutDialRequestBatchResponse,
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
  input: PutDialRequestBatchRequest,
  output: PutDialRequestBatchResponse,
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
) => Effect.Effect<
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
/**
 * Get state of campaigns for the specified Amazon Connect account.
 */
export const getCampaignStateBatch: (
  input: GetCampaignStateBatchRequest,
) => Effect.Effect<
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
 * Deletes a connect instance config from the specified AWS account.
 */
export const deleteConnectInstanceConfig: (
  input: DeleteConnectInstanceConfigRequest,
) => Effect.Effect<
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
 * Describes the specific campaign.
 */
export const describeCampaign: (
  input: DescribeCampaignRequest,
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
 * Updates the outbound call config of a campaign. This API is idempotent.
 */
export const updateCampaignOutboundCallConfig: (
  input: UpdateCampaignOutboundCallConfigRequest,
) => Effect.Effect<
  UpdateCampaignOutboundCallConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignOutboundCallConfigRequest,
  output: UpdateCampaignOutboundCallConfigResponse,
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
) => Effect.Effect<
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
 * List tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
 * Updates the dialer config of a campaign. This API is idempotent.
 */
export const updateCampaignDialerConfig: (
  input: UpdateCampaignDialerConfigRequest,
) => Effect.Effect<
  UpdateCampaignDialerConfigResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignDialerConfigRequest,
  output: UpdateCampaignDialerConfigResponse,
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
) => Effect.Effect<
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
 * Onboard the specific Amazon Connect instance to Connect Campaigns.
 */
export const startInstanceOnboardingJob: (
  input: StartInstanceOnboardingJobRequest,
) => Effect.Effect<
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
 * Pauses a campaign for the specified Amazon Connect account.
 */
export const pauseCampaign: (
  input: PauseCampaignRequest,
) => Effect.Effect<
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
 * Delete the Connect Campaigns onboarding job for the specified Amazon Connect instance.
 */
export const deleteInstanceOnboardingJob: (
  input: DeleteInstanceOnboardingJobRequest,
) => Effect.Effect<
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
 * Stops a campaign for the specified Amazon Connect account.
 */
export const resumeCampaign: (
  input: ResumeCampaignRequest,
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
