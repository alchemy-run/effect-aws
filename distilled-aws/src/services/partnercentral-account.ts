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
  sdkId: "PartnerCentral Account",
  serviceShapeName: "PartnerCentralAccount",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-account" });
const ver = T.ServiceVersion("2025-04-04");
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
            `https://partnercentral-account-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://partnercentral-account.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TaggableResourceArn = string;
export type Catalog = string;
export type Email = string;
export type ClientToken = string;
export type TagKey = string;
export type UnicodeString = string;
export type SensitiveUnicodeString = string | redacted.Redacted<string>;
export type ParticipantIdentifier = string;
export type ConnectionInvitationId = string;
export type NextToken = string;
export type MaxResults = number;
export type Revision = number;
export type ConnectionId = string;
export type ConnectionTypeFilter = string;
export type EmailVerificationCode = string | redacted.Redacted<string>;
export type PartnerIdentifier = string;
export type ProfileTaskId = string;
export type DomainName = string;
export type TagValue = string;
export type Url = string;
export type Locale = string;
export type VerificationStatusReason = string;
export type ConnectionInvitationArn = string;
export type ConnectionPreferencesArn = string;
export type ConnectionArn = string;
export type AwsAccountId = string;
export type PartnerArn = string;
export type PartnerId = string;
export type PartnerProfileId = string;
export type LegalName = string | redacted.Redacted<string>;
export type RegistrationId = string | redacted.Redacted<string>;
export type CountryCode = string;
export type JurisdictionCode = string;
export type CompletionUrl = string;
export type SellerProfileId = string;

//# Schemas
export type VerificationType =
  | "BUSINESS_VERIFICATION"
  | "REGISTRANT_VERIFICATION"
  | (string & {});
export const VerificationType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ConnectionType =
  | "OPPORTUNITY_COLLABORATION"
  | "SUBSIDIARY"
  | (string & {});
export const ConnectionType = S.String;
export type ParticipantIdentifierList = string[];
export const ParticipantIdentifierList = S.Array(S.String);
export type ParticipantType = "SENDER" | "RECEIVER" | (string & {});
export const ParticipantType = S.String;
export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "EXPIRED"
  | (string & {});
export const InvitationStatus = S.String;
export type AccessType =
  | "ALLOW_ALL"
  | "DENY_ALL"
  | "ALLOW_BY_DEFAULT_DENY_SOME"
  | (string & {});
export const AccessType = S.String;
export type PrimarySolutionType =
  | "SOFTWARE_PRODUCTS"
  | "CONSULTING_SERVICES"
  | "PROFESSIONAL_SERVICES"
  | "MANAGED_SERVICES"
  | "HARDWARE_PRODUCTS"
  | "COMMUNICATION_SERVICES"
  | "VALUE_ADDED_RESALE_AWS_SERVICES"
  | "TRAINING_SERVICES"
  | (string & {});
export const PrimarySolutionType = S.String;
export type ProfileVisibility = "PRIVATE" | "PUBLIC" | (string & {});
export const ProfileVisibility = S.String;
export interface GetVerificationRequest {
  VerificationType: VerificationType;
}
export const GetVerificationRequest = S.suspend(() =>
  S.Struct({ VerificationType: VerificationType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetVerificationRequest",
}) as any as S.Schema<GetVerificationRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface SendEmailVerificationCodeRequest {
  Catalog: string;
  Email: string;
}
export const SendEmailVerificationCodeRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Email: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendEmailVerificationCodeRequest",
}) as any as S.Schema<SendEmailVerificationCodeRequest>;
export interface SendEmailVerificationCodeResponse {}
export const SendEmailVerificationCodeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendEmailVerificationCodeResponse",
}) as any as S.Schema<SendEmailVerificationCodeResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface CreateConnectionInvitationRequest {
  Catalog: string;
  ClientToken: string;
  ConnectionType: ConnectionType;
  Email: string;
  Message: string;
  Name: string | redacted.Redacted<string>;
  ReceiverIdentifier: string;
}
export const CreateConnectionInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    ConnectionType: ConnectionType,
    Email: S.String,
    Message: S.String,
    Name: SensitiveString,
    ReceiverIdentifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConnectionInvitationRequest",
}) as any as S.Schema<CreateConnectionInvitationRequest>;
export interface GetConnectionInvitationRequest {
  Catalog: string;
  Identifier: string;
}
export const GetConnectionInvitationRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionInvitationRequest",
}) as any as S.Schema<GetConnectionInvitationRequest>;
export interface ListConnectionInvitationsRequest {
  Catalog: string;
  NextToken?: string;
  ConnectionType?: ConnectionType;
  MaxResults?: number;
  OtherParticipantIdentifiers?: string[];
  ParticipantType?: ParticipantType;
  Status?: InvitationStatus;
}
export const ListConnectionInvitationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    NextToken: S.optional(S.String),
    ConnectionType: S.optional(ConnectionType),
    MaxResults: S.optional(S.Number),
    OtherParticipantIdentifiers: S.optional(ParticipantIdentifierList),
    ParticipantType: S.optional(ParticipantType),
    Status: S.optional(InvitationStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConnectionInvitationsRequest",
}) as any as S.Schema<ListConnectionInvitationsRequest>;
export interface AcceptConnectionInvitationRequest {
  Catalog: string;
  Identifier: string;
  ClientToken: string;
}
export const AcceptConnectionInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AcceptConnectionInvitationRequest",
}) as any as S.Schema<AcceptConnectionInvitationRequest>;
export interface CancelConnectionInvitationRequest {
  Catalog: string;
  Identifier: string;
  ClientToken: string;
}
export const CancelConnectionInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelConnectionInvitationRequest",
}) as any as S.Schema<CancelConnectionInvitationRequest>;
export interface RejectConnectionInvitationRequest {
  Catalog: string;
  Identifier: string;
  ClientToken: string;
  Reason?: string;
}
export const RejectConnectionInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Reason: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RejectConnectionInvitationRequest",
}) as any as S.Schema<RejectConnectionInvitationRequest>;
export interface GetConnectionPreferencesRequest {
  Catalog: string;
}
export const GetConnectionPreferencesRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionPreferencesRequest",
}) as any as S.Schema<GetConnectionPreferencesRequest>;
export interface UpdateConnectionPreferencesRequest {
  Catalog: string;
  Revision: number;
  AccessType: AccessType;
  ExcludedParticipantIdentifiers?: string[];
}
export const UpdateConnectionPreferencesRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Revision: S.Number,
    AccessType: AccessType,
    ExcludedParticipantIdentifiers: S.optional(ParticipantIdentifierList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateConnectionPreferencesRequest",
}) as any as S.Schema<UpdateConnectionPreferencesRequest>;
export interface GetConnectionRequest {
  Catalog: string;
  Identifier: string;
}
export const GetConnectionRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionRequest",
}) as any as S.Schema<GetConnectionRequest>;
export interface ListConnectionsRequest {
  Catalog: string;
  NextToken?: string;
  ConnectionType?: string;
  MaxResults?: number;
  OtherParticipantIdentifiers?: string[];
}
export const ListConnectionsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    NextToken: S.optional(S.String),
    ConnectionType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    OtherParticipantIdentifiers: S.optional(ParticipantIdentifierList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConnectionsRequest",
}) as any as S.Schema<ListConnectionsRequest>;
export interface CancelConnectionRequest {
  Catalog: string;
  Identifier: string;
  ConnectionType: ConnectionType;
  Reason: string;
  ClientToken: string;
}
export const CancelConnectionRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ConnectionType: ConnectionType,
    Reason: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelConnectionRequest",
}) as any as S.Schema<CancelConnectionRequest>;
export interface GetPartnerRequest {
  Catalog: string;
  Identifier: string;
}
export const GetPartnerRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPartnerRequest",
}) as any as S.Schema<GetPartnerRequest>;
export interface ListPartnersRequest {
  Catalog: string;
  NextToken?: string;
}
export const ListPartnersRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPartnersRequest",
}) as any as S.Schema<ListPartnersRequest>;
export interface AssociateAwsTrainingCertificationEmailDomainRequest {
  Catalog: string;
  Identifier: string;
  ClientToken?: string;
  Email: string;
  EmailVerificationCode: string | redacted.Redacted<string>;
}
export const AssociateAwsTrainingCertificationEmailDomainRequest = S.suspend(
  () =>
    S.Struct({
      Catalog: S.String,
      Identifier: S.String,
      ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
      Email: S.String,
      EmailVerificationCode: SensitiveString,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "AssociateAwsTrainingCertificationEmailDomainRequest",
}) as any as S.Schema<AssociateAwsTrainingCertificationEmailDomainRequest>;
export interface AssociateAwsTrainingCertificationEmailDomainResponse {}
export const AssociateAwsTrainingCertificationEmailDomainResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "AssociateAwsTrainingCertificationEmailDomainResponse",
}) as any as S.Schema<AssociateAwsTrainingCertificationEmailDomainResponse>;
export interface CancelProfileUpdateTaskRequest {
  Catalog: string;
  Identifier: string;
  ClientToken?: string;
  TaskId: string;
}
export const CancelProfileUpdateTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    TaskId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelProfileUpdateTaskRequest",
}) as any as S.Schema<CancelProfileUpdateTaskRequest>;
export interface DisassociateAwsTrainingCertificationEmailDomainRequest {
  Catalog: string;
  Identifier: string;
  ClientToken?: string;
  DomainName: string;
}
export const DisassociateAwsTrainingCertificationEmailDomainRequest = S.suspend(
  () =>
    S.Struct({
      Catalog: S.String,
      Identifier: S.String,
      ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
      DomainName: S.String,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DisassociateAwsTrainingCertificationEmailDomainRequest",
}) as any as S.Schema<DisassociateAwsTrainingCertificationEmailDomainRequest>;
export interface DisassociateAwsTrainingCertificationEmailDomainResponse {}
export const DisassociateAwsTrainingCertificationEmailDomainResponse =
  S.suspend(() => S.Struct({})).annotations({
    identifier: "DisassociateAwsTrainingCertificationEmailDomainResponse",
  }) as any as S.Schema<DisassociateAwsTrainingCertificationEmailDomainResponse>;
export interface GetAllianceLeadContactRequest {
  Catalog: string;
  Identifier: string;
}
export const GetAllianceLeadContactRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAllianceLeadContactRequest",
}) as any as S.Schema<GetAllianceLeadContactRequest>;
export interface GetProfileUpdateTaskRequest {
  Catalog: string;
  Identifier: string;
}
export const GetProfileUpdateTaskRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProfileUpdateTaskRequest",
}) as any as S.Schema<GetProfileUpdateTaskRequest>;
export interface GetProfileVisibilityRequest {
  Catalog: string;
  Identifier: string;
}
export const GetProfileVisibilityRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProfileVisibilityRequest",
}) as any as S.Schema<GetProfileVisibilityRequest>;
export interface AllianceLeadContact {
  FirstName: string | redacted.Redacted<string>;
  LastName: string | redacted.Redacted<string>;
  Email: string;
  BusinessTitle: string | redacted.Redacted<string>;
}
export const AllianceLeadContact = S.suspend(() =>
  S.Struct({
    FirstName: SensitiveString,
    LastName: SensitiveString,
    Email: S.String,
    BusinessTitle: SensitiveString,
  }),
).annotations({
  identifier: "AllianceLeadContact",
}) as any as S.Schema<AllianceLeadContact>;
export interface PutAllianceLeadContactRequest {
  Catalog: string;
  Identifier: string;
  AllianceLeadContact: AllianceLeadContact;
  EmailVerificationCode?: string | redacted.Redacted<string>;
}
export const PutAllianceLeadContactRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    AllianceLeadContact: AllianceLeadContact,
    EmailVerificationCode: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutAllianceLeadContactRequest",
}) as any as S.Schema<PutAllianceLeadContactRequest>;
export interface PutProfileVisibilityRequest {
  Catalog: string;
  Identifier: string;
  Visibility: ProfileVisibility;
}
export const PutProfileVisibilityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    Visibility: ProfileVisibility,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutProfileVisibilityRequest",
}) as any as S.Schema<PutProfileVisibilityRequest>;
export interface RegistrantVerificationDetails {}
export const RegistrantVerificationDetails = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegistrantVerificationDetails",
}) as any as S.Schema<RegistrantVerificationDetails>;
export type IndustrySegment =
  | "AGRICULTURE_MINING"
  | "BIOTECHNOLOGY"
  | "BUSINESS_CONSUMER_SERVICES"
  | "BUSINESS_SERV"
  | "COMMUNICATIONS"
  | "COMPUTER_HARDWARE"
  | "COMPUTERS_ELECTRONICS"
  | "COMPUTER_SOFTWARE"
  | "CONSUMER_GOODS"
  | "CONSUMER_RELATED"
  | "EDUCATION"
  | "ENERGY_UTILITIES"
  | "FINANCIAL_SERVICES"
  | "GAMING"
  | "GOVERNMENT"
  | "GOVERNMENT_EDUCATION_PUBLIC_SERVICES"
  | "HEALTHCARE"
  | "HEALTHCARE_PHARMACEUTICALS_BIOTECH"
  | "INDUSTRIAL_ENERGY"
  | "INTERNET_SPECIFIC"
  | "LIFE_SCIENCES"
  | "MANUFACTURING"
  | "MEDIA_ENTERTAINMENT_LEISURE"
  | "MEDIA_ENTERTAINMENT"
  | "MEDICAL_HEALTH"
  | "NON_PROFIT_ORGANIZATION"
  | "OTHER"
  | "PROFESSIONAL_SERVICES"
  | "REAL_ESTATE_CONSTRUCTION"
  | "RETAIL"
  | "RETAIL_WHOLESALE_DISTRIBUTION"
  | "SEMICONDUCTOR_ELECTR"
  | "SOFTWARE_INTERNET"
  | "TELECOMMUNICATIONS"
  | "TRANSPORTATION_LOGISTICS"
  | "TRAVEL_HOSPITALITY"
  | "WHOLESALE_DISTRIBUTION"
  | (string & {});
export const IndustrySegment = S.String;
export type IndustrySegmentList = IndustrySegment[];
export const IndustrySegmentList = S.Array(IndustrySegment);
export type VerificationStatus =
  | "PENDING_CUSTOMER_ACTION"
  | "IN_PROGRESS"
  | "FAILED"
  | "SUCCEEDED"
  | "REJECTED"
  | (string & {});
export const VerificationStatus = S.String;
export type AccessDeniedExceptionReason =
  | "ACCESS_DENIED"
  | "INCOMPATIBLE_BENEFIT_AWS_PARTNER_STATE"
  | (string & {});
export const AccessDeniedExceptionReason = S.String;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type ProfileTaskStatus =
  | "IN_PROGRESS"
  | "CANCELED"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const ProfileTaskStatus = S.String;
export interface ListTagsForResourceResponse {
  ResourceArn: string;
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateConnectionInvitationResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: ConnectionType;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: ParticipantType;
  Status: InvitationStatus;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | redacted.Redacted<string>;
}
export const CreateConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: ConnectionType,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: ParticipantType,
    Status: InvitationStatus,
    InvitationMessage: S.String,
    InviterEmail: S.String,
    InviterName: SensitiveString,
  }),
).annotations({
  identifier: "CreateConnectionInvitationResponse",
}) as any as S.Schema<CreateConnectionInvitationResponse>;
export interface GetConnectionInvitationResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: ConnectionType;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: ParticipantType;
  Status: InvitationStatus;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | redacted.Redacted<string>;
}
export const GetConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: ConnectionType,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: ParticipantType,
    Status: InvitationStatus,
    InvitationMessage: S.String,
    InviterEmail: S.String,
    InviterName: SensitiveString,
  }),
).annotations({
  identifier: "GetConnectionInvitationResponse",
}) as any as S.Schema<GetConnectionInvitationResponse>;
export interface CancelConnectionInvitationResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: ConnectionType;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: ParticipantType;
  Status: InvitationStatus;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | redacted.Redacted<string>;
}
export const CancelConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: ConnectionType,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: ParticipantType,
    Status: InvitationStatus,
    InvitationMessage: S.String,
    InviterEmail: S.String,
    InviterName: SensitiveString,
  }),
).annotations({
  identifier: "CancelConnectionInvitationResponse",
}) as any as S.Schema<CancelConnectionInvitationResponse>;
export interface RejectConnectionInvitationResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: ConnectionType;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: ParticipantType;
  Status: InvitationStatus;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | redacted.Redacted<string>;
}
export const RejectConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: ConnectionType,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: ParticipantType,
    Status: InvitationStatus,
    InvitationMessage: S.String,
    InviterEmail: S.String,
    InviterName: SensitiveString,
  }),
).annotations({
  identifier: "RejectConnectionInvitationResponse",
}) as any as S.Schema<RejectConnectionInvitationResponse>;
export interface GetConnectionPreferencesResponse {
  Catalog: string;
  Arn: string;
  AccessType: AccessType;
  ExcludedParticipantIds?: string[];
  UpdatedAt: Date;
  Revision: number;
}
export const GetConnectionPreferencesResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    AccessType: AccessType,
    ExcludedParticipantIds: S.optional(ParticipantIdentifierList),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Revision: S.Number,
  }),
).annotations({
  identifier: "GetConnectionPreferencesResponse",
}) as any as S.Schema<GetConnectionPreferencesResponse>;
export interface UpdateConnectionPreferencesResponse {
  Catalog: string;
  Arn: string;
  AccessType: AccessType;
  ExcludedParticipantIds?: string[];
  UpdatedAt: Date;
  Revision: number;
}
export const UpdateConnectionPreferencesResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    AccessType: AccessType,
    ExcludedParticipantIds: S.optional(ParticipantIdentifierList),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Revision: S.Number,
  }),
).annotations({
  identifier: "UpdateConnectionPreferencesResponse",
}) as any as S.Schema<UpdateConnectionPreferencesResponse>;
export type ConnectionTypeStatus = "ACTIVE" | "CANCELED" | (string & {});
export const ConnectionTypeStatus = S.String;
export interface PartnerProfileSummary {
  Id: string;
  Name: string;
}
export const PartnerProfileSummary = S.suspend(() =>
  S.Struct({ Id: S.String, Name: S.String }),
).annotations({
  identifier: "PartnerProfileSummary",
}) as any as S.Schema<PartnerProfileSummary>;
export interface SellerProfileSummary {
  Id: string;
  Name: string;
}
export const SellerProfileSummary = S.suspend(() =>
  S.Struct({ Id: S.String, Name: S.String }),
).annotations({
  identifier: "SellerProfileSummary",
}) as any as S.Schema<SellerProfileSummary>;
export interface AccountSummary {
  Name: string;
}
export const AccountSummary = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "AccountSummary",
}) as any as S.Schema<AccountSummary>;
export type Participant =
  | {
      PartnerProfile: PartnerProfileSummary;
      SellerProfile?: never;
      Account?: never;
    }
  | {
      PartnerProfile?: never;
      SellerProfile: SellerProfileSummary;
      Account?: never;
    }
  | { PartnerProfile?: never; SellerProfile?: never; Account: AccountSummary };
export const Participant = S.Union(
  S.Struct({ PartnerProfile: PartnerProfileSummary }),
  S.Struct({ SellerProfile: SellerProfileSummary }),
  S.Struct({ Account: AccountSummary }),
);
export interface ConnectionTypeDetail {
  CreatedAt: Date;
  InviterEmail: string;
  InviterName: string | redacted.Redacted<string>;
  Status: ConnectionTypeStatus;
  CanceledAt?: Date;
  CanceledBy?: string;
  OtherParticipant: Participant;
}
export const ConnectionTypeDetail = S.suspend(() =>
  S.Struct({
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    InviterEmail: S.String,
    InviterName: SensitiveString,
    Status: ConnectionTypeStatus,
    CanceledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CanceledBy: S.optional(S.String),
    OtherParticipant: Participant,
  }),
).annotations({
  identifier: "ConnectionTypeDetail",
}) as any as S.Schema<ConnectionTypeDetail>;
export type ConnectionTypeDetailMap = {
  [key in ConnectionType]?: ConnectionTypeDetail;
};
export const ConnectionTypeDetailMap = S.partial(
  S.Record({ key: ConnectionType, value: S.UndefinedOr(ConnectionTypeDetail) }),
);
export interface CancelConnectionResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: { [key: string]: ConnectionTypeDetail | undefined };
}
export const CancelConnectionResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    OtherParticipantAccountId: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ConnectionTypes: ConnectionTypeDetailMap,
  }),
).annotations({
  identifier: "CancelConnectionResponse",
}) as any as S.Schema<CancelConnectionResponse>;
export interface CreatePartnerRequest {
  Catalog: string;
  ClientToken?: string;
  LegalName: string | redacted.Redacted<string>;
  PrimarySolutionType: PrimarySolutionType;
  AllianceLeadContact: AllianceLeadContact;
  EmailVerificationCode: string | redacted.Redacted<string>;
  Tags?: Tag[];
}
export const CreatePartnerRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    LegalName: SensitiveString,
    PrimarySolutionType: PrimarySolutionType,
    AllianceLeadContact: AllianceLeadContact,
    EmailVerificationCode: SensitiveString,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePartnerRequest",
}) as any as S.Schema<CreatePartnerRequest>;
export interface GetAllianceLeadContactResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  AllianceLeadContact: AllianceLeadContact;
}
export const GetAllianceLeadContactResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    AllianceLeadContact: AllianceLeadContact,
  }),
).annotations({
  identifier: "GetAllianceLeadContactResponse",
}) as any as S.Schema<GetAllianceLeadContactResponse>;
export interface LocalizedContent {
  DisplayName: string;
  Description: string;
  WebsiteUrl: string;
  LogoUrl: string;
  Locale: string;
}
export const LocalizedContent = S.suspend(() =>
  S.Struct({
    DisplayName: S.String,
    Description: S.String,
    WebsiteUrl: S.String,
    LogoUrl: S.String,
    Locale: S.String,
  }),
).annotations({
  identifier: "LocalizedContent",
}) as any as S.Schema<LocalizedContent>;
export type LocalizedContentList = LocalizedContent[];
export const LocalizedContentList = S.Array(LocalizedContent);
export interface TaskDetails {
  DisplayName: string;
  Description: string;
  WebsiteUrl: string;
  LogoUrl: string;
  PrimarySolutionType: PrimarySolutionType;
  IndustrySegments: IndustrySegment[];
  TranslationSourceLocale: string;
  LocalizedContents?: LocalizedContent[];
}
export const TaskDetails = S.suspend(() =>
  S.Struct({
    DisplayName: S.String,
    Description: S.String,
    WebsiteUrl: S.String,
    LogoUrl: S.String,
    PrimarySolutionType: PrimarySolutionType,
    IndustrySegments: IndustrySegmentList,
    TranslationSourceLocale: S.String,
    LocalizedContents: S.optional(LocalizedContentList),
  }),
).annotations({ identifier: "TaskDetails" }) as any as S.Schema<TaskDetails>;
export type ProfileValidationErrorReason =
  | "INVALID_CONTENT"
  | "DUPLICATE_PROFILE"
  | "INVALID_LOGO"
  | "INVALID_LOGO_URL"
  | "INVALID_LOGO_FILE"
  | "INVALID_LOGO_SIZE"
  | "INVALID_WEBSITE_URL"
  | (string & {});
export const ProfileValidationErrorReason = S.String;
export interface ErrorDetail {
  Locale: string;
  Message: string;
  Reason: ProfileValidationErrorReason;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    Locale: S.String,
    Message: S.String,
    Reason: ProfileValidationErrorReason,
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetailList = ErrorDetail[];
export const ErrorDetailList = S.Array(ErrorDetail);
export interface GetProfileUpdateTaskResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  TaskId: string;
  TaskDetails: TaskDetails;
  StartedAt: Date;
  Status: ProfileTaskStatus;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetail[];
}
export const GetProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: ProfileTaskStatus,
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ErrorDetailList: S.optional(ErrorDetailList),
  }),
).annotations({
  identifier: "GetProfileUpdateTaskResponse",
}) as any as S.Schema<GetProfileUpdateTaskResponse>;
export interface GetProfileVisibilityResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  Visibility: ProfileVisibility;
  ProfileId: string;
}
export const GetProfileVisibilityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    Visibility: ProfileVisibility,
    ProfileId: S.String,
  }),
).annotations({
  identifier: "GetProfileVisibilityResponse",
}) as any as S.Schema<GetProfileVisibilityResponse>;
export interface PutAllianceLeadContactResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  AllianceLeadContact: AllianceLeadContact;
}
export const PutAllianceLeadContactResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    AllianceLeadContact: AllianceLeadContact,
  }),
).annotations({
  identifier: "PutAllianceLeadContactResponse",
}) as any as S.Schema<PutAllianceLeadContactResponse>;
export interface PutProfileVisibilityResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  Visibility: ProfileVisibility;
  ProfileId: string;
}
export const PutProfileVisibilityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    Visibility: ProfileVisibility,
    ProfileId: S.String,
  }),
).annotations({
  identifier: "PutProfileVisibilityResponse",
}) as any as S.Schema<PutProfileVisibilityResponse>;
export interface BusinessVerificationDetails {
  LegalName: string | redacted.Redacted<string>;
  RegistrationId: string | redacted.Redacted<string>;
  CountryCode: string;
  JurisdictionOfIncorporation?: string;
}
export const BusinessVerificationDetails = S.suspend(() =>
  S.Struct({
    LegalName: SensitiveString,
    RegistrationId: SensitiveString,
    CountryCode: S.String,
    JurisdictionOfIncorporation: S.optional(S.String),
  }),
).annotations({
  identifier: "BusinessVerificationDetails",
}) as any as S.Schema<BusinessVerificationDetails>;
export type VerificationDetails =
  | {
      BusinessVerificationDetails: BusinessVerificationDetails;
      RegistrantVerificationDetails?: never;
    }
  | {
      BusinessVerificationDetails?: never;
      RegistrantVerificationDetails: RegistrantVerificationDetails;
    };
export const VerificationDetails = S.Union(
  S.Struct({ BusinessVerificationDetails: BusinessVerificationDetails }),
  S.Struct({ RegistrantVerificationDetails: RegistrantVerificationDetails }),
);
export type ConflictExceptionReason =
  | "CONFLICT_CLIENT_TOKEN"
  | "DUPLICATE_PARTNER"
  | "INCOMPATIBLE_PROFILE_STATE"
  | "INCOMPATIBLE_PARTNER_PROFILE_TASK_STATE"
  | "DUPLICATE_CONNECTION_INVITATION"
  | "INCOMPATIBLE_CONNECTION_INVITATION_STATE"
  | "INCOMPATIBLE_CONNECTION_INVITATION_RECEIVER"
  | "DUPLICATE_CONNECTION"
  | "INCOMPATIBLE_CONNECTION_STATE"
  | "INCOMPATIBLE_CONNECTION_PREFERENCES_REVISION"
  | "ACCOUNT_ALREADY_VERIFIED"
  | "VERIFICATION_ALREADY_IN_PROGRESS"
  | (string & {});
export const ConflictExceptionReason = S.String;
export interface ConnectionInvitationSummary {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: ConnectionType;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: ParticipantType;
  Status: InvitationStatus;
}
export const ConnectionInvitationSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: ConnectionType,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: ParticipantType,
    Status: InvitationStatus,
  }),
).annotations({
  identifier: "ConnectionInvitationSummary",
}) as any as S.Schema<ConnectionInvitationSummary>;
export type ConnectionInvitationSummaryList = ConnectionInvitationSummary[];
export const ConnectionInvitationSummaryList = S.Array(
  ConnectionInvitationSummary,
);
export interface Connection {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: { [key: string]: ConnectionTypeDetail | undefined };
}
export const Connection = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    OtherParticipantAccountId: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ConnectionTypes: ConnectionTypeDetailMap,
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export interface PartnerProfile {
  DisplayName: string;
  Description: string;
  WebsiteUrl: string;
  LogoUrl: string;
  PrimarySolutionType: PrimarySolutionType;
  IndustrySegments: IndustrySegment[];
  TranslationSourceLocale: string;
  LocalizedContents?: LocalizedContent[];
  ProfileId?: string;
}
export const PartnerProfile = S.suspend(() =>
  S.Struct({
    DisplayName: S.String,
    Description: S.String,
    WebsiteUrl: S.String,
    LogoUrl: S.String,
    PrimarySolutionType: PrimarySolutionType,
    IndustrySegments: IndustrySegmentList,
    TranslationSourceLocale: S.String,
    LocalizedContents: S.optional(LocalizedContentList),
    ProfileId: S.optional(S.String),
  }),
).annotations({
  identifier: "PartnerProfile",
}) as any as S.Schema<PartnerProfile>;
export interface PartnerDomain {
  DomainName: string;
  RegisteredAt: Date;
}
export const PartnerDomain = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    RegisteredAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PartnerDomain",
}) as any as S.Schema<PartnerDomain>;
export type PartnerDomainList = PartnerDomain[];
export const PartnerDomainList = S.Array(PartnerDomain);
export interface PartnerSummary {
  Catalog: string;
  Arn: string;
  Id: string;
  LegalName: string | redacted.Redacted<string>;
  CreatedAt: Date;
}
export const PartnerSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    LegalName: SensitiveString,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PartnerSummary",
}) as any as S.Schema<PartnerSummary>;
export type PartnerSummaryList = PartnerSummary[];
export const PartnerSummaryList = S.Array(PartnerSummary);
export interface StartVerificationRequest {
  ClientToken?: string;
  VerificationDetails?: VerificationDetails;
}
export const StartVerificationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    VerificationDetails: S.optional(VerificationDetails),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartVerificationRequest",
}) as any as S.Schema<StartVerificationRequest>;
export interface ListConnectionInvitationsResponse {
  ConnectionInvitationSummaries: ConnectionInvitationSummary[];
  NextToken?: string;
}
export const ListConnectionInvitationsResponse = S.suspend(() =>
  S.Struct({
    ConnectionInvitationSummaries: ConnectionInvitationSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectionInvitationsResponse",
}) as any as S.Schema<ListConnectionInvitationsResponse>;
export interface AcceptConnectionInvitationResponse {
  Connection: Connection;
}
export const AcceptConnectionInvitationResponse = S.suspend(() =>
  S.Struct({ Connection: Connection }),
).annotations({
  identifier: "AcceptConnectionInvitationResponse",
}) as any as S.Schema<AcceptConnectionInvitationResponse>;
export interface CreatePartnerResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  LegalName: string | redacted.Redacted<string>;
  CreatedAt: Date;
  Profile: PartnerProfile;
  AwsTrainingCertificationEmailDomains?: PartnerDomain[];
  AllianceLeadContact: AllianceLeadContact;
}
export const CreatePartnerResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    LegalName: SensitiveString,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Profile: PartnerProfile,
    AwsTrainingCertificationEmailDomains: S.optional(PartnerDomainList),
    AllianceLeadContact: AllianceLeadContact,
  }),
).annotations({
  identifier: "CreatePartnerResponse",
}) as any as S.Schema<CreatePartnerResponse>;
export interface GetPartnerResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  LegalName: string | redacted.Redacted<string>;
  CreatedAt: Date;
  Profile: PartnerProfile;
  AwsTrainingCertificationEmailDomains?: PartnerDomain[];
}
export const GetPartnerResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    LegalName: SensitiveString,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Profile: PartnerProfile,
    AwsTrainingCertificationEmailDomains: S.optional(PartnerDomainList),
  }),
).annotations({
  identifier: "GetPartnerResponse",
}) as any as S.Schema<GetPartnerResponse>;
export interface ListPartnersResponse {
  PartnerSummaryList: PartnerSummary[];
  NextToken?: string;
}
export const ListPartnersResponse = S.suspend(() =>
  S.Struct({
    PartnerSummaryList: PartnerSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPartnersResponse",
}) as any as S.Schema<ListPartnersResponse>;
export interface CancelProfileUpdateTaskResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  TaskId: string;
  TaskDetails: TaskDetails;
  StartedAt: Date;
  Status: ProfileTaskStatus;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetail[];
}
export const CancelProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: ProfileTaskStatus,
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ErrorDetailList: S.optional(ErrorDetailList),
  }),
).annotations({
  identifier: "CancelProfileUpdateTaskResponse",
}) as any as S.Schema<CancelProfileUpdateTaskResponse>;
export interface StartProfileUpdateTaskRequest {
  Catalog: string;
  Identifier: string;
  ClientToken?: string;
  TaskDetails: TaskDetails;
}
export const StartProfileUpdateTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    TaskDetails: TaskDetails,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartProfileUpdateTaskRequest",
}) as any as S.Schema<StartProfileUpdateTaskRequest>;
export interface BusinessVerificationResponse {
  BusinessVerificationDetails: BusinessVerificationDetails;
}
export const BusinessVerificationResponse = S.suspend(() =>
  S.Struct({ BusinessVerificationDetails: BusinessVerificationDetails }),
).annotations({
  identifier: "BusinessVerificationResponse",
}) as any as S.Schema<BusinessVerificationResponse>;
export interface RegistrantVerificationResponse {
  CompletionUrl: string;
  CompletionUrlExpiresAt: Date;
}
export const RegistrantVerificationResponse = S.suspend(() =>
  S.Struct({
    CompletionUrl: S.String,
    CompletionUrlExpiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "RegistrantVerificationResponse",
}) as any as S.Schema<RegistrantVerificationResponse>;
export type VerificationResponseDetails =
  | {
      BusinessVerificationResponse: BusinessVerificationResponse;
      RegistrantVerificationResponse?: never;
    }
  | {
      BusinessVerificationResponse?: never;
      RegistrantVerificationResponse: RegistrantVerificationResponse;
    };
export const VerificationResponseDetails = S.Union(
  S.Struct({ BusinessVerificationResponse: BusinessVerificationResponse }),
  S.Struct({ RegistrantVerificationResponse: RegistrantVerificationResponse }),
);
export type ServiceQuotaExceededExceptionReason =
  | "LIMIT_EXCEEDED_NUMBER_OF_EMAIL"
  | "LIMIT_EXCEEDED_NUMBER_OF_DOMAIN"
  | (string & {});
export const ServiceQuotaExceededExceptionReason = S.String;
export type ResourceNotFoundExceptionReason =
  | "PARTNER_NOT_FOUND"
  | "PARTNER_PROFILE_NOT_FOUND"
  | "PARTNER_PROFILE_TASK_NOT_FOUND"
  | "PARTNER_DOMAIN_NOT_FOUND"
  | "SENDER_PROFILE_NOT_FOUND"
  | "RECEIVER_PROFILE_NOT_FOUND"
  | "CONNECTION_INVITATION_NOT_FOUND"
  | "CONNECTION_NOT_FOUND"
  | "VERIFICATION_NOT_FOUND"
  | (string & {});
export const ResourceNotFoundExceptionReason = S.String;
export interface ConnectionTypeSummary {
  Status: ConnectionTypeStatus;
  OtherParticipant: Participant;
}
export const ConnectionTypeSummary = S.suspend(() =>
  S.Struct({ Status: ConnectionTypeStatus, OtherParticipant: Participant }),
).annotations({
  identifier: "ConnectionTypeSummary",
}) as any as S.Schema<ConnectionTypeSummary>;
export interface GetVerificationResponse {
  VerificationType: VerificationType;
  VerificationStatus: VerificationStatus;
  VerificationStatusReason?: string;
  VerificationResponseDetails: VerificationResponseDetails;
  StartedAt: Date;
  CompletedAt?: Date;
}
export const GetVerificationResponse = S.suspend(() =>
  S.Struct({
    VerificationType: VerificationType,
    VerificationStatus: VerificationStatus,
    VerificationStatusReason: S.optional(S.String),
    VerificationResponseDetails: VerificationResponseDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetVerificationResponse",
}) as any as S.Schema<GetVerificationResponse>;
export interface StartVerificationResponse {
  VerificationType: VerificationType;
  VerificationStatus: VerificationStatus;
  VerificationStatusReason?: string;
  VerificationResponseDetails: VerificationResponseDetails;
  StartedAt: Date;
  CompletedAt?: Date;
}
export const StartVerificationResponse = S.suspend(() =>
  S.Struct({
    VerificationType: VerificationType,
    VerificationStatus: VerificationStatus,
    VerificationStatusReason: S.optional(S.String),
    VerificationResponseDetails: VerificationResponseDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartVerificationResponse",
}) as any as S.Schema<StartVerificationResponse>;
export interface StartProfileUpdateTaskResponse {
  Catalog: string;
  Arn: string;
  Id: string;
  TaskId: string;
  TaskDetails: TaskDetails;
  StartedAt: Date;
  Status: ProfileTaskStatus;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetail[];
}
export const StartProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: ProfileTaskStatus,
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ErrorDetailList: S.optional(ErrorDetailList),
  }),
).annotations({
  identifier: "StartProfileUpdateTaskResponse",
}) as any as S.Schema<StartProfileUpdateTaskResponse>;
export type ConnectionTypeSummaryMap = {
  [key in ConnectionType]?: ConnectionTypeSummary;
};
export const ConnectionTypeSummaryMap = S.partial(
  S.Record({
    key: ConnectionType,
    value: S.UndefinedOr(ConnectionTypeSummary),
  }),
);
export type ValidationExceptionReason =
  | "REQUEST_VALIDATION_FAILED"
  | "BUSINESS_VALIDATION_FAILED"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface ConnectionSummary {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: { [key: string]: ConnectionTypeSummary | undefined };
}
export const ConnectionSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    OtherParticipantAccountId: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ConnectionTypes: ConnectionTypeSummaryMap,
  }),
).annotations({
  identifier: "ConnectionSummary",
}) as any as S.Schema<ConnectionSummary>;
export type ConnectionSummaryList = ConnectionSummary[];
export const ConnectionSummaryList = S.Array(ConnectionSummary);
export interface ListConnectionsResponse {
  ConnectionSummaries: ConnectionSummary[];
  NextToken?: string;
}
export const ListConnectionsResponse = S.suspend(() =>
  S.Struct({
    ConnectionSummaries: ConnectionSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectionsResponse",
}) as any as S.Schema<ListConnectionsResponse>;
export type FieldValidationCode =
  | "REQUIRED_FIELD_MISSING"
  | "DUPLICATE_VALUE"
  | "INVALID_VALUE"
  | "INVALID_STRING_FORMAT"
  | "TOO_MANY_VALUES"
  | "ACTION_NOT_PERMITTED"
  | "INVALID_ENUM_VALUE"
  | (string & {});
export const FieldValidationCode = S.String;
export type BusinessValidationCode =
  | "INCOMPATIBLE_CONNECTION_INVITATION_REQUEST"
  | "INCOMPATIBLE_LEGAL_NAME"
  | "INCOMPATIBLE_KNOW_YOUR_BUSINESS_STATUS"
  | "INCOMPATIBLE_IDENTITY_VERIFICATION_STATUS"
  | "INVALID_ACCOUNT_LINKING_STATUS"
  | "INVALID_ACCOUNT_STATE"
  | "INCOMPATIBLE_DOMAIN"
  | (string & {});
export const BusinessValidationCode = S.String;
export interface GetConnectionResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: { [key: string]: ConnectionTypeDetail | undefined };
}
export const GetConnectionResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    OtherParticipantAccountId: S.String,
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ConnectionTypes: ConnectionTypeDetailMap,
  }),
).annotations({
  identifier: "GetConnectionResponse",
}) as any as S.Schema<GetConnectionResponse>;
export interface FieldValidationError {
  Name: string;
  Message: string;
  Code: FieldValidationCode;
}
export const FieldValidationError = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String, Code: FieldValidationCode }),
).annotations({
  identifier: "FieldValidationError",
}) as any as S.Schema<FieldValidationError>;
export interface BusinessValidationError {
  Message: string;
  Code: BusinessValidationCode;
}
export const BusinessValidationError = S.suspend(() =>
  S.Struct({ Message: S.String, Code: BusinessValidationCode }),
).annotations({
  identifier: "BusinessValidationError",
}) as any as S.Schema<BusinessValidationError>;
export type ValidationError =
  | {
      FieldValidationError: FieldValidationError;
      BusinessValidationError?: never;
    }
  | {
      FieldValidationError?: never;
      BusinessValidationError: BusinessValidationError;
    };
export const ValidationError = S.Union(
  S.Struct({ FieldValidationError: FieldValidationError }),
  S.Struct({ BusinessValidationError: BusinessValidationError }),
);
export type ValidationErrorList = ValidationError[];
export const ValidationErrorList = S.Array(ValidationError);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String, Reason: AccessDeniedExceptionReason },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, Reason: ConflictExceptionReason },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, Reason: ServiceQuotaExceededExceptionReason },
).pipe(C.withQuotaError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, Reason: ResourceNotFoundExceptionReason },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: ValidationExceptionReason,
    ErrorDetails: S.optional(ValidationErrorList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists connection invitations for the partner account, with optional filtering by status, type, and other criteria.
 */
export const listConnectionInvitations: {
  (
    input: ListConnectionInvitationsRequest,
  ): effect.Effect<
    ListConnectionInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionInvitationsRequest,
  ) => stream.Stream<
    ListConnectionInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionInvitationsRequest,
  ) => stream.Stream<
    ConnectionInvitationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionInvitationsRequest,
  output: ListConnectionInvitationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConnectionInvitationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Initiates a profile update task to modify partner profile information asynchronously.
 */
export const startProfileUpdateTask: (
  input: StartProfileUpdateTaskRequest,
) => effect.Effect<
  StartProfileUpdateTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProfileUpdateTaskRequest,
  output: StartProfileUpdateTaskResponse,
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
 * Accepts a connection invitation from another partner, establishing a formal partnership connection between the two parties.
 */
export const acceptConnectionInvitation: (
  input: AcceptConnectionInvitationRequest,
) => effect.Effect<
  AcceptConnectionInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptConnectionInvitationRequest,
  output: AcceptConnectionInvitationResponse,
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
 * Retrieves detailed information about a specific partner account.
 */
export const getPartner: (
  input: GetPartnerRequest,
) => effect.Effect<
  GetPartnerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartnerRequest,
  output: GetPartnerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels an in-progress profile update task, stopping any pending changes to the partner profile.
 */
export const cancelProfileUpdateTask: (
  input: CancelProfileUpdateTaskRequest,
) => effect.Effect<
  CancelProfileUpdateTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelProfileUpdateTaskRequest,
  output: CancelProfileUpdateTaskResponse,
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
 * Retrieves detailed information about a specific connection invitation.
 */
export const getConnectionInvitation: (
  input: GetConnectionInvitationRequest,
) => effect.Effect<
  GetConnectionInvitationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionInvitationRequest,
  output: GetConnectionInvitationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the alliance lead contact information for a partner account.
 */
export const getAllianceLeadContact: (
  input: GetAllianceLeadContactRequest,
) => effect.Effect<
  GetAllianceLeadContactResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAllianceLeadContactRequest,
  output: GetAllianceLeadContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specific profile update task.
 */
export const getProfileUpdateTask: (
  input: GetProfileUpdateTaskRequest,
) => effect.Effect<
  GetProfileUpdateTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileUpdateTaskRequest,
  output: GetProfileUpdateTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the visibility settings for a partner profile, determining who can see the profile information.
 */
export const getProfileVisibility: (
  input: GetProfileVisibilityRequest,
) => effect.Effect<
  GetProfileVisibilityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileVisibilityRequest,
  output: GetProfileVisibilityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates the alliance lead contact information for a partner account.
 */
export const putAllianceLeadContact: (
  input: PutAllianceLeadContactRequest,
) => effect.Effect<
  PutAllianceLeadContactResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAllianceLeadContactRequest,
  output: PutAllianceLeadContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets the visibility level for a partner profile, controlling who can view the profile information.
 */
export const putProfileVisibility: (
  input: PutProfileVisibilityRequest,
) => effect.Effect<
  PutProfileVisibilityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProfileVisibilityRequest,
  output: PutProfileVisibilityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags associated with a specific AWS Partner Central Account resource.
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
 * Creates a new connection invitation to establish a partnership with another organization.
 */
export const createConnectionInvitation: (
  input: CreateConnectionInvitationRequest,
) => effect.Effect<
  CreateConnectionInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionInvitationRequest,
  output: CreateConnectionInvitationResponse,
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
 * Cancels a pending connection invitation before it has been accepted or rejected.
 */
export const cancelConnectionInvitation: (
  input: CancelConnectionInvitationRequest,
) => effect.Effect<
  CancelConnectionInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelConnectionInvitationRequest,
  output: CancelConnectionInvitationResponse,
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
 * Rejects a connection invitation from another partner, declining the partnership request.
 */
export const rejectConnectionInvitation: (
  input: RejectConnectionInvitationRequest,
) => effect.Effect<
  RejectConnectionInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectConnectionInvitationRequest,
  output: RejectConnectionInvitationResponse,
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
 * Cancels an existing connection between partners, terminating the partnership relationship.
 */
export const cancelConnection: (
  input: CancelConnectionRequest,
) => effect.Effect<
  CancelConnectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelConnectionRequest,
  output: CancelConnectionResponse,
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
 * Removes specified tags from an AWS Partner Central Account resource.
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
 * Associates an email domain with AWS training and certification for the partner account, enabling automatic verification of employee certifications.
 */
export const associateAwsTrainingCertificationEmailDomain: (
  input: AssociateAwsTrainingCertificationEmailDomainRequest,
) => effect.Effect<
  AssociateAwsTrainingCertificationEmailDomainResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAwsTrainingCertificationEmailDomainRequest,
  output: AssociateAwsTrainingCertificationEmailDomainResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association between an email domain and AWS training and certification for the partner account.
 */
export const disassociateAwsTrainingCertificationEmailDomain: (
  input: DisassociateAwsTrainingCertificationEmailDomainRequest,
) => effect.Effect<
  DisassociateAwsTrainingCertificationEmailDomainResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAwsTrainingCertificationEmailDomainRequest,
  output: DisassociateAwsTrainingCertificationEmailDomainResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the current status and details of a verification process for a partner account. This operation allows partners to check the progress and results of business or registrant verification processes.
 */
export const getVerification: (
  input: GetVerificationRequest,
) => effect.Effect<
  GetVerificationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVerificationRequest,
  output: GetVerificationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new partner account in the AWS Partner Network with the specified details and configuration.
 */
export const createPartner: (
  input: CreatePartnerRequest,
) => effect.Effect<
  CreatePartnerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartnerRequest,
  output: CreatePartnerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists partner accounts in the catalog, providing a summary view of all partners.
 */
export const listPartners: {
  (
    input: ListPartnersRequest,
  ): effect.Effect<
    ListPartnersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPartnersRequest,
  ) => stream.Stream<
    ListPartnersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPartnersRequest,
  ) => stream.Stream<
    PartnerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPartnersRequest,
  output: ListPartnersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PartnerSummaryList",
  } as const,
}));
/**
 * Retrieves the connection preferences for a partner account, including access settings and exclusions.
 */
export const getConnectionPreferences: (
  input: GetConnectionPreferencesRequest,
) => effect.Effect<
  GetConnectionPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionPreferencesRequest,
  output: GetConnectionPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the connection preferences for a partner account, modifying access settings and exclusions.
 */
export const updateConnectionPreferences: (
  input: UpdateConnectionPreferencesRequest,
) => effect.Effect<
  UpdateConnectionPreferencesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionPreferencesRequest,
  output: UpdateConnectionPreferencesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends an email verification code to the specified email address for account verification purposes.
 */
export const sendEmailVerificationCode: (
  input: SendEmailVerificationCodeRequest,
) => effect.Effect<
  SendEmailVerificationCodeResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEmailVerificationCodeRequest,
  output: SendEmailVerificationCodeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Initiates a new verification process for a partner account. This operation begins the verification workflow for either business registration or individual registrant identity verification as required by AWS Partner Central.
 */
export const startVerification: (
  input: StartVerificationRequest,
) => effect.Effect<
  StartVerificationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartVerificationRequest,
  output: StartVerificationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or updates tags for a specified AWS Partner Central Account resource.
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
 * Lists active connections for the partner account, with optional filtering by connection type and participant.
 */
export const listConnections: {
  (
    input: ListConnectionsRequest,
  ): effect.Effect<
    ListConnectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionsRequest,
  ) => stream.Stream<
    ListConnectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionsRequest,
  ) => stream.Stream<
    ConnectionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionsRequest,
  output: ListConnectionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConnectionSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves detailed information about a specific connection between partners.
 */
export const getConnection: (
  input: GetConnectionRequest,
) => effect.Effect<
  GetConnectionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionRequest,
  output: GetConnectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
