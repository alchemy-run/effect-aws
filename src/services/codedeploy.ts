import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://codedeploy.amazonaws.com/doc/2014-10-06/");
const svc = T.AwsApiService({
  sdkId: "CodeDeploy",
  serviceShapeName: "CodeDeploy_20141006",
});
const auth = T.AwsAuthSigv4({ name: "codedeploy" });
const ver = T.ServiceVersion("2014-10-06");
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
                        url: "https://codedeploy-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://codedeploy-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codedeploy.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codedeploy.{Region}.{PartitionResult#dnsSuffix}",
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
export const InstanceNameList = S.Array(S.String);
export const ApplicationsList = S.Array(S.String);
export const DeploymentGroupsList = S.Array(S.String);
export const InstancesList = S.Array(S.String);
export const DeploymentsList = S.Array(S.String);
export const TargetIdList = S.Array(S.String);
export const AutoScalingGroupNameList = S.Array(S.String);
export const InstanceStatusList = S.Array(S.String);
export const InstanceTypeList = S.Array(S.String);
export const DeploymentStatusList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetApplicationsInput extends S.Class<BatchGetApplicationsInput>(
  "BatchGetApplicationsInput",
)(
  { applicationNames: ApplicationsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDeploymentGroupsInput extends S.Class<BatchGetDeploymentGroupsInput>(
  "BatchGetDeploymentGroupsInput",
)(
  { applicationName: S.String, deploymentGroupNames: DeploymentGroupsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDeploymentInstancesInput extends S.Class<BatchGetDeploymentInstancesInput>(
  "BatchGetDeploymentInstancesInput",
)(
  { deploymentId: S.String, instanceIds: InstancesList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDeploymentsInput extends S.Class<BatchGetDeploymentsInput>(
  "BatchGetDeploymentsInput",
)(
  { deploymentIds: DeploymentsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDeploymentTargetsInput extends S.Class<BatchGetDeploymentTargetsInput>(
  "BatchGetDeploymentTargetsInput",
)(
  { deploymentId: S.String, targetIds: TargetIdList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetOnPremisesInstancesInput extends S.Class<BatchGetOnPremisesInstancesInput>(
  "BatchGetOnPremisesInstancesInput",
)(
  { instanceNames: InstanceNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ContinueDeploymentInput extends S.Class<ContinueDeploymentInput>(
  "ContinueDeploymentInput",
)(
  {
    deploymentId: S.optional(S.String),
    deploymentWaitType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ContinueDeploymentResponse extends S.Class<ContinueDeploymentResponse>(
  "ContinueDeploymentResponse",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateApplicationInput extends S.Class<CreateApplicationInput>(
  "CreateApplicationInput",
)(
  {
    applicationName: S.String,
    computePlatform: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationInput extends S.Class<DeleteApplicationInput>(
  "DeleteApplicationInput",
)(
  { applicationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}, ns) {}
export class DeleteDeploymentConfigInput extends S.Class<DeleteDeploymentConfigInput>(
  "DeleteDeploymentConfigInput",
)(
  { deploymentConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeploymentConfigResponse extends S.Class<DeleteDeploymentConfigResponse>(
  "DeleteDeploymentConfigResponse",
)({}, ns) {}
export class DeleteDeploymentGroupInput extends S.Class<DeleteDeploymentGroupInput>(
  "DeleteDeploymentGroupInput",
)(
  { applicationName: S.String, deploymentGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGitHubAccountTokenInput extends S.Class<DeleteGitHubAccountTokenInput>(
  "DeleteGitHubAccountTokenInput",
)(
  { tokenName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcesByExternalIdInput extends S.Class<DeleteResourcesByExternalIdInput>(
  "DeleteResourcesByExternalIdInput",
)(
  { externalId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcesByExternalIdOutput extends S.Class<DeleteResourcesByExternalIdOutput>(
  "DeleteResourcesByExternalIdOutput",
)({}, ns) {}
export class DeregisterOnPremisesInstanceInput extends S.Class<DeregisterOnPremisesInstanceInput>(
  "DeregisterOnPremisesInstanceInput",
)(
  { instanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterOnPremisesInstanceResponse extends S.Class<DeregisterOnPremisesInstanceResponse>(
  "DeregisterOnPremisesInstanceResponse",
)({}, ns) {}
export class GetApplicationInput extends S.Class<GetApplicationInput>(
  "GetApplicationInput",
)(
  { applicationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.optional(S.String),
  key: S.optional(S.String),
  bundleType: S.optional(S.String),
  version: S.optional(S.String),
  eTag: S.optional(S.String),
}) {}
export class GitHubLocation extends S.Class<GitHubLocation>("GitHubLocation")({
  repository: S.optional(S.String),
  commitId: S.optional(S.String),
}) {}
export class RawString extends S.Class<RawString>("RawString")({
  content: S.optional(S.String),
  sha256: S.optional(S.String),
}) {}
export class AppSpecContent extends S.Class<AppSpecContent>("AppSpecContent")({
  content: S.optional(S.String),
  sha256: S.optional(S.String),
}) {}
export class RevisionLocation extends S.Class<RevisionLocation>(
  "RevisionLocation",
)({
  revisionType: S.optional(S.String),
  s3Location: S.optional(S3Location),
  gitHubLocation: S.optional(GitHubLocation),
  string: S.optional(RawString),
  appSpecContent: S.optional(AppSpecContent),
}) {}
export class GetApplicationRevisionInput extends S.Class<GetApplicationRevisionInput>(
  "GetApplicationRevisionInput",
)(
  { applicationName: S.String, revision: RevisionLocation },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentInput extends S.Class<GetDeploymentInput>(
  "GetDeploymentInput",
)(
  { deploymentId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentConfigInput extends S.Class<GetDeploymentConfigInput>(
  "GetDeploymentConfigInput",
)(
  { deploymentConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentGroupInput extends S.Class<GetDeploymentGroupInput>(
  "GetDeploymentGroupInput",
)(
  { applicationName: S.String, deploymentGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentInstanceInput extends S.Class<GetDeploymentInstanceInput>(
  "GetDeploymentInstanceInput",
)(
  { deploymentId: S.String, instanceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentTargetInput extends S.Class<GetDeploymentTargetInput>(
  "GetDeploymentTargetInput",
)(
  { deploymentId: S.String, targetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOnPremisesInstanceInput extends S.Class<GetOnPremisesInstanceInput>(
  "GetOnPremisesInstanceInput",
)(
  { instanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationRevisionsInput extends S.Class<ListApplicationRevisionsInput>(
  "ListApplicationRevisionsInput",
)(
  {
    applicationName: S.String,
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    s3Bucket: S.optional(S.String),
    s3KeyPrefix: S.optional(S.String),
    deployed: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationsInput extends S.Class<ListApplicationsInput>(
  "ListApplicationsInput",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeploymentConfigsInput extends S.Class<ListDeploymentConfigsInput>(
  "ListDeploymentConfigsInput",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeploymentGroupsInput extends S.Class<ListDeploymentGroupsInput>(
  "ListDeploymentGroupsInput",
)(
  { applicationName: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeploymentInstancesInput extends S.Class<ListDeploymentInstancesInput>(
  "ListDeploymentInstancesInput",
)(
  {
    deploymentId: S.String,
    nextToken: S.optional(S.String),
    instanceStatusFilter: S.optional(InstanceStatusList),
    instanceTypeFilter: S.optional(InstanceTypeList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGitHubAccountTokenNamesInput extends S.Class<ListGitHubAccountTokenNamesInput>(
  "ListGitHubAccountTokenNamesInput",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const TagFilterList = S.Array(TagFilter);
export class ListOnPremisesInstancesInput extends S.Class<ListOnPremisesInstancesInput>(
  "ListOnPremisesInstancesInput",
)(
  {
    registrationStatus: S.optional(S.String),
    tagFilters: S.optional(TagFilterList),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceArn: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLifecycleEventHookExecutionStatusInput extends S.Class<PutLifecycleEventHookExecutionStatusInput>(
  "PutLifecycleEventHookExecutionStatusInput",
)(
  {
    deploymentId: S.optional(S.String),
    lifecycleEventHookExecutionId: S.optional(S.String),
    status: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterApplicationRevisionInput extends S.Class<RegisterApplicationRevisionInput>(
  "RegisterApplicationRevisionInput",
)(
  {
    applicationName: S.String,
    description: S.optional(S.String),
    revision: RevisionLocation,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterApplicationRevisionResponse extends S.Class<RegisterApplicationRevisionResponse>(
  "RegisterApplicationRevisionResponse",
)({}, ns) {}
export class RegisterOnPremisesInstanceInput extends S.Class<RegisterOnPremisesInstanceInput>(
  "RegisterOnPremisesInstanceInput",
)(
  {
    instanceName: S.String,
    iamSessionArn: S.optional(S.String),
    iamUserArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterOnPremisesInstanceResponse extends S.Class<RegisterOnPremisesInstanceResponse>(
  "RegisterOnPremisesInstanceResponse",
)({}, ns) {}
export class RemoveTagsFromOnPremisesInstancesInput extends S.Class<RemoveTagsFromOnPremisesInstancesInput>(
  "RemoveTagsFromOnPremisesInstancesInput",
)(
  { tags: TagList, instanceNames: InstanceNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromOnPremisesInstancesResponse extends S.Class<RemoveTagsFromOnPremisesInstancesResponse>(
  "RemoveTagsFromOnPremisesInstancesResponse",
)({}, ns) {}
export class SkipWaitTimeForInstanceTerminationInput extends S.Class<SkipWaitTimeForInstanceTerminationInput>(
  "SkipWaitTimeForInstanceTerminationInput",
)(
  { deploymentId: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SkipWaitTimeForInstanceTerminationResponse extends S.Class<SkipWaitTimeForInstanceTerminationResponse>(
  "SkipWaitTimeForInstanceTerminationResponse",
)({}, ns) {}
export class StopDeploymentInput extends S.Class<StopDeploymentInput>(
  "StopDeploymentInput",
)(
  { deploymentId: S.String, autoRollbackEnabled: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}, ns) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}, ns) {}
export class UpdateApplicationInput extends S.Class<UpdateApplicationInput>(
  "UpdateApplicationInput",
)(
  {
    applicationName: S.optional(S.String),
    newApplicationName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({}, ns) {}
export class EC2TagFilter extends S.Class<EC2TagFilter>("EC2TagFilter")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const EC2TagFilterList = S.Array(EC2TagFilter);
export const TriggerEventTypeList = S.Array(S.String);
export class TriggerConfig extends S.Class<TriggerConfig>("TriggerConfig")({
  triggerName: S.optional(S.String),
  triggerTargetArn: S.optional(S.String),
  triggerEvents: S.optional(TriggerEventTypeList),
}) {}
export const TriggerConfigList = S.Array(TriggerConfig);
export class Alarm extends S.Class<Alarm>("Alarm")({
  name: S.optional(S.String),
}) {}
export const AlarmList = S.Array(Alarm);
export class AlarmConfiguration extends S.Class<AlarmConfiguration>(
  "AlarmConfiguration",
)({
  enabled: S.optional(S.Boolean),
  ignorePollAlarmFailure: S.optional(S.Boolean),
  alarms: S.optional(AlarmList),
}) {}
export const AutoRollbackEventsList = S.Array(S.String);
export class AutoRollbackConfiguration extends S.Class<AutoRollbackConfiguration>(
  "AutoRollbackConfiguration",
)({
  enabled: S.optional(S.Boolean),
  events: S.optional(AutoRollbackEventsList),
}) {}
export class DeploymentStyle extends S.Class<DeploymentStyle>(
  "DeploymentStyle",
)({
  deploymentType: S.optional(S.String),
  deploymentOption: S.optional(S.String),
}) {}
export class BlueInstanceTerminationOption extends S.Class<BlueInstanceTerminationOption>(
  "BlueInstanceTerminationOption",
)({
  action: S.optional(S.String),
  terminationWaitTimeInMinutes: S.optional(S.Number),
}) {}
export class DeploymentReadyOption extends S.Class<DeploymentReadyOption>(
  "DeploymentReadyOption",
)({
  actionOnTimeout: S.optional(S.String),
  waitTimeInMinutes: S.optional(S.Number),
}) {}
export class GreenFleetProvisioningOption extends S.Class<GreenFleetProvisioningOption>(
  "GreenFleetProvisioningOption",
)({ action: S.optional(S.String) }) {}
export class BlueGreenDeploymentConfiguration extends S.Class<BlueGreenDeploymentConfiguration>(
  "BlueGreenDeploymentConfiguration",
)({
  terminateBlueInstancesOnDeploymentSuccess: S.optional(
    BlueInstanceTerminationOption,
  ),
  deploymentReadyOption: S.optional(DeploymentReadyOption),
  greenFleetProvisioningOption: S.optional(GreenFleetProvisioningOption),
}) {}
export class ELBInfo extends S.Class<ELBInfo>("ELBInfo")({
  name: S.optional(S.String),
}) {}
export const ELBInfoList = S.Array(ELBInfo);
export class TargetGroupInfo extends S.Class<TargetGroupInfo>(
  "TargetGroupInfo",
)({ name: S.optional(S.String) }) {}
export const TargetGroupInfoList = S.Array(TargetGroupInfo);
export const ListenerArnList = S.Array(S.String);
export class TrafficRoute extends S.Class<TrafficRoute>("TrafficRoute")({
  listenerArns: S.optional(ListenerArnList),
}) {}
export class TargetGroupPairInfo extends S.Class<TargetGroupPairInfo>(
  "TargetGroupPairInfo",
)({
  targetGroups: S.optional(TargetGroupInfoList),
  prodTrafficRoute: S.optional(TrafficRoute),
  testTrafficRoute: S.optional(TrafficRoute),
}) {}
export const TargetGroupPairInfoList = S.Array(TargetGroupPairInfo);
export class LoadBalancerInfo extends S.Class<LoadBalancerInfo>(
  "LoadBalancerInfo",
)({
  elbInfoList: S.optional(ELBInfoList),
  targetGroupInfoList: S.optional(TargetGroupInfoList),
  targetGroupPairInfoList: S.optional(TargetGroupPairInfoList),
}) {}
export const EC2TagSetList = S.Array(EC2TagFilterList);
export class EC2TagSet extends S.Class<EC2TagSet>("EC2TagSet")({
  ec2TagSetList: S.optional(EC2TagSetList),
}) {}
export class ECSService extends S.Class<ECSService>("ECSService")({
  serviceName: S.optional(S.String),
  clusterName: S.optional(S.String),
}) {}
export const ECSServiceList = S.Array(ECSService);
export const OnPremisesTagSetList = S.Array(TagFilterList);
export class OnPremisesTagSet extends S.Class<OnPremisesTagSet>(
  "OnPremisesTagSet",
)({ onPremisesTagSetList: S.optional(OnPremisesTagSetList) }) {}
export class UpdateDeploymentGroupInput extends S.Class<UpdateDeploymentGroupInput>(
  "UpdateDeploymentGroupInput",
)(
  {
    applicationName: S.String,
    currentDeploymentGroupName: S.String,
    newDeploymentGroupName: S.optional(S.String),
    deploymentConfigName: S.optional(S.String),
    ec2TagFilters: S.optional(EC2TagFilterList),
    onPremisesInstanceTagFilters: S.optional(TagFilterList),
    autoScalingGroups: S.optional(AutoScalingGroupNameList),
    serviceRoleArn: S.optional(S.String),
    triggerConfigurations: S.optional(TriggerConfigList),
    alarmConfiguration: S.optional(AlarmConfiguration),
    autoRollbackConfiguration: S.optional(AutoRollbackConfiguration),
    outdatedInstancesStrategy: S.optional(S.String),
    deploymentStyle: S.optional(DeploymentStyle),
    blueGreenDeploymentConfiguration: S.optional(
      BlueGreenDeploymentConfiguration,
    ),
    loadBalancerInfo: S.optional(LoadBalancerInfo),
    ec2TagSet: S.optional(EC2TagSet),
    ecsServices: S.optional(ECSServiceList),
    onPremisesTagSet: S.optional(OnPremisesTagSet),
    terminationHookEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValueList = S.Array(S.String);
export class TargetInstances extends S.Class<TargetInstances>(
  "TargetInstances",
)({
  tagFilters: S.optional(EC2TagFilterList),
  autoScalingGroups: S.optional(AutoScalingGroupNameList),
  ec2TagSet: S.optional(EC2TagSet),
}) {}
export class MinimumHealthyHosts extends S.Class<MinimumHealthyHosts>(
  "MinimumHealthyHosts",
)({ type: S.optional(S.String), value: S.optional(S.Number) }) {}
export const DeploymentConfigsList = S.Array(S.String);
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TargetFilters = S.Record({
  key: S.String,
  value: FilterValueList,
});
export const GitHubAccountTokenNameList = S.Array(S.String);
export class AddTagsToOnPremisesInstancesInput extends S.Class<AddTagsToOnPremisesInstancesInput>(
  "AddTagsToOnPremisesInstancesInput",
)(
  { tags: TagList, instanceNames: InstanceNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsToOnPremisesInstancesResponse extends S.Class<AddTagsToOnPremisesInstancesResponse>(
  "AddTagsToOnPremisesInstancesResponse",
)({}, ns) {}
export class CreateApplicationOutput extends S.Class<CreateApplicationOutput>(
  "CreateApplicationOutput",
)({ applicationId: S.optional(S.String) }, ns) {}
export class DeleteGitHubAccountTokenOutput extends S.Class<DeleteGitHubAccountTokenOutput>(
  "DeleteGitHubAccountTokenOutput",
)({ tokenName: S.optional(S.String) }, ns) {}
export class ApplicationInfo extends S.Class<ApplicationInfo>(
  "ApplicationInfo",
)({
  applicationId: S.optional(S.String),
  applicationName: S.optional(S.String),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  linkedToGitHub: S.optional(S.Boolean),
  gitHubAccountName: S.optional(S.String),
  computePlatform: S.optional(S.String),
}) {}
export class GetApplicationOutput extends S.Class<GetApplicationOutput>(
  "GetApplicationOutput",
)({ application: S.optional(ApplicationInfo) }, ns) {}
export class ErrorInformation extends S.Class<ErrorInformation>(
  "ErrorInformation",
)({ code: S.optional(S.String), message: S.optional(S.String) }) {}
export class DeploymentOverview extends S.Class<DeploymentOverview>(
  "DeploymentOverview",
)({
  Pending: S.optional(S.Number),
  InProgress: S.optional(S.Number),
  Succeeded: S.optional(S.Number),
  Failed: S.optional(S.Number),
  Skipped: S.optional(S.Number),
  Ready: S.optional(S.Number),
}) {}
export class RollbackInfo extends S.Class<RollbackInfo>("RollbackInfo")({
  rollbackDeploymentId: S.optional(S.String),
  rollbackTriggeringDeploymentId: S.optional(S.String),
  rollbackMessage: S.optional(S.String),
}) {}
export const DeploymentStatusMessageList = S.Array(S.String);
export class RelatedDeployments extends S.Class<RelatedDeployments>(
  "RelatedDeployments",
)({
  autoUpdateOutdatedInstancesRootDeploymentId: S.optional(S.String),
  autoUpdateOutdatedInstancesDeploymentIds: S.optional(DeploymentsList),
}) {}
export class DeploymentInfo extends S.Class<DeploymentInfo>("DeploymentInfo")({
  applicationName: S.optional(S.String),
  deploymentGroupName: S.optional(S.String),
  deploymentConfigName: S.optional(S.String),
  deploymentId: S.optional(S.String),
  previousRevision: S.optional(RevisionLocation),
  revision: S.optional(RevisionLocation),
  status: S.optional(S.String),
  errorInformation: S.optional(ErrorInformation),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completeTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deploymentOverview: S.optional(DeploymentOverview),
  description: S.optional(S.String),
  creator: S.optional(S.String),
  ignoreApplicationStopFailures: S.optional(S.Boolean),
  autoRollbackConfiguration: S.optional(AutoRollbackConfiguration),
  updateOutdatedInstancesOnly: S.optional(S.Boolean),
  rollbackInfo: S.optional(RollbackInfo),
  deploymentStyle: S.optional(DeploymentStyle),
  targetInstances: S.optional(TargetInstances),
  instanceTerminationWaitTimeStarted: S.optional(S.Boolean),
  blueGreenDeploymentConfiguration: S.optional(
    BlueGreenDeploymentConfiguration,
  ),
  loadBalancerInfo: S.optional(LoadBalancerInfo),
  additionalDeploymentStatusInfo: S.optional(S.String),
  fileExistsBehavior: S.optional(S.String),
  deploymentStatusMessages: S.optional(DeploymentStatusMessageList),
  computePlatform: S.optional(S.String),
  externalId: S.optional(S.String),
  relatedDeployments: S.optional(RelatedDeployments),
  overrideAlarmConfiguration: S.optional(AlarmConfiguration),
}) {}
export class GetDeploymentOutput extends S.Class<GetDeploymentOutput>(
  "GetDeploymentOutput",
)({ deploymentInfo: S.optional(DeploymentInfo) }, ns) {}
export class AutoScalingGroup extends S.Class<AutoScalingGroup>(
  "AutoScalingGroup",
)({
  name: S.optional(S.String),
  hook: S.optional(S.String),
  terminationHook: S.optional(S.String),
}) {}
export const AutoScalingGroupList = S.Array(AutoScalingGroup);
export class LastDeploymentInfo extends S.Class<LastDeploymentInfo>(
  "LastDeploymentInfo",
)({
  deploymentId: S.optional(S.String),
  status: S.optional(S.String),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeploymentGroupInfo extends S.Class<DeploymentGroupInfo>(
  "DeploymentGroupInfo",
)({
  applicationName: S.optional(S.String),
  deploymentGroupId: S.optional(S.String),
  deploymentGroupName: S.optional(S.String),
  deploymentConfigName: S.optional(S.String),
  ec2TagFilters: S.optional(EC2TagFilterList),
  onPremisesInstanceTagFilters: S.optional(TagFilterList),
  autoScalingGroups: S.optional(AutoScalingGroupList),
  serviceRoleArn: S.optional(S.String),
  targetRevision: S.optional(RevisionLocation),
  triggerConfigurations: S.optional(TriggerConfigList),
  alarmConfiguration: S.optional(AlarmConfiguration),
  autoRollbackConfiguration: S.optional(AutoRollbackConfiguration),
  deploymentStyle: S.optional(DeploymentStyle),
  outdatedInstancesStrategy: S.optional(S.String),
  blueGreenDeploymentConfiguration: S.optional(
    BlueGreenDeploymentConfiguration,
  ),
  loadBalancerInfo: S.optional(LoadBalancerInfo),
  lastSuccessfulDeployment: S.optional(LastDeploymentInfo),
  lastAttemptedDeployment: S.optional(LastDeploymentInfo),
  ec2TagSet: S.optional(EC2TagSet),
  onPremisesTagSet: S.optional(OnPremisesTagSet),
  computePlatform: S.optional(S.String),
  ecsServices: S.optional(ECSServiceList),
  terminationHookEnabled: S.optional(S.Boolean),
}) {}
export class GetDeploymentGroupOutput extends S.Class<GetDeploymentGroupOutput>(
  "GetDeploymentGroupOutput",
)({ deploymentGroupInfo: S.optional(DeploymentGroupInfo) }, ns) {}
export class Diagnostics extends S.Class<Diagnostics>("Diagnostics")({
  errorCode: S.optional(S.String),
  scriptName: S.optional(S.String),
  message: S.optional(S.String),
  logTail: S.optional(S.String),
}) {}
export class LifecycleEvent extends S.Class<LifecycleEvent>("LifecycleEvent")({
  lifecycleEventName: S.optional(S.String),
  diagnostics: S.optional(Diagnostics),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
}) {}
export const LifecycleEventList = S.Array(LifecycleEvent);
export class InstanceSummary extends S.Class<InstanceSummary>(
  "InstanceSummary",
)({
  deploymentId: S.optional(S.String),
  instanceId: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleEvents: S.optional(LifecycleEventList),
  instanceType: S.optional(S.String),
}) {}
export class GetDeploymentInstanceOutput extends S.Class<GetDeploymentInstanceOutput>(
  "GetDeploymentInstanceOutput",
)({ instanceSummary: S.optional(InstanceSummary) }, ns) {}
export class InstanceTarget extends S.Class<InstanceTarget>("InstanceTarget")({
  deploymentId: S.optional(S.String),
  targetId: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleEvents: S.optional(LifecycleEventList),
  instanceLabel: S.optional(S.String),
}) {}
export class LambdaFunctionInfo extends S.Class<LambdaFunctionInfo>(
  "LambdaFunctionInfo",
)({
  functionName: S.optional(S.String),
  functionAlias: S.optional(S.String),
  currentVersion: S.optional(S.String),
  targetVersion: S.optional(S.String),
  targetVersionWeight: S.optional(S.Number),
}) {}
export class LambdaTarget extends S.Class<LambdaTarget>("LambdaTarget")({
  deploymentId: S.optional(S.String),
  targetId: S.optional(S.String),
  targetArn: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleEvents: S.optional(LifecycleEventList),
  lambdaFunctionInfo: S.optional(LambdaFunctionInfo),
}) {}
export class ECSTaskSet extends S.Class<ECSTaskSet>("ECSTaskSet")({
  identifer: S.optional(S.String),
  desiredCount: S.optional(S.Number),
  pendingCount: S.optional(S.Number),
  runningCount: S.optional(S.Number),
  status: S.optional(S.String),
  trafficWeight: S.optional(S.Number),
  targetGroup: S.optional(TargetGroupInfo),
  taskSetLabel: S.optional(S.String),
}) {}
export const ECSTaskSetList = S.Array(ECSTaskSet);
export class ECSTarget extends S.Class<ECSTarget>("ECSTarget")({
  deploymentId: S.optional(S.String),
  targetId: S.optional(S.String),
  targetArn: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleEvents: S.optional(LifecycleEventList),
  status: S.optional(S.String),
  taskSetsInfo: S.optional(ECSTaskSetList),
}) {}
export class CloudFormationTarget extends S.Class<CloudFormationTarget>(
  "CloudFormationTarget",
)({
  deploymentId: S.optional(S.String),
  targetId: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleEvents: S.optional(LifecycleEventList),
  status: S.optional(S.String),
  resourceType: S.optional(S.String),
  targetVersionWeight: S.optional(S.Number),
}) {}
export class DeploymentTarget extends S.Class<DeploymentTarget>(
  "DeploymentTarget",
)({
  deploymentTargetType: S.optional(S.String),
  instanceTarget: S.optional(InstanceTarget),
  lambdaTarget: S.optional(LambdaTarget),
  ecsTarget: S.optional(ECSTarget),
  cloudFormationTarget: S.optional(CloudFormationTarget),
}) {}
export class GetDeploymentTargetOutput extends S.Class<GetDeploymentTargetOutput>(
  "GetDeploymentTargetOutput",
)({ deploymentTarget: S.optional(DeploymentTarget) }, ns) {}
export class InstanceInfo extends S.Class<InstanceInfo>("InstanceInfo")({
  instanceName: S.optional(S.String),
  iamSessionArn: S.optional(S.String),
  iamUserArn: S.optional(S.String),
  instanceArn: S.optional(S.String),
  registerTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deregisterTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagList),
}) {}
export class GetOnPremisesInstanceOutput extends S.Class<GetOnPremisesInstanceOutput>(
  "GetOnPremisesInstanceOutput",
)({ instanceInfo: S.optional(InstanceInfo) }, ns) {}
export const RevisionLocationList = S.Array(RevisionLocation);
export class ListApplicationRevisionsOutput extends S.Class<ListApplicationRevisionsOutput>(
  "ListApplicationRevisionsOutput",
)(
  {
    revisions: S.optional(RevisionLocationList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListApplicationsOutput extends S.Class<ListApplicationsOutput>(
  "ListApplicationsOutput",
)(
  {
    applications: S.optional(ApplicationsList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDeploymentConfigsOutput extends S.Class<ListDeploymentConfigsOutput>(
  "ListDeploymentConfigsOutput",
)(
  {
    deploymentConfigsList: S.optional(DeploymentConfigsList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDeploymentGroupsOutput extends S.Class<ListDeploymentGroupsOutput>(
  "ListDeploymentGroupsOutput",
)(
  {
    applicationName: S.optional(S.String),
    deploymentGroups: S.optional(DeploymentGroupsList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDeploymentInstancesOutput extends S.Class<ListDeploymentInstancesOutput>(
  "ListDeploymentInstancesOutput",
)(
  { instancesList: S.optional(InstancesList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListDeploymentsInput extends S.Class<ListDeploymentsInput>(
  "ListDeploymentsInput",
)(
  {
    applicationName: S.optional(S.String),
    deploymentGroupName: S.optional(S.String),
    externalId: S.optional(S.String),
    includeOnlyStatuses: S.optional(DeploymentStatusList),
    createTimeRange: S.optional(TimeRange),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeploymentTargetsInput extends S.Class<ListDeploymentTargetsInput>(
  "ListDeploymentTargetsInput",
)(
  {
    deploymentId: S.String,
    nextToken: S.optional(S.String),
    targetFilters: S.optional(TargetFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGitHubAccountTokenNamesOutput extends S.Class<ListGitHubAccountTokenNamesOutput>(
  "ListGitHubAccountTokenNamesOutput",
)(
  {
    tokenNameList: S.optional(GitHubAccountTokenNameList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListOnPremisesInstancesOutput extends S.Class<ListOnPremisesInstancesOutput>(
  "ListOnPremisesInstancesOutput",
)(
  {
    instanceNames: S.optional(InstanceNameList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }, ns) {}
export class PutLifecycleEventHookExecutionStatusOutput extends S.Class<PutLifecycleEventHookExecutionStatusOutput>(
  "PutLifecycleEventHookExecutionStatusOutput",
)({ lifecycleEventHookExecutionId: S.optional(S.String) }, ns) {}
export class StopDeploymentOutput extends S.Class<StopDeploymentOutput>(
  "StopDeploymentOutput",
)({ status: S.optional(S.String), statusMessage: S.optional(S.String) }, ns) {}
export class UpdateDeploymentGroupOutput extends S.Class<UpdateDeploymentGroupOutput>(
  "UpdateDeploymentGroupOutput",
)({ hooksNotCleanedUp: S.optional(AutoScalingGroupList) }, ns) {}
export class TimeBasedCanary extends S.Class<TimeBasedCanary>(
  "TimeBasedCanary",
)({
  canaryPercentage: S.optional(S.Number),
  canaryInterval: S.optional(S.Number),
}) {}
export class TimeBasedLinear extends S.Class<TimeBasedLinear>(
  "TimeBasedLinear",
)({
  linearPercentage: S.optional(S.Number),
  linearInterval: S.optional(S.Number),
}) {}
export class MinimumHealthyHostsPerZone extends S.Class<MinimumHealthyHostsPerZone>(
  "MinimumHealthyHostsPerZone",
)({ type: S.optional(S.String), value: S.optional(S.Number) }) {}
export const ApplicationsInfoList = S.Array(ApplicationInfo);
export const InstanceInfoList = S.Array(InstanceInfo);
export class TrafficRoutingConfig extends S.Class<TrafficRoutingConfig>(
  "TrafficRoutingConfig",
)({
  type: S.optional(S.String),
  timeBasedCanary: S.optional(TimeBasedCanary),
  timeBasedLinear: S.optional(TimeBasedLinear),
}) {}
export class ZonalConfig extends S.Class<ZonalConfig>("ZonalConfig")({
  firstZoneMonitorDurationInSeconds: S.optional(S.Number),
  monitorDurationInSeconds: S.optional(S.Number),
  minimumHealthyHostsPerZone: S.optional(MinimumHealthyHostsPerZone),
}) {}
export class GenericRevisionInfo extends S.Class<GenericRevisionInfo>(
  "GenericRevisionInfo",
)({
  description: S.optional(S.String),
  deploymentGroups: S.optional(DeploymentGroupsList),
  firstUsedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUsedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  registerTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeploymentConfigInfo extends S.Class<DeploymentConfigInfo>(
  "DeploymentConfigInfo",
)({
  deploymentConfigId: S.optional(S.String),
  deploymentConfigName: S.optional(S.String),
  minimumHealthyHosts: S.optional(MinimumHealthyHosts),
  createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  computePlatform: S.optional(S.String),
  trafficRoutingConfig: S.optional(TrafficRoutingConfig),
  zonalConfig: S.optional(ZonalConfig),
}) {}
export class BatchGetApplicationRevisionsInput extends S.Class<BatchGetApplicationRevisionsInput>(
  "BatchGetApplicationRevisionsInput",
)(
  { applicationName: S.String, revisions: RevisionLocationList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetApplicationsOutput extends S.Class<BatchGetApplicationsOutput>(
  "BatchGetApplicationsOutput",
)({ applicationsInfo: S.optional(ApplicationsInfoList) }, ns) {}
export class BatchGetOnPremisesInstancesOutput extends S.Class<BatchGetOnPremisesInstancesOutput>(
  "BatchGetOnPremisesInstancesOutput",
)({ instanceInfos: S.optional(InstanceInfoList) }, ns) {}
export class CreateDeploymentInput extends S.Class<CreateDeploymentInput>(
  "CreateDeploymentInput",
)(
  {
    applicationName: S.String,
    deploymentGroupName: S.optional(S.String),
    revision: S.optional(RevisionLocation),
    deploymentConfigName: S.optional(S.String),
    description: S.optional(S.String),
    ignoreApplicationStopFailures: S.optional(S.Boolean),
    targetInstances: S.optional(TargetInstances),
    autoRollbackConfiguration: S.optional(AutoRollbackConfiguration),
    updateOutdatedInstancesOnly: S.optional(S.Boolean),
    fileExistsBehavior: S.optional(S.String),
    overrideAlarmConfiguration: S.optional(AlarmConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDeploymentConfigInput extends S.Class<CreateDeploymentConfigInput>(
  "CreateDeploymentConfigInput",
)(
  {
    deploymentConfigName: S.String,
    minimumHealthyHosts: S.optional(MinimumHealthyHosts),
    trafficRoutingConfig: S.optional(TrafficRoutingConfig),
    computePlatform: S.optional(S.String),
    zonalConfig: S.optional(ZonalConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeploymentGroupOutput extends S.Class<DeleteDeploymentGroupOutput>(
  "DeleteDeploymentGroupOutput",
)({ hooksNotCleanedUp: S.optional(AutoScalingGroupList) }, ns) {}
export class GetApplicationRevisionOutput extends S.Class<GetApplicationRevisionOutput>(
  "GetApplicationRevisionOutput",
)(
  {
    applicationName: S.optional(S.String),
    revision: S.optional(RevisionLocation),
    revisionInfo: S.optional(GenericRevisionInfo),
  },
  ns,
) {}
export class GetDeploymentConfigOutput extends S.Class<GetDeploymentConfigOutput>(
  "GetDeploymentConfigOutput",
)({ deploymentConfigInfo: S.optional(DeploymentConfigInfo) }, ns) {}
export class ListDeploymentsOutput extends S.Class<ListDeploymentsOutput>(
  "ListDeploymentsOutput",
)(
  { deployments: S.optional(DeploymentsList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListDeploymentTargetsOutput extends S.Class<ListDeploymentTargetsOutput>(
  "ListDeploymentTargetsOutput",
)(
  { targetIds: S.optional(TargetIdList), nextToken: S.optional(S.String) },
  ns,
) {}
export const DeploymentGroupInfoList = S.Array(DeploymentGroupInfo);
export const DeploymentsInfoList = S.Array(DeploymentInfo);
export class BatchGetDeploymentGroupsOutput extends S.Class<BatchGetDeploymentGroupsOutput>(
  "BatchGetDeploymentGroupsOutput",
)(
  {
    deploymentGroupsInfo: S.optional(DeploymentGroupInfoList),
    errorMessage: S.optional(S.String),
  },
  ns,
) {}
export class BatchGetDeploymentsOutput extends S.Class<BatchGetDeploymentsOutput>(
  "BatchGetDeploymentsOutput",
)({ deploymentsInfo: S.optional(DeploymentsInfoList) }, ns) {}
export class CreateDeploymentOutput extends S.Class<CreateDeploymentOutput>(
  "CreateDeploymentOutput",
)({ deploymentId: S.optional(S.String) }, ns) {}
export class CreateDeploymentConfigOutput extends S.Class<CreateDeploymentConfigOutput>(
  "CreateDeploymentConfigOutput",
)({ deploymentConfigId: S.optional(S.String) }, ns) {}
export class CreateDeploymentGroupInput extends S.Class<CreateDeploymentGroupInput>(
  "CreateDeploymentGroupInput",
)(
  {
    applicationName: S.String,
    deploymentGroupName: S.String,
    deploymentConfigName: S.optional(S.String),
    ec2TagFilters: S.optional(EC2TagFilterList),
    onPremisesInstanceTagFilters: S.optional(TagFilterList),
    autoScalingGroups: S.optional(AutoScalingGroupNameList),
    serviceRoleArn: S.String,
    triggerConfigurations: S.optional(TriggerConfigList),
    alarmConfiguration: S.optional(AlarmConfiguration),
    autoRollbackConfiguration: S.optional(AutoRollbackConfiguration),
    outdatedInstancesStrategy: S.optional(S.String),
    deploymentStyle: S.optional(DeploymentStyle),
    blueGreenDeploymentConfiguration: S.optional(
      BlueGreenDeploymentConfiguration,
    ),
    loadBalancerInfo: S.optional(LoadBalancerInfo),
    ec2TagSet: S.optional(EC2TagSet),
    ecsServices: S.optional(ECSServiceList),
    onPremisesTagSet: S.optional(OnPremisesTagSet),
    tags: S.optional(TagList),
    terminationHookEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevisionInfo extends S.Class<RevisionInfo>("RevisionInfo")({
  revisionLocation: S.optional(RevisionLocation),
  genericRevisionInfo: S.optional(GenericRevisionInfo),
}) {}
export const RevisionInfoList = S.Array(RevisionInfo);
export const InstanceSummaryList = S.Array(InstanceSummary);
export const DeploymentTargetList = S.Array(DeploymentTarget);
export class BatchGetApplicationRevisionsOutput extends S.Class<BatchGetApplicationRevisionsOutput>(
  "BatchGetApplicationRevisionsOutput",
)(
  {
    applicationName: S.optional(S.String),
    errorMessage: S.optional(S.String),
    revisions: S.optional(RevisionInfoList),
  },
  ns,
) {}
export class BatchGetDeploymentInstancesOutput extends S.Class<BatchGetDeploymentInstancesOutput>(
  "BatchGetDeploymentInstancesOutput",
)(
  {
    instancesSummary: S.optional(InstanceSummaryList),
    errorMessage: S.optional(S.String),
  },
  ns,
) {}
export class BatchGetDeploymentTargetsOutput extends S.Class<BatchGetDeploymentTargetsOutput>(
  "BatchGetDeploymentTargetsOutput",
)({ deploymentTargets: S.optional(DeploymentTargetList) }, ns) {}
export class CreateDeploymentGroupOutput extends S.Class<CreateDeploymentGroupOutput>(
  "CreateDeploymentGroupOutput",
)({ deploymentGroupId: S.optional(S.String) }, ns) {}

//# Errors
export class DeploymentAlreadyCompletedException extends S.TaggedError<DeploymentAlreadyCompletedException>()(
  "DeploymentAlreadyCompletedException",
  { message: S.optional(S.String) },
) {}
export class ApplicationNameRequiredException extends S.TaggedError<ApplicationNameRequiredException>()(
  "ApplicationNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class DeploymentConfigInUseException extends S.TaggedError<DeploymentConfigInUseException>()(
  "DeploymentConfigInUseException",
  { message: S.optional(S.String) },
) {}
export class InstanceNameRequiredException extends S.TaggedError<InstanceNameRequiredException>()(
  "InstanceNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApplicationDoesNotExistException extends S.TaggedError<ApplicationDoesNotExistException>()(
  "ApplicationDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class IamArnRequiredException extends S.TaggedError<IamArnRequiredException>()(
  "IamArnRequiredException",
  { message: S.optional(S.String) },
) {}
export class InstanceLimitExceededException extends S.TaggedError<InstanceLimitExceededException>()(
  "InstanceLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ApplicationAlreadyExistsException extends S.TaggedError<ApplicationAlreadyExistsException>()(
  "ApplicationAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class DeploymentDoesNotExistException extends S.TaggedError<DeploymentDoesNotExistException>()(
  "DeploymentDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidApplicationNameException extends S.TaggedError<InvalidApplicationNameException>()(
  "InvalidApplicationNameException",
  { message: S.optional(S.String) },
) {}
export class DeploymentConfigNameRequiredException extends S.TaggedError<DeploymentConfigNameRequiredException>()(
  "DeploymentConfigNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class GitHubAccountTokenDoesNotExistException extends S.TaggedError<GitHubAccountTokenDoesNotExistException>()(
  "GitHubAccountTokenDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidInstanceNameException extends S.TaggedError<InvalidInstanceNameException>()(
  "InvalidInstanceNameException",
  { message: S.optional(S.String) },
) {}
export class InstanceNotRegisteredException extends S.TaggedError<InstanceNotRegisteredException>()(
  "InstanceNotRegisteredException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
) {}
export class ArnNotSupportedException extends S.TaggedError<ArnNotSupportedException>()(
  "ArnNotSupportedException",
  { message: S.optional(S.String) },
) {}
export class DescriptionTooLongException extends S.TaggedError<DescriptionTooLongException>()(
  "DescriptionTooLongException",
  { message: S.optional(S.String) },
) {}
export class IamSessionArnAlreadyRegisteredException extends S.TaggedError<IamSessionArnAlreadyRegisteredException>()(
  "IamSessionArnAlreadyRegisteredException",
  { message: S.optional(S.String) },
) {}
export class AlarmsLimitExceededException extends S.TaggedError<AlarmsLimitExceededException>()(
  "AlarmsLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class DeploymentConfigDoesNotExistException extends S.TaggedError<DeploymentConfigDoesNotExistException>()(
  "DeploymentConfigDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class BucketNameFilterRequiredException extends S.TaggedError<BucketNameFilterRequiredException>()(
  "BucketNameFilterRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApplicationLimitExceededException extends S.TaggedError<ApplicationLimitExceededException>()(
  "ApplicationLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class BatchLimitExceededException extends S.TaggedError<BatchLimitExceededException>()(
  "BatchLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class DeploymentIdRequiredException extends S.TaggedError<DeploymentIdRequiredException>()(
  "DeploymentIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidRoleException extends S.TaggedError<InvalidRoleException>()(
  "InvalidRoleException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentConfigNameException extends S.TaggedError<InvalidDeploymentConfigNameException>()(
  "InvalidDeploymentConfigNameException",
  { message: S.optional(S.String) },
) {}
export class DeploymentGroupNameRequiredException extends S.TaggedError<DeploymentGroupNameRequiredException>()(
  "DeploymentGroupNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class GitHubAccountTokenNameRequiredException extends S.TaggedError<GitHubAccountTokenNameRequiredException>()(
  "GitHubAccountTokenNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidRevisionException extends S.TaggedError<InvalidRevisionException>()(
  "InvalidRevisionException",
  { message: S.optional(S.String) },
) {}
export class DeploymentGroupDoesNotExistException extends S.TaggedError<DeploymentGroupDoesNotExistException>()(
  "DeploymentGroupDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { message: S.optional(S.String) },
) {}
export class IamUserArnAlreadyRegisteredException extends S.TaggedError<IamUserArnAlreadyRegisteredException>()(
  "IamUserArnAlreadyRegisteredException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  { message: S.optional(S.String) },
) {}
export class OperationNotSupportedException extends S.TaggedError<OperationNotSupportedException>()(
  "OperationNotSupportedException",
  { message: S.optional(S.String) },
) {}
export class InvalidRegistrationStatusException extends S.TaggedError<InvalidRegistrationStatusException>()(
  "InvalidRegistrationStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidBucketNameFilterException extends S.TaggedError<InvalidBucketNameFilterException>()(
  "InvalidBucketNameFilterException",
  { message: S.optional(S.String) },
) {}
export class InvalidComputePlatformException extends S.TaggedError<InvalidComputePlatformException>()(
  "InvalidComputePlatformException",
  { message: S.optional(S.String) },
) {}
export class DeploymentGroupAlreadyExistsException extends S.TaggedError<DeploymentGroupAlreadyExistsException>()(
  "DeploymentGroupAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class DeploymentIsNotInReadyStateException extends S.TaggedError<DeploymentIsNotInReadyStateException>()(
  "DeploymentIsNotInReadyStateException",
  { message: S.optional(S.String) },
) {}
export class DeploymentConfigAlreadyExistsException extends S.TaggedError<DeploymentConfigAlreadyExistsException>()(
  "DeploymentConfigAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentGroupNameException extends S.TaggedError<InvalidDeploymentGroupNameException>()(
  "InvalidDeploymentGroupNameException",
  { message: S.optional(S.String) },
) {}
export class InvalidGitHubAccountTokenNameException extends S.TaggedError<InvalidGitHubAccountTokenNameException>()(
  "InvalidGitHubAccountTokenNameException",
  { message: S.optional(S.String) },
) {}
export class RevisionDoesNotExistException extends S.TaggedError<RevisionDoesNotExistException>()(
  "RevisionDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class ResourceArnRequiredException extends S.TaggedError<ResourceArnRequiredException>()(
  "ResourceArnRequiredException",
  { message: S.optional(S.String) },
) {}
export class IamUserArnRequiredException extends S.TaggedError<IamUserArnRequiredException>()(
  "IamUserArnRequiredException",
  { message: S.optional(S.String) },
) {}
export class DeploymentNotStartedException extends S.TaggedError<DeploymentNotStartedException>()(
  "DeploymentNotStartedException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentIdException extends S.TaggedError<InvalidDeploymentIdException>()(
  "InvalidDeploymentIdException",
  { message: S.optional(S.String) },
) {}
export class InstanceDoesNotExistException extends S.TaggedError<InstanceDoesNotExistException>()(
  "InstanceDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class RevisionRequiredException extends S.TaggedError<RevisionRequiredException>()(
  "RevisionRequiredException",
  { message: S.optional(S.String) },
) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceValidationException extends S.TaggedError<ResourceValidationException>()(
  "ResourceValidationException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagFilterException extends S.TaggedError<InvalidTagFilterException>()(
  "InvalidTagFilterException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagsToAddException extends S.TaggedError<InvalidTagsToAddException>()(
  "InvalidTagsToAddException",
  { message: S.optional(S.String) },
) {}
export class DeploymentLimitExceededException extends S.TaggedError<DeploymentLimitExceededException>()(
  "DeploymentLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeployedStateFilterException extends S.TaggedError<InvalidDeployedStateFilterException>()(
  "InvalidDeployedStateFilterException",
  { message: S.optional(S.String) },
) {}
export class ECSServiceMappingLimitExceededException extends S.TaggedError<ECSServiceMappingLimitExceededException>()(
  "ECSServiceMappingLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InstanceIdRequiredException extends S.TaggedError<InstanceIdRequiredException>()(
  "InstanceIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class DeploymentConfigLimitExceededException extends S.TaggedError<DeploymentConfigLimitExceededException>()(
  "DeploymentConfigLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class DeploymentGroupLimitExceededException extends S.TaggedError<DeploymentGroupLimitExceededException>()(
  "DeploymentGroupLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InstanceNameAlreadyRegisteredException extends S.TaggedError<InstanceNameAlreadyRegisteredException>()(
  "InstanceNameAlreadyRegisteredException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentStatusException extends S.TaggedError<InvalidDeploymentStatusException>()(
  "InvalidDeploymentStatusException",
  { message: S.optional(S.String) },
) {}
export class TagRequiredException extends S.TaggedError<TagRequiredException>()(
  "TagRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidAlarmConfigException extends S.TaggedError<InvalidAlarmConfigException>()(
  "InvalidAlarmConfigException",
  { message: S.optional(S.String) },
) {}
export class InvalidKeyPrefixFilterException extends S.TaggedError<InvalidKeyPrefixFilterException>()(
  "InvalidKeyPrefixFilterException",
  { message: S.optional(S.String) },
) {}
export class DeploymentTargetDoesNotExistException extends S.TaggedError<DeploymentTargetDoesNotExistException>()(
  "DeploymentTargetDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentInstanceTypeException extends S.TaggedError<InvalidDeploymentInstanceTypeException>()(
  "InvalidDeploymentInstanceTypeException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedActionForDeploymentTypeException extends S.TaggedError<UnsupportedActionForDeploymentTypeException>()(
  "UnsupportedActionForDeploymentTypeException",
  { message: S.optional(S.String) },
) {}
export class InvalidLifecycleEventHookExecutionIdException extends S.TaggedError<InvalidLifecycleEventHookExecutionIdException>()(
  "InvalidLifecycleEventHookExecutionIdException",
  { message: S.optional(S.String) },
) {}
export class InvalidMinimumHealthyHostValueException extends S.TaggedError<InvalidMinimumHealthyHostValueException>()(
  "InvalidMinimumHealthyHostValueException",
  { message: S.optional(S.String) },
) {}
export class InvalidIamSessionArnException extends S.TaggedError<InvalidIamSessionArnException>()(
  "InvalidIamSessionArnException",
  { message: S.optional(S.String) },
) {}
export class InvalidExternalIdException extends S.TaggedError<InvalidExternalIdException>()(
  "InvalidExternalIdException",
  { message: S.optional(S.String) },
) {}
export class InvalidAutoRollbackConfigException extends S.TaggedError<InvalidAutoRollbackConfigException>()(
  "InvalidAutoRollbackConfigException",
  { message: S.optional(S.String) },
) {}
export class InvalidSortByException extends S.TaggedError<InvalidSortByException>()(
  "InvalidSortByException",
  { message: S.optional(S.String) },
) {}
export class DeploymentTargetIdRequiredException extends S.TaggedError<DeploymentTargetIdRequiredException>()(
  "DeploymentTargetIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidInstanceStatusException extends S.TaggedError<InvalidInstanceStatusException>()(
  "InvalidInstanceStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidLifecycleEventHookExecutionStatusException extends S.TaggedError<InvalidLifecycleEventHookExecutionStatusException>()(
  "InvalidLifecycleEventHookExecutionStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentWaitTypeException extends S.TaggedError<InvalidDeploymentWaitTypeException>()(
  "InvalidDeploymentWaitTypeException",
  { message: S.optional(S.String) },
) {}
export class InvalidTrafficRoutingConfigurationException extends S.TaggedError<InvalidTrafficRoutingConfigurationException>()(
  "InvalidTrafficRoutingConfigurationException",
  { message: S.optional(S.String) },
) {}
export class InvalidIamUserArnException extends S.TaggedError<InvalidIamUserArnException>()(
  "InvalidIamUserArnException",
  { message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
) {}
export class InvalidAutoScalingGroupException extends S.TaggedError<InvalidAutoScalingGroupException>()(
  "InvalidAutoScalingGroupException",
  { message: S.optional(S.String) },
) {}
export class InvalidSortOrderException extends S.TaggedError<InvalidSortOrderException>()(
  "InvalidSortOrderException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentTargetIdException extends S.TaggedError<InvalidDeploymentTargetIdException>()(
  "InvalidDeploymentTargetIdException",
  { message: S.optional(S.String) },
) {}
export class InvalidInstanceTypeException extends S.TaggedError<InvalidInstanceTypeException>()(
  "InvalidInstanceTypeException",
  { message: S.optional(S.String) },
) {}
export class LifecycleEventAlreadyCompletedException extends S.TaggedError<LifecycleEventAlreadyCompletedException>()(
  "LifecycleEventAlreadyCompletedException",
  { message: S.optional(S.String) },
) {}
export class DeploymentTargetListSizeExceededException extends S.TaggedError<DeploymentTargetListSizeExceededException>()(
  "DeploymentTargetListSizeExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidZonalDeploymentConfigurationException extends S.TaggedError<InvalidZonalDeploymentConfigurationException>()(
  "InvalidZonalDeploymentConfigurationException",
  { message: S.optional(S.String) },
) {}
export class MultipleIamArnsProvidedException extends S.TaggedError<MultipleIamArnsProvidedException>()(
  "MultipleIamArnsProvidedException",
  { message: S.optional(S.String) },
) {}
export class InvalidTimeRangeException extends S.TaggedError<InvalidTimeRangeException>()(
  "InvalidTimeRangeException",
  { message: S.optional(S.String) },
) {}
export class InvalidFileExistsBehaviorException extends S.TaggedError<InvalidFileExistsBehaviorException>()(
  "InvalidFileExistsBehaviorException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetFilterNameException extends S.TaggedError<InvalidTargetFilterNameException>()(
  "InvalidTargetFilterNameException",
  { message: S.optional(S.String) },
) {}
export class InvalidBlueGreenDeploymentConfigurationException extends S.TaggedError<InvalidBlueGreenDeploymentConfigurationException>()(
  "InvalidBlueGreenDeploymentConfigurationException",
  { message: S.optional(S.String) },
) {}
export class InvalidGitHubAccountTokenException extends S.TaggedError<InvalidGitHubAccountTokenException>()(
  "InvalidGitHubAccountTokenException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeploymentStyleException extends S.TaggedError<InvalidDeploymentStyleException>()(
  "InvalidDeploymentStyleException",
  { message: S.optional(S.String) },
) {}
export class InvalidIgnoreApplicationStopFailuresValueException extends S.TaggedError<InvalidIgnoreApplicationStopFailuresValueException>()(
  "InvalidIgnoreApplicationStopFailuresValueException",
  { message: S.optional(S.String) },
) {}
export class InvalidEC2TagCombinationException extends S.TaggedError<InvalidEC2TagCombinationException>()(
  "InvalidEC2TagCombinationException",
  { message: S.optional(S.String) },
) {}
export class InvalidLoadBalancerInfoException extends S.TaggedError<InvalidLoadBalancerInfoException>()(
  "InvalidLoadBalancerInfoException",
  { message: S.optional(S.String) },
) {}
export class InvalidEC2TagException extends S.TaggedError<InvalidEC2TagException>()(
  "InvalidEC2TagException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetInstancesException extends S.TaggedError<InvalidTargetInstancesException>()(
  "InvalidTargetInstancesException",
  { message: S.optional(S.String) },
) {}
export class InvalidECSServiceException extends S.TaggedError<InvalidECSServiceException>()(
  "InvalidECSServiceException",
  { message: S.optional(S.String) },
) {}
export class InvalidUpdateOutdatedInstancesOnlyValueException extends S.TaggedError<InvalidUpdateOutdatedInstancesOnlyValueException>()(
  "InvalidUpdateOutdatedInstancesOnlyValueException",
  { message: S.optional(S.String) },
) {}
export class InvalidOnPremisesTagCombinationException extends S.TaggedError<InvalidOnPremisesTagCombinationException>()(
  "InvalidOnPremisesTagCombinationException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetGroupPairException extends S.TaggedError<InvalidTargetGroupPairException>()(
  "InvalidTargetGroupPairException",
  { message: S.optional(S.String) },
) {}
export class InvalidTriggerConfigException extends S.TaggedError<InvalidTriggerConfigException>()(
  "InvalidTriggerConfigException",
  { message: S.optional(S.String) },
) {}
export class LifecycleHookLimitExceededException extends S.TaggedError<LifecycleHookLimitExceededException>()(
  "LifecycleHookLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class TagSetListLimitExceededException extends S.TaggedError<TagSetListLimitExceededException>()(
  "TagSetListLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class RoleRequiredException extends S.TaggedError<RoleRequiredException>()(
  "RoleRequiredException",
  { message: S.optional(S.String) },
) {}
export class TriggerTargetsLimitExceededException extends S.TaggedError<TriggerTargetsLimitExceededException>()(
  "TriggerTargetsLimitExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes resources linked to an external ID. This action only applies if you have
 * configured blue/green deployments through CloudFormation.
 *
 * It is not necessary to call this action directly. CloudFormation calls it
 * on your behalf when it needs to delete stack resources. This action is offered
 * publicly in case you need to delete resources to comply with General Data Protection
 * Regulation (GDPR) requirements.
 */
export const deleteResourcesByExternalId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcesByExternalIdInput,
    output: DeleteResourcesByExternalIdOutput,
    errors: [],
  }),
);
/**
 * Deregisters an on-premises instance.
 */
export const deregisterOnPremisesInstance =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterOnPremisesInstanceInput,
    output: DeregisterOnPremisesInstanceResponse,
    errors: [InstanceNameRequiredException, InvalidInstanceNameException],
  }));
/**
 * Gets information about an on-premises instance.
 */
export const getOnPremisesInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetOnPremisesInstanceInput,
    output: GetOnPremisesInstanceOutput,
    errors: [
      InstanceNameRequiredException,
      InstanceNotRegisteredException,
      InvalidInstanceNameException,
    ],
  }),
);
/**
 * Lists the applications registered with the user or Amazon Web Services account.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsInput,
    output: ListApplicationsOutput,
    errors: [InvalidNextTokenException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "applications",
    } as const,
  }),
);
/**
 * Changes the name of an application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationInput,
  output: UpdateApplicationResponse,
  errors: [
    ApplicationAlreadyExistsException,
    ApplicationDoesNotExistException,
    ApplicationNameRequiredException,
    InvalidApplicationNameException,
  ],
}));
/**
 * Gets information about an application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationInput,
  output: GetApplicationOutput,
  errors: [
    ApplicationDoesNotExistException,
    ApplicationNameRequiredException,
    InvalidApplicationNameException,
  ],
}));
/**
 * Lists the deployment groups for an application registered with the Amazon Web Services
 * user or Amazon Web Services account.
 */
export const listDeploymentGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeploymentGroupsInput,
    output: ListDeploymentGroupsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      InvalidApplicationNameException,
      InvalidNextTokenException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deploymentGroups",
    } as const,
  }));
/**
 * Lists the deployment configurations with the user or Amazon Web Services account.
 */
export const listDeploymentConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeploymentConfigsInput,
    output: ListDeploymentConfigsOutput,
    errors: [InvalidNextTokenException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deploymentConfigsList",
    } as const,
  }));
/**
 * Gets information about one or more applications. The maximum number of applications
 * that can be returned is 100.
 */
export const batchGetApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetApplicationsInput,
    output: BatchGetApplicationsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      BatchLimitExceededException,
      InvalidApplicationNameException,
    ],
  }),
);
/**
 * Deletes an application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationInput,
  output: DeleteApplicationResponse,
  errors: [
    ApplicationNameRequiredException,
    InvalidApplicationNameException,
    InvalidRoleException,
  ],
}));
/**
 * Gets information about one or more on-premises instances. The maximum number of
 * on-premises instances that can be returned is 25.
 */
export const batchGetOnPremisesInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetOnPremisesInstancesInput,
    output: BatchGetOnPremisesInstancesOutput,
    errors: [
      BatchLimitExceededException,
      InstanceNameRequiredException,
      InvalidInstanceNameException,
    ],
  }),
);
/**
 * Gets information about a deployment configuration.
 */
export const getDeploymentConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentConfigInput,
  output: GetDeploymentConfigOutput,
  errors: [
    DeploymentConfigDoesNotExistException,
    DeploymentConfigNameRequiredException,
    InvalidComputePlatformException,
    InvalidDeploymentConfigNameException,
  ],
}));
/**
 * Deletes a deployment configuration.
 *
 * A deployment configuration cannot be deleted if it is currently in use. Predefined
 * configurations cannot be deleted.
 */
export const deleteDeploymentConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeploymentConfigInput,
    output: DeleteDeploymentConfigResponse,
    errors: [
      DeploymentConfigInUseException,
      DeploymentConfigNameRequiredException,
      InvalidDeploymentConfigNameException,
      InvalidOperationException,
    ],
  }),
);
/**
 * Deletes a deployment group.
 */
export const deleteDeploymentGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeploymentGroupInput,
    output: DeleteDeploymentGroupOutput,
    errors: [
      ApplicationNameRequiredException,
      DeploymentGroupNameRequiredException,
      InvalidApplicationNameException,
      InvalidDeploymentGroupNameException,
      InvalidRoleException,
    ],
  }),
);
/**
 * Returns a list of tags for the resource identified by a specified Amazon Resource
 * Name (ARN). Tags are used to organize and categorize your CodeDeploy resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    ArnNotSupportedException,
    InvalidArnException,
    ResourceArnRequiredException,
  ],
}));
/**
 * Gets information about a deployment.
 *
 * The `content` property of the `appSpecContent` object in
 * the returned revision is always null. Use `GetApplicationRevision` and
 * the `sha256` property of the returned `appSpecContent` object
 * to get the content of the deployment’s AppSpec file.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentInput,
  output: GetDeploymentOutput,
  errors: [
    DeploymentDoesNotExistException,
    DeploymentIdRequiredException,
    InvalidDeploymentIdException,
  ],
}));
/**
 * Gets information about one or more deployment groups.
 */
export const batchGetDeploymentGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDeploymentGroupsInput,
    output: BatchGetDeploymentGroupsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      BatchLimitExceededException,
      DeploymentConfigDoesNotExistException,
      DeploymentGroupNameRequiredException,
      InvalidApplicationNameException,
      InvalidDeploymentGroupNameException,
    ],
  }),
);
/**
 * Gets information about a deployment group.
 */
export const getDeploymentGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentGroupInput,
  output: GetDeploymentGroupOutput,
  errors: [
    ApplicationDoesNotExistException,
    ApplicationNameRequiredException,
    DeploymentConfigDoesNotExistException,
    DeploymentGroupDoesNotExistException,
    DeploymentGroupNameRequiredException,
    InvalidApplicationNameException,
    InvalidDeploymentGroupNameException,
  ],
}));
/**
 * Registers with CodeDeploy a revision for the specified application.
 */
export const registerApplicationRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterApplicationRevisionInput,
    output: RegisterApplicationRevisionResponse,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      DescriptionTooLongException,
      InvalidApplicationNameException,
      InvalidRevisionException,
      RevisionRequiredException,
    ],
  }),
);
/**
 * Lists the names of stored connections to GitHub accounts.
 */
export const listGitHubAccountTokenNames = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListGitHubAccountTokenNamesInput,
    output: ListGitHubAccountTokenNamesOutput,
    errors: [
      InvalidNextTokenException,
      OperationNotSupportedException,
      ResourceValidationException,
    ],
  }),
);
/**
 * Gets a list of names for one or more on-premises instances.
 *
 * Unless otherwise specified, both registered and deregistered on-premises instance
 * names are listed. To list only registered or deregistered on-premises instance names,
 * use the registration status parameter.
 */
export const listOnPremisesInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOnPremisesInstancesInput,
    output: ListOnPremisesInstancesOutput,
    errors: [
      InvalidNextTokenException,
      InvalidRegistrationStatusException,
      InvalidTagFilterException,
    ],
  }),
);
/**
 * Gets information about one or more deployments. The maximum number of deployments that
 * can be returned is 25.
 */
export const batchGetDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetDeploymentsInput,
  output: BatchGetDeploymentsOutput,
  errors: [
    BatchLimitExceededException,
    DeploymentIdRequiredException,
    InvalidDeploymentIdException,
  ],
}));
/**
 * Gets information about one or more application revisions. The maximum number of
 * application revisions that can be returned is 25.
 */
export const batchGetApplicationRevisions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetApplicationRevisionsInput,
    output: BatchGetApplicationRevisionsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      BatchLimitExceededException,
      InvalidApplicationNameException,
      InvalidRevisionException,
      RevisionRequiredException,
    ],
  }));
/**
 * Gets information about an application revision.
 */
export const getApplicationRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationRevisionInput,
    output: GetApplicationRevisionOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      InvalidApplicationNameException,
      InvalidRevisionException,
      RevisionDoesNotExistException,
      RevisionRequiredException,
    ],
  }),
);
/**
 * Deletes a GitHub account connection.
 */
export const deleteGitHubAccountToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGitHubAccountTokenInput,
    output: DeleteGitHubAccountTokenOutput,
    errors: [
      GitHubAccountTokenDoesNotExistException,
      GitHubAccountTokenNameRequiredException,
      InvalidGitHubAccountTokenNameException,
      OperationNotSupportedException,
      ResourceValidationException,
    ],
  }),
);
/**
 * Creates an application.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationInput,
  output: CreateApplicationOutput,
  errors: [
    ApplicationAlreadyExistsException,
    ApplicationLimitExceededException,
    ApplicationNameRequiredException,
    InvalidApplicationNameException,
    InvalidComputePlatformException,
    InvalidTagsToAddException,
  ],
}));
/**
 * This method works, but is deprecated. Use `BatchGetDeploymentTargets`
 * instead.
 *
 * Returns an array of one or more instances associated with a deployment. This method
 * works with EC2/On-premises and Lambda compute platforms. The newer
 * `BatchGetDeploymentTargets` works with all compute platforms. The maximum
 * number of instances that can be returned is 25.
 */
export const batchGetDeploymentInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDeploymentInstancesInput,
    output: BatchGetDeploymentInstancesOutput,
    errors: [
      BatchLimitExceededException,
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      InstanceIdRequiredException,
      InvalidComputePlatformException,
      InvalidDeploymentIdException,
      InvalidInstanceNameException,
    ],
  }),
);
/**
 * Gets information about an instance as part of a deployment.
 */
export const getDeploymentInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeploymentInstanceInput,
    output: GetDeploymentInstanceOutput,
    errors: [
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      InstanceDoesNotExistException,
      InstanceIdRequiredException,
      InvalidComputePlatformException,
      InvalidDeploymentIdException,
      InvalidInstanceNameException,
    ],
  }),
);
/**
 * Removes one or more tags from one or more on-premises instances.
 */
export const removeTagsFromOnPremisesInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveTagsFromOnPremisesInstancesInput,
    output: RemoveTagsFromOnPremisesInstancesResponse,
    errors: [
      InstanceLimitExceededException,
      InstanceNameRequiredException,
      InstanceNotRegisteredException,
      InvalidInstanceNameException,
      InvalidTagException,
      TagLimitExceededException,
      TagRequiredException,
    ],
  }));
/**
 * In a blue/green deployment, overrides any specified wait time and starts terminating
 * instances immediately after the traffic routing is complete.
 */
export const skipWaitTimeForInstanceTermination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SkipWaitTimeForInstanceTerminationInput,
    output: SkipWaitTimeForInstanceTerminationResponse,
    errors: [
      DeploymentAlreadyCompletedException,
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      DeploymentNotStartedException,
      InvalidDeploymentIdException,
      UnsupportedActionForDeploymentTypeException,
    ],
  }));
/**
 * Associates the list of tags in the input `Tags` parameter with the
 * resource identified by the `ResourceArn` input parameter.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ApplicationDoesNotExistException,
    ArnNotSupportedException,
    DeploymentConfigDoesNotExistException,
    DeploymentGroupDoesNotExistException,
    InvalidArnException,
    InvalidTagsToAddException,
    ResourceArnRequiredException,
    TagRequiredException,
  ],
}));
/**
 * Adds tags to on-premises instances.
 */
export const addTagsToOnPremisesInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddTagsToOnPremisesInstancesInput,
    output: AddTagsToOnPremisesInstancesResponse,
    errors: [
      InstanceLimitExceededException,
      InstanceNameRequiredException,
      InstanceNotRegisteredException,
      InvalidInstanceNameException,
      InvalidTagException,
      TagLimitExceededException,
      TagRequiredException,
    ],
  }));
/**
 * Disassociates a resource from a list of tags. The resource is identified by the
 * `ResourceArn` input parameter. The tags are identified by the list of
 * keys in the `TagKeys` input parameter.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ApplicationDoesNotExistException,
    ArnNotSupportedException,
    DeploymentConfigDoesNotExistException,
    DeploymentGroupDoesNotExistException,
    InvalidArnException,
    InvalidTagsToAddException,
    ResourceArnRequiredException,
    TagRequiredException,
  ],
}));
/**
 * Attempts to stop an ongoing deployment.
 */
export const stopDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDeploymentInput,
  output: StopDeploymentOutput,
  errors: [
    DeploymentAlreadyCompletedException,
    DeploymentDoesNotExistException,
    DeploymentGroupDoesNotExistException,
    DeploymentIdRequiredException,
    InvalidDeploymentIdException,
    UnsupportedActionForDeploymentTypeException,
  ],
}));
/**
 * For a blue/green deployment, starts the process of rerouting traffic from instances in
 * the original environment to instances in the replacement environment without waiting for
 * a specified wait time to elapse. (Traffic rerouting, which is achieved by registering
 * instances in the replacement environment with the load balancer, can start as soon as
 * all instances have a status of Ready.)
 */
export const continueDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ContinueDeploymentInput,
  output: ContinueDeploymentResponse,
  errors: [
    DeploymentAlreadyCompletedException,
    DeploymentDoesNotExistException,
    DeploymentIdRequiredException,
    DeploymentIsNotInReadyStateException,
    InvalidDeploymentIdException,
    InvalidDeploymentStatusException,
    InvalidDeploymentWaitTypeException,
    UnsupportedActionForDeploymentTypeException,
  ],
}));
/**
 * Lists information about revisions for an application.
 */
export const listApplicationRevisions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationRevisionsInput,
    output: ListApplicationRevisionsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      BucketNameFilterRequiredException,
      InvalidApplicationNameException,
      InvalidBucketNameFilterException,
      InvalidDeployedStateFilterException,
      InvalidKeyPrefixFilterException,
      InvalidNextTokenException,
      InvalidSortByException,
      InvalidSortOrderException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "revisions",
    } as const,
  }));
/**
 * Returns information about a deployment target.
 */
export const getDeploymentTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentTargetInput,
  output: GetDeploymentTargetOutput,
  errors: [
    DeploymentDoesNotExistException,
    DeploymentIdRequiredException,
    DeploymentNotStartedException,
    DeploymentTargetDoesNotExistException,
    DeploymentTargetIdRequiredException,
    InvalidDeploymentIdException,
    InvalidDeploymentTargetIdException,
    InvalidInstanceNameException,
  ],
}));
/**
 * Sets the result of a Lambda validation function. The function validates
 * lifecycle hooks during a deployment that uses the Lambda or Amazon ECS compute platform. For Lambda deployments, the available
 * lifecycle hooks are `BeforeAllowTraffic` and `AfterAllowTraffic`.
 * For Amazon ECS deployments, the available lifecycle hooks are
 * `BeforeInstall`, `AfterInstall`,
 * `AfterAllowTestTraffic`, `BeforeAllowTraffic`, and
 * `AfterAllowTraffic`. Lambda validation functions return
 * `Succeeded` or `Failed`. For more information, see AppSpec 'hooks' Section for an Lambda Deployment and
 * AppSpec 'hooks' Section for an Amazon ECS Deployment.
 */
export const putLifecycleEventHookExecutionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutLifecycleEventHookExecutionStatusInput,
    output: PutLifecycleEventHookExecutionStatusOutput,
    errors: [
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      InvalidDeploymentIdException,
      InvalidLifecycleEventHookExecutionIdException,
      InvalidLifecycleEventHookExecutionStatusException,
      LifecycleEventAlreadyCompletedException,
      UnsupportedActionForDeploymentTypeException,
    ],
  }));
/**
 * Returns an array of one or more targets associated with a deployment. This method
 * works with all compute types and should be used instead of the deprecated
 * `BatchGetDeploymentInstances`. The maximum number of targets that can be
 * returned is 25.
 *
 * The type of targets returned depends on the deployment's compute platform or
 * deployment method:
 *
 * - **EC2/On-premises**: Information about Amazon EC2 instance targets.
 *
 * - **Lambda**: Information about
 * Lambda functions targets.
 *
 * - **Amazon ECS**: Information about Amazon ECS service targets.
 *
 * - **CloudFormation**: Information about
 * targets of blue/green deployments initiated by a CloudFormation stack
 * update.
 */
export const batchGetDeploymentTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDeploymentTargetsInput,
    output: BatchGetDeploymentTargetsOutput,
    errors: [
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      DeploymentNotStartedException,
      DeploymentTargetDoesNotExistException,
      DeploymentTargetIdRequiredException,
      DeploymentTargetListSizeExceededException,
      InstanceDoesNotExistException,
      InvalidDeploymentIdException,
      InvalidDeploymentTargetIdException,
    ],
  }),
);
/**
 * Creates a deployment configuration.
 */
export const createDeploymentConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDeploymentConfigInput,
    output: CreateDeploymentConfigOutput,
    errors: [
      DeploymentConfigAlreadyExistsException,
      DeploymentConfigLimitExceededException,
      DeploymentConfigNameRequiredException,
      InvalidComputePlatformException,
      InvalidDeploymentConfigNameException,
      InvalidMinimumHealthyHostValueException,
      InvalidTrafficRoutingConfigurationException,
      InvalidZonalDeploymentConfigurationException,
    ],
  }),
);
/**
 * Registers an on-premises instance.
 *
 * Only one IAM ARN (an IAM session ARN or IAM user ARN) is supported in the request. You cannot use both.
 */
export const registerOnPremisesInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterOnPremisesInstanceInput,
    output: RegisterOnPremisesInstanceResponse,
    errors: [
      IamArnRequiredException,
      IamSessionArnAlreadyRegisteredException,
      IamUserArnAlreadyRegisteredException,
      IamUserArnRequiredException,
      InstanceNameAlreadyRegisteredException,
      InstanceNameRequiredException,
      InvalidIamSessionArnException,
      InvalidIamUserArnException,
      InvalidInstanceNameException,
      MultipleIamArnsProvidedException,
    ],
  }),
);
/**
 * Lists the deployments in a deployment group for an application registered with the
 * user or Amazon Web Services account.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDeploymentsInput,
    output: ListDeploymentsOutput,
    errors: [
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      DeploymentGroupDoesNotExistException,
      DeploymentGroupNameRequiredException,
      InvalidApplicationNameException,
      InvalidDeploymentGroupNameException,
      InvalidDeploymentStatusException,
      InvalidExternalIdException,
      InvalidInputException,
      InvalidNextTokenException,
      InvalidTimeRangeException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deployments",
    } as const,
  }),
);
/**
 * The newer `BatchGetDeploymentTargets` should be used instead because
 * it works with all compute types. `ListDeploymentInstances` throws an
 * exception if it is used with a compute platform other than EC2/On-premises or
 * Lambda.
 *
 * Lists the instance for a deployment associated with the user or Amazon Web Services account.
 */
export const listDeploymentInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeploymentInstancesInput,
    output: ListDeploymentInstancesOutput,
    errors: [
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      DeploymentNotStartedException,
      InvalidComputePlatformException,
      InvalidDeploymentIdException,
      InvalidDeploymentInstanceTypeException,
      InvalidInstanceStatusException,
      InvalidInstanceTypeException,
      InvalidNextTokenException,
      InvalidTargetFilterNameException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "instancesList",
    } as const,
  }));
/**
 * Returns an array of target IDs that are associated a deployment.
 */
export const listDeploymentTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDeploymentTargetsInput,
    output: ListDeploymentTargetsOutput,
    errors: [
      DeploymentDoesNotExistException,
      DeploymentIdRequiredException,
      DeploymentNotStartedException,
      InvalidDeploymentIdException,
      InvalidDeploymentInstanceTypeException,
      InvalidInstanceStatusException,
      InvalidInstanceTypeException,
      InvalidNextTokenException,
      InvalidTargetFilterNameException,
    ],
  }),
);
/**
 * Deploys an application revision through the specified deployment group.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentInput,
  output: CreateDeploymentOutput,
  errors: [
    AlarmsLimitExceededException,
    ApplicationDoesNotExistException,
    ApplicationNameRequiredException,
    DeploymentConfigDoesNotExistException,
    DeploymentGroupDoesNotExistException,
    DeploymentGroupNameRequiredException,
    DeploymentLimitExceededException,
    DescriptionTooLongException,
    InvalidAlarmConfigException,
    InvalidApplicationNameException,
    InvalidAutoRollbackConfigException,
    InvalidAutoScalingGroupException,
    InvalidDeploymentConfigNameException,
    InvalidDeploymentGroupNameException,
    InvalidFileExistsBehaviorException,
    InvalidGitHubAccountTokenException,
    InvalidIgnoreApplicationStopFailuresValueException,
    InvalidLoadBalancerInfoException,
    InvalidRevisionException,
    InvalidRoleException,
    InvalidTargetInstancesException,
    InvalidTrafficRoutingConfigurationException,
    InvalidUpdateOutdatedInstancesOnlyValueException,
    RevisionDoesNotExistException,
    RevisionRequiredException,
    ThrottlingException,
  ],
}));
/**
 * Changes information about a deployment group.
 */
export const updateDeploymentGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDeploymentGroupInput,
    output: UpdateDeploymentGroupOutput,
    errors: [
      AlarmsLimitExceededException,
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      DeploymentConfigDoesNotExistException,
      DeploymentGroupAlreadyExistsException,
      DeploymentGroupDoesNotExistException,
      DeploymentGroupNameRequiredException,
      ECSServiceMappingLimitExceededException,
      InvalidAlarmConfigException,
      InvalidApplicationNameException,
      InvalidAutoRollbackConfigException,
      InvalidAutoScalingGroupException,
      InvalidBlueGreenDeploymentConfigurationException,
      InvalidDeploymentConfigNameException,
      InvalidDeploymentGroupNameException,
      InvalidDeploymentStyleException,
      InvalidEC2TagCombinationException,
      InvalidEC2TagException,
      InvalidECSServiceException,
      InvalidInputException,
      InvalidLoadBalancerInfoException,
      InvalidOnPremisesTagCombinationException,
      InvalidRoleException,
      InvalidTagException,
      InvalidTargetGroupPairException,
      InvalidTrafficRoutingConfigurationException,
      InvalidTriggerConfigException,
      LifecycleHookLimitExceededException,
      TagSetListLimitExceededException,
      ThrottlingException,
      TriggerTargetsLimitExceededException,
    ],
  }),
);
/**
 * Creates a deployment group to which application revisions are deployed.
 */
export const createDeploymentGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDeploymentGroupInput,
    output: CreateDeploymentGroupOutput,
    errors: [
      AlarmsLimitExceededException,
      ApplicationDoesNotExistException,
      ApplicationNameRequiredException,
      DeploymentConfigDoesNotExistException,
      DeploymentGroupAlreadyExistsException,
      DeploymentGroupLimitExceededException,
      DeploymentGroupNameRequiredException,
      ECSServiceMappingLimitExceededException,
      InvalidAlarmConfigException,
      InvalidApplicationNameException,
      InvalidAutoRollbackConfigException,
      InvalidAutoScalingGroupException,
      InvalidBlueGreenDeploymentConfigurationException,
      InvalidDeploymentConfigNameException,
      InvalidDeploymentGroupNameException,
      InvalidDeploymentStyleException,
      InvalidEC2TagCombinationException,
      InvalidEC2TagException,
      InvalidECSServiceException,
      InvalidInputException,
      InvalidLoadBalancerInfoException,
      InvalidOnPremisesTagCombinationException,
      InvalidRoleException,
      InvalidTagException,
      InvalidTagsToAddException,
      InvalidTargetGroupPairException,
      InvalidTrafficRoutingConfigurationException,
      InvalidTriggerConfigException,
      LifecycleHookLimitExceededException,
      RoleRequiredException,
      TagSetListLimitExceededException,
      ThrottlingException,
      TriggerTargetsLimitExceededException,
    ],
  }),
);
