import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "drs",
  serviceShapeName: "ElasticDisasterRecoveryService",
});
const auth = T.AwsAuthSigv4({ name: "drs" });
const ver = T.ServiceVersion("2020-02-26");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://drs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://drs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://drs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://drs.{Region}.{PartitionResult#dnsSuffix}",
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
export class InitializeServiceRequest extends S.Class<InitializeServiceRequest>(
  "InitializeServiceRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/InitializeService" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InitializeServiceResponse extends S.Class<InitializeServiceResponse>(
  "InitializeServiceResponse",
)({}) {}
export const TagKeys = S.Array(S.String);
export const LaunchConfigurationTemplateIDs = S.Array(S.String);
export const StartFailbackRequestRecoveryInstanceIDs = S.Array(S.String);
export const RecoveryInstancesForTerminationRequest = S.Array(S.String);
export const ReplicationServersSecurityGroupsIDs = S.Array(S.String);
export const ReplicationConfigurationTemplateIDs = S.Array(S.String);
export class DeleteLaunchActionRequest extends S.Class<DeleteLaunchActionRequest>(
  "DeleteLaunchActionRequest",
)(
  { resourceId: S.String, actionId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteLaunchAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchActionResponse extends S.Class<DeleteLaunchActionResponse>(
  "DeleteLaunchActionResponse",
)({}) {}
export class ListExtensibleSourceServersRequest extends S.Class<ListExtensibleSourceServersRequest>(
  "ListExtensibleSourceServersRequest",
)(
  {
    stagingAccountID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListExtensibleSourceServers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStagingAccountsRequest extends S.Class<ListStagingAccountsRequest>(
  "ListStagingAccountsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ListStagingAccounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  { jobID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobResponse extends S.Class<DeleteJobResponse>(
  "DeleteJobResponse",
)({}) {}
export class DescribeJobLogItemsRequest extends S.Class<DescribeJobLogItemsRequest>(
  "DescribeJobLogItemsRequest",
)(
  {
    jobID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeJobLogItems" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Licensing extends S.Class<Licensing>("Licensing")({
  osByol: S.optional(S.Boolean),
}) {}
export class UpdateLaunchConfigurationTemplateRequest extends S.Class<UpdateLaunchConfigurationTemplateRequest>(
  "UpdateLaunchConfigurationTemplateRequest",
)(
  {
    launchConfigurationTemplateID: S.String,
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    exportBucketArn: S.optional(S.String),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoSourceInstance: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateLaunchConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchConfigurationTemplateRequest extends S.Class<DeleteLaunchConfigurationTemplateRequest>(
  "DeleteLaunchConfigurationTemplateRequest",
)(
  { launchConfigurationTemplateID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteLaunchConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchConfigurationTemplateResponse extends S.Class<DeleteLaunchConfigurationTemplateResponse>(
  "DeleteLaunchConfigurationTemplateResponse",
)({}) {}
export class DescribeLaunchConfigurationTemplatesRequest extends S.Class<DescribeLaunchConfigurationTemplatesRequest>(
  "DescribeLaunchConfigurationTemplatesRequest",
)(
  {
    launchConfigurationTemplateIDs: S.optional(LaunchConfigurationTemplateIDs),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeLaunchConfigurationTemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecoveryInstanceRequest extends S.Class<DeleteRecoveryInstanceRequest>(
  "DeleteRecoveryInstanceRequest",
)(
  { recoveryInstanceID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteRecoveryInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecoveryInstanceResponse extends S.Class<DeleteRecoveryInstanceResponse>(
  "DeleteRecoveryInstanceResponse",
)({}) {}
export class DisconnectRecoveryInstanceRequest extends S.Class<DisconnectRecoveryInstanceRequest>(
  "DisconnectRecoveryInstanceRequest",
)(
  { recoveryInstanceID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DisconnectRecoveryInstance" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisconnectRecoveryInstanceResponse extends S.Class<DisconnectRecoveryInstanceResponse>(
  "DisconnectRecoveryInstanceResponse",
)({}) {}
export class GetFailbackReplicationConfigurationRequest extends S.Class<GetFailbackReplicationConfigurationRequest>(
  "GetFailbackReplicationConfigurationRequest",
)(
  { recoveryInstanceID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetFailbackReplicationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReverseReplicationRequest extends S.Class<ReverseReplicationRequest>(
  "ReverseReplicationRequest",
)(
  { recoveryInstanceID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ReverseReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopFailbackRequest extends S.Class<StopFailbackRequest>(
  "StopFailbackRequest",
)(
  { recoveryInstanceID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StopFailback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopFailbackResponse extends S.Class<StopFailbackResponse>(
  "StopFailbackResponse",
)({}) {}
export class UpdateFailbackReplicationConfigurationRequest extends S.Class<UpdateFailbackReplicationConfigurationRequest>(
  "UpdateFailbackReplicationConfigurationRequest",
)(
  {
    recoveryInstanceID: S.String,
    name: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    usePrivateIP: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateFailbackReplicationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFailbackReplicationConfigurationResponse extends S.Class<UpdateFailbackReplicationConfigurationResponse>(
  "UpdateFailbackReplicationConfigurationResponse",
)({}) {}
export class StartFailbackLaunchRequest extends S.Class<StartFailbackLaunchRequest>(
  "StartFailbackLaunchRequest",
)(
  {
    recoveryInstanceIDs: StartFailbackRequestRecoveryInstanceIDs,
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartFailbackLaunch" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TerminateRecoveryInstancesRequest extends S.Class<TerminateRecoveryInstancesRequest>(
  "TerminateRecoveryInstancesRequest",
)(
  { recoveryInstanceIDs: RecoveryInstancesForTerminationRequest },
  T.all(
    T.Http({ method: "POST", uri: "/TerminateRecoveryInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PITPolicyRule extends S.Class<PITPolicyRule>("PITPolicyRule")({
  ruleID: S.optional(S.Number),
  units: S.String,
  interval: S.Number,
  retentionDuration: S.Number,
  enabled: S.optional(S.Boolean),
}) {}
export const PITPolicy = S.Array(PITPolicyRule);
export class UpdateReplicationConfigurationTemplateRequest extends S.Class<UpdateReplicationConfigurationTemplateRequest>(
  "UpdateReplicationConfigurationTemplateRequest",
)(
  {
    replicationConfigurationTemplateID: S.String,
    arn: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateReplicationConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReplicationConfigurationTemplateRequest extends S.Class<DeleteReplicationConfigurationTemplateRequest>(
  "DeleteReplicationConfigurationTemplateRequest",
)(
  { replicationConfigurationTemplateID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteReplicationConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReplicationConfigurationTemplateResponse extends S.Class<DeleteReplicationConfigurationTemplateResponse>(
  "DeleteReplicationConfigurationTemplateResponse",
)({}) {}
export class DescribeReplicationConfigurationTemplatesRequest extends S.Class<DescribeReplicationConfigurationTemplatesRequest>(
  "DescribeReplicationConfigurationTemplatesRequest",
)(
  {
    replicationConfigurationTemplateIDs: S.optional(
      ReplicationConfigurationTemplateIDs,
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/DescribeReplicationConfigurationTemplates",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSourceNetworkRequest extends S.Class<CreateSourceNetworkRequest>(
  "CreateSourceNetworkRequest",
)(
  {
    vpcID: S.String,
    originAccountID: S.String,
    originRegion: S.String,
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateSourceNetwork" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceNetworkRequest extends S.Class<DeleteSourceNetworkRequest>(
  "DeleteSourceNetworkRequest",
)(
  { sourceNetworkID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteSourceNetwork" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceNetworkResponse extends S.Class<DeleteSourceNetworkResponse>(
  "DeleteSourceNetworkResponse",
)({}) {}
export class AssociateSourceNetworkStackRequest extends S.Class<AssociateSourceNetworkStackRequest>(
  "AssociateSourceNetworkStackRequest",
)(
  { sourceNetworkID: S.String, cfnStackName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/AssociateSourceNetworkStack" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportSourceNetworkCfnTemplateRequest extends S.Class<ExportSourceNetworkCfnTemplateRequest>(
  "ExportSourceNetworkCfnTemplateRequest",
)(
  { sourceNetworkID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ExportSourceNetworkCfnTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartSourceNetworkReplicationRequest extends S.Class<StartSourceNetworkReplicationRequest>(
  "StartSourceNetworkReplicationRequest",
)(
  { sourceNetworkID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StartSourceNetworkReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSourceNetworkReplicationRequest extends S.Class<StopSourceNetworkReplicationRequest>(
  "StopSourceNetworkReplicationRequest",
)(
  { sourceNetworkID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StopSourceNetworkReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceServerRequest extends S.Class<DeleteSourceServerRequest>(
  "DeleteSourceServerRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteSourceServer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSourceServerResponse extends S.Class<DeleteSourceServerResponse>(
  "DeleteSourceServerResponse",
)({}) {}
export class DisconnectSourceServerRequest extends S.Class<DisconnectSourceServerRequest>(
  "DisconnectSourceServerRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DisconnectSourceServer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLaunchConfigurationRequest extends S.Class<GetLaunchConfigurationRequest>(
  "GetLaunchConfigurationRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetLaunchConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReplicationConfigurationRequest extends S.Class<GetReplicationConfigurationRequest>(
  "GetReplicationConfigurationRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetReplicationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetryDataReplicationRequest extends S.Class<RetryDataReplicationRequest>(
  "RetryDataReplicationRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/RetryDataReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReplicationRequest extends S.Class<StartReplicationRequest>(
  "StartReplicationRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StartReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopReplicationRequest extends S.Class<StopReplicationRequest>(
  "StopReplicationRequest",
)(
  { sourceServerID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StopReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const LaunchActionIds = S.Array(S.String);
export const DescribeJobsRequestFiltersJobIDs = S.Array(S.String);
export const RecoveryInstanceIDs = S.Array(S.String);
export const SourceServerIDs = S.Array(S.String);
export const DescribeSourceNetworksRequestFiltersIDs = S.Array(S.String);
export const DescribeSourceServersRequestFiltersIDs = S.Array(S.String);
export const AccountIDs = S.Array(S.String);
export class LaunchActionsRequestFilters extends S.Class<LaunchActionsRequestFilters>(
  "LaunchActionsRequestFilters",
)({ actionIds: S.optional(LaunchActionIds) }) {}
export class DescribeJobsRequestFilters extends S.Class<DescribeJobsRequestFilters>(
  "DescribeJobsRequestFilters",
)({
  jobIDs: S.optional(DescribeJobsRequestFiltersJobIDs),
  fromDate: S.optional(S.String),
  toDate: S.optional(S.String),
}) {}
export class LaunchConfigurationTemplate extends S.Class<LaunchConfigurationTemplate>(
  "LaunchConfigurationTemplate",
)({
  launchConfigurationTemplateID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  launchDisposition: S.optional(S.String),
  targetInstanceTypeRightSizingMethod: S.optional(S.String),
  copyPrivateIp: S.optional(S.Boolean),
  copyTags: S.optional(S.Boolean),
  licensing: S.optional(Licensing),
  exportBucketArn: S.optional(S.String),
  postLaunchEnabled: S.optional(S.Boolean),
  launchIntoSourceInstance: S.optional(S.Boolean),
}) {}
export const LaunchConfigurationTemplates = S.Array(
  LaunchConfigurationTemplate,
);
export class DescribeRecoveryInstancesRequestFilters extends S.Class<DescribeRecoveryInstancesRequestFilters>(
  "DescribeRecoveryInstancesRequestFilters",
)({
  recoveryInstanceIDs: S.optional(RecoveryInstanceIDs),
  sourceServerIDs: S.optional(SourceServerIDs),
}) {}
export class ReplicationConfigurationTemplate extends S.Class<ReplicationConfigurationTemplate>(
  "ReplicationConfigurationTemplate",
)({
  replicationConfigurationTemplateID: S.String,
  arn: S.optional(S.String),
  stagingAreaSubnetId: S.optional(S.String),
  associateDefaultSecurityGroup: S.optional(S.Boolean),
  replicationServersSecurityGroupsIDs: S.optional(
    ReplicationServersSecurityGroupsIDs,
  ),
  replicationServerInstanceType: S.optional(S.String),
  useDedicatedReplicationServer: S.optional(S.Boolean),
  defaultLargeStagingDiskType: S.optional(S.String),
  ebsEncryption: S.optional(S.String),
  ebsEncryptionKeyArn: S.optional(S.String),
  bandwidthThrottling: S.optional(S.Number),
  dataPlaneRouting: S.optional(S.String),
  createPublicIP: S.optional(S.Boolean),
  stagingAreaTags: S.optional(TagsMap),
  tags: S.optional(TagsMap),
  pitPolicy: S.optional(PITPolicy),
  autoReplicateNewDisks: S.optional(S.Boolean),
}) {}
export const ReplicationConfigurationTemplates = S.Array(
  ReplicationConfigurationTemplate,
);
export class DescribeSourceNetworksRequestFilters extends S.Class<DescribeSourceNetworksRequestFilters>(
  "DescribeSourceNetworksRequestFilters",
)({
  sourceNetworkIDs: S.optional(DescribeSourceNetworksRequestFiltersIDs),
  originAccountID: S.optional(S.String),
  originRegion: S.optional(S.String),
}) {}
export class StartSourceNetworkRecoveryRequestNetworkEntry extends S.Class<StartSourceNetworkRecoveryRequestNetworkEntry>(
  "StartSourceNetworkRecoveryRequestNetworkEntry",
)({ sourceNetworkID: S.String, cfnStackName: S.optional(S.String) }) {}
export const StartSourceNetworkRecoveryRequestNetworkEntries = S.Array(
  StartSourceNetworkRecoveryRequestNetworkEntry,
);
export class DescribeSourceServersRequestFilters extends S.Class<DescribeSourceServersRequestFilters>(
  "DescribeSourceServersRequestFilters",
)({
  sourceServerIDs: S.optional(DescribeSourceServersRequestFiltersIDs),
  hardwareId: S.optional(S.String),
  stagingAccountIDs: S.optional(AccountIDs),
}) {}
export class DescribeRecoverySnapshotsRequestFilters extends S.Class<DescribeRecoverySnapshotsRequestFilters>(
  "DescribeRecoverySnapshotsRequestFilters",
)({ fromDateTime: S.optional(S.String), toDateTime: S.optional(S.String) }) {}
export class LaunchIntoInstanceProperties extends S.Class<LaunchIntoInstanceProperties>(
  "LaunchIntoInstanceProperties",
)({ launchIntoEC2InstanceID: S.optional(S.String) }) {}
export class ReplicationConfigurationReplicatedDisk extends S.Class<ReplicationConfigurationReplicatedDisk>(
  "ReplicationConfigurationReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  isBootDisk: S.optional(S.Boolean),
  stagingDiskType: S.optional(S.String),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
  optimizedStagingDiskType: S.optional(S.String),
}) {}
export const ReplicationConfigurationReplicatedDisks = S.Array(
  ReplicationConfigurationReplicatedDisk,
);
export class StartRecoveryRequestSourceServer extends S.Class<StartRecoveryRequestSourceServer>(
  "StartRecoveryRequestSourceServer",
)({ sourceServerID: S.String, recoverySnapshotID: S.optional(S.String) }) {}
export const StartRecoveryRequestSourceServers = S.Array(
  StartRecoveryRequestSourceServer,
);
export class CreateExtendedSourceServerRequest extends S.Class<CreateExtendedSourceServerRequest>(
  "CreateExtendedSourceServerRequest",
)(
  { sourceServerArn: S.String, tags: S.optional(TagsMap) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateExtendedSourceServer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLaunchActionsRequest extends S.Class<ListLaunchActionsRequest>(
  "ListLaunchActionsRequest",
)(
  {
    resourceId: S.String,
    filters: S.optional(LaunchActionsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListLaunchActions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class DescribeJobsRequest extends S.Class<DescribeJobsRequest>(
  "DescribeJobsRequest",
)(
  {
    filters: S.optional(DescribeJobsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeJobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLaunchConfigurationTemplateRequest extends S.Class<CreateLaunchConfigurationTemplateRequest>(
  "CreateLaunchConfigurationTemplateRequest",
)(
  {
    tags: S.optional(TagsMap),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    exportBucketArn: S.optional(S.String),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoSourceInstance: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateLaunchConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeLaunchConfigurationTemplatesResponse extends S.Class<DescribeLaunchConfigurationTemplatesResponse>(
  "DescribeLaunchConfigurationTemplatesResponse",
)({
  items: S.optional(LaunchConfigurationTemplates),
  nextToken: S.optional(S.String),
}) {}
export class DescribeRecoveryInstancesRequest extends S.Class<DescribeRecoveryInstancesRequest>(
  "DescribeRecoveryInstancesRequest",
)(
  {
    filters: S.optional(DescribeRecoveryInstancesRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeRecoveryInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFailbackReplicationConfigurationResponse extends S.Class<GetFailbackReplicationConfigurationResponse>(
  "GetFailbackReplicationConfigurationResponse",
)({
  recoveryInstanceID: S.String,
  name: S.optional(S.String),
  bandwidthThrottling: S.optional(S.Number),
  usePrivateIP: S.optional(S.Boolean),
}) {}
export class ReverseReplicationResponse extends S.Class<ReverseReplicationResponse>(
  "ReverseReplicationResponse",
)({ reversedDirectionSourceServerArn: S.optional(S.String) }) {}
export class LaunchActionParameter extends S.Class<LaunchActionParameter>(
  "LaunchActionParameter",
)({ value: S.optional(S.String), type: S.optional(S.String) }) {}
export const LaunchActionParameters = S.Record({
  key: S.String,
  value: LaunchActionParameter,
});
export class LaunchAction extends S.Class<LaunchAction>("LaunchAction")({
  actionId: S.optional(S.String),
  actionCode: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  active: S.optional(S.Boolean),
  order: S.optional(S.Number),
  actionVersion: S.optional(S.String),
  optional: S.optional(S.Boolean),
  parameters: S.optional(LaunchActionParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export class LaunchActionRun extends S.Class<LaunchActionRun>(
  "LaunchActionRun",
)({
  action: S.optional(LaunchAction),
  runId: S.optional(S.String),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export const LaunchActionRuns = S.Array(LaunchActionRun);
export class LaunchActionsStatus extends S.Class<LaunchActionsStatus>(
  "LaunchActionsStatus",
)({
  ssmAgentDiscoveryDatetime: S.optional(S.String),
  runs: S.optional(LaunchActionRuns),
}) {}
export class ParticipatingServer extends S.Class<ParticipatingServer>(
  "ParticipatingServer",
)({
  sourceServerID: S.optional(S.String),
  recoveryInstanceID: S.optional(S.String),
  launchStatus: S.optional(S.String),
  launchActionsStatus: S.optional(LaunchActionsStatus),
}) {}
export const ParticipatingServers = S.Array(ParticipatingServer);
export const ParticipatingResourceID = S.Union(
  S.Struct({ sourceNetworkID: S.String }),
);
export class ParticipatingResource extends S.Class<ParticipatingResource>(
  "ParticipatingResource",
)({
  participatingResourceID: S.optional(ParticipatingResourceID),
  launchStatus: S.optional(S.String),
}) {}
export const ParticipatingResources = S.Array(ParticipatingResource);
export class Job extends S.Class<Job>("Job")({
  jobID: S.String,
  arn: S.optional(S.String),
  type: S.optional(S.String),
  initiatedBy: S.optional(S.String),
  creationDateTime: S.optional(S.String),
  endDateTime: S.optional(S.String),
  status: S.optional(S.String),
  participatingServers: S.optional(ParticipatingServers),
  tags: S.optional(TagsMap),
  participatingResources: S.optional(ParticipatingResources),
}) {}
export class TerminateRecoveryInstancesResponse extends S.Class<TerminateRecoveryInstancesResponse>(
  "TerminateRecoveryInstancesResponse",
)({ job: S.optional(Job) }) {}
export class CreateReplicationConfigurationTemplateRequest extends S.Class<CreateReplicationConfigurationTemplateRequest>(
  "CreateReplicationConfigurationTemplateRequest",
)(
  {
    stagingAreaSubnetId: S.String,
    associateDefaultSecurityGroup: S.Boolean,
    replicationServersSecurityGroupsIDs: ReplicationServersSecurityGroupsIDs,
    replicationServerInstanceType: S.String,
    useDedicatedReplicationServer: S.Boolean,
    defaultLargeStagingDiskType: S.String,
    ebsEncryption: S.String,
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.Number,
    dataPlaneRouting: S.String,
    createPublicIP: S.Boolean,
    stagingAreaTags: TagsMap,
    pitPolicy: PITPolicy,
    tags: S.optional(TagsMap),
    autoReplicateNewDisks: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateReplicationConfigurationTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReplicationConfigurationTemplatesResponse extends S.Class<DescribeReplicationConfigurationTemplatesResponse>(
  "DescribeReplicationConfigurationTemplatesResponse",
)({
  items: S.optional(ReplicationConfigurationTemplates),
  nextToken: S.optional(S.String),
}) {}
export class CreateSourceNetworkResponse extends S.Class<CreateSourceNetworkResponse>(
  "CreateSourceNetworkResponse",
)({ sourceNetworkID: S.optional(S.String) }) {}
export class DescribeSourceNetworksRequest extends S.Class<DescribeSourceNetworksRequest>(
  "DescribeSourceNetworksRequest",
)(
  {
    filters: S.optional(DescribeSourceNetworksRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSourceNetworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateSourceNetworkStackResponse extends S.Class<AssociateSourceNetworkStackResponse>(
  "AssociateSourceNetworkStackResponse",
)({ job: S.optional(Job) }) {}
export class ExportSourceNetworkCfnTemplateResponse extends S.Class<ExportSourceNetworkCfnTemplateResponse>(
  "ExportSourceNetworkCfnTemplateResponse",
)({ s3DestinationUrl: S.optional(S.String) }) {}
export class RecoveryLifeCycle extends S.Class<RecoveryLifeCycle>(
  "RecoveryLifeCycle",
)({
  apiCallDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  jobID: S.optional(S.String),
  lastRecoveryResult: S.optional(S.String),
}) {}
export class SourceNetwork extends S.Class<SourceNetwork>("SourceNetwork")({
  sourceNetworkID: S.optional(S.String),
  sourceVpcID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  replicationStatus: S.optional(S.String),
  replicationStatusDetails: S.optional(S.String),
  cfnStackName: S.optional(S.String),
  sourceRegion: S.optional(S.String),
  sourceAccountID: S.optional(S.String),
  lastRecovery: S.optional(RecoveryLifeCycle),
  launchedVpcID: S.optional(S.String),
}) {}
export class StopSourceNetworkReplicationResponse extends S.Class<StopSourceNetworkReplicationResponse>(
  "StopSourceNetworkReplicationResponse",
)({ sourceNetwork: S.optional(SourceNetwork) }) {}
export class StartSourceNetworkRecoveryRequest extends S.Class<StartSourceNetworkRecoveryRequest>(
  "StartSourceNetworkRecoveryRequest",
)(
  {
    sourceNetworks: StartSourceNetworkRecoveryRequestNetworkEntries,
    deployAsNew: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartSourceNetworkRecovery" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSourceServersRequest extends S.Class<DescribeSourceServersRequest>(
  "DescribeSourceServersRequest",
)(
  {
    filters: S.optional(DescribeSourceServersRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeSourceServers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRecoverySnapshotsRequest extends S.Class<DescribeRecoverySnapshotsRequest>(
  "DescribeRecoverySnapshotsRequest",
)(
  {
    sourceServerID: S.String,
    filters: S.optional(DescribeRecoverySnapshotsRequestFilters),
    order: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DescribeRecoverySnapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LaunchConfiguration extends S.Class<LaunchConfiguration>(
  "LaunchConfiguration",
)({
  sourceServerID: S.optional(S.String),
  name: S.optional(S.String),
  ec2LaunchTemplateID: S.optional(S.String),
  launchDisposition: S.optional(S.String),
  targetInstanceTypeRightSizingMethod: S.optional(S.String),
  copyPrivateIp: S.optional(S.Boolean),
  copyTags: S.optional(S.Boolean),
  licensing: S.optional(Licensing),
  postLaunchEnabled: S.optional(S.Boolean),
  launchIntoInstanceProperties: S.optional(LaunchIntoInstanceProperties),
}) {}
export class ReplicationConfiguration extends S.Class<ReplicationConfiguration>(
  "ReplicationConfiguration",
)({
  sourceServerID: S.optional(S.String),
  name: S.optional(S.String),
  stagingAreaSubnetId: S.optional(S.String),
  associateDefaultSecurityGroup: S.optional(S.Boolean),
  replicationServersSecurityGroupsIDs: S.optional(
    ReplicationServersSecurityGroupsIDs,
  ),
  replicationServerInstanceType: S.optional(S.String),
  useDedicatedReplicationServer: S.optional(S.Boolean),
  defaultLargeStagingDiskType: S.optional(S.String),
  replicatedDisks: S.optional(ReplicationConfigurationReplicatedDisks),
  ebsEncryption: S.optional(S.String),
  ebsEncryptionKeyArn: S.optional(S.String),
  bandwidthThrottling: S.optional(S.Number),
  dataPlaneRouting: S.optional(S.String),
  createPublicIP: S.optional(S.Boolean),
  stagingAreaTags: S.optional(TagsMap),
  pitPolicy: S.optional(PITPolicy),
  autoReplicateNewDisks: S.optional(S.Boolean),
}) {}
export class DataReplicationInfoReplicatedDisk extends S.Class<DataReplicationInfoReplicatedDisk>(
  "DataReplicationInfoReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  totalStorageBytes: S.optional(S.Number),
  replicatedStorageBytes: S.optional(S.Number),
  rescannedStorageBytes: S.optional(S.Number),
  backloggedStorageBytes: S.optional(S.Number),
  volumeStatus: S.optional(S.String),
}) {}
export const DataReplicationInfoReplicatedDisks = S.Array(
  DataReplicationInfoReplicatedDisk,
);
export class DataReplicationInitiationStep extends S.Class<DataReplicationInitiationStep>(
  "DataReplicationInitiationStep",
)({ name: S.optional(S.String), status: S.optional(S.String) }) {}
export const DataReplicationInitiationSteps = S.Array(
  DataReplicationInitiationStep,
);
export class DataReplicationInitiation extends S.Class<DataReplicationInitiation>(
  "DataReplicationInitiation",
)({
  startDateTime: S.optional(S.String),
  nextAttemptDateTime: S.optional(S.String),
  steps: S.optional(DataReplicationInitiationSteps),
}) {}
export class DataReplicationError extends S.Class<DataReplicationError>(
  "DataReplicationError",
)({ error: S.optional(S.String), rawError: S.optional(S.String) }) {}
export class DataReplicationInfo extends S.Class<DataReplicationInfo>(
  "DataReplicationInfo",
)({
  lagDuration: S.optional(S.String),
  etaDateTime: S.optional(S.String),
  replicatedDisks: S.optional(DataReplicationInfoReplicatedDisks),
  dataReplicationState: S.optional(S.String),
  dataReplicationInitiation: S.optional(DataReplicationInitiation),
  dataReplicationError: S.optional(DataReplicationError),
  stagingAvailabilityZone: S.optional(S.String),
  stagingOutpostArn: S.optional(S.String),
}) {}
export class LifeCycleLastLaunchInitiated extends S.Class<LifeCycleLastLaunchInitiated>(
  "LifeCycleLastLaunchInitiated",
)({
  apiCallDateTime: S.optional(S.String),
  jobID: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export class LifeCycleLastLaunch extends S.Class<LifeCycleLastLaunch>(
  "LifeCycleLastLaunch",
)({
  initiated: S.optional(LifeCycleLastLaunchInitiated),
  status: S.optional(S.String),
}) {}
export class LifeCycle extends S.Class<LifeCycle>("LifeCycle")({
  addedToServiceDateTime: S.optional(S.String),
  firstByteDateTime: S.optional(S.String),
  elapsedReplicationDuration: S.optional(S.String),
  lastSeenByServiceDateTime: S.optional(S.String),
  lastLaunch: S.optional(LifeCycleLastLaunch),
}) {}
export class IdentificationHints extends S.Class<IdentificationHints>(
  "IdentificationHints",
)({
  fqdn: S.optional(S.String),
  hostname: S.optional(S.String),
  vmWareUuid: S.optional(S.String),
  awsInstanceID: S.optional(S.String),
}) {}
export const IPsList = S.Array(S.String);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  macAddress: S.optional(S.String),
  ips: S.optional(IPsList),
  isPrimary: S.optional(S.Boolean),
}) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class Disk extends S.Class<Disk>("Disk")({
  deviceName: S.optional(S.String),
  bytes: S.optional(S.Number),
}) {}
export const Disks = S.Array(Disk);
export class CPU extends S.Class<CPU>("CPU")({
  cores: S.optional(S.Number),
  modelName: S.optional(S.String),
}) {}
export const Cpus = S.Array(CPU);
export class OS extends S.Class<OS>("OS")({
  fullString: S.optional(S.String),
}) {}
export class SourceProperties extends S.Class<SourceProperties>(
  "SourceProperties",
)({
  lastUpdatedDateTime: S.optional(S.String),
  recommendedInstanceType: S.optional(S.String),
  identificationHints: S.optional(IdentificationHints),
  networkInterfaces: S.optional(NetworkInterfaces),
  disks: S.optional(Disks),
  cpus: S.optional(Cpus),
  ramBytes: S.optional(S.Number),
  os: S.optional(OS),
  supportsNitroInstances: S.optional(S.Boolean),
}) {}
export class StagingArea extends S.Class<StagingArea>("StagingArea")({
  status: S.optional(S.String),
  stagingAccountID: S.optional(S.String),
  stagingSourceServerArn: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class SourceCloudProperties extends S.Class<SourceCloudProperties>(
  "SourceCloudProperties",
)({
  originAccountID: S.optional(S.String),
  originRegion: S.optional(S.String),
  originAvailabilityZone: S.optional(S.String),
  sourceOutpostArn: S.optional(S.String),
}) {}
export class SourceServer extends S.Class<SourceServer>("SourceServer")({
  sourceServerID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  recoveryInstanceId: S.optional(S.String),
  lastLaunchResult: S.optional(S.String),
  dataReplicationInfo: S.optional(DataReplicationInfo),
  lifeCycle: S.optional(LifeCycle),
  sourceProperties: S.optional(SourceProperties),
  stagingArea: S.optional(StagingArea),
  sourceCloudProperties: S.optional(SourceCloudProperties),
  replicationDirection: S.optional(S.String),
  reversedDirectionSourceServerArn: S.optional(S.String),
  sourceNetworkID: S.optional(S.String),
  agentVersion: S.optional(S.String),
}) {}
export class StartReplicationResponse extends S.Class<StartReplicationResponse>(
  "StartReplicationResponse",
)({ sourceServer: S.optional(SourceServer) }) {}
export class StopReplicationResponse extends S.Class<StopReplicationResponse>(
  "StopReplicationResponse",
)({ sourceServer: S.optional(SourceServer) }) {}
export class UpdateLaunchConfigurationRequest extends S.Class<UpdateLaunchConfigurationRequest>(
  "UpdateLaunchConfigurationRequest",
)(
  {
    sourceServerID: S.String,
    name: S.optional(S.String),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoInstanceProperties: S.optional(LaunchIntoInstanceProperties),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateLaunchConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateReplicationConfigurationRequest extends S.Class<UpdateReplicationConfigurationRequest>(
  "UpdateReplicationConfigurationRequest",
)(
  {
    sourceServerID: S.String,
    name: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    replicatedDisks: S.optional(ReplicationConfigurationReplicatedDisks),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateReplicationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRecoveryRequest extends S.Class<StartRecoveryRequest>(
  "StartRecoveryRequest",
)(
  {
    sourceServers: StartRecoveryRequestSourceServers,
    isDrill: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartRecovery" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StagingSourceServer extends S.Class<StagingSourceServer>(
  "StagingSourceServer",
)({
  hostname: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
}) {}
export const StagingSourceServersList = S.Array(StagingSourceServer);
export class Account extends S.Class<Account>("Account")({
  accountID: S.optional(S.String),
}) {}
export const Accounts = S.Array(Account);
export const JobsList = S.Array(Job);
export const SourceNetworksList = S.Array(SourceNetwork);
export const SourceServersList = S.Array(SourceServer);
export class CreateExtendedSourceServerResponse extends S.Class<CreateExtendedSourceServerResponse>(
  "CreateExtendedSourceServerResponse",
)({ sourceServer: S.optional(SourceServer) }) {}
export class ListExtensibleSourceServersResponse extends S.Class<ListExtensibleSourceServersResponse>(
  "ListExtensibleSourceServersResponse",
)({
  items: S.optional(StagingSourceServersList),
  nextToken: S.optional(S.String),
}) {}
export class ListStagingAccountsResponse extends S.Class<ListStagingAccountsResponse>(
  "ListStagingAccountsResponse",
)({ accounts: S.optional(Accounts), nextToken: S.optional(S.String) }) {}
export class PutLaunchActionRequest extends S.Class<PutLaunchActionRequest>(
  "PutLaunchActionRequest",
)(
  {
    resourceId: S.String,
    actionCode: S.String,
    order: S.Number,
    actionId: S.String,
    optional: S.Boolean,
    active: S.Boolean,
    name: S.String,
    actionVersion: S.String,
    category: S.String,
    parameters: S.optional(LaunchActionParameters),
    description: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutLaunchAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobsResponse extends S.Class<DescribeJobsResponse>(
  "DescribeJobsResponse",
)({ items: S.optional(JobsList), nextToken: S.optional(S.String) }) {}
export class CreateLaunchConfigurationTemplateResponse extends S.Class<CreateLaunchConfigurationTemplateResponse>(
  "CreateLaunchConfigurationTemplateResponse",
)({ launchConfigurationTemplate: S.optional(LaunchConfigurationTemplate) }) {}
export class UpdateLaunchConfigurationTemplateResponse extends S.Class<UpdateLaunchConfigurationTemplateResponse>(
  "UpdateLaunchConfigurationTemplateResponse",
)({ launchConfigurationTemplate: S.optional(LaunchConfigurationTemplate) }) {}
export class DescribeSourceNetworksResponse extends S.Class<DescribeSourceNetworksResponse>(
  "DescribeSourceNetworksResponse",
)({ items: S.optional(SourceNetworksList), nextToken: S.optional(S.String) }) {}
export class StartSourceNetworkRecoveryResponse extends S.Class<StartSourceNetworkRecoveryResponse>(
  "StartSourceNetworkRecoveryResponse",
)({ job: S.optional(Job) }) {}
export class DescribeSourceServersResponse extends S.Class<DescribeSourceServersResponse>(
  "DescribeSourceServersResponse",
)({ items: S.optional(SourceServersList), nextToken: S.optional(S.String) }) {}
export class StartRecoveryResponse extends S.Class<StartRecoveryResponse>(
  "StartRecoveryResponse",
)({ job: S.optional(Job) }) {}
export const EbsSnapshotsList = S.Array(S.String);
export const LaunchActions = S.Array(LaunchAction);
export class RecoverySnapshot extends S.Class<RecoverySnapshot>(
  "RecoverySnapshot",
)({
  snapshotID: S.String,
  sourceServerID: S.String,
  expectedTimestamp: S.String,
  timestamp: S.optional(S.String),
  ebsSnapshots: S.optional(EbsSnapshotsList),
}) {}
export const RecoverySnapshotsList = S.Array(RecoverySnapshot);
export class ListLaunchActionsResponse extends S.Class<ListLaunchActionsResponse>(
  "ListLaunchActionsResponse",
)({ items: S.optional(LaunchActions), nextToken: S.optional(S.String) }) {}
export class PutLaunchActionResponse extends S.Class<PutLaunchActionResponse>(
  "PutLaunchActionResponse",
)({
  resourceId: S.optional(S.String),
  actionId: S.optional(S.String),
  actionCode: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  active: S.optional(S.Boolean),
  order: S.optional(S.Number),
  actionVersion: S.optional(S.String),
  optional: S.optional(S.Boolean),
  parameters: S.optional(LaunchActionParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export class StartSourceNetworkReplicationResponse extends S.Class<StartSourceNetworkReplicationResponse>(
  "StartSourceNetworkReplicationResponse",
)({ sourceNetwork: S.optional(SourceNetwork) }) {}
export class DescribeRecoverySnapshotsResponse extends S.Class<DescribeRecoverySnapshotsResponse>(
  "DescribeRecoverySnapshotsResponse",
)({
  items: S.optional(RecoverySnapshotsList),
  nextToken: S.optional(S.String),
}) {}
export class RecoveryInstanceFailback extends S.Class<RecoveryInstanceFailback>(
  "RecoveryInstanceFailback",
)({
  failbackClientID: S.optional(S.String),
  failbackJobID: S.optional(S.String),
  failbackInitiationTime: S.optional(S.String),
  state: S.optional(S.String),
  agentLastSeenByServiceDateTime: S.optional(S.String),
  failbackClientLastSeenByServiceDateTime: S.optional(S.String),
  failbackToOriginalServer: S.optional(S.Boolean),
  firstByteDateTime: S.optional(S.String),
  elapsedReplicationDuration: S.optional(S.String),
  failbackLaunchType: S.optional(S.String),
}) {}
export const VolumeToSizeMap = S.Record({ key: S.String, value: S.Number });
export class SourceNetworkData extends S.Class<SourceNetworkData>(
  "SourceNetworkData",
)({
  sourceNetworkID: S.optional(S.String),
  sourceVpc: S.optional(S.String),
  targetVpc: S.optional(S.String),
  stackName: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.optional(S.String), message: S.optional(S.String) }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export const EventResourceData = S.Union(
  S.Struct({ sourceNetworkData: SourceNetworkData }),
);
export class RecoveryInstanceDataReplicationInfoReplicatedDisk extends S.Class<RecoveryInstanceDataReplicationInfoReplicatedDisk>(
  "RecoveryInstanceDataReplicationInfoReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  totalStorageBytes: S.optional(S.Number),
  replicatedStorageBytes: S.optional(S.Number),
  rescannedStorageBytes: S.optional(S.Number),
  backloggedStorageBytes: S.optional(S.Number),
}) {}
export const RecoveryInstanceDataReplicationInfoReplicatedDisks = S.Array(
  RecoveryInstanceDataReplicationInfoReplicatedDisk,
);
export class RecoveryInstanceDataReplicationError extends S.Class<RecoveryInstanceDataReplicationError>(
  "RecoveryInstanceDataReplicationError",
)({ error: S.optional(S.String), rawError: S.optional(S.String) }) {}
export class RecoveryInstanceDisk extends S.Class<RecoveryInstanceDisk>(
  "RecoveryInstanceDisk",
)({
  internalDeviceName: S.optional(S.String),
  bytes: S.optional(S.Number),
  ebsVolumeID: S.optional(S.String),
}) {}
export const RecoveryInstanceDisks = S.Array(RecoveryInstanceDisk);
export const ConversionMap = S.Record({ key: S.String, value: S.String });
export class ProductCode extends S.Class<ProductCode>("ProductCode")({
  productCodeId: S.optional(S.String),
  productCodeMode: S.optional(S.String),
}) {}
export const ProductCodes = S.Array(ProductCode);
export class RecoveryInstanceProperties extends S.Class<RecoveryInstanceProperties>(
  "RecoveryInstanceProperties",
)({
  lastUpdatedDateTime: S.optional(S.String),
  identificationHints: S.optional(IdentificationHints),
  networkInterfaces: S.optional(NetworkInterfaces),
  disks: S.optional(RecoveryInstanceDisks),
  cpus: S.optional(Cpus),
  ramBytes: S.optional(S.Number),
  os: S.optional(OS),
}) {}
export const VolumeToConversionMap = S.Record({
  key: S.String,
  value: ConversionMap,
});
export const VolumeToProductCodes = S.Record({
  key: S.String,
  value: ProductCodes,
});
export class RecoveryInstanceDataReplicationInitiationStep extends S.Class<RecoveryInstanceDataReplicationInitiationStep>(
  "RecoveryInstanceDataReplicationInitiationStep",
)({ name: S.optional(S.String), status: S.optional(S.String) }) {}
export const RecoveryInstanceDataReplicationInitiationSteps = S.Array(
  RecoveryInstanceDataReplicationInitiationStep,
);
export class ConversionProperties extends S.Class<ConversionProperties>(
  "ConversionProperties",
)({
  volumeToConversionMap: S.optional(VolumeToConversionMap),
  rootVolumeName: S.optional(S.String),
  forceUefi: S.optional(S.Boolean),
  dataTimestamp: S.optional(S.String),
  volumeToVolumeSize: S.optional(VolumeToSizeMap),
  volumeToProductCodes: S.optional(VolumeToProductCodes),
}) {}
export class RecoveryInstanceDataReplicationInitiation extends S.Class<RecoveryInstanceDataReplicationInitiation>(
  "RecoveryInstanceDataReplicationInitiation",
)({
  startDateTime: S.optional(S.String),
  steps: S.optional(RecoveryInstanceDataReplicationInitiationSteps),
}) {}
export class StartFailbackLaunchResponse extends S.Class<StartFailbackLaunchResponse>(
  "StartFailbackLaunchResponse",
)({ job: S.optional(Job) }) {}
export class JobLogEventData extends S.Class<JobLogEventData>(
  "JobLogEventData",
)({
  sourceServerID: S.optional(S.String),
  conversionServerID: S.optional(S.String),
  targetInstanceID: S.optional(S.String),
  rawError: S.optional(S.String),
  conversionProperties: S.optional(ConversionProperties),
  eventResourceData: S.optional(EventResourceData),
}) {}
export class RecoveryInstanceDataReplicationInfo extends S.Class<RecoveryInstanceDataReplicationInfo>(
  "RecoveryInstanceDataReplicationInfo",
)({
  lagDuration: S.optional(S.String),
  etaDateTime: S.optional(S.String),
  replicatedDisks: S.optional(
    RecoveryInstanceDataReplicationInfoReplicatedDisks,
  ),
  dataReplicationState: S.optional(S.String),
  dataReplicationInitiation: S.optional(
    RecoveryInstanceDataReplicationInitiation,
  ),
  dataReplicationError: S.optional(RecoveryInstanceDataReplicationError),
  stagingAvailabilityZone: S.optional(S.String),
  stagingOutpostArn: S.optional(S.String),
}) {}
export class JobLog extends S.Class<JobLog>("JobLog")({
  logDateTime: S.optional(S.String),
  event: S.optional(S.String),
  eventData: S.optional(JobLogEventData),
}) {}
export const JobLogs = S.Array(JobLog);
export class RecoveryInstance extends S.Class<RecoveryInstance>(
  "RecoveryInstance",
)({
  ec2InstanceID: S.optional(S.String),
  ec2InstanceState: S.optional(S.String),
  jobID: S.optional(S.String),
  recoveryInstanceID: S.optional(S.String),
  sourceServerID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  failback: S.optional(RecoveryInstanceFailback),
  dataReplicationInfo: S.optional(RecoveryInstanceDataReplicationInfo),
  recoveryInstanceProperties: S.optional(RecoveryInstanceProperties),
  pointInTimeSnapshotDateTime: S.optional(S.String),
  isDrill: S.optional(S.Boolean),
  originEnvironment: S.optional(S.String),
  originAvailabilityZone: S.optional(S.String),
  agentVersion: S.optional(S.String),
  sourceOutpostArn: S.optional(S.String),
}) {}
export const DescribeRecoveryInstancesItems = S.Array(RecoveryInstance);
export class DescribeJobLogItemsResponse extends S.Class<DescribeJobLogItemsResponse>(
  "DescribeJobLogItemsResponse",
)({ items: S.optional(JobLogs), nextToken: S.optional(S.String) }) {}
export class DescribeRecoveryInstancesResponse extends S.Class<DescribeRecoveryInstancesResponse>(
  "DescribeRecoveryInstancesResponse",
)({
  nextToken: S.optional(S.String),
  items: S.optional(DescribeRecoveryInstancesItems),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), code: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UninitializedAccountException extends S.TaggedError<UninitializedAccountException>()(
  "UninitializedAccountException",
  { message: S.optional(S.String), code: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Deletes a single Job by ID.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Lists all Failback ReplicationConfigurations, filtered by Recovery Instance ID.
 */
export const getFailbackReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFailbackReplicationConfigurationRequest,
    output: GetFailbackReplicationConfigurationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }));
/**
 * Gets a LaunchConfiguration, filtered by Source Server IDs.
 */
export const getLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLaunchConfigurationRequest,
    output: LaunchConfiguration,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Gets a ReplicationConfiguration, filtered by Source Server ID.
 */
export const getReplicationConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReplicationConfigurationRequest,
    output: ReplicationConfiguration,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Starts replication for a stopped Source Server. This action would make the Source Server protected again and restart billing for it.
 */
export const startReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplicationRequest,
  output: StartReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Stops replication for a Source Server. This action would make the Source Server unprotected, delete its existing snapshots and stop billing for it.
 */
export const stopReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationRequest,
  output: StopReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Stops the failback process for a specified Recovery Instance. This changes the Failback State of the Recovery Instance back to FAILBACK_NOT_STARTED.
 */
export const stopFailback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFailbackRequest,
  output: StopFailbackResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Allows you to update the failback replication configuration of a Recovery Instance by ID.
 */
export const updateFailbackReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateFailbackReplicationConfigurationRequest,
    output: UpdateFailbackReplicationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }));
/**
 * Deletes a single Launch Configuration Template by ID.
 */
export const deleteLaunchConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteLaunchConfigurationTemplateRequest,
    output: DeleteLaunchConfigurationTemplateResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }));
/**
 * Disconnect a Recovery Instance from Elastic Disaster Recovery. Data replication is stopped immediately. All AWS resources created by Elastic Disaster Recovery for enabling the replication of the Recovery Instance will be terminated / deleted within 90 minutes. If the agent on the Recovery Instance has not been prevented from communicating with the Elastic Disaster Recovery service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the Recovery Instance will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const disconnectRecoveryInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisconnectRecoveryInstanceRequest,
    output: DisconnectRecoveryInstanceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Deletes a single Replication Configuration Template by ID
 */
export const deleteReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteReplicationConfigurationTemplateRequest,
    output: DeleteReplicationConfigurationTemplateResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }));
/**
 * Delete Source Network resource.
 */
export const deleteSourceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceNetworkRequest,
  output: DeleteSourceNetworkResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Source Server by ID. The Source Server must be disconnected first.
 */
export const deleteSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceServerRequest,
  output: DeleteSourceServerResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Recovery Instance by ID. This deletes the Recovery Instance resource from Elastic Disaster Recovery. The Recovery Instance must be disconnected first in order to delete it.
 */
export const deleteRecoveryInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRecoveryInstanceRequest,
    output: DeleteRecoveryInstanceResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Initiates a Job for terminating the EC2 resources associated with the specified Recovery Instances, and then will delete the Recovery Instances from the Elastic Disaster Recovery service.
 */
export const terminateRecoveryInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateRecoveryInstancesRequest,
    output: TerminateRecoveryInstancesResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Launches Recovery Instances for the specified Source Servers. For each Source Server you may choose a point in time snapshot to launch from, or use an on demand snapshot.
 */
export const startRecovery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRecoveryRequest,
  output: StartRecoveryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Lists resource launch actions.
 */
export const listLaunchActions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLaunchActionsRequest,
    output: ListLaunchActionsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Starts replication for a Source Network. This action would make the Source Network protected.
 */
export const startSourceNetworkReplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartSourceNetworkReplicationRequest,
    output: StartSourceNetworkReplicationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }));
/**
 * Disconnects a specific Source Server from Elastic Disaster Recovery. Data replication is stopped immediately. All AWS resources created by Elastic Disaster Recovery for enabling the replication of the Source Server will be terminated / deleted within 90 minutes. You cannot disconnect a Source Server if it has a Recovery Instance. If the agent on the Source Server has not been prevented from communicating with the Elastic Disaster Recovery service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const disconnectSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisconnectSourceServerRequest,
    output: SourceServer,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Initialize Elastic Disaster Recovery.
 */
export const initializeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceRequest,
  output: InitializeServiceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all tags for your Elastic Disaster Recovery resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or overwrites only the specified tags for the specified Elastic Disaster Recovery resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified set of tags from the specified set of Elastic Disaster Recovery resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Launch Configuration Templates, filtered by Launch Configuration Template IDs
 */
export const describeLaunchConfigurationTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeLaunchConfigurationTemplatesRequest,
    output: DescribeLaunchConfigurationTemplatesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Start replication to origin / target region - applies only to protected instances that originated in EC2.
 * For recovery instances on target region - starts replication back to origin region.
 * For failback instances on origin region - starts replication to target region to re-protect them.
 */
export const reverseReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReverseReplicationRequest,
  output: ReverseReplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Updates a ReplicationConfigurationTemplate by ID.
 */
export const updateReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateReplicationConfigurationTemplateRequest,
    output: ReplicationConfigurationTemplate,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Lists all ReplicationConfigurationTemplates, filtered by Source Server IDs.
 */
export const describeReplicationConfigurationTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationConfigurationTemplatesRequest,
    output: DescribeReplicationConfigurationTemplatesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Create a new Source Network resource for a provided VPC ID.
 */
export const createSourceNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSourceNetworkRequest,
  output: CreateSourceNetworkResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Associate a Source Network to an existing CloudFormation Stack and modify launch templates to use this network. Can be used for reverting to previously deployed CloudFormation stacks.
 */
export const associateSourceNetworkStack = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSourceNetworkStackRequest,
    output: AssociateSourceNetworkStackResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Export the Source Network CloudFormation template to an S3 bucket.
 */
export const exportSourceNetworkCfnTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportSourceNetworkCfnTemplateRequest,
    output: ExportSourceNetworkCfnTemplateResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Stops replication for a Source Network. This action would make the Source Network unprotected.
 */
export const stopSourceNetworkReplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopSourceNetworkReplicationRequest,
    output: StopSourceNetworkReplicationResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Updates a LaunchConfiguration by Source Server ID.
 */
export const updateLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLaunchConfigurationRequest,
    output: LaunchConfiguration,
    errors: [
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Allows you to update a ReplicationConfiguration by Source Server ID.
 */
export const updateReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateReplicationConfigurationRequest,
    output: ReplicationConfiguration,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * WARNING: RetryDataReplication is deprecated.
 * Causes the data replication initiation sequence to begin immediately upon next Handshake for the specified Source Server ID, regardless of when the previous initiation started. This command will work only if the Source Server is stalled or is in a DISCONNECTED or STOPPED state.
 */
export const retryDataReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetryDataReplicationRequest,
    output: SourceServer,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Create an extended source server in the target Account based on the source server in staging account.
 */
export const createExtendedSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExtendedSourceServerRequest,
    output: CreateExtendedSourceServerResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new ReplicationConfigurationTemplate.
 */
export const createReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateReplicationConfigurationTemplateRequest,
    output: ReplicationConfigurationTemplate,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Creates a new Launch Configuration Template.
 */
export const createLaunchConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLaunchConfigurationTemplateRequest,
    output: CreateLaunchConfigurationTemplateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Deletes a resource launch action.
 */
export const deleteLaunchAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchActionRequest,
  output: DeleteLaunchActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Returns a list of source servers on a staging account that are extensible, which means that:
 * a. The source server is not already extended into this Account.
 * b. The source server on the Account we’re reading from is not an extension of another source server.
 */
export const listExtensibleSourceServers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListExtensibleSourceServersRequest,
    output: ListExtensibleSourceServersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Returns an array of staging accounts for existing extended source servers.
 */
export const listStagingAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStagingAccountsRequest,
    output: ListStagingAccountsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "accounts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of Jobs. Use the JobsID and fromDate and toDate filters to limit which jobs are returned. The response is sorted by creationDataTime - latest date first. Jobs are created by the StartRecovery, TerminateRecoveryInstances and StartFailbackLaunch APIs. Jobs are also created by DiagnosticLaunch and TerminateDiagnosticInstances, which are APIs available only to *Support* and only used in response to relevant support tickets.
 */
export const describeJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeJobsRequest,
    output: DescribeJobsResponse,
    errors: [
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an existing Launch Configuration Template by ID.
 */
export const updateLaunchConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLaunchConfigurationTemplateRequest,
    output: UpdateLaunchConfigurationTemplateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Lists all Source Networks or multiple Source Networks filtered by ID.
 */
export const describeSourceNetworks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeSourceNetworksRequest,
    output: DescribeSourceNetworksResponse,
    errors: [
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Deploy VPC for the specified Source Network and modify launch templates to use this network. The VPC will be deployed using a dedicated CloudFormation stack.
 */
export const startSourceNetworkRecovery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSourceNetworkRecoveryRequest,
    output: StartSourceNetworkRecoveryResponse,
    errors: [
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all Source Servers or multiple Source Servers filtered by ID.
 */
export const describeSourceServers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeSourceServersRequest,
    output: DescribeSourceServersResponse,
    errors: [
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Puts a resource launch action.
 */
export const putLaunchAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLaunchActionRequest,
  output: PutLaunchActionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Lists all Recovery Snapshots for a single Source Server.
 */
export const describeRecoverySnapshots =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeRecoverySnapshotsRequest,
    output: DescribeRecoverySnapshotsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Initiates a Job for launching the machine that is being failed back to from the specified Recovery Instance. This will run conversion on the failback client and will reboot your machine, thus completing the failback process.
 */
export const startFailbackLaunch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFailbackLaunchRequest,
  output: StartFailbackLaunchResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Retrieves a detailed Job log with pagination.
 */
export const describeJobLogItems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeJobLogItemsRequest,
    output: DescribeJobLogItemsResponse,
    errors: [
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
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
 * Lists all Recovery Instances or multiple Recovery Instances by ID.
 */
export const describeRecoveryInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeRecoveryInstancesRequest,
    output: DescribeRecoveryInstancesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
