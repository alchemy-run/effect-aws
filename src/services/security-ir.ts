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
  sdkId: "Security IR",
  serviceShapeName: "SecurityIncidentResponse",
});
const auth = T.AwsAuthSigv4({ name: "security-ir" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
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
            `https://security-ir-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://security-ir.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type CaseTitle = string | Redacted.Redacted<string>;
export type CaseDescription = string | Redacted.Redacted<string>;
export type AWSAccountId = string;
export type AwsService = string;
export type CaseId = string;
export type CommentBody = string | Redacted.Redacted<string>;
export type AttachmentId = string;
export type FileName = string | Redacted.Redacted<string>;
export type ContentLength = number;
export type ResultId = string;
export type FeedbackComment = string;
export type CommentId = string;
export type MembershipName = string | Redacted.Redacted<string>;
export type MembershipId = string;
export type TagValue = string;
export type EmailAddress = string | Redacted.Redacted<string>;
export type PersonName = string | Redacted.Redacted<string>;
export type JobTitle = string | Redacted.Redacted<string>;
export type IPAddress = string | Redacted.Redacted<string>;
export type UserAgent = string;
export type IncidentResponderName = string | Redacted.Redacted<string>;
export type OrganizationalUnitId = string;
export type CaseArn = string;
export type Url = string | Redacted.Redacted<string>;
export type MembershipArn = string;
export type PrincipalId = string;
export type CaseEditAction = string;
export type CaseEditMessage = string;
export type InvestigationId = string;
export type InvestigationTitle = string;
export type InvestigationContent = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type ImpactedAccounts = string[];
export const ImpactedAccounts = S.Array(S.String);
export type ImpactedServicesList = string[];
export const ImpactedServicesList = S.Array(S.String);
export type AWSAccountIds = string[];
export const AWSAccountIds = S.Array(S.String);
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetCaseRequest {
  caseId: string;
}
export const GetCaseRequest = S.suspend(() =>
  S.Struct({ caseId: S.String.pipe(T.HttpLabel("caseId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/cases/{caseId}/get-case" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCaseRequest",
}) as any as S.Schema<GetCaseRequest>;
export interface ListCasesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListCasesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/list-cases" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCasesRequest",
}) as any as S.Schema<ListCasesRequest>;
export interface CloseCaseRequest {
  caseId: string;
}
export const CloseCaseRequest = S.suspend(() =>
  S.Struct({ caseId: S.String.pipe(T.HttpLabel("caseId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/close-case" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CloseCaseRequest",
}) as any as S.Schema<CloseCaseRequest>;
export interface CreateCaseCommentRequest {
  caseId: string;
  clientToken?: string;
  body: string | Redacted.Redacted<string>;
}
export const CreateCaseCommentRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    clientToken: S.optional(S.String),
    body: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/create-comment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCaseCommentRequest",
}) as any as S.Schema<CreateCaseCommentRequest>;
export interface GetCaseAttachmentDownloadUrlRequest {
  caseId: string;
  attachmentId: string;
}
export const GetCaseAttachmentDownloadUrlRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    attachmentId: S.String.pipe(T.HttpLabel("attachmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCaseAttachmentDownloadUrlRequest",
}) as any as S.Schema<GetCaseAttachmentDownloadUrlRequest>;
export interface GetCaseAttachmentUploadUrlRequest {
  caseId: string;
  fileName: string | Redacted.Redacted<string>;
  contentLength: number;
  clientToken?: string;
}
export const GetCaseAttachmentUploadUrlRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    fileName: SensitiveString,
    contentLength: S.Number,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/get-presigned-url" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCaseAttachmentUploadUrlRequest",
}) as any as S.Schema<GetCaseAttachmentUploadUrlRequest>;
export interface ListCaseEditsRequest {
  nextToken?: string;
  maxResults?: number;
  caseId: string;
}
export const ListCaseEditsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/list-case-edits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCaseEditsRequest",
}) as any as S.Schema<ListCaseEditsRequest>;
export interface ListCommentsRequest {
  nextToken?: string;
  maxResults?: number;
  caseId: string;
}
export const ListCommentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/list-comments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommentsRequest",
}) as any as S.Schema<ListCommentsRequest>;
export interface ListInvestigationsRequest {
  nextToken?: string;
  maxResults?: number;
  caseId: string;
}
export const ListInvestigationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    caseId: S.String.pipe(T.HttpLabel("caseId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/cases/{caseId}/list-investigations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInvestigationsRequest",
}) as any as S.Schema<ListInvestigationsRequest>;
export interface SendFeedbackRequest {
  caseId: string;
  resultId: string;
  usefulness: string;
  comment?: string;
}
export const SendFeedbackRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    resultId: S.String.pipe(T.HttpLabel("resultId")),
    usefulness: S.String,
    comment: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "SendFeedbackRequest",
}) as any as S.Schema<SendFeedbackRequest>;
export interface SendFeedbackResponse {}
export const SendFeedbackResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "SendFeedbackResponse",
}) as any as S.Schema<SendFeedbackResponse>;
export interface UpdateCaseCommentRequest {
  caseId: string;
  commentId: string;
  body: string | Redacted.Redacted<string>;
}
export const UpdateCaseCommentRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    commentId: S.String.pipe(T.HttpLabel("commentId")),
    body: SensitiveString,
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateCaseCommentRequest",
}) as any as S.Schema<UpdateCaseCommentRequest>;
export interface UpdateCaseStatusRequest {
  caseId: string;
  caseStatus: string;
}
export const UpdateCaseStatusRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    caseStatus: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/update-case-status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCaseStatusRequest",
}) as any as S.Schema<UpdateCaseStatusRequest>;
export interface UpdateResolverTypeRequest {
  caseId: string;
  resolverType: string;
}
export const UpdateResolverTypeRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    resolverType: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/v1/cases/{caseId}/update-resolver-type",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResolverTypeRequest",
}) as any as S.Schema<UpdateResolverTypeRequest>;
export interface GetMembershipRequest {
  membershipId: string;
}
export const GetMembershipRequest = S.suspend(() =>
  S.Struct({ membershipId: S.String.pipe(T.HttpLabel("membershipId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/membership/{membershipId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMembershipRequest",
}) as any as S.Schema<GetMembershipRequest>;
export interface ListMembershipsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListMembershipsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/memberships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembershipsRequest",
}) as any as S.Schema<ListMembershipsRequest>;
export interface BatchGetMemberAccountDetailsRequest {
  membershipId: string;
  accountIds: AWSAccountIds;
}
export const BatchGetMemberAccountDetailsRequest = S.suspend(() =>
  S.Struct({
    membershipId: S.String.pipe(T.HttpLabel("membershipId")),
    accountIds: AWSAccountIds,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchGetMemberAccountDetailsRequest",
}) as any as S.Schema<BatchGetMemberAccountDetailsRequest>;
export interface CancelMembershipRequest {
  membershipId: string;
}
export const CancelMembershipRequest = S.suspend(() =>
  S.Struct({ membershipId: S.String.pipe(T.HttpLabel("membershipId")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/membership/{membershipId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMembershipRequest",
}) as any as S.Schema<CancelMembershipRequest>;
export type CommunicationPreferences = string[];
export const CommunicationPreferences = S.Array(S.String);
export type OrganizationalUnits = string[];
export const OrganizationalUnits = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface Watcher {
  email: string | Redacted.Redacted<string>;
  name?: string | Redacted.Redacted<string>;
  jobTitle?: string | Redacted.Redacted<string>;
}
export const Watcher = S.suspend(() =>
  S.Struct({
    email: SensitiveString,
    name: S.optional(SensitiveString),
    jobTitle: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Watcher" }) as any as S.Schema<Watcher>;
export type Watchers = Watcher[];
export const Watchers = S.Array(Watcher);
export interface ThreatActorIp {
  ipAddress: string | Redacted.Redacted<string>;
  userAgent?: string;
}
export const ThreatActorIp = S.suspend(() =>
  S.Struct({ ipAddress: SensitiveString, userAgent: S.optional(S.String) }),
).annotations({
  identifier: "ThreatActorIp",
}) as any as S.Schema<ThreatActorIp>;
export type ThreatActorIpList = ThreatActorIp[];
export const ThreatActorIpList = S.Array(ThreatActorIp);
export interface ImpactedAwsRegion {
  region: string;
}
export const ImpactedAwsRegion = S.suspend(() =>
  S.Struct({ region: S.String }),
).annotations({
  identifier: "ImpactedAwsRegion",
}) as any as S.Schema<ImpactedAwsRegion>;
export type ImpactedAwsRegionList = ImpactedAwsRegion[];
export const ImpactedAwsRegionList = S.Array(ImpactedAwsRegion);
export interface CaseMetadataEntry {
  key: string;
  value: string;
}
export const CaseMetadataEntry = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "CaseMetadataEntry",
}) as any as S.Schema<CaseMetadataEntry>;
export type CaseMetadata = CaseMetadataEntry[];
export const CaseMetadata = S.Array(CaseMetadataEntry);
export interface IncidentResponder {
  name: string | Redacted.Redacted<string>;
  jobTitle: string | Redacted.Redacted<string>;
  email: string | Redacted.Redacted<string>;
  communicationPreferences?: CommunicationPreferences;
}
export const IncidentResponder = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    jobTitle: SensitiveString,
    email: SensitiveString,
    communicationPreferences: S.optional(CommunicationPreferences),
  }),
).annotations({
  identifier: "IncidentResponder",
}) as any as S.Schema<IncidentResponder>;
export type IncidentResponseTeam = IncidentResponder[];
export const IncidentResponseTeam = S.Array(IncidentResponder);
export interface OptInFeature {
  featureName: string;
  isEnabled: boolean;
}
export const OptInFeature = S.suspend(() =>
  S.Struct({ featureName: S.String, isEnabled: S.Boolean }),
).annotations({ identifier: "OptInFeature" }) as any as S.Schema<OptInFeature>;
export type OptInFeatures = OptInFeature[];
export const OptInFeatures = S.Array(OptInFeature);
export interface MembershipAccountsConfigurationsUpdate {
  coverEntireOrganization?: boolean;
  organizationalUnitsToAdd?: OrganizationalUnits;
  organizationalUnitsToRemove?: OrganizationalUnits;
}
export const MembershipAccountsConfigurationsUpdate = S.suspend(() =>
  S.Struct({
    coverEntireOrganization: S.optional(S.Boolean),
    organizationalUnitsToAdd: S.optional(OrganizationalUnits),
    organizationalUnitsToRemove: S.optional(OrganizationalUnits),
  }),
).annotations({
  identifier: "MembershipAccountsConfigurationsUpdate",
}) as any as S.Schema<MembershipAccountsConfigurationsUpdate>;
export interface ListTagsForResourceOutput {
  tags: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface CreateCaseRequest {
  clientToken?: string;
  resolverType: string;
  title: string | Redacted.Redacted<string>;
  description: string | Redacted.Redacted<string>;
  engagementType: string;
  reportedIncidentStartDate: Date;
  impactedAccounts: ImpactedAccounts;
  watchers: Watchers;
  threatActorIpAddresses?: ThreatActorIpList;
  impactedServices?: ImpactedServicesList;
  impactedAwsRegions?: ImpactedAwsRegionList;
  tags?: TagMap;
}
export const CreateCaseRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    resolverType: S.String,
    title: SensitiveString,
    description: SensitiveString,
    engagementType: S.String,
    reportedIncidentStartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    impactedAccounts: ImpactedAccounts,
    watchers: Watchers,
    threatActorIpAddresses: S.optional(ThreatActorIpList),
    impactedServices: S.optional(ImpactedServicesList),
    impactedAwsRegions: S.optional(ImpactedAwsRegionList),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/create-case" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCaseRequest",
}) as any as S.Schema<CreateCaseRequest>;
export interface UpdateCaseRequest {
  caseId: string;
  title?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  reportedIncidentStartDate?: Date;
  actualIncidentStartDate?: Date;
  engagementType?: string;
  watchersToAdd?: Watchers;
  watchersToDelete?: Watchers;
  threatActorIpAddressesToAdd?: ThreatActorIpList;
  threatActorIpAddressesToDelete?: ThreatActorIpList;
  impactedServicesToAdd?: ImpactedServicesList;
  impactedServicesToDelete?: ImpactedServicesList;
  impactedAwsRegionsToAdd?: ImpactedAwsRegionList;
  impactedAwsRegionsToDelete?: ImpactedAwsRegionList;
  impactedAccountsToAdd?: ImpactedAccounts;
  impactedAccountsToDelete?: ImpactedAccounts;
  caseMetadata?: CaseMetadata;
}
export const UpdateCaseRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    title: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/cases/{caseId}/update-case" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCaseRequest",
}) as any as S.Schema<UpdateCaseRequest>;
export interface UpdateCaseResponse {}
export const UpdateCaseResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateCaseResponse",
}) as any as S.Schema<UpdateCaseResponse>;
export interface CloseCaseResponse {
  caseStatus?: string;
  closedDate?: Date;
}
export const CloseCaseResponse = S.suspend(() =>
  S.Struct({
    caseStatus: S.optional(S.String),
    closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CloseCaseResponse",
}) as any as S.Schema<CloseCaseResponse>;
export interface CreateCaseCommentResponse {
  commentId: string;
}
export const CreateCaseCommentResponse = S.suspend(() =>
  S.Struct({ commentId: S.String }),
).annotations({
  identifier: "CreateCaseCommentResponse",
}) as any as S.Schema<CreateCaseCommentResponse>;
export interface GetCaseAttachmentDownloadUrlResponse {
  attachmentPresignedUrl: string | Redacted.Redacted<string>;
}
export const GetCaseAttachmentDownloadUrlResponse = S.suspend(() =>
  S.Struct({ attachmentPresignedUrl: SensitiveString }),
).annotations({
  identifier: "GetCaseAttachmentDownloadUrlResponse",
}) as any as S.Schema<GetCaseAttachmentDownloadUrlResponse>;
export interface GetCaseAttachmentUploadUrlResponse {
  attachmentPresignedUrl: string | Redacted.Redacted<string>;
}
export const GetCaseAttachmentUploadUrlResponse = S.suspend(() =>
  S.Struct({ attachmentPresignedUrl: SensitiveString }),
).annotations({
  identifier: "GetCaseAttachmentUploadUrlResponse",
}) as any as S.Schema<GetCaseAttachmentUploadUrlResponse>;
export interface UpdateCaseCommentResponse {
  commentId: string;
  body?: string | Redacted.Redacted<string>;
}
export const UpdateCaseCommentResponse = S.suspend(() =>
  S.Struct({ commentId: S.String, body: S.optional(SensitiveString) }),
).annotations({
  identifier: "UpdateCaseCommentResponse",
}) as any as S.Schema<UpdateCaseCommentResponse>;
export interface UpdateCaseStatusResponse {
  caseStatus?: string;
}
export const UpdateCaseStatusResponse = S.suspend(() =>
  S.Struct({ caseStatus: S.optional(S.String) }),
).annotations({
  identifier: "UpdateCaseStatusResponse",
}) as any as S.Schema<UpdateCaseStatusResponse>;
export interface UpdateResolverTypeResponse {
  caseId: string;
  caseStatus?: string;
  resolverType?: string;
}
export const UpdateResolverTypeResponse = S.suspend(() =>
  S.Struct({
    caseId: S.String,
    caseStatus: S.optional(S.String),
    resolverType: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateResolverTypeResponse",
}) as any as S.Schema<UpdateResolverTypeResponse>;
export interface CreateMembershipRequest {
  clientToken?: string;
  membershipName: string | Redacted.Redacted<string>;
  incidentResponseTeam: IncidentResponseTeam;
  optInFeatures?: OptInFeatures;
  tags?: TagMap;
  coverEntireOrganization?: boolean;
}
export const CreateMembershipRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    membershipName: SensitiveString,
    incidentResponseTeam: IncidentResponseTeam,
    optInFeatures: S.optional(OptInFeatures),
    tags: S.optional(TagMap),
    coverEntireOrganization: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/v1/membership" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMembershipRequest",
}) as any as S.Schema<CreateMembershipRequest>;
export interface UpdateMembershipRequest {
  membershipId: string;
  membershipName?: string | Redacted.Redacted<string>;
  incidentResponseTeam?: IncidentResponseTeam;
  optInFeatures?: OptInFeatures;
  membershipAccountsConfigurationsUpdate?: MembershipAccountsConfigurationsUpdate;
  undoMembershipCancellation?: boolean;
}
export const UpdateMembershipRequest = S.suspend(() =>
  S.Struct({
    membershipId: S.String.pipe(T.HttpLabel("membershipId")),
    membershipName: S.optional(SensitiveString),
    incidentResponseTeam: S.optional(IncidentResponseTeam),
    optInFeatures: S.optional(OptInFeatures),
    membershipAccountsConfigurationsUpdate: S.optional(
      MembershipAccountsConfigurationsUpdate,
    ),
    undoMembershipCancellation: S.optional(S.Boolean),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateMembershipRequest",
}) as any as S.Schema<UpdateMembershipRequest>;
export interface UpdateMembershipResponse {}
export const UpdateMembershipResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMembershipResponse",
}) as any as S.Schema<UpdateMembershipResponse>;
export interface CancelMembershipResponse {
  membershipId: string;
}
export const CancelMembershipResponse = S.suspend(() =>
  S.Struct({ membershipId: S.String }),
).annotations({
  identifier: "CancelMembershipResponse",
}) as any as S.Schema<CancelMembershipResponse>;
export interface CaseAttachmentAttributes {
  attachmentId: string;
  fileName: string | Redacted.Redacted<string>;
  attachmentStatus: string;
  creator: string;
  createdDate: Date;
}
export const CaseAttachmentAttributes = S.suspend(() =>
  S.Struct({
    attachmentId: S.String,
    fileName: SensitiveString,
    attachmentStatus: S.String,
    creator: S.String,
    createdDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CaseAttachmentAttributes",
}) as any as S.Schema<CaseAttachmentAttributes>;
export type CaseAttachmentsList = CaseAttachmentAttributes[];
export const CaseAttachmentsList = S.Array(CaseAttachmentAttributes);
export interface ListCasesItem {
  caseId: string;
  lastUpdatedDate?: Date;
  title?: string | Redacted.Redacted<string>;
  caseArn?: string;
  engagementType?: string;
  caseStatus?: string;
  createdDate?: Date;
  closedDate?: Date;
  resolverType?: string;
  pendingAction?: string;
}
export const ListCasesItem = S.suspend(() =>
  S.Struct({
    caseId: S.String,
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    title: S.optional(SensitiveString),
    caseArn: S.optional(S.String),
    engagementType: S.optional(S.String),
    caseStatus: S.optional(S.String),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    resolverType: S.optional(S.String),
    pendingAction: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCasesItem",
}) as any as S.Schema<ListCasesItem>;
export type ListCasesItems = ListCasesItem[];
export const ListCasesItems = S.Array(ListCasesItem);
export interface CaseEditItem {
  eventTimestamp?: Date;
  principal?: string;
  action?: string;
  message?: string;
}
export const CaseEditItem = S.suspend(() =>
  S.Struct({
    eventTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    principal: S.optional(S.String),
    action: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "CaseEditItem" }) as any as S.Schema<CaseEditItem>;
export type CaseEditItems = CaseEditItem[];
export const CaseEditItems = S.Array(CaseEditItem);
export interface ListCommentsItem {
  commentId: string;
  createdDate?: Date;
  lastUpdatedDate?: Date;
  creator?: string;
  lastUpdatedBy?: string;
  body?: string | Redacted.Redacted<string>;
}
export const ListCommentsItem = S.suspend(() =>
  S.Struct({
    commentId: S.String,
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creator: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
    body: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListCommentsItem",
}) as any as S.Schema<ListCommentsItem>;
export type ListCommentsItems = ListCommentsItem[];
export const ListCommentsItems = S.Array(ListCommentsItem);
export interface MembershipAccountsConfigurations {
  coverEntireOrganization?: boolean;
  organizationalUnits?: OrganizationalUnits;
}
export const MembershipAccountsConfigurations = S.suspend(() =>
  S.Struct({
    coverEntireOrganization: S.optional(S.Boolean),
    organizationalUnits: S.optional(OrganizationalUnits),
  }),
).annotations({
  identifier: "MembershipAccountsConfigurations",
}) as any as S.Schema<MembershipAccountsConfigurations>;
export interface ListMembershipItem {
  membershipId: string;
  accountId?: string;
  region?: string;
  membershipArn?: string;
  membershipStatus?: string;
}
export const ListMembershipItem = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    membershipArn: S.optional(S.String),
    membershipStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMembershipItem",
}) as any as S.Schema<ListMembershipItem>;
export type ListMembershipItems = ListMembershipItem[];
export const ListMembershipItems = S.Array(ListMembershipItem);
export interface GetMembershipAccountDetailItem {
  accountId?: string;
  relationshipStatus?: string;
  relationshipType?: string;
}
export const GetMembershipAccountDetailItem = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    relationshipStatus: S.optional(S.String),
    relationshipType: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMembershipAccountDetailItem",
}) as any as S.Schema<GetMembershipAccountDetailItem>;
export type GetMembershipAccountDetailItems = GetMembershipAccountDetailItem[];
export const GetMembershipAccountDetailItems = S.Array(
  GetMembershipAccountDetailItem,
);
export interface GetMembershipAccountDetailError {
  accountId: string;
  error: string;
  message: string;
}
export const GetMembershipAccountDetailError = S.suspend(() =>
  S.Struct({ accountId: S.String, error: S.String, message: S.String }),
).annotations({
  identifier: "GetMembershipAccountDetailError",
}) as any as S.Schema<GetMembershipAccountDetailError>;
export type GetMembershipAccountDetailErrors =
  GetMembershipAccountDetailError[];
export const GetMembershipAccountDetailErrors = S.Array(
  GetMembershipAccountDetailError,
);
export interface CreateCaseResponse {
  caseId: string;
}
export const CreateCaseResponse = S.suspend(() =>
  S.Struct({ caseId: S.String }),
).annotations({
  identifier: "CreateCaseResponse",
}) as any as S.Schema<CreateCaseResponse>;
export interface GetCaseResponse {
  title?: string | Redacted.Redacted<string>;
  caseArn?: string;
  description?: string | Redacted.Redacted<string>;
  caseStatus?: string;
  engagementType?: string;
  reportedIncidentStartDate?: Date;
  actualIncidentStartDate?: Date;
  impactedAwsRegions?: ImpactedAwsRegionList;
  threatActorIpAddresses?: ThreatActorIpList;
  pendingAction?: string;
  impactedAccounts?: ImpactedAccounts;
  watchers?: Watchers;
  createdDate?: Date;
  lastUpdatedDate?: Date;
  closureCode?: string;
  resolverType?: string;
  impactedServices?: ImpactedServicesList;
  caseAttachments?: CaseAttachmentsList;
  closedDate?: Date;
  caseMetadata?: CaseMetadata;
}
export const GetCaseResponse = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    caseArn: S.optional(S.String),
    description: S.optional(SensitiveString),
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
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    closureCode: S.optional(S.String),
    resolverType: S.optional(S.String),
    impactedServices: S.optional(ImpactedServicesList),
    caseAttachments: S.optional(CaseAttachmentsList),
    closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    caseMetadata: S.optional(CaseMetadata),
  }),
).annotations({
  identifier: "GetCaseResponse",
}) as any as S.Schema<GetCaseResponse>;
export interface ListCasesResponse {
  nextToken?: string;
  items?: ListCasesItems;
  total?: number;
}
export const ListCasesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(ListCasesItems),
    total: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListCasesResponse",
}) as any as S.Schema<ListCasesResponse>;
export interface ListCaseEditsResponse {
  nextToken?: string;
  items?: CaseEditItems;
  total?: number;
}
export const ListCaseEditsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(CaseEditItems),
    total: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListCaseEditsResponse",
}) as any as S.Schema<ListCaseEditsResponse>;
export interface ListCommentsResponse {
  nextToken?: string;
  items?: ListCommentsItems;
  total?: number;
}
export const ListCommentsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(ListCommentsItems),
    total: S.optional(S.Number),
  }),
).annotations({
  identifier: "ListCommentsResponse",
}) as any as S.Schema<ListCommentsResponse>;
export interface CreateMembershipResponse {
  membershipId: string;
}
export const CreateMembershipResponse = S.suspend(() =>
  S.Struct({ membershipId: S.String }),
).annotations({
  identifier: "CreateMembershipResponse",
}) as any as S.Schema<CreateMembershipResponse>;
export interface GetMembershipResponse {
  membershipId: string;
  accountId?: string;
  region?: string;
  membershipName?: string | Redacted.Redacted<string>;
  membershipArn?: string;
  membershipStatus?: string;
  membershipActivationTimestamp?: Date;
  membershipDeactivationTimestamp?: Date;
  customerType?: string;
  numberOfAccountsCovered?: number;
  incidentResponseTeam?: IncidentResponseTeam;
  optInFeatures?: OptInFeatures;
  membershipAccountsConfigurations?: MembershipAccountsConfigurations;
}
export const GetMembershipResponse = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    membershipName: S.optional(SensitiveString),
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
  }),
).annotations({
  identifier: "GetMembershipResponse",
}) as any as S.Schema<GetMembershipResponse>;
export interface ListMembershipsResponse {
  nextToken?: string;
  items?: ListMembershipItems;
}
export const ListMembershipsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(ListMembershipItems),
  }),
).annotations({
  identifier: "ListMembershipsResponse",
}) as any as S.Schema<ListMembershipsResponse>;
export interface BatchGetMemberAccountDetailsResponse {
  items?: GetMembershipAccountDetailItems;
  errors?: GetMembershipAccountDetailErrors;
}
export const BatchGetMemberAccountDetailsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(GetMembershipAccountDetailItems),
    errors: S.optional(GetMembershipAccountDetailErrors),
  }),
).annotations({
  identifier: "BatchGetMemberAccountDetailsResponse",
}) as any as S.Schema<BatchGetMemberAccountDetailsResponse>;
export interface InvestigationFeedback {
  usefulness?: string;
  comment?: string;
  submittedAt?: Date;
}
export const InvestigationFeedback = S.suspend(() =>
  S.Struct({
    usefulness: S.optional(S.String),
    comment: S.optional(S.String),
    submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InvestigationFeedback",
}) as any as S.Schema<InvestigationFeedback>;
export interface InvestigationAction {
  investigationId: string;
  actionType: string;
  title: string;
  content: string;
  status: string;
  lastUpdated: Date;
  feedback?: InvestigationFeedback;
}
export const InvestigationAction = S.suspend(() =>
  S.Struct({
    investigationId: S.String,
    actionType: S.String,
    title: S.String,
    content: S.String,
    status: S.String,
    lastUpdated: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    feedback: S.optional(InvestigationFeedback),
  }),
).annotations({
  identifier: "InvestigationAction",
}) as any as S.Schema<InvestigationAction>;
export type InvestigationActionList = InvestigationAction[];
export const InvestigationActionList = S.Array(InvestigationAction);
export interface ListInvestigationsResponse {
  nextToken?: string;
  investigationActions: InvestigationActionList;
}
export const ListInvestigationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    investigationActions: InvestigationActionList,
  }),
).annotations({
  identifier: "ListInvestigationsResponse",
}) as any as S.Schema<ListInvestigationsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Send feedback based on response investigation action
 */
export const sendFeedback: (
  input: SendFeedbackRequest,
) => Effect.Effect<
  SendFeedbackResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendFeedbackRequest,
  output: SendFeedbackResponse,
  errors: [],
}));
/**
 * Updates an existing case.
 */
export const updateCase: (
  input: UpdateCaseRequest,
) => Effect.Effect<
  UpdateCaseResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseRequest,
  output: UpdateCaseResponse,
  errors: [],
}));
/**
 * Closes an existing case.
 */
export const closeCase: (
  input: CloseCaseRequest,
) => Effect.Effect<
  CloseCaseResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseCaseRequest,
  output: CloseCaseResponse,
  errors: [],
}));
/**
 * Adds a comment to an existing case.
 */
export const createCaseComment: (
  input: CreateCaseCommentRequest,
) => Effect.Effect<
  CreateCaseCommentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseCommentRequest,
  output: CreateCaseCommentResponse,
  errors: [],
}));
/**
 * Returns a Pre-Signed URL for uploading attachments into a case.
 */
export const getCaseAttachmentDownloadUrl: (
  input: GetCaseAttachmentDownloadUrlRequest,
) => Effect.Effect<
  GetCaseAttachmentDownloadUrlResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCaseAttachmentDownloadUrlRequest,
  output: GetCaseAttachmentDownloadUrlResponse,
  errors: [],
}));
/**
 * Uploads an attachment to a case.
 */
export const getCaseAttachmentUploadUrl: (
  input: GetCaseAttachmentUploadUrlRequest,
) => Effect.Effect<
  GetCaseAttachmentUploadUrlResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCaseAttachmentUploadUrlRequest,
  output: GetCaseAttachmentUploadUrlResponse,
  errors: [],
}));
/**
 * Updates an existing case comment.
 */
export const updateCaseComment: (
  input: UpdateCaseCommentRequest,
) => Effect.Effect<
  UpdateCaseCommentResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCaseStatus: (
  input: UpdateCaseStatusRequest,
) => Effect.Effect<
  UpdateCaseStatusResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCaseStatusRequest,
  output: UpdateCaseStatusResponse,
  errors: [],
}));
/**
 * Updates the resolver type for a case.
 *
 * This is a one-way action and cannot be reversed.
 */
export const updateResolverType: (
  input: UpdateResolverTypeRequest,
) => Effect.Effect<
  UpdateResolverTypeResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResolverTypeRequest,
  output: UpdateResolverTypeResponse,
  errors: [],
}));
/**
 * Updates membership configuration.
 */
export const updateMembership: (
  input: UpdateMembershipRequest,
) => Effect.Effect<
  UpdateMembershipResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMembershipRequest,
  output: UpdateMembershipResponse,
  errors: [],
}));
/**
 * Cancels an existing membership.
 */
export const cancelMembership: (
  input: CancelMembershipRequest,
) => Effect.Effect<
  CancelMembershipResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMembershipRequest,
  output: CancelMembershipResponse,
  errors: [],
}));
/**
 * Creates a new case.
 */
export const createCase: (
  input: CreateCaseRequest,
) => Effect.Effect<
  CreateCaseResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCaseRequest,
  output: CreateCaseResponse,
  errors: [],
}));
/**
 * Returns the attributes of a case.
 */
export const getCase: (
  input: GetCaseRequest,
) => Effect.Effect<
  GetCaseResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCaseRequest,
  output: GetCaseResponse,
  errors: [],
}));
/**
 * Lists all cases the requester has access to.
 */
export const listCases: {
  (
    input: ListCasesRequest,
  ): Effect.Effect<
    ListCasesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCasesRequest,
  ) => Stream.Stream<
    ListCasesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCasesRequest,
  ) => Stream.Stream<
    ListCasesItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCaseEdits: {
  (
    input: ListCaseEditsRequest,
  ): Effect.Effect<
    ListCaseEditsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCaseEditsRequest,
  ) => Stream.Stream<
    ListCaseEditsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCaseEditsRequest,
  ) => Stream.Stream<
    CaseEditItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCaseEditsRequest,
  output: ListCaseEditsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns comments for a designated case.
 */
export const listComments: {
  (
    input: ListCommentsRequest,
  ): Effect.Effect<
    ListCommentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommentsRequest,
  ) => Stream.Stream<
    ListCommentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommentsRequest,
  ) => Stream.Stream<
    ListCommentsItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommentsRequest,
  output: ListCommentsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new membership.
 */
export const createMembership: (
  input: CreateMembershipRequest,
) => Effect.Effect<
  CreateMembershipResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembershipRequest,
  output: CreateMembershipResponse,
  errors: [],
}));
/**
 * Returns the attributes of a membership.
 */
export const getMembership: (
  input: GetMembershipRequest,
) => Effect.Effect<
  GetMembershipResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembershipRequest,
  output: GetMembershipResponse,
  errors: [],
}));
/**
 * Returns the memberships that the calling principal can access.
 */
export const listMemberships: {
  (
    input: ListMembershipsRequest,
  ): Effect.Effect<
    ListMembershipsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembershipsRequest,
  ) => Stream.Stream<
    ListMembershipsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembershipsRequest,
  ) => Stream.Stream<
    ListMembershipItem,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembershipsRequest,
  output: ListMembershipsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides information on whether the supplied account IDs are associated with a membership.
 *
 * AWS account ID's may appear less than 12 characters and need to be zero-prepended. An example would be `123123123` which is nine digits, and with zero-prepend would be `000123123123`. Not zero-prepending to 12 digits could result in errors.
 */
export const batchGetMemberAccountDetails: (
  input: BatchGetMemberAccountDetailsRequest,
) => Effect.Effect<
  BatchGetMemberAccountDetailsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetMemberAccountDetailsRequest,
  output: BatchGetMemberAccountDetailsResponse,
  errors: [],
}));
/**
 * Investigation performed by an agent for a security incident...
 */
export const listInvestigations: {
  (
    input: ListInvestigationsRequest,
  ): Effect.Effect<
    ListInvestigationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvestigationsRequest,
  ) => Stream.Stream<
    ListInvestigationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvestigationsRequest,
  ) => Stream.Stream<
    InvestigationAction,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvestigationsRequest,
  output: ListInvestigationsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "investigationActions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes a tag(s) from a designate resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
