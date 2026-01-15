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
  sdkId: "WellArchitected",
  serviceShapeName: "WellArchitectedApiServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "wellarchitected" });
const ver = T.ServiceVersion("2020-03-31");
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
              `https://wellarchitected-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://wellarchitected-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://wellarchitected.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://wellarchitected.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type WorkloadId = string;
export type LensAlias = string;
export type ProfileArn = string;
export type SharedWith = string;
export type ClientRequestToken = string;
export type LensVersion = string;
export type IsMajorVersion = boolean;
export type MilestoneName = string;
export type ProfileName = string;
export type ProfileDescription = string;
export type TemplateName = string;
export type TemplateDescription = string;
export type Notes = string;
export type TemplateArn = string;
export type WorkloadName = string;
export type WorkloadDescription = string;
export type AwsAccountId = string;
export type AwsRegion = string;
export type WorkloadNonAwsRegion = string;
export type PillarId = string;
export type WorkloadArchitecturalDesign = string;
export type WorkloadReviewOwner = string;
export type WorkloadIndustryType = string;
export type WorkloadIndustry = string;
export type ApplicationArn = string;
export type ShareId = string;
export type QuestionId = string;
export type MilestoneNumber = number;
export type IncludeSharedResources = boolean;
export type NextToken = string;
export type GetConsolidatedReportMaxResults = number;
export type ProfileVersion = string;
export type LensJSON = string;
export type ListAnswersMaxResults = number;
export type MaxResults = number;
export type LensArn = string;
export type ChoiceId = string;
export type LensName = string;
export type ListLensReviewImprovementsMaxResults = number;
export type SharedWithPrefix = string;
export type ListWorkloadSharesMaxResults = number;
export type ListNotificationsMaxResults = number;
export type ResourceArn = string;
export type ProfileNamePrefix = string;
export type ListProfileSharesMaxResults = number;
export type ListReviewTemplateAnswersMaxResults = number;
export type WorkloadNamePrefix = string;
export type LensNamePrefix = string;
export type ListShareInvitationsMaxResults = number;
export type TemplateNamePrefix = string;
export type WorkloadArn = string;
export type ListTemplateSharesMaxResults = number;
export type ListWorkloadsMaxResults = number;
export type TagKey = string;
export type IsApplicable = boolean;
export type ShareInvitationId = string;
export type IsReviewOwnerUpdateAcknowledged = boolean;
export type TagValue = string;
export type JiraProjectKey = string;
export type Subdomain = string;
export type StatusMessage = string;
export type ExceptionMessage = string;
export type Base64String = string;
export type QuestionTitle = string;
export type QuestionDescription = string;
export type MinSelectedProfileChoices = number;
export type MaxSelectedProfileChoices = number;
export type ChoiceNotes = string;
export type SelectedQuestionId = string;
export type ImprovementPlanUrl = string;
export type HelpfulResourceUrl = string;
export type DisplayText = string;
export type LensesAppliedCount = number;
export type LensDescription = string;
export type LensOwner = string;
export type CheckId = string;
export type CheckName = string;
export type CheckDescription = string;
export type FlaggedResources = number;
export type ChoiceTitle = string;
export type ChoiceDescription = string;
export type ExceptionResourceId = string;
export type ExceptionResourceType = string;
export type JiraIssueUrl = string;
export type Count = number;
export type PillarName = string;
export type CheckStatusCount = number;
export type QuotaCode = string;
export type ServiceCode = string;
export type ChoiceContentDisplayText = string;
export type ChoiceContentUrl = string;
export type ValidationExceptionFieldName = string;

//# Schemas
export interface GetGlobalSettingsRequest {}
export const GetGlobalSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetGlobalSettingsRequest",
}) as any as S.Schema<GetGlobalSettingsRequest>;
export interface GetProfileTemplateInput {}
export const GetProfileTemplateInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profileTemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileTemplateInput",
}) as any as S.Schema<GetProfileTemplateInput>;
export type LensAliases = string[];
export const LensAliases = S.Array(S.String);
export type ProfileArns = string[];
export const ProfileArns = S.Array(S.String);
export type ReviewTemplateLenses = string[];
export const ReviewTemplateLenses = S.Array(S.String);
export type WorkloadEnvironment =
  | "PRODUCTION"
  | "PREPRODUCTION"
  | (string & {});
export const WorkloadEnvironment = S.String;
export type WorkloadAccountIds = string[];
export const WorkloadAccountIds = S.Array(S.String);
export type WorkloadAwsRegions = string[];
export const WorkloadAwsRegions = S.Array(S.String);
export type WorkloadNonAwsRegions = string[];
export const WorkloadNonAwsRegions = S.Array(S.String);
export type WorkloadPillarPriorities = string[];
export const WorkloadPillarPriorities = S.Array(S.String);
export type WorkloadLenses = string[];
export const WorkloadLenses = S.Array(S.String);
export type WorkloadApplications = string[];
export const WorkloadApplications = S.Array(S.String);
export type WorkloadProfileArns = string[];
export const WorkloadProfileArns = S.Array(S.String);
export type ReviewTemplateArns = string[];
export const ReviewTemplateArns = S.Array(S.String);
export type PermissionType = "READONLY" | "CONTRIBUTOR" | (string & {});
export const PermissionType = S.String;
export type LensStatusType = "ALL" | "DRAFT" | "PUBLISHED" | (string & {});
export const LensStatusType = S.String;
export type ReportFormat = "PDF" | "JSON" | (string & {});
export const ReportFormat = S.String;
export type OrganizationSharingStatus = "ENABLED" | "DISABLED" | (string & {});
export const OrganizationSharingStatus = S.String;
export type DiscoveryIntegrationStatus = "ENABLED" | "DISABLED" | (string & {});
export const DiscoveryIntegrationStatus = S.String;
export type QuestionPriority = "PRIORITIZED" | "NONE" | (string & {});
export const QuestionPriority = S.String;
export type LensType =
  | "AWS_OFFICIAL"
  | "CUSTOM_SHARED"
  | "CUSTOM_SELF"
  | (string & {});
export const LensType = S.String;
export type ShareStatus =
  | "ACCEPTED"
  | "REJECTED"
  | "PENDING"
  | "REVOKED"
  | "EXPIRED"
  | "ASSOCIATING"
  | "ASSOCIATED"
  | "FAILED"
  | (string & {});
export const ShareStatus = S.String;
export type ProfileOwnerType = "SELF" | "SHARED" | (string & {});
export const ProfileOwnerType = S.String;
export type ShareResourceType =
  | "WORKLOAD"
  | "LENS"
  | "PROFILE"
  | "TEMPLATE"
  | (string & {});
export const ShareResourceType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type SelectedChoices = string[];
export const SelectedChoices = S.Array(S.String);
export type AnswerReason =
  | "OUT_OF_SCOPE"
  | "BUSINESS_PRIORITIES"
  | "ARCHITECTURE_CONSTRAINTS"
  | "OTHER"
  | "NONE"
  | (string & {});
export const AnswerReason = S.String;
export type IntegratingService = "JIRA" | (string & {});
export const IntegratingService = S.String;
export type ReviewTemplateLensAliases = string[];
export const ReviewTemplateLensAliases = S.Array(S.String);
export type ShareInvitationAction = "ACCEPT" | "REJECT" | (string & {});
export const ShareInvitationAction = S.String;
export type WorkloadImprovementStatus =
  | "NOT_APPLICABLE"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETE"
  | "RISK_ACKNOWLEDGED"
  | (string & {});
export const WorkloadImprovementStatus = S.String;
export interface AssociateLensesInput {
  WorkloadId: string;
  LensAliases?: string[];
}
export const AssociateLensesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAliases: S.optional(LensAliases),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/associateLenses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateLensesInput",
}) as any as S.Schema<AssociateLensesInput>;
export interface AssociateLensesResponse {}
export const AssociateLensesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateLensesResponse",
}) as any as S.Schema<AssociateLensesResponse>;
export interface AssociateProfilesInput {
  WorkloadId: string;
  ProfileArns?: string[];
}
export const AssociateProfilesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ProfileArns: S.optional(ProfileArns),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/associateProfiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateProfilesInput",
}) as any as S.Schema<AssociateProfilesInput>;
export interface AssociateProfilesResponse {}
export const AssociateProfilesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateProfilesResponse",
}) as any as S.Schema<AssociateProfilesResponse>;
export interface CreateLensShareInput {
  LensAlias: string;
  SharedWith?: string;
  ClientRequestToken?: string;
}
export const CreateLensShareInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    SharedWith: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/lenses/{LensAlias}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLensShareInput",
}) as any as S.Schema<CreateLensShareInput>;
export interface CreateLensVersionInput {
  LensAlias: string;
  LensVersion?: string;
  IsMajorVersion?: boolean;
  ClientRequestToken?: string;
}
export const CreateLensVersionInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    LensVersion: S.optional(S.String),
    IsMajorVersion: S.optional(S.Boolean),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/lenses/{LensAlias}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLensVersionInput",
}) as any as S.Schema<CreateLensVersionInput>;
export interface CreateMilestoneInput {
  WorkloadId: string;
  MilestoneName?: string;
  ClientRequestToken?: string;
}
export const CreateMilestoneInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    MilestoneName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloads/{WorkloadId}/milestones" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMilestoneInput",
}) as any as S.Schema<CreateMilestoneInput>;
export interface CreateProfileShareInput {
  ProfileArn: string;
  SharedWith?: string;
  ClientRequestToken?: string;
}
export const CreateProfileShareInput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    SharedWith: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profiles/{ProfileArn}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileShareInput",
}) as any as S.Schema<CreateProfileShareInput>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateReviewTemplateInput {
  TemplateName?: string;
  Description?: string;
  Lenses?: string[];
  Notes?: string;
  Tags?: { [key: string]: string | undefined };
  ClientRequestToken?: string;
}
export const CreateReviewTemplateInput = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    Description: S.optional(S.String),
    Lenses: S.optional(ReviewTemplateLenses),
    Notes: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reviewTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReviewTemplateInput",
}) as any as S.Schema<CreateReviewTemplateInput>;
export interface CreateTemplateShareInput {
  TemplateArn: string;
  SharedWith?: string;
  ClientRequestToken?: string;
}
export const CreateTemplateShareInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    SharedWith: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/templates/shares/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTemplateShareInput",
}) as any as S.Schema<CreateTemplateShareInput>;
export interface CreateWorkloadShareInput {
  WorkloadId: string;
  SharedWith?: string;
  PermissionType?: PermissionType;
  ClientRequestToken?: string;
}
export const CreateWorkloadShareInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    SharedWith: S.optional(S.String),
    PermissionType: S.optional(PermissionType),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloads/{WorkloadId}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkloadShareInput",
}) as any as S.Schema<CreateWorkloadShareInput>;
export interface DeleteLensInput {
  LensAlias: string;
  ClientRequestToken?: string;
  LensStatus?: LensStatusType;
}
export const DeleteLensInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
    LensStatus: S.optional(LensStatusType).pipe(T.HttpQuery("LensStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/lenses/{LensAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLensInput",
}) as any as S.Schema<DeleteLensInput>;
export interface DeleteLensResponse {}
export const DeleteLensResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLensResponse",
}) as any as S.Schema<DeleteLensResponse>;
export interface DeleteLensShareInput {
  ShareId: string;
  LensAlias: string;
  ClientRequestToken?: string;
}
export const DeleteLensShareInput = S.suspend(() =>
  S.Struct({
    ShareId: S.String.pipe(T.HttpLabel("ShareId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/lenses/{LensAlias}/shares/{ShareId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLensShareInput",
}) as any as S.Schema<DeleteLensShareInput>;
export interface DeleteLensShareResponse {}
export const DeleteLensShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLensShareResponse",
}) as any as S.Schema<DeleteLensShareResponse>;
export interface DeleteProfileInput {
  ProfileArn: string;
  ClientRequestToken?: string;
}
export const DeleteProfileInput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/profiles/{ProfileArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileInput",
}) as any as S.Schema<DeleteProfileInput>;
export interface DeleteProfileResponse {}
export const DeleteProfileResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProfileResponse",
}) as any as S.Schema<DeleteProfileResponse>;
export interface DeleteProfileShareInput {
  ShareId: string;
  ProfileArn: string;
  ClientRequestToken?: string;
}
export const DeleteProfileShareInput = S.suspend(() =>
  S.Struct({
    ShareId: S.String.pipe(T.HttpLabel("ShareId")),
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/profiles/{ProfileArn}/shares/{ShareId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProfileShareInput",
}) as any as S.Schema<DeleteProfileShareInput>;
export interface DeleteProfileShareResponse {}
export const DeleteProfileShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProfileShareResponse",
}) as any as S.Schema<DeleteProfileShareResponse>;
export interface DeleteReviewTemplateInput {
  TemplateArn: string;
  ClientRequestToken?: string;
}
export const DeleteReviewTemplateInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/reviewTemplates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReviewTemplateInput",
}) as any as S.Schema<DeleteReviewTemplateInput>;
export interface DeleteReviewTemplateResponse {}
export const DeleteReviewTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReviewTemplateResponse",
}) as any as S.Schema<DeleteReviewTemplateResponse>;
export interface DeleteTemplateShareInput {
  ShareId: string;
  TemplateArn: string;
  ClientRequestToken?: string;
}
export const DeleteTemplateShareInput = S.suspend(() =>
  S.Struct({
    ShareId: S.String.pipe(T.HttpLabel("ShareId")),
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/templates/shares/{TemplateArn}/{ShareId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTemplateShareInput",
}) as any as S.Schema<DeleteTemplateShareInput>;
export interface DeleteTemplateShareResponse {}
export const DeleteTemplateShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTemplateShareResponse",
}) as any as S.Schema<DeleteTemplateShareResponse>;
export interface DeleteWorkloadInput {
  WorkloadId: string;
  ClientRequestToken?: string;
}
export const DeleteWorkloadInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/workloads/{WorkloadId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkloadInput",
}) as any as S.Schema<DeleteWorkloadInput>;
export interface DeleteWorkloadResponse {}
export const DeleteWorkloadResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteWorkloadResponse" },
) as any as S.Schema<DeleteWorkloadResponse>;
export interface DeleteWorkloadShareInput {
  ShareId: string;
  WorkloadId: string;
  ClientRequestToken?: string;
}
export const DeleteWorkloadShareInput = S.suspend(() =>
  S.Struct({
    ShareId: S.String.pipe(T.HttpLabel("ShareId")),
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ClientRequestToken: S.optional(S.String).pipe(
      T.HttpQuery("ClientRequestToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/workloads/{WorkloadId}/shares/{ShareId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkloadShareInput",
}) as any as S.Schema<DeleteWorkloadShareInput>;
export interface DeleteWorkloadShareResponse {}
export const DeleteWorkloadShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWorkloadShareResponse",
}) as any as S.Schema<DeleteWorkloadShareResponse>;
export interface DisassociateLensesInput {
  WorkloadId: string;
  LensAliases?: string[];
}
export const DisassociateLensesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAliases: S.optional(LensAliases),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/disassociateLenses",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateLensesInput",
}) as any as S.Schema<DisassociateLensesInput>;
export interface DisassociateLensesResponse {}
export const DisassociateLensesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateLensesResponse",
}) as any as S.Schema<DisassociateLensesResponse>;
export interface DisassociateProfilesInput {
  WorkloadId: string;
  ProfileArns?: string[];
}
export const DisassociateProfilesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ProfileArns: S.optional(ProfileArns),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/disassociateProfiles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateProfilesInput",
}) as any as S.Schema<DisassociateProfilesInput>;
export interface DisassociateProfilesResponse {}
export const DisassociateProfilesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateProfilesResponse",
}) as any as S.Schema<DisassociateProfilesResponse>;
export interface ExportLensInput {
  LensAlias: string;
  LensVersion?: string;
}
export const ExportLensInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    LensVersion: S.optional(S.String).pipe(T.HttpQuery("LensVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/lenses/{LensAlias}/export" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportLensInput",
}) as any as S.Schema<ExportLensInput>;
export interface GetAnswerInput {
  WorkloadId: string;
  LensAlias: string;
  QuestionId: string;
  MilestoneNumber?: number;
}
export const GetAnswerInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    QuestionId: S.String.pipe(T.HttpLabel("QuestionId")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/answers/{QuestionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAnswerInput",
}) as any as S.Schema<GetAnswerInput>;
export interface GetConsolidatedReportInput {
  Format?: ReportFormat;
  IncludeSharedResources?: boolean;
  NextToken?: string;
  MaxResults?: number;
}
export const GetConsolidatedReportInput = S.suspend(() =>
  S.Struct({
    Format: S.optional(ReportFormat).pipe(T.HttpQuery("Format")),
    IncludeSharedResources: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeSharedResources"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/consolidatedReport" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConsolidatedReportInput",
}) as any as S.Schema<GetConsolidatedReportInput>;
export interface GetLensInput {
  LensAlias: string;
  LensVersion?: string;
}
export const GetLensInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    LensVersion: S.optional(S.String).pipe(T.HttpQuery("LensVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/lenses/{LensAlias}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetLensInput" }) as any as S.Schema<GetLensInput>;
export interface GetLensReviewInput {
  WorkloadId: string;
  LensAlias: string;
  MilestoneNumber?: number;
}
export const GetLensReviewInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLensReviewInput",
}) as any as S.Schema<GetLensReviewInput>;
export interface GetLensReviewReportInput {
  WorkloadId: string;
  LensAlias: string;
  MilestoneNumber?: number;
}
export const GetLensReviewReportInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/report",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLensReviewReportInput",
}) as any as S.Schema<GetLensReviewReportInput>;
export interface GetLensVersionDifferenceInput {
  LensAlias: string;
  BaseLensVersion?: string;
  TargetLensVersion?: string;
}
export const GetLensVersionDifferenceInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    BaseLensVersion: S.optional(S.String).pipe(T.HttpQuery("BaseLensVersion")),
    TargetLensVersion: S.optional(S.String).pipe(
      T.HttpQuery("TargetLensVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/lenses/{LensAlias}/versionDifference" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLensVersionDifferenceInput",
}) as any as S.Schema<GetLensVersionDifferenceInput>;
export interface GetMilestoneInput {
  WorkloadId: string;
  MilestoneNumber: number;
}
export const GetMilestoneInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    MilestoneNumber: S.Number.pipe(T.HttpLabel("MilestoneNumber")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/milestones/{MilestoneNumber}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMilestoneInput",
}) as any as S.Schema<GetMilestoneInput>;
export interface GetProfileInput {
  ProfileArn: string;
  ProfileVersion?: string;
}
export const GetProfileInput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    ProfileVersion: S.optional(S.String).pipe(T.HttpQuery("ProfileVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profiles/{ProfileArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProfileInput",
}) as any as S.Schema<GetProfileInput>;
export interface GetReviewTemplateInput {
  TemplateArn: string;
}
export const GetReviewTemplateInput = S.suspend(() =>
  S.Struct({ TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/reviewTemplates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReviewTemplateInput",
}) as any as S.Schema<GetReviewTemplateInput>;
export interface GetReviewTemplateAnswerInput {
  TemplateArn: string;
  LensAlias: string;
  QuestionId: string;
}
export const GetReviewTemplateAnswerInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    QuestionId: S.String.pipe(T.HttpLabel("QuestionId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}/answers/{QuestionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReviewTemplateAnswerInput",
}) as any as S.Schema<GetReviewTemplateAnswerInput>;
export interface GetReviewTemplateLensReviewInput {
  TemplateArn: string;
  LensAlias: string;
}
export const GetReviewTemplateLensReviewInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReviewTemplateLensReviewInput",
}) as any as S.Schema<GetReviewTemplateLensReviewInput>;
export interface GetWorkloadInput {
  WorkloadId: string;
}
export const GetWorkloadInput = S.suspend(() =>
  S.Struct({ WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workloads/{WorkloadId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadInput",
}) as any as S.Schema<GetWorkloadInput>;
export interface ImportLensInput {
  LensAlias?: string;
  JSONString?: string;
  ClientRequestToken?: string;
  Tags?: { [key: string]: string | undefined };
}
export const ImportLensInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    JSONString: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/importLens" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportLensInput",
}) as any as S.Schema<ImportLensInput>;
export interface ListAnswersInput {
  WorkloadId: string;
  LensAlias: string;
  PillarId?: string;
  MilestoneNumber?: number;
  NextToken?: string;
  MaxResults?: number;
  QuestionPriority?: QuestionPriority;
}
export const ListAnswersInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    PillarId: S.optional(S.String).pipe(T.HttpQuery("PillarId")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    QuestionPriority: S.optional(QuestionPriority).pipe(
      T.HttpQuery("QuestionPriority"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/answers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnswersInput",
}) as any as S.Schema<ListAnswersInput>;
export interface ListCheckDetailsInput {
  WorkloadId: string;
  NextToken?: string;
  MaxResults?: number;
  LensArn?: string;
  PillarId?: string;
  QuestionId?: string;
  ChoiceId?: string;
}
export const ListCheckDetailsInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    LensArn: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionId: S.optional(S.String),
    ChoiceId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloads/{WorkloadId}/checks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCheckDetailsInput",
}) as any as S.Schema<ListCheckDetailsInput>;
export interface ListCheckSummariesInput {
  WorkloadId: string;
  NextToken?: string;
  MaxResults?: number;
  LensArn?: string;
  PillarId?: string;
  QuestionId?: string;
  ChoiceId?: string;
}
export const ListCheckSummariesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    LensArn: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionId: S.optional(S.String),
    ChoiceId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloads/{WorkloadId}/checkSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCheckSummariesInput",
}) as any as S.Schema<ListCheckSummariesInput>;
export interface ListLensesInput {
  NextToken?: string;
  MaxResults?: number;
  LensType?: LensType;
  LensStatus?: LensStatusType;
  LensName?: string;
}
export const ListLensesInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    LensType: S.optional(LensType).pipe(T.HttpQuery("LensType")),
    LensStatus: S.optional(LensStatusType).pipe(T.HttpQuery("LensStatus")),
    LensName: S.optional(S.String).pipe(T.HttpQuery("LensName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/lenses" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLensesInput",
}) as any as S.Schema<ListLensesInput>;
export interface ListLensReviewImprovementsInput {
  WorkloadId: string;
  LensAlias: string;
  PillarId?: string;
  MilestoneNumber?: number;
  NextToken?: string;
  MaxResults?: number;
  QuestionPriority?: QuestionPriority;
}
export const ListLensReviewImprovementsInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    PillarId: S.optional(S.String).pipe(T.HttpQuery("PillarId")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    QuestionPriority: S.optional(QuestionPriority).pipe(
      T.HttpQuery("QuestionPriority"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/improvements",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLensReviewImprovementsInput",
}) as any as S.Schema<ListLensReviewImprovementsInput>;
export interface ListLensReviewsInput {
  WorkloadId: string;
  MilestoneNumber?: number;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLensReviewsInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    MilestoneNumber: S.optional(S.Number).pipe(T.HttpQuery("MilestoneNumber")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workloads/{WorkloadId}/lensReviews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLensReviewsInput",
}) as any as S.Schema<ListLensReviewsInput>;
export interface ListLensSharesInput {
  LensAlias: string;
  SharedWithPrefix?: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: ShareStatus;
}
export const ListLensSharesInput = S.suspend(() =>
  S.Struct({
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    SharedWithPrefix: S.optional(S.String).pipe(
      T.HttpQuery("SharedWithPrefix"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    Status: S.optional(ShareStatus).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/lenses/{LensAlias}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLensSharesInput",
}) as any as S.Schema<ListLensSharesInput>;
export interface ListMilestonesInput {
  WorkloadId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMilestonesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workloads/{WorkloadId}/milestonesSummaries",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMilestonesInput",
}) as any as S.Schema<ListMilestonesInput>;
export interface ListNotificationsInput {
  WorkloadId?: string;
  NextToken?: string;
  MaxResults?: number;
  ResourceArn?: string;
}
export const ListNotificationsInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/notifications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationsInput",
}) as any as S.Schema<ListNotificationsInput>;
export interface ListProfileNotificationsInput {
  WorkloadId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListProfileNotificationsInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String).pipe(T.HttpQuery("WorkloadId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profileNotifications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileNotificationsInput",
}) as any as S.Schema<ListProfileNotificationsInput>;
export interface ListProfilesInput {
  ProfileNamePrefix?: string;
  ProfileOwnerType?: ProfileOwnerType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListProfilesInput = S.suspend(() =>
  S.Struct({
    ProfileNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("ProfileNamePrefix"),
    ),
    ProfileOwnerType: S.optional(ProfileOwnerType).pipe(
      T.HttpQuery("ProfileOwnerType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profileSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfilesInput",
}) as any as S.Schema<ListProfilesInput>;
export interface ListProfileSharesInput {
  ProfileArn: string;
  SharedWithPrefix?: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: ShareStatus;
}
export const ListProfileSharesInput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    SharedWithPrefix: S.optional(S.String).pipe(
      T.HttpQuery("SharedWithPrefix"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    Status: S.optional(ShareStatus).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profiles/{ProfileArn}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProfileSharesInput",
}) as any as S.Schema<ListProfileSharesInput>;
export interface ListReviewTemplateAnswersInput {
  TemplateArn: string;
  LensAlias: string;
  PillarId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListReviewTemplateAnswersInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    PillarId: S.optional(S.String).pipe(T.HttpQuery("PillarId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}/answers",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReviewTemplateAnswersInput",
}) as any as S.Schema<ListReviewTemplateAnswersInput>;
export interface ListReviewTemplatesInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListReviewTemplatesInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/reviewTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReviewTemplatesInput",
}) as any as S.Schema<ListReviewTemplatesInput>;
export interface ListShareInvitationsInput {
  WorkloadNamePrefix?: string;
  LensNamePrefix?: string;
  ShareResourceType?: ShareResourceType;
  NextToken?: string;
  MaxResults?: number;
  ProfileNamePrefix?: string;
  TemplateNamePrefix?: string;
}
export const ListShareInvitationsInput = S.suspend(() =>
  S.Struct({
    WorkloadNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("WorkloadNamePrefix"),
    ),
    LensNamePrefix: S.optional(S.String).pipe(T.HttpQuery("LensNamePrefix")),
    ShareResourceType: S.optional(ShareResourceType).pipe(
      T.HttpQuery("ShareResourceType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ProfileNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("ProfileNamePrefix"),
    ),
    TemplateNamePrefix: S.optional(S.String).pipe(
      T.HttpQuery("TemplateNamePrefix"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/shareInvitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListShareInvitationsInput",
}) as any as S.Schema<ListShareInvitationsInput>;
export interface ListTagsForResourceInput {
  WorkloadArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ WorkloadArn: S.String.pipe(T.HttpLabel("WorkloadArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{WorkloadArn}" }),
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
export interface ListTemplateSharesInput {
  TemplateArn: string;
  SharedWithPrefix?: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: ShareStatus;
}
export const ListTemplateSharesInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    SharedWithPrefix: S.optional(S.String).pipe(
      T.HttpQuery("SharedWithPrefix"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    Status: S.optional(ShareStatus).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/shares/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplateSharesInput",
}) as any as S.Schema<ListTemplateSharesInput>;
export interface ListWorkloadsInput {
  WorkloadNamePrefix?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkloadsInput = S.suspend(() =>
  S.Struct({
    WorkloadNamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloadsSummaries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkloadsInput",
}) as any as S.Schema<ListWorkloadsInput>;
export interface ListWorkloadSharesInput {
  WorkloadId: string;
  SharedWithPrefix?: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: ShareStatus;
}
export const ListWorkloadSharesInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    SharedWithPrefix: S.optional(S.String).pipe(
      T.HttpQuery("SharedWithPrefix"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    Status: S.optional(ShareStatus).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workloads/{WorkloadId}/shares" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkloadSharesInput",
}) as any as S.Schema<ListWorkloadSharesInput>;
export interface TagResourceInput {
  WorkloadArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    WorkloadArn: S.String.pipe(T.HttpLabel("WorkloadArn")),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{WorkloadArn}" }),
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
export interface UntagResourceInput {
  WorkloadArn: string;
  TagKeys?: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    WorkloadArn: S.String.pipe(T.HttpLabel("WorkloadArn")),
    TagKeys: S.optional(TagKeyList).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{WorkloadArn}" }),
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
export interface UpdateIntegrationInput {
  WorkloadId: string;
  ClientRequestToken?: string;
  IntegratingService?: IntegratingService;
}
export const UpdateIntegrationInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    IntegratingService: S.optional(IntegratingService),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/workloads/{WorkloadId}/updateIntegration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateIntegrationInput",
}) as any as S.Schema<UpdateIntegrationInput>;
export interface UpdateIntegrationResponse {}
export const UpdateIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateIntegrationResponse",
}) as any as S.Schema<UpdateIntegrationResponse>;
export type SelectedProfileChoiceIds = string[];
export const SelectedProfileChoiceIds = S.Array(S.String);
export interface ProfileQuestionUpdate {
  QuestionId?: string;
  SelectedChoiceIds?: string[];
}
export const ProfileQuestionUpdate = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    SelectedChoiceIds: S.optional(SelectedProfileChoiceIds),
  }),
).annotations({
  identifier: "ProfileQuestionUpdate",
}) as any as S.Schema<ProfileQuestionUpdate>;
export type ProfileQuestionUpdates = ProfileQuestionUpdate[];
export const ProfileQuestionUpdates = S.Array(ProfileQuestionUpdate);
export interface UpdateProfileInput {
  ProfileArn: string;
  ProfileDescription?: string;
  ProfileQuestions?: ProfileQuestionUpdate[];
}
export const UpdateProfileInput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    ProfileDescription: S.optional(S.String),
    ProfileQuestions: S.optional(ProfileQuestionUpdates),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/profiles/{ProfileArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileInput",
}) as any as S.Schema<UpdateProfileInput>;
export interface UpdateReviewTemplateInput {
  TemplateArn: string;
  TemplateName?: string;
  Description?: string;
  Notes?: string;
  LensesToAssociate?: string[];
  LensesToDisassociate?: string[];
}
export const UpdateReviewTemplateInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    TemplateName: S.optional(S.String),
    Description: S.optional(S.String),
    Notes: S.optional(S.String),
    LensesToAssociate: S.optional(ReviewTemplateLensAliases),
    LensesToDisassociate: S.optional(ReviewTemplateLensAliases),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/reviewTemplates/{TemplateArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReviewTemplateInput",
}) as any as S.Schema<UpdateReviewTemplateInput>;
export type ChoiceStatus =
  | "SELECTED"
  | "NOT_APPLICABLE"
  | "UNSELECTED"
  | (string & {});
export const ChoiceStatus = S.String;
export type ChoiceReason =
  | "OUT_OF_SCOPE"
  | "BUSINESS_PRIORITIES"
  | "ARCHITECTURE_CONSTRAINTS"
  | "OTHER"
  | "NONE"
  | (string & {});
export const ChoiceReason = S.String;
export interface ChoiceUpdate {
  Status?: ChoiceStatus;
  Reason?: ChoiceReason;
  Notes?: string;
}
export const ChoiceUpdate = S.suspend(() =>
  S.Struct({
    Status: S.optional(ChoiceStatus),
    Reason: S.optional(ChoiceReason),
    Notes: S.optional(S.String),
  }),
).annotations({ identifier: "ChoiceUpdate" }) as any as S.Schema<ChoiceUpdate>;
export type ChoiceUpdates = { [key: string]: ChoiceUpdate | undefined };
export const ChoiceUpdates = S.Record({
  key: S.String,
  value: S.UndefinedOr(ChoiceUpdate),
});
export interface UpdateReviewTemplateAnswerInput {
  TemplateArn: string;
  LensAlias: string;
  QuestionId: string;
  SelectedChoices?: string[];
  ChoiceUpdates?: { [key: string]: ChoiceUpdate | undefined };
  Notes?: string;
  IsApplicable?: boolean;
  Reason?: AnswerReason;
}
export const UpdateReviewTemplateAnswerInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    QuestionId: S.String.pipe(T.HttpLabel("QuestionId")),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceUpdates: S.optional(ChoiceUpdates),
    Notes: S.optional(S.String),
    IsApplicable: S.optional(S.Boolean),
    Reason: S.optional(AnswerReason),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}/answers/{QuestionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReviewTemplateAnswerInput",
}) as any as S.Schema<UpdateReviewTemplateAnswerInput>;
export type PillarNotes = { [key: string]: string | undefined };
export const PillarNotes = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface UpdateReviewTemplateLensReviewInput {
  TemplateArn: string;
  LensAlias: string;
  LensNotes?: string;
  PillarNotes?: { [key: string]: string | undefined };
}
export const UpdateReviewTemplateLensReviewInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    LensNotes: S.optional(S.String),
    PillarNotes: S.optional(PillarNotes),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReviewTemplateLensReviewInput",
}) as any as S.Schema<UpdateReviewTemplateLensReviewInput>;
export interface UpdateShareInvitationInput {
  ShareInvitationId: string;
  ShareInvitationAction?: ShareInvitationAction;
}
export const UpdateShareInvitationInput = S.suspend(() =>
  S.Struct({
    ShareInvitationId: S.String.pipe(T.HttpLabel("ShareInvitationId")),
    ShareInvitationAction: S.optional(ShareInvitationAction),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/shareInvitations/{ShareInvitationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateShareInvitationInput",
}) as any as S.Schema<UpdateShareInvitationInput>;
export type TrustedAdvisorIntegrationStatus =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const TrustedAdvisorIntegrationStatus = S.String;
export type DefinitionType =
  | "WORKLOAD_METADATA"
  | "APP_REGISTRY"
  | (string & {});
export const DefinitionType = S.String;
export type WorkloadResourceDefinition = DefinitionType[];
export const WorkloadResourceDefinition = S.Array(DefinitionType);
export interface WorkloadDiscoveryConfig {
  TrustedAdvisorIntegrationStatus?: TrustedAdvisorIntegrationStatus;
  WorkloadResourceDefinition?: DefinitionType[];
}
export const WorkloadDiscoveryConfig = S.suspend(() =>
  S.Struct({
    TrustedAdvisorIntegrationStatus: S.optional(
      TrustedAdvisorIntegrationStatus,
    ),
    WorkloadResourceDefinition: S.optional(WorkloadResourceDefinition),
  }),
).annotations({
  identifier: "WorkloadDiscoveryConfig",
}) as any as S.Schema<WorkloadDiscoveryConfig>;
export type WorkloadIssueManagementStatus =
  | "ENABLED"
  | "DISABLED"
  | "INHERIT"
  | (string & {});
export const WorkloadIssueManagementStatus = S.String;
export type IssueManagementType = "AUTO" | "MANUAL" | (string & {});
export const IssueManagementType = S.String;
export interface WorkloadJiraConfigurationInput {
  IssueManagementStatus?: WorkloadIssueManagementStatus;
  IssueManagementType?: IssueManagementType;
  JiraProjectKey?: string;
}
export const WorkloadJiraConfigurationInput = S.suspend(() =>
  S.Struct({
    IssueManagementStatus: S.optional(WorkloadIssueManagementStatus),
    IssueManagementType: S.optional(IssueManagementType),
    JiraProjectKey: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadJiraConfigurationInput",
}) as any as S.Schema<WorkloadJiraConfigurationInput>;
export interface UpdateWorkloadInput {
  WorkloadId: string;
  WorkloadName?: string;
  Description?: string;
  Environment?: WorkloadEnvironment;
  AccountIds?: string[];
  AwsRegions?: string[];
  NonAwsRegions?: string[];
  PillarPriorities?: string[];
  ArchitecturalDesign?: string;
  ReviewOwner?: string;
  IsReviewOwnerUpdateAcknowledged?: boolean;
  IndustryType?: string;
  Industry?: string;
  Notes?: string;
  ImprovementStatus?: WorkloadImprovementStatus;
  DiscoveryConfig?: WorkloadDiscoveryConfig;
  Applications?: string[];
  JiraConfiguration?: WorkloadJiraConfigurationInput;
}
export const UpdateWorkloadInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    WorkloadName: S.optional(S.String),
    Description: S.optional(S.String),
    Environment: S.optional(WorkloadEnvironment),
    AccountIds: S.optional(WorkloadAccountIds),
    AwsRegions: S.optional(WorkloadAwsRegions),
    NonAwsRegions: S.optional(WorkloadNonAwsRegions),
    PillarPriorities: S.optional(WorkloadPillarPriorities),
    ArchitecturalDesign: S.optional(S.String),
    ReviewOwner: S.optional(S.String),
    IsReviewOwnerUpdateAcknowledged: S.optional(S.Boolean),
    IndustryType: S.optional(S.String),
    Industry: S.optional(S.String),
    Notes: S.optional(S.String),
    ImprovementStatus: S.optional(WorkloadImprovementStatus),
    DiscoveryConfig: S.optional(WorkloadDiscoveryConfig),
    Applications: S.optional(WorkloadApplications),
    JiraConfiguration: S.optional(WorkloadJiraConfigurationInput),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/workloads/{WorkloadId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkloadInput",
}) as any as S.Schema<UpdateWorkloadInput>;
export interface UpdateWorkloadShareInput {
  ShareId: string;
  WorkloadId: string;
  PermissionType?: PermissionType;
}
export const UpdateWorkloadShareInput = S.suspend(() =>
  S.Struct({
    ShareId: S.String.pipe(T.HttpLabel("ShareId")),
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    PermissionType: S.optional(PermissionType),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/shares/{ShareId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkloadShareInput",
}) as any as S.Schema<UpdateWorkloadShareInput>;
export interface UpgradeLensReviewInput {
  WorkloadId: string;
  LensAlias: string;
  MilestoneName?: string;
  ClientRequestToken?: string;
}
export const UpgradeLensReviewInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    MilestoneName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/upgrade",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpgradeLensReviewInput",
}) as any as S.Schema<UpgradeLensReviewInput>;
export interface UpgradeLensReviewResponse {}
export const UpgradeLensReviewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpgradeLensReviewResponse",
}) as any as S.Schema<UpgradeLensReviewResponse>;
export interface UpgradeProfileVersionInput {
  WorkloadId: string;
  ProfileArn: string;
  MilestoneName?: string;
  ClientRequestToken?: string;
}
export const UpgradeProfileVersionInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    ProfileArn: S.String.pipe(T.HttpLabel("ProfileArn")),
    MilestoneName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/workloads/{WorkloadId}/profiles/{ProfileArn}/upgrade",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpgradeProfileVersionInput",
}) as any as S.Schema<UpgradeProfileVersionInput>;
export interface UpgradeProfileVersionResponse {}
export const UpgradeProfileVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpgradeProfileVersionResponse",
}) as any as S.Schema<UpgradeProfileVersionResponse>;
export interface UpgradeReviewTemplateLensReviewInput {
  TemplateArn: string;
  LensAlias: string;
  ClientRequestToken?: string;
}
export const UpgradeReviewTemplateLensReviewInput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.String.pipe(T.HttpLabel("TemplateArn")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/reviewTemplates/{TemplateArn}/lensReviews/{LensAlias}/upgrade",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpgradeReviewTemplateLensReviewInput",
}) as any as S.Schema<UpgradeReviewTemplateLensReviewInput>;
export interface UpgradeReviewTemplateLensReviewResponse {}
export const UpgradeReviewTemplateLensReviewResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpgradeReviewTemplateLensReviewResponse",
}) as any as S.Schema<UpgradeReviewTemplateLensReviewResponse>;
export type IntegrationStatus = "CONFIGURED" | "NOT_CONFIGURED" | (string & {});
export const IntegrationStatus = S.String;
export type AccountJiraIssueManagementStatus =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const AccountJiraIssueManagementStatus = S.String;
export type IntegrationStatusInput = "NOT_CONFIGURED" | (string & {});
export const IntegrationStatusInput = S.String;
export interface AccountJiraConfigurationOutput {
  IntegrationStatus?: IntegrationStatus;
  IssueManagementStatus?: AccountJiraIssueManagementStatus;
  IssueManagementType?: IssueManagementType;
  Subdomain?: string;
  JiraProjectKey?: string;
  StatusMessage?: string;
}
export const AccountJiraConfigurationOutput = S.suspend(() =>
  S.Struct({
    IntegrationStatus: S.optional(IntegrationStatus),
    IssueManagementStatus: S.optional(AccountJiraIssueManagementStatus),
    IssueManagementType: S.optional(IssueManagementType),
    Subdomain: S.optional(S.String),
    JiraProjectKey: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountJiraConfigurationOutput",
}) as any as S.Schema<AccountJiraConfigurationOutput>;
export type ImportLensStatus =
  | "IN_PROGRESS"
  | "COMPLETE"
  | "ERROR"
  | (string & {});
export const ImportLensStatus = S.String;
export interface AccountJiraConfigurationInput {
  IssueManagementStatus?: AccountJiraIssueManagementStatus;
  IssueManagementType?: IssueManagementType;
  JiraProjectKey?: string;
  IntegrationStatus?: IntegrationStatusInput;
}
export const AccountJiraConfigurationInput = S.suspend(() =>
  S.Struct({
    IssueManagementStatus: S.optional(AccountJiraIssueManagementStatus),
    IssueManagementType: S.optional(IssueManagementType),
    JiraProjectKey: S.optional(S.String),
    IntegrationStatus: S.optional(IntegrationStatusInput),
  }),
).annotations({
  identifier: "AccountJiraConfigurationInput",
}) as any as S.Schema<AccountJiraConfigurationInput>;
export type SelectedQuestionIds = string[];
export const SelectedQuestionIds = S.Array(S.String);
export interface CreateLensShareOutput {
  ShareId?: string;
}
export const CreateLensShareOutput = S.suspend(() =>
  S.Struct({ ShareId: S.optional(S.String) }),
).annotations({
  identifier: "CreateLensShareOutput",
}) as any as S.Schema<CreateLensShareOutput>;
export interface CreateLensVersionOutput {
  LensArn?: string;
  LensVersion?: string;
}
export const CreateLensVersionOutput = S.suspend(() =>
  S.Struct({
    LensArn: S.optional(S.String),
    LensVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLensVersionOutput",
}) as any as S.Schema<CreateLensVersionOutput>;
export interface CreateMilestoneOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
}
export const CreateMilestoneOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateMilestoneOutput",
}) as any as S.Schema<CreateMilestoneOutput>;
export interface CreateProfileInput {
  ProfileName?: string;
  ProfileDescription?: string;
  ProfileQuestions?: ProfileQuestionUpdate[];
  ClientRequestToken?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateProfileInput = S.suspend(() =>
  S.Struct({
    ProfileName: S.optional(S.String),
    ProfileDescription: S.optional(S.String),
    ProfileQuestions: S.optional(ProfileQuestionUpdates),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileInput",
}) as any as S.Schema<CreateProfileInput>;
export interface CreateProfileShareOutput {
  ShareId?: string;
  ProfileArn?: string;
}
export const CreateProfileShareOutput = S.suspend(() =>
  S.Struct({ ShareId: S.optional(S.String), ProfileArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateProfileShareOutput",
}) as any as S.Schema<CreateProfileShareOutput>;
export interface CreateReviewTemplateOutput {
  TemplateArn?: string;
}
export const CreateReviewTemplateOutput = S.suspend(() =>
  S.Struct({ TemplateArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateReviewTemplateOutput",
}) as any as S.Schema<CreateReviewTemplateOutput>;
export interface CreateTemplateShareOutput {
  TemplateArn?: string;
  ShareId?: string;
}
export const CreateTemplateShareOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    ShareId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateTemplateShareOutput",
}) as any as S.Schema<CreateTemplateShareOutput>;
export interface CreateWorkloadInput {
  WorkloadName?: string;
  Description?: string;
  Environment?: WorkloadEnvironment;
  AccountIds?: string[];
  AwsRegions?: string[];
  NonAwsRegions?: string[];
  PillarPriorities?: string[];
  ArchitecturalDesign?: string;
  ReviewOwner?: string;
  IndustryType?: string;
  Industry?: string;
  Lenses?: string[];
  Notes?: string;
  ClientRequestToken?: string;
  Tags?: { [key: string]: string | undefined };
  DiscoveryConfig?: WorkloadDiscoveryConfig;
  Applications?: string[];
  ProfileArns?: string[];
  ReviewTemplateArns?: string[];
  JiraConfiguration?: WorkloadJiraConfigurationInput;
}
export const CreateWorkloadInput = S.suspend(() =>
  S.Struct({
    WorkloadName: S.optional(S.String),
    Description: S.optional(S.String),
    Environment: S.optional(WorkloadEnvironment),
    AccountIds: S.optional(WorkloadAccountIds),
    AwsRegions: S.optional(WorkloadAwsRegions),
    NonAwsRegions: S.optional(WorkloadNonAwsRegions),
    PillarPriorities: S.optional(WorkloadPillarPriorities),
    ArchitecturalDesign: S.optional(S.String),
    ReviewOwner: S.optional(S.String),
    IndustryType: S.optional(S.String),
    Industry: S.optional(S.String),
    Lenses: S.optional(WorkloadLenses),
    Notes: S.optional(S.String),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Tags: S.optional(TagMap),
    DiscoveryConfig: S.optional(WorkloadDiscoveryConfig),
    Applications: S.optional(WorkloadApplications),
    ProfileArns: S.optional(WorkloadProfileArns),
    ReviewTemplateArns: S.optional(ReviewTemplateArns),
    JiraConfiguration: S.optional(WorkloadJiraConfigurationInput),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workloads" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkloadInput",
}) as any as S.Schema<CreateWorkloadInput>;
export interface CreateWorkloadShareOutput {
  WorkloadId?: string;
  ShareId?: string;
}
export const CreateWorkloadShareOutput = S.suspend(() =>
  S.Struct({ WorkloadId: S.optional(S.String), ShareId: S.optional(S.String) }),
).annotations({
  identifier: "CreateWorkloadShareOutput",
}) as any as S.Schema<CreateWorkloadShareOutput>;
export interface ExportLensOutput {
  LensJSON?: string;
}
export const ExportLensOutput = S.suspend(() =>
  S.Struct({ LensJSON: S.optional(S.String) }),
).annotations({
  identifier: "ExportLensOutput",
}) as any as S.Schema<ExportLensOutput>;
export interface GetGlobalSettingsOutput {
  OrganizationSharingStatus?: OrganizationSharingStatus;
  DiscoveryIntegrationStatus?: DiscoveryIntegrationStatus;
  JiraConfiguration?: AccountJiraConfigurationOutput;
}
export const GetGlobalSettingsOutput = S.suspend(() =>
  S.Struct({
    OrganizationSharingStatus: S.optional(OrganizationSharingStatus),
    DiscoveryIntegrationStatus: S.optional(DiscoveryIntegrationStatus),
    JiraConfiguration: S.optional(AccountJiraConfigurationOutput),
  }),
).annotations({
  identifier: "GetGlobalSettingsOutput",
}) as any as S.Schema<GetGlobalSettingsOutput>;
export interface ImportLensOutput {
  LensArn?: string;
  Status?: ImportLensStatus;
}
export const ImportLensOutput = S.suspend(() =>
  S.Struct({
    LensArn: S.optional(S.String),
    Status: S.optional(ImportLensStatus),
  }),
).annotations({
  identifier: "ImportLensOutput",
}) as any as S.Schema<ImportLensOutput>;
export interface ListTagsForResourceOutput {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface UpdateGlobalSettingsInput {
  OrganizationSharingStatus?: OrganizationSharingStatus;
  DiscoveryIntegrationStatus?: DiscoveryIntegrationStatus;
  JiraConfiguration?: AccountJiraConfigurationInput;
}
export const UpdateGlobalSettingsInput = S.suspend(() =>
  S.Struct({
    OrganizationSharingStatus: S.optional(OrganizationSharingStatus),
    DiscoveryIntegrationStatus: S.optional(DiscoveryIntegrationStatus),
    JiraConfiguration: S.optional(AccountJiraConfigurationInput),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/global-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlobalSettingsInput",
}) as any as S.Schema<UpdateGlobalSettingsInput>;
export interface UpdateGlobalSettingsResponse {}
export const UpdateGlobalSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateGlobalSettingsResponse",
}) as any as S.Schema<UpdateGlobalSettingsResponse>;
export interface ProfileChoice {
  ChoiceId?: string;
  ChoiceTitle?: string;
  ChoiceDescription?: string;
}
export const ProfileChoice = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    ChoiceTitle: S.optional(S.String),
    ChoiceDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ProfileChoice",
}) as any as S.Schema<ProfileChoice>;
export type ProfileQuestionChoices = ProfileChoice[];
export const ProfileQuestionChoices = S.Array(ProfileChoice);
export type SelectedChoiceIds = string[];
export const SelectedChoiceIds = S.Array(S.String);
export interface ProfileQuestion {
  QuestionId?: string;
  QuestionTitle?: string;
  QuestionDescription?: string;
  QuestionChoices?: ProfileChoice[];
  SelectedChoiceIds?: string[];
  MinSelectedChoices?: number;
  MaxSelectedChoices?: number;
}
export const ProfileQuestion = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    QuestionDescription: S.optional(S.String),
    QuestionChoices: S.optional(ProfileQuestionChoices),
    SelectedChoiceIds: S.optional(SelectedChoiceIds),
    MinSelectedChoices: S.optional(S.Number),
    MaxSelectedChoices: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProfileQuestion",
}) as any as S.Schema<ProfileQuestion>;
export type ProfileQuestions = ProfileQuestion[];
export const ProfileQuestions = S.Array(ProfileQuestion);
export interface Profile {
  ProfileArn?: string;
  ProfileVersion?: string;
  ProfileName?: string;
  ProfileDescription?: string;
  ProfileQuestions?: ProfileQuestion[];
  Owner?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  ShareInvitationId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const Profile = S.suspend(() =>
  S.Struct({
    ProfileArn: S.optional(S.String),
    ProfileVersion: S.optional(S.String),
    ProfileName: S.optional(S.String),
    ProfileDescription: S.optional(S.String),
    ProfileQuestions: S.optional(ProfileQuestions),
    Owner: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ShareInvitationId: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Profile" }) as any as S.Schema<Profile>;
export interface UpdateProfileOutput {
  Profile?: Profile;
}
export const UpdateProfileOutput = S.suspend(() =>
  S.Struct({ Profile: S.optional(Profile) }),
).annotations({
  identifier: "UpdateProfileOutput",
}) as any as S.Schema<UpdateProfileOutput>;
export type Question = "UNANSWERED" | "ANSWERED" | (string & {});
export const Question = S.String;
export type QuestionCounts = { [key in Question]?: number };
export const QuestionCounts = S.partial(
  S.Record({ key: Question, value: S.UndefinedOr(S.Number) }),
);
export type ReviewTemplateUpdateStatus =
  | "CURRENT"
  | "LENS_NOT_CURRENT"
  | (string & {});
export const ReviewTemplateUpdateStatus = S.String;
export interface ReviewTemplate {
  Description?: string;
  Lenses?: string[];
  Notes?: string;
  QuestionCounts?: { [key: string]: number | undefined };
  Owner?: string;
  UpdatedAt?: Date;
  TemplateArn?: string;
  TemplateName?: string;
  Tags?: { [key: string]: string | undefined };
  UpdateStatus?: ReviewTemplateUpdateStatus;
  ShareInvitationId?: string;
}
export const ReviewTemplate = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Lenses: S.optional(ReviewTemplateLenses),
    Notes: S.optional(S.String),
    QuestionCounts: S.optional(QuestionCounts),
    Owner: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TemplateArn: S.optional(S.String),
    TemplateName: S.optional(S.String),
    Tags: S.optional(TagMap),
    UpdateStatus: S.optional(ReviewTemplateUpdateStatus),
    ShareInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReviewTemplate",
}) as any as S.Schema<ReviewTemplate>;
export interface UpdateReviewTemplateOutput {
  ReviewTemplate?: ReviewTemplate;
}
export const UpdateReviewTemplateOutput = S.suspend(() =>
  S.Struct({ ReviewTemplate: S.optional(ReviewTemplate) }),
).annotations({
  identifier: "UpdateReviewTemplateOutput",
}) as any as S.Schema<UpdateReviewTemplateOutput>;
export interface ChoiceContent {
  DisplayText?: string;
  Url?: string;
}
export const ChoiceContent = S.suspend(() =>
  S.Struct({ DisplayText: S.optional(S.String), Url: S.optional(S.String) }),
).annotations({
  identifier: "ChoiceContent",
}) as any as S.Schema<ChoiceContent>;
export type AdditionalResourceType =
  | "HELPFUL_RESOURCE"
  | "IMPROVEMENT_PLAN"
  | (string & {});
export const AdditionalResourceType = S.String;
export type Urls = ChoiceContent[];
export const Urls = S.Array(ChoiceContent);
export interface AdditionalResources {
  Type?: AdditionalResourceType;
  Content?: ChoiceContent[];
}
export const AdditionalResources = S.suspend(() =>
  S.Struct({
    Type: S.optional(AdditionalResourceType),
    Content: S.optional(Urls),
  }),
).annotations({
  identifier: "AdditionalResources",
}) as any as S.Schema<AdditionalResources>;
export type AdditionalResourcesList = AdditionalResources[];
export const AdditionalResourcesList = S.Array(AdditionalResources);
export interface Choice {
  ChoiceId?: string;
  Title?: string;
  Description?: string;
  HelpfulResource?: ChoiceContent;
  ImprovementPlan?: ChoiceContent;
  AdditionalResources?: AdditionalResources[];
}
export const Choice = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    HelpfulResource: S.optional(ChoiceContent),
    ImprovementPlan: S.optional(ChoiceContent),
    AdditionalResources: S.optional(AdditionalResourcesList),
  }),
).annotations({ identifier: "Choice" }) as any as S.Schema<Choice>;
export type Choices = Choice[];
export const Choices = S.Array(Choice);
export interface ChoiceAnswer {
  ChoiceId?: string;
  Status?: ChoiceStatus;
  Reason?: ChoiceReason;
  Notes?: string;
}
export const ChoiceAnswer = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    Status: S.optional(ChoiceStatus),
    Reason: S.optional(ChoiceReason),
    Notes: S.optional(S.String),
  }),
).annotations({ identifier: "ChoiceAnswer" }) as any as S.Schema<ChoiceAnswer>;
export type ChoiceAnswers = ChoiceAnswer[];
export const ChoiceAnswers = S.Array(ChoiceAnswer);
export type ReviewTemplateAnswerStatus =
  | "UNANSWERED"
  | "ANSWERED"
  | (string & {});
export const ReviewTemplateAnswerStatus = S.String;
export interface ReviewTemplateAnswer {
  QuestionId?: string;
  PillarId?: string;
  QuestionTitle?: string;
  QuestionDescription?: string;
  ImprovementPlanUrl?: string;
  HelpfulResourceUrl?: string;
  HelpfulResourceDisplayText?: string;
  Choices?: Choice[];
  SelectedChoices?: string[];
  ChoiceAnswers?: ChoiceAnswer[];
  IsApplicable?: boolean;
  AnswerStatus?: ReviewTemplateAnswerStatus;
  Notes?: string;
  Reason?: AnswerReason;
}
export const ReviewTemplateAnswer = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    QuestionDescription: S.optional(S.String),
    ImprovementPlanUrl: S.optional(S.String),
    HelpfulResourceUrl: S.optional(S.String),
    HelpfulResourceDisplayText: S.optional(S.String),
    Choices: S.optional(Choices),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceAnswers: S.optional(ChoiceAnswers),
    IsApplicable: S.optional(S.Boolean),
    AnswerStatus: S.optional(ReviewTemplateAnswerStatus),
    Notes: S.optional(S.String),
    Reason: S.optional(AnswerReason),
  }),
).annotations({
  identifier: "ReviewTemplateAnswer",
}) as any as S.Schema<ReviewTemplateAnswer>;
export interface UpdateReviewTemplateAnswerOutput {
  TemplateArn?: string;
  LensAlias?: string;
  Answer?: ReviewTemplateAnswer;
}
export const UpdateReviewTemplateAnswerOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    LensAlias: S.optional(S.String),
    Answer: S.optional(ReviewTemplateAnswer),
  }),
).annotations({
  identifier: "UpdateReviewTemplateAnswerOutput",
}) as any as S.Schema<UpdateReviewTemplateAnswerOutput>;
export type LensStatus =
  | "CURRENT"
  | "NOT_CURRENT"
  | "DEPRECATED"
  | "DELETED"
  | "UNSHARED"
  | (string & {});
export const LensStatus = S.String;
export interface ReviewTemplatePillarReviewSummary {
  PillarId?: string;
  PillarName?: string;
  Notes?: string;
  QuestionCounts?: { [key: string]: number | undefined };
}
export const ReviewTemplatePillarReviewSummary = S.suspend(() =>
  S.Struct({
    PillarId: S.optional(S.String),
    PillarName: S.optional(S.String),
    Notes: S.optional(S.String),
    QuestionCounts: S.optional(QuestionCounts),
  }),
).annotations({
  identifier: "ReviewTemplatePillarReviewSummary",
}) as any as S.Schema<ReviewTemplatePillarReviewSummary>;
export type ReviewTemplatePillarReviewSummaries =
  ReviewTemplatePillarReviewSummary[];
export const ReviewTemplatePillarReviewSummaries = S.Array(
  ReviewTemplatePillarReviewSummary,
);
export interface ReviewTemplateLensReview {
  LensAlias?: string;
  LensArn?: string;
  LensVersion?: string;
  LensName?: string;
  LensStatus?: LensStatus;
  PillarReviewSummaries?: ReviewTemplatePillarReviewSummary[];
  UpdatedAt?: Date;
  Notes?: string;
  QuestionCounts?: { [key: string]: number | undefined };
  NextToken?: string;
}
export const ReviewTemplateLensReview = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    LensVersion: S.optional(S.String),
    LensName: S.optional(S.String),
    LensStatus: S.optional(LensStatus),
    PillarReviewSummaries: S.optional(ReviewTemplatePillarReviewSummaries),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Notes: S.optional(S.String),
    QuestionCounts: S.optional(QuestionCounts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ReviewTemplateLensReview",
}) as any as S.Schema<ReviewTemplateLensReview>;
export interface UpdateReviewTemplateLensReviewOutput {
  TemplateArn?: string;
  LensReview?: ReviewTemplateLensReview;
}
export const UpdateReviewTemplateLensReviewOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    LensReview: S.optional(ReviewTemplateLensReview),
  }),
).annotations({
  identifier: "UpdateReviewTemplateLensReviewOutput",
}) as any as S.Schema<UpdateReviewTemplateLensReviewOutput>;
export type Risk =
  | "UNANSWERED"
  | "HIGH"
  | "MEDIUM"
  | "NONE"
  | "NOT_APPLICABLE"
  | (string & {});
export const Risk = S.String;
export type RiskCounts = { [key in Risk]?: number };
export const RiskCounts = S.partial(
  S.Record({ key: Risk, value: S.UndefinedOr(S.Number) }),
);
export interface WorkloadProfile {
  ProfileArn?: string;
  ProfileVersion?: string;
}
export const WorkloadProfile = S.suspend(() =>
  S.Struct({
    ProfileArn: S.optional(S.String),
    ProfileVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadProfile",
}) as any as S.Schema<WorkloadProfile>;
export type WorkloadProfiles = WorkloadProfile[];
export const WorkloadProfiles = S.Array(WorkloadProfile);
export interface WorkloadJiraConfigurationOutput {
  IssueManagementStatus?: WorkloadIssueManagementStatus;
  IssueManagementType?: IssueManagementType;
  JiraProjectKey?: string;
  StatusMessage?: string;
}
export const WorkloadJiraConfigurationOutput = S.suspend(() =>
  S.Struct({
    IssueManagementStatus: S.optional(WorkloadIssueManagementStatus),
    IssueManagementType: S.optional(IssueManagementType),
    JiraProjectKey: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadJiraConfigurationOutput",
}) as any as S.Schema<WorkloadJiraConfigurationOutput>;
export interface Workload {
  WorkloadId?: string;
  WorkloadArn?: string;
  WorkloadName?: string;
  Description?: string;
  Environment?: WorkloadEnvironment;
  UpdatedAt?: Date;
  AccountIds?: string[];
  AwsRegions?: string[];
  NonAwsRegions?: string[];
  ArchitecturalDesign?: string;
  ReviewOwner?: string;
  ReviewRestrictionDate?: Date;
  IsReviewOwnerUpdateAcknowledged?: boolean;
  IndustryType?: string;
  Industry?: string;
  Notes?: string;
  ImprovementStatus?: WorkloadImprovementStatus;
  RiskCounts?: { [key: string]: number | undefined };
  PillarPriorities?: string[];
  Lenses?: string[];
  Owner?: string;
  ShareInvitationId?: string;
  Tags?: { [key: string]: string | undefined };
  DiscoveryConfig?: WorkloadDiscoveryConfig;
  Applications?: string[];
  Profiles?: WorkloadProfile[];
  PrioritizedRiskCounts?: { [key: string]: number | undefined };
  JiraConfiguration?: WorkloadJiraConfigurationOutput;
}
export const Workload = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadArn: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    Description: S.optional(S.String),
    Environment: S.optional(WorkloadEnvironment),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AccountIds: S.optional(WorkloadAccountIds),
    AwsRegions: S.optional(WorkloadAwsRegions),
    NonAwsRegions: S.optional(WorkloadNonAwsRegions),
    ArchitecturalDesign: S.optional(S.String),
    ReviewOwner: S.optional(S.String),
    ReviewRestrictionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    IsReviewOwnerUpdateAcknowledged: S.optional(S.Boolean),
    IndustryType: S.optional(S.String),
    Industry: S.optional(S.String),
    Notes: S.optional(S.String),
    ImprovementStatus: S.optional(WorkloadImprovementStatus),
    RiskCounts: S.optional(RiskCounts),
    PillarPriorities: S.optional(WorkloadPillarPriorities),
    Lenses: S.optional(WorkloadLenses),
    Owner: S.optional(S.String),
    ShareInvitationId: S.optional(S.String),
    Tags: S.optional(TagMap),
    DiscoveryConfig: S.optional(WorkloadDiscoveryConfig),
    Applications: S.optional(WorkloadApplications),
    Profiles: S.optional(WorkloadProfiles),
    PrioritizedRiskCounts: S.optional(RiskCounts),
    JiraConfiguration: S.optional(WorkloadJiraConfigurationOutput),
  }),
).annotations({ identifier: "Workload" }) as any as S.Schema<Workload>;
export interface UpdateWorkloadOutput {
  Workload?: Workload;
}
export const UpdateWorkloadOutput = S.suspend(() =>
  S.Struct({ Workload: S.optional(Workload) }),
).annotations({
  identifier: "UpdateWorkloadOutput",
}) as any as S.Schema<UpdateWorkloadOutput>;
export type MetricType = "WORKLOAD" | (string & {});
export const MetricType = S.String;
export type QuestionType = "PRIORITIZED" | "NON_PRIORITIZED" | (string & {});
export const QuestionType = S.String;
export type CheckProvider = "TRUSTED_ADVISOR" | (string & {});
export const CheckProvider = S.String;
export type CheckStatus =
  | "OKAY"
  | "WARNING"
  | "ERROR"
  | "NOT_AVAILABLE"
  | "FETCH_FAILED"
  | (string & {});
export const CheckStatus = S.String;
export type CheckFailureReason =
  | "ASSUME_ROLE_ERROR"
  | "ACCESS_DENIED"
  | "UNKNOWN_ERROR"
  | "PREMIUM_SUPPORT_REQUIRED"
  | (string & {});
export const CheckFailureReason = S.String;
export type NotificationType =
  | "LENS_VERSION_UPGRADED"
  | "LENS_VERSION_DEPRECATED"
  | (string & {});
export const NotificationType = S.String;
export type ProfileNotificationType =
  | "PROFILE_ANSWERS_UPDATED"
  | "PROFILE_DELETED"
  | (string & {});
export const ProfileNotificationType = S.String;
export interface SelectedPillar {
  PillarId?: string;
  SelectedQuestionIds?: string[];
}
export const SelectedPillar = S.suspend(() =>
  S.Struct({
    PillarId: S.optional(S.String),
    SelectedQuestionIds: S.optional(SelectedQuestionIds),
  }),
).annotations({
  identifier: "SelectedPillar",
}) as any as S.Schema<SelectedPillar>;
export type SelectedPillars = SelectedPillar[];
export const SelectedPillars = S.Array(SelectedPillar);
export interface Lens {
  LensArn?: string;
  LensVersion?: string;
  Name?: string;
  Description?: string;
  Owner?: string;
  ShareInvitationId?: string;
  Tags?: { [key: string]: string | undefined };
}
export const Lens = S.suspend(() =>
  S.Struct({
    LensArn: S.optional(S.String),
    LensVersion: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Owner: S.optional(S.String),
    ShareInvitationId: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Lens" }) as any as S.Schema<Lens>;
export interface LensReviewReport {
  LensAlias?: string;
  LensArn?: string;
  Base64String?: string;
}
export const LensReviewReport = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    Base64String: S.optional(S.String),
  }),
).annotations({
  identifier: "LensReviewReport",
}) as any as S.Schema<LensReviewReport>;
export interface Milestone {
  MilestoneNumber?: number;
  MilestoneName?: string;
  RecordedAt?: Date;
  Workload?: Workload;
}
export const Milestone = S.suspend(() =>
  S.Struct({
    MilestoneNumber: S.optional(S.Number),
    MilestoneName: S.optional(S.String),
    RecordedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Workload: S.optional(Workload),
  }),
).annotations({ identifier: "Milestone" }) as any as S.Schema<Milestone>;
export interface CheckDetail {
  Id?: string;
  Name?: string;
  Description?: string;
  Provider?: CheckProvider;
  LensArn?: string;
  PillarId?: string;
  QuestionId?: string;
  ChoiceId?: string;
  Status?: CheckStatus;
  AccountId?: string;
  FlaggedResources?: number;
  Reason?: CheckFailureReason;
  UpdatedAt?: Date;
}
export const CheckDetail = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Provider: S.optional(CheckProvider),
    LensArn: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionId: S.optional(S.String),
    ChoiceId: S.optional(S.String),
    Status: S.optional(CheckStatus),
    AccountId: S.optional(S.String),
    FlaggedResources: S.optional(S.Number),
    Reason: S.optional(CheckFailureReason),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "CheckDetail" }) as any as S.Schema<CheckDetail>;
export type CheckDetails = CheckDetail[];
export const CheckDetails = S.Array(CheckDetail);
export interface LensSummary {
  LensArn?: string;
  LensAlias?: string;
  LensName?: string;
  LensType?: LensType;
  Description?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  LensVersion?: string;
  Owner?: string;
  LensStatus?: LensStatus;
}
export const LensSummary = S.suspend(() =>
  S.Struct({
    LensArn: S.optional(S.String),
    LensAlias: S.optional(S.String),
    LensName: S.optional(S.String),
    LensType: S.optional(LensType),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LensVersion: S.optional(S.String),
    Owner: S.optional(S.String),
    LensStatus: S.optional(LensStatus),
  }),
).annotations({ identifier: "LensSummary" }) as any as S.Schema<LensSummary>;
export type LensSummaries = LensSummary[];
export const LensSummaries = S.Array(LensSummary);
export interface LensReviewSummary {
  LensAlias?: string;
  LensArn?: string;
  LensVersion?: string;
  LensName?: string;
  LensStatus?: LensStatus;
  UpdatedAt?: Date;
  RiskCounts?: { [key: string]: number | undefined };
  Profiles?: WorkloadProfile[];
  PrioritizedRiskCounts?: { [key: string]: number | undefined };
}
export const LensReviewSummary = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    LensVersion: S.optional(S.String),
    LensName: S.optional(S.String),
    LensStatus: S.optional(LensStatus),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RiskCounts: S.optional(RiskCounts),
    Profiles: S.optional(WorkloadProfiles),
    PrioritizedRiskCounts: S.optional(RiskCounts),
  }),
).annotations({
  identifier: "LensReviewSummary",
}) as any as S.Schema<LensReviewSummary>;
export type LensReviewSummaries = LensReviewSummary[];
export const LensReviewSummaries = S.Array(LensReviewSummary);
export interface LensShareSummary {
  ShareId?: string;
  SharedWith?: string;
  Status?: ShareStatus;
  StatusMessage?: string;
}
export const LensShareSummary = S.suspend(() =>
  S.Struct({
    ShareId: S.optional(S.String),
    SharedWith: S.optional(S.String),
    Status: S.optional(ShareStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "LensShareSummary",
}) as any as S.Schema<LensShareSummary>;
export type LensShareSummaries = LensShareSummary[];
export const LensShareSummaries = S.Array(LensShareSummary);
export interface WorkloadSummary {
  WorkloadId?: string;
  WorkloadArn?: string;
  WorkloadName?: string;
  Owner?: string;
  UpdatedAt?: Date;
  Lenses?: string[];
  RiskCounts?: { [key: string]: number | undefined };
  ImprovementStatus?: WorkloadImprovementStatus;
  Profiles?: WorkloadProfile[];
  PrioritizedRiskCounts?: { [key: string]: number | undefined };
}
export const WorkloadSummary = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadArn: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    Owner: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Lenses: S.optional(WorkloadLenses),
    RiskCounts: S.optional(RiskCounts),
    ImprovementStatus: S.optional(WorkloadImprovementStatus),
    Profiles: S.optional(WorkloadProfiles),
    PrioritizedRiskCounts: S.optional(RiskCounts),
  }),
).annotations({
  identifier: "WorkloadSummary",
}) as any as S.Schema<WorkloadSummary>;
export interface MilestoneSummary {
  MilestoneNumber?: number;
  MilestoneName?: string;
  RecordedAt?: Date;
  WorkloadSummary?: WorkloadSummary;
}
export const MilestoneSummary = S.suspend(() =>
  S.Struct({
    MilestoneNumber: S.optional(S.Number),
    MilestoneName: S.optional(S.String),
    RecordedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    WorkloadSummary: S.optional(WorkloadSummary),
  }),
).annotations({
  identifier: "MilestoneSummary",
}) as any as S.Schema<MilestoneSummary>;
export type MilestoneSummaries = MilestoneSummary[];
export const MilestoneSummaries = S.Array(MilestoneSummary);
export interface ProfileNotificationSummary {
  CurrentProfileVersion?: string;
  LatestProfileVersion?: string;
  Type?: ProfileNotificationType;
  ProfileArn?: string;
  ProfileName?: string;
  WorkloadId?: string;
  WorkloadName?: string;
}
export const ProfileNotificationSummary = S.suspend(() =>
  S.Struct({
    CurrentProfileVersion: S.optional(S.String),
    LatestProfileVersion: S.optional(S.String),
    Type: S.optional(ProfileNotificationType),
    ProfileArn: S.optional(S.String),
    ProfileName: S.optional(S.String),
    WorkloadId: S.optional(S.String),
    WorkloadName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProfileNotificationSummary",
}) as any as S.Schema<ProfileNotificationSummary>;
export type ProfileNotificationSummaries = ProfileNotificationSummary[];
export const ProfileNotificationSummaries = S.Array(ProfileNotificationSummary);
export interface ProfileSummary {
  ProfileArn?: string;
  ProfileVersion?: string;
  ProfileName?: string;
  ProfileDescription?: string;
  Owner?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ProfileSummary = S.suspend(() =>
  S.Struct({
    ProfileArn: S.optional(S.String),
    ProfileVersion: S.optional(S.String),
    ProfileName: S.optional(S.String),
    ProfileDescription: S.optional(S.String),
    Owner: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProfileSummary",
}) as any as S.Schema<ProfileSummary>;
export type ProfileSummaries = ProfileSummary[];
export const ProfileSummaries = S.Array(ProfileSummary);
export interface ProfileShareSummary {
  ShareId?: string;
  SharedWith?: string;
  Status?: ShareStatus;
  StatusMessage?: string;
}
export const ProfileShareSummary = S.suspend(() =>
  S.Struct({
    ShareId: S.optional(S.String),
    SharedWith: S.optional(S.String),
    Status: S.optional(ShareStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ProfileShareSummary",
}) as any as S.Schema<ProfileShareSummary>;
export type ProfileShareSummaries = ProfileShareSummary[];
export const ProfileShareSummaries = S.Array(ProfileShareSummary);
export interface ChoiceAnswerSummary {
  ChoiceId?: string;
  Status?: ChoiceStatus;
  Reason?: ChoiceReason;
}
export const ChoiceAnswerSummary = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    Status: S.optional(ChoiceStatus),
    Reason: S.optional(ChoiceReason),
  }),
).annotations({
  identifier: "ChoiceAnswerSummary",
}) as any as S.Schema<ChoiceAnswerSummary>;
export type ChoiceAnswerSummaries = ChoiceAnswerSummary[];
export const ChoiceAnswerSummaries = S.Array(ChoiceAnswerSummary);
export interface ReviewTemplateAnswerSummary {
  QuestionId?: string;
  PillarId?: string;
  QuestionTitle?: string;
  Choices?: Choice[];
  SelectedChoices?: string[];
  ChoiceAnswerSummaries?: ChoiceAnswerSummary[];
  IsApplicable?: boolean;
  AnswerStatus?: ReviewTemplateAnswerStatus;
  Reason?: AnswerReason;
  QuestionType?: QuestionType;
}
export const ReviewTemplateAnswerSummary = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    Choices: S.optional(Choices),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceAnswerSummaries: S.optional(ChoiceAnswerSummaries),
    IsApplicable: S.optional(S.Boolean),
    AnswerStatus: S.optional(ReviewTemplateAnswerStatus),
    Reason: S.optional(AnswerReason),
    QuestionType: S.optional(QuestionType),
  }),
).annotations({
  identifier: "ReviewTemplateAnswerSummary",
}) as any as S.Schema<ReviewTemplateAnswerSummary>;
export type ReviewTemplateAnswerSummaries = ReviewTemplateAnswerSummary[];
export const ReviewTemplateAnswerSummaries = S.Array(
  ReviewTemplateAnswerSummary,
);
export interface ReviewTemplateSummary {
  Description?: string;
  Lenses?: string[];
  Owner?: string;
  UpdatedAt?: Date;
  TemplateArn?: string;
  TemplateName?: string;
  UpdateStatus?: ReviewTemplateUpdateStatus;
}
export const ReviewTemplateSummary = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Lenses: S.optional(ReviewTemplateLenses),
    Owner: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TemplateArn: S.optional(S.String),
    TemplateName: S.optional(S.String),
    UpdateStatus: S.optional(ReviewTemplateUpdateStatus),
  }),
).annotations({
  identifier: "ReviewTemplateSummary",
}) as any as S.Schema<ReviewTemplateSummary>;
export type ReviewTemplates = ReviewTemplateSummary[];
export const ReviewTemplates = S.Array(ReviewTemplateSummary);
export interface ShareInvitationSummary {
  ShareInvitationId?: string;
  SharedBy?: string;
  SharedWith?: string;
  PermissionType?: PermissionType;
  ShareResourceType?: ShareResourceType;
  WorkloadName?: string;
  WorkloadId?: string;
  LensName?: string;
  LensArn?: string;
  ProfileName?: string;
  ProfileArn?: string;
  TemplateName?: string;
  TemplateArn?: string;
}
export const ShareInvitationSummary = S.suspend(() =>
  S.Struct({
    ShareInvitationId: S.optional(S.String),
    SharedBy: S.optional(S.String),
    SharedWith: S.optional(S.String),
    PermissionType: S.optional(PermissionType),
    ShareResourceType: S.optional(ShareResourceType),
    WorkloadName: S.optional(S.String),
    WorkloadId: S.optional(S.String),
    LensName: S.optional(S.String),
    LensArn: S.optional(S.String),
    ProfileName: S.optional(S.String),
    ProfileArn: S.optional(S.String),
    TemplateName: S.optional(S.String),
    TemplateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ShareInvitationSummary",
}) as any as S.Schema<ShareInvitationSummary>;
export type ShareInvitationSummaries = ShareInvitationSummary[];
export const ShareInvitationSummaries = S.Array(ShareInvitationSummary);
export interface TemplateShareSummary {
  ShareId?: string;
  SharedWith?: string;
  Status?: ShareStatus;
  StatusMessage?: string;
}
export const TemplateShareSummary = S.suspend(() =>
  S.Struct({
    ShareId: S.optional(S.String),
    SharedWith: S.optional(S.String),
    Status: S.optional(ShareStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateShareSummary",
}) as any as S.Schema<TemplateShareSummary>;
export type TemplateShareSummaries = TemplateShareSummary[];
export const TemplateShareSummaries = S.Array(TemplateShareSummary);
export type WorkloadSummaries = WorkloadSummary[];
export const WorkloadSummaries = S.Array(WorkloadSummary);
export interface WorkloadShareSummary {
  ShareId?: string;
  SharedWith?: string;
  PermissionType?: PermissionType;
  Status?: ShareStatus;
  StatusMessage?: string;
}
export const WorkloadShareSummary = S.suspend(() =>
  S.Struct({
    ShareId: S.optional(S.String),
    SharedWith: S.optional(S.String),
    PermissionType: S.optional(PermissionType),
    Status: S.optional(ShareStatus),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadShareSummary",
}) as any as S.Schema<WorkloadShareSummary>;
export type WorkloadShareSummaries = WorkloadShareSummary[];
export const WorkloadShareSummaries = S.Array(WorkloadShareSummary);
export interface JiraSelectedQuestionConfiguration {
  SelectedPillars?: SelectedPillar[];
}
export const JiraSelectedQuestionConfiguration = S.suspend(() =>
  S.Struct({ SelectedPillars: S.optional(SelectedPillars) }),
).annotations({
  identifier: "JiraSelectedQuestionConfiguration",
}) as any as S.Schema<JiraSelectedQuestionConfiguration>;
export interface ShareInvitation {
  ShareInvitationId?: string;
  ShareResourceType?: ShareResourceType;
  WorkloadId?: string;
  LensAlias?: string;
  LensArn?: string;
  ProfileArn?: string;
  TemplateArn?: string;
}
export const ShareInvitation = S.suspend(() =>
  S.Struct({
    ShareInvitationId: S.optional(S.String),
    ShareResourceType: S.optional(ShareResourceType),
    WorkloadId: S.optional(S.String),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    ProfileArn: S.optional(S.String),
    TemplateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ShareInvitation",
}) as any as S.Schema<ShareInvitation>;
export interface WorkloadShare {
  ShareId?: string;
  SharedBy?: string;
  SharedWith?: string;
  PermissionType?: PermissionType;
  Status?: ShareStatus;
  WorkloadName?: string;
  WorkloadId?: string;
}
export const WorkloadShare = S.suspend(() =>
  S.Struct({
    ShareId: S.optional(S.String),
    SharedBy: S.optional(S.String),
    SharedWith: S.optional(S.String),
    PermissionType: S.optional(PermissionType),
    Status: S.optional(ShareStatus),
    WorkloadName: S.optional(S.String),
    WorkloadId: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadShare",
}) as any as S.Schema<WorkloadShare>;
export type DifferenceStatus = "UPDATED" | "NEW" | "DELETED" | (string & {});
export const DifferenceStatus = S.String;
export interface ProfileTemplateChoice {
  ChoiceId?: string;
  ChoiceTitle?: string;
  ChoiceDescription?: string;
}
export const ProfileTemplateChoice = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    ChoiceTitle: S.optional(S.String),
    ChoiceDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "ProfileTemplateChoice",
}) as any as S.Schema<ProfileTemplateChoice>;
export type ProfileTemplateQuestionChoices = ProfileTemplateChoice[];
export const ProfileTemplateQuestionChoices = S.Array(ProfileTemplateChoice);
export interface CreateProfileOutput {
  ProfileArn?: string;
  ProfileVersion?: string;
}
export const CreateProfileOutput = S.suspend(() =>
  S.Struct({
    ProfileArn: S.optional(S.String),
    ProfileVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateProfileOutput",
}) as any as S.Schema<CreateProfileOutput>;
export interface CreateWorkloadOutput {
  WorkloadId?: string;
  WorkloadArn?: string;
}
export const CreateWorkloadOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWorkloadOutput",
}) as any as S.Schema<CreateWorkloadOutput>;
export interface GetLensOutput {
  Lens?: Lens;
}
export const GetLensOutput = S.suspend(() =>
  S.Struct({ Lens: S.optional(Lens) }),
).annotations({
  identifier: "GetLensOutput",
}) as any as S.Schema<GetLensOutput>;
export interface GetLensReviewReportOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensReviewReport?: LensReviewReport;
}
export const GetLensReviewReportOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensReviewReport: S.optional(LensReviewReport),
  }),
).annotations({
  identifier: "GetLensReviewReportOutput",
}) as any as S.Schema<GetLensReviewReportOutput>;
export interface GetMilestoneOutput {
  WorkloadId?: string;
  Milestone?: Milestone;
}
export const GetMilestoneOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    Milestone: S.optional(Milestone),
  }),
).annotations({
  identifier: "GetMilestoneOutput",
}) as any as S.Schema<GetMilestoneOutput>;
export interface GetReviewTemplateAnswerOutput {
  TemplateArn?: string;
  LensAlias?: string;
  Answer?: ReviewTemplateAnswer;
}
export const GetReviewTemplateAnswerOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    LensAlias: S.optional(S.String),
    Answer: S.optional(ReviewTemplateAnswer),
  }),
).annotations({
  identifier: "GetReviewTemplateAnswerOutput",
}) as any as S.Schema<GetReviewTemplateAnswerOutput>;
export interface ListCheckDetailsOutput {
  CheckDetails?: CheckDetail[];
  NextToken?: string;
}
export const ListCheckDetailsOutput = S.suspend(() =>
  S.Struct({
    CheckDetails: S.optional(CheckDetails),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCheckDetailsOutput",
}) as any as S.Schema<ListCheckDetailsOutput>;
export interface ListLensesOutput {
  LensSummaries?: LensSummary[];
  NextToken?: string;
}
export const ListLensesOutput = S.suspend(() =>
  S.Struct({
    LensSummaries: S.optional(LensSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLensesOutput",
}) as any as S.Schema<ListLensesOutput>;
export interface ListLensReviewsOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensReviewSummaries?: LensReviewSummary[];
  NextToken?: string;
}
export const ListLensReviewsOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensReviewSummaries: S.optional(LensReviewSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLensReviewsOutput",
}) as any as S.Schema<ListLensReviewsOutput>;
export interface ListLensSharesOutput {
  LensShareSummaries?: LensShareSummary[];
  NextToken?: string;
}
export const ListLensSharesOutput = S.suspend(() =>
  S.Struct({
    LensShareSummaries: S.optional(LensShareSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLensSharesOutput",
}) as any as S.Schema<ListLensSharesOutput>;
export interface ListMilestonesOutput {
  WorkloadId?: string;
  MilestoneSummaries?: MilestoneSummary[];
  NextToken?: string;
}
export const ListMilestonesOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneSummaries: S.optional(MilestoneSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMilestonesOutput",
}) as any as S.Schema<ListMilestonesOutput>;
export interface ListProfileNotificationsOutput {
  NotificationSummaries?: ProfileNotificationSummary[];
  NextToken?: string;
}
export const ListProfileNotificationsOutput = S.suspend(() =>
  S.Struct({
    NotificationSummaries: S.optional(ProfileNotificationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileNotificationsOutput",
}) as any as S.Schema<ListProfileNotificationsOutput>;
export interface ListProfilesOutput {
  ProfileSummaries?: ProfileSummary[];
  NextToken?: string;
}
export const ListProfilesOutput = S.suspend(() =>
  S.Struct({
    ProfileSummaries: S.optional(ProfileSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfilesOutput",
}) as any as S.Schema<ListProfilesOutput>;
export interface ListProfileSharesOutput {
  ProfileShareSummaries?: ProfileShareSummary[];
  NextToken?: string;
}
export const ListProfileSharesOutput = S.suspend(() =>
  S.Struct({
    ProfileShareSummaries: S.optional(ProfileShareSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProfileSharesOutput",
}) as any as S.Schema<ListProfileSharesOutput>;
export interface ListReviewTemplateAnswersOutput {
  TemplateArn?: string;
  LensAlias?: string;
  AnswerSummaries?: ReviewTemplateAnswerSummary[];
  NextToken?: string;
}
export const ListReviewTemplateAnswersOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    LensAlias: S.optional(S.String),
    AnswerSummaries: S.optional(ReviewTemplateAnswerSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReviewTemplateAnswersOutput",
}) as any as S.Schema<ListReviewTemplateAnswersOutput>;
export interface ListReviewTemplatesOutput {
  ReviewTemplates?: ReviewTemplateSummary[];
  NextToken?: string;
}
export const ListReviewTemplatesOutput = S.suspend(() =>
  S.Struct({
    ReviewTemplates: S.optional(ReviewTemplates),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReviewTemplatesOutput",
}) as any as S.Schema<ListReviewTemplatesOutput>;
export interface ListShareInvitationsOutput {
  ShareInvitationSummaries?: ShareInvitationSummary[];
  NextToken?: string;
}
export const ListShareInvitationsOutput = S.suspend(() =>
  S.Struct({
    ShareInvitationSummaries: S.optional(ShareInvitationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListShareInvitationsOutput",
}) as any as S.Schema<ListShareInvitationsOutput>;
export interface ListTemplateSharesOutput {
  TemplateArn?: string;
  TemplateShareSummaries?: TemplateShareSummary[];
  NextToken?: string;
}
export const ListTemplateSharesOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    TemplateShareSummaries: S.optional(TemplateShareSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTemplateSharesOutput",
}) as any as S.Schema<ListTemplateSharesOutput>;
export interface ListWorkloadsOutput {
  WorkloadSummaries?: WorkloadSummary[];
  NextToken?: string;
}
export const ListWorkloadsOutput = S.suspend(() =>
  S.Struct({
    WorkloadSummaries: S.optional(WorkloadSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadsOutput",
}) as any as S.Schema<ListWorkloadsOutput>;
export interface ListWorkloadSharesOutput {
  WorkloadId?: string;
  WorkloadShareSummaries?: WorkloadShareSummary[];
  NextToken?: string;
}
export const ListWorkloadSharesOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadShareSummaries: S.optional(WorkloadShareSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadSharesOutput",
}) as any as S.Schema<ListWorkloadSharesOutput>;
export interface UpdateAnswerInput {
  WorkloadId: string;
  LensAlias: string;
  QuestionId: string;
  SelectedChoices?: string[];
  ChoiceUpdates?: { [key: string]: ChoiceUpdate | undefined };
  Notes?: string;
  IsApplicable?: boolean;
  Reason?: AnswerReason;
}
export const UpdateAnswerInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    QuestionId: S.String.pipe(T.HttpLabel("QuestionId")),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceUpdates: S.optional(ChoiceUpdates),
    Notes: S.optional(S.String),
    IsApplicable: S.optional(S.Boolean),
    Reason: S.optional(AnswerReason),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}/answers/{QuestionId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAnswerInput",
}) as any as S.Schema<UpdateAnswerInput>;
export interface UpdateLensReviewInput {
  WorkloadId: string;
  LensAlias: string;
  LensNotes?: string;
  PillarNotes?: { [key: string]: string | undefined };
  JiraConfiguration?: JiraSelectedQuestionConfiguration;
}
export const UpdateLensReviewInput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.String.pipe(T.HttpLabel("WorkloadId")),
    LensAlias: S.String.pipe(T.HttpLabel("LensAlias")),
    LensNotes: S.optional(S.String),
    PillarNotes: S.optional(PillarNotes),
    JiraConfiguration: S.optional(JiraSelectedQuestionConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/workloads/{WorkloadId}/lensReviews/{LensAlias}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLensReviewInput",
}) as any as S.Schema<UpdateLensReviewInput>;
export interface UpdateShareInvitationOutput {
  ShareInvitation?: ShareInvitation;
}
export const UpdateShareInvitationOutput = S.suspend(() =>
  S.Struct({ ShareInvitation: S.optional(ShareInvitation) }),
).annotations({
  identifier: "UpdateShareInvitationOutput",
}) as any as S.Schema<UpdateShareInvitationOutput>;
export interface UpdateWorkloadShareOutput {
  WorkloadId?: string;
  WorkloadShare?: WorkloadShare;
}
export const UpdateWorkloadShareOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadShare: S.optional(WorkloadShare),
  }),
).annotations({
  identifier: "UpdateWorkloadShareOutput",
}) as any as S.Schema<UpdateWorkloadShareOutput>;
export interface JiraConfiguration {
  JiraIssueUrl?: string;
  LastSyncedTime?: Date;
}
export const JiraConfiguration = S.suspend(() =>
  S.Struct({
    JiraIssueUrl: S.optional(S.String),
    LastSyncedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "JiraConfiguration",
}) as any as S.Schema<JiraConfiguration>;
export interface PillarReviewSummary {
  PillarId?: string;
  PillarName?: string;
  Notes?: string;
  RiskCounts?: { [key: string]: number | undefined };
  PrioritizedRiskCounts?: { [key: string]: number | undefined };
}
export const PillarReviewSummary = S.suspend(() =>
  S.Struct({
    PillarId: S.optional(S.String),
    PillarName: S.optional(S.String),
    Notes: S.optional(S.String),
    RiskCounts: S.optional(RiskCounts),
    PrioritizedRiskCounts: S.optional(RiskCounts),
  }),
).annotations({
  identifier: "PillarReviewSummary",
}) as any as S.Schema<PillarReviewSummary>;
export type PillarReviewSummaries = PillarReviewSummary[];
export const PillarReviewSummaries = S.Array(PillarReviewSummary);
export interface ProfileTemplateQuestion {
  QuestionId?: string;
  QuestionTitle?: string;
  QuestionDescription?: string;
  QuestionChoices?: ProfileTemplateChoice[];
  MinSelectedChoices?: number;
  MaxSelectedChoices?: number;
}
export const ProfileTemplateQuestion = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    QuestionDescription: S.optional(S.String),
    QuestionChoices: S.optional(ProfileTemplateQuestionChoices),
    MinSelectedChoices: S.optional(S.Number),
    MaxSelectedChoices: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProfileTemplateQuestion",
}) as any as S.Schema<ProfileTemplateQuestion>;
export type TemplateQuestions = ProfileTemplateQuestion[];
export const TemplateQuestions = S.Array(ProfileTemplateQuestion);
export type AccountSummary = { [key in CheckStatus]?: number };
export const AccountSummary = S.partial(
  S.Record({ key: CheckStatus, value: S.UndefinedOr(S.Number) }),
);
export interface ChoiceImprovementPlan {
  ChoiceId?: string;
  DisplayText?: string;
  ImprovementPlanUrl?: string;
}
export const ChoiceImprovementPlan = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    DisplayText: S.optional(S.String),
    ImprovementPlanUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ChoiceImprovementPlan",
}) as any as S.Schema<ChoiceImprovementPlan>;
export type ChoiceImprovementPlans = ChoiceImprovementPlan[];
export const ChoiceImprovementPlans = S.Array(ChoiceImprovementPlan);
export interface LensUpgradeSummary {
  WorkloadId?: string;
  WorkloadName?: string;
  LensAlias?: string;
  LensArn?: string;
  CurrentLensVersion?: string;
  LatestLensVersion?: string;
  ResourceArn?: string;
  ResourceName?: string;
}
export const LensUpgradeSummary = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    CurrentLensVersion: S.optional(S.String),
    LatestLensVersion: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "LensUpgradeSummary",
}) as any as S.Schema<LensUpgradeSummary>;
export interface LensReview {
  LensAlias?: string;
  LensArn?: string;
  LensVersion?: string;
  LensName?: string;
  LensStatus?: LensStatus;
  PillarReviewSummaries?: PillarReviewSummary[];
  JiraConfiguration?: JiraSelectedQuestionConfiguration;
  UpdatedAt?: Date;
  Notes?: string;
  RiskCounts?: { [key: string]: number | undefined };
  NextToken?: string;
  Profiles?: WorkloadProfile[];
  PrioritizedRiskCounts?: { [key: string]: number | undefined };
}
export const LensReview = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    LensVersion: S.optional(S.String),
    LensName: S.optional(S.String),
    LensStatus: S.optional(LensStatus),
    PillarReviewSummaries: S.optional(PillarReviewSummaries),
    JiraConfiguration: S.optional(JiraSelectedQuestionConfiguration),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Notes: S.optional(S.String),
    RiskCounts: S.optional(RiskCounts),
    NextToken: S.optional(S.String),
    Profiles: S.optional(WorkloadProfiles),
    PrioritizedRiskCounts: S.optional(RiskCounts),
  }),
).annotations({ identifier: "LensReview" }) as any as S.Schema<LensReview>;
export interface ProfileTemplate {
  TemplateName?: string;
  TemplateQuestions?: ProfileTemplateQuestion[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ProfileTemplate = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    TemplateQuestions: S.optional(TemplateQuestions),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProfileTemplate",
}) as any as S.Schema<ProfileTemplate>;
export interface AnswerSummary {
  QuestionId?: string;
  PillarId?: string;
  QuestionTitle?: string;
  Choices?: Choice[];
  SelectedChoices?: string[];
  ChoiceAnswerSummaries?: ChoiceAnswerSummary[];
  IsApplicable?: boolean;
  Risk?: Risk;
  Reason?: AnswerReason;
  QuestionType?: QuestionType;
  JiraConfiguration?: JiraConfiguration;
}
export const AnswerSummary = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    Choices: S.optional(Choices),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceAnswerSummaries: S.optional(ChoiceAnswerSummaries),
    IsApplicable: S.optional(S.Boolean),
    Risk: S.optional(Risk),
    Reason: S.optional(AnswerReason),
    QuestionType: S.optional(QuestionType),
    JiraConfiguration: S.optional(JiraConfiguration),
  }),
).annotations({
  identifier: "AnswerSummary",
}) as any as S.Schema<AnswerSummary>;
export type AnswerSummaries = AnswerSummary[];
export const AnswerSummaries = S.Array(AnswerSummary);
export interface CheckSummary {
  Id?: string;
  Name?: string;
  Provider?: CheckProvider;
  Description?: string;
  UpdatedAt?: Date;
  LensArn?: string;
  PillarId?: string;
  QuestionId?: string;
  ChoiceId?: string;
  Status?: CheckStatus;
  AccountSummary?: { [key: string]: number | undefined };
}
export const CheckSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Provider: S.optional(CheckProvider),
    Description: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LensArn: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionId: S.optional(S.String),
    ChoiceId: S.optional(S.String),
    Status: S.optional(CheckStatus),
    AccountSummary: S.optional(AccountSummary),
  }),
).annotations({ identifier: "CheckSummary" }) as any as S.Schema<CheckSummary>;
export type CheckSummaries = CheckSummary[];
export const CheckSummaries = S.Array(CheckSummary);
export interface ImprovementSummary {
  QuestionId?: string;
  PillarId?: string;
  QuestionTitle?: string;
  Risk?: Risk;
  ImprovementPlanUrl?: string;
  ImprovementPlans?: ChoiceImprovementPlan[];
  JiraConfiguration?: JiraConfiguration;
}
export const ImprovementSummary = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    Risk: S.optional(Risk),
    ImprovementPlanUrl: S.optional(S.String),
    ImprovementPlans: S.optional(ChoiceImprovementPlans),
    JiraConfiguration: S.optional(JiraConfiguration),
  }),
).annotations({
  identifier: "ImprovementSummary",
}) as any as S.Schema<ImprovementSummary>;
export type ImprovementSummaries = ImprovementSummary[];
export const ImprovementSummaries = S.Array(ImprovementSummary);
export interface NotificationSummary {
  Type?: NotificationType;
  LensUpgradeSummary?: LensUpgradeSummary;
}
export const NotificationSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(NotificationType),
    LensUpgradeSummary: S.optional(LensUpgradeSummary),
  }),
).annotations({
  identifier: "NotificationSummary",
}) as any as S.Schema<NotificationSummary>;
export type NotificationSummaries = NotificationSummary[];
export const NotificationSummaries = S.Array(NotificationSummary);
export interface QuestionDifference {
  QuestionId?: string;
  QuestionTitle?: string;
  DifferenceStatus?: DifferenceStatus;
}
export const QuestionDifference = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    DifferenceStatus: S.optional(DifferenceStatus),
  }),
).annotations({
  identifier: "QuestionDifference",
}) as any as S.Schema<QuestionDifference>;
export type QuestionDifferences = QuestionDifference[];
export const QuestionDifferences = S.Array(QuestionDifference);
export type ValidationExceptionReason =
  | "UNKNOWN_OPERATION"
  | "CANNOT_PARSE"
  | "FIELD_VALIDATION_FAILED"
  | "OTHER"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface GetLensReviewOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensReview?: LensReview;
}
export const GetLensReviewOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensReview: S.optional(LensReview),
  }),
).annotations({
  identifier: "GetLensReviewOutput",
}) as any as S.Schema<GetLensReviewOutput>;
export interface GetProfileTemplateOutput {
  ProfileTemplate?: ProfileTemplate;
}
export const GetProfileTemplateOutput = S.suspend(() =>
  S.Struct({ ProfileTemplate: S.optional(ProfileTemplate) }),
).annotations({
  identifier: "GetProfileTemplateOutput",
}) as any as S.Schema<GetProfileTemplateOutput>;
export interface GetReviewTemplateOutput {
  ReviewTemplate?: ReviewTemplate;
}
export const GetReviewTemplateOutput = S.suspend(() =>
  S.Struct({ ReviewTemplate: S.optional(ReviewTemplate) }),
).annotations({
  identifier: "GetReviewTemplateOutput",
}) as any as S.Schema<GetReviewTemplateOutput>;
export interface GetReviewTemplateLensReviewOutput {
  TemplateArn?: string;
  LensReview?: ReviewTemplateLensReview;
}
export const GetReviewTemplateLensReviewOutput = S.suspend(() =>
  S.Struct({
    TemplateArn: S.optional(S.String),
    LensReview: S.optional(ReviewTemplateLensReview),
  }),
).annotations({
  identifier: "GetReviewTemplateLensReviewOutput",
}) as any as S.Schema<GetReviewTemplateLensReviewOutput>;
export interface GetWorkloadOutput {
  Workload?: Workload;
}
export const GetWorkloadOutput = S.suspend(() =>
  S.Struct({ Workload: S.optional(Workload) }),
).annotations({
  identifier: "GetWorkloadOutput",
}) as any as S.Schema<GetWorkloadOutput>;
export interface ListAnswersOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensAlias?: string;
  LensArn?: string;
  AnswerSummaries?: AnswerSummary[];
  NextToken?: string;
}
export const ListAnswersOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    AnswerSummaries: S.optional(AnswerSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnswersOutput",
}) as any as S.Schema<ListAnswersOutput>;
export interface ListCheckSummariesOutput {
  CheckSummaries?: CheckSummary[];
  NextToken?: string;
}
export const ListCheckSummariesOutput = S.suspend(() =>
  S.Struct({
    CheckSummaries: S.optional(CheckSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCheckSummariesOutput",
}) as any as S.Schema<ListCheckSummariesOutput>;
export interface ListLensReviewImprovementsOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensAlias?: string;
  LensArn?: string;
  ImprovementSummaries?: ImprovementSummary[];
  NextToken?: string;
}
export const ListLensReviewImprovementsOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    ImprovementSummaries: S.optional(ImprovementSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLensReviewImprovementsOutput",
}) as any as S.Schema<ListLensReviewImprovementsOutput>;
export interface ListNotificationsOutput {
  NotificationSummaries?: NotificationSummary[];
  NextToken?: string;
}
export const ListNotificationsOutput = S.suspend(() =>
  S.Struct({
    NotificationSummaries: S.optional(NotificationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNotificationsOutput",
}) as any as S.Schema<ListNotificationsOutput>;
export interface Answer {
  QuestionId?: string;
  PillarId?: string;
  QuestionTitle?: string;
  QuestionDescription?: string;
  ImprovementPlanUrl?: string;
  HelpfulResourceUrl?: string;
  HelpfulResourceDisplayText?: string;
  Choices?: Choice[];
  SelectedChoices?: string[];
  ChoiceAnswers?: ChoiceAnswer[];
  IsApplicable?: boolean;
  Risk?: Risk;
  Notes?: string;
  Reason?: AnswerReason;
  JiraConfiguration?: JiraConfiguration;
}
export const Answer = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    PillarId: S.optional(S.String),
    QuestionTitle: S.optional(S.String),
    QuestionDescription: S.optional(S.String),
    ImprovementPlanUrl: S.optional(S.String),
    HelpfulResourceUrl: S.optional(S.String),
    HelpfulResourceDisplayText: S.optional(S.String),
    Choices: S.optional(Choices),
    SelectedChoices: S.optional(SelectedChoices),
    ChoiceAnswers: S.optional(ChoiceAnswers),
    IsApplicable: S.optional(S.Boolean),
    Risk: S.optional(Risk),
    Notes: S.optional(S.String),
    Reason: S.optional(AnswerReason),
    JiraConfiguration: S.optional(JiraConfiguration),
  }),
).annotations({ identifier: "Answer" }) as any as S.Schema<Answer>;
export interface UpdateAnswerOutput {
  WorkloadId?: string;
  LensAlias?: string;
  LensArn?: string;
  Answer?: Answer;
}
export const UpdateAnswerOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    Answer: S.optional(Answer),
  }),
).annotations({
  identifier: "UpdateAnswerOutput",
}) as any as S.Schema<UpdateAnswerOutput>;
export interface UpdateLensReviewOutput {
  WorkloadId?: string;
  LensReview?: LensReview;
}
export const UpdateLensReviewOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    LensReview: S.optional(LensReview),
  }),
).annotations({
  identifier: "UpdateLensReviewOutput",
}) as any as S.Schema<UpdateLensReviewOutput>;
export interface PillarDifference {
  PillarId?: string;
  PillarName?: string;
  DifferenceStatus?: DifferenceStatus;
  QuestionDifferences?: QuestionDifference[];
}
export const PillarDifference = S.suspend(() =>
  S.Struct({
    PillarId: S.optional(S.String),
    PillarName: S.optional(S.String),
    DifferenceStatus: S.optional(DifferenceStatus),
    QuestionDifferences: S.optional(QuestionDifferences),
  }),
).annotations({
  identifier: "PillarDifference",
}) as any as S.Schema<PillarDifference>;
export type PillarDifferences = PillarDifference[];
export const PillarDifferences = S.Array(PillarDifference);
export interface VersionDifferences {
  PillarDifferences?: PillarDifference[];
}
export const VersionDifferences = S.suspend(() =>
  S.Struct({ PillarDifferences: S.optional(PillarDifferences) }),
).annotations({
  identifier: "VersionDifferences",
}) as any as S.Schema<VersionDifferences>;
export interface ValidationExceptionField {
  Name?: string;
  Message?: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface GetAnswerOutput {
  WorkloadId?: string;
  MilestoneNumber?: number;
  LensAlias?: string;
  LensArn?: string;
  Answer?: Answer;
}
export const GetAnswerOutput = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    MilestoneNumber: S.optional(S.Number),
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    Answer: S.optional(Answer),
  }),
).annotations({
  identifier: "GetAnswerOutput",
}) as any as S.Schema<GetAnswerOutput>;
export interface BestPractice {
  ChoiceId?: string;
  ChoiceTitle?: string;
}
export const BestPractice = S.suspend(() =>
  S.Struct({
    ChoiceId: S.optional(S.String),
    ChoiceTitle: S.optional(S.String),
  }),
).annotations({ identifier: "BestPractice" }) as any as S.Schema<BestPractice>;
export type BestPractices = BestPractice[];
export const BestPractices = S.Array(BestPractice);
export interface GetLensVersionDifferenceOutput {
  LensAlias?: string;
  LensArn?: string;
  BaseLensVersion?: string;
  TargetLensVersion?: string;
  LatestLensVersion?: string;
  VersionDifferences?: VersionDifferences;
}
export const GetLensVersionDifferenceOutput = S.suspend(() =>
  S.Struct({
    LensAlias: S.optional(S.String),
    LensArn: S.optional(S.String),
    BaseLensVersion: S.optional(S.String),
    TargetLensVersion: S.optional(S.String),
    LatestLensVersion: S.optional(S.String),
    VersionDifferences: S.optional(VersionDifferences),
  }),
).annotations({
  identifier: "GetLensVersionDifferenceOutput",
}) as any as S.Schema<GetLensVersionDifferenceOutput>;
export interface GetProfileOutput {
  Profile?: Profile;
}
export const GetProfileOutput = S.suspend(() =>
  S.Struct({ Profile: S.optional(Profile) }),
).annotations({
  identifier: "GetProfileOutput",
}) as any as S.Schema<GetProfileOutput>;
export interface QuestionMetric {
  QuestionId?: string;
  Risk?: Risk;
  BestPractices?: BestPractice[];
}
export const QuestionMetric = S.suspend(() =>
  S.Struct({
    QuestionId: S.optional(S.String),
    Risk: S.optional(Risk),
    BestPractices: S.optional(BestPractices),
  }),
).annotations({
  identifier: "QuestionMetric",
}) as any as S.Schema<QuestionMetric>;
export type QuestionMetrics = QuestionMetric[];
export const QuestionMetrics = S.Array(QuestionMetric);
export interface PillarMetric {
  PillarId?: string;
  RiskCounts?: { [key: string]: number | undefined };
  Questions?: QuestionMetric[];
}
export const PillarMetric = S.suspend(() =>
  S.Struct({
    PillarId: S.optional(S.String),
    RiskCounts: S.optional(RiskCounts),
    Questions: S.optional(QuestionMetrics),
  }),
).annotations({ identifier: "PillarMetric" }) as any as S.Schema<PillarMetric>;
export type PillarMetrics = PillarMetric[];
export const PillarMetrics = S.Array(PillarMetric);
export interface LensMetric {
  LensArn?: string;
  Pillars?: PillarMetric[];
  RiskCounts?: { [key: string]: number | undefined };
}
export const LensMetric = S.suspend(() =>
  S.Struct({
    LensArn: S.optional(S.String),
    Pillars: S.optional(PillarMetrics),
    RiskCounts: S.optional(RiskCounts),
  }),
).annotations({ identifier: "LensMetric" }) as any as S.Schema<LensMetric>;
export type LensMetrics = LensMetric[];
export const LensMetrics = S.Array(LensMetric);
export interface ConsolidatedReportMetric {
  MetricType?: MetricType;
  RiskCounts?: { [key: string]: number | undefined };
  WorkloadId?: string;
  WorkloadName?: string;
  WorkloadArn?: string;
  UpdatedAt?: Date;
  Lenses?: LensMetric[];
  LensesAppliedCount?: number;
}
export const ConsolidatedReportMetric = S.suspend(() =>
  S.Struct({
    MetricType: S.optional(MetricType),
    RiskCounts: S.optional(RiskCounts),
    WorkloadId: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    WorkloadArn: S.optional(S.String),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Lenses: S.optional(LensMetrics),
    LensesAppliedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConsolidatedReportMetric",
}) as any as S.Schema<ConsolidatedReportMetric>;
export type ConsolidatedReportMetrics = ConsolidatedReportMetric[];
export const ConsolidatedReportMetrics = S.Array(ConsolidatedReportMetric);
export interface GetConsolidatedReportOutput {
  Metrics?: ConsolidatedReportMetric[];
  NextToken?: string;
  Base64String?: string;
}
export const GetConsolidatedReportOutput = S.suspend(() =>
  S.Struct({
    Metrics: S.optional(ConsolidatedReportMetrics),
    NextToken: S.optional(S.String),
    Base64String: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConsolidatedReportOutput",
}) as any as S.Schema<GetConsolidatedReportOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(ValidationExceptionReason),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Adds one or more tags to the specified resource.
 *
 * The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Deletes specified tags from a resource.
 *
 * The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN.
 *
 * To specify multiple tags, use separate **tagKeys** parameters, for example:
 *
 * `DELETE /tags/WorkloadArn?tagKeys=key1&tagKeys=key2`
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * List the tags for a resource.
 *
 * The WorkloadArn parameter can be a workload ARN, a custom lens ARN, a profile ARN, or review template ARN.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Global settings for all workloads.
 */
export const getGlobalSettings: (
  input: GetGlobalSettingsRequest,
) => effect.Effect<
  GetGlobalSettingsOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlobalSettingsRequest,
  output: GetGlobalSettingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Export an existing lens.
 *
 * Only the owner of a lens can export it. Lenses provided by Amazon Web Services (Amazon Web Services Official Content)
 * cannot be exported.
 *
 * Lenses are defined in JSON. For more information, see JSON format specification
 * in the *Well-Architected Tool User Guide*.
 *
 * **Disclaimer**
 *
 * Do not include or gather personal identifiable information (PII) of end users or
 * other identifiable individuals in or via your custom lenses. If your custom
 * lens or those shared with you and used in your account do include or collect
 * PII you are responsible for: ensuring that the included PII is processed in accordance
 * with applicable law, providing adequate privacy notices, and obtaining necessary
 * consents for processing such data.
 */
export const exportLens: (
  input: ExportLensInput,
) => effect.Effect<
  ExportLensOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportLensInput,
  output: ExportLensOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associate a lens to a workload.
 *
 * Up to 10 lenses can be associated with a workload in a single API operation. A
 * maximum of 20 lenses can be associated with a workload.
 *
 * **Disclaimer**
 *
 * By accessing and/or applying custom lenses created by another Amazon Web Services user or account,
 * you acknowledge that custom lenses created by other users and shared with you are
 * Third Party Content as defined in the Amazon Web Services Customer Agreement.
 */
export const associateLenses: (
  input: AssociateLensesInput,
) => effect.Effect<
  AssociateLensesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateLensesInput,
  output: AssociateLensesResponse,
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
 * Get an existing lens.
 */
export const getLens: (
  input: GetLensInput,
) => effect.Effect<
  GetLensOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLensInput,
  output: GetLensOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get lens review report.
 */
export const getLensReviewReport: (
  input: GetLensReviewReportInput,
) => effect.Effect<
  GetLensReviewReportOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLensReviewReportInput,
  output: GetLensReviewReportOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a milestone for an existing workload.
 */
export const getMilestone: (
  input: GetMilestoneInput,
) => effect.Effect<
  GetMilestoneOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMilestoneInput,
  output: GetMilestoneOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get review template answer.
 */
export const getReviewTemplateAnswer: (
  input: GetReviewTemplateAnswerInput,
) => effect.Effect<
  GetReviewTemplateAnswerOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReviewTemplateAnswerInput,
  output: GetReviewTemplateAnswerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List of Trusted Advisor check details by account related to the workload.
 */
export const listCheckDetails: {
  (
    input: ListCheckDetailsInput,
  ): effect.Effect<
    ListCheckDetailsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCheckDetailsInput,
  ) => stream.Stream<
    ListCheckDetailsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCheckDetailsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCheckDetailsInput,
  output: ListCheckDetailsOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List lens reviews for a particular workload.
 */
export const listLensReviews: {
  (
    input: ListLensReviewsInput,
  ): effect.Effect<
    ListLensReviewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLensReviewsInput,
  ) => stream.Stream<
    ListLensReviewsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLensReviewsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLensReviewsInput,
  output: ListLensReviewsOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the lens shares associated with the lens.
 */
export const listLensShares: {
  (
    input: ListLensSharesInput,
  ): effect.Effect<
    ListLensSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLensSharesInput,
  ) => stream.Stream<
    ListLensSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLensSharesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLensSharesInput,
  output: ListLensSharesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all milestones for an existing workload.
 */
export const listMilestones: {
  (
    input: ListMilestonesInput,
  ): effect.Effect<
    ListMilestonesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMilestonesInput,
  ) => stream.Stream<
    ListMilestonesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMilestonesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMilestonesInput,
  output: ListMilestonesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List profile shares.
 */
export const listProfileShares: {
  (
    input: ListProfileSharesInput,
  ): effect.Effect<
    ListProfileSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfileSharesInput,
  ) => stream.Stream<
    ListProfileSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfileSharesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfileSharesInput,
  output: ListProfileSharesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the answers of a review template.
 */
export const listReviewTemplateAnswers: {
  (
    input: ListReviewTemplateAnswersInput,
  ): effect.Effect<
    ListReviewTemplateAnswersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReviewTemplateAnswersInput,
  ) => stream.Stream<
    ListReviewTemplateAnswersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReviewTemplateAnswersInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReviewTemplateAnswersInput,
  output: ListReviewTemplateAnswersOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List review template shares.
 */
export const listTemplateShares: {
  (
    input: ListTemplateSharesInput,
  ): effect.Effect<
    ListTemplateSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTemplateSharesInput,
  ) => stream.Stream<
    ListTemplateSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTemplateSharesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTemplateSharesInput,
  output: ListTemplateSharesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the workload shares associated with the workload.
 */
export const listWorkloadShares: {
  (
    input: ListWorkloadSharesInput,
  ): effect.Effect<
    ListWorkloadSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadSharesInput,
  ) => stream.Stream<
    ListWorkloadSharesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadSharesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkloadSharesInput,
  output: ListWorkloadSharesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the available lenses.
 */
export const listLenses: {
  (
    input: ListLensesInput,
  ): effect.Effect<
    ListLensesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLensesInput,
  ) => stream.Stream<
    ListLensesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLensesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLensesInput,
  output: ListLensesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List profile notifications.
 */
export const listProfileNotifications: {
  (
    input: ListProfileNotificationsInput,
  ): effect.Effect<
    ListProfileNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfileNotificationsInput,
  ) => stream.Stream<
    ListProfileNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfileNotificationsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfileNotificationsInput,
  output: ListProfileNotificationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List profiles.
 */
export const listProfiles: {
  (
    input: ListProfilesInput,
  ): effect.Effect<
    ListProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfilesInput,
  ) => stream.Stream<
    ListProfilesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfilesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProfilesInput,
  output: ListProfilesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List review templates.
 */
export const listReviewTemplates: {
  (
    input: ListReviewTemplatesInput,
  ): effect.Effect<
    ListReviewTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReviewTemplatesInput,
  ) => stream.Stream<
    ListReviewTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReviewTemplatesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReviewTemplatesInput,
  output: ListReviewTemplatesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the share invitations.
 *
 * `WorkloadNamePrefix`, `LensNamePrefix`,
 * `ProfileNamePrefix`, and `TemplateNamePrefix` are mutually
 * exclusive. Use the parameter that matches your `ShareResourceType`.
 */
export const listShareInvitations: {
  (
    input: ListShareInvitationsInput,
  ): effect.Effect<
    ListShareInvitationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListShareInvitationsInput,
  ) => stream.Stream<
    ListShareInvitationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListShareInvitationsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListShareInvitationsInput,
  output: ListShareInvitationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Paginated list of workloads.
 */
export const listWorkloads: {
  (
    input: ListWorkloadsInput,
  ): effect.Effect<
    ListWorkloadsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadsInput,
  ) => stream.Stream<
    ListWorkloadsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkloadsInput,
  output: ListWorkloadsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update a workload or custom lens share invitation.
 *
 * This API operation can be called independently of any resource. Previous documentation implied that a workload ARN must be specified.
 */
export const updateShareInvitation: (
  input: UpdateShareInvitationInput,
) => effect.Effect<
  UpdateShareInvitationOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateShareInvitationInput,
  output: UpdateShareInvitationOutput,
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
 * Update a workload share.
 */
export const updateWorkloadShare: (
  input: UpdateWorkloadShareInput,
) => effect.Effect<
  UpdateWorkloadShareOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkloadShareInput,
  output: UpdateWorkloadShareOutput,
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
 * Update whether the Amazon Web Services account is opted into organization sharing and discovery integration features.
 */
export const updateGlobalSettings: (
  input: UpdateGlobalSettingsInput,
) => effect.Effect<
  UpdateGlobalSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalSettingsInput,
  output: UpdateGlobalSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a profile.
 */
export const updateProfile: (
  input: UpdateProfileInput,
) => effect.Effect<
  UpdateProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileInput,
  output: UpdateProfileOutput,
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
 * Update a review template.
 */
export const updateReviewTemplate: (
  input: UpdateReviewTemplateInput,
) => effect.Effect<
  UpdateReviewTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReviewTemplateInput,
  output: UpdateReviewTemplateOutput,
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
 * Update a review template answer.
 */
export const updateReviewTemplateAnswer: (
  input: UpdateReviewTemplateAnswerInput,
) => effect.Effect<
  UpdateReviewTemplateAnswerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReviewTemplateAnswerInput,
  output: UpdateReviewTemplateAnswerOutput,
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
 * Update a lens review associated with a review template.
 */
export const updateReviewTemplateLensReview: (
  input: UpdateReviewTemplateLensReviewInput,
) => effect.Effect<
  UpdateReviewTemplateLensReviewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReviewTemplateLensReviewInput,
  output: UpdateReviewTemplateLensReviewOutput,
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
 * Update an existing workload.
 */
export const updateWorkload: (
  input: UpdateWorkloadInput,
) => effect.Effect<
  UpdateWorkloadOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkloadInput,
  output: UpdateWorkloadOutput,
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
 * Associate a profile with a workload.
 */
export const associateProfiles: (
  input: AssociateProfilesInput,
) => effect.Effect<
  AssociateProfilesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateProfilesInput,
  output: AssociateProfilesResponse,
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
 * Delete an existing lens.
 *
 * Only the owner of a lens can delete it. After the lens is deleted, Amazon Web Services accounts and users
 * that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.
 *
 * **Disclaimer**
 *
 * By sharing your custom lenses with other Amazon Web Services accounts,
 * you acknowledge that Amazon Web Services will make your custom lenses available to those
 * other accounts. Those other accounts may continue to access and use your
 * shared custom lenses even if you delete the custom lenses
 * from your own Amazon Web Services account or terminate
 * your Amazon Web Services account.
 */
export const deleteLens: (
  input: DeleteLensInput,
) => effect.Effect<
  DeleteLensResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLensInput,
  output: DeleteLensResponse,
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
 * Delete a lens share.
 *
 * After the lens share is deleted, Amazon Web Services accounts, users, organizations,
 * and organizational units (OUs)
 * that you shared the lens with can continue to use it, but they will no longer be able to apply it to new workloads.
 *
 * **Disclaimer**
 *
 * By sharing your custom lenses with other Amazon Web Services accounts,
 * you acknowledge that Amazon Web Services will make your custom lenses available to those
 * other accounts. Those other accounts may continue to access and use your
 * shared custom lenses even if you delete the custom lenses
 * from your own Amazon Web Services account or terminate
 * your Amazon Web Services account.
 */
export const deleteLensShare: (
  input: DeleteLensShareInput,
) => effect.Effect<
  DeleteLensShareResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLensShareInput,
  output: DeleteLensShareResponse,
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
 * Delete a profile.
 *
 * **Disclaimer**
 *
 * By sharing your profile with other Amazon Web Services accounts,
 * you acknowledge that Amazon Web Services will make your profile available to those
 * other accounts. Those other accounts may continue to access and use your
 * shared profile even if you delete the profile
 * from your own Amazon Web Services account or terminate
 * your Amazon Web Services account.
 */
export const deleteProfile: (
  input: DeleteProfileInput,
) => effect.Effect<
  DeleteProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileInput,
  output: DeleteProfileResponse,
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
 * Delete a profile share.
 */
export const deleteProfileShare: (
  input: DeleteProfileShareInput,
) => effect.Effect<
  DeleteProfileShareResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileShareInput,
  output: DeleteProfileShareResponse,
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
 * Delete a review template.
 *
 * Only the owner of a review template can delete it.
 *
 * After the review template is deleted, Amazon Web Services accounts, users,
 * organizations, and organizational units (OUs) that you shared the review template with
 * will no longer be able to apply it to new workloads.
 */
export const deleteReviewTemplate: (
  input: DeleteReviewTemplateInput,
) => effect.Effect<
  DeleteReviewTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReviewTemplateInput,
  output: DeleteReviewTemplateResponse,
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
 * Delete a review template share.
 *
 * After the review template share is deleted, Amazon Web Services accounts, users,
 * organizations, and organizational units (OUs) that you shared the review template with
 * will no longer be able to apply it to new workloads.
 */
export const deleteTemplateShare: (
  input: DeleteTemplateShareInput,
) => effect.Effect<
  DeleteTemplateShareResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateShareInput,
  output: DeleteTemplateShareResponse,
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
 * Delete an existing workload.
 */
export const deleteWorkload: (
  input: DeleteWorkloadInput,
) => effect.Effect<
  DeleteWorkloadResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkloadInput,
  output: DeleteWorkloadResponse,
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
 * Delete a workload share.
 */
export const deleteWorkloadShare: (
  input: DeleteWorkloadShareInput,
) => effect.Effect<
  DeleteWorkloadShareResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkloadShareInput,
  output: DeleteWorkloadShareResponse,
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
 * Disassociate a lens from a workload.
 *
 * Up to 10 lenses can be disassociated from a workload in a single API operation.
 *
 * The Amazon Web Services Well-Architected Framework lens (`wellarchitected`) cannot be
 * removed from a workload.
 */
export const disassociateLenses: (
  input: DisassociateLensesInput,
) => effect.Effect<
  DisassociateLensesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateLensesInput,
  output: DisassociateLensesResponse,
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
 * Disassociate a profile from a workload.
 */
export const disassociateProfiles: (
  input: DisassociateProfilesInput,
) => effect.Effect<
  DisassociateProfilesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateProfilesInput,
  output: DisassociateProfilesResponse,
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
 * Update integration features.
 */
export const updateIntegration: (
  input: UpdateIntegrationInput,
) => effect.Effect<
  UpdateIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIntegrationInput,
  output: UpdateIntegrationResponse,
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
 * Upgrade the lens review of a review template.
 */
export const upgradeReviewTemplateLensReview: (
  input: UpgradeReviewTemplateLensReviewInput,
) => effect.Effect<
  UpgradeReviewTemplateLensReviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpgradeReviewTemplateLensReviewInput,
  output: UpgradeReviewTemplateLensReviewResponse,
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
 * Create a profile.
 */
export const createProfile: (
  input: CreateProfileInput,
) => effect.Effect<
  CreateProfileOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileInput,
  output: CreateProfileOutput,
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
 * Get lens review.
 */
export const getLensReview: (
  input: GetLensReviewInput,
) => effect.Effect<
  GetLensReviewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLensReviewInput,
  output: GetLensReviewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get profile template.
 */
export const getProfileTemplate: (
  input: GetProfileTemplateInput,
) => effect.Effect<
  GetProfileTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileTemplateInput,
  output: GetProfileTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get review template.
 */
export const getReviewTemplate: (
  input: GetReviewTemplateInput,
) => effect.Effect<
  GetReviewTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReviewTemplateInput,
  output: GetReviewTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a lens review associated with a review template.
 */
export const getReviewTemplateLensReview: (
  input: GetReviewTemplateLensReviewInput,
) => effect.Effect<
  GetReviewTemplateLensReviewOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReviewTemplateLensReviewInput,
  output: GetReviewTemplateLensReviewOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get an existing workload.
 */
export const getWorkload: (
  input: GetWorkloadInput,
) => effect.Effect<
  GetWorkloadOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkloadInput,
  output: GetWorkloadOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List of answers for a particular workload and lens.
 */
export const listAnswers: {
  (
    input: ListAnswersInput,
  ): effect.Effect<
    ListAnswersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnswersInput,
  ) => stream.Stream<
    ListAnswersOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnswersInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnswersInput,
  output: ListAnswersOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List of Trusted Advisor checks summarized for all accounts related to the workload.
 */
export const listCheckSummaries: {
  (
    input: ListCheckSummariesInput,
  ): effect.Effect<
    ListCheckSummariesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCheckSummariesInput,
  ) => stream.Stream<
    ListCheckSummariesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCheckSummariesInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCheckSummariesInput,
  output: ListCheckSummariesOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the improvements of a particular lens review.
 */
export const listLensReviewImprovements: {
  (
    input: ListLensReviewImprovementsInput,
  ): effect.Effect<
    ListLensReviewImprovementsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLensReviewImprovementsInput,
  ) => stream.Stream<
    ListLensReviewImprovementsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLensReviewImprovementsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLensReviewImprovementsInput,
  output: ListLensReviewImprovementsOutput,
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
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List lens notifications.
 */
export const listNotifications: {
  (
    input: ListNotificationsInput,
  ): effect.Effect<
    ListNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationsInput,
  ) => stream.Stream<
    ListNotificationsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNotificationsInput,
  output: ListNotificationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update the answer to a specific question in a workload review.
 */
export const updateAnswer: (
  input: UpdateAnswerInput,
) => effect.Effect<
  UpdateAnswerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnswerInput,
  output: UpdateAnswerOutput,
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
 * Update lens review for a particular workload.
 */
export const updateLensReview: (
  input: UpdateLensReviewInput,
) => effect.Effect<
  UpdateLensReviewOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLensReviewInput,
  output: UpdateLensReviewOutput,
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
 * Create a lens share.
 *
 * The owner of a lens can share it with other Amazon Web Services accounts, users, an organization,
 * and organizational units (OUs) in the same Amazon Web Services Region.
 * Lenses provided by Amazon Web Services (Amazon Web Services Official Content) cannot be shared.
 *
 * Shared access to a lens is not removed until the lens invitation is deleted.
 *
 * If you share a lens with an organization or OU, all accounts in the organization or OU
 * are granted access to the lens.
 *
 * For more information, see Sharing a custom lens in the
 * *Well-Architected Tool User Guide*.
 *
 * **Disclaimer**
 *
 * By sharing your custom lenses with other Amazon Web Services accounts,
 * you acknowledge that Amazon Web Services will make your custom lenses available to those
 * other accounts. Those other accounts may continue to access and use your
 * shared custom lenses even if you delete the custom lenses
 * from your own Amazon Web Services account or terminate
 * your Amazon Web Services account.
 */
export const createLensShare: (
  input: CreateLensShareInput,
) => effect.Effect<
  CreateLensShareOutput,
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
  input: CreateLensShareInput,
  output: CreateLensShareOutput,
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
 * Create a new lens version.
 *
 * A lens can have up to 100 versions.
 *
 * Use this operation to publish a new lens version after you have imported a lens. The `LensAlias`
 * is used to identify the lens to be published.
 * The owner of a lens can share the lens with other
 * Amazon Web Services accounts and users in the same Amazon Web Services Region. Only the owner of a lens can delete it.
 */
export const createLensVersion: (
  input: CreateLensVersionInput,
) => effect.Effect<
  CreateLensVersionOutput,
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
  input: CreateLensVersionInput,
  output: CreateLensVersionOutput,
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
 * Create a milestone for an existing workload.
 */
export const createMilestone: (
  input: CreateMilestoneInput,
) => effect.Effect<
  CreateMilestoneOutput,
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
  input: CreateMilestoneInput,
  output: CreateMilestoneOutput,
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
 * Create a profile share.
 */
export const createProfileShare: (
  input: CreateProfileShareInput,
) => effect.Effect<
  CreateProfileShareOutput,
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
  input: CreateProfileShareInput,
  output: CreateProfileShareOutput,
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
 * Create a review template.
 *
 * **Disclaimer**
 *
 * Do not include or gather personal identifiable information (PII) of end users or
 * other identifiable individuals in or via your review templates. If your review
 * template or those shared with you and used in your account do include or collect PII
 * you are responsible for: ensuring that the included PII is processed in accordance
 * with applicable law, providing adequate privacy notices, and obtaining necessary
 * consents for processing such data.
 */
export const createReviewTemplate: (
  input: CreateReviewTemplateInput,
) => effect.Effect<
  CreateReviewTemplateOutput,
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
  input: CreateReviewTemplateInput,
  output: CreateReviewTemplateOutput,
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
 * Create a review template share.
 *
 * The owner of a review template can share it with other Amazon Web Services accounts,
 * users, an organization, and organizational units (OUs) in the same Amazon Web Services Region.
 *
 * Shared access to a review template is not removed until the review template share
 * invitation is deleted.
 *
 * If you share a review template with an organization or OU, all accounts in the
 * organization or OU are granted access to the review template.
 *
 * **Disclaimer**
 *
 * By sharing your review template with other Amazon Web Services accounts, you
 * acknowledge that Amazon Web Services will make your review template available to
 * those other accounts.
 */
export const createTemplateShare: (
  input: CreateTemplateShareInput,
) => effect.Effect<
  CreateTemplateShareOutput,
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
  input: CreateTemplateShareInput,
  output: CreateTemplateShareOutput,
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
 * Create a workload share.
 *
 * The owner of a workload can share it with other Amazon Web Services accounts and users in the same
 * Amazon Web Services Region. Shared access to a workload is not removed until the workload invitation is
 * deleted.
 *
 * If you share a workload with an organization or OU, all accounts in the organization or OU
 * are granted access to the workload.
 *
 * For more information, see Sharing a workload in the
 * *Well-Architected Tool User Guide*.
 */
export const createWorkloadShare: (
  input: CreateWorkloadShareInput,
) => effect.Effect<
  CreateWorkloadShareOutput,
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
  input: CreateWorkloadShareInput,
  output: CreateWorkloadShareOutput,
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
 * Import a new custom lens or update an existing custom lens.
 *
 * To update an existing custom lens, specify its ARN as the `LensAlias`. If
 * no ARN is specified, a new custom lens is created.
 *
 * The new or updated lens will have a status of `DRAFT`. The lens cannot be
 * applied to workloads or shared with other Amazon Web Services accounts until it's
 * published with CreateLensVersion.
 *
 * Lenses are defined in JSON. For more information, see JSON format specification
 * in the *Well-Architected Tool User Guide*.
 *
 * A custom lens cannot exceed 500 KB in size.
 *
 * **Disclaimer**
 *
 * Do not include or gather personal identifiable information (PII) of end users or
 * other identifiable individuals in or via your custom lenses. If your custom
 * lens or those shared with you and used in your account do include or collect
 * PII you are responsible for: ensuring that the included PII is processed in accordance
 * with applicable law, providing adequate privacy notices, and obtaining necessary
 * consents for processing such data.
 */
export const importLens: (
  input: ImportLensInput,
) => effect.Effect<
  ImportLensOutput,
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
  input: ImportLensInput,
  output: ImportLensOutput,
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
 * Upgrade lens review for a particular workload.
 */
export const upgradeLensReview: (
  input: UpgradeLensReviewInput,
) => effect.Effect<
  UpgradeLensReviewResponse,
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
  input: UpgradeLensReviewInput,
  output: UpgradeLensReviewResponse,
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
 * Upgrade a profile.
 */
export const upgradeProfileVersion: (
  input: UpgradeProfileVersionInput,
) => effect.Effect<
  UpgradeProfileVersionResponse,
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
  input: UpgradeProfileVersionInput,
  output: UpgradeProfileVersionResponse,
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
 * Create a new workload.
 *
 * The owner of a workload can share the workload with other Amazon Web Services accounts, users,
 * an organization, and organizational units (OUs)
 * in the same Amazon Web Services Region. Only the owner of a workload can delete it.
 *
 * For more information, see Defining a Workload in the
 * *Well-Architected Tool User Guide*.
 *
 * Either `AwsRegions`, `NonAwsRegions`, or both must be specified when
 * creating a workload.
 *
 * You also must specify `ReviewOwner`, even though the
 * parameter is listed as not being required in the following section.
 *
 * When creating a workload using a review template, you must have the following IAM permissions:
 *
 * - `wellarchitected:GetReviewTemplate`
 *
 * - `wellarchitected:GetReviewTemplateAnswer`
 *
 * - `wellarchitected:ListReviewTemplateAnswers`
 *
 * - `wellarchitected:GetReviewTemplateLensReview`
 */
export const createWorkload: (
  input: CreateWorkloadInput,
) => effect.Effect<
  CreateWorkloadOutput,
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
  input: CreateWorkloadInput,
  output: CreateWorkloadOutput,
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
 * Get the answer to a specific question in a workload review.
 */
export const getAnswer: (
  input: GetAnswerInput,
) => effect.Effect<
  GetAnswerOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnswerInput,
  output: GetAnswerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get lens version differences.
 */
export const getLensVersionDifference: (
  input: GetLensVersionDifferenceInput,
) => effect.Effect<
  GetLensVersionDifferenceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLensVersionDifferenceInput,
  output: GetLensVersionDifferenceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get profile information.
 */
export const getProfile: (
  input: GetProfileInput,
) => effect.Effect<
  GetProfileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProfileInput,
  output: GetProfileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a consolidated report of your workloads.
 *
 * You can optionally choose to include workloads that have been shared with you.
 */
export const getConsolidatedReport: {
  (
    input: GetConsolidatedReportInput,
  ): effect.Effect<
    GetConsolidatedReportOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConsolidatedReportInput,
  ) => stream.Stream<
    GetConsolidatedReportOutput,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConsolidatedReportInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetConsolidatedReportInput,
  output: GetConsolidatedReportOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
