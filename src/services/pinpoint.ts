import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Pinpoint",
  serviceShapeName: "Pinpoint",
});
const auth = T.AwsAuthSigv4({ name: "mobiletargeting" });
const ver = T.ServiceVersion("2016-12-01");
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
                        url: "https://pinpoint-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://pinpoint-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://pinpoint.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "Region" }, "us-east-1"] },
              ],
              endpoint: {
                url: "https://pinpoint.us-east-1.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "Region" }, "us-west-2"] },
              ],
              endpoint: {
                url: "https://pinpoint.us-west-2.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [{ ref: "Region" }, "us-gov-west-1"],
                },
              ],
              endpoint: {
                url: "https://pinpoint.us-gov-west-1.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://pinpoint.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    "aws-us-gov",
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                  ],
                },
              ],
              endpoint: {
                url: "https://pinpoint.{Region}.amazonaws.com",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://pinpoint.{Region}.{PartitionResult#dnsSuffix}",
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
export const ListOf__string = S.Array(S.String);
export class DeleteAdmChannelRequest extends S.Class<DeleteAdmChannelRequest>(
  "DeleteAdmChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/channels/adm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApnsChannelRequest extends S.Class<DeleteApnsChannelRequest>(
  "DeleteApnsChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/channels/apns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApnsSandboxChannelRequest extends S.Class<DeleteApnsSandboxChannelRequest>(
  "DeleteApnsSandboxChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/apns_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApnsVoipChannelRequest extends S.Class<DeleteApnsVoipChannelRequest>(
  "DeleteApnsVoipChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApnsVoipSandboxChannelRequest extends S.Class<DeleteApnsVoipSandboxChannelRequest>(
  "DeleteApnsVoipSandboxChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppRequest extends S.Class<DeleteAppRequest>(
  "DeleteAppRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBaiduChannelRequest extends S.Class<DeleteBaiduChannelRequest>(
  "DeleteBaiduChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/baidu",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCampaignRequest extends S.Class<DeleteCampaignRequest>(
  "DeleteCampaignRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailChannelRequest extends S.Class<DeleteEmailChannelRequest>(
  "DeleteEmailChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/email",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailTemplateRequest extends S.Class<DeleteEmailTemplateRequest>(
  "DeleteEmailTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEndpointRequest extends S.Class<DeleteEndpointRequest>(
  "DeleteEndpointRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndpointId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventStreamRequest extends S.Class<DeleteEventStreamRequest>(
  "DeleteEventStreamRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/eventstream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGcmChannelRequest extends S.Class<DeleteGcmChannelRequest>(
  "DeleteGcmChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/channels/gcm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInAppTemplateRequest extends S.Class<DeleteInAppTemplateRequest>(
  "DeleteInAppTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/inapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJourneyRequest extends S.Class<DeleteJourneyRequest>(
  "DeleteJourneyRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePushTemplateRequest extends S.Class<DeletePushTemplateRequest>(
  "DeletePushTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/push" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecommenderConfigurationRequest extends S.Class<DeleteRecommenderConfigurationRequest>(
  "DeleteRecommenderConfigurationRequest",
)(
  { RecommenderId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/recommenders/{RecommenderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSegmentRequest extends S.Class<DeleteSegmentRequest>(
  "DeleteSegmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SegmentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSmsChannelRequest extends S.Class<DeleteSmsChannelRequest>(
  "DeleteSmsChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/channels/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSmsTemplateRequest extends S.Class<DeleteSmsTemplateRequest>(
  "DeleteSmsTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserEndpointsRequest extends S.Class<DeleteUserEndpointsRequest>(
  "DeleteUserEndpointsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/users/{UserId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceChannelRequest extends S.Class<DeleteVoiceChannelRequest>(
  "DeleteVoiceChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v1/apps/{ApplicationId}/channels/voice",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVoiceTemplateRequest extends S.Class<DeleteVoiceTemplateRequest>(
  "DeleteVoiceTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAdmChannelRequest extends S.Class<GetAdmChannelRequest>(
  "GetAdmChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/adm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApnsChannelRequest extends S.Class<GetApnsChannelRequest>(
  "GetApnsChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/apns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApnsSandboxChannelRequest extends S.Class<GetApnsSandboxChannelRequest>(
  "GetApnsSandboxChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/channels/apns_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApnsVoipChannelRequest extends S.Class<GetApnsVoipChannelRequest>(
  "GetApnsVoipChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApnsVoipSandboxChannelRequest extends S.Class<GetApnsVoipSandboxChannelRequest>(
  "GetApnsVoipSandboxChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppRequest extends S.Class<GetAppRequest>("GetAppRequest")(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationDateRangeKpiRequest extends S.Class<GetApplicationDateRangeKpiRequest>(
  "GetApplicationDateRangeKpiRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    KpiName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/kpis/daterange/{KpiName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationSettingsRequest extends S.Class<GetApplicationSettingsRequest>(
  "GetApplicationSettingsRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppsRequest extends S.Class<GetAppsRequest>("GetAppsRequest")(
  {
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBaiduChannelRequest extends S.Class<GetBaiduChannelRequest>(
  "GetBaiduChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/baidu" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignRequest extends S.Class<GetCampaignRequest>(
  "GetCampaignRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignActivitiesRequest extends S.Class<GetCampaignActivitiesRequest>(
  "GetCampaignActivitiesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}/activities",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignDateRangeKpiRequest extends S.Class<GetCampaignDateRangeKpiRequest>(
  "GetCampaignDateRangeKpiRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    KpiName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}/kpis/daterange/{KpiName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignsRequest extends S.Class<GetCampaignsRequest>(
  "GetCampaignsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/campaigns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignVersionRequest extends S.Class<GetCampaignVersionRequest>(
  "GetCampaignVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
    Version: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}/versions/{Version}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCampaignVersionsRequest extends S.Class<GetCampaignVersionsRequest>(
  "GetCampaignVersionsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetChannelsRequest extends S.Class<GetChannelsRequest>(
  "GetChannelsRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEmailChannelRequest extends S.Class<GetEmailChannelRequest>(
  "GetEmailChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEmailTemplateRequest extends S.Class<GetEmailTemplateRequest>(
  "GetEmailTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEndpointRequest extends S.Class<GetEndpointRequest>(
  "GetEndpointRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndpointId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventStreamRequest extends S.Class<GetEventStreamRequest>(
  "GetEventStreamRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/eventstream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExportJobRequest extends S.Class<GetExportJobRequest>(
  "GetExportJobRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/jobs/export/{JobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExportJobsRequest extends S.Class<GetExportJobsRequest>(
  "GetExportJobsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/jobs/export" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGcmChannelRequest extends S.Class<GetGcmChannelRequest>(
  "GetGcmChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/gcm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImportJobRequest extends S.Class<GetImportJobRequest>(
  "GetImportJobRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JobId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/jobs/import/{JobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImportJobsRequest extends S.Class<GetImportJobsRequest>(
  "GetImportJobsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/jobs/import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInAppMessagesRequest extends S.Class<GetInAppMessagesRequest>(
  "GetInAppMessagesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndpointId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/endpoints/{EndpointId}/inappmessages",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInAppTemplateRequest extends S.Class<GetInAppTemplateRequest>(
  "GetInAppTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/inapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyRequest extends S.Class<GetJourneyRequest>(
  "GetJourneyRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyDateRangeKpiRequest extends S.Class<GetJourneyDateRangeKpiRequest>(
  "GetJourneyDateRangeKpiRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    JourneyId: S.String.pipe(T.HttpLabel()),
    KpiName: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/kpis/daterange/{KpiName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyExecutionActivityMetricsRequest extends S.Class<GetJourneyExecutionActivityMetricsRequest>(
  "GetJourneyExecutionActivityMetricsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyActivityId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/activities/{JourneyActivityId}/execution-metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyExecutionMetricsRequest extends S.Class<GetJourneyExecutionMetricsRequest>(
  "GetJourneyExecutionMetricsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/execution-metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyRunExecutionActivityMetricsRequest extends S.Class<GetJourneyRunExecutionActivityMetricsRequest>(
  "GetJourneyRunExecutionActivityMetricsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyActivityId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    RunId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/runs/{RunId}/activities/{JourneyActivityId}/execution-metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyRunExecutionMetricsRequest extends S.Class<GetJourneyRunExecutionMetricsRequest>(
  "GetJourneyRunExecutionMetricsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    RunId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/runs/{RunId}/execution-metrics",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJourneyRunsRequest extends S.Class<GetJourneyRunsRequest>(
  "GetJourneyRunsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/runs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPushTemplateRequest extends S.Class<GetPushTemplateRequest>(
  "GetPushTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/push" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommenderConfigurationRequest extends S.Class<GetRecommenderConfigurationRequest>(
  "GetRecommenderConfigurationRequest",
)(
  { RecommenderId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/recommenders/{RecommenderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommenderConfigurationsRequest extends S.Class<GetRecommenderConfigurationsRequest>(
  "GetRecommenderConfigurationsRequest",
)(
  {
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/recommenders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentRequest extends S.Class<GetSegmentRequest>(
  "GetSegmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SegmentId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentExportJobsRequest extends S.Class<GetSegmentExportJobsRequest>(
  "GetSegmentExportJobsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel()),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}/jobs/export",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentImportJobsRequest extends S.Class<GetSegmentImportJobsRequest>(
  "GetSegmentImportJobsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel()),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}/jobs/import",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentsRequest extends S.Class<GetSegmentsRequest>(
  "GetSegmentsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/segments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentVersionRequest extends S.Class<GetSegmentVersionRequest>(
  "GetSegmentVersionRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SegmentId: S.String.pipe(T.HttpLabel()),
    Version: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}/versions/{Version}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSegmentVersionsRequest extends S.Class<GetSegmentVersionsRequest>(
  "GetSegmentVersionsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel()),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSmsChannelRequest extends S.Class<GetSmsChannelRequest>(
  "GetSmsChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSmsTemplateRequest extends S.Class<GetSmsTemplateRequest>(
  "GetSmsTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserEndpointsRequest extends S.Class<GetUserEndpointsRequest>(
  "GetUserEndpointsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/users/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceChannelRequest extends S.Class<GetVoiceChannelRequest>(
  "GetVoiceChannelRequest",
)(
  { ApplicationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVoiceTemplateRequest extends S.Class<GetVoiceTemplateRequest>(
  "GetVoiceTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJourneysRequest extends S.Class<ListJourneysRequest>(
  "ListJourneysRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/journeys" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplatesRequest extends S.Class<ListTemplatesRequest>(
  "ListTemplatesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    TemplateType: S.optional(S.String).pipe(T.HttpQuery("template-type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplateVersionsRequest extends S.Class<ListTemplateVersionsRequest>(
  "ListTemplateVersionsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    TemplateName: S.String.pipe(T.HttpLabel()),
    TemplateType: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/templates/{TemplateName}/{TemplateType}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: ListOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
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
export const ListOf__EndpointTypesElement = S.Array(S.String);
export class CustomDeliveryConfiguration extends S.Class<CustomDeliveryConfiguration>(
  "CustomDeliveryConfiguration",
)({
  DeliveryUri: S.String,
  EndpointTypes: S.optional(ListOf__EndpointTypesElement),
}) {}
export class Message extends S.Class<Message>("Message")({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  ImageIconUrl: S.optional(S.String),
  ImageSmallIconUrl: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  JsonBody: S.optional(S.String),
  MediaUrl: S.optional(S.String),
  RawContent: S.optional(S.String),
  SilentPush: S.optional(S.Boolean),
  TimeToLive: S.optional(S.Number),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class CampaignCustomMessage extends S.Class<CampaignCustomMessage>(
  "CampaignCustomMessage",
)({ Data: S.optional(S.String) }) {}
export class MessageHeader extends S.Class<MessageHeader>("MessageHeader")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const ListOfMessageHeader = S.Array(MessageHeader);
export class CampaignEmailMessage extends S.Class<CampaignEmailMessage>(
  "CampaignEmailMessage",
)({
  Body: S.optional(S.String),
  FromAddress: S.optional(S.String),
  Headers: S.optional(ListOfMessageHeader),
  HtmlBody: S.optional(S.String),
  Title: S.optional(S.String),
}) {}
export class CampaignSmsMessage extends S.Class<CampaignSmsMessage>(
  "CampaignSmsMessage",
)({
  Body: S.optional(S.String),
  MessageType: S.optional(S.String),
  OriginationNumber: S.optional(S.String),
  SenderId: S.optional(S.String),
  EntityId: S.optional(S.String),
  TemplateId: S.optional(S.String),
}) {}
export class InAppMessageBodyConfig extends S.Class<InAppMessageBodyConfig>(
  "InAppMessageBodyConfig",
)({ Alignment: S.String, Body: S.String, TextColor: S.String }) {}
export class InAppMessageHeaderConfig extends S.Class<InAppMessageHeaderConfig>(
  "InAppMessageHeaderConfig",
)({ Alignment: S.String, Header: S.String, TextColor: S.String }) {}
export class OverrideButtonConfiguration extends S.Class<OverrideButtonConfiguration>(
  "OverrideButtonConfiguration",
)({ ButtonAction: S.String, Link: S.optional(S.String) }) {}
export class DefaultButtonConfiguration extends S.Class<DefaultButtonConfiguration>(
  "DefaultButtonConfiguration",
)({
  BackgroundColor: S.optional(S.String),
  BorderRadius: S.optional(S.Number),
  ButtonAction: S.String,
  Link: S.optional(S.String),
  Text: S.String,
  TextColor: S.optional(S.String),
}) {}
export class InAppMessageButton extends S.Class<InAppMessageButton>(
  "InAppMessageButton",
)({
  Android: S.optional(OverrideButtonConfiguration),
  DefaultConfig: S.optional(DefaultButtonConfiguration),
  IOS: S.optional(OverrideButtonConfiguration),
  Web: S.optional(OverrideButtonConfiguration),
}) {}
export class InAppMessageContent extends S.Class<InAppMessageContent>(
  "InAppMessageContent",
)({
  BackgroundColor: S.optional(S.String),
  BodyConfig: S.optional(InAppMessageBodyConfig),
  HeaderConfig: S.optional(InAppMessageHeaderConfig),
  ImageUrl: S.optional(S.String),
  PrimaryBtn: S.optional(InAppMessageButton),
  SecondaryBtn: S.optional(InAppMessageButton),
}) {}
export const ListOfInAppMessageContent = S.Array(InAppMessageContent);
export const MapOf__string = S.Record({ key: S.String, value: S.String });
export class CampaignInAppMessage extends S.Class<CampaignInAppMessage>(
  "CampaignInAppMessage",
)({
  Body: S.optional(S.String),
  Content: S.optional(ListOfInAppMessageContent),
  CustomConfig: S.optional(MapOf__string),
  Layout: S.optional(S.String),
}) {}
export class MessageConfiguration extends S.Class<MessageConfiguration>(
  "MessageConfiguration",
)({
  ADMMessage: S.optional(Message),
  APNSMessage: S.optional(Message),
  BaiduMessage: S.optional(Message),
  CustomMessage: S.optional(CampaignCustomMessage),
  DefaultMessage: S.optional(Message),
  EmailMessage: S.optional(CampaignEmailMessage),
  GCMMessage: S.optional(Message),
  SMSMessage: S.optional(CampaignSmsMessage),
  InAppMessage: S.optional(CampaignInAppMessage),
}) {}
export class AttributeDimension extends S.Class<AttributeDimension>(
  "AttributeDimension",
)({ AttributeType: S.optional(S.String), Values: ListOf__string }) {}
export const MapOfAttributeDimension = S.Record({
  key: S.String,
  value: AttributeDimension,
});
export class SetDimension extends S.Class<SetDimension>("SetDimension")({
  DimensionType: S.optional(S.String),
  Values: ListOf__string,
}) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ ComparisonOperator: S.String, Value: S.Number }) {}
export const MapOfMetricDimension = S.Record({
  key: S.String,
  value: MetricDimension,
});
export class EventDimensions extends S.Class<EventDimensions>(
  "EventDimensions",
)({
  Attributes: S.optional(MapOfAttributeDimension),
  EventType: S.optional(SetDimension),
  Metrics: S.optional(MapOfMetricDimension),
}) {}
export class CampaignEventFilter extends S.Class<CampaignEventFilter>(
  "CampaignEventFilter",
)({ Dimensions: EventDimensions, FilterType: S.String }) {}
export class QuietTime extends S.Class<QuietTime>("QuietTime")({
  End: S.optional(S.String),
  Start: S.optional(S.String),
}) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
  EndTime: S.optional(S.String),
  EventFilter: S.optional(CampaignEventFilter),
  Frequency: S.optional(S.String),
  IsLocalTime: S.optional(S.Boolean),
  QuietTime: S.optional(QuietTime),
  StartTime: S.String,
  Timezone: S.optional(S.String),
}) {}
export class Template extends S.Class<Template>("Template")({
  Name: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class TemplateConfiguration extends S.Class<TemplateConfiguration>(
  "TemplateConfiguration",
)({
  EmailTemplate: S.optional(Template),
  PushTemplate: S.optional(Template),
  SMSTemplate: S.optional(Template),
  VoiceTemplate: S.optional(Template),
  InAppTemplate: S.optional(Template),
}) {}
export class WriteTreatmentResource extends S.Class<WriteTreatmentResource>(
  "WriteTreatmentResource",
)({
  CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
  MessageConfiguration: S.optional(MessageConfiguration),
  Schedule: S.optional(Schedule),
  SizePercent: S.Number,
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TreatmentDescription: S.optional(S.String),
  TreatmentName: S.optional(S.String),
}) {}
export const ListOfWriteTreatmentResource = S.Array(WriteTreatmentResource);
export class CampaignHook extends S.Class<CampaignHook>("CampaignHook")({
  LambdaFunctionName: S.optional(S.String),
  Mode: S.optional(S.String),
  WebUrl: S.optional(S.String),
}) {}
export class CampaignLimits extends S.Class<CampaignLimits>("CampaignLimits")({
  Daily: S.optional(S.Number),
  MaximumDuration: S.optional(S.Number),
  MessagesPerSecond: S.optional(S.Number),
  Total: S.optional(S.Number),
  Session: S.optional(S.Number),
}) {}
export class WriteCampaignRequest extends S.Class<WriteCampaignRequest>(
  "WriteCampaignRequest",
)({
  AdditionalTreatments: S.optional(ListOfWriteTreatmentResource),
  CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
  Description: S.optional(S.String),
  HoldoutPercent: S.optional(S.Number),
  Hook: S.optional(CampaignHook),
  IsPaused: S.optional(S.Boolean),
  Limits: S.optional(CampaignLimits),
  MessageConfiguration: S.optional(MessageConfiguration),
  Name: S.optional(S.String),
  Schedule: S.optional(Schedule),
  SegmentId: S.optional(S.String),
  SegmentVersion: S.optional(S.Number),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TreatmentDescription: S.optional(S.String),
  TreatmentName: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export class UpdateCampaignRequest extends S.Class<UpdateCampaignRequest>(
  "UpdateCampaignRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    CampaignId: S.String.pipe(T.HttpLabel()),
    WriteCampaignRequest: WriteCampaignRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/campaigns/{CampaignId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EmailTemplateRequest extends S.Class<EmailTemplateRequest>(
  "EmailTemplateRequest",
)({
  DefaultSubstitutions: S.optional(S.String),
  HtmlPart: S.optional(S.String),
  RecommenderId: S.optional(S.String),
  Subject: S.optional(S.String),
  Headers: S.optional(ListOfMessageHeader),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TextPart: S.optional(S.String),
}) {}
export class UpdateEmailTemplateRequest extends S.Class<UpdateEmailTemplateRequest>(
  "UpdateEmailTemplateRequest",
)(
  {
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    EmailTemplateRequest: EmailTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InAppTemplateRequest extends S.Class<InAppTemplateRequest>(
  "InAppTemplateRequest",
)({
  Content: S.optional(ListOfInAppMessageContent),
  CustomConfig: S.optional(MapOf__string),
  Layout: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
}) {}
export class UpdateInAppTemplateRequest extends S.Class<UpdateInAppTemplateRequest>(
  "UpdateInAppTemplateRequest",
)(
  {
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    InAppTemplateRequest: InAppTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/inapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class JourneyCustomMessage extends S.Class<JourneyCustomMessage>(
  "JourneyCustomMessage",
)({ Data: S.optional(S.String) }) {}
export class CustomMessageActivity extends S.Class<CustomMessageActivity>(
  "CustomMessageActivity",
)({
  DeliveryUri: S.optional(S.String),
  EndpointTypes: S.optional(ListOf__EndpointTypesElement),
  MessageConfig: S.optional(JourneyCustomMessage),
  NextActivity: S.optional(S.String),
  TemplateName: S.optional(S.String),
  TemplateVersion: S.optional(S.String),
}) {}
export class EventCondition extends S.Class<EventCondition>("EventCondition")({
  Dimensions: S.optional(EventDimensions),
  MessageActivity: S.optional(S.String),
}) {}
export class SegmentCondition extends S.Class<SegmentCondition>(
  "SegmentCondition",
)({ SegmentId: S.String }) {}
export class RecencyDimension extends S.Class<RecencyDimension>(
  "RecencyDimension",
)({ Duration: S.String, RecencyType: S.String }) {}
export class SegmentBehaviors extends S.Class<SegmentBehaviors>(
  "SegmentBehaviors",
)({ Recency: S.optional(RecencyDimension) }) {}
export class SegmentDemographics extends S.Class<SegmentDemographics>(
  "SegmentDemographics",
)({
  AppVersion: S.optional(SetDimension),
  Channel: S.optional(SetDimension),
  DeviceType: S.optional(SetDimension),
  Make: S.optional(SetDimension),
  Model: S.optional(SetDimension),
  Platform: S.optional(SetDimension),
}) {}
export class GPSCoordinates extends S.Class<GPSCoordinates>("GPSCoordinates")({
  Latitude: S.Number,
  Longitude: S.Number,
}) {}
export class GPSPointDimension extends S.Class<GPSPointDimension>(
  "GPSPointDimension",
)({ Coordinates: GPSCoordinates, RangeInKilometers: S.optional(S.Number) }) {}
export class SegmentLocation extends S.Class<SegmentLocation>(
  "SegmentLocation",
)({
  Country: S.optional(SetDimension),
  GPSPoint: S.optional(GPSPointDimension),
}) {}
export class SegmentDimensions extends S.Class<SegmentDimensions>(
  "SegmentDimensions",
)({
  Attributes: S.optional(MapOfAttributeDimension),
  Behavior: S.optional(SegmentBehaviors),
  Demographic: S.optional(SegmentDemographics),
  Location: S.optional(SegmentLocation),
  Metrics: S.optional(MapOfMetricDimension),
  UserAttributes: S.optional(MapOfAttributeDimension),
}) {}
export class SimpleCondition extends S.Class<SimpleCondition>(
  "SimpleCondition",
)({
  EventCondition: S.optional(EventCondition),
  SegmentCondition: S.optional(SegmentCondition),
  SegmentDimensions: S.optional(SegmentDimensions).pipe(
    T.JsonName("segmentDimensions"),
  ),
}) {}
export const ListOfSimpleCondition = S.Array(SimpleCondition);
export class Condition extends S.Class<Condition>("Condition")({
  Conditions: S.optional(ListOfSimpleCondition),
  Operator: S.optional(S.String),
}) {}
export class WaitTime extends S.Class<WaitTime>("WaitTime")({
  WaitFor: S.optional(S.String),
  WaitUntil: S.optional(S.String),
}) {}
export class ConditionalSplitActivity extends S.Class<ConditionalSplitActivity>(
  "ConditionalSplitActivity",
)({
  Condition: S.optional(Condition),
  EvaluationWaitTime: S.optional(WaitTime),
  FalseActivity: S.optional(S.String),
  TrueActivity: S.optional(S.String),
}) {}
export class JourneyEmailMessage extends S.Class<JourneyEmailMessage>(
  "JourneyEmailMessage",
)({ FromAddress: S.optional(S.String) }) {}
export class EmailMessageActivity extends S.Class<EmailMessageActivity>(
  "EmailMessageActivity",
)({
  MessageConfig: S.optional(JourneyEmailMessage),
  NextActivity: S.optional(S.String),
  TemplateName: S.optional(S.String),
  TemplateVersion: S.optional(S.String),
}) {}
export class HoldoutActivity extends S.Class<HoldoutActivity>(
  "HoldoutActivity",
)({ NextActivity: S.optional(S.String), Percentage: S.Number }) {}
export class MultiConditionalBranch extends S.Class<MultiConditionalBranch>(
  "MultiConditionalBranch",
)({
  Condition: S.optional(SimpleCondition),
  NextActivity: S.optional(S.String),
}) {}
export const ListOfMultiConditionalBranch = S.Array(MultiConditionalBranch);
export class MultiConditionalSplitActivity extends S.Class<MultiConditionalSplitActivity>(
  "MultiConditionalSplitActivity",
)({
  Branches: S.optional(ListOfMultiConditionalBranch),
  DefaultActivity: S.optional(S.String),
  EvaluationWaitTime: S.optional(WaitTime),
}) {}
export class JourneyPushMessage extends S.Class<JourneyPushMessage>(
  "JourneyPushMessage",
)({ TimeToLive: S.optional(S.String) }) {}
export class PushMessageActivity extends S.Class<PushMessageActivity>(
  "PushMessageActivity",
)({
  MessageConfig: S.optional(JourneyPushMessage),
  NextActivity: S.optional(S.String),
  TemplateName: S.optional(S.String),
  TemplateVersion: S.optional(S.String),
}) {}
export class RandomSplitEntry extends S.Class<RandomSplitEntry>(
  "RandomSplitEntry",
)({ NextActivity: S.optional(S.String), Percentage: S.optional(S.Number) }) {}
export const ListOfRandomSplitEntry = S.Array(RandomSplitEntry);
export class RandomSplitActivity extends S.Class<RandomSplitActivity>(
  "RandomSplitActivity",
)({ Branches: S.optional(ListOfRandomSplitEntry) }) {}
export class JourneySMSMessage extends S.Class<JourneySMSMessage>(
  "JourneySMSMessage",
)({
  MessageType: S.optional(S.String),
  OriginationNumber: S.optional(S.String),
  SenderId: S.optional(S.String),
  EntityId: S.optional(S.String),
  TemplateId: S.optional(S.String),
}) {}
export class SMSMessageActivity extends S.Class<SMSMessageActivity>(
  "SMSMessageActivity",
)({
  MessageConfig: S.optional(JourneySMSMessage),
  NextActivity: S.optional(S.String),
  TemplateName: S.optional(S.String),
  TemplateVersion: S.optional(S.String),
}) {}
export class WaitActivity extends S.Class<WaitActivity>("WaitActivity")({
  NextActivity: S.optional(S.String),
  WaitTime: S.optional(WaitTime),
}) {}
export class ContactCenterActivity extends S.Class<ContactCenterActivity>(
  "ContactCenterActivity",
)({ NextActivity: S.optional(S.String) }) {}
export class Activity extends S.Class<Activity>("Activity")({
  CUSTOM: S.optional(CustomMessageActivity),
  ConditionalSplit: S.optional(ConditionalSplitActivity),
  Description: S.optional(S.String),
  EMAIL: S.optional(EmailMessageActivity),
  Holdout: S.optional(HoldoutActivity),
  MultiCondition: S.optional(MultiConditionalSplitActivity),
  PUSH: S.optional(PushMessageActivity),
  RandomSplit: S.optional(RandomSplitActivity),
  SMS: S.optional(SMSMessageActivity),
  Wait: S.optional(WaitActivity),
  ContactCenter: S.optional(ContactCenterActivity),
}) {}
export const MapOfActivity = S.Record({ key: S.String, value: Activity });
export class JourneyTimeframeCap extends S.Class<JourneyTimeframeCap>(
  "JourneyTimeframeCap",
)({ Cap: S.optional(S.Number), Days: S.optional(S.Number) }) {}
export class JourneyLimits extends S.Class<JourneyLimits>("JourneyLimits")({
  DailyCap: S.optional(S.Number),
  EndpointReentryCap: S.optional(S.Number),
  MessagesPerSecond: S.optional(S.Number),
  EndpointReentryInterval: S.optional(S.String),
  TimeframeCap: S.optional(JourneyTimeframeCap),
  TotalCap: S.optional(S.Number),
}) {}
export class JourneySchedule extends S.Class<JourneySchedule>(
  "JourneySchedule",
)({
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Timezone: S.optional(S.String),
}) {}
export class EventFilter extends S.Class<EventFilter>("EventFilter")({
  Dimensions: EventDimensions,
  FilterType: S.String,
}) {}
export class EventStartCondition extends S.Class<EventStartCondition>(
  "EventStartCondition",
)({ EventFilter: S.optional(EventFilter), SegmentId: S.optional(S.String) }) {}
export class StartCondition extends S.Class<StartCondition>("StartCondition")({
  Description: S.optional(S.String),
  EventStartCondition: S.optional(EventStartCondition),
  SegmentStartCondition: S.optional(SegmentCondition),
}) {}
export class JourneyChannelSettings extends S.Class<JourneyChannelSettings>(
  "JourneyChannelSettings",
)({
  ConnectCampaignArn: S.optional(S.String),
  ConnectCampaignExecutionRoleArn: S.optional(S.String),
}) {}
export class OpenHoursRule extends S.Class<OpenHoursRule>("OpenHoursRule")({
  StartTime: S.optional(S.String),
  EndTime: S.optional(S.String),
}) {}
export const ListOfOpenHoursRules = S.Array(OpenHoursRule);
export const MapOfListOfOpenHoursRules = S.Record({
  key: S.String,
  value: ListOfOpenHoursRules,
});
export class OpenHours extends S.Class<OpenHours>("OpenHours")({
  EMAIL: S.optional(MapOfListOfOpenHoursRules),
  SMS: S.optional(MapOfListOfOpenHoursRules),
  PUSH: S.optional(MapOfListOfOpenHoursRules),
  VOICE: S.optional(MapOfListOfOpenHoursRules),
  CUSTOM: S.optional(MapOfListOfOpenHoursRules),
}) {}
export class ClosedDaysRule extends S.Class<ClosedDaysRule>("ClosedDaysRule")({
  Name: S.optional(S.String),
  StartDateTime: S.optional(S.String),
  EndDateTime: S.optional(S.String),
}) {}
export const ListOfClosedDaysRules = S.Array(ClosedDaysRule);
export class ClosedDays extends S.Class<ClosedDays>("ClosedDays")({
  EMAIL: S.optional(ListOfClosedDaysRules),
  SMS: S.optional(ListOfClosedDaysRules),
  PUSH: S.optional(ListOfClosedDaysRules),
  VOICE: S.optional(ListOfClosedDaysRules),
  CUSTOM: S.optional(ListOfClosedDaysRules),
}) {}
export const ListOf__TimezoneEstimationMethodsElement = S.Array(S.String);
export class WriteJourneyRequest extends S.Class<WriteJourneyRequest>(
  "WriteJourneyRequest",
)({
  Activities: S.optional(MapOfActivity),
  CreationDate: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Limits: S.optional(JourneyLimits),
  LocalTime: S.optional(S.Boolean),
  Name: S.String,
  QuietTime: S.optional(QuietTime),
  RefreshFrequency: S.optional(S.String),
  Schedule: S.optional(JourneySchedule),
  StartActivity: S.optional(S.String),
  StartCondition: S.optional(StartCondition),
  State: S.optional(S.String),
  WaitForQuietTime: S.optional(S.Boolean),
  RefreshOnSegmentUpdate: S.optional(S.Boolean),
  JourneyChannelSettings: S.optional(JourneyChannelSettings),
  SendingSchedule: S.optional(S.Boolean),
  OpenHours: S.optional(OpenHours),
  ClosedDays: S.optional(ClosedDays),
  TimezoneEstimationMethods: S.optional(
    ListOf__TimezoneEstimationMethodsElement,
  ),
}) {}
export class UpdateJourneyRequest extends S.Class<UpdateJourneyRequest>(
  "UpdateJourneyRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    WriteJourneyRequest: WriteJourneyRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AndroidPushNotificationTemplate extends S.Class<AndroidPushNotificationTemplate>(
  "AndroidPushNotificationTemplate",
)({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  ImageIconUrl: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  RawContent: S.optional(S.String),
  SmallImageIconUrl: S.optional(S.String),
  Sound: S.optional(S.String),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class APNSPushNotificationTemplate extends S.Class<APNSPushNotificationTemplate>(
  "APNSPushNotificationTemplate",
)({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  MediaUrl: S.optional(S.String),
  RawContent: S.optional(S.String),
  Sound: S.optional(S.String),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class DefaultPushNotificationTemplate extends S.Class<DefaultPushNotificationTemplate>(
  "DefaultPushNotificationTemplate",
)({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  Sound: S.optional(S.String),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class PushNotificationTemplateRequest extends S.Class<PushNotificationTemplateRequest>(
  "PushNotificationTemplateRequest",
)({
  ADM: S.optional(AndroidPushNotificationTemplate),
  APNS: S.optional(APNSPushNotificationTemplate),
  Baidu: S.optional(AndroidPushNotificationTemplate),
  Default: S.optional(DefaultPushNotificationTemplate),
  DefaultSubstitutions: S.optional(S.String),
  GCM: S.optional(AndroidPushNotificationTemplate),
  RecommenderId: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
}) {}
export class UpdatePushTemplateRequest extends S.Class<UpdatePushTemplateRequest>(
  "UpdatePushTemplateRequest",
)(
  {
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    PushNotificationTemplateRequest: PushNotificationTemplateRequest.pipe(
      T.HttpPayload(),
    ),
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/push" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ListOfSegmentDimensions = S.Array(SegmentDimensions);
export class SegmentReference extends S.Class<SegmentReference>(
  "SegmentReference",
)({ Id: S.String, Version: S.optional(S.Number) }) {}
export const ListOfSegmentReference = S.Array(SegmentReference);
export class SegmentGroup extends S.Class<SegmentGroup>("SegmentGroup")({
  Dimensions: S.optional(ListOfSegmentDimensions),
  SourceSegments: S.optional(ListOfSegmentReference),
  SourceType: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const ListOfSegmentGroup = S.Array(SegmentGroup);
export class SegmentGroupList extends S.Class<SegmentGroupList>(
  "SegmentGroupList",
)({ Groups: S.optional(ListOfSegmentGroup), Include: S.optional(S.String) }) {}
export class WriteSegmentRequest extends S.Class<WriteSegmentRequest>(
  "WriteSegmentRequest",
)({
  Dimensions: S.optional(SegmentDimensions),
  Name: S.optional(S.String),
  SegmentGroups: S.optional(SegmentGroupList),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
}) {}
export class UpdateSegmentRequest extends S.Class<UpdateSegmentRequest>(
  "UpdateSegmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SegmentId: S.String.pipe(T.HttpLabel()),
    WriteSegmentRequest: WriteSegmentRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/segments/{SegmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SMSTemplateRequest extends S.Class<SMSTemplateRequest>(
  "SMSTemplateRequest",
)({
  Body: S.optional(S.String),
  DefaultSubstitutions: S.optional(S.String),
  RecommenderId: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
}) {}
export class UpdateSmsTemplateRequest extends S.Class<UpdateSmsTemplateRequest>(
  "UpdateSmsTemplateRequest",
)(
  {
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    SMSTemplateRequest: SMSTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VoiceTemplateRequest extends S.Class<VoiceTemplateRequest>(
  "VoiceTemplateRequest",
)({
  Body: S.optional(S.String),
  DefaultSubstitutions: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  VoiceId: S.optional(S.String),
}) {}
export class UpdateVoiceTemplateRequest extends S.Class<UpdateVoiceTemplateRequest>(
  "UpdateVoiceTemplateRequest",
)(
  {
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    TemplateName: S.String.pipe(T.HttpLabel()),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
    VoiceTemplateRequest: VoiceTemplateRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportJobRequest extends S.Class<ExportJobRequest>(
  "ExportJobRequest",
)({
  RoleArn: S.String,
  S3UrlPrefix: S.String,
  SegmentId: S.optional(S.String),
  SegmentVersion: S.optional(S.Number),
}) {}
export class ImportJobRequest extends S.Class<ImportJobRequest>(
  "ImportJobRequest",
)({
  DefineSegment: S.optional(S.Boolean),
  ExternalId: S.optional(S.String),
  Format: S.String,
  RegisterEndpoints: S.optional(S.Boolean),
  RoleArn: S.String,
  S3Url: S.String,
  SegmentId: S.optional(S.String),
  SegmentName: S.optional(S.String),
}) {}
export class CreateRecommenderConfigurationShape extends S.Class<CreateRecommenderConfigurationShape>(
  "CreateRecommenderConfigurationShape",
)({
  Attributes: S.optional(MapOf__string),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  RecommendationProviderIdType: S.optional(S.String),
  RecommendationProviderRoleArn: S.String,
  RecommendationProviderUri: S.String,
  RecommendationTransformerUri: S.optional(S.String),
  RecommendationsDisplayName: S.optional(S.String),
  RecommendationsPerMessage: S.optional(S.Number),
}) {}
export class NumberValidateRequest extends S.Class<NumberValidateRequest>(
  "NumberValidateRequest",
)({
  IsoCountryCode: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
}) {}
export class WriteEventStream extends S.Class<WriteEventStream>(
  "WriteEventStream",
)({ DestinationStreamArn: S.String, RoleArn: S.String }) {}
export class UpdateAttributesRequest extends S.Class<UpdateAttributesRequest>(
  "UpdateAttributesRequest",
)({ Blacklist: S.optional(ListOf__string) }) {}
export class SendOTPMessageRequestParameters extends S.Class<SendOTPMessageRequestParameters>(
  "SendOTPMessageRequestParameters",
)({
  AllowedAttempts: S.optional(S.Number),
  BrandName: S.String,
  Channel: S.String,
  CodeLength: S.optional(S.Number),
  DestinationIdentity: S.String,
  EntityId: S.optional(S.String),
  Language: S.optional(S.String),
  OriginationIdentity: S.String,
  ReferenceId: S.String,
  TemplateId: S.optional(S.String),
  ValidityPeriod: S.optional(S.Number),
}) {}
export const MapOfListOf__string = S.Record({
  key: S.String,
  value: ListOf__string,
});
export class ADMMessage extends S.Class<ADMMessage>("ADMMessage")({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  ConsolidationKey: S.optional(S.String),
  Data: S.optional(MapOf__string),
  ExpiresAfter: S.optional(S.String),
  IconReference: S.optional(S.String),
  ImageIconUrl: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  MD5: S.optional(S.String),
  RawContent: S.optional(S.String),
  SilentPush: S.optional(S.Boolean),
  SmallImageIconUrl: S.optional(S.String),
  Sound: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class APNSMessage extends S.Class<APNSMessage>("APNSMessage")({
  APNSPushType: S.optional(S.String),
  Action: S.optional(S.String),
  Badge: S.optional(S.Number),
  Body: S.optional(S.String),
  Category: S.optional(S.String),
  CollapseId: S.optional(S.String),
  Data: S.optional(MapOf__string),
  MediaUrl: S.optional(S.String),
  PreferredAuthenticationMethod: S.optional(S.String),
  Priority: S.optional(S.String),
  RawContent: S.optional(S.String),
  SilentPush: S.optional(S.Boolean),
  Sound: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  ThreadId: S.optional(S.String),
  TimeToLive: S.optional(S.Number),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class BaiduMessage extends S.Class<BaiduMessage>("BaiduMessage")({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  Data: S.optional(MapOf__string),
  IconReference: S.optional(S.String),
  ImageIconUrl: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  RawContent: S.optional(S.String),
  SilentPush: S.optional(S.Boolean),
  SmallImageIconUrl: S.optional(S.String),
  Sound: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  TimeToLive: S.optional(S.Number),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class DefaultMessage extends S.Class<DefaultMessage>("DefaultMessage")({
  Body: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
}) {}
export class DefaultPushNotificationMessage extends S.Class<DefaultPushNotificationMessage>(
  "DefaultPushNotificationMessage",
)({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  Data: S.optional(MapOf__string),
  SilentPush: S.optional(S.Boolean),
  Substitutions: S.optional(MapOfListOf__string),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class RawEmail extends S.Class<RawEmail>("RawEmail")({
  Data: S.optional(T.Blob),
}) {}
export class SimpleEmailPart extends S.Class<SimpleEmailPart>(
  "SimpleEmailPart",
)({ Charset: S.optional(S.String), Data: S.optional(S.String) }) {}
export class SimpleEmail extends S.Class<SimpleEmail>("SimpleEmail")({
  HtmlPart: S.optional(SimpleEmailPart),
  Subject: S.optional(SimpleEmailPart),
  TextPart: S.optional(SimpleEmailPart),
  Headers: S.optional(ListOfMessageHeader),
}) {}
export class EmailMessage extends S.Class<EmailMessage>("EmailMessage")({
  Body: S.optional(S.String),
  FeedbackForwardingAddress: S.optional(S.String),
  FromAddress: S.optional(S.String),
  RawEmail: S.optional(RawEmail),
  ReplyToAddresses: S.optional(ListOf__string),
  SimpleEmail: S.optional(SimpleEmail),
  Substitutions: S.optional(MapOfListOf__string),
}) {}
export class GCMMessage extends S.Class<GCMMessage>("GCMMessage")({
  Action: S.optional(S.String),
  Body: S.optional(S.String),
  CollapseKey: S.optional(S.String),
  Data: S.optional(MapOf__string),
  IconReference: S.optional(S.String),
  ImageIconUrl: S.optional(S.String),
  ImageUrl: S.optional(S.String),
  PreferredAuthenticationMethod: S.optional(S.String),
  Priority: S.optional(S.String),
  RawContent: S.optional(S.String),
  RestrictedPackageName: S.optional(S.String),
  SilentPush: S.optional(S.Boolean),
  SmallImageIconUrl: S.optional(S.String),
  Sound: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  TimeToLive: S.optional(S.Number),
  Title: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class SMSMessage extends S.Class<SMSMessage>("SMSMessage")({
  Body: S.optional(S.String),
  Keyword: S.optional(S.String),
  MediaUrl: S.optional(S.String),
  MessageType: S.optional(S.String),
  OriginationNumber: S.optional(S.String),
  SenderId: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  EntityId: S.optional(S.String),
  TemplateId: S.optional(S.String),
}) {}
export class VoiceMessage extends S.Class<VoiceMessage>("VoiceMessage")({
  Body: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  OriginationNumber: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  VoiceId: S.optional(S.String),
}) {}
export class DirectMessageConfiguration extends S.Class<DirectMessageConfiguration>(
  "DirectMessageConfiguration",
)({
  ADMMessage: S.optional(ADMMessage),
  APNSMessage: S.optional(APNSMessage),
  BaiduMessage: S.optional(BaiduMessage),
  DefaultMessage: S.optional(DefaultMessage),
  DefaultPushNotificationMessage: S.optional(DefaultPushNotificationMessage),
  EmailMessage: S.optional(EmailMessage),
  GCMMessage: S.optional(GCMMessage),
  SMSMessage: S.optional(SMSMessage),
  VoiceMessage: S.optional(VoiceMessage),
}) {}
export class EndpointSendConfiguration extends S.Class<EndpointSendConfiguration>(
  "EndpointSendConfiguration",
)({
  BodyOverride: S.optional(S.String),
  Context: S.optional(MapOf__string),
  RawContent: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  TitleOverride: S.optional(S.String),
}) {}
export const MapOfEndpointSendConfiguration = S.Record({
  key: S.String,
  value: EndpointSendConfiguration,
});
export class SendUsersMessageRequest extends S.Class<SendUsersMessageRequest>(
  "SendUsersMessageRequest",
)({
  Context: S.optional(MapOf__string),
  MessageConfiguration: DirectMessageConfiguration,
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TraceId: S.optional(S.String),
  Users: MapOfEndpointSendConfiguration,
}) {}
export class TagsModel extends S.Class<TagsModel>("TagsModel")({
  tags: MapOf__string.pipe(T.JsonName("tags")),
}) {}
export class ADMChannelRequest extends S.Class<ADMChannelRequest>(
  "ADMChannelRequest",
)({
  ClientId: S.String,
  ClientSecret: S.String,
  Enabled: S.optional(S.Boolean),
}) {}
export class APNSChannelRequest extends S.Class<APNSChannelRequest>(
  "APNSChannelRequest",
)({
  BundleId: S.optional(S.String),
  Certificate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  PrivateKey: S.optional(S.String),
  TeamId: S.optional(S.String),
  TokenKey: S.optional(S.String),
  TokenKeyId: S.optional(S.String),
}) {}
export class APNSSandboxChannelRequest extends S.Class<APNSSandboxChannelRequest>(
  "APNSSandboxChannelRequest",
)({
  BundleId: S.optional(S.String),
  Certificate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  PrivateKey: S.optional(S.String),
  TeamId: S.optional(S.String),
  TokenKey: S.optional(S.String),
  TokenKeyId: S.optional(S.String),
}) {}
export class APNSVoipChannelRequest extends S.Class<APNSVoipChannelRequest>(
  "APNSVoipChannelRequest",
)({
  BundleId: S.optional(S.String),
  Certificate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  PrivateKey: S.optional(S.String),
  TeamId: S.optional(S.String),
  TokenKey: S.optional(S.String),
  TokenKeyId: S.optional(S.String),
}) {}
export class APNSVoipSandboxChannelRequest extends S.Class<APNSVoipSandboxChannelRequest>(
  "APNSVoipSandboxChannelRequest",
)({
  BundleId: S.optional(S.String),
  Certificate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  PrivateKey: S.optional(S.String),
  TeamId: S.optional(S.String),
  TokenKey: S.optional(S.String),
  TokenKeyId: S.optional(S.String),
}) {}
export class BaiduChannelRequest extends S.Class<BaiduChannelRequest>(
  "BaiduChannelRequest",
)({ ApiKey: S.String, Enabled: S.optional(S.Boolean), SecretKey: S.String }) {}
export class EmailChannelRequest extends S.Class<EmailChannelRequest>(
  "EmailChannelRequest",
)({
  ConfigurationSet: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  FromAddress: S.String,
  Identity: S.String,
  RoleArn: S.optional(S.String),
  OrchestrationSendingRoleArn: S.optional(S.String),
}) {}
export class GCMChannelRequest extends S.Class<GCMChannelRequest>(
  "GCMChannelRequest",
)({
  ApiKey: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  ServiceJson: S.optional(S.String),
}) {}
export class JourneyStateRequest extends S.Class<JourneyStateRequest>(
  "JourneyStateRequest",
)({ State: S.optional(S.String) }) {}
export class UpdateRecommenderConfigurationShape extends S.Class<UpdateRecommenderConfigurationShape>(
  "UpdateRecommenderConfigurationShape",
)({
  Attributes: S.optional(MapOf__string),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  RecommendationProviderIdType: S.optional(S.String),
  RecommendationProviderRoleArn: S.String,
  RecommendationProviderUri: S.String,
  RecommendationTransformerUri: S.optional(S.String),
  RecommendationsDisplayName: S.optional(S.String),
  RecommendationsPerMessage: S.optional(S.Number),
}) {}
export class SMSChannelRequest extends S.Class<SMSChannelRequest>(
  "SMSChannelRequest",
)({
  Enabled: S.optional(S.Boolean),
  SenderId: S.optional(S.String),
  ShortCode: S.optional(S.String),
}) {}
export class TemplateActiveVersionRequest extends S.Class<TemplateActiveVersionRequest>(
  "TemplateActiveVersionRequest",
)({ Version: S.optional(S.String) }) {}
export class VoiceChannelRequest extends S.Class<VoiceChannelRequest>(
  "VoiceChannelRequest",
)({ Enabled: S.optional(S.Boolean) }) {}
export class VerifyOTPMessageRequestParameters extends S.Class<VerifyOTPMessageRequestParameters>(
  "VerifyOTPMessageRequestParameters",
)({ DestinationIdentity: S.String, Otp: S.String, ReferenceId: S.String }) {}
export class CreateExportJobRequest extends S.Class<CreateExportJobRequest>(
  "CreateExportJobRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    ExportJobRequest: ExportJobRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/jobs/export" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateImportJobRequest extends S.Class<CreateImportJobRequest>(
  "CreateImportJobRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    ImportJobRequest: ImportJobRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/jobs/import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRecommenderConfigurationRequest extends S.Class<CreateRecommenderConfigurationRequest>(
  "CreateRecommenderConfigurationRequest",
)(
  {
    CreateRecommenderConfiguration: CreateRecommenderConfigurationShape.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/recommenders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSmsTemplateRequest extends S.Class<CreateSmsTemplateRequest>(
  "CreateSmsTemplateRequest",
)(
  {
    SMSTemplateRequest: SMSTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVoiceTemplateRequest extends S.Class<CreateVoiceTemplateRequest>(
  "CreateVoiceTemplateRequest",
)(
  {
    TemplateName: S.String.pipe(T.HttpLabel()),
    VoiceTemplateRequest: VoiceTemplateRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MessageBody extends S.Class<MessageBody>("MessageBody")({
  Message: S.optional(S.String),
  RequestID: S.optional(S.String),
}) {}
export class DeleteInAppTemplateResponse extends S.Class<DeleteInAppTemplateResponse>(
  "DeleteInAppTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class DeletePushTemplateResponse extends S.Class<DeletePushTemplateResponse>(
  "DeletePushTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class DeleteSmsTemplateResponse extends S.Class<DeleteSmsTemplateResponse>(
  "DeleteSmsTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class DeleteVoiceTemplateResponse extends S.Class<DeleteVoiceTemplateResponse>(
  "DeleteVoiceTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class ADMChannelResponse extends S.Class<ADMChannelResponse>(
  "ADMChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetAdmChannelResponse extends S.Class<GetAdmChannelResponse>(
  "GetAdmChannelResponse",
)({ ADMChannelResponse: ADMChannelResponse.pipe(T.HttpPayload()) }) {}
export class APNSChannelResponse extends S.Class<APNSChannelResponse>(
  "APNSChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  HasTokenKey: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetApnsChannelResponse extends S.Class<GetApnsChannelResponse>(
  "GetApnsChannelResponse",
)({ APNSChannelResponse: APNSChannelResponse.pipe(T.HttpPayload()) }) {}
export class APNSSandboxChannelResponse extends S.Class<APNSSandboxChannelResponse>(
  "APNSSandboxChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  HasTokenKey: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetApnsSandboxChannelResponse extends S.Class<GetApnsSandboxChannelResponse>(
  "GetApnsSandboxChannelResponse",
)({
  APNSSandboxChannelResponse: APNSSandboxChannelResponse.pipe(T.HttpPayload()),
}) {}
export class APNSVoipChannelResponse extends S.Class<APNSVoipChannelResponse>(
  "APNSVoipChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  HasTokenKey: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetApnsVoipChannelResponse extends S.Class<GetApnsVoipChannelResponse>(
  "GetApnsVoipChannelResponse",
)({ APNSVoipChannelResponse: APNSVoipChannelResponse.pipe(T.HttpPayload()) }) {}
export class APNSVoipSandboxChannelResponse extends S.Class<APNSVoipSandboxChannelResponse>(
  "APNSVoipSandboxChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  HasTokenKey: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetApnsVoipSandboxChannelResponse extends S.Class<GetApnsVoipSandboxChannelResponse>(
  "GetApnsVoipSandboxChannelResponse",
)({
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class ApplicationResponse extends S.Class<ApplicationResponse>(
  "ApplicationResponse",
)({
  Arn: S.String,
  Id: S.String,
  Name: S.String,
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  CreationDate: S.optional(S.String),
}) {}
export class GetAppResponse extends S.Class<GetAppResponse>("GetAppResponse")({
  ApplicationResponse: ApplicationResponse.pipe(T.HttpPayload()),
}) {}
export class BaiduChannelResponse extends S.Class<BaiduChannelResponse>(
  "BaiduChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Credential: S.String,
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetBaiduChannelResponse extends S.Class<GetBaiduChannelResponse>(
  "GetBaiduChannelResponse",
)({ BaiduChannelResponse: BaiduChannelResponse.pipe(T.HttpPayload()) }) {}
export class CampaignState extends S.Class<CampaignState>("CampaignState")({
  CampaignStatus: S.optional(S.String),
}) {}
export class TreatmentResource extends S.Class<TreatmentResource>(
  "TreatmentResource",
)({
  CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
  Id: S.String,
  MessageConfiguration: S.optional(MessageConfiguration),
  Schedule: S.optional(Schedule),
  SizePercent: S.Number,
  State: S.optional(CampaignState),
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TreatmentDescription: S.optional(S.String),
  TreatmentName: S.optional(S.String),
}) {}
export const ListOfTreatmentResource = S.Array(TreatmentResource);
export class CampaignResponse extends S.Class<CampaignResponse>(
  "CampaignResponse",
)({
  AdditionalTreatments: S.optional(ListOfTreatmentResource),
  ApplicationId: S.String,
  Arn: S.String,
  CreationDate: S.String,
  CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
  DefaultState: S.optional(CampaignState),
  Description: S.optional(S.String),
  HoldoutPercent: S.optional(S.Number),
  Hook: S.optional(CampaignHook),
  Id: S.String,
  IsPaused: S.optional(S.Boolean),
  LastModifiedDate: S.String,
  Limits: S.optional(CampaignLimits),
  MessageConfiguration: S.optional(MessageConfiguration),
  Name: S.optional(S.String),
  Schedule: S.optional(Schedule),
  SegmentId: S.String,
  SegmentVersion: S.Number,
  State: S.optional(CampaignState),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TreatmentDescription: S.optional(S.String),
  TreatmentName: S.optional(S.String),
  Version: S.optional(S.Number),
  Priority: S.optional(S.Number),
}) {}
export class GetCampaignResponse extends S.Class<GetCampaignResponse>(
  "GetCampaignResponse",
)({ CampaignResponse: CampaignResponse.pipe(T.HttpPayload()) }) {}
export class GetCampaignVersionResponse extends S.Class<GetCampaignVersionResponse>(
  "GetCampaignVersionResponse",
)({ CampaignResponse: CampaignResponse.pipe(T.HttpPayload()) }) {}
export const ListOfCampaignResponse = S.Array(CampaignResponse);
export class CampaignsResponse extends S.Class<CampaignsResponse>(
  "CampaignsResponse",
)({ Item: ListOfCampaignResponse, NextToken: S.optional(S.String) }) {}
export class GetCampaignVersionsResponse extends S.Class<GetCampaignVersionsResponse>(
  "GetCampaignVersionsResponse",
)({ CampaignsResponse: CampaignsResponse.pipe(T.HttpPayload()) }) {}
export class EmailChannelResponse extends S.Class<EmailChannelResponse>(
  "EmailChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  ConfigurationSet: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  FromAddress: S.optional(S.String),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  Identity: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  MessagesPerSecond: S.optional(S.Number),
  Platform: S.String,
  RoleArn: S.optional(S.String),
  OrchestrationSendingRoleArn: S.optional(S.String),
  Version: S.optional(S.Number),
}) {}
export class GetEmailChannelResponse extends S.Class<GetEmailChannelResponse>(
  "GetEmailChannelResponse",
)({ EmailChannelResponse: EmailChannelResponse.pipe(T.HttpPayload()) }) {}
export class EndpointDemographic extends S.Class<EndpointDemographic>(
  "EndpointDemographic",
)({
  AppVersion: S.optional(S.String),
  Locale: S.optional(S.String),
  Make: S.optional(S.String),
  Model: S.optional(S.String),
  ModelVersion: S.optional(S.String),
  Platform: S.optional(S.String),
  PlatformVersion: S.optional(S.String),
  Timezone: S.optional(S.String),
}) {}
export class EndpointLocation extends S.Class<EndpointLocation>(
  "EndpointLocation",
)({
  City: S.optional(S.String),
  Country: S.optional(S.String),
  Latitude: S.optional(S.Number),
  Longitude: S.optional(S.Number),
  PostalCode: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export const MapOf__double = S.Record({ key: S.String, value: S.Number });
export class EndpointUser extends S.Class<EndpointUser>("EndpointUser")({
  UserAttributes: S.optional(MapOfListOf__string),
  UserId: S.optional(S.String),
}) {}
export class EndpointResponse extends S.Class<EndpointResponse>(
  "EndpointResponse",
)({
  Address: S.optional(S.String),
  ApplicationId: S.optional(S.String),
  Attributes: S.optional(MapOfListOf__string),
  ChannelType: S.optional(S.String),
  CohortId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Demographic: S.optional(EndpointDemographic),
  EffectiveDate: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
  Id: S.optional(S.String),
  Location: S.optional(EndpointLocation),
  Metrics: S.optional(MapOf__double),
  OptOut: S.optional(S.String),
  RequestId: S.optional(S.String),
  User: S.optional(EndpointUser),
}) {}
export class GetEndpointResponse extends S.Class<GetEndpointResponse>(
  "GetEndpointResponse",
)({ EndpointResponse: EndpointResponse.pipe(T.HttpPayload()) }) {}
export class EventStream extends S.Class<EventStream>("EventStream")({
  ApplicationId: S.String,
  DestinationStreamArn: S.String,
  ExternalId: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  LastUpdatedBy: S.optional(S.String),
  RoleArn: S.String,
}) {}
export class GetEventStreamResponse extends S.Class<GetEventStreamResponse>(
  "GetEventStreamResponse",
)({ EventStream: EventStream.pipe(T.HttpPayload()) }) {}
export class GCMChannelResponse extends S.Class<GCMChannelResponse>(
  "GCMChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Credential: S.optional(S.String),
  DefaultAuthenticationMethod: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  HasFcmServiceCredentials: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetGcmChannelResponse extends S.Class<GetGcmChannelResponse>(
  "GetGcmChannelResponse",
)({ GCMChannelResponse: GCMChannelResponse.pipe(T.HttpPayload()) }) {}
export class JourneyResponse extends S.Class<JourneyResponse>(
  "JourneyResponse",
)({
  Activities: S.optional(MapOfActivity),
  ApplicationId: S.String,
  CreationDate: S.optional(S.String),
  Id: S.String,
  LastModifiedDate: S.optional(S.String),
  Limits: S.optional(JourneyLimits),
  LocalTime: S.optional(S.Boolean),
  Name: S.String,
  QuietTime: S.optional(QuietTime),
  RefreshFrequency: S.optional(S.String),
  Schedule: S.optional(JourneySchedule),
  StartActivity: S.optional(S.String),
  StartCondition: S.optional(StartCondition),
  State: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  WaitForQuietTime: S.optional(S.Boolean),
  RefreshOnSegmentUpdate: S.optional(S.Boolean),
  JourneyChannelSettings: S.optional(JourneyChannelSettings),
  SendingSchedule: S.optional(S.Boolean),
  OpenHours: S.optional(OpenHours),
  ClosedDays: S.optional(ClosedDays),
  TimezoneEstimationMethods: S.optional(
    ListOf__TimezoneEstimationMethodsElement,
  ),
}) {}
export class GetJourneyResponse extends S.Class<GetJourneyResponse>(
  "GetJourneyResponse",
)({ JourneyResponse: JourneyResponse.pipe(T.HttpPayload()) }) {}
export class RecommenderConfigurationResponse extends S.Class<RecommenderConfigurationResponse>(
  "RecommenderConfigurationResponse",
)({
  Attributes: S.optional(MapOf__string),
  CreationDate: S.String,
  Description: S.optional(S.String),
  Id: S.String,
  LastModifiedDate: S.String,
  Name: S.optional(S.String),
  RecommendationProviderIdType: S.optional(S.String),
  RecommendationProviderRoleArn: S.String,
  RecommendationProviderUri: S.String,
  RecommendationTransformerUri: S.optional(S.String),
  RecommendationsDisplayName: S.optional(S.String),
  RecommendationsPerMessage: S.optional(S.Number),
}) {}
export class GetRecommenderConfigurationResponse extends S.Class<GetRecommenderConfigurationResponse>(
  "GetRecommenderConfigurationResponse",
)({
  RecommenderConfigurationResponse: RecommenderConfigurationResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export const MapOf__integer = S.Record({ key: S.String, value: S.Number });
export class SegmentImportResource extends S.Class<SegmentImportResource>(
  "SegmentImportResource",
)({
  ChannelCounts: S.optional(MapOf__integer),
  ExternalId: S.String,
  Format: S.String,
  RoleArn: S.String,
  S3Url: S.String,
  Size: S.Number,
}) {}
export class SegmentResponse extends S.Class<SegmentResponse>(
  "SegmentResponse",
)({
  ApplicationId: S.String,
  Arn: S.String,
  CreationDate: S.String,
  Dimensions: S.optional(SegmentDimensions),
  Id: S.String,
  ImportDefinition: S.optional(SegmentImportResource),
  LastModifiedDate: S.optional(S.String),
  Name: S.optional(S.String),
  SegmentGroups: S.optional(SegmentGroupList),
  SegmentType: S.String,
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  Version: S.optional(S.Number),
}) {}
export class GetSegmentResponse extends S.Class<GetSegmentResponse>(
  "GetSegmentResponse",
)({ SegmentResponse: SegmentResponse.pipe(T.HttpPayload()) }) {}
export class ExportJobResource extends S.Class<ExportJobResource>(
  "ExportJobResource",
)({
  RoleArn: S.String,
  S3UrlPrefix: S.String,
  SegmentId: S.optional(S.String),
  SegmentVersion: S.optional(S.Number),
}) {}
export class ExportJobResponse extends S.Class<ExportJobResponse>(
  "ExportJobResponse",
)({
  ApplicationId: S.String,
  CompletedPieces: S.optional(S.Number),
  CompletionDate: S.optional(S.String),
  CreationDate: S.String,
  Definition: ExportJobResource,
  FailedPieces: S.optional(S.Number),
  Failures: S.optional(ListOf__string),
  Id: S.String,
  JobStatus: S.String,
  TotalFailures: S.optional(S.Number),
  TotalPieces: S.optional(S.Number),
  TotalProcessed: S.optional(S.Number),
  Type: S.String,
}) {}
export const ListOfExportJobResponse = S.Array(ExportJobResponse);
export class ExportJobsResponse extends S.Class<ExportJobsResponse>(
  "ExportJobsResponse",
)({ Item: ListOfExportJobResponse, NextToken: S.optional(S.String) }) {}
export class GetSegmentExportJobsResponse extends S.Class<GetSegmentExportJobsResponse>(
  "GetSegmentExportJobsResponse",
)({ ExportJobsResponse: ExportJobsResponse.pipe(T.HttpPayload()) }) {}
export class ImportJobResource extends S.Class<ImportJobResource>(
  "ImportJobResource",
)({
  DefineSegment: S.optional(S.Boolean),
  ExternalId: S.optional(S.String),
  Format: S.String,
  RegisterEndpoints: S.optional(S.Boolean),
  RoleArn: S.String,
  S3Url: S.String,
  SegmentId: S.optional(S.String),
  SegmentName: S.optional(S.String),
}) {}
export class ImportJobResponse extends S.Class<ImportJobResponse>(
  "ImportJobResponse",
)({
  ApplicationId: S.String,
  CompletedPieces: S.optional(S.Number),
  CompletionDate: S.optional(S.String),
  CreationDate: S.String,
  Definition: ImportJobResource,
  FailedPieces: S.optional(S.Number),
  Failures: S.optional(ListOf__string),
  Id: S.String,
  JobStatus: S.String,
  TotalFailures: S.optional(S.Number),
  TotalPieces: S.optional(S.Number),
  TotalProcessed: S.optional(S.Number),
  Type: S.String,
}) {}
export const ListOfImportJobResponse = S.Array(ImportJobResponse);
export class ImportJobsResponse extends S.Class<ImportJobsResponse>(
  "ImportJobsResponse",
)({ Item: ListOfImportJobResponse, NextToken: S.optional(S.String) }) {}
export class GetSegmentImportJobsResponse extends S.Class<GetSegmentImportJobsResponse>(
  "GetSegmentImportJobsResponse",
)({ ImportJobsResponse: ImportJobsResponse.pipe(T.HttpPayload()) }) {}
export class GetSegmentVersionResponse extends S.Class<GetSegmentVersionResponse>(
  "GetSegmentVersionResponse",
)({ SegmentResponse: SegmentResponse.pipe(T.HttpPayload()) }) {}
export const ListOfSegmentResponse = S.Array(SegmentResponse);
export class SegmentsResponse extends S.Class<SegmentsResponse>(
  "SegmentsResponse",
)({ Item: ListOfSegmentResponse, NextToken: S.optional(S.String) }) {}
export class GetSegmentVersionsResponse extends S.Class<GetSegmentVersionsResponse>(
  "GetSegmentVersionsResponse",
)({ SegmentsResponse: SegmentsResponse.pipe(T.HttpPayload()) }) {}
export class SMSChannelResponse extends S.Class<SMSChannelResponse>(
  "SMSChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  PromotionalMessagesPerSecond: S.optional(S.Number),
  SenderId: S.optional(S.String),
  ShortCode: S.optional(S.String),
  TransactionalMessagesPerSecond: S.optional(S.Number),
  Version: S.optional(S.Number),
}) {}
export class GetSmsChannelResponse extends S.Class<GetSmsChannelResponse>(
  "GetSmsChannelResponse",
)({ SMSChannelResponse: SMSChannelResponse.pipe(T.HttpPayload()) }) {}
export const ListOfEndpointResponse = S.Array(EndpointResponse);
export class EndpointsResponse extends S.Class<EndpointsResponse>(
  "EndpointsResponse",
)({ Item: ListOfEndpointResponse }) {}
export class GetUserEndpointsResponse extends S.Class<GetUserEndpointsResponse>(
  "GetUserEndpointsResponse",
)({ EndpointsResponse: EndpointsResponse.pipe(T.HttpPayload()) }) {}
export class VoiceChannelResponse extends S.Class<VoiceChannelResponse>(
  "VoiceChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Platform: S.String,
  Version: S.optional(S.Number),
}) {}
export class GetVoiceChannelResponse extends S.Class<GetVoiceChannelResponse>(
  "GetVoiceChannelResponse",
)({ VoiceChannelResponse: VoiceChannelResponse.pipe(T.HttpPayload()) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ TagsModel: TagsModel.pipe(T.HttpPayload()) }) {}
export class PhoneNumberValidateRequest extends S.Class<PhoneNumberValidateRequest>(
  "PhoneNumberValidateRequest",
)(
  { NumberValidateRequest: NumberValidateRequest.pipe(T.HttpPayload()) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/phone/number/validate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutEventStreamRequest extends S.Class<PutEventStreamRequest>(
  "PutEventStreamRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    WriteEventStream: WriteEventStream.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/eventstream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveAttributesRequest extends S.Class<RemoveAttributesRequest>(
  "RemoveAttributesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    AttributeType: S.String.pipe(T.HttpLabel()),
    UpdateAttributesRequest: UpdateAttributesRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/attributes/{AttributeType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendOTPMessageRequest extends S.Class<SendOTPMessageRequest>(
  "SendOTPMessageRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SendOTPMessageRequestParameters: SendOTPMessageRequestParameters.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/otp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendUsersMessagesRequest extends S.Class<SendUsersMessagesRequest>(
  "SendUsersMessagesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SendUsersMessageRequest: SendUsersMessageRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/users-messages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagsModel: TagsModel.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
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
export class UpdateAdmChannelRequest extends S.Class<UpdateAdmChannelRequest>(
  "UpdateAdmChannelRequest",
)(
  {
    ADMChannelRequest: ADMChannelRequest.pipe(T.HttpPayload()),
    ApplicationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/adm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApnsChannelRequest extends S.Class<UpdateApnsChannelRequest>(
  "UpdateApnsChannelRequest",
)(
  {
    APNSChannelRequest: APNSChannelRequest.pipe(T.HttpPayload()),
    ApplicationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/apns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApnsSandboxChannelRequest extends S.Class<UpdateApnsSandboxChannelRequest>(
  "UpdateApnsSandboxChannelRequest",
)(
  {
    APNSSandboxChannelRequest: APNSSandboxChannelRequest.pipe(T.HttpPayload()),
    ApplicationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/channels/apns_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApnsVoipChannelRequest extends S.Class<UpdateApnsVoipChannelRequest>(
  "UpdateApnsVoipChannelRequest",
)(
  {
    APNSVoipChannelRequest: APNSVoipChannelRequest.pipe(T.HttpPayload()),
    ApplicationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApnsVoipSandboxChannelRequest extends S.Class<UpdateApnsVoipSandboxChannelRequest>(
  "UpdateApnsVoipSandboxChannelRequest",
)(
  {
    APNSVoipSandboxChannelRequest: APNSVoipSandboxChannelRequest.pipe(
      T.HttpPayload(),
    ),
    ApplicationId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/channels/apns_voip_sandbox",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBaiduChannelRequest extends S.Class<UpdateBaiduChannelRequest>(
  "UpdateBaiduChannelRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    BaiduChannelRequest: BaiduChannelRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/baidu" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCampaignResponse extends S.Class<UpdateCampaignResponse>(
  "UpdateCampaignResponse",
)({ CampaignResponse: CampaignResponse.pipe(T.HttpPayload()) }) {}
export class UpdateEmailChannelRequest extends S.Class<UpdateEmailChannelRequest>(
  "UpdateEmailChannelRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EmailChannelRequest: EmailChannelRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEmailTemplateResponse extends S.Class<UpdateEmailTemplateResponse>(
  "UpdateEmailTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateGcmChannelRequest extends S.Class<UpdateGcmChannelRequest>(
  "UpdateGcmChannelRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    GCMChannelRequest: GCMChannelRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/gcm" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInAppTemplateResponse extends S.Class<UpdateInAppTemplateResponse>(
  "UpdateInAppTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateJourneyResponse extends S.Class<UpdateJourneyResponse>(
  "UpdateJourneyResponse",
)({ JourneyResponse: JourneyResponse.pipe(T.HttpPayload()) }) {}
export class UpdateJourneyStateRequest extends S.Class<UpdateJourneyStateRequest>(
  "UpdateJourneyStateRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    JourneyId: S.String.pipe(T.HttpLabel()),
    JourneyStateRequest: JourneyStateRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/journeys/{JourneyId}/state",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePushTemplateResponse extends S.Class<UpdatePushTemplateResponse>(
  "UpdatePushTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateRecommenderConfigurationRequest extends S.Class<UpdateRecommenderConfigurationRequest>(
  "UpdateRecommenderConfigurationRequest",
)(
  {
    RecommenderId: S.String.pipe(T.HttpLabel()),
    UpdateRecommenderConfiguration: UpdateRecommenderConfigurationShape.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/recommenders/{RecommenderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSegmentResponse extends S.Class<UpdateSegmentResponse>(
  "UpdateSegmentResponse",
)({ SegmentResponse: SegmentResponse.pipe(T.HttpPayload()) }) {}
export class UpdateSmsChannelRequest extends S.Class<UpdateSmsChannelRequest>(
  "UpdateSmsChannelRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    SMSChannelRequest: SMSChannelRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/sms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSmsTemplateResponse extends S.Class<UpdateSmsTemplateResponse>(
  "UpdateSmsTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateTemplateActiveVersionRequest extends S.Class<UpdateTemplateActiveVersionRequest>(
  "UpdateTemplateActiveVersionRequest",
)(
  {
    TemplateActiveVersionRequest: TemplateActiveVersionRequest.pipe(
      T.HttpPayload(),
    ),
    TemplateName: S.String.pipe(T.HttpLabel()),
    TemplateType: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/templates/{TemplateName}/{TemplateType}/active-version",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVoiceChannelRequest extends S.Class<UpdateVoiceChannelRequest>(
  "UpdateVoiceChannelRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    VoiceChannelRequest: VoiceChannelRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/voice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVoiceTemplateResponse extends S.Class<UpdateVoiceTemplateResponse>(
  "UpdateVoiceTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class VerifyOTPMessageRequest extends S.Class<VerifyOTPMessageRequest>(
  "VerifyOTPMessageRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    VerifyOTPMessageRequestParameters: VerifyOTPMessageRequestParameters.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/verify-otp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ListOfApplicationResponse = S.Array(ApplicationResponse);
export const ListOfRecommenderConfigurationResponse = S.Array(
  RecommenderConfigurationResponse,
);
export const ListOfJourneyResponse = S.Array(JourneyResponse);
export class ApplicationSettingsJourneyLimits extends S.Class<ApplicationSettingsJourneyLimits>(
  "ApplicationSettingsJourneyLimits",
)({
  DailyCap: S.optional(S.Number),
  TimeframeCap: S.optional(JourneyTimeframeCap),
  TotalCap: S.optional(S.Number),
}) {}
export class EndpointBatchItem extends S.Class<EndpointBatchItem>(
  "EndpointBatchItem",
)({
  Address: S.optional(S.String),
  Attributes: S.optional(MapOfListOf__string),
  ChannelType: S.optional(S.String),
  Demographic: S.optional(EndpointDemographic),
  EffectiveDate: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
  Id: S.optional(S.String),
  Location: S.optional(EndpointLocation),
  Metrics: S.optional(MapOf__double),
  OptOut: S.optional(S.String),
  RequestId: S.optional(S.String),
  User: S.optional(EndpointUser),
}) {}
export const ListOfEndpointBatchItem = S.Array(EndpointBatchItem);
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)({
  Name: S.String,
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
}) {}
export class ApplicationSettingsResource extends S.Class<ApplicationSettingsResource>(
  "ApplicationSettingsResource",
)({
  ApplicationId: S.String,
  CampaignHook: S.optional(CampaignHook),
  LastModifiedDate: S.optional(S.String),
  Limits: S.optional(CampaignLimits),
  QuietTime: S.optional(QuietTime),
  JourneyLimits: S.optional(ApplicationSettingsJourneyLimits),
}) {}
export class ApplicationsResponse extends S.Class<ApplicationsResponse>(
  "ApplicationsResponse",
)({
  Item: S.optional(ListOfApplicationResponse),
  NextToken: S.optional(S.String),
}) {}
export class ResultRowValue extends S.Class<ResultRowValue>("ResultRowValue")({
  Key: S.String,
  Type: S.String,
  Value: S.String,
}) {}
export const ListOfResultRowValue = S.Array(ResultRowValue);
export class ResultRow extends S.Class<ResultRow>("ResultRow")({
  GroupedBys: ListOfResultRowValue,
  Values: ListOfResultRowValue,
}) {}
export const ListOfResultRow = S.Array(ResultRow);
export class BaseKpiResult extends S.Class<BaseKpiResult>("BaseKpiResult")({
  Rows: ListOfResultRow,
}) {}
export class CampaignDateRangeKpiResponse extends S.Class<CampaignDateRangeKpiResponse>(
  "CampaignDateRangeKpiResponse",
)({
  ApplicationId: S.String,
  CampaignId: S.String,
  EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  KpiName: S.String,
  KpiResult: BaseKpiResult,
  NextToken: S.optional(S.String),
  StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class EmailTemplateResponse extends S.Class<EmailTemplateResponse>(
  "EmailTemplateResponse",
)({
  Arn: S.optional(S.String),
  CreationDate: S.String,
  DefaultSubstitutions: S.optional(S.String),
  HtmlPart: S.optional(S.String),
  LastModifiedDate: S.String,
  RecommenderId: S.optional(S.String),
  Subject: S.optional(S.String),
  Headers: S.optional(ListOfMessageHeader),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  TextPart: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class InAppTemplateResponse extends S.Class<InAppTemplateResponse>(
  "InAppTemplateResponse",
)({
  Arn: S.optional(S.String),
  Content: S.optional(ListOfInAppMessageContent),
  CreationDate: S.String,
  CustomConfig: S.optional(MapOf__string),
  LastModifiedDate: S.String,
  Layout: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
}) {}
export class JourneyDateRangeKpiResponse extends S.Class<JourneyDateRangeKpiResponse>(
  "JourneyDateRangeKpiResponse",
)({
  ApplicationId: S.String,
  EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  JourneyId: S.String,
  KpiName: S.String,
  KpiResult: BaseKpiResult,
  NextToken: S.optional(S.String),
  StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class JourneyExecutionActivityMetricsResponse extends S.Class<JourneyExecutionActivityMetricsResponse>(
  "JourneyExecutionActivityMetricsResponse",
)({
  ActivityType: S.String,
  ApplicationId: S.String,
  JourneyActivityId: S.String,
  JourneyId: S.String,
  LastEvaluatedTime: S.String,
  Metrics: MapOf__string,
}) {}
export class JourneyExecutionMetricsResponse extends S.Class<JourneyExecutionMetricsResponse>(
  "JourneyExecutionMetricsResponse",
)({
  ApplicationId: S.String,
  JourneyId: S.String,
  LastEvaluatedTime: S.String,
  Metrics: MapOf__string,
}) {}
export class JourneyRunExecutionActivityMetricsResponse extends S.Class<JourneyRunExecutionActivityMetricsResponse>(
  "JourneyRunExecutionActivityMetricsResponse",
)({
  ActivityType: S.String,
  ApplicationId: S.String,
  JourneyActivityId: S.String,
  JourneyId: S.String,
  LastEvaluatedTime: S.String,
  Metrics: MapOf__string,
  RunId: S.String,
}) {}
export class JourneyRunExecutionMetricsResponse extends S.Class<JourneyRunExecutionMetricsResponse>(
  "JourneyRunExecutionMetricsResponse",
)({
  ApplicationId: S.String,
  JourneyId: S.String,
  LastEvaluatedTime: S.String,
  Metrics: MapOf__string,
  RunId: S.String,
}) {}
export class PushNotificationTemplateResponse extends S.Class<PushNotificationTemplateResponse>(
  "PushNotificationTemplateResponse",
)({
  ADM: S.optional(AndroidPushNotificationTemplate),
  APNS: S.optional(APNSPushNotificationTemplate),
  Arn: S.optional(S.String),
  Baidu: S.optional(AndroidPushNotificationTemplate),
  CreationDate: S.String,
  Default: S.optional(DefaultPushNotificationTemplate),
  DefaultSubstitutions: S.optional(S.String),
  GCM: S.optional(AndroidPushNotificationTemplate),
  LastModifiedDate: S.String,
  RecommenderId: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
}) {}
export class ListRecommenderConfigurationsResponse extends S.Class<ListRecommenderConfigurationsResponse>(
  "ListRecommenderConfigurationsResponse",
)({
  Item: ListOfRecommenderConfigurationResponse,
  NextToken: S.optional(S.String),
}) {}
export class SMSTemplateResponse extends S.Class<SMSTemplateResponse>(
  "SMSTemplateResponse",
)({
  Arn: S.optional(S.String),
  Body: S.optional(S.String),
  CreationDate: S.String,
  DefaultSubstitutions: S.optional(S.String),
  LastModifiedDate: S.String,
  RecommenderId: S.optional(S.String),
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
}) {}
export class VoiceTemplateResponse extends S.Class<VoiceTemplateResponse>(
  "VoiceTemplateResponse",
)({
  Arn: S.optional(S.String),
  Body: S.optional(S.String),
  CreationDate: S.String,
  DefaultSubstitutions: S.optional(S.String),
  LanguageCode: S.optional(S.String),
  LastModifiedDate: S.String,
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
  VoiceId: S.optional(S.String),
}) {}
export class JourneysResponse extends S.Class<JourneysResponse>(
  "JourneysResponse",
)({ Item: ListOfJourneyResponse, NextToken: S.optional(S.String) }) {}
export class WriteApplicationSettingsRequest extends S.Class<WriteApplicationSettingsRequest>(
  "WriteApplicationSettingsRequest",
)({
  CampaignHook: S.optional(CampaignHook),
  CloudWatchMetricsEnabled: S.optional(S.Boolean),
  EventTaggingEnabled: S.optional(S.Boolean),
  Limits: S.optional(CampaignLimits),
  QuietTime: S.optional(QuietTime),
  JourneyLimits: S.optional(ApplicationSettingsJourneyLimits),
}) {}
export class EndpointRequest extends S.Class<EndpointRequest>(
  "EndpointRequest",
)({
  Address: S.optional(S.String),
  Attributes: S.optional(MapOfListOf__string),
  ChannelType: S.optional(S.String),
  Demographic: S.optional(EndpointDemographic),
  EffectiveDate: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
  Location: S.optional(EndpointLocation),
  Metrics: S.optional(MapOf__double),
  OptOut: S.optional(S.String),
  RequestId: S.optional(S.String),
  User: S.optional(EndpointUser),
}) {}
export class EndpointBatchRequest extends S.Class<EndpointBatchRequest>(
  "EndpointBatchRequest",
)({ Item: ListOfEndpointBatchItem }) {}
export class AddressConfiguration extends S.Class<AddressConfiguration>(
  "AddressConfiguration",
)({
  BodyOverride: S.optional(S.String),
  ChannelType: S.optional(S.String),
  Context: S.optional(MapOf__string),
  RawContent: S.optional(S.String),
  Substitutions: S.optional(MapOfListOf__string),
  TitleOverride: S.optional(S.String),
}) {}
export class CreateAppRequest extends S.Class<CreateAppRequest>(
  "CreateAppRequest",
)(
  { CreateApplicationRequest: CreateApplicationRequest.pipe(T.HttpPayload()) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEmailTemplateRequest extends S.Class<CreateEmailTemplateRequest>(
  "CreateEmailTemplateRequest",
)(
  {
    EmailTemplateRequest: EmailTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/email" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateExportJobResponse extends S.Class<CreateExportJobResponse>(
  "CreateExportJobResponse",
)({ ExportJobResponse: ExportJobResponse.pipe(T.HttpPayload()) }) {}
export class CreateImportJobResponse extends S.Class<CreateImportJobResponse>(
  "CreateImportJobResponse",
)({ ImportJobResponse: ImportJobResponse.pipe(T.HttpPayload()) }) {}
export class CreatePushTemplateRequest extends S.Class<CreatePushTemplateRequest>(
  "CreatePushTemplateRequest",
)(
  {
    PushNotificationTemplateRequest: PushNotificationTemplateRequest.pipe(
      T.HttpPayload(),
    ),
    TemplateName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/push" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRecommenderConfigurationResponse extends S.Class<CreateRecommenderConfigurationResponse>(
  "CreateRecommenderConfigurationResponse",
)({
  RecommenderConfigurationResponse: RecommenderConfigurationResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class CreateTemplateMessageBody extends S.Class<CreateTemplateMessageBody>(
  "CreateTemplateMessageBody",
)({
  Arn: S.optional(S.String),
  Message: S.optional(S.String),
  RequestID: S.optional(S.String),
}) {}
export class CreateVoiceTemplateResponse extends S.Class<CreateVoiceTemplateResponse>(
  "CreateVoiceTemplateResponse",
)({
  CreateTemplateMessageBody: CreateTemplateMessageBody.pipe(T.HttpPayload()),
}) {}
export class DeleteAdmChannelResponse extends S.Class<DeleteAdmChannelResponse>(
  "DeleteAdmChannelResponse",
)({ ADMChannelResponse: ADMChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteApnsChannelResponse extends S.Class<DeleteApnsChannelResponse>(
  "DeleteApnsChannelResponse",
)({ APNSChannelResponse: APNSChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteApnsSandboxChannelResponse extends S.Class<DeleteApnsSandboxChannelResponse>(
  "DeleteApnsSandboxChannelResponse",
)({
  APNSSandboxChannelResponse: APNSSandboxChannelResponse.pipe(T.HttpPayload()),
}) {}
export class DeleteApnsVoipChannelResponse extends S.Class<DeleteApnsVoipChannelResponse>(
  "DeleteApnsVoipChannelResponse",
)({ APNSVoipChannelResponse: APNSVoipChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteApnsVoipSandboxChannelResponse extends S.Class<DeleteApnsVoipSandboxChannelResponse>(
  "DeleteApnsVoipSandboxChannelResponse",
)({
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class DeleteAppResponse extends S.Class<DeleteAppResponse>(
  "DeleteAppResponse",
)({ ApplicationResponse: ApplicationResponse.pipe(T.HttpPayload()) }) {}
export class DeleteBaiduChannelResponse extends S.Class<DeleteBaiduChannelResponse>(
  "DeleteBaiduChannelResponse",
)({ BaiduChannelResponse: BaiduChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteEmailChannelResponse extends S.Class<DeleteEmailChannelResponse>(
  "DeleteEmailChannelResponse",
)({ EmailChannelResponse: EmailChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteEmailTemplateResponse extends S.Class<DeleteEmailTemplateResponse>(
  "DeleteEmailTemplateResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({ EndpointResponse: EndpointResponse.pipe(T.HttpPayload()) }) {}
export class DeleteEventStreamResponse extends S.Class<DeleteEventStreamResponse>(
  "DeleteEventStreamResponse",
)({ EventStream: EventStream.pipe(T.HttpPayload()) }) {}
export class DeleteGcmChannelResponse extends S.Class<DeleteGcmChannelResponse>(
  "DeleteGcmChannelResponse",
)({ GCMChannelResponse: GCMChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteJourneyResponse extends S.Class<DeleteJourneyResponse>(
  "DeleteJourneyResponse",
)({ JourneyResponse: JourneyResponse.pipe(T.HttpPayload()) }) {}
export class DeleteRecommenderConfigurationResponse extends S.Class<DeleteRecommenderConfigurationResponse>(
  "DeleteRecommenderConfigurationResponse",
)({
  RecommenderConfigurationResponse: RecommenderConfigurationResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class DeleteSmsChannelResponse extends S.Class<DeleteSmsChannelResponse>(
  "DeleteSmsChannelResponse",
)({ SMSChannelResponse: SMSChannelResponse.pipe(T.HttpPayload()) }) {}
export class DeleteUserEndpointsResponse extends S.Class<DeleteUserEndpointsResponse>(
  "DeleteUserEndpointsResponse",
)({ EndpointsResponse: EndpointsResponse.pipe(T.HttpPayload()) }) {}
export class DeleteVoiceChannelResponse extends S.Class<DeleteVoiceChannelResponse>(
  "DeleteVoiceChannelResponse",
)({ VoiceChannelResponse: VoiceChannelResponse.pipe(T.HttpPayload()) }) {}
export class GetApplicationSettingsResponse extends S.Class<GetApplicationSettingsResponse>(
  "GetApplicationSettingsResponse",
)({
  ApplicationSettingsResource: ApplicationSettingsResource.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetAppsResponse extends S.Class<GetAppsResponse>(
  "GetAppsResponse",
)({ ApplicationsResponse: ApplicationsResponse.pipe(T.HttpPayload()) }) {}
export class GetCampaignDateRangeKpiResponse extends S.Class<GetCampaignDateRangeKpiResponse>(
  "GetCampaignDateRangeKpiResponse",
)({
  CampaignDateRangeKpiResponse: CampaignDateRangeKpiResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetCampaignsResponse extends S.Class<GetCampaignsResponse>(
  "GetCampaignsResponse",
)({ CampaignsResponse: CampaignsResponse.pipe(T.HttpPayload()) }) {}
export class GetEmailTemplateResponse extends S.Class<GetEmailTemplateResponse>(
  "GetEmailTemplateResponse",
)({ EmailTemplateResponse: EmailTemplateResponse.pipe(T.HttpPayload()) }) {}
export class GetExportJobsResponse extends S.Class<GetExportJobsResponse>(
  "GetExportJobsResponse",
)({ ExportJobsResponse: ExportJobsResponse.pipe(T.HttpPayload()) }) {}
export class GetImportJobsResponse extends S.Class<GetImportJobsResponse>(
  "GetImportJobsResponse",
)({ ImportJobsResponse: ImportJobsResponse.pipe(T.HttpPayload()) }) {}
export class GetInAppTemplateResponse extends S.Class<GetInAppTemplateResponse>(
  "GetInAppTemplateResponse",
)({ InAppTemplateResponse: InAppTemplateResponse.pipe(T.HttpPayload()) }) {}
export class GetJourneyDateRangeKpiResponse extends S.Class<GetJourneyDateRangeKpiResponse>(
  "GetJourneyDateRangeKpiResponse",
)({
  JourneyDateRangeKpiResponse: JourneyDateRangeKpiResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetJourneyExecutionActivityMetricsResponse extends S.Class<GetJourneyExecutionActivityMetricsResponse>(
  "GetJourneyExecutionActivityMetricsResponse",
)({
  JourneyExecutionActivityMetricsResponse:
    JourneyExecutionActivityMetricsResponse.pipe(T.HttpPayload()),
}) {}
export class GetJourneyExecutionMetricsResponse extends S.Class<GetJourneyExecutionMetricsResponse>(
  "GetJourneyExecutionMetricsResponse",
)({
  JourneyExecutionMetricsResponse: JourneyExecutionMetricsResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetJourneyRunExecutionActivityMetricsResponse extends S.Class<GetJourneyRunExecutionActivityMetricsResponse>(
  "GetJourneyRunExecutionActivityMetricsResponse",
)({
  JourneyRunExecutionActivityMetricsResponse:
    JourneyRunExecutionActivityMetricsResponse.pipe(T.HttpPayload()),
}) {}
export class GetJourneyRunExecutionMetricsResponse extends S.Class<GetJourneyRunExecutionMetricsResponse>(
  "GetJourneyRunExecutionMetricsResponse",
)({
  JourneyRunExecutionMetricsResponse: JourneyRunExecutionMetricsResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetPushTemplateResponse extends S.Class<GetPushTemplateResponse>(
  "GetPushTemplateResponse",
)({
  PushNotificationTemplateResponse: PushNotificationTemplateResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class GetRecommenderConfigurationsResponse extends S.Class<GetRecommenderConfigurationsResponse>(
  "GetRecommenderConfigurationsResponse",
)({
  ListRecommenderConfigurationsResponse:
    ListRecommenderConfigurationsResponse.pipe(T.HttpPayload()),
}) {}
export class GetSegmentsResponse extends S.Class<GetSegmentsResponse>(
  "GetSegmentsResponse",
)({ SegmentsResponse: SegmentsResponse.pipe(T.HttpPayload()) }) {}
export class GetSmsTemplateResponse extends S.Class<GetSmsTemplateResponse>(
  "GetSmsTemplateResponse",
)({ SMSTemplateResponse: SMSTemplateResponse.pipe(T.HttpPayload()) }) {}
export class GetVoiceTemplateResponse extends S.Class<GetVoiceTemplateResponse>(
  "GetVoiceTemplateResponse",
)({ VoiceTemplateResponse: VoiceTemplateResponse.pipe(T.HttpPayload()) }) {}
export class ListJourneysResponse extends S.Class<ListJourneysResponse>(
  "ListJourneysResponse",
)({ JourneysResponse: JourneysResponse.pipe(T.HttpPayload()) }) {}
export class PutEventStreamResponse extends S.Class<PutEventStreamResponse>(
  "PutEventStreamResponse",
)({ EventStream: EventStream.pipe(T.HttpPayload()) }) {}
export class UpdateAdmChannelResponse extends S.Class<UpdateAdmChannelResponse>(
  "UpdateAdmChannelResponse",
)({ ADMChannelResponse: ADMChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateApnsChannelResponse extends S.Class<UpdateApnsChannelResponse>(
  "UpdateApnsChannelResponse",
)({ APNSChannelResponse: APNSChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateApnsSandboxChannelResponse extends S.Class<UpdateApnsSandboxChannelResponse>(
  "UpdateApnsSandboxChannelResponse",
)({
  APNSSandboxChannelResponse: APNSSandboxChannelResponse.pipe(T.HttpPayload()),
}) {}
export class UpdateApnsVoipChannelResponse extends S.Class<UpdateApnsVoipChannelResponse>(
  "UpdateApnsVoipChannelResponse",
)({ APNSVoipChannelResponse: APNSVoipChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateApnsVoipSandboxChannelResponse extends S.Class<UpdateApnsVoipSandboxChannelResponse>(
  "UpdateApnsVoipSandboxChannelResponse",
)({
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class UpdateApplicationSettingsRequest extends S.Class<UpdateApplicationSettingsRequest>(
  "UpdateApplicationSettingsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    WriteApplicationSettingsRequest: WriteApplicationSettingsRequest.pipe(
      T.HttpPayload(),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBaiduChannelResponse extends S.Class<UpdateBaiduChannelResponse>(
  "UpdateBaiduChannelResponse",
)({ BaiduChannelResponse: BaiduChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateEmailChannelResponse extends S.Class<UpdateEmailChannelResponse>(
  "UpdateEmailChannelResponse",
)({ EmailChannelResponse: EmailChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateEndpointRequest extends S.Class<UpdateEndpointRequest>(
  "UpdateEndpointRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndpointId: S.String.pipe(T.HttpLabel()),
    EndpointRequest: EndpointRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/apps/{ApplicationId}/endpoints/{EndpointId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEndpointsBatchRequest extends S.Class<UpdateEndpointsBatchRequest>(
  "UpdateEndpointsBatchRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EndpointBatchRequest: EndpointBatchRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/endpoints" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGcmChannelResponse extends S.Class<UpdateGcmChannelResponse>(
  "UpdateGcmChannelResponse",
)({ GCMChannelResponse: GCMChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateJourneyStateResponse extends S.Class<UpdateJourneyStateResponse>(
  "UpdateJourneyStateResponse",
)({ JourneyResponse: JourneyResponse.pipe(T.HttpPayload()) }) {}
export class UpdateRecommenderConfigurationResponse extends S.Class<UpdateRecommenderConfigurationResponse>(
  "UpdateRecommenderConfigurationResponse",
)({
  RecommenderConfigurationResponse: RecommenderConfigurationResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class UpdateSmsChannelResponse extends S.Class<UpdateSmsChannelResponse>(
  "UpdateSmsChannelResponse",
)({ SMSChannelResponse: SMSChannelResponse.pipe(T.HttpPayload()) }) {}
export class UpdateTemplateActiveVersionResponse extends S.Class<UpdateTemplateActiveVersionResponse>(
  "UpdateTemplateActiveVersionResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateVoiceChannelResponse extends S.Class<UpdateVoiceChannelResponse>(
  "UpdateVoiceChannelResponse",
)({ VoiceChannelResponse: VoiceChannelResponse.pipe(T.HttpPayload()) }) {}
export class ActivityResponse extends S.Class<ActivityResponse>(
  "ActivityResponse",
)({
  ApplicationId: S.String,
  CampaignId: S.String,
  End: S.optional(S.String),
  Id: S.String,
  Result: S.optional(S.String),
  ScheduledStart: S.optional(S.String),
  Start: S.optional(S.String),
  State: S.optional(S.String),
  SuccessfulEndpointCount: S.optional(S.Number),
  TimezonesCompletedCount: S.optional(S.Number),
  TimezonesTotalCount: S.optional(S.Number),
  TotalEndpointCount: S.optional(S.Number),
  TreatmentId: S.optional(S.String),
  ExecutionMetrics: S.optional(MapOf__string),
}) {}
export const ListOfActivityResponse = S.Array(ActivityResponse);
export class JourneyRunResponse extends S.Class<JourneyRunResponse>(
  "JourneyRunResponse",
)({
  CreationTime: S.String,
  LastUpdateTime: S.String,
  RunId: S.String,
  Status: S.String,
}) {}
export const ListOfJourneyRunResponse = S.Array(JourneyRunResponse);
export class TemplateResponse extends S.Class<TemplateResponse>(
  "TemplateResponse",
)({
  Arn: S.optional(S.String),
  CreationDate: S.String,
  DefaultSubstitutions: S.optional(S.String),
  LastModifiedDate: S.String,
  tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
}) {}
export const ListOfTemplateResponse = S.Array(TemplateResponse);
export class TemplateVersionResponse extends S.Class<TemplateVersionResponse>(
  "TemplateVersionResponse",
)({
  CreationDate: S.String,
  DefaultSubstitutions: S.optional(S.String),
  LastModifiedDate: S.String,
  TemplateDescription: S.optional(S.String),
  TemplateName: S.String,
  TemplateType: S.String,
  Version: S.optional(S.String),
}) {}
export const ListOfTemplateVersionResponse = S.Array(TemplateVersionResponse);
export const MapOfAddressConfiguration = S.Record({
  key: S.String,
  value: AddressConfiguration,
});
export class PublicEndpoint extends S.Class<PublicEndpoint>("PublicEndpoint")({
  Address: S.optional(S.String),
  Attributes: S.optional(MapOfListOf__string),
  ChannelType: S.optional(S.String),
  Demographic: S.optional(EndpointDemographic),
  EffectiveDate: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
  Location: S.optional(EndpointLocation),
  Metrics: S.optional(MapOf__double),
  OptOut: S.optional(S.String),
  RequestId: S.optional(S.String),
  User: S.optional(EndpointUser),
}) {}
export class ActivitiesResponse extends S.Class<ActivitiesResponse>(
  "ActivitiesResponse",
)({ Item: ListOfActivityResponse, NextToken: S.optional(S.String) }) {}
export class JourneyRunsResponse extends S.Class<JourneyRunsResponse>(
  "JourneyRunsResponse",
)({ Item: ListOfJourneyRunResponse, NextToken: S.optional(S.String) }) {}
export class TemplatesResponse extends S.Class<TemplatesResponse>(
  "TemplatesResponse",
)({ Item: ListOfTemplateResponse, NextToken: S.optional(S.String) }) {}
export class TemplateVersionsResponse extends S.Class<TemplateVersionsResponse>(
  "TemplateVersionsResponse",
)({
  Item: ListOfTemplateVersionResponse,
  Message: S.optional(S.String),
  NextToken: S.optional(S.String),
  RequestID: S.optional(S.String),
}) {}
export class NumberValidateResponse extends S.Class<NumberValidateResponse>(
  "NumberValidateResponse",
)({
  Carrier: S.optional(S.String),
  City: S.optional(S.String),
  CleansedPhoneNumberE164: S.optional(S.String),
  CleansedPhoneNumberNational: S.optional(S.String),
  Country: S.optional(S.String),
  CountryCodeIso2: S.optional(S.String),
  CountryCodeNumeric: S.optional(S.String),
  County: S.optional(S.String),
  OriginalCountryCodeIso2: S.optional(S.String),
  OriginalPhoneNumber: S.optional(S.String),
  PhoneType: S.optional(S.String),
  PhoneTypeCode: S.optional(S.Number),
  Timezone: S.optional(S.String),
  ZipCode: S.optional(S.String),
}) {}
export class AttributesResource extends S.Class<AttributesResource>(
  "AttributesResource",
)({
  ApplicationId: S.String,
  AttributeType: S.String,
  Attributes: S.optional(ListOf__string),
}) {}
export class VerificationResponse extends S.Class<VerificationResponse>(
  "VerificationResponse",
)({ Valid: S.optional(S.Boolean) }) {}
export class ChannelResponse extends S.Class<ChannelResponse>(
  "ChannelResponse",
)({
  ApplicationId: S.optional(S.String),
  CreationDate: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  HasCredential: S.optional(S.Boolean),
  Id: S.optional(S.String),
  IsArchived: S.optional(S.Boolean),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.String),
  Version: S.optional(S.Number),
}) {}
export class InAppMessage extends S.Class<InAppMessage>("InAppMessage")({
  Content: S.optional(ListOfInAppMessageContent),
  CustomConfig: S.optional(MapOf__string),
  Layout: S.optional(S.String),
}) {}
export class InAppCampaignSchedule extends S.Class<InAppCampaignSchedule>(
  "InAppCampaignSchedule",
)({
  EndDate: S.optional(S.String),
  EventFilter: S.optional(CampaignEventFilter),
  QuietTime: S.optional(QuietTime),
}) {}
export class CreateAppResponse extends S.Class<CreateAppResponse>(
  "CreateAppResponse",
)({ ApplicationResponse: ApplicationResponse.pipe(T.HttpPayload()) }) {}
export class CreateEmailTemplateResponse extends S.Class<CreateEmailTemplateResponse>(
  "CreateEmailTemplateResponse",
)({
  CreateTemplateMessageBody: CreateTemplateMessageBody.pipe(T.HttpPayload()),
}) {}
export class CreatePushTemplateResponse extends S.Class<CreatePushTemplateResponse>(
  "CreatePushTemplateResponse",
)({
  CreateTemplateMessageBody: CreateTemplateMessageBody.pipe(T.HttpPayload()),
}) {}
export class CreateSmsTemplateResponse extends S.Class<CreateSmsTemplateResponse>(
  "CreateSmsTemplateResponse",
)({
  CreateTemplateMessageBody: CreateTemplateMessageBody.pipe(T.HttpPayload()),
}) {}
export class DeleteCampaignResponse extends S.Class<DeleteCampaignResponse>(
  "DeleteCampaignResponse",
)({ CampaignResponse: CampaignResponse.pipe(T.HttpPayload()) }) {}
export class GetCampaignActivitiesResponse extends S.Class<GetCampaignActivitiesResponse>(
  "GetCampaignActivitiesResponse",
)({ ActivitiesResponse: ActivitiesResponse.pipe(T.HttpPayload()) }) {}
export class GetExportJobResponse extends S.Class<GetExportJobResponse>(
  "GetExportJobResponse",
)({ ExportJobResponse: ExportJobResponse.pipe(T.HttpPayload()) }) {}
export class GetImportJobResponse extends S.Class<GetImportJobResponse>(
  "GetImportJobResponse",
)({ ImportJobResponse: ImportJobResponse.pipe(T.HttpPayload()) }) {}
export class GetJourneyRunsResponse extends S.Class<GetJourneyRunsResponse>(
  "GetJourneyRunsResponse",
)({ JourneyRunsResponse: JourneyRunsResponse.pipe(T.HttpPayload()) }) {}
export class ListTemplatesResponse extends S.Class<ListTemplatesResponse>(
  "ListTemplatesResponse",
)({ TemplatesResponse: TemplatesResponse.pipe(T.HttpPayload()) }) {}
export class ListTemplateVersionsResponse extends S.Class<ListTemplateVersionsResponse>(
  "ListTemplateVersionsResponse",
)({
  TemplateVersionsResponse: TemplateVersionsResponse.pipe(T.HttpPayload()),
}) {}
export class PhoneNumberValidateResponse extends S.Class<PhoneNumberValidateResponse>(
  "PhoneNumberValidateResponse",
)({ NumberValidateResponse: NumberValidateResponse.pipe(T.HttpPayload()) }) {}
export class RemoveAttributesResponse extends S.Class<RemoveAttributesResponse>(
  "RemoveAttributesResponse",
)({ AttributesResource: AttributesResource.pipe(T.HttpPayload()) }) {}
export class UpdateApplicationSettingsResponse extends S.Class<UpdateApplicationSettingsResponse>(
  "UpdateApplicationSettingsResponse",
)({
  ApplicationSettingsResource: ApplicationSettingsResource.pipe(
    T.HttpPayload(),
  ),
}) {}
export class UpdateEndpointResponse extends S.Class<UpdateEndpointResponse>(
  "UpdateEndpointResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class UpdateEndpointsBatchResponse extends S.Class<UpdateEndpointsBatchResponse>(
  "UpdateEndpointsBatchResponse",
)({ MessageBody: MessageBody.pipe(T.HttpPayload()) }) {}
export class VerifyOTPMessageResponse extends S.Class<VerifyOTPMessageResponse>(
  "VerifyOTPMessageResponse",
)({ VerificationResponse: VerificationResponse.pipe(T.HttpPayload()) }) {}
export const MapOfChannelResponse = S.Record({
  key: S.String,
  value: ChannelResponse,
});
export class InAppMessageCampaign extends S.Class<InAppMessageCampaign>(
  "InAppMessageCampaign",
)({
  CampaignId: S.optional(S.String),
  DailyCap: S.optional(S.Number),
  InAppMessage: S.optional(InAppMessage),
  Priority: S.optional(S.Number),
  Schedule: S.optional(InAppCampaignSchedule),
  SessionCap: S.optional(S.Number),
  TotalCap: S.optional(S.Number),
  TreatmentId: S.optional(S.String),
}) {}
export const ListOfInAppMessageCampaign = S.Array(InAppMessageCampaign);
export class EndpointMessageResult extends S.Class<EndpointMessageResult>(
  "EndpointMessageResult",
)({
  Address: S.optional(S.String),
  DeliveryStatus: S.String,
  MessageId: S.optional(S.String),
  StatusCode: S.Number,
  StatusMessage: S.optional(S.String),
  UpdatedToken: S.optional(S.String),
}) {}
export const MapOfEndpointMessageResult = S.Record({
  key: S.String,
  value: EndpointMessageResult,
});
export const MapOfMapOfEndpointMessageResult = S.Record({
  key: S.String,
  value: MapOfEndpointMessageResult,
});
export class ChannelsResponse extends S.Class<ChannelsResponse>(
  "ChannelsResponse",
)({ Channels: MapOfChannelResponse }) {}
export class InAppMessagesResponse extends S.Class<InAppMessagesResponse>(
  "InAppMessagesResponse",
)({ InAppMessageCampaigns: S.optional(ListOfInAppMessageCampaign) }) {}
export class Session extends S.Class<Session>("Session")({
  Duration: S.optional(S.Number),
  Id: S.String,
  StartTimestamp: S.String,
  StopTimestamp: S.optional(S.String),
}) {}
export class SendUsersMessageResponse extends S.Class<SendUsersMessageResponse>(
  "SendUsersMessageResponse",
)({
  ApplicationId: S.String,
  RequestId: S.optional(S.String),
  Result: S.optional(MapOfMapOfEndpointMessageResult),
}) {}
export class MessageResult extends S.Class<MessageResult>("MessageResult")({
  DeliveryStatus: S.String,
  MessageId: S.optional(S.String),
  StatusCode: S.Number,
  StatusMessage: S.optional(S.String),
  UpdatedToken: S.optional(S.String),
}) {}
export class CreateCampaignRequest extends S.Class<CreateCampaignRequest>(
  "CreateCampaignRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    WriteCampaignRequest: WriteCampaignRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/campaigns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInAppTemplateRequest extends S.Class<CreateInAppTemplateRequest>(
  "CreateInAppTemplateRequest",
)(
  {
    InAppTemplateRequest: InAppTemplateRequest.pipe(T.HttpPayload()),
    TemplateName: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/inapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSegmentResponse extends S.Class<DeleteSegmentResponse>(
  "DeleteSegmentResponse",
)({ SegmentResponse: SegmentResponse.pipe(T.HttpPayload()) }) {}
export class GetChannelsResponse extends S.Class<GetChannelsResponse>(
  "GetChannelsResponse",
)({ ChannelsResponse: ChannelsResponse.pipe(T.HttpPayload()) }) {}
export class GetInAppMessagesResponse extends S.Class<GetInAppMessagesResponse>(
  "GetInAppMessagesResponse",
)({ InAppMessagesResponse: InAppMessagesResponse.pipe(T.HttpPayload()) }) {}
export class Event extends S.Class<Event>("Event")({
  AppPackageName: S.optional(S.String),
  AppTitle: S.optional(S.String),
  AppVersionCode: S.optional(S.String),
  Attributes: S.optional(MapOf__string),
  ClientSdkVersion: S.optional(S.String),
  EventType: S.String,
  Metrics: S.optional(MapOf__double),
  SdkName: S.optional(S.String),
  Session: S.optional(Session),
  Timestamp: S.String,
}) {}
export class SendUsersMessagesResponse extends S.Class<SendUsersMessagesResponse>(
  "SendUsersMessagesResponse",
)({
  SendUsersMessageResponse: SendUsersMessageResponse.pipe(T.HttpPayload()),
}) {}
export const MapOfMessageResult = S.Record({
  key: S.String,
  value: MessageResult,
});
export const MapOfEvent = S.Record({ key: S.String, value: Event });
export class ApplicationDateRangeKpiResponse extends S.Class<ApplicationDateRangeKpiResponse>(
  "ApplicationDateRangeKpiResponse",
)({
  ApplicationId: S.String,
  EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  KpiName: S.String,
  KpiResult: BaseKpiResult,
  NextToken: S.optional(S.String),
  StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class MessageRequest extends S.Class<MessageRequest>("MessageRequest")({
  Addresses: S.optional(MapOfAddressConfiguration),
  Context: S.optional(MapOf__string),
  Endpoints: S.optional(MapOfEndpointSendConfiguration),
  MessageConfiguration: DirectMessageConfiguration,
  TemplateConfiguration: S.optional(TemplateConfiguration),
  TraceId: S.optional(S.String),
}) {}
export class MessageResponse extends S.Class<MessageResponse>(
  "MessageResponse",
)({
  ApplicationId: S.String,
  EndpointResult: S.optional(MapOfEndpointMessageResult),
  RequestId: S.optional(S.String),
  Result: S.optional(MapOfMessageResult),
}) {}
export class EventsBatch extends S.Class<EventsBatch>("EventsBatch")({
  Endpoint: PublicEndpoint,
  Events: MapOfEvent,
}) {}
export class CreateCampaignResponse extends S.Class<CreateCampaignResponse>(
  "CreateCampaignResponse",
)({ CampaignResponse: CampaignResponse.pipe(T.HttpPayload()) }) {}
export class CreateSegmentRequest extends S.Class<CreateSegmentRequest>(
  "CreateSegmentRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    WriteSegmentRequest: WriteSegmentRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/segments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationDateRangeKpiResponse extends S.Class<GetApplicationDateRangeKpiResponse>(
  "GetApplicationDateRangeKpiResponse",
)({
  ApplicationDateRangeKpiResponse: ApplicationDateRangeKpiResponse.pipe(
    T.HttpPayload(),
  ),
}) {}
export class SendMessagesRequest extends S.Class<SendMessagesRequest>(
  "SendMessagesRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    MessageRequest: MessageRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/messages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendOTPMessageResponse extends S.Class<SendOTPMessageResponse>(
  "SendOTPMessageResponse",
)({ MessageResponse: MessageResponse.pipe(T.HttpPayload()) }) {}
export const MapOfEventsBatch = S.Record({ key: S.String, value: EventsBatch });
export class TemplateCreateMessageBody extends S.Class<TemplateCreateMessageBody>(
  "TemplateCreateMessageBody",
)({
  Arn: S.optional(S.String),
  Message: S.optional(S.String),
  RequestID: S.optional(S.String),
}) {}
export class EventsRequest extends S.Class<EventsRequest>("EventsRequest")({
  BatchItem: MapOfEventsBatch,
}) {}
export class CreateInAppTemplateResponse extends S.Class<CreateInAppTemplateResponse>(
  "CreateInAppTemplateResponse",
)({
  TemplateCreateMessageBody: TemplateCreateMessageBody.pipe(T.HttpPayload()),
}) {}
export class CreateSegmentResponse extends S.Class<CreateSegmentResponse>(
  "CreateSegmentResponse",
)({ SegmentResponse: SegmentResponse.pipe(T.HttpPayload()) }) {}
export class PutEventsRequest extends S.Class<PutEventsRequest>(
  "PutEventsRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    EventsRequest: EventsRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendMessagesResponse extends S.Class<SendMessagesResponse>(
  "SendMessagesResponse",
)({ MessageResponse: MessageResponse.pipe(T.HttpPayload()) }) {}
export class CreateJourneyRequest extends S.Class<CreateJourneyRequest>(
  "CreateJourneyRequest",
)(
  {
    ApplicationId: S.String.pipe(T.HttpLabel()),
    WriteJourneyRequest: WriteJourneyRequest.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/journeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateJourneyResponse extends S.Class<CreateJourneyResponse>(
  "CreateJourneyResponse",
)({ JourneyResponse: JourneyResponse.pipe(T.HttpPayload()) }) {}
export class EndpointItemResponse extends S.Class<EndpointItemResponse>(
  "EndpointItemResponse",
)({ Message: S.optional(S.String), StatusCode: S.optional(S.Number) }) {}
export class EventItemResponse extends S.Class<EventItemResponse>(
  "EventItemResponse",
)({ Message: S.optional(S.String), StatusCode: S.optional(S.Number) }) {}
export const MapOfEventItemResponse = S.Record({
  key: S.String,
  value: EventItemResponse,
});
export class ItemResponse extends S.Class<ItemResponse>("ItemResponse")({
  EndpointItemResponse: S.optional(EndpointItemResponse),
  EventsItemResponse: S.optional(MapOfEventItemResponse),
}) {}
export const MapOfItemResponse = S.Record({
  key: S.String,
  value: ItemResponse,
});
export class EventsResponse extends S.Class<EventsResponse>("EventsResponse")({
  Results: S.optional(MapOfItemResponse),
}) {}
export class PutEventsResponse extends S.Class<PutEventsResponse>(
  "PutEventsResponse",
)({ EventsResponse: EventsResponse.pipe(T.HttpPayload()) }) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class PayloadTooLargeException extends S.TaggedError<PayloadTooLargeException>()(
  "PayloadTooLargeException",
  {},
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes one or more tags (keys and values) from an application, campaign, message template, or segment.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Retrieves information about the status and settings of the APNs VoIP channel for an application.
 */
export const getApnsVoipChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApnsVoipChannelRequest,
  output: GetApnsVoipChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the APNs VoIP sandbox channel for an application.
 */
export const getApnsVoipSandboxChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApnsVoipSandboxChannelRequest,
    output: GetApnsVoipSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about an application.
 */
export const getApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppRequest,
  output: GetAppResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the Baidu channel for an application.
 */
export const getBaiduChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBaiduChannelRequest,
  output: GetBaiduChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status, configuration, and other settings for a campaign.
 */
export const getCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignRequest,
  output: GetCampaignResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status, configuration, and other settings for a specific version of a campaign.
 */
export const getCampaignVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignVersionRequest,
  output: GetCampaignVersionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status, configuration, and other settings for all versions of a campaign.
 */
export const getCampaignVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignVersionsRequest,
  output: GetCampaignVersionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the email channel for an application.
 */
export const getEmailChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailChannelRequest,
  output: GetEmailChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the settings and attributes of a specific endpoint for an application.
 */
export const getEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEndpointRequest,
  output: GetEndpointResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the event stream settings for an application.
 */
export const getEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventStreamRequest,
  output: GetEventStreamResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the GCM channel for an application.
 */
export const getGcmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGcmChannelRequest,
  output: GetGcmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status, configuration, and other settings for a journey.
 */
export const getJourney = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJourneyRequest,
  output: GetJourneyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about an Amazon Pinpoint configuration for a recommender model.
 */
export const getRecommenderConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRecommenderConfigurationRequest,
    output: GetRecommenderConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the configuration, dimension, and other settings for a specific segment that's associated with an application.
 */
export const getSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentRequest,
  output: GetSegmentResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the export jobs for a segment.
 */
export const getSegmentExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSegmentExportJobsRequest,
    output: GetSegmentExportJobsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the status and settings of the import jobs for a segment.
 */
export const getSegmentImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSegmentImportJobsRequest,
    output: GetSegmentImportJobsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the configuration, dimension, and other settings for a specific version of a segment that's associated with an application.
 */
export const getSegmentVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentVersionRequest,
  output: GetSegmentVersionResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the configuration, dimension, and other settings for all the versions of a specific segment that's associated with an application.
 */
export const getSegmentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentVersionsRequest,
  output: GetSegmentVersionsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the SMS channel for an application.
 */
export const getSmsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSmsChannelRequest,
  output: GetSmsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about all the endpoints that are associated with a specific user ID.
 */
export const getUserEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserEndpointsRequest,
  output: GetUserEndpointsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the voice channel for an application.
 */
export const getVoiceChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVoiceChannelRequest,
  output: GetVoiceChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves all the tags (keys and values) that are associated with an application, campaign, message template, or segment.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Adds one or more tags (keys and values) to an application, campaign, message template, or segment.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Updates the configuration and other settings for a campaign.
 */
export const updateCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignRequest,
  output: UpdateCampaignResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing message template for messages that are sent through the email channel.
 */
export const updateEmailTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEmailTemplateRequest,
  output: UpdateEmailTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing message template for messages sent through the in-app message channel.
 */
export const updateInAppTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInAppTemplateRequest,
  output: UpdateInAppTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing message template for messages that are sent through a push notification channel.
 */
export const updatePushTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePushTemplateRequest,
  output: UpdatePushTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
 */
export const updateSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSegmentRequest,
  output: UpdateSegmentResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing message template for messages that are sent through the SMS channel.
 */
export const updateSmsTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSmsTemplateRequest,
  output: UpdateSmsTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an existing message template for messages that are sent through the voice channel.
 */
export const updateVoiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVoiceTemplateRequest,
  output: UpdateVoiceTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an export job for an application.
 */
export const createExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportJobRequest,
  output: CreateExportJobResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an import job for an application.
 */
export const createImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImportJobRequest,
  output: CreateImportJobResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an Amazon Pinpoint configuration for a recommender model.
 */
export const createRecommenderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRecommenderConfigurationRequest,
    output: CreateRecommenderConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a message template for messages that are sent through the voice channel.
 */
export const createVoiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVoiceTemplateRequest,
  output: CreateVoiceTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the ADM channel for an application and deletes any existing settings for the channel.
 */
export const deleteAdmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAdmChannelRequest,
  output: DeleteAdmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the APNs channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApnsChannelRequest,
  output: DeleteApnsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the APNs sandbox channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsSandboxChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApnsSandboxChannelRequest,
    output: DeleteApnsSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Disables the APNs VoIP channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsVoipChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApnsVoipChannelRequest,
    output: DeleteApnsVoipChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Disables the APNs VoIP sandbox channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsVoipSandboxChannel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteApnsVoipSandboxChannelRequest,
    output: DeleteApnsVoipSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes an application.
 */
export const deleteApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppRequest,
  output: DeleteAppResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the Baidu channel for an application and deletes any existing settings for the channel.
 */
export const deleteBaiduChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBaiduChannelRequest,
  output: DeleteBaiduChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the email channel for an application and deletes any existing settings for the channel.
 */
export const deleteEmailChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailChannelRequest,
  output: DeleteEmailChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a message template for messages that were sent through the email channel.
 */
export const deleteEmailTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailTemplateRequest,
  output: DeleteEmailTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an endpoint from an application.
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointRequest,
  output: DeleteEndpointResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the event stream for an application.
 */
export const deleteEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventStreamRequest,
  output: DeleteEventStreamResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the GCM channel for an application and deletes any existing settings for the channel.
 */
export const deleteGcmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGcmChannelRequest,
  output: DeleteGcmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a message template for messages sent using the in-app message channel.
 */
export const deleteInAppTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInAppTemplateRequest,
  output: DeleteInAppTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a journey from an application.
 */
export const deleteJourney = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJourneyRequest,
  output: DeleteJourneyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a message template for messages that were sent through a push notification channel.
 */
export const deletePushTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePushTemplateRequest,
  output: DeletePushTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an Amazon Pinpoint configuration for a recommender model.
 */
export const deleteRecommenderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRecommenderConfigurationRequest,
    output: DeleteRecommenderConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Disables the SMS channel for an application and deletes any existing settings for the channel.
 */
export const deleteSmsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSmsChannelRequest,
  output: DeleteSmsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a message template for messages that were sent through the SMS channel.
 */
export const deleteSmsTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSmsTemplateRequest,
  output: DeleteSmsTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes all the endpoints that are associated with a specific user ID.
 */
export const deleteUserEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserEndpointsRequest,
  output: DeleteUserEndpointsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Disables the voice channel for an application and deletes any existing settings for the channel.
 */
export const deleteVoiceChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVoiceChannelRequest,
  output: DeleteVoiceChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a message template for messages that were sent through the voice channel.
 */
export const deleteVoiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVoiceTemplateRequest,
  output: DeleteVoiceTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the ADM channel for an application.
 */
export const getAdmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdmChannelRequest,
  output: GetAdmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the APNs channel for an application.
 */
export const getApnsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApnsChannelRequest,
  output: GetApnsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of the APNs sandbox channel for an application.
 */
export const getApnsSandboxChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApnsSandboxChannelRequest,
    output: GetApnsSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the settings for an application.
 */
export const getApplicationSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationSettingsRequest,
    output: GetApplicationSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about all the applications that are associated with your Amazon Pinpoint account.
 */
export const getApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppsRequest,
  output: GetAppsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves (queries) pre-aggregated data for a standard metric that applies to a campaign.
 */
export const getCampaignDateRangeKpi = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCampaignDateRangeKpiRequest,
    output: GetCampaignDateRangeKpiResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the status, configuration, and other settings for all the campaigns that are associated with an application.
 */
export const getCampaigns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCampaignsRequest,
  output: GetCampaignsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the content and settings of a message template for messages that are sent through the email channel.
 */
export const getEmailTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailTemplateRequest,
  output: GetEmailTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of all the export jobs for an application.
 */
export const getExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportJobsRequest,
  output: GetExportJobsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of all the import jobs for an application.
 */
export const getImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportJobsRequest,
  output: GetImportJobsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the content and settings of a message template for messages sent through the in-app channel.
 */
export const getInAppTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInAppTemplateRequest,
  output: GetInAppTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves (queries) pre-aggregated data for a standard engagement metric that applies to a journey.
 */
export const getJourneyDateRangeKpi = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetJourneyDateRangeKpiRequest,
    output: GetJourneyDateRangeKpiResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey activity.
 */
export const getJourneyExecutionActivityMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetJourneyExecutionActivityMetricsRequest,
    output: GetJourneyExecutionActivityMetricsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey.
 */
export const getJourneyExecutionMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetJourneyExecutionMetricsRequest,
    output: GetJourneyExecutionMetricsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves (queries) pre-aggregated data for a standard run execution metric that applies to a journey activity.
 */
export const getJourneyRunExecutionActivityMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetJourneyRunExecutionActivityMetricsRequest,
    output: GetJourneyRunExecutionActivityMetricsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves (queries) pre-aggregated data for a standard run execution metric that applies to a journey.
 */
export const getJourneyRunExecutionMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetJourneyRunExecutionMetricsRequest,
    output: GetJourneyRunExecutionMetricsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the content and settings of a message template for messages that are sent through a push notification channel.
 */
export const getPushTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPushTemplateRequest,
  output: GetPushTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about all the recommender model configurations that are associated with your Amazon Pinpoint account.
 */
export const getRecommenderConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRecommenderConfigurationsRequest,
    output: GetRecommenderConfigurationsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves information about the configuration, dimension, and other settings for all the segments that are associated with an application.
 */
export const getSegments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentsRequest,
  output: GetSegmentsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the content and settings of a message template for messages that are sent through the SMS channel.
 */
export const getSmsTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSmsTemplateRequest,
  output: GetSmsTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the content and settings of a message template for messages that are sent through the voice channel.
 */
export const getVoiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVoiceTemplateRequest,
  output: GetVoiceTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status, configuration, and other settings for all the journeys that are associated with an application.
 */
export const listJourneys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJourneysRequest,
  output: ListJourneysResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new event stream for an application or updates the settings of an existing event stream for an application.
 */
export const putEventStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventStreamRequest,
  output: PutEventStreamResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables the ADM channel for an application or updates the status and settings of the ADM channel for an application.
 */
export const updateAdmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAdmChannelRequest,
  output: UpdateAdmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables the APNs channel for an application or updates the status and settings of the APNs channel for an application.
 */
export const updateApnsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApnsChannelRequest,
  output: UpdateApnsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables the APNs sandbox channel for an application or updates the status and settings of the APNs sandbox channel for an application.
 */
export const updateApnsSandboxChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateApnsSandboxChannelRequest,
    output: UpdateApnsSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Enables the APNs VoIP channel for an application or updates the status and settings of the APNs VoIP channel for an application.
 */
export const updateApnsVoipChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateApnsVoipChannelRequest,
    output: UpdateApnsVoipChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Enables the APNs VoIP sandbox channel for an application or updates the status and settings of the APNs VoIP sandbox channel for an application.
 */
export const updateApnsVoipSandboxChannel =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateApnsVoipSandboxChannelRequest,
    output: UpdateApnsVoipSandboxChannelResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Enables the Baidu channel for an application or updates the status and settings of the Baidu channel for an application.
 */
export const updateBaiduChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBaiduChannelRequest,
  output: UpdateBaiduChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables the email channel for an application or updates the status and settings of the email channel for an application.
 */
export const updateEmailChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEmailChannelRequest,
  output: UpdateEmailChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Enables the GCM channel for an application or updates the status and settings of the GCM channel for an application.
 */
export const updateGcmChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGcmChannelRequest,
  output: UpdateGcmChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the configuration and other settings for a journey.
 */
export const updateJourney = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJourneyRequest,
  output: UpdateJourneyResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Cancels (stops) an active journey.
 */
export const updateJourneyState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJourneyStateRequest,
  output: UpdateJourneyStateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an Amazon Pinpoint configuration for a recommender model.
 */
export const updateRecommenderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRecommenderConfigurationRequest,
    output: UpdateRecommenderConfigurationResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }));
/**
 * Enables the SMS channel for an application or updates the status and settings of the SMS channel for an application.
 */
export const updateSmsChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSmsChannelRequest,
  output: UpdateSmsChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Changes the status of a specific version of a message template to *active*.
 */
export const updateTemplateActiveVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTemplateActiveVersionRequest,
    output: UpdateTemplateActiveVersionResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Enables the voice channel for an application or updates the status and settings of the voice channel for an application.
 */
export const updateVoiceChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVoiceChannelRequest,
  output: UpdateVoiceChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an application.
 */
export const createApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppRequest,
  output: CreateAppResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a message template for messages that are sent through the email channel.
 */
export const createEmailTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailTemplateRequest,
  output: CreateEmailTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a message template for messages that are sent through a push notification channel.
 */
export const createPushTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePushTemplateRequest,
  output: CreatePushTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a message template for messages that are sent through the SMS channel.
 */
export const createSmsTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSmsTemplateRequest,
  output: CreateSmsTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a campaign from an application.
 */
export const deleteCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about all the activities for a campaign.
 */
export const getCampaignActivities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCampaignActivitiesRequest,
    output: GetCampaignActivitiesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about the status and settings of a specific export job for an application.
 */
export const getExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportJobRequest,
  output: GetExportJobResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the status and settings of a specific import job for an application.
 */
export const getImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportJobRequest,
  output: GetImportJobResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides information about the runs of a journey.
 */
export const getJourneyRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJourneyRunsRequest,
  output: GetJourneyRunsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about all the message templates that are associated with your Amazon Pinpoint account.
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTemplatesRequest,
  output: ListTemplatesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about all the versions of a specific message template.
 */
export const listTemplateVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTemplateVersionsRequest,
    output: ListTemplateVersionsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves information about a phone number.
 */
export const phoneNumberValidate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PhoneNumberValidateRequest,
  output: PhoneNumberValidateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Removes one or more custom attributes, of the same attribute type, from the application. Existing endpoints still have the attributes but Amazon Pinpoint will stop capturing new or changed values for these attributes.
 */
export const removeAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAttributesRequest,
  output: RemoveAttributesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the settings for an application.
 */
export const updateApplicationSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateApplicationSettingsRequest,
    output: UpdateApplicationSettingsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates a new endpoint for an application or updates the settings and attributes of an existing endpoint for an application. You can also use this operation to define custom attributes for an endpoint. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
 */
export const updateEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointRequest,
  output: UpdateEndpointResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new batch of endpoints for an application or updates the settings and attributes of a batch of existing endpoints for an application. You can also use this operation to define custom attributes for a batch of endpoints. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
 */
export const updateEndpointsBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEndpointsBatchRequest,
    output: UpdateEndpointsBatchResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Verify an OTP
 */
export const verifyOTPMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyOTPMessageRequest,
  output: VerifyOTPMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a segment from an application.
 */
export const deleteSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSegmentRequest,
  output: DeleteSegmentResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves information about the history and status of each channel for an application.
 */
export const getChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelsRequest,
  output: GetChannelsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the in-app messages targeted for the provided endpoint ID.
 */
export const getInAppMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInAppMessagesRequest,
  output: GetInAppMessagesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates and sends a message to a list of users.
 */
export const sendUsersMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendUsersMessagesRequest,
  output: SendUsersMessagesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new campaign for an application or updates the settings of an existing campaign for an application.
 */
export const createCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCampaignRequest,
  output: CreateCampaignResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves (queries) pre-aggregated data for a standard metric that applies to an application.
 */
export const getApplicationDateRangeKpi = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationDateRangeKpiRequest,
    output: GetApplicationDateRangeKpiResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      MethodNotAllowedException,
      NotFoundException,
      PayloadTooLargeException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Send an OTP message
 */
export const sendOTPMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendOTPMessageRequest,
  output: SendOTPMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new message template for messages using the in-app message channel.
 */
export const createInAppTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInAppTemplateRequest,
  output: CreateInAppTemplateResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
 */
export const createSegment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentRequest,
  output: CreateSegmentResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates and sends a direct message.
 */
export const sendMessages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMessagesRequest,
  output: SendMessagesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a journey for an application.
 */
export const createJourney = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJourneyRequest,
  output: CreateJourneyResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new event to record for endpoints, or creates or updates endpoint data that existing events are associated with.
 */
export const putEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventsRequest,
  output: PutEventsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    PayloadTooLargeException,
    TooManyRequestsException,
  ],
}));
