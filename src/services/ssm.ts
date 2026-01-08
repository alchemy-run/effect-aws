import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://ssm.amazonaws.com/doc/2014-11-06/");
const svc = T.AwsApiService({ sdkId: "SSM", serviceShapeName: "AmazonSSM" });
const auth = T.AwsAuthSigv4({ name: "ssm" });
const ver = T.ServiceVersion("2014-11-06");
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
              `https://ssm-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://ssm.${Region}.amazonaws.com`);
            }
            return e(
              `https://ssm-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ssm.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ssm.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceId = string;
export type OpsItemId = string;
export type OpsItemRelatedItemAssociationType = string;
export type OpsItemRelatedItemAssociationResourceType = string;
export type OpsItemRelatedItemAssociationResourceUri = string;
export type CommandId = string;
export type InstanceId = string;
export type MaintenanceWindowExecutionId = string;
export type ActivationDescription = string;
export type DefaultInstanceName = string;
export type IamRole = string;
export type RegistrationLimit = number;
export type DocumentARN = string;
export type DocumentVersion = string;
export type ScheduleExpression = string;
export type AssociationName = string;
export type AutomationTargetParameterName = string;
export type MaxErrors = string;
export type MaxConcurrency = string;
export type CalendarNameOrARN = string;
export type ScheduleOffset = number;
export type Duration = number;
export type DocumentContent = string;
export type DocumentName = string;
export type DocumentDisplayName = string;
export type DocumentVersionName = string;
export type TargetType = string;
export type MaintenanceWindowName = string;
export type MaintenanceWindowDescription = string | Redacted.Redacted<string>;
export type MaintenanceWindowStringDateTime = string;
export type MaintenanceWindowSchedule = string;
export type MaintenanceWindowTimezone = string;
export type MaintenanceWindowOffset = number;
export type MaintenanceWindowDurationHours = number;
export type MaintenanceWindowCutoff = number;
export type ClientToken = string;
export type OpsItemDescription = string;
export type OpsItemType = string;
export type OpsItemPriority = number;
export type OpsItemSource = string;
export type OpsItemTitle = string;
export type OpsItemCategory = string;
export type OpsItemSeverity = string;
export type OpsItemAccountId = string;
export type OpsMetadataResourceId = string;
export type BaselineName = string;
export type PatchId = string;
export type BaselineDescription = string;
export type ResourceDataSyncName = string;
export type ResourceDataSyncType = string;
export type ActivationId = string;
export type AssociationId = string;
export type InventoryItemTypeName = string;
export type UUID = string;
export type MaintenanceWindowId = string;
export type OpsMetadataArn = string;
export type PSParameterName = string;
export type BaselineId = string;
export type ResourceArnString = string;
export type PolicyId = string;
export type PolicyHash = string;
export type ManagedInstanceId = string;
export type PatchGroup = string;
export type MaintenanceWindowTargetId = string;
export type MaintenanceWindowTaskId = string;
export type MaxResults = number;
export type NextToken = string;
export type AssociationVersion = string;
export type AssociationExecutionId = string;
export type AutomationExecutionId = string;
export type PatchBaselineMaxResults = number;
export type DocumentPermissionMaxResults = number;
export type EffectiveInstanceAssociationMaxResults = number;
export type MaxResultsEC2Compatible = number;
export type PatchComplianceMaxResults = number;
export type DescribeInstancePropertiesMaxResults = number;
export type MaintenanceWindowMaxResults = number;
export type MaintenanceWindowExecutionTaskId = string;
export type MaintenanceWindowSearchMaxResults = number;
export type OpsItemMaxResults = number;
export type SessionMaxResults = number;
export type OpsItemRelatedItemAssociationId = string;
export type AccessRequestId = string;
export type ISO8601String = string;
export type CommandPluginName = string;
export type SessionTarget = string;
export type SnapshotId = string;
export type ExecutionPreviewId = string;
export type InventoryItemTypeNameFilter = string;
export type GetInventorySchemaMaxResults = number;
export type MaintenanceWindowExecutionTaskInvocationId = string;
export type OpsItemArn = string;
export type GetOpsMetadataMaxResults = number;
export type GetParametersByPathMaxResults = number;
export type ResourcePolicyMaxResults = number;
export type ServiceSettingId = string;
export type PSParameterVersion = number;
export type ParameterLabel = string;
export type CommandMaxResults = number;
export type ComplianceResourceId = string;
export type ComplianceResourceType = string;
export type OpsItemEventMaxResults = number;
export type OpsItemRelatedItemsMaxResults = number;
export type ListOpsMetadataMaxResults = number;
export type AccountId = string;
export type SharedDocumentVersion = string;
export type ComplianceTypeName = string;
export type ComplianceItemContentHash = string;
export type ParameterDescription = string;
export type PSParameterValue = string | Redacted.Redacted<string>;
export type ParameterKeyId = string;
export type AllowedPattern = string;
export type ParameterPolicies = string;
export type ParameterDataType = string;
export type Policy = string;
export type OwnerInformation = string | Redacted.Redacted<string>;
export type MaintenanceWindowTaskArn = string;
export type ServiceRole = string;
export type MaintenanceWindowTaskPriority = number;
export type TagKey = string;
export type SessionId = string;
export type DocumentHash = string;
export type TimeoutSeconds = number;
export type Comment = string;
export type S3Region = string;
export type S3BucketName = string;
export type S3KeyPrefix = string;
export type String1to256 = string;
export type IdempotencyToken = string;
export type AutomationParameterKey = string;
export type TargetLocationsURL = string;
export type ChangeRequestName = string;
export type ChangeDetailsValue = string;
export type SessionReason = string;
export type DocumentVersionNumber = string;
export type MetadataKey = string;
export type ServiceSettingValue = string;
export type TagValue = string;
export type RegistrationMetadataKey = string;
export type RegistrationMetadataValue = string;
export type ParameterName = string;
export type ParameterValue = string;
export type TargetKey = string;
export type TargetValue = string;
export type Account = string;
export type Region = string;
export type ExecutionRoleName = string;
export type ExcludeAccount = string;
export type TargetMapKey = string;
export type TargetMapValue = string;
export type RequireType = string;
export type AttachmentsSourceValue = string;
export type AttachmentIdentifier = string;
export type OpsItemDataKey = string;
export type PatchSourceName = string;
export type PatchSourceProduct = string;
export type PatchSourceConfiguration = string | Redacted.Redacted<string>;
export type ResourceDataSyncS3BucketName = string;
export type ResourceDataSyncS3Prefix = string;
export type ResourceDataSyncS3Region = string;
export type ResourceDataSyncAWSKMSKeyARN = string;
export type ResourceDataSyncSourceType = string;
export type ResourceDataSyncSourceRegion = string;
export type AssociationExecutionFilterValue = string;
export type AssociationExecutionTargetsFilterValue = string;
export type AutomationExecutionFilterValue = string;
export type StepExecutionFilterValue = string;
export type PatchOrchestratorFilterKey = string;
export type PatchOrchestratorFilterValue = string;
export type InstanceInformationFilterValue = string;
export type InstanceInformationStringFilterKey = string;
export type InstancePatchStateFilterKey = string;
export type InstancePatchStateFilterValue = string;
export type InstancePropertyFilterValue = string;
export type InstancePropertyStringFilterKey = string;
export type MaintenanceWindowFilterKey = string;
export type MaintenanceWindowFilterValue = string;
export type OpsItemFilterValue = string;
export type ParametersFilterValue = string;
export type ParameterStringFilterKey = string;
export type ParameterStringQueryOption = string;
export type ParameterStringFilterValue = string;
export type SessionFilterValue = string;
export type InventoryFilterKey = string;
export type InventoryFilterValue = string;
export type InventoryAggregatorExpression = string;
export type OpsFilterKey = string;
export type OpsFilterValue = string;
export type OpsAggregatorType = string;
export type OpsDataTypeName = string;
export type OpsDataAttributeName = string;
export type AssociationFilterValue = string;
export type CommandFilterValue = string;
export type ComplianceStringFilterKey = string;
export type ComplianceFilterValue = string;
export type DocumentFilterValue = string;
export type DocumentKeyValuesFilterKey = string;
export type DocumentKeyValuesFilterValue = string;
export type NodeFilterValue = string;
export type OpsItemEventFilterValue = string;
export type OpsItemRelatedItemsFilterValue = string;
export type OpsMetadataFilterKey = string;
export type OpsMetadataFilterValue = string;
export type ComplianceExecutionId = string;
export type ComplianceExecutionType = string;
export type ComplianceItemId = string;
export type ComplianceItemTitle = string;
export type InventoryItemSchemaVersion = string;
export type InventoryItemCaptureTime = string;
export type InventoryItemContentHash = string;
export type MaintenanceWindowTaskParameterName = string;
export type AutomationParameterValue = string;
export type NotificationArn = string;
export type CloudWatchLogGroupName = string;
export type SessionManagerParameterName = string;
export type SessionManagerParameterValue = string;
export type StatusMessage = string;
export type StatusAdditionalInfo = string;
export type Integer = number;
export type InstancesCount = number;
export type ResponseCode = number;
export type StringDateTime = string;
export type StatusDetails = string;
export type StandardOutputContent = string;
export type Url = string;
export type StandardErrorContent = string;
export type DocumentStatusInformation = string;
export type MaintenanceWindowExecutionStatusDetails = string;
export type MaintenanceWindowExecutionTaskExecutionId = string;
export type MaintenanceWindowExecutionTaskInvocationParameters =
  | string
  | Redacted.Redacted<string>;
export type MaintenanceWindowTaskTargetId = string;
export type DocumentAuthor = string;
export type TokenValue = string;
export type StreamUrl = string;
export type AlarmName = string;
export type OpsItemDataValueString = string;
export type MetadataValueString = string;
export type PatchFilterValue = string;
export type ApproveAfterDays = number;
export type PatchStringDateTime = string;
export type ResourceDataSyncDestinationDataSharingType = string;
export type ResourceDataSyncOrganizationSourceType = string;
export type InventoryGroupName = string;
export type OpsAggregatorValueKey = string;
export type OpsAggregatorValue = string;
export type AttributeName = string;
export type AttributeValue = string;
export type MaintenanceWindowTaskParameterValue =
  | string
  | Redacted.Redacted<string>;
export type MaintenanceWindowStepFunctionsInput =
  | string
  | Redacted.Redacted<string>;
export type MaintenanceWindowStepFunctionsName = string;
export type MaintenanceWindowLambdaClientContext = string;
export type MaintenanceWindowLambdaQualifier = string;
export type DocumentReviewComment = string;
export type TotalCount = number;
export type RemainingCount = number;
export type DocumentSha1 = string;
export type DocumentOwner = string;
export type DescriptionInDocument = string;
export type DocumentSchemaVersion = string;
export type Category = string;
export type StatusName = string;
export type InstanceAssociationExecutionSummary = string;
export type AgentErrorCode = string;
export type PatchTitle = string;
export type PatchKbNumber = string;
export type PatchClassification = string;
export type PatchSeverity = string;
export type PatchCVEIds = string;
export type InstallOverrideList = string;
export type PatchInstalledCount = number;
export type PatchInstalledOtherCount = number;
export type PatchInstalledPendingRebootCount = number;
export type PatchInstalledRejectedCount = number;
export type PatchMissingCount = number;
export type PatchFailedCount = number;
export type PatchUnreportedNotApplicableCount = number;
export type PatchNotApplicableCount = number;
export type PatchAvailableSecurityUpdateCount = number;
export type PatchCriticalNonCompliantCount = number;
export type PatchSecurityNonCompliantCount = number;
export type PatchOtherNonCompliantCount = number;
export type InventoryDeletionLastStatusMessage = string;
export type AccessKeyIdType = string;
export type AccessKeySecretType = string | Redacted.Redacted<string>;
export type SessionTokenType = string | Redacted.Redacted<string>;
export type AttachmentName = string;
export type ContentLength = number;
export type AttachmentHash = string;
export type AttachmentUrl = string;
export type InventoryTypeDisplayName = string;
export type PSParameterSelector = string;
export type TargetCount = number;
export type CompletedCount = number;
export type ErrorCount = number;
export type DeliveryTimedOutCount = number;
export type LastResourceDataSyncMessage = string;
export type ResourceDataSyncOrganizationalUnitId = string;
export type ActivationCode = string;
export type SnapshotDownloadUrl = string;
export type Product = string;
export type ResourceCount = number;
export type DocumentParameterName = string;
export type DocumentParameterDescrption = string;
export type DocumentParameterDefaultValue = string;
export type Reviewer = string;
export type PatchDescription = string;
export type PatchContentUrl = string;
export type PatchVendor = string;
export type PatchProductFamily = string;
export type PatchProduct = string;
export type PatchMsrcSeverity = string;
export type PatchMsrcNumber = string;
export type PatchLanguage = string;
export type PatchAdvisoryId = string;
export type PatchBugzillaId = string;
export type PatchCVEId = string;
export type PatchName = string;
export type PatchEpoch = number;
export type PatchVersion = string;
export type PatchRelease = string;
export type PatchArch = string;
export type PatchRepository = string;
export type AutomationActionName = string;
export type Long = number;
export type ValidNextStep = string;
export type InventoryItemAttributeName = string;
export type ComplianceSummaryCount = number;
export type ResourceDataSyncState = string;
export type BatchErrorMessage = string;
export type RegistrationsCount = number;
export type ResourceCountByStatus = string;
export type AssociationResourceId = string;
export type AssociationResourceType = string;
export type Version = string;
export type IPAddress = string | Redacted.Redacted<string>;
export type ComputerName = string;
export type SourceId = string;
export type InstanceName = string;
export type InstanceType = string;
export type InstanceRole = string;
export type KeyName = string;
export type InstanceState = string;
export type Architecture = string;
export type PlatformName = string;
export type PlatformVersion = string;
export type SessionOwner = string;
export type SessionDetails = string;
export type MaxSessionDuration = string;
export type InstanceTagName = string;
export type InvocationTraceOutput = string;
export type NodeId = string;
export type NodeRegion = string;
export type InstanceCount = number;
export type PutInventoryMessage = string;
export type OutputSourceId = string;
export type OutputSourceType = string;
export type SessionManagerS3OutputUrl = string;
export type SessionManagerCloudWatchOutputUrl = string;
export type CommandPluginOutput = string;
export type NodeAccountId = string;
export type NodeOrganizationalUnitId = string;
export type NodeOrganizationalUnitPath = string;
export type InventoryResultEntityId = string;
export type OpsEntityId = string;
export type AgentType = string;
export type AgentVersion = string;
export type InstanceStatus = string;
export type InventoryResultItemKey = string;
export type OpsEntityItemKey = string;
export type OpsEntityItemCaptureTime = string;

//# Schemas
export type InstanceIdList = string[];
export const InstanceIdList = S.Array(S.String);
export type CalendarNameOrARNList = string[];
export const CalendarNameOrARNList = S.Array(S.String);
export type PatchIdList = string[];
export const PatchIdList = S.Array(S.String);
export type ParameterNameList = string[];
export const ParameterNameList = S.Array(S.String);
export type ParameterLabelList = string[];
export const ParameterLabelList = S.Array(S.String);
export type ComplianceResourceIdList = string[];
export const ComplianceResourceIdList = S.Array(S.String);
export type ComplianceResourceTypeList = string[];
export const ComplianceResourceTypeList = S.Array(S.String);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String.pipe(T.XmlName("AccountId")));
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export type AssociationIdList = string[];
export const AssociationIdList = S.Array(S.String);
export type OpsItemOpsDataKeysList = string[];
export const OpsItemOpsDataKeysList = S.Array(S.String);
export type MetadataKeysToDeleteList = string[];
export const MetadataKeysToDeleteList = S.Array(S.String);
export interface AssociateOpsItemRelatedItemRequest {
  OpsItemId: string;
  AssociationType: string;
  ResourceType: string;
  ResourceUri: string;
}
export const AssociateOpsItemRelatedItemRequest = S.suspend(() =>
  S.Struct({
    OpsItemId: S.String,
    AssociationType: S.String,
    ResourceType: S.String,
    ResourceUri: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateOpsItemRelatedItemRequest",
}) as any as S.Schema<AssociateOpsItemRelatedItemRequest>;
export interface CancelCommandRequest {
  CommandId: string;
  InstanceIds?: InstanceIdList;
}
export const CancelCommandRequest = S.suspend(() =>
  S.Struct({
    CommandId: S.String,
    InstanceIds: S.optional(InstanceIdList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelCommandRequest",
}) as any as S.Schema<CancelCommandRequest>;
export interface CancelCommandResult {}
export const CancelCommandResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelCommandResult",
}) as any as S.Schema<CancelCommandResult>;
export interface CancelMaintenanceWindowExecutionRequest {
  WindowExecutionId: string;
}
export const CancelMaintenanceWindowExecutionRequest = S.suspend(() =>
  S.Struct({ WindowExecutionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelMaintenanceWindowExecutionRequest",
}) as any as S.Schema<CancelMaintenanceWindowExecutionRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateMaintenanceWindowRequest {
  Name: string;
  Description?: string | Redacted.Redacted<string>;
  StartDate?: string;
  EndDate?: string;
  Schedule: string;
  ScheduleTimezone?: string;
  ScheduleOffset?: number;
  Duration: number;
  Cutoff: number;
  AllowUnassociatedTargets: boolean;
  ClientToken?: string;
  Tags?: TagList;
}
export const CreateMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(SensitiveString),
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Schedule: S.String,
    ScheduleTimezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.Number,
    Cutoff: S.Number,
    AllowUnassociatedTargets: S.Boolean,
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMaintenanceWindowRequest",
}) as any as S.Schema<CreateMaintenanceWindowRequest>;
export interface DeleteActivationRequest {
  ActivationId: string;
}
export const DeleteActivationRequest = S.suspend(() =>
  S.Struct({ ActivationId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteActivationRequest",
}) as any as S.Schema<DeleteActivationRequest>;
export interface DeleteActivationResult {}
export const DeleteActivationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteActivationResult",
}) as any as S.Schema<DeleteActivationResult>;
export interface DeleteAssociationRequest {
  Name?: string;
  InstanceId?: string;
  AssociationId?: string;
}
export const DeleteAssociationRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceId: S.optional(S.String),
    AssociationId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAssociationRequest",
}) as any as S.Schema<DeleteAssociationRequest>;
export interface DeleteAssociationResult {}
export const DeleteAssociationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAssociationResult",
}) as any as S.Schema<DeleteAssociationResult>;
export interface DeleteDocumentRequest {
  Name: string;
  DocumentVersion?: string;
  VersionName?: string;
  Force?: boolean;
}
export const DeleteDocumentRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentVersion: S.optional(S.String),
    VersionName: S.optional(S.String),
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDocumentRequest",
}) as any as S.Schema<DeleteDocumentRequest>;
export interface DeleteDocumentResult {}
export const DeleteDocumentResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDocumentResult",
}) as any as S.Schema<DeleteDocumentResult>;
export interface DeleteInventoryRequest {
  TypeName: string;
  SchemaDeleteOption?: string;
  DryRun?: boolean;
  ClientToken?: string;
}
export const DeleteInventoryRequest = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    SchemaDeleteOption: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInventoryRequest",
}) as any as S.Schema<DeleteInventoryRequest>;
export interface DeleteMaintenanceWindowRequest {
  WindowId: string;
}
export const DeleteMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({ WindowId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMaintenanceWindowRequest",
}) as any as S.Schema<DeleteMaintenanceWindowRequest>;
export interface DeleteOpsItemRequest {
  OpsItemId: string;
}
export const DeleteOpsItemRequest = S.suspend(() =>
  S.Struct({ OpsItemId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOpsItemRequest",
}) as any as S.Schema<DeleteOpsItemRequest>;
export interface DeleteOpsItemResponse {}
export const DeleteOpsItemResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOpsItemResponse",
}) as any as S.Schema<DeleteOpsItemResponse>;
export interface DeleteOpsMetadataRequest {
  OpsMetadataArn: string;
}
export const DeleteOpsMetadataRequest = S.suspend(() =>
  S.Struct({ OpsMetadataArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteOpsMetadataRequest",
}) as any as S.Schema<DeleteOpsMetadataRequest>;
export interface DeleteOpsMetadataResult {}
export const DeleteOpsMetadataResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOpsMetadataResult",
}) as any as S.Schema<DeleteOpsMetadataResult>;
export interface DeleteParameterRequest {
  Name: string;
}
export const DeleteParameterRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteParameterRequest",
}) as any as S.Schema<DeleteParameterRequest>;
export interface DeleteParameterResult {}
export const DeleteParameterResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteParameterResult",
}) as any as S.Schema<DeleteParameterResult>;
export interface DeleteParametersRequest {
  Names: ParameterNameList;
}
export const DeleteParametersRequest = S.suspend(() =>
  S.Struct({ Names: ParameterNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteParametersRequest",
}) as any as S.Schema<DeleteParametersRequest>;
export interface DeletePatchBaselineRequest {
  BaselineId: string;
}
export const DeletePatchBaselineRequest = S.suspend(() =>
  S.Struct({ BaselineId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePatchBaselineRequest",
}) as any as S.Schema<DeletePatchBaselineRequest>;
export interface DeleteResourceDataSyncRequest {
  SyncName: string;
  SyncType?: string;
}
export const DeleteResourceDataSyncRequest = S.suspend(() =>
  S.Struct({ SyncName: S.String, SyncType: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceDataSyncRequest",
}) as any as S.Schema<DeleteResourceDataSyncRequest>;
export interface DeleteResourceDataSyncResult {}
export const DeleteResourceDataSyncResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourceDataSyncResult",
}) as any as S.Schema<DeleteResourceDataSyncResult>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
  PolicyId: string;
  PolicyHash: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    PolicyId: S.String,
    PolicyHash: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeregisterManagedInstanceRequest {
  InstanceId: string;
}
export const DeregisterManagedInstanceRequest = S.suspend(() =>
  S.Struct({ InstanceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterManagedInstanceRequest",
}) as any as S.Schema<DeregisterManagedInstanceRequest>;
export interface DeregisterManagedInstanceResult {}
export const DeregisterManagedInstanceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterManagedInstanceResult",
}) as any as S.Schema<DeregisterManagedInstanceResult>;
export interface DeregisterPatchBaselineForPatchGroupRequest {
  BaselineId: string;
  PatchGroup: string;
}
export const DeregisterPatchBaselineForPatchGroupRequest = S.suspend(() =>
  S.Struct({ BaselineId: S.String, PatchGroup: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterPatchBaselineForPatchGroupRequest",
}) as any as S.Schema<DeregisterPatchBaselineForPatchGroupRequest>;
export interface DeregisterTargetFromMaintenanceWindowRequest {
  WindowId: string;
  WindowTargetId: string;
  Safe?: boolean;
}
export const DeregisterTargetFromMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    WindowTargetId: S.String,
    Safe: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterTargetFromMaintenanceWindowRequest",
}) as any as S.Schema<DeregisterTargetFromMaintenanceWindowRequest>;
export interface DeregisterTaskFromMaintenanceWindowRequest {
  WindowId: string;
  WindowTaskId: string;
}
export const DeregisterTaskFromMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({ WindowId: S.String, WindowTaskId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterTaskFromMaintenanceWindowRequest",
}) as any as S.Schema<DeregisterTaskFromMaintenanceWindowRequest>;
export interface DescribeAssociationRequest {
  Name?: string;
  InstanceId?: string;
  AssociationId?: string;
  AssociationVersion?: string;
}
export const DescribeAssociationRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssociationRequest",
}) as any as S.Schema<DescribeAssociationRequest>;
export interface DescribeDocumentRequest {
  Name: string;
  DocumentVersion?: string;
  VersionName?: string;
}
export const DescribeDocumentRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentVersion: S.optional(S.String),
    VersionName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDocumentRequest",
}) as any as S.Schema<DescribeDocumentRequest>;
export interface DescribeDocumentPermissionRequest {
  Name: string;
  PermissionType: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDocumentPermissionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    PermissionType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDocumentPermissionRequest",
}) as any as S.Schema<DescribeDocumentPermissionRequest>;
export interface DescribeEffectiveInstanceAssociationsRequest {
  InstanceId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeEffectiveInstanceAssociationsRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEffectiveInstanceAssociationsRequest",
}) as any as S.Schema<DescribeEffectiveInstanceAssociationsRequest>;
export interface DescribeEffectivePatchesForPatchBaselineRequest {
  BaselineId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeEffectivePatchesForPatchBaselineRequest = S.suspend(() =>
  S.Struct({
    BaselineId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEffectivePatchesForPatchBaselineRequest",
}) as any as S.Schema<DescribeEffectivePatchesForPatchBaselineRequest>;
export interface DescribeInstanceAssociationsStatusRequest {
  InstanceId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeInstanceAssociationsStatusRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstanceAssociationsStatusRequest",
}) as any as S.Schema<DescribeInstanceAssociationsStatusRequest>;
export type PatchOrchestratorFilterValues = string[];
export const PatchOrchestratorFilterValues = S.Array(S.String);
export interface PatchOrchestratorFilter {
  Key?: string;
  Values?: PatchOrchestratorFilterValues;
}
export const PatchOrchestratorFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(PatchOrchestratorFilterValues),
  }),
).annotations({
  identifier: "PatchOrchestratorFilter",
}) as any as S.Schema<PatchOrchestratorFilter>;
export type PatchOrchestratorFilterList = PatchOrchestratorFilter[];
export const PatchOrchestratorFilterList = S.Array(PatchOrchestratorFilter);
export interface DescribeInstancePatchesRequest {
  InstanceId: string;
  Filters?: PatchOrchestratorFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeInstancePatchesRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    Filters: S.optional(PatchOrchestratorFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstancePatchesRequest",
}) as any as S.Schema<DescribeInstancePatchesRequest>;
export interface DescribeInstancePatchStatesRequest {
  InstanceIds: InstanceIdList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeInstancePatchStatesRequest = S.suspend(() =>
  S.Struct({
    InstanceIds: InstanceIdList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstancePatchStatesRequest",
}) as any as S.Schema<DescribeInstancePatchStatesRequest>;
export interface DescribeInventoryDeletionsRequest {
  DeletionId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeInventoryDeletionsRequest = S.suspend(() =>
  S.Struct({
    DeletionId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInventoryDeletionsRequest",
}) as any as S.Schema<DescribeInventoryDeletionsRequest>;
export type MaintenanceWindowFilterValues = string[];
export const MaintenanceWindowFilterValues = S.Array(S.String);
export interface MaintenanceWindowFilter {
  Key?: string;
  Values?: MaintenanceWindowFilterValues;
}
export const MaintenanceWindowFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(MaintenanceWindowFilterValues),
  }),
).annotations({
  identifier: "MaintenanceWindowFilter",
}) as any as S.Schema<MaintenanceWindowFilter>;
export type MaintenanceWindowFilterList = MaintenanceWindowFilter[];
export const MaintenanceWindowFilterList = S.Array(MaintenanceWindowFilter);
export interface DescribeMaintenanceWindowExecutionTaskInvocationsRequest {
  WindowExecutionId: string;
  TaskId: string;
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionTaskInvocationsRequest =
  S.suspend(() =>
    S.Struct({
      WindowExecutionId: S.String,
      TaskId: S.String,
      Filters: S.optional(MaintenanceWindowFilterList),
      MaxResults: S.optional(S.Number),
      NextToken: S.optional(S.String),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "DescribeMaintenanceWindowExecutionTaskInvocationsRequest",
  }) as any as S.Schema<DescribeMaintenanceWindowExecutionTaskInvocationsRequest>;
export interface DescribeMaintenanceWindowExecutionTasksRequest {
  WindowExecutionId: string;
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionTasksRequest = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.String,
    Filters: S.optional(MaintenanceWindowFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowExecutionTasksRequest",
}) as any as S.Schema<DescribeMaintenanceWindowExecutionTasksRequest>;
export interface DescribeMaintenanceWindowsRequest {
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(MaintenanceWindowFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowsRequest",
}) as any as S.Schema<DescribeMaintenanceWindowsRequest>;
export type TargetValues = string[];
export const TargetValues = S.Array(S.String);
export interface Target {
  Key?: string;
  Values?: TargetValues;
}
export const Target = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Values: S.optional(TargetValues) }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export type Targets = Target[];
export const Targets = S.Array(Target);
export interface DescribeMaintenanceWindowScheduleRequest {
  WindowId?: string;
  Targets?: Targets;
  ResourceType?: string;
  Filters?: PatchOrchestratorFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowScheduleRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    Targets: S.optional(Targets),
    ResourceType: S.optional(S.String),
    Filters: S.optional(PatchOrchestratorFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowScheduleRequest",
}) as any as S.Schema<DescribeMaintenanceWindowScheduleRequest>;
export interface DescribeMaintenanceWindowsForTargetRequest {
  Targets: Targets;
  ResourceType: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowsForTargetRequest = S.suspend(() =>
  S.Struct({
    Targets: Targets,
    ResourceType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowsForTargetRequest",
}) as any as S.Schema<DescribeMaintenanceWindowsForTargetRequest>;
export interface DescribeMaintenanceWindowTargetsRequest {
  WindowId: string;
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowTargetsRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    Filters: S.optional(MaintenanceWindowFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowTargetsRequest",
}) as any as S.Schema<DescribeMaintenanceWindowTargetsRequest>;
export interface DescribeMaintenanceWindowTasksRequest {
  WindowId: string;
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowTasksRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    Filters: S.optional(MaintenanceWindowFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowTasksRequest",
}) as any as S.Schema<DescribeMaintenanceWindowTasksRequest>;
export interface DescribePatchBaselinesRequest {
  Filters?: PatchOrchestratorFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribePatchBaselinesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(PatchOrchestratorFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePatchBaselinesRequest",
}) as any as S.Schema<DescribePatchBaselinesRequest>;
export interface DescribePatchGroupsRequest {
  MaxResults?: number;
  Filters?: PatchOrchestratorFilterList;
  NextToken?: string;
}
export const DescribePatchGroupsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    Filters: S.optional(PatchOrchestratorFilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePatchGroupsRequest",
}) as any as S.Schema<DescribePatchGroupsRequest>;
export interface DescribePatchGroupStateRequest {
  PatchGroup: string;
}
export const DescribePatchGroupStateRequest = S.suspend(() =>
  S.Struct({ PatchGroup: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePatchGroupStateRequest",
}) as any as S.Schema<DescribePatchGroupStateRequest>;
export interface DescribePatchPropertiesRequest {
  OperatingSystem: string;
  Property: string;
  PatchSet?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribePatchPropertiesRequest = S.suspend(() =>
  S.Struct({
    OperatingSystem: S.String,
    Property: S.String,
    PatchSet: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePatchPropertiesRequest",
}) as any as S.Schema<DescribePatchPropertiesRequest>;
export interface DisassociateOpsItemRelatedItemRequest {
  OpsItemId: string;
  AssociationId: string;
}
export const DisassociateOpsItemRelatedItemRequest = S.suspend(() =>
  S.Struct({ OpsItemId: S.String, AssociationId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateOpsItemRelatedItemRequest",
}) as any as S.Schema<DisassociateOpsItemRelatedItemRequest>;
export interface DisassociateOpsItemRelatedItemResponse {}
export const DisassociateOpsItemRelatedItemResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateOpsItemRelatedItemResponse",
}) as any as S.Schema<DisassociateOpsItemRelatedItemResponse>;
export interface GetAccessTokenRequest {
  AccessRequestId: string;
}
export const GetAccessTokenRequest = S.suspend(() =>
  S.Struct({ AccessRequestId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessTokenRequest",
}) as any as S.Schema<GetAccessTokenRequest>;
export interface GetAutomationExecutionRequest {
  AutomationExecutionId: string;
}
export const GetAutomationExecutionRequest = S.suspend(() =>
  S.Struct({ AutomationExecutionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomationExecutionRequest",
}) as any as S.Schema<GetAutomationExecutionRequest>;
export interface GetCalendarStateRequest {
  CalendarNames: CalendarNameOrARNList;
  AtTime?: string;
}
export const GetCalendarStateRequest = S.suspend(() =>
  S.Struct({
    CalendarNames: CalendarNameOrARNList,
    AtTime: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCalendarStateRequest",
}) as any as S.Schema<GetCalendarStateRequest>;
export interface GetCommandInvocationRequest {
  CommandId: string;
  InstanceId: string;
  PluginName?: string;
}
export const GetCommandInvocationRequest = S.suspend(() =>
  S.Struct({
    CommandId: S.String,
    InstanceId: S.String,
    PluginName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommandInvocationRequest",
}) as any as S.Schema<GetCommandInvocationRequest>;
export interface GetConnectionStatusRequest {
  Target: string;
}
export const GetConnectionStatusRequest = S.suspend(() =>
  S.Struct({ Target: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectionStatusRequest",
}) as any as S.Schema<GetConnectionStatusRequest>;
export interface GetDefaultPatchBaselineRequest {
  OperatingSystem?: string;
}
export const GetDefaultPatchBaselineRequest = S.suspend(() =>
  S.Struct({ OperatingSystem: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDefaultPatchBaselineRequest",
}) as any as S.Schema<GetDefaultPatchBaselineRequest>;
export interface GetDocumentRequest {
  Name: string;
  VersionName?: string;
  DocumentVersion?: string;
  DocumentFormat?: string;
}
export const GetDocumentRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    VersionName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDocumentRequest",
}) as any as S.Schema<GetDocumentRequest>;
export interface GetExecutionPreviewRequest {
  ExecutionPreviewId: string;
}
export const GetExecutionPreviewRequest = S.suspend(() =>
  S.Struct({ ExecutionPreviewId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExecutionPreviewRequest",
}) as any as S.Schema<GetExecutionPreviewRequest>;
export interface GetInventorySchemaRequest {
  TypeName?: string;
  NextToken?: string;
  MaxResults?: number;
  Aggregator?: boolean;
  SubType?: boolean;
}
export const GetInventorySchemaRequest = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Aggregator: S.optional(S.Boolean),
    SubType: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInventorySchemaRequest",
}) as any as S.Schema<GetInventorySchemaRequest>;
export interface GetMaintenanceWindowRequest {
  WindowId: string;
}
export const GetMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({ WindowId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMaintenanceWindowRequest",
}) as any as S.Schema<GetMaintenanceWindowRequest>;
export interface GetMaintenanceWindowExecutionRequest {
  WindowExecutionId: string;
}
export const GetMaintenanceWindowExecutionRequest = S.suspend(() =>
  S.Struct({ WindowExecutionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMaintenanceWindowExecutionRequest",
}) as any as S.Schema<GetMaintenanceWindowExecutionRequest>;
export interface GetMaintenanceWindowExecutionTaskRequest {
  WindowExecutionId: string;
  TaskId: string;
}
export const GetMaintenanceWindowExecutionTaskRequest = S.suspend(() =>
  S.Struct({ WindowExecutionId: S.String, TaskId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMaintenanceWindowExecutionTaskRequest",
}) as any as S.Schema<GetMaintenanceWindowExecutionTaskRequest>;
export interface GetMaintenanceWindowExecutionTaskInvocationRequest {
  WindowExecutionId: string;
  TaskId: string;
  InvocationId: string;
}
export const GetMaintenanceWindowExecutionTaskInvocationRequest = S.suspend(
  () =>
    S.Struct({
      WindowExecutionId: S.String,
      TaskId: S.String,
      InvocationId: S.String,
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "GetMaintenanceWindowExecutionTaskInvocationRequest",
}) as any as S.Schema<GetMaintenanceWindowExecutionTaskInvocationRequest>;
export interface GetMaintenanceWindowTaskRequest {
  WindowId: string;
  WindowTaskId: string;
}
export const GetMaintenanceWindowTaskRequest = S.suspend(() =>
  S.Struct({ WindowId: S.String, WindowTaskId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMaintenanceWindowTaskRequest",
}) as any as S.Schema<GetMaintenanceWindowTaskRequest>;
export interface GetOpsItemRequest {
  OpsItemId: string;
  OpsItemArn?: string;
}
export const GetOpsItemRequest = S.suspend(() =>
  S.Struct({ OpsItemId: S.String, OpsItemArn: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpsItemRequest",
}) as any as S.Schema<GetOpsItemRequest>;
export interface GetOpsMetadataRequest {
  OpsMetadataArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetOpsMetadataRequest = S.suspend(() =>
  S.Struct({
    OpsMetadataArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpsMetadataRequest",
}) as any as S.Schema<GetOpsMetadataRequest>;
export interface GetParameterRequest {
  Name: string;
  WithDecryption?: boolean;
}
export const GetParameterRequest = S.suspend(() =>
  S.Struct({ Name: S.String, WithDecryption: S.optional(S.Boolean) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParameterRequest",
}) as any as S.Schema<GetParameterRequest>;
export interface GetParameterHistoryRequest {
  Name: string;
  WithDecryption?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const GetParameterHistoryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    WithDecryption: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParameterHistoryRequest",
}) as any as S.Schema<GetParameterHistoryRequest>;
export interface GetParametersRequest {
  Names: ParameterNameList;
  WithDecryption?: boolean;
}
export const GetParametersRequest = S.suspend(() =>
  S.Struct({
    Names: ParameterNameList,
    WithDecryption: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParametersRequest",
}) as any as S.Schema<GetParametersRequest>;
export type ParameterStringFilterValueList = string[];
export const ParameterStringFilterValueList = S.Array(S.String);
export interface ParameterStringFilter {
  Key: string;
  Option?: string;
  Values?: ParameterStringFilterValueList;
}
export const ParameterStringFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Option: S.optional(S.String),
    Values: S.optional(ParameterStringFilterValueList),
  }),
).annotations({
  identifier: "ParameterStringFilter",
}) as any as S.Schema<ParameterStringFilter>;
export type ParameterStringFilterList = ParameterStringFilter[];
export const ParameterStringFilterList = S.Array(ParameterStringFilter);
export interface GetParametersByPathRequest {
  Path: string;
  Recursive?: boolean;
  ParameterFilters?: ParameterStringFilterList;
  WithDecryption?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const GetParametersByPathRequest = S.suspend(() =>
  S.Struct({
    Path: S.String,
    Recursive: S.optional(S.Boolean),
    ParameterFilters: S.optional(ParameterStringFilterList),
    WithDecryption: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetParametersByPathRequest",
}) as any as S.Schema<GetParametersByPathRequest>;
export interface GetPatchBaselineRequest {
  BaselineId: string;
}
export const GetPatchBaselineRequest = S.suspend(() =>
  S.Struct({ BaselineId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPatchBaselineRequest",
}) as any as S.Schema<GetPatchBaselineRequest>;
export interface GetPatchBaselineForPatchGroupRequest {
  PatchGroup: string;
  OperatingSystem?: string;
}
export const GetPatchBaselineForPatchGroupRequest = S.suspend(() =>
  S.Struct({
    PatchGroup: S.String,
    OperatingSystem: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPatchBaselineForPatchGroupRequest",
}) as any as S.Schema<GetPatchBaselineForPatchGroupRequest>;
export interface GetResourcePoliciesRequest {
  ResourceArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetResourcePoliciesRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePoliciesRequest",
}) as any as S.Schema<GetResourcePoliciesRequest>;
export interface GetServiceSettingRequest {
  SettingId: string;
}
export const GetServiceSettingRequest = S.suspend(() =>
  S.Struct({ SettingId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServiceSettingRequest",
}) as any as S.Schema<GetServiceSettingRequest>;
export interface LabelParameterVersionRequest {
  Name: string;
  ParameterVersion?: number;
  Labels: ParameterLabelList;
}
export const LabelParameterVersionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ParameterVersion: S.optional(S.Number),
    Labels: ParameterLabelList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LabelParameterVersionRequest",
}) as any as S.Schema<LabelParameterVersionRequest>;
export interface ListAssociationVersionsRequest {
  AssociationId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAssociationVersionsRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociationVersionsRequest",
}) as any as S.Schema<ListAssociationVersionsRequest>;
export interface CommandFilter {
  key: string;
  value: string;
}
export const CommandFilter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "CommandFilter",
}) as any as S.Schema<CommandFilter>;
export type CommandFilterList = CommandFilter[];
export const CommandFilterList = S.Array(CommandFilter);
export interface ListCommandsRequest {
  CommandId?: string;
  InstanceId?: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: CommandFilterList;
}
export const ListCommandsRequest = S.suspend(() =>
  S.Struct({
    CommandId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(CommandFilterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommandsRequest",
}) as any as S.Schema<ListCommandsRequest>;
export type ComplianceStringFilterValueList = string[];
export const ComplianceStringFilterValueList = S.Array(
  S.String.pipe(T.XmlName("FilterValue")),
);
export interface ComplianceStringFilter {
  Key?: string;
  Values?: ComplianceStringFilterValueList;
  Type?: string;
}
export const ComplianceStringFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(ComplianceStringFilterValueList),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "ComplianceStringFilter",
}) as any as S.Schema<ComplianceStringFilter>;
export type ComplianceStringFilterList = ComplianceStringFilter[];
export const ComplianceStringFilterList = S.Array(
  ComplianceStringFilter.pipe(T.XmlName("ComplianceFilter")).annotations({
    identifier: "ComplianceStringFilter",
  }),
);
export interface ListComplianceSummariesRequest {
  Filters?: ComplianceStringFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListComplianceSummariesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ComplianceStringFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComplianceSummariesRequest",
}) as any as S.Schema<ListComplianceSummariesRequest>;
export interface ListDocumentMetadataHistoryRequest {
  Name: string;
  DocumentVersion?: string;
  Metadata: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDocumentMetadataHistoryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentVersion: S.optional(S.String),
    Metadata: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDocumentMetadataHistoryRequest",
}) as any as S.Schema<ListDocumentMetadataHistoryRequest>;
export interface ListDocumentVersionsRequest {
  Name: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDocumentVersionsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDocumentVersionsRequest",
}) as any as S.Schema<ListDocumentVersionsRequest>;
export type InventoryFilterValueList = string[];
export const InventoryFilterValueList = S.Array(
  S.String.pipe(T.XmlName("FilterValue")),
);
export interface InventoryFilter {
  Key: string;
  Values: InventoryFilterValueList;
  Type?: string;
}
export const InventoryFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: InventoryFilterValueList,
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryFilter",
}) as any as S.Schema<InventoryFilter>;
export type InventoryFilterList = InventoryFilter[];
export const InventoryFilterList = S.Array(
  InventoryFilter.pipe(T.XmlName("InventoryFilter")).annotations({
    identifier: "InventoryFilter",
  }),
);
export interface ListInventoryEntriesRequest {
  InstanceId: string;
  TypeName: string;
  Filters?: InventoryFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListInventoryEntriesRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    TypeName: S.String,
    Filters: S.optional(InventoryFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInventoryEntriesRequest",
}) as any as S.Schema<ListInventoryEntriesRequest>;
export interface ListResourceComplianceSummariesRequest {
  Filters?: ComplianceStringFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceComplianceSummariesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ComplianceStringFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceComplianceSummariesRequest",
}) as any as S.Schema<ListResourceComplianceSummariesRequest>;
export interface ListResourceDataSyncRequest {
  SyncType?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceDataSyncRequest = S.suspend(() =>
  S.Struct({
    SyncType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceDataSyncRequest",
}) as any as S.Schema<ListResourceDataSyncRequest>;
export interface ListTagsForResourceRequest {
  ResourceType: string;
  ResourceId: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceType: S.String, ResourceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface ModifyDocumentPermissionRequest {
  Name: string;
  PermissionType: string;
  AccountIdsToAdd?: AccountIdList;
  AccountIdsToRemove?: AccountIdList;
  SharedDocumentVersion?: string;
}
export const ModifyDocumentPermissionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    PermissionType: S.String,
    AccountIdsToAdd: S.optional(AccountIdList),
    AccountIdsToRemove: S.optional(AccountIdList),
    SharedDocumentVersion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyDocumentPermissionRequest",
}) as any as S.Schema<ModifyDocumentPermissionRequest>;
export interface ModifyDocumentPermissionResponse {}
export const ModifyDocumentPermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ModifyDocumentPermissionResponse",
}) as any as S.Schema<ModifyDocumentPermissionResponse>;
export interface PutParameterRequest {
  Name: string;
  Description?: string;
  Value: string | Redacted.Redacted<string>;
  Type?: string;
  KeyId?: string;
  Overwrite?: boolean;
  AllowedPattern?: string;
  Tags?: TagList;
  Tier?: string;
  Policies?: string;
  DataType?: string;
}
export const PutParameterRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Value: SensitiveString,
    Type: S.optional(S.String),
    KeyId: S.optional(S.String),
    Overwrite: S.optional(S.Boolean),
    AllowedPattern: S.optional(S.String),
    Tags: S.optional(TagList),
    Tier: S.optional(S.String),
    Policies: S.optional(S.String),
    DataType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutParameterRequest",
}) as any as S.Schema<PutParameterRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  Policy: string;
  PolicyId?: string;
  PolicyHash?: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    Policy: S.String,
    PolicyId: S.optional(S.String),
    PolicyHash: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface RegisterDefaultPatchBaselineRequest {
  BaselineId: string;
}
export const RegisterDefaultPatchBaselineRequest = S.suspend(() =>
  S.Struct({ BaselineId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterDefaultPatchBaselineRequest",
}) as any as S.Schema<RegisterDefaultPatchBaselineRequest>;
export interface RegisterPatchBaselineForPatchGroupRequest {
  BaselineId: string;
  PatchGroup: string;
}
export const RegisterPatchBaselineForPatchGroupRequest = S.suspend(() =>
  S.Struct({ BaselineId: S.String, PatchGroup: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterPatchBaselineForPatchGroupRequest",
}) as any as S.Schema<RegisterPatchBaselineForPatchGroupRequest>;
export interface RegisterTargetWithMaintenanceWindowRequest {
  WindowId: string;
  ResourceType: string;
  Targets: Targets;
  OwnerInformation?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  ClientToken?: string;
}
export const RegisterTargetWithMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    ResourceType: S.String,
    Targets: Targets,
    OwnerInformation: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterTargetWithMaintenanceWindowRequest",
}) as any as S.Schema<RegisterTargetWithMaintenanceWindowRequest>;
export interface RemoveTagsFromResourceRequest {
  ResourceType: string;
  ResourceId: string;
  TagKeys: KeyList;
}
export const RemoveTagsFromResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    ResourceId: S.String,
    TagKeys: KeyList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsFromResourceRequest",
}) as any as S.Schema<RemoveTagsFromResourceRequest>;
export interface RemoveTagsFromResourceResult {}
export const RemoveTagsFromResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromResourceResult",
}) as any as S.Schema<RemoveTagsFromResourceResult>;
export interface ResetServiceSettingRequest {
  SettingId: string;
}
export const ResetServiceSettingRequest = S.suspend(() =>
  S.Struct({ SettingId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetServiceSettingRequest",
}) as any as S.Schema<ResetServiceSettingRequest>;
export interface ResumeSessionRequest {
  SessionId: string;
}
export const ResumeSessionRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResumeSessionRequest",
}) as any as S.Schema<ResumeSessionRequest>;
export interface StartAccessRequestRequest {
  Reason: string;
  Targets: Targets;
  Tags?: TagList;
}
export const StartAccessRequestRequest = S.suspend(() =>
  S.Struct({
    Reason: S.String,
    Targets: Targets,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAccessRequestRequest",
}) as any as S.Schema<StartAccessRequestRequest>;
export interface StartAssociationsOnceRequest {
  AssociationIds: AssociationIdList;
}
export const StartAssociationsOnceRequest = S.suspend(() =>
  S.Struct({ AssociationIds: AssociationIdList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAssociationsOnceRequest",
}) as any as S.Schema<StartAssociationsOnceRequest>;
export interface StartAssociationsOnceResult {}
export const StartAssociationsOnceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StartAssociationsOnceResult",
}) as any as S.Schema<StartAssociationsOnceResult>;
export type AutomationParameterValueList = string[];
export const AutomationParameterValueList = S.Array(S.String);
export type AutomationParameterMap = {
  [key: string]: AutomationParameterValueList;
};
export const AutomationParameterMap = S.Record({
  key: S.String,
  value: AutomationParameterValueList,
});
export type TargetMapValueList = string[];
export const TargetMapValueList = S.Array(S.String);
export type TargetMap = { [key: string]: TargetMapValueList };
export const TargetMap = S.Record({ key: S.String, value: TargetMapValueList });
export type TargetMaps = TargetMap[];
export const TargetMaps = S.Array(TargetMap);
export type Accounts = string[];
export const Accounts = S.Array(S.String);
export type Regions = string[];
export const Regions = S.Array(S.String);
export interface Alarm {
  Name: string;
}
export const Alarm = S.suspend(() => S.Struct({ Name: S.String })).annotations({
  identifier: "Alarm",
}) as any as S.Schema<Alarm>;
export type AlarmList = Alarm[];
export const AlarmList = S.Array(Alarm);
export interface AlarmConfiguration {
  IgnorePollAlarmFailure?: boolean;
  Alarms: AlarmList;
}
export const AlarmConfiguration = S.suspend(() =>
  S.Struct({
    IgnorePollAlarmFailure: S.optional(S.Boolean),
    Alarms: AlarmList,
  }),
).annotations({
  identifier: "AlarmConfiguration",
}) as any as S.Schema<AlarmConfiguration>;
export type ExcludeAccounts = string[];
export const ExcludeAccounts = S.Array(S.String);
export interface TargetLocation {
  Accounts?: Accounts;
  Regions?: Regions;
  TargetLocationMaxConcurrency?: string;
  TargetLocationMaxErrors?: string;
  ExecutionRoleName?: string;
  TargetLocationAlarmConfiguration?: AlarmConfiguration;
  IncludeChildOrganizationUnits?: boolean;
  ExcludeAccounts?: ExcludeAccounts;
  Targets?: Targets;
  TargetsMaxConcurrency?: string;
  TargetsMaxErrors?: string;
}
export const TargetLocation = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(Accounts),
    Regions: S.optional(Regions),
    TargetLocationMaxConcurrency: S.optional(S.String),
    TargetLocationMaxErrors: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    TargetLocationAlarmConfiguration: S.optional(AlarmConfiguration),
    IncludeChildOrganizationUnits: S.optional(S.Boolean),
    ExcludeAccounts: S.optional(ExcludeAccounts),
    Targets: S.optional(Targets),
    TargetsMaxConcurrency: S.optional(S.String),
    TargetsMaxErrors: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetLocation",
}) as any as S.Schema<TargetLocation>;
export type TargetLocations = TargetLocation[];
export const TargetLocations = S.Array(TargetLocation);
export interface StartAutomationExecutionRequest {
  DocumentName: string;
  DocumentVersion?: string;
  Parameters?: AutomationParameterMap;
  ClientToken?: string;
  Mode?: string;
  TargetParameterName?: string;
  Targets?: Targets;
  TargetMaps?: TargetMaps;
  MaxConcurrency?: string;
  MaxErrors?: string;
  TargetLocations?: TargetLocations;
  Tags?: TagList;
  AlarmConfiguration?: AlarmConfiguration;
  TargetLocationsURL?: string;
}
export const StartAutomationExecutionRequest = S.suspend(() =>
  S.Struct({
    DocumentName: S.String,
    DocumentVersion: S.optional(S.String),
    Parameters: S.optional(AutomationParameterMap),
    ClientToken: S.optional(S.String),
    Mode: S.optional(S.String),
    TargetParameterName: S.optional(S.String),
    Targets: S.optional(Targets),
    TargetMaps: S.optional(TargetMaps),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    TargetLocations: S.optional(TargetLocations),
    Tags: S.optional(TagList),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TargetLocationsURL: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAutomationExecutionRequest",
}) as any as S.Schema<StartAutomationExecutionRequest>;
export interface StopAutomationExecutionRequest {
  AutomationExecutionId: string;
  Type?: string;
}
export const StopAutomationExecutionRequest = S.suspend(() =>
  S.Struct({
    AutomationExecutionId: S.String,
    Type: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopAutomationExecutionRequest",
}) as any as S.Schema<StopAutomationExecutionRequest>;
export interface StopAutomationExecutionResult {}
export const StopAutomationExecutionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopAutomationExecutionResult",
}) as any as S.Schema<StopAutomationExecutionResult>;
export interface TerminateSessionRequest {
  SessionId: string;
}
export const TerminateSessionRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateSessionRequest",
}) as any as S.Schema<TerminateSessionRequest>;
export interface UnlabelParameterVersionRequest {
  Name: string;
  ParameterVersion: number;
  Labels: ParameterLabelList;
}
export const UnlabelParameterVersionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ParameterVersion: S.Number,
    Labels: ParameterLabelList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UnlabelParameterVersionRequest",
}) as any as S.Schema<UnlabelParameterVersionRequest>;
export type ParameterValueList = string[];
export const ParameterValueList = S.Array(S.String);
export type Parameters = { [key: string]: ParameterValueList };
export const Parameters = S.Record({
  key: S.String,
  value: ParameterValueList,
});
export interface S3OutputLocation {
  OutputS3Region?: string;
  OutputS3BucketName?: string;
  OutputS3KeyPrefix?: string;
}
export const S3OutputLocation = S.suspend(() =>
  S.Struct({
    OutputS3Region: S.optional(S.String),
    OutputS3BucketName: S.optional(S.String),
    OutputS3KeyPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "S3OutputLocation",
}) as any as S.Schema<S3OutputLocation>;
export interface InstanceAssociationOutputLocation {
  S3Location?: S3OutputLocation;
}
export const InstanceAssociationOutputLocation = S.suspend(() =>
  S.Struct({ S3Location: S.optional(S3OutputLocation) }),
).annotations({
  identifier: "InstanceAssociationOutputLocation",
}) as any as S.Schema<InstanceAssociationOutputLocation>;
export interface UpdateAssociationRequest {
  AssociationId: string;
  Parameters?: Parameters;
  DocumentVersion?: string;
  ScheduleExpression?: string;
  OutputLocation?: InstanceAssociationOutputLocation;
  Name?: string;
  Targets?: Targets;
  AssociationName?: string;
  AssociationVersion?: string;
  AutomationTargetParameterName?: string;
  MaxErrors?: string;
  MaxConcurrency?: string;
  ComplianceSeverity?: string;
  SyncCompliance?: string;
  ApplyOnlyAtCronInterval?: boolean;
  CalendarNames?: CalendarNameOrARNList;
  TargetLocations?: TargetLocations;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
  AlarmConfiguration?: AlarmConfiguration;
}
export const UpdateAssociationRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    Parameters: S.optional(Parameters),
    DocumentVersion: S.optional(S.String),
    ScheduleExpression: S.optional(S.String),
    OutputLocation: S.optional(InstanceAssociationOutputLocation),
    Name: S.optional(S.String),
    Targets: S.optional(Targets),
    AssociationName: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    AutomationTargetParameterName: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    ComplianceSeverity: S.optional(S.String),
    SyncCompliance: S.optional(S.String),
    ApplyOnlyAtCronInterval: S.optional(S.Boolean),
    CalendarNames: S.optional(CalendarNameOrARNList),
    TargetLocations: S.optional(TargetLocations),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssociationRequest",
}) as any as S.Schema<UpdateAssociationRequest>;
export type AttachmentsSourceValues = string[];
export const AttachmentsSourceValues = S.Array(S.String);
export interface AttachmentsSource {
  Key?: string;
  Values?: AttachmentsSourceValues;
  Name?: string;
}
export const AttachmentsSource = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(AttachmentsSourceValues),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachmentsSource",
}) as any as S.Schema<AttachmentsSource>;
export type AttachmentsSourceList = AttachmentsSource[];
export const AttachmentsSourceList = S.Array(AttachmentsSource);
export interface UpdateDocumentRequest {
  Content: string;
  Attachments?: AttachmentsSourceList;
  Name: string;
  DisplayName?: string;
  VersionName?: string;
  DocumentVersion?: string;
  DocumentFormat?: string;
  TargetType?: string;
}
export const UpdateDocumentRequest = S.suspend(() =>
  S.Struct({
    Content: S.String,
    Attachments: S.optional(AttachmentsSourceList),
    Name: S.String,
    DisplayName: S.optional(S.String),
    VersionName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
    TargetType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentRequest",
}) as any as S.Schema<UpdateDocumentRequest>;
export interface UpdateDocumentDefaultVersionRequest {
  Name: string;
  DocumentVersion: string;
}
export const UpdateDocumentDefaultVersionRequest = S.suspend(() =>
  S.Struct({ Name: S.String, DocumentVersion: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentDefaultVersionRequest",
}) as any as S.Schema<UpdateDocumentDefaultVersionRequest>;
export interface UpdateMaintenanceWindowRequest {
  WindowId: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  StartDate?: string;
  EndDate?: string;
  Schedule?: string;
  ScheduleTimezone?: string;
  ScheduleOffset?: number;
  Duration?: number;
  Cutoff?: number;
  AllowUnassociatedTargets?: boolean;
  Enabled?: boolean;
  Replace?: boolean;
}
export const UpdateMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Schedule: S.optional(S.String),
    ScheduleTimezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    Cutoff: S.optional(S.Number),
    AllowUnassociatedTargets: S.optional(S.Boolean),
    Enabled: S.optional(S.Boolean),
    Replace: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMaintenanceWindowRequest",
}) as any as S.Schema<UpdateMaintenanceWindowRequest>;
export interface UpdateMaintenanceWindowTargetRequest {
  WindowId: string;
  WindowTargetId: string;
  Targets?: Targets;
  OwnerInformation?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  Replace?: boolean;
}
export const UpdateMaintenanceWindowTargetRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    WindowTargetId: S.String,
    Targets: S.optional(Targets),
    OwnerInformation: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Replace: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMaintenanceWindowTargetRequest",
}) as any as S.Schema<UpdateMaintenanceWindowTargetRequest>;
export type MaintenanceWindowTaskParameterValueList =
  | string
  | Redacted.Redacted<string>[];
export const MaintenanceWindowTaskParameterValueList = S.Array(SensitiveString);
export interface MaintenanceWindowTaskParameterValueExpression {
  Values?: MaintenanceWindowTaskParameterValueList;
}
export const MaintenanceWindowTaskParameterValueExpression = S.suspend(() =>
  S.Struct({ Values: S.optional(MaintenanceWindowTaskParameterValueList) }),
).annotations({
  identifier: "MaintenanceWindowTaskParameterValueExpression",
}) as any as S.Schema<MaintenanceWindowTaskParameterValueExpression>;
export type MaintenanceWindowTaskParameters = {
  [key: string]: MaintenanceWindowTaskParameterValueExpression;
};
export const MaintenanceWindowTaskParameters = S.Record({
  key: S.String,
  value: MaintenanceWindowTaskParameterValueExpression,
});
export interface CloudWatchOutputConfig {
  CloudWatchLogGroupName?: string;
  CloudWatchOutputEnabled?: boolean;
}
export const CloudWatchOutputConfig = S.suspend(() =>
  S.Struct({
    CloudWatchLogGroupName: S.optional(S.String),
    CloudWatchOutputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CloudWatchOutputConfig",
}) as any as S.Schema<CloudWatchOutputConfig>;
export type NotificationEventList = string[];
export const NotificationEventList = S.Array(S.String);
export interface NotificationConfig {
  NotificationArn?: string;
  NotificationEvents?: NotificationEventList;
  NotificationType?: string;
}
export const NotificationConfig = S.suspend(() =>
  S.Struct({
    NotificationArn: S.optional(S.String),
    NotificationEvents: S.optional(NotificationEventList),
    NotificationType: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationConfig",
}) as any as S.Schema<NotificationConfig>;
export interface MaintenanceWindowRunCommandParameters {
  Comment?: string;
  CloudWatchOutputConfig?: CloudWatchOutputConfig;
  DocumentHash?: string;
  DocumentHashType?: string;
  DocumentVersion?: string;
  NotificationConfig?: NotificationConfig;
  OutputS3BucketName?: string;
  OutputS3KeyPrefix?: string;
  Parameters?: Parameters;
  ServiceRoleArn?: string;
  TimeoutSeconds?: number;
}
export const MaintenanceWindowRunCommandParameters = S.suspend(() =>
  S.Struct({
    Comment: S.optional(S.String),
    CloudWatchOutputConfig: S.optional(CloudWatchOutputConfig),
    DocumentHash: S.optional(S.String),
    DocumentHashType: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    NotificationConfig: S.optional(NotificationConfig),
    OutputS3BucketName: S.optional(S.String),
    OutputS3KeyPrefix: S.optional(S.String),
    Parameters: S.optional(Parameters),
    ServiceRoleArn: S.optional(S.String),
    TimeoutSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "MaintenanceWindowRunCommandParameters",
}) as any as S.Schema<MaintenanceWindowRunCommandParameters>;
export interface MaintenanceWindowAutomationParameters {
  DocumentVersion?: string;
  Parameters?: AutomationParameterMap;
}
export const MaintenanceWindowAutomationParameters = S.suspend(() =>
  S.Struct({
    DocumentVersion: S.optional(S.String),
    Parameters: S.optional(AutomationParameterMap),
  }),
).annotations({
  identifier: "MaintenanceWindowAutomationParameters",
}) as any as S.Schema<MaintenanceWindowAutomationParameters>;
export interface MaintenanceWindowStepFunctionsParameters {
  Input?: string | Redacted.Redacted<string>;
  Name?: string;
}
export const MaintenanceWindowStepFunctionsParameters = S.suspend(() =>
  S.Struct({ Input: S.optional(SensitiveString), Name: S.optional(S.String) }),
).annotations({
  identifier: "MaintenanceWindowStepFunctionsParameters",
}) as any as S.Schema<MaintenanceWindowStepFunctionsParameters>;
export interface MaintenanceWindowLambdaParameters {
  ClientContext?: string;
  Qualifier?: string;
  Payload?: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const MaintenanceWindowLambdaParameters = S.suspend(() =>
  S.Struct({
    ClientContext: S.optional(S.String),
    Qualifier: S.optional(S.String),
    Payload: S.optional(SensitiveBlob),
  }),
).annotations({
  identifier: "MaintenanceWindowLambdaParameters",
}) as any as S.Schema<MaintenanceWindowLambdaParameters>;
export interface MaintenanceWindowTaskInvocationParameters {
  RunCommand?: MaintenanceWindowRunCommandParameters;
  Automation?: MaintenanceWindowAutomationParameters;
  StepFunctions?: MaintenanceWindowStepFunctionsParameters;
  Lambda?: MaintenanceWindowLambdaParameters;
}
export const MaintenanceWindowTaskInvocationParameters = S.suspend(() =>
  S.Struct({
    RunCommand: S.optional(MaintenanceWindowRunCommandParameters),
    Automation: S.optional(MaintenanceWindowAutomationParameters),
    StepFunctions: S.optional(MaintenanceWindowStepFunctionsParameters),
    Lambda: S.optional(MaintenanceWindowLambdaParameters),
  }),
).annotations({
  identifier: "MaintenanceWindowTaskInvocationParameters",
}) as any as S.Schema<MaintenanceWindowTaskInvocationParameters>;
export interface LoggingInfo {
  S3BucketName: string;
  S3KeyPrefix?: string;
  S3Region: string;
}
export const LoggingInfo = S.suspend(() =>
  S.Struct({
    S3BucketName: S.String,
    S3KeyPrefix: S.optional(S.String),
    S3Region: S.String,
  }),
).annotations({ identifier: "LoggingInfo" }) as any as S.Schema<LoggingInfo>;
export interface UpdateMaintenanceWindowTaskRequest {
  WindowId: string;
  WindowTaskId: string;
  Targets?: Targets;
  TaskArn?: string;
  ServiceRoleArn?: string;
  TaskParameters?: MaintenanceWindowTaskParameters;
  TaskInvocationParameters?: MaintenanceWindowTaskInvocationParameters;
  Priority?: number;
  MaxConcurrency?: string;
  MaxErrors?: string;
  LoggingInfo?: LoggingInfo;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  Replace?: boolean;
  CutoffBehavior?: string;
  AlarmConfiguration?: AlarmConfiguration;
}
export const UpdateMaintenanceWindowTaskRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    WindowTaskId: S.String,
    Targets: S.optional(Targets),
    TaskArn: S.optional(S.String),
    ServiceRoleArn: S.optional(S.String),
    TaskParameters: S.optional(MaintenanceWindowTaskParameters),
    TaskInvocationParameters: S.optional(
      MaintenanceWindowTaskInvocationParameters,
    ),
    Priority: S.optional(S.Number),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    LoggingInfo: S.optional(LoggingInfo),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Replace: S.optional(S.Boolean),
    CutoffBehavior: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMaintenanceWindowTaskRequest",
}) as any as S.Schema<UpdateMaintenanceWindowTaskRequest>;
export interface UpdateManagedInstanceRoleRequest {
  InstanceId: string;
  IamRole: string;
}
export const UpdateManagedInstanceRoleRequest = S.suspend(() =>
  S.Struct({ InstanceId: S.String, IamRole: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateManagedInstanceRoleRequest",
}) as any as S.Schema<UpdateManagedInstanceRoleRequest>;
export interface UpdateManagedInstanceRoleResult {}
export const UpdateManagedInstanceRoleResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateManagedInstanceRoleResult",
}) as any as S.Schema<UpdateManagedInstanceRoleResult>;
export interface OpsItemDataValue {
  Value?: string;
  Type?: string;
}
export const OpsItemDataValue = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "OpsItemDataValue",
}) as any as S.Schema<OpsItemDataValue>;
export type OpsItemOperationalData = { [key: string]: OpsItemDataValue };
export const OpsItemOperationalData = S.Record({
  key: S.String,
  value: OpsItemDataValue,
});
export interface OpsItemNotification {
  Arn?: string;
}
export const OpsItemNotification = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "OpsItemNotification",
}) as any as S.Schema<OpsItemNotification>;
export type OpsItemNotifications = OpsItemNotification[];
export const OpsItemNotifications = S.Array(OpsItemNotification);
export interface RelatedOpsItem {
  OpsItemId: string;
}
export const RelatedOpsItem = S.suspend(() =>
  S.Struct({ OpsItemId: S.String }),
).annotations({
  identifier: "RelatedOpsItem",
}) as any as S.Schema<RelatedOpsItem>;
export type RelatedOpsItems = RelatedOpsItem[];
export const RelatedOpsItems = S.Array(RelatedOpsItem);
export interface UpdateOpsItemRequest {
  Description?: string;
  OperationalData?: OpsItemOperationalData;
  OperationalDataToDelete?: OpsItemOpsDataKeysList;
  Notifications?: OpsItemNotifications;
  Priority?: number;
  RelatedOpsItems?: RelatedOpsItems;
  Status?: string;
  OpsItemId: string;
  Title?: string;
  Category?: string;
  Severity?: string;
  ActualStartTime?: Date;
  ActualEndTime?: Date;
  PlannedStartTime?: Date;
  PlannedEndTime?: Date;
  OpsItemArn?: string;
}
export const UpdateOpsItemRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    OperationalData: S.optional(OpsItemOperationalData),
    OperationalDataToDelete: S.optional(OpsItemOpsDataKeysList),
    Notifications: S.optional(OpsItemNotifications),
    Priority: S.optional(S.Number),
    RelatedOpsItems: S.optional(RelatedOpsItems),
    Status: S.optional(S.String),
    OpsItemId: S.String,
    Title: S.optional(S.String),
    Category: S.optional(S.String),
    Severity: S.optional(S.String),
    ActualStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ActualEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PlannedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PlannedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OpsItemArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOpsItemRequest",
}) as any as S.Schema<UpdateOpsItemRequest>;
export interface UpdateOpsItemResponse {}
export const UpdateOpsItemResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateOpsItemResponse",
}) as any as S.Schema<UpdateOpsItemResponse>;
export interface MetadataValue {
  Value?: string;
}
export const MetadataValue = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String) }),
).annotations({
  identifier: "MetadataValue",
}) as any as S.Schema<MetadataValue>;
export type MetadataMap = { [key: string]: MetadataValue };
export const MetadataMap = S.Record({ key: S.String, value: MetadataValue });
export interface UpdateOpsMetadataRequest {
  OpsMetadataArn: string;
  MetadataToUpdate?: MetadataMap;
  KeysToDelete?: MetadataKeysToDeleteList;
}
export const UpdateOpsMetadataRequest = S.suspend(() =>
  S.Struct({
    OpsMetadataArn: S.String,
    MetadataToUpdate: S.optional(MetadataMap),
    KeysToDelete: S.optional(MetadataKeysToDeleteList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOpsMetadataRequest",
}) as any as S.Schema<UpdateOpsMetadataRequest>;
export type PatchFilterValueList = string[];
export const PatchFilterValueList = S.Array(S.String);
export interface PatchFilter {
  Key: string;
  Values: PatchFilterValueList;
}
export const PatchFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: PatchFilterValueList }),
).annotations({ identifier: "PatchFilter" }) as any as S.Schema<PatchFilter>;
export type PatchFilterList = PatchFilter[];
export const PatchFilterList = S.Array(PatchFilter);
export interface PatchFilterGroup {
  PatchFilters: PatchFilterList;
}
export const PatchFilterGroup = S.suspend(() =>
  S.Struct({ PatchFilters: PatchFilterList }),
).annotations({
  identifier: "PatchFilterGroup",
}) as any as S.Schema<PatchFilterGroup>;
export interface PatchRule {
  PatchFilterGroup: PatchFilterGroup;
  ComplianceLevel?: string;
  ApproveAfterDays?: number;
  ApproveUntilDate?: string;
  EnableNonSecurity?: boolean;
}
export const PatchRule = S.suspend(() =>
  S.Struct({
    PatchFilterGroup: PatchFilterGroup,
    ComplianceLevel: S.optional(S.String),
    ApproveAfterDays: S.optional(S.Number),
    ApproveUntilDate: S.optional(S.String),
    EnableNonSecurity: S.optional(S.Boolean),
  }),
).annotations({ identifier: "PatchRule" }) as any as S.Schema<PatchRule>;
export type PatchRuleList = PatchRule[];
export const PatchRuleList = S.Array(PatchRule);
export interface PatchRuleGroup {
  PatchRules: PatchRuleList;
}
export const PatchRuleGroup = S.suspend(() =>
  S.Struct({ PatchRules: PatchRuleList }),
).annotations({
  identifier: "PatchRuleGroup",
}) as any as S.Schema<PatchRuleGroup>;
export type PatchSourceProductList = string[];
export const PatchSourceProductList = S.Array(S.String);
export interface PatchSource {
  Name: string;
  Products: PatchSourceProductList;
  Configuration: string | Redacted.Redacted<string>;
}
export const PatchSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Products: PatchSourceProductList,
    Configuration: SensitiveString,
  }),
).annotations({ identifier: "PatchSource" }) as any as S.Schema<PatchSource>;
export type PatchSourceList = PatchSource[];
export const PatchSourceList = S.Array(PatchSource);
export interface UpdatePatchBaselineRequest {
  BaselineId: string;
  Name?: string;
  GlobalFilters?: PatchFilterGroup;
  ApprovalRules?: PatchRuleGroup;
  ApprovedPatches?: PatchIdList;
  ApprovedPatchesComplianceLevel?: string;
  ApprovedPatchesEnableNonSecurity?: boolean;
  RejectedPatches?: PatchIdList;
  RejectedPatchesAction?: string;
  Description?: string;
  Sources?: PatchSourceList;
  AvailableSecurityUpdatesComplianceStatus?: string;
  Replace?: boolean;
}
export const UpdatePatchBaselineRequest = S.suspend(() =>
  S.Struct({
    BaselineId: S.String,
    Name: S.optional(S.String),
    GlobalFilters: S.optional(PatchFilterGroup),
    ApprovalRules: S.optional(PatchRuleGroup),
    ApprovedPatches: S.optional(PatchIdList),
    ApprovedPatchesComplianceLevel: S.optional(S.String),
    ApprovedPatchesEnableNonSecurity: S.optional(S.Boolean),
    RejectedPatches: S.optional(PatchIdList),
    RejectedPatchesAction: S.optional(S.String),
    Description: S.optional(S.String),
    Sources: S.optional(PatchSourceList),
    AvailableSecurityUpdatesComplianceStatus: S.optional(S.String),
    Replace: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePatchBaselineRequest",
}) as any as S.Schema<UpdatePatchBaselineRequest>;
export interface ResourceDataSyncOrganizationalUnit {
  OrganizationalUnitId?: string;
}
export const ResourceDataSyncOrganizationalUnit = S.suspend(() =>
  S.Struct({ OrganizationalUnitId: S.optional(S.String) }),
).annotations({
  identifier: "ResourceDataSyncOrganizationalUnit",
}) as any as S.Schema<ResourceDataSyncOrganizationalUnit>;
export type ResourceDataSyncOrganizationalUnitList =
  ResourceDataSyncOrganizationalUnit[];
export const ResourceDataSyncOrganizationalUnitList = S.Array(
  ResourceDataSyncOrganizationalUnit,
);
export interface ResourceDataSyncAwsOrganizationsSource {
  OrganizationSourceType: string;
  OrganizationalUnits?: ResourceDataSyncOrganizationalUnitList;
}
export const ResourceDataSyncAwsOrganizationsSource = S.suspend(() =>
  S.Struct({
    OrganizationSourceType: S.String,
    OrganizationalUnits: S.optional(ResourceDataSyncOrganizationalUnitList),
  }),
).annotations({
  identifier: "ResourceDataSyncAwsOrganizationsSource",
}) as any as S.Schema<ResourceDataSyncAwsOrganizationsSource>;
export type ResourceDataSyncSourceRegionList = string[];
export const ResourceDataSyncSourceRegionList = S.Array(S.String);
export interface ResourceDataSyncSource {
  SourceType: string;
  AwsOrganizationsSource?: ResourceDataSyncAwsOrganizationsSource;
  SourceRegions: ResourceDataSyncSourceRegionList;
  IncludeFutureRegions?: boolean;
  EnableAllOpsDataSources?: boolean;
}
export const ResourceDataSyncSource = S.suspend(() =>
  S.Struct({
    SourceType: S.String,
    AwsOrganizationsSource: S.optional(ResourceDataSyncAwsOrganizationsSource),
    SourceRegions: ResourceDataSyncSourceRegionList,
    IncludeFutureRegions: S.optional(S.Boolean),
    EnableAllOpsDataSources: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResourceDataSyncSource",
}) as any as S.Schema<ResourceDataSyncSource>;
export interface UpdateResourceDataSyncRequest {
  SyncName: string;
  SyncType: string;
  SyncSource: ResourceDataSyncSource;
}
export const UpdateResourceDataSyncRequest = S.suspend(() =>
  S.Struct({
    SyncName: S.String,
    SyncType: S.String,
    SyncSource: ResourceDataSyncSource,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceDataSyncRequest",
}) as any as S.Schema<UpdateResourceDataSyncRequest>;
export interface UpdateResourceDataSyncResult {}
export const UpdateResourceDataSyncResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateResourceDataSyncResult",
}) as any as S.Schema<UpdateResourceDataSyncResult>;
export interface UpdateServiceSettingRequest {
  SettingId: string;
  SettingValue: string;
}
export const UpdateServiceSettingRequest = S.suspend(() =>
  S.Struct({ SettingId: S.String, SettingValue: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceSettingRequest",
}) as any as S.Schema<UpdateServiceSettingRequest>;
export interface UpdateServiceSettingResult {}
export const UpdateServiceSettingResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateServiceSettingResult",
}) as any as S.Schema<UpdateServiceSettingResult>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type AutomationExecutionFilterValueList = string[];
export const AutomationExecutionFilterValueList = S.Array(S.String);
export type StepExecutionFilterValueList = string[];
export const StepExecutionFilterValueList = S.Array(S.String);
export type InstanceInformationFilterValueSet = string[];
export const InstanceInformationFilterValueSet = S.Array(
  S.String.pipe(T.XmlName("InstanceInformationFilterValue")),
);
export type InstancePatchStateFilterValues = string[];
export const InstancePatchStateFilterValues = S.Array(S.String);
export type InstancePropertyFilterValueSet = string[];
export const InstancePropertyFilterValueSet = S.Array(
  S.String.pipe(T.XmlName("InstancePropertyFilterValue")),
);
export type OpsItemFilterValues = string[];
export const OpsItemFilterValues = S.Array(S.String);
export type ParametersFilterValueList = string[];
export const ParametersFilterValueList = S.Array(S.String);
export type OpsFilterValueList = string[];
export const OpsFilterValueList = S.Array(
  S.String.pipe(T.XmlName("FilterValue")),
);
export type DocumentKeyValuesFilterValues = string[];
export const DocumentKeyValuesFilterValues = S.Array(S.String);
export type NodeFilterValueList = string[];
export const NodeFilterValueList = S.Array(
  S.String.pipe(T.XmlName("FilterValue")),
);
export type OpsItemEventFilterValues = string[];
export const OpsItemEventFilterValues = S.Array(S.String);
export type OpsItemRelatedItemsFilterValues = string[];
export const OpsItemRelatedItemsFilterValues = S.Array(S.String);
export type OpsMetadataFilterValueList = string[];
export const OpsMetadataFilterValueList = S.Array(S.String);
export type SessionManagerParameterValueList = string[];
export const SessionManagerParameterValueList = S.Array(S.String);
export interface RegistrationMetadataItem {
  Key: string;
  Value: string;
}
export const RegistrationMetadataItem = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "RegistrationMetadataItem",
}) as any as S.Schema<RegistrationMetadataItem>;
export type RegistrationMetadataList = RegistrationMetadataItem[];
export const RegistrationMetadataList = S.Array(RegistrationMetadataItem);
export interface CreateAssociationBatchRequestEntry {
  Name: string;
  InstanceId?: string;
  Parameters?: Parameters;
  AutomationTargetParameterName?: string;
  DocumentVersion?: string;
  Targets?: Targets;
  ScheduleExpression?: string;
  OutputLocation?: InstanceAssociationOutputLocation;
  AssociationName?: string;
  MaxErrors?: string;
  MaxConcurrency?: string;
  ComplianceSeverity?: string;
  SyncCompliance?: string;
  ApplyOnlyAtCronInterval?: boolean;
  CalendarNames?: CalendarNameOrARNList;
  TargetLocations?: TargetLocations;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
  AlarmConfiguration?: AlarmConfiguration;
}
export const CreateAssociationBatchRequestEntry = S.suspend(() =>
  S.Struct({
    Name: S.String,
    InstanceId: S.optional(S.String),
    Parameters: S.optional(Parameters),
    AutomationTargetParameterName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Targets: S.optional(Targets),
    ScheduleExpression: S.optional(S.String),
    OutputLocation: S.optional(InstanceAssociationOutputLocation),
    AssociationName: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    ComplianceSeverity: S.optional(S.String),
    SyncCompliance: S.optional(S.String),
    ApplyOnlyAtCronInterval: S.optional(S.Boolean),
    CalendarNames: S.optional(CalendarNameOrARNList),
    TargetLocations: S.optional(TargetLocations),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }),
).annotations({
  identifier: "CreateAssociationBatchRequestEntry",
}) as any as S.Schema<CreateAssociationBatchRequestEntry>;
export type CreateAssociationBatchRequestEntries =
  CreateAssociationBatchRequestEntry[];
export const CreateAssociationBatchRequestEntries = S.Array(
  CreateAssociationBatchRequestEntry.pipe(T.XmlName("entries")).annotations({
    identifier: "CreateAssociationBatchRequestEntry",
  }),
);
export interface DocumentRequires {
  Name: string;
  Version?: string;
  RequireType?: string;
  VersionName?: string;
}
export const DocumentRequires = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Version: S.optional(S.String),
    RequireType: S.optional(S.String),
    VersionName: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentRequires",
}) as any as S.Schema<DocumentRequires>;
export type DocumentRequiresList = DocumentRequires[];
export const DocumentRequiresList = S.Array(DocumentRequires);
export interface DescribeActivationsFilter {
  FilterKey?: string;
  FilterValues?: StringList;
}
export const DescribeActivationsFilter = S.suspend(() =>
  S.Struct({
    FilterKey: S.optional(S.String),
    FilterValues: S.optional(StringList),
  }),
).annotations({
  identifier: "DescribeActivationsFilter",
}) as any as S.Schema<DescribeActivationsFilter>;
export type DescribeActivationsFilterList = DescribeActivationsFilter[];
export const DescribeActivationsFilterList = S.Array(DescribeActivationsFilter);
export interface AssociationExecutionFilter {
  Key: string;
  Value: string;
  Type: string;
}
export const AssociationExecutionFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String, Type: S.String }),
).annotations({
  identifier: "AssociationExecutionFilter",
}) as any as S.Schema<AssociationExecutionFilter>;
export type AssociationExecutionFilterList = AssociationExecutionFilter[];
export const AssociationExecutionFilterList = S.Array(
  AssociationExecutionFilter.pipe(
    T.XmlName("AssociationExecutionFilter"),
  ).annotations({ identifier: "AssociationExecutionFilter" }),
);
export interface AssociationExecutionTargetsFilter {
  Key: string;
  Value: string;
}
export const AssociationExecutionTargetsFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "AssociationExecutionTargetsFilter",
}) as any as S.Schema<AssociationExecutionTargetsFilter>;
export type AssociationExecutionTargetsFilterList =
  AssociationExecutionTargetsFilter[];
export const AssociationExecutionTargetsFilterList = S.Array(
  AssociationExecutionTargetsFilter.pipe(
    T.XmlName("AssociationExecutionTargetsFilter"),
  ).annotations({ identifier: "AssociationExecutionTargetsFilter" }),
);
export interface AutomationExecutionFilter {
  Key: string;
  Values: AutomationExecutionFilterValueList;
}
export const AutomationExecutionFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: AutomationExecutionFilterValueList }),
).annotations({
  identifier: "AutomationExecutionFilter",
}) as any as S.Schema<AutomationExecutionFilter>;
export type AutomationExecutionFilterList = AutomationExecutionFilter[];
export const AutomationExecutionFilterList = S.Array(AutomationExecutionFilter);
export interface StepExecutionFilter {
  Key: string;
  Values: StepExecutionFilterValueList;
}
export const StepExecutionFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: StepExecutionFilterValueList }),
).annotations({
  identifier: "StepExecutionFilter",
}) as any as S.Schema<StepExecutionFilter>;
export type StepExecutionFilterList = StepExecutionFilter[];
export const StepExecutionFilterList = S.Array(StepExecutionFilter);
export interface InstanceInformationFilter {
  key: string;
  valueSet: InstanceInformationFilterValueSet;
}
export const InstanceInformationFilter = S.suspend(() =>
  S.Struct({ key: S.String, valueSet: InstanceInformationFilterValueSet }),
).annotations({
  identifier: "InstanceInformationFilter",
}) as any as S.Schema<InstanceInformationFilter>;
export type InstanceInformationFilterList = InstanceInformationFilter[];
export const InstanceInformationFilterList = S.Array(
  InstanceInformationFilter.pipe(
    T.XmlName("InstanceInformationFilter"),
  ).annotations({ identifier: "InstanceInformationFilter" }),
);
export interface InstanceInformationStringFilter {
  Key: string;
  Values: InstanceInformationFilterValueSet;
}
export const InstanceInformationStringFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: InstanceInformationFilterValueSet }),
).annotations({
  identifier: "InstanceInformationStringFilter",
}) as any as S.Schema<InstanceInformationStringFilter>;
export type InstanceInformationStringFilterList =
  InstanceInformationStringFilter[];
export const InstanceInformationStringFilterList = S.Array(
  InstanceInformationStringFilter.pipe(
    T.XmlName("InstanceInformationStringFilter"),
  ).annotations({ identifier: "InstanceInformationStringFilter" }),
);
export interface InstancePatchStateFilter {
  Key: string;
  Values: InstancePatchStateFilterValues;
  Type: string;
}
export const InstancePatchStateFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: InstancePatchStateFilterValues,
    Type: S.String,
  }),
).annotations({
  identifier: "InstancePatchStateFilter",
}) as any as S.Schema<InstancePatchStateFilter>;
export type InstancePatchStateFilterList = InstancePatchStateFilter[];
export const InstancePatchStateFilterList = S.Array(InstancePatchStateFilter);
export interface InstancePropertyFilter {
  key: string;
  valueSet: InstancePropertyFilterValueSet;
}
export const InstancePropertyFilter = S.suspend(() =>
  S.Struct({ key: S.String, valueSet: InstancePropertyFilterValueSet }),
).annotations({
  identifier: "InstancePropertyFilter",
}) as any as S.Schema<InstancePropertyFilter>;
export type InstancePropertyFilterList = InstancePropertyFilter[];
export const InstancePropertyFilterList = S.Array(
  InstancePropertyFilter.pipe(T.XmlName("InstancePropertyFilter")).annotations({
    identifier: "InstancePropertyFilter",
  }),
);
export interface InstancePropertyStringFilter {
  Key: string;
  Values: InstancePropertyFilterValueSet;
  Operator?: string;
}
export const InstancePropertyStringFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: InstancePropertyFilterValueSet,
    Operator: S.optional(S.String),
  }),
).annotations({
  identifier: "InstancePropertyStringFilter",
}) as any as S.Schema<InstancePropertyStringFilter>;
export type InstancePropertyStringFilterList = InstancePropertyStringFilter[];
export const InstancePropertyStringFilterList = S.Array(
  InstancePropertyStringFilter.pipe(
    T.XmlName("InstancePropertyStringFilter"),
  ).annotations({ identifier: "InstancePropertyStringFilter" }),
);
export interface OpsItemFilter {
  Key: string;
  Values: OpsItemFilterValues;
  Operator: string;
}
export const OpsItemFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: OpsItemFilterValues, Operator: S.String }),
).annotations({
  identifier: "OpsItemFilter",
}) as any as S.Schema<OpsItemFilter>;
export type OpsItemFilters = OpsItemFilter[];
export const OpsItemFilters = S.Array(OpsItemFilter);
export interface ParametersFilter {
  Key: string;
  Values: ParametersFilterValueList;
}
export const ParametersFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: ParametersFilterValueList }),
).annotations({
  identifier: "ParametersFilter",
}) as any as S.Schema<ParametersFilter>;
export type ParametersFilterList = ParametersFilter[];
export const ParametersFilterList = S.Array(ParametersFilter);
export interface SessionFilter {
  key: string;
  value: string;
}
export const SessionFilter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "SessionFilter",
}) as any as S.Schema<SessionFilter>;
export type SessionFilterList = SessionFilter[];
export const SessionFilterList = S.Array(SessionFilter);
export interface BaselineOverride {
  OperatingSystem?: string;
  GlobalFilters?: PatchFilterGroup;
  ApprovalRules?: PatchRuleGroup;
  ApprovedPatches?: PatchIdList;
  ApprovedPatchesComplianceLevel?: string;
  RejectedPatches?: PatchIdList;
  RejectedPatchesAction?: string;
  ApprovedPatchesEnableNonSecurity?: boolean;
  Sources?: PatchSourceList;
  AvailableSecurityUpdatesComplianceStatus?: string;
}
export const BaselineOverride = S.suspend(() =>
  S.Struct({
    OperatingSystem: S.optional(S.String),
    GlobalFilters: S.optional(PatchFilterGroup),
    ApprovalRules: S.optional(PatchRuleGroup),
    ApprovedPatches: S.optional(PatchIdList),
    ApprovedPatchesComplianceLevel: S.optional(S.String),
    RejectedPatches: S.optional(PatchIdList),
    RejectedPatchesAction: S.optional(S.String),
    ApprovedPatchesEnableNonSecurity: S.optional(S.Boolean),
    Sources: S.optional(PatchSourceList),
    AvailableSecurityUpdatesComplianceStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "BaselineOverride",
}) as any as S.Schema<BaselineOverride>;
export interface ResultAttribute {
  TypeName: string;
}
export const ResultAttribute = S.suspend(() =>
  S.Struct({ TypeName: S.String }),
).annotations({
  identifier: "ResultAttribute",
}) as any as S.Schema<ResultAttribute>;
export type ResultAttributeList = ResultAttribute[];
export const ResultAttributeList = S.Array(
  ResultAttribute.pipe(T.XmlName("ResultAttribute")).annotations({
    identifier: "ResultAttribute",
  }),
);
export type MaintenanceWindowExecutionTaskIdList = string[];
export const MaintenanceWindowExecutionTaskIdList = S.Array(S.String);
export type MaintenanceWindowTaskParametersList =
  MaintenanceWindowTaskParameters[];
export const MaintenanceWindowTaskParametersList = S.Array(
  MaintenanceWindowTaskParameters,
);
export interface OpsFilter {
  Key: string;
  Values: OpsFilterValueList;
  Type?: string;
}
export const OpsFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: OpsFilterValueList,
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "OpsFilter" }) as any as S.Schema<OpsFilter>;
export type OpsFilterList = OpsFilter[];
export const OpsFilterList = S.Array(
  OpsFilter.pipe(T.XmlName("OpsFilter")).annotations({
    identifier: "OpsFilter",
  }),
);
export interface OpsResultAttribute {
  TypeName: string;
}
export const OpsResultAttribute = S.suspend(() =>
  S.Struct({ TypeName: S.String }),
).annotations({
  identifier: "OpsResultAttribute",
}) as any as S.Schema<OpsResultAttribute>;
export type OpsResultAttributeList = OpsResultAttribute[];
export const OpsResultAttributeList = S.Array(
  OpsResultAttribute.pipe(T.XmlName("OpsResultAttribute")).annotations({
    identifier: "OpsResultAttribute",
  }),
);
export interface Parameter {
  Name?: string;
  Type?: string;
  Value?: string | Redacted.Redacted<string>;
  Version?: number;
  Selector?: string;
  SourceResult?: string;
  LastModifiedDate?: Date;
  ARN?: string;
  DataType?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Value: S.optional(SensitiveString),
    Version: S.optional(S.Number),
    Selector: S.optional(S.String),
    SourceResult: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ARN: S.optional(S.String),
    DataType: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParameterList = Parameter[];
export const ParameterList = S.Array(Parameter);
export type PatchGroupList = string[];
export const PatchGroupList = S.Array(S.String);
export interface AssociationFilter {
  key: string;
  value: string;
}
export const AssociationFilter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "AssociationFilter",
}) as any as S.Schema<AssociationFilter>;
export type AssociationFilterList = AssociationFilter[];
export const AssociationFilterList = S.Array(
  AssociationFilter.pipe(T.XmlName("AssociationFilter")).annotations({
    identifier: "AssociationFilter",
  }),
);
export interface DocumentFilter {
  key: string;
  value: string;
}
export const DocumentFilter = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "DocumentFilter",
}) as any as S.Schema<DocumentFilter>;
export type DocumentFilterList = DocumentFilter[];
export const DocumentFilterList = S.Array(
  DocumentFilter.pipe(T.XmlName("DocumentFilter")).annotations({
    identifier: "DocumentFilter",
  }),
);
export interface DocumentKeyValuesFilter {
  Key?: string;
  Values?: DocumentKeyValuesFilterValues;
}
export const DocumentKeyValuesFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(DocumentKeyValuesFilterValues),
  }),
).annotations({
  identifier: "DocumentKeyValuesFilter",
}) as any as S.Schema<DocumentKeyValuesFilter>;
export type DocumentKeyValuesFilterList = DocumentKeyValuesFilter[];
export const DocumentKeyValuesFilterList = S.Array(DocumentKeyValuesFilter);
export interface NodeFilter {
  Key: string;
  Values: NodeFilterValueList;
  Type?: string;
}
export const NodeFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: NodeFilterValueList,
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "NodeFilter" }) as any as S.Schema<NodeFilter>;
export type NodeFilterList = NodeFilter[];
export const NodeFilterList = S.Array(
  NodeFilter.pipe(T.XmlName("NodeFilter")).annotations({
    identifier: "NodeFilter",
  }),
);
export interface NodeAggregator {
  AggregatorType: string;
  TypeName: string;
  AttributeName: string;
  Aggregators?: NodeAggregatorList;
}
export const NodeAggregator = S.suspend(() =>
  S.Struct({
    AggregatorType: S.String,
    TypeName: S.String,
    AttributeName: S.String,
    Aggregators: S.optional(
      S.suspend(() => NodeAggregatorList).annotations({
        identifier: "NodeAggregatorList",
      }),
    ),
  }),
).annotations({
  identifier: "NodeAggregator",
}) as any as S.Schema<NodeAggregator>;
export type NodeAggregatorList = NodeAggregator[];
export const NodeAggregatorList = S.Array(
  S.suspend((): S.Schema<NodeAggregator, any> => NodeAggregator)
    .annotations({ identifier: "NodeAggregator" })
    .pipe(T.XmlName("NodeAggregator"))
    .annotations({ identifier: "NodeAggregator" }),
) as any as S.Schema<NodeAggregatorList>;
export interface OpsItemEventFilter {
  Key: string;
  Values: OpsItemEventFilterValues;
  Operator: string;
}
export const OpsItemEventFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: OpsItemEventFilterValues,
    Operator: S.String,
  }),
).annotations({
  identifier: "OpsItemEventFilter",
}) as any as S.Schema<OpsItemEventFilter>;
export type OpsItemEventFilters = OpsItemEventFilter[];
export const OpsItemEventFilters = S.Array(OpsItemEventFilter);
export interface OpsItemRelatedItemsFilter {
  Key: string;
  Values: OpsItemRelatedItemsFilterValues;
  Operator: string;
}
export const OpsItemRelatedItemsFilter = S.suspend(() =>
  S.Struct({
    Key: S.String,
    Values: OpsItemRelatedItemsFilterValues,
    Operator: S.String,
  }),
).annotations({
  identifier: "OpsItemRelatedItemsFilter",
}) as any as S.Schema<OpsItemRelatedItemsFilter>;
export type OpsItemRelatedItemsFilters = OpsItemRelatedItemsFilter[];
export const OpsItemRelatedItemsFilters = S.Array(OpsItemRelatedItemsFilter);
export interface OpsMetadataFilter {
  Key: string;
  Values: OpsMetadataFilterValueList;
}
export const OpsMetadataFilter = S.suspend(() =>
  S.Struct({ Key: S.String, Values: OpsMetadataFilterValueList }),
).annotations({
  identifier: "OpsMetadataFilter",
}) as any as S.Schema<OpsMetadataFilter>;
export type OpsMetadataFilterList = OpsMetadataFilter[];
export const OpsMetadataFilterList = S.Array(OpsMetadataFilter);
export interface ComplianceExecutionSummary {
  ExecutionTime: Date;
  ExecutionId?: string;
  ExecutionType?: string;
}
export const ComplianceExecutionSummary = S.suspend(() =>
  S.Struct({
    ExecutionTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ExecutionId: S.optional(S.String),
    ExecutionType: S.optional(S.String),
  }),
).annotations({
  identifier: "ComplianceExecutionSummary",
}) as any as S.Schema<ComplianceExecutionSummary>;
export interface Runbook {
  DocumentName: string;
  DocumentVersion?: string;
  Parameters?: AutomationParameterMap;
  TargetParameterName?: string;
  Targets?: Targets;
  TargetMaps?: TargetMaps;
  MaxConcurrency?: string;
  MaxErrors?: string;
  TargetLocations?: TargetLocations;
}
export const Runbook = S.suspend(() =>
  S.Struct({
    DocumentName: S.String,
    DocumentVersion: S.optional(S.String),
    Parameters: S.optional(AutomationParameterMap),
    TargetParameterName: S.optional(S.String),
    Targets: S.optional(Targets),
    TargetMaps: S.optional(TargetMaps),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    TargetLocations: S.optional(TargetLocations),
  }),
).annotations({ identifier: "Runbook" }) as any as S.Schema<Runbook>;
export type Runbooks = Runbook[];
export const Runbooks = S.Array(Runbook);
export type SessionManagerParameters = {
  [key: string]: SessionManagerParameterValueList;
};
export const SessionManagerParameters = S.Record({
  key: S.String,
  value: SessionManagerParameterValueList,
});
export interface AssociationStatus {
  Date: Date;
  Name: string;
  Message: string;
  AdditionalInfo?: string;
}
export const AssociationStatus = S.suspend(() =>
  S.Struct({
    Date: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Name: S.String,
    Message: S.String,
    AdditionalInfo: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociationStatus",
}) as any as S.Schema<AssociationStatus>;
export interface AddTagsToResourceRequest {
  ResourceType: string;
  ResourceId: string;
  Tags: TagList;
}
export const AddTagsToResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    ResourceId: S.String,
    Tags: TagList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsToResourceRequest",
}) as any as S.Schema<AddTagsToResourceRequest>;
export interface AddTagsToResourceResult {}
export const AddTagsToResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToResourceResult",
}) as any as S.Schema<AddTagsToResourceResult>;
export interface AssociateOpsItemRelatedItemResponse {
  AssociationId?: string;
}
export const AssociateOpsItemRelatedItemResponse = S.suspend(() =>
  S.Struct({ AssociationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AssociateOpsItemRelatedItemResponse",
}) as any as S.Schema<AssociateOpsItemRelatedItemResponse>;
export interface CancelMaintenanceWindowExecutionResult {
  WindowExecutionId?: string;
}
export const CancelMaintenanceWindowExecutionResult = S.suspend(() =>
  S.Struct({ WindowExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelMaintenanceWindowExecutionResult",
}) as any as S.Schema<CancelMaintenanceWindowExecutionResult>;
export interface CreateActivationRequest {
  Description?: string;
  DefaultInstanceName?: string;
  IamRole: string;
  RegistrationLimit?: number;
  ExpirationDate?: Date;
  Tags?: TagList;
  RegistrationMetadata?: RegistrationMetadataList;
}
export const CreateActivationRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    DefaultInstanceName: S.optional(S.String),
    IamRole: S.String,
    RegistrationLimit: S.optional(S.Number),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagList),
    RegistrationMetadata: S.optional(RegistrationMetadataList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateActivationRequest",
}) as any as S.Schema<CreateActivationRequest>;
export interface CreateAssociationBatchRequest {
  Entries: CreateAssociationBatchRequestEntries;
}
export const CreateAssociationBatchRequest = S.suspend(() =>
  S.Struct({ Entries: CreateAssociationBatchRequestEntries }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssociationBatchRequest",
}) as any as S.Schema<CreateAssociationBatchRequest>;
export interface CreateDocumentRequest {
  Content: string;
  Requires?: DocumentRequiresList;
  Attachments?: AttachmentsSourceList;
  Name: string;
  DisplayName?: string;
  VersionName?: string;
  DocumentType?: string;
  DocumentFormat?: string;
  TargetType?: string;
  Tags?: TagList;
}
export const CreateDocumentRequest = S.suspend(() =>
  S.Struct({
    Content: S.String,
    Requires: S.optional(DocumentRequiresList),
    Attachments: S.optional(AttachmentsSourceList),
    Name: S.String,
    DisplayName: S.optional(S.String),
    VersionName: S.optional(S.String),
    DocumentType: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
    TargetType: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDocumentRequest",
}) as any as S.Schema<CreateDocumentRequest>;
export interface CreateMaintenanceWindowResult {
  WindowId?: string;
}
export const CreateMaintenanceWindowResult = S.suspend(() =>
  S.Struct({ WindowId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateMaintenanceWindowResult",
}) as any as S.Schema<CreateMaintenanceWindowResult>;
export interface DeleteMaintenanceWindowResult {
  WindowId?: string;
}
export const DeleteMaintenanceWindowResult = S.suspend(() =>
  S.Struct({ WindowId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteMaintenanceWindowResult",
}) as any as S.Schema<DeleteMaintenanceWindowResult>;
export interface DeleteParametersResult {
  DeletedParameters?: ParameterNameList;
  InvalidParameters?: ParameterNameList;
}
export const DeleteParametersResult = S.suspend(() =>
  S.Struct({
    DeletedParameters: S.optional(ParameterNameList),
    InvalidParameters: S.optional(ParameterNameList),
  }).pipe(ns),
).annotations({
  identifier: "DeleteParametersResult",
}) as any as S.Schema<DeleteParametersResult>;
export interface DeletePatchBaselineResult {
  BaselineId?: string;
}
export const DeletePatchBaselineResult = S.suspend(() =>
  S.Struct({ BaselineId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeletePatchBaselineResult",
}) as any as S.Schema<DeletePatchBaselineResult>;
export interface DeregisterPatchBaselineForPatchGroupResult {
  BaselineId?: string;
  PatchGroup?: string;
}
export const DeregisterPatchBaselineForPatchGroupResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    PatchGroup: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeregisterPatchBaselineForPatchGroupResult",
}) as any as S.Schema<DeregisterPatchBaselineForPatchGroupResult>;
export interface DeregisterTargetFromMaintenanceWindowResult {
  WindowId?: string;
  WindowTargetId?: string;
}
export const DeregisterTargetFromMaintenanceWindowResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTargetId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeregisterTargetFromMaintenanceWindowResult",
}) as any as S.Schema<DeregisterTargetFromMaintenanceWindowResult>;
export interface DeregisterTaskFromMaintenanceWindowResult {
  WindowId?: string;
  WindowTaskId?: string;
}
export const DeregisterTaskFromMaintenanceWindowResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTaskId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeregisterTaskFromMaintenanceWindowResult",
}) as any as S.Schema<DeregisterTaskFromMaintenanceWindowResult>;
export interface DescribeActivationsRequest {
  Filters?: DescribeActivationsFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeActivationsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(DescribeActivationsFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActivationsRequest",
}) as any as S.Schema<DescribeActivationsRequest>;
export interface DescribeAssociationExecutionsRequest {
  AssociationId: string;
  Filters?: AssociationExecutionFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAssociationExecutionsRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    Filters: S.optional(AssociationExecutionFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssociationExecutionsRequest",
}) as any as S.Schema<DescribeAssociationExecutionsRequest>;
export interface DescribeAssociationExecutionTargetsRequest {
  AssociationId: string;
  ExecutionId: string;
  Filters?: AssociationExecutionTargetsFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAssociationExecutionTargetsRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    ExecutionId: S.String,
    Filters: S.optional(AssociationExecutionTargetsFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAssociationExecutionTargetsRequest",
}) as any as S.Schema<DescribeAssociationExecutionTargetsRequest>;
export interface DescribeAutomationExecutionsRequest {
  Filters?: AutomationExecutionFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAutomationExecutionsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(AutomationExecutionFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAutomationExecutionsRequest",
}) as any as S.Schema<DescribeAutomationExecutionsRequest>;
export interface DescribeAutomationStepExecutionsRequest {
  AutomationExecutionId: string;
  Filters?: StepExecutionFilterList;
  NextToken?: string;
  MaxResults?: number;
  ReverseOrder?: boolean;
}
export const DescribeAutomationStepExecutionsRequest = S.suspend(() =>
  S.Struct({
    AutomationExecutionId: S.String,
    Filters: S.optional(StepExecutionFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ReverseOrder: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAutomationStepExecutionsRequest",
}) as any as S.Schema<DescribeAutomationStepExecutionsRequest>;
export interface DescribeAvailablePatchesRequest {
  Filters?: PatchOrchestratorFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeAvailablePatchesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(PatchOrchestratorFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAvailablePatchesRequest",
}) as any as S.Schema<DescribeAvailablePatchesRequest>;
export interface DescribeInstanceInformationRequest {
  InstanceInformationFilterList?: InstanceInformationFilterList;
  Filters?: InstanceInformationStringFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeInstanceInformationRequest = S.suspend(() =>
  S.Struct({
    InstanceInformationFilterList: S.optional(InstanceInformationFilterList),
    Filters: S.optional(InstanceInformationStringFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstanceInformationRequest",
}) as any as S.Schema<DescribeInstanceInformationRequest>;
export interface DescribeInstancePatchStatesForPatchGroupRequest {
  PatchGroup: string;
  Filters?: InstancePatchStateFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeInstancePatchStatesForPatchGroupRequest = S.suspend(() =>
  S.Struct({
    PatchGroup: S.String,
    Filters: S.optional(InstancePatchStateFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstancePatchStatesForPatchGroupRequest",
}) as any as S.Schema<DescribeInstancePatchStatesForPatchGroupRequest>;
export interface DescribeInstancePropertiesRequest {
  InstancePropertyFilterList?: InstancePropertyFilterList;
  FiltersWithOperator?: InstancePropertyStringFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeInstancePropertiesRequest = S.suspend(() =>
  S.Struct({
    InstancePropertyFilterList: S.optional(InstancePropertyFilterList),
    FiltersWithOperator: S.optional(InstancePropertyStringFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstancePropertiesRequest",
}) as any as S.Schema<DescribeInstancePropertiesRequest>;
export interface DescribeMaintenanceWindowExecutionsRequest {
  WindowId: string;
  Filters?: MaintenanceWindowFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionsRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    Filters: S.optional(MaintenanceWindowFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMaintenanceWindowExecutionsRequest",
}) as any as S.Schema<DescribeMaintenanceWindowExecutionsRequest>;
export interface DescribeOpsItemsRequest {
  OpsItemFilters?: OpsItemFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeOpsItemsRequest = S.suspend(() =>
  S.Struct({
    OpsItemFilters: S.optional(OpsItemFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOpsItemsRequest",
}) as any as S.Schema<DescribeOpsItemsRequest>;
export interface DescribeParametersRequest {
  Filters?: ParametersFilterList;
  ParameterFilters?: ParameterStringFilterList;
  MaxResults?: number;
  NextToken?: string;
  Shared?: boolean;
}
export const DescribeParametersRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ParametersFilterList),
    ParameterFilters: S.optional(ParameterStringFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Shared: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeParametersRequest",
}) as any as S.Schema<DescribeParametersRequest>;
export interface DescribePatchGroupStateResult {
  Instances?: number;
  InstancesWithInstalledPatches?: number;
  InstancesWithInstalledOtherPatches?: number;
  InstancesWithInstalledPendingRebootPatches?: number;
  InstancesWithInstalledRejectedPatches?: number;
  InstancesWithMissingPatches?: number;
  InstancesWithFailedPatches?: number;
  InstancesWithNotApplicablePatches?: number;
  InstancesWithUnreportedNotApplicablePatches?: number;
  InstancesWithCriticalNonCompliantPatches?: number;
  InstancesWithSecurityNonCompliantPatches?: number;
  InstancesWithOtherNonCompliantPatches?: number;
  InstancesWithAvailableSecurityUpdates?: number;
}
export const DescribePatchGroupStateResult = S.suspend(() =>
  S.Struct({
    Instances: S.optional(S.Number),
    InstancesWithInstalledPatches: S.optional(S.Number),
    InstancesWithInstalledOtherPatches: S.optional(S.Number),
    InstancesWithInstalledPendingRebootPatches: S.optional(S.Number),
    InstancesWithInstalledRejectedPatches: S.optional(S.Number),
    InstancesWithMissingPatches: S.optional(S.Number),
    InstancesWithFailedPatches: S.optional(S.Number),
    InstancesWithNotApplicablePatches: S.optional(S.Number),
    InstancesWithUnreportedNotApplicablePatches: S.optional(S.Number),
    InstancesWithCriticalNonCompliantPatches: S.optional(S.Number),
    InstancesWithSecurityNonCompliantPatches: S.optional(S.Number),
    InstancesWithOtherNonCompliantPatches: S.optional(S.Number),
    InstancesWithAvailableSecurityUpdates: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribePatchGroupStateResult",
}) as any as S.Schema<DescribePatchGroupStateResult>;
export interface DescribeSessionsRequest {
  State: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: SessionFilterList;
}
export const DescribeSessionsRequest = S.suspend(() =>
  S.Struct({
    State: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(SessionFilterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSessionsRequest",
}) as any as S.Schema<DescribeSessionsRequest>;
export interface GetCalendarStateResponse {
  State?: string;
  AtTime?: string;
  NextTransitionTime?: string;
}
export const GetCalendarStateResponse = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    AtTime: S.optional(S.String),
    NextTransitionTime: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetCalendarStateResponse",
}) as any as S.Schema<GetCalendarStateResponse>;
export interface GetCommandInvocationResult {
  CommandId?: string;
  InstanceId?: string;
  Comment?: string;
  DocumentName?: string;
  DocumentVersion?: string;
  PluginName?: string;
  ResponseCode?: number;
  ExecutionStartDateTime?: string;
  ExecutionElapsedTime?: string;
  ExecutionEndDateTime?: string;
  Status?: string;
  StatusDetails?: string;
  StandardOutputContent?: string;
  StandardOutputUrl?: string;
  StandardErrorContent?: string;
  StandardErrorUrl?: string;
  CloudWatchOutputConfig?: CloudWatchOutputConfig;
}
export const GetCommandInvocationResult = S.suspend(() =>
  S.Struct({
    CommandId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    Comment: S.optional(S.String),
    DocumentName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    PluginName: S.optional(S.String),
    ResponseCode: S.optional(S.Number),
    ExecutionStartDateTime: S.optional(S.String),
    ExecutionElapsedTime: S.optional(S.String),
    ExecutionEndDateTime: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StandardOutputContent: S.optional(S.String),
    StandardOutputUrl: S.optional(S.String),
    StandardErrorContent: S.optional(S.String),
    StandardErrorUrl: S.optional(S.String),
    CloudWatchOutputConfig: S.optional(CloudWatchOutputConfig),
  }).pipe(ns),
).annotations({
  identifier: "GetCommandInvocationResult",
}) as any as S.Schema<GetCommandInvocationResult>;
export interface GetConnectionStatusResponse {
  Target?: string;
  Status?: string;
}
export const GetConnectionStatusResponse = S.suspend(() =>
  S.Struct({ Target: S.optional(S.String), Status: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetConnectionStatusResponse",
}) as any as S.Schema<GetConnectionStatusResponse>;
export interface GetDefaultPatchBaselineResult {
  BaselineId?: string;
  OperatingSystem?: string;
}
export const GetDefaultPatchBaselineResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    OperatingSystem: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDefaultPatchBaselineResult",
}) as any as S.Schema<GetDefaultPatchBaselineResult>;
export interface GetDeployablePatchSnapshotForInstanceRequest {
  InstanceId: string;
  SnapshotId: string;
  BaselineOverride?: BaselineOverride;
  UseS3DualStackEndpoint?: boolean;
}
export const GetDeployablePatchSnapshotForInstanceRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    SnapshotId: S.String,
    BaselineOverride: S.optional(BaselineOverride),
    UseS3DualStackEndpoint: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeployablePatchSnapshotForInstanceRequest",
}) as any as S.Schema<GetDeployablePatchSnapshotForInstanceRequest>;
export interface GetMaintenanceWindowResult {
  WindowId?: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  StartDate?: string;
  EndDate?: string;
  Schedule?: string;
  ScheduleTimezone?: string;
  ScheduleOffset?: number;
  NextExecutionTime?: string;
  Duration?: number;
  Cutoff?: number;
  AllowUnassociatedTargets?: boolean;
  Enabled?: boolean;
  CreatedDate?: Date;
  ModifiedDate?: Date;
}
export const GetMaintenanceWindowResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Schedule: S.optional(S.String),
    ScheduleTimezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    NextExecutionTime: S.optional(S.String),
    Duration: S.optional(S.Number),
    Cutoff: S.optional(S.Number),
    AllowUnassociatedTargets: S.optional(S.Boolean),
    Enabled: S.optional(S.Boolean),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetMaintenanceWindowResult",
}) as any as S.Schema<GetMaintenanceWindowResult>;
export interface GetMaintenanceWindowExecutionResult {
  WindowExecutionId?: string;
  TaskIds?: MaintenanceWindowExecutionTaskIdList;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
}
export const GetMaintenanceWindowExecutionResult = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.optional(S.String),
    TaskIds: S.optional(MaintenanceWindowExecutionTaskIdList),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetMaintenanceWindowExecutionResult",
}) as any as S.Schema<GetMaintenanceWindowExecutionResult>;
export interface GetMaintenanceWindowExecutionTaskInvocationResult {
  WindowExecutionId?: string;
  TaskExecutionId?: string;
  InvocationId?: string;
  ExecutionId?: string;
  TaskType?: string;
  Parameters?: string | Redacted.Redacted<string>;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
  OwnerInformation?: string | Redacted.Redacted<string>;
  WindowTargetId?: string;
}
export const GetMaintenanceWindowExecutionTaskInvocationResult = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.optional(S.String),
    TaskExecutionId: S.optional(S.String),
    InvocationId: S.optional(S.String),
    ExecutionId: S.optional(S.String),
    TaskType: S.optional(S.String),
    Parameters: S.optional(SensitiveString),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OwnerInformation: S.optional(SensitiveString),
    WindowTargetId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetMaintenanceWindowExecutionTaskInvocationResult",
}) as any as S.Schema<GetMaintenanceWindowExecutionTaskInvocationResult>;
export interface GetMaintenanceWindowTaskResult {
  WindowId?: string;
  WindowTaskId?: string;
  Targets?: Targets;
  TaskArn?: string;
  ServiceRoleArn?: string;
  TaskType?: string;
  TaskParameters?: MaintenanceWindowTaskParameters;
  TaskInvocationParameters?: MaintenanceWindowTaskInvocationParameters;
  Priority?: number;
  MaxConcurrency?: string;
  MaxErrors?: string;
  LoggingInfo?: LoggingInfo;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  CutoffBehavior?: string;
  AlarmConfiguration?: AlarmConfiguration;
}
export const GetMaintenanceWindowTaskResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTaskId: S.optional(S.String),
    Targets: S.optional(Targets),
    TaskArn: S.optional(S.String),
    ServiceRoleArn: S.optional(S.String),
    TaskType: S.optional(S.String),
    TaskParameters: S.optional(MaintenanceWindowTaskParameters),
    TaskInvocationParameters: S.optional(
      MaintenanceWindowTaskInvocationParameters,
    ),
    Priority: S.optional(S.Number),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    LoggingInfo: S.optional(LoggingInfo),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CutoffBehavior: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "GetMaintenanceWindowTaskResult",
}) as any as S.Schema<GetMaintenanceWindowTaskResult>;
export interface GetOpsMetadataResult {
  ResourceId?: string;
  Metadata?: MetadataMap;
  NextToken?: string;
}
export const GetOpsMetadataResult = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    Metadata: S.optional(MetadataMap),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOpsMetadataResult",
}) as any as S.Schema<GetOpsMetadataResult>;
export interface GetParametersResult {
  Parameters?: ParameterList;
  InvalidParameters?: ParameterNameList;
}
export const GetParametersResult = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParameterList),
    InvalidParameters: S.optional(ParameterNameList),
  }).pipe(ns),
).annotations({
  identifier: "GetParametersResult",
}) as any as S.Schema<GetParametersResult>;
export interface GetParametersByPathResult {
  Parameters?: ParameterList;
  NextToken?: string;
}
export const GetParametersByPathResult = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParameterList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetParametersByPathResult",
}) as any as S.Schema<GetParametersByPathResult>;
export interface GetPatchBaselineResult {
  BaselineId?: string;
  Name?: string;
  OperatingSystem?: string;
  GlobalFilters?: PatchFilterGroup;
  ApprovalRules?: PatchRuleGroup;
  ApprovedPatches?: PatchIdList;
  ApprovedPatchesComplianceLevel?: string;
  ApprovedPatchesEnableNonSecurity?: boolean;
  RejectedPatches?: PatchIdList;
  RejectedPatchesAction?: string;
  PatchGroups?: PatchGroupList;
  CreatedDate?: Date;
  ModifiedDate?: Date;
  Description?: string;
  Sources?: PatchSourceList;
  AvailableSecurityUpdatesComplianceStatus?: string;
}
export const GetPatchBaselineResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    Name: S.optional(S.String),
    OperatingSystem: S.optional(S.String),
    GlobalFilters: S.optional(PatchFilterGroup),
    ApprovalRules: S.optional(PatchRuleGroup),
    ApprovedPatches: S.optional(PatchIdList),
    ApprovedPatchesComplianceLevel: S.optional(S.String),
    ApprovedPatchesEnableNonSecurity: S.optional(S.Boolean),
    RejectedPatches: S.optional(PatchIdList),
    RejectedPatchesAction: S.optional(S.String),
    PatchGroups: S.optional(PatchGroupList),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Sources: S.optional(PatchSourceList),
    AvailableSecurityUpdatesComplianceStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPatchBaselineResult",
}) as any as S.Schema<GetPatchBaselineResult>;
export interface GetPatchBaselineForPatchGroupResult {
  BaselineId?: string;
  PatchGroup?: string;
  OperatingSystem?: string;
}
export const GetPatchBaselineForPatchGroupResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    PatchGroup: S.optional(S.String),
    OperatingSystem: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPatchBaselineForPatchGroupResult",
}) as any as S.Schema<GetPatchBaselineForPatchGroupResult>;
export interface LabelParameterVersionResult {
  InvalidLabels?: ParameterLabelList;
  ParameterVersion?: number;
}
export const LabelParameterVersionResult = S.suspend(() =>
  S.Struct({
    InvalidLabels: S.optional(ParameterLabelList),
    ParameterVersion: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "LabelParameterVersionResult",
}) as any as S.Schema<LabelParameterVersionResult>;
export interface ListAssociationsRequest {
  AssociationFilterList?: AssociationFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAssociationsRequest = S.suspend(() =>
  S.Struct({
    AssociationFilterList: S.optional(AssociationFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociationsRequest",
}) as any as S.Schema<ListAssociationsRequest>;
export interface ListCommandInvocationsRequest {
  CommandId?: string;
  InstanceId?: string;
  MaxResults?: number;
  NextToken?: string;
  Filters?: CommandFilterList;
  Details?: boolean;
}
export const ListCommandInvocationsRequest = S.suspend(() =>
  S.Struct({
    CommandId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(CommandFilterList),
    Details: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCommandInvocationsRequest",
}) as any as S.Schema<ListCommandInvocationsRequest>;
export interface ListComplianceItemsRequest {
  Filters?: ComplianceStringFilterList;
  ResourceIds?: ComplianceResourceIdList;
  ResourceTypes?: ComplianceResourceTypeList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListComplianceItemsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ComplianceStringFilterList),
    ResourceIds: S.optional(ComplianceResourceIdList),
    ResourceTypes: S.optional(ComplianceResourceTypeList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListComplianceItemsRequest",
}) as any as S.Schema<ListComplianceItemsRequest>;
export interface ListDocumentsRequest {
  DocumentFilterList?: DocumentFilterList;
  Filters?: DocumentKeyValuesFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDocumentsRequest = S.suspend(() =>
  S.Struct({
    DocumentFilterList: S.optional(DocumentFilterList),
    Filters: S.optional(DocumentKeyValuesFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDocumentsRequest",
}) as any as S.Schema<ListDocumentsRequest>;
export type InventoryItemEntry = { [key: string]: string };
export const InventoryItemEntry = S.Record({ key: S.String, value: S.String });
export type InventoryItemEntryList = InventoryItemEntry[];
export const InventoryItemEntryList = S.Array(InventoryItemEntry);
export interface ListInventoryEntriesResult {
  TypeName?: string;
  InstanceId?: string;
  SchemaVersion?: string;
  CaptureTime?: string;
  Entries?: InventoryItemEntryList;
  NextToken?: string;
}
export const ListInventoryEntriesResult = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    InstanceId: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    CaptureTime: S.optional(S.String),
    Entries: S.optional(InventoryItemEntryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInventoryEntriesResult",
}) as any as S.Schema<ListInventoryEntriesResult>;
export interface ListNodesRequest {
  SyncName?: string;
  Filters?: NodeFilterList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListNodesRequest = S.suspend(() =>
  S.Struct({
    SyncName: S.optional(S.String),
    Filters: S.optional(NodeFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesRequest",
}) as any as S.Schema<ListNodesRequest>;
export interface ListNodesSummaryRequest {
  SyncName?: string;
  Filters?: NodeFilterList;
  Aggregators: NodeAggregatorList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListNodesSummaryRequest = S.suspend(() =>
  S.Struct({
    SyncName: S.optional(S.String),
    Filters: S.optional(NodeFilterList),
    Aggregators: NodeAggregatorList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesSummaryRequest",
}) as any as S.Schema<ListNodesSummaryRequest>;
export interface ListOpsItemEventsRequest {
  Filters?: OpsItemEventFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOpsItemEventsRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(OpsItemEventFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpsItemEventsRequest",
}) as any as S.Schema<ListOpsItemEventsRequest>;
export interface ListOpsItemRelatedItemsRequest {
  OpsItemId?: string;
  Filters?: OpsItemRelatedItemsFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOpsItemRelatedItemsRequest = S.suspend(() =>
  S.Struct({
    OpsItemId: S.optional(S.String),
    Filters: S.optional(OpsItemRelatedItemsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpsItemRelatedItemsRequest",
}) as any as S.Schema<ListOpsItemRelatedItemsRequest>;
export interface ListOpsMetadataRequest {
  Filters?: OpsMetadataFilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const ListOpsMetadataRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(OpsMetadataFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpsMetadataRequest",
}) as any as S.Schema<ListOpsMetadataRequest>;
export interface ListTagsForResourceResult {
  TagList?: TagList;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface PutParameterResult {
  Version?: number;
  Tier?: string;
}
export const PutParameterResult = S.suspend(() =>
  S.Struct({ Version: S.optional(S.Number), Tier: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "PutParameterResult",
}) as any as S.Schema<PutParameterResult>;
export interface PutResourcePolicyResponse {
  PolicyId?: string;
  PolicyHash?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    PolicyHash: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface RegisterDefaultPatchBaselineResult {
  BaselineId?: string;
}
export const RegisterDefaultPatchBaselineResult = S.suspend(() =>
  S.Struct({ BaselineId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterDefaultPatchBaselineResult",
}) as any as S.Schema<RegisterDefaultPatchBaselineResult>;
export interface RegisterPatchBaselineForPatchGroupResult {
  BaselineId?: string;
  PatchGroup?: string;
}
export const RegisterPatchBaselineForPatchGroupResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    PatchGroup: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RegisterPatchBaselineForPatchGroupResult",
}) as any as S.Schema<RegisterPatchBaselineForPatchGroupResult>;
export interface RegisterTargetWithMaintenanceWindowResult {
  WindowTargetId?: string;
}
export const RegisterTargetWithMaintenanceWindowResult = S.suspend(() =>
  S.Struct({ WindowTargetId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterTargetWithMaintenanceWindowResult",
}) as any as S.Schema<RegisterTargetWithMaintenanceWindowResult>;
export interface ServiceSetting {
  SettingId?: string;
  SettingValue?: string;
  LastModifiedDate?: Date;
  LastModifiedUser?: string;
  ARN?: string;
  Status?: string;
}
export const ServiceSetting = S.suspend(() =>
  S.Struct({
    SettingId: S.optional(S.String),
    SettingValue: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedUser: S.optional(S.String),
    ARN: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceSetting",
}) as any as S.Schema<ServiceSetting>;
export interface ResetServiceSettingResult {
  ServiceSetting?: ServiceSetting;
}
export const ResetServiceSettingResult = S.suspend(() =>
  S.Struct({ ServiceSetting: S.optional(ServiceSetting) }).pipe(ns),
).annotations({
  identifier: "ResetServiceSettingResult",
}) as any as S.Schema<ResetServiceSettingResult>;
export interface ResumeSessionResponse {
  SessionId?: string;
  TokenValue?: string;
  StreamUrl?: string;
}
export const ResumeSessionResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    TokenValue: S.optional(S.String),
    StreamUrl: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ResumeSessionResponse",
}) as any as S.Schema<ResumeSessionResponse>;
export interface SendAutomationSignalRequest {
  AutomationExecutionId: string;
  SignalType: string;
  Payload?: AutomationParameterMap;
}
export const SendAutomationSignalRequest = S.suspend(() =>
  S.Struct({
    AutomationExecutionId: S.String,
    SignalType: S.String,
    Payload: S.optional(AutomationParameterMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendAutomationSignalRequest",
}) as any as S.Schema<SendAutomationSignalRequest>;
export interface SendAutomationSignalResult {}
export const SendAutomationSignalResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SendAutomationSignalResult",
}) as any as S.Schema<SendAutomationSignalResult>;
export interface SendCommandRequest {
  InstanceIds?: InstanceIdList;
  Targets?: Targets;
  DocumentName: string;
  DocumentVersion?: string;
  DocumentHash?: string;
  DocumentHashType?: string;
  TimeoutSeconds?: number;
  Comment?: string;
  Parameters?: Parameters;
  OutputS3Region?: string;
  OutputS3BucketName?: string;
  OutputS3KeyPrefix?: string;
  MaxConcurrency?: string;
  MaxErrors?: string;
  ServiceRoleArn?: string;
  NotificationConfig?: NotificationConfig;
  CloudWatchOutputConfig?: CloudWatchOutputConfig;
  AlarmConfiguration?: AlarmConfiguration;
}
export const SendCommandRequest = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIdList),
    Targets: S.optional(Targets),
    DocumentName: S.String,
    DocumentVersion: S.optional(S.String),
    DocumentHash: S.optional(S.String),
    DocumentHashType: S.optional(S.String),
    TimeoutSeconds: S.optional(S.Number),
    Comment: S.optional(S.String),
    Parameters: S.optional(Parameters),
    OutputS3Region: S.optional(S.String),
    OutputS3BucketName: S.optional(S.String),
    OutputS3KeyPrefix: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    ServiceRoleArn: S.optional(S.String),
    NotificationConfig: S.optional(NotificationConfig),
    CloudWatchOutputConfig: S.optional(CloudWatchOutputConfig),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendCommandRequest",
}) as any as S.Schema<SendCommandRequest>;
export interface StartAccessRequestResponse {
  AccessRequestId?: string;
}
export const StartAccessRequestResponse = S.suspend(() =>
  S.Struct({ AccessRequestId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartAccessRequestResponse",
}) as any as S.Schema<StartAccessRequestResponse>;
export interface StartAutomationExecutionResult {
  AutomationExecutionId?: string;
}
export const StartAutomationExecutionResult = S.suspend(() =>
  S.Struct({ AutomationExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartAutomationExecutionResult",
}) as any as S.Schema<StartAutomationExecutionResult>;
export interface StartChangeRequestExecutionRequest {
  ScheduledTime?: Date;
  DocumentName: string;
  DocumentVersion?: string;
  Parameters?: AutomationParameterMap;
  ChangeRequestName?: string;
  ClientToken?: string;
  AutoApprove?: boolean;
  Runbooks: Runbooks;
  Tags?: TagList;
  ScheduledEndTime?: Date;
  ChangeDetails?: string;
}
export const StartChangeRequestExecutionRequest = S.suspend(() =>
  S.Struct({
    ScheduledTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DocumentName: S.String,
    DocumentVersion: S.optional(S.String),
    Parameters: S.optional(AutomationParameterMap),
    ChangeRequestName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    AutoApprove: S.optional(S.Boolean),
    Runbooks: Runbooks,
    Tags: S.optional(TagList),
    ScheduledEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ChangeDetails: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartChangeRequestExecutionRequest",
}) as any as S.Schema<StartChangeRequestExecutionRequest>;
export interface StartSessionRequest {
  Target: string;
  DocumentName?: string;
  Reason?: string;
  Parameters?: SessionManagerParameters;
}
export const StartSessionRequest = S.suspend(() =>
  S.Struct({
    Target: S.String,
    DocumentName: S.optional(S.String),
    Reason: S.optional(S.String),
    Parameters: S.optional(SessionManagerParameters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSessionRequest",
}) as any as S.Schema<StartSessionRequest>;
export interface TerminateSessionResponse {
  SessionId?: string;
}
export const TerminateSessionResponse = S.suspend(() =>
  S.Struct({ SessionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "TerminateSessionResponse",
}) as any as S.Schema<TerminateSessionResponse>;
export interface UnlabelParameterVersionResult {
  RemovedLabels?: ParameterLabelList;
  InvalidLabels?: ParameterLabelList;
}
export const UnlabelParameterVersionResult = S.suspend(() =>
  S.Struct({
    RemovedLabels: S.optional(ParameterLabelList),
    InvalidLabels: S.optional(ParameterLabelList),
  }).pipe(ns),
).annotations({
  identifier: "UnlabelParameterVersionResult",
}) as any as S.Schema<UnlabelParameterVersionResult>;
export type AssociationStatusAggregatedCount = { [key: string]: number };
export const AssociationStatusAggregatedCount = S.Record({
  key: S.String,
  value: S.Number,
});
export interface AssociationOverview {
  Status?: string;
  DetailedStatus?: string;
  AssociationStatusAggregatedCount?: AssociationStatusAggregatedCount;
}
export const AssociationOverview = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    AssociationStatusAggregatedCount: S.optional(
      AssociationStatusAggregatedCount,
    ),
  }),
).annotations({
  identifier: "AssociationOverview",
}) as any as S.Schema<AssociationOverview>;
export interface AlarmStateInformation {
  Name: string;
  State: string;
}
export const AlarmStateInformation = S.suspend(() =>
  S.Struct({ Name: S.String, State: S.String }),
).annotations({
  identifier: "AlarmStateInformation",
}) as any as S.Schema<AlarmStateInformation>;
export type AlarmStateInformationList = AlarmStateInformation[];
export const AlarmStateInformationList = S.Array(AlarmStateInformation);
export interface AssociationDescription {
  Name?: string;
  InstanceId?: string;
  AssociationVersion?: string;
  Date?: Date;
  LastUpdateAssociationDate?: Date;
  Status?: AssociationStatus;
  Overview?: AssociationOverview;
  DocumentVersion?: string;
  AutomationTargetParameterName?: string;
  Parameters?: Parameters;
  AssociationId?: string;
  Targets?: Targets;
  ScheduleExpression?: string;
  OutputLocation?: InstanceAssociationOutputLocation;
  LastExecutionDate?: Date;
  LastSuccessfulExecutionDate?: Date;
  AssociationName?: string;
  MaxErrors?: string;
  MaxConcurrency?: string;
  ComplianceSeverity?: string;
  SyncCompliance?: string;
  ApplyOnlyAtCronInterval?: boolean;
  CalendarNames?: CalendarNameOrARNList;
  TargetLocations?: TargetLocations;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
}
export const AssociationDescription = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateAssociationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(AssociationStatus),
    Overview: S.optional(AssociationOverview),
    DocumentVersion: S.optional(S.String),
    AutomationTargetParameterName: S.optional(S.String),
    Parameters: S.optional(Parameters),
    AssociationId: S.optional(S.String),
    Targets: S.optional(Targets),
    ScheduleExpression: S.optional(S.String),
    OutputLocation: S.optional(InstanceAssociationOutputLocation),
    LastExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessfulExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AssociationName: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    ComplianceSeverity: S.optional(S.String),
    SyncCompliance: S.optional(S.String),
    ApplyOnlyAtCronInterval: S.optional(S.Boolean),
    CalendarNames: S.optional(CalendarNameOrARNList),
    TargetLocations: S.optional(TargetLocations),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
  }),
).annotations({
  identifier: "AssociationDescription",
}) as any as S.Schema<AssociationDescription>;
export interface UpdateAssociationResult {
  AssociationDescription?: AssociationDescription;
}
export const UpdateAssociationResult = S.suspend(() =>
  S.Struct({ AssociationDescription: S.optional(AssociationDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateAssociationResult",
}) as any as S.Schema<UpdateAssociationResult>;
export interface UpdateAssociationStatusRequest {
  Name: string;
  InstanceId: string;
  AssociationStatus: AssociationStatus;
}
export const UpdateAssociationStatusRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    InstanceId: S.String,
    AssociationStatus: AssociationStatus,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAssociationStatusRequest",
}) as any as S.Schema<UpdateAssociationStatusRequest>;
export interface DocumentParameter {
  Name?: string;
  Type?: string;
  Description?: string;
  DefaultValue?: string;
}
export const DocumentParameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultValue: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentParameter",
}) as any as S.Schema<DocumentParameter>;
export type DocumentParameterList = DocumentParameter[];
export const DocumentParameterList = S.Array(
  DocumentParameter.pipe(T.XmlName("DocumentParameter")).annotations({
    identifier: "DocumentParameter",
  }),
);
export type PlatformTypeList = string[];
export const PlatformTypeList = S.Array(
  S.String.pipe(T.XmlName("PlatformType")),
);
export interface AttachmentInformation {
  Name?: string;
}
export const AttachmentInformation = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AttachmentInformation",
}) as any as S.Schema<AttachmentInformation>;
export type AttachmentInformationList = AttachmentInformation[];
export const AttachmentInformationList = S.Array(
  AttachmentInformation.pipe(T.XmlName("AttachmentInformation")).annotations({
    identifier: "AttachmentInformation",
  }),
);
export interface ReviewInformation {
  ReviewedTime?: Date;
  Status?: string;
  Reviewer?: string;
}
export const ReviewInformation = S.suspend(() =>
  S.Struct({
    ReviewedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    Reviewer: S.optional(S.String),
  }),
).annotations({
  identifier: "ReviewInformation",
}) as any as S.Schema<ReviewInformation>;
export type ReviewInformationList = ReviewInformation[];
export const ReviewInformationList = S.Array(
  ReviewInformation.pipe(T.XmlName("ReviewInformation")).annotations({
    identifier: "ReviewInformation",
  }),
);
export type CategoryList = string[];
export const CategoryList = S.Array(S.String);
export type CategoryEnumList = string[];
export const CategoryEnumList = S.Array(S.String);
export interface DocumentDescription {
  Sha1?: string;
  Hash?: string;
  HashType?: string;
  Name?: string;
  DisplayName?: string;
  VersionName?: string;
  Owner?: string;
  CreatedDate?: Date;
  Status?: string;
  StatusInformation?: string;
  DocumentVersion?: string;
  Description?: string;
  Parameters?: DocumentParameterList;
  PlatformTypes?: PlatformTypeList;
  DocumentType?: string;
  SchemaVersion?: string;
  LatestVersion?: string;
  DefaultVersion?: string;
  DocumentFormat?: string;
  TargetType?: string;
  Tags?: TagList;
  AttachmentsInformation?: AttachmentInformationList;
  Requires?: DocumentRequiresList;
  Author?: string;
  ReviewInformation?: ReviewInformationList;
  ApprovedVersion?: string;
  PendingReviewVersion?: string;
  ReviewStatus?: string;
  Category?: CategoryList;
  CategoryEnum?: CategoryEnumList;
}
export const DocumentDescription = S.suspend(() =>
  S.Struct({
    Sha1: S.optional(S.String),
    Hash: S.optional(S.String),
    HashType: S.optional(S.String),
    Name: S.optional(S.String),
    DisplayName: S.optional(S.String),
    VersionName: S.optional(S.String),
    Owner: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    StatusInformation: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(DocumentParameterList),
    PlatformTypes: S.optional(PlatformTypeList),
    DocumentType: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    LatestVersion: S.optional(S.String),
    DefaultVersion: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
    TargetType: S.optional(S.String),
    Tags: S.optional(TagList),
    AttachmentsInformation: S.optional(AttachmentInformationList),
    Requires: S.optional(DocumentRequiresList),
    Author: S.optional(S.String),
    ReviewInformation: S.optional(ReviewInformationList),
    ApprovedVersion: S.optional(S.String),
    PendingReviewVersion: S.optional(S.String),
    ReviewStatus: S.optional(S.String),
    Category: S.optional(CategoryList),
    CategoryEnum: S.optional(CategoryEnumList),
  }),
).annotations({
  identifier: "DocumentDescription",
}) as any as S.Schema<DocumentDescription>;
export interface UpdateDocumentResult {
  DocumentDescription?: DocumentDescription;
}
export const UpdateDocumentResult = S.suspend(() =>
  S.Struct({ DocumentDescription: S.optional(DocumentDescription) }).pipe(ns),
).annotations({
  identifier: "UpdateDocumentResult",
}) as any as S.Schema<UpdateDocumentResult>;
export interface UpdateMaintenanceWindowResult {
  WindowId?: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  StartDate?: string;
  EndDate?: string;
  Schedule?: string;
  ScheduleTimezone?: string;
  ScheduleOffset?: number;
  Duration?: number;
  Cutoff?: number;
  AllowUnassociatedTargets?: boolean;
  Enabled?: boolean;
}
export const UpdateMaintenanceWindowResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    StartDate: S.optional(S.String),
    EndDate: S.optional(S.String),
    Schedule: S.optional(S.String),
    ScheduleTimezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    Cutoff: S.optional(S.Number),
    AllowUnassociatedTargets: S.optional(S.Boolean),
    Enabled: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "UpdateMaintenanceWindowResult",
}) as any as S.Schema<UpdateMaintenanceWindowResult>;
export interface UpdateMaintenanceWindowTargetResult {
  WindowId?: string;
  WindowTargetId?: string;
  Targets?: Targets;
  OwnerInformation?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
}
export const UpdateMaintenanceWindowTargetResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTargetId: S.optional(S.String),
    Targets: S.optional(Targets),
    OwnerInformation: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "UpdateMaintenanceWindowTargetResult",
}) as any as S.Schema<UpdateMaintenanceWindowTargetResult>;
export interface UpdateMaintenanceWindowTaskResult {
  WindowId?: string;
  WindowTaskId?: string;
  Targets?: Targets;
  TaskArn?: string;
  ServiceRoleArn?: string;
  TaskParameters?: MaintenanceWindowTaskParameters;
  TaskInvocationParameters?: MaintenanceWindowTaskInvocationParameters;
  Priority?: number;
  MaxConcurrency?: string;
  MaxErrors?: string;
  LoggingInfo?: LoggingInfo;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  CutoffBehavior?: string;
  AlarmConfiguration?: AlarmConfiguration;
}
export const UpdateMaintenanceWindowTaskResult = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTaskId: S.optional(S.String),
    Targets: S.optional(Targets),
    TaskArn: S.optional(S.String),
    ServiceRoleArn: S.optional(S.String),
    TaskParameters: S.optional(MaintenanceWindowTaskParameters),
    TaskInvocationParameters: S.optional(
      MaintenanceWindowTaskInvocationParameters,
    ),
    Priority: S.optional(S.Number),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    LoggingInfo: S.optional(LoggingInfo),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CutoffBehavior: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "UpdateMaintenanceWindowTaskResult",
}) as any as S.Schema<UpdateMaintenanceWindowTaskResult>;
export interface UpdateOpsMetadataResult {
  OpsMetadataArn?: string;
}
export const UpdateOpsMetadataResult = S.suspend(() =>
  S.Struct({ OpsMetadataArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateOpsMetadataResult",
}) as any as S.Schema<UpdateOpsMetadataResult>;
export interface UpdatePatchBaselineResult {
  BaselineId?: string;
  Name?: string;
  OperatingSystem?: string;
  GlobalFilters?: PatchFilterGroup;
  ApprovalRules?: PatchRuleGroup;
  ApprovedPatches?: PatchIdList;
  ApprovedPatchesComplianceLevel?: string;
  ApprovedPatchesEnableNonSecurity?: boolean;
  RejectedPatches?: PatchIdList;
  RejectedPatchesAction?: string;
  CreatedDate?: Date;
  ModifiedDate?: Date;
  Description?: string;
  Sources?: PatchSourceList;
  AvailableSecurityUpdatesComplianceStatus?: string;
}
export const UpdatePatchBaselineResult = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    Name: S.optional(S.String),
    OperatingSystem: S.optional(S.String),
    GlobalFilters: S.optional(PatchFilterGroup),
    ApprovalRules: S.optional(PatchRuleGroup),
    ApprovedPatches: S.optional(PatchIdList),
    ApprovedPatchesComplianceLevel: S.optional(S.String),
    ApprovedPatchesEnableNonSecurity: S.optional(S.Boolean),
    RejectedPatches: S.optional(PatchIdList),
    RejectedPatchesAction: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Sources: S.optional(PatchSourceList),
    AvailableSecurityUpdatesComplianceStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdatePatchBaselineResult",
}) as any as S.Schema<UpdatePatchBaselineResult>;
export interface ResourceDataSyncDestinationDataSharing {
  DestinationDataSharingType?: string;
}
export const ResourceDataSyncDestinationDataSharing = S.suspend(() =>
  S.Struct({ DestinationDataSharingType: S.optional(S.String) }),
).annotations({
  identifier: "ResourceDataSyncDestinationDataSharing",
}) as any as S.Schema<ResourceDataSyncDestinationDataSharing>;
export interface InventoryGroup {
  Name: string;
  Filters: InventoryFilterList;
}
export const InventoryGroup = S.suspend(() =>
  S.Struct({ Name: S.String, Filters: InventoryFilterList }),
).annotations({
  identifier: "InventoryGroup",
}) as any as S.Schema<InventoryGroup>;
export type InventoryGroupList = InventoryGroup[];
export const InventoryGroupList = S.Array(
  InventoryGroup.pipe(T.XmlName("InventoryGroup")).annotations({
    identifier: "InventoryGroup",
  }),
);
export type OpsAggregatorValueMap = { [key: string]: string };
export const OpsAggregatorValueMap = S.Record({
  key: S.String,
  value: S.String,
});
export type ComplianceItemDetails = { [key: string]: string };
export const ComplianceItemDetails = S.Record({
  key: S.String,
  value: S.String,
});
export type InventoryItemContentContext = { [key: string]: string };
export const InventoryItemContentContext = S.Record({
  key: S.String,
  value: S.String,
});
export interface AutomationExecutionInputs {
  Parameters?: AutomationParameterMap;
  TargetParameterName?: string;
  Targets?: Targets;
  TargetMaps?: TargetMaps;
  TargetLocations?: TargetLocations;
  TargetLocationsURL?: string;
}
export const AutomationExecutionInputs = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(AutomationParameterMap),
    TargetParameterName: S.optional(S.String),
    Targets: S.optional(Targets),
    TargetMaps: S.optional(TargetMaps),
    TargetLocations: S.optional(TargetLocations),
    TargetLocationsURL: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomationExecutionInputs",
}) as any as S.Schema<AutomationExecutionInputs>;
export interface DocumentReviewCommentSource {
  Type?: string;
  Content?: string;
}
export const DocumentReviewCommentSource = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Content: S.optional(S.String) }),
).annotations({
  identifier: "DocumentReviewCommentSource",
}) as any as S.Schema<DocumentReviewCommentSource>;
export type DocumentReviewCommentList = DocumentReviewCommentSource[];
export const DocumentReviewCommentList = S.Array(DocumentReviewCommentSource);
export type AssociationDescriptionList = AssociationDescription[];
export const AssociationDescriptionList = S.Array(
  AssociationDescription.pipe(T.XmlName("AssociationDescription")).annotations({
    identifier: "AssociationDescription",
  }),
);
export interface ResourceDataSyncS3Destination {
  BucketName: string;
  Prefix?: string;
  SyncFormat: string;
  Region: string;
  AWSKMSKeyARN?: string;
  DestinationDataSharing?: ResourceDataSyncDestinationDataSharing;
}
export const ResourceDataSyncS3Destination = S.suspend(() =>
  S.Struct({
    BucketName: S.String,
    Prefix: S.optional(S.String),
    SyncFormat: S.String,
    Region: S.String,
    AWSKMSKeyARN: S.optional(S.String),
    DestinationDataSharing: S.optional(ResourceDataSyncDestinationDataSharing),
  }),
).annotations({
  identifier: "ResourceDataSyncS3Destination",
}) as any as S.Schema<ResourceDataSyncS3Destination>;
export type PatchAdvisoryIdList = string[];
export const PatchAdvisoryIdList = S.Array(S.String);
export type PatchBugzillaIdList = string[];
export const PatchBugzillaIdList = S.Array(S.String);
export type PatchCVEIdList = string[];
export const PatchCVEIdList = S.Array(S.String);
export interface Patch {
  Id?: string;
  ReleaseDate?: Date;
  Title?: string;
  Description?: string;
  ContentUrl?: string;
  Vendor?: string;
  ProductFamily?: string;
  Product?: string;
  Classification?: string;
  MsrcSeverity?: string;
  KbNumber?: string;
  MsrcNumber?: string;
  Language?: string;
  AdvisoryIds?: PatchAdvisoryIdList;
  BugzillaIds?: PatchBugzillaIdList;
  CVEIds?: PatchCVEIdList;
  Name?: string;
  Epoch?: number;
  Version?: string;
  Release?: string;
  Arch?: string;
  Severity?: string;
  Repository?: string;
}
export const Patch = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    ReleaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    ContentUrl: S.optional(S.String),
    Vendor: S.optional(S.String),
    ProductFamily: S.optional(S.String),
    Product: S.optional(S.String),
    Classification: S.optional(S.String),
    MsrcSeverity: S.optional(S.String),
    KbNumber: S.optional(S.String),
    MsrcNumber: S.optional(S.String),
    Language: S.optional(S.String),
    AdvisoryIds: S.optional(PatchAdvisoryIdList),
    BugzillaIds: S.optional(PatchBugzillaIdList),
    CVEIds: S.optional(PatchCVEIdList),
    Name: S.optional(S.String),
    Epoch: S.optional(S.Number),
    Version: S.optional(S.String),
    Release: S.optional(S.String),
    Arch: S.optional(S.String),
    Severity: S.optional(S.String),
    Repository: S.optional(S.String),
  }),
).annotations({ identifier: "Patch" }) as any as S.Schema<Patch>;
export type PatchList = Patch[];
export const PatchList = S.Array(Patch);
export interface AccountSharingInfo {
  AccountId?: string;
  SharedDocumentVersion?: string;
}
export const AccountSharingInfo = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    SharedDocumentVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountSharingInfo",
}) as any as S.Schema<AccountSharingInfo>;
export type AccountSharingInfoList = AccountSharingInfo[];
export const AccountSharingInfoList = S.Array(
  AccountSharingInfo.pipe(T.XmlName("AccountSharingInfo")).annotations({
    identifier: "AccountSharingInfo",
  }),
);
export interface InstanceAssociation {
  AssociationId?: string;
  InstanceId?: string;
  Content?: string;
  AssociationVersion?: string;
}
export const InstanceAssociation = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    Content: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceAssociation",
}) as any as S.Schema<InstanceAssociation>;
export type InstanceAssociationList = InstanceAssociation[];
export const InstanceAssociationList = S.Array(InstanceAssociation);
export interface PatchComplianceData {
  Title: string;
  KBId: string;
  Classification: string;
  Severity: string;
  State: string;
  InstalledTime: Date;
  CVEIds?: string;
}
export const PatchComplianceData = S.suspend(() =>
  S.Struct({
    Title: S.String,
    KBId: S.String,
    Classification: S.String,
    Severity: S.String,
    State: S.String,
    InstalledTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CVEIds: S.optional(S.String),
  }),
).annotations({
  identifier: "PatchComplianceData",
}) as any as S.Schema<PatchComplianceData>;
export type PatchComplianceDataList = PatchComplianceData[];
export const PatchComplianceDataList = S.Array(PatchComplianceData);
export interface InstancePatchState {
  InstanceId: string;
  PatchGroup: string;
  BaselineId: string;
  SnapshotId?: string;
  InstallOverrideList?: string;
  OwnerInformation?: string | Redacted.Redacted<string>;
  InstalledCount?: number;
  InstalledOtherCount?: number;
  InstalledPendingRebootCount?: number;
  InstalledRejectedCount?: number;
  MissingCount?: number;
  FailedCount?: number;
  UnreportedNotApplicableCount?: number;
  NotApplicableCount?: number;
  AvailableSecurityUpdateCount?: number;
  OperationStartTime: Date;
  OperationEndTime: Date;
  Operation: string;
  LastNoRebootInstallOperationTime?: Date;
  RebootOption?: string;
  CriticalNonCompliantCount?: number;
  SecurityNonCompliantCount?: number;
  OtherNonCompliantCount?: number;
}
export const InstancePatchState = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    PatchGroup: S.String,
    BaselineId: S.String,
    SnapshotId: S.optional(S.String),
    InstallOverrideList: S.optional(S.String),
    OwnerInformation: S.optional(SensitiveString),
    InstalledCount: S.optional(S.Number),
    InstalledOtherCount: S.optional(S.Number),
    InstalledPendingRebootCount: S.optional(S.Number),
    InstalledRejectedCount: S.optional(S.Number),
    MissingCount: S.optional(S.Number),
    FailedCount: S.optional(S.Number),
    UnreportedNotApplicableCount: S.optional(S.Number),
    NotApplicableCount: S.optional(S.Number),
    AvailableSecurityUpdateCount: S.optional(S.Number),
    OperationStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    OperationEndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Operation: S.String,
    LastNoRebootInstallOperationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RebootOption: S.optional(S.String),
    CriticalNonCompliantCount: S.optional(S.Number),
    SecurityNonCompliantCount: S.optional(S.Number),
    OtherNonCompliantCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstancePatchState",
}) as any as S.Schema<InstancePatchState>;
export type InstancePatchStateList = InstancePatchState[];
export const InstancePatchStateList = S.Array(InstancePatchState);
export type InstancePatchStatesList = InstancePatchState[];
export const InstancePatchStatesList = S.Array(InstancePatchState);
export interface InventoryDeletionSummaryItem {
  Version?: string;
  Count?: number;
  RemainingCount?: number;
}
export const InventoryDeletionSummaryItem = S.suspend(() =>
  S.Struct({
    Version: S.optional(S.String),
    Count: S.optional(S.Number),
    RemainingCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "InventoryDeletionSummaryItem",
}) as any as S.Schema<InventoryDeletionSummaryItem>;
export type InventoryDeletionSummaryItems = InventoryDeletionSummaryItem[];
export const InventoryDeletionSummaryItems = S.Array(
  InventoryDeletionSummaryItem,
);
export interface InventoryDeletionSummary {
  TotalCount?: number;
  RemainingCount?: number;
  SummaryItems?: InventoryDeletionSummaryItems;
}
export const InventoryDeletionSummary = S.suspend(() =>
  S.Struct({
    TotalCount: S.optional(S.Number),
    RemainingCount: S.optional(S.Number),
    SummaryItems: S.optional(InventoryDeletionSummaryItems),
  }),
).annotations({
  identifier: "InventoryDeletionSummary",
}) as any as S.Schema<InventoryDeletionSummary>;
export interface InventoryDeletionStatusItem {
  DeletionId?: string;
  TypeName?: string;
  DeletionStartTime?: Date;
  LastStatus?: string;
  LastStatusMessage?: string;
  DeletionSummary?: InventoryDeletionSummary;
  LastStatusUpdateTime?: Date;
}
export const InventoryDeletionStatusItem = S.suspend(() =>
  S.Struct({
    DeletionId: S.optional(S.String),
    TypeName: S.optional(S.String),
    DeletionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastStatus: S.optional(S.String),
    LastStatusMessage: S.optional(S.String),
    DeletionSummary: S.optional(InventoryDeletionSummary),
    LastStatusUpdateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "InventoryDeletionStatusItem",
}) as any as S.Schema<InventoryDeletionStatusItem>;
export type InventoryDeletionsList = InventoryDeletionStatusItem[];
export const InventoryDeletionsList = S.Array(InventoryDeletionStatusItem);
export interface MaintenanceWindowExecutionTaskInvocationIdentity {
  WindowExecutionId?: string;
  TaskExecutionId?: string;
  InvocationId?: string;
  ExecutionId?: string;
  TaskType?: string;
  Parameters?: string | Redacted.Redacted<string>;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
  OwnerInformation?: string | Redacted.Redacted<string>;
  WindowTargetId?: string;
}
export const MaintenanceWindowExecutionTaskInvocationIdentity = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.optional(S.String),
    TaskExecutionId: S.optional(S.String),
    InvocationId: S.optional(S.String),
    ExecutionId: S.optional(S.String),
    TaskType: S.optional(S.String),
    Parameters: S.optional(SensitiveString),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OwnerInformation: S.optional(SensitiveString),
    WindowTargetId: S.optional(S.String),
  }),
).annotations({
  identifier: "MaintenanceWindowExecutionTaskInvocationIdentity",
}) as any as S.Schema<MaintenanceWindowExecutionTaskInvocationIdentity>;
export type MaintenanceWindowExecutionTaskInvocationIdentityList =
  MaintenanceWindowExecutionTaskInvocationIdentity[];
export const MaintenanceWindowExecutionTaskInvocationIdentityList = S.Array(
  MaintenanceWindowExecutionTaskInvocationIdentity,
);
export interface MaintenanceWindowExecutionTaskIdentity {
  WindowExecutionId?: string;
  TaskExecutionId?: string;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
  TaskArn?: string;
  TaskType?: string;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
}
export const MaintenanceWindowExecutionTaskIdentity = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.optional(S.String),
    TaskExecutionId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TaskArn: S.optional(S.String),
    TaskType: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
  }),
).annotations({
  identifier: "MaintenanceWindowExecutionTaskIdentity",
}) as any as S.Schema<MaintenanceWindowExecutionTaskIdentity>;
export type MaintenanceWindowExecutionTaskIdentityList =
  MaintenanceWindowExecutionTaskIdentity[];
export const MaintenanceWindowExecutionTaskIdentityList = S.Array(
  MaintenanceWindowExecutionTaskIdentity,
);
export interface MaintenanceWindowIdentity {
  WindowId?: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  Enabled?: boolean;
  Duration?: number;
  Cutoff?: number;
  Schedule?: string;
  ScheduleTimezone?: string;
  ScheduleOffset?: number;
  EndDate?: string;
  StartDate?: string;
  NextExecutionTime?: string;
}
export const MaintenanceWindowIdentity = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    Enabled: S.optional(S.Boolean),
    Duration: S.optional(S.Number),
    Cutoff: S.optional(S.Number),
    Schedule: S.optional(S.String),
    ScheduleTimezone: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    EndDate: S.optional(S.String),
    StartDate: S.optional(S.String),
    NextExecutionTime: S.optional(S.String),
  }),
).annotations({
  identifier: "MaintenanceWindowIdentity",
}) as any as S.Schema<MaintenanceWindowIdentity>;
export type MaintenanceWindowIdentityList = MaintenanceWindowIdentity[];
export const MaintenanceWindowIdentityList = S.Array(MaintenanceWindowIdentity);
export interface ScheduledWindowExecution {
  WindowId?: string;
  Name?: string;
  ExecutionTime?: string;
}
export const ScheduledWindowExecution = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    Name: S.optional(S.String),
    ExecutionTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduledWindowExecution",
}) as any as S.Schema<ScheduledWindowExecution>;
export type ScheduledWindowExecutionList = ScheduledWindowExecution[];
export const ScheduledWindowExecutionList = S.Array(ScheduledWindowExecution);
export interface MaintenanceWindowIdentityForTarget {
  WindowId?: string;
  Name?: string;
}
export const MaintenanceWindowIdentityForTarget = S.suspend(() =>
  S.Struct({ WindowId: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "MaintenanceWindowIdentityForTarget",
}) as any as S.Schema<MaintenanceWindowIdentityForTarget>;
export type MaintenanceWindowsForTargetList =
  MaintenanceWindowIdentityForTarget[];
export const MaintenanceWindowsForTargetList = S.Array(
  MaintenanceWindowIdentityForTarget,
);
export interface MaintenanceWindowTarget {
  WindowId?: string;
  WindowTargetId?: string;
  ResourceType?: string;
  Targets?: Targets;
  OwnerInformation?: string | Redacted.Redacted<string>;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
}
export const MaintenanceWindowTarget = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTargetId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Targets: S.optional(Targets),
    OwnerInformation: S.optional(SensitiveString),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "MaintenanceWindowTarget",
}) as any as S.Schema<MaintenanceWindowTarget>;
export type MaintenanceWindowTargetList = MaintenanceWindowTarget[];
export const MaintenanceWindowTargetList = S.Array(MaintenanceWindowTarget);
export interface MaintenanceWindowTask {
  WindowId?: string;
  WindowTaskId?: string;
  TaskArn?: string;
  Type?: string;
  Targets?: Targets;
  TaskParameters?: MaintenanceWindowTaskParameters;
  Priority?: number;
  LoggingInfo?: LoggingInfo;
  ServiceRoleArn?: string;
  MaxConcurrency?: string;
  MaxErrors?: string;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  CutoffBehavior?: string;
  AlarmConfiguration?: AlarmConfiguration;
}
export const MaintenanceWindowTask = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowTaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    Type: S.optional(S.String),
    Targets: S.optional(Targets),
    TaskParameters: S.optional(MaintenanceWindowTaskParameters),
    Priority: S.optional(S.Number),
    LoggingInfo: S.optional(LoggingInfo),
    ServiceRoleArn: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    CutoffBehavior: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }),
).annotations({
  identifier: "MaintenanceWindowTask",
}) as any as S.Schema<MaintenanceWindowTask>;
export type MaintenanceWindowTaskList = MaintenanceWindowTask[];
export const MaintenanceWindowTaskList = S.Array(MaintenanceWindowTask);
export interface PatchBaselineIdentity {
  BaselineId?: string;
  BaselineName?: string;
  OperatingSystem?: string;
  BaselineDescription?: string;
  DefaultBaseline?: boolean;
}
export const PatchBaselineIdentity = S.suspend(() =>
  S.Struct({
    BaselineId: S.optional(S.String),
    BaselineName: S.optional(S.String),
    OperatingSystem: S.optional(S.String),
    BaselineDescription: S.optional(S.String),
    DefaultBaseline: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PatchBaselineIdentity",
}) as any as S.Schema<PatchBaselineIdentity>;
export type PatchBaselineIdentityList = PatchBaselineIdentity[];
export const PatchBaselineIdentityList = S.Array(PatchBaselineIdentity);
export interface PatchGroupPatchBaselineMapping {
  PatchGroup?: string;
  BaselineIdentity?: PatchBaselineIdentity;
}
export const PatchGroupPatchBaselineMapping = S.suspend(() =>
  S.Struct({
    PatchGroup: S.optional(S.String),
    BaselineIdentity: S.optional(PatchBaselineIdentity),
  }),
).annotations({
  identifier: "PatchGroupPatchBaselineMapping",
}) as any as S.Schema<PatchGroupPatchBaselineMapping>;
export type PatchGroupPatchBaselineMappingList =
  PatchGroupPatchBaselineMapping[];
export const PatchGroupPatchBaselineMappingList = S.Array(
  PatchGroupPatchBaselineMapping,
);
export type PatchPropertyEntry = { [key: string]: string };
export const PatchPropertyEntry = S.Record({ key: S.String, value: S.String });
export type PatchPropertiesList = PatchPropertyEntry[];
export const PatchPropertiesList = S.Array(PatchPropertyEntry);
export interface Credentials {
  AccessKeyId: string;
  SecretAccessKey: string | Redacted.Redacted<string>;
  SessionToken: string | Redacted.Redacted<string>;
  ExpirationTime: Date;
}
export const Credentials = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.String,
    SecretAccessKey: SensitiveString,
    SessionToken: SensitiveString,
    ExpirationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Credentials" }) as any as S.Schema<Credentials>;
export interface AttachmentContent {
  Name?: string;
  Size?: number;
  Hash?: string;
  HashType?: string;
  Url?: string;
}
export const AttachmentContent = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Size: S.optional(S.Number),
    Hash: S.optional(S.String),
    HashType: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "AttachmentContent",
}) as any as S.Schema<AttachmentContent>;
export type AttachmentContentList = AttachmentContent[];
export const AttachmentContentList = S.Array(
  AttachmentContent.pipe(T.XmlName("AttachmentContent")).annotations({
    identifier: "AttachmentContent",
  }),
);
export interface InventoryAggregator {
  Expression?: string;
  Aggregators?: InventoryAggregatorList;
  Groups?: InventoryGroupList;
}
export const InventoryAggregator = S.suspend(() =>
  S.Struct({
    Expression: S.optional(S.String),
    Aggregators: S.optional(
      S.suspend(() => InventoryAggregatorList).annotations({
        identifier: "InventoryAggregatorList",
      }),
    ),
    Groups: S.optional(InventoryGroupList),
  }),
).annotations({
  identifier: "InventoryAggregator",
}) as any as S.Schema<InventoryAggregator>;
export type InventoryAggregatorList = InventoryAggregator[];
export const InventoryAggregatorList = S.Array(
  S.suspend((): S.Schema<InventoryAggregator, any> => InventoryAggregator)
    .annotations({ identifier: "InventoryAggregator" })
    .pipe(T.XmlName("Aggregator"))
    .annotations({ identifier: "InventoryAggregator" }),
) as any as S.Schema<InventoryAggregatorList>;
export interface OpsItem {
  CreatedBy?: string;
  OpsItemType?: string;
  CreatedTime?: Date;
  Description?: string;
  LastModifiedBy?: string;
  LastModifiedTime?: Date;
  Notifications?: OpsItemNotifications;
  Priority?: number;
  RelatedOpsItems?: RelatedOpsItems;
  Status?: string;
  OpsItemId?: string;
  Version?: string;
  Title?: string;
  Source?: string;
  OperationalData?: OpsItemOperationalData;
  Category?: string;
  Severity?: string;
  ActualStartTime?: Date;
  ActualEndTime?: Date;
  PlannedStartTime?: Date;
  PlannedEndTime?: Date;
  OpsItemArn?: string;
}
export const OpsItem = S.suspend(() =>
  S.Struct({
    CreatedBy: S.optional(S.String),
    OpsItemType: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    LastModifiedBy: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Notifications: S.optional(OpsItemNotifications),
    Priority: S.optional(S.Number),
    RelatedOpsItems: S.optional(RelatedOpsItems),
    Status: S.optional(S.String),
    OpsItemId: S.optional(S.String),
    Version: S.optional(S.String),
    Title: S.optional(S.String),
    Source: S.optional(S.String),
    OperationalData: S.optional(OpsItemOperationalData),
    Category: S.optional(S.String),
    Severity: S.optional(S.String),
    ActualStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ActualEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PlannedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PlannedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    OpsItemArn: S.optional(S.String),
  }),
).annotations({ identifier: "OpsItem" }) as any as S.Schema<OpsItem>;
export interface OpsAggregator {
  AggregatorType?: string;
  TypeName?: string;
  AttributeName?: string;
  Values?: OpsAggregatorValueMap;
  Filters?: OpsFilterList;
  Aggregators?: OpsAggregatorList;
}
export const OpsAggregator = S.suspend(() =>
  S.Struct({
    AggregatorType: S.optional(S.String),
    TypeName: S.optional(S.String),
    AttributeName: S.optional(S.String),
    Values: S.optional(OpsAggregatorValueMap),
    Filters: S.optional(OpsFilterList),
    Aggregators: S.optional(
      S.suspend(() => OpsAggregatorList).annotations({
        identifier: "OpsAggregatorList",
      }),
    ),
  }),
).annotations({
  identifier: "OpsAggregator",
}) as any as S.Schema<OpsAggregator>;
export type OpsAggregatorList = OpsAggregator[];
export const OpsAggregatorList = S.Array(
  S.suspend((): S.Schema<OpsAggregator, any> => OpsAggregator)
    .annotations({ identifier: "OpsAggregator" })
    .pipe(T.XmlName("Aggregator"))
    .annotations({ identifier: "OpsAggregator" }),
) as any as S.Schema<OpsAggregatorList>;
export interface GetResourcePoliciesResponseEntry {
  PolicyId?: string;
  PolicyHash?: string;
  Policy?: string;
}
export const GetResourcePoliciesResponseEntry = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    PolicyHash: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePoliciesResponseEntry",
}) as any as S.Schema<GetResourcePoliciesResponseEntry>;
export type GetResourcePoliciesResponseEntries =
  GetResourcePoliciesResponseEntry[];
export const GetResourcePoliciesResponseEntries = S.Array(
  GetResourcePoliciesResponseEntry,
);
export interface AssociationVersionInfo {
  AssociationId?: string;
  AssociationVersion?: string;
  CreatedDate?: Date;
  Name?: string;
  DocumentVersion?: string;
  Parameters?: Parameters;
  Targets?: Targets;
  ScheduleExpression?: string;
  OutputLocation?: InstanceAssociationOutputLocation;
  AssociationName?: string;
  MaxErrors?: string;
  MaxConcurrency?: string;
  ComplianceSeverity?: string;
  SyncCompliance?: string;
  ApplyOnlyAtCronInterval?: boolean;
  CalendarNames?: CalendarNameOrARNList;
  TargetLocations?: TargetLocations;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
}
export const AssociationVersionInfo = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Targets: S.optional(Targets),
    ScheduleExpression: S.optional(S.String),
    OutputLocation: S.optional(InstanceAssociationOutputLocation),
    AssociationName: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    ComplianceSeverity: S.optional(S.String),
    SyncCompliance: S.optional(S.String),
    ApplyOnlyAtCronInterval: S.optional(S.Boolean),
    CalendarNames: S.optional(CalendarNameOrARNList),
    TargetLocations: S.optional(TargetLocations),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
  }),
).annotations({
  identifier: "AssociationVersionInfo",
}) as any as S.Schema<AssociationVersionInfo>;
export type AssociationVersionList = AssociationVersionInfo[];
export const AssociationVersionList = S.Array(AssociationVersionInfo);
export interface Command {
  CommandId?: string;
  DocumentName?: string;
  DocumentVersion?: string;
  Comment?: string;
  ExpiresAfter?: Date;
  Parameters?: Parameters;
  InstanceIds?: InstanceIdList;
  Targets?: Targets;
  RequestedDateTime?: Date;
  Status?: string;
  StatusDetails?: string;
  OutputS3Region?: string;
  OutputS3BucketName?: string;
  OutputS3KeyPrefix?: string;
  MaxConcurrency?: string;
  MaxErrors?: string;
  TargetCount?: number;
  CompletedCount?: number;
  ErrorCount?: number;
  DeliveryTimedOutCount?: number;
  ServiceRole?: string;
  NotificationConfig?: NotificationConfig;
  CloudWatchOutputConfig?: CloudWatchOutputConfig;
  TimeoutSeconds?: number;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
}
export const Command = S.suspend(() =>
  S.Struct({
    CommandId: S.optional(S.String),
    DocumentName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Comment: S.optional(S.String),
    ExpiresAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Parameters: S.optional(Parameters),
    InstanceIds: S.optional(InstanceIdList),
    Targets: S.optional(Targets),
    RequestedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    OutputS3Region: S.optional(S.String),
    OutputS3BucketName: S.optional(S.String),
    OutputS3KeyPrefix: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    TargetCount: S.optional(S.Number),
    CompletedCount: S.optional(S.Number),
    ErrorCount: S.optional(S.Number),
    DeliveryTimedOutCount: S.optional(S.Number),
    ServiceRole: S.optional(S.String),
    NotificationConfig: S.optional(NotificationConfig),
    CloudWatchOutputConfig: S.optional(CloudWatchOutputConfig),
    TimeoutSeconds: S.optional(S.Number),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
  }),
).annotations({ identifier: "Command" }) as any as S.Schema<Command>;
export type CommandList = Command[];
export const CommandList = S.Array(Command);
export interface DocumentVersionInfo {
  Name?: string;
  DisplayName?: string;
  DocumentVersion?: string;
  VersionName?: string;
  CreatedDate?: Date;
  IsDefaultVersion?: boolean;
  DocumentFormat?: string;
  Status?: string;
  StatusInformation?: string;
  ReviewStatus?: string;
}
export const DocumentVersionInfo = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DisplayName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    VersionName: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IsDefaultVersion: S.optional(S.Boolean),
    DocumentFormat: S.optional(S.String),
    Status: S.optional(S.String),
    StatusInformation: S.optional(S.String),
    ReviewStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentVersionInfo",
}) as any as S.Schema<DocumentVersionInfo>;
export type DocumentVersionList = DocumentVersionInfo[];
export const DocumentVersionList = S.Array(DocumentVersionInfo);
export interface SeveritySummary {
  CriticalCount?: number;
  HighCount?: number;
  MediumCount?: number;
  LowCount?: number;
  InformationalCount?: number;
  UnspecifiedCount?: number;
}
export const SeveritySummary = S.suspend(() =>
  S.Struct({
    CriticalCount: S.optional(S.Number),
    HighCount: S.optional(S.Number),
    MediumCount: S.optional(S.Number),
    LowCount: S.optional(S.Number),
    InformationalCount: S.optional(S.Number),
    UnspecifiedCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SeveritySummary",
}) as any as S.Schema<SeveritySummary>;
export interface CompliantSummary {
  CompliantCount?: number;
  SeveritySummary?: SeveritySummary;
}
export const CompliantSummary = S.suspend(() =>
  S.Struct({
    CompliantCount: S.optional(S.Number),
    SeveritySummary: S.optional(SeveritySummary),
  }),
).annotations({
  identifier: "CompliantSummary",
}) as any as S.Schema<CompliantSummary>;
export interface NonCompliantSummary {
  NonCompliantCount?: number;
  SeveritySummary?: SeveritySummary;
}
export const NonCompliantSummary = S.suspend(() =>
  S.Struct({
    NonCompliantCount: S.optional(S.Number),
    SeveritySummary: S.optional(SeveritySummary),
  }),
).annotations({
  identifier: "NonCompliantSummary",
}) as any as S.Schema<NonCompliantSummary>;
export interface ResourceComplianceSummaryItem {
  ComplianceType?: string;
  ResourceType?: string;
  ResourceId?: string;
  Status?: string;
  OverallSeverity?: string;
  ExecutionSummary?: ComplianceExecutionSummary;
  CompliantSummary?: CompliantSummary;
  NonCompliantSummary?: NonCompliantSummary;
}
export const ResourceComplianceSummaryItem = S.suspend(() =>
  S.Struct({
    ComplianceType: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Status: S.optional(S.String),
    OverallSeverity: S.optional(S.String),
    ExecutionSummary: S.optional(ComplianceExecutionSummary),
    CompliantSummary: S.optional(CompliantSummary),
    NonCompliantSummary: S.optional(NonCompliantSummary),
  }),
).annotations({
  identifier: "ResourceComplianceSummaryItem",
}) as any as S.Schema<ResourceComplianceSummaryItem>;
export type ResourceComplianceSummaryItemList = ResourceComplianceSummaryItem[];
export const ResourceComplianceSummaryItemList = S.Array(
  ResourceComplianceSummaryItem.pipe(T.XmlName("Item")).annotations({
    identifier: "ResourceComplianceSummaryItem",
  }),
);
export interface ComplianceItemEntry {
  Id?: string;
  Title?: string;
  Severity: string;
  Status: string;
  Details?: ComplianceItemDetails;
}
export const ComplianceItemEntry = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    Severity: S.String,
    Status: S.String,
    Details: S.optional(ComplianceItemDetails),
  }),
).annotations({
  identifier: "ComplianceItemEntry",
}) as any as S.Schema<ComplianceItemEntry>;
export type ComplianceItemEntryList = ComplianceItemEntry[];
export const ComplianceItemEntryList = S.Array(ComplianceItemEntry);
export interface InventoryItem {
  TypeName: string;
  SchemaVersion: string;
  CaptureTime: string;
  ContentHash?: string;
  Content?: InventoryItemEntryList;
  Context?: InventoryItemContentContext;
}
export const InventoryItem = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    SchemaVersion: S.String,
    CaptureTime: S.String,
    ContentHash: S.optional(S.String),
    Content: S.optional(InventoryItemEntryList),
    Context: S.optional(InventoryItemContentContext),
  }),
).annotations({
  identifier: "InventoryItem",
}) as any as S.Schema<InventoryItem>;
export type InventoryItemList = InventoryItem[];
export const InventoryItemList = S.Array(
  InventoryItem.pipe(T.XmlName("Item")).annotations({
    identifier: "InventoryItem",
  }),
);
export type ExecutionInputs = { Automation: AutomationExecutionInputs };
export const ExecutionInputs = S.Union(
  S.Struct({ Automation: AutomationExecutionInputs }),
);
export interface DocumentDefaultVersionDescription {
  Name?: string;
  DefaultVersion?: string;
  DefaultVersionName?: string;
}
export const DocumentDefaultVersionDescription = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DefaultVersion: S.optional(S.String),
    DefaultVersionName: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentDefaultVersionDescription",
}) as any as S.Schema<DocumentDefaultVersionDescription>;
export interface DocumentReviews {
  Action: string;
  Comment?: DocumentReviewCommentList;
}
export const DocumentReviews = S.suspend(() =>
  S.Struct({
    Action: S.String,
    Comment: S.optional(DocumentReviewCommentList),
  }),
).annotations({
  identifier: "DocumentReviews",
}) as any as S.Schema<DocumentReviews>;
export type OpsItemParameterNamesList = string[];
export const OpsItemParameterNamesList = S.Array(S.String);
export type ValidNextStepList = string[];
export const ValidNextStepList = S.Array(S.String);
export type TargetParameterList = string[];
export const TargetParameterList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export interface CreateActivationResult {
  ActivationId?: string;
  ActivationCode?: string;
}
export const CreateActivationResult = S.suspend(() =>
  S.Struct({
    ActivationId: S.optional(S.String),
    ActivationCode: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateActivationResult",
}) as any as S.Schema<CreateActivationResult>;
export interface CreateAssociationRequest {
  Name: string;
  DocumentVersion?: string;
  InstanceId?: string;
  Parameters?: Parameters;
  Targets?: Targets;
  ScheduleExpression?: string;
  OutputLocation?: InstanceAssociationOutputLocation;
  AssociationName?: string;
  AutomationTargetParameterName?: string;
  MaxErrors?: string;
  MaxConcurrency?: string;
  ComplianceSeverity?: string;
  SyncCompliance?: string;
  ApplyOnlyAtCronInterval?: boolean;
  CalendarNames?: CalendarNameOrARNList;
  TargetLocations?: TargetLocations;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
  Tags?: TagList;
  AlarmConfiguration?: AlarmConfiguration;
}
export const CreateAssociationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentVersion: S.optional(S.String),
    InstanceId: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Targets: S.optional(Targets),
    ScheduleExpression: S.optional(S.String),
    OutputLocation: S.optional(InstanceAssociationOutputLocation),
    AssociationName: S.optional(S.String),
    AutomationTargetParameterName: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    MaxConcurrency: S.optional(S.String),
    ComplianceSeverity: S.optional(S.String),
    SyncCompliance: S.optional(S.String),
    ApplyOnlyAtCronInterval: S.optional(S.Boolean),
    CalendarNames: S.optional(CalendarNameOrARNList),
    TargetLocations: S.optional(TargetLocations),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
    Tags: S.optional(TagList),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAssociationRequest",
}) as any as S.Schema<CreateAssociationRequest>;
export interface CreateDocumentResult {
  DocumentDescription?: DocumentDescription;
}
export const CreateDocumentResult = S.suspend(() =>
  S.Struct({ DocumentDescription: S.optional(DocumentDescription) }).pipe(ns),
).annotations({
  identifier: "CreateDocumentResult",
}) as any as S.Schema<CreateDocumentResult>;
export interface CreateOpsItemRequest {
  Description: string;
  OpsItemType?: string;
  OperationalData?: OpsItemOperationalData;
  Notifications?: OpsItemNotifications;
  Priority?: number;
  RelatedOpsItems?: RelatedOpsItems;
  Source: string;
  Title: string;
  Tags?: TagList;
  Category?: string;
  Severity?: string;
  ActualStartTime?: Date;
  ActualEndTime?: Date;
  PlannedStartTime?: Date;
  PlannedEndTime?: Date;
  AccountId?: string;
}
export const CreateOpsItemRequest = S.suspend(() =>
  S.Struct({
    Description: S.String,
    OpsItemType: S.optional(S.String),
    OperationalData: S.optional(OpsItemOperationalData),
    Notifications: S.optional(OpsItemNotifications),
    Priority: S.optional(S.Number),
    RelatedOpsItems: S.optional(RelatedOpsItems),
    Source: S.String,
    Title: S.String,
    Tags: S.optional(TagList),
    Category: S.optional(S.String),
    Severity: S.optional(S.String),
    ActualStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ActualEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PlannedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PlannedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOpsItemRequest",
}) as any as S.Schema<CreateOpsItemRequest>;
export interface CreateOpsMetadataRequest {
  ResourceId: string;
  Metadata?: MetadataMap;
  Tags?: TagList;
}
export const CreateOpsMetadataRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String,
    Metadata: S.optional(MetadataMap),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOpsMetadataRequest",
}) as any as S.Schema<CreateOpsMetadataRequest>;
export interface CreatePatchBaselineRequest {
  OperatingSystem?: string;
  Name: string;
  GlobalFilters?: PatchFilterGroup;
  ApprovalRules?: PatchRuleGroup;
  ApprovedPatches?: PatchIdList;
  ApprovedPatchesComplianceLevel?: string;
  ApprovedPatchesEnableNonSecurity?: boolean;
  RejectedPatches?: PatchIdList;
  RejectedPatchesAction?: string;
  Description?: string;
  Sources?: PatchSourceList;
  AvailableSecurityUpdatesComplianceStatus?: string;
  ClientToken?: string;
  Tags?: TagList;
}
export const CreatePatchBaselineRequest = S.suspend(() =>
  S.Struct({
    OperatingSystem: S.optional(S.String),
    Name: S.String,
    GlobalFilters: S.optional(PatchFilterGroup),
    ApprovalRules: S.optional(PatchRuleGroup),
    ApprovedPatches: S.optional(PatchIdList),
    ApprovedPatchesComplianceLevel: S.optional(S.String),
    ApprovedPatchesEnableNonSecurity: S.optional(S.Boolean),
    RejectedPatches: S.optional(PatchIdList),
    RejectedPatchesAction: S.optional(S.String),
    Description: S.optional(S.String),
    Sources: S.optional(PatchSourceList),
    AvailableSecurityUpdatesComplianceStatus: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePatchBaselineRequest",
}) as any as S.Schema<CreatePatchBaselineRequest>;
export type NormalStringMap = { [key: string]: string };
export const NormalStringMap = S.Record({ key: S.String, value: S.String });
export interface FailureDetails {
  FailureStage?: string;
  FailureType?: string;
  Details?: AutomationParameterMap;
}
export const FailureDetails = S.suspend(() =>
  S.Struct({
    FailureStage: S.optional(S.String),
    FailureType: S.optional(S.String),
    Details: S.optional(AutomationParameterMap),
  }),
).annotations({
  identifier: "FailureDetails",
}) as any as S.Schema<FailureDetails>;
export interface ParentStepDetails {
  StepExecutionId?: string;
  StepName?: string;
  Action?: string;
  Iteration?: number;
  IteratorValue?: string;
}
export const ParentStepDetails = S.suspend(() =>
  S.Struct({
    StepExecutionId: S.optional(S.String),
    StepName: S.optional(S.String),
    Action: S.optional(S.String),
    Iteration: S.optional(S.Number),
    IteratorValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ParentStepDetails",
}) as any as S.Schema<ParentStepDetails>;
export interface StepExecution {
  StepName?: string;
  Action?: string;
  TimeoutSeconds?: number;
  OnFailure?: string;
  MaxAttempts?: number;
  ExecutionStartTime?: Date;
  ExecutionEndTime?: Date;
  StepStatus?: string;
  ResponseCode?: string;
  Inputs?: NormalStringMap;
  Outputs?: AutomationParameterMap;
  Response?: string;
  FailureMessage?: string;
  FailureDetails?: FailureDetails;
  StepExecutionId?: string;
  OverriddenParameters?: AutomationParameterMap;
  IsEnd?: boolean;
  NextStep?: string;
  IsCritical?: boolean;
  ValidNextSteps?: ValidNextStepList;
  Targets?: Targets;
  TargetLocation?: TargetLocation;
  TriggeredAlarms?: AlarmStateInformationList;
  ParentStepDetails?: ParentStepDetails;
}
export const StepExecution = S.suspend(() =>
  S.Struct({
    StepName: S.optional(S.String),
    Action: S.optional(S.String),
    TimeoutSeconds: S.optional(S.Number),
    OnFailure: S.optional(S.String),
    MaxAttempts: S.optional(S.Number),
    ExecutionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExecutionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StepStatus: S.optional(S.String),
    ResponseCode: S.optional(S.String),
    Inputs: S.optional(NormalStringMap),
    Outputs: S.optional(AutomationParameterMap),
    Response: S.optional(S.String),
    FailureMessage: S.optional(S.String),
    FailureDetails: S.optional(FailureDetails),
    StepExecutionId: S.optional(S.String),
    OverriddenParameters: S.optional(AutomationParameterMap),
    IsEnd: S.optional(S.Boolean),
    NextStep: S.optional(S.String),
    IsCritical: S.optional(S.Boolean),
    ValidNextSteps: S.optional(ValidNextStepList),
    Targets: S.optional(Targets),
    TargetLocation: S.optional(TargetLocation),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
    ParentStepDetails: S.optional(ParentStepDetails),
  }),
).annotations({
  identifier: "StepExecution",
}) as any as S.Schema<StepExecution>;
export type StepExecutionList = StepExecution[];
export const StepExecutionList = S.Array(StepExecution);
export interface DescribeAutomationStepExecutionsResult {
  StepExecutions?: StepExecutionList;
  NextToken?: string;
}
export const DescribeAutomationStepExecutionsResult = S.suspend(() =>
  S.Struct({
    StepExecutions: S.optional(StepExecutionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAutomationStepExecutionsResult",
}) as any as S.Schema<DescribeAutomationStepExecutionsResult>;
export interface DescribeAvailablePatchesResult {
  Patches?: PatchList;
  NextToken?: string;
}
export const DescribeAvailablePatchesResult = S.suspend(() =>
  S.Struct({
    Patches: S.optional(PatchList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAvailablePatchesResult",
}) as any as S.Schema<DescribeAvailablePatchesResult>;
export interface DescribeDocumentPermissionResponse {
  AccountIds?: AccountIdList;
  AccountSharingInfoList?: AccountSharingInfoList;
  NextToken?: string;
}
export const DescribeDocumentPermissionResponse = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIdList),
    AccountSharingInfoList: S.optional(AccountSharingInfoList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDocumentPermissionResponse",
}) as any as S.Schema<DescribeDocumentPermissionResponse>;
export interface DescribeEffectiveInstanceAssociationsResult {
  Associations?: InstanceAssociationList;
  NextToken?: string;
}
export const DescribeEffectiveInstanceAssociationsResult = S.suspend(() =>
  S.Struct({
    Associations: S.optional(InstanceAssociationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEffectiveInstanceAssociationsResult",
}) as any as S.Schema<DescribeEffectiveInstanceAssociationsResult>;
export interface DescribeInstancePatchesResult {
  Patches?: PatchComplianceDataList;
  NextToken?: string;
}
export const DescribeInstancePatchesResult = S.suspend(() =>
  S.Struct({
    Patches: S.optional(PatchComplianceDataList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstancePatchesResult",
}) as any as S.Schema<DescribeInstancePatchesResult>;
export interface DescribeInstancePatchStatesResult {
  InstancePatchStates?: InstancePatchStateList;
  NextToken?: string;
}
export const DescribeInstancePatchStatesResult = S.suspend(() =>
  S.Struct({
    InstancePatchStates: S.optional(InstancePatchStateList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstancePatchStatesResult",
}) as any as S.Schema<DescribeInstancePatchStatesResult>;
export interface DescribeInstancePatchStatesForPatchGroupResult {
  InstancePatchStates?: InstancePatchStatesList;
  NextToken?: string;
}
export const DescribeInstancePatchStatesForPatchGroupResult = S.suspend(() =>
  S.Struct({
    InstancePatchStates: S.optional(InstancePatchStatesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstancePatchStatesForPatchGroupResult",
}) as any as S.Schema<DescribeInstancePatchStatesForPatchGroupResult>;
export interface DescribeInventoryDeletionsResult {
  InventoryDeletions?: InventoryDeletionsList;
  NextToken?: string;
}
export const DescribeInventoryDeletionsResult = S.suspend(() =>
  S.Struct({
    InventoryDeletions: S.optional(InventoryDeletionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInventoryDeletionsResult",
}) as any as S.Schema<DescribeInventoryDeletionsResult>;
export interface DescribeMaintenanceWindowExecutionTaskInvocationsResult {
  WindowExecutionTaskInvocationIdentities?: MaintenanceWindowExecutionTaskInvocationIdentityList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionTaskInvocationsResult =
  S.suspend(() =>
    S.Struct({
      WindowExecutionTaskInvocationIdentities: S.optional(
        MaintenanceWindowExecutionTaskInvocationIdentityList,
      ),
      NextToken: S.optional(S.String),
    }).pipe(ns),
  ).annotations({
    identifier: "DescribeMaintenanceWindowExecutionTaskInvocationsResult",
  }) as any as S.Schema<DescribeMaintenanceWindowExecutionTaskInvocationsResult>;
export interface DescribeMaintenanceWindowExecutionTasksResult {
  WindowExecutionTaskIdentities?: MaintenanceWindowExecutionTaskIdentityList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionTasksResult = S.suspend(() =>
  S.Struct({
    WindowExecutionTaskIdentities: S.optional(
      MaintenanceWindowExecutionTaskIdentityList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowExecutionTasksResult",
}) as any as S.Schema<DescribeMaintenanceWindowExecutionTasksResult>;
export interface DescribeMaintenanceWindowsResult {
  WindowIdentities?: MaintenanceWindowIdentityList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowsResult = S.suspend(() =>
  S.Struct({
    WindowIdentities: S.optional(MaintenanceWindowIdentityList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowsResult",
}) as any as S.Schema<DescribeMaintenanceWindowsResult>;
export interface DescribeMaintenanceWindowScheduleResult {
  ScheduledWindowExecutions?: ScheduledWindowExecutionList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowScheduleResult = S.suspend(() =>
  S.Struct({
    ScheduledWindowExecutions: S.optional(ScheduledWindowExecutionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowScheduleResult",
}) as any as S.Schema<DescribeMaintenanceWindowScheduleResult>;
export interface DescribeMaintenanceWindowsForTargetResult {
  WindowIdentities?: MaintenanceWindowsForTargetList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowsForTargetResult = S.suspend(() =>
  S.Struct({
    WindowIdentities: S.optional(MaintenanceWindowsForTargetList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowsForTargetResult",
}) as any as S.Schema<DescribeMaintenanceWindowsForTargetResult>;
export interface DescribeMaintenanceWindowTargetsResult {
  Targets?: MaintenanceWindowTargetList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowTargetsResult = S.suspend(() =>
  S.Struct({
    Targets: S.optional(MaintenanceWindowTargetList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowTargetsResult",
}) as any as S.Schema<DescribeMaintenanceWindowTargetsResult>;
export interface DescribeMaintenanceWindowTasksResult {
  Tasks?: MaintenanceWindowTaskList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowTasksResult = S.suspend(() =>
  S.Struct({
    Tasks: S.optional(MaintenanceWindowTaskList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowTasksResult",
}) as any as S.Schema<DescribeMaintenanceWindowTasksResult>;
export interface DescribePatchBaselinesResult {
  BaselineIdentities?: PatchBaselineIdentityList;
  NextToken?: string;
}
export const DescribePatchBaselinesResult = S.suspend(() =>
  S.Struct({
    BaselineIdentities: S.optional(PatchBaselineIdentityList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePatchBaselinesResult",
}) as any as S.Schema<DescribePatchBaselinesResult>;
export interface DescribePatchGroupsResult {
  Mappings?: PatchGroupPatchBaselineMappingList;
  NextToken?: string;
}
export const DescribePatchGroupsResult = S.suspend(() =>
  S.Struct({
    Mappings: S.optional(PatchGroupPatchBaselineMappingList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePatchGroupsResult",
}) as any as S.Schema<DescribePatchGroupsResult>;
export interface DescribePatchPropertiesResult {
  Properties?: PatchPropertiesList;
  NextToken?: string;
}
export const DescribePatchPropertiesResult = S.suspend(() =>
  S.Struct({
    Properties: S.optional(PatchPropertiesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePatchPropertiesResult",
}) as any as S.Schema<DescribePatchPropertiesResult>;
export interface GetAccessTokenResponse {
  Credentials?: Credentials;
  AccessRequestStatus?: string;
}
export const GetAccessTokenResponse = S.suspend(() =>
  S.Struct({
    Credentials: S.optional(Credentials),
    AccessRequestStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetAccessTokenResponse",
}) as any as S.Schema<GetAccessTokenResponse>;
export interface GetDeployablePatchSnapshotForInstanceResult {
  InstanceId?: string;
  SnapshotId?: string;
  SnapshotDownloadUrl?: string;
  Product?: string;
}
export const GetDeployablePatchSnapshotForInstanceResult = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    SnapshotId: S.optional(S.String),
    SnapshotDownloadUrl: S.optional(S.String),
    Product: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDeployablePatchSnapshotForInstanceResult",
}) as any as S.Schema<GetDeployablePatchSnapshotForInstanceResult>;
export interface GetDocumentResult {
  Name?: string;
  CreatedDate?: Date;
  DisplayName?: string;
  VersionName?: string;
  DocumentVersion?: string;
  Status?: string;
  StatusInformation?: string;
  Content?: string;
  DocumentType?: string;
  DocumentFormat?: string;
  Requires?: DocumentRequiresList;
  AttachmentsContent?: AttachmentContentList;
  ReviewStatus?: string;
}
export const GetDocumentResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisplayName: S.optional(S.String),
    VersionName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Status: S.optional(S.String),
    StatusInformation: S.optional(S.String),
    Content: S.optional(S.String),
    DocumentType: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
    Requires: S.optional(DocumentRequiresList),
    AttachmentsContent: S.optional(AttachmentContentList),
    ReviewStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDocumentResult",
}) as any as S.Schema<GetDocumentResult>;
export interface GetInventoryRequest {
  Filters?: InventoryFilterList;
  Aggregators?: InventoryAggregatorList;
  ResultAttributes?: ResultAttributeList;
  NextToken?: string;
  MaxResults?: number;
}
export const GetInventoryRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(InventoryFilterList),
    Aggregators: S.optional(InventoryAggregatorList),
    ResultAttributes: S.optional(ResultAttributeList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInventoryRequest",
}) as any as S.Schema<GetInventoryRequest>;
export interface GetMaintenanceWindowExecutionTaskResult {
  WindowExecutionId?: string;
  TaskExecutionId?: string;
  TaskArn?: string;
  ServiceRole?: string;
  Type?: string;
  TaskParameters?: MaintenanceWindowTaskParametersList;
  Priority?: number;
  MaxConcurrency?: string;
  MaxErrors?: string;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
}
export const GetMaintenanceWindowExecutionTaskResult = S.suspend(() =>
  S.Struct({
    WindowExecutionId: S.optional(S.String),
    TaskExecutionId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    ServiceRole: S.optional(S.String),
    Type: S.optional(S.String),
    TaskParameters: S.optional(MaintenanceWindowTaskParametersList),
    Priority: S.optional(S.Number),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
  }).pipe(ns),
).annotations({
  identifier: "GetMaintenanceWindowExecutionTaskResult",
}) as any as S.Schema<GetMaintenanceWindowExecutionTaskResult>;
export interface GetOpsItemResponse {
  OpsItem?: OpsItem;
}
export const GetOpsItemResponse = S.suspend(() =>
  S.Struct({ OpsItem: S.optional(OpsItem) }).pipe(ns),
).annotations({
  identifier: "GetOpsItemResponse",
}) as any as S.Schema<GetOpsItemResponse>;
export interface GetOpsSummaryRequest {
  SyncName?: string;
  Filters?: OpsFilterList;
  Aggregators?: OpsAggregatorList;
  ResultAttributes?: OpsResultAttributeList;
  NextToken?: string;
  MaxResults?: number;
}
export const GetOpsSummaryRequest = S.suspend(() =>
  S.Struct({
    SyncName: S.optional(S.String),
    Filters: S.optional(OpsFilterList),
    Aggregators: S.optional(OpsAggregatorList),
    ResultAttributes: S.optional(OpsResultAttributeList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpsSummaryRequest",
}) as any as S.Schema<GetOpsSummaryRequest>;
export interface GetParameterResult {
  Parameter?: Parameter;
}
export const GetParameterResult = S.suspend(() =>
  S.Struct({ Parameter: S.optional(Parameter) }).pipe(ns),
).annotations({
  identifier: "GetParameterResult",
}) as any as S.Schema<GetParameterResult>;
export interface GetResourcePoliciesResponse {
  NextToken?: string;
  Policies?: GetResourcePoliciesResponseEntries;
}
export const GetResourcePoliciesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Policies: S.optional(GetResourcePoliciesResponseEntries),
  }).pipe(ns),
).annotations({
  identifier: "GetResourcePoliciesResponse",
}) as any as S.Schema<GetResourcePoliciesResponse>;
export interface GetServiceSettingResult {
  ServiceSetting?: ServiceSetting;
}
export const GetServiceSettingResult = S.suspend(() =>
  S.Struct({ ServiceSetting: S.optional(ServiceSetting) }).pipe(ns),
).annotations({
  identifier: "GetServiceSettingResult",
}) as any as S.Schema<GetServiceSettingResult>;
export interface ListAssociationVersionsResult {
  AssociationVersions?: AssociationVersionList;
  NextToken?: string;
}
export const ListAssociationVersionsResult = S.suspend(() =>
  S.Struct({
    AssociationVersions: S.optional(AssociationVersionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAssociationVersionsResult",
}) as any as S.Schema<ListAssociationVersionsResult>;
export interface ListCommandsResult {
  Commands?: CommandList;
  NextToken?: string;
}
export const ListCommandsResult = S.suspend(() =>
  S.Struct({
    Commands: S.optional(CommandList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCommandsResult",
}) as any as S.Schema<ListCommandsResult>;
export interface ListDocumentVersionsResult {
  DocumentVersions?: DocumentVersionList;
  NextToken?: string;
}
export const ListDocumentVersionsResult = S.suspend(() =>
  S.Struct({
    DocumentVersions: S.optional(DocumentVersionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDocumentVersionsResult",
}) as any as S.Schema<ListDocumentVersionsResult>;
export interface ListResourceComplianceSummariesResult {
  ResourceComplianceSummaryItems?: ResourceComplianceSummaryItemList;
  NextToken?: string;
}
export const ListResourceComplianceSummariesResult = S.suspend(() =>
  S.Struct({
    ResourceComplianceSummaryItems: S.optional(
      ResourceComplianceSummaryItemList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceComplianceSummariesResult",
}) as any as S.Schema<ListResourceComplianceSummariesResult>;
export interface PutComplianceItemsRequest {
  ResourceId: string;
  ResourceType: string;
  ComplianceType: string;
  ExecutionSummary: ComplianceExecutionSummary;
  Items: ComplianceItemEntryList;
  ItemContentHash?: string;
  UploadType?: string;
}
export const PutComplianceItemsRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String,
    ResourceType: S.String,
    ComplianceType: S.String,
    ExecutionSummary: ComplianceExecutionSummary,
    Items: ComplianceItemEntryList,
    ItemContentHash: S.optional(S.String),
    UploadType: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutComplianceItemsRequest",
}) as any as S.Schema<PutComplianceItemsRequest>;
export interface PutComplianceItemsResult {}
export const PutComplianceItemsResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutComplianceItemsResult",
}) as any as S.Schema<PutComplianceItemsResult>;
export interface PutInventoryRequest {
  InstanceId: string;
  Items: InventoryItemList;
}
export const PutInventoryRequest = S.suspend(() =>
  S.Struct({ InstanceId: S.String, Items: InventoryItemList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutInventoryRequest",
}) as any as S.Schema<PutInventoryRequest>;
export interface RegisterTaskWithMaintenanceWindowRequest {
  WindowId: string;
  Targets?: Targets;
  TaskArn: string;
  ServiceRoleArn?: string;
  TaskType: string;
  TaskParameters?: MaintenanceWindowTaskParameters;
  TaskInvocationParameters?: MaintenanceWindowTaskInvocationParameters;
  Priority?: number;
  MaxConcurrency?: string;
  MaxErrors?: string;
  LoggingInfo?: LoggingInfo;
  Name?: string;
  Description?: string | Redacted.Redacted<string>;
  ClientToken?: string;
  CutoffBehavior?: string;
  AlarmConfiguration?: AlarmConfiguration;
}
export const RegisterTaskWithMaintenanceWindowRequest = S.suspend(() =>
  S.Struct({
    WindowId: S.String,
    Targets: S.optional(Targets),
    TaskArn: S.String,
    ServiceRoleArn: S.optional(S.String),
    TaskType: S.String,
    TaskParameters: S.optional(MaintenanceWindowTaskParameters),
    TaskInvocationParameters: S.optional(
      MaintenanceWindowTaskInvocationParameters,
    ),
    Priority: S.optional(S.Number),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    LoggingInfo: S.optional(LoggingInfo),
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    ClientToken: S.optional(S.String),
    CutoffBehavior: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterTaskWithMaintenanceWindowRequest",
}) as any as S.Schema<RegisterTaskWithMaintenanceWindowRequest>;
export interface SendCommandResult {
  Command?: Command;
}
export const SendCommandResult = S.suspend(() =>
  S.Struct({ Command: S.optional(Command) }).pipe(ns),
).annotations({
  identifier: "SendCommandResult",
}) as any as S.Schema<SendCommandResult>;
export interface StartChangeRequestExecutionResult {
  AutomationExecutionId?: string;
}
export const StartChangeRequestExecutionResult = S.suspend(() =>
  S.Struct({ AutomationExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartChangeRequestExecutionResult",
}) as any as S.Schema<StartChangeRequestExecutionResult>;
export interface StartExecutionPreviewRequest {
  DocumentName: string;
  DocumentVersion?: string;
  ExecutionInputs?: (typeof ExecutionInputs)["Type"];
}
export const StartExecutionPreviewRequest = S.suspend(() =>
  S.Struct({
    DocumentName: S.String,
    DocumentVersion: S.optional(S.String),
    ExecutionInputs: S.optional(ExecutionInputs),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartExecutionPreviewRequest",
}) as any as S.Schema<StartExecutionPreviewRequest>;
export interface StartSessionResponse {
  SessionId?: string;
  TokenValue?: string;
  StreamUrl?: string;
}
export const StartSessionResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    TokenValue: S.optional(S.String),
    StreamUrl: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "StartSessionResponse",
}) as any as S.Schema<StartSessionResponse>;
export interface UpdateAssociationStatusResult {
  AssociationDescription?: AssociationDescription;
}
export const UpdateAssociationStatusResult = S.suspend(() =>
  S.Struct({ AssociationDescription: S.optional(AssociationDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateAssociationStatusResult",
}) as any as S.Schema<UpdateAssociationStatusResult>;
export interface UpdateDocumentDefaultVersionResult {
  Description?: DocumentDefaultVersionDescription;
}
export const UpdateDocumentDefaultVersionResult = S.suspend(() =>
  S.Struct({ Description: S.optional(DocumentDefaultVersionDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateDocumentDefaultVersionResult",
}) as any as S.Schema<UpdateDocumentDefaultVersionResult>;
export interface UpdateDocumentMetadataRequest {
  Name: string;
  DocumentVersion?: string;
  DocumentReviews: DocumentReviews;
}
export const UpdateDocumentMetadataRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DocumentVersion: S.optional(S.String),
    DocumentReviews: DocumentReviews,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDocumentMetadataRequest",
}) as any as S.Schema<UpdateDocumentMetadataRequest>;
export interface UpdateDocumentMetadataResponse {}
export const UpdateDocumentMetadataResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDocumentMetadataResponse",
}) as any as S.Schema<UpdateDocumentMetadataResponse>;
export interface PatchStatus {
  DeploymentStatus?: string;
  ComplianceLevel?: string;
  ApprovalDate?: Date;
}
export const PatchStatus = S.suspend(() =>
  S.Struct({
    DeploymentStatus: S.optional(S.String),
    ComplianceLevel: S.optional(S.String),
    ApprovalDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "PatchStatus" }) as any as S.Schema<PatchStatus>;
export interface ResolvedTargets {
  ParameterValues?: TargetParameterList;
  Truncated?: boolean;
}
export const ResolvedTargets = S.suspend(() =>
  S.Struct({
    ParameterValues: S.optional(TargetParameterList),
    Truncated: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResolvedTargets",
}) as any as S.Schema<ResolvedTargets>;
export interface ProgressCounters {
  TotalSteps?: number;
  SuccessSteps?: number;
  FailedSteps?: number;
  CancelledSteps?: number;
  TimedOutSteps?: number;
}
export const ProgressCounters = S.suspend(() =>
  S.Struct({
    TotalSteps: S.optional(S.Number),
    SuccessSteps: S.optional(S.Number),
    FailedSteps: S.optional(S.Number),
    CancelledSteps: S.optional(S.Number),
    TimedOutSteps: S.optional(S.Number),
  }),
).annotations({
  identifier: "ProgressCounters",
}) as any as S.Schema<ProgressCounters>;
export interface InventoryItemAttribute {
  Name: string;
  DataType: string;
}
export const InventoryItemAttribute = S.suspend(() =>
  S.Struct({ Name: S.String, DataType: S.String }),
).annotations({
  identifier: "InventoryItemAttribute",
}) as any as S.Schema<InventoryItemAttribute>;
export type InventoryItemAttributeList = InventoryItemAttribute[];
export const InventoryItemAttributeList = S.Array(
  InventoryItemAttribute.pipe(T.XmlName("Attribute")).annotations({
    identifier: "InventoryItemAttribute",
  }),
);
export interface ParameterInlinePolicy {
  PolicyText?: string;
  PolicyType?: string;
  PolicyStatus?: string;
}
export const ParameterInlinePolicy = S.suspend(() =>
  S.Struct({
    PolicyText: S.optional(S.String),
    PolicyType: S.optional(S.String),
    PolicyStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterInlinePolicy",
}) as any as S.Schema<ParameterInlinePolicy>;
export type ParameterPolicyList = ParameterInlinePolicy[];
export const ParameterPolicyList = S.Array(ParameterInlinePolicy);
export interface DocumentReviewerResponseSource {
  CreateTime?: Date;
  UpdatedTime?: Date;
  ReviewStatus?: string;
  Comment?: DocumentReviewCommentList;
  Reviewer?: string;
}
export const DocumentReviewerResponseSource = S.suspend(() =>
  S.Struct({
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReviewStatus: S.optional(S.String),
    Comment: S.optional(DocumentReviewCommentList),
    Reviewer: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentReviewerResponseSource",
}) as any as S.Schema<DocumentReviewerResponseSource>;
export type DocumentReviewerResponseList = DocumentReviewerResponseSource[];
export const DocumentReviewerResponseList = S.Array(
  DocumentReviewerResponseSource,
);
export interface ResourceDataSyncSourceWithState {
  SourceType?: string;
  AwsOrganizationsSource?: ResourceDataSyncAwsOrganizationsSource;
  SourceRegions?: ResourceDataSyncSourceRegionList;
  IncludeFutureRegions?: boolean;
  State?: string;
  EnableAllOpsDataSources?: boolean;
}
export const ResourceDataSyncSourceWithState = S.suspend(() =>
  S.Struct({
    SourceType: S.optional(S.String),
    AwsOrganizationsSource: S.optional(ResourceDataSyncAwsOrganizationsSource),
    SourceRegions: S.optional(ResourceDataSyncSourceRegionList),
    IncludeFutureRegions: S.optional(S.Boolean),
    State: S.optional(S.String),
    EnableAllOpsDataSources: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResourceDataSyncSourceWithState",
}) as any as S.Schema<ResourceDataSyncSourceWithState>;
export interface FailedCreateAssociation {
  Entry?: CreateAssociationBatchRequestEntry;
  Message?: string;
  Fault?: string;
}
export const FailedCreateAssociation = S.suspend(() =>
  S.Struct({
    Entry: S.optional(CreateAssociationBatchRequestEntry),
    Message: S.optional(S.String),
    Fault: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedCreateAssociation",
}) as any as S.Schema<FailedCreateAssociation>;
export type FailedCreateAssociationList = FailedCreateAssociation[];
export const FailedCreateAssociationList = S.Array(
  FailedCreateAssociation.pipe(
    T.XmlName("FailedCreateAssociationEntry"),
  ).annotations({ identifier: "FailedCreateAssociation" }),
);
export interface Activation {
  ActivationId?: string;
  Description?: string;
  DefaultInstanceName?: string;
  IamRole?: string;
  RegistrationLimit?: number;
  RegistrationsCount?: number;
  ExpirationDate?: Date;
  Expired?: boolean;
  CreatedDate?: Date;
  Tags?: TagList;
}
export const Activation = S.suspend(() =>
  S.Struct({
    ActivationId: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultInstanceName: S.optional(S.String),
    IamRole: S.optional(S.String),
    RegistrationLimit: S.optional(S.Number),
    RegistrationsCount: S.optional(S.Number),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Expired: S.optional(S.Boolean),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(TagList),
  }),
).annotations({ identifier: "Activation" }) as any as S.Schema<Activation>;
export type ActivationList = Activation[];
export const ActivationList = S.Array(Activation);
export interface AssociationExecution {
  AssociationId?: string;
  AssociationVersion?: string;
  ExecutionId?: string;
  Status?: string;
  DetailedStatus?: string;
  CreatedTime?: Date;
  LastExecutionDate?: Date;
  ResourceCountByStatus?: string;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
}
export const AssociationExecution = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    ExecutionId: S.optional(S.String),
    Status: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceCountByStatus: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
  }),
).annotations({
  identifier: "AssociationExecution",
}) as any as S.Schema<AssociationExecution>;
export type AssociationExecutionsList = AssociationExecution[];
export const AssociationExecutionsList = S.Array(
  AssociationExecution.pipe(T.XmlName("AssociationExecution")).annotations({
    identifier: "AssociationExecution",
  }),
);
export interface AutomationExecutionMetadata {
  AutomationExecutionId?: string;
  DocumentName?: string;
  DocumentVersion?: string;
  AutomationExecutionStatus?: string;
  ExecutionStartTime?: Date;
  ExecutionEndTime?: Date;
  ExecutedBy?: string;
  LogFile?: string;
  Outputs?: AutomationParameterMap;
  Mode?: string;
  ParentAutomationExecutionId?: string;
  CurrentStepName?: string;
  CurrentAction?: string;
  FailureMessage?: string;
  TargetParameterName?: string;
  Targets?: Targets;
  TargetMaps?: TargetMaps;
  ResolvedTargets?: ResolvedTargets;
  MaxConcurrency?: string;
  MaxErrors?: string;
  Target?: string;
  AutomationType?: string;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
  TargetLocationsURL?: string;
  AutomationSubtype?: string;
  ScheduledTime?: Date;
  Runbooks?: Runbooks;
  OpsItemId?: string;
  AssociationId?: string;
  ChangeRequestName?: string;
}
export const AutomationExecutionMetadata = S.suspend(() =>
  S.Struct({
    AutomationExecutionId: S.optional(S.String),
    DocumentName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    AutomationExecutionStatus: S.optional(S.String),
    ExecutionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExecutionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExecutedBy: S.optional(S.String),
    LogFile: S.optional(S.String),
    Outputs: S.optional(AutomationParameterMap),
    Mode: S.optional(S.String),
    ParentAutomationExecutionId: S.optional(S.String),
    CurrentStepName: S.optional(S.String),
    CurrentAction: S.optional(S.String),
    FailureMessage: S.optional(S.String),
    TargetParameterName: S.optional(S.String),
    Targets: S.optional(Targets),
    TargetMaps: S.optional(TargetMaps),
    ResolvedTargets: S.optional(ResolvedTargets),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    Target: S.optional(S.String),
    AutomationType: S.optional(S.String),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
    TargetLocationsURL: S.optional(S.String),
    AutomationSubtype: S.optional(S.String),
    ScheduledTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Runbooks: S.optional(Runbooks),
    OpsItemId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    ChangeRequestName: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomationExecutionMetadata",
}) as any as S.Schema<AutomationExecutionMetadata>;
export type AutomationExecutionMetadataList = AutomationExecutionMetadata[];
export const AutomationExecutionMetadataList = S.Array(
  AutomationExecutionMetadata,
);
export interface EffectivePatch {
  Patch?: Patch;
  PatchStatus?: PatchStatus;
}
export const EffectivePatch = S.suspend(() =>
  S.Struct({ Patch: S.optional(Patch), PatchStatus: S.optional(PatchStatus) }),
).annotations({
  identifier: "EffectivePatch",
}) as any as S.Schema<EffectivePatch>;
export type EffectivePatchList = EffectivePatch[];
export const EffectivePatchList = S.Array(EffectivePatch);
export type InstanceAssociationStatusAggregatedCount = {
  [key: string]: number;
};
export const InstanceAssociationStatusAggregatedCount = S.Record({
  key: S.String,
  value: S.Number,
});
export interface InstanceAggregatedAssociationOverview {
  DetailedStatus?: string;
  InstanceAssociationStatusAggregatedCount?: InstanceAssociationStatusAggregatedCount;
}
export const InstanceAggregatedAssociationOverview = S.suspend(() =>
  S.Struct({
    DetailedStatus: S.optional(S.String),
    InstanceAssociationStatusAggregatedCount: S.optional(
      InstanceAssociationStatusAggregatedCount,
    ),
  }),
).annotations({
  identifier: "InstanceAggregatedAssociationOverview",
}) as any as S.Schema<InstanceAggregatedAssociationOverview>;
export interface InstanceProperty {
  Name?: string;
  InstanceId?: string;
  InstanceType?: string;
  InstanceRole?: string;
  KeyName?: string;
  InstanceState?: string;
  Architecture?: string;
  IPAddress?: string | Redacted.Redacted<string>;
  LaunchTime?: Date;
  PingStatus?: string;
  LastPingDateTime?: Date;
  AgentVersion?: string;
  PlatformType?: string;
  PlatformName?: string;
  PlatformVersion?: string;
  ActivationId?: string;
  IamRole?: string;
  RegistrationDate?: Date;
  ResourceType?: string;
  ComputerName?: string;
  AssociationStatus?: string;
  LastAssociationExecutionDate?: Date;
  LastSuccessfulAssociationExecutionDate?: Date;
  AssociationOverview?: InstanceAggregatedAssociationOverview;
  SourceId?: string;
  SourceType?: string;
}
export const InstanceProperty = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceId: S.optional(S.String),
    InstanceType: S.optional(S.String),
    InstanceRole: S.optional(S.String),
    KeyName: S.optional(S.String),
    InstanceState: S.optional(S.String),
    Architecture: S.optional(S.String),
    IPAddress: S.optional(SensitiveString),
    LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PingStatus: S.optional(S.String),
    LastPingDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AgentVersion: S.optional(S.String),
    PlatformType: S.optional(S.String),
    PlatformName: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    ActivationId: S.optional(S.String),
    IamRole: S.optional(S.String),
    RegistrationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceType: S.optional(S.String),
    ComputerName: S.optional(S.String),
    AssociationStatus: S.optional(S.String),
    LastAssociationExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessfulAssociationExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AssociationOverview: S.optional(InstanceAggregatedAssociationOverview),
    SourceId: S.optional(S.String),
    SourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceProperty",
}) as any as S.Schema<InstanceProperty>;
export type InstanceProperties = InstanceProperty[];
export const InstanceProperties = S.Array(
  InstanceProperty.pipe(T.XmlName("InstanceProperty")).annotations({
    identifier: "InstanceProperty",
  }),
);
export interface MaintenanceWindowExecution {
  WindowId?: string;
  WindowExecutionId?: string;
  Status?: string;
  StatusDetails?: string;
  StartTime?: Date;
  EndTime?: Date;
}
export const MaintenanceWindowExecution = S.suspend(() =>
  S.Struct({
    WindowId: S.optional(S.String),
    WindowExecutionId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MaintenanceWindowExecution",
}) as any as S.Schema<MaintenanceWindowExecution>;
export type MaintenanceWindowExecutionList = MaintenanceWindowExecution[];
export const MaintenanceWindowExecutionList = S.Array(
  MaintenanceWindowExecution,
);
export interface OpsItemSummary {
  CreatedBy?: string;
  CreatedTime?: Date;
  LastModifiedBy?: string;
  LastModifiedTime?: Date;
  Priority?: number;
  Source?: string;
  Status?: string;
  OpsItemId?: string;
  Title?: string;
  OperationalData?: OpsItemOperationalData;
  Category?: string;
  Severity?: string;
  OpsItemType?: string;
  ActualStartTime?: Date;
  ActualEndTime?: Date;
  PlannedStartTime?: Date;
  PlannedEndTime?: Date;
}
export const OpsItemSummary = S.suspend(() =>
  S.Struct({
    CreatedBy: S.optional(S.String),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedBy: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Priority: S.optional(S.Number),
    Source: S.optional(S.String),
    Status: S.optional(S.String),
    OpsItemId: S.optional(S.String),
    Title: S.optional(S.String),
    OperationalData: S.optional(OpsItemOperationalData),
    Category: S.optional(S.String),
    Severity: S.optional(S.String),
    OpsItemType: S.optional(S.String),
    ActualStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ActualEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PlannedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PlannedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OpsItemSummary",
}) as any as S.Schema<OpsItemSummary>;
export type OpsItemSummaries = OpsItemSummary[];
export const OpsItemSummaries = S.Array(OpsItemSummary);
export interface ParameterMetadata {
  Name?: string;
  ARN?: string;
  Type?: string;
  KeyId?: string;
  LastModifiedDate?: Date;
  LastModifiedUser?: string;
  Description?: string;
  AllowedPattern?: string;
  Version?: number;
  Tier?: string;
  Policies?: ParameterPolicyList;
  DataType?: string;
}
export const ParameterMetadata = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ARN: S.optional(S.String),
    Type: S.optional(S.String),
    KeyId: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedUser: S.optional(S.String),
    Description: S.optional(S.String),
    AllowedPattern: S.optional(S.String),
    Version: S.optional(S.Number),
    Tier: S.optional(S.String),
    Policies: S.optional(ParameterPolicyList),
    DataType: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterMetadata",
}) as any as S.Schema<ParameterMetadata>;
export type ParameterMetadataList = ParameterMetadata[];
export const ParameterMetadataList = S.Array(ParameterMetadata);
export interface InventoryItemSchema {
  TypeName: string;
  Version?: string;
  Attributes: InventoryItemAttributeList;
  DisplayName?: string;
}
export const InventoryItemSchema = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    Version: S.optional(S.String),
    Attributes: InventoryItemAttributeList,
    DisplayName: S.optional(S.String),
  }),
).annotations({
  identifier: "InventoryItemSchema",
}) as any as S.Schema<InventoryItemSchema>;
export type InventoryItemSchemaResultList = InventoryItemSchema[];
export const InventoryItemSchemaResultList = S.Array(InventoryItemSchema);
export interface ParameterHistory {
  Name?: string;
  Type?: string;
  KeyId?: string;
  LastModifiedDate?: Date;
  LastModifiedUser?: string;
  Description?: string;
  Value?: string | Redacted.Redacted<string>;
  AllowedPattern?: string;
  Version?: number;
  Labels?: ParameterLabelList;
  Tier?: string;
  Policies?: ParameterPolicyList;
  DataType?: string;
}
export const ParameterHistory = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    KeyId: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedUser: S.optional(S.String),
    Description: S.optional(S.String),
    Value: S.optional(SensitiveString),
    AllowedPattern: S.optional(S.String),
    Version: S.optional(S.Number),
    Labels: S.optional(ParameterLabelList),
    Tier: S.optional(S.String),
    Policies: S.optional(ParameterPolicyList),
    DataType: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterHistory",
}) as any as S.Schema<ParameterHistory>;
export type ParameterHistoryList = ParameterHistory[];
export const ParameterHistoryList = S.Array(ParameterHistory);
export interface Association {
  Name?: string;
  InstanceId?: string;
  AssociationId?: string;
  AssociationVersion?: string;
  DocumentVersion?: string;
  Targets?: Targets;
  LastExecutionDate?: Date;
  Overview?: AssociationOverview;
  ScheduleExpression?: string;
  AssociationName?: string;
  ScheduleOffset?: number;
  Duration?: number;
  TargetMaps?: TargetMaps;
}
export const Association = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Targets: S.optional(Targets),
    LastExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Overview: S.optional(AssociationOverview),
    ScheduleExpression: S.optional(S.String),
    AssociationName: S.optional(S.String),
    ScheduleOffset: S.optional(S.Number),
    Duration: S.optional(S.Number),
    TargetMaps: S.optional(TargetMaps),
  }),
).annotations({ identifier: "Association" }) as any as S.Schema<Association>;
export type AssociationList = Association[];
export const AssociationList = S.Array(
  Association.pipe(T.XmlName("Association")).annotations({
    identifier: "Association",
  }),
);
export interface ComplianceItem {
  ComplianceType?: string;
  ResourceType?: string;
  ResourceId?: string;
  Id?: string;
  Title?: string;
  Status?: string;
  Severity?: string;
  ExecutionSummary?: ComplianceExecutionSummary;
  Details?: ComplianceItemDetails;
}
export const ComplianceItem = S.suspend(() =>
  S.Struct({
    ComplianceType: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    Status: S.optional(S.String),
    Severity: S.optional(S.String),
    ExecutionSummary: S.optional(ComplianceExecutionSummary),
    Details: S.optional(ComplianceItemDetails),
  }),
).annotations({
  identifier: "ComplianceItem",
}) as any as S.Schema<ComplianceItem>;
export type ComplianceItemList = ComplianceItem[];
export const ComplianceItemList = S.Array(
  ComplianceItem.pipe(T.XmlName("Item")).annotations({
    identifier: "ComplianceItem",
  }),
);
export interface DocumentMetadataResponseInfo {
  ReviewerResponse?: DocumentReviewerResponseList;
}
export const DocumentMetadataResponseInfo = S.suspend(() =>
  S.Struct({ ReviewerResponse: S.optional(DocumentReviewerResponseList) }),
).annotations({
  identifier: "DocumentMetadataResponseInfo",
}) as any as S.Schema<DocumentMetadataResponseInfo>;
export interface DocumentIdentifier {
  Name?: string;
  CreatedDate?: Date;
  DisplayName?: string;
  Owner?: string;
  VersionName?: string;
  PlatformTypes?: PlatformTypeList;
  DocumentVersion?: string;
  DocumentType?: string;
  SchemaVersion?: string;
  DocumentFormat?: string;
  TargetType?: string;
  Tags?: TagList;
  Requires?: DocumentRequiresList;
  ReviewStatus?: string;
  Author?: string;
}
export const DocumentIdentifier = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisplayName: S.optional(S.String),
    Owner: S.optional(S.String),
    VersionName: S.optional(S.String),
    PlatformTypes: S.optional(PlatformTypeList),
    DocumentVersion: S.optional(S.String),
    DocumentType: S.optional(S.String),
    SchemaVersion: S.optional(S.String),
    DocumentFormat: S.optional(S.String),
    TargetType: S.optional(S.String),
    Tags: S.optional(TagList),
    Requires: S.optional(DocumentRequiresList),
    ReviewStatus: S.optional(S.String),
    Author: S.optional(S.String),
  }),
).annotations({
  identifier: "DocumentIdentifier",
}) as any as S.Schema<DocumentIdentifier>;
export type DocumentIdentifierList = DocumentIdentifier[];
export const DocumentIdentifierList = S.Array(
  DocumentIdentifier.pipe(T.XmlName("DocumentIdentifier")).annotations({
    identifier: "DocumentIdentifier",
  }),
);
export type NodeSummary = { [key: string]: string };
export const NodeSummary = S.Record({ key: S.String, value: S.String });
export type NodeSummaryList = NodeSummary[];
export const NodeSummaryList = S.Array(NodeSummary);
export interface OpsItemIdentity {
  Arn?: string;
}
export const OpsItemIdentity = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "OpsItemIdentity",
}) as any as S.Schema<OpsItemIdentity>;
export interface OpsItemRelatedItemSummary {
  OpsItemId?: string;
  AssociationId?: string;
  ResourceType?: string;
  AssociationType?: string;
  ResourceUri?: string;
  CreatedBy?: OpsItemIdentity;
  CreatedTime?: Date;
  LastModifiedBy?: OpsItemIdentity;
  LastModifiedTime?: Date;
}
export const OpsItemRelatedItemSummary = S.suspend(() =>
  S.Struct({
    OpsItemId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    AssociationType: S.optional(S.String),
    ResourceUri: S.optional(S.String),
    CreatedBy: S.optional(OpsItemIdentity),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedBy: S.optional(OpsItemIdentity),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "OpsItemRelatedItemSummary",
}) as any as S.Schema<OpsItemRelatedItemSummary>;
export type OpsItemRelatedItemSummaries = OpsItemRelatedItemSummary[];
export const OpsItemRelatedItemSummaries = S.Array(OpsItemRelatedItemSummary);
export interface OpsMetadata {
  ResourceId?: string;
  OpsMetadataArn?: string;
  LastModifiedDate?: Date;
  LastModifiedUser?: string;
  CreationDate?: Date;
}
export const OpsMetadata = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    OpsMetadataArn: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedUser: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "OpsMetadata" }) as any as S.Schema<OpsMetadata>;
export type OpsMetadataList = OpsMetadata[];
export const OpsMetadataList = S.Array(OpsMetadata);
export interface ResourceDataSyncItem {
  SyncName?: string;
  SyncType?: string;
  SyncSource?: ResourceDataSyncSourceWithState;
  S3Destination?: ResourceDataSyncS3Destination;
  LastSyncTime?: Date;
  LastSuccessfulSyncTime?: Date;
  SyncLastModifiedTime?: Date;
  LastStatus?: string;
  SyncCreatedTime?: Date;
  LastSyncStatusMessage?: string;
}
export const ResourceDataSyncItem = S.suspend(() =>
  S.Struct({
    SyncName: S.optional(S.String),
    SyncType: S.optional(S.String),
    SyncSource: S.optional(ResourceDataSyncSourceWithState),
    S3Destination: S.optional(ResourceDataSyncS3Destination),
    LastSyncTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastSuccessfulSyncTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SyncLastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastStatus: S.optional(S.String),
    SyncCreatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSyncStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceDataSyncItem",
}) as any as S.Schema<ResourceDataSyncItem>;
export type ResourceDataSyncItemList = ResourceDataSyncItem[];
export const ResourceDataSyncItemList = S.Array(ResourceDataSyncItem);
export interface S3OutputUrl {
  OutputUrl?: string;
}
export const S3OutputUrl = S.suspend(() =>
  S.Struct({ OutputUrl: S.optional(S.String) }),
).annotations({ identifier: "S3OutputUrl" }) as any as S.Schema<S3OutputUrl>;
export type StepPreviewMap = { [key: string]: number };
export const StepPreviewMap = S.Record({ key: S.String, value: S.Number });
export interface TargetPreview {
  Count?: number;
  TargetType?: string;
}
export const TargetPreview = S.suspend(() =>
  S.Struct({ Count: S.optional(S.Number), TargetType: S.optional(S.String) }),
).annotations({
  identifier: "TargetPreview",
}) as any as S.Schema<TargetPreview>;
export type TargetPreviewList = TargetPreview[];
export const TargetPreviewList = S.Array(TargetPreview);
export interface CreateAssociationResult {
  AssociationDescription?: AssociationDescription;
}
export const CreateAssociationResult = S.suspend(() =>
  S.Struct({ AssociationDescription: S.optional(AssociationDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateAssociationResult",
}) as any as S.Schema<CreateAssociationResult>;
export interface CreateAssociationBatchResult {
  Successful?: AssociationDescriptionList;
  Failed?: FailedCreateAssociationList;
}
export const CreateAssociationBatchResult = S.suspend(() =>
  S.Struct({
    Successful: S.optional(AssociationDescriptionList),
    Failed: S.optional(FailedCreateAssociationList),
  }).pipe(ns),
).annotations({
  identifier: "CreateAssociationBatchResult",
}) as any as S.Schema<CreateAssociationBatchResult>;
export interface CreateOpsItemResponse {
  OpsItemId?: string;
  OpsItemArn?: string;
}
export const CreateOpsItemResponse = S.suspend(() =>
  S.Struct({
    OpsItemId: S.optional(S.String),
    OpsItemArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateOpsItemResponse",
}) as any as S.Schema<CreateOpsItemResponse>;
export interface CreateOpsMetadataResult {
  OpsMetadataArn?: string;
}
export const CreateOpsMetadataResult = S.suspend(() =>
  S.Struct({ OpsMetadataArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateOpsMetadataResult",
}) as any as S.Schema<CreateOpsMetadataResult>;
export interface CreatePatchBaselineResult {
  BaselineId?: string;
}
export const CreatePatchBaselineResult = S.suspend(() =>
  S.Struct({ BaselineId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreatePatchBaselineResult",
}) as any as S.Schema<CreatePatchBaselineResult>;
export interface CreateResourceDataSyncRequest {
  SyncName: string;
  S3Destination?: ResourceDataSyncS3Destination;
  SyncType?: string;
  SyncSource?: ResourceDataSyncSource;
}
export const CreateResourceDataSyncRequest = S.suspend(() =>
  S.Struct({
    SyncName: S.String,
    S3Destination: S.optional(ResourceDataSyncS3Destination),
    SyncType: S.optional(S.String),
    SyncSource: S.optional(ResourceDataSyncSource),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceDataSyncRequest",
}) as any as S.Schema<CreateResourceDataSyncRequest>;
export interface CreateResourceDataSyncResult {}
export const CreateResourceDataSyncResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateResourceDataSyncResult",
}) as any as S.Schema<CreateResourceDataSyncResult>;
export interface DeleteInventoryResult {
  DeletionId?: string;
  TypeName?: string;
  DeletionSummary?: InventoryDeletionSummary;
}
export const DeleteInventoryResult = S.suspend(() =>
  S.Struct({
    DeletionId: S.optional(S.String),
    TypeName: S.optional(S.String),
    DeletionSummary: S.optional(InventoryDeletionSummary),
  }).pipe(ns),
).annotations({
  identifier: "DeleteInventoryResult",
}) as any as S.Schema<DeleteInventoryResult>;
export interface DescribeActivationsResult {
  ActivationList?: ActivationList;
  NextToken?: string;
}
export const DescribeActivationsResult = S.suspend(() =>
  S.Struct({
    ActivationList: S.optional(ActivationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeActivationsResult",
}) as any as S.Schema<DescribeActivationsResult>;
export interface DescribeAssociationExecutionsResult {
  AssociationExecutions?: AssociationExecutionsList;
  NextToken?: string;
}
export const DescribeAssociationExecutionsResult = S.suspend(() =>
  S.Struct({
    AssociationExecutions: S.optional(AssociationExecutionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAssociationExecutionsResult",
}) as any as S.Schema<DescribeAssociationExecutionsResult>;
export interface DescribeAutomationExecutionsResult {
  AutomationExecutionMetadataList?: AutomationExecutionMetadataList;
  NextToken?: string;
}
export const DescribeAutomationExecutionsResult = S.suspend(() =>
  S.Struct({
    AutomationExecutionMetadataList: S.optional(
      AutomationExecutionMetadataList,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAutomationExecutionsResult",
}) as any as S.Schema<DescribeAutomationExecutionsResult>;
export interface DescribeDocumentResult {
  Document?: DocumentDescription;
}
export const DescribeDocumentResult = S.suspend(() =>
  S.Struct({ Document: S.optional(DocumentDescription) }).pipe(ns),
).annotations({
  identifier: "DescribeDocumentResult",
}) as any as S.Schema<DescribeDocumentResult>;
export interface DescribeEffectivePatchesForPatchBaselineResult {
  EffectivePatches?: EffectivePatchList;
  NextToken?: string;
}
export const DescribeEffectivePatchesForPatchBaselineResult = S.suspend(() =>
  S.Struct({
    EffectivePatches: S.optional(EffectivePatchList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEffectivePatchesForPatchBaselineResult",
}) as any as S.Schema<DescribeEffectivePatchesForPatchBaselineResult>;
export interface DescribeInstancePropertiesResult {
  InstanceProperties?: InstanceProperties;
  NextToken?: string;
}
export const DescribeInstancePropertiesResult = S.suspend(() =>
  S.Struct({
    InstanceProperties: S.optional(InstanceProperties),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstancePropertiesResult",
}) as any as S.Schema<DescribeInstancePropertiesResult>;
export interface DescribeMaintenanceWindowExecutionsResult {
  WindowExecutions?: MaintenanceWindowExecutionList;
  NextToken?: string;
}
export const DescribeMaintenanceWindowExecutionsResult = S.suspend(() =>
  S.Struct({
    WindowExecutions: S.optional(MaintenanceWindowExecutionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceWindowExecutionsResult",
}) as any as S.Schema<DescribeMaintenanceWindowExecutionsResult>;
export interface DescribeOpsItemsResponse {
  NextToken?: string;
  OpsItemSummaries?: OpsItemSummaries;
}
export const DescribeOpsItemsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    OpsItemSummaries: S.optional(OpsItemSummaries),
  }).pipe(ns),
).annotations({
  identifier: "DescribeOpsItemsResponse",
}) as any as S.Schema<DescribeOpsItemsResponse>;
export interface DescribeParametersResult {
  Parameters?: ParameterMetadataList;
  NextToken?: string;
}
export const DescribeParametersResult = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParameterMetadataList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeParametersResult",
}) as any as S.Schema<DescribeParametersResult>;
export interface GetInventorySchemaResult {
  Schemas?: InventoryItemSchemaResultList;
  NextToken?: string;
}
export const GetInventorySchemaResult = S.suspend(() =>
  S.Struct({
    Schemas: S.optional(InventoryItemSchemaResultList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetInventorySchemaResult",
}) as any as S.Schema<GetInventorySchemaResult>;
export interface GetParameterHistoryResult {
  Parameters?: ParameterHistoryList;
  NextToken?: string;
}
export const GetParameterHistoryResult = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParameterHistoryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetParameterHistoryResult",
}) as any as S.Schema<GetParameterHistoryResult>;
export interface ListAssociationsResult {
  Associations?: AssociationList;
  NextToken?: string;
}
export const ListAssociationsResult = S.suspend(() =>
  S.Struct({
    Associations: S.optional(AssociationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAssociationsResult",
}) as any as S.Schema<ListAssociationsResult>;
export interface ListComplianceItemsResult {
  ComplianceItems?: ComplianceItemList;
  NextToken?: string;
}
export const ListComplianceItemsResult = S.suspend(() =>
  S.Struct({
    ComplianceItems: S.optional(ComplianceItemList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListComplianceItemsResult",
}) as any as S.Schema<ListComplianceItemsResult>;
export interface ListDocumentMetadataHistoryResponse {
  Name?: string;
  DocumentVersion?: string;
  Author?: string;
  Metadata?: DocumentMetadataResponseInfo;
  NextToken?: string;
}
export const ListDocumentMetadataHistoryResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    Author: S.optional(S.String),
    Metadata: S.optional(DocumentMetadataResponseInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDocumentMetadataHistoryResponse",
}) as any as S.Schema<ListDocumentMetadataHistoryResponse>;
export interface ListDocumentsResult {
  DocumentIdentifiers?: DocumentIdentifierList;
  NextToken?: string;
}
export const ListDocumentsResult = S.suspend(() =>
  S.Struct({
    DocumentIdentifiers: S.optional(DocumentIdentifierList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDocumentsResult",
}) as any as S.Schema<ListDocumentsResult>;
export interface ListNodesSummaryResult {
  Summary?: NodeSummaryList;
  NextToken?: string;
}
export const ListNodesSummaryResult = S.suspend(() =>
  S.Struct({
    Summary: S.optional(NodeSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListNodesSummaryResult",
}) as any as S.Schema<ListNodesSummaryResult>;
export interface ListOpsItemRelatedItemsResponse {
  NextToken?: string;
  Summaries?: OpsItemRelatedItemSummaries;
}
export const ListOpsItemRelatedItemsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Summaries: S.optional(OpsItemRelatedItemSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListOpsItemRelatedItemsResponse",
}) as any as S.Schema<ListOpsItemRelatedItemsResponse>;
export interface ListOpsMetadataResult {
  OpsMetadataList?: OpsMetadataList;
  NextToken?: string;
}
export const ListOpsMetadataResult = S.suspend(() =>
  S.Struct({
    OpsMetadataList: S.optional(OpsMetadataList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOpsMetadataResult",
}) as any as S.Schema<ListOpsMetadataResult>;
export interface ListResourceDataSyncResult {
  ResourceDataSyncItems?: ResourceDataSyncItemList;
  NextToken?: string;
}
export const ListResourceDataSyncResult = S.suspend(() =>
  S.Struct({
    ResourceDataSyncItems: S.optional(ResourceDataSyncItemList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceDataSyncResult",
}) as any as S.Schema<ListResourceDataSyncResult>;
export interface PutInventoryResult {
  Message?: string;
}
export const PutInventoryResult = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutInventoryResult",
}) as any as S.Schema<PutInventoryResult>;
export interface RegisterTaskWithMaintenanceWindowResult {
  WindowTaskId?: string;
}
export const RegisterTaskWithMaintenanceWindowResult = S.suspend(() =>
  S.Struct({ WindowTaskId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterTaskWithMaintenanceWindowResult",
}) as any as S.Schema<RegisterTaskWithMaintenanceWindowResult>;
export interface StartExecutionPreviewResponse {
  ExecutionPreviewId?: string;
}
export const StartExecutionPreviewResponse = S.suspend(() =>
  S.Struct({ ExecutionPreviewId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartExecutionPreviewResponse",
}) as any as S.Schema<StartExecutionPreviewResponse>;
export interface OutputSource {
  OutputSourceId?: string;
  OutputSourceType?: string;
}
export const OutputSource = S.suspend(() =>
  S.Struct({
    OutputSourceId: S.optional(S.String),
    OutputSourceType: S.optional(S.String),
  }),
).annotations({ identifier: "OutputSource" }) as any as S.Schema<OutputSource>;
export interface InstanceAssociationOutputUrl {
  S3OutputUrl?: S3OutputUrl;
}
export const InstanceAssociationOutputUrl = S.suspend(() =>
  S.Struct({ S3OutputUrl: S.optional(S3OutputUrl) }),
).annotations({
  identifier: "InstanceAssociationOutputUrl",
}) as any as S.Schema<InstanceAssociationOutputUrl>;
export interface SessionManagerOutputUrl {
  S3OutputUrl?: string;
  CloudWatchOutputUrl?: string;
}
export const SessionManagerOutputUrl = S.suspend(() =>
  S.Struct({
    S3OutputUrl: S.optional(S.String),
    CloudWatchOutputUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "SessionManagerOutputUrl",
}) as any as S.Schema<SessionManagerOutputUrl>;
export interface AutomationExecutionPreview {
  StepPreviews?: StepPreviewMap;
  Regions?: RegionList;
  TargetPreviews?: TargetPreviewList;
  TotalAccounts?: number;
}
export const AutomationExecutionPreview = S.suspend(() =>
  S.Struct({
    StepPreviews: S.optional(StepPreviewMap),
    Regions: S.optional(RegionList),
    TargetPreviews: S.optional(TargetPreviewList),
    TotalAccounts: S.optional(S.Number),
  }),
).annotations({
  identifier: "AutomationExecutionPreview",
}) as any as S.Schema<AutomationExecutionPreview>;
export interface CommandPlugin {
  Name?: string;
  Status?: string;
  StatusDetails?: string;
  ResponseCode?: number;
  ResponseStartDateTime?: Date;
  ResponseFinishDateTime?: Date;
  Output?: string;
  StandardOutputUrl?: string;
  StandardErrorUrl?: string;
  OutputS3Region?: string;
  OutputS3BucketName?: string;
  OutputS3KeyPrefix?: string;
}
export const CommandPlugin = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    ResponseCode: S.optional(S.Number),
    ResponseStartDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResponseFinishDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Output: S.optional(S.String),
    StandardOutputUrl: S.optional(S.String),
    StandardErrorUrl: S.optional(S.String),
    OutputS3Region: S.optional(S.String),
    OutputS3BucketName: S.optional(S.String),
    OutputS3KeyPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "CommandPlugin",
}) as any as S.Schema<CommandPlugin>;
export type CommandPluginList = CommandPlugin[];
export const CommandPluginList = S.Array(CommandPlugin);
export interface NodeOwnerInfo {
  AccountId?: string;
  OrganizationalUnitId?: string;
  OrganizationalUnitPath?: string;
}
export const NodeOwnerInfo = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    OrganizationalUnitId: S.optional(S.String),
    OrganizationalUnitPath: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeOwnerInfo",
}) as any as S.Schema<NodeOwnerInfo>;
export interface AssociationExecutionTarget {
  AssociationId?: string;
  AssociationVersion?: string;
  ExecutionId?: string;
  ResourceId?: string;
  ResourceType?: string;
  Status?: string;
  DetailedStatus?: string;
  LastExecutionDate?: Date;
  OutputSource?: OutputSource;
}
export const AssociationExecutionTarget = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    ExecutionId: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Status: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    LastExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OutputSource: S.optional(OutputSource),
  }),
).annotations({
  identifier: "AssociationExecutionTarget",
}) as any as S.Schema<AssociationExecutionTarget>;
export type AssociationExecutionTargetsList = AssociationExecutionTarget[];
export const AssociationExecutionTargetsList = S.Array(
  AssociationExecutionTarget.pipe(
    T.XmlName("AssociationExecutionTarget"),
  ).annotations({ identifier: "AssociationExecutionTarget" }),
);
export interface InstanceAssociationStatusInfo {
  AssociationId?: string;
  Name?: string;
  DocumentVersion?: string;
  AssociationVersion?: string;
  InstanceId?: string;
  ExecutionDate?: Date;
  Status?: string;
  DetailedStatus?: string;
  ExecutionSummary?: string;
  ErrorCode?: string;
  OutputUrl?: InstanceAssociationOutputUrl;
  AssociationName?: string;
}
export const InstanceAssociationStatusInfo = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    Name: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    AssociationVersion: S.optional(S.String),
    InstanceId: S.optional(S.String),
    ExecutionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    ExecutionSummary: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    OutputUrl: S.optional(InstanceAssociationOutputUrl),
    AssociationName: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceAssociationStatusInfo",
}) as any as S.Schema<InstanceAssociationStatusInfo>;
export type InstanceAssociationStatusInfos = InstanceAssociationStatusInfo[];
export const InstanceAssociationStatusInfos = S.Array(
  InstanceAssociationStatusInfo,
);
export interface Session {
  SessionId?: string;
  Target?: string;
  Status?: string;
  StartDate?: Date;
  EndDate?: Date;
  DocumentName?: string;
  Owner?: string;
  Reason?: string;
  Details?: string;
  OutputUrl?: SessionManagerOutputUrl;
  MaxSessionDuration?: string;
  AccessType?: string;
}
export const Session = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    Target: S.optional(S.String),
    Status: S.optional(S.String),
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DocumentName: S.optional(S.String),
    Owner: S.optional(S.String),
    Reason: S.optional(S.String),
    Details: S.optional(S.String),
    OutputUrl: S.optional(SessionManagerOutputUrl),
    MaxSessionDuration: S.optional(S.String),
    AccessType: S.optional(S.String),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export type SessionList = Session[];
export const SessionList = S.Array(Session);
export interface AutomationExecution {
  AutomationExecutionId?: string;
  DocumentName?: string;
  DocumentVersion?: string;
  ExecutionStartTime?: Date;
  ExecutionEndTime?: Date;
  AutomationExecutionStatus?: string;
  StepExecutions?: StepExecutionList;
  StepExecutionsTruncated?: boolean;
  Parameters?: AutomationParameterMap;
  Outputs?: AutomationParameterMap;
  FailureMessage?: string;
  Mode?: string;
  ParentAutomationExecutionId?: string;
  ExecutedBy?: string;
  CurrentStepName?: string;
  CurrentAction?: string;
  TargetParameterName?: string;
  Targets?: Targets;
  TargetMaps?: TargetMaps;
  ResolvedTargets?: ResolvedTargets;
  MaxConcurrency?: string;
  MaxErrors?: string;
  Target?: string;
  TargetLocations?: TargetLocations;
  ProgressCounters?: ProgressCounters;
  AlarmConfiguration?: AlarmConfiguration;
  TriggeredAlarms?: AlarmStateInformationList;
  TargetLocationsURL?: string;
  AutomationSubtype?: string;
  ScheduledTime?: Date;
  Runbooks?: Runbooks;
  OpsItemId?: string;
  AssociationId?: string;
  ChangeRequestName?: string;
  Variables?: AutomationParameterMap;
}
export const AutomationExecution = S.suspend(() =>
  S.Struct({
    AutomationExecutionId: S.optional(S.String),
    DocumentName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    ExecutionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExecutionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AutomationExecutionStatus: S.optional(S.String),
    StepExecutions: S.optional(StepExecutionList),
    StepExecutionsTruncated: S.optional(S.Boolean),
    Parameters: S.optional(AutomationParameterMap),
    Outputs: S.optional(AutomationParameterMap),
    FailureMessage: S.optional(S.String),
    Mode: S.optional(S.String),
    ParentAutomationExecutionId: S.optional(S.String),
    ExecutedBy: S.optional(S.String),
    CurrentStepName: S.optional(S.String),
    CurrentAction: S.optional(S.String),
    TargetParameterName: S.optional(S.String),
    Targets: S.optional(Targets),
    TargetMaps: S.optional(TargetMaps),
    ResolvedTargets: S.optional(ResolvedTargets),
    MaxConcurrency: S.optional(S.String),
    MaxErrors: S.optional(S.String),
    Target: S.optional(S.String),
    TargetLocations: S.optional(TargetLocations),
    ProgressCounters: S.optional(ProgressCounters),
    AlarmConfiguration: S.optional(AlarmConfiguration),
    TriggeredAlarms: S.optional(AlarmStateInformationList),
    TargetLocationsURL: S.optional(S.String),
    AutomationSubtype: S.optional(S.String),
    ScheduledTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Runbooks: S.optional(Runbooks),
    OpsItemId: S.optional(S.String),
    AssociationId: S.optional(S.String),
    ChangeRequestName: S.optional(S.String),
    Variables: S.optional(AutomationParameterMap),
  }),
).annotations({
  identifier: "AutomationExecution",
}) as any as S.Schema<AutomationExecution>;
export type ExecutionPreview = { Automation: AutomationExecutionPreview };
export const ExecutionPreview = S.Union(
  S.Struct({ Automation: AutomationExecutionPreview }),
);
export type ResourcePolicyParameterNamesList = string[];
export const ResourcePolicyParameterNamesList = S.Array(S.String);
export interface CommandInvocation {
  CommandId?: string;
  InstanceId?: string;
  InstanceName?: string;
  Comment?: string;
  DocumentName?: string;
  DocumentVersion?: string;
  RequestedDateTime?: Date;
  Status?: string;
  StatusDetails?: string;
  TraceOutput?: string;
  StandardOutputUrl?: string;
  StandardErrorUrl?: string;
  CommandPlugins?: CommandPluginList;
  ServiceRole?: string;
  NotificationConfig?: NotificationConfig;
  CloudWatchOutputConfig?: CloudWatchOutputConfig;
}
export const CommandInvocation = S.suspend(() =>
  S.Struct({
    CommandId: S.optional(S.String),
    InstanceId: S.optional(S.String),
    InstanceName: S.optional(S.String),
    Comment: S.optional(S.String),
    DocumentName: S.optional(S.String),
    DocumentVersion: S.optional(S.String),
    RequestedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(S.String),
    StatusDetails: S.optional(S.String),
    TraceOutput: S.optional(S.String),
    StandardOutputUrl: S.optional(S.String),
    StandardErrorUrl: S.optional(S.String),
    CommandPlugins: S.optional(CommandPluginList),
    ServiceRole: S.optional(S.String),
    NotificationConfig: S.optional(NotificationConfig),
    CloudWatchOutputConfig: S.optional(CloudWatchOutputConfig),
  }),
).annotations({
  identifier: "CommandInvocation",
}) as any as S.Schema<CommandInvocation>;
export type CommandInvocationList = CommandInvocation[];
export const CommandInvocationList = S.Array(CommandInvocation);
export interface ComplianceSummaryItem {
  ComplianceType?: string;
  CompliantSummary?: CompliantSummary;
  NonCompliantSummary?: NonCompliantSummary;
}
export const ComplianceSummaryItem = S.suspend(() =>
  S.Struct({
    ComplianceType: S.optional(S.String),
    CompliantSummary: S.optional(CompliantSummary),
    NonCompliantSummary: S.optional(NonCompliantSummary),
  }),
).annotations({
  identifier: "ComplianceSummaryItem",
}) as any as S.Schema<ComplianceSummaryItem>;
export type ComplianceSummaryItemList = ComplianceSummaryItem[];
export const ComplianceSummaryItemList = S.Array(
  ComplianceSummaryItem.pipe(T.XmlName("Item")).annotations({
    identifier: "ComplianceSummaryItem",
  }),
);
export interface OpsItemEventSummary {
  OpsItemId?: string;
  EventId?: string;
  Source?: string;
  DetailType?: string;
  Detail?: string;
  CreatedBy?: OpsItemIdentity;
  CreatedTime?: Date;
}
export const OpsItemEventSummary = S.suspend(() =>
  S.Struct({
    OpsItemId: S.optional(S.String),
    EventId: S.optional(S.String),
    Source: S.optional(S.String),
    DetailType: S.optional(S.String),
    Detail: S.optional(S.String),
    CreatedBy: S.optional(OpsItemIdentity),
    CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OpsItemEventSummary",
}) as any as S.Schema<OpsItemEventSummary>;
export type OpsItemEventSummaries = OpsItemEventSummary[];
export const OpsItemEventSummaries = S.Array(OpsItemEventSummary);
export interface InstanceInfo {
  AgentType?: string;
  AgentVersion?: string;
  ComputerName?: string;
  InstanceStatus?: string;
  IpAddress?: string | Redacted.Redacted<string>;
  ManagedStatus?: string;
  PlatformType?: string;
  PlatformName?: string;
  PlatformVersion?: string;
  ResourceType?: string;
}
export const InstanceInfo = S.suspend(() =>
  S.Struct({
    AgentType: S.optional(S.String),
    AgentVersion: S.optional(S.String),
    ComputerName: S.optional(S.String),
    InstanceStatus: S.optional(S.String),
    IpAddress: S.optional(SensitiveString),
    ManagedStatus: S.optional(S.String),
    PlatformType: S.optional(S.String),
    PlatformName: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    ResourceType: S.optional(S.String),
  }),
).annotations({ identifier: "InstanceInfo" }) as any as S.Schema<InstanceInfo>;
export interface DescribeAssociationResult {
  AssociationDescription?: AssociationDescription;
}
export const DescribeAssociationResult = S.suspend(() =>
  S.Struct({ AssociationDescription: S.optional(AssociationDescription) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeAssociationResult",
}) as any as S.Schema<DescribeAssociationResult>;
export interface DescribeAssociationExecutionTargetsResult {
  AssociationExecutionTargets?: AssociationExecutionTargetsList;
  NextToken?: string;
}
export const DescribeAssociationExecutionTargetsResult = S.suspend(() =>
  S.Struct({
    AssociationExecutionTargets: S.optional(AssociationExecutionTargetsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAssociationExecutionTargetsResult",
}) as any as S.Schema<DescribeAssociationExecutionTargetsResult>;
export interface DescribeInstanceAssociationsStatusResult {
  InstanceAssociationStatusInfos?: InstanceAssociationStatusInfos;
  NextToken?: string;
}
export const DescribeInstanceAssociationsStatusResult = S.suspend(() =>
  S.Struct({
    InstanceAssociationStatusInfos: S.optional(InstanceAssociationStatusInfos),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstanceAssociationsStatusResult",
}) as any as S.Schema<DescribeInstanceAssociationsStatusResult>;
export interface DescribeSessionsResponse {
  Sessions?: SessionList;
  NextToken?: string;
}
export const DescribeSessionsResponse = S.suspend(() =>
  S.Struct({
    Sessions: S.optional(SessionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSessionsResponse",
}) as any as S.Schema<DescribeSessionsResponse>;
export interface GetAutomationExecutionResult {
  AutomationExecution?: AutomationExecution;
}
export const GetAutomationExecutionResult = S.suspend(() =>
  S.Struct({ AutomationExecution: S.optional(AutomationExecution) }).pipe(ns),
).annotations({
  identifier: "GetAutomationExecutionResult",
}) as any as S.Schema<GetAutomationExecutionResult>;
export interface GetExecutionPreviewResponse {
  ExecutionPreviewId?: string;
  EndedAt?: Date;
  Status?: string;
  StatusMessage?: string;
  ExecutionPreview?: (typeof ExecutionPreview)["Type"];
}
export const GetExecutionPreviewResponse = S.suspend(() =>
  S.Struct({
    ExecutionPreviewId: S.optional(S.String),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    ExecutionPreview: S.optional(ExecutionPreview),
  }).pipe(ns),
).annotations({
  identifier: "GetExecutionPreviewResponse",
}) as any as S.Schema<GetExecutionPreviewResponse>;
export interface ListCommandInvocationsResult {
  CommandInvocations?: CommandInvocationList;
  NextToken?: string;
}
export const ListCommandInvocationsResult = S.suspend(() =>
  S.Struct({
    CommandInvocations: S.optional(CommandInvocationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCommandInvocationsResult",
}) as any as S.Schema<ListCommandInvocationsResult>;
export interface ListComplianceSummariesResult {
  ComplianceSummaryItems?: ComplianceSummaryItemList;
  NextToken?: string;
}
export const ListComplianceSummariesResult = S.suspend(() =>
  S.Struct({
    ComplianceSummaryItems: S.optional(ComplianceSummaryItemList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListComplianceSummariesResult",
}) as any as S.Schema<ListComplianceSummariesResult>;
export interface ListOpsItemEventsResponse {
  NextToken?: string;
  Summaries?: OpsItemEventSummaries;
}
export const ListOpsItemEventsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Summaries: S.optional(OpsItemEventSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListOpsItemEventsResponse",
}) as any as S.Schema<ListOpsItemEventsResponse>;
export type NodeType = { Instance: InstanceInfo };
export const NodeType = S.Union(S.Struct({ Instance: InstanceInfo }));
export interface InstanceInformation {
  InstanceId?: string;
  PingStatus?: string;
  LastPingDateTime?: Date;
  AgentVersion?: string;
  IsLatestVersion?: boolean;
  PlatformType?: string;
  PlatformName?: string;
  PlatformVersion?: string;
  ActivationId?: string;
  IamRole?: string;
  RegistrationDate?: Date;
  ResourceType?: string;
  Name?: string;
  IPAddress?: string | Redacted.Redacted<string>;
  ComputerName?: string;
  AssociationStatus?: string;
  LastAssociationExecutionDate?: Date;
  LastSuccessfulAssociationExecutionDate?: Date;
  AssociationOverview?: InstanceAggregatedAssociationOverview;
  SourceId?: string;
  SourceType?: string;
}
export const InstanceInformation = S.suspend(() =>
  S.Struct({
    InstanceId: S.optional(S.String),
    PingStatus: S.optional(S.String),
    LastPingDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AgentVersion: S.optional(S.String),
    IsLatestVersion: S.optional(S.Boolean),
    PlatformType: S.optional(S.String),
    PlatformName: S.optional(S.String),
    PlatformVersion: S.optional(S.String),
    ActivationId: S.optional(S.String),
    IamRole: S.optional(S.String),
    RegistrationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceType: S.optional(S.String),
    Name: S.optional(S.String),
    IPAddress: S.optional(SensitiveString),
    ComputerName: S.optional(S.String),
    AssociationStatus: S.optional(S.String),
    LastAssociationExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastSuccessfulAssociationExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AssociationOverview: S.optional(InstanceAggregatedAssociationOverview),
    SourceId: S.optional(S.String),
    SourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceInformation",
}) as any as S.Schema<InstanceInformation>;
export type InstanceInformationList = InstanceInformation[];
export const InstanceInformationList = S.Array(
  InstanceInformation.pipe(T.XmlName("InstanceInformation")).annotations({
    identifier: "InstanceInformation",
  }),
);
export interface Node {
  CaptureTime?: Date;
  Id?: string;
  Owner?: NodeOwnerInfo;
  Region?: string;
  NodeType?: (typeof NodeType)["Type"];
}
export const Node = S.suspend(() =>
  S.Struct({
    CaptureTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Id: S.optional(S.String),
    Owner: S.optional(NodeOwnerInfo),
    Region: S.optional(S.String),
    NodeType: S.optional(NodeType),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export type NodeList = Node[];
export const NodeList = S.Array(Node);
export interface InventoryResultItem {
  TypeName: string;
  SchemaVersion: string;
  CaptureTime?: string;
  ContentHash?: string;
  Content: InventoryItemEntryList;
}
export const InventoryResultItem = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    SchemaVersion: S.String,
    CaptureTime: S.optional(S.String),
    ContentHash: S.optional(S.String),
    Content: InventoryItemEntryList,
  }),
).annotations({
  identifier: "InventoryResultItem",
}) as any as S.Schema<InventoryResultItem>;
export interface DescribeInstanceInformationResult {
  InstanceInformationList?: InstanceInformationList;
  NextToken?: string;
}
export const DescribeInstanceInformationResult = S.suspend(() =>
  S.Struct({
    InstanceInformationList: S.optional(InstanceInformationList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstanceInformationResult",
}) as any as S.Schema<DescribeInstanceInformationResult>;
export interface ListNodesResult {
  Nodes?: NodeList;
  NextToken?: string;
}
export const ListNodesResult = S.suspend(() =>
  S.Struct({
    Nodes: S.optional(NodeList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListNodesResult",
}) as any as S.Schema<ListNodesResult>;
export type InventoryResultItemMap = { [key: string]: InventoryResultItem };
export const InventoryResultItemMap = S.Record({
  key: S.String,
  value: InventoryResultItem,
});
export type OpsEntityItemEntry = { [key: string]: string };
export const OpsEntityItemEntry = S.Record({ key: S.String, value: S.String });
export type OpsEntityItemEntryList = OpsEntityItemEntry[];
export const OpsEntityItemEntryList = S.Array(OpsEntityItemEntry);
export interface InventoryResultEntity {
  Id?: string;
  Data?: InventoryResultItemMap;
}
export const InventoryResultEntity = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Data: S.optional(InventoryResultItemMap),
  }),
).annotations({
  identifier: "InventoryResultEntity",
}) as any as S.Schema<InventoryResultEntity>;
export type InventoryResultEntityList = InventoryResultEntity[];
export const InventoryResultEntityList = S.Array(
  InventoryResultEntity.pipe(T.XmlName("Entity")).annotations({
    identifier: "InventoryResultEntity",
  }),
);
export interface OpsEntityItem {
  CaptureTime?: string;
  Content?: OpsEntityItemEntryList;
}
export const OpsEntityItem = S.suspend(() =>
  S.Struct({
    CaptureTime: S.optional(S.String),
    Content: S.optional(OpsEntityItemEntryList),
  }),
).annotations({
  identifier: "OpsEntityItem",
}) as any as S.Schema<OpsEntityItem>;
export interface GetInventoryResult {
  Entities?: InventoryResultEntityList;
  NextToken?: string;
}
export const GetInventoryResult = S.suspend(() =>
  S.Struct({
    Entities: S.optional(InventoryResultEntityList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetInventoryResult",
}) as any as S.Schema<GetInventoryResult>;
export type OpsEntityItemMap = { [key: string]: OpsEntityItem };
export const OpsEntityItemMap = S.Record({
  key: S.String,
  value: OpsEntityItem,
});
export interface OpsEntity {
  Id?: string;
  Data?: OpsEntityItemMap;
}
export const OpsEntity = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Data: S.optional(OpsEntityItemMap) }),
).annotations({ identifier: "OpsEntity" }) as any as S.Schema<OpsEntity>;
export type OpsEntityList = OpsEntity[];
export const OpsEntityList = S.Array(
  OpsEntity.pipe(T.XmlName("Entity")).annotations({ identifier: "OpsEntity" }),
);
export interface GetOpsSummaryResult {
  Entities?: OpsEntityList;
  NextToken?: string;
}
export const GetOpsSummaryResult = S.suspend(() =>
  S.Struct({
    Entities: S.optional(OpsEntityList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOpsSummaryResult",
}) as any as S.Schema<GetOpsSummaryResult>;

//# Errors
export class DuplicateInstanceId extends S.TaggedError<DuplicateInstanceId>()(
  "DuplicateInstanceId",
  {},
  T.AwsQueryError({ code: "DuplicateInstanceId", httpResponseCode: 404 }),
) {}
export class AssociatedInstances extends S.TaggedError<AssociatedInstances>()(
  "AssociatedInstances",
  {},
  T.AwsQueryError({ code: "AssociatedInstances", httpResponseCode: 400 }),
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerError", httpResponseCode: 500 }),
) {}
export class InvalidCommandId extends S.TaggedError<InvalidCommandId>()(
  "InvalidCommandId",
  {},
  T.AwsQueryError({ code: "InvalidCommandId", httpResponseCode: 404 }),
) {}
export class AssociationDoesNotExist extends S.TaggedError<AssociationDoesNotExist>()(
  "AssociationDoesNotExist",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AssociationDoesNotExist", httpResponseCode: 404 }),
) {}
export class InvalidResourceId extends S.TaggedError<InvalidResourceId>()(
  "InvalidResourceId",
  {},
  T.AwsQueryError({ code: "InvalidResourceId", httpResponseCode: 400 }),
) {}
export class InvalidFilterKey extends S.TaggedError<InvalidFilterKey>()(
  "InvalidFilterKey",
  {},
  T.AwsQueryError({ code: "InvalidFilterKey", httpResponseCode: 400 }),
) {}
export class InvalidResourceType extends S.TaggedError<InvalidResourceType>()(
  "InvalidResourceType",
  {},
  T.AwsQueryError({ code: "InvalidResourceType", httpResponseCode: 400 }),
) {}
export class DocumentLimitExceeded extends S.TaggedError<DocumentLimitExceeded>()(
  "DocumentLimitExceeded",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DocumentLimitExceeded", httpResponseCode: 400 }),
) {}
export class AutomationExecutionNotFoundException extends S.TaggedError<AutomationExecutionNotFoundException>()(
  "AutomationExecutionNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationExecutionNotFound",
    httpResponseCode: 404,
  }),
) {}
export class TooManyTagsError extends S.TaggedError<TooManyTagsError>()(
  "TooManyTagsError",
  {},
  T.AwsQueryError({ code: "TooManyTagsError", httpResponseCode: 400 }),
) {}
export class InvalidInstanceId extends S.TaggedError<InvalidInstanceId>()(
  "InvalidInstanceId",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInstanceId", httpResponseCode: 404 }),
) {}
export class DoesNotExistException extends S.TaggedError<DoesNotExistException>()(
  "DoesNotExistException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DoesNotExistException", httpResponseCode: 404 }),
) {}
export class IdempotentParameterMismatch extends S.TaggedError<IdempotentParameterMismatch>()(
  "IdempotentParameterMismatch",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IdempotentParameterMismatch",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDocument extends S.TaggedError<InvalidDocument>()(
  "InvalidDocument",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDocument", httpResponseCode: 404 }),
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUseException", httpResponseCode: 400 }),
) {}
export class InvalidNextToken extends S.TaggedError<InvalidNextToken>()(
  "InvalidNextToken",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
) {}
export class OpsMetadataInvalidArgumentException extends S.TaggedError<OpsMetadataInvalidArgumentException>()(
  "OpsMetadataInvalidArgumentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataInvalidArgumentException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidKeyId extends S.TaggedError<InvalidKeyId>()(
  "InvalidKeyId",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKeyId", httpResponseCode: 400 }),
) {}
export class InvalidFilterOption extends S.TaggedError<InvalidFilterOption>()(
  "InvalidFilterOption",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidFilterOption", httpResponseCode: 400 }),
) {}
export class ParameterNotFound extends S.TaggedError<ParameterNotFound>()(
  "ParameterNotFound",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterNotFound", httpResponseCode: 404 }),
) {}
export class InvalidFilter extends S.TaggedError<InvalidFilter>()(
  "InvalidFilter",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidFilter", httpResponseCode: 441 }),
) {}
export class DocumentPermissionLimit extends S.TaggedError<DocumentPermissionLimit>()(
  "DocumentPermissionLimit",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DocumentPermissionLimit", httpResponseCode: 400 }),
) {}
export class HierarchyLevelLimitExceededException extends S.TaggedError<HierarchyLevelLimitExceededException>()(
  "HierarchyLevelLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HierarchyLevelLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class MalformedResourcePolicyDocumentException extends S.TaggedError<MalformedResourcePolicyDocumentException>()(
  "MalformedResourcePolicyDocumentException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MalformedResourcePolicyDocumentException",
    httpResponseCode: 400,
  }),
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExistsException", httpResponseCode: 400 }),
) {}
export class ServiceSettingNotFound extends S.TaggedError<ServiceSettingNotFound>()(
  "ServiceSettingNotFound",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceSettingNotFound", httpResponseCode: 400 }),
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class AutomationDefinitionNotFoundException extends S.TaggedError<AutomationDefinitionNotFoundException>()(
  "AutomationDefinitionNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationDefinitionNotFound",
    httpResponseCode: 404,
  }),
) {}
export class InvalidAutomationStatusUpdateException extends S.TaggedError<InvalidAutomationStatusUpdateException>()(
  "InvalidAutomationStatusUpdateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidAutomationStatusUpdateException",
    httpResponseCode: 400,
  }),
) {}
export class AssociationVersionLimitExceeded extends S.TaggedError<AssociationVersionLimitExceeded>()(
  "AssociationVersionLimitExceeded",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AssociationVersionLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class StatusUnchanged extends S.TaggedError<StatusUnchanged>()(
  "StatusUnchanged",
  {},
  T.AwsQueryError({ code: "StatusUnchanged", httpResponseCode: 400 }),
) {}
export class DocumentVersionLimitExceeded extends S.TaggedError<DocumentVersionLimitExceeded>()(
  "DocumentVersionLimitExceeded",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DocumentVersionLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidActivation extends S.TaggedError<InvalidActivation>()(
  "InvalidActivation",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidActivation", httpResponseCode: 404 }),
) {}
export class OpsItemInvalidParameterException extends S.TaggedError<OpsItemInvalidParameterException>()(
  "OpsItemInvalidParameterException",
  {
    ParameterNames: S.optional(OpsItemParameterNamesList),
    Message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "OpsItemInvalidParameterException",
    httpResponseCode: 400,
  }),
) {}
export class ResourceDataSyncInvalidConfigurationException extends S.TaggedError<ResourceDataSyncInvalidConfigurationException>()(
  "ResourceDataSyncInvalidConfigurationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceDataSyncInvalidConfiguration",
    httpResponseCode: 400,
  }),
) {}
export class OpsItemConflictException extends S.TaggedError<OpsItemConflictException>()(
  "OpsItemConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OpsItemConflictException", httpResponseCode: 409 }),
) {}
export class TooManyUpdates extends S.TaggedError<TooManyUpdates>()(
  "TooManyUpdates",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyUpdates", httpResponseCode: 429 }),
) {}
export class OpsItemAccessDeniedException extends S.TaggedError<OpsItemAccessDeniedException>()(
  "OpsItemAccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsItemAccessDeniedException",
    httpResponseCode: 403,
  }),
) {}
export class ResourceDataSyncConflictException extends S.TaggedError<ResourceDataSyncConflictException>()(
  "ResourceDataSyncConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceDataSyncConflictException",
    httpResponseCode: 409,
  }),
) {}
export class InvalidPluginName extends S.TaggedError<InvalidPluginName>()(
  "InvalidPluginName",
  {},
  T.AwsQueryError({ code: "InvalidPluginName", httpResponseCode: 404 }),
) {}
export class InvocationDoesNotExist extends S.TaggedError<InvocationDoesNotExist>()(
  "InvocationDoesNotExist",
  {},
  T.AwsQueryError({ code: "InvocationDoesNotExist", httpResponseCode: 400 }),
) {}
export class InvalidAssociation extends S.TaggedError<InvalidAssociation>()(
  "InvalidAssociation",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAssociation", httpResponseCode: 400 }),
) {}
export class AutomationStepNotFoundException extends S.TaggedError<AutomationStepNotFoundException>()(
  "AutomationStepNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationStepNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class InvalidParameters extends S.TaggedError<InvalidParameters>()(
  "InvalidParameters",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameters", httpResponseCode: 400 }),
) {}
export class AssociationAlreadyExists extends S.TaggedError<AssociationAlreadyExists>()(
  "AssociationAlreadyExists",
  {},
  T.AwsQueryError({ code: "AssociationAlreadyExists", httpResponseCode: 400 }),
) {}
export class AssociationLimitExceeded extends S.TaggedError<AssociationLimitExceeded>()(
  "AssociationLimitExceeded",
  {},
  T.AwsQueryError({ code: "AssociationLimitExceeded", httpResponseCode: 400 }),
) {}
export class DocumentAlreadyExists extends S.TaggedError<DocumentAlreadyExists>()(
  "DocumentAlreadyExists",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DocumentAlreadyExists", httpResponseCode: 400 }),
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidFilterValue extends S.TaggedError<InvalidFilterValue>()(
  "InvalidFilterValue",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidFilterValue", httpResponseCode: 400 }),
) {}
export class InvalidDocumentOperation extends S.TaggedError<InvalidDocumentOperation>()(
  "InvalidDocumentOperation",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDocumentOperation", httpResponseCode: 403 }),
) {}
export class InvalidDeletionIdException extends S.TaggedError<InvalidDeletionIdException>()(
  "InvalidDeletionIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDeletionId", httpResponseCode: 400 }),
) {}
export class UnsupportedFeatureRequiredException extends S.TaggedError<UnsupportedFeatureRequiredException>()(
  "UnsupportedFeatureRequiredException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedFeatureRequiredException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDocumentVersion extends S.TaggedError<InvalidDocumentVersion>()(
  "InvalidDocumentVersion",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDocumentVersion", httpResponseCode: 400 }),
) {}
export class OpsMetadataNotFoundException extends S.TaggedError<OpsMetadataNotFoundException>()(
  "OpsMetadataNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ParameterVersionLabelLimitExceeded extends S.TaggedError<ParameterVersionLabelLimitExceeded>()(
  "ParameterVersionLabelLimitExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterVersionLabelLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTypeNameException extends S.TaggedError<InvalidTypeNameException>()(
  "InvalidTypeNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTypeName", httpResponseCode: 400 }),
) {}
export class InvalidPermissionType extends S.TaggedError<InvalidPermissionType>()(
  "InvalidPermissionType",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPermissionType", httpResponseCode: 400 }),
) {}
export class ComplianceTypeCountLimitExceededException extends S.TaggedError<ComplianceTypeCountLimitExceededException>()(
  "ComplianceTypeCountLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ComplianceTypeCountLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class HierarchyTypeMismatchException extends S.TaggedError<HierarchyTypeMismatchException>()(
  "HierarchyTypeMismatchException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HierarchyTypeMismatchException",
    httpResponseCode: 400,
  }),
) {}
export class AutomationDefinitionVersionNotFoundException extends S.TaggedError<AutomationDefinitionVersionNotFoundException>()(
  "AutomationDefinitionVersionNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationDefinitionVersionNotFound",
    httpResponseCode: 404,
  }),
) {}
export class AutomationDefinitionNotApprovedException extends S.TaggedError<AutomationDefinitionNotApprovedException>()(
  "AutomationDefinitionNotApprovedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationDefinitionNotApproved",
    httpResponseCode: 400,
  }),
) {}
export class TargetNotConnected extends S.TaggedError<TargetNotConnected>()(
  "TargetNotConnected",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TargetNotConnected", httpResponseCode: 430 }),
) {}
export class InvalidAssociationVersion extends S.TaggedError<InvalidAssociationVersion>()(
  "InvalidAssociationVersion",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAssociationVersion", httpResponseCode: 400 }),
) {}
export class InvalidOutputLocation extends S.TaggedError<InvalidOutputLocation>()(
  "InvalidOutputLocation",
  {},
  T.AwsQueryError({ code: "InvalidOutputLocation", httpResponseCode: 400 }),
) {}
export class DuplicateDocumentContent extends S.TaggedError<DuplicateDocumentContent>()(
  "DuplicateDocumentContent",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateDocumentContent", httpResponseCode: 400 }),
) {}
export class InvalidDocumentSchemaVersion extends S.TaggedError<InvalidDocumentSchemaVersion>()(
  "InvalidDocumentSchemaVersion",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDocumentSchemaVersion",
    httpResponseCode: 400,
  }),
) {}
export class InvalidActivationId extends S.TaggedError<InvalidActivationId>()(
  "InvalidActivationId",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidActivationId", httpResponseCode: 404 }),
) {}
export class ResourceDataSyncNotFoundException extends S.TaggedError<ResourceDataSyncNotFoundException>()(
  "ResourceDataSyncNotFoundException",
  {
    SyncName: S.optional(S.String),
    SyncType: S.optional(S.String),
    Message: S.optional(S.String),
  },
  T.AwsQueryError({ code: "ResourceDataSyncNotFound", httpResponseCode: 404 }),
) {}
export class OpsItemNotFoundException extends S.TaggedError<OpsItemNotFoundException>()(
  "OpsItemNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OpsItemNotFoundException", httpResponseCode: 400 }),
) {}
export class OpsItemAlreadyExistsException extends S.TaggedError<OpsItemAlreadyExistsException>()(
  "OpsItemAlreadyExistsException",
  { Message: S.optional(S.String), OpsItemId: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsItemAlreadyExistsException",
    httpResponseCode: 400,
  }),
) {}
export class TargetInUseException extends S.TaggedError<TargetInUseException>()(
  "TargetInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TargetInUseException", httpResponseCode: 400 }),
) {}
export class InvalidDocumentType extends S.TaggedError<InvalidDocumentType>()(
  "InvalidDocumentType",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDocumentType", httpResponseCode: 400 }),
) {}
export class OpsMetadataKeyLimitExceededException extends S.TaggedError<OpsMetadataKeyLimitExceededException>()(
  "OpsMetadataKeyLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataKeyLimitExceededException",
    httpResponseCode: 429,
  }),
) {}
export class ParameterVersionNotFound extends S.TaggedError<ParameterVersionNotFound>()(
  "ParameterVersionNotFound",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterVersionNotFound", httpResponseCode: 400 }),
) {}
export class InvalidAutomationSignalException extends S.TaggedError<InvalidAutomationSignalException>()(
  "InvalidAutomationSignalException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidAutomationSignalException",
    httpResponseCode: 400,
  }),
) {}
export class OpsItemLimitExceededException extends S.TaggedError<OpsItemLimitExceededException>()(
  "OpsItemLimitExceededException",
  {
    ResourceTypes: S.optional(OpsItemParameterNamesList),
    Limit: S.optional(S.Number),
    LimitType: S.optional(S.String),
    Message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "OpsItemLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDocumentContent extends S.TaggedError<InvalidDocumentContent>()(
  "InvalidDocumentContent",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDocumentContent", httpResponseCode: 400 }),
) {}
export class OpsMetadataAlreadyExistsException extends S.TaggedError<OpsMetadataAlreadyExistsException>()(
  "OpsMetadataAlreadyExistsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataAlreadyExistsException",
    httpResponseCode: 400,
  }),
) {}
export class ResourceDataSyncAlreadyExistsException extends S.TaggedError<ResourceDataSyncAlreadyExistsException>()(
  "ResourceDataSyncAlreadyExistsException",
  { SyncName: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceDataSyncAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDeleteInventoryParametersException extends S.TaggedError<InvalidDeleteInventoryParametersException>()(
  "InvalidDeleteInventoryParametersException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDeleteInventoryParameters",
    httpResponseCode: 400,
  }),
) {}
export class UnsupportedOperatingSystem extends S.TaggedError<UnsupportedOperatingSystem>()(
  "UnsupportedOperatingSystem",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedOperatingSystem",
    httpResponseCode: 400,
  }),
) {}
export class ResourcePolicyInvalidParameterException extends S.TaggedError<ResourcePolicyInvalidParameterException>()(
  "ResourcePolicyInvalidParameterException",
  {
    ParameterNames: S.optional(ResourcePolicyParameterNamesList),
    Message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "ResourcePolicyInvalidParameterException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidAggregatorException extends S.TaggedError<InvalidAggregatorException>()(
  "InvalidAggregatorException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAggregator", httpResponseCode: 400 }),
) {}
export class InvalidItemContentException extends S.TaggedError<InvalidItemContentException>()(
  "InvalidItemContentException",
  { TypeName: S.optional(S.String), Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidItemContent", httpResponseCode: 400 }),
) {}
export class CustomSchemaCountLimitExceededException extends S.TaggedError<CustomSchemaCountLimitExceededException>()(
  "CustomSchemaCountLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomSchemaCountLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class IncompatiblePolicyException extends S.TaggedError<IncompatiblePolicyException>()(
  "IncompatiblePolicyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IncompatiblePolicyException",
    httpResponseCode: 400,
  }),
) {}
export class FeatureNotAvailableException extends S.TaggedError<FeatureNotAvailableException>()(
  "FeatureNotAvailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "FeatureNotAvailableException",
    httpResponseCode: 400,
  }),
) {}
export class AutomationExecutionLimitExceededException extends S.TaggedError<AutomationExecutionLimitExceededException>()(
  "AutomationExecutionLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AutomationExecutionLimitExceeded",
    httpResponseCode: 429,
  }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), ReasonCode: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class InvalidSchedule extends S.TaggedError<InvalidSchedule>()(
  "InvalidSchedule",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSchedule", httpResponseCode: 400 }),
) {}
export class DuplicateDocumentVersionName extends S.TaggedError<DuplicateDocumentVersionName>()(
  "DuplicateDocumentVersionName",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DuplicateDocumentVersionName",
    httpResponseCode: 400,
  }),
) {}
export class OpsItemRelatedItemAssociationNotFoundException extends S.TaggedError<OpsItemRelatedItemAssociationNotFoundException>()(
  "OpsItemRelatedItemAssociationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsItemRelatedItemAssociationNotFoundException",
    httpResponseCode: 400,
  }),
) {}
export class UnsupportedCalendarException extends S.TaggedError<UnsupportedCalendarException>()(
  "UnsupportedCalendarException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedCalendarException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidNotificationConfig extends S.TaggedError<InvalidNotificationConfig>()(
  "InvalidNotificationConfig",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNotificationConfig", httpResponseCode: 400 }),
) {}
export class InvalidOutputFolder extends S.TaggedError<InvalidOutputFolder>()(
  "InvalidOutputFolder",
  {},
  T.AwsQueryError({ code: "InvalidOutputFolder", httpResponseCode: 400 }),
) {}
export class OpsMetadataTooManyUpdatesException extends S.TaggedError<OpsMetadataTooManyUpdatesException>()(
  "OpsMetadataTooManyUpdatesException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataTooManyUpdatesException",
    httpResponseCode: 429,
  }),
) {}
export class ResourcePolicyConflictException extends S.TaggedError<ResourcePolicyConflictException>()(
  "ResourcePolicyConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourcePolicyConflictException",
    httpResponseCode: 400,
  }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
  },
) {}
export class InvalidInstancePropertyFilterValue extends S.TaggedError<InvalidInstancePropertyFilterValue>()(
  "InvalidInstancePropertyFilterValue",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidInstancePropertyFilterValue",
    httpResponseCode: 400,
  }),
) {}
export class OpsItemRelatedItemAlreadyExistsException extends S.TaggedError<OpsItemRelatedItemAlreadyExistsException>()(
  "OpsItemRelatedItemAlreadyExistsException",
  {
    Message: S.optional(S.String),
    ResourceUri: S.optional(S.String),
    OpsItemId: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "OpsItemRelatedItemAlreadyExistsException",
    httpResponseCode: 400,
  }),
) {}
export class MaxDocumentSizeExceeded extends S.TaggedError<MaxDocumentSizeExceeded>()(
  "MaxDocumentSizeExceeded",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "MaxDocumentSizeExceeded", httpResponseCode: 400 }),
) {}
export class OpsMetadataLimitExceededException extends S.TaggedError<OpsMetadataLimitExceededException>()(
  "OpsMetadataLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OpsMetadataLimitExceededException",
    httpResponseCode: 429,
  }),
) {}
export class ResourceDataSyncCountExceededException extends S.TaggedError<ResourceDataSyncCountExceededException>()(
  "ResourceDataSyncCountExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourceDataSyncCountExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidInventoryRequestException extends S.TaggedError<InvalidInventoryRequestException>()(
  "InvalidInventoryRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInventoryRequest", httpResponseCode: 400 }),
) {}
export class AssociationExecutionDoesNotExist extends S.TaggedError<AssociationExecutionDoesNotExist>()(
  "AssociationExecutionDoesNotExist",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AssociationExecutionDoesNotExist",
    httpResponseCode: 404,
  }),
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
) {}
export class ItemSizeLimitExceededException extends S.TaggedError<ItemSizeLimitExceededException>()(
  "ItemSizeLimitExceededException",
  { TypeName: S.optional(S.String), Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ItemSizeLimitExceeded", httpResponseCode: 400 }),
) {}
export class InvalidInventoryItemContextException extends S.TaggedError<InvalidInventoryItemContextException>()(
  "InvalidInventoryItemContextException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidInventoryItemContext",
    httpResponseCode: 400,
  }),
) {}
export class InvalidAllowedPatternException extends S.TaggedError<InvalidAllowedPatternException>()(
  "InvalidAllowedPatternException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidAllowedPatternException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidAutomationExecutionParametersException extends S.TaggedError<InvalidAutomationExecutionParametersException>()(
  "InvalidAutomationExecutionParametersException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidAutomationExecutionParameters",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTarget extends S.TaggedError<InvalidTarget>()(
  "InvalidTarget",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTarget", httpResponseCode: 400 }),
) {}
export class InvalidRole extends S.TaggedError<InvalidRole>()(
  "InvalidRole",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRole", httpResponseCode: 400 }),
) {}
export class ResourcePolicyLimitExceededException extends S.TaggedError<ResourcePolicyLimitExceededException>()(
  "ResourcePolicyLimitExceededException",
  {
    Limit: S.optional(S.Number),
    LimitType: S.optional(S.String),
    Message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "ResourcePolicyLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTag extends S.TaggedError<InvalidTag>()(
  "InvalidTag",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTag", httpResponseCode: 400 }),
) {}
export class ResourcePolicyNotFoundException extends S.TaggedError<ResourcePolicyNotFoundException>()(
  "ResourcePolicyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ResourcePolicyNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class NoLongerSupportedException extends S.TaggedError<NoLongerSupportedException>()(
  "NoLongerSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NoLongerSupported", httpResponseCode: 400 }),
) {}
export class InvalidOptionException extends S.TaggedError<InvalidOptionException>()(
  "InvalidOptionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidOption", httpResponseCode: 400 }),
) {}
export class InvalidInstanceInformationFilterValue extends S.TaggedError<InvalidInstanceInformationFilterValue>()(
  "InvalidInstanceInformationFilterValue",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidInstanceInformationFilterValue",
    httpResponseCode: 400,
  }),
) {}
export class TotalSizeLimitExceededException extends S.TaggedError<TotalSizeLimitExceededException>()(
  "TotalSizeLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TotalSizeLimitExceeded", httpResponseCode: 400 }),
) {}
export class ItemContentMismatchException extends S.TaggedError<ItemContentMismatchException>()(
  "ItemContentMismatchException",
  { TypeName: S.optional(S.String), Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ItemContentMismatch", httpResponseCode: 400 }),
) {}
export class InvalidPolicyAttributeException extends S.TaggedError<InvalidPolicyAttributeException>()(
  "InvalidPolicyAttributeException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidPolicyAttributeException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTargetMaps extends S.TaggedError<InvalidTargetMaps>()(
  "InvalidTargetMaps",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTargetMaps", httpResponseCode: 400 }),
) {}
export class UnsupportedPlatformType extends S.TaggedError<UnsupportedPlatformType>()(
  "UnsupportedPlatformType",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedPlatformType", httpResponseCode: 400 }),
) {}
export class InvalidInventoryGroupException extends S.TaggedError<InvalidInventoryGroupException>()(
  "InvalidInventoryGroupException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInventoryGroup", httpResponseCode: 400 }),
) {}
export class SubTypeCountLimitExceededException extends S.TaggedError<SubTypeCountLimitExceededException>()(
  "SubTypeCountLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubTypeCountLimitExceeded", httpResponseCode: 400 }),
) {}
export class InvalidPolicyTypeException extends S.TaggedError<InvalidPolicyTypeException>()(
  "InvalidPolicyTypeException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidPolicyTypeException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidUpdate extends S.TaggedError<InvalidUpdate>()(
  "InvalidUpdate",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUpdate", httpResponseCode: 400 }),
) {}
export class InvalidResultAttributeException extends S.TaggedError<InvalidResultAttributeException>()(
  "InvalidResultAttributeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidResultAttribute", httpResponseCode: 400 }),
) {}
export class UnsupportedInventoryItemContextException extends S.TaggedError<UnsupportedInventoryItemContextException>()(
  "UnsupportedInventoryItemContextException",
  { TypeName: S.optional(S.String), Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedInventoryItemContext",
    httpResponseCode: 400,
  }),
) {}
export class ParameterAlreadyExists extends S.TaggedError<ParameterAlreadyExists>()(
  "ParameterAlreadyExists",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterAlreadyExists", httpResponseCode: 400 }),
) {}
export class UnsupportedInventorySchemaVersionException extends S.TaggedError<UnsupportedInventorySchemaVersionException>()(
  "UnsupportedInventorySchemaVersionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedInventorySchemaVersion",
    httpResponseCode: 400,
  }),
) {}
export class ParameterLimitExceeded extends S.TaggedError<ParameterLimitExceeded>()(
  "ParameterLimitExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterLimitExceeded", httpResponseCode: 429 }),
) {}
export class ParameterMaxVersionLimitExceeded extends S.TaggedError<ParameterMaxVersionLimitExceeded>()(
  "ParameterMaxVersionLimitExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterMaxVersionLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ParameterPatternMismatchException extends S.TaggedError<ParameterPatternMismatchException>()(
  "ParameterPatternMismatchException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterPatternMismatchException",
    httpResponseCode: 400,
  }),
) {}
export class PoliciesLimitExceededException extends S.TaggedError<PoliciesLimitExceededException>()(
  "PoliciesLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PoliciesLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class UnsupportedParameterType extends S.TaggedError<UnsupportedParameterType>()(
  "UnsupportedParameterType",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedParameterType", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Deletes a maintenance window.
 */
export const deleteMaintenanceWindow: (
  input: DeleteMaintenanceWindowRequest,
) => Effect.Effect<
  DeleteMaintenanceWindowResult,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMaintenanceWindowRequest,
  output: DeleteMaintenanceWindowResult,
  errors: [InternalServerError],
}));
/**
 * Delete a list of parameters. After deleting a parameter, wait for at least 30 seconds to
 * create a parameter with the same name.
 */
export const deleteParameters: (
  input: DeleteParametersRequest,
) => Effect.Effect<
  DeleteParametersResult,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteParametersRequest,
  output: DeleteParametersResult,
  errors: [InternalServerError],
}));
/**
 * Removes a patch group from a patch baseline.
 */
export const deregisterPatchBaselineForPatchGroup: (
  input: DeregisterPatchBaselineForPatchGroupRequest,
) => Effect.Effect<
  DeregisterPatchBaselineForPatchGroupResult,
  InternalServerError | InvalidResourceId | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterPatchBaselineForPatchGroupRequest,
  output: DeregisterPatchBaselineForPatchGroupResult,
  errors: [InternalServerError, InvalidResourceId],
}));
/**
 * Retrieves the Session Manager connection status for a managed node to determine whether it is running
 * and ready to receive Session Manager connections.
 */
export const getConnectionStatus: (
  input: GetConnectionStatusRequest,
) => Effect.Effect<
  GetConnectionStatusResponse,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionStatusRequest,
  output: GetConnectionStatusResponse,
  errors: [InternalServerError],
}));
/**
 * Retrieves the default patch baseline. Amazon Web Services Systems Manager supports creating multiple default patch
 * baselines. For example, you can create a default patch baseline for each operating system.
 *
 * If you don't specify an operating system value, the default patch baseline for Windows is
 * returned.
 */
export const getDefaultPatchBaseline: (
  input: GetDefaultPatchBaselineRequest,
) => Effect.Effect<
  GetDefaultPatchBaselineResult,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDefaultPatchBaselineRequest,
  output: GetDefaultPatchBaselineResult,
  errors: [InternalServerError],
}));
/**
 * Retrieves the patch baseline that should be used for the specified patch group.
 */
export const getPatchBaselineForPatchGroup: (
  input: GetPatchBaselineForPatchGroupRequest,
) => Effect.Effect<
  GetPatchBaselineForPatchGroupResult,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPatchBaselineForPatchGroupRequest,
  output: GetPatchBaselineForPatchGroupResult,
  errors: [InternalServerError],
}));
/**
 * Returns a list of the tags assigned to the specified resource.
 *
 * For information about the ID format for each supported resource type, see AddTagsToResource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResult,
  InternalServerError | InvalidResourceId | InvalidResourceType | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [InternalServerError, InvalidResourceId, InvalidResourceType],
}));
/**
 * Permanently ends a session and closes the data connection between the Session Manager client and
 * SSM Agent on the managed node. A terminated session can't be resumed.
 */
export const terminateSession: (
  input: TerminateSessionRequest,
) => Effect.Effect<
  TerminateSessionResponse,
  InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateSessionRequest,
  output: TerminateSessionResponse,
  errors: [InternalServerError],
}));
/**
 * Attempts to cancel the command specified by the Command ID. There is no guarantee that the
 * command will be terminated and the underlying process stopped.
 */
export const cancelCommand: (
  input: CancelCommandRequest,
) => Effect.Effect<
  CancelCommandResult,
  | DuplicateInstanceId
  | InternalServerError
  | InvalidCommandId
  | InvalidInstanceId
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCommandRequest,
  output: CancelCommandResult,
  errors: [
    DuplicateInstanceId,
    InternalServerError,
    InvalidCommandId,
    InvalidInstanceId,
  ],
}));
/**
 * Stops a maintenance window execution that is already in progress and cancels any tasks in
 * the window that haven't already starting running. Tasks already in progress will continue to
 * completion.
 */
export const cancelMaintenanceWindowExecution: (
  input: CancelMaintenanceWindowExecutionRequest,
) => Effect.Effect<
  CancelMaintenanceWindowExecutionResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMaintenanceWindowExecutionRequest,
  output: CancelMaintenanceWindowExecutionResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Deletes a patch baseline.
 */
export const deletePatchBaseline: (
  input: DeletePatchBaselineRequest,
) => Effect.Effect<
  DeletePatchBaselineResult,
  InternalServerError | ResourceInUseException | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePatchBaselineRequest,
  output: DeletePatchBaselineResult,
  errors: [InternalServerError, ResourceInUseException],
}));
/**
 * Lists all patches eligible to be included in a patch baseline.
 *
 * Currently, `DescribeAvailablePatches` supports only the Amazon Linux 1, Amazon
 * Linux 2, and Windows Server operating systems.
 */
export const describeAvailablePatches: {
  (
    input: DescribeAvailablePatchesRequest,
  ): Effect.Effect<
    DescribeAvailablePatchesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAvailablePatchesRequest,
  ) => Stream.Stream<
    DescribeAvailablePatchesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAvailablePatchesRequest,
  ) => Stream.Stream<
    Patch,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAvailablePatchesRequest,
  output: DescribeAvailablePatchesResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Patches",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the individual task executions (one per target) for a particular task run as part
 * of a maintenance window execution.
 */
export const describeMaintenanceWindowExecutionTaskInvocations: {
  (
    input: DescribeMaintenanceWindowExecutionTaskInvocationsRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowExecutionTaskInvocationsResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowExecutionTaskInvocationsRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowExecutionTaskInvocationsResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowExecutionTaskInvocationsRequest,
  ) => Stream.Stream<
    MaintenanceWindowExecutionTaskInvocationIdentity,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowExecutionTaskInvocationsRequest,
  output: DescribeMaintenanceWindowExecutionTaskInvocationsResult,
  errors: [DoesNotExistException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WindowExecutionTaskInvocationIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * For a given maintenance window execution, lists the tasks that were run.
 */
export const describeMaintenanceWindowExecutionTasks: {
  (
    input: DescribeMaintenanceWindowExecutionTasksRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowExecutionTasksResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowExecutionTasksRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowExecutionTasksResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowExecutionTasksRequest,
  ) => Stream.Stream<
    MaintenanceWindowExecutionTaskIdentity,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowExecutionTasksRequest,
  output: DescribeMaintenanceWindowExecutionTasksResult,
  errors: [DoesNotExistException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WindowExecutionTaskIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the maintenance windows in an Amazon Web Services account.
 */
export const describeMaintenanceWindows: {
  (
    input: DescribeMaintenanceWindowsRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowsRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowsRequest,
  ) => Stream.Stream<
    MaintenanceWindowIdentity,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowsRequest,
  output: DescribeMaintenanceWindowsResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WindowIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about upcoming executions of a maintenance window.
 */
export const describeMaintenanceWindowSchedule: {
  (
    input: DescribeMaintenanceWindowScheduleRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowScheduleResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowScheduleRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowScheduleResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowScheduleRequest,
  ) => Stream.Stream<
    ScheduledWindowExecution,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowScheduleRequest,
  output: DescribeMaintenanceWindowScheduleResult,
  errors: [DoesNotExistException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScheduledWindowExecutions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about the maintenance window targets or tasks that a managed node is
 * associated with.
 */
export const describeMaintenanceWindowsForTarget: {
  (
    input: DescribeMaintenanceWindowsForTargetRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowsForTargetResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowsForTargetRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowsForTargetResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowsForTargetRequest,
  ) => Stream.Stream<
    MaintenanceWindowIdentityForTarget,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowsForTargetRequest,
  output: DescribeMaintenanceWindowsForTargetResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WindowIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the targets registered with the maintenance window.
 */
export const describeMaintenanceWindowTargets: {
  (
    input: DescribeMaintenanceWindowTargetsRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowTargetsResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowTargetsRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowTargetsResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowTargetsRequest,
  ) => Stream.Stream<
    MaintenanceWindowTarget,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowTargetsRequest,
  output: DescribeMaintenanceWindowTargetsResult,
  errors: [DoesNotExistException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Targets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tasks in a maintenance window.
 *
 * For maintenance window tasks without a specified target, you can't supply values for
 * `--max-errors` and `--max-concurrency`. Instead, the system inserts a
 * placeholder value of `1`, which may be reported in the response to this command.
 * These values don't affect the running of your task and can be ignored.
 */
export const describeMaintenanceWindowTasks: {
  (
    input: DescribeMaintenanceWindowTasksRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowTasksResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowTasksRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowTasksResult,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowTasksRequest,
  ) => Stream.Stream<
    MaintenanceWindowTask,
    DoesNotExistException | InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowTasksRequest,
  output: DescribeMaintenanceWindowTasksResult,
  errors: [DoesNotExistException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tasks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the patch baselines in your Amazon Web Services account.
 */
export const describePatchBaselines: {
  (
    input: DescribePatchBaselinesRequest,
  ): Effect.Effect<
    DescribePatchBaselinesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePatchBaselinesRequest,
  ) => Stream.Stream<
    DescribePatchBaselinesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePatchBaselinesRequest,
  ) => Stream.Stream<
    PatchBaselineIdentity,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePatchBaselinesRequest,
  output: DescribePatchBaselinesResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "BaselineIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all patch groups that have been registered with patch baselines.
 */
export const describePatchGroups: {
  (
    input: DescribePatchGroupsRequest,
  ): Effect.Effect<
    DescribePatchGroupsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePatchGroupsRequest,
  ) => Stream.Stream<
    DescribePatchGroupsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePatchGroupsRequest,
  ) => Stream.Stream<
    PatchGroupPatchBaselineMapping,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePatchGroupsRequest,
  output: DescribePatchGroupsResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Mappings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns high-level aggregated patch compliance state information for a patch group.
 */
export const describePatchGroupState: (
  input: DescribePatchGroupStateRequest,
) => Effect.Effect<
  DescribePatchGroupStateResult,
  InternalServerError | InvalidNextToken | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePatchGroupStateRequest,
  output: DescribePatchGroupStateResult,
  errors: [InternalServerError, InvalidNextToken],
}));
/**
 * Lists the properties of available patches organized by product, product family,
 * classification, severity, and other properties of available patches. You can use the reported
 * properties in the filters you specify in requests for operations such as CreatePatchBaseline, UpdatePatchBaseline, DescribeAvailablePatches, and DescribePatchBaselines.
 *
 * The following section lists the properties that can be used in filters for each major
 * operating system type:
 *
 * ### AMAZON_LINUX
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### AMAZON_LINUX_2
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### AMAZON_LINUX_2023
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### CENTOS
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### DEBIAN
 *
 * Valid properties: `PRODUCT` | `PRIORITY`
 *
 * ### MACOS
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION`
 *
 * ### ORACLE_LINUX
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### REDHAT_ENTERPRISE_LINUX
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### SUSE
 *
 * Valid properties: `PRODUCT` | `CLASSIFICATION` |
 * `SEVERITY`
 *
 * ### UBUNTU
 *
 * Valid properties: `PRODUCT` | `PRIORITY`
 *
 * ### WINDOWS
 *
 * Valid properties: `PRODUCT` | `PRODUCT_FAMILY` |
 * `CLASSIFICATION` | `MSRC_SEVERITY`
 */
export const describePatchProperties: {
  (
    input: DescribePatchPropertiesRequest,
  ): Effect.Effect<
    DescribePatchPropertiesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePatchPropertiesRequest,
  ) => Stream.Stream<
    DescribePatchPropertiesResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribePatchPropertiesRequest,
  ) => Stream.Stream<
    S.Schema.Type<typeof PatchPropertyEntry>,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePatchPropertiesRequest,
  output: DescribePatchPropertiesResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Properties",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details about a specific task run as part of a maintenance window
 * execution.
 */
export const getMaintenanceWindowExecutionTask: (
  input: GetMaintenanceWindowExecutionTaskRequest,
) => Effect.Effect<
  GetMaintenanceWindowExecutionTaskResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaintenanceWindowExecutionTaskRequest,
  output: GetMaintenanceWindowExecutionTaskResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Get information about one or more parameters by specifying multiple parameter names.
 *
 * To get information about a single parameter, you can use the GetParameter
 * operation instead.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 */
export const getParameters: (
  input: GetParametersRequest,
) => Effect.Effect<
  GetParametersResult,
  InternalServerError | InvalidKeyId | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetParametersRequest,
  output: GetParametersResult,
  errors: [InternalServerError, InvalidKeyId],
}));
/**
 * Retrieves all versions of an association for a specific association ID.
 */
export const listAssociationVersions: {
  (
    input: ListAssociationVersionsRequest,
  ): Effect.Effect<
    ListAssociationVersionsResult,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociationVersionsRequest,
  ) => Stream.Stream<
    ListAssociationVersionsResult,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociationVersionsRequest,
  ) => Stream.Stream<
    AssociationVersionInfo,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociationVersionsRequest,
  output: ListAssociationVersionsResult,
  errors: [AssociationDoesNotExist, InternalServerError, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AssociationVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the commands requested by users of the Amazon Web Services account.
 */
export const listCommands: {
  (
    input: ListCommandsRequest,
  ): Effect.Effect<
    ListCommandsResult,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommandsRequest,
  ) => Stream.Stream<
    ListCommandsResult,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListCommandsRequest,
  ) => Stream.Stream<
    Command,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommandsRequest,
  output: ListCommandsResult,
  errors: [
    InternalServerError,
    InvalidCommandId,
    InvalidFilterKey,
    InvalidInstanceId,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Commands",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all versions for a document.
 */
export const listDocumentVersions: {
  (
    input: ListDocumentVersionsRequest,
  ): Effect.Effect<
    ListDocumentVersionsResult,
    InternalServerError | InvalidDocument | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDocumentVersionsRequest,
  ) => Stream.Stream<
    ListDocumentVersionsResult,
    InternalServerError | InvalidDocument | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDocumentVersionsRequest,
  ) => Stream.Stream<
    DocumentVersionInfo,
    InternalServerError | InvalidDocument | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDocumentVersionsRequest,
  output: ListDocumentVersionsResult,
  errors: [InternalServerError, InvalidDocument, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DocumentVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a resource-level summary count. The summary includes information about compliant and
 * non-compliant statuses and detailed compliance-item severity counts, according to the filter
 * criteria you specify.
 */
export const listResourceComplianceSummaries: {
  (
    input: ListResourceComplianceSummariesRequest,
  ): Effect.Effect<
    ListResourceComplianceSummariesResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceComplianceSummariesRequest,
  ) => Stream.Stream<
    ListResourceComplianceSummariesResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceComplianceSummariesRequest,
  ) => Stream.Stream<
    ResourceComplianceSummaryItem,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceComplianceSummariesRequest,
  output: ListResourceComplianceSummariesResult,
  errors: [InternalServerError, InvalidFilter, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceComplianceSummaryItems",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Stop an Automation that is currently running.
 */
export const stopAutomationExecution: (
  input: StopAutomationExecutionRequest,
) => Effect.Effect<
  StopAutomationExecutionResult,
  | AutomationExecutionNotFoundException
  | InternalServerError
  | InvalidAutomationStatusUpdateException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAutomationExecutionRequest,
  output: StopAutomationExecutionResult,
  errors: [
    AutomationExecutionNotFoundException,
    InternalServerError,
    InvalidAutomationStatusUpdateException,
  ],
}));
/**
 * Delete an OpsItem. You must have permission in Identity and Access Management (IAM) to
 * delete an OpsItem.
 *
 * Note the following important information about this operation.
 *
 * - Deleting an OpsItem is irreversible. You can't restore a deleted OpsItem.
 *
 * - This operation uses an *eventual consistency model*, which means the
 * system can take a few minutes to complete this operation. If you delete an OpsItem and
 * immediately call, for example, GetOpsItem, the deleted OpsItem might still
 * appear in the response.
 *
 * - This operation is idempotent. The system doesn't throw an exception if you repeatedly
 * call this operation for the same OpsItem. If the first call is successful, all additional calls
 * return the same successful response as the first call.
 *
 * - This operation doesn't support cross-account calls. A delegated administrator or
 * management account can't delete OpsItems in other accounts, even if OpsCenter has been set up for
 * cross-account administration. For more information about cross-account administration, see
 * Setting up
 * OpsCenter to centrally manage OpsItems across accounts in the *Systems Manager User Guide*.
 */
export const deleteOpsItem: (
  input: DeleteOpsItemRequest,
) => Effect.Effect<
  DeleteOpsItemResponse,
  InternalServerError | OpsItemInvalidParameterException | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOpsItemRequest,
  output: DeleteOpsItemResponse,
  errors: [InternalServerError, OpsItemInvalidParameterException],
}));
/**
 * Removes tag keys from the specified resource.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceRequest,
) => Effect.Effect<
  RemoveTagsFromResourceResult,
  | InternalServerError
  | InvalidResourceId
  | InvalidResourceType
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceRequest,
  output: RemoveTagsFromResourceResult,
  errors: [
    InternalServerError,
    InvalidResourceId,
    InvalidResourceType,
    TooManyUpdates,
  ],
}));
/**
 * Returns detailed information about command execution for an invocation or plugin. The Run
 * Command API follows an eventual consistency model, due to the distributed nature of the system
 * supporting the API. This means that the result of an API command you run that affects your
 * resources might not be immediately visible to all subsequent commands you run. You should keep
 * this in mind when you carry out an API command that immediately follows a previous API
 * command.
 *
 * `GetCommandInvocation` only gives the execution status of a plugin in a document.
 * To get the command execution status on a specific managed node, use ListCommandInvocations. To get the command execution status across managed nodes,
 * use ListCommands.
 */
export const getCommandInvocation: (
  input: GetCommandInvocationRequest,
) => Effect.Effect<
  GetCommandInvocationResult,
  | InternalServerError
  | InvalidCommandId
  | InvalidInstanceId
  | InvalidPluginName
  | InvocationDoesNotExist
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommandInvocationRequest,
  output: GetCommandInvocationResult,
  errors: [
    InternalServerError,
    InvalidCommandId,
    InvalidInstanceId,
    InvalidPluginName,
    InvocationDoesNotExist,
  ],
}));
/**
 * Removes the server or virtual machine from the list of registered servers.
 *
 * If you want to reregister an on-premises server, edge device, or VM, you must use a
 * different Activation Code and Activation ID than used to register the machine previously. The
 * Activation Code and Activation ID must not have already been used on the maximum number of
 * activations specified when they were created. For more information, see Deregistering
 * managed nodes in a hybrid and multicloud environment in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const deregisterManagedInstance: (
  input: DeregisterManagedInstanceRequest,
) => Effect.Effect<
  DeregisterManagedInstanceResult,
  InternalServerError | InvalidInstanceId | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterManagedInstanceRequest,
  output: DeregisterManagedInstanceResult,
  errors: [InternalServerError, InvalidInstanceId],
}));
/**
 * Changes the Identity and Access Management (IAM) role that is assigned to the
 * on-premises server, edge device, or virtual machines (VM). IAM roles are first
 * assigned to these hybrid nodes during the activation process. For more information, see CreateActivation.
 */
export const updateManagedInstanceRole: (
  input: UpdateManagedInstanceRoleRequest,
) => Effect.Effect<
  UpdateManagedInstanceRoleResult,
  InternalServerError | InvalidInstanceId | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateManagedInstanceRoleRequest,
  output: UpdateManagedInstanceRoleResult,
  errors: [InternalServerError, InvalidInstanceId],
}));
/**
 * Removes a task from a maintenance window.
 */
export const deregisterTaskFromMaintenanceWindow: (
  input: DeregisterTaskFromMaintenanceWindowRequest,
) => Effect.Effect<
  DeregisterTaskFromMaintenanceWindowResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTaskFromMaintenanceWindowRequest,
  output: DeregisterTaskFromMaintenanceWindowResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Retrieves a maintenance window.
 */
export const getMaintenanceWindow: (
  input: GetMaintenanceWindowRequest,
) => Effect.Effect<
  GetMaintenanceWindowResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaintenanceWindowRequest,
  output: GetMaintenanceWindowResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Retrieves details about a specific a maintenance window execution.
 */
export const getMaintenanceWindowExecution: (
  input: GetMaintenanceWindowExecutionRequest,
) => Effect.Effect<
  GetMaintenanceWindowExecutionResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaintenanceWindowExecutionRequest,
  output: GetMaintenanceWindowExecutionResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Retrieves information about a specific task running on a specific target.
 */
export const getMaintenanceWindowExecutionTaskInvocation: (
  input: GetMaintenanceWindowExecutionTaskInvocationRequest,
) => Effect.Effect<
  GetMaintenanceWindowExecutionTaskInvocationResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaintenanceWindowExecutionTaskInvocationRequest,
  output: GetMaintenanceWindowExecutionTaskInvocationResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Retrieves the details of a maintenance window task.
 *
 * For maintenance window tasks without a specified target, you can't supply values for
 * `--max-errors` and `--max-concurrency`. Instead, the system inserts a
 * placeholder value of `1`, which may be reported in the response to this command.
 * These values don't affect the running of your task and can be ignored.
 *
 * To retrieve a list of tasks in a maintenance window, instead use the DescribeMaintenanceWindowTasks command.
 */
export const getMaintenanceWindowTask: (
  input: GetMaintenanceWindowTaskRequest,
) => Effect.Effect<
  GetMaintenanceWindowTaskResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaintenanceWindowTaskRequest,
  output: GetMaintenanceWindowTaskResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Retrieves information about a patch baseline.
 */
export const getPatchBaseline: (
  input: GetPatchBaselineRequest,
) => Effect.Effect<
  GetPatchBaselineResult,
  | DoesNotExistException
  | InternalServerError
  | InvalidResourceId
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPatchBaselineRequest,
  output: GetPatchBaselineResult,
  errors: [DoesNotExistException, InternalServerError, InvalidResourceId],
}));
/**
 * Defines the default patch baseline for the relevant operating system.
 *
 * To reset the Amazon Web Services-predefined patch baseline as the default, specify the full patch baseline
 * Amazon Resource Name (ARN) as the baseline ID value. For example, for CentOS, specify
 * `arn:aws:ssm:us-east-2:733109147000:patchbaseline/pb-0574b43a65ea646ed` instead of
 * `pb-0574b43a65ea646ed`.
 */
export const registerDefaultPatchBaseline: (
  input: RegisterDefaultPatchBaselineRequest,
) => Effect.Effect<
  RegisterDefaultPatchBaselineResult,
  | DoesNotExistException
  | InternalServerError
  | InvalidResourceId
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDefaultPatchBaselineRequest,
  output: RegisterDefaultPatchBaselineResult,
  errors: [DoesNotExistException, InternalServerError, InvalidResourceId],
}));
/**
 * Reconnects a session to a managed node after it has been disconnected. Connections can be
 * resumed for disconnected sessions, but not terminated sessions.
 *
 * This command is primarily for use by client machines to automatically reconnect during
 * intermittent network issues. It isn't intended for any other use.
 */
export const resumeSession: (
  input: ResumeSessionRequest,
) => Effect.Effect<
  ResumeSessionResponse,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeSessionRequest,
  output: ResumeSessionResponse,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Updates an existing maintenance window. Only specified parameters are modified.
 *
 * The value you specify for `Duration` determines the specific end time for the
 * maintenance window based on the time it begins. No maintenance window tasks are permitted to
 * start after the resulting endtime minus the number of hours you specify for `Cutoff`.
 * For example, if the maintenance window starts at 3 PM, the duration is three hours, and the
 * value you specify for `Cutoff` is one hour, no maintenance window tasks can start
 * after 5 PM.
 */
export const updateMaintenanceWindow: (
  input: UpdateMaintenanceWindowRequest,
) => Effect.Effect<
  UpdateMaintenanceWindowResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaintenanceWindowRequest,
  output: UpdateMaintenanceWindowResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Modifies the target of an existing maintenance window. You
 * can change the following:
 *
 * - Name
 *
 * - Description
 *
 * - Owner
 *
 * - IDs for an ID target
 *
 * - Tags for a Tag target
 *
 * - From any supported tag type to another. The three supported tag types are ID target, Tag
 * target, and resource group. For more information, see Target.
 *
 * If a parameter is null, then the corresponding field isn't modified.
 */
export const updateMaintenanceWindowTarget: (
  input: UpdateMaintenanceWindowTargetRequest,
) => Effect.Effect<
  UpdateMaintenanceWindowTargetResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaintenanceWindowTargetRequest,
  output: UpdateMaintenanceWindowTargetResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Modifies a task assigned to a maintenance window. You can't change the task type, but you
 * can change the following values:
 *
 * - `TaskARN`. For example, you can change a `RUN_COMMAND` task from
 * `AWS-RunPowerShellScript` to `AWS-RunShellScript`.
 *
 * - `ServiceRoleArn`
 *
 * - `TaskInvocationParameters`
 *
 * - `Priority`
 *
 * - `MaxConcurrency`
 *
 * - `MaxErrors`
 *
 * One or more targets must be specified for maintenance window Run Command-type tasks.
 * Depending on the task, targets are optional for other maintenance window task types (Automation,
 * Lambda, and Step Functions). For more information about running tasks
 * that don't specify targets, see Registering
 * maintenance window tasks without targets in the
 * *Amazon Web Services Systems Manager User Guide*.
 *
 * If the value for a parameter in `UpdateMaintenanceWindowTask` is null, then the
 * corresponding field isn't modified. If you set `Replace` to true, then all fields
 * required by the RegisterTaskWithMaintenanceWindow operation are required for
 * this request. Optional fields that aren't specified are set to null.
 *
 * When you update a maintenance window task that has options specified in
 * `TaskInvocationParameters`, you must provide again all the
 * `TaskInvocationParameters` values that you want to retain. The values you don't
 * specify again are removed. For example, suppose that when you registered a Run Command task, you
 * specified `TaskInvocationParameters` values for `Comment`,
 * `NotificationConfig`, and `OutputS3BucketName`. If you update the
 * maintenance window task and specify only a different `OutputS3BucketName` value, the
 * values for `Comment` and `NotificationConfig` are removed.
 */
export const updateMaintenanceWindowTask: (
  input: UpdateMaintenanceWindowTaskRequest,
) => Effect.Effect<
  UpdateMaintenanceWindowTaskResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaintenanceWindowTaskRequest,
  output: UpdateMaintenanceWindowTaskResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Modifies an existing patch baseline. Fields not specified in the request are left
 * unchanged.
 *
 * For information about valid key-value pairs in `PatchFilters` for each supported
 * operating system type, see PatchFilter.
 */
export const updatePatchBaseline: (
  input: UpdatePatchBaselineRequest,
) => Effect.Effect<
  UpdatePatchBaselineResult,
  DoesNotExistException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePatchBaselineRequest,
  output: UpdatePatchBaselineResult,
  errors: [DoesNotExistException, InternalServerError],
}));
/**
 * Runs an association immediately and only one time. This operation can be helpful when
 * troubleshooting associations.
 */
export const startAssociationsOnce: (
  input: StartAssociationsOnceRequest,
) => Effect.Effect<
  StartAssociationsOnceResult,
  AssociationDoesNotExist | InvalidAssociation | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAssociationsOnceRequest,
  output: StartAssociationsOnceResult,
  errors: [AssociationDoesNotExist, InvalidAssociation],
}));
/**
 * All associations for the managed nodes.
 */
export const describeEffectiveInstanceAssociations: {
  (
    input: DescribeEffectiveInstanceAssociationsRequest,
  ): Effect.Effect<
    DescribeEffectiveInstanceAssociationsResult,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEffectiveInstanceAssociationsRequest,
  ) => Stream.Stream<
    DescribeEffectiveInstanceAssociationsResult,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEffectiveInstanceAssociationsRequest,
  ) => Stream.Stream<
    InstanceAssociation,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEffectiveInstanceAssociationsRequest,
  output: DescribeEffectiveInstanceAssociationsResult,
  errors: [InternalServerError, InvalidInstanceId, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Associations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the high-level patch state of one or more managed nodes.
 */
export const describeInstancePatchStates: {
  (
    input: DescribeInstancePatchStatesRequest,
  ): Effect.Effect<
    DescribeInstancePatchStatesResult,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstancePatchStatesRequest,
  ) => Stream.Stream<
    DescribeInstancePatchStatesResult,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstancePatchStatesRequest,
  ) => Stream.Stream<
    InstancePatchState,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstancePatchStatesRequest,
  output: DescribeInstancePatchStatesResult,
  errors: [InternalServerError, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InstancePatchStates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete a parameter from the system. After deleting a parameter, wait for at least 30 seconds
 * to create a parameter with the same name.
 */
export const deleteParameter: (
  input: DeleteParameterRequest,
) => Effect.Effect<
  DeleteParameterResult,
  InternalServerError | ParameterNotFound | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteParameterRequest,
  output: DeleteParameterResult,
  errors: [InternalServerError, ParameterNotFound],
}));
/**
 * Retrieves information about the patches on the specified managed node and their state
 * relative to the patch baseline being used for the node.
 */
export const describeInstancePatches: {
  (
    input: DescribeInstancePatchesRequest,
  ): Effect.Effect<
    DescribeInstancePatchesResult,
    | InternalServerError
    | InvalidFilter
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstancePatchesRequest,
  ) => Stream.Stream<
    DescribeInstancePatchesResult,
    | InternalServerError
    | InvalidFilter
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstancePatchesRequest,
  ) => Stream.Stream<
    PatchComplianceData,
    | InternalServerError
    | InvalidFilter
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstancePatchesRequest,
  output: DescribeInstancePatchesResult,
  errors: [
    InternalServerError,
    InvalidFilter,
    InvalidInstanceId,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Patches",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the high-level patch state for the managed nodes in the specified patch
 * group.
 */
export const describeInstancePatchStatesForPatchGroup: {
  (
    input: DescribeInstancePatchStatesForPatchGroupRequest,
  ): Effect.Effect<
    DescribeInstancePatchStatesForPatchGroupResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstancePatchStatesForPatchGroupRequest,
  ) => Stream.Stream<
    DescribeInstancePatchStatesForPatchGroupResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstancePatchStatesForPatchGroupRequest,
  ) => Stream.Stream<
    InstancePatchState,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstancePatchStatesForPatchGroupRequest,
  output: DescribeInstancePatchStatesForPatchGroupResult,
  errors: [InternalServerError, InvalidFilter, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InstancePatchStates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * `ServiceSetting` is an account-level setting for an Amazon Web Services service. This setting
 * defines how a user interacts with or uses a service or a feature of a service. For example, if an
 * Amazon Web Services service charges money to the account based on feature or service usage, then the Amazon Web Services
 * service team might create a default setting of "false". This means the user can't use this
 * feature unless they change the setting to "true" and intentionally opt in for a paid
 * feature.
 *
 * Services map a `SettingId` object to a setting value. Amazon Web Services services teams define
 * the default value for a `SettingId`. You can't create a new `SettingId`,
 * but you can overwrite the default value if you have the `ssm:UpdateServiceSetting`
 * permission for the setting. Use the GetServiceSetting API operation to view the
 * current value. Or, use the ResetServiceSetting to change the value back to the
 * original value defined by the Amazon Web Services service team.
 *
 * Update the service setting for the account.
 */
export const updateServiceSetting: (
  input: UpdateServiceSettingRequest,
) => Effect.Effect<
  UpdateServiceSettingResult,
  InternalServerError | ServiceSettingNotFound | TooManyUpdates | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSettingRequest,
  output: UpdateServiceSettingResult,
  errors: [InternalServerError, ServiceSettingNotFound, TooManyUpdates],
}));
/**
 * `ServiceSetting` is an account-level setting for an Amazon Web Services service. This setting
 * defines how a user interacts with or uses a service or a feature of a service. For example, if an
 * Amazon Web Services service charges money to the account based on feature or service usage, then the Amazon Web Services
 * service team might create a default setting of `false`. This means the user can't use
 * this feature unless they change the setting to `true` and intentionally opt in for a
 * paid feature.
 *
 * Services map a `SettingId` object to a setting value. Amazon Web Services services teams define
 * the default value for a `SettingId`. You can't create a new `SettingId`,
 * but you can overwrite the default value if you have the `ssm:UpdateServiceSetting`
 * permission for the setting. Use the UpdateServiceSetting API operation to
 * change the default setting. Or use the ResetServiceSetting to change the value
 * back to the original value defined by the Amazon Web Services service team.
 *
 * Query the current service setting for the Amazon Web Services account.
 */
export const getServiceSetting: (
  input: GetServiceSettingRequest,
) => Effect.Effect<
  GetServiceSettingResult,
  InternalServerError | ServiceSettingNotFound | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingRequest,
  output: GetServiceSettingResult,
  errors: [InternalServerError, ServiceSettingNotFound],
}));
/**
 * Adds or overwrites one or more tags for the specified resource. *Tags*
 * are metadata that you can assign to your automations, documents, managed nodes, maintenance
 * windows, Parameter Store parameters, and patch baselines. Tags enable you to categorize your
 * resources in different ways, for example, by purpose, owner, or environment. Each tag consists of
 * a key and an optional value, both of which you define. For example, you could define a set of
 * tags for your account's managed nodes that helps you track each node's owner and stack level. For
 * example:
 *
 * - `Key=Owner,Value=DbAdmin`
 *
 * - `Key=Owner,Value=SysAdmin`
 *
 * - `Key=Owner,Value=Dev`
 *
 * - `Key=Stack,Value=Production`
 *
 * - `Key=Stack,Value=Pre-Production`
 *
 * - `Key=Stack,Value=Test`
 *
 * Most resources can have a maximum of 50 tags. Automations can have a maximum of 5
 * tags.
 *
 * We recommend that you devise a set of tag keys that meets your needs for each resource type.
 * Using a consistent set of tag keys makes it easier for you to manage your resources. You can
 * search and filter the resources based on the tags you add. Tags don't have any semantic meaning
 * to and are interpreted strictly as a string of characters.
 *
 * For more information about using tags with Amazon Elastic Compute Cloud (Amazon EC2) instances, see Tag your Amazon EC2
 * resources in the *Amazon EC2 User Guide*.
 */
export const addTagsToResource: (
  input: AddTagsToResourceRequest,
) => Effect.Effect<
  AddTagsToResourceResult,
  | InternalServerError
  | InvalidResourceId
  | InvalidResourceType
  | TooManyTagsError
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceRequest,
  output: AddTagsToResourceResult,
  errors: [
    InternalServerError,
    InvalidResourceId,
    InvalidResourceType,
    TooManyTagsError,
    TooManyUpdates,
  ],
}));
/**
 * Disassociates the specified Amazon Web Services Systems Manager document (SSM document) from the specified managed
 * node. If you created the association by using the `Targets` parameter, then you must
 * delete the association by using the association ID.
 *
 * When you disassociate a document from a managed node, it doesn't change the configuration of
 * the node. To change the configuration state of a managed node after you disassociate a document,
 * you must create a new document with the desired configuration and associate it with the
 * node.
 */
export const deleteAssociation: (
  input: DeleteAssociationRequest,
) => Effect.Effect<
  DeleteAssociationResult,
  | AssociationDoesNotExist
  | InternalServerError
  | InvalidDocument
  | InvalidInstanceId
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssociationRequest,
  output: DeleteAssociationResult,
  errors: [
    AssociationDoesNotExist,
    InternalServerError,
    InvalidDocument,
    InvalidInstanceId,
    TooManyUpdates,
  ],
}));
/**
 * `ServiceSetting` is an account-level setting for an Amazon Web Services service. This setting
 * defines how a user interacts with or uses a service or a feature of a service. For example, if an
 * Amazon Web Services service charges money to the account based on feature or service usage, then the Amazon Web Services
 * service team might create a default setting of "false". This means the user can't use this
 * feature unless they change the setting to "true" and intentionally opt in for a paid
 * feature.
 *
 * Services map a `SettingId` object to a setting value. Amazon Web Services services teams define
 * the default value for a `SettingId`. You can't create a new `SettingId`,
 * but you can overwrite the default value if you have the `ssm:UpdateServiceSetting`
 * permission for the setting. Use the GetServiceSetting API operation to view the
 * current value. Use the UpdateServiceSetting API operation to change the default
 * setting.
 *
 * Reset the service setting for the account to the default value as provisioned by the Amazon Web Services
 * service team.
 */
export const resetServiceSetting: (
  input: ResetServiceSettingRequest,
) => Effect.Effect<
  ResetServiceSettingResult,
  InternalServerError | ServiceSettingNotFound | TooManyUpdates | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetServiceSettingRequest,
  output: ResetServiceSettingResult,
  errors: [InternalServerError, ServiceSettingNotFound, TooManyUpdates],
}));
/**
 * Updates the status of the Amazon Web Services Systems Manager document (SSM document) associated with the specified
 * managed node.
 *
 * `UpdateAssociationStatus` is primarily used by the Amazon Web Services Systems Manager Agent (SSM Agent) to
 * report status updates about your associations and is only used for associations created with the
 * `InstanceId` legacy parameter.
 */
export const updateAssociationStatus: (
  input: UpdateAssociationStatusRequest,
) => Effect.Effect<
  UpdateAssociationStatusResult,
  | AssociationDoesNotExist
  | InternalServerError
  | InvalidDocument
  | InvalidInstanceId
  | StatusUnchanged
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssociationStatusRequest,
  output: UpdateAssociationStatusResult,
  errors: [
    AssociationDoesNotExist,
    InternalServerError,
    InvalidDocument,
    InvalidInstanceId,
    StatusUnchanged,
    TooManyUpdates,
  ],
}));
/**
 * Generates an activation code and activation ID you can use to register your on-premises
 * servers, edge devices, or virtual machine (VM) with Amazon Web Services Systems Manager. Registering these machines with
 * Systems Manager makes it possible to manage them using Systems Manager tools. You use the activation code and ID when
 * installing SSM Agent on machines in your hybrid environment. For more information about
 * requirements for managing on-premises machines using Systems Manager, see Using Amazon Web Services Systems Manager in
 * hybrid and multicloud environments in the *Amazon Web Services Systems Manager User Guide*.
 *
 * Amazon Elastic Compute Cloud (Amazon EC2) instances, edge devices, and on-premises servers and VMs that are
 * configured for Systems Manager are all called *managed nodes*.
 */
export const createActivation: (
  input: CreateActivationRequest,
) => Effect.Effect<
  CreateActivationResult,
  InternalServerError | InvalidParameters | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActivationRequest,
  output: CreateActivationResult,
  errors: [InternalServerError, InvalidParameters],
}));
/**
 * Creates a new maintenance window.
 *
 * The value you specify for `Duration` determines the specific end time for the
 * maintenance window based on the time it begins. No maintenance window tasks are permitted to
 * start after the resulting endtime minus the number of hours you specify for `Cutoff`.
 * For example, if the maintenance window starts at 3 PM, the duration is three hours, and the
 * value you specify for `Cutoff` is one hour, no maintenance window tasks can start
 * after 5 PM.
 */
export const createMaintenanceWindow: (
  input: CreateMaintenanceWindowRequest,
) => Effect.Effect<
  CreateMaintenanceWindowResult,
  | IdempotentParameterMismatch
  | InternalServerError
  | ResourceLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMaintenanceWindowRequest,
  output: CreateMaintenanceWindowResult,
  errors: [
    IdempotentParameterMismatch,
    InternalServerError,
    ResourceLimitExceededException,
  ],
}));
/**
 * Creates a patch baseline.
 *
 * For information about valid key-value pairs in `PatchFilters` for each supported
 * operating system type, see PatchFilter.
 */
export const createPatchBaseline: (
  input: CreatePatchBaselineRequest,
) => Effect.Effect<
  CreatePatchBaselineResult,
  | IdempotentParameterMismatch
  | InternalServerError
  | ResourceLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePatchBaselineRequest,
  output: CreatePatchBaselineResult,
  errors: [
    IdempotentParameterMismatch,
    InternalServerError,
    ResourceLimitExceededException,
  ],
}));
/**
 * Describes details about the activation, such as the date and time the activation was
 * created, its expiration date, the Identity and Access Management (IAM) role assigned to
 * the managed nodes in the activation, and the number of nodes registered by using this
 * activation.
 */
export const describeActivations: {
  (
    input: DescribeActivationsRequest,
  ): Effect.Effect<
    DescribeActivationsResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeActivationsRequest,
  ) => Stream.Stream<
    DescribeActivationsResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeActivationsRequest,
  ) => Stream.Stream<
    Activation,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeActivationsRequest,
  output: DescribeActivationsResult,
  errors: [InternalServerError, InvalidFilter, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ActivationList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Views all executions for a specific association ID.
 */
export const describeAssociationExecutions: {
  (
    input: DescribeAssociationExecutionsRequest,
  ): Effect.Effect<
    DescribeAssociationExecutionsResult,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAssociationExecutionsRequest,
  ) => Stream.Stream<
    DescribeAssociationExecutionsResult,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAssociationExecutionsRequest,
  ) => Stream.Stream<
    AssociationExecution,
    | AssociationDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAssociationExecutionsRequest,
  output: DescribeAssociationExecutionsResult,
  errors: [AssociationDoesNotExist, InternalServerError, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AssociationExecutions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Information about all active and terminated step executions in an Automation
 * workflow.
 */
export const describeAutomationStepExecutions: {
  (
    input: DescribeAutomationStepExecutionsRequest,
  ): Effect.Effect<
    DescribeAutomationStepExecutionsResult,
    | AutomationExecutionNotFoundException
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAutomationStepExecutionsRequest,
  ) => Stream.Stream<
    DescribeAutomationStepExecutionsResult,
    | AutomationExecutionNotFoundException
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAutomationStepExecutionsRequest,
  ) => Stream.Stream<
    StepExecution,
    | AutomationExecutionNotFoundException
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAutomationStepExecutionsRequest,
  output: DescribeAutomationStepExecutionsResult,
  errors: [
    AutomationExecutionNotFoundException,
    InternalServerError,
    InvalidFilterKey,
    InvalidFilterValue,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StepExecutions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes a specific delete inventory operation.
 */
export const describeInventoryDeletions: {
  (
    input: DescribeInventoryDeletionsRequest,
  ): Effect.Effect<
    DescribeInventoryDeletionsResult,
    | InternalServerError
    | InvalidDeletionIdException
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInventoryDeletionsRequest,
  ) => Stream.Stream<
    DescribeInventoryDeletionsResult,
    | InternalServerError
    | InvalidDeletionIdException
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInventoryDeletionsRequest,
  ) => Stream.Stream<
    InventoryDeletionStatusItem,
    | InternalServerError
    | InvalidDeletionIdException
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInventoryDeletionsRequest,
  output: DescribeInventoryDeletionsResult,
  errors: [InternalServerError, InvalidDeletionIdException, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InventoryDeletions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the executions of a maintenance window. This includes information about when the
 * maintenance window was scheduled to be active, and information about tasks registered and run
 * with the maintenance window.
 */
export const describeMaintenanceWindowExecutions: {
  (
    input: DescribeMaintenanceWindowExecutionsRequest,
  ): Effect.Effect<
    DescribeMaintenanceWindowExecutionsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMaintenanceWindowExecutionsRequest,
  ) => Stream.Stream<
    DescribeMaintenanceWindowExecutionsResult,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMaintenanceWindowExecutionsRequest,
  ) => Stream.Stream<
    MaintenanceWindowExecution,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMaintenanceWindowExecutionsRequest,
  output: DescribeMaintenanceWindowExecutionsResult,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WindowExecutions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Query a set of OpsItems. You must have permission in Identity and Access Management (IAM) to query a list of OpsItems. For more information, see Set up OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 *
 * Operations engineers and IT professionals use Amazon Web Services Systems Manager OpsCenter to view, investigate, and
 * remediate operational issues impacting the performance and health of their Amazon Web Services resources. For
 * more information, see Amazon Web Services Systems Manager OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const describeOpsItems: {
  (
    input: DescribeOpsItemsRequest,
  ): Effect.Effect<
    DescribeOpsItemsResponse,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOpsItemsRequest,
  ) => Stream.Stream<
    DescribeOpsItemsResponse,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOpsItemsRequest,
  ) => Stream.Stream<
    OpsItemSummary,
    InternalServerError | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOpsItemsRequest,
  output: DescribeOpsItemsResponse,
  errors: [InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OpsItemSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the parameters in your Amazon Web Services account or the parameters shared with you when you enable
 * the Shared option.
 *
 * Request results are returned on a best-effort basis. If you specify `MaxResults`
 * in the request, the response includes information up to the limit specified. The number of items
 * returned, however, can be between zero and the value of `MaxResults`. If the service
 * reaches an internal limit while processing the results, it stops the operation and returns the
 * matching values up to that point and a `NextToken`. You can specify the
 * `NextToken` in a subsequent call to get the next set of results.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 *
 * If you change the KMS key alias for the KMS key used to encrypt a parameter,
 * then you must also update the key alias the parameter uses to reference KMS. Otherwise,
 * `DescribeParameters` retrieves whatever the original key alias was
 * referencing.
 */
export const describeParameters: {
  (
    input: DescribeParametersRequest,
  ): Effect.Effect<
    DescribeParametersResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeParametersRequest,
  ) => Stream.Stream<
    DescribeParametersResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeParametersRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeParametersRequest,
  output: DescribeParametersResult,
  errors: [
    InternalServerError,
    InvalidFilterKey,
    InvalidFilterOption,
    InvalidFilterValue,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the contents of the specified Amazon Web Services Systems Manager document (SSM document).
 */
export const getDocument: (
  input: GetDocumentRequest,
) => Effect.Effect<
  GetDocumentResult,
  InternalServerError | InvalidDocument | InvalidDocumentVersion | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentRequest,
  output: GetDocumentResult,
  errors: [InternalServerError, InvalidDocument, InvalidDocumentVersion],
}));
/**
 * View operational metadata related to an application in Application Manager.
 */
export const getOpsMetadata: (
  input: GetOpsMetadataRequest,
) => Effect.Effect<
  GetOpsMetadataResult,
  | InternalServerError
  | OpsMetadataInvalidArgumentException
  | OpsMetadataNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpsMetadataRequest,
  output: GetOpsMetadataResult,
  errors: [
    InternalServerError,
    OpsMetadataInvalidArgumentException,
    OpsMetadataNotFoundException,
  ],
}));
/**
 * Retrieves the history of all changes to a parameter.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 *
 * If you change the KMS key alias for the KMS key used to encrypt a parameter,
 * then you must also update the key alias the parameter uses to reference KMS. Otherwise,
 * `GetParameterHistory` retrieves whatever the original key alias was
 * referencing.
 */
export const getParameterHistory: {
  (
    input: GetParameterHistoryRequest,
  ): Effect.Effect<
    GetParameterHistoryResult,
    | InternalServerError
    | InvalidKeyId
    | InvalidNextToken
    | ParameterNotFound
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetParameterHistoryRequest,
  ) => Stream.Stream<
    GetParameterHistoryResult,
    | InternalServerError
    | InvalidKeyId
    | InvalidNextToken
    | ParameterNotFound
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetParameterHistoryRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerError
    | InvalidKeyId
    | InvalidNextToken
    | ParameterNotFound
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetParameterHistoryRequest,
  output: GetParameterHistoryResult,
  errors: [
    InternalServerError,
    InvalidKeyId,
    InvalidNextToken,
    ParameterNotFound,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns all State Manager associations in the current Amazon Web Services account and Amazon Web Services Region. You
 * can limit the results to a specific State Manager association document or managed node by
 * specifying a filter. State Manager is a tool in Amazon Web Services Systems Manager.
 */
export const listAssociations: {
  (
    input: ListAssociationsRequest,
  ): Effect.Effect<
    ListAssociationsResult,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociationsRequest,
  ) => Stream.Stream<
    ListAssociationsResult,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociationsRequest,
  ) => Stream.Stream<
    Association,
    InternalServerError | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociationsRequest,
  output: ListAssociationsResult,
  errors: [InternalServerError, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Associations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * For a specified resource ID, this API operation returns a list of compliance statuses for
 * different resource types. Currently, you can only specify one resource ID per call. List results
 * depend on the criteria specified in the filter.
 */
export const listComplianceItems: {
  (
    input: ListComplianceItemsRequest,
  ): Effect.Effect<
    ListComplianceItemsResult,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | InvalidResourceId
    | InvalidResourceType
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListComplianceItemsRequest,
  ) => Stream.Stream<
    ListComplianceItemsResult,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | InvalidResourceId
    | InvalidResourceType
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListComplianceItemsRequest,
  ) => Stream.Stream<
    ComplianceItem,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | InvalidResourceId
    | InvalidResourceType
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComplianceItemsRequest,
  output: ListComplianceItemsResult,
  errors: [
    InternalServerError,
    InvalidFilter,
    InvalidNextToken,
    InvalidResourceId,
    InvalidResourceType,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ComplianceItems",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Amazon Web Services Systems Manager Change Manager will no longer be open to new
 * customers starting November 7, 2025. If you would like to use Change Manager, sign up prior to that date. Existing customers can
 * continue to use the service as normal. For more information, see
 * Amazon Web Services Systems Manager Change Manager availability change.
 *
 * Information about approval reviews for a version of a change template in Change Manager.
 */
export const listDocumentMetadataHistory: (
  input: ListDocumentMetadataHistoryRequest,
) => Effect.Effect<
  ListDocumentMetadataHistoryResponse,
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentVersion
  | InvalidNextToken
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDocumentMetadataHistoryRequest,
  output: ListDocumentMetadataHistoryResponse,
  errors: [
    InternalServerError,
    InvalidDocument,
    InvalidDocumentVersion,
    InvalidNextToken,
  ],
}));
/**
 * Returns all Systems Manager (SSM) documents in the current Amazon Web Services account and Amazon Web Services Region. You can
 * limit the results of this request by using a filter.
 */
export const listDocuments: {
  (
    input: ListDocumentsRequest,
  ): Effect.Effect<
    ListDocumentsResult,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListDocumentsRequest,
  ) => Stream.Stream<
    ListDocumentsResult,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListDocumentsRequest,
  ) => Stream.Stream<
    DocumentIdentifier,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDocumentsRequest,
  output: ListDocumentsResult,
  errors: [InternalServerError, InvalidFilterKey, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DocumentIdentifiers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A list of inventory items returned by the request.
 */
export const listInventoryEntries: (
  input: ListInventoryEntriesRequest,
) => Effect.Effect<
  ListInventoryEntriesResult,
  | InternalServerError
  | InvalidFilter
  | InvalidInstanceId
  | InvalidNextToken
  | InvalidTypeNameException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInventoryEntriesRequest,
  output: ListInventoryEntriesResult,
  errors: [
    InternalServerError,
    InvalidFilter,
    InvalidInstanceId,
    InvalidNextToken,
    InvalidTypeNameException,
  ],
}));
/**
 * Lists all related-item resources associated with a Systems Manager OpsCenter OpsItem. OpsCenter is a
 * tool in Amazon Web Services Systems Manager.
 */
export const listOpsItemRelatedItems: {
  (
    input: ListOpsItemRelatedItemsRequest,
  ): Effect.Effect<
    ListOpsItemRelatedItemsResponse,
    InternalServerError | OpsItemInvalidParameterException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpsItemRelatedItemsRequest,
  ) => Stream.Stream<
    ListOpsItemRelatedItemsResponse,
    InternalServerError | OpsItemInvalidParameterException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListOpsItemRelatedItemsRequest,
  ) => Stream.Stream<
    OpsItemRelatedItemSummary,
    InternalServerError | OpsItemInvalidParameterException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpsItemRelatedItemsRequest,
  output: ListOpsItemRelatedItemsResponse,
  errors: [InternalServerError, OpsItemInvalidParameterException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Amazon Web Services Systems Manager calls this API operation when displaying all Application Manager OpsMetadata objects or
 * blobs.
 */
export const listOpsMetadata: {
  (
    input: ListOpsMetadataRequest,
  ): Effect.Effect<
    ListOpsMetadataResult,
    InternalServerError | OpsMetadataInvalidArgumentException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpsMetadataRequest,
  ) => Stream.Stream<
    ListOpsMetadataResult,
    InternalServerError | OpsMetadataInvalidArgumentException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListOpsMetadataRequest,
  ) => Stream.Stream<
    OpsMetadata,
    InternalServerError | OpsMetadataInvalidArgumentException | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpsMetadataRequest,
  output: ListOpsMetadataResult,
  errors: [InternalServerError, OpsMetadataInvalidArgumentException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OpsMetadataList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists your resource data sync configurations. Includes information about the last time a
 * sync attempted to start, the last sync status, and the last time a sync successfully
 * completed.
 *
 * The number of sync configurations might be too large to return using a single call to
 * `ListResourceDataSync`. You can limit the number of sync configurations returned by
 * using the `MaxResults` parameter. To determine whether there are more sync
 * configurations to list, check the value of `NextToken` in the output. If there are
 * more sync configurations to list, you can request them by specifying the `NextToken`
 * returned in the call to the parameter of a subsequent call.
 */
export const listResourceDataSync: {
  (
    input: ListResourceDataSyncRequest,
  ): Effect.Effect<
    ListResourceDataSyncResult,
    | InternalServerError
    | InvalidNextToken
    | ResourceDataSyncInvalidConfigurationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceDataSyncRequest,
  ) => Stream.Stream<
    ListResourceDataSyncResult,
    | InternalServerError
    | InvalidNextToken
    | ResourceDataSyncInvalidConfigurationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceDataSyncRequest,
  ) => Stream.Stream<
    ResourceDataSyncItem,
    | InternalServerError
    | InvalidNextToken
    | ResourceDataSyncInvalidConfigurationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceDataSyncRequest,
  output: ListResourceDataSyncResult,
  errors: [
    InternalServerError,
    InvalidNextToken,
    ResourceDataSyncInvalidConfigurationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceDataSyncItems",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Shares a Amazon Web Services Systems Manager document (SSM document)publicly or privately. If you share a document
 * privately, you must specify the Amazon Web Services user IDs for those people who can use the document. If
 * you share a document publicly, you must specify *All* as the account
 * ID.
 */
export const modifyDocumentPermission: (
  input: ModifyDocumentPermissionRequest,
) => Effect.Effect<
  ModifyDocumentPermissionResponse,
  | DocumentLimitExceeded
  | DocumentPermissionLimit
  | InternalServerError
  | InvalidDocument
  | InvalidPermissionType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDocumentPermissionRequest,
  output: ModifyDocumentPermissionResponse,
  errors: [
    DocumentLimitExceeded,
    DocumentPermissionLimit,
    InternalServerError,
    InvalidDocument,
    InvalidPermissionType,
  ],
}));
/**
 * Initiates a connection to a target (for example, a managed node) for a Session Manager session.
 * Returns a URL and token that can be used to open a WebSocket connection for sending input and
 * receiving outputs.
 *
 * Amazon Web Services CLI usage: `start-session` is an interactive command that requires the Session Manager
 * plugin to be installed on the client machine making the call. For information, see Install
 * the Session Manager plugin for the Amazon Web Services CLI in the *Amazon Web Services Systems Manager User Guide*.
 *
 * Amazon Web Services Tools for PowerShell usage: Start-SSMSession isn't currently supported by Amazon Web Services Tools
 * for PowerShell on Windows local machines.
 */
export const startSession: (
  input: StartSessionRequest,
) => Effect.Effect<
  StartSessionResponse,
  InternalServerError | InvalidDocument | TargetNotConnected | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSessionRequest,
  output: StartSessionResponse,
  errors: [InternalServerError, InvalidDocument, TargetNotConnected],
}));
/**
 * Set the default version of a document.
 *
 * If you change a document version for a State Manager association, Systems Manager immediately runs
 * the association unless you previously specifed the `apply-only-at-cron-interval`
 * parameter.
 */
export const updateDocumentDefaultVersion: (
  input: UpdateDocumentDefaultVersionRequest,
) => Effect.Effect<
  UpdateDocumentDefaultVersionResult,
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentSchemaVersion
  | InvalidDocumentVersion
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentDefaultVersionRequest,
  output: UpdateDocumentDefaultVersionResult,
  errors: [
    InternalServerError,
    InvalidDocument,
    InvalidDocumentSchemaVersion,
    InvalidDocumentVersion,
  ],
}));
/**
 * Deletes an activation. You aren't required to delete an activation. If you delete an
 * activation, you can no longer use it to register additional managed nodes. Deleting an activation
 * doesn't de-register managed nodes. You must manually de-register managed nodes.
 */
export const deleteActivation: (
  input: DeleteActivationRequest,
) => Effect.Effect<
  DeleteActivationResult,
  | InternalServerError
  | InvalidActivation
  | InvalidActivationId
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActivationRequest,
  output: DeleteActivationResult,
  errors: [
    InternalServerError,
    InvalidActivation,
    InvalidActivationId,
    TooManyUpdates,
  ],
}));
/**
 * Deletes a resource data sync configuration. After the configuration is deleted, changes to
 * data on managed nodes are no longer synced to or from the target. Deleting a sync configuration
 * doesn't delete data.
 */
export const deleteResourceDataSync: (
  input: DeleteResourceDataSyncRequest,
) => Effect.Effect<
  DeleteResourceDataSyncResult,
  | InternalServerError
  | ResourceDataSyncInvalidConfigurationException
  | ResourceDataSyncNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceDataSyncRequest,
  output: DeleteResourceDataSyncResult,
  errors: [
    InternalServerError,
    ResourceDataSyncInvalidConfigurationException,
    ResourceDataSyncNotFoundException,
  ],
}));
/**
 * Removes a target from a maintenance window.
 */
export const deregisterTargetFromMaintenanceWindow: (
  input: DeregisterTargetFromMaintenanceWindowRequest,
) => Effect.Effect<
  DeregisterTargetFromMaintenanceWindowResult,
  | DoesNotExistException
  | InternalServerError
  | TargetInUseException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTargetFromMaintenanceWindowRequest,
  output: DeregisterTargetFromMaintenanceWindowResult,
  errors: [DoesNotExistException, InternalServerError, TargetInUseException],
}));
/**
 * Registers a patch baseline for a patch group.
 */
export const registerPatchBaselineForPatchGroup: (
  input: RegisterPatchBaselineForPatchGroupRequest,
) => Effect.Effect<
  RegisterPatchBaselineForPatchGroupResult,
  | AlreadyExistsException
  | DoesNotExistException
  | InternalServerError
  | InvalidResourceId
  | ResourceLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterPatchBaselineForPatchGroupRequest,
  output: RegisterPatchBaselineForPatchGroupResult,
  errors: [
    AlreadyExistsException,
    DoesNotExistException,
    InternalServerError,
    InvalidResourceId,
    ResourceLimitExceededException,
  ],
}));
/**
 * Registers a target with a maintenance window.
 */
export const registerTargetWithMaintenanceWindow: (
  input: RegisterTargetWithMaintenanceWindowRequest,
) => Effect.Effect<
  RegisterTargetWithMaintenanceWindowResult,
  | DoesNotExistException
  | IdempotentParameterMismatch
  | InternalServerError
  | ResourceLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTargetWithMaintenanceWindowRequest,
  output: RegisterTargetWithMaintenanceWindowResult,
  errors: [
    DoesNotExistException,
    IdempotentParameterMismatch,
    InternalServerError,
    ResourceLimitExceededException,
  ],
}));
/**
 * Retrieve information about one or more parameters under a specified level in a hierarchy.
 *
 * Request results are returned on a best-effort basis. If you specify `MaxResults`
 * in the request, the response includes information up to the limit specified. The number of items
 * returned, however, can be between zero and the value of `MaxResults`. If the service
 * reaches an internal limit while processing the results, it stops the operation and returns the
 * matching values up to that point and a `NextToken`. You can specify the
 * `NextToken` in a subsequent call to get the next set of results.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 */
export const getParametersByPath: {
  (
    input: GetParametersByPathRequest,
  ): Effect.Effect<
    GetParametersByPathResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidKeyId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetParametersByPathRequest,
  ) => Stream.Stream<
    GetParametersByPathResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidKeyId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetParametersByPathRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterOption
    | InvalidFilterValue
    | InvalidKeyId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetParametersByPathRequest,
  output: GetParametersByPathResult,
  errors: [
    InternalServerError,
    InvalidFilterKey,
    InvalidFilterOption,
    InvalidFilterValue,
    InvalidKeyId,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides details about all active and terminated Automation executions.
 */
export const describeAutomationExecutions: {
  (
    input: DescribeAutomationExecutionsRequest,
  ): Effect.Effect<
    DescribeAutomationExecutionsResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAutomationExecutionsRequest,
  ) => Stream.Stream<
    DescribeAutomationExecutionsResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAutomationExecutionsRequest,
  ) => Stream.Stream<
    AutomationExecutionMetadata,
    | InternalServerError
    | InvalidFilterKey
    | InvalidFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAutomationExecutionsRequest,
  output: DescribeAutomationExecutionsResult,
  errors: [
    InternalServerError,
    InvalidFilterKey,
    InvalidFilterValue,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AutomationExecutionMetadataList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Amazon Web Services Systems Manager Change Manager will no longer be open to new
 * customers starting November 7, 2025. If you would like to use Change Manager, sign up prior to that date. Existing customers can
 * continue to use the service as normal. For more information, see
 * Amazon Web Services Systems Manager Change Manager availability change.
 *
 * Updates information related to approval reviews for a specific version of a change template
 * in Change Manager.
 */
export const updateDocumentMetadata: (
  input: UpdateDocumentMetadataRequest,
) => Effect.Effect<
  UpdateDocumentMetadataResponse,
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentOperation
  | InvalidDocumentVersion
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentMetadataRequest,
  output: UpdateDocumentMetadataResponse,
  errors: [
    InternalServerError,
    InvalidDocument,
    InvalidDocumentOperation,
    InvalidDocumentVersion,
    TooManyUpdates,
  ],
}));
/**
 * Deletes the Amazon Web Services Systems Manager document (SSM document) and all managed node associations to the
 * document.
 *
 * Before you delete the document, we recommend that you use DeleteAssociation to disassociate all managed nodes that are associated with the document.
 */
export const deleteDocument: (
  input: DeleteDocumentRequest,
) => Effect.Effect<
  DeleteDocumentResult,
  | AssociatedInstances
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentOperation
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDocumentRequest,
  output: DeleteDocumentResult,
  errors: [
    AssociatedInstances,
    InternalServerError,
    InvalidDocument,
    InvalidDocumentOperation,
    TooManyUpdates,
  ],
}));
/**
 * Describes the specified Amazon Web Services Systems Manager document (SSM document).
 */
export const describeDocument: (
  input: DescribeDocumentRequest,
) => Effect.Effect<
  DescribeDocumentResult,
  InternalServerError | InvalidDocument | InvalidDocumentVersion | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDocumentRequest,
  output: DescribeDocumentResult,
  errors: [InternalServerError, InvalidDocument, InvalidDocumentVersion],
}));
/**
 * Delete OpsMetadata related to an application.
 */
export const deleteOpsMetadata: (
  input: DeleteOpsMetadataRequest,
) => Effect.Effect<
  DeleteOpsMetadataResult,
  | InternalServerError
  | OpsMetadataInvalidArgumentException
  | OpsMetadataNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOpsMetadataRequest,
  output: DeleteOpsMetadataResult,
  errors: [
    InternalServerError,
    OpsMetadataInvalidArgumentException,
    OpsMetadataNotFoundException,
  ],
}));
/**
 * Get information about a single parameter by specifying the parameter name.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 *
 * To get information about more than one parameter at a time, use the GetParameters operation.
 */
export const getParameter: (
  input: GetParameterRequest,
) => Effect.Effect<
  GetParameterResult,
  | InternalServerError
  | InvalidKeyId
  | ParameterNotFound
  | ParameterVersionNotFound
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetParameterRequest,
  output: GetParameterResult,
  errors: [
    InternalServerError,
    InvalidKeyId,
    ParameterNotFound,
    ParameterVersionNotFound,
  ],
}));
/**
 * Return a list of inventory type names for the account, or return a list of attribute names
 * for a specific Inventory item type.
 */
export const getInventorySchema: {
  (
    input: GetInventorySchemaRequest,
  ): Effect.Effect<
    GetInventorySchemaResult,
    | InternalServerError
    | InvalidNextToken
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetInventorySchemaRequest,
  ) => Stream.Stream<
    GetInventorySchemaResult,
    | InternalServerError
    | InvalidNextToken
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetInventorySchemaRequest,
  ) => Stream.Stream<
    InventoryItemSchema,
    | InternalServerError
    | InvalidNextToken
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInventorySchemaRequest,
  output: GetInventorySchemaResult,
  errors: [InternalServerError, InvalidNextToken, InvalidTypeNameException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the permissions for a Amazon Web Services Systems Manager document (SSM document). If you created the
 * document, you are the owner. If a document is shared, it can either be shared privately (by
 * specifying a user's Amazon Web Services account ID) or publicly (*All*).
 */
export const describeDocumentPermission: (
  input: DescribeDocumentPermissionRequest,
) => Effect.Effect<
  DescribeDocumentPermissionResponse,
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentOperation
  | InvalidNextToken
  | InvalidPermissionType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDocumentPermissionRequest,
  output: DescribeDocumentPermissionResponse,
  errors: [
    InternalServerError,
    InvalidDocument,
    InvalidDocumentOperation,
    InvalidNextToken,
    InvalidPermissionType,
  ],
}));
/**
 * Sends a signal to an Automation execution to change the current behavior or status of the
 * execution.
 */
export const sendAutomationSignal: (
  input: SendAutomationSignalRequest,
) => Effect.Effect<
  SendAutomationSignalResult,
  | AutomationExecutionNotFoundException
  | AutomationStepNotFoundException
  | InternalServerError
  | InvalidAutomationSignalException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendAutomationSignalRequest,
  output: SendAutomationSignalResult,
  errors: [
    AutomationExecutionNotFoundException,
    AutomationStepNotFoundException,
    InternalServerError,
    InvalidAutomationSignalException,
  ],
}));
/**
 * Update a resource data sync. After you create a resource data sync for a Region, you can't
 * change the account options for that sync. For example, if you create a sync in the us-east-2
 * (Ohio) Region and you choose the `Include only the current account` option, you can't
 * edit that sync later and choose the Include all accounts from my Organizations
 * configuration option. Instead, you must delete the first resource data sync, and create a
 * new one.
 *
 * This API operation only supports a resource data sync that was created with a
 * SyncFromSource `SyncType`.
 */
export const updateResourceDataSync: (
  input: UpdateResourceDataSyncRequest,
) => Effect.Effect<
  UpdateResourceDataSyncResult,
  | InternalServerError
  | ResourceDataSyncConflictException
  | ResourceDataSyncInvalidConfigurationException
  | ResourceDataSyncNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceDataSyncRequest,
  output: UpdateResourceDataSyncResult,
  errors: [
    InternalServerError,
    ResourceDataSyncConflictException,
    ResourceDataSyncInvalidConfigurationException,
    ResourceDataSyncNotFoundException,
  ],
}));
/**
 * Get information about an OpsItem by using the ID. You must have permission in Identity and Access Management (IAM) to view information about an OpsItem. For more information,
 * see Set
 * up OpsCenter in the *Amazon Web Services Systems Manager User Guide*.
 *
 * Operations engineers and IT professionals use Amazon Web Services Systems Manager OpsCenter to view, investigate, and
 * remediate operational issues impacting the performance and health of their Amazon Web Services resources. For
 * more information, see Amazon Web Services Systems Manager OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const getOpsItem: (
  input: GetOpsItemRequest,
) => Effect.Effect<
  GetOpsItemResponse,
  | InternalServerError
  | OpsItemAccessDeniedException
  | OpsItemNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpsItemRequest,
  output: GetOpsItemResponse,
  errors: [
    InternalServerError,
    OpsItemAccessDeniedException,
    OpsItemNotFoundException,
  ],
}));
/**
 * Creates a new OpsItem. You must have permission in Identity and Access Management (IAM) to create a new OpsItem. For more information, see Set up OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 *
 * Operations engineers and IT professionals use Amazon Web Services Systems Manager OpsCenter to view, investigate, and
 * remediate operational issues impacting the performance and health of their Amazon Web Services resources. For
 * more information, see Amazon Web Services Systems Manager OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const createOpsItem: (
  input: CreateOpsItemRequest,
) => Effect.Effect<
  CreateOpsItemResponse,
  | InternalServerError
  | OpsItemAccessDeniedException
  | OpsItemAlreadyExistsException
  | OpsItemInvalidParameterException
  | OpsItemLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOpsItemRequest,
  output: CreateOpsItemResponse,
  errors: [
    InternalServerError,
    OpsItemAccessDeniedException,
    OpsItemAlreadyExistsException,
    OpsItemInvalidParameterException,
    OpsItemLimitExceededException,
  ],
}));
/**
 * Remove a label or labels from a parameter.
 *
 * Parameter names can't contain spaces. The service removes any spaces specified for the
 * beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 */
export const unlabelParameterVersion: (
  input: UnlabelParameterVersionRequest,
) => Effect.Effect<
  UnlabelParameterVersionResult,
  | InternalServerError
  | ParameterNotFound
  | ParameterVersionNotFound
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnlabelParameterVersionRequest,
  output: UnlabelParameterVersionResult,
  errors: [
    InternalServerError,
    ParameterNotFound,
    ParameterVersionNotFound,
    TooManyUpdates,
  ],
}));
/**
 * A parameter label is a user-defined alias to help you manage different versions of a
 * parameter. When you modify a parameter, Amazon Web Services Systems Manager automatically saves a new version and
 * increments the version number by one. A label can help you remember the purpose of a parameter
 * when there are multiple versions.
 *
 * Parameter labels have the following requirements and restrictions.
 *
 * - A version of a parameter can have a maximum of 10 labels.
 *
 * - You can't attach the same label to different versions of the same parameter. For example,
 * if version 1 has the label Production, then you can't attach Production to version 2.
 *
 * - You can move a label from one version of a parameter to another.
 *
 * - You can't create a label when you create a new parameter. You must attach a label to a
 * specific version of a parameter.
 *
 * - If you no longer want to use a parameter label, then you can either delete it or move it
 * to a different version of a parameter.
 *
 * - A label can have a maximum of 100 characters.
 *
 * - Labels can contain letters (case sensitive), numbers, periods (.), hyphens (-), or
 * underscores (_).
 *
 * - Labels can't begin with a number, "`aws`" or "`ssm`" (not case
 * sensitive). If a label fails to meet these requirements, then the label isn't associated with a
 * parameter and the system displays it in the list of InvalidLabels.
 *
 * - Parameter names can't contain spaces. The service removes any spaces specified for
 * the beginning or end of a parameter name. If the specified name for a parameter contains spaces
 * between characters, the request fails with a `ValidationException` error.
 */
export const labelParameterVersion: (
  input: LabelParameterVersionRequest,
) => Effect.Effect<
  LabelParameterVersionResult,
  | InternalServerError
  | ParameterNotFound
  | ParameterVersionLabelLimitExceeded
  | ParameterVersionNotFound
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LabelParameterVersionRequest,
  output: LabelParameterVersionResult,
  errors: [
    InternalServerError,
    ParameterNotFound,
    ParameterVersionLabelLimitExceeded,
    ParameterVersionNotFound,
    TooManyUpdates,
  ],
}));
/**
 * Edit or change an OpsItem. You must have permission in Identity and Access Management (IAM) to update an OpsItem. For more information, see Set up OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 *
 * Operations engineers and IT professionals use Amazon Web Services Systems Manager OpsCenter to view, investigate, and
 * remediate operational issues impacting the performance and health of their Amazon Web Services resources. For
 * more information, see Amazon Web Services Systems Manager OpsCenter in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const updateOpsItem: (
  input: UpdateOpsItemRequest,
) => Effect.Effect<
  UpdateOpsItemResponse,
  | InternalServerError
  | OpsItemAccessDeniedException
  | OpsItemAlreadyExistsException
  | OpsItemConflictException
  | OpsItemInvalidParameterException
  | OpsItemLimitExceededException
  | OpsItemNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOpsItemRequest,
  output: UpdateOpsItemResponse,
  errors: [
    InternalServerError,
    OpsItemAccessDeniedException,
    OpsItemAlreadyExistsException,
    OpsItemConflictException,
    OpsItemInvalidParameterException,
    OpsItemLimitExceededException,
    OpsItemNotFoundException,
  ],
}));
/**
 * Describes the association for the specified target or managed node. If you created the
 * association by using the `Targets` parameter, then you must retrieve the association
 * by using the association ID.
 */
export const describeAssociation: (
  input: DescribeAssociationRequest,
) => Effect.Effect<
  DescribeAssociationResult,
  | AssociationDoesNotExist
  | InternalServerError
  | InvalidAssociationVersion
  | InvalidDocument
  | InvalidInstanceId
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAssociationRequest,
  output: DescribeAssociationResult,
  errors: [
    AssociationDoesNotExist,
    InternalServerError,
    InvalidAssociationVersion,
    InvalidDocument,
    InvalidInstanceId,
  ],
}));
/**
 * Retrieves the current effective patches (the patch and the approval state) for the specified
 * patch baseline. Applies to patch baselines for Windows only.
 */
export const describeEffectivePatchesForPatchBaseline: {
  (
    input: DescribeEffectivePatchesForPatchBaselineRequest,
  ): Effect.Effect<
    DescribeEffectivePatchesForPatchBaselineResult,
    | DoesNotExistException
    | InternalServerError
    | InvalidResourceId
    | UnsupportedOperatingSystem
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEffectivePatchesForPatchBaselineRequest,
  ) => Stream.Stream<
    DescribeEffectivePatchesForPatchBaselineResult,
    | DoesNotExistException
    | InternalServerError
    | InvalidResourceId
    | UnsupportedOperatingSystem
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEffectivePatchesForPatchBaselineRequest,
  ) => Stream.Stream<
    EffectivePatch,
    | DoesNotExistException
    | InternalServerError
    | InvalidResourceId
    | UnsupportedOperatingSystem
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEffectivePatchesForPatchBaselineRequest,
  output: DescribeEffectivePatchesForPatchBaselineResult,
  errors: [
    DoesNotExistException,
    InternalServerError,
    InvalidResourceId,
    UnsupportedOperatingSystem,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EffectivePatches",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The status of the associations for the managed nodes.
 */
export const describeInstanceAssociationsStatus: {
  (
    input: DescribeInstanceAssociationsStatusRequest,
  ): Effect.Effect<
    DescribeInstanceAssociationsStatusResult,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstanceAssociationsStatusRequest,
  ) => Stream.Stream<
    DescribeInstanceAssociationsStatusResult,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstanceAssociationsStatusRequest,
  ) => Stream.Stream<
    InstanceAssociationStatusInfo,
    InternalServerError | InvalidInstanceId | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstanceAssociationsStatusRequest,
  output: DescribeInstanceAssociationsStatusResult,
  errors: [InternalServerError, InvalidInstanceId, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InstanceAssociationStatusInfos",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of all active sessions (both connected and disconnected) or terminated
 * sessions from the past 30 days.
 */
export const describeSessions: {
  (
    input: DescribeSessionsRequest,
  ): Effect.Effect<
    DescribeSessionsResponse,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSessionsRequest,
  ) => Stream.Stream<
    DescribeSessionsResponse,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSessionsRequest,
  ) => Stream.Stream<
    Session,
    InternalServerError | InvalidFilterKey | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSessionsRequest,
  output: DescribeSessionsResponse,
  errors: [InternalServerError, InvalidFilterKey, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Sessions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Get detailed information about a particular Automation execution.
 */
export const getAutomationExecution: (
  input: GetAutomationExecutionRequest,
) => Effect.Effect<
  GetAutomationExecutionResult,
  AutomationExecutionNotFoundException | InternalServerError | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomationExecutionRequest,
  output: GetAutomationExecutionResult,
  errors: [AutomationExecutionNotFoundException, InternalServerError],
}));
/**
 * Initiates the process of retrieving an existing preview that shows the effects that running
 * a specified Automation runbook would have on the targeted resources.
 */
export const getExecutionPreview: (
  input: GetExecutionPreviewRequest,
) => Effect.Effect<
  GetExecutionPreviewResponse,
  InternalServerError | ResourceNotFoundException | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExecutionPreviewRequest,
  output: GetExecutionPreviewResponse,
  errors: [InternalServerError, ResourceNotFoundException],
}));
/**
 * Returns an array of the `Policy` object.
 */
export const getResourcePolicies: {
  (
    input: GetResourcePoliciesRequest,
  ): Effect.Effect<
    GetResourcePoliciesResponse,
    | InternalServerError
    | ResourceNotFoundException
    | ResourcePolicyInvalidParameterException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcePoliciesRequest,
  ) => Stream.Stream<
    GetResourcePoliciesResponse,
    | InternalServerError
    | ResourceNotFoundException
    | ResourcePolicyInvalidParameterException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcePoliciesRequest,
  ) => Stream.Stream<
    GetResourcePoliciesResponseEntry,
    | InternalServerError
    | ResourceNotFoundException
    | ResourcePolicyInvalidParameterException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcePoliciesRequest,
  output: GetResourcePoliciesResponse,
  errors: [
    InternalServerError,
    ResourceNotFoundException,
    ResourcePolicyInvalidParameterException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Policies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * An invocation is copy of a command sent to a specific managed node. A command can apply to
 * one or more managed nodes. A command invocation applies to one managed node. For example, if a
 * user runs `SendCommand` against three managed nodes, then a command invocation is
 * created for each requested managed node ID. `ListCommandInvocations` provide status
 * about command execution.
 */
export const listCommandInvocations: {
  (
    input: ListCommandInvocationsRequest,
  ): Effect.Effect<
    ListCommandInvocationsResult,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommandInvocationsRequest,
  ) => Stream.Stream<
    ListCommandInvocationsResult,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListCommandInvocationsRequest,
  ) => Stream.Stream<
    CommandInvocation,
    | InternalServerError
    | InvalidCommandId
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommandInvocationsRequest,
  output: ListCommandInvocationsResult,
  errors: [
    InternalServerError,
    InvalidCommandId,
    InvalidFilterKey,
    InvalidInstanceId,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CommandInvocations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a summary count of compliant and non-compliant resources for a compliance type. For
 * example, this call can return State Manager associations, patches, or custom compliance types
 * according to the filter criteria that you specify.
 */
export const listComplianceSummaries: {
  (
    input: ListComplianceSummariesRequest,
  ): Effect.Effect<
    ListComplianceSummariesResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListComplianceSummariesRequest,
  ) => Stream.Stream<
    ListComplianceSummariesResult,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListComplianceSummariesRequest,
  ) => Stream.Stream<
    ComplianceSummaryItem,
    InternalServerError | InvalidFilter | InvalidNextToken | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComplianceSummariesRequest,
  output: ListComplianceSummariesResult,
  errors: [InternalServerError, InvalidFilter, InvalidNextToken],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ComplianceSummaryItems",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of all OpsItem events in the current Amazon Web Services Region and Amazon Web Services account. You can
 * limit the results to events associated with specific OpsItems by specifying a filter.
 */
export const listOpsItemEvents: {
  (
    input: ListOpsItemEventsRequest,
  ): Effect.Effect<
    ListOpsItemEventsResponse,
    | InternalServerError
    | OpsItemInvalidParameterException
    | OpsItemLimitExceededException
    | OpsItemNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpsItemEventsRequest,
  ) => Stream.Stream<
    ListOpsItemEventsResponse,
    | InternalServerError
    | OpsItemInvalidParameterException
    | OpsItemLimitExceededException
    | OpsItemNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListOpsItemEventsRequest,
  ) => Stream.Stream<
    OpsItemEventSummary,
    | InternalServerError
    | OpsItemInvalidParameterException
    | OpsItemLimitExceededException
    | OpsItemNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpsItemEventsRequest,
  output: ListOpsItemEventsResponse,
  errors: [
    InternalServerError,
    OpsItemInvalidParameterException,
    OpsItemLimitExceededException,
    OpsItemNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds a new task to a maintenance window.
 */
export const registerTaskWithMaintenanceWindow: (
  input: RegisterTaskWithMaintenanceWindowRequest,
) => Effect.Effect<
  RegisterTaskWithMaintenanceWindowResult,
  | DoesNotExistException
  | FeatureNotAvailableException
  | IdempotentParameterMismatch
  | InternalServerError
  | ResourceLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTaskWithMaintenanceWindowRequest,
  output: RegisterTaskWithMaintenanceWindowResult,
  errors: [
    DoesNotExistException,
    FeatureNotAvailableException,
    IdempotentParameterMismatch,
    InternalServerError,
    ResourceLimitExceededException,
  ],
}));
/**
 * Initiates the process of creating a preview showing the effects that running a specified
 * Automation runbook would have on the targeted resources.
 */
export const startExecutionPreview: (
  input: StartExecutionPreviewRequest,
) => Effect.Effect<
  StartExecutionPreviewResponse,
  InternalServerError | ValidationException | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExecutionPreviewRequest,
  output: StartExecutionPreviewResponse,
  errors: [InternalServerError, ValidationException],
}));
/**
 * Deletes the association between an OpsItem and a related item. For example, this API
 * operation can delete an Incident Manager incident from an OpsItem. Incident Manager is a tool in
 * Amazon Web Services Systems Manager.
 */
export const disassociateOpsItemRelatedItem: (
  input: DisassociateOpsItemRelatedItemRequest,
) => Effect.Effect<
  DisassociateOpsItemRelatedItemResponse,
  | InternalServerError
  | OpsItemConflictException
  | OpsItemInvalidParameterException
  | OpsItemNotFoundException
  | OpsItemRelatedItemAssociationNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateOpsItemRelatedItemRequest,
  output: DisassociateOpsItemRelatedItemResponse,
  errors: [
    InternalServerError,
    OpsItemConflictException,
    OpsItemInvalidParameterException,
    OpsItemNotFoundException,
    OpsItemRelatedItemAssociationNotFoundException,
  ],
}));
/**
 * Gets the state of a Amazon Web Services Systems Manager change calendar at the current time or a specified time. If
 * you specify a time, `GetCalendarState` returns the state of the calendar at that
 * specific time, and returns the next time that the change calendar state will transition. If you
 * don't specify a time, `GetCalendarState` uses the current time. Change Calendar
 * entries have two possible states: `OPEN` or `CLOSED`.
 *
 * If you specify more than one calendar in a request, the command returns the status of
 * `OPEN` only if all calendars in the request are open. If one or more calendars in the
 * request are closed, the status returned is `CLOSED`.
 *
 * For more information about Change Calendar, a tool in Amazon Web Services Systems Manager, see Amazon Web Services Systems Manager Change Calendar in the *Amazon Web Services Systems Manager User Guide*.
 */
export const getCalendarState: (
  input: GetCalendarStateRequest,
) => Effect.Effect<
  GetCalendarStateResponse,
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentType
  | UnsupportedCalendarException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalendarStateRequest,
  output: GetCalendarStateResponse,
  errors: [
    InternalServerError,
    InvalidDocument,
    InvalidDocumentType,
    UnsupportedCalendarException,
  ],
}));
/**
 * Retrieves the current snapshot for the patch baseline the managed node uses. This API is
 * primarily used by the `AWS-RunPatchBaseline` Systems Manager document (SSM document).
 *
 * If you run the command locally, such as with the Command Line Interface (CLI), the system attempts to use your local Amazon Web Services credentials and the operation fails. To avoid
 * this, you can run the command in the Amazon Web Services Systems Manager console. Use Run Command, a tool in Amazon Web Services Systems Manager,
 * with an SSM document that enables you to target a managed node with a script or command. For
 * example, run the command using the `AWS-RunShellScript` document or the
 * `AWS-RunPowerShellScript` document.
 */
export const getDeployablePatchSnapshotForInstance: (
  input: GetDeployablePatchSnapshotForInstanceRequest,
) => Effect.Effect<
  GetDeployablePatchSnapshotForInstanceResult,
  | InternalServerError
  | UnsupportedFeatureRequiredException
  | UnsupportedOperatingSystem
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeployablePatchSnapshotForInstanceRequest,
  output: GetDeployablePatchSnapshotForInstanceResult,
  errors: [
    InternalServerError,
    UnsupportedFeatureRequiredException,
    UnsupportedOperatingSystem,
  ],
}));
/**
 * Amazon Web Services Systems Manager calls this API operation when you edit OpsMetadata in Application Manager.
 */
export const updateOpsMetadata: (
  input: UpdateOpsMetadataRequest,
) => Effect.Effect<
  UpdateOpsMetadataResult,
  | InternalServerError
  | OpsMetadataInvalidArgumentException
  | OpsMetadataKeyLimitExceededException
  | OpsMetadataNotFoundException
  | OpsMetadataTooManyUpdatesException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOpsMetadataRequest,
  output: UpdateOpsMetadataResult,
  errors: [
    InternalServerError,
    OpsMetadataInvalidArgumentException,
    OpsMetadataKeyLimitExceededException,
    OpsMetadataNotFoundException,
    OpsMetadataTooManyUpdatesException,
  ],
}));
/**
 * Returns a credentials set to be used with just-in-time node access.
 */
export const getAccessToken: (
  input: GetAccessTokenRequest,
) => Effect.Effect<
  GetAccessTokenResponse,
  | AccessDeniedException
  | InternalServerError
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessTokenRequest,
  output: GetAccessTokenResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * An API operation used by the Systems Manager console to display information about Systems Manager managed
 * nodes.
 */
export const describeInstanceProperties: {
  (
    input: DescribeInstancePropertiesRequest,
  ): Effect.Effect<
    DescribeInstancePropertiesResult,
    | InternalServerError
    | InvalidActivationId
    | InvalidDocument
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstancePropertyFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstancePropertiesRequest,
  ) => Stream.Stream<
    DescribeInstancePropertiesResult,
    | InternalServerError
    | InvalidActivationId
    | InvalidDocument
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstancePropertyFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstancePropertiesRequest,
  ) => Stream.Stream<
    InstanceProperty,
    | InternalServerError
    | InvalidActivationId
    | InvalidDocument
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstancePropertyFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstancePropertiesRequest,
  output: DescribeInstancePropertiesResult,
  errors: [
    InternalServerError,
    InvalidActivationId,
    InvalidDocument,
    InvalidFilterKey,
    InvalidInstanceId,
    InvalidInstancePropertyFilterValue,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InstanceProperties",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Associates a related item to a Systems Manager OpsCenter OpsItem. For example, you can associate an
 * Incident Manager incident or analysis with an OpsItem. Incident Manager and OpsCenter are tools in
 * Amazon Web Services Systems Manager.
 */
export const associateOpsItemRelatedItem: (
  input: AssociateOpsItemRelatedItemRequest,
) => Effect.Effect<
  AssociateOpsItemRelatedItemResponse,
  | InternalServerError
  | OpsItemConflictException
  | OpsItemInvalidParameterException
  | OpsItemLimitExceededException
  | OpsItemNotFoundException
  | OpsItemRelatedItemAlreadyExistsException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateOpsItemRelatedItemRequest,
  output: AssociateOpsItemRelatedItemResponse,
  errors: [
    InternalServerError,
    OpsItemConflictException,
    OpsItemInvalidParameterException,
    OpsItemLimitExceededException,
    OpsItemNotFoundException,
    OpsItemRelatedItemAlreadyExistsException,
  ],
}));
/**
 * Starts the workflow for just-in-time node access sessions.
 */
export const startAccessRequest: (
  input: StartAccessRequestRequest,
) => Effect.Effect<
  StartAccessRequestResponse,
  | AccessDeniedException
  | InternalServerError
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAccessRequestRequest,
  output: StartAccessRequestResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * If you create a new application in Application Manager, Amazon Web Services Systems Manager calls this API operation to specify
 * information about the new application, including the application type.
 */
export const createOpsMetadata: (
  input: CreateOpsMetadataRequest,
) => Effect.Effect<
  CreateOpsMetadataResult,
  | InternalServerError
  | OpsMetadataAlreadyExistsException
  | OpsMetadataInvalidArgumentException
  | OpsMetadataLimitExceededException
  | OpsMetadataTooManyUpdatesException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOpsMetadataRequest,
  output: CreateOpsMetadataResult,
  errors: [
    InternalServerError,
    OpsMetadataAlreadyExistsException,
    OpsMetadataInvalidArgumentException,
    OpsMetadataLimitExceededException,
    OpsMetadataTooManyUpdatesException,
  ],
}));
/**
 * A resource data sync helps you view data from multiple sources in a single location.
 * Amazon Web Services Systems Manager offers two types of resource data sync: `SyncToDestination` and
 * `SyncFromSource`.
 *
 * You can configure Systems Manager Inventory to use the `SyncToDestination` type to
 * synchronize Inventory data from multiple Amazon Web Services Regions to a single Amazon Simple Storage Service (Amazon S3) bucket. For more information, see Creating a
 * resource data sync for Inventory in the *Amazon Web Services Systems Manager User Guide*.
 *
 * You can configure Systems Manager Explorer to use the `SyncFromSource` type to synchronize
 * operational work items (OpsItems) and operational data (OpsData) from multiple Amazon Web Services Regions to a
 * single Amazon S3 bucket. This type can synchronize OpsItems and OpsData from multiple
 * Amazon Web Services accounts and Amazon Web Services Regions or `EntireOrganization` by using Organizations. For more
 * information, see Setting up Systems Manager
 * Explorer to display data from multiple accounts and Regions in the
 * *Amazon Web Services Systems Manager User Guide*.
 *
 * A resource data sync is an asynchronous operation that returns immediately. After a
 * successful initial sync is completed, the system continuously syncs data. To check the status of
 * a sync, use the ListResourceDataSync.
 *
 * By default, data isn't encrypted in Amazon S3. We strongly recommend that you
 * enable encryption in Amazon S3 to ensure secure data storage. We also recommend that you
 * secure access to the Amazon S3 bucket by creating a restrictive bucket policy.
 */
export const createResourceDataSync: (
  input: CreateResourceDataSyncRequest,
) => Effect.Effect<
  CreateResourceDataSyncResult,
  | InternalServerError
  | ResourceDataSyncAlreadyExistsException
  | ResourceDataSyncCountExceededException
  | ResourceDataSyncInvalidConfigurationException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceDataSyncRequest,
  output: CreateResourceDataSyncResult,
  errors: [
    InternalServerError,
    ResourceDataSyncAlreadyExistsException,
    ResourceDataSyncCountExceededException,
    ResourceDataSyncInvalidConfigurationException,
  ],
}));
/**
 * Views information about a specific execution of a specific association.
 */
export const describeAssociationExecutionTargets: {
  (
    input: DescribeAssociationExecutionTargetsRequest,
  ): Effect.Effect<
    DescribeAssociationExecutionTargetsResult,
    | AssociationDoesNotExist
    | AssociationExecutionDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAssociationExecutionTargetsRequest,
  ) => Stream.Stream<
    DescribeAssociationExecutionTargetsResult,
    | AssociationDoesNotExist
    | AssociationExecutionDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAssociationExecutionTargetsRequest,
  ) => Stream.Stream<
    AssociationExecutionTarget,
    | AssociationDoesNotExist
    | AssociationExecutionDoesNotExist
    | InternalServerError
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAssociationExecutionTargetsRequest,
  output: DescribeAssociationExecutionTargetsResult,
  errors: [
    AssociationDoesNotExist,
    AssociationExecutionDoesNotExist,
    InternalServerError,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AssociationExecutionTargets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Generates a summary of managed instance/node metadata based on the filters and aggregators
 * you specify. Results are grouped by the input aggregator you specify.
 */
export const listNodesSummary: {
  (
    input: ListNodesSummaryRequest,
  ): Effect.Effect<
    ListNodesSummaryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesSummaryRequest,
  ) => Stream.Stream<
    ListNodesSummaryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesSummaryRequest,
  ) => Stream.Stream<
    S.Schema.Type<typeof NodeSummary>,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesSummaryRequest,
  output: ListNodesSummaryResult,
  errors: [
    InternalServerError,
    InvalidAggregatorException,
    InvalidFilter,
    InvalidNextToken,
    ResourceDataSyncNotFoundException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summary",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates one or more values for an SSM document.
 */
export const updateDocument: (
  input: UpdateDocumentRequest,
) => Effect.Effect<
  UpdateDocumentResult,
  | DocumentVersionLimitExceeded
  | DuplicateDocumentContent
  | DuplicateDocumentVersionName
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentContent
  | InvalidDocumentOperation
  | InvalidDocumentSchemaVersion
  | InvalidDocumentVersion
  | MaxDocumentSizeExceeded
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDocumentRequest,
  output: UpdateDocumentResult,
  errors: [
    DocumentVersionLimitExceeded,
    DuplicateDocumentContent,
    DuplicateDocumentVersionName,
    InternalServerError,
    InvalidDocument,
    InvalidDocumentContent,
    InvalidDocumentOperation,
    InvalidDocumentSchemaVersion,
    InvalidDocumentVersion,
    MaxDocumentSizeExceeded,
  ],
}));
/**
 * Takes in filters and returns a list of managed nodes matching the filter criteria.
 */
export const listNodes: {
  (
    input: ListNodesRequest,
  ): Effect.Effect<
    ListNodesResult,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesRequest,
  ) => Stream.Stream<
    ListNodesResult,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesRequest,
  ) => Stream.Stream<
    Node,
    | InternalServerError
    | InvalidFilter
    | InvalidNextToken
    | ResourceDataSyncNotFoundException
    | UnsupportedOperationException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesRequest,
  output: ListNodesResult,
  errors: [
    InternalServerError,
    InvalidFilter,
    InvalidNextToken,
    ResourceDataSyncNotFoundException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Nodes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Initiates execution of an Automation runbook.
 */
export const startAutomationExecution: (
  input: StartAutomationExecutionRequest,
) => Effect.Effect<
  StartAutomationExecutionResult,
  | AutomationDefinitionNotFoundException
  | AutomationDefinitionVersionNotFoundException
  | AutomationExecutionLimitExceededException
  | IdempotentParameterMismatch
  | InternalServerError
  | InvalidAutomationExecutionParametersException
  | InvalidTarget
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAutomationExecutionRequest,
  output: StartAutomationExecutionResult,
  errors: [
    AutomationDefinitionNotFoundException,
    AutomationDefinitionVersionNotFoundException,
    AutomationExecutionLimitExceededException,
    IdempotentParameterMismatch,
    InternalServerError,
    InvalidAutomationExecutionParametersException,
    InvalidTarget,
  ],
}));
/**
 * Deletes a Systems Manager resource policy. A resource policy helps you to define the IAM entity (for example, an Amazon Web Services account) that can manage your Systems Manager resources. The following
 * resources support Systems Manager resource policies.
 *
 * - `OpsItemGroup` - The resource policy for `OpsItemGroup` enables
 * Amazon Web Services accounts to view and interact with OpsCenter operational work items (OpsItems).
 *
 * - `Parameter` - The resource policy is used to share a parameter with other
 * accounts using Resource Access Manager (RAM). For more information about
 * cross-account sharing of parameters, see Working with
 * shared parameters in the *Amazon Web Services Systems Manager User Guide*.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => Effect.Effect<
  DeleteResourcePolicyResponse,
  | InternalServerError
  | MalformedResourcePolicyDocumentException
  | ResourceNotFoundException
  | ResourcePolicyConflictException
  | ResourcePolicyInvalidParameterException
  | ResourcePolicyNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    InternalServerError,
    MalformedResourcePolicyDocumentException,
    ResourceNotFoundException,
    ResourcePolicyConflictException,
    ResourcePolicyInvalidParameterException,
    ResourcePolicyNotFoundException,
  ],
}));
/**
 * Creates or updates a Systems Manager resource policy. A resource policy helps you to define the
 * IAM entity (for example, an Amazon Web Services account) that can manage your Systems Manager resources.
 * The following resources support Systems Manager resource policies.
 *
 * - `OpsItemGroup` - The resource policy for `OpsItemGroup` enables
 * Amazon Web Services accounts to view and interact with OpsCenter operational work items (OpsItems).
 *
 * - `Parameter` - The resource policy is used to share a parameter with other
 * accounts using Resource Access Manager (RAM).
 *
 * To share a parameter, it must be in the advanced parameter tier. For information about
 * parameter tiers, see Managing
 * parameter tiers. For information about changing an existing standard parameter to an
 * advanced parameter, see Changing a standard parameter to an advanced parameter.
 *
 * To share a `SecureString` parameter, it must be encrypted with a customer managed key, and you must share the key separately through Key Management Service. Amazon Web Services managed keys cannot be shared. Parameters encrypted with the default Amazon Web Services managed key can be updated to use a customer managed key instead. For KMS key definitions, see KMS concepts in the
 * *Key Management Service Developer Guide*.
 *
 * While you can share a parameter using the Systems Manager `PutResourcePolicy` operation,
 * we recommend using Resource Access Manager (RAM) instead. This is because using
 * `PutResourcePolicy` requires the extra step of promoting the parameter to a
 * standard RAM Resource Share using the RAM
 * PromoteResourceShareCreatedFromPolicy API operation. Otherwise, the parameter won't
 * be returned by the Systems Manager DescribeParameters API operation using the `--shared` option.
 *
 * For more information, see Sharing a
 * parameter in the *Amazon Web Services Systems Manager User Guide*
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => Effect.Effect<
  PutResourcePolicyResponse,
  | InternalServerError
  | MalformedResourcePolicyDocumentException
  | ResourceNotFoundException
  | ResourcePolicyConflictException
  | ResourcePolicyInvalidParameterException
  | ResourcePolicyLimitExceededException
  | ResourcePolicyNotFoundException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    InternalServerError,
    MalformedResourcePolicyDocumentException,
    ResourceNotFoundException,
    ResourcePolicyConflictException,
    ResourcePolicyInvalidParameterException,
    ResourcePolicyLimitExceededException,
    ResourcePolicyNotFoundException,
  ],
}));
/**
 * Creates a Amazon Web Services Systems Manager (SSM document). An SSM document defines the actions that Systems Manager performs
 * on your managed nodes. For more information about SSM documents, including information about
 * supported schemas, features, and syntax, see Amazon Web Services Systems Manager Documents in the
 * *Amazon Web Services Systems Manager User Guide*.
 */
export const createDocument: (
  input: CreateDocumentRequest,
) => Effect.Effect<
  CreateDocumentResult,
  | DocumentAlreadyExists
  | DocumentLimitExceeded
  | InternalServerError
  | InvalidDocumentContent
  | InvalidDocumentSchemaVersion
  | MaxDocumentSizeExceeded
  | NoLongerSupportedException
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDocumentRequest,
  output: CreateDocumentResult,
  errors: [
    DocumentAlreadyExists,
    DocumentLimitExceeded,
    InternalServerError,
    InvalidDocumentContent,
    InvalidDocumentSchemaVersion,
    MaxDocumentSizeExceeded,
    NoLongerSupportedException,
    TooManyUpdates,
  ],
}));
/**
 * Delete a custom inventory type or the data associated with a custom Inventory type. Deleting
 * a custom inventory type is also referred to as deleting a custom inventory schema.
 */
export const deleteInventory: (
  input: DeleteInventoryRequest,
) => Effect.Effect<
  DeleteInventoryResult,
  | InternalServerError
  | InvalidDeleteInventoryParametersException
  | InvalidInventoryRequestException
  | InvalidOptionException
  | InvalidTypeNameException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInventoryRequest,
  output: DeleteInventoryResult,
  errors: [
    InternalServerError,
    InvalidDeleteInventoryParametersException,
    InvalidInventoryRequestException,
    InvalidOptionException,
    InvalidTypeNameException,
  ],
}));
/**
 * Provides information about one or more of your managed nodes, including the operating system
 * platform, SSM Agent version, association status, and IP address. This operation does not return
 * information for nodes that are either Stopped or Terminated.
 *
 * If you specify one or more node IDs, the operation returns information for those managed
 * nodes. If you don't specify node IDs, it returns information for all your managed nodes. If you
 * specify a node ID that isn't valid or a node that you don't own, you receive an error.
 *
 * The `IamRole` field returned for this API operation is the role assigned to an
 * Amazon EC2 instance configured with a Systems Manager Quick Setup host management configuration or
 * the role assigned to an on-premises managed node.
 */
export const describeInstanceInformation: {
  (
    input: DescribeInstanceInformationRequest,
  ): Effect.Effect<
    DescribeInstanceInformationResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstanceInformationFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstanceInformationRequest,
  ) => Stream.Stream<
    DescribeInstanceInformationResult,
    | InternalServerError
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstanceInformationFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstanceInformationRequest,
  ) => Stream.Stream<
    InstanceInformation,
    | InternalServerError
    | InvalidFilterKey
    | InvalidInstanceId
    | InvalidInstanceInformationFilterValue
    | InvalidNextToken
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeInstanceInformationRequest,
  output: DescribeInstanceInformationResult,
  errors: [
    InternalServerError,
    InvalidFilterKey,
    InvalidInstanceId,
    InvalidInstanceInformationFilterValue,
    InvalidNextToken,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "InstanceInformationList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Registers a compliance type and other compliance details on a designated resource. This
 * operation lets you register custom compliance details with a resource. This call overwrites
 * existing compliance information on the resource, so you must provide a full list of compliance
 * items each time that you send the request.
 *
 * ComplianceType can be one of the following:
 *
 * - ExecutionId: The execution ID when the patch, association, or custom compliance item was
 * applied.
 *
 * - ExecutionType: Specify patch, association, or Custom:`string`.
 *
 * - ExecutionTime. The time the patch, association, or custom compliance item was applied to
 * the managed node.
 *
 * For State Manager associations, this represents the time when compliance status was
 * captured by the Systems Manager service during its internal compliance aggregation workflow, not
 * necessarily when the association was executed on the managed node. State Manager updates
 * compliance information for all associations on an instance whenever any association executes,
 * which may result in multiple associations showing the same execution time.
 *
 * - Id: The patch, association, or custom compliance ID.
 *
 * - Title: A title.
 *
 * - Status: The status of the compliance item. For example, `approved` for patches,
 * or `Failed` for associations.
 *
 * - Severity: A patch severity. For example, `Critical`.
 *
 * - DocumentName: An SSM document name. For example, `AWS-RunPatchBaseline`.
 *
 * - DocumentVersion: An SSM document version number. For example, 4.
 *
 * - Classification: A patch classification. For example, `security updates`.
 *
 * - PatchBaselineId: A patch baseline ID.
 *
 * - PatchSeverity: A patch severity. For example, `Critical`.
 *
 * - PatchState: A patch state. For example, `InstancesWithFailedPatches`.
 *
 * - PatchGroup: The name of a patch group.
 *
 * - InstalledTime: The time the association, patch, or custom compliance item was applied to
 * the resource. Specify the time by using the following format:
 * `yyyy-MM-dd'T'HH:mm:ss'Z'`
 */
export const putComplianceItems: (
  input: PutComplianceItemsRequest,
) => Effect.Effect<
  PutComplianceItemsResult,
  | ComplianceTypeCountLimitExceededException
  | InternalServerError
  | InvalidItemContentException
  | InvalidResourceId
  | InvalidResourceType
  | ItemSizeLimitExceededException
  | TotalSizeLimitExceededException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutComplianceItemsRequest,
  output: PutComplianceItemsResult,
  errors: [
    ComplianceTypeCountLimitExceededException,
    InternalServerError,
    InvalidItemContentException,
    InvalidResourceId,
    InvalidResourceType,
    ItemSizeLimitExceededException,
    TotalSizeLimitExceededException,
  ],
}));
/**
 * Amazon Web Services Systems Manager Change Manager will no longer be open to new
 * customers starting November 7, 2025. If you would like to use Change Manager, sign up prior to that date. Existing customers can
 * continue to use the service as normal. For more information, see
 * Amazon Web Services Systems Manager Change Manager availability change.
 *
 * Creates a change request for Change Manager. The Automation runbooks specified in the
 * change request run only after all required approvals for the change request have been
 * received.
 */
export const startChangeRequestExecution: (
  input: StartChangeRequestExecutionRequest,
) => Effect.Effect<
  StartChangeRequestExecutionResult,
  | AutomationDefinitionNotApprovedException
  | AutomationDefinitionNotFoundException
  | AutomationDefinitionVersionNotFoundException
  | AutomationExecutionLimitExceededException
  | IdempotentParameterMismatch
  | InternalServerError
  | InvalidAutomationExecutionParametersException
  | NoLongerSupportedException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChangeRequestExecutionRequest,
  output: StartChangeRequestExecutionResult,
  errors: [
    AutomationDefinitionNotApprovedException,
    AutomationDefinitionNotFoundException,
    AutomationDefinitionVersionNotFoundException,
    AutomationExecutionLimitExceededException,
    IdempotentParameterMismatch,
    InternalServerError,
    InvalidAutomationExecutionParametersException,
    NoLongerSupportedException,
  ],
}));
/**
 * Runs commands on one or more managed nodes.
 */
export const sendCommand: (
  input: SendCommandRequest,
) => Effect.Effect<
  SendCommandResult,
  | DuplicateInstanceId
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentVersion
  | InvalidInstanceId
  | InvalidNotificationConfig
  | InvalidOutputFolder
  | InvalidParameters
  | InvalidRole
  | MaxDocumentSizeExceeded
  | UnsupportedPlatformType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendCommandRequest,
  output: SendCommandResult,
  errors: [
    DuplicateInstanceId,
    InternalServerError,
    InvalidDocument,
    InvalidDocumentVersion,
    InvalidInstanceId,
    InvalidNotificationConfig,
    InvalidOutputFolder,
    InvalidParameters,
    InvalidRole,
    MaxDocumentSizeExceeded,
    UnsupportedPlatformType,
  ],
}));
/**
 * A State Manager association defines the state that you want to maintain on your managed
 * nodes. For example, an association can specify that anti-virus software must be installed and
 * running on your managed nodes, or that certain ports must be closed. For static targets, the
 * association specifies a schedule for when the configuration is reapplied. For dynamic targets,
 * such as an Amazon Web Services resource group or an Amazon Web Services autoscaling group, State Manager, a tool in Amazon Web Services Systems Manager
 * applies the configuration when new managed nodes are added to the group. The association also
 * specifies actions to take when applying the configuration. For example, an association for
 * anti-virus software might run once a day. If the software isn't installed, then State Manager
 * installs it. If the software is installed, but the service isn't running, then the association
 * might instruct State Manager to start the service.
 */
export const createAssociation: (
  input: CreateAssociationRequest,
) => Effect.Effect<
  CreateAssociationResult,
  | AssociationAlreadyExists
  | AssociationLimitExceeded
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentVersion
  | InvalidInstanceId
  | InvalidOutputLocation
  | InvalidParameters
  | InvalidSchedule
  | InvalidTag
  | InvalidTarget
  | InvalidTargetMaps
  | UnsupportedPlatformType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssociationRequest,
  output: CreateAssociationResult,
  errors: [
    AssociationAlreadyExists,
    AssociationLimitExceeded,
    InternalServerError,
    InvalidDocument,
    InvalidDocumentVersion,
    InvalidInstanceId,
    InvalidOutputLocation,
    InvalidParameters,
    InvalidSchedule,
    InvalidTag,
    InvalidTarget,
    InvalidTargetMaps,
    UnsupportedPlatformType,
  ],
}));
/**
 * Associates the specified Amazon Web Services Systems Manager document (SSM document) with the specified managed nodes
 * or targets.
 *
 * When you associate a document with one or more managed nodes using IDs or tags, Amazon Web Services Systems Manager
 * Agent (SSM Agent) running on the managed node processes the document and configures the node as
 * specified.
 *
 * If you associate a document with a managed node that already has an associated document, the
 * system returns the AssociationAlreadyExists exception.
 */
export const createAssociationBatch: (
  input: CreateAssociationBatchRequest,
) => Effect.Effect<
  CreateAssociationBatchResult,
  | AssociationLimitExceeded
  | DuplicateInstanceId
  | InternalServerError
  | InvalidDocument
  | InvalidDocumentVersion
  | InvalidInstanceId
  | InvalidOutputLocation
  | InvalidParameters
  | InvalidSchedule
  | InvalidTarget
  | InvalidTargetMaps
  | UnsupportedPlatformType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAssociationBatchRequest,
  output: CreateAssociationBatchResult,
  errors: [
    AssociationLimitExceeded,
    DuplicateInstanceId,
    InternalServerError,
    InvalidDocument,
    InvalidDocumentVersion,
    InvalidInstanceId,
    InvalidOutputLocation,
    InvalidParameters,
    InvalidSchedule,
    InvalidTarget,
    InvalidTargetMaps,
    UnsupportedPlatformType,
  ],
}));
/**
 * View a summary of operations metadata (OpsData) based on specified filters and aggregators.
 * OpsData can include information about Amazon Web Services Systems Manager OpsCenter operational workitems (OpsItems) as
 * well as information about any Amazon Web Services resource or service configured to report OpsData to Amazon Web Services Systems Manager
 * Explorer.
 */
export const getOpsSummary: {
  (
    input: GetOpsSummaryRequest,
  ): Effect.Effect<
    GetOpsSummaryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | InvalidTypeNameException
    | ResourceDataSyncNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetOpsSummaryRequest,
  ) => Stream.Stream<
    GetOpsSummaryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | InvalidTypeNameException
    | ResourceDataSyncNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetOpsSummaryRequest,
  ) => Stream.Stream<
    OpsEntity,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidNextToken
    | InvalidTypeNameException
    | ResourceDataSyncNotFoundException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetOpsSummaryRequest,
  output: GetOpsSummaryResult,
  errors: [
    InternalServerError,
    InvalidAggregatorException,
    InvalidFilter,
    InvalidNextToken,
    InvalidTypeNameException,
    ResourceDataSyncNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates an association. You can update the association name and version, the document
 * version, schedule, parameters, and Amazon Simple Storage Service (Amazon S3) output. When you
 * call `UpdateAssociation`, the system removes all optional parameters from the request
 * and overwrites the association with null values for those parameters. This is by design. You must
 * specify all optional parameters in the call, even if you are not changing the parameters. This
 * includes the `Name` parameter. Before calling this API action, we recommend that you
 * call the DescribeAssociation API operation and make a note of all optional
 * parameters required for your `UpdateAssociation` call.
 *
 * In order to call this API operation, a user, group, or role must be granted permission to
 * call the DescribeAssociation API operation. If you don't have permission to
 * call `DescribeAssociation`, then you receive the following error: An error
 * occurred (AccessDeniedException) when calling the UpdateAssociation operation: User:
 * isn't authorized to perform: ssm:DescribeAssociation on resource:
 *
 * When you update an association, the association immediately runs against the specified
 * targets. You can add the `ApplyOnlyAtCronInterval` parameter to run the association
 * during the next schedule run.
 */
export const updateAssociation: (
  input: UpdateAssociationRequest,
) => Effect.Effect<
  UpdateAssociationResult,
  | AssociationDoesNotExist
  | AssociationVersionLimitExceeded
  | InternalServerError
  | InvalidAssociationVersion
  | InvalidDocument
  | InvalidDocumentVersion
  | InvalidOutputLocation
  | InvalidParameters
  | InvalidSchedule
  | InvalidTarget
  | InvalidTargetMaps
  | InvalidUpdate
  | TooManyUpdates
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAssociationRequest,
  output: UpdateAssociationResult,
  errors: [
    AssociationDoesNotExist,
    AssociationVersionLimitExceeded,
    InternalServerError,
    InvalidAssociationVersion,
    InvalidDocument,
    InvalidDocumentVersion,
    InvalidOutputLocation,
    InvalidParameters,
    InvalidSchedule,
    InvalidTarget,
    InvalidTargetMaps,
    InvalidUpdate,
    TooManyUpdates,
  ],
}));
/**
 * Query inventory information. This includes managed node status, such as `Stopped`
 * or `Terminated`.
 */
export const getInventory: {
  (
    input: GetInventoryRequest,
  ): Effect.Effect<
    GetInventoryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidInventoryGroupException
    | InvalidNextToken
    | InvalidResultAttributeException
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetInventoryRequest,
  ) => Stream.Stream<
    GetInventoryResult,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidInventoryGroupException
    | InvalidNextToken
    | InvalidResultAttributeException
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetInventoryRequest,
  ) => Stream.Stream<
    InventoryResultEntity,
    | InternalServerError
    | InvalidAggregatorException
    | InvalidFilter
    | InvalidInventoryGroupException
    | InvalidNextToken
    | InvalidResultAttributeException
    | InvalidTypeNameException
    | CommonErrors,
    Creds | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetInventoryRequest,
  output: GetInventoryResult,
  errors: [
    InternalServerError,
    InvalidAggregatorException,
    InvalidFilter,
    InvalidInventoryGroupException,
    InvalidNextToken,
    InvalidResultAttributeException,
    InvalidTypeNameException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Bulk update custom inventory items on one or more managed nodes. The request adds an
 * inventory item, if it doesn't already exist, or updates an inventory item, if it does
 * exist.
 */
export const putInventory: (
  input: PutInventoryRequest,
) => Effect.Effect<
  PutInventoryResult,
  | CustomSchemaCountLimitExceededException
  | InternalServerError
  | InvalidInstanceId
  | InvalidInventoryItemContextException
  | InvalidItemContentException
  | InvalidTypeNameException
  | ItemContentMismatchException
  | ItemSizeLimitExceededException
  | SubTypeCountLimitExceededException
  | TotalSizeLimitExceededException
  | UnsupportedInventoryItemContextException
  | UnsupportedInventorySchemaVersionException
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInventoryRequest,
  output: PutInventoryResult,
  errors: [
    CustomSchemaCountLimitExceededException,
    InternalServerError,
    InvalidInstanceId,
    InvalidInventoryItemContextException,
    InvalidItemContentException,
    InvalidTypeNameException,
    ItemContentMismatchException,
    ItemSizeLimitExceededException,
    SubTypeCountLimitExceededException,
    TotalSizeLimitExceededException,
    UnsupportedInventoryItemContextException,
    UnsupportedInventorySchemaVersionException,
  ],
}));
/**
 * Create or update a parameter in Parameter Store.
 */
export const putParameter: (
  input: PutParameterRequest,
) => Effect.Effect<
  PutParameterResult,
  | HierarchyLevelLimitExceededException
  | HierarchyTypeMismatchException
  | IncompatiblePolicyException
  | InternalServerError
  | InvalidAllowedPatternException
  | InvalidKeyId
  | InvalidPolicyAttributeException
  | InvalidPolicyTypeException
  | ParameterAlreadyExists
  | ParameterLimitExceeded
  | ParameterMaxVersionLimitExceeded
  | ParameterPatternMismatchException
  | PoliciesLimitExceededException
  | TooManyUpdates
  | UnsupportedParameterType
  | CommonErrors,
  Creds | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutParameterRequest,
  output: PutParameterResult,
  errors: [
    HierarchyLevelLimitExceededException,
    HierarchyTypeMismatchException,
    IncompatiblePolicyException,
    InternalServerError,
    InvalidAllowedPatternException,
    InvalidKeyId,
    InvalidPolicyAttributeException,
    InvalidPolicyTypeException,
    ParameterAlreadyExists,
    ParameterLimitExceeded,
    ParameterMaxVersionLimitExceeded,
    ParameterPatternMismatchException,
    PoliciesLimitExceededException,
    TooManyUpdates,
    UnsupportedParameterType,
  ],
}));
