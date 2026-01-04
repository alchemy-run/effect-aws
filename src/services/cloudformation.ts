import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class ActivateOrganizationsAccessInput extends S.Class<ActivateOrganizationsAccessInput>(
  "ActivateOrganizationsAccessInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivateOrganizationsAccessOutput extends S.Class<ActivateOrganizationsAccessOutput>(
  "ActivateOrganizationsAccessOutput",
)({}, ns) {}
export class DeactivateOrganizationsAccessInput extends S.Class<DeactivateOrganizationsAccessInput>(
  "DeactivateOrganizationsAccessInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateOrganizationsAccessOutput extends S.Class<DeactivateOrganizationsAccessOutput>(
  "DeactivateOrganizationsAccessOutput",
)({}, ns) {}
export const ResourcesToSkip = S.Array(S.String);
export const Capabilities = S.Array(S.String);
export const ResourceTypes = S.Array(S.String);
export const NotificationARNs = S.Array(S.String);
export const AccountList = S.Array(S.String);
export const RegionList = S.Array(S.String);
export const RetainResources = S.Array(S.String);
export const StackResourceDriftStatusFilters = S.Array(S.String);
export const LogicalResourceIds = S.Array(S.String);
export const StackIdList = S.Array(S.String);
export const OrganizationalUnitIdList = S.Array(S.String);
export const StackRefactorExecutionStatusFilter = S.Array(S.String);
export const StackStatusFilter = S.Array(S.String);
export const JazzLogicalResourceIds = S.Array(S.String);
export class CancelUpdateStackInput extends S.Class<CancelUpdateStackInput>(
  "CancelUpdateStackInput",
)(
  { StackName: S.String, ClientRequestToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelUpdateStackResponse extends S.Class<CancelUpdateStackResponse>(
  "CancelUpdateStackResponse",
)({}, ns) {}
export class ContinueUpdateRollbackInput extends S.Class<ContinueUpdateRollbackInput>(
  "ContinueUpdateRollbackInput",
)(
  {
    StackName: S.String,
    RoleARN: S.optional(S.String),
    ResourcesToSkip: S.optional(ResourcesToSkip),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ContinueUpdateRollbackOutput extends S.Class<ContinueUpdateRollbackOutput>(
  "ContinueUpdateRollbackOutput",
)({}, ns) {}
export class Parameter extends S.Class<Parameter>("Parameter")({
  ParameterKey: S.optional(S.String),
  ParameterValue: S.optional(S.String),
  UsePreviousValue: S.optional(S.Boolean),
  ResolvedValue: S.optional(S.String),
}) {}
export const Parameters = S.Array(Parameter);
export class RollbackTrigger extends S.Class<RollbackTrigger>(
  "RollbackTrigger",
)({ Arn: S.String, Type: S.String }) {}
export const RollbackTriggers = S.Array(RollbackTrigger);
export class RollbackConfiguration extends S.Class<RollbackConfiguration>(
  "RollbackConfiguration",
)({
  RollbackTriggers: S.optional(RollbackTriggers),
  MonitoringTimeInMinutes: S.optional(S.Number),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateStackInput extends S.Class<CreateStackInput>(
  "CreateStackInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateTypeInput extends S.Class<DeactivateTypeInput>(
  "DeactivateTypeInput",
)(
  {
    TypeName: S.optional(S.String),
    Type: S.optional(S.String),
    Arn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateTypeOutput extends S.Class<DeactivateTypeOutput>(
  "DeactivateTypeOutput",
)({}, ns) {}
export class DeleteChangeSetInput extends S.Class<DeleteChangeSetInput>(
  "DeleteChangeSetInput",
)(
  { ChangeSetName: S.String, StackName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteChangeSetOutput extends S.Class<DeleteChangeSetOutput>(
  "DeleteChangeSetOutput",
)({}, ns) {}
export class DeleteGeneratedTemplateInput extends S.Class<DeleteGeneratedTemplateInput>(
  "DeleteGeneratedTemplateInput",
)(
  { GeneratedTemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGeneratedTemplateResponse extends S.Class<DeleteGeneratedTemplateResponse>(
  "DeleteGeneratedTemplateResponse",
)({}, ns) {}
export class DeleteStackInput extends S.Class<DeleteStackInput>(
  "DeleteStackInput",
)(
  {
    StackName: S.String,
    RetainResources: S.optional(RetainResources),
    RoleARN: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    DeletionMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStackResponse extends S.Class<DeleteStackResponse>(
  "DeleteStackResponse",
)({}, ns) {}
export class DeploymentTargets extends S.Class<DeploymentTargets>(
  "DeploymentTargets",
)({
  Accounts: S.optional(AccountList),
  AccountsUrl: S.optional(S.String),
  OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
  AccountFilterType: S.optional(S.String),
}) {}
export class StackSetOperationPreferences extends S.Class<StackSetOperationPreferences>(
  "StackSetOperationPreferences",
)({
  RegionConcurrencyType: S.optional(S.String),
  RegionOrder: S.optional(RegionList),
  FailureToleranceCount: S.optional(S.Number),
  FailureTolerancePercentage: S.optional(S.Number),
  MaxConcurrentCount: S.optional(S.Number),
  MaxConcurrentPercentage: S.optional(S.Number),
  ConcurrencyMode: S.optional(S.String),
}) {}
export class DeleteStackInstancesInput extends S.Class<DeleteStackInstancesInput>(
  "DeleteStackInstancesInput",
)(
  {
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    OperationPreferences: S.optional(StackSetOperationPreferences),
    RetainStacks: S.Boolean,
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStackSetInput extends S.Class<DeleteStackSetInput>(
  "DeleteStackSetInput",
)(
  { StackSetName: S.String, CallAs: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStackSetOutput extends S.Class<DeleteStackSetOutput>(
  "DeleteStackSetOutput",
)({}, ns) {}
export class DeregisterTypeInput extends S.Class<DeregisterTypeInput>(
  "DeregisterTypeInput",
)(
  {
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterTypeOutput extends S.Class<DeregisterTypeOutput>(
  "DeregisterTypeOutput",
)({}, ns) {}
export class DescribeAccountLimitsInput extends S.Class<DescribeAccountLimitsInput>(
  "DescribeAccountLimitsInput",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeChangeSetInput extends S.Class<DescribeChangeSetInput>(
  "DescribeChangeSetInput",
)(
  {
    ChangeSetName: S.String,
    StackName: S.optional(S.String),
    NextToken: S.optional(S.String),
    IncludePropertyValues: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeChangeSetHooksInput extends S.Class<DescribeChangeSetHooksInput>(
  "DescribeChangeSetHooksInput",
)(
  {
    ChangeSetName: S.String,
    StackName: S.optional(S.String),
    NextToken: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGeneratedTemplateInput extends S.Class<DescribeGeneratedTemplateInput>(
  "DescribeGeneratedTemplateInput",
)(
  { GeneratedTemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationsAccessInput extends S.Class<DescribeOrganizationsAccessInput>(
  "DescribeOrganizationsAccessInput",
)(
  { CallAs: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePublisherInput extends S.Class<DescribePublisherInput>(
  "DescribePublisherInput",
)(
  { PublisherId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResourceScanInput extends S.Class<DescribeResourceScanInput>(
  "DescribeResourceScanInput",
)(
  { ResourceScanId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackDriftDetectionStatusInput extends S.Class<DescribeStackDriftDetectionStatusInput>(
  "DescribeStackDriftDetectionStatusInput",
)(
  { StackDriftDetectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackEventsInput extends S.Class<DescribeStackEventsInput>(
  "DescribeStackEventsInput",
)(
  { StackName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackInstanceInput extends S.Class<DescribeStackInstanceInput>(
  "DescribeStackInstanceInput",
)(
  {
    StackSetName: S.String,
    StackInstanceAccount: S.String,
    StackInstanceRegion: S.String,
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackRefactorInput extends S.Class<DescribeStackRefactorInput>(
  "DescribeStackRefactorInput",
)(
  { StackRefactorId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackResourceInput extends S.Class<DescribeStackResourceInput>(
  "DescribeStackResourceInput",
)(
  { StackName: S.String, LogicalResourceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackResourceDriftsInput extends S.Class<DescribeStackResourceDriftsInput>(
  "DescribeStackResourceDriftsInput",
)(
  {
    StackName: S.String,
    StackResourceDriftStatusFilters: S.optional(
      StackResourceDriftStatusFilters,
    ),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackResourcesInput extends S.Class<DescribeStackResourcesInput>(
  "DescribeStackResourcesInput",
)(
  {
    StackName: S.optional(S.String),
    LogicalResourceId: S.optional(S.String),
    PhysicalResourceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStacksInput extends S.Class<DescribeStacksInput>(
  "DescribeStacksInput",
)(
  { StackName: S.optional(S.String), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackSetInput extends S.Class<DescribeStackSetInput>(
  "DescribeStackSetInput",
)(
  { StackSetName: S.String, CallAs: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStackSetOperationInput extends S.Class<DescribeStackSetOperationInput>(
  "DescribeStackSetOperationInput",
)(
  {
    StackSetName: S.String,
    OperationId: S.String,
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTypeInput extends S.Class<DescribeTypeInput>(
  "DescribeTypeInput",
)(
  {
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    Arn: S.optional(S.String),
    VersionId: S.optional(S.String),
    PublisherId: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTypeRegistrationInput extends S.Class<DescribeTypeRegistrationInput>(
  "DescribeTypeRegistrationInput",
)(
  { RegistrationToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectStackDriftInput extends S.Class<DetectStackDriftInput>(
  "DetectStackDriftInput",
)(
  { StackName: S.String, LogicalResourceIds: S.optional(LogicalResourceIds) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectStackResourceDriftInput extends S.Class<DetectStackResourceDriftInput>(
  "DetectStackResourceDriftInput",
)(
  { StackName: S.String, LogicalResourceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetectStackSetDriftInput extends S.Class<DetectStackSetDriftInput>(
  "DetectStackSetDriftInput",
)(
  {
    StackSetName: S.String,
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EstimateTemplateCostInput extends S.Class<EstimateTemplateCostInput>(
  "EstimateTemplateCostInput",
)(
  {
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    Parameters: S.optional(Parameters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteChangeSetInput extends S.Class<ExecuteChangeSetInput>(
  "ExecuteChangeSetInput",
)(
  {
    ChangeSetName: S.String,
    StackName: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    DisableRollback: S.optional(S.Boolean),
    RetainExceptOnCreate: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteChangeSetOutput extends S.Class<ExecuteChangeSetOutput>(
  "ExecuteChangeSetOutput",
)({}, ns) {}
export class ExecuteStackRefactorInput extends S.Class<ExecuteStackRefactorInput>(
  "ExecuteStackRefactorInput",
)(
  { StackRefactorId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteStackRefactorResponse extends S.Class<ExecuteStackRefactorResponse>(
  "ExecuteStackRefactorResponse",
)({}, ns) {}
export class GetGeneratedTemplateInput extends S.Class<GetGeneratedTemplateInput>(
  "GetGeneratedTemplateInput",
)(
  { Format: S.optional(S.String), GeneratedTemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHookResultInput extends S.Class<GetHookResultInput>(
  "GetHookResultInput",
)(
  { HookResultId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStackPolicyInput extends S.Class<GetStackPolicyInput>(
  "GetStackPolicyInput",
)(
  { StackName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTemplateInput extends S.Class<GetTemplateInput>(
  "GetTemplateInput",
)(
  {
    StackName: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    TemplateStage: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportStacksToStackSetInput extends S.Class<ImportStacksToStackSetInput>(
  "ImportStacksToStackSetInput",
)(
  {
    StackSetName: S.String,
    StackIds: S.optional(StackIdList),
    StackIdsUrl: S.optional(S.String),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListChangeSetsInput extends S.Class<ListChangeSetsInput>(
  "ListChangeSetsInput",
)(
  { StackName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExportsInput extends S.Class<ListExportsInput>(
  "ListExportsInput",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGeneratedTemplatesInput extends S.Class<ListGeneratedTemplatesInput>(
  "ListGeneratedTemplatesInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHookResultsInput extends S.Class<ListHookResultsInput>(
  "ListHookResultsInput",
)(
  {
    TargetType: S.optional(S.String),
    TargetId: S.optional(S.String),
    TypeArn: S.optional(S.String),
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImportsInput extends S.Class<ListImportsInput>(
  "ListImportsInput",
)(
  { ExportName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceScanResourcesInput extends S.Class<ListResourceScanResourcesInput>(
  "ListResourceScanResourcesInput",
)(
  {
    ResourceScanId: S.String,
    ResourceIdentifier: S.optional(S.String),
    ResourceTypePrefix: S.optional(S.String),
    TagKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceScansInput extends S.Class<ListResourceScansInput>(
  "ListResourceScansInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ScanTypeFilter: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackInstanceResourceDriftsInput extends S.Class<ListStackInstanceResourceDriftsInput>(
  "ListStackInstanceResourceDriftsInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackRefactorActionsInput extends S.Class<ListStackRefactorActionsInput>(
  "ListStackRefactorActionsInput",
)(
  {
    StackRefactorId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackRefactorsInput extends S.Class<ListStackRefactorsInput>(
  "ListStackRefactorsInput",
)(
  {
    ExecutionStatusFilter: S.optional(StackRefactorExecutionStatusFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackResourcesInput extends S.Class<ListStackResourcesInput>(
  "ListStackResourcesInput",
)(
  { StackName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStacksInput extends S.Class<ListStacksInput>(
  "ListStacksInput",
)(
  {
    NextToken: S.optional(S.String),
    StackStatusFilter: S.optional(StackStatusFilter),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackSetAutoDeploymentTargetsInput extends S.Class<ListStackSetAutoDeploymentTargetsInput>(
  "ListStackSetAutoDeploymentTargetsInput",
)(
  {
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackSetOperationsInput extends S.Class<ListStackSetOperationsInput>(
  "ListStackSetOperationsInput",
)(
  {
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackSetsInput extends S.Class<ListStackSetsInput>(
  "ListStackSetsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTypeRegistrationsInput extends S.Class<ListTypeRegistrationsInput>(
  "ListTypeRegistrationsInput",
)(
  {
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    TypeArn: S.optional(S.String),
    RegistrationStatusFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTypeVersionsInput extends S.Class<ListTypeVersionsInput>(
  "ListTypeVersionsInput",
)(
  {
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    Arn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    DeprecatedStatus: S.optional(S.String),
    PublisherId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PublishTypeInput extends S.Class<PublishTypeInput>(
  "PublishTypeInput",
)(
  {
    Type: S.optional(S.String),
    Arn: S.optional(S.String),
    TypeName: S.optional(S.String),
    PublicVersionNumber: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecordHandlerProgressInput extends S.Class<RecordHandlerProgressInput>(
  "RecordHandlerProgressInput",
)(
  {
    BearerToken: S.String,
    OperationStatus: S.String,
    CurrentOperationStatus: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ResourceModel: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecordHandlerProgressOutput extends S.Class<RecordHandlerProgressOutput>(
  "RecordHandlerProgressOutput",
)({}, ns) {}
export class RegisterPublisherInput extends S.Class<RegisterPublisherInput>(
  "RegisterPublisherInput",
)(
  {
    AcceptTermsAndConditions: S.optional(S.Boolean),
    ConnectionArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LoggingConfig extends S.Class<LoggingConfig>("LoggingConfig")({
  LogRoleArn: S.String,
  LogGroupName: S.String,
}) {}
export class RegisterTypeInput extends S.Class<RegisterTypeInput>(
  "RegisterTypeInput",
)(
  {
    Type: S.optional(S.String),
    TypeName: S.String,
    SchemaHandlerPackage: S.String,
    LoggingConfig: S.optional(LoggingConfig),
    ExecutionRoleArn: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RollbackStackInput extends S.Class<RollbackStackInput>(
  "RollbackStackInput",
)(
  {
    StackName: S.String,
    RoleARN: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    RetainExceptOnCreate: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetStackPolicyInput extends S.Class<SetStackPolicyInput>(
  "SetStackPolicyInput",
)(
  {
    StackName: S.String,
    StackPolicyBody: S.optional(S.String),
    StackPolicyURL: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetStackPolicyResponse extends S.Class<SetStackPolicyResponse>(
  "SetStackPolicyResponse",
)({}, ns) {}
export class SetTypeConfigurationInput extends S.Class<SetTypeConfigurationInput>(
  "SetTypeConfigurationInput",
)(
  {
    TypeArn: S.optional(S.String),
    Configuration: S.String,
    ConfigurationAlias: S.optional(S.String),
    TypeName: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetTypeDefaultVersionInput extends S.Class<SetTypeDefaultVersionInput>(
  "SetTypeDefaultVersionInput",
)(
  {
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetTypeDefaultVersionOutput extends S.Class<SetTypeDefaultVersionOutput>(
  "SetTypeDefaultVersionOutput",
)({}, ns) {}
export class SignalResourceInput extends S.Class<SignalResourceInput>(
  "SignalResourceInput",
)(
  {
    StackName: S.String,
    LogicalResourceId: S.String,
    UniqueId: S.String,
    Status: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SignalResourceResponse extends S.Class<SignalResourceResponse>(
  "SignalResourceResponse",
)({}, ns) {}
export class StopStackSetOperationInput extends S.Class<StopStackSetOperationInput>(
  "StopStackSetOperationInput",
)(
  {
    StackSetName: S.String,
    OperationId: S.String,
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopStackSetOperationOutput extends S.Class<StopStackSetOperationOutput>(
  "StopStackSetOperationOutput",
)({}, ns) {}
export class TestTypeInput extends S.Class<TestTypeInput>("TestTypeInput")(
  {
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    TypeName: S.optional(S.String),
    VersionId: S.optional(S.String),
    LogDeliveryBucket: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.String,
});
export class ResourceDefinition extends S.Class<ResourceDefinition>(
  "ResourceDefinition",
)({
  ResourceType: S.String,
  LogicalResourceId: S.optional(S.String),
  ResourceIdentifier: ResourceIdentifierProperties,
}) {}
export const ResourceDefinitions = S.Array(ResourceDefinition);
export class TemplateConfiguration extends S.Class<TemplateConfiguration>(
  "TemplateConfiguration",
)({
  DeletionPolicy: S.optional(S.String),
  UpdateReplacePolicy: S.optional(S.String),
}) {}
export class UpdateGeneratedTemplateInput extends S.Class<UpdateGeneratedTemplateInput>(
  "UpdateGeneratedTemplateInput",
)(
  {
    GeneratedTemplateName: S.String,
    NewGeneratedTemplateName: S.optional(S.String),
    AddResources: S.optional(ResourceDefinitions),
    RemoveResources: S.optional(JazzLogicalResourceIds),
    RefreshAllResources: S.optional(S.Boolean),
    TemplateConfiguration: S.optional(TemplateConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStackInput extends S.Class<UpdateStackInput>(
  "UpdateStackInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStackInstancesInput extends S.Class<UpdateStackInstancesInput>(
  "UpdateStackInstancesInput",
)(
  {
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StackSetARNList = S.Array(S.String);
export class AutoDeployment extends S.Class<AutoDeployment>("AutoDeployment")({
  Enabled: S.optional(S.Boolean),
  RetainStacksOnAccountRemoval: S.optional(S.Boolean),
  DependsOn: S.optional(StackSetARNList),
}) {}
export class ManagedExecution extends S.Class<ManagedExecution>(
  "ManagedExecution",
)({ Active: S.optional(S.Boolean) }) {}
export class UpdateStackSetInput extends S.Class<UpdateStackSetInput>(
  "UpdateStackSetInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTerminationProtectionInput extends S.Class<UpdateTerminationProtectionInput>(
  "UpdateTerminationProtectionInput",
)(
  { EnableTerminationProtection: S.Boolean, StackName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidateTemplateInput extends S.Class<ValidateTemplateInput>(
  "ValidateTemplateInput",
)(
  { TemplateBody: S.optional(S.String), TemplateURL: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ResourceTypeFilters = S.Array(S.String);
export class TypeConfigurationIdentifier extends S.Class<TypeConfigurationIdentifier>(
  "TypeConfigurationIdentifier",
)({
  TypeArn: S.optional(S.String),
  TypeConfigurationAlias: S.optional(S.String),
  TypeConfigurationArn: S.optional(S.String),
  Type: S.optional(S.String),
  TypeName: S.optional(S.String),
}) {}
export const TypeConfigurationIdentifiers = S.Array(
  TypeConfigurationIdentifier,
);
export class StackDefinition extends S.Class<StackDefinition>(
  "StackDefinition",
)({
  StackName: S.optional(S.String),
  TemplateBody: S.optional(S.String),
  TemplateURL: S.optional(S.String),
}) {}
export const StackDefinitions = S.Array(StackDefinition);
export class EventFilter extends S.Class<EventFilter>("EventFilter")({
  FailedEvents: S.optional(S.Boolean),
}) {}
export const StackIds = S.Array(S.String);
export const StageList = S.Array(S.String);
export class TemplateSummaryConfig extends S.Class<TemplateSummaryConfig>(
  "TemplateSummaryConfig",
)({ TreatUnrecognizedResourceTypesAsWarnings: S.optional(S.Boolean) }) {}
export const Imports = S.Array(S.String);
export class StackInstanceFilter extends S.Class<StackInstanceFilter>(
  "StackInstanceFilter",
)({ Name: S.optional(S.String), Values: S.optional(S.String) }) {}
export const StackInstanceFilters = S.Array(StackInstanceFilter);
export class OperationResultFilter extends S.Class<OperationResultFilter>(
  "OperationResultFilter",
)({ Name: S.optional(S.String), Values: S.optional(S.String) }) {}
export const OperationResultFilters = S.Array(OperationResultFilter);
export const RegistrationTokenList = S.Array(S.String);
export class TypeFilters extends S.Class<TypeFilters>("TypeFilters")({
  Category: S.optional(S.String),
  PublisherId: S.optional(S.String),
  TypeNamePrefix: S.optional(S.String),
}) {}
export class ScanFilter extends S.Class<ScanFilter>("ScanFilter")({
  Types: S.optional(ResourceTypeFilters),
}) {}
export const ScanFilters = S.Array(ScanFilter);
export const TransformsList = S.Array(S.String);
export class ActivateTypeInput extends S.Class<ActivateTypeInput>(
  "ActivateTypeInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDescribeTypeConfigurationsInput extends S.Class<BatchDescribeTypeConfigurationsInput>(
  "BatchDescribeTypeConfigurationsInput",
)(
  { TypeConfigurationIdentifiers: TypeConfigurationIdentifiers },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGeneratedTemplateInput extends S.Class<CreateGeneratedTemplateInput>(
  "CreateGeneratedTemplateInput",
)(
  {
    Resources: S.optional(ResourceDefinitions),
    GeneratedTemplateName: S.String,
    StackName: S.optional(S.String),
    TemplateConfiguration: S.optional(TemplateConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStackOutput extends S.Class<CreateStackOutput>(
  "CreateStackOutput",
)({ StackId: S.optional(S.String), OperationId: S.optional(S.String) }, ns) {}
export class CreateStackInstancesInput extends S.Class<CreateStackInstancesInput>(
  "CreateStackInstancesInput",
)(
  {
    StackSetName: S.String,
    Accounts: S.optional(AccountList),
    DeploymentTargets: S.optional(DeploymentTargets),
    Regions: RegionList,
    ParameterOverrides: S.optional(Parameters),
    OperationPreferences: S.optional(StackSetOperationPreferences),
    OperationId: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStackSetInput extends S.Class<CreateStackSetInput>(
  "CreateStackSetInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStackInstancesOutput extends S.Class<DeleteStackInstancesOutput>(
  "DeleteStackInstancesOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class DescribeEventsInput extends S.Class<DescribeEventsInput>(
  "DescribeEventsInput",
)(
  {
    StackName: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    OperationId: S.optional(S.String),
    Filters: S.optional(EventFilter),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationsAccessOutput extends S.Class<DescribeOrganizationsAccessOutput>(
  "DescribeOrganizationsAccessOutput",
)({ Status: S.optional(S.String) }, ns) {}
export class DescribePublisherOutput extends S.Class<DescribePublisherOutput>(
  "DescribePublisherOutput",
)(
  {
    PublisherId: S.optional(S.String),
    PublisherStatus: S.optional(S.String),
    IdentityProvider: S.optional(S.String),
    PublisherProfile: S.optional(S.String),
  },
  ns,
) {}
export class DescribeResourceScanOutput extends S.Class<DescribeResourceScanOutput>(
  "DescribeResourceScanOutput",
)(
  {
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
  },
  ns,
) {}
export class DescribeStackDriftDetectionStatusOutput extends S.Class<DescribeStackDriftDetectionStatusOutput>(
  "DescribeStackDriftDetectionStatusOutput",
)(
  {
    StackId: S.String,
    StackDriftDetectionId: S.String,
    StackDriftStatus: S.optional(S.String),
    DetectionStatus: S.String,
    DetectionStatusReason: S.optional(S.String),
    DriftedStackResourceCount: S.optional(S.Number),
    Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  },
  ns,
) {}
export class DescribeStackRefactorOutput extends S.Class<DescribeStackRefactorOutput>(
  "DescribeStackRefactorOutput",
)(
  {
    Description: S.optional(S.String),
    StackRefactorId: S.optional(S.String),
    StackIds: S.optional(StackIds),
    ExecutionStatus: S.optional(S.String),
    ExecutionStatusReason: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTypeRegistrationOutput extends S.Class<DescribeTypeRegistrationOutput>(
  "DescribeTypeRegistrationOutput",
)(
  {
    ProgressStatus: S.optional(S.String),
    Description: S.optional(S.String),
    TypeArn: S.optional(S.String),
    TypeVersionArn: S.optional(S.String),
  },
  ns,
) {}
export class DetectStackDriftOutput extends S.Class<DetectStackDriftOutput>(
  "DetectStackDriftOutput",
)({ StackDriftDetectionId: S.String }, ns) {}
export class PhysicalResourceIdContextKeyValuePair extends S.Class<PhysicalResourceIdContextKeyValuePair>(
  "PhysicalResourceIdContextKeyValuePair",
)({ Key: S.String, Value: S.String }) {}
export const PhysicalResourceIdContext = S.Array(
  PhysicalResourceIdContextKeyValuePair,
);
export class PropertyDifference extends S.Class<PropertyDifference>(
  "PropertyDifference",
)({
  PropertyPath: S.String,
  ExpectedValue: S.String,
  ActualValue: S.String,
  DifferenceType: S.String,
}) {}
export const PropertyDifferences = S.Array(PropertyDifference);
export class ModuleInfo extends S.Class<ModuleInfo>("ModuleInfo")({
  TypeHierarchy: S.optional(S.String),
  LogicalIdHierarchy: S.optional(S.String),
}) {}
export class StackResourceDrift extends S.Class<StackResourceDrift>(
  "StackResourceDrift",
)({
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
}) {}
export class DetectStackResourceDriftOutput extends S.Class<DetectStackResourceDriftOutput>(
  "DetectStackResourceDriftOutput",
)({ StackResourceDrift: StackResourceDrift }, ns) {}
export class DetectStackSetDriftOutput extends S.Class<DetectStackSetDriftOutput>(
  "DetectStackSetDriftOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class EstimateTemplateCostOutput extends S.Class<EstimateTemplateCostOutput>(
  "EstimateTemplateCostOutput",
)({ Url: S.optional(S.String) }, ns) {}
export class GetGeneratedTemplateOutput extends S.Class<GetGeneratedTemplateOutput>(
  "GetGeneratedTemplateOutput",
)({ Status: S.optional(S.String), TemplateBody: S.optional(S.String) }, ns) {}
export class GetStackPolicyOutput extends S.Class<GetStackPolicyOutput>(
  "GetStackPolicyOutput",
)({ StackPolicyBody: S.optional(S.String) }, ns) {}
export class GetTemplateOutput extends S.Class<GetTemplateOutput>(
  "GetTemplateOutput",
)(
  {
    TemplateBody: S.optional(S.String),
    StagesAvailable: S.optional(StageList),
  },
  ns,
) {}
export class GetTemplateSummaryInput extends S.Class<GetTemplateSummaryInput>(
  "GetTemplateSummaryInput",
)(
  {
    TemplateBody: S.optional(S.String),
    TemplateURL: S.optional(S.String),
    StackName: S.optional(S.String),
    StackSetName: S.optional(S.String),
    CallAs: S.optional(S.String),
    TemplateSummaryConfig: S.optional(TemplateSummaryConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportStacksToStackSetOutput extends S.Class<ImportStacksToStackSetOutput>(
  "ImportStacksToStackSetOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class ListImportsOutput extends S.Class<ListImportsOutput>(
  "ListImportsOutput",
)({ Imports: S.optional(Imports), NextToken: S.optional(S.String) }, ns) {}
export class ListStackInstancesInput extends S.Class<ListStackInstancesInput>(
  "ListStackInstancesInput",
)(
  {
    StackSetName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(StackInstanceFilters),
    StackInstanceAccount: S.optional(S.String),
    StackInstanceRegion: S.optional(S.String),
    CallAs: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStackSetOperationResultsInput extends S.Class<ListStackSetOperationResultsInput>(
  "ListStackSetOperationResultsInput",
)(
  {
    StackSetName: S.String,
    OperationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CallAs: S.optional(S.String),
    Filters: S.optional(OperationResultFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTypeRegistrationsOutput extends S.Class<ListTypeRegistrationsOutput>(
  "ListTypeRegistrationsOutput",
)(
  {
    RegistrationTokenList: S.optional(RegistrationTokenList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTypesInput extends S.Class<ListTypesInput>("ListTypesInput")(
  {
    Visibility: S.optional(S.String),
    ProvisioningType: S.optional(S.String),
    DeprecatedStatus: S.optional(S.String),
    Type: S.optional(S.String),
    Filters: S.optional(TypeFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PublishTypeOutput extends S.Class<PublishTypeOutput>(
  "PublishTypeOutput",
)({ PublicTypeArn: S.optional(S.String) }, ns) {}
export class RegisterPublisherOutput extends S.Class<RegisterPublisherOutput>(
  "RegisterPublisherOutput",
)({ PublisherId: S.optional(S.String) }, ns) {}
export class RegisterTypeOutput extends S.Class<RegisterTypeOutput>(
  "RegisterTypeOutput",
)({ RegistrationToken: S.optional(S.String) }, ns) {}
export class RollbackStackOutput extends S.Class<RollbackStackOutput>(
  "RollbackStackOutput",
)({ StackId: S.optional(S.String), OperationId: S.optional(S.String) }, ns) {}
export class SetTypeConfigurationOutput extends S.Class<SetTypeConfigurationOutput>(
  "SetTypeConfigurationOutput",
)({ ConfigurationArn: S.optional(S.String) }, ns) {}
export class StartResourceScanInput extends S.Class<StartResourceScanInput>(
  "StartResourceScanInput",
)(
  {
    ClientRequestToken: S.optional(S.String),
    ScanFilters: S.optional(ScanFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestTypeOutput extends S.Class<TestTypeOutput>("TestTypeOutput")(
  { TypeVersionArn: S.optional(S.String) },
  ns,
) {}
export class UpdateGeneratedTemplateOutput extends S.Class<UpdateGeneratedTemplateOutput>(
  "UpdateGeneratedTemplateOutput",
)({ GeneratedTemplateId: S.optional(S.String) }, ns) {}
export class UpdateStackOutput extends S.Class<UpdateStackOutput>(
  "UpdateStackOutput",
)({ StackId: S.optional(S.String), OperationId: S.optional(S.String) }, ns) {}
export class UpdateStackInstancesOutput extends S.Class<UpdateStackInstancesOutput>(
  "UpdateStackInstancesOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateStackSetOutput extends S.Class<UpdateStackSetOutput>(
  "UpdateStackSetOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class UpdateTerminationProtectionOutput extends S.Class<UpdateTerminationProtectionOutput>(
  "UpdateTerminationProtectionOutput",
)({ StackId: S.optional(S.String) }, ns) {}
export class ResourceLocation extends S.Class<ResourceLocation>(
  "ResourceLocation",
)({ StackName: S.String, LogicalResourceId: S.String }) {}
export const SupportedMajorVersions = S.Array(S.Number);
export const JazzResourceIdentifierProperties = S.Record({
  key: S.String,
  value: S.String,
});
export const StackRefactorTagResources = S.Array(Tag);
export const StackRefactorUntagResources = S.Array(S.String);
export const UnprocessedTypeConfigurations = S.Array(
  TypeConfigurationIdentifier,
);
export class ResourceToImport extends S.Class<ResourceToImport>(
  "ResourceToImport",
)({
  ResourceType: S.String,
  LogicalResourceId: S.String,
  ResourceIdentifier: ResourceIdentifierProperties,
}) {}
export const ResourcesToImport = S.Array(ResourceToImport);
export class ResourceMapping extends S.Class<ResourceMapping>(
  "ResourceMapping",
)({ Source: ResourceLocation, Destination: ResourceLocation }) {}
export const ResourceMappings = S.Array(ResourceMapping);
export class AccountLimit extends S.Class<AccountLimit>("AccountLimit")({
  Name: S.optional(S.String),
  Value: S.optional(S.Number),
}) {}
export const AccountLimitList = S.Array(AccountLimit);
export class TemplateProgress extends S.Class<TemplateProgress>(
  "TemplateProgress",
)({
  ResourcesSucceeded: S.optional(S.Number),
  ResourcesFailed: S.optional(S.Number),
  ResourcesProcessing: S.optional(S.Number),
  ResourcesPending: S.optional(S.Number),
}) {}
export class StackEvent extends S.Class<StackEvent>("StackEvent")({
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
}) {}
export const StackEvents = S.Array(StackEvent);
export class StackResourceDriftInformation extends S.Class<StackResourceDriftInformation>(
  "StackResourceDriftInformation",
)({
  StackResourceDriftStatus: S.String,
  LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StackResource extends S.Class<StackResource>("StackResource")({
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
}) {}
export const StackResources = S.Array(StackResource);
export class RequiredActivatedType extends S.Class<RequiredActivatedType>(
  "RequiredActivatedType",
)({
  TypeNameAlias: S.optional(S.String),
  OriginalTypeName: S.optional(S.String),
  PublisherId: S.optional(S.String),
  SupportedMajorVersions: S.optional(SupportedMajorVersions),
}) {}
export const RequiredActivatedTypes = S.Array(RequiredActivatedType);
export class HookTarget extends S.Class<HookTarget>("HookTarget")({
  TargetType: S.String,
  TargetTypeName: S.String,
  TargetId: S.String,
  Action: S.String,
}) {}
export class Annotation extends S.Class<Annotation>("Annotation")({
  AnnotationName: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  RemediationMessage: S.optional(S.String),
  RemediationLink: S.optional(S.String),
  SeverityLevel: S.optional(S.String),
}) {}
export const AnnotationList = S.Array(Annotation);
export class ChangeSetSummary extends S.Class<ChangeSetSummary>(
  "ChangeSetSummary",
)({
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
}) {}
export const ChangeSetSummaries = S.Array(ChangeSetSummary);
export class Export extends S.Class<Export>("Export")({
  ExportingStackId: S.optional(S.String),
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const Exports = S.Array(Export);
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  GeneratedTemplateId: S.optional(S.String),
  GeneratedTemplateName: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NumberOfResources: S.optional(S.Number),
}) {}
export const TemplateSummaries = S.Array(TemplateSummary);
export class HookResultSummary extends S.Class<HookResultSummary>(
  "HookResultSummary",
)({
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
}) {}
export const HookResultSummaries = S.Array(HookResultSummary);
export class ScannedResourceIdentifier extends S.Class<ScannedResourceIdentifier>(
  "ScannedResourceIdentifier",
)({
  ResourceType: S.String,
  ResourceIdentifier: JazzResourceIdentifierProperties,
}) {}
export const ScannedResourceIdentifiers = S.Array(ScannedResourceIdentifier);
export class ScannedResource extends S.Class<ScannedResource>(
  "ScannedResource",
)({
  ResourceType: S.optional(S.String),
  ResourceIdentifier: S.optional(JazzResourceIdentifierProperties),
  ManagedByStack: S.optional(S.Boolean),
}) {}
export const ScannedResources = S.Array(ScannedResource);
export class ResourceScanSummary extends S.Class<ResourceScanSummary>(
  "ResourceScanSummary",
)({
  ResourceScanId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PercentageCompleted: S.optional(S.Number),
  ScanType: S.optional(S.String),
}) {}
export const ResourceScanSummaries = S.Array(ResourceScanSummary);
export class StackInstanceResourceDriftsSummary extends S.Class<StackInstanceResourceDriftsSummary>(
  "StackInstanceResourceDriftsSummary",
)({
  StackId: S.String,
  LogicalResourceId: S.String,
  PhysicalResourceId: S.optional(S.String),
  PhysicalResourceIdContext: S.optional(PhysicalResourceIdContext),
  ResourceType: S.String,
  PropertyDifferences: S.optional(PropertyDifferences),
  StackResourceDriftStatus: S.String,
  Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const StackInstanceResourceDriftsSummaries = S.Array(
  StackInstanceResourceDriftsSummary,
);
export class StackRefactorAction extends S.Class<StackRefactorAction>(
  "StackRefactorAction",
)({
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
}) {}
export const StackRefactorActions = S.Array(StackRefactorAction);
export class StackRefactorSummary extends S.Class<StackRefactorSummary>(
  "StackRefactorSummary",
)({
  StackRefactorId: S.optional(S.String),
  Description: S.optional(S.String),
  ExecutionStatus: S.optional(S.String),
  ExecutionStatusReason: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
}) {}
export const StackRefactorSummaries = S.Array(StackRefactorSummary);
export class StackSetAutoDeploymentTargetSummary extends S.Class<StackSetAutoDeploymentTargetSummary>(
  "StackSetAutoDeploymentTargetSummary",
)({
  OrganizationalUnitId: S.optional(S.String),
  Regions: S.optional(RegionList),
}) {}
export const StackSetAutoDeploymentTargetSummaries = S.Array(
  StackSetAutoDeploymentTargetSummary,
);
export class StackSetOperationStatusDetails extends S.Class<StackSetOperationStatusDetails>(
  "StackSetOperationStatusDetails",
)({ FailedStackInstancesCount: S.optional(S.Number) }) {}
export class StackSetOperationSummary extends S.Class<StackSetOperationSummary>(
  "StackSetOperationSummary",
)({
  OperationId: S.optional(S.String),
  Action: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusReason: S.optional(S.String),
  StatusDetails: S.optional(StackSetOperationStatusDetails),
  OperationPreferences: S.optional(StackSetOperationPreferences),
}) {}
export const StackSetOperationSummaries = S.Array(StackSetOperationSummary);
export class StackSetSummary extends S.Class<StackSetSummary>(
  "StackSetSummary",
)({
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
}) {}
export const StackSetSummaries = S.Array(StackSetSummary);
export class TypeVersionSummary extends S.Class<TypeVersionSummary>(
  "TypeVersionSummary",
)({
  Type: S.optional(S.String),
  TypeName: S.optional(S.String),
  VersionId: S.optional(S.String),
  IsDefaultVersion: S.optional(S.Boolean),
  Arn: S.optional(S.String),
  TimeCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
  PublicVersionNumber: S.optional(S.String),
}) {}
export const TypeVersionSummaries = S.Array(TypeVersionSummary);
export class TemplateParameter extends S.Class<TemplateParameter>(
  "TemplateParameter",
)({
  ParameterKey: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  NoEcho: S.optional(S.Boolean),
  Description: S.optional(S.String),
}) {}
export const TemplateParameters = S.Array(TemplateParameter);
export const Scope = S.Array(S.String);
export class ActivateTypeOutput extends S.Class<ActivateTypeOutput>(
  "ActivateTypeOutput",
)({ Arn: S.optional(S.String) }, ns) {}
export class CreateChangeSetInput extends S.Class<CreateChangeSetInput>(
  "CreateChangeSetInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGeneratedTemplateOutput extends S.Class<CreateGeneratedTemplateOutput>(
  "CreateGeneratedTemplateOutput",
)({ GeneratedTemplateId: S.optional(S.String) }, ns) {}
export class CreateStackInstancesOutput extends S.Class<CreateStackInstancesOutput>(
  "CreateStackInstancesOutput",
)({ OperationId: S.optional(S.String) }, ns) {}
export class CreateStackRefactorInput extends S.Class<CreateStackRefactorInput>(
  "CreateStackRefactorInput",
)(
  {
    Description: S.optional(S.String),
    EnableStackCreation: S.optional(S.Boolean),
    ResourceMappings: S.optional(ResourceMappings),
    StackDefinitions: StackDefinitions,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStackSetOutput extends S.Class<CreateStackSetOutput>(
  "CreateStackSetOutput",
)({ StackSetId: S.optional(S.String) }, ns) {}
export class DescribeAccountLimitsOutput extends S.Class<DescribeAccountLimitsOutput>(
  "DescribeAccountLimitsOutput",
)(
  {
    AccountLimits: S.optional(AccountLimitList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeStackEventsOutput extends S.Class<DescribeStackEventsOutput>(
  "DescribeStackEventsOutput",
)(
  { StackEvents: S.optional(StackEvents), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeStackResourcesOutput extends S.Class<DescribeStackResourcesOutput>(
  "DescribeStackResourcesOutput",
)({ StackResources: S.optional(StackResources) }, ns) {}
export class DescribeTypeOutput extends S.Class<DescribeTypeOutput>(
  "DescribeTypeOutput",
)(
  {
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
  },
  ns,
) {}
export class GetHookResultOutput extends S.Class<GetHookResultOutput>(
  "GetHookResultOutput",
)(
  {
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
  },
  ns,
) {}
export class ListChangeSetsOutput extends S.Class<ListChangeSetsOutput>(
  "ListChangeSetsOutput",
)(
  {
    Summaries: S.optional(ChangeSetSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListExportsOutput extends S.Class<ListExportsOutput>(
  "ListExportsOutput",
)({ Exports: S.optional(Exports), NextToken: S.optional(S.String) }, ns) {}
export class ListGeneratedTemplatesOutput extends S.Class<ListGeneratedTemplatesOutput>(
  "ListGeneratedTemplatesOutput",
)(
  { Summaries: S.optional(TemplateSummaries), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListHookResultsOutput extends S.Class<ListHookResultsOutput>(
  "ListHookResultsOutput",
)(
  {
    TargetType: S.optional(S.String),
    TargetId: S.optional(S.String),
    HookResults: S.optional(HookResultSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListResourceScanRelatedResourcesInput extends S.Class<ListResourceScanRelatedResourcesInput>(
  "ListResourceScanRelatedResourcesInput",
)(
  {
    ResourceScanId: S.String,
    Resources: ScannedResourceIdentifiers,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceScanResourcesOutput extends S.Class<ListResourceScanResourcesOutput>(
  "ListResourceScanResourcesOutput",
)(
  { Resources: S.optional(ScannedResources), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListResourceScansOutput extends S.Class<ListResourceScansOutput>(
  "ListResourceScansOutput",
)(
  {
    ResourceScanSummaries: S.optional(ResourceScanSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackInstanceResourceDriftsOutput extends S.Class<ListStackInstanceResourceDriftsOutput>(
  "ListStackInstanceResourceDriftsOutput",
)(
  {
    Summaries: S.optional(StackInstanceResourceDriftsSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackRefactorActionsOutput extends S.Class<ListStackRefactorActionsOutput>(
  "ListStackRefactorActionsOutput",
)(
  {
    StackRefactorActions: StackRefactorActions,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackRefactorsOutput extends S.Class<ListStackRefactorsOutput>(
  "ListStackRefactorsOutput",
)(
  {
    StackRefactorSummaries: StackRefactorSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackSetAutoDeploymentTargetsOutput extends S.Class<ListStackSetAutoDeploymentTargetsOutput>(
  "ListStackSetAutoDeploymentTargetsOutput",
)(
  {
    Summaries: S.optional(StackSetAutoDeploymentTargetSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackSetOperationsOutput extends S.Class<ListStackSetOperationsOutput>(
  "ListStackSetOperationsOutput",
)(
  {
    Summaries: S.optional(StackSetOperationSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackSetsOutput extends S.Class<ListStackSetsOutput>(
  "ListStackSetsOutput",
)(
  { Summaries: S.optional(StackSetSummaries), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListTypeVersionsOutput extends S.Class<ListTypeVersionsOutput>(
  "ListTypeVersionsOutput",
)(
  {
    TypeVersionSummaries: S.optional(TypeVersionSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartResourceScanOutput extends S.Class<StartResourceScanOutput>(
  "StartResourceScanOutput",
)({ ResourceScanId: S.optional(S.String) }, ns) {}
export class ValidateTemplateOutput extends S.Class<ValidateTemplateOutput>(
  "ValidateTemplateOutput",
)(
  {
    Parameters: S.optional(TemplateParameters),
    Description: S.optional(S.String),
    Capabilities: S.optional(Capabilities),
    CapabilitiesReason: S.optional(S.String),
    DeclaredTransforms: S.optional(TransformsList),
  },
  ns,
) {}
export class StackInstanceComprehensiveStatus extends S.Class<StackInstanceComprehensiveStatus>(
  "StackInstanceComprehensiveStatus",
)({ DetailedStatus: S.optional(S.String) }) {}
export class Output extends S.Class<Output>("Output")({
  OutputKey: S.optional(S.String),
  OutputValue: S.optional(S.String),
  Description: S.optional(S.String),
  ExportName: S.optional(S.String),
}) {}
export const Outputs = S.Array(Output);
export class StackDriftInformation extends S.Class<StackDriftInformation>(
  "StackDriftInformation",
)({
  StackDriftStatus: S.String,
  LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class OperationEntry extends S.Class<OperationEntry>("OperationEntry")({
  OperationType: S.optional(S.String),
  OperationId: S.optional(S.String),
}) {}
export const LastOperations = S.Array(OperationEntry);
export class StackSetDriftDetectionDetails extends S.Class<StackSetDriftDetectionDetails>(
  "StackSetDriftDetectionDetails",
)({
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
}) {}
export const ResourceIdentifiers = S.Array(S.String);
export class StackResourceDriftInformationSummary extends S.Class<StackResourceDriftInformationSummary>(
  "StackResourceDriftInformationSummary",
)({
  StackResourceDriftStatus: S.String,
  LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StackDriftInformationSummary extends S.Class<StackDriftInformationSummary>(
  "StackDriftInformationSummary",
)({
  StackDriftStatus: S.String,
  LastCheckTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class BatchDescribeTypeConfigurationsError extends S.Class<BatchDescribeTypeConfigurationsError>(
  "BatchDescribeTypeConfigurationsError",
)({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  TypeConfigurationIdentifier: S.optional(TypeConfigurationIdentifier),
}) {}
export const BatchDescribeTypeConfigurationsErrors = S.Array(
  BatchDescribeTypeConfigurationsError,
);
export class TypeConfigurationDetails extends S.Class<TypeConfigurationDetails>(
  "TypeConfigurationDetails",
)({
  Arn: S.optional(S.String),
  Alias: S.optional(S.String),
  Configuration: S.optional(S.String),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  TypeArn: S.optional(S.String),
  TypeName: S.optional(S.String),
  IsDefaultConfiguration: S.optional(S.Boolean),
}) {}
export const TypeConfigurationDetailsList = S.Array(TypeConfigurationDetails);
export class OperationEvent extends S.Class<OperationEvent>("OperationEvent")({
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
}) {}
export const OperationEvents = S.Array(OperationEvent);
export class StackInstance extends S.Class<StackInstance>("StackInstance")({
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
}) {}
export class StackResourceDetail extends S.Class<StackResourceDetail>(
  "StackResourceDetail",
)({
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
}) {}
export const StackResourceDrifts = S.Array(StackResourceDrift);
export class Stack extends S.Class<Stack>("Stack")({
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
}) {}
export const Stacks = S.Array(Stack);
export class StackSet extends S.Class<StackSet>("StackSet")({
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
}) {}
export class StackSetOperation extends S.Class<StackSetOperation>(
  "StackSetOperation",
)({
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
}) {}
export class ResourceIdentifierSummary extends S.Class<ResourceIdentifierSummary>(
  "ResourceIdentifierSummary",
)({
  ResourceType: S.optional(S.String),
  LogicalResourceIds: S.optional(LogicalResourceIds),
  ResourceIdentifiers: S.optional(ResourceIdentifiers),
}) {}
export const ResourceIdentifierSummaries = S.Array(ResourceIdentifierSummary);
export class Warnings extends S.Class<Warnings>("Warnings")({
  UnrecognizedResourceTypes: S.optional(ResourceTypes),
}) {}
export const RelatedResources = S.Array(ScannedResource);
export class StackInstanceSummary extends S.Class<StackInstanceSummary>(
  "StackInstanceSummary",
)({
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
}) {}
export const StackInstanceSummaries = S.Array(StackInstanceSummary);
export class StackResourceSummary extends S.Class<StackResourceSummary>(
  "StackResourceSummary",
)({
  LogicalResourceId: S.String,
  PhysicalResourceId: S.optional(S.String),
  ResourceType: S.String,
  LastUpdatedTimestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  ResourceStatus: S.String,
  ResourceStatusReason: S.optional(S.String),
  DriftInformation: S.optional(StackResourceDriftInformationSummary),
  ModuleInfo: S.optional(ModuleInfo),
}) {}
export const StackResourceSummaries = S.Array(StackResourceSummary);
export class StackSummary extends S.Class<StackSummary>("StackSummary")({
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
}) {}
export const StackSummaries = S.Array(StackSummary);
export class TypeSummary extends S.Class<TypeSummary>("TypeSummary")({
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
}) {}
export const TypeSummaries = S.Array(TypeSummary);
export class ResourceDriftIgnoredAttribute extends S.Class<ResourceDriftIgnoredAttribute>(
  "ResourceDriftIgnoredAttribute",
)({ Path: S.optional(S.String), Reason: S.optional(S.String) }) {}
export const ResourceDriftIgnoredAttributes = S.Array(
  ResourceDriftIgnoredAttribute,
);
export class ChangeSetHookResourceTargetDetails extends S.Class<ChangeSetHookResourceTargetDetails>(
  "ChangeSetHookResourceTargetDetails",
)({
  LogicalResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceAction: S.optional(S.String),
}) {}
export class WarningProperty extends S.Class<WarningProperty>(
  "WarningProperty",
)({
  PropertyPath: S.optional(S.String),
  Required: S.optional(S.Boolean),
  Description: S.optional(S.String),
}) {}
export const WarningProperties = S.Array(WarningProperty);
export const AllowedValues = S.Array(S.String);
export class BatchDescribeTypeConfigurationsOutput extends S.Class<BatchDescribeTypeConfigurationsOutput>(
  "BatchDescribeTypeConfigurationsOutput",
)(
  {
    Errors: S.optional(BatchDescribeTypeConfigurationsErrors),
    UnprocessedTypeConfigurations: S.optional(UnprocessedTypeConfigurations),
    TypeConfigurations: S.optional(TypeConfigurationDetailsList),
  },
  ns,
) {}
export class CreateChangeSetOutput extends S.Class<CreateChangeSetOutput>(
  "CreateChangeSetOutput",
)({ Id: S.optional(S.String), StackId: S.optional(S.String) }, ns) {}
export class CreateStackRefactorOutput extends S.Class<CreateStackRefactorOutput>(
  "CreateStackRefactorOutput",
)({ StackRefactorId: S.String }, ns) {}
export class DescribeEventsOutput extends S.Class<DescribeEventsOutput>(
  "DescribeEventsOutput",
)(
  {
    OperationEvents: S.optional(OperationEvents),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeStackInstanceOutput extends S.Class<DescribeStackInstanceOutput>(
  "DescribeStackInstanceOutput",
)({ StackInstance: S.optional(StackInstance) }, ns) {}
export class DescribeStackResourceOutput extends S.Class<DescribeStackResourceOutput>(
  "DescribeStackResourceOutput",
)({ StackResourceDetail: S.optional(StackResourceDetail) }, ns) {}
export class DescribeStackResourceDriftsOutput extends S.Class<DescribeStackResourceDriftsOutput>(
  "DescribeStackResourceDriftsOutput",
)(
  { StackResourceDrifts: StackResourceDrifts, NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeStacksOutput extends S.Class<DescribeStacksOutput>(
  "DescribeStacksOutput",
)({ Stacks: S.optional(Stacks), NextToken: S.optional(S.String) }, ns) {}
export class DescribeStackSetOutput extends S.Class<DescribeStackSetOutput>(
  "DescribeStackSetOutput",
)({ StackSet: S.optional(StackSet) }, ns) {}
export class DescribeStackSetOperationOutput extends S.Class<DescribeStackSetOperationOutput>(
  "DescribeStackSetOperationOutput",
)({ StackSetOperation: S.optional(StackSetOperation) }, ns) {}
export class ListResourceScanRelatedResourcesOutput extends S.Class<ListResourceScanRelatedResourcesOutput>(
  "ListResourceScanRelatedResourcesOutput",
)(
  {
    RelatedResources: S.optional(RelatedResources),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackInstancesOutput extends S.Class<ListStackInstancesOutput>(
  "ListStackInstancesOutput",
)(
  {
    Summaries: S.optional(StackInstanceSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStackResourcesOutput extends S.Class<ListStackResourcesOutput>(
  "ListStackResourcesOutput",
)(
  {
    StackResourceSummaries: S.optional(StackResourceSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStacksOutput extends S.Class<ListStacksOutput>(
  "ListStacksOutput",
)(
  {
    StackSummaries: S.optional(StackSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTypesOutput extends S.Class<ListTypesOutput>(
  "ListTypesOutput",
)(
  { TypeSummaries: S.optional(TypeSummaries), NextToken: S.optional(S.String) },
  ns,
) {}
export class ChangeSetHookTargetDetails extends S.Class<ChangeSetHookTargetDetails>(
  "ChangeSetHookTargetDetails",
)({
  TargetType: S.optional(S.String),
  ResourceTargetDetails: S.optional(ChangeSetHookResourceTargetDetails),
}) {}
export class WarningDetail extends S.Class<WarningDetail>("WarningDetail")({
  Type: S.optional(S.String),
  Properties: S.optional(WarningProperties),
}) {}
export const WarningDetails = S.Array(WarningDetail);
export class ParameterConstraints extends S.Class<ParameterConstraints>(
  "ParameterConstraints",
)({ AllowedValues: S.optional(AllowedValues) }) {}
export class AccountGateResult extends S.Class<AccountGateResult>(
  "AccountGateResult",
)({ Status: S.optional(S.String), StatusReason: S.optional(S.String) }) {}
export class ChangeSetHook extends S.Class<ChangeSetHook>("ChangeSetHook")({
  InvocationPoint: S.optional(S.String),
  FailureMode: S.optional(S.String),
  TypeName: S.optional(S.String),
  TypeVersionId: S.optional(S.String),
  TypeConfigurationVersionId: S.optional(S.String),
  TargetDetails: S.optional(ChangeSetHookTargetDetails),
}) {}
export const ChangeSetHooks = S.Array(ChangeSetHook);
export class ResourceDetail extends S.Class<ResourceDetail>("ResourceDetail")({
  ResourceType: S.optional(S.String),
  LogicalResourceId: S.optional(S.String),
  ResourceIdentifier: S.optional(ResourceIdentifierProperties),
  ResourceStatus: S.optional(S.String),
  ResourceStatusReason: S.optional(S.String),
  Warnings: S.optional(WarningDetails),
}) {}
export const ResourceDetails = S.Array(ResourceDetail);
export class ParameterDeclaration extends S.Class<ParameterDeclaration>(
  "ParameterDeclaration",
)({
  ParameterKey: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  ParameterType: S.optional(S.String),
  NoEcho: S.optional(S.Boolean),
  Description: S.optional(S.String),
  ParameterConstraints: S.optional(ParameterConstraints),
}) {}
export const ParameterDeclarations = S.Array(ParameterDeclaration);
export class StackSetOperationResultSummary extends S.Class<StackSetOperationResultSummary>(
  "StackSetOperationResultSummary",
)({
  Account: S.optional(S.String),
  Region: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  AccountGateResult: S.optional(AccountGateResult),
  OrganizationalUnitId: S.optional(S.String),
}) {}
export const StackSetOperationResultSummaries = S.Array(
  StackSetOperationResultSummary,
);
export class LiveResourceDrift extends S.Class<LiveResourceDrift>(
  "LiveResourceDrift",
)({
  PreviousValue: S.optional(S.String),
  ActualValue: S.optional(S.String),
  DriftDetectionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class DescribeChangeSetHooksOutput extends S.Class<DescribeChangeSetHooksOutput>(
  "DescribeChangeSetHooksOutput",
)(
  {
    ChangeSetId: S.optional(S.String),
    ChangeSetName: S.optional(S.String),
    Hooks: S.optional(ChangeSetHooks),
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
    StackId: S.optional(S.String),
    StackName: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGeneratedTemplateOutput extends S.Class<DescribeGeneratedTemplateOutput>(
  "DescribeGeneratedTemplateOutput",
)(
  {
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
  },
  ns,
) {}
export class GetTemplateSummaryOutput extends S.Class<GetTemplateSummaryOutput>(
  "GetTemplateSummaryOutput",
)(
  {
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
  },
  ns,
) {}
export class ListStackSetOperationResultsOutput extends S.Class<ListStackSetOperationResultsOutput>(
  "ListStackSetOperationResultsOutput",
)(
  {
    Summaries: S.optional(StackSetOperationResultSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ResourceTargetDefinition extends S.Class<ResourceTargetDefinition>(
  "ResourceTargetDefinition",
)({
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
}) {}
export class ResourceChangeDetail extends S.Class<ResourceChangeDetail>(
  "ResourceChangeDetail",
)({
  Target: S.optional(ResourceTargetDefinition),
  Evaluation: S.optional(S.String),
  ChangeSource: S.optional(S.String),
  CausingEntity: S.optional(S.String),
}) {}
export const ResourceChangeDetails = S.Array(ResourceChangeDetail);
export class ResourceChange extends S.Class<ResourceChange>("ResourceChange")({
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
}) {}
export class Change extends S.Class<Change>("Change")({
  Type: S.optional(S.String),
  HookInvocationCount: S.optional(S.Number),
  ResourceChange: S.optional(ResourceChange),
}) {}
export const Changes = S.Array(Change);
export class DescribeChangeSetOutput extends S.Class<DescribeChangeSetOutput>(
  "DescribeChangeSetOutput",
)(
  {
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
  },
  ns,
) {}

//# Errors
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  {},
  T.AwsQueryError({ code: "InvalidOperationException", httpResponseCode: 400 }),
) {}
export class OperationNotFoundException extends S.TaggedError<OperationNotFoundException>()(
  "OperationNotFoundException",
  {},
  T.AwsQueryError({
    code: "OperationNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class TokenAlreadyExistsException extends S.TaggedError<TokenAlreadyExistsException>()(
  "TokenAlreadyExistsException",
  {},
  T.AwsQueryError({
    code: "TokenAlreadyExistsException",
    httpResponseCode: 400,
  }),
) {}
export class CFNRegistryException extends S.TaggedError<CFNRegistryException>()(
  "CFNRegistryException",
  {},
  T.AwsQueryError({ code: "CFNRegistryException", httpResponseCode: 400 }),
) {}
export class TypeNotFoundException extends S.TaggedError<TypeNotFoundException>()(
  "TypeNotFoundException",
  {},
  T.AwsQueryError({ code: "TypeNotFoundException", httpResponseCode: 404 }),
) {}
export class InvalidChangeSetStatusException extends S.TaggedError<InvalidChangeSetStatusException>()(
  "InvalidChangeSetStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidChangeSetStatus", httpResponseCode: 400 }),
) {}
export class ConcurrentResourcesLimitExceededException extends S.TaggedError<ConcurrentResourcesLimitExceededException>()(
  "ConcurrentResourcesLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentResourcesLimitExceeded",
    httpResponseCode: 429,
  }),
) {}
export class OperationInProgressException extends S.TaggedError<OperationInProgressException>()(
  "OperationInProgressException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OperationInProgressException",
    httpResponseCode: 409,
  }),
) {}
export class StackSetNotFoundException extends S.TaggedError<StackSetNotFoundException>()(
  "StackSetNotFoundException",
  {},
  T.AwsQueryError({ code: "StackSetNotFoundException", httpResponseCode: 404 }),
) {}
export class ChangeSetNotFoundException extends S.TaggedError<ChangeSetNotFoundException>()(
  "ChangeSetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChangeSetNotFound", httpResponseCode: 404 }),
) {}
export class GeneratedTemplateNotFoundException extends S.TaggedError<GeneratedTemplateNotFoundException>()(
  "GeneratedTemplateNotFoundException",
  {},
  T.AwsQueryError({ code: "GeneratedTemplateNotFound", httpResponseCode: 404 }),
) {}
export class InvalidStateTransitionException extends S.TaggedError<InvalidStateTransitionException>()(
  "InvalidStateTransitionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidStateTransition", httpResponseCode: 400 }),
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  {},
  T.AwsQueryError({ code: "AlreadyExistsException", httpResponseCode: 400 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
) {}
export class InsufficientCapabilitiesException extends S.TaggedError<InsufficientCapabilitiesException>()(
  "InsufficientCapabilitiesException",
  {},
  T.AwsQueryError({
    code: "InsufficientCapabilitiesException",
    httpResponseCode: 400,
  }),
) {}
export class OperationIdAlreadyExistsException extends S.TaggedError<OperationIdAlreadyExistsException>()(
  "OperationIdAlreadyExistsException",
  {},
  T.AwsQueryError({
    code: "OperationIdAlreadyExistsException",
    httpResponseCode: 409,
  }),
) {}
export class StackInstanceNotFoundException extends S.TaggedError<StackInstanceNotFoundException>()(
  "StackInstanceNotFoundException",
  {},
  T.AwsQueryError({
    code: "StackInstanceNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class StaleRequestException extends S.TaggedError<StaleRequestException>()(
  "StaleRequestException",
  {},
  T.AwsQueryError({ code: "StaleRequestException", httpResponseCode: 409 }),
) {}
export class StackSetNotEmptyException extends S.TaggedError<StackSetNotEmptyException>()(
  "StackSetNotEmptyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StackSetNotEmptyException", httpResponseCode: 409 }),
) {}
export class ResourceScanNotFoundException extends S.TaggedError<ResourceScanNotFoundException>()(
  "ResourceScanNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceScanNotFound", httpResponseCode: 400 }),
) {}
export class StackRefactorNotFoundException extends S.TaggedError<StackRefactorNotFoundException>()(
  "StackRefactorNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "StackRefactorNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class HookResultNotFoundException extends S.TaggedError<HookResultNotFoundException>()(
  "HookResultNotFoundException",
  {},
  T.AwsQueryError({ code: "HookResultNotFound", httpResponseCode: 404 }),
) {}
export class OperationStatusCheckFailedException extends S.TaggedError<OperationStatusCheckFailedException>()(
  "OperationStatusCheckFailedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConditionalCheckFailed", httpResponseCode: 400 }),
) {}
export class ResourceScanInProgressException extends S.TaggedError<ResourceScanInProgressException>()(
  "ResourceScanInProgressException",
  {},
  T.AwsQueryError({ code: "ResourceScanInProgress", httpResponseCode: 400 }),
) {}
export class CreatedButModifiedException extends S.TaggedError<CreatedButModifiedException>()(
  "CreatedButModifiedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CreatedButModifiedException",
    httpResponseCode: 409,
  }),
) {}
export class StackNotFoundException extends S.TaggedError<StackNotFoundException>()(
  "StackNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "StackNotFoundException", httpResponseCode: 404 }),
) {}
export class ResourceScanLimitExceededException extends S.TaggedError<ResourceScanLimitExceededException>()(
  "ResourceScanLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceScanLimitExceeded", httpResponseCode: 400 }),
) {}
export class TypeConfigurationNotFoundException extends S.TaggedError<TypeConfigurationNotFoundException>()(
  "TypeConfigurationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TypeConfigurationNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class NameAlreadyExistsException extends S.TaggedError<NameAlreadyExistsException>()(
  "NameAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NameAlreadyExistsException",
    httpResponseCode: 409,
  }),
) {}

//# Operations
/**
 * Activate trusted access with Organizations. With trusted access between StackSets
 * and Organizations activated, the management account has permissions to create
 * and manage StackSets for your organization.
 */
export const activateOrganizationsAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ActivateOrganizationsAccessInput,
    output: ActivateOrganizationsAccessOutput,
    errors: [InvalidOperationException, OperationNotFoundException],
  }),
);
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
export const continueUpdateRollback = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ContinueUpdateRollbackInput,
    output: ContinueUpdateRollbackOutput,
    errors: [TokenAlreadyExistsException],
  }),
);
/**
 * Deactivates trusted access with Organizations. If trusted access is deactivated,
 * the management account does not have permissions to create and manage
 * service-managed StackSets for your organization.
 */
export const deactivateOrganizationsAccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeactivateOrganizationsAccessInput,
    output: DeactivateOrganizationsAccessOutput,
    errors: [InvalidOperationException, OperationNotFoundException],
  }));
/**
 * Deletes a specified stack. Once the call completes successfully, stack deletion starts.
 * Deleted stacks don't show up in the DescribeStacks operation if the deletion
 * has been completed successfully.
 *
 * For more information about deleting a stack, see Delete a stack from
 * the CloudFormation console in the *CloudFormation User Guide*.
 */
export const deleteStack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackInput,
  output: DeleteStackResponse,
  errors: [TokenAlreadyExistsException],
}));
/**
 * Executes the stack refactor operation.
 */
export const executeStackRefactor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteStackRefactorInput,
    output: ExecuteStackRefactorResponse,
    errors: [],
  }),
);
/**
 * Sets a stack policy for a specified stack.
 */
export const setStackPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetStackPolicyInput,
  output: SetStackPolicyResponse,
  errors: [],
}));
/**
 * Specify the default version of an extension. The default version of an extension will be
 * used in CloudFormation operations.
 */
export const setTypeDefaultVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetTypeDefaultVersionInput,
    output: SetTypeDefaultVersionOutput,
    errors: [CFNRegistryException, TypeNotFoundException],
  }),
);
/**
 * Sends a signal to the specified resource with a success or failure status. You can use the
 * `SignalResource` operation in conjunction with a creation policy or update
 * policy. CloudFormation doesn't proceed with a stack creation or update until resources receive the
 * required number of signals or the timeout period is exceeded. The `SignalResource`
 * operation is useful in cases where you want to send signals from anywhere other than an Amazon EC2
 * instance.
 */
export const signalResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignalResourceInput,
  output: SignalResourceResponse,
  errors: [],
}));
/**
 * Cancels an update on the specified stack. If the call completes successfully, the stack
 * rolls back the update and reverts to the previous stack configuration.
 *
 * You can cancel only stacks that are in the `UPDATE_IN_PROGRESS` state.
 */
export const cancelUpdateStack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelUpdateStackInput,
  output: CancelUpdateStackResponse,
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
export const deactivateType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateTypeInput,
  output: DeactivateTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
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
export const deleteChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChangeSetInput,
  output: DeleteChangeSetOutput,
  errors: [InvalidChangeSetStatusException],
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
export const deregisterType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTypeInput,
  output: DeregisterTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Retrieves information about the account's `OrganizationAccess` status. This API
 * can be called either by the management account or the delegated administrator by using the
 * `CallAs` parameter. This API can also be called without the `CallAs`
 * parameter by the management account.
 */
export const describeOrganizationsAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOrganizationsAccessInput,
    output: DescribeOrganizationsAccessOutput,
    errors: [InvalidOperationException, OperationNotFoundException],
  }),
);
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
export const describePublisher = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeStackDriftDetectionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTypeRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTypeRegistrationInput,
    output: DescribeTypeRegistrationOutput,
    errors: [CFNRegistryException],
  }),
);
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
export const detectStackDrift = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detectStackResourceDrift = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetectStackResourceDriftInput,
    output: DetectStackResourceDriftOutput,
    errors: [],
  }),
);
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
export const detectStackSetDrift = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectStackSetDriftInput,
  output: DetectStackSetDriftOutput,
  errors: [
    InvalidOperationException,
    OperationInProgressException,
    StackSetNotFoundException,
  ],
}));
/**
 * Returns the estimated monthly cost of a template. The return value is an Amazon Web Services Simple
 * Monthly Calculator URL with a query string that describes the resources required to run the
 * template.
 */
export const estimateTemplateCost = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EstimateTemplateCostInput,
    output: EstimateTemplateCostOutput,
    errors: [],
  }),
);
/**
 * Retrieves a generated template. If the template is in an `InProgress` or
 * `Pending` status then the template returned will be the template when the
 * template was last in a `Complete` status. If the template has not yet been in a
 * `Complete` status then an empty template will be returned.
 */
export const getGeneratedTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetGeneratedTemplateInput,
    output: GetGeneratedTemplateOutput,
    errors: [GeneratedTemplateNotFoundException],
  }),
);
/**
 * Returns the stack policy for a specified stack. If a stack doesn't have a policy, a null
 * value is returned.
 */
export const getStackPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listImports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImportsInput,
  output: ListImportsOutput,
  errors: [],
}));
/**
 * Returns a list of registration tokens for the specified extension(s).
 */
export const listTypeRegistrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTypeRegistrationsInput,
    output: ListTypeRegistrationsOutput,
    errors: [CFNRegistryException],
  }),
);
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
export const publishType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishTypeInput,
  output: PublishTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
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
export const registerPublisher = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rollbackStack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackStackInput,
  output: RollbackStackOutput,
  errors: [TokenAlreadyExistsException],
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
export const setTypeConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetTypeConfigurationInput,
    output: SetTypeConfigurationOutput,
    errors: [CFNRegistryException, TypeNotFoundException],
  }),
);
/**
 * Stops an in-progress operation on a StackSet and its associated stack instances. StackSets
 * will cancel all the unstarted stack instance deployments and wait for those are in-progress to
 * complete.
 */
export const stopStackSetOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopStackSetOperationInput,
    output: StopStackSetOperationOutput,
    errors: [
      InvalidOperationException,
      OperationNotFoundException,
      StackSetNotFoundException,
    ],
  }),
);
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
export const testType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestTypeInput,
  output: TestTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Updates a generated template. This can be used to change the name, add and remove
 * resources, refresh resources, and change the `DeletionPolicy` and
 * `UpdateReplacePolicy` settings. You can check the status of the update to the
 * generated template using the `DescribeGeneratedTemplate` API action.
 */
export const updateGeneratedTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGeneratedTemplateInput,
    output: UpdateGeneratedTemplateOutput,
    errors: [
      AlreadyExistsException,
      GeneratedTemplateNotFoundException,
      LimitExceededException,
    ],
  }),
);
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
export const updateStack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStackInput,
  output: UpdateStackOutput,
  errors: [InsufficientCapabilitiesException, TokenAlreadyExistsException],
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
export const updateTerminationProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTerminationProtectionInput,
    output: UpdateTerminationProtectionOutput,
    errors: [],
  }),
);
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
export const activateType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateTypeInput,
  output: ActivateTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
}));
/**
 * Creates a template from existing resources that are not already managed with CloudFormation.
 * You can check the status of the template generation using the
 * `DescribeGeneratedTemplate` API action.
 */
export const createGeneratedTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGeneratedTemplateInput,
    output: CreateGeneratedTemplateOutput,
    errors: [
      AlreadyExistsException,
      ConcurrentResourcesLimitExceededException,
      LimitExceededException,
    ],
  }),
);
/**
 * Creates a stack as specified in the template. After the call completes successfully, the
 * stack creation starts. You can check the status of the stack through the DescribeStacks operation.
 *
 * For more information about creating a stack and monitoring stack progress, see Managing Amazon Web Services
 * resources as a single unit with CloudFormation stacks in the
 * *CloudFormation User Guide*.
 */
export const createStack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStackInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deleted a generated template.
 */
export const deleteGeneratedTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGeneratedTemplateInput,
    output: DeleteGeneratedTemplateResponse,
    errors: [
      ConcurrentResourcesLimitExceededException,
      GeneratedTemplateNotFoundException,
    ],
  }),
);
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
export const deleteStackInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStackInstancesInput,
    output: DeleteStackInstancesOutput,
    errors: [
      InvalidOperationException,
      OperationIdAlreadyExistsException,
      OperationInProgressException,
      StackSetNotFoundException,
      StaleRequestException,
    ],
  }),
);
/**
 * Deletes a StackSet. Before you can delete a StackSet, all its member stack instances must
 * be deleted. For more information about how to complete this, see DeleteStackInstances.
 */
export const deleteStackSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStackSetInput,
  output: DeleteStackSetOutput,
  errors: [OperationInProgressException, StackSetNotEmptyException],
}));
/**
 * Retrieves your account's CloudFormation limits, such as the maximum number of stacks that you
 * can create in your account. For more information about account limits, see Understand CloudFormation quotas in the *CloudFormation User Guide*.
 */
export const describeAccountLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountLimitsInput,
    output: DescribeAccountLimitsOutput,
    errors: [],
  }),
);
/**
 * Describes details of a resource scan.
 */
export const describeResourceScan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeResourceScanInput,
    output: DescribeResourceScanOutput,
    errors: [ResourceScanNotFoundException],
  }),
);
/**
 * Returns all stack related events for a specified stack in reverse chronological order. For
 * more information about a stack's event history, see Understand CloudFormation stack creation events in the
 * *CloudFormation User Guide*.
 *
 * You can list events for stacks that have failed to create or have been deleted by
 * specifying the unique stack identifier (stack ID).
 */
export const describeStackEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStackEventsInput,
  output: DescribeStackEventsOutput,
  errors: [],
}));
/**
 * Describes the stack refactor status.
 */
export const describeStackRefactor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackRefactorInput,
    output: DescribeStackRefactorOutput,
    errors: [StackRefactorNotFoundException],
  }),
);
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
export const describeStackResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackResourcesInput,
    output: DescribeStackResourcesOutput,
    errors: [],
  }),
);
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
export const describeType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTypeInput,
  output: DescribeTypeOutput,
  errors: [CFNRegistryException, TypeNotFoundException],
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
export const executeChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listChangeSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListChangeSetsInput,
  output: ListChangeSetsOutput,
  errors: [],
}));
/**
 * Lists all exported output values in the account and Region in which you call this action.
 * Use this action to see the exported output values that you can import into other stacks. To
 * import values, use the Fn::ImportValue function.
 *
 * For more information, see Get exported outputs
 * from a deployed CloudFormation stack.
 */
export const listExports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExportsInput,
  output: ListExportsOutput,
  errors: [],
}));
/**
 * Lists your generated templates in this Region.
 */
export const listGeneratedTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListGeneratedTemplatesInput,
    output: ListGeneratedTemplatesOutput,
    errors: [],
  }),
);
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
export const listHookResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHookResultsInput,
  output: ListHookResultsOutput,
  errors: [HookResultNotFoundException],
}));
/**
 * List the resource scans from newest to oldest. By default it will return up to 10 resource
 * scans.
 */
export const listResourceScans = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceScansInput,
  output: ListResourceScansOutput,
  errors: [],
}));
/**
 * Returns drift information for resources in a stack instance.
 *
 * `ListStackInstanceResourceDrifts` returns drift information for the most
 * recent drift detection operation. If an operation is in progress, it may only return partial
 * results.
 */
export const listStackInstanceResourceDrifts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListStackInstanceResourceDriftsInput,
    output: ListStackInstanceResourceDriftsOutput,
    errors: [
      OperationNotFoundException,
      StackInstanceNotFoundException,
      StackSetNotFoundException,
    ],
  }));
/**
 * Lists the stack refactor actions that will be taken after calling the ExecuteStackRefactor action.
 */
export const listStackRefactorActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStackRefactorActionsInput,
    output: ListStackRefactorActionsOutput,
    errors: [],
  }),
);
/**
 * Lists all account stack refactor operations and their statuses.
 */
export const listStackRefactors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackRefactorsInput,
  output: ListStackRefactorsOutput,
  errors: [],
}));
/**
 * Returns summary information about deployment targets for a StackSet.
 */
export const listStackSetAutoDeploymentTargets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listStackSetOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStackSetOperationsInput,
    output: ListStackSetOperationsOutput,
    errors: [StackSetNotFoundException],
  }),
);
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
export const listStackSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackSetsInput,
  output: ListStackSetsOutput,
  errors: [],
}));
/**
 * Returns summary information about the versions of an extension.
 */
export const listTypeVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTypeVersionsInput,
  output: ListTypeVersionsOutput,
  errors: [CFNRegistryException],
}));
/**
 * Reports progress of a resource handler to CloudFormation.
 *
 * Reserved for use by the CloudFormation
 * CLI. Don't use this API in your code.
 */
export const recordHandlerProgress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RecordHandlerProgressInput,
    output: RecordHandlerProgressOutput,
    errors: [
      InvalidStateTransitionException,
      OperationStatusCheckFailedException,
    ],
  }),
);
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
export const updateStackInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const updateStackSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Validates a specified template. CloudFormation first checks if the template is valid JSON. If
 * it isn't, CloudFormation checks if the template is valid YAML. If both these checks fail,
 * CloudFormation returns a template validation error.
 */
export const validateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidateTemplateInput,
  output: ValidateTemplateOutput,
  errors: [],
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
export const createChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createStackRefactor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsInput,
  output: DescribeEventsOutput,
  errors: [],
}));
/**
 * Returns the stack instance that's associated with the specified StackSet, Amazon Web Services account,
 * and Amazon Web Services Region.
 *
 * For a list of stack instances that are associated with a specific StackSet, use ListStackInstances.
 */
export const describeStackInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackInstanceInput,
    output: DescribeStackInstanceOutput,
    errors: [StackInstanceNotFoundException, StackSetNotFoundException],
  }),
);
/**
 * Returns a description of the specified resource in the specified stack.
 *
 * For deleted stacks, DescribeStackResource returns resource information for up to 90 days
 * after the stack has been deleted.
 */
export const describeStackResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackResourceInput,
    output: DescribeStackResourceOutput,
    errors: [],
  }),
);
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
export const describeStackResourceDrifts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackResourceDriftsInput,
    output: DescribeStackResourceDriftsOutput,
    errors: [],
  }),
);
/**
 * Returns the description for the specified stack; if no stack name was specified, then it
 * returns the description for all the stacks created. For more information about a stack's event
 * history, see Understand CloudFormation stack creation events in the
 * *CloudFormation User Guide*.
 *
 * If the stack doesn't exist, a `ValidationError` is returned.
 */
export const describeStacks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStacksInput,
  output: DescribeStacksOutput,
  errors: [],
}));
/**
 * Returns the description of the specified StackSet.
 *
 * This API provides *strongly consistent* reads meaning it will always
 * return the most up-to-date data.
 */
export const describeStackSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeStackSetOperation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStackSetOperationInput,
    output: DescribeStackSetOperationOutput,
    errors: [OperationNotFoundException, StackSetNotFoundException],
  }),
);
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
export const getHookResult = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHookResultInput,
  output: GetHookResultOutput,
  errors: [HookResultNotFoundException],
}));
/**
 * Import existing stacks into a new StackSets. Use the stack import operation to import up
 * to 10 stacks into a new StackSet in the same account as the source stack or in a different
 * administrator account and Region, by specifying the stack ID of the stack you intend to
 * import.
 */
export const importStacksToStackSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the related resources for a list of resources from a resource scan. The response
 * indicates whether each returned resource is already managed by CloudFormation.
 */
export const listResourceScanRelatedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourceScanRelatedResourcesInput,
    output: ListResourceScanRelatedResourcesOutput,
    errors: [ResourceScanInProgressException, ResourceScanNotFoundException],
  }));
/**
 * Lists the resources from a resource scan. The results can be filtered by resource
 * identifier, resource type prefix, tag key, and tag value. Only resources that match all
 * specified filters are returned. The response indicates whether each returned resource is
 * already managed by CloudFormation.
 */
export const listResourceScanResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceScanResourcesInput,
    output: ListResourceScanResourcesOutput,
    errors: [ResourceScanInProgressException, ResourceScanNotFoundException],
  }),
);
/**
 * Returns summary information about stack instances that are associated with the specified
 * StackSet. You can filter for stack instances that are associated with a specific Amazon Web Services account
 * name or Region, or that have a specific status.
 */
export const listStackInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackInstancesInput,
  output: ListStackInstancesOutput,
  errors: [StackSetNotFoundException],
}));
/**
 * Returns descriptions of all resources of the specified stack.
 *
 * For deleted stacks, ListStackResources returns resource information for up to 90 days
 * after the stack has been deleted.
 */
export const listStackResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStackResourcesInput,
  output: ListStackResourcesOutput,
  errors: [],
}));
/**
 * Returns the summary information for stacks whose status matches the specified
 * `StackStatusFilter`. Summary information for stacks that have been deleted is
 * kept for 90 days after the stack is deleted. If no `StackStatusFilter` is
 * specified, summary information for all stacks is returned (including existing stacks and
 * stacks that have been deleted).
 */
export const listStacks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStacksInput,
  output: ListStacksOutput,
  errors: [],
}));
/**
 * Returns summary information about all extensions, including your private resource types,
 * modules, and Hooks as well as all public extensions from Amazon Web Services and third-party
 * publishers.
 */
export const listTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTypesInput,
  output: ListTypesOutput,
  errors: [CFNRegistryException],
}));
/**
 * Starts a scan of the resources in this account in this Region. You can the status of a
 * scan using the `ListResourceScans` API action.
 */
export const startResourceScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceScanInput,
  output: StartResourceScanOutput,
  errors: [ResourceScanInProgressException, ResourceScanLimitExceededException],
}));
/**
 * Returns configuration data for the specified CloudFormation extensions, from the CloudFormation
 * registry in your current account and Region.
 *
 * For more information, see Edit configuration
 * data for extensions in your account in the
 * *CloudFormation User Guide*.
 */
export const batchDescribeTypeConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDescribeTypeConfigurationsInput,
    output: BatchDescribeTypeConfigurationsOutput,
    errors: [CFNRegistryException, TypeConfigurationNotFoundException],
  }));
/**
 * Creates a StackSet.
 */
export const createStackSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeChangeSetHooks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeChangeSetHooksInput,
    output: DescribeChangeSetHooksOutput,
    errors: [ChangeSetNotFoundException],
  }),
);
/**
 * Describes a generated template. The output includes details about the progress of the
 * creation of a generated template started by a `CreateGeneratedTemplate` API action
 * or the update of a generated template started with an `UpdateGeneratedTemplate` API
 * action.
 */
export const describeGeneratedTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGeneratedTemplateInput,
    output: DescribeGeneratedTemplateOutput,
    errors: [GeneratedTemplateNotFoundException],
  }),
);
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
export const getTemplateSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listStackSetOperationResults =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListStackSetOperationResultsInput,
    output: ListStackSetOperationResultsOutput,
    errors: [OperationNotFoundException, StackSetNotFoundException],
  }));
/**
 * Returns the inputs for the change set and a list of changes that CloudFormation will make if
 * you execute the change set. For more information, see Update
 * CloudFormation stacks using change sets in the
 * *CloudFormation User Guide*.
 */
export const describeChangeSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChangeSetInput,
  output: DescribeChangeSetOutput,
  errors: [ChangeSetNotFoundException],
}));
