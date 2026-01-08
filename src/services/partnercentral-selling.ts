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
  sdkId: "PartnerCentral Selling",
  serviceShapeName: "AWSPartnerCentralSelling",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-selling" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://partnercentral-selling-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://partnercentral-selling.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CatalogIdentifier = string;
export type EngagementArnOrIdentifier = string;
export type ClientToken = string;
export type TaggableResourceArn = string;
export type ResourceSnapshotJobRoleIdentifier = string;
export type TagKey = string;
export type EngagementContextIdentifier = string;
export type EngagementTitle = string;
export type EngagementDescription = string;
export type AwsAccount = string | redacted.Redacted<string>;
export type EngagementPageSize = number;
export type MemberPageSize = number;
export type EngagementInvitationArnOrIdentifier = string;
export type OpportunityIdentifier = string;
export type TaskArnOrIdentifier = string;
export type EngagementIdentifier = string;
export type PageSize = number;
export type RejectionReasonString = string;
export type ContextIdentifier = string;
export type ResourceIdentifier = string;
export type ResourceTemplateName = string;
export type ResourceSnapshotRevision = number;
export type ResourceSnapshotJobIdentifier = string;
export type SolutionIdentifier = string;
export type TagValue = string;
export type InvitationMessage = string | redacted.Redacted<string>;
export type PiiString = string | redacted.Redacted<string>;
export type Email = string | redacted.Redacted<string>;
export type Name = string | redacted.Redacted<string>;
export type JobTitle = string | redacted.Redacted<string>;
export type PhoneNumber = string | redacted.Redacted<string>;
export type ResourceSnapshotJobRoleArn = string;
export type EngagementArn = string;
export type TaskIdentifier = string;
export type TaskArn = string;
export type EngagementInvitationIdentifier = string;
export type OpportunityArn = string;
export type ResourceArn = string;
export type ResourceSnapshotJobArn = string;
export type LeadQualificationStatus = string;
export type WebsiteUrl = string | redacted.Redacted<string>;
export type DunsNumber = string | redacted.Redacted<string>;
export type Amount = string | redacted.Redacted<string>;
export type EstimationUrl = string;
export type MemberCompanyName = string | redacted.Redacted<string>;
export type AwsMarketplaceOfferIdentifier = string;
export type AwsMarketplaceOfferSetIdentifier = string;
export type AwsProductIdentifier = string;
export type ResourceSnapshotArn = string;
export type CompanyName = string | redacted.Redacted<string>;
export type CompanyWebsiteUrl = string | redacted.Redacted<string>;
export type EngagementCustomerProjectTitle = string;
export type EngagementCustomerBusinessProblem =
  | string
  | redacted.Redacted<string>;
export type AwsMaturity = string;
export type LeadSourceType = string;
export type LeadSourceId = string;
export type LeadSourceName = string;
export type EngagementUseCase = string;
export type CustomerAction = string;
export type Alias = string | redacted.Redacted<string>;
export type AddressPart = string | redacted.Redacted<string>;
export type SenderContactEmail = string | redacted.Redacted<string>;
export type SolutionArn = string;
export type MonetaryAmount = string | redacted.Redacted<string>;
export type EngagementInvitationArn = string;

//# Schemas
export type EngagementContextType = "CustomerProject" | "Lead";
export const EngagementContextType = S.Literal("CustomerProject", "Lead");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AwsAccountList = string | redacted.Redacted<string>[];
export const AwsAccountList = S.Array(SensitiveString);
export type EngagementContextTypeList = EngagementContextType[];
export const EngagementContextTypeList = S.Array(EngagementContextType);
export type EngagementIdentifiers = string[];
export const EngagementIdentifiers = S.Array(S.String);
export type TaskStatus = "IN_PROGRESS" | "COMPLETE" | "FAILED";
export const TaskStatus = S.Literal("IN_PROGRESS", "COMPLETE", "FAILED");
export type TaskStatuses = TaskStatus[];
export const TaskStatuses = S.Array(TaskStatus);
export type OpportunityIdentifiers = string[];
export const OpportunityIdentifiers = S.Array(S.String);
export type EngagementInvitationIdentifiers = string[];
export const EngagementInvitationIdentifiers = S.Array(S.String);
export type TaskIdentifiers = string[];
export const TaskIdentifiers = S.Array(S.String);
export type EngagementInvitationPayloadType =
  | "OpportunityInvitation"
  | "LeadInvitation";
export const EngagementInvitationPayloadType = S.Literal(
  "OpportunityInvitation",
  "LeadInvitation",
);
export type EngagementInvitationsPayloadType =
  EngagementInvitationPayloadType[];
export const EngagementInvitationsPayloadType = S.Array(
  EngagementInvitationPayloadType,
);
export type ParticipantType = "SENDER" | "RECEIVER";
export const ParticipantType = S.Literal("SENDER", "RECEIVER");
export type InvitationStatus = "ACCEPTED" | "PENDING" | "REJECTED" | "EXPIRED";
export const InvitationStatus = S.Literal(
  "ACCEPTED",
  "PENDING",
  "REJECTED",
  "EXPIRED",
);
export type InvitationStatusList = InvitationStatus[];
export const InvitationStatusList = S.Array(InvitationStatus);
export type AwsAccountIdOrAliasList = string | redacted.Redacted<string>[];
export const AwsAccountIdOrAliasList = S.Array(SensitiveString);
export type PrimaryNeedFromAws =
  | "Co-Sell - Architectural Validation"
  | "Co-Sell - Business Presentation"
  | "Co-Sell - Competitive Information"
  | "Co-Sell - Pricing Assistance"
  | "Co-Sell - Technical Consultation"
  | "Co-Sell - Total Cost of Ownership Evaluation"
  | "Co-Sell - Deal Support"
  | "Co-Sell - Support for Public Tender / RFx";
export const PrimaryNeedFromAws = S.Literal(
  "Co-Sell - Architectural Validation",
  "Co-Sell - Business Presentation",
  "Co-Sell - Competitive Information",
  "Co-Sell - Pricing Assistance",
  "Co-Sell - Technical Consultation",
  "Co-Sell - Total Cost of Ownership Evaluation",
  "Co-Sell - Deal Support",
  "Co-Sell - Support for Public Tender / RFx",
);
export type PrimaryNeedsFromAws = PrimaryNeedFromAws[];
export const PrimaryNeedsFromAws = S.Array(PrimaryNeedFromAws);
export type NationalSecurity = "Yes" | "No";
export const NationalSecurity = S.Literal("Yes", "No");
export type OpportunityType = "Net New Business" | "Flat Renewal" | "Expansion";
export const OpportunityType = S.Literal(
  "Net New Business",
  "Flat Renewal",
  "Expansion",
);
export type OpportunityOrigin = "AWS Referral" | "Partner Referral";
export const OpportunityOrigin = S.Literal("AWS Referral", "Partner Referral");
export type FilterIdentifier = string[];
export const FilterIdentifier = S.Array(S.String);
export type Stage =
  | "Prospect"
  | "Qualified"
  | "Technical Validation"
  | "Business Validation"
  | "Committed"
  | "Launched"
  | "Closed Lost";
export const Stage = S.Literal(
  "Prospect",
  "Qualified",
  "Technical Validation",
  "Business Validation",
  "Committed",
  "Launched",
  "Closed Lost",
);
export type FilterLifeCycleStage = Stage[];
export const FilterLifeCycleStage = S.Array(Stage);
export type ReviewStatus =
  | "Pending Submission"
  | "Submitted"
  | "In review"
  | "Approved"
  | "Rejected"
  | "Action Required";
export const ReviewStatus = S.Literal(
  "Pending Submission",
  "Submitted",
  "In review",
  "Approved",
  "Rejected",
  "Action Required",
);
export type FilterLifeCycleReviewStatus = ReviewStatus[];
export const FilterLifeCycleReviewStatus = S.Array(ReviewStatus);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type RelatedEntityType =
  | "Solutions"
  | "AwsProducts"
  | "AwsMarketplaceOffers"
  | "AwsMarketplaceOfferSets";
export const RelatedEntityType = S.Literal(
  "Solutions",
  "AwsProducts",
  "AwsMarketplaceOffers",
  "AwsMarketplaceOfferSets",
);
export type SalesInvolvementType = "For Visibility Only" | "Co-Sell";
export const SalesInvolvementType = S.Literal("For Visibility Only", "Co-Sell");
export type Visibility = "Full" | "Limited";
export const Visibility = S.Literal("Full", "Limited");
export type ContextIdentifiers = string[];
export const ContextIdentifiers = S.Array(S.String);
export type ResourceType = "Opportunity";
export const ResourceType = S.Literal("Opportunity");
export type ResourceSnapshotJobStatus = "Running" | "Stopped";
export const ResourceSnapshotJobStatus = S.Literal("Running", "Stopped");
export type SolutionStatus = "Active" | "Inactive" | "Draft";
export const SolutionStatus = S.Literal("Active", "Inactive", "Draft");
export type FilterStatus = SolutionStatus[];
export const FilterStatus = S.Array(SolutionStatus);
export type SolutionIdentifiers = string[];
export const SolutionIdentifiers = S.Array(S.String);
export interface GetSellingSystemSettingsRequest {
  Catalog: string;
}
export const GetSellingSystemSettingsRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetSellingSystemSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSellingSystemSettingsRequest",
}) as any as S.Schema<GetSellingSystemSettingsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
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
export interface PutSellingSystemSettingsRequest {
  Catalog: string;
  ResourceSnapshotJobRoleIdentifier?: string;
}
export const PutSellingSystemSettingsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutSellingSystemSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSellingSystemSettingsRequest",
}) as any as S.Schema<PutSellingSystemSettingsRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
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
export interface GetEngagementRequest {
  Catalog: string;
  Identifier: string;
}
export const GetEngagementRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEngagement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEngagementRequest",
}) as any as S.Schema<GetEngagementRequest>;
export interface ListEngagementMembersRequest {
  Catalog: string;
  Identifier: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEngagementMembersRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementMembers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementMembersRequest",
}) as any as S.Schema<ListEngagementMembersRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface StartEngagementByAcceptingInvitationTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  Tags?: Tag[];
}
export const StartEngagementByAcceptingInvitationTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Identifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/StartEngagementByAcceptingInvitationTask",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEngagementByAcceptingInvitationTaskRequest",
}) as any as S.Schema<StartEngagementByAcceptingInvitationTaskRequest>;
export type SortOrder = "ASCENDING" | "DESCENDING";
export const SortOrder = S.Literal("ASCENDING", "DESCENDING");
export type ListTasksSortName = "StartTime";
export const ListTasksSortName = S.Literal("StartTime");
export interface ListTasksSortBase {
  SortOrder: SortOrder;
  SortBy: ListTasksSortName;
}
export const ListTasksSortBase = S.suspend(() =>
  S.Struct({ SortOrder: SortOrder, SortBy: ListTasksSortName }),
).annotations({
  identifier: "ListTasksSortBase",
}) as any as S.Schema<ListTasksSortBase>;
export interface ListEngagementFromOpportunityTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatus[];
  TaskIdentifier?: string[];
  OpportunityIdentifier?: string[];
  EngagementIdentifier?: string[];
}
export const ListEngagementFromOpportunityTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementFromOpportunityTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementFromOpportunityTasksRequest",
}) as any as S.Schema<ListEngagementFromOpportunityTasksRequest>;
export interface GetEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
}
export const GetEngagementInvitationRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEngagementInvitationRequest",
}) as any as S.Schema<GetEngagementInvitationRequest>;
export interface AcceptEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
}
export const AcceptEngagementInvitationRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AcceptEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptEngagementInvitationRequest",
}) as any as S.Schema<AcceptEngagementInvitationRequest>;
export interface AcceptEngagementInvitationResponse {}
export const AcceptEngagementInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptEngagementInvitationResponse",
}) as any as S.Schema<AcceptEngagementInvitationResponse>;
export interface RejectEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
  RejectionReason?: string;
}
export const RejectEngagementInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    RejectionReason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RejectEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectEngagementInvitationRequest",
}) as any as S.Schema<RejectEngagementInvitationRequest>;
export interface RejectEngagementInvitationResponse {}
export const RejectEngagementInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectEngagementInvitationResponse",
}) as any as S.Schema<RejectEngagementInvitationResponse>;
export interface GetOpportunityRequest {
  Catalog: string;
  Identifier: string;
}
export const GetOpportunityRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpportunityRequest",
}) as any as S.Schema<GetOpportunityRequest>;
export type Industry =
  | "Aerospace"
  | "Agriculture"
  | "Automotive"
  | "Computers and Electronics"
  | "Consumer Goods"
  | "Education"
  | "Energy - Oil and Gas"
  | "Energy - Power and Utilities"
  | "Financial Services"
  | "Gaming"
  | "Government"
  | "Healthcare"
  | "Hospitality"
  | "Life Sciences"
  | "Manufacturing"
  | "Marketing and Advertising"
  | "Media and Entertainment"
  | "Mining"
  | "Non-Profit Organization"
  | "Professional Services"
  | "Real Estate and Construction"
  | "Retail"
  | "Software and Internet"
  | "Telecommunications"
  | "Transportation and Logistics"
  | "Travel"
  | "Wholesale and Distribution"
  | "Other";
export const Industry = S.Literal(
  "Aerospace",
  "Agriculture",
  "Automotive",
  "Computers and Electronics",
  "Consumer Goods",
  "Education",
  "Energy - Oil and Gas",
  "Energy - Power and Utilities",
  "Financial Services",
  "Gaming",
  "Government",
  "Healthcare",
  "Hospitality",
  "Life Sciences",
  "Manufacturing",
  "Marketing and Advertising",
  "Media and Entertainment",
  "Mining",
  "Non-Profit Organization",
  "Professional Services",
  "Real Estate and Construction",
  "Retail",
  "Software and Internet",
  "Telecommunications",
  "Transportation and Logistics",
  "Travel",
  "Wholesale and Distribution",
  "Other",
);
export type CountryCode =
  | "US"
  | "AF"
  | "AX"
  | "AL"
  | "DZ"
  | "AS"
  | "AD"
  | "AO"
  | "AI"
  | "AQ"
  | "AG"
  | "AR"
  | "AM"
  | "AW"
  | "AU"
  | "AT"
  | "AZ"
  | "BS"
  | "BH"
  | "BD"
  | "BB"
  | "BY"
  | "BE"
  | "BZ"
  | "BJ"
  | "BM"
  | "BT"
  | "BO"
  | "BQ"
  | "BA"
  | "BW"
  | "BV"
  | "BR"
  | "IO"
  | "BN"
  | "BG"
  | "BF"
  | "BI"
  | "KH"
  | "CM"
  | "CA"
  | "CV"
  | "KY"
  | "CF"
  | "TD"
  | "CL"
  | "CN"
  | "CX"
  | "CC"
  | "CO"
  | "KM"
  | "CG"
  | "CK"
  | "CR"
  | "CI"
  | "HR"
  | "CU"
  | "CW"
  | "CY"
  | "CZ"
  | "CD"
  | "DK"
  | "DJ"
  | "DM"
  | "DO"
  | "EC"
  | "EG"
  | "SV"
  | "GQ"
  | "ER"
  | "EE"
  | "ET"
  | "FK"
  | "FO"
  | "FJ"
  | "FI"
  | "FR"
  | "GF"
  | "PF"
  | "TF"
  | "GA"
  | "GM"
  | "GE"
  | "DE"
  | "GH"
  | "GI"
  | "GR"
  | "GL"
  | "GD"
  | "GP"
  | "GU"
  | "GT"
  | "GG"
  | "GN"
  | "GW"
  | "GY"
  | "HT"
  | "HM"
  | "VA"
  | "HN"
  | "HK"
  | "HU"
  | "IS"
  | "IN"
  | "ID"
  | "IR"
  | "IQ"
  | "IE"
  | "IM"
  | "IL"
  | "IT"
  | "JM"
  | "JP"
  | "JE"
  | "JO"
  | "KZ"
  | "KE"
  | "KI"
  | "KR"
  | "KW"
  | "KG"
  | "LA"
  | "LV"
  | "LB"
  | "LS"
  | "LR"
  | "LY"
  | "LI"
  | "LT"
  | "LU"
  | "MO"
  | "MK"
  | "MG"
  | "MW"
  | "MY"
  | "MV"
  | "ML"
  | "MT"
  | "MH"
  | "MQ"
  | "MR"
  | "MU"
  | "YT"
  | "MX"
  | "FM"
  | "MD"
  | "MC"
  | "MN"
  | "ME"
  | "MS"
  | "MA"
  | "MZ"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "NL"
  | "AN"
  | "NC"
  | "NZ"
  | "NI"
  | "NE"
  | "NG"
  | "NU"
  | "NF"
  | "MP"
  | "NO"
  | "OM"
  | "PK"
  | "PW"
  | "PS"
  | "PA"
  | "PG"
  | "PY"
  | "PE"
  | "PH"
  | "PN"
  | "PL"
  | "PT"
  | "PR"
  | "QA"
  | "RE"
  | "RO"
  | "RU"
  | "RW"
  | "BL"
  | "SH"
  | "KN"
  | "LC"
  | "MF"
  | "PM"
  | "VC"
  | "WS"
  | "SM"
  | "ST"
  | "SA"
  | "SN"
  | "RS"
  | "SC"
  | "SL"
  | "SG"
  | "SX"
  | "SK"
  | "SI"
  | "SB"
  | "SO"
  | "ZA"
  | "GS"
  | "SS"
  | "ES"
  | "LK"
  | "SD"
  | "SR"
  | "SJ"
  | "SZ"
  | "SE"
  | "CH"
  | "SY"
  | "TW"
  | "TJ"
  | "TZ"
  | "TH"
  | "TL"
  | "TG"
  | "TK"
  | "TO"
  | "TT"
  | "TN"
  | "TR"
  | "TM"
  | "TC"
  | "TV"
  | "UG"
  | "UA"
  | "AE"
  | "GB"
  | "UM"
  | "UY"
  | "UZ"
  | "VU"
  | "VE"
  | "VN"
  | "VG"
  | "VI"
  | "WF"
  | "EH"
  | "YE"
  | "ZM"
  | "ZW";
export const CountryCode = S.Literal(
  "US",
  "AF",
  "AX",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BQ",
  "BA",
  "BW",
  "BV",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "KH",
  "CM",
  "CA",
  "CV",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CW",
  "CY",
  "CZ",
  "CD",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HM",
  "VA",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MK",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "AN",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "BL",
  "SH",
  "KN",
  "LC",
  "MF",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SX",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SZ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW",
);
export interface Address {
  City?: string | redacted.Redacted<string>;
  PostalCode?: string | redacted.Redacted<string>;
  StateOrRegion?: string | redacted.Redacted<string>;
  CountryCode?: CountryCode;
  StreetAddress?: string | redacted.Redacted<string>;
}
export const Address = S.suspend(() =>
  S.Struct({
    City: S.optional(SensitiveString),
    PostalCode: S.optional(SensitiveString),
    StateOrRegion: S.optional(SensitiveString),
    CountryCode: S.optional(CountryCode),
    StreetAddress: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export interface Account {
  Industry?: Industry;
  OtherIndustry?: string;
  CompanyName: string | redacted.Redacted<string>;
  WebsiteUrl?: string | redacted.Redacted<string>;
  AwsAccountId?: string | redacted.Redacted<string>;
  Address?: Address;
  Duns?: string | redacted.Redacted<string>;
}
export const Account = S.suspend(() =>
  S.Struct({
    Industry: S.optional(Industry),
    OtherIndustry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    AwsAccountId: S.optional(SensitiveString),
    Address: S.optional(Address),
    Duns: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export interface Contact {
  Email?: string | redacted.Redacted<string>;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  BusinessTitle?: string | redacted.Redacted<string>;
  Phone?: string | redacted.Redacted<string>;
}
export const Contact = S.suspend(() =>
  S.Struct({
    Email: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(SensitiveString),
    Phone: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type CustomerContactsList = Contact[];
export const CustomerContactsList = S.Array(Contact);
export interface Customer {
  Account?: Account;
  Contacts?: Contact[];
}
export const Customer = S.suspend(() =>
  S.Struct({
    Account: S.optional(Account),
    Contacts: S.optional(CustomerContactsList),
  }),
).annotations({ identifier: "Customer" }) as any as S.Schema<Customer>;
export type DeliveryModel =
  | "SaaS or PaaS"
  | "BYOL or AMI"
  | "Managed Services"
  | "Professional Services"
  | "Resell"
  | "Other";
export const DeliveryModel = S.Literal(
  "SaaS or PaaS",
  "BYOL or AMI",
  "Managed Services",
  "Professional Services",
  "Resell",
  "Other",
);
export type DeliveryModels = DeliveryModel[];
export const DeliveryModels = S.Array(DeliveryModel);
export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "CAD"
  | "CNY"
  | "NZD"
  | "INR"
  | "JPY"
  | "CHF"
  | "SEK"
  | "AED"
  | "AFN"
  | "ALL"
  | "AMD"
  | "ANG"
  | "AOA"
  | "ARS"
  | "AWG"
  | "AZN"
  | "BAM"
  | "BBD"
  | "BDT"
  | "BGN"
  | "BHD"
  | "BIF"
  | "BMD"
  | "BND"
  | "BOB"
  | "BOV"
  | "BRL"
  | "BSD"
  | "BTN"
  | "BWP"
  | "BYN"
  | "BZD"
  | "CDF"
  | "CHE"
  | "CHW"
  | "CLF"
  | "CLP"
  | "COP"
  | "COU"
  | "CRC"
  | "CUC"
  | "CUP"
  | "CVE"
  | "CZK"
  | "DJF"
  | "DKK"
  | "DOP"
  | "DZD"
  | "EGP"
  | "ERN"
  | "ETB"
  | "FJD"
  | "FKP"
  | "GEL"
  | "GHS"
  | "GIP"
  | "GMD"
  | "GNF"
  | "GTQ"
  | "GYD"
  | "HKD"
  | "HNL"
  | "HRK"
  | "HTG"
  | "HUF"
  | "IDR"
  | "ILS"
  | "IQD"
  | "IRR"
  | "ISK"
  | "JMD"
  | "JOD"
  | "KES"
  | "KGS"
  | "KHR"
  | "KMF"
  | "KPW"
  | "KRW"
  | "KWD"
  | "KYD"
  | "KZT"
  | "LAK"
  | "LBP"
  | "LKR"
  | "LRD"
  | "LSL"
  | "LYD"
  | "MAD"
  | "MDL"
  | "MGA"
  | "MKD"
  | "MMK"
  | "MNT"
  | "MOP"
  | "MRU"
  | "MUR"
  | "MVR"
  | "MWK"
  | "MXN"
  | "MXV"
  | "MYR"
  | "MZN"
  | "NAD"
  | "NGN"
  | "NIO"
  | "NOK"
  | "NPR"
  | "OMR"
  | "PAB"
  | "PEN"
  | "PGK"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "QAR"
  | "RON"
  | "RSD"
  | "RUB"
  | "RWF"
  | "SAR"
  | "SBD"
  | "SCR"
  | "SDG"
  | "SGD"
  | "SHP"
  | "SLL"
  | "SOS"
  | "SRD"
  | "SSP"
  | "STN"
  | "SVC"
  | "SYP"
  | "SZL"
  | "THB"
  | "TJS"
  | "TMT"
  | "TND"
  | "TOP"
  | "TRY"
  | "TTD"
  | "TWD"
  | "TZS"
  | "UAH"
  | "UGX"
  | "USN"
  | "UYI"
  | "UYU"
  | "UZS"
  | "VEF"
  | "VND"
  | "VUV"
  | "WST"
  | "XAF"
  | "XCD"
  | "XDR"
  | "XOF"
  | "XPF"
  | "XSU"
  | "XUA"
  | "YER"
  | "ZAR"
  | "ZMW"
  | "ZWL";
export const CurrencyCode = S.Literal(
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "CNY",
  "NZD",
  "INR",
  "JPY",
  "CHF",
  "SEK",
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BOV",
  "BRL",
  "BSD",
  "BTN",
  "BWP",
  "BYN",
  "BZD",
  "CDF",
  "CHE",
  "CHW",
  "CLF",
  "CLP",
  "COP",
  "COU",
  "CRC",
  "CUC",
  "CUP",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ERN",
  "ETB",
  "FJD",
  "FKP",
  "GEL",
  "GHS",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "IQD",
  "IRR",
  "ISK",
  "JMD",
  "JOD",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KPW",
  "KRW",
  "KWD",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRU",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MXV",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "OMR",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SDG",
  "SGD",
  "SHP",
  "SLL",
  "SOS",
  "SRD",
  "SSP",
  "STN",
  "SVC",
  "SYP",
  "SZL",
  "THB",
  "TJS",
  "TMT",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "USN",
  "UYI",
  "UYU",
  "UZS",
  "VEF",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XDR",
  "XOF",
  "XPF",
  "XSU",
  "XUA",
  "YER",
  "ZAR",
  "ZMW",
  "ZWL",
);
export type PaymentFrequency = "Monthly";
export const PaymentFrequency = S.Literal("Monthly");
export interface ExpectedCustomerSpend {
  Amount?: string | redacted.Redacted<string>;
  CurrencyCode: CurrencyCode;
  Frequency: PaymentFrequency;
  TargetCompany: string;
  EstimationUrl?: string;
}
export const ExpectedCustomerSpend = S.suspend(() =>
  S.Struct({
    Amount: S.optional(SensitiveString),
    CurrencyCode: CurrencyCode,
    Frequency: PaymentFrequency,
    TargetCompany: S.String,
    EstimationUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ExpectedCustomerSpend",
}) as any as S.Schema<ExpectedCustomerSpend>;
export type ExpectedCustomerSpendList = ExpectedCustomerSpend[];
export const ExpectedCustomerSpendList = S.Array(ExpectedCustomerSpend);
export type ApnPrograms = string[];
export const ApnPrograms = S.Array(S.String);
export type SalesActivity =
  | "Initialized discussions with customer"
  | "Customer has shown interest in solution"
  | "Conducted POC / Demo"
  | "In evaluation / planning stage"
  | "Agreed on solution to Business Problem"
  | "Completed Action Plan"
  | "Finalized Deployment Need"
  | "SOW Signed";
export const SalesActivity = S.Literal(
  "Initialized discussions with customer",
  "Customer has shown interest in solution",
  "Conducted POC / Demo",
  "In evaluation / planning stage",
  "Agreed on solution to Business Problem",
  "Completed Action Plan",
  "Finalized Deployment Need",
  "SOW Signed",
);
export type SalesActivities = SalesActivity[];
export const SalesActivities = S.Array(SalesActivity);
export type CompetitorName =
  | "Oracle Cloud"
  | "On-Prem"
  | "Co-location"
  | "Akamai"
  | "AliCloud"
  | "Google Cloud Platform"
  | "IBM Softlayer"
  | "Microsoft Azure"
  | "Other- Cost Optimization"
  | "No Competition"
  | "*Other";
export const CompetitorName = S.Literal(
  "Oracle Cloud",
  "On-Prem",
  "Co-location",
  "Akamai",
  "AliCloud",
  "Google Cloud Platform",
  "IBM Softlayer",
  "Microsoft Azure",
  "Other- Cost Optimization",
  "No Competition",
  "*Other",
);
export type AwsPartition = "aws-eusc";
export const AwsPartition = S.Literal("aws-eusc");
export interface Project {
  DeliveryModels?: DeliveryModel[];
  ExpectedCustomerSpend?: ExpectedCustomerSpend[];
  Title?: string | redacted.Redacted<string>;
  ApnPrograms?: string[];
  CustomerBusinessProblem?: string | redacted.Redacted<string>;
  CustomerUseCase?: string;
  RelatedOpportunityIdentifier?: string;
  SalesActivities?: SalesActivity[];
  CompetitorName?: CompetitorName;
  OtherCompetitorNames?: string;
  OtherSolutionDescription?: string | redacted.Redacted<string>;
  AdditionalComments?: string;
  AwsPartition?: AwsPartition;
}
export const Project = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    Title: S.optional(SensitiveString),
    ApnPrograms: S.optional(ApnPrograms),
    CustomerBusinessProblem: S.optional(SensitiveString),
    CustomerUseCase: S.optional(S.String),
    RelatedOpportunityIdentifier: S.optional(S.String),
    SalesActivities: S.optional(SalesActivities),
    CompetitorName: S.optional(CompetitorName),
    OtherCompetitorNames: S.optional(S.String),
    OtherSolutionDescription: S.optional(SensitiveString),
    AdditionalComments: S.optional(S.String),
    AwsPartition: S.optional(AwsPartition),
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export type MarketingSource = "Marketing Activity" | "None";
export const MarketingSource = S.Literal("Marketing Activity", "None");
export type UseCases = string[];
export const UseCases = S.Array(S.String);
export type Channel =
  | "AWS Marketing Central"
  | "Content Syndication"
  | "Display"
  | "Email"
  | "Live Event"
  | "Out Of Home (OOH)"
  | "Print"
  | "Search"
  | "Social"
  | "Telemarketing"
  | "TV"
  | "Video"
  | "Virtual Event";
export const Channel = S.Literal(
  "AWS Marketing Central",
  "Content Syndication",
  "Display",
  "Email",
  "Live Event",
  "Out Of Home (OOH)",
  "Print",
  "Search",
  "Social",
  "Telemarketing",
  "TV",
  "Video",
  "Virtual Event",
);
export type Channels = Channel[];
export const Channels = S.Array(Channel);
export type AwsFundingUsed = "Yes" | "No";
export const AwsFundingUsed = S.Literal("Yes", "No");
export interface Marketing {
  CampaignName?: string;
  Source?: MarketingSource;
  UseCases?: string[];
  Channels?: Channel[];
  AwsFundingUsed?: AwsFundingUsed;
}
export const Marketing = S.suspend(() =>
  S.Struct({
    CampaignName: S.optional(S.String),
    Source: S.optional(MarketingSource),
    UseCases: S.optional(UseCases),
    Channels: S.optional(Channels),
    AwsFundingUsed: S.optional(AwsFundingUsed),
  }),
).annotations({ identifier: "Marketing" }) as any as S.Schema<Marketing>;
export type RevenueModel = "Contract" | "Pay-as-you-go" | "Subscription";
export const RevenueModel = S.Literal(
  "Contract",
  "Pay-as-you-go",
  "Subscription",
);
export interface MonetaryValue {
  Amount: string;
  CurrencyCode: CurrencyCode;
}
export const MonetaryValue = S.suspend(() =>
  S.Struct({ Amount: S.String, CurrencyCode: CurrencyCode }),
).annotations({
  identifier: "MonetaryValue",
}) as any as S.Schema<MonetaryValue>;
export interface SoftwareRevenue {
  DeliveryModel?: RevenueModel;
  Value?: MonetaryValue;
  EffectiveDate?: string;
  ExpirationDate?: string;
}
export const SoftwareRevenue = S.suspend(() =>
  S.Struct({
    DeliveryModel: S.optional(RevenueModel),
    Value: S.optional(MonetaryValue),
    EffectiveDate: S.optional(S.String),
    ExpirationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "SoftwareRevenue",
}) as any as S.Schema<SoftwareRevenue>;
export type ClosedLostReason =
  | "Customer Deficiency"
  | "Delay / Cancellation of Project"
  | "Legal / Tax / Regulatory"
  | "Lost to Competitor - Google"
  | "Lost to Competitor - Microsoft"
  | "Lost to Competitor - SoftLayer"
  | "Lost to Competitor - VMWare"
  | "Lost to Competitor - Other"
  | "No Opportunity"
  | "On Premises Deployment"
  | "Partner Gap"
  | "Price"
  | "Security / Compliance"
  | "Technical Limitations"
  | "Customer Experience"
  | "Other"
  | "People/Relationship/Governance"
  | "Product/Technology"
  | "Financial/Commercial";
export const ClosedLostReason = S.Literal(
  "Customer Deficiency",
  "Delay / Cancellation of Project",
  "Legal / Tax / Regulatory",
  "Lost to Competitor - Google",
  "Lost to Competitor - Microsoft",
  "Lost to Competitor - SoftLayer",
  "Lost to Competitor - VMWare",
  "Lost to Competitor - Other",
  "No Opportunity",
  "On Premises Deployment",
  "Partner Gap",
  "Price",
  "Security / Compliance",
  "Technical Limitations",
  "Customer Experience",
  "Other",
  "People/Relationship/Governance",
  "Product/Technology",
  "Financial/Commercial",
);
export interface NextStepsHistory {
  Value: string;
  Time: Date;
}
export const NextStepsHistory = S.suspend(() =>
  S.Struct({
    Value: S.String,
    Time: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "NextStepsHistory",
}) as any as S.Schema<NextStepsHistory>;
export type NextStepsHistories = NextStepsHistory[];
export const NextStepsHistories = S.Array(NextStepsHistory);
export interface LifeCycle {
  Stage?: Stage;
  ClosedLostReason?: ClosedLostReason;
  NextSteps?: string | redacted.Redacted<string>;
  TargetCloseDate?: string;
  ReviewStatus?: ReviewStatus;
  ReviewComments?: string;
  ReviewStatusReason?: string;
  NextStepsHistory?: NextStepsHistory[];
}
export const LifeCycle = S.suspend(() =>
  S.Struct({
    Stage: S.optional(Stage),
    ClosedLostReason: S.optional(ClosedLostReason),
    NextSteps: S.optional(SensitiveString),
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(ReviewStatus),
    ReviewComments: S.optional(S.String),
    ReviewStatusReason: S.optional(S.String),
    NextStepsHistory: S.optional(NextStepsHistories),
  }),
).annotations({ identifier: "LifeCycle" }) as any as S.Schema<LifeCycle>;
export interface UpdateOpportunityRequest {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedFromAws[];
  NationalSecurity?: NationalSecurity;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: OpportunityType;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  LastModifiedDate: Date;
  Identifier: string;
  LifeCycle?: LifeCycle;
}
export const UpdateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(NationalSecurity),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(OpportunityType),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    Identifier: S.String,
    LifeCycle: S.optional(LifeCycle),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOpportunityRequest",
}) as any as S.Schema<UpdateOpportunityRequest>;
export interface AssociateOpportunityRequest {
  Catalog: string;
  OpportunityIdentifier: string;
  RelatedEntityType: RelatedEntityType;
  RelatedEntityIdentifier: string;
}
export const AssociateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: RelatedEntityType,
    RelatedEntityIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssociateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateOpportunityRequest",
}) as any as S.Schema<AssociateOpportunityRequest>;
export interface AssociateOpportunityResponse {}
export const AssociateOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateOpportunityResponse",
}) as any as S.Schema<AssociateOpportunityResponse>;
export interface DisassociateOpportunityRequest {
  Catalog: string;
  OpportunityIdentifier: string;
  RelatedEntityType: RelatedEntityType;
  RelatedEntityIdentifier: string;
}
export const DisassociateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: RelatedEntityType,
    RelatedEntityIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisassociateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateOpportunityRequest",
}) as any as S.Schema<DisassociateOpportunityRequest>;
export interface DisassociateOpportunityResponse {}
export const DisassociateOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateOpportunityResponse",
}) as any as S.Schema<DisassociateOpportunityResponse>;
export interface GetAwsOpportunitySummaryRequest {
  Catalog: string;
  RelatedOpportunityIdentifier: string;
}
export const GetAwsOpportunitySummaryRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, RelatedOpportunityIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetAwsOpportunitySummary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAwsOpportunitySummaryRequest",
}) as any as S.Schema<GetAwsOpportunitySummaryRequest>;
export interface SubmitOpportunityRequest {
  Catalog: string;
  Identifier: string;
  InvolvementType: SalesInvolvementType;
  Visibility?: Visibility;
}
export const SubmitOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    InvolvementType: SalesInvolvementType,
    Visibility: S.optional(Visibility),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SubmitOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubmitOpportunityRequest",
}) as any as S.Schema<SubmitOpportunityRequest>;
export interface SubmitOpportunityResponse {}
export const SubmitOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SubmitOpportunityResponse",
}) as any as S.Schema<SubmitOpportunityResponse>;
export interface StartOpportunityFromEngagementTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  ContextIdentifier: string;
  Tags?: Tag[];
}
export const StartOpportunityFromEngagementTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Identifier: S.String,
    ContextIdentifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartOpportunityFromEngagementTask" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartOpportunityFromEngagementTaskRequest",
}) as any as S.Schema<StartOpportunityFromEngagementTaskRequest>;
export interface ListOpportunityFromEngagementTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatus[];
  TaskIdentifier?: string[];
  OpportunityIdentifier?: string[];
  EngagementIdentifier?: string[];
  ContextIdentifier?: string[];
}
export const ListOpportunityFromEngagementTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    ContextIdentifier: S.optional(ContextIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListOpportunityFromEngagementTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpportunityFromEngagementTasksRequest",
}) as any as S.Schema<ListOpportunityFromEngagementTasksRequest>;
export interface CreateResourceSnapshotRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ResourceType: ResourceType;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  ClientToken: string;
}
export const CreateResourceSnapshotRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: ResourceType,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateResourceSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceSnapshotRequest",
}) as any as S.Schema<CreateResourceSnapshotRequest>;
export interface GetResourceSnapshotRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ResourceType: ResourceType;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  Revision?: number;
}
export const GetResourceSnapshotRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: ResourceType,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Revision: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSnapshotRequest",
}) as any as S.Schema<GetResourceSnapshotRequest>;
export interface ListEngagementResourceAssociationsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: string;
  ResourceType?: ResourceType;
  ResourceIdentifier?: string;
  CreatedBy?: string | redacted.Redacted<string>;
}
export const ListEngagementResourceAssociationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceIdentifier: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementResourceAssociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementResourceAssociationsRequest",
}) as any as S.Schema<ListEngagementResourceAssociationsRequest>;
export interface ListResourceSnapshotsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier: string;
  ResourceType?: ResourceType;
  ResourceIdentifier?: string;
  ResourceSnapshotTemplateIdentifier?: string;
  CreatedBy?: string | redacted.Redacted<string>;
}
export const ListResourceSnapshotsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.String,
    ResourceType: S.optional(ResourceType),
    ResourceIdentifier: S.optional(S.String),
    ResourceSnapshotTemplateIdentifier: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceSnapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSnapshotsRequest",
}) as any as S.Schema<ListResourceSnapshotsRequest>;
export interface CreateResourceSnapshotJobRequest {
  Catalog: string;
  ClientToken: string;
  EngagementIdentifier: string;
  ResourceType: ResourceType;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  Tags?: Tag[];
}
export const CreateResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    EngagementIdentifier: S.String,
    ResourceType: ResourceType,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceSnapshotJobRequest",
}) as any as S.Schema<CreateResourceSnapshotJobRequest>;
export interface GetResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const GetResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSnapshotJobRequest",
}) as any as S.Schema<GetResourceSnapshotJobRequest>;
export interface DeleteResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const DeleteResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceSnapshotJobRequest",
}) as any as S.Schema<DeleteResourceSnapshotJobRequest>;
export interface DeleteResourceSnapshotJobResponse {}
export const DeleteResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourceSnapshotJobResponse",
}) as any as S.Schema<DeleteResourceSnapshotJobResponse>;
export interface StartResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const StartResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartResourceSnapshotJobRequest",
}) as any as S.Schema<StartResourceSnapshotJobRequest>;
export interface StartResourceSnapshotJobResponse {}
export const StartResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartResourceSnapshotJobResponse",
}) as any as S.Schema<StartResourceSnapshotJobResponse>;
export interface StopResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const StopResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopResourceSnapshotJobRequest",
}) as any as S.Schema<StopResourceSnapshotJobRequest>;
export interface StopResourceSnapshotJobResponse {}
export const StopResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopResourceSnapshotJobResponse",
}) as any as S.Schema<StopResourceSnapshotJobResponse>;
export type EngagementSortName = "CreatedDate";
export const EngagementSortName = S.Literal("CreatedDate");
export type OpportunityEngagementInvitationSortName = "InvitationDate";
export const OpportunityEngagementInvitationSortName =
  S.Literal("InvitationDate");
export type OpportunitySortName =
  | "LastModifiedDate"
  | "Identifier"
  | "CustomerCompanyName";
export const OpportunitySortName = S.Literal(
  "LastModifiedDate",
  "Identifier",
  "CustomerCompanyName",
);
export type SortBy = "CreatedDate";
export const SortBy = S.Literal("CreatedDate");
export type SolutionSortName =
  | "Identifier"
  | "Name"
  | "Status"
  | "Category"
  | "CreatedDate";
export const SolutionSortName = S.Literal(
  "Identifier",
  "Name",
  "Status",
  "Category",
  "CreatedDate",
);
export type AccessDeniedExceptionErrorCode =
  "INCOMPATIBLE_BENEFIT_AWS_PARTNER_STATE";
export const AccessDeniedExceptionErrorCode = S.Literal(
  "INCOMPATIBLE_BENEFIT_AWS_PARTNER_STATE",
);
export interface EngagementCustomer {
  Industry: Industry;
  CompanyName: string | redacted.Redacted<string>;
  WebsiteUrl: string | redacted.Redacted<string>;
  CountryCode: CountryCode;
}
export const EngagementCustomer = S.suspend(() =>
  S.Struct({
    Industry: Industry,
    CompanyName: SensitiveString,
    WebsiteUrl: SensitiveString,
    CountryCode: CountryCode,
  }),
).annotations({
  identifier: "EngagementCustomer",
}) as any as S.Schema<EngagementCustomer>;
export interface EngagementCustomerProjectDetails {
  Title: string;
  BusinessProblem: string | redacted.Redacted<string>;
  TargetCompletionDate: string;
}
export const EngagementCustomerProjectDetails = S.suspend(() =>
  S.Struct({
    Title: S.String,
    BusinessProblem: SensitiveString,
    TargetCompletionDate: S.String,
  }),
).annotations({
  identifier: "EngagementCustomerProjectDetails",
}) as any as S.Schema<EngagementCustomerProjectDetails>;
export interface CustomerProjectsContext {
  Customer?: EngagementCustomer;
  Project?: EngagementCustomerProjectDetails;
}
export const CustomerProjectsContext = S.suspend(() =>
  S.Struct({
    Customer: S.optional(EngagementCustomer),
    Project: S.optional(EngagementCustomerProjectDetails),
  }),
).annotations({
  identifier: "CustomerProjectsContext",
}) as any as S.Schema<CustomerProjectsContext>;
export interface AddressSummary {
  City?: string | redacted.Redacted<string>;
  PostalCode?: string | redacted.Redacted<string>;
  StateOrRegion?: string | redacted.Redacted<string>;
  CountryCode?: CountryCode;
}
export const AddressSummary = S.suspend(() =>
  S.Struct({
    City: S.optional(SensitiveString),
    PostalCode: S.optional(SensitiveString),
    StateOrRegion: S.optional(SensitiveString),
    CountryCode: S.optional(CountryCode),
  }),
).annotations({
  identifier: "AddressSummary",
}) as any as S.Schema<AddressSummary>;
export type MarketSegment =
  | "Enterprise"
  | "Large"
  | "Medium"
  | "Small"
  | "Micro";
export const MarketSegment = S.Literal(
  "Enterprise",
  "Large",
  "Medium",
  "Small",
  "Micro",
);
export interface LeadCustomer {
  Industry?: Industry;
  CompanyName: string | redacted.Redacted<string>;
  WebsiteUrl?: string | redacted.Redacted<string>;
  Address: AddressSummary;
  AwsMaturity?: string;
  MarketSegment?: MarketSegment;
}
export const LeadCustomer = S.suspend(() =>
  S.Struct({
    Industry: S.optional(Industry),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    Address: AddressSummary,
    AwsMaturity: S.optional(S.String),
    MarketSegment: S.optional(MarketSegment),
  }),
).annotations({ identifier: "LeadCustomer" }) as any as S.Schema<LeadCustomer>;
export interface LeadContact {
  BusinessTitle: string | redacted.Redacted<string>;
  Email: string | redacted.Redacted<string>;
  FirstName: string | redacted.Redacted<string>;
  LastName: string | redacted.Redacted<string>;
  Phone?: string | redacted.Redacted<string>;
}
export const LeadContact = S.suspend(() =>
  S.Struct({
    BusinessTitle: SensitiveString,
    Email: SensitiveString,
    FirstName: SensitiveString,
    LastName: SensitiveString,
    Phone: S.optional(SensitiveString),
  }),
).annotations({ identifier: "LeadContact" }) as any as S.Schema<LeadContact>;
export interface LeadInteraction {
  SourceType: string;
  SourceId: string;
  SourceName: string;
  Usecase?: string;
  InteractionDate?: Date;
  CustomerAction: string;
  BusinessProblem?: string | redacted.Redacted<string>;
  Contact: LeadContact;
}
export const LeadInteraction = S.suspend(() =>
  S.Struct({
    SourceType: S.String,
    SourceId: S.String,
    SourceName: S.String,
    Usecase: S.optional(S.String),
    InteractionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CustomerAction: S.String,
    BusinessProblem: S.optional(SensitiveString),
    Contact: LeadContact,
  }),
).annotations({
  identifier: "LeadInteraction",
}) as any as S.Schema<LeadInteraction>;
export type LeadInteractionList = LeadInteraction[];
export const LeadInteractionList = S.Array(LeadInteraction);
export interface LeadContext {
  QualificationStatus?: string;
  Customer: LeadCustomer;
  Interactions: LeadInteraction[];
}
export const LeadContext = S.suspend(() =>
  S.Struct({
    QualificationStatus: S.optional(S.String),
    Customer: LeadCustomer,
    Interactions: LeadInteractionList,
  }),
).annotations({ identifier: "LeadContext" }) as any as S.Schema<LeadContext>;
export type EngagementContextPayload =
  | { CustomerProject: CustomerProjectsContext }
  | { Lead: LeadContext };
export const EngagementContextPayload = S.Union(
  S.Struct({ CustomerProject: CustomerProjectsContext }),
  S.Struct({ Lead: LeadContext }),
);
export interface EngagementContextDetails {
  Id?: string;
  Type: EngagementContextType;
  Payload?: EngagementContextPayload;
}
export const EngagementContextDetails = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: EngagementContextType,
    Payload: S.optional(EngagementContextPayload),
  }),
).annotations({
  identifier: "EngagementContextDetails",
}) as any as S.Schema<EngagementContextDetails>;
export type EngagementContexts = EngagementContextDetails[];
export const EngagementContexts = S.Array(EngagementContextDetails);
export interface EngagementSort {
  SortOrder: SortOrder;
  SortBy: EngagementSortName;
}
export const EngagementSort = S.suspend(() =>
  S.Struct({ SortOrder: SortOrder, SortBy: EngagementSortName }),
).annotations({
  identifier: "EngagementSort",
}) as any as S.Schema<EngagementSort>;
export type ReasonCode =
  | "InvitationAccessDenied"
  | "InvitationValidationFailed"
  | "EngagementAccessDenied"
  | "OpportunityAccessDenied"
  | "ResourceSnapshotJobAccessDenied"
  | "ResourceSnapshotJobValidationFailed"
  | "ResourceSnapshotJobConflict"
  | "EngagementValidationFailed"
  | "EngagementConflict"
  | "OpportunitySubmissionFailed"
  | "EngagementInvitationConflict"
  | "InternalError"
  | "OpportunityValidationFailed"
  | "OpportunityConflict"
  | "ResourceSnapshotAccessDenied"
  | "ResourceSnapshotValidationFailed"
  | "ResourceSnapshotConflict"
  | "ServiceQuotaExceeded"
  | "RequestThrottled"
  | "ContextNotFound"
  | "CustomerProjectContextNotPermitted"
  | "DisqualifiedLeadNotPermitted";
export const ReasonCode = S.Literal(
  "InvitationAccessDenied",
  "InvitationValidationFailed",
  "EngagementAccessDenied",
  "OpportunityAccessDenied",
  "ResourceSnapshotJobAccessDenied",
  "ResourceSnapshotJobValidationFailed",
  "ResourceSnapshotJobConflict",
  "EngagementValidationFailed",
  "EngagementConflict",
  "OpportunitySubmissionFailed",
  "EngagementInvitationConflict",
  "InternalError",
  "OpportunityValidationFailed",
  "OpportunityConflict",
  "ResourceSnapshotAccessDenied",
  "ResourceSnapshotValidationFailed",
  "ResourceSnapshotConflict",
  "ServiceQuotaExceeded",
  "RequestThrottled",
  "ContextNotFound",
  "CustomerProjectContextNotPermitted",
  "DisqualifiedLeadNotPermitted",
);
export interface AwsSubmission {
  InvolvementType: SalesInvolvementType;
  Visibility?: Visibility;
}
export const AwsSubmission = S.suspend(() =>
  S.Struct({
    InvolvementType: SalesInvolvementType,
    Visibility: S.optional(Visibility),
  }),
).annotations({
  identifier: "AwsSubmission",
}) as any as S.Schema<AwsSubmission>;
export interface OpportunityEngagementInvitationSort {
  SortOrder: SortOrder;
  SortBy: OpportunityEngagementInvitationSortName;
}
export const OpportunityEngagementInvitationSort = S.suspend(() =>
  S.Struct({
    SortOrder: SortOrder,
    SortBy: OpportunityEngagementInvitationSortName,
  }),
).annotations({
  identifier: "OpportunityEngagementInvitationSort",
}) as any as S.Schema<OpportunityEngagementInvitationSort>;
export type PartnerOpportunityTeamMembersList = Contact[];
export const PartnerOpportunityTeamMembersList = S.Array(Contact);
export interface OpportunitySort {
  SortOrder: SortOrder;
  SortBy: OpportunitySortName;
}
export const OpportunitySort = S.suspend(() =>
  S.Struct({ SortOrder: SortOrder, SortBy: OpportunitySortName }),
).annotations({
  identifier: "OpportunitySort",
}) as any as S.Schema<OpportunitySort>;
export interface LastModifiedDate {
  AfterLastModifiedDate?: Date;
  BeforeLastModifiedDate?: Date;
}
export const LastModifiedDate = S.suspend(() =>
  S.Struct({
    AfterLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    BeforeLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "LastModifiedDate",
}) as any as S.Schema<LastModifiedDate>;
export interface AssigneeContact {
  Email: string | redacted.Redacted<string>;
  FirstName: string | redacted.Redacted<string>;
  LastName: string | redacted.Redacted<string>;
  Phone?: string | redacted.Redacted<string>;
  BusinessTitle: string | redacted.Redacted<string>;
}
export const AssigneeContact = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    FirstName: SensitiveString,
    LastName: SensitiveString,
    Phone: S.optional(SensitiveString),
    BusinessTitle: SensitiveString,
  }),
).annotations({
  identifier: "AssigneeContact",
}) as any as S.Schema<AssigneeContact>;
export type InvolvementTypeChangeReason =
  | "Expansion Opportunity"
  | "Change in Deal Information"
  | "Customer Requested"
  | "Technical Complexity"
  | "Risk Mitigation";
export const InvolvementTypeChangeReason = S.Literal(
  "Expansion Opportunity",
  "Change in Deal Information",
  "Customer Requested",
  "Technical Complexity",
  "Risk Mitigation",
);
export interface SortObject {
  SortBy?: SortBy;
  SortOrder?: SortOrder;
}
export const SortObject = S.suspend(() =>
  S.Struct({ SortBy: S.optional(SortBy), SortOrder: S.optional(SortOrder) }),
).annotations({ identifier: "SortObject" }) as any as S.Schema<SortObject>;
export interface SolutionSort {
  SortOrder: SortOrder;
  SortBy: SolutionSortName;
}
export const SolutionSort = S.suspend(() =>
  S.Struct({ SortOrder: SortOrder, SortBy: SolutionSortName }),
).annotations({ identifier: "SolutionSort" }) as any as S.Schema<SolutionSort>;
export interface GetSellingSystemSettingsResponse {
  Catalog: string;
  ResourceSnapshotJobRoleArn?: string;
}
export const GetSellingSystemSettingsResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSellingSystemSettingsResponse",
}) as any as S.Schema<GetSellingSystemSettingsResponse>;
export interface ListTagsForResourceResponse {
  Tags: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutSellingSystemSettingsResponse {
  Catalog: string;
  ResourceSnapshotJobRoleArn?: string;
}
export const PutSellingSystemSettingsResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutSellingSystemSettingsResponse",
}) as any as S.Schema<PutSellingSystemSettingsResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
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
export interface CreateEngagementRequest {
  Catalog: string;
  ClientToken: string;
  Title: string;
  Description: string;
  Contexts?: EngagementContextDetails[];
}
export const CreateEngagementRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Title: S.String,
    Description: S.String,
    Contexts: S.optional(EngagementContexts),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementRequest",
}) as any as S.Schema<CreateEngagementRequest>;
export interface GetEngagementResponse {
  Id?: string;
  Arn?: string;
  Title?: string;
  Description?: string;
  CreatedAt?: Date;
  CreatedBy?: string | redacted.Redacted<string>;
  MemberCount?: number;
  ModifiedAt?: Date;
  ModifiedBy?: string | redacted.Redacted<string>;
  Contexts?: EngagementContextDetails[];
}
export const GetEngagementResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(SensitiveString),
    MemberCount: S.optional(S.Number),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedBy: S.optional(SensitiveString),
    Contexts: S.optional(EngagementContexts),
  }),
).annotations({
  identifier: "GetEngagementResponse",
}) as any as S.Schema<GetEngagementResponse>;
export interface ListEngagementsRequest {
  Catalog: string;
  CreatedBy?: string | redacted.Redacted<string>[];
  ExcludeCreatedBy?: string | redacted.Redacted<string>[];
  ContextTypes?: EngagementContextType[];
  ExcludeContextTypes?: EngagementContextType[];
  Sort?: EngagementSort;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: string[];
}
export const ListEngagementsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    CreatedBy: S.optional(AwsAccountList),
    ExcludeCreatedBy: S.optional(AwsAccountList),
    ContextTypes: S.optional(EngagementContextTypeList),
    ExcludeContextTypes: S.optional(EngagementContextTypeList),
    Sort: S.optional(EngagementSort),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagements" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementsRequest",
}) as any as S.Schema<ListEngagementsRequest>;
export interface StartEngagementByAcceptingInvitationTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementInvitationId?: string;
}
export const StartEngagementByAcceptingInvitationTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartEngagementByAcceptingInvitationTaskResponse",
}) as any as S.Schema<StartEngagementByAcceptingInvitationTaskResponse>;
export interface ListEngagementByAcceptingInvitationTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatus[];
  OpportunityIdentifier?: string[];
  EngagementInvitationIdentifier?: string[];
  TaskIdentifier?: string[];
}
export const ListEngagementByAcceptingInvitationTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementInvitationIdentifier: S.optional(EngagementInvitationIdentifiers),
    TaskIdentifier: S.optional(TaskIdentifiers),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ListEngagementByAcceptingInvitationTasks",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTasksRequest",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTasksRequest>;
export interface StartEngagementFromOpportunityTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  AwsSubmission: AwsSubmission;
  Tags?: Tag[];
}
export const StartEngagementFromOpportunityTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Identifier: S.String,
    AwsSubmission: AwsSubmission,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartEngagementFromOpportunityTask" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEngagementFromOpportunityTaskRequest",
}) as any as S.Schema<StartEngagementFromOpportunityTaskRequest>;
export interface ListEngagementInvitationsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: OpportunityEngagementInvitationSort;
  PayloadType?: EngagementInvitationPayloadType[];
  ParticipantType: ParticipantType;
  Status?: InvitationStatus[];
  EngagementIdentifier?: string[];
  SenderAwsAccountId?: string | redacted.Redacted<string>[];
}
export const ListEngagementInvitationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunityEngagementInvitationSort),
    PayloadType: S.optional(EngagementInvitationsPayloadType),
    ParticipantType: ParticipantType,
    Status: S.optional(InvitationStatusList),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    SenderAwsAccountId: S.optional(AwsAccountIdOrAliasList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementInvitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementInvitationsRequest",
}) as any as S.Schema<ListEngagementInvitationsRequest>;
export interface UpdateOpportunityResponse {
  Id: string;
  LastModifiedDate: Date;
}
export const UpdateOpportunityResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateOpportunityResponse",
}) as any as S.Schema<UpdateOpportunityResponse>;
export interface ListOpportunitiesRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: OpportunitySort;
  LastModifiedDate?: LastModifiedDate;
  Identifier?: string[];
  LifeCycleStage?: Stage[];
  LifeCycleReviewStatus?: ReviewStatus[];
  CustomerCompanyName?: string[];
}
export const ListOpportunitiesRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunitySort),
    LastModifiedDate: S.optional(LastModifiedDate),
    Identifier: S.optional(FilterIdentifier),
    LifeCycleStage: S.optional(FilterLifeCycleStage),
    LifeCycleReviewStatus: S.optional(FilterLifeCycleReviewStatus),
    CustomerCompanyName: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListOpportunities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpportunitiesRequest",
}) as any as S.Schema<ListOpportunitiesRequest>;
export interface AssignOpportunityRequest {
  Catalog: string;
  Identifier: string;
  Assignee: AssigneeContact;
}
export const AssignOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    Assignee: AssigneeContact,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssignOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssignOpportunityRequest",
}) as any as S.Schema<AssignOpportunityRequest>;
export interface AssignOpportunityResponse {}
export const AssignOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssignOpportunityResponse",
}) as any as S.Schema<AssignOpportunityResponse>;
export interface StartOpportunityFromEngagementTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  ContextId?: string;
}
export const StartOpportunityFromEngagementTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartOpportunityFromEngagementTaskResponse",
}) as any as S.Schema<StartOpportunityFromEngagementTaskResponse>;
export interface CreateResourceSnapshotResponse {
  Arn?: string;
  Revision?: number;
}
export const CreateResourceSnapshotResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Revision: S.optional(S.Number) }),
).annotations({
  identifier: "CreateResourceSnapshotResponse",
}) as any as S.Schema<CreateResourceSnapshotResponse>;
export interface CreateResourceSnapshotJobResponse {
  Id?: string;
  Arn?: string;
}
export const CreateResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateResourceSnapshotJobResponse",
}) as any as S.Schema<CreateResourceSnapshotJobResponse>;
export interface GetResourceSnapshotJobResponse {
  Catalog: string;
  Id?: string;
  Arn?: string;
  EngagementId?: string;
  ResourceType?: ResourceType;
  ResourceId?: string;
  ResourceArn?: string;
  ResourceSnapshotTemplateName?: string;
  CreatedAt?: Date;
  Status?: ResourceSnapshotJobStatus;
  LastSuccessfulExecutionDate?: Date;
  LastFailure?: string;
}
export const GetResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(ResourceSnapshotJobStatus),
    LastSuccessfulExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastFailure: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceSnapshotJobResponse",
}) as any as S.Schema<GetResourceSnapshotJobResponse>;
export interface ListResourceSnapshotJobsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: string;
  Status?: ResourceSnapshotJobStatus;
  Sort?: SortObject;
}
export const ListResourceSnapshotJobsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    Status: S.optional(ResourceSnapshotJobStatus),
    Sort: S.optional(SortObject),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceSnapshotJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSnapshotJobsRequest",
}) as any as S.Schema<ListResourceSnapshotJobsRequest>;
export interface ListSolutionsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: SolutionSort;
  Status?: SolutionStatus[];
  Identifier?: string[];
  Category?: string[];
}
export const ListSolutionsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(SolutionSort),
    Status: S.optional(FilterStatus),
    Identifier: S.optional(SolutionIdentifiers),
    Category: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListSolutions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolutionsRequest",
}) as any as S.Schema<ListSolutionsRequest>;
export interface UpdateLeadContext {
  QualificationStatus?: string;
  Customer: LeadCustomer;
  Interaction?: LeadInteraction;
}
export const UpdateLeadContext = S.suspend(() =>
  S.Struct({
    QualificationStatus: S.optional(S.String),
    Customer: LeadCustomer,
    Interaction: S.optional(LeadInteraction),
  }),
).annotations({
  identifier: "UpdateLeadContext",
}) as any as S.Schema<UpdateLeadContext>;
export type AwsMarketplaceOfferIdentifiers = string[];
export const AwsMarketplaceOfferIdentifiers = S.Array(S.String);
export type AwsMarketplaceOfferSetIdentifiers = string[];
export const AwsMarketplaceOfferSetIdentifiers = S.Array(S.String);
export type AwsProductIdentifiers = string[];
export const AwsProductIdentifiers = S.Array(S.String);
export type AwsClosedLostReason =
  | "Administrative"
  | "Business Associate Agreement"
  | "Company Acquired/Dissolved"
  | "Competitive Offering"
  | "Customer Data Requirement"
  | "Customer Deficiency"
  | "Customer Experience"
  | "Delay / Cancellation of Project"
  | "Duplicate"
  | "Duplicate Opportunity"
  | "Executive Blocker"
  | "Failed Vetting"
  | "Feature Limitation"
  | "Financial/Commercial"
  | "Insufficient Amazon Value"
  | "Insufficient AWS Value"
  | "International Constraints"
  | "Legal / Tax / Regulatory"
  | "Legal Terms and Conditions"
  | "Lost to Competitor"
  | "Lost to Competitor - Google"
  | "Lost to Competitor - Microsoft"
  | "Lost to Competitor - Other"
  | "Lost to Competitor - Rackspace"
  | "Lost to Competitor - SoftLayer"
  | "Lost to Competitor - VMWare"
  | "No Customer Reference"
  | "No Integration Resources"
  | "No Opportunity"
  | "No Perceived Value of MP"
  | "No Response"
  | "Not Committed to AWS"
  | "No Update"
  | "On Premises Deployment"
  | "Other"
  | "Other (Details in Description)"
  | "Partner Gap"
  | "Past Due"
  | "People/Relationship/Governance"
  | "Platform Technology Limitation"
  | "Preference for Competitor"
  | "Price"
  | "Product/Technology"
  | "Product Not on AWS"
  | "Security / Compliance"
  | "Self-Service"
  | "Technical Limitations"
  | "Term Sheet Impasse";
export const AwsClosedLostReason = S.Literal(
  "Administrative",
  "Business Associate Agreement",
  "Company Acquired/Dissolved",
  "Competitive Offering",
  "Customer Data Requirement",
  "Customer Deficiency",
  "Customer Experience",
  "Delay / Cancellation of Project",
  "Duplicate",
  "Duplicate Opportunity",
  "Executive Blocker",
  "Failed Vetting",
  "Feature Limitation",
  "Financial/Commercial",
  "Insufficient Amazon Value",
  "Insufficient AWS Value",
  "International Constraints",
  "Legal / Tax / Regulatory",
  "Legal Terms and Conditions",
  "Lost to Competitor",
  "Lost to Competitor - Google",
  "Lost to Competitor - Microsoft",
  "Lost to Competitor - Other",
  "Lost to Competitor - Rackspace",
  "Lost to Competitor - SoftLayer",
  "Lost to Competitor - VMWare",
  "No Customer Reference",
  "No Integration Resources",
  "No Opportunity",
  "No Perceived Value of MP",
  "No Response",
  "Not Committed to AWS",
  "No Update",
  "On Premises Deployment",
  "Other",
  "Other (Details in Description)",
  "Partner Gap",
  "Past Due",
  "People/Relationship/Governance",
  "Platform Technology Limitation",
  "Preference for Competitor",
  "Price",
  "Product/Technology",
  "Product Not on AWS",
  "Security / Compliance",
  "Self-Service",
  "Technical Limitations",
  "Term Sheet Impasse",
);
export type AwsOpportunityStage =
  | "Not Started"
  | "In Progress"
  | "Prospect"
  | "Engaged"
  | "Identified"
  | "Qualify"
  | "Research"
  | "Seller Engaged"
  | "Evaluating"
  | "Seller Registered"
  | "Term Sheet Negotiation"
  | "Contract Negotiation"
  | "Onboarding"
  | "Building Integration"
  | "Qualified"
  | "On-hold"
  | "Technical Validation"
  | "Business Validation"
  | "Committed"
  | "Launched"
  | "Deferred to Partner"
  | "Closed Lost"
  | "Completed"
  | "Closed Incomplete";
export const AwsOpportunityStage = S.Literal(
  "Not Started",
  "In Progress",
  "Prospect",
  "Engaged",
  "Identified",
  "Qualify",
  "Research",
  "Seller Engaged",
  "Evaluating",
  "Seller Registered",
  "Term Sheet Negotiation",
  "Contract Negotiation",
  "Onboarding",
  "Building Integration",
  "Qualified",
  "On-hold",
  "Technical Validation",
  "Business Validation",
  "Committed",
  "Launched",
  "Deferred to Partner",
  "Closed Lost",
  "Completed",
  "Closed Incomplete",
);
export type AwsMemberBusinessTitle =
  | "AWSSalesRep"
  | "AWSAccountOwner"
  | "WWPSPDM"
  | "PDM"
  | "PSM"
  | "ISVSM";
export const AwsMemberBusinessTitle = S.Literal(
  "AWSSalesRep",
  "AWSAccountOwner",
  "WWPSPDM",
  "PDM",
  "PSM",
  "ISVSM",
);
export type EngagementScore = "High" | "Medium" | "Low";
export const EngagementScore = S.Literal("High", "Medium", "Low");
export type ReceiverResponsibility =
  | "Distributor"
  | "Reseller"
  | "Hardware Partner"
  | "Managed Service Provider"
  | "Software Partner"
  | "Services Partner"
  | "Training Partner"
  | "Co-Sell Facilitator"
  | "Facilitator";
export const ReceiverResponsibility = S.Literal(
  "Distributor",
  "Reseller",
  "Hardware Partner",
  "Managed Service Provider",
  "Software Partner",
  "Services Partner",
  "Training Partner",
  "Co-Sell Facilitator",
  "Facilitator",
);
export type ReceiverResponsibilityList = ReceiverResponsibility[];
export const ReceiverResponsibilityList = S.Array(ReceiverResponsibility);
export type UpdateEngagementContextPayload =
  | { Lead: UpdateLeadContext }
  | { CustomerProject: CustomerProjectsContext };
export const UpdateEngagementContextPayload = S.Union(
  S.Struct({ Lead: UpdateLeadContext }),
  S.Struct({ CustomerProject: CustomerProjectsContext }),
);
export interface EngagementMember {
  CompanyName?: string | redacted.Redacted<string>;
  WebsiteUrl?: string;
  AccountId?: string | redacted.Redacted<string>;
}
export const EngagementMember = S.suspend(() =>
  S.Struct({
    CompanyName: S.optional(SensitiveString),
    WebsiteUrl: S.optional(S.String),
    AccountId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EngagementMember",
}) as any as S.Schema<EngagementMember>;
export type EngagementMembers = EngagementMember[];
export const EngagementMembers = S.Array(EngagementMember);
export interface ListEngagementFromOpportunityTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  EngagementInvitationId?: string;
}
export const ListEngagementFromOpportunityTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementFromOpportunityTaskSummary",
}) as any as S.Schema<ListEngagementFromOpportunityTaskSummary>;
export type ListEngagementFromOpportunityTaskSummaries =
  ListEngagementFromOpportunityTaskSummary[];
export const ListEngagementFromOpportunityTaskSummaries = S.Array(
  ListEngagementFromOpportunityTaskSummary,
);
export interface EngagementMemberSummary {
  CompanyName?: string | redacted.Redacted<string>;
  WebsiteUrl?: string;
}
export const EngagementMemberSummary = S.suspend(() =>
  S.Struct({
    CompanyName: S.optional(SensitiveString),
    WebsiteUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "EngagementMemberSummary",
}) as any as S.Schema<EngagementMemberSummary>;
export type EngagementMemberSummaries = EngagementMemberSummary[];
export const EngagementMemberSummaries = S.Array(EngagementMemberSummary);
export interface RelatedEntityIdentifiers {
  AwsMarketplaceOffers?: string[];
  AwsMarketplaceOfferSets?: string[];
  Solutions?: string[];
  AwsProducts?: string[];
}
export const RelatedEntityIdentifiers = S.suspend(() =>
  S.Struct({
    AwsMarketplaceOffers: S.optional(AwsMarketplaceOfferIdentifiers),
    AwsMarketplaceOfferSets: S.optional(AwsMarketplaceOfferSetIdentifiers),
    Solutions: S.optional(SolutionIdentifiers),
    AwsProducts: S.optional(AwsProductIdentifiers),
  }),
).annotations({
  identifier: "RelatedEntityIdentifiers",
}) as any as S.Schema<RelatedEntityIdentifiers>;
export interface AwsTeamMember {
  Email?: string | redacted.Redacted<string>;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  BusinessTitle?: AwsMemberBusinessTitle;
}
export const AwsTeamMember = S.suspend(() =>
  S.Struct({
    Email: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(AwsMemberBusinessTitle),
  }),
).annotations({
  identifier: "AwsTeamMember",
}) as any as S.Schema<AwsTeamMember>;
export type AwsOpportunityTeamMembersList = AwsTeamMember[];
export const AwsOpportunityTeamMembersList = S.Array(AwsTeamMember);
export interface AwsOpportunityRelatedEntities {
  AwsProducts?: string[];
  Solutions?: string[];
}
export const AwsOpportunityRelatedEntities = S.suspend(() =>
  S.Struct({
    AwsProducts: S.optional(AwsProductIdentifiers),
    Solutions: S.optional(SolutionIdentifiers),
  }),
).annotations({
  identifier: "AwsOpportunityRelatedEntities",
}) as any as S.Schema<AwsOpportunityRelatedEntities>;
export interface AwsOpportunityCustomer {
  Contacts?: Contact[];
}
export const AwsOpportunityCustomer = S.suspend(() =>
  S.Struct({ Contacts: S.optional(CustomerContactsList) }),
).annotations({
  identifier: "AwsOpportunityCustomer",
}) as any as S.Schema<AwsOpportunityCustomer>;
export interface AwsOpportunityProject {
  ExpectedCustomerSpend?: ExpectedCustomerSpend[];
  AwsPartition?: AwsPartition;
}
export const AwsOpportunityProject = S.suspend(() =>
  S.Struct({
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    AwsPartition: S.optional(AwsPartition),
  }),
).annotations({
  identifier: "AwsOpportunityProject",
}) as any as S.Schema<AwsOpportunityProject>;
export interface ListOpportunityFromEngagementTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  ContextId?: string;
}
export const ListOpportunityFromEngagementTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunityFromEngagementTaskSummary",
}) as any as S.Schema<ListOpportunityFromEngagementTaskSummary>;
export type ListOpportunityFromEngagementTaskSummaries =
  ListOpportunityFromEngagementTaskSummary[];
export const ListOpportunityFromEngagementTaskSummaries = S.Array(
  ListOpportunityFromEngagementTaskSummary,
);
export interface EngagementResourceAssociationSummary {
  Catalog: string;
  EngagementId?: string;
  ResourceType?: ResourceType;
  ResourceId?: string;
  CreatedBy?: string | redacted.Redacted<string>;
}
export const EngagementResourceAssociationSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceId: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EngagementResourceAssociationSummary",
}) as any as S.Schema<EngagementResourceAssociationSummary>;
export type EngagementResourceAssociationSummaryList =
  EngagementResourceAssociationSummary[];
export const EngagementResourceAssociationSummaryList = S.Array(
  EngagementResourceAssociationSummary,
);
export interface ResourceSnapshotSummary {
  Arn?: string;
  Revision?: number;
  ResourceType?: ResourceType;
  ResourceId?: string;
  ResourceSnapshotTemplateName?: string;
  CreatedBy?: string | redacted.Redacted<string>;
}
export const ResourceSnapshotSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Revision: S.optional(S.Number),
    ResourceType: S.optional(ResourceType),
    ResourceId: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ResourceSnapshotSummary",
}) as any as S.Schema<ResourceSnapshotSummary>;
export type ResourceSnapshotSummaryList = ResourceSnapshotSummary[];
export const ResourceSnapshotSummaryList = S.Array(ResourceSnapshotSummary);
export interface AccountReceiver {
  Alias?: string | redacted.Redacted<string>;
  AwsAccountId: string | redacted.Redacted<string>;
}
export const AccountReceiver = S.suspend(() =>
  S.Struct({
    Alias: S.optional(SensitiveString),
    AwsAccountId: SensitiveString,
  }),
).annotations({
  identifier: "AccountReceiver",
}) as any as S.Schema<AccountReceiver>;
export interface UpdateEngagementContextRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ContextIdentifier: string;
  EngagementLastModifiedAt: Date;
  Type: EngagementContextType;
  Payload: UpdateEngagementContextPayload;
}
export const UpdateEngagementContextRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ContextIdentifier: S.String,
    EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Type: EngagementContextType,
    Payload: UpdateEngagementContextPayload,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateEngagementContext" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEngagementContextRequest",
}) as any as S.Schema<UpdateEngagementContextRequest>;
export interface CreateEngagementResponse {
  Id?: string;
  Arn?: string;
  ModifiedAt?: Date;
}
export const CreateEngagementResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateEngagementResponse",
}) as any as S.Schema<CreateEngagementResponse>;
export interface ListEngagementMembersResponse {
  EngagementMemberList: EngagementMember[];
  NextToken?: string;
}
export const ListEngagementMembersResponse = S.suspend(() =>
  S.Struct({
    EngagementMemberList: EngagementMembers,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementMembersResponse",
}) as any as S.Schema<ListEngagementMembersResponse>;
export interface StartEngagementFromOpportunityTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  EngagementInvitationId?: string;
}
export const StartEngagementFromOpportunityTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartEngagementFromOpportunityTaskResponse",
}) as any as S.Schema<StartEngagementFromOpportunityTaskResponse>;
export interface ListEngagementFromOpportunityTasksResponse {
  TaskSummaries?: ListEngagementFromOpportunityTaskSummary[];
  NextToken?: string;
}
export const ListEngagementFromOpportunityTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListEngagementFromOpportunityTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementFromOpportunityTasksResponse",
}) as any as S.Schema<ListEngagementFromOpportunityTasksResponse>;
export type Receiver = { Account: AccountReceiver };
export const Receiver = S.Union(S.Struct({ Account: AccountReceiver }));
export interface SenderContact {
  Email: string | redacted.Redacted<string>;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  BusinessTitle?: string | redacted.Redacted<string>;
  Phone?: string | redacted.Redacted<string>;
}
export const SenderContact = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(SensitiveString),
    Phone: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SenderContact",
}) as any as S.Schema<SenderContact>;
export type SenderContactList = SenderContact[];
export const SenderContactList = S.Array(SenderContact);
export interface ProjectDetails {
  BusinessProblem: string | redacted.Redacted<string>;
  Title: string;
  TargetCompletionDate: string;
  ExpectedCustomerSpend: ExpectedCustomerSpend[];
}
export const ProjectDetails = S.suspend(() =>
  S.Struct({
    BusinessProblem: SensitiveString,
    Title: S.String,
    TargetCompletionDate: S.String,
    ExpectedCustomerSpend: ExpectedCustomerSpendList,
  }),
).annotations({
  identifier: "ProjectDetails",
}) as any as S.Schema<ProjectDetails>;
export interface OpportunityInvitationPayload {
  SenderContacts?: SenderContact[];
  ReceiverResponsibilities: ReceiverResponsibility[];
  Customer: EngagementCustomer;
  Project: ProjectDetails;
}
export const OpportunityInvitationPayload = S.suspend(() =>
  S.Struct({
    SenderContacts: S.optional(SenderContactList),
    ReceiverResponsibilities: ReceiverResponsibilityList,
    Customer: EngagementCustomer,
    Project: ProjectDetails,
  }),
).annotations({
  identifier: "OpportunityInvitationPayload",
}) as any as S.Schema<OpportunityInvitationPayload>;
export interface LeadInvitationCustomer {
  Industry?: Industry;
  CompanyName: string | redacted.Redacted<string>;
  WebsiteUrl?: string | redacted.Redacted<string>;
  CountryCode: CountryCode;
  AwsMaturity?: string;
  MarketSegment?: MarketSegment;
}
export const LeadInvitationCustomer = S.suspend(() =>
  S.Struct({
    Industry: S.optional(Industry),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    CountryCode: CountryCode,
    AwsMaturity: S.optional(S.String),
    MarketSegment: S.optional(MarketSegment),
  }),
).annotations({
  identifier: "LeadInvitationCustomer",
}) as any as S.Schema<LeadInvitationCustomer>;
export interface LeadInvitationInteraction {
  SourceType: string;
  SourceId: string;
  SourceName: string;
  Usecase?: string;
  ContactBusinessTitle: string | redacted.Redacted<string>;
}
export const LeadInvitationInteraction = S.suspend(() =>
  S.Struct({
    SourceType: S.String,
    SourceId: S.String,
    SourceName: S.String,
    Usecase: S.optional(S.String),
    ContactBusinessTitle: SensitiveString,
  }),
).annotations({
  identifier: "LeadInvitationInteraction",
}) as any as S.Schema<LeadInvitationInteraction>;
export interface LeadInvitationPayload {
  Customer: LeadInvitationCustomer;
  Interaction: LeadInvitationInteraction;
}
export const LeadInvitationPayload = S.suspend(() =>
  S.Struct({
    Customer: LeadInvitationCustomer,
    Interaction: LeadInvitationInteraction,
  }),
).annotations({
  identifier: "LeadInvitationPayload",
}) as any as S.Schema<LeadInvitationPayload>;
export type Payload =
  | { OpportunityInvitation: OpportunityInvitationPayload }
  | { LeadInvitation: LeadInvitationPayload };
export const Payload = S.Union(
  S.Struct({ OpportunityInvitation: OpportunityInvitationPayload }),
  S.Struct({ LeadInvitation: LeadInvitationPayload }),
);
export interface GetEngagementInvitationResponse {
  Arn?: string;
  PayloadType?: EngagementInvitationPayloadType;
  Id: string;
  EngagementId?: string;
  EngagementTitle?: string;
  Status?: InvitationStatus;
  InvitationDate?: Date;
  ExpirationDate?: Date;
  SenderAwsAccountId?: string | redacted.Redacted<string>;
  SenderCompanyName?: string;
  Receiver?: Receiver;
  Catalog: string;
  RejectionReason?: string;
  Payload?: Payload;
  InvitationMessage?: string | redacted.Redacted<string>;
  EngagementDescription?: string;
  ExistingMembers?: EngagementMemberSummary[];
}
export const GetEngagementInvitationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    PayloadType: S.optional(EngagementInvitationPayloadType),
    Id: S.String,
    EngagementId: S.optional(S.String),
    EngagementTitle: S.optional(S.String),
    Status: S.optional(InvitationStatus),
    InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SenderAwsAccountId: S.optional(SensitiveString),
    SenderCompanyName: S.optional(S.String),
    Receiver: S.optional(Receiver),
    Catalog: S.String,
    RejectionReason: S.optional(S.String),
    Payload: S.optional(Payload),
    InvitationMessage: S.optional(SensitiveString),
    EngagementDescription: S.optional(S.String),
    ExistingMembers: S.optional(EngagementMemberSummaries),
  }),
).annotations({
  identifier: "GetEngagementInvitationResponse",
}) as any as S.Schema<GetEngagementInvitationResponse>;
export interface GetOpportunityResponse {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedFromAws[];
  NationalSecurity?: NationalSecurity;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: OpportunityType;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  Id: string;
  Arn?: string;
  LastModifiedDate: Date;
  CreatedDate: Date;
  RelatedEntityIdentifiers: RelatedEntityIdentifiers;
  LifeCycle?: LifeCycle;
  OpportunityTeam?: Contact[];
}
export const GetOpportunityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(NationalSecurity),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(OpportunityType),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    Id: S.String,
    Arn: S.optional(S.String),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    CreatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    RelatedEntityIdentifiers: RelatedEntityIdentifiers,
    LifeCycle: S.optional(LifeCycle),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
  }),
).annotations({
  identifier: "GetOpportunityResponse",
}) as any as S.Schema<GetOpportunityResponse>;
export interface ListOpportunityFromEngagementTasksResponse {
  TaskSummaries?: ListOpportunityFromEngagementTaskSummary[];
  NextToken?: string;
}
export const ListOpportunityFromEngagementTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListOpportunityFromEngagementTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunityFromEngagementTasksResponse",
}) as any as S.Schema<ListOpportunityFromEngagementTasksResponse>;
export interface ListEngagementResourceAssociationsResponse {
  EngagementResourceAssociationSummaries: EngagementResourceAssociationSummary[];
  NextToken?: string;
}
export const ListEngagementResourceAssociationsResponse = S.suspend(() =>
  S.Struct({
    EngagementResourceAssociationSummaries:
      EngagementResourceAssociationSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementResourceAssociationsResponse",
}) as any as S.Schema<ListEngagementResourceAssociationsResponse>;
export interface ListResourceSnapshotsResponse {
  ResourceSnapshotSummaries: ResourceSnapshotSummary[];
  NextToken?: string;
}
export const ListResourceSnapshotsResponse = S.suspend(() =>
  S.Struct({
    ResourceSnapshotSummaries: ResourceSnapshotSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSnapshotsResponse",
}) as any as S.Schema<ListResourceSnapshotsResponse>;
export interface ProfileNextStepsHistory {
  Value: string;
  Time: Date;
}
export const ProfileNextStepsHistory = S.suspend(() =>
  S.Struct({
    Value: S.String,
    Time: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ProfileNextStepsHistory",
}) as any as S.Schema<ProfileNextStepsHistory>;
export type ProfileNextStepsHistories = ProfileNextStepsHistory[];
export const ProfileNextStepsHistories = S.Array(ProfileNextStepsHistory);
export interface EngagementSummary {
  Arn?: string;
  Id?: string;
  Title?: string;
  CreatedAt?: Date;
  CreatedBy?: string | redacted.Redacted<string>;
  MemberCount?: number;
  ModifiedAt?: Date;
  ModifiedBy?: string | redacted.Redacted<string>;
  ContextTypes?: EngagementContextType[];
}
export const EngagementSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(SensitiveString),
    MemberCount: S.optional(S.Number),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedBy: S.optional(SensitiveString),
    ContextTypes: S.optional(EngagementContextTypeList),
  }),
).annotations({
  identifier: "EngagementSummary",
}) as any as S.Schema<EngagementSummary>;
export type EngagementSummaryList = EngagementSummary[];
export const EngagementSummaryList = S.Array(EngagementSummary);
export interface ListEngagementByAcceptingInvitationTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: TaskStatus;
  Message?: string;
  ReasonCode?: ReasonCode;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementInvitationId?: string;
}
export const ListEngagementByAcceptingInvitationTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(TaskStatus),
    Message: S.optional(S.String),
    ReasonCode: S.optional(ReasonCode),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTaskSummary",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTaskSummary>;
export type ListEngagementByAcceptingInvitationTaskSummaries =
  ListEngagementByAcceptingInvitationTaskSummary[];
export const ListEngagementByAcceptingInvitationTaskSummaries = S.Array(
  ListEngagementByAcceptingInvitationTaskSummary,
);
export interface EngagementInvitationSummary {
  Arn?: string;
  PayloadType?: EngagementInvitationPayloadType;
  Id: string;
  EngagementId?: string;
  EngagementTitle?: string;
  Status?: InvitationStatus;
  InvitationDate?: Date;
  ExpirationDate?: Date;
  SenderAwsAccountId?: string | redacted.Redacted<string>;
  SenderCompanyName?: string;
  Receiver?: Receiver;
  Catalog: string;
  ParticipantType?: ParticipantType;
}
export const EngagementInvitationSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    PayloadType: S.optional(EngagementInvitationPayloadType),
    Id: S.String,
    EngagementId: S.optional(S.String),
    EngagementTitle: S.optional(S.String),
    Status: S.optional(InvitationStatus),
    InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SenderAwsAccountId: S.optional(SensitiveString),
    SenderCompanyName: S.optional(S.String),
    Receiver: S.optional(Receiver),
    Catalog: S.String,
    ParticipantType: S.optional(ParticipantType),
  }),
).annotations({
  identifier: "EngagementInvitationSummary",
}) as any as S.Schema<EngagementInvitationSummary>;
export type EngagementInvitationSummaries = EngagementInvitationSummary[];
export const EngagementInvitationSummaries = S.Array(
  EngagementInvitationSummary,
);
export interface AwsOpportunityLifeCycle {
  TargetCloseDate?: string;
  ClosedLostReason?: AwsClosedLostReason;
  Stage?: AwsOpportunityStage;
  NextSteps?: string | redacted.Redacted<string>;
  NextStepsHistory?: ProfileNextStepsHistory[];
}
export const AwsOpportunityLifeCycle = S.suspend(() =>
  S.Struct({
    TargetCloseDate: S.optional(S.String),
    ClosedLostReason: S.optional(AwsClosedLostReason),
    Stage: S.optional(AwsOpportunityStage),
    NextSteps: S.optional(SensitiveString),
    NextStepsHistory: S.optional(ProfileNextStepsHistories),
  }),
).annotations({
  identifier: "AwsOpportunityLifeCycle",
}) as any as S.Schema<AwsOpportunityLifeCycle>;
export interface ResourceSnapshotJobSummary {
  Id?: string;
  Arn?: string;
  EngagementId?: string;
  Status?: ResourceSnapshotJobStatus;
}
export const ResourceSnapshotJobSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    EngagementId: S.optional(S.String),
    Status: S.optional(ResourceSnapshotJobStatus),
  }),
).annotations({
  identifier: "ResourceSnapshotJobSummary",
}) as any as S.Schema<ResourceSnapshotJobSummary>;
export type ResourceSnapshotJobSummaryList = ResourceSnapshotJobSummary[];
export const ResourceSnapshotJobSummaryList = S.Array(
  ResourceSnapshotJobSummary,
);
export interface SolutionBase {
  Catalog: string;
  Id: string;
  Arn?: string;
  Name: string;
  Status: SolutionStatus;
  Category: string;
  CreatedDate: Date;
}
export const SolutionBase = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.optional(S.String),
    Name: S.String,
    Status: SolutionStatus,
    Category: S.String,
    CreatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "SolutionBase" }) as any as S.Schema<SolutionBase>;
export type SolutionList = SolutionBase[];
export const SolutionList = S.Array(SolutionBase);
export interface LifeCycleForView {
  TargetCloseDate?: string;
  ReviewStatus?: ReviewStatus;
  Stage?: Stage;
  NextSteps?: string | redacted.Redacted<string>;
}
export const LifeCycleForView = S.suspend(() =>
  S.Struct({
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(ReviewStatus),
    Stage: S.optional(Stage),
    NextSteps: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "LifeCycleForView",
}) as any as S.Schema<LifeCycleForView>;
export interface ProjectView {
  DeliveryModels?: DeliveryModel[];
  ExpectedCustomerSpend?: ExpectedCustomerSpend[];
  CustomerUseCase?: string;
  SalesActivities?: SalesActivity[];
  OtherSolutionDescription?: string | redacted.Redacted<string>;
}
export const ProjectView = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    CustomerUseCase: S.optional(S.String),
    SalesActivities: S.optional(SalesActivities),
    OtherSolutionDescription: S.optional(SensitiveString),
  }),
).annotations({ identifier: "ProjectView" }) as any as S.Schema<ProjectView>;
export interface UpdateEngagementContextResponse {
  EngagementId: string;
  EngagementArn: string;
  EngagementLastModifiedAt: Date;
  ContextId: string;
}
export const UpdateEngagementContextResponse = S.suspend(() =>
  S.Struct({
    EngagementId: S.String,
    EngagementArn: S.String,
    EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ContextId: S.String,
  }),
).annotations({
  identifier: "UpdateEngagementContextResponse",
}) as any as S.Schema<UpdateEngagementContextResponse>;
export interface ListEngagementsResponse {
  EngagementSummaryList: EngagementSummary[];
  NextToken?: string;
}
export const ListEngagementsResponse = S.suspend(() =>
  S.Struct({
    EngagementSummaryList: EngagementSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementsResponse",
}) as any as S.Schema<ListEngagementsResponse>;
export interface ListEngagementByAcceptingInvitationTasksResponse {
  TaskSummaries?: ListEngagementByAcceptingInvitationTaskSummary[];
  NextToken?: string;
}
export const ListEngagementByAcceptingInvitationTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListEngagementByAcceptingInvitationTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTasksResponse",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTasksResponse>;
export interface ListEngagementInvitationsResponse {
  EngagementInvitationSummaries?: EngagementInvitationSummary[];
  NextToken?: string;
}
export const ListEngagementInvitationsResponse = S.suspend(() =>
  S.Struct({
    EngagementInvitationSummaries: S.optional(EngagementInvitationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementInvitationsResponse",
}) as any as S.Schema<ListEngagementInvitationsResponse>;
export interface CreateOpportunityRequest {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedFromAws[];
  NationalSecurity?: NationalSecurity;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: OpportunityType;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  ClientToken: string;
  LifeCycle?: LifeCycle;
  Origin?: OpportunityOrigin;
  OpportunityTeam?: Contact[];
  Tags?: Tag[];
}
export const CreateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(NationalSecurity),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(OpportunityType),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    LifeCycle: S.optional(LifeCycle),
    Origin: S.optional(OpportunityOrigin),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOpportunityRequest",
}) as any as S.Schema<CreateOpportunityRequest>;
export interface ListResourceSnapshotJobsResponse {
  ResourceSnapshotJobSummaries: ResourceSnapshotJobSummary[];
  NextToken?: string;
}
export const ListResourceSnapshotJobsResponse = S.suspend(() =>
  S.Struct({
    ResourceSnapshotJobSummaries: ResourceSnapshotJobSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSnapshotJobsResponse",
}) as any as S.Schema<ListResourceSnapshotJobsResponse>;
export interface ListSolutionsResponse {
  SolutionSummaries: SolutionBase[];
  NextToken?: string;
}
export const ListSolutionsResponse = S.suspend(() =>
  S.Struct({
    SolutionSummaries: SolutionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSolutionsResponse",
}) as any as S.Schema<ListSolutionsResponse>;
export interface LifeCycleSummary {
  Stage?: Stage;
  ClosedLostReason?: ClosedLostReason;
  NextSteps?: string | redacted.Redacted<string>;
  TargetCloseDate?: string;
  ReviewStatus?: ReviewStatus;
  ReviewComments?: string;
  ReviewStatusReason?: string;
}
export const LifeCycleSummary = S.suspend(() =>
  S.Struct({
    Stage: S.optional(Stage),
    ClosedLostReason: S.optional(ClosedLostReason),
    NextSteps: S.optional(SensitiveString),
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(ReviewStatus),
    ReviewComments: S.optional(S.String),
    ReviewStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "LifeCycleSummary",
}) as any as S.Schema<LifeCycleSummary>;
export interface ProjectSummary {
  DeliveryModels?: DeliveryModel[];
  ExpectedCustomerSpend?: ExpectedCustomerSpend[];
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export interface OpportunitySummaryView {
  OpportunityType?: OpportunityType;
  Lifecycle?: LifeCycleForView;
  OpportunityTeam?: Contact[];
  PrimaryNeedsFromAws?: PrimaryNeedFromAws[];
  Customer?: Customer;
  Project?: ProjectView;
  RelatedEntityIdentifiers?: RelatedEntityIdentifiers;
}
export const OpportunitySummaryView = S.suspend(() =>
  S.Struct({
    OpportunityType: S.optional(OpportunityType),
    Lifecycle: S.optional(LifeCycleForView),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    Customer: S.optional(Customer),
    Project: S.optional(ProjectView),
    RelatedEntityIdentifiers: S.optional(RelatedEntityIdentifiers),
  }),
).annotations({
  identifier: "OpportunitySummaryView",
}) as any as S.Schema<OpportunitySummaryView>;
export type AmountMap = { [key: string]: string | redacted.Redacted<string> };
export const AmountMap = S.Record({ key: S.String, value: SensitiveString });
export interface Invitation {
  Message: string | redacted.Redacted<string>;
  Receiver: Receiver;
  Payload: Payload;
}
export const Invitation = S.suspend(() =>
  S.Struct({ Message: SensitiveString, Receiver: Receiver, Payload: Payload }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export type ResourceSnapshotPayload = {
  OpportunitySummary: OpportunitySummaryView;
};
export const ResourceSnapshotPayload = S.Union(
  S.Struct({ OpportunitySummary: OpportunitySummaryView }),
);
export interface AccountSummary {
  Industry?: Industry;
  OtherIndustry?: string;
  CompanyName: string | redacted.Redacted<string>;
  WebsiteUrl?: string | redacted.Redacted<string>;
  Address?: AddressSummary;
}
export const AccountSummary = S.suspend(() =>
  S.Struct({
    Industry: S.optional(Industry),
    OtherIndustry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    Address: S.optional(AddressSummary),
  }),
).annotations({
  identifier: "AccountSummary",
}) as any as S.Schema<AccountSummary>;
export interface CreateEngagementContextRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ClientToken: string;
  Type: EngagementContextType;
  Payload: EngagementContextPayload;
}
export const CreateEngagementContextRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Type: EngagementContextType,
    Payload: EngagementContextPayload,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagementContext" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementContextRequest",
}) as any as S.Schema<CreateEngagementContextRequest>;
export interface CreateEngagementInvitationRequest {
  Catalog: string;
  ClientToken: string;
  EngagementIdentifier: string;
  Invitation: Invitation;
}
export const CreateEngagementInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    EngagementIdentifier: S.String,
    Invitation: Invitation,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementInvitationRequest",
}) as any as S.Schema<CreateEngagementInvitationRequest>;
export interface CreateOpportunityResponse {
  Id: string;
  PartnerOpportunityIdentifier?: string;
  LastModifiedDate?: Date;
}
export const CreateOpportunityResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    PartnerOpportunityIdentifier: S.optional(S.String),
    LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateOpportunityResponse",
}) as any as S.Schema<CreateOpportunityResponse>;
export interface AwsProductOptimization {
  Description: string;
  SavingsAmount: string | redacted.Redacted<string>;
}
export const AwsProductOptimization = S.suspend(() =>
  S.Struct({ Description: S.String, SavingsAmount: SensitiveString }),
).annotations({
  identifier: "AwsProductOptimization",
}) as any as S.Schema<AwsProductOptimization>;
export type AwsProductOptimizationsList = AwsProductOptimization[];
export const AwsProductOptimizationsList = S.Array(AwsProductOptimization);
export interface GetResourceSnapshotResponse {
  Catalog: string;
  Arn?: string;
  CreatedBy?: string | redacted.Redacted<string>;
  CreatedAt?: Date;
  EngagementId?: string;
  ResourceType?: ResourceType;
  ResourceId?: string;
  ResourceSnapshotTemplateName?: string;
  Revision?: number;
  Payload?: ResourceSnapshotPayload;
}
export const GetResourceSnapshotResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(ResourceType),
    ResourceId: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    Revision: S.optional(S.Number),
    Payload: S.optional(ResourceSnapshotPayload),
  }),
).annotations({
  identifier: "GetResourceSnapshotResponse",
}) as any as S.Schema<GetResourceSnapshotResponse>;
export interface CustomerSummary {
  Account?: AccountSummary;
}
export const CustomerSummary = S.suspend(() =>
  S.Struct({ Account: S.optional(AccountSummary) }),
).annotations({
  identifier: "CustomerSummary",
}) as any as S.Schema<CustomerSummary>;
export interface AwsProductDetails {
  ProductCode: string;
  ServiceCode?: string;
  Categories: string[];
  Amount?: string | redacted.Redacted<string>;
  OptimizedAmount?: string | redacted.Redacted<string>;
  PotentialSavingsAmount?: string | redacted.Redacted<string>;
  Optimizations: AwsProductOptimization[];
}
export const AwsProductDetails = S.suspend(() =>
  S.Struct({
    ProductCode: S.String,
    ServiceCode: S.optional(S.String),
    Categories: StringList,
    Amount: S.optional(SensitiveString),
    OptimizedAmount: S.optional(SensitiveString),
    PotentialSavingsAmount: S.optional(SensitiveString),
    Optimizations: AwsProductOptimizationsList,
  }),
).annotations({
  identifier: "AwsProductDetails",
}) as any as S.Schema<AwsProductDetails>;
export type AwsProductsList = AwsProductDetails[];
export const AwsProductsList = S.Array(AwsProductDetails);
export type ValidationExceptionReason =
  | "REQUEST_VALIDATION_FAILED"
  | "BUSINESS_VALIDATION_FAILED";
export const ValidationExceptionReason = S.Literal(
  "REQUEST_VALIDATION_FAILED",
  "BUSINESS_VALIDATION_FAILED",
);
export interface OpportunitySummary {
  Catalog: string;
  Id?: string;
  Arn?: string;
  PartnerOpportunityIdentifier?: string;
  OpportunityType?: OpportunityType;
  LastModifiedDate?: Date;
  CreatedDate?: Date;
  LifeCycle?: LifeCycleSummary;
  Customer?: CustomerSummary;
  Project?: ProjectSummary;
}
export const OpportunitySummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    PartnerOpportunityIdentifier: S.optional(S.String),
    OpportunityType: S.optional(OpportunityType),
    LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LifeCycle: S.optional(LifeCycleSummary),
    Customer: S.optional(CustomerSummary),
    Project: S.optional(ProjectSummary),
  }),
).annotations({
  identifier: "OpportunitySummary",
}) as any as S.Schema<OpportunitySummary>;
export type OpportunitySummaries = OpportunitySummary[];
export const OpportunitySummaries = S.Array(OpportunitySummary);
export interface AwsProductInsights {
  CurrencyCode: CurrencyCode;
  Frequency: PaymentFrequency;
  TotalAmount?: string | redacted.Redacted<string>;
  TotalOptimizedAmount?: string | redacted.Redacted<string>;
  TotalPotentialSavingsAmount?: string | redacted.Redacted<string>;
  TotalAmountByCategory: { [key: string]: string | redacted.Redacted<string> };
  AwsProducts: AwsProductDetails[];
}
export const AwsProductInsights = S.suspend(() =>
  S.Struct({
    CurrencyCode: CurrencyCode,
    Frequency: PaymentFrequency,
    TotalAmount: S.optional(SensitiveString),
    TotalOptimizedAmount: S.optional(SensitiveString),
    TotalPotentialSavingsAmount: S.optional(SensitiveString),
    TotalAmountByCategory: AmountMap,
    AwsProducts: AwsProductsList,
  }),
).annotations({
  identifier: "AwsProductInsights",
}) as any as S.Schema<AwsProductInsights>;
export interface CreateEngagementContextResponse {
  EngagementId?: string;
  EngagementArn?: string;
  EngagementLastModifiedAt?: Date;
  ContextId?: string;
}
export const CreateEngagementContextResponse = S.suspend(() =>
  S.Struct({
    EngagementId: S.optional(S.String),
    EngagementArn: S.optional(S.String),
    EngagementLastModifiedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateEngagementContextResponse",
}) as any as S.Schema<CreateEngagementContextResponse>;
export interface CreateEngagementInvitationResponse {
  Id: string;
  Arn: string;
}
export const CreateEngagementInvitationResponse = S.suspend(() =>
  S.Struct({ Id: S.String, Arn: S.String }),
).annotations({
  identifier: "CreateEngagementInvitationResponse",
}) as any as S.Schema<CreateEngagementInvitationResponse>;
export interface ListOpportunitiesResponse {
  OpportunitySummaries: OpportunitySummary[];
  NextToken?: string;
}
export const ListOpportunitiesResponse = S.suspend(() =>
  S.Struct({
    OpportunitySummaries: OpportunitySummaries,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunitiesResponse",
}) as any as S.Schema<ListOpportunitiesResponse>;
export type ValidationExceptionErrorCode =
  | "REQUIRED_FIELD_MISSING"
  | "INVALID_ENUM_VALUE"
  | "INVALID_STRING_FORMAT"
  | "INVALID_VALUE"
  | "NOT_ENOUGH_VALUES"
  | "TOO_MANY_VALUES"
  | "INVALID_RESOURCE_STATE"
  | "DUPLICATE_KEY_VALUE"
  | "VALUE_OUT_OF_RANGE"
  | "ACTION_NOT_PERMITTED";
export const ValidationExceptionErrorCode = S.Literal(
  "REQUIRED_FIELD_MISSING",
  "INVALID_ENUM_VALUE",
  "INVALID_STRING_FORMAT",
  "INVALID_VALUE",
  "NOT_ENOUGH_VALUES",
  "TOO_MANY_VALUES",
  "INVALID_RESOURCE_STATE",
  "DUPLICATE_KEY_VALUE",
  "VALUE_OUT_OF_RANGE",
  "ACTION_NOT_PERMITTED",
);
export interface AwsProductsSpendInsightsBySource {
  Partner?: AwsProductInsights;
  AWS?: AwsProductInsights;
}
export const AwsProductsSpendInsightsBySource = S.suspend(() =>
  S.Struct({
    Partner: S.optional(AwsProductInsights),
    AWS: S.optional(AwsProductInsights),
  }),
).annotations({
  identifier: "AwsProductsSpendInsightsBySource",
}) as any as S.Schema<AwsProductsSpendInsightsBySource>;
export interface ValidationExceptionError {
  FieldName?: string;
  Message: string;
  Code: ValidationExceptionErrorCode;
}
export const ValidationExceptionError = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(S.String),
    Message: S.String,
    Code: ValidationExceptionErrorCode,
  }),
).annotations({
  identifier: "ValidationExceptionError",
}) as any as S.Schema<ValidationExceptionError>;
export type ValidationExceptionErrorList = ValidationExceptionError[];
export const ValidationExceptionErrorList = S.Array(ValidationExceptionError);
export interface AwsOpportunityInsights {
  NextBestActions?: string;
  EngagementScore?: EngagementScore;
  AwsProductsSpendInsightsBySource?: AwsProductsSpendInsightsBySource;
}
export const AwsOpportunityInsights = S.suspend(() =>
  S.Struct({
    NextBestActions: S.optional(S.String),
    EngagementScore: S.optional(EngagementScore),
    AwsProductsSpendInsightsBySource: S.optional(
      AwsProductsSpendInsightsBySource,
    ),
  }),
).annotations({
  identifier: "AwsOpportunityInsights",
}) as any as S.Schema<AwsOpportunityInsights>;
export interface GetAwsOpportunitySummaryResponse {
  RelatedOpportunityId?: string;
  Origin?: OpportunityOrigin;
  InvolvementType?: SalesInvolvementType;
  Visibility?: Visibility;
  LifeCycle?: AwsOpportunityLifeCycle;
  OpportunityTeam?: AwsTeamMember[];
  Insights?: AwsOpportunityInsights;
  InvolvementTypeChangeReason?: InvolvementTypeChangeReason;
  RelatedEntityIds?: AwsOpportunityRelatedEntities;
  Customer?: AwsOpportunityCustomer;
  Project?: AwsOpportunityProject;
  Catalog: string;
}
export const GetAwsOpportunitySummaryResponse = S.suspend(() =>
  S.Struct({
    RelatedOpportunityId: S.optional(S.String),
    Origin: S.optional(OpportunityOrigin),
    InvolvementType: S.optional(SalesInvolvementType),
    Visibility: S.optional(Visibility),
    LifeCycle: S.optional(AwsOpportunityLifeCycle),
    OpportunityTeam: S.optional(AwsOpportunityTeamMembersList),
    Insights: S.optional(AwsOpportunityInsights),
    InvolvementTypeChangeReason: S.optional(InvolvementTypeChangeReason),
    RelatedEntityIds: S.optional(AwsOpportunityRelatedEntities),
    Customer: S.optional(AwsOpportunityCustomer),
    Project: S.optional(AwsOpportunityProject),
    Catalog: S.String,
  }),
).annotations({
  identifier: "GetAwsOpportunitySummaryResponse",
}) as any as S.Schema<GetAwsOpportunitySummaryResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(AccessDeniedExceptionErrorCode),
  },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: ValidationExceptionReason,
    ErrorList: S.optional(ValidationExceptionErrorList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use this action to retrieve the engagement record for a given `EngagementIdentifier`.
 */
export const getEngagement: (
  input: GetEngagementRequest,
) => effect.Effect<
  GetEngagementResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEngagementRequest,
  output: GetEngagementResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a summary of an AWS Opportunity. This summary includes high-level details about the opportunity sourced from AWS, such as lifecycle information, customer details, and involvement type. It is useful for tracking updates on the AWS opportunity corresponding to an opportunity in the partner's account.
 */
export const getAwsOpportunitySummary: (
  input: GetAwsOpportunitySummaryRequest,
) => effect.Effect<
  GetAwsOpportunitySummaryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAwsOpportunitySummaryRequest,
  output: GetAwsOpportunitySummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an `Opportunity` record in Partner Central. Use this operation to create a potential business opportunity for submission to Amazon Web Services. Creating an opportunity sets `Lifecycle.ReviewStatus` to `Pending Submission`.
 *
 * To submit an opportunity, follow these steps:
 *
 * - To create the opportunity, use `CreateOpportunity`.
 *
 * - To associate a solution with the opportunity, use `AssociateOpportunity`.
 *
 * - To start the engagement with AWS, use `StartEngagementFromOpportunity`.
 *
 * After submission, you can't edit the opportunity until the review is complete. But opportunities in the `Pending Submission` state must have complete details. You can update the opportunity while it's in the `Pending Submission` state.
 *
 * There's a set of mandatory fields to create opportunities, but consider providing optional fields to enrich the opportunity record.
 */
export const createOpportunity: (
  input: CreateOpportunityRequest,
) => effect.Effect<
  CreateOpportunityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOpportunityRequest,
  output: CreateOpportunityResponse,
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
 * Use this action to retrieve a specific snapshot record.
 */
export const getResourceSnapshot: (
  input: GetResourceSnapshotRequest,
) => effect.Effect<
  GetResourceSnapshotResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSnapshotRequest,
  output: GetResourceSnapshotResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Similar to `StartEngagementByAcceptingInvitationTask`, this action is asynchronous and performs multiple steps before completion. This action orchestrates a comprehensive workflow that combines multiple API operations into a single task to create and initiate an engagement from an existing opportunity. It automatically executes a sequence of operations including `GetOpportunity`, `CreateEngagement` (if it doesn't exist), `CreateResourceSnapshot`, `CreateResourceSnapshotJob`, `CreateEngagementInvitation` (if not already invited/accepted), and `SubmitOpportunity`.
 */
export const startEngagementFromOpportunityTask: (
  input: StartEngagementFromOpportunityTaskRequest,
) => effect.Effect<
  StartEngagementFromOpportunityTaskResponse,
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
  input: StartEngagementFromOpportunityTaskRequest,
  output: StartEngagementFromOpportunityTaskResponse,
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
 * This action allows users to retrieve a list of Engagement records from Partner Central. This action can be used to manage and track various engagements across different stages of the partner selling process.
 */
export const listEngagements: {
  (
    input: ListEngagementsRequest,
  ): effect.Effect<
    ListEngagementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementsRequest,
  ) => stream.Stream<
    ListEngagementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementsRequest,
  ) => stream.Stream<
    EngagementSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementsRequest,
  output: ListEngagementsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EngagementSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all in-progress, completed, or failed StartEngagementByAcceptingInvitationTask tasks that were initiated by the caller's account.
 */
export const listEngagementByAcceptingInvitationTasks: {
  (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ): effect.Effect<
    ListEngagementByAcceptingInvitationTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ) => stream.Stream<
    ListEngagementByAcceptingInvitationTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ) => stream.Stream<
    ListEngagementByAcceptingInvitationTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementByAcceptingInvitationTasksRequest,
  output: ListEngagementByAcceptingInvitationTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of engagement invitations sent to the partner. This allows partners to view all pending or past engagement invitations, helping them track opportunities shared by AWS.
 */
export const listEngagementInvitations: {
  (
    input: ListEngagementInvitationsRequest,
  ): effect.Effect<
    ListEngagementInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementInvitationsRequest,
  ) => stream.Stream<
    ListEngagementInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementInvitationsRequest,
  ) => stream.Stream<
    EngagementInvitationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementInvitationsRequest,
  output: ListEngagementInvitationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EngagementInvitationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists resource snapshot jobs owned by the customer. This operation supports various filtering scenarios, including listing all jobs owned by the caller, jobs for a specific engagement, jobs with a specific status, or any combination of these filters.
 */
export const listResourceSnapshotJobs: {
  (
    input: ListResourceSnapshotJobsRequest,
  ): effect.Effect<
    ListResourceSnapshotJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSnapshotJobsRequest,
  ) => stream.Stream<
    ListResourceSnapshotJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSnapshotJobsRequest,
  ) => stream.Stream<
    ResourceSnapshotJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSnapshotJobsRequest,
  output: ListResourceSnapshotJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceSnapshotJobSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of Partner Solutions that the partner registered on Partner Central. This API is used to generate a list of solutions that an end user selects from for association with an opportunity.
 */
export const listSolutions: {
  (
    input: ListSolutionsRequest,
  ): effect.Effect<
    ListSolutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolutionsRequest,
  ) => stream.Stream<
    ListSolutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolutionsRequest,
  ) => stream.Stream<
    SolutionBase,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolutionsRequest,
  output: ListSolutionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SolutionSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details of member partners in an Engagement. This operation can only be invoked by members of the Engagement. The `ListEngagementMembers` operation allows you to fetch information about the members of a specific Engagement. This action is restricted to members of the Engagement being queried.
 */
export const listEngagementMembers: {
  (
    input: ListEngagementMembersRequest,
  ): effect.Effect<
    ListEngagementMembersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementMembersRequest,
  ) => stream.Stream<
    ListEngagementMembersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementMembersRequest,
  ) => stream.Stream<
    EngagementMember,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementMembersRequest,
  output: ListEngagementMembersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EngagementMemberList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all in-progress, completed, or failed `EngagementFromOpportunity` tasks that were initiated by the caller's account.
 */
export const listEngagementFromOpportunityTasks: {
  (
    input: ListEngagementFromOpportunityTasksRequest,
  ): effect.Effect<
    ListEngagementFromOpportunityTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementFromOpportunityTasksRequest,
  ) => stream.Stream<
    ListEngagementFromOpportunityTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementFromOpportunityTasksRequest,
  ) => stream.Stream<
    ListEngagementFromOpportunityTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementFromOpportunityTasksRequest,
  output: ListEngagementFromOpportunityTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details of an engagement invitation shared by AWS with a partner. The information includes aspects such as customer, project details, and lifecycle information. To connect an engagement invitation with an opportunity, match the invitation’s `Payload.Project.Title` with opportunity `Project.Title`.
 */
export const getEngagementInvitation: (
  input: GetEngagementInvitationRequest,
) => effect.Effect<
  GetEngagementInvitationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEngagementInvitationRequest,
  output: GetEngagementInvitationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the `Opportunity` record from Partner Central by a given `Identifier`.
 *
 * Use the `ListOpportunities` action or the event notification (from Amazon EventBridge) to obtain this identifier.
 */
export const getOpportunity: (
  input: GetOpportunityRequest,
) => effect.Effect<
  GetOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpportunityRequest,
  output: GetOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all in-progress, completed, or failed opportunity creation tasks from engagements that were initiated by the caller's account.
 */
export const listOpportunityFromEngagementTasks: {
  (
    input: ListOpportunityFromEngagementTasksRequest,
  ): effect.Effect<
    ListOpportunityFromEngagementTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpportunityFromEngagementTasksRequest,
  ) => stream.Stream<
    ListOpportunityFromEngagementTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpportunityFromEngagementTasksRequest,
  ) => stream.Stream<
    ListOpportunityFromEngagementTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpportunityFromEngagementTasksRequest,
  output: ListOpportunityFromEngagementTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the associations between resources and engagements where the caller is a member and has at least one snapshot in the engagement.
 */
export const listEngagementResourceAssociations: {
  (
    input: ListEngagementResourceAssociationsRequest,
  ): effect.Effect<
    ListEngagementResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementResourceAssociationsRequest,
  ) => stream.Stream<
    ListEngagementResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementResourceAssociationsRequest,
  ) => stream.Stream<
    EngagementResourceAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementResourceAssociationsRequest,
  output: ListEngagementResourceAssociationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EngagementResourceAssociationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of resource view snapshots based on specified criteria. This operation supports various use cases, including:
 *
 * - Fetching all snapshots associated with an engagement.
 *
 * - Retrieving snapshots of a specific resource type within an engagement.
 *
 * - Obtaining snapshots for a particular resource using a specified template.
 *
 * - Accessing the latest snapshot of a resource within an engagement.
 *
 * - Filtering snapshots by resource owner.
 */
export const listResourceSnapshots: {
  (
    input: ListResourceSnapshotsRequest,
  ): effect.Effect<
    ListResourceSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSnapshotsRequest,
  ) => stream.Stream<
    ListResourceSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSnapshotsRequest,
  ) => stream.Stream<
    ResourceSnapshotSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSnapshotsRequest,
  output: ListResourceSnapshotsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceSnapshotSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the `Opportunity` record identified by a given `Identifier`. This operation allows you to modify the details of an existing opportunity to reflect the latest information and progress. Use this action to keep the opportunity record up-to-date and accurate.
 *
 * When you perform updates, include the entire payload with each request. If any field is omitted, the API assumes that the field is set to `null`. The best practice is to always perform a `GetOpportunity` to retrieve the latest values, then send the complete payload with the updated values to be changed.
 */
export const updateOpportunity: (
  input: UpdateOpportunityRequest,
) => effect.Effect<
  UpdateOpportunityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOpportunityRequest,
  output: UpdateOpportunityResponse,
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
 * Use the `AcceptEngagementInvitation` action to accept an engagement invitation shared by AWS. Accepting the invitation indicates your willingness to participate in the engagement, granting you access to all engagement-related data.
 */
export const acceptEngagementInvitation: (
  input: AcceptEngagementInvitationRequest,
) => effect.Effect<
  AcceptEngagementInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptEngagementInvitationRequest,
  output: AcceptEngagementInvitationResponse,
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
 * This action rejects an `EngagementInvitation` that AWS shared. Rejecting an invitation indicates that the partner doesn't want to pursue the opportunity, and all related data will become inaccessible thereafter.
 */
export const rejectEngagementInvitation: (
  input: RejectEngagementInvitationRequest,
) => effect.Effect<
  RejectEngagementInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectEngagementInvitationRequest,
  output: RejectEngagementInvitationResponse,
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
 * Use this action to deletes a previously created resource snapshot job. The job must be in a stopped state before it can be deleted.
 */
export const deleteResourceSnapshotJob: (
  input: DeleteResourceSnapshotJobRequest,
) => effect.Effect<
  DeleteResourceSnapshotJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceSnapshotJobRequest,
  output: DeleteResourceSnapshotJobResponse,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to reassign an existing `Opportunity` to another user within your Partner Central account. The specified user receives the opportunity, and it appears on their Partner Central dashboard, allowing them to take necessary actions or proceed with the opportunity.
 *
 * This is useful for distributing opportunities to the appropriate team members or departments within your organization, ensuring that each opportunity is handled by the right person. By default, the opportunity owner is the one who creates it. Currently, there's no API to enumerate the list of available users.
 */
export const assignOpportunity: (
  input: AssignOpportunityRequest,
) => effect.Effect<
  AssignOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssignOpportunityRequest,
  output: AssignOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this action to retrieves information about a specific resource snapshot job.
 */
export const getResourceSnapshotJob: (
  input: GetResourceSnapshotJobRequest,
) => effect.Effect<
  GetResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSnapshotJobRequest,
  output: GetResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to create a formal association between an `Opportunity` and various related entities, enriching the context and details of the opportunity for better collaboration and decision making. You can associate an opportunity with the following entity types:
 *
 * - Partner Solution: A software product or consulting practice created and delivered by Partners. Partner Solutions help customers address business challenges using Amazon Web Services services.
 *
 * - Amazon Web Services Products: Amazon Web Services offers many products and services that provide scalable, reliable, and cost-effective infrastructure solutions. For the latest list of Amazon Web Services products, see Amazon Web Services products.
 *
 * - Amazon Web Services Marketplace private offer: Allows Amazon Web Services Marketplace sellers to extend custom pricing and terms to individual Amazon Web Services customers. Sellers can negotiate custom prices, payment schedules, and end user license terms through private offers, enabling Amazon Web Services customers to acquire software solutions tailored to their specific needs. For more information, see Private offers in Amazon Web Services Marketplace.
 *
 * To obtain identifiers for these entities, use the following methods:
 *
 * - Solution: Use the `ListSolutions` operation.
 *
 * - AWS Products: For the latest list of Amazon Web Services products, see Amazon Web Services products.
 *
 * - Amazon Web Services Marketplace private offer: Use the Using the Amazon Web Services Marketplace Catalog API to list entities. Specifically, use the `ListEntities` operation to retrieve a list of private offers. The request returns the details of available private offers. For more information, see ListEntities.
 */
export const associateOpportunity: (
  input: AssociateOpportunityRequest,
) => effect.Effect<
  AssociateOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateOpportunityRequest,
  output: AssociateOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to remove an existing association between an `Opportunity` and related entities, such as a Partner Solution, Amazon Web Services product, or an Amazon Web Services Marketplace offer. This operation is the counterpart to `AssociateOpportunity`, and it provides flexibility to manage associations as business needs change.
 *
 * Use this operation to update the associations of an `Opportunity` due to changes in the related entities, or if an association was made in error. Ensuring accurate associations helps maintain clarity and accuracy to track and manage business opportunities. When you replace an entity, first attach the new entity and then disassociate the one to be removed, especially if it's the last remaining entity that's required.
 */
export const disassociateOpportunity: (
  input: DisassociateOpportunityRequest,
) => effect.Effect<
  DisassociateOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateOpportunityRequest,
  output: DisassociateOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this action to submit an Opportunity that was previously created by partner for AWS review. After you perform this action, the Opportunity becomes non-editable until it is reviewed by AWS and has ` LifeCycle.ReviewStatus ` as either `Approved` or `Action Required`.
 */
export const submitOpportunity: (
  input: SubmitOpportunityRequest,
) => effect.Effect<
  SubmitOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitOpportunityRequest,
  output: SubmitOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a resource snapshot job that has been previously created.
 */
export const startResourceSnapshotJob: (
  input: StartResourceSnapshotJobRequest,
) => effect.Effect<
  StartResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceSnapshotJobRequest,
  output: StartResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a resource snapshot job. The job must be started prior to being stopped.
 */
export const stopResourceSnapshotJob: (
  input: StopResourceSnapshotJobRequest,
) => effect.Effect<
  StopResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopResourceSnapshotJobRequest,
  output: StopResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const getSellingSystemSettings: (
  input: GetSellingSystemSettingsRequest,
) => effect.Effect<
  GetSellingSystemSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSellingSystemSettingsRequest,
  output: GetSellingSystemSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a resource.
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
 * Updates the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const putSellingSystemSettings: (
  input: PutSellingSystemSettingsRequest,
) => effect.Effect<
  PutSellingSystemSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSellingSystemSettingsRequest,
  output: PutSellingSystemSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This action starts the engagement by accepting an `EngagementInvitation`. The task is asynchronous and involves the following steps: accepting the invitation, creating an opportunity in the partner’s account from the AWS opportunity, and copying details for tracking. When completed, an `Opportunity Created` event is generated, indicating that the opportunity has been successfully created in the partner's account.
 */
export const startEngagementByAcceptingInvitationTask: (
  input: StartEngagementByAcceptingInvitationTaskRequest,
) => effect.Effect<
  StartEngagementByAcceptingInvitationTaskResponse,
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
  input: StartEngagementByAcceptingInvitationTaskRequest,
  output: StartEngagementByAcceptingInvitationTaskResponse,
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
 * This action creates an opportunity from an existing engagement context. The task is asynchronous and orchestrates the process of converting engagement contextual information into a structured opportunity record within the partner's account.
 */
export const startOpportunityFromEngagementTask: (
  input: StartOpportunityFromEngagementTaskRequest,
) => effect.Effect<
  StartOpportunityFromEngagementTaskResponse,
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
  input: StartOpportunityFromEngagementTaskRequest,
  output: StartOpportunityFromEngagementTaskResponse,
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
 * This action allows you to create an immutable snapshot of a specific resource, such as an opportunity, within the context of an engagement. The snapshot captures a subset of the resource's data based on the schema defined by the provided template.
 */
export const createResourceSnapshot: (
  input: CreateResourceSnapshotRequest,
) => effect.Effect<
  CreateResourceSnapshotResponse,
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
  input: CreateResourceSnapshotRequest,
  output: CreateResourceSnapshotResponse,
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
 * Use this action to create a job to generate a snapshot of the specified resource within an engagement. It initiates an asynchronous process to create a resource snapshot. The job creates a new snapshot only if the resource state has changed, adhering to the same access control and immutability rules as direct snapshot creation.
 */
export const createResourceSnapshotJob: (
  input: CreateResourceSnapshotJobRequest,
) => effect.Effect<
  CreateResourceSnapshotJobResponse,
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
  input: CreateResourceSnapshotJobRequest,
  output: CreateResourceSnapshotJobResponse,
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
 * The `CreateEngagement` action allows you to create an `Engagement`, which serves as a collaborative space between different parties such as AWS Partners and AWS Sellers. This action automatically adds the caller's AWS account as an active member of the newly created `Engagement`.
 */
export const createEngagement: (
  input: CreateEngagementRequest,
) => effect.Effect<
  CreateEngagementResponse,
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
  input: CreateEngagementRequest,
  output: CreateEngagementResponse,
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
 * Updates the context information for an existing engagement with new or modified data.
 */
export const updateEngagementContext: (
  input: UpdateEngagementContextRequest,
) => effect.Effect<
  UpdateEngagementContextResponse,
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
  input: UpdateEngagementContextRequest,
  output: UpdateEngagementContextResponse,
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
 * Creates a new context within an existing engagement. This action allows you to add contextual information such as customer projects or documents to an engagement, providing additional details that help facilitate collaboration between engagement members.
 */
export const createEngagementContext: (
  input: CreateEngagementContextRequest,
) => effect.Effect<
  CreateEngagementContextResponse,
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
  input: CreateEngagementContextRequest,
  output: CreateEngagementContextResponse,
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
 * This action creates an invitation from a sender to a single receiver to join an engagement.
 */
export const createEngagementInvitation: (
  input: CreateEngagementInvitationRequest,
) => effect.Effect<
  CreateEngagementInvitationResponse,
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
  input: CreateEngagementInvitationRequest,
  output: CreateEngagementInvitationResponse,
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
 * This request accepts a list of filters that retrieve opportunity subsets as well as sort options. This feature is available to partners from Partner Central using the `ListOpportunities` API action.
 *
 * To synchronize your system with Amazon Web Services, list only the opportunities that were newly created or updated. We recommend you rely on events emitted by the service into your Amazon Web Services account’s Amazon EventBridge default event bus. You can also use the `ListOpportunities` action.
 *
 * We recommend the following approach:
 *
 * - Find the latest `LastModifiedDate` that you stored, and only use the values that came from Amazon Web Services. Don’t use values generated by your system.
 *
 * - When you send a `ListOpportunities` request, submit the date in ISO 8601 format in the `AfterLastModifiedDate` filter.
 *
 * - Amazon Web Services only returns opportunities created or updated on or after that date and time. Use `NextToken` to iterate over all pages.
 */
export const listOpportunities: {
  (
    input: ListOpportunitiesRequest,
  ): effect.Effect<
    ListOpportunitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpportunitiesRequest,
  ) => stream.Stream<
    ListOpportunitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpportunitiesRequest,
  ) => stream.Stream<
    OpportunitySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpportunitiesRequest,
  output: ListOpportunitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OpportunitySummaries",
    pageSize: "MaxResults",
  } as const,
}));
