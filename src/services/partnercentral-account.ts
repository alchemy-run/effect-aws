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
export type SensitiveUnicodeString = string | Redacted.Redacted<string>;
export type ParticipantIdentifier = string;
export type ConnectionInvitationId = string;
export type NextToken = string;
export type MaxResults = number;
export type Revision = number;
export type ConnectionId = string;
export type ConnectionTypeFilter = string;
export type EmailVerificationCode = string | Redacted.Redacted<string>;
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
export type LegalName = string | Redacted.Redacted<string>;
export type RegistrationId = string | Redacted.Redacted<string>;
export type CountryCode = string;
export type JurisdictionCode = string;
export type CompletionUrl = string;
export type SellerProfileId = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ParticipantIdentifierList = string[];
export const ParticipantIdentifierList = S.Array(S.String);
export interface GetVerificationRequest {
  VerificationType: string;
}
export const GetVerificationRequest = S.suspend(() =>
  S.Struct({ VerificationType: S.String }).pipe(
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
  TagKeys: TagKeyList;
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
  ConnectionType: string;
  Email: string;
  Message: string;
  Name: string | Redacted.Redacted<string>;
  ReceiverIdentifier: string;
}
export const CreateConnectionInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    ConnectionType: S.String,
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
  ConnectionType?: string;
  MaxResults?: number;
  OtherParticipantIdentifiers?: ParticipantIdentifierList;
  ParticipantType?: string;
  Status?: string;
}
export const ListConnectionInvitationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    NextToken: S.optional(S.String),
    ConnectionType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    OtherParticipantIdentifiers: S.optional(ParticipantIdentifierList),
    ParticipantType: S.optional(S.String),
    Status: S.optional(S.String),
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
    ClientToken: S.String,
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
    ClientToken: S.String,
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
    ClientToken: S.String,
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
  AccessType: string;
  ExcludedParticipantIdentifiers?: ParticipantIdentifierList;
}
export const UpdateConnectionPreferencesRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Revision: S.Number,
    AccessType: S.String,
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
  OtherParticipantIdentifiers?: ParticipantIdentifierList;
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
  ConnectionType: string;
  Reason: string;
  ClientToken: string;
}
export const CancelConnectionRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    ConnectionType: S.String,
    Reason: S.String,
    ClientToken: S.String,
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
  EmailVerificationCode: string | Redacted.Redacted<string>;
}
export const AssociateAwsTrainingCertificationEmailDomainRequest = S.suspend(
  () =>
    S.Struct({
      Catalog: S.String,
      Identifier: S.String,
      ClientToken: S.optional(S.String),
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
    ClientToken: S.optional(S.String),
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
      ClientToken: S.optional(S.String),
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
  FirstName: string | Redacted.Redacted<string>;
  LastName: string | Redacted.Redacted<string>;
  Email: string;
  BusinessTitle: string | Redacted.Redacted<string>;
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
  EmailVerificationCode?: string | Redacted.Redacted<string>;
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
  Visibility: string;
}
export const PutProfileVisibilityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    Visibility: S.String,
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
export type IndustrySegmentList = string[];
export const IndustrySegmentList = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface ListTagsForResourceResponse {
  ResourceArn: string;
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
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
  ConnectionType: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: string;
  Status: string;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | Redacted.Redacted<string>;
}
export const CreateConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: S.String,
    Status: S.String,
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
  ConnectionType: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: string;
  Status: string;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | Redacted.Redacted<string>;
}
export const GetConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: S.String,
    Status: S.String,
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
  ConnectionType: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: string;
  Status: string;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | Redacted.Redacted<string>;
}
export const CancelConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: S.String,
    Status: S.String,
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
  ConnectionType: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: string;
  Status: string;
  InvitationMessage: string;
  InviterEmail: string;
  InviterName: string | Redacted.Redacted<string>;
}
export const RejectConnectionInvitationResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: S.String,
    Status: S.String,
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
  AccessType: string;
  ExcludedParticipantIds?: ParticipantIdentifierList;
  UpdatedAt: Date;
  Revision: number;
}
export const GetConnectionPreferencesResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    AccessType: S.String,
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
  AccessType: string;
  ExcludedParticipantIds?: ParticipantIdentifierList;
  UpdatedAt: Date;
  Revision: number;
}
export const UpdateConnectionPreferencesResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    AccessType: S.String,
    ExcludedParticipantIds: S.optional(ParticipantIdentifierList),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Revision: S.Number,
  }),
).annotations({
  identifier: "UpdateConnectionPreferencesResponse",
}) as any as S.Schema<UpdateConnectionPreferencesResponse>;
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
  | { PartnerProfile: PartnerProfileSummary }
  | { SellerProfile: SellerProfileSummary }
  | { Account: AccountSummary };
export const Participant = S.Union(
  S.Struct({ PartnerProfile: PartnerProfileSummary }),
  S.Struct({ SellerProfile: SellerProfileSummary }),
  S.Struct({ Account: AccountSummary }),
);
export interface ConnectionTypeDetail {
  CreatedAt: Date;
  InviterEmail: string;
  InviterName: string | Redacted.Redacted<string>;
  Status: string;
  CanceledAt?: Date;
  CanceledBy?: string;
  OtherParticipant: (typeof Participant)["Type"];
}
export const ConnectionTypeDetail = S.suspend(() =>
  S.Struct({
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    InviterEmail: S.String,
    InviterName: SensitiveString,
    Status: S.String,
    CanceledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CanceledBy: S.optional(S.String),
    OtherParticipant: Participant,
  }),
).annotations({
  identifier: "ConnectionTypeDetail",
}) as any as S.Schema<ConnectionTypeDetail>;
export type ConnectionTypeDetailMap = { [key: string]: ConnectionTypeDetail };
export const ConnectionTypeDetailMap = S.Record({
  key: S.String,
  value: ConnectionTypeDetail,
});
export interface CancelConnectionResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: ConnectionTypeDetailMap;
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
  LegalName: string | Redacted.Redacted<string>;
  PrimarySolutionType: string;
  AllianceLeadContact: AllianceLeadContact;
  EmailVerificationCode: string | Redacted.Redacted<string>;
  Tags?: TagList;
}
export const CreatePartnerRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.optional(S.String),
    LegalName: SensitiveString,
    PrimarySolutionType: S.String,
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
  PrimarySolutionType: string;
  IndustrySegments: IndustrySegmentList;
  TranslationSourceLocale: string;
  LocalizedContents?: LocalizedContentList;
}
export const TaskDetails = S.suspend(() =>
  S.Struct({
    DisplayName: S.String,
    Description: S.String,
    WebsiteUrl: S.String,
    LogoUrl: S.String,
    PrimarySolutionType: S.String,
    IndustrySegments: IndustrySegmentList,
    TranslationSourceLocale: S.String,
    LocalizedContents: S.optional(LocalizedContentList),
  }),
).annotations({ identifier: "TaskDetails" }) as any as S.Schema<TaskDetails>;
export interface ErrorDetail {
  Locale: string;
  Message: string;
  Reason: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({ Locale: S.String, Message: S.String, Reason: S.String }),
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
  Status: string;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetailList;
}
export const GetProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: S.String,
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
  Visibility: string;
  ProfileId: string;
}
export const GetProfileVisibilityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    Visibility: S.String,
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
  Visibility: string;
  ProfileId: string;
}
export const PutProfileVisibilityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    Visibility: S.String,
    ProfileId: S.String,
  }),
).annotations({
  identifier: "PutProfileVisibilityResponse",
}) as any as S.Schema<PutProfileVisibilityResponse>;
export interface BusinessVerificationDetails {
  LegalName: string | Redacted.Redacted<string>;
  RegistrationId: string | Redacted.Redacted<string>;
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
  | { BusinessVerificationDetails: BusinessVerificationDetails }
  | { RegistrantVerificationDetails: RegistrantVerificationDetails };
export const VerificationDetails = S.Union(
  S.Struct({ BusinessVerificationDetails: BusinessVerificationDetails }),
  S.Struct({ RegistrantVerificationDetails: RegistrantVerificationDetails }),
);
export interface ConnectionInvitationSummary {
  Catalog: string;
  Id: string;
  Arn: string;
  ConnectionId?: string;
  ConnectionType: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ExpiresAt?: Date;
  OtherParticipantIdentifier: string;
  ParticipantType: string;
  Status: string;
}
export const ConnectionInvitationSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.String,
    ConnectionId: S.optional(S.String),
    ConnectionType: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OtherParticipantIdentifier: S.String,
    ParticipantType: S.String,
    Status: S.String,
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
  ConnectionTypes: ConnectionTypeDetailMap;
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
  PrimarySolutionType: string;
  IndustrySegments: IndustrySegmentList;
  TranslationSourceLocale: string;
  LocalizedContents?: LocalizedContentList;
  ProfileId?: string;
}
export const PartnerProfile = S.suspend(() =>
  S.Struct({
    DisplayName: S.String,
    Description: S.String,
    WebsiteUrl: S.String,
    LogoUrl: S.String,
    PrimarySolutionType: S.String,
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
  LegalName: string | Redacted.Redacted<string>;
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
  VerificationDetails?: (typeof VerificationDetails)["Type"];
}
export const StartVerificationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    VerificationDetails: S.optional(VerificationDetails),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartVerificationRequest",
}) as any as S.Schema<StartVerificationRequest>;
export interface ListConnectionInvitationsResponse {
  ConnectionInvitationSummaries: ConnectionInvitationSummaryList;
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
  LegalName: string | Redacted.Redacted<string>;
  CreatedAt: Date;
  Profile: PartnerProfile;
  AwsTrainingCertificationEmailDomains?: PartnerDomainList;
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
  LegalName: string | Redacted.Redacted<string>;
  CreatedAt: Date;
  Profile: PartnerProfile;
  AwsTrainingCertificationEmailDomains?: PartnerDomainList;
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
  PartnerSummaryList: PartnerSummaryList;
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
  Status: string;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetailList;
}
export const CancelProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: S.String,
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
    ClientToken: S.optional(S.String),
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
  | { BusinessVerificationResponse: BusinessVerificationResponse }
  | { RegistrantVerificationResponse: RegistrantVerificationResponse };
export const VerificationResponseDetails = S.Union(
  S.Struct({ BusinessVerificationResponse: BusinessVerificationResponse }),
  S.Struct({ RegistrantVerificationResponse: RegistrantVerificationResponse }),
);
export interface ConnectionTypeSummary {
  Status: string;
  OtherParticipant: (typeof Participant)["Type"];
}
export const ConnectionTypeSummary = S.suspend(() =>
  S.Struct({ Status: S.String, OtherParticipant: Participant }),
).annotations({
  identifier: "ConnectionTypeSummary",
}) as any as S.Schema<ConnectionTypeSummary>;
export interface GetVerificationResponse {
  VerificationType: string;
  VerificationStatus: string;
  VerificationStatusReason?: string;
  VerificationResponseDetails: (typeof VerificationResponseDetails)["Type"];
  StartedAt: Date;
  CompletedAt?: Date;
}
export const GetVerificationResponse = S.suspend(() =>
  S.Struct({
    VerificationType: S.String,
    VerificationStatus: S.String,
    VerificationStatusReason: S.optional(S.String),
    VerificationResponseDetails: VerificationResponseDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetVerificationResponse",
}) as any as S.Schema<GetVerificationResponse>;
export interface StartVerificationResponse {
  VerificationType: string;
  VerificationStatus: string;
  VerificationStatusReason?: string;
  VerificationResponseDetails: (typeof VerificationResponseDetails)["Type"];
  StartedAt: Date;
  CompletedAt?: Date;
}
export const StartVerificationResponse = S.suspend(() =>
  S.Struct({
    VerificationType: S.String,
    VerificationStatus: S.String,
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
  Status: string;
  EndedAt?: Date;
  ErrorDetailList?: ErrorDetailList;
}
export const StartProfileUpdateTaskResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.String,
    Id: S.String,
    TaskId: S.String,
    TaskDetails: TaskDetails,
    StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Status: S.String,
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ErrorDetailList: S.optional(ErrorDetailList),
  }),
).annotations({
  identifier: "StartProfileUpdateTaskResponse",
}) as any as S.Schema<StartProfileUpdateTaskResponse>;
export type ConnectionTypeSummaryMap = { [key: string]: ConnectionTypeSummary };
export const ConnectionTypeSummaryMap = S.Record({
  key: S.String,
  value: ConnectionTypeSummary,
});
export interface ConnectionSummary {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: ConnectionTypeSummaryMap;
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
  ConnectionSummaries: ConnectionSummaryList;
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
export interface GetConnectionResponse {
  Catalog: string;
  Id: string;
  Arn: string;
  OtherParticipantAccountId: string;
  UpdatedAt: Date;
  ConnectionTypes: ConnectionTypeDetailMap;
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
  Code: string;
}
export const FieldValidationError = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String, Code: S.String }),
).annotations({
  identifier: "FieldValidationError",
}) as any as S.Schema<FieldValidationError>;
export interface BusinessValidationError {
  Message: string;
  Code: string;
}
export const BusinessValidationError = S.suspend(() =>
  S.Struct({ Message: S.String, Code: S.String }),
).annotations({
  identifier: "BusinessValidationError",
}) as any as S.Schema<BusinessValidationError>;
export type ValidationError =
  | { FieldValidationError: FieldValidationError }
  | { BusinessValidationError: BusinessValidationError };
export const ValidationError = S.Union(
  S.Struct({ FieldValidationError: FieldValidationError }),
  S.Struct({ BusinessValidationError: BusinessValidationError }),
);
export type ValidationErrorList = (typeof ValidationError)["Type"][];
export const ValidationErrorList = S.Array(ValidationError);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String, Reason: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, Reason: S.String },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, Reason: S.String },
).pipe(C.withQuotaError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, Reason: S.String },
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
    Reason: S.String,
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
 * Creates a new connection invitation to establish a partnership with another organization.
 */
export const createConnectionInvitation: (
  input: CreateConnectionInvitationRequest,
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
