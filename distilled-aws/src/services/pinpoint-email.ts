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
  sdkId: "Pinpoint Email",
  serviceShapeName: "AmazonPinpointEmailService",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2018-07-26");
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
              `https://email-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://email-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://email.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://email.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ConfigurationSetName = string;
export type EventDestinationName = string;
export type PoolName = string;
export type ReportName = string;
export type EmailAddress = string;
export type Identity = string;
export type Enabled = boolean;
export type GeneralEnforcementStatus = string;
export type BlacklistItemName = string;
export type Ip = string;
export type NextToken = string;
export type MaxItems = number;
export type ReportId = string;
export type CampaignId = string;
export type Domain = string;
export type AmazonResourceName = string;
export type SendingPoolName = string;
export type CustomRedirectDomain = string;
export type Percentage100Wrapper = number;
export type MailFromDomainName = string;
export type TagKey = string;
export type LastFreshStart = Date;
export type TagValue = string;
export type Max24HourSend = number;
export type MaxSendRate = number;
export type SentLast24Hours = number;
export type MessageTagName = string;
export type MessageTagValue = string;
export type ErrorMessage = string;
export type MessageContent = string;
export type RawMessageData = Uint8Array;
export type TemplateArn = string;
export type TemplateData = string;
export type IspName = string;
export type DnsToken = string;
export type DeliverabilityTestSubject = string;
export type Percentage = number;
export type ImageUrl = string;
export type Subject = string;
export type Volume = number;
export type Esp = string;
export type DimensionName = string;
export type DefaultDimensionValue = string;
export type MessageData = string;
export type Charset = string;
export type OutboundMessageId = string;
export type RblName = string;
export type BlacklistingDescription = string;

//# Schemas
export interface GetAccountRequest {}
export const GetAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/account" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountRequest",
}) as any as S.Schema<GetAccountRequest>;
export interface GetDeliverabilityDashboardOptionsRequest {}
export const GetDeliverabilityDashboardOptionsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/deliverability-dashboard" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeliverabilityDashboardOptionsRequest",
}) as any as S.Schema<GetDeliverabilityDashboardOptionsRequest>;
export type BlacklistItemNames = string[];
export const BlacklistItemNames = S.Array(S.String);
export type DeliverabilityDashboardAccountStatus =
  | "ACTIVE"
  | "PENDING_EXPIRATION"
  | "DISABLED"
  | (string & {});
export const DeliverabilityDashboardAccountStatus = S.String;
export type TlsPolicy = "REQUIRE" | "OPTIONAL" | (string & {});
export const TlsPolicy = S.String;
export type BehaviorOnMxFailure =
  | "USE_DEFAULT_VALUE"
  | "REJECT_MESSAGE"
  | (string & {});
export const BehaviorOnMxFailure = S.String;
export type EmailAddressList = string[];
export const EmailAddressList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateDedicatedIpPoolRequest {
  PoolName: string;
  Tags?: Tag[];
}
export const CreateDedicatedIpPoolRequest = S.suspend(() =>
  S.Struct({ PoolName: S.String, Tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/email/dedicated-ip-pools" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDedicatedIpPoolRequest",
}) as any as S.Schema<CreateDedicatedIpPoolRequest>;
export interface CreateDedicatedIpPoolResponse {}
export const CreateDedicatedIpPoolResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateDedicatedIpPoolResponse",
}) as any as S.Schema<CreateDedicatedIpPoolResponse>;
export interface CreateEmailIdentityRequest {
  EmailIdentity: string;
  Tags?: Tag[];
}
export const CreateEmailIdentityRequest = S.suspend(() =>
  S.Struct({ EmailIdentity: S.String, Tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/email/identities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEmailIdentityRequest",
}) as any as S.Schema<CreateEmailIdentityRequest>;
export interface DeleteConfigurationSetRequest {
  ConfigurationSetName: string;
}
export const DeleteConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetRequest",
}) as any as S.Schema<DeleteConfigurationSetRequest>;
export interface DeleteConfigurationSetResponse {}
export const DeleteConfigurationSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationSetResponse",
}) as any as S.Schema<DeleteConfigurationSetResponse>;
export interface DeleteConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
}
export const DeleteConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestinationName: S.String.pipe(T.HttpLabel("EventDestinationName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationRequest",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationRequest>;
export interface DeleteConfigurationSetEventDestinationResponse {}
export const DeleteConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationResponse",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationResponse>;
export interface DeleteDedicatedIpPoolRequest {
  PoolName: string;
}
export const DeleteDedicatedIpPoolRequest = S.suspend(() =>
  S.Struct({ PoolName: S.String.pipe(T.HttpLabel("PoolName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v1/email/dedicated-ip-pools/{PoolName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDedicatedIpPoolRequest",
}) as any as S.Schema<DeleteDedicatedIpPoolRequest>;
export interface DeleteDedicatedIpPoolResponse {}
export const DeleteDedicatedIpPoolResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDedicatedIpPoolResponse",
}) as any as S.Schema<DeleteDedicatedIpPoolResponse>;
export interface DeleteEmailIdentityRequest {
  EmailIdentity: string;
}
export const DeleteEmailIdentityRequest = S.suspend(() =>
  S.Struct({ EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/email/identities/{EmailIdentity}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEmailIdentityRequest",
}) as any as S.Schema<DeleteEmailIdentityRequest>;
export interface DeleteEmailIdentityResponse {}
export const DeleteEmailIdentityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEmailIdentityResponse",
}) as any as S.Schema<DeleteEmailIdentityResponse>;
export interface GetBlacklistReportsRequest {
  BlacklistItemNames: string[];
}
export const GetBlacklistReportsRequest = S.suspend(() =>
  S.Struct({
    BlacklistItemNames: BlacklistItemNames.pipe(
      T.HttpQuery("BlacklistItemNames"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/blacklist-report",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBlacklistReportsRequest",
}) as any as S.Schema<GetBlacklistReportsRequest>;
export interface GetConfigurationSetRequest {
  ConfigurationSetName: string;
}
export const GetConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationSetRequest",
}) as any as S.Schema<GetConfigurationSetRequest>;
export interface GetConfigurationSetEventDestinationsRequest {
  ConfigurationSetName: string;
}
export const GetConfigurationSetEventDestinationsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfigurationSetEventDestinationsRequest",
}) as any as S.Schema<GetConfigurationSetEventDestinationsRequest>;
export interface GetDedicatedIpRequest {
  Ip: string;
}
export const GetDedicatedIpRequest = S.suspend(() =>
  S.Struct({ Ip: S.String.pipe(T.HttpLabel("Ip")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/dedicated-ips/{Ip}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDedicatedIpRequest",
}) as any as S.Schema<GetDedicatedIpRequest>;
export interface GetDedicatedIpsRequest {
  PoolName?: string;
  NextToken?: string;
  PageSize?: number;
}
export const GetDedicatedIpsRequest = S.suspend(() =>
  S.Struct({
    PoolName: S.optional(S.String).pipe(T.HttpQuery("PoolName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/dedicated-ips" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDedicatedIpsRequest",
}) as any as S.Schema<GetDedicatedIpsRequest>;
export interface GetDeliverabilityTestReportRequest {
  ReportId: string;
}
export const GetDeliverabilityTestReportRequest = S.suspend(() =>
  S.Struct({ ReportId: S.String.pipe(T.HttpLabel("ReportId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/test-reports/{ReportId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeliverabilityTestReportRequest",
}) as any as S.Schema<GetDeliverabilityTestReportRequest>;
export interface GetDomainDeliverabilityCampaignRequest {
  CampaignId: string;
}
export const GetDomainDeliverabilityCampaignRequest = S.suspend(() =>
  S.Struct({ CampaignId: S.String.pipe(T.HttpLabel("CampaignId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/campaigns/{CampaignId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainDeliverabilityCampaignRequest",
}) as any as S.Schema<GetDomainDeliverabilityCampaignRequest>;
export interface GetDomainStatisticsReportRequest {
  Domain: string;
  StartDate: Date;
  EndDate: Date;
}
export const GetDomainStatisticsReportRequest = S.suspend(() =>
  S.Struct({
    Domain: S.String.pipe(T.HttpLabel("Domain")),
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartDate"),
    ),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndDate"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/statistics-report/{Domain}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainStatisticsReportRequest",
}) as any as S.Schema<GetDomainStatisticsReportRequest>;
export interface GetEmailIdentityRequest {
  EmailIdentity: string;
}
export const GetEmailIdentityRequest = S.suspend(() =>
  S.Struct({ EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/identities/{EmailIdentity}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEmailIdentityRequest",
}) as any as S.Schema<GetEmailIdentityRequest>;
export interface ListConfigurationSetsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListConfigurationSetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/configuration-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationSetsRequest",
}) as any as S.Schema<ListConfigurationSetsRequest>;
export interface ListDedicatedIpPoolsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListDedicatedIpPoolsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/dedicated-ip-pools" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDedicatedIpPoolsRequest",
}) as any as S.Schema<ListDedicatedIpPoolsRequest>;
export interface ListDeliverabilityTestReportsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListDeliverabilityTestReportsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/test-reports",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeliverabilityTestReportsRequest",
}) as any as S.Schema<ListDeliverabilityTestReportsRequest>;
export interface ListDomainDeliverabilityCampaignsRequest {
  StartDate: Date;
  EndDate: Date;
  SubscribedDomain: string;
  NextToken?: string;
  PageSize?: number;
}
export const ListDomainDeliverabilityCampaignsRequest = S.suspend(() =>
  S.Struct({
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("StartDate"),
    ),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")).pipe(
      T.HttpQuery("EndDate"),
    ),
    SubscribedDomain: S.String.pipe(T.HttpLabel("SubscribedDomain")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v1/email/deliverability-dashboard/domains/{SubscribedDomain}/campaigns",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainDeliverabilityCampaignsRequest",
}) as any as S.Schema<ListDomainDeliverabilityCampaignsRequest>;
export interface ListEmailIdentitiesRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListEmailIdentitiesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/identities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEmailIdentitiesRequest",
}) as any as S.Schema<ListEmailIdentitiesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/email/tags" }),
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
export interface PutAccountDedicatedIpWarmupAttributesRequest {
  AutoWarmupEnabled?: boolean;
}
export const PutAccountDedicatedIpWarmupAttributesRequest = S.suspend(() =>
  S.Struct({ AutoWarmupEnabled: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/email/account/dedicated-ips/warmup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountDedicatedIpWarmupAttributesRequest",
}) as any as S.Schema<PutAccountDedicatedIpWarmupAttributesRequest>;
export interface PutAccountDedicatedIpWarmupAttributesResponse {}
export const PutAccountDedicatedIpWarmupAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccountDedicatedIpWarmupAttributesResponse",
}) as any as S.Schema<PutAccountDedicatedIpWarmupAttributesResponse>;
export interface PutAccountSendingAttributesRequest {
  SendingEnabled?: boolean;
}
export const PutAccountSendingAttributesRequest = S.suspend(() =>
  S.Struct({ SendingEnabled: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/email/account/sending" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountSendingAttributesRequest",
}) as any as S.Schema<PutAccountSendingAttributesRequest>;
export interface PutAccountSendingAttributesResponse {}
export const PutAccountSendingAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccountSendingAttributesResponse",
}) as any as S.Schema<PutAccountSendingAttributesResponse>;
export interface PutConfigurationSetDeliveryOptionsRequest {
  ConfigurationSetName: string;
  TlsPolicy?: TlsPolicy;
  SendingPoolName?: string;
}
export const PutConfigurationSetDeliveryOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    TlsPolicy: S.optional(TlsPolicy),
    SendingPoolName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/delivery-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetDeliveryOptionsRequest",
}) as any as S.Schema<PutConfigurationSetDeliveryOptionsRequest>;
export interface PutConfigurationSetDeliveryOptionsResponse {}
export const PutConfigurationSetDeliveryOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetDeliveryOptionsResponse",
}) as any as S.Schema<PutConfigurationSetDeliveryOptionsResponse>;
export interface PutConfigurationSetReputationOptionsRequest {
  ConfigurationSetName: string;
  ReputationMetricsEnabled?: boolean;
}
export const PutConfigurationSetReputationOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    ReputationMetricsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/reputation-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetReputationOptionsRequest",
}) as any as S.Schema<PutConfigurationSetReputationOptionsRequest>;
export interface PutConfigurationSetReputationOptionsResponse {}
export const PutConfigurationSetReputationOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetReputationOptionsResponse",
}) as any as S.Schema<PutConfigurationSetReputationOptionsResponse>;
export interface PutConfigurationSetSendingOptionsRequest {
  ConfigurationSetName: string;
  SendingEnabled?: boolean;
}
export const PutConfigurationSetSendingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    SendingEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/sending",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetSendingOptionsRequest",
}) as any as S.Schema<PutConfigurationSetSendingOptionsRequest>;
export interface PutConfigurationSetSendingOptionsResponse {}
export const PutConfigurationSetSendingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetSendingOptionsResponse",
}) as any as S.Schema<PutConfigurationSetSendingOptionsResponse>;
export interface PutConfigurationSetTrackingOptionsRequest {
  ConfigurationSetName: string;
  CustomRedirectDomain?: string;
}
export const PutConfigurationSetTrackingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    CustomRedirectDomain: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/tracking-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetTrackingOptionsRequest",
}) as any as S.Schema<PutConfigurationSetTrackingOptionsRequest>;
export interface PutConfigurationSetTrackingOptionsResponse {}
export const PutConfigurationSetTrackingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetTrackingOptionsResponse",
}) as any as S.Schema<PutConfigurationSetTrackingOptionsResponse>;
export interface PutDedicatedIpInPoolRequest {
  Ip: string;
  DestinationPoolName: string;
}
export const PutDedicatedIpInPoolRequest = S.suspend(() =>
  S.Struct({
    Ip: S.String.pipe(T.HttpLabel("Ip")),
    DestinationPoolName: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/email/dedicated-ips/{Ip}/pool" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDedicatedIpInPoolRequest",
}) as any as S.Schema<PutDedicatedIpInPoolRequest>;
export interface PutDedicatedIpInPoolResponse {}
export const PutDedicatedIpInPoolResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDedicatedIpInPoolResponse",
}) as any as S.Schema<PutDedicatedIpInPoolResponse>;
export interface PutDedicatedIpWarmupAttributesRequest {
  Ip: string;
  WarmupPercentage: number;
}
export const PutDedicatedIpWarmupAttributesRequest = S.suspend(() =>
  S.Struct({
    Ip: S.String.pipe(T.HttpLabel("Ip")),
    WarmupPercentage: S.Number,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/email/dedicated-ips/{Ip}/warmup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDedicatedIpWarmupAttributesRequest",
}) as any as S.Schema<PutDedicatedIpWarmupAttributesRequest>;
export interface PutDedicatedIpWarmupAttributesResponse {}
export const PutDedicatedIpWarmupAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDedicatedIpWarmupAttributesResponse",
}) as any as S.Schema<PutDedicatedIpWarmupAttributesResponse>;
export type IspNameList = string[];
export const IspNameList = S.Array(S.String);
export interface InboxPlacementTrackingOption {
  Global?: boolean;
  TrackedIsps?: string[];
}
export const InboxPlacementTrackingOption = S.suspend(() =>
  S.Struct({
    Global: S.optional(S.Boolean),
    TrackedIsps: S.optional(IspNameList),
  }),
).annotations({
  identifier: "InboxPlacementTrackingOption",
}) as any as S.Schema<InboxPlacementTrackingOption>;
export interface DomainDeliverabilityTrackingOption {
  Domain?: string;
  SubscriptionStartDate?: Date;
  InboxPlacementTrackingOption?: InboxPlacementTrackingOption;
}
export const DomainDeliverabilityTrackingOption = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    SubscriptionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InboxPlacementTrackingOption: S.optional(InboxPlacementTrackingOption),
  }),
).annotations({
  identifier: "DomainDeliverabilityTrackingOption",
}) as any as S.Schema<DomainDeliverabilityTrackingOption>;
export type DomainDeliverabilityTrackingOptions =
  DomainDeliverabilityTrackingOption[];
export const DomainDeliverabilityTrackingOptions = S.Array(
  DomainDeliverabilityTrackingOption,
);
export interface PutDeliverabilityDashboardOptionRequest {
  DashboardEnabled: boolean;
  SubscribedDomains?: DomainDeliverabilityTrackingOption[];
}
export const PutDeliverabilityDashboardOptionRequest = S.suspend(() =>
  S.Struct({
    DashboardEnabled: S.Boolean,
    SubscribedDomains: S.optional(DomainDeliverabilityTrackingOptions),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/email/deliverability-dashboard" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDeliverabilityDashboardOptionRequest",
}) as any as S.Schema<PutDeliverabilityDashboardOptionRequest>;
export interface PutDeliverabilityDashboardOptionResponse {}
export const PutDeliverabilityDashboardOptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDeliverabilityDashboardOptionResponse",
}) as any as S.Schema<PutDeliverabilityDashboardOptionResponse>;
export interface PutEmailIdentityDkimAttributesRequest {
  EmailIdentity: string;
  SigningEnabled?: boolean;
}
export const PutEmailIdentityDkimAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    SigningEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/identities/{EmailIdentity}/dkim",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEmailIdentityDkimAttributesRequest",
}) as any as S.Schema<PutEmailIdentityDkimAttributesRequest>;
export interface PutEmailIdentityDkimAttributesResponse {}
export const PutEmailIdentityDkimAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutEmailIdentityDkimAttributesResponse",
}) as any as S.Schema<PutEmailIdentityDkimAttributesResponse>;
export interface PutEmailIdentityFeedbackAttributesRequest {
  EmailIdentity: string;
  EmailForwardingEnabled?: boolean;
}
export const PutEmailIdentityFeedbackAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    EmailForwardingEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/identities/{EmailIdentity}/feedback",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEmailIdentityFeedbackAttributesRequest",
}) as any as S.Schema<PutEmailIdentityFeedbackAttributesRequest>;
export interface PutEmailIdentityFeedbackAttributesResponse {}
export const PutEmailIdentityFeedbackAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutEmailIdentityFeedbackAttributesResponse",
}) as any as S.Schema<PutEmailIdentityFeedbackAttributesResponse>;
export interface PutEmailIdentityMailFromAttributesRequest {
  EmailIdentity: string;
  MailFromDomain?: string;
  BehaviorOnMxFailure?: BehaviorOnMxFailure;
}
export const PutEmailIdentityMailFromAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    MailFromDomain: S.optional(S.String),
    BehaviorOnMxFailure: S.optional(BehaviorOnMxFailure),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/identities/{EmailIdentity}/mail-from",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEmailIdentityMailFromAttributesRequest",
}) as any as S.Schema<PutEmailIdentityMailFromAttributesRequest>;
export interface PutEmailIdentityMailFromAttributesResponse {}
export const PutEmailIdentityMailFromAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutEmailIdentityMailFromAttributesResponse",
}) as any as S.Schema<PutEmailIdentityMailFromAttributesResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/email/tags" }),
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/email/tags" }),
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
export type EventType =
  | "SEND"
  | "REJECT"
  | "BOUNCE"
  | "COMPLAINT"
  | "DELIVERY"
  | "OPEN"
  | "CLICK"
  | "RENDERING_FAILURE"
  | (string & {});
export const EventType = S.String;
export type EventTypes = EventType[];
export const EventTypes = S.Array(EventType);
export interface KinesisFirehoseDestination {
  IamRoleArn: string;
  DeliveryStreamArn: string;
}
export const KinesisFirehoseDestination = S.suspend(() =>
  S.Struct({ IamRoleArn: S.String, DeliveryStreamArn: S.String }),
).annotations({
  identifier: "KinesisFirehoseDestination",
}) as any as S.Schema<KinesisFirehoseDestination>;
export type DimensionValueSource =
  | "MESSAGE_TAG"
  | "EMAIL_HEADER"
  | "LINK_TAG"
  | (string & {});
export const DimensionValueSource = S.String;
export interface CloudWatchDimensionConfiguration {
  DimensionName: string;
  DimensionValueSource: DimensionValueSource;
  DefaultDimensionValue: string;
}
export const CloudWatchDimensionConfiguration = S.suspend(() =>
  S.Struct({
    DimensionName: S.String,
    DimensionValueSource: DimensionValueSource,
    DefaultDimensionValue: S.String,
  }),
).annotations({
  identifier: "CloudWatchDimensionConfiguration",
}) as any as S.Schema<CloudWatchDimensionConfiguration>;
export type CloudWatchDimensionConfigurations =
  CloudWatchDimensionConfiguration[];
export const CloudWatchDimensionConfigurations = S.Array(
  CloudWatchDimensionConfiguration,
);
export interface CloudWatchDestination {
  DimensionConfigurations: CloudWatchDimensionConfiguration[];
}
export const CloudWatchDestination = S.suspend(() =>
  S.Struct({ DimensionConfigurations: CloudWatchDimensionConfigurations }),
).annotations({
  identifier: "CloudWatchDestination",
}) as any as S.Schema<CloudWatchDestination>;
export interface SnsDestination {
  TopicArn: string;
}
export const SnsDestination = S.suspend(() =>
  S.Struct({ TopicArn: S.String }),
).annotations({
  identifier: "SnsDestination",
}) as any as S.Schema<SnsDestination>;
export interface PinpointDestination {
  ApplicationArn?: string;
}
export const PinpointDestination = S.suspend(() =>
  S.Struct({ ApplicationArn: S.optional(S.String) }),
).annotations({
  identifier: "PinpointDestination",
}) as any as S.Schema<PinpointDestination>;
export interface EventDestinationDefinition {
  Enabled?: boolean;
  MatchingEventTypes?: EventType[];
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  CloudWatchDestination?: CloudWatchDestination;
  SnsDestination?: SnsDestination;
  PinpointDestination?: PinpointDestination;
}
export const EventDestinationDefinition = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: S.optional(EventTypes),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    CloudWatchDestination: S.optional(CloudWatchDestination),
    SnsDestination: S.optional(SnsDestination),
    PinpointDestination: S.optional(PinpointDestination),
  }),
).annotations({
  identifier: "EventDestinationDefinition",
}) as any as S.Schema<EventDestinationDefinition>;
export interface UpdateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
  EventDestination: EventDestinationDefinition;
}
export const UpdateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestinationName: S.String.pipe(T.HttpLabel("EventDestinationName")),
    EventDestination: EventDestinationDefinition,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationRequest>;
export interface UpdateConfigurationSetEventDestinationResponse {}
export const UpdateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationResponse>;
export interface TrackingOptions {
  CustomRedirectDomain: string;
}
export const TrackingOptions = S.suspend(() =>
  S.Struct({ CustomRedirectDomain: S.String }),
).annotations({
  identifier: "TrackingOptions",
}) as any as S.Schema<TrackingOptions>;
export interface DeliveryOptions {
  TlsPolicy?: TlsPolicy;
  SendingPoolName?: string;
}
export const DeliveryOptions = S.suspend(() =>
  S.Struct({
    TlsPolicy: S.optional(TlsPolicy),
    SendingPoolName: S.optional(S.String),
  }),
).annotations({
  identifier: "DeliveryOptions",
}) as any as S.Schema<DeliveryOptions>;
export interface ReputationOptions {
  ReputationMetricsEnabled?: boolean;
  LastFreshStart?: Date;
}
export const ReputationOptions = S.suspend(() =>
  S.Struct({
    ReputationMetricsEnabled: S.optional(S.Boolean),
    LastFreshStart: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ReputationOptions",
}) as any as S.Schema<ReputationOptions>;
export interface SendingOptions {
  SendingEnabled?: boolean;
}
export const SendingOptions = S.suspend(() =>
  S.Struct({ SendingEnabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "SendingOptions",
}) as any as S.Schema<SendingOptions>;
export type IdentityType =
  | "EMAIL_ADDRESS"
  | "DOMAIN"
  | "MANAGED_DOMAIN"
  | (string & {});
export const IdentityType = S.String;
export interface SendQuota {
  Max24HourSend?: number;
  MaxSendRate?: number;
  SentLast24Hours?: number;
}
export const SendQuota = S.suspend(() =>
  S.Struct({
    Max24HourSend: S.optional(S.Number),
    MaxSendRate: S.optional(S.Number),
    SentLast24Hours: S.optional(S.Number),
  }),
).annotations({ identifier: "SendQuota" }) as any as S.Schema<SendQuota>;
export type WarmupStatus = "IN_PROGRESS" | "DONE" | (string & {});
export const WarmupStatus = S.String;
export interface DedicatedIp {
  Ip: string;
  WarmupStatus: WarmupStatus;
  WarmupPercentage: number;
  PoolName?: string;
}
export const DedicatedIp = S.suspend(() =>
  S.Struct({
    Ip: S.String,
    WarmupStatus: WarmupStatus,
    WarmupPercentage: S.Number,
    PoolName: S.optional(S.String),
  }),
).annotations({ identifier: "DedicatedIp" }) as any as S.Schema<DedicatedIp>;
export type DedicatedIpList = DedicatedIp[];
export const DedicatedIpList = S.Array(DedicatedIp);
export type ConfigurationSetNameList = string[];
export const ConfigurationSetNameList = S.Array(S.String);
export type ListOfDedicatedIpPools = string[];
export const ListOfDedicatedIpPools = S.Array(S.String);
export type DeliverabilityTestStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | (string & {});
export const DeliverabilityTestStatus = S.String;
export interface DeliverabilityTestReport {
  ReportId?: string;
  ReportName?: string;
  Subject?: string;
  FromEmailAddress?: string;
  CreateDate?: Date;
  DeliverabilityTestStatus?: DeliverabilityTestStatus;
}
export const DeliverabilityTestReport = S.suspend(() =>
  S.Struct({
    ReportId: S.optional(S.String),
    ReportName: S.optional(S.String),
    Subject: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeliverabilityTestStatus: S.optional(DeliverabilityTestStatus),
  }),
).annotations({
  identifier: "DeliverabilityTestReport",
}) as any as S.Schema<DeliverabilityTestReport>;
export type DeliverabilityTestReports = DeliverabilityTestReport[];
export const DeliverabilityTestReports = S.Array(DeliverabilityTestReport);
export type IpList = string[];
export const IpList = S.Array(S.String);
export type Esps = string[];
export const Esps = S.Array(S.String);
export interface DomainDeliverabilityCampaign {
  CampaignId?: string;
  ImageUrl?: string;
  Subject?: string;
  FromAddress?: string;
  SendingIps?: string[];
  FirstSeenDateTime?: Date;
  LastSeenDateTime?: Date;
  InboxCount?: number;
  SpamCount?: number;
  ReadRate?: number;
  DeleteRate?: number;
  ReadDeleteRate?: number;
  ProjectedVolume?: number;
  Esps?: string[];
}
export const DomainDeliverabilityCampaign = S.suspend(() =>
  S.Struct({
    CampaignId: S.optional(S.String),
    ImageUrl: S.optional(S.String),
    Subject: S.optional(S.String),
    FromAddress: S.optional(S.String),
    SendingIps: S.optional(IpList),
    FirstSeenDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSeenDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InboxCount: S.optional(S.Number),
    SpamCount: S.optional(S.Number),
    ReadRate: S.optional(S.Number),
    DeleteRate: S.optional(S.Number),
    ReadDeleteRate: S.optional(S.Number),
    ProjectedVolume: S.optional(S.Number),
    Esps: S.optional(Esps),
  }),
).annotations({
  identifier: "DomainDeliverabilityCampaign",
}) as any as S.Schema<DomainDeliverabilityCampaign>;
export type DomainDeliverabilityCampaignList = DomainDeliverabilityCampaign[];
export const DomainDeliverabilityCampaignList = S.Array(
  DomainDeliverabilityCampaign,
);
export interface Destination {
  ToAddresses?: string[];
  CcAddresses?: string[];
  BccAddresses?: string[];
}
export const Destination = S.suspend(() =>
  S.Struct({
    ToAddresses: S.optional(EmailAddressList),
    CcAddresses: S.optional(EmailAddressList),
    BccAddresses: S.optional(EmailAddressList),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface MessageTag {
  Name: string;
  Value: string;
}
export const MessageTag = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "MessageTag" }) as any as S.Schema<MessageTag>;
export type MessageTagList = MessageTag[];
export const MessageTagList = S.Array(MessageTag);
export interface CreateConfigurationSetRequest {
  ConfigurationSetName: string;
  TrackingOptions?: TrackingOptions;
  DeliveryOptions?: DeliveryOptions;
  ReputationOptions?: ReputationOptions;
  SendingOptions?: SendingOptions;
  Tags?: Tag[];
}
export const CreateConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
    SendingOptions: S.optional(SendingOptions),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/email/configuration-sets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetRequest",
}) as any as S.Schema<CreateConfigurationSetRequest>;
export interface CreateConfigurationSetResponse {}
export const CreateConfigurationSetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateConfigurationSetResponse",
}) as any as S.Schema<CreateConfigurationSetResponse>;
export interface GetAccountResponse {
  SendQuota?: SendQuota;
  SendingEnabled?: boolean;
  DedicatedIpAutoWarmupEnabled?: boolean;
  EnforcementStatus?: string;
  ProductionAccessEnabled?: boolean;
}
export const GetAccountResponse = S.suspend(() =>
  S.Struct({
    SendQuota: S.optional(SendQuota),
    SendingEnabled: S.optional(S.Boolean),
    DedicatedIpAutoWarmupEnabled: S.optional(S.Boolean),
    EnforcementStatus: S.optional(S.String),
    ProductionAccessEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetAccountResponse",
}) as any as S.Schema<GetAccountResponse>;
export interface GetConfigurationSetResponse {
  ConfigurationSetName?: string;
  TrackingOptions?: TrackingOptions;
  DeliveryOptions?: DeliveryOptions;
  ReputationOptions?: ReputationOptions;
  SendingOptions?: SendingOptions;
  Tags?: Tag[];
}
export const GetConfigurationSetResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.optional(S.String),
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
    SendingOptions: S.optional(SendingOptions),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetConfigurationSetResponse",
}) as any as S.Schema<GetConfigurationSetResponse>;
export interface GetDedicatedIpsResponse {
  DedicatedIps?: DedicatedIp[];
  NextToken?: string;
}
export const GetDedicatedIpsResponse = S.suspend(() =>
  S.Struct({
    DedicatedIps: S.optional(DedicatedIpList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDedicatedIpsResponse",
}) as any as S.Schema<GetDedicatedIpsResponse>;
export interface ListConfigurationSetsResponse {
  ConfigurationSets?: string[];
  NextToken?: string;
}
export const ListConfigurationSetsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSets: S.optional(ConfigurationSetNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationSetsResponse",
}) as any as S.Schema<ListConfigurationSetsResponse>;
export interface ListDedicatedIpPoolsResponse {
  DedicatedIpPools?: string[];
  NextToken?: string;
}
export const ListDedicatedIpPoolsResponse = S.suspend(() =>
  S.Struct({
    DedicatedIpPools: S.optional(ListOfDedicatedIpPools),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDedicatedIpPoolsResponse",
}) as any as S.Schema<ListDedicatedIpPoolsResponse>;
export interface ListDeliverabilityTestReportsResponse {
  DeliverabilityTestReports: DeliverabilityTestReport[];
  NextToken?: string;
}
export const ListDeliverabilityTestReportsResponse = S.suspend(() =>
  S.Struct({
    DeliverabilityTestReports: DeliverabilityTestReports,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeliverabilityTestReportsResponse",
}) as any as S.Schema<ListDeliverabilityTestReportsResponse>;
export interface ListDomainDeliverabilityCampaignsResponse {
  DomainDeliverabilityCampaigns: DomainDeliverabilityCampaign[];
  NextToken?: string;
}
export const ListDomainDeliverabilityCampaignsResponse = S.suspend(() =>
  S.Struct({
    DomainDeliverabilityCampaigns: DomainDeliverabilityCampaignList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDomainDeliverabilityCampaignsResponse",
}) as any as S.Schema<ListDomainDeliverabilityCampaignsResponse>;
export interface ListTagsForResourceResponse {
  Tags: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface Content {
  Data: string;
  Charset?: string;
}
export const Content = S.suspend(() =>
  S.Struct({ Data: S.String, Charset: S.optional(S.String) }),
).annotations({ identifier: "Content" }) as any as S.Schema<Content>;
export interface Body {
  Text?: Content;
  Html?: Content;
}
export const Body = S.suspend(() =>
  S.Struct({ Text: S.optional(Content), Html: S.optional(Content) }),
).annotations({ identifier: "Body" }) as any as S.Schema<Body>;
export interface Message {
  Subject: Content;
  Body: Body;
}
export const Message = S.suspend(() =>
  S.Struct({ Subject: Content, Body: Body }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export interface RawMessage {
  Data: Uint8Array;
}
export const RawMessage = S.suspend(() =>
  S.Struct({ Data: T.Blob }),
).annotations({ identifier: "RawMessage" }) as any as S.Schema<RawMessage>;
export interface Template {
  TemplateArn?: string;
  TemplateData?: string;
}
export const Template = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    TemplateData: S.optional(S.String),
  }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface EmailContent {
  Simple?: Message;
  Raw?: RawMessage;
  Template?: Template;
}
export const EmailContent = S.suspend(() =>
  S.Struct({
    Simple: S.optional(Message),
    Raw: S.optional(RawMessage),
    Template: S.optional(Template),
  }),
).annotations({ identifier: "EmailContent" }) as any as S.Schema<EmailContent>;
export interface SendEmailRequest {
  FromEmailAddress?: string;
  Destination: Destination;
  ReplyToAddresses?: string[];
  FeedbackForwardingEmailAddress?: string;
  Content: EmailContent;
  EmailTags?: MessageTag[];
  ConfigurationSetName?: string;
}
export const SendEmailRequest = S.suspend(() =>
  S.Struct({
    FromEmailAddress: S.optional(S.String),
    Destination: Destination,
    ReplyToAddresses: S.optional(EmailAddressList),
    FeedbackForwardingEmailAddress: S.optional(S.String),
    Content: EmailContent,
    EmailTags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/email/outbound-emails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendEmailRequest",
}) as any as S.Schema<SendEmailRequest>;
export type DkimStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "TEMPORARY_FAILURE"
  | "NOT_STARTED"
  | (string & {});
export const DkimStatus = S.String;
export type DnsTokenList = string[];
export const DnsTokenList = S.Array(S.String);
export type MailFromDomainStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "TEMPORARY_FAILURE"
  | (string & {});
export const MailFromDomainStatus = S.String;
export interface DkimAttributes {
  SigningEnabled?: boolean;
  Status?: DkimStatus;
  Tokens?: string[];
}
export const DkimAttributes = S.suspend(() =>
  S.Struct({
    SigningEnabled: S.optional(S.Boolean),
    Status: S.optional(DkimStatus),
    Tokens: S.optional(DnsTokenList),
  }),
).annotations({
  identifier: "DkimAttributes",
}) as any as S.Schema<DkimAttributes>;
export interface EventDestination {
  Name: string;
  Enabled?: boolean;
  MatchingEventTypes: EventType[];
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  CloudWatchDestination?: CloudWatchDestination;
  SnsDestination?: SnsDestination;
  PinpointDestination?: PinpointDestination;
}
export const EventDestination = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: EventTypes,
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    CloudWatchDestination: S.optional(CloudWatchDestination),
    SnsDestination: S.optional(SnsDestination),
    PinpointDestination: S.optional(PinpointDestination),
  }),
).annotations({
  identifier: "EventDestination",
}) as any as S.Schema<EventDestination>;
export type EventDestinations = EventDestination[];
export const EventDestinations = S.Array(EventDestination);
export interface PlacementStatistics {
  InboxPercentage?: number;
  SpamPercentage?: number;
  MissingPercentage?: number;
  SpfPercentage?: number;
  DkimPercentage?: number;
}
export const PlacementStatistics = S.suspend(() =>
  S.Struct({
    InboxPercentage: S.optional(S.Number),
    SpamPercentage: S.optional(S.Number),
    MissingPercentage: S.optional(S.Number),
    SpfPercentage: S.optional(S.Number),
    DkimPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "PlacementStatistics",
}) as any as S.Schema<PlacementStatistics>;
export interface IspPlacement {
  IspName?: string;
  PlacementStatistics?: PlacementStatistics;
}
export const IspPlacement = S.suspend(() =>
  S.Struct({
    IspName: S.optional(S.String),
    PlacementStatistics: S.optional(PlacementStatistics),
  }),
).annotations({ identifier: "IspPlacement" }) as any as S.Schema<IspPlacement>;
export type IspPlacements = IspPlacement[];
export const IspPlacements = S.Array(IspPlacement);
export interface VolumeStatistics {
  InboxRawCount?: number;
  SpamRawCount?: number;
  ProjectedInbox?: number;
  ProjectedSpam?: number;
}
export const VolumeStatistics = S.suspend(() =>
  S.Struct({
    InboxRawCount: S.optional(S.Number),
    SpamRawCount: S.optional(S.Number),
    ProjectedInbox: S.optional(S.Number),
    ProjectedSpam: S.optional(S.Number),
  }),
).annotations({
  identifier: "VolumeStatistics",
}) as any as S.Schema<VolumeStatistics>;
export interface DomainIspPlacement {
  IspName?: string;
  InboxRawCount?: number;
  SpamRawCount?: number;
  InboxPercentage?: number;
  SpamPercentage?: number;
}
export const DomainIspPlacement = S.suspend(() =>
  S.Struct({
    IspName: S.optional(S.String),
    InboxRawCount: S.optional(S.Number),
    SpamRawCount: S.optional(S.Number),
    InboxPercentage: S.optional(S.Number),
    SpamPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "DomainIspPlacement",
}) as any as S.Schema<DomainIspPlacement>;
export type DomainIspPlacements = DomainIspPlacement[];
export const DomainIspPlacements = S.Array(DomainIspPlacement);
export interface DailyVolume {
  StartDate?: Date;
  VolumeStatistics?: VolumeStatistics;
  DomainIspPlacements?: DomainIspPlacement[];
}
export const DailyVolume = S.suspend(() =>
  S.Struct({
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeStatistics: S.optional(VolumeStatistics),
    DomainIspPlacements: S.optional(DomainIspPlacements),
  }),
).annotations({ identifier: "DailyVolume" }) as any as S.Schema<DailyVolume>;
export type DailyVolumes = DailyVolume[];
export const DailyVolumes = S.Array(DailyVolume);
export interface MailFromAttributes {
  MailFromDomain: string;
  MailFromDomainStatus: MailFromDomainStatus;
  BehaviorOnMxFailure: BehaviorOnMxFailure;
}
export const MailFromAttributes = S.suspend(() =>
  S.Struct({
    MailFromDomain: S.String,
    MailFromDomainStatus: MailFromDomainStatus,
    BehaviorOnMxFailure: BehaviorOnMxFailure,
  }),
).annotations({
  identifier: "MailFromAttributes",
}) as any as S.Schema<MailFromAttributes>;
export interface IdentityInfo {
  IdentityType?: IdentityType;
  IdentityName?: string;
  SendingEnabled?: boolean;
}
export const IdentityInfo = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(IdentityType),
    IdentityName: S.optional(S.String),
    SendingEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "IdentityInfo" }) as any as S.Schema<IdentityInfo>;
export type IdentityInfoList = IdentityInfo[];
export const IdentityInfoList = S.Array(IdentityInfo);
export interface CreateEmailIdentityResponse {
  IdentityType?: IdentityType;
  VerifiedForSendingStatus?: boolean;
  DkimAttributes?: DkimAttributes;
}
export const CreateEmailIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(IdentityType),
    VerifiedForSendingStatus: S.optional(S.Boolean),
    DkimAttributes: S.optional(DkimAttributes),
  }),
).annotations({
  identifier: "CreateEmailIdentityResponse",
}) as any as S.Schema<CreateEmailIdentityResponse>;
export interface GetConfigurationSetEventDestinationsResponse {
  EventDestinations?: EventDestination[];
}
export const GetConfigurationSetEventDestinationsResponse = S.suspend(() =>
  S.Struct({ EventDestinations: S.optional(EventDestinations) }),
).annotations({
  identifier: "GetConfigurationSetEventDestinationsResponse",
}) as any as S.Schema<GetConfigurationSetEventDestinationsResponse>;
export interface GetDedicatedIpResponse {
  DedicatedIp?: DedicatedIp;
}
export const GetDedicatedIpResponse = S.suspend(() =>
  S.Struct({ DedicatedIp: S.optional(DedicatedIp) }),
).annotations({
  identifier: "GetDedicatedIpResponse",
}) as any as S.Schema<GetDedicatedIpResponse>;
export interface GetDeliverabilityDashboardOptionsResponse {
  DashboardEnabled: boolean;
  SubscriptionExpiryDate?: Date;
  AccountStatus?: DeliverabilityDashboardAccountStatus;
  ActiveSubscribedDomains?: DomainDeliverabilityTrackingOption[];
  PendingExpirationSubscribedDomains?: DomainDeliverabilityTrackingOption[];
}
export const GetDeliverabilityDashboardOptionsResponse = S.suspend(() =>
  S.Struct({
    DashboardEnabled: S.Boolean,
    SubscriptionExpiryDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AccountStatus: S.optional(DeliverabilityDashboardAccountStatus),
    ActiveSubscribedDomains: S.optional(DomainDeliverabilityTrackingOptions),
    PendingExpirationSubscribedDomains: S.optional(
      DomainDeliverabilityTrackingOptions,
    ),
  }),
).annotations({
  identifier: "GetDeliverabilityDashboardOptionsResponse",
}) as any as S.Schema<GetDeliverabilityDashboardOptionsResponse>;
export interface GetDeliverabilityTestReportResponse {
  DeliverabilityTestReport: DeliverabilityTestReport;
  OverallPlacement: PlacementStatistics;
  IspPlacements: IspPlacement[];
  Message?: string;
  Tags?: Tag[];
}
export const GetDeliverabilityTestReportResponse = S.suspend(() =>
  S.Struct({
    DeliverabilityTestReport: DeliverabilityTestReport,
    OverallPlacement: PlacementStatistics,
    IspPlacements: IspPlacements,
    Message: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetDeliverabilityTestReportResponse",
}) as any as S.Schema<GetDeliverabilityTestReportResponse>;
export interface GetDomainDeliverabilityCampaignResponse {
  DomainDeliverabilityCampaign: DomainDeliverabilityCampaign;
}
export const GetDomainDeliverabilityCampaignResponse = S.suspend(() =>
  S.Struct({ DomainDeliverabilityCampaign: DomainDeliverabilityCampaign }),
).annotations({
  identifier: "GetDomainDeliverabilityCampaignResponse",
}) as any as S.Schema<GetDomainDeliverabilityCampaignResponse>;
export interface GetEmailIdentityResponse {
  IdentityType?: IdentityType;
  FeedbackForwardingStatus?: boolean;
  VerifiedForSendingStatus?: boolean;
  DkimAttributes?: DkimAttributes;
  MailFromAttributes?: MailFromAttributes;
  Tags?: Tag[];
}
export const GetEmailIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(IdentityType),
    FeedbackForwardingStatus: S.optional(S.Boolean),
    VerifiedForSendingStatus: S.optional(S.Boolean),
    DkimAttributes: S.optional(DkimAttributes),
    MailFromAttributes: S.optional(MailFromAttributes),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetEmailIdentityResponse",
}) as any as S.Schema<GetEmailIdentityResponse>;
export interface ListEmailIdentitiesResponse {
  EmailIdentities?: IdentityInfo[];
  NextToken?: string;
}
export const ListEmailIdentitiesResponse = S.suspend(() =>
  S.Struct({
    EmailIdentities: S.optional(IdentityInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEmailIdentitiesResponse",
}) as any as S.Schema<ListEmailIdentitiesResponse>;
export interface SendEmailResponse {
  MessageId?: string;
}
export const SendEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendEmailResponse",
}) as any as S.Schema<SendEmailResponse>;
export interface BlacklistEntry {
  RblName?: string;
  ListingTime?: Date;
  Description?: string;
}
export const BlacklistEntry = S.suspend(() =>
  S.Struct({
    RblName: S.optional(S.String),
    ListingTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "BlacklistEntry",
}) as any as S.Schema<BlacklistEntry>;
export type BlacklistEntries = BlacklistEntry[];
export const BlacklistEntries = S.Array(BlacklistEntry);
export type BlacklistReport = { [key: string]: BlacklistEntry[] | undefined };
export const BlacklistReport = S.Record({
  key: S.String,
  value: S.UndefinedOr(BlacklistEntries),
});
export interface OverallVolume {
  VolumeStatistics?: VolumeStatistics;
  ReadRatePercent?: number;
  DomainIspPlacements?: DomainIspPlacement[];
}
export const OverallVolume = S.suspend(() =>
  S.Struct({
    VolumeStatistics: S.optional(VolumeStatistics),
    ReadRatePercent: S.optional(S.Number),
    DomainIspPlacements: S.optional(DomainIspPlacements),
  }),
).annotations({
  identifier: "OverallVolume",
}) as any as S.Schema<OverallVolume>;
export interface CreateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
  EventDestination: EventDestinationDefinition;
}
export const CreateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    EventDestinationName: S.String,
    EventDestination: EventDestinationDefinition,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/email/configuration-sets/{ConfigurationSetName}/event-destinations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<CreateConfigurationSetEventDestinationRequest>;
export interface CreateConfigurationSetEventDestinationResponse {}
export const CreateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<CreateConfigurationSetEventDestinationResponse>;
export interface CreateDeliverabilityTestReportRequest {
  ReportName?: string;
  FromEmailAddress: string;
  Content: EmailContent;
  Tags?: Tag[];
}
export const CreateDeliverabilityTestReportRequest = S.suspend(() =>
  S.Struct({
    ReportName: S.optional(S.String),
    FromEmailAddress: S.String,
    Content: EmailContent,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/email/deliverability-dashboard/test",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDeliverabilityTestReportRequest",
}) as any as S.Schema<CreateDeliverabilityTestReportRequest>;
export interface GetBlacklistReportsResponse {
  BlacklistReport: { [key: string]: BlacklistEntry[] | undefined };
}
export const GetBlacklistReportsResponse = S.suspend(() =>
  S.Struct({ BlacklistReport: BlacklistReport }),
).annotations({
  identifier: "GetBlacklistReportsResponse",
}) as any as S.Schema<GetBlacklistReportsResponse>;
export interface GetDomainStatisticsReportResponse {
  OverallVolume: OverallVolume;
  DailyVolumes: DailyVolume[];
}
export const GetDomainStatisticsReportResponse = S.suspend(() =>
  S.Struct({ OverallVolume: OverallVolume, DailyVolumes: DailyVolumes }),
).annotations({
  identifier: "GetDomainStatisticsReportResponse",
}) as any as S.Schema<GetDomainStatisticsReportResponse>;
export interface CreateDeliverabilityTestReportResponse {
  ReportId: string;
  DeliverabilityTestStatus: DeliverabilityTestStatus;
}
export const CreateDeliverabilityTestReportResponse = S.suspend(() =>
  S.Struct({
    ReportId: S.String,
    DeliverabilityTestStatus: DeliverabilityTestStatus,
  }),
).annotations({
  identifier: "CreateDeliverabilityTestReportResponse",
}) as any as S.Schema<CreateDeliverabilityTestReportResponse>;

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withAlreadyExistsError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccountSuspendedException extends S.TaggedError<AccountSuspendedException>()(
  "AccountSuspendedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MailFromDomainNotVerifiedException extends S.TaggedError<MailFromDomainNotVerifiedException>()(
  "MailFromDomainNotVerifiedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MessageRejected extends S.TaggedError<MessageRejected>()(
  "MessageRejected",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SendingPausedException extends S.TaggedError<SendingPausedException>()(
  "SendingPausedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Obtain information about the email-sending status and capabilities of your Amazon Pinpoint
 * account in the current AWS Region.
 */
export const getAccount: (
  input: GetAccountRequest,
) => effect.Effect<
  GetAccountResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountRequest,
  output: GetAccountResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Get information about an existing configuration set, including the dedicated IP pool
 * that it's associated with, whether or not it's enabled for sending email, and
 * more.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const getConfigurationSet: (
  input: GetConfigurationSetRequest,
) => effect.Effect<
  GetConfigurationSetResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationSetRequest,
  output: GetConfigurationSetResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve a list of event destinations that are associated with a configuration
 * set.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const getConfigurationSetEventDestinations: (
  input: GetConfigurationSetEventDestinationsRequest,
) => effect.Effect<
  GetConfigurationSetEventDestinationsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationSetEventDestinationsRequest,
  output: GetConfigurationSetEventDestinationsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Get information about a dedicated IP address, including the name of the dedicated IP
 * pool that it's associated with, as well information about the automatic warm-up process
 * for the address.
 */
export const getDedicatedIp: (
  input: GetDedicatedIpRequest,
) => effect.Effect<
  GetDedicatedIpResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDedicatedIpRequest,
  output: GetDedicatedIpResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve the results of a predictive inbox placement test.
 */
export const getDeliverabilityTestReport: (
  input: GetDeliverabilityTestReportRequest,
) => effect.Effect<
  GetDeliverabilityTestReportResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliverabilityTestReportRequest,
  output: GetDeliverabilityTestReportResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve all the deliverability data for a specific campaign. This data is available
 * for a campaign only if the campaign sent email by using a domain that the
 * Deliverability dashboard is enabled for (`PutDeliverabilityDashboardOption`
 * operation).
 */
export const getDomainDeliverabilityCampaign: (
  input: GetDomainDeliverabilityCampaignRequest,
) => effect.Effect<
  GetDomainDeliverabilityCampaignResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainDeliverabilityCampaignRequest,
  output: GetDomainDeliverabilityCampaignResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Provides information about a specific identity associated with your Amazon Pinpoint account,
 * including the identity's verification status, its DKIM authentication status, and its
 * custom Mail-From settings.
 */
export const getEmailIdentity: (
  input: GetEmailIdentityRequest,
) => effect.Effect<
  GetEmailIdentityResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailIdentityRequest,
  output: GetEmailIdentityResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Returns a list of all of the email identities that are associated with your Amazon Pinpoint
 * account. An identity can be either an email address or a domain. This operation returns
 * identities that are verified as well as those that aren't.
 */
export const listEmailIdentities: {
  (
    input: ListEmailIdentitiesRequest,
  ): effect.Effect<
    ListEmailIdentitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEmailIdentitiesRequest,
  ) => stream.Stream<
    ListEmailIdentitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEmailIdentitiesRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEmailIdentitiesRequest,
  output: ListEmailIdentitiesResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Enable or disable the Deliverability dashboard for your Amazon Pinpoint account. When you enable the
 * Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for
 * the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform
 * predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon Pinpoint. For more information about the
 * features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
 */
export const putDeliverabilityDashboardOption: (
  input: PutDeliverabilityDashboardOptionRequest,
) => effect.Effect<
  PutDeliverabilityDashboardOptionResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliverabilityDashboardOptionRequest,
  output: PutDeliverabilityDashboardOptionResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a configuration set. *Configuration sets* are groups of
 * rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration
 * set to an email by including a reference to the configuration set in the headers of the
 * email. When you apply a configuration set to an email, all of the rules in that
 * configuration set are applied to the email.
 */
export const createConfigurationSet: (
  input: CreateConfigurationSetRequest,
) => effect.Effect<
  CreateConfigurationSetResponse,
  | AlreadyExistsException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetRequest,
  output: CreateConfigurationSetResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    ConcurrentModificationException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a dedicated IP pool.
 */
export const deleteDedicatedIpPool: (
  input: DeleteDedicatedIpPoolRequest,
) => effect.Effect<
  DeleteDedicatedIpPoolResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDedicatedIpPoolRequest,
  output: DeleteDedicatedIpPoolResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an email identity that you previously verified for use with Amazon Pinpoint. An identity
 * can be either an email address or a domain name.
 */
export const deleteEmailIdentity: (
  input: DeleteEmailIdentityRequest,
) => effect.Effect<
  DeleteEmailIdentityResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailIdentityRequest,
  output: DeleteEmailIdentityResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Add one or more tags (keys and values) to a specified resource. A
 * *tag* is a label that you optionally define and associate with a
 * resource in Amazon Pinpoint. Tags can help you categorize and manage resources in different ways,
 * such as by purpose, owner, environment, or other criteria. A resource can have as many
 * as 50 tags.
 *
 * Each tag consists of a required *tag key* and an
 * associated *tag value*, both of which you define. A tag key is a
 * general label that acts as a category for more specific tag values. A tag value acts as
 * a descriptor within a tag key.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Remove one or more tags (keys and values) from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated
 * IP addresses that are associated with your Amazon Pinpoint account. You can associate a pool with
 * a configuration set. When you send an email that uses that configuration set, Amazon Pinpoint
 * sends it using only the IP addresses in the associated pool.
 */
export const createDedicatedIpPool: (
  input: CreateDedicatedIpPoolRequest,
) => effect.Effect<
  CreateDedicatedIpPoolResponse,
  | AlreadyExistsException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDedicatedIpPoolRequest,
  output: CreateDedicatedIpPoolResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    ConcurrentModificationException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Verifies an email identity for use with Amazon Pinpoint. In Amazon Pinpoint, an identity is an email
 * address or domain that you use when you send email. Before you can use an identity to
 * send email with Amazon Pinpoint, you first have to verify it. By verifying an address, you
 * demonstrate that you're the owner of the address, and that you've given Amazon Pinpoint permission
 * to send email from the address.
 *
 * When you verify an email address, Amazon Pinpoint sends an email to the address. Your email
 * address is verified as soon as you follow the link in the verification email.
 *
 * When you verify a domain, this operation provides a set of DKIM tokens, which you can
 * convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your
 * domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS
 * configuration for your domain. It usually takes around 72 hours to complete the domain
 * verification process.
 */
export const createEmailIdentity: (
  input: CreateEmailIdentityRequest,
) => effect.Effect<
  CreateEmailIdentityResponse,
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailIdentityRequest,
  output: CreateEmailIdentityResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * List all of the configuration sets associated with your Amazon Pinpoint account in the current
 * region.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const listConfigurationSets: {
  (
    input: ListConfigurationSetsRequest,
  ): effect.Effect<
    ListConfigurationSetsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationSetsRequest,
  ) => stream.Stream<
    ListConfigurationSetsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationSetsRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationSetsRequest,
  output: ListConfigurationSetsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List all of the dedicated IP pools that exist in your Amazon Pinpoint account in the current
 * AWS Region.
 */
export const listDedicatedIpPools: {
  (
    input: ListDedicatedIpPoolsRequest,
  ): effect.Effect<
    ListDedicatedIpPoolsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDedicatedIpPoolsRequest,
  ) => stream.Stream<
    ListDedicatedIpPoolsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDedicatedIpPoolsRequest,
  ) => stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDedicatedIpPoolsRequest,
  output: ListDedicatedIpPoolsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Enable or disable the automatic warm-up feature for dedicated IP addresses.
 */
export const putAccountDedicatedIpWarmupAttributes: (
  input: PutAccountDedicatedIpWarmupAttributesRequest,
) => effect.Effect<
  PutAccountDedicatedIpWarmupAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountDedicatedIpWarmupAttributesRequest,
  output: PutAccountDedicatedIpWarmupAttributesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Enable or disable the ability of your account to send email.
 */
export const putAccountSendingAttributes: (
  input: PutAccountSendingAttributesRequest,
) => effect.Effect<
  PutAccountSendingAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSendingAttributesRequest,
  output: PutAccountSendingAttributesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * List the dedicated IP addresses that are associated with your Amazon Pinpoint
 * account.
 */
export const getDedicatedIps: {
  (
    input: GetDedicatedIpsRequest,
  ): effect.Effect<
    GetDedicatedIpsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDedicatedIpsRequest,
  ) => stream.Stream<
    GetDedicatedIpsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDedicatedIpsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDedicatedIpsRequest,
  output: GetDedicatedIpsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For
 * predictive inbox placement tests that are complete, you can use the `GetDeliverabilityTestReport`
 * operation to view the results.
 */
export const listDeliverabilityTestReports: {
  (
    input: ListDeliverabilityTestReportsRequest,
  ): effect.Effect<
    ListDeliverabilityTestReportsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeliverabilityTestReportsRequest,
  ) => stream.Stream<
    ListDeliverabilityTestReportsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeliverabilityTestReportsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeliverabilityTestReportsRequest,
  output: ListDeliverabilityTestReportsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieve deliverability data for all the campaigns that used a specific domain to send
 * email during a specified time range. This data is available for a domain only if you
 * enabled the Deliverability dashboard (`PutDeliverabilityDashboardOption` operation)
 * for the domain.
 */
export const listDomainDeliverabilityCampaigns: {
  (
    input: ListDomainDeliverabilityCampaignsRequest,
  ): effect.Effect<
    ListDomainDeliverabilityCampaignsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainDeliverabilityCampaignsRequest,
  ) => stream.Stream<
    ListDomainDeliverabilityCampaignsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainDeliverabilityCampaignsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDomainDeliverabilityCampaignsRequest,
  output: ListDomainDeliverabilityCampaignsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieve a list of the tags (keys and values) that are associated with a specified
 * resource. A *tag* is a label that you optionally define and associate
 * with a resource in Amazon Pinpoint. Each tag consists of a required tag
 * key and an optional associated *tag value*. A tag key
 * is a general label that acts as a category for more specific tag values. A tag value
 * acts as a descriptor within a tag key.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Delete an event destination.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const deleteConfigurationSetEventDestination: (
  input: DeleteConfigurationSetEventDestinationRequest,
) => effect.Effect<
  DeleteConfigurationSetEventDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetEventDestinationRequest,
  output: DeleteConfigurationSetEventDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools
 * to create groups of dedicated IP addresses for sending specific types of email.
 */
export const putConfigurationSetDeliveryOptions: (
  input: PutConfigurationSetDeliveryOptionsRequest,
) => effect.Effect<
  PutConfigurationSetDeliveryOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetDeliveryOptionsRequest,
  output: PutConfigurationSetDeliveryOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Enable or disable collection of reputation metrics for emails that you send using a
 * particular configuration set in a specific AWS Region.
 */
export const putConfigurationSetReputationOptions: (
  input: PutConfigurationSetReputationOptionsRequest,
) => effect.Effect<
  PutConfigurationSetReputationOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetReputationOptionsRequest,
  output: PutConfigurationSetReputationOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Enable or disable email sending for messages that use a particular configuration set
 * in a specific AWS Region.
 */
export const putConfigurationSetSendingOptions: (
  input: PutConfigurationSetSendingOptionsRequest,
) => effect.Effect<
  PutConfigurationSetSendingOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetSendingOptionsRequest,
  output: PutConfigurationSetSendingOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Specify a custom domain to use for open and click tracking elements in email that you
 * send using Amazon Pinpoint.
 */
export const putConfigurationSetTrackingOptions: (
  input: PutConfigurationSetTrackingOptionsRequest,
) => effect.Effect<
  PutConfigurationSetTrackingOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetTrackingOptionsRequest,
  output: PutConfigurationSetTrackingOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Move a dedicated IP address to an existing dedicated IP pool.
 *
 * The dedicated IP address that you specify must already exist, and must be
 * associated with your Amazon Pinpoint account.
 *
 * The dedicated IP pool you specify must already exist. You can create a new pool by
 * using the `CreateDedicatedIpPool` operation.
 */
export const putDedicatedIpInPool: (
  input: PutDedicatedIpInPoolRequest,
) => effect.Effect<
  PutDedicatedIpInPoolResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDedicatedIpInPoolRequest,
  output: PutDedicatedIpInPoolResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 *
 */
export const putDedicatedIpWarmupAttributes: (
  input: PutDedicatedIpWarmupAttributesRequest,
) => effect.Effect<
  PutDedicatedIpWarmupAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDedicatedIpWarmupAttributesRequest,
  output: PutDedicatedIpWarmupAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to enable or disable DKIM authentication for an email identity.
 */
export const putEmailIdentityDkimAttributes: (
  input: PutEmailIdentityDkimAttributesRequest,
) => effect.Effect<
  PutEmailIdentityDkimAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityDkimAttributesRequest,
  output: PutEmailIdentityDkimAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to enable or disable feedback forwarding for an identity. This setting determines
 * what happens when an identity is used to send an email that results in a bounce or
 * complaint event.
 *
 * When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce
 * or complaint events occur. Amazon Pinpoint sends this notification to the address that you
 * specified in the Return-Path header of the original email.
 *
 * When you disable feedback forwarding, Amazon Pinpoint sends notifications through other
 * mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of
 * tracking bounces and complaints. If you haven't set up another mechanism for receiving
 * bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events
 * occur (even if this setting is disabled).
 */
export const putEmailIdentityFeedbackAttributes: (
  input: PutEmailIdentityFeedbackAttributesRequest,
) => effect.Effect<
  PutEmailIdentityFeedbackAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityFeedbackAttributesRequest,
  output: PutEmailIdentityFeedbackAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to enable or disable the custom Mail-From domain configuration for an email
 * identity.
 */
export const putEmailIdentityMailFromAttributes: (
  input: PutEmailIdentityMailFromAttributesRequest,
) => effect.Effect<
  PutEmailIdentityMailFromAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityMailFromAttributesRequest,
  output: PutEmailIdentityMailFromAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Update the configuration of an event destination for a configuration set.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens,
 * clicks, bounces, and complaints. *Event destinations* are places that
 * you can send information about these events to. For example, you can send event data to
 * Amazon SNS to receive notifications when you receive bounces or complaints, or you can use
 * Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 */
export const updateConfigurationSetEventDestination: (
  input: UpdateConfigurationSetEventDestinationRequest,
) => effect.Effect<
  UpdateConfigurationSetEventDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationSetEventDestinationRequest,
  output: UpdateConfigurationSetEventDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Delete an existing configuration set.
 *
 * In Amazon Pinpoint, *configuration sets* are groups of rules that you can
 * apply to the emails you send. You apply a configuration set to an email by including a
 * reference to the configuration set in the headers of the email. When you apply a
 * configuration set to an email, all of the rules in that configuration set are applied to
 * the email.
 */
export const deleteConfigurationSet: (
  input: DeleteConfigurationSetRequest,
) => effect.Effect<
  DeleteConfigurationSetResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetRequest,
  output: DeleteConfigurationSetResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve information about the status of the Deliverability dashboard for your Amazon Pinpoint account.
 * When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and
 * other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the
 * ability to perform predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon Pinpoint. For more information about the
 * features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
 */
export const getDeliverabilityDashboardOptions: (
  input: GetDeliverabilityDashboardOptionsRequest,
) => effect.Effect<
  GetDeliverabilityDashboardOptionsResponse,
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliverabilityDashboardOptionsRequest,
  output: GetDeliverabilityDashboardOptionsResponse,
  errors: [
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create an event destination. In Amazon Pinpoint, *events* include message
 * sends, deliveries, opens, clicks, bounces, and complaints. Event
 * destinations are places that you can send information about these events
 * to. For example, you can send event data to Amazon SNS to receive notifications when you
 * receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term
 * storage.
 *
 * A single configuration set can include more than one event destination.
 */
export const createConfigurationSetEventDestination: (
  input: CreateConfigurationSetEventDestinationRequest,
) => effect.Effect<
  CreateConfigurationSetEventDestinationResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetEventDestinationRequest,
  output: CreateConfigurationSetEventDestinationResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
 */
export const getBlacklistReports: (
  input: GetBlacklistReportsRequest,
) => effect.Effect<
  GetBlacklistReportsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlacklistReportsRequest,
  output: GetBlacklistReportsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve inbox placement and engagement rates for the domains that you use to send
 * email.
 */
export const getDomainStatisticsReport: (
  input: GetDomainStatisticsReportRequest,
) => effect.Effect<
  GetDomainStatisticsReportResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainStatisticsReportRequest,
  output: GetDomainStatisticsReportResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Sends an email message. You can use the Amazon Pinpoint Email API to send two types of
 * messages:
 *
 * - **Simple** – A standard email message. When
 * you create this type of message, you specify the sender, the recipient, and the
 * message body, and Amazon Pinpoint assembles the message for you.
 *
 * - **Raw** – A raw, MIME-formatted email
 * message. When you send this type of email, you have to specify all of the
 * message headers, as well as the message body. You can use this message type to
 * send messages that contain attachments. The message that you specify has to be a
 * valid MIME message.
 */
export const sendEmail: (
  input: SendEmailRequest,
) => effect.Effect<
  SendEmailResponse,
  | AccountSuspendedException
  | BadRequestException
  | LimitExceededException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | NotFoundException
  | SendingPausedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEmailRequest,
  output: SendEmailResponse,
  errors: [
    AccountSuspendedException,
    BadRequestException,
    LimitExceededException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
    NotFoundException,
    SendingPausedException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled
 * by various email providers around the world. When you perform a predictive inbox placement test, you provide a
 * sample message that contains the content that you plan to send to your customers. Amazon Pinpoint
 * then sends that message to special email addresses spread across several major email
 * providers. After about 24 hours, the test is complete, and you can use the
 * `GetDeliverabilityTestReport` operation to view the results of the
 * test.
 */
export const createDeliverabilityTestReport: (
  input: CreateDeliverabilityTestReportRequest,
) => effect.Effect<
  CreateDeliverabilityTestReportResponse,
  | AccountSuspendedException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | NotFoundException
  | SendingPausedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeliverabilityTestReportRequest,
  output: CreateDeliverabilityTestReportResponse,
  errors: [
    AccountSuspendedException,
    BadRequestException,
    ConcurrentModificationException,
    LimitExceededException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
    NotFoundException,
    SendingPausedException,
    TooManyRequestsException,
  ],
}));
