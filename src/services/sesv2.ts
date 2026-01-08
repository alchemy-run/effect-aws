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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "SESv2",
  serviceShapeName: "SimpleEmailService_v2",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2019-09-27");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const {
    Region,
    UseDualStack = false,
    UseFIPS = false,
    Endpoint,
    EndpointId,
  } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [
      { name: "sigv4a", signingName: "ses", signingRegionSet: ["*"] },
    ],
  });
  {
    const PartitionResult = _.partition(Region);
    if (
      EndpointId != null &&
      Region != null &&
      PartitionResult != null &&
      PartitionResult !== false
    ) {
      if (_.isValidHostLabel(EndpointId, true)) {
        if (UseFIPS === false) {
          if (Endpoint != null) {
            return e(Endpoint, _p0(), {});
          }
          if (UseDualStack === true) {
            if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
              return e(
                `https://${EndpointId}.endpoints.email.global.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
                _p0(),
                {},
              );
            }
            return err(
              "DualStack is enabled but this partition does not support DualStack",
            );
          }
          return e(
            `https://${EndpointId}.endpoints.email.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            _p0(),
            {},
          );
        }
        return err(
          "Invalid Configuration: FIPS is not supported with multi-region endpoints",
        );
      }
      return err("EndpointId must be a valid host label");
    }
  }
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
export type JobId = string;
export type ConfigurationSetName = string;
export type EventDestinationName = string;
export type ContactListName = string;
export type EmailAddress = string;
export type AttributesData = string;
export type Description = string;
export type EmailTemplateName = string;
export type EmailTemplateSubject = string;
export type TemplateContent = string;
export type SuccessRedirectionURL = string;
export type FailureRedirectionURL = string;
export type PoolName = string;
export type ReportName = string;
export type Identity = string;
export type PolicyName = string;
export type Policy = string;
export type EndpointName = string;
export type TenantName = string;
export type AmazonResourceName = string;
export type GeneralEnforcementStatus = string;
export type BlacklistItemName = string;
export type Ip = string;
export type NextToken = string;
export type MaxItems = number;
export type ReportId = string;
export type CampaignId = string;
export type OutboundMessageId = string;
export type ReputationEntityReference = string;
export type Domain = string;
export type NextTokenV2 = string;
export type PageSizeV2 = number;
export type WebsiteURL = string | Redacted.Redacted<string>;
export type UseCaseDescription = string | Redacted.Redacted<string>;
export type AdditionalContactEmailAddress = string | Redacted.Redacted<string>;
export type ArchiveArn = string;
export type SendingPoolName = string;
export type MaxDeliverySeconds = number;
export type CustomRedirectDomain = string;
export type Percentage100Wrapper = number;
export type MailFromDomainName = string;
export type EndpointId = string;
export type EmailTemplateData = string;
export type TagKey = string;
export type QueryIdentifier = string;
export type TagValue = string;
export type TopicName = string;
export type DisplayName = string;
export type Selector = string;
export type PrivateKey = string | Redacted.Redacted<string>;
export type EmailTemplateText = string;
export type EmailTemplateHtml = string;
export type S3Url = string;
export type Max24HourSend = number;
export type MaxSendRate = number;
export type SentLast24Hours = number;
export type ListRecommendationFilterValue = string;
export type ReputationEntityFilterValue = string;
export type ListTenantResourcesFilterValue = string;
export type MessageTagName = string;
export type MessageTagValue = string;
export type ErrorMessage = string;
export type TenantId = string;
export type MessageContent = string;
export type ProcessedRecordsCount = number;
export type FailedRecordsCount = number;
export type InsightsEmailAddress = string | Redacted.Redacted<string>;
export type EmailSubject = string | Redacted.Redacted<string>;
export type DnsToken = string;
export type HostedZone = string;
export type RenderedEmailTemplate = string;
export type MetricDimensionValue = string;
export type MessageInsightsExportMaxResults = number;
export type Region = string;
export type CaseId = string;
export type IspName = string;
export type MessageHeaderName = string;
export type MessageHeaderValue = string;
export type DeliverabilityTestSubject = string;
export type Percentage = number;
export type ImageUrl = string;
export type Subject = string;
export type Volume = number;
export type Esp = string;
export type FailedRecordsS3Url = string;
export type ExportedRecordsCount = number;
export type Isp = string;
export type DimensionName = string;
export type DefaultDimensionValue = string;
export type MessageData = string;
export type Charset = string;
export type AttachmentFileName = string;
export type AttachmentContentDescription = string;
export type AttachmentContentId = string;
export type AttachmentContentType = string;
export type RblName = string;
export type BlacklistingDescription = string;
export type PrimaryNameServer = string;
export type AdminEmail = string;
export type SerialNumber = number;
export type StatusCause = string;
export type FeedbackId = string;
export type RecommendationDescription = string;
export type BounceSubType = string;
export type DiagnosticCode = string;
export type ComplaintSubType = string;
export type ComplaintFeedbackType = string;
export type Counter = number;
export type QueryErrorMessage = string;

//# Schemas
export interface GetAccountRequest {}
export const GetAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/account" }),
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
      T.Http({ method: "GET", uri: "/v2/email/deliverability-dashboard" }),
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
export type SuppressionListReasons = string[];
export const SuppressionListReasons = S.Array(S.String);
export type AdditionalContactEmailAddresses =
  | string
  | Redacted.Redacted<string>[];
export const AdditionalContactEmailAddresses = S.Array(SensitiveString);
export type EmailAddressList = string[];
export const EmailAddressList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelExportJobRequest {
  JobId: string;
}
export const CancelExportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/export-jobs/{JobId}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelExportJobRequest",
}) as any as S.Schema<CancelExportJobRequest>;
export interface CancelExportJobResponse {}
export const CancelExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelExportJobResponse",
}) as any as S.Schema<CancelExportJobResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateCustomVerificationEmailTemplateRequest {
  TemplateName: string;
  FromEmailAddress: string;
  TemplateSubject: string;
  TemplateContent: string;
  Tags?: TagList;
  SuccessRedirectionURL: string;
  FailureRedirectionURL: string;
}
export const CreateCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    FromEmailAddress: S.String,
    TemplateSubject: S.String,
    TemplateContent: S.String,
    Tags: S.optional(TagList),
    SuccessRedirectionURL: S.String,
    FailureRedirectionURL: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/custom-verification-email-templates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<CreateCustomVerificationEmailTemplateRequest>;
export interface CreateCustomVerificationEmailTemplateResponse {}
export const CreateCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<CreateCustomVerificationEmailTemplateResponse>;
export interface CreateDedicatedIpPoolRequest {
  PoolName: string;
  Tags?: TagList;
  ScalingMode?: string;
}
export const CreateDedicatedIpPoolRequest = S.suspend(() =>
  S.Struct({
    PoolName: S.String,
    Tags: S.optional(TagList),
    ScalingMode: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/dedicated-ip-pools" }),
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
export interface CreateEmailIdentityPolicyRequest {
  EmailIdentity: string;
  PolicyName: string;
  Policy: string;
}
export const CreateEmailIdentityPolicyRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    PolicyName: S.String.pipe(T.HttpLabel("PolicyName")),
    Policy: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/identities/{EmailIdentity}/policies/{PolicyName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEmailIdentityPolicyRequest",
}) as any as S.Schema<CreateEmailIdentityPolicyRequest>;
export interface CreateEmailIdentityPolicyResponse {}
export const CreateEmailIdentityPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateEmailIdentityPolicyResponse",
}) as any as S.Schema<CreateEmailIdentityPolicyResponse>;
export interface CreateTenantRequest {
  TenantName: string;
  Tags?: TagList;
}
export const CreateTenantRequest = S.suspend(() =>
  S.Struct({ TenantName: S.String, Tags: S.optional(TagList) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTenantRequest",
}) as any as S.Schema<CreateTenantRequest>;
export interface CreateTenantResourceAssociationRequest {
  TenantName: string;
  ResourceArn: string;
}
export const CreateTenantResourceAssociationRequest = S.suspend(() =>
  S.Struct({ TenantName: S.String, ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTenantResourceAssociationRequest",
}) as any as S.Schema<CreateTenantResourceAssociationRequest>;
export interface CreateTenantResourceAssociationResponse {}
export const CreateTenantResourceAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateTenantResourceAssociationResponse",
}) as any as S.Schema<CreateTenantResourceAssociationResponse>;
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}",
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
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
export interface DeleteContactRequest {
  ContactListName: string;
  EmailAddress: string;
}
export const DeleteContactRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    EmailAddress: S.String.pipe(T.HttpLabel("EmailAddress")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/contact-lists/{ContactListName}/contacts/{EmailAddress}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContactRequest",
}) as any as S.Schema<DeleteContactRequest>;
export interface DeleteContactResponse {}
export const DeleteContactResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteContactResponse",
}) as any as S.Schema<DeleteContactResponse>;
export interface DeleteContactListRequest {
  ContactListName: string;
}
export const DeleteContactListRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/contact-lists/{ContactListName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteContactListRequest",
}) as any as S.Schema<DeleteContactListRequest>;
export interface DeleteContactListResponse {}
export const DeleteContactListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteContactListResponse",
}) as any as S.Schema<DeleteContactListResponse>;
export interface DeleteCustomVerificationEmailTemplateRequest {
  TemplateName: string;
}
export const DeleteCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String.pipe(T.HttpLabel("TemplateName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/custom-verification-email-templates/{TemplateName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<DeleteCustomVerificationEmailTemplateRequest>;
export interface DeleteCustomVerificationEmailTemplateResponse {}
export const DeleteCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<DeleteCustomVerificationEmailTemplateResponse>;
export interface DeleteDedicatedIpPoolRequest {
  PoolName: string;
}
export const DeleteDedicatedIpPoolRequest = S.suspend(() =>
  S.Struct({ PoolName: S.String.pipe(T.HttpLabel("PoolName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/dedicated-ip-pools/{PoolName}",
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
      T.Http({ method: "DELETE", uri: "/v2/email/identities/{EmailIdentity}" }),
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
export interface DeleteEmailIdentityPolicyRequest {
  EmailIdentity: string;
  PolicyName: string;
}
export const DeleteEmailIdentityPolicyRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    PolicyName: S.String.pipe(T.HttpLabel("PolicyName")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/identities/{EmailIdentity}/policies/{PolicyName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEmailIdentityPolicyRequest",
}) as any as S.Schema<DeleteEmailIdentityPolicyRequest>;
export interface DeleteEmailIdentityPolicyResponse {}
export const DeleteEmailIdentityPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEmailIdentityPolicyResponse",
}) as any as S.Schema<DeleteEmailIdentityPolicyResponse>;
export interface DeleteEmailTemplateRequest {
  TemplateName: string;
}
export const DeleteEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String.pipe(T.HttpLabel("TemplateName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/email/templates/{TemplateName}" }),
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
export interface DeleteEmailTemplateResponse {}
export const DeleteEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEmailTemplateResponse",
}) as any as S.Schema<DeleteEmailTemplateResponse>;
export interface DeleteMultiRegionEndpointRequest {
  EndpointName: string;
}
export const DeleteMultiRegionEndpointRequest = S.suspend(() =>
  S.Struct({ EndpointName: S.String.pipe(T.HttpLabel("EndpointName")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/multi-region-endpoints/{EndpointName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMultiRegionEndpointRequest",
}) as any as S.Schema<DeleteMultiRegionEndpointRequest>;
export interface DeleteSuppressedDestinationRequest {
  EmailAddress: string;
}
export const DeleteSuppressedDestinationRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String.pipe(T.HttpLabel("EmailAddress")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/v2/email/suppression/addresses/{EmailAddress}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSuppressedDestinationRequest",
}) as any as S.Schema<DeleteSuppressedDestinationRequest>;
export interface DeleteSuppressedDestinationResponse {}
export const DeleteSuppressedDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSuppressedDestinationResponse",
}) as any as S.Schema<DeleteSuppressedDestinationResponse>;
export interface DeleteTenantRequest {
  TenantName: string;
}
export const DeleteTenantRequest = S.suspend(() =>
  S.Struct({ TenantName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTenantRequest",
}) as any as S.Schema<DeleteTenantRequest>;
export interface DeleteTenantResponse {}
export const DeleteTenantResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTenantResponse",
}) as any as S.Schema<DeleteTenantResponse>;
export interface DeleteTenantResourceAssociationRequest {
  TenantName: string;
  ResourceArn: string;
}
export const DeleteTenantResourceAssociationRequest = S.suspend(() =>
  S.Struct({ TenantName: S.String, ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/resources/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTenantResourceAssociationRequest",
}) as any as S.Schema<DeleteTenantResourceAssociationRequest>;
export interface DeleteTenantResourceAssociationResponse {}
export const DeleteTenantResourceAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTenantResourceAssociationResponse",
}) as any as S.Schema<DeleteTenantResourceAssociationResponse>;
export interface GetBlacklistReportsRequest {
  BlacklistItemNames: BlacklistItemNames;
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
        uri: "/v2/email/deliverability-dashboard/blacklist-report",
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}",
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/event-destinations",
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
export interface GetContactRequest {
  ContactListName: string;
  EmailAddress: string;
}
export const GetContactRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    EmailAddress: S.String.pipe(T.HttpLabel("EmailAddress")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/contact-lists/{ContactListName}/contacts/{EmailAddress}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContactRequest",
}) as any as S.Schema<GetContactRequest>;
export interface GetContactListRequest {
  ContactListName: string;
}
export const GetContactListRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/contact-lists/{ContactListName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetContactListRequest",
}) as any as S.Schema<GetContactListRequest>;
export interface GetCustomVerificationEmailTemplateRequest {
  TemplateName: string;
}
export const GetCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String.pipe(T.HttpLabel("TemplateName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/custom-verification-email-templates/{TemplateName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<GetCustomVerificationEmailTemplateRequest>;
export interface GetDedicatedIpRequest {
  Ip: string;
}
export const GetDedicatedIpRequest = S.suspend(() =>
  S.Struct({ Ip: S.String.pipe(T.HttpLabel("Ip")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/dedicated-ips/{Ip}" }),
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
export interface GetDedicatedIpPoolRequest {
  PoolName: string;
}
export const GetDedicatedIpPoolRequest = S.suspend(() =>
  S.Struct({ PoolName: S.String.pipe(T.HttpLabel("PoolName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/dedicated-ip-pools/{PoolName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDedicatedIpPoolRequest",
}) as any as S.Schema<GetDedicatedIpPoolRequest>;
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
      T.Http({ method: "GET", uri: "/v2/email/dedicated-ips" }),
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
        uri: "/v2/email/deliverability-dashboard/test-reports/{ReportId}",
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
        uri: "/v2/email/deliverability-dashboard/campaigns/{CampaignId}",
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
        uri: "/v2/email/deliverability-dashboard/statistics-report/{Domain}",
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
export interface GetEmailAddressInsightsRequest {
  EmailAddress: string;
}
export const GetEmailAddressInsightsRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/email-address-insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEmailAddressInsightsRequest",
}) as any as S.Schema<GetEmailAddressInsightsRequest>;
export interface GetEmailIdentityRequest {
  EmailIdentity: string;
}
export const GetEmailIdentityRequest = S.suspend(() =>
  S.Struct({ EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/identities/{EmailIdentity}" }),
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
export interface GetEmailIdentityPoliciesRequest {
  EmailIdentity: string;
}
export const GetEmailIdentityPoliciesRequest = S.suspend(() =>
  S.Struct({ EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/identities/{EmailIdentity}/policies",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEmailIdentityPoliciesRequest",
}) as any as S.Schema<GetEmailIdentityPoliciesRequest>;
export interface GetEmailTemplateRequest {
  TemplateName: string;
}
export const GetEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String.pipe(T.HttpLabel("TemplateName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/templates/{TemplateName}" }),
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
export interface GetExportJobRequest {
  JobId: string;
}
export const GetExportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/export-jobs/{JobId}" }),
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
export interface GetImportJobRequest {
  JobId: string;
}
export const GetImportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String.pipe(T.HttpLabel("JobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/import-jobs/{JobId}" }),
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
export interface GetMessageInsightsRequest {
  MessageId: string;
}
export const GetMessageInsightsRequest = S.suspend(() =>
  S.Struct({ MessageId: S.String.pipe(T.HttpLabel("MessageId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/insights/{MessageId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMessageInsightsRequest",
}) as any as S.Schema<GetMessageInsightsRequest>;
export interface GetMultiRegionEndpointRequest {
  EndpointName: string;
}
export const GetMultiRegionEndpointRequest = S.suspend(() =>
  S.Struct({ EndpointName: S.String.pipe(T.HttpLabel("EndpointName")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/multi-region-endpoints/{EndpointName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMultiRegionEndpointRequest",
}) as any as S.Schema<GetMultiRegionEndpointRequest>;
export interface GetReputationEntityRequest {
  ReputationEntityReference: string;
  ReputationEntityType: string;
}
export const GetReputationEntityRequest = S.suspend(() =>
  S.Struct({
    ReputationEntityReference: S.String.pipe(
      T.HttpLabel("ReputationEntityReference"),
    ),
    ReputationEntityType: S.String.pipe(T.HttpLabel("ReputationEntityType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/reputation/entities/{ReputationEntityType}/{ReputationEntityReference}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReputationEntityRequest",
}) as any as S.Schema<GetReputationEntityRequest>;
export interface GetSuppressedDestinationRequest {
  EmailAddress: string;
}
export const GetSuppressedDestinationRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String.pipe(T.HttpLabel("EmailAddress")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/suppression/addresses/{EmailAddress}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSuppressedDestinationRequest",
}) as any as S.Schema<GetSuppressedDestinationRequest>;
export interface GetTenantRequest {
  TenantName: string;
}
export const GetTenantRequest = S.suspend(() =>
  S.Struct({ TenantName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTenantRequest",
}) as any as S.Schema<GetTenantRequest>;
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
      T.Http({ method: "GET", uri: "/v2/email/configuration-sets" }),
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
export interface ListContactListsRequest {
  PageSize?: number;
  NextToken?: string;
}
export const ListContactListsRequest = S.suspend(() =>
  S.Struct({
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/contact-lists" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContactListsRequest",
}) as any as S.Schema<ListContactListsRequest>;
export interface ListCustomVerificationEmailTemplatesRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListCustomVerificationEmailTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/v2/email/custom-verification-email-templates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomVerificationEmailTemplatesRequest",
}) as any as S.Schema<ListCustomVerificationEmailTemplatesRequest>;
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
      T.Http({ method: "GET", uri: "/v2/email/dedicated-ip-pools" }),
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
        uri: "/v2/email/deliverability-dashboard/test-reports",
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
        uri: "/v2/email/deliverability-dashboard/domains/{SubscribedDomain}/campaigns",
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
      T.Http({ method: "GET", uri: "/v2/email/identities" }),
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
export interface ListEmailTemplatesRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListEmailTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/templates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEmailTemplatesRequest",
}) as any as S.Schema<ListEmailTemplatesRequest>;
export interface ListExportJobsRequest {
  NextToken?: string;
  PageSize?: number;
  ExportSourceType?: string;
  JobStatus?: string;
}
export const ListExportJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    ExportSourceType: S.optional(S.String),
    JobStatus: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/list-export-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExportJobsRequest",
}) as any as S.Schema<ListExportJobsRequest>;
export interface ListImportJobsRequest {
  ImportDestinationType?: string;
  NextToken?: string;
  PageSize?: number;
}
export const ListImportJobsRequest = S.suspend(() =>
  S.Struct({
    ImportDestinationType: S.optional(S.String),
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/import-jobs/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportJobsRequest",
}) as any as S.Schema<ListImportJobsRequest>;
export interface ListMultiRegionEndpointsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListMultiRegionEndpointsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/multi-region-endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMultiRegionEndpointsRequest",
}) as any as S.Schema<ListMultiRegionEndpointsRequest>;
export interface ListResourceTenantsRequest {
  ResourceArn: string;
  PageSize?: number;
  NextToken?: string;
}
export const ListResourceTenantsRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/resources/tenants/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceTenantsRequest",
}) as any as S.Schema<ListResourceTenantsRequest>;
export interface ListSuppressedDestinationsRequest {
  Reasons?: SuppressionListReasons;
  StartDate?: Date;
  EndDate?: Date;
  NextToken?: string;
  PageSize?: number;
}
export const ListSuppressedDestinationsRequest = S.suspend(() =>
  S.Struct({
    Reasons: S.optional(SuppressionListReasons).pipe(T.HttpQuery("Reason")),
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("StartDate"),
    ),
    EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("EndDate"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    PageSize: S.optional(S.Number).pipe(T.HttpQuery("PageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/suppression/addresses" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSuppressedDestinationsRequest",
}) as any as S.Schema<ListSuppressedDestinationsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v2/email/tags" }),
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
export interface ListTenantsRequest {
  NextToken?: string;
  PageSize?: number;
}
export const ListTenantsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTenantsRequest",
}) as any as S.Schema<ListTenantsRequest>;
export interface PutAccountDedicatedIpWarmupAttributesRequest {
  AutoWarmupEnabled?: boolean;
}
export const PutAccountDedicatedIpWarmupAttributesRequest = S.suspend(() =>
  S.Struct({ AutoWarmupEnabled: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/account/dedicated-ips/warmup" }),
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
export interface PutAccountDetailsRequest {
  MailType: string;
  WebsiteURL: string | Redacted.Redacted<string>;
  ContactLanguage?: string;
  UseCaseDescription?: string | Redacted.Redacted<string>;
  AdditionalContactEmailAddresses?: AdditionalContactEmailAddresses;
  ProductionAccessEnabled?: boolean;
}
export const PutAccountDetailsRequest = S.suspend(() =>
  S.Struct({
    MailType: S.String,
    WebsiteURL: SensitiveString,
    ContactLanguage: S.optional(S.String),
    UseCaseDescription: S.optional(SensitiveString),
    AdditionalContactEmailAddresses: S.optional(
      AdditionalContactEmailAddresses,
    ),
    ProductionAccessEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/account/details" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountDetailsRequest",
}) as any as S.Schema<PutAccountDetailsRequest>;
export interface PutAccountDetailsResponse {}
export const PutAccountDetailsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccountDetailsResponse",
}) as any as S.Schema<PutAccountDetailsResponse>;
export interface PutAccountSendingAttributesRequest {
  SendingEnabled?: boolean;
}
export const PutAccountSendingAttributesRequest = S.suspend(() =>
  S.Struct({ SendingEnabled: S.optional(S.Boolean) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/account/sending" }),
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
export interface DashboardAttributes {
  EngagementMetrics?: string;
}
export const DashboardAttributes = S.suspend(() =>
  S.Struct({ EngagementMetrics: S.optional(S.String) }),
).annotations({
  identifier: "DashboardAttributes",
}) as any as S.Schema<DashboardAttributes>;
export interface GuardianAttributes {
  OptimizedSharedDelivery?: string;
}
export const GuardianAttributes = S.suspend(() =>
  S.Struct({ OptimizedSharedDelivery: S.optional(S.String) }),
).annotations({
  identifier: "GuardianAttributes",
}) as any as S.Schema<GuardianAttributes>;
export interface VdmAttributes {
  VdmEnabled: string;
  DashboardAttributes?: DashboardAttributes;
  GuardianAttributes?: GuardianAttributes;
}
export const VdmAttributes = S.suspend(() =>
  S.Struct({
    VdmEnabled: S.String,
    DashboardAttributes: S.optional(DashboardAttributes),
    GuardianAttributes: S.optional(GuardianAttributes),
  }),
).annotations({
  identifier: "VdmAttributes",
}) as any as S.Schema<VdmAttributes>;
export interface PutAccountVdmAttributesRequest {
  VdmAttributes: VdmAttributes;
}
export const PutAccountVdmAttributesRequest = S.suspend(() =>
  S.Struct({ VdmAttributes: VdmAttributes }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/account/vdm" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountVdmAttributesRequest",
}) as any as S.Schema<PutAccountVdmAttributesRequest>;
export interface PutAccountVdmAttributesResponse {}
export const PutAccountVdmAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccountVdmAttributesResponse",
}) as any as S.Schema<PutAccountVdmAttributesResponse>;
export interface PutConfigurationSetArchivingOptionsRequest {
  ConfigurationSetName: string;
  ArchiveArn?: string;
}
export const PutConfigurationSetArchivingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    ArchiveArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/archiving-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetArchivingOptionsRequest",
}) as any as S.Schema<PutConfigurationSetArchivingOptionsRequest>;
export interface PutConfigurationSetArchivingOptionsResponse {}
export const PutConfigurationSetArchivingOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetArchivingOptionsResponse",
}) as any as S.Schema<PutConfigurationSetArchivingOptionsResponse>;
export interface PutConfigurationSetDeliveryOptionsRequest {
  ConfigurationSetName: string;
  TlsPolicy?: string;
  SendingPoolName?: string;
  MaxDeliverySeconds?: number;
}
export const PutConfigurationSetDeliveryOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    TlsPolicy: S.optional(S.String),
    SendingPoolName: S.optional(S.String),
    MaxDeliverySeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/delivery-options",
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/reputation-options",
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/sending",
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
  HttpsPolicy?: string;
}
export const PutConfigurationSetTrackingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    CustomRedirectDomain: S.optional(S.String),
    HttpsPolicy: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/tracking-options",
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
export interface DashboardOptions {
  EngagementMetrics?: string;
}
export const DashboardOptions = S.suspend(() =>
  S.Struct({ EngagementMetrics: S.optional(S.String) }),
).annotations({
  identifier: "DashboardOptions",
}) as any as S.Schema<DashboardOptions>;
export interface GuardianOptions {
  OptimizedSharedDelivery?: string;
}
export const GuardianOptions = S.suspend(() =>
  S.Struct({ OptimizedSharedDelivery: S.optional(S.String) }),
).annotations({
  identifier: "GuardianOptions",
}) as any as S.Schema<GuardianOptions>;
export interface VdmOptions {
  DashboardOptions?: DashboardOptions;
  GuardianOptions?: GuardianOptions;
}
export const VdmOptions = S.suspend(() =>
  S.Struct({
    DashboardOptions: S.optional(DashboardOptions),
    GuardianOptions: S.optional(GuardianOptions),
  }),
).annotations({ identifier: "VdmOptions" }) as any as S.Schema<VdmOptions>;
export interface PutConfigurationSetVdmOptionsRequest {
  ConfigurationSetName: string;
  VdmOptions?: VdmOptions;
}
export const PutConfigurationSetVdmOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    VdmOptions: S.optional(VdmOptions),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/vdm-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetVdmOptionsRequest",
}) as any as S.Schema<PutConfigurationSetVdmOptionsRequest>;
export interface PutConfigurationSetVdmOptionsResponse {}
export const PutConfigurationSetVdmOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetVdmOptionsResponse",
}) as any as S.Schema<PutConfigurationSetVdmOptionsResponse>;
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
      T.Http({ method: "PUT", uri: "/v2/email/dedicated-ips/{Ip}/pool" }),
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
export interface PutDedicatedIpPoolScalingAttributesRequest {
  PoolName: string;
  ScalingMode: string;
}
export const PutDedicatedIpPoolScalingAttributesRequest = S.suspend(() =>
  S.Struct({
    PoolName: S.String.pipe(T.HttpLabel("PoolName")),
    ScalingMode: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/dedicated-ip-pools/{PoolName}/scaling",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutDedicatedIpPoolScalingAttributesRequest",
}) as any as S.Schema<PutDedicatedIpPoolScalingAttributesRequest>;
export interface PutDedicatedIpPoolScalingAttributesResponse {}
export const PutDedicatedIpPoolScalingAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDedicatedIpPoolScalingAttributesResponse",
}) as any as S.Schema<PutDedicatedIpPoolScalingAttributesResponse>;
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
      T.Http({ method: "PUT", uri: "/v2/email/dedicated-ips/{Ip}/warmup" }),
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
  TrackedIsps?: IspNameList;
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
  SubscribedDomains?: DomainDeliverabilityTrackingOptions;
}
export const PutDeliverabilityDashboardOptionRequest = S.suspend(() =>
  S.Struct({
    DashboardEnabled: S.Boolean,
    SubscribedDomains: S.optional(DomainDeliverabilityTrackingOptions),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/deliverability-dashboard" }),
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
export interface PutEmailIdentityConfigurationSetAttributesRequest {
  EmailIdentity: string;
  ConfigurationSetName?: string;
}
export const PutEmailIdentityConfigurationSetAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/identities/{EmailIdentity}/configuration-set",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEmailIdentityConfigurationSetAttributesRequest",
}) as any as S.Schema<PutEmailIdentityConfigurationSetAttributesRequest>;
export interface PutEmailIdentityConfigurationSetAttributesResponse {}
export const PutEmailIdentityConfigurationSetAttributesResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "PutEmailIdentityConfigurationSetAttributesResponse",
}) as any as S.Schema<PutEmailIdentityConfigurationSetAttributesResponse>;
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
        uri: "/v2/email/identities/{EmailIdentity}/dkim",
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
export interface DkimSigningAttributes {
  DomainSigningSelector?: string;
  DomainSigningPrivateKey?: string | Redacted.Redacted<string>;
  NextSigningKeyLength?: string;
  DomainSigningAttributesOrigin?: string;
}
export const DkimSigningAttributes = S.suspend(() =>
  S.Struct({
    DomainSigningSelector: S.optional(S.String),
    DomainSigningPrivateKey: S.optional(SensitiveString),
    NextSigningKeyLength: S.optional(S.String),
    DomainSigningAttributesOrigin: S.optional(S.String),
  }),
).annotations({
  identifier: "DkimSigningAttributes",
}) as any as S.Schema<DkimSigningAttributes>;
export interface PutEmailIdentityDkimSigningAttributesRequest {
  EmailIdentity: string;
  SigningAttributesOrigin: string;
  SigningAttributes?: DkimSigningAttributes;
}
export const PutEmailIdentityDkimSigningAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    SigningAttributesOrigin: S.String,
    SigningAttributes: S.optional(DkimSigningAttributes),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/identities/{EmailIdentity}/dkim/signing",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEmailIdentityDkimSigningAttributesRequest",
}) as any as S.Schema<PutEmailIdentityDkimSigningAttributesRequest>;
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
        uri: "/v2/email/identities/{EmailIdentity}/feedback",
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
  BehaviorOnMxFailure?: string;
}
export const PutEmailIdentityMailFromAttributesRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    MailFromDomain: S.optional(S.String),
    BehaviorOnMxFailure: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/identities/{EmailIdentity}/mail-from",
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
export interface PutSuppressedDestinationRequest {
  EmailAddress: string;
  Reason: string;
}
export const PutSuppressedDestinationRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String, Reason: S.String }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/suppression/addresses" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSuppressedDestinationRequest",
}) as any as S.Schema<PutSuppressedDestinationRequest>;
export interface PutSuppressedDestinationResponse {}
export const PutSuppressedDestinationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutSuppressedDestinationResponse",
}) as any as S.Schema<PutSuppressedDestinationResponse>;
export interface SendCustomVerificationEmailRequest {
  EmailAddress: string;
  TemplateName: string;
  ConfigurationSetName?: string;
}
export const SendCustomVerificationEmailRequest = S.suspend(() =>
  S.Struct({
    EmailAddress: S.String,
    TemplateName: S.String,
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/outbound-custom-verification-emails",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendCustomVerificationEmailRequest",
}) as any as S.Schema<SendCustomVerificationEmailRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tags" }),
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
export interface TestRenderEmailTemplateRequest {
  TemplateName: string;
  TemplateData: string;
}
export const TestRenderEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    TemplateData: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/templates/{TemplateName}/render",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestRenderEmailTemplateRequest",
}) as any as S.Schema<TestRenderEmailTemplateRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpQuery("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v2/email/tags" }),
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
export type EventTypes = string[];
export const EventTypes = S.Array(S.String);
export interface KinesisFirehoseDestination {
  IamRoleArn: string;
  DeliveryStreamArn: string;
}
export const KinesisFirehoseDestination = S.suspend(() =>
  S.Struct({ IamRoleArn: S.String, DeliveryStreamArn: S.String }),
).annotations({
  identifier: "KinesisFirehoseDestination",
}) as any as S.Schema<KinesisFirehoseDestination>;
export interface CloudWatchDimensionConfiguration {
  DimensionName: string;
  DimensionValueSource: string;
  DefaultDimensionValue: string;
}
export const CloudWatchDimensionConfiguration = S.suspend(() =>
  S.Struct({
    DimensionName: S.String,
    DimensionValueSource: S.String,
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
  DimensionConfigurations: CloudWatchDimensionConfigurations;
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
export interface EventBridgeDestination {
  EventBusArn: string;
}
export const EventBridgeDestination = S.suspend(() =>
  S.Struct({ EventBusArn: S.String }),
).annotations({
  identifier: "EventBridgeDestination",
}) as any as S.Schema<EventBridgeDestination>;
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
  MatchingEventTypes?: EventTypes;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  CloudWatchDestination?: CloudWatchDestination;
  SnsDestination?: SnsDestination;
  EventBridgeDestination?: EventBridgeDestination;
  PinpointDestination?: PinpointDestination;
}
export const EventDestinationDefinition = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: S.optional(EventTypes),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    CloudWatchDestination: S.optional(CloudWatchDestination),
    SnsDestination: S.optional(SnsDestination),
    EventBridgeDestination: S.optional(EventBridgeDestination),
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/event-destinations/{EventDestinationName}",
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
export interface TopicPreference {
  TopicName: string;
  SubscriptionStatus: string;
}
export const TopicPreference = S.suspend(() =>
  S.Struct({ TopicName: S.String, SubscriptionStatus: S.String }),
).annotations({
  identifier: "TopicPreference",
}) as any as S.Schema<TopicPreference>;
export type TopicPreferenceList = TopicPreference[];
export const TopicPreferenceList = S.Array(TopicPreference);
export interface UpdateContactRequest {
  ContactListName: string;
  EmailAddress: string;
  TopicPreferences?: TopicPreferenceList;
  UnsubscribeAll?: boolean;
  AttributesData?: string;
}
export const UpdateContactRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    EmailAddress: S.String.pipe(T.HttpLabel("EmailAddress")),
    TopicPreferences: S.optional(TopicPreferenceList),
    UnsubscribeAll: S.optional(S.Boolean),
    AttributesData: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/contact-lists/{ContactListName}/contacts/{EmailAddress}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateContactRequest",
}) as any as S.Schema<UpdateContactRequest>;
export interface UpdateContactResponse {}
export const UpdateContactResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateContactResponse",
}) as any as S.Schema<UpdateContactResponse>;
export interface Topic {
  TopicName: string;
  DisplayName: string;
  Description?: string;
  DefaultSubscriptionStatus: string;
}
export const Topic = S.suspend(() =>
  S.Struct({
    TopicName: S.String,
    DisplayName: S.String,
    Description: S.optional(S.String),
    DefaultSubscriptionStatus: S.String,
  }),
).annotations({ identifier: "Topic" }) as any as S.Schema<Topic>;
export type Topics = Topic[];
export const Topics = S.Array(Topic);
export interface UpdateContactListRequest {
  ContactListName: string;
  Topics?: Topics;
  Description?: string;
}
export const UpdateContactListRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    Topics: S.optional(Topics),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/contact-lists/{ContactListName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateContactListRequest",
}) as any as S.Schema<UpdateContactListRequest>;
export interface UpdateContactListResponse {}
export const UpdateContactListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateContactListResponse",
}) as any as S.Schema<UpdateContactListResponse>;
export interface UpdateCustomVerificationEmailTemplateRequest {
  TemplateName: string;
  FromEmailAddress: string;
  TemplateSubject: string;
  TemplateContent: string;
  SuccessRedirectionURL: string;
  FailureRedirectionURL: string;
}
export const UpdateCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    FromEmailAddress: S.String,
    TemplateSubject: S.String,
    TemplateContent: S.String,
    SuccessRedirectionURL: S.String,
    FailureRedirectionURL: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/custom-verification-email-templates/{TemplateName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<UpdateCustomVerificationEmailTemplateRequest>;
export interface UpdateCustomVerificationEmailTemplateResponse {}
export const UpdateCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<UpdateCustomVerificationEmailTemplateResponse>;
export interface UpdateEmailIdentityPolicyRequest {
  EmailIdentity: string;
  PolicyName: string;
  Policy: string;
}
export const UpdateEmailIdentityPolicyRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String.pipe(T.HttpLabel("EmailIdentity")),
    PolicyName: S.String.pipe(T.HttpLabel("PolicyName")),
    Policy: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/identities/{EmailIdentity}/policies/{PolicyName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEmailIdentityPolicyRequest",
}) as any as S.Schema<UpdateEmailIdentityPolicyRequest>;
export interface UpdateEmailIdentityPolicyResponse {}
export const UpdateEmailIdentityPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEmailIdentityPolicyResponse",
}) as any as S.Schema<UpdateEmailIdentityPolicyResponse>;
export interface EmailTemplateContent {
  Subject?: string;
  Text?: string;
  Html?: string;
}
export const EmailTemplateContent = S.suspend(() =>
  S.Struct({
    Subject: S.optional(S.String),
    Text: S.optional(S.String),
    Html: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailTemplateContent",
}) as any as S.Schema<EmailTemplateContent>;
export interface UpdateEmailTemplateRequest {
  TemplateName: string;
  TemplateContent: EmailTemplateContent;
}
export const UpdateEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String.pipe(T.HttpLabel("TemplateName")),
    TemplateContent: EmailTemplateContent,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/templates/{TemplateName}" }),
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
export interface UpdateEmailTemplateResponse {}
export const UpdateEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEmailTemplateResponse",
}) as any as S.Schema<UpdateEmailTemplateResponse>;
export interface UpdateReputationEntityCustomerManagedStatusRequest {
  ReputationEntityType: string;
  ReputationEntityReference: string;
  SendingStatus: string;
}
export const UpdateReputationEntityCustomerManagedStatusRequest = S.suspend(
  () =>
    S.Struct({
      ReputationEntityType: S.String.pipe(T.HttpLabel("ReputationEntityType")),
      ReputationEntityReference: S.String.pipe(
        T.HttpLabel("ReputationEntityReference"),
      ),
      SendingStatus: S.String,
    }).pipe(
      T.all(
        T.Http({
          method: "PUT",
          uri: "/v2/email/reputation/entities/{ReputationEntityType}/{ReputationEntityReference}/customer-managed-status",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "UpdateReputationEntityCustomerManagedStatusRequest",
}) as any as S.Schema<UpdateReputationEntityCustomerManagedStatusRequest>;
export interface UpdateReputationEntityCustomerManagedStatusResponse {}
export const UpdateReputationEntityCustomerManagedStatusResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "UpdateReputationEntityCustomerManagedStatusResponse",
}) as any as S.Schema<UpdateReputationEntityCustomerManagedStatusResponse>;
export interface UpdateReputationEntityPolicyRequest {
  ReputationEntityType: string;
  ReputationEntityReference: string;
  ReputationEntityPolicy: string;
}
export const UpdateReputationEntityPolicyRequest = S.suspend(() =>
  S.Struct({
    ReputationEntityType: S.String.pipe(T.HttpLabel("ReputationEntityType")),
    ReputationEntityReference: S.String.pipe(
      T.HttpLabel("ReputationEntityReference"),
    ),
    ReputationEntityPolicy: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/reputation/entities/{ReputationEntityType}/{ReputationEntityReference}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReputationEntityPolicyRequest",
}) as any as S.Schema<UpdateReputationEntityPolicyRequest>;
export interface UpdateReputationEntityPolicyResponse {}
export const UpdateReputationEntityPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateReputationEntityPolicyResponse",
}) as any as S.Schema<UpdateReputationEntityPolicyResponse>;
export interface TrackingOptions {
  CustomRedirectDomain: string;
  HttpsPolicy?: string;
}
export const TrackingOptions = S.suspend(() =>
  S.Struct({
    CustomRedirectDomain: S.String,
    HttpsPolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "TrackingOptions",
}) as any as S.Schema<TrackingOptions>;
export interface DeliveryOptions {
  TlsPolicy?: string;
  SendingPoolName?: string;
  MaxDeliverySeconds?: number;
}
export const DeliveryOptions = S.suspend(() =>
  S.Struct({
    TlsPolicy: S.optional(S.String),
    SendingPoolName: S.optional(S.String),
    MaxDeliverySeconds: S.optional(S.Number),
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
export interface SuppressionConfidenceThreshold {
  ConfidenceVerdictThreshold: string;
}
export const SuppressionConfidenceThreshold = S.suspend(() =>
  S.Struct({ ConfidenceVerdictThreshold: S.String }),
).annotations({
  identifier: "SuppressionConfidenceThreshold",
}) as any as S.Schema<SuppressionConfidenceThreshold>;
export interface SuppressionConditionThreshold {
  ConditionThresholdEnabled: string;
  OverallConfidenceThreshold?: SuppressionConfidenceThreshold;
}
export const SuppressionConditionThreshold = S.suspend(() =>
  S.Struct({
    ConditionThresholdEnabled: S.String,
    OverallConfidenceThreshold: S.optional(SuppressionConfidenceThreshold),
  }),
).annotations({
  identifier: "SuppressionConditionThreshold",
}) as any as S.Schema<SuppressionConditionThreshold>;
export interface SuppressionValidationOptions {
  ConditionThreshold: SuppressionConditionThreshold;
}
export const SuppressionValidationOptions = S.suspend(() =>
  S.Struct({ ConditionThreshold: SuppressionConditionThreshold }),
).annotations({
  identifier: "SuppressionValidationOptions",
}) as any as S.Schema<SuppressionValidationOptions>;
export interface SuppressionOptions {
  SuppressedReasons?: SuppressionListReasons;
  ValidationOptions?: SuppressionValidationOptions;
}
export const SuppressionOptions = S.suspend(() =>
  S.Struct({
    SuppressedReasons: S.optional(SuppressionListReasons),
    ValidationOptions: S.optional(SuppressionValidationOptions),
  }),
).annotations({
  identifier: "SuppressionOptions",
}) as any as S.Schema<SuppressionOptions>;
export interface ArchivingOptions {
  ArchiveArn?: string;
}
export const ArchivingOptions = S.suspend(() =>
  S.Struct({ ArchiveArn: S.optional(S.String) }),
).annotations({
  identifier: "ArchivingOptions",
}) as any as S.Schema<ArchivingOptions>;
export interface ExportDestination {
  DataFormat: string;
  S3Url?: string;
}
export const ExportDestination = S.suspend(() =>
  S.Struct({ DataFormat: S.String, S3Url: S.optional(S.String) }),
).annotations({
  identifier: "ExportDestination",
}) as any as S.Schema<ExportDestination>;
export interface ImportDataSource {
  S3Url: string;
  DataFormat: string;
}
export const ImportDataSource = S.suspend(() =>
  S.Struct({ S3Url: S.String, DataFormat: S.String }),
).annotations({
  identifier: "ImportDataSource",
}) as any as S.Schema<ImportDataSource>;
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
export interface SuppressionValidationAttributes {
  ConditionThreshold: SuppressionConditionThreshold;
}
export const SuppressionValidationAttributes = S.suspend(() =>
  S.Struct({ ConditionThreshold: SuppressionConditionThreshold }),
).annotations({
  identifier: "SuppressionValidationAttributes",
}) as any as S.Schema<SuppressionValidationAttributes>;
export interface SuppressionAttributes {
  SuppressedReasons?: SuppressionListReasons;
  ValidationAttributes?: SuppressionValidationAttributes;
}
export const SuppressionAttributes = S.suspend(() =>
  S.Struct({
    SuppressedReasons: S.optional(SuppressionListReasons),
    ValidationAttributes: S.optional(SuppressionValidationAttributes),
  }),
).annotations({
  identifier: "SuppressionAttributes",
}) as any as S.Schema<SuppressionAttributes>;
export interface DedicatedIp {
  Ip: string;
  WarmupStatus: string;
  WarmupPercentage: number;
  PoolName?: string;
}
export const DedicatedIp = S.suspend(() =>
  S.Struct({
    Ip: S.String,
    WarmupStatus: S.String,
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
export interface DeliverabilityTestReport {
  ReportId?: string;
  ReportName?: string;
  Subject?: string;
  FromEmailAddress?: string;
  CreateDate?: Date;
  DeliverabilityTestStatus?: string;
}
export const DeliverabilityTestReport = S.suspend(() =>
  S.Struct({
    ReportId: S.optional(S.String),
    ReportName: S.optional(S.String),
    Subject: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeliverabilityTestStatus: S.optional(S.String),
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
  SendingIps?: IpList;
  FirstSeenDateTime?: Date;
  LastSeenDateTime?: Date;
  InboxCount?: number;
  SpamCount?: number;
  ReadRate?: number;
  DeleteRate?: number;
  ReadDeleteRate?: number;
  ProjectedVolume?: number;
  Esps?: Esps;
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
export type ListRecommendationsFilter = { [key: string]: string };
export const ListRecommendationsFilter = S.Record({
  key: S.String,
  value: S.String,
});
export type ReputationEntityFilter = { [key: string]: string };
export const ReputationEntityFilter = S.Record({
  key: S.String,
  value: S.String,
});
export type ListTenantResourcesFilter = { [key: string]: string };
export const ListTenantResourcesFilter = S.Record({
  key: S.String,
  value: S.String,
});
export type DnsTokenList = string[];
export const DnsTokenList = S.Array(S.String);
export interface MessageTag {
  Name: string;
  Value: string;
}
export const MessageTag = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "MessageTag" }) as any as S.Schema<MessageTag>;
export type MessageTagList = MessageTag[];
export const MessageTagList = S.Array(MessageTag);
export interface MessageHeader {
  Name: string;
  Value: string;
}
export const MessageHeader = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "MessageHeader",
}) as any as S.Schema<MessageHeader>;
export type MessageHeaderList = MessageHeader[];
export const MessageHeaderList = S.Array(MessageHeader);
export interface Attachment {
  RawContent: Uint8Array;
  ContentDisposition?: string;
  FileName: string;
  ContentDescription?: string;
  ContentId?: string;
  ContentTransferEncoding?: string;
  ContentType?: string;
}
export const Attachment = S.suspend(() =>
  S.Struct({
    RawContent: T.Blob,
    ContentDisposition: S.optional(S.String),
    FileName: S.String,
    ContentDescription: S.optional(S.String),
    ContentId: S.optional(S.String),
    ContentTransferEncoding: S.optional(S.String),
    ContentType: S.optional(S.String),
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export type AttachmentList = Attachment[];
export const AttachmentList = S.Array(Attachment);
export interface Template {
  TemplateName?: string;
  TemplateArn?: string;
  TemplateContent?: EmailTemplateContent;
  TemplateData?: string;
  Headers?: MessageHeaderList;
  Attachments?: AttachmentList;
}
export const Template = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    TemplateArn: S.optional(S.String),
    TemplateContent: S.optional(EmailTemplateContent),
    TemplateData: S.optional(S.String),
    Headers: S.optional(MessageHeaderList),
    Attachments: S.optional(AttachmentList),
  }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface BulkEmailContent {
  Template?: Template;
}
export const BulkEmailContent = S.suspend(() =>
  S.Struct({ Template: S.optional(Template) }),
).annotations({
  identifier: "BulkEmailContent",
}) as any as S.Schema<BulkEmailContent>;
export interface Destination {
  ToAddresses?: EmailAddressList;
  CcAddresses?: EmailAddressList;
  BccAddresses?: EmailAddressList;
}
export const Destination = S.suspend(() =>
  S.Struct({
    ToAddresses: S.optional(EmailAddressList),
    CcAddresses: S.optional(EmailAddressList),
    BccAddresses: S.optional(EmailAddressList),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface ListManagementOptions {
  ContactListName: string;
  TopicName?: string;
}
export const ListManagementOptions = S.suspend(() =>
  S.Struct({ ContactListName: S.String, TopicName: S.optional(S.String) }),
).annotations({
  identifier: "ListManagementOptions",
}) as any as S.Schema<ListManagementOptions>;
export interface CreateContactRequest {
  ContactListName: string;
  EmailAddress: string;
  TopicPreferences?: TopicPreferenceList;
  UnsubscribeAll?: boolean;
  AttributesData?: string;
}
export const CreateContactRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    EmailAddress: S.String,
    TopicPreferences: S.optional(TopicPreferenceList),
    UnsubscribeAll: S.optional(S.Boolean),
    AttributesData: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/contact-lists/{ContactListName}/contacts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContactRequest",
}) as any as S.Schema<CreateContactRequest>;
export interface CreateContactResponse {}
export const CreateContactResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateContactResponse",
}) as any as S.Schema<CreateContactResponse>;
export interface CreateContactListRequest {
  ContactListName: string;
  Topics?: Topics;
  Description?: string;
  Tags?: TagList;
}
export const CreateContactListRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String,
    Topics: S.optional(Topics),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/contact-lists" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateContactListRequest",
}) as any as S.Schema<CreateContactListRequest>;
export interface CreateContactListResponse {}
export const CreateContactListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateContactListResponse",
}) as any as S.Schema<CreateContactListResponse>;
export interface CreateEmailIdentityRequest {
  EmailIdentity: string;
  Tags?: TagList;
  DkimSigningAttributes?: DkimSigningAttributes;
  ConfigurationSetName?: string;
}
export const CreateEmailIdentityRequest = S.suspend(() =>
  S.Struct({
    EmailIdentity: S.String,
    Tags: S.optional(TagList),
    DkimSigningAttributes: S.optional(DkimSigningAttributes),
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/identities" }),
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
export interface CreateEmailTemplateRequest {
  TemplateName: string;
  TemplateContent: EmailTemplateContent;
  Tags?: TagList;
}
export const CreateEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    TemplateContent: EmailTemplateContent,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/templates" }),
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
export interface CreateEmailTemplateResponse {}
export const CreateEmailTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateEmailTemplateResponse",
}) as any as S.Schema<CreateEmailTemplateResponse>;
export interface CreateTenantResponse {
  TenantName?: string;
  TenantId?: string;
  TenantArn?: string;
  CreatedTimestamp?: Date;
  Tags?: TagList;
  SendingStatus?: string;
}
export const CreateTenantResponse = S.suspend(() =>
  S.Struct({
    TenantName: S.optional(S.String),
    TenantId: S.optional(S.String),
    TenantArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagList),
    SendingStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateTenantResponse",
}) as any as S.Schema<CreateTenantResponse>;
export interface DeleteMultiRegionEndpointResponse {
  Status?: string;
}
export const DeleteMultiRegionEndpointResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "DeleteMultiRegionEndpointResponse",
}) as any as S.Schema<DeleteMultiRegionEndpointResponse>;
export interface GetConfigurationSetResponse {
  ConfigurationSetName?: string;
  TrackingOptions?: TrackingOptions;
  DeliveryOptions?: DeliveryOptions;
  ReputationOptions?: ReputationOptions;
  SendingOptions?: SendingOptions;
  Tags?: TagList;
  SuppressionOptions?: SuppressionOptions;
  VdmOptions?: VdmOptions;
  ArchivingOptions?: ArchivingOptions;
}
export const GetConfigurationSetResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.optional(S.String),
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
    SendingOptions: S.optional(SendingOptions),
    Tags: S.optional(TagList),
    SuppressionOptions: S.optional(SuppressionOptions),
    VdmOptions: S.optional(VdmOptions),
    ArchivingOptions: S.optional(ArchivingOptions),
  }),
).annotations({
  identifier: "GetConfigurationSetResponse",
}) as any as S.Schema<GetConfigurationSetResponse>;
export interface GetContactResponse {
  ContactListName?: string;
  EmailAddress?: string;
  TopicPreferences?: TopicPreferenceList;
  TopicDefaultPreferences?: TopicPreferenceList;
  UnsubscribeAll?: boolean;
  AttributesData?: string;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const GetContactResponse = S.suspend(() =>
  S.Struct({
    ContactListName: S.optional(S.String),
    EmailAddress: S.optional(S.String),
    TopicPreferences: S.optional(TopicPreferenceList),
    TopicDefaultPreferences: S.optional(TopicPreferenceList),
    UnsubscribeAll: S.optional(S.Boolean),
    AttributesData: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetContactResponse",
}) as any as S.Schema<GetContactResponse>;
export interface GetContactListResponse {
  ContactListName?: string;
  Topics?: Topics;
  Description?: string;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  Tags?: TagList;
}
export const GetContactListResponse = S.suspend(() =>
  S.Struct({
    ContactListName: S.optional(S.String),
    Topics: S.optional(Topics),
    Description: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetContactListResponse",
}) as any as S.Schema<GetContactListResponse>;
export interface GetCustomVerificationEmailTemplateResponse {
  TemplateName?: string;
  FromEmailAddress?: string;
  TemplateSubject?: string;
  TemplateContent?: string;
  Tags?: TagList;
  SuccessRedirectionURL?: string;
  FailureRedirectionURL?: string;
}
export const GetCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    TemplateContent: S.optional(S.String),
    Tags: S.optional(TagList),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<GetCustomVerificationEmailTemplateResponse>;
export interface GetDedicatedIpsResponse {
  DedicatedIps?: DedicatedIpList;
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
export type PolicyMap = { [key: string]: string };
export const PolicyMap = S.Record({ key: S.String, value: S.String });
export interface GetEmailIdentityPoliciesResponse {
  Policies?: PolicyMap;
}
export const GetEmailIdentityPoliciesResponse = S.suspend(() =>
  S.Struct({ Policies: S.optional(PolicyMap) }),
).annotations({
  identifier: "GetEmailIdentityPoliciesResponse",
}) as any as S.Schema<GetEmailIdentityPoliciesResponse>;
export interface GetEmailTemplateResponse {
  TemplateName: string;
  TemplateContent: EmailTemplateContent;
  Tags?: TagList;
}
export const GetEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    TemplateContent: EmailTemplateContent,
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetEmailTemplateResponse",
}) as any as S.Schema<GetEmailTemplateResponse>;
export interface SuppressionListDestination {
  SuppressionListImportAction: string;
}
export const SuppressionListDestination = S.suspend(() =>
  S.Struct({ SuppressionListImportAction: S.String }),
).annotations({
  identifier: "SuppressionListDestination",
}) as any as S.Schema<SuppressionListDestination>;
export interface ContactListDestination {
  ContactListName: string;
  ContactListImportAction: string;
}
export const ContactListDestination = S.suspend(() =>
  S.Struct({ ContactListName: S.String, ContactListImportAction: S.String }),
).annotations({
  identifier: "ContactListDestination",
}) as any as S.Schema<ContactListDestination>;
export interface ImportDestination {
  SuppressionListDestination?: SuppressionListDestination;
  ContactListDestination?: ContactListDestination;
}
export const ImportDestination = S.suspend(() =>
  S.Struct({
    SuppressionListDestination: S.optional(SuppressionListDestination),
    ContactListDestination: S.optional(ContactListDestination),
  }),
).annotations({
  identifier: "ImportDestination",
}) as any as S.Schema<ImportDestination>;
export interface FailureInfo {
  FailedRecordsS3Url?: string;
  ErrorMessage?: string;
}
export const FailureInfo = S.suspend(() =>
  S.Struct({
    FailedRecordsS3Url: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "FailureInfo" }) as any as S.Schema<FailureInfo>;
export interface GetImportJobResponse {
  JobId?: string;
  ImportDestination?: ImportDestination;
  ImportDataSource?: ImportDataSource;
  FailureInfo?: FailureInfo;
  JobStatus?: string;
  CreatedTimestamp?: Date;
  CompletedTimestamp?: Date;
  ProcessedRecordsCount?: number;
  FailedRecordsCount?: number;
}
export const GetImportJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    ImportDestination: S.optional(ImportDestination),
    ImportDataSource: S.optional(ImportDataSource),
    FailureInfo: S.optional(FailureInfo),
    JobStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProcessedRecordsCount: S.optional(S.Number),
    FailedRecordsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetImportJobResponse",
}) as any as S.Schema<GetImportJobResponse>;
export interface ListConfigurationSetsResponse {
  ConfigurationSets?: ConfigurationSetNameList;
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
  DedicatedIpPools?: ListOfDedicatedIpPools;
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
  DeliverabilityTestReports: DeliverabilityTestReports;
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
  DomainDeliverabilityCampaigns: DomainDeliverabilityCampaignList;
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
export interface ListRecommendationsRequest {
  Filter?: ListRecommendationsFilter;
  NextToken?: string;
  PageSize?: number;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ListRecommendationsFilter),
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/vdm/recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommendationsRequest",
}) as any as S.Schema<ListRecommendationsRequest>;
export interface ListReputationEntitiesRequest {
  Filter?: ReputationEntityFilter;
  NextToken?: string;
  PageSize?: number;
}
export const ListReputationEntitiesRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ReputationEntityFilter),
    NextToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/reputation/entities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReputationEntitiesRequest",
}) as any as S.Schema<ListReputationEntitiesRequest>;
export interface ListTagsForResourceResponse {
  Tags: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTenantResourcesRequest {
  TenantName: string;
  Filter?: ListTenantResourcesFilter;
  PageSize?: number;
  NextToken?: string;
}
export const ListTenantResourcesRequest = S.suspend(() =>
  S.Struct({
    TenantName: S.String,
    Filter: S.optional(ListTenantResourcesFilter),
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/tenants/resources/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTenantResourcesRequest",
}) as any as S.Schema<ListTenantResourcesRequest>;
export interface PutConfigurationSetSuppressionOptionsRequest {
  ConfigurationSetName: string;
  SuppressedReasons?: SuppressionListReasons;
  ValidationOptions?: SuppressionValidationOptions;
}
export const PutConfigurationSetSuppressionOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String.pipe(T.HttpLabel("ConfigurationSetName")),
    SuppressedReasons: S.optional(SuppressionListReasons),
    ValidationOptions: S.optional(SuppressionValidationOptions),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/suppression-options",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetSuppressionOptionsRequest",
}) as any as S.Schema<PutConfigurationSetSuppressionOptionsRequest>;
export interface PutConfigurationSetSuppressionOptionsResponse {}
export const PutConfigurationSetSuppressionOptionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutConfigurationSetSuppressionOptionsResponse",
}) as any as S.Schema<PutConfigurationSetSuppressionOptionsResponse>;
export interface PutEmailIdentityDkimSigningAttributesResponse {
  DkimStatus?: string;
  DkimTokens?: DnsTokenList;
  SigningHostedZone?: string;
}
export const PutEmailIdentityDkimSigningAttributesResponse = S.suspend(() =>
  S.Struct({
    DkimStatus: S.optional(S.String),
    DkimTokens: S.optional(DnsTokenList),
    SigningHostedZone: S.optional(S.String),
  }),
).annotations({
  identifier: "PutEmailIdentityDkimSigningAttributesResponse",
}) as any as S.Schema<PutEmailIdentityDkimSigningAttributesResponse>;
export interface SendCustomVerificationEmailResponse {
  MessageId?: string;
}
export const SendCustomVerificationEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendCustomVerificationEmailResponse",
}) as any as S.Schema<SendCustomVerificationEmailResponse>;
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
  Headers?: MessageHeaderList;
  Attachments?: AttachmentList;
}
export const Message = S.suspend(() =>
  S.Struct({
    Subject: Content,
    Body: Body,
    Headers: S.optional(MessageHeaderList),
    Attachments: S.optional(AttachmentList),
  }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export interface RawMessage {
  Data: Uint8Array;
}
export const RawMessage = S.suspend(() =>
  S.Struct({ Data: T.Blob }),
).annotations({ identifier: "RawMessage" }) as any as S.Schema<RawMessage>;
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
  FromEmailAddressIdentityArn?: string;
  Destination?: Destination;
  ReplyToAddresses?: EmailAddressList;
  FeedbackForwardingEmailAddress?: string;
  FeedbackForwardingEmailAddressIdentityArn?: string;
  Content: EmailContent;
  EmailTags?: MessageTagList;
  ConfigurationSetName?: string;
  EndpointId?: string;
  TenantName?: string;
  ListManagementOptions?: ListManagementOptions;
}
export const SendEmailRequest = S.suspend(() =>
  S.Struct({
    FromEmailAddress: S.optional(S.String),
    FromEmailAddressIdentityArn: S.optional(S.String),
    Destination: S.optional(Destination),
    ReplyToAddresses: S.optional(EmailAddressList),
    FeedbackForwardingEmailAddress: S.optional(S.String),
    FeedbackForwardingEmailAddressIdentityArn: S.optional(S.String),
    Content: EmailContent,
    EmailTags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
    EndpointId: S.optional(S.String).pipe(T.ContextParam("EndpointId")),
    TenantName: S.optional(S.String),
    ListManagementOptions: S.optional(ListManagementOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/outbound-emails" }),
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
export interface TestRenderEmailTemplateResponse {
  RenderedTemplate: string;
}
export const TestRenderEmailTemplateResponse = S.suspend(() =>
  S.Struct({ RenderedTemplate: S.String }),
).annotations({
  identifier: "TestRenderEmailTemplateResponse",
}) as any as S.Schema<TestRenderEmailTemplateResponse>;
export type Dimensions = { [key: string]: string };
export const Dimensions = S.Record({ key: S.String, value: S.String });
export interface RouteDetails {
  Region: string;
}
export const RouteDetails = S.suspend(() =>
  S.Struct({ Region: S.String }),
).annotations({ identifier: "RouteDetails" }) as any as S.Schema<RouteDetails>;
export type RoutesDetails = RouteDetails[];
export const RoutesDetails = S.Array(RouteDetails);
export interface ReviewDetails {
  Status?: string;
  CaseId?: string;
}
export const ReviewDetails = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String), CaseId: S.optional(S.String) }),
).annotations({
  identifier: "ReviewDetails",
}) as any as S.Schema<ReviewDetails>;
export interface TopicFilter {
  TopicName?: string;
  UseDefaultIfPreferenceUnavailable?: boolean;
}
export const TopicFilter = S.suspend(() =>
  S.Struct({
    TopicName: S.optional(S.String),
    UseDefaultIfPreferenceUnavailable: S.optional(S.Boolean),
  }),
).annotations({ identifier: "TopicFilter" }) as any as S.Schema<TopicFilter>;
export type Regions = string[];
export const Regions = S.Array(S.String);
export type ExportDimensionValue = string[];
export const ExportDimensionValue = S.Array(S.String);
export type EmailAddressFilterList = string | Redacted.Redacted<string>[];
export const EmailAddressFilterList = S.Array(SensitiveString);
export type EmailSubjectFilterList = string | Redacted.Redacted<string>[];
export const EmailSubjectFilterList = S.Array(SensitiveString);
export type IspFilterList = string[];
export const IspFilterList = S.Array(S.String);
export type LastDeliveryEventList = string[];
export const LastDeliveryEventList = S.Array(S.String);
export type LastEngagementEventList = string[];
export const LastEngagementEventList = S.Array(S.String);
export interface BatchGetMetricDataQuery {
  Id: string;
  Namespace: string;
  Metric: string;
  Dimensions?: Dimensions;
  StartDate: Date;
  EndDate: Date;
}
export const BatchGetMetricDataQuery = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Namespace: S.String,
    Metric: S.String,
    Dimensions: S.optional(Dimensions),
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BatchGetMetricDataQuery",
}) as any as S.Schema<BatchGetMetricDataQuery>;
export type BatchGetMetricDataQueries = BatchGetMetricDataQuery[];
export const BatchGetMetricDataQueries = S.Array(BatchGetMetricDataQuery);
export interface Details {
  RoutesDetails: RoutesDetails;
}
export const Details = S.suspend(() =>
  S.Struct({ RoutesDetails: RoutesDetails }),
).annotations({ identifier: "Details" }) as any as S.Schema<Details>;
export interface AccountDetails {
  MailType?: string;
  WebsiteURL?: string | Redacted.Redacted<string>;
  ContactLanguage?: string;
  UseCaseDescription?: string | Redacted.Redacted<string>;
  AdditionalContactEmailAddresses?: AdditionalContactEmailAddresses;
  ReviewDetails?: ReviewDetails;
}
export const AccountDetails = S.suspend(() =>
  S.Struct({
    MailType: S.optional(S.String),
    WebsiteURL: S.optional(SensitiveString),
    ContactLanguage: S.optional(S.String),
    UseCaseDescription: S.optional(SensitiveString),
    AdditionalContactEmailAddresses: S.optional(
      AdditionalContactEmailAddresses,
    ),
    ReviewDetails: S.optional(ReviewDetails),
  }),
).annotations({
  identifier: "AccountDetails",
}) as any as S.Schema<AccountDetails>;
export interface EventDestination {
  Name: string;
  Enabled?: boolean;
  MatchingEventTypes: EventTypes;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  CloudWatchDestination?: CloudWatchDestination;
  SnsDestination?: SnsDestination;
  EventBridgeDestination?: EventBridgeDestination;
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
    EventBridgeDestination: S.optional(EventBridgeDestination),
    PinpointDestination: S.optional(PinpointDestination),
  }),
).annotations({
  identifier: "EventDestination",
}) as any as S.Schema<EventDestination>;
export type EventDestinations = EventDestination[];
export const EventDestinations = S.Array(EventDestination);
export interface DedicatedIpPool {
  PoolName: string;
  ScalingMode: string;
}
export const DedicatedIpPool = S.suspend(() =>
  S.Struct({ PoolName: S.String, ScalingMode: S.String }),
).annotations({
  identifier: "DedicatedIpPool",
}) as any as S.Schema<DedicatedIpPool>;
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
  DomainIspPlacements?: DomainIspPlacements;
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
export interface DkimAttributes {
  SigningEnabled?: boolean;
  Status?: string;
  Tokens?: DnsTokenList;
  SigningHostedZone?: string;
  SigningAttributesOrigin?: string;
  NextSigningKeyLength?: string;
  CurrentSigningKeyLength?: string;
  LastKeyGenerationTimestamp?: Date;
}
export const DkimAttributes = S.suspend(() =>
  S.Struct({
    SigningEnabled: S.optional(S.Boolean),
    Status: S.optional(S.String),
    Tokens: S.optional(DnsTokenList),
    SigningHostedZone: S.optional(S.String),
    SigningAttributesOrigin: S.optional(S.String),
    NextSigningKeyLength: S.optional(S.String),
    CurrentSigningKeyLength: S.optional(S.String),
    LastKeyGenerationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DkimAttributes",
}) as any as S.Schema<DkimAttributes>;
export interface MailFromAttributes {
  MailFromDomain: string;
  MailFromDomainStatus: string;
  BehaviorOnMxFailure: string;
}
export const MailFromAttributes = S.suspend(() =>
  S.Struct({
    MailFromDomain: S.String,
    MailFromDomainStatus: S.String,
    BehaviorOnMxFailure: S.String,
  }),
).annotations({
  identifier: "MailFromAttributes",
}) as any as S.Schema<MailFromAttributes>;
export interface ExportStatistics {
  ProcessedRecordsCount?: number;
  ExportedRecordsCount?: number;
}
export const ExportStatistics = S.suspend(() =>
  S.Struct({
    ProcessedRecordsCount: S.optional(S.Number),
    ExportedRecordsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExportStatistics",
}) as any as S.Schema<ExportStatistics>;
export interface Route {
  Region: string;
}
export const Route = S.suspend(() =>
  S.Struct({ Region: S.String }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type Routes = Route[];
export const Routes = S.Array(Route);
export interface Tenant {
  TenantName?: string;
  TenantId?: string;
  TenantArn?: string;
  CreatedTimestamp?: Date;
  Tags?: TagList;
  SendingStatus?: string;
}
export const Tenant = S.suspend(() =>
  S.Struct({
    TenantName: S.optional(S.String),
    TenantId: S.optional(S.String),
    TenantArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Tags: S.optional(TagList),
    SendingStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Tenant" }) as any as S.Schema<Tenant>;
export interface ContactList {
  ContactListName?: string;
  LastUpdatedTimestamp?: Date;
}
export const ContactList = S.suspend(() =>
  S.Struct({
    ContactListName: S.optional(S.String),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ContactList" }) as any as S.Schema<ContactList>;
export type ListOfContactLists = ContactList[];
export const ListOfContactLists = S.Array(ContactList);
export interface ListContactsFilter {
  FilteredStatus?: string;
  TopicFilter?: TopicFilter;
}
export const ListContactsFilter = S.suspend(() =>
  S.Struct({
    FilteredStatus: S.optional(S.String),
    TopicFilter: S.optional(TopicFilter),
  }),
).annotations({
  identifier: "ListContactsFilter",
}) as any as S.Schema<ListContactsFilter>;
export interface CustomVerificationEmailTemplateMetadata {
  TemplateName?: string;
  FromEmailAddress?: string;
  TemplateSubject?: string;
  SuccessRedirectionURL?: string;
  FailureRedirectionURL?: string;
}
export const CustomVerificationEmailTemplateMetadata = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomVerificationEmailTemplateMetadata",
}) as any as S.Schema<CustomVerificationEmailTemplateMetadata>;
export type CustomVerificationEmailTemplatesList =
  CustomVerificationEmailTemplateMetadata[];
export const CustomVerificationEmailTemplatesList = S.Array(
  CustomVerificationEmailTemplateMetadata,
);
export interface IdentityInfo {
  IdentityType?: string;
  IdentityName?: string;
  SendingEnabled?: boolean;
  VerificationStatus?: string;
}
export const IdentityInfo = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(S.String),
    IdentityName: S.optional(S.String),
    SendingEnabled: S.optional(S.Boolean),
    VerificationStatus: S.optional(S.String),
  }),
).annotations({ identifier: "IdentityInfo" }) as any as S.Schema<IdentityInfo>;
export type IdentityInfoList = IdentityInfo[];
export const IdentityInfoList = S.Array(IdentityInfo);
export interface EmailTemplateMetadata {
  TemplateName?: string;
  CreatedTimestamp?: Date;
}
export const EmailTemplateMetadata = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "EmailTemplateMetadata",
}) as any as S.Schema<EmailTemplateMetadata>;
export type EmailTemplateMetadataList = EmailTemplateMetadata[];
export const EmailTemplateMetadataList = S.Array(EmailTemplateMetadata);
export interface ExportJobSummary {
  JobId?: string;
  ExportSourceType?: string;
  JobStatus?: string;
  CreatedTimestamp?: Date;
  CompletedTimestamp?: Date;
}
export const ExportJobSummary = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    ExportSourceType: S.optional(S.String),
    JobStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ExportJobSummary",
}) as any as S.Schema<ExportJobSummary>;
export type ExportJobSummaryList = ExportJobSummary[];
export const ExportJobSummaryList = S.Array(ExportJobSummary);
export interface ImportJobSummary {
  JobId?: string;
  ImportDestination?: ImportDestination;
  JobStatus?: string;
  CreatedTimestamp?: Date;
  ProcessedRecordsCount?: number;
  FailedRecordsCount?: number;
}
export const ImportJobSummary = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    ImportDestination: S.optional(ImportDestination),
    JobStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProcessedRecordsCount: S.optional(S.Number),
    FailedRecordsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ImportJobSummary",
}) as any as S.Schema<ImportJobSummary>;
export type ImportJobSummaryList = ImportJobSummary[];
export const ImportJobSummaryList = S.Array(ImportJobSummary);
export interface MultiRegionEndpoint {
  EndpointName?: string;
  Status?: string;
  EndpointId?: string;
  Regions?: Regions;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const MultiRegionEndpoint = S.suspend(() =>
  S.Struct({
    EndpointName: S.optional(S.String),
    Status: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Regions: S.optional(Regions),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "MultiRegionEndpoint",
}) as any as S.Schema<MultiRegionEndpoint>;
export type MultiRegionEndpoints = MultiRegionEndpoint[];
export const MultiRegionEndpoints = S.Array(MultiRegionEndpoint);
export interface StatusRecord {
  Status?: string;
  Cause?: string;
  LastUpdatedTimestamp?: Date;
}
export const StatusRecord = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    Cause: S.optional(S.String),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "StatusRecord" }) as any as S.Schema<StatusRecord>;
export interface ReputationEntity {
  ReputationEntityReference?: string;
  ReputationEntityType?: string;
  ReputationManagementPolicy?: string;
  CustomerManagedStatus?: StatusRecord;
  AwsSesManagedStatus?: StatusRecord;
  SendingStatusAggregate?: string;
  ReputationImpact?: string;
}
export const ReputationEntity = S.suspend(() =>
  S.Struct({
    ReputationEntityReference: S.optional(S.String),
    ReputationEntityType: S.optional(S.String),
    ReputationManagementPolicy: S.optional(S.String),
    CustomerManagedStatus: S.optional(StatusRecord),
    AwsSesManagedStatus: S.optional(StatusRecord),
    SendingStatusAggregate: S.optional(S.String),
    ReputationImpact: S.optional(S.String),
  }),
).annotations({
  identifier: "ReputationEntity",
}) as any as S.Schema<ReputationEntity>;
export type ReputationEntitiesList = ReputationEntity[];
export const ReputationEntitiesList = S.Array(ReputationEntity);
export interface ResourceTenantMetadata {
  TenantName?: string;
  TenantId?: string;
  ResourceArn?: string;
  AssociatedTimestamp?: Date;
}
export const ResourceTenantMetadata = S.suspend(() =>
  S.Struct({
    TenantName: S.optional(S.String),
    TenantId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    AssociatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ResourceTenantMetadata",
}) as any as S.Schema<ResourceTenantMetadata>;
export type ResourceTenantMetadataList = ResourceTenantMetadata[];
export const ResourceTenantMetadataList = S.Array(ResourceTenantMetadata);
export interface SuppressedDestinationSummary {
  EmailAddress: string;
  Reason: string;
  LastUpdateTime: Date;
}
export const SuppressedDestinationSummary = S.suspend(() =>
  S.Struct({
    EmailAddress: S.String,
    Reason: S.String,
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "SuppressedDestinationSummary",
}) as any as S.Schema<SuppressedDestinationSummary>;
export type SuppressedDestinationSummaries = SuppressedDestinationSummary[];
export const SuppressedDestinationSummaries = S.Array(
  SuppressedDestinationSummary,
);
export interface TenantInfo {
  TenantName?: string;
  TenantId?: string;
  TenantArn?: string;
  CreatedTimestamp?: Date;
}
export const TenantInfo = S.suspend(() =>
  S.Struct({
    TenantName: S.optional(S.String),
    TenantId: S.optional(S.String),
    TenantArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "TenantInfo" }) as any as S.Schema<TenantInfo>;
export type TenantInfoList = TenantInfo[];
export const TenantInfoList = S.Array(TenantInfo);
export type ExportDimensions = { [key: string]: ExportDimensionValue };
export const ExportDimensions = S.Record({
  key: S.String,
  value: ExportDimensionValue,
});
export interface ExportMetric {
  Name?: string;
  Aggregation?: string;
}
export const ExportMetric = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Aggregation: S.optional(S.String) }),
).annotations({ identifier: "ExportMetric" }) as any as S.Schema<ExportMetric>;
export type ExportMetrics = ExportMetric[];
export const ExportMetrics = S.Array(ExportMetric);
export interface MessageInsightsFilters {
  FromEmailAddress?: EmailAddressFilterList;
  Destination?: EmailAddressFilterList;
  Subject?: EmailSubjectFilterList;
  Isp?: IspFilterList;
  LastDeliveryEvent?: LastDeliveryEventList;
  LastEngagementEvent?: LastEngagementEventList;
}
export const MessageInsightsFilters = S.suspend(() =>
  S.Struct({
    FromEmailAddress: S.optional(EmailAddressFilterList),
    Destination: S.optional(EmailAddressFilterList),
    Subject: S.optional(EmailSubjectFilterList),
    Isp: S.optional(IspFilterList),
    LastDeliveryEvent: S.optional(LastDeliveryEventList),
    LastEngagementEvent: S.optional(LastEngagementEventList),
  }),
).annotations({
  identifier: "MessageInsightsFilters",
}) as any as S.Schema<MessageInsightsFilters>;
export interface ReplacementTemplate {
  ReplacementTemplateData?: string;
}
export const ReplacementTemplate = S.suspend(() =>
  S.Struct({ ReplacementTemplateData: S.optional(S.String) }),
).annotations({
  identifier: "ReplacementTemplate",
}) as any as S.Schema<ReplacementTemplate>;
export interface BatchGetMetricDataRequest {
  Queries: BatchGetMetricDataQueries;
}
export const BatchGetMetricDataRequest = S.suspend(() =>
  S.Struct({ Queries: BatchGetMetricDataQueries }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/metrics/batch" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetMetricDataRequest",
}) as any as S.Schema<BatchGetMetricDataRequest>;
export interface CreateConfigurationSetRequest {
  ConfigurationSetName: string;
  TrackingOptions?: TrackingOptions;
  DeliveryOptions?: DeliveryOptions;
  ReputationOptions?: ReputationOptions;
  SendingOptions?: SendingOptions;
  Tags?: TagList;
  SuppressionOptions?: SuppressionOptions;
  VdmOptions?: VdmOptions;
  ArchivingOptions?: ArchivingOptions;
}
export const CreateConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
    SendingOptions: S.optional(SendingOptions),
    Tags: S.optional(TagList),
    SuppressionOptions: S.optional(SuppressionOptions),
    VdmOptions: S.optional(VdmOptions),
    ArchivingOptions: S.optional(ArchivingOptions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/configuration-sets" }),
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
export interface CreateEmailIdentityResponse {
  IdentityType?: string;
  VerifiedForSendingStatus?: boolean;
  DkimAttributes?: DkimAttributes;
}
export const CreateEmailIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(S.String),
    VerifiedForSendingStatus: S.optional(S.Boolean),
    DkimAttributes: S.optional(DkimAttributes),
  }),
).annotations({
  identifier: "CreateEmailIdentityResponse",
}) as any as S.Schema<CreateEmailIdentityResponse>;
export interface CreateImportJobRequest {
  ImportDestination: ImportDestination;
  ImportDataSource: ImportDataSource;
}
export const CreateImportJobRequest = S.suspend(() =>
  S.Struct({
    ImportDestination: ImportDestination,
    ImportDataSource: ImportDataSource,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/import-jobs" }),
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
export interface CreateMultiRegionEndpointRequest {
  EndpointName: string;
  Details: Details;
  Tags?: TagList;
}
export const CreateMultiRegionEndpointRequest = S.suspend(() =>
  S.Struct({
    EndpointName: S.String,
    Details: Details,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/multi-region-endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMultiRegionEndpointRequest",
}) as any as S.Schema<CreateMultiRegionEndpointRequest>;
export interface GetAccountResponse {
  DedicatedIpAutoWarmupEnabled?: boolean;
  EnforcementStatus?: string;
  ProductionAccessEnabled?: boolean;
  SendQuota?: SendQuota;
  SendingEnabled?: boolean;
  SuppressionAttributes?: SuppressionAttributes;
  Details?: AccountDetails;
  VdmAttributes?: VdmAttributes;
}
export const GetAccountResponse = S.suspend(() =>
  S.Struct({
    DedicatedIpAutoWarmupEnabled: S.optional(S.Boolean),
    EnforcementStatus: S.optional(S.String),
    ProductionAccessEnabled: S.optional(S.Boolean),
    SendQuota: S.optional(SendQuota),
    SendingEnabled: S.optional(S.Boolean),
    SuppressionAttributes: S.optional(SuppressionAttributes),
    Details: S.optional(AccountDetails),
    VdmAttributes: S.optional(VdmAttributes),
  }),
).annotations({
  identifier: "GetAccountResponse",
}) as any as S.Schema<GetAccountResponse>;
export interface GetConfigurationSetEventDestinationsResponse {
  EventDestinations?: EventDestinations;
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
export interface GetDedicatedIpPoolResponse {
  DedicatedIpPool?: DedicatedIpPool;
}
export const GetDedicatedIpPoolResponse = S.suspend(() =>
  S.Struct({ DedicatedIpPool: S.optional(DedicatedIpPool) }),
).annotations({
  identifier: "GetDedicatedIpPoolResponse",
}) as any as S.Schema<GetDedicatedIpPoolResponse>;
export interface GetDeliverabilityDashboardOptionsResponse {
  DashboardEnabled: boolean;
  SubscriptionExpiryDate?: Date;
  AccountStatus?: string;
  ActiveSubscribedDomains?: DomainDeliverabilityTrackingOptions;
  PendingExpirationSubscribedDomains?: DomainDeliverabilityTrackingOptions;
}
export const GetDeliverabilityDashboardOptionsResponse = S.suspend(() =>
  S.Struct({
    DashboardEnabled: S.Boolean,
    SubscriptionExpiryDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AccountStatus: S.optional(S.String),
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
  IspPlacements: IspPlacements;
  Message?: string;
  Tags?: TagList;
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
export interface MetricsDataSource {
  Dimensions: ExportDimensions;
  Namespace: string;
  Metrics: ExportMetrics;
  StartDate: Date;
  EndDate: Date;
}
export const MetricsDataSource = S.suspend(() =>
  S.Struct({
    Dimensions: ExportDimensions,
    Namespace: S.String,
    Metrics: ExportMetrics,
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "MetricsDataSource",
}) as any as S.Schema<MetricsDataSource>;
export interface MessageInsightsDataSource {
  StartDate: Date;
  EndDate: Date;
  Include?: MessageInsightsFilters;
  Exclude?: MessageInsightsFilters;
  MaxResults?: number;
}
export const MessageInsightsDataSource = S.suspend(() =>
  S.Struct({
    StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Include: S.optional(MessageInsightsFilters),
    Exclude: S.optional(MessageInsightsFilters),
    MaxResults: S.optional(S.Number),
  }),
).annotations({
  identifier: "MessageInsightsDataSource",
}) as any as S.Schema<MessageInsightsDataSource>;
export interface ExportDataSource {
  MetricsDataSource?: MetricsDataSource;
  MessageInsightsDataSource?: MessageInsightsDataSource;
}
export const ExportDataSource = S.suspend(() =>
  S.Struct({
    MetricsDataSource: S.optional(MetricsDataSource),
    MessageInsightsDataSource: S.optional(MessageInsightsDataSource),
  }),
).annotations({
  identifier: "ExportDataSource",
}) as any as S.Schema<ExportDataSource>;
export interface GetExportJobResponse {
  JobId?: string;
  ExportSourceType?: string;
  JobStatus?: string;
  ExportDestination?: ExportDestination;
  ExportDataSource?: ExportDataSource;
  CreatedTimestamp?: Date;
  CompletedTimestamp?: Date;
  FailureInfo?: FailureInfo;
  Statistics?: ExportStatistics;
}
export const GetExportJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    ExportSourceType: S.optional(S.String),
    JobStatus: S.optional(S.String),
    ExportDestination: S.optional(ExportDestination),
    ExportDataSource: S.optional(ExportDataSource),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureInfo: S.optional(FailureInfo),
    Statistics: S.optional(ExportStatistics),
  }),
).annotations({
  identifier: "GetExportJobResponse",
}) as any as S.Schema<GetExportJobResponse>;
export interface GetMultiRegionEndpointResponse {
  EndpointName?: string;
  EndpointId?: string;
  Routes?: Routes;
  Status?: string;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const GetMultiRegionEndpointResponse = S.suspend(() =>
  S.Struct({
    EndpointName: S.optional(S.String),
    EndpointId: S.optional(S.String),
    Routes: S.optional(Routes),
    Status: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetMultiRegionEndpointResponse",
}) as any as S.Schema<GetMultiRegionEndpointResponse>;
export interface GetTenantResponse {
  Tenant?: Tenant;
}
export const GetTenantResponse = S.suspend(() =>
  S.Struct({ Tenant: S.optional(Tenant) }),
).annotations({
  identifier: "GetTenantResponse",
}) as any as S.Schema<GetTenantResponse>;
export interface ListContactListsResponse {
  ContactLists?: ListOfContactLists;
  NextToken?: string;
}
export const ListContactListsResponse = S.suspend(() =>
  S.Struct({
    ContactLists: S.optional(ListOfContactLists),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListContactListsResponse",
}) as any as S.Schema<ListContactListsResponse>;
export interface ListContactsRequest {
  ContactListName: string;
  Filter?: ListContactsFilter;
  PageSize?: number;
  NextToken?: string;
}
export const ListContactsRequest = S.suspend(() =>
  S.Struct({
    ContactListName: S.String.pipe(T.HttpLabel("ContactListName")),
    Filter: S.optional(ListContactsFilter),
    PageSize: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v2/email/contact-lists/{ContactListName}/contacts/list",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListContactsRequest",
}) as any as S.Schema<ListContactsRequest>;
export interface ListCustomVerificationEmailTemplatesResponse {
  CustomVerificationEmailTemplates?: CustomVerificationEmailTemplatesList;
  NextToken?: string;
}
export const ListCustomVerificationEmailTemplatesResponse = S.suspend(() =>
  S.Struct({
    CustomVerificationEmailTemplates: S.optional(
      CustomVerificationEmailTemplatesList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomVerificationEmailTemplatesResponse",
}) as any as S.Schema<ListCustomVerificationEmailTemplatesResponse>;
export interface ListEmailIdentitiesResponse {
  EmailIdentities?: IdentityInfoList;
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
export interface ListEmailTemplatesResponse {
  TemplatesMetadata?: EmailTemplateMetadataList;
  NextToken?: string;
}
export const ListEmailTemplatesResponse = S.suspend(() =>
  S.Struct({
    TemplatesMetadata: S.optional(EmailTemplateMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEmailTemplatesResponse",
}) as any as S.Schema<ListEmailTemplatesResponse>;
export interface ListExportJobsResponse {
  ExportJobs?: ExportJobSummaryList;
  NextToken?: string;
}
export const ListExportJobsResponse = S.suspend(() =>
  S.Struct({
    ExportJobs: S.optional(ExportJobSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExportJobsResponse",
}) as any as S.Schema<ListExportJobsResponse>;
export interface ListImportJobsResponse {
  ImportJobs?: ImportJobSummaryList;
  NextToken?: string;
}
export const ListImportJobsResponse = S.suspend(() =>
  S.Struct({
    ImportJobs: S.optional(ImportJobSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImportJobsResponse",
}) as any as S.Schema<ListImportJobsResponse>;
export interface ListMultiRegionEndpointsResponse {
  MultiRegionEndpoints?: MultiRegionEndpoints;
  NextToken?: string;
}
export const ListMultiRegionEndpointsResponse = S.suspend(() =>
  S.Struct({
    MultiRegionEndpoints: S.optional(MultiRegionEndpoints),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMultiRegionEndpointsResponse",
}) as any as S.Schema<ListMultiRegionEndpointsResponse>;
export interface ListReputationEntitiesResponse {
  ReputationEntities?: ReputationEntitiesList;
  NextToken?: string;
}
export const ListReputationEntitiesResponse = S.suspend(() =>
  S.Struct({
    ReputationEntities: S.optional(ReputationEntitiesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReputationEntitiesResponse",
}) as any as S.Schema<ListReputationEntitiesResponse>;
export interface ListResourceTenantsResponse {
  ResourceTenants?: ResourceTenantMetadataList;
  NextToken?: string;
}
export const ListResourceTenantsResponse = S.suspend(() =>
  S.Struct({
    ResourceTenants: S.optional(ResourceTenantMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceTenantsResponse",
}) as any as S.Schema<ListResourceTenantsResponse>;
export interface ListSuppressedDestinationsResponse {
  SuppressedDestinationSummaries?: SuppressedDestinationSummaries;
  NextToken?: string;
}
export const ListSuppressedDestinationsResponse = S.suspend(() =>
  S.Struct({
    SuppressedDestinationSummaries: S.optional(SuppressedDestinationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSuppressedDestinationsResponse",
}) as any as S.Schema<ListSuppressedDestinationsResponse>;
export interface ListTenantsResponse {
  Tenants?: TenantInfoList;
  NextToken?: string;
}
export const ListTenantsResponse = S.suspend(() =>
  S.Struct({
    Tenants: S.optional(TenantInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTenantsResponse",
}) as any as S.Schema<ListTenantsResponse>;
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
export interface EmailAddressInsightsVerdict {
  ConfidenceVerdict?: string;
}
export const EmailAddressInsightsVerdict = S.suspend(() =>
  S.Struct({ ConfidenceVerdict: S.optional(S.String) }),
).annotations({
  identifier: "EmailAddressInsightsVerdict",
}) as any as S.Schema<EmailAddressInsightsVerdict>;
export interface EmailAddressInsightsMailboxEvaluations {
  HasValidSyntax?: EmailAddressInsightsVerdict;
  HasValidDnsRecords?: EmailAddressInsightsVerdict;
  MailboxExists?: EmailAddressInsightsVerdict;
  IsRoleAddress?: EmailAddressInsightsVerdict;
  IsDisposable?: EmailAddressInsightsVerdict;
  IsRandomInput?: EmailAddressInsightsVerdict;
}
export const EmailAddressInsightsMailboxEvaluations = S.suspend(() =>
  S.Struct({
    HasValidSyntax: S.optional(EmailAddressInsightsVerdict),
    HasValidDnsRecords: S.optional(EmailAddressInsightsVerdict),
    MailboxExists: S.optional(EmailAddressInsightsVerdict),
    IsRoleAddress: S.optional(EmailAddressInsightsVerdict),
    IsDisposable: S.optional(EmailAddressInsightsVerdict),
    IsRandomInput: S.optional(EmailAddressInsightsVerdict),
  }),
).annotations({
  identifier: "EmailAddressInsightsMailboxEvaluations",
}) as any as S.Schema<EmailAddressInsightsMailboxEvaluations>;
export interface SOARecord {
  PrimaryNameServer?: string;
  AdminEmail?: string;
  SerialNumber?: number;
}
export const SOARecord = S.suspend(() =>
  S.Struct({
    PrimaryNameServer: S.optional(S.String),
    AdminEmail: S.optional(S.String),
    SerialNumber: S.optional(S.Number),
  }),
).annotations({ identifier: "SOARecord" }) as any as S.Schema<SOARecord>;
export interface SuppressedDestinationAttributes {
  MessageId?: string;
  FeedbackId?: string;
}
export const SuppressedDestinationAttributes = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    FeedbackId: S.optional(S.String),
  }),
).annotations({
  identifier: "SuppressedDestinationAttributes",
}) as any as S.Schema<SuppressedDestinationAttributes>;
export interface ReplacementEmailContent {
  ReplacementTemplate?: ReplacementTemplate;
}
export const ReplacementEmailContent = S.suspend(() =>
  S.Struct({ ReplacementTemplate: S.optional(ReplacementTemplate) }),
).annotations({
  identifier: "ReplacementEmailContent",
}) as any as S.Schema<ReplacementEmailContent>;
export type BlacklistReport = { [key: string]: BlacklistEntries };
export const BlacklistReport = S.Record({
  key: S.String,
  value: BlacklistEntries,
});
export interface OverallVolume {
  VolumeStatistics?: VolumeStatistics;
  ReadRatePercent?: number;
  DomainIspPlacements?: DomainIspPlacements;
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
export interface MailboxValidation {
  IsValid?: EmailAddressInsightsVerdict;
  Evaluations?: EmailAddressInsightsMailboxEvaluations;
}
export const MailboxValidation = S.suspend(() =>
  S.Struct({
    IsValid: S.optional(EmailAddressInsightsVerdict),
    Evaluations: S.optional(EmailAddressInsightsMailboxEvaluations),
  }),
).annotations({
  identifier: "MailboxValidation",
}) as any as S.Schema<MailboxValidation>;
export interface VerificationInfo {
  LastCheckedTimestamp?: Date;
  LastSuccessTimestamp?: Date;
  ErrorType?: string;
  SOARecord?: SOARecord;
}
export const VerificationInfo = S.suspend(() =>
  S.Struct({
    LastCheckedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ErrorType: S.optional(S.String),
    SOARecord: S.optional(SOARecord),
  }),
).annotations({
  identifier: "VerificationInfo",
}) as any as S.Schema<VerificationInfo>;
export interface SuppressedDestination {
  EmailAddress: string;
  Reason: string;
  LastUpdateTime: Date;
  Attributes?: SuppressedDestinationAttributes;
}
export const SuppressedDestination = S.suspend(() =>
  S.Struct({
    EmailAddress: S.String,
    Reason: S.String,
    LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Attributes: S.optional(SuppressedDestinationAttributes),
  }),
).annotations({
  identifier: "SuppressedDestination",
}) as any as S.Schema<SuppressedDestination>;
export interface Recommendation {
  ResourceArn?: string;
  Type?: string;
  Description?: string;
  Status?: string;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  Impact?: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Impact: S.optional(S.String),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type RecommendationsList = Recommendation[];
export const RecommendationsList = S.Array(Recommendation);
export interface TenantResource {
  ResourceType?: string;
  ResourceArn?: string;
}
export const TenantResource = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "TenantResource",
}) as any as S.Schema<TenantResource>;
export type TenantResourceList = TenantResource[];
export const TenantResourceList = S.Array(TenantResource);
export interface BulkEmailEntry {
  Destination: Destination;
  ReplacementTags?: MessageTagList;
  ReplacementEmailContent?: ReplacementEmailContent;
  ReplacementHeaders?: MessageHeaderList;
}
export const BulkEmailEntry = S.suspend(() =>
  S.Struct({
    Destination: Destination,
    ReplacementTags: S.optional(MessageTagList),
    ReplacementEmailContent: S.optional(ReplacementEmailContent),
    ReplacementHeaders: S.optional(MessageHeaderList),
  }),
).annotations({
  identifier: "BulkEmailEntry",
}) as any as S.Schema<BulkEmailEntry>;
export type BulkEmailEntryList = BulkEmailEntry[];
export const BulkEmailEntryList = S.Array(BulkEmailEntry);
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
        uri: "/v2/email/configuration-sets/{ConfigurationSetName}/event-destinations",
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
  Tags?: TagList;
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
        uri: "/v2/email/deliverability-dashboard/test",
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
export interface CreateExportJobRequest {
  ExportDataSource: ExportDataSource;
  ExportDestination: ExportDestination;
}
export const CreateExportJobRequest = S.suspend(() =>
  S.Struct({
    ExportDataSource: ExportDataSource,
    ExportDestination: ExportDestination,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/export-jobs" }),
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
export interface CreateImportJobResponse {
  JobId?: string;
}
export const CreateImportJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "CreateImportJobResponse",
}) as any as S.Schema<CreateImportJobResponse>;
export interface CreateMultiRegionEndpointResponse {
  Status?: string;
  EndpointId?: string;
}
export const CreateMultiRegionEndpointResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String), EndpointId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMultiRegionEndpointResponse",
}) as any as S.Schema<CreateMultiRegionEndpointResponse>;
export interface GetBlacklistReportsResponse {
  BlacklistReport: BlacklistReport;
}
export const GetBlacklistReportsResponse = S.suspend(() =>
  S.Struct({ BlacklistReport: BlacklistReport }),
).annotations({
  identifier: "GetBlacklistReportsResponse",
}) as any as S.Schema<GetBlacklistReportsResponse>;
export interface GetDomainStatisticsReportResponse {
  OverallVolume: OverallVolume;
  DailyVolumes: DailyVolumes;
}
export const GetDomainStatisticsReportResponse = S.suspend(() =>
  S.Struct({ OverallVolume: OverallVolume, DailyVolumes: DailyVolumes }),
).annotations({
  identifier: "GetDomainStatisticsReportResponse",
}) as any as S.Schema<GetDomainStatisticsReportResponse>;
export interface GetEmailAddressInsightsResponse {
  MailboxValidation?: MailboxValidation;
}
export const GetEmailAddressInsightsResponse = S.suspend(() =>
  S.Struct({ MailboxValidation: S.optional(MailboxValidation) }),
).annotations({
  identifier: "GetEmailAddressInsightsResponse",
}) as any as S.Schema<GetEmailAddressInsightsResponse>;
export interface GetEmailIdentityResponse {
  IdentityType?: string;
  FeedbackForwardingStatus?: boolean;
  VerifiedForSendingStatus?: boolean;
  DkimAttributes?: DkimAttributes;
  MailFromAttributes?: MailFromAttributes;
  Policies?: PolicyMap;
  Tags?: TagList;
  ConfigurationSetName?: string;
  VerificationStatus?: string;
  VerificationInfo?: VerificationInfo;
}
export const GetEmailIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(S.String),
    FeedbackForwardingStatus: S.optional(S.Boolean),
    VerifiedForSendingStatus: S.optional(S.Boolean),
    DkimAttributes: S.optional(DkimAttributes),
    MailFromAttributes: S.optional(MailFromAttributes),
    Policies: S.optional(PolicyMap),
    Tags: S.optional(TagList),
    ConfigurationSetName: S.optional(S.String),
    VerificationStatus: S.optional(S.String),
    VerificationInfo: S.optional(VerificationInfo),
  }),
).annotations({
  identifier: "GetEmailIdentityResponse",
}) as any as S.Schema<GetEmailIdentityResponse>;
export interface GetReputationEntityResponse {
  ReputationEntity?: ReputationEntity;
}
export const GetReputationEntityResponse = S.suspend(() =>
  S.Struct({ ReputationEntity: S.optional(ReputationEntity) }),
).annotations({
  identifier: "GetReputationEntityResponse",
}) as any as S.Schema<GetReputationEntityResponse>;
export interface GetSuppressedDestinationResponse {
  SuppressedDestination: SuppressedDestination;
}
export const GetSuppressedDestinationResponse = S.suspend(() =>
  S.Struct({ SuppressedDestination: SuppressedDestination }),
).annotations({
  identifier: "GetSuppressedDestinationResponse",
}) as any as S.Schema<GetSuppressedDestinationResponse>;
export interface ListRecommendationsResponse {
  Recommendations?: RecommendationsList;
  NextToken?: string;
}
export const ListRecommendationsResponse = S.suspend(() =>
  S.Struct({
    Recommendations: S.optional(RecommendationsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationsResponse",
}) as any as S.Schema<ListRecommendationsResponse>;
export interface ListTenantResourcesResponse {
  TenantResources?: TenantResourceList;
  NextToken?: string;
}
export const ListTenantResourcesResponse = S.suspend(() =>
  S.Struct({
    TenantResources: S.optional(TenantResourceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTenantResourcesResponse",
}) as any as S.Schema<ListTenantResourcesResponse>;
export interface PutAccountSuppressionAttributesRequest {
  SuppressedReasons?: SuppressionListReasons;
  ValidationAttributes?: SuppressionValidationAttributes;
}
export const PutAccountSuppressionAttributesRequest = S.suspend(() =>
  S.Struct({
    SuppressedReasons: S.optional(SuppressionListReasons),
    ValidationAttributes: S.optional(SuppressionValidationAttributes),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v2/email/account/suppression" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountSuppressionAttributesRequest",
}) as any as S.Schema<PutAccountSuppressionAttributesRequest>;
export interface PutAccountSuppressionAttributesResponse {}
export const PutAccountSuppressionAttributesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccountSuppressionAttributesResponse",
}) as any as S.Schema<PutAccountSuppressionAttributesResponse>;
export interface SendBulkEmailRequest {
  FromEmailAddress?: string;
  FromEmailAddressIdentityArn?: string;
  ReplyToAddresses?: EmailAddressList;
  FeedbackForwardingEmailAddress?: string;
  FeedbackForwardingEmailAddressIdentityArn?: string;
  DefaultEmailTags?: MessageTagList;
  DefaultContent: BulkEmailContent;
  BulkEmailEntries: BulkEmailEntryList;
  ConfigurationSetName?: string;
  EndpointId?: string;
  TenantName?: string;
}
export const SendBulkEmailRequest = S.suspend(() =>
  S.Struct({
    FromEmailAddress: S.optional(S.String),
    FromEmailAddressIdentityArn: S.optional(S.String),
    ReplyToAddresses: S.optional(EmailAddressList),
    FeedbackForwardingEmailAddress: S.optional(S.String),
    FeedbackForwardingEmailAddressIdentityArn: S.optional(S.String),
    DefaultEmailTags: S.optional(MessageTagList),
    DefaultContent: BulkEmailContent,
    BulkEmailEntries: BulkEmailEntryList,
    ConfigurationSetName: S.optional(S.String),
    EndpointId: S.optional(S.String).pipe(T.ContextParam("EndpointId")),
    TenantName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v2/email/outbound-bulk-emails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendBulkEmailRequest",
}) as any as S.Schema<SendBulkEmailRequest>;
export type TimestampList = Date[];
export const TimestampList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export type MetricValueList = number[];
export const MetricValueList = S.Array(S.Number);
export interface Bounce {
  BounceType?: string;
  BounceSubType?: string;
  DiagnosticCode?: string;
}
export const Bounce = S.suspend(() =>
  S.Struct({
    BounceType: S.optional(S.String),
    BounceSubType: S.optional(S.String),
    DiagnosticCode: S.optional(S.String),
  }),
).annotations({ identifier: "Bounce" }) as any as S.Schema<Bounce>;
export interface Complaint {
  ComplaintSubType?: string;
  ComplaintFeedbackType?: string;
}
export const Complaint = S.suspend(() =>
  S.Struct({
    ComplaintSubType: S.optional(S.String),
    ComplaintFeedbackType: S.optional(S.String),
  }),
).annotations({ identifier: "Complaint" }) as any as S.Schema<Complaint>;
export interface MetricDataResult {
  Id?: string;
  Timestamps?: TimestampList;
  Values?: MetricValueList;
}
export const MetricDataResult = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Timestamps: S.optional(TimestampList),
    Values: S.optional(MetricValueList),
  }),
).annotations({
  identifier: "MetricDataResult",
}) as any as S.Schema<MetricDataResult>;
export type MetricDataResultList = MetricDataResult[];
export const MetricDataResultList = S.Array(MetricDataResult);
export interface MetricDataError {
  Id?: string;
  Code?: string;
  Message?: string;
}
export const MetricDataError = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Code: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDataError",
}) as any as S.Schema<MetricDataError>;
export type MetricDataErrorList = MetricDataError[];
export const MetricDataErrorList = S.Array(MetricDataError);
export interface Contact {
  EmailAddress?: string;
  TopicPreferences?: TopicPreferenceList;
  TopicDefaultPreferences?: TopicPreferenceList;
  UnsubscribeAll?: boolean;
  LastUpdatedTimestamp?: Date;
}
export const Contact = S.suspend(() =>
  S.Struct({
    EmailAddress: S.optional(S.String),
    TopicPreferences: S.optional(TopicPreferenceList),
    TopicDefaultPreferences: S.optional(TopicPreferenceList),
    UnsubscribeAll: S.optional(S.Boolean),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type ListOfContacts = Contact[];
export const ListOfContacts = S.Array(Contact);
export interface EventDetails {
  Bounce?: Bounce;
  Complaint?: Complaint;
}
export const EventDetails = S.suspend(() =>
  S.Struct({ Bounce: S.optional(Bounce), Complaint: S.optional(Complaint) }),
).annotations({ identifier: "EventDetails" }) as any as S.Schema<EventDetails>;
export interface BatchGetMetricDataResponse {
  Results?: MetricDataResultList;
  Errors?: MetricDataErrorList;
}
export const BatchGetMetricDataResponse = S.suspend(() =>
  S.Struct({
    Results: S.optional(MetricDataResultList),
    Errors: S.optional(MetricDataErrorList),
  }),
).annotations({
  identifier: "BatchGetMetricDataResponse",
}) as any as S.Schema<BatchGetMetricDataResponse>;
export interface CreateDeliverabilityTestReportResponse {
  ReportId: string;
  DeliverabilityTestStatus: string;
}
export const CreateDeliverabilityTestReportResponse = S.suspend(() =>
  S.Struct({ ReportId: S.String, DeliverabilityTestStatus: S.String }),
).annotations({
  identifier: "CreateDeliverabilityTestReportResponse",
}) as any as S.Schema<CreateDeliverabilityTestReportResponse>;
export interface CreateExportJobResponse {
  JobId?: string;
}
export const CreateExportJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "CreateExportJobResponse",
}) as any as S.Schema<CreateExportJobResponse>;
export interface ListContactsResponse {
  Contacts?: ListOfContacts;
  NextToken?: string;
}
export const ListContactsResponse = S.suspend(() =>
  S.Struct({
    Contacts: S.optional(ListOfContacts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListContactsResponse",
}) as any as S.Schema<ListContactsResponse>;
export interface InsightsEvent {
  Timestamp?: Date;
  Type?: string;
  Details?: EventDetails;
}
export const InsightsEvent = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(S.String),
    Details: S.optional(EventDetails),
  }),
).annotations({
  identifier: "InsightsEvent",
}) as any as S.Schema<InsightsEvent>;
export type InsightsEvents = InsightsEvent[];
export const InsightsEvents = S.Array(InsightsEvent);
export interface EmailInsights {
  Destination?: string | Redacted.Redacted<string>;
  Isp?: string;
  Events?: InsightsEvents;
}
export const EmailInsights = S.suspend(() =>
  S.Struct({
    Destination: S.optional(SensitiveString),
    Isp: S.optional(S.String),
    Events: S.optional(InsightsEvents),
  }),
).annotations({
  identifier: "EmailInsights",
}) as any as S.Schema<EmailInsights>;
export type EmailInsightsList = EmailInsights[];
export const EmailInsightsList = S.Array(EmailInsights);
export interface BulkEmailEntryResult {
  Status?: string;
  Error?: string;
  MessageId?: string;
}
export const BulkEmailEntryResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    Error: S.optional(S.String),
    MessageId: S.optional(S.String),
  }),
).annotations({
  identifier: "BulkEmailEntryResult",
}) as any as S.Schema<BulkEmailEntryResult>;
export type BulkEmailEntryResultList = BulkEmailEntryResult[];
export const BulkEmailEntryResultList = S.Array(BulkEmailEntryResult);
export interface GetMessageInsightsResponse {
  MessageId?: string;
  FromEmailAddress?: string | Redacted.Redacted<string>;
  Subject?: string | Redacted.Redacted<string>;
  EmailTags?: MessageTagList;
  Insights?: EmailInsightsList;
}
export const GetMessageInsightsResponse = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    FromEmailAddress: S.optional(SensitiveString),
    Subject: S.optional(SensitiveString),
    EmailTags: S.optional(MessageTagList),
    Insights: S.optional(EmailInsightsList),
  }),
).annotations({
  identifier: "GetMessageInsightsResponse",
}) as any as S.Schema<GetMessageInsightsResponse>;
export interface SendBulkEmailResponse {
  BulkEmailEntryResults: BulkEmailEntryResultList;
}
export const SendBulkEmailResponse = S.suspend(() =>
  S.Struct({ BulkEmailEntryResults: BulkEmailEntryResultList }),
).annotations({
  identifier: "SendBulkEmailResponse",
}) as any as S.Schema<SendBulkEmailResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
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
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class SendingPausedException extends S.TaggedError<SendingPausedException>()(
  "SendingPausedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List all of the configuration sets associated with your account in the current
 * region.
 *
 * *Configuration sets* are groups of rules that you can apply to the
 * emails you send. You apply a configuration set to an email by including a reference to
 * the configuration set in the headers of the email. When you apply a configuration set to
 * an email, all of the rules in that configuration set are applied to the email.
 */
export const listConfigurationSets: {
  (
    input: ListConfigurationSetsRequest,
  ): Effect.Effect<
    ListConfigurationSetsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationSetsRequest,
  ) => Stream.Stream<
    ListConfigurationSetsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationSetsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
 * Lists all of the contact lists available.
 *
 * If your output includes a "NextToken" field with a string value, this indicates there may be additional
 * contacts on the filtered list - regardless of the number of contacts returned.
 */
export const listContactLists: {
  (
    input: ListContactListsRequest,
  ): Effect.Effect<
    ListContactListsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListContactListsRequest,
  ) => Stream.Stream<
    ListContactListsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListContactListsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContactListsRequest,
  output: ListContactListsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists the existing custom verification email templates for your account in the current
 * Amazon Web Services Region.
 *
 * For more information about custom verification email templates, see Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const listCustomVerificationEmailTemplates: {
  (
    input: ListCustomVerificationEmailTemplatesRequest,
  ): Effect.Effect<
    ListCustomVerificationEmailTemplatesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomVerificationEmailTemplatesRequest,
  ) => Stream.Stream<
    ListCustomVerificationEmailTemplatesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomVerificationEmailTemplatesRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomVerificationEmailTemplatesRequest,
  output: ListCustomVerificationEmailTemplatesResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Returns a list of all of the email identities that are associated with your Amazon Web Services
 * account. An identity can be either an email address or a domain. This operation returns
 * identities that are verified as well as those that aren't. This operation returns
 * identities that are associated with Amazon SES and Amazon Pinpoint.
 */
export const listEmailIdentities: {
  (
    input: ListEmailIdentitiesRequest,
  ): Effect.Effect<
    ListEmailIdentitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEmailIdentitiesRequest,
  ) => Stream.Stream<
    ListEmailIdentitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEmailIdentitiesRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
 * Lists the email templates present in your Amazon SES account in the current Amazon Web Services
 * Region.
 *
 * You can execute this operation no more than once per second.
 */
export const listEmailTemplates: {
  (
    input: ListEmailTemplatesRequest,
  ): Effect.Effect<
    ListEmailTemplatesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListEmailTemplatesRequest,
  ) => Stream.Stream<
    ListEmailTemplatesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListEmailTemplatesRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEmailTemplatesRequest,
  output: ListEmailTemplatesResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all of the export jobs.
 */
export const listExportJobs: {
  (
    input: ListExportJobsRequest,
  ): Effect.Effect<
    ListExportJobsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportJobsRequest,
  ) => Stream.Stream<
    ListExportJobsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListExportJobsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportJobsRequest,
  output: ListExportJobsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Lists all of the import jobs.
 */
export const listImportJobs: {
  (
    input: ListImportJobsRequest,
  ): Effect.Effect<
    ListImportJobsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportJobsRequest,
  ) => Stream.Stream<
    ListImportJobsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListImportJobsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportJobsRequest,
  output: ListImportJobsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List the multi-region endpoints (global-endpoints).
 *
 * Only multi-region endpoints (global-endpoints) whose primary region is the AWS-Region
 * where operation is executed will be listed.
 */
export const listMultiRegionEndpoints: {
  (
    input: ListMultiRegionEndpointsRequest,
  ): Effect.Effect<
    ListMultiRegionEndpointsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListMultiRegionEndpointsRequest,
  ) => Stream.Stream<
    ListMultiRegionEndpointsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListMultiRegionEndpointsRequest,
  ) => Stream.Stream<
    MultiRegionEndpoint,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMultiRegionEndpointsRequest,
  output: ListMultiRegionEndpointsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MultiRegionEndpoints",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List reputation entities in your Amazon SES account in the current Amazon Web Services Region.
 * You can filter the results by entity type, reputation impact, sending status,
 * or entity reference prefix.
 *
 * *Reputation entities* represent resources in your account that have reputation
 * tracking and management capabilities. Use this operation to get an overview of
 * all entities and their current reputation status.
 */
export const listReputationEntities: {
  (
    input: ListReputationEntitiesRequest,
  ): Effect.Effect<
    ListReputationEntitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListReputationEntitiesRequest,
  ) => Stream.Stream<
    ListReputationEntitiesResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListReputationEntitiesRequest,
  ) => Stream.Stream<
    ReputationEntity,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReputationEntitiesRequest,
  output: ListReputationEntitiesResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReputationEntities",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List all tenants associated with a specific resource.
 *
 * This operation returns a list of tenants that are associated with the specified
 * resource. This is useful for understanding which tenants are currently using a particular
 * resource such as an email identity, configuration set, or email template.
 */
export const listResourceTenants: {
  (
    input: ListResourceTenantsRequest,
  ): Effect.Effect<
    ListResourceTenantsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceTenantsRequest,
  ) => Stream.Stream<
    ListResourceTenantsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceTenantsRequest,
  ) => Stream.Stream<
    ResourceTenantMetadata,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceTenantsRequest,
  output: ListResourceTenantsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceTenants",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List all tenants associated with your account in the current Amazon Web Services Region.
 *
 * This operation returns basic information about each tenant,
 * such as tenant name, ID, ARN, and creation timestamp.
 */
export const listTenants: {
  (
    input: ListTenantsRequest,
  ): Effect.Effect<
    ListTenantsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTenantsRequest,
  ) => Stream.Stream<
    ListTenantsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTenantsRequest,
  ) => Stream.Stream<
    TenantInfo,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTenantsRequest,
  output: ListTenantsResponse,
  errors: [BadRequestException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tenants",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Update your Amazon SES account details.
 */
export const putAccountDetails: (
  input: PutAccountDetailsRequest,
) => Effect.Effect<
  PutAccountDetailsResponse,
  | BadRequestException
  | ConflictException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountDetailsRequest,
  output: PutAccountDetailsResponse,
  errors: [BadRequestException, ConflictException, TooManyRequestsException],
}));
/**
 * Get information about an existing configuration set, including the dedicated IP pool
 * that it's associated with, whether or not it's enabled for sending email, and
 * more.
 *
 * *Configuration sets* are groups of rules that you can apply to the
 * emails you send. You apply a configuration set to an email by including a reference to
 * the configuration set in the headers of the email. When you apply a configuration set to
 * an email, all of the rules in that configuration set are applied to the email.
 */
export const getConfigurationSet: (
  input: GetConfigurationSetRequest,
) => Effect.Effect<
  GetConfigurationSetResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationSetRequest,
  output: GetConfigurationSetResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Returns a contact from a contact list.
 */
export const getContact: (
  input: GetContactRequest,
) => Effect.Effect<
  GetContactResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactRequest,
  output: GetContactResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Returns contact list metadata. It does not return any information about the contacts
 * present in the list.
 */
export const getContactList: (
  input: GetContactListRequest,
) => Effect.Effect<
  GetContactListResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactListRequest,
  output: GetContactListResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Returns the custom email verification template for the template name you
 * specify.
 *
 * For more information about custom verification email templates, see Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const getCustomVerificationEmailTemplate: (
  input: GetCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  GetCustomVerificationEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomVerificationEmailTemplateRequest,
  output: GetCustomVerificationEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * List the dedicated IP addresses that are associated with your Amazon Web Services
 * account.
 */
export const getDedicatedIps: {
  (
    input: GetDedicatedIpsRequest,
  ): Effect.Effect<
    GetDedicatedIpsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetDedicatedIpsRequest,
  ) => Stream.Stream<
    GetDedicatedIpsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetDedicatedIpsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
 * Returns the requested sending authorization policies for the given identity (an email
 * address or a domain). The policies are returned as a map of policy names to policy
 * contents. You can retrieve a maximum of 20 policies at a time.
 *
 * This API is for the identity owner only. If you have not verified the identity,
 * this API will return an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const getEmailIdentityPolicies: (
  input: GetEmailIdentityPoliciesRequest,
) => Effect.Effect<
  GetEmailIdentityPoliciesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailIdentityPoliciesRequest,
  output: GetEmailIdentityPoliciesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Displays the template object (which includes the subject line, HTML part and text
 * part) for the template you specify.
 *
 * You can execute this operation no more than once per second.
 */
export const getEmailTemplate: (
  input: GetEmailTemplateRequest,
) => Effect.Effect<
  GetEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailTemplateRequest,
  output: GetEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Provides information about an import job.
 */
export const getImportJob: (
  input: GetImportJobRequest,
) => Effect.Effect<
  GetImportJobResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportJobRequest,
  output: GetImportJobResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For
 * predictive inbox placement tests that are complete, you can use the `GetDeliverabilityTestReport`
 * operation to view the results.
 */
export const listDeliverabilityTestReports: {
  (
    input: ListDeliverabilityTestReportsRequest,
  ): Effect.Effect<
    ListDeliverabilityTestReportsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeliverabilityTestReportsRequest,
  ) => Stream.Stream<
    ListDeliverabilityTestReportsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDeliverabilityTestReportsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
 * enabled the Deliverability dashboard for the domain.
 */
export const listDomainDeliverabilityCampaigns: {
  (
    input: ListDomainDeliverabilityCampaignsRequest,
  ): Effect.Effect<
    ListDomainDeliverabilityCampaignsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainDeliverabilityCampaignsRequest,
  ) => Stream.Stream<
    ListDomainDeliverabilityCampaignsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainDeliverabilityCampaignsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
 * with a resource. Each tag consists of a required *tag key* and an
 * optional associated *tag value*. A tag key is a general label that
 * acts as a category for more specific tag values. A tag value acts as a descriptor within
 * a tag key.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Specify the account suppression list preferences for a configuration set.
 */
export const putConfigurationSetSuppressionOptions: (
  input: PutConfigurationSetSuppressionOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetSuppressionOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetSuppressionOptionsRequest,
  output: PutConfigurationSetSuppressionOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to configure or change the DKIM authentication settings for an email domain
 * identity. You can use this operation to do any of the following:
 *
 * - Update the signing attributes for an identity that uses Bring Your Own DKIM
 * (BYODKIM).
 *
 * - Update the key length that should be used for Easy DKIM.
 *
 * - Change from using no DKIM authentication to using Easy DKIM.
 *
 * - Change from using no DKIM authentication to using BYODKIM.
 *
 * - Change from using Easy DKIM to using BYODKIM.
 *
 * - Change from using BYODKIM to using Easy DKIM.
 */
export const putEmailIdentityDkimSigningAttributes: (
  input: PutEmailIdentityDkimSigningAttributesRequest,
) => Effect.Effect<
  PutEmailIdentityDkimSigningAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityDkimSigningAttributesRequest,
  output: PutEmailIdentityDkimSigningAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Creates a preview of the MIME content of an email when provided with a template and a
 * set of replacement data.
 *
 * You can execute this operation no more than once per second.
 */
export const testRenderEmailTemplate: (
  input: TestRenderEmailTemplateRequest,
) => Effect.Effect<
  TestRenderEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestRenderEmailTemplateRequest,
  output: TestRenderEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Delete an event destination.
 *
 * *Events* include message sends, deliveries, opens, clicks, bounces,
 * and complaints. *Event destinations* are places that you can send
 * information about these events to. For example, you can send event data to Amazon EventBridge and
 * associate a rule to send the event to the specified target.
 */
export const deleteConfigurationSetEventDestination: (
  input: DeleteConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  DeleteConfigurationSetEventDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetEventDestinationRequest,
  output: DeleteConfigurationSetEventDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Removes a contact from a contact list.
 */
export const deleteContact: (
  input: DeleteContactRequest,
) => Effect.Effect<
  DeleteContactResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactRequest,
  output: DeleteContactResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an existing custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteCustomVerificationEmailTemplate: (
  input: DeleteCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  DeleteCustomVerificationEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomVerificationEmailTemplateRequest,
  output: DeleteCustomVerificationEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes the specified sending authorization policy for the given identity (an email
 * address or a domain). This API returns successfully even if a policy with the specified
 * name does not exist.
 *
 * This API is for the identity owner only. If you have not verified the identity,
 * this API will return an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteEmailIdentityPolicy: (
  input: DeleteEmailIdentityPolicyRequest,
) => Effect.Effect<
  DeleteEmailIdentityPolicyResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailIdentityPolicyRequest,
  output: DeleteEmailIdentityPolicyResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Deletes an email template.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteEmailTemplate: (
  input: DeleteEmailTemplateRequest,
) => Effect.Effect<
  DeleteEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailTemplateRequest,
  output: DeleteEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Removes an email address from the suppression list for your account.
 */
export const deleteSuppressedDestination: (
  input: DeleteSuppressedDestinationRequest,
) => Effect.Effect<
  DeleteSuppressedDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSuppressedDestinationRequest,
  output: DeleteSuppressedDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Delete an existing tenant.
 *
 * When you delete a tenant, its associations with resources
 * are removed, but the resources themselves are not deleted.
 */
export const deleteTenant: (
  input: DeleteTenantRequest,
) => Effect.Effect<
  DeleteTenantResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTenantRequest,
  output: DeleteTenantResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Delete an association between a tenant and a resource.
 *
 * When you delete a tenant-resource association, the resource itself is not deleted,
 * only its association with the specific tenant is removed. After removal, the resource
 * will no longer be available for use with that tenant's email sending operations.
 */
export const deleteTenantResourceAssociation: (
  input: DeleteTenantResourceAssociationRequest,
) => Effect.Effect<
  DeleteTenantResourceAssociationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTenantResourceAssociationRequest,
  output: DeleteTenantResourceAssociationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Associate the configuration set with a MailManager archive. When you send email using the
 * `SendEmail` or `SendBulkEmail` operations the message as it will be given
 * to the receiving SMTP server will be archived, along with the recipient information.
 */
export const putConfigurationSetArchivingOptions: (
  input: PutConfigurationSetArchivingOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetArchivingOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetArchivingOptionsRequest,
  output: PutConfigurationSetArchivingOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools
 * to create groups of dedicated IP addresses for sending specific types of email.
 */
export const putConfigurationSetDeliveryOptions: (
  input: PutConfigurationSetDeliveryOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetDeliveryOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetDeliveryOptionsRequest,
  output: PutConfigurationSetDeliveryOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Enable or disable collection of reputation metrics for emails that you send using a
 * particular configuration set in a specific Amazon Web Services Region.
 */
export const putConfigurationSetReputationOptions: (
  input: PutConfigurationSetReputationOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetReputationOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetReputationOptionsRequest,
  output: PutConfigurationSetReputationOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Enable or disable email sending for messages that use a particular configuration set
 * in a specific Amazon Web Services Region.
 */
export const putConfigurationSetSendingOptions: (
  input: PutConfigurationSetSendingOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetSendingOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetSendingOptionsRequest,
  output: PutConfigurationSetSendingOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Specify a custom domain to use for open and click tracking elements in email that you
 * send.
 */
export const putConfigurationSetTrackingOptions: (
  input: PutConfigurationSetTrackingOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetTrackingOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetTrackingOptionsRequest,
  output: PutConfigurationSetTrackingOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Specify VDM preferences for email that you send using the configuration set.
 *
 * You can execute this operation no more than once per second.
 */
export const putConfigurationSetVdmOptions: (
  input: PutConfigurationSetVdmOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetVdmOptionsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetVdmOptionsRequest,
  output: PutConfigurationSetVdmOptionsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Move a dedicated IP address to an existing dedicated IP pool.
 *
 * The dedicated IP address that you specify must already exist, and must be
 * associated with your Amazon Web Services account.
 *
 * The dedicated IP pool you specify must already exist. You can create a new pool by
 * using the `CreateDedicatedIpPool` operation.
 */
export const putDedicatedIpInPool: (
  input: PutDedicatedIpInPoolRequest,
) => Effect.Effect<
  PutDedicatedIpInPoolResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  PutDedicatedIpWarmupAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDedicatedIpWarmupAttributesRequest,
  output: PutDedicatedIpWarmupAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to associate a configuration set with an email identity.
 */
export const putEmailIdentityConfigurationSetAttributes: (
  input: PutEmailIdentityConfigurationSetAttributesRequest,
) => Effect.Effect<
  PutEmailIdentityConfigurationSetAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityConfigurationSetAttributesRequest,
  output: PutEmailIdentityConfigurationSetAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Used to enable or disable DKIM authentication for an email identity.
 */
export const putEmailIdentityDkimAttributes: (
  input: PutEmailIdentityDkimAttributesRequest,
) => Effect.Effect<
  PutEmailIdentityDkimAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * If the value is `true`, you receive email notifications when bounce or
 * complaint events occur. These notifications are sent to the address that you specified
 * in the `Return-Path` header of the original email.
 *
 * You're required to have a method of tracking bounces and complaints. If you haven't
 * set up another mechanism for receiving bounce or complaint notifications (for example,
 * by setting up an event destination), you receive an email notification when these events
 * occur (even if this setting is disabled).
 */
export const putEmailIdentityFeedbackAttributes: (
  input: PutEmailIdentityFeedbackAttributesRequest,
) => Effect.Effect<
  PutEmailIdentityFeedbackAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  PutEmailIdentityMailFromAttributesResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailIdentityMailFromAttributesRequest,
  output: PutEmailIdentityMailFromAttributesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Update the configuration of an event destination for a configuration set.
 *
 * *Events* include message sends, deliveries, opens, clicks, bounces,
 * and complaints. *Event destinations* are places that you can send
 * information about these events to. For example, you can send event data to Amazon EventBridge and
 * associate a rule to send the event to the specified target.
 */
export const updateConfigurationSetEventDestination: (
  input: UpdateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  UpdateConfigurationSetEventDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationSetEventDestinationRequest,
  output: UpdateConfigurationSetEventDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Updates an existing custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateCustomVerificationEmailTemplate: (
  input: UpdateCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  UpdateCustomVerificationEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomVerificationEmailTemplateRequest,
  output: UpdateCustomVerificationEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Updates the specified sending authorization policy for the given identity (an email
 * address or a domain). This API returns successfully even if a policy with the specified
 * name does not exist.
 *
 * This API is for the identity owner only. If you have not verified the identity,
 * this API will return an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateEmailIdentityPolicy: (
  input: UpdateEmailIdentityPolicyRequest,
) => Effect.Effect<
  UpdateEmailIdentityPolicyResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEmailIdentityPolicyRequest,
  output: UpdateEmailIdentityPolicyResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Updates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single API operation. For more information, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateEmailTemplate: (
  input: UpdateEmailTemplateRequest,
) => Effect.Effect<
  UpdateEmailTemplateResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEmailTemplateRequest,
  output: UpdateEmailTemplateResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Associate a resource with a tenant.
 *
 * *Resources* can be email identities, configuration sets, or email templates.
 * When you associate a resource with a tenant, you can use that resource when sending emails
 * on behalf of that tenant.
 *
 * A single resource can be associated with multiple tenants, allowing for resource sharing
 * across different tenants while maintaining isolation in email sending operations.
 */
export const createTenantResourceAssociation: (
  input: CreateTenantResourceAssociationRequest,
) => Effect.Effect<
  CreateTenantResourceAssociationResponse,
  | AlreadyExistsException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTenantResourceAssociationRequest,
  output: CreateTenantResourceAssociationResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a contact, which is an end-user who is receiving the email, and adds them to a
 * contact list.
 */
export const createContact: (
  input: CreateContactRequest,
) => Effect.Effect<
  CreateContactResponse,
  | AlreadyExistsException
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactRequest,
  output: CreateContactResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single API operation. For more information, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createEmailTemplate: (
  input: CreateEmailTemplateRequest,
) => Effect.Effect<
  CreateEmailTemplateResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailTemplateRequest,
  output: CreateEmailTemplateResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a tenant.
 *
 * *Tenants* are logical containers that group related SES resources together.
 * Each tenant can have its own set of resources like email identities, configuration sets,
 * and templates, along with reputation metrics and sending status. This helps isolate and manage
 * email sending for different customers or business units within your Amazon SES API v2 account.
 */
export const createTenant: (
  input: CreateTenantRequest,
) => Effect.Effect<
  CreateTenantResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTenantRequest,
  output: CreateTenantResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates the specified sending authorization policy for the given identity (an email
 * address or a domain).
 *
 * This API is for the identity owner only. If you have not verified the identity,
 * this API will return an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createEmailIdentityPolicy: (
  input: CreateEmailIdentityPolicyRequest,
) => Effect.Effect<
  CreateEmailIdentityPolicyResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailIdentityPolicyRequest,
  output: CreateEmailIdentityPolicyResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Enable or disable the Deliverability dashboard. When you enable the Deliverability dashboard, you gain
 * access to reputation, deliverability, and other metrics for the domains that you use to
 * send email. You also gain the ability to perform predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more
 * information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
 */
export const putDeliverabilityDashboardOption: (
  input: PutDeliverabilityDashboardOptionRequest,
) => Effect.Effect<
  PutDeliverabilityDashboardOptionResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Creates a contact list.
 */
export const createContactList: (
  input: CreateContactListRequest,
) => Effect.Effect<
  CreateContactListResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactListRequest,
  output: CreateContactListResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete an existing configuration set.
 *
 * *Configuration sets* are groups of rules that you can apply to the
 * emails you send. You apply a configuration set to an email by including a reference to
 * the configuration set in the headers of the email. When you apply a configuration set to
 * an email, all of the rules in that configuration set are applied to the email.
 */
export const deleteConfigurationSet: (
  input: DeleteConfigurationSetRequest,
) => Effect.Effect<
  DeleteConfigurationSetResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Deletes a contact list and all of the contacts on that list.
 */
export const deleteContactList: (
  input: DeleteContactListRequest,
) => Effect.Effect<
  DeleteContactListResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactListRequest,
  output: DeleteContactListResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a dedicated IP pool.
 */
export const deleteDedicatedIpPool: (
  input: DeleteDedicatedIpPoolRequest,
) => Effect.Effect<
  DeleteDedicatedIpPoolResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Deletes an email identity. An identity can be either an email address or a domain
 * name.
 */
export const deleteEmailIdentity: (
  input: DeleteEmailIdentityRequest,
) => Effect.Effect<
  DeleteEmailIdentityResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Used to convert a dedicated IP pool to a different scaling mode.
 *
 * `MANAGED` pools cannot be converted to `STANDARD` scaling mode.
 */
export const putDedicatedIpPoolScalingAttributes: (
  input: PutDedicatedIpPoolScalingAttributesRequest,
) => Effect.Effect<
  PutDedicatedIpPoolScalingAttributesResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDedicatedIpPoolScalingAttributesRequest,
  output: PutDedicatedIpPoolScalingAttributesResponse,
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
 * resource. Tags can help you categorize and manage resources in different ways, such as
 * by purpose, owner, environment, or other criteria. A resource can have as many as 50
 * tags.
 *
 * Each tag consists of a required *tag key* and an
 * associated *tag value*, both of which you define. A tag key is a
 * general label that acts as a category for more specific tag values. A tag value acts as
 * a descriptor within a tag key.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Updates a contact's preferences for a list.
 *
 * You must specify all existing topic preferences in the
 * `TopicPreferences` object, not just the ones that need updating;
 * otherwise, all your existing preferences will be removed.
 */
export const updateContact: (
  input: UpdateContactRequest,
) => Effect.Effect<
  UpdateContactResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContactRequest,
  output: UpdateContactResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates contact list metadata. This operation does a complete replacement.
 */
export const updateContactList: (
  input: UpdateContactListRequest,
) => Effect.Effect<
  UpdateContactListResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContactListRequest,
  output: UpdateContactListResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated
 * IP addresses that are associated with your Amazon Web Services account. You can associate a pool with
 * a configuration set. When you send an email that uses that configuration set, the
 * message is sent from one of the addresses in the associated pool.
 */
export const createDedicatedIpPool: (
  input: CreateDedicatedIpPoolRequest,
) => Effect.Effect<
  CreateDedicatedIpPoolResponse,
  | AlreadyExistsException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Create a configuration set. *Configuration sets* are groups of
 * rules that you can apply to the emails that you send. You apply a configuration set to
 * an email by specifying the name of the configuration set when you call the Amazon SES API v2. When
 * you apply a configuration set to an email, all of the rules in that configuration set
 * are applied to the email.
 */
export const createConfigurationSet: (
  input: CreateConfigurationSetRequest,
) => Effect.Effect<
  CreateConfigurationSetResponse,
  | AlreadyExistsException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Starts the process of verifying an email identity. An *identity* is
 * an email address or domain that you use when you send email. Before you can use an
 * identity to send email, you first have to verify it. By verifying an identity, you
 * demonstrate that you're the owner of the identity, and that you've given Amazon SES API v2
 * permission to send email from the identity.
 *
 * When you verify an email address, Amazon SES sends an email to the address. Your email
 * address is verified as soon as you follow the link in the verification email.
 *
 * When you verify a domain without specifying the `DkimSigningAttributes`
 * object, this operation provides a set of DKIM tokens. You can convert these tokens into
 * CNAME records, which you then add to the DNS configuration for your domain. Your domain
 * is verified when Amazon SES detects these records in the DNS configuration for your domain.
 * This verification method is known as Easy DKIM.
 *
 * Alternatively, you can perform the verification process by providing your own
 * public-private key pair. This verification method is known as Bring Your Own DKIM
 * (BYODKIM). To use BYODKIM, your call to the `CreateEmailIdentity` operation
 * has to include the `DkimSigningAttributes` object. When you specify this
 * object, you provide a selector (a component of the DNS record name that identifies the
 * public key to use for DKIM authentication) and a private key.
 *
 * When you verify a domain, this operation provides a set of DKIM tokens, which you can
 * convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your
 * domain. Your domain is verified when Amazon SES detects these records in the DNS
 * configuration for your domain. For some DNS providers, it can take 72 hours or more to
 * complete the domain verification process.
 *
 * Additionally, you can associate an existing configuration set with the email identity that you're verifying.
 */
export const createEmailIdentity: (
  input: CreateEmailIdentityRequest,
) => Effect.Effect<
  CreateEmailIdentityResponse,
  | AlreadyExistsException
  | BadRequestException
  | ConcurrentModificationException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailIdentityRequest,
  output: CreateEmailIdentityResponse,
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
 * List all of the dedicated IP pools that exist in your Amazon Web Services account in the current
 * Region.
 */
export const listDedicatedIpPools: {
  (
    input: ListDedicatedIpPoolsRequest,
  ): Effect.Effect<
    ListDedicatedIpPoolsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDedicatedIpPoolsRequest,
  ) => Stream.Stream<
    ListDedicatedIpPoolsResponse,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDedicatedIpPoolsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequestException | TooManyRequestsException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  PutAccountDedicatedIpWarmupAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  PutAccountSendingAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSendingAttributesRequest,
  output: PutAccountSendingAttributesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Update your Amazon SES account VDM attributes.
 *
 * You can execute this operation no more than once per second.
 */
export const putAccountVdmAttributes: (
  input: PutAccountVdmAttributesRequest,
) => Effect.Effect<
  PutAccountVdmAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountVdmAttributesRequest,
  output: PutAccountVdmAttributesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Adds an email address to the suppression list for your account.
 */
export const putSuppressedDestination: (
  input: PutSuppressedDestinationRequest,
) => Effect.Effect<
  PutSuppressedDestinationResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSuppressedDestinationRequest,
  output: PutSuppressedDestinationResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Cancels an export job.
 */
export const cancelExportJob: (
  input: CancelExportJobRequest,
) => Effect.Effect<
  CancelExportJobResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelExportJobRequest,
  output: CancelExportJobResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Creates a new custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createCustomVerificationEmailTemplate: (
  input: CreateCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  CreateCustomVerificationEmailTemplateResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomVerificationEmailTemplateRequest,
  output: CreateCustomVerificationEmailTemplateResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a multi-region endpoint (global-endpoint).
 *
 * Only multi-region endpoints (global-endpoints) whose primary region is the AWS-Region
 * where operation is executed can be deleted.
 */
export const deleteMultiRegionEndpoint: (
  input: DeleteMultiRegionEndpointRequest,
) => Effect.Effect<
  DeleteMultiRegionEndpointResponse,
  | BadRequestException
  | ConcurrentModificationException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiRegionEndpointRequest,
  output: DeleteMultiRegionEndpointResponse,
  errors: [
    BadRequestException,
    ConcurrentModificationException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Obtain information about the email-sending status and capabilities of your Amazon SES
 * account in the current Amazon Web Services Region.
 */
export const getAccount: (
  input: GetAccountRequest,
) => Effect.Effect<
  GetAccountResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountRequest,
  output: GetAccountResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Retrieve a list of event destinations that are associated with a configuration
 * set.
 *
 * *Events* include message sends, deliveries, opens, clicks, bounces,
 * and complaints. *Event destinations* are places that you can send
 * information about these events to. For example, you can send event data to Amazon EventBridge and
 * associate a rule to send the event to the specified target.
 */
export const getConfigurationSetEventDestinations: (
  input: GetConfigurationSetEventDestinationsRequest,
) => Effect.Effect<
  GetConfigurationSetEventDestinationsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  GetDedicatedIpResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDedicatedIpRequest,
  output: GetDedicatedIpResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve information about the dedicated pool.
 */
export const getDedicatedIpPool: (
  input: GetDedicatedIpPoolRequest,
) => Effect.Effect<
  GetDedicatedIpPoolResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDedicatedIpPoolRequest,
  output: GetDedicatedIpPoolResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve information about the status of the Deliverability dashboard for your account. When
 * the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and other
 * metrics for the domains that you use to send email. You also gain the ability to perform
 * predictive inbox placement tests.
 *
 * When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition
 * to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more
 * information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
 */
export const getDeliverabilityDashboardOptions: (
  input: GetDeliverabilityDashboardOptionsRequest,
) => Effect.Effect<
  GetDeliverabilityDashboardOptionsResponse,
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Retrieve the results of a predictive inbox placement test.
 */
export const getDeliverabilityTestReport: (
  input: GetDeliverabilityTestReportRequest,
) => Effect.Effect<
  GetDeliverabilityTestReportResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeliverabilityTestReportRequest,
  output: GetDeliverabilityTestReportResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve all the deliverability data for a specific campaign. This data is available
 * for a campaign only if the campaign sent email by using a domain that the
 * Deliverability dashboard is enabled for.
 */
export const getDomainDeliverabilityCampaign: (
  input: GetDomainDeliverabilityCampaignRequest,
) => Effect.Effect<
  GetDomainDeliverabilityCampaignResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainDeliverabilityCampaignRequest,
  output: GetDomainDeliverabilityCampaignResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Provides information about an export job.
 */
export const getExportJob: (
  input: GetExportJobRequest,
) => Effect.Effect<
  GetExportJobResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportJobRequest,
  output: GetExportJobResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Displays the multi-region endpoint (global-endpoint) configuration.
 *
 * Only multi-region endpoints (global-endpoints) whose primary region is the AWS-Region
 * where operation is executed can be displayed.
 */
export const getMultiRegionEndpoint: (
  input: GetMultiRegionEndpointRequest,
) => Effect.Effect<
  GetMultiRegionEndpointResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMultiRegionEndpointRequest,
  output: GetMultiRegionEndpointResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Get information about a specific tenant, including the tenant's name, ID, ARN,
 * creation timestamp, tags, and sending status.
 */
export const getTenant: (
  input: GetTenantRequest,
) => Effect.Effect<
  GetTenantResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTenantRequest,
  output: GetTenantResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Update the customer-managed sending status for a reputation entity. This allows
 * you to enable, disable, or reinstate sending for the entity.
 *
 * The customer-managed status works in conjunction with the Amazon Web Services Amazon SES-managed status
 * to determine the overall sending capability. When you update the customer-managed status,
 * the Amazon Web Services Amazon SES-managed status remains unchanged. If Amazon Web Services Amazon SES has disabled the entity,
 * it will not be allowed to send regardless of the customer-managed status setting. When you
 * reinstate an entity through the customer-managed status, it can continue sending only if
 * the Amazon Web Services Amazon SES-managed status also permits sending, even if there are active reputation
 * findings, until the findings are resolved or new violations occur.
 */
export const updateReputationEntityCustomerManagedStatus: (
  input: UpdateReputationEntityCustomerManagedStatusRequest,
) => Effect.Effect<
  UpdateReputationEntityCustomerManagedStatusResponse,
  | BadRequestException
  | ConflictException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReputationEntityCustomerManagedStatusRequest,
  output: UpdateReputationEntityCustomerManagedStatusResponse,
  errors: [BadRequestException, ConflictException, TooManyRequestsException],
}));
/**
 * Update the reputation management policy for a reputation entity. The policy
 * determines how the entity responds to reputation findings, such as automatically
 * pausing sending when certain thresholds are exceeded.
 *
 * Reputation management policies are Amazon Web Services Amazon SES-managed (predefined policies).
 * You can select from none, standard, and strict policies.
 */
export const updateReputationEntityPolicy: (
  input: UpdateReputationEntityPolicyRequest,
) => Effect.Effect<
  UpdateReputationEntityPolicyResponse,
  | BadRequestException
  | ConflictException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReputationEntityPolicyRequest,
  output: UpdateReputationEntityPolicyResponse,
  errors: [BadRequestException, ConflictException, TooManyRequestsException],
}));
/**
 * Create an event destination. *Events* include message sends,
 * deliveries, opens, clicks, bounces, and complaints. Event
 * destinations are places that you can send information about these events
 * to. For example, you can send event data to Amazon EventBridge and associate a rule to send the event
 * to the specified target.
 *
 * A single configuration set can include more than one event destination.
 */
export const createConfigurationSetEventDestination: (
  input: CreateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  CreateConfigurationSetEventDestinationResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
 * Creates an import job for a data destination.
 */
export const createImportJob: (
  input: CreateImportJobRequest,
) => Effect.Effect<
  CreateImportJobResponse,
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImportJobRequest,
  output: CreateImportJobResponse,
  errors: [
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a multi-region endpoint (global-endpoint).
 *
 * The primary region is going to be the AWS-Region where the operation is executed.
 * The secondary region has to be provided in request's parameters.
 * From the data flow standpoint there is no difference between primary
 * and secondary regions - sending traffic will be split equally between the two.
 * The primary region is the region where the resource has been created and where it can be managed.
 */
export const createMultiRegionEndpoint: (
  input: CreateMultiRegionEndpointRequest,
) => Effect.Effect<
  CreateMultiRegionEndpointResponse,
  | AlreadyExistsException
  | BadRequestException
  | LimitExceededException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiRegionEndpointRequest,
  output: CreateMultiRegionEndpointResponse,
  errors: [
    AlreadyExistsException,
    BadRequestException,
    LimitExceededException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
 */
export const getBlacklistReports: (
  input: GetBlacklistReportsRequest,
) => Effect.Effect<
  GetBlacklistReportsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
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
) => Effect.Effect<
  GetDomainStatisticsReportResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainStatisticsReportRequest,
  output: GetDomainStatisticsReportResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Provides validation insights about a specific email address, including syntax validation, DNS record checks, mailbox existence, and other deliverability factors.
 */
export const getEmailAddressInsights: (
  input: GetEmailAddressInsightsRequest,
) => Effect.Effect<
  GetEmailAddressInsightsResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailAddressInsightsRequest,
  output: GetEmailAddressInsightsResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Provides information about a specific identity, including the identity's verification
 * status, sending authorization policies, its DKIM authentication status, and its custom
 * Mail-From settings.
 */
export const getEmailIdentity: (
  input: GetEmailIdentityRequest,
) => Effect.Effect<
  GetEmailIdentityResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailIdentityRequest,
  output: GetEmailIdentityResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieve information about a specific reputation entity, including its reputation
 * management policy, customer-managed status, Amazon Web Services Amazon SES-managed status, and aggregate
 * sending status.
 *
 * *Reputation entities* represent resources in your Amazon SES account that have reputation
 * tracking and management capabilities. The reputation impact reflects the highest
 * impact reputation finding for the entity. Reputation findings can be retrieved
 * using the `ListRecommendations` operation.
 */
export const getReputationEntity: (
  input: GetReputationEntityRequest,
) => Effect.Effect<
  GetReputationEntityResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReputationEntityRequest,
  output: GetReputationEntityResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Retrieves information about a specific email address that's on the suppression list
 * for your account.
 */
export const getSuppressedDestination: (
  input: GetSuppressedDestinationRequest,
) => Effect.Effect<
  GetSuppressedDestinationResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSuppressedDestinationRequest,
  output: GetSuppressedDestinationResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Lists the recommendations present in your Amazon SES account in the current Amazon Web Services Region.
 *
 * You can execute this operation no more than once per second.
 */
export const listRecommendations: {
  (
    input: ListRecommendationsRequest,
  ): Effect.Effect<
    ListRecommendationsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
    ListRecommendationsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendationsRequest,
  output: ListRecommendationsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves a list of email addresses that are on the suppression list for your
 * account.
 */
export const listSuppressedDestinations: {
  (
    input: ListSuppressedDestinationsRequest,
  ): Effect.Effect<
    ListSuppressedDestinationsResponse,
    | BadRequestException
    | InvalidNextTokenException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListSuppressedDestinationsRequest,
  ) => Stream.Stream<
    ListSuppressedDestinationsResponse,
    | BadRequestException
    | InvalidNextTokenException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListSuppressedDestinationsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | InvalidNextTokenException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSuppressedDestinationsRequest,
  output: ListSuppressedDestinationsResponse,
  errors: [
    BadRequestException,
    InvalidNextTokenException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * List all resources associated with a specific tenant.
 *
 * This operation returns a list of resources (email identities, configuration sets,
 * or email templates) that are associated with the specified tenant. You can optionally
 * filter the results by resource type.
 */
export const listTenantResources: {
  (
    input: ListTenantResourcesRequest,
  ): Effect.Effect<
    ListTenantResourcesResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTenantResourcesRequest,
  ) => Stream.Stream<
    ListTenantResourcesResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTenantResourcesRequest,
  ) => Stream.Stream<
    TenantResource,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTenantResourcesRequest,
  output: ListTenantResourcesResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TenantResources",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Change the settings for the account-level suppression list.
 */
export const putAccountSuppressionAttributes: (
  input: PutAccountSuppressionAttributesRequest,
) => Effect.Effect<
  PutAccountSuppressionAttributesResponse,
  BadRequestException | TooManyRequestsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSuppressionAttributesRequest,
  output: PutAccountSuppressionAttributesResponse,
  errors: [BadRequestException, TooManyRequestsException],
}));
/**
 * Creates an export job for a data source and destination.
 *
 * You can execute this operation no more than once per second.
 */
export const createExportJob: (
  input: CreateExportJobRequest,
) => Effect.Effect<
  CreateExportJobResponse,
  | BadRequestException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportJobRequest,
  output: CreateExportJobResponse,
  errors: [
    BadRequestException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the contacts present in a specific contact list.
 */
export const listContacts: {
  (
    input: ListContactsRequest,
  ): Effect.Effect<
    ListContactsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    ListContactsResponse,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContactsRequest,
  output: ListContactsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves batches of metric data collected based on your sending activity.
 *
 * You can execute this operation no more than 16 times per second,
 * and with at most 160 queries from the batches per second (cumulative).
 */
export const batchGetMetricData: (
  input: BatchGetMetricDataRequest,
) => Effect.Effect<
  BatchGetMetricDataResponse,
  | BadRequestException
  | InternalServiceErrorException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetMetricDataRequest,
  output: BatchGetMetricDataResponse,
  errors: [
    BadRequestException,
    InternalServiceErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Provides information about a specific message, including the from address, the
 * subject, the recipient address, email tags, as well as events associated with the message.
 *
 * You can execute this operation no more than once per second.
 */
export const getMessageInsights: (
  input: GetMessageInsightsRequest,
) => Effect.Effect<
  GetMessageInsightsResponse,
  | BadRequestException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMessageInsightsRequest,
  output: GetMessageInsightsResponse,
  errors: [BadRequestException, NotFoundException, TooManyRequestsException],
}));
/**
 * Adds an email address to the list of identities for your Amazon SES account in the current
 * Amazon Web Services Region and attempts to verify it. As a result of executing this
 * operation, a customized verification email is sent to the specified address.
 *
 * To use this operation, you must first create a custom verification email template. For
 * more information about creating and using custom verification email templates, see
 * Using
 * custom verification email templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const sendCustomVerificationEmail: (
  input: SendCustomVerificationEmailRequest,
) => Effect.Effect<
  SendCustomVerificationEmailResponse,
  | BadRequestException
  | LimitExceededException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | NotFoundException
  | SendingPausedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendCustomVerificationEmailRequest,
  output: SendCustomVerificationEmailResponse,
  errors: [
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
 * Sends an email message. You can use the Amazon SES API v2 to send the following types of
 * messages:
 *
 * - **Simple** – A standard email message. When
 * you create this type of message, you specify the sender, the recipient, and the
 * message body, and Amazon SES assembles the message for you.
 *
 * - **Raw** – A raw, MIME-formatted email
 * message. When you send this type of email, you have to specify all of the
 * message headers, as well as the message body. You can use this message type to
 * send messages that contain attachments. The message that you specify has to be a
 * valid MIME message.
 *
 * - **Templated** – A message that contains
 * personalization tags. When you send this type of email, Amazon SES API v2 automatically
 * replaces the tags with values that you specify.
 */
export const sendEmail: (
  input: SendEmailRequest,
) => Effect.Effect<
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
  Credentials | Rgn | HttpClient.HttpClient
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
 * sample message that contains the content that you plan to send to your customers. Amazon SES
 * then sends that message to special email addresses spread across several major email
 * providers. After about 24 hours, the test is complete, and you can use the
 * `GetDeliverabilityTestReport` operation to view the results of the
 * test.
 */
export const createDeliverabilityTestReport: (
  input: CreateDeliverabilityTestReportRequest,
) => Effect.Effect<
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
  Credentials | Rgn | HttpClient.HttpClient
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
/**
 * Composes an email message to multiple destinations.
 */
export const sendBulkEmail: (
  input: SendBulkEmailRequest,
) => Effect.Effect<
  SendBulkEmailResponse,
  | AccountSuspendedException
  | BadRequestException
  | LimitExceededException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | NotFoundException
  | SendingPausedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendBulkEmailRequest,
  output: SendBulkEmailResponse,
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
