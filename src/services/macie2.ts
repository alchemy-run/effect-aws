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
const svc = T.AwsApiService({ sdkId: "Macie2", serviceShapeName: "Macie2" });
const auth = T.AwsAuthSigv4({ name: "macie2" });
const ver = T.ServiceVersion("2020-01-01");
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
              `https://macie2-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://macie2-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://macie2.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://macie2.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __stringMin1Max512PatternSS = string;
export type __stringMin1Max128Pattern = string;
export type ClassificationScopeId = string;
export type SensitivityInspectionTemplateId = string;
export type __timestampIso8601 = Date;
export type MaxResults = number;
export type __stringMin1Max2048 = string;
export type __stringMin1Max64PatternW = string;
export type __stringMin71Max89PatternArnAwsAwsCnAwsUsGovMacie2AZ19920D12AllowListAZ0922 =
  string;
export type __stringMin22Max22PatternAZ0922 = string;
export type ClassificationScopeName = string;
export type NextToken = string;
export type __stringMin3Max255PatternAZaZ093255 = string;
export type __stringMin1Max1024PatternSS = string;
export type S3BucketName = string;
export type __stringMin1Max128 = string;

//# Schemas
export interface DescribeOrganizationConfigurationRequest {}
export const DescribeOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/admin/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationConfigurationRequest",
}) as any as S.Schema<DescribeOrganizationConfigurationRequest>;
export interface DisableMacieRequest {}
export const DisableMacieRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/macie" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableMacieRequest",
}) as any as S.Schema<DisableMacieRequest>;
export interface DisableMacieResponse {}
export const DisableMacieResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DisableMacieResponse",
}) as any as S.Schema<DisableMacieResponse>;
export interface DisassociateFromAdministratorAccountRequest {}
export const DisassociateFromAdministratorAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/administrator/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateFromAdministratorAccountRequest",
}) as any as S.Schema<DisassociateFromAdministratorAccountRequest>;
export interface DisassociateFromAdministratorAccountResponse {}
export const DisassociateFromAdministratorAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateFromAdministratorAccountResponse",
}) as any as S.Schema<DisassociateFromAdministratorAccountResponse>;
export interface DisassociateFromMasterAccountRequest {}
export const DisassociateFromMasterAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/master/disassociate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateFromMasterAccountRequest",
}) as any as S.Schema<DisassociateFromMasterAccountRequest>;
export interface DisassociateFromMasterAccountResponse {}
export const DisassociateFromMasterAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateFromMasterAccountResponse",
}) as any as S.Schema<DisassociateFromMasterAccountResponse>;
export interface GetAdministratorAccountRequest {}
export const GetAdministratorAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/administrator" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAdministratorAccountRequest",
}) as any as S.Schema<GetAdministratorAccountRequest>;
export interface GetAutomatedDiscoveryConfigurationRequest {}
export const GetAutomatedDiscoveryConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automated-discovery/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedDiscoveryConfigurationRequest",
}) as any as S.Schema<GetAutomatedDiscoveryConfigurationRequest>;
export interface GetClassificationExportConfigurationRequest {}
export const GetClassificationExportConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/classification-export-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClassificationExportConfigurationRequest",
}) as any as S.Schema<GetClassificationExportConfigurationRequest>;
export interface GetFindingsPublicationConfigurationRequest {}
export const GetFindingsPublicationConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findings-publication-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsPublicationConfigurationRequest",
}) as any as S.Schema<GetFindingsPublicationConfigurationRequest>;
export interface GetInvitationsCountRequest {}
export const GetInvitationsCountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitations/count" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInvitationsCountRequest",
}) as any as S.Schema<GetInvitationsCountRequest>;
export interface GetMacieSessionRequest {}
export const GetMacieSessionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/macie" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMacieSessionRequest",
}) as any as S.Schema<GetMacieSessionRequest>;
export interface GetMasterAccountRequest {}
export const GetMasterAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/master" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMasterAccountRequest",
}) as any as S.Schema<GetMasterAccountRequest>;
export interface GetRevealConfigurationRequest {}
export const GetRevealConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/reveal-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRevealConfigurationRequest",
}) as any as S.Schema<GetRevealConfigurationRequest>;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type JobType = "ONE_TIME" | "SCHEDULED" | (string & {});
export const JobType = S.String;
export type ManagedDataIdentifierSelector =
  | "ALL"
  | "EXCLUDE"
  | "INCLUDE"
  | "NONE"
  | "RECOMMENDED"
  | (string & {});
export const ManagedDataIdentifierSelector = S.String;
export type FindingsFilterAction = "ARCHIVE" | "NOOP" | (string & {});
export const FindingsFilterAction = S.String;
export type FindingType =
  | "SensitiveData:S3Object/Multiple"
  | "SensitiveData:S3Object/Financial"
  | "SensitiveData:S3Object/Personal"
  | "SensitiveData:S3Object/Credentials"
  | "SensitiveData:S3Object/CustomIdentifier"
  | "Policy:IAMUser/S3BucketPublic"
  | "Policy:IAMUser/S3BucketSharedExternally"
  | "Policy:IAMUser/S3BucketReplicatedExternally"
  | "Policy:IAMUser/S3BucketEncryptionDisabled"
  | "Policy:IAMUser/S3BlockPublicAccessDisabled"
  | "Policy:IAMUser/S3BucketSharedWithCloudFront"
  | (string & {});
export const FindingType = S.String;
export type __listOfFindingType = FindingType[];
export const __listOfFindingType = S.Array(FindingType);
export type FindingPublishingFrequency =
  | "FIFTEEN_MINUTES"
  | "ONE_HOUR"
  | "SIX_HOURS"
  | (string & {});
export const FindingPublishingFrequency = S.String;
export type MacieStatus = "PAUSED" | "ENABLED" | (string & {});
export const MacieStatus = S.String;
export type AutoEnableMode = "ALL" | "NEW" | "NONE" | (string & {});
export const AutoEnableMode = S.String;
export type AutomatedDiscoveryStatus = "ENABLED" | "DISABLED" | (string & {});
export const AutomatedDiscoveryStatus = S.String;
export type GroupBy =
  | "resourcesAffected.s3Bucket.name"
  | "type"
  | "classificationDetails.jobId"
  | "severity.description"
  | (string & {});
export const GroupBy = S.String;
export type TimeRange = "MONTH_TO_DATE" | "PAST_30_DAYS" | (string & {});
export const TimeRange = S.String;
export type JobStatus =
  | "RUNNING"
  | "PAUSED"
  | "CANCELLED"
  | "COMPLETE"
  | "IDLE"
  | "USER_PAUSED"
  | (string & {});
export const JobStatus = S.String;
export interface AcceptInvitationRequest {
  administratorAccountId?: string;
  invitationId?: string;
  masterAccount?: string;
}
export const AcceptInvitationRequest = S.suspend(() =>
  S.Struct({
    administratorAccountId: S.optional(S.String).pipe(
      T.JsonName("administratorAccountId"),
    ),
    invitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
    masterAccount: S.optional(S.String).pipe(T.JsonName("masterAccount")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations/accept" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptInvitationRequest",
}) as any as S.Schema<AcceptInvitationRequest>;
export interface AcceptInvitationResponse {}
export const AcceptInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptInvitationResponse",
}) as any as S.Schema<AcceptInvitationResponse>;
export interface BatchGetCustomDataIdentifiersRequest {
  ids?: string[];
}
export const BatchGetCustomDataIdentifiersRequest = S.suspend(() =>
  S.Struct({ ids: S.optional(__listOf__string).pipe(T.JsonName("ids")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-data-identifiers/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetCustomDataIdentifiersRequest",
}) as any as S.Schema<BatchGetCustomDataIdentifiersRequest>;
export interface CreateInvitationsRequest {
  accountIds?: string[];
  disableEmailNotification?: boolean;
  message?: string;
}
export const CreateInvitationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(__listOf__string).pipe(T.JsonName("accountIds")),
    disableEmailNotification: S.optional(S.Boolean).pipe(
      T.JsonName("disableEmailNotification"),
    ),
    message: S.optional(S.String).pipe(T.JsonName("message")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInvitationsRequest",
}) as any as S.Schema<CreateInvitationsRequest>;
export interface CreateSampleFindingsRequest {
  findingTypes?: FindingType[];
}
export const CreateSampleFindingsRequest = S.suspend(() =>
  S.Struct({
    findingTypes: S.optional(__listOfFindingType).pipe(
      T.JsonName("findingTypes"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings/sample" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSampleFindingsRequest",
}) as any as S.Schema<CreateSampleFindingsRequest>;
export interface CreateSampleFindingsResponse {}
export const CreateSampleFindingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateSampleFindingsResponse",
}) as any as S.Schema<CreateSampleFindingsResponse>;
export interface DeclineInvitationsRequest {
  accountIds?: string[];
}
export const DeclineInvitationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(__listOf__string).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations/decline" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeclineInvitationsRequest",
}) as any as S.Schema<DeclineInvitationsRequest>;
export interface DeleteAllowListRequest {
  id: string;
  ignoreJobChecks?: string;
}
export const DeleteAllowListRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    ignoreJobChecks: S.optional(S.String).pipe(T.HttpQuery("ignoreJobChecks")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/allow-lists/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAllowListRequest",
}) as any as S.Schema<DeleteAllowListRequest>;
export interface DeleteAllowListResponse {}
export const DeleteAllowListResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAllowListResponse",
}) as any as S.Schema<DeleteAllowListResponse>;
export interface DeleteCustomDataIdentifierRequest {
  id: string;
}
export const DeleteCustomDataIdentifierRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/custom-data-identifiers/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomDataIdentifierRequest",
}) as any as S.Schema<DeleteCustomDataIdentifierRequest>;
export interface DeleteCustomDataIdentifierResponse {}
export const DeleteCustomDataIdentifierResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomDataIdentifierResponse",
}) as any as S.Schema<DeleteCustomDataIdentifierResponse>;
export interface DeleteFindingsFilterRequest {
  id: string;
}
export const DeleteFindingsFilterRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/findingsfilters/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFindingsFilterRequest",
}) as any as S.Schema<DeleteFindingsFilterRequest>;
export interface DeleteFindingsFilterResponse {}
export const DeleteFindingsFilterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFindingsFilterResponse",
}) as any as S.Schema<DeleteFindingsFilterResponse>;
export interface DeleteInvitationsRequest {
  accountIds?: string[];
}
export const DeleteInvitationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(__listOf__string).pipe(T.JsonName("accountIds")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/invitations/delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInvitationsRequest",
}) as any as S.Schema<DeleteInvitationsRequest>;
export interface DeleteMemberRequest {
  id: string;
}
export const DeleteMemberRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/members/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMemberRequest",
}) as any as S.Schema<DeleteMemberRequest>;
export interface DeleteMemberResponse {}
export const DeleteMemberResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMemberResponse",
}) as any as S.Schema<DeleteMemberResponse>;
export interface DescribeClassificationJobRequest {
  jobId: string;
}
export const DescribeClassificationJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String.pipe(T.HttpLabel("jobId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClassificationJobRequest",
}) as any as S.Schema<DescribeClassificationJobRequest>;
export interface DescribeOrganizationConfigurationResponse {
  autoEnable?: boolean;
  maxAccountLimitReached?: boolean;
}
export const DescribeOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({
    autoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
    maxAccountLimitReached: S.optional(S.Boolean).pipe(
      T.JsonName("maxAccountLimitReached"),
    ),
  }),
).annotations({
  identifier: "DescribeOrganizationConfigurationResponse",
}) as any as S.Schema<DescribeOrganizationConfigurationResponse>;
export interface DisableOrganizationAdminAccountRequest {
  adminAccountId?: string;
}
export const DisableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    adminAccountId: S.optional(S.String).pipe(T.HttpQuery("adminAccountId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableOrganizationAdminAccountRequest",
}) as any as S.Schema<DisableOrganizationAdminAccountRequest>;
export interface DisableOrganizationAdminAccountResponse {}
export const DisableOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisableOrganizationAdminAccountResponse",
}) as any as S.Schema<DisableOrganizationAdminAccountResponse>;
export interface DisassociateMemberRequest {
  id: string;
}
export const DisassociateMemberRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members/disassociate/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateMemberRequest",
}) as any as S.Schema<DisassociateMemberRequest>;
export interface DisassociateMemberResponse {}
export const DisassociateMemberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberResponse",
}) as any as S.Schema<DisassociateMemberResponse>;
export interface EnableMacieRequest {
  clientToken?: string;
  findingPublishingFrequency?: FindingPublishingFrequency;
  status?: MacieStatus;
}
export const EnableMacieRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    findingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    status: S.optional(MacieStatus).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/macie" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableMacieRequest",
}) as any as S.Schema<EnableMacieRequest>;
export interface EnableMacieResponse {}
export const EnableMacieResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "EnableMacieResponse",
}) as any as S.Schema<EnableMacieResponse>;
export interface EnableOrganizationAdminAccountRequest {
  adminAccountId?: string;
  clientToken?: string;
}
export const EnableOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({
    adminAccountId: S.optional(S.String).pipe(T.JsonName("adminAccountId")),
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableOrganizationAdminAccountRequest",
}) as any as S.Schema<EnableOrganizationAdminAccountRequest>;
export interface EnableOrganizationAdminAccountResponse {}
export const EnableOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "EnableOrganizationAdminAccountResponse",
}) as any as S.Schema<EnableOrganizationAdminAccountResponse>;
export interface GetAllowListRequest {
  id: string;
}
export const GetAllowListRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/allow-lists/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAllowListRequest",
}) as any as S.Schema<GetAllowListRequest>;
export interface GetAutomatedDiscoveryConfigurationResponse {
  autoEnableOrganizationMembers?: AutoEnableMode;
  classificationScopeId?: string;
  disabledAt?: Date;
  firstEnabledAt?: Date;
  lastUpdatedAt?: Date;
  sensitivityInspectionTemplateId?: string;
  status?: AutomatedDiscoveryStatus;
}
export const GetAutomatedDiscoveryConfigurationResponse = S.suspend(() =>
  S.Struct({
    autoEnableOrganizationMembers: S.optional(AutoEnableMode).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
    classificationScopeId: S.optional(S.String).pipe(
      T.JsonName("classificationScopeId"),
    ),
    disabledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("disabledAt"),
    ),
    firstEnabledAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("firstEnabledAt")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastUpdatedAt"),
    ),
    sensitivityInspectionTemplateId: S.optional(S.String).pipe(
      T.JsonName("sensitivityInspectionTemplateId"),
    ),
    status: S.optional(AutomatedDiscoveryStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "GetAutomatedDiscoveryConfigurationResponse",
}) as any as S.Schema<GetAutomatedDiscoveryConfigurationResponse>;
export interface GetBucketStatisticsRequest {
  accountId?: string;
}
export const GetBucketStatisticsRequest = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasources/s3/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBucketStatisticsRequest",
}) as any as S.Schema<GetBucketStatisticsRequest>;
export interface GetClassificationScopeRequest {
  id: string;
}
export const GetClassificationScopeRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/classification-scopes/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClassificationScopeRequest",
}) as any as S.Schema<GetClassificationScopeRequest>;
export interface GetCustomDataIdentifierRequest {
  id: string;
}
export const GetCustomDataIdentifierRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-data-identifiers/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomDataIdentifierRequest",
}) as any as S.Schema<GetCustomDataIdentifierRequest>;
export interface GetFindingsFilterRequest {
  id: string;
}
export const GetFindingsFilterRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findingsfilters/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsFilterRequest",
}) as any as S.Schema<GetFindingsFilterRequest>;
export interface GetInvitationsCountResponse {
  invitationsCount?: number;
}
export const GetInvitationsCountResponse = S.suspend(() =>
  S.Struct({
    invitationsCount: S.optional(S.Number).pipe(T.JsonName("invitationsCount")),
  }),
).annotations({
  identifier: "GetInvitationsCountResponse",
}) as any as S.Schema<GetInvitationsCountResponse>;
export interface GetMacieSessionResponse {
  createdAt?: Date;
  findingPublishingFrequency?: FindingPublishingFrequency;
  serviceRole?: string;
  status?: MacieStatus;
  updatedAt?: Date;
}
export const GetMacieSessionResponse = S.suspend(() =>
  S.Struct({
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    findingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    serviceRole: S.optional(S.String).pipe(T.JsonName("serviceRole")),
    status: S.optional(MacieStatus).pipe(T.JsonName("status")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "GetMacieSessionResponse",
}) as any as S.Schema<GetMacieSessionResponse>;
export type RelationshipStatus =
  | "Enabled"
  | "Paused"
  | "Invited"
  | "Created"
  | "Removed"
  | "Resigned"
  | "EmailVerificationInProgress"
  | "EmailVerificationFailed"
  | "RegionDisabled"
  | "AccountSuspended"
  | (string & {});
export const RelationshipStatus = S.String;
export interface Invitation {
  accountId?: string;
  invitationId?: string;
  invitedAt?: Date;
  relationshipStatus?: RelationshipStatus;
}
export const Invitation = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    invitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
    invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("invitedAt"),
    ),
    relationshipStatus: S.optional(RelationshipStatus).pipe(
      T.JsonName("relationshipStatus"),
    ),
  }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export interface GetMasterAccountResponse {
  master?: Invitation;
}
export const GetMasterAccountResponse = S.suspend(() =>
  S.Struct({
    master: S.optional(Invitation)
      .pipe(T.JsonName("master"))
      .annotations({ identifier: "Invitation" }),
  }),
).annotations({
  identifier: "GetMasterAccountResponse",
}) as any as S.Schema<GetMasterAccountResponse>;
export interface GetMemberRequest {
  id: string;
}
export const GetMemberRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/members/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMemberRequest",
}) as any as S.Schema<GetMemberRequest>;
export interface GetResourceProfileRequest {
  resourceArn?: string;
}
export const GetResourceProfileRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resource-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceProfileRequest",
}) as any as S.Schema<GetResourceProfileRequest>;
export interface GetSensitiveDataOccurrencesRequest {
  findingId: string;
}
export const GetSensitiveDataOccurrencesRequest = S.suspend(() =>
  S.Struct({ findingId: S.String.pipe(T.HttpLabel("findingId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findings/{findingId}/reveal" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSensitiveDataOccurrencesRequest",
}) as any as S.Schema<GetSensitiveDataOccurrencesRequest>;
export interface GetSensitiveDataOccurrencesAvailabilityRequest {
  findingId: string;
}
export const GetSensitiveDataOccurrencesAvailabilityRequest = S.suspend(() =>
  S.Struct({ findingId: S.String.pipe(T.HttpLabel("findingId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/findings/{findingId}/reveal/availability",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSensitiveDataOccurrencesAvailabilityRequest",
}) as any as S.Schema<GetSensitiveDataOccurrencesAvailabilityRequest>;
export interface GetSensitivityInspectionTemplateRequest {
  id: string;
}
export const GetSensitivityInspectionTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/sensitivity-inspections/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSensitivityInspectionTemplateRequest",
}) as any as S.Schema<GetSensitivityInspectionTemplateRequest>;
export interface GetUsageTotalsRequest {
  timeRange?: string;
}
export const GetUsageTotalsRequest = S.suspend(() =>
  S.Struct({
    timeRange: S.optional(S.String).pipe(T.HttpQuery("timeRange")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/usage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsageTotalsRequest",
}) as any as S.Schema<GetUsageTotalsRequest>;
export interface ListAllowListsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListAllowListsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/allow-lists" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAllowListsRequest",
}) as any as S.Schema<ListAllowListsRequest>;
export interface ListAutomatedDiscoveryAccountsRequest {
  accountIds?: string[];
  maxResults?: number;
  nextToken?: string;
}
export const ListAutomatedDiscoveryAccountsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(__listOf__string).pipe(T.HttpQuery("accountIds")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automated-discovery/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomatedDiscoveryAccountsRequest",
}) as any as S.Schema<ListAutomatedDiscoveryAccountsRequest>;
export interface ListClassificationScopesRequest {
  name?: string;
  nextToken?: string;
}
export const ListClassificationScopesRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/classification-scopes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClassificationScopesRequest",
}) as any as S.Schema<ListClassificationScopesRequest>;
export interface ListCustomDataIdentifiersRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListCustomDataIdentifiersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-data-identifiers/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomDataIdentifiersRequest",
}) as any as S.Schema<ListCustomDataIdentifiersRequest>;
export interface CriterionAdditionalProperties {
  eq?: string[];
  eqExactMatch?: string[];
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  neq?: string[];
}
export const CriterionAdditionalProperties = S.suspend(() =>
  S.Struct({
    eq: S.optional(__listOf__string).pipe(T.JsonName("eq")),
    eqExactMatch: S.optional(__listOf__string).pipe(T.JsonName("eqExactMatch")),
    gt: S.optional(S.Number).pipe(T.JsonName("gt")),
    gte: S.optional(S.Number).pipe(T.JsonName("gte")),
    lt: S.optional(S.Number).pipe(T.JsonName("lt")),
    lte: S.optional(S.Number).pipe(T.JsonName("lte")),
    neq: S.optional(__listOf__string).pipe(T.JsonName("neq")),
  }),
).annotations({
  identifier: "CriterionAdditionalProperties",
}) as any as S.Schema<CriterionAdditionalProperties>;
export type Criterion = {
  [key: string]: CriterionAdditionalProperties | undefined;
};
export const Criterion = S.Record({
  key: S.String,
  value: S.UndefinedOr(CriterionAdditionalProperties),
});
export interface FindingCriteria {
  criterion?: { [key: string]: CriterionAdditionalProperties | undefined };
}
export const FindingCriteria = S.suspend(() =>
  S.Struct({ criterion: S.optional(Criterion).pipe(T.JsonName("criterion")) }),
).annotations({
  identifier: "FindingCriteria",
}) as any as S.Schema<FindingCriteria>;
export type OrderBy = "ASC" | "DESC" | (string & {});
export const OrderBy = S.String;
export interface SortCriteria {
  attributeName?: string;
  orderBy?: OrderBy;
}
export const SortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({ identifier: "SortCriteria" }) as any as S.Schema<SortCriteria>;
export interface ListFindingsRequest {
  findingCriteria?: FindingCriteria;
  maxResults?: number;
  nextToken?: string;
  sortCriteria?: SortCriteria;
}
export const ListFindingsRequest = S.suspend(() =>
  S.Struct({
    findingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsRequest",
}) as any as S.Schema<ListFindingsRequest>;
export interface ListFindingsFiltersRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListFindingsFiltersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/findingsfilters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFindingsFiltersRequest",
}) as any as S.Schema<ListFindingsFiltersRequest>;
export interface ListInvitationsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListInvitationsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInvitationsRequest",
}) as any as S.Schema<ListInvitationsRequest>;
export interface ListManagedDataIdentifiersRequest {
  nextToken?: string;
}
export const ListManagedDataIdentifiersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/managed-data-identifiers/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListManagedDataIdentifiersRequest",
}) as any as S.Schema<ListManagedDataIdentifiersRequest>;
export interface ListMembersRequest {
  maxResults?: number;
  nextToken?: string;
  onlyAssociated?: string;
}
export const ListMembersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    onlyAssociated: S.optional(S.String).pipe(T.HttpQuery("onlyAssociated")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/members" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembersRequest",
}) as any as S.Schema<ListMembersRequest>;
export interface ListOrganizationAdminAccountsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListOrganizationAdminAccountsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/admin" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOrganizationAdminAccountsRequest",
}) as any as S.Schema<ListOrganizationAdminAccountsRequest>;
export interface ListResourceProfileArtifactsRequest {
  nextToken?: string;
  resourceArn?: string;
}
export const ListResourceProfileArtifactsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resource-profiles/artifacts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceProfileArtifactsRequest",
}) as any as S.Schema<ListResourceProfileArtifactsRequest>;
export interface ListResourceProfileDetectionsRequest {
  maxResults?: number;
  nextToken?: string;
  resourceArn?: string;
}
export const ListResourceProfileDetectionsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resource-profiles/detections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceProfileDetectionsRequest",
}) as any as S.Schema<ListResourceProfileDetectionsRequest>;
export interface ListSensitivityInspectionTemplatesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSensitivityInspectionTemplatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/sensitivity-inspections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSensitivityInspectionTemplatesRequest",
}) as any as S.Schema<ListSensitivityInspectionTemplatesRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface S3Destination {
  bucketName?: string;
  keyPrefix?: string;
  kmsKeyArn?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({
    bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    keyPrefix: S.optional(S.String).pipe(T.JsonName("keyPrefix")),
    kmsKeyArn: S.optional(S.String).pipe(T.JsonName("kmsKeyArn")),
  }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface ClassificationExportConfiguration {
  s3Destination?: S3Destination;
}
export const ClassificationExportConfiguration = S.suspend(() =>
  S.Struct({
    s3Destination: S.optional(S3Destination)
      .pipe(T.JsonName("s3Destination"))
      .annotations({ identifier: "S3Destination" }),
  }),
).annotations({
  identifier: "ClassificationExportConfiguration",
}) as any as S.Schema<ClassificationExportConfiguration>;
export interface PutClassificationExportConfigurationRequest {
  configuration?: ClassificationExportConfiguration;
}
export const PutClassificationExportConfigurationRequest = S.suspend(() =>
  S.Struct({
    configuration: S.optional(ClassificationExportConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ClassificationExportConfiguration" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/classification-export-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutClassificationExportConfigurationRequest",
}) as any as S.Schema<PutClassificationExportConfigurationRequest>;
export interface SecurityHubConfiguration {
  publishClassificationFindings?: boolean;
  publishPolicyFindings?: boolean;
}
export const SecurityHubConfiguration = S.suspend(() =>
  S.Struct({
    publishClassificationFindings: S.optional(S.Boolean).pipe(
      T.JsonName("publishClassificationFindings"),
    ),
    publishPolicyFindings: S.optional(S.Boolean).pipe(
      T.JsonName("publishPolicyFindings"),
    ),
  }),
).annotations({
  identifier: "SecurityHubConfiguration",
}) as any as S.Schema<SecurityHubConfiguration>;
export interface PutFindingsPublicationConfigurationRequest {
  clientToken?: string;
  securityHubConfiguration?: SecurityHubConfiguration;
}
export const PutFindingsPublicationConfigurationRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    securityHubConfiguration: S.optional(SecurityHubConfiguration)
      .pipe(T.JsonName("securityHubConfiguration"))
      .annotations({ identifier: "SecurityHubConfiguration" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/findings-publication-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFindingsPublicationConfigurationRequest",
}) as any as S.Schema<PutFindingsPublicationConfigurationRequest>;
export interface PutFindingsPublicationConfigurationResponse {}
export const PutFindingsPublicationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutFindingsPublicationConfigurationResponse",
}) as any as S.Schema<PutFindingsPublicationConfigurationResponse>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  resourceArn: string;
  tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export interface TestCustomDataIdentifierRequest {
  ignoreWords?: string[];
  keywords?: string[];
  maximumMatchDistance?: number;
  regex?: string;
  sampleText?: string;
}
export const TestCustomDataIdentifierRequest = S.suspend(() =>
  S.Struct({
    ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
    keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
    maximumMatchDistance: S.optional(S.Number).pipe(
      T.JsonName("maximumMatchDistance"),
    ),
    regex: S.optional(S.String).pipe(T.JsonName("regex")),
    sampleText: S.optional(S.String).pipe(T.JsonName("sampleText")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-data-identifiers/test" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestCustomDataIdentifierRequest",
}) as any as S.Schema<TestCustomDataIdentifierRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface S3WordsList {
  bucketName?: string;
  objectKey?: string;
}
export const S3WordsList = S.suspend(() =>
  S.Struct({
    bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    objectKey: S.optional(S.String).pipe(T.JsonName("objectKey")),
  }),
).annotations({ identifier: "S3WordsList" }) as any as S.Schema<S3WordsList>;
export interface AllowListCriteria {
  regex?: string;
  s3WordsList?: S3WordsList;
}
export const AllowListCriteria = S.suspend(() =>
  S.Struct({
    regex: S.optional(S.String).pipe(T.JsonName("regex")),
    s3WordsList: S.optional(S3WordsList)
      .pipe(T.JsonName("s3WordsList"))
      .annotations({ identifier: "S3WordsList" }),
  }),
).annotations({
  identifier: "AllowListCriteria",
}) as any as S.Schema<AllowListCriteria>;
export interface UpdateAllowListRequest {
  criteria?: AllowListCriteria;
  description?: string;
  id: string;
  name?: string;
}
export const UpdateAllowListRequest = S.suspend(() =>
  S.Struct({
    criteria: S.optional(AllowListCriteria)
      .pipe(T.JsonName("criteria"))
      .annotations({ identifier: "AllowListCriteria" }),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/allow-lists/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAllowListRequest",
}) as any as S.Schema<UpdateAllowListRequest>;
export interface UpdateAutomatedDiscoveryConfigurationRequest {
  autoEnableOrganizationMembers?: AutoEnableMode;
  status?: AutomatedDiscoveryStatus;
}
export const UpdateAutomatedDiscoveryConfigurationRequest = S.suspend(() =>
  S.Struct({
    autoEnableOrganizationMembers: S.optional(AutoEnableMode).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
    status: S.optional(AutomatedDiscoveryStatus).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/automated-discovery/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutomatedDiscoveryConfigurationRequest",
}) as any as S.Schema<UpdateAutomatedDiscoveryConfigurationRequest>;
export interface UpdateAutomatedDiscoveryConfigurationResponse {}
export const UpdateAutomatedDiscoveryConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAutomatedDiscoveryConfigurationResponse",
}) as any as S.Schema<UpdateAutomatedDiscoveryConfigurationResponse>;
export interface UpdateClassificationJobRequest {
  jobId: string;
  jobStatus?: JobStatus;
}
export const UpdateClassificationJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    jobStatus: S.optional(JobStatus).pipe(T.JsonName("jobStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/jobs/{jobId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClassificationJobRequest",
}) as any as S.Schema<UpdateClassificationJobRequest>;
export interface UpdateClassificationJobResponse {}
export const UpdateClassificationJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateClassificationJobResponse",
}) as any as S.Schema<UpdateClassificationJobResponse>;
export interface UpdateFindingsFilterRequest {
  action?: FindingsFilterAction;
  clientToken?: string;
  description?: string;
  findingCriteria?: FindingCriteria;
  id: string;
  name?: string;
  position?: number;
}
export const UpdateFindingsFilterRequest = S.suspend(() =>
  S.Struct({
    action: S.optional(FindingsFilterAction).pipe(T.JsonName("action")),
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    findingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    position: S.optional(S.Number).pipe(T.JsonName("position")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/findingsfilters/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFindingsFilterRequest",
}) as any as S.Schema<UpdateFindingsFilterRequest>;
export interface UpdateMacieSessionRequest {
  findingPublishingFrequency?: FindingPublishingFrequency;
  status?: MacieStatus;
}
export const UpdateMacieSessionRequest = S.suspend(() =>
  S.Struct({
    findingPublishingFrequency: S.optional(FindingPublishingFrequency).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    status: S.optional(MacieStatus).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/macie" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMacieSessionRequest",
}) as any as S.Schema<UpdateMacieSessionRequest>;
export interface UpdateMacieSessionResponse {}
export const UpdateMacieSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMacieSessionResponse",
}) as any as S.Schema<UpdateMacieSessionResponse>;
export interface UpdateMemberSessionRequest {
  id: string;
  status?: MacieStatus;
}
export const UpdateMemberSessionRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    status: S.optional(MacieStatus).pipe(T.JsonName("status")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/macie/members/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMemberSessionRequest",
}) as any as S.Schema<UpdateMemberSessionRequest>;
export interface UpdateMemberSessionResponse {}
export const UpdateMemberSessionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMemberSessionResponse",
}) as any as S.Schema<UpdateMemberSessionResponse>;
export interface UpdateOrganizationConfigurationRequest {
  autoEnable?: boolean;
}
export const UpdateOrganizationConfigurationRequest = S.suspend(() =>
  S.Struct({
    autoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/admin/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOrganizationConfigurationRequest",
}) as any as S.Schema<UpdateOrganizationConfigurationRequest>;
export interface UpdateOrganizationConfigurationResponse {}
export const UpdateOrganizationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateOrganizationConfigurationResponse",
}) as any as S.Schema<UpdateOrganizationConfigurationResponse>;
export interface UpdateResourceProfileRequest {
  resourceArn?: string;
  sensitivityScoreOverride?: number;
}
export const UpdateResourceProfileRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    sensitivityScoreOverride: S.optional(S.Number).pipe(
      T.JsonName("sensitivityScoreOverride"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/resource-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceProfileRequest",
}) as any as S.Schema<UpdateResourceProfileRequest>;
export interface UpdateResourceProfileResponse {}
export const UpdateResourceProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResourceProfileResponse",
}) as any as S.Schema<UpdateResourceProfileResponse>;
export type AutomatedDiscoveryAccountStatus =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const AutomatedDiscoveryAccountStatus = S.String;
export interface DailySchedule {}
export const DailySchedule = S.suspend(() => S.Struct({})).annotations({
  identifier: "DailySchedule",
}) as any as S.Schema<DailySchedule>;
export type DataIdentifierSeverity = "LOW" | "MEDIUM" | "HIGH" | (string & {});
export const DataIdentifierSeverity = S.String;
export type FindingStatisticsSortAttributeName =
  | "groupKey"
  | "count"
  | (string & {});
export const FindingStatisticsSortAttributeName = S.String;
export type RevealStatus = "ENABLED" | "DISABLED" | (string & {});
export const RevealStatus = S.String;
export type RetrievalMode =
  | "CALLER_CREDENTIALS"
  | "ASSUME_ROLE"
  | (string & {});
export const RetrievalMode = S.String;
export type UsageStatisticsFilterComparator =
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "EQ"
  | "NE"
  | "CONTAINS"
  | (string & {});
export const UsageStatisticsFilterComparator = S.String;
export type UsageStatisticsFilterKey =
  | "accountId"
  | "serviceLimit"
  | "freeTrialStartDate"
  | "total"
  | (string & {});
export const UsageStatisticsFilterKey = S.String;
export type UsageStatisticsSortKey =
  | "accountId"
  | "total"
  | "serviceLimitValue"
  | "freeTrialStartDate"
  | (string & {});
export const UsageStatisticsSortKey = S.String;
export type ListJobsSortAttributeName =
  | "createdAt"
  | "jobStatus"
  | "name"
  | "jobType"
  | (string & {});
export const ListJobsSortAttributeName = S.String;
export type SearchResourcesSortAttributeName =
  | "ACCOUNT_ID"
  | "RESOURCE_NAME"
  | "S3_CLASSIFIABLE_OBJECT_COUNT"
  | "S3_CLASSIFIABLE_SIZE_IN_BYTES"
  | (string & {});
export const SearchResourcesSortAttributeName = S.String;
export type DataIdentifierType = "CUSTOM" | "MANAGED" | (string & {});
export const DataIdentifierType = S.String;
export interface AutomatedDiscoveryAccountUpdate {
  accountId?: string;
  status?: AutomatedDiscoveryAccountStatus;
}
export const AutomatedDiscoveryAccountUpdate = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    status: S.optional(AutomatedDiscoveryAccountStatus).pipe(
      T.JsonName("status"),
    ),
  }),
).annotations({
  identifier: "AutomatedDiscoveryAccountUpdate",
}) as any as S.Schema<AutomatedDiscoveryAccountUpdate>;
export type __listOfAutomatedDiscoveryAccountUpdate =
  AutomatedDiscoveryAccountUpdate[];
export const __listOfAutomatedDiscoveryAccountUpdate = S.Array(
  AutomatedDiscoveryAccountUpdate,
);
export interface SeverityLevel {
  occurrencesThreshold?: number;
  severity?: DataIdentifierSeverity;
}
export const SeverityLevel = S.suspend(() =>
  S.Struct({
    occurrencesThreshold: S.optional(S.Number).pipe(
      T.JsonName("occurrencesThreshold"),
    ),
    severity: S.optional(DataIdentifierSeverity).pipe(T.JsonName("severity")),
  }),
).annotations({
  identifier: "SeverityLevel",
}) as any as S.Schema<SeverityLevel>;
export type SeverityLevelList = SeverityLevel[];
export const SeverityLevelList = S.Array(SeverityLevel);
export interface AccountDetail {
  accountId?: string;
  email?: string;
}
export const AccountDetail = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    email: S.optional(S.String).pipe(T.JsonName("email")),
  }),
).annotations({
  identifier: "AccountDetail",
}) as any as S.Schema<AccountDetail>;
export interface BucketSortCriteria {
  attributeName?: string;
  orderBy?: OrderBy;
}
export const BucketSortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "BucketSortCriteria",
}) as any as S.Schema<BucketSortCriteria>;
export interface FindingStatisticsSortCriteria {
  attributeName?: FindingStatisticsSortAttributeName;
  orderBy?: OrderBy;
}
export const FindingStatisticsSortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(FindingStatisticsSortAttributeName).pipe(
      T.JsonName("attributeName"),
    ),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "FindingStatisticsSortCriteria",
}) as any as S.Schema<FindingStatisticsSortCriteria>;
export interface RevealConfiguration {
  kmsKeyId?: string;
  status?: RevealStatus;
}
export const RevealConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")),
    status: S.optional(RevealStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "RevealConfiguration",
}) as any as S.Schema<RevealConfiguration>;
export interface RetrievalConfiguration {
  externalId?: string;
  retrievalMode?: RetrievalMode;
  roleName?: string;
}
export const RetrievalConfiguration = S.suspend(() =>
  S.Struct({
    externalId: S.optional(S.String).pipe(T.JsonName("externalId")),
    retrievalMode: S.optional(RetrievalMode).pipe(T.JsonName("retrievalMode")),
    roleName: S.optional(S.String).pipe(T.JsonName("roleName")),
  }),
).annotations({
  identifier: "RetrievalConfiguration",
}) as any as S.Schema<RetrievalConfiguration>;
export type RevealRequestStatus =
  | "SUCCESS"
  | "PROCESSING"
  | "ERROR"
  | (string & {});
export const RevealRequestStatus = S.String;
export type AvailabilityCode = "AVAILABLE" | "UNAVAILABLE" | (string & {});
export const AvailabilityCode = S.String;
export type UnavailabilityReasonCode =
  | "OBJECT_EXCEEDS_SIZE_QUOTA"
  | "UNSUPPORTED_OBJECT_TYPE"
  | "UNSUPPORTED_FINDING_TYPE"
  | "INVALID_CLASSIFICATION_RESULT"
  | "OBJECT_UNAVAILABLE"
  | "ACCOUNT_NOT_IN_ORGANIZATION"
  | "MISSING_GET_MEMBER_PERMISSION"
  | "ROLE_TOO_PERMISSIVE"
  | "MEMBER_ROLE_TOO_PERMISSIVE"
  | "INVALID_RESULT_SIGNATURE"
  | "RESULT_NOT_SIGNED"
  | (string & {});
export const UnavailabilityReasonCode = S.String;
export type __listOfUnavailabilityReasonCode = UnavailabilityReasonCode[];
export const __listOfUnavailabilityReasonCode = S.Array(
  UnavailabilityReasonCode,
);
export interface UsageStatisticsFilter {
  comparator?: UsageStatisticsFilterComparator;
  key?: UsageStatisticsFilterKey;
  values?: string[];
}
export const UsageStatisticsFilter = S.suspend(() =>
  S.Struct({
    comparator: S.optional(UsageStatisticsFilterComparator).pipe(
      T.JsonName("comparator"),
    ),
    key: S.optional(UsageStatisticsFilterKey).pipe(T.JsonName("key")),
    values: S.optional(__listOf__string).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "UsageStatisticsFilter",
}) as any as S.Schema<UsageStatisticsFilter>;
export type __listOfUsageStatisticsFilter = UsageStatisticsFilter[];
export const __listOfUsageStatisticsFilter = S.Array(UsageStatisticsFilter);
export interface UsageStatisticsSortBy {
  key?: UsageStatisticsSortKey;
  orderBy?: OrderBy;
}
export const UsageStatisticsSortBy = S.suspend(() =>
  S.Struct({
    key: S.optional(UsageStatisticsSortKey).pipe(T.JsonName("key")),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "UsageStatisticsSortBy",
}) as any as S.Schema<UsageStatisticsSortBy>;
export interface ListJobsSortCriteria {
  attributeName?: ListJobsSortAttributeName;
  orderBy?: OrderBy;
}
export const ListJobsSortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(ListJobsSortAttributeName).pipe(
      T.JsonName("attributeName"),
    ),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "ListJobsSortCriteria",
}) as any as S.Schema<ListJobsSortCriteria>;
export type __listOfInvitation = Invitation[];
export const __listOfInvitation = S.Array(Invitation);
export interface SearchResourcesSortCriteria {
  attributeName?: SearchResourcesSortAttributeName;
  orderBy?: OrderBy;
}
export const SearchResourcesSortCriteria = S.suspend(() =>
  S.Struct({
    attributeName: S.optional(SearchResourcesSortAttributeName).pipe(
      T.JsonName("attributeName"),
    ),
    orderBy: S.optional(OrderBy).pipe(T.JsonName("orderBy")),
  }),
).annotations({
  identifier: "SearchResourcesSortCriteria",
}) as any as S.Schema<SearchResourcesSortCriteria>;
export interface SuppressDataIdentifier {
  id?: string;
  type?: DataIdentifierType;
}
export const SuppressDataIdentifier = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.JsonName("id")),
    type: S.optional(DataIdentifierType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "SuppressDataIdentifier",
}) as any as S.Schema<SuppressDataIdentifier>;
export type __listOfSuppressDataIdentifier = SuppressDataIdentifier[];
export const __listOfSuppressDataIdentifier = S.Array(SuppressDataIdentifier);
export interface UpdateRetrievalConfiguration {
  retrievalMode?: RetrievalMode;
  roleName?: string;
}
export const UpdateRetrievalConfiguration = S.suspend(() =>
  S.Struct({
    retrievalMode: S.optional(RetrievalMode).pipe(T.JsonName("retrievalMode")),
    roleName: S.optional(S.String).pipe(T.JsonName("roleName")),
  }),
).annotations({
  identifier: "UpdateRetrievalConfiguration",
}) as any as S.Schema<UpdateRetrievalConfiguration>;
export interface SensitivityInspectionTemplateExcludes {
  managedDataIdentifierIds?: string[];
}
export const SensitivityInspectionTemplateExcludes = S.suspend(() =>
  S.Struct({
    managedDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("managedDataIdentifierIds"),
    ),
  }),
).annotations({
  identifier: "SensitivityInspectionTemplateExcludes",
}) as any as S.Schema<SensitivityInspectionTemplateExcludes>;
export interface SensitivityInspectionTemplateIncludes {
  allowListIds?: string[];
  customDataIdentifierIds?: string[];
  managedDataIdentifierIds?: string[];
}
export const SensitivityInspectionTemplateIncludes = S.suspend(() =>
  S.Struct({
    allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
    customDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("customDataIdentifierIds"),
    ),
    managedDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("managedDataIdentifierIds"),
    ),
  }),
).annotations({
  identifier: "SensitivityInspectionTemplateIncludes",
}) as any as S.Schema<SensitivityInspectionTemplateIncludes>;
export type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | (string & {});
export const DayOfWeek = S.String;
export type JobComparator =
  | "EQ"
  | "GT"
  | "GTE"
  | "LT"
  | "LTE"
  | "NE"
  | "CONTAINS"
  | "STARTS_WITH"
  | (string & {});
export const JobComparator = S.String;
export type ListJobsFilterKey =
  | "jobType"
  | "jobStatus"
  | "createdAt"
  | "name"
  | (string & {});
export const ListJobsFilterKey = S.String;
export type __listOfS3BucketName = string[];
export const __listOfS3BucketName = S.Array(S.String);
export type ClassificationScopeUpdateOperation =
  | "ADD"
  | "REPLACE"
  | "REMOVE"
  | (string & {});
export const ClassificationScopeUpdateOperation = S.String;
export interface BatchUpdateAutomatedDiscoveryAccountsRequest {
  accounts?: AutomatedDiscoveryAccountUpdate[];
}
export const BatchUpdateAutomatedDiscoveryAccountsRequest = S.suspend(() =>
  S.Struct({
    accounts: S.optional(__listOfAutomatedDiscoveryAccountUpdate).pipe(
      T.JsonName("accounts"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/automated-discovery/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateAutomatedDiscoveryAccountsRequest",
}) as any as S.Schema<BatchUpdateAutomatedDiscoveryAccountsRequest>;
export interface CreateCustomDataIdentifierRequest {
  clientToken?: string;
  description?: string;
  ignoreWords?: string[];
  keywords?: string[];
  maximumMatchDistance?: number;
  name?: string;
  regex?: string;
  severityLevels?: SeverityLevel[];
  tags?: { [key: string]: string | undefined };
}
export const CreateCustomDataIdentifierRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
    keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
    maximumMatchDistance: S.optional(S.Number).pipe(
      T.JsonName("maximumMatchDistance"),
    ),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    regex: S.optional(S.String).pipe(T.JsonName("regex")),
    severityLevels: S.optional(SeverityLevelList).pipe(
      T.JsonName("severityLevels"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-data-identifiers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomDataIdentifierRequest",
}) as any as S.Schema<CreateCustomDataIdentifierRequest>;
export interface CreateMemberRequest {
  account?: AccountDetail;
  tags?: { [key: string]: string | undefined };
}
export const CreateMemberRequest = S.suspend(() =>
  S.Struct({
    account: S.optional(AccountDetail)
      .pipe(T.JsonName("account"))
      .annotations({ identifier: "AccountDetail" }),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/members" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMemberRequest",
}) as any as S.Schema<CreateMemberRequest>;
export type ErrorCode = "ClientError" | "InternalError" | (string & {});
export const ErrorCode = S.String;
export interface UnprocessedAccount {
  accountId?: string;
  errorCode?: ErrorCode;
  errorMessage?: string;
}
export const UnprocessedAccount = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    errorCode: S.optional(ErrorCode).pipe(T.JsonName("errorCode")),
    errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  }),
).annotations({
  identifier: "UnprocessedAccount",
}) as any as S.Schema<UnprocessedAccount>;
export type __listOfUnprocessedAccount = UnprocessedAccount[];
export const __listOfUnprocessedAccount = S.Array(UnprocessedAccount);
export interface DeclineInvitationsResponse {
  unprocessedAccounts?: UnprocessedAccount[];
}
export const DeclineInvitationsResponse = S.suspend(() =>
  S.Struct({
    unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DeclineInvitationsResponse",
}) as any as S.Schema<DeclineInvitationsResponse>;
export interface DeleteInvitationsResponse {
  unprocessedAccounts?: UnprocessedAccount[];
}
export const DeleteInvitationsResponse = S.suspend(() =>
  S.Struct({
    unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "DeleteInvitationsResponse",
}) as any as S.Schema<DeleteInvitationsResponse>;
export interface GetAdministratorAccountResponse {
  administrator?: Invitation;
}
export const GetAdministratorAccountResponse = S.suspend(() =>
  S.Struct({
    administrator: S.optional(Invitation)
      .pipe(T.JsonName("administrator"))
      .annotations({ identifier: "Invitation" }),
  }),
).annotations({
  identifier: "GetAdministratorAccountResponse",
}) as any as S.Schema<GetAdministratorAccountResponse>;
export interface GetCustomDataIdentifierResponse {
  arn?: string;
  createdAt?: Date;
  deleted?: boolean;
  description?: string;
  id?: string;
  ignoreWords?: string[];
  keywords?: string[];
  maximumMatchDistance?: number;
  name?: string;
  regex?: string;
  severityLevels?: (SeverityLevel & {
    occurrencesThreshold: number;
    severity: DataIdentifierSeverity;
  })[];
  tags?: { [key: string]: string | undefined };
}
export const GetCustomDataIdentifierResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    deleted: S.optional(S.Boolean).pipe(T.JsonName("deleted")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
    keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
    maximumMatchDistance: S.optional(S.Number).pipe(
      T.JsonName("maximumMatchDistance"),
    ),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    regex: S.optional(S.String).pipe(T.JsonName("regex")),
    severityLevels: S.optional(SeverityLevelList).pipe(
      T.JsonName("severityLevels"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetCustomDataIdentifierResponse",
}) as any as S.Schema<GetCustomDataIdentifierResponse>;
export interface GetFindingsRequest {
  findingIds?: string[];
  sortCriteria?: SortCriteria;
}
export const GetFindingsRequest = S.suspend(() =>
  S.Struct({
    findingIds: S.optional(__listOf__string).pipe(T.JsonName("findingIds")),
    sortCriteria: S.optional(SortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings/describe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingsRequest",
}) as any as S.Schema<GetFindingsRequest>;
export interface GetFindingsFilterResponse {
  action?: FindingsFilterAction;
  arn?: string;
  description?: string;
  findingCriteria?: FindingCriteria;
  id?: string;
  name?: string;
  position?: number;
  tags?: { [key: string]: string | undefined };
}
export const GetFindingsFilterResponse = S.suspend(() =>
  S.Struct({
    action: S.optional(FindingsFilterAction).pipe(T.JsonName("action")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    findingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    position: S.optional(S.Number).pipe(T.JsonName("position")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "GetFindingsFilterResponse",
}) as any as S.Schema<GetFindingsFilterResponse>;
export interface GetFindingsPublicationConfigurationResponse {
  securityHubConfiguration?: SecurityHubConfiguration & {
    publishClassificationFindings: boolean;
    publishPolicyFindings: boolean;
  };
}
export const GetFindingsPublicationConfigurationResponse = S.suspend(() =>
  S.Struct({
    securityHubConfiguration: S.optional(SecurityHubConfiguration)
      .pipe(T.JsonName("securityHubConfiguration"))
      .annotations({ identifier: "SecurityHubConfiguration" }),
  }),
).annotations({
  identifier: "GetFindingsPublicationConfigurationResponse",
}) as any as S.Schema<GetFindingsPublicationConfigurationResponse>;
export interface GetFindingStatisticsRequest {
  findingCriteria?: FindingCriteria;
  groupBy?: GroupBy;
  size?: number;
  sortCriteria?: FindingStatisticsSortCriteria;
}
export const GetFindingStatisticsRequest = S.suspend(() =>
  S.Struct({
    findingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    groupBy: S.optional(GroupBy).pipe(T.JsonName("groupBy")),
    size: S.optional(S.Number).pipe(T.JsonName("size")),
    sortCriteria: S.optional(FindingStatisticsSortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "FindingStatisticsSortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findings/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFindingStatisticsRequest",
}) as any as S.Schema<GetFindingStatisticsRequest>;
export interface GetMemberResponse {
  accountId?: string;
  administratorAccountId?: string;
  arn?: string;
  email?: string;
  invitedAt?: Date;
  masterAccountId?: string;
  relationshipStatus?: RelationshipStatus;
  tags?: { [key: string]: string | undefined };
  updatedAt?: Date;
}
export const GetMemberResponse = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    administratorAccountId: S.optional(S.String).pipe(
      T.JsonName("administratorAccountId"),
    ),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    email: S.optional(S.String).pipe(T.JsonName("email")),
    invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("invitedAt"),
    ),
    masterAccountId: S.optional(S.String).pipe(T.JsonName("masterAccountId")),
    relationshipStatus: S.optional(RelationshipStatus).pipe(
      T.JsonName("relationshipStatus"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "GetMemberResponse",
}) as any as S.Schema<GetMemberResponse>;
export interface GetRevealConfigurationResponse {
  configuration?: RevealConfiguration & { status: RevealStatus };
  retrievalConfiguration?: RetrievalConfiguration & {
    retrievalMode: RetrievalMode;
  };
}
export const GetRevealConfigurationResponse = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RevealConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "RevealConfiguration" }),
    retrievalConfiguration: S.optional(RetrievalConfiguration)
      .pipe(T.JsonName("retrievalConfiguration"))
      .annotations({ identifier: "RetrievalConfiguration" }),
  }),
).annotations({
  identifier: "GetRevealConfigurationResponse",
}) as any as S.Schema<GetRevealConfigurationResponse>;
export interface GetSensitiveDataOccurrencesAvailabilityResponse {
  code?: AvailabilityCode;
  reasons?: UnavailabilityReasonCode[];
}
export const GetSensitiveDataOccurrencesAvailabilityResponse = S.suspend(() =>
  S.Struct({
    code: S.optional(AvailabilityCode).pipe(T.JsonName("code")),
    reasons: S.optional(__listOfUnavailabilityReasonCode).pipe(
      T.JsonName("reasons"),
    ),
  }),
).annotations({
  identifier: "GetSensitiveDataOccurrencesAvailabilityResponse",
}) as any as S.Schema<GetSensitiveDataOccurrencesAvailabilityResponse>;
export interface GetSensitivityInspectionTemplateResponse {
  description?: string;
  excludes?: SensitivityInspectionTemplateExcludes;
  includes?: SensitivityInspectionTemplateIncludes;
  name?: string;
  sensitivityInspectionTemplateId?: string;
}
export const GetSensitivityInspectionTemplateResponse = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String).pipe(T.JsonName("description")),
    excludes: S.optional(SensitivityInspectionTemplateExcludes)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "SensitivityInspectionTemplateExcludes" }),
    includes: S.optional(SensitivityInspectionTemplateIncludes)
      .pipe(T.JsonName("includes"))
      .annotations({ identifier: "SensitivityInspectionTemplateIncludes" }),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    sensitivityInspectionTemplateId: S.optional(S.String).pipe(
      T.JsonName("sensitivityInspectionTemplateId"),
    ),
  }),
).annotations({
  identifier: "GetSensitivityInspectionTemplateResponse",
}) as any as S.Schema<GetSensitivityInspectionTemplateResponse>;
export interface GetUsageStatisticsRequest {
  filterBy?: UsageStatisticsFilter[];
  maxResults?: number;
  nextToken?: string;
  sortBy?: UsageStatisticsSortBy;
  timeRange?: TimeRange;
}
export const GetUsageStatisticsRequest = S.suspend(() =>
  S.Struct({
    filterBy: S.optional(__listOfUsageStatisticsFilter).pipe(
      T.JsonName("filterBy"),
    ),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortBy: S.optional(UsageStatisticsSortBy)
      .pipe(T.JsonName("sortBy"))
      .annotations({ identifier: "UsageStatisticsSortBy" }),
    timeRange: S.optional(TimeRange).pipe(T.JsonName("timeRange")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/usage/statistics" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUsageStatisticsRequest",
}) as any as S.Schema<GetUsageStatisticsRequest>;
export interface ListFindingsResponse {
  findingIds?: string[];
  nextToken?: string;
}
export const ListFindingsResponse = S.suspend(() =>
  S.Struct({
    findingIds: S.optional(__listOf__string).pipe(T.JsonName("findingIds")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListFindingsResponse",
}) as any as S.Schema<ListFindingsResponse>;
export interface ListInvitationsResponse {
  invitations?: Invitation[];
  nextToken?: string;
}
export const ListInvitationsResponse = S.suspend(() =>
  S.Struct({
    invitations: S.optional(__listOfInvitation).pipe(T.JsonName("invitations")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListInvitationsResponse",
}) as any as S.Schema<ListInvitationsResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap).pipe(T.JsonName("tags")) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutClassificationExportConfigurationResponse {
  configuration?: ClassificationExportConfiguration & {
    s3Destination: S3Destination & { bucketName: string; kmsKeyArn: string };
  };
}
export const PutClassificationExportConfigurationResponse = S.suspend(() =>
  S.Struct({
    configuration: S.optional(ClassificationExportConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ClassificationExportConfiguration" }),
  }),
).annotations({
  identifier: "PutClassificationExportConfigurationResponse",
}) as any as S.Schema<PutClassificationExportConfigurationResponse>;
export interface TestCustomDataIdentifierResponse {
  matchCount?: number;
}
export const TestCustomDataIdentifierResponse = S.suspend(() =>
  S.Struct({ matchCount: S.optional(S.Number).pipe(T.JsonName("matchCount")) }),
).annotations({
  identifier: "TestCustomDataIdentifierResponse",
}) as any as S.Schema<TestCustomDataIdentifierResponse>;
export interface UpdateAllowListResponse {
  arn?: string;
  id?: string;
}
export const UpdateAllowListResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "UpdateAllowListResponse",
}) as any as S.Schema<UpdateAllowListResponse>;
export interface UpdateFindingsFilterResponse {
  arn?: string;
  id?: string;
}
export const UpdateFindingsFilterResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "UpdateFindingsFilterResponse",
}) as any as S.Schema<UpdateFindingsFilterResponse>;
export interface UpdateResourceProfileDetectionsRequest {
  resourceArn?: string;
  suppressDataIdentifiers?: SuppressDataIdentifier[];
}
export const UpdateResourceProfileDetectionsRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    suppressDataIdentifiers: S.optional(__listOfSuppressDataIdentifier).pipe(
      T.JsonName("suppressDataIdentifiers"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/resource-profiles/detections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceProfileDetectionsRequest",
}) as any as S.Schema<UpdateResourceProfileDetectionsRequest>;
export interface UpdateResourceProfileDetectionsResponse {}
export const UpdateResourceProfileDetectionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResourceProfileDetectionsResponse",
}) as any as S.Schema<UpdateResourceProfileDetectionsResponse>;
export interface UpdateRevealConfigurationRequest {
  configuration?: RevealConfiguration;
  retrievalConfiguration?: UpdateRetrievalConfiguration;
}
export const UpdateRevealConfigurationRequest = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RevealConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "RevealConfiguration" }),
    retrievalConfiguration: S.optional(UpdateRetrievalConfiguration)
      .pipe(T.JsonName("retrievalConfiguration"))
      .annotations({ identifier: "UpdateRetrievalConfiguration" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/reveal-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRevealConfigurationRequest",
}) as any as S.Schema<UpdateRevealConfigurationRequest>;
export interface UpdateSensitivityInspectionTemplateRequest {
  description?: string;
  excludes?: SensitivityInspectionTemplateExcludes;
  id: string;
  includes?: SensitivityInspectionTemplateIncludes;
}
export const UpdateSensitivityInspectionTemplateRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String).pipe(T.JsonName("description")),
    excludes: S.optional(SensitivityInspectionTemplateExcludes)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "SensitivityInspectionTemplateExcludes" }),
    id: S.String.pipe(T.HttpLabel("id")),
    includes: S.optional(SensitivityInspectionTemplateIncludes)
      .pipe(T.JsonName("includes"))
      .annotations({ identifier: "SensitivityInspectionTemplateIncludes" }),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/templates/sensitivity-inspections/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSensitivityInspectionTemplateRequest",
}) as any as S.Schema<UpdateSensitivityInspectionTemplateRequest>;
export interface UpdateSensitivityInspectionTemplateResponse {}
export const UpdateSensitivityInspectionTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSensitivityInspectionTemplateResponse",
}) as any as S.Schema<UpdateSensitivityInspectionTemplateResponse>;
export interface S3BucketDefinitionForJob {
  accountId?: string;
  buckets?: string[];
}
export const S3BucketDefinitionForJob = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    buckets: S.optional(__listOf__string).pipe(T.JsonName("buckets")),
  }),
).annotations({
  identifier: "S3BucketDefinitionForJob",
}) as any as S.Schema<S3BucketDefinitionForJob>;
export type __listOfS3BucketDefinitionForJob = S3BucketDefinitionForJob[];
export const __listOfS3BucketDefinitionForJob = S.Array(
  S3BucketDefinitionForJob,
);
export interface MonthlySchedule {
  dayOfMonth?: number;
}
export const MonthlySchedule = S.suspend(() =>
  S.Struct({ dayOfMonth: S.optional(S.Number).pipe(T.JsonName("dayOfMonth")) }),
).annotations({
  identifier: "MonthlySchedule",
}) as any as S.Schema<MonthlySchedule>;
export interface WeeklySchedule {
  dayOfWeek?: DayOfWeek;
}
export const WeeklySchedule = S.suspend(() =>
  S.Struct({ dayOfWeek: S.optional(DayOfWeek).pipe(T.JsonName("dayOfWeek")) }),
).annotations({
  identifier: "WeeklySchedule",
}) as any as S.Schema<WeeklySchedule>;
export interface BucketCriteriaAdditionalProperties {
  eq?: string[];
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  neq?: string[];
  prefix?: string;
}
export const BucketCriteriaAdditionalProperties = S.suspend(() =>
  S.Struct({
    eq: S.optional(__listOf__string).pipe(T.JsonName("eq")),
    gt: S.optional(S.Number).pipe(T.JsonName("gt")),
    gte: S.optional(S.Number).pipe(T.JsonName("gte")),
    lt: S.optional(S.Number).pipe(T.JsonName("lt")),
    lte: S.optional(S.Number).pipe(T.JsonName("lte")),
    neq: S.optional(__listOf__string).pipe(T.JsonName("neq")),
    prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
  }),
).annotations({
  identifier: "BucketCriteriaAdditionalProperties",
}) as any as S.Schema<BucketCriteriaAdditionalProperties>;
export type LastRunErrorStatusCode = "NONE" | "ERROR" | (string & {});
export const LastRunErrorStatusCode = S.String;
export type AllowListStatusCode =
  | "OK"
  | "S3_OBJECT_NOT_FOUND"
  | "S3_USER_ACCESS_DENIED"
  | "S3_OBJECT_ACCESS_DENIED"
  | "S3_THROTTLED"
  | "S3_OBJECT_OVERSIZE"
  | "S3_OBJECT_EMPTY"
  | "UNKNOWN_ERROR"
  | (string & {});
export const AllowListStatusCode = S.String;
export type Currency = "USD" | (string & {});
export const Currency = S.String;
export type UsageType =
  | "DATA_INVENTORY_EVALUATION"
  | "SENSITIVE_DATA_DISCOVERY"
  | "AUTOMATED_SENSITIVE_DATA_DISCOVERY"
  | "AUTOMATED_OBJECT_MONITORING"
  | (string & {});
export const UsageType = S.String;
export interface ListJobsFilterTerm {
  comparator?: JobComparator;
  key?: ListJobsFilterKey;
  values?: string[];
}
export const ListJobsFilterTerm = S.suspend(() =>
  S.Struct({
    comparator: S.optional(JobComparator).pipe(T.JsonName("comparator")),
    key: S.optional(ListJobsFilterKey).pipe(T.JsonName("key")),
    values: S.optional(__listOf__string).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "ListJobsFilterTerm",
}) as any as S.Schema<ListJobsFilterTerm>;
export type __listOfListJobsFilterTerm = ListJobsFilterTerm[];
export const __listOfListJobsFilterTerm = S.Array(ListJobsFilterTerm);
export type SensitiveDataItemCategory =
  | "FINANCIAL_INFORMATION"
  | "PERSONAL_INFORMATION"
  | "CREDENTIALS"
  | "CUSTOM_IDENTIFIER"
  | (string & {});
export const SensitiveDataItemCategory = S.String;
export type AdminStatus = "ENABLED" | "DISABLING_IN_PROGRESS" | (string & {});
export const AdminStatus = S.String;
export interface S3ClassificationScopeExclusionUpdate {
  bucketNames?: string[];
  operation?: ClassificationScopeUpdateOperation;
}
export const S3ClassificationScopeExclusionUpdate = S.suspend(() =>
  S.Struct({
    bucketNames: S.optional(__listOfS3BucketName).pipe(
      T.JsonName("bucketNames"),
    ),
    operation: S.optional(ClassificationScopeUpdateOperation).pipe(
      T.JsonName("operation"),
    ),
  }),
).annotations({
  identifier: "S3ClassificationScopeExclusionUpdate",
}) as any as S.Schema<S3ClassificationScopeExclusionUpdate>;
export interface BatchGetCustomDataIdentifierSummary {
  arn?: string;
  createdAt?: Date;
  deleted?: boolean;
  description?: string;
  id?: string;
  name?: string;
}
export const BatchGetCustomDataIdentifierSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    deleted: S.optional(S.Boolean).pipe(T.JsonName("deleted")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "BatchGetCustomDataIdentifierSummary",
}) as any as S.Schema<BatchGetCustomDataIdentifierSummary>;
export type __listOfBatchGetCustomDataIdentifierSummary =
  BatchGetCustomDataIdentifierSummary[];
export const __listOfBatchGetCustomDataIdentifierSummary = S.Array(
  BatchGetCustomDataIdentifierSummary,
);
export interface JobScheduleFrequency {
  dailySchedule?: DailySchedule;
  monthlySchedule?: MonthlySchedule;
  weeklySchedule?: WeeklySchedule;
}
export const JobScheduleFrequency = S.suspend(() =>
  S.Struct({
    dailySchedule: S.optional(DailySchedule)
      .pipe(T.JsonName("dailySchedule"))
      .annotations({ identifier: "DailySchedule" }),
    monthlySchedule: S.optional(MonthlySchedule)
      .pipe(T.JsonName("monthlySchedule"))
      .annotations({ identifier: "MonthlySchedule" }),
    weeklySchedule: S.optional(WeeklySchedule)
      .pipe(T.JsonName("weeklySchedule"))
      .annotations({ identifier: "WeeklySchedule" }),
  }),
).annotations({
  identifier: "JobScheduleFrequency",
}) as any as S.Schema<JobScheduleFrequency>;
export type BucketCriteria = {
  [key: string]: BucketCriteriaAdditionalProperties | undefined;
};
export const BucketCriteria = S.Record({
  key: S.String,
  value: S.UndefinedOr(BucketCriteriaAdditionalProperties),
});
export interface LastRunErrorStatus {
  code?: LastRunErrorStatusCode;
}
export const LastRunErrorStatus = S.suspend(() =>
  S.Struct({
    code: S.optional(LastRunErrorStatusCode).pipe(T.JsonName("code")),
  }),
).annotations({
  identifier: "LastRunErrorStatus",
}) as any as S.Schema<LastRunErrorStatus>;
export interface Statistics {
  approximateNumberOfObjectsToProcess?: number;
  numberOfRuns?: number;
}
export const Statistics = S.suspend(() =>
  S.Struct({
    approximateNumberOfObjectsToProcess: S.optional(S.Number).pipe(
      T.JsonName("approximateNumberOfObjectsToProcess"),
    ),
    numberOfRuns: S.optional(S.Number).pipe(T.JsonName("numberOfRuns")),
  }),
).annotations({ identifier: "Statistics" }) as any as S.Schema<Statistics>;
export interface UserPausedDetails {
  jobExpiresAt?: Date;
  jobImminentExpirationHealthEventArn?: string;
  jobPausedAt?: Date;
}
export const UserPausedDetails = S.suspend(() =>
  S.Struct({
    jobExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("jobExpiresAt"),
    ),
    jobImminentExpirationHealthEventArn: S.optional(S.String).pipe(
      T.JsonName("jobImminentExpirationHealthEventArn"),
    ),
    jobPausedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("jobPausedAt"),
    ),
  }),
).annotations({
  identifier: "UserPausedDetails",
}) as any as S.Schema<UserPausedDetails>;
export interface AllowListStatus {
  code?: AllowListStatusCode;
  description?: string;
}
export const AllowListStatus = S.suspend(() =>
  S.Struct({
    code: S.optional(AllowListStatusCode).pipe(T.JsonName("code")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
  }),
).annotations({
  identifier: "AllowListStatus",
}) as any as S.Schema<AllowListStatus>;
export interface BucketCountByEffectivePermission {
  publiclyAccessible?: number;
  publiclyReadable?: number;
  publiclyWritable?: number;
  unknown?: number;
}
export const BucketCountByEffectivePermission = S.suspend(() =>
  S.Struct({
    publiclyAccessible: S.optional(S.Number).pipe(
      T.JsonName("publiclyAccessible"),
    ),
    publiclyReadable: S.optional(S.Number).pipe(T.JsonName("publiclyReadable")),
    publiclyWritable: S.optional(S.Number).pipe(T.JsonName("publiclyWritable")),
    unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
  }),
).annotations({
  identifier: "BucketCountByEffectivePermission",
}) as any as S.Schema<BucketCountByEffectivePermission>;
export interface BucketCountByEncryptionType {
  kmsManaged?: number;
  s3Managed?: number;
  unencrypted?: number;
  unknown?: number;
}
export const BucketCountByEncryptionType = S.suspend(() =>
  S.Struct({
    kmsManaged: S.optional(S.Number).pipe(T.JsonName("kmsManaged")),
    s3Managed: S.optional(S.Number).pipe(T.JsonName("s3Managed")),
    unencrypted: S.optional(S.Number).pipe(T.JsonName("unencrypted")),
    unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
  }),
).annotations({
  identifier: "BucketCountByEncryptionType",
}) as any as S.Schema<BucketCountByEncryptionType>;
export interface BucketCountPolicyAllowsUnencryptedObjectUploads {
  allowsUnencryptedObjectUploads?: number;
  deniesUnencryptedObjectUploads?: number;
  unknown?: number;
}
export const BucketCountPolicyAllowsUnencryptedObjectUploads = S.suspend(() =>
  S.Struct({
    allowsUnencryptedObjectUploads: S.optional(S.Number).pipe(
      T.JsonName("allowsUnencryptedObjectUploads"),
    ),
    deniesUnencryptedObjectUploads: S.optional(S.Number).pipe(
      T.JsonName("deniesUnencryptedObjectUploads"),
    ),
    unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
  }),
).annotations({
  identifier: "BucketCountPolicyAllowsUnencryptedObjectUploads",
}) as any as S.Schema<BucketCountPolicyAllowsUnencryptedObjectUploads>;
export interface BucketCountBySharedAccessType {
  external?: number;
  internal?: number;
  notShared?: number;
  unknown?: number;
}
export const BucketCountBySharedAccessType = S.suspend(() =>
  S.Struct({
    external: S.optional(S.Number).pipe(T.JsonName("external")),
    internal: S.optional(S.Number).pipe(T.JsonName("internal")),
    notShared: S.optional(S.Number).pipe(T.JsonName("notShared")),
    unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
  }),
).annotations({
  identifier: "BucketCountBySharedAccessType",
}) as any as S.Schema<BucketCountBySharedAccessType>;
export interface ObjectLevelStatistics {
  fileType?: number;
  storageClass?: number;
  total?: number;
}
export const ObjectLevelStatistics = S.suspend(() =>
  S.Struct({
    fileType: S.optional(S.Number).pipe(T.JsonName("fileType")),
    storageClass: S.optional(S.Number).pipe(T.JsonName("storageClass")),
    total: S.optional(S.Number).pipe(T.JsonName("total")),
  }),
).annotations({
  identifier: "ObjectLevelStatistics",
}) as any as S.Schema<ObjectLevelStatistics>;
export interface ResourceStatistics {
  totalBytesClassified?: number;
  totalDetections?: number;
  totalDetectionsSuppressed?: number;
  totalItemsClassified?: number;
  totalItemsSensitive?: number;
  totalItemsSkipped?: number;
  totalItemsSkippedInvalidEncryption?: number;
  totalItemsSkippedInvalidKms?: number;
  totalItemsSkippedPermissionDenied?: number;
}
export const ResourceStatistics = S.suspend(() =>
  S.Struct({
    totalBytesClassified: S.optional(S.Number).pipe(
      T.JsonName("totalBytesClassified"),
    ),
    totalDetections: S.optional(S.Number).pipe(T.JsonName("totalDetections")),
    totalDetectionsSuppressed: S.optional(S.Number).pipe(
      T.JsonName("totalDetectionsSuppressed"),
    ),
    totalItemsClassified: S.optional(S.Number).pipe(
      T.JsonName("totalItemsClassified"),
    ),
    totalItemsSensitive: S.optional(S.Number).pipe(
      T.JsonName("totalItemsSensitive"),
    ),
    totalItemsSkipped: S.optional(S.Number).pipe(
      T.JsonName("totalItemsSkipped"),
    ),
    totalItemsSkippedInvalidEncryption: S.optional(S.Number).pipe(
      T.JsonName("totalItemsSkippedInvalidEncryption"),
    ),
    totalItemsSkippedInvalidKms: S.optional(S.Number).pipe(
      T.JsonName("totalItemsSkippedInvalidKms"),
    ),
    totalItemsSkippedPermissionDenied: S.optional(S.Number).pipe(
      T.JsonName("totalItemsSkippedPermissionDenied"),
    ),
  }),
).annotations({
  identifier: "ResourceStatistics",
}) as any as S.Schema<ResourceStatistics>;
export interface UsageTotal {
  currency?: Currency;
  estimatedCost?: string;
  type?: UsageType;
}
export const UsageTotal = S.suspend(() =>
  S.Struct({
    currency: S.optional(Currency).pipe(T.JsonName("currency")),
    estimatedCost: S.optional(S.String).pipe(T.JsonName("estimatedCost")),
    type: S.optional(UsageType).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "UsageTotal" }) as any as S.Schema<UsageTotal>;
export type __listOfUsageTotal = UsageTotal[];
export const __listOfUsageTotal = S.Array(UsageTotal);
export interface AllowListSummary {
  arn?: string;
  createdAt?: Date;
  description?: string;
  id?: string;
  name?: string;
  updatedAt?: Date;
}
export const AllowListSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "AllowListSummary",
}) as any as S.Schema<AllowListSummary>;
export type __listOfAllowListSummary = AllowListSummary[];
export const __listOfAllowListSummary = S.Array(AllowListSummary);
export interface AutomatedDiscoveryAccount {
  accountId?: string;
  status?: AutomatedDiscoveryAccountStatus;
}
export const AutomatedDiscoveryAccount = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    status: S.optional(AutomatedDiscoveryAccountStatus).pipe(
      T.JsonName("status"),
    ),
  }),
).annotations({
  identifier: "AutomatedDiscoveryAccount",
}) as any as S.Schema<AutomatedDiscoveryAccount>;
export type __listOfAutomatedDiscoveryAccount = AutomatedDiscoveryAccount[];
export const __listOfAutomatedDiscoveryAccount = S.Array(
  AutomatedDiscoveryAccount,
);
export interface ListJobsFilterCriteria {
  excludes?: ListJobsFilterTerm[];
  includes?: ListJobsFilterTerm[];
}
export const ListJobsFilterCriteria = S.suspend(() =>
  S.Struct({
    excludes: S.optional(__listOfListJobsFilterTerm).pipe(
      T.JsonName("excludes"),
    ),
    includes: S.optional(__listOfListJobsFilterTerm).pipe(
      T.JsonName("includes"),
    ),
  }),
).annotations({
  identifier: "ListJobsFilterCriteria",
}) as any as S.Schema<ListJobsFilterCriteria>;
export interface ClassificationScopeSummary {
  id?: string;
  name?: string;
}
export const ClassificationScopeSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "ClassificationScopeSummary",
}) as any as S.Schema<ClassificationScopeSummary>;
export type __listOfClassificationScopeSummary = ClassificationScopeSummary[];
export const __listOfClassificationScopeSummary = S.Array(
  ClassificationScopeSummary,
);
export interface CustomDataIdentifierSummary {
  arn?: string;
  createdAt?: Date;
  description?: string;
  id?: string;
  name?: string;
}
export const CustomDataIdentifierSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "CustomDataIdentifierSummary",
}) as any as S.Schema<CustomDataIdentifierSummary>;
export type __listOfCustomDataIdentifierSummary = CustomDataIdentifierSummary[];
export const __listOfCustomDataIdentifierSummary = S.Array(
  CustomDataIdentifierSummary,
);
export interface FindingsFilterListItem {
  action?: FindingsFilterAction;
  arn?: string;
  id?: string;
  name?: string;
  tags?: { [key: string]: string | undefined };
}
export const FindingsFilterListItem = S.suspend(() =>
  S.Struct({
    action: S.optional(FindingsFilterAction).pipe(T.JsonName("action")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }),
).annotations({
  identifier: "FindingsFilterListItem",
}) as any as S.Schema<FindingsFilterListItem>;
export type __listOfFindingsFilterListItem = FindingsFilterListItem[];
export const __listOfFindingsFilterListItem = S.Array(FindingsFilterListItem);
export interface ManagedDataIdentifierSummary {
  category?: SensitiveDataItemCategory;
  id?: string;
}
export const ManagedDataIdentifierSummary = S.suspend(() =>
  S.Struct({
    category: S.optional(SensitiveDataItemCategory).pipe(
      T.JsonName("category"),
    ),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "ManagedDataIdentifierSummary",
}) as any as S.Schema<ManagedDataIdentifierSummary>;
export type __listOfManagedDataIdentifierSummary =
  ManagedDataIdentifierSummary[];
export const __listOfManagedDataIdentifierSummary = S.Array(
  ManagedDataIdentifierSummary,
);
export interface Member {
  accountId?: string;
  administratorAccountId?: string;
  arn?: string;
  email?: string;
  invitedAt?: Date;
  masterAccountId?: string;
  relationshipStatus?: RelationshipStatus;
  tags?: { [key: string]: string | undefined };
  updatedAt?: Date;
}
export const Member = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    administratorAccountId: S.optional(S.String).pipe(
      T.JsonName("administratorAccountId"),
    ),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    email: S.optional(S.String).pipe(T.JsonName("email")),
    invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("invitedAt"),
    ),
    masterAccountId: S.optional(S.String).pipe(T.JsonName("masterAccountId")),
    relationshipStatus: S.optional(RelationshipStatus).pipe(
      T.JsonName("relationshipStatus"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export type __listOfMember = Member[];
export const __listOfMember = S.Array(Member);
export interface AdminAccount {
  accountId?: string;
  status?: AdminStatus;
}
export const AdminAccount = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    status: S.optional(AdminStatus).pipe(T.JsonName("status")),
  }),
).annotations({ identifier: "AdminAccount" }) as any as S.Schema<AdminAccount>;
export type __listOfAdminAccount = AdminAccount[];
export const __listOfAdminAccount = S.Array(AdminAccount);
export interface ResourceProfileArtifact {
  arn?: string;
  classificationResultStatus?: string;
  sensitive?: boolean;
}
export const ResourceProfileArtifact = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    classificationResultStatus: S.optional(S.String).pipe(
      T.JsonName("classificationResultStatus"),
    ),
    sensitive: S.optional(S.Boolean).pipe(T.JsonName("sensitive")),
  }),
).annotations({
  identifier: "ResourceProfileArtifact",
}) as any as S.Schema<ResourceProfileArtifact>;
export type __listOfResourceProfileArtifact = ResourceProfileArtifact[];
export const __listOfResourceProfileArtifact = S.Array(ResourceProfileArtifact);
export interface Detection {
  arn?: string;
  count?: number;
  id?: string;
  name?: string;
  suppressed?: boolean;
  type?: DataIdentifierType;
}
export const Detection = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    count: S.optional(S.Number).pipe(T.JsonName("count")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    suppressed: S.optional(S.Boolean).pipe(T.JsonName("suppressed")),
    type: S.optional(DataIdentifierType).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "Detection" }) as any as S.Schema<Detection>;
export type __listOfDetection = Detection[];
export const __listOfDetection = S.Array(Detection);
export interface SensitivityInspectionTemplatesEntry {
  id?: string;
  name?: string;
}
export const SensitivityInspectionTemplatesEntry = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({
  identifier: "SensitivityInspectionTemplatesEntry",
}) as any as S.Schema<SensitivityInspectionTemplatesEntry>;
export type __listOfSensitivityInspectionTemplatesEntry =
  SensitivityInspectionTemplatesEntry[];
export const __listOfSensitivityInspectionTemplatesEntry = S.Array(
  SensitivityInspectionTemplatesEntry,
);
export interface S3ClassificationScopeUpdate {
  excludes?: S3ClassificationScopeExclusionUpdate;
}
export const S3ClassificationScopeUpdate = S.suspend(() =>
  S.Struct({
    excludes: S.optional(S3ClassificationScopeExclusionUpdate)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "S3ClassificationScopeExclusionUpdate" }),
  }),
).annotations({
  identifier: "S3ClassificationScopeUpdate",
}) as any as S.Schema<S3ClassificationScopeUpdate>;
export interface BatchGetCustomDataIdentifiersResponse {
  customDataIdentifiers?: BatchGetCustomDataIdentifierSummary[];
  notFoundIdentifierIds?: string[];
}
export const BatchGetCustomDataIdentifiersResponse = S.suspend(() =>
  S.Struct({
    customDataIdentifiers: S.optional(
      __listOfBatchGetCustomDataIdentifierSummary,
    ).pipe(T.JsonName("customDataIdentifiers")),
    notFoundIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("notFoundIdentifierIds"),
    ),
  }),
).annotations({
  identifier: "BatchGetCustomDataIdentifiersResponse",
}) as any as S.Schema<BatchGetCustomDataIdentifiersResponse>;
export interface CreateAllowListRequest {
  clientToken?: string;
  criteria?: AllowListCriteria;
  description?: string;
  name?: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateAllowListRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    criteria: S.optional(AllowListCriteria)
      .pipe(T.JsonName("criteria"))
      .annotations({ identifier: "AllowListCriteria" }),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/allow-lists" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAllowListRequest",
}) as any as S.Schema<CreateAllowListRequest>;
export interface CreateCustomDataIdentifierResponse {
  customDataIdentifierId?: string;
}
export const CreateCustomDataIdentifierResponse = S.suspend(() =>
  S.Struct({
    customDataIdentifierId: S.optional(S.String).pipe(
      T.JsonName("customDataIdentifierId"),
    ),
  }),
).annotations({
  identifier: "CreateCustomDataIdentifierResponse",
}) as any as S.Schema<CreateCustomDataIdentifierResponse>;
export interface CreateInvitationsResponse {
  unprocessedAccounts?: UnprocessedAccount[];
}
export const CreateInvitationsResponse = S.suspend(() =>
  S.Struct({
    unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
      T.JsonName("unprocessedAccounts"),
    ),
  }),
).annotations({
  identifier: "CreateInvitationsResponse",
}) as any as S.Schema<CreateInvitationsResponse>;
export interface CreateMemberResponse {
  arn?: string;
}
export const CreateMemberResponse = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String).pipe(T.JsonName("arn")) }),
).annotations({
  identifier: "CreateMemberResponse",
}) as any as S.Schema<CreateMemberResponse>;
export interface DescribeBucketsRequest {
  criteria?: { [key: string]: BucketCriteriaAdditionalProperties | undefined };
  maxResults?: number;
  nextToken?: string;
  sortCriteria?: BucketSortCriteria;
}
export const DescribeBucketsRequest = S.suspend(() =>
  S.Struct({
    criteria: S.optional(BucketCriteria).pipe(T.JsonName("criteria")),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(BucketSortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "BucketSortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasources/s3" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBucketsRequest",
}) as any as S.Schema<DescribeBucketsRequest>;
export type SimpleCriterionKeyForJob =
  | "ACCOUNT_ID"
  | "S3_BUCKET_NAME"
  | "S3_BUCKET_EFFECTIVE_PERMISSION"
  | "S3_BUCKET_SHARED_ACCESS"
  | (string & {});
export const SimpleCriterionKeyForJob = S.String;
export interface SimpleCriterionForJob {
  comparator?: JobComparator;
  key?: SimpleCriterionKeyForJob;
  values?: string[];
}
export const SimpleCriterionForJob = S.suspend(() =>
  S.Struct({
    comparator: S.optional(JobComparator).pipe(T.JsonName("comparator")),
    key: S.optional(SimpleCriterionKeyForJob).pipe(T.JsonName("key")),
    values: S.optional(__listOf__string).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "SimpleCriterionForJob",
}) as any as S.Schema<SimpleCriterionForJob>;
export interface TagCriterionPairForJob {
  key?: string;
  value?: string;
}
export const TagCriterionPairForJob = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String).pipe(T.JsonName("key")),
    value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({
  identifier: "TagCriterionPairForJob",
}) as any as S.Schema<TagCriterionPairForJob>;
export type __listOfTagCriterionPairForJob = TagCriterionPairForJob[];
export const __listOfTagCriterionPairForJob = S.Array(TagCriterionPairForJob);
export interface TagCriterionForJob {
  comparator?: JobComparator;
  tagValues?: TagCriterionPairForJob[];
}
export const TagCriterionForJob = S.suspend(() =>
  S.Struct({
    comparator: S.optional(JobComparator).pipe(T.JsonName("comparator")),
    tagValues: S.optional(__listOfTagCriterionPairForJob).pipe(
      T.JsonName("tagValues"),
    ),
  }),
).annotations({
  identifier: "TagCriterionForJob",
}) as any as S.Schema<TagCriterionForJob>;
export interface CriteriaForJob {
  simpleCriterion?: SimpleCriterionForJob;
  tagCriterion?: TagCriterionForJob;
}
export const CriteriaForJob = S.suspend(() =>
  S.Struct({
    simpleCriterion: S.optional(SimpleCriterionForJob)
      .pipe(T.JsonName("simpleCriterion"))
      .annotations({ identifier: "SimpleCriterionForJob" }),
    tagCriterion: S.optional(TagCriterionForJob)
      .pipe(T.JsonName("tagCriterion"))
      .annotations({ identifier: "TagCriterionForJob" }),
  }),
).annotations({
  identifier: "CriteriaForJob",
}) as any as S.Schema<CriteriaForJob>;
export type __listOfCriteriaForJob = CriteriaForJob[];
export const __listOfCriteriaForJob = S.Array(CriteriaForJob);
export interface CriteriaBlockForJob {
  and?: CriteriaForJob[];
}
export const CriteriaBlockForJob = S.suspend(() =>
  S.Struct({ and: S.optional(__listOfCriteriaForJob).pipe(T.JsonName("and")) }),
).annotations({
  identifier: "CriteriaBlockForJob",
}) as any as S.Schema<CriteriaBlockForJob>;
export interface S3BucketCriteriaForJob {
  excludes?: CriteriaBlockForJob;
  includes?: CriteriaBlockForJob;
}
export const S3BucketCriteriaForJob = S.suspend(() =>
  S.Struct({
    excludes: S.optional(CriteriaBlockForJob)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "CriteriaBlockForJob" }),
    includes: S.optional(CriteriaBlockForJob)
      .pipe(T.JsonName("includes"))
      .annotations({ identifier: "CriteriaBlockForJob" }),
  }),
).annotations({
  identifier: "S3BucketCriteriaForJob",
}) as any as S.Schema<S3BucketCriteriaForJob>;
export type ScopeFilterKey =
  | "OBJECT_EXTENSION"
  | "OBJECT_LAST_MODIFIED_DATE"
  | "OBJECT_SIZE"
  | "OBJECT_KEY"
  | (string & {});
export const ScopeFilterKey = S.String;
export interface SimpleScopeTerm {
  comparator?: JobComparator;
  key?: ScopeFilterKey;
  values?: string[];
}
export const SimpleScopeTerm = S.suspend(() =>
  S.Struct({
    comparator: S.optional(JobComparator).pipe(T.JsonName("comparator")),
    key: S.optional(ScopeFilterKey).pipe(T.JsonName("key")),
    values: S.optional(__listOf__string).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "SimpleScopeTerm",
}) as any as S.Schema<SimpleScopeTerm>;
export interface TagValuePair {
  key?: string;
  value?: string;
}
export const TagValuePair = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String).pipe(T.JsonName("key")),
    value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({ identifier: "TagValuePair" }) as any as S.Schema<TagValuePair>;
export type __listOfTagValuePair = TagValuePair[];
export const __listOfTagValuePair = S.Array(TagValuePair);
export type TagTarget = "S3_OBJECT" | (string & {});
export const TagTarget = S.String;
export interface TagScopeTerm {
  comparator?: JobComparator;
  key?: string;
  tagValues?: TagValuePair[];
  target?: TagTarget;
}
export const TagScopeTerm = S.suspend(() =>
  S.Struct({
    comparator: S.optional(JobComparator).pipe(T.JsonName("comparator")),
    key: S.optional(S.String).pipe(T.JsonName("key")),
    tagValues: S.optional(__listOfTagValuePair).pipe(T.JsonName("tagValues")),
    target: S.optional(TagTarget).pipe(T.JsonName("target")),
  }),
).annotations({ identifier: "TagScopeTerm" }) as any as S.Schema<TagScopeTerm>;
export interface JobScopeTerm {
  simpleScopeTerm?: SimpleScopeTerm;
  tagScopeTerm?: TagScopeTerm;
}
export const JobScopeTerm = S.suspend(() =>
  S.Struct({
    simpleScopeTerm: S.optional(SimpleScopeTerm)
      .pipe(T.JsonName("simpleScopeTerm"))
      .annotations({ identifier: "SimpleScopeTerm" }),
    tagScopeTerm: S.optional(TagScopeTerm)
      .pipe(T.JsonName("tagScopeTerm"))
      .annotations({ identifier: "TagScopeTerm" }),
  }),
).annotations({ identifier: "JobScopeTerm" }) as any as S.Schema<JobScopeTerm>;
export type __listOfJobScopeTerm = JobScopeTerm[];
export const __listOfJobScopeTerm = S.Array(JobScopeTerm);
export interface JobScopingBlock {
  and?: JobScopeTerm[];
}
export const JobScopingBlock = S.suspend(() =>
  S.Struct({ and: S.optional(__listOfJobScopeTerm).pipe(T.JsonName("and")) }),
).annotations({
  identifier: "JobScopingBlock",
}) as any as S.Schema<JobScopingBlock>;
export interface Scoping {
  excludes?: JobScopingBlock;
  includes?: JobScopingBlock;
}
export const Scoping = S.suspend(() =>
  S.Struct({
    excludes: S.optional(JobScopingBlock)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "JobScopingBlock" }),
    includes: S.optional(JobScopingBlock)
      .pipe(T.JsonName("includes"))
      .annotations({ identifier: "JobScopingBlock" }),
  }),
).annotations({ identifier: "Scoping" }) as any as S.Schema<Scoping>;
export interface S3JobDefinition {
  bucketCriteria?: S3BucketCriteriaForJob;
  bucketDefinitions?: S3BucketDefinitionForJob[];
  scoping?: Scoping;
}
export const S3JobDefinition = S.suspend(() =>
  S.Struct({
    bucketCriteria: S.optional(S3BucketCriteriaForJob)
      .pipe(T.JsonName("bucketCriteria"))
      .annotations({ identifier: "S3BucketCriteriaForJob" }),
    bucketDefinitions: S.optional(__listOfS3BucketDefinitionForJob).pipe(
      T.JsonName("bucketDefinitions"),
    ),
    scoping: S.optional(Scoping)
      .pipe(T.JsonName("scoping"))
      .annotations({ identifier: "Scoping" }),
  }),
).annotations({
  identifier: "S3JobDefinition",
}) as any as S.Schema<S3JobDefinition>;
export interface DescribeClassificationJobResponse {
  allowListIds?: string[];
  clientToken?: string;
  createdAt?: Date;
  customDataIdentifierIds?: string[];
  description?: string;
  initialRun?: boolean;
  jobArn?: string;
  jobId?: string;
  jobStatus?: JobStatus;
  jobType?: JobType;
  lastRunErrorStatus?: LastRunErrorStatus;
  lastRunTime?: Date;
  managedDataIdentifierIds?: string[];
  managedDataIdentifierSelector?: ManagedDataIdentifierSelector;
  name?: string;
  s3JobDefinition?: S3JobDefinition & {
    bucketDefinitions: (S3BucketDefinitionForJob & {
      accountId: string;
      buckets: __listOf__string;
    })[];
  };
  samplingPercentage?: number;
  scheduleFrequency?: JobScheduleFrequency;
  statistics?: Statistics;
  tags?: { [key: string]: string | undefined };
  userPausedDetails?: UserPausedDetails;
}
export const DescribeClassificationJobResponse = S.suspend(() =>
  S.Struct({
    allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    customDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("customDataIdentifierIds"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    initialRun: S.optional(S.Boolean).pipe(T.JsonName("initialRun")),
    jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
    jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    jobStatus: S.optional(JobStatus).pipe(T.JsonName("jobStatus")),
    jobType: S.optional(JobType).pipe(T.JsonName("jobType")),
    lastRunErrorStatus: S.optional(LastRunErrorStatus)
      .pipe(T.JsonName("lastRunErrorStatus"))
      .annotations({ identifier: "LastRunErrorStatus" }),
    lastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastRunTime"),
    ),
    managedDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("managedDataIdentifierIds"),
    ),
    managedDataIdentifierSelector: S.optional(
      ManagedDataIdentifierSelector,
    ).pipe(T.JsonName("managedDataIdentifierSelector")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    s3JobDefinition: S.optional(S3JobDefinition)
      .pipe(T.JsonName("s3JobDefinition"))
      .annotations({ identifier: "S3JobDefinition" }),
    samplingPercentage: S.optional(S.Number).pipe(
      T.JsonName("samplingPercentage"),
    ),
    scheduleFrequency: S.optional(JobScheduleFrequency)
      .pipe(T.JsonName("scheduleFrequency"))
      .annotations({ identifier: "JobScheduleFrequency" }),
    statistics: S.optional(Statistics)
      .pipe(T.JsonName("statistics"))
      .annotations({ identifier: "Statistics" }),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    userPausedDetails: S.optional(UserPausedDetails)
      .pipe(T.JsonName("userPausedDetails"))
      .annotations({ identifier: "UserPausedDetails" }),
  }),
).annotations({
  identifier: "DescribeClassificationJobResponse",
}) as any as S.Schema<DescribeClassificationJobResponse>;
export interface GetAllowListResponse {
  arn?: string;
  createdAt?: Date;
  criteria?: AllowListCriteria & {
    s3WordsList: S3WordsList & {
      bucketName: __stringMin3Max255PatternAZaZ093255;
      objectKey: __stringMin1Max1024PatternSS;
    };
  };
  description?: string;
  id?: string;
  name?: string;
  status?: AllowListStatus & { code: AllowListStatusCode };
  tags?: { [key: string]: string | undefined };
  updatedAt?: Date;
}
export const GetAllowListResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    criteria: S.optional(AllowListCriteria)
      .pipe(T.JsonName("criteria"))
      .annotations({ identifier: "AllowListCriteria" }),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    status: S.optional(AllowListStatus)
      .pipe(T.JsonName("status"))
      .annotations({ identifier: "AllowListStatus" }),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({
  identifier: "GetAllowListResponse",
}) as any as S.Schema<GetAllowListResponse>;
export interface GetClassificationExportConfigurationResponse {
  configuration?: ClassificationExportConfiguration & {
    s3Destination: S3Destination & { bucketName: string; kmsKeyArn: string };
  };
}
export const GetClassificationExportConfigurationResponse = S.suspend(() =>
  S.Struct({
    configuration: S.optional(ClassificationExportConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "ClassificationExportConfiguration" }),
  }),
).annotations({
  identifier: "GetClassificationExportConfigurationResponse",
}) as any as S.Schema<GetClassificationExportConfigurationResponse>;
export interface GetResourceProfileResponse {
  profileUpdatedAt?: Date;
  sensitivityScore?: number;
  sensitivityScoreOverridden?: boolean;
  statistics?: ResourceStatistics;
}
export const GetResourceProfileResponse = S.suspend(() =>
  S.Struct({
    profileUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("profileUpdatedAt")),
    sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
    sensitivityScoreOverridden: S.optional(S.Boolean).pipe(
      T.JsonName("sensitivityScoreOverridden"),
    ),
    statistics: S.optional(ResourceStatistics)
      .pipe(T.JsonName("statistics"))
      .annotations({ identifier: "ResourceStatistics" }),
  }),
).annotations({
  identifier: "GetResourceProfileResponse",
}) as any as S.Schema<GetResourceProfileResponse>;
export interface GetUsageTotalsResponse {
  timeRange?: TimeRange;
  usageTotals?: UsageTotal[];
}
export const GetUsageTotalsResponse = S.suspend(() =>
  S.Struct({
    timeRange: S.optional(TimeRange).pipe(T.JsonName("timeRange")),
    usageTotals: S.optional(__listOfUsageTotal).pipe(T.JsonName("usageTotals")),
  }),
).annotations({
  identifier: "GetUsageTotalsResponse",
}) as any as S.Schema<GetUsageTotalsResponse>;
export interface ListAllowListsResponse {
  allowLists?: AllowListSummary[];
  nextToken?: string;
}
export const ListAllowListsResponse = S.suspend(() =>
  S.Struct({
    allowLists: S.optional(__listOfAllowListSummary).pipe(
      T.JsonName("allowLists"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListAllowListsResponse",
}) as any as S.Schema<ListAllowListsResponse>;
export interface ListAutomatedDiscoveryAccountsResponse {
  items?: AutomatedDiscoveryAccount[];
  nextToken?: string;
}
export const ListAutomatedDiscoveryAccountsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(__listOfAutomatedDiscoveryAccount).pipe(
      T.JsonName("items"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListAutomatedDiscoveryAccountsResponse",
}) as any as S.Schema<ListAutomatedDiscoveryAccountsResponse>;
export interface ListClassificationJobsRequest {
  filterCriteria?: ListJobsFilterCriteria;
  maxResults?: number;
  nextToken?: string;
  sortCriteria?: ListJobsSortCriteria;
}
export const ListClassificationJobsRequest = S.suspend(() =>
  S.Struct({
    filterCriteria: S.optional(ListJobsFilterCriteria)
      .pipe(T.JsonName("filterCriteria"))
      .annotations({ identifier: "ListJobsFilterCriteria" }),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(ListJobsSortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "ListJobsSortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClassificationJobsRequest",
}) as any as S.Schema<ListClassificationJobsRequest>;
export interface ListClassificationScopesResponse {
  classificationScopes?: ClassificationScopeSummary[];
  nextToken?: string;
}
export const ListClassificationScopesResponse = S.suspend(() =>
  S.Struct({
    classificationScopes: S.optional(__listOfClassificationScopeSummary).pipe(
      T.JsonName("classificationScopes"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClassificationScopesResponse",
}) as any as S.Schema<ListClassificationScopesResponse>;
export interface ListCustomDataIdentifiersResponse {
  items?: CustomDataIdentifierSummary[];
  nextToken?: string;
}
export const ListCustomDataIdentifiersResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(__listOfCustomDataIdentifierSummary).pipe(
      T.JsonName("items"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListCustomDataIdentifiersResponse",
}) as any as S.Schema<ListCustomDataIdentifiersResponse>;
export interface ListFindingsFiltersResponse {
  findingsFilterListItems?: FindingsFilterListItem[];
  nextToken?: string;
}
export const ListFindingsFiltersResponse = S.suspend(() =>
  S.Struct({
    findingsFilterListItems: S.optional(__listOfFindingsFilterListItem).pipe(
      T.JsonName("findingsFilterListItems"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListFindingsFiltersResponse",
}) as any as S.Schema<ListFindingsFiltersResponse>;
export interface ListManagedDataIdentifiersResponse {
  items?: ManagedDataIdentifierSummary[];
  nextToken?: string;
}
export const ListManagedDataIdentifiersResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(__listOfManagedDataIdentifierSummary).pipe(
      T.JsonName("items"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListManagedDataIdentifiersResponse",
}) as any as S.Schema<ListManagedDataIdentifiersResponse>;
export interface ListMembersResponse {
  members?: Member[];
  nextToken?: string;
}
export const ListMembersResponse = S.suspend(() =>
  S.Struct({
    members: S.optional(__listOfMember).pipe(T.JsonName("members")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListMembersResponse",
}) as any as S.Schema<ListMembersResponse>;
export interface ListOrganizationAdminAccountsResponse {
  adminAccounts?: AdminAccount[];
  nextToken?: string;
}
export const ListOrganizationAdminAccountsResponse = S.suspend(() =>
  S.Struct({
    adminAccounts: S.optional(__listOfAdminAccount).pipe(
      T.JsonName("adminAccounts"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListOrganizationAdminAccountsResponse",
}) as any as S.Schema<ListOrganizationAdminAccountsResponse>;
export interface ListResourceProfileArtifactsResponse {
  artifacts?: (ResourceProfileArtifact & {
    arn: string;
    classificationResultStatus: string;
  })[];
  nextToken?: string;
}
export const ListResourceProfileArtifactsResponse = S.suspend(() =>
  S.Struct({
    artifacts: S.optional(__listOfResourceProfileArtifact).pipe(
      T.JsonName("artifacts"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListResourceProfileArtifactsResponse",
}) as any as S.Schema<ListResourceProfileArtifactsResponse>;
export interface ListResourceProfileDetectionsResponse {
  detections?: Detection[];
  nextToken?: string;
}
export const ListResourceProfileDetectionsResponse = S.suspend(() =>
  S.Struct({
    detections: S.optional(__listOfDetection).pipe(T.JsonName("detections")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListResourceProfileDetectionsResponse",
}) as any as S.Schema<ListResourceProfileDetectionsResponse>;
export interface ListSensitivityInspectionTemplatesResponse {
  nextToken?: string;
  sensitivityInspectionTemplates?: SensitivityInspectionTemplatesEntry[];
}
export const ListSensitivityInspectionTemplatesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sensitivityInspectionTemplates: S.optional(
      __listOfSensitivityInspectionTemplatesEntry,
    ).pipe(T.JsonName("sensitivityInspectionTemplates")),
  }),
).annotations({
  identifier: "ListSensitivityInspectionTemplatesResponse",
}) as any as S.Schema<ListSensitivityInspectionTemplatesResponse>;
export type SearchResourcesComparator = "EQ" | "NE" | (string & {});
export const SearchResourcesComparator = S.String;
export type SearchResourcesSimpleCriterionKey =
  | "ACCOUNT_ID"
  | "S3_BUCKET_NAME"
  | "S3_BUCKET_EFFECTIVE_PERMISSION"
  | "S3_BUCKET_SHARED_ACCESS"
  | "AUTOMATED_DISCOVERY_MONITORING_STATUS"
  | (string & {});
export const SearchResourcesSimpleCriterionKey = S.String;
export interface UpdateClassificationScopeRequest {
  id: string;
  s3?: S3ClassificationScopeUpdate;
}
export const UpdateClassificationScopeRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    s3: S.optional(S3ClassificationScopeUpdate)
      .pipe(T.JsonName("s3"))
      .annotations({ identifier: "S3ClassificationScopeUpdate" }),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/classification-scopes/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClassificationScopeRequest",
}) as any as S.Schema<UpdateClassificationScopeRequest>;
export interface UpdateClassificationScopeResponse {}
export const UpdateClassificationScopeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateClassificationScopeResponse",
}) as any as S.Schema<UpdateClassificationScopeResponse>;
export interface UpdateRevealConfigurationResponse {
  configuration?: RevealConfiguration & { status: RevealStatus };
  retrievalConfiguration?: RetrievalConfiguration & {
    retrievalMode: RetrievalMode;
  };
}
export const UpdateRevealConfigurationResponse = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RevealConfiguration)
      .pipe(T.JsonName("configuration"))
      .annotations({ identifier: "RevealConfiguration" }),
    retrievalConfiguration: S.optional(RetrievalConfiguration)
      .pipe(T.JsonName("retrievalConfiguration"))
      .annotations({ identifier: "RetrievalConfiguration" }),
  }),
).annotations({
  identifier: "UpdateRevealConfigurationResponse",
}) as any as S.Schema<UpdateRevealConfigurationResponse>;
export type AutomatedDiscoveryAccountUpdateErrorCode =
  | "ACCOUNT_PAUSED"
  | "ACCOUNT_NOT_FOUND"
  | (string & {});
export const AutomatedDiscoveryAccountUpdateErrorCode = S.String;
export interface SensitivityAggregations {
  classifiableSizeInBytes?: number;
  publiclyAccessibleCount?: number;
  totalCount?: number;
  totalSizeInBytes?: number;
}
export const SensitivityAggregations = S.suspend(() =>
  S.Struct({
    classifiableSizeInBytes: S.optional(S.Number).pipe(
      T.JsonName("classifiableSizeInBytes"),
    ),
    publiclyAccessibleCount: S.optional(S.Number).pipe(
      T.JsonName("publiclyAccessibleCount"),
    ),
    totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
    totalSizeInBytes: S.optional(S.Number).pipe(T.JsonName("totalSizeInBytes")),
  }),
).annotations({
  identifier: "SensitivityAggregations",
}) as any as S.Schema<SensitivityAggregations>;
export interface S3ClassificationScopeExclusion {
  bucketNames?: string[];
}
export const S3ClassificationScopeExclusion = S.suspend(() =>
  S.Struct({
    bucketNames: S.optional(__listOfS3BucketName).pipe(
      T.JsonName("bucketNames"),
    ),
  }),
).annotations({
  identifier: "S3ClassificationScopeExclusion",
}) as any as S.Schema<S3ClassificationScopeExclusion>;
export type FindingCategory = "CLASSIFICATION" | "POLICY" | (string & {});
export const FindingCategory = S.String;
export interface DetectedDataDetails {
  value?: string;
}
export const DetectedDataDetails = S.suspend(() =>
  S.Struct({ value: S.optional(S.String).pipe(T.JsonName("value")) }),
).annotations({
  identifier: "DetectedDataDetails",
}) as any as S.Schema<DetectedDataDetails>;
export type __listOfDetectedDataDetails = DetectedDataDetails[];
export const __listOfDetectedDataDetails = S.Array(DetectedDataDetails);
export interface SearchResourcesSimpleCriterion {
  comparator?: SearchResourcesComparator;
  key?: SearchResourcesSimpleCriterionKey;
  values?: string[];
}
export const SearchResourcesSimpleCriterion = S.suspend(() =>
  S.Struct({
    comparator: S.optional(SearchResourcesComparator).pipe(
      T.JsonName("comparator"),
    ),
    key: S.optional(SearchResourcesSimpleCriterionKey).pipe(T.JsonName("key")),
    values: S.optional(__listOf__string).pipe(T.JsonName("values")),
  }),
).annotations({
  identifier: "SearchResourcesSimpleCriterion",
}) as any as S.Schema<SearchResourcesSimpleCriterion>;
export interface AutomatedDiscoveryAccountUpdateError {
  accountId?: string;
  errorCode?: AutomatedDiscoveryAccountUpdateErrorCode;
}
export const AutomatedDiscoveryAccountUpdateError = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    errorCode: S.optional(AutomatedDiscoveryAccountUpdateErrorCode).pipe(
      T.JsonName("errorCode"),
    ),
  }),
).annotations({
  identifier: "AutomatedDiscoveryAccountUpdateError",
}) as any as S.Schema<AutomatedDiscoveryAccountUpdateError>;
export type __listOfAutomatedDiscoveryAccountUpdateError =
  AutomatedDiscoveryAccountUpdateError[];
export const __listOfAutomatedDiscoveryAccountUpdateError = S.Array(
  AutomatedDiscoveryAccountUpdateError,
);
export interface BucketStatisticsBySensitivity {
  classificationError?: SensitivityAggregations;
  notClassified?: SensitivityAggregations;
  notSensitive?: SensitivityAggregations;
  sensitive?: SensitivityAggregations;
}
export const BucketStatisticsBySensitivity = S.suspend(() =>
  S.Struct({
    classificationError: S.optional(SensitivityAggregations)
      .pipe(T.JsonName("classificationError"))
      .annotations({ identifier: "SensitivityAggregations" }),
    notClassified: S.optional(SensitivityAggregations)
      .pipe(T.JsonName("notClassified"))
      .annotations({ identifier: "SensitivityAggregations" }),
    notSensitive: S.optional(SensitivityAggregations)
      .pipe(T.JsonName("notSensitive"))
      .annotations({ identifier: "SensitivityAggregations" }),
    sensitive: S.optional(SensitivityAggregations)
      .pipe(T.JsonName("sensitive"))
      .annotations({ identifier: "SensitivityAggregations" }),
  }),
).annotations({
  identifier: "BucketStatisticsBySensitivity",
}) as any as S.Schema<BucketStatisticsBySensitivity>;
export interface S3ClassificationScope {
  excludes?: S3ClassificationScopeExclusion;
}
export const S3ClassificationScope = S.suspend(() =>
  S.Struct({
    excludes: S.optional(S3ClassificationScopeExclusion)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "S3ClassificationScopeExclusion" }),
  }),
).annotations({
  identifier: "S3ClassificationScope",
}) as any as S.Schema<S3ClassificationScope>;
export interface GroupCount {
  count?: number;
  groupKey?: string;
}
export const GroupCount = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number).pipe(T.JsonName("count")),
    groupKey: S.optional(S.String).pipe(T.JsonName("groupKey")),
  }),
).annotations({ identifier: "GroupCount" }) as any as S.Schema<GroupCount>;
export type __listOfGroupCount = GroupCount[];
export const __listOfGroupCount = S.Array(GroupCount);
export type SensitiveDataOccurrences = {
  [key: string]: DetectedDataDetails[] | undefined;
};
export const SensitiveDataOccurrences = S.Record({
  key: S.String,
  value: S.UndefinedOr(__listOfDetectedDataDetails),
});
export type OriginType =
  | "SENSITIVE_DATA_DISCOVERY_JOB"
  | "AUTOMATED_SENSITIVE_DATA_DISCOVERY"
  | (string & {});
export const OriginType = S.String;
export type SeverityDescription = "Low" | "Medium" | "High" | (string & {});
export const SeverityDescription = S.String;
export interface BatchUpdateAutomatedDiscoveryAccountsResponse {
  errors?: AutomatedDiscoveryAccountUpdateError[];
}
export const BatchUpdateAutomatedDiscoveryAccountsResponse = S.suspend(() =>
  S.Struct({
    errors: S.optional(__listOfAutomatedDiscoveryAccountUpdateError).pipe(
      T.JsonName("errors"),
    ),
  }),
).annotations({
  identifier: "BatchUpdateAutomatedDiscoveryAccountsResponse",
}) as any as S.Schema<BatchUpdateAutomatedDiscoveryAccountsResponse>;
export interface CreateAllowListResponse {
  arn?: string;
  id?: string;
}
export const CreateAllowListResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "CreateAllowListResponse",
}) as any as S.Schema<CreateAllowListResponse>;
export interface CreateFindingsFilterRequest {
  action?: FindingsFilterAction;
  clientToken?: string;
  description?: string;
  findingCriteria?: FindingCriteria;
  name?: string;
  position?: number;
  tags?: { [key: string]: string | undefined };
}
export const CreateFindingsFilterRequest = S.suspend(() =>
  S.Struct({
    action: S.optional(FindingsFilterAction).pipe(T.JsonName("action")),
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    findingCriteria: S.optional(FindingCriteria)
      .pipe(T.JsonName("findingCriteria"))
      .annotations({ identifier: "FindingCriteria" }),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    position: S.optional(S.Number).pipe(T.JsonName("position")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/findingsfilters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFindingsFilterRequest",
}) as any as S.Schema<CreateFindingsFilterRequest>;
export interface GetBucketStatisticsResponse {
  bucketCount?: number;
  bucketCountByEffectivePermission?: BucketCountByEffectivePermission;
  bucketCountByEncryptionType?: BucketCountByEncryptionType;
  bucketCountByObjectEncryptionRequirement?: BucketCountPolicyAllowsUnencryptedObjectUploads;
  bucketCountBySharedAccessType?: BucketCountBySharedAccessType;
  bucketStatisticsBySensitivity?: BucketStatisticsBySensitivity;
  classifiableObjectCount?: number;
  classifiableSizeInBytes?: number;
  lastUpdated?: Date;
  objectCount?: number;
  sizeInBytes?: number;
  sizeInBytesCompressed?: number;
  unclassifiableObjectCount?: ObjectLevelStatistics;
  unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
}
export const GetBucketStatisticsResponse = S.suspend(() =>
  S.Struct({
    bucketCount: S.optional(S.Number).pipe(T.JsonName("bucketCount")),
    bucketCountByEffectivePermission: S.optional(
      BucketCountByEffectivePermission,
    )
      .pipe(T.JsonName("bucketCountByEffectivePermission"))
      .annotations({ identifier: "BucketCountByEffectivePermission" }),
    bucketCountByEncryptionType: S.optional(BucketCountByEncryptionType)
      .pipe(T.JsonName("bucketCountByEncryptionType"))
      .annotations({ identifier: "BucketCountByEncryptionType" }),
    bucketCountByObjectEncryptionRequirement: S.optional(
      BucketCountPolicyAllowsUnencryptedObjectUploads,
    )
      .pipe(T.JsonName("bucketCountByObjectEncryptionRequirement"))
      .annotations({
        identifier: "BucketCountPolicyAllowsUnencryptedObjectUploads",
      }),
    bucketCountBySharedAccessType: S.optional(BucketCountBySharedAccessType)
      .pipe(T.JsonName("bucketCountBySharedAccessType"))
      .annotations({ identifier: "BucketCountBySharedAccessType" }),
    bucketStatisticsBySensitivity: S.optional(BucketStatisticsBySensitivity)
      .pipe(T.JsonName("bucketStatisticsBySensitivity"))
      .annotations({ identifier: "BucketStatisticsBySensitivity" }),
    classifiableObjectCount: S.optional(S.Number).pipe(
      T.JsonName("classifiableObjectCount"),
    ),
    classifiableSizeInBytes: S.optional(S.Number).pipe(
      T.JsonName("classifiableSizeInBytes"),
    ),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastUpdated"),
    ),
    objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
    sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
    sizeInBytesCompressed: S.optional(S.Number).pipe(
      T.JsonName("sizeInBytesCompressed"),
    ),
    unclassifiableObjectCount: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectCount"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
    unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectSizeInBytes"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
  }),
).annotations({
  identifier: "GetBucketStatisticsResponse",
}) as any as S.Schema<GetBucketStatisticsResponse>;
export interface GetClassificationScopeResponse {
  id?: string;
  name?: string;
  s3?: S3ClassificationScope & {
    excludes: S3ClassificationScopeExclusion & {
      bucketNames: __listOfS3BucketName;
    };
  };
}
export const GetClassificationScopeResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String).pipe(T.JsonName("id")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    s3: S.optional(S3ClassificationScope)
      .pipe(T.JsonName("s3"))
      .annotations({ identifier: "S3ClassificationScope" }),
  }),
).annotations({
  identifier: "GetClassificationScopeResponse",
}) as any as S.Schema<GetClassificationScopeResponse>;
export interface GetFindingStatisticsResponse {
  countsByGroup?: GroupCount[];
}
export const GetFindingStatisticsResponse = S.suspend(() =>
  S.Struct({
    countsByGroup: S.optional(__listOfGroupCount).pipe(
      T.JsonName("countsByGroup"),
    ),
  }),
).annotations({
  identifier: "GetFindingStatisticsResponse",
}) as any as S.Schema<GetFindingStatisticsResponse>;
export interface GetSensitiveDataOccurrencesResponse {
  error?: string;
  sensitiveDataOccurrences?: {
    [key: string]:
      | (DetectedDataDetails & { value: __stringMin1Max128 })[]
      | undefined;
  };
  status?: RevealRequestStatus;
}
export const GetSensitiveDataOccurrencesResponse = S.suspend(() =>
  S.Struct({
    error: S.optional(S.String).pipe(T.JsonName("error")),
    sensitiveDataOccurrences: S.optional(SensitiveDataOccurrences).pipe(
      T.JsonName("sensitiveDataOccurrences"),
    ),
    status: S.optional(RevealRequestStatus).pipe(T.JsonName("status")),
  }),
).annotations({
  identifier: "GetSensitiveDataOccurrencesResponse",
}) as any as S.Schema<GetSensitiveDataOccurrencesResponse>;
export interface SearchResourcesTagCriterionPair {
  key?: string;
  value?: string;
}
export const SearchResourcesTagCriterionPair = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String).pipe(T.JsonName("key")),
    value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({
  identifier: "SearchResourcesTagCriterionPair",
}) as any as S.Schema<SearchResourcesTagCriterionPair>;
export type __listOfSearchResourcesTagCriterionPair =
  SearchResourcesTagCriterionPair[];
export const __listOfSearchResourcesTagCriterionPair = S.Array(
  SearchResourcesTagCriterionPair,
);
export type AllowsUnencryptedObjectUploads =
  | "TRUE"
  | "FALSE"
  | "UNKNOWN"
  | (string & {});
export const AllowsUnencryptedObjectUploads = S.String;
export type AutomatedDiscoveryMonitoringStatus =
  | "MONITORED"
  | "NOT_MONITORED"
  | (string & {});
export const AutomatedDiscoveryMonitoringStatus = S.String;
export type BucketMetadataErrorCode =
  | "ACCESS_DENIED"
  | "BUCKET_COUNT_EXCEEDS_QUOTA"
  | (string & {});
export const BucketMetadataErrorCode = S.String;
export type SharedAccess =
  | "EXTERNAL"
  | "INTERNAL"
  | "NOT_SHARED"
  | "UNKNOWN"
  | (string & {});
export const SharedAccess = S.String;
export interface Severity {
  description?: SeverityDescription;
  score?: number;
}
export const Severity = S.suspend(() =>
  S.Struct({
    description: S.optional(SeverityDescription).pipe(
      T.JsonName("description"),
    ),
    score: S.optional(S.Number).pipe(T.JsonName("score")),
  }),
).annotations({ identifier: "Severity" }) as any as S.Schema<Severity>;
export type FindingActionType = "AWS_API_CALL" | (string & {});
export const FindingActionType = S.String;
export interface KeyValuePair {
  key?: string;
  value?: string;
}
export const KeyValuePair = S.suspend(() =>
  S.Struct({
    key: S.optional(S.String).pipe(T.JsonName("key")),
    value: S.optional(S.String).pipe(T.JsonName("value")),
  }),
).annotations({ identifier: "KeyValuePair" }) as any as S.Schema<KeyValuePair>;
export type KeyValuePairList = KeyValuePair[];
export const KeyValuePairList = S.Array(KeyValuePair);
export type StorageClass =
  | "STANDARD"
  | "REDUCED_REDUNDANCY"
  | "STANDARD_IA"
  | "INTELLIGENT_TIERING"
  | "DEEP_ARCHIVE"
  | "ONEZONE_IA"
  | "GLACIER"
  | "GLACIER_IR"
  | "OUTPOSTS"
  | (string & {});
export const StorageClass = S.String;
export type Unit = "TERABYTES" | (string & {});
export const Unit = S.String;
export interface SearchResourcesTagCriterion {
  comparator?: SearchResourcesComparator;
  tagValues?: SearchResourcesTagCriterionPair[];
}
export const SearchResourcesTagCriterion = S.suspend(() =>
  S.Struct({
    comparator: S.optional(SearchResourcesComparator).pipe(
      T.JsonName("comparator"),
    ),
    tagValues: S.optional(__listOfSearchResourcesTagCriterionPair).pipe(
      T.JsonName("tagValues"),
    ),
  }),
).annotations({
  identifier: "SearchResourcesTagCriterion",
}) as any as S.Schema<SearchResourcesTagCriterion>;
export interface JobSummary {
  bucketCriteria?: S3BucketCriteriaForJob;
  bucketDefinitions?: S3BucketDefinitionForJob[];
  createdAt?: Date;
  jobId?: string;
  jobStatus?: JobStatus;
  jobType?: JobType;
  lastRunErrorStatus?: LastRunErrorStatus;
  name?: string;
  userPausedDetails?: UserPausedDetails;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
    bucketCriteria: S.optional(S3BucketCriteriaForJob)
      .pipe(T.JsonName("bucketCriteria"))
      .annotations({ identifier: "S3BucketCriteriaForJob" }),
    bucketDefinitions: S.optional(__listOfS3BucketDefinitionForJob).pipe(
      T.JsonName("bucketDefinitions"),
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    jobStatus: S.optional(JobStatus).pipe(T.JsonName("jobStatus")),
    jobType: S.optional(JobType).pipe(T.JsonName("jobType")),
    lastRunErrorStatus: S.optional(LastRunErrorStatus)
      .pipe(T.JsonName("lastRunErrorStatus"))
      .annotations({ identifier: "LastRunErrorStatus" }),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    userPausedDetails: S.optional(UserPausedDetails)
      .pipe(T.JsonName("userPausedDetails"))
      .annotations({ identifier: "UserPausedDetails" }),
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type __listOfJobSummary = JobSummary[];
export const __listOfJobSummary = S.Array(JobSummary);
export type IsDefinedInJob = "TRUE" | "FALSE" | "UNKNOWN" | (string & {});
export const IsDefinedInJob = S.String;
export type IsMonitoredByJob = "TRUE" | "FALSE" | "UNKNOWN" | (string & {});
export const IsMonitoredByJob = S.String;
export type EffectivePermission =
  | "PUBLIC"
  | "NOT_PUBLIC"
  | "UNKNOWN"
  | (string & {});
export const EffectivePermission = S.String;
export type Type =
  | "NONE"
  | "AES256"
  | "aws:kms"
  | "aws:kms:dsse"
  | (string & {});
export const Type = S.String;
export type EncryptionType =
  | "NONE"
  | "AES256"
  | "aws:kms"
  | "UNKNOWN"
  | "aws:kms:dsse"
  | (string & {});
export const EncryptionType = S.String;
export interface ServerSideEncryption {
  encryptionType?: EncryptionType;
  kmsMasterKeyId?: string;
}
export const ServerSideEncryption = S.suspend(() =>
  S.Struct({
    encryptionType: S.optional(EncryptionType).pipe(
      T.JsonName("encryptionType"),
    ),
    kmsMasterKeyId: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyId")),
  }),
).annotations({
  identifier: "ServerSideEncryption",
}) as any as S.Schema<ServerSideEncryption>;
export interface S3Object {
  bucketArn?: string;
  eTag?: string;
  extension?: string;
  key?: string;
  lastModified?: Date;
  path?: string;
  publicAccess?: boolean;
  serverSideEncryption?: ServerSideEncryption;
  size?: number;
  storageClass?: StorageClass;
  tags?: KeyValuePair[];
  versionId?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({
    bucketArn: S.optional(S.String).pipe(T.JsonName("bucketArn")),
    eTag: S.optional(S.String).pipe(T.JsonName("eTag")),
    extension: S.optional(S.String).pipe(T.JsonName("extension")),
    key: S.optional(S.String).pipe(T.JsonName("key")),
    lastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastModified"),
    ),
    path: S.optional(S.String).pipe(T.JsonName("path")),
    publicAccess: S.optional(S.Boolean).pipe(T.JsonName("publicAccess")),
    serverSideEncryption: S.optional(ServerSideEncryption)
      .pipe(T.JsonName("serverSideEncryption"))
      .annotations({ identifier: "ServerSideEncryption" }),
    size: S.optional(S.Number).pipe(T.JsonName("size")),
    storageClass: S.optional(StorageClass).pipe(T.JsonName("storageClass")),
    tags: S.optional(KeyValuePairList).pipe(T.JsonName("tags")),
    versionId: S.optional(S.String).pipe(T.JsonName("versionId")),
  }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface ServiceLimit {
  isServiceLimited?: boolean;
  unit?: Unit;
  value?: number;
}
export const ServiceLimit = S.suspend(() =>
  S.Struct({
    isServiceLimited: S.optional(S.Boolean).pipe(
      T.JsonName("isServiceLimited"),
    ),
    unit: S.optional(Unit).pipe(T.JsonName("unit")),
    value: S.optional(S.Number).pipe(T.JsonName("value")),
  }),
).annotations({ identifier: "ServiceLimit" }) as any as S.Schema<ServiceLimit>;
export interface SearchResourcesCriteria {
  simpleCriterion?: SearchResourcesSimpleCriterion;
  tagCriterion?: SearchResourcesTagCriterion;
}
export const SearchResourcesCriteria = S.suspend(() =>
  S.Struct({
    simpleCriterion: S.optional(SearchResourcesSimpleCriterion)
      .pipe(T.JsonName("simpleCriterion"))
      .annotations({ identifier: "SearchResourcesSimpleCriterion" }),
    tagCriterion: S.optional(SearchResourcesTagCriterion)
      .pipe(T.JsonName("tagCriterion"))
      .annotations({ identifier: "SearchResourcesTagCriterion" }),
  }),
).annotations({
  identifier: "SearchResourcesCriteria",
}) as any as S.Schema<SearchResourcesCriteria>;
export type __listOfSearchResourcesCriteria = SearchResourcesCriteria[];
export const __listOfSearchResourcesCriteria = S.Array(SearchResourcesCriteria);
export interface CreateFindingsFilterResponse {
  arn?: string;
  id?: string;
}
export const CreateFindingsFilterResponse = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "CreateFindingsFilterResponse",
}) as any as S.Schema<CreateFindingsFilterResponse>;
export type UserIdentityType =
  | "AssumedRole"
  | "IAMUser"
  | "FederatedUser"
  | "Root"
  | "AWSAccount"
  | "AWSService"
  | (string & {});
export const UserIdentityType = S.String;
export interface ListClassificationJobsResponse {
  items?: (JobSummary & {
    bucketDefinitions: (S3BucketDefinitionForJob & {
      accountId: string;
      buckets: __listOf__string;
    })[];
  })[];
  nextToken?: string;
}
export const ListClassificationJobsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(__listOfJobSummary).pipe(T.JsonName("items")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "ListClassificationJobsResponse",
}) as any as S.Schema<ListClassificationJobsResponse>;
export interface JobDetails {
  isDefinedInJob?: IsDefinedInJob;
  isMonitoredByJob?: IsMonitoredByJob;
  lastJobId?: string;
  lastJobRunTime?: Date;
}
export const JobDetails = S.suspend(() =>
  S.Struct({
    isDefinedInJob: S.optional(IsDefinedInJob).pipe(
      T.JsonName("isDefinedInJob"),
    ),
    isMonitoredByJob: S.optional(IsMonitoredByJob).pipe(
      T.JsonName("isMonitoredByJob"),
    ),
    lastJobId: S.optional(S.String).pipe(T.JsonName("lastJobId")),
    lastJobRunTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastJobRunTime")),
  }),
).annotations({ identifier: "JobDetails" }) as any as S.Schema<JobDetails>;
export interface ObjectCountByEncryptionType {
  customerManaged?: number;
  kmsManaged?: number;
  s3Managed?: number;
  unencrypted?: number;
  unknown?: number;
}
export const ObjectCountByEncryptionType = S.suspend(() =>
  S.Struct({
    customerManaged: S.optional(S.Number).pipe(T.JsonName("customerManaged")),
    kmsManaged: S.optional(S.Number).pipe(T.JsonName("kmsManaged")),
    s3Managed: S.optional(S.Number).pipe(T.JsonName("s3Managed")),
    unencrypted: S.optional(S.Number).pipe(T.JsonName("unencrypted")),
    unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
  }),
).annotations({
  identifier: "ObjectCountByEncryptionType",
}) as any as S.Schema<ObjectCountByEncryptionType>;
export interface ReplicationDetails {
  replicated?: boolean;
  replicatedExternally?: boolean;
  replicationAccounts?: string[];
}
export const ReplicationDetails = S.suspend(() =>
  S.Struct({
    replicated: S.optional(S.Boolean).pipe(T.JsonName("replicated")),
    replicatedExternally: S.optional(S.Boolean).pipe(
      T.JsonName("replicatedExternally"),
    ),
    replicationAccounts: S.optional(__listOf__string).pipe(
      T.JsonName("replicationAccounts"),
    ),
  }),
).annotations({
  identifier: "ReplicationDetails",
}) as any as S.Schema<ReplicationDetails>;
export interface BucketServerSideEncryption {
  kmsMasterKeyId?: string;
  type?: Type;
}
export const BucketServerSideEncryption = S.suspend(() =>
  S.Struct({
    kmsMasterKeyId: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyId")),
    type: S.optional(Type).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "BucketServerSideEncryption",
}) as any as S.Schema<BucketServerSideEncryption>;
export type __listOfKeyValuePair = KeyValuePair[];
export const __listOfKeyValuePair = S.Array(KeyValuePair);
export interface UsageByAccount {
  currency?: Currency;
  estimatedCost?: string;
  serviceLimit?: ServiceLimit;
  type?: UsageType;
}
export const UsageByAccount = S.suspend(() =>
  S.Struct({
    currency: S.optional(Currency).pipe(T.JsonName("currency")),
    estimatedCost: S.optional(S.String).pipe(T.JsonName("estimatedCost")),
    serviceLimit: S.optional(ServiceLimit)
      .pipe(T.JsonName("serviceLimit"))
      .annotations({ identifier: "ServiceLimit" }),
    type: S.optional(UsageType).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "UsageByAccount",
}) as any as S.Schema<UsageByAccount>;
export type __listOfUsageByAccount = UsageByAccount[];
export const __listOfUsageByAccount = S.Array(UsageByAccount);
export interface SearchResourcesCriteriaBlock {
  and?: SearchResourcesCriteria[];
}
export const SearchResourcesCriteriaBlock = S.suspend(() =>
  S.Struct({
    and: S.optional(__listOfSearchResourcesCriteria).pipe(T.JsonName("and")),
  }),
).annotations({
  identifier: "SearchResourcesCriteriaBlock",
}) as any as S.Schema<SearchResourcesCriteriaBlock>;
export interface ClassificationResultStatus {
  code?: string;
  reason?: string;
}
export const ClassificationResultStatus = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String).pipe(T.JsonName("code")),
    reason: S.optional(S.String).pipe(T.JsonName("reason")),
  }),
).annotations({
  identifier: "ClassificationResultStatus",
}) as any as S.Schema<ClassificationResultStatus>;
export interface ApiCallDetails {
  api?: string;
  apiServiceName?: string;
  firstSeen?: Date;
  lastSeen?: Date;
}
export const ApiCallDetails = S.suspend(() =>
  S.Struct({
    api: S.optional(S.String).pipe(T.JsonName("api")),
    apiServiceName: S.optional(S.String).pipe(T.JsonName("apiServiceName")),
    firstSeen: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("firstSeen"),
    ),
    lastSeen: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastSeen"),
    ),
  }),
).annotations({
  identifier: "ApiCallDetails",
}) as any as S.Schema<ApiCallDetails>;
export interface DomainDetails {
  domainName?: string;
}
export const DomainDetails = S.suspend(() =>
  S.Struct({ domainName: S.optional(S.String).pipe(T.JsonName("domainName")) }),
).annotations({
  identifier: "DomainDetails",
}) as any as S.Schema<DomainDetails>;
export interface S3BucketOwner {
  displayName?: string;
  id?: string;
}
export const S3BucketOwner = S.suspend(() =>
  S.Struct({
    displayName: S.optional(S.String).pipe(T.JsonName("displayName")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
  }),
).annotations({
  identifier: "S3BucketOwner",
}) as any as S.Schema<S3BucketOwner>;
export interface UsageRecord {
  accountId?: string;
  automatedDiscoveryFreeTrialStartDate?: Date;
  freeTrialStartDate?: Date;
  usage?: UsageByAccount[];
}
export const UsageRecord = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    automatedDiscoveryFreeTrialStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("automatedDiscoveryFreeTrialStartDate")),
    freeTrialStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("freeTrialStartDate")),
    usage: S.optional(__listOfUsageByAccount).pipe(T.JsonName("usage")),
  }),
).annotations({ identifier: "UsageRecord" }) as any as S.Schema<UsageRecord>;
export type __listOfUsageRecord = UsageRecord[];
export const __listOfUsageRecord = S.Array(UsageRecord);
export interface SearchResourcesBucketCriteria {
  excludes?: SearchResourcesCriteriaBlock;
  includes?: SearchResourcesCriteriaBlock;
}
export const SearchResourcesBucketCriteria = S.suspend(() =>
  S.Struct({
    excludes: S.optional(SearchResourcesCriteriaBlock)
      .pipe(T.JsonName("excludes"))
      .annotations({ identifier: "SearchResourcesCriteriaBlock" }),
    includes: S.optional(SearchResourcesCriteriaBlock)
      .pipe(T.JsonName("includes"))
      .annotations({ identifier: "SearchResourcesCriteriaBlock" }),
  }),
).annotations({
  identifier: "SearchResourcesBucketCriteria",
}) as any as S.Schema<SearchResourcesBucketCriteria>;
export interface FindingAction {
  actionType?: FindingActionType;
  apiCallDetails?: ApiCallDetails;
}
export const FindingAction = S.suspend(() =>
  S.Struct({
    actionType: S.optional(FindingActionType).pipe(T.JsonName("actionType")),
    apiCallDetails: S.optional(ApiCallDetails)
      .pipe(T.JsonName("apiCallDetails"))
      .annotations({ identifier: "ApiCallDetails" }),
  }),
).annotations({
  identifier: "FindingAction",
}) as any as S.Schema<FindingAction>;
export interface BlockPublicAccess {
  blockPublicAcls?: boolean;
  blockPublicPolicy?: boolean;
  ignorePublicAcls?: boolean;
  restrictPublicBuckets?: boolean;
}
export const BlockPublicAccess = S.suspend(() =>
  S.Struct({
    blockPublicAcls: S.optional(S.Boolean).pipe(T.JsonName("blockPublicAcls")),
    blockPublicPolicy: S.optional(S.Boolean).pipe(
      T.JsonName("blockPublicPolicy"),
    ),
    ignorePublicAcls: S.optional(S.Boolean).pipe(
      T.JsonName("ignorePublicAcls"),
    ),
    restrictPublicBuckets: S.optional(S.Boolean).pipe(
      T.JsonName("restrictPublicBuckets"),
    ),
  }),
).annotations({
  identifier: "BlockPublicAccess",
}) as any as S.Schema<BlockPublicAccess>;
export interface AccountLevelPermissions {
  blockPublicAccess?: BlockPublicAccess;
}
export const AccountLevelPermissions = S.suspend(() =>
  S.Struct({
    blockPublicAccess: S.optional(BlockPublicAccess)
      .pipe(T.JsonName("blockPublicAccess"))
      .annotations({ identifier: "BlockPublicAccess" }),
  }),
).annotations({
  identifier: "AccountLevelPermissions",
}) as any as S.Schema<AccountLevelPermissions>;
export interface AccessControlList {
  allowsPublicReadAccess?: boolean;
  allowsPublicWriteAccess?: boolean;
}
export const AccessControlList = S.suspend(() =>
  S.Struct({
    allowsPublicReadAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicReadAccess"),
    ),
    allowsPublicWriteAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicWriteAccess"),
    ),
  }),
).annotations({
  identifier: "AccessControlList",
}) as any as S.Schema<AccessControlList>;
export interface BucketPolicy {
  allowsPublicReadAccess?: boolean;
  allowsPublicWriteAccess?: boolean;
}
export const BucketPolicy = S.suspend(() =>
  S.Struct({
    allowsPublicReadAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicReadAccess"),
    ),
    allowsPublicWriteAccess: S.optional(S.Boolean).pipe(
      T.JsonName("allowsPublicWriteAccess"),
    ),
  }),
).annotations({ identifier: "BucketPolicy" }) as any as S.Schema<BucketPolicy>;
export interface BucketLevelPermissions {
  accessControlList?: AccessControlList;
  blockPublicAccess?: BlockPublicAccess;
  bucketPolicy?: BucketPolicy;
}
export const BucketLevelPermissions = S.suspend(() =>
  S.Struct({
    accessControlList: S.optional(AccessControlList)
      .pipe(T.JsonName("accessControlList"))
      .annotations({ identifier: "AccessControlList" }),
    blockPublicAccess: S.optional(BlockPublicAccess)
      .pipe(T.JsonName("blockPublicAccess"))
      .annotations({ identifier: "BlockPublicAccess" }),
    bucketPolicy: S.optional(BucketPolicy)
      .pipe(T.JsonName("bucketPolicy"))
      .annotations({ identifier: "BucketPolicy" }),
  }),
).annotations({
  identifier: "BucketLevelPermissions",
}) as any as S.Schema<BucketLevelPermissions>;
export interface BucketPermissionConfiguration {
  accountLevelPermissions?: AccountLevelPermissions;
  bucketLevelPermissions?: BucketLevelPermissions;
}
export const BucketPermissionConfiguration = S.suspend(() =>
  S.Struct({
    accountLevelPermissions: S.optional(AccountLevelPermissions)
      .pipe(T.JsonName("accountLevelPermissions"))
      .annotations({ identifier: "AccountLevelPermissions" }),
    bucketLevelPermissions: S.optional(BucketLevelPermissions)
      .pipe(T.JsonName("bucketLevelPermissions"))
      .annotations({ identifier: "BucketLevelPermissions" }),
  }),
).annotations({
  identifier: "BucketPermissionConfiguration",
}) as any as S.Schema<BucketPermissionConfiguration>;
export interface BucketPublicAccess {
  effectivePermission?: EffectivePermission;
  permissionConfiguration?: BucketPermissionConfiguration;
}
export const BucketPublicAccess = S.suspend(() =>
  S.Struct({
    effectivePermission: S.optional(EffectivePermission).pipe(
      T.JsonName("effectivePermission"),
    ),
    permissionConfiguration: S.optional(BucketPermissionConfiguration)
      .pipe(T.JsonName("permissionConfiguration"))
      .annotations({ identifier: "BucketPermissionConfiguration" }),
  }),
).annotations({
  identifier: "BucketPublicAccess",
}) as any as S.Schema<BucketPublicAccess>;
export interface S3Bucket {
  allowsUnencryptedObjectUploads?: AllowsUnencryptedObjectUploads;
  arn?: string;
  createdAt?: Date;
  defaultServerSideEncryption?: ServerSideEncryption;
  name?: string;
  owner?: S3BucketOwner;
  publicAccess?: BucketPublicAccess;
  tags?: KeyValuePair[];
}
export const S3Bucket = S.suspend(() =>
  S.Struct({
    allowsUnencryptedObjectUploads: S.optional(
      AllowsUnencryptedObjectUploads,
    ).pipe(T.JsonName("allowsUnencryptedObjectUploads")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    defaultServerSideEncryption: S.optional(ServerSideEncryption)
      .pipe(T.JsonName("defaultServerSideEncryption"))
      .annotations({ identifier: "ServerSideEncryption" }),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    owner: S.optional(S3BucketOwner)
      .pipe(T.JsonName("owner"))
      .annotations({ identifier: "S3BucketOwner" }),
    publicAccess: S.optional(BucketPublicAccess)
      .pipe(T.JsonName("publicAccess"))
      .annotations({ identifier: "BucketPublicAccess" }),
    tags: S.optional(KeyValuePairList).pipe(T.JsonName("tags")),
  }),
).annotations({ identifier: "S3Bucket" }) as any as S.Schema<S3Bucket>;
export interface Cell {
  cellReference?: string;
  column?: number;
  columnName?: string;
  row?: number;
}
export const Cell = S.suspend(() =>
  S.Struct({
    cellReference: S.optional(S.String).pipe(T.JsonName("cellReference")),
    column: S.optional(S.Number).pipe(T.JsonName("column")),
    columnName: S.optional(S.String).pipe(T.JsonName("columnName")),
    row: S.optional(S.Number).pipe(T.JsonName("row")),
  }),
).annotations({ identifier: "Cell" }) as any as S.Schema<Cell>;
export type Cells = Cell[];
export const Cells = S.Array(Cell);
export interface Range {
  end?: number;
  start?: number;
  startColumn?: number;
}
export const Range = S.suspend(() =>
  S.Struct({
    end: S.optional(S.Number).pipe(T.JsonName("end")),
    start: S.optional(S.Number).pipe(T.JsonName("start")),
    startColumn: S.optional(S.Number).pipe(T.JsonName("startColumn")),
  }),
).annotations({ identifier: "Range" }) as any as S.Schema<Range>;
export type Ranges = Range[];
export const Ranges = S.Array(Range);
export interface Page {
  lineRange?: Range;
  offsetRange?: Range;
  pageNumber?: number;
}
export const Page = S.suspend(() =>
  S.Struct({
    lineRange: S.optional(Range)
      .pipe(T.JsonName("lineRange"))
      .annotations({ identifier: "Range" }),
    offsetRange: S.optional(Range)
      .pipe(T.JsonName("offsetRange"))
      .annotations({ identifier: "Range" }),
    pageNumber: S.optional(S.Number).pipe(T.JsonName("pageNumber")),
  }),
).annotations({ identifier: "Page" }) as any as S.Schema<Page>;
export type Pages = Page[];
export const Pages = S.Array(Page);
export interface Record {
  jsonPath?: string;
  recordIndex?: number;
}
export const Record = S.suspend(() =>
  S.Struct({
    jsonPath: S.optional(S.String).pipe(T.JsonName("jsonPath")),
    recordIndex: S.optional(S.Number).pipe(T.JsonName("recordIndex")),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type Records = Record[];
export const Records = S.Array(Record);
export interface Occurrences {
  cells?: Cell[];
  lineRanges?: Range[];
  offsetRanges?: Range[];
  pages?: Page[];
  records?: Record[];
}
export const Occurrences = S.suspend(() =>
  S.Struct({
    cells: S.optional(Cells).pipe(T.JsonName("cells")),
    lineRanges: S.optional(Ranges).pipe(T.JsonName("lineRanges")),
    offsetRanges: S.optional(Ranges).pipe(T.JsonName("offsetRanges")),
    pages: S.optional(Pages).pipe(T.JsonName("pages")),
    records: S.optional(Records).pipe(T.JsonName("records")),
  }),
).annotations({ identifier: "Occurrences" }) as any as S.Schema<Occurrences>;
export interface DefaultDetection {
  count?: number;
  occurrences?: Occurrences;
  type?: string;
}
export const DefaultDetection = S.suspend(() =>
  S.Struct({
    count: S.optional(S.Number).pipe(T.JsonName("count")),
    occurrences: S.optional(Occurrences)
      .pipe(T.JsonName("occurrences"))
      .annotations({ identifier: "Occurrences" }),
    type: S.optional(S.String).pipe(T.JsonName("type")),
  }),
).annotations({
  identifier: "DefaultDetection",
}) as any as S.Schema<DefaultDetection>;
export type DefaultDetections = DefaultDetection[];
export const DefaultDetections = S.Array(DefaultDetection);
export interface IpCity {
  name?: string;
}
export const IpCity = S.suspend(() =>
  S.Struct({ name: S.optional(S.String).pipe(T.JsonName("name")) }),
).annotations({ identifier: "IpCity" }) as any as S.Schema<IpCity>;
export interface IpCountry {
  code?: string;
  name?: string;
}
export const IpCountry = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String).pipe(T.JsonName("code")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
  }),
).annotations({ identifier: "IpCountry" }) as any as S.Schema<IpCountry>;
export interface IpGeoLocation {
  lat?: number;
  lon?: number;
}
export const IpGeoLocation = S.suspend(() =>
  S.Struct({
    lat: S.optional(S.Number).pipe(T.JsonName("lat")),
    lon: S.optional(S.Number).pipe(T.JsonName("lon")),
  }),
).annotations({
  identifier: "IpGeoLocation",
}) as any as S.Schema<IpGeoLocation>;
export interface IpOwner {
  asn?: string;
  asnOrg?: string;
  isp?: string;
  org?: string;
}
export const IpOwner = S.suspend(() =>
  S.Struct({
    asn: S.optional(S.String).pipe(T.JsonName("asn")),
    asnOrg: S.optional(S.String).pipe(T.JsonName("asnOrg")),
    isp: S.optional(S.String).pipe(T.JsonName("isp")),
    org: S.optional(S.String).pipe(T.JsonName("org")),
  }),
).annotations({ identifier: "IpOwner" }) as any as S.Schema<IpOwner>;
export interface AwsAccount {
  accountId?: string;
  principalId?: string;
}
export const AwsAccount = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  }),
).annotations({ identifier: "AwsAccount" }) as any as S.Schema<AwsAccount>;
export interface AwsService {
  invokedBy?: string;
}
export const AwsService = S.suspend(() =>
  S.Struct({ invokedBy: S.optional(S.String).pipe(T.JsonName("invokedBy")) }),
).annotations({ identifier: "AwsService" }) as any as S.Schema<AwsService>;
export interface SessionContextAttributes {
  creationDate?: Date;
  mfaAuthenticated?: boolean;
}
export const SessionContextAttributes = S.suspend(() =>
  S.Struct({
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("creationDate"),
    ),
    mfaAuthenticated: S.optional(S.Boolean).pipe(
      T.JsonName("mfaAuthenticated"),
    ),
  }),
).annotations({
  identifier: "SessionContextAttributes",
}) as any as S.Schema<SessionContextAttributes>;
export interface SessionIssuer {
  accountId?: string;
  arn?: string;
  principalId?: string;
  type?: string;
  userName?: string;
}
export const SessionIssuer = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    type: S.optional(S.String).pipe(T.JsonName("type")),
    userName: S.optional(S.String).pipe(T.JsonName("userName")),
  }),
).annotations({
  identifier: "SessionIssuer",
}) as any as S.Schema<SessionIssuer>;
export interface SessionContext {
  attributes?: SessionContextAttributes;
  sessionIssuer?: SessionIssuer;
}
export const SessionContext = S.suspend(() =>
  S.Struct({
    attributes: S.optional(SessionContextAttributes)
      .pipe(T.JsonName("attributes"))
      .annotations({ identifier: "SessionContextAttributes" }),
    sessionIssuer: S.optional(SessionIssuer)
      .pipe(T.JsonName("sessionIssuer"))
      .annotations({ identifier: "SessionIssuer" }),
  }),
).annotations({
  identifier: "SessionContext",
}) as any as S.Schema<SessionContext>;
export interface FederatedUser {
  accessKeyId?: string;
  accountId?: string;
  arn?: string;
  principalId?: string;
  sessionContext?: SessionContext;
}
export const FederatedUser = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    sessionContext: S.optional(SessionContext)
      .pipe(T.JsonName("sessionContext"))
      .annotations({ identifier: "SessionContext" }),
  }),
).annotations({
  identifier: "FederatedUser",
}) as any as S.Schema<FederatedUser>;
export interface IamUser {
  accountId?: string;
  arn?: string;
  principalId?: string;
  userName?: string;
}
export const IamUser = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    userName: S.optional(S.String).pipe(T.JsonName("userName")),
  }),
).annotations({ identifier: "IamUser" }) as any as S.Schema<IamUser>;
export interface UserIdentityRoot {
  accountId?: string;
  arn?: string;
  principalId?: string;
}
export const UserIdentityRoot = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  }),
).annotations({
  identifier: "UserIdentityRoot",
}) as any as S.Schema<UserIdentityRoot>;
export interface GetUsageStatisticsResponse {
  nextToken?: string;
  records?: UsageRecord[];
  timeRange?: TimeRange;
}
export const GetUsageStatisticsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    records: S.optional(__listOfUsageRecord).pipe(T.JsonName("records")),
    timeRange: S.optional(TimeRange).pipe(T.JsonName("timeRange")),
  }),
).annotations({
  identifier: "GetUsageStatisticsResponse",
}) as any as S.Schema<GetUsageStatisticsResponse>;
export interface SearchResourcesRequest {
  bucketCriteria?: SearchResourcesBucketCriteria;
  maxResults?: number;
  nextToken?: string;
  sortCriteria?: SearchResourcesSortCriteria;
}
export const SearchResourcesRequest = S.suspend(() =>
  S.Struct({
    bucketCriteria: S.optional(SearchResourcesBucketCriteria)
      .pipe(T.JsonName("bucketCriteria"))
      .annotations({ identifier: "SearchResourcesBucketCriteria" }),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(SearchResourcesSortCriteria)
      .pipe(T.JsonName("sortCriteria"))
      .annotations({ identifier: "SearchResourcesSortCriteria" }),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasources/search-resources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchResourcesRequest",
}) as any as S.Schema<SearchResourcesRequest>;
export interface ResourcesAffected {
  s3Bucket?: S3Bucket;
  s3Object?: S3Object;
}
export const ResourcesAffected = S.suspend(() =>
  S.Struct({
    s3Bucket: S.optional(S3Bucket)
      .pipe(T.JsonName("s3Bucket"))
      .annotations({ identifier: "S3Bucket" }),
    s3Object: S.optional(S3Object)
      .pipe(T.JsonName("s3Object"))
      .annotations({ identifier: "S3Object" }),
  }),
).annotations({
  identifier: "ResourcesAffected",
}) as any as S.Schema<ResourcesAffected>;
export interface SensitiveDataItem {
  category?: SensitiveDataItemCategory;
  detections?: DefaultDetection[];
  totalCount?: number;
}
export const SensitiveDataItem = S.suspend(() =>
  S.Struct({
    category: S.optional(SensitiveDataItemCategory).pipe(
      T.JsonName("category"),
    ),
    detections: S.optional(DefaultDetections).pipe(T.JsonName("detections")),
    totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
  }),
).annotations({
  identifier: "SensitiveDataItem",
}) as any as S.Schema<SensitiveDataItem>;
export type SensitiveData = SensitiveDataItem[];
export const SensitiveData = S.Array(SensitiveDataItem);
export interface IpAddressDetails {
  ipAddressV4?: string;
  ipCity?: IpCity;
  ipCountry?: IpCountry;
  ipGeoLocation?: IpGeoLocation;
  ipOwner?: IpOwner;
}
export const IpAddressDetails = S.suspend(() =>
  S.Struct({
    ipAddressV4: S.optional(S.String).pipe(T.JsonName("ipAddressV4")),
    ipCity: S.optional(IpCity)
      .pipe(T.JsonName("ipCity"))
      .annotations({ identifier: "IpCity" }),
    ipCountry: S.optional(IpCountry)
      .pipe(T.JsonName("ipCountry"))
      .annotations({ identifier: "IpCountry" }),
    ipGeoLocation: S.optional(IpGeoLocation)
      .pipe(T.JsonName("ipGeoLocation"))
      .annotations({ identifier: "IpGeoLocation" }),
    ipOwner: S.optional(IpOwner)
      .pipe(T.JsonName("ipOwner"))
      .annotations({ identifier: "IpOwner" }),
  }),
).annotations({
  identifier: "IpAddressDetails",
}) as any as S.Schema<IpAddressDetails>;
export interface CreateClassificationJobRequest {
  allowListIds?: string[];
  clientToken?: string;
  customDataIdentifierIds?: string[];
  description?: string;
  initialRun?: boolean;
  jobType?: JobType;
  managedDataIdentifierIds?: string[];
  managedDataIdentifierSelector?: ManagedDataIdentifierSelector;
  name?: string;
  s3JobDefinition?: S3JobDefinition;
  samplingPercentage?: number;
  scheduleFrequency?: JobScheduleFrequency;
  tags?: { [key: string]: string | undefined };
}
export const CreateClassificationJobRequest = S.suspend(() =>
  S.Struct({
    allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
    clientToken: S.optional(S.String).pipe(
      T.JsonName("clientToken"),
      T.IdempotencyToken(),
    ),
    customDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("customDataIdentifierIds"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    initialRun: S.optional(S.Boolean).pipe(T.JsonName("initialRun")),
    jobType: S.optional(JobType).pipe(T.JsonName("jobType")),
    managedDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("managedDataIdentifierIds"),
    ),
    managedDataIdentifierSelector: S.optional(
      ManagedDataIdentifierSelector,
    ).pipe(T.JsonName("managedDataIdentifierSelector")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    s3JobDefinition: S.optional(S3JobDefinition)
      .pipe(T.JsonName("s3JobDefinition"))
      .annotations({ identifier: "S3JobDefinition" }),
    samplingPercentage: S.optional(S.Number).pipe(
      T.JsonName("samplingPercentage"),
    ),
    scheduleFrequency: S.optional(JobScheduleFrequency)
      .pipe(T.JsonName("scheduleFrequency"))
      .annotations({ identifier: "JobScheduleFrequency" }),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClassificationJobRequest",
}) as any as S.Schema<CreateClassificationJobRequest>;
export interface CreateClassificationJobResponse {
  jobArn?: string;
  jobId?: string;
}
export const CreateClassificationJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
    jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  }),
).annotations({
  identifier: "CreateClassificationJobResponse",
}) as any as S.Schema<CreateClassificationJobResponse>;
export interface CustomDetection {
  arn?: string;
  count?: number;
  name?: string;
  occurrences?: Occurrences;
}
export const CustomDetection = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    count: S.optional(S.Number).pipe(T.JsonName("count")),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    occurrences: S.optional(Occurrences)
      .pipe(T.JsonName("occurrences"))
      .annotations({ identifier: "Occurrences" }),
  }),
).annotations({
  identifier: "CustomDetection",
}) as any as S.Schema<CustomDetection>;
export type CustomDetections = CustomDetection[];
export const CustomDetections = S.Array(CustomDetection);
export interface AssumedRole {
  accessKeyId?: string;
  accountId?: string;
  arn?: string;
  principalId?: string;
  sessionContext?: SessionContext;
}
export const AssumedRole = S.suspend(() =>
  S.Struct({
    accessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    arn: S.optional(S.String).pipe(T.JsonName("arn")),
    principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
    sessionContext: S.optional(SessionContext)
      .pipe(T.JsonName("sessionContext"))
      .annotations({ identifier: "SessionContext" }),
  }),
).annotations({ identifier: "AssumedRole" }) as any as S.Schema<AssumedRole>;
export interface MatchingBucket {
  accountId?: string;
  automatedDiscoveryMonitoringStatus?: AutomatedDiscoveryMonitoringStatus;
  bucketName?: string;
  classifiableObjectCount?: number;
  classifiableSizeInBytes?: number;
  errorCode?: BucketMetadataErrorCode;
  errorMessage?: string;
  jobDetails?: JobDetails;
  lastAutomatedDiscoveryTime?: Date;
  objectCount?: number;
  objectCountByEncryptionType?: ObjectCountByEncryptionType;
  sensitivityScore?: number;
  sizeInBytes?: number;
  sizeInBytesCompressed?: number;
  unclassifiableObjectCount?: ObjectLevelStatistics;
  unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
}
export const MatchingBucket = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    automatedDiscoveryMonitoringStatus: S.optional(
      AutomatedDiscoveryMonitoringStatus,
    ).pipe(T.JsonName("automatedDiscoveryMonitoringStatus")),
    bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    classifiableObjectCount: S.optional(S.Number).pipe(
      T.JsonName("classifiableObjectCount"),
    ),
    classifiableSizeInBytes: S.optional(S.Number).pipe(
      T.JsonName("classifiableSizeInBytes"),
    ),
    errorCode: S.optional(BucketMetadataErrorCode).pipe(
      T.JsonName("errorCode"),
    ),
    errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    jobDetails: S.optional(JobDetails)
      .pipe(T.JsonName("jobDetails"))
      .annotations({ identifier: "JobDetails" }),
    lastAutomatedDiscoveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastAutomatedDiscoveryTime")),
    objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
    objectCountByEncryptionType: S.optional(ObjectCountByEncryptionType)
      .pipe(T.JsonName("objectCountByEncryptionType"))
      .annotations({ identifier: "ObjectCountByEncryptionType" }),
    sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
    sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
    sizeInBytesCompressed: S.optional(S.Number).pipe(
      T.JsonName("sizeInBytesCompressed"),
    ),
    unclassifiableObjectCount: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectCount"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
    unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectSizeInBytes"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
  }),
).annotations({
  identifier: "MatchingBucket",
}) as any as S.Schema<MatchingBucket>;
export interface CustomDataIdentifiers {
  detections?: CustomDetection[];
  totalCount?: number;
}
export const CustomDataIdentifiers = S.suspend(() =>
  S.Struct({
    detections: S.optional(CustomDetections).pipe(T.JsonName("detections")),
    totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
  }),
).annotations({
  identifier: "CustomDataIdentifiers",
}) as any as S.Schema<CustomDataIdentifiers>;
export interface UserIdentity {
  assumedRole?: AssumedRole;
  awsAccount?: AwsAccount;
  awsService?: AwsService;
  federatedUser?: FederatedUser;
  iamUser?: IamUser;
  root?: UserIdentityRoot;
  type?: UserIdentityType;
}
export const UserIdentity = S.suspend(() =>
  S.Struct({
    assumedRole: S.optional(AssumedRole)
      .pipe(T.JsonName("assumedRole"))
      .annotations({ identifier: "AssumedRole" }),
    awsAccount: S.optional(AwsAccount)
      .pipe(T.JsonName("awsAccount"))
      .annotations({ identifier: "AwsAccount" }),
    awsService: S.optional(AwsService)
      .pipe(T.JsonName("awsService"))
      .annotations({ identifier: "AwsService" }),
    federatedUser: S.optional(FederatedUser)
      .pipe(T.JsonName("federatedUser"))
      .annotations({ identifier: "FederatedUser" }),
    iamUser: S.optional(IamUser)
      .pipe(T.JsonName("iamUser"))
      .annotations({ identifier: "IamUser" }),
    root: S.optional(UserIdentityRoot)
      .pipe(T.JsonName("root"))
      .annotations({ identifier: "UserIdentityRoot" }),
    type: S.optional(UserIdentityType).pipe(T.JsonName("type")),
  }),
).annotations({ identifier: "UserIdentity" }) as any as S.Schema<UserIdentity>;
export interface BucketMetadata {
  accountId?: string;
  allowsUnencryptedObjectUploads?: AllowsUnencryptedObjectUploads;
  automatedDiscoveryMonitoringStatus?: AutomatedDiscoveryMonitoringStatus;
  bucketArn?: string;
  bucketCreatedAt?: Date;
  bucketName?: string;
  classifiableObjectCount?: number;
  classifiableSizeInBytes?: number;
  errorCode?: BucketMetadataErrorCode;
  errorMessage?: string;
  jobDetails?: JobDetails;
  lastAutomatedDiscoveryTime?: Date;
  lastUpdated?: Date;
  objectCount?: number;
  objectCountByEncryptionType?: ObjectCountByEncryptionType;
  publicAccess?: BucketPublicAccess;
  region?: string;
  replicationDetails?: ReplicationDetails;
  sensitivityScore?: number;
  serverSideEncryption?: BucketServerSideEncryption;
  sharedAccess?: SharedAccess;
  sizeInBytes?: number;
  sizeInBytesCompressed?: number;
  tags?: KeyValuePair[];
  unclassifiableObjectCount?: ObjectLevelStatistics;
  unclassifiableObjectSizeInBytes?: ObjectLevelStatistics;
  versioning?: boolean;
}
export const BucketMetadata = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    allowsUnencryptedObjectUploads: S.optional(
      AllowsUnencryptedObjectUploads,
    ).pipe(T.JsonName("allowsUnencryptedObjectUploads")),
    automatedDiscoveryMonitoringStatus: S.optional(
      AutomatedDiscoveryMonitoringStatus,
    ).pipe(T.JsonName("automatedDiscoveryMonitoringStatus")),
    bucketArn: S.optional(S.String).pipe(T.JsonName("bucketArn")),
    bucketCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("bucketCreatedAt")),
    bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
    classifiableObjectCount: S.optional(S.Number).pipe(
      T.JsonName("classifiableObjectCount"),
    ),
    classifiableSizeInBytes: S.optional(S.Number).pipe(
      T.JsonName("classifiableSizeInBytes"),
    ),
    errorCode: S.optional(BucketMetadataErrorCode).pipe(
      T.JsonName("errorCode"),
    ),
    errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
    jobDetails: S.optional(JobDetails)
      .pipe(T.JsonName("jobDetails"))
      .annotations({ identifier: "JobDetails" }),
    lastAutomatedDiscoveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.JsonName("lastAutomatedDiscoveryTime")),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastUpdated"),
    ),
    objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
    objectCountByEncryptionType: S.optional(ObjectCountByEncryptionType)
      .pipe(T.JsonName("objectCountByEncryptionType"))
      .annotations({ identifier: "ObjectCountByEncryptionType" }),
    publicAccess: S.optional(BucketPublicAccess)
      .pipe(T.JsonName("publicAccess"))
      .annotations({ identifier: "BucketPublicAccess" }),
    region: S.optional(S.String).pipe(T.JsonName("region")),
    replicationDetails: S.optional(ReplicationDetails)
      .pipe(T.JsonName("replicationDetails"))
      .annotations({ identifier: "ReplicationDetails" }),
    sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
    serverSideEncryption: S.optional(BucketServerSideEncryption)
      .pipe(T.JsonName("serverSideEncryption"))
      .annotations({ identifier: "BucketServerSideEncryption" }),
    sharedAccess: S.optional(SharedAccess).pipe(T.JsonName("sharedAccess")),
    sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
    sizeInBytesCompressed: S.optional(S.Number).pipe(
      T.JsonName("sizeInBytesCompressed"),
    ),
    tags: S.optional(__listOfKeyValuePair).pipe(T.JsonName("tags")),
    unclassifiableObjectCount: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectCount"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
    unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics)
      .pipe(T.JsonName("unclassifiableObjectSizeInBytes"))
      .annotations({ identifier: "ObjectLevelStatistics" }),
    versioning: S.optional(S.Boolean).pipe(T.JsonName("versioning")),
  }),
).annotations({
  identifier: "BucketMetadata",
}) as any as S.Schema<BucketMetadata>;
export type __listOfBucketMetadata = BucketMetadata[];
export const __listOfBucketMetadata = S.Array(BucketMetadata);
export interface MatchingResource {
  matchingBucket?: MatchingBucket;
}
export const MatchingResource = S.suspend(() =>
  S.Struct({
    matchingBucket: S.optional(MatchingBucket)
      .pipe(T.JsonName("matchingBucket"))
      .annotations({ identifier: "MatchingBucket" }),
  }),
).annotations({
  identifier: "MatchingResource",
}) as any as S.Schema<MatchingResource>;
export type __listOfMatchingResource = MatchingResource[];
export const __listOfMatchingResource = S.Array(MatchingResource);
export interface ClassificationResult {
  additionalOccurrences?: boolean;
  customDataIdentifiers?: CustomDataIdentifiers;
  mimeType?: string;
  sensitiveData?: SensitiveDataItem[];
  sizeClassified?: number;
  status?: ClassificationResultStatus;
}
export const ClassificationResult = S.suspend(() =>
  S.Struct({
    additionalOccurrences: S.optional(S.Boolean).pipe(
      T.JsonName("additionalOccurrences"),
    ),
    customDataIdentifiers: S.optional(CustomDataIdentifiers)
      .pipe(T.JsonName("customDataIdentifiers"))
      .annotations({ identifier: "CustomDataIdentifiers" }),
    mimeType: S.optional(S.String).pipe(T.JsonName("mimeType")),
    sensitiveData: S.optional(SensitiveData).pipe(T.JsonName("sensitiveData")),
    sizeClassified: S.optional(S.Number).pipe(T.JsonName("sizeClassified")),
    status: S.optional(ClassificationResultStatus)
      .pipe(T.JsonName("status"))
      .annotations({ identifier: "ClassificationResultStatus" }),
  }),
).annotations({
  identifier: "ClassificationResult",
}) as any as S.Schema<ClassificationResult>;
export interface FindingActor {
  domainDetails?: DomainDetails;
  ipAddressDetails?: IpAddressDetails;
  userIdentity?: UserIdentity;
}
export const FindingActor = S.suspend(() =>
  S.Struct({
    domainDetails: S.optional(DomainDetails)
      .pipe(T.JsonName("domainDetails"))
      .annotations({ identifier: "DomainDetails" }),
    ipAddressDetails: S.optional(IpAddressDetails)
      .pipe(T.JsonName("ipAddressDetails"))
      .annotations({ identifier: "IpAddressDetails" }),
    userIdentity: S.optional(UserIdentity)
      .pipe(T.JsonName("userIdentity"))
      .annotations({ identifier: "UserIdentity" }),
  }),
).annotations({ identifier: "FindingActor" }) as any as S.Schema<FindingActor>;
export interface DescribeBucketsResponse {
  buckets?: BucketMetadata[];
  nextToken?: string;
}
export const DescribeBucketsResponse = S.suspend(() =>
  S.Struct({
    buckets: S.optional(__listOfBucketMetadata).pipe(T.JsonName("buckets")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "DescribeBucketsResponse",
}) as any as S.Schema<DescribeBucketsResponse>;
export interface SearchResourcesResponse {
  matchingResources?: MatchingResource[];
  nextToken?: string;
}
export const SearchResourcesResponse = S.suspend(() =>
  S.Struct({
    matchingResources: S.optional(__listOfMatchingResource).pipe(
      T.JsonName("matchingResources"),
    ),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  }),
).annotations({
  identifier: "SearchResourcesResponse",
}) as any as S.Schema<SearchResourcesResponse>;
export interface ClassificationDetails {
  detailedResultsLocation?: string;
  jobArn?: string;
  jobId?: string;
  originType?: OriginType;
  result?: ClassificationResult;
}
export const ClassificationDetails = S.suspend(() =>
  S.Struct({
    detailedResultsLocation: S.optional(S.String).pipe(
      T.JsonName("detailedResultsLocation"),
    ),
    jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
    jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
    originType: S.optional(OriginType).pipe(T.JsonName("originType")),
    result: S.optional(ClassificationResult)
      .pipe(T.JsonName("result"))
      .annotations({ identifier: "ClassificationResult" }),
  }),
).annotations({
  identifier: "ClassificationDetails",
}) as any as S.Schema<ClassificationDetails>;
export interface PolicyDetails {
  action?: FindingAction;
  actor?: FindingActor;
}
export const PolicyDetails = S.suspend(() =>
  S.Struct({
    action: S.optional(FindingAction)
      .pipe(T.JsonName("action"))
      .annotations({ identifier: "FindingAction" }),
    actor: S.optional(FindingActor)
      .pipe(T.JsonName("actor"))
      .annotations({ identifier: "FindingActor" }),
  }),
).annotations({
  identifier: "PolicyDetails",
}) as any as S.Schema<PolicyDetails>;
export interface Finding {
  accountId?: string;
  archived?: boolean;
  category?: FindingCategory;
  classificationDetails?: ClassificationDetails;
  count?: number;
  createdAt?: Date;
  description?: string;
  id?: string;
  partition?: string;
  policyDetails?: PolicyDetails;
  region?: string;
  resourcesAffected?: ResourcesAffected;
  sample?: boolean;
  schemaVersion?: string;
  severity?: Severity;
  title?: string;
  type?: FindingType;
  updatedAt?: Date;
}
export const Finding = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
    archived: S.optional(S.Boolean).pipe(T.JsonName("archived")),
    category: S.optional(FindingCategory).pipe(T.JsonName("category")),
    classificationDetails: S.optional(ClassificationDetails)
      .pipe(T.JsonName("classificationDetails"))
      .annotations({ identifier: "ClassificationDetails" }),
    count: S.optional(S.Number).pipe(T.JsonName("count")),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("createdAt"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.optional(S.String).pipe(T.JsonName("id")),
    partition: S.optional(S.String).pipe(T.JsonName("partition")),
    policyDetails: S.optional(PolicyDetails)
      .pipe(T.JsonName("policyDetails"))
      .annotations({ identifier: "PolicyDetails" }),
    region: S.optional(S.String).pipe(T.JsonName("region")),
    resourcesAffected: S.optional(ResourcesAffected)
      .pipe(T.JsonName("resourcesAffected"))
      .annotations({ identifier: "ResourcesAffected" }),
    sample: S.optional(S.Boolean).pipe(T.JsonName("sample")),
    schemaVersion: S.optional(S.String).pipe(T.JsonName("schemaVersion")),
    severity: S.optional(Severity)
      .pipe(T.JsonName("severity"))
      .annotations({ identifier: "Severity" }),
    title: S.optional(S.String).pipe(T.JsonName("title")),
    type: S.optional(FindingType).pipe(T.JsonName("type")),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("updatedAt"),
    ),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type __listOfFinding = Finding[];
export const __listOfFinding = S.Array(Finding);
export interface GetFindingsResponse {
  findings?: Finding[];
}
export const GetFindingsResponse = S.suspend(() =>
  S.Struct({
    findings: S.optional(__listOfFinding).pipe(T.JsonName("findings")),
  }),
).annotations({
  identifier: "GetFindingsResponse",
}) as any as S.Schema<GetFindingsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withQuotaError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Adds or updates one or more tags (keys and values) that are associated with an Amazon Macie resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Removes one or more tags (keys and values) from an Amazon Macie resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Retrieves the tags (keys and values) that are associated with an Amazon Macie resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Retrieves information about all the managed data identifiers that Amazon Macie currently provides.
 */
export const listManagedDataIdentifiers: {
  (
    input: ListManagedDataIdentifiersRequest,
  ): effect.Effect<
    ListManagedDataIdentifiersResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListManagedDataIdentifiersRequest,
  ) => stream.Stream<
    ListManagedDataIdentifiersResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListManagedDataIdentifiersRequest,
  ) => stream.Stream<
    ManagedDataIdentifierSummary,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListManagedDataIdentifiersRequest,
  output: ListManagedDataIdentifiersResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
  } as const,
}));
/**
 * Checks whether occurrences of sensitive data can be retrieved for a finding.
 */
export const getSensitiveDataOccurrencesAvailability: (
  input: GetSensitiveDataOccurrencesAvailabilityRequest,
) => effect.Effect<
  GetSensitiveDataOccurrencesAvailabilityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSensitiveDataOccurrencesAvailabilityRequest,
  output: GetSensitiveDataOccurrencesAvailabilityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the configuration settings and status of automated sensitive data discovery for an organization or standalone account.
 */
export const getAutomatedDiscoveryConfiguration: (
  input: GetAutomatedDiscoveryConfigurationRequest,
) => effect.Effect<
  GetAutomatedDiscoveryConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedDiscoveryConfigurationRequest,
  output: GetAutomatedDiscoveryConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the classification scope settings for an account.
 */
export const getClassificationScope: (
  input: GetClassificationScopeRequest,
) => effect.Effect<
  GetClassificationScopeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClassificationScopeRequest,
  output: GetClassificationScopeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the criteria and other settings for a custom data identifier.
 */
export const getCustomDataIdentifier: (
  input: GetCustomDataIdentifierRequest,
) => effect.Effect<
  GetCustomDataIdentifierResponse,
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
  input: GetCustomDataIdentifierRequest,
  output: GetCustomDataIdentifierResponse,
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
 * Retrieves (queries) aggregated statistical data about findings.
 */
export const getFindingStatistics: (
  input: GetFindingStatisticsRequest,
) => effect.Effect<
  GetFindingStatisticsResponse,
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
  input: GetFindingStatisticsRequest,
  output: GetFindingStatisticsResponse,
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
 * Retrieves a subset of information about all the allow lists for an account.
 */
export const listAllowLists: {
  (
    input: ListAllowListsRequest,
  ): effect.Effect<
    ListAllowListsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAllowListsRequest,
  ) => stream.Stream<
    ListAllowListsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAllowListsRequest,
  ) => stream.Stream<
    AllowListSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAllowListsRequest,
  output: ListAllowListsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "allowLists",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the status of automated sensitive data discovery for one or more accounts.
 */
export const listAutomatedDiscoveryAccounts: {
  (
    input: ListAutomatedDiscoveryAccountsRequest,
  ): effect.Effect<
    ListAutomatedDiscoveryAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomatedDiscoveryAccountsRequest,
  ) => stream.Stream<
    ListAutomatedDiscoveryAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomatedDiscoveryAccountsRequest,
  ) => stream.Stream<
    AutomatedDiscoveryAccount,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomatedDiscoveryAccountsRequest,
  output: ListAutomatedDiscoveryAccountsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a subset of information about the classification scope for an account.
 */
export const listClassificationScopes: {
  (
    input: ListClassificationScopesRequest,
  ): effect.Effect<
    ListClassificationScopesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClassificationScopesRequest,
  ) => stream.Stream<
    ListClassificationScopesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClassificationScopesRequest,
  ) => stream.Stream<
    ClassificationScopeSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClassificationScopesRequest,
  output: ListClassificationScopesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "classificationScopes",
  } as const,
}));
/**
 * Retrieves information about objects that Amazon Macie selected from an S3 bucket for automated sensitive data discovery.
 */
export const listResourceProfileArtifacts: {
  (
    input: ListResourceProfileArtifactsRequest,
  ): effect.Effect<
    ListResourceProfileArtifactsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceProfileArtifactsRequest,
  ) => stream.Stream<
    ListResourceProfileArtifactsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceProfileArtifactsRequest,
  ) => stream.Stream<
    ResourceProfileArtifact,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceProfileArtifactsRequest,
  output: ListResourceProfileArtifactsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "artifacts",
  } as const,
}));
/**
 * Updates the classification scope settings for an account.
 */
export const updateClassificationScope: (
  input: UpdateClassificationScopeRequest,
) => effect.Effect<
  UpdateClassificationScopeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClassificationScopeRequest,
  output: UpdateClassificationScopeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
 */
export const updateRevealConfiguration: (
  input: UpdateRevealConfigurationRequest,
) => effect.Effect<
  UpdateRevealConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRevealConfigurationRequest,
  output: UpdateRevealConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
 */
export const getRevealConfiguration: (
  input: GetRevealConfigurationRequest,
) => effect.Effect<
  GetRevealConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRevealConfigurationRequest,
  output: GetRevealConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Changes the configuration settings and status of automated sensitive data discovery for an organization or standalone account.
 */
export const updateAutomatedDiscoveryConfiguration: (
  input: UpdateAutomatedDiscoveryConfigurationRequest,
) => effect.Effect<
  UpdateAutomatedDiscoveryConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomatedDiscoveryConfigurationRequest,
  output: UpdateAutomatedDiscoveryConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the settings for the sensitivity inspection template for an account.
 */
export const getSensitivityInspectionTemplate: (
  input: GetSensitivityInspectionTemplateRequest,
) => effect.Effect<
  GetSensitivityInspectionTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSensitivityInspectionTemplateRequest,
  output: GetSensitivityInspectionTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings for an allow list.
 */
export const updateAllowList: (
  input: UpdateAllowListRequest,
) => effect.Effect<
  UpdateAllowListResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAllowListRequest,
  output: UpdateAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the settings for the sensitivity inspection template for an account.
 */
export const updateSensitivityInspectionTemplate: (
  input: UpdateSensitivityInspectionTemplateRequest,
) => effect.Effect<
  UpdateSensitivityInspectionTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSensitivityInspectionTemplateRequest,
  output: UpdateSensitivityInspectionTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an allow list.
 */
export const deleteAllowList: (
  input: DeleteAllowListRequest,
) => effect.Effect<
  DeleteAllowListResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAllowListRequest,
  output: DeleteAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the settings and status of an allow list.
 */
export const getAllowList: (
  input: GetAllowListRequest,
) => effect.Effect<
  GetAllowListResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAllowListRequest,
  output: GetAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Changes the status of automated sensitive data discovery for one or more accounts.
 */
export const batchUpdateAutomatedDiscoveryAccounts: (
  input: BatchUpdateAutomatedDiscoveryAccountsRequest,
) => effect.Effect<
  BatchUpdateAutomatedDiscoveryAccountsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateAutomatedDiscoveryAccountsRequest,
  output: BatchUpdateAutomatedDiscoveryAccountsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves (queries) sensitive data discovery statistics and the sensitivity score for an S3 bucket.
 */
export const getResourceProfile: (
  input: GetResourceProfileRequest,
) => effect.Effect<
  GetResourceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceProfileRequest,
  output: GetResourceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves (queries) aggregated usage data for an account.
 */
export const getUsageTotals: (
  input: GetUsageTotalsRequest,
) => effect.Effect<
  GetUsageTotalsResponse,
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
  input: GetUsageTotalsRequest,
  output: GetUsageTotalsResponse,
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
 * Retrieves a subset of information about the custom data identifiers for an account.
 */
export const listCustomDataIdentifiers: {
  (
    input: ListCustomDataIdentifiersRequest,
  ): effect.Effect<
    ListCustomDataIdentifiersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomDataIdentifiersRequest,
  ) => stream.Stream<
    ListCustomDataIdentifiersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomDataIdentifiersRequest,
  ) => stream.Stream<
    CustomDataIdentifierSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomDataIdentifiersRequest,
  output: ListCustomDataIdentifiersResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a subset of information about all the findings filters for an account.
 */
export const listFindingsFilters: {
  (
    input: ListFindingsFiltersRequest,
  ): effect.Effect<
    ListFindingsFiltersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsFiltersRequest,
  ) => stream.Stream<
    ListFindingsFiltersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsFiltersRequest,
  ) => stream.Stream<
    FindingsFilterListItem,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsFiltersRequest,
  output: ListFindingsFiltersResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findingsFilterListItems",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the accounts that are associated with an Amazon Macie administrator account.
 */
export const listMembers: {
  (
    input: ListMembersRequest,
  ): effect.Effect<
    ListMembersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersRequest,
  ) => stream.Stream<
    ListMembersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersRequest,
  ) => stream.Stream<
    Member,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "members",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const listOrganizationAdminAccounts: {
  (
    input: ListOrganizationAdminAccountsRequest,
  ): effect.Effect<
    ListOrganizationAdminAccountsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    ListOrganizationAdminAccountsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationAdminAccountsRequest,
  ) => stream.Stream<
    AdminAccount,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationAdminAccountsRequest,
  output: ListOrganizationAdminAccountsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "adminAccounts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about the types and amount of sensitive data that Amazon Macie found in an S3 bucket.
 */
export const listResourceProfileDetections: {
  (
    input: ListResourceProfileDetectionsRequest,
  ): effect.Effect<
    ListResourceProfileDetectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceProfileDetectionsRequest,
  ) => stream.Stream<
    ListResourceProfileDetectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceProfileDetectionsRequest,
  ) => stream.Stream<
    Detection,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceProfileDetectionsRequest,
  output: ListResourceProfileDetectionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "detections",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a subset of information about the sensitivity inspection template for an account.
 */
export const listSensitivityInspectionTemplates: {
  (
    input: ListSensitivityInspectionTemplatesRequest,
  ): effect.Effect<
    ListSensitivityInspectionTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSensitivityInspectionTemplatesRequest,
  ) => stream.Stream<
    ListSensitivityInspectionTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSensitivityInspectionTemplatesRequest,
  ) => stream.Stream<
    SensitivityInspectionTemplatesEntry,
    | AccessDeniedException
    | InternalServerException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSensitivityInspectionTemplatesRequest,
  output: ListSensitivityInspectionTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sensitivityInspectionTemplates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the criteria and other settings for a findings filter.
 */
export const getFindingsFilter: (
  input: GetFindingsFilterRequest,
) => effect.Effect<
  GetFindingsFilterResponse,
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
  input: GetFindingsFilterRequest,
  output: GetFindingsFilterResponse,
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
 * Retrieves the configuration settings for publishing findings to Security Hub.
 */
export const getFindingsPublicationConfiguration: (
  input: GetFindingsPublicationConfigurationRequest,
) => effect.Effect<
  GetFindingsPublicationConfigurationResponse,
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
  input: GetFindingsPublicationConfigurationRequest,
  output: GetFindingsPublicationConfigurationResponse,
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
 * Retrieves information about an account that's associated with an Amazon Macie administrator account.
 */
export const getMember: (
  input: GetMemberRequest,
) => effect.Effect<
  GetMemberResponse,
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
  input: GetMemberRequest,
  output: GetMemberResponse,
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
 * Retrieves a subset of information about one or more findings.
 */
export const listFindings: {
  (
    input: ListFindingsRequest,
  ): effect.Effect<
    ListFindingsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    ListFindingsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    string,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "findingIds",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about Amazon Macie membership invitations that were received by an account.
 */
export const listInvitations: {
  (
    input: ListInvitationsRequest,
  ): effect.Effect<
    ListInvitationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    ListInvitationsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvitationsRequest,
  ) => stream.Stream<
    Invitation,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvitationsRequest,
  output: ListInvitationsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "invitations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds or updates the configuration settings for storing data classification results.
 */
export const putClassificationExportConfiguration: (
  input: PutClassificationExportConfigurationRequest,
) => effect.Effect<
  PutClassificationExportConfigurationResponse,
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
  input: PutClassificationExportConfigurationRequest,
  output: PutClassificationExportConfigurationResponse,
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
 * Tests criteria for a custom data identifier.
 */
export const testCustomDataIdentifier: (
  input: TestCustomDataIdentifierRequest,
) => effect.Effect<
  TestCustomDataIdentifierResponse,
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
  input: TestCustomDataIdentifierRequest,
  output: TestCustomDataIdentifierResponse,
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
 * Updates the criteria and other settings for a findings filter.
 */
export const updateFindingsFilter: (
  input: UpdateFindingsFilterRequest,
) => effect.Effect<
  UpdateFindingsFilterResponse,
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
  input: UpdateFindingsFilterRequest,
  output: UpdateFindingsFilterResponse,
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
 * Updates the sensitivity scoring settings for an S3 bucket.
 */
export const updateResourceProfileDetections: (
  input: UpdateResourceProfileDetectionsRequest,
) => effect.Effect<
  UpdateResourceProfileDetectionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceProfileDetectionsRequest,
  output: UpdateResourceProfileDetectionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disables an account as the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const disableOrganizationAdminAccount: (
  input: DisableOrganizationAdminAccountRequest,
) => effect.Effect<
  DisableOrganizationAdminAccountResponse,
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
  input: DisableOrganizationAdminAccountRequest,
  output: DisableOrganizationAdminAccountResponse,
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
 * Disassociates an Amazon Macie administrator account from a member account.
 */
export const disassociateMember: (
  input: DisassociateMemberRequest,
) => effect.Effect<
  DisassociateMemberResponse,
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
  input: DisassociateMemberRequest,
  output: DisassociateMemberResponse,
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
 * Enables Amazon Macie and specifies the configuration settings for a Macie account.
 */
export const enableMacie: (
  input: EnableMacieRequest,
) => effect.Effect<
  EnableMacieResponse,
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
  input: EnableMacieRequest,
  output: EnableMacieResponse,
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
 * Designates an account as the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const enableOrganizationAdminAccount: (
  input: EnableOrganizationAdminAccountRequest,
) => effect.Effect<
  EnableOrganizationAdminAccountResponse,
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
  input: EnableOrganizationAdminAccountRequest,
  output: EnableOrganizationAdminAccountResponse,
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
 * Retrieves the count of Amazon Macie membership invitations that were received by an account.
 */
export const getInvitationsCount: (
  input: GetInvitationsCountRequest,
) => effect.Effect<
  GetInvitationsCountResponse,
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
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
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
 * Retrieves the status and configuration settings for an Amazon Macie account.
 */
export const getMacieSession: (
  input: GetMacieSessionRequest,
) => effect.Effect<
  GetMacieSessionResponse,
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
  input: GetMacieSessionRequest,
  output: GetMacieSessionResponse,
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
 * (Deprecated) Retrieves information about the Amazon Macie administrator account for an account. This operation has been replaced by the GetAdministratorAccount operation.
 */
export const getMasterAccount: (
  input: GetMasterAccountRequest,
) => effect.Effect<
  GetMasterAccountResponse,
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
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
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
 * Updates the configuration settings for publishing findings to Security Hub.
 */
export const putFindingsPublicationConfiguration: (
  input: PutFindingsPublicationConfigurationRequest,
) => effect.Effect<
  PutFindingsPublicationConfigurationResponse,
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
  input: PutFindingsPublicationConfigurationRequest,
  output: PutFindingsPublicationConfigurationResponse,
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
 * Changes the status of a classification job.
 */
export const updateClassificationJob: (
  input: UpdateClassificationJobRequest,
) => effect.Effect<
  UpdateClassificationJobResponse,
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
  input: UpdateClassificationJobRequest,
  output: UpdateClassificationJobResponse,
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
 * Suspends or re-enables Amazon Macie, or updates the configuration settings for a Macie account.
 */
export const updateMacieSession: (
  input: UpdateMacieSessionRequest,
) => effect.Effect<
  UpdateMacieSessionResponse,
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
  input: UpdateMacieSessionRequest,
  output: UpdateMacieSessionResponse,
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
 * Enables an Amazon Macie administrator to suspend or re-enable Macie for a member account.
 */
export const updateMemberSession: (
  input: UpdateMemberSessionRequest,
) => effect.Effect<
  UpdateMemberSessionResponse,
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
  input: UpdateMemberSessionRequest,
  output: UpdateMemberSessionResponse,
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
 * Updates the Amazon Macie configuration settings for an organization in Organizations.
 */
export const updateOrganizationConfiguration: (
  input: UpdateOrganizationConfigurationRequest,
) => effect.Effect<
  UpdateOrganizationConfigurationResponse,
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
  input: UpdateOrganizationConfigurationRequest,
  output: UpdateOrganizationConfigurationResponse,
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
 * Disassociates a member account from its Amazon Macie administrator account.
 */
export const disassociateFromAdministratorAccount: (
  input: DisassociateFromAdministratorAccountRequest,
) => effect.Effect<
  DisassociateFromAdministratorAccountResponse,
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
  input: DisassociateFromAdministratorAccountRequest,
  output: DisassociateFromAdministratorAccountResponse,
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
 * (Deprecated) Disassociates a member account from its Amazon Macie administrator account. This operation has been replaced by the DisassociateFromAdministratorAccount operation.
 */
export const disassociateFromMasterAccount: (
  input: DisassociateFromMasterAccountRequest,
) => effect.Effect<
  DisassociateFromMasterAccountResponse,
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
  input: DisassociateFromMasterAccountRequest,
  output: DisassociateFromMasterAccountResponse,
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
 * Accepts an Amazon Macie membership invitation that was received from a specific account.
 */
export const acceptInvitation: (
  input: AcceptInvitationRequest,
) => effect.Effect<
  AcceptInvitationResponse,
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
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
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
 * Creates sample findings.
 */
export const createSampleFindings: (
  input: CreateSampleFindingsRequest,
) => effect.Effect<
  CreateSampleFindingsResponse,
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
  input: CreateSampleFindingsRequest,
  output: CreateSampleFindingsResponse,
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
 * Soft deletes a custom data identifier.
 */
export const deleteCustomDataIdentifier: (
  input: DeleteCustomDataIdentifierRequest,
) => effect.Effect<
  DeleteCustomDataIdentifierResponse,
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
  input: DeleteCustomDataIdentifierRequest,
  output: DeleteCustomDataIdentifierResponse,
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
 * Deletes a findings filter.
 */
export const deleteFindingsFilter: (
  input: DeleteFindingsFilterRequest,
) => effect.Effect<
  DeleteFindingsFilterResponse,
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
  input: DeleteFindingsFilterRequest,
  output: DeleteFindingsFilterResponse,
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
 * Deletes the association between an Amazon Macie administrator account and an account.
 */
export const deleteMember: (
  input: DeleteMemberRequest,
) => effect.Effect<
  DeleteMemberResponse,
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
  input: DeleteMemberRequest,
  output: DeleteMemberResponse,
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
 * Retrieves the Amazon Macie configuration settings for an organization in Organizations.
 */
export const describeOrganizationConfiguration: (
  input: DescribeOrganizationConfigurationRequest,
) => effect.Effect<
  DescribeOrganizationConfigurationResponse,
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
  input: DescribeOrganizationConfigurationRequest,
  output: DescribeOrganizationConfigurationResponse,
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
 * Declines Amazon Macie membership invitations that were received from specific accounts.
 */
export const declineInvitations: (
  input: DeclineInvitationsRequest,
) => effect.Effect<
  DeclineInvitationsResponse,
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
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
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
 * Deletes Amazon Macie membership invitations that were received from specific accounts.
 */
export const deleteInvitations: (
  input: DeleteInvitationsRequest,
) => effect.Effect<
  DeleteInvitationsResponse,
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
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
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
 * Updates the sensitivity score for an S3 bucket.
 */
export const updateResourceProfile: (
  input: UpdateResourceProfileRequest,
) => effect.Effect<
  UpdateResourceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceProfileRequest,
  output: UpdateResourceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Disables Amazon Macie and deletes all settings and resources for a Macie account.
 */
export const disableMacie: (
  input: DisableMacieRequest,
) => effect.Effect<
  DisableMacieResponse,
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
  input: DisableMacieRequest,
  output: DisableMacieResponse,
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
 * Retrieves information about the Amazon Macie administrator account for an account.
 */
export const getAdministratorAccount: (
  input: GetAdministratorAccountRequest,
) => effect.Effect<
  GetAdministratorAccountResponse,
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
  input: GetAdministratorAccountRequest,
  output: GetAdministratorAccountResponse,
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
 * Retrieves information about one or more custom data identifiers.
 */
export const batchGetCustomDataIdentifiers: (
  input: BatchGetCustomDataIdentifiersRequest,
) => effect.Effect<
  BatchGetCustomDataIdentifiersResponse,
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
  input: BatchGetCustomDataIdentifiersRequest,
  output: BatchGetCustomDataIdentifiersResponse,
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
 * Creates and defines the criteria and other settings for a custom data identifier.
 */
export const createCustomDataIdentifier: (
  input: CreateCustomDataIdentifierRequest,
) => effect.Effect<
  CreateCustomDataIdentifierResponse,
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
  input: CreateCustomDataIdentifierRequest,
  output: CreateCustomDataIdentifierResponse,
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
 * Sends an Amazon Macie membership invitation to one or more accounts.
 */
export const createInvitations: (
  input: CreateInvitationsRequest,
) => effect.Effect<
  CreateInvitationsResponse,
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
  input: CreateInvitationsRequest,
  output: CreateInvitationsResponse,
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
 * Associates an account with an Amazon Macie administrator account.
 */
export const createMember: (
  input: CreateMemberRequest,
) => effect.Effect<
  CreateMemberResponse,
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
  input: CreateMemberRequest,
  output: CreateMemberResponse,
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
 * Retrieves the status and settings for a classification job.
 */
export const describeClassificationJob: (
  input: DescribeClassificationJobRequest,
) => effect.Effect<
  DescribeClassificationJobResponse,
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
  input: DescribeClassificationJobRequest,
  output: DescribeClassificationJobResponse,
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
 * Retrieves the configuration settings for storing data classification results.
 */
export const getClassificationExportConfiguration: (
  input: GetClassificationExportConfigurationRequest,
) => effect.Effect<
  GetClassificationExportConfigurationResponse,
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
  input: GetClassificationExportConfigurationRequest,
  output: GetClassificationExportConfigurationResponse,
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
 * Creates and defines the settings for an allow list.
 */
export const createAllowList: (
  input: CreateAllowListRequest,
) => effect.Effect<
  CreateAllowListResponse,
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
  input: CreateAllowListRequest,
  output: CreateAllowListResponse,
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
 * Retrieves (queries) aggregated statistical data about all the S3 buckets that Amazon Macie monitors and analyzes for an account.
 */
export const getBucketStatistics: (
  input: GetBucketStatisticsRequest,
) => effect.Effect<
  GetBucketStatisticsResponse,
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
  input: GetBucketStatisticsRequest,
  output: GetBucketStatisticsResponse,
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
 * Creates and defines the criteria and other settings for a findings filter.
 */
export const createFindingsFilter: (
  input: CreateFindingsFilterRequest,
) => effect.Effect<
  CreateFindingsFilterResponse,
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
  input: CreateFindingsFilterRequest,
  output: CreateFindingsFilterResponse,
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
 * Retrieves occurrences of sensitive data reported by a finding.
 */
export const getSensitiveDataOccurrences: (
  input: GetSensitiveDataOccurrencesRequest,
) => effect.Effect<
  GetSensitiveDataOccurrencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSensitiveDataOccurrencesRequest,
  output: GetSensitiveDataOccurrencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnprocessableEntityException,
  ],
}));
/**
 * Retrieves a subset of information about one or more classification jobs.
 */
export const listClassificationJobs: {
  (
    input: ListClassificationJobsRequest,
  ): effect.Effect<
    ListClassificationJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClassificationJobsRequest,
  ) => stream.Stream<
    ListClassificationJobsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClassificationJobsRequest,
  ) => stream.Stream<
    JobSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClassificationJobsRequest,
  output: ListClassificationJobsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves (queries) quotas and aggregated usage data for one or more accounts.
 */
export const getUsageStatistics: {
  (
    input: GetUsageStatisticsRequest,
  ): effect.Effect<
    GetUsageStatisticsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUsageStatisticsRequest,
  ) => stream.Stream<
    GetUsageStatisticsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUsageStatisticsRequest,
  ) => stream.Stream<
    UsageRecord,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUsageStatisticsRequest,
  output: GetUsageStatisticsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "records",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates and defines the settings for a classification job.
 */
export const createClassificationJob: (
  input: CreateClassificationJobRequest,
) => effect.Effect<
  CreateClassificationJobResponse,
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
  input: CreateClassificationJobRequest,
  output: CreateClassificationJobResponse,
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
 * Retrieves (queries) statistical data and other information about one or more S3 buckets that Amazon Macie monitors and analyzes for an account.
 */
export const describeBuckets: {
  (
    input: DescribeBucketsRequest,
  ): effect.Effect<
    DescribeBucketsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBucketsRequest,
  ) => stream.Stream<
    DescribeBucketsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBucketsRequest,
  ) => stream.Stream<
    BucketMetadata,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeBucketsRequest,
  output: DescribeBucketsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "buckets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves (queries) statistical data and other information about Amazon Web Services resources that Amazon Macie monitors and analyzes for an account.
 */
export const searchResources: {
  (
    input: SearchResourcesRequest,
  ): effect.Effect<
    SearchResourcesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchResourcesRequest,
  ) => stream.Stream<
    SearchResourcesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchResourcesRequest,
  ) => stream.Stream<
    MatchingResource,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchResourcesRequest,
  output: SearchResourcesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "matchingResources",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the details of one or more findings.
 */
export const getFindings: (
  input: GetFindingsRequest,
) => effect.Effect<
  GetFindingsResponse,
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
  input: GetFindingsRequest,
  output: GetFindingsResponse,
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
