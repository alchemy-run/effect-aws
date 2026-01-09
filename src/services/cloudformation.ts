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
const ns = T.XmlNamespace(
  "http://cloudformation.amazonaws.com/doc/2010-05-15/",
);
const svc = T.AwsApiService({
  sdkId: "CloudFormation",
  serviceShapeName: "CloudFormation",
});
const auth = T.AwsAuthSigv4({ name: "cloudformation" });
const ver = T.ServiceVersion("2010-05-15");
const proto = T.AwsProtocolsAwsQuery();
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
              `https://cloudformation-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://cloudformation.${Region}.amazonaws.com`);
            }
            return e(
              `https://cloudformation-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloudformation.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloudformation.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ErrorMessage = string;
export type ThirdPartyTypeArn = string;
export type PublisherId = string;
export type TypeName = string;
export type AutoUpdate = boolean;
export type RoleARN2 = string;
export type MajorVersion = number;
export type StackName = string;
export type ClientRequestToken = string;
export type StackNameOrId = string;
export type RoleARN = string;
export type ResourceToSkip = string;
export type TemplateBody = string;
export type TemplateURL = string;
export type UsePreviousTemplate = boolean;
export type ResourceType = string;
export type NotificationARN = string;
export type ChangeSetName = string;
export type ClientToken = string;
export type Description = string;
export type IncludeNestedStacks = boolean;
export type ImportExistingResources = boolean;
export type GeneratedTemplateName = string;
export type DisableRollback = boolean;
export type TimeoutMinutes = number;
export type StackPolicyBody = string;
export type StackPolicyURL = string;
export type EnableTerminationProtection = boolean;
export type RetainExceptOnCreate = boolean;
export type StackSetName = string;
export type Account = string;
export type Region = string;
export type EnableStackCreation = boolean;
export type StackId = string;
export type ExecutionRoleName = string;
export type PrivateTypeArn = string;
export type ChangeSetNameOrId = string;
export type LogicalResourceId = string;
export type RetainStacks = boolean;
export type TypeVersionId = string;
export type NextToken = string;
export type IncludePropertyValues = boolean;
export type OperationId = string;
export type ResourceScanId = string;
export type StackDriftDetectionId = string;
export type StackRefactorId = string;
export type BoxedMaxResults = number;
export type PhysicalResourceId = string;
export type TypeArn = string;
export type PublicVersionNumber = string;
export type RegistrationToken = string;
export type StackSetNameOrId = string;
export type HookInvocationId = string;
export type StackIdsUrl = string;
export type OrganizationalUnitId = string;
export type MaxResults = number;
export type HookResultId = string;
export type HookTypeArn = string;
export type ExportName = string;
export type ResourceIdentifier = string;
export type ResourceTypePrefix = string;
export type TagKey = string;
export type TagValue = string;
export type ResourceScannerMaxResults = number;
export type StatusMessage = string;
export type ResourceModel = string;
export type AcceptTermsAndConditions = boolean;
export type ConnectionArn = string;
export type S3Url = string;
export type RequestToken = string;
export type TypeConfiguration = string;
export type TypeConfigurationAlias = string;
export type ResourceSignalUniqueId = string;
export type S3Bucket = string;
export type RefreshAllResources = boolean;
export type StackPolicyDuringUpdateBody = string;
export type StackPolicyDuringUpdateURL = string;
export type LogGroupName = string;
export type TypeConfigurationArn = string;
export type ParameterKey = string;
export type ParameterValue = string;
export type UsePreviousValue = boolean;
export type MonitoringTimeInMinutes = number;
export type AccountsUrl = string;
export type FailureToleranceCount = number;
export type FailureTolerancePercentage = number;
export type MaxConcurrentCount = number;
export type MaxConcurrentPercentage = number;
export type AutoDeploymentNullable = boolean;
export type RetainStacksOnAccountRemovalNullable = boolean;
export type StackSetARN = string;
export type ManagedExecutionNullable = boolean;
export type FailedEventsFilter = boolean;
export type TreatUnrecognizedResourceTypesAsWarnings = boolean;
export type StackInstanceFilterValues = string;
export type OperationResultFilterValues = string;
export type TypeNamePrefix = string;
export type ResourceTypeFilter = string;
export type ChangeSetId = string;
export type CreationTime = Date;
export type ChangeSetStatusReason = string;
export type GeneratedTemplateId = string;
export type TemplateStatusReason = string;
export type LastUpdatedTime = Date;
export type TotalWarnings = number;
export type PublisherProfile = string;
export type ResourceScanStatusReason = string;
export type PercentageCompleted = number;
export type ResourcesScanned = number;
export type ResourcesRead = number;
export type StackDriftDetectionStatusReason = string;
export type BoxedInteger = number;
export type ExecutionStatusReason = string;
export type StackRefactorStatusReason = string;
export type IsDefaultVersion = boolean;
export type TypeTestsStatusDescription = string;
export type TypeSchema = string;
export type OptionalSecureUrl = string;
export type ConfigurationSchema = string;
export type IsActivated = boolean;
export type Url = string;
export type HookTypeName = string;
export type HookTypeVersionId = string;
export type HookTypeConfigurationVersionId = string;
export type HookStatusReason = string;
export type CapabilitiesReason = string;
export type TransformName = string;
export type Arn = string;
export type Type = string;
export type ResourceIdentifierPropertyKey = string;
export type ResourceIdentifierPropertyValue = string;
export type JazzResourceIdentifierPropertyKey = string;
export type JazzResourceIdentifierPropertyValue = string;
export type LimitName = string;
export type LimitValue = number;
export type HookInvocationCount = number;
export type ResourceStatusReason = string;
export type ResourcesSucceeded = number;
export type ResourcesFailed = number;
export type ResourcesProcessing = number;
export type ResourcesPending = number;
export type EventId = string;
export type ResourceProperties = string;
export type HookType = string;
export type StackSetId = string;
export type Reason = string;
export type Metadata = string;
export type Properties = string;
export type StackResourceDriftStatusReason = string;
export type DeletionTime = Date;
export type StackStatusReason = string;
export type RetainStacksNullable = boolean;
export type StackSetOperationStatusReason = string;
export type SupportedMajorVersion = number;
export type HookTargetTypeName = string;
export type HookTargetId = string;
export type AnnotationName = string;
export type RemediationMessageStatusMessage = string;
export type RemediationMessageRemediationMessage = string;
export type AnnotationRemediationLink = string;
export type ExportValue = string;
export type NumberOfResources = number;
export type ManagedByStack = boolean;
export type StackRefactorResourceIdentifier = string;
export type DetectionReason = string;
export type TemplateDescription = string;
export type NoEcho = boolean;
export type Version = string;
export type BeforeContext = string;
export type AfterContext = string;
export type PreviousDeploymentContext = string;
export type TypeHierarchy = string;
export type LogicalIdHierarchy = string;
export type Key = string;
export type Value = string;
export type PropertyPath = string;
export type PropertyValue = string;
export type OutputKey = string;
export type OutputValue = string;
export type TotalStackInstancesCount = number;
export type DriftedStackInstancesCount = number;
export type InSyncStackInstancesCount = number;
export type InProgressStackInstancesCount = number;
export type FailedStackInstancesCount = number;
export type ErrorCode = string;
export type IsDefaultConfiguration = boolean;
export type ValidationName = string;
export type ValidationStatusReason = string;
export type ValidationPath = string;
export type ParameterType = string;
export type PublisherName = string;
export type ResourcePropertyPath = string;
export type CausingEntity = string;
export type RequiredProperty = boolean;
export type PropertyDescription = string;
export type AllowedValue = string;
export type AccountGateStatusReason = string;
export type PropertyName = string;
export type BeforeValue = string;
export type AfterValue = string;
export type ResourceDriftPreviousValue = string;
export type ResourceDriftActualValue = string;

//# Schemas
export interface ActivateOrganizationsAccessInput {}
export const ActivateOrganizationsAccessInput = S.suspend(() =>
  S.Struct({}).pipe(
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
  identifier: "ActivateOrganizationsAccessInput",
}) as any as S.Schema<ActivateOrganizationsAccessInput>;
export interface ActivateOrganizationsAccessOutput {}
export const ActivateOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ActivateOrganizationsAccessOutput",
}) as any as S.Schema<ActivateOrganizationsAccessOutput>;
export interface DeactivateOrganizationsAccessInput {}
export const DeactivateOrganizationsAccessInput = S.suspend(() =>
  S.Struct({}).pipe(
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
  identifier: "DeactivateOrganizationsAccessInput",
}) as any as S.Schema<DeactivateOrganizationsAccessInput>;
export interface DeactivateOrganizationsAccessOutput {}
export const DeactivateOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivateOrganizationsAccessOutput",
}) as any as S.Schema<DeactivateOrganizationsAccessOutput>;
export type ThirdPartyType = "RESOURCE" | "MODULE" | "HOOK" | (string & {});
export const ThirdPartyType = S.String;
export type VersionBump = "MAJOR" | "MINOR" | (string & {});
export const VersionBump = S.String;
export type ResourcesToSkip = string[];
export const ResourcesToSkip = S.Array(S.String);
export type Capability =
  | "CAPABILITY_IAM"
  | "CAPABILITY_NAMED_IAM"
  | "CAPABILITY_AUTO_EXPAND"
  | (string & {});
export const Capability = S.String;
export type Capabilities = Capability[];
export const Capabilities = S.Array(Capability);
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type NotificationARNs = string[];
export const NotificationARNs = S.Array(S.String);
export type ChangeSetType = "CREATE" | "UPDATE" | "IMPORT" | (string & {});
export const ChangeSetType = S.String;
export type OnStackFailure =
  | "DO_NOTHING"
  | "ROLLBACK"
  | "DELETE"
  | (string & {});
export const OnStackFailure = S.String;
export type DeploymentMode = "REVERT_DRIFT" | (string & {});
export const DeploymentMode = S.String;
export type OnFailure = "DO_NOTHING" | "ROLLBACK" | "DELETE" | (string & {});
export const OnFailure = S.String;
export type AccountList = string[];
export const AccountList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type CallAs = "SELF" | "DELEGATED_ADMIN" | (string & {});
export const CallAs = S.String;
export type PermissionModels =
  | "SERVICE_MANAGED"
  | "SELF_MANAGED"
  | (string & {});
export const PermissionModels = S.String;
export type RetainResources = string[];
export const RetainResources = S.Array(S.String);
export type DeletionMode = "STANDARD" | "FORCE_DELETE_STACK" | (string & {});
export const DeletionMode = S.String;
export type RegistryType = "RESOURCE" | "MODULE" | "HOOK" | (string & {});
export const RegistryType = S.String;
export type StackResourceDriftStatus =
  | "IN_SYNC"
  | "MODIFIED"
  | "DELETED"
  | "NOT_CHECKED"
  | "UNKNOWN"
  | "UNSUPPORTED"
  | (string & {});
export const StackResourceDriftStatus = S.String;
export type StackResourceDriftStatusFilters = StackResourceDriftStatus[];
export const StackResourceDriftStatusFilters = S.Array(
  StackResourceDriftStatus,
);
export type LogicalResourceIds = string[];
export const LogicalResourceIds = S.Array(S.String);
export type TemplateFormat = "JSON" | "YAML" | (string & {});
export const TemplateFormat = S.String;
export type TemplateStage = "Original" | "Processed" | (string & {});
export const TemplateStage = S.String;
export type StackIdList = string[];
export const StackIdList = S.Array(S.String);
export type OrganizationalUnitIdList = string[];
export const OrganizationalUnitIdList = S.Array(S.String);
export type ListHookResultsTargetType =
  | "CHANGE_SET"
  | "STACK"
  | "RESOURCE"
  | "CLOUD_CONTROL"
  | (string & {});
export const ListHookResultsTargetType = S.String;
export type HookStatus =
  | "HOOK_IN_PROGRESS"
  | "HOOK_COMPLETE_SUCCEEDED"
  | "HOOK_COMPLETE_FAILED"
  | "HOOK_FAILED"
  | (string & {});
export const HookStatus = S.String;
export type ScanType = "FULL" | "PARTIAL" | (string & {});
export const ScanType = S.String;
export type StackRefactorExecutionStatus =
  | "UNAVAILABLE"
  | "AVAILABLE"
  | "OBSOLETE"
  | "EXECUTE_IN_PROGRESS"
  | "EXECUTE_COMPLETE"
  | "EXECUTE_FAILED"
  | "ROLLBACK_IN_PROGRESS"
  | "ROLLBACK_COMPLETE"
  | "ROLLBACK_FAILED"
  | (string & {});
export const StackRefactorExecutionStatus = S.String;
export type StackRefactorExecutionStatusFilter = StackRefactorExecutionStatus[];
export const StackRefactorExecutionStatusFilter = S.Array(
  StackRefactorExecutionStatus,
);
export type StackStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "CREATE_COMPLETE"
  | "ROLLBACK_IN_PROGRESS"
  | "ROLLBACK_FAILED"
  | "ROLLBACK_COMPLETE"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED"
  | "DELETE_COMPLETE"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"
  | "UPDATE_COMPLETE"
  | "UPDATE_FAILED"
  | "UPDATE_ROLLBACK_IN_PROGRESS"
  | "UPDATE_ROLLBACK_FAILED"
  | "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS"
  | "UPDATE_ROLLBACK_COMPLETE"
  | "REVIEW_IN_PROGRESS"
  | "IMPORT_IN_PROGRESS"
  | "IMPORT_COMPLETE"
  | "IMPORT_ROLLBACK_IN_PROGRESS"
  | "IMPORT_ROLLBACK_FAILED"
  | "IMPORT_ROLLBACK_COMPLETE"
  | (string & {});
export const StackStatus = S.String;
export type StackStatusFilter = StackStatus[];
export const StackStatusFilter = S.Array(StackStatus);
export type StackSetStatus = "ACTIVE" | "DELETED" | (string & {});
export const StackSetStatus = S.String;
export type RegistrationStatus =
  | "COMPLETE"
  | "IN_PROGRESS"
  | "FAILED"
  | (string & {});
export const RegistrationStatus = S.String;
export type Visibility = "PUBLIC" | "PRIVATE" | (string & {});
export const Visibility = S.String;
export type ProvisioningType =
  | "NON_PROVISIONABLE"
  | "IMMUTABLE"
  | "FULLY_MUTABLE"
  | (string & {});
export const ProvisioningType = S.String;
export type DeprecatedStatus = "LIVE" | "DEPRECATED" | (string & {});
export const DeprecatedStatus = S.String;
export type OperationStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | (string & {});
export const OperationStatus = S.String;
export type HandlerErrorCode =
  | "NotUpdatable"
  | "InvalidRequest"
  | "AccessDenied"
  | "InvalidCredentials"
  | "AlreadyExists"
  | "NotFound"
  | "ResourceConflict"
  | "Throttling"
  | "ServiceLimitExceeded"
  | "NotStabilized"
  | "GeneralServiceException"
  | "ServiceInternalError"
  | "NetworkFailure"
  | "InternalFailure"
  | "InvalidTypeConfiguration"
  | "HandlerInternalFailure"
  | "NonCompliant"
  | "Unknown"
  | "UnsupportedTarget"
  | (string & {});
export const HandlerErrorCode = S.String;
export type ResourceSignalStatus = "SUCCESS" | "FAILURE" | (string & {});
export const ResourceSignalStatus = S.String;
export type JazzLogicalResourceIds = string[];
export const JazzLogicalResourceIds = S.Array(S.String);
export interface CancelUpdateStackInput {
  StackName?: string;
  ClientRequestToken?: string;
}
export const CancelUpdateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
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
  identifier: "CancelUpdateStackInput",
}) as any as S.Schema<CancelUpdateStackInput>;
export interface CancelUpdateStackResponse {}
export const CancelUpdateStackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelUpdateStackResponse",
}) as any as S.Schema<CancelUpdateStackResponse>;
export interface ContinueUpdateRollbackInput {
  StackName?: string;
  RoleARN?: string;
  ResourcesToSkip?: string[];
  ClientRequestToken?: string;
}
export const ContinueUpdateRollbackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    RoleARN: S.optional(S.String),
    ResourcesToSkip: S.optional(ResourcesToSkip),
    ClientRequestToken: S.optional(S.String),
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
  identifier: "ContinueUpdateRollbackInput",
}) as any as S.Schema<ContinueUpdateRollbackInput>;
export interface ContinueUpdateRollbackOutput {}
export const ContinueUpdateRollbackOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ContinueUpdateRollbackOutput",
}) as any as S.Schema<ContinueUpdateRollbackOutput>;
export interface Parameter {
  ParameterKey?: string;
  ParameterValue?: string;
  UsePreviousValue?: boolean;
  ResolvedValue?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    ParameterKey: S.optional(S.String),
    ParameterValue: S.optional(S.String),
    UsePreviousValue: S.optional(S.Boolean),
    ResolvedValue: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type Parameters = Parameter[];
export const Parameters = S.Array(Parameter);
export interface RollbackTrigger {
  Arn?: string;
  Type?: string;
}
export const RollbackTrigger = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "RollbackTrigger",
}) as any as S.Schema<RollbackTrigger>;
export type RollbackTriggers = RollbackTrigger[];
export const RollbackTriggers = S.Array(RollbackTrigger);
export interface RollbackConfiguration {
  RollbackTriggers?: RollbackTrigger[];
  MonitoringTimeInMinutes?: number;
}
export const RollbackConfiguration = S.suspend(() =>
  S.Struct({
    RollbackTriggers: S.optional(RollbackTriggers),
    MonitoringTimeInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "RollbackConfiguration",
}) as any as S.Schema<RollbackConfiguration>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateStackInput {
  StackName?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  Parameters?: Parameter[];
  DisableRollback?: boolean;
  RollbackConfiguration?: RollbackConfiguration;
  TimeoutInMinutes?: number;
  NotificationARNs?: string[];
  Capabilities?: Capability[];
  ResourceTypes?: string[];
  RoleARN?: string;
  OnFailure?: OnFailure;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
  Tags?: Tag[];
  ClientRequestToken?: string;
  EnableTerminationProtection?: boolean;
  RetainExceptOnCreate?: boolean;
}
export const CreateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    Parameters: S.optional(Parameters),
    DisableRollback: S.optional(S.Boolean),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    TimeoutInMinutes: S.optional(S.Number),
    NotificationARNs: S.optional(NotificationARNs),
    Capabilities: S.optional(Capabilities),
    ResourceTypes: S.optional(ResourceTypes),
    RoleARN: S.optional(S.String),
    OnFailure: S.optional(OnFailure),
    StackPolicyBody: S.optional(S.String),
    StackPolicyURL: S.optional(S.String),
    Tags: S.optional(Tags),
    ClientRequestToken: S.optional(S.String),
    EnableTerminationProtection: S.optional(S.Boolean),
    RetainExceptOnCreate: S.optional(S.Boolean),
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
  identifier: "CreateStackInput",
}) as any as S.Schema<CreateStackInput>;
export interface DeactivateTypeInput {
  TypeName?: string;
  Type?: ThirdPartyType;
  Arn?: string;
}
export const DeactivateTypeInput = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    Type: S.optional(ThirdPartyType),
    Arn: S.optional(S.String),
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
  identifier: "DeactivateTypeInput",
}) as any as S.Schema<DeactivateTypeInput>;
export interface DeactivateTypeOutput {}
export const DeactivateTypeOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivateTypeOutput",
}) as any as S.Schema<DeactivateTypeOutput>;
export interface DeleteChangeSetInput {
  ChangeSetName?: string;
  StackName?: string;
}
export const DeleteChangeSetInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.optional(S.String),
    StackName: S.optional(S.String),
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
  identifier: "DeleteChangeSetInput",
}) as any as S.Schema<DeleteChangeSetInput>;
export interface DeleteChangeSetOutput {}
export const DeleteChangeSetOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteChangeSetOutput",
}) as any as S.Schema<DeleteChangeSetOutput>;
export interface DeleteGeneratedTemplateInput {
  GeneratedTemplateName?: string;
}
export const DeleteGeneratedTemplateInput = S.suspend(() =>
  S.Struct({ GeneratedTemplateName: S.optional(S.String) }).pipe(
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
  identifier: "DeleteGeneratedTemplateInput",
}) as any as S.Schema<DeleteGeneratedTemplateInput>;
export interface DeleteGeneratedTemplateResponse {}
export const DeleteGeneratedTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGeneratedTemplateResponse",
}) as any as S.Schema<DeleteGeneratedTemplateResponse>;
export interface DeleteStackInput {
  StackName?: string;
  RetainResources?: string[];
  RoleARN?: string;
  ClientRequestToken?: string;
  DeletionMode?: DeletionMode;
}
export const DeleteStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    RetainResources: S.optional(RetainResources),
    RoleARN: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    DeletionMode: S.optional(DeletionMode),
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
  identifier: "DeleteStackInput",
}) as any as S.Schema<DeleteStackInput>;
export interface DeleteStackResponse {}
export const DeleteStackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStackResponse",
}) as any as S.Schema<DeleteStackResponse>;
export type AccountFilterType =
  | "NONE"
  | "INTERSECTION"
  | "DIFFERENCE"
  | "UNION"
  | (string & {});
export const AccountFilterType = S.String;
export interface DeploymentTargets {
  Accounts?: string[];
  AccountsUrl?: string;
  OrganizationalUnitIds?: string[];
  AccountFilterType?: AccountFilterType;
}
export const DeploymentTargets = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(AccountList),
    AccountsUrl: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    AccountFilterType: S.optional(AccountFilterType),
  }),
).annotations({
  identifier: "DeploymentTargets",
}) as any as S.Schema<DeploymentTargets>;
export type RegionConcurrencyType = "SEQUENTIAL" | "PARALLEL" | (string & {});
export const RegionConcurrencyType = S.String;
export type ConcurrencyMode =
  | "STRICT_FAILURE_TOLERANCE"
  | "SOFT_FAILURE_TOLERANCE"
  | (string & {});
export const ConcurrencyMode = S.String;
export interface StackSetOperationPreferences {
  RegionConcurrencyType?: RegionConcurrencyType;
  RegionOrder?: string[];
  FailureToleranceCount?: number;
  FailureTolerancePercentage?: number;
  MaxConcurrentCount?: number;
  MaxConcurrentPercentage?: number;
  ConcurrencyMode?: ConcurrencyMode;
}
export const StackSetOperationPreferences = S.suspend(() =>
  S.Struct({
    RegionConcurrencyType: S.optional(RegionConcurrencyType),
    RegionOrder: S.optional(RegionList),
    FailureToleranceCount: S.optional(S.Number),
    FailureTolerancePercentage: S.optional(S.Number),
    MaxConcurrentCount: S.optional(S.Number),
    MaxConcurrentPercentage: S.optional(S.Number),
    ConcurrencyMode: S.optional(ConcurrencyMode),
  }),
).annotations({
  identifier: "StackSetOperationPreferences",
}) as any as S.Schema<StackSetOperationPreferences>;
export interface DeleteStackInstancesInput {
  StackSetName?: string;
  Accounts?: string[];
  DeploymentTargets?: DeploymentTargets;
  Regions?: string[];
  OperationPreferences?: StackSetOperationPreferences;
  RetainStacks?: boolean;
  OperationId?: string;
  CallAs?: CallAs;
}
export const DeleteStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: S.optional(RegionList),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    RetainStacks: S.optional(S.Boolean),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    CallAs: S.optional(CallAs),
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
  identifier: "DeleteStackInstancesInput",
}) as any as S.Schema<DeleteStackInstancesInput>;
export interface DeleteStackSetInput {
  StackSetName?: string;
  CallAs?: CallAs;
}
export const DeleteStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "DeleteStackSetInput",
}) as any as S.Schema<DeleteStackSetInput>;
export interface DeleteStackSetOutput {}
export const DeleteStackSetOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStackSetOutput",
}) as any as S.Schema<DeleteStackSetOutput>;
export interface DeregisterTypeInput {
  Arn?: string;
  Type?: RegistryType;
  TypeName?: string;
  VersionId?: string;
}
export const DeregisterTypeInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
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
  identifier: "DeregisterTypeInput",
}) as any as S.Schema<DeregisterTypeInput>;
export interface DeregisterTypeOutput {}
export const DeregisterTypeOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterTypeOutput",
}) as any as S.Schema<DeregisterTypeOutput>;
export interface DescribeAccountLimitsInput {
  NextToken?: string;
}
export const DescribeAccountLimitsInput = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
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
  identifier: "DescribeAccountLimitsInput",
}) as any as S.Schema<DescribeAccountLimitsInput>;
export interface DescribeChangeSetInput {
  ChangeSetName?: string;
  StackName?: string;
  NextToken?: string;
  IncludePropertyValues?: boolean;
}
export const DescribeChangeSetInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.optional(S.String),
    StackName: S.optional(S.String),
    NextToken: S.optional(S.String),
    IncludePropertyValues: S.optional(S.Boolean),
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
  identifier: "DescribeChangeSetInput",
}) as any as S.Schema<DescribeChangeSetInput>;
export interface DescribeChangeSetHooksInput {
  ChangeSetName?: string;
  StackName?: string;
  NextToken?: string;
  LogicalResourceId?: string;
}
export const DescribeChangeSetHooksInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.optional(S.String),
    StackName: S.optional(S.String),
    NextToken: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
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
  identifier: "DescribeChangeSetHooksInput",
}) as any as S.Schema<DescribeChangeSetHooksInput>;
export interface DescribeGeneratedTemplateInput {
  GeneratedTemplateName?: string;
}
export const DescribeGeneratedTemplateInput = S.suspend(() =>
  S.Struct({ GeneratedTemplateName: S.optional(S.String) }).pipe(
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
  identifier: "DescribeGeneratedTemplateInput",
}) as any as S.Schema<DescribeGeneratedTemplateInput>;
export interface DescribeOrganizationsAccessInput {
  CallAs?: CallAs;
}
export const DescribeOrganizationsAccessInput = S.suspend(() =>
  S.Struct({ CallAs: S.optional(CallAs) }).pipe(
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
  identifier: "DescribeOrganizationsAccessInput",
}) as any as S.Schema<DescribeOrganizationsAccessInput>;
export interface DescribePublisherInput {
  PublisherId?: string;
}
export const DescribePublisherInput = S.suspend(() =>
  S.Struct({ PublisherId: S.optional(S.String) }).pipe(
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
  identifier: "DescribePublisherInput",
}) as any as S.Schema<DescribePublisherInput>;
export interface DescribeResourceScanInput {
  ResourceScanId?: string;
}
export const DescribeResourceScanInput = S.suspend(() =>
  S.Struct({ ResourceScanId: S.optional(S.String) }).pipe(
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
  identifier: "DescribeResourceScanInput",
}) as any as S.Schema<DescribeResourceScanInput>;
export interface DescribeStackDriftDetectionStatusInput {
  StackDriftDetectionId?: string;
}
export const DescribeStackDriftDetectionStatusInput = S.suspend(() =>
  S.Struct({ StackDriftDetectionId: S.optional(S.String) }).pipe(
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
  identifier: "DescribeStackDriftDetectionStatusInput",
}) as any as S.Schema<DescribeStackDriftDetectionStatusInput>;
export interface DescribeStackEventsInput {
  StackName?: string;
  NextToken?: string;
}
export const DescribeStackEventsInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
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
  identifier: "DescribeStackEventsInput",
}) as any as S.Schema<DescribeStackEventsInput>;
export interface DescribeStackInstanceInput {
  StackSetName?: string;
  StackInstanceAccount?: string;
  StackInstanceRegion?: string;
  CallAs?: CallAs;
}
export const DescribeStackInstanceInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackInstanceAccount: S.optional(S.String),
    StackInstanceRegion: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "DescribeStackInstanceInput",
}) as any as S.Schema<DescribeStackInstanceInput>;
export interface DescribeStackRefactorInput {
  StackRefactorId?: string;
}
export const DescribeStackRefactorInput = S.suspend(() =>
  S.Struct({ StackRefactorId: S.optional(S.String) }).pipe(
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
  identifier: "DescribeStackRefactorInput",
}) as any as S.Schema<DescribeStackRefactorInput>;
export interface DescribeStackResourceInput {
  StackName?: string;
  LogicalResourceId?: string;
}
export const DescribeStackResourceInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
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
  identifier: "DescribeStackResourceInput",
}) as any as S.Schema<DescribeStackResourceInput>;
export interface DescribeStackResourceDriftsInput {
  StackName?: string;
  StackResourceDriftStatusFilters?: StackResourceDriftStatus[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeStackResourceDriftsInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    StackResourceDriftStatusFilters: S.optional(
      StackResourceDriftStatusFilters,
    ),
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
  identifier: "DescribeStackResourceDriftsInput",
}) as any as S.Schema<DescribeStackResourceDriftsInput>;
export interface DescribeStackResourcesInput {
  StackName?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
}
export const DescribeStackResourcesInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
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
  identifier: "DescribeStackResourcesInput",
}) as any as S.Schema<DescribeStackResourcesInput>;
export interface DescribeStacksInput {
  StackName?: string;
  NextToken?: string;
}
export const DescribeStacksInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
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
  identifier: "DescribeStacksInput",
}) as any as S.Schema<DescribeStacksInput>;
export interface DescribeStackSetInput {
  StackSetName?: string;
  CallAs?: CallAs;
}
export const DescribeStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "DescribeStackSetInput",
}) as any as S.Schema<DescribeStackSetInput>;
export interface DescribeStackSetOperationInput {
  StackSetName?: string;
  OperationId?: string;
  CallAs?: CallAs;
}
export const DescribeStackSetOperationInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    OperationId: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "DescribeStackSetOperationInput",
}) as any as S.Schema<DescribeStackSetOperationInput>;
export interface DescribeTypeInput {
  Type?: RegistryType;
  TypeName?: string;
  Arn?: string;
  VersionId?: string;
  PublisherId?: string;
  PublicVersionNumber?: string;
}
export const DescribeTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    Arn: S.optional(S.String),
    VersionId: S.optional(S.String),
    PublisherId: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
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
  identifier: "DescribeTypeInput",
}) as any as S.Schema<DescribeTypeInput>;
export interface DescribeTypeRegistrationInput {
  RegistrationToken?: string;
}
export const DescribeTypeRegistrationInput = S.suspend(() =>
  S.Struct({ RegistrationToken: S.optional(S.String) }).pipe(
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
  identifier: "DescribeTypeRegistrationInput",
}) as any as S.Schema<DescribeTypeRegistrationInput>;
export interface DetectStackDriftInput {
  StackName?: string;
  LogicalResourceIds?: string[];
}
export const DetectStackDriftInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceIds: S.optional(LogicalResourceIds),
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
  identifier: "DetectStackDriftInput",
}) as any as S.Schema<DetectStackDriftInput>;
export interface DetectStackResourceDriftInput {
  StackName?: string;
  LogicalResourceId?: string;
}
export const DetectStackResourceDriftInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
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
  identifier: "DetectStackResourceDriftInput",
}) as any as S.Schema<DetectStackResourceDriftInput>;
export interface DetectStackSetDriftInput {
  StackSetName?: string;
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: CallAs;
}
export const DetectStackSetDriftInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    CallAs: S.optional(CallAs),
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
  identifier: "DetectStackSetDriftInput",
}) as any as S.Schema<DetectStackSetDriftInput>;
export interface EstimateTemplateCostInput {
  TemplateBody?: string;
  TemplateURL?: string;
  Parameters?: Parameter[];
}
export const EstimateTemplateCostInput = S.suspend(() =>
  S.Struct({
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    Parameters: S.optional(Parameters),
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
  identifier: "EstimateTemplateCostInput",
}) as any as S.Schema<EstimateTemplateCostInput>;
export interface ExecuteChangeSetInput {
  ChangeSetName?: string;
  StackName?: string;
  ClientRequestToken?: string;
  DisableRollback?: boolean;
  RetainExceptOnCreate?: boolean;
}
export const ExecuteChangeSetInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.optional(S.String),
    StackName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    DisableRollback: S.optional(S.Boolean),
    RetainExceptOnCreate: S.optional(S.Boolean),
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
  identifier: "ExecuteChangeSetInput",
}) as any as S.Schema<ExecuteChangeSetInput>;
export interface ExecuteChangeSetOutput {}
export const ExecuteChangeSetOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ExecuteChangeSetOutput",
}) as any as S.Schema<ExecuteChangeSetOutput>;
export interface ExecuteStackRefactorInput {
  StackRefactorId?: string;
}
export const ExecuteStackRefactorInput = S.suspend(() =>
  S.Struct({ StackRefactorId: S.optional(S.String) }).pipe(
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
  identifier: "ExecuteStackRefactorInput",
}) as any as S.Schema<ExecuteStackRefactorInput>;
export interface ExecuteStackRefactorResponse {}
export const ExecuteStackRefactorResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ExecuteStackRefactorResponse",
}) as any as S.Schema<ExecuteStackRefactorResponse>;
export interface GetGeneratedTemplateInput {
  Format?: TemplateFormat;
  GeneratedTemplateName?: string;
}
export const GetGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    Format: S.optional(TemplateFormat),
    GeneratedTemplateName: S.optional(S.String),
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
  identifier: "GetGeneratedTemplateInput",
}) as any as S.Schema<GetGeneratedTemplateInput>;
export interface GetHookResultInput {
  HookResultId?: string;
}
export const GetHookResultInput = S.suspend(() =>
  S.Struct({ HookResultId: S.optional(S.String) }).pipe(
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
  identifier: "GetHookResultInput",
}) as any as S.Schema<GetHookResultInput>;
export interface GetStackPolicyInput {
  StackName?: string;
}
export const GetStackPolicyInput = S.suspend(() =>
  S.Struct({ StackName: S.optional(S.String) }).pipe(
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
  identifier: "GetStackPolicyInput",
}) as any as S.Schema<GetStackPolicyInput>;
export interface GetTemplateInput {
  StackName?: string;
  ChangeSetName?: string;
  TemplateStage?: TemplateStage;
}
export const GetTemplateInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    TemplateStage: S.optional(TemplateStage),
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
  identifier: "GetTemplateInput",
}) as any as S.Schema<GetTemplateInput>;
export interface ImportStacksToStackSetInput {
  StackSetName?: string;
  StackIds?: string[];
  StackIdsUrl?: string;
  OrganizationalUnitIds?: string[];
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: CallAs;
}
export const ImportStacksToStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackIds: S.optional(StackIdList),
    StackIdsUrl: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    CallAs: S.optional(CallAs),
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
  identifier: "ImportStacksToStackSetInput",
}) as any as S.Schema<ImportStacksToStackSetInput>;
export interface ListChangeSetsInput {
  StackName?: string;
  NextToken?: string;
}
export const ListChangeSetsInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
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
  identifier: "ListChangeSetsInput",
}) as any as S.Schema<ListChangeSetsInput>;
export interface ListExportsInput {
  NextToken?: string;
}
export const ListExportsInput = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
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
  identifier: "ListExportsInput",
}) as any as S.Schema<ListExportsInput>;
export interface ListGeneratedTemplatesInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListGeneratedTemplatesInput = S.suspend(() =>
  S.Struct({
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
  identifier: "ListGeneratedTemplatesInput",
}) as any as S.Schema<ListGeneratedTemplatesInput>;
export interface ListHookResultsInput {
  TargetType?: ListHookResultsTargetType;
  TargetId?: string;
  TypeArn?: string;
  Status?: HookStatus;
  NextToken?: string;
}
export const ListHookResultsInput = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(ListHookResultsTargetType),
    TargetId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    Status: S.optional(HookStatus),
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
  identifier: "ListHookResultsInput",
}) as any as S.Schema<ListHookResultsInput>;
export interface ListImportsInput {
  ExportName?: string;
  NextToken?: string;
}
export const ListImportsInput = S.suspend(() =>
  S.Struct({
    ExportName: S.optional(S.String),
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
  identifier: "ListImportsInput",
}) as any as S.Schema<ListImportsInput>;
export interface ListResourceScanResourcesInput {
  ResourceScanId?: string;
  ResourceIdentifier?: string;
  ResourceTypePrefix?: string;
  TagKey?: string;
  TagValue?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceScanResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceTypePrefix: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
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
  identifier: "ListResourceScanResourcesInput",
}) as any as S.Schema<ListResourceScanResourcesInput>;
export interface ListResourceScansInput {
  NextToken?: string;
  MaxResults?: number;
  ScanTypeFilter?: ScanType;
}
export const ListResourceScansInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ScanTypeFilter: S.optional(ScanType),
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
  identifier: "ListResourceScansInput",
}) as any as S.Schema<ListResourceScansInput>;
export interface ListStackInstanceResourceDriftsInput {
  StackSetName?: string;
  NextToken?: string;
  MaxResults?: number;
  StackInstanceResourceDriftStatuses?: StackResourceDriftStatus[];
  StackInstanceAccount?: string;
  StackInstanceRegion?: string;
  OperationId?: string;
  CallAs?: CallAs;
}
export const ListStackInstanceResourceDriftsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StackInstanceResourceDriftStatuses: S.optional(
      StackResourceDriftStatusFilters,
    ),
    StackInstanceAccount: S.optional(S.String),
    StackInstanceRegion: S.optional(S.String),
    OperationId: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "ListStackInstanceResourceDriftsInput",
}) as any as S.Schema<ListStackInstanceResourceDriftsInput>;
export interface ListStackRefactorActionsInput {
  StackRefactorId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListStackRefactorActionsInput = S.suspend(() =>
  S.Struct({
    StackRefactorId: S.optional(S.String),
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
  identifier: "ListStackRefactorActionsInput",
}) as any as S.Schema<ListStackRefactorActionsInput>;
export interface ListStackRefactorsInput {
  ExecutionStatusFilter?: StackRefactorExecutionStatus[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListStackRefactorsInput = S.suspend(() =>
  S.Struct({
    ExecutionStatusFilter: S.optional(StackRefactorExecutionStatusFilter),
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
  identifier: "ListStackRefactorsInput",
}) as any as S.Schema<ListStackRefactorsInput>;
export interface ListStackResourcesInput {
  StackName?: string;
  NextToken?: string;
}
export const ListStackResourcesInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
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
  identifier: "ListStackResourcesInput",
}) as any as S.Schema<ListStackResourcesInput>;
export interface ListStacksInput {
  NextToken?: string;
  StackStatusFilter?: StackStatus[];
}
export const ListStacksInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    StackStatusFilter: S.optional(StackStatusFilter),
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
  identifier: "ListStacksInput",
}) as any as S.Schema<ListStacksInput>;
export interface ListStackSetAutoDeploymentTargetsInput {
  StackSetName?: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: CallAs;
}
export const ListStackSetAutoDeploymentTargetsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(CallAs),
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
  identifier: "ListStackSetAutoDeploymentTargetsInput",
}) as any as S.Schema<ListStackSetAutoDeploymentTargetsInput>;
export interface ListStackSetOperationsInput {
  StackSetName?: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: CallAs;
}
export const ListStackSetOperationsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(CallAs),
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
  identifier: "ListStackSetOperationsInput",
}) as any as S.Schema<ListStackSetOperationsInput>;
export interface ListStackSetsInput {
  NextToken?: string;
  MaxResults?: number;
  Status?: StackSetStatus;
  CallAs?: CallAs;
}
export const ListStackSetsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(StackSetStatus),
    CallAs: S.optional(CallAs),
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
  identifier: "ListStackSetsInput",
}) as any as S.Schema<ListStackSetsInput>;
export interface ListTypeRegistrationsInput {
  Type?: RegistryType;
  TypeName?: string;
  TypeArn?: string;
  RegistrationStatusFilter?: RegistrationStatus;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTypeRegistrationsInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    TypeArn: S.optional(S.String),
    RegistrationStatusFilter: S.optional(RegistrationStatus),
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
  identifier: "ListTypeRegistrationsInput",
}) as any as S.Schema<ListTypeRegistrationsInput>;
export interface ListTypeVersionsInput {
  Type?: RegistryType;
  TypeName?: string;
  Arn?: string;
  MaxResults?: number;
  NextToken?: string;
  DeprecatedStatus?: DeprecatedStatus;
  PublisherId?: string;
}
export const ListTypeVersionsInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    Arn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    DeprecatedStatus: S.optional(DeprecatedStatus),
    PublisherId: S.optional(S.String),
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
  identifier: "ListTypeVersionsInput",
}) as any as S.Schema<ListTypeVersionsInput>;
export interface PublishTypeInput {
  Type?: ThirdPartyType;
  Arn?: string;
  TypeName?: string;
  PublicVersionNumber?: string;
}
export const PublishTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(ThirdPartyType),
    Arn: S.optional(S.String),
    TypeName: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
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
  identifier: "PublishTypeInput",
}) as any as S.Schema<PublishTypeInput>;
export interface RecordHandlerProgressInput {
  BearerToken?: string;
  OperationStatus?: OperationStatus;
  CurrentOperationStatus?: OperationStatus;
  StatusMessage?: string;
  ErrorCode?: HandlerErrorCode;
  ResourceModel?: string;
  ClientRequestToken?: string;
}
export const RecordHandlerProgressInput = S.suspend(() =>
  S.Struct({
    BearerToken: S.optional(S.String),
    OperationStatus: S.optional(OperationStatus),
    CurrentOperationStatus: S.optional(OperationStatus),
    StatusMessage: S.optional(S.String),
    ErrorCode: S.optional(HandlerErrorCode),
    ResourceModel: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
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
  identifier: "RecordHandlerProgressInput",
}) as any as S.Schema<RecordHandlerProgressInput>;
export interface RecordHandlerProgressOutput {}
export const RecordHandlerProgressOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RecordHandlerProgressOutput",
}) as any as S.Schema<RecordHandlerProgressOutput>;
export interface RegisterPublisherInput {
  AcceptTermsAndConditions?: boolean;
  ConnectionArn?: string;
}
export const RegisterPublisherInput = S.suspend(() =>
  S.Struct({
    AcceptTermsAndConditions: S.optional(S.Boolean),
    ConnectionArn: S.optional(S.String),
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
  identifier: "RegisterPublisherInput",
}) as any as S.Schema<RegisterPublisherInput>;
export interface LoggingConfig {
  LogRoleArn?: string;
  LogGroupName?: string;
}
export const LoggingConfig = S.suspend(() =>
  S.Struct({
    LogRoleArn: S.optional(S.String),
    LogGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "LoggingConfig",
}) as any as S.Schema<LoggingConfig>;
export interface RegisterTypeInput {
  Type?: RegistryType;
  TypeName?: string;
  SchemaHandlerPackage?: string;
  LoggingConfig?: LoggingConfig;
  ExecutionRoleArn?: string;
  ClientRequestToken?: string;
}
export const RegisterTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    SchemaHandlerPackage: S.optional(S.String),
    LoggingConfig: S.optional(LoggingConfig),
    ExecutionRoleArn: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
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
  identifier: "RegisterTypeInput",
}) as any as S.Schema<RegisterTypeInput>;
export interface RollbackStackInput {
  StackName?: string;
  RoleARN?: string;
  ClientRequestToken?: string;
  RetainExceptOnCreate?: boolean;
}
export const RollbackStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    RoleARN: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    RetainExceptOnCreate: S.optional(S.Boolean),
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
  identifier: "RollbackStackInput",
}) as any as S.Schema<RollbackStackInput>;
export interface SetStackPolicyInput {
  StackName?: string;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
}
export const SetStackPolicyInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    StackPolicyBody: S.optional(S.String),
    StackPolicyURL: S.optional(S.String),
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
  identifier: "SetStackPolicyInput",
}) as any as S.Schema<SetStackPolicyInput>;
export interface SetStackPolicyResponse {}
export const SetStackPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetStackPolicyResponse",
}) as any as S.Schema<SetStackPolicyResponse>;
export interface SetTypeConfigurationInput {
  TypeArn?: string;
  Configuration?: string;
  ConfigurationAlias?: string;
  TypeName?: string;
  Type?: ThirdPartyType;
}
export const SetTypeConfigurationInput = S.suspend(() =>
  S.Struct({
    TypeArn: S.optional(S.String),
    Configuration: S.optional(S.String),
    ConfigurationAlias: S.optional(S.String),
    TypeName: S.optional(S.String),
    Type: S.optional(ThirdPartyType),
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
  identifier: "SetTypeConfigurationInput",
}) as any as S.Schema<SetTypeConfigurationInput>;
export interface SetTypeDefaultVersionInput {
  Arn?: string;
  Type?: RegistryType;
  TypeName?: string;
  VersionId?: string;
}
export const SetTypeDefaultVersionInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
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
  identifier: "SetTypeDefaultVersionInput",
}) as any as S.Schema<SetTypeDefaultVersionInput>;
export interface SetTypeDefaultVersionOutput {}
export const SetTypeDefaultVersionOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetTypeDefaultVersionOutput",
}) as any as S.Schema<SetTypeDefaultVersionOutput>;
export interface SignalResourceInput {
  StackName?: string;
  LogicalResourceId?: string;
  UniqueId?: string;
  Status?: ResourceSignalStatus;
}
export const SignalResourceInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    UniqueId: S.optional(S.String),
    Status: S.optional(ResourceSignalStatus),
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
  identifier: "SignalResourceInput",
}) as any as S.Schema<SignalResourceInput>;
export interface SignalResourceResponse {}
export const SignalResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SignalResourceResponse",
}) as any as S.Schema<SignalResourceResponse>;
export interface StopStackSetOperationInput {
  StackSetName?: string;
  OperationId?: string;
  CallAs?: CallAs;
}
export const StopStackSetOperationInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    OperationId: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "StopStackSetOperationInput",
}) as any as S.Schema<StopStackSetOperationInput>;
export interface StopStackSetOperationOutput {}
export const StopStackSetOperationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopStackSetOperationOutput",
}) as any as S.Schema<StopStackSetOperationOutput>;
export interface TestTypeInput {
  Arn?: string;
  Type?: ThirdPartyType;
  TypeName?: string;
  VersionId?: string;
  LogDeliveryBucket?: string;
}
export const TestTypeInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(ThirdPartyType),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
    LogDeliveryBucket: S.optional(S.String),
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
  identifier: "TestTypeInput",
}) as any as S.Schema<TestTypeInput>;
export type ResourceIdentifierProperties = {
  [key: string]: string | undefined;
};
export const ResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ResourceDefinition {
  ResourceType?: string;
  LogicalResourceId?: string;
  ResourceIdentifier?: { [key: string]: string | undefined };
}
export const ResourceDefinition = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(ResourceIdentifierProperties),
  }),
).annotations({
  identifier: "ResourceDefinition",
}) as any as S.Schema<ResourceDefinition>;
export type ResourceDefinitions = ResourceDefinition[];
export const ResourceDefinitions = S.Array(ResourceDefinition);
export type GeneratedTemplateDeletionPolicy =
  | "DELETE"
  | "RETAIN"
  | (string & {});
export const GeneratedTemplateDeletionPolicy = S.String;
export type GeneratedTemplateUpdateReplacePolicy =
  | "DELETE"
  | "RETAIN"
  | (string & {});
export const GeneratedTemplateUpdateReplacePolicy = S.String;
export interface TemplateConfiguration {
  DeletionPolicy?: GeneratedTemplateDeletionPolicy;
  UpdateReplacePolicy?: GeneratedTemplateUpdateReplacePolicy;
}
export const TemplateConfiguration = S.suspend(() =>
  S.Struct({
    DeletionPolicy: S.optional(GeneratedTemplateDeletionPolicy),
    UpdateReplacePolicy: S.optional(GeneratedTemplateUpdateReplacePolicy),
  }),
).annotations({
  identifier: "TemplateConfiguration",
}) as any as S.Schema<TemplateConfiguration>;
export interface UpdateGeneratedTemplateInput {
  GeneratedTemplateName?: string;
  NewGeneratedTemplateName?: string;
  AddResources?: ResourceDefinition[];
  RemoveResources?: string[];
  RefreshAllResources?: boolean;
  TemplateConfiguration?: TemplateConfiguration;
}
export const UpdateGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    GeneratedTemplateName: S.optional(S.String),
    NewGeneratedTemplateName: S.optional(S.String),
    AddResources: S.optional(ResourceDefinitions),
    RemoveResources: S.optional(JazzLogicalResourceIds),
    RefreshAllResources: S.optional(S.Boolean),
    TemplateConfiguration: S.optional(TemplateConfiguration),
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
  identifier: "UpdateGeneratedTemplateInput",
}) as any as S.Schema<UpdateGeneratedTemplateInput>;
export interface UpdateStackInput {
  StackName?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  StackPolicyDuringUpdateBody?: string;
  StackPolicyDuringUpdateURL?: string;
  Parameters?: Parameter[];
  Capabilities?: Capability[];
  ResourceTypes?: string[];
  RoleARN?: string;
  RollbackConfiguration?: RollbackConfiguration;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
  NotificationARNs?: string[];
  Tags?: Tag[];
  DisableRollback?: boolean;
  ClientRequestToken?: string;
  RetainExceptOnCreate?: boolean;
}
export const UpdateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    UsePreviousTemplate: S.optional(S.Boolean),
    StackPolicyDuringUpdateBody: S.optional(S.String),
    StackPolicyDuringUpdateURL: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    ResourceTypes: S.optional(ResourceTypes),
    RoleARN: S.optional(S.String),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    StackPolicyBody: S.optional(S.String),
    StackPolicyURL: S.optional(S.String),
    NotificationARNs: S.optional(NotificationARNs),
    Tags: S.optional(Tags),
    DisableRollback: S.optional(S.Boolean),
    ClientRequestToken: S.optional(S.String),
    RetainExceptOnCreate: S.optional(S.Boolean),
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
  identifier: "UpdateStackInput",
}) as any as S.Schema<UpdateStackInput>;
export interface UpdateStackInstancesInput {
  StackSetName?: string;
  Accounts?: string[];
  DeploymentTargets?: DeploymentTargets;
  Regions?: string[];
  ParameterOverrides?: Parameter[];
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: CallAs;
}
export const UpdateStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: S.optional(RegionList),
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    CallAs: S.optional(CallAs),
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
  identifier: "UpdateStackInstancesInput",
}) as any as S.Schema<UpdateStackInstancesInput>;
export type StackSetARNList = string[];
export const StackSetARNList = S.Array(S.String);
export interface AutoDeployment {
  Enabled?: boolean;
  RetainStacksOnAccountRemoval?: boolean;
  DependsOn?: string[];
}
export const AutoDeployment = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    RetainStacksOnAccountRemoval: S.optional(S.Boolean),
    DependsOn: S.optional(StackSetARNList),
  }),
).annotations({
  identifier: "AutoDeployment",
}) as any as S.Schema<AutoDeployment>;
export interface ManagedExecution {
  Active?: boolean;
}
export const ManagedExecution = S.suspend(() =>
  S.Struct({ Active: S.optional(S.Boolean) }),
).annotations({
  identifier: "ManagedExecution",
}) as any as S.Schema<ManagedExecution>;
export interface UpdateStackSetInput {
  StackSetName?: string;
  Description?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  Parameters?: Parameter[];
  Capabilities?: Capability[];
  Tags?: Tag[];
  OperationPreferences?: StackSetOperationPreferences;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  DeploymentTargets?: DeploymentTargets;
  PermissionModel?: PermissionModels;
  AutoDeployment?: AutoDeployment;
  OperationId?: string;
  Accounts?: string[];
  Regions?: string[];
  CallAs?: CallAs;
  ManagedExecution?: ManagedExecution;
}
export const UpdateStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    Description: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    UsePreviousTemplate: S.optional(S.Boolean),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    DeploymentTargets: S.optional(DeploymentTargets),
    PermissionModel: S.optional(PermissionModels),
    AutoDeployment: S.optional(AutoDeployment),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    Accounts: S.optional(AccountList),
    Regions: S.optional(RegionList),
    CallAs: S.optional(CallAs),
    ManagedExecution: S.optional(ManagedExecution),
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
  identifier: "UpdateStackSetInput",
}) as any as S.Schema<UpdateStackSetInput>;
export interface UpdateTerminationProtectionInput {
  EnableTerminationProtection?: boolean;
  StackName?: string;
}
export const UpdateTerminationProtectionInput = S.suspend(() =>
  S.Struct({
    EnableTerminationProtection: S.optional(S.Boolean),
    StackName: S.optional(S.String),
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
  identifier: "UpdateTerminationProtectionInput",
}) as any as S.Schema<UpdateTerminationProtectionInput>;
export interface ValidateTemplateInput {
  TemplateBody?: string;
  TemplateURL?: string;
}
export const ValidateTemplateInput = S.suspend(() =>
  S.Struct({
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
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
  identifier: "ValidateTemplateInput",
}) as any as S.Schema<ValidateTemplateInput>;
export type StackInstanceFilterName =
  | "DETAILED_STATUS"
  | "LAST_OPERATION_ID"
  | "DRIFT_STATUS"
  | (string & {});
export const StackInstanceFilterName = S.String;
export type OperationResultFilterName =
  | "OPERATION_RESULT_STATUS"
  | (string & {});
export const OperationResultFilterName = S.String;
export type Category =
  | "REGISTERED"
  | "ACTIVATED"
  | "THIRD_PARTY"
  | "AWS_TYPES"
  | (string & {});
export const Category = S.String;
export type ResourceTypeFilters = string[];
export const ResourceTypeFilters = S.Array(S.String);
export interface TypeConfigurationIdentifier {
  TypeArn?: string;
  TypeConfigurationAlias?: string;
  TypeConfigurationArn?: string;
  Type?: ThirdPartyType;
  TypeName?: string;
}
export const TypeConfigurationIdentifier = S.suspend(() =>
  S.Struct({
    TypeArn: S.optional(S.String),
    TypeConfigurationAlias: S.optional(S.String),
    TypeConfigurationArn: S.optional(S.String),
    Type: S.optional(ThirdPartyType),
    TypeName: S.optional(S.String),
  }),
).annotations({
  identifier: "TypeConfigurationIdentifier",
}) as any as S.Schema<TypeConfigurationIdentifier>;
export type TypeConfigurationIdentifiers = TypeConfigurationIdentifier[];
export const TypeConfigurationIdentifiers = S.Array(
  TypeConfigurationIdentifier,
);
export interface StackDefinition {
  StackName?: string;
  TemplateBody?: string;
  TemplateURL?: string;
}
export const StackDefinition = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
  }),
).annotations({
  identifier: "StackDefinition",
}) as any as S.Schema<StackDefinition>;
export type StackDefinitions = StackDefinition[];
export const StackDefinitions = S.Array(StackDefinition);
export type ExecutionStatus =
  | "UNAVAILABLE"
  | "AVAILABLE"
  | "EXECUTE_IN_PROGRESS"
  | "EXECUTE_COMPLETE"
  | "EXECUTE_FAILED"
  | "OBSOLETE"
  | (string & {});
export const ExecutionStatus = S.String;
export type ChangeSetStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "DELETE_PENDING"
  | "DELETE_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED"
  | "FAILED"
  | (string & {});
export const ChangeSetStatus = S.String;
export type StackDriftStatus =
  | "DRIFTED"
  | "IN_SYNC"
  | "UNKNOWN"
  | "NOT_CHECKED"
  | (string & {});
export const StackDriftStatus = S.String;
export type ChangeSetHooksStatus =
  | "PLANNING"
  | "PLANNED"
  | "UNAVAILABLE"
  | (string & {});
export const ChangeSetHooksStatus = S.String;
export interface EventFilter {
  FailedEvents?: boolean;
}
export const EventFilter = S.suspend(() =>
  S.Struct({ FailedEvents: S.optional(S.Boolean) }),
).annotations({ identifier: "EventFilter" }) as any as S.Schema<EventFilter>;
export type GeneratedTemplateStatus =
  | "CREATE_PENDING"
  | "UPDATE_PENDING"
  | "DELETE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "UPDATE_IN_PROGRESS"
  | "DELETE_IN_PROGRESS"
  | "FAILED"
  | "COMPLETE"
  | (string & {});
export const GeneratedTemplateStatus = S.String;
export type OrganizationStatus =
  | "ENABLED"
  | "DISABLED"
  | "DISABLED_PERMANENTLY"
  | (string & {});
export const OrganizationStatus = S.String;
export type PublisherStatus = "VERIFIED" | "UNVERIFIED" | (string & {});
export const PublisherStatus = S.String;
export type IdentityProvider =
  | "AWS_Marketplace"
  | "GitHub"
  | "Bitbucket"
  | (string & {});
export const IdentityProvider = S.String;
export type ResourceScanStatus =
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETE"
  | "EXPIRED"
  | (string & {});
export const ResourceScanStatus = S.String;
export type StackDriftDetectionStatus =
  | "DETECTION_IN_PROGRESS"
  | "DETECTION_FAILED"
  | "DETECTION_COMPLETE"
  | (string & {});
export const StackDriftDetectionStatus = S.String;
export type StackIds = string[];
export const StackIds = S.Array(S.String);
export type StackRefactorStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED"
  | (string & {});
export const StackRefactorStatus = S.String;
export type TypeTestsStatus =
  | "PASSED"
  | "FAILED"
  | "IN_PROGRESS"
  | "NOT_TESTED"
  | (string & {});
export const TypeTestsStatus = S.String;
export type HookInvocationPoint = "PRE_PROVISION" | (string & {});
export const HookInvocationPoint = S.String;
export type HookFailureMode = "FAIL" | "WARN" | (string & {});
export const HookFailureMode = S.String;
export type StageList = TemplateStage[];
export const StageList = S.Array(TemplateStage);
export interface TemplateSummaryConfig {
  TreatUnrecognizedResourceTypesAsWarnings?: boolean;
}
export const TemplateSummaryConfig = S.suspend(() =>
  S.Struct({ TreatUnrecognizedResourceTypesAsWarnings: S.optional(S.Boolean) }),
).annotations({
  identifier: "TemplateSummaryConfig",
}) as any as S.Schema<TemplateSummaryConfig>;
export type Imports = string[];
export const Imports = S.Array(S.String);
export interface StackInstanceFilter {
  Name?: StackInstanceFilterName;
  Values?: string;
}
export const StackInstanceFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(StackInstanceFilterName),
    Values: S.optional(S.String),
  }),
).annotations({
  identifier: "StackInstanceFilter",
}) as any as S.Schema<StackInstanceFilter>;
export type StackInstanceFilters = StackInstanceFilter[];
export const StackInstanceFilters = S.Array(StackInstanceFilter);
export interface OperationResultFilter {
  Name?: OperationResultFilterName;
  Values?: string;
}
export const OperationResultFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(OperationResultFilterName),
    Values: S.optional(S.String),
  }),
).annotations({
  identifier: "OperationResultFilter",
}) as any as S.Schema<OperationResultFilter>;
export type OperationResultFilters = OperationResultFilter[];
export const OperationResultFilters = S.Array(OperationResultFilter);
export type RegistrationTokenList = string[];
export const RegistrationTokenList = S.Array(S.String);
export interface TypeFilters {
  Category?: Category;
  PublisherId?: string;
  TypeNamePrefix?: string;
}
export const TypeFilters = S.suspend(() =>
  S.Struct({
    Category: S.optional(Category),
    PublisherId: S.optional(S.String),
    TypeNamePrefix: S.optional(S.String),
  }),
).annotations({ identifier: "TypeFilters" }) as any as S.Schema<TypeFilters>;
export interface ScanFilter {
  Types?: string[];
}
export const ScanFilter = S.suspend(() =>
  S.Struct({ Types: S.optional(ResourceTypeFilters) }),
).annotations({ identifier: "ScanFilter" }) as any as S.Schema<ScanFilter>;
export type ScanFilters = ScanFilter[];
export const ScanFilters = S.Array(ScanFilter);
export type TransformsList = string[];
export const TransformsList = S.Array(S.String);
export interface ActivateTypeInput {
  Type?: ThirdPartyType;
  PublicTypeArn?: string;
  PublisherId?: string;
  TypeName?: string;
  TypeNameAlias?: string;
  AutoUpdate?: boolean;
  LoggingConfig?: LoggingConfig;
  ExecutionRoleArn?: string;
  VersionBump?: VersionBump;
  MajorVersion?: number;
}
export const ActivateTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(ThirdPartyType),
    PublicTypeArn: S.optional(S.String),
    PublisherId: S.optional(S.String),
    TypeName: S.optional(S.String),
    TypeNameAlias: S.optional(S.String),
    AutoUpdate: S.optional(S.Boolean),
    LoggingConfig: S.optional(LoggingConfig),
    ExecutionRoleArn: S.optional(S.String),
    VersionBump: S.optional(VersionBump),
    MajorVersion: S.optional(S.Number),
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
  identifier: "ActivateTypeInput",
}) as any as S.Schema<ActivateTypeInput>;
export interface BatchDescribeTypeConfigurationsInput {
  TypeConfigurationIdentifiers?: TypeConfigurationIdentifier[];
}
export const BatchDescribeTypeConfigurationsInput = S.suspend(() =>
  S.Struct({
    TypeConfigurationIdentifiers: S.optional(TypeConfigurationIdentifiers),
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
  identifier: "BatchDescribeTypeConfigurationsInput",
}) as any as S.Schema<BatchDescribeTypeConfigurationsInput>;
export interface CreateGeneratedTemplateInput {
  Resources?: ResourceDefinition[];
  GeneratedTemplateName?: string;
  StackName?: string;
  TemplateConfiguration?: TemplateConfiguration;
}
export const CreateGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ResourceDefinitions),
    GeneratedTemplateName: S.optional(S.String),
    StackName: S.optional(S.String),
    TemplateConfiguration: S.optional(TemplateConfiguration),
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
  identifier: "CreateGeneratedTemplateInput",
}) as any as S.Schema<CreateGeneratedTemplateInput>;
export interface CreateStackOutput {
  StackId?: string;
  OperationId?: string;
}
export const CreateStackOutput = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateStackOutput",
}) as any as S.Schema<CreateStackOutput>;
export interface CreateStackInstancesInput {
  StackSetName?: string;
  Accounts?: string[];
  DeploymentTargets?: DeploymentTargets;
  Regions?: string[];
  ParameterOverrides?: Parameter[];
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: CallAs;
}
export const CreateStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: S.optional(RegionList),
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String).pipe(T.IdempotencyToken()),
    CallAs: S.optional(CallAs),
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
  identifier: "CreateStackInstancesInput",
}) as any as S.Schema<CreateStackInstancesInput>;
export interface CreateStackSetInput {
  StackSetName?: string;
  Description?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  StackId?: string;
  Parameters?: Parameter[];
  Capabilities?: Capability[];
  Tags?: Tag[];
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  PermissionModel?: PermissionModels;
  AutoDeployment?: AutoDeployment;
  CallAs?: CallAs;
  ClientRequestToken?: string;
  ManagedExecution?: ManagedExecution;
}
export const CreateStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    Description: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    StackId: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    PermissionModel: S.optional(PermissionModels),
    AutoDeployment: S.optional(AutoDeployment),
    CallAs: S.optional(CallAs),
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ManagedExecution: S.optional(ManagedExecution),
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
  identifier: "CreateStackSetInput",
}) as any as S.Schema<CreateStackSetInput>;
export interface DeleteStackInstancesOutput {
  OperationId?: string;
}
export const DeleteStackInstancesOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteStackInstancesOutput",
}) as any as S.Schema<DeleteStackInstancesOutput>;
export interface DescribeEventsInput {
  StackName?: string;
  ChangeSetName?: string;
  OperationId?: string;
  Filters?: EventFilter;
  NextToken?: string;
}
export const DescribeEventsInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    OperationId: S.optional(S.String),
    Filters: S.optional(EventFilter),
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
  identifier: "DescribeEventsInput",
}) as any as S.Schema<DescribeEventsInput>;
export interface DescribeOrganizationsAccessOutput {
  Status?: OrganizationStatus;
}
export const DescribeOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({ Status: S.optional(OrganizationStatus) }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationsAccessOutput",
}) as any as S.Schema<DescribeOrganizationsAccessOutput>;
export interface DescribePublisherOutput {
  PublisherId?: string;
  PublisherStatus?: PublisherStatus;
  IdentityProvider?: IdentityProvider;
  PublisherProfile?: string;
}
export const DescribePublisherOutput = S.suspend(() =>
  S.Struct({
    PublisherId: S.optional(S.String),
    PublisherStatus: S.optional(PublisherStatus),
    IdentityProvider: S.optional(IdentityProvider),
    PublisherProfile: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePublisherOutput",
}) as any as S.Schema<DescribePublisherOutput>;
export interface DescribeResourceScanOutput {
  ResourceScanId?: string;
  Status?: ResourceScanStatus;
  StatusReason?: string;
  StartTime?: Date;
  EndTime?: Date;
  PercentageCompleted?: number;
  ResourceTypes?: string[];
  ResourcesScanned?: number;
  ResourcesRead?: number;
  ScanFilters?: ScanFilter[];
}
export const DescribeResourceScanOutput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    Status: S.optional(ResourceScanStatus),
    StatusReason: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PercentageCompleted: S.optional(S.Number),
    ResourceTypes: S.optional(ResourceTypes),
    ResourcesScanned: S.optional(S.Number),
    ResourcesRead: S.optional(S.Number),
    ScanFilters: S.optional(ScanFilters),
  }).pipe(ns),
).annotations({
  identifier: "DescribeResourceScanOutput",
}) as any as S.Schema<DescribeResourceScanOutput>;
export interface DescribeStackDriftDetectionStatusOutput {
  StackId: string;
  StackDriftDetectionId: string;
  StackDriftStatus?: StackDriftStatus;
  DetectionStatus: StackDriftDetectionStatus;
  DetectionStatusReason?: string;
  DriftedStackResourceCount?: number;
  Timestamp: Date;
}
export const DescribeStackDriftDetectionStatusOutput = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackDriftDetectionId: S.optional(S.String),
    StackDriftStatus: S.optional(StackDriftStatus),
    DetectionStatus: S.optional(StackDriftDetectionStatus),
    DetectionStatusReason: S.optional(S.String),
    DriftedStackResourceCount: S.optional(S.Number),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackDriftDetectionStatusOutput",
}) as any as S.Schema<DescribeStackDriftDetectionStatusOutput>;
export interface DescribeStackRefactorOutput {
  Description?: string;
  StackRefactorId?: string;
  StackIds?: string[];
  ExecutionStatus?: StackRefactorExecutionStatus;
  ExecutionStatusReason?: string;
  Status?: StackRefactorStatus;
  StatusReason?: string;
}
export const DescribeStackRefactorOutput = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    StackRefactorId: S.optional(S.String),
    StackIds: S.optional(StackIds),
    ExecutionStatus: S.optional(StackRefactorExecutionStatus),
    ExecutionStatusReason: S.optional(S.String),
    Status: S.optional(StackRefactorStatus),
    StatusReason: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackRefactorOutput",
}) as any as S.Schema<DescribeStackRefactorOutput>;
export interface DescribeTypeRegistrationOutput {
  ProgressStatus?: RegistrationStatus;
  Description?: string;
  TypeArn?: string;
  TypeVersionArn?: string;
}
export const DescribeTypeRegistrationOutput = S.suspend(() =>
  S.Struct({
    ProgressStatus: S.optional(RegistrationStatus),
    Description: S.optional(S.String),
    TypeArn: S.optional(S.String),
    TypeVersionArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTypeRegistrationOutput",
}) as any as S.Schema<DescribeTypeRegistrationOutput>;
export interface DetectStackDriftOutput {
  StackDriftDetectionId: string;
}
export const DetectStackDriftOutput = S.suspend(() =>
  S.Struct({ StackDriftDetectionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DetectStackDriftOutput",
}) as any as S.Schema<DetectStackDriftOutput>;
export interface PhysicalResourceIdContextKeyValuePair {
  Key?: string;
  Value?: string;
}
export const PhysicalResourceIdContextKeyValuePair = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "PhysicalResourceIdContextKeyValuePair",
}) as any as S.Schema<PhysicalResourceIdContextKeyValuePair>;
export type PhysicalResourceIdContext = PhysicalResourceIdContextKeyValuePair[];
export const PhysicalResourceIdContext = S.Array(
  PhysicalResourceIdContextKeyValuePair,
);
export type DifferenceType = "ADD" | "REMOVE" | "NOT_EQUAL" | (string & {});
export const DifferenceType = S.String;
export interface PropertyDifference {
  PropertyPath?: string;
  ExpectedValue?: string;
  ActualValue?: string;
  DifferenceType?: DifferenceType;
}
export const PropertyDifference = S.suspend(() =>
  S.Struct({
    PropertyPath: S.optional(S.String),
    ExpectedValue: S.optional(S.String),
    ActualValue: S.optional(S.String),
    DifferenceType: S.optional(DifferenceType),
  }),
).annotations({
  identifier: "PropertyDifference",
}) as any as S.Schema<PropertyDifference>;
export type PropertyDifferences = PropertyDifference[];
export const PropertyDifferences = S.Array(PropertyDifference);
export interface ModuleInfo {
  TypeHierarchy?: string;
  LogicalIdHierarchy?: string;
}
export const ModuleInfo = S.suspend(() =>
  S.Struct({
    TypeHierarchy: S.optional(S.String),
    LogicalIdHierarchy: S.optional(S.String),
  }),
).annotations({ identifier: "ModuleInfo" }) as any as S.Schema<ModuleInfo>;
export interface StackResourceDrift {
  StackId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  PhysicalResourceIdContext?: PhysicalResourceIdContextKeyValuePair[];
  ResourceType?: string;
  ExpectedProperties?: string;
  ActualProperties?: string;
  PropertyDifferences?: PropertyDifference[];
  StackResourceDriftStatus?: StackResourceDriftStatus;
  Timestamp?: Date;
  ModuleInfo?: ModuleInfo;
  DriftStatusReason?: string;
}
export const StackResourceDrift = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    PhysicalResourceIdContext: S.optional(PhysicalResourceIdContext),
    ResourceType: S.optional(S.String),
    ExpectedProperties: S.optional(S.String),
    ActualProperties: S.optional(S.String),
    PropertyDifferences: S.optional(PropertyDifferences),
    StackResourceDriftStatus: S.optional(StackResourceDriftStatus),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModuleInfo: S.optional(ModuleInfo),
    DriftStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StackResourceDrift",
}) as any as S.Schema<StackResourceDrift>;
export interface DetectStackResourceDriftOutput {
  StackResourceDrift: StackResourceDrift & {
    StackId: StackId;
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    StackResourceDriftStatus: StackResourceDriftStatus;
    Timestamp: Date;
    PhysicalResourceIdContext: (PhysicalResourceIdContextKeyValuePair & {
      Key: Key;
      Value: Value;
    })[];
    PropertyDifferences: (PropertyDifference & {
      PropertyPath: PropertyPath;
      ExpectedValue: PropertyValue;
      ActualValue: PropertyValue;
      DifferenceType: DifferenceType;
    })[];
  };
}
export const DetectStackResourceDriftOutput = S.suspend(() =>
  S.Struct({ StackResourceDrift: S.optional(StackResourceDrift) }).pipe(ns),
).annotations({
  identifier: "DetectStackResourceDriftOutput",
}) as any as S.Schema<DetectStackResourceDriftOutput>;
export interface DetectStackSetDriftOutput {
  OperationId?: string;
}
export const DetectStackSetDriftOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DetectStackSetDriftOutput",
}) as any as S.Schema<DetectStackSetDriftOutput>;
export interface EstimateTemplateCostOutput {
  Url?: string;
}
export const EstimateTemplateCostOutput = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "EstimateTemplateCostOutput",
}) as any as S.Schema<EstimateTemplateCostOutput>;
export interface GetGeneratedTemplateOutput {
  Status?: GeneratedTemplateStatus;
  TemplateBody?: string;
}
export const GetGeneratedTemplateOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(GeneratedTemplateStatus),
    TemplateBody: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetGeneratedTemplateOutput",
}) as any as S.Schema<GetGeneratedTemplateOutput>;
export interface GetStackPolicyOutput {
  StackPolicyBody?: string;
}
export const GetStackPolicyOutput = S.suspend(() =>
  S.Struct({ StackPolicyBody: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetStackPolicyOutput",
}) as any as S.Schema<GetStackPolicyOutput>;
export interface GetTemplateOutput {
  TemplateBody?: string;
  StagesAvailable?: TemplateStage[];
}
export const GetTemplateOutput = S.suspend(() =>
  S.Struct({
    TemplateBody: S.optional(S.String),
    StagesAvailable: S.optional(StageList),
  }).pipe(ns),
).annotations({
  identifier: "GetTemplateOutput",
}) as any as S.Schema<GetTemplateOutput>;
export interface GetTemplateSummaryInput {
  TemplateBody?: string;
  TemplateURL?: string;
  StackName?: string;
  StackSetName?: string;
  CallAs?: CallAs;
  TemplateSummaryConfig?: TemplateSummaryConfig;
}
export const GetTemplateSummaryInput = S.suspend(() =>
  S.Struct({
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    StackName: S.optional(S.String),
    StackSetName: S.optional(S.String),
    CallAs: S.optional(CallAs),
    TemplateSummaryConfig: S.optional(TemplateSummaryConfig),
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
  identifier: "GetTemplateSummaryInput",
}) as any as S.Schema<GetTemplateSummaryInput>;
export interface ImportStacksToStackSetOutput {
  OperationId?: string;
}
export const ImportStacksToStackSetOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ImportStacksToStackSetOutput",
}) as any as S.Schema<ImportStacksToStackSetOutput>;
export interface ListImportsOutput {
  Imports?: string[];
  NextToken?: string;
}
export const ListImportsOutput = S.suspend(() =>
  S.Struct({
    Imports: S.optional(Imports),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListImportsOutput",
}) as any as S.Schema<ListImportsOutput>;
export interface ListStackInstancesInput {
  StackSetName?: string;
  NextToken?: string;
  MaxResults?: number;
  Filters?: StackInstanceFilter[];
  StackInstanceAccount?: string;
  StackInstanceRegion?: string;
  CallAs?: CallAs;
}
export const ListStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(StackInstanceFilters),
    StackInstanceAccount: S.optional(S.String),
    StackInstanceRegion: S.optional(S.String),
    CallAs: S.optional(CallAs),
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
  identifier: "ListStackInstancesInput",
}) as any as S.Schema<ListStackInstancesInput>;
export interface ListStackSetOperationResultsInput {
  StackSetName?: string;
  OperationId?: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: CallAs;
  Filters?: OperationResultFilter[];
}
export const ListStackSetOperationResultsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    OperationId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(CallAs),
    Filters: S.optional(OperationResultFilters),
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
  identifier: "ListStackSetOperationResultsInput",
}) as any as S.Schema<ListStackSetOperationResultsInput>;
export interface ListTypeRegistrationsOutput {
  RegistrationTokenList?: string[];
  NextToken?: string;
}
export const ListTypeRegistrationsOutput = S.suspend(() =>
  S.Struct({
    RegistrationTokenList: S.optional(RegistrationTokenList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTypeRegistrationsOutput",
}) as any as S.Schema<ListTypeRegistrationsOutput>;
export interface ListTypesInput {
  Visibility?: Visibility;
  ProvisioningType?: ProvisioningType;
  DeprecatedStatus?: DeprecatedStatus;
  Type?: RegistryType;
  Filters?: TypeFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTypesInput = S.suspend(() =>
  S.Struct({
    Visibility: S.optional(Visibility),
    ProvisioningType: S.optional(ProvisioningType),
    DeprecatedStatus: S.optional(DeprecatedStatus),
    Type: S.optional(RegistryType),
    Filters: S.optional(TypeFilters),
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
  identifier: "ListTypesInput",
}) as any as S.Schema<ListTypesInput>;
export interface PublishTypeOutput {
  PublicTypeArn?: string;
}
export const PublishTypeOutput = S.suspend(() =>
  S.Struct({ PublicTypeArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PublishTypeOutput",
}) as any as S.Schema<PublishTypeOutput>;
export interface RegisterPublisherOutput {
  PublisherId?: string;
}
export const RegisterPublisherOutput = S.suspend(() =>
  S.Struct({ PublisherId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterPublisherOutput",
}) as any as S.Schema<RegisterPublisherOutput>;
export interface RegisterTypeOutput {
  RegistrationToken?: string;
}
export const RegisterTypeOutput = S.suspend(() =>
  S.Struct({ RegistrationToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterTypeOutput",
}) as any as S.Schema<RegisterTypeOutput>;
export interface RollbackStackOutput {
  StackId?: string;
  OperationId?: string;
}
export const RollbackStackOutput = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RollbackStackOutput",
}) as any as S.Schema<RollbackStackOutput>;
export interface SetTypeConfigurationOutput {
  ConfigurationArn?: string;
}
export const SetTypeConfigurationOutput = S.suspend(() =>
  S.Struct({ ConfigurationArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SetTypeConfigurationOutput",
}) as any as S.Schema<SetTypeConfigurationOutput>;
export interface StartResourceScanInput {
  ClientRequestToken?: string;
  ScanFilters?: ScanFilter[];
}
export const StartResourceScanInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    ScanFilters: S.optional(ScanFilters),
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
  identifier: "StartResourceScanInput",
}) as any as S.Schema<StartResourceScanInput>;
export interface TestTypeOutput {
  TypeVersionArn?: string;
}
export const TestTypeOutput = S.suspend(() =>
  S.Struct({ TypeVersionArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "TestTypeOutput",
}) as any as S.Schema<TestTypeOutput>;
export interface UpdateGeneratedTemplateOutput {
  GeneratedTemplateId?: string;
}
export const UpdateGeneratedTemplateOutput = S.suspend(() =>
  S.Struct({ GeneratedTemplateId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateGeneratedTemplateOutput",
}) as any as S.Schema<UpdateGeneratedTemplateOutput>;
export interface UpdateStackOutput {
  StackId?: string;
  OperationId?: string;
}
export const UpdateStackOutput = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    OperationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateStackOutput",
}) as any as S.Schema<UpdateStackOutput>;
export interface UpdateStackInstancesOutput {
  OperationId?: string;
}
export const UpdateStackInstancesOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateStackInstancesOutput",
}) as any as S.Schema<UpdateStackInstancesOutput>;
export interface UpdateStackSetOutput {
  OperationId?: string;
}
export const UpdateStackSetOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateStackSetOutput",
}) as any as S.Schema<UpdateStackSetOutput>;
export interface UpdateTerminationProtectionOutput {
  StackId?: string;
}
export const UpdateTerminationProtectionOutput = S.suspend(() =>
  S.Struct({ StackId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateTerminationProtectionOutput",
}) as any as S.Schema<UpdateTerminationProtectionOutput>;
export interface ResourceLocation {
  StackName?: string;
  LogicalResourceId?: string;
}
export const ResourceLocation = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceLocation",
}) as any as S.Schema<ResourceLocation>;
export type ChangeType = "Resource" | (string & {});
export const ChangeType = S.String;
export type GeneratedTemplateResourceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "FAILED"
  | "COMPLETE"
  | (string & {});
export const GeneratedTemplateResourceStatus = S.String;
export type ResourceStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "CREATE_COMPLETE"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED"
  | "DELETE_COMPLETE"
  | "DELETE_SKIPPED"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_FAILED"
  | "UPDATE_COMPLETE"
  | "IMPORT_FAILED"
  | "IMPORT_COMPLETE"
  | "IMPORT_IN_PROGRESS"
  | "IMPORT_ROLLBACK_IN_PROGRESS"
  | "IMPORT_ROLLBACK_FAILED"
  | "IMPORT_ROLLBACK_COMPLETE"
  | "EXPORT_FAILED"
  | "EXPORT_COMPLETE"
  | "EXPORT_IN_PROGRESS"
  | "EXPORT_ROLLBACK_IN_PROGRESS"
  | "EXPORT_ROLLBACK_FAILED"
  | "EXPORT_ROLLBACK_COMPLETE"
  | "UPDATE_ROLLBACK_IN_PROGRESS"
  | "UPDATE_ROLLBACK_COMPLETE"
  | "UPDATE_ROLLBACK_FAILED"
  | "ROLLBACK_IN_PROGRESS"
  | "ROLLBACK_COMPLETE"
  | "ROLLBACK_FAILED"
  | (string & {});
export const ResourceStatus = S.String;
export type DetailedStatus =
  | "CONFIGURATION_COMPLETE"
  | "VALIDATION_FAILED"
  | (string & {});
export const DetailedStatus = S.String;
export type StackInstanceStatus =
  | "CURRENT"
  | "OUTDATED"
  | "INOPERABLE"
  | (string & {});
export const StackInstanceStatus = S.String;
export type StackSetOperationAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "DETECT_DRIFT"
  | (string & {});
export const StackSetOperationAction = S.String;
export type StackSetOperationStatus =
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "STOPPING"
  | "STOPPED"
  | "QUEUED"
  | (string & {});
export const StackSetOperationStatus = S.String;
export type SupportedMajorVersions = number[];
export const SupportedMajorVersions = S.Array(S.Number);
export type HookTargetType = "RESOURCE" | (string & {});
export const HookTargetType = S.String;
export type HookTargetAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "IMPORT"
  | (string & {});
export const HookTargetAction = S.String;
export type AnnotationStatus = "PASSED" | "FAILED" | "SKIPPED" | (string & {});
export const AnnotationStatus = S.String;
export type AnnotationSeverityLevel =
  | "INFORMATIONAL"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | (string & {});
export const AnnotationSeverityLevel = S.String;
export type JazzResourceIdentifierProperties = {
  [key: string]: string | undefined;
};
export const JazzResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type StackRefactorActionType = "MOVE" | "CREATE" | (string & {});
export const StackRefactorActionType = S.String;
export type StackRefactorActionEntity = "RESOURCE" | "STACK" | (string & {});
export const StackRefactorActionEntity = S.String;
export type StackRefactorDetection = "AUTO" | "MANUAL" | (string & {});
export const StackRefactorDetection = S.String;
export type StackRefactorTagResources = Tag[];
export const StackRefactorTagResources = S.Array(Tag);
export type StackRefactorUntagResources = string[];
export const StackRefactorUntagResources = S.Array(S.String);
export type UnprocessedTypeConfigurations = TypeConfigurationIdentifier[];
export const UnprocessedTypeConfigurations = S.Array(
  TypeConfigurationIdentifier,
);
export interface ResourceToImport {
  ResourceType?: string;
  LogicalResourceId?: string;
  ResourceIdentifier?: { [key: string]: string | undefined };
}
export const ResourceToImport = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(ResourceIdentifierProperties),
  }),
).annotations({
  identifier: "ResourceToImport",
}) as any as S.Schema<ResourceToImport>;
export type ResourcesToImport = ResourceToImport[];
export const ResourcesToImport = S.Array(ResourceToImport);
export interface ResourceMapping {
  Source?: ResourceLocation;
  Destination?: ResourceLocation;
}
export const ResourceMapping = S.suspend(() =>
  S.Struct({
    Source: S.optional(ResourceLocation),
    Destination: S.optional(ResourceLocation),
  }),
).annotations({
  identifier: "ResourceMapping",
}) as any as S.Schema<ResourceMapping>;
export type ResourceMappings = ResourceMapping[];
export const ResourceMappings = S.Array(ResourceMapping);
export interface AccountLimit {
  Name?: string;
  Value?: number;
}
export const AccountLimit = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({ identifier: "AccountLimit" }) as any as S.Schema<AccountLimit>;
export type AccountLimitList = AccountLimit[];
export const AccountLimitList = S.Array(AccountLimit);
export interface TemplateProgress {
  ResourcesSucceeded?: number;
  ResourcesFailed?: number;
  ResourcesProcessing?: number;
  ResourcesPending?: number;
}
export const TemplateProgress = S.suspend(() =>
  S.Struct({
    ResourcesSucceeded: S.optional(S.Number),
    ResourcesFailed: S.optional(S.Number),
    ResourcesProcessing: S.optional(S.Number),
    ResourcesPending: S.optional(S.Number),
  }),
).annotations({
  identifier: "TemplateProgress",
}) as any as S.Schema<TemplateProgress>;
export interface StackEvent {
  StackId?: string;
  EventId?: string;
  StackName?: string;
  OperationId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Timestamp?: Date;
  ResourceStatus?: ResourceStatus;
  ResourceStatusReason?: string;
  ResourceProperties?: string;
  ClientRequestToken?: string;
  HookType?: string;
  HookStatus?: HookStatus;
  HookStatusReason?: string;
  HookInvocationPoint?: HookInvocationPoint;
  HookInvocationId?: string;
  HookFailureMode?: HookFailureMode;
  DetailedStatus?: DetailedStatus;
}
export const StackEvent = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    EventId: S.optional(S.String),
    StackName: S.optional(S.String),
    OperationId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ResourceStatus: S.optional(ResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    HookType: S.optional(S.String),
    HookStatus: S.optional(HookStatus),
    HookStatusReason: S.optional(S.String),
    HookInvocationPoint: S.optional(HookInvocationPoint),
    HookInvocationId: S.optional(S.String),
    HookFailureMode: S.optional(HookFailureMode),
    DetailedStatus: S.optional(DetailedStatus),
  }),
).annotations({ identifier: "StackEvent" }) as any as S.Schema<StackEvent>;
export type StackEvents = StackEvent[];
export const StackEvents = S.Array(StackEvent);
export interface StackResourceDriftInformation {
  StackResourceDriftStatus?: StackResourceDriftStatus;
  LastCheckTimestamp?: Date;
}
export const StackResourceDriftInformation = S.suspend(() =>
  S.Struct({
    StackResourceDriftStatus: S.optional(StackResourceDriftStatus),
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackResourceDriftInformation",
}) as any as S.Schema<StackResourceDriftInformation>;
export interface StackResource {
  StackName?: string;
  StackId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Timestamp?: Date;
  ResourceStatus?: ResourceStatus;
  ResourceStatusReason?: string;
  Description?: string;
  DriftInformation?: StackResourceDriftInformation;
  ModuleInfo?: ModuleInfo;
}
export const StackResource = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    StackId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ResourceStatus: S.optional(ResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    Description: S.optional(S.String),
    DriftInformation: S.optional(StackResourceDriftInformation),
    ModuleInfo: S.optional(ModuleInfo),
  }),
).annotations({
  identifier: "StackResource",
}) as any as S.Schema<StackResource>;
export type StackResources = StackResource[];
export const StackResources = S.Array(StackResource);
export interface RequiredActivatedType {
  TypeNameAlias?: string;
  OriginalTypeName?: string;
  PublisherId?: string;
  SupportedMajorVersions?: number[];
}
export const RequiredActivatedType = S.suspend(() =>
  S.Struct({
    TypeNameAlias: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    PublisherId: S.optional(S.String),
    SupportedMajorVersions: S.optional(SupportedMajorVersions),
  }),
).annotations({
  identifier: "RequiredActivatedType",
}) as any as S.Schema<RequiredActivatedType>;
export type RequiredActivatedTypes = RequiredActivatedType[];
export const RequiredActivatedTypes = S.Array(RequiredActivatedType);
export interface HookTarget {
  TargetType?: HookTargetType;
  TargetTypeName?: string;
  TargetId?: string;
  Action?: HookTargetAction;
}
export const HookTarget = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(HookTargetType),
    TargetTypeName: S.optional(S.String),
    TargetId: S.optional(S.String),
    Action: S.optional(HookTargetAction),
  }),
).annotations({ identifier: "HookTarget" }) as any as S.Schema<HookTarget>;
export interface Annotation {
  AnnotationName?: string;
  Status?: AnnotationStatus;
  StatusMessage?: string;
  RemediationMessage?: string;
  RemediationLink?: string;
  SeverityLevel?: AnnotationSeverityLevel;
}
export const Annotation = S.suspend(() =>
  S.Struct({
    AnnotationName: S.optional(S.String),
    Status: S.optional(AnnotationStatus),
    StatusMessage: S.optional(S.String),
    RemediationMessage: S.optional(S.String),
    RemediationLink: S.optional(S.String),
    SeverityLevel: S.optional(AnnotationSeverityLevel),
  }),
).annotations({ identifier: "Annotation" }) as any as S.Schema<Annotation>;
export type AnnotationList = Annotation[];
export const AnnotationList = S.Array(Annotation);
export interface ChangeSetSummary {
  StackId?: string;
  StackName?: string;
  ChangeSetId?: string;
  ChangeSetName?: string;
  ExecutionStatus?: ExecutionStatus;
  Status?: ChangeSetStatus;
  StatusReason?: string;
  CreationTime?: Date;
  Description?: string;
  IncludeNestedStacks?: boolean;
  ParentChangeSetId?: string;
  RootChangeSetId?: string;
  ImportExistingResources?: boolean;
}
export const ChangeSetSummary = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
    ChangeSetId: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    ExecutionStatus: S.optional(ExecutionStatus),
    Status: S.optional(ChangeSetStatus),
    StatusReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    IncludeNestedStacks: S.optional(S.Boolean),
    ParentChangeSetId: S.optional(S.String),
    RootChangeSetId: S.optional(S.String),
    ImportExistingResources: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ChangeSetSummary",
}) as any as S.Schema<ChangeSetSummary>;
export type ChangeSetSummaries = ChangeSetSummary[];
export const ChangeSetSummaries = S.Array(ChangeSetSummary);
export interface Export {
  ExportingStackId?: string;
  Name?: string;
  Value?: string;
}
export const Export = S.suspend(() =>
  S.Struct({
    ExportingStackId: S.optional(S.String),
    Name: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({ identifier: "Export" }) as any as S.Schema<Export>;
export type Exports = Export[];
export const Exports = S.Array(Export);
export interface TemplateSummary {
  GeneratedTemplateId?: string;
  GeneratedTemplateName?: string;
  Status?: GeneratedTemplateStatus;
  StatusReason?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  NumberOfResources?: number;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    GeneratedTemplateId: S.optional(S.String),
    GeneratedTemplateName: S.optional(S.String),
    Status: S.optional(GeneratedTemplateStatus),
    StatusReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NumberOfResources: S.optional(S.Number),
  }),
).annotations({
  identifier: "TemplateSummary",
}) as any as S.Schema<TemplateSummary>;
export type TemplateSummaries = TemplateSummary[];
export const TemplateSummaries = S.Array(TemplateSummary);
export interface HookResultSummary {
  HookResultId?: string;
  InvocationPoint?: HookInvocationPoint;
  FailureMode?: HookFailureMode;
  TypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  Status?: HookStatus;
  HookStatusReason?: string;
  InvokedAt?: Date;
  TargetType?: ListHookResultsTargetType;
  TargetId?: string;
  TypeArn?: string;
  HookExecutionTarget?: string;
}
export const HookResultSummary = S.suspend(() =>
  S.Struct({
    HookResultId: S.optional(S.String),
    InvocationPoint: S.optional(HookInvocationPoint),
    FailureMode: S.optional(HookFailureMode),
    TypeName: S.optional(S.String),
    TypeVersionId: S.optional(S.String),
    TypeConfigurationVersionId: S.optional(S.String),
    Status: S.optional(HookStatus),
    HookStatusReason: S.optional(S.String),
    InvokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TargetType: S.optional(ListHookResultsTargetType),
    TargetId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    HookExecutionTarget: S.optional(S.String),
  }),
).annotations({
  identifier: "HookResultSummary",
}) as any as S.Schema<HookResultSummary>;
export type HookResultSummaries = HookResultSummary[];
export const HookResultSummaries = S.Array(HookResultSummary);
export interface ScannedResourceIdentifier {
  ResourceType?: string;
  ResourceIdentifier?: { [key: string]: string | undefined };
}
export const ScannedResourceIdentifier = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(JazzResourceIdentifierProperties),
  }),
).annotations({
  identifier: "ScannedResourceIdentifier",
}) as any as S.Schema<ScannedResourceIdentifier>;
export type ScannedResourceIdentifiers = ScannedResourceIdentifier[];
export const ScannedResourceIdentifiers = S.Array(ScannedResourceIdentifier);
export interface ScannedResource {
  ResourceType?: string;
  ResourceIdentifier?: { [key: string]: string | undefined };
  ManagedByStack?: boolean;
}
export const ScannedResource = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(JazzResourceIdentifierProperties),
    ManagedByStack: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ScannedResource",
}) as any as S.Schema<ScannedResource>;
export type ScannedResources = ScannedResource[];
export const ScannedResources = S.Array(ScannedResource);
export interface ResourceScanSummary {
  ResourceScanId?: string;
  Status?: ResourceScanStatus;
  StatusReason?: string;
  StartTime?: Date;
  EndTime?: Date;
  PercentageCompleted?: number;
  ScanType?: ScanType;
}
export const ResourceScanSummary = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    Status: S.optional(ResourceScanStatus),
    StatusReason: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PercentageCompleted: S.optional(S.Number),
    ScanType: S.optional(ScanType),
  }),
).annotations({
  identifier: "ResourceScanSummary",
}) as any as S.Schema<ResourceScanSummary>;
export type ResourceScanSummaries = ResourceScanSummary[];
export const ResourceScanSummaries = S.Array(ResourceScanSummary);
export interface StackInstanceResourceDriftsSummary {
  StackId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  PhysicalResourceIdContext?: PhysicalResourceIdContextKeyValuePair[];
  ResourceType?: string;
  PropertyDifferences?: PropertyDifference[];
  StackResourceDriftStatus?: StackResourceDriftStatus;
  Timestamp?: Date;
}
export const StackInstanceResourceDriftsSummary = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    PhysicalResourceIdContext: S.optional(PhysicalResourceIdContext),
    ResourceType: S.optional(S.String),
    PropertyDifferences: S.optional(PropertyDifferences),
    StackResourceDriftStatus: S.optional(StackResourceDriftStatus),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackInstanceResourceDriftsSummary",
}) as any as S.Schema<StackInstanceResourceDriftsSummary>;
export type StackInstanceResourceDriftsSummaries =
  StackInstanceResourceDriftsSummary[];
export const StackInstanceResourceDriftsSummaries = S.Array(
  StackInstanceResourceDriftsSummary,
);
export interface StackRefactorAction {
  Action?: StackRefactorActionType;
  Entity?: StackRefactorActionEntity;
  PhysicalResourceId?: string;
  ResourceIdentifier?: string;
  Description?: string;
  Detection?: StackRefactorDetection;
  DetectionReason?: string;
  TagResources?: Tag[];
  UntagResources?: string[];
  ResourceMapping?: ResourceMapping;
}
export const StackRefactorAction = S.suspend(() =>
  S.Struct({
    Action: S.optional(StackRefactorActionType),
    Entity: S.optional(StackRefactorActionEntity),
    PhysicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    Detection: S.optional(StackRefactorDetection),
    DetectionReason: S.optional(S.String),
    TagResources: S.optional(StackRefactorTagResources),
    UntagResources: S.optional(StackRefactorUntagResources),
    ResourceMapping: S.optional(ResourceMapping),
  }),
).annotations({
  identifier: "StackRefactorAction",
}) as any as S.Schema<StackRefactorAction>;
export type StackRefactorActions = StackRefactorAction[];
export const StackRefactorActions = S.Array(StackRefactorAction);
export interface StackRefactorSummary {
  StackRefactorId?: string;
  Description?: string;
  ExecutionStatus?: StackRefactorExecutionStatus;
  ExecutionStatusReason?: string;
  Status?: StackRefactorStatus;
  StatusReason?: string;
}
export const StackRefactorSummary = S.suspend(() =>
  S.Struct({
    StackRefactorId: S.optional(S.String),
    Description: S.optional(S.String),
    ExecutionStatus: S.optional(StackRefactorExecutionStatus),
    ExecutionStatusReason: S.optional(S.String),
    Status: S.optional(StackRefactorStatus),
    StatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StackRefactorSummary",
}) as any as S.Schema<StackRefactorSummary>;
export type StackRefactorSummaries = StackRefactorSummary[];
export const StackRefactorSummaries = S.Array(StackRefactorSummary);
export interface StackSetAutoDeploymentTargetSummary {
  OrganizationalUnitId?: string;
  Regions?: string[];
}
export const StackSetAutoDeploymentTargetSummary = S.suspend(() =>
  S.Struct({
    OrganizationalUnitId: S.optional(S.String),
    Regions: S.optional(RegionList),
  }),
).annotations({
  identifier: "StackSetAutoDeploymentTargetSummary",
}) as any as S.Schema<StackSetAutoDeploymentTargetSummary>;
export type StackSetAutoDeploymentTargetSummaries =
  StackSetAutoDeploymentTargetSummary[];
export const StackSetAutoDeploymentTargetSummaries = S.Array(
  StackSetAutoDeploymentTargetSummary,
);
export interface StackSetOperationStatusDetails {
  FailedStackInstancesCount?: number;
}
export const StackSetOperationStatusDetails = S.suspend(() =>
  S.Struct({ FailedStackInstancesCount: S.optional(S.Number) }),
).annotations({
  identifier: "StackSetOperationStatusDetails",
}) as any as S.Schema<StackSetOperationStatusDetails>;
export interface StackSetOperationSummary {
  OperationId?: string;
  Action?: StackSetOperationAction;
  Status?: StackSetOperationStatus;
  CreationTimestamp?: Date;
  EndTimestamp?: Date;
  StatusReason?: string;
  StatusDetails?: StackSetOperationStatusDetails;
  OperationPreferences?: StackSetOperationPreferences;
}
export const StackSetOperationSummary = S.suspend(() =>
  S.Struct({
    OperationId: S.optional(S.String),
    Action: S.optional(StackSetOperationAction),
    Status: S.optional(StackSetOperationStatus),
    CreationTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StatusReason: S.optional(S.String),
    StatusDetails: S.optional(StackSetOperationStatusDetails),
    OperationPreferences: S.optional(StackSetOperationPreferences),
  }),
).annotations({
  identifier: "StackSetOperationSummary",
}) as any as S.Schema<StackSetOperationSummary>;
export type StackSetOperationSummaries = StackSetOperationSummary[];
export const StackSetOperationSummaries = S.Array(StackSetOperationSummary);
export interface StackSetSummary {
  StackSetName?: string;
  StackSetId?: string;
  Description?: string;
  Status?: StackSetStatus;
  AutoDeployment?: AutoDeployment;
  PermissionModel?: PermissionModels;
  DriftStatus?: StackDriftStatus;
  LastDriftCheckTimestamp?: Date;
  ManagedExecution?: ManagedExecution;
}
export const StackSetSummary = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(StackSetStatus),
    AutoDeployment: S.optional(AutoDeployment),
    PermissionModel: S.optional(PermissionModels),
    DriftStatus: S.optional(StackDriftStatus),
    LastDriftCheckTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ManagedExecution: S.optional(ManagedExecution),
  }),
).annotations({
  identifier: "StackSetSummary",
}) as any as S.Schema<StackSetSummary>;
export type StackSetSummaries = StackSetSummary[];
export const StackSetSummaries = S.Array(StackSetSummary);
export interface TypeVersionSummary {
  Type?: RegistryType;
  TypeName?: string;
  VersionId?: string;
  IsDefaultVersion?: boolean;
  Arn?: string;
  TimeCreated?: Date;
  Description?: string;
  PublicVersionNumber?: string;
}
export const TypeVersionSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
    IsDefaultVersion: S.optional(S.Boolean),
    Arn: S.optional(S.String),
    TimeCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "TypeVersionSummary",
}) as any as S.Schema<TypeVersionSummary>;
export type TypeVersionSummaries = TypeVersionSummary[];
export const TypeVersionSummaries = S.Array(TypeVersionSummary);
export interface TemplateParameter {
  ParameterKey?: string;
  DefaultValue?: string;
  NoEcho?: boolean;
  Description?: string;
}
export const TemplateParameter = S.suspend(() =>
  S.Struct({
    ParameterKey: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    NoEcho: S.optional(S.Boolean),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateParameter",
}) as any as S.Schema<TemplateParameter>;
export type TemplateParameters = TemplateParameter[];
export const TemplateParameters = S.Array(TemplateParameter);
export type PolicyAction =
  | "Delete"
  | "Retain"
  | "Snapshot"
  | "ReplaceAndDelete"
  | "ReplaceAndRetain"
  | "ReplaceAndSnapshot"
  | (string & {});
export const PolicyAction = S.String;
export type ChangeAction =
  | "Add"
  | "Modify"
  | "Remove"
  | "Import"
  | "Dynamic"
  | "SyncWithActual"
  | (string & {});
export const ChangeAction = S.String;
export type Replacement = "True" | "False" | "Conditional" | (string & {});
export const Replacement = S.String;
export type ResourceAttribute =
  | "Properties"
  | "Metadata"
  | "CreationPolicy"
  | "UpdatePolicy"
  | "DeletionPolicy"
  | "UpdateReplacePolicy"
  | "Tags"
  | (string & {});
export const ResourceAttribute = S.String;
export type Scope = ResourceAttribute[];
export const Scope = S.Array(ResourceAttribute);
export type WarningType =
  | "MUTUALLY_EXCLUSIVE_PROPERTIES"
  | "UNSUPPORTED_PROPERTIES"
  | "MUTUALLY_EXCLUSIVE_TYPES"
  | "EXCLUDED_PROPERTIES"
  | "EXCLUDED_RESOURCES"
  | (string & {});
export const WarningType = S.String;
export type StackInstanceDetailedStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "INOPERABLE"
  | "SKIPPED_SUSPENDED_ACCOUNT"
  | "FAILED_IMPORT"
  | (string & {});
export const StackInstanceDetailedStatus = S.String;
export type OperationType =
  | "CREATE_STACK"
  | "UPDATE_STACK"
  | "DELETE_STACK"
  | "CONTINUE_ROLLBACK"
  | "ROLLBACK"
  | "CREATE_CHANGESET"
  | (string & {});
export const OperationType = S.String;
export type StackSetDriftStatus =
  | "DRIFTED"
  | "IN_SYNC"
  | "NOT_CHECKED"
  | (string & {});
export const StackSetDriftStatus = S.String;
export type StackSetDriftDetectionStatus =
  | "COMPLETED"
  | "FAILED"
  | "PARTIAL_SUCCESS"
  | "IN_PROGRESS"
  | "STOPPED"
  | (string & {});
export const StackSetDriftDetectionStatus = S.String;
export interface ActivateTypeOutput {
  Arn?: string;
}
export const ActivateTypeOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ActivateTypeOutput",
}) as any as S.Schema<ActivateTypeOutput>;
export interface CreateChangeSetInput {
  StackName?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  Parameters?: Parameter[];
  Capabilities?: Capability[];
  ResourceTypes?: string[];
  RoleARN?: string;
  RollbackConfiguration?: RollbackConfiguration;
  NotificationARNs?: string[];
  Tags?: Tag[];
  ChangeSetName?: string;
  ClientToken?: string;
  Description?: string;
  ChangeSetType?: ChangeSetType;
  ResourcesToImport?: ResourceToImport[];
  IncludeNestedStacks?: boolean;
  OnStackFailure?: OnStackFailure;
  ImportExistingResources?: boolean;
  DeploymentMode?: DeploymentMode;
}
export const CreateChangeSetInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    UsePreviousTemplate: S.optional(S.Boolean),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    ResourceTypes: S.optional(ResourceTypes),
    RoleARN: S.optional(S.String),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    NotificationARNs: S.optional(NotificationARNs),
    Tags: S.optional(Tags),
    ChangeSetName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Description: S.optional(S.String),
    ChangeSetType: S.optional(ChangeSetType),
    ResourcesToImport: S.optional(ResourcesToImport),
    IncludeNestedStacks: S.optional(S.Boolean),
    OnStackFailure: S.optional(OnStackFailure),
    ImportExistingResources: S.optional(S.Boolean),
    DeploymentMode: S.optional(DeploymentMode),
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
  identifier: "CreateChangeSetInput",
}) as any as S.Schema<CreateChangeSetInput>;
export interface CreateGeneratedTemplateOutput {
  GeneratedTemplateId?: string;
}
export const CreateGeneratedTemplateOutput = S.suspend(() =>
  S.Struct({ GeneratedTemplateId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateGeneratedTemplateOutput",
}) as any as S.Schema<CreateGeneratedTemplateOutput>;
export interface CreateStackInstancesOutput {
  OperationId?: string;
}
export const CreateStackInstancesOutput = S.suspend(() =>
  S.Struct({ OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateStackInstancesOutput",
}) as any as S.Schema<CreateStackInstancesOutput>;
export interface CreateStackRefactorInput {
  Description?: string;
  EnableStackCreation?: boolean;
  ResourceMappings?: ResourceMapping[];
  StackDefinitions?: StackDefinition[];
}
export const CreateStackRefactorInput = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    EnableStackCreation: S.optional(S.Boolean),
    ResourceMappings: S.optional(ResourceMappings),
    StackDefinitions: S.optional(StackDefinitions),
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
  identifier: "CreateStackRefactorInput",
}) as any as S.Schema<CreateStackRefactorInput>;
export interface CreateStackSetOutput {
  StackSetId?: string;
}
export const CreateStackSetOutput = S.suspend(() =>
  S.Struct({ StackSetId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateStackSetOutput",
}) as any as S.Schema<CreateStackSetOutput>;
export interface DescribeAccountLimitsOutput {
  AccountLimits?: AccountLimit[];
  NextToken?: string;
}
export const DescribeAccountLimitsOutput = S.suspend(() =>
  S.Struct({
    AccountLimits: S.optional(AccountLimitList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccountLimitsOutput",
}) as any as S.Schema<DescribeAccountLimitsOutput>;
export interface DescribeStackEventsOutput {
  StackEvents?: (StackEvent & {
    StackId: StackId;
    EventId: EventId;
    StackName: StackName;
    Timestamp: Date;
  })[];
  NextToken?: string;
}
export const DescribeStackEventsOutput = S.suspend(() =>
  S.Struct({
    StackEvents: S.optional(StackEvents),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackEventsOutput",
}) as any as S.Schema<DescribeStackEventsOutput>;
export interface DescribeStackResourcesOutput {
  StackResources?: (StackResource & {
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    Timestamp: Date;
    ResourceStatus: ResourceStatus;
    DriftInformation: StackResourceDriftInformation & {
      StackResourceDriftStatus: StackResourceDriftStatus;
    };
  })[];
}
export const DescribeStackResourcesOutput = S.suspend(() =>
  S.Struct({ StackResources: S.optional(StackResources) }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourcesOutput",
}) as any as S.Schema<DescribeStackResourcesOutput>;
export interface DescribeTypeOutput {
  Arn?: string;
  Type?: RegistryType;
  TypeName?: string;
  DefaultVersionId?: string;
  IsDefaultVersion?: boolean;
  TypeTestsStatus?: TypeTestsStatus;
  TypeTestsStatusDescription?: string;
  Description?: string;
  Schema?: string;
  ProvisioningType?: ProvisioningType;
  DeprecatedStatus?: DeprecatedStatus;
  LoggingConfig?: LoggingConfig & {
    LogRoleArn: RoleARN2;
    LogGroupName: LogGroupName;
  };
  RequiredActivatedTypes?: RequiredActivatedType[];
  ExecutionRoleArn?: string;
  Visibility?: Visibility;
  SourceUrl?: string;
  DocumentationUrl?: string;
  LastUpdated?: Date;
  TimeCreated?: Date;
  ConfigurationSchema?: string;
  PublisherId?: string;
  OriginalTypeName?: string;
  OriginalTypeArn?: string;
  PublicVersionNumber?: string;
  LatestPublicVersion?: string;
  IsActivated?: boolean;
  AutoUpdate?: boolean;
}
export const DescribeTypeOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    IsDefaultVersion: S.optional(S.Boolean),
    TypeTestsStatus: S.optional(TypeTestsStatus),
    TypeTestsStatusDescription: S.optional(S.String),
    Description: S.optional(S.String),
    Schema: S.optional(S.String),
    ProvisioningType: S.optional(ProvisioningType),
    DeprecatedStatus: S.optional(DeprecatedStatus),
    LoggingConfig: S.optional(LoggingConfig),
    RequiredActivatedTypes: S.optional(RequiredActivatedTypes),
    ExecutionRoleArn: S.optional(S.String),
    Visibility: S.optional(Visibility),
    SourceUrl: S.optional(S.String),
    DocumentationUrl: S.optional(S.String),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TimeCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ConfigurationSchema: S.optional(S.String),
    PublisherId: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    OriginalTypeArn: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
    LatestPublicVersion: S.optional(S.String),
    IsActivated: S.optional(S.Boolean),
    AutoUpdate: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTypeOutput",
}) as any as S.Schema<DescribeTypeOutput>;
export interface GetHookResultOutput {
  HookResultId?: string;
  InvocationPoint?: HookInvocationPoint;
  FailureMode?: HookFailureMode;
  TypeName?: string;
  OriginalTypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  TypeArn?: string;
  Status?: HookStatus;
  HookStatusReason?: string;
  InvokedAt?: Date;
  Target?: HookTarget & {
    TargetType: HookTargetType;
    TargetTypeName: HookTargetTypeName;
    TargetId: HookTargetId;
    Action: HookTargetAction;
  };
  Annotations?: Annotation[];
}
export const GetHookResultOutput = S.suspend(() =>
  S.Struct({
    HookResultId: S.optional(S.String),
    InvocationPoint: S.optional(HookInvocationPoint),
    FailureMode: S.optional(HookFailureMode),
    TypeName: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    TypeVersionId: S.optional(S.String),
    TypeConfigurationVersionId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    Status: S.optional(HookStatus),
    HookStatusReason: S.optional(S.String),
    InvokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Target: S.optional(HookTarget),
    Annotations: S.optional(AnnotationList),
  }).pipe(ns),
).annotations({
  identifier: "GetHookResultOutput",
}) as any as S.Schema<GetHookResultOutput>;
export interface ListChangeSetsOutput {
  Summaries?: ChangeSetSummary[];
  NextToken?: string;
}
export const ListChangeSetsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(ChangeSetSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListChangeSetsOutput",
}) as any as S.Schema<ListChangeSetsOutput>;
export interface ListExportsOutput {
  Exports?: Export[];
  NextToken?: string;
}
export const ListExportsOutput = S.suspend(() =>
  S.Struct({
    Exports: S.optional(Exports),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListExportsOutput",
}) as any as S.Schema<ListExportsOutput>;
export interface ListGeneratedTemplatesOutput {
  Summaries?: TemplateSummary[];
  NextToken?: string;
}
export const ListGeneratedTemplatesOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(TemplateSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGeneratedTemplatesOutput",
}) as any as S.Schema<ListGeneratedTemplatesOutput>;
export interface ListHookResultsOutput {
  TargetType?: ListHookResultsTargetType;
  TargetId?: string;
  HookResults?: HookResultSummary[];
  NextToken?: string;
}
export const ListHookResultsOutput = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(ListHookResultsTargetType),
    TargetId: S.optional(S.String),
    HookResults: S.optional(HookResultSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListHookResultsOutput",
}) as any as S.Schema<ListHookResultsOutput>;
export interface ListResourceScanRelatedResourcesInput {
  ResourceScanId?: string;
  Resources?: ScannedResourceIdentifier[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceScanRelatedResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    Resources: S.optional(ScannedResourceIdentifiers),
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
  identifier: "ListResourceScanRelatedResourcesInput",
}) as any as S.Schema<ListResourceScanRelatedResourcesInput>;
export interface ListResourceScanResourcesOutput {
  Resources?: ScannedResource[];
  NextToken?: string;
}
export const ListResourceScanResourcesOutput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ScannedResources),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceScanResourcesOutput",
}) as any as S.Schema<ListResourceScanResourcesOutput>;
export interface ListResourceScansOutput {
  ResourceScanSummaries?: ResourceScanSummary[];
  NextToken?: string;
}
export const ListResourceScansOutput = S.suspend(() =>
  S.Struct({
    ResourceScanSummaries: S.optional(ResourceScanSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceScansOutput",
}) as any as S.Schema<ListResourceScansOutput>;
export interface ListStackInstanceResourceDriftsOutput {
  Summaries?: (StackInstanceResourceDriftsSummary & {
    StackId: StackId;
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    StackResourceDriftStatus: StackResourceDriftStatus;
    Timestamp: Date;
    PhysicalResourceIdContext: (PhysicalResourceIdContextKeyValuePair & {
      Key: Key;
      Value: Value;
    })[];
    PropertyDifferences: (PropertyDifference & {
      PropertyPath: PropertyPath;
      ExpectedValue: PropertyValue;
      ActualValue: PropertyValue;
      DifferenceType: DifferenceType;
    })[];
  })[];
  NextToken?: string;
}
export const ListStackInstanceResourceDriftsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackInstanceResourceDriftsSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackInstanceResourceDriftsOutput",
}) as any as S.Schema<ListStackInstanceResourceDriftsOutput>;
export interface ListStackRefactorActionsOutput {
  StackRefactorActions: (StackRefactorAction & {
    TagResources: (Tag & { Key: TagKey; Value: TagValue })[];
    ResourceMapping: ResourceMapping & {
      Source: ResourceLocation & {
        StackName: StackName;
        LogicalResourceId: LogicalResourceId;
      };
      Destination: ResourceLocation & {
        StackName: StackName;
        LogicalResourceId: LogicalResourceId;
      };
    };
  })[];
  NextToken?: string;
}
export const ListStackRefactorActionsOutput = S.suspend(() =>
  S.Struct({
    StackRefactorActions: S.optional(StackRefactorActions),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackRefactorActionsOutput",
}) as any as S.Schema<ListStackRefactorActionsOutput>;
export interface ListStackRefactorsOutput {
  StackRefactorSummaries: StackRefactorSummary[];
  NextToken?: string;
}
export const ListStackRefactorsOutput = S.suspend(() =>
  S.Struct({
    StackRefactorSummaries: S.optional(StackRefactorSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackRefactorsOutput",
}) as any as S.Schema<ListStackRefactorsOutput>;
export interface ListStackSetAutoDeploymentTargetsOutput {
  Summaries?: StackSetAutoDeploymentTargetSummary[];
  NextToken?: string;
}
export const ListStackSetAutoDeploymentTargetsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackSetAutoDeploymentTargetSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackSetAutoDeploymentTargetsOutput",
}) as any as S.Schema<ListStackSetAutoDeploymentTargetsOutput>;
export interface ListStackSetOperationsOutput {
  Summaries?: StackSetOperationSummary[];
  NextToken?: string;
}
export const ListStackSetOperationsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackSetOperationSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackSetOperationsOutput",
}) as any as S.Schema<ListStackSetOperationsOutput>;
export interface ListStackSetsOutput {
  Summaries?: StackSetSummary[];
  NextToken?: string;
}
export const ListStackSetsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackSetSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackSetsOutput",
}) as any as S.Schema<ListStackSetsOutput>;
export interface ListTypeVersionsOutput {
  TypeVersionSummaries?: TypeVersionSummary[];
  NextToken?: string;
}
export const ListTypeVersionsOutput = S.suspend(() =>
  S.Struct({
    TypeVersionSummaries: S.optional(TypeVersionSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTypeVersionsOutput",
}) as any as S.Schema<ListTypeVersionsOutput>;
export interface StartResourceScanOutput {
  ResourceScanId?: string;
}
export const StartResourceScanOutput = S.suspend(() =>
  S.Struct({ ResourceScanId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartResourceScanOutput",
}) as any as S.Schema<StartResourceScanOutput>;
export interface ValidateTemplateOutput {
  Parameters?: TemplateParameter[];
  Description?: string;
  Capabilities?: Capability[];
  CapabilitiesReason?: string;
  DeclaredTransforms?: string[];
}
export const ValidateTemplateOutput = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(TemplateParameters),
    Description: S.optional(S.String),
    Capabilities: S.optional(Capabilities),
    CapabilitiesReason: S.optional(S.String),
    DeclaredTransforms: S.optional(TransformsList),
  }).pipe(ns),
).annotations({
  identifier: "ValidateTemplateOutput",
}) as any as S.Schema<ValidateTemplateOutput>;
export type BeaconStackOperationStatus =
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const BeaconStackOperationStatus = S.String;
export type EventType =
  | "STACK_EVENT"
  | "PROGRESS_EVENT"
  | "VALIDATION_ERROR"
  | "PROVISIONING_ERROR"
  | "HOOK_INVOCATION_ERROR"
  | (string & {});
export const EventType = S.String;
export type ValidationStatus = "FAILED" | "SKIPPED" | (string & {});
export const ValidationStatus = S.String;
export interface StackInstanceComprehensiveStatus {
  DetailedStatus?: StackInstanceDetailedStatus;
}
export const StackInstanceComprehensiveStatus = S.suspend(() =>
  S.Struct({ DetailedStatus: S.optional(StackInstanceDetailedStatus) }),
).annotations({
  identifier: "StackInstanceComprehensiveStatus",
}) as any as S.Schema<StackInstanceComprehensiveStatus>;
export interface Output {
  OutputKey?: string;
  OutputValue?: string;
  Description?: string;
  ExportName?: string;
}
export const Output = S.suspend(() =>
  S.Struct({
    OutputKey: S.optional(S.String),
    OutputValue: S.optional(S.String),
    Description: S.optional(S.String),
    ExportName: S.optional(S.String),
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type Outputs = Output[];
export const Outputs = S.Array(Output);
export interface StackDriftInformation {
  StackDriftStatus?: StackDriftStatus;
  LastCheckTimestamp?: Date;
}
export const StackDriftInformation = S.suspend(() =>
  S.Struct({
    StackDriftStatus: S.optional(StackDriftStatus),
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackDriftInformation",
}) as any as S.Schema<StackDriftInformation>;
export interface OperationEntry {
  OperationType?: OperationType;
  OperationId?: string;
}
export const OperationEntry = S.suspend(() =>
  S.Struct({
    OperationType: S.optional(OperationType),
    OperationId: S.optional(S.String),
  }),
).annotations({
  identifier: "OperationEntry",
}) as any as S.Schema<OperationEntry>;
export type LastOperations = OperationEntry[];
export const LastOperations = S.Array(OperationEntry);
export interface StackSetDriftDetectionDetails {
  DriftStatus?: StackSetDriftStatus;
  DriftDetectionStatus?: StackSetDriftDetectionStatus;
  LastDriftCheckTimestamp?: Date;
  TotalStackInstancesCount?: number;
  DriftedStackInstancesCount?: number;
  InSyncStackInstancesCount?: number;
  InProgressStackInstancesCount?: number;
  FailedStackInstancesCount?: number;
}
export const StackSetDriftDetectionDetails = S.suspend(() =>
  S.Struct({
    DriftStatus: S.optional(StackSetDriftStatus),
    DriftDetectionStatus: S.optional(StackSetDriftDetectionStatus),
    LastDriftCheckTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    TotalStackInstancesCount: S.optional(S.Number),
    DriftedStackInstancesCount: S.optional(S.Number),
    InSyncStackInstancesCount: S.optional(S.Number),
    InProgressStackInstancesCount: S.optional(S.Number),
    FailedStackInstancesCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "StackSetDriftDetectionDetails",
}) as any as S.Schema<StackSetDriftDetectionDetails>;
export type ResourceIdentifiers = string[];
export const ResourceIdentifiers = S.Array(S.String);
export interface StackResourceDriftInformationSummary {
  StackResourceDriftStatus?: StackResourceDriftStatus;
  LastCheckTimestamp?: Date;
}
export const StackResourceDriftInformationSummary = S.suspend(() =>
  S.Struct({
    StackResourceDriftStatus: S.optional(StackResourceDriftStatus),
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackResourceDriftInformationSummary",
}) as any as S.Schema<StackResourceDriftInformationSummary>;
export interface StackDriftInformationSummary {
  StackDriftStatus?: StackDriftStatus;
  LastCheckTimestamp?: Date;
}
export const StackDriftInformationSummary = S.suspend(() =>
  S.Struct({
    StackDriftStatus: S.optional(StackDriftStatus),
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackDriftInformationSummary",
}) as any as S.Schema<StackDriftInformationSummary>;
export type StackSetOperationResultStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | (string & {});
export const StackSetOperationResultStatus = S.String;
export type DriftIgnoredReason =
  | "MANAGED_BY_AWS"
  | "WRITE_ONLY_PROPERTY"
  | (string & {});
export const DriftIgnoredReason = S.String;
export type EvaluationType = "Static" | "Dynamic" | (string & {});
export const EvaluationType = S.String;
export type ChangeSource =
  | "ResourceReference"
  | "ParameterReference"
  | "ResourceAttribute"
  | "DirectModification"
  | "Automatic"
  | "NoModification"
  | (string & {});
export const ChangeSource = S.String;
export interface BatchDescribeTypeConfigurationsError {
  ErrorCode?: string;
  ErrorMessage?: string;
  TypeConfigurationIdentifier?: TypeConfigurationIdentifier;
}
export const BatchDescribeTypeConfigurationsError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    TypeConfigurationIdentifier: S.optional(TypeConfigurationIdentifier),
  }),
).annotations({
  identifier: "BatchDescribeTypeConfigurationsError",
}) as any as S.Schema<BatchDescribeTypeConfigurationsError>;
export type BatchDescribeTypeConfigurationsErrors =
  BatchDescribeTypeConfigurationsError[];
export const BatchDescribeTypeConfigurationsErrors = S.Array(
  BatchDescribeTypeConfigurationsError,
);
export interface TypeConfigurationDetails {
  Arn?: string;
  Alias?: string;
  Configuration?: string;
  LastUpdated?: Date;
  TypeArn?: string;
  TypeName?: string;
  IsDefaultConfiguration?: boolean;
}
export const TypeConfigurationDetails = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Alias: S.optional(S.String),
    Configuration: S.optional(S.String),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TypeArn: S.optional(S.String),
    TypeName: S.optional(S.String),
    IsDefaultConfiguration: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TypeConfigurationDetails",
}) as any as S.Schema<TypeConfigurationDetails>;
export type TypeConfigurationDetailsList = TypeConfigurationDetails[];
export const TypeConfigurationDetailsList = S.Array(TypeConfigurationDetails);
export interface OperationEvent {
  EventId?: string;
  StackId?: string;
  OperationId?: string;
  OperationType?: OperationType;
  OperationStatus?: BeaconStackOperationStatus;
  EventType?: EventType;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Timestamp?: Date;
  StartTime?: Date;
  EndTime?: Date;
  ResourceStatus?: ResourceStatus;
  ResourceStatusReason?: string;
  ResourceProperties?: string;
  ClientRequestToken?: string;
  HookType?: string;
  HookStatus?: HookStatus;
  HookStatusReason?: string;
  HookInvocationPoint?: HookInvocationPoint;
  HookFailureMode?: HookFailureMode;
  DetailedStatus?: DetailedStatus;
  ValidationFailureMode?: HookFailureMode;
  ValidationName?: string;
  ValidationStatus?: ValidationStatus;
  ValidationStatusReason?: string;
  ValidationPath?: string;
}
export const OperationEvent = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    StackId: S.optional(S.String),
    OperationId: S.optional(S.String),
    OperationType: S.optional(OperationType),
    OperationStatus: S.optional(BeaconStackOperationStatus),
    EventType: S.optional(EventType),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ResourceStatus: S.optional(ResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    HookType: S.optional(S.String),
    HookStatus: S.optional(HookStatus),
    HookStatusReason: S.optional(S.String),
    HookInvocationPoint: S.optional(HookInvocationPoint),
    HookFailureMode: S.optional(HookFailureMode),
    DetailedStatus: S.optional(DetailedStatus),
    ValidationFailureMode: S.optional(HookFailureMode),
    ValidationName: S.optional(S.String),
    ValidationStatus: S.optional(ValidationStatus),
    ValidationStatusReason: S.optional(S.String),
    ValidationPath: S.optional(S.String),
  }),
).annotations({
  identifier: "OperationEvent",
}) as any as S.Schema<OperationEvent>;
export type OperationEvents = OperationEvent[];
export const OperationEvents = S.Array(OperationEvent);
export interface StackInstance {
  StackSetId?: string;
  Region?: string;
  Account?: string;
  StackId?: string;
  ParameterOverrides?: Parameter[];
  Status?: StackInstanceStatus;
  StackInstanceStatus?: StackInstanceComprehensiveStatus;
  StatusReason?: string;
  OrganizationalUnitId?: string;
  DriftStatus?: StackDriftStatus;
  LastDriftCheckTimestamp?: Date;
  LastOperationId?: string;
}
export const StackInstance = S.suspend(() =>
  S.Struct({
    StackSetId: S.optional(S.String),
    Region: S.optional(S.String),
    Account: S.optional(S.String),
    StackId: S.optional(S.String),
    ParameterOverrides: S.optional(Parameters),
    Status: S.optional(StackInstanceStatus),
    StackInstanceStatus: S.optional(StackInstanceComprehensiveStatus),
    StatusReason: S.optional(S.String),
    OrganizationalUnitId: S.optional(S.String),
    DriftStatus: S.optional(StackDriftStatus),
    LastDriftCheckTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastOperationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StackInstance",
}) as any as S.Schema<StackInstance>;
export interface StackResourceDetail {
  StackName?: string;
  StackId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  LastUpdatedTimestamp?: Date;
  ResourceStatus?: ResourceStatus;
  ResourceStatusReason?: string;
  Description?: string;
  Metadata?: string;
  DriftInformation?: StackResourceDriftInformation;
  ModuleInfo?: ModuleInfo;
}
export const StackResourceDetail = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    StackId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ResourceStatus: S.optional(ResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    Description: S.optional(S.String),
    Metadata: S.optional(S.String),
    DriftInformation: S.optional(StackResourceDriftInformation),
    ModuleInfo: S.optional(ModuleInfo),
  }),
).annotations({
  identifier: "StackResourceDetail",
}) as any as S.Schema<StackResourceDetail>;
export type StackResourceDrifts = StackResourceDrift[];
export const StackResourceDrifts = S.Array(StackResourceDrift);
export interface Stack {
  StackId?: string;
  StackName?: string;
  ChangeSetId?: string;
  Description?: string;
  Parameters?: Parameter[];
  CreationTime?: Date;
  DeletionTime?: Date;
  LastUpdatedTime?: Date;
  RollbackConfiguration?: RollbackConfiguration;
  StackStatus?: StackStatus;
  StackStatusReason?: string;
  DisableRollback?: boolean;
  NotificationARNs?: string[];
  TimeoutInMinutes?: number;
  Capabilities?: Capability[];
  Outputs?: Output[];
  RoleARN?: string;
  Tags?: Tag[];
  EnableTerminationProtection?: boolean;
  ParentId?: string;
  RootId?: string;
  DriftInformation?: StackDriftInformation;
  RetainExceptOnCreate?: boolean;
  DeletionMode?: DeletionMode;
  DetailedStatus?: DetailedStatus;
  LastOperations?: OperationEntry[];
}
export const Stack = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
    ChangeSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(Parameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    StackStatus: S.optional(StackStatus),
    StackStatusReason: S.optional(S.String),
    DisableRollback: S.optional(S.Boolean),
    NotificationARNs: S.optional(NotificationARNs),
    TimeoutInMinutes: S.optional(S.Number),
    Capabilities: S.optional(Capabilities),
    Outputs: S.optional(Outputs),
    RoleARN: S.optional(S.String),
    Tags: S.optional(Tags),
    EnableTerminationProtection: S.optional(S.Boolean),
    ParentId: S.optional(S.String),
    RootId: S.optional(S.String),
    DriftInformation: S.optional(StackDriftInformation),
    RetainExceptOnCreate: S.optional(S.Boolean),
    DeletionMode: S.optional(DeletionMode),
    DetailedStatus: S.optional(DetailedStatus),
    LastOperations: S.optional(LastOperations),
  }),
).annotations({ identifier: "Stack" }) as any as S.Schema<Stack>;
export type Stacks = Stack[];
export const Stacks = S.Array(Stack);
export interface StackSet {
  StackSetName?: string;
  StackSetId?: string;
  Description?: string;
  Status?: StackSetStatus;
  TemplateBody?: string;
  Parameters?: Parameter[];
  Capabilities?: Capability[];
  Tags?: Tag[];
  StackSetARN?: string;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  StackSetDriftDetectionDetails?: StackSetDriftDetectionDetails;
  AutoDeployment?: AutoDeployment;
  PermissionModel?: PermissionModels;
  OrganizationalUnitIds?: string[];
  ManagedExecution?: ManagedExecution;
  Regions?: string[];
}
export const StackSet = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(StackSetStatus),
    TemplateBody: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    StackSetARN: S.optional(S.String),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    StackSetDriftDetectionDetails: S.optional(StackSetDriftDetectionDetails),
    AutoDeployment: S.optional(AutoDeployment),
    PermissionModel: S.optional(PermissionModels),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    ManagedExecution: S.optional(ManagedExecution),
    Regions: S.optional(RegionList),
  }),
).annotations({ identifier: "StackSet" }) as any as S.Schema<StackSet>;
export interface StackSetOperation {
  OperationId?: string;
  StackSetId?: string;
  Action?: StackSetOperationAction;
  Status?: StackSetOperationStatus;
  OperationPreferences?: StackSetOperationPreferences;
  RetainStacks?: boolean;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  CreationTimestamp?: Date;
  EndTimestamp?: Date;
  DeploymentTargets?: DeploymentTargets;
  StackSetDriftDetectionDetails?: StackSetDriftDetectionDetails;
  StatusReason?: string;
  StatusDetails?: StackSetOperationStatusDetails;
}
export const StackSetOperation = S.suspend(() =>
  S.Struct({
    OperationId: S.optional(S.String),
    StackSetId: S.optional(S.String),
    Action: S.optional(StackSetOperationAction),
    Status: S.optional(StackSetOperationStatus),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    RetainStacks: S.optional(S.Boolean),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    CreationTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeploymentTargets: S.optional(DeploymentTargets),
    StackSetDriftDetectionDetails: S.optional(StackSetDriftDetectionDetails),
    StatusReason: S.optional(S.String),
    StatusDetails: S.optional(StackSetOperationStatusDetails),
  }),
).annotations({
  identifier: "StackSetOperation",
}) as any as S.Schema<StackSetOperation>;
export interface ResourceIdentifierSummary {
  ResourceType?: string;
  LogicalResourceIds?: string[];
  ResourceIdentifiers?: string[];
}
export const ResourceIdentifierSummary = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    LogicalResourceIds: S.optional(LogicalResourceIds),
    ResourceIdentifiers: S.optional(ResourceIdentifiers),
  }),
).annotations({
  identifier: "ResourceIdentifierSummary",
}) as any as S.Schema<ResourceIdentifierSummary>;
export type ResourceIdentifierSummaries = ResourceIdentifierSummary[];
export const ResourceIdentifierSummaries = S.Array(ResourceIdentifierSummary);
export interface Warnings {
  UnrecognizedResourceTypes?: string[];
}
export const Warnings = S.suspend(() =>
  S.Struct({ UnrecognizedResourceTypes: S.optional(ResourceTypes) }),
).annotations({ identifier: "Warnings" }) as any as S.Schema<Warnings>;
export type RelatedResources = ScannedResource[];
export const RelatedResources = S.Array(ScannedResource);
export interface StackInstanceSummary {
  StackSetId?: string;
  Region?: string;
  Account?: string;
  StackId?: string;
  Status?: StackInstanceStatus;
  StatusReason?: string;
  StackInstanceStatus?: StackInstanceComprehensiveStatus;
  OrganizationalUnitId?: string;
  DriftStatus?: StackDriftStatus;
  LastDriftCheckTimestamp?: Date;
  LastOperationId?: string;
}
export const StackInstanceSummary = S.suspend(() =>
  S.Struct({
    StackSetId: S.optional(S.String),
    Region: S.optional(S.String),
    Account: S.optional(S.String),
    StackId: S.optional(S.String),
    Status: S.optional(StackInstanceStatus),
    StatusReason: S.optional(S.String),
    StackInstanceStatus: S.optional(StackInstanceComprehensiveStatus),
    OrganizationalUnitId: S.optional(S.String),
    DriftStatus: S.optional(StackDriftStatus),
    LastDriftCheckTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastOperationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StackInstanceSummary",
}) as any as S.Schema<StackInstanceSummary>;
export type StackInstanceSummaries = StackInstanceSummary[];
export const StackInstanceSummaries = S.Array(StackInstanceSummary);
export interface StackResourceSummary {
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  LastUpdatedTimestamp?: Date;
  ResourceStatus?: ResourceStatus;
  ResourceStatusReason?: string;
  DriftInformation?: StackResourceDriftInformationSummary;
  ModuleInfo?: ModuleInfo;
}
export const StackResourceSummary = S.suspend(() =>
  S.Struct({
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ResourceStatus: S.optional(ResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    DriftInformation: S.optional(StackResourceDriftInformationSummary),
    ModuleInfo: S.optional(ModuleInfo),
  }),
).annotations({
  identifier: "StackResourceSummary",
}) as any as S.Schema<StackResourceSummary>;
export type StackResourceSummaries = StackResourceSummary[];
export const StackResourceSummaries = S.Array(StackResourceSummary);
export interface StackSummary {
  StackId?: string;
  StackName?: string;
  TemplateDescription?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  DeletionTime?: Date;
  StackStatus?: StackStatus;
  StackStatusReason?: string;
  ParentId?: string;
  RootId?: string;
  DriftInformation?: StackDriftInformationSummary;
  LastOperations?: OperationEntry[];
}
export const StackSummary = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
    TemplateDescription: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StackStatus: S.optional(StackStatus),
    StackStatusReason: S.optional(S.String),
    ParentId: S.optional(S.String),
    RootId: S.optional(S.String),
    DriftInformation: S.optional(StackDriftInformationSummary),
    LastOperations: S.optional(LastOperations),
  }),
).annotations({ identifier: "StackSummary" }) as any as S.Schema<StackSummary>;
export type StackSummaries = StackSummary[];
export const StackSummaries = S.Array(StackSummary);
export interface TypeSummary {
  Type?: RegistryType;
  TypeName?: string;
  DefaultVersionId?: string;
  TypeArn?: string;
  LastUpdated?: Date;
  Description?: string;
  PublisherId?: string;
  OriginalTypeName?: string;
  PublicVersionNumber?: string;
  LatestPublicVersion?: string;
  PublisherIdentity?: IdentityProvider;
  PublisherName?: string;
  IsActivated?: boolean;
}
export const TypeSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(RegistryType),
    TypeName: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    PublisherId: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
    LatestPublicVersion: S.optional(S.String),
    PublisherIdentity: S.optional(IdentityProvider),
    PublisherName: S.optional(S.String),
    IsActivated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "TypeSummary" }) as any as S.Schema<TypeSummary>;
export type TypeSummaries = TypeSummary[];
export const TypeSummaries = S.Array(TypeSummary);
export interface ResourceDriftIgnoredAttribute {
  Path?: string;
  Reason?: DriftIgnoredReason;
}
export const ResourceDriftIgnoredAttribute = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    Reason: S.optional(DriftIgnoredReason),
  }),
).annotations({
  identifier: "ResourceDriftIgnoredAttribute",
}) as any as S.Schema<ResourceDriftIgnoredAttribute>;
export type ResourceDriftIgnoredAttributes = ResourceDriftIgnoredAttribute[];
export const ResourceDriftIgnoredAttributes = S.Array(
  ResourceDriftIgnoredAttribute,
);
export interface ChangeSetHookResourceTargetDetails {
  LogicalResourceId?: string;
  ResourceType?: string;
  ResourceAction?: ChangeAction;
}
export const ChangeSetHookResourceTargetDetails = S.suspend(() =>
  S.Struct({
    LogicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceAction: S.optional(ChangeAction),
  }),
).annotations({
  identifier: "ChangeSetHookResourceTargetDetails",
}) as any as S.Schema<ChangeSetHookResourceTargetDetails>;
export interface WarningProperty {
  PropertyPath?: string;
  Required?: boolean;
  Description?: string;
}
export const WarningProperty = S.suspend(() =>
  S.Struct({
    PropertyPath: S.optional(S.String),
    Required: S.optional(S.Boolean),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "WarningProperty",
}) as any as S.Schema<WarningProperty>;
export type WarningProperties = WarningProperty[];
export const WarningProperties = S.Array(WarningProperty);
export type AllowedValues = string[];
export const AllowedValues = S.Array(S.String);
export type AccountGateStatus =
  | "SUCCEEDED"
  | "FAILED"
  | "SKIPPED"
  | (string & {});
export const AccountGateStatus = S.String;
export interface BatchDescribeTypeConfigurationsOutput {
  Errors?: BatchDescribeTypeConfigurationsError[];
  UnprocessedTypeConfigurations?: TypeConfigurationIdentifier[];
  TypeConfigurations?: TypeConfigurationDetails[];
}
export const BatchDescribeTypeConfigurationsOutput = S.suspend(() =>
  S.Struct({
    Errors: S.optional(BatchDescribeTypeConfigurationsErrors),
    UnprocessedTypeConfigurations: S.optional(UnprocessedTypeConfigurations),
    TypeConfigurations: S.optional(TypeConfigurationDetailsList),
  }).pipe(ns),
).annotations({
  identifier: "BatchDescribeTypeConfigurationsOutput",
}) as any as S.Schema<BatchDescribeTypeConfigurationsOutput>;
export interface CreateChangeSetOutput {
  Id?: string;
  StackId?: string;
}
export const CreateChangeSetOutput = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), StackId: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateChangeSetOutput",
}) as any as S.Schema<CreateChangeSetOutput>;
export interface CreateStackRefactorOutput {
  StackRefactorId: string;
}
export const CreateStackRefactorOutput = S.suspend(() =>
  S.Struct({ StackRefactorId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateStackRefactorOutput",
}) as any as S.Schema<CreateStackRefactorOutput>;
export type RequiresRecreation =
  | "Never"
  | "Conditionally"
  | "Always"
  | (string & {});
export const RequiresRecreation = S.String;
export type BeforeValueFrom =
  | "PREVIOUS_DEPLOYMENT_STATE"
  | "ACTUAL_STATE"
  | (string & {});
export const BeforeValueFrom = S.String;
export type AfterValueFrom = "TEMPLATE" | (string & {});
export const AfterValueFrom = S.String;
export type AttributeChangeType =
  | "Add"
  | "Remove"
  | "Modify"
  | "SyncWithActual"
  | (string & {});
export const AttributeChangeType = S.String;
export interface DescribeEventsOutput {
  OperationEvents?: OperationEvent[];
  NextToken?: string;
}
export const DescribeEventsOutput = S.suspend(() =>
  S.Struct({
    OperationEvents: S.optional(OperationEvents),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEventsOutput",
}) as any as S.Schema<DescribeEventsOutput>;
export interface DescribeStackInstanceOutput {
  StackInstance?: StackInstance;
}
export const DescribeStackInstanceOutput = S.suspend(() =>
  S.Struct({ StackInstance: S.optional(StackInstance) }).pipe(ns),
).annotations({
  identifier: "DescribeStackInstanceOutput",
}) as any as S.Schema<DescribeStackInstanceOutput>;
export interface DescribeStackResourceOutput {
  StackResourceDetail?: StackResourceDetail & {
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    LastUpdatedTimestamp: Date;
    ResourceStatus: ResourceStatus;
    DriftInformation: StackResourceDriftInformation & {
      StackResourceDriftStatus: StackResourceDriftStatus;
    };
  };
}
export const DescribeStackResourceOutput = S.suspend(() =>
  S.Struct({ StackResourceDetail: S.optional(StackResourceDetail) }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourceOutput",
}) as any as S.Schema<DescribeStackResourceOutput>;
export interface DescribeStackResourceDriftsOutput {
  StackResourceDrifts: (StackResourceDrift & {
    StackId: StackId;
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    StackResourceDriftStatus: StackResourceDriftStatus;
    Timestamp: Date;
    PhysicalResourceIdContext: (PhysicalResourceIdContextKeyValuePair & {
      Key: Key;
      Value: Value;
    })[];
    PropertyDifferences: (PropertyDifference & {
      PropertyPath: PropertyPath;
      ExpectedValue: PropertyValue;
      ActualValue: PropertyValue;
      DifferenceType: DifferenceType;
    })[];
  })[];
  NextToken?: string;
}
export const DescribeStackResourceDriftsOutput = S.suspend(() =>
  S.Struct({
    StackResourceDrifts: S.optional(StackResourceDrifts),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourceDriftsOutput",
}) as any as S.Schema<DescribeStackResourceDriftsOutput>;
export interface DescribeStacksOutput {
  Stacks?: (Stack & {
    StackName: StackName;
    CreationTime: CreationTime;
    StackStatus: StackStatus;
    RollbackConfiguration: RollbackConfiguration & {
      RollbackTriggers: (RollbackTrigger & { Arn: Arn; Type: Type })[];
    };
    Tags: (Tag & { Key: TagKey; Value: TagValue })[];
    DriftInformation: StackDriftInformation & {
      StackDriftStatus: StackDriftStatus;
    };
  })[];
  NextToken?: string;
}
export const DescribeStacksOutput = S.suspend(() =>
  S.Struct({
    Stacks: S.optional(Stacks),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStacksOutput",
}) as any as S.Schema<DescribeStacksOutput>;
export interface DescribeStackSetOutput {
  StackSet?: StackSet & { Tags: (Tag & { Key: TagKey; Value: TagValue })[] };
}
export const DescribeStackSetOutput = S.suspend(() =>
  S.Struct({ StackSet: S.optional(StackSet) }).pipe(ns),
).annotations({
  identifier: "DescribeStackSetOutput",
}) as any as S.Schema<DescribeStackSetOutput>;
export interface DescribeStackSetOperationOutput {
  StackSetOperation?: StackSetOperation;
}
export const DescribeStackSetOperationOutput = S.suspend(() =>
  S.Struct({ StackSetOperation: S.optional(StackSetOperation) }).pipe(ns),
).annotations({
  identifier: "DescribeStackSetOperationOutput",
}) as any as S.Schema<DescribeStackSetOperationOutput>;
export interface ListResourceScanRelatedResourcesOutput {
  RelatedResources?: ScannedResource[];
  NextToken?: string;
}
export const ListResourceScanRelatedResourcesOutput = S.suspend(() =>
  S.Struct({
    RelatedResources: S.optional(RelatedResources),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceScanRelatedResourcesOutput",
}) as any as S.Schema<ListResourceScanRelatedResourcesOutput>;
export interface ListStackInstancesOutput {
  Summaries?: StackInstanceSummary[];
  NextToken?: string;
}
export const ListStackInstancesOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackInstanceSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackInstancesOutput",
}) as any as S.Schema<ListStackInstancesOutput>;
export interface ListStackResourcesOutput {
  StackResourceSummaries?: (StackResourceSummary & {
    LogicalResourceId: LogicalResourceId;
    ResourceType: ResourceType;
    LastUpdatedTimestamp: Date;
    ResourceStatus: ResourceStatus;
    DriftInformation: StackResourceDriftInformationSummary & {
      StackResourceDriftStatus: StackResourceDriftStatus;
    };
  })[];
  NextToken?: string;
}
export const ListStackResourcesOutput = S.suspend(() =>
  S.Struct({
    StackResourceSummaries: S.optional(StackResourceSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackResourcesOutput",
}) as any as S.Schema<ListStackResourcesOutput>;
export interface ListStacksOutput {
  StackSummaries?: (StackSummary & {
    StackName: StackName;
    CreationTime: CreationTime;
    StackStatus: StackStatus;
    DriftInformation: StackDriftInformationSummary & {
      StackDriftStatus: StackDriftStatus;
    };
  })[];
  NextToken?: string;
}
export const ListStacksOutput = S.suspend(() =>
  S.Struct({
    StackSummaries: S.optional(StackSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStacksOutput",
}) as any as S.Schema<ListStacksOutput>;
export interface ListTypesOutput {
  TypeSummaries?: TypeSummary[];
  NextToken?: string;
}
export const ListTypesOutput = S.suspend(() =>
  S.Struct({
    TypeSummaries: S.optional(TypeSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTypesOutput",
}) as any as S.Schema<ListTypesOutput>;
export interface ChangeSetHookTargetDetails {
  TargetType?: HookTargetType;
  ResourceTargetDetails?: ChangeSetHookResourceTargetDetails;
}
export const ChangeSetHookTargetDetails = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(HookTargetType),
    ResourceTargetDetails: S.optional(ChangeSetHookResourceTargetDetails),
  }),
).annotations({
  identifier: "ChangeSetHookTargetDetails",
}) as any as S.Schema<ChangeSetHookTargetDetails>;
export interface WarningDetail {
  Type?: WarningType;
  Properties?: WarningProperty[];
}
export const WarningDetail = S.suspend(() =>
  S.Struct({
    Type: S.optional(WarningType),
    Properties: S.optional(WarningProperties),
  }),
).annotations({
  identifier: "WarningDetail",
}) as any as S.Schema<WarningDetail>;
export type WarningDetails = WarningDetail[];
export const WarningDetails = S.Array(WarningDetail);
export interface ParameterConstraints {
  AllowedValues?: string[];
}
export const ParameterConstraints = S.suspend(() =>
  S.Struct({ AllowedValues: S.optional(AllowedValues) }),
).annotations({
  identifier: "ParameterConstraints",
}) as any as S.Schema<ParameterConstraints>;
export interface AccountGateResult {
  Status?: AccountGateStatus;
  StatusReason?: string;
}
export const AccountGateResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(AccountGateStatus),
    StatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountGateResult",
}) as any as S.Schema<AccountGateResult>;
export interface ChangeSetHook {
  InvocationPoint?: HookInvocationPoint;
  FailureMode?: HookFailureMode;
  TypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  TargetDetails?: ChangeSetHookTargetDetails;
}
export const ChangeSetHook = S.suspend(() =>
  S.Struct({
    InvocationPoint: S.optional(HookInvocationPoint),
    FailureMode: S.optional(HookFailureMode),
    TypeName: S.optional(S.String),
    TypeVersionId: S.optional(S.String),
    TypeConfigurationVersionId: S.optional(S.String),
    TargetDetails: S.optional(ChangeSetHookTargetDetails),
  }),
).annotations({
  identifier: "ChangeSetHook",
}) as any as S.Schema<ChangeSetHook>;
export type ChangeSetHooks = ChangeSetHook[];
export const ChangeSetHooks = S.Array(ChangeSetHook);
export interface ResourceDetail {
  ResourceType?: string;
  LogicalResourceId?: string;
  ResourceIdentifier?: { [key: string]: string | undefined };
  ResourceStatus?: GeneratedTemplateResourceStatus;
  ResourceStatusReason?: string;
  Warnings?: WarningDetail[];
}
export const ResourceDetail = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(ResourceIdentifierProperties),
    ResourceStatus: S.optional(GeneratedTemplateResourceStatus),
    ResourceStatusReason: S.optional(S.String),
    Warnings: S.optional(WarningDetails),
  }),
).annotations({
  identifier: "ResourceDetail",
}) as any as S.Schema<ResourceDetail>;
export type ResourceDetails = ResourceDetail[];
export const ResourceDetails = S.Array(ResourceDetail);
export interface ParameterDeclaration {
  ParameterKey?: string;
  DefaultValue?: string;
  ParameterType?: string;
  NoEcho?: boolean;
  Description?: string;
  ParameterConstraints?: ParameterConstraints;
}
export const ParameterDeclaration = S.suspend(() =>
  S.Struct({
    ParameterKey: S.optional(S.String),
    DefaultValue: S.optional(S.String),
    ParameterType: S.optional(S.String),
    NoEcho: S.optional(S.Boolean),
    Description: S.optional(S.String),
    ParameterConstraints: S.optional(ParameterConstraints),
  }),
).annotations({
  identifier: "ParameterDeclaration",
}) as any as S.Schema<ParameterDeclaration>;
export type ParameterDeclarations = ParameterDeclaration[];
export const ParameterDeclarations = S.Array(ParameterDeclaration);
export interface StackSetOperationResultSummary {
  Account?: string;
  Region?: string;
  Status?: StackSetOperationResultStatus;
  StatusReason?: string;
  AccountGateResult?: AccountGateResult;
  OrganizationalUnitId?: string;
}
export const StackSetOperationResultSummary = S.suspend(() =>
  S.Struct({
    Account: S.optional(S.String),
    Region: S.optional(S.String),
    Status: S.optional(StackSetOperationResultStatus),
    StatusReason: S.optional(S.String),
    AccountGateResult: S.optional(AccountGateResult),
    OrganizationalUnitId: S.optional(S.String),
  }),
).annotations({
  identifier: "StackSetOperationResultSummary",
}) as any as S.Schema<StackSetOperationResultSummary>;
export type StackSetOperationResultSummaries = StackSetOperationResultSummary[];
export const StackSetOperationResultSummaries = S.Array(
  StackSetOperationResultSummary,
);
export interface LiveResourceDrift {
  PreviousValue?: string;
  ActualValue?: string;
  DriftDetectionTimestamp?: Date;
}
export const LiveResourceDrift = S.suspend(() =>
  S.Struct({
    PreviousValue: S.optional(S.String),
    ActualValue: S.optional(S.String),
    DriftDetectionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "LiveResourceDrift",
}) as any as S.Schema<LiveResourceDrift>;
export interface DescribeChangeSetHooksOutput {
  ChangeSetId?: string;
  ChangeSetName?: string;
  Hooks?: ChangeSetHook[];
  Status?: ChangeSetHooksStatus;
  NextToken?: string;
  StackId?: string;
  StackName?: string;
}
export const DescribeChangeSetHooksOutput = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    Hooks: S.optional(ChangeSetHooks),
    Status: S.optional(ChangeSetHooksStatus),
    NextToken: S.optional(S.String),
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeChangeSetHooksOutput",
}) as any as S.Schema<DescribeChangeSetHooksOutput>;
export interface DescribeGeneratedTemplateOutput {
  GeneratedTemplateId?: string;
  GeneratedTemplateName?: string;
  Resources?: ResourceDetail[];
  Status?: GeneratedTemplateStatus;
  StatusReason?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  Progress?: TemplateProgress;
  StackId?: string;
  TemplateConfiguration?: TemplateConfiguration;
  TotalWarnings?: number;
}
export const DescribeGeneratedTemplateOutput = S.suspend(() =>
  S.Struct({
    GeneratedTemplateId: S.optional(S.String),
    GeneratedTemplateName: S.optional(S.String),
    Resources: S.optional(ResourceDetails),
    Status: S.optional(GeneratedTemplateStatus),
    StatusReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Progress: S.optional(TemplateProgress),
    StackId: S.optional(S.String),
    TemplateConfiguration: S.optional(TemplateConfiguration),
    TotalWarnings: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGeneratedTemplateOutput",
}) as any as S.Schema<DescribeGeneratedTemplateOutput>;
export interface GetTemplateSummaryOutput {
  Parameters?: ParameterDeclaration[];
  Description?: string;
  Capabilities?: Capability[];
  CapabilitiesReason?: string;
  ResourceTypes?: string[];
  Version?: string;
  Metadata?: string;
  DeclaredTransforms?: string[];
  ResourceIdentifierSummaries?: ResourceIdentifierSummary[];
  Warnings?: Warnings;
}
export const GetTemplateSummaryOutput = S.suspend(() =>
  S.Struct({
    Parameters: S.optional(ParameterDeclarations),
    Description: S.optional(S.String),
    Capabilities: S.optional(Capabilities),
    CapabilitiesReason: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypes),
    Version: S.optional(S.String),
    Metadata: S.optional(S.String),
    DeclaredTransforms: S.optional(TransformsList),
    ResourceIdentifierSummaries: S.optional(ResourceIdentifierSummaries),
    Warnings: S.optional(Warnings),
  }).pipe(ns),
).annotations({
  identifier: "GetTemplateSummaryOutput",
}) as any as S.Schema<GetTemplateSummaryOutput>;
export interface ListStackSetOperationResultsOutput {
  Summaries?: StackSetOperationResultSummary[];
  NextToken?: string;
}
export const ListStackSetOperationResultsOutput = S.suspend(() =>
  S.Struct({
    Summaries: S.optional(StackSetOperationResultSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackSetOperationResultsOutput",
}) as any as S.Schema<ListStackSetOperationResultsOutput>;
export interface ResourceTargetDefinition {
  Attribute?: ResourceAttribute;
  Name?: string;
  RequiresRecreation?: RequiresRecreation;
  Path?: string;
  BeforeValue?: string;
  AfterValue?: string;
  BeforeValueFrom?: BeforeValueFrom;
  AfterValueFrom?: AfterValueFrom;
  Drift?: LiveResourceDrift;
  AttributeChangeType?: AttributeChangeType;
}
export const ResourceTargetDefinition = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(ResourceAttribute),
    Name: S.optional(S.String),
    RequiresRecreation: S.optional(RequiresRecreation),
    Path: S.optional(S.String),
    BeforeValue: S.optional(S.String),
    AfterValue: S.optional(S.String),
    BeforeValueFrom: S.optional(BeforeValueFrom),
    AfterValueFrom: S.optional(AfterValueFrom),
    Drift: S.optional(LiveResourceDrift),
    AttributeChangeType: S.optional(AttributeChangeType),
  }),
).annotations({
  identifier: "ResourceTargetDefinition",
}) as any as S.Schema<ResourceTargetDefinition>;
export interface ResourceChangeDetail {
  Target?: ResourceTargetDefinition;
  Evaluation?: EvaluationType;
  ChangeSource?: ChangeSource;
  CausingEntity?: string;
}
export const ResourceChangeDetail = S.suspend(() =>
  S.Struct({
    Target: S.optional(ResourceTargetDefinition),
    Evaluation: S.optional(EvaluationType),
    ChangeSource: S.optional(ChangeSource),
    CausingEntity: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceChangeDetail",
}) as any as S.Schema<ResourceChangeDetail>;
export type ResourceChangeDetails = ResourceChangeDetail[];
export const ResourceChangeDetails = S.Array(ResourceChangeDetail);
export interface ResourceChange {
  PolicyAction?: PolicyAction;
  Action?: ChangeAction;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Replacement?: Replacement;
  Scope?: ResourceAttribute[];
  ResourceDriftStatus?: StackResourceDriftStatus;
  ResourceDriftIgnoredAttributes?: ResourceDriftIgnoredAttribute[];
  Details?: ResourceChangeDetail[];
  ChangeSetId?: string;
  ModuleInfo?: ModuleInfo;
  BeforeContext?: string;
  AfterContext?: string;
  PreviousDeploymentContext?: string;
}
export const ResourceChange = S.suspend(() =>
  S.Struct({
    PolicyAction: S.optional(PolicyAction),
    Action: S.optional(ChangeAction),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Replacement: S.optional(Replacement),
    Scope: S.optional(Scope),
    ResourceDriftStatus: S.optional(StackResourceDriftStatus),
    ResourceDriftIgnoredAttributes: S.optional(ResourceDriftIgnoredAttributes),
    Details: S.optional(ResourceChangeDetails),
    ChangeSetId: S.optional(S.String),
    ModuleInfo: S.optional(ModuleInfo),
    BeforeContext: S.optional(S.String),
    AfterContext: S.optional(S.String),
    PreviousDeploymentContext: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceChange",
}) as any as S.Schema<ResourceChange>;
export interface Change {
  Type?: ChangeType;
  HookInvocationCount?: number;
  ResourceChange?: ResourceChange;
}
export const Change = S.suspend(() =>
  S.Struct({
    Type: S.optional(ChangeType),
    HookInvocationCount: S.optional(S.Number),
    ResourceChange: S.optional(ResourceChange),
  }),
).annotations({ identifier: "Change" }) as any as S.Schema<Change>;
export type Changes = Change[];
export const Changes = S.Array(Change);
export interface DescribeChangeSetOutput {
  ChangeSetName?: string;
  ChangeSetId?: string;
  StackId?: string;
  StackName?: string;
  Description?: string;
  Parameters?: Parameter[];
  CreationTime?: Date;
  ExecutionStatus?: ExecutionStatus;
  Status?: ChangeSetStatus;
  StatusReason?: string;
  StackDriftStatus?: StackDriftStatus;
  NotificationARNs?: string[];
  RollbackConfiguration?: RollbackConfiguration & {
    RollbackTriggers: (RollbackTrigger & { Arn: Arn; Type: Type })[];
  };
  Capabilities?: Capability[];
  Tags?: (Tag & { Key: TagKey; Value: TagValue })[];
  Changes?: Change[];
  NextToken?: string;
  IncludeNestedStacks?: boolean;
  ParentChangeSetId?: string;
  RootChangeSetId?: string;
  OnStackFailure?: OnStackFailure;
  ImportExistingResources?: boolean;
  DeploymentMode?: DeploymentMode;
}
export const DescribeChangeSetOutput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.optional(S.String),
    ChangeSetId: S.optional(S.String),
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(Parameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExecutionStatus: S.optional(ExecutionStatus),
    Status: S.optional(ChangeSetStatus),
    StatusReason: S.optional(S.String),
    StackDriftStatus: S.optional(StackDriftStatus),
    NotificationARNs: S.optional(NotificationARNs),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    Changes: S.optional(Changes),
    NextToken: S.optional(S.String),
    IncludeNestedStacks: S.optional(S.Boolean),
    ParentChangeSetId: S.optional(S.String),
    RootChangeSetId: S.optional(S.String),
    OnStackFailure: S.optional(OnStackFailure),
    ImportExistingResources: S.optional(S.Boolean),
    DeploymentMode: S.optional(DeploymentMode),
  }).pipe(ns),
).annotations({
  identifier: "DescribeChangeSetOutput",
}) as any as S.Schema<DescribeChangeSetOutput>;

//# Errors
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidOperationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OperationNotFoundException extends S.TaggedError<OperationNotFoundException>()(
  "OperationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OperationNotFoundException",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class TokenAlreadyExistsException extends S.TaggedError<TokenAlreadyExistsException>()(
  "TokenAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TokenAlreadyExistsException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CFNRegistryException extends S.TaggedError<CFNRegistryException>()(
  "CFNRegistryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "CFNRegistryException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidChangeSetStatusException extends S.TaggedError<InvalidChangeSetStatusException>()(
  "InvalidChangeSetStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidChangeSetStatus", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConcurrentResourcesLimitExceededException extends S.TaggedError<ConcurrentResourcesLimitExceededException>()(
  "ConcurrentResourcesLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentResourcesLimitExceeded",
    httpResponseCode: 429,
  }),
).pipe(C.withThrottlingError) {}
export class OperationInProgressException extends S.TaggedError<OperationInProgressException>()(
  "OperationInProgressException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OperationInProgressException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class ChangeSetNotFoundException extends S.TaggedError<ChangeSetNotFoundException>()(
  "ChangeSetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChangeSetNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidStateTransition", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExistsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TypeNotFoundException extends S.TaggedError<TypeNotFoundException>()(
  "TypeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TypeNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class GeneratedTemplateNotFoundException extends S.TaggedError<GeneratedTemplateNotFoundException>()(
  "GeneratedTemplateNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "GeneratedTemplateNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class OperationIdAlreadyExistsException extends S.TaggedError<OperationIdAlreadyExistsException>()(
  "OperationIdAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OperationIdAlreadyExistsException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class StackSetNotEmptyException extends S.TaggedError<StackSetNotEmptyException>()(
  "StackSetNotEmptyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StackSetNotEmptyException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ResourceScanNotFoundException extends S.TaggedError<ResourceScanNotFoundException>()(
  "ResourceScanNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceScanNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StackRefactorNotFoundException extends S.TaggedError<StackRefactorNotFoundException>()(
  "StackRefactorNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "StackRefactorNotFoundException",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class StackSetNotFoundException extends S.TaggedError<StackSetNotFoundException>()(
  "StackSetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StackSetNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InsufficientCapabilitiesException extends S.TaggedError<InsufficientCapabilitiesException>()(
  "InsufficientCapabilitiesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientCapabilitiesException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class OperationStatusCheckFailedException extends S.TaggedError<OperationStatusCheckFailedException>()(
  "OperationStatusCheckFailedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConditionalCheckFailed", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CreatedButModifiedException extends S.TaggedError<CreatedButModifiedException>()(
  "CreatedButModifiedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CreatedButModifiedException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class HookResultNotFoundException extends S.TaggedError<HookResultNotFoundException>()(
  "HookResultNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "HookResultNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class StackNotFoundException extends S.TaggedError<StackNotFoundException>()(
  "StackNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StackNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceScanInProgressException extends S.TaggedError<ResourceScanInProgressException>()(
  "ResourceScanInProgressException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceScanInProgress", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StackInstanceNotFoundException extends S.TaggedError<StackInstanceNotFoundException>()(
  "StackInstanceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "StackInstanceNotFoundException",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class StaleRequestException extends S.TaggedError<StaleRequestException>()(
  "StaleRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StaleRequestException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class TypeConfigurationNotFoundException extends S.TaggedError<TypeConfigurationNotFoundException>()(
  "TypeConfigurationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TypeConfigurationNotFoundException",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class NameAlreadyExistsException extends S.TaggedError<NameAlreadyExistsException>()(
  "NameAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NameAlreadyExistsException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class ResourceScanLimitExceededException extends S.TaggedError<ResourceScanLimitExceededException>()(
  "ResourceScanLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceScanLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Executes the stack refactor operation.
 */
export const executeStackRefactor: (
  input: ExecuteStackRefactorInput,
) => effect.Effect<
  ExecuteStackRefactorResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteStackRefactorInput,
  output: ExecuteStackRefactorResponse,
  errors: [],
}));
/**
 * Sets a stack policy for a specified stack.
 */
export const setStackPolicy: (
  input: SetStackPolicyInput,
) => effect.Effect<
  SetStackPolicyResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetStackPolicyInput,
  output: SetStackPolicyResponse,
  errors: [],
}));
/**
 * Sends a signal to the specified resource with a success or failure status. You can use the
 * `SignalResource` operation in conjunction with a creation policy or update
 * policy. CloudFormation doesn't proceed with a stack creation or update until resources receive the
 * required number of signals or the timeout period is exceeded. The `SignalResource`
 * operation is useful in cases where you want to send signals from anywhere other than an Amazon EC2
 * instance.
 */
export const signalResource: (
  input: SignalResourceInput,
) => effect.Effect<
  SignalResourceResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignalResourceInput,
  output: SignalResourceResponse,
  errors: [],
}));
/**
 * Activate trusted access with Organizations. With trusted access between StackSets
 * and Organizations activated, the management account has permissions to create
 * and manage StackSets for your organization.
 */
export const activateOrganizationsAccess: (
  input: ActivateOrganizationsAccessInput,
) => effect.Effect<
  ActivateOrganizationsAccessOutput,
  InvalidOperationException | OperationNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateOrganizationsAccessInput,
  output: ActivateOrganizationsAccessOutput,
  errors: [InvalidOperationException, OperationNotFoundException],
}));
/**
 * Cancels an update on the specified stack. If the call completes successfully, the stack
 * rolls back the update and reverts to the previous stack configuration.
 *
 * You can cancel only stacks that are in the `UPDATE_IN_PROGRESS` state.
 */
export const cancelUpdateStack: (
  input: CancelUpdateStackInput,
) => effect.Effect<
  CancelUpdateStackResponse,
  TokenAlreadyExistsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelUpdateStackInput,
  output: CancelUpdateStackResponse,
  errors: [TokenAlreadyExistsException],
}));
/**
 * Deletes the specified change set. Deleting change sets ensures that no one executes the
 * wrong change set.
 *
 * If the call successfully completes, CloudFormation successfully deleted the change set.
 *
 * If `IncludeNestedStacks` specifies `True` during the creation of the
 * nested change set, then `DeleteChangeSet` will delete all change sets that belong
 * to the stacks hierarchy and will also delete all change sets for nested stacks with the status
 * of `REVIEW_IN_PROGRESS`.
 */
export const deleteChangeSet: (
  input: DeleteChangeSetInput,
) => effect.Effect<
  DeleteChangeSetOutput,
  InvalidChangeSetStatusException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChangeSetInput,
  output: DeleteChangeSetOutput,
  errors: [InvalidChangeSetStatusException],
}));
/**
 * Retrieves information about the account's `OrganizationAccess` status. This API
 * can be called either by the management account or the delegated administrator by using the
 * `CallAs` parameter. This API can also be called without the `CallAs`
 * parameter by the management account.
 */
export const describeOrganizationsAccess: (
  input: DescribeOrganizationsAccessInput,
) => effect.Effect<
  DescribeOrganizationsAccessOutput,
  InvalidOperationException | OperationNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationsAccessInput,
  output: DescribeOrganizationsAccessOutput,
  errors: [InvalidOperationException, OperationNotFoundException],
}));
/**
 * Returns information about a CloudFormation extension publisher.
 *
 * If you don't supply a `PublisherId`, and you have registered as an extension
 * publisher, `DescribePublisher` returns information about your own publisher
 * account.
 *
 * For more information about registering as a publisher, see:
 *
 * - RegisterPublisher
 *
 * - Publishing extensions
 * to make them available for public use in the
 * *CloudFormation Command Line Interface (CLI) User Guide*
 */
export const describePublisher: (
  input: DescribePublisherInput,
) => effect.Effect<
  DescribePublisherOutput,
  CFNRegistryException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePublisherInput,
  output: DescribePublisherOutput,
  errors: [CFNRegistryException],
}));
/**
 * Returns information about a stack drift detection operation. A stack drift detection
 * operation detects whether a stack's actual configuration differs, or has
 * *drifted*, from its expected configuration, as defined in the stack
 * template and any values specified as template parameters. A stack is considered to have
 * drifted if one or more of its resources have drifted. For more information about stack and
 * resource drift, see Detect unmanaged
 * configuration changes to stacks and resources with drift detection.
 *
 * Use DetectStackDrift to initiate a stack drift detection operation.
 * `DetectStackDrift` returns a `StackDriftDetectionId` you can use to
 * monitor the progress of the operation using `DescribeStackDriftDetectionStatus`.
 * Once the drift detection operation has completed, use DescribeStackResourceDrifts to return drift information about the stack and its
 * resources.
 */
export const describeStackDriftDetectionStatus: (
  input: DescribeStackDriftDetectionStatusInput,
) => effect.Effect<
  DescribeStackDriftDetectionStatusOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackDriftDetectionStatusInput,
  output: DescribeStackDriftDetectionStatusOutput,
  errors: [],
}));
/**
 * Returns information about an extension's registration, including its current status and
 * type and version identifiers.
 *
 * When you initiate a registration request using RegisterType, you can
 * then use DescribeTypeRegistration to monitor the progress of that
 * registration request.
 *
 * Once the registration request has completed, use DescribeType to return
 * detailed information about an extension.
 */
export const describeTypeRegistration: (
  input: DescribeTypeRegistrationInput,
) => effect.Effect<
  DescribeTypeRegistrationOutput,
  CFNRegistryException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTypeRegistrationInput,
  output: DescribeTypeRegistrationOutput,
  errors: [CFNRegistryException],
}));
/**
 * Detects whether a stack's actual configuration differs, or has
 * *drifted*, from its expected configuration, as defined in the stack
 * template and any values specified as template parameters. For each resource in the stack that
 * supports drift detection, CloudFormation compares the actual configuration of the resource with
 * its expected template configuration. Only resource properties explicitly defined in the stack
 * template are checked for drift. A stack is considered to have drifted if one or more of its
 * resources differ from their expected template configurations. For more information, see Detect unmanaged configuration changes to stacks and resources with drift
 * detection.
 *
 * Use `DetectStackDrift` to detect drift on all supported resources for a given
 * stack, or DetectStackResourceDrift to detect drift on individual
 * resources.
 *
 * For a list of stack resources that currently support drift detection, see Resource
 * type support for imports and drift detection.
 *
 * `DetectStackDrift` can take up to several minutes, depending on the number of
 * resources contained within the stack. Use DescribeStackDriftDetectionStatus
 * to monitor the progress of a detect stack drift operation. Once the drift detection operation
 * has completed, use DescribeStackResourceDrifts to return drift information
 * about the stack and its resources.
 *
 * When detecting drift on a stack, CloudFormation doesn't detect drift on any nested stacks
 * belonging to that stack. Perform `DetectStackDrift` directly on the nested stack
 * itself.
 */
export const detectStackDrift: (
  input: DetectStackDriftInput,
) => effect.Effect<
  DetectStackDriftOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectStackDriftInput,
  output: DetectStackDriftOutput,
  errors: [],
}));
/**
 * Returns information about whether a resource's actual configuration differs, or has
 * *drifted*, from its expected configuration, as defined in the stack
 * template and any values specified as template parameters. This information includes actual and
 * expected property values for resources in which CloudFormation detects drift. Only resource
 * properties explicitly defined in the stack template are checked for drift. For more
 * information about stack and resource drift, see Detect unmanaged
 * configuration changes to stacks and resources with drift detection.
 *
 * Use `DetectStackResourceDrift` to detect drift on individual resources, or
 * DetectStackDrift to detect drift on all resources in a given stack that
 * support drift detection.
 *
 * Resources that don't currently support drift detection can't be checked. For a list of
 * resources that support drift detection, see Resource
 * type support for imports and drift detection.
 */
export const detectStackResourceDrift: (
  input: DetectStackResourceDriftInput,
) => effect.Effect<
  DetectStackResourceDriftOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectStackResourceDriftInput,
  output: DetectStackResourceDriftOutput,
  errors: [],
}));
/**
 * Returns the estimated monthly cost of a template. The return value is an Amazon Web Services Simple
 * Monthly Calculator URL with a query string that describes the resources required to run the
 * template.
 */
export const estimateTemplateCost: (
  input: EstimateTemplateCostInput,
) => effect.Effect<
  EstimateTemplateCostOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EstimateTemplateCostInput,
  output: EstimateTemplateCostOutput,
  errors: [],
}));
/**
 * Returns the stack policy for a specified stack. If a stack doesn't have a policy, a null
 * value is returned.
 */
export const getStackPolicy: (
  input: GetStackPolicyInput,
) => effect.Effect<
  GetStackPolicyOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStackPolicyInput,
  output: GetStackPolicyOutput,
  errors: [],
}));
/**
 * Returns the template body for a specified stack. You can get the template for running or
 * deleted stacks.
 *
 * For deleted stacks, `GetTemplate` returns the template for up to 90 days after
 * the stack has been deleted.
 *
 * If the template doesn't exist, a `ValidationError` is returned.
 */
export const getTemplate: (
  input: GetTemplateInput,
) => effect.Effect<
  GetTemplateOutput,
  ChangeSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateInput,
  output: GetTemplateOutput,
  errors: [ChangeSetNotFoundException],
}));
/**
 * Lists all stacks that are importing an exported output value. To modify or remove an
 * exported output value, first use this action to see which stacks are using it. To see the
 * exported output values in your account, see ListExports.
 *
 * For more information about importing an exported output value, see the Fn::ImportValue function.
 */
export const listImports: {
  (
    input: ListImportsInput,
  ): effect.Effect<
    ListImportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportsInput,
  ) => stream.Stream<
    ListImportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListImportsInput,
  ) => stream.Stream<
    StackName,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportsInput,
  output: ListImportsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Imports",
  } as const,
}));
/**
 * Returns a list of registration tokens for the specified extension(s).
 */
export const listTypeRegistrations: {
  (
    input: ListTypeRegistrationsInput,
  ): effect.Effect<
    ListTypeRegistrationsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypeRegistrationsInput,
  ) => stream.Stream<
    ListTypeRegistrationsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypeRegistrationsInput,
  ) => stream.Stream<
    unknown,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypeRegistrationsInput,
  output: ListTypeRegistrationsOutput,
  errors: [CFNRegistryException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Registers your account as a publisher of public extensions in the CloudFormation registry.
 * Public extensions are available for use by all CloudFormation users. This publisher ID applies to
 * your account in all Amazon Web Services Regions.
 *
 * For information about requirements for registering as a public extension publisher, see
 * Prerequisite: Registering your account to publish CloudFormation extensions in the
 * *CloudFormation Command Line Interface (CLI) User Guide*.
 */
export const registerPublisher: (
  input: RegisterPublisherInput,
) => effect.Effect<
  RegisterPublisherOutput,
  CFNRegistryException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterPublisherInput,
  output: RegisterPublisherOutput,
  errors: [CFNRegistryException],
}));
/**
 * Registers an extension with the CloudFormation service. Registering an extension makes it
 * available for use in CloudFormation templates in your Amazon Web Services account, and includes:
 *
 * - Validating the extension schema.
 *
 * - Determining which handlers, if any, have been specified for the extension.
 *
 * - Making the extension available for use in your account.
 *
 * For more information about how to develop extensions and ready them for registration, see
 * Creating resource types using the CloudFormation CLI in the
 * *CloudFormation Command Line Interface (CLI) User Guide*.
 *
 * You can have a maximum of 50 resource extension versions registered at a time. This
 * maximum is per account and per Region. Use DeregisterType
 * to deregister specific extension versions if necessary.
 *
 * Once you have initiated a registration request using RegisterType, you
 * can use DescribeTypeRegistration to monitor the progress of the registration
 * request.
 *
 * Once you have registered a private extension in your account and Region, use SetTypeConfiguration to specify configuration properties for the extension. For
 * more information, see Edit configuration
 * data for extensions in your account in the
 * *CloudFormation User Guide*.
 */
export const registerType: (
  input: RegisterTypeInput,
) => effect.Effect<
  RegisterTypeOutput,
  CFNRegistryException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTypeInput,
  output: RegisterTypeOutput,
  errors: [CFNRegistryException],
}));
/**
 * When specifying `RollbackStack`, you preserve the state of previously
 * provisioned resources when an operation fails. You can check the status of the stack through
 * the DescribeStacks operation.
 *
 * Rolls back the specified stack to the last known stable state from
 * `CREATE_FAILED` or `UPDATE_FAILED` stack statuses.
 *
 * This operation will delete a stack if it doesn't contain a last known stable state. A last
 * known stable state includes any status in a `*_COMPLETE`. This includes the
 * following stack statuses.
 *
 * - `CREATE_COMPLETE`
 *
 * - `UPDATE_COMPLETE`
 *
 * - `UPDATE_ROLLBACK_COMPLETE`
 *
 * - `IMPORT_COMPLETE`
 *
 * - `IMPORT_ROLLBACK_COMPLETE`
 */
export const rollbackStack: (
  input: RollbackStackInput,
) => effect.Effect<
  RollbackStackOutput,
  TokenAlreadyExistsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackStackInput,
  output: RollbackStackOutput,
  errors: [TokenAlreadyExistsException],
}));
/**
 * Updates termination protection for the specified stack. If a user attempts to delete a
 * stack with termination protection enabled, the operation fails and the stack remains
 * unchanged. For more information, see Protect a CloudFormation
 * stack from being deleted in the *CloudFormation User Guide*.
 *
 * For nested stacks,
 * termination protection is set on the root stack and can't be changed directly on the nested
 * stack.
 */
export const updateTerminationProtection: (
  input: UpdateTerminationProtectionInput,
) => effect.Effect<
  UpdateTerminationProtectionOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTerminationProtectionInput,
  output: UpdateTerminationProtectionOutput,
  errors: [],
}));
/**
 * Deactivates trusted access with Organizations. If trusted access is deactivated,
 * the management account does not have permissions to create and manage
 * service-managed StackSets for your organization.
 */
export const deactivateOrganizationsAccess: (
  input: DeactivateOrganizationsAccessInput,
) => effect.Effect<
  DeactivateOrganizationsAccessOutput,
  InvalidOperationException | OperationNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateOrganizationsAccessInput,
  output: DeactivateOrganizationsAccessOutput,
  errors: [InvalidOperationException, OperationNotFoundException],
}));
/**
 * Continues rolling back a stack from `UPDATE_ROLLBACK_FAILED` to
 * `UPDATE_ROLLBACK_COMPLETE` state. Depending on the cause of the failure, you can
 * manually fix the error and continue the rollback. By continuing the rollback, you can return
 * your stack to a working state (the `UPDATE_ROLLBACK_COMPLETE` state) and then try
 * to update the stack again.
 *
 * A stack enters the `UPDATE_ROLLBACK_FAILED` state when CloudFormation can't roll
 * back all changes after a failed stack update. For example, this might occur when a stack
 * attempts to roll back to an old database that was deleted outside of CloudFormation. Because
 * CloudFormation doesn't know the instance was deleted, it assumes the instance still exists and
 * attempts to roll back to it, causing the update rollback to fail.
 *
 * For more information, see Continue rolling back an update in the *CloudFormation User Guide*. For
 * information for troubleshooting a failed update rollback, see Update rollback failed.
 */
export const continueUpdateRollback: (
  input: ContinueUpdateRollbackInput,
) => effect.Effect<
  ContinueUpdateRollbackOutput,
  TokenAlreadyExistsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ContinueUpdateRollbackInput,
  output: ContinueUpdateRollbackOutput,
  errors: [TokenAlreadyExistsException],
}));
/**
 * Deletes a specified stack. Once the call completes successfully, stack deletion starts.
 * Deleted stacks don't show up in the DescribeStacks operation if the deletion
 * has been completed successfully.
 *
 * For more information about deleting a stack, see Delete a stack from
 * the CloudFormation console in the *CloudFormation User Guide*.
 */
export const deleteStack: (
  input: DeleteStackInput,
) => effect.Effect<
  DeleteStackResponse,
  TokenAlreadyExistsException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackInput,
  output: DeleteStackResponse,
  errors: [TokenAlreadyExistsException],
}));
/**
 * Deactivates a public third-party extension, such as a resource or module, or a CloudFormation
 * Hook when you no longer use it.
 *
 * Deactivating an extension deletes the configuration details that are associated with it.
 * To temporarily disable a CloudFormation Hook instead, you can use SetTypeConfiguration.
 *
 * Once deactivated, an extension can't be used in any CloudFormation operation. This includes
 * stack update operations where the stack template includes the extension, even if no updates
 * are being made to the extension. In addition, deactivated extensions aren't automatically
 * updated if a new version of the extension is released.
 *
 * To see which extensions are currently activated, use ListTypes.
 */
export const deactivateType: (
  input: DeactivateTypeInput,
) => effect.Effect<
  DeactivateTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateTypeInput,
  output: DeactivateTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Deleted a generated template.
 */
export const deleteGeneratedTemplate: (
  input: DeleteGeneratedTemplateInput,
) => effect.Effect<
  DeleteGeneratedTemplateResponse,
  | ConcurrentResourcesLimitExceededException
  | GeneratedTemplateNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGeneratedTemplateInput,
  output: DeleteGeneratedTemplateResponse,
  errors: [
    ConcurrentResourcesLimitExceededException,
    GeneratedTemplateNotFoundException,
  ],
}));
/**
 * Deletes a StackSet. Before you can delete a StackSet, all its member stack instances must
 * be deleted. For more information about how to complete this, see DeleteStackInstances.
 */
export const deleteStackSet: (
  input: DeleteStackSetInput,
) => effect.Effect<
  DeleteStackSetOutput,
  OperationInProgressException | StackSetNotEmptyException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackSetInput,
  output: DeleteStackSetOutput,
  errors: [OperationInProgressException, StackSetNotEmptyException],
}));
/**
 * Retrieves your account's CloudFormation limits, such as the maximum number of stacks that you
 * can create in your account. For more information about account limits, see Understand CloudFormation quotas in the *CloudFormation User Guide*.
 */
export const describeAccountLimits: {
  (
    input: DescribeAccountLimitsInput,
  ): effect.Effect<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccountLimitsInput,
  ) => stream.Stream<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccountLimitsInput,
  ) => stream.Stream<
    AccountLimit,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccountLimitsInput,
  output: DescribeAccountLimitsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccountLimits",
  } as const,
}));
/**
 * Describes details of a resource scan.
 */
export const describeResourceScan: (
  input: DescribeResourceScanInput,
) => effect.Effect<
  DescribeResourceScanOutput,
  ResourceScanNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceScanInput,
  output: DescribeResourceScanOutput,
  errors: [ResourceScanNotFoundException],
}));
/**
 * Returns all stack related events for a specified stack in reverse chronological order. For
 * more information about a stack's event history, see Understand CloudFormation stack creation events in the
 * *CloudFormation User Guide*.
 *
 * You can list events for stacks that have failed to create or have been deleted by
 * specifying the unique stack identifier (stack ID).
 */
export const describeStackEvents: {
  (
    input: DescribeStackEventsInput,
  ): effect.Effect<
    DescribeStackEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStackEventsInput,
  ) => stream.Stream<
    DescribeStackEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStackEventsInput,
  ) => stream.Stream<
    StackEvent,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStackEventsInput,
  output: DescribeStackEventsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StackEvents",
  } as const,
}));
/**
 * Describes the stack refactor status.
 */
export const describeStackRefactor: (
  input: DescribeStackRefactorInput,
) => effect.Effect<
  DescribeStackRefactorOutput,
  StackRefactorNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackRefactorInput,
  output: DescribeStackRefactorOutput,
  errors: [StackRefactorNotFoundException],
}));
/**
 * Returns Amazon Web Services resource descriptions for running and deleted stacks. If
 * `StackName` is specified, all the associated resources that are part of the stack
 * are returned. If `PhysicalResourceId` is specified, the associated resources of the
 * stack that the resource belongs to are returned.
 *
 * Only the first 100 resources will be returned. If your stack has more resources than
 * this, you should use `ListStackResources` instead.
 *
 * For deleted stacks, `DescribeStackResources` returns resource information for
 * up to 90 days after the stack has been deleted.
 *
 * You must specify either `StackName` or `PhysicalResourceId`, but not
 * both. In addition, you can specify `LogicalResourceId` to filter the returned
 * result. For more information about resources, the `LogicalResourceId` and
 * `PhysicalResourceId`, see the CloudFormation User Guide.
 *
 * A `ValidationError` is returned if you specify both `StackName`
 * and `PhysicalResourceId` in the same request.
 */
export const describeStackResources: (
  input: DescribeStackResourcesInput,
) => effect.Effect<
  DescribeStackResourcesOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackResourcesInput,
  output: DescribeStackResourcesOutput,
  errors: [],
}));
/**
 * Returns detailed information about an extension from the CloudFormation registry in your
 * current account and Region.
 *
 * If you specify a `VersionId`, `DescribeType` returns information
 * about that specific extension version. Otherwise, it returns information about the default
 * extension version.
 *
 * For more information, see Edit configuration
 * data for extensions in your account in the
 * *CloudFormation User Guide*.
 */
export const describeType: (
  input: DescribeTypeInput,
) => effect.Effect<
  DescribeTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTypeInput,
  output: DescribeTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Detect drift on a StackSet. When CloudFormation performs drift detection on a StackSet, it
 * performs drift detection on the stack associated with each stack instance in the StackSet. For
 * more information, see Performing drift detection on
 * CloudFormation StackSets.
 *
 * `DetectStackSetDrift` returns the `OperationId` of the StackSet
 * drift detection operation. Use this operation id with DescribeStackSetOperation to monitor the progress of the drift detection
 * operation. The drift detection operation may take some time, depending on the number of stack
 * instances included in the StackSet, in addition to the number of resources included in each
 * stack.
 *
 * Once the operation has completed, use the following actions to return drift
 * information:
 *
 * - Use DescribeStackSet to return detailed information about the stack
 * set, including detailed information about the last *completed* drift
 * operation performed on the StackSet. (Information about drift operations that are in
 * progress isn't included.)
 *
 * - Use ListStackInstances to return a list of stack instances belonging
 * to the StackSet, including the drift status and last drift time checked of each
 * instance.
 *
 * - Use DescribeStackInstance to return detailed information about a
 * specific stack instance, including its drift status and last drift time checked.
 *
 * You can only run a single drift detection operation on a given StackSet at one
 * time.
 *
 * To stop a drift detection StackSet operation, use StopStackSetOperation.
 */
export const detectStackSetDrift: (
  input: DetectStackSetDriftInput,
) => effect.Effect<
  DetectStackSetDriftOutput,
  | InvalidOperationException
  | OperationInProgressException
  | StackSetNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectStackSetDriftInput,
  output: DetectStackSetDriftOutput,
  errors: [
    InvalidOperationException,
    OperationInProgressException,
    StackSetNotFoundException,
  ],
}));
/**
 * Updates a stack using the input information that was provided when the specified change
 * set was created. After the call successfully completes, CloudFormation starts updating the stack.
 * Use the DescribeStacks action to view the status of the update.
 *
 * When you execute a change set, CloudFormation deletes all other change sets associated with
 * the stack because they aren't valid for the updated stack.
 *
 * If a stack policy is associated with the stack, CloudFormation enforces the policy during the
 * update. You can't specify a temporary stack policy that overrides the current policy.
 *
 * To create a change set for the entire stack hierarchy, `IncludeNestedStacks`
 * must have been set to `True`.
 */
export const executeChangeSet: (
  input: ExecuteChangeSetInput,
) => effect.Effect<
  ExecuteChangeSetOutput,
  | ChangeSetNotFoundException
  | InsufficientCapabilitiesException
  | InvalidChangeSetStatusException
  | TokenAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteChangeSetInput,
  output: ExecuteChangeSetOutput,
  errors: [
    ChangeSetNotFoundException,
    InsufficientCapabilitiesException,
    InvalidChangeSetStatusException,
    TokenAlreadyExistsException,
  ],
}));
/**
 * Returns the ID and status of each active change set for a stack. For example, CloudFormation
 * lists change sets that are in the `CREATE_IN_PROGRESS` or
 * `CREATE_PENDING` state.
 */
export const listChangeSets: {
  (
    input: ListChangeSetsInput,
  ): effect.Effect<
    ListChangeSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListChangeSetsInput,
  ) => stream.Stream<
    ListChangeSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListChangeSetsInput,
  ) => stream.Stream<
    ChangeSetSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChangeSetsInput,
  output: ListChangeSetsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
  } as const,
}));
/**
 * Lists all exported output values in the account and Region in which you call this action.
 * Use this action to see the exported output values that you can import into other stacks. To
 * import values, use the Fn::ImportValue function.
 *
 * For more information, see Get exported outputs
 * from a deployed CloudFormation stack.
 */
export const listExports: {
  (
    input: ListExportsInput,
  ): effect.Effect<
    ListExportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportsInput,
  ) => stream.Stream<
    ListExportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListExportsInput,
  ) => stream.Stream<
    Export,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportsInput,
  output: ListExportsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Exports",
  } as const,
}));
/**
 * Lists your generated templates in this Region.
 */
export const listGeneratedTemplates: {
  (
    input: ListGeneratedTemplatesInput,
  ): effect.Effect<
    ListGeneratedTemplatesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListGeneratedTemplatesInput,
  ) => stream.Stream<
    ListGeneratedTemplatesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListGeneratedTemplatesInput,
  ) => stream.Stream<
    TemplateSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGeneratedTemplatesInput,
  output: ListGeneratedTemplatesOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the resource scans from newest to oldest. By default it will return up to 10 resource
 * scans.
 */
export const listResourceScans: {
  (
    input: ListResourceScansInput,
  ): effect.Effect<
    ListResourceScansOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScansInput,
  ) => stream.Stream<
    ListResourceScansOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScansInput,
  ) => stream.Stream<
    ResourceScanSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceScansInput,
  output: ListResourceScansOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceScanSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the stack refactor actions that will be taken after calling the ExecuteStackRefactor action.
 */
export const listStackRefactorActions: {
  (
    input: ListStackRefactorActionsInput,
  ): effect.Effect<
    ListStackRefactorActionsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackRefactorActionsInput,
  ) => stream.Stream<
    ListStackRefactorActionsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackRefactorActionsInput,
  ) => stream.Stream<
    StackRefactorAction,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackRefactorActionsInput,
  output: ListStackRefactorActionsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StackRefactorActions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all account stack refactor operations and their statuses.
 */
export const listStackRefactors: {
  (
    input: ListStackRefactorsInput,
  ): effect.Effect<
    ListStackRefactorsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackRefactorsInput,
  ) => stream.Stream<
    ListStackRefactorsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackRefactorsInput,
  ) => stream.Stream<
    StackRefactorSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackRefactorsInput,
  output: ListStackRefactorsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StackRefactorSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summary information about deployment targets for a StackSet.
 */
export const listStackSetAutoDeploymentTargets: (
  input: ListStackSetAutoDeploymentTargetsInput,
) => effect.Effect<
  ListStackSetAutoDeploymentTargetsOutput,
  StackSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackSetAutoDeploymentTargetsInput,
  output: ListStackSetAutoDeploymentTargetsOutput,
  errors: [StackSetNotFoundException],
}));
/**
 * Returns summary information about operations performed on a StackSet.
 *
 * This API provides *eventually consistent* reads meaning it may take
 * some time but will eventually return the most up-to-date data.
 */
export const listStackSetOperations: {
  (
    input: ListStackSetOperationsInput,
  ): effect.Effect<
    ListStackSetOperationsOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetOperationsInput,
  ) => stream.Stream<
    ListStackSetOperationsOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetOperationsInput,
  ) => stream.Stream<
    StackSetOperationSummary,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackSetOperationsInput,
  output: ListStackSetOperationsOutput,
  errors: [StackSetNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summary information about StackSets that are associated with the user.
 *
 * This API provides *strongly consistent* reads meaning it will always
 * return the most up-to-date data.
 *
 * - [Self-managed permissions] If you set the `CallAs` parameter to
 * `SELF` while signed in to your Amazon Web Services account, `ListStackSets`
 * returns all self-managed StackSets in your Amazon Web Services account.
 *
 * - [Service-managed permissions] If you set the `CallAs` parameter to
 * `SELF` while signed in to the organization's management account,
 * `ListStackSets` returns all StackSets in the management account.
 *
 * - [Service-managed permissions] If you set the `CallAs` parameter to
 * `DELEGATED_ADMIN` while signed in to your member account,
 * `ListStackSets` returns all StackSets with service-managed permissions in the
 * management account.
 */
export const listStackSets: {
  (
    input: ListStackSetsInput,
  ): effect.Effect<
    ListStackSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetsInput,
  ) => stream.Stream<
    ListStackSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetsInput,
  ) => stream.Stream<
    StackSetSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackSetsInput,
  output: ListStackSetsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summary information about the versions of an extension.
 */
export const listTypeVersions: {
  (
    input: ListTypeVersionsInput,
  ): effect.Effect<
    ListTypeVersionsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypeVersionsInput,
  ) => stream.Stream<
    ListTypeVersionsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypeVersionsInput,
  ) => stream.Stream<
    unknown,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypeVersionsInput,
  output: ListTypeVersionsOutput,
  errors: [CFNRegistryException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Reports progress of a resource handler to CloudFormation.
 *
 * Reserved for use by the CloudFormation
 * CLI. Don't use this API in your code.
 */
export const recordHandlerProgress: (
  input: RecordHandlerProgressInput,
) => effect.Effect<
  RecordHandlerProgressOutput,
  | InvalidStateTransitionException
  | OperationStatusCheckFailedException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RecordHandlerProgressInput,
  output: RecordHandlerProgressOutput,
  errors: [
    InvalidStateTransitionException,
    OperationStatusCheckFailedException,
  ],
}));
/**
 * Validates a specified template. CloudFormation first checks if the template is valid JSON. If
 * it isn't, CloudFormation checks if the template is valid YAML. If both these checks fail,
 * CloudFormation returns a template validation error.
 */
export const validateTemplate: (
  input: ValidateTemplateInput,
) => effect.Effect<
  ValidateTemplateOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateTemplateInput,
  output: ValidateTemplateOutput,
  errors: [],
}));
/**
 * Updates a generated template. This can be used to change the name, add and remove
 * resources, refresh resources, and change the `DeletionPolicy` and
 * `UpdateReplacePolicy` settings. You can check the status of the update to the
 * generated template using the `DescribeGeneratedTemplate` API action.
 */
export const updateGeneratedTemplate: (
  input: UpdateGeneratedTemplateInput,
) => effect.Effect<
  UpdateGeneratedTemplateOutput,
  | AlreadyExistsException
  | GeneratedTemplateNotFoundException
  | LimitExceededException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGeneratedTemplateInput,
  output: UpdateGeneratedTemplateOutput,
  errors: [
    AlreadyExistsException,
    GeneratedTemplateNotFoundException,
    LimitExceededException,
  ],
}));
/**
 * Creates a template from existing resources that are not already managed with CloudFormation.
 * You can check the status of the template generation using the
 * `DescribeGeneratedTemplate` API action.
 */
export const createGeneratedTemplate: (
  input: CreateGeneratedTemplateInput,
) => effect.Effect<
  CreateGeneratedTemplateOutput,
  | AlreadyExistsException
  | ConcurrentResourcesLimitExceededException
  | LimitExceededException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGeneratedTemplateInput,
  output: CreateGeneratedTemplateOutput,
  errors: [
    AlreadyExistsException,
    ConcurrentResourcesLimitExceededException,
    LimitExceededException,
  ],
}));
/**
 * Publishes the specified extension to the CloudFormation registry as a public extension in this
 * Region. Public extensions are available for use by all CloudFormation users. For more information
 * about publishing extensions, see Publishing extensions to
 * make them available for public use in the
 * *CloudFormation Command Line Interface (CLI) User Guide*.
 *
 * To publish an extension, you must be registered as a publisher with CloudFormation. For more
 * information, see RegisterPublisher.
 */
export const publishType: (
  input: PublishTypeInput,
) => effect.Effect<
  PublishTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishTypeInput,
  output: PublishTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Specifies the configuration data for a CloudFormation extension, such as a resource or Hook,
 * in the given account and Region.
 *
 * For more information, see Edit configuration
 * data for extensions in your account in the
 * *CloudFormation User Guide*.
 *
 * To view the current configuration data for an extension, refer to the
 * `ConfigurationSchema` element of DescribeType.
 *
 * It's strongly recommended that you use dynamic references to restrict sensitive
 * configuration definitions, such as third-party credentials. For more information, see Specify values stored in other services using dynamic references in the
 * *CloudFormation User Guide*.
 *
 * For more information about setting the configuration data for resource types, see Defining the account-level configuration of an extension in the
 * *CloudFormation Command Line Interface (CLI) User Guide*. For more information about setting the configuration
 * data for Hooks, see the CloudFormation Hooks User Guide.
 */
export const setTypeConfiguration: (
  input: SetTypeConfigurationInput,
) => effect.Effect<
  SetTypeConfigurationOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTypeConfigurationInput,
  output: SetTypeConfigurationOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Tests a registered extension to make sure it meets all necessary requirements for being
 * published in the CloudFormation registry.
 *
 * - For resource types, this includes passing all contracts tests defined for the
 * type.
 *
 * - For modules, this includes determining if the module's model meets all necessary
 * requirements.
 *
 * For more information, see Testing your public extension before publishing in the
 * *CloudFormation Command Line Interface (CLI) User Guide*.
 *
 * If you don't specify a version, CloudFormation uses the default version of the extension in
 * your account and Region for testing.
 *
 * To perform testing, CloudFormation assumes the execution role specified when the type was
 * registered. For more information, see RegisterType.
 *
 * Once you've initiated testing on an extension using `TestType`, you can pass
 * the returned `TypeVersionArn` into DescribeType to
 * monitor the current test status and test status description for the extension.
 *
 * An extension must have a test status of `PASSED` before it can be published.
 * For more information, see Publishing extensions
 * to make them available for public use in the
 * *CloudFormation Command Line Interface (CLI) User Guide*.
 */
export const testType: (
  input: TestTypeInput,
) => effect.Effect<
  TestTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestTypeInput,
  output: TestTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Marks an extension or extension version as `DEPRECATED` in the CloudFormation
 * registry, removing it from active use. Deprecated extensions or extension versions cannot be
 * used in CloudFormation operations.
 *
 * To deregister an entire extension, you must individually deregister all active versions of
 * that extension. If an extension has only a single active version, deregistering that version
 * results in the extension itself being deregistered and marked as deprecated in the
 * registry.
 *
 * You can't deregister the default version of an extension if there are other active version
 * of that extension. If you do deregister the default version of an extension, the extension
 * type itself is deregistered as well and marked as deprecated.
 *
 * To view the deprecation status of an extension or extension version, use DescribeType.
 *
 * For more information, see Remove
 * third-party private extensions from your account in the
 * *CloudFormation User Guide*.
 */
export const deregisterType: (
  input: DeregisterTypeInput,
) => effect.Effect<
  DeregisterTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTypeInput,
  output: DeregisterTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Specify the default version of an extension. The default version of an extension will be
 * used in CloudFormation operations.
 */
export const setTypeDefaultVersion: (
  input: SetTypeDefaultVersionInput,
) => effect.Effect<
  SetTypeDefaultVersionOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTypeDefaultVersionInput,
  output: SetTypeDefaultVersionOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Activates a public third-party extension, such as a resource or module, to make it
 * available for use in stack templates in your current account and Region. It can also create
 * CloudFormation Hooks, which allow you to evaluate resource configurations before CloudFormation
 * provisions them. Hooks integrate with both CloudFormation and Cloud Control API operations.
 *
 * After you activate an extension, you can use SetTypeConfiguration to set specific properties for the extension.
 *
 * To see which extensions have been activated, use ListTypes. To see
 * configuration details for an extension, use DescribeType.
 *
 * For more information, see Activate a
 * third-party public extension in your account in the
 * *CloudFormation User Guide*. For information about creating Hooks, see the
 * CloudFormation Hooks User Guide.
 */
export const activateType: (
  input: ActivateTypeInput,
) => effect.Effect<
  ActivateTypeOutput,
  CFNRegistryException | TypeNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateTypeInput,
  output: ActivateTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Retrieves a generated template. If the template is in an `InProgress` or
 * `Pending` status then the template returned will be the template when the
 * template was last in a `Complete` status. If the template has not yet been in a
 * `Complete` status then an empty template will be returned.
 */
export const getGeneratedTemplate: (
  input: GetGeneratedTemplateInput,
) => effect.Effect<
  GetGeneratedTemplateOutput,
  GeneratedTemplateNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeneratedTemplateInput,
  output: GetGeneratedTemplateOutput,
  errors: [GeneratedTemplateNotFoundException],
}));
/**
 * Stops an in-progress operation on a StackSet and its associated stack instances. StackSets
 * will cancel all the unstarted stack instance deployments and wait for those are in-progress to
 * complete.
 */
export const stopStackSetOperation: (
  input: StopStackSetOperationInput,
) => effect.Effect<
  StopStackSetOperationOutput,
  | InvalidOperationException
  | OperationNotFoundException
  | StackSetNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopStackSetOperationInput,
  output: StopStackSetOperationOutput,
  errors: [
    InvalidOperationException,
    OperationNotFoundException,
    StackSetNotFoundException,
  ],
}));
/**
 * Updates a stack as specified in the template. After the call completes successfully, the
 * stack update starts. You can check the status of the stack through the DescribeStacks action.
 *
 * To get a copy of the template for an existing stack, you can use the GetTemplate action.
 *
 * For more information about updating a stack and monitoring the progress of the update, see
 * Managing
 * Amazon Web Services resources as a single unit with CloudFormation stacks in the
 * *CloudFormation User Guide*.
 */
export const updateStack: (
  input: UpdateStackInput,
) => effect.Effect<
  UpdateStackOutput,
  | InsufficientCapabilitiesException
  | TokenAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStackInput,
  output: UpdateStackOutput,
  errors: [InsufficientCapabilitiesException, TokenAlreadyExistsException],
}));
/**
 * Creates a stack as specified in the template. After the call completes successfully, the
 * stack creation starts. You can check the status of the stack through the DescribeStacks operation.
 *
 * For more information about creating a stack and monitoring stack progress, see Managing Amazon Web Services
 * resources as a single unit with CloudFormation stacks in the
 * *CloudFormation User Guide*.
 */
export const createStack: (
  input: CreateStackInput,
) => effect.Effect<
  CreateStackOutput,
  | AlreadyExistsException
  | InsufficientCapabilitiesException
  | LimitExceededException
  | TokenAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStackInput,
  output: CreateStackOutput,
  errors: [
    AlreadyExistsException,
    InsufficientCapabilitiesException,
    LimitExceededException,
    TokenAlreadyExistsException,
  ],
}));
/**
 * Creates a list of changes that will be applied to a stack so that you can review the
 * changes before executing them. You can create a change set for a stack that doesn't exist or
 * an existing stack. If you create a change set for a stack that doesn't exist, the change set
 * shows all of the resources that CloudFormation will create. If you create a change set for an
 * existing stack, CloudFormation compares the stack's information with the information that you
 * submit in the change set and lists the differences. Use change sets to understand which
 * resources CloudFormation will create or change, and how it will change resources in an existing
 * stack, before you create or update a stack.
 *
 * To create a change set for a stack that doesn't exist, for the `ChangeSetType`
 * parameter, specify `CREATE`. To create a change set for an existing stack, specify
 * `UPDATE` for the `ChangeSetType` parameter. To create a change set for
 * an import operation, specify `IMPORT` for the `ChangeSetType` parameter.
 * After the `CreateChangeSet` call successfully completes, CloudFormation starts creating
 * the change set. To check the status of the change set or to review it, use the DescribeChangeSet action.
 *
 * When you are satisfied with the changes the change set will make, execute the change set
 * by using the ExecuteChangeSet action. CloudFormation doesn't make changes until
 * you execute the change set.
 *
 * To create a change set for the entire stack hierarchy, set
 * `IncludeNestedStacks` to `True`.
 */
export const createChangeSet: (
  input: CreateChangeSetInput,
) => effect.Effect<
  CreateChangeSetOutput,
  | AlreadyExistsException
  | InsufficientCapabilitiesException
  | LimitExceededException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChangeSetInput,
  output: CreateChangeSetOutput,
  errors: [
    AlreadyExistsException,
    InsufficientCapabilitiesException,
    LimitExceededException,
  ],
}));
/**
 * Creates a refactor across multiple stacks, with the list of stacks and resources that are
 * affected.
 */
export const createStackRefactor: (
  input: CreateStackRefactorInput,
) => effect.Effect<
  CreateStackRefactorOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStackRefactorInput,
  output: CreateStackRefactorOutput,
  errors: [],
}));
/**
 * Returns CloudFormation events based on flexible query criteria. Groups events by operation ID,
 * enabling you to focus on individual stack operations during deployment.
 *
 * An operation is any action performed on a stack, including stack lifecycle actions
 * (Create, Update, Delete, Rollback), change set creation, nested stack creation, and automatic
 * rollbacks triggered by failures. Each operation has a unique identifier (Operation ID) and
 * represents a discrete change attempt on the stack.
 *
 * Returns different types of events including:
 *
 * - **Progress events** - Status updates during stack operation
 * execution.
 *
 * - **Validation errors** - Failures from CloudFormation Early
 * Validations.
 *
 * - **Provisioning errors** - Resource creation and update
 * failures.
 *
 * - **Hook invocation errors** - Failures from CloudFormation
 * Hook during stack operations.
 *
 * One of `ChangeSetName`, `OperationId` or `StackName`
 * must be specified as input.
 */
export const describeEvents: {
  (
    input: DescribeEventsInput,
  ): effect.Effect<
    DescribeEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsInput,
  ) => stream.Stream<
    DescribeEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsInput,
  ) => stream.Stream<
    OperationEvent,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsInput,
  output: DescribeEventsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OperationEvents",
  } as const,
}));
/**
 * Returns a description of the specified resource in the specified stack.
 *
 * For deleted stacks, DescribeStackResource returns resource information for up to 90 days
 * after the stack has been deleted.
 */
export const describeStackResource: (
  input: DescribeStackResourceInput,
) => effect.Effect<
  DescribeStackResourceOutput,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackResourceInput,
  output: DescribeStackResourceOutput,
  errors: [],
}));
/**
 * Returns drift information for the resources that have been checked for drift in the
 * specified stack. This includes actual and expected configuration values for resources where
 * CloudFormation detects configuration drift.
 *
 * For a given stack, there will be one `StackResourceDrift` for each stack
 * resource that has been checked for drift. Resources that haven't yet been checked for drift
 * aren't included. Resources that don't currently support drift detection aren't checked, and so
 * not included. For a list of resources that support drift detection, see Resource
 * type support for imports and drift detection.
 *
 * Use DetectStackResourceDrift to detect drift on individual resources, or
 * DetectStackDrift to detect drift on all supported resources for a given
 * stack.
 */
export const describeStackResourceDrifts: {
  (
    input: DescribeStackResourceDriftsInput,
  ): effect.Effect<
    DescribeStackResourceDriftsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStackResourceDriftsInput,
  ) => stream.Stream<
    DescribeStackResourceDriftsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStackResourceDriftsInput,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStackResourceDriftsInput,
  output: DescribeStackResourceDriftsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the description for the specified stack; if no stack name was specified, then it
 * returns the description for all the stacks created. For more information about a stack's event
 * history, see Understand CloudFormation stack creation events in the
 * *CloudFormation User Guide*.
 *
 * If the stack doesn't exist, a `ValidationError` is returned.
 */
export const describeStacks: {
  (
    input: DescribeStacksInput,
  ): effect.Effect<
    DescribeStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStacksInput,
  ) => stream.Stream<
    DescribeStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStacksInput,
  ) => stream.Stream<
    Stack,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStacksInput,
  output: DescribeStacksOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Stacks",
  } as const,
}));
/**
 * Returns the description of the specified StackSet.
 *
 * This API provides *strongly consistent* reads meaning it will always
 * return the most up-to-date data.
 */
export const describeStackSet: (
  input: DescribeStackSetInput,
) => effect.Effect<
  DescribeStackSetOutput,
  StackSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackSetInput,
  output: DescribeStackSetOutput,
  errors: [StackSetNotFoundException],
}));
/**
 * Returns the description of the specified StackSet operation.
 *
 * This API provides *strongly consistent* reads meaning it will always
 * return the most up-to-date data.
 */
export const describeStackSetOperation: (
  input: DescribeStackSetOperationInput,
) => effect.Effect<
  DescribeStackSetOperationOutput,
  OperationNotFoundException | StackSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackSetOperationInput,
  output: DescribeStackSetOperationOutput,
  errors: [OperationNotFoundException, StackSetNotFoundException],
}));
/**
 * Retrieves detailed information and remediation guidance for a Hook invocation
 * result.
 *
 * If the Hook uses a KMS key to encrypt annotations, callers of the
 * `GetHookResult` operation must have `kms:Decrypt` permissions. For
 * more information, see KMS key policy
 * and permissions for encrypting CloudFormation Hooks results at rest in the
 * *CloudFormation Hooks User Guide*.
 */
export const getHookResult: (
  input: GetHookResultInput,
) => effect.Effect<
  GetHookResultOutput,
  HookResultNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHookResultInput,
  output: GetHookResultOutput,
  errors: [HookResultNotFoundException],
}));
/**
 * Lists the resources from a resource scan. The results can be filtered by resource
 * identifier, resource type prefix, tag key, and tag value. Only resources that match all
 * specified filters are returned. The response indicates whether each returned resource is
 * already managed by CloudFormation.
 */
export const listResourceScanResources: {
  (
    input: ListResourceScanResourcesInput,
  ): effect.Effect<
    ListResourceScanResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScanResourcesInput,
  ) => stream.Stream<
    ListResourceScanResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScanResourcesInput,
  ) => stream.Stream<
    ScannedResource,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceScanResourcesInput,
  output: ListResourceScanResourcesOutput,
  errors: [ResourceScanInProgressException, ResourceScanNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Resources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns drift information for resources in a stack instance.
 *
 * `ListStackInstanceResourceDrifts` returns drift information for the most
 * recent drift detection operation. If an operation is in progress, it may only return partial
 * results.
 */
export const listStackInstanceResourceDrifts: (
  input: ListStackInstanceResourceDriftsInput,
) => effect.Effect<
  ListStackInstanceResourceDriftsOutput,
  | OperationNotFoundException
  | StackInstanceNotFoundException
  | StackSetNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackInstanceResourceDriftsInput,
  output: ListStackInstanceResourceDriftsOutput,
  errors: [
    OperationNotFoundException,
    StackInstanceNotFoundException,
    StackSetNotFoundException,
  ],
}));
/**
 * Returns summary information about stack instances that are associated with the specified
 * StackSet. You can filter for stack instances that are associated with a specific Amazon Web Services account
 * name or Region, or that have a specific status.
 */
export const listStackInstances: {
  (
    input: ListStackInstancesInput,
  ): effect.Effect<
    ListStackInstancesOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackInstancesInput,
  ) => stream.Stream<
    ListStackInstancesOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackInstancesInput,
  ) => stream.Stream<
    StackInstanceSummary,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackInstancesInput,
  output: ListStackInstancesOutput,
  errors: [StackSetNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns descriptions of all resources of the specified stack.
 *
 * For deleted stacks, ListStackResources returns resource information for up to 90 days
 * after the stack has been deleted.
 */
export const listStackResources: {
  (
    input: ListStackResourcesInput,
  ): effect.Effect<
    ListStackResourcesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackResourcesInput,
  ) => stream.Stream<
    ListStackResourcesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackResourcesInput,
  ) => stream.Stream<
    StackResourceSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackResourcesInput,
  output: ListStackResourcesOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StackResourceSummaries",
  } as const,
}));
/**
 * Returns the summary information for stacks whose status matches the specified
 * `StackStatusFilter`. Summary information for stacks that have been deleted is
 * kept for 90 days after the stack is deleted. If no `StackStatusFilter` is
 * specified, summary information for all stacks is returned (including existing stacks and
 * stacks that have been deleted).
 */
export const listStacks: {
  (
    input: ListStacksInput,
  ): effect.Effect<
    ListStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStacksInput,
  ) => stream.Stream<
    ListStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStacksInput,
  ) => stream.Stream<
    StackSummary,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStacksInput,
  output: ListStacksOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StackSummaries",
  } as const,
}));
/**
 * Returns summary information about all extensions, including your private resource types,
 * modules, and Hooks as well as all public extensions from Amazon Web Services and third-party
 * publishers.
 */
export const listTypes: {
  (
    input: ListTypesInput,
  ): effect.Effect<
    ListTypesOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypesInput,
  ) => stream.Stream<
    ListTypesOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypesInput,
  ) => stream.Stream<
    TypeSummary,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTypesInput,
  output: ListTypesOutput,
  errors: [CFNRegistryException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TypeSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes stack instances for the specified accounts, in the specified Amazon Web Services Regions.
 *
 * The maximum number of organizational unit (OUs) supported by a
 * `DeleteStackInstances` operation is 50.
 *
 * If you need more than 50, consider the following options:
 *
 * - *Batch processing:* If you don't want to expose your OU
 * hierarchy, split up the operations into multiple calls with less than 50 OUs
 * each.
 *
 * - *Parent OU strategy:* If you don't mind exposing the OU
 * hierarchy, target a parent OU that contains all desired child OUs.
 */
export const deleteStackInstances: (
  input: DeleteStackInstancesInput,
) => effect.Effect<
  DeleteStackInstancesOutput,
  | InvalidOperationException
  | OperationIdAlreadyExistsException
  | OperationInProgressException
  | StackSetNotFoundException
  | StaleRequestException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackInstancesInput,
  output: DeleteStackInstancesOutput,
  errors: [
    InvalidOperationException,
    OperationIdAlreadyExistsException,
    OperationInProgressException,
    StackSetNotFoundException,
    StaleRequestException,
  ],
}));
/**
 * Returns summaries of invoked Hooks. For more information, see View invocation
 * summaries for CloudFormation Hooks in the *CloudFormation Hooks User Guide*.
 *
 * This operation supports the following parameter combinations:
 *
 * - No parameters: Returns all Hook invocation summaries.
 *
 * - `TypeArn` only: Returns summaries for a specific Hook.
 *
 * - `TypeArn` and `Status`: Returns summaries for a specific Hook
 * filtered by status.
 *
 * - `TargetId` and `TargetType`: Returns summaries for a specific
 * Hook invocation target.
 */
export const listHookResults: (
  input: ListHookResultsInput,
) => effect.Effect<
  ListHookResultsOutput,
  HookResultNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHookResultsInput,
  output: ListHookResultsOutput,
  errors: [HookResultNotFoundException],
}));
/**
 * Lists the related resources for a list of resources from a resource scan. The response
 * indicates whether each returned resource is already managed by CloudFormation.
 */
export const listResourceScanRelatedResources: {
  (
    input: ListResourceScanRelatedResourcesInput,
  ): effect.Effect<
    ListResourceScanRelatedResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScanRelatedResourcesInput,
  ) => stream.Stream<
    ListResourceScanRelatedResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScanRelatedResourcesInput,
  ) => stream.Stream<
    ScannedResource,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceScanRelatedResourcesInput,
  output: ListResourceScanRelatedResourcesOutput,
  errors: [ResourceScanInProgressException, ResourceScanNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RelatedResources",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the parameter values for stack instances for the specified accounts, within the
 * specified Amazon Web Services Regions. A stack instance refers to a stack in a specific account and
 * Region.
 *
 * You can only update stack instances in Amazon Web Services Regions and accounts where they already
 * exist; to create additional stack instances, use CreateStackInstances.
 *
 * During StackSet updates, any parameters overridden for a stack instance aren't updated,
 * but retain their overridden value.
 *
 * You can only update the parameter *values* that are specified in the
 * StackSet. To add or delete a parameter itself, use UpdateStackSet
 * to update the StackSet template. If you add a parameter to a template, before you can override
 * the parameter value specified in the StackSet you must first use UpdateStackSet
 * to update all stack instances with the updated template and parameter value specified in the
 * StackSet. Once a stack instance has been updated with the new parameter, you can then override
 * the parameter value using `UpdateStackInstances`.
 *
 * The maximum number of organizational unit (OUs) supported by a
 * `UpdateStackInstances` operation is 50.
 *
 * If you need more than 50, consider the following options:
 *
 * - *Batch processing:* If you don't want to expose your OU
 * hierarchy, split up the operations into multiple calls with less than 50 OUs
 * each.
 *
 * - *Parent OU strategy:* If you don't mind exposing the OU
 * hierarchy, target a parent OU that contains all desired child OUs.
 */
export const updateStackInstances: (
  input: UpdateStackInstancesInput,
) => effect.Effect<
  UpdateStackInstancesOutput,
  | InvalidOperationException
  | OperationIdAlreadyExistsException
  | OperationInProgressException
  | StackInstanceNotFoundException
  | StackSetNotFoundException
  | StaleRequestException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStackInstancesInput,
  output: UpdateStackInstancesOutput,
  errors: [
    InvalidOperationException,
    OperationIdAlreadyExistsException,
    OperationInProgressException,
    StackInstanceNotFoundException,
    StackSetNotFoundException,
    StaleRequestException,
  ],
}));
/**
 * Updates the StackSet and associated stack instances in the specified accounts and
 * Amazon Web Services Regions.
 *
 * Even if the StackSet operation created by updating the StackSet fails (completely or
 * partially, below or above a specified failure tolerance), the StackSet is updated with your
 * changes. Subsequent CreateStackInstances calls on the specified StackSet use
 * the updated StackSet.
 *
 * The maximum number of organizational unit (OUs) supported by a
 * `UpdateStackSet` operation is 50.
 *
 * If you need more than 50, consider the following options:
 *
 * - *Batch processing:* If you don't want to expose your OU
 * hierarchy, split up the operations into multiple calls with less than 50 OUs
 * each.
 *
 * - *Parent OU strategy:* If you don't mind exposing the OU
 * hierarchy, target a parent OU that contains all desired child OUs.
 */
export const updateStackSet: (
  input: UpdateStackSetInput,
) => effect.Effect<
  UpdateStackSetOutput,
  | InvalidOperationException
  | OperationIdAlreadyExistsException
  | OperationInProgressException
  | StackInstanceNotFoundException
  | StackSetNotFoundException
  | StaleRequestException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStackSetInput,
  output: UpdateStackSetOutput,
  errors: [
    InvalidOperationException,
    OperationIdAlreadyExistsException,
    OperationInProgressException,
    StackInstanceNotFoundException,
    StackSetNotFoundException,
    StaleRequestException,
  ],
}));
/**
 * Returns the stack instance that's associated with the specified StackSet, Amazon Web Services account,
 * and Amazon Web Services Region.
 *
 * For a list of stack instances that are associated with a specific StackSet, use ListStackInstances.
 */
export const describeStackInstance: (
  input: DescribeStackInstanceInput,
) => effect.Effect<
  DescribeStackInstanceOutput,
  StackInstanceNotFoundException | StackSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackInstanceInput,
  output: DescribeStackInstanceOutput,
  errors: [StackInstanceNotFoundException, StackSetNotFoundException],
}));
/**
 * Creates stack instances for the specified accounts, within the specified Amazon Web Services Regions. A
 * stack instance refers to a stack in a specific account and Region. You must specify at least
 * one value for either `Accounts` or `DeploymentTargets`, and you must
 * specify at least one value for `Regions`.
 *
 * The maximum number of organizational unit (OUs) supported by a
 * `CreateStackInstances` operation is 50.
 *
 * If you need more than 50, consider the following options:
 *
 * - *Batch processing:* If you don't want to expose your OU
 * hierarchy, split up the operations into multiple calls with less than 50 OUs
 * each.
 *
 * - *Parent OU strategy:* If you don't mind exposing the OU
 * hierarchy, target a parent OU that contains all desired child OUs.
 */
export const createStackInstances: (
  input: CreateStackInstancesInput,
) => effect.Effect<
  CreateStackInstancesOutput,
  | InvalidOperationException
  | LimitExceededException
  | OperationIdAlreadyExistsException
  | OperationInProgressException
  | StackSetNotFoundException
  | StaleRequestException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStackInstancesInput,
  output: CreateStackInstancesOutput,
  errors: [
    InvalidOperationException,
    LimitExceededException,
    OperationIdAlreadyExistsException,
    OperationInProgressException,
    StackSetNotFoundException,
    StaleRequestException,
  ],
}));
/**
 * Import existing stacks into a new StackSets. Use the stack import operation to import up
 * to 10 stacks into a new StackSet in the same account as the source stack or in a different
 * administrator account and Region, by specifying the stack ID of the stack you intend to
 * import.
 */
export const importStacksToStackSet: (
  input: ImportStacksToStackSetInput,
) => effect.Effect<
  ImportStacksToStackSetOutput,
  | InvalidOperationException
  | LimitExceededException
  | OperationIdAlreadyExistsException
  | OperationInProgressException
  | StackNotFoundException
  | StackSetNotFoundException
  | StaleRequestException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportStacksToStackSetInput,
  output: ImportStacksToStackSetOutput,
  errors: [
    InvalidOperationException,
    LimitExceededException,
    OperationIdAlreadyExistsException,
    OperationInProgressException,
    StackNotFoundException,
    StackSetNotFoundException,
    StaleRequestException,
  ],
}));
/**
 * Returns configuration data for the specified CloudFormation extensions, from the CloudFormation
 * registry in your current account and Region.
 *
 * For more information, see Edit configuration
 * data for extensions in your account in the
 * *CloudFormation User Guide*.
 */
export const batchDescribeTypeConfigurations: (
  input: BatchDescribeTypeConfigurationsInput,
) => effect.Effect<
  BatchDescribeTypeConfigurationsOutput,
  CFNRegistryException | TypeConfigurationNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDescribeTypeConfigurationsInput,
  output: BatchDescribeTypeConfigurationsOutput,
  errors: [CFNRegistryException, TypeConfigurationNotFoundException],
}));
/**
 * Creates a StackSet.
 */
export const createStackSet: (
  input: CreateStackSetInput,
) => effect.Effect<
  CreateStackSetOutput,
  | CreatedButModifiedException
  | LimitExceededException
  | NameAlreadyExistsException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStackSetInput,
  output: CreateStackSetOutput,
  errors: [
    CreatedButModifiedException,
    LimitExceededException,
    NameAlreadyExistsException,
  ],
}));
/**
 * Returns Hook-related information for the change set and a list of changes that
 * CloudFormation makes when you run the change set.
 */
export const describeChangeSetHooks: (
  input: DescribeChangeSetHooksInput,
) => effect.Effect<
  DescribeChangeSetHooksOutput,
  ChangeSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChangeSetHooksInput,
  output: DescribeChangeSetHooksOutput,
  errors: [ChangeSetNotFoundException],
}));
/**
 * Describes a generated template. The output includes details about the progress of the
 * creation of a generated template started by a `CreateGeneratedTemplate` API action
 * or the update of a generated template started with an `UpdateGeneratedTemplate` API
 * action.
 */
export const describeGeneratedTemplate: (
  input: DescribeGeneratedTemplateInput,
) => effect.Effect<
  DescribeGeneratedTemplateOutput,
  GeneratedTemplateNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGeneratedTemplateInput,
  output: DescribeGeneratedTemplateOutput,
  errors: [GeneratedTemplateNotFoundException],
}));
/**
 * Returns information about a new or existing template. The `GetTemplateSummary`
 * action is useful for viewing parameter information, such as default parameter values and
 * parameter types, before you create or update a stack or StackSet.
 *
 * You can use the `GetTemplateSummary` action when you submit a template, or you
 * can get template information for a StackSet, or a running or deleted stack.
 *
 * For deleted stacks, `GetTemplateSummary` returns the template information for
 * up to 90 days after the stack has been deleted. If the template doesn't exist, a
 * `ValidationError` is returned.
 */
export const getTemplateSummary: (
  input: GetTemplateSummaryInput,
) => effect.Effect<
  GetTemplateSummaryOutput,
  StackSetNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateSummaryInput,
  output: GetTemplateSummaryOutput,
  errors: [StackSetNotFoundException],
}));
/**
 * Returns summary information about the results of a StackSet operation.
 *
 * This API provides *eventually consistent* reads meaning it may take
 * some time but will eventually return the most up-to-date data.
 */
export const listStackSetOperationResults: {
  (
    input: ListStackSetOperationResultsInput,
  ): effect.Effect<
    ListStackSetOperationResultsOutput,
    OperationNotFoundException | StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetOperationResultsInput,
  ) => stream.Stream<
    ListStackSetOperationResultsOutput,
    OperationNotFoundException | StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetOperationResultsInput,
  ) => stream.Stream<
    StackSetOperationResultSummary,
    OperationNotFoundException | StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStackSetOperationResultsInput,
  output: ListStackSetOperationResultsOutput,
  errors: [OperationNotFoundException, StackSetNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Summaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts a scan of the resources in this account in this Region. You can the status of a
 * scan using the `ListResourceScans` API action.
 */
export const startResourceScan: (
  input: StartResourceScanInput,
) => effect.Effect<
  StartResourceScanOutput,
  | ResourceScanInProgressException
  | ResourceScanLimitExceededException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceScanInput,
  output: StartResourceScanOutput,
  errors: [ResourceScanInProgressException, ResourceScanLimitExceededException],
}));
/**
 * Returns the inputs for the change set and a list of changes that CloudFormation will make if
 * you execute the change set. For more information, see Update
 * CloudFormation stacks using change sets in the
 * *CloudFormation User Guide*.
 */
export const describeChangeSet: {
  (
    input: DescribeChangeSetInput,
  ): effect.Effect<
    DescribeChangeSetOutput,
    ChangeSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeChangeSetInput,
  ) => stream.Stream<
    DescribeChangeSetOutput,
    ChangeSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeChangeSetInput,
  ) => stream.Stream<
    Change,
    ChangeSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeChangeSetInput,
  output: DescribeChangeSetOutput,
  errors: [ChangeSetNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Changes",
  } as const,
}));
