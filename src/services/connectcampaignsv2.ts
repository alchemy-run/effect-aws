import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ConnectCampaignsV2",
  serviceShapeName: "AmazonConnectCampaignServiceV2",
});
const auth = T.AwsAuthSigv4({ name: "connect-campaigns" });
const ver = T.ServiceVersion("2024-04-23");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://connect-campaigns-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://connect-campaigns-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://connect-campaigns.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://connect-campaigns.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const CampaignIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteCampaignRequest extends S.Class<DeleteCampaignRequest>(
  "DeleteCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/campaigns/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCampaignResponse extends S.Class<DeleteCampaignResponse>(
  "DeleteCampaignResponse",
)({}) {}
export class DeleteCampaignChannelSubtypeConfigRequest extends S.Class<DeleteCampaignChannelSubtypeConfigRequest>(
  "DeleteCampaignChannelSubtypeConfigRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    channelSubtype: S.String.pipe(T.HttpQuery("channelSubtype")),
  },
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
) {}
export class DeleteCampaignChannelSubtypeConfigResponse extends S.Class<DeleteCampaignChannelSubtypeConfigResponse>(
  "DeleteCampaignChannelSubtypeConfigResponse",
)({}) {}
export class DeleteCampaignCommunicationLimitsRequest extends S.Class<DeleteCampaignCommunicationLimitsRequest>(
  "DeleteCampaignCommunicationLimitsRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    config: S.String.pipe(T.HttpQuery("config")),
  },
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
) {}
export class DeleteCampaignCommunicationLimitsResponse extends S.Class<DeleteCampaignCommunicationLimitsResponse>(
  "DeleteCampaignCommunicationLimitsResponse",
)({}) {}
export class DeleteCampaignCommunicationTimeRequest extends S.Class<DeleteCampaignCommunicationTimeRequest>(
  "DeleteCampaignCommunicationTimeRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    config: S.String.pipe(T.HttpQuery("config")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/campaigns/{id}/communication-time" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCampaignCommunicationTimeResponse extends S.Class<DeleteCampaignCommunicationTimeResponse>(
  "DeleteCampaignCommunicationTimeResponse",
)({}) {}
export class DeleteConnectInstanceConfigRequest extends S.Class<DeleteConnectInstanceConfigRequest>(
  "DeleteConnectInstanceConfigRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    campaignDeletionPolicy: S.optional(S.String).pipe(
      T.HttpQuery("campaignDeletionPolicy"),
    ),
  },
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
) {}
export class DeleteConnectInstanceConfigResponse extends S.Class<DeleteConnectInstanceConfigResponse>(
  "DeleteConnectInstanceConfigResponse",
)({}) {}
export class DeleteInstanceOnboardingJobRequest extends S.Class<DeleteInstanceOnboardingJobRequest>(
  "DeleteInstanceOnboardingJobRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
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
) {}
export class DeleteInstanceOnboardingJobResponse extends S.Class<DeleteInstanceOnboardingJobResponse>(
  "DeleteInstanceOnboardingJobResponse",
)({}) {}
export class DescribeCampaignRequest extends S.Class<DescribeCampaignRequest>(
  "DescribeCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/campaigns/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignStateRequest extends S.Class<GetCampaignStateRequest>(
  "GetCampaignStateRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/campaigns/{id}/state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignStateBatchRequest extends S.Class<GetCampaignStateBatchRequest>(
  "GetCampaignStateBatchRequest",
)(
  { campaignIds: CampaignIdList },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns-state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectInstanceConfigRequest extends S.Class<GetConnectInstanceConfigRequest>(
  "GetConnectInstanceConfigRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
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
) {}
export class GetInstanceCommunicationLimitsRequest extends S.Class<GetInstanceCommunicationLimitsRequest>(
  "GetInstanceCommunicationLimitsRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
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
) {}
export class GetInstanceOnboardingJobStatusRequest extends S.Class<GetInstanceOnboardingJobStatusRequest>(
  "GetInstanceOnboardingJobStatusRequest",
)(
  { connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")) },
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
) {}
export class ListConnectInstanceIntegrationsRequest extends S.Class<ListConnectInstanceIntegrationsRequest>(
  "ListConnectInstanceIntegrationsRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v2/tags/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseCampaignRequest extends S.Class<PauseCampaignRequest>(
  "PauseCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/pause" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseCampaignResponse extends S.Class<PauseCampaignResponse>(
  "PauseCampaignResponse",
)({}) {}
export class ResumeCampaignRequest extends S.Class<ResumeCampaignRequest>(
  "ResumeCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/resume" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResumeCampaignResponse extends S.Class<ResumeCampaignResponse>(
  "ResumeCampaignResponse",
)({}) {}
export class StartCampaignRequest extends S.Class<StartCampaignRequest>(
  "StartCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCampaignResponse extends S.Class<StartCampaignResponse>(
  "StartCampaignResponse",
)({}) {}
export class StopCampaignRequest extends S.Class<StopCampaignRequest>(
  "StopCampaignRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCampaignResponse extends S.Class<StopCampaignResponse>(
  "StopCampaignResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/v2/tags/{arn}" }),
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
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v2/tags/{arn}" }),
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
export class ProgressiveConfig extends S.Class<ProgressiveConfig>(
  "ProgressiveConfig",
)({ bandwidthAllocation: S.Number }) {}
export class PredictiveConfig extends S.Class<PredictiveConfig>(
  "PredictiveConfig",
)({ bandwidthAllocation: S.Number }) {}
export class AgentlessConfig extends S.Class<AgentlessConfig>(
  "AgentlessConfig",
)({}) {}
export class TimeoutConfig extends S.Class<TimeoutConfig>("TimeoutConfig")({
  durationInSeconds: S.Number,
}) {}
export const AgentActions = S.Array(S.String);
export class PreviewConfig extends S.Class<PreviewConfig>("PreviewConfig")({
  bandwidthAllocation: S.Number,
  timeoutConfig: TimeoutConfig,
  agentActions: S.optional(AgentActions),
}) {}
export const TelephonyOutboundMode = S.Union(
  S.Struct({ progressive: ProgressiveConfig }),
  S.Struct({ predictive: PredictiveConfig }),
  S.Struct({ agentless: AgentlessConfig }),
  S.Struct({ preview: PreviewConfig }),
);
export class AnswerMachineDetectionConfig extends S.Class<AnswerMachineDetectionConfig>(
  "AnswerMachineDetectionConfig",
)({
  enableAnswerMachineDetection: S.Boolean,
  awaitAnswerMachinePrompt: S.optional(S.Boolean),
}) {}
export class TelephonyOutboundConfig extends S.Class<TelephonyOutboundConfig>(
  "TelephonyOutboundConfig",
)({
  connectContactFlowId: S.String,
  connectSourcePhoneNumber: S.optional(S.String),
  answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
  ringTimeout: S.optional(S.Number),
}) {}
export class TelephonyChannelSubtypeConfig extends S.Class<TelephonyChannelSubtypeConfig>(
  "TelephonyChannelSubtypeConfig",
)({
  capacity: S.optional(S.Number),
  connectQueueId: S.optional(S.String),
  outboundMode: TelephonyOutboundMode,
  defaultOutboundConfig: TelephonyOutboundConfig,
}) {}
export const SmsOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export class SmsOutboundConfig extends S.Class<SmsOutboundConfig>(
  "SmsOutboundConfig",
)({ connectSourcePhoneNumberArn: S.String, wisdomTemplateArn: S.String }) {}
export class SmsChannelSubtypeConfig extends S.Class<SmsChannelSubtypeConfig>(
  "SmsChannelSubtypeConfig",
)({
  capacity: S.optional(S.Number),
  outboundMode: SmsOutboundMode,
  defaultOutboundConfig: SmsOutboundConfig,
}) {}
export const EmailOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export class EmailOutboundConfig extends S.Class<EmailOutboundConfig>(
  "EmailOutboundConfig",
)({
  connectSourceEmailAddress: S.String,
  sourceEmailAddressDisplayName: S.optional(S.String),
  wisdomTemplateArn: S.String,
}) {}
export class EmailChannelSubtypeConfig extends S.Class<EmailChannelSubtypeConfig>(
  "EmailChannelSubtypeConfig",
)({
  capacity: S.optional(S.Number),
  outboundMode: EmailOutboundMode,
  defaultOutboundConfig: EmailOutboundConfig,
}) {}
export const WhatsAppOutboundMode = S.Union(
  S.Struct({ agentless: AgentlessConfig }),
);
export class WhatsAppOutboundConfig extends S.Class<WhatsAppOutboundConfig>(
  "WhatsAppOutboundConfig",
)({ connectSourcePhoneNumberArn: S.String, wisdomTemplateArn: S.String }) {}
export class WhatsAppChannelSubtypeConfig extends S.Class<WhatsAppChannelSubtypeConfig>(
  "WhatsAppChannelSubtypeConfig",
)({
  capacity: S.optional(S.Number),
  outboundMode: WhatsAppOutboundMode,
  defaultOutboundConfig: WhatsAppOutboundConfig,
}) {}
export class ChannelSubtypeConfig extends S.Class<ChannelSubtypeConfig>(
  "ChannelSubtypeConfig",
)({
  telephony: S.optional(TelephonyChannelSubtypeConfig),
  sms: S.optional(SmsChannelSubtypeConfig),
  email: S.optional(EmailChannelSubtypeConfig),
  whatsApp: S.optional(WhatsAppChannelSubtypeConfig),
}) {}
export class UpdateCampaignChannelSubtypeConfigRequest extends S.Class<UpdateCampaignChannelSubtypeConfigRequest>(
  "UpdateCampaignChannelSubtypeConfigRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    channelSubtypeConfig: ChannelSubtypeConfig,
  },
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
) {}
export class UpdateCampaignChannelSubtypeConfigResponse extends S.Class<UpdateCampaignChannelSubtypeConfigResponse>(
  "UpdateCampaignChannelSubtypeConfigResponse",
)({}) {}
export class CommunicationLimit extends S.Class<CommunicationLimit>(
  "CommunicationLimit",
)({ maxCountPerRecipient: S.Number, frequency: S.Number, unit: S.String }) {}
export const CommunicationLimitList = S.Array(CommunicationLimit);
export const CommunicationLimits = S.Union(
  S.Struct({ communicationLimitsList: CommunicationLimitList }),
);
export class CommunicationLimitsConfig extends S.Class<CommunicationLimitsConfig>(
  "CommunicationLimitsConfig",
)({
  allChannelSubtypes: S.optional(CommunicationLimits),
  instanceLimitsHandling: S.optional(S.String),
}) {}
export class UpdateCampaignCommunicationLimitsRequest extends S.Class<UpdateCampaignCommunicationLimitsRequest>(
  "UpdateCampaignCommunicationLimitsRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    communicationLimitsOverride: CommunicationLimitsConfig,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/communication-limits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignCommunicationLimitsResponse extends S.Class<UpdateCampaignCommunicationLimitsResponse>(
  "UpdateCampaignCommunicationLimitsResponse",
)({}) {}
export const LocalTimeZoneDetection = S.Array(S.String);
export class LocalTimeZoneConfig extends S.Class<LocalTimeZoneConfig>(
  "LocalTimeZoneConfig",
)({
  defaultTimeZone: S.optional(S.String),
  localTimeZoneDetection: S.optional(LocalTimeZoneDetection),
}) {}
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  startTime: S.String,
  endTime: S.String,
}) {}
export const TimeRangeList = S.Array(TimeRange);
export const DailyHours = S.Record({ key: S.String, value: TimeRangeList });
export const OpenHours = S.Union(S.Struct({ dailyHours: DailyHours }));
export class RestrictedPeriod extends S.Class<RestrictedPeriod>(
  "RestrictedPeriod",
)({ name: S.optional(S.String), startDate: S.String, endDate: S.String }) {}
export const RestrictedPeriodList = S.Array(RestrictedPeriod);
export const RestrictedPeriods = S.Union(
  S.Struct({ restrictedPeriodList: RestrictedPeriodList }),
);
export class TimeWindow extends S.Class<TimeWindow>("TimeWindow")({
  openHours: OpenHours,
  restrictedPeriods: S.optional(RestrictedPeriods),
}) {}
export class CommunicationTimeConfig extends S.Class<CommunicationTimeConfig>(
  "CommunicationTimeConfig",
)({
  localTimeZoneConfig: LocalTimeZoneConfig,
  telephony: S.optional(TimeWindow),
  sms: S.optional(TimeWindow),
  email: S.optional(TimeWindow),
  whatsApp: S.optional(TimeWindow),
}) {}
export class UpdateCampaignCommunicationTimeRequest extends S.Class<UpdateCampaignCommunicationTimeRequest>(
  "UpdateCampaignCommunicationTimeRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    communicationTimeConfig: CommunicationTimeConfig,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/communication-time" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignCommunicationTimeResponse extends S.Class<UpdateCampaignCommunicationTimeResponse>(
  "UpdateCampaignCommunicationTimeResponse",
)({}) {}
export class UpdateCampaignFlowAssociationRequest extends S.Class<UpdateCampaignFlowAssociationRequest>(
  "UpdateCampaignFlowAssociationRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), connectCampaignFlowArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/flow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignFlowAssociationResponse extends S.Class<UpdateCampaignFlowAssociationResponse>(
  "UpdateCampaignFlowAssociationResponse",
)({}) {}
export class UpdateCampaignNameRequest extends S.Class<UpdateCampaignNameRequest>(
  "UpdateCampaignNameRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/name" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignNameResponse extends S.Class<UpdateCampaignNameResponse>(
  "UpdateCampaignNameResponse",
)({}) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
  refreshFrequency: S.optional(S.String),
}) {}
export class UpdateCampaignScheduleRequest extends S.Class<UpdateCampaignScheduleRequest>(
  "UpdateCampaignScheduleRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), schedule: Schedule },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignScheduleResponse extends S.Class<UpdateCampaignScheduleResponse>(
  "UpdateCampaignScheduleResponse",
)({}) {}
export class EventTrigger extends S.Class<EventTrigger>("EventTrigger")({
  customerProfilesDomainArn: S.optional(S.String),
}) {}
export const Source = S.Union(
  S.Struct({ customerProfilesSegmentArn: S.String }),
  S.Struct({ eventTrigger: EventTrigger }),
);
export class UpdateCampaignSourceRequest extends S.Class<UpdateCampaignSourceRequest>(
  "UpdateCampaignSourceRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")), source: Source },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns/{id}/source" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignSourceResponse extends S.Class<UpdateCampaignSourceResponse>(
  "UpdateCampaignSourceResponse",
)({}) {}
export class InstanceCommunicationLimitsConfig extends S.Class<InstanceCommunicationLimitsConfig>(
  "InstanceCommunicationLimitsConfig",
)({ allChannelSubtypes: S.optional(CommunicationLimits) }) {}
export class ProfileOutboundRequest extends S.Class<ProfileOutboundRequest>(
  "ProfileOutboundRequest",
)({
  clientToken: S.String,
  profileId: S.String,
  expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const ProfileOutboundRequestList = S.Array(ProfileOutboundRequest);
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({
  enabled: S.Boolean,
  encryptionType: S.optional(S.String),
  keyArn: S.optional(S.String),
}) {}
export class GetCampaignStateResponse extends S.Class<GetCampaignStateResponse>(
  "GetCampaignStateResponse",
)({ state: S.optional(S.String) }) {}
export class GetInstanceCommunicationLimitsResponse extends S.Class<GetInstanceCommunicationLimitsResponse>(
  "GetInstanceCommunicationLimitsResponse",
)({
  communicationLimitsConfig: S.optional(InstanceCommunicationLimitsConfig),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PutInstanceCommunicationLimitsRequest extends S.Class<PutInstanceCommunicationLimitsRequest>(
  "PutInstanceCommunicationLimitsRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    communicationLimitsConfig: InstanceCommunicationLimitsConfig,
  },
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
) {}
export class PutInstanceCommunicationLimitsResponse extends S.Class<PutInstanceCommunicationLimitsResponse>(
  "PutInstanceCommunicationLimitsResponse",
)({}) {}
export class PutProfileOutboundRequestBatchRequest extends S.Class<PutProfileOutboundRequestBatchRequest>(
  "PutProfileOutboundRequestBatchRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    profileOutboundRequests: ProfileOutboundRequestList,
  },
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
) {}
export class StartInstanceOnboardingJobRequest extends S.Class<StartInstanceOnboardingJobRequest>(
  "StartInstanceOnboardingJobRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    encryptionConfig: EncryptionConfig,
  },
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
) {}
export class CustomerProfilesIntegrationIdentifier extends S.Class<CustomerProfilesIntegrationIdentifier>(
  "CustomerProfilesIntegrationIdentifier",
)({ domainArn: S.String }) {}
export class QConnectIntegrationIdentifier extends S.Class<QConnectIntegrationIdentifier>(
  "QConnectIntegrationIdentifier",
)({ knowledgeBaseArn: S.String }) {}
export class LambdaIntegrationIdentifier extends S.Class<LambdaIntegrationIdentifier>(
  "LambdaIntegrationIdentifier",
)({ functionArn: S.String }) {}
export class InstanceIdFilter extends S.Class<InstanceIdFilter>(
  "InstanceIdFilter",
)({ value: S.String, operator: S.String }) {}
export class QConnectIntegrationConfig extends S.Class<QConnectIntegrationConfig>(
  "QConnectIntegrationConfig",
)({ knowledgeBaseArn: S.String }) {}
export class LambdaIntegrationConfig extends S.Class<LambdaIntegrationConfig>(
  "LambdaIntegrationConfig",
)({ functionArn: S.String }) {}
export const IntegrationIdentifier = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationIdentifier }),
  S.Struct({ qConnect: QConnectIntegrationIdentifier }),
  S.Struct({ lambda: LambdaIntegrationIdentifier }),
);
export class Campaign extends S.Class<Campaign>("Campaign")({
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
}) {}
export class SuccessfulCampaignStateResponse extends S.Class<SuccessfulCampaignStateResponse>(
  "SuccessfulCampaignStateResponse",
)({ campaignId: S.optional(S.String), state: S.optional(S.String) }) {}
export const SuccessfulCampaignStateResponseList = S.Array(
  SuccessfulCampaignStateResponse,
);
export class FailedCampaignStateResponse extends S.Class<FailedCampaignStateResponse>(
  "FailedCampaignStateResponse",
)({ campaignId: S.optional(S.String), failureCode: S.optional(S.String) }) {}
export const FailedCampaignStateResponseList = S.Array(
  FailedCampaignStateResponse,
);
export class InstanceConfig extends S.Class<InstanceConfig>("InstanceConfig")({
  connectInstanceId: S.String,
  serviceLinkedRoleArn: S.String,
  encryptionConfig: EncryptionConfig,
}) {}
export class InstanceOnboardingJobStatus extends S.Class<InstanceOnboardingJobStatus>(
  "InstanceOnboardingJobStatus",
)({
  connectInstanceId: S.String,
  status: S.String,
  failureCode: S.optional(S.String),
}) {}
export class CampaignFilters extends S.Class<CampaignFilters>(
  "CampaignFilters",
)({ instanceIdFilter: S.optional(InstanceIdFilter) }) {}
export const ObjectTypeNamesMap = S.Record({ key: S.String, value: S.String });
export const Attributes = S.Record({ key: S.String, value: S.String });
export class SmsChannelSubtypeParameters extends S.Class<SmsChannelSubtypeParameters>(
  "SmsChannelSubtypeParameters",
)({
  destinationPhoneNumber: S.String,
  connectSourcePhoneNumberArn: S.optional(S.String),
  templateArn: S.optional(S.String),
  templateParameters: Attributes,
}) {}
export class EmailChannelSubtypeParameters extends S.Class<EmailChannelSubtypeParameters>(
  "EmailChannelSubtypeParameters",
)({
  destinationEmailAddress: S.String,
  connectSourceEmailAddress: S.optional(S.String),
  templateArn: S.optional(S.String),
  templateParameters: Attributes,
}) {}
export class WhatsAppChannelSubtypeParameters extends S.Class<WhatsAppChannelSubtypeParameters>(
  "WhatsAppChannelSubtypeParameters",
)({
  destinationPhoneNumber: S.String,
  connectSourcePhoneNumberArn: S.optional(S.String),
  templateArn: S.optional(S.String),
  templateParameters: Attributes,
}) {}
export class DeleteConnectInstanceIntegrationRequest extends S.Class<DeleteConnectInstanceIntegrationRequest>(
  "DeleteConnectInstanceIntegrationRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    integrationIdentifier: IntegrationIdentifier,
  },
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
) {}
export class DeleteConnectInstanceIntegrationResponse extends S.Class<DeleteConnectInstanceIntegrationResponse>(
  "DeleteConnectInstanceIntegrationResponse",
)({}) {}
export class DescribeCampaignResponse extends S.Class<DescribeCampaignResponse>(
  "DescribeCampaignResponse",
)({ campaign: S.optional(Campaign) }) {}
export class GetCampaignStateBatchResponse extends S.Class<GetCampaignStateBatchResponse>(
  "GetCampaignStateBatchResponse",
)({
  successfulRequests: S.optional(SuccessfulCampaignStateResponseList),
  failedRequests: S.optional(FailedCampaignStateResponseList),
}) {}
export class GetConnectInstanceConfigResponse extends S.Class<GetConnectInstanceConfigResponse>(
  "GetConnectInstanceConfigResponse",
)({ connectInstanceConfig: S.optional(InstanceConfig) }) {}
export class GetInstanceOnboardingJobStatusResponse extends S.Class<GetInstanceOnboardingJobStatusResponse>(
  "GetInstanceOnboardingJobStatusResponse",
)({
  connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
}) {}
export class ListCampaignsRequest extends S.Class<ListCampaignsRequest>(
  "ListCampaignsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(CampaignFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v2/campaigns-summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInstanceOnboardingJobResponse extends S.Class<StartInstanceOnboardingJobResponse>(
  "StartInstanceOnboardingJobResponse",
)({
  connectInstanceOnboardingJobStatus: S.optional(InstanceOnboardingJobStatus),
}) {}
export class CustomerProfilesIntegrationSummary extends S.Class<CustomerProfilesIntegrationSummary>(
  "CustomerProfilesIntegrationSummary",
)({ domainArn: S.String, objectTypeNames: ObjectTypeNamesMap }) {}
export class QConnectIntegrationSummary extends S.Class<QConnectIntegrationSummary>(
  "QConnectIntegrationSummary",
)({ knowledgeBaseArn: S.String }) {}
export class LambdaIntegrationSummary extends S.Class<LambdaIntegrationSummary>(
  "LambdaIntegrationSummary",
)({ functionArn: S.String }) {}
export class CustomerProfilesIntegrationConfig extends S.Class<CustomerProfilesIntegrationConfig>(
  "CustomerProfilesIntegrationConfig",
)({ domainArn: S.String, objectTypeNames: ObjectTypeNamesMap }) {}
export const IntegrationSummary = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationSummary }),
  S.Struct({ qConnect: QConnectIntegrationSummary }),
  S.Struct({ lambda: LambdaIntegrationSummary }),
);
export const IntegrationSummaryList = S.Array(IntegrationSummary);
export const IntegrationConfig = S.Union(
  S.Struct({ customerProfiles: CustomerProfilesIntegrationConfig }),
  S.Struct({ qConnect: QConnectIntegrationConfig }),
  S.Struct({ lambda: LambdaIntegrationConfig }),
);
export class SuccessfulProfileOutboundRequest extends S.Class<SuccessfulProfileOutboundRequest>(
  "SuccessfulProfileOutboundRequest",
)({ clientToken: S.optional(S.String), id: S.optional(S.String) }) {}
export const SuccessfulProfileOutboundRequestList = S.Array(
  SuccessfulProfileOutboundRequest,
);
export class FailedProfileOutboundRequest extends S.Class<FailedProfileOutboundRequest>(
  "FailedProfileOutboundRequest",
)({
  clientToken: S.optional(S.String),
  id: S.optional(S.String),
  failureCode: S.optional(S.String),
}) {}
export const FailedProfileOutboundRequestList = S.Array(
  FailedProfileOutboundRequest,
);
export class TelephonyChannelSubtypeParameters extends S.Class<TelephonyChannelSubtypeParameters>(
  "TelephonyChannelSubtypeParameters",
)({
  destinationPhoneNumber: S.String,
  attributes: Attributes,
  connectSourcePhoneNumber: S.optional(S.String),
  answerMachineDetectionConfig: S.optional(AnswerMachineDetectionConfig),
  ringTimeout: S.optional(S.Number),
}) {}
export class ListConnectInstanceIntegrationsResponse extends S.Class<ListConnectInstanceIntegrationsResponse>(
  "ListConnectInstanceIntegrationsResponse",
)({
  nextToken: S.optional(S.String),
  integrationSummaryList: S.optional(IntegrationSummaryList),
}) {}
export class PutConnectInstanceIntegrationRequest extends S.Class<PutConnectInstanceIntegrationRequest>(
  "PutConnectInstanceIntegrationRequest",
)(
  {
    connectInstanceId: S.String.pipe(T.HttpLabel("connectInstanceId")),
    integrationConfig: IntegrationConfig,
  },
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
) {}
export class PutConnectInstanceIntegrationResponse extends S.Class<PutConnectInstanceIntegrationResponse>(
  "PutConnectInstanceIntegrationResponse",
)({}) {}
export class PutProfileOutboundRequestBatchResponse extends S.Class<PutProfileOutboundRequestBatchResponse>(
  "PutProfileOutboundRequestBatchResponse",
)({
  successfulRequests: S.optional(SuccessfulProfileOutboundRequestList),
  failedRequests: S.optional(FailedProfileOutboundRequestList),
}) {}
export const ChannelSubtypeList = S.Array(S.String);
export const ChannelSubtypeParameters = S.Union(
  S.Struct({ telephony: TelephonyChannelSubtypeParameters }),
  S.Struct({ sms: SmsChannelSubtypeParameters }),
  S.Struct({ email: EmailChannelSubtypeParameters }),
  S.Struct({ whatsApp: WhatsAppChannelSubtypeParameters }),
);
export class CampaignSummary extends S.Class<CampaignSummary>(
  "CampaignSummary",
)({
  id: S.String,
  arn: S.String,
  name: S.String,
  connectInstanceId: S.String,
  channelSubtypes: ChannelSubtypeList,
  type: S.optional(S.String),
  schedule: S.optional(Schedule),
  connectCampaignFlowArn: S.optional(S.String),
}) {}
export const CampaignSummaryList = S.Array(CampaignSummary);
export class OutboundRequest extends S.Class<OutboundRequest>(
  "OutboundRequest",
)({
  clientToken: S.String,
  expirationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  channelSubtypeParameters: ChannelSubtypeParameters,
}) {}
export const OutboundRequestList = S.Array(OutboundRequest);
export class ListCampaignsResponse extends S.Class<ListCampaignsResponse>(
  "ListCampaignsResponse",
)({
  nextToken: S.optional(S.String),
  campaignSummaryList: S.optional(CampaignSummaryList),
}) {}
export class PutOutboundRequestBatchRequest extends S.Class<PutOutboundRequestBatchRequest>(
  "PutOutboundRequestBatchRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    outboundRequests: OutboundRequestList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v2/campaigns/{id}/outbound-requests" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCampaignRequest extends S.Class<CreateCampaignRequest>(
  "CreateCampaignRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v2/campaigns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SuccessfulRequest extends S.Class<SuccessfulRequest>(
  "SuccessfulRequest",
)({ clientToken: S.optional(S.String), id: S.optional(S.String) }) {}
export const SuccessfulRequestList = S.Array(SuccessfulRequest);
export class FailedRequest extends S.Class<FailedRequest>("FailedRequest")({
  clientToken: S.optional(S.String),
  id: S.optional(S.String),
  failureCode: S.optional(S.String),
}) {}
export const FailedRequestList = S.Array(FailedRequest);
export class CreateCampaignResponse extends S.Class<CreateCampaignResponse>(
  "CreateCampaignResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class PutOutboundRequestBatchResponse extends S.Class<PutOutboundRequestBatchResponse>(
  "PutOutboundRequestBatchResponse",
)({
  successfulRequests: S.optional(SuccessfulRequestList),
  failedRequests: S.optional(FailedRequestList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InvalidCampaignStateException extends S.TaggedError<InvalidCampaignStateException>()(
  "InvalidCampaignStateException",
  {
    state: S.String,
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    xAmzErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}

//# Operations
/**
 * Deletes a campaign from the specified Amazon Connect account.
 */
export const deleteCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCampaigns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCampaignsRequest,
    output: ListCampaignsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "campaignSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get state of campaigns for the specified Amazon Connect account.
 */
export const getCampaignStateBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCampaignStateBatchRequest,
    output: GetCampaignStateBatchResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Provides summary information about the integration under the specified Connect instance.
 */
export const listConnectInstanceIntegrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putConnectInstanceIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConnectInstanceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Delete the integration for the specified Amazon Connect instance.
 */
export const deleteConnectInstanceIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnectInstanceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectInstanceConfigRequest,
    output: GetConnectInstanceConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Get the specific instance onboarding job status.
 */
export const getInstanceOnboardingJobStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putInstanceCommunicationLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startInstanceOnboardingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Get state of a campaign for the specified Amazon Connect account.
 */
export const getCampaignState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getInstanceCommunicationLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCampaignChannelSubtypeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignChannelSubtypeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignName = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCampaignCommunicationLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInstanceOnboardingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceOnboardingJobRequest,
    output: DeleteInstanceOnboardingJobResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidStateException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the communication time config for a campaign. This API is idempotent.
 */
export const deleteCampaignCommunicationTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const pauseCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resumeCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignCommunicationLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignCommunicationTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignFlowAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaignSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the campaign source with a campaign. This API is idempotent.
 */
export const updateCampaignSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Takes in a list of profile outbound requests to be placed as part of an outbound campaign. This API is idempotent.
 */
export const putProfileOutboundRequestBatch =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putOutboundRequestBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a campaign for the specified Amazon Connect account. This API is idempotent.
 */
export const createCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
