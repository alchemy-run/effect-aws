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
  sdkId: "Inspector",
  serviceShapeName: "InspectorService",
});
const auth = T.AwsAuthSigv4({ name: "inspector" });
const ver = T.ServiceVersion("2016-02-16");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://inspector-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://inspector-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://inspector.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://inspector.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type AssessmentTargetName = string;
export type AssessmentTemplateName = string;
export type AssessmentRunDuration = number;
export type UUID = string;
export type PaginationToken = string;
export type ListMaxResults = number;
export type ListEventSubscriptionsMaxResults = number;
export type PreviewAgentsMaxResults = number;
export type AttributeKey = string;
export type AssessmentRunName = string;
export type AttributeValue = string;
export type TagKey = string;
export type TagValue = string;
export type NamePattern = string;
export type AgentId = string;
export type AutoScalingGroup = string;
export type RuleName = string;
export type ErrorMessage = string;
export type Url = string;
export type ArnCount = number;
export type NumericVersion = number;
export type ServiceName = string;
export type FindingId = string;
export type Text = string;
export type NumericSeverity = number;
export type IocConfidence = number;
export type RulesPackageName = string;
export type Version = string;
export type ProviderName = string;
export type MessageType = string;
export type Hostname = string;
export type AgentVersion = string;
export type OperatingSystem = string;
export type KernelVersion = string;
export type Ipv4Address = string;
export type Message = string;
export type FindingCount = number;
export type AmiId = string;
export type ScopeValue = string;

//# Schemas
export interface DescribeCrossAccountAccessRoleRequest {}
export const DescribeCrossAccountAccessRoleRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCrossAccountAccessRoleRequest",
}) as any as S.Schema<DescribeCrossAccountAccessRoleRequest>;
export type AddRemoveAttributesFindingArnList = string[];
export const AddRemoveAttributesFindingArnList = S.Array(S.String);
export type AssessmentTemplateRulesPackageArnList = string[];
export const AssessmentTemplateRulesPackageArnList = S.Array(S.String);
export type BatchDescribeArnList = string[];
export const BatchDescribeArnList = S.Array(S.String);
export type BatchDescribeExclusionsArnList = string[];
export const BatchDescribeExclusionsArnList = S.Array(S.String);
export type Locale = "EN_US" | (string & {});
export const Locale = S.String;
export type ReportFileFormat = "HTML" | "PDF" | (string & {});
export const ReportFileFormat = S.String;
export type ReportType = "FINDING" | "FULL" | (string & {});
export const ReportType = S.String;
export type ListParentArnList = string[];
export const ListParentArnList = S.Array(S.String);
export type UserAttributeKeyList = string[];
export const UserAttributeKeyList = S.Array(S.String);
export type StopAction = "START_EVALUATION" | "SKIP_EVALUATION" | (string & {});
export const StopAction = S.String;
export type InspectorEvent =
  | "ASSESSMENT_RUN_STARTED"
  | "ASSESSMENT_RUN_COMPLETED"
  | "ASSESSMENT_RUN_STATE_CHANGED"
  | "FINDING_REPORTED"
  | "OTHER"
  | (string & {});
export const InspectorEvent = S.String;
export interface CreateAssessmentTargetRequest {
  assessmentTargetName: string;
  resourceGroupArn?: string;
}
export const CreateAssessmentTargetRequest = S.suspend(() =>
  S.Struct({
    assessmentTargetName: S.String,
    resourceGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAssessmentTargetRequest",
}) as any as S.Schema<CreateAssessmentTargetRequest>;
export interface Attribute {
  key: string;
  value?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type UserAttributeList = Attribute[];
export const UserAttributeList = S.Array(Attribute);
export interface CreateAssessmentTemplateRequest {
  assessmentTargetArn: string;
  assessmentTemplateName: string;
  durationInSeconds: number;
  rulesPackageArns: string[];
  userAttributesForFindings?: Attribute[];
}
export const CreateAssessmentTemplateRequest = S.suspend(() =>
  S.Struct({
    assessmentTargetArn: S.String,
    assessmentTemplateName: S.String,
    durationInSeconds: S.Number,
    rulesPackageArns: AssessmentTemplateRulesPackageArnList,
    userAttributesForFindings: S.optional(UserAttributeList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAssessmentTemplateRequest",
}) as any as S.Schema<CreateAssessmentTemplateRequest>;
export interface CreateExclusionsPreviewRequest {
  assessmentTemplateArn: string;
}
export const CreateExclusionsPreviewRequest = S.suspend(() =>
  S.Struct({ assessmentTemplateArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExclusionsPreviewRequest",
}) as any as S.Schema<CreateExclusionsPreviewRequest>;
export interface DeleteAssessmentRunRequest {
  assessmentRunArn: string;
}
export const DeleteAssessmentRunRequest = S.suspend(() =>
  S.Struct({ assessmentRunArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAssessmentRunRequest",
}) as any as S.Schema<DeleteAssessmentRunRequest>;
export interface DeleteAssessmentRunResponse {}
export const DeleteAssessmentRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentRunResponse",
}) as any as S.Schema<DeleteAssessmentRunResponse>;
export interface DeleteAssessmentTargetRequest {
  assessmentTargetArn: string;
}
export const DeleteAssessmentTargetRequest = S.suspend(() =>
  S.Struct({ assessmentTargetArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAssessmentTargetRequest",
}) as any as S.Schema<DeleteAssessmentTargetRequest>;
export interface DeleteAssessmentTargetResponse {}
export const DeleteAssessmentTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentTargetResponse",
}) as any as S.Schema<DeleteAssessmentTargetResponse>;
export interface DeleteAssessmentTemplateRequest {
  assessmentTemplateArn: string;
}
export const DeleteAssessmentTemplateRequest = S.suspend(() =>
  S.Struct({ assessmentTemplateArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAssessmentTemplateRequest",
}) as any as S.Schema<DeleteAssessmentTemplateRequest>;
export interface DeleteAssessmentTemplateResponse {}
export const DeleteAssessmentTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAssessmentTemplateResponse",
}) as any as S.Schema<DeleteAssessmentTemplateResponse>;
export interface DescribeAssessmentRunsRequest {
  assessmentRunArns: string[];
}
export const DescribeAssessmentRunsRequest = S.suspend(() =>
  S.Struct({ assessmentRunArns: BatchDescribeArnList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAssessmentRunsRequest",
}) as any as S.Schema<DescribeAssessmentRunsRequest>;
export interface DescribeAssessmentTargetsRequest {
  assessmentTargetArns: string[];
}
export const DescribeAssessmentTargetsRequest = S.suspend(() =>
  S.Struct({ assessmentTargetArns: BatchDescribeArnList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAssessmentTargetsRequest",
}) as any as S.Schema<DescribeAssessmentTargetsRequest>;
export interface DescribeAssessmentTemplatesRequest {
  assessmentTemplateArns: string[];
}
export const DescribeAssessmentTemplatesRequest = S.suspend(() =>
  S.Struct({ assessmentTemplateArns: BatchDescribeArnList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAssessmentTemplatesRequest",
}) as any as S.Schema<DescribeAssessmentTemplatesRequest>;
export interface DescribeCrossAccountAccessRoleResponse {
  roleArn: string;
  valid: boolean;
  registeredAt: Date;
}
export const DescribeCrossAccountAccessRoleResponse = S.suspend(() =>
  S.Struct({
    roleArn: S.String,
    valid: S.Boolean,
    registeredAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DescribeCrossAccountAccessRoleResponse",
}) as any as S.Schema<DescribeCrossAccountAccessRoleResponse>;
export interface DescribeExclusionsRequest {
  exclusionArns: string[];
  locale?: Locale;
}
export const DescribeExclusionsRequest = S.suspend(() =>
  S.Struct({
    exclusionArns: BatchDescribeExclusionsArnList,
    locale: S.optional(Locale),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeExclusionsRequest",
}) as any as S.Schema<DescribeExclusionsRequest>;
export interface DescribeFindingsRequest {
  findingArns: string[];
  locale?: Locale;
}
export const DescribeFindingsRequest = S.suspend(() =>
  S.Struct({
    findingArns: BatchDescribeArnList,
    locale: S.optional(Locale),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFindingsRequest",
}) as any as S.Schema<DescribeFindingsRequest>;
export interface DescribeResourceGroupsRequest {
  resourceGroupArns: string[];
}
export const DescribeResourceGroupsRequest = S.suspend(() =>
  S.Struct({ resourceGroupArns: BatchDescribeArnList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeResourceGroupsRequest",
}) as any as S.Schema<DescribeResourceGroupsRequest>;
export interface DescribeRulesPackagesRequest {
  rulesPackageArns: string[];
  locale?: Locale;
}
export const DescribeRulesPackagesRequest = S.suspend(() =>
  S.Struct({
    rulesPackageArns: BatchDescribeArnList,
    locale: S.optional(Locale),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRulesPackagesRequest",
}) as any as S.Schema<DescribeRulesPackagesRequest>;
export interface GetAssessmentReportRequest {
  assessmentRunArn: string;
  reportFileFormat: ReportFileFormat;
  reportType: ReportType;
}
export const GetAssessmentReportRequest = S.suspend(() =>
  S.Struct({
    assessmentRunArn: S.String,
    reportFileFormat: ReportFileFormat,
    reportType: ReportType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAssessmentReportRequest",
}) as any as S.Schema<GetAssessmentReportRequest>;
export interface GetExclusionsPreviewRequest {
  assessmentTemplateArn: string;
  previewToken: string;
  nextToken?: string;
  maxResults?: number;
  locale?: Locale;
}
export const GetExclusionsPreviewRequest = S.suspend(() =>
  S.Struct({
    assessmentTemplateArn: S.String,
    previewToken: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    locale: S.optional(Locale),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetExclusionsPreviewRequest",
}) as any as S.Schema<GetExclusionsPreviewRequest>;
export interface GetTelemetryMetadataRequest {
  assessmentRunArn: string;
}
export const GetTelemetryMetadataRequest = S.suspend(() =>
  S.Struct({ assessmentRunArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTelemetryMetadataRequest",
}) as any as S.Schema<GetTelemetryMetadataRequest>;
export interface ListEventSubscriptionsRequest {
  resourceArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEventSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEventSubscriptionsRequest",
}) as any as S.Schema<ListEventSubscriptionsRequest>;
export interface ListExclusionsRequest {
  assessmentRunArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListExclusionsRequest = S.suspend(() =>
  S.Struct({
    assessmentRunArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExclusionsRequest",
}) as any as S.Schema<ListExclusionsRequest>;
export interface ListRulesPackagesRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListRulesPackagesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRulesPackagesRequest",
}) as any as S.Schema<ListRulesPackagesRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PreviewAgentsRequest {
  previewAgentsArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const PreviewAgentsRequest = S.suspend(() =>
  S.Struct({
    previewAgentsArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PreviewAgentsRequest",
}) as any as S.Schema<PreviewAgentsRequest>;
export interface RegisterCrossAccountAccessRoleRequest {
  roleArn: string;
}
export const RegisterCrossAccountAccessRoleRequest = S.suspend(() =>
  S.Struct({ roleArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterCrossAccountAccessRoleRequest",
}) as any as S.Schema<RegisterCrossAccountAccessRoleRequest>;
export interface RegisterCrossAccountAccessRoleResponse {}
export const RegisterCrossAccountAccessRoleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterCrossAccountAccessRoleResponse",
}) as any as S.Schema<RegisterCrossAccountAccessRoleResponse>;
export interface RemoveAttributesFromFindingsRequest {
  findingArns: string[];
  attributeKeys: string[];
}
export const RemoveAttributesFromFindingsRequest = S.suspend(() =>
  S.Struct({
    findingArns: AddRemoveAttributesFindingArnList,
    attributeKeys: UserAttributeKeyList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveAttributesFromFindingsRequest",
}) as any as S.Schema<RemoveAttributesFromFindingsRequest>;
export interface StartAssessmentRunRequest {
  assessmentTemplateArn: string;
  assessmentRunName?: string;
}
export const StartAssessmentRunRequest = S.suspend(() =>
  S.Struct({
    assessmentTemplateArn: S.String,
    assessmentRunName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartAssessmentRunRequest",
}) as any as S.Schema<StartAssessmentRunRequest>;
export interface StopAssessmentRunRequest {
  assessmentRunArn: string;
  stopAction?: StopAction;
}
export const StopAssessmentRunRequest = S.suspend(() =>
  S.Struct({
    assessmentRunArn: S.String,
    stopAction: S.optional(StopAction),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopAssessmentRunRequest",
}) as any as S.Schema<StopAssessmentRunRequest>;
export interface StopAssessmentRunResponse {}
export const StopAssessmentRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopAssessmentRunResponse",
}) as any as S.Schema<StopAssessmentRunResponse>;
export interface SubscribeToEventRequest {
  resourceArn: string;
  event: InspectorEvent;
  topicArn: string;
}
export const SubscribeToEventRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    event: InspectorEvent,
    topicArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SubscribeToEventRequest",
}) as any as S.Schema<SubscribeToEventRequest>;
export interface SubscribeToEventResponse {}
export const SubscribeToEventResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SubscribeToEventResponse",
}) as any as S.Schema<SubscribeToEventResponse>;
export interface UnsubscribeFromEventRequest {
  resourceArn: string;
  event: InspectorEvent;
  topicArn: string;
}
export const UnsubscribeFromEventRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    event: InspectorEvent,
    topicArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UnsubscribeFromEventRequest",
}) as any as S.Schema<UnsubscribeFromEventRequest>;
export interface UnsubscribeFromEventResponse {}
export const UnsubscribeFromEventResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UnsubscribeFromEventResponse",
}) as any as S.Schema<UnsubscribeFromEventResponse>;
export interface UpdateAssessmentTargetRequest {
  assessmentTargetArn: string;
  assessmentTargetName: string;
  resourceGroupArn?: string;
}
export const UpdateAssessmentTargetRequest = S.suspend(() =>
  S.Struct({
    assessmentTargetArn: S.String,
    assessmentTargetName: S.String,
    resourceGroupArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAssessmentTargetRequest",
}) as any as S.Schema<UpdateAssessmentTargetRequest>;
export interface UpdateAssessmentTargetResponse {}
export const UpdateAssessmentTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAssessmentTargetResponse",
}) as any as S.Schema<UpdateAssessmentTargetResponse>;
export type AgentHealth = "HEALTHY" | "UNHEALTHY" | "UNKNOWN" | (string & {});
export const AgentHealth = S.String;
export type AgentHealthList = AgentHealth[];
export const AgentHealthList = S.Array(AgentHealth);
export type AgentHealthCode =
  | "IDLE"
  | "RUNNING"
  | "SHUTDOWN"
  | "UNHEALTHY"
  | "THROTTLED"
  | "UNKNOWN"
  | (string & {});
export const AgentHealthCode = S.String;
export type AgentHealthCodeList = AgentHealthCode[];
export const AgentHealthCodeList = S.Array(AgentHealthCode);
export type AssessmentRunState =
  | "CREATED"
  | "START_DATA_COLLECTION_PENDING"
  | "START_DATA_COLLECTION_IN_PROGRESS"
  | "COLLECTING_DATA"
  | "STOP_DATA_COLLECTION_PENDING"
  | "DATA_COLLECTED"
  | "START_EVALUATING_RULES_PENDING"
  | "EVALUATING_RULES"
  | "FAILED"
  | "ERROR"
  | "COMPLETED"
  | "COMPLETED_WITH_ERRORS"
  | "CANCELED"
  | (string & {});
export const AssessmentRunState = S.String;
export type AssessmentRunStateList = AssessmentRunState[];
export const AssessmentRunStateList = S.Array(AssessmentRunState);
export type FilterRulesPackageArnList = string[];
export const FilterRulesPackageArnList = S.Array(S.String);
export type AgentIdList = string[];
export const AgentIdList = S.Array(S.String);
export type AutoScalingGroupList = string[];
export const AutoScalingGroupList = S.Array(S.String);
export type RuleNameList = string[];
export const RuleNameList = S.Array(S.String);
export type Severity =
  | "Low"
  | "Medium"
  | "High"
  | "Informational"
  | "Undefined"
  | (string & {});
export const Severity = S.String;
export type SeverityList = Severity[];
export const SeverityList = S.Array(Severity);
export type AttributeList = Attribute[];
export const AttributeList = S.Array(Attribute);
export interface ResourceGroupTag {
  key: string;
  value?: string;
}
export const ResourceGroupTag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({
  identifier: "ResourceGroupTag",
}) as any as S.Schema<ResourceGroupTag>;
export type ResourceGroupTags = ResourceGroupTag[];
export const ResourceGroupTags = S.Array(ResourceGroupTag);
export type AccessDeniedErrorCode =
  | "ACCESS_DENIED_TO_ASSESSMENT_TARGET"
  | "ACCESS_DENIED_TO_ASSESSMENT_TEMPLATE"
  | "ACCESS_DENIED_TO_ASSESSMENT_RUN"
  | "ACCESS_DENIED_TO_FINDING"
  | "ACCESS_DENIED_TO_RESOURCE_GROUP"
  | "ACCESS_DENIED_TO_RULES_PACKAGE"
  | "ACCESS_DENIED_TO_SNS_TOPIC"
  | "ACCESS_DENIED_TO_IAM_ROLE"
  | (string & {});
export const AccessDeniedErrorCode = S.String;
export type ReportStatus =
  | "WORK_IN_PROGRESS"
  | "FAILED"
  | "COMPLETED"
  | (string & {});
export const ReportStatus = S.String;
export type PreviewStatus = "WORK_IN_PROGRESS" | "COMPLETED" | (string & {});
export const PreviewStatus = S.String;
export interface AgentFilter {
  agentHealths: AgentHealth[];
  agentHealthCodes: AgentHealthCode[];
}
export const AgentFilter = S.suspend(() =>
  S.Struct({
    agentHealths: AgentHealthList,
    agentHealthCodes: AgentHealthCodeList,
  }),
).annotations({ identifier: "AgentFilter" }) as any as S.Schema<AgentFilter>;
export interface AssessmentTargetFilter {
  assessmentTargetNamePattern?: string;
}
export const AssessmentTargetFilter = S.suspend(() =>
  S.Struct({ assessmentTargetNamePattern: S.optional(S.String) }),
).annotations({
  identifier: "AssessmentTargetFilter",
}) as any as S.Schema<AssessmentTargetFilter>;
export interface DurationRange {
  minSeconds?: number;
  maxSeconds?: number;
}
export const DurationRange = S.suspend(() =>
  S.Struct({
    minSeconds: S.optional(S.Number),
    maxSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "DurationRange",
}) as any as S.Schema<DurationRange>;
export interface AssessmentTemplateFilter {
  namePattern?: string;
  durationRange?: DurationRange;
  rulesPackageArns?: string[];
}
export const AssessmentTemplateFilter = S.suspend(() =>
  S.Struct({
    namePattern: S.optional(S.String),
    durationRange: S.optional(DurationRange),
    rulesPackageArns: S.optional(FilterRulesPackageArnList),
  }),
).annotations({
  identifier: "AssessmentTemplateFilter",
}) as any as S.Schema<AssessmentTemplateFilter>;
export type ListReturnedArnList = string[];
export const ListReturnedArnList = S.Array(S.String);
export interface TimestampRange {
  beginDate?: Date;
  endDate?: Date;
}
export const TimestampRange = S.suspend(() =>
  S.Struct({
    beginDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TimestampRange",
}) as any as S.Schema<TimestampRange>;
export interface FindingFilter {
  agentIds?: string[];
  autoScalingGroups?: string[];
  ruleNames?: string[];
  severities?: Severity[];
  rulesPackageArns?: string[];
  attributes?: Attribute[];
  userAttributes?: Attribute[];
  creationTimeRange?: TimestampRange;
}
export const FindingFilter = S.suspend(() =>
  S.Struct({
    agentIds: S.optional(AgentIdList),
    autoScalingGroups: S.optional(AutoScalingGroupList),
    ruleNames: S.optional(RuleNameList),
    severities: S.optional(SeverityList),
    rulesPackageArns: S.optional(FilterRulesPackageArnList),
    attributes: S.optional(AttributeList),
    userAttributes: S.optional(AttributeList),
    creationTimeRange: S.optional(TimestampRange),
  }),
).annotations({
  identifier: "FindingFilter",
}) as any as S.Schema<FindingFilter>;
export interface Tag {
  key: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface AddAttributesToFindingsRequest {
  findingArns: string[];
  attributes: Attribute[];
}
export const AddAttributesToFindingsRequest = S.suspend(() =>
  S.Struct({
    findingArns: AddRemoveAttributesFindingArnList,
    attributes: UserAttributeList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddAttributesToFindingsRequest",
}) as any as S.Schema<AddAttributesToFindingsRequest>;
export interface CreateAssessmentTargetResponse {
  assessmentTargetArn: string;
}
export const CreateAssessmentTargetResponse = S.suspend(() =>
  S.Struct({ assessmentTargetArn: S.String }),
).annotations({
  identifier: "CreateAssessmentTargetResponse",
}) as any as S.Schema<CreateAssessmentTargetResponse>;
export interface CreateAssessmentTemplateResponse {
  assessmentTemplateArn: string;
}
export const CreateAssessmentTemplateResponse = S.suspend(() =>
  S.Struct({ assessmentTemplateArn: S.String }),
).annotations({
  identifier: "CreateAssessmentTemplateResponse",
}) as any as S.Schema<CreateAssessmentTemplateResponse>;
export interface CreateExclusionsPreviewResponse {
  previewToken: string;
}
export const CreateExclusionsPreviewResponse = S.suspend(() =>
  S.Struct({ previewToken: S.String }),
).annotations({
  identifier: "CreateExclusionsPreviewResponse",
}) as any as S.Schema<CreateExclusionsPreviewResponse>;
export interface CreateResourceGroupRequest {
  resourceGroupTags: ResourceGroupTag[];
}
export const CreateResourceGroupRequest = S.suspend(() =>
  S.Struct({ resourceGroupTags: ResourceGroupTags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResourceGroupRequest",
}) as any as S.Schema<CreateResourceGroupRequest>;
export interface GetAssessmentReportResponse {
  status: ReportStatus;
  url?: string;
}
export const GetAssessmentReportResponse = S.suspend(() =>
  S.Struct({ status: ReportStatus, url: S.optional(S.String) }),
).annotations({
  identifier: "GetAssessmentReportResponse",
}) as any as S.Schema<GetAssessmentReportResponse>;
export interface ListAssessmentRunAgentsRequest {
  assessmentRunArn: string;
  filter?: AgentFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentRunAgentsRequest = S.suspend(() =>
  S.Struct({
    assessmentRunArn: S.String,
    filter: S.optional(AgentFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssessmentRunAgentsRequest",
}) as any as S.Schema<ListAssessmentRunAgentsRequest>;
export interface ListAssessmentTargetsRequest {
  filter?: AssessmentTargetFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentTargetsRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(AssessmentTargetFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssessmentTargetsRequest",
}) as any as S.Schema<ListAssessmentTargetsRequest>;
export interface ListAssessmentTemplatesRequest {
  assessmentTargetArns?: string[];
  filter?: AssessmentTemplateFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentTemplatesRequest = S.suspend(() =>
  S.Struct({
    assessmentTargetArns: S.optional(ListParentArnList),
    filter: S.optional(AssessmentTemplateFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssessmentTemplatesRequest",
}) as any as S.Schema<ListAssessmentTemplatesRequest>;
export interface ListExclusionsResponse {
  exclusionArns: string[];
  nextToken?: string;
}
export const ListExclusionsResponse = S.suspend(() =>
  S.Struct({
    exclusionArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExclusionsResponse",
}) as any as S.Schema<ListExclusionsResponse>;
export interface ListFindingsRequest {
  assessmentRunArns?: string[];
  filter?: FindingFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListFindingsRequest = S.suspend(() =>
  S.Struct({
    assessmentRunArns: S.optional(ListParentArnList),
    filter: S.optional(FindingFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFindingsRequest",
}) as any as S.Schema<ListFindingsRequest>;
export interface ListRulesPackagesResponse {
  rulesPackageArns: string[];
  nextToken?: string;
}
export const ListRulesPackagesResponse = S.suspend(() =>
  S.Struct({
    rulesPackageArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRulesPackagesResponse",
}) as any as S.Schema<ListRulesPackagesResponse>;
export interface ListTagsForResourceResponse {
  tags: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type FailedItemErrorCode =
  | "INVALID_ARN"
  | "DUPLICATE_ARN"
  | "ITEM_DOES_NOT_EXIST"
  | "ACCESS_DENIED"
  | "LIMIT_EXCEEDED"
  | "INTERNAL_ERROR"
  | (string & {});
export const FailedItemErrorCode = S.String;
export interface FailedItemDetails {
  failureCode: FailedItemErrorCode;
  retryable: boolean;
}
export const FailedItemDetails = S.suspend(() =>
  S.Struct({ failureCode: FailedItemErrorCode, retryable: S.Boolean }),
).annotations({
  identifier: "FailedItemDetails",
}) as any as S.Schema<FailedItemDetails>;
export type FailedItems = { [key: string]: FailedItemDetails | undefined };
export const FailedItems = S.Record({
  key: S.String,
  value: S.UndefinedOr(FailedItemDetails),
});
export interface RemoveAttributesFromFindingsResponse {
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const RemoveAttributesFromFindingsResponse = S.suspend(() =>
  S.Struct({ failedItems: FailedItems }),
).annotations({
  identifier: "RemoveAttributesFromFindingsResponse",
}) as any as S.Schema<RemoveAttributesFromFindingsResponse>;
export interface SetTagsForResourceRequest {
  resourceArn: string;
  tags?: Tag[];
}
export const SetTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: S.optional(TagList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetTagsForResourceRequest",
}) as any as S.Schema<SetTagsForResourceRequest>;
export interface SetTagsForResourceResponse {}
export const SetTagsForResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SetTagsForResourceResponse",
}) as any as S.Schema<SetTagsForResourceResponse>;
export interface StartAssessmentRunResponse {
  assessmentRunArn: string;
}
export const StartAssessmentRunResponse = S.suspend(() =>
  S.Struct({ assessmentRunArn: S.String }),
).annotations({
  identifier: "StartAssessmentRunResponse",
}) as any as S.Schema<StartAssessmentRunResponse>;
export type AssessmentRulesPackageArnList = string[];
export const AssessmentRulesPackageArnList = S.Array(S.String);
export type AssetType = "ec2-instance" | (string & {});
export const AssetType = S.String;
export type AssessmentRunInProgressArnList = string[];
export const AssessmentRunInProgressArnList = S.Array(S.String);
export interface AssessmentTarget {
  arn: string;
  name: string;
  resourceGroupArn?: string;
  createdAt: Date;
  updatedAt: Date;
}
export const AssessmentTarget = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    resourceGroupArn: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "AssessmentTarget",
}) as any as S.Schema<AssessmentTarget>;
export type AssessmentTargetList = AssessmentTarget[];
export const AssessmentTargetList = S.Array(AssessmentTarget);
export interface AssessmentTemplate {
  arn: string;
  name: string;
  assessmentTargetArn: string;
  durationInSeconds: number;
  rulesPackageArns: string[];
  userAttributesForFindings: Attribute[];
  lastAssessmentRunArn?: string;
  assessmentRunCount: number;
  createdAt: Date;
}
export const AssessmentTemplate = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    assessmentTargetArn: S.String,
    durationInSeconds: S.Number,
    rulesPackageArns: AssessmentTemplateRulesPackageArnList,
    userAttributesForFindings: UserAttributeList,
    lastAssessmentRunArn: S.optional(S.String),
    assessmentRunCount: S.Number,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "AssessmentTemplate",
}) as any as S.Schema<AssessmentTemplate>;
export type AssessmentTemplateList = AssessmentTemplate[];
export const AssessmentTemplateList = S.Array(AssessmentTemplate);
export interface ResourceGroup {
  arn: string;
  tags: ResourceGroupTag[];
  createdAt: Date;
}
export const ResourceGroup = S.suspend(() =>
  S.Struct({
    arn: S.String,
    tags: ResourceGroupTags,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ResourceGroup",
}) as any as S.Schema<ResourceGroup>;
export type ResourceGroupList = ResourceGroup[];
export const ResourceGroupList = S.Array(ResourceGroup);
export interface RulesPackage {
  arn: string;
  name: string;
  version: string;
  provider: string;
  description?: string;
}
export const RulesPackage = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    version: S.String,
    provider: S.String,
    description: S.optional(S.String),
  }),
).annotations({ identifier: "RulesPackage" }) as any as S.Schema<RulesPackage>;
export type RulesPackageList = RulesPackage[];
export const RulesPackageList = S.Array(RulesPackage);
export interface TelemetryMetadata {
  messageType: string;
  count: number;
  dataSize?: number;
}
export const TelemetryMetadata = S.suspend(() =>
  S.Struct({
    messageType: S.String,
    count: S.Number,
    dataSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "TelemetryMetadata",
}) as any as S.Schema<TelemetryMetadata>;
export type TelemetryMetadataList = TelemetryMetadata[];
export const TelemetryMetadataList = S.Array(TelemetryMetadata);
export interface AssessmentRunFilter {
  namePattern?: string;
  states?: AssessmentRunState[];
  durationRange?: DurationRange;
  rulesPackageArns?: string[];
  startTimeRange?: TimestampRange;
  completionTimeRange?: TimestampRange;
  stateChangeTimeRange?: TimestampRange;
}
export const AssessmentRunFilter = S.suspend(() =>
  S.Struct({
    namePattern: S.optional(S.String),
    states: S.optional(AssessmentRunStateList),
    durationRange: S.optional(DurationRange),
    rulesPackageArns: S.optional(FilterRulesPackageArnList),
    startTimeRange: S.optional(TimestampRange),
    completionTimeRange: S.optional(TimestampRange),
    stateChangeTimeRange: S.optional(TimestampRange),
  }),
).annotations({
  identifier: "AssessmentRunFilter",
}) as any as S.Schema<AssessmentRunFilter>;
export type InvalidInputErrorCode =
  | "INVALID_ASSESSMENT_TARGET_ARN"
  | "INVALID_ASSESSMENT_TEMPLATE_ARN"
  | "INVALID_ASSESSMENT_RUN_ARN"
  | "INVALID_FINDING_ARN"
  | "INVALID_RESOURCE_GROUP_ARN"
  | "INVALID_RULES_PACKAGE_ARN"
  | "INVALID_RESOURCE_ARN"
  | "INVALID_SNS_TOPIC_ARN"
  | "INVALID_IAM_ROLE_ARN"
  | "INVALID_ASSESSMENT_TARGET_NAME"
  | "INVALID_ASSESSMENT_TARGET_NAME_PATTERN"
  | "INVALID_ASSESSMENT_TEMPLATE_NAME"
  | "INVALID_ASSESSMENT_TEMPLATE_NAME_PATTERN"
  | "INVALID_ASSESSMENT_TEMPLATE_DURATION"
  | "INVALID_ASSESSMENT_TEMPLATE_DURATION_RANGE"
  | "INVALID_ASSESSMENT_RUN_DURATION_RANGE"
  | "INVALID_ASSESSMENT_RUN_START_TIME_RANGE"
  | "INVALID_ASSESSMENT_RUN_COMPLETION_TIME_RANGE"
  | "INVALID_ASSESSMENT_RUN_STATE_CHANGE_TIME_RANGE"
  | "INVALID_ASSESSMENT_RUN_STATE"
  | "INVALID_TAG"
  | "INVALID_TAG_KEY"
  | "INVALID_TAG_VALUE"
  | "INVALID_RESOURCE_GROUP_TAG_KEY"
  | "INVALID_RESOURCE_GROUP_TAG_VALUE"
  | "INVALID_ATTRIBUTE"
  | "INVALID_USER_ATTRIBUTE"
  | "INVALID_USER_ATTRIBUTE_KEY"
  | "INVALID_USER_ATTRIBUTE_VALUE"
  | "INVALID_PAGINATION_TOKEN"
  | "INVALID_MAX_RESULTS"
  | "INVALID_AGENT_ID"
  | "INVALID_AUTO_SCALING_GROUP"
  | "INVALID_RULE_NAME"
  | "INVALID_SEVERITY"
  | "INVALID_LOCALE"
  | "INVALID_EVENT"
  | "ASSESSMENT_TARGET_NAME_ALREADY_TAKEN"
  | "ASSESSMENT_TEMPLATE_NAME_ALREADY_TAKEN"
  | "INVALID_NUMBER_OF_ASSESSMENT_TARGET_ARNS"
  | "INVALID_NUMBER_OF_ASSESSMENT_TEMPLATE_ARNS"
  | "INVALID_NUMBER_OF_ASSESSMENT_RUN_ARNS"
  | "INVALID_NUMBER_OF_FINDING_ARNS"
  | "INVALID_NUMBER_OF_RESOURCE_GROUP_ARNS"
  | "INVALID_NUMBER_OF_RULES_PACKAGE_ARNS"
  | "INVALID_NUMBER_OF_ASSESSMENT_RUN_STATES"
  | "INVALID_NUMBER_OF_TAGS"
  | "INVALID_NUMBER_OF_RESOURCE_GROUP_TAGS"
  | "INVALID_NUMBER_OF_ATTRIBUTES"
  | "INVALID_NUMBER_OF_USER_ATTRIBUTES"
  | "INVALID_NUMBER_OF_AGENT_IDS"
  | "INVALID_NUMBER_OF_AUTO_SCALING_GROUPS"
  | "INVALID_NUMBER_OF_RULE_NAMES"
  | "INVALID_NUMBER_OF_SEVERITIES"
  | (string & {});
export const InvalidInputErrorCode = S.String;
export interface AgentPreview {
  hostname?: string;
  agentId: string;
  autoScalingGroup?: string;
  agentHealth?: AgentHealth;
  agentVersion?: string;
  operatingSystem?: string;
  kernelVersion?: string;
  ipv4Address?: string;
}
export const AgentPreview = S.suspend(() =>
  S.Struct({
    hostname: S.optional(S.String),
    agentId: S.String,
    autoScalingGroup: S.optional(S.String),
    agentHealth: S.optional(AgentHealth),
    agentVersion: S.optional(S.String),
    operatingSystem: S.optional(S.String),
    kernelVersion: S.optional(S.String),
    ipv4Address: S.optional(S.String),
  }),
).annotations({ identifier: "AgentPreview" }) as any as S.Schema<AgentPreview>;
export type AgentPreviewList = AgentPreview[];
export const AgentPreviewList = S.Array(AgentPreview);
export type InvalidCrossAccountRoleErrorCode =
  | "ROLE_DOES_NOT_EXIST_OR_INVALID_TRUST_RELATIONSHIP"
  | "ROLE_DOES_NOT_HAVE_CORRECT_POLICY"
  | (string & {});
export const InvalidCrossAccountRoleErrorCode = S.String;
export type AssessmentRunNotificationSnsStatusCode =
  | "SUCCESS"
  | "TOPIC_DOES_NOT_EXIST"
  | "ACCESS_DENIED"
  | "INTERNAL_ERROR"
  | (string & {});
export const AssessmentRunNotificationSnsStatusCode = S.String;
export type Ipv4AddressList = string[];
export const Ipv4AddressList = S.Array(S.String);
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export type ScopeType = "INSTANCE_ID" | "RULES_PACKAGE_ARN" | (string & {});
export const ScopeType = S.String;
export interface AddAttributesToFindingsResponse {
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const AddAttributesToFindingsResponse = S.suspend(() =>
  S.Struct({ failedItems: FailedItems }),
).annotations({
  identifier: "AddAttributesToFindingsResponse",
}) as any as S.Schema<AddAttributesToFindingsResponse>;
export interface CreateResourceGroupResponse {
  resourceGroupArn: string;
}
export const CreateResourceGroupResponse = S.suspend(() =>
  S.Struct({ resourceGroupArn: S.String }),
).annotations({
  identifier: "CreateResourceGroupResponse",
}) as any as S.Schema<CreateResourceGroupResponse>;
export interface DescribeAssessmentTargetsResponse {
  assessmentTargets: AssessmentTarget[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeAssessmentTargetsResponse = S.suspend(() =>
  S.Struct({
    assessmentTargets: AssessmentTargetList,
    failedItems: FailedItems,
  }),
).annotations({
  identifier: "DescribeAssessmentTargetsResponse",
}) as any as S.Schema<DescribeAssessmentTargetsResponse>;
export interface DescribeAssessmentTemplatesResponse {
  assessmentTemplates: AssessmentTemplate[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeAssessmentTemplatesResponse = S.suspend(() =>
  S.Struct({
    assessmentTemplates: AssessmentTemplateList,
    failedItems: FailedItems,
  }),
).annotations({
  identifier: "DescribeAssessmentTemplatesResponse",
}) as any as S.Schema<DescribeAssessmentTemplatesResponse>;
export interface DescribeResourceGroupsResponse {
  resourceGroups: ResourceGroup[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeResourceGroupsResponse = S.suspend(() =>
  S.Struct({ resourceGroups: ResourceGroupList, failedItems: FailedItems }),
).annotations({
  identifier: "DescribeResourceGroupsResponse",
}) as any as S.Schema<DescribeResourceGroupsResponse>;
export interface DescribeRulesPackagesResponse {
  rulesPackages: RulesPackage[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeRulesPackagesResponse = S.suspend(() =>
  S.Struct({ rulesPackages: RulesPackageList, failedItems: FailedItems }),
).annotations({
  identifier: "DescribeRulesPackagesResponse",
}) as any as S.Schema<DescribeRulesPackagesResponse>;
export interface GetTelemetryMetadataResponse {
  telemetryMetadata: TelemetryMetadata[];
}
export const GetTelemetryMetadataResponse = S.suspend(() =>
  S.Struct({ telemetryMetadata: TelemetryMetadataList }),
).annotations({
  identifier: "GetTelemetryMetadataResponse",
}) as any as S.Schema<GetTelemetryMetadataResponse>;
export interface ListAssessmentRunsRequest {
  assessmentTemplateArns?: string[];
  filter?: AssessmentRunFilter;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssessmentRunsRequest = S.suspend(() =>
  S.Struct({
    assessmentTemplateArns: S.optional(ListParentArnList),
    filter: S.optional(AssessmentRunFilter),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAssessmentRunsRequest",
}) as any as S.Schema<ListAssessmentRunsRequest>;
export interface ListAssessmentTargetsResponse {
  assessmentTargetArns: string[];
  nextToken?: string;
}
export const ListAssessmentTargetsResponse = S.suspend(() =>
  S.Struct({
    assessmentTargetArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentTargetsResponse",
}) as any as S.Schema<ListAssessmentTargetsResponse>;
export interface ListAssessmentTemplatesResponse {
  assessmentTemplateArns: string[];
  nextToken?: string;
}
export const ListAssessmentTemplatesResponse = S.suspend(() =>
  S.Struct({
    assessmentTemplateArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentTemplatesResponse",
}) as any as S.Schema<ListAssessmentTemplatesResponse>;
export interface ListFindingsResponse {
  findingArns: string[];
  nextToken?: string;
}
export const ListFindingsResponse = S.suspend(() =>
  S.Struct({
    findingArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFindingsResponse",
}) as any as S.Schema<ListFindingsResponse>;
export interface PreviewAgentsResponse {
  agentPreviews: AgentPreview[];
  nextToken?: string;
}
export const PreviewAgentsResponse = S.suspend(() =>
  S.Struct({
    agentPreviews: AgentPreviewList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "PreviewAgentsResponse",
}) as any as S.Schema<PreviewAgentsResponse>;
export interface AssessmentRunStateChange {
  stateChangedAt: Date;
  state: AssessmentRunState;
}
export const AssessmentRunStateChange = S.suspend(() =>
  S.Struct({
    stateChangedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    state: AssessmentRunState,
  }),
).annotations({
  identifier: "AssessmentRunStateChange",
}) as any as S.Schema<AssessmentRunStateChange>;
export type AssessmentRunStateChangeList = AssessmentRunStateChange[];
export const AssessmentRunStateChangeList = S.Array(AssessmentRunStateChange);
export interface AssessmentRunNotification {
  date: Date;
  event: InspectorEvent;
  message?: string;
  error: boolean;
  snsTopicArn?: string;
  snsPublishStatusCode?: AssessmentRunNotificationSnsStatusCode;
}
export const AssessmentRunNotification = S.suspend(() =>
  S.Struct({
    date: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    event: InspectorEvent,
    message: S.optional(S.String),
    error: S.Boolean,
    snsTopicArn: S.optional(S.String),
    snsPublishStatusCode: S.optional(AssessmentRunNotificationSnsStatusCode),
  }),
).annotations({
  identifier: "AssessmentRunNotification",
}) as any as S.Schema<AssessmentRunNotification>;
export type AssessmentRunNotificationList = AssessmentRunNotification[];
export const AssessmentRunNotificationList = S.Array(AssessmentRunNotification);
export type AssessmentRunFindingCounts = { [key in Severity]?: number };
export const AssessmentRunFindingCounts = S.partial(
  S.Record({ key: Severity, value: S.UndefinedOr(S.Number) }),
);
export interface Scope {
  key?: ScopeType;
  value?: string;
}
export const Scope = S.suspend(() =>
  S.Struct({ key: S.optional(ScopeType), value: S.optional(S.String) }),
).annotations({ identifier: "Scope" }) as any as S.Schema<Scope>;
export type ScopeList = Scope[];
export const ScopeList = S.Array(Scope);
export interface Exclusion {
  arn: string;
  title: string;
  description: string;
  recommendation: string;
  scopes: Scope[];
  attributes?: Attribute[];
}
export const Exclusion = S.suspend(() =>
  S.Struct({
    arn: S.String,
    title: S.String,
    description: S.String,
    recommendation: S.String,
    scopes: ScopeList,
    attributes: S.optional(AttributeList),
  }),
).annotations({ identifier: "Exclusion" }) as any as S.Schema<Exclusion>;
export interface InspectorServiceAttributes {
  schemaVersion: number;
  assessmentRunArn?: string;
  rulesPackageArn?: string;
}
export const InspectorServiceAttributes = S.suspend(() =>
  S.Struct({
    schemaVersion: S.Number,
    assessmentRunArn: S.optional(S.String),
    rulesPackageArn: S.optional(S.String),
  }),
).annotations({
  identifier: "InspectorServiceAttributes",
}) as any as S.Schema<InspectorServiceAttributes>;
export interface EventSubscription {
  event: InspectorEvent;
  subscribedAt: Date;
}
export const EventSubscription = S.suspend(() =>
  S.Struct({
    event: InspectorEvent,
    subscribedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "EventSubscription",
}) as any as S.Schema<EventSubscription>;
export type EventSubscriptionList = EventSubscription[];
export const EventSubscriptionList = S.Array(EventSubscription);
export type Ipv6Addresses = string[];
export const Ipv6Addresses = S.Array(S.String);
export interface AssessmentRun {
  arn: string;
  name: string;
  assessmentTemplateArn: string;
  state: AssessmentRunState;
  durationInSeconds: number;
  rulesPackageArns: string[];
  userAttributesForFindings: Attribute[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  stateChangedAt: Date;
  dataCollected: boolean;
  stateChanges: AssessmentRunStateChange[];
  notifications: AssessmentRunNotification[];
  findingCounts: { [key: string]: number | undefined };
}
export const AssessmentRun = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    assessmentTemplateArn: S.String,
    state: AssessmentRunState,
    durationInSeconds: S.Number,
    rulesPackageArns: AssessmentRulesPackageArnList,
    userAttributesForFindings: UserAttributeList,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stateChangedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    dataCollected: S.Boolean,
    stateChanges: AssessmentRunStateChangeList,
    notifications: AssessmentRunNotificationList,
    findingCounts: AssessmentRunFindingCounts,
  }),
).annotations({
  identifier: "AssessmentRun",
}) as any as S.Schema<AssessmentRun>;
export type AssessmentRunList = AssessmentRun[];
export const AssessmentRunList = S.Array(AssessmentRun);
export type ExclusionMap = { [key: string]: Exclusion | undefined };
export const ExclusionMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(Exclusion),
});
export interface ExclusionPreview {
  title: string;
  description: string;
  recommendation: string;
  scopes: Scope[];
  attributes?: Attribute[];
}
export const ExclusionPreview = S.suspend(() =>
  S.Struct({
    title: S.String,
    description: S.String,
    recommendation: S.String,
    scopes: ScopeList,
    attributes: S.optional(AttributeList),
  }),
).annotations({
  identifier: "ExclusionPreview",
}) as any as S.Schema<ExclusionPreview>;
export type ExclusionPreviewList = ExclusionPreview[];
export const ExclusionPreviewList = S.Array(ExclusionPreview);
export interface AssessmentRunAgent {
  agentId: string;
  assessmentRunArn: string;
  agentHealth: AgentHealth;
  agentHealthCode: AgentHealthCode;
  agentHealthDetails?: string;
  autoScalingGroup?: string;
  telemetryMetadata: TelemetryMetadata[];
}
export const AssessmentRunAgent = S.suspend(() =>
  S.Struct({
    agentId: S.String,
    assessmentRunArn: S.String,
    agentHealth: AgentHealth,
    agentHealthCode: AgentHealthCode,
    agentHealthDetails: S.optional(S.String),
    autoScalingGroup: S.optional(S.String),
    telemetryMetadata: TelemetryMetadataList,
  }),
).annotations({
  identifier: "AssessmentRunAgent",
}) as any as S.Schema<AssessmentRunAgent>;
export type AssessmentRunAgentList = AssessmentRunAgent[];
export const AssessmentRunAgentList = S.Array(AssessmentRunAgent);
export interface Subscription {
  resourceArn: string;
  topicArn: string;
  eventSubscriptions: EventSubscription[];
}
export const Subscription = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    topicArn: S.String,
    eventSubscriptions: EventSubscriptionList,
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type SubscriptionList = Subscription[];
export const SubscriptionList = S.Array(Subscription);
export type NoSuchEntityErrorCode =
  | "ASSESSMENT_TARGET_DOES_NOT_EXIST"
  | "ASSESSMENT_TEMPLATE_DOES_NOT_EXIST"
  | "ASSESSMENT_RUN_DOES_NOT_EXIST"
  | "FINDING_DOES_NOT_EXIST"
  | "RESOURCE_GROUP_DOES_NOT_EXIST"
  | "RULES_PACKAGE_DOES_NOT_EXIST"
  | "SNS_TOPIC_DOES_NOT_EXIST"
  | "IAM_ROLE_DOES_NOT_EXIST"
  | (string & {});
export const NoSuchEntityErrorCode = S.String;
export interface AgentAlreadyRunningAssessment {
  agentId: string;
  assessmentRunArn: string;
}
export const AgentAlreadyRunningAssessment = S.suspend(() =>
  S.Struct({ agentId: S.String, assessmentRunArn: S.String }),
).annotations({
  identifier: "AgentAlreadyRunningAssessment",
}) as any as S.Schema<AgentAlreadyRunningAssessment>;
export type AgentAlreadyRunningAssessmentList = AgentAlreadyRunningAssessment[];
export const AgentAlreadyRunningAssessmentList = S.Array(
  AgentAlreadyRunningAssessment,
);
export type LimitExceededErrorCode =
  | "ASSESSMENT_TARGET_LIMIT_EXCEEDED"
  | "ASSESSMENT_TEMPLATE_LIMIT_EXCEEDED"
  | "ASSESSMENT_RUN_LIMIT_EXCEEDED"
  | "RESOURCE_GROUP_LIMIT_EXCEEDED"
  | "EVENT_SUBSCRIPTION_LIMIT_EXCEEDED"
  | (string & {});
export const LimitExceededErrorCode = S.String;
export interface DescribeAssessmentRunsResponse {
  assessmentRuns: AssessmentRun[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeAssessmentRunsResponse = S.suspend(() =>
  S.Struct({ assessmentRuns: AssessmentRunList, failedItems: FailedItems }),
).annotations({
  identifier: "DescribeAssessmentRunsResponse",
}) as any as S.Schema<DescribeAssessmentRunsResponse>;
export interface DescribeExclusionsResponse {
  exclusions: { [key: string]: Exclusion | undefined };
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeExclusionsResponse = S.suspend(() =>
  S.Struct({ exclusions: ExclusionMap, failedItems: FailedItems }),
).annotations({
  identifier: "DescribeExclusionsResponse",
}) as any as S.Schema<DescribeExclusionsResponse>;
export interface GetExclusionsPreviewResponse {
  previewStatus: PreviewStatus;
  exclusionPreviews?: ExclusionPreview[];
  nextToken?: string;
}
export const GetExclusionsPreviewResponse = S.suspend(() =>
  S.Struct({
    previewStatus: PreviewStatus,
    exclusionPreviews: S.optional(ExclusionPreviewList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExclusionsPreviewResponse",
}) as any as S.Schema<GetExclusionsPreviewResponse>;
export interface ListAssessmentRunAgentsResponse {
  assessmentRunAgents: AssessmentRunAgent[];
  nextToken?: string;
}
export const ListAssessmentRunAgentsResponse = S.suspend(() =>
  S.Struct({
    assessmentRunAgents: AssessmentRunAgentList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentRunAgentsResponse",
}) as any as S.Schema<ListAssessmentRunAgentsResponse>;
export interface ListAssessmentRunsResponse {
  assessmentRunArns: string[];
  nextToken?: string;
}
export const ListAssessmentRunsResponse = S.suspend(() =>
  S.Struct({
    assessmentRunArns: ListReturnedArnList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssessmentRunsResponse",
}) as any as S.Schema<ListAssessmentRunsResponse>;
export interface ListEventSubscriptionsResponse {
  subscriptions: Subscription[];
  nextToken?: string;
}
export const ListEventSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    subscriptions: SubscriptionList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventSubscriptionsResponse",
}) as any as S.Schema<ListEventSubscriptionsResponse>;
export interface PrivateIp {
  privateDnsName?: string;
  privateIpAddress?: string;
}
export const PrivateIp = S.suspend(() =>
  S.Struct({
    privateDnsName: S.optional(S.String),
    privateIpAddress: S.optional(S.String),
  }),
).annotations({ identifier: "PrivateIp" }) as any as S.Schema<PrivateIp>;
export type PrivateIpAddresses = PrivateIp[];
export const PrivateIpAddresses = S.Array(PrivateIp);
export interface SecurityGroup {
  groupName?: string;
  groupId?: string;
}
export const SecurityGroup = S.suspend(() =>
  S.Struct({ groupName: S.optional(S.String), groupId: S.optional(S.String) }),
).annotations({
  identifier: "SecurityGroup",
}) as any as S.Schema<SecurityGroup>;
export type SecurityGroups = SecurityGroup[];
export const SecurityGroups = S.Array(SecurityGroup);
export interface NetworkInterface {
  networkInterfaceId?: string;
  subnetId?: string;
  vpcId?: string;
  privateDnsName?: string;
  privateIpAddress?: string;
  privateIpAddresses?: PrivateIp[];
  publicDnsName?: string;
  publicIp?: string;
  ipv6Addresses?: string[];
  securityGroups?: SecurityGroup[];
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    networkInterfaceId: S.optional(S.String),
    subnetId: S.optional(S.String),
    vpcId: S.optional(S.String),
    privateDnsName: S.optional(S.String),
    privateIpAddress: S.optional(S.String),
    privateIpAddresses: S.optional(PrivateIpAddresses),
    publicDnsName: S.optional(S.String),
    publicIp: S.optional(S.String),
    ipv6Addresses: S.optional(Ipv6Addresses),
    securityGroups: S.optional(SecurityGroups),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export interface AssetAttributes {
  schemaVersion: number;
  agentId?: string;
  autoScalingGroup?: string;
  amiId?: string;
  hostname?: string;
  ipv4Addresses?: string[];
  tags?: Tag[];
  networkInterfaces?: NetworkInterface[];
}
export const AssetAttributes = S.suspend(() =>
  S.Struct({
    schemaVersion: S.Number,
    agentId: S.optional(S.String),
    autoScalingGroup: S.optional(S.String),
    amiId: S.optional(S.String),
    hostname: S.optional(S.String),
    ipv4Addresses: S.optional(Ipv4AddressList),
    tags: S.optional(Tags),
    networkInterfaces: S.optional(NetworkInterfaces),
  }),
).annotations({
  identifier: "AssetAttributes",
}) as any as S.Schema<AssetAttributes>;
export interface Finding {
  arn: string;
  schemaVersion?: number;
  service?: string;
  serviceAttributes?: InspectorServiceAttributes;
  assetType?: AssetType;
  assetAttributes?: AssetAttributes;
  id?: string;
  title?: string;
  description?: string;
  recommendation?: string;
  severity?: Severity;
  numericSeverity?: number;
  confidence?: number;
  indicatorOfCompromise?: boolean;
  attributes: Attribute[];
  userAttributes: Attribute[];
  createdAt: Date;
  updatedAt: Date;
}
export const Finding = S.suspend(() =>
  S.Struct({
    arn: S.String,
    schemaVersion: S.optional(S.Number),
    service: S.optional(S.String),
    serviceAttributes: S.optional(InspectorServiceAttributes),
    assetType: S.optional(AssetType),
    assetAttributes: S.optional(AssetAttributes),
    id: S.optional(S.String),
    title: S.optional(S.String),
    description: S.optional(S.String),
    recommendation: S.optional(S.String),
    severity: S.optional(Severity),
    numericSeverity: S.optional(S.Number),
    confidence: S.optional(S.Number),
    indicatorOfCompromise: S.optional(S.Boolean),
    attributes: AttributeList,
    userAttributes: UserAttributeList,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Finding" }) as any as S.Schema<Finding>;
export type FindingList = Finding[];
export const FindingList = S.Array(Finding);
export interface DescribeFindingsResponse {
  findings: Finding[];
  failedItems: { [key: string]: FailedItemDetails | undefined };
}
export const DescribeFindingsResponse = S.suspend(() =>
  S.Struct({ findings: FindingList, failedItems: FailedItems }),
).annotations({
  identifier: "DescribeFindingsResponse",
}) as any as S.Schema<DescribeFindingsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String, errorCode: AccessDeniedErrorCode, canRetry: S.Boolean },
).pipe(C.withAuthError) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.String, canRetry: S.Boolean },
) {}
export class AssessmentRunInProgressException extends S.TaggedError<AssessmentRunInProgressException>()(
  "AssessmentRunInProgressException",
  {
    message: S.String,
    assessmentRunArns: AssessmentRunInProgressArnList,
    assessmentRunArnsTruncated: S.Boolean,
    canRetry: S.Boolean,
  },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.String, errorCode: InvalidInputErrorCode, canRetry: S.Boolean },
) {}
export class InvalidCrossAccountRoleException extends S.TaggedError<InvalidCrossAccountRoleException>()(
  "InvalidCrossAccountRoleException",
  {
    message: S.String,
    errorCode: InvalidCrossAccountRoleErrorCode,
    canRetry: S.Boolean,
  },
) {}
export class NoSuchEntityException extends S.TaggedError<NoSuchEntityException>()(
  "NoSuchEntityException",
  { message: S.String, errorCode: NoSuchEntityErrorCode, canRetry: S.Boolean },
) {}
export class AgentsAlreadyRunningAssessmentException extends S.TaggedError<AgentsAlreadyRunningAssessmentException>()(
  "AgentsAlreadyRunningAssessmentException",
  {
    message: S.String,
    agents: AgentAlreadyRunningAssessmentList,
    agentsTruncated: S.Boolean,
    canRetry: S.Boolean,
  },
) {}
export class ServiceTemporarilyUnavailableException extends S.TaggedError<ServiceTemporarilyUnavailableException>()(
  "ServiceTemporarilyUnavailableException",
  { message: S.String, canRetry: S.Boolean },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.String, errorCode: LimitExceededErrorCode, canRetry: S.Boolean },
) {}
export class UnsupportedFeatureException extends S.TaggedError<UnsupportedFeatureException>()(
  "UnsupportedFeatureException",
  { message: S.String, canRetry: S.Boolean },
) {}
export class PreviewGenerationInProgressException extends S.TaggedError<PreviewGenerationInProgressException>()(
  "PreviewGenerationInProgressException",
  { message: S.String },
) {}

//# Operations
/**
 * Describes the IAM role that enables Amazon Inspector to access your AWS
 * account.
 */
export const describeCrossAccountAccessRole: (
  input: DescribeCrossAccountAccessRoleRequest,
) => effect.Effect<
  DescribeCrossAccountAccessRoleResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCrossAccountAccessRoleRequest,
  output: DescribeCrossAccountAccessRoleResponse,
  errors: [InternalException],
}));
/**
 * Lists all available Amazon Inspector rules packages.
 */
export const listRulesPackages: {
  (
    input: ListRulesPackagesRequest,
  ): effect.Effect<
    ListRulesPackagesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRulesPackagesRequest,
  ) => stream.Stream<
    ListRulesPackagesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRulesPackagesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesPackagesRequest,
  output: ListRulesPackagesResponse,
  errors: [AccessDeniedException, InternalException, InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes the assessment targets that are specified by the ARNs of the assessment
 * targets.
 */
export const describeAssessmentTargets: (
  input: DescribeAssessmentTargetsRequest,
) => effect.Effect<
  DescribeAssessmentTargetsResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssessmentTargetsRequest,
  output: DescribeAssessmentTargetsResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * Describes the assessment templates that are specified by the ARNs of the assessment
 * templates.
 */
export const describeAssessmentTemplates: (
  input: DescribeAssessmentTemplatesRequest,
) => effect.Effect<
  DescribeAssessmentTemplatesResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssessmentTemplatesRequest,
  output: DescribeAssessmentTemplatesResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * Describes the resource groups that are specified by the ARNs of the resource
 * groups.
 */
export const describeResourceGroups: (
  input: DescribeResourceGroupsRequest,
) => effect.Effect<
  DescribeResourceGroupsResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceGroupsRequest,
  output: DescribeResourceGroupsResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * Describes the rules packages that are specified by the ARNs of the rules
 * packages.
 */
export const describeRulesPackages: (
  input: DescribeRulesPackagesRequest,
) => effect.Effect<
  DescribeRulesPackagesResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRulesPackagesRequest,
  output: DescribeRulesPackagesResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * Lists the ARNs of the assessment targets within this AWS account. For more
 * information about assessment targets, see Amazon Inspector Assessment
 * Targets.
 */
export const listAssessmentTargets: {
  (
    input: ListAssessmentTargetsRequest,
  ): effect.Effect<
    ListAssessmentTargetsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentTargetsRequest,
  ) => stream.Stream<
    ListAssessmentTargetsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentTargetsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentTargetsRequest,
  output: ListAssessmentTargetsResponse,
  errors: [AccessDeniedException, InternalException, InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes the assessment runs that are specified by the ARNs of the assessment
 * runs.
 */
export const describeAssessmentRuns: (
  input: DescribeAssessmentRunsRequest,
) => effect.Effect<
  DescribeAssessmentRunsResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssessmentRunsRequest,
  output: DescribeAssessmentRunsResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * Describes the exclusions that are specified by the exclusions' ARNs.
 */
export const describeExclusions: (
  input: DescribeExclusionsRequest,
) => effect.Effect<
  DescribeExclusionsResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExclusionsRequest,
  output: DescribeExclusionsResponse,
  errors: [InternalException, InvalidInputException],
}));
/**
 * List exclusions that are generated by the assessment run.
 */
export const listExclusions: {
  (
    input: ListExclusionsRequest,
  ): effect.Effect<
    ListExclusionsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExclusionsRequest,
  ) => stream.Stream<
    ListExclusionsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExclusionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExclusionsRequest,
  output: ListExclusionsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Registers the IAM role that grants Amazon Inspector access to AWS Services needed to
 * perform security assessments.
 */
export const registerCrossAccountAccessRole: (
  input: RegisterCrossAccountAccessRoleRequest,
) => effect.Effect<
  RegisterCrossAccountAccessRoleResponse,
  | AccessDeniedException
  | InternalException
  | InvalidCrossAccountRoleException
  | InvalidInputException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCrossAccountAccessRoleRequest,
  output: RegisterCrossAccountAccessRoleResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidCrossAccountRoleException,
    InvalidInputException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Enables the process of sending Amazon Simple Notification Service (SNS) notifications
 * about a specified event to a specified SNS topic.
 */
export const subscribeToEvent: (
  input: SubscribeToEventRequest,
) => effect.Effect<
  SubscribeToEventResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeToEventRequest,
  output: SubscribeToEventResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Lists findings that are generated by the assessment runs that are specified by the
 * ARNs of the assessment runs.
 */
export const listFindings: {
  (
    input: ListFindingsRequest,
  ): effect.Effect<
    ListFindingsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    ListFindingsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFindingsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes the assessment target that is specified by the ARN of the assessment
 * target.
 */
export const deleteAssessmentTarget: (
  input: DeleteAssessmentTargetRequest,
) => effect.Effect<
  DeleteAssessmentTargetResponse,
  | AccessDeniedException
  | AssessmentRunInProgressException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentTargetRequest,
  output: DeleteAssessmentTargetResponse,
  errors: [
    AccessDeniedException,
    AssessmentRunInProgressException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Deletes the assessment template that is specified by the ARN of the assessment
 * template.
 */
export const deleteAssessmentTemplate: (
  input: DeleteAssessmentTemplateRequest,
) => effect.Effect<
  DeleteAssessmentTemplateResponse,
  | AccessDeniedException
  | AssessmentRunInProgressException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentTemplateRequest,
  output: DeleteAssessmentTemplateResponse,
  errors: [
    AccessDeniedException,
    AssessmentRunInProgressException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Lists all tags associated with an assessment template.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
}));
/**
 * Removes entire attributes (key and value pairs) from the findings that are specified
 * by the ARNs of the findings where an attribute with the specified key exists.
 */
export const removeAttributesFromFindings: (
  input: RemoveAttributesFromFindingsRequest,
) => effect.Effect<
  RemoveAttributesFromFindingsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAttributesFromFindingsRequest,
  output: RemoveAttributesFromFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Sets tags (key and value pairs) to the assessment template that is specified by the
 * ARN of the assessment template.
 */
export const setTagsForResource: (
  input: SetTagsForResourceRequest,
) => effect.Effect<
  SetTagsForResourceResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTagsForResourceRequest,
  output: SetTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Stops the assessment run that is specified by the ARN of the assessment
 * run.
 */
export const stopAssessmentRun: (
  input: StopAssessmentRunRequest,
) => effect.Effect<
  StopAssessmentRunResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAssessmentRunRequest,
  output: StopAssessmentRunResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Disables the process of sending Amazon Simple Notification Service (SNS)
 * notifications about a specified event to a specified SNS topic.
 */
export const unsubscribeFromEvent: (
  input: UnsubscribeFromEventRequest,
) => effect.Effect<
  UnsubscribeFromEventResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnsubscribeFromEventRequest,
  output: UnsubscribeFromEventResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Updates the assessment target that is specified by the ARN of the assessment
 * target.
 *
 * If resourceGroupArn is not specified, all EC2 instances in the current AWS account
 * and region are included in the assessment target.
 */
export const updateAssessmentTarget: (
  input: UpdateAssessmentTargetRequest,
) => effect.Effect<
  UpdateAssessmentTargetResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssessmentTargetRequest,
  output: UpdateAssessmentTargetResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Assigns attributes (key and value pairs) to the findings that are specified by the
 * ARNs of the findings.
 */
export const addAttributesToFindings: (
  input: AddAttributesToFindingsRequest,
) => effect.Effect<
  AddAttributesToFindingsResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddAttributesToFindingsRequest,
  output: AddAttributesToFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Deletes the assessment run that is specified by the ARN of the assessment
 * run.
 */
export const deleteAssessmentRun: (
  input: DeleteAssessmentRunRequest,
) => effect.Effect<
  DeleteAssessmentRunResponse,
  | AccessDeniedException
  | AssessmentRunInProgressException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssessmentRunRequest,
  output: DeleteAssessmentRunResponse,
  errors: [
    AccessDeniedException,
    AssessmentRunInProgressException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Information about the data that is collected for the specified assessment
 * run.
 */
export const getTelemetryMetadata: (
  input: GetTelemetryMetadataRequest,
) => effect.Effect<
  GetTelemetryMetadataResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTelemetryMetadataRequest,
  output: GetTelemetryMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
}));
/**
 * Lists the assessment templates that correspond to the assessment targets that are
 * specified by the ARNs of the assessment targets.
 */
export const listAssessmentTemplates: {
  (
    input: ListAssessmentTemplatesRequest,
  ): effect.Effect<
    ListAssessmentTemplatesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentTemplatesRequest,
  ) => stream.Stream<
    ListAssessmentTemplatesResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentTemplatesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentTemplatesRequest,
  output: ListAssessmentTemplatesResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Previews the agents installed on the EC2 instances that are part of the specified
 * assessment target.
 */
export const previewAgents: {
  (
    input: PreviewAgentsRequest,
  ): effect.Effect<
    PreviewAgentsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidCrossAccountRoleException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: PreviewAgentsRequest,
  ) => stream.Stream<
    PreviewAgentsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidCrossAccountRoleException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: PreviewAgentsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidCrossAccountRoleException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: PreviewAgentsRequest,
  output: PreviewAgentsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidCrossAccountRoleException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the exclusions preview (a list of ExclusionPreview objects) specified by
 * the preview token. You can obtain the preview token by running the CreateExclusionsPreview
 * API.
 */
export const getExclusionsPreview: {
  (
    input: GetExclusionsPreviewRequest,
  ): effect.Effect<
    GetExclusionsPreviewResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetExclusionsPreviewRequest,
  ) => stream.Stream<
    GetExclusionsPreviewResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetExclusionsPreviewRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetExclusionsPreviewRequest,
  output: GetExclusionsPreviewResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the agents of the assessment runs that are specified by the ARNs of the
 * assessment runs.
 */
export const listAssessmentRunAgents: {
  (
    input: ListAssessmentRunAgentsRequest,
  ): effect.Effect<
    ListAssessmentRunAgentsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentRunAgentsRequest,
  ) => stream.Stream<
    ListAssessmentRunAgentsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentRunAgentsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentRunAgentsRequest,
  output: ListAssessmentRunAgentsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the assessment runs that correspond to the assessment templates that are
 * specified by the ARNs of the assessment templates.
 */
export const listAssessmentRuns: {
  (
    input: ListAssessmentRunsRequest,
  ): effect.Effect<
    ListAssessmentRunsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssessmentRunsRequest,
  ) => stream.Stream<
    ListAssessmentRunsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssessmentRunsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssessmentRunsRequest,
  output: ListAssessmentRunsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all the event subscriptions for the assessment template that is specified by
 * the ARN of the assessment template. For more information, see SubscribeToEvent and UnsubscribeFromEvent.
 */
export const listEventSubscriptions: {
  (
    input: ListEventSubscriptionsRequest,
  ): effect.Effect<
    ListEventSubscriptionsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventSubscriptionsRequest,
  ) => stream.Stream<
    ListEventSubscriptionsResponse,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventSubscriptionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalException
    | InvalidInputException
    | NoSuchEntityException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventSubscriptionsRequest,
  output: ListEventSubscriptionsResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an assessment template for the assessment target that is specified by the ARN
 * of the assessment target. If the service-linked role isn’t already registered, this action also creates and
 * registers a service-linked role to grant Amazon Inspector access to AWS Services needed to
 * perform security assessments.
 */
export const createAssessmentTemplate: (
  input: CreateAssessmentTemplateRequest,
) => effect.Effect<
  CreateAssessmentTemplateResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentTemplateRequest,
  output: CreateAssessmentTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Creates a resource group using the specified set of tags (key and value pairs) that
 * are used to select the EC2 instances to be included in an Amazon Inspector assessment
 * target. The created resource group is then used to create an Amazon Inspector assessment
 * target. For more information, see CreateAssessmentTarget.
 */
export const createResourceGroup: (
  input: CreateResourceGroupRequest,
) => effect.Effect<
  CreateResourceGroupResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | LimitExceededException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceGroupRequest,
  output: CreateResourceGroupResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    LimitExceededException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Creates a new assessment target using the ARN of the resource group that is generated
 * by CreateResourceGroup. If resourceGroupArn is not specified, all EC2
 * instances in the current AWS account and region are included in the assessment target. If
 * the service-linked role isn’t already registered, this action also creates and
 * registers a service-linked role to grant Amazon Inspector access to AWS Services needed to
 * perform security assessments. You can create up to 50 assessment targets per AWS account.
 * You can run up to 500 concurrent agents per AWS account. For more information, see
 * Amazon Inspector Assessment Targets.
 */
export const createAssessmentTarget: (
  input: CreateAssessmentTargetRequest,
) => effect.Effect<
  CreateAssessmentTargetResponse,
  | AccessDeniedException
  | InternalException
  | InvalidCrossAccountRoleException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssessmentTargetRequest,
  output: CreateAssessmentTargetResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidCrossAccountRoleException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Starts the assessment run specified by the ARN of the assessment template. For this
 * API to function properly, you must not exceed the limit of running up to 500 concurrent
 * agents per AWS account.
 */
export const startAssessmentRun: (
  input: StartAssessmentRunRequest,
) => effect.Effect<
  StartAssessmentRunResponse,
  | AccessDeniedException
  | AgentsAlreadyRunningAssessmentException
  | InternalException
  | InvalidCrossAccountRoleException
  | InvalidInputException
  | LimitExceededException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAssessmentRunRequest,
  output: StartAssessmentRunResponse,
  errors: [
    AccessDeniedException,
    AgentsAlreadyRunningAssessmentException,
    InternalException,
    InvalidCrossAccountRoleException,
    InvalidInputException,
    LimitExceededException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Produces an assessment report that includes detailed and comprehensive results of a
 * specified assessment run.
 */
export const getAssessmentReport: (
  input: GetAssessmentReportRequest,
) => effect.Effect<
  GetAssessmentReportResponse,
  | AccessDeniedException
  | AssessmentRunInProgressException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | ServiceTemporarilyUnavailableException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentReportRequest,
  output: GetAssessmentReportResponse,
  errors: [
    AccessDeniedException,
    AssessmentRunInProgressException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    ServiceTemporarilyUnavailableException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Starts the generation of an exclusions preview for the specified assessment template.
 * The exclusions preview lists the potential exclusions (ExclusionPreview) that Inspector can
 * detect before it runs the assessment.
 */
export const createExclusionsPreview: (
  input: CreateExclusionsPreviewRequest,
) => effect.Effect<
  CreateExclusionsPreviewResponse,
  | AccessDeniedException
  | InternalException
  | InvalidInputException
  | NoSuchEntityException
  | PreviewGenerationInProgressException
  | ServiceTemporarilyUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExclusionsPreviewRequest,
  output: CreateExclusionsPreviewResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidInputException,
    NoSuchEntityException,
    PreviewGenerationInProgressException,
    ServiceTemporarilyUnavailableException,
  ],
}));
/**
 * Describes the findings that are specified by the ARNs of the findings.
 */
export const describeFindings: (
  input: DescribeFindingsRequest,
) => effect.Effect<
  DescribeFindingsResponse,
  InternalException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFindingsRequest,
  output: DescribeFindingsResponse,
  errors: [InternalException, InvalidInputException],
}));
