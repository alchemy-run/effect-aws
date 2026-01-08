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
  sdkId: "Pinpoint",
  serviceShapeName: "Pinpoint",
});
const auth = T.AwsAuthSigv4({ name: "mobiletargeting" });
const ver = T.ServiceVersion("2016-12-01");
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
              `https://pinpoint-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://pinpoint-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://pinpoint.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        if (Region === "us-east-1") {
          return e("https://pinpoint.us-east-1.amazonaws.com");
        }
        if (Region === "us-west-2") {
          return e("https://pinpoint.us-west-2.amazonaws.com");
        }
        if (Region === "us-gov-west-1") {
          return e("https://pinpoint.us-gov-west-1.amazonaws.com");
        }
        if ("aws" === _.getAttr(PartitionResult, "name")) {
          return e(`https://pinpoint.${Region}.amazonaws.com`);
        }
        if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
          return e(`https://pinpoint.${Region}.amazonaws.com`);
        }
        return e(
          `https://pinpoint.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __timestampIso8601 = Date;
export type __blob = Uint8Array;

//# Schemas
export type ListOf__string = string[];
export const ListOf__string = S.Array(S.String);
export interface DeleteAdmChannelRequest {
  ApplicationId: string;
}
export const DeleteAdmChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/apps/{ApplicationId}/channels/adm",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAdmChannelRequest",
}) as any as S.Schema<DeleteAdmChannelRequest>;
export interface DeleteApnsChannelRequest {
  ApplicationId: string;
}
export const DeleteApnsChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/apps/{ApplicationId}/channels/apns",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApnsChannelRequest",
}) as any as S.Schema<DeleteApnsChannelRequest>;
export interface DeleteApnsSandboxChannelRequest {
  ApplicationId: string;
}
export const DeleteApnsSandboxChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApnsSandboxChannelRequest",
}) as any as S.Schema<DeleteApnsSandboxChannelRequest>;
export interface DeleteApnsVoipChannelRequest {
  ApplicationId: string;
}
export const DeleteApnsVoipChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApnsVoipChannelRequest",
}) as any as S.Schema<DeleteApnsVoipChannelRequest>;
export interface DeleteApnsVoipSandboxChannelRequest {
  ApplicationId: string;
}
export const DeleteApnsVoipSandboxChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApnsVoipSandboxChannelRequest",
}) as any as S.Schema<DeleteApnsVoipSandboxChannelRequest>;
export interface DeleteAppRequest {
  ApplicationId: string;
}
export const DeleteAppRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppRequest",
}) as any as S.Schema<DeleteAppRequest>;
export interface DeleteBaiduChannelRequest {
  ApplicationId: string;
}
export const DeleteBaiduChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteBaiduChannelRequest",
}) as any as S.Schema<DeleteBaiduChannelRequest>;
export interface DeleteCampaignRequest {
  ApplicationId: string;
  CampaignId: string;
}
export const DeleteCampaignRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteCampaignRequest",
}) as any as S.Schema<DeleteCampaignRequest>;
export interface DeleteEmailChannelRequest {
  ApplicationId: string;
}
export const DeleteEmailChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteEmailChannelRequest",
}) as any as S.Schema<DeleteEmailChannelRequest>;
export interface DeleteEmailTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const DeleteEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEmailTemplateRequest",
}) as any as S.Schema<DeleteEmailTemplateRequest>;
export interface DeleteEndpointRequest {
  ApplicationId: string;
  EndpointId: string;
}
export const DeleteEndpointRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteEndpointRequest",
}) as any as S.Schema<DeleteEndpointRequest>;
export interface DeleteEventStreamRequest {
  ApplicationId: string;
}
export const DeleteEventStreamRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/apps/{ApplicationId}/eventstream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventStreamRequest",
}) as any as S.Schema<DeleteEventStreamRequest>;
export interface DeleteGcmChannelRequest {
  ApplicationId: string;
}
export const DeleteGcmChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/apps/{ApplicationId}/channels/gcm",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGcmChannelRequest",
}) as any as S.Schema<DeleteGcmChannelRequest>;
export interface DeleteInAppTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const DeleteInAppTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/inapp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInAppTemplateRequest",
}) as any as S.Schema<DeleteInAppTemplateRequest>;
export interface DeleteJourneyRequest {
  ApplicationId: string;
  JourneyId: string;
}
export const DeleteJourneyRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteJourneyRequest",
}) as any as S.Schema<DeleteJourneyRequest>;
export interface DeletePushTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const DeletePushTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/push" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePushTemplateRequest",
}) as any as S.Schema<DeletePushTemplateRequest>;
export interface DeleteRecommenderConfigurationRequest {
  RecommenderId: string;
}
export const DeleteRecommenderConfigurationRequest = S.suspend(() =>
  S.Struct({ RecommenderId: S.String.pipe(T.HttpLabel("RecommenderId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/recommenders/{RecommenderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecommenderConfigurationRequest",
}) as any as S.Schema<DeleteRecommenderConfigurationRequest>;
export interface DeleteSegmentRequest {
  ApplicationId: string;
  SegmentId: string;
}
export const DeleteSegmentRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSegmentRequest",
}) as any as S.Schema<DeleteSegmentRequest>;
export interface DeleteSmsChannelRequest {
  ApplicationId: string;
}
export const DeleteSmsChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/apps/{ApplicationId}/channels/sms",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSmsChannelRequest",
}) as any as S.Schema<DeleteSmsChannelRequest>;
export interface DeleteSmsTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const DeleteSmsTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSmsTemplateRequest",
}) as any as S.Schema<DeleteSmsTemplateRequest>;
export interface DeleteUserEndpointsRequest {
  ApplicationId: string;
  UserId: string;
}
export const DeleteUserEndpointsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteUserEndpointsRequest",
}) as any as S.Schema<DeleteUserEndpointsRequest>;
export interface DeleteVoiceChannelRequest {
  ApplicationId: string;
}
export const DeleteVoiceChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "DeleteVoiceChannelRequest",
}) as any as S.Schema<DeleteVoiceChannelRequest>;
export interface DeleteVoiceTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const DeleteVoiceTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/templates/{TemplateName}/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVoiceTemplateRequest",
}) as any as S.Schema<DeleteVoiceTemplateRequest>;
export interface GetAdmChannelRequest {
  ApplicationId: string;
}
export const GetAdmChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/adm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAdmChannelRequest",
}) as any as S.Schema<GetAdmChannelRequest>;
export interface GetApnsChannelRequest {
  ApplicationId: string;
}
export const GetApnsChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/apns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApnsChannelRequest",
}) as any as S.Schema<GetApnsChannelRequest>;
export interface GetApnsSandboxChannelRequest {
  ApplicationId: string;
}
export const GetApnsSandboxChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetApnsSandboxChannelRequest",
}) as any as S.Schema<GetApnsSandboxChannelRequest>;
export interface GetApnsVoipChannelRequest {
  ApplicationId: string;
}
export const GetApnsVoipChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetApnsVoipChannelRequest",
}) as any as S.Schema<GetApnsVoipChannelRequest>;
export interface GetApnsVoipSandboxChannelRequest {
  ApplicationId: string;
}
export const GetApnsVoipSandboxChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
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
  ),
).annotations({
  identifier: "GetApnsVoipSandboxChannelRequest",
}) as any as S.Schema<GetApnsVoipSandboxChannelRequest>;
export interface GetAppRequest {
  ApplicationId: string;
}
export const GetAppRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppRequest",
}) as any as S.Schema<GetAppRequest>;
export interface GetApplicationDateRangeKpiRequest {
  ApplicationId: string;
  EndTime?: Date;
  KpiName: string;
  NextToken?: string;
  PageSize?: string;
  StartTime?: Date;
}
export const GetApplicationDateRangeKpiRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    KpiName: S.String.pipe(T.HttpLabel("KpiName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetApplicationDateRangeKpiRequest",
}) as any as S.Schema<GetApplicationDateRangeKpiRequest>;
export interface GetApplicationSettingsRequest {
  ApplicationId: string;
}
export const GetApplicationSettingsRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationSettingsRequest",
}) as any as S.Schema<GetApplicationSettingsRequest>;
export interface GetAppsRequest {
  PageSize?: string;
  Token?: string;
}
export const GetAppsRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppsRequest",
}) as any as S.Schema<GetAppsRequest>;
export interface GetBaiduChannelRequest {
  ApplicationId: string;
}
export const GetBaiduChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/baidu" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBaiduChannelRequest",
}) as any as S.Schema<GetBaiduChannelRequest>;
export interface GetCampaignRequest {
  ApplicationId: string;
  CampaignId: string;
}
export const GetCampaignRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCampaignRequest",
}) as any as S.Schema<GetCampaignRequest>;
export interface GetCampaignActivitiesRequest {
  ApplicationId: string;
  CampaignId: string;
  PageSize?: string;
  Token?: string;
}
export const GetCampaignActivitiesRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCampaignActivitiesRequest",
}) as any as S.Schema<GetCampaignActivitiesRequest>;
export interface GetCampaignDateRangeKpiRequest {
  ApplicationId: string;
  CampaignId: string;
  EndTime?: Date;
  KpiName: string;
  NextToken?: string;
  PageSize?: string;
  StartTime?: Date;
}
export const GetCampaignDateRangeKpiRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    KpiName: S.String.pipe(T.HttpLabel("KpiName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCampaignDateRangeKpiRequest",
}) as any as S.Schema<GetCampaignDateRangeKpiRequest>;
export interface GetCampaignsRequest {
  ApplicationId: string;
  PageSize?: string;
  Token?: string;
}
export const GetCampaignsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/campaigns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCampaignsRequest",
}) as any as S.Schema<GetCampaignsRequest>;
export interface GetCampaignVersionRequest {
  ApplicationId: string;
  CampaignId: string;
  Version: string;
}
export const GetCampaignVersionRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
    Version: S.String.pipe(T.HttpLabel("Version")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCampaignVersionRequest",
}) as any as S.Schema<GetCampaignVersionRequest>;
export interface GetCampaignVersionsRequest {
  ApplicationId: string;
  CampaignId: string;
  PageSize?: string;
  Token?: string;
}
export const GetCampaignVersionsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCampaignVersionsRequest",
}) as any as S.Schema<GetCampaignVersionsRequest>;
export interface GetChannelsRequest {
  ApplicationId: string;
}
export const GetChannelsRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelsRequest",
}) as any as S.Schema<GetChannelsRequest>;
export interface GetEmailChannelRequest {
  ApplicationId: string;
}
export const GetEmailChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEmailChannelRequest",
}) as any as S.Schema<GetEmailChannelRequest>;
export interface GetEmailTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const GetEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEmailTemplateRequest",
}) as any as S.Schema<GetEmailTemplateRequest>;
export interface GetEndpointRequest {
  ApplicationId: string;
  EndpointId: string;
}
export const GetEndpointRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetEndpointRequest",
}) as any as S.Schema<GetEndpointRequest>;
export interface GetEventStreamRequest {
  ApplicationId: string;
}
export const GetEventStreamRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/eventstream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventStreamRequest",
}) as any as S.Schema<GetEventStreamRequest>;
export interface GetExportJobRequest {
  ApplicationId: string;
  JobId: string;
}
export const GetExportJobRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetExportJobRequest",
}) as any as S.Schema<GetExportJobRequest>;
export interface GetExportJobsRequest {
  ApplicationId: string;
  PageSize?: string;
  Token?: string;
}
export const GetExportJobsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/jobs/export" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExportJobsRequest",
}) as any as S.Schema<GetExportJobsRequest>;
export interface GetGcmChannelRequest {
  ApplicationId: string;
}
export const GetGcmChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/gcm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGcmChannelRequest",
}) as any as S.Schema<GetGcmChannelRequest>;
export interface GetImportJobRequest {
  ApplicationId: string;
  JobId: string;
}
export const GetImportJobRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JobId: S.String.pipe(T.HttpLabel("JobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetImportJobRequest",
}) as any as S.Schema<GetImportJobRequest>;
export interface GetImportJobsRequest {
  ApplicationId: string;
  PageSize?: string;
  Token?: string;
}
export const GetImportJobsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/jobs/import" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportJobsRequest",
}) as any as S.Schema<GetImportJobsRequest>;
export interface GetInAppMessagesRequest {
  ApplicationId: string;
  EndpointId: string;
}
export const GetInAppMessagesRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetInAppMessagesRequest",
}) as any as S.Schema<GetInAppMessagesRequest>;
export interface GetInAppTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const GetInAppTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/inapp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInAppTemplateRequest",
}) as any as S.Schema<GetInAppTemplateRequest>;
export interface GetJourneyRequest {
  ApplicationId: string;
  JourneyId: string;
}
export const GetJourneyRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyRequest",
}) as any as S.Schema<GetJourneyRequest>;
export interface GetJourneyDateRangeKpiRequest {
  ApplicationId: string;
  EndTime?: Date;
  JourneyId: string;
  KpiName: string;
  NextToken?: string;
  PageSize?: string;
  StartTime?: Date;
}
export const GetJourneyDateRangeKpiRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("end-time"),
    ),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    KpiName: S.String.pipe(T.HttpLabel("KpiName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("start-time"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyDateRangeKpiRequest",
}) as any as S.Schema<GetJourneyDateRangeKpiRequest>;
export interface GetJourneyExecutionActivityMetricsRequest {
  ApplicationId: string;
  JourneyActivityId: string;
  JourneyId: string;
  NextToken?: string;
  PageSize?: string;
}
export const GetJourneyExecutionActivityMetricsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyActivityId: S.String.pipe(T.HttpLabel("JourneyActivityId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyExecutionActivityMetricsRequest",
}) as any as S.Schema<GetJourneyExecutionActivityMetricsRequest>;
export interface GetJourneyExecutionMetricsRequest {
  ApplicationId: string;
  JourneyId: string;
  NextToken?: string;
  PageSize?: string;
}
export const GetJourneyExecutionMetricsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyExecutionMetricsRequest",
}) as any as S.Schema<GetJourneyExecutionMetricsRequest>;
export interface GetJourneyRunExecutionActivityMetricsRequest {
  ApplicationId: string;
  JourneyActivityId: string;
  JourneyId: string;
  NextToken?: string;
  PageSize?: string;
  RunId: string;
}
export const GetJourneyRunExecutionActivityMetricsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyActivityId: S.String.pipe(T.HttpLabel("JourneyActivityId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyRunExecutionActivityMetricsRequest",
}) as any as S.Schema<GetJourneyRunExecutionActivityMetricsRequest>;
export interface GetJourneyRunExecutionMetricsRequest {
  ApplicationId: string;
  JourneyId: string;
  NextToken?: string;
  PageSize?: string;
  RunId: string;
}
export const GetJourneyRunExecutionMetricsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyRunExecutionMetricsRequest",
}) as any as S.Schema<GetJourneyRunExecutionMetricsRequest>;
export interface GetJourneyRunsRequest {
  ApplicationId: string;
  JourneyId: string;
  PageSize?: string;
  Token?: string;
}
export const GetJourneyRunsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJourneyRunsRequest",
}) as any as S.Schema<GetJourneyRunsRequest>;
export interface GetPushTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const GetPushTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/push" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPushTemplateRequest",
}) as any as S.Schema<GetPushTemplateRequest>;
export interface GetRecommenderConfigurationRequest {
  RecommenderId: string;
}
export const GetRecommenderConfigurationRequest = S.suspend(() =>
  S.Struct({ RecommenderId: S.String.pipe(T.HttpLabel("RecommenderId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/recommenders/{RecommenderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommenderConfigurationRequest",
}) as any as S.Schema<GetRecommenderConfigurationRequest>;
export interface GetRecommenderConfigurationsRequest {
  PageSize?: string;
  Token?: string;
}
export const GetRecommenderConfigurationsRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/recommenders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommenderConfigurationsRequest",
}) as any as S.Schema<GetRecommenderConfigurationsRequest>;
export interface GetSegmentRequest {
  ApplicationId: string;
  SegmentId: string;
}
export const GetSegmentRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSegmentRequest",
}) as any as S.Schema<GetSegmentRequest>;
export interface GetSegmentExportJobsRequest {
  ApplicationId: string;
  PageSize?: string;
  SegmentId: string;
  Token?: string;
}
export const GetSegmentExportJobsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSegmentExportJobsRequest",
}) as any as S.Schema<GetSegmentExportJobsRequest>;
export interface GetSegmentImportJobsRequest {
  ApplicationId: string;
  PageSize?: string;
  SegmentId: string;
  Token?: string;
}
export const GetSegmentImportJobsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSegmentImportJobsRequest",
}) as any as S.Schema<GetSegmentImportJobsRequest>;
export interface GetSegmentsRequest {
  ApplicationId: string;
  PageSize?: string;
  Token?: string;
}
export const GetSegmentsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/segments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentsRequest",
}) as any as S.Schema<GetSegmentsRequest>;
export interface GetSegmentVersionRequest {
  ApplicationId: string;
  SegmentId: string;
  Version: string;
}
export const GetSegmentVersionRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
    Version: S.String.pipe(T.HttpLabel("Version")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSegmentVersionRequest",
}) as any as S.Schema<GetSegmentVersionRequest>;
export interface GetSegmentVersionsRequest {
  ApplicationId: string;
  PageSize?: string;
  SegmentId: string;
  Token?: string;
}
export const GetSegmentVersionsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetSegmentVersionsRequest",
}) as any as S.Schema<GetSegmentVersionsRequest>;
export interface GetSmsChannelRequest {
  ApplicationId: string;
}
export const GetSmsChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSmsChannelRequest",
}) as any as S.Schema<GetSmsChannelRequest>;
export interface GetSmsTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const GetSmsTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSmsTemplateRequest",
}) as any as S.Schema<GetSmsTemplateRequest>;
export interface GetUserEndpointsRequest {
  ApplicationId: string;
  UserId: string;
}
export const GetUserEndpointsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/users/{UserId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserEndpointsRequest",
}) as any as S.Schema<GetUserEndpointsRequest>;
export interface GetVoiceChannelRequest {
  ApplicationId: string;
}
export const GetVoiceChannelRequest = S.suspend(() =>
  S.Struct({ ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/channels/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVoiceChannelRequest",
}) as any as S.Schema<GetVoiceChannelRequest>;
export interface GetVoiceTemplateRequest {
  TemplateName: string;
  Version?: string;
}
export const GetVoiceTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates/{TemplateName}/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVoiceTemplateRequest",
}) as any as S.Schema<GetVoiceTemplateRequest>;
export interface ListJourneysRequest {
  ApplicationId: string;
  PageSize?: string;
  Token?: string;
}
export const ListJourneysRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Token: S.optional(S.String).pipe(T.HttpQuery("token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/apps/{ApplicationId}/journeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJourneysRequest",
}) as any as S.Schema<ListJourneysRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{ResourceArn}" }),
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
export interface ListTemplatesRequest {
  NextToken?: string;
  PageSize?: string;
  Prefix?: string;
  TemplateType?: string;
}
export const ListTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    Prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    TemplateType: S.optional(S.String).pipe(T.HttpQuery("template-type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplatesRequest",
}) as any as S.Schema<ListTemplatesRequest>;
export interface ListTemplateVersionsRequest {
  NextToken?: string;
  PageSize?: string;
  TemplateName: string;
  TemplateType: string;
}
export const ListTemplateVersionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    PageSize: S.optional(S.String).pipe(T.HttpQuery("page-size")),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    TemplateType: S.String.pipe(T.HttpLabel("TemplateType")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTemplateVersionsRequest",
}) as any as S.Schema<ListTemplateVersionsRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(ListOf__string).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/tags/{ResourceArn}" }),
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
export type __EndpointTypesElement =
  | "PUSH"
  | "GCM"
  | "APNS"
  | "APNS_SANDBOX"
  | "APNS_VOIP"
  | "APNS_VOIP_SANDBOX"
  | "ADM"
  | "SMS"
  | "VOICE"
  | "EMAIL"
  | "BAIDU"
  | "CUSTOM"
  | "IN_APP";
export const __EndpointTypesElement = S.Literal(
  "PUSH",
  "GCM",
  "APNS",
  "APNS_SANDBOX",
  "APNS_VOIP",
  "APNS_VOIP_SANDBOX",
  "ADM",
  "SMS",
  "VOICE",
  "EMAIL",
  "BAIDU",
  "CUSTOM",
  "IN_APP",
);
export type ListOf__EndpointTypesElement = __EndpointTypesElement[];
export const ListOf__EndpointTypesElement = S.Array(__EndpointTypesElement);
export interface CustomDeliveryConfiguration {
  DeliveryUri?: string;
  EndpointTypes?: __EndpointTypesElement[];
}
export const CustomDeliveryConfiguration = S.suspend(() =>
  S.Struct({
    DeliveryUri: S.optional(S.String),
    EndpointTypes: S.optional(ListOf__EndpointTypesElement),
  }),
).annotations({
  identifier: "CustomDeliveryConfiguration",
}) as any as S.Schema<CustomDeliveryConfiguration>;
export type Action = "OPEN_APP" | "DEEP_LINK" | "URL";
export const Action = S.Literal("OPEN_APP", "DEEP_LINK", "URL");
export interface Message {
  Action?: Action;
  Body?: string;
  ImageIconUrl?: string;
  ImageSmallIconUrl?: string;
  ImageUrl?: string;
  JsonBody?: string;
  MediaUrl?: string;
  RawContent?: string;
  SilentPush?: boolean;
  TimeToLive?: number;
  Title?: string;
  Url?: string;
}
export const Message = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
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
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export interface CampaignCustomMessage {
  Data?: string;
}
export const CampaignCustomMessage = S.suspend(() =>
  S.Struct({ Data: S.optional(S.String) }),
).annotations({
  identifier: "CampaignCustomMessage",
}) as any as S.Schema<CampaignCustomMessage>;
export interface MessageHeader {
  Name?: string;
  Value?: string;
}
export const MessageHeader = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "MessageHeader",
}) as any as S.Schema<MessageHeader>;
export type ListOfMessageHeader = MessageHeader[];
export const ListOfMessageHeader = S.Array(MessageHeader);
export interface CampaignEmailMessage {
  Body?: string;
  FromAddress?: string;
  Headers?: MessageHeader[];
  HtmlBody?: string;
  Title?: string;
}
export const CampaignEmailMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    FromAddress: S.optional(S.String),
    Headers: S.optional(ListOfMessageHeader),
    HtmlBody: S.optional(S.String),
    Title: S.optional(S.String),
  }),
).annotations({
  identifier: "CampaignEmailMessage",
}) as any as S.Schema<CampaignEmailMessage>;
export type MessageType = "TRANSACTIONAL" | "PROMOTIONAL";
export const MessageType = S.Literal("TRANSACTIONAL", "PROMOTIONAL");
export interface CampaignSmsMessage {
  Body?: string;
  MessageType?: MessageType;
  OriginationNumber?: string;
  SenderId?: string;
  EntityId?: string;
  TemplateId?: string;
}
export const CampaignSmsMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    MessageType: S.optional(MessageType),
    OriginationNumber: S.optional(S.String),
    SenderId: S.optional(S.String),
    EntityId: S.optional(S.String),
    TemplateId: S.optional(S.String),
  }),
).annotations({
  identifier: "CampaignSmsMessage",
}) as any as S.Schema<CampaignSmsMessage>;
export type Alignment = "LEFT" | "CENTER" | "RIGHT";
export const Alignment = S.Literal("LEFT", "CENTER", "RIGHT");
export interface InAppMessageBodyConfig {
  Alignment?: Alignment;
  Body?: string;
  TextColor?: string;
}
export const InAppMessageBodyConfig = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(Alignment),
    Body: S.optional(S.String),
    TextColor: S.optional(S.String),
  }),
).annotations({
  identifier: "InAppMessageBodyConfig",
}) as any as S.Schema<InAppMessageBodyConfig>;
export interface InAppMessageHeaderConfig {
  Alignment?: Alignment;
  Header?: string;
  TextColor?: string;
}
export const InAppMessageHeaderConfig = S.suspend(() =>
  S.Struct({
    Alignment: S.optional(Alignment),
    Header: S.optional(S.String),
    TextColor: S.optional(S.String),
  }),
).annotations({
  identifier: "InAppMessageHeaderConfig",
}) as any as S.Schema<InAppMessageHeaderConfig>;
export type ButtonAction = "LINK" | "DEEP_LINK" | "CLOSE";
export const ButtonAction = S.Literal("LINK", "DEEP_LINK", "CLOSE");
export interface OverrideButtonConfiguration {
  ButtonAction?: ButtonAction;
  Link?: string;
}
export const OverrideButtonConfiguration = S.suspend(() =>
  S.Struct({
    ButtonAction: S.optional(ButtonAction),
    Link: S.optional(S.String),
  }),
).annotations({
  identifier: "OverrideButtonConfiguration",
}) as any as S.Schema<OverrideButtonConfiguration>;
export interface DefaultButtonConfiguration {
  BackgroundColor?: string;
  BorderRadius?: number;
  ButtonAction?: ButtonAction;
  Link?: string;
  Text?: string;
  TextColor?: string;
}
export const DefaultButtonConfiguration = S.suspend(() =>
  S.Struct({
    BackgroundColor: S.optional(S.String),
    BorderRadius: S.optional(S.Number),
    ButtonAction: S.optional(ButtonAction),
    Link: S.optional(S.String),
    Text: S.optional(S.String),
    TextColor: S.optional(S.String),
  }),
).annotations({
  identifier: "DefaultButtonConfiguration",
}) as any as S.Schema<DefaultButtonConfiguration>;
export interface InAppMessageButton {
  Android?: OverrideButtonConfiguration;
  DefaultConfig?: DefaultButtonConfiguration;
  IOS?: OverrideButtonConfiguration;
  Web?: OverrideButtonConfiguration;
}
export const InAppMessageButton = S.suspend(() =>
  S.Struct({
    Android: S.optional(OverrideButtonConfiguration),
    DefaultConfig: S.optional(DefaultButtonConfiguration),
    IOS: S.optional(OverrideButtonConfiguration),
    Web: S.optional(OverrideButtonConfiguration),
  }),
).annotations({
  identifier: "InAppMessageButton",
}) as any as S.Schema<InAppMessageButton>;
export interface InAppMessageContent {
  BackgroundColor?: string;
  BodyConfig?: InAppMessageBodyConfig;
  HeaderConfig?: InAppMessageHeaderConfig;
  ImageUrl?: string;
  PrimaryBtn?: InAppMessageButton;
  SecondaryBtn?: InAppMessageButton;
}
export const InAppMessageContent = S.suspend(() =>
  S.Struct({
    BackgroundColor: S.optional(S.String),
    BodyConfig: S.optional(InAppMessageBodyConfig),
    HeaderConfig: S.optional(InAppMessageHeaderConfig),
    ImageUrl: S.optional(S.String),
    PrimaryBtn: S.optional(InAppMessageButton),
    SecondaryBtn: S.optional(InAppMessageButton),
  }),
).annotations({
  identifier: "InAppMessageContent",
}) as any as S.Schema<InAppMessageContent>;
export type ListOfInAppMessageContent = InAppMessageContent[];
export const ListOfInAppMessageContent = S.Array(InAppMessageContent);
export type MapOf__string = { [key: string]: string };
export const MapOf__string = S.Record({ key: S.String, value: S.String });
export type Layout =
  | "BOTTOM_BANNER"
  | "TOP_BANNER"
  | "OVERLAYS"
  | "MOBILE_FEED"
  | "MIDDLE_BANNER"
  | "CAROUSEL";
export const Layout = S.Literal(
  "BOTTOM_BANNER",
  "TOP_BANNER",
  "OVERLAYS",
  "MOBILE_FEED",
  "MIDDLE_BANNER",
  "CAROUSEL",
);
export interface CampaignInAppMessage {
  Body?: string;
  Content?: InAppMessageContent[];
  CustomConfig?: { [key: string]: string };
  Layout?: Layout;
}
export const CampaignInAppMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    Content: S.optional(ListOfInAppMessageContent),
    CustomConfig: S.optional(MapOf__string),
    Layout: S.optional(Layout),
  }),
).annotations({
  identifier: "CampaignInAppMessage",
}) as any as S.Schema<CampaignInAppMessage>;
export interface MessageConfiguration {
  ADMMessage?: Message;
  APNSMessage?: Message;
  BaiduMessage?: Message;
  CustomMessage?: CampaignCustomMessage;
  DefaultMessage?: Message;
  EmailMessage?: CampaignEmailMessage;
  GCMMessage?: Message;
  SMSMessage?: CampaignSmsMessage;
  InAppMessage?: CampaignInAppMessage;
}
export const MessageConfiguration = S.suspend(() =>
  S.Struct({
    ADMMessage: S.optional(Message),
    APNSMessage: S.optional(Message),
    BaiduMessage: S.optional(Message),
    CustomMessage: S.optional(CampaignCustomMessage),
    DefaultMessage: S.optional(Message),
    EmailMessage: S.optional(CampaignEmailMessage),
    GCMMessage: S.optional(Message),
    SMSMessage: S.optional(CampaignSmsMessage),
    InAppMessage: S.optional(CampaignInAppMessage),
  }),
).annotations({
  identifier: "MessageConfiguration",
}) as any as S.Schema<MessageConfiguration>;
export type AttributeType =
  | "INCLUSIVE"
  | "EXCLUSIVE"
  | "CONTAINS"
  | "BEFORE"
  | "AFTER"
  | "ON"
  | "BETWEEN";
export const AttributeType = S.Literal(
  "INCLUSIVE",
  "EXCLUSIVE",
  "CONTAINS",
  "BEFORE",
  "AFTER",
  "ON",
  "BETWEEN",
);
export interface AttributeDimension {
  AttributeType?: AttributeType;
  Values?: string[];
}
export const AttributeDimension = S.suspend(() =>
  S.Struct({
    AttributeType: S.optional(AttributeType),
    Values: S.optional(ListOf__string),
  }),
).annotations({
  identifier: "AttributeDimension",
}) as any as S.Schema<AttributeDimension>;
export type MapOfAttributeDimension = { [key: string]: AttributeDimension };
export const MapOfAttributeDimension = S.Record({
  key: S.String,
  value: AttributeDimension,
});
export type DimensionType = "INCLUSIVE" | "EXCLUSIVE";
export const DimensionType = S.Literal("INCLUSIVE", "EXCLUSIVE");
export interface SetDimension {
  DimensionType?: DimensionType;
  Values?: string[];
}
export const SetDimension = S.suspend(() =>
  S.Struct({
    DimensionType: S.optional(DimensionType),
    Values: S.optional(ListOf__string),
  }),
).annotations({ identifier: "SetDimension" }) as any as S.Schema<SetDimension>;
export interface MetricDimension {
  ComparisonOperator?: string;
  Value?: number;
}
export const MetricDimension = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.optional(S.String),
    Value: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetricDimension",
}) as any as S.Schema<MetricDimension>;
export type MapOfMetricDimension = { [key: string]: MetricDimension };
export const MapOfMetricDimension = S.Record({
  key: S.String,
  value: MetricDimension,
});
export interface EventDimensions {
  Attributes?: { [key: string]: AttributeDimension };
  EventType?: SetDimension;
  Metrics?: { [key: string]: MetricDimension };
}
export const EventDimensions = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MapOfAttributeDimension),
    EventType: S.optional(SetDimension),
    Metrics: S.optional(MapOfMetricDimension),
  }),
).annotations({
  identifier: "EventDimensions",
}) as any as S.Schema<EventDimensions>;
export type FilterType = "SYSTEM" | "ENDPOINT";
export const FilterType = S.Literal("SYSTEM", "ENDPOINT");
export interface CampaignEventFilter {
  Dimensions?: EventDimensions;
  FilterType?: FilterType;
}
export const CampaignEventFilter = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(EventDimensions),
    FilterType: S.optional(FilterType),
  }),
).annotations({
  identifier: "CampaignEventFilter",
}) as any as S.Schema<CampaignEventFilter>;
export type Frequency =
  | "ONCE"
  | "HOURLY"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "EVENT"
  | "IN_APP_EVENT";
export const Frequency = S.Literal(
  "ONCE",
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "EVENT",
  "IN_APP_EVENT",
);
export interface QuietTime {
  End?: string;
  Start?: string;
}
export const QuietTime = S.suspend(() =>
  S.Struct({ End: S.optional(S.String), Start: S.optional(S.String) }),
).annotations({ identifier: "QuietTime" }) as any as S.Schema<QuietTime>;
export interface Schedule {
  EndTime?: string;
  EventFilter?: CampaignEventFilter;
  Frequency?: Frequency;
  IsLocalTime?: boolean;
  QuietTime?: QuietTime;
  StartTime?: string;
  Timezone?: string;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    EndTime: S.optional(S.String),
    EventFilter: S.optional(CampaignEventFilter),
    Frequency: S.optional(Frequency),
    IsLocalTime: S.optional(S.Boolean),
    QuietTime: S.optional(QuietTime),
    StartTime: S.optional(S.String),
    Timezone: S.optional(S.String),
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export interface Template {
  Name?: string;
  Version?: string;
}
export const Template = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Version: S.optional(S.String) }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface TemplateConfiguration {
  EmailTemplate?: Template;
  PushTemplate?: Template;
  SMSTemplate?: Template;
  VoiceTemplate?: Template;
  InAppTemplate?: Template;
}
export const TemplateConfiguration = S.suspend(() =>
  S.Struct({
    EmailTemplate: S.optional(Template),
    PushTemplate: S.optional(Template),
    SMSTemplate: S.optional(Template),
    VoiceTemplate: S.optional(Template),
    InAppTemplate: S.optional(Template),
  }),
).annotations({
  identifier: "TemplateConfiguration",
}) as any as S.Schema<TemplateConfiguration>;
export interface WriteTreatmentResource {
  CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
  MessageConfiguration?: MessageConfiguration;
  Schedule?: Schedule;
  SizePercent?: number;
  TemplateConfiguration?: TemplateConfiguration;
  TreatmentDescription?: string;
  TreatmentName?: string;
}
export const WriteTreatmentResource = S.suspend(() =>
  S.Struct({
    CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
    MessageConfiguration: S.optional(MessageConfiguration),
    Schedule: S.optional(Schedule),
    SizePercent: S.optional(S.Number),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TreatmentDescription: S.optional(S.String),
    TreatmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "WriteTreatmentResource",
}) as any as S.Schema<WriteTreatmentResource>;
export type ListOfWriteTreatmentResource = WriteTreatmentResource[];
export const ListOfWriteTreatmentResource = S.Array(WriteTreatmentResource);
export type Mode = "DELIVERY" | "FILTER";
export const Mode = S.Literal("DELIVERY", "FILTER");
export interface CampaignHook {
  LambdaFunctionName?: string;
  Mode?: Mode;
  WebUrl?: string;
}
export const CampaignHook = S.suspend(() =>
  S.Struct({
    LambdaFunctionName: S.optional(S.String),
    Mode: S.optional(Mode),
    WebUrl: S.optional(S.String),
  }),
).annotations({ identifier: "CampaignHook" }) as any as S.Schema<CampaignHook>;
export interface CampaignLimits {
  Daily?: number;
  MaximumDuration?: number;
  MessagesPerSecond?: number;
  Total?: number;
  Session?: number;
}
export const CampaignLimits = S.suspend(() =>
  S.Struct({
    Daily: S.optional(S.Number),
    MaximumDuration: S.optional(S.Number),
    MessagesPerSecond: S.optional(S.Number),
    Total: S.optional(S.Number),
    Session: S.optional(S.Number),
  }),
).annotations({
  identifier: "CampaignLimits",
}) as any as S.Schema<CampaignLimits>;
export interface WriteCampaignRequest {
  AdditionalTreatments?: WriteTreatmentResource[];
  CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
  Description?: string;
  HoldoutPercent?: number;
  Hook?: CampaignHook;
  IsPaused?: boolean;
  Limits?: CampaignLimits;
  MessageConfiguration?: MessageConfiguration;
  Name?: string;
  Schedule?: Schedule;
  SegmentId?: string;
  SegmentVersion?: number;
  tags?: { [key: string]: string };
  TemplateConfiguration?: TemplateConfiguration;
  TreatmentDescription?: string;
  TreatmentName?: string;
  Priority?: number;
}
export const WriteCampaignRequest = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WriteCampaignRequest",
}) as any as S.Schema<WriteCampaignRequest>;
export interface UpdateCampaignRequest {
  ApplicationId: string;
  CampaignId: string;
  WriteCampaignRequest?: WriteCampaignRequest;
}
export const UpdateCampaignRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    CampaignId: S.String.pipe(T.HttpLabel("CampaignId")),
    WriteCampaignRequest: S.optional(WriteCampaignRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteCampaignRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateCampaignRequest",
}) as any as S.Schema<UpdateCampaignRequest>;
export interface EmailTemplateRequest {
  DefaultSubstitutions?: string;
  HtmlPart?: string;
  RecommenderId?: string;
  Subject?: string;
  Headers?: MessageHeader[];
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TextPart?: string;
}
export const EmailTemplateRequest = S.suspend(() =>
  S.Struct({
    DefaultSubstitutions: S.optional(S.String),
    HtmlPart: S.optional(S.String),
    RecommenderId: S.optional(S.String),
    Subject: S.optional(S.String),
    Headers: S.optional(ListOfMessageHeader),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TextPart: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailTemplateRequest",
}) as any as S.Schema<EmailTemplateRequest>;
export interface UpdateEmailTemplateRequest {
  CreateNewVersion?: boolean;
  EmailTemplateRequest?: EmailTemplateRequest;
  TemplateName: string;
  Version?: string;
}
export const UpdateEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    EmailTemplateRequest: S.optional(EmailTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEmailTemplateRequest",
}) as any as S.Schema<UpdateEmailTemplateRequest>;
export interface InAppTemplateRequest {
  Content?: InAppMessageContent[];
  CustomConfig?: { [key: string]: string };
  Layout?: Layout;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
}
export const InAppTemplateRequest = S.suspend(() =>
  S.Struct({
    Content: S.optional(ListOfInAppMessageContent),
    CustomConfig: S.optional(MapOf__string),
    Layout: S.optional(Layout),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "InAppTemplateRequest",
}) as any as S.Schema<InAppTemplateRequest>;
export interface UpdateInAppTemplateRequest {
  CreateNewVersion?: boolean;
  InAppTemplateRequest?: InAppTemplateRequest;
  TemplateName: string;
  Version?: string;
}
export const UpdateInAppTemplateRequest = S.suspend(() =>
  S.Struct({
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    InAppTemplateRequest: S.optional(InAppTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InAppTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/inapp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateInAppTemplateRequest",
}) as any as S.Schema<UpdateInAppTemplateRequest>;
export interface JourneyCustomMessage {
  Data?: string;
}
export const JourneyCustomMessage = S.suspend(() =>
  S.Struct({ Data: S.optional(S.String) }),
).annotations({
  identifier: "JourneyCustomMessage",
}) as any as S.Schema<JourneyCustomMessage>;
export interface CustomMessageActivity {
  DeliveryUri?: string;
  EndpointTypes?: __EndpointTypesElement[];
  MessageConfig?: JourneyCustomMessage;
  NextActivity?: string;
  TemplateName?: string;
  TemplateVersion?: string;
}
export const CustomMessageActivity = S.suspend(() =>
  S.Struct({
    DeliveryUri: S.optional(S.String),
    EndpointTypes: S.optional(ListOf__EndpointTypesElement),
    MessageConfig: S.optional(JourneyCustomMessage),
    NextActivity: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomMessageActivity",
}) as any as S.Schema<CustomMessageActivity>;
export interface EventCondition {
  Dimensions?: EventDimensions;
  MessageActivity?: string;
}
export const EventCondition = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(EventDimensions),
    MessageActivity: S.optional(S.String),
  }),
).annotations({
  identifier: "EventCondition",
}) as any as S.Schema<EventCondition>;
export interface SegmentCondition {
  SegmentId?: string;
}
export const SegmentCondition = S.suspend(() =>
  S.Struct({ SegmentId: S.optional(S.String) }),
).annotations({
  identifier: "SegmentCondition",
}) as any as S.Schema<SegmentCondition>;
export type Duration = "HR_24" | "DAY_7" | "DAY_14" | "DAY_30";
export const Duration = S.Literal("HR_24", "DAY_7", "DAY_14", "DAY_30");
export type RecencyType = "ACTIVE" | "INACTIVE";
export const RecencyType = S.Literal("ACTIVE", "INACTIVE");
export interface RecencyDimension {
  Duration?: Duration;
  RecencyType?: RecencyType;
}
export const RecencyDimension = S.suspend(() =>
  S.Struct({
    Duration: S.optional(Duration),
    RecencyType: S.optional(RecencyType),
  }),
).annotations({
  identifier: "RecencyDimension",
}) as any as S.Schema<RecencyDimension>;
export interface SegmentBehaviors {
  Recency?: RecencyDimension;
}
export const SegmentBehaviors = S.suspend(() =>
  S.Struct({ Recency: S.optional(RecencyDimension) }),
).annotations({
  identifier: "SegmentBehaviors",
}) as any as S.Schema<SegmentBehaviors>;
export interface SegmentDemographics {
  AppVersion?: SetDimension;
  Channel?: SetDimension;
  DeviceType?: SetDimension;
  Make?: SetDimension;
  Model?: SetDimension;
  Platform?: SetDimension;
}
export const SegmentDemographics = S.suspend(() =>
  S.Struct({
    AppVersion: S.optional(SetDimension),
    Channel: S.optional(SetDimension),
    DeviceType: S.optional(SetDimension),
    Make: S.optional(SetDimension),
    Model: S.optional(SetDimension),
    Platform: S.optional(SetDimension),
  }),
).annotations({
  identifier: "SegmentDemographics",
}) as any as S.Schema<SegmentDemographics>;
export interface GPSCoordinates {
  Latitude?: number;
  Longitude?: number;
}
export const GPSCoordinates = S.suspend(() =>
  S.Struct({ Latitude: S.optional(S.Number), Longitude: S.optional(S.Number) }),
).annotations({
  identifier: "GPSCoordinates",
}) as any as S.Schema<GPSCoordinates>;
export interface GPSPointDimension {
  Coordinates?: GPSCoordinates;
  RangeInKilometers?: number;
}
export const GPSPointDimension = S.suspend(() =>
  S.Struct({
    Coordinates: S.optional(GPSCoordinates),
    RangeInKilometers: S.optional(S.Number),
  }),
).annotations({
  identifier: "GPSPointDimension",
}) as any as S.Schema<GPSPointDimension>;
export interface SegmentLocation {
  Country?: SetDimension;
  GPSPoint?: GPSPointDimension;
}
export const SegmentLocation = S.suspend(() =>
  S.Struct({
    Country: S.optional(SetDimension),
    GPSPoint: S.optional(GPSPointDimension),
  }),
).annotations({
  identifier: "SegmentLocation",
}) as any as S.Schema<SegmentLocation>;
export interface SegmentDimensions {
  Attributes?: { [key: string]: AttributeDimension };
  Behavior?: SegmentBehaviors;
  Demographic?: SegmentDemographics;
  Location?: SegmentLocation;
  Metrics?: { [key: string]: MetricDimension };
  UserAttributes?: { [key: string]: AttributeDimension };
}
export const SegmentDimensions = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MapOfAttributeDimension),
    Behavior: S.optional(SegmentBehaviors),
    Demographic: S.optional(SegmentDemographics),
    Location: S.optional(SegmentLocation),
    Metrics: S.optional(MapOfMetricDimension),
    UserAttributes: S.optional(MapOfAttributeDimension),
  }),
).annotations({
  identifier: "SegmentDimensions",
}) as any as S.Schema<SegmentDimensions>;
export interface SimpleCondition {
  EventCondition?: EventCondition;
  SegmentCondition?: SegmentCondition;
  SegmentDimensions?: SegmentDimensions;
}
export const SimpleCondition = S.suspend(() =>
  S.Struct({
    EventCondition: S.optional(EventCondition),
    SegmentCondition: S.optional(SegmentCondition),
    SegmentDimensions: S.optional(SegmentDimensions)
      .pipe(T.JsonName("segmentDimensions"))
      .annotations({ identifier: "SegmentDimensions" }),
  }),
).annotations({
  identifier: "SimpleCondition",
}) as any as S.Schema<SimpleCondition>;
export type ListOfSimpleCondition = SimpleCondition[];
export const ListOfSimpleCondition = S.Array(SimpleCondition);
export type Operator = "ALL" | "ANY";
export const Operator = S.Literal("ALL", "ANY");
export interface Condition {
  Conditions?: SimpleCondition[];
  Operator?: Operator;
}
export const Condition = S.suspend(() =>
  S.Struct({
    Conditions: S.optional(ListOfSimpleCondition),
    Operator: S.optional(Operator),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export interface WaitTime {
  WaitFor?: string;
  WaitUntil?: string;
}
export const WaitTime = S.suspend(() =>
  S.Struct({ WaitFor: S.optional(S.String), WaitUntil: S.optional(S.String) }),
).annotations({ identifier: "WaitTime" }) as any as S.Schema<WaitTime>;
export interface ConditionalSplitActivity {
  Condition?: Condition;
  EvaluationWaitTime?: WaitTime;
  FalseActivity?: string;
  TrueActivity?: string;
}
export const ConditionalSplitActivity = S.suspend(() =>
  S.Struct({
    Condition: S.optional(Condition),
    EvaluationWaitTime: S.optional(WaitTime),
    FalseActivity: S.optional(S.String),
    TrueActivity: S.optional(S.String),
  }),
).annotations({
  identifier: "ConditionalSplitActivity",
}) as any as S.Schema<ConditionalSplitActivity>;
export interface JourneyEmailMessage {
  FromAddress?: string;
}
export const JourneyEmailMessage = S.suspend(() =>
  S.Struct({ FromAddress: S.optional(S.String) }),
).annotations({
  identifier: "JourneyEmailMessage",
}) as any as S.Schema<JourneyEmailMessage>;
export interface EmailMessageActivity {
  MessageConfig?: JourneyEmailMessage;
  NextActivity?: string;
  TemplateName?: string;
  TemplateVersion?: string;
}
export const EmailMessageActivity = S.suspend(() =>
  S.Struct({
    MessageConfig: S.optional(JourneyEmailMessage),
    NextActivity: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailMessageActivity",
}) as any as S.Schema<EmailMessageActivity>;
export interface HoldoutActivity {
  NextActivity?: string;
  Percentage?: number;
}
export const HoldoutActivity = S.suspend(() =>
  S.Struct({
    NextActivity: S.optional(S.String),
    Percentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "HoldoutActivity",
}) as any as S.Schema<HoldoutActivity>;
export interface MultiConditionalBranch {
  Condition?: SimpleCondition;
  NextActivity?: string;
}
export const MultiConditionalBranch = S.suspend(() =>
  S.Struct({
    Condition: S.optional(SimpleCondition),
    NextActivity: S.optional(S.String),
  }),
).annotations({
  identifier: "MultiConditionalBranch",
}) as any as S.Schema<MultiConditionalBranch>;
export type ListOfMultiConditionalBranch = MultiConditionalBranch[];
export const ListOfMultiConditionalBranch = S.Array(MultiConditionalBranch);
export interface MultiConditionalSplitActivity {
  Branches?: MultiConditionalBranch[];
  DefaultActivity?: string;
  EvaluationWaitTime?: WaitTime;
}
export const MultiConditionalSplitActivity = S.suspend(() =>
  S.Struct({
    Branches: S.optional(ListOfMultiConditionalBranch),
    DefaultActivity: S.optional(S.String),
    EvaluationWaitTime: S.optional(WaitTime),
  }),
).annotations({
  identifier: "MultiConditionalSplitActivity",
}) as any as S.Schema<MultiConditionalSplitActivity>;
export interface JourneyPushMessage {
  TimeToLive?: string;
}
export const JourneyPushMessage = S.suspend(() =>
  S.Struct({ TimeToLive: S.optional(S.String) }),
).annotations({
  identifier: "JourneyPushMessage",
}) as any as S.Schema<JourneyPushMessage>;
export interface PushMessageActivity {
  MessageConfig?: JourneyPushMessage;
  NextActivity?: string;
  TemplateName?: string;
  TemplateVersion?: string;
}
export const PushMessageActivity = S.suspend(() =>
  S.Struct({
    MessageConfig: S.optional(JourneyPushMessage),
    NextActivity: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "PushMessageActivity",
}) as any as S.Schema<PushMessageActivity>;
export interface RandomSplitEntry {
  NextActivity?: string;
  Percentage?: number;
}
export const RandomSplitEntry = S.suspend(() =>
  S.Struct({
    NextActivity: S.optional(S.String),
    Percentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "RandomSplitEntry",
}) as any as S.Schema<RandomSplitEntry>;
export type ListOfRandomSplitEntry = RandomSplitEntry[];
export const ListOfRandomSplitEntry = S.Array(RandomSplitEntry);
export interface RandomSplitActivity {
  Branches?: RandomSplitEntry[];
}
export const RandomSplitActivity = S.suspend(() =>
  S.Struct({ Branches: S.optional(ListOfRandomSplitEntry) }),
).annotations({
  identifier: "RandomSplitActivity",
}) as any as S.Schema<RandomSplitActivity>;
export interface JourneySMSMessage {
  MessageType?: MessageType;
  OriginationNumber?: string;
  SenderId?: string;
  EntityId?: string;
  TemplateId?: string;
}
export const JourneySMSMessage = S.suspend(() =>
  S.Struct({
    MessageType: S.optional(MessageType),
    OriginationNumber: S.optional(S.String),
    SenderId: S.optional(S.String),
    EntityId: S.optional(S.String),
    TemplateId: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneySMSMessage",
}) as any as S.Schema<JourneySMSMessage>;
export interface SMSMessageActivity {
  MessageConfig?: JourneySMSMessage;
  NextActivity?: string;
  TemplateName?: string;
  TemplateVersion?: string;
}
export const SMSMessageActivity = S.suspend(() =>
  S.Struct({
    MessageConfig: S.optional(JourneySMSMessage),
    NextActivity: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "SMSMessageActivity",
}) as any as S.Schema<SMSMessageActivity>;
export interface WaitActivity {
  NextActivity?: string;
  WaitTime?: WaitTime;
}
export const WaitActivity = S.suspend(() =>
  S.Struct({
    NextActivity: S.optional(S.String),
    WaitTime: S.optional(WaitTime),
  }),
).annotations({ identifier: "WaitActivity" }) as any as S.Schema<WaitActivity>;
export interface ContactCenterActivity {
  NextActivity?: string;
}
export const ContactCenterActivity = S.suspend(() =>
  S.Struct({ NextActivity: S.optional(S.String) }),
).annotations({
  identifier: "ContactCenterActivity",
}) as any as S.Schema<ContactCenterActivity>;
export interface Activity {
  CUSTOM?: CustomMessageActivity;
  ConditionalSplit?: ConditionalSplitActivity;
  Description?: string;
  EMAIL?: EmailMessageActivity;
  Holdout?: HoldoutActivity;
  MultiCondition?: MultiConditionalSplitActivity;
  PUSH?: PushMessageActivity;
  RandomSplit?: RandomSplitActivity;
  SMS?: SMSMessageActivity;
  Wait?: WaitActivity;
  ContactCenter?: ContactCenterActivity;
}
export const Activity = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Activity" }) as any as S.Schema<Activity>;
export type MapOfActivity = { [key: string]: Activity };
export const MapOfActivity = S.Record({ key: S.String, value: Activity });
export interface JourneyTimeframeCap {
  Cap?: number;
  Days?: number;
}
export const JourneyTimeframeCap = S.suspend(() =>
  S.Struct({ Cap: S.optional(S.Number), Days: S.optional(S.Number) }),
).annotations({
  identifier: "JourneyTimeframeCap",
}) as any as S.Schema<JourneyTimeframeCap>;
export interface JourneyLimits {
  DailyCap?: number;
  EndpointReentryCap?: number;
  MessagesPerSecond?: number;
  EndpointReentryInterval?: string;
  TimeframeCap?: JourneyTimeframeCap;
  TotalCap?: number;
}
export const JourneyLimits = S.suspend(() =>
  S.Struct({
    DailyCap: S.optional(S.Number),
    EndpointReentryCap: S.optional(S.Number),
    MessagesPerSecond: S.optional(S.Number),
    EndpointReentryInterval: S.optional(S.String),
    TimeframeCap: S.optional(JourneyTimeframeCap),
    TotalCap: S.optional(S.Number),
  }),
).annotations({
  identifier: "JourneyLimits",
}) as any as S.Schema<JourneyLimits>;
export interface JourneySchedule {
  EndTime?: Date;
  StartTime?: Date;
  Timezone?: string;
}
export const JourneySchedule = S.suspend(() =>
  S.Struct({
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Timezone: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneySchedule",
}) as any as S.Schema<JourneySchedule>;
export interface EventFilter {
  Dimensions?: EventDimensions;
  FilterType?: FilterType;
}
export const EventFilter = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(EventDimensions),
    FilterType: S.optional(FilterType),
  }),
).annotations({ identifier: "EventFilter" }) as any as S.Schema<EventFilter>;
export interface EventStartCondition {
  EventFilter?: EventFilter;
  SegmentId?: string;
}
export const EventStartCondition = S.suspend(() =>
  S.Struct({
    EventFilter: S.optional(EventFilter),
    SegmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "EventStartCondition",
}) as any as S.Schema<EventStartCondition>;
export interface StartCondition {
  Description?: string;
  EventStartCondition?: EventStartCondition;
  SegmentStartCondition?: SegmentCondition;
}
export const StartCondition = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    EventStartCondition: S.optional(EventStartCondition),
    SegmentStartCondition: S.optional(SegmentCondition),
  }),
).annotations({
  identifier: "StartCondition",
}) as any as S.Schema<StartCondition>;
export type State =
  | "DRAFT"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED"
  | "PAUSED";
export const State = S.Literal(
  "DRAFT",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
  "CLOSED",
  "PAUSED",
);
export interface JourneyChannelSettings {
  ConnectCampaignArn?: string;
  ConnectCampaignExecutionRoleArn?: string;
}
export const JourneyChannelSettings = S.suspend(() =>
  S.Struct({
    ConnectCampaignArn: S.optional(S.String),
    ConnectCampaignExecutionRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneyChannelSettings",
}) as any as S.Schema<JourneyChannelSettings>;
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export const DayOfWeek = S.Literal(
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
);
export interface OpenHoursRule {
  StartTime?: string;
  EndTime?: string;
}
export const OpenHoursRule = S.suspend(() =>
  S.Struct({ StartTime: S.optional(S.String), EndTime: S.optional(S.String) }),
).annotations({
  identifier: "OpenHoursRule",
}) as any as S.Schema<OpenHoursRule>;
export type ListOfOpenHoursRules = OpenHoursRule[];
export const ListOfOpenHoursRules = S.Array(OpenHoursRule);
export type MapOfListOfOpenHoursRules = {
  [key in DayOfWeek]?: OpenHoursRule[];
};
export const MapOfListOfOpenHoursRules = S.partial(
  S.Record({ key: DayOfWeek, value: ListOfOpenHoursRules }),
);
export interface OpenHours {
  EMAIL?: { [key: string]: OpenHoursRule[] };
  SMS?: { [key: string]: OpenHoursRule[] };
  PUSH?: { [key: string]: OpenHoursRule[] };
  VOICE?: { [key: string]: OpenHoursRule[] };
  CUSTOM?: { [key: string]: OpenHoursRule[] };
}
export const OpenHours = S.suspend(() =>
  S.Struct({
    EMAIL: S.optional(MapOfListOfOpenHoursRules),
    SMS: S.optional(MapOfListOfOpenHoursRules),
    PUSH: S.optional(MapOfListOfOpenHoursRules),
    VOICE: S.optional(MapOfListOfOpenHoursRules),
    CUSTOM: S.optional(MapOfListOfOpenHoursRules),
  }),
).annotations({ identifier: "OpenHours" }) as any as S.Schema<OpenHours>;
export interface ClosedDaysRule {
  Name?: string;
  StartDateTime?: string;
  EndDateTime?: string;
}
export const ClosedDaysRule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    StartDateTime: S.optional(S.String),
    EndDateTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ClosedDaysRule",
}) as any as S.Schema<ClosedDaysRule>;
export type ListOfClosedDaysRules = ClosedDaysRule[];
export const ListOfClosedDaysRules = S.Array(ClosedDaysRule);
export interface ClosedDays {
  EMAIL?: ClosedDaysRule[];
  SMS?: ClosedDaysRule[];
  PUSH?: ClosedDaysRule[];
  VOICE?: ClosedDaysRule[];
  CUSTOM?: ClosedDaysRule[];
}
export const ClosedDays = S.suspend(() =>
  S.Struct({
    EMAIL: S.optional(ListOfClosedDaysRules),
    SMS: S.optional(ListOfClosedDaysRules),
    PUSH: S.optional(ListOfClosedDaysRules),
    VOICE: S.optional(ListOfClosedDaysRules),
    CUSTOM: S.optional(ListOfClosedDaysRules),
  }),
).annotations({ identifier: "ClosedDays" }) as any as S.Schema<ClosedDays>;
export type __TimezoneEstimationMethodsElement = "PHONE_NUMBER" | "POSTAL_CODE";
export const __TimezoneEstimationMethodsElement = S.Literal(
  "PHONE_NUMBER",
  "POSTAL_CODE",
);
export type ListOf__TimezoneEstimationMethodsElement =
  __TimezoneEstimationMethodsElement[];
export const ListOf__TimezoneEstimationMethodsElement = S.Array(
  __TimezoneEstimationMethodsElement,
);
export interface WriteJourneyRequest {
  Activities?: { [key: string]: Activity };
  CreationDate?: string;
  LastModifiedDate?: string;
  Limits?: JourneyLimits;
  LocalTime?: boolean;
  Name?: string;
  QuietTime?: QuietTime;
  RefreshFrequency?: string;
  Schedule?: JourneySchedule;
  StartActivity?: string;
  StartCondition?: StartCondition;
  State?: State;
  WaitForQuietTime?: boolean;
  RefreshOnSegmentUpdate?: boolean;
  JourneyChannelSettings?: JourneyChannelSettings;
  SendingSchedule?: boolean;
  OpenHours?: OpenHours;
  ClosedDays?: ClosedDays;
  TimezoneEstimationMethods?: __TimezoneEstimationMethodsElement[];
}
export const WriteJourneyRequest = S.suspend(() =>
  S.Struct({
    Activities: S.optional(MapOfActivity),
    CreationDate: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Limits: S.optional(JourneyLimits),
    LocalTime: S.optional(S.Boolean),
    Name: S.optional(S.String),
    QuietTime: S.optional(QuietTime),
    RefreshFrequency: S.optional(S.String),
    Schedule: S.optional(JourneySchedule),
    StartActivity: S.optional(S.String),
    StartCondition: S.optional(StartCondition),
    State: S.optional(State),
    WaitForQuietTime: S.optional(S.Boolean),
    RefreshOnSegmentUpdate: S.optional(S.Boolean),
    JourneyChannelSettings: S.optional(JourneyChannelSettings),
    SendingSchedule: S.optional(S.Boolean),
    OpenHours: S.optional(OpenHours),
    ClosedDays: S.optional(ClosedDays),
    TimezoneEstimationMethods: S.optional(
      ListOf__TimezoneEstimationMethodsElement,
    ),
  }),
).annotations({
  identifier: "WriteJourneyRequest",
}) as any as S.Schema<WriteJourneyRequest>;
export interface UpdateJourneyRequest {
  ApplicationId: string;
  JourneyId: string;
  WriteJourneyRequest?: WriteJourneyRequest;
}
export const UpdateJourneyRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    WriteJourneyRequest: S.optional(WriteJourneyRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteJourneyRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateJourneyRequest",
}) as any as S.Schema<UpdateJourneyRequest>;
export interface AndroidPushNotificationTemplate {
  Action?: Action;
  Body?: string;
  ImageIconUrl?: string;
  ImageUrl?: string;
  RawContent?: string;
  SmallImageIconUrl?: string;
  Sound?: string;
  Title?: string;
  Url?: string;
}
export const AndroidPushNotificationTemplate = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Body: S.optional(S.String),
    ImageIconUrl: S.optional(S.String),
    ImageUrl: S.optional(S.String),
    RawContent: S.optional(S.String),
    SmallImageIconUrl: S.optional(S.String),
    Sound: S.optional(S.String),
    Title: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "AndroidPushNotificationTemplate",
}) as any as S.Schema<AndroidPushNotificationTemplate>;
export interface APNSPushNotificationTemplate {
  Action?: Action;
  Body?: string;
  MediaUrl?: string;
  RawContent?: string;
  Sound?: string;
  Title?: string;
  Url?: string;
}
export const APNSPushNotificationTemplate = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Body: S.optional(S.String),
    MediaUrl: S.optional(S.String),
    RawContent: S.optional(S.String),
    Sound: S.optional(S.String),
    Title: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "APNSPushNotificationTemplate",
}) as any as S.Schema<APNSPushNotificationTemplate>;
export interface DefaultPushNotificationTemplate {
  Action?: Action;
  Body?: string;
  Sound?: string;
  Title?: string;
  Url?: string;
}
export const DefaultPushNotificationTemplate = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Body: S.optional(S.String),
    Sound: S.optional(S.String),
    Title: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "DefaultPushNotificationTemplate",
}) as any as S.Schema<DefaultPushNotificationTemplate>;
export interface PushNotificationTemplateRequest {
  ADM?: AndroidPushNotificationTemplate;
  APNS?: APNSPushNotificationTemplate;
  Baidu?: AndroidPushNotificationTemplate;
  Default?: DefaultPushNotificationTemplate;
  DefaultSubstitutions?: string;
  GCM?: AndroidPushNotificationTemplate;
  RecommenderId?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
}
export const PushNotificationTemplateRequest = S.suspend(() =>
  S.Struct({
    ADM: S.optional(AndroidPushNotificationTemplate),
    APNS: S.optional(APNSPushNotificationTemplate),
    Baidu: S.optional(AndroidPushNotificationTemplate),
    Default: S.optional(DefaultPushNotificationTemplate),
    DefaultSubstitutions: S.optional(S.String),
    GCM: S.optional(AndroidPushNotificationTemplate),
    RecommenderId: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "PushNotificationTemplateRequest",
}) as any as S.Schema<PushNotificationTemplateRequest>;
export interface UpdatePushTemplateRequest {
  CreateNewVersion?: boolean;
  PushNotificationTemplateRequest?: PushNotificationTemplateRequest;
  TemplateName: string;
  Version?: string;
}
export const UpdatePushTemplateRequest = S.suspend(() =>
  S.Struct({
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    PushNotificationTemplateRequest: S.optional(PushNotificationTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PushNotificationTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/push" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePushTemplateRequest",
}) as any as S.Schema<UpdatePushTemplateRequest>;
export type ListOfSegmentDimensions = SegmentDimensions[];
export const ListOfSegmentDimensions = S.Array(SegmentDimensions);
export interface SegmentReference {
  Id?: string;
  Version?: number;
}
export const SegmentReference = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Version: S.optional(S.Number) }),
).annotations({
  identifier: "SegmentReference",
}) as any as S.Schema<SegmentReference>;
export type ListOfSegmentReference = SegmentReference[];
export const ListOfSegmentReference = S.Array(SegmentReference);
export type SourceType = "ALL" | "ANY" | "NONE";
export const SourceType = S.Literal("ALL", "ANY", "NONE");
export type Type = "ALL" | "ANY" | "NONE";
export const Type = S.Literal("ALL", "ANY", "NONE");
export interface SegmentGroup {
  Dimensions?: SegmentDimensions[];
  SourceSegments?: SegmentReference[];
  SourceType?: SourceType;
  Type?: Type;
}
export const SegmentGroup = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(ListOfSegmentDimensions),
    SourceSegments: S.optional(ListOfSegmentReference),
    SourceType: S.optional(SourceType),
    Type: S.optional(Type),
  }),
).annotations({ identifier: "SegmentGroup" }) as any as S.Schema<SegmentGroup>;
export type ListOfSegmentGroup = SegmentGroup[];
export const ListOfSegmentGroup = S.Array(SegmentGroup);
export type Include = "ALL" | "ANY" | "NONE";
export const Include = S.Literal("ALL", "ANY", "NONE");
export interface SegmentGroupList {
  Groups?: SegmentGroup[];
  Include?: Include;
}
export const SegmentGroupList = S.suspend(() =>
  S.Struct({
    Groups: S.optional(ListOfSegmentGroup),
    Include: S.optional(Include),
  }),
).annotations({
  identifier: "SegmentGroupList",
}) as any as S.Schema<SegmentGroupList>;
export interface WriteSegmentRequest {
  Dimensions?: SegmentDimensions;
  Name?: string;
  SegmentGroups?: SegmentGroupList;
  tags?: { [key: string]: string };
}
export const WriteSegmentRequest = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(SegmentDimensions),
    Name: S.optional(S.String),
    SegmentGroups: S.optional(SegmentGroupList),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "WriteSegmentRequest",
}) as any as S.Schema<WriteSegmentRequest>;
export interface UpdateSegmentRequest {
  ApplicationId: string;
  SegmentId: string;
  WriteSegmentRequest?: WriteSegmentRequest;
}
export const UpdateSegmentRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SegmentId: S.String.pipe(T.HttpLabel("SegmentId")),
    WriteSegmentRequest: S.optional(WriteSegmentRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteSegmentRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSegmentRequest",
}) as any as S.Schema<UpdateSegmentRequest>;
export interface SMSTemplateRequest {
  Body?: string;
  DefaultSubstitutions?: string;
  RecommenderId?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
}
export const SMSTemplateRequest = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    RecommenderId: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "SMSTemplateRequest",
}) as any as S.Schema<SMSTemplateRequest>;
export interface UpdateSmsTemplateRequest {
  CreateNewVersion?: boolean;
  SMSTemplateRequest?: SMSTemplateRequest;
  TemplateName: string;
  Version?: string;
}
export const UpdateSmsTemplateRequest = S.suspend(() =>
  S.Struct({
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    SMSTemplateRequest: S.optional(SMSTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSmsTemplateRequest",
}) as any as S.Schema<UpdateSmsTemplateRequest>;
export interface VoiceTemplateRequest {
  Body?: string;
  DefaultSubstitutions?: string;
  LanguageCode?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  VoiceId?: string;
}
export const VoiceTemplateRequest = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    VoiceId: S.optional(S.String),
  }),
).annotations({
  identifier: "VoiceTemplateRequest",
}) as any as S.Schema<VoiceTemplateRequest>;
export interface UpdateVoiceTemplateRequest {
  CreateNewVersion?: boolean;
  TemplateName: string;
  Version?: string;
  VoiceTemplateRequest?: VoiceTemplateRequest;
}
export const UpdateVoiceTemplateRequest = S.suspend(() =>
  S.Struct({
    CreateNewVersion: S.optional(S.Boolean).pipe(
      T.HttpQuery("create-new-version"),
    ),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    Version: S.optional(S.String).pipe(T.HttpQuery("version")),
    VoiceTemplateRequest: S.optional(VoiceTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceTemplateRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/templates/{TemplateName}/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVoiceTemplateRequest",
}) as any as S.Schema<UpdateVoiceTemplateRequest>;
export type Format = "CSV" | "JSON";
export const Format = S.Literal("CSV", "JSON");
export type ChannelType =
  | "PUSH"
  | "GCM"
  | "APNS"
  | "APNS_SANDBOX"
  | "APNS_VOIP"
  | "APNS_VOIP_SANDBOX"
  | "ADM"
  | "SMS"
  | "VOICE"
  | "EMAIL"
  | "BAIDU"
  | "CUSTOM"
  | "IN_APP";
export const ChannelType = S.Literal(
  "PUSH",
  "GCM",
  "APNS",
  "APNS_SANDBOX",
  "APNS_VOIP",
  "APNS_VOIP_SANDBOX",
  "ADM",
  "SMS",
  "VOICE",
  "EMAIL",
  "BAIDU",
  "CUSTOM",
  "IN_APP",
);
export interface ExportJobRequest {
  RoleArn?: string;
  S3UrlPrefix?: string;
  SegmentId?: string;
  SegmentVersion?: number;
}
export const ExportJobRequest = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    S3UrlPrefix: S.optional(S.String),
    SegmentId: S.optional(S.String),
    SegmentVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExportJobRequest",
}) as any as S.Schema<ExportJobRequest>;
export interface ImportJobRequest {
  DefineSegment?: boolean;
  ExternalId?: string;
  Format?: Format;
  RegisterEndpoints?: boolean;
  RoleArn?: string;
  S3Url?: string;
  SegmentId?: string;
  SegmentName?: string;
}
export const ImportJobRequest = S.suspend(() =>
  S.Struct({
    DefineSegment: S.optional(S.Boolean),
    ExternalId: S.optional(S.String),
    Format: S.optional(Format),
    RegisterEndpoints: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    S3Url: S.optional(S.String),
    SegmentId: S.optional(S.String),
    SegmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportJobRequest",
}) as any as S.Schema<ImportJobRequest>;
export interface CreateRecommenderConfigurationShape {
  Attributes?: { [key: string]: string };
  Description?: string;
  Name?: string;
  RecommendationProviderIdType?: string;
  RecommendationProviderRoleArn?: string;
  RecommendationProviderUri?: string;
  RecommendationTransformerUri?: string;
  RecommendationsDisplayName?: string;
  RecommendationsPerMessage?: number;
}
export const CreateRecommenderConfigurationShape = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MapOf__string),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    RecommendationProviderIdType: S.optional(S.String),
    RecommendationProviderRoleArn: S.optional(S.String),
    RecommendationProviderUri: S.optional(S.String),
    RecommendationTransformerUri: S.optional(S.String),
    RecommendationsDisplayName: S.optional(S.String),
    RecommendationsPerMessage: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateRecommenderConfigurationShape",
}) as any as S.Schema<CreateRecommenderConfigurationShape>;
export interface NumberValidateRequest {
  IsoCountryCode?: string;
  PhoneNumber?: string;
}
export const NumberValidateRequest = S.suspend(() =>
  S.Struct({
    IsoCountryCode: S.optional(S.String),
    PhoneNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "NumberValidateRequest",
}) as any as S.Schema<NumberValidateRequest>;
export interface WriteEventStream {
  DestinationStreamArn?: string;
  RoleArn?: string;
}
export const WriteEventStream = S.suspend(() =>
  S.Struct({
    DestinationStreamArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "WriteEventStream",
}) as any as S.Schema<WriteEventStream>;
export interface UpdateAttributesRequest {
  Blacklist?: string[];
}
export const UpdateAttributesRequest = S.suspend(() =>
  S.Struct({ Blacklist: S.optional(ListOf__string) }),
).annotations({
  identifier: "UpdateAttributesRequest",
}) as any as S.Schema<UpdateAttributesRequest>;
export interface SendOTPMessageRequestParameters {
  AllowedAttempts?: number;
  BrandName?: string;
  Channel?: string;
  CodeLength?: number;
  DestinationIdentity?: string;
  EntityId?: string;
  Language?: string;
  OriginationIdentity?: string;
  ReferenceId?: string;
  TemplateId?: string;
  ValidityPeriod?: number;
}
export const SendOTPMessageRequestParameters = S.suspend(() =>
  S.Struct({
    AllowedAttempts: S.optional(S.Number),
    BrandName: S.optional(S.String),
    Channel: S.optional(S.String),
    CodeLength: S.optional(S.Number),
    DestinationIdentity: S.optional(S.String),
    EntityId: S.optional(S.String),
    Language: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    ReferenceId: S.optional(S.String),
    TemplateId: S.optional(S.String),
    ValidityPeriod: S.optional(S.Number),
  }),
).annotations({
  identifier: "SendOTPMessageRequestParameters",
}) as any as S.Schema<SendOTPMessageRequestParameters>;
export type MapOfListOf__string = { [key: string]: string[] };
export const MapOfListOf__string = S.Record({
  key: S.String,
  value: ListOf__string,
});
export interface ADMMessage {
  Action?: Action;
  Body?: string;
  ConsolidationKey?: string;
  Data?: { [key: string]: string };
  ExpiresAfter?: string;
  IconReference?: string;
  ImageIconUrl?: string;
  ImageUrl?: string;
  MD5?: string;
  RawContent?: string;
  SilentPush?: boolean;
  SmallImageIconUrl?: string;
  Sound?: string;
  Substitutions?: { [key: string]: string[] };
  Title?: string;
  Url?: string;
}
export const ADMMessage = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
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
  }),
).annotations({ identifier: "ADMMessage" }) as any as S.Schema<ADMMessage>;
export interface APNSMessage {
  APNSPushType?: string;
  Action?: Action;
  Badge?: number;
  Body?: string;
  Category?: string;
  CollapseId?: string;
  Data?: { [key: string]: string };
  MediaUrl?: string;
  PreferredAuthenticationMethod?: string;
  Priority?: string;
  RawContent?: string;
  SilentPush?: boolean;
  Sound?: string;
  Substitutions?: { [key: string]: string[] };
  ThreadId?: string;
  TimeToLive?: number;
  Title?: string;
  Url?: string;
}
export const APNSMessage = S.suspend(() =>
  S.Struct({
    APNSPushType: S.optional(S.String),
    Action: S.optional(Action),
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
  }),
).annotations({ identifier: "APNSMessage" }) as any as S.Schema<APNSMessage>;
export interface BaiduMessage {
  Action?: Action;
  Body?: string;
  Data?: { [key: string]: string };
  IconReference?: string;
  ImageIconUrl?: string;
  ImageUrl?: string;
  RawContent?: string;
  SilentPush?: boolean;
  SmallImageIconUrl?: string;
  Sound?: string;
  Substitutions?: { [key: string]: string[] };
  TimeToLive?: number;
  Title?: string;
  Url?: string;
}
export const BaiduMessage = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
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
  }),
).annotations({ identifier: "BaiduMessage" }) as any as S.Schema<BaiduMessage>;
export interface DefaultMessage {
  Body?: string;
  Substitutions?: { [key: string]: string[] };
}
export const DefaultMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    Substitutions: S.optional(MapOfListOf__string),
  }),
).annotations({
  identifier: "DefaultMessage",
}) as any as S.Schema<DefaultMessage>;
export interface DefaultPushNotificationMessage {
  Action?: Action;
  Body?: string;
  Data?: { [key: string]: string };
  SilentPush?: boolean;
  Substitutions?: { [key: string]: string[] };
  Title?: string;
  Url?: string;
}
export const DefaultPushNotificationMessage = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
    Body: S.optional(S.String),
    Data: S.optional(MapOf__string),
    SilentPush: S.optional(S.Boolean),
    Substitutions: S.optional(MapOfListOf__string),
    Title: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "DefaultPushNotificationMessage",
}) as any as S.Schema<DefaultPushNotificationMessage>;
export interface RawEmail {
  Data?: Uint8Array;
}
export const RawEmail = S.suspend(() =>
  S.Struct({ Data: S.optional(T.Blob) }),
).annotations({ identifier: "RawEmail" }) as any as S.Schema<RawEmail>;
export interface SimpleEmailPart {
  Charset?: string;
  Data?: string;
}
export const SimpleEmailPart = S.suspend(() =>
  S.Struct({ Charset: S.optional(S.String), Data: S.optional(S.String) }),
).annotations({
  identifier: "SimpleEmailPart",
}) as any as S.Schema<SimpleEmailPart>;
export interface SimpleEmail {
  HtmlPart?: SimpleEmailPart;
  Subject?: SimpleEmailPart;
  TextPart?: SimpleEmailPart;
  Headers?: MessageHeader[];
}
export const SimpleEmail = S.suspend(() =>
  S.Struct({
    HtmlPart: S.optional(SimpleEmailPart),
    Subject: S.optional(SimpleEmailPart),
    TextPart: S.optional(SimpleEmailPart),
    Headers: S.optional(ListOfMessageHeader),
  }),
).annotations({ identifier: "SimpleEmail" }) as any as S.Schema<SimpleEmail>;
export interface EmailMessage {
  Body?: string;
  FeedbackForwardingAddress?: string;
  FromAddress?: string;
  RawEmail?: RawEmail;
  ReplyToAddresses?: string[];
  SimpleEmail?: SimpleEmail;
  Substitutions?: { [key: string]: string[] };
}
export const EmailMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    FeedbackForwardingAddress: S.optional(S.String),
    FromAddress: S.optional(S.String),
    RawEmail: S.optional(RawEmail),
    ReplyToAddresses: S.optional(ListOf__string),
    SimpleEmail: S.optional(SimpleEmail),
    Substitutions: S.optional(MapOfListOf__string),
  }),
).annotations({ identifier: "EmailMessage" }) as any as S.Schema<EmailMessage>;
export interface GCMMessage {
  Action?: Action;
  Body?: string;
  CollapseKey?: string;
  Data?: { [key: string]: string };
  IconReference?: string;
  ImageIconUrl?: string;
  ImageUrl?: string;
  PreferredAuthenticationMethod?: string;
  Priority?: string;
  RawContent?: string;
  RestrictedPackageName?: string;
  SilentPush?: boolean;
  SmallImageIconUrl?: string;
  Sound?: string;
  Substitutions?: { [key: string]: string[] };
  TimeToLive?: number;
  Title?: string;
  Url?: string;
}
export const GCMMessage = S.suspend(() =>
  S.Struct({
    Action: S.optional(Action),
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
  }),
).annotations({ identifier: "GCMMessage" }) as any as S.Schema<GCMMessage>;
export interface SMSMessage {
  Body?: string;
  Keyword?: string;
  MediaUrl?: string;
  MessageType?: MessageType;
  OriginationNumber?: string;
  SenderId?: string;
  Substitutions?: { [key: string]: string[] };
  EntityId?: string;
  TemplateId?: string;
}
export const SMSMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    Keyword: S.optional(S.String),
    MediaUrl: S.optional(S.String),
    MessageType: S.optional(MessageType),
    OriginationNumber: S.optional(S.String),
    SenderId: S.optional(S.String),
    Substitutions: S.optional(MapOfListOf__string),
    EntityId: S.optional(S.String),
    TemplateId: S.optional(S.String),
  }),
).annotations({ identifier: "SMSMessage" }) as any as S.Schema<SMSMessage>;
export interface VoiceMessage {
  Body?: string;
  LanguageCode?: string;
  OriginationNumber?: string;
  Substitutions?: { [key: string]: string[] };
  VoiceId?: string;
}
export const VoiceMessage = S.suspend(() =>
  S.Struct({
    Body: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    OriginationNumber: S.optional(S.String),
    Substitutions: S.optional(MapOfListOf__string),
    VoiceId: S.optional(S.String),
  }),
).annotations({ identifier: "VoiceMessage" }) as any as S.Schema<VoiceMessage>;
export interface DirectMessageConfiguration {
  ADMMessage?: ADMMessage;
  APNSMessage?: APNSMessage;
  BaiduMessage?: BaiduMessage;
  DefaultMessage?: DefaultMessage;
  DefaultPushNotificationMessage?: DefaultPushNotificationMessage;
  EmailMessage?: EmailMessage;
  GCMMessage?: GCMMessage;
  SMSMessage?: SMSMessage;
  VoiceMessage?: VoiceMessage;
}
export const DirectMessageConfiguration = S.suspend(() =>
  S.Struct({
    ADMMessage: S.optional(ADMMessage),
    APNSMessage: S.optional(APNSMessage),
    BaiduMessage: S.optional(BaiduMessage),
    DefaultMessage: S.optional(DefaultMessage),
    DefaultPushNotificationMessage: S.optional(DefaultPushNotificationMessage),
    EmailMessage: S.optional(EmailMessage),
    GCMMessage: S.optional(GCMMessage),
    SMSMessage: S.optional(SMSMessage),
    VoiceMessage: S.optional(VoiceMessage),
  }),
).annotations({
  identifier: "DirectMessageConfiguration",
}) as any as S.Schema<DirectMessageConfiguration>;
export interface EndpointSendConfiguration {
  BodyOverride?: string;
  Context?: { [key: string]: string };
  RawContent?: string;
  Substitutions?: { [key: string]: string[] };
  TitleOverride?: string;
}
export const EndpointSendConfiguration = S.suspend(() =>
  S.Struct({
    BodyOverride: S.optional(S.String),
    Context: S.optional(MapOf__string),
    RawContent: S.optional(S.String),
    Substitutions: S.optional(MapOfListOf__string),
    TitleOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointSendConfiguration",
}) as any as S.Schema<EndpointSendConfiguration>;
export type MapOfEndpointSendConfiguration = {
  [key: string]: EndpointSendConfiguration;
};
export const MapOfEndpointSendConfiguration = S.Record({
  key: S.String,
  value: EndpointSendConfiguration,
});
export interface SendUsersMessageRequest {
  Context?: { [key: string]: string };
  MessageConfiguration?: DirectMessageConfiguration;
  TemplateConfiguration?: TemplateConfiguration;
  TraceId?: string;
  Users?: { [key: string]: EndpointSendConfiguration };
}
export const SendUsersMessageRequest = S.suspend(() =>
  S.Struct({
    Context: S.optional(MapOf__string),
    MessageConfiguration: S.optional(DirectMessageConfiguration),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TraceId: S.optional(S.String),
    Users: S.optional(MapOfEndpointSendConfiguration),
  }),
).annotations({
  identifier: "SendUsersMessageRequest",
}) as any as S.Schema<SendUsersMessageRequest>;
export interface TagsModel {
  tags?: { [key: string]: string };
}
export const TagsModel = S.suspend(() =>
  S.Struct({ tags: S.optional(MapOf__string).pipe(T.JsonName("tags")) }),
).annotations({ identifier: "TagsModel" }) as any as S.Schema<TagsModel>;
export interface ADMChannelRequest {
  ClientId?: string;
  ClientSecret?: string;
  Enabled?: boolean;
}
export const ADMChannelRequest = S.suspend(() =>
  S.Struct({
    ClientId: S.optional(S.String),
    ClientSecret: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ADMChannelRequest",
}) as any as S.Schema<ADMChannelRequest>;
export interface APNSChannelRequest {
  BundleId?: string;
  Certificate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  PrivateKey?: string;
  TeamId?: string;
  TokenKey?: string;
  TokenKeyId?: string;
}
export const APNSChannelRequest = S.suspend(() =>
  S.Struct({
    BundleId: S.optional(S.String),
    Certificate: S.optional(S.String),
    DefaultAuthenticationMethod: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    PrivateKey: S.optional(S.String),
    TeamId: S.optional(S.String),
    TokenKey: S.optional(S.String),
    TokenKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "APNSChannelRequest",
}) as any as S.Schema<APNSChannelRequest>;
export interface APNSSandboxChannelRequest {
  BundleId?: string;
  Certificate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  PrivateKey?: string;
  TeamId?: string;
  TokenKey?: string;
  TokenKeyId?: string;
}
export const APNSSandboxChannelRequest = S.suspend(() =>
  S.Struct({
    BundleId: S.optional(S.String),
    Certificate: S.optional(S.String),
    DefaultAuthenticationMethod: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    PrivateKey: S.optional(S.String),
    TeamId: S.optional(S.String),
    TokenKey: S.optional(S.String),
    TokenKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "APNSSandboxChannelRequest",
}) as any as S.Schema<APNSSandboxChannelRequest>;
export interface APNSVoipChannelRequest {
  BundleId?: string;
  Certificate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  PrivateKey?: string;
  TeamId?: string;
  TokenKey?: string;
  TokenKeyId?: string;
}
export const APNSVoipChannelRequest = S.suspend(() =>
  S.Struct({
    BundleId: S.optional(S.String),
    Certificate: S.optional(S.String),
    DefaultAuthenticationMethod: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    PrivateKey: S.optional(S.String),
    TeamId: S.optional(S.String),
    TokenKey: S.optional(S.String),
    TokenKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "APNSVoipChannelRequest",
}) as any as S.Schema<APNSVoipChannelRequest>;
export interface APNSVoipSandboxChannelRequest {
  BundleId?: string;
  Certificate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  PrivateKey?: string;
  TeamId?: string;
  TokenKey?: string;
  TokenKeyId?: string;
}
export const APNSVoipSandboxChannelRequest = S.suspend(() =>
  S.Struct({
    BundleId: S.optional(S.String),
    Certificate: S.optional(S.String),
    DefaultAuthenticationMethod: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    PrivateKey: S.optional(S.String),
    TeamId: S.optional(S.String),
    TokenKey: S.optional(S.String),
    TokenKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "APNSVoipSandboxChannelRequest",
}) as any as S.Schema<APNSVoipSandboxChannelRequest>;
export interface BaiduChannelRequest {
  ApiKey?: string;
  Enabled?: boolean;
  SecretKey?: string;
}
export const BaiduChannelRequest = S.suspend(() =>
  S.Struct({
    ApiKey: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    SecretKey: S.optional(S.String),
  }),
).annotations({
  identifier: "BaiduChannelRequest",
}) as any as S.Schema<BaiduChannelRequest>;
export interface EmailChannelRequest {
  ConfigurationSet?: string;
  Enabled?: boolean;
  FromAddress?: string;
  Identity?: string;
  RoleArn?: string;
  OrchestrationSendingRoleArn?: string;
}
export const EmailChannelRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSet: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    FromAddress: S.optional(S.String),
    Identity: S.optional(S.String),
    RoleArn: S.optional(S.String),
    OrchestrationSendingRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailChannelRequest",
}) as any as S.Schema<EmailChannelRequest>;
export interface GCMChannelRequest {
  ApiKey?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  ServiceJson?: string;
}
export const GCMChannelRequest = S.suspend(() =>
  S.Struct({
    ApiKey: S.optional(S.String),
    DefaultAuthenticationMethod: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    ServiceJson: S.optional(S.String),
  }),
).annotations({
  identifier: "GCMChannelRequest",
}) as any as S.Schema<GCMChannelRequest>;
export interface JourneyStateRequest {
  State?: State;
}
export const JourneyStateRequest = S.suspend(() =>
  S.Struct({ State: S.optional(State) }),
).annotations({
  identifier: "JourneyStateRequest",
}) as any as S.Schema<JourneyStateRequest>;
export interface UpdateRecommenderConfigurationShape {
  Attributes?: { [key: string]: string };
  Description?: string;
  Name?: string;
  RecommendationProviderIdType?: string;
  RecommendationProviderRoleArn?: string;
  RecommendationProviderUri?: string;
  RecommendationTransformerUri?: string;
  RecommendationsDisplayName?: string;
  RecommendationsPerMessage?: number;
}
export const UpdateRecommenderConfigurationShape = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MapOf__string),
    Description: S.optional(S.String),
    Name: S.optional(S.String),
    RecommendationProviderIdType: S.optional(S.String),
    RecommendationProviderRoleArn: S.optional(S.String),
    RecommendationProviderUri: S.optional(S.String),
    RecommendationTransformerUri: S.optional(S.String),
    RecommendationsDisplayName: S.optional(S.String),
    RecommendationsPerMessage: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateRecommenderConfigurationShape",
}) as any as S.Schema<UpdateRecommenderConfigurationShape>;
export interface SMSChannelRequest {
  Enabled?: boolean;
  SenderId?: string;
  ShortCode?: string;
}
export const SMSChannelRequest = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    SenderId: S.optional(S.String),
    ShortCode: S.optional(S.String),
  }),
).annotations({
  identifier: "SMSChannelRequest",
}) as any as S.Schema<SMSChannelRequest>;
export interface TemplateActiveVersionRequest {
  Version?: string;
}
export const TemplateActiveVersionRequest = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({
  identifier: "TemplateActiveVersionRequest",
}) as any as S.Schema<TemplateActiveVersionRequest>;
export interface VoiceChannelRequest {
  Enabled?: boolean;
}
export const VoiceChannelRequest = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "VoiceChannelRequest",
}) as any as S.Schema<VoiceChannelRequest>;
export interface VerifyOTPMessageRequestParameters {
  DestinationIdentity?: string;
  Otp?: string;
  ReferenceId?: string;
}
export const VerifyOTPMessageRequestParameters = S.suspend(() =>
  S.Struct({
    DestinationIdentity: S.optional(S.String),
    Otp: S.optional(S.String),
    ReferenceId: S.optional(S.String),
  }),
).annotations({
  identifier: "VerifyOTPMessageRequestParameters",
}) as any as S.Schema<VerifyOTPMessageRequestParameters>;
export interface CreateExportJobRequest {
  ApplicationId: string;
  ExportJobRequest?: ExportJobRequest;
}
export const CreateExportJobRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ExportJobRequest: S.optional(ExportJobRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ExportJobRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/jobs/export" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateExportJobRequest",
}) as any as S.Schema<CreateExportJobRequest>;
export interface CreateImportJobRequest {
  ApplicationId: string;
  ImportJobRequest?: ImportJobRequest;
}
export const CreateImportJobRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    ImportJobRequest: S.optional(ImportJobRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ImportJobRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/jobs/import" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateImportJobRequest",
}) as any as S.Schema<CreateImportJobRequest>;
export interface CreateRecommenderConfigurationRequest {
  CreateRecommenderConfiguration?: CreateRecommenderConfigurationShape;
}
export const CreateRecommenderConfigurationRequest = S.suspend(() =>
  S.Struct({
    CreateRecommenderConfiguration: S.optional(
      CreateRecommenderConfigurationShape,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateRecommenderConfigurationShape" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/recommenders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecommenderConfigurationRequest",
}) as any as S.Schema<CreateRecommenderConfigurationRequest>;
export interface CreateSmsTemplateRequest {
  SMSTemplateRequest?: SMSTemplateRequest;
  TemplateName: string;
}
export const CreateSmsTemplateRequest = S.suspend(() =>
  S.Struct({
    SMSTemplateRequest: S.optional(SMSTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSmsTemplateRequest",
}) as any as S.Schema<CreateSmsTemplateRequest>;
export interface CreateVoiceTemplateRequest {
  TemplateName: string;
  VoiceTemplateRequest?: VoiceTemplateRequest;
}
export const CreateVoiceTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    VoiceTemplateRequest: S.optional(VoiceTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceTemplateRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateVoiceTemplateRequest",
}) as any as S.Schema<CreateVoiceTemplateRequest>;
export interface MessageBody {
  Message?: string;
  RequestID?: string;
}
export const MessageBody = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), RequestID: S.optional(S.String) }),
).annotations({ identifier: "MessageBody" }) as any as S.Schema<MessageBody>;
export interface DeleteInAppTemplateResponse {
  MessageBody: MessageBody;
}
export const DeleteInAppTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "DeleteInAppTemplateResponse",
}) as any as S.Schema<DeleteInAppTemplateResponse>;
export interface DeletePushTemplateResponse {
  MessageBody: MessageBody;
}
export const DeletePushTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "DeletePushTemplateResponse",
}) as any as S.Schema<DeletePushTemplateResponse>;
export interface DeleteSmsTemplateResponse {
  MessageBody: MessageBody;
}
export const DeleteSmsTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "DeleteSmsTemplateResponse",
}) as any as S.Schema<DeleteSmsTemplateResponse>;
export interface DeleteVoiceTemplateResponse {
  MessageBody: MessageBody;
}
export const DeleteVoiceTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "DeleteVoiceTemplateResponse",
}) as any as S.Schema<DeleteVoiceTemplateResponse>;
export interface ADMChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const ADMChannelResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    HasCredential: S.optional(S.Boolean),
    Id: S.optional(S.String),
    IsArchived: S.optional(S.Boolean),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "ADMChannelResponse",
}) as any as S.Schema<ADMChannelResponse>;
export interface GetAdmChannelResponse {
  ADMChannelResponse: ADMChannelResponse & { Platform: string };
}
export const GetAdmChannelResponse = S.suspend(() =>
  S.Struct({
    ADMChannelResponse: S.optional(ADMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ADMChannelResponse" }),
  }),
).annotations({
  identifier: "GetAdmChannelResponse",
}) as any as S.Schema<GetAdmChannelResponse>;
export interface APNSChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  HasTokenKey?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const APNSChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "APNSChannelResponse",
}) as any as S.Schema<APNSChannelResponse>;
export interface GetApnsChannelResponse {
  APNSChannelResponse: APNSChannelResponse & { Platform: string };
}
export const GetApnsChannelResponse = S.suspend(() =>
  S.Struct({
    APNSChannelResponse: S.optional(APNSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSChannelResponse" }),
  }),
).annotations({
  identifier: "GetApnsChannelResponse",
}) as any as S.Schema<GetApnsChannelResponse>;
export interface APNSSandboxChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  HasTokenKey?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const APNSSandboxChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "APNSSandboxChannelResponse",
}) as any as S.Schema<APNSSandboxChannelResponse>;
export interface GetApnsSandboxChannelResponse {
  APNSSandboxChannelResponse: APNSSandboxChannelResponse & { Platform: string };
}
export const GetApnsSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSSandboxChannelResponse: S.optional(APNSSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "GetApnsSandboxChannelResponse",
}) as any as S.Schema<GetApnsSandboxChannelResponse>;
export interface APNSVoipChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  HasTokenKey?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const APNSVoipChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "APNSVoipChannelResponse",
}) as any as S.Schema<APNSVoipChannelResponse>;
export interface GetApnsVoipChannelResponse {
  APNSVoipChannelResponse: APNSVoipChannelResponse & { Platform: string };
}
export const GetApnsVoipChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipChannelResponse: S.optional(APNSVoipChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipChannelResponse" }),
  }),
).annotations({
  identifier: "GetApnsVoipChannelResponse",
}) as any as S.Schema<GetApnsVoipChannelResponse>;
export interface APNSVoipSandboxChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  HasTokenKey?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const APNSVoipSandboxChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "APNSVoipSandboxChannelResponse",
}) as any as S.Schema<APNSVoipSandboxChannelResponse>;
export interface GetApnsVoipSandboxChannelResponse {
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse & {
    Platform: string;
  };
}
export const GetApnsVoipSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipSandboxChannelResponse: S.optional(APNSVoipSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "GetApnsVoipSandboxChannelResponse",
}) as any as S.Schema<GetApnsVoipSandboxChannelResponse>;
export interface ApplicationResponse {
  Arn?: string;
  Id?: string;
  Name?: string;
  tags?: { [key: string]: string };
  CreationDate?: string;
}
export const ApplicationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    CreationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationResponse",
}) as any as S.Schema<ApplicationResponse>;
export interface GetAppResponse {
  ApplicationResponse: ApplicationResponse & {
    Arn: string;
    Id: string;
    Name: string;
  };
}
export const GetAppResponse = S.suspend(() =>
  S.Struct({
    ApplicationResponse: S.optional(ApplicationResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationResponse" }),
  }),
).annotations({
  identifier: "GetAppResponse",
}) as any as S.Schema<GetAppResponse>;
export interface BaiduChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Credential?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const BaiduChannelResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Credential: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    HasCredential: S.optional(S.Boolean),
    Id: S.optional(S.String),
    IsArchived: S.optional(S.Boolean),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "BaiduChannelResponse",
}) as any as S.Schema<BaiduChannelResponse>;
export interface GetBaiduChannelResponse {
  BaiduChannelResponse: BaiduChannelResponse & {
    Credential: string;
    Platform: string;
  };
}
export const GetBaiduChannelResponse = S.suspend(() =>
  S.Struct({
    BaiduChannelResponse: S.optional(BaiduChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "BaiduChannelResponse" }),
  }),
).annotations({
  identifier: "GetBaiduChannelResponse",
}) as any as S.Schema<GetBaiduChannelResponse>;
export type CampaignStatus =
  | "SCHEDULED"
  | "EXECUTING"
  | "PENDING_NEXT_RUN"
  | "COMPLETED"
  | "PAUSED"
  | "DELETED"
  | "INVALID";
export const CampaignStatus = S.Literal(
  "SCHEDULED",
  "EXECUTING",
  "PENDING_NEXT_RUN",
  "COMPLETED",
  "PAUSED",
  "DELETED",
  "INVALID",
);
export interface CampaignState {
  CampaignStatus?: CampaignStatus;
}
export const CampaignState = S.suspend(() =>
  S.Struct({ CampaignStatus: S.optional(CampaignStatus) }),
).annotations({
  identifier: "CampaignState",
}) as any as S.Schema<CampaignState>;
export interface TreatmentResource {
  CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
  Id?: string;
  MessageConfiguration?: MessageConfiguration;
  Schedule?: Schedule;
  SizePercent?: number;
  State?: CampaignState;
  TemplateConfiguration?: TemplateConfiguration;
  TreatmentDescription?: string;
  TreatmentName?: string;
}
export const TreatmentResource = S.suspend(() =>
  S.Struct({
    CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
    Id: S.optional(S.String),
    MessageConfiguration: S.optional(MessageConfiguration),
    Schedule: S.optional(Schedule),
    SizePercent: S.optional(S.Number),
    State: S.optional(CampaignState),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TreatmentDescription: S.optional(S.String),
    TreatmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "TreatmentResource",
}) as any as S.Schema<TreatmentResource>;
export type ListOfTreatmentResource = TreatmentResource[];
export const ListOfTreatmentResource = S.Array(TreatmentResource);
export interface CampaignResponse {
  AdditionalTreatments?: TreatmentResource[];
  ApplicationId?: string;
  Arn?: string;
  CreationDate?: string;
  CustomDeliveryConfiguration?: CustomDeliveryConfiguration;
  DefaultState?: CampaignState;
  Description?: string;
  HoldoutPercent?: number;
  Hook?: CampaignHook;
  Id?: string;
  IsPaused?: boolean;
  LastModifiedDate?: string;
  Limits?: CampaignLimits;
  MessageConfiguration?: MessageConfiguration;
  Name?: string;
  Schedule?: Schedule;
  SegmentId?: string;
  SegmentVersion?: number;
  State?: CampaignState;
  tags?: { [key: string]: string };
  TemplateConfiguration?: TemplateConfiguration;
  TreatmentDescription?: string;
  TreatmentName?: string;
  Version?: number;
  Priority?: number;
}
export const CampaignResponse = S.suspend(() =>
  S.Struct({
    AdditionalTreatments: S.optional(ListOfTreatmentResource),
    ApplicationId: S.optional(S.String),
    Arn: S.optional(S.String),
    CreationDate: S.optional(S.String),
    CustomDeliveryConfiguration: S.optional(CustomDeliveryConfiguration),
    DefaultState: S.optional(CampaignState),
    Description: S.optional(S.String),
    HoldoutPercent: S.optional(S.Number),
    Hook: S.optional(CampaignHook),
    Id: S.optional(S.String),
    IsPaused: S.optional(S.Boolean),
    LastModifiedDate: S.optional(S.String),
    Limits: S.optional(CampaignLimits),
    MessageConfiguration: S.optional(MessageConfiguration),
    Name: S.optional(S.String),
    Schedule: S.optional(Schedule),
    SegmentId: S.optional(S.String),
    SegmentVersion: S.optional(S.Number),
    State: S.optional(CampaignState),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TreatmentDescription: S.optional(S.String),
    TreatmentName: S.optional(S.String),
    Version: S.optional(S.Number),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "CampaignResponse",
}) as any as S.Schema<CampaignResponse>;
export interface GetCampaignResponse {
  CampaignResponse: CampaignResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    SegmentId: string;
    SegmentVersion: number;
    AdditionalTreatments: (TreatmentResource & {
      Id: string;
      SizePercent: number;
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
    CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
      DeliveryUri: string;
    };
    MessageConfiguration: MessageConfiguration & {
      InAppMessage: CampaignInAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
    };
    Schedule: Schedule & {
      StartTime: string;
      EventFilter: CampaignEventFilter & {
        Dimensions: EventDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          EventType: SetDimension & { Values: ListOf__string };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
        };
        FilterType: FilterType;
      };
    };
  };
}
export const GetCampaignResponse = S.suspend(() =>
  S.Struct({
    CampaignResponse: S.optional(CampaignResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignResponse" }),
  }),
).annotations({
  identifier: "GetCampaignResponse",
}) as any as S.Schema<GetCampaignResponse>;
export interface GetCampaignVersionResponse {
  CampaignResponse: CampaignResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    SegmentId: string;
    SegmentVersion: number;
    AdditionalTreatments: (TreatmentResource & {
      Id: string;
      SizePercent: number;
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
    CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
      DeliveryUri: string;
    };
    MessageConfiguration: MessageConfiguration & {
      InAppMessage: CampaignInAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
    };
    Schedule: Schedule & {
      StartTime: string;
      EventFilter: CampaignEventFilter & {
        Dimensions: EventDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          EventType: SetDimension & { Values: ListOf__string };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
        };
        FilterType: FilterType;
      };
    };
  };
}
export const GetCampaignVersionResponse = S.suspend(() =>
  S.Struct({
    CampaignResponse: S.optional(CampaignResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignResponse" }),
  }),
).annotations({
  identifier: "GetCampaignVersionResponse",
}) as any as S.Schema<GetCampaignVersionResponse>;
export type ListOfCampaignResponse = CampaignResponse[];
export const ListOfCampaignResponse = S.Array(CampaignResponse);
export interface CampaignsResponse {
  Item?: CampaignResponse[];
  NextToken?: string;
}
export const CampaignsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfCampaignResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "CampaignsResponse",
}) as any as S.Schema<CampaignsResponse>;
export interface GetCampaignVersionsResponse {
  CampaignsResponse: CampaignsResponse & {
    Item: (CampaignResponse & {
      ApplicationId: string;
      Arn: string;
      CreationDate: string;
      Id: string;
      LastModifiedDate: string;
      SegmentId: string;
      SegmentVersion: number;
      AdditionalTreatments: (TreatmentResource & {
        Id: string;
        SizePercent: number;
        CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
          DeliveryUri: string;
        };
        MessageConfiguration: MessageConfiguration & {
          InAppMessage: CampaignInAppMessage & {
            Content: (InAppMessageContent & {
              BodyConfig: InAppMessageBodyConfig & {
                Alignment: Alignment;
                Body: string;
                TextColor: string;
              };
              HeaderConfig: InAppMessageHeaderConfig & {
                Alignment: Alignment;
                Header: string;
                TextColor: string;
              };
              PrimaryBtn: InAppMessageButton & {
                Android: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                DefaultConfig: DefaultButtonConfiguration & {
                  ButtonAction: ButtonAction;
                  Text: string;
                };
                IOS: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                Web: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
              };
              SecondaryBtn: InAppMessageButton & {
                Android: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                DefaultConfig: DefaultButtonConfiguration & {
                  ButtonAction: ButtonAction;
                  Text: string;
                };
                IOS: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                Web: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
              };
            })[];
          };
        };
        Schedule: Schedule & {
          StartTime: string;
          EventFilter: CampaignEventFilter & {
            Dimensions: EventDimensions & {
              Attributes: {
                [key: string]: AttributeDimension & { Values: ListOf__string };
              };
              EventType: SetDimension & { Values: ListOf__string };
              Metrics: {
                [key: string]: MetricDimension & {
                  ComparisonOperator: string;
                  Value: number;
                };
              };
            };
            FilterType: FilterType;
          };
        };
      })[];
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
  };
}
export const GetCampaignVersionsResponse = S.suspend(() =>
  S.Struct({
    CampaignsResponse: S.optional(CampaignsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignsResponse" }),
  }),
).annotations({
  identifier: "GetCampaignVersionsResponse",
}) as any as S.Schema<GetCampaignVersionsResponse>;
export interface EmailChannelResponse {
  ApplicationId?: string;
  ConfigurationSet?: string;
  CreationDate?: string;
  Enabled?: boolean;
  FromAddress?: string;
  HasCredential?: boolean;
  Id?: string;
  Identity?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  MessagesPerSecond?: number;
  Platform?: string;
  RoleArn?: string;
  OrchestrationSendingRoleArn?: string;
  Version?: number;
}
export const EmailChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    RoleArn: S.optional(S.String),
    OrchestrationSendingRoleArn: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "EmailChannelResponse",
}) as any as S.Schema<EmailChannelResponse>;
export interface GetEmailChannelResponse {
  EmailChannelResponse: EmailChannelResponse & { Platform: string };
}
export const GetEmailChannelResponse = S.suspend(() =>
  S.Struct({
    EmailChannelResponse: S.optional(EmailChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailChannelResponse" }),
  }),
).annotations({
  identifier: "GetEmailChannelResponse",
}) as any as S.Schema<GetEmailChannelResponse>;
export interface EndpointDemographic {
  AppVersion?: string;
  Locale?: string;
  Make?: string;
  Model?: string;
  ModelVersion?: string;
  Platform?: string;
  PlatformVersion?: string;
  Timezone?: string;
}
export const EndpointDemographic = S.suspend(() =>
  S.Struct({
    AppVersion: S.optional(S.String),
    Locale: S.optional(S.String),
    Make: S.optional(S.String),
    Model: S.optional(S.String),
    ModelVersion: S.optional(S.String),
    Platform: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    Timezone: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointDemographic",
}) as any as S.Schema<EndpointDemographic>;
export interface EndpointLocation {
  City?: string;
  Country?: string;
  Latitude?: number;
  Longitude?: number;
  PostalCode?: string;
  Region?: string;
}
export const EndpointLocation = S.suspend(() =>
  S.Struct({
    City: S.optional(S.String),
    Country: S.optional(S.String),
    Latitude: S.optional(S.Number),
    Longitude: S.optional(S.Number),
    PostalCode: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointLocation",
}) as any as S.Schema<EndpointLocation>;
export type MapOf__double = { [key: string]: number };
export const MapOf__double = S.Record({ key: S.String, value: S.Number });
export interface EndpointUser {
  UserAttributes?: { [key: string]: string[] };
  UserId?: string;
}
export const EndpointUser = S.suspend(() =>
  S.Struct({
    UserAttributes: S.optional(MapOfListOf__string),
    UserId: S.optional(S.String),
  }),
).annotations({ identifier: "EndpointUser" }) as any as S.Schema<EndpointUser>;
export interface EndpointResponse {
  Address?: string;
  ApplicationId?: string;
  Attributes?: { [key: string]: string[] };
  ChannelType?: ChannelType;
  CohortId?: string;
  CreationDate?: string;
  Demographic?: EndpointDemographic;
  EffectiveDate?: string;
  EndpointStatus?: string;
  Id?: string;
  Location?: EndpointLocation;
  Metrics?: { [key: string]: number };
  OptOut?: string;
  RequestId?: string;
  User?: EndpointUser;
}
export const EndpointResponse = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    Attributes: S.optional(MapOfListOf__string),
    ChannelType: S.optional(ChannelType),
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
  }),
).annotations({
  identifier: "EndpointResponse",
}) as any as S.Schema<EndpointResponse>;
export interface GetEndpointResponse {
  EndpointResponse: EndpointResponse;
}
export const GetEndpointResponse = S.suspend(() =>
  S.Struct({
    EndpointResponse: S.optional(EndpointResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointResponse" }),
  }),
).annotations({
  identifier: "GetEndpointResponse",
}) as any as S.Schema<GetEndpointResponse>;
export interface EventStream {
  ApplicationId?: string;
  DestinationStreamArn?: string;
  ExternalId?: string;
  LastModifiedDate?: string;
  LastUpdatedBy?: string;
  RoleArn?: string;
}
export const EventStream = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    DestinationStreamArn: S.optional(S.String),
    ExternalId: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    LastUpdatedBy: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "EventStream" }) as any as S.Schema<EventStream>;
export interface GetEventStreamResponse {
  EventStream: EventStream & {
    ApplicationId: string;
    DestinationStreamArn: string;
    RoleArn: string;
  };
}
export const GetEventStreamResponse = S.suspend(() =>
  S.Struct({
    EventStream: S.optional(EventStream)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EventStream" }),
  }),
).annotations({
  identifier: "GetEventStreamResponse",
}) as any as S.Schema<GetEventStreamResponse>;
export interface GCMChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Credential?: string;
  DefaultAuthenticationMethod?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  HasFcmServiceCredentials?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const GCMChannelResponse = S.suspend(() =>
  S.Struct({
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
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "GCMChannelResponse",
}) as any as S.Schema<GCMChannelResponse>;
export interface GetGcmChannelResponse {
  GCMChannelResponse: GCMChannelResponse & { Platform: string };
}
export const GetGcmChannelResponse = S.suspend(() =>
  S.Struct({
    GCMChannelResponse: S.optional(GCMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GCMChannelResponse" }),
  }),
).annotations({
  identifier: "GetGcmChannelResponse",
}) as any as S.Schema<GetGcmChannelResponse>;
export interface JourneyResponse {
  Activities?: { [key: string]: Activity };
  ApplicationId?: string;
  CreationDate?: string;
  Id?: string;
  LastModifiedDate?: string;
  Limits?: JourneyLimits;
  LocalTime?: boolean;
  Name?: string;
  QuietTime?: QuietTime;
  RefreshFrequency?: string;
  Schedule?: JourneySchedule;
  StartActivity?: string;
  StartCondition?: StartCondition;
  State?: State;
  tags?: { [key: string]: string };
  WaitForQuietTime?: boolean;
  RefreshOnSegmentUpdate?: boolean;
  JourneyChannelSettings?: JourneyChannelSettings;
  SendingSchedule?: boolean;
  OpenHours?: OpenHours;
  ClosedDays?: ClosedDays;
  TimezoneEstimationMethods?: __TimezoneEstimationMethodsElement[];
}
export const JourneyResponse = S.suspend(() =>
  S.Struct({
    Activities: S.optional(MapOfActivity),
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Id: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Limits: S.optional(JourneyLimits),
    LocalTime: S.optional(S.Boolean),
    Name: S.optional(S.String),
    QuietTime: S.optional(QuietTime),
    RefreshFrequency: S.optional(S.String),
    Schedule: S.optional(JourneySchedule),
    StartActivity: S.optional(S.String),
    StartCondition: S.optional(StartCondition),
    State: S.optional(State),
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
  }),
).annotations({
  identifier: "JourneyResponse",
}) as any as S.Schema<JourneyResponse>;
export interface GetJourneyResponse {
  JourneyResponse: JourneyResponse & {
    ApplicationId: string;
    Id: string;
    Name: string;
    Activities: {
      [key: string]: Activity & {
        ConditionalSplit: ConditionalSplitActivity & {
          Condition: Condition & {
            Conditions: (SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            })[];
          };
        };
        Holdout: HoldoutActivity & { Percentage: number };
        MultiCondition: MultiConditionalSplitActivity & {
          Branches: (MultiConditionalBranch & {
            Condition: SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            };
          })[];
        };
      };
    };
    StartCondition: StartCondition & {
      EventStartCondition: EventStartCondition & {
        EventFilter: EventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
      SegmentStartCondition: SegmentCondition & { SegmentId: string };
    };
  };
}
export const GetJourneyResponse = S.suspend(() =>
  S.Struct({
    JourneyResponse: S.optional(JourneyResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyResponse" }),
  }),
).annotations({
  identifier: "GetJourneyResponse",
}) as any as S.Schema<GetJourneyResponse>;
export interface RecommenderConfigurationResponse {
  Attributes?: { [key: string]: string };
  CreationDate?: string;
  Description?: string;
  Id?: string;
  LastModifiedDate?: string;
  Name?: string;
  RecommendationProviderIdType?: string;
  RecommendationProviderRoleArn?: string;
  RecommendationProviderUri?: string;
  RecommendationTransformerUri?: string;
  RecommendationsDisplayName?: string;
  RecommendationsPerMessage?: number;
}
export const RecommenderConfigurationResponse = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(MapOf__string),
    CreationDate: S.optional(S.String),
    Description: S.optional(S.String),
    Id: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Name: S.optional(S.String),
    RecommendationProviderIdType: S.optional(S.String),
    RecommendationProviderRoleArn: S.optional(S.String),
    RecommendationProviderUri: S.optional(S.String),
    RecommendationTransformerUri: S.optional(S.String),
    RecommendationsDisplayName: S.optional(S.String),
    RecommendationsPerMessage: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecommenderConfigurationResponse",
}) as any as S.Schema<RecommenderConfigurationResponse>;
export interface GetRecommenderConfigurationResponse {
  RecommenderConfigurationResponse: RecommenderConfigurationResponse & {
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    RecommendationProviderRoleArn: string;
    RecommendationProviderUri: string;
  };
}
export const GetRecommenderConfigurationResponse = S.suspend(() =>
  S.Struct({
    RecommenderConfigurationResponse: S.optional(
      RecommenderConfigurationResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "RecommenderConfigurationResponse" }),
  }),
).annotations({
  identifier: "GetRecommenderConfigurationResponse",
}) as any as S.Schema<GetRecommenderConfigurationResponse>;
export type MapOf__integer = { [key: string]: number };
export const MapOf__integer = S.Record({ key: S.String, value: S.Number });
export interface SegmentImportResource {
  ChannelCounts?: { [key: string]: number };
  ExternalId?: string;
  Format?: Format;
  RoleArn?: string;
  S3Url?: string;
  Size?: number;
}
export const SegmentImportResource = S.suspend(() =>
  S.Struct({
    ChannelCounts: S.optional(MapOf__integer),
    ExternalId: S.optional(S.String),
    Format: S.optional(Format),
    RoleArn: S.optional(S.String),
    S3Url: S.optional(S.String),
    Size: S.optional(S.Number),
  }),
).annotations({
  identifier: "SegmentImportResource",
}) as any as S.Schema<SegmentImportResource>;
export type SegmentType = "DIMENSIONAL" | "IMPORT";
export const SegmentType = S.Literal("DIMENSIONAL", "IMPORT");
export interface SegmentResponse {
  ApplicationId?: string;
  Arn?: string;
  CreationDate?: string;
  Dimensions?: SegmentDimensions;
  Id?: string;
  ImportDefinition?: SegmentImportResource;
  LastModifiedDate?: string;
  Name?: string;
  SegmentGroups?: SegmentGroupList;
  SegmentType?: SegmentType;
  tags?: { [key: string]: string };
  Version?: number;
}
export const SegmentResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    Arn: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Dimensions: S.optional(SegmentDimensions),
    Id: S.optional(S.String),
    ImportDefinition: S.optional(SegmentImportResource),
    LastModifiedDate: S.optional(S.String),
    Name: S.optional(S.String),
    SegmentGroups: S.optional(SegmentGroupList),
    SegmentType: S.optional(SegmentType),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "SegmentResponse",
}) as any as S.Schema<SegmentResponse>;
export interface GetSegmentResponse {
  SegmentResponse: SegmentResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    SegmentType: SegmentType;
    Dimensions: SegmentDimensions & {
      Attributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
      Behavior: SegmentBehaviors & {
        Recency: RecencyDimension & {
          Duration: Duration;
          RecencyType: RecencyType;
        };
      };
      Demographic: SegmentDemographics & {
        AppVersion: SetDimension & { Values: ListOf__string };
        Channel: SetDimension & { Values: ListOf__string };
        DeviceType: SetDimension & { Values: ListOf__string };
        Make: SetDimension & { Values: ListOf__string };
        Model: SetDimension & { Values: ListOf__string };
        Platform: SetDimension & { Values: ListOf__string };
      };
      Location: SegmentLocation & {
        Country: SetDimension & { Values: ListOf__string };
        GPSPoint: GPSPointDimension & {
          Coordinates: GPSCoordinates & { Latitude: number; Longitude: number };
        };
      };
      Metrics: {
        [key: string]: MetricDimension & {
          ComparisonOperator: string;
          Value: number;
        };
      };
      UserAttributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
    };
    ImportDefinition: SegmentImportResource & {
      ExternalId: string;
      Format: Format;
      RoleArn: string;
      S3Url: string;
      Size: number;
    };
    SegmentGroups: SegmentGroupList & {
      Groups: (SegmentGroup & {
        Dimensions: (SegmentDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          Behavior: SegmentBehaviors & {
            Recency: RecencyDimension & {
              Duration: Duration;
              RecencyType: RecencyType;
            };
          };
          Demographic: SegmentDemographics & {
            AppVersion: SetDimension & { Values: ListOf__string };
            Channel: SetDimension & { Values: ListOf__string };
            DeviceType: SetDimension & { Values: ListOf__string };
            Make: SetDimension & { Values: ListOf__string };
            Model: SetDimension & { Values: ListOf__string };
            Platform: SetDimension & { Values: ListOf__string };
          };
          Location: SegmentLocation & {
            Country: SetDimension & { Values: ListOf__string };
            GPSPoint: GPSPointDimension & {
              Coordinates: GPSCoordinates & {
                Latitude: number;
                Longitude: number;
              };
            };
          };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
          UserAttributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
        })[];
        SourceSegments: (SegmentReference & { Id: string })[];
      })[];
    };
  };
}
export const GetSegmentResponse = S.suspend(() =>
  S.Struct({
    SegmentResponse: S.optional(SegmentResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentResponse" }),
  }),
).annotations({
  identifier: "GetSegmentResponse",
}) as any as S.Schema<GetSegmentResponse>;
export interface ExportJobResource {
  RoleArn?: string;
  S3UrlPrefix?: string;
  SegmentId?: string;
  SegmentVersion?: number;
}
export const ExportJobResource = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    S3UrlPrefix: S.optional(S.String),
    SegmentId: S.optional(S.String),
    SegmentVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExportJobResource",
}) as any as S.Schema<ExportJobResource>;
export type JobStatus =
  | "CREATED"
  | "PREPARING_FOR_INITIALIZATION"
  | "INITIALIZING"
  | "PROCESSING"
  | "PENDING_JOB"
  | "COMPLETING"
  | "COMPLETED"
  | "FAILING"
  | "FAILED";
export const JobStatus = S.Literal(
  "CREATED",
  "PREPARING_FOR_INITIALIZATION",
  "INITIALIZING",
  "PROCESSING",
  "PENDING_JOB",
  "COMPLETING",
  "COMPLETED",
  "FAILING",
  "FAILED",
);
export interface ExportJobResponse {
  ApplicationId?: string;
  CompletedPieces?: number;
  CompletionDate?: string;
  CreationDate?: string;
  Definition?: ExportJobResource;
  FailedPieces?: number;
  Failures?: string[];
  Id?: string;
  JobStatus?: JobStatus;
  TotalFailures?: number;
  TotalPieces?: number;
  TotalProcessed?: number;
  Type?: string;
}
export const ExportJobResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CompletedPieces: S.optional(S.Number),
    CompletionDate: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Definition: S.optional(ExportJobResource),
    FailedPieces: S.optional(S.Number),
    Failures: S.optional(ListOf__string),
    Id: S.optional(S.String),
    JobStatus: S.optional(JobStatus),
    TotalFailures: S.optional(S.Number),
    TotalPieces: S.optional(S.Number),
    TotalProcessed: S.optional(S.Number),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportJobResponse",
}) as any as S.Schema<ExportJobResponse>;
export type ListOfExportJobResponse = ExportJobResponse[];
export const ListOfExportJobResponse = S.Array(ExportJobResponse);
export interface ExportJobsResponse {
  Item?: ExportJobResponse[];
  NextToken?: string;
}
export const ExportJobsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfExportJobResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportJobsResponse",
}) as any as S.Schema<ExportJobsResponse>;
export interface GetSegmentExportJobsResponse {
  ExportJobsResponse: ExportJobsResponse & {
    Item: (ExportJobResponse & {
      ApplicationId: string;
      CreationDate: string;
      Definition: ExportJobResource & { RoleArn: string; S3UrlPrefix: string };
      Id: string;
      JobStatus: JobStatus;
      Type: string;
    })[];
  };
}
export const GetSegmentExportJobsResponse = S.suspend(() =>
  S.Struct({
    ExportJobsResponse: S.optional(ExportJobsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ExportJobsResponse" }),
  }),
).annotations({
  identifier: "GetSegmentExportJobsResponse",
}) as any as S.Schema<GetSegmentExportJobsResponse>;
export interface ImportJobResource {
  DefineSegment?: boolean;
  ExternalId?: string;
  Format?: Format;
  RegisterEndpoints?: boolean;
  RoleArn?: string;
  S3Url?: string;
  SegmentId?: string;
  SegmentName?: string;
}
export const ImportJobResource = S.suspend(() =>
  S.Struct({
    DefineSegment: S.optional(S.Boolean),
    ExternalId: S.optional(S.String),
    Format: S.optional(Format),
    RegisterEndpoints: S.optional(S.Boolean),
    RoleArn: S.optional(S.String),
    S3Url: S.optional(S.String),
    SegmentId: S.optional(S.String),
    SegmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportJobResource",
}) as any as S.Schema<ImportJobResource>;
export interface ImportJobResponse {
  ApplicationId?: string;
  CompletedPieces?: number;
  CompletionDate?: string;
  CreationDate?: string;
  Definition?: ImportJobResource;
  FailedPieces?: number;
  Failures?: string[];
  Id?: string;
  JobStatus?: JobStatus;
  TotalFailures?: number;
  TotalPieces?: number;
  TotalProcessed?: number;
  Type?: string;
}
export const ImportJobResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CompletedPieces: S.optional(S.Number),
    CompletionDate: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Definition: S.optional(ImportJobResource),
    FailedPieces: S.optional(S.Number),
    Failures: S.optional(ListOf__string),
    Id: S.optional(S.String),
    JobStatus: S.optional(JobStatus),
    TotalFailures: S.optional(S.Number),
    TotalPieces: S.optional(S.Number),
    TotalProcessed: S.optional(S.Number),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportJobResponse",
}) as any as S.Schema<ImportJobResponse>;
export type ListOfImportJobResponse = ImportJobResponse[];
export const ListOfImportJobResponse = S.Array(ImportJobResponse);
export interface ImportJobsResponse {
  Item?: ImportJobResponse[];
  NextToken?: string;
}
export const ImportJobsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfImportJobResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportJobsResponse",
}) as any as S.Schema<ImportJobsResponse>;
export interface GetSegmentImportJobsResponse {
  ImportJobsResponse: ImportJobsResponse & {
    Item: (ImportJobResponse & {
      ApplicationId: string;
      CreationDate: string;
      Definition: ImportJobResource & {
        Format: Format;
        RoleArn: string;
        S3Url: string;
      };
      Id: string;
      JobStatus: JobStatus;
      Type: string;
    })[];
  };
}
export const GetSegmentImportJobsResponse = S.suspend(() =>
  S.Struct({
    ImportJobsResponse: S.optional(ImportJobsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ImportJobsResponse" }),
  }),
).annotations({
  identifier: "GetSegmentImportJobsResponse",
}) as any as S.Schema<GetSegmentImportJobsResponse>;
export interface GetSegmentVersionResponse {
  SegmentResponse: SegmentResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    SegmentType: SegmentType;
    Dimensions: SegmentDimensions & {
      Attributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
      Behavior: SegmentBehaviors & {
        Recency: RecencyDimension & {
          Duration: Duration;
          RecencyType: RecencyType;
        };
      };
      Demographic: SegmentDemographics & {
        AppVersion: SetDimension & { Values: ListOf__string };
        Channel: SetDimension & { Values: ListOf__string };
        DeviceType: SetDimension & { Values: ListOf__string };
        Make: SetDimension & { Values: ListOf__string };
        Model: SetDimension & { Values: ListOf__string };
        Platform: SetDimension & { Values: ListOf__string };
      };
      Location: SegmentLocation & {
        Country: SetDimension & { Values: ListOf__string };
        GPSPoint: GPSPointDimension & {
          Coordinates: GPSCoordinates & { Latitude: number; Longitude: number };
        };
      };
      Metrics: {
        [key: string]: MetricDimension & {
          ComparisonOperator: string;
          Value: number;
        };
      };
      UserAttributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
    };
    ImportDefinition: SegmentImportResource & {
      ExternalId: string;
      Format: Format;
      RoleArn: string;
      S3Url: string;
      Size: number;
    };
    SegmentGroups: SegmentGroupList & {
      Groups: (SegmentGroup & {
        Dimensions: (SegmentDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          Behavior: SegmentBehaviors & {
            Recency: RecencyDimension & {
              Duration: Duration;
              RecencyType: RecencyType;
            };
          };
          Demographic: SegmentDemographics & {
            AppVersion: SetDimension & { Values: ListOf__string };
            Channel: SetDimension & { Values: ListOf__string };
            DeviceType: SetDimension & { Values: ListOf__string };
            Make: SetDimension & { Values: ListOf__string };
            Model: SetDimension & { Values: ListOf__string };
            Platform: SetDimension & { Values: ListOf__string };
          };
          Location: SegmentLocation & {
            Country: SetDimension & { Values: ListOf__string };
            GPSPoint: GPSPointDimension & {
              Coordinates: GPSCoordinates & {
                Latitude: number;
                Longitude: number;
              };
            };
          };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
          UserAttributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
        })[];
        SourceSegments: (SegmentReference & { Id: string })[];
      })[];
    };
  };
}
export const GetSegmentVersionResponse = S.suspend(() =>
  S.Struct({
    SegmentResponse: S.optional(SegmentResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentResponse" }),
  }),
).annotations({
  identifier: "GetSegmentVersionResponse",
}) as any as S.Schema<GetSegmentVersionResponse>;
export type ListOfSegmentResponse = SegmentResponse[];
export const ListOfSegmentResponse = S.Array(SegmentResponse);
export interface SegmentsResponse {
  Item?: SegmentResponse[];
  NextToken?: string;
}
export const SegmentsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfSegmentResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SegmentsResponse",
}) as any as S.Schema<SegmentsResponse>;
export interface GetSegmentVersionsResponse {
  SegmentsResponse: SegmentsResponse & {
    Item: (SegmentResponse & {
      ApplicationId: string;
      Arn: string;
      CreationDate: string;
      Id: string;
      SegmentType: SegmentType;
      Dimensions: SegmentDimensions & {
        Attributes: {
          [key: string]: AttributeDimension & { Values: ListOf__string };
        };
        Behavior: SegmentBehaviors & {
          Recency: RecencyDimension & {
            Duration: Duration;
            RecencyType: RecencyType;
          };
        };
        Demographic: SegmentDemographics & {
          AppVersion: SetDimension & { Values: ListOf__string };
          Channel: SetDimension & { Values: ListOf__string };
          DeviceType: SetDimension & { Values: ListOf__string };
          Make: SetDimension & { Values: ListOf__string };
          Model: SetDimension & { Values: ListOf__string };
          Platform: SetDimension & { Values: ListOf__string };
        };
        Location: SegmentLocation & {
          Country: SetDimension & { Values: ListOf__string };
          GPSPoint: GPSPointDimension & {
            Coordinates: GPSCoordinates & {
              Latitude: number;
              Longitude: number;
            };
          };
        };
        Metrics: {
          [key: string]: MetricDimension & {
            ComparisonOperator: string;
            Value: number;
          };
        };
        UserAttributes: {
          [key: string]: AttributeDimension & { Values: ListOf__string };
        };
      };
      ImportDefinition: SegmentImportResource & {
        ExternalId: string;
        Format: Format;
        RoleArn: string;
        S3Url: string;
        Size: number;
      };
      SegmentGroups: SegmentGroupList & {
        Groups: (SegmentGroup & {
          Dimensions: (SegmentDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            Behavior: SegmentBehaviors & {
              Recency: RecencyDimension & {
                Duration: Duration;
                RecencyType: RecencyType;
              };
            };
            Demographic: SegmentDemographics & {
              AppVersion: SetDimension & { Values: ListOf__string };
              Channel: SetDimension & { Values: ListOf__string };
              DeviceType: SetDimension & { Values: ListOf__string };
              Make: SetDimension & { Values: ListOf__string };
              Model: SetDimension & { Values: ListOf__string };
              Platform: SetDimension & { Values: ListOf__string };
            };
            Location: SegmentLocation & {
              Country: SetDimension & { Values: ListOf__string };
              GPSPoint: GPSPointDimension & {
                Coordinates: GPSCoordinates & {
                  Latitude: number;
                  Longitude: number;
                };
              };
            };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
            UserAttributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
          })[];
          SourceSegments: (SegmentReference & { Id: string })[];
        })[];
      };
    })[];
  };
}
export const GetSegmentVersionsResponse = S.suspend(() =>
  S.Struct({
    SegmentsResponse: S.optional(SegmentsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentsResponse" }),
  }),
).annotations({
  identifier: "GetSegmentVersionsResponse",
}) as any as S.Schema<GetSegmentVersionsResponse>;
export interface SMSChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  PromotionalMessagesPerSecond?: number;
  SenderId?: string;
  ShortCode?: string;
  TransactionalMessagesPerSecond?: number;
  Version?: number;
}
export const SMSChannelResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    HasCredential: S.optional(S.Boolean),
    Id: S.optional(S.String),
    IsArchived: S.optional(S.Boolean),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Platform: S.optional(S.String),
    PromotionalMessagesPerSecond: S.optional(S.Number),
    SenderId: S.optional(S.String),
    ShortCode: S.optional(S.String),
    TransactionalMessagesPerSecond: S.optional(S.Number),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "SMSChannelResponse",
}) as any as S.Schema<SMSChannelResponse>;
export interface GetSmsChannelResponse {
  SMSChannelResponse: SMSChannelResponse & { Platform: string };
}
export const GetSmsChannelResponse = S.suspend(() =>
  S.Struct({
    SMSChannelResponse: S.optional(SMSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSChannelResponse" }),
  }),
).annotations({
  identifier: "GetSmsChannelResponse",
}) as any as S.Schema<GetSmsChannelResponse>;
export type ListOfEndpointResponse = EndpointResponse[];
export const ListOfEndpointResponse = S.Array(EndpointResponse);
export interface EndpointsResponse {
  Item?: EndpointResponse[];
}
export const EndpointsResponse = S.suspend(() =>
  S.Struct({ Item: S.optional(ListOfEndpointResponse) }),
).annotations({
  identifier: "EndpointsResponse",
}) as any as S.Schema<EndpointsResponse>;
export interface GetUserEndpointsResponse {
  EndpointsResponse: EndpointsResponse & { Item: ListOfEndpointResponse };
}
export const GetUserEndpointsResponse = S.suspend(() =>
  S.Struct({
    EndpointsResponse: S.optional(EndpointsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointsResponse" }),
  }),
).annotations({
  identifier: "GetUserEndpointsResponse",
}) as any as S.Schema<GetUserEndpointsResponse>;
export interface VoiceChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Platform?: string;
  Version?: number;
}
export const VoiceChannelResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    HasCredential: S.optional(S.Boolean),
    Id: S.optional(S.String),
    IsArchived: S.optional(S.Boolean),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Platform: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "VoiceChannelResponse",
}) as any as S.Schema<VoiceChannelResponse>;
export interface GetVoiceChannelResponse {
  VoiceChannelResponse: VoiceChannelResponse & { Platform: string };
}
export const GetVoiceChannelResponse = S.suspend(() =>
  S.Struct({
    VoiceChannelResponse: S.optional(VoiceChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceChannelResponse" }),
  }),
).annotations({
  identifier: "GetVoiceChannelResponse",
}) as any as S.Schema<GetVoiceChannelResponse>;
export interface ListTagsForResourceResponse {
  TagsModel: TagsModel & { tags: MapOf__string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    TagsModel: S.optional(TagsModel)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TagsModel" }),
  }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PhoneNumberValidateRequest {
  NumberValidateRequest?: NumberValidateRequest;
}
export const PhoneNumberValidateRequest = S.suspend(() =>
  S.Struct({
    NumberValidateRequest: S.optional(NumberValidateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "NumberValidateRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/phone/number/validate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PhoneNumberValidateRequest",
}) as any as S.Schema<PhoneNumberValidateRequest>;
export interface PutEventStreamRequest {
  ApplicationId: string;
  WriteEventStream?: WriteEventStream;
}
export const PutEventStreamRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    WriteEventStream: S.optional(WriteEventStream)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteEventStream" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/eventstream" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventStreamRequest",
}) as any as S.Schema<PutEventStreamRequest>;
export interface RemoveAttributesRequest {
  ApplicationId: string;
  AttributeType: string;
  UpdateAttributesRequest?: UpdateAttributesRequest;
}
export const RemoveAttributesRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    AttributeType: S.String.pipe(T.HttpLabel("AttributeType")),
    UpdateAttributesRequest: S.optional(UpdateAttributesRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "UpdateAttributesRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "RemoveAttributesRequest",
}) as any as S.Schema<RemoveAttributesRequest>;
export interface SendOTPMessageRequest {
  ApplicationId: string;
  SendOTPMessageRequestParameters?: SendOTPMessageRequestParameters;
}
export const SendOTPMessageRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SendOTPMessageRequestParameters: S.optional(SendOTPMessageRequestParameters)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SendOTPMessageRequestParameters" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/otp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendOTPMessageRequest",
}) as any as S.Schema<SendOTPMessageRequest>;
export interface SendUsersMessagesRequest {
  ApplicationId: string;
  SendUsersMessageRequest?: SendUsersMessageRequest;
}
export const SendUsersMessagesRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SendUsersMessageRequest: S.optional(SendUsersMessageRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SendUsersMessageRequest" }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/apps/{ApplicationId}/users-messages",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendUsersMessagesRequest",
}) as any as S.Schema<SendUsersMessagesRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  TagsModel?: TagsModel;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagsModel: S.optional(TagsModel)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TagsModel" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{ResourceArn}" }),
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
export interface UpdateAdmChannelRequest {
  ADMChannelRequest?: ADMChannelRequest;
  ApplicationId: string;
}
export const UpdateAdmChannelRequest = S.suspend(() =>
  S.Struct({
    ADMChannelRequest: S.optional(ADMChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ADMChannelRequest" }),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/adm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAdmChannelRequest",
}) as any as S.Schema<UpdateAdmChannelRequest>;
export interface UpdateApnsChannelRequest {
  APNSChannelRequest?: APNSChannelRequest;
  ApplicationId: string;
}
export const UpdateApnsChannelRequest = S.suspend(() =>
  S.Struct({
    APNSChannelRequest: S.optional(APNSChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSChannelRequest" }),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/apns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApnsChannelRequest",
}) as any as S.Schema<UpdateApnsChannelRequest>;
export interface UpdateApnsSandboxChannelRequest {
  APNSSandboxChannelRequest?: APNSSandboxChannelRequest;
  ApplicationId: string;
}
export const UpdateApnsSandboxChannelRequest = S.suspend(() =>
  S.Struct({
    APNSSandboxChannelRequest: S.optional(APNSSandboxChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSSandboxChannelRequest" }),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateApnsSandboxChannelRequest",
}) as any as S.Schema<UpdateApnsSandboxChannelRequest>;
export interface UpdateApnsVoipChannelRequest {
  APNSVoipChannelRequest?: APNSVoipChannelRequest;
  ApplicationId: string;
}
export const UpdateApnsVoipChannelRequest = S.suspend(() =>
  S.Struct({
    APNSVoipChannelRequest: S.optional(APNSVoipChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipChannelRequest" }),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateApnsVoipChannelRequest",
}) as any as S.Schema<UpdateApnsVoipChannelRequest>;
export interface UpdateApnsVoipSandboxChannelRequest {
  APNSVoipSandboxChannelRequest?: APNSVoipSandboxChannelRequest;
  ApplicationId: string;
}
export const UpdateApnsVoipSandboxChannelRequest = S.suspend(() =>
  S.Struct({
    APNSVoipSandboxChannelRequest: S.optional(APNSVoipSandboxChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipSandboxChannelRequest" }),
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateApnsVoipSandboxChannelRequest",
}) as any as S.Schema<UpdateApnsVoipSandboxChannelRequest>;
export interface UpdateBaiduChannelRequest {
  ApplicationId: string;
  BaiduChannelRequest?: BaiduChannelRequest;
}
export const UpdateBaiduChannelRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    BaiduChannelRequest: S.optional(BaiduChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "BaiduChannelRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/baidu" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBaiduChannelRequest",
}) as any as S.Schema<UpdateBaiduChannelRequest>;
export interface UpdateCampaignResponse {
  CampaignResponse: CampaignResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    SegmentId: string;
    SegmentVersion: number;
    AdditionalTreatments: (TreatmentResource & {
      Id: string;
      SizePercent: number;
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
    CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
      DeliveryUri: string;
    };
    MessageConfiguration: MessageConfiguration & {
      InAppMessage: CampaignInAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
    };
    Schedule: Schedule & {
      StartTime: string;
      EventFilter: CampaignEventFilter & {
        Dimensions: EventDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          EventType: SetDimension & { Values: ListOf__string };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
        };
        FilterType: FilterType;
      };
    };
  };
}
export const UpdateCampaignResponse = S.suspend(() =>
  S.Struct({
    CampaignResponse: S.optional(CampaignResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignResponse" }),
  }),
).annotations({
  identifier: "UpdateCampaignResponse",
}) as any as S.Schema<UpdateCampaignResponse>;
export interface UpdateEmailChannelRequest {
  ApplicationId: string;
  EmailChannelRequest?: EmailChannelRequest;
}
export const UpdateEmailChannelRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EmailChannelRequest: S.optional(EmailChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailChannelRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEmailChannelRequest",
}) as any as S.Schema<UpdateEmailChannelRequest>;
export interface UpdateEmailTemplateResponse {
  MessageBody: MessageBody;
}
export const UpdateEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateEmailTemplateResponse",
}) as any as S.Schema<UpdateEmailTemplateResponse>;
export interface UpdateGcmChannelRequest {
  ApplicationId: string;
  GCMChannelRequest?: GCMChannelRequest;
}
export const UpdateGcmChannelRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    GCMChannelRequest: S.optional(GCMChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GCMChannelRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/gcm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGcmChannelRequest",
}) as any as S.Schema<UpdateGcmChannelRequest>;
export interface UpdateInAppTemplateResponse {
  MessageBody: MessageBody;
}
export const UpdateInAppTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateInAppTemplateResponse",
}) as any as S.Schema<UpdateInAppTemplateResponse>;
export interface UpdateJourneyResponse {
  JourneyResponse: JourneyResponse & {
    ApplicationId: string;
    Id: string;
    Name: string;
    Activities: {
      [key: string]: Activity & {
        ConditionalSplit: ConditionalSplitActivity & {
          Condition: Condition & {
            Conditions: (SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            })[];
          };
        };
        Holdout: HoldoutActivity & { Percentage: number };
        MultiCondition: MultiConditionalSplitActivity & {
          Branches: (MultiConditionalBranch & {
            Condition: SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            };
          })[];
        };
      };
    };
    StartCondition: StartCondition & {
      EventStartCondition: EventStartCondition & {
        EventFilter: EventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
      SegmentStartCondition: SegmentCondition & { SegmentId: string };
    };
  };
}
export const UpdateJourneyResponse = S.suspend(() =>
  S.Struct({
    JourneyResponse: S.optional(JourneyResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyResponse" }),
  }),
).annotations({
  identifier: "UpdateJourneyResponse",
}) as any as S.Schema<UpdateJourneyResponse>;
export interface UpdateJourneyStateRequest {
  ApplicationId: string;
  JourneyId: string;
  JourneyStateRequest?: JourneyStateRequest;
}
export const UpdateJourneyStateRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    JourneyId: S.String.pipe(T.HttpLabel("JourneyId")),
    JourneyStateRequest: S.optional(JourneyStateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyStateRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateJourneyStateRequest",
}) as any as S.Schema<UpdateJourneyStateRequest>;
export interface UpdatePushTemplateResponse {
  MessageBody: MessageBody;
}
export const UpdatePushTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdatePushTemplateResponse",
}) as any as S.Schema<UpdatePushTemplateResponse>;
export interface UpdateRecommenderConfigurationRequest {
  RecommenderId: string;
  UpdateRecommenderConfiguration?: UpdateRecommenderConfigurationShape;
}
export const UpdateRecommenderConfigurationRequest = S.suspend(() =>
  S.Struct({
    RecommenderId: S.String.pipe(T.HttpLabel("RecommenderId")),
    UpdateRecommenderConfiguration: S.optional(
      UpdateRecommenderConfigurationShape,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "UpdateRecommenderConfigurationShape" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/recommenders/{RecommenderId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRecommenderConfigurationRequest",
}) as any as S.Schema<UpdateRecommenderConfigurationRequest>;
export interface UpdateSegmentResponse {
  SegmentResponse: SegmentResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    SegmentType: SegmentType;
    Dimensions: SegmentDimensions & {
      Attributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
      Behavior: SegmentBehaviors & {
        Recency: RecencyDimension & {
          Duration: Duration;
          RecencyType: RecencyType;
        };
      };
      Demographic: SegmentDemographics & {
        AppVersion: SetDimension & { Values: ListOf__string };
        Channel: SetDimension & { Values: ListOf__string };
        DeviceType: SetDimension & { Values: ListOf__string };
        Make: SetDimension & { Values: ListOf__string };
        Model: SetDimension & { Values: ListOf__string };
        Platform: SetDimension & { Values: ListOf__string };
      };
      Location: SegmentLocation & {
        Country: SetDimension & { Values: ListOf__string };
        GPSPoint: GPSPointDimension & {
          Coordinates: GPSCoordinates & { Latitude: number; Longitude: number };
        };
      };
      Metrics: {
        [key: string]: MetricDimension & {
          ComparisonOperator: string;
          Value: number;
        };
      };
      UserAttributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
    };
    ImportDefinition: SegmentImportResource & {
      ExternalId: string;
      Format: Format;
      RoleArn: string;
      S3Url: string;
      Size: number;
    };
    SegmentGroups: SegmentGroupList & {
      Groups: (SegmentGroup & {
        Dimensions: (SegmentDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          Behavior: SegmentBehaviors & {
            Recency: RecencyDimension & {
              Duration: Duration;
              RecencyType: RecencyType;
            };
          };
          Demographic: SegmentDemographics & {
            AppVersion: SetDimension & { Values: ListOf__string };
            Channel: SetDimension & { Values: ListOf__string };
            DeviceType: SetDimension & { Values: ListOf__string };
            Make: SetDimension & { Values: ListOf__string };
            Model: SetDimension & { Values: ListOf__string };
            Platform: SetDimension & { Values: ListOf__string };
          };
          Location: SegmentLocation & {
            Country: SetDimension & { Values: ListOf__string };
            GPSPoint: GPSPointDimension & {
              Coordinates: GPSCoordinates & {
                Latitude: number;
                Longitude: number;
              };
            };
          };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
          UserAttributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
        })[];
        SourceSegments: (SegmentReference & { Id: string })[];
      })[];
    };
  };
}
export const UpdateSegmentResponse = S.suspend(() =>
  S.Struct({
    SegmentResponse: S.optional(SegmentResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentResponse" }),
  }),
).annotations({
  identifier: "UpdateSegmentResponse",
}) as any as S.Schema<UpdateSegmentResponse>;
export interface UpdateSmsChannelRequest {
  ApplicationId: string;
  SMSChannelRequest?: SMSChannelRequest;
}
export const UpdateSmsChannelRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    SMSChannelRequest: S.optional(SMSChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSChannelRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/sms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSmsChannelRequest",
}) as any as S.Schema<UpdateSmsChannelRequest>;
export interface UpdateSmsTemplateResponse {
  MessageBody: MessageBody;
}
export const UpdateSmsTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateSmsTemplateResponse",
}) as any as S.Schema<UpdateSmsTemplateResponse>;
export interface UpdateTemplateActiveVersionRequest {
  TemplateActiveVersionRequest?: TemplateActiveVersionRequest;
  TemplateName: string;
  TemplateType: string;
}
export const UpdateTemplateActiveVersionRequest = S.suspend(() =>
  S.Struct({
    TemplateActiveVersionRequest: S.optional(TemplateActiveVersionRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TemplateActiveVersionRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    TemplateType: S.String.pipe(T.HttpLabel("TemplateType")),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateTemplateActiveVersionRequest",
}) as any as S.Schema<UpdateTemplateActiveVersionRequest>;
export interface UpdateVoiceChannelRequest {
  ApplicationId: string;
  VoiceChannelRequest?: VoiceChannelRequest;
}
export const UpdateVoiceChannelRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    VoiceChannelRequest: S.optional(VoiceChannelRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceChannelRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/channels/voice" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateVoiceChannelRequest",
}) as any as S.Schema<UpdateVoiceChannelRequest>;
export interface UpdateVoiceTemplateResponse {
  MessageBody: MessageBody;
}
export const UpdateVoiceTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateVoiceTemplateResponse",
}) as any as S.Schema<UpdateVoiceTemplateResponse>;
export interface VerifyOTPMessageRequest {
  ApplicationId: string;
  VerifyOTPMessageRequestParameters?: VerifyOTPMessageRequestParameters;
}
export const VerifyOTPMessageRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    VerifyOTPMessageRequestParameters: S.optional(
      VerifyOTPMessageRequestParameters,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VerifyOTPMessageRequestParameters" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/verify-otp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyOTPMessageRequest",
}) as any as S.Schema<VerifyOTPMessageRequest>;
export type ListOfApplicationResponse = ApplicationResponse[];
export const ListOfApplicationResponse = S.Array(ApplicationResponse);
export type TemplateType = "EMAIL" | "SMS" | "VOICE" | "PUSH" | "INAPP";
export const TemplateType = S.Literal("EMAIL", "SMS", "VOICE", "PUSH", "INAPP");
export type ListOfRecommenderConfigurationResponse =
  RecommenderConfigurationResponse[];
export const ListOfRecommenderConfigurationResponse = S.Array(
  RecommenderConfigurationResponse,
);
export type ListOfJourneyResponse = JourneyResponse[];
export const ListOfJourneyResponse = S.Array(JourneyResponse);
export interface ApplicationSettingsJourneyLimits {
  DailyCap?: number;
  TimeframeCap?: JourneyTimeframeCap;
  TotalCap?: number;
}
export const ApplicationSettingsJourneyLimits = S.suspend(() =>
  S.Struct({
    DailyCap: S.optional(S.Number),
    TimeframeCap: S.optional(JourneyTimeframeCap),
    TotalCap: S.optional(S.Number),
  }),
).annotations({
  identifier: "ApplicationSettingsJourneyLimits",
}) as any as S.Schema<ApplicationSettingsJourneyLimits>;
export interface EndpointBatchItem {
  Address?: string;
  Attributes?: { [key: string]: string[] };
  ChannelType?: ChannelType;
  Demographic?: EndpointDemographic;
  EffectiveDate?: string;
  EndpointStatus?: string;
  Id?: string;
  Location?: EndpointLocation;
  Metrics?: { [key: string]: number };
  OptOut?: string;
  RequestId?: string;
  User?: EndpointUser;
}
export const EndpointBatchItem = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Attributes: S.optional(MapOfListOf__string),
    ChannelType: S.optional(ChannelType),
    Demographic: S.optional(EndpointDemographic),
    EffectiveDate: S.optional(S.String),
    EndpointStatus: S.optional(S.String),
    Id: S.optional(S.String),
    Location: S.optional(EndpointLocation),
    Metrics: S.optional(MapOf__double),
    OptOut: S.optional(S.String),
    RequestId: S.optional(S.String),
    User: S.optional(EndpointUser),
  }),
).annotations({
  identifier: "EndpointBatchItem",
}) as any as S.Schema<EndpointBatchItem>;
export type ListOfEndpointBatchItem = EndpointBatchItem[];
export const ListOfEndpointBatchItem = S.Array(EndpointBatchItem);
export interface CreateApplicationRequest {
  Name?: string;
  tags?: { [key: string]: string };
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface ApplicationSettingsResource {
  ApplicationId?: string;
  CampaignHook?: CampaignHook;
  LastModifiedDate?: string;
  Limits?: CampaignLimits;
  QuietTime?: QuietTime;
  JourneyLimits?: ApplicationSettingsJourneyLimits;
}
export const ApplicationSettingsResource = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CampaignHook: S.optional(CampaignHook),
    LastModifiedDate: S.optional(S.String),
    Limits: S.optional(CampaignLimits),
    QuietTime: S.optional(QuietTime),
    JourneyLimits: S.optional(ApplicationSettingsJourneyLimits),
  }),
).annotations({
  identifier: "ApplicationSettingsResource",
}) as any as S.Schema<ApplicationSettingsResource>;
export interface ApplicationsResponse {
  Item?: ApplicationResponse[];
  NextToken?: string;
}
export const ApplicationsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfApplicationResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationsResponse",
}) as any as S.Schema<ApplicationsResponse>;
export interface ResultRowValue {
  Key?: string;
  Type?: string;
  Value?: string;
}
export const ResultRowValue = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Type: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "ResultRowValue",
}) as any as S.Schema<ResultRowValue>;
export type ListOfResultRowValue = ResultRowValue[];
export const ListOfResultRowValue = S.Array(ResultRowValue);
export interface ResultRow {
  GroupedBys?: ResultRowValue[];
  Values?: ResultRowValue[];
}
export const ResultRow = S.suspend(() =>
  S.Struct({
    GroupedBys: S.optional(ListOfResultRowValue),
    Values: S.optional(ListOfResultRowValue),
  }),
).annotations({ identifier: "ResultRow" }) as any as S.Schema<ResultRow>;
export type ListOfResultRow = ResultRow[];
export const ListOfResultRow = S.Array(ResultRow);
export interface BaseKpiResult {
  Rows?: ResultRow[];
}
export const BaseKpiResult = S.suspend(() =>
  S.Struct({ Rows: S.optional(ListOfResultRow) }),
).annotations({
  identifier: "BaseKpiResult",
}) as any as S.Schema<BaseKpiResult>;
export interface CampaignDateRangeKpiResponse {
  ApplicationId?: string;
  CampaignId?: string;
  EndTime?: Date;
  KpiName?: string;
  KpiResult?: BaseKpiResult;
  NextToken?: string;
  StartTime?: Date;
}
export const CampaignDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CampaignId: S.optional(S.String),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    KpiName: S.optional(S.String),
    KpiResult: S.optional(BaseKpiResult),
    NextToken: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CampaignDateRangeKpiResponse",
}) as any as S.Schema<CampaignDateRangeKpiResponse>;
export interface EmailTemplateResponse {
  Arn?: string;
  CreationDate?: string;
  DefaultSubstitutions?: string;
  HtmlPart?: string;
  LastModifiedDate?: string;
  RecommenderId?: string;
  Subject?: string;
  Headers?: MessageHeader[];
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  TextPart?: string;
  Version?: string;
}
export const EmailTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationDate: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    HtmlPart: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    RecommenderId: S.optional(S.String),
    Subject: S.optional(S.String),
    Headers: S.optional(ListOfMessageHeader),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    TextPart: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailTemplateResponse",
}) as any as S.Schema<EmailTemplateResponse>;
export interface InAppTemplateResponse {
  Arn?: string;
  Content?: InAppMessageContent[];
  CreationDate?: string;
  CustomConfig?: { [key: string]: string };
  LastModifiedDate?: string;
  Layout?: Layout;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  Version?: string;
}
export const InAppTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Content: S.optional(ListOfInAppMessageContent),
    CreationDate: S.optional(S.String),
    CustomConfig: S.optional(MapOf__string),
    LastModifiedDate: S.optional(S.String),
    Layout: S.optional(Layout),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "InAppTemplateResponse",
}) as any as S.Schema<InAppTemplateResponse>;
export interface JourneyDateRangeKpiResponse {
  ApplicationId?: string;
  EndTime?: Date;
  JourneyId?: string;
  KpiName?: string;
  KpiResult?: BaseKpiResult;
  NextToken?: string;
  StartTime?: Date;
}
export const JourneyDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    JourneyId: S.optional(S.String),
    KpiName: S.optional(S.String),
    KpiResult: S.optional(BaseKpiResult),
    NextToken: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "JourneyDateRangeKpiResponse",
}) as any as S.Schema<JourneyDateRangeKpiResponse>;
export interface JourneyExecutionActivityMetricsResponse {
  ActivityType?: string;
  ApplicationId?: string;
  JourneyActivityId?: string;
  JourneyId?: string;
  LastEvaluatedTime?: string;
  Metrics?: { [key: string]: string };
}
export const JourneyExecutionActivityMetricsResponse = S.suspend(() =>
  S.Struct({
    ActivityType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    JourneyActivityId: S.optional(S.String),
    JourneyId: S.optional(S.String),
    LastEvaluatedTime: S.optional(S.String),
    Metrics: S.optional(MapOf__string),
  }),
).annotations({
  identifier: "JourneyExecutionActivityMetricsResponse",
}) as any as S.Schema<JourneyExecutionActivityMetricsResponse>;
export interface JourneyExecutionMetricsResponse {
  ApplicationId?: string;
  JourneyId?: string;
  LastEvaluatedTime?: string;
  Metrics?: { [key: string]: string };
}
export const JourneyExecutionMetricsResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    JourneyId: S.optional(S.String),
    LastEvaluatedTime: S.optional(S.String),
    Metrics: S.optional(MapOf__string),
  }),
).annotations({
  identifier: "JourneyExecutionMetricsResponse",
}) as any as S.Schema<JourneyExecutionMetricsResponse>;
export interface JourneyRunExecutionActivityMetricsResponse {
  ActivityType?: string;
  ApplicationId?: string;
  JourneyActivityId?: string;
  JourneyId?: string;
  LastEvaluatedTime?: string;
  Metrics?: { [key: string]: string };
  RunId?: string;
}
export const JourneyRunExecutionActivityMetricsResponse = S.suspend(() =>
  S.Struct({
    ActivityType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    JourneyActivityId: S.optional(S.String),
    JourneyId: S.optional(S.String),
    LastEvaluatedTime: S.optional(S.String),
    Metrics: S.optional(MapOf__string),
    RunId: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneyRunExecutionActivityMetricsResponse",
}) as any as S.Schema<JourneyRunExecutionActivityMetricsResponse>;
export interface JourneyRunExecutionMetricsResponse {
  ApplicationId?: string;
  JourneyId?: string;
  LastEvaluatedTime?: string;
  Metrics?: { [key: string]: string };
  RunId?: string;
}
export const JourneyRunExecutionMetricsResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    JourneyId: S.optional(S.String),
    LastEvaluatedTime: S.optional(S.String),
    Metrics: S.optional(MapOf__string),
    RunId: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneyRunExecutionMetricsResponse",
}) as any as S.Schema<JourneyRunExecutionMetricsResponse>;
export interface PushNotificationTemplateResponse {
  ADM?: AndroidPushNotificationTemplate;
  APNS?: APNSPushNotificationTemplate;
  Arn?: string;
  Baidu?: AndroidPushNotificationTemplate;
  CreationDate?: string;
  Default?: DefaultPushNotificationTemplate;
  DefaultSubstitutions?: string;
  GCM?: AndroidPushNotificationTemplate;
  LastModifiedDate?: string;
  RecommenderId?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  Version?: string;
}
export const PushNotificationTemplateResponse = S.suspend(() =>
  S.Struct({
    ADM: S.optional(AndroidPushNotificationTemplate),
    APNS: S.optional(APNSPushNotificationTemplate),
    Arn: S.optional(S.String),
    Baidu: S.optional(AndroidPushNotificationTemplate),
    CreationDate: S.optional(S.String),
    Default: S.optional(DefaultPushNotificationTemplate),
    DefaultSubstitutions: S.optional(S.String),
    GCM: S.optional(AndroidPushNotificationTemplate),
    LastModifiedDate: S.optional(S.String),
    RecommenderId: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "PushNotificationTemplateResponse",
}) as any as S.Schema<PushNotificationTemplateResponse>;
export interface ListRecommenderConfigurationsResponse {
  Item?: RecommenderConfigurationResponse[];
  NextToken?: string;
}
export const ListRecommenderConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfRecommenderConfigurationResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommenderConfigurationsResponse",
}) as any as S.Schema<ListRecommenderConfigurationsResponse>;
export interface SMSTemplateResponse {
  Arn?: string;
  Body?: string;
  CreationDate?: string;
  DefaultSubstitutions?: string;
  LastModifiedDate?: string;
  RecommenderId?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  Version?: string;
}
export const SMSTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Body: S.optional(S.String),
    CreationDate: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    RecommenderId: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "SMSTemplateResponse",
}) as any as S.Schema<SMSTemplateResponse>;
export interface VoiceTemplateResponse {
  Arn?: string;
  Body?: string;
  CreationDate?: string;
  DefaultSubstitutions?: string;
  LanguageCode?: string;
  LastModifiedDate?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  Version?: string;
  VoiceId?: string;
}
export const VoiceTemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Body: S.optional(S.String),
    CreationDate: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    Version: S.optional(S.String),
    VoiceId: S.optional(S.String),
  }),
).annotations({
  identifier: "VoiceTemplateResponse",
}) as any as S.Schema<VoiceTemplateResponse>;
export interface JourneysResponse {
  Item?: JourneyResponse[];
  NextToken?: string;
}
export const JourneysResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfJourneyResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneysResponse",
}) as any as S.Schema<JourneysResponse>;
export interface WriteApplicationSettingsRequest {
  CampaignHook?: CampaignHook;
  CloudWatchMetricsEnabled?: boolean;
  EventTaggingEnabled?: boolean;
  Limits?: CampaignLimits;
  QuietTime?: QuietTime;
  JourneyLimits?: ApplicationSettingsJourneyLimits;
}
export const WriteApplicationSettingsRequest = S.suspend(() =>
  S.Struct({
    CampaignHook: S.optional(CampaignHook),
    CloudWatchMetricsEnabled: S.optional(S.Boolean),
    EventTaggingEnabled: S.optional(S.Boolean),
    Limits: S.optional(CampaignLimits),
    QuietTime: S.optional(QuietTime),
    JourneyLimits: S.optional(ApplicationSettingsJourneyLimits),
  }),
).annotations({
  identifier: "WriteApplicationSettingsRequest",
}) as any as S.Schema<WriteApplicationSettingsRequest>;
export interface EndpointRequest {
  Address?: string;
  Attributes?: { [key: string]: string[] };
  ChannelType?: ChannelType;
  Demographic?: EndpointDemographic;
  EffectiveDate?: string;
  EndpointStatus?: string;
  Location?: EndpointLocation;
  Metrics?: { [key: string]: number };
  OptOut?: string;
  RequestId?: string;
  User?: EndpointUser;
}
export const EndpointRequest = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Attributes: S.optional(MapOfListOf__string),
    ChannelType: S.optional(ChannelType),
    Demographic: S.optional(EndpointDemographic),
    EffectiveDate: S.optional(S.String),
    EndpointStatus: S.optional(S.String),
    Location: S.optional(EndpointLocation),
    Metrics: S.optional(MapOf__double),
    OptOut: S.optional(S.String),
    RequestId: S.optional(S.String),
    User: S.optional(EndpointUser),
  }),
).annotations({
  identifier: "EndpointRequest",
}) as any as S.Schema<EndpointRequest>;
export interface EndpointBatchRequest {
  Item?: EndpointBatchItem[];
}
export const EndpointBatchRequest = S.suspend(() =>
  S.Struct({ Item: S.optional(ListOfEndpointBatchItem) }),
).annotations({
  identifier: "EndpointBatchRequest",
}) as any as S.Schema<EndpointBatchRequest>;
export type JourneyRunStatus =
  | "SCHEDULED"
  | "RUNNING"
  | "COMPLETED"
  | "CANCELLED";
export const JourneyRunStatus = S.Literal(
  "SCHEDULED",
  "RUNNING",
  "COMPLETED",
  "CANCELLED",
);
export interface AddressConfiguration {
  BodyOverride?: string;
  ChannelType?: ChannelType;
  Context?: { [key: string]: string };
  RawContent?: string;
  Substitutions?: { [key: string]: string[] };
  TitleOverride?: string;
}
export const AddressConfiguration = S.suspend(() =>
  S.Struct({
    BodyOverride: S.optional(S.String),
    ChannelType: S.optional(ChannelType),
    Context: S.optional(MapOf__string),
    RawContent: S.optional(S.String),
    Substitutions: S.optional(MapOfListOf__string),
    TitleOverride: S.optional(S.String),
  }),
).annotations({
  identifier: "AddressConfiguration",
}) as any as S.Schema<AddressConfiguration>;
export interface CreateAppRequest {
  CreateApplicationRequest?: CreateApplicationRequest;
}
export const CreateAppRequest = S.suspend(() =>
  S.Struct({
    CreateApplicationRequest: S.optional(CreateApplicationRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateApplicationRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppRequest",
}) as any as S.Schema<CreateAppRequest>;
export interface CreateEmailTemplateRequest {
  EmailTemplateRequest?: EmailTemplateRequest;
  TemplateName: string;
}
export const CreateEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    EmailTemplateRequest: S.optional(EmailTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/email" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEmailTemplateRequest",
}) as any as S.Schema<CreateEmailTemplateRequest>;
export interface CreateExportJobResponse {
  ExportJobResponse: ExportJobResponse & {
    ApplicationId: string;
    CreationDate: string;
    Definition: ExportJobResource & { RoleArn: string; S3UrlPrefix: string };
    Id: string;
    JobStatus: JobStatus;
    Type: string;
  };
}
export const CreateExportJobResponse = S.suspend(() =>
  S.Struct({
    ExportJobResponse: S.optional(ExportJobResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ExportJobResponse" }),
  }),
).annotations({
  identifier: "CreateExportJobResponse",
}) as any as S.Schema<CreateExportJobResponse>;
export interface CreateImportJobResponse {
  ImportJobResponse: ImportJobResponse & {
    ApplicationId: string;
    CreationDate: string;
    Definition: ImportJobResource & {
      Format: Format;
      RoleArn: string;
      S3Url: string;
    };
    Id: string;
    JobStatus: JobStatus;
    Type: string;
  };
}
export const CreateImportJobResponse = S.suspend(() =>
  S.Struct({
    ImportJobResponse: S.optional(ImportJobResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ImportJobResponse" }),
  }),
).annotations({
  identifier: "CreateImportJobResponse",
}) as any as S.Schema<CreateImportJobResponse>;
export interface CreatePushTemplateRequest {
  PushNotificationTemplateRequest?: PushNotificationTemplateRequest;
  TemplateName: string;
}
export const CreatePushTemplateRequest = S.suspend(() =>
  S.Struct({
    PushNotificationTemplateRequest: S.optional(PushNotificationTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PushNotificationTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/push" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePushTemplateRequest",
}) as any as S.Schema<CreatePushTemplateRequest>;
export interface CreateRecommenderConfigurationResponse {
  RecommenderConfigurationResponse: RecommenderConfigurationResponse & {
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    RecommendationProviderRoleArn: string;
    RecommendationProviderUri: string;
  };
}
export const CreateRecommenderConfigurationResponse = S.suspend(() =>
  S.Struct({
    RecommenderConfigurationResponse: S.optional(
      RecommenderConfigurationResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "RecommenderConfigurationResponse" }),
  }),
).annotations({
  identifier: "CreateRecommenderConfigurationResponse",
}) as any as S.Schema<CreateRecommenderConfigurationResponse>;
export interface CreateTemplateMessageBody {
  Arn?: string;
  Message?: string;
  RequestID?: string;
}
export const CreateTemplateMessageBody = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Message: S.optional(S.String),
    RequestID: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateTemplateMessageBody",
}) as any as S.Schema<CreateTemplateMessageBody>;
export interface CreateVoiceTemplateResponse {
  CreateTemplateMessageBody: CreateTemplateMessageBody;
}
export const CreateVoiceTemplateResponse = S.suspend(() =>
  S.Struct({
    CreateTemplateMessageBody: S.optional(CreateTemplateMessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateTemplateMessageBody" }),
  }),
).annotations({
  identifier: "CreateVoiceTemplateResponse",
}) as any as S.Schema<CreateVoiceTemplateResponse>;
export interface DeleteAdmChannelResponse {
  ADMChannelResponse: ADMChannelResponse & { Platform: string };
}
export const DeleteAdmChannelResponse = S.suspend(() =>
  S.Struct({
    ADMChannelResponse: S.optional(ADMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ADMChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteAdmChannelResponse",
}) as any as S.Schema<DeleteAdmChannelResponse>;
export interface DeleteApnsChannelResponse {
  APNSChannelResponse: APNSChannelResponse & { Platform: string };
}
export const DeleteApnsChannelResponse = S.suspend(() =>
  S.Struct({
    APNSChannelResponse: S.optional(APNSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteApnsChannelResponse",
}) as any as S.Schema<DeleteApnsChannelResponse>;
export interface DeleteApnsSandboxChannelResponse {
  APNSSandboxChannelResponse: APNSSandboxChannelResponse & { Platform: string };
}
export const DeleteApnsSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSSandboxChannelResponse: S.optional(APNSSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteApnsSandboxChannelResponse",
}) as any as S.Schema<DeleteApnsSandboxChannelResponse>;
export interface DeleteApnsVoipChannelResponse {
  APNSVoipChannelResponse: APNSVoipChannelResponse & { Platform: string };
}
export const DeleteApnsVoipChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipChannelResponse: S.optional(APNSVoipChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteApnsVoipChannelResponse",
}) as any as S.Schema<DeleteApnsVoipChannelResponse>;
export interface DeleteApnsVoipSandboxChannelResponse {
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse & {
    Platform: string;
  };
}
export const DeleteApnsVoipSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipSandboxChannelResponse: S.optional(APNSVoipSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteApnsVoipSandboxChannelResponse",
}) as any as S.Schema<DeleteApnsVoipSandboxChannelResponse>;
export interface DeleteAppResponse {
  ApplicationResponse: ApplicationResponse & {
    Arn: string;
    Id: string;
    Name: string;
  };
}
export const DeleteAppResponse = S.suspend(() =>
  S.Struct({
    ApplicationResponse: S.optional(ApplicationResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationResponse" }),
  }),
).annotations({
  identifier: "DeleteAppResponse",
}) as any as S.Schema<DeleteAppResponse>;
export interface DeleteBaiduChannelResponse {
  BaiduChannelResponse: BaiduChannelResponse & {
    Credential: string;
    Platform: string;
  };
}
export const DeleteBaiduChannelResponse = S.suspend(() =>
  S.Struct({
    BaiduChannelResponse: S.optional(BaiduChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "BaiduChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteBaiduChannelResponse",
}) as any as S.Schema<DeleteBaiduChannelResponse>;
export interface DeleteEmailChannelResponse {
  EmailChannelResponse: EmailChannelResponse & { Platform: string };
}
export const DeleteEmailChannelResponse = S.suspend(() =>
  S.Struct({
    EmailChannelResponse: S.optional(EmailChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteEmailChannelResponse",
}) as any as S.Schema<DeleteEmailChannelResponse>;
export interface DeleteEmailTemplateResponse {
  MessageBody: MessageBody;
}
export const DeleteEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "DeleteEmailTemplateResponse",
}) as any as S.Schema<DeleteEmailTemplateResponse>;
export interface DeleteEndpointResponse {
  EndpointResponse: EndpointResponse;
}
export const DeleteEndpointResponse = S.suspend(() =>
  S.Struct({
    EndpointResponse: S.optional(EndpointResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointResponse" }),
  }),
).annotations({
  identifier: "DeleteEndpointResponse",
}) as any as S.Schema<DeleteEndpointResponse>;
export interface DeleteEventStreamResponse {
  EventStream: EventStream & {
    ApplicationId: string;
    DestinationStreamArn: string;
    RoleArn: string;
  };
}
export const DeleteEventStreamResponse = S.suspend(() =>
  S.Struct({
    EventStream: S.optional(EventStream)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EventStream" }),
  }),
).annotations({
  identifier: "DeleteEventStreamResponse",
}) as any as S.Schema<DeleteEventStreamResponse>;
export interface DeleteGcmChannelResponse {
  GCMChannelResponse: GCMChannelResponse & { Platform: string };
}
export const DeleteGcmChannelResponse = S.suspend(() =>
  S.Struct({
    GCMChannelResponse: S.optional(GCMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GCMChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteGcmChannelResponse",
}) as any as S.Schema<DeleteGcmChannelResponse>;
export interface DeleteJourneyResponse {
  JourneyResponse: JourneyResponse & {
    ApplicationId: string;
    Id: string;
    Name: string;
    Activities: {
      [key: string]: Activity & {
        ConditionalSplit: ConditionalSplitActivity & {
          Condition: Condition & {
            Conditions: (SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            })[];
          };
        };
        Holdout: HoldoutActivity & { Percentage: number };
        MultiCondition: MultiConditionalSplitActivity & {
          Branches: (MultiConditionalBranch & {
            Condition: SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            };
          })[];
        };
      };
    };
    StartCondition: StartCondition & {
      EventStartCondition: EventStartCondition & {
        EventFilter: EventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
      SegmentStartCondition: SegmentCondition & { SegmentId: string };
    };
  };
}
export const DeleteJourneyResponse = S.suspend(() =>
  S.Struct({
    JourneyResponse: S.optional(JourneyResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyResponse" }),
  }),
).annotations({
  identifier: "DeleteJourneyResponse",
}) as any as S.Schema<DeleteJourneyResponse>;
export interface DeleteRecommenderConfigurationResponse {
  RecommenderConfigurationResponse: RecommenderConfigurationResponse & {
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    RecommendationProviderRoleArn: string;
    RecommendationProviderUri: string;
  };
}
export const DeleteRecommenderConfigurationResponse = S.suspend(() =>
  S.Struct({
    RecommenderConfigurationResponse: S.optional(
      RecommenderConfigurationResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "RecommenderConfigurationResponse" }),
  }),
).annotations({
  identifier: "DeleteRecommenderConfigurationResponse",
}) as any as S.Schema<DeleteRecommenderConfigurationResponse>;
export interface DeleteSmsChannelResponse {
  SMSChannelResponse: SMSChannelResponse & { Platform: string };
}
export const DeleteSmsChannelResponse = S.suspend(() =>
  S.Struct({
    SMSChannelResponse: S.optional(SMSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteSmsChannelResponse",
}) as any as S.Schema<DeleteSmsChannelResponse>;
export interface DeleteUserEndpointsResponse {
  EndpointsResponse: EndpointsResponse & { Item: ListOfEndpointResponse };
}
export const DeleteUserEndpointsResponse = S.suspend(() =>
  S.Struct({
    EndpointsResponse: S.optional(EndpointsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointsResponse" }),
  }),
).annotations({
  identifier: "DeleteUserEndpointsResponse",
}) as any as S.Schema<DeleteUserEndpointsResponse>;
export interface DeleteVoiceChannelResponse {
  VoiceChannelResponse: VoiceChannelResponse & { Platform: string };
}
export const DeleteVoiceChannelResponse = S.suspend(() =>
  S.Struct({
    VoiceChannelResponse: S.optional(VoiceChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceChannelResponse" }),
  }),
).annotations({
  identifier: "DeleteVoiceChannelResponse",
}) as any as S.Schema<DeleteVoiceChannelResponse>;
export interface GetApplicationSettingsResponse {
  ApplicationSettingsResource: ApplicationSettingsResource & {
    ApplicationId: string;
  };
}
export const GetApplicationSettingsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSettingsResource: S.optional(ApplicationSettingsResource)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationSettingsResource" }),
  }),
).annotations({
  identifier: "GetApplicationSettingsResponse",
}) as any as S.Schema<GetApplicationSettingsResponse>;
export interface GetAppsResponse {
  ApplicationsResponse: ApplicationsResponse & {
    Item: (ApplicationResponse & { Arn: string; Id: string; Name: string })[];
  };
}
export const GetAppsResponse = S.suspend(() =>
  S.Struct({
    ApplicationsResponse: S.optional(ApplicationsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationsResponse" }),
  }),
).annotations({
  identifier: "GetAppsResponse",
}) as any as S.Schema<GetAppsResponse>;
export interface GetCampaignDateRangeKpiResponse {
  CampaignDateRangeKpiResponse: CampaignDateRangeKpiResponse & {
    ApplicationId: string;
    CampaignId: string;
    EndTime: __timestampIso8601;
    KpiName: string;
    KpiResult: BaseKpiResult & {
      Rows: (ResultRow & {
        GroupedBys: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
        Values: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
      })[];
    };
    StartTime: __timestampIso8601;
  };
}
export const GetCampaignDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    CampaignDateRangeKpiResponse: S.optional(CampaignDateRangeKpiResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignDateRangeKpiResponse" }),
  }),
).annotations({
  identifier: "GetCampaignDateRangeKpiResponse",
}) as any as S.Schema<GetCampaignDateRangeKpiResponse>;
export interface GetCampaignsResponse {
  CampaignsResponse: CampaignsResponse & {
    Item: (CampaignResponse & {
      ApplicationId: string;
      Arn: string;
      CreationDate: string;
      Id: string;
      LastModifiedDate: string;
      SegmentId: string;
      SegmentVersion: number;
      AdditionalTreatments: (TreatmentResource & {
        Id: string;
        SizePercent: number;
        CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
          DeliveryUri: string;
        };
        MessageConfiguration: MessageConfiguration & {
          InAppMessage: CampaignInAppMessage & {
            Content: (InAppMessageContent & {
              BodyConfig: InAppMessageBodyConfig & {
                Alignment: Alignment;
                Body: string;
                TextColor: string;
              };
              HeaderConfig: InAppMessageHeaderConfig & {
                Alignment: Alignment;
                Header: string;
                TextColor: string;
              };
              PrimaryBtn: InAppMessageButton & {
                Android: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                DefaultConfig: DefaultButtonConfiguration & {
                  ButtonAction: ButtonAction;
                  Text: string;
                };
                IOS: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                Web: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
              };
              SecondaryBtn: InAppMessageButton & {
                Android: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                DefaultConfig: DefaultButtonConfiguration & {
                  ButtonAction: ButtonAction;
                  Text: string;
                };
                IOS: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
                Web: OverrideButtonConfiguration & {
                  ButtonAction: ButtonAction;
                };
              };
            })[];
          };
        };
        Schedule: Schedule & {
          StartTime: string;
          EventFilter: CampaignEventFilter & {
            Dimensions: EventDimensions & {
              Attributes: {
                [key: string]: AttributeDimension & { Values: ListOf__string };
              };
              EventType: SetDimension & { Values: ListOf__string };
              Metrics: {
                [key: string]: MetricDimension & {
                  ComparisonOperator: string;
                  Value: number;
                };
              };
            };
            FilterType: FilterType;
          };
        };
      })[];
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
  };
}
export const GetCampaignsResponse = S.suspend(() =>
  S.Struct({
    CampaignsResponse: S.optional(CampaignsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignsResponse" }),
  }),
).annotations({
  identifier: "GetCampaignsResponse",
}) as any as S.Schema<GetCampaignsResponse>;
export interface GetEmailTemplateResponse {
  EmailTemplateResponse: EmailTemplateResponse & {
    CreationDate: string;
    LastModifiedDate: string;
    TemplateName: string;
    TemplateType: TemplateType;
  };
}
export const GetEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    EmailTemplateResponse: S.optional(EmailTemplateResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailTemplateResponse" }),
  }),
).annotations({
  identifier: "GetEmailTemplateResponse",
}) as any as S.Schema<GetEmailTemplateResponse>;
export interface GetExportJobsResponse {
  ExportJobsResponse: ExportJobsResponse & {
    Item: (ExportJobResponse & {
      ApplicationId: string;
      CreationDate: string;
      Definition: ExportJobResource & { RoleArn: string; S3UrlPrefix: string };
      Id: string;
      JobStatus: JobStatus;
      Type: string;
    })[];
  };
}
export const GetExportJobsResponse = S.suspend(() =>
  S.Struct({
    ExportJobsResponse: S.optional(ExportJobsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ExportJobsResponse" }),
  }),
).annotations({
  identifier: "GetExportJobsResponse",
}) as any as S.Schema<GetExportJobsResponse>;
export interface GetImportJobsResponse {
  ImportJobsResponse: ImportJobsResponse & {
    Item: (ImportJobResponse & {
      ApplicationId: string;
      CreationDate: string;
      Definition: ImportJobResource & {
        Format: Format;
        RoleArn: string;
        S3Url: string;
      };
      Id: string;
      JobStatus: JobStatus;
      Type: string;
    })[];
  };
}
export const GetImportJobsResponse = S.suspend(() =>
  S.Struct({
    ImportJobsResponse: S.optional(ImportJobsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ImportJobsResponse" }),
  }),
).annotations({
  identifier: "GetImportJobsResponse",
}) as any as S.Schema<GetImportJobsResponse>;
export interface GetInAppTemplateResponse {
  InAppTemplateResponse: InAppTemplateResponse & {
    CreationDate: string;
    LastModifiedDate: string;
    TemplateName: string;
    TemplateType: TemplateType;
    Content: (InAppMessageContent & {
      BodyConfig: InAppMessageBodyConfig & {
        Alignment: Alignment;
        Body: string;
        TextColor: string;
      };
      HeaderConfig: InAppMessageHeaderConfig & {
        Alignment: Alignment;
        Header: string;
        TextColor: string;
      };
      PrimaryBtn: InAppMessageButton & {
        Android: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
        DefaultConfig: DefaultButtonConfiguration & {
          ButtonAction: ButtonAction;
          Text: string;
        };
        IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
        Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
      };
      SecondaryBtn: InAppMessageButton & {
        Android: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
        DefaultConfig: DefaultButtonConfiguration & {
          ButtonAction: ButtonAction;
          Text: string;
        };
        IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
        Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
      };
    })[];
  };
}
export const GetInAppTemplateResponse = S.suspend(() =>
  S.Struct({
    InAppTemplateResponse: S.optional(InAppTemplateResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InAppTemplateResponse" }),
  }),
).annotations({
  identifier: "GetInAppTemplateResponse",
}) as any as S.Schema<GetInAppTemplateResponse>;
export interface GetJourneyDateRangeKpiResponse {
  JourneyDateRangeKpiResponse: JourneyDateRangeKpiResponse & {
    ApplicationId: string;
    EndTime: __timestampIso8601;
    JourneyId: string;
    KpiName: string;
    KpiResult: BaseKpiResult & {
      Rows: (ResultRow & {
        GroupedBys: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
        Values: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
      })[];
    };
    StartTime: __timestampIso8601;
  };
}
export const GetJourneyDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    JourneyDateRangeKpiResponse: S.optional(JourneyDateRangeKpiResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyDateRangeKpiResponse" }),
  }),
).annotations({
  identifier: "GetJourneyDateRangeKpiResponse",
}) as any as S.Schema<GetJourneyDateRangeKpiResponse>;
export interface GetJourneyExecutionActivityMetricsResponse {
  JourneyExecutionActivityMetricsResponse: JourneyExecutionActivityMetricsResponse & {
    ActivityType: string;
    ApplicationId: string;
    JourneyActivityId: string;
    JourneyId: string;
    LastEvaluatedTime: string;
    Metrics: MapOf__string;
  };
}
export const GetJourneyExecutionActivityMetricsResponse = S.suspend(() =>
  S.Struct({
    JourneyExecutionActivityMetricsResponse: S.optional(
      JourneyExecutionActivityMetricsResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyExecutionActivityMetricsResponse" }),
  }),
).annotations({
  identifier: "GetJourneyExecutionActivityMetricsResponse",
}) as any as S.Schema<GetJourneyExecutionActivityMetricsResponse>;
export interface GetJourneyExecutionMetricsResponse {
  JourneyExecutionMetricsResponse: JourneyExecutionMetricsResponse & {
    ApplicationId: string;
    JourneyId: string;
    LastEvaluatedTime: string;
    Metrics: MapOf__string;
  };
}
export const GetJourneyExecutionMetricsResponse = S.suspend(() =>
  S.Struct({
    JourneyExecutionMetricsResponse: S.optional(JourneyExecutionMetricsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyExecutionMetricsResponse" }),
  }),
).annotations({
  identifier: "GetJourneyExecutionMetricsResponse",
}) as any as S.Schema<GetJourneyExecutionMetricsResponse>;
export interface GetJourneyRunExecutionActivityMetricsResponse {
  JourneyRunExecutionActivityMetricsResponse: JourneyRunExecutionActivityMetricsResponse & {
    ActivityType: string;
    ApplicationId: string;
    JourneyActivityId: string;
    JourneyId: string;
    LastEvaluatedTime: string;
    Metrics: MapOf__string;
    RunId: string;
  };
}
export const GetJourneyRunExecutionActivityMetricsResponse = S.suspend(() =>
  S.Struct({
    JourneyRunExecutionActivityMetricsResponse: S.optional(
      JourneyRunExecutionActivityMetricsResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({
        identifier: "JourneyRunExecutionActivityMetricsResponse",
      }),
  }),
).annotations({
  identifier: "GetJourneyRunExecutionActivityMetricsResponse",
}) as any as S.Schema<GetJourneyRunExecutionActivityMetricsResponse>;
export interface GetJourneyRunExecutionMetricsResponse {
  JourneyRunExecutionMetricsResponse: JourneyRunExecutionMetricsResponse & {
    ApplicationId: string;
    JourneyId: string;
    LastEvaluatedTime: string;
    Metrics: MapOf__string;
    RunId: string;
  };
}
export const GetJourneyRunExecutionMetricsResponse = S.suspend(() =>
  S.Struct({
    JourneyRunExecutionMetricsResponse: S.optional(
      JourneyRunExecutionMetricsResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyRunExecutionMetricsResponse" }),
  }),
).annotations({
  identifier: "GetJourneyRunExecutionMetricsResponse",
}) as any as S.Schema<GetJourneyRunExecutionMetricsResponse>;
export interface GetPushTemplateResponse {
  PushNotificationTemplateResponse: PushNotificationTemplateResponse & {
    CreationDate: string;
    LastModifiedDate: string;
    TemplateName: string;
    TemplateType: TemplateType;
  };
}
export const GetPushTemplateResponse = S.suspend(() =>
  S.Struct({
    PushNotificationTemplateResponse: S.optional(
      PushNotificationTemplateResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "PushNotificationTemplateResponse" }),
  }),
).annotations({
  identifier: "GetPushTemplateResponse",
}) as any as S.Schema<GetPushTemplateResponse>;
export interface GetRecommenderConfigurationsResponse {
  ListRecommenderConfigurationsResponse: ListRecommenderConfigurationsResponse & {
    Item: (RecommenderConfigurationResponse & {
      CreationDate: string;
      Id: string;
      LastModifiedDate: string;
      RecommendationProviderRoleArn: string;
      RecommendationProviderUri: string;
    })[];
  };
}
export const GetRecommenderConfigurationsResponse = S.suspend(() =>
  S.Struct({
    ListRecommenderConfigurationsResponse: S.optional(
      ListRecommenderConfigurationsResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ListRecommenderConfigurationsResponse" }),
  }),
).annotations({
  identifier: "GetRecommenderConfigurationsResponse",
}) as any as S.Schema<GetRecommenderConfigurationsResponse>;
export interface GetSegmentsResponse {
  SegmentsResponse: SegmentsResponse & {
    Item: (SegmentResponse & {
      ApplicationId: string;
      Arn: string;
      CreationDate: string;
      Id: string;
      SegmentType: SegmentType;
      Dimensions: SegmentDimensions & {
        Attributes: {
          [key: string]: AttributeDimension & { Values: ListOf__string };
        };
        Behavior: SegmentBehaviors & {
          Recency: RecencyDimension & {
            Duration: Duration;
            RecencyType: RecencyType;
          };
        };
        Demographic: SegmentDemographics & {
          AppVersion: SetDimension & { Values: ListOf__string };
          Channel: SetDimension & { Values: ListOf__string };
          DeviceType: SetDimension & { Values: ListOf__string };
          Make: SetDimension & { Values: ListOf__string };
          Model: SetDimension & { Values: ListOf__string };
          Platform: SetDimension & { Values: ListOf__string };
        };
        Location: SegmentLocation & {
          Country: SetDimension & { Values: ListOf__string };
          GPSPoint: GPSPointDimension & {
            Coordinates: GPSCoordinates & {
              Latitude: number;
              Longitude: number;
            };
          };
        };
        Metrics: {
          [key: string]: MetricDimension & {
            ComparisonOperator: string;
            Value: number;
          };
        };
        UserAttributes: {
          [key: string]: AttributeDimension & { Values: ListOf__string };
        };
      };
      ImportDefinition: SegmentImportResource & {
        ExternalId: string;
        Format: Format;
        RoleArn: string;
        S3Url: string;
        Size: number;
      };
      SegmentGroups: SegmentGroupList & {
        Groups: (SegmentGroup & {
          Dimensions: (SegmentDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            Behavior: SegmentBehaviors & {
              Recency: RecencyDimension & {
                Duration: Duration;
                RecencyType: RecencyType;
              };
            };
            Demographic: SegmentDemographics & {
              AppVersion: SetDimension & { Values: ListOf__string };
              Channel: SetDimension & { Values: ListOf__string };
              DeviceType: SetDimension & { Values: ListOf__string };
              Make: SetDimension & { Values: ListOf__string };
              Model: SetDimension & { Values: ListOf__string };
              Platform: SetDimension & { Values: ListOf__string };
            };
            Location: SegmentLocation & {
              Country: SetDimension & { Values: ListOf__string };
              GPSPoint: GPSPointDimension & {
                Coordinates: GPSCoordinates & {
                  Latitude: number;
                  Longitude: number;
                };
              };
            };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
            UserAttributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
          })[];
          SourceSegments: (SegmentReference & { Id: string })[];
        })[];
      };
    })[];
  };
}
export const GetSegmentsResponse = S.suspend(() =>
  S.Struct({
    SegmentsResponse: S.optional(SegmentsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentsResponse" }),
  }),
).annotations({
  identifier: "GetSegmentsResponse",
}) as any as S.Schema<GetSegmentsResponse>;
export interface GetSmsTemplateResponse {
  SMSTemplateResponse: SMSTemplateResponse & {
    CreationDate: string;
    LastModifiedDate: string;
    TemplateName: string;
    TemplateType: TemplateType;
  };
}
export const GetSmsTemplateResponse = S.suspend(() =>
  S.Struct({
    SMSTemplateResponse: S.optional(SMSTemplateResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSTemplateResponse" }),
  }),
).annotations({
  identifier: "GetSmsTemplateResponse",
}) as any as S.Schema<GetSmsTemplateResponse>;
export interface GetVoiceTemplateResponse {
  VoiceTemplateResponse: VoiceTemplateResponse & {
    CreationDate: string;
    LastModifiedDate: string;
    TemplateName: string;
    TemplateType: TemplateType;
  };
}
export const GetVoiceTemplateResponse = S.suspend(() =>
  S.Struct({
    VoiceTemplateResponse: S.optional(VoiceTemplateResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceTemplateResponse" }),
  }),
).annotations({
  identifier: "GetVoiceTemplateResponse",
}) as any as S.Schema<GetVoiceTemplateResponse>;
export interface ListJourneysResponse {
  JourneysResponse: JourneysResponse & {
    Item: (JourneyResponse & {
      ApplicationId: string;
      Id: string;
      Name: string;
      Activities: {
        [key: string]: Activity & {
          ConditionalSplit: ConditionalSplitActivity & {
            Condition: Condition & {
              Conditions: (SimpleCondition & {
                EventCondition: EventCondition & {
                  Dimensions: EventDimensions & {
                    Attributes: {
                      [key: string]: AttributeDimension & {
                        Values: ListOf__string;
                      };
                    };
                    EventType: SetDimension & { Values: ListOf__string };
                    Metrics: {
                      [key: string]: MetricDimension & {
                        ComparisonOperator: string;
                        Value: number;
                      };
                    };
                  };
                };
                SegmentCondition: SegmentCondition & { SegmentId: string };
                SegmentDimensions: SegmentDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  Behavior: SegmentBehaviors & {
                    Recency: RecencyDimension & {
                      Duration: Duration;
                      RecencyType: RecencyType;
                    };
                  };
                  Demographic: SegmentDemographics & {
                    AppVersion: SetDimension & { Values: ListOf__string };
                    Channel: SetDimension & { Values: ListOf__string };
                    DeviceType: SetDimension & { Values: ListOf__string };
                    Make: SetDimension & { Values: ListOf__string };
                    Model: SetDimension & { Values: ListOf__string };
                    Platform: SetDimension & { Values: ListOf__string };
                  };
                  Location: SegmentLocation & {
                    Country: SetDimension & { Values: ListOf__string };
                    GPSPoint: GPSPointDimension & {
                      Coordinates: GPSCoordinates & {
                        Latitude: number;
                        Longitude: number;
                      };
                    };
                  };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                  UserAttributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                };
              })[];
            };
          };
          Holdout: HoldoutActivity & { Percentage: number };
          MultiCondition: MultiConditionalSplitActivity & {
            Branches: (MultiConditionalBranch & {
              Condition: SimpleCondition & {
                EventCondition: EventCondition & {
                  Dimensions: EventDimensions & {
                    Attributes: {
                      [key: string]: AttributeDimension & {
                        Values: ListOf__string;
                      };
                    };
                    EventType: SetDimension & { Values: ListOf__string };
                    Metrics: {
                      [key: string]: MetricDimension & {
                        ComparisonOperator: string;
                        Value: number;
                      };
                    };
                  };
                };
                SegmentCondition: SegmentCondition & { SegmentId: string };
                SegmentDimensions: SegmentDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  Behavior: SegmentBehaviors & {
                    Recency: RecencyDimension & {
                      Duration: Duration;
                      RecencyType: RecencyType;
                    };
                  };
                  Demographic: SegmentDemographics & {
                    AppVersion: SetDimension & { Values: ListOf__string };
                    Channel: SetDimension & { Values: ListOf__string };
                    DeviceType: SetDimension & { Values: ListOf__string };
                    Make: SetDimension & { Values: ListOf__string };
                    Model: SetDimension & { Values: ListOf__string };
                    Platform: SetDimension & { Values: ListOf__string };
                  };
                  Location: SegmentLocation & {
                    Country: SetDimension & { Values: ListOf__string };
                    GPSPoint: GPSPointDimension & {
                      Coordinates: GPSCoordinates & {
                        Latitude: number;
                        Longitude: number;
                      };
                    };
                  };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                  UserAttributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                };
              };
            })[];
          };
        };
      };
      StartCondition: StartCondition & {
        EventStartCondition: EventStartCondition & {
          EventFilter: EventFilter & {
            Dimensions: EventDimensions & {
              Attributes: {
                [key: string]: AttributeDimension & { Values: ListOf__string };
              };
              EventType: SetDimension & { Values: ListOf__string };
              Metrics: {
                [key: string]: MetricDimension & {
                  ComparisonOperator: string;
                  Value: number;
                };
              };
            };
            FilterType: FilterType;
          };
        };
        SegmentStartCondition: SegmentCondition & { SegmentId: string };
      };
    })[];
  };
}
export const ListJourneysResponse = S.suspend(() =>
  S.Struct({
    JourneysResponse: S.optional(JourneysResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneysResponse" }),
  }),
).annotations({
  identifier: "ListJourneysResponse",
}) as any as S.Schema<ListJourneysResponse>;
export interface PutEventStreamResponse {
  EventStream: EventStream & {
    ApplicationId: string;
    DestinationStreamArn: string;
    RoleArn: string;
  };
}
export const PutEventStreamResponse = S.suspend(() =>
  S.Struct({
    EventStream: S.optional(EventStream)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EventStream" }),
  }),
).annotations({
  identifier: "PutEventStreamResponse",
}) as any as S.Schema<PutEventStreamResponse>;
export interface UpdateAdmChannelResponse {
  ADMChannelResponse: ADMChannelResponse & { Platform: string };
}
export const UpdateAdmChannelResponse = S.suspend(() =>
  S.Struct({
    ADMChannelResponse: S.optional(ADMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ADMChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateAdmChannelResponse",
}) as any as S.Schema<UpdateAdmChannelResponse>;
export interface UpdateApnsChannelResponse {
  APNSChannelResponse: APNSChannelResponse & { Platform: string };
}
export const UpdateApnsChannelResponse = S.suspend(() =>
  S.Struct({
    APNSChannelResponse: S.optional(APNSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateApnsChannelResponse",
}) as any as S.Schema<UpdateApnsChannelResponse>;
export interface UpdateApnsSandboxChannelResponse {
  APNSSandboxChannelResponse: APNSSandboxChannelResponse & { Platform: string };
}
export const UpdateApnsSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSSandboxChannelResponse: S.optional(APNSSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateApnsSandboxChannelResponse",
}) as any as S.Schema<UpdateApnsSandboxChannelResponse>;
export interface UpdateApnsVoipChannelResponse {
  APNSVoipChannelResponse: APNSVoipChannelResponse & { Platform: string };
}
export const UpdateApnsVoipChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipChannelResponse: S.optional(APNSVoipChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateApnsVoipChannelResponse",
}) as any as S.Schema<UpdateApnsVoipChannelResponse>;
export interface UpdateApnsVoipSandboxChannelResponse {
  APNSVoipSandboxChannelResponse: APNSVoipSandboxChannelResponse & {
    Platform: string;
  };
}
export const UpdateApnsVoipSandboxChannelResponse = S.suspend(() =>
  S.Struct({
    APNSVoipSandboxChannelResponse: S.optional(APNSVoipSandboxChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "APNSVoipSandboxChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateApnsVoipSandboxChannelResponse",
}) as any as S.Schema<UpdateApnsVoipSandboxChannelResponse>;
export interface UpdateApplicationSettingsRequest {
  ApplicationId: string;
  WriteApplicationSettingsRequest?: WriteApplicationSettingsRequest;
}
export const UpdateApplicationSettingsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    WriteApplicationSettingsRequest: S.optional(WriteApplicationSettingsRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteApplicationSettingsRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationSettingsRequest",
}) as any as S.Schema<UpdateApplicationSettingsRequest>;
export interface UpdateBaiduChannelResponse {
  BaiduChannelResponse: BaiduChannelResponse & {
    Credential: string;
    Platform: string;
  };
}
export const UpdateBaiduChannelResponse = S.suspend(() =>
  S.Struct({
    BaiduChannelResponse: S.optional(BaiduChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "BaiduChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateBaiduChannelResponse",
}) as any as S.Schema<UpdateBaiduChannelResponse>;
export interface UpdateEmailChannelResponse {
  EmailChannelResponse: EmailChannelResponse & { Platform: string };
}
export const UpdateEmailChannelResponse = S.suspend(() =>
  S.Struct({
    EmailChannelResponse: S.optional(EmailChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EmailChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateEmailChannelResponse",
}) as any as S.Schema<UpdateEmailChannelResponse>;
export interface UpdateEndpointRequest {
  ApplicationId: string;
  EndpointId: string;
  EndpointRequest?: EndpointRequest;
}
export const UpdateEndpointRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndpointId: S.String.pipe(T.HttpLabel("EndpointId")),
    EndpointRequest: S.optional(EndpointRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointRequest" }),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateEndpointRequest",
}) as any as S.Schema<UpdateEndpointRequest>;
export interface UpdateEndpointsBatchRequest {
  ApplicationId: string;
  EndpointBatchRequest?: EndpointBatchRequest;
}
export const UpdateEndpointsBatchRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EndpointBatchRequest: S.optional(EndpointBatchRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EndpointBatchRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/apps/{ApplicationId}/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEndpointsBatchRequest",
}) as any as S.Schema<UpdateEndpointsBatchRequest>;
export interface UpdateGcmChannelResponse {
  GCMChannelResponse: GCMChannelResponse & { Platform: string };
}
export const UpdateGcmChannelResponse = S.suspend(() =>
  S.Struct({
    GCMChannelResponse: S.optional(GCMChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "GCMChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateGcmChannelResponse",
}) as any as S.Schema<UpdateGcmChannelResponse>;
export interface UpdateJourneyStateResponse {
  JourneyResponse: JourneyResponse & {
    ApplicationId: string;
    Id: string;
    Name: string;
    Activities: {
      [key: string]: Activity & {
        ConditionalSplit: ConditionalSplitActivity & {
          Condition: Condition & {
            Conditions: (SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            })[];
          };
        };
        Holdout: HoldoutActivity & { Percentage: number };
        MultiCondition: MultiConditionalSplitActivity & {
          Branches: (MultiConditionalBranch & {
            Condition: SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            };
          })[];
        };
      };
    };
    StartCondition: StartCondition & {
      EventStartCondition: EventStartCondition & {
        EventFilter: EventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
      SegmentStartCondition: SegmentCondition & { SegmentId: string };
    };
  };
}
export const UpdateJourneyStateResponse = S.suspend(() =>
  S.Struct({
    JourneyResponse: S.optional(JourneyResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyResponse" }),
  }),
).annotations({
  identifier: "UpdateJourneyStateResponse",
}) as any as S.Schema<UpdateJourneyStateResponse>;
export interface UpdateRecommenderConfigurationResponse {
  RecommenderConfigurationResponse: RecommenderConfigurationResponse & {
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    RecommendationProviderRoleArn: string;
    RecommendationProviderUri: string;
  };
}
export const UpdateRecommenderConfigurationResponse = S.suspend(() =>
  S.Struct({
    RecommenderConfigurationResponse: S.optional(
      RecommenderConfigurationResponse,
    )
      .pipe(T.HttpPayload())
      .annotations({ identifier: "RecommenderConfigurationResponse" }),
  }),
).annotations({
  identifier: "UpdateRecommenderConfigurationResponse",
}) as any as S.Schema<UpdateRecommenderConfigurationResponse>;
export interface UpdateSmsChannelResponse {
  SMSChannelResponse: SMSChannelResponse & { Platform: string };
}
export const UpdateSmsChannelResponse = S.suspend(() =>
  S.Struct({
    SMSChannelResponse: S.optional(SMSChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SMSChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateSmsChannelResponse",
}) as any as S.Schema<UpdateSmsChannelResponse>;
export interface UpdateTemplateActiveVersionResponse {
  MessageBody: MessageBody;
}
export const UpdateTemplateActiveVersionResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateTemplateActiveVersionResponse",
}) as any as S.Schema<UpdateTemplateActiveVersionResponse>;
export interface UpdateVoiceChannelResponse {
  VoiceChannelResponse: VoiceChannelResponse & { Platform: string };
}
export const UpdateVoiceChannelResponse = S.suspend(() =>
  S.Struct({
    VoiceChannelResponse: S.optional(VoiceChannelResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VoiceChannelResponse" }),
  }),
).annotations({
  identifier: "UpdateVoiceChannelResponse",
}) as any as S.Schema<UpdateVoiceChannelResponse>;
export interface ActivityResponse {
  ApplicationId?: string;
  CampaignId?: string;
  End?: string;
  Id?: string;
  Result?: string;
  ScheduledStart?: string;
  Start?: string;
  State?: string;
  SuccessfulEndpointCount?: number;
  TimezonesCompletedCount?: number;
  TimezonesTotalCount?: number;
  TotalEndpointCount?: number;
  TreatmentId?: string;
  ExecutionMetrics?: { [key: string]: string };
}
export const ActivityResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CampaignId: S.optional(S.String),
    End: S.optional(S.String),
    Id: S.optional(S.String),
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
  }),
).annotations({
  identifier: "ActivityResponse",
}) as any as S.Schema<ActivityResponse>;
export type ListOfActivityResponse = ActivityResponse[];
export const ListOfActivityResponse = S.Array(ActivityResponse);
export interface JourneyRunResponse {
  CreationTime?: string;
  LastUpdateTime?: string;
  RunId?: string;
  Status?: JourneyRunStatus;
}
export const JourneyRunResponse = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.String),
    LastUpdateTime: S.optional(S.String),
    RunId: S.optional(S.String),
    Status: S.optional(JourneyRunStatus),
  }),
).annotations({
  identifier: "JourneyRunResponse",
}) as any as S.Schema<JourneyRunResponse>;
export type ListOfJourneyRunResponse = JourneyRunResponse[];
export const ListOfJourneyRunResponse = S.Array(JourneyRunResponse);
export interface TemplateResponse {
  Arn?: string;
  CreationDate?: string;
  DefaultSubstitutions?: string;
  LastModifiedDate?: string;
  tags?: { [key: string]: string };
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: TemplateType;
  Version?: string;
}
export const TemplateResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreationDate: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    tags: S.optional(MapOf__string).pipe(T.JsonName("tags")),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(TemplateType),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateResponse",
}) as any as S.Schema<TemplateResponse>;
export type ListOfTemplateResponse = TemplateResponse[];
export const ListOfTemplateResponse = S.Array(TemplateResponse);
export interface TemplateVersionResponse {
  CreationDate?: string;
  DefaultSubstitutions?: string;
  LastModifiedDate?: string;
  TemplateDescription?: string;
  TemplateName?: string;
  TemplateType?: string;
  Version?: string;
}
export const TemplateVersionResponse = S.suspend(() =>
  S.Struct({
    CreationDate: S.optional(S.String),
    DefaultSubstitutions: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    TemplateDescription: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateType: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateVersionResponse",
}) as any as S.Schema<TemplateVersionResponse>;
export type ListOfTemplateVersionResponse = TemplateVersionResponse[];
export const ListOfTemplateVersionResponse = S.Array(TemplateVersionResponse);
export type MapOfAddressConfiguration = { [key: string]: AddressConfiguration };
export const MapOfAddressConfiguration = S.Record({
  key: S.String,
  value: AddressConfiguration,
});
export interface PublicEndpoint {
  Address?: string;
  Attributes?: { [key: string]: string[] };
  ChannelType?: ChannelType;
  Demographic?: EndpointDemographic;
  EffectiveDate?: string;
  EndpointStatus?: string;
  Location?: EndpointLocation;
  Metrics?: { [key: string]: number };
  OptOut?: string;
  RequestId?: string;
  User?: EndpointUser;
}
export const PublicEndpoint = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Attributes: S.optional(MapOfListOf__string),
    ChannelType: S.optional(ChannelType),
    Demographic: S.optional(EndpointDemographic),
    EffectiveDate: S.optional(S.String),
    EndpointStatus: S.optional(S.String),
    Location: S.optional(EndpointLocation),
    Metrics: S.optional(MapOf__double),
    OptOut: S.optional(S.String),
    RequestId: S.optional(S.String),
    User: S.optional(EndpointUser),
  }),
).annotations({
  identifier: "PublicEndpoint",
}) as any as S.Schema<PublicEndpoint>;
export interface ActivitiesResponse {
  Item?: ActivityResponse[];
  NextToken?: string;
}
export const ActivitiesResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfActivityResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ActivitiesResponse",
}) as any as S.Schema<ActivitiesResponse>;
export interface JourneyRunsResponse {
  Item?: JourneyRunResponse[];
  NextToken?: string;
}
export const JourneyRunsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfJourneyRunResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "JourneyRunsResponse",
}) as any as S.Schema<JourneyRunsResponse>;
export interface TemplatesResponse {
  Item?: TemplateResponse[];
  NextToken?: string;
}
export const TemplatesResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfTemplateResponse),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplatesResponse",
}) as any as S.Schema<TemplatesResponse>;
export interface TemplateVersionsResponse {
  Item?: TemplateVersionResponse[];
  Message?: string;
  NextToken?: string;
  RequestID?: string;
}
export const TemplateVersionsResponse = S.suspend(() =>
  S.Struct({
    Item: S.optional(ListOfTemplateVersionResponse),
    Message: S.optional(S.String),
    NextToken: S.optional(S.String),
    RequestID: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateVersionsResponse",
}) as any as S.Schema<TemplateVersionsResponse>;
export interface NumberValidateResponse {
  Carrier?: string;
  City?: string;
  CleansedPhoneNumberE164?: string;
  CleansedPhoneNumberNational?: string;
  Country?: string;
  CountryCodeIso2?: string;
  CountryCodeNumeric?: string;
  County?: string;
  OriginalCountryCodeIso2?: string;
  OriginalPhoneNumber?: string;
  PhoneType?: string;
  PhoneTypeCode?: number;
  Timezone?: string;
  ZipCode?: string;
}
export const NumberValidateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "NumberValidateResponse",
}) as any as S.Schema<NumberValidateResponse>;
export interface AttributesResource {
  ApplicationId?: string;
  AttributeType?: string;
  Attributes?: string[];
}
export const AttributesResource = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    AttributeType: S.optional(S.String),
    Attributes: S.optional(ListOf__string),
  }),
).annotations({
  identifier: "AttributesResource",
}) as any as S.Schema<AttributesResource>;
export interface VerificationResponse {
  Valid?: boolean;
}
export const VerificationResponse = S.suspend(() =>
  S.Struct({ Valid: S.optional(S.Boolean) }),
).annotations({
  identifier: "VerificationResponse",
}) as any as S.Schema<VerificationResponse>;
export interface ChannelResponse {
  ApplicationId?: string;
  CreationDate?: string;
  Enabled?: boolean;
  HasCredential?: boolean;
  Id?: string;
  IsArchived?: boolean;
  LastModifiedBy?: string;
  LastModifiedDate?: string;
  Version?: number;
}
export const ChannelResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    CreationDate: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    HasCredential: S.optional(S.Boolean),
    Id: S.optional(S.String),
    IsArchived: S.optional(S.Boolean),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(S.String),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "ChannelResponse",
}) as any as S.Schema<ChannelResponse>;
export interface InAppMessage {
  Content?: InAppMessageContent[];
  CustomConfig?: { [key: string]: string };
  Layout?: Layout;
}
export const InAppMessage = S.suspend(() =>
  S.Struct({
    Content: S.optional(ListOfInAppMessageContent),
    CustomConfig: S.optional(MapOf__string),
    Layout: S.optional(Layout),
  }),
).annotations({ identifier: "InAppMessage" }) as any as S.Schema<InAppMessage>;
export interface InAppCampaignSchedule {
  EndDate?: string;
  EventFilter?: CampaignEventFilter;
  QuietTime?: QuietTime;
}
export const InAppCampaignSchedule = S.suspend(() =>
  S.Struct({
    EndDate: S.optional(S.String),
    EventFilter: S.optional(CampaignEventFilter),
    QuietTime: S.optional(QuietTime),
  }),
).annotations({
  identifier: "InAppCampaignSchedule",
}) as any as S.Schema<InAppCampaignSchedule>;
export interface CreateAppResponse {
  ApplicationResponse: ApplicationResponse & {
    Arn: string;
    Id: string;
    Name: string;
  };
}
export const CreateAppResponse = S.suspend(() =>
  S.Struct({
    ApplicationResponse: S.optional(ApplicationResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationResponse" }),
  }),
).annotations({
  identifier: "CreateAppResponse",
}) as any as S.Schema<CreateAppResponse>;
export interface CreateEmailTemplateResponse {
  CreateTemplateMessageBody: CreateTemplateMessageBody;
}
export const CreateEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    CreateTemplateMessageBody: S.optional(CreateTemplateMessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateTemplateMessageBody" }),
  }),
).annotations({
  identifier: "CreateEmailTemplateResponse",
}) as any as S.Schema<CreateEmailTemplateResponse>;
export interface CreatePushTemplateResponse {
  CreateTemplateMessageBody: CreateTemplateMessageBody;
}
export const CreatePushTemplateResponse = S.suspend(() =>
  S.Struct({
    CreateTemplateMessageBody: S.optional(CreateTemplateMessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateTemplateMessageBody" }),
  }),
).annotations({
  identifier: "CreatePushTemplateResponse",
}) as any as S.Schema<CreatePushTemplateResponse>;
export interface CreateSmsTemplateResponse {
  CreateTemplateMessageBody: CreateTemplateMessageBody;
}
export const CreateSmsTemplateResponse = S.suspend(() =>
  S.Struct({
    CreateTemplateMessageBody: S.optional(CreateTemplateMessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CreateTemplateMessageBody" }),
  }),
).annotations({
  identifier: "CreateSmsTemplateResponse",
}) as any as S.Schema<CreateSmsTemplateResponse>;
export interface DeleteCampaignResponse {
  CampaignResponse: CampaignResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    SegmentId: string;
    SegmentVersion: number;
    AdditionalTreatments: (TreatmentResource & {
      Id: string;
      SizePercent: number;
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
    CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
      DeliveryUri: string;
    };
    MessageConfiguration: MessageConfiguration & {
      InAppMessage: CampaignInAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
    };
    Schedule: Schedule & {
      StartTime: string;
      EventFilter: CampaignEventFilter & {
        Dimensions: EventDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          EventType: SetDimension & { Values: ListOf__string };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
        };
        FilterType: FilterType;
      };
    };
  };
}
export const DeleteCampaignResponse = S.suspend(() =>
  S.Struct({
    CampaignResponse: S.optional(CampaignResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignResponse" }),
  }),
).annotations({
  identifier: "DeleteCampaignResponse",
}) as any as S.Schema<DeleteCampaignResponse>;
export interface GetCampaignActivitiesResponse {
  ActivitiesResponse: ActivitiesResponse & {
    Item: (ActivityResponse & {
      ApplicationId: string;
      CampaignId: string;
      Id: string;
    })[];
  };
}
export const GetCampaignActivitiesResponse = S.suspend(() =>
  S.Struct({
    ActivitiesResponse: S.optional(ActivitiesResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ActivitiesResponse" }),
  }),
).annotations({
  identifier: "GetCampaignActivitiesResponse",
}) as any as S.Schema<GetCampaignActivitiesResponse>;
export interface GetExportJobResponse {
  ExportJobResponse: ExportJobResponse & {
    ApplicationId: string;
    CreationDate: string;
    Definition: ExportJobResource & { RoleArn: string; S3UrlPrefix: string };
    Id: string;
    JobStatus: JobStatus;
    Type: string;
  };
}
export const GetExportJobResponse = S.suspend(() =>
  S.Struct({
    ExportJobResponse: S.optional(ExportJobResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ExportJobResponse" }),
  }),
).annotations({
  identifier: "GetExportJobResponse",
}) as any as S.Schema<GetExportJobResponse>;
export interface GetImportJobResponse {
  ImportJobResponse: ImportJobResponse & {
    ApplicationId: string;
    CreationDate: string;
    Definition: ImportJobResource & {
      Format: Format;
      RoleArn: string;
      S3Url: string;
    };
    Id: string;
    JobStatus: JobStatus;
    Type: string;
  };
}
export const GetImportJobResponse = S.suspend(() =>
  S.Struct({
    ImportJobResponse: S.optional(ImportJobResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ImportJobResponse" }),
  }),
).annotations({
  identifier: "GetImportJobResponse",
}) as any as S.Schema<GetImportJobResponse>;
export interface GetJourneyRunsResponse {
  JourneyRunsResponse: JourneyRunsResponse & {
    Item: (JourneyRunResponse & {
      CreationTime: string;
      LastUpdateTime: string;
      RunId: string;
      Status: JourneyRunStatus;
    })[];
  };
}
export const GetJourneyRunsResponse = S.suspend(() =>
  S.Struct({
    JourneyRunsResponse: S.optional(JourneyRunsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyRunsResponse" }),
  }),
).annotations({
  identifier: "GetJourneyRunsResponse",
}) as any as S.Schema<GetJourneyRunsResponse>;
export interface ListTemplatesResponse {
  TemplatesResponse: TemplatesResponse & {
    Item: (TemplateResponse & {
      CreationDate: string;
      LastModifiedDate: string;
      TemplateName: string;
      TemplateType: TemplateType;
    })[];
  };
}
export const ListTemplatesResponse = S.suspend(() =>
  S.Struct({
    TemplatesResponse: S.optional(TemplatesResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TemplatesResponse" }),
  }),
).annotations({
  identifier: "ListTemplatesResponse",
}) as any as S.Schema<ListTemplatesResponse>;
export interface ListTemplateVersionsResponse {
  TemplateVersionsResponse: TemplateVersionsResponse & {
    Item: (TemplateVersionResponse & {
      CreationDate: string;
      LastModifiedDate: string;
      TemplateName: string;
      TemplateType: string;
    })[];
  };
}
export const ListTemplateVersionsResponse = S.suspend(() =>
  S.Struct({
    TemplateVersionsResponse: S.optional(TemplateVersionsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TemplateVersionsResponse" }),
  }),
).annotations({
  identifier: "ListTemplateVersionsResponse",
}) as any as S.Schema<ListTemplateVersionsResponse>;
export interface PhoneNumberValidateResponse {
  NumberValidateResponse: NumberValidateResponse;
}
export const PhoneNumberValidateResponse = S.suspend(() =>
  S.Struct({
    NumberValidateResponse: S.optional(NumberValidateResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "NumberValidateResponse" }),
  }),
).annotations({
  identifier: "PhoneNumberValidateResponse",
}) as any as S.Schema<PhoneNumberValidateResponse>;
export interface RemoveAttributesResponse {
  AttributesResource: AttributesResource & {
    ApplicationId: string;
    AttributeType: string;
  };
}
export const RemoveAttributesResponse = S.suspend(() =>
  S.Struct({
    AttributesResource: S.optional(AttributesResource)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "AttributesResource" }),
  }),
).annotations({
  identifier: "RemoveAttributesResponse",
}) as any as S.Schema<RemoveAttributesResponse>;
export interface UpdateApplicationSettingsResponse {
  ApplicationSettingsResource: ApplicationSettingsResource & {
    ApplicationId: string;
  };
}
export const UpdateApplicationSettingsResponse = S.suspend(() =>
  S.Struct({
    ApplicationSettingsResource: S.optional(ApplicationSettingsResource)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationSettingsResource" }),
  }),
).annotations({
  identifier: "UpdateApplicationSettingsResponse",
}) as any as S.Schema<UpdateApplicationSettingsResponse>;
export interface UpdateEndpointResponse {
  MessageBody: MessageBody;
}
export const UpdateEndpointResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateEndpointResponse",
}) as any as S.Schema<UpdateEndpointResponse>;
export interface UpdateEndpointsBatchResponse {
  MessageBody: MessageBody;
}
export const UpdateEndpointsBatchResponse = S.suspend(() =>
  S.Struct({
    MessageBody: S.optional(MessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageBody" }),
  }),
).annotations({
  identifier: "UpdateEndpointsBatchResponse",
}) as any as S.Schema<UpdateEndpointsBatchResponse>;
export interface VerifyOTPMessageResponse {
  VerificationResponse: VerificationResponse;
}
export const VerifyOTPMessageResponse = S.suspend(() =>
  S.Struct({
    VerificationResponse: S.optional(VerificationResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "VerificationResponse" }),
  }),
).annotations({
  identifier: "VerifyOTPMessageResponse",
}) as any as S.Schema<VerifyOTPMessageResponse>;
export type MapOfChannelResponse = { [key: string]: ChannelResponse };
export const MapOfChannelResponse = S.Record({
  key: S.String,
  value: ChannelResponse,
});
export interface InAppMessageCampaign {
  CampaignId?: string;
  DailyCap?: number;
  InAppMessage?: InAppMessage;
  Priority?: number;
  Schedule?: InAppCampaignSchedule;
  SessionCap?: number;
  TotalCap?: number;
  TreatmentId?: string;
}
export const InAppMessageCampaign = S.suspend(() =>
  S.Struct({
    CampaignId: S.optional(S.String),
    DailyCap: S.optional(S.Number),
    InAppMessage: S.optional(InAppMessage),
    Priority: S.optional(S.Number),
    Schedule: S.optional(InAppCampaignSchedule),
    SessionCap: S.optional(S.Number),
    TotalCap: S.optional(S.Number),
    TreatmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "InAppMessageCampaign",
}) as any as S.Schema<InAppMessageCampaign>;
export type ListOfInAppMessageCampaign = InAppMessageCampaign[];
export const ListOfInAppMessageCampaign = S.Array(InAppMessageCampaign);
export type DeliveryStatus =
  | "SUCCESSFUL"
  | "THROTTLED"
  | "TEMPORARY_FAILURE"
  | "PERMANENT_FAILURE"
  | "UNKNOWN_FAILURE"
  | "OPT_OUT"
  | "DUPLICATE";
export const DeliveryStatus = S.Literal(
  "SUCCESSFUL",
  "THROTTLED",
  "TEMPORARY_FAILURE",
  "PERMANENT_FAILURE",
  "UNKNOWN_FAILURE",
  "OPT_OUT",
  "DUPLICATE",
);
export interface EndpointMessageResult {
  Address?: string;
  DeliveryStatus?: DeliveryStatus;
  MessageId?: string;
  StatusCode?: number;
  StatusMessage?: string;
  UpdatedToken?: string;
}
export const EndpointMessageResult = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    DeliveryStatus: S.optional(DeliveryStatus),
    MessageId: S.optional(S.String),
    StatusCode: S.optional(S.Number),
    StatusMessage: S.optional(S.String),
    UpdatedToken: S.optional(S.String),
  }),
).annotations({
  identifier: "EndpointMessageResult",
}) as any as S.Schema<EndpointMessageResult>;
export type MapOfEndpointMessageResult = {
  [key: string]: EndpointMessageResult;
};
export const MapOfEndpointMessageResult = S.Record({
  key: S.String,
  value: EndpointMessageResult,
});
export type MapOfMapOfEndpointMessageResult = {
  [key: string]: { [key: string]: EndpointMessageResult };
};
export const MapOfMapOfEndpointMessageResult = S.Record({
  key: S.String,
  value: MapOfEndpointMessageResult,
});
export interface ChannelsResponse {
  Channels?: { [key: string]: ChannelResponse };
}
export const ChannelsResponse = S.suspend(() =>
  S.Struct({ Channels: S.optional(MapOfChannelResponse) }),
).annotations({
  identifier: "ChannelsResponse",
}) as any as S.Schema<ChannelsResponse>;
export interface InAppMessagesResponse {
  InAppMessageCampaigns?: InAppMessageCampaign[];
}
export const InAppMessagesResponse = S.suspend(() =>
  S.Struct({ InAppMessageCampaigns: S.optional(ListOfInAppMessageCampaign) }),
).annotations({
  identifier: "InAppMessagesResponse",
}) as any as S.Schema<InAppMessagesResponse>;
export interface Session {
  Duration?: number;
  Id?: string;
  StartTimestamp?: string;
  StopTimestamp?: string;
}
export const Session = S.suspend(() =>
  S.Struct({
    Duration: S.optional(S.Number),
    Id: S.optional(S.String),
    StartTimestamp: S.optional(S.String),
    StopTimestamp: S.optional(S.String),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export interface SendUsersMessageResponse {
  ApplicationId?: string;
  RequestId?: string;
  Result?: { [key: string]: { [key: string]: EndpointMessageResult } };
}
export const SendUsersMessageResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    RequestId: S.optional(S.String),
    Result: S.optional(MapOfMapOfEndpointMessageResult),
  }),
).annotations({
  identifier: "SendUsersMessageResponse",
}) as any as S.Schema<SendUsersMessageResponse>;
export interface MessageResult {
  DeliveryStatus?: DeliveryStatus;
  MessageId?: string;
  StatusCode?: number;
  StatusMessage?: string;
  UpdatedToken?: string;
}
export const MessageResult = S.suspend(() =>
  S.Struct({
    DeliveryStatus: S.optional(DeliveryStatus),
    MessageId: S.optional(S.String),
    StatusCode: S.optional(S.Number),
    StatusMessage: S.optional(S.String),
    UpdatedToken: S.optional(S.String),
  }),
).annotations({
  identifier: "MessageResult",
}) as any as S.Schema<MessageResult>;
export interface CreateCampaignRequest {
  ApplicationId: string;
  WriteCampaignRequest?: WriteCampaignRequest;
}
export const CreateCampaignRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    WriteCampaignRequest: S.optional(WriteCampaignRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteCampaignRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/campaigns" }),
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
export interface CreateInAppTemplateRequest {
  InAppTemplateRequest?: InAppTemplateRequest;
  TemplateName: string;
}
export const CreateInAppTemplateRequest = S.suspend(() =>
  S.Struct({
    InAppTemplateRequest: S.optional(InAppTemplateRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InAppTemplateRequest" }),
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/templates/{TemplateName}/inapp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInAppTemplateRequest",
}) as any as S.Schema<CreateInAppTemplateRequest>;
export interface DeleteSegmentResponse {
  SegmentResponse: SegmentResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    SegmentType: SegmentType;
    Dimensions: SegmentDimensions & {
      Attributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
      Behavior: SegmentBehaviors & {
        Recency: RecencyDimension & {
          Duration: Duration;
          RecencyType: RecencyType;
        };
      };
      Demographic: SegmentDemographics & {
        AppVersion: SetDimension & { Values: ListOf__string };
        Channel: SetDimension & { Values: ListOf__string };
        DeviceType: SetDimension & { Values: ListOf__string };
        Make: SetDimension & { Values: ListOf__string };
        Model: SetDimension & { Values: ListOf__string };
        Platform: SetDimension & { Values: ListOf__string };
      };
      Location: SegmentLocation & {
        Country: SetDimension & { Values: ListOf__string };
        GPSPoint: GPSPointDimension & {
          Coordinates: GPSCoordinates & { Latitude: number; Longitude: number };
        };
      };
      Metrics: {
        [key: string]: MetricDimension & {
          ComparisonOperator: string;
          Value: number;
        };
      };
      UserAttributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
    };
    ImportDefinition: SegmentImportResource & {
      ExternalId: string;
      Format: Format;
      RoleArn: string;
      S3Url: string;
      Size: number;
    };
    SegmentGroups: SegmentGroupList & {
      Groups: (SegmentGroup & {
        Dimensions: (SegmentDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          Behavior: SegmentBehaviors & {
            Recency: RecencyDimension & {
              Duration: Duration;
              RecencyType: RecencyType;
            };
          };
          Demographic: SegmentDemographics & {
            AppVersion: SetDimension & { Values: ListOf__string };
            Channel: SetDimension & { Values: ListOf__string };
            DeviceType: SetDimension & { Values: ListOf__string };
            Make: SetDimension & { Values: ListOf__string };
            Model: SetDimension & { Values: ListOf__string };
            Platform: SetDimension & { Values: ListOf__string };
          };
          Location: SegmentLocation & {
            Country: SetDimension & { Values: ListOf__string };
            GPSPoint: GPSPointDimension & {
              Coordinates: GPSCoordinates & {
                Latitude: number;
                Longitude: number;
              };
            };
          };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
          UserAttributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
        })[];
        SourceSegments: (SegmentReference & { Id: string })[];
      })[];
    };
  };
}
export const DeleteSegmentResponse = S.suspend(() =>
  S.Struct({
    SegmentResponse: S.optional(SegmentResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentResponse" }),
  }),
).annotations({
  identifier: "DeleteSegmentResponse",
}) as any as S.Schema<DeleteSegmentResponse>;
export interface GetChannelsResponse {
  ChannelsResponse: ChannelsResponse & { Channels: MapOfChannelResponse };
}
export const GetChannelsResponse = S.suspend(() =>
  S.Struct({
    ChannelsResponse: S.optional(ChannelsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ChannelsResponse" }),
  }),
).annotations({
  identifier: "GetChannelsResponse",
}) as any as S.Schema<GetChannelsResponse>;
export interface GetInAppMessagesResponse {
  InAppMessagesResponse: InAppMessagesResponse & {
    InAppMessageCampaigns: (InAppMessageCampaign & {
      InAppMessage: InAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
      Schedule: InAppCampaignSchedule & {
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
  };
}
export const GetInAppMessagesResponse = S.suspend(() =>
  S.Struct({
    InAppMessagesResponse: S.optional(InAppMessagesResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "InAppMessagesResponse" }),
  }),
).annotations({
  identifier: "GetInAppMessagesResponse",
}) as any as S.Schema<GetInAppMessagesResponse>;
export interface Event {
  AppPackageName?: string;
  AppTitle?: string;
  AppVersionCode?: string;
  Attributes?: { [key: string]: string };
  ClientSdkVersion?: string;
  EventType?: string;
  Metrics?: { [key: string]: number };
  SdkName?: string;
  Session?: Session;
  Timestamp?: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    AppPackageName: S.optional(S.String),
    AppTitle: S.optional(S.String),
    AppVersionCode: S.optional(S.String),
    Attributes: S.optional(MapOf__string),
    ClientSdkVersion: S.optional(S.String),
    EventType: S.optional(S.String),
    Metrics: S.optional(MapOf__double),
    SdkName: S.optional(S.String),
    Session: S.optional(Session),
    Timestamp: S.optional(S.String),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export interface SendUsersMessagesResponse {
  SendUsersMessageResponse: SendUsersMessageResponse & {
    ApplicationId: string;
    Result: {
      [key: string]: {
        [key: string]: EndpointMessageResult & {
          DeliveryStatus: DeliveryStatus;
          StatusCode: number;
        };
      };
    };
  };
}
export const SendUsersMessagesResponse = S.suspend(() =>
  S.Struct({
    SendUsersMessageResponse: S.optional(SendUsersMessageResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SendUsersMessageResponse" }),
  }),
).annotations({
  identifier: "SendUsersMessagesResponse",
}) as any as S.Schema<SendUsersMessagesResponse>;
export type MapOfMessageResult = { [key: string]: MessageResult };
export const MapOfMessageResult = S.Record({
  key: S.String,
  value: MessageResult,
});
export type MapOfEvent = { [key: string]: Event };
export const MapOfEvent = S.Record({ key: S.String, value: Event });
export interface ApplicationDateRangeKpiResponse {
  ApplicationId?: string;
  EndTime?: Date;
  KpiName?: string;
  KpiResult?: BaseKpiResult;
  NextToken?: string;
  StartTime?: Date;
}
export const ApplicationDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    KpiName: S.optional(S.String),
    KpiResult: S.optional(BaseKpiResult),
    NextToken: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ApplicationDateRangeKpiResponse",
}) as any as S.Schema<ApplicationDateRangeKpiResponse>;
export interface MessageRequest {
  Addresses?: { [key: string]: AddressConfiguration };
  Context?: { [key: string]: string };
  Endpoints?: { [key: string]: EndpointSendConfiguration };
  MessageConfiguration?: DirectMessageConfiguration;
  TemplateConfiguration?: TemplateConfiguration;
  TraceId?: string;
}
export const MessageRequest = S.suspend(() =>
  S.Struct({
    Addresses: S.optional(MapOfAddressConfiguration),
    Context: S.optional(MapOf__string),
    Endpoints: S.optional(MapOfEndpointSendConfiguration),
    MessageConfiguration: S.optional(DirectMessageConfiguration),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TraceId: S.optional(S.String),
  }),
).annotations({
  identifier: "MessageRequest",
}) as any as S.Schema<MessageRequest>;
export interface MessageResponse {
  ApplicationId?: string;
  EndpointResult?: { [key: string]: EndpointMessageResult };
  RequestId?: string;
  Result?: { [key: string]: MessageResult };
}
export const MessageResponse = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    EndpointResult: S.optional(MapOfEndpointMessageResult),
    RequestId: S.optional(S.String),
    Result: S.optional(MapOfMessageResult),
  }),
).annotations({
  identifier: "MessageResponse",
}) as any as S.Schema<MessageResponse>;
export interface EventsBatch {
  Endpoint?: PublicEndpoint;
  Events?: { [key: string]: Event };
}
export const EventsBatch = S.suspend(() =>
  S.Struct({
    Endpoint: S.optional(PublicEndpoint),
    Events: S.optional(MapOfEvent),
  }),
).annotations({ identifier: "EventsBatch" }) as any as S.Schema<EventsBatch>;
export interface CreateCampaignResponse {
  CampaignResponse: CampaignResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    LastModifiedDate: string;
    SegmentId: string;
    SegmentVersion: number;
    AdditionalTreatments: (TreatmentResource & {
      Id: string;
      SizePercent: number;
      CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
        DeliveryUri: string;
      };
      MessageConfiguration: MessageConfiguration & {
        InAppMessage: CampaignInAppMessage & {
          Content: (InAppMessageContent & {
            BodyConfig: InAppMessageBodyConfig & {
              Alignment: Alignment;
              Body: string;
              TextColor: string;
            };
            HeaderConfig: InAppMessageHeaderConfig & {
              Alignment: Alignment;
              Header: string;
              TextColor: string;
            };
            PrimaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
            SecondaryBtn: InAppMessageButton & {
              Android: OverrideButtonConfiguration & {
                ButtonAction: ButtonAction;
              };
              DefaultConfig: DefaultButtonConfiguration & {
                ButtonAction: ButtonAction;
                Text: string;
              };
              IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
              Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            };
          })[];
        };
      };
      Schedule: Schedule & {
        StartTime: string;
        EventFilter: CampaignEventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
    })[];
    CustomDeliveryConfiguration: CustomDeliveryConfiguration & {
      DeliveryUri: string;
    };
    MessageConfiguration: MessageConfiguration & {
      InAppMessage: CampaignInAppMessage & {
        Content: (InAppMessageContent & {
          BodyConfig: InAppMessageBodyConfig & {
            Alignment: Alignment;
            Body: string;
            TextColor: string;
          };
          HeaderConfig: InAppMessageHeaderConfig & {
            Alignment: Alignment;
            Header: string;
            TextColor: string;
          };
          PrimaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
          SecondaryBtn: InAppMessageButton & {
            Android: OverrideButtonConfiguration & {
              ButtonAction: ButtonAction;
            };
            DefaultConfig: DefaultButtonConfiguration & {
              ButtonAction: ButtonAction;
              Text: string;
            };
            IOS: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
            Web: OverrideButtonConfiguration & { ButtonAction: ButtonAction };
          };
        })[];
      };
    };
    Schedule: Schedule & {
      StartTime: string;
      EventFilter: CampaignEventFilter & {
        Dimensions: EventDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          EventType: SetDimension & { Values: ListOf__string };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
        };
        FilterType: FilterType;
      };
    };
  };
}
export const CreateCampaignResponse = S.suspend(() =>
  S.Struct({
    CampaignResponse: S.optional(CampaignResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "CampaignResponse" }),
  }),
).annotations({
  identifier: "CreateCampaignResponse",
}) as any as S.Schema<CreateCampaignResponse>;
export interface CreateSegmentRequest {
  ApplicationId: string;
  WriteSegmentRequest?: WriteSegmentRequest;
}
export const CreateSegmentRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    WriteSegmentRequest: S.optional(WriteSegmentRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteSegmentRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/segments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSegmentRequest",
}) as any as S.Schema<CreateSegmentRequest>;
export interface GetApplicationDateRangeKpiResponse {
  ApplicationDateRangeKpiResponse: ApplicationDateRangeKpiResponse & {
    ApplicationId: string;
    EndTime: __timestampIso8601;
    KpiName: string;
    KpiResult: BaseKpiResult & {
      Rows: (ResultRow & {
        GroupedBys: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
        Values: (ResultRowValue & {
          Key: string;
          Type: string;
          Value: string;
        })[];
      })[];
    };
    StartTime: __timestampIso8601;
  };
}
export const GetApplicationDateRangeKpiResponse = S.suspend(() =>
  S.Struct({
    ApplicationDateRangeKpiResponse: S.optional(ApplicationDateRangeKpiResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "ApplicationDateRangeKpiResponse" }),
  }),
).annotations({
  identifier: "GetApplicationDateRangeKpiResponse",
}) as any as S.Schema<GetApplicationDateRangeKpiResponse>;
export interface SendMessagesRequest {
  ApplicationId: string;
  MessageRequest?: MessageRequest;
}
export const SendMessagesRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    MessageRequest: S.optional(MessageRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/messages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendMessagesRequest",
}) as any as S.Schema<SendMessagesRequest>;
export interface SendOTPMessageResponse {
  MessageResponse: MessageResponse & {
    ApplicationId: string;
    EndpointResult: {
      [key: string]: EndpointMessageResult & {
        DeliveryStatus: DeliveryStatus;
        StatusCode: number;
      };
    };
    Result: {
      [key: string]: MessageResult & {
        DeliveryStatus: DeliveryStatus;
        StatusCode: number;
      };
    };
  };
}
export const SendOTPMessageResponse = S.suspend(() =>
  S.Struct({
    MessageResponse: S.optional(MessageResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageResponse" }),
  }),
).annotations({
  identifier: "SendOTPMessageResponse",
}) as any as S.Schema<SendOTPMessageResponse>;
export type MapOfEventsBatch = { [key: string]: EventsBatch };
export const MapOfEventsBatch = S.Record({ key: S.String, value: EventsBatch });
export interface TemplateCreateMessageBody {
  Arn?: string;
  Message?: string;
  RequestID?: string;
}
export const TemplateCreateMessageBody = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Message: S.optional(S.String),
    RequestID: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateCreateMessageBody",
}) as any as S.Schema<TemplateCreateMessageBody>;
export interface EventsRequest {
  BatchItem?: { [key: string]: EventsBatch };
}
export const EventsRequest = S.suspend(() =>
  S.Struct({ BatchItem: S.optional(MapOfEventsBatch) }),
).annotations({
  identifier: "EventsRequest",
}) as any as S.Schema<EventsRequest>;
export interface CreateInAppTemplateResponse {
  TemplateCreateMessageBody: TemplateCreateMessageBody;
}
export const CreateInAppTemplateResponse = S.suspend(() =>
  S.Struct({
    TemplateCreateMessageBody: S.optional(TemplateCreateMessageBody)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "TemplateCreateMessageBody" }),
  }),
).annotations({
  identifier: "CreateInAppTemplateResponse",
}) as any as S.Schema<CreateInAppTemplateResponse>;
export interface CreateSegmentResponse {
  SegmentResponse: SegmentResponse & {
    ApplicationId: string;
    Arn: string;
    CreationDate: string;
    Id: string;
    SegmentType: SegmentType;
    Dimensions: SegmentDimensions & {
      Attributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
      Behavior: SegmentBehaviors & {
        Recency: RecencyDimension & {
          Duration: Duration;
          RecencyType: RecencyType;
        };
      };
      Demographic: SegmentDemographics & {
        AppVersion: SetDimension & { Values: ListOf__string };
        Channel: SetDimension & { Values: ListOf__string };
        DeviceType: SetDimension & { Values: ListOf__string };
        Make: SetDimension & { Values: ListOf__string };
        Model: SetDimension & { Values: ListOf__string };
        Platform: SetDimension & { Values: ListOf__string };
      };
      Location: SegmentLocation & {
        Country: SetDimension & { Values: ListOf__string };
        GPSPoint: GPSPointDimension & {
          Coordinates: GPSCoordinates & { Latitude: number; Longitude: number };
        };
      };
      Metrics: {
        [key: string]: MetricDimension & {
          ComparisonOperator: string;
          Value: number;
        };
      };
      UserAttributes: {
        [key: string]: AttributeDimension & { Values: ListOf__string };
      };
    };
    ImportDefinition: SegmentImportResource & {
      ExternalId: string;
      Format: Format;
      RoleArn: string;
      S3Url: string;
      Size: number;
    };
    SegmentGroups: SegmentGroupList & {
      Groups: (SegmentGroup & {
        Dimensions: (SegmentDimensions & {
          Attributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
          Behavior: SegmentBehaviors & {
            Recency: RecencyDimension & {
              Duration: Duration;
              RecencyType: RecencyType;
            };
          };
          Demographic: SegmentDemographics & {
            AppVersion: SetDimension & { Values: ListOf__string };
            Channel: SetDimension & { Values: ListOf__string };
            DeviceType: SetDimension & { Values: ListOf__string };
            Make: SetDimension & { Values: ListOf__string };
            Model: SetDimension & { Values: ListOf__string };
            Platform: SetDimension & { Values: ListOf__string };
          };
          Location: SegmentLocation & {
            Country: SetDimension & { Values: ListOf__string };
            GPSPoint: GPSPointDimension & {
              Coordinates: GPSCoordinates & {
                Latitude: number;
                Longitude: number;
              };
            };
          };
          Metrics: {
            [key: string]: MetricDimension & {
              ComparisonOperator: string;
              Value: number;
            };
          };
          UserAttributes: {
            [key: string]: AttributeDimension & { Values: ListOf__string };
          };
        })[];
        SourceSegments: (SegmentReference & { Id: string })[];
      })[];
    };
  };
}
export const CreateSegmentResponse = S.suspend(() =>
  S.Struct({
    SegmentResponse: S.optional(SegmentResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "SegmentResponse" }),
  }),
).annotations({
  identifier: "CreateSegmentResponse",
}) as any as S.Schema<CreateSegmentResponse>;
export interface PutEventsRequest {
  ApplicationId: string;
  EventsRequest?: EventsRequest;
}
export const PutEventsRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    EventsRequest: S.optional(EventsRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EventsRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventsRequest",
}) as any as S.Schema<PutEventsRequest>;
export interface SendMessagesResponse {
  MessageResponse: MessageResponse & {
    ApplicationId: string;
    EndpointResult: {
      [key: string]: EndpointMessageResult & {
        DeliveryStatus: DeliveryStatus;
        StatusCode: number;
      };
    };
    Result: {
      [key: string]: MessageResult & {
        DeliveryStatus: DeliveryStatus;
        StatusCode: number;
      };
    };
  };
}
export const SendMessagesResponse = S.suspend(() =>
  S.Struct({
    MessageResponse: S.optional(MessageResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "MessageResponse" }),
  }),
).annotations({
  identifier: "SendMessagesResponse",
}) as any as S.Schema<SendMessagesResponse>;
export interface CreateJourneyRequest {
  ApplicationId: string;
  WriteJourneyRequest?: WriteJourneyRequest;
}
export const CreateJourneyRequest = S.suspend(() =>
  S.Struct({
    ApplicationId: S.String.pipe(T.HttpLabel("ApplicationId")),
    WriteJourneyRequest: S.optional(WriteJourneyRequest)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "WriteJourneyRequest" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/apps/{ApplicationId}/journeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJourneyRequest",
}) as any as S.Schema<CreateJourneyRequest>;
export interface CreateJourneyResponse {
  JourneyResponse: JourneyResponse & {
    ApplicationId: string;
    Id: string;
    Name: string;
    Activities: {
      [key: string]: Activity & {
        ConditionalSplit: ConditionalSplitActivity & {
          Condition: Condition & {
            Conditions: (SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            })[];
          };
        };
        Holdout: HoldoutActivity & { Percentage: number };
        MultiCondition: MultiConditionalSplitActivity & {
          Branches: (MultiConditionalBranch & {
            Condition: SimpleCondition & {
              EventCondition: EventCondition & {
                Dimensions: EventDimensions & {
                  Attributes: {
                    [key: string]: AttributeDimension & {
                      Values: ListOf__string;
                    };
                  };
                  EventType: SetDimension & { Values: ListOf__string };
                  Metrics: {
                    [key: string]: MetricDimension & {
                      ComparisonOperator: string;
                      Value: number;
                    };
                  };
                };
              };
              SegmentCondition: SegmentCondition & { SegmentId: string };
              SegmentDimensions: SegmentDimensions & {
                Attributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
                Behavior: SegmentBehaviors & {
                  Recency: RecencyDimension & {
                    Duration: Duration;
                    RecencyType: RecencyType;
                  };
                };
                Demographic: SegmentDemographics & {
                  AppVersion: SetDimension & { Values: ListOf__string };
                  Channel: SetDimension & { Values: ListOf__string };
                  DeviceType: SetDimension & { Values: ListOf__string };
                  Make: SetDimension & { Values: ListOf__string };
                  Model: SetDimension & { Values: ListOf__string };
                  Platform: SetDimension & { Values: ListOf__string };
                };
                Location: SegmentLocation & {
                  Country: SetDimension & { Values: ListOf__string };
                  GPSPoint: GPSPointDimension & {
                    Coordinates: GPSCoordinates & {
                      Latitude: number;
                      Longitude: number;
                    };
                  };
                };
                Metrics: {
                  [key: string]: MetricDimension & {
                    ComparisonOperator: string;
                    Value: number;
                  };
                };
                UserAttributes: {
                  [key: string]: AttributeDimension & {
                    Values: ListOf__string;
                  };
                };
              };
            };
          })[];
        };
      };
    };
    StartCondition: StartCondition & {
      EventStartCondition: EventStartCondition & {
        EventFilter: EventFilter & {
          Dimensions: EventDimensions & {
            Attributes: {
              [key: string]: AttributeDimension & { Values: ListOf__string };
            };
            EventType: SetDimension & { Values: ListOf__string };
            Metrics: {
              [key: string]: MetricDimension & {
                ComparisonOperator: string;
                Value: number;
              };
            };
          };
          FilterType: FilterType;
        };
      };
      SegmentStartCondition: SegmentCondition & { SegmentId: string };
    };
  };
}
export const CreateJourneyResponse = S.suspend(() =>
  S.Struct({
    JourneyResponse: S.optional(JourneyResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "JourneyResponse" }),
  }),
).annotations({
  identifier: "CreateJourneyResponse",
}) as any as S.Schema<CreateJourneyResponse>;
export interface EndpointItemResponse {
  Message?: string;
  StatusCode?: number;
}
export const EndpointItemResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), StatusCode: S.optional(S.Number) }),
).annotations({
  identifier: "EndpointItemResponse",
}) as any as S.Schema<EndpointItemResponse>;
export interface EventItemResponse {
  Message?: string;
  StatusCode?: number;
}
export const EventItemResponse = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), StatusCode: S.optional(S.Number) }),
).annotations({
  identifier: "EventItemResponse",
}) as any as S.Schema<EventItemResponse>;
export type MapOfEventItemResponse = { [key: string]: EventItemResponse };
export const MapOfEventItemResponse = S.Record({
  key: S.String,
  value: EventItemResponse,
});
export interface ItemResponse {
  EndpointItemResponse?: EndpointItemResponse;
  EventsItemResponse?: { [key: string]: EventItemResponse };
}
export const ItemResponse = S.suspend(() =>
  S.Struct({
    EndpointItemResponse: S.optional(EndpointItemResponse),
    EventsItemResponse: S.optional(MapOfEventItemResponse),
  }),
).annotations({ identifier: "ItemResponse" }) as any as S.Schema<ItemResponse>;
export type MapOfItemResponse = { [key: string]: ItemResponse };
export const MapOfItemResponse = S.Record({
  key: S.String,
  value: ItemResponse,
});
export interface EventsResponse {
  Results?: { [key: string]: ItemResponse };
}
export const EventsResponse = S.suspend(() =>
  S.Struct({ Results: S.optional(MapOfItemResponse) }),
).annotations({
  identifier: "EventsResponse",
}) as any as S.Schema<EventsResponse>;
export interface PutEventsResponse {
  EventsResponse: EventsResponse;
}
export const PutEventsResponse = S.suspend(() =>
  S.Struct({
    EventsResponse: S.optional(EventsResponse)
      .pipe(T.HttpPayload())
      .annotations({ identifier: "EventsResponse" }),
  }),
).annotations({
  identifier: "PutEventsResponse",
}) as any as S.Schema<PutEventsResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withServerError) {}
export class MethodNotAllowedException extends S.TaggedError<MethodNotAllowedException>()(
  "MethodNotAllowedException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class PayloadTooLargeException extends S.TaggedError<PayloadTooLargeException>()(
  "PayloadTooLargeException",
  { Message: S.optional(S.String), RequestID: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes one or more tags (keys and values) from an application, campaign, message template, or segment.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Retrieves all the tags (keys and values) that are associated with an application, campaign, message template, or segment.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Adds one or more tags (keys and values) to an application, campaign, message template, or segment.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Retrieves information about all the message templates that are associated with your Amazon Pinpoint account.
 */
export const listTemplates: (
  input: ListTemplatesRequest,
) => effect.Effect<
  ListTemplatesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a message template for messages that are sent through the voice channel.
 */
export const createVoiceTemplate: (
  input: CreateVoiceTemplateRequest,
) => effect.Effect<
  CreateVoiceTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a message template for messages that are sent through the email channel.
 */
export const createEmailTemplate: (
  input: CreateEmailTemplateRequest,
) => effect.Effect<
  CreateEmailTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPushTemplate: (
  input: CreatePushTemplateRequest,
) => effect.Effect<
  CreatePushTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSmsTemplate: (
  input: CreateSmsTemplateRequest,
) => effect.Effect<
  CreateSmsTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new message template for messages using the in-app message channel.
 */
export const createInAppTemplate: (
  input: CreateInAppTemplateRequest,
) => effect.Effect<
  CreateInAppTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a message template for messages sent using the in-app message channel.
 */
export const deleteInAppTemplate: (
  input: DeleteInAppTemplateRequest,
) => effect.Effect<
  DeleteInAppTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates and sends a direct message.
 */
export const sendMessages: (
  input: SendMessagesRequest,
) => effect.Effect<
  SendMessagesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves (queries) pre-aggregated data for a standard metric that applies to an application.
 */
export const getApplicationDateRangeKpi: (
  input: GetApplicationDateRangeKpiRequest,
) => effect.Effect<
  GetApplicationDateRangeKpiResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Send an OTP message
 */
export const sendOTPMessage: (
  input: SendOTPMessageRequest,
) => effect.Effect<
  SendOTPMessageResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a segment from an application.
 */
export const deleteSegment: (
  input: DeleteSegmentRequest,
) => effect.Effect<
  DeleteSegmentResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getChannels: (
  input: GetChannelsRequest,
) => effect.Effect<
  GetChannelsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getInAppMessages: (
  input: GetInAppMessagesRequest,
) => effect.Effect<
  GetInAppMessagesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendUsersMessages: (
  input: SendUsersMessagesRequest,
) => effect.Effect<
  SendUsersMessagesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about all the activities for a campaign.
 */
export const getCampaignActivities: (
  input: GetCampaignActivitiesRequest,
) => effect.Effect<
  GetCampaignActivitiesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the status and settings of a specific export job for an application.
 */
export const getExportJob: (
  input: GetExportJobRequest,
) => effect.Effect<
  GetExportJobResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImportJob: (
  input: GetImportJobRequest,
) => effect.Effect<
  GetImportJobResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJourneyRuns: (
  input: GetJourneyRunsRequest,
) => effect.Effect<
  GetJourneyRunsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about all the versions of a specific message template.
 */
export const listTemplateVersions: (
  input: ListTemplateVersionsRequest,
) => effect.Effect<
  ListTemplateVersionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about a phone number.
 */
export const phoneNumberValidate: (
  input: PhoneNumberValidateRequest,
) => effect.Effect<
  PhoneNumberValidateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeAttributes: (
  input: RemoveAttributesRequest,
) => effect.Effect<
  RemoveAttributesResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplicationSettings: (
  input: UpdateApplicationSettingsRequest,
) => effect.Effect<
  UpdateApplicationSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new endpoint for an application or updates the settings and attributes of an existing endpoint for an application. You can also use this operation to define custom attributes for an endpoint. If an update includes one or more values for a custom attribute, Amazon Pinpoint replaces (overwrites) any existing values with the new values.
 */
export const updateEndpoint: (
  input: UpdateEndpointRequest,
) => effect.Effect<
  UpdateEndpointResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEndpointsBatch: (
  input: UpdateEndpointsBatchRequest,
) => effect.Effect<
  UpdateEndpointsBatchResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Verify an OTP
 */
export const verifyOTPMessage: (
  input: VerifyOTPMessageRequest,
) => effect.Effect<
  VerifyOTPMessageResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the configuration and other settings for a journey.
 */
export const updateJourney: (
  input: UpdateJourneyRequest,
) => effect.Effect<
  UpdateJourneyResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a journey from an application.
 */
export const deleteJourney: (
  input: DeleteJourneyRequest,
) => effect.Effect<
  DeleteJourneyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an Amazon Pinpoint configuration for a recommender model.
 */
export const deleteRecommenderConfiguration: (
  input: DeleteRecommenderConfigurationRequest,
) => effect.Effect<
  DeleteRecommenderConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSmsChannel: (
  input: DeleteSmsChannelRequest,
) => effect.Effect<
  DeleteSmsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes all the endpoints that are associated with a specific user ID.
 */
export const deleteUserEndpoints: (
  input: DeleteUserEndpointsRequest,
) => effect.Effect<
  DeleteUserEndpointsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVoiceChannel: (
  input: DeleteVoiceChannelRequest,
) => effect.Effect<
  DeleteVoiceChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about the settings for an application.
 */
export const getApplicationSettings: (
  input: GetApplicationSettingsRequest,
) => effect.Effect<
  GetApplicationSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about all the applications that are associated with your Amazon Pinpoint account.
 */
export const getApps: (
  input: GetAppsRequest,
) => effect.Effect<
  GetAppsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCampaignDateRangeKpi: (
  input: GetCampaignDateRangeKpiRequest,
) => effect.Effect<
  GetCampaignDateRangeKpiResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the status, configuration, and other settings for all the campaigns that are associated with an application.
 */
export const getCampaigns: (
  input: GetCampaignsRequest,
) => effect.Effect<
  GetCampaignsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEmailTemplate: (
  input: GetEmailTemplateRequest,
) => effect.Effect<
  GetEmailTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getExportJobs: (
  input: GetExportJobsRequest,
) => effect.Effect<
  GetExportJobsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getImportJobs: (
  input: GetImportJobsRequest,
) => effect.Effect<
  GetImportJobsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getInAppTemplate: (
  input: GetInAppTemplateRequest,
) => effect.Effect<
  GetInAppTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJourneyDateRangeKpi: (
  input: GetJourneyDateRangeKpiRequest,
) => effect.Effect<
  GetJourneyDateRangeKpiResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves (queries) pre-aggregated data for a standard execution metric that applies to a journey activity.
 */
export const getJourneyExecutionActivityMetrics: (
  input: GetJourneyExecutionActivityMetricsRequest,
) => effect.Effect<
  GetJourneyExecutionActivityMetricsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJourneyExecutionMetrics: (
  input: GetJourneyExecutionMetricsRequest,
) => effect.Effect<
  GetJourneyExecutionMetricsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves (queries) pre-aggregated data for a standard run execution metric that applies to a journey activity.
 */
export const getJourneyRunExecutionActivityMetrics: (
  input: GetJourneyRunExecutionActivityMetricsRequest,
) => effect.Effect<
  GetJourneyRunExecutionActivityMetricsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJourneyRunExecutionMetrics: (
  input: GetJourneyRunExecutionMetricsRequest,
) => effect.Effect<
  GetJourneyRunExecutionMetricsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPushTemplate: (
  input: GetPushTemplateRequest,
) => effect.Effect<
  GetPushTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecommenderConfigurations: (
  input: GetRecommenderConfigurationsRequest,
) => effect.Effect<
  GetRecommenderConfigurationsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegments: (
  input: GetSegmentsRequest,
) => effect.Effect<
  GetSegmentsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSmsTemplate: (
  input: GetSmsTemplateRequest,
) => effect.Effect<
  GetSmsTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceTemplate: (
  input: GetVoiceTemplateRequest,
) => effect.Effect<
  GetVoiceTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJourneys: (
  input: ListJourneysRequest,
) => effect.Effect<
  ListJourneysResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putEventStream: (
  input: PutEventStreamRequest,
) => effect.Effect<
  PutEventStreamResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAdmChannel: (
  input: UpdateAdmChannelRequest,
) => effect.Effect<
  UpdateAdmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApnsChannel: (
  input: UpdateApnsChannelRequest,
) => effect.Effect<
  UpdateApnsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApnsSandboxChannel: (
  input: UpdateApnsSandboxChannelRequest,
) => effect.Effect<
  UpdateApnsSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables the APNs VoIP channel for an application or updates the status and settings of the APNs VoIP channel for an application.
 */
export const updateApnsVoipChannel: (
  input: UpdateApnsVoipChannelRequest,
) => effect.Effect<
  UpdateApnsVoipChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables the APNs VoIP sandbox channel for an application or updates the status and settings of the APNs VoIP sandbox channel for an application.
 */
export const updateApnsVoipSandboxChannel: (
  input: UpdateApnsVoipSandboxChannelRequest,
) => effect.Effect<
  UpdateApnsVoipSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBaiduChannel: (
  input: UpdateBaiduChannelRequest,
) => effect.Effect<
  UpdateBaiduChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEmailChannel: (
  input: UpdateEmailChannelRequest,
) => effect.Effect<
  UpdateEmailChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGcmChannel: (
  input: UpdateGcmChannelRequest,
) => effect.Effect<
  UpdateGcmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels (stops) an active journey.
 */
export const updateJourneyState: (
  input: UpdateJourneyStateRequest,
) => effect.Effect<
  UpdateJourneyStateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRecommenderConfiguration: (
  input: UpdateRecommenderConfigurationRequest,
) => effect.Effect<
  UpdateRecommenderConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSmsChannel: (
  input: UpdateSmsChannelRequest,
) => effect.Effect<
  UpdateSmsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTemplateActiveVersion: (
  input: UpdateTemplateActiveVersionRequest,
) => effect.Effect<
  UpdateTemplateActiveVersionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables the voice channel for an application or updates the status and settings of the voice channel for an application.
 */
export const updateVoiceChannel: (
  input: UpdateVoiceChannelRequest,
) => effect.Effect<
  UpdateVoiceChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a message template for messages that were sent through a push notification channel.
 */
export const deletePushTemplate: (
  input: DeletePushTemplateRequest,
) => effect.Effect<
  DeletePushTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a message template for messages that were sent through the SMS channel.
 */
export const deleteSmsTemplate: (
  input: DeleteSmsTemplateRequest,
) => effect.Effect<
  DeleteSmsTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a message template for messages that were sent through the voice channel.
 */
export const deleteVoiceTemplate: (
  input: DeleteVoiceTemplateRequest,
) => effect.Effect<
  DeleteVoiceTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAdmChannel: (
  input: GetAdmChannelRequest,
) => effect.Effect<
  GetAdmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApnsChannel: (
  input: GetApnsChannelRequest,
) => effect.Effect<
  GetApnsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApnsSandboxChannel: (
  input: GetApnsSandboxChannelRequest,
) => effect.Effect<
  GetApnsSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the status and settings of the APNs VoIP channel for an application.
 */
export const getApnsVoipChannel: (
  input: GetApnsVoipChannelRequest,
) => effect.Effect<
  GetApnsVoipChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApnsVoipSandboxChannel: (
  input: GetApnsVoipSandboxChannelRequest,
) => effect.Effect<
  GetApnsVoipSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about an application.
 */
export const getApp: (
  input: GetAppRequest,
) => effect.Effect<
  GetAppResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBaiduChannel: (
  input: GetBaiduChannelRequest,
) => effect.Effect<
  GetBaiduChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCampaign: (
  input: GetCampaignRequest,
) => effect.Effect<
  GetCampaignResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCampaignVersion: (
  input: GetCampaignVersionRequest,
) => effect.Effect<
  GetCampaignVersionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCampaignVersions: (
  input: GetCampaignVersionsRequest,
) => effect.Effect<
  GetCampaignVersionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEmailChannel: (
  input: GetEmailChannelRequest,
) => effect.Effect<
  GetEmailChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEndpoint: (
  input: GetEndpointRequest,
) => effect.Effect<
  GetEndpointResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getEventStream: (
  input: GetEventStreamRequest,
) => effect.Effect<
  GetEventStreamResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getGcmChannel: (
  input: GetGcmChannelRequest,
) => effect.Effect<
  GetGcmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJourney: (
  input: GetJourneyRequest,
) => effect.Effect<
  GetJourneyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecommenderConfiguration: (
  input: GetRecommenderConfigurationRequest,
) => effect.Effect<
  GetRecommenderConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the configuration, dimension, and other settings for a specific segment that's associated with an application.
 */
export const getSegment: (
  input: GetSegmentRequest,
) => effect.Effect<
  GetSegmentResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegmentExportJobs: (
  input: GetSegmentExportJobsRequest,
) => effect.Effect<
  GetSegmentExportJobsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the status and settings of the import jobs for a segment.
 */
export const getSegmentImportJobs: (
  input: GetSegmentImportJobsRequest,
) => effect.Effect<
  GetSegmentImportJobsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves information about the configuration, dimension, and other settings for a specific version of a segment that's associated with an application.
 */
export const getSegmentVersion: (
  input: GetSegmentVersionRequest,
) => effect.Effect<
  GetSegmentVersionResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSegmentVersions: (
  input: GetSegmentVersionsRequest,
) => effect.Effect<
  GetSegmentVersionsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSmsChannel: (
  input: GetSmsChannelRequest,
) => effect.Effect<
  GetSmsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUserEndpoints: (
  input: GetUserEndpointsRequest,
) => effect.Effect<
  GetUserEndpointsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVoiceChannel: (
  input: GetVoiceChannelRequest,
) => effect.Effect<
  GetVoiceChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the configuration and other settings for a campaign.
 */
export const updateCampaign: (
  input: UpdateCampaignRequest,
) => effect.Effect<
  UpdateCampaignResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEmailTemplate: (
  input: UpdateEmailTemplateRequest,
) => effect.Effect<
  UpdateEmailTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateInAppTemplate: (
  input: UpdateInAppTemplateRequest,
) => effect.Effect<
  UpdateInAppTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePushTemplate: (
  input: UpdatePushTemplateRequest,
) => effect.Effect<
  UpdatePushTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSegment: (
  input: UpdateSegmentRequest,
) => effect.Effect<
  UpdateSegmentResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSmsTemplate: (
  input: UpdateSmsTemplateRequest,
) => effect.Effect<
  UpdateSmsTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVoiceTemplate: (
  input: UpdateVoiceTemplateRequest,
) => effect.Effect<
  UpdateVoiceTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createExportJob: (
  input: CreateExportJobRequest,
) => effect.Effect<
  CreateExportJobResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createImportJob: (
  input: CreateImportJobRequest,
) => effect.Effect<
  CreateImportJobResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRecommenderConfiguration: (
  input: CreateRecommenderConfigurationRequest,
) => effect.Effect<
  CreateRecommenderConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disables the ADM channel for an application and deletes any existing settings for the channel.
 */
export const deleteAdmChannel: (
  input: DeleteAdmChannelRequest,
) => effect.Effect<
  DeleteAdmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApnsChannel: (
  input: DeleteApnsChannelRequest,
) => effect.Effect<
  DeleteApnsChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApnsSandboxChannel: (
  input: DeleteApnsSandboxChannelRequest,
) => effect.Effect<
  DeleteApnsSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disables the APNs VoIP channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsVoipChannel: (
  input: DeleteApnsVoipChannelRequest,
) => effect.Effect<
  DeleteApnsVoipChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Disables the APNs VoIP sandbox channel for an application and deletes any existing settings for the channel.
 */
export const deleteApnsVoipSandboxChannel: (
  input: DeleteApnsVoipSandboxChannelRequest,
) => effect.Effect<
  DeleteApnsVoipSandboxChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApp: (
  input: DeleteAppRequest,
) => effect.Effect<
  DeleteAppResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBaiduChannel: (
  input: DeleteBaiduChannelRequest,
) => effect.Effect<
  DeleteBaiduChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEmailChannel: (
  input: DeleteEmailChannelRequest,
) => effect.Effect<
  DeleteEmailChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEmailTemplate: (
  input: DeleteEmailTemplateRequest,
) => effect.Effect<
  DeleteEmailTemplateResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEndpoint: (
  input: DeleteEndpointRequest,
) => effect.Effect<
  DeleteEndpointResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEventStream: (
  input: DeleteEventStreamRequest,
) => effect.Effect<
  DeleteEventStreamResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteGcmChannel: (
  input: DeleteGcmChannelRequest,
) => effect.Effect<
  DeleteGcmChannelResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an application.
 */
export const createApp: (
  input: CreateAppRequest,
) => effect.Effect<
  CreateAppResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a campaign from an application.
 */
export const deleteCampaign: (
  input: DeleteCampaignRequest,
) => effect.Effect<
  DeleteCampaignResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new campaign for an application or updates the settings of an existing campaign for an application.
 */
export const createCampaign: (
  input: CreateCampaignRequest,
) => effect.Effect<
  CreateCampaignResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new segment for an application or updates the configuration, dimension, and other settings for an existing segment that's associated with an application.
 */
export const createSegment: (
  input: CreateSegmentRequest,
) => effect.Effect<
  CreateSegmentResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a journey for an application.
 */
export const createJourney: (
  input: CreateJourneyRequest,
) => effect.Effect<
  CreateJourneyResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putEvents: (
  input: PutEventsRequest,
) => effect.Effect<
  PutEventsResponse,
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | MethodNotAllowedException
  | NotFoundException
  | PayloadTooLargeException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
