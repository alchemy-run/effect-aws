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
export type CaseTitle = string | redacted.Redacted<string>;
export type CaseDescription = string | redacted.Redacted<string>;
export type AWSAccountId = string;
export type AwsService = string;
export type CaseId = string;
export type CommentBody = string | redacted.Redacted<string>;
export type AttachmentId = string;
export type FileName = string | redacted.Redacted<string>;
export type ContentLength = number;
export type ResultId = string;
export type FeedbackComment = string;
export type CommentId = string;
export type MembershipName = string | redacted.Redacted<string>;
export type MembershipId = string;
export type TagValue = string;
export type EmailAddress = string | redacted.Redacted<string>;
export type PersonName = string | redacted.Redacted<string>;
export type JobTitle = string | redacted.Redacted<string>;
export type IPAddress = string | redacted.Redacted<string>;
export type UserAgent = string;
export type IncidentResponderName = string | redacted.Redacted<string>;
export type OrganizationalUnitId = string;
export type CaseArn = string;
export type Url = string | redacted.Redacted<string>;
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
export type ResolverType = "AWS" | "Self";
export const ResolverType = S.Literal("AWS", "Self");
export type EngagementType = "Security Incident" | "Investigation";
export const EngagementType = S.Literal("Security Incident", "Investigation");
export type ImpactedAccounts = string[];
export const ImpactedAccounts = S.Array(S.String);
export type ImpactedServicesList = string[];
export const ImpactedServicesList = S.Array(S.String);
export type UsefulnessRating = "USEFUL" | "NOT_USEFUL";
export const UsefulnessRating = S.Literal("USEFUL", "NOT_USEFUL");
export type SelfManagedCaseStatus =
  | "Submitted"
  | "Detection and Analysis"
  | "Containment, Eradication and Recovery"
  | "Post-incident Activities";
export const SelfManagedCaseStatus = S.Literal(
  "Submitted",
  "Detection and Analysis",
  "Containment, Eradication and Recovery",
  "Post-incident Activities",
);
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
  tagKeys: string[];
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
  body: string | redacted.Redacted<string>;
}
export const CreateCaseCommentRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
  fileName: string | redacted.Redacted<string>;
  contentLength: number;
  clientToken?: string;
}
export const GetCaseAttachmentUploadUrlRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    fileName: SensitiveString,
    contentLength: S.Number,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
  usefulness: UsefulnessRating;
  comment?: string;
}
export const SendFeedbackRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    resultId: S.String.pipe(T.HttpLabel("resultId")),
    usefulness: UsefulnessRating,
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
  body: string | redacted.Redacted<string>;
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
  caseStatus: SelfManagedCaseStatus;
}
export const UpdateCaseStatusRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    caseStatus: SelfManagedCaseStatus,
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
  resolverType: ResolverType;
}
export const UpdateResolverTypeRequest = S.suspend(() =>
  S.Struct({
    caseId: S.String.pipe(T.HttpLabel("caseId")),
    resolverType: ResolverType,
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
  accountIds: string[];
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
export type AwsRegion =
  | "af-south-1"
  | "ap-east-1"
  | "ap-east-2"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "ap-south-1"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-southeast-4"
  | "ap-southeast-5"
  | "ap-southeast-6"
  | "ap-southeast-7"
  | "ca-central-1"
  | "ca-west-1"
  | "cn-north-1"
  | "cn-northwest-1"
  | "eu-central-1"
  | "eu-central-2"
  | "eu-north-1"
  | "eu-south-1"
  | "eu-south-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "il-central-1"
  | "me-central-1"
  | "me-south-1"
  | "mx-central-1"
  | "sa-east-1"
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2";
export const AwsRegion = S.Literal(
  "af-south-1",
  "ap-east-1",
  "ap-east-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-south-1",
  "ap-south-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-southeast-4",
  "ap-southeast-5",
  "ap-southeast-6",
  "ap-southeast-7",
  "ca-central-1",
  "ca-west-1",
  "cn-north-1",
  "cn-northwest-1",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "eu-south-1",
  "eu-south-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "il-central-1",
  "me-central-1",
  "me-south-1",
  "mx-central-1",
  "sa-east-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
);
export type CommunicationType =
  | "Case Created"
  | "Case Updated"
  | "Case Acknowledged"
  | "Case Closed"
  | "Case Updated To Service Managed"
  | "Case Status Updated"
  | "Case Pending Customer Action Reminder"
  | "Case Attachment Url Uploaded"
  | "Case Comment Added"
  | "Case Comment Updated"
  | "Membership Created"
  | "Membership Updated"
  | "Membership Cancelled"
  | "Register Delegated Administrator"
  | "Deregister Delegated Administrator"
  | "Disable AWS Service Access";
export const CommunicationType = S.Literal(
  "Case Created",
  "Case Updated",
  "Case Acknowledged",
  "Case Closed",
  "Case Updated To Service Managed",
  "Case Status Updated",
  "Case Pending Customer Action Reminder",
  "Case Attachment Url Uploaded",
  "Case Comment Added",
  "Case Comment Updated",
  "Membership Created",
  "Membership Updated",
  "Membership Cancelled",
  "Register Delegated Administrator",
  "Deregister Delegated Administrator",
  "Disable AWS Service Access",
);
export type CommunicationPreferences = CommunicationType[];
export const CommunicationPreferences = S.Array(CommunicationType);
export type OptInFeatureName = "Triage";
export const OptInFeatureName = S.Literal("Triage");
export type OrganizationalUnits = string[];
export const OrganizationalUnits = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface Watcher {
  email: string | redacted.Redacted<string>;
  name?: string | redacted.Redacted<string>;
  jobTitle?: string | redacted.Redacted<string>;
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
  ipAddress: string | redacted.Redacted<string>;
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
  region: AwsRegion;
}
export const ImpactedAwsRegion = S.suspend(() =>
  S.Struct({ region: AwsRegion }),
).annotations({
  identifier: "ImpactedAwsRegion",
}) as any as S.Schema<ImpactedAwsRegion>;
export type ImpactedAwsRegionList = ImpactedAwsRegion[];
export const ImpactedAwsRegionList = S.Array(ImpactedAwsRegion);
export type CaseStatus =
  | "Submitted"
  | "Acknowledged"
  | "Detection and Analysis"
  | "Containment, Eradication and Recovery"
  | "Post-incident Activities"
  | "Ready to Close"
  | "Closed";
export const CaseStatus = S.Literal(
  "Submitted",
  "Acknowledged",
  "Detection and Analysis",
  "Containment, Eradication and Recovery",
  "Post-incident Activities",
  "Ready to Close",
  "Closed",
);
export type PendingAction = "Customer" | "None";
export const PendingAction = S.Literal("Customer", "None");
export type ClosureCode =
  | "Investigation Completed"
  | "Not Resolved"
  | "False Positive"
  | "Duplicate";
export const ClosureCode = S.Literal(
  "Investigation Completed",
  "Not Resolved",
  "False Positive",
  "Duplicate",
);
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
  name: string | redacted.Redacted<string>;
  jobTitle: string | redacted.Redacted<string>;
  email: string | redacted.Redacted<string>;
  communicationPreferences?: CommunicationType[];
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
  featureName: OptInFeatureName;
  isEnabled: boolean;
}
export const OptInFeature = S.suspend(() =>
  S.Struct({ featureName: OptInFeatureName, isEnabled: S.Boolean }),
).annotations({ identifier: "OptInFeature" }) as any as S.Schema<OptInFeature>;
export type OptInFeatures = OptInFeature[];
export const OptInFeatures = S.Array(OptInFeature);
export type MembershipStatus = "Active" | "Cancelled" | "Terminated";
export const MembershipStatus = S.Literal("Active", "Cancelled", "Terminated");
export type CustomerType = "Standalone" | "Organization";
export const CustomerType = S.Literal("Standalone", "Organization");
export interface MembershipAccountsConfigurationsUpdate {
  coverEntireOrganization?: boolean;
  organizationalUnitsToAdd?: string[];
  organizationalUnitsToRemove?: string[];
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
  tags: { [key: string]: string };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: { [key: string]: string };
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
  resolverType: ResolverType;
  title: string | redacted.Redacted<string>;
  description: string | redacted.Redacted<string>;
  engagementType: EngagementType;
  reportedIncidentStartDate: Date;
  impactedAccounts: string[];
  watchers: Watcher[];
  threatActorIpAddresses?: ThreatActorIp[];
  impactedServices?: string[];
  impactedAwsRegions?: ImpactedAwsRegion[];
  tags?: { [key: string]: string };
}
export const CreateCaseRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    resolverType: ResolverType,
    title: SensitiveString,
    description: SensitiveString,
    engagementType: EngagementType,
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
  title?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  reportedIncidentStartDate?: Date;
  actualIncidentStartDate?: Date;
  engagementType?: EngagementType;
  watchersToAdd?: Watcher[];
  watchersToDelete?: Watcher[];
  threatActorIpAddressesToAdd?: ThreatActorIp[];
  threatActorIpAddressesToDelete?: ThreatActorIp[];
  impactedServicesToAdd?: string[];
  impactedServicesToDelete?: string[];
  impactedAwsRegionsToAdd?: ImpactedAwsRegion[];
  impactedAwsRegionsToDelete?: ImpactedAwsRegion[];
  impactedAccountsToAdd?: string[];
  impactedAccountsToDelete?: string[];
  caseMetadata?: CaseMetadataEntry[];
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
    engagementType: S.optional(EngagementType),
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
  caseStatus?: CaseStatus;
  closedDate?: Date;
}
export const CloseCaseResponse = S.suspend(() =>
  S.Struct({
    caseStatus: S.optional(CaseStatus),
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
  attachmentPresignedUrl: string | redacted.Redacted<string>;
}
export const GetCaseAttachmentDownloadUrlResponse = S.suspend(() =>
  S.Struct({ attachmentPresignedUrl: SensitiveString }),
).annotations({
  identifier: "GetCaseAttachmentDownloadUrlResponse",
}) as any as S.Schema<GetCaseAttachmentDownloadUrlResponse>;
export interface GetCaseAttachmentUploadUrlResponse {
  attachmentPresignedUrl: string | redacted.Redacted<string>;
}
export const GetCaseAttachmentUploadUrlResponse = S.suspend(() =>
  S.Struct({ attachmentPresignedUrl: SensitiveString }),
).annotations({
  identifier: "GetCaseAttachmentUploadUrlResponse",
}) as any as S.Schema<GetCaseAttachmentUploadUrlResponse>;
export interface UpdateCaseCommentResponse {
  commentId: string;
  body?: string | redacted.Redacted<string>;
}
export const UpdateCaseCommentResponse = S.suspend(() =>
  S.Struct({ commentId: S.String, body: S.optional(SensitiveString) }),
).annotations({
  identifier: "UpdateCaseCommentResponse",
}) as any as S.Schema<UpdateCaseCommentResponse>;
export interface UpdateCaseStatusResponse {
  caseStatus?: SelfManagedCaseStatus;
}
export const UpdateCaseStatusResponse = S.suspend(() =>
  S.Struct({ caseStatus: S.optional(SelfManagedCaseStatus) }),
).annotations({
  identifier: "UpdateCaseStatusResponse",
}) as any as S.Schema<UpdateCaseStatusResponse>;
export interface UpdateResolverTypeResponse {
  caseId: string;
  caseStatus?: CaseStatus;
  resolverType?: ResolverType;
}
export const UpdateResolverTypeResponse = S.suspend(() =>
  S.Struct({
    caseId: S.String,
    caseStatus: S.optional(CaseStatus),
    resolverType: S.optional(ResolverType),
  }),
).annotations({
  identifier: "UpdateResolverTypeResponse",
}) as any as S.Schema<UpdateResolverTypeResponse>;
export interface CreateMembershipRequest {
  clientToken?: string;
  membershipName: string | redacted.Redacted<string>;
  incidentResponseTeam: IncidentResponder[];
  optInFeatures?: OptInFeature[];
  tags?: { [key: string]: string };
  coverEntireOrganization?: boolean;
}
export const CreateMembershipRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
  membershipName?: string | redacted.Redacted<string>;
  incidentResponseTeam?: IncidentResponder[];
  optInFeatures?: OptInFeature[];
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
export type CaseAttachmentStatus = "Verified" | "Failed" | "Pending";
export const CaseAttachmentStatus = S.Literal("Verified", "Failed", "Pending");
export type ActionType = "Evidence" | "Investigation" | "Summarization";
export const ActionType = S.Literal(
  "Evidence",
  "Investigation",
  "Summarization",
);
export type ExecutionStatus =
  | "Pending"
  | "InProgress"
  | "Waiting"
  | "Completed"
  | "Failed"
  | "Cancelled";
export const ExecutionStatus = S.Literal(
  "Pending",
  "InProgress",
  "Waiting",
  "Completed",
  "Failed",
  "Cancelled",
);
export type MembershipAccountRelationshipStatus =
  | "Associated"
  | "Disassociated"
  | "Unassociated";
export const MembershipAccountRelationshipStatus = S.Literal(
  "Associated",
  "Disassociated",
  "Unassociated",
);
export type MembershipAccountRelationshipType = "Organization" | "Unrelated";
export const MembershipAccountRelationshipType = S.Literal(
  "Organization",
  "Unrelated",
);
export interface CaseAttachmentAttributes {
  attachmentId: string;
  fileName: string | redacted.Redacted<string>;
  attachmentStatus: CaseAttachmentStatus;
  creator: string;
  createdDate: Date;
}
export const CaseAttachmentAttributes = S.suspend(() =>
  S.Struct({
    attachmentId: S.String,
    fileName: SensitiveString,
    attachmentStatus: CaseAttachmentStatus,
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
  title?: string | redacted.Redacted<string>;
  caseArn?: string;
  engagementType?: EngagementType;
  caseStatus?: CaseStatus;
  createdDate?: Date;
  closedDate?: Date;
  resolverType?: ResolverType;
  pendingAction?: PendingAction;
}
export const ListCasesItem = S.suspend(() =>
  S.Struct({
    caseId: S.String,
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    title: S.optional(SensitiveString),
    caseArn: S.optional(S.String),
    engagementType: S.optional(EngagementType),
    caseStatus: S.optional(CaseStatus),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    closedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    resolverType: S.optional(ResolverType),
    pendingAction: S.optional(PendingAction),
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
  body?: string | redacted.Redacted<string>;
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
  organizationalUnits?: string[];
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
  region?: AwsRegion;
  membershipArn?: string;
  membershipStatus?: MembershipStatus;
}
export const ListMembershipItem = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    accountId: S.optional(S.String),
    region: S.optional(AwsRegion),
    membershipArn: S.optional(S.String),
    membershipStatus: S.optional(MembershipStatus),
  }),
).annotations({
  identifier: "ListMembershipItem",
}) as any as S.Schema<ListMembershipItem>;
export type ListMembershipItems = ListMembershipItem[];
export const ListMembershipItems = S.Array(ListMembershipItem);
export interface GetMembershipAccountDetailItem {
  accountId?: string;
  relationshipStatus?: MembershipAccountRelationshipStatus;
  relationshipType?: MembershipAccountRelationshipType;
}
export const GetMembershipAccountDetailItem = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    relationshipStatus: S.optional(MembershipAccountRelationshipStatus),
    relationshipType: S.optional(MembershipAccountRelationshipType),
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
  title?: string | redacted.Redacted<string>;
  caseArn?: string;
  description?: string | redacted.Redacted<string>;
  caseStatus?: CaseStatus;
  engagementType?: EngagementType;
  reportedIncidentStartDate?: Date;
  actualIncidentStartDate?: Date;
  impactedAwsRegions?: ImpactedAwsRegion[];
  threatActorIpAddresses?: ThreatActorIp[];
  pendingAction?: PendingAction;
  impactedAccounts?: string[];
  watchers?: Watcher[];
  createdDate?: Date;
  lastUpdatedDate?: Date;
  closureCode?: ClosureCode;
  resolverType?: ResolverType;
  impactedServices?: string[];
  caseAttachments?: CaseAttachmentAttributes[];
  closedDate?: Date;
  caseMetadata?: CaseMetadataEntry[];
}
export const GetCaseResponse = S.suspend(() =>
  S.Struct({
    title: S.optional(SensitiveString),
    caseArn: S.optional(S.String),
    description: S.optional(SensitiveString),
    caseStatus: S.optional(CaseStatus),
    engagementType: S.optional(EngagementType),
    reportedIncidentStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    actualIncidentStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    impactedAwsRegions: S.optional(ImpactedAwsRegionList),
    threatActorIpAddresses: S.optional(ThreatActorIpList),
    pendingAction: S.optional(PendingAction),
    impactedAccounts: S.optional(ImpactedAccounts),
    watchers: S.optional(Watchers),
    createdDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    closureCode: S.optional(ClosureCode),
    resolverType: S.optional(ResolverType),
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
  items?: ListCasesItem[];
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
  items?: CaseEditItem[];
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
  items?: ListCommentsItem[];
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
  region?: AwsRegion;
  membershipName?: string | redacted.Redacted<string>;
  membershipArn?: string;
  membershipStatus?: MembershipStatus;
  membershipActivationTimestamp?: Date;
  membershipDeactivationTimestamp?: Date;
  customerType?: CustomerType;
  numberOfAccountsCovered?: number;
  incidentResponseTeam?: IncidentResponder[];
  optInFeatures?: OptInFeature[];
  membershipAccountsConfigurations?: MembershipAccountsConfigurations;
}
export const GetMembershipResponse = S.suspend(() =>
  S.Struct({
    membershipId: S.String,
    accountId: S.optional(S.String),
    region: S.optional(AwsRegion),
    membershipName: S.optional(SensitiveString),
    membershipArn: S.optional(S.String),
    membershipStatus: S.optional(MembershipStatus),
    membershipActivationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    membershipDeactivationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    customerType: S.optional(CustomerType),
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
  items?: ListMembershipItem[];
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
  items?: GetMembershipAccountDetailItem[];
  errors?: GetMembershipAccountDetailError[];
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
  usefulness?: UsefulnessRating;
  comment?: string;
  submittedAt?: Date;
}
export const InvestigationFeedback = S.suspend(() =>
  S.Struct({
    usefulness: S.optional(UsefulnessRating),
    comment: S.optional(S.String),
    submittedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InvestigationFeedback",
}) as any as S.Schema<InvestigationFeedback>;
export type ValidationExceptionReason =
  | "UNKNOWN_OPERATION"
  | "CANNOT_PARSE"
  | "FIELD_VALIDATION_FAILED"
  | "OTHER";
export const ValidationExceptionReason = S.Literal(
  "UNKNOWN_OPERATION",
  "CANNOT_PARSE",
  "FIELD_VALIDATION_FAILED",
  "OTHER",
);
export interface InvestigationAction {
  investigationId: string;
  actionType: ActionType;
  title: string;
  content: string;
  status: ExecutionStatus;
  lastUpdated: Date;
  feedback?: InvestigationFeedback;
}
export const InvestigationAction = S.suspend(() =>
  S.Struct({
    investigationId: S.String,
    actionType: ActionType,
    title: S.String,
    content: S.String,
    status: ExecutionStatus,
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
  investigationActions: InvestigationAction[];
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
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Send feedback based on response investigation action
 */
export const sendFeedback: (
  input: SendFeedbackRequest,
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
  ): effect.Effect<
    ListCasesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCasesRequest,
  ) => stream.Stream<
    ListCasesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCasesRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListCaseEditsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCaseEditsRequest,
  ) => stream.Stream<
    ListCaseEditsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCaseEditsRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListCommentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommentsRequest,
  ) => stream.Stream<
    ListCommentsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommentsRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
  ): effect.Effect<
    ListMembershipsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembershipsRequest,
  ) => stream.Stream<
    ListMembershipsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembershipsRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
  ): effect.Effect<
    ListInvestigationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvestigationsRequest,
  ) => stream.Stream<
    ListInvestigationsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvestigationsRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
