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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "AuditManager",
  serviceShapeName: "BedrockAssessmentManagerLambda",
});
const auth = T.AwsAuthSigv4({ name: "auditmanager" });
const ver = T.ServiceVersion("2017-07-25");
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
              `https://auditmanager-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://auditmanager-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://auditmanager.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://auditmanager.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type UUID = string;
export type ControlSetId = string;
export type AssessmentName = string | redacted.Redacted<string>;
export type AssessmentDescription = string | redacted.Redacted<string>;
export type FrameworkName = string;
export type FrameworkDescription = string;
export type ComplianceType = string | redacted.Redacted<string>;
export type AssessmentReportName = string;
export type AssessmentReportDescription = string | redacted.Redacted<string>;
export type QueryStatement = string;
export type ControlName = string;
export type ControlDescription = string | redacted.Redacted<string>;
export type TestingInformation = string | redacted.Redacted<string>;
export type ActionPlanTitle = string | redacted.Redacted<string>;
export type ActionPlanInstructions = string | redacted.Redacted<string>;
export type AccountId = string;
export type Token = string;
export type MaxResults = number;
export type ManualEvidenceLocalFileName = string | redacted.Redacted<string>;
export type OrganizationId = string;
export type ControlDomainId = string;
export type ControlCatalogId = string;
export type AuditManagerArn = string;
export type KmsKey = string;
export type Region = string;
export type ShareRequestComment = string;
export type TagKey = string;
export type ControlCommentBody = string | redacted.Redacted<string>;
export type DelegationComment = string | redacted.Redacted<string>;
export type SnsArn = string;
export type S3Url = string;
export type IamArn = string;
export type ManualEvidenceTextResponse = string | redacted.Redacted<string>;
export type TagValue = string;
export type ControlSetName = string;
export type SourceName = string;
export type SourceDescription = string;
export type TroubleshootingText = string | redacted.Redacted<string>;
export type AWSServiceName = string;
export type NonEmptyString = string;
export type KeywordValue = string;
export type EmailAddress = string | redacted.Redacted<string>;
export type AccountName = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type Username = string | redacted.Redacted<string>;
export type Filename = string;
export type ControlSources = string;
export type CreatedBy = string | redacted.Redacted<string>;
export type LastUpdatedBy = string | redacted.Redacted<string>;
export type HyperlinkName = string;
export type UrlLink = string;
export type EventName = string;
export type AssessmentEvidenceFolderName = string;
export type SNSTopic = string | redacted.Redacted<string>;
export type ControlsCount = number;
export type ControlSetsCount = number;
export type TimestampUUID = string;
export type GenericArn = string;
export type EvidenceAttributeKey = string;
export type EvidenceAttributeValue = string;
export type CloudTrailArn = string;
export type AssessmentFrameworkDescription = string;

//# Schemas
export interface DeregisterAccountRequest {}
export const DeregisterAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/account/deregisterAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterAccountRequest",
}) as any as S.Schema<DeregisterAccountRequest>;
export interface GetAccountStatusRequest {}
export const GetAccountStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/account/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountStatusRequest",
}) as any as S.Schema<GetAccountStatusRequest>;
export interface GetInsightsRequest {}
export const GetInsightsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightsRequest",
}) as any as S.Schema<GetInsightsRequest>;
export interface GetOrganizationAdminAccountRequest {}
export const GetOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/account/organizationAdminAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOrganizationAdminAccountRequest",
}) as any as S.Schema<GetOrganizationAdminAccountRequest>;
export interface GetServicesInScopeRequest {}
export const GetServicesInScopeRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/services" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServicesInScopeRequest",
}) as any as S.Schema<GetServicesInScopeRequest>;
export type EvidenceIds = string[];
export const EvidenceIds = S.Array(S.String);
export type DelegationIds = string[];
export const DelegationIds = S.Array(S.String);
export type ShareRequestType = "SENT" | "RECEIVED" | (string & {});
export const ShareRequestType = S.String;
export type AccountStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_ACTIVATION"
  | (string & {});
export const AccountStatus = S.String;
export type SettingAttribute =
  | "ALL"
  | "IS_AWS_ORG_ENABLED"
  | "SNS_TOPIC"
  | "DEFAULT_ASSESSMENT_REPORTS_DESTINATION"
  | "DEFAULT_PROCESS_OWNERS"
  | "EVIDENCE_FINDER_ENABLEMENT"
  | "DEREGISTRATION_POLICY"
  | "DEFAULT_EXPORT_DESTINATION"
  | (string & {});
export const SettingAttribute = S.String;
export type FrameworkType = "Standard" | "Custom" | (string & {});
export const FrameworkType = S.String;
export type AssessmentStatus = "ACTIVE" | "INACTIVE" | (string & {});
export const AssessmentStatus = S.String;
export type ControlType = "Standard" | "Custom" | "Core" | (string & {});
export const ControlType = S.String;
export type DataSourceType =
  | "AWS_Cloudtrail"
  | "AWS_Config"
  | "AWS_Security_Hub"
  | "AWS_API_Call"
  | "MANUAL"
  | (string & {});
export const DataSourceType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ControlStatus =
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "INACTIVE"
  | (string & {});
export const ControlStatus = S.String;
export type ControlSetStatus =
  | "ACTIVE"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | (string & {});
export const ControlSetStatus = S.String;
export type ShareRequestAction =
  | "ACCEPT"
  | "DECLINE"
  | "REVOKE"
  | (string & {});
export const ShareRequestAction = S.String;
export interface AssociateAssessmentReportEvidenceFolderRequest {
  assessmentId: string;
  evidenceFolderId: string;
}
export const AssociateAssessmentReportEvidenceFolderRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    evidenceFolderId: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/associateToAssessmentReport",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateAssessmentReportEvidenceFolderRequest",
}) as any as S.Schema<AssociateAssessmentReportEvidenceFolderRequest>;
export interface AssociateAssessmentReportEvidenceFolderResponse {}
export const AssociateAssessmentReportEvidenceFolderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateAssessmentReportEvidenceFolderResponse",
}) as any as S.Schema<AssociateAssessmentReportEvidenceFolderResponse>;
export interface BatchAssociateAssessmentReportEvidenceRequest {
  assessmentId: string;
  evidenceFolderId: string;
  evidenceIds: string[];
}
export const BatchAssociateAssessmentReportEvidenceRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    evidenceFolderId: S.String,
    evidenceIds: EvidenceIds,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/batchAssociateToAssessmentReport",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAssociateAssessmentReportEvidenceRequest",
}) as any as S.Schema<BatchAssociateAssessmentReportEvidenceRequest>;
export interface BatchDeleteDelegationByAssessmentRequest {
  delegationIds: string[];
  assessmentId: string;
}
export const BatchDeleteDelegationByAssessmentRequest = S.suspend(() =>
  S.Struct({
    delegationIds: DelegationIds,
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assessments/{assessmentId}/delegations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteDelegationByAssessmentRequest",
}) as any as S.Schema<BatchDeleteDelegationByAssessmentRequest>;
export interface BatchDisassociateAssessmentReportEvidenceRequest {
  assessmentId: string;
  evidenceFolderId: string;
  evidenceIds: string[];
}
export const BatchDisassociateAssessmentReportEvidenceRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    evidenceFolderId: S.String,
    evidenceIds: EvidenceIds,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/batchDisassociateFromAssessmentReport",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDisassociateAssessmentReportEvidenceRequest",
}) as any as S.Schema<BatchDisassociateAssessmentReportEvidenceRequest>;
export interface CreateAssessmentReportRequest {
  name: string;
  description?: string | redacted.Redacted<string>;
  assessmentId: string;
  queryStatement?: string;
}
export const CreateAssessmentReportRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    queryStatement: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assessments/{assessmentId}/reports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssessmentReportRequest",
}) as any as S.Schema<CreateAssessmentReportRequest>;
export interface DeleteAssessmentRequest {
  assessmentId: string;
}
export const DeleteAssessmentRequest = S.suspend(() =>
  S.Struct({ assessmentId: S.String.pipe(T.HttpLabel("assessmentId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assessments/{assessmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssessmentRequest",
}) as any as S.Schema<DeleteAssessmentRequest>;
export interface DeleteAssessmentResponse {}
export const DeleteAssessmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentResponse",
}) as any as S.Schema<DeleteAssessmentResponse>;
export interface DeleteAssessmentFrameworkRequest {
  frameworkId: string;
}
export const DeleteAssessmentFrameworkRequest = S.suspend(() =>
  S.Struct({ frameworkId: S.String.pipe(T.HttpLabel("frameworkId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/assessmentFrameworks/{frameworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssessmentFrameworkRequest",
}) as any as S.Schema<DeleteAssessmentFrameworkRequest>;
export interface DeleteAssessmentFrameworkResponse {}
export const DeleteAssessmentFrameworkResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentFrameworkResponse",
}) as any as S.Schema<DeleteAssessmentFrameworkResponse>;
export interface DeleteAssessmentFrameworkShareRequest {
  requestId: string;
  requestType: ShareRequestType;
}
export const DeleteAssessmentFrameworkShareRequest = S.suspend(() =>
  S.Struct({
    requestId: S.String.pipe(T.HttpLabel("requestId")),
    requestType: ShareRequestType.pipe(T.HttpQuery("requestType")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assessmentFrameworkShareRequests/{requestId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssessmentFrameworkShareRequest",
}) as any as S.Schema<DeleteAssessmentFrameworkShareRequest>;
export interface DeleteAssessmentFrameworkShareResponse {}
export const DeleteAssessmentFrameworkShareResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentFrameworkShareResponse",
}) as any as S.Schema<DeleteAssessmentFrameworkShareResponse>;
export interface DeleteAssessmentReportRequest {
  assessmentId: string;
  assessmentReportId: string;
}
export const DeleteAssessmentReportRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    assessmentReportId: S.String.pipe(T.HttpLabel("assessmentReportId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/assessments/{assessmentId}/reports/{assessmentReportId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssessmentReportRequest",
}) as any as S.Schema<DeleteAssessmentReportRequest>;
export interface DeleteAssessmentReportResponse {}
export const DeleteAssessmentReportResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentReportResponse",
}) as any as S.Schema<DeleteAssessmentReportResponse>;
export interface DeleteControlRequest {
  controlId: string;
}
export const DeleteControlRequest = S.suspend(() =>
  S.Struct({ controlId: S.String.pipe(T.HttpLabel("controlId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/controls/{controlId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteControlRequest",
}) as any as S.Schema<DeleteControlRequest>;
export interface DeleteControlResponse {}
export const DeleteControlResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteControlResponse",
}) as any as S.Schema<DeleteControlResponse>;
export interface DeregisterAccountResponse {
  status?: AccountStatus;
}
export const DeregisterAccountResponse = S.suspend(() =>
  S.Struct({ status: S.optional(AccountStatus) }),
).annotations({
  identifier: "DeregisterAccountResponse",
}) as any as S.Schema<DeregisterAccountResponse>;
export interface DeregisterOrganizationAdminAccountRequest {
  adminAccountId?: string;
}
export const DeregisterOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({ adminAccountId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/account/deregisterOrganizationAdminAccount",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterOrganizationAdminAccountRequest",
}) as any as S.Schema<DeregisterOrganizationAdminAccountRequest>;
export interface DeregisterOrganizationAdminAccountResponse {}
export const DeregisterOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterOrganizationAdminAccountResponse",
}) as any as S.Schema<DeregisterOrganizationAdminAccountResponse>;
export interface DisassociateAssessmentReportEvidenceFolderRequest {
  assessmentId: string;
  evidenceFolderId: string;
}
export const DisassociateAssessmentReportEvidenceFolderRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    evidenceFolderId: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/disassociateFromAssessmentReport",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateAssessmentReportEvidenceFolderRequest",
}) as any as S.Schema<DisassociateAssessmentReportEvidenceFolderRequest>;
export interface DisassociateAssessmentReportEvidenceFolderResponse {}
export const DisassociateAssessmentReportEvidenceFolderResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DisassociateAssessmentReportEvidenceFolderResponse",
}) as any as S.Schema<DisassociateAssessmentReportEvidenceFolderResponse>;
export interface GetAccountStatusResponse {
  status?: AccountStatus;
}
export const GetAccountStatusResponse = S.suspend(() =>
  S.Struct({ status: S.optional(AccountStatus) }),
).annotations({
  identifier: "GetAccountStatusResponse",
}) as any as S.Schema<GetAccountStatusResponse>;
export interface GetAssessmentRequest {
  assessmentId: string;
}
export const GetAssessmentRequest = S.suspend(() =>
  S.Struct({ assessmentId: S.String.pipe(T.HttpLabel("assessmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessments/{assessmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssessmentRequest",
}) as any as S.Schema<GetAssessmentRequest>;
export interface GetAssessmentFrameworkRequest {
  frameworkId: string;
}
export const GetAssessmentFrameworkRequest = S.suspend(() =>
  S.Struct({ frameworkId: S.String.pipe(T.HttpLabel("frameworkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessmentFrameworks/{frameworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssessmentFrameworkRequest",
}) as any as S.Schema<GetAssessmentFrameworkRequest>;
export interface GetAssessmentReportUrlRequest {
  assessmentReportId: string;
  assessmentId: string;
}
export const GetAssessmentReportUrlRequest = S.suspend(() =>
  S.Struct({
    assessmentReportId: S.String.pipe(T.HttpLabel("assessmentReportId")),
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/reports/{assessmentReportId}/url",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssessmentReportUrlRequest",
}) as any as S.Schema<GetAssessmentReportUrlRequest>;
export interface GetChangeLogsRequest {
  assessmentId: string;
  controlSetId?: string;
  controlId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetChangeLogsRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.optional(S.String).pipe(T.HttpQuery("controlSetId")),
    controlId: S.optional(S.String).pipe(T.HttpQuery("controlId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessments/{assessmentId}/changelogs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChangeLogsRequest",
}) as any as S.Schema<GetChangeLogsRequest>;
export interface GetControlRequest {
  controlId: string;
}
export const GetControlRequest = S.suspend(() =>
  S.Struct({ controlId: S.String.pipe(T.HttpLabel("controlId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/controls/{controlId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetControlRequest",
}) as any as S.Schema<GetControlRequest>;
export interface GetDelegationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const GetDelegationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/delegations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDelegationsRequest",
}) as any as S.Schema<GetDelegationsRequest>;
export interface GetEvidenceRequest {
  assessmentId: string;
  controlSetId: string;
  evidenceFolderId: string;
  evidenceId: string;
}
export const GetEvidenceRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    evidenceFolderId: S.String.pipe(T.HttpLabel("evidenceFolderId")),
    evidenceId: S.String.pipe(T.HttpLabel("evidenceId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}/evidence/{evidenceId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceRequest",
}) as any as S.Schema<GetEvidenceRequest>;
export interface GetEvidenceByEvidenceFolderRequest {
  assessmentId: string;
  controlSetId: string;
  evidenceFolderId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetEvidenceByEvidenceFolderRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    evidenceFolderId: S.String.pipe(T.HttpLabel("evidenceFolderId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}/evidence",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceByEvidenceFolderRequest",
}) as any as S.Schema<GetEvidenceByEvidenceFolderRequest>;
export interface GetEvidenceFileUploadUrlRequest {
  fileName: string | redacted.Redacted<string>;
}
export const GetEvidenceFileUploadUrlRequest = S.suspend(() =>
  S.Struct({ fileName: SensitiveString.pipe(T.HttpQuery("fileName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/evidenceFileUploadUrl" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceFileUploadUrlRequest",
}) as any as S.Schema<GetEvidenceFileUploadUrlRequest>;
export interface GetEvidenceFolderRequest {
  assessmentId: string;
  controlSetId: string;
  evidenceFolderId: string;
}
export const GetEvidenceFolderRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    evidenceFolderId: S.String.pipe(T.HttpLabel("evidenceFolderId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/evidenceFolders/{evidenceFolderId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceFolderRequest",
}) as any as S.Schema<GetEvidenceFolderRequest>;
export interface GetEvidenceFoldersByAssessmentRequest {
  assessmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetEvidenceFoldersByAssessmentRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/evidenceFolders",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceFoldersByAssessmentRequest",
}) as any as S.Schema<GetEvidenceFoldersByAssessmentRequest>;
export interface GetEvidenceFoldersByAssessmentControlRequest {
  assessmentId: string;
  controlSetId: string;
  controlId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetEvidenceFoldersByAssessmentControlRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    controlId: S.String.pipe(T.HttpLabel("controlId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/assessments/{assessmentId}/evidenceFolders-by-assessment-control/{controlSetId}/{controlId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvidenceFoldersByAssessmentControlRequest",
}) as any as S.Schema<GetEvidenceFoldersByAssessmentControlRequest>;
export interface GetInsightsByAssessmentRequest {
  assessmentId: string;
}
export const GetInsightsByAssessmentRequest = S.suspend(() =>
  S.Struct({ assessmentId: S.String.pipe(T.HttpLabel("assessmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/assessments/{assessmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInsightsByAssessmentRequest",
}) as any as S.Schema<GetInsightsByAssessmentRequest>;
export interface GetOrganizationAdminAccountResponse {
  adminAccountId?: string;
  organizationId?: string;
}
export const GetOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({
    adminAccountId: S.optional(S.String),
    organizationId: S.optional(S.String),
  }),
).annotations({
  identifier: "GetOrganizationAdminAccountResponse",
}) as any as S.Schema<GetOrganizationAdminAccountResponse>;
export interface GetSettingsRequest {
  attribute: SettingAttribute;
}
export const GetSettingsRequest = S.suspend(() =>
  S.Struct({ attribute: SettingAttribute.pipe(T.HttpLabel("attribute")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/settings/{attribute}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSettingsRequest",
}) as any as S.Schema<GetSettingsRequest>;
export interface ListAssessmentControlInsightsByControlDomainRequest {
  controlDomainId: string;
  assessmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentControlInsightsByControlDomainRequest = S.suspend(
  () =>
    S.Struct({
      controlDomainId: S.String.pipe(T.HttpQuery("controlDomainId")),
      assessmentId: S.String.pipe(T.HttpQuery("assessmentId")),
      nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
      maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    }).pipe(
      T.all(
        T.Http({ method: "GET", uri: "/insights/controls-by-assessment" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "ListAssessmentControlInsightsByControlDomainRequest",
}) as any as S.Schema<ListAssessmentControlInsightsByControlDomainRequest>;
export interface ListAssessmentFrameworksRequest {
  frameworkType: FrameworkType;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentFrameworksRequest = S.suspend(() =>
  S.Struct({
    frameworkType: FrameworkType.pipe(T.HttpQuery("frameworkType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessmentFrameworks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssessmentFrameworksRequest",
}) as any as S.Schema<ListAssessmentFrameworksRequest>;
export interface ListAssessmentFrameworkShareRequestsRequest {
  requestType: ShareRequestType;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentFrameworkShareRequestsRequest = S.suspend(() =>
  S.Struct({
    requestType: ShareRequestType.pipe(T.HttpQuery("requestType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessmentFrameworkShareRequests" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssessmentFrameworkShareRequestsRequest",
}) as any as S.Schema<ListAssessmentFrameworkShareRequestsRequest>;
export interface ListAssessmentReportsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentReportsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessmentReports" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssessmentReportsRequest",
}) as any as S.Schema<ListAssessmentReportsRequest>;
export interface ListAssessmentsRequest {
  status?: AssessmentStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentsRequest = S.suspend(() =>
  S.Struct({
    status: S.optional(AssessmentStatus).pipe(T.HttpQuery("status")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/assessments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssessmentsRequest",
}) as any as S.Schema<ListAssessmentsRequest>;
export interface ListControlDomainInsightsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListControlDomainInsightsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/control-domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlDomainInsightsRequest",
}) as any as S.Schema<ListControlDomainInsightsRequest>;
export interface ListControlDomainInsightsByAssessmentRequest {
  assessmentId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListControlDomainInsightsByAssessmentRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpQuery("assessmentId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/control-domains-by-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlDomainInsightsByAssessmentRequest",
}) as any as S.Schema<ListControlDomainInsightsByAssessmentRequest>;
export interface ListControlInsightsByControlDomainRequest {
  controlDomainId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListControlInsightsByControlDomainRequest = S.suspend(() =>
  S.Struct({
    controlDomainId: S.String.pipe(T.HttpQuery("controlDomainId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlInsightsByControlDomainRequest",
}) as any as S.Schema<ListControlInsightsByControlDomainRequest>;
export interface ListControlsRequest {
  controlType: ControlType;
  nextToken?: string;
  maxResults?: number;
  controlCatalogId?: string;
}
export const ListControlsRequest = S.suspend(() =>
  S.Struct({
    controlType: ControlType.pipe(T.HttpQuery("controlType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    controlCatalogId: S.optional(S.String).pipe(
      T.HttpQuery("controlCatalogId"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlsRequest",
}) as any as S.Schema<ListControlsRequest>;
export interface ListKeywordsForDataSourceRequest {
  source: DataSourceType;
  nextToken?: string;
  maxResults?: number;
}
export const ListKeywordsForDataSourceRequest = S.suspend(() =>
  S.Struct({
    source: DataSourceType.pipe(T.HttpQuery("source")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/dataSourceKeywords" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeywordsForDataSourceRequest",
}) as any as S.Schema<ListKeywordsForDataSourceRequest>;
export interface ListNotificationsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListNotificationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/notifications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationsRequest",
}) as any as S.Schema<ListNotificationsRequest>;
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
export interface RegisterAccountRequest {
  kmsKey?: string;
  delegatedAdminAccount?: string;
}
export const RegisterAccountRequest = S.suspend(() =>
  S.Struct({
    kmsKey: S.optional(S.String),
    delegatedAdminAccount: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/account/registerAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAccountRequest",
}) as any as S.Schema<RegisterAccountRequest>;
export interface RegisterOrganizationAdminAccountRequest {
  adminAccountId: string;
}
export const RegisterOrganizationAdminAccountRequest = S.suspend(() =>
  S.Struct({ adminAccountId: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/account/registerOrganizationAdminAccount",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterOrganizationAdminAccountRequest",
}) as any as S.Schema<RegisterOrganizationAdminAccountRequest>;
export interface StartAssessmentFrameworkShareRequest {
  frameworkId: string;
  destinationAccount: string;
  destinationRegion: string;
  comment?: string;
}
export const StartAssessmentFrameworkShareRequest = S.suspend(() =>
  S.Struct({
    frameworkId: S.String.pipe(T.HttpLabel("frameworkId")),
    destinationAccount: S.String,
    destinationRegion: S.String,
    comment: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assessmentFrameworks/{frameworkId}/shareRequests",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAssessmentFrameworkShareRequest",
}) as any as S.Schema<StartAssessmentFrameworkShareRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export interface AWSAccount {
  id?: string;
  emailAddress?: string | redacted.Redacted<string>;
  name?: string;
}
export const AWSAccount = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    emailAddress: S.optional(SensitiveString),
    name: S.optional(S.String),
  }),
).annotations({ identifier: "AWSAccount" }) as any as S.Schema<AWSAccount>;
export type AWSAccounts = AWSAccount[];
export const AWSAccounts = S.Array(AWSAccount);
export interface AWSService {
  serviceName?: string;
}
export const AWSService = S.suspend(() =>
  S.Struct({ serviceName: S.optional(S.String) }),
).annotations({ identifier: "AWSService" }) as any as S.Schema<AWSService>;
export type AWSServices = AWSService[];
export const AWSServices = S.Array(AWSService);
export interface Scope {
  awsAccounts?: AWSAccount[];
  awsServices?: AWSService[];
}
export const Scope = S.suspend(() =>
  S.Struct({
    awsAccounts: S.optional(AWSAccounts),
    awsServices: S.optional(AWSServices),
  }),
).annotations({ identifier: "Scope" }) as any as S.Schema<Scope>;
export type AssessmentReportDestinationType = "S3" | (string & {});
export const AssessmentReportDestinationType = S.String;
export interface AssessmentReportsDestination {
  destinationType?: AssessmentReportDestinationType;
  destination?: string;
}
export const AssessmentReportsDestination = S.suspend(() =>
  S.Struct({
    destinationType: S.optional(AssessmentReportDestinationType),
    destination: S.optional(S.String),
  }),
).annotations({
  identifier: "AssessmentReportsDestination",
}) as any as S.Schema<AssessmentReportsDestination>;
export type RoleType = "PROCESS_OWNER" | "RESOURCE_OWNER" | (string & {});
export const RoleType = S.String;
export interface Role {
  roleType: RoleType;
  roleArn: string;
}
export const Role = S.suspend(() =>
  S.Struct({ roleType: RoleType, roleArn: S.String }),
).annotations({ identifier: "Role" }) as any as S.Schema<Role>;
export type Roles = Role[];
export const Roles = S.Array(Role);
export interface UpdateAssessmentRequest {
  assessmentId: string;
  assessmentName?: string | redacted.Redacted<string>;
  assessmentDescription?: string | redacted.Redacted<string>;
  scope: Scope;
  assessmentReportsDestination?: AssessmentReportsDestination;
  roles?: Role[];
}
export const UpdateAssessmentRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    assessmentName: S.optional(SensitiveString),
    assessmentDescription: S.optional(SensitiveString),
    scope: Scope,
    assessmentReportsDestination: S.optional(AssessmentReportsDestination),
    roles: S.optional(Roles),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assessments/{assessmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentRequest",
}) as any as S.Schema<UpdateAssessmentRequest>;
export interface UpdateAssessmentControlRequest {
  assessmentId: string;
  controlSetId: string;
  controlId: string;
  controlStatus?: ControlStatus;
  commentBody?: string | redacted.Redacted<string>;
}
export const UpdateAssessmentControlRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    controlId: S.String.pipe(T.HttpLabel("controlId")),
    controlStatus: S.optional(ControlStatus),
    commentBody: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/controls/{controlId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentControlRequest",
}) as any as S.Schema<UpdateAssessmentControlRequest>;
export interface UpdateAssessmentControlSetStatusRequest {
  assessmentId: string;
  controlSetId: string;
  status: ControlSetStatus;
  comment: string | redacted.Redacted<string>;
}
export const UpdateAssessmentControlSetStatusRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    status: ControlSetStatus,
    comment: SensitiveString,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentControlSetStatusRequest",
}) as any as S.Schema<UpdateAssessmentControlSetStatusRequest>;
export interface UpdateAssessmentFrameworkShareRequest {
  requestId: string;
  requestType: ShareRequestType;
  action: ShareRequestAction;
}
export const UpdateAssessmentFrameworkShareRequest = S.suspend(() =>
  S.Struct({
    requestId: S.String.pipe(T.HttpLabel("requestId")),
    requestType: ShareRequestType,
    action: ShareRequestAction,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/assessmentFrameworkShareRequests/{requestId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentFrameworkShareRequest",
}) as any as S.Schema<UpdateAssessmentFrameworkShareRequest>;
export interface UpdateAssessmentStatusRequest {
  assessmentId: string;
  status: AssessmentStatus;
}
export const UpdateAssessmentStatusRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    status: AssessmentStatus,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assessments/{assessmentId}/status" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentStatusRequest",
}) as any as S.Schema<UpdateAssessmentStatusRequest>;
export interface ValidateAssessmentReportIntegrityRequest {
  s3RelativePath: string;
}
export const ValidateAssessmentReportIntegrityRequest = S.suspend(() =>
  S.Struct({ s3RelativePath: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assessmentReports/integrity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ValidateAssessmentReportIntegrityRequest",
}) as any as S.Schema<ValidateAssessmentReportIntegrityRequest>;
export type SourceSetUpOption =
  | "System_Controls_Mapping"
  | "Procedural_Controls_Mapping"
  | (string & {});
export const SourceSetUpOption = S.String;
export type SourceType =
  | "AWS_Cloudtrail"
  | "AWS_Config"
  | "AWS_Security_Hub"
  | "AWS_API_Call"
  | "MANUAL"
  | "Common_Control"
  | "Core_Control"
  | (string & {});
export const SourceType = S.String;
export type SourceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | (string & {});
export const SourceFrequency = S.String;
export type DeleteResources = "ALL" | "DEFAULT" | (string & {});
export const DeleteResources = S.String;
export type ExportDestinationType = "S3" | (string & {});
export const ExportDestinationType = S.String;
export interface CreateDelegationRequest {
  comment?: string | redacted.Redacted<string>;
  controlSetId?: string;
  roleArn?: string;
  roleType?: RoleType;
}
export const CreateDelegationRequest = S.suspend(() =>
  S.Struct({
    comment: S.optional(SensitiveString),
    controlSetId: S.optional(S.String),
    roleArn: S.optional(S.String),
    roleType: S.optional(RoleType),
  }),
).annotations({
  identifier: "CreateDelegationRequest",
}) as any as S.Schema<CreateDelegationRequest>;
export type CreateDelegationRequests = CreateDelegationRequest[];
export const CreateDelegationRequests = S.Array(CreateDelegationRequest);
export interface ManualEvidence {
  s3ResourcePath?: string;
  textResponse?: string | redacted.Redacted<string>;
  evidenceFileName?: string | redacted.Redacted<string>;
}
export const ManualEvidence = S.suspend(() =>
  S.Struct({
    s3ResourcePath: S.optional(S.String),
    textResponse: S.optional(SensitiveString),
    evidenceFileName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ManualEvidence",
}) as any as S.Schema<ManualEvidence>;
export type ManualEvidenceList = ManualEvidence[];
export const ManualEvidenceList = S.Array(ManualEvidence);
export interface Resource {
  arn?: string;
  value?: string;
  complianceCheck?: string;
}
export const Resource = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    value: S.optional(S.String),
    complianceCheck: S.optional(S.String),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export type EvidenceAttributes = { [key: string]: string | undefined };
export const EvidenceAttributes = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Evidence {
  dataSource?: string;
  evidenceAwsAccountId?: string;
  time?: Date;
  eventSource?: string;
  eventName?: string;
  evidenceByType?: string;
  resourcesIncluded?: Resource[];
  attributes?: { [key: string]: string | undefined };
  iamId?: string;
  complianceCheck?: string;
  awsOrganization?: string;
  awsAccountId?: string;
  evidenceFolderId?: string;
  id?: string;
  assessmentReportSelection?: string;
}
export const Evidence = S.suspend(() =>
  S.Struct({
    dataSource: S.optional(S.String),
    evidenceAwsAccountId: S.optional(S.String),
    time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    eventSource: S.optional(S.String),
    eventName: S.optional(S.String),
    evidenceByType: S.optional(S.String),
    resourcesIncluded: S.optional(Resources),
    attributes: S.optional(EvidenceAttributes),
    iamId: S.optional(S.String),
    complianceCheck: S.optional(S.String),
    awsOrganization: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    evidenceFolderId: S.optional(S.String),
    id: S.optional(S.String),
    assessmentReportSelection: S.optional(S.String),
  }),
).annotations({ identifier: "Evidence" }) as any as S.Schema<Evidence>;
export type EvidenceList = Evidence[];
export const EvidenceList = S.Array(Evidence);
export interface AssessmentEvidenceFolder {
  name?: string;
  date?: Date;
  assessmentId?: string;
  controlSetId?: string;
  controlId?: string;
  id?: string;
  dataSource?: string;
  author?: string;
  totalEvidence?: number;
  assessmentReportSelectionCount?: number;
  controlName?: string;
  evidenceResourcesIncludedCount?: number;
  evidenceByTypeConfigurationDataCount?: number;
  evidenceByTypeManualCount?: number;
  evidenceByTypeComplianceCheckCount?: number;
  evidenceByTypeComplianceCheckIssuesCount?: number;
  evidenceByTypeUserActivityCount?: number;
  evidenceAwsServiceSourceCount?: number;
}
export const AssessmentEvidenceFolder = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    assessmentId: S.optional(S.String),
    controlSetId: S.optional(S.String),
    controlId: S.optional(S.String),
    id: S.optional(S.String),
    dataSource: S.optional(S.String),
    author: S.optional(S.String),
    totalEvidence: S.optional(S.Number),
    assessmentReportSelectionCount: S.optional(S.Number),
    controlName: S.optional(S.String),
    evidenceResourcesIncludedCount: S.optional(S.Number),
    evidenceByTypeConfigurationDataCount: S.optional(S.Number),
    evidenceByTypeManualCount: S.optional(S.Number),
    evidenceByTypeComplianceCheckCount: S.optional(S.Number),
    evidenceByTypeComplianceCheckIssuesCount: S.optional(S.Number),
    evidenceByTypeUserActivityCount: S.optional(S.Number),
    evidenceAwsServiceSourceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AssessmentEvidenceFolder",
}) as any as S.Schema<AssessmentEvidenceFolder>;
export type AssessmentEvidenceFolders = AssessmentEvidenceFolder[];
export const AssessmentEvidenceFolders = S.Array(AssessmentEvidenceFolder);
export interface Insights {
  activeAssessmentsCount?: number;
  noncompliantEvidenceCount?: number;
  compliantEvidenceCount?: number;
  inconclusiveEvidenceCount?: number;
  assessmentControlsCountByNoncompliantEvidence?: number;
  totalAssessmentControlsCount?: number;
  lastUpdated?: Date;
}
export const Insights = S.suspend(() =>
  S.Struct({
    activeAssessmentsCount: S.optional(S.Number),
    noncompliantEvidenceCount: S.optional(S.Number),
    compliantEvidenceCount: S.optional(S.Number),
    inconclusiveEvidenceCount: S.optional(S.Number),
    assessmentControlsCountByNoncompliantEvidence: S.optional(S.Number),
    totalAssessmentControlsCount: S.optional(S.Number),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Insights" }) as any as S.Schema<Insights>;
export interface ServiceMetadata {
  name?: string;
  displayName?: string;
  description?: string;
  category?: string;
}
export const ServiceMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceMetadata",
}) as any as S.Schema<ServiceMetadata>;
export type ServiceMetadataList = ServiceMetadata[];
export const ServiceMetadataList = S.Array(ServiceMetadata);
export type Keywords = string[];
export const Keywords = S.Array(S.String);
export interface CreateAssessmentFrameworkControl {
  id: string;
}
export const CreateAssessmentFrameworkControl = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "CreateAssessmentFrameworkControl",
}) as any as S.Schema<CreateAssessmentFrameworkControl>;
export type CreateAssessmentFrameworkControls =
  CreateAssessmentFrameworkControl[];
export const CreateAssessmentFrameworkControls = S.Array(
  CreateAssessmentFrameworkControl,
);
export interface UpdateAssessmentFrameworkControlSet {
  id?: string;
  name: string;
  controls: CreateAssessmentFrameworkControl[];
}
export const UpdateAssessmentFrameworkControlSet = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.String,
    controls: CreateAssessmentFrameworkControls,
  }),
).annotations({
  identifier: "UpdateAssessmentFrameworkControlSet",
}) as any as S.Schema<UpdateAssessmentFrameworkControlSet>;
export type UpdateAssessmentFrameworkControlSets =
  UpdateAssessmentFrameworkControlSet[];
export const UpdateAssessmentFrameworkControlSets = S.Array(
  UpdateAssessmentFrameworkControlSet,
);
export type KeywordInputType =
  | "SELECT_FROM_LIST"
  | "UPLOAD_FILE"
  | "INPUT_TEXT"
  | (string & {});
export const KeywordInputType = S.String;
export interface SourceKeyword {
  keywordInputType?: KeywordInputType;
  keywordValue?: string;
}
export const SourceKeyword = S.suspend(() =>
  S.Struct({
    keywordInputType: S.optional(KeywordInputType),
    keywordValue: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceKeyword",
}) as any as S.Schema<SourceKeyword>;
export interface ControlMappingSource {
  sourceId?: string;
  sourceName?: string;
  sourceDescription?: string;
  sourceSetUpOption?: SourceSetUpOption;
  sourceType?: SourceType;
  sourceKeyword?: SourceKeyword;
  sourceFrequency?: SourceFrequency;
  troubleshootingText?: string | redacted.Redacted<string>;
}
export const ControlMappingSource = S.suspend(() =>
  S.Struct({
    sourceId: S.optional(S.String),
    sourceName: S.optional(S.String),
    sourceDescription: S.optional(S.String),
    sourceSetUpOption: S.optional(SourceSetUpOption),
    sourceType: S.optional(SourceType),
    sourceKeyword: S.optional(SourceKeyword),
    sourceFrequency: S.optional(SourceFrequency),
    troubleshootingText: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ControlMappingSource",
}) as any as S.Schema<ControlMappingSource>;
export type ControlMappingSources = ControlMappingSource[];
export const ControlMappingSources = S.Array(ControlMappingSource);
export interface DeregistrationPolicy {
  deleteResources?: DeleteResources;
}
export const DeregistrationPolicy = S.suspend(() =>
  S.Struct({ deleteResources: S.optional(DeleteResources) }),
).annotations({
  identifier: "DeregistrationPolicy",
}) as any as S.Schema<DeregistrationPolicy>;
export interface DefaultExportDestination {
  destinationType?: ExportDestinationType;
  destination?: string;
}
export const DefaultExportDestination = S.suspend(() =>
  S.Struct({
    destinationType: S.optional(ExportDestinationType),
    destination: S.optional(S.String),
  }),
).annotations({
  identifier: "DefaultExportDestination",
}) as any as S.Schema<DefaultExportDestination>;
export type ValidationErrors = string[];
export const ValidationErrors = S.Array(S.String);
export interface BatchCreateDelegationByAssessmentRequest {
  createDelegationRequests: CreateDelegationRequest[];
  assessmentId: string;
}
export const BatchCreateDelegationByAssessmentRequest = S.suspend(() =>
  S.Struct({
    createDelegationRequests: CreateDelegationRequests,
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assessments/{assessmentId}/delegations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateDelegationByAssessmentRequest",
}) as any as S.Schema<BatchCreateDelegationByAssessmentRequest>;
export interface AssessmentReportEvidenceError {
  evidenceId?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const AssessmentReportEvidenceError = S.suspend(() =>
  S.Struct({
    evidenceId: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AssessmentReportEvidenceError",
}) as any as S.Schema<AssessmentReportEvidenceError>;
export type AssessmentReportEvidenceErrors = AssessmentReportEvidenceError[];
export const AssessmentReportEvidenceErrors = S.Array(
  AssessmentReportEvidenceError,
);
export interface BatchDisassociateAssessmentReportEvidenceResponse {
  evidenceIds?: string[];
  errors?: AssessmentReportEvidenceError[];
}
export const BatchDisassociateAssessmentReportEvidenceResponse = S.suspend(() =>
  S.Struct({
    evidenceIds: S.optional(EvidenceIds),
    errors: S.optional(AssessmentReportEvidenceErrors),
  }),
).annotations({
  identifier: "BatchDisassociateAssessmentReportEvidenceResponse",
}) as any as S.Schema<BatchDisassociateAssessmentReportEvidenceResponse>;
export interface BatchImportEvidenceToAssessmentControlRequest {
  assessmentId: string;
  controlSetId: string;
  controlId: string;
  manualEvidence: ManualEvidence[];
}
export const BatchImportEvidenceToAssessmentControlRequest = S.suspend(() =>
  S.Struct({
    assessmentId: S.String.pipe(T.HttpLabel("assessmentId")),
    controlSetId: S.String.pipe(T.HttpLabel("controlSetId")),
    controlId: S.String.pipe(T.HttpLabel("controlId")),
    manualEvidence: ManualEvidenceList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/assessments/{assessmentId}/controlSets/{controlSetId}/controls/{controlId}/evidence",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchImportEvidenceToAssessmentControlRequest",
}) as any as S.Schema<BatchImportEvidenceToAssessmentControlRequest>;
export interface GetEvidenceByEvidenceFolderResponse {
  evidence?: Evidence[];
  nextToken?: string;
}
export const GetEvidenceByEvidenceFolderResponse = S.suspend(() =>
  S.Struct({
    evidence: S.optional(EvidenceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEvidenceByEvidenceFolderResponse",
}) as any as S.Schema<GetEvidenceByEvidenceFolderResponse>;
export interface GetEvidenceFileUploadUrlResponse {
  evidenceFileName?: string;
  uploadUrl?: string;
}
export const GetEvidenceFileUploadUrlResponse = S.suspend(() =>
  S.Struct({
    evidenceFileName: S.optional(S.String),
    uploadUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEvidenceFileUploadUrlResponse",
}) as any as S.Schema<GetEvidenceFileUploadUrlResponse>;
export interface GetEvidenceFoldersByAssessmentResponse {
  evidenceFolders?: AssessmentEvidenceFolder[];
  nextToken?: string;
}
export const GetEvidenceFoldersByAssessmentResponse = S.suspend(() =>
  S.Struct({
    evidenceFolders: S.optional(AssessmentEvidenceFolders),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEvidenceFoldersByAssessmentResponse",
}) as any as S.Schema<GetEvidenceFoldersByAssessmentResponse>;
export interface GetEvidenceFoldersByAssessmentControlResponse {
  evidenceFolders?: AssessmentEvidenceFolder[];
  nextToken?: string;
}
export const GetEvidenceFoldersByAssessmentControlResponse = S.suspend(() =>
  S.Struct({
    evidenceFolders: S.optional(AssessmentEvidenceFolders),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEvidenceFoldersByAssessmentControlResponse",
}) as any as S.Schema<GetEvidenceFoldersByAssessmentControlResponse>;
export interface GetInsightsResponse {
  insights?: Insights;
}
export const GetInsightsResponse = S.suspend(() =>
  S.Struct({ insights: S.optional(Insights) }),
).annotations({
  identifier: "GetInsightsResponse",
}) as any as S.Schema<GetInsightsResponse>;
export interface GetServicesInScopeResponse {
  serviceMetadata?: ServiceMetadata[];
}
export const GetServicesInScopeResponse = S.suspend(() =>
  S.Struct({ serviceMetadata: S.optional(ServiceMetadataList) }),
).annotations({
  identifier: "GetServicesInScopeResponse",
}) as any as S.Schema<GetServicesInScopeResponse>;
export interface EvidenceInsights {
  noncompliantEvidenceCount?: number;
  compliantEvidenceCount?: number;
  inconclusiveEvidenceCount?: number;
}
export const EvidenceInsights = S.suspend(() =>
  S.Struct({
    noncompliantEvidenceCount: S.optional(S.Number),
    compliantEvidenceCount: S.optional(S.Number),
    inconclusiveEvidenceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "EvidenceInsights",
}) as any as S.Schema<EvidenceInsights>;
export interface ControlDomainInsights {
  name?: string;
  id?: string;
  controlsCountByNoncompliantEvidence?: number;
  totalControlsCount?: number;
  evidenceInsights?: EvidenceInsights;
  lastUpdated?: Date;
}
export const ControlDomainInsights = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    controlsCountByNoncompliantEvidence: S.optional(S.Number),
    totalControlsCount: S.optional(S.Number),
    evidenceInsights: S.optional(EvidenceInsights),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ControlDomainInsights",
}) as any as S.Schema<ControlDomainInsights>;
export type ControlDomainInsightsList = ControlDomainInsights[];
export const ControlDomainInsightsList = S.Array(ControlDomainInsights);
export interface ListControlDomainInsightsByAssessmentResponse {
  controlDomainInsights?: ControlDomainInsights[];
  nextToken?: string;
}
export const ListControlDomainInsightsByAssessmentResponse = S.suspend(() =>
  S.Struct({
    controlDomainInsights: S.optional(ControlDomainInsightsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlDomainInsightsByAssessmentResponse",
}) as any as S.Schema<ListControlDomainInsightsByAssessmentResponse>;
export interface ListKeywordsForDataSourceResponse {
  keywords?: string[];
  nextToken?: string;
}
export const ListKeywordsForDataSourceResponse = S.suspend(() =>
  S.Struct({ keywords: S.optional(Keywords), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListKeywordsForDataSourceResponse",
}) as any as S.Schema<ListKeywordsForDataSourceResponse>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RegisterAccountResponse {
  status?: AccountStatus;
}
export const RegisterAccountResponse = S.suspend(() =>
  S.Struct({ status: S.optional(AccountStatus) }),
).annotations({
  identifier: "RegisterAccountResponse",
}) as any as S.Schema<RegisterAccountResponse>;
export interface RegisterOrganizationAdminAccountResponse {
  adminAccountId?: string;
  organizationId?: string;
}
export const RegisterOrganizationAdminAccountResponse = S.suspend(() =>
  S.Struct({
    adminAccountId: S.optional(S.String),
    organizationId: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterOrganizationAdminAccountResponse",
}) as any as S.Schema<RegisterOrganizationAdminAccountResponse>;
export type ShareRequestStatus =
  | "ACTIVE"
  | "REPLICATING"
  | "SHARED"
  | "EXPIRING"
  | "FAILED"
  | "EXPIRED"
  | "DECLINED"
  | "REVOKED"
  | (string & {});
export const ShareRequestStatus = S.String;
export interface AssessmentFrameworkShareRequest {
  id?: string;
  frameworkId?: string;
  frameworkName?: string;
  frameworkDescription?: string;
  status?: ShareRequestStatus;
  sourceAccount?: string;
  destinationAccount?: string;
  destinationRegion?: string;
  expirationTime?: Date;
  creationTime?: Date;
  lastUpdated?: Date;
  comment?: string;
  standardControlsCount?: number;
  customControlsCount?: number;
  complianceType?: string | redacted.Redacted<string>;
}
export const AssessmentFrameworkShareRequest = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    frameworkId: S.optional(S.String),
    frameworkName: S.optional(S.String),
    frameworkDescription: S.optional(S.String),
    status: S.optional(ShareRequestStatus),
    sourceAccount: S.optional(S.String),
    destinationAccount: S.optional(S.String),
    destinationRegion: S.optional(S.String),
    expirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    comment: S.optional(S.String),
    standardControlsCount: S.optional(S.Number),
    customControlsCount: S.optional(S.Number),
    complianceType: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AssessmentFrameworkShareRequest",
}) as any as S.Schema<AssessmentFrameworkShareRequest>;
export interface StartAssessmentFrameworkShareResponse {
  assessmentFrameworkShareRequest?: AssessmentFrameworkShareRequest;
}
export const StartAssessmentFrameworkShareResponse = S.suspend(() =>
  S.Struct({
    assessmentFrameworkShareRequest: S.optional(
      AssessmentFrameworkShareRequest,
    ),
  }),
).annotations({
  identifier: "StartAssessmentFrameworkShareResponse",
}) as any as S.Schema<StartAssessmentFrameworkShareResponse>;
export type DelegationStatus =
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "COMPLETE"
  | (string & {});
export const DelegationStatus = S.String;
export interface Delegation {
  id?: string;
  assessmentName?: string | redacted.Redacted<string>;
  assessmentId?: string;
  status?: DelegationStatus;
  roleArn?: string;
  roleType?: RoleType;
  creationTime?: Date;
  lastUpdated?: Date;
  controlSetId?: string;
  comment?: string | redacted.Redacted<string>;
  createdBy?: string | redacted.Redacted<string>;
}
export const Delegation = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    assessmentName: S.optional(SensitiveString),
    assessmentId: S.optional(S.String),
    status: S.optional(DelegationStatus),
    roleArn: S.optional(S.String),
    roleType: S.optional(RoleType),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    controlSetId: S.optional(S.String),
    comment: S.optional(SensitiveString),
    createdBy: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Delegation" }) as any as S.Schema<Delegation>;
export type Delegations = Delegation[];
export const Delegations = S.Array(Delegation);
export interface AssessmentMetadata {
  name?: string | redacted.Redacted<string>;
  id?: string;
  description?: string | redacted.Redacted<string>;
  complianceType?: string | redacted.Redacted<string>;
  status?: AssessmentStatus;
  assessmentReportsDestination?: AssessmentReportsDestination;
  scope?: Scope;
  roles?: Role[];
  delegations?: Delegation[];
  creationTime?: Date;
  lastUpdated?: Date;
}
export const AssessmentMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    id: S.optional(S.String),
    description: S.optional(SensitiveString),
    complianceType: S.optional(SensitiveString),
    status: S.optional(AssessmentStatus),
    assessmentReportsDestination: S.optional(AssessmentReportsDestination),
    scope: S.optional(Scope),
    roles: S.optional(Roles),
    delegations: S.optional(Delegations),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssessmentMetadata",
}) as any as S.Schema<AssessmentMetadata>;
export interface FrameworkMetadata {
  name?: string | redacted.Redacted<string>;
  description?: string;
  logo?: string;
  complianceType?: string | redacted.Redacted<string>;
}
export const FrameworkMetadata = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    description: S.optional(S.String),
    logo: S.optional(S.String),
    complianceType: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "FrameworkMetadata",
}) as any as S.Schema<FrameworkMetadata>;
export type ControlResponse =
  | "MANUAL"
  | "AUTOMATE"
  | "DEFER"
  | "IGNORE"
  | (string & {});
export const ControlResponse = S.String;
export interface ControlComment {
  authorName?: string | redacted.Redacted<string>;
  commentBody?: string | redacted.Redacted<string>;
  postedDate?: Date;
}
export const ControlComment = S.suspend(() =>
  S.Struct({
    authorName: S.optional(SensitiveString),
    commentBody: S.optional(SensitiveString),
    postedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ControlComment",
}) as any as S.Schema<ControlComment>;
export type ControlComments = ControlComment[];
export const ControlComments = S.Array(ControlComment);
export type EvidenceSources = string[];
export const EvidenceSources = S.Array(S.String);
export interface AssessmentControl {
  id?: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  status?: ControlStatus;
  response?: ControlResponse;
  comments?: ControlComment[];
  evidenceSources?: string[];
  evidenceCount?: number;
  assessmentReportEvidenceCount?: number;
}
export const AssessmentControl = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    status: S.optional(ControlStatus),
    response: S.optional(ControlResponse),
    comments: S.optional(ControlComments),
    evidenceSources: S.optional(EvidenceSources),
    evidenceCount: S.optional(S.Number),
    assessmentReportEvidenceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AssessmentControl",
}) as any as S.Schema<AssessmentControl>;
export type AssessmentControls = AssessmentControl[];
export const AssessmentControls = S.Array(AssessmentControl);
export interface AssessmentControlSet {
  id?: string;
  description?: string;
  status?: ControlSetStatus;
  roles?: Role[];
  controls?: AssessmentControl[];
  delegations?: Delegation[];
  systemEvidenceCount?: number;
  manualEvidenceCount?: number;
}
export const AssessmentControlSet = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(ControlSetStatus),
    roles: S.optional(Roles),
    controls: S.optional(AssessmentControls),
    delegations: S.optional(Delegations),
    systemEvidenceCount: S.optional(S.Number),
    manualEvidenceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AssessmentControlSet",
}) as any as S.Schema<AssessmentControlSet>;
export type AssessmentControlSets = AssessmentControlSet[];
export const AssessmentControlSets = S.Array(AssessmentControlSet);
export interface AssessmentFramework {
  id?: string;
  arn?: string;
  metadata?: FrameworkMetadata;
  controlSets?: AssessmentControlSet[];
}
export const AssessmentFramework = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    metadata: S.optional(FrameworkMetadata),
    controlSets: S.optional(AssessmentControlSets),
  }),
).annotations({
  identifier: "AssessmentFramework",
}) as any as S.Schema<AssessmentFramework>;
export interface Assessment {
  arn?: string;
  awsAccount?: AWSAccount;
  metadata?: AssessmentMetadata;
  framework?: AssessmentFramework;
  tags?: { [key: string]: string | undefined };
}
export const Assessment = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    awsAccount: S.optional(AWSAccount),
    metadata: S.optional(AssessmentMetadata),
    framework: S.optional(AssessmentFramework),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Assessment" }) as any as S.Schema<Assessment>;
export interface UpdateAssessmentResponse {
  assessment?: Assessment;
}
export const UpdateAssessmentResponse = S.suspend(() =>
  S.Struct({ assessment: S.optional(Assessment) }),
).annotations({
  identifier: "UpdateAssessmentResponse",
}) as any as S.Schema<UpdateAssessmentResponse>;
export interface UpdateAssessmentFrameworkRequest {
  frameworkId: string;
  name: string;
  description?: string;
  complianceType?: string | redacted.Redacted<string>;
  controlSets: UpdateAssessmentFrameworkControlSet[];
}
export const UpdateAssessmentFrameworkRequest = S.suspend(() =>
  S.Struct({
    frameworkId: S.String.pipe(T.HttpLabel("frameworkId")),
    name: S.String,
    description: S.optional(S.String),
    complianceType: S.optional(SensitiveString),
    controlSets: UpdateAssessmentFrameworkControlSets,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/assessmentFrameworks/{frameworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssessmentFrameworkRequest",
}) as any as S.Schema<UpdateAssessmentFrameworkRequest>;
export interface UpdateAssessmentFrameworkShareResponse {
  assessmentFrameworkShareRequest?: AssessmentFrameworkShareRequest;
}
export const UpdateAssessmentFrameworkShareResponse = S.suspend(() =>
  S.Struct({
    assessmentFrameworkShareRequest: S.optional(
      AssessmentFrameworkShareRequest,
    ),
  }),
).annotations({
  identifier: "UpdateAssessmentFrameworkShareResponse",
}) as any as S.Schema<UpdateAssessmentFrameworkShareResponse>;
export interface UpdateAssessmentStatusResponse {
  assessment?: Assessment;
}
export const UpdateAssessmentStatusResponse = S.suspend(() =>
  S.Struct({ assessment: S.optional(Assessment) }),
).annotations({
  identifier: "UpdateAssessmentStatusResponse",
}) as any as S.Schema<UpdateAssessmentStatusResponse>;
export interface UpdateControlRequest {
  controlId: string;
  name: string;
  description?: string | redacted.Redacted<string>;
  testingInformation?: string | redacted.Redacted<string>;
  actionPlanTitle?: string | redacted.Redacted<string>;
  actionPlanInstructions?: string | redacted.Redacted<string>;
  controlMappingSources: ControlMappingSource[];
}
export const UpdateControlRequest = S.suspend(() =>
  S.Struct({
    controlId: S.String.pipe(T.HttpLabel("controlId")),
    name: S.String,
    description: S.optional(SensitiveString),
    testingInformation: S.optional(SensitiveString),
    actionPlanTitle: S.optional(SensitiveString),
    actionPlanInstructions: S.optional(SensitiveString),
    controlMappingSources: ControlMappingSources,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/controls/{controlId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateControlRequest",
}) as any as S.Schema<UpdateControlRequest>;
export interface UpdateSettingsRequest {
  snsTopic?: string;
  defaultAssessmentReportsDestination?: AssessmentReportsDestination;
  defaultProcessOwners?: Role[];
  kmsKey?: string;
  evidenceFinderEnabled?: boolean;
  deregistrationPolicy?: DeregistrationPolicy;
  defaultExportDestination?: DefaultExportDestination;
}
export const UpdateSettingsRequest = S.suspend(() =>
  S.Struct({
    snsTopic: S.optional(S.String),
    defaultAssessmentReportsDestination: S.optional(
      AssessmentReportsDestination,
    ),
    defaultProcessOwners: S.optional(Roles),
    kmsKey: S.optional(S.String),
    evidenceFinderEnabled: S.optional(S.Boolean),
    deregistrationPolicy: S.optional(DeregistrationPolicy),
    defaultExportDestination: S.optional(DefaultExportDestination),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSettingsRequest",
}) as any as S.Schema<UpdateSettingsRequest>;
export interface ValidateAssessmentReportIntegrityResponse {
  signatureValid?: boolean;
  signatureAlgorithm?: string;
  signatureDateTime?: string;
  signatureKeyId?: string;
  validationErrors?: string[];
}
export const ValidateAssessmentReportIntegrityResponse = S.suspend(() =>
  S.Struct({
    signatureValid: S.optional(S.Boolean),
    signatureAlgorithm: S.optional(S.String),
    signatureDateTime: S.optional(S.String),
    signatureKeyId: S.optional(S.String),
    validationErrors: S.optional(ValidationErrors),
  }),
).annotations({
  identifier: "ValidateAssessmentReportIntegrityResponse",
}) as any as S.Schema<ValidateAssessmentReportIntegrityResponse>;
export type AssessmentReportStatus =
  | "COMPLETE"
  | "IN_PROGRESS"
  | "FAILED"
  | (string & {});
export const AssessmentReportStatus = S.String;
export type ObjectTypeEnum =
  | "ASSESSMENT"
  | "CONTROL_SET"
  | "CONTROL"
  | "DELEGATION"
  | "ASSESSMENT_REPORT"
  | (string & {});
export const ObjectTypeEnum = S.String;
export type ActionEnum =
  | "CREATE"
  | "UPDATE_METADATA"
  | "ACTIVE"
  | "INACTIVE"
  | "DELETE"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "IMPORT_EVIDENCE"
  | (string & {});
export const ActionEnum = S.String;
export type ControlState = "ACTIVE" | "END_OF_SUPPORT" | (string & {});
export const ControlState = S.String;
export interface BatchDeleteDelegationByAssessmentError {
  delegationId?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchDeleteDelegationByAssessmentError = S.suspend(() =>
  S.Struct({
    delegationId: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteDelegationByAssessmentError",
}) as any as S.Schema<BatchDeleteDelegationByAssessmentError>;
export type BatchDeleteDelegationByAssessmentErrors =
  BatchDeleteDelegationByAssessmentError[];
export const BatchDeleteDelegationByAssessmentErrors = S.Array(
  BatchDeleteDelegationByAssessmentError,
);
export interface CreateAssessmentFrameworkControlSet {
  name: string;
  controls?: CreateAssessmentFrameworkControl[];
}
export const CreateAssessmentFrameworkControlSet = S.suspend(() =>
  S.Struct({
    name: S.String,
    controls: S.optional(CreateAssessmentFrameworkControls),
  }),
).annotations({
  identifier: "CreateAssessmentFrameworkControlSet",
}) as any as S.Schema<CreateAssessmentFrameworkControlSet>;
export type CreateAssessmentFrameworkControlSets =
  CreateAssessmentFrameworkControlSet[];
export const CreateAssessmentFrameworkControlSets = S.Array(
  CreateAssessmentFrameworkControlSet,
);
export interface AssessmentReport {
  id?: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  awsAccountId?: string;
  assessmentId?: string;
  assessmentName?: string | redacted.Redacted<string>;
  author?: string | redacted.Redacted<string>;
  status?: AssessmentReportStatus;
  creationTime?: Date;
}
export const AssessmentReport = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    awsAccountId: S.optional(S.String),
    assessmentId: S.optional(S.String),
    assessmentName: S.optional(SensitiveString),
    author: S.optional(SensitiveString),
    status: S.optional(AssessmentReportStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssessmentReport",
}) as any as S.Schema<AssessmentReport>;
export interface CreateControlMappingSource {
  sourceName?: string;
  sourceDescription?: string;
  sourceSetUpOption?: SourceSetUpOption;
  sourceType?: SourceType;
  sourceKeyword?: SourceKeyword;
  sourceFrequency?: SourceFrequency;
  troubleshootingText?: string | redacted.Redacted<string>;
}
export const CreateControlMappingSource = S.suspend(() =>
  S.Struct({
    sourceName: S.optional(S.String),
    sourceDescription: S.optional(S.String),
    sourceSetUpOption: S.optional(SourceSetUpOption),
    sourceType: S.optional(SourceType),
    sourceKeyword: S.optional(SourceKeyword),
    sourceFrequency: S.optional(SourceFrequency),
    troubleshootingText: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "CreateControlMappingSource",
}) as any as S.Schema<CreateControlMappingSource>;
export type CreateControlMappingSources = CreateControlMappingSource[];
export const CreateControlMappingSources = S.Array(CreateControlMappingSource);
export interface URL {
  hyperlinkName?: string;
  link?: string;
}
export const URL = S.suspend(() =>
  S.Struct({ hyperlinkName: S.optional(S.String), link: S.optional(S.String) }),
).annotations({ identifier: "URL" }) as any as S.Schema<URL>;
export interface ChangeLog {
  objectType?: ObjectTypeEnum;
  objectName?: string;
  action?: ActionEnum;
  createdAt?: Date;
  createdBy?: string;
}
export const ChangeLog = S.suspend(() =>
  S.Struct({
    objectType: S.optional(ObjectTypeEnum),
    objectName: S.optional(S.String),
    action: S.optional(ActionEnum),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(S.String),
  }),
).annotations({ identifier: "ChangeLog" }) as any as S.Schema<ChangeLog>;
export type ChangeLogs = ChangeLog[];
export const ChangeLogs = S.Array(ChangeLog);
export interface Control {
  arn?: string;
  id?: string;
  type?: ControlType;
  name?: string;
  description?: string | redacted.Redacted<string>;
  testingInformation?: string | redacted.Redacted<string>;
  actionPlanTitle?: string | redacted.Redacted<string>;
  actionPlanInstructions?: string | redacted.Redacted<string>;
  controlSources?: string;
  controlMappingSources?: ControlMappingSource[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string | redacted.Redacted<string>;
  lastUpdatedBy?: string | redacted.Redacted<string>;
  tags?: { [key: string]: string | undefined };
  state?: ControlState;
}
export const Control = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(ControlType),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    testingInformation: S.optional(SensitiveString),
    actionPlanTitle: S.optional(SensitiveString),
    actionPlanInstructions: S.optional(SensitiveString),
    controlSources: S.optional(S.String),
    controlMappingSources: S.optional(ControlMappingSources),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(SensitiveString),
    lastUpdatedBy: S.optional(SensitiveString),
    tags: S.optional(TagMap),
    state: S.optional(ControlState),
  }),
).annotations({ identifier: "Control" }) as any as S.Schema<Control>;
export interface DelegationMetadata {
  id?: string;
  assessmentName?: string | redacted.Redacted<string>;
  assessmentId?: string;
  status?: DelegationStatus;
  roleArn?: string;
  creationTime?: Date;
  controlSetName?: string;
}
export const DelegationMetadata = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    assessmentName: S.optional(SensitiveString),
    assessmentId: S.optional(S.String),
    status: S.optional(DelegationStatus),
    roleArn: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    controlSetName: S.optional(S.String),
  }),
).annotations({
  identifier: "DelegationMetadata",
}) as any as S.Schema<DelegationMetadata>;
export type DelegationMetadataList = DelegationMetadata[];
export const DelegationMetadataList = S.Array(DelegationMetadata);
export interface InsightsByAssessment {
  noncompliantEvidenceCount?: number;
  compliantEvidenceCount?: number;
  inconclusiveEvidenceCount?: number;
  assessmentControlsCountByNoncompliantEvidence?: number;
  totalAssessmentControlsCount?: number;
  lastUpdated?: Date;
}
export const InsightsByAssessment = S.suspend(() =>
  S.Struct({
    noncompliantEvidenceCount: S.optional(S.Number),
    compliantEvidenceCount: S.optional(S.Number),
    inconclusiveEvidenceCount: S.optional(S.Number),
    assessmentControlsCountByNoncompliantEvidence: S.optional(S.Number),
    totalAssessmentControlsCount: S.optional(S.Number),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InsightsByAssessment",
}) as any as S.Schema<InsightsByAssessment>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface AssessmentFrameworkMetadata {
  arn?: string;
  id?: string;
  type?: FrameworkType;
  name?: string;
  description?: string;
  logo?: string;
  complianceType?: string | redacted.Redacted<string>;
  controlsCount?: number;
  controlSetsCount?: number;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const AssessmentFrameworkMetadata = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    type: S.optional(FrameworkType),
    name: S.optional(S.String),
    description: S.optional(S.String),
    logo: S.optional(S.String),
    complianceType: S.optional(SensitiveString),
    controlsCount: S.optional(S.Number),
    controlSetsCount: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssessmentFrameworkMetadata",
}) as any as S.Schema<AssessmentFrameworkMetadata>;
export type FrameworkMetadataList = AssessmentFrameworkMetadata[];
export const FrameworkMetadataList = S.Array(AssessmentFrameworkMetadata);
export type AssessmentFrameworkShareRequestList =
  AssessmentFrameworkShareRequest[];
export const AssessmentFrameworkShareRequestList = S.Array(
  AssessmentFrameworkShareRequest,
);
export interface AssessmentReportMetadata {
  id?: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  assessmentId?: string;
  assessmentName?: string | redacted.Redacted<string>;
  author?: string | redacted.Redacted<string>;
  status?: AssessmentReportStatus;
  creationTime?: Date;
}
export const AssessmentReportMetadata = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    assessmentId: S.optional(S.String),
    assessmentName: S.optional(SensitiveString),
    author: S.optional(SensitiveString),
    status: S.optional(AssessmentReportStatus),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssessmentReportMetadata",
}) as any as S.Schema<AssessmentReportMetadata>;
export type AssessmentReportsMetadata = AssessmentReportMetadata[];
export const AssessmentReportsMetadata = S.Array(AssessmentReportMetadata);
export interface ControlInsightsMetadataItem {
  name?: string;
  id?: string;
  evidenceInsights?: EvidenceInsights;
  lastUpdated?: Date;
}
export const ControlInsightsMetadataItem = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    evidenceInsights: S.optional(EvidenceInsights),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ControlInsightsMetadataItem",
}) as any as S.Schema<ControlInsightsMetadataItem>;
export type ControlInsightsMetadata = ControlInsightsMetadataItem[];
export const ControlInsightsMetadata = S.Array(ControlInsightsMetadataItem);
export interface ControlMetadata {
  arn?: string;
  id?: string;
  name?: string;
  controlSources?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const ControlMetadata = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    name: S.optional(S.String),
    controlSources: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ControlMetadata",
}) as any as S.Schema<ControlMetadata>;
export type ControlMetadataList = ControlMetadata[];
export const ControlMetadataList = S.Array(ControlMetadata);
export interface Notification {
  id?: string;
  assessmentId?: string;
  assessmentName?: string | redacted.Redacted<string>;
  controlSetId?: string;
  controlSetName?: string;
  description?: string;
  eventTime?: Date;
  source?: string;
}
export const Notification = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    assessmentId: S.optional(S.String),
    assessmentName: S.optional(SensitiveString),
    controlSetId: S.optional(S.String),
    controlSetName: S.optional(S.String),
    description: S.optional(S.String),
    eventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    source: S.optional(S.String),
  }),
).annotations({ identifier: "Notification" }) as any as S.Schema<Notification>;
export type Notifications = Notification[];
export const Notifications = S.Array(Notification);
export type Controls = Control[];
export const Controls = S.Array(Control);
export type EvidenceFinderEnablementStatus =
  | "ENABLED"
  | "DISABLED"
  | "ENABLE_IN_PROGRESS"
  | "DISABLE_IN_PROGRESS"
  | (string & {});
export const EvidenceFinderEnablementStatus = S.String;
export type EvidenceFinderBackfillStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | (string & {});
export const EvidenceFinderBackfillStatus = S.String;
export interface BatchAssociateAssessmentReportEvidenceResponse {
  evidenceIds?: string[];
  errors?: AssessmentReportEvidenceError[];
}
export const BatchAssociateAssessmentReportEvidenceResponse = S.suspend(() =>
  S.Struct({
    evidenceIds: S.optional(EvidenceIds),
    errors: S.optional(AssessmentReportEvidenceErrors),
  }),
).annotations({
  identifier: "BatchAssociateAssessmentReportEvidenceResponse",
}) as any as S.Schema<BatchAssociateAssessmentReportEvidenceResponse>;
export interface BatchDeleteDelegationByAssessmentResponse {
  errors?: BatchDeleteDelegationByAssessmentError[];
}
export const BatchDeleteDelegationByAssessmentResponse = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchDeleteDelegationByAssessmentErrors) }),
).annotations({
  identifier: "BatchDeleteDelegationByAssessmentResponse",
}) as any as S.Schema<BatchDeleteDelegationByAssessmentResponse>;
export interface CreateAssessmentRequest {
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  assessmentReportsDestination: AssessmentReportsDestination;
  scope: Scope;
  roles: Role[];
  frameworkId: string;
  tags?: { [key: string]: string | undefined };
}
export const CreateAssessmentRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    assessmentReportsDestination: AssessmentReportsDestination,
    scope: Scope,
    roles: Roles,
    frameworkId: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assessments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssessmentRequest",
}) as any as S.Schema<CreateAssessmentRequest>;
export interface CreateAssessmentFrameworkRequest {
  name: string;
  description?: string;
  complianceType?: string | redacted.Redacted<string>;
  controlSets: CreateAssessmentFrameworkControlSet[];
  tags?: { [key: string]: string | undefined };
}
export const CreateAssessmentFrameworkRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    complianceType: S.optional(SensitiveString),
    controlSets: CreateAssessmentFrameworkControlSets,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/assessmentFrameworks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssessmentFrameworkRequest",
}) as any as S.Schema<CreateAssessmentFrameworkRequest>;
export interface CreateAssessmentReportResponse {
  assessmentReport?: AssessmentReport;
}
export const CreateAssessmentReportResponse = S.suspend(() =>
  S.Struct({ assessmentReport: S.optional(AssessmentReport) }),
).annotations({
  identifier: "CreateAssessmentReportResponse",
}) as any as S.Schema<CreateAssessmentReportResponse>;
export interface CreateControlRequest {
  name: string;
  description?: string | redacted.Redacted<string>;
  testingInformation?: string | redacted.Redacted<string>;
  actionPlanTitle?: string | redacted.Redacted<string>;
  actionPlanInstructions?: string | redacted.Redacted<string>;
  controlMappingSources: CreateControlMappingSource[];
  tags?: { [key: string]: string | undefined };
}
export const CreateControlRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    testingInformation: S.optional(SensitiveString),
    actionPlanTitle: S.optional(SensitiveString),
    actionPlanInstructions: S.optional(SensitiveString),
    controlMappingSources: CreateControlMappingSources,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/controls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateControlRequest",
}) as any as S.Schema<CreateControlRequest>;
export interface GetAssessmentReportUrlResponse {
  preSignedUrl?: URL;
}
export const GetAssessmentReportUrlResponse = S.suspend(() =>
  S.Struct({ preSignedUrl: S.optional(URL) }),
).annotations({
  identifier: "GetAssessmentReportUrlResponse",
}) as any as S.Schema<GetAssessmentReportUrlResponse>;
export interface GetChangeLogsResponse {
  changeLogs?: ChangeLog[];
  nextToken?: string;
}
export const GetChangeLogsResponse = S.suspend(() =>
  S.Struct({
    changeLogs: S.optional(ChangeLogs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetChangeLogsResponse",
}) as any as S.Schema<GetChangeLogsResponse>;
export interface GetControlResponse {
  control?: Control;
}
export const GetControlResponse = S.suspend(() =>
  S.Struct({ control: S.optional(Control) }),
).annotations({
  identifier: "GetControlResponse",
}) as any as S.Schema<GetControlResponse>;
export interface GetDelegationsResponse {
  delegations?: DelegationMetadata[];
  nextToken?: string;
}
export const GetDelegationsResponse = S.suspend(() =>
  S.Struct({
    delegations: S.optional(DelegationMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDelegationsResponse",
}) as any as S.Schema<GetDelegationsResponse>;
export interface GetEvidenceFolderResponse {
  evidenceFolder?: AssessmentEvidenceFolder;
}
export const GetEvidenceFolderResponse = S.suspend(() =>
  S.Struct({ evidenceFolder: S.optional(AssessmentEvidenceFolder) }),
).annotations({
  identifier: "GetEvidenceFolderResponse",
}) as any as S.Schema<GetEvidenceFolderResponse>;
export interface GetInsightsByAssessmentResponse {
  insights?: InsightsByAssessment;
}
export const GetInsightsByAssessmentResponse = S.suspend(() =>
  S.Struct({ insights: S.optional(InsightsByAssessment) }),
).annotations({
  identifier: "GetInsightsByAssessmentResponse",
}) as any as S.Schema<GetInsightsByAssessmentResponse>;
export interface ListAssessmentFrameworksResponse {
  frameworkMetadataList?: AssessmentFrameworkMetadata[];
  nextToken?: string;
}
export const ListAssessmentFrameworksResponse = S.suspend(() =>
  S.Struct({
    frameworkMetadataList: S.optional(FrameworkMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentFrameworksResponse",
}) as any as S.Schema<ListAssessmentFrameworksResponse>;
export interface ListAssessmentFrameworkShareRequestsResponse {
  assessmentFrameworkShareRequests?: AssessmentFrameworkShareRequest[];
  nextToken?: string;
}
export const ListAssessmentFrameworkShareRequestsResponse = S.suspend(() =>
  S.Struct({
    assessmentFrameworkShareRequests: S.optional(
      AssessmentFrameworkShareRequestList,
    ),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentFrameworkShareRequestsResponse",
}) as any as S.Schema<ListAssessmentFrameworkShareRequestsResponse>;
export interface ListAssessmentReportsResponse {
  assessmentReports?: AssessmentReportMetadata[];
  nextToken?: string;
}
export const ListAssessmentReportsResponse = S.suspend(() =>
  S.Struct({
    assessmentReports: S.optional(AssessmentReportsMetadata),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentReportsResponse",
}) as any as S.Schema<ListAssessmentReportsResponse>;
export interface ListControlDomainInsightsResponse {
  controlDomainInsights?: ControlDomainInsights[];
  nextToken?: string;
}
export const ListControlDomainInsightsResponse = S.suspend(() =>
  S.Struct({
    controlDomainInsights: S.optional(ControlDomainInsightsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlDomainInsightsResponse",
}) as any as S.Schema<ListControlDomainInsightsResponse>;
export interface ListControlInsightsByControlDomainResponse {
  controlInsightsMetadata?: ControlInsightsMetadataItem[];
  nextToken?: string;
}
export const ListControlInsightsByControlDomainResponse = S.suspend(() =>
  S.Struct({
    controlInsightsMetadata: S.optional(ControlInsightsMetadata),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlInsightsByControlDomainResponse",
}) as any as S.Schema<ListControlInsightsByControlDomainResponse>;
export interface ListControlsResponse {
  controlMetadataList?: ControlMetadata[];
  nextToken?: string;
}
export const ListControlsResponse = S.suspend(() =>
  S.Struct({
    controlMetadataList: S.optional(ControlMetadataList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlsResponse",
}) as any as S.Schema<ListControlsResponse>;
export interface ListNotificationsResponse {
  notifications?: Notification[];
  nextToken?: string;
}
export const ListNotificationsResponse = S.suspend(() =>
  S.Struct({
    notifications: S.optional(Notifications),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNotificationsResponse",
}) as any as S.Schema<ListNotificationsResponse>;
export interface UpdateAssessmentControlSetStatusResponse {
  controlSet?: AssessmentControlSet;
}
export const UpdateAssessmentControlSetStatusResponse = S.suspend(() =>
  S.Struct({ controlSet: S.optional(AssessmentControlSet) }),
).annotations({
  identifier: "UpdateAssessmentControlSetStatusResponse",
}) as any as S.Schema<UpdateAssessmentControlSetStatusResponse>;
export interface ControlSet {
  id?: string;
  name?: string;
  controls?: Control[];
}
export const ControlSet = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    controls: S.optional(Controls),
  }),
).annotations({ identifier: "ControlSet" }) as any as S.Schema<ControlSet>;
export type ControlSets = ControlSet[];
export const ControlSets = S.Array(ControlSet);
export interface Framework {
  arn?: string;
  id?: string;
  name?: string;
  type?: FrameworkType;
  complianceType?: string | redacted.Redacted<string>;
  description?: string;
  logo?: string;
  controlSources?: string;
  controlSets?: ControlSet[];
  createdAt?: Date;
  lastUpdatedAt?: Date;
  createdBy?: string | redacted.Redacted<string>;
  lastUpdatedBy?: string | redacted.Redacted<string>;
  tags?: { [key: string]: string | undefined };
}
export const Framework = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(FrameworkType),
    complianceType: S.optional(SensitiveString),
    description: S.optional(S.String),
    logo: S.optional(S.String),
    controlSources: S.optional(S.String),
    controlSets: S.optional(ControlSets),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdBy: S.optional(SensitiveString),
    lastUpdatedBy: S.optional(SensitiveString),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Framework" }) as any as S.Schema<Framework>;
export interface UpdateAssessmentFrameworkResponse {
  framework?: Framework;
}
export const UpdateAssessmentFrameworkResponse = S.suspend(() =>
  S.Struct({ framework: S.optional(Framework) }),
).annotations({
  identifier: "UpdateAssessmentFrameworkResponse",
}) as any as S.Schema<UpdateAssessmentFrameworkResponse>;
export interface UpdateControlResponse {
  control?: Control;
}
export const UpdateControlResponse = S.suspend(() =>
  S.Struct({ control: S.optional(Control) }),
).annotations({
  identifier: "UpdateControlResponse",
}) as any as S.Schema<UpdateControlResponse>;
export interface EvidenceFinderEnablement {
  eventDataStoreArn?: string;
  enablementStatus?: EvidenceFinderEnablementStatus;
  backfillStatus?: EvidenceFinderBackfillStatus;
  error?: string;
}
export const EvidenceFinderEnablement = S.suspend(() =>
  S.Struct({
    eventDataStoreArn: S.optional(S.String),
    enablementStatus: S.optional(EvidenceFinderEnablementStatus),
    backfillStatus: S.optional(EvidenceFinderBackfillStatus),
    error: S.optional(S.String),
  }),
).annotations({
  identifier: "EvidenceFinderEnablement",
}) as any as S.Schema<EvidenceFinderEnablement>;
export interface Settings {
  isAwsOrgEnabled?: boolean;
  snsTopic?: string | redacted.Redacted<string>;
  defaultAssessmentReportsDestination?: AssessmentReportsDestination;
  defaultProcessOwners?: Role[];
  kmsKey?: string;
  evidenceFinderEnablement?: EvidenceFinderEnablement;
  deregistrationPolicy?: DeregistrationPolicy;
  defaultExportDestination?: DefaultExportDestination;
}
export const Settings = S.suspend(() =>
  S.Struct({
    isAwsOrgEnabled: S.optional(S.Boolean),
    snsTopic: S.optional(SensitiveString),
    defaultAssessmentReportsDestination: S.optional(
      AssessmentReportsDestination,
    ),
    defaultProcessOwners: S.optional(Roles),
    kmsKey: S.optional(S.String),
    evidenceFinderEnablement: S.optional(EvidenceFinderEnablement),
    deregistrationPolicy: S.optional(DeregistrationPolicy),
    defaultExportDestination: S.optional(DefaultExportDestination),
  }),
).annotations({ identifier: "Settings" }) as any as S.Schema<Settings>;
export interface UpdateSettingsResponse {
  settings?: Settings;
}
export const UpdateSettingsResponse = S.suspend(() =>
  S.Struct({ settings: S.optional(Settings) }),
).annotations({
  identifier: "UpdateSettingsResponse",
}) as any as S.Schema<UpdateSettingsResponse>;
export interface BatchCreateDelegationByAssessmentError {
  createDelegationRequest?: CreateDelegationRequest;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchCreateDelegationByAssessmentError = S.suspend(() =>
  S.Struct({
    createDelegationRequest: S.optional(CreateDelegationRequest),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateDelegationByAssessmentError",
}) as any as S.Schema<BatchCreateDelegationByAssessmentError>;
export type BatchCreateDelegationByAssessmentErrors =
  BatchCreateDelegationByAssessmentError[];
export const BatchCreateDelegationByAssessmentErrors = S.Array(
  BatchCreateDelegationByAssessmentError,
);
export interface BatchImportEvidenceToAssessmentControlError {
  manualEvidence?: ManualEvidence;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchImportEvidenceToAssessmentControlError = S.suspend(() =>
  S.Struct({
    manualEvidence: S.optional(ManualEvidence),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchImportEvidenceToAssessmentControlError",
}) as any as S.Schema<BatchImportEvidenceToAssessmentControlError>;
export type BatchImportEvidenceToAssessmentControlErrors =
  BatchImportEvidenceToAssessmentControlError[];
export const BatchImportEvidenceToAssessmentControlErrors = S.Array(
  BatchImportEvidenceToAssessmentControlError,
);
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
export interface ControlInsightsMetadataByAssessmentItem {
  name?: string;
  id?: string;
  evidenceInsights?: EvidenceInsights;
  controlSetName?: string;
  lastUpdated?: Date;
}
export const ControlInsightsMetadataByAssessmentItem = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    id: S.optional(S.String),
    evidenceInsights: S.optional(EvidenceInsights),
    controlSetName: S.optional(S.String),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ControlInsightsMetadataByAssessmentItem",
}) as any as S.Schema<ControlInsightsMetadataByAssessmentItem>;
export type ControlInsightsMetadataByAssessment =
  ControlInsightsMetadataByAssessmentItem[];
export const ControlInsightsMetadataByAssessment = S.Array(
  ControlInsightsMetadataByAssessmentItem,
);
export interface AssessmentMetadataItem {
  name?: string | redacted.Redacted<string>;
  id?: string;
  complianceType?: string | redacted.Redacted<string>;
  status?: AssessmentStatus;
  roles?: Role[];
  delegations?: Delegation[];
  creationTime?: Date;
  lastUpdated?: Date;
}
export const AssessmentMetadataItem = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    id: S.optional(S.String),
    complianceType: S.optional(SensitiveString),
    status: S.optional(AssessmentStatus),
    roles: S.optional(Roles),
    delegations: S.optional(Delegations),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AssessmentMetadataItem",
}) as any as S.Schema<AssessmentMetadataItem>;
export type ListAssessmentMetadata = AssessmentMetadataItem[];
export const ListAssessmentMetadata = S.Array(AssessmentMetadataItem);
export interface BatchCreateDelegationByAssessmentResponse {
  delegations?: Delegation[];
  errors?: BatchCreateDelegationByAssessmentError[];
}
export const BatchCreateDelegationByAssessmentResponse = S.suspend(() =>
  S.Struct({
    delegations: S.optional(Delegations),
    errors: S.optional(BatchCreateDelegationByAssessmentErrors),
  }),
).annotations({
  identifier: "BatchCreateDelegationByAssessmentResponse",
}) as any as S.Schema<BatchCreateDelegationByAssessmentResponse>;
export interface BatchImportEvidenceToAssessmentControlResponse {
  errors?: BatchImportEvidenceToAssessmentControlError[];
}
export const BatchImportEvidenceToAssessmentControlResponse = S.suspend(() =>
  S.Struct({
    errors: S.optional(BatchImportEvidenceToAssessmentControlErrors),
  }),
).annotations({
  identifier: "BatchImportEvidenceToAssessmentControlResponse",
}) as any as S.Schema<BatchImportEvidenceToAssessmentControlResponse>;
export interface CreateAssessmentResponse {
  assessment?: Assessment;
}
export const CreateAssessmentResponse = S.suspend(() =>
  S.Struct({ assessment: S.optional(Assessment) }),
).annotations({
  identifier: "CreateAssessmentResponse",
}) as any as S.Schema<CreateAssessmentResponse>;
export interface CreateAssessmentFrameworkResponse {
  framework?: Framework;
}
export const CreateAssessmentFrameworkResponse = S.suspend(() =>
  S.Struct({ framework: S.optional(Framework) }),
).annotations({
  identifier: "CreateAssessmentFrameworkResponse",
}) as any as S.Schema<CreateAssessmentFrameworkResponse>;
export interface CreateControlResponse {
  control?: Control;
}
export const CreateControlResponse = S.suspend(() =>
  S.Struct({ control: S.optional(Control) }),
).annotations({
  identifier: "CreateControlResponse",
}) as any as S.Schema<CreateControlResponse>;
export interface GetAssessmentFrameworkResponse {
  framework?: Framework;
}
export const GetAssessmentFrameworkResponse = S.suspend(() =>
  S.Struct({ framework: S.optional(Framework) }),
).annotations({
  identifier: "GetAssessmentFrameworkResponse",
}) as any as S.Schema<GetAssessmentFrameworkResponse>;
export interface GetEvidenceResponse {
  evidence?: Evidence;
}
export const GetEvidenceResponse = S.suspend(() =>
  S.Struct({ evidence: S.optional(Evidence) }),
).annotations({
  identifier: "GetEvidenceResponse",
}) as any as S.Schema<GetEvidenceResponse>;
export interface GetSettingsResponse {
  settings?: Settings;
}
export const GetSettingsResponse = S.suspend(() =>
  S.Struct({ settings: S.optional(Settings) }),
).annotations({
  identifier: "GetSettingsResponse",
}) as any as S.Schema<GetSettingsResponse>;
export interface ListAssessmentControlInsightsByControlDomainResponse {
  controlInsightsByAssessment?: ControlInsightsMetadataByAssessmentItem[];
  nextToken?: string;
}
export const ListAssessmentControlInsightsByControlDomainResponse = S.suspend(
  () =>
    S.Struct({
      controlInsightsByAssessment: S.optional(
        ControlInsightsMetadataByAssessment,
      ),
      nextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListAssessmentControlInsightsByControlDomainResponse",
}) as any as S.Schema<ListAssessmentControlInsightsByControlDomainResponse>;
export interface ListAssessmentsResponse {
  assessmentMetadata?: AssessmentMetadataItem[];
  nextToken?: string;
}
export const ListAssessmentsResponse = S.suspend(() =>
  S.Struct({
    assessmentMetadata: S.optional(ListAssessmentMetadata),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentsResponse",
}) as any as S.Schema<ListAssessmentsResponse>;
export interface UpdateAssessmentControlResponse {
  control?: AssessmentControl;
}
export const UpdateAssessmentControlResponse = S.suspend(() =>
  S.Struct({ control: S.optional(AssessmentControl) }),
).annotations({
  identifier: "UpdateAssessmentControlResponse",
}) as any as S.Schema<UpdateAssessmentControlResponse>;
export interface GetAssessmentResponse {
  assessment?: Assessment;
  userRole?: Role;
}
export const GetAssessmentResponse = S.suspend(() =>
  S.Struct({ assessment: S.optional(Assessment), userRole: S.optional(Role) }),
).annotations({
  identifier: "GetAssessmentResponse",
}) as any as S.Schema<GetAssessmentResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(ValidationExceptionReason),
    fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Gets the registration status of an account in Audit Manager.
 */
export const getAccountStatus: (
  input: GetAccountStatusRequest,
) => effect.Effect<
  GetAccountStatusResponse,
  InternalServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountStatusRequest,
  output: GetAccountStatusResponse,
  errors: [InternalServerException],
}));
/**
 * Gets the latest analytics data for all your current active assessments.
 */
export const getInsights: (
  input: GetInsightsRequest,
) => effect.Effect<
  GetInsightsResponse,
  AccessDeniedException | InternalServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightsRequest,
  output: GetInsightsResponse,
  errors: [AccessDeniedException, InternalServerException],
}));
/**
 * Gets a list of the Amazon Web Services services from which Audit Manager can collect
 * evidence.
 *
 * Audit Manager defines which Amazon Web Services services are in scope for an
 * assessment. Audit Manager infers this scope by examining the assessment’s controls and
 * their data sources, and then mapping this information to one or more of the corresponding
 * Amazon Web Services services that are in this list.
 *
 * For information about why it's no longer possible to specify services in scope manually, see
 * I can't edit the services in scope for my assessment in
 * the *Troubleshooting* section of the Audit Manager user
 * guide.
 */
export const getServicesInScope: (
  input: GetServicesInScopeRequest,
) => effect.Effect<
  GetServicesInScopeResponse,
  | AccessDeniedException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServicesInScopeRequest,
  output: GetServicesInScopeResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Gets the settings for a specified Amazon Web Services account.
 */
export const getSettings: (
  input: GetSettingsRequest,
) => effect.Effect<
  GetSettingsResponse,
  AccessDeniedException | InternalServerException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSettingsRequest,
  output: GetSettingsResponse,
  errors: [AccessDeniedException, InternalServerException],
}));
/**
 * Lists the latest analytics data for controls within a specific control domain and a
 * specific active assessment.
 *
 * Control insights are listed only if the control belongs to the control domain and
 * assessment that was specified. Moreover, the control must have collected evidence on the
 * `lastUpdated` date of `controlInsightsByAssessment`. If neither
 * of these conditions are met, no data is listed for that control.
 */
export const listAssessmentControlInsightsByControlDomain: {
  (
    input: ListAssessmentControlInsightsByControlDomainRequest,
  ): effect.Effect<
    ListAssessmentControlInsightsByControlDomainResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentControlInsightsByControlDomainRequest,
  ) => stream.Stream<
    ListAssessmentControlInsightsByControlDomainResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentControlInsightsByControlDomainRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentControlInsightsByControlDomainRequest,
  output: ListAssessmentControlInsightsByControlDomainResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of current and past assessments from Audit Manager.
 */
export const listAssessments: {
  (
    input: ListAssessmentsRequest,
  ): effect.Effect<
    ListAssessmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentsRequest,
  ) => stream.Stream<
    ListAssessmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentsRequest,
  output: ListAssessmentsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a control within an assessment in Audit Manager.
 */
export const updateAssessmentControl: (
  input: UpdateAssessmentControlRequest,
) => effect.Effect<
  UpdateAssessmentControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentControlRequest,
  output: UpdateAssessmentControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a custom framework in Audit Manager.
 */
export const updateAssessmentFramework: (
  input: UpdateAssessmentFrameworkRequest,
) => effect.Effect<
  UpdateAssessmentFrameworkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentFrameworkRequest,
  output: UpdateAssessmentFrameworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns a list of keywords that are pre-mapped to the specified control data
 * source.
 */
export const listKeywordsForDataSource: {
  (
    input: ListKeywordsForDataSourceRequest,
  ): effect.Effect<
    ListKeywordsForDataSourceResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeywordsForDataSourceRequest,
  ) => stream.Stream<
    ListKeywordsForDataSourceResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListKeywordsForDataSourceRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeywordsForDataSourceRequest,
  output: ListKeywordsForDataSourceResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of delegations from an audit owner to a delegate.
 */
export const getDelegations: {
  (
    input: GetDelegationsRequest,
  ): effect.Effect<
    GetDelegationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetDelegationsRequest,
  ) => stream.Stream<
    GetDelegationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetDelegationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDelegationsRequest,
  output: GetDelegationsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all evidence from a specified evidence folder in Audit Manager.
 */
export const getEvidenceByEvidenceFolder: {
  (
    input: GetEvidenceByEvidenceFolderRequest,
  ): effect.Effect<
    GetEvidenceByEvidenceFolderResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetEvidenceByEvidenceFolderRequest,
  ) => stream.Stream<
    GetEvidenceByEvidenceFolderResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetEvidenceByEvidenceFolderRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEvidenceByEvidenceFolderRequest,
  output: GetEvidenceByEvidenceFolderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a presigned Amazon S3 URL that can be used to upload a file as manual
 * evidence. For instructions on how to use this operation, see Upload a file from your browser in the Audit Manager User
 * Guide.
 *
 * The following restrictions apply to this operation:
 *
 * - Maximum size of an individual evidence file: 100 MB
 *
 * - Number of daily manual evidence uploads per control: 100
 *
 * - Supported file formats: See Supported file types for manual evidence in the *Audit Manager User Guide*
 *
 * For more information about Audit Manager service restrictions, see Quotas and
 * restrictions for Audit Manager.
 */
export const getEvidenceFileUploadUrl: (
  input: GetEvidenceFileUploadUrlRequest,
) => effect.Effect<
  GetEvidenceFileUploadUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvidenceFileUploadUrlRequest,
  output: GetEvidenceFileUploadUrlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets an evidence folder from a specified assessment in Audit Manager.
 */
export const getEvidenceFolder: (
  input: GetEvidenceFolderRequest,
) => effect.Effect<
  GetEvidenceFolderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvidenceFolderRequest,
  output: GetEvidenceFolderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the latest analytics data for a specific active assessment.
 */
export const getInsightsByAssessment: (
  input: GetInsightsByAssessmentRequest,
) => effect.Effect<
  GetInsightsByAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightsByAssessmentRequest,
  output: GetInsightsByAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the frameworks that are available in the Audit Manager framework
 * library.
 */
export const listAssessmentFrameworks: {
  (
    input: ListAssessmentFrameworksRequest,
  ): effect.Effect<
    ListAssessmentFrameworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentFrameworksRequest,
  ) => stream.Stream<
    ListAssessmentFrameworksResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentFrameworksRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentFrameworksRequest,
  output: ListAssessmentFrameworksResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of sent or received share requests for custom frameworks in Audit Manager.
 */
export const listAssessmentFrameworkShareRequests: {
  (
    input: ListAssessmentFrameworkShareRequestsRequest,
  ): effect.Effect<
    ListAssessmentFrameworkShareRequestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentFrameworkShareRequestsRequest,
  ) => stream.Stream<
    ListAssessmentFrameworkShareRequestsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentFrameworkShareRequestsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentFrameworkShareRequestsRequest,
  output: ListAssessmentFrameworkShareRequestsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of assessment reports created in Audit Manager.
 */
export const listAssessmentReports: {
  (
    input: ListAssessmentReportsRequest,
  ): effect.Effect<
    ListAssessmentReportsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentReportsRequest,
  ) => stream.Stream<
    ListAssessmentReportsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentReportsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentReportsRequest,
  output: ListAssessmentReportsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the latest analytics data for control domains across all of your active
 * assessments.
 *
 * Audit Manager supports the control domains that are provided by Amazon Web Services
 * Control Catalog. For information about how to find a list of available control domains, see
 *
 * `ListDomains`
 * in the Amazon Web Services Control
 * Catalog API Reference.
 *
 * A control domain is listed only if at least one of the controls within that domain
 * collected evidence on the `lastUpdated` date of
 * `controlDomainInsights`. If this condition isn’t met, no data is listed
 * for that control domain.
 */
export const listControlDomainInsights: {
  (
    input: ListControlDomainInsightsRequest,
  ): effect.Effect<
    ListControlDomainInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlDomainInsightsRequest,
  ) => stream.Stream<
    ListControlDomainInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListControlDomainInsightsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlDomainInsightsRequest,
  output: ListControlDomainInsightsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the latest analytics data for controls within a specific control domain across all
 * active assessments.
 *
 * Control insights are listed only if the control belongs to the control domain that
 * was specified and the control collected evidence on the `lastUpdated` date of
 * `controlInsightsMetadata`. If neither of these conditions are met, no data
 * is listed for that control.
 */
export const listControlInsightsByControlDomain: {
  (
    input: ListControlInsightsByControlDomainRequest,
  ): effect.Effect<
    ListControlInsightsByControlDomainResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlInsightsByControlDomainRequest,
  ) => stream.Stream<
    ListControlInsightsByControlDomainResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListControlInsightsByControlDomainRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlInsightsByControlDomainRequest,
  output: ListControlInsightsByControlDomainResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of controls from Audit Manager.
 */
export const listControls: {
  (
    input: ListControlsRequest,
  ): effect.Effect<
    ListControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlsRequest,
  ) => stream.Stream<
    ListControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListControlsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlsRequest,
  output: ListControlsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of all Audit Manager notifications.
 */
export const listNotifications: {
  (
    input: ListNotificationsRequest,
  ): effect.Effect<
    ListNotificationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationsRequest,
  ) => stream.Stream<
    ListNotificationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNotificationsRequest,
  output: ListNotificationsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the status of a control set in an Audit Manager assessment.
 */
export const updateAssessmentControlSetStatus: (
  input: UpdateAssessmentControlSetStatusRequest,
) => effect.Effect<
  UpdateAssessmentControlSetStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentControlSetStatusRequest,
  output: UpdateAssessmentControlSetStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a custom control in Audit Manager.
 */
export const updateControl: (
  input: UpdateControlRequest,
) => effect.Effect<
  UpdateControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateControlRequest,
  output: UpdateControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates Audit Manager settings for the current account.
 */
export const updateSettings: (
  input: UpdateSettingsRequest,
) => effect.Effect<
  UpdateSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSettingsRequest,
  output: UpdateSettingsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Gets the evidence folders from a specified assessment in Audit Manager.
 */
export const getEvidenceFoldersByAssessment: {
  (
    input: GetEvidenceFoldersByAssessmentRequest,
  ): effect.Effect<
    GetEvidenceFoldersByAssessmentResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetEvidenceFoldersByAssessmentRequest,
  ) => stream.Stream<
    GetEvidenceFoldersByAssessmentResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetEvidenceFoldersByAssessmentRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEvidenceFoldersByAssessmentRequest,
  output: GetEvidenceFoldersByAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of evidence folders that are associated with a specified control in an
 * Audit Manager assessment.
 */
export const getEvidenceFoldersByAssessmentControl: {
  (
    input: GetEvidenceFoldersByAssessmentControlRequest,
  ): effect.Effect<
    GetEvidenceFoldersByAssessmentControlResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetEvidenceFoldersByAssessmentControlRequest,
  ) => stream.Stream<
    GetEvidenceFoldersByAssessmentControlResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetEvidenceFoldersByAssessmentControlRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEvidenceFoldersByAssessmentControlRequest,
  output: GetEvidenceFoldersByAssessmentControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists analytics data for control domains within a specified active assessment.
 *
 * Audit Manager supports the control domains that are provided by Amazon Web Services
 * Control Catalog. For information about how to find a list of available control domains, see
 *
 * `ListDomains`
 * in the Amazon Web Services Control
 * Catalog API Reference.
 *
 * A control domain is listed only if at least one of the controls within that domain
 * collected evidence on the `lastUpdated` date of
 * `controlDomainInsights`. If this condition isn’t met, no data is listed
 * for that domain.
 */
export const listControlDomainInsightsByAssessment: {
  (
    input: ListControlDomainInsightsByAssessmentRequest,
  ): effect.Effect<
    ListControlDomainInsightsByAssessmentResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlDomainInsightsByAssessmentRequest,
  ) => stream.Stream<
    ListControlDomainInsightsByAssessmentResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListControlDomainInsightsByAssessmentRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlDomainInsightsByAssessmentRequest,
  output: ListControlDomainInsightsByAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of tags for the specified resource in Audit Manager.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Enables Audit Manager for the specified Amazon Web Services account.
 */
export const registerAccount: (
  input: RegisterAccountRequest,
) => effect.Effect<
  RegisterAccountResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAccountRequest,
  output: RegisterAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables an Amazon Web Services account within the organization as the delegated
 * administrator for Audit Manager.
 */
export const registerOrganizationAdminAccount: (
  input: RegisterOrganizationAdminAccountRequest,
) => effect.Effect<
  RegisterOrganizationAdminAccountResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterOrganizationAdminAccountRequest,
  output: RegisterOrganizationAdminAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a share request for a custom framework in Audit Manager.
 *
 * The share request specifies a recipient and notifies them that a custom framework is
 * available. Recipients have 120 days to accept or decline the request. If no action is
 * taken, the share request expires.
 *
 * When you create a share request, Audit Manager stores a snapshot of your custom
 * framework in the US East (N. Virginia) Amazon Web Services Region. Audit Manager also
 * stores a backup of the same snapshot in the US West (Oregon) Amazon Web Services Region.
 *
 * Audit Manager deletes the snapshot and the backup snapshot when one of the following
 * events occurs:
 *
 * - The sender revokes the share request.
 *
 * - The recipient declines the share request.
 *
 * - The recipient encounters an error and doesn't successfully accept the share
 * request.
 *
 * - The share request expires before the recipient responds to the request.
 *
 * When a sender resends a share request, the snapshot is replaced with an updated version that
 * corresponds with the latest version of the custom framework.
 *
 * When a recipient accepts a share request, the snapshot is replicated into their Amazon Web Services account under the Amazon Web Services Region that was specified in the share
 * request.
 *
 * When you invoke the `StartAssessmentFrameworkShare` API, you are about to
 * share a custom framework with another Amazon Web Services account. You may not share a
 * custom framework that is derived from a standard framework if the standard framework is
 * designated as not eligible for sharing by Amazon Web Services, unless you have obtained
 * permission to do so from the owner of the standard framework. To learn more about which
 * standard frameworks are eligible for sharing, see Framework sharing eligibility in the Audit Manager User
 * Guide.
 */
export const startAssessmentFrameworkShare: (
  input: StartAssessmentFrameworkShareRequest,
) => effect.Effect<
  StartAssessmentFrameworkShareResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAssessmentFrameworkShareRequest,
  output: StartAssessmentFrameworkShareResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Validates the integrity of an assessment report in Audit Manager.
 */
export const validateAssessmentReportIntegrity: (
  input: ValidateAssessmentReportIntegrityRequest,
) => effect.Effect<
  ValidateAssessmentReportIntegrityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateAssessmentReportIntegrityRequest,
  output: ValidateAssessmentReportIntegrityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an assessment in Audit Manager.
 */
export const deleteAssessment: (
  input: DeleteAssessmentRequest,
) => effect.Effect<
  DeleteAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentRequest,
  output: DeleteAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom framework in Audit Manager.
 */
export const deleteAssessmentFramework: (
  input: DeleteAssessmentFrameworkRequest,
) => effect.Effect<
  DeleteAssessmentFrameworkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentFrameworkRequest,
  output: DeleteAssessmentFrameworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a share request for a custom framework in Audit Manager.
 */
export const deleteAssessmentFrameworkShare: (
  input: DeleteAssessmentFrameworkShareRequest,
) => effect.Effect<
  DeleteAssessmentFrameworkShareResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentFrameworkShareRequest,
  output: DeleteAssessmentFrameworkShareResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an assessment report in Audit Manager.
 *
 * When you run the `DeleteAssessmentReport` operation, Audit Manager
 * attempts to delete the following data:
 *
 * - The specified assessment report that’s stored in your S3 bucket
 *
 * - The associated metadata that’s stored in Audit Manager
 *
 * If Audit Manager can’t access the assessment report in your S3 bucket, the report
 * isn’t deleted. In this event, the `DeleteAssessmentReport` operation doesn’t
 * fail. Instead, it proceeds to delete the associated metadata only. You must then delete the
 * assessment report from the S3 bucket yourself.
 *
 * This scenario happens when Audit Manager receives a `403 (Forbidden)` or
 * `404 (Not Found)` error from Amazon S3. To avoid this, make sure that
 * your S3 bucket is available, and that you configured the correct permissions for Audit Manager to delete resources in your S3 bucket. For an example permissions policy that
 * you can use, see Assessment report destination permissions in the *Audit Manager User Guide*. For information about the issues that could cause a 403
 * (Forbidden) or `404 (Not Found`) error from Amazon S3, see
 * List of Error Codes in the Amazon Simple Storage Service API
 * Reference.
 */
export const deleteAssessmentReport: (
  input: DeleteAssessmentReportRequest,
) => effect.Effect<
  DeleteAssessmentReportResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentReportRequest,
  output: DeleteAssessmentReportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom control in Audit Manager.
 *
 * When you invoke this operation, the custom control is deleted from any frameworks or
 * assessments that it’s currently part of. As a result, Audit Manager will stop
 * collecting evidence for that custom control in all of your assessments. This includes
 * assessments that you previously created before you deleted the custom control.
 */
export const deleteControl: (
  input: DeleteControlRequest,
) => effect.Effect<
  DeleteControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteControlRequest,
  output: DeleteControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregisters an account in Audit Manager.
 *
 * Before you deregister, you can use the UpdateSettings API operation to set your preferred data retention policy. By
 * default, Audit Manager retains your data. If you want to delete your data, you can
 * use the `DeregistrationPolicy` attribute to request the deletion of your
 * data.
 *
 * For more information about data retention, see Data
 * Protection in the *Audit Manager User Guide*.
 */
export const deregisterAccount: (
  input: DeregisterAccountRequest,
) => effect.Effect<
  DeregisterAccountResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterAccountRequest,
  output: DeregisterAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes the specified Amazon Web Services account as a delegated administrator for
 * Audit Manager.
 *
 * When you remove a delegated administrator from your Audit Manager settings, you
 * continue to have access to the evidence that you previously collected under that account.
 * This is also the case when you deregister a delegated administrator from Organizations. However, Audit Manager stops collecting and attaching evidence to
 * that delegated administrator account moving forward.
 *
 * Keep in mind the following cleanup task if you use evidence finder:
 *
 * Before you use your management account to remove a delegated administrator, make sure
 * that the current delegated administrator account signs in to Audit Manager and
 * disables evidence finder first. Disabling evidence finder automatically deletes the
 * event data store that was created in their account when they enabled evidence finder. If
 * this task isn’t completed, the event data store remains in their account. In this case,
 * we recommend that the original delegated administrator goes to CloudTrail Lake
 * and manually deletes the
 * event data store.
 *
 * This cleanup task is necessary to ensure that you don't end up with multiple event
 * data stores. Audit Manager ignores an unused event data store after you remove or
 * change a delegated administrator account. However, the unused event data store continues
 * to incur storage costs from CloudTrail Lake if you don't delete it.
 *
 * When you deregister a delegated administrator account for Audit Manager, the data
 * for that account isn’t deleted. If you want to delete resource data for a delegated
 * administrator account, you must perform that task separately before you deregister the
 * account. Either, you can do this in the Audit Manager console. Or, you can use one of
 * the delete API operations that are provided by Audit Manager.
 *
 * To delete your Audit Manager resource data, see the following instructions:
 *
 * - DeleteAssessment (see also: Deleting an
 * assessment in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentFramework (see also: Deleting a
 * custom framework in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentFrameworkShare (see also: Deleting a share request in the Audit Manager User
 * Guide)
 *
 * - DeleteAssessmentReport (see also: Deleting an assessment report in the Audit Manager User
 * Guide)
 *
 * - DeleteControl (see also: Deleting a custom
 * control in the Audit Manager User
 * Guide)
 *
 * At this time, Audit Manager doesn't provide an option to delete evidence for a
 * specific delegated administrator. Instead, when your management account deregisters Audit Manager, we perform a cleanup for the current delegated administrator account at the
 * time of deregistration.
 */
export const deregisterOrganizationAdminAccount: (
  input: DeregisterOrganizationAdminAccountRequest,
) => effect.Effect<
  DeregisterOrganizationAdminAccountResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterOrganizationAdminAccountRequest,
  output: DeregisterOrganizationAdminAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Disassociates an evidence folder from the specified assessment report in Audit Manager.
 */
export const disassociateAssessmentReportEvidenceFolder: (
  input: DisassociateAssessmentReportEvidenceFolderRequest,
) => effect.Effect<
  DisassociateAssessmentReportEvidenceFolderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateAssessmentReportEvidenceFolderRequest,
  output: DisassociateAssessmentReportEvidenceFolderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the name of the delegated Amazon Web Services administrator account for a specified
 * organization.
 */
export const getOrganizationAdminAccount: (
  input: GetOrganizationAdminAccountRequest,
) => effect.Effect<
  GetOrganizationAdminAccountResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOrganizationAdminAccountRequest,
  output: GetOrganizationAdminAccountResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Tags the specified resource in Audit Manager.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource in Audit Manager.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates an evidence folder to an assessment report in an Audit Manager
 * assessment.
 */
export const associateAssessmentReportEvidenceFolder: (
  input: AssociateAssessmentReportEvidenceFolderRequest,
) => effect.Effect<
  AssociateAssessmentReportEvidenceFolderResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateAssessmentReportEvidenceFolderRequest,
  output: AssociateAssessmentReportEvidenceFolderResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Disassociates a list of evidence from an assessment report in Audit Manager.
 */
export const batchDisassociateAssessmentReportEvidence: (
  input: BatchDisassociateAssessmentReportEvidenceRequest,
) => effect.Effect<
  BatchDisassociateAssessmentReportEvidenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateAssessmentReportEvidenceRequest,
  output: BatchDisassociateAssessmentReportEvidenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a list of evidence to an assessment report in an Audit Manager
 * assessment.
 */
export const batchAssociateAssessmentReportEvidence: (
  input: BatchAssociateAssessmentReportEvidenceRequest,
) => effect.Effect<
  BatchAssociateAssessmentReportEvidenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateAssessmentReportEvidenceRequest,
  output: BatchAssociateAssessmentReportEvidenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a batch of delegations for an assessment in Audit Manager.
 */
export const batchDeleteDelegationByAssessment: (
  input: BatchDeleteDelegationByAssessmentRequest,
) => effect.Effect<
  BatchDeleteDelegationByAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteDelegationByAssessmentRequest,
  output: BatchDeleteDelegationByAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an assessment report for the specified assessment.
 */
export const createAssessmentReport: (
  input: CreateAssessmentReportRequest,
) => effect.Effect<
  CreateAssessmentReportResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentReportRequest,
  output: CreateAssessmentReportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the URL of an assessment report in Audit Manager.
 */
export const getAssessmentReportUrl: (
  input: GetAssessmentReportUrlRequest,
) => effect.Effect<
  GetAssessmentReportUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentReportUrlRequest,
  output: GetAssessmentReportUrlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a list of changelogs from Audit Manager.
 */
export const getChangeLogs: {
  (
    input: GetChangeLogsRequest,
  ): effect.Effect<
    GetChangeLogsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetChangeLogsRequest,
  ) => stream.Stream<
    GetChangeLogsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetChangeLogsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetChangeLogsRequest,
  output: GetChangeLogsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a specified control.
 */
export const getControl: (
  input: GetControlRequest,
) => effect.Effect<
  GetControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetControlRequest,
  output: GetControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a batch of delegations for an assessment in Audit Manager.
 */
export const batchCreateDelegationByAssessment: (
  input: BatchCreateDelegationByAssessmentRequest,
) => effect.Effect<
  BatchCreateDelegationByAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateDelegationByAssessmentRequest,
  output: BatchCreateDelegationByAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds one or more pieces of evidence to a control in an Audit Manager assessment.
 *
 * You can import manual evidence from any S3 bucket by specifying the S3 URI of the
 * object. You can also upload a file from your browser, or enter plain text in response to a
 * risk assessment question.
 *
 * The following restrictions apply to this action:
 *
 * - `manualEvidence` can be only one of the following:
 * `evidenceFileName`, `s3ResourcePath`, or
 * `textResponse`
 *
 * - Maximum size of an individual evidence file: 100 MB
 *
 * - Number of daily manual evidence uploads per control: 100
 *
 * - Supported file formats: See Supported file types for manual evidence in the *Audit Manager User Guide*
 *
 * For more information about Audit Manager service restrictions, see Quotas and
 * restrictions for Audit Manager.
 */
export const batchImportEvidenceToAssessmentControl: (
  input: BatchImportEvidenceToAssessmentControlRequest,
) => effect.Effect<
  BatchImportEvidenceToAssessmentControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchImportEvidenceToAssessmentControlRequest,
  output: BatchImportEvidenceToAssessmentControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified framework.
 */
export const getAssessmentFramework: (
  input: GetAssessmentFrameworkRequest,
) => effect.Effect<
  GetAssessmentFrameworkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentFrameworkRequest,
  output: GetAssessmentFrameworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified evidence item.
 */
export const getEvidence: (
  input: GetEvidenceRequest,
) => effect.Effect<
  GetEvidenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvidenceRequest,
  output: GetEvidenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Edits an Audit Manager assessment.
 */
export const updateAssessment: (
  input: UpdateAssessmentRequest,
) => effect.Effect<
  UpdateAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentRequest,
  output: UpdateAssessmentResponse,
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
 * Updates a share request for a custom framework in Audit Manager.
 */
export const updateAssessmentFrameworkShare: (
  input: UpdateAssessmentFrameworkShareRequest,
) => effect.Effect<
  UpdateAssessmentFrameworkShareResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentFrameworkShareRequest,
  output: UpdateAssessmentFrameworkShareResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the status of an assessment in Audit Manager.
 */
export const updateAssessmentStatus: (
  input: UpdateAssessmentStatusRequest,
) => effect.Effect<
  UpdateAssessmentStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentStatusRequest,
  output: UpdateAssessmentStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an assessment in Audit Manager.
 */
export const createAssessment: (
  input: CreateAssessmentRequest,
) => effect.Effect<
  CreateAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentRequest,
  output: CreateAssessmentResponse,
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
 * Creates a custom framework in Audit Manager.
 */
export const createAssessmentFramework: (
  input: CreateAssessmentFrameworkRequest,
) => effect.Effect<
  CreateAssessmentFrameworkResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentFrameworkRequest,
  output: CreateAssessmentFrameworkResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new custom control in Audit Manager.
 */
export const createControl: (
  input: CreateControlRequest,
) => effect.Effect<
  CreateControlResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateControlRequest,
  output: CreateControlResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Gets information about a specified assessment.
 */
export const getAssessment: (
  input: GetAssessmentRequest,
) => effect.Effect<
  GetAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentRequest,
  output: GetAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
