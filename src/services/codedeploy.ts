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
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
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

//# Newtypes
export type InstanceName = string;
export type ApplicationName = string;
export type DeploymentGroupName = string;
export type DeploymentId = string;
export type InstanceId = string;
export type TargetId = string;
export type DeploymentConfigName = string;
export type Description = string;
export type AutoScalingGroupName = string;
export type Role = string;
export type GitHubAccountTokenName = string;
export type ExternalId = string;
export type S3Bucket = string;
export type S3Key = string;
export type NextToken = string;
export type Arn = string;
export type LifecycleEventHookExecutionId = string;
export type IamSessionArn = string;
export type IamUserArn = string;
export type Key = string;
export type Value = string;
export type MinimumHealthyHostsValue = number;
export type WaitTimeInSeconds = number;
export type TriggerName = string;
export type TriggerTargetArn = string;
export type ECSServiceName = string;
export type ECSClusterName = string;
export type FilterValue = string;
export type ErrorMessage = string;
export type Message = string;
export type ApplicationId = string;
export type VersionId = string;
export type ETag = string;
export type Repository = string;
export type CommitId = string;
export type RawStringContent = string;
export type RawStringSha256 = string;
export type AlarmName = string;
export type Percentage = number;
export type WaitTimeInMins = number;
export type MinimumHealthyHostsPerZoneValue = number;
export type Duration = number;
export type ELBName = string;
export type TargetGroupName = string;
export type DeploymentGroupId = string;
export type AdditionalDeploymentStatusInfo = string;
export type InstanceArn = string;
export type AutoScalingGroupHook = string;
export type DeploymentConfigId = string;
export type ListenerArn = string;
export type LifecycleEventName = string;
export type InstanceCount = number;
export type TargetArn = string;
export type CloudFormationResourceType = string;
export type TrafficWeight = number;
export type ScriptName = string;
export type LifecycleMessage = string;
export type LogTail = string;
export type LambdaFunctionName = string;
export type LambdaFunctionAlias = string;
export type Version = string;
export type ECSTaskSetIdentifier = string;
export type ECSTaskSetCount = number;
export type ECSTaskSetStatus = string;

//# Schemas
export type InstanceNameList = string[];
export const InstanceNameList = S.Array(S.String);
export type ApplicationsList = string[];
export const ApplicationsList = S.Array(S.String);
export type DeploymentGroupsList = string[];
export const DeploymentGroupsList = S.Array(S.String);
export type InstancesList = string[];
export const InstancesList = S.Array(S.String);
export type DeploymentsList = string[];
export const DeploymentsList = S.Array(S.String);
export type TargetIdList = string[];
export const TargetIdList = S.Array(S.String);
export type AutoScalingGroupNameList = string[];
export const AutoScalingGroupNameList = S.Array(S.String);
export type InstanceStatusList = string[];
export const InstanceStatusList = S.Array(S.String);
export type InstanceTypeList = string[];
export const InstanceTypeList = S.Array(S.String);
export type DeploymentStatusList = string[];
export const DeploymentStatusList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchGetApplicationsInput {
  applicationNames: ApplicationsList;
}
export const BatchGetApplicationsInput = S.suspend(() =>
  S.Struct({ applicationNames: ApplicationsList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetApplicationsInput",
}) as any as S.Schema<BatchGetApplicationsInput>;
export interface BatchGetDeploymentGroupsInput {
  applicationName: string;
  deploymentGroupNames: DeploymentGroupsList;
}
export const BatchGetDeploymentGroupsInput = S.suspend(() =>
  S.Struct({
    applicationName: S.String,
    deploymentGroupNames: DeploymentGroupsList,
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
  identifier: "BatchGetDeploymentGroupsInput",
}) as any as S.Schema<BatchGetDeploymentGroupsInput>;
export interface BatchGetDeploymentInstancesInput {
  deploymentId: string;
  instanceIds: InstancesList;
}
export const BatchGetDeploymentInstancesInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String, instanceIds: InstancesList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetDeploymentInstancesInput",
}) as any as S.Schema<BatchGetDeploymentInstancesInput>;
export interface BatchGetDeploymentsInput {
  deploymentIds: DeploymentsList;
}
export const BatchGetDeploymentsInput = S.suspend(() =>
  S.Struct({ deploymentIds: DeploymentsList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetDeploymentsInput",
}) as any as S.Schema<BatchGetDeploymentsInput>;
export interface BatchGetDeploymentTargetsInput {
  deploymentId: string;
  targetIds: TargetIdList;
}
export const BatchGetDeploymentTargetsInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String, targetIds: TargetIdList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetDeploymentTargetsInput",
}) as any as S.Schema<BatchGetDeploymentTargetsInput>;
export interface BatchGetOnPremisesInstancesInput {
  instanceNames: InstanceNameList;
}
export const BatchGetOnPremisesInstancesInput = S.suspend(() =>
  S.Struct({ instanceNames: InstanceNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetOnPremisesInstancesInput",
}) as any as S.Schema<BatchGetOnPremisesInstancesInput>;
export interface ContinueDeploymentInput {
  deploymentId?: string;
  deploymentWaitType?: string;
}
export const ContinueDeploymentInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    deploymentWaitType: S.optional(S.String),
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
  identifier: "ContinueDeploymentInput",
}) as any as S.Schema<ContinueDeploymentInput>;
export interface ContinueDeploymentResponse {}
export const ContinueDeploymentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ContinueDeploymentResponse",
}) as any as S.Schema<ContinueDeploymentResponse>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateApplicationInput {
  applicationName: string;
  computePlatform?: string;
  tags?: TagList;
}
export const CreateApplicationInput = S.suspend(() =>
  S.Struct({
    applicationName: S.String,
    computePlatform: S.optional(S.String),
    tags: S.optional(TagList),
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
  identifier: "CreateApplicationInput",
}) as any as S.Schema<CreateApplicationInput>;
export interface DeleteApplicationInput {
  applicationName: string;
}
export const DeleteApplicationInput = S.suspend(() =>
  S.Struct({ applicationName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationInput",
}) as any as S.Schema<DeleteApplicationInput>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteDeploymentConfigInput {
  deploymentConfigName: string;
}
export const DeleteDeploymentConfigInput = S.suspend(() =>
  S.Struct({ deploymentConfigName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeploymentConfigInput",
}) as any as S.Schema<DeleteDeploymentConfigInput>;
export interface DeleteDeploymentConfigResponse {}
export const DeleteDeploymentConfigResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDeploymentConfigResponse",
}) as any as S.Schema<DeleteDeploymentConfigResponse>;
export interface DeleteDeploymentGroupInput {
  applicationName: string;
  deploymentGroupName: string;
}
export const DeleteDeploymentGroupInput = S.suspend(() =>
  S.Struct({ applicationName: S.String, deploymentGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDeploymentGroupInput",
}) as any as S.Schema<DeleteDeploymentGroupInput>;
export interface DeleteGitHubAccountTokenInput {
  tokenName?: string;
}
export const DeleteGitHubAccountTokenInput = S.suspend(() =>
  S.Struct({ tokenName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGitHubAccountTokenInput",
}) as any as S.Schema<DeleteGitHubAccountTokenInput>;
export interface DeleteResourcesByExternalIdInput {
  externalId?: string;
}
export const DeleteResourcesByExternalIdInput = S.suspend(() =>
  S.Struct({ externalId: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourcesByExternalIdInput",
}) as any as S.Schema<DeleteResourcesByExternalIdInput>;
export interface DeleteResourcesByExternalIdOutput {}
export const DeleteResourcesByExternalIdOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourcesByExternalIdOutput",
}) as any as S.Schema<DeleteResourcesByExternalIdOutput>;
export interface DeregisterOnPremisesInstanceInput {
  instanceName: string;
}
export const DeregisterOnPremisesInstanceInput = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterOnPremisesInstanceInput",
}) as any as S.Schema<DeregisterOnPremisesInstanceInput>;
export interface DeregisterOnPremisesInstanceResponse {}
export const DeregisterOnPremisesInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterOnPremisesInstanceResponse",
}) as any as S.Schema<DeregisterOnPremisesInstanceResponse>;
export interface GetApplicationInput {
  applicationName: string;
}
export const GetApplicationInput = S.suspend(() =>
  S.Struct({ applicationName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationInput",
}) as any as S.Schema<GetApplicationInput>;
export interface S3Location {
  bucket?: string;
  key?: string;
  bundleType?: string;
  version?: string;
  eTag?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    key: S.optional(S.String),
    bundleType: S.optional(S.String),
    version: S.optional(S.String),
    eTag: S.optional(S.String),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface GitHubLocation {
  repository?: string;
  commitId?: string;
}
export const GitHubLocation = S.suspend(() =>
  S.Struct({
    repository: S.optional(S.String),
    commitId: S.optional(S.String),
  }),
).annotations({
  identifier: "GitHubLocation",
}) as any as S.Schema<GitHubLocation>;
export interface RawString {
  content?: string;
  sha256?: string;
}
export const RawString = S.suspend(() =>
  S.Struct({ content: S.optional(S.String), sha256: S.optional(S.String) }),
).annotations({ identifier: "RawString" }) as any as S.Schema<RawString>;
export interface AppSpecContent {
  content?: string;
  sha256?: string;
}
export const AppSpecContent = S.suspend(() =>
  S.Struct({ content: S.optional(S.String), sha256: S.optional(S.String) }),
).annotations({
  identifier: "AppSpecContent",
}) as any as S.Schema<AppSpecContent>;
export interface RevisionLocation {
  revisionType?: string;
  s3Location?: S3Location;
  gitHubLocation?: GitHubLocation;
  string?: RawString;
  appSpecContent?: AppSpecContent;
}
export const RevisionLocation = S.suspend(() =>
  S.Struct({
    revisionType: S.optional(S.String),
    s3Location: S.optional(S3Location),
    gitHubLocation: S.optional(GitHubLocation),
    string: S.optional(RawString),
    appSpecContent: S.optional(AppSpecContent),
  }),
).annotations({
  identifier: "RevisionLocation",
}) as any as S.Schema<RevisionLocation>;
export interface GetApplicationRevisionInput {
  applicationName: string;
  revision: RevisionLocation;
}
export const GetApplicationRevisionInput = S.suspend(() =>
  S.Struct({ applicationName: S.String, revision: RevisionLocation }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRevisionInput",
}) as any as S.Schema<GetApplicationRevisionInput>;
export interface GetDeploymentInput {
  deploymentId: string;
}
export const GetDeploymentInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentInput",
}) as any as S.Schema<GetDeploymentInput>;
export interface GetDeploymentConfigInput {
  deploymentConfigName: string;
}
export const GetDeploymentConfigInput = S.suspend(() =>
  S.Struct({ deploymentConfigName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentConfigInput",
}) as any as S.Schema<GetDeploymentConfigInput>;
export interface GetDeploymentGroupInput {
  applicationName: string;
  deploymentGroupName: string;
}
export const GetDeploymentGroupInput = S.suspend(() =>
  S.Struct({ applicationName: S.String, deploymentGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentGroupInput",
}) as any as S.Schema<GetDeploymentGroupInput>;
export interface GetDeploymentInstanceInput {
  deploymentId: string;
  instanceId: string;
}
export const GetDeploymentInstanceInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String, instanceId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentInstanceInput",
}) as any as S.Schema<GetDeploymentInstanceInput>;
export interface GetDeploymentTargetInput {
  deploymentId: string;
  targetId: string;
}
export const GetDeploymentTargetInput = S.suspend(() =>
  S.Struct({ deploymentId: S.String, targetId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeploymentTargetInput",
}) as any as S.Schema<GetDeploymentTargetInput>;
export interface GetOnPremisesInstanceInput {
  instanceName: string;
}
export const GetOnPremisesInstanceInput = S.suspend(() =>
  S.Struct({ instanceName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOnPremisesInstanceInput",
}) as any as S.Schema<GetOnPremisesInstanceInput>;
export interface ListApplicationRevisionsInput {
  applicationName: string;
  sortBy?: string;
  sortOrder?: string;
  s3Bucket?: string;
  s3KeyPrefix?: string;
  deployed?: string;
  nextToken?: string;
}
export const ListApplicationRevisionsInput = S.suspend(() =>
  S.Struct({
    applicationName: S.String,
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    s3Bucket: S.optional(S.String),
    s3KeyPrefix: S.optional(S.String),
    deployed: S.optional(S.String),
    nextToken: S.optional(S.String),
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
  identifier: "ListApplicationRevisionsInput",
}) as any as S.Schema<ListApplicationRevisionsInput>;
export interface ListApplicationsInput {
  nextToken?: string;
}
export const ListApplicationsInput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsInput",
}) as any as S.Schema<ListApplicationsInput>;
export interface ListDeploymentConfigsInput {
  nextToken?: string;
}
export const ListDeploymentConfigsInput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentConfigsInput",
}) as any as S.Schema<ListDeploymentConfigsInput>;
export interface ListDeploymentGroupsInput {
  applicationName: string;
  nextToken?: string;
}
export const ListDeploymentGroupsInput = S.suspend(() =>
  S.Struct({ applicationName: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentGroupsInput",
}) as any as S.Schema<ListDeploymentGroupsInput>;
export interface ListDeploymentInstancesInput {
  deploymentId: string;
  nextToken?: string;
  instanceStatusFilter?: InstanceStatusList;
  instanceTypeFilter?: InstanceTypeList;
}
export const ListDeploymentInstancesInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    nextToken: S.optional(S.String),
    instanceStatusFilter: S.optional(InstanceStatusList),
    instanceTypeFilter: S.optional(InstanceTypeList),
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
  identifier: "ListDeploymentInstancesInput",
}) as any as S.Schema<ListDeploymentInstancesInput>;
export interface ListGitHubAccountTokenNamesInput {
  nextToken?: string;
}
export const ListGitHubAccountTokenNamesInput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGitHubAccountTokenNamesInput",
}) as any as S.Schema<ListGitHubAccountTokenNamesInput>;
export interface TagFilter {
  Key?: string;
  Value?: string;
  Type?: string;
}
export const TagFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export type TagFilterList = TagFilter[];
export const TagFilterList = S.Array(TagFilter);
export interface ListOnPremisesInstancesInput {
  registrationStatus?: string;
  tagFilters?: TagFilterList;
  nextToken?: string;
}
export const ListOnPremisesInstancesInput = S.suspend(() =>
  S.Struct({
    registrationStatus: S.optional(S.String),
    tagFilters: S.optional(TagFilterList),
    nextToken: S.optional(S.String),
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
  identifier: "ListOnPremisesInstancesInput",
}) as any as S.Schema<ListOnPremisesInstancesInput>;
export interface ListTagsForResourceInput {
  ResourceArn: string;
  NextToken?: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface PutLifecycleEventHookExecutionStatusInput {
  deploymentId?: string;
  lifecycleEventHookExecutionId?: string;
  status?: string;
}
export const PutLifecycleEventHookExecutionStatusInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    lifecycleEventHookExecutionId: S.optional(S.String),
    status: S.optional(S.String),
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
  identifier: "PutLifecycleEventHookExecutionStatusInput",
}) as any as S.Schema<PutLifecycleEventHookExecutionStatusInput>;
export interface RegisterApplicationRevisionInput {
  applicationName: string;
  description?: string;
  revision: RevisionLocation;
}
export const RegisterApplicationRevisionInput = S.suspend(() =>
  S.Struct({
    applicationName: S.String,
    description: S.optional(S.String),
    revision: RevisionLocation,
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
  identifier: "RegisterApplicationRevisionInput",
}) as any as S.Schema<RegisterApplicationRevisionInput>;
export interface RegisterApplicationRevisionResponse {}
export const RegisterApplicationRevisionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterApplicationRevisionResponse",
}) as any as S.Schema<RegisterApplicationRevisionResponse>;
export interface RegisterOnPremisesInstanceInput {
  instanceName: string;
  iamSessionArn?: string;
  iamUserArn?: string;
}
export const RegisterOnPremisesInstanceInput = S.suspend(() =>
  S.Struct({
    instanceName: S.String,
    iamSessionArn: S.optional(S.String),
    iamUserArn: S.optional(S.String),
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
  identifier: "RegisterOnPremisesInstanceInput",
}) as any as S.Schema<RegisterOnPremisesInstanceInput>;
export interface RegisterOnPremisesInstanceResponse {}
export const RegisterOnPremisesInstanceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterOnPremisesInstanceResponse",
}) as any as S.Schema<RegisterOnPremisesInstanceResponse>;
export interface RemoveTagsFromOnPremisesInstancesInput {
  tags: TagList;
  instanceNames: InstanceNameList;
}
export const RemoveTagsFromOnPremisesInstancesInput = S.suspend(() =>
  S.Struct({ tags: TagList, instanceNames: InstanceNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsFromOnPremisesInstancesInput",
}) as any as S.Schema<RemoveTagsFromOnPremisesInstancesInput>;
export interface RemoveTagsFromOnPremisesInstancesResponse {}
export const RemoveTagsFromOnPremisesInstancesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromOnPremisesInstancesResponse",
}) as any as S.Schema<RemoveTagsFromOnPremisesInstancesResponse>;
export interface SkipWaitTimeForInstanceTerminationInput {
  deploymentId?: string;
}
export const SkipWaitTimeForInstanceTerminationInput = S.suspend(() =>
  S.Struct({ deploymentId: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SkipWaitTimeForInstanceTerminationInput",
}) as any as S.Schema<SkipWaitTimeForInstanceTerminationInput>;
export interface SkipWaitTimeForInstanceTerminationResponse {}
export const SkipWaitTimeForInstanceTerminationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SkipWaitTimeForInstanceTerminationResponse",
}) as any as S.Schema<SkipWaitTimeForInstanceTerminationResponse>;
export interface StopDeploymentInput {
  deploymentId: string;
  autoRollbackEnabled?: boolean;
}
export const StopDeploymentInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    autoRollbackEnabled: S.optional(S.Boolean),
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
  identifier: "StopDeploymentInput",
}) as any as S.Schema<StopDeploymentInput>;
export interface TagResourceInput {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface UpdateApplicationInput {
  applicationName?: string;
  newApplicationName?: string;
}
export const UpdateApplicationInput = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    newApplicationName: S.optional(S.String),
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
  identifier: "UpdateApplicationInput",
}) as any as S.Schema<UpdateApplicationInput>;
export interface UpdateApplicationResponse {}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface EC2TagFilter {
  Key?: string;
  Value?: string;
  Type?: string;
}
export const EC2TagFilter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({ identifier: "EC2TagFilter" }) as any as S.Schema<EC2TagFilter>;
export type EC2TagFilterList = EC2TagFilter[];
export const EC2TagFilterList = S.Array(EC2TagFilter);
export type TriggerEventTypeList = string[];
export const TriggerEventTypeList = S.Array(S.String);
export interface TriggerConfig {
  triggerName?: string;
  triggerTargetArn?: string;
  triggerEvents?: TriggerEventTypeList;
}
export const TriggerConfig = S.suspend(() =>
  S.Struct({
    triggerName: S.optional(S.String),
    triggerTargetArn: S.optional(S.String),
    triggerEvents: S.optional(TriggerEventTypeList),
  }),
).annotations({
  identifier: "TriggerConfig",
}) as any as S.Schema<TriggerConfig>;
export type TriggerConfigList = TriggerConfig[];
export const TriggerConfigList = S.Array(TriggerConfig);
export interface Alarm {
  name?: string;
}
export const Alarm = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({ identifier: "Alarm" }) as any as S.Schema<Alarm>;
export type AlarmList = Alarm[];
export const AlarmList = S.Array(Alarm);
export interface AlarmConfiguration {
  enabled?: boolean;
  ignorePollAlarmFailure?: boolean;
  alarms?: AlarmList;
}
export const AlarmConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    ignorePollAlarmFailure: S.optional(S.Boolean),
    alarms: S.optional(AlarmList),
  }),
).annotations({
  identifier: "AlarmConfiguration",
}) as any as S.Schema<AlarmConfiguration>;
export type AutoRollbackEventsList = string[];
export const AutoRollbackEventsList = S.Array(S.String);
export interface AutoRollbackConfiguration {
  enabled?: boolean;
  events?: AutoRollbackEventsList;
}
export const AutoRollbackConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    events: S.optional(AutoRollbackEventsList),
  }),
).annotations({
  identifier: "AutoRollbackConfiguration",
}) as any as S.Schema<AutoRollbackConfiguration>;
export interface DeploymentStyle {
  deploymentType?: string;
  deploymentOption?: string;
}
export const DeploymentStyle = S.suspend(() =>
  S.Struct({
    deploymentType: S.optional(S.String),
    deploymentOption: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentStyle",
}) as any as S.Schema<DeploymentStyle>;
export interface BlueInstanceTerminationOption {
  action?: string;
  terminationWaitTimeInMinutes?: number;
}
export const BlueInstanceTerminationOption = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    terminationWaitTimeInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "BlueInstanceTerminationOption",
}) as any as S.Schema<BlueInstanceTerminationOption>;
export interface DeploymentReadyOption {
  actionOnTimeout?: string;
  waitTimeInMinutes?: number;
}
export const DeploymentReadyOption = S.suspend(() =>
  S.Struct({
    actionOnTimeout: S.optional(S.String),
    waitTimeInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeploymentReadyOption",
}) as any as S.Schema<DeploymentReadyOption>;
export interface GreenFleetProvisioningOption {
  action?: string;
}
export const GreenFleetProvisioningOption = S.suspend(() =>
  S.Struct({ action: S.optional(S.String) }),
).annotations({
  identifier: "GreenFleetProvisioningOption",
}) as any as S.Schema<GreenFleetProvisioningOption>;
export interface BlueGreenDeploymentConfiguration {
  terminateBlueInstancesOnDeploymentSuccess?: BlueInstanceTerminationOption;
  deploymentReadyOption?: DeploymentReadyOption;
  greenFleetProvisioningOption?: GreenFleetProvisioningOption;
}
export const BlueGreenDeploymentConfiguration = S.suspend(() =>
  S.Struct({
    terminateBlueInstancesOnDeploymentSuccess: S.optional(
      BlueInstanceTerminationOption,
    ),
    deploymentReadyOption: S.optional(DeploymentReadyOption),
    greenFleetProvisioningOption: S.optional(GreenFleetProvisioningOption),
  }),
).annotations({
  identifier: "BlueGreenDeploymentConfiguration",
}) as any as S.Schema<BlueGreenDeploymentConfiguration>;
export interface ELBInfo {
  name?: string;
}
export const ELBInfo = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({ identifier: "ELBInfo" }) as any as S.Schema<ELBInfo>;
export type ELBInfoList = ELBInfo[];
export const ELBInfoList = S.Array(ELBInfo);
export interface TargetGroupInfo {
  name?: string;
}
export const TargetGroupInfo = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({
  identifier: "TargetGroupInfo",
}) as any as S.Schema<TargetGroupInfo>;
export type TargetGroupInfoList = TargetGroupInfo[];
export const TargetGroupInfoList = S.Array(TargetGroupInfo);
export type ListenerArnList = string[];
export const ListenerArnList = S.Array(S.String);
export interface TrafficRoute {
  listenerArns?: ListenerArnList;
}
export const TrafficRoute = S.suspend(() =>
  S.Struct({ listenerArns: S.optional(ListenerArnList) }),
).annotations({ identifier: "TrafficRoute" }) as any as S.Schema<TrafficRoute>;
export interface TargetGroupPairInfo {
  targetGroups?: TargetGroupInfoList;
  prodTrafficRoute?: TrafficRoute;
  testTrafficRoute?: TrafficRoute;
}
export const TargetGroupPairInfo = S.suspend(() =>
  S.Struct({
    targetGroups: S.optional(TargetGroupInfoList),
    prodTrafficRoute: S.optional(TrafficRoute),
    testTrafficRoute: S.optional(TrafficRoute),
  }),
).annotations({
  identifier: "TargetGroupPairInfo",
}) as any as S.Schema<TargetGroupPairInfo>;
export type TargetGroupPairInfoList = TargetGroupPairInfo[];
export const TargetGroupPairInfoList = S.Array(TargetGroupPairInfo);
export interface LoadBalancerInfo {
  elbInfoList?: ELBInfoList;
  targetGroupInfoList?: TargetGroupInfoList;
  targetGroupPairInfoList?: TargetGroupPairInfoList;
}
export const LoadBalancerInfo = S.suspend(() =>
  S.Struct({
    elbInfoList: S.optional(ELBInfoList),
    targetGroupInfoList: S.optional(TargetGroupInfoList),
    targetGroupPairInfoList: S.optional(TargetGroupPairInfoList),
  }),
).annotations({
  identifier: "LoadBalancerInfo",
}) as any as S.Schema<LoadBalancerInfo>;
export type EC2TagSetList = EC2TagFilterList[];
export const EC2TagSetList = S.Array(EC2TagFilterList);
export interface EC2TagSet {
  ec2TagSetList?: EC2TagSetList;
}
export const EC2TagSet = S.suspend(() =>
  S.Struct({ ec2TagSetList: S.optional(EC2TagSetList) }),
).annotations({ identifier: "EC2TagSet" }) as any as S.Schema<EC2TagSet>;
export interface ECSService {
  serviceName?: string;
  clusterName?: string;
}
export const ECSService = S.suspend(() =>
  S.Struct({
    serviceName: S.optional(S.String),
    clusterName: S.optional(S.String),
  }),
).annotations({ identifier: "ECSService" }) as any as S.Schema<ECSService>;
export type ECSServiceList = ECSService[];
export const ECSServiceList = S.Array(ECSService);
export type OnPremisesTagSetList = TagFilterList[];
export const OnPremisesTagSetList = S.Array(TagFilterList);
export interface OnPremisesTagSet {
  onPremisesTagSetList?: OnPremisesTagSetList;
}
export const OnPremisesTagSet = S.suspend(() =>
  S.Struct({ onPremisesTagSetList: S.optional(OnPremisesTagSetList) }),
).annotations({
  identifier: "OnPremisesTagSet",
}) as any as S.Schema<OnPremisesTagSet>;
export interface UpdateDeploymentGroupInput {
  applicationName: string;
  currentDeploymentGroupName: string;
  newDeploymentGroupName?: string;
  deploymentConfigName?: string;
  ec2TagFilters?: EC2TagFilterList;
  onPremisesInstanceTagFilters?: TagFilterList;
  autoScalingGroups?: AutoScalingGroupNameList;
  serviceRoleArn?: string;
  triggerConfigurations?: TriggerConfigList;
  alarmConfiguration?: AlarmConfiguration;
  autoRollbackConfiguration?: AutoRollbackConfiguration;
  outdatedInstancesStrategy?: string;
  deploymentStyle?: DeploymentStyle;
  blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
  loadBalancerInfo?: LoadBalancerInfo;
  ec2TagSet?: EC2TagSet;
  ecsServices?: ECSServiceList;
  onPremisesTagSet?: OnPremisesTagSet;
  terminationHookEnabled?: boolean;
}
export const UpdateDeploymentGroupInput = S.suspend(() =>
  S.Struct({
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
  identifier: "UpdateDeploymentGroupInput",
}) as any as S.Schema<UpdateDeploymentGroupInput>;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export interface TargetInstances {
  tagFilters?: EC2TagFilterList;
  autoScalingGroups?: AutoScalingGroupNameList;
  ec2TagSet?: EC2TagSet;
}
export const TargetInstances = S.suspend(() =>
  S.Struct({
    tagFilters: S.optional(EC2TagFilterList),
    autoScalingGroups: S.optional(AutoScalingGroupNameList),
    ec2TagSet: S.optional(EC2TagSet),
  }),
).annotations({
  identifier: "TargetInstances",
}) as any as S.Schema<TargetInstances>;
export interface MinimumHealthyHosts {
  type?: string;
  value?: number;
}
export const MinimumHealthyHosts = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "MinimumHealthyHosts",
}) as any as S.Schema<MinimumHealthyHosts>;
export type DeploymentConfigsList = string[];
export const DeploymentConfigsList = S.Array(S.String);
export interface TimeRange {
  start?: Date;
  end?: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    start: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    end: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export type TargetFilters = { [key: string]: FilterValueList };
export const TargetFilters = S.Record({
  key: S.String,
  value: FilterValueList,
});
export type GitHubAccountTokenNameList = string[];
export const GitHubAccountTokenNameList = S.Array(S.String);
export interface AddTagsToOnPremisesInstancesInput {
  tags: TagList;
  instanceNames: InstanceNameList;
}
export const AddTagsToOnPremisesInstancesInput = S.suspend(() =>
  S.Struct({ tags: TagList, instanceNames: InstanceNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsToOnPremisesInstancesInput",
}) as any as S.Schema<AddTagsToOnPremisesInstancesInput>;
export interface AddTagsToOnPremisesInstancesResponse {}
export const AddTagsToOnPremisesInstancesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToOnPremisesInstancesResponse",
}) as any as S.Schema<AddTagsToOnPremisesInstancesResponse>;
export interface CreateApplicationOutput {
  applicationId?: string;
}
export const CreateApplicationOutput = S.suspend(() =>
  S.Struct({ applicationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateApplicationOutput",
}) as any as S.Schema<CreateApplicationOutput>;
export interface DeleteGitHubAccountTokenOutput {
  tokenName?: string;
}
export const DeleteGitHubAccountTokenOutput = S.suspend(() =>
  S.Struct({ tokenName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteGitHubAccountTokenOutput",
}) as any as S.Schema<DeleteGitHubAccountTokenOutput>;
export interface ApplicationInfo {
  applicationId?: string;
  applicationName?: string;
  createTime?: Date;
  linkedToGitHub?: boolean;
  gitHubAccountName?: string;
  computePlatform?: string;
}
export const ApplicationInfo = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    applicationName: S.optional(S.String),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    linkedToGitHub: S.optional(S.Boolean),
    gitHubAccountName: S.optional(S.String),
    computePlatform: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationInfo",
}) as any as S.Schema<ApplicationInfo>;
export interface GetApplicationOutput {
  application?: ApplicationInfo;
}
export const GetApplicationOutput = S.suspend(() =>
  S.Struct({ application: S.optional(ApplicationInfo) }).pipe(ns),
).annotations({
  identifier: "GetApplicationOutput",
}) as any as S.Schema<GetApplicationOutput>;
export interface ErrorInformation {
  code?: string;
  message?: string;
}
export const ErrorInformation = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "ErrorInformation",
}) as any as S.Schema<ErrorInformation>;
export interface DeploymentOverview {
  Pending?: number;
  InProgress?: number;
  Succeeded?: number;
  Failed?: number;
  Skipped?: number;
  Ready?: number;
}
export const DeploymentOverview = S.suspend(() =>
  S.Struct({
    Pending: S.optional(S.Number),
    InProgress: S.optional(S.Number),
    Succeeded: S.optional(S.Number),
    Failed: S.optional(S.Number),
    Skipped: S.optional(S.Number),
    Ready: S.optional(S.Number),
  }),
).annotations({
  identifier: "DeploymentOverview",
}) as any as S.Schema<DeploymentOverview>;
export interface RollbackInfo {
  rollbackDeploymentId?: string;
  rollbackTriggeringDeploymentId?: string;
  rollbackMessage?: string;
}
export const RollbackInfo = S.suspend(() =>
  S.Struct({
    rollbackDeploymentId: S.optional(S.String),
    rollbackTriggeringDeploymentId: S.optional(S.String),
    rollbackMessage: S.optional(S.String),
  }),
).annotations({ identifier: "RollbackInfo" }) as any as S.Schema<RollbackInfo>;
export type DeploymentStatusMessageList = string[];
export const DeploymentStatusMessageList = S.Array(S.String);
export interface RelatedDeployments {
  autoUpdateOutdatedInstancesRootDeploymentId?: string;
  autoUpdateOutdatedInstancesDeploymentIds?: DeploymentsList;
}
export const RelatedDeployments = S.suspend(() =>
  S.Struct({
    autoUpdateOutdatedInstancesRootDeploymentId: S.optional(S.String),
    autoUpdateOutdatedInstancesDeploymentIds: S.optional(DeploymentsList),
  }),
).annotations({
  identifier: "RelatedDeployments",
}) as any as S.Schema<RelatedDeployments>;
export interface DeploymentInfo {
  applicationName?: string;
  deploymentGroupName?: string;
  deploymentConfigName?: string;
  deploymentId?: string;
  previousRevision?: RevisionLocation;
  revision?: RevisionLocation;
  status?: string;
  errorInformation?: ErrorInformation;
  createTime?: Date;
  startTime?: Date;
  completeTime?: Date;
  deploymentOverview?: DeploymentOverview;
  description?: string;
  creator?: string;
  ignoreApplicationStopFailures?: boolean;
  autoRollbackConfiguration?: AutoRollbackConfiguration;
  updateOutdatedInstancesOnly?: boolean;
  rollbackInfo?: RollbackInfo;
  deploymentStyle?: DeploymentStyle;
  targetInstances?: TargetInstances;
  instanceTerminationWaitTimeStarted?: boolean;
  blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
  loadBalancerInfo?: LoadBalancerInfo;
  additionalDeploymentStatusInfo?: string;
  fileExistsBehavior?: string;
  deploymentStatusMessages?: DeploymentStatusMessageList;
  computePlatform?: string;
  externalId?: string;
  relatedDeployments?: RelatedDeployments;
  overrideAlarmConfiguration?: AlarmConfiguration;
}
export const DeploymentInfo = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DeploymentInfo",
}) as any as S.Schema<DeploymentInfo>;
export interface GetDeploymentOutput {
  deploymentInfo?: DeploymentInfo;
}
export const GetDeploymentOutput = S.suspend(() =>
  S.Struct({ deploymentInfo: S.optional(DeploymentInfo) }).pipe(ns),
).annotations({
  identifier: "GetDeploymentOutput",
}) as any as S.Schema<GetDeploymentOutput>;
export interface AutoScalingGroup {
  name?: string;
  hook?: string;
  terminationHook?: string;
}
export const AutoScalingGroup = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    hook: S.optional(S.String),
    terminationHook: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoScalingGroup",
}) as any as S.Schema<AutoScalingGroup>;
export type AutoScalingGroupList = AutoScalingGroup[];
export const AutoScalingGroupList = S.Array(AutoScalingGroup);
export interface LastDeploymentInfo {
  deploymentId?: string;
  status?: string;
  endTime?: Date;
  createTime?: Date;
}
export const LastDeploymentInfo = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    status: S.optional(S.String),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LastDeploymentInfo",
}) as any as S.Schema<LastDeploymentInfo>;
export interface DeploymentGroupInfo {
  applicationName?: string;
  deploymentGroupId?: string;
  deploymentGroupName?: string;
  deploymentConfigName?: string;
  ec2TagFilters?: EC2TagFilterList;
  onPremisesInstanceTagFilters?: TagFilterList;
  autoScalingGroups?: AutoScalingGroupList;
  serviceRoleArn?: string;
  targetRevision?: RevisionLocation;
  triggerConfigurations?: TriggerConfigList;
  alarmConfiguration?: AlarmConfiguration;
  autoRollbackConfiguration?: AutoRollbackConfiguration;
  deploymentStyle?: DeploymentStyle;
  outdatedInstancesStrategy?: string;
  blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
  loadBalancerInfo?: LoadBalancerInfo;
  lastSuccessfulDeployment?: LastDeploymentInfo;
  lastAttemptedDeployment?: LastDeploymentInfo;
  ec2TagSet?: EC2TagSet;
  onPremisesTagSet?: OnPremisesTagSet;
  computePlatform?: string;
  ecsServices?: ECSServiceList;
  terminationHookEnabled?: boolean;
}
export const DeploymentGroupInfo = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DeploymentGroupInfo",
}) as any as S.Schema<DeploymentGroupInfo>;
export interface GetDeploymentGroupOutput {
  deploymentGroupInfo?: DeploymentGroupInfo;
}
export const GetDeploymentGroupOutput = S.suspend(() =>
  S.Struct({ deploymentGroupInfo: S.optional(DeploymentGroupInfo) }).pipe(ns),
).annotations({
  identifier: "GetDeploymentGroupOutput",
}) as any as S.Schema<GetDeploymentGroupOutput>;
export interface Diagnostics {
  errorCode?: string;
  scriptName?: string;
  message?: string;
  logTail?: string;
}
export const Diagnostics = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(S.String),
    scriptName: S.optional(S.String),
    message: S.optional(S.String),
    logTail: S.optional(S.String),
  }),
).annotations({ identifier: "Diagnostics" }) as any as S.Schema<Diagnostics>;
export interface LifecycleEvent {
  lifecycleEventName?: string;
  diagnostics?: Diagnostics;
  startTime?: Date;
  endTime?: Date;
  status?: string;
}
export const LifecycleEvent = S.suspend(() =>
  S.Struct({
    lifecycleEventName: S.optional(S.String),
    diagnostics: S.optional(Diagnostics),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "LifecycleEvent",
}) as any as S.Schema<LifecycleEvent>;
export type LifecycleEventList = LifecycleEvent[];
export const LifecycleEventList = S.Array(LifecycleEvent);
export interface InstanceSummary {
  deploymentId?: string;
  instanceId?: string;
  status?: string;
  lastUpdatedAt?: Date;
  lifecycleEvents?: LifecycleEventList;
  instanceType?: string;
}
export const InstanceSummary = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    instanceId: S.optional(S.String),
    status: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lifecycleEvents: S.optional(LifecycleEventList),
    instanceType: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceSummary",
}) as any as S.Schema<InstanceSummary>;
export interface GetDeploymentInstanceOutput {
  instanceSummary?: InstanceSummary;
}
export const GetDeploymentInstanceOutput = S.suspend(() =>
  S.Struct({ instanceSummary: S.optional(InstanceSummary) }).pipe(ns),
).annotations({
  identifier: "GetDeploymentInstanceOutput",
}) as any as S.Schema<GetDeploymentInstanceOutput>;
export interface InstanceTarget {
  deploymentId?: string;
  targetId?: string;
  targetArn?: string;
  status?: string;
  lastUpdatedAt?: Date;
  lifecycleEvents?: LifecycleEventList;
  instanceLabel?: string;
}
export const InstanceTarget = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    targetId: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lifecycleEvents: S.optional(LifecycleEventList),
    instanceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceTarget",
}) as any as S.Schema<InstanceTarget>;
export interface LambdaFunctionInfo {
  functionName?: string;
  functionAlias?: string;
  currentVersion?: string;
  targetVersion?: string;
  targetVersionWeight?: number;
}
export const LambdaFunctionInfo = S.suspend(() =>
  S.Struct({
    functionName: S.optional(S.String),
    functionAlias: S.optional(S.String),
    currentVersion: S.optional(S.String),
    targetVersion: S.optional(S.String),
    targetVersionWeight: S.optional(S.Number),
  }),
).annotations({
  identifier: "LambdaFunctionInfo",
}) as any as S.Schema<LambdaFunctionInfo>;
export interface LambdaTarget {
  deploymentId?: string;
  targetId?: string;
  targetArn?: string;
  status?: string;
  lastUpdatedAt?: Date;
  lifecycleEvents?: LifecycleEventList;
  lambdaFunctionInfo?: LambdaFunctionInfo;
}
export const LambdaTarget = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    targetId: S.optional(S.String),
    targetArn: S.optional(S.String),
    status: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lifecycleEvents: S.optional(LifecycleEventList),
    lambdaFunctionInfo: S.optional(LambdaFunctionInfo),
  }),
).annotations({ identifier: "LambdaTarget" }) as any as S.Schema<LambdaTarget>;
export interface ECSTaskSet {
  identifer?: string;
  desiredCount?: number;
  pendingCount?: number;
  runningCount?: number;
  status?: string;
  trafficWeight?: number;
  targetGroup?: TargetGroupInfo;
  taskSetLabel?: string;
}
export const ECSTaskSet = S.suspend(() =>
  S.Struct({
    identifer: S.optional(S.String),
    desiredCount: S.optional(S.Number),
    pendingCount: S.optional(S.Number),
    runningCount: S.optional(S.Number),
    status: S.optional(S.String),
    trafficWeight: S.optional(S.Number),
    targetGroup: S.optional(TargetGroupInfo),
    taskSetLabel: S.optional(S.String),
  }),
).annotations({ identifier: "ECSTaskSet" }) as any as S.Schema<ECSTaskSet>;
export type ECSTaskSetList = ECSTaskSet[];
export const ECSTaskSetList = S.Array(ECSTaskSet);
export interface ECSTarget {
  deploymentId?: string;
  targetId?: string;
  targetArn?: string;
  lastUpdatedAt?: Date;
  lifecycleEvents?: LifecycleEventList;
  status?: string;
  taskSetsInfo?: ECSTaskSetList;
}
export const ECSTarget = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    targetId: S.optional(S.String),
    targetArn: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lifecycleEvents: S.optional(LifecycleEventList),
    status: S.optional(S.String),
    taskSetsInfo: S.optional(ECSTaskSetList),
  }),
).annotations({ identifier: "ECSTarget" }) as any as S.Schema<ECSTarget>;
export interface CloudFormationTarget {
  deploymentId?: string;
  targetId?: string;
  lastUpdatedAt?: Date;
  lifecycleEvents?: LifecycleEventList;
  status?: string;
  resourceType?: string;
  targetVersionWeight?: number;
}
export const CloudFormationTarget = S.suspend(() =>
  S.Struct({
    deploymentId: S.optional(S.String),
    targetId: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lifecycleEvents: S.optional(LifecycleEventList),
    status: S.optional(S.String),
    resourceType: S.optional(S.String),
    targetVersionWeight: S.optional(S.Number),
  }),
).annotations({
  identifier: "CloudFormationTarget",
}) as any as S.Schema<CloudFormationTarget>;
export interface DeploymentTarget {
  deploymentTargetType?: string;
  instanceTarget?: InstanceTarget;
  lambdaTarget?: LambdaTarget;
  ecsTarget?: ECSTarget;
  cloudFormationTarget?: CloudFormationTarget;
}
export const DeploymentTarget = S.suspend(() =>
  S.Struct({
    deploymentTargetType: S.optional(S.String),
    instanceTarget: S.optional(InstanceTarget),
    lambdaTarget: S.optional(LambdaTarget),
    ecsTarget: S.optional(ECSTarget),
    cloudFormationTarget: S.optional(CloudFormationTarget),
  }),
).annotations({
  identifier: "DeploymentTarget",
}) as any as S.Schema<DeploymentTarget>;
export interface GetDeploymentTargetOutput {
  deploymentTarget?: DeploymentTarget;
}
export const GetDeploymentTargetOutput = S.suspend(() =>
  S.Struct({ deploymentTarget: S.optional(DeploymentTarget) }).pipe(ns),
).annotations({
  identifier: "GetDeploymentTargetOutput",
}) as any as S.Schema<GetDeploymentTargetOutput>;
export interface InstanceInfo {
  instanceName?: string;
  iamSessionArn?: string;
  iamUserArn?: string;
  instanceArn?: string;
  registerTime?: Date;
  deregisterTime?: Date;
  tags?: TagList;
}
export const InstanceInfo = S.suspend(() =>
  S.Struct({
    instanceName: S.optional(S.String),
    iamSessionArn: S.optional(S.String),
    iamUserArn: S.optional(S.String),
    instanceArn: S.optional(S.String),
    registerTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deregisterTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagList),
  }),
).annotations({ identifier: "InstanceInfo" }) as any as S.Schema<InstanceInfo>;
export interface GetOnPremisesInstanceOutput {
  instanceInfo?: InstanceInfo;
}
export const GetOnPremisesInstanceOutput = S.suspend(() =>
  S.Struct({ instanceInfo: S.optional(InstanceInfo) }).pipe(ns),
).annotations({
  identifier: "GetOnPremisesInstanceOutput",
}) as any as S.Schema<GetOnPremisesInstanceOutput>;
export type RevisionLocationList = RevisionLocation[];
export const RevisionLocationList = S.Array(RevisionLocation);
export interface ListApplicationRevisionsOutput {
  revisions?: RevisionLocationList;
  nextToken?: string;
}
export const ListApplicationRevisionsOutput = S.suspend(() =>
  S.Struct({
    revisions: S.optional(RevisionLocationList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationRevisionsOutput",
}) as any as S.Schema<ListApplicationRevisionsOutput>;
export interface ListApplicationsOutput {
  applications?: ApplicationsList;
  nextToken?: string;
}
export const ListApplicationsOutput = S.suspend(() =>
  S.Struct({
    applications: S.optional(ApplicationsList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApplicationsOutput",
}) as any as S.Schema<ListApplicationsOutput>;
export interface ListDeploymentConfigsOutput {
  deploymentConfigsList?: DeploymentConfigsList;
  nextToken?: string;
}
export const ListDeploymentConfigsOutput = S.suspend(() =>
  S.Struct({
    deploymentConfigsList: S.optional(DeploymentConfigsList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeploymentConfigsOutput",
}) as any as S.Schema<ListDeploymentConfigsOutput>;
export interface ListDeploymentGroupsOutput {
  applicationName?: string;
  deploymentGroups?: DeploymentGroupsList;
  nextToken?: string;
}
export const ListDeploymentGroupsOutput = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    deploymentGroups: S.optional(DeploymentGroupsList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeploymentGroupsOutput",
}) as any as S.Schema<ListDeploymentGroupsOutput>;
export interface ListDeploymentInstancesOutput {
  instancesList?: InstancesList;
  nextToken?: string;
}
export const ListDeploymentInstancesOutput = S.suspend(() =>
  S.Struct({
    instancesList: S.optional(InstancesList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeploymentInstancesOutput",
}) as any as S.Schema<ListDeploymentInstancesOutput>;
export interface ListDeploymentsInput {
  applicationName?: string;
  deploymentGroupName?: string;
  externalId?: string;
  includeOnlyStatuses?: DeploymentStatusList;
  createTimeRange?: TimeRange;
  nextToken?: string;
}
export const ListDeploymentsInput = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    deploymentGroupName: S.optional(S.String),
    externalId: S.optional(S.String),
    includeOnlyStatuses: S.optional(DeploymentStatusList),
    createTimeRange: S.optional(TimeRange),
    nextToken: S.optional(S.String),
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
  identifier: "ListDeploymentsInput",
}) as any as S.Schema<ListDeploymentsInput>;
export interface ListDeploymentTargetsInput {
  deploymentId: string;
  nextToken?: string;
  targetFilters?: TargetFilters;
}
export const ListDeploymentTargetsInput = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    nextToken: S.optional(S.String),
    targetFilters: S.optional(TargetFilters),
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
  identifier: "ListDeploymentTargetsInput",
}) as any as S.Schema<ListDeploymentTargetsInput>;
export interface ListGitHubAccountTokenNamesOutput {
  tokenNameList?: GitHubAccountTokenNameList;
  nextToken?: string;
}
export const ListGitHubAccountTokenNamesOutput = S.suspend(() =>
  S.Struct({
    tokenNameList: S.optional(GitHubAccountTokenNameList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGitHubAccountTokenNamesOutput",
}) as any as S.Schema<ListGitHubAccountTokenNamesOutput>;
export interface ListOnPremisesInstancesOutput {
  instanceNames?: InstanceNameList;
  nextToken?: string;
}
export const ListOnPremisesInstancesOutput = S.suspend(() =>
  S.Struct({
    instanceNames: S.optional(InstanceNameList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOnPremisesInstancesOutput",
}) as any as S.Schema<ListOnPremisesInstancesOutput>;
export interface ListTagsForResourceOutput {
  Tags?: TagList;
  NextToken?: string;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PutLifecycleEventHookExecutionStatusOutput {
  lifecycleEventHookExecutionId?: string;
}
export const PutLifecycleEventHookExecutionStatusOutput = S.suspend(() =>
  S.Struct({ lifecycleEventHookExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutLifecycleEventHookExecutionStatusOutput",
}) as any as S.Schema<PutLifecycleEventHookExecutionStatusOutput>;
export interface StopDeploymentOutput {
  status?: string;
  statusMessage?: string;
}
export const StopDeploymentOutput = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "StopDeploymentOutput",
}) as any as S.Schema<StopDeploymentOutput>;
export interface UpdateDeploymentGroupOutput {
  hooksNotCleanedUp?: AutoScalingGroupList;
}
export const UpdateDeploymentGroupOutput = S.suspend(() =>
  S.Struct({ hooksNotCleanedUp: S.optional(AutoScalingGroupList) }).pipe(ns),
).annotations({
  identifier: "UpdateDeploymentGroupOutput",
}) as any as S.Schema<UpdateDeploymentGroupOutput>;
export interface TimeBasedCanary {
  canaryPercentage?: number;
  canaryInterval?: number;
}
export const TimeBasedCanary = S.suspend(() =>
  S.Struct({
    canaryPercentage: S.optional(S.Number),
    canaryInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimeBasedCanary",
}) as any as S.Schema<TimeBasedCanary>;
export interface TimeBasedLinear {
  linearPercentage?: number;
  linearInterval?: number;
}
export const TimeBasedLinear = S.suspend(() =>
  S.Struct({
    linearPercentage: S.optional(S.Number),
    linearInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimeBasedLinear",
}) as any as S.Schema<TimeBasedLinear>;
export interface MinimumHealthyHostsPerZone {
  type?: string;
  value?: number;
}
export const MinimumHealthyHostsPerZone = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "MinimumHealthyHostsPerZone",
}) as any as S.Schema<MinimumHealthyHostsPerZone>;
export type ApplicationsInfoList = ApplicationInfo[];
export const ApplicationsInfoList = S.Array(ApplicationInfo);
export type InstanceInfoList = InstanceInfo[];
export const InstanceInfoList = S.Array(InstanceInfo);
export interface TrafficRoutingConfig {
  type?: string;
  timeBasedCanary?: TimeBasedCanary;
  timeBasedLinear?: TimeBasedLinear;
}
export const TrafficRoutingConfig = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    timeBasedCanary: S.optional(TimeBasedCanary),
    timeBasedLinear: S.optional(TimeBasedLinear),
  }),
).annotations({
  identifier: "TrafficRoutingConfig",
}) as any as S.Schema<TrafficRoutingConfig>;
export interface ZonalConfig {
  firstZoneMonitorDurationInSeconds?: number;
  monitorDurationInSeconds?: number;
  minimumHealthyHostsPerZone?: MinimumHealthyHostsPerZone;
}
export const ZonalConfig = S.suspend(() =>
  S.Struct({
    firstZoneMonitorDurationInSeconds: S.optional(S.Number),
    monitorDurationInSeconds: S.optional(S.Number),
    minimumHealthyHostsPerZone: S.optional(MinimumHealthyHostsPerZone),
  }),
).annotations({ identifier: "ZonalConfig" }) as any as S.Schema<ZonalConfig>;
export interface GenericRevisionInfo {
  description?: string;
  deploymentGroups?: DeploymentGroupsList;
  firstUsedTime?: Date;
  lastUsedTime?: Date;
  registerTime?: Date;
}
export const GenericRevisionInfo = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    deploymentGroups: S.optional(DeploymentGroupsList),
    firstUsedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUsedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registerTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GenericRevisionInfo",
}) as any as S.Schema<GenericRevisionInfo>;
export interface DeploymentConfigInfo {
  deploymentConfigId?: string;
  deploymentConfigName?: string;
  minimumHealthyHosts?: MinimumHealthyHosts;
  createTime?: Date;
  computePlatform?: string;
  trafficRoutingConfig?: TrafficRoutingConfig;
  zonalConfig?: ZonalConfig;
}
export const DeploymentConfigInfo = S.suspend(() =>
  S.Struct({
    deploymentConfigId: S.optional(S.String),
    deploymentConfigName: S.optional(S.String),
    minimumHealthyHosts: S.optional(MinimumHealthyHosts),
    createTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    computePlatform: S.optional(S.String),
    trafficRoutingConfig: S.optional(TrafficRoutingConfig),
    zonalConfig: S.optional(ZonalConfig),
  }),
).annotations({
  identifier: "DeploymentConfigInfo",
}) as any as S.Schema<DeploymentConfigInfo>;
export interface BatchGetApplicationRevisionsInput {
  applicationName: string;
  revisions: RevisionLocationList;
}
export const BatchGetApplicationRevisionsInput = S.suspend(() =>
  S.Struct({ applicationName: S.String, revisions: RevisionLocationList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetApplicationRevisionsInput",
}) as any as S.Schema<BatchGetApplicationRevisionsInput>;
export interface BatchGetApplicationsOutput {
  applicationsInfo?: ApplicationsInfoList;
}
export const BatchGetApplicationsOutput = S.suspend(() =>
  S.Struct({ applicationsInfo: S.optional(ApplicationsInfoList) }).pipe(ns),
).annotations({
  identifier: "BatchGetApplicationsOutput",
}) as any as S.Schema<BatchGetApplicationsOutput>;
export interface BatchGetOnPremisesInstancesOutput {
  instanceInfos?: InstanceInfoList;
}
export const BatchGetOnPremisesInstancesOutput = S.suspend(() =>
  S.Struct({ instanceInfos: S.optional(InstanceInfoList) }).pipe(ns),
).annotations({
  identifier: "BatchGetOnPremisesInstancesOutput",
}) as any as S.Schema<BatchGetOnPremisesInstancesOutput>;
export interface CreateDeploymentInput {
  applicationName: string;
  deploymentGroupName?: string;
  revision?: RevisionLocation;
  deploymentConfigName?: string;
  description?: string;
  ignoreApplicationStopFailures?: boolean;
  targetInstances?: TargetInstances;
  autoRollbackConfiguration?: AutoRollbackConfiguration;
  updateOutdatedInstancesOnly?: boolean;
  fileExistsBehavior?: string;
  overrideAlarmConfiguration?: AlarmConfiguration;
}
export const CreateDeploymentInput = S.suspend(() =>
  S.Struct({
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
  identifier: "CreateDeploymentInput",
}) as any as S.Schema<CreateDeploymentInput>;
export interface CreateDeploymentConfigInput {
  deploymentConfigName: string;
  minimumHealthyHosts?: MinimumHealthyHosts;
  trafficRoutingConfig?: TrafficRoutingConfig;
  computePlatform?: string;
  zonalConfig?: ZonalConfig;
}
export const CreateDeploymentConfigInput = S.suspend(() =>
  S.Struct({
    deploymentConfigName: S.String,
    minimumHealthyHosts: S.optional(MinimumHealthyHosts),
    trafficRoutingConfig: S.optional(TrafficRoutingConfig),
    computePlatform: S.optional(S.String),
    zonalConfig: S.optional(ZonalConfig),
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
  identifier: "CreateDeploymentConfigInput",
}) as any as S.Schema<CreateDeploymentConfigInput>;
export interface DeleteDeploymentGroupOutput {
  hooksNotCleanedUp?: AutoScalingGroupList;
}
export const DeleteDeploymentGroupOutput = S.suspend(() =>
  S.Struct({ hooksNotCleanedUp: S.optional(AutoScalingGroupList) }).pipe(ns),
).annotations({
  identifier: "DeleteDeploymentGroupOutput",
}) as any as S.Schema<DeleteDeploymentGroupOutput>;
export interface GetApplicationRevisionOutput {
  applicationName?: string;
  revision?: RevisionLocation;
  revisionInfo?: GenericRevisionInfo;
}
export const GetApplicationRevisionOutput = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    revision: S.optional(RevisionLocation),
    revisionInfo: S.optional(GenericRevisionInfo),
  }).pipe(ns),
).annotations({
  identifier: "GetApplicationRevisionOutput",
}) as any as S.Schema<GetApplicationRevisionOutput>;
export interface GetDeploymentConfigOutput {
  deploymentConfigInfo?: DeploymentConfigInfo;
}
export const GetDeploymentConfigOutput = S.suspend(() =>
  S.Struct({ deploymentConfigInfo: S.optional(DeploymentConfigInfo) }).pipe(ns),
).annotations({
  identifier: "GetDeploymentConfigOutput",
}) as any as S.Schema<GetDeploymentConfigOutput>;
export interface ListDeploymentsOutput {
  deployments?: DeploymentsList;
  nextToken?: string;
}
export const ListDeploymentsOutput = S.suspend(() =>
  S.Struct({
    deployments: S.optional(DeploymentsList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeploymentsOutput",
}) as any as S.Schema<ListDeploymentsOutput>;
export interface ListDeploymentTargetsOutput {
  targetIds?: TargetIdList;
  nextToken?: string;
}
export const ListDeploymentTargetsOutput = S.suspend(() =>
  S.Struct({
    targetIds: S.optional(TargetIdList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeploymentTargetsOutput",
}) as any as S.Schema<ListDeploymentTargetsOutput>;
export type DeploymentGroupInfoList = DeploymentGroupInfo[];
export const DeploymentGroupInfoList = S.Array(DeploymentGroupInfo);
export type DeploymentsInfoList = DeploymentInfo[];
export const DeploymentsInfoList = S.Array(DeploymentInfo);
export interface BatchGetDeploymentGroupsOutput {
  deploymentGroupsInfo?: DeploymentGroupInfoList;
  errorMessage?: string;
}
export const BatchGetDeploymentGroupsOutput = S.suspend(() =>
  S.Struct({
    deploymentGroupsInfo: S.optional(DeploymentGroupInfoList),
    errorMessage: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetDeploymentGroupsOutput",
}) as any as S.Schema<BatchGetDeploymentGroupsOutput>;
export interface BatchGetDeploymentsOutput {
  deploymentsInfo?: DeploymentsInfoList;
}
export const BatchGetDeploymentsOutput = S.suspend(() =>
  S.Struct({ deploymentsInfo: S.optional(DeploymentsInfoList) }).pipe(ns),
).annotations({
  identifier: "BatchGetDeploymentsOutput",
}) as any as S.Schema<BatchGetDeploymentsOutput>;
export interface CreateDeploymentOutput {
  deploymentId?: string;
}
export const CreateDeploymentOutput = S.suspend(() =>
  S.Struct({ deploymentId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateDeploymentOutput",
}) as any as S.Schema<CreateDeploymentOutput>;
export interface CreateDeploymentConfigOutput {
  deploymentConfigId?: string;
}
export const CreateDeploymentConfigOutput = S.suspend(() =>
  S.Struct({ deploymentConfigId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateDeploymentConfigOutput",
}) as any as S.Schema<CreateDeploymentConfigOutput>;
export interface CreateDeploymentGroupInput {
  applicationName: string;
  deploymentGroupName: string;
  deploymentConfigName?: string;
  ec2TagFilters?: EC2TagFilterList;
  onPremisesInstanceTagFilters?: TagFilterList;
  autoScalingGroups?: AutoScalingGroupNameList;
  serviceRoleArn: string;
  triggerConfigurations?: TriggerConfigList;
  alarmConfiguration?: AlarmConfiguration;
  autoRollbackConfiguration?: AutoRollbackConfiguration;
  outdatedInstancesStrategy?: string;
  deploymentStyle?: DeploymentStyle;
  blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
  loadBalancerInfo?: LoadBalancerInfo;
  ec2TagSet?: EC2TagSet;
  ecsServices?: ECSServiceList;
  onPremisesTagSet?: OnPremisesTagSet;
  tags?: TagList;
  terminationHookEnabled?: boolean;
}
export const CreateDeploymentGroupInput = S.suspend(() =>
  S.Struct({
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
  identifier: "CreateDeploymentGroupInput",
}) as any as S.Schema<CreateDeploymentGroupInput>;
export interface RevisionInfo {
  revisionLocation?: RevisionLocation;
  genericRevisionInfo?: GenericRevisionInfo;
}
export const RevisionInfo = S.suspend(() =>
  S.Struct({
    revisionLocation: S.optional(RevisionLocation),
    genericRevisionInfo: S.optional(GenericRevisionInfo),
  }),
).annotations({ identifier: "RevisionInfo" }) as any as S.Schema<RevisionInfo>;
export type RevisionInfoList = RevisionInfo[];
export const RevisionInfoList = S.Array(RevisionInfo);
export type InstanceSummaryList = InstanceSummary[];
export const InstanceSummaryList = S.Array(InstanceSummary);
export type DeploymentTargetList = DeploymentTarget[];
export const DeploymentTargetList = S.Array(DeploymentTarget);
export interface BatchGetApplicationRevisionsOutput {
  applicationName?: string;
  errorMessage?: string;
  revisions?: RevisionInfoList;
}
export const BatchGetApplicationRevisionsOutput = S.suspend(() =>
  S.Struct({
    applicationName: S.optional(S.String),
    errorMessage: S.optional(S.String),
    revisions: S.optional(RevisionInfoList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetApplicationRevisionsOutput",
}) as any as S.Schema<BatchGetApplicationRevisionsOutput>;
export interface BatchGetDeploymentInstancesOutput {
  instancesSummary?: InstanceSummaryList;
  errorMessage?: string;
}
export const BatchGetDeploymentInstancesOutput = S.suspend(() =>
  S.Struct({
    instancesSummary: S.optional(InstanceSummaryList),
    errorMessage: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetDeploymentInstancesOutput",
}) as any as S.Schema<BatchGetDeploymentInstancesOutput>;
export interface BatchGetDeploymentTargetsOutput {
  deploymentTargets?: DeploymentTargetList;
}
export const BatchGetDeploymentTargetsOutput = S.suspend(() =>
  S.Struct({ deploymentTargets: S.optional(DeploymentTargetList) }).pipe(ns),
).annotations({
  identifier: "BatchGetDeploymentTargetsOutput",
}) as any as S.Schema<BatchGetDeploymentTargetsOutput>;
export interface CreateDeploymentGroupOutput {
  deploymentGroupId?: string;
}
export const CreateDeploymentGroupOutput = S.suspend(() =>
  S.Struct({ deploymentGroupId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateDeploymentGroupOutput",
}) as any as S.Schema<CreateDeploymentGroupOutput>;

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
export const deleteResourcesByExternalId: (
  input: DeleteResourcesByExternalIdInput,
) => Effect.Effect<
  DeleteResourcesByExternalIdOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcesByExternalIdInput,
  output: DeleteResourcesByExternalIdOutput,
  errors: [],
}));
/**
 * Deregisters an on-premises instance.
 */
export const deregisterOnPremisesInstance: (
  input: DeregisterOnPremisesInstanceInput,
) => Effect.Effect<
  DeregisterOnPremisesInstanceResponse,
  InstanceNameRequiredException | InvalidInstanceNameException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterOnPremisesInstanceInput,
  output: DeregisterOnPremisesInstanceResponse,
  errors: [InstanceNameRequiredException, InvalidInstanceNameException],
}));
/**
 * Gets information about an on-premises instance.
 */
export const getOnPremisesInstance: (
  input: GetOnPremisesInstanceInput,
) => Effect.Effect<
  GetOnPremisesInstanceOutput,
  | InstanceNameRequiredException
  | InstanceNotRegisteredException
  | InvalidInstanceNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOnPremisesInstanceInput,
  output: GetOnPremisesInstanceOutput,
  errors: [
    InstanceNameRequiredException,
    InstanceNotRegisteredException,
    InvalidInstanceNameException,
  ],
}));
/**
 * Lists the applications registered with the user or Amazon Web Services account.
 */
export const listApplications: {
  (
    input: ListApplicationsInput,
  ): Effect.Effect<
    ListApplicationsOutput,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsInput,
  ) => Stream.Stream<
    ListApplicationsOutput,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsInput,
  ) => Stream.Stream<
    ApplicationName,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsInput,
  output: ListApplicationsOutput,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "applications",
  } as const,
}));
/**
 * Changes the name of an application.
 */
export const updateApplication: (
  input: UpdateApplicationInput,
) => Effect.Effect<
  UpdateApplicationResponse,
  | ApplicationAlreadyExistsException
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | InvalidApplicationNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApplication: (
  input: GetApplicationInput,
) => Effect.Effect<
  GetApplicationOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | InvalidApplicationNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDeploymentGroups: {
  (
    input: ListDeploymentGroupsInput,
  ): Effect.Effect<
    ListDeploymentGroupsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | InvalidApplicationNameException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentGroupsInput,
  ) => Stream.Stream<
    ListDeploymentGroupsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | InvalidApplicationNameException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentGroupsInput,
  ) => Stream.Stream<
    DeploymentGroupName,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | InvalidApplicationNameException
    | InvalidNextTokenException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDeploymentConfigs: {
  (
    input: ListDeploymentConfigsInput,
  ): Effect.Effect<
    ListDeploymentConfigsOutput,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentConfigsInput,
  ) => Stream.Stream<
    ListDeploymentConfigsOutput,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentConfigsInput,
  ) => Stream.Stream<
    DeploymentConfigName,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchGetApplications: (
  input: BatchGetApplicationsInput,
) => Effect.Effect<
  BatchGetApplicationsOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | BatchLimitExceededException
  | InvalidApplicationNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetApplicationsInput,
  output: BatchGetApplicationsOutput,
  errors: [
    ApplicationDoesNotExistException,
    ApplicationNameRequiredException,
    BatchLimitExceededException,
    InvalidApplicationNameException,
  ],
}));
/**
 * Deletes an application.
 */
export const deleteApplication: (
  input: DeleteApplicationInput,
) => Effect.Effect<
  DeleteApplicationResponse,
  | ApplicationNameRequiredException
  | InvalidApplicationNameException
  | InvalidRoleException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetOnPremisesInstances: (
  input: BatchGetOnPremisesInstancesInput,
) => Effect.Effect<
  BatchGetOnPremisesInstancesOutput,
  | BatchLimitExceededException
  | InstanceNameRequiredException
  | InvalidInstanceNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetOnPremisesInstancesInput,
  output: BatchGetOnPremisesInstancesOutput,
  errors: [
    BatchLimitExceededException,
    InstanceNameRequiredException,
    InvalidInstanceNameException,
  ],
}));
/**
 * Gets information about a deployment configuration.
 */
export const getDeploymentConfig: (
  input: GetDeploymentConfigInput,
) => Effect.Effect<
  GetDeploymentConfigOutput,
  | DeploymentConfigDoesNotExistException
  | DeploymentConfigNameRequiredException
  | InvalidComputePlatformException
  | InvalidDeploymentConfigNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDeploymentConfig: (
  input: DeleteDeploymentConfigInput,
) => Effect.Effect<
  DeleteDeploymentConfigResponse,
  | DeploymentConfigInUseException
  | DeploymentConfigNameRequiredException
  | InvalidDeploymentConfigNameException
  | InvalidOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentConfigInput,
  output: DeleteDeploymentConfigResponse,
  errors: [
    DeploymentConfigInUseException,
    DeploymentConfigNameRequiredException,
    InvalidDeploymentConfigNameException,
    InvalidOperationException,
  ],
}));
/**
 * Deletes a deployment group.
 */
export const deleteDeploymentGroup: (
  input: DeleteDeploymentGroupInput,
) => Effect.Effect<
  DeleteDeploymentGroupOutput,
  | ApplicationNameRequiredException
  | DeploymentGroupNameRequiredException
  | InvalidApplicationNameException
  | InvalidDeploymentGroupNameException
  | InvalidRoleException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentGroupInput,
  output: DeleteDeploymentGroupOutput,
  errors: [
    ApplicationNameRequiredException,
    DeploymentGroupNameRequiredException,
    InvalidApplicationNameException,
    InvalidDeploymentGroupNameException,
    InvalidRoleException,
  ],
}));
/**
 * Returns a list of tags for the resource identified by a specified Amazon Resource
 * Name (ARN). Tags are used to organize and categorize your CodeDeploy resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | ArnNotSupportedException
  | InvalidArnException
  | ResourceArnRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDeployment: (
  input: GetDeploymentInput,
) => Effect.Effect<
  GetDeploymentOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | InvalidDeploymentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetDeploymentGroups: (
  input: BatchGetDeploymentGroupsInput,
) => Effect.Effect<
  BatchGetDeploymentGroupsOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | BatchLimitExceededException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupNameRequiredException
  | InvalidApplicationNameException
  | InvalidDeploymentGroupNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets information about a deployment group.
 */
export const getDeploymentGroup: (
  input: GetDeploymentGroupInput,
) => Effect.Effect<
  GetDeploymentGroupOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupDoesNotExistException
  | DeploymentGroupNameRequiredException
  | InvalidApplicationNameException
  | InvalidDeploymentGroupNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerApplicationRevision: (
  input: RegisterApplicationRevisionInput,
) => Effect.Effect<
  RegisterApplicationRevisionResponse,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | DescriptionTooLongException
  | InvalidApplicationNameException
  | InvalidRevisionException
  | RevisionRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the names of stored connections to GitHub accounts.
 */
export const listGitHubAccountTokenNames: (
  input: ListGitHubAccountTokenNamesInput,
) => Effect.Effect<
  ListGitHubAccountTokenNamesOutput,
  | InvalidNextTokenException
  | OperationNotSupportedException
  | ResourceValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGitHubAccountTokenNamesInput,
  output: ListGitHubAccountTokenNamesOutput,
  errors: [
    InvalidNextTokenException,
    OperationNotSupportedException,
    ResourceValidationException,
  ],
}));
/**
 * Gets a list of names for one or more on-premises instances.
 *
 * Unless otherwise specified, both registered and deregistered on-premises instance
 * names are listed. To list only registered or deregistered on-premises instance names,
 * use the registration status parameter.
 */
export const listOnPremisesInstances: (
  input: ListOnPremisesInstancesInput,
) => Effect.Effect<
  ListOnPremisesInstancesOutput,
  | InvalidNextTokenException
  | InvalidRegistrationStatusException
  | InvalidTagFilterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOnPremisesInstancesInput,
  output: ListOnPremisesInstancesOutput,
  errors: [
    InvalidNextTokenException,
    InvalidRegistrationStatusException,
    InvalidTagFilterException,
  ],
}));
/**
 * Gets information about one or more deployments. The maximum number of deployments that
 * can be returned is 25.
 */
export const batchGetDeployments: (
  input: BatchGetDeploymentsInput,
) => Effect.Effect<
  BatchGetDeploymentsOutput,
  | BatchLimitExceededException
  | DeploymentIdRequiredException
  | InvalidDeploymentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetApplicationRevisions: (
  input: BatchGetApplicationRevisionsInput,
) => Effect.Effect<
  BatchGetApplicationRevisionsOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | BatchLimitExceededException
  | InvalidApplicationNameException
  | InvalidRevisionException
  | RevisionRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApplicationRevision: (
  input: GetApplicationRevisionInput,
) => Effect.Effect<
  GetApplicationRevisionOutput,
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | InvalidApplicationNameException
  | InvalidRevisionException
  | RevisionDoesNotExistException
  | RevisionRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a GitHub account connection.
 */
export const deleteGitHubAccountToken: (
  input: DeleteGitHubAccountTokenInput,
) => Effect.Effect<
  DeleteGitHubAccountTokenOutput,
  | GitHubAccountTokenDoesNotExistException
  | GitHubAccountTokenNameRequiredException
  | InvalidGitHubAccountTokenNameException
  | OperationNotSupportedException
  | ResourceValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGitHubAccountTokenInput,
  output: DeleteGitHubAccountTokenOutput,
  errors: [
    GitHubAccountTokenDoesNotExistException,
    GitHubAccountTokenNameRequiredException,
    InvalidGitHubAccountTokenNameException,
    OperationNotSupportedException,
    ResourceValidationException,
  ],
}));
/**
 * Creates an application.
 */
export const createApplication: (
  input: CreateApplicationInput,
) => Effect.Effect<
  CreateApplicationOutput,
  | ApplicationAlreadyExistsException
  | ApplicationLimitExceededException
  | ApplicationNameRequiredException
  | InvalidApplicationNameException
  | InvalidComputePlatformException
  | InvalidTagsToAddException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetDeploymentInstances: (
  input: BatchGetDeploymentInstancesInput,
) => Effect.Effect<
  BatchGetDeploymentInstancesOutput,
  | BatchLimitExceededException
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | InstanceIdRequiredException
  | InvalidComputePlatformException
  | InvalidDeploymentIdException
  | InvalidInstanceNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Gets information about an instance as part of a deployment.
 */
export const getDeploymentInstance: (
  input: GetDeploymentInstanceInput,
) => Effect.Effect<
  GetDeploymentInstanceOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | InstanceDoesNotExistException
  | InstanceIdRequiredException
  | InvalidComputePlatformException
  | InvalidDeploymentIdException
  | InvalidInstanceNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Removes one or more tags from one or more on-premises instances.
 */
export const removeTagsFromOnPremisesInstances: (
  input: RemoveTagsFromOnPremisesInstancesInput,
) => Effect.Effect<
  RemoveTagsFromOnPremisesInstancesResponse,
  | InstanceLimitExceededException
  | InstanceNameRequiredException
  | InstanceNotRegisteredException
  | InvalidInstanceNameException
  | InvalidTagException
  | TagLimitExceededException
  | TagRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const skipWaitTimeForInstanceTermination: (
  input: SkipWaitTimeForInstanceTerminationInput,
) => Effect.Effect<
  SkipWaitTimeForInstanceTerminationResponse,
  | DeploymentAlreadyCompletedException
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | DeploymentNotStartedException
  | InvalidDeploymentIdException
  | UnsupportedActionForDeploymentTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | ApplicationDoesNotExistException
  | ArnNotSupportedException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupDoesNotExistException
  | InvalidArnException
  | InvalidTagsToAddException
  | ResourceArnRequiredException
  | TagRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addTagsToOnPremisesInstances: (
  input: AddTagsToOnPremisesInstancesInput,
) => Effect.Effect<
  AddTagsToOnPremisesInstancesResponse,
  | InstanceLimitExceededException
  | InstanceNameRequiredException
  | InstanceNotRegisteredException
  | InvalidInstanceNameException
  | InvalidTagException
  | TagLimitExceededException
  | TagRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | ApplicationDoesNotExistException
  | ArnNotSupportedException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupDoesNotExistException
  | InvalidArnException
  | InvalidTagsToAddException
  | ResourceArnRequiredException
  | TagRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopDeployment: (
  input: StopDeploymentInput,
) => Effect.Effect<
  StopDeploymentOutput,
  | DeploymentAlreadyCompletedException
  | DeploymentDoesNotExistException
  | DeploymentGroupDoesNotExistException
  | DeploymentIdRequiredException
  | InvalidDeploymentIdException
  | UnsupportedActionForDeploymentTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const continueDeployment: (
  input: ContinueDeploymentInput,
) => Effect.Effect<
  ContinueDeploymentResponse,
  | DeploymentAlreadyCompletedException
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | DeploymentIsNotInReadyStateException
  | InvalidDeploymentIdException
  | InvalidDeploymentStatusException
  | InvalidDeploymentWaitTypeException
  | UnsupportedActionForDeploymentTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApplicationRevisions: {
  (
    input: ListApplicationRevisionsInput,
  ): Effect.Effect<
    ListApplicationRevisionsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | BucketNameFilterRequiredException
    | InvalidApplicationNameException
    | InvalidBucketNameFilterException
    | InvalidDeployedStateFilterException
    | InvalidKeyPrefixFilterException
    | InvalidNextTokenException
    | InvalidSortByException
    | InvalidSortOrderException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationRevisionsInput,
  ) => Stream.Stream<
    ListApplicationRevisionsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | BucketNameFilterRequiredException
    | InvalidApplicationNameException
    | InvalidBucketNameFilterException
    | InvalidDeployedStateFilterException
    | InvalidKeyPrefixFilterException
    | InvalidNextTokenException
    | InvalidSortByException
    | InvalidSortOrderException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationRevisionsInput,
  ) => Stream.Stream<
    RevisionLocation,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | BucketNameFilterRequiredException
    | InvalidApplicationNameException
    | InvalidBucketNameFilterException
    | InvalidDeployedStateFilterException
    | InvalidKeyPrefixFilterException
    | InvalidNextTokenException
    | InvalidSortByException
    | InvalidSortOrderException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getDeploymentTarget: (
  input: GetDeploymentTargetInput,
) => Effect.Effect<
  GetDeploymentTargetOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | DeploymentNotStartedException
  | DeploymentTargetDoesNotExistException
  | DeploymentTargetIdRequiredException
  | InvalidDeploymentIdException
  | InvalidDeploymentTargetIdException
  | InvalidInstanceNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putLifecycleEventHookExecutionStatus: (
  input: PutLifecycleEventHookExecutionStatusInput,
) => Effect.Effect<
  PutLifecycleEventHookExecutionStatusOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | InvalidDeploymentIdException
  | InvalidLifecycleEventHookExecutionIdException
  | InvalidLifecycleEventHookExecutionStatusException
  | LifecycleEventAlreadyCompletedException
  | UnsupportedActionForDeploymentTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetDeploymentTargets: (
  input: BatchGetDeploymentTargetsInput,
) => Effect.Effect<
  BatchGetDeploymentTargetsOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | DeploymentNotStartedException
  | DeploymentTargetDoesNotExistException
  | DeploymentTargetIdRequiredException
  | DeploymentTargetListSizeExceededException
  | InstanceDoesNotExistException
  | InvalidDeploymentIdException
  | InvalidDeploymentTargetIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a deployment configuration.
 */
export const createDeploymentConfig: (
  input: CreateDeploymentConfigInput,
) => Effect.Effect<
  CreateDeploymentConfigOutput,
  | DeploymentConfigAlreadyExistsException
  | DeploymentConfigLimitExceededException
  | DeploymentConfigNameRequiredException
  | InvalidComputePlatformException
  | InvalidDeploymentConfigNameException
  | InvalidMinimumHealthyHostValueException
  | InvalidTrafficRoutingConfigurationException
  | InvalidZonalDeploymentConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Registers an on-premises instance.
 *
 * Only one IAM ARN (an IAM session ARN or IAM user ARN) is supported in the request. You cannot use both.
 */
export const registerOnPremisesInstance: (
  input: RegisterOnPremisesInstanceInput,
) => Effect.Effect<
  RegisterOnPremisesInstanceResponse,
  | IamArnRequiredException
  | IamSessionArnAlreadyRegisteredException
  | IamUserArnAlreadyRegisteredException
  | IamUserArnRequiredException
  | InstanceNameAlreadyRegisteredException
  | InstanceNameRequiredException
  | InvalidIamSessionArnException
  | InvalidIamUserArnException
  | InvalidInstanceNameException
  | MultipleIamArnsProvidedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the deployments in a deployment group for an application registered with the
 * user or Amazon Web Services account.
 */
export const listDeployments: {
  (
    input: ListDeploymentsInput,
  ): Effect.Effect<
    ListDeploymentsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | DeploymentGroupDoesNotExistException
    | DeploymentGroupNameRequiredException
    | InvalidApplicationNameException
    | InvalidDeploymentGroupNameException
    | InvalidDeploymentStatusException
    | InvalidExternalIdException
    | InvalidInputException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    ListDeploymentsOutput,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | DeploymentGroupDoesNotExistException
    | DeploymentGroupNameRequiredException
    | InvalidApplicationNameException
    | InvalidDeploymentGroupNameException
    | InvalidDeploymentStatusException
    | InvalidExternalIdException
    | InvalidInputException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    DeploymentId,
    | ApplicationDoesNotExistException
    | ApplicationNameRequiredException
    | DeploymentGroupDoesNotExistException
    | DeploymentGroupNameRequiredException
    | InvalidApplicationNameException
    | InvalidDeploymentGroupNameException
    | InvalidDeploymentStatusException
    | InvalidExternalIdException
    | InvalidInputException
    | InvalidNextTokenException
    | InvalidTimeRangeException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * The newer `BatchGetDeploymentTargets` should be used instead because
 * it works with all compute types. `ListDeploymentInstances` throws an
 * exception if it is used with a compute platform other than EC2/On-premises or
 * Lambda.
 *
 * Lists the instance for a deployment associated with the user or Amazon Web Services account.
 */
export const listDeploymentInstances: {
  (
    input: ListDeploymentInstancesInput,
  ): Effect.Effect<
    ListDeploymentInstancesOutput,
    | DeploymentDoesNotExistException
    | DeploymentIdRequiredException
    | DeploymentNotStartedException
    | InvalidComputePlatformException
    | InvalidDeploymentIdException
    | InvalidDeploymentInstanceTypeException
    | InvalidInstanceStatusException
    | InvalidInstanceTypeException
    | InvalidNextTokenException
    | InvalidTargetFilterNameException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentInstancesInput,
  ) => Stream.Stream<
    ListDeploymentInstancesOutput,
    | DeploymentDoesNotExistException
    | DeploymentIdRequiredException
    | DeploymentNotStartedException
    | InvalidComputePlatformException
    | InvalidDeploymentIdException
    | InvalidDeploymentInstanceTypeException
    | InvalidInstanceStatusException
    | InvalidInstanceTypeException
    | InvalidNextTokenException
    | InvalidTargetFilterNameException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentInstancesInput,
  ) => Stream.Stream<
    InstanceId,
    | DeploymentDoesNotExistException
    | DeploymentIdRequiredException
    | DeploymentNotStartedException
    | InvalidComputePlatformException
    | InvalidDeploymentIdException
    | InvalidDeploymentInstanceTypeException
    | InvalidInstanceStatusException
    | InvalidInstanceTypeException
    | InvalidNextTokenException
    | InvalidTargetFilterNameException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDeploymentTargets: (
  input: ListDeploymentTargetsInput,
) => Effect.Effect<
  ListDeploymentTargetsOutput,
  | DeploymentDoesNotExistException
  | DeploymentIdRequiredException
  | DeploymentNotStartedException
  | InvalidDeploymentIdException
  | InvalidDeploymentInstanceTypeException
  | InvalidInstanceStatusException
  | InvalidInstanceTypeException
  | InvalidNextTokenException
  | InvalidTargetFilterNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deploys an application revision through the specified deployment group.
 */
export const createDeployment: (
  input: CreateDeploymentInput,
) => Effect.Effect<
  CreateDeploymentOutput,
  | AlarmsLimitExceededException
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupDoesNotExistException
  | DeploymentGroupNameRequiredException
  | DeploymentLimitExceededException
  | DescriptionTooLongException
  | InvalidAlarmConfigException
  | InvalidApplicationNameException
  | InvalidAutoRollbackConfigException
  | InvalidAutoScalingGroupException
  | InvalidDeploymentConfigNameException
  | InvalidDeploymentGroupNameException
  | InvalidFileExistsBehaviorException
  | InvalidGitHubAccountTokenException
  | InvalidIgnoreApplicationStopFailuresValueException
  | InvalidLoadBalancerInfoException
  | InvalidRevisionException
  | InvalidRoleException
  | InvalidTargetInstancesException
  | InvalidTrafficRoutingConfigurationException
  | InvalidUpdateOutdatedInstancesOnlyValueException
  | RevisionDoesNotExistException
  | RevisionRequiredException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDeploymentGroup: (
  input: UpdateDeploymentGroupInput,
) => Effect.Effect<
  UpdateDeploymentGroupOutput,
  | AlarmsLimitExceededException
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupAlreadyExistsException
  | DeploymentGroupDoesNotExistException
  | DeploymentGroupNameRequiredException
  | ECSServiceMappingLimitExceededException
  | InvalidAlarmConfigException
  | InvalidApplicationNameException
  | InvalidAutoRollbackConfigException
  | InvalidAutoScalingGroupException
  | InvalidBlueGreenDeploymentConfigurationException
  | InvalidDeploymentConfigNameException
  | InvalidDeploymentGroupNameException
  | InvalidDeploymentStyleException
  | InvalidEC2TagCombinationException
  | InvalidEC2TagException
  | InvalidECSServiceException
  | InvalidInputException
  | InvalidLoadBalancerInfoException
  | InvalidOnPremisesTagCombinationException
  | InvalidRoleException
  | InvalidTagException
  | InvalidTargetGroupPairException
  | InvalidTrafficRoutingConfigurationException
  | InvalidTriggerConfigException
  | LifecycleHookLimitExceededException
  | TagSetListLimitExceededException
  | ThrottlingException
  | TriggerTargetsLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a deployment group to which application revisions are deployed.
 */
export const createDeploymentGroup: (
  input: CreateDeploymentGroupInput,
) => Effect.Effect<
  CreateDeploymentGroupOutput,
  | AlarmsLimitExceededException
  | ApplicationDoesNotExistException
  | ApplicationNameRequiredException
  | DeploymentConfigDoesNotExistException
  | DeploymentGroupAlreadyExistsException
  | DeploymentGroupLimitExceededException
  | DeploymentGroupNameRequiredException
  | ECSServiceMappingLimitExceededException
  | InvalidAlarmConfigException
  | InvalidApplicationNameException
  | InvalidAutoRollbackConfigException
  | InvalidAutoScalingGroupException
  | InvalidBlueGreenDeploymentConfigurationException
  | InvalidDeploymentConfigNameException
  | InvalidDeploymentGroupNameException
  | InvalidDeploymentStyleException
  | InvalidEC2TagCombinationException
  | InvalidEC2TagException
  | InvalidECSServiceException
  | InvalidInputException
  | InvalidLoadBalancerInfoException
  | InvalidOnPremisesTagCombinationException
  | InvalidRoleException
  | InvalidTagException
  | InvalidTagsToAddException
  | InvalidTargetGroupPairException
  | InvalidTrafficRoutingConfigurationException
  | InvalidTriggerConfigException
  | LifecycleHookLimitExceededException
  | RoleRequiredException
  | TagSetListLimitExceededException
  | ThrottlingException
  | TriggerTargetsLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
