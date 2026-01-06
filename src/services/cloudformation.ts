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
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
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
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
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
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cloudformation-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://cloudformation.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cloudformation-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cloudformation.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://cloudformation.{Region}.{PartitionResult#dnsSuffix}",
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
});

//# Newtypes
export type ErrorMessage = string;
export type ThirdPartyTypeArn = string;
export type PublisherId = string;
export type TypeName = string;
export type RoleARN2 = string;
export type MajorVersion = number;
export type StackName = string;
export type ClientRequestToken = string;
export type StackNameOrId = string;
export type RoleARN = string;
export type ResourceToSkip = string;
export type TemplateBody = string;
export type TemplateURL = string;
export type ResourceType = string;
export type NotificationARN = string;
export type ChangeSetName = string;
export type ClientToken = string;
export type Description = string;
export type GeneratedTemplateName = string;
export type TimeoutMinutes = number;
export type StackPolicyBody = string;
export type StackPolicyURL = string;
export type StackSetName = string;
export type Account = string;
export type Region = string;
export type StackId = string;
export type ExecutionRoleName = string;
export type PrivateTypeArn = string;
export type ChangeSetNameOrId = string;
export type LogicalResourceId = string;
export type TypeVersionId = string;
export type NextToken = string;
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
export type ConnectionArn = string;
export type S3Url = string;
export type RequestToken = string;
export type TypeConfiguration = string;
export type TypeConfigurationAlias = string;
export type ResourceSignalUniqueId = string;
export type S3Bucket = string;
export type StackPolicyDuringUpdateBody = string;
export type StackPolicyDuringUpdateURL = string;
export type LogGroupName = string;
export type TypeConfigurationArn = string;
export type ParameterKey = string;
export type ParameterValue = string;
export type MonitoringTimeInMinutes = number;
export type AccountsUrl = string;
export type FailureToleranceCount = number;
export type FailureTolerancePercentage = number;
export type MaxConcurrentCount = number;
export type MaxConcurrentPercentage = number;
export type StackSetARN = string;
export type StackInstanceFilterValues = string;
export type OperationResultFilterValues = string;
export type TypeNamePrefix = string;
export type ResourceTypeFilter = string;
export type ChangeSetId = string;
export type ChangeSetStatusReason = string;
export type GeneratedTemplateId = string;
export type TemplateStatusReason = string;
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
export type TypeTestsStatusDescription = string;
export type TypeSchema = string;
export type OptionalSecureUrl = string;
export type ConfigurationSchema = string;
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
export type StackStatusReason = string;
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
export type StackRefactorResourceIdentifier = string;
export type DetectionReason = string;
export type TemplateDescription = string;
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
export type ValidationName = string;
export type ValidationStatusReason = string;
export type ValidationPath = string;
export type ParameterType = string;
export type PublisherName = string;
export type ResourcePropertyPath = string;
export type CausingEntity = string;
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
export type ResourcesToSkip = string[];
export const ResourcesToSkip = S.Array(S.String);
export type Capabilities = string[];
export const Capabilities = S.Array(S.String);
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type NotificationARNs = string[];
export const NotificationARNs = S.Array(S.String);
export type AccountList = string[];
export const AccountList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type RetainResources = string[];
export const RetainResources = S.Array(S.String);
export type StackResourceDriftStatusFilters = string[];
export const StackResourceDriftStatusFilters = S.Array(S.String);
export type LogicalResourceIds = string[];
export const LogicalResourceIds = S.Array(S.String);
export type StackIdList = string[];
export const StackIdList = S.Array(S.String);
export type OrganizationalUnitIdList = string[];
export const OrganizationalUnitIdList = S.Array(S.String);
export type StackRefactorExecutionStatusFilter = string[];
export const StackRefactorExecutionStatusFilter = S.Array(S.String);
export type StackStatusFilter = string[];
export const StackStatusFilter = S.Array(S.String);
export type JazzLogicalResourceIds = string[];
export const JazzLogicalResourceIds = S.Array(S.String);
export interface CancelUpdateStackInput {
  StackName: string;
  ClientRequestToken?: string;
}
export const CancelUpdateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  StackName: string;
  RoleARN?: string;
  ResourcesToSkip?: ResourcesToSkip;
  ClientRequestToken?: string;
}
export const ContinueUpdateRollbackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  Arn: string;
  Type: string;
}
export const RollbackTrigger = S.suspend(() =>
  S.Struct({ Arn: S.String, Type: S.String }),
).annotations({
  identifier: "RollbackTrigger",
}) as any as S.Schema<RollbackTrigger>;
export type RollbackTriggers = RollbackTrigger[];
export const RollbackTriggers = S.Array(RollbackTrigger);
export interface RollbackConfiguration {
  RollbackTriggers?: RollbackTriggers;
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
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateStackInput {
  StackName: string;
  TemplateBody?: string;
  TemplateURL?: string;
  Parameters?: Parameters;
  DisableRollback?: boolean;
  RollbackConfiguration?: RollbackConfiguration;
  TimeoutInMinutes?: number;
  NotificationARNs?: NotificationARNs;
  Capabilities?: Capabilities;
  ResourceTypes?: ResourceTypes;
  RoleARN?: string;
  OnFailure?: string;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
  Tags?: Tags;
  ClientRequestToken?: string;
  EnableTerminationProtection?: boolean;
  RetainExceptOnCreate?: boolean;
}
export const CreateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
    OnFailure: S.optional(S.String),
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
  Type?: string;
  Arn?: string;
}
export const DeactivateTypeInput = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    Type: S.optional(S.String),
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
  ChangeSetName: string;
  StackName?: string;
}
export const DeleteChangeSetInput = S.suspend(() =>
  S.Struct({ ChangeSetName: S.String, StackName: S.optional(S.String) }).pipe(
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
  GeneratedTemplateName: string;
}
export const DeleteGeneratedTemplateInput = S.suspend(() =>
  S.Struct({ GeneratedTemplateName: S.String }).pipe(
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
  StackName: string;
  RetainResources?: RetainResources;
  RoleARN?: string;
  ClientRequestToken?: string;
  DeletionMode?: string;
}
export const DeleteStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    RetainResources: S.optional(RetainResources),
    RoleARN: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    DeletionMode: S.optional(S.String),
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
export interface DeploymentTargets {
  Accounts?: AccountList;
  AccountsUrl?: string;
  OrganizationalUnitIds?: OrganizationalUnitIdList;
  AccountFilterType?: string;
}
export const DeploymentTargets = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(AccountList),
    AccountsUrl: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    AccountFilterType: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentTargets",
}) as any as S.Schema<DeploymentTargets>;
export interface StackSetOperationPreferences {
  RegionConcurrencyType?: string;
  RegionOrder?: RegionList;
  FailureToleranceCount?: number;
  FailureTolerancePercentage?: number;
  MaxConcurrentCount?: number;
  MaxConcurrentPercentage?: number;
  ConcurrencyMode?: string;
}
export const StackSetOperationPreferences = S.suspend(() =>
  S.Struct({
    RegionConcurrencyType: S.optional(S.String),
    RegionOrder: S.optional(RegionList),
    FailureToleranceCount: S.optional(S.Number),
    FailureTolerancePercentage: S.optional(S.Number),
    MaxConcurrentCount: S.optional(S.Number),
    MaxConcurrentPercentage: S.optional(S.Number),
    ConcurrencyMode: S.optional(S.String),
  }),
).annotations({
  identifier: "StackSetOperationPreferences",
}) as any as S.Schema<StackSetOperationPreferences>;
export interface DeleteStackInstancesInput {
  StackSetName: string;
  Accounts?: AccountList;
  DeploymentTargets?: DeploymentTargets;
  Regions: RegionList;
  OperationPreferences?: StackSetOperationPreferences;
  RetainStacks: boolean;
  OperationId?: string;
  CallAs?: string;
}
export const DeleteStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    OperationPreferences: S.optional(StackSetOperationPreferences),
    RetainStacks: S.Boolean,
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  StackSetName: string;
  CallAs?: string;
}
export const DeleteStackSetInput = S.suspend(() =>
  S.Struct({ StackSetName: S.String, CallAs: S.optional(S.String) }).pipe(
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
  Type?: string;
  TypeName?: string;
  VersionId?: string;
}
export const DeregisterTypeInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
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
  ChangeSetName: string;
  StackName?: string;
  NextToken?: string;
  IncludePropertyValues?: boolean;
}
export const DescribeChangeSetInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.String,
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
  ChangeSetName: string;
  StackName?: string;
  NextToken?: string;
  LogicalResourceId?: string;
}
export const DescribeChangeSetHooksInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.String,
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
  GeneratedTemplateName: string;
}
export const DescribeGeneratedTemplateInput = S.suspend(() =>
  S.Struct({ GeneratedTemplateName: S.String }).pipe(
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
  CallAs?: string;
}
export const DescribeOrganizationsAccessInput = S.suspend(() =>
  S.Struct({ CallAs: S.optional(S.String) }).pipe(
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
  ResourceScanId: string;
}
export const DescribeResourceScanInput = S.suspend(() =>
  S.Struct({ ResourceScanId: S.String }).pipe(
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
  StackDriftDetectionId: string;
}
export const DescribeStackDriftDetectionStatusInput = S.suspend(() =>
  S.Struct({ StackDriftDetectionId: S.String }).pipe(
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
  StackName: string;
  NextToken?: string;
}
export const DescribeStackEventsInput = S.suspend(() =>
  S.Struct({ StackName: S.String, NextToken: S.optional(S.String) }).pipe(
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
  StackSetName: string;
  StackInstanceAccount: string;
  StackInstanceRegion: string;
  CallAs?: string;
}
export const DescribeStackInstanceInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    StackInstanceAccount: S.String,
    StackInstanceRegion: S.String,
    CallAs: S.optional(S.String),
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
  StackRefactorId: string;
}
export const DescribeStackRefactorInput = S.suspend(() =>
  S.Struct({ StackRefactorId: S.String }).pipe(
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
  StackName: string;
  LogicalResourceId: string;
}
export const DescribeStackResourceInput = S.suspend(() =>
  S.Struct({ StackName: S.String, LogicalResourceId: S.String }).pipe(
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
  StackName: string;
  StackResourceDriftStatusFilters?: StackResourceDriftStatusFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeStackResourceDriftsInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  StackSetName: string;
  CallAs?: string;
}
export const DescribeStackSetInput = S.suspend(() =>
  S.Struct({ StackSetName: S.String, CallAs: S.optional(S.String) }).pipe(
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
  StackSetName: string;
  OperationId: string;
  CallAs?: string;
}
export const DescribeStackSetOperationInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    OperationId: S.String,
    CallAs: S.optional(S.String),
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
  Type?: string;
  TypeName?: string;
  Arn?: string;
  VersionId?: string;
  PublisherId?: string;
  PublicVersionNumber?: string;
}
export const DescribeTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
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
  RegistrationToken: string;
}
export const DescribeTypeRegistrationInput = S.suspend(() =>
  S.Struct({ RegistrationToken: S.String }).pipe(
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
  StackName: string;
  LogicalResourceIds?: LogicalResourceIds;
}
export const DetectStackDriftInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  StackName: string;
  LogicalResourceId: string;
}
export const DetectStackResourceDriftInput = S.suspend(() =>
  S.Struct({ StackName: S.String, LogicalResourceId: S.String }).pipe(
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
  StackSetName: string;
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: string;
}
export const DetectStackSetDriftInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  Parameters?: Parameters;
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
  ChangeSetName: string;
  StackName?: string;
  ClientRequestToken?: string;
  DisableRollback?: boolean;
  RetainExceptOnCreate?: boolean;
}
export const ExecuteChangeSetInput = S.suspend(() =>
  S.Struct({
    ChangeSetName: S.String,
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
  StackRefactorId: string;
}
export const ExecuteStackRefactorInput = S.suspend(() =>
  S.Struct({ StackRefactorId: S.String }).pipe(
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
  Format?: string;
  GeneratedTemplateName: string;
}
export const GetGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    Format: S.optional(S.String),
    GeneratedTemplateName: S.String,
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
  StackName: string;
}
export const GetStackPolicyInput = S.suspend(() =>
  S.Struct({ StackName: S.String }).pipe(
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
  TemplateStage?: string;
}
export const GetTemplateInput = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    TemplateStage: S.optional(S.String),
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
  StackSetName: string;
  StackIds?: StackIdList;
  StackIdsUrl?: string;
  OrganizationalUnitIds?: OrganizationalUnitIdList;
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: string;
}
export const ImportStacksToStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    StackIds: S.optional(StackIdList),
    StackIdsUrl: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  StackName: string;
  NextToken?: string;
}
export const ListChangeSetsInput = S.suspend(() =>
  S.Struct({ StackName: S.String, NextToken: S.optional(S.String) }).pipe(
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
  TargetType?: string;
  TargetId?: string;
  TypeArn?: string;
  Status?: string;
  NextToken?: string;
}
export const ListHookResultsInput = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(S.String),
    TargetId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    Status: S.optional(S.String),
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
  ExportName: string;
  NextToken?: string;
}
export const ListImportsInput = S.suspend(() =>
  S.Struct({ ExportName: S.String, NextToken: S.optional(S.String) }).pipe(
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
  ResourceScanId: string;
  ResourceIdentifier?: string;
  ResourceTypePrefix?: string;
  TagKey?: string;
  TagValue?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceScanResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.String,
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
  ScanTypeFilter?: string;
}
export const ListResourceScansInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ScanTypeFilter: S.optional(S.String),
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
  StackSetName: string;
  NextToken?: string;
  MaxResults?: number;
  StackInstanceResourceDriftStatuses?: StackResourceDriftStatusFilters;
  StackInstanceAccount: string;
  StackInstanceRegion: string;
  OperationId: string;
  CallAs?: string;
}
export const ListStackInstanceResourceDriftsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StackInstanceResourceDriftStatuses: S.optional(
      StackResourceDriftStatusFilters,
    ),
    StackInstanceAccount: S.String,
    StackInstanceRegion: S.String,
    OperationId: S.String,
    CallAs: S.optional(S.String),
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
  StackRefactorId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListStackRefactorActionsInput = S.suspend(() =>
  S.Struct({
    StackRefactorId: S.String,
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
  ExecutionStatusFilter?: StackRefactorExecutionStatusFilter;
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
  StackName: string;
  NextToken?: string;
}
export const ListStackResourcesInput = S.suspend(() =>
  S.Struct({ StackName: S.String, NextToken: S.optional(S.String) }).pipe(
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
  StackStatusFilter?: StackStatusFilter;
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
  StackSetName: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: string;
}
export const ListStackSetAutoDeploymentTargetsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
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
  StackSetName: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: string;
}
export const ListStackSetOperationsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
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
  Status?: string;
  CallAs?: string;
}
export const ListStackSetsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  Type?: string;
  TypeName?: string;
  TypeArn?: string;
  RegistrationStatusFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTypeRegistrationsInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    TypeArn: S.optional(S.String),
    RegistrationStatusFilter: S.optional(S.String),
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
  Type?: string;
  TypeName?: string;
  Arn?: string;
  MaxResults?: number;
  NextToken?: string;
  DeprecatedStatus?: string;
  PublisherId?: string;
}
export const ListTypeVersionsInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    Arn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    DeprecatedStatus: S.optional(S.String),
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
  Type?: string;
  Arn?: string;
  TypeName?: string;
  PublicVersionNumber?: string;
}
export const PublishTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
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
  BearerToken: string;
  OperationStatus: string;
  CurrentOperationStatus?: string;
  StatusMessage?: string;
  ErrorCode?: string;
  ResourceModel?: string;
  ClientRequestToken?: string;
}
export const RecordHandlerProgressInput = S.suspend(() =>
  S.Struct({
    BearerToken: S.String,
    OperationStatus: S.String,
    CurrentOperationStatus: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
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
  LogRoleArn: string;
  LogGroupName: string;
}
export const LoggingConfig = S.suspend(() =>
  S.Struct({ LogRoleArn: S.String, LogGroupName: S.String }),
).annotations({
  identifier: "LoggingConfig",
}) as any as S.Schema<LoggingConfig>;
export interface RegisterTypeInput {
  Type?: string;
  TypeName: string;
  SchemaHandlerPackage: string;
  LoggingConfig?: LoggingConfig;
  ExecutionRoleArn?: string;
  ClientRequestToken?: string;
}
export const RegisterTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    TypeName: S.String,
    SchemaHandlerPackage: S.String,
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
  StackName: string;
  RoleARN?: string;
  ClientRequestToken?: string;
  RetainExceptOnCreate?: boolean;
}
export const RollbackStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  StackName: string;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
}
export const SetStackPolicyInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  Configuration: string;
  ConfigurationAlias?: string;
  TypeName?: string;
  Type?: string;
}
export const SetTypeConfigurationInput = S.suspend(() =>
  S.Struct({
    TypeArn: S.optional(S.String),
    Configuration: S.String,
    ConfigurationAlias: S.optional(S.String),
    TypeName: S.optional(S.String),
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
  identifier: "SetTypeConfigurationInput",
}) as any as S.Schema<SetTypeConfigurationInput>;
export interface SetTypeDefaultVersionInput {
  Arn?: string;
  Type?: string;
  TypeName?: string;
  VersionId?: string;
}
export const SetTypeDefaultVersionInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
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
  StackName: string;
  LogicalResourceId: string;
  UniqueId: string;
  Status: string;
}
export const SignalResourceInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
    LogicalResourceId: S.String,
    UniqueId: S.String,
    Status: S.String,
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
  StackSetName: string;
  OperationId: string;
  CallAs?: string;
}
export const StopStackSetOperationInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    OperationId: S.String,
    CallAs: S.optional(S.String),
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
  Type?: string;
  TypeName?: string;
  VersionId?: string;
  LogDeliveryBucket?: string;
}
export const TestTypeInput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
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
export type ResourceIdentifierProperties = { [key: string]: string };
export const ResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.String,
});
export interface ResourceDefinition {
  ResourceType: string;
  LogicalResourceId?: string;
  ResourceIdentifier: ResourceIdentifierProperties;
}
export const ResourceDefinition = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    LogicalResourceId: S.optional(S.String),
    ResourceIdentifier: ResourceIdentifierProperties,
  }),
).annotations({
  identifier: "ResourceDefinition",
}) as any as S.Schema<ResourceDefinition>;
export type ResourceDefinitions = ResourceDefinition[];
export const ResourceDefinitions = S.Array(ResourceDefinition);
export interface TemplateConfiguration {
  DeletionPolicy?: string;
  UpdateReplacePolicy?: string;
}
export const TemplateConfiguration = S.suspend(() =>
  S.Struct({
    DeletionPolicy: S.optional(S.String),
    UpdateReplacePolicy: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateConfiguration",
}) as any as S.Schema<TemplateConfiguration>;
export interface UpdateGeneratedTemplateInput {
  GeneratedTemplateName: string;
  NewGeneratedTemplateName?: string;
  AddResources?: ResourceDefinitions;
  RemoveResources?: JazzLogicalResourceIds;
  RefreshAllResources?: boolean;
  TemplateConfiguration?: TemplateConfiguration;
}
export const UpdateGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    GeneratedTemplateName: S.String,
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
  StackName: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  StackPolicyDuringUpdateBody?: string;
  StackPolicyDuringUpdateURL?: string;
  Parameters?: Parameters;
  Capabilities?: Capabilities;
  ResourceTypes?: ResourceTypes;
  RoleARN?: string;
  RollbackConfiguration?: RollbackConfiguration;
  StackPolicyBody?: string;
  StackPolicyURL?: string;
  NotificationARNs?: NotificationARNs;
  Tags?: Tags;
  DisableRollback?: boolean;
  ClientRequestToken?: string;
  RetainExceptOnCreate?: boolean;
}
export const UpdateStackInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
  StackSetName: string;
  Accounts?: AccountList;
  DeploymentTargets?: DeploymentTargets;
  Regions: RegionList;
  ParameterOverrides?: Parameters;
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: string;
}
export const UpdateStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  DependsOn?: StackSetARNList;
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
  StackSetName: string;
  Description?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  Parameters?: Parameters;
  Capabilities?: Capabilities;
  Tags?: Tags;
  OperationPreferences?: StackSetOperationPreferences;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  DeploymentTargets?: DeploymentTargets;
  PermissionModel?: string;
  AutoDeployment?: AutoDeployment;
  OperationId?: string;
  Accounts?: AccountList;
  Regions?: RegionList;
  CallAs?: string;
  ManagedExecution?: ManagedExecution;
}
export const UpdateStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
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
    PermissionModel: S.optional(S.String),
    AutoDeployment: S.optional(AutoDeployment),
    OperationId: S.optional(S.String),
    Accounts: S.optional(AccountList),
    Regions: S.optional(RegionList),
    CallAs: S.optional(S.String),
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
  EnableTerminationProtection: boolean;
  StackName: string;
}
export const UpdateTerminationProtectionInput = S.suspend(() =>
  S.Struct({
    EnableTerminationProtection: S.Boolean,
    StackName: S.String,
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
export type ResourceTypeFilters = string[];
export const ResourceTypeFilters = S.Array(S.String);
export interface TypeConfigurationIdentifier {
  TypeArn?: string;
  TypeConfigurationAlias?: string;
  TypeConfigurationArn?: string;
  Type?: string;
  TypeName?: string;
}
export const TypeConfigurationIdentifier = S.suspend(() =>
  S.Struct({
    TypeArn: S.optional(S.String),
    TypeConfigurationAlias: S.optional(S.String),
    TypeConfigurationArn: S.optional(S.String),
    Type: S.optional(S.String),
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
export interface EventFilter {
  FailedEvents?: boolean;
}
export const EventFilter = S.suspend(() =>
  S.Struct({ FailedEvents: S.optional(S.Boolean) }),
).annotations({ identifier: "EventFilter" }) as any as S.Schema<EventFilter>;
export type StackIds = string[];
export const StackIds = S.Array(S.String);
export type StageList = string[];
export const StageList = S.Array(S.String);
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
  Name?: string;
  Values?: string;
}
export const StackInstanceFilter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(S.String) }),
).annotations({
  identifier: "StackInstanceFilter",
}) as any as S.Schema<StackInstanceFilter>;
export type StackInstanceFilters = StackInstanceFilter[];
export const StackInstanceFilters = S.Array(StackInstanceFilter);
export interface OperationResultFilter {
  Name?: string;
  Values?: string;
}
export const OperationResultFilter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(S.String) }),
).annotations({
  identifier: "OperationResultFilter",
}) as any as S.Schema<OperationResultFilter>;
export type OperationResultFilters = OperationResultFilter[];
export const OperationResultFilters = S.Array(OperationResultFilter);
export type RegistrationTokenList = string[];
export const RegistrationTokenList = S.Array(S.String);
export interface TypeFilters {
  Category?: string;
  PublisherId?: string;
  TypeNamePrefix?: string;
}
export const TypeFilters = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String),
    PublisherId: S.optional(S.String),
    TypeNamePrefix: S.optional(S.String),
  }),
).annotations({ identifier: "TypeFilters" }) as any as S.Schema<TypeFilters>;
export interface ScanFilter {
  Types?: ResourceTypeFilters;
}
export const ScanFilter = S.suspend(() =>
  S.Struct({ Types: S.optional(ResourceTypeFilters) }),
).annotations({ identifier: "ScanFilter" }) as any as S.Schema<ScanFilter>;
export type ScanFilters = ScanFilter[];
export const ScanFilters = S.Array(ScanFilter);
export type TransformsList = string[];
export const TransformsList = S.Array(S.String);
export interface ActivateTypeInput {
  Type?: string;
  PublicTypeArn?: string;
  PublisherId?: string;
  TypeName?: string;
  TypeNameAlias?: string;
  AutoUpdate?: boolean;
  LoggingConfig?: LoggingConfig;
  ExecutionRoleArn?: string;
  VersionBump?: string;
  MajorVersion?: number;
}
export const ActivateTypeInput = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    PublicTypeArn: S.optional(S.String),
    PublisherId: S.optional(S.String),
    TypeName: S.optional(S.String),
    TypeNameAlias: S.optional(S.String),
    AutoUpdate: S.optional(S.Boolean),
    LoggingConfig: S.optional(LoggingConfig),
    ExecutionRoleArn: S.optional(S.String),
    VersionBump: S.optional(S.String),
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
  TypeConfigurationIdentifiers: TypeConfigurationIdentifiers;
}
export const BatchDescribeTypeConfigurationsInput = S.suspend(() =>
  S.Struct({ TypeConfigurationIdentifiers: TypeConfigurationIdentifiers }).pipe(
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
  Resources?: ResourceDefinitions;
  GeneratedTemplateName: string;
  StackName?: string;
  TemplateConfiguration?: TemplateConfiguration;
}
export const CreateGeneratedTemplateInput = S.suspend(() =>
  S.Struct({
    Resources: S.optional(ResourceDefinitions),
    GeneratedTemplateName: S.String,
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
  StackSetName: string;
  Accounts?: AccountList;
  DeploymentTargets?: DeploymentTargets;
  Regions: RegionList;
  ParameterOverrides?: Parameters;
  OperationPreferences?: StackSetOperationPreferences;
  OperationId?: string;
  CallAs?: string;
}
export const CreateStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  StackSetName: string;
  Description?: string;
  TemplateBody?: string;
  TemplateURL?: string;
  StackId?: string;
  Parameters?: Parameters;
  Capabilities?: Capabilities;
  Tags?: Tags;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  PermissionModel?: string;
  AutoDeployment?: AutoDeployment;
  CallAs?: string;
  ClientRequestToken?: string;
  ManagedExecution?: ManagedExecution;
}
export const CreateStackSetInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    Description: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    StackId: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    PermissionModel: S.optional(S.String),
    AutoDeployment: S.optional(AutoDeployment),
    CallAs: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
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
  Status?: string;
}
export const DescribeOrganizationsAccessOutput = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DescribeOrganizationsAccessOutput",
}) as any as S.Schema<DescribeOrganizationsAccessOutput>;
export interface DescribePublisherOutput {
  PublisherId?: string;
  PublisherStatus?: string;
  IdentityProvider?: string;
  PublisherProfile?: string;
}
export const DescribePublisherOutput = S.suspend(() =>
  S.Struct({
    PublisherId: S.optional(S.String),
    PublisherStatus: S.optional(S.String),
    IdentityProvider: S.optional(S.String),
    PublisherProfile: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePublisherOutput",
}) as any as S.Schema<DescribePublisherOutput>;
export interface DescribeResourceScanOutput {
  ResourceScanId?: string;
  Status?: string;
  StatusReason?: string;
  StartTime?: Date;
  EndTime?: Date;
  PercentageCompleted?: number;
  ResourceTypes?: ResourceTypes;
  ResourcesScanned?: number;
  ResourcesRead?: number;
  ScanFilters?: ScanFilters;
}
export const DescribeResourceScanOutput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    Status: S.optional(S.String),
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
  StackDriftStatus?: string;
  DetectionStatus: string;
  DetectionStatusReason?: string;
  DriftedStackResourceCount?: number;
  Timestamp: Date;
}
export const DescribeStackDriftDetectionStatusOutput = S.suspend(() =>
  S.Struct({
    StackId: S.String,
    StackDriftDetectionId: S.String,
    StackDriftStatus: S.optional(S.String),
    DetectionStatus: S.String,
    DetectionStatusReason: S.optional(S.String),
    DriftedStackResourceCount: S.optional(S.Number),
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackDriftDetectionStatusOutput",
}) as any as S.Schema<DescribeStackDriftDetectionStatusOutput>;
export interface DescribeStackRefactorOutput {
  Description?: string;
  StackRefactorId?: string;
  StackIds?: StackIds;
  ExecutionStatus?: string;
  ExecutionStatusReason?: string;
  Status?: string;
  StatusReason?: string;
}
export const DescribeStackRefactorOutput = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    StackRefactorId: S.optional(S.String),
    StackIds: S.optional(StackIds),
    ExecutionStatus: S.optional(S.String),
    ExecutionStatusReason: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackRefactorOutput",
}) as any as S.Schema<DescribeStackRefactorOutput>;
export interface DescribeTypeRegistrationOutput {
  ProgressStatus?: string;
  Description?: string;
  TypeArn?: string;
  TypeVersionArn?: string;
}
export const DescribeTypeRegistrationOutput = S.suspend(() =>
  S.Struct({
    ProgressStatus: S.optional(S.String),
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
  S.Struct({ StackDriftDetectionId: S.String }).pipe(ns),
).annotations({
  identifier: "DetectStackDriftOutput",
}) as any as S.Schema<DetectStackDriftOutput>;
export interface PhysicalResourceIdContextKeyValuePair {
  Key: string;
  Value: string;
}
export const PhysicalResourceIdContextKeyValuePair = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "PhysicalResourceIdContextKeyValuePair",
}) as any as S.Schema<PhysicalResourceIdContextKeyValuePair>;
export type PhysicalResourceIdContext = PhysicalResourceIdContextKeyValuePair[];
export const PhysicalResourceIdContext = S.Array(
  PhysicalResourceIdContextKeyValuePair,
);
export interface PropertyDifference {
  PropertyPath: string;
  ExpectedValue: string;
  ActualValue: string;
  DifferenceType: string;
}
export const PropertyDifference = S.suspend(() =>
  S.Struct({
    PropertyPath: S.String,
    ExpectedValue: S.String,
    ActualValue: S.String,
    DifferenceType: S.String,
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
  StackId: string;
  LogicalResourceId: string;
  PhysicalResourceId?: string;
  PhysicalResourceIdContext?: PhysicalResourceIdContext;
  ResourceType: string;
  ExpectedProperties?: string;
  ActualProperties?: string;
  PropertyDifferences?: PropertyDifferences;
  StackResourceDriftStatus: string;
  Timestamp: Date;
  ModuleInfo?: ModuleInfo;
  DriftStatusReason?: string;
}
export const StackResourceDrift = S.suspend(() =>
  S.Struct({
    StackId: S.String,
    LogicalResourceId: S.String,
    PhysicalResourceId: S.optional(S.String),
    PhysicalResourceIdContext: S.optional(PhysicalResourceIdContext),
    ResourceType: S.String,
    ExpectedProperties: S.optional(S.String),
    ActualProperties: S.optional(S.String),
    PropertyDifferences: S.optional(PropertyDifferences),
    StackResourceDriftStatus: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    ModuleInfo: S.optional(ModuleInfo),
    DriftStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StackResourceDrift",
}) as any as S.Schema<StackResourceDrift>;
export interface DetectStackResourceDriftOutput {
  StackResourceDrift: StackResourceDrift;
}
export const DetectStackResourceDriftOutput = S.suspend(() =>
  S.Struct({ StackResourceDrift: StackResourceDrift }).pipe(ns),
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
  Status?: string;
  TemplateBody?: string;
}
export const GetGeneratedTemplateOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
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
  StagesAvailable?: StageList;
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
  CallAs?: string;
  TemplateSummaryConfig?: TemplateSummaryConfig;
}
export const GetTemplateSummaryInput = S.suspend(() =>
  S.Struct({
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    StackName: S.optional(S.String),
    StackSetName: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  Imports?: Imports;
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
  StackSetName: string;
  NextToken?: string;
  MaxResults?: number;
  Filters?: StackInstanceFilters;
  StackInstanceAccount?: string;
  StackInstanceRegion?: string;
  CallAs?: string;
}
export const ListStackInstancesInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(StackInstanceFilters),
    StackInstanceAccount: S.optional(S.String),
    StackInstanceRegion: S.optional(S.String),
    CallAs: S.optional(S.String),
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
  StackSetName: string;
  OperationId: string;
  NextToken?: string;
  MaxResults?: number;
  CallAs?: string;
  Filters?: OperationResultFilters;
}
export const ListStackSetOperationResultsInput = S.suspend(() =>
  S.Struct({
    StackSetName: S.String,
    OperationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
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
  RegistrationTokenList?: RegistrationTokenList;
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
  Visibility?: string;
  ProvisioningType?: string;
  DeprecatedStatus?: string;
  Type?: string;
  Filters?: TypeFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTypesInput = S.suspend(() =>
  S.Struct({
    Visibility: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
    DeprecatedStatus: S.optional(S.String),
    Type: S.optional(S.String),
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
  ScanFilters?: ScanFilters;
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
  StackName: string;
  LogicalResourceId: string;
}
export const ResourceLocation = S.suspend(() =>
  S.Struct({ StackName: S.String, LogicalResourceId: S.String }),
).annotations({
  identifier: "ResourceLocation",
}) as any as S.Schema<ResourceLocation>;
export type SupportedMajorVersions = number[];
export const SupportedMajorVersions = S.Array(S.Number);
export type JazzResourceIdentifierProperties = { [key: string]: string };
export const JazzResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.String,
});
export type StackRefactorTagResources = Tag[];
export const StackRefactorTagResources = S.Array(Tag);
export type StackRefactorUntagResources = string[];
export const StackRefactorUntagResources = S.Array(S.String);
export type UnprocessedTypeConfigurations = TypeConfigurationIdentifier[];
export const UnprocessedTypeConfigurations = S.Array(
  TypeConfigurationIdentifier,
);
export interface ResourceToImport {
  ResourceType: string;
  LogicalResourceId: string;
  ResourceIdentifier: ResourceIdentifierProperties;
}
export const ResourceToImport = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    LogicalResourceId: S.String,
    ResourceIdentifier: ResourceIdentifierProperties,
  }),
).annotations({
  identifier: "ResourceToImport",
}) as any as S.Schema<ResourceToImport>;
export type ResourcesToImport = ResourceToImport[];
export const ResourcesToImport = S.Array(ResourceToImport);
export interface ResourceMapping {
  Source: ResourceLocation;
  Destination: ResourceLocation;
}
export const ResourceMapping = S.suspend(() =>
  S.Struct({ Source: ResourceLocation, Destination: ResourceLocation }),
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
  StackId: string;
  EventId: string;
  StackName: string;
  OperationId?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Timestamp: Date;
  ResourceStatus?: string;
  ResourceStatusReason?: string;
  ResourceProperties?: string;
  ClientRequestToken?: string;
  HookType?: string;
  HookStatus?: string;
  HookStatusReason?: string;
  HookInvocationPoint?: string;
  HookInvocationId?: string;
  HookFailureMode?: string;
  DetailedStatus?: string;
}
export const StackEvent = S.suspend(() =>
  S.Struct({
    StackId: S.String,
    EventId: S.String,
    StackName: S.String,
    OperationId: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    ResourceStatus: S.optional(S.String),
    ResourceStatusReason: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    HookType: S.optional(S.String),
    HookStatus: S.optional(S.String),
    HookStatusReason: S.optional(S.String),
    HookInvocationPoint: S.optional(S.String),
    HookInvocationId: S.optional(S.String),
    HookFailureMode: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
  }),
).annotations({ identifier: "StackEvent" }) as any as S.Schema<StackEvent>;
export type StackEvents = StackEvent[];
export const StackEvents = S.Array(StackEvent);
export interface StackResourceDriftInformation {
  StackResourceDriftStatus: string;
  LastCheckTimestamp?: Date;
}
export const StackResourceDriftInformation = S.suspend(() =>
  S.Struct({
    StackResourceDriftStatus: S.String,
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackResourceDriftInformation",
}) as any as S.Schema<StackResourceDriftInformation>;
export interface StackResource {
  StackName?: string;
  StackId?: string;
  LogicalResourceId: string;
  PhysicalResourceId?: string;
  ResourceType: string;
  Timestamp: Date;
  ResourceStatus: string;
  ResourceStatusReason?: string;
  Description?: string;
  DriftInformation?: StackResourceDriftInformation;
  ModuleInfo?: ModuleInfo;
}
export const StackResource = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    StackId: S.optional(S.String),
    LogicalResourceId: S.String,
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    ResourceStatus: S.String,
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
  SupportedMajorVersions?: SupportedMajorVersions;
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
  TargetType: string;
  TargetTypeName: string;
  TargetId: string;
  Action: string;
}
export const HookTarget = S.suspend(() =>
  S.Struct({
    TargetType: S.String,
    TargetTypeName: S.String,
    TargetId: S.String,
    Action: S.String,
  }),
).annotations({ identifier: "HookTarget" }) as any as S.Schema<HookTarget>;
export interface Annotation {
  AnnotationName?: string;
  Status?: string;
  StatusMessage?: string;
  RemediationMessage?: string;
  RemediationLink?: string;
  SeverityLevel?: string;
}
export const Annotation = S.suspend(() =>
  S.Struct({
    AnnotationName: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    RemediationMessage: S.optional(S.String),
    RemediationLink: S.optional(S.String),
    SeverityLevel: S.optional(S.String),
  }),
).annotations({ identifier: "Annotation" }) as any as S.Schema<Annotation>;
export type AnnotationList = Annotation[];
export const AnnotationList = S.Array(Annotation);
export interface ChangeSetSummary {
  StackId?: string;
  StackName?: string;
  ChangeSetId?: string;
  ChangeSetName?: string;
  ExecutionStatus?: string;
  Status?: string;
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
    ExecutionStatus: S.optional(S.String),
    Status: S.optional(S.String),
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
  Status?: string;
  StatusReason?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  NumberOfResources?: number;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    GeneratedTemplateId: S.optional(S.String),
    GeneratedTemplateName: S.optional(S.String),
    Status: S.optional(S.String),
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
  InvocationPoint?: string;
  FailureMode?: string;
  TypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  Status?: string;
  HookStatusReason?: string;
  InvokedAt?: Date;
  TargetType?: string;
  TargetId?: string;
  TypeArn?: string;
  HookExecutionTarget?: string;
}
export const HookResultSummary = S.suspend(() =>
  S.Struct({
    HookResultId: S.optional(S.String),
    InvocationPoint: S.optional(S.String),
    FailureMode: S.optional(S.String),
    TypeName: S.optional(S.String),
    TypeVersionId: S.optional(S.String),
    TypeConfigurationVersionId: S.optional(S.String),
    Status: S.optional(S.String),
    HookStatusReason: S.optional(S.String),
    InvokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TargetType: S.optional(S.String),
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
  ResourceType: string;
  ResourceIdentifier: JazzResourceIdentifierProperties;
}
export const ScannedResourceIdentifier = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    ResourceIdentifier: JazzResourceIdentifierProperties,
  }),
).annotations({
  identifier: "ScannedResourceIdentifier",
}) as any as S.Schema<ScannedResourceIdentifier>;
export type ScannedResourceIdentifiers = ScannedResourceIdentifier[];
export const ScannedResourceIdentifiers = S.Array(ScannedResourceIdentifier);
export interface ScannedResource {
  ResourceType?: string;
  ResourceIdentifier?: JazzResourceIdentifierProperties;
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
  Status?: string;
  StatusReason?: string;
  StartTime?: Date;
  EndTime?: Date;
  PercentageCompleted?: number;
  ScanType?: string;
}
export const ResourceScanSummary = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PercentageCompleted: S.optional(S.Number),
    ScanType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceScanSummary",
}) as any as S.Schema<ResourceScanSummary>;
export type ResourceScanSummaries = ResourceScanSummary[];
export const ResourceScanSummaries = S.Array(ResourceScanSummary);
export interface StackInstanceResourceDriftsSummary {
  StackId: string;
  LogicalResourceId: string;
  PhysicalResourceId?: string;
  PhysicalResourceIdContext?: PhysicalResourceIdContext;
  ResourceType: string;
  PropertyDifferences?: PropertyDifferences;
  StackResourceDriftStatus: string;
  Timestamp: Date;
}
export const StackInstanceResourceDriftsSummary = S.suspend(() =>
  S.Struct({
    StackId: S.String,
    LogicalResourceId: S.String,
    PhysicalResourceId: S.optional(S.String),
    PhysicalResourceIdContext: S.optional(PhysicalResourceIdContext),
    ResourceType: S.String,
    PropertyDifferences: S.optional(PropertyDifferences),
    StackResourceDriftStatus: S.String,
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
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
  Action?: string;
  Entity?: string;
  PhysicalResourceId?: string;
  ResourceIdentifier?: string;
  Description?: string;
  Detection?: string;
  DetectionReason?: string;
  TagResources?: StackRefactorTagResources;
  UntagResources?: StackRefactorUntagResources;
  ResourceMapping?: ResourceMapping;
}
export const StackRefactorAction = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    Entity: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    Detection: S.optional(S.String),
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
  ExecutionStatus?: string;
  ExecutionStatusReason?: string;
  Status?: string;
  StatusReason?: string;
}
export const StackRefactorSummary = S.suspend(() =>
  S.Struct({
    StackRefactorId: S.optional(S.String),
    Description: S.optional(S.String),
    ExecutionStatus: S.optional(S.String),
    ExecutionStatusReason: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StackRefactorSummary",
}) as any as S.Schema<StackRefactorSummary>;
export type StackRefactorSummaries = StackRefactorSummary[];
export const StackRefactorSummaries = S.Array(StackRefactorSummary);
export interface StackSetAutoDeploymentTargetSummary {
  OrganizationalUnitId?: string;
  Regions?: RegionList;
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
  Action?: string;
  Status?: string;
  CreationTimestamp?: Date;
  EndTimestamp?: Date;
  StatusReason?: string;
  StatusDetails?: StackSetOperationStatusDetails;
  OperationPreferences?: StackSetOperationPreferences;
}
export const StackSetOperationSummary = S.suspend(() =>
  S.Struct({
    OperationId: S.optional(S.String),
    Action: S.optional(S.String),
    Status: S.optional(S.String),
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
  Status?: string;
  AutoDeployment?: AutoDeployment;
  PermissionModel?: string;
  DriftStatus?: string;
  LastDriftCheckTimestamp?: Date;
  ManagedExecution?: ManagedExecution;
}
export const StackSetSummary = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    AutoDeployment: S.optional(AutoDeployment),
    PermissionModel: S.optional(S.String),
    DriftStatus: S.optional(S.String),
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
  Type?: string;
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
    Type: S.optional(S.String),
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
export type Scope = string[];
export const Scope = S.Array(S.String);
export interface ActivateTypeOutput {
  Arn?: string;
}
export const ActivateTypeOutput = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ActivateTypeOutput",
}) as any as S.Schema<ActivateTypeOutput>;
export interface CreateChangeSetInput {
  StackName: string;
  TemplateBody?: string;
  TemplateURL?: string;
  UsePreviousTemplate?: boolean;
  Parameters?: Parameters;
  Capabilities?: Capabilities;
  ResourceTypes?: ResourceTypes;
  RoleARN?: string;
  RollbackConfiguration?: RollbackConfiguration;
  NotificationARNs?: NotificationARNs;
  Tags?: Tags;
  ChangeSetName: string;
  ClientToken?: string;
  Description?: string;
  ChangeSetType?: string;
  ResourcesToImport?: ResourcesToImport;
  IncludeNestedStacks?: boolean;
  OnStackFailure?: string;
  ImportExistingResources?: boolean;
  DeploymentMode?: string;
}
export const CreateChangeSetInput = S.suspend(() =>
  S.Struct({
    StackName: S.String,
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
    ChangeSetName: S.String,
    ClientToken: S.optional(S.String),
    Description: S.optional(S.String),
    ChangeSetType: S.optional(S.String),
    ResourcesToImport: S.optional(ResourcesToImport),
    IncludeNestedStacks: S.optional(S.Boolean),
    OnStackFailure: S.optional(S.String),
    ImportExistingResources: S.optional(S.Boolean),
    DeploymentMode: S.optional(S.String),
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
  ResourceMappings?: ResourceMappings;
  StackDefinitions: StackDefinitions;
}
export const CreateStackRefactorInput = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    EnableStackCreation: S.optional(S.Boolean),
    ResourceMappings: S.optional(ResourceMappings),
    StackDefinitions: StackDefinitions,
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
  AccountLimits?: AccountLimitList;
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
  StackEvents?: StackEvents;
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
  StackResources?: StackResources;
}
export const DescribeStackResourcesOutput = S.suspend(() =>
  S.Struct({ StackResources: S.optional(StackResources) }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourcesOutput",
}) as any as S.Schema<DescribeStackResourcesOutput>;
export interface DescribeTypeOutput {
  Arn?: string;
  Type?: string;
  TypeName?: string;
  DefaultVersionId?: string;
  IsDefaultVersion?: boolean;
  TypeTestsStatus?: string;
  TypeTestsStatusDescription?: string;
  Description?: string;
  Schema?: string;
  ProvisioningType?: string;
  DeprecatedStatus?: string;
  LoggingConfig?: LoggingConfig;
  RequiredActivatedTypes?: RequiredActivatedTypes;
  ExecutionRoleArn?: string;
  Visibility?: string;
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
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    IsDefaultVersion: S.optional(S.Boolean),
    TypeTestsStatus: S.optional(S.String),
    TypeTestsStatusDescription: S.optional(S.String),
    Description: S.optional(S.String),
    Schema: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
    DeprecatedStatus: S.optional(S.String),
    LoggingConfig: S.optional(LoggingConfig),
    RequiredActivatedTypes: S.optional(RequiredActivatedTypes),
    ExecutionRoleArn: S.optional(S.String),
    Visibility: S.optional(S.String),
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
  InvocationPoint?: string;
  FailureMode?: string;
  TypeName?: string;
  OriginalTypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  TypeArn?: string;
  Status?: string;
  HookStatusReason?: string;
  InvokedAt?: Date;
  Target?: HookTarget;
  Annotations?: AnnotationList;
}
export const GetHookResultOutput = S.suspend(() =>
  S.Struct({
    HookResultId: S.optional(S.String),
    InvocationPoint: S.optional(S.String),
    FailureMode: S.optional(S.String),
    TypeName: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    TypeVersionId: S.optional(S.String),
    TypeConfigurationVersionId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    Status: S.optional(S.String),
    HookStatusReason: S.optional(S.String),
    InvokedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Target: S.optional(HookTarget),
    Annotations: S.optional(AnnotationList),
  }).pipe(ns),
).annotations({
  identifier: "GetHookResultOutput",
}) as any as S.Schema<GetHookResultOutput>;
export interface ListChangeSetsOutput {
  Summaries?: ChangeSetSummaries;
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
  Exports?: Exports;
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
  Summaries?: TemplateSummaries;
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
  TargetType?: string;
  TargetId?: string;
  HookResults?: HookResultSummaries;
  NextToken?: string;
}
export const ListHookResultsOutput = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(S.String),
    TargetId: S.optional(S.String),
    HookResults: S.optional(HookResultSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListHookResultsOutput",
}) as any as S.Schema<ListHookResultsOutput>;
export interface ListResourceScanRelatedResourcesInput {
  ResourceScanId: string;
  Resources: ScannedResourceIdentifiers;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceScanRelatedResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceScanId: S.String,
    Resources: ScannedResourceIdentifiers,
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
  Resources?: ScannedResources;
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
  ResourceScanSummaries?: ResourceScanSummaries;
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
  Summaries?: StackInstanceResourceDriftsSummaries;
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
  StackRefactorActions: StackRefactorActions;
  NextToken?: string;
}
export const ListStackRefactorActionsOutput = S.suspend(() =>
  S.Struct({
    StackRefactorActions: StackRefactorActions,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackRefactorActionsOutput",
}) as any as S.Schema<ListStackRefactorActionsOutput>;
export interface ListStackRefactorsOutput {
  StackRefactorSummaries: StackRefactorSummaries;
  NextToken?: string;
}
export const ListStackRefactorsOutput = S.suspend(() =>
  S.Struct({
    StackRefactorSummaries: StackRefactorSummaries,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStackRefactorsOutput",
}) as any as S.Schema<ListStackRefactorsOutput>;
export interface ListStackSetAutoDeploymentTargetsOutput {
  Summaries?: StackSetAutoDeploymentTargetSummaries;
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
  Summaries?: StackSetOperationSummaries;
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
  Summaries?: StackSetSummaries;
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
  TypeVersionSummaries?: TypeVersionSummaries;
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
  Parameters?: TemplateParameters;
  Description?: string;
  Capabilities?: Capabilities;
  CapabilitiesReason?: string;
  DeclaredTransforms?: TransformsList;
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
export interface StackInstanceComprehensiveStatus {
  DetailedStatus?: string;
}
export const StackInstanceComprehensiveStatus = S.suspend(() =>
  S.Struct({ DetailedStatus: S.optional(S.String) }),
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
  StackDriftStatus: string;
  LastCheckTimestamp?: Date;
}
export const StackDriftInformation = S.suspend(() =>
  S.Struct({
    StackDriftStatus: S.String,
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackDriftInformation",
}) as any as S.Schema<StackDriftInformation>;
export interface OperationEntry {
  OperationType?: string;
  OperationId?: string;
}
export const OperationEntry = S.suspend(() =>
  S.Struct({
    OperationType: S.optional(S.String),
    OperationId: S.optional(S.String),
  }),
).annotations({
  identifier: "OperationEntry",
}) as any as S.Schema<OperationEntry>;
export type LastOperations = OperationEntry[];
export const LastOperations = S.Array(OperationEntry);
export interface StackSetDriftDetectionDetails {
  DriftStatus?: string;
  DriftDetectionStatus?: string;
  LastDriftCheckTimestamp?: Date;
  TotalStackInstancesCount?: number;
  DriftedStackInstancesCount?: number;
  InSyncStackInstancesCount?: number;
  InProgressStackInstancesCount?: number;
  FailedStackInstancesCount?: number;
}
export const StackSetDriftDetectionDetails = S.suspend(() =>
  S.Struct({
    DriftStatus: S.optional(S.String),
    DriftDetectionStatus: S.optional(S.String),
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
  StackResourceDriftStatus: string;
  LastCheckTimestamp?: Date;
}
export const StackResourceDriftInformationSummary = S.suspend(() =>
  S.Struct({
    StackResourceDriftStatus: S.String,
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackResourceDriftInformationSummary",
}) as any as S.Schema<StackResourceDriftInformationSummary>;
export interface StackDriftInformationSummary {
  StackDriftStatus: string;
  LastCheckTimestamp?: Date;
}
export const StackDriftInformationSummary = S.suspend(() =>
  S.Struct({
    StackDriftStatus: S.String,
    LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StackDriftInformationSummary",
}) as any as S.Schema<StackDriftInformationSummary>;
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
  OperationType?: string;
  OperationStatus?: string;
  EventType?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Timestamp?: Date;
  StartTime?: Date;
  EndTime?: Date;
  ResourceStatus?: string;
  ResourceStatusReason?: string;
  ResourceProperties?: string;
  ClientRequestToken?: string;
  HookType?: string;
  HookStatus?: string;
  HookStatusReason?: string;
  HookInvocationPoint?: string;
  HookFailureMode?: string;
  DetailedStatus?: string;
  ValidationFailureMode?: string;
  ValidationName?: string;
  ValidationStatus?: string;
  ValidationStatusReason?: string;
  ValidationPath?: string;
}
export const OperationEvent = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    StackId: S.optional(S.String),
    OperationId: S.optional(S.String),
    OperationType: S.optional(S.String),
    OperationStatus: S.optional(S.String),
    EventType: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ResourceStatus: S.optional(S.String),
    ResourceStatusReason: S.optional(S.String),
    ResourceProperties: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    HookType: S.optional(S.String),
    HookStatus: S.optional(S.String),
    HookStatusReason: S.optional(S.String),
    HookInvocationPoint: S.optional(S.String),
    HookFailureMode: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    ValidationFailureMode: S.optional(S.String),
    ValidationName: S.optional(S.String),
    ValidationStatus: S.optional(S.String),
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
  ParameterOverrides?: Parameters;
  Status?: string;
  StackInstanceStatus?: StackInstanceComprehensiveStatus;
  StatusReason?: string;
  OrganizationalUnitId?: string;
  DriftStatus?: string;
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
    Status: S.optional(S.String),
    StackInstanceStatus: S.optional(StackInstanceComprehensiveStatus),
    StatusReason: S.optional(S.String),
    OrganizationalUnitId: S.optional(S.String),
    DriftStatus: S.optional(S.String),
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
  LogicalResourceId: string;
  PhysicalResourceId?: string;
  ResourceType: string;
  LastUpdatedTimestamp: Date;
  ResourceStatus: string;
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
    LogicalResourceId: S.String,
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.String,
    LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    ResourceStatus: S.String,
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
  StackName: string;
  ChangeSetId?: string;
  Description?: string;
  Parameters?: Parameters;
  CreationTime: Date;
  DeletionTime?: Date;
  LastUpdatedTime?: Date;
  RollbackConfiguration?: RollbackConfiguration;
  StackStatus: string;
  StackStatusReason?: string;
  DisableRollback?: boolean;
  NotificationARNs?: NotificationARNs;
  TimeoutInMinutes?: number;
  Capabilities?: Capabilities;
  Outputs?: Outputs;
  RoleARN?: string;
  Tags?: Tags;
  EnableTerminationProtection?: boolean;
  ParentId?: string;
  RootId?: string;
  DriftInformation?: StackDriftInformation;
  RetainExceptOnCreate?: boolean;
  DeletionMode?: string;
  DetailedStatus?: string;
  LastOperations?: LastOperations;
}
export const Stack = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackName: S.String,
    ChangeSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(Parameters),
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DeletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    StackStatus: S.String,
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
    DeletionMode: S.optional(S.String),
    DetailedStatus: S.optional(S.String),
    LastOperations: S.optional(LastOperations),
  }),
).annotations({ identifier: "Stack" }) as any as S.Schema<Stack>;
export type Stacks = Stack[];
export const Stacks = S.Array(Stack);
export interface StackSet {
  StackSetName?: string;
  StackSetId?: string;
  Description?: string;
  Status?: string;
  TemplateBody?: string;
  Parameters?: Parameters;
  Capabilities?: Capabilities;
  Tags?: Tags;
  StackSetARN?: string;
  AdministrationRoleARN?: string;
  ExecutionRoleName?: string;
  StackSetDriftDetectionDetails?: StackSetDriftDetectionDetails;
  AutoDeployment?: AutoDeployment;
  PermissionModel?: string;
  OrganizationalUnitIds?: OrganizationalUnitIdList;
  ManagedExecution?: ManagedExecution;
  Regions?: RegionList;
}
export const StackSet = S.suspend(() =>
  S.Struct({
    StackSetName: S.optional(S.String),
    StackSetId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    Parameters: S.optional(Parameters),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    StackSetARN: S.optional(S.String),
    AdministrationRoleARN: S.optional(S.String),
    ExecutionRoleName: S.optional(S.String),
    StackSetDriftDetectionDetails: S.optional(StackSetDriftDetectionDetails),
    AutoDeployment: S.optional(AutoDeployment),
    PermissionModel: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    ManagedExecution: S.optional(ManagedExecution),
    Regions: S.optional(RegionList),
  }),
).annotations({ identifier: "StackSet" }) as any as S.Schema<StackSet>;
export interface StackSetOperation {
  OperationId?: string;
  StackSetId?: string;
  Action?: string;
  Status?: string;
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
    Action: S.optional(S.String),
    Status: S.optional(S.String),
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
  LogicalResourceIds?: LogicalResourceIds;
  ResourceIdentifiers?: ResourceIdentifiers;
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
  UnrecognizedResourceTypes?: ResourceTypes;
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
  Status?: string;
  StatusReason?: string;
  StackInstanceStatus?: StackInstanceComprehensiveStatus;
  OrganizationalUnitId?: string;
  DriftStatus?: string;
  LastDriftCheckTimestamp?: Date;
  LastOperationId?: string;
}
export const StackInstanceSummary = S.suspend(() =>
  S.Struct({
    StackSetId: S.optional(S.String),
    Region: S.optional(S.String),
    Account: S.optional(S.String),
    StackId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    StackInstanceStatus: S.optional(StackInstanceComprehensiveStatus),
    OrganizationalUnitId: S.optional(S.String),
    DriftStatus: S.optional(S.String),
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
  LogicalResourceId: string;
  PhysicalResourceId?: string;
  ResourceType: string;
  LastUpdatedTimestamp: Date;
  ResourceStatus: string;
  ResourceStatusReason?: string;
  DriftInformation?: StackResourceDriftInformationSummary;
  ModuleInfo?: ModuleInfo;
}
export const StackResourceSummary = S.suspend(() =>
  S.Struct({
    LogicalResourceId: S.String,
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.String,
    LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")),
    ResourceStatus: S.String,
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
  StackName: string;
  TemplateDescription?: string;
  CreationTime: Date;
  LastUpdatedTime?: Date;
  DeletionTime?: Date;
  StackStatus: string;
  StackStatusReason?: string;
  ParentId?: string;
  RootId?: string;
  DriftInformation?: StackDriftInformationSummary;
  LastOperations?: LastOperations;
}
export const StackSummary = S.suspend(() =>
  S.Struct({
    StackId: S.optional(S.String),
    StackName: S.String,
    TemplateDescription: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeletionTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StackStatus: S.String,
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
  Type?: string;
  TypeName?: string;
  DefaultVersionId?: string;
  TypeArn?: string;
  LastUpdated?: Date;
  Description?: string;
  PublisherId?: string;
  OriginalTypeName?: string;
  PublicVersionNumber?: string;
  LatestPublicVersion?: string;
  PublisherIdentity?: string;
  PublisherName?: string;
  IsActivated?: boolean;
}
export const TypeSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    DefaultVersionId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    PublisherId: S.optional(S.String),
    OriginalTypeName: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
    LatestPublicVersion: S.optional(S.String),
    PublisherIdentity: S.optional(S.String),
    PublisherName: S.optional(S.String),
    IsActivated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "TypeSummary" }) as any as S.Schema<TypeSummary>;
export type TypeSummaries = TypeSummary[];
export const TypeSummaries = S.Array(TypeSummary);
export interface ResourceDriftIgnoredAttribute {
  Path?: string;
  Reason?: string;
}
export const ResourceDriftIgnoredAttribute = S.suspend(() =>
  S.Struct({ Path: S.optional(S.String), Reason: S.optional(S.String) }),
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
  ResourceAction?: string;
}
export const ChangeSetHookResourceTargetDetails = S.suspend(() =>
  S.Struct({
    LogicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceAction: S.optional(S.String),
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
export interface BatchDescribeTypeConfigurationsOutput {
  Errors?: BatchDescribeTypeConfigurationsErrors;
  UnprocessedTypeConfigurations?: UnprocessedTypeConfigurations;
  TypeConfigurations?: TypeConfigurationDetailsList;
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
  S.Struct({ StackRefactorId: S.String }).pipe(ns),
).annotations({
  identifier: "CreateStackRefactorOutput",
}) as any as S.Schema<CreateStackRefactorOutput>;
export interface DescribeEventsOutput {
  OperationEvents?: OperationEvents;
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
  StackResourceDetail?: StackResourceDetail;
}
export const DescribeStackResourceOutput = S.suspend(() =>
  S.Struct({ StackResourceDetail: S.optional(StackResourceDetail) }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourceOutput",
}) as any as S.Schema<DescribeStackResourceOutput>;
export interface DescribeStackResourceDriftsOutput {
  StackResourceDrifts: StackResourceDrifts;
  NextToken?: string;
}
export const DescribeStackResourceDriftsOutput = S.suspend(() =>
  S.Struct({
    StackResourceDrifts: StackResourceDrifts,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeStackResourceDriftsOutput",
}) as any as S.Schema<DescribeStackResourceDriftsOutput>;
export interface DescribeStacksOutput {
  Stacks?: Stacks;
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
  StackSet?: StackSet;
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
  RelatedResources?: RelatedResources;
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
  Summaries?: StackInstanceSummaries;
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
  StackResourceSummaries?: StackResourceSummaries;
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
  StackSummaries?: StackSummaries;
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
  TypeSummaries?: TypeSummaries;
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
  TargetType?: string;
  ResourceTargetDetails?: ChangeSetHookResourceTargetDetails;
}
export const ChangeSetHookTargetDetails = S.suspend(() =>
  S.Struct({
    TargetType: S.optional(S.String),
    ResourceTargetDetails: S.optional(ChangeSetHookResourceTargetDetails),
  }),
).annotations({
  identifier: "ChangeSetHookTargetDetails",
}) as any as S.Schema<ChangeSetHookTargetDetails>;
export interface WarningDetail {
  Type?: string;
  Properties?: WarningProperties;
}
export const WarningDetail = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Properties: S.optional(WarningProperties),
  }),
).annotations({
  identifier: "WarningDetail",
}) as any as S.Schema<WarningDetail>;
export type WarningDetails = WarningDetail[];
export const WarningDetails = S.Array(WarningDetail);
export interface ParameterConstraints {
  AllowedValues?: AllowedValues;
}
export const ParameterConstraints = S.suspend(() =>
  S.Struct({ AllowedValues: S.optional(AllowedValues) }),
).annotations({
  identifier: "ParameterConstraints",
}) as any as S.Schema<ParameterConstraints>;
export interface AccountGateResult {
  Status?: string;
  StatusReason?: string;
}
export const AccountGateResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountGateResult",
}) as any as S.Schema<AccountGateResult>;
export interface ChangeSetHook {
  InvocationPoint?: string;
  FailureMode?: string;
  TypeName?: string;
  TypeVersionId?: string;
  TypeConfigurationVersionId?: string;
  TargetDetails?: ChangeSetHookTargetDetails;
}
export const ChangeSetHook = S.suspend(() =>
  S.Struct({
    InvocationPoint: S.optional(S.String),
    FailureMode: S.optional(S.String),
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
  ResourceIdentifier?: ResourceIdentifierProperties;
  ResourceStatus?: string;
  ResourceStatusReason?: string;
  Warnings?: WarningDetails;
}
export const ResourceDetail = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    ResourceIdentifier: S.optional(ResourceIdentifierProperties),
    ResourceStatus: S.optional(S.String),
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
  Status?: string;
  StatusReason?: string;
  AccountGateResult?: AccountGateResult;
  OrganizationalUnitId?: string;
}
export const StackSetOperationResultSummary = S.suspend(() =>
  S.Struct({
    Account: S.optional(S.String),
    Region: S.optional(S.String),
    Status: S.optional(S.String),
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
  Hooks?: ChangeSetHooks;
  Status?: string;
  NextToken?: string;
  StackId?: string;
  StackName?: string;
}
export const DescribeChangeSetHooksOutput = S.suspend(() =>
  S.Struct({
    ChangeSetId: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    Hooks: S.optional(ChangeSetHooks),
    Status: S.optional(S.String),
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
  Resources?: ResourceDetails;
  Status?: string;
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
    Status: S.optional(S.String),
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
  Parameters?: ParameterDeclarations;
  Description?: string;
  Capabilities?: Capabilities;
  CapabilitiesReason?: string;
  ResourceTypes?: ResourceTypes;
  Version?: string;
  Metadata?: string;
  DeclaredTransforms?: TransformsList;
  ResourceIdentifierSummaries?: ResourceIdentifierSummaries;
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
  Summaries?: StackSetOperationResultSummaries;
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
  Attribute?: string;
  Name?: string;
  RequiresRecreation?: string;
  Path?: string;
  BeforeValue?: string;
  AfterValue?: string;
  BeforeValueFrom?: string;
  AfterValueFrom?: string;
  Drift?: LiveResourceDrift;
  AttributeChangeType?: string;
}
export const ResourceTargetDefinition = S.suspend(() =>
  S.Struct({
    Attribute: S.optional(S.String),
    Name: S.optional(S.String),
    RequiresRecreation: S.optional(S.String),
    Path: S.optional(S.String),
    BeforeValue: S.optional(S.String),
    AfterValue: S.optional(S.String),
    BeforeValueFrom: S.optional(S.String),
    AfterValueFrom: S.optional(S.String),
    Drift: S.optional(LiveResourceDrift),
    AttributeChangeType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceTargetDefinition",
}) as any as S.Schema<ResourceTargetDefinition>;
export interface ResourceChangeDetail {
  Target?: ResourceTargetDefinition;
  Evaluation?: string;
  ChangeSource?: string;
  CausingEntity?: string;
}
export const ResourceChangeDetail = S.suspend(() =>
  S.Struct({
    Target: S.optional(ResourceTargetDefinition),
    Evaluation: S.optional(S.String),
    ChangeSource: S.optional(S.String),
    CausingEntity: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceChangeDetail",
}) as any as S.Schema<ResourceChangeDetail>;
export type ResourceChangeDetails = ResourceChangeDetail[];
export const ResourceChangeDetails = S.Array(ResourceChangeDetail);
export interface ResourceChange {
  PolicyAction?: string;
  Action?: string;
  LogicalResourceId?: string;
  PhysicalResourceId?: string;
  ResourceType?: string;
  Replacement?: string;
  Scope?: Scope;
  ResourceDriftStatus?: string;
  ResourceDriftIgnoredAttributes?: ResourceDriftIgnoredAttributes;
  Details?: ResourceChangeDetails;
  ChangeSetId?: string;
  ModuleInfo?: ModuleInfo;
  BeforeContext?: string;
  AfterContext?: string;
  PreviousDeploymentContext?: string;
}
export const ResourceChange = S.suspend(() =>
  S.Struct({
    PolicyAction: S.optional(S.String),
    Action: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Replacement: S.optional(S.String),
    Scope: S.optional(Scope),
    ResourceDriftStatus: S.optional(S.String),
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
  Type?: string;
  HookInvocationCount?: number;
  ResourceChange?: ResourceChange;
}
export const Change = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
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
  Parameters?: Parameters;
  CreationTime?: Date;
  ExecutionStatus?: string;
  Status?: string;
  StatusReason?: string;
  StackDriftStatus?: string;
  NotificationARNs?: NotificationARNs;
  RollbackConfiguration?: RollbackConfiguration;
  Capabilities?: Capabilities;
  Tags?: Tags;
  Changes?: Changes;
  NextToken?: string;
  IncludeNestedStacks?: boolean;
  ParentChangeSetId?: string;
  RootChangeSetId?: string;
  OnStackFailure?: string;
  ImportExistingResources?: boolean;
  DeploymentMode?: string;
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
    ExecutionStatus: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    StackDriftStatus: S.optional(S.String),
    NotificationARNs: S.optional(NotificationARNs),
    RollbackConfiguration: S.optional(RollbackConfiguration),
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(Tags),
    Changes: S.optional(Changes),
    NextToken: S.optional(S.String),
    IncludeNestedStacks: S.optional(S.Boolean),
    ParentChangeSetId: S.optional(S.String),
    RootChangeSetId: S.optional(S.String),
    OnStackFailure: S.optional(S.String),
    ImportExistingResources: S.optional(S.Boolean),
    DeploymentMode: S.optional(S.String),
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListImportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportsInput,
  ) => Stream.Stream<
    ListImportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListImportsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListTypeRegistrationsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypeRegistrationsInput,
  ) => Stream.Stream<
    ListTypeRegistrationsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypeRegistrationsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccountLimitsInput,
  ) => Stream.Stream<
    DescribeAccountLimitsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccountLimitsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    DescribeStackEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStackEventsInput,
  ) => Stream.Stream<
    DescribeStackEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStackEventsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListChangeSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListChangeSetsInput,
  ) => Stream.Stream<
    ListChangeSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListChangeSetsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListExportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportsInput,
  ) => Stream.Stream<
    ListExportsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListExportsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListGeneratedTemplatesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListGeneratedTemplatesInput,
  ) => Stream.Stream<
    ListGeneratedTemplatesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListGeneratedTemplatesInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListResourceScansOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScansInput,
  ) => Stream.Stream<
    ListResourceScansOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScansInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListStackRefactorActionsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackRefactorActionsInput,
  ) => Stream.Stream<
    ListStackRefactorActionsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackRefactorActionsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListStackRefactorsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackRefactorsInput,
  ) => Stream.Stream<
    ListStackRefactorsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackRefactorsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListStackSetOperationsOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetOperationsInput,
  ) => Stream.Stream<
    ListStackSetOperationsOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetOperationsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListStackSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetsInput,
  ) => Stream.Stream<
    ListStackSetsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListTypeVersionsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypeVersionsInput,
  ) => Stream.Stream<
    ListTypeVersionsOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypeVersionsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    DescribeEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsInput,
  ) => Stream.Stream<
    DescribeEventsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    DescribeStackResourceDriftsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStackResourceDriftsInput,
  ) => Stream.Stream<
    DescribeStackResourceDriftsOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStackResourceDriftsInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    DescribeStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStacksInput,
  ) => Stream.Stream<
    DescribeStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStacksInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListResourceScanResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScanResourcesInput,
  ) => Stream.Stream<
    ListResourceScanResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScanResourcesInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListStackInstancesOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackInstancesInput,
  ) => Stream.Stream<
    ListStackInstancesOutput,
    StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackInstancesInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListStackResourcesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackResourcesInput,
  ) => Stream.Stream<
    ListStackResourcesOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackResourcesInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStacksInput,
  ) => Stream.Stream<
    ListStacksOutput,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStacksInput,
  ) => Stream.Stream<
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
  ): Effect.Effect<
    ListTypesOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTypesInput,
  ) => Stream.Stream<
    ListTypesOutput,
    CFNRegistryException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTypesInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListResourceScanRelatedResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceScanRelatedResourcesInput,
  ) => Stream.Stream<
    ListResourceScanRelatedResourcesOutput,
    | ResourceScanInProgressException
    | ResourceScanNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceScanRelatedResourcesInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListStackSetOperationResultsOutput,
    OperationNotFoundException | StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListStackSetOperationResultsInput,
  ) => Stream.Stream<
    ListStackSetOperationResultsOutput,
    OperationNotFoundException | StackSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListStackSetOperationResultsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    DescribeChangeSetOutput,
    ChangeSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeChangeSetInput,
  ) => Stream.Stream<
    DescribeChangeSetOutput,
    ChangeSetNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeChangeSetInput,
  ) => Stream.Stream<
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
