import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace(
  "http://elasticmapreduce.amazonaws.com/doc/2009-03-31",
);
const svc = T.AwsApiService({
  sdkId: "EMR",
  serviceShapeName: "ElasticMapReduce",
});
const auth = T.AwsAuthSigv4({ name: "elasticmapreduce" });
const ver = T.ServiceVersion("2009-03-31");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://elasticmapreduce-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://elasticmapreduce.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://elasticmapreduce-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://elasticmapreduce.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://elasticmapreduce.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetBlockPublicAccessConfigurationInput extends S.Class<GetBlockPublicAccessConfigurationInput>(
  "GetBlockPublicAccessConfigurationInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const StepIdsList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const XmlStringList = S.Array(S.String);
export const JobFlowExecutionStateList = S.Array(S.String);
export const ClusterStateList = S.Array(S.String);
export const InstanceGroupTypeList = S.Array(S.String);
export const InstanceStateList = S.Array(S.String);
export const StepStateList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const SupportedProductsList = S.Array(S.String);
export class CancelStepsInput extends S.Class<CancelStepsInput>(
  "CancelStepsInput",
)(
  {
    ClusterId: S.String,
    StepIds: StepIdsList,
    StepCancellationOption: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSecurityConfigurationInput extends S.Class<CreateSecurityConfigurationInput>(
  "CreateSecurityConfigurationInput",
)(
  { Name: S.String, SecurityConfiguration: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateStudioInput extends S.Class<CreateStudioInput>(
  "CreateStudioInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    AuthMode: S.String,
    VpcId: S.String,
    SubnetIds: SubnetIdList,
    ServiceRole: S.String,
    UserRole: S.optional(S.String),
    WorkspaceSecurityGroupId: S.String,
    EngineSecurityGroupId: S.String,
    DefaultS3Location: S.String,
    IdpAuthUrl: S.optional(S.String),
    IdpRelayStateParameterName: S.optional(S.String),
    Tags: S.optional(TagList),
    TrustedIdentityPropagationEnabled: S.optional(S.Boolean),
    IdcUserAssignment: S.optional(S.String),
    IdcInstanceArn: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStudioSessionMappingInput extends S.Class<CreateStudioSessionMappingInput>(
  "CreateStudioSessionMappingInput",
)(
  {
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
    SessionPolicyArn: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStudioSessionMappingResponse extends S.Class<CreateStudioSessionMappingResponse>(
  "CreateStudioSessionMappingResponse",
)({}, ns) {}
export class DeleteSecurityConfigurationInput extends S.Class<DeleteSecurityConfigurationInput>(
  "DeleteSecurityConfigurationInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityConfigurationOutput extends S.Class<DeleteSecurityConfigurationOutput>(
  "DeleteSecurityConfigurationOutput",
)({}, ns) {}
export class DeleteStudioInput extends S.Class<DeleteStudioInput>(
  "DeleteStudioInput",
)(
  { StudioId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStudioResponse extends S.Class<DeleteStudioResponse>(
  "DeleteStudioResponse",
)({}, ns) {}
export class DeleteStudioSessionMappingInput extends S.Class<DeleteStudioSessionMappingInput>(
  "DeleteStudioSessionMappingInput",
)(
  {
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStudioSessionMappingResponse extends S.Class<DeleteStudioSessionMappingResponse>(
  "DeleteStudioSessionMappingResponse",
)({}, ns) {}
export class DescribeClusterInput extends S.Class<DescribeClusterInput>(
  "DescribeClusterInput",
)(
  { ClusterId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeJobFlowsInput extends S.Class<DescribeJobFlowsInput>(
  "DescribeJobFlowsInput",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobFlowIds: S.optional(XmlStringList),
    JobFlowStates: S.optional(JobFlowExecutionStateList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotebookExecutionInput extends S.Class<DescribeNotebookExecutionInput>(
  "DescribeNotebookExecutionInput",
)(
  { NotebookExecutionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePersistentAppUIInput extends S.Class<DescribePersistentAppUIInput>(
  "DescribePersistentAppUIInput",
)(
  { PersistentAppUIId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReleaseLabelInput extends S.Class<DescribeReleaseLabelInput>(
  "DescribeReleaseLabelInput",
)(
  {
    ReleaseLabel: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSecurityConfigurationInput extends S.Class<DescribeSecurityConfigurationInput>(
  "DescribeSecurityConfigurationInput",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStepInput extends S.Class<DescribeStepInput>(
  "DescribeStepInput",
)(
  { ClusterId: S.String, StepId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStudioInput extends S.Class<DescribeStudioInput>(
  "DescribeStudioInput",
)(
  { StudioId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutoTerminationPolicyInput extends S.Class<GetAutoTerminationPolicyInput>(
  "GetAutoTerminationPolicyInput",
)(
  { ClusterId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetClusterSessionCredentialsInput extends S.Class<GetClusterSessionCredentialsInput>(
  "GetClusterSessionCredentialsInput",
)(
  { ClusterId: S.String, ExecutionRoleArn: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetManagedScalingPolicyInput extends S.Class<GetManagedScalingPolicyInput>(
  "GetManagedScalingPolicyInput",
)(
  { ClusterId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOnClusterAppUIPresignedURLInput extends S.Class<GetOnClusterAppUIPresignedURLInput>(
  "GetOnClusterAppUIPresignedURLInput",
)(
  {
    ClusterId: S.String,
    OnClusterAppUIType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    ExecutionRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPersistentAppUIPresignedURLInput extends S.Class<GetPersistentAppUIPresignedURLInput>(
  "GetPersistentAppUIPresignedURLInput",
)(
  {
    PersistentAppUIId: S.String,
    PersistentAppUIType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    AuthProxyCall: S.optional(S.Boolean),
    ExecutionRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStudioSessionMappingInput extends S.Class<GetStudioSessionMappingInput>(
  "GetStudioSessionMappingInput",
)(
  {
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBootstrapActionsInput extends S.Class<ListBootstrapActionsInput>(
  "ListBootstrapActionsInput",
)(
  { ClusterId: S.String, Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClustersInput extends S.Class<ListClustersInput>(
  "ListClustersInput",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterStates: S.optional(ClusterStateList),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceFleetsInput extends S.Class<ListInstanceFleetsInput>(
  "ListInstanceFleetsInput",
)(
  { ClusterId: S.String, Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstanceGroupsInput extends S.Class<ListInstanceGroupsInput>(
  "ListInstanceGroupsInput",
)(
  { ClusterId: S.String, Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInstancesInput extends S.Class<ListInstancesInput>(
  "ListInstancesInput",
)(
  {
    ClusterId: S.String,
    InstanceGroupId: S.optional(S.String),
    InstanceGroupTypes: S.optional(InstanceGroupTypeList),
    InstanceFleetId: S.optional(S.String),
    InstanceFleetType: S.optional(S.String),
    InstanceStates: S.optional(InstanceStateList),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNotebookExecutionsInput extends S.Class<ListNotebookExecutionsInput>(
  "ListNotebookExecutionsInput",
)(
  {
    EditorId: S.optional(S.String),
    Status: S.optional(S.String),
    From: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    To: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Marker: S.optional(S.String),
    ExecutionEngineId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSecurityConfigurationsInput extends S.Class<ListSecurityConfigurationsInput>(
  "ListSecurityConfigurationsInput",
)(
  { Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStepsInput extends S.Class<ListStepsInput>("ListStepsInput")(
  {
    ClusterId: S.String,
    StepStates: S.optional(StepStateList),
    StepIds: S.optional(XmlStringList),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStudiosInput extends S.Class<ListStudiosInput>(
  "ListStudiosInput",
)(
  { Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStudioSessionMappingsInput extends S.Class<ListStudioSessionMappingsInput>(
  "ListStudioSessionMappingsInput",
)(
  {
    StudioId: S.optional(S.String),
    IdentityType: S.optional(S.String),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSupportedInstanceTypesInput extends S.Class<ListSupportedInstanceTypesInput>(
  "ListSupportedInstanceTypesInput",
)(
  { ReleaseLabel: S.String, Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterInput extends S.Class<ModifyClusterInput>(
  "ModifyClusterInput",
)(
  {
    ClusterId: S.String,
    StepConcurrencyLevel: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PortRange extends S.Class<PortRange>("PortRange")({
  MinRange: S.Number,
  MaxRange: S.optional(S.Number),
}) {}
export const PortRanges = S.Array(PortRange);
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration),
) as any as S.Schema<ConfigurationList>;
export const StringMap = S.Record({ key: S.String, value: S.String });
export class BlockPublicAccessConfiguration extends S.Class<BlockPublicAccessConfiguration>(
  "BlockPublicAccessConfiguration",
)({
  BlockPublicSecurityGroupRules: S.Boolean,
  PermittedPublicSecurityGroupRuleRanges: S.optional(PortRanges),
  Classification: S.optional(S.String),
  Configurations: S.optional(ConfigurationList),
  Properties: S.optional(StringMap),
}) {}
export class PutBlockPublicAccessConfigurationInput extends S.Class<PutBlockPublicAccessConfigurationInput>(
  "PutBlockPublicAccessConfigurationInput",
)(
  { BlockPublicAccessConfiguration: BlockPublicAccessConfiguration },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutBlockPublicAccessConfigurationOutput extends S.Class<PutBlockPublicAccessConfigurationOutput>(
  "PutBlockPublicAccessConfigurationOutput",
)({}, ns) {}
export class RemoveAutoScalingPolicyInput extends S.Class<RemoveAutoScalingPolicyInput>(
  "RemoveAutoScalingPolicyInput",
)(
  { ClusterId: S.String, InstanceGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveAutoScalingPolicyOutput extends S.Class<RemoveAutoScalingPolicyOutput>(
  "RemoveAutoScalingPolicyOutput",
)({}, ns) {}
export class RemoveAutoTerminationPolicyInput extends S.Class<RemoveAutoTerminationPolicyInput>(
  "RemoveAutoTerminationPolicyInput",
)(
  { ClusterId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveAutoTerminationPolicyOutput extends S.Class<RemoveAutoTerminationPolicyOutput>(
  "RemoveAutoTerminationPolicyOutput",
)({}, ns) {}
export class RemoveManagedScalingPolicyInput extends S.Class<RemoveManagedScalingPolicyInput>(
  "RemoveManagedScalingPolicyInput",
)(
  { ClusterId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveManagedScalingPolicyOutput extends S.Class<RemoveManagedScalingPolicyOutput>(
  "RemoveManagedScalingPolicyOutput",
)({}, ns) {}
export class RemoveTagsInput extends S.Class<RemoveTagsInput>(
  "RemoveTagsInput",
)(
  { ResourceId: S.String, TagKeys: StringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsOutput extends S.Class<RemoveTagsOutput>(
  "RemoveTagsOutput",
)({}, ns) {}
export class SetKeepJobFlowAliveWhenNoStepsInput extends S.Class<SetKeepJobFlowAliveWhenNoStepsInput>(
  "SetKeepJobFlowAliveWhenNoStepsInput",
)(
  { JobFlowIds: XmlStringList, KeepJobFlowAliveWhenNoSteps: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetKeepJobFlowAliveWhenNoStepsResponse extends S.Class<SetKeepJobFlowAliveWhenNoStepsResponse>(
  "SetKeepJobFlowAliveWhenNoStepsResponse",
)({}, ns) {}
export class SetTerminationProtectionInput extends S.Class<SetTerminationProtectionInput>(
  "SetTerminationProtectionInput",
)(
  { JobFlowIds: XmlStringList, TerminationProtected: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetTerminationProtectionResponse extends S.Class<SetTerminationProtectionResponse>(
  "SetTerminationProtectionResponse",
)({}, ns) {}
export class SetUnhealthyNodeReplacementInput extends S.Class<SetUnhealthyNodeReplacementInput>(
  "SetUnhealthyNodeReplacementInput",
)(
  { JobFlowIds: XmlStringList, UnhealthyNodeReplacement: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetUnhealthyNodeReplacementResponse extends S.Class<SetUnhealthyNodeReplacementResponse>(
  "SetUnhealthyNodeReplacementResponse",
)({}, ns) {}
export class SetVisibleToAllUsersInput extends S.Class<SetVisibleToAllUsersInput>(
  "SetVisibleToAllUsersInput",
)(
  { JobFlowIds: XmlStringList, VisibleToAllUsers: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetVisibleToAllUsersResponse extends S.Class<SetVisibleToAllUsersResponse>(
  "SetVisibleToAllUsersResponse",
)({}, ns) {}
export class StopNotebookExecutionInput extends S.Class<StopNotebookExecutionInput>(
  "StopNotebookExecutionInput",
)(
  { NotebookExecutionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopNotebookExecutionResponse extends S.Class<StopNotebookExecutionResponse>(
  "StopNotebookExecutionResponse",
)({}, ns) {}
export class TerminateJobFlowsInput extends S.Class<TerminateJobFlowsInput>(
  "TerminateJobFlowsInput",
)(
  { JobFlowIds: XmlStringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TerminateJobFlowsResponse extends S.Class<TerminateJobFlowsResponse>(
  "TerminateJobFlowsResponse",
)({}, ns) {}
export class UpdateStudioInput extends S.Class<UpdateStudioInput>(
  "UpdateStudioInput",
)(
  {
    StudioId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdList),
    DefaultS3Location: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStudioResponse extends S.Class<UpdateStudioResponse>(
  "UpdateStudioResponse",
)({}, ns) {}
export class UpdateStudioSessionMappingInput extends S.Class<UpdateStudioSessionMappingInput>(
  "UpdateStudioSessionMappingInput",
)(
  {
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
    SessionPolicyArn: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStudioSessionMappingResponse extends S.Class<UpdateStudioSessionMappingResponse>(
  "UpdateStudioSessionMappingResponse",
)({}, ns) {}
export const EC2InstanceIdsToTerminateList = S.Array(S.String);
export class VolumeSpecification extends S.Class<VolumeSpecification>(
  "VolumeSpecification",
)({
  VolumeType: S.String,
  Iops: S.optional(S.Number),
  SizeInGB: S.Number,
  Throughput: S.optional(S.Number),
}) {}
export class EbsBlockDeviceConfig extends S.Class<EbsBlockDeviceConfig>(
  "EbsBlockDeviceConfig",
)({
  VolumeSpecification: VolumeSpecification,
  VolumesPerInstance: S.optional(S.Number),
}) {}
export const EbsBlockDeviceConfigList = S.Array(EbsBlockDeviceConfig);
export class EbsConfiguration extends S.Class<EbsConfiguration>(
  "EbsConfiguration",
)({
  EbsBlockDeviceConfigs: S.optional(EbsBlockDeviceConfigList),
  EbsOptimized: S.optional(S.Boolean),
}) {}
export class InstanceTypeConfig extends S.Class<InstanceTypeConfig>(
  "InstanceTypeConfig",
)({
  InstanceType: S.String,
  WeightedCapacity: S.optional(S.Number),
  BidPrice: S.optional(S.String),
  BidPriceAsPercentageOfOnDemandPrice: S.optional(S.Number),
  EbsConfiguration: S.optional(EbsConfiguration),
  Configurations: S.optional(ConfigurationList),
  CustomAmiId: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const InstanceTypeConfigList = S.Array(InstanceTypeConfig);
export class SpotProvisioningSpecification extends S.Class<SpotProvisioningSpecification>(
  "SpotProvisioningSpecification",
)({
  TimeoutDurationMinutes: S.Number,
  TimeoutAction: S.String,
  BlockDurationMinutes: S.optional(S.Number),
  AllocationStrategy: S.optional(S.String),
}) {}
export class OnDemandCapacityReservationOptions extends S.Class<OnDemandCapacityReservationOptions>(
  "OnDemandCapacityReservationOptions",
)({
  UsageStrategy: S.optional(S.String),
  CapacityReservationPreference: S.optional(S.String),
  CapacityReservationResourceGroupArn: S.optional(S.String),
}) {}
export class OnDemandProvisioningSpecification extends S.Class<OnDemandProvisioningSpecification>(
  "OnDemandProvisioningSpecification",
)({
  AllocationStrategy: S.String,
  CapacityReservationOptions: S.optional(OnDemandCapacityReservationOptions),
}) {}
export class InstanceFleetProvisioningSpecifications extends S.Class<InstanceFleetProvisioningSpecifications>(
  "InstanceFleetProvisioningSpecifications",
)({
  SpotSpecification: S.optional(SpotProvisioningSpecification),
  OnDemandSpecification: S.optional(OnDemandProvisioningSpecification),
}) {}
export class SpotResizingSpecification extends S.Class<SpotResizingSpecification>(
  "SpotResizingSpecification",
)({
  TimeoutDurationMinutes: S.optional(S.Number),
  AllocationStrategy: S.optional(S.String),
}) {}
export class OnDemandResizingSpecification extends S.Class<OnDemandResizingSpecification>(
  "OnDemandResizingSpecification",
)({
  TimeoutDurationMinutes: S.optional(S.Number),
  AllocationStrategy: S.optional(S.String),
  CapacityReservationOptions: S.optional(OnDemandCapacityReservationOptions),
}) {}
export class InstanceFleetResizingSpecifications extends S.Class<InstanceFleetResizingSpecifications>(
  "InstanceFleetResizingSpecifications",
)({
  SpotResizeSpecification: S.optional(SpotResizingSpecification),
  OnDemandResizeSpecification: S.optional(OnDemandResizingSpecification),
}) {}
export class InstanceFleetConfig extends S.Class<InstanceFleetConfig>(
  "InstanceFleetConfig",
)({
  Name: S.optional(S.String),
  InstanceFleetType: S.String,
  TargetOnDemandCapacity: S.optional(S.Number),
  TargetSpotCapacity: S.optional(S.Number),
  InstanceTypeConfigs: S.optional(InstanceTypeConfigList),
  LaunchSpecifications: S.optional(InstanceFleetProvisioningSpecifications),
  ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
  Context: S.optional(S.String),
}) {}
export const InstanceFleetConfigList = S.Array(InstanceFleetConfig);
export const XmlStringMaxLen256List = S.Array(S.String);
export const SecurityGroupsList = S.Array(S.String);
export class EMRContainersConfig extends S.Class<EMRContainersConfig>(
  "EMRContainersConfig",
)({ JobRunId: S.optional(S.String) }) {}
export class BlockPublicAccessConfigurationMetadata extends S.Class<BlockPublicAccessConfigurationMetadata>(
  "BlockPublicAccessConfigurationMetadata",
)({
  CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedByArn: S.String,
}) {}
export class ReleaseLabelFilter extends S.Class<ReleaseLabelFilter>(
  "ReleaseLabelFilter",
)({ Prefix: S.optional(S.String), Application: S.optional(S.String) }) {}
export class InstanceFleetModifyConfig extends S.Class<InstanceFleetModifyConfig>(
  "InstanceFleetModifyConfig",
)({
  InstanceFleetId: S.String,
  TargetOnDemandCapacity: S.optional(S.Number),
  TargetSpotCapacity: S.optional(S.Number),
  ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
  InstanceTypeConfigs: S.optional(InstanceTypeConfigList),
  Context: S.optional(S.String),
}) {}
export class AutoTerminationPolicy extends S.Class<AutoTerminationPolicy>(
  "AutoTerminationPolicy",
)({ IdleTimeout: S.optional(S.Number) }) {}
export class SupportedProductConfig extends S.Class<SupportedProductConfig>(
  "SupportedProductConfig",
)({ Name: S.optional(S.String), Args: S.optional(XmlStringList) }) {}
export const NewSupportedProductsList = S.Array(SupportedProductConfig);
export class Application extends S.Class<Application>("Application")({
  Name: S.optional(S.String),
  Version: S.optional(S.String),
  Args: S.optional(StringList),
  AdditionalInfo: S.optional(StringMap),
}) {}
export const ApplicationList = S.Array(Application);
export class Configuration extends S.Class<Configuration>("Configuration")({
  Classification: S.optional(S.String),
  Configurations: S.optional(S.suspend(() => ConfigurationList)),
  Properties: S.optional(StringMap),
}) {}
export class KerberosAttributes extends S.Class<KerberosAttributes>(
  "KerberosAttributes",
)({
  Realm: S.String,
  KdcAdminPassword: S.String,
  CrossRealmTrustPrincipalPassword: S.optional(S.String),
  ADDomainJoinUser: S.optional(S.String),
  ADDomainJoinPassword: S.optional(S.String),
}) {}
export class PlacementGroupConfig extends S.Class<PlacementGroupConfig>(
  "PlacementGroupConfig",
)({ InstanceRole: S.String, PlacementStrategy: S.optional(S.String) }) {}
export const PlacementGroupConfigList = S.Array(PlacementGroupConfig);
export class ExecutionEngineConfig extends S.Class<ExecutionEngineConfig>(
  "ExecutionEngineConfig",
)({
  Id: S.String,
  Type: S.optional(S.String),
  MasterInstanceSecurityGroupId: S.optional(S.String),
  ExecutionRoleArn: S.optional(S.String),
}) {}
export class NotebookS3LocationFromInput extends S.Class<NotebookS3LocationFromInput>(
  "NotebookS3LocationFromInput",
)({ Bucket: S.optional(S.String), Key: S.optional(S.String) }) {}
export class OutputNotebookS3LocationFromInput extends S.Class<OutputNotebookS3LocationFromInput>(
  "OutputNotebookS3LocationFromInput",
)({ Bucket: S.optional(S.String), Key: S.optional(S.String) }) {}
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class AddTagsInput extends S.Class<AddTagsInput>("AddTagsInput")(
  { ResourceId: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsOutput extends S.Class<AddTagsOutput>("AddTagsOutput")(
  {},
  ns,
) {}
export class CreatePersistentAppUIInput extends S.Class<CreatePersistentAppUIInput>(
  "CreatePersistentAppUIInput",
)(
  {
    TargetResourceArn: S.String,
    EMRContainersConfig: S.optional(EMRContainersConfig),
    Tags: S.optional(TagList),
    XReferer: S.optional(S.String),
    ProfilerType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSecurityConfigurationOutput extends S.Class<CreateSecurityConfigurationOutput>(
  "CreateSecurityConfigurationOutput",
)(
  {
    Name: S.String,
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  ns,
) {}
export class CreateStudioOutput extends S.Class<CreateStudioOutput>(
  "CreateStudioOutput",
)({ StudioId: S.optional(S.String), Url: S.optional(S.String) }, ns) {}
export class DescribeSecurityConfigurationOutput extends S.Class<DescribeSecurityConfigurationOutput>(
  "DescribeSecurityConfigurationOutput",
)(
  {
    Name: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class GetAutoTerminationPolicyOutput extends S.Class<GetAutoTerminationPolicyOutput>(
  "GetAutoTerminationPolicyOutput",
)({ AutoTerminationPolicy: S.optional(AutoTerminationPolicy) }, ns) {}
export class ComputeLimits extends S.Class<ComputeLimits>("ComputeLimits")({
  UnitType: S.String,
  MinimumCapacityUnits: S.Number,
  MaximumCapacityUnits: S.Number,
  MaximumOnDemandCapacityUnits: S.optional(S.Number),
  MaximumCoreCapacityUnits: S.optional(S.Number),
}) {}
export class ManagedScalingPolicy extends S.Class<ManagedScalingPolicy>(
  "ManagedScalingPolicy",
)({
  ComputeLimits: S.optional(ComputeLimits),
  UtilizationPerformanceIndex: S.optional(S.Number),
  ScalingStrategy: S.optional(S.String),
}) {}
export class GetManagedScalingPolicyOutput extends S.Class<GetManagedScalingPolicyOutput>(
  "GetManagedScalingPolicyOutput",
)({ ManagedScalingPolicy: S.optional(ManagedScalingPolicy) }, ns) {}
export class GetOnClusterAppUIPresignedURLOutput extends S.Class<GetOnClusterAppUIPresignedURLOutput>(
  "GetOnClusterAppUIPresignedURLOutput",
)(
  {
    PresignedURLReady: S.optional(S.Boolean),
    PresignedURL: S.optional(S.String),
  },
  ns,
) {}
export class GetPersistentAppUIPresignedURLOutput extends S.Class<GetPersistentAppUIPresignedURLOutput>(
  "GetPersistentAppUIPresignedURLOutput",
)(
  {
    PresignedURLReady: S.optional(S.Boolean),
    PresignedURL: S.optional(S.String),
  },
  ns,
) {}
export class ListReleaseLabelsInput extends S.Class<ListReleaseLabelsInput>(
  "ListReleaseLabelsInput",
)(
  {
    Filters: S.optional(ReleaseLabelFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterOutput extends S.Class<ModifyClusterOutput>(
  "ModifyClusterOutput",
)(
  {
    StepConcurrencyLevel: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
  },
  ns,
) {}
export class ModifyInstanceFleetInput extends S.Class<ModifyInstanceFleetInput>(
  "ModifyInstanceFleetInput",
)(
  { ClusterId: S.String, InstanceFleet: InstanceFleetModifyConfig },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyInstanceFleetResponse extends S.Class<ModifyInstanceFleetResponse>(
  "ModifyInstanceFleetResponse",
)({}, ns) {}
export class PutAutoTerminationPolicyInput extends S.Class<PutAutoTerminationPolicyInput>(
  "PutAutoTerminationPolicyInput",
)(
  {
    ClusterId: S.String,
    AutoTerminationPolicy: S.optional(AutoTerminationPolicy),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAutoTerminationPolicyOutput extends S.Class<PutAutoTerminationPolicyOutput>(
  "PutAutoTerminationPolicyOutput",
)({}, ns) {}
export class StartNotebookExecutionInput extends S.Class<StartNotebookExecutionInput>(
  "StartNotebookExecutionInput",
)(
  {
    EditorId: S.optional(S.String),
    RelativePath: S.optional(S.String),
    NotebookExecutionName: S.optional(S.String),
    NotebookParams: S.optional(S.String),
    ExecutionEngine: ExecutionEngineConfig,
    ServiceRole: S.String,
    NotebookInstanceSecurityGroupId: S.optional(S.String),
    Tags: S.optional(TagList),
    NotebookS3Location: S.optional(NotebookS3LocationFromInput),
    OutputNotebookS3Location: S.optional(OutputNotebookS3LocationFromInput),
    OutputNotebookFormat: S.optional(S.String),
    EnvironmentVariables: S.optional(EnvironmentVariablesMap),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PersistentAppUITypeList = S.Array(S.String);
export class ScalingConstraints extends S.Class<ScalingConstraints>(
  "ScalingConstraints",
)({ MinCapacity: S.Number, MaxCapacity: S.Number }) {}
export class PlacementType extends S.Class<PlacementType>("PlacementType")({
  AvailabilityZone: S.optional(S.String),
  AvailabilityZones: S.optional(XmlStringMaxLen256List),
}) {}
export class ScriptBootstrapActionConfig extends S.Class<ScriptBootstrapActionConfig>(
  "ScriptBootstrapActionConfig",
)({ Path: S.String, Args: S.optional(XmlStringList) }) {}
export const EC2InstanceIdsList = S.Array(S.String);
export class CancelStepsInfo extends S.Class<CancelStepsInfo>(
  "CancelStepsInfo",
)({
  StepId: S.optional(S.String),
  Status: S.optional(S.String),
  Reason: S.optional(S.String),
}) {}
export const CancelStepsInfoList = S.Array(CancelStepsInfo);
export class PersistentAppUI extends S.Class<PersistentAppUI>(
  "PersistentAppUI",
)({
  PersistentAppUIId: S.optional(S.String),
  PersistentAppUITypeList: S.optional(PersistentAppUITypeList),
  PersistentAppUIStatus: S.optional(S.String),
  AuthorId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStateChangeReason: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class SimplifiedApplication extends S.Class<SimplifiedApplication>(
  "SimplifiedApplication",
)({ Name: S.optional(S.String), Version: S.optional(S.String) }) {}
export const SimplifiedApplicationList = S.Array(SimplifiedApplication);
export class OSRelease extends S.Class<OSRelease>("OSRelease")({
  Label: S.optional(S.String),
}) {}
export const OSReleaseList = S.Array(OSRelease);
export class Studio extends S.Class<Studio>("Studio")({
  StudioId: S.optional(S.String),
  StudioArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  AuthMode: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetIds: S.optional(SubnetIdList),
  ServiceRole: S.optional(S.String),
  UserRole: S.optional(S.String),
  WorkspaceSecurityGroupId: S.optional(S.String),
  EngineSecurityGroupId: S.optional(S.String),
  Url: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DefaultS3Location: S.optional(S.String),
  IdpAuthUrl: S.optional(S.String),
  IdpRelayStateParameterName: S.optional(S.String),
  Tags: S.optional(TagList),
  IdcInstanceArn: S.optional(S.String),
  TrustedIdentityPropagationEnabled: S.optional(S.Boolean),
  IdcUserAssignment: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
}) {}
export class SessionMappingDetail extends S.Class<SessionMappingDetail>(
  "SessionMappingDetail",
)({
  StudioId: S.optional(S.String),
  IdentityId: S.optional(S.String),
  IdentityName: S.optional(S.String),
  IdentityType: S.optional(S.String),
  SessionPolicyArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Command extends S.Class<Command>("Command")({
  Name: S.optional(S.String),
  ScriptPath: S.optional(S.String),
  Args: S.optional(StringList),
}) {}
export const CommandList = S.Array(Command);
export class ClusterStateChangeReason extends S.Class<ClusterStateChangeReason>(
  "ClusterStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class ClusterTimeline extends S.Class<ClusterTimeline>(
  "ClusterTimeline",
)({
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ErrorData = S.Array(StringMap);
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  ErrorCode: S.optional(S.String),
  ErrorData: S.optional(ErrorData),
  ErrorMessage: S.optional(S.String),
}) {}
export const ErrorDetailList = S.Array(ErrorDetail);
export class ClusterStatus extends S.Class<ClusterStatus>("ClusterStatus")({
  State: S.optional(S.String),
  StateChangeReason: S.optional(ClusterStateChangeReason),
  Timeline: S.optional(ClusterTimeline),
  ErrorDetails: S.optional(ErrorDetailList),
}) {}
export class ClusterSummary extends S.Class<ClusterSummary>("ClusterSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(ClusterStatus),
  NormalizedInstanceHours: S.optional(S.Number),
  ClusterArn: S.optional(S.String),
  OutpostArn: S.optional(S.String),
}) {}
export const ClusterSummaryList = S.Array(ClusterSummary);
export class NotebookS3LocationForOutput extends S.Class<NotebookS3LocationForOutput>(
  "NotebookS3LocationForOutput",
)({ Bucket: S.optional(S.String), Key: S.optional(S.String) }) {}
export class NotebookExecutionSummary extends S.Class<NotebookExecutionSummary>(
  "NotebookExecutionSummary",
)({
  NotebookExecutionId: S.optional(S.String),
  EditorId: S.optional(S.String),
  NotebookExecutionName: S.optional(S.String),
  Status: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotebookS3Location: S.optional(NotebookS3LocationForOutput),
  ExecutionEngineId: S.optional(S.String),
}) {}
export const NotebookExecutionSummaryList = S.Array(NotebookExecutionSummary);
export class SecurityConfigurationSummary extends S.Class<SecurityConfigurationSummary>(
  "SecurityConfigurationSummary",
)({
  Name: S.optional(S.String),
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SecurityConfigurationList = S.Array(SecurityConfigurationSummary);
export class HadoopStepConfig extends S.Class<HadoopStepConfig>(
  "HadoopStepConfig",
)({
  Jar: S.optional(S.String),
  Properties: S.optional(StringMap),
  MainClass: S.optional(S.String),
  Args: S.optional(StringList),
}) {}
export class StepStateChangeReason extends S.Class<StepStateChangeReason>(
  "StepStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class FailureDetails extends S.Class<FailureDetails>("FailureDetails")({
  Reason: S.optional(S.String),
  Message: S.optional(S.String),
  LogFile: S.optional(S.String),
}) {}
export class StepTimeline extends S.Class<StepTimeline>("StepTimeline")({
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StepStatus extends S.Class<StepStatus>("StepStatus")({
  State: S.optional(S.String),
  StateChangeReason: S.optional(StepStateChangeReason),
  FailureDetails: S.optional(FailureDetails),
  Timeline: S.optional(StepTimeline),
}) {}
export class StepSummary extends S.Class<StepSummary>("StepSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Config: S.optional(HadoopStepConfig),
  ActionOnFailure: S.optional(S.String),
  Status: S.optional(StepStatus),
  LogUri: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
}) {}
export const StepSummaryList = S.Array(StepSummary);
export class StudioSummary extends S.Class<StudioSummary>("StudioSummary")({
  StudioId: S.optional(S.String),
  Name: S.optional(S.String),
  VpcId: S.optional(S.String),
  Description: S.optional(S.String),
  Url: S.optional(S.String),
  AuthMode: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const StudioSummaryList = S.Array(StudioSummary);
export class SessionMappingSummary extends S.Class<SessionMappingSummary>(
  "SessionMappingSummary",
)({
  StudioId: S.optional(S.String),
  IdentityId: S.optional(S.String),
  IdentityName: S.optional(S.String),
  IdentityType: S.optional(S.String),
  SessionPolicyArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const SessionMappingSummaryList = S.Array(SessionMappingSummary);
export class SupportedInstanceType extends S.Class<SupportedInstanceType>(
  "SupportedInstanceType",
)({
  Type: S.optional(S.String),
  MemoryGB: S.optional(S.Number),
  StorageGB: S.optional(S.Number),
  VCPU: S.optional(S.Number),
  Is64BitsOnly: S.optional(S.Boolean),
  InstanceFamilyId: S.optional(S.String),
  EbsOptimizedAvailable: S.optional(S.Boolean),
  EbsOptimizedByDefault: S.optional(S.Boolean),
  NumberOfDisks: S.optional(S.Number),
  EbsStorageOnly: S.optional(S.Boolean),
  Architecture: S.optional(S.String),
}) {}
export const SupportedInstanceTypesList = S.Array(SupportedInstanceType);
export class SimpleScalingPolicyConfiguration extends S.Class<SimpleScalingPolicyConfiguration>(
  "SimpleScalingPolicyConfiguration",
)({
  AdjustmentType: S.optional(S.String),
  ScalingAdjustment: S.Number,
  CoolDown: S.optional(S.Number),
}) {}
export class ScalingAction extends S.Class<ScalingAction>("ScalingAction")({
  Market: S.optional(S.String),
  SimpleScalingPolicyConfiguration: SimpleScalingPolicyConfiguration,
}) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const MetricDimensionList = S.Array(MetricDimension);
export class CloudWatchAlarmDefinition extends S.Class<CloudWatchAlarmDefinition>(
  "CloudWatchAlarmDefinition",
)({
  ComparisonOperator: S.String,
  EvaluationPeriods: S.optional(S.Number),
  MetricName: S.String,
  Namespace: S.optional(S.String),
  Period: S.Number,
  Statistic: S.optional(S.String),
  Threshold: S.Number,
  Unit: S.optional(S.String),
  Dimensions: S.optional(MetricDimensionList),
}) {}
export class ScalingTrigger extends S.Class<ScalingTrigger>("ScalingTrigger")({
  CloudWatchAlarmDefinition: CloudWatchAlarmDefinition,
}) {}
export class ScalingRule extends S.Class<ScalingRule>("ScalingRule")({
  Name: S.String,
  Description: S.optional(S.String),
  Action: ScalingAction,
  Trigger: ScalingTrigger,
}) {}
export const ScalingRuleList = S.Array(ScalingRule);
export class AutoScalingPolicy extends S.Class<AutoScalingPolicy>(
  "AutoScalingPolicy",
)({ Constraints: ScalingConstraints, Rules: ScalingRuleList }) {}
export class InstanceGroupConfig extends S.Class<InstanceGroupConfig>(
  "InstanceGroupConfig",
)({
  Name: S.optional(S.String),
  Market: S.optional(S.String),
  InstanceRole: S.String,
  BidPrice: S.optional(S.String),
  InstanceType: S.String,
  InstanceCount: S.Number,
  Configurations: S.optional(ConfigurationList),
  EbsConfiguration: S.optional(EbsConfiguration),
  AutoScalingPolicy: S.optional(AutoScalingPolicy),
  CustomAmiId: S.optional(S.String),
}) {}
export const InstanceGroupConfigList = S.Array(InstanceGroupConfig);
export class JobFlowInstancesConfig extends S.Class<JobFlowInstancesConfig>(
  "JobFlowInstancesConfig",
)({
  MasterInstanceType: S.optional(S.String),
  SlaveInstanceType: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  InstanceGroups: S.optional(InstanceGroupConfigList),
  InstanceFleets: S.optional(InstanceFleetConfigList),
  Ec2KeyName: S.optional(S.String),
  Placement: S.optional(PlacementType),
  KeepJobFlowAliveWhenNoSteps: S.optional(S.Boolean),
  TerminationProtected: S.optional(S.Boolean),
  UnhealthyNodeReplacement: S.optional(S.Boolean),
  HadoopVersion: S.optional(S.String),
  Ec2SubnetId: S.optional(S.String),
  Ec2SubnetIds: S.optional(XmlStringMaxLen256List),
  EmrManagedMasterSecurityGroup: S.optional(S.String),
  EmrManagedSlaveSecurityGroup: S.optional(S.String),
  ServiceAccessSecurityGroup: S.optional(S.String),
  AdditionalMasterSecurityGroups: S.optional(SecurityGroupsList),
  AdditionalSlaveSecurityGroups: S.optional(SecurityGroupsList),
}) {}
export class BootstrapActionConfig extends S.Class<BootstrapActionConfig>(
  "BootstrapActionConfig",
)({ Name: S.String, ScriptBootstrapAction: ScriptBootstrapActionConfig }) {}
export const BootstrapActionConfigList = S.Array(BootstrapActionConfig);
export class KeyValue extends S.Class<KeyValue>("KeyValue")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const KeyValueList = S.Array(KeyValue);
export class S3MonitoringConfiguration extends S.Class<S3MonitoringConfiguration>(
  "S3MonitoringConfiguration",
)({ LogUri: S.optional(S.String), EncryptionKeyArn: S.optional(S.String) }) {}
export class InstanceResizePolicy extends S.Class<InstanceResizePolicy>(
  "InstanceResizePolicy",
)({
  InstancesToTerminate: S.optional(EC2InstanceIdsList),
  InstancesToProtect: S.optional(EC2InstanceIdsList),
  InstanceTerminationTimeout: S.optional(S.Number),
}) {}
export const LogTypesMap = S.Record({ key: S.String, value: XmlStringList });
export class CancelStepsOutput extends S.Class<CancelStepsOutput>(
  "CancelStepsOutput",
)({ CancelStepsInfoList: S.optional(CancelStepsInfoList) }, ns) {}
export class CreatePersistentAppUIOutput extends S.Class<CreatePersistentAppUIOutput>(
  "CreatePersistentAppUIOutput",
)(
  {
    PersistentAppUIId: S.optional(S.String),
    RuntimeRoleEnabledCluster: S.optional(S.Boolean),
  },
  ns,
) {}
export class DescribePersistentAppUIOutput extends S.Class<DescribePersistentAppUIOutput>(
  "DescribePersistentAppUIOutput",
)({ PersistentAppUI: S.optional(PersistentAppUI) }, ns) {}
export class DescribeReleaseLabelOutput extends S.Class<DescribeReleaseLabelOutput>(
  "DescribeReleaseLabelOutput",
)(
  {
    ReleaseLabel: S.optional(S.String),
    Applications: S.optional(SimplifiedApplicationList),
    NextToken: S.optional(S.String),
    AvailableOSReleases: S.optional(OSReleaseList),
  },
  ns,
) {}
export class DescribeStudioOutput extends S.Class<DescribeStudioOutput>(
  "DescribeStudioOutput",
)({ Studio: S.optional(Studio) }, ns) {}
export class GetBlockPublicAccessConfigurationOutput extends S.Class<GetBlockPublicAccessConfigurationOutput>(
  "GetBlockPublicAccessConfigurationOutput",
)(
  {
    BlockPublicAccessConfiguration: BlockPublicAccessConfiguration,
    BlockPublicAccessConfigurationMetadata:
      BlockPublicAccessConfigurationMetadata,
  },
  ns,
) {}
export class GetStudioSessionMappingOutput extends S.Class<GetStudioSessionMappingOutput>(
  "GetStudioSessionMappingOutput",
)({ SessionMapping: S.optional(SessionMappingDetail) }, ns) {}
export class ListBootstrapActionsOutput extends S.Class<ListBootstrapActionsOutput>(
  "ListBootstrapActionsOutput",
)(
  { BootstrapActions: S.optional(CommandList), Marker: S.optional(S.String) },
  ns,
) {}
export class ListClustersOutput extends S.Class<ListClustersOutput>(
  "ListClustersOutput",
)(
  { Clusters: S.optional(ClusterSummaryList), Marker: S.optional(S.String) },
  ns,
) {}
export class ListNotebookExecutionsOutput extends S.Class<ListNotebookExecutionsOutput>(
  "ListNotebookExecutionsOutput",
)(
  {
    NotebookExecutions: S.optional(NotebookExecutionSummaryList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListReleaseLabelsOutput extends S.Class<ListReleaseLabelsOutput>(
  "ListReleaseLabelsOutput",
)(
  { ReleaseLabels: S.optional(StringList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListSecurityConfigurationsOutput extends S.Class<ListSecurityConfigurationsOutput>(
  "ListSecurityConfigurationsOutput",
)(
  {
    SecurityConfigurations: S.optional(SecurityConfigurationList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListStepsOutput extends S.Class<ListStepsOutput>(
  "ListStepsOutput",
)({ Steps: S.optional(StepSummaryList), Marker: S.optional(S.String) }, ns) {}
export class ListStudiosOutput extends S.Class<ListStudiosOutput>(
  "ListStudiosOutput",
)(
  { Studios: S.optional(StudioSummaryList), Marker: S.optional(S.String) },
  ns,
) {}
export class ListStudioSessionMappingsOutput extends S.Class<ListStudioSessionMappingsOutput>(
  "ListStudioSessionMappingsOutput",
)(
  {
    SessionMappings: S.optional(SessionMappingSummaryList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListSupportedInstanceTypesOutput extends S.Class<ListSupportedInstanceTypesOutput>(
  "ListSupportedInstanceTypesOutput",
)(
  {
    SupportedInstanceTypes: S.optional(SupportedInstanceTypesList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class PutManagedScalingPolicyInput extends S.Class<PutManagedScalingPolicyInput>(
  "PutManagedScalingPolicyInput",
)(
  { ClusterId: S.String, ManagedScalingPolicy: ManagedScalingPolicy },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutManagedScalingPolicyOutput extends S.Class<PutManagedScalingPolicyOutput>(
  "PutManagedScalingPolicyOutput",
)({}, ns) {}
export class StartNotebookExecutionOutput extends S.Class<StartNotebookExecutionOutput>(
  "StartNotebookExecutionOutput",
)({ NotebookExecutionId: S.optional(S.String) }, ns) {}
export class HadoopJarStepConfig extends S.Class<HadoopJarStepConfig>(
  "HadoopJarStepConfig",
)({
  Properties: S.optional(KeyValueList),
  Jar: S.String,
  MainClass: S.optional(S.String),
  Args: S.optional(XmlStringList),
}) {}
export class StepMonitoringConfiguration extends S.Class<StepMonitoringConfiguration>(
  "StepMonitoringConfiguration",
)({ S3MonitoringConfiguration: S.optional(S3MonitoringConfiguration) }) {}
export class Ec2InstanceAttributes extends S.Class<Ec2InstanceAttributes>(
  "Ec2InstanceAttributes",
)({
  Ec2KeyName: S.optional(S.String),
  Ec2SubnetId: S.optional(S.String),
  RequestedEc2SubnetIds: S.optional(XmlStringMaxLen256List),
  Ec2AvailabilityZone: S.optional(S.String),
  RequestedEc2AvailabilityZones: S.optional(XmlStringMaxLen256List),
  IamInstanceProfile: S.optional(S.String),
  EmrManagedMasterSecurityGroup: S.optional(S.String),
  EmrManagedSlaveSecurityGroup: S.optional(S.String),
  ServiceAccessSecurityGroup: S.optional(S.String),
  AdditionalMasterSecurityGroups: S.optional(StringList),
  AdditionalSlaveSecurityGroups: S.optional(StringList),
}) {}
export class JobFlowExecutionStatusDetail extends S.Class<JobFlowExecutionStatusDetail>(
  "JobFlowExecutionStatusDetail",
)({
  State: S.String,
  CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStateChangeReason: S.optional(S.String),
}) {}
export class BootstrapActionDetail extends S.Class<BootstrapActionDetail>(
  "BootstrapActionDetail",
)({ BootstrapActionConfig: S.optional(BootstrapActionConfig) }) {}
export const BootstrapActionDetailList = S.Array(BootstrapActionDetail);
export class OutputNotebookS3LocationForOutput extends S.Class<OutputNotebookS3LocationForOutput>(
  "OutputNotebookS3LocationForOutput",
)({ Bucket: S.optional(S.String), Key: S.optional(S.String) }) {}
export class UsernamePassword extends S.Class<UsernamePassword>(
  "UsernamePassword",
)({ Username: S.optional(S.String), Password: S.optional(S.String) }) {}
export class EbsBlockDevice extends S.Class<EbsBlockDevice>("EbsBlockDevice")({
  VolumeSpecification: S.optional(VolumeSpecification),
  Device: S.optional(S.String),
}) {}
export const EbsBlockDeviceList = S.Array(EbsBlockDevice);
export class InstanceTypeSpecification extends S.Class<InstanceTypeSpecification>(
  "InstanceTypeSpecification",
)({
  InstanceType: S.optional(S.String),
  WeightedCapacity: S.optional(S.Number),
  BidPrice: S.optional(S.String),
  BidPriceAsPercentageOfOnDemandPrice: S.optional(S.Number),
  Configurations: S.optional(ConfigurationList),
  EbsBlockDevices: S.optional(EbsBlockDeviceList),
  EbsOptimized: S.optional(S.Boolean),
  CustomAmiId: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const InstanceTypeSpecificationList = S.Array(InstanceTypeSpecification);
export class EbsVolume extends S.Class<EbsVolume>("EbsVolume")({
  Device: S.optional(S.String),
  VolumeId: S.optional(S.String),
}) {}
export const EbsVolumeList = S.Array(EbsVolume);
export class ShrinkPolicy extends S.Class<ShrinkPolicy>("ShrinkPolicy")({
  DecommissionTimeout: S.optional(S.Number),
  InstanceResizePolicy: S.optional(InstanceResizePolicy),
}) {}
export class CloudWatchLogConfiguration extends S.Class<CloudWatchLogConfiguration>(
  "CloudWatchLogConfiguration",
)({
  Enabled: S.Boolean,
  LogGroupName: S.optional(S.String),
  LogStreamNamePrefix: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  LogTypes: S.optional(LogTypesMap),
}) {}
export class StepConfig extends S.Class<StepConfig>("StepConfig")({
  Name: S.String,
  ActionOnFailure: S.optional(S.String),
  HadoopJarStep: HadoopJarStepConfig,
  StepMonitoringConfiguration: S.optional(StepMonitoringConfiguration),
}) {}
export const StepConfigList = S.Array(StepConfig);
export class NotebookExecution extends S.Class<NotebookExecution>(
  "NotebookExecution",
)({
  NotebookExecutionId: S.optional(S.String),
  EditorId: S.optional(S.String),
  ExecutionEngine: S.optional(ExecutionEngineConfig),
  NotebookExecutionName: S.optional(S.String),
  NotebookParams: S.optional(S.String),
  Status: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Arn: S.optional(S.String),
  OutputNotebookURI: S.optional(S.String),
  LastStateChangeReason: S.optional(S.String),
  NotebookInstanceSecurityGroupId: S.optional(S.String),
  Tags: S.optional(TagList),
  NotebookS3Location: S.optional(NotebookS3LocationForOutput),
  OutputNotebookS3Location: S.optional(OutputNotebookS3LocationForOutput),
  OutputNotebookFormat: S.optional(S.String),
  EnvironmentVariables: S.optional(EnvironmentVariablesMap),
}) {}
export const Credentials = S.Union(
  S.Struct({ UsernamePassword: UsernamePassword }),
);
export class InstanceGroupModifyConfig extends S.Class<InstanceGroupModifyConfig>(
  "InstanceGroupModifyConfig",
)({
  InstanceGroupId: S.String,
  InstanceCount: S.optional(S.Number),
  EC2InstanceIdsToTerminate: S.optional(EC2InstanceIdsToTerminateList),
  ShrinkPolicy: S.optional(ShrinkPolicy),
  ReconfigurationType: S.optional(S.String),
  Configurations: S.optional(ConfigurationList),
}) {}
export const InstanceGroupModifyConfigList = S.Array(InstanceGroupModifyConfig);
export class MonitoringConfiguration extends S.Class<MonitoringConfiguration>(
  "MonitoringConfiguration",
)({ CloudWatchLogConfiguration: S.optional(CloudWatchLogConfiguration) }) {}
export class InstanceGroupDetail extends S.Class<InstanceGroupDetail>(
  "InstanceGroupDetail",
)({
  InstanceGroupId: S.optional(S.String),
  Name: S.optional(S.String),
  Market: S.String,
  InstanceRole: S.String,
  BidPrice: S.optional(S.String),
  InstanceType: S.String,
  InstanceRequestCount: S.Number,
  InstanceRunningCount: S.Number,
  State: S.String,
  LastStateChangeReason: S.optional(S.String),
  CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CustomAmiId: S.optional(S.String),
}) {}
export const InstanceGroupDetailList = S.Array(InstanceGroupDetail);
export class StepExecutionStatusDetail extends S.Class<StepExecutionStatusDetail>(
  "StepExecutionStatusDetail",
)({
  State: S.String,
  CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStateChangeReason: S.optional(S.String),
}) {}
export class InstanceFleetStateChangeReason extends S.Class<InstanceFleetStateChangeReason>(
  "InstanceFleetStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InstanceFleetTimeline extends S.Class<InstanceFleetTimeline>(
  "InstanceFleetTimeline",
)({
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class InstanceGroupStateChangeReason extends S.Class<InstanceGroupStateChangeReason>(
  "InstanceGroupStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InstanceGroupTimeline extends S.Class<InstanceGroupTimeline>(
  "InstanceGroupTimeline",
)({
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class InstanceStateChangeReason extends S.Class<InstanceStateChangeReason>(
  "InstanceStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class InstanceTimeline extends S.Class<InstanceTimeline>(
  "InstanceTimeline",
)({
  CreationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AddJobFlowStepsInput extends S.Class<AddJobFlowStepsInput>(
  "AddJobFlowStepsInput",
)(
  {
    JobFlowId: S.String,
    Steps: StepConfigList,
    ExecutionRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotebookExecutionOutput extends S.Class<DescribeNotebookExecutionOutput>(
  "DescribeNotebookExecutionOutput",
)({ NotebookExecution: S.optional(NotebookExecution) }, ns) {}
export class GetClusterSessionCredentialsOutput extends S.Class<GetClusterSessionCredentialsOutput>(
  "GetClusterSessionCredentialsOutput",
)(
  {
    Credentials: S.optional(Credentials),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class ModifyInstanceGroupsInput extends S.Class<ModifyInstanceGroupsInput>(
  "ModifyInstanceGroupsInput",
)(
  {
    ClusterId: S.optional(S.String),
    InstanceGroups: S.optional(InstanceGroupModifyConfigList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyInstanceGroupsResponse extends S.Class<ModifyInstanceGroupsResponse>(
  "ModifyInstanceGroupsResponse",
)({}, ns) {}
export class RunJobFlowInput extends S.Class<RunJobFlowInput>(
  "RunJobFlowInput",
)(
  {
    Name: S.String,
    LogUri: S.optional(S.String),
    LogEncryptionKmsKeyId: S.optional(S.String),
    AdditionalInfo: S.optional(S.String),
    AmiVersion: S.optional(S.String),
    ReleaseLabel: S.optional(S.String),
    Instances: JobFlowInstancesConfig,
    Steps: S.optional(StepConfigList),
    BootstrapActions: S.optional(BootstrapActionConfigList),
    SupportedProducts: S.optional(SupportedProductsList),
    NewSupportedProducts: S.optional(NewSupportedProductsList),
    Applications: S.optional(ApplicationList),
    Configurations: S.optional(ConfigurationList),
    VisibleToAllUsers: S.optional(S.Boolean),
    JobFlowRole: S.optional(S.String),
    ServiceRole: S.optional(S.String),
    Tags: S.optional(TagList),
    SecurityConfiguration: S.optional(S.String),
    AutoScalingRole: S.optional(S.String),
    ScaleDownBehavior: S.optional(S.String),
    CustomAmiId: S.optional(S.String),
    EbsRootVolumeSize: S.optional(S.Number),
    RepoUpgradeOnBoot: S.optional(S.String),
    KerberosAttributes: S.optional(KerberosAttributes),
    StepConcurrencyLevel: S.optional(S.Number),
    ManagedScalingPolicy: S.optional(ManagedScalingPolicy),
    PlacementGroupConfigs: S.optional(PlacementGroupConfigList),
    AutoTerminationPolicy: S.optional(AutoTerminationPolicy),
    OSReleaseLabel: S.optional(S.String),
    EbsRootVolumeIops: S.optional(S.Number),
    EbsRootVolumeThroughput: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class JobFlowInstancesDetail extends S.Class<JobFlowInstancesDetail>(
  "JobFlowInstancesDetail",
)({
  MasterInstanceType: S.String,
  MasterPublicDnsName: S.optional(S.String),
  MasterInstanceId: S.optional(S.String),
  SlaveInstanceType: S.String,
  InstanceCount: S.Number,
  InstanceGroups: S.optional(InstanceGroupDetailList),
  NormalizedInstanceHours: S.optional(S.Number),
  Ec2KeyName: S.optional(S.String),
  Ec2SubnetId: S.optional(S.String),
  Placement: S.optional(PlacementType),
  KeepJobFlowAliveWhenNoSteps: S.optional(S.Boolean),
  TerminationProtected: S.optional(S.Boolean),
  UnhealthyNodeReplacement: S.optional(S.Boolean),
  HadoopVersion: S.optional(S.String),
}) {}
export class StepDetail extends S.Class<StepDetail>("StepDetail")({
  StepConfig: StepConfig,
  ExecutionStatusDetail: StepExecutionStatusDetail,
}) {}
export const StepDetailList = S.Array(StepDetail);
export class InstanceFleetStatus extends S.Class<InstanceFleetStatus>(
  "InstanceFleetStatus",
)({
  State: S.optional(S.String),
  StateChangeReason: S.optional(InstanceFleetStateChangeReason),
  Timeline: S.optional(InstanceFleetTimeline),
}) {}
export class InstanceGroupStatus extends S.Class<InstanceGroupStatus>(
  "InstanceGroupStatus",
)({
  State: S.optional(S.String),
  StateChangeReason: S.optional(InstanceGroupStateChangeReason),
  Timeline: S.optional(InstanceGroupTimeline),
}) {}
export class InstanceStatus extends S.Class<InstanceStatus>("InstanceStatus")({
  State: S.optional(S.String),
  StateChangeReason: S.optional(InstanceStateChangeReason),
  Timeline: S.optional(InstanceTimeline),
}) {}
export class AutoScalingPolicyStateChangeReason extends S.Class<AutoScalingPolicyStateChangeReason>(
  "AutoScalingPolicyStateChangeReason",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(ClusterStatus),
  Ec2InstanceAttributes: S.optional(Ec2InstanceAttributes),
  InstanceCollectionType: S.optional(S.String),
  LogUri: S.optional(S.String),
  LogEncryptionKmsKeyId: S.optional(S.String),
  RequestedAmiVersion: S.optional(S.String),
  RunningAmiVersion: S.optional(S.String),
  ReleaseLabel: S.optional(S.String),
  AutoTerminate: S.optional(S.Boolean),
  TerminationProtected: S.optional(S.Boolean),
  UnhealthyNodeReplacement: S.optional(S.Boolean),
  VisibleToAllUsers: S.optional(S.Boolean),
  Applications: S.optional(ApplicationList),
  Tags: S.optional(TagList),
  ServiceRole: S.optional(S.String),
  NormalizedInstanceHours: S.optional(S.Number),
  MasterPublicDnsName: S.optional(S.String),
  Configurations: S.optional(ConfigurationList),
  SecurityConfiguration: S.optional(S.String),
  AutoScalingRole: S.optional(S.String),
  ScaleDownBehavior: S.optional(S.String),
  CustomAmiId: S.optional(S.String),
  EbsRootVolumeSize: S.optional(S.Number),
  RepoUpgradeOnBoot: S.optional(S.String),
  KerberosAttributes: S.optional(KerberosAttributes),
  ClusterArn: S.optional(S.String),
  OutpostArn: S.optional(S.String),
  StepConcurrencyLevel: S.optional(S.Number),
  PlacementGroups: S.optional(PlacementGroupConfigList),
  OSReleaseLabel: S.optional(S.String),
  EbsRootVolumeIops: S.optional(S.Number),
  EbsRootVolumeThroughput: S.optional(S.Number),
  ExtendedSupport: S.optional(S.Boolean),
  MonitoringConfiguration: S.optional(MonitoringConfiguration),
}) {}
export class JobFlowDetail extends S.Class<JobFlowDetail>("JobFlowDetail")({
  JobFlowId: S.String,
  Name: S.String,
  LogUri: S.optional(S.String),
  LogEncryptionKmsKeyId: S.optional(S.String),
  AmiVersion: S.optional(S.String),
  ExecutionStatusDetail: JobFlowExecutionStatusDetail,
  Instances: JobFlowInstancesDetail,
  Steps: S.optional(StepDetailList),
  BootstrapActions: S.optional(BootstrapActionDetailList),
  SupportedProducts: S.optional(SupportedProductsList),
  VisibleToAllUsers: S.optional(S.Boolean),
  JobFlowRole: S.optional(S.String),
  ServiceRole: S.optional(S.String),
  AutoScalingRole: S.optional(S.String),
  ScaleDownBehavior: S.optional(S.String),
}) {}
export const JobFlowDetailList = S.Array(JobFlowDetail);
export class Step extends S.Class<Step>("Step")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Config: S.optional(HadoopStepConfig),
  ActionOnFailure: S.optional(S.String),
  Status: S.optional(StepStatus),
  ExecutionRoleArn: S.optional(S.String),
  LogUri: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
}) {}
export class InstanceFleet extends S.Class<InstanceFleet>("InstanceFleet")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(InstanceFleetStatus),
  InstanceFleetType: S.optional(S.String),
  TargetOnDemandCapacity: S.optional(S.Number),
  TargetSpotCapacity: S.optional(S.Number),
  ProvisionedOnDemandCapacity: S.optional(S.Number),
  ProvisionedSpotCapacity: S.optional(S.Number),
  InstanceTypeSpecifications: S.optional(InstanceTypeSpecificationList),
  LaunchSpecifications: S.optional(InstanceFleetProvisioningSpecifications),
  ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
  Context: S.optional(S.String),
}) {}
export const InstanceFleetList = S.Array(InstanceFleet);
export class Instance extends S.Class<Instance>("Instance")({
  Id: S.optional(S.String),
  Ec2InstanceId: S.optional(S.String),
  PublicDnsName: S.optional(S.String),
  PublicIpAddress: S.optional(S.String),
  PrivateDnsName: S.optional(S.String),
  PrivateIpAddress: S.optional(S.String),
  Status: S.optional(InstanceStatus),
  InstanceGroupId: S.optional(S.String),
  InstanceFleetId: S.optional(S.String),
  Market: S.optional(S.String),
  InstanceType: S.optional(S.String),
  EbsVolumes: S.optional(EbsVolumeList),
}) {}
export const InstanceList = S.Array(Instance);
export class AutoScalingPolicyStatus extends S.Class<AutoScalingPolicyStatus>(
  "AutoScalingPolicyStatus",
)({
  State: S.optional(S.String),
  StateChangeReason: S.optional(AutoScalingPolicyStateChangeReason),
}) {}
export class AddInstanceFleetInput extends S.Class<AddInstanceFleetInput>(
  "AddInstanceFleetInput",
)(
  { ClusterId: S.String, InstanceFleet: InstanceFleetConfig },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddInstanceGroupsInput extends S.Class<AddInstanceGroupsInput>(
  "AddInstanceGroupsInput",
)(
  { InstanceGroups: InstanceGroupConfigList, JobFlowId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddJobFlowStepsOutput extends S.Class<AddJobFlowStepsOutput>(
  "AddJobFlowStepsOutput",
)({ StepIds: S.optional(StepIdsList) }, ns) {}
export class DescribeClusterOutput extends S.Class<DescribeClusterOutput>(
  "DescribeClusterOutput",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class DescribeJobFlowsOutput extends S.Class<DescribeJobFlowsOutput>(
  "DescribeJobFlowsOutput",
)({ JobFlows: S.optional(JobFlowDetailList) }, ns) {}
export class DescribeStepOutput extends S.Class<DescribeStepOutput>(
  "DescribeStepOutput",
)({ Step: S.optional(Step) }, ns) {}
export class ListInstanceFleetsOutput extends S.Class<ListInstanceFleetsOutput>(
  "ListInstanceFleetsOutput",
)(
  {
    InstanceFleets: S.optional(InstanceFleetList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListInstancesOutput extends S.Class<ListInstancesOutput>(
  "ListInstancesOutput",
)({ Instances: S.optional(InstanceList), Marker: S.optional(S.String) }, ns) {}
export class RunJobFlowOutput extends S.Class<RunJobFlowOutput>(
  "RunJobFlowOutput",
)({ JobFlowId: S.optional(S.String), ClusterArn: S.optional(S.String) }, ns) {}
export class AutoScalingPolicyDescription extends S.Class<AutoScalingPolicyDescription>(
  "AutoScalingPolicyDescription",
)({
  Status: S.optional(AutoScalingPolicyStatus),
  Constraints: S.optional(ScalingConstraints),
  Rules: S.optional(ScalingRuleList),
}) {}
export const InstanceGroupIdsList = S.Array(S.String);
export class InstanceGroup extends S.Class<InstanceGroup>("InstanceGroup")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Market: S.optional(S.String),
  InstanceGroupType: S.optional(S.String),
  BidPrice: S.optional(S.String),
  InstanceType: S.optional(S.String),
  RequestedInstanceCount: S.optional(S.Number),
  RunningInstanceCount: S.optional(S.Number),
  Status: S.optional(InstanceGroupStatus),
  Configurations: S.optional(ConfigurationList),
  ConfigurationsVersion: S.optional(S.Number),
  LastSuccessfullyAppliedConfigurations: S.optional(ConfigurationList),
  LastSuccessfullyAppliedConfigurationsVersion: S.optional(S.Number),
  EbsBlockDevices: S.optional(EbsBlockDeviceList),
  EbsOptimized: S.optional(S.Boolean),
  ShrinkPolicy: S.optional(ShrinkPolicy),
  AutoScalingPolicy: S.optional(AutoScalingPolicyDescription),
  CustomAmiId: S.optional(S.String),
}) {}
export const InstanceGroupList = S.Array(InstanceGroup);
export class AddInstanceFleetOutput extends S.Class<AddInstanceFleetOutput>(
  "AddInstanceFleetOutput",
)(
  {
    ClusterId: S.optional(S.String),
    InstanceFleetId: S.optional(S.String),
    ClusterArn: S.optional(S.String),
  },
  ns,
) {}
export class AddInstanceGroupsOutput extends S.Class<AddInstanceGroupsOutput>(
  "AddInstanceGroupsOutput",
)(
  {
    JobFlowId: S.optional(S.String),
    InstanceGroupIds: S.optional(InstanceGroupIdsList),
    ClusterArn: S.optional(S.String),
  },
  ns,
) {}
export class ListInstanceGroupsOutput extends S.Class<ListInstanceGroupsOutput>(
  "ListInstanceGroupsOutput",
)(
  {
    InstanceGroups: S.optional(InstanceGroupList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class PutAutoScalingPolicyInput extends S.Class<PutAutoScalingPolicyInput>(
  "PutAutoScalingPolicyInput",
)(
  {
    ClusterId: S.String,
    InstanceGroupId: S.String,
    AutoScalingPolicy: AutoScalingPolicy,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAutoScalingPolicyOutput extends S.Class<PutAutoScalingPolicyOutput>(
  "PutAutoScalingPolicyOutput",
)(
  {
    ClusterId: S.optional(S.String),
    InstanceGroupId: S.optional(S.String),
    AutoScalingPolicy: S.optional(AutoScalingPolicyDescription),
    ClusterArn: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
  T.AwsQueryError({ code: "InternalFailure", httpResponseCode: 500 }),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}

//# Operations
/**
 * Removes an Amazon EMR Studio from the Studio metadata store.
 */
export const deleteStudio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStudioInput,
  output: DeleteStudioResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Removes a user or group from an Amazon EMR Studio.
 */
export const deleteStudioSessionMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStudioSessionMappingInput,
    output: DeleteStudioSessionMappingResponse,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Creates or updates an Amazon EMR block public access configuration for your
 * Amazon Web Services account in the current Region. For more information see Configure Block
 * Public Access for Amazon EMR in the Amazon EMR
 * Management Guide.
 */
export const putBlockPublicAccessConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutBlockPublicAccessConfigurationInput,
    output: PutBlockPublicAccessConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }));
/**
 * Removes an automatic scaling policy from a specified instance group within an Amazon EMR cluster.
 */
export const removeAutoScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveAutoScalingPolicyInput,
    output: RemoveAutoScalingPolicyOutput,
    errors: [],
  }),
);
/**
 * Removes an auto-termination policy from an Amazon EMR cluster.
 */
export const removeAutoTerminationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveAutoTerminationPolicyInput,
    output: RemoveAutoTerminationPolicyOutput,
    errors: [],
  }),
);
/**
 * Removes a managed scaling policy from a specified Amazon EMR cluster.
 */
export const removeManagedScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveManagedScalingPolicyInput,
    output: RemoveManagedScalingPolicyOutput,
    errors: [],
  }),
);
/**
 * Removes tags from an Amazon EMR resource, such as a cluster or Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping
 * clusters to track your Amazon EMR resource allocation costs. For more information,
 * see Tag
 * Clusters.
 *
 * The following example removes the stack tag with value Prod from a cluster:
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * You can use the `SetKeepJobFlowAliveWhenNoSteps` to configure a cluster (job flow) to terminate after the step execution, i.e., all your
 * steps are executed. If you want a transient cluster that shuts down after the last of the current executing steps are completed,
 * you can configure `SetKeepJobFlowAliveWhenNoSteps` to false. If you want a long running cluster, configure `SetKeepJobFlowAliveWhenNoSteps` to true.
 *
 * For more information, see Managing Cluster Termination in the *Amazon EMR Management Guide*.
 */
export const setKeepJobFlowAliveWhenNoSteps =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetKeepJobFlowAliveWhenNoStepsInput,
    output: SetKeepJobFlowAliveWhenNoStepsResponse,
    errors: [InternalServerError],
  }));
/**
 * SetTerminationProtection locks a cluster (job flow) so the Amazon EC2 instances
 * in the cluster cannot be terminated by user intervention, an API call, or in the event of a
 * job-flow error. The cluster still terminates upon successful completion of the job flow.
 * Calling `SetTerminationProtection` on a cluster is similar to calling the
 * Amazon EC2
 * `DisableAPITermination` API on all Amazon EC2 instances in a
 * cluster.
 *
 * `SetTerminationProtection` is used to prevent accidental termination of a
 * cluster and to ensure that in the event of an error, the instances persist so that you can
 * recover any data stored in their ephemeral instance storage.
 *
 * To terminate a cluster that has been locked by setting
 * `SetTerminationProtection` to `true`, you must first unlock the
 * job flow by a subsequent call to `SetTerminationProtection` in which you set the
 * value to `false`.
 *
 * For more information, see Managing Cluster
 * Termination in the *Amazon EMR Management Guide*.
 */
export const setTerminationProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetTerminationProtectionInput,
    output: SetTerminationProtectionResponse,
    errors: [InternalServerError],
  }),
);
/**
 * Specify whether to enable unhealthy node replacement, which lets Amazon EMR gracefully
 * replace core nodes on a cluster if any nodes become unhealthy. For example, a node becomes
 * unhealthy if disk usage is above 90%. If unhealthy node replacement is on and `TerminationProtected` are off,
 * Amazon EMR immediately terminates the unhealthy core nodes. To use unhealthy node replacement
 * and retain unhealthy core nodes, use to turn on
 * termination protection. In such cases, Amazon EMR adds
 * the unhealthy nodes to a denylist, reducing job interruptions and failures.
 *
 * If unhealthy node replacement is on, Amazon EMR
 * notifies YARN and other applications on the cluster to stop scheduling tasks
 * with these nodes, moves the data, and then terminates the nodes.
 *
 * For more information, see graceful
 * node replacement in the *Amazon EMR Management Guide*.
 */
export const setUnhealthyNodeReplacement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetUnhealthyNodeReplacementInput,
    output: SetUnhealthyNodeReplacementResponse,
    errors: [InternalServerError],
  }),
);
/**
 * The SetVisibleToAllUsers parameter is no longer supported. Your cluster may be
 * visible to all users in your account. To restrict cluster access using an IAM policy, see Identity and Access
 * Management for Amazon EMR.
 *
 * Sets the Cluster$VisibleToAllUsers value for an Amazon EMR
 * cluster. When `true`, IAM principals in the Amazon Web Services account can perform Amazon EMR cluster actions that their IAM policies allow. When `false`, only the IAM
 * principal that created the cluster and the Amazon Web Services account root user can perform
 * Amazon EMR actions on the cluster, regardless of IAM permissions
 * policies attached to other IAM principals.
 *
 * This action works on running clusters. When you create a cluster, use the RunJobFlowInput$VisibleToAllUsers parameter.
 *
 * For more information, see Understanding the Amazon EMR Cluster VisibleToAllUsers Setting in the
 * *Amazon EMR Management Guide*.
 */
export const setVisibleToAllUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetVisibleToAllUsersInput,
    output: SetVisibleToAllUsersResponse,
    errors: [InternalServerError],
  }),
);
/**
 * Stops a notebook execution.
 */
export const stopNotebookExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopNotebookExecutionInput,
    output: StopNotebookExecutionResponse,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * TerminateJobFlows shuts a list of clusters (job flows) down. When a job flow is shut
 * down, any step not yet completed is canceled and the Amazon EC2 instances on which
 * the cluster is running are stopped. Any log files not already saved are uploaded to Amazon S3 if a LogUri was specified when the cluster was created.
 *
 * The maximum number of clusters allowed is 10. The call to `TerminateJobFlows`
 * is asynchronous. Depending on the configuration of the cluster, it may take up to 1-5
 * minutes for the cluster to completely terminate and release allocated resources, such as
 * Amazon EC2 instances.
 */
export const terminateJobFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateJobFlowsInput,
  output: TerminateJobFlowsResponse,
  errors: [InternalServerError],
}));
/**
 * Updates an Amazon EMR Studio configuration, including attributes such as name,
 * description, and subnets.
 */
export const updateStudio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStudioInput,
  output: UpdateStudioResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates the session policy attached to the user or group for the specified Amazon EMR Studio.
 */
export const updateStudioSessionMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStudioSessionMappingInput,
    output: UpdateStudioSessionMappingResponse,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Adds tags to an Amazon EMR resource, such as a cluster or an Amazon EMR
 * Studio. Tags make it easier to associate resources in various ways, such as grouping
 * clusters to track your Amazon EMR resource allocation costs. For more information,
 * see Tag
 * Clusters.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a security configuration, which is stored in the service and can be specified
 * when a cluster is created.
 */
export const createSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityConfigurationInput,
    output: CreateSecurityConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Creates a new Amazon EMR Studio.
 */
export const createStudio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStudioInput,
  output: CreateStudioOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Maps a user or group to the Amazon EMR Studio specified by
 * `StudioId`, and applies a session policy to refine Studio permissions for that
 * user or group. Use `CreateStudioSessionMapping` to assign users to a Studio when
 * you use IAM Identity Center authentication. For instructions on how to assign users to a
 * Studio when you use IAM authentication, see Assign a user or group to your EMR Studio.
 */
export const createStudioSessionMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStudioSessionMappingInput,
    output: CreateStudioSessionMappingResponse,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Deletes a security configuration.
 */
export const deleteSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityConfigurationInput,
    output: DeleteSecurityConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Provides the details of a security configuration by returning the configuration
 * JSON.
 */
export const describeSecurityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSecurityConfigurationInput,
    output: DescribeSecurityConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }));
/**
 * Returns the auto-termination policy for an Amazon EMR cluster.
 */
export const getAutoTerminationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAutoTerminationPolicyInput,
    output: GetAutoTerminationPolicyOutput,
    errors: [],
  }),
);
/**
 * Fetches the attached managed scaling policy for an Amazon EMR cluster.
 */
export const getManagedScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetManagedScalingPolicyInput,
    output: GetManagedScalingPolicyOutput,
    errors: [],
  }),
);
/**
 * The presigned URL properties for the cluster's application user interface.
 */
export const getOnClusterAppUIPresignedURL =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOnClusterAppUIPresignedURLInput,
    output: GetOnClusterAppUIPresignedURLOutput,
    errors: [InternalServerError, InvalidRequestException],
  }));
/**
 * The presigned URL properties for the cluster's application user interface.
 */
export const getPersistentAppUIPresignedURL =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPersistentAppUIPresignedURLInput,
    output: GetPersistentAppUIPresignedURLOutput,
    errors: [InternalServerError, InvalidRequestException],
  }));
/**
 * Modifies the number of steps that can be executed concurrently for the cluster specified
 * using ClusterID.
 */
export const modifyCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterInput,
  output: ModifyClusterOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Modifies the target On-Demand and target Spot capacities for the instance fleet with the
 * specified InstanceFleetID within the cluster specified using ClusterID. The call either
 * succeeds or fails atomically.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions.
 */
export const modifyInstanceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyInstanceFleetInput,
  output: ModifyInstanceFleetResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Auto-termination is supported in Amazon EMR releases 5.30.0 and 6.1.0 and
 * later. For more information, see Using an
 * auto-termination policy.
 *
 * Creates or updates an auto-termination policy for an Amazon EMR cluster. An
 * auto-termination policy defines the amount of idle time in seconds after which a cluster
 * automatically terminates. For alternative cluster termination options, see Control
 * cluster termination.
 */
export const putAutoTerminationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAutoTerminationPolicyInput,
    output: PutAutoTerminationPolicyOutput,
    errors: [],
  }),
);
/**
 * Cancels a pending step or steps in a running cluster. Available only in Amazon EMR versions 4.8.0 and later, excluding version 5.0.0. A maximum of 256 steps are allowed in
 * each CancelSteps request. CancelSteps is idempotent but asynchronous; it does not guarantee
 * that a step will be canceled, even if the request is successfully submitted. When you use
 * Amazon EMR releases 5.28.0 and later, you can cancel steps that are in a
 * `PENDING` or `RUNNING` state. In earlier versions of Amazon EMR, you can only cancel steps that are in a `PENDING` state.
 */
export const cancelSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelStepsInput,
  output: CancelStepsOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Creates a persistent application user interface.
 */
export const createPersistentAppUI = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePersistentAppUIInput,
    output: CreatePersistentAppUIOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Describes a persistent application user interface.
 */
export const describePersistentAppUI = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePersistentAppUIInput,
    output: DescribePersistentAppUIOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Provides Amazon EMR release label details, such as the releases available the
 * Region where the API request is run, and the available applications for a specific Amazon EMR release label. Can also list Amazon EMR releases that support a
 * specified version of Spark.
 */
export const describeReleaseLabel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReleaseLabelInput,
    output: DescribeReleaseLabelOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Returns details for the specified Amazon EMR Studio including ID, Name, VPC,
 * Studio access URL, and so on.
 */
export const describeStudio = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStudioInput,
  output: DescribeStudioOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block
 * Public Access for Amazon EMR in the Amazon EMR
 * Management Guide.
 */
export const getBlockPublicAccessConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetBlockPublicAccessConfigurationInput,
    output: GetBlockPublicAccessConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }));
/**
 * Fetches mapping details for the specified Amazon EMR Studio and identity (user
 * or group).
 */
export const getStudioSessionMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetStudioSessionMappingInput,
    output: GetStudioSessionMappingOutput,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Provides information about the bootstrap actions associated with a cluster.
 */
export const listBootstrapActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBootstrapActionsInput,
    output: ListBootstrapActionsOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Provides the status of all clusters visible to this Amazon Web Services account. Allows
 * you to filter the list of clusters based on certain criteria; for example, filtering by
 * cluster creation date and time or by status. This call returns a maximum of 50 clusters in
 * unsorted order per call, but returns a marker to track the paging of the cluster list
 * across multiple ListClusters calls.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersInput,
  output: ListClustersOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Provides summaries of all notebook executions. You can filter the list based on multiple
 * criteria such as status, time range, and editor id. Returns a maximum of 50 notebook
 * executions and a marker to track the paging of a longer notebook execution list across
 * multiple `ListNotebookExecutions` calls.
 */
export const listNotebookExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNotebookExecutionsInput,
    output: ListNotebookExecutionsOutput,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Retrieves release labels of Amazon EMR services in the Region where the API is
 * called.
 */
export const listReleaseLabels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReleaseLabelsInput,
  output: ListReleaseLabelsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists all the security configurations visible to this account, providing their creation
 * dates and times, and their names. This call returns a maximum of 50 clusters per call, but
 * returns a marker to track the paging of the cluster list across multiple
 * ListSecurityConfigurations calls.
 */
export const listSecurityConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSecurityConfigurationsInput,
    output: ListSecurityConfigurationsOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Provides a list of steps for the cluster in reverse order unless you specify
 * `stepIds` with the request or filter by `StepStates`. You can
 * specify a maximum of 10 `stepIDs`. The CLI automatically
 * paginates results to return a list greater than 50 steps. To return more than 50 steps
 * using the CLI, specify a `Marker`, which is a pagination token
 * that indicates the next set of steps to retrieve.
 */
export const listSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStepsInput,
  output: ListStepsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns a list of all Amazon EMR Studios associated with the Amazon Web Services account. The list includes details such as ID, Studio Access URL, and
 * creation time for each Studio.
 */
export const listStudios = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStudiosInput,
  output: ListStudiosOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns a list of all user or group session mappings for the Amazon EMR Studio
 * specified by `StudioId`.
 */
export const listStudioSessionMappings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStudioSessionMappingsInput,
    output: ListStudioSessionMappingsOutput,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * A list of the instance types that Amazon EMR supports. You can filter the
 * list by Amazon Web Services Region and Amazon EMR release.
 */
export const listSupportedInstanceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSupportedInstanceTypesInput,
    output: ListSupportedInstanceTypesOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Creates or updates a managed scaling policy for an Amazon EMR cluster. The
 * managed scaling policy defines the limits for resources, such as Amazon EC2
 * instances that can be added or terminated from a cluster. The policy only applies to the
 * core and task nodes. The master node cannot be scaled after initial configuration.
 */
export const putManagedScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutManagedScalingPolicyInput,
    output: PutManagedScalingPolicyOutput,
    errors: [],
  }),
);
/**
 * Starts a notebook execution.
 */
export const startNotebookExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartNotebookExecutionInput,
    output: StartNotebookExecutionOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Provides details of a notebook execution.
 */
export const describeNotebookExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeNotebookExecutionInput,
    output: DescribeNotebookExecutionOutput,
    errors: [InternalServerError, InvalidRequestException],
  }),
);
/**
 * Provides temporary, HTTP basic credentials that are associated with a given runtime
 * IAM role and used by a cluster with fine-grained access control
 * activated. You can use these credentials to connect to cluster endpoints that support
 * username and password authentication.
 */
export const getClusterSessionCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetClusterSessionCredentialsInput,
    output: GetClusterSessionCredentialsOutput,
    errors: [InternalServerError, InvalidRequestException],
  }));
/**
 * ModifyInstanceGroups modifies the number of nodes and configuration settings of an
 * instance group. The input parameters include the new target instance count for the group
 * and the instance group ID. The call will either succeed or fail atomically.
 */
export const modifyInstanceGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyInstanceGroupsInput,
    output: ModifyInstanceGroupsResponse,
    errors: [InternalServerError],
  }),
);
/**
 * AddJobFlowSteps adds new steps to a running cluster. A maximum of 256 steps are allowed
 * in each job flow.
 *
 * If your cluster is long-running (such as a Hive data warehouse) or complex, you may
 * require more than 256 steps to process your data. You can bypass the 256-step limitation in
 * various ways, including using SSH to connect to the master node and submitting queries
 * directly to the software running on the master node, such as Hive and Hadoop.
 *
 * A step specifies the location of a JAR file stored either on the master node of the
 * cluster or in Amazon S3. Each step is performed by the main function of the main
 * class of the JAR file. The main class can be specified either in the manifest of the JAR or
 * by using the MainFunction parameter of the step.
 *
 * Amazon EMR executes each step in the order listed. For a step to be considered
 * complete, the main function must exit with a zero exit code and all Hadoop jobs started
 * while the step was running must have completed and run successfully.
 *
 * You can only add steps to a cluster that is in one of the following states: STARTING,
 * BOOTSTRAPPING, RUNNING, or WAITING.
 *
 * The string values passed into `HadoopJarStep` object cannot exceed a total
 * of 10240 characters.
 */
export const addJobFlowSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddJobFlowStepsInput,
  output: AddJobFlowStepsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides cluster-level details including status, hardware and software configuration,
 * VPC settings, and so on.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterInput,
  output: DescribeClusterOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * This API is no longer supported and will eventually be removed. We recommend you use
 * ListClusters, DescribeCluster, ListSteps, ListInstanceGroups and ListBootstrapActions instead.
 *
 * DescribeJobFlows returns a list of job flows that match all of the supplied parameters.
 * The parameters can include a list of job flow IDs, job flow states, and restrictions on job
 * flow creation date and time.
 *
 * Regardless of supplied parameters, only job flows created within the last two months are
 * returned.
 *
 * If no parameters are supplied, then job flows matching either of the following criteria
 * are returned:
 *
 * - Job flows created and completed in the last two weeks
 *
 * - Job flows created within the last two months that are in one of the following
 * states: `RUNNING`, `WAITING`, `SHUTTING_DOWN`,
 * `STARTING`
 *
 * Amazon EMR can return a maximum of 512 job flow descriptions.
 */
export const describeJobFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobFlowsInput,
  output: DescribeJobFlowsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides more detail about the cluster step.
 */
export const describeStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStepInput,
  output: DescribeStepOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists all available details about the instance fleets in a cluster.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions.
 */
export const listInstanceFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInstanceFleetsInput,
  output: ListInstanceFleetsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Provides information for all active Amazon EC2 instances and Amazon EC2
 * instances terminated in the last 30 days, up to a maximum of 2,000. Amazon EC2
 * instances in any of the following states are considered active: AWAITING_FULFILLMENT,
 * PROVISIONING, BOOTSTRAPPING, RUNNING.
 */
export const listInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInstancesInput,
  output: ListInstancesOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * RunJobFlow creates and starts running a new cluster (job flow). The cluster runs the
 * steps specified. After the steps complete, the cluster stops and the HDFS partition is
 * lost. To prevent loss of data, configure the last step of the job flow to store results in
 * Amazon S3. If the JobFlowInstancesConfig
 * `KeepJobFlowAliveWhenNoSteps` parameter is set to `TRUE`, the cluster
 * transitions to the WAITING state rather than shutting down after the steps have completed.
 *
 * For additional protection, you can set the JobFlowInstancesConfig
 * `TerminationProtected` parameter to `TRUE` to lock the cluster and
 * prevent it from being terminated by API call, user intervention, or in the event of a job
 * flow error.
 *
 * A maximum of 256 steps are allowed in each job flow.
 *
 * If your cluster is long-running (such as a Hive data warehouse) or complex, you may
 * require more than 256 steps to process your data. You can bypass the 256-step limitation in
 * various ways, including using the SSH shell to connect to the master node and submitting
 * queries directly to the software running on the master node, such as Hive and
 * Hadoop.
 *
 * For long-running clusters, we recommend that you periodically store your results.
 *
 * The instance fleets configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions. The RunJobFlow request can contain
 * InstanceFleets parameters or InstanceGroups parameters, but not both.
 */
export const runJobFlow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunJobFlowInput,
  output: RunJobFlowOutput,
  errors: [InternalServerError],
}));
/**
 * Adds an instance fleet to a running cluster.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x.
 */
export const addInstanceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddInstanceFleetInput,
  output: AddInstanceFleetOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Adds one or more instance groups to a running cluster.
 */
export const addInstanceGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddInstanceGroupsInput,
  output: AddInstanceGroupsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides all available details about the instance groups in a cluster.
 */
export const listInstanceGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInstanceGroupsInput,
  output: ListInstanceGroupsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates or updates an automatic scaling policy for a core instance group or task
 * instance group in an Amazon EMR cluster. The automatic scaling policy defines how
 * an instance group dynamically adds and terminates Amazon EC2 instances in response
 * to the value of a CloudWatch metric.
 */
export const putAutoScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAutoScalingPolicyInput,
    output: PutAutoScalingPolicyOutput,
    errors: [],
  }),
);
