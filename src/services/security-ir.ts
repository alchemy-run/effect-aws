import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Security IR",
  serviceShapeName: "SecurityIncidentResponse",
});
const auth = T.AwsAuthSigv4({ name: "security-ir" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
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
                    url: "https://security-ir-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://security-ir.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const ImpactedAccounts = S.Array(S.String);
export const ImpactedServicesList = S.Array(S.String);
export const AWSAccountIds = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetCaseRequest extends S.Class<GetCaseRequest>("GetCaseRequest")(
  { caseId: S.String.pipe(T.HttpLabel("caseId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/cases/{caseId}/get-case" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCasesRequest extends S.Class<ListCasesRequest>(
  "ListCasesRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/list-cases" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloseCaseRequest extends S.Class<CloseCaseRequest>(
  "CloseCaseRequest",
)(
  { caseId: S.String.pipe(T.HttpLabel("caseId")) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/close-case" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCaseCommentRequest extends S.Class<CreateCaseCommentRequest>(
  "CreateCaseCommentRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    clientToken: S.optional(S.String),
    body: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/create-comment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCaseAttachmentDownloadUrlRequest extends S.Class<GetCaseAttachmentDownloadUrlRequest>(
  "GetCaseAttachmentDownloadUrlRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    attachmentId: S.String.pipe(T.HttpLabel("attachmentId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/cases/{caseId}/get-presigned-url/{attachmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCaseAttachmentUploadUrlRequest extends S.Class<GetCaseAttachmentUploadUrlRequest>(
  "GetCaseAttachmentUploadUrlRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    fileName: S.String,
    contentLength: S.Number,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/get-presigned-url" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCaseEditsRequest extends S.Class<ListCaseEditsRequest>(
  "ListCaseEditsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/list-case-edits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCommentsRequest extends S.Class<ListCommentsRequest>(
  "ListCommentsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/list-comments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvestigationsRequest extends S.Class<ListInvestigationsRequest>(
  "ListInvestigationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/cases/{caseId}/list-investigations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendFeedbackRequest extends S.Class<SendFeedbackRequest>(
  "SendFeedbackRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    resultId: S.String.pipe(T.HttpLabel("resultId")),
    usefulness: S.String,
    comment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/cases/{caseId}/feedback/{resultId}/send-feedback",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendFeedbackResponse extends S.Class<SendFeedbackResponse>(
  "SendFeedbackResponse",
)({}) {}
export class UpdateCaseCommentRequest extends S.Class<UpdateCaseCommentRequest>(
  "UpdateCaseCommentRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    commentId: S.String.pipe(T.HttpLabel("commentId")),
    body: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/cases/{caseId}/update-case-comment/{commentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCaseStatusRequest extends S.Class<UpdateCaseStatusRequest>(
  "UpdateCaseStatusRequest",
)(
  { caseId: S.String.pipe(T.HttpLabel("caseId")), caseStatus: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/update-case-status" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResolverTypeRequest extends S.Class<UpdateResolverTypeRequest>(
  "UpdateResolverTypeRequest",
)(
  { caseId: S.String.pipe(T.HttpLabel("caseId")), resolverType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/update-resolver-type" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMembershipRequest extends S.Class<GetMembershipRequest>(
  "GetMembershipRequest",
)(
  { membershipId: S.String.pipe(T.HttpLabel("membershipId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/membership/{membershipId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembershipsRequest extends S.Class<ListMembershipsRequest>(
  "ListMembershipsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/v1/memberships" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetMemberAccountDetailsRequest extends S.Class<BatchGetMemberAccountDetailsRequest>(
  "BatchGetMemberAccountDetailsRequest",
)(
  {
    membershipId: S.String.pipe(T.HttpLabel("membershipId")),
    accountIds: AWSAccountIds,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v1/membership/{membershipId}/batch-member-details",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelMembershipRequest extends S.Class<CancelMembershipRequest>(
  "CancelMembershipRequest",
)(
  { membershipId: S.String.pipe(T.HttpLabel("membershipId")) },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/membership/{membershipId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CommunicationPreferences = S.Array(S.String);
export const OrganizationalUnits = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class Watcher extends S.Class<Watcher>("Watcher")({
  email: S.String,
  name: S.optional(S.String),
  jobTitle: S.optional(S.String),
}) {}
export const Watchers = S.Array(Watcher);
export class ThreatActorIp extends S.Class<ThreatActorIp>("ThreatActorIp")({
  ipAddress: S.String,
  userAgent: S.optional(S.String),
}) {}
export const ThreatActorIpList = S.Array(ThreatActorIp);
export class ImpactedAwsRegion extends S.Class<ImpactedAwsRegion>(
  "ImpactedAwsRegion",
)({ region: S.String }) {}
export const ImpactedAwsRegionList = S.Array(ImpactedAwsRegion);
export class CaseMetadataEntry extends S.Class<CaseMetadataEntry>(
  "CaseMetadataEntry",
)({ key: S.String, value: S.String }) {}
export const CaseMetadata = S.Array(CaseMetadataEntry);
export class IncidentResponder extends S.Class<IncidentResponder>(
  "IncidentResponder",
)({
  name: S.String,
  jobTitle: S.String,
  email: S.String,
  communicationPreferences: S.optional(CommunicationPreferences),
}) {}
export const IncidentResponseTeam = S.Array(IncidentResponder);
export class OptInFeature extends S.Class<OptInFeature>("OptInFeature")({
  featureName: S.String,
  isEnabled: S.Boolean,
}) {}
export const OptInFeatures = S.Array(OptInFeature);
export class MembershipAccountsConfigurationsUpdate extends S.Class<MembershipAccountsConfigurationsUpdate>(
  "MembershipAccountsConfigurationsUpdate",
)({
  coverEntireOrganization: S.optional(S.Boolean),
  organizationalUnitsToAdd: S.optional(OrganizationalUnits),
  organizationalUnitsToRemove: S.optional(OrganizationalUnits),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagMap }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class CreateCaseRequest extends S.Class<CreateCaseRequest>(
  "CreateCaseRequest",
)(
  {
    clientToken: S.optional(S.String),
    resolverType: S.String,
    title: S.String,
    description: S.String,
    engagementType: S.String,
    reportedIncidentStartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    impactedAccounts: ImpactedAccounts,
    watchers: Watchers,
    threatActorIpAddresses: S.optional(ThreatActorIpList),
    impactedServices: S.optional(ImpactedServicesList),
    impactedAwsRegions: S.optional(ImpactedAwsRegionList),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/create-case" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCaseRequest extends S.Class<UpdateCaseRequest>(
  "UpdateCaseRequest",
)(
  {
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    title: S.optional(S.String),
    description: S.optional(S.String),
    reportedIncidentStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    actualIncidentStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    engagementType: S.optional(S.String),
    watchersToAdd: S.optional(Watchers),
    watchersToDelete: S.optional(Watchers),
    threatActorIpAddressesToAdd: S.optional(ThreatActorIpList),
    threatActorIpAddressesToDelete: S.optional(ThreatActorIpList),
    impactedServicesToAdd: S.optional(ImpactedServicesList),
    impactedServicesToDelete: S.optional(ImpactedServicesList),
    impactedAwsRegionsToAdd: S.optional(ImpactedAwsRegionList),
    impactedAwsRegionsToDelete: S.optional(ImpactedAwsRegionList),
    impactedAccountsToAdd: S.optional(ImpactedAccounts),
    impactedAccountsToDelete: S.optional(ImpactedAccounts),
    caseMetadata: S.optional(CaseMetadata),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/cases/{caseId}/update-case" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCaseResponse extends S.Class<UpdateCaseResponse>(
  "UpdateCaseResponse",
)({}) {}
export class CloseCaseResponse extends S.Class<CloseCaseResponse>(
  "CloseCaseResponse",
)({
  caseStatus: S.optional(S.String),
  closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateCaseCommentResponse extends S.Class<CreateCaseCommentResponse>(
  "CreateCaseCommentResponse",
)({ commentId: S.String }) {}
export class GetCaseAttachmentDownloadUrlResponse extends S.Class<GetCaseAttachmentDownloadUrlResponse>(
  "GetCaseAttachmentDownloadUrlResponse",
)({ attachmentPresignedUrl: S.String }) {}
export class GetCaseAttachmentUploadUrlResponse extends S.Class<GetCaseAttachmentUploadUrlResponse>(
  "GetCaseAttachmentUploadUrlResponse",
)({ attachmentPresignedUrl: S.String }) {}
export class UpdateCaseCommentResponse extends S.Class<UpdateCaseCommentResponse>(
  "UpdateCaseCommentResponse",
)({ commentId: S.String, body: S.optional(S.String) }) {}
export class UpdateCaseStatusResponse extends S.Class<UpdateCaseStatusResponse>(
  "UpdateCaseStatusResponse",
)({ caseStatus: S.optional(S.String) }) {}
export class UpdateResolverTypeResponse extends S.Class<UpdateResolverTypeResponse>(
  "UpdateResolverTypeResponse",
)({
  caseId: S.String,
  caseStatus: S.optional(S.String),
  resolverType: S.optional(S.String),
}) {}
export class CreateMembershipRequest extends S.Class<CreateMembershipRequest>(
  "CreateMembershipRequest",
)(
  {
    clientToken: S.optional(S.String),
    membershipName: S.String,
    incidentResponseTeam: IncidentResponseTeam,
    optInFeatures: S.optional(OptInFeatures),
    tags: S.optional(TagMap),
    coverEntireOrganization: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/membership" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMembershipRequest extends S.Class<UpdateMembershipRequest>(
  "UpdateMembershipRequest",
)(
  {
    membershipId: S.String.pipe(T.HttpLabel("membershipId")),
    membershipName: S.optional(S.String),
    incidentResponseTeam: S.optional(IncidentResponseTeam),
    optInFeatures: S.optional(OptInFeatures),
    membershipAccountsConfigurationsUpdate: S.optional(
      MembershipAccountsConfigurationsUpdate,
    ),
    undoMembershipCancellation: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/membership/{membershipId}/update-membership",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMembershipResponse extends S.Class<UpdateMembershipResponse>(
  "UpdateMembershipResponse",
)({}) {}
export class CancelMembershipResponse extends S.Class<CancelMembershipResponse>(
  "CancelMembershipResponse",
)({ membershipId: S.String }) {}
export class CaseAttachmentAttributes extends S.Class<CaseAttachmentAttributes>(
  "CaseAttachmentAttributes",
)({
  attachmentId: S.String,
  fileName: S.String,
  attachmentStatus: S.String,
  creator: S.String,
  createdDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const CaseAttachmentsList = S.Array(CaseAttachmentAttributes);
export class ListCasesItem extends S.Class<ListCasesItem>("ListCasesItem")({
  caseId: S.String,
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  title: S.optional(S.String),
  caseArn: S.optional(S.String),
  engagementType: S.optional(S.String),
  caseStatus: S.optional(S.String),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  resolverType: S.optional(S.String),
  pendingAction: S.optional(S.String),
}) {}
export const ListCasesItems = S.Array(ListCasesItem);
export class CaseEditItem extends S.Class<CaseEditItem>("CaseEditItem")({
  eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  principal: S.optional(S.String),
  action: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const CaseEditItems = S.Array(CaseEditItem);
export class ListCommentsItem extends S.Class<ListCommentsItem>(
  "ListCommentsItem",
)({
  commentId: S.String,
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creator: S.optional(S.String),
  lastUpdatedBy: S.optional(S.String),
  body: S.optional(S.String),
}) {}
export const ListCommentsItems = S.Array(ListCommentsItem);
export class MembershipAccountsConfigurations extends S.Class<MembershipAccountsConfigurations>(
  "MembershipAccountsConfigurations",
)({
  coverEntireOrganization: S.optional(S.Boolean),
  organizationalUnits: S.optional(OrganizationalUnits),
}) {}
export class ListMembershipItem extends S.Class<ListMembershipItem>(
  "ListMembershipItem",
)({
  membershipId: S.String,
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  membershipArn: S.optional(S.String),
  membershipStatus: S.optional(S.String),
}) {}
export const ListMembershipItems = S.Array(ListMembershipItem);
export class GetMembershipAccountDetailItem extends S.Class<GetMembershipAccountDetailItem>(
  "GetMembershipAccountDetailItem",
)({
  accountId: S.optional(S.String),
  relationshipStatus: S.optional(S.String),
  relationshipType: S.optional(S.String),
}) {}
export const GetMembershipAccountDetailItems = S.Array(
  GetMembershipAccountDetailItem,
);
export class GetMembershipAccountDetailError extends S.Class<GetMembershipAccountDetailError>(
  "GetMembershipAccountDetailError",
)({ accountId: S.String, error: S.String, message: S.String }) {}
export const GetMembershipAccountDetailErrors = S.Array(
  GetMembershipAccountDetailError,
);
export class CreateCaseResponse extends S.Class<CreateCaseResponse>(
  "CreateCaseResponse",
)({ caseId: S.String }) {}
export class GetCaseResponse extends S.Class<GetCaseResponse>(
  "GetCaseResponse",
)({
  title: S.optional(S.String),
  caseArn: S.optional(S.String),
  description: S.optional(S.String),
  caseStatus: S.optional(S.String),
  engagementType: S.optional(S.String),
  reportedIncidentStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  actualIncidentStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  impactedAwsRegions: S.optional(ImpactedAwsRegionList),
  threatActorIpAddresses: S.optional(ThreatActorIpList),
  pendingAction: S.optional(S.String),
  impactedAccounts: S.optional(ImpactedAccounts),
  watchers: S.optional(Watchers),
  createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  closureCode: S.optional(S.String),
  resolverType: S.optional(S.String),
  impactedServices: S.optional(ImpactedServicesList),
  caseAttachments: S.optional(CaseAttachmentsList),
  closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  caseMetadata: S.optional(CaseMetadata),
}) {}
export class ListCasesResponse extends S.Class<ListCasesResponse>(
  "ListCasesResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(ListCasesItems),
  total: S.optional(S.Number),
}) {}
export class ListCaseEditsResponse extends S.Class<ListCaseEditsResponse>(
  "ListCaseEditsResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(CaseEditItems),
  total: S.optional(S.Number),
}) {}
export class ListCommentsResponse extends S.Class<ListCommentsResponse>(
  "ListCommentsResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(ListCommentsItems),
  total: S.optional(S.Number),
}) {}
export class CreateMembershipResponse extends S.Class<CreateMembershipResponse>(
  "CreateMembershipResponse",
)({ membershipId: S.String }) {}
export class GetMembershipResponse extends S.Class<GetMembershipResponse>(
  "GetMembershipResponse",
)({
  membershipId: S.String,
  accountId: S.optional(S.String),
  region: S.optional(S.String),
  membershipName: S.optional(S.String),
  membershipArn: S.optional(S.String),
  membershipStatus: S.optional(S.String),
  membershipActivationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  membershipDeactivationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  customerType: S.optional(S.String),
  numberOfAccountsCovered: S.optional(S.Number),
  incidentResponseTeam: S.optional(IncidentResponseTeam),
  optInFeatures: S.optional(OptInFeatures),
  membershipAccountsConfigurations: S.optional(
    MembershipAccountsConfigurations,
  ),
}) {}
export class ListMembershipsResponse extends S.Class<ListMembershipsResponse>(
  "ListMembershipsResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(ListMembershipItems),
}) {}
export class BatchGetMemberAccountDetailsResponse extends S.Class<BatchGetMemberAccountDetailsResponse>(
  "BatchGetMemberAccountDetailsResponse",
)({
  items: S.optional(GetMembershipAccountDetailItems),
  errors: S.optional(GetMembershipAccountDetailErrors),
}) {}
export class InvestigationFeedback extends S.Class<InvestigationFeedback>(
  "InvestigationFeedback",
)({
  usefulness: S.optional(S.String),
  comment: S.optional(S.String),
  submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class InvestigationAction extends S.Class<InvestigationAction>(
  "InvestigationAction",
)({
  investigationId: S.String,
  actionType: S.String,
  title: S.String,
  content: S.String,
  status: S.String,
  lastUpdated: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  feedback: S.optional(InvestigationFeedback),
}) {}
export const InvestigationActionList = S.Array(InvestigationAction);
export class ListInvestigationsResponse extends S.Class<ListInvestigationsResponse>(
  "ListInvestigationsResponse",
)({
  nextToken: S.optional(S.String),
  investigationActions: InvestigationActionList,
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Send feedback based on response investigation action
 */
export const sendFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendFeedbackRequest,
  output: SendFeedbackResponse,
  errors: [],
}));
/**
 * Updates an existing case.
 */
export const updateCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseRequest,
  output: UpdateCaseResponse,
  errors: [],
}));
/**
 * Closes an existing case.
 */
export const closeCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseCaseRequest,
  output: CloseCaseResponse,
  errors: [],
}));
/**
 * Adds a comment to an existing case.
 */
export const createCaseComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseCommentRequest,
  output: CreateCaseCommentResponse,
  errors: [],
}));
/**
 * Returns a Pre-Signed URL for uploading attachments into a case.
 */
export const getCaseAttachmentDownloadUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCaseAttachmentDownloadUrlRequest,
    output: GetCaseAttachmentDownloadUrlResponse,
    errors: [],
  }));
/**
 * Uploads an attachment to a case.
 */
export const getCaseAttachmentUploadUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCaseAttachmentUploadUrlRequest,
    output: GetCaseAttachmentUploadUrlResponse,
    errors: [],
  }),
);
/**
 * Updates an existing case comment.
 */
export const updateCaseComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseCommentRequest,
  output: UpdateCaseCommentResponse,
  errors: [],
}));
/**
 * Updates the state transitions for a designated cases.
 *
 * **Self-managed**: the following states are available for self-managed cases.
 *
 * - Submitted → Detection and Analysis
 *
 * - Detection and Analysis → Containment, Eradication, and Recovery
 *
 * - Detection and Analysis → Post-incident Activities
 *
 * - Containment, Eradication, and Recovery → Detection and Analysis
 *
 * - Containment, Eradication, and Recovery → Post-incident Activities
 *
 * - Post-incident Activities → Containment, Eradication, and Recovery
 *
 * - Post-incident Activities → Detection and Analysis
 *
 * - Any → Closed
 *
 * **AWS supported**: You must use the `CloseCase` API to close.
 */
export const updateCaseStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseStatusRequest,
  output: UpdateCaseStatusResponse,
  errors: [],
}));
/**
 * Updates the resolver type for a case.
 *
 * This is a one-way action and cannot be reversed.
 */
export const updateResolverType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverTypeRequest,
  output: UpdateResolverTypeResponse,
  errors: [],
}));
/**
 * Updates membership configuration.
 */
export const updateMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMembershipRequest,
  output: UpdateMembershipResponse,
  errors: [],
}));
/**
 * Cancels an existing membership.
 */
export const cancelMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMembershipRequest,
  output: CancelMembershipResponse,
  errors: [],
}));
/**
 * Creates a new case.
 */
export const createCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseRequest,
  output: CreateCaseResponse,
  errors: [],
}));
/**
 * Returns the attributes of a case.
 */
export const getCase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCaseRequest,
  output: GetCaseResponse,
  errors: [],
}));
/**
 * Lists all cases the requester has access to.
 */
export const listCases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCasesRequest,
  output: ListCasesResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Views the case history for edits made to a designated case.
 */
export const listCaseEdits = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCaseEditsRequest,
    output: ListCaseEditsResponse,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns comments for a designated case.
 */
export const listComments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCommentsRequest,
    output: ListCommentsResponse,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a new membership.
 */
export const createMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembershipRequest,
  output: CreateMembershipResponse,
  errors: [],
}));
/**
 * Returns the attributes of a membership.
 */
export const getMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembershipRequest,
  output: GetMembershipResponse,
  errors: [],
}));
/**
 * Returns the memberships that the calling principal can access.
 */
export const listMemberships = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMembershipsRequest,
    output: ListMembershipsResponse,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Provides information on whether the supplied account IDs are associated with a membership.
 *
 * AWS account ID's may appear less than 12 characters and need to be zero-prepended. An example would be `123123123` which is nine digits, and with zero-prepend would be `000123123123`. Not zero-prepending to 12 digits could result in errors.
 */
export const batchGetMemberAccountDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetMemberAccountDetailsRequest,
    output: BatchGetMemberAccountDetailsResponse,
    errors: [],
  }));
/**
 * Investigation performed by an agent for a security incident...
 */
export const listInvestigations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInvestigationsRequest,
    output: ListInvestigationsResponse,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "investigationActions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Removes a tag(s) from a designate resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns currently configured tags on a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a tag(s) to a designated resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
