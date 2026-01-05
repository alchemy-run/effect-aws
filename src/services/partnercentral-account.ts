import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "PartnerCentral Account",
  serviceShapeName: "PartnerCentralAccount",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-account" });
const ver = T.ServiceVersion("2025-04-04");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
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
                  ],
                  endpoint: {
                    url: "https://partnercentral-account-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://partnercentral-account.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeyList = S.Array(S.String);
export const ParticipantIdentifierList = S.Array(S.String);
export class GetVerificationRequest extends S.Class<GetVerificationRequest>(
  "GetVerificationRequest",
)(
  { VerificationType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendEmailVerificationCodeRequest extends S.Class<SendEmailVerificationCodeRequest>(
  "SendEmailVerificationCodeRequest",
)(
  { Catalog: S.String, Email: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendEmailVerificationCodeResponse extends S.Class<SendEmailVerificationCodeResponse>(
  "SendEmailVerificationCodeResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class CreateConnectionInvitationRequest extends S.Class<CreateConnectionInvitationRequest>(
  "CreateConnectionInvitationRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    ConnectionType: S.String,
    Email: S.String,
    Message: S.String,
    Name: S.String,
    ReceiverIdentifier: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConnectionInvitationRequest extends S.Class<GetConnectionInvitationRequest>(
  "GetConnectionInvitationRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionInvitationsRequest extends S.Class<ListConnectionInvitationsRequest>(
  "ListConnectionInvitationsRequest",
)(
  {
    Catalog: S.String,
    NextToken: S.optional(S.String),
    ConnectionType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    OtherParticipantIdentifiers: S.optional(ParticipantIdentifierList),
    ParticipantType: S.optional(S.String),
    Status: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptConnectionInvitationRequest extends S.Class<AcceptConnectionInvitationRequest>(
  "AcceptConnectionInvitationRequest",
)(
  { Catalog: S.String, Identifier: S.String, ClientToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelConnectionInvitationRequest extends S.Class<CancelConnectionInvitationRequest>(
  "CancelConnectionInvitationRequest",
)(
  { Catalog: S.String, Identifier: S.String, ClientToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectConnectionInvitationRequest extends S.Class<RejectConnectionInvitationRequest>(
  "RejectConnectionInvitationRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.String,
    Reason: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConnectionPreferencesRequest extends S.Class<GetConnectionPreferencesRequest>(
  "GetConnectionPreferencesRequest",
)(
  { Catalog: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConnectionPreferencesRequest extends S.Class<UpdateConnectionPreferencesRequest>(
  "UpdateConnectionPreferencesRequest",
)(
  {
    Catalog: S.String,
    Revision: S.Number,
    AccessType: S.String,
    ExcludedParticipantIdentifiers: S.optional(ParticipantIdentifierList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConnectionRequest extends S.Class<GetConnectionRequest>(
  "GetConnectionRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionsRequest extends S.Class<ListConnectionsRequest>(
  "ListConnectionsRequest",
)(
  {
    Catalog: S.String,
    NextToken: S.optional(S.String),
    ConnectionType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    OtherParticipantIdentifiers: S.optional(ParticipantIdentifierList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelConnectionRequest extends S.Class<CancelConnectionRequest>(
  "CancelConnectionRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ConnectionType: S.String,
    Reason: S.String,
    ClientToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPartnerRequest extends S.Class<GetPartnerRequest>(
  "GetPartnerRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPartnersRequest extends S.Class<ListPartnersRequest>(
  "ListPartnersRequest",
)(
  { Catalog: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateAwsTrainingCertificationEmailDomainRequest extends S.Class<AssociateAwsTrainingCertificationEmailDomainRequest>(
  "AssociateAwsTrainingCertificationEmailDomainRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String),
    Email: S.String,
    EmailVerificationCode: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateAwsTrainingCertificationEmailDomainResponse extends S.Class<AssociateAwsTrainingCertificationEmailDomainResponse>(
  "AssociateAwsTrainingCertificationEmailDomainResponse",
)({}) {}
export class CancelProfileUpdateTaskRequest extends S.Class<CancelProfileUpdateTaskRequest>(
  "CancelProfileUpdateTaskRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String),
    TaskId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateAwsTrainingCertificationEmailDomainRequest extends S.Class<DisassociateAwsTrainingCertificationEmailDomainRequest>(
  "DisassociateAwsTrainingCertificationEmailDomainRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String),
    DomainName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateAwsTrainingCertificationEmailDomainResponse extends S.Class<DisassociateAwsTrainingCertificationEmailDomainResponse>(
  "DisassociateAwsTrainingCertificationEmailDomainResponse",
)({}) {}
export class GetAllianceLeadContactRequest extends S.Class<GetAllianceLeadContactRequest>(
  "GetAllianceLeadContactRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProfileUpdateTaskRequest extends S.Class<GetProfileUpdateTaskRequest>(
  "GetProfileUpdateTaskRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProfileVisibilityRequest extends S.Class<GetProfileVisibilityRequest>(
  "GetProfileVisibilityRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AllianceLeadContact extends S.Class<AllianceLeadContact>(
  "AllianceLeadContact",
)({
  FirstName: S.String,
  LastName: S.String,
  Email: S.String,
  BusinessTitle: S.String,
}) {}
export class PutAllianceLeadContactRequest extends S.Class<PutAllianceLeadContactRequest>(
  "PutAllianceLeadContactRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    AllianceLeadContact: AllianceLeadContact,
    EmailVerificationCode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutProfileVisibilityRequest extends S.Class<PutProfileVisibilityRequest>(
  "PutProfileVisibilityRequest",
)(
  { Catalog: S.String, Identifier: S.String, Visibility: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegistrantVerificationDetails extends S.Class<RegistrantVerificationDetails>(
  "RegistrantVerificationDetails",
)({}) {}
export const IndustrySegmentList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceArn: S.String, Tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateConnectionInvitationResponse extends S.Class<CreateConnectionInvitationResponse>(
  "CreateConnectionInvitationResponse",
)({
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
  InviterName: S.String,
}) {}
export class GetConnectionInvitationResponse extends S.Class<GetConnectionInvitationResponse>(
  "GetConnectionInvitationResponse",
)({
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
  InviterName: S.String,
}) {}
export class CancelConnectionInvitationResponse extends S.Class<CancelConnectionInvitationResponse>(
  "CancelConnectionInvitationResponse",
)({
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
  InviterName: S.String,
}) {}
export class RejectConnectionInvitationResponse extends S.Class<RejectConnectionInvitationResponse>(
  "RejectConnectionInvitationResponse",
)({
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
  InviterName: S.String,
}) {}
export class GetConnectionPreferencesResponse extends S.Class<GetConnectionPreferencesResponse>(
  "GetConnectionPreferencesResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  AccessType: S.String,
  ExcludedParticipantIds: S.optional(ParticipantIdentifierList),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Revision: S.Number,
}) {}
export class UpdateConnectionPreferencesResponse extends S.Class<UpdateConnectionPreferencesResponse>(
  "UpdateConnectionPreferencesResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  AccessType: S.String,
  ExcludedParticipantIds: S.optional(ParticipantIdentifierList),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Revision: S.Number,
}) {}
export class PartnerProfileSummary extends S.Class<PartnerProfileSummary>(
  "PartnerProfileSummary",
)({ Id: S.String, Name: S.String }) {}
export class SellerProfileSummary extends S.Class<SellerProfileSummary>(
  "SellerProfileSummary",
)({ Id: S.String, Name: S.String }) {}
export class AccountSummary extends S.Class<AccountSummary>("AccountSummary")({
  Name: S.String,
}) {}
export const Participant = S.Union(
  S.Struct({ PartnerProfile: PartnerProfileSummary }),
  S.Struct({ SellerProfile: SellerProfileSummary }),
  S.Struct({ Account: AccountSummary }),
);
export class ConnectionTypeDetail extends S.Class<ConnectionTypeDetail>(
  "ConnectionTypeDetail",
)({
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  InviterEmail: S.String,
  InviterName: S.String,
  Status: S.String,
  CanceledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CanceledBy: S.optional(S.String),
  OtherParticipant: Participant,
}) {}
export const ConnectionTypeDetailMap = S.Record({
  key: S.String,
  value: ConnectionTypeDetail,
});
export class CancelConnectionResponse extends S.Class<CancelConnectionResponse>(
  "CancelConnectionResponse",
)({
  Catalog: S.String,
  Id: S.String,
  Arn: S.String,
  OtherParticipantAccountId: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ConnectionTypes: ConnectionTypeDetailMap,
}) {}
export class CreatePartnerRequest extends S.Class<CreatePartnerRequest>(
  "CreatePartnerRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.optional(S.String),
    LegalName: S.String,
    PrimarySolutionType: S.String,
    AllianceLeadContact: AllianceLeadContact,
    EmailVerificationCode: S.String,
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAllianceLeadContactResponse extends S.Class<GetAllianceLeadContactResponse>(
  "GetAllianceLeadContactResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  AllianceLeadContact: AllianceLeadContact,
}) {}
export class LocalizedContent extends S.Class<LocalizedContent>(
  "LocalizedContent",
)({
  DisplayName: S.String,
  Description: S.String,
  WebsiteUrl: S.String,
  LogoUrl: S.String,
  Locale: S.String,
}) {}
export const LocalizedContentList = S.Array(LocalizedContent);
export class TaskDetails extends S.Class<TaskDetails>("TaskDetails")({
  DisplayName: S.String,
  Description: S.String,
  WebsiteUrl: S.String,
  LogoUrl: S.String,
  PrimarySolutionType: S.String,
  IndustrySegments: IndustrySegmentList,
  TranslationSourceLocale: S.String,
  LocalizedContents: S.optional(LocalizedContentList),
}) {}
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  Locale: S.String,
  Message: S.String,
  Reason: S.String,
}) {}
export const ErrorDetailList = S.Array(ErrorDetail);
export class GetProfileUpdateTaskResponse extends S.Class<GetProfileUpdateTaskResponse>(
  "GetProfileUpdateTaskResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  TaskId: S.String,
  TaskDetails: TaskDetails,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Status: S.String,
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ErrorDetailList: S.optional(ErrorDetailList),
}) {}
export class GetProfileVisibilityResponse extends S.Class<GetProfileVisibilityResponse>(
  "GetProfileVisibilityResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  Visibility: S.String,
  ProfileId: S.String,
}) {}
export class PutAllianceLeadContactResponse extends S.Class<PutAllianceLeadContactResponse>(
  "PutAllianceLeadContactResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  AllianceLeadContact: AllianceLeadContact,
}) {}
export class PutProfileVisibilityResponse extends S.Class<PutProfileVisibilityResponse>(
  "PutProfileVisibilityResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  Visibility: S.String,
  ProfileId: S.String,
}) {}
export class BusinessVerificationDetails extends S.Class<BusinessVerificationDetails>(
  "BusinessVerificationDetails",
)({
  LegalName: S.String,
  RegistrationId: S.String,
  CountryCode: S.String,
  JurisdictionOfIncorporation: S.optional(S.String),
}) {}
export const VerificationDetails = S.Union(
  S.Struct({ BusinessVerificationDetails: BusinessVerificationDetails }),
  S.Struct({ RegistrantVerificationDetails: RegistrantVerificationDetails }),
);
export class ConnectionInvitationSummary extends S.Class<ConnectionInvitationSummary>(
  "ConnectionInvitationSummary",
)({
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
}) {}
export const ConnectionInvitationSummaryList = S.Array(
  ConnectionInvitationSummary,
);
export class Connection extends S.Class<Connection>("Connection")({
  Catalog: S.String,
  Id: S.String,
  Arn: S.String,
  OtherParticipantAccountId: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ConnectionTypes: ConnectionTypeDetailMap,
}) {}
export class PartnerProfile extends S.Class<PartnerProfile>("PartnerProfile")({
  DisplayName: S.String,
  Description: S.String,
  WebsiteUrl: S.String,
  LogoUrl: S.String,
  PrimarySolutionType: S.String,
  IndustrySegments: IndustrySegmentList,
  TranslationSourceLocale: S.String,
  LocalizedContents: S.optional(LocalizedContentList),
  ProfileId: S.optional(S.String),
}) {}
export class PartnerDomain extends S.Class<PartnerDomain>("PartnerDomain")({
  DomainName: S.String,
  RegisteredAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PartnerDomainList = S.Array(PartnerDomain);
export class PartnerSummary extends S.Class<PartnerSummary>("PartnerSummary")({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  LegalName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PartnerSummaryList = S.Array(PartnerSummary);
export class StartVerificationRequest extends S.Class<StartVerificationRequest>(
  "StartVerificationRequest",
)(
  {
    ClientToken: S.optional(S.String),
    VerificationDetails: S.optional(VerificationDetails),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionInvitationsResponse extends S.Class<ListConnectionInvitationsResponse>(
  "ListConnectionInvitationsResponse",
)({
  ConnectionInvitationSummaries: ConnectionInvitationSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class AcceptConnectionInvitationResponse extends S.Class<AcceptConnectionInvitationResponse>(
  "AcceptConnectionInvitationResponse",
)({ Connection: Connection }) {}
export class CreatePartnerResponse extends S.Class<CreatePartnerResponse>(
  "CreatePartnerResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  LegalName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Profile: PartnerProfile,
  AwsTrainingCertificationEmailDomains: S.optional(PartnerDomainList),
  AllianceLeadContact: AllianceLeadContact,
}) {}
export class GetPartnerResponse extends S.Class<GetPartnerResponse>(
  "GetPartnerResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  LegalName: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Profile: PartnerProfile,
  AwsTrainingCertificationEmailDomains: S.optional(PartnerDomainList),
}) {}
export class ListPartnersResponse extends S.Class<ListPartnersResponse>(
  "ListPartnersResponse",
)({
  PartnerSummaryList: PartnerSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class CancelProfileUpdateTaskResponse extends S.Class<CancelProfileUpdateTaskResponse>(
  "CancelProfileUpdateTaskResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  TaskId: S.String,
  TaskDetails: TaskDetails,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Status: S.String,
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ErrorDetailList: S.optional(ErrorDetailList),
}) {}
export class StartProfileUpdateTaskRequest extends S.Class<StartProfileUpdateTaskRequest>(
  "StartProfileUpdateTaskRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    ClientToken: S.optional(S.String),
    TaskDetails: TaskDetails,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BusinessVerificationResponse extends S.Class<BusinessVerificationResponse>(
  "BusinessVerificationResponse",
)({ BusinessVerificationDetails: BusinessVerificationDetails }) {}
export class RegistrantVerificationResponse extends S.Class<RegistrantVerificationResponse>(
  "RegistrantVerificationResponse",
)({
  CompletionUrl: S.String,
  CompletionUrlExpiresAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const VerificationResponseDetails = S.Union(
  S.Struct({ BusinessVerificationResponse: BusinessVerificationResponse }),
  S.Struct({ RegistrantVerificationResponse: RegistrantVerificationResponse }),
);
export class ConnectionTypeSummary extends S.Class<ConnectionTypeSummary>(
  "ConnectionTypeSummary",
)({ Status: S.String, OtherParticipant: Participant }) {}
export class GetVerificationResponse extends S.Class<GetVerificationResponse>(
  "GetVerificationResponse",
)({
  VerificationType: S.String,
  VerificationStatus: S.String,
  VerificationStatusReason: S.optional(S.String),
  VerificationResponseDetails: VerificationResponseDetails,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartVerificationResponse extends S.Class<StartVerificationResponse>(
  "StartVerificationResponse",
)({
  VerificationType: S.String,
  VerificationStatus: S.String,
  VerificationStatusReason: S.optional(S.String),
  VerificationResponseDetails: VerificationResponseDetails,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartProfileUpdateTaskResponse extends S.Class<StartProfileUpdateTaskResponse>(
  "StartProfileUpdateTaskResponse",
)({
  Catalog: S.String,
  Arn: S.String,
  Id: S.String,
  TaskId: S.String,
  TaskDetails: TaskDetails,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Status: S.String,
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ErrorDetailList: S.optional(ErrorDetailList),
}) {}
export const ConnectionTypeSummaryMap = S.Record({
  key: S.String,
  value: ConnectionTypeSummary,
});
export class ConnectionSummary extends S.Class<ConnectionSummary>(
  "ConnectionSummary",
)({
  Catalog: S.String,
  Id: S.String,
  Arn: S.String,
  OtherParticipantAccountId: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ConnectionTypes: ConnectionTypeSummaryMap,
}) {}
export const ConnectionSummaryList = S.Array(ConnectionSummary);
export class ListConnectionsResponse extends S.Class<ListConnectionsResponse>(
  "ListConnectionsResponse",
)({
  ConnectionSummaries: ConnectionSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class GetConnectionResponse extends S.Class<GetConnectionResponse>(
  "GetConnectionResponse",
)({
  Catalog: S.String,
  Id: S.String,
  Arn: S.String,
  OtherParticipantAccountId: S.String,
  UpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ConnectionTypes: ConnectionTypeDetailMap,
}) {}
export class FieldValidationError extends S.Class<FieldValidationError>(
  "FieldValidationError",
)({ Name: S.String, Message: S.String, Code: S.String }) {}
export class BusinessValidationError extends S.Class<BusinessValidationError>(
  "BusinessValidationError",
)({ Message: S.String, Code: S.String }) {}
export const ValidationError = S.Union(
  S.Struct({ FieldValidationError: FieldValidationError }),
  S.Struct({ BusinessValidationError: BusinessValidationError }),
);
export const ValidationErrorList = S.Array(ValidationError);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String, Reason: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, Reason: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, Reason: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, Reason: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    ErrorDetails: S.optional(ValidationErrorList),
  },
) {}

//# Operations
/**
 * Lists connection invitations for the partner account, with optional filtering by status, type, and other criteria.
 */
export const listConnectionInvitations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startProfileUpdateTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Accepts a connection invitation from another partner, establishing a formal partnership connection between the two parties.
 */
export const acceptConnectionInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves detailed information about a specific partner account.
 */
export const getPartner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelProfileUpdateTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves detailed information about a specific connection invitation.
 */
export const getConnectionInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectionInvitationRequest,
    output: GetConnectionInvitationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the alliance lead contact information for a partner account.
 */
export const getAllianceLeadContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAllianceLeadContactRequest,
    output: GetAllianceLeadContactResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information about a specific profile update task.
 */
export const getProfileUpdateTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileUpdateTaskRequest,
    output: GetProfileUpdateTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the visibility settings for a partner profile, determining who can see the profile information.
 */
export const getProfileVisibility = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetProfileVisibilityRequest,
    output: GetProfileVisibilityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates or updates the alliance lead contact information for a partner account.
 */
export const putAllianceLeadContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAllianceLeadContactRequest,
    output: PutAllianceLeadContactResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Sets the visibility level for a partner profile, controlling who can view the profile information.
 */
export const putProfileVisibility = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutProfileVisibilityRequest,
    output: PutProfileVisibilityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all tags associated with a specific AWS Partner Central Account resource.
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
 * Creates a new connection invitation to establish a partnership with another organization.
 */
export const createConnectionInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Cancels a pending connection invitation before it has been accepted or rejected.
 */
export const cancelConnectionInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Rejects a connection invitation from another partner, declining the partnership request.
 */
export const rejectConnectionInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Cancels an existing connection between partners, terminating the partnership relationship.
 */
export const cancelConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateAwsTrainingCertificationEmailDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateAwsTrainingCertificationEmailDomain =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getVerification = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPartner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPartners = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves the connection preferences for a partner account, including access settings and exclusions.
 */
export const getConnectionPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConnectionPreferencesRequest,
    output: GetConnectionPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the connection preferences for a partner account, modifying access settings and exclusions.
 */
export const updateConnectionPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConnectionPreferencesRequest,
    output: UpdateConnectionPreferencesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Sends an email verification code to the specified email address for account verification purposes.
 */
export const sendEmailVerificationCode = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendEmailVerificationCodeRequest,
    output: SendEmailVerificationCodeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Initiates a new verification process for a partner account. This operation begins the verification workflow for either business registration or individual registrant identity verification as required by AWS Partner Central.
 */
export const startVerification = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConnections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Retrieves detailed information about a specific connection between partners.
 */
export const getConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
