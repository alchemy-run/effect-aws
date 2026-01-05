import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "mgn",
  serviceShapeName: "ApplicationMigrationService",
});
const auth = T.AwsAuthSigv4({ name: "mgn" });
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
                        url: "https://mgn-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mgn-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mgn.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mgn.{Region}.{PartitionResult#dnsSuffix}",
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
export const AssociateSourceServersRequestSourceServerIDs = S.Array(S.String);
export const DisassociateSourceServersRequestSourceServerIDs = S.Array(
  S.String,
);
export const LaunchConfigurationTemplateIDs = S.Array(S.String);
export const ReplicationServersSecurityGroupsIDs = S.Array(S.String);
export const ReplicationConfigurationTemplateIDs = S.Array(S.String);
export const StartCutoverRequestSourceServerIDs = S.Array(S.String);
export const StartTestRequestSourceServerIDs = S.Array(S.String);
export const TerminateTargetInstancesRequestSourceServerIDs = S.Array(S.String);
export const ApplicationIDs = S.Array(S.String);
export class ListManagedAccountsRequest extends S.Class<ListManagedAccountsRequest>(
  "ListManagedAccountsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListManagedAccounts" }),
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
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagsMap),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateApplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { applicationID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteApplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class ArchiveApplicationRequest extends S.Class<ArchiveApplicationRequest>(
  "ArchiveApplicationRequest",
)(
  { applicationID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ArchiveApplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateSourceServersRequest extends S.Class<AssociateSourceServersRequest>(
  "AssociateSourceServersRequest",
)(
  {
    applicationID: S.String,
    sourceServerIDs: AssociateSourceServersRequestSourceServerIDs,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/AssociateSourceServers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateSourceServersResponse extends S.Class<AssociateSourceServersResponse>(
  "AssociateSourceServersResponse",
)({}) {}
export class DisassociateSourceServersRequest extends S.Class<DisassociateSourceServersRequest>(
  "DisassociateSourceServersRequest",
)(
  {
    applicationID: S.String,
    sourceServerIDs: DisassociateSourceServersRequestSourceServerIDs,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DisassociateSourceServers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateSourceServersResponse extends S.Class<DisassociateSourceServersResponse>(
  "DisassociateSourceServersResponse",
)({}) {}
export class UnarchiveApplicationRequest extends S.Class<UnarchiveApplicationRequest>(
  "UnarchiveApplicationRequest",
)(
  { applicationID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/UnarchiveApplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    applicationID: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateApplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ConnectorSsmCommandConfig extends S.Class<ConnectorSsmCommandConfig>(
  "ConnectorSsmCommandConfig",
)({
  s3OutputEnabled: S.Boolean,
  outputS3BucketName: S.optional(S.String),
  cloudWatchOutputEnabled: S.Boolean,
  cloudWatchLogGroupName: S.optional(S.String),
}) {}
export class UpdateConnectorRequest extends S.Class<UpdateConnectorRequest>(
  "UpdateConnectorRequest",
)(
  {
    connectorID: S.String,
    name: S.optional(S.String),
    ssmCommandConfig: S.optional(ConnectorSsmCommandConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateConnector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorRequest extends S.Class<DeleteConnectorRequest>(
  "DeleteConnectorRequest",
)(
  { connectorID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteConnector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorResponse extends S.Class<DeleteConnectorResponse>(
  "DeleteConnectorResponse",
)({}) {}
export class StartExportRequest extends S.Class<StartExportRequest>(
  "StartExportRequest",
)(
  {
    s3Bucket: S.String,
    s3Key: S.String,
    s3BucketOwner: S.optional(S.String),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartExport" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExportErrorsRequest extends S.Class<ListExportErrorsRequest>(
  "ListExportErrorsRequest",
)(
  {
    exportID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListExportErrors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImportErrorsRequest extends S.Class<ListImportErrorsRequest>(
  "ListImportErrorsRequest",
)(
  {
    importID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImportErrors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  { jobID: S.String, accountID: S.optional(S.String) },
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
    accountID: S.optional(S.String),
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
export class SsmParameterStoreParameter extends S.Class<SsmParameterStoreParameter>(
  "SsmParameterStoreParameter",
)({ parameterType: S.String, parameterName: S.String }) {}
export const SsmParameterStoreParameters = S.Array(SsmParameterStoreParameter);
export const SsmDocumentParameters = S.Record({
  key: S.String,
  value: SsmParameterStoreParameters,
});
export const SsmExternalParameter = S.Union(
  S.Struct({ dynamicPath: S.String }),
);
export const SsmDocumentExternalParameters = S.Record({
  key: S.String,
  value: SsmExternalParameter,
});
export class SsmDocument extends S.Class<SsmDocument>("SsmDocument")({
  actionName: S.String,
  ssmDocumentName: S.String,
  timeoutSeconds: S.optional(S.Number),
  mustSucceedForCutover: S.optional(S.Boolean),
  parameters: S.optional(SsmDocumentParameters),
  externalParameters: S.optional(SsmDocumentExternalParameters),
}) {}
export const SsmDocuments = S.Array(SsmDocument);
export class PostLaunchActions extends S.Class<PostLaunchActions>(
  "PostLaunchActions",
)({
  deployment: S.optional(S.String),
  s3LogBucket: S.optional(S.String),
  s3OutputKeyPrefix: S.optional(S.String),
  cloudWatchLogGroupName: S.optional(S.String),
  ssmDocuments: S.optional(SsmDocuments),
}) {}
export class Licensing extends S.Class<Licensing>("Licensing")({
  osByol: S.optional(S.Boolean),
}) {}
export class LaunchTemplateDiskConf extends S.Class<LaunchTemplateDiskConf>(
  "LaunchTemplateDiskConf",
)({
  volumeType: S.optional(S.String),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
}) {}
export class UpdateLaunchConfigurationTemplateRequest extends S.Class<UpdateLaunchConfigurationTemplateRequest>(
  "UpdateLaunchConfigurationTemplateRequest",
)(
  {
    launchConfigurationTemplateID: S.String,
    postLaunchActions: S.optional(PostLaunchActions),
    enableMapAutoTagging: S.optional(S.Boolean),
    mapAutoTaggingMpeID: S.optional(S.String),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    associatePublicIpAddress: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    bootMode: S.optional(S.String),
    smallVolumeMaxSize: S.optional(S.Number),
    smallVolumeConf: S.optional(LaunchTemplateDiskConf),
    largeVolumeConf: S.optional(LaunchTemplateDiskConf),
    enableParametersEncryption: S.optional(S.Boolean),
    parametersEncryptionKey: S.optional(S.String),
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
export class RemoveTemplateActionRequest extends S.Class<RemoveTemplateActionRequest>(
  "RemoveTemplateActionRequest",
)(
  { launchConfigurationTemplateID: S.String, actionID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/RemoveTemplateAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveTemplateActionResponse extends S.Class<RemoveTemplateActionResponse>(
  "RemoveTemplateActionResponse",
)({}) {}
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
    useFipsEndpoint: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
    internetProtocol: S.optional(S.String),
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
    useFipsEndpoint: S.optional(S.Boolean),
    internetProtocol: S.optional(S.String),
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
export class DeleteSourceServerRequest extends S.Class<DeleteSourceServerRequest>(
  "DeleteSourceServerRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
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
export class DisconnectFromServiceRequest extends S.Class<DisconnectFromServiceRequest>(
  "DisconnectFromServiceRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DisconnectFromService" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class FinalizeCutoverRequest extends S.Class<FinalizeCutoverRequest>(
  "FinalizeCutoverRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/FinalizeCutover" }),
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
  { sourceServerID: S.String, accountID: S.optional(S.String) },
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
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetReplicationConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MarkAsArchivedRequest extends S.Class<MarkAsArchivedRequest>(
  "MarkAsArchivedRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/MarkAsArchived" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PauseReplicationRequest extends S.Class<PauseReplicationRequest>(
  "PauseReplicationRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/PauseReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSourceServerActionRequest extends S.Class<PutSourceServerActionRequest>(
  "PutSourceServerActionRequest",
)(
  {
    sourceServerID: S.String,
    actionName: S.String,
    documentIdentifier: S.String,
    order: S.Number,
    actionID: S.String,
    documentVersion: S.optional(S.String),
    active: S.optional(S.Boolean),
    timeoutSeconds: S.optional(S.Number),
    mustSucceedForCutover: S.optional(S.Boolean),
    parameters: S.optional(SsmDocumentParameters),
    externalParameters: S.optional(SsmDocumentExternalParameters),
    description: S.optional(S.String),
    category: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutSourceServerAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveSourceServerActionRequest extends S.Class<RemoveSourceServerActionRequest>(
  "RemoveSourceServerActionRequest",
)(
  {
    sourceServerID: S.String,
    actionID: S.String,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/RemoveSourceServerAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveSourceServerActionResponse extends S.Class<RemoveSourceServerActionResponse>(
  "RemoveSourceServerActionResponse",
)({}) {}
export class ResumeReplicationRequest extends S.Class<ResumeReplicationRequest>(
  "ResumeReplicationRequest",
)(
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ResumeReplication" }),
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
  { sourceServerID: S.String, accountID: S.optional(S.String) },
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
  { sourceServerID: S.String, accountID: S.optional(S.String) },
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
  { sourceServerID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/StopReplication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
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
    bootMode: S.optional(S.String),
    postLaunchActions: S.optional(PostLaunchActions),
    enableMapAutoTagging: S.optional(S.Boolean),
    mapAutoTaggingMpeID: S.optional(S.String),
    accountID: S.optional(S.String),
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
export class UpdateSourceServerReplicationTypeRequest extends S.Class<UpdateSourceServerReplicationTypeRequest>(
  "UpdateSourceServerReplicationTypeRequest",
)(
  {
    sourceServerID: S.String,
    replicationType: S.String,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateSourceServerReplicationType" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCutoverRequest extends S.Class<StartCutoverRequest>(
  "StartCutoverRequest",
)(
  {
    sourceServerIDs: StartCutoverRequestSourceServerIDs,
    tags: S.optional(TagsMap),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartCutover" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTestRequest extends S.Class<StartTestRequest>(
  "StartTestRequest",
)(
  {
    sourceServerIDs: StartTestRequestSourceServerIDs,
    tags: S.optional(TagsMap),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartTest" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TerminateTargetInstancesRequest extends S.Class<TerminateTargetInstancesRequest>(
  "TerminateTargetInstancesRequest",
)(
  {
    sourceServerIDs: TerminateTargetInstancesRequestSourceServerIDs,
    tags: S.optional(TagsMap),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/TerminateTargetInstances" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVcenterClientRequest extends S.Class<DeleteVcenterClientRequest>(
  "DeleteVcenterClientRequest",
)(
  { vcenterClientID: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteVcenterClient" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVcenterClientResponse extends S.Class<DeleteVcenterClientResponse>(
  "DeleteVcenterClientResponse",
)({}) {}
export class DescribeVcenterClientsRequest extends S.Class<DescribeVcenterClientsRequest>(
  "DescribeVcenterClientsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/DescribeVcenterClients" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWaveRequest extends S.Class<CreateWaveRequest>(
  "CreateWaveRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagsMap),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateWave" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWaveRequest extends S.Class<DeleteWaveRequest>(
  "DeleteWaveRequest",
)(
  { waveID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteWave" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWaveResponse extends S.Class<DeleteWaveResponse>(
  "DeleteWaveResponse",
)({}) {}
export class ArchiveWaveRequest extends S.Class<ArchiveWaveRequest>(
  "ArchiveWaveRequest",
)(
  { waveID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ArchiveWave" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateApplicationsRequest extends S.Class<AssociateApplicationsRequest>(
  "AssociateApplicationsRequest",
)(
  {
    waveID: S.String,
    applicationIDs: ApplicationIDs,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/AssociateApplications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateApplicationsResponse extends S.Class<AssociateApplicationsResponse>(
  "AssociateApplicationsResponse",
)({}) {}
export class DisassociateApplicationsRequest extends S.Class<DisassociateApplicationsRequest>(
  "DisassociateApplicationsRequest",
)(
  {
    waveID: S.String,
    applicationIDs: ApplicationIDs,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/DisassociateApplications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateApplicationsResponse extends S.Class<DisassociateApplicationsResponse>(
  "DisassociateApplicationsResponse",
)({}) {}
export class UnarchiveWaveRequest extends S.Class<UnarchiveWaveRequest>(
  "UnarchiveWaveRequest",
)(
  { waveID: S.String, accountID: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/UnarchiveWave" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWaveRequest extends S.Class<UpdateWaveRequest>(
  "UpdateWaveRequest",
)(
  {
    waveID: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateWave" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ApplicationIDsFilter = S.Array(S.String);
export const WaveIDsFilter = S.Array(S.String);
export const ConnectorIDsFilter = S.Array(S.String);
export const ListExportsRequestFiltersExportIDs = S.Array(S.String);
export const ImportIDsFilter = S.Array(S.String);
export const DescribeJobsRequestFiltersJobIDs = S.Array(S.String);
export const ActionIDs = S.Array(S.String);
export const DescribeSourceServersRequestFiltersIDs = S.Array(S.String);
export const ReplicationTypes = S.Array(S.String);
export const LifeCycleStates = S.Array(S.String);
export const DescribeSourceServersRequestApplicationIDs = S.Array(S.String);
export class ListApplicationsRequestFilters extends S.Class<ListApplicationsRequestFilters>(
  "ListApplicationsRequestFilters",
)({
  applicationIDs: S.optional(ApplicationIDsFilter),
  isArchived: S.optional(S.Boolean),
  waveIDs: S.optional(WaveIDsFilter),
}) {}
export class ListConnectorsRequestFilters extends S.Class<ListConnectorsRequestFilters>(
  "ListConnectorsRequestFilters",
)({ connectorIDs: S.optional(ConnectorIDsFilter) }) {}
export class ListExportsRequestFilters extends S.Class<ListExportsRequestFilters>(
  "ListExportsRequestFilters",
)({ exportIDs: S.optional(ListExportsRequestFiltersExportIDs) }) {}
export class S3BucketSource extends S.Class<S3BucketSource>("S3BucketSource")({
  s3Bucket: S.String,
  s3Key: S.String,
  s3BucketOwner: S.optional(S.String),
}) {}
export class ListImportsRequestFilters extends S.Class<ListImportsRequestFilters>(
  "ListImportsRequestFilters",
)({ importIDs: S.optional(ImportIDsFilter) }) {}
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
  launchConfigurationTemplateID: S.String,
  arn: S.optional(S.String),
  postLaunchActions: S.optional(PostLaunchActions),
  enableMapAutoTagging: S.optional(S.Boolean),
  mapAutoTaggingMpeID: S.optional(S.String),
  tags: S.optional(TagsMap),
  ec2LaunchTemplateID: S.optional(S.String),
  launchDisposition: S.optional(S.String),
  targetInstanceTypeRightSizingMethod: S.optional(S.String),
  copyPrivateIp: S.optional(S.Boolean),
  associatePublicIpAddress: S.optional(S.Boolean),
  copyTags: S.optional(S.Boolean),
  licensing: S.optional(Licensing),
  bootMode: S.optional(S.String),
  smallVolumeMaxSize: S.optional(S.Number),
  smallVolumeConf: S.optional(LaunchTemplateDiskConf),
  largeVolumeConf: S.optional(LaunchTemplateDiskConf),
  enableParametersEncryption: S.optional(S.Boolean),
  parametersEncryptionKey: S.optional(S.String),
}) {}
export const LaunchConfigurationTemplates = S.Array(
  LaunchConfigurationTemplate,
);
export class TemplateActionsRequestFilters extends S.Class<TemplateActionsRequestFilters>(
  "TemplateActionsRequestFilters",
)({ actionIDs: S.optional(ActionIDs) }) {}
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
  useFipsEndpoint: S.optional(S.Boolean),
  tags: S.optional(TagsMap),
  internetProtocol: S.optional(S.String),
}) {}
export const ReplicationConfigurationTemplates = S.Array(
  ReplicationConfigurationTemplate,
);
export class SourceServerConnectorAction extends S.Class<SourceServerConnectorAction>(
  "SourceServerConnectorAction",
)({
  credentialsSecretArn: S.optional(S.String),
  connectorArn: S.optional(S.String),
}) {}
export class DescribeSourceServersRequestFilters extends S.Class<DescribeSourceServersRequestFilters>(
  "DescribeSourceServersRequestFilters",
)({
  sourceServerIDs: S.optional(DescribeSourceServersRequestFiltersIDs),
  isArchived: S.optional(S.Boolean),
  replicationTypes: S.optional(ReplicationTypes),
  lifeCycleStates: S.optional(LifeCycleStates),
  applicationIDs: S.optional(DescribeSourceServersRequestApplicationIDs),
}) {}
export class ChangeServerLifeCycleStateSourceServerLifecycle extends S.Class<ChangeServerLifeCycleStateSourceServerLifecycle>(
  "ChangeServerLifeCycleStateSourceServerLifecycle",
)({ state: S.String }) {}
export class SourceServerActionsRequestFilters extends S.Class<SourceServerActionsRequestFilters>(
  "SourceServerActionsRequestFilters",
)({ actionIDs: S.optional(ActionIDs) }) {}
export class ReplicationConfigurationReplicatedDisk extends S.Class<ReplicationConfigurationReplicatedDisk>(
  "ReplicationConfigurationReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  isBootDisk: S.optional(S.Boolean),
  stagingDiskType: S.optional(S.String),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
}) {}
export const ReplicationConfigurationReplicatedDisks = S.Array(
  ReplicationConfigurationReplicatedDisk,
);
export class ListWavesRequestFilters extends S.Class<ListWavesRequestFilters>(
  "ListWavesRequestFilters",
)({ waveIDs: S.optional(WaveIDsFilter), isArchived: S.optional(S.Boolean) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
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
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    filters: S.optional(ListApplicationsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListApplications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConnectorRequest extends S.Class<CreateConnectorRequest>(
  "CreateConnectorRequest",
)(
  {
    name: S.String,
    ssmInstanceID: S.String,
    tags: S.optional(TagsMap),
    ssmCommandConfig: S.optional(ConnectorSsmCommandConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateConnector" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Connector extends S.Class<Connector>("Connector")({
  connectorID: S.optional(S.String),
  name: S.optional(S.String),
  ssmInstanceID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  ssmCommandConfig: S.optional(ConnectorSsmCommandConfig),
}) {}
export class ListConnectorsRequest extends S.Class<ListConnectorsRequest>(
  "ListConnectorsRequest",
)(
  {
    filters: S.optional(ListConnectorsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListConnectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExportsRequest extends S.Class<ListExportsRequest>(
  "ListExportsRequest",
)(
  {
    filters: S.optional(ListExportsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListExports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartImportRequest extends S.Class<StartImportRequest>(
  "StartImportRequest",
)(
  {
    clientToken: S.optional(S.String),
    s3BucketSource: S3BucketSource,
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartImport" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImportsRequest extends S.Class<ListImportsRequest>(
  "ListImportsRequest",
)(
  {
    filters: S.optional(ListImportsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImports" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobsRequest extends S.Class<DescribeJobsRequest>(
  "DescribeJobsRequest",
)(
  {
    filters: S.optional(DescribeJobsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    accountID: S.optional(S.String),
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
export class DescribeLaunchConfigurationTemplatesResponse extends S.Class<DescribeLaunchConfigurationTemplatesResponse>(
  "DescribeLaunchConfigurationTemplatesResponse",
)({
  items: S.optional(LaunchConfigurationTemplates),
  nextToken: S.optional(S.String),
}) {}
export class ListTemplateActionsRequest extends S.Class<ListTemplateActionsRequest>(
  "ListTemplateActionsRequest",
)(
  {
    launchConfigurationTemplateID: S.String,
    filters: S.optional(TemplateActionsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListTemplateActions" }),
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
export class UpdateSourceServerRequest extends S.Class<UpdateSourceServerRequest>(
  "UpdateSourceServerRequest",
)(
  {
    accountID: S.optional(S.String),
    sourceServerID: S.String,
    connectorAction: S.optional(SourceServerConnectorAction),
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateSourceServer" }),
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
    accountID: S.optional(S.String),
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
export class ChangeServerLifeCycleStateRequest extends S.Class<ChangeServerLifeCycleStateRequest>(
  "ChangeServerLifeCycleStateRequest",
)(
  {
    sourceServerID: S.String,
    lifeCycle: ChangeServerLifeCycleStateSourceServerLifecycle,
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ChangeServerLifeCycleState" }),
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
  bootMode: S.optional(S.String),
  postLaunchActions: S.optional(PostLaunchActions),
  enableMapAutoTagging: S.optional(S.Boolean),
  mapAutoTaggingMpeID: S.optional(S.String),
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
  useFipsEndpoint: S.optional(S.Boolean),
  internetProtocol: S.optional(S.String),
}) {}
export class ListSourceServerActionsRequest extends S.Class<ListSourceServerActionsRequest>(
  "ListSourceServerActionsRequest",
)(
  {
    sourceServerID: S.String,
    filters: S.optional(SourceServerActionsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListSourceServerActions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SourceServerActionDocument extends S.Class<SourceServerActionDocument>(
  "SourceServerActionDocument",
)({
  actionID: S.optional(S.String),
  actionName: S.optional(S.String),
  documentIdentifier: S.optional(S.String),
  order: S.optional(S.Number),
  documentVersion: S.optional(S.String),
  active: S.optional(S.Boolean),
  timeoutSeconds: S.optional(S.Number),
  mustSucceedForCutover: S.optional(S.Boolean),
  parameters: S.optional(SsmDocumentParameters),
  externalParameters: S.optional(SsmDocumentExternalParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
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
    useFipsEndpoint: S.optional(S.Boolean),
    accountID: S.optional(S.String),
    internetProtocol: S.optional(S.String),
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
export class JobPostLaunchActionsLaunchStatus extends S.Class<JobPostLaunchActionsLaunchStatus>(
  "JobPostLaunchActionsLaunchStatus",
)({
  ssmDocument: S.optional(SsmDocument),
  ssmDocumentType: S.optional(S.String),
  executionID: S.optional(S.String),
  executionStatus: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export const PostLaunchActionsLaunchStatusList = S.Array(
  JobPostLaunchActionsLaunchStatus,
);
export class PostLaunchActionsStatus extends S.Class<PostLaunchActionsStatus>(
  "PostLaunchActionsStatus",
)({
  ssmAgentDiscoveryDatetime: S.optional(S.String),
  postLaunchActionsLaunchStatusList: S.optional(
    PostLaunchActionsLaunchStatusList,
  ),
}) {}
export class ParticipatingServer extends S.Class<ParticipatingServer>(
  "ParticipatingServer",
)({
  sourceServerID: S.String,
  launchStatus: S.optional(S.String),
  launchedEc2InstanceID: S.optional(S.String),
  postLaunchActionsStatus: S.optional(PostLaunchActionsStatus),
}) {}
export const ParticipatingServers = S.Array(ParticipatingServer);
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
}) {}
export class StartTestResponse extends S.Class<StartTestResponse>(
  "StartTestResponse",
)({ job: S.optional(Job) }) {}
export class TerminateTargetInstancesResponse extends S.Class<TerminateTargetInstancesResponse>(
  "TerminateTargetInstancesResponse",
)({ job: S.optional(Job) }) {}
export class ListWavesRequest extends S.Class<ListWavesRequest>(
  "ListWavesRequest",
)(
  {
    filters: S.optional(ListWavesRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    accountID: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListWaves" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.optional(S.String), message: S.optional(S.String) }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ManagedAccount extends S.Class<ManagedAccount>("ManagedAccount")({
  accountId: S.optional(S.String),
}) {}
export const ManagedAccounts = S.Array(ManagedAccount);
export class ApplicationAggregatedStatus extends S.Class<ApplicationAggregatedStatus>(
  "ApplicationAggregatedStatus",
)({
  lastUpdateDateTime: S.optional(S.String),
  healthStatus: S.optional(S.String),
  progressStatus: S.optional(S.String),
  totalSourceServers: S.optional(S.Number),
}) {}
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  message: S.optional(S.String),
  code: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceType: S.optional(S.String),
}) {}
export const ConflictExceptionErrors = S.Array(ErrorDetails);
export class Application extends S.Class<Application>("Application")({
  applicationID: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  isArchived: S.optional(S.Boolean),
  applicationAggregatedStatus: S.optional(ApplicationAggregatedStatus),
  creationDateTime: S.optional(S.String),
  lastModifiedDateTime: S.optional(S.String),
  tags: S.optional(TagsMap),
  waveID: S.optional(S.String),
}) {}
export const ApplicationsList = S.Array(Application);
export const ConnectorsList = S.Array(Connector);
export class ExportTaskSummary extends S.Class<ExportTaskSummary>(
  "ExportTaskSummary",
)({
  serversCount: S.optional(S.Number),
  applicationsCount: S.optional(S.Number),
  wavesCount: S.optional(S.Number),
}) {}
export class ExportTask extends S.Class<ExportTask>("ExportTask")({
  exportID: S.optional(S.String),
  arn: S.optional(S.String),
  s3Bucket: S.optional(S.String),
  s3Key: S.optional(S.String),
  s3BucketOwner: S.optional(S.String),
  creationDateTime: S.optional(S.String),
  endDateTime: S.optional(S.String),
  status: S.optional(S.String),
  progressPercentage: S.optional(S.Number),
  summary: S.optional(ExportTaskSummary),
  tags: S.optional(TagsMap),
}) {}
export const ExportsList = S.Array(ExportTask);
export class ImportTaskSummaryWaves extends S.Class<ImportTaskSummaryWaves>(
  "ImportTaskSummaryWaves",
)({
  createdCount: S.optional(S.Number),
  modifiedCount: S.optional(S.Number),
}) {}
export class ImportTaskSummaryApplications extends S.Class<ImportTaskSummaryApplications>(
  "ImportTaskSummaryApplications",
)({
  createdCount: S.optional(S.Number),
  modifiedCount: S.optional(S.Number),
}) {}
export class ImportTaskSummaryServers extends S.Class<ImportTaskSummaryServers>(
  "ImportTaskSummaryServers",
)({
  createdCount: S.optional(S.Number),
  modifiedCount: S.optional(S.Number),
}) {}
export class ImportTaskSummary extends S.Class<ImportTaskSummary>(
  "ImportTaskSummary",
)({
  waves: S.optional(ImportTaskSummaryWaves),
  applications: S.optional(ImportTaskSummaryApplications),
  servers: S.optional(ImportTaskSummaryServers),
}) {}
export class ImportTask extends S.Class<ImportTask>("ImportTask")({
  importID: S.optional(S.String),
  arn: S.optional(S.String),
  s3BucketSource: S.optional(S3BucketSource),
  creationDateTime: S.optional(S.String),
  endDateTime: S.optional(S.String),
  status: S.optional(S.String),
  progressPercentage: S.optional(S.Number),
  summary: S.optional(ImportTaskSummary),
  tags: S.optional(TagsMap),
}) {}
export const ImportList = S.Array(ImportTask);
export const JobsList = S.Array(Job);
export class LaunchedInstance extends S.Class<LaunchedInstance>(
  "LaunchedInstance",
)({
  ec2InstanceID: S.optional(S.String),
  jobID: S.optional(S.String),
  firstBoot: S.optional(S.String),
}) {}
export class DataReplicationInfoReplicatedDisk extends S.Class<DataReplicationInfoReplicatedDisk>(
  "DataReplicationInfoReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  totalStorageBytes: S.optional(S.Number),
  replicatedStorageBytes: S.optional(S.Number),
  rescannedStorageBytes: S.optional(S.Number),
  backloggedStorageBytes: S.optional(S.Number),
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
  lastSnapshotDateTime: S.optional(S.String),
  replicatorId: S.optional(S.String),
}) {}
export class LifeCycleLastTestInitiated extends S.Class<LifeCycleLastTestInitiated>(
  "LifeCycleLastTestInitiated",
)({ apiCallDateTime: S.optional(S.String), jobID: S.optional(S.String) }) {}
export class LifeCycleLastTestReverted extends S.Class<LifeCycleLastTestReverted>(
  "LifeCycleLastTestReverted",
)({ apiCallDateTime: S.optional(S.String) }) {}
export class LifeCycleLastTestFinalized extends S.Class<LifeCycleLastTestFinalized>(
  "LifeCycleLastTestFinalized",
)({ apiCallDateTime: S.optional(S.String) }) {}
export class LifeCycleLastTest extends S.Class<LifeCycleLastTest>(
  "LifeCycleLastTest",
)({
  initiated: S.optional(LifeCycleLastTestInitiated),
  reverted: S.optional(LifeCycleLastTestReverted),
  finalized: S.optional(LifeCycleLastTestFinalized),
}) {}
export class LifeCycleLastCutoverInitiated extends S.Class<LifeCycleLastCutoverInitiated>(
  "LifeCycleLastCutoverInitiated",
)({ apiCallDateTime: S.optional(S.String), jobID: S.optional(S.String) }) {}
export class LifeCycleLastCutoverReverted extends S.Class<LifeCycleLastCutoverReverted>(
  "LifeCycleLastCutoverReverted",
)({ apiCallDateTime: S.optional(S.String) }) {}
export class LifeCycleLastCutoverFinalized extends S.Class<LifeCycleLastCutoverFinalized>(
  "LifeCycleLastCutoverFinalized",
)({ apiCallDateTime: S.optional(S.String) }) {}
export class LifeCycleLastCutover extends S.Class<LifeCycleLastCutover>(
  "LifeCycleLastCutover",
)({
  initiated: S.optional(LifeCycleLastCutoverInitiated),
  reverted: S.optional(LifeCycleLastCutoverReverted),
  finalized: S.optional(LifeCycleLastCutoverFinalized),
}) {}
export class LifeCycle extends S.Class<LifeCycle>("LifeCycle")({
  addedToServiceDateTime: S.optional(S.String),
  firstByteDateTime: S.optional(S.String),
  elapsedReplicationDuration: S.optional(S.String),
  lastSeenByServiceDateTime: S.optional(S.String),
  lastTest: S.optional(LifeCycleLastTest),
  lastCutover: S.optional(LifeCycleLastCutover),
  state: S.optional(S.String),
}) {}
export class IdentificationHints extends S.Class<IdentificationHints>(
  "IdentificationHints",
)({
  fqdn: S.optional(S.String),
  hostname: S.optional(S.String),
  vmWareUuid: S.optional(S.String),
  awsInstanceID: S.optional(S.String),
  vmPath: S.optional(S.String),
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
}) {}
export class SourceServer extends S.Class<SourceServer>("SourceServer")({
  sourceServerID: S.optional(S.String),
  arn: S.optional(S.String),
  isArchived: S.optional(S.Boolean),
  tags: S.optional(TagsMap),
  launchedInstance: S.optional(LaunchedInstance),
  dataReplicationInfo: S.optional(DataReplicationInfo),
  lifeCycle: S.optional(LifeCycle),
  sourceProperties: S.optional(SourceProperties),
  replicationType: S.optional(S.String),
  vcenterClientID: S.optional(S.String),
  applicationID: S.optional(S.String),
  userProvidedID: S.optional(S.String),
  fqdnForActionFramework: S.optional(S.String),
  connectorAction: S.optional(SourceServerConnectorAction),
}) {}
export const SourceServersList = S.Array(SourceServer);
export const SourceServerActionDocuments = S.Array(SourceServerActionDocument);
export class VcenterClient extends S.Class<VcenterClient>("VcenterClient")({
  vcenterClientID: S.optional(S.String),
  arn: S.optional(S.String),
  hostname: S.optional(S.String),
  vcenterUUID: S.optional(S.String),
  datacenterName: S.optional(S.String),
  lastSeenDatetime: S.optional(S.String),
  sourceServerTags: S.optional(TagsMap),
  tags: S.optional(TagsMap),
}) {}
export const VcenterClientList = S.Array(VcenterClient);
export class WaveAggregatedStatus extends S.Class<WaveAggregatedStatus>(
  "WaveAggregatedStatus",
)({
  lastUpdateDateTime: S.optional(S.String),
  replicationStartedDateTime: S.optional(S.String),
  healthStatus: S.optional(S.String),
  progressStatus: S.optional(S.String),
  totalApplications: S.optional(S.Number),
}) {}
export class Wave extends S.Class<Wave>("Wave")({
  waveID: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  isArchived: S.optional(S.Boolean),
  waveAggregatedStatus: S.optional(WaveAggregatedStatus),
  creationDateTime: S.optional(S.String),
  lastModifiedDateTime: S.optional(S.String),
  tags: S.optional(TagsMap),
}) {}
export const WavesList = S.Array(Wave);
export class ListManagedAccountsResponse extends S.Class<ListManagedAccountsResponse>(
  "ListManagedAccountsResponse",
)({ items: ManagedAccounts, nextToken: S.optional(S.String) }) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({ items: S.optional(ApplicationsList), nextToken: S.optional(S.String) }) {}
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({ items: S.optional(ConnectorsList), nextToken: S.optional(S.String) }) {}
export class ListExportsResponse extends S.Class<ListExportsResponse>(
  "ListExportsResponse",
)({ items: S.optional(ExportsList), nextToken: S.optional(S.String) }) {}
export class ListImportsResponse extends S.Class<ListImportsResponse>(
  "ListImportsResponse",
)({ items: S.optional(ImportList), nextToken: S.optional(S.String) }) {}
export class DescribeJobsResponse extends S.Class<DescribeJobsResponse>(
  "DescribeJobsResponse",
)({ items: S.optional(JobsList), nextToken: S.optional(S.String) }) {}
export class CreateLaunchConfigurationTemplateRequest extends S.Class<CreateLaunchConfigurationTemplateRequest>(
  "CreateLaunchConfigurationTemplateRequest",
)(
  {
    postLaunchActions: S.optional(PostLaunchActions),
    enableMapAutoTagging: S.optional(S.Boolean),
    mapAutoTaggingMpeID: S.optional(S.String),
    tags: S.optional(TagsMap),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    associatePublicIpAddress: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    bootMode: S.optional(S.String),
    smallVolumeMaxSize: S.optional(S.Number),
    smallVolumeConf: S.optional(LaunchTemplateDiskConf),
    largeVolumeConf: S.optional(LaunchTemplateDiskConf),
    enableParametersEncryption: S.optional(S.Boolean),
    parametersEncryptionKey: S.optional(S.String),
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
export class PutTemplateActionRequest extends S.Class<PutTemplateActionRequest>(
  "PutTemplateActionRequest",
)(
  {
    launchConfigurationTemplateID: S.String,
    actionName: S.String,
    documentIdentifier: S.String,
    order: S.Number,
    actionID: S.String,
    documentVersion: S.optional(S.String),
    active: S.optional(S.Boolean),
    timeoutSeconds: S.optional(S.Number),
    mustSucceedForCutover: S.optional(S.Boolean),
    parameters: S.optional(SsmDocumentParameters),
    operatingSystem: S.optional(S.String),
    externalParameters: S.optional(SsmDocumentExternalParameters),
    description: S.optional(S.String),
    category: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutTemplateAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSourceServersResponse extends S.Class<DescribeSourceServersResponse>(
  "DescribeSourceServersResponse",
)({ items: S.optional(SourceServersList), nextToken: S.optional(S.String) }) {}
export class ListSourceServerActionsResponse extends S.Class<ListSourceServerActionsResponse>(
  "ListSourceServerActionsResponse",
)({
  items: S.optional(SourceServerActionDocuments),
  nextToken: S.optional(S.String),
}) {}
export class DescribeVcenterClientsResponse extends S.Class<DescribeVcenterClientsResponse>(
  "DescribeVcenterClientsResponse",
)({ items: S.optional(VcenterClientList), nextToken: S.optional(S.String) }) {}
export class ListWavesResponse extends S.Class<ListWavesResponse>(
  "ListWavesResponse",
)({ items: S.optional(WavesList), nextToken: S.optional(S.String) }) {}
export class ExportErrorData extends S.Class<ExportErrorData>(
  "ExportErrorData",
)({ rawError: S.optional(S.String) }) {}
export class ImportErrorData extends S.Class<ImportErrorData>(
  "ImportErrorData",
)({
  sourceServerID: S.optional(S.String),
  applicationID: S.optional(S.String),
  waveID: S.optional(S.String),
  ec2LaunchTemplateID: S.optional(S.String),
  rowNumber: S.optional(S.Number),
  rawError: S.optional(S.String),
  accountID: S.optional(S.String),
}) {}
export class JobLogEventData extends S.Class<JobLogEventData>(
  "JobLogEventData",
)({
  sourceServerID: S.optional(S.String),
  conversionServerID: S.optional(S.String),
  targetInstanceID: S.optional(S.String),
  rawError: S.optional(S.String),
  attemptCount: S.optional(S.Number),
  maxAttemptsCount: S.optional(S.Number),
}) {}
export class ExportTaskError extends S.Class<ExportTaskError>(
  "ExportTaskError",
)({
  errorDateTime: S.optional(S.String),
  errorData: S.optional(ExportErrorData),
}) {}
export const ExportErrors = S.Array(ExportTaskError);
export class ImportTaskError extends S.Class<ImportTaskError>(
  "ImportTaskError",
)({
  errorDateTime: S.optional(S.String),
  errorType: S.optional(S.String),
  errorData: S.optional(ImportErrorData),
}) {}
export const ImportErrors = S.Array(ImportTaskError);
export class JobLog extends S.Class<JobLog>("JobLog")({
  logDateTime: S.optional(S.String),
  event: S.optional(S.String),
  eventData: S.optional(JobLogEventData),
}) {}
export const JobLogs = S.Array(JobLog);
export class TemplateActionDocument extends S.Class<TemplateActionDocument>(
  "TemplateActionDocument",
)({
  actionID: S.optional(S.String),
  actionName: S.optional(S.String),
  documentIdentifier: S.optional(S.String),
  order: S.optional(S.Number),
  documentVersion: S.optional(S.String),
  active: S.optional(S.Boolean),
  timeoutSeconds: S.optional(S.Number),
  mustSucceedForCutover: S.optional(S.Boolean),
  parameters: S.optional(SsmDocumentParameters),
  operatingSystem: S.optional(S.String),
  externalParameters: S.optional(SsmDocumentExternalParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export const TemplateActionDocuments = S.Array(TemplateActionDocument);
export class StartExportResponse extends S.Class<StartExportResponse>(
  "StartExportResponse",
)({ exportTask: S.optional(ExportTask) }) {}
export class ListExportErrorsResponse extends S.Class<ListExportErrorsResponse>(
  "ListExportErrorsResponse",
)({ items: S.optional(ExportErrors), nextToken: S.optional(S.String) }) {}
export class ListImportErrorsResponse extends S.Class<ListImportErrorsResponse>(
  "ListImportErrorsResponse",
)({ items: S.optional(ImportErrors), nextToken: S.optional(S.String) }) {}
export class DescribeJobLogItemsResponse extends S.Class<DescribeJobLogItemsResponse>(
  "DescribeJobLogItemsResponse",
)({ items: S.optional(JobLogs), nextToken: S.optional(S.String) }) {}
export class ListTemplateActionsResponse extends S.Class<ListTemplateActionsResponse>(
  "ListTemplateActionsResponse",
)({
  items: S.optional(TemplateActionDocuments),
  nextToken: S.optional(S.String),
}) {}
export class StartImportResponse extends S.Class<StartImportResponse>(
  "StartImportResponse",
)({ importTask: S.optional(ImportTask) }) {}
export class StartCutoverResponse extends S.Class<StartCutoverResponse>(
  "StartCutoverResponse",
)({ job: S.optional(Job) }) {}

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
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    errors: S.optional(ConflictExceptionErrors),
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
    quotaValue: S.optional(S.Number),
  },
) {}
export class UninitializedAccountException extends S.TaggedError<UninitializedAccountException>()(
  "UninitializedAccountException",
  { message: S.optional(S.String), code: S.optional(S.String) },
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

//# Operations
/**
 * Initialize Application Migration Service.
 */
export const initializeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceRequest,
  output: InitializeServiceResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Create Connector.
 */
export const createConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorRequest,
  output: Connector,
  errors: [UninitializedAccountException, ValidationException],
}));
/**
 * List Connectors.
 */
export const listConnectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectorsRequest,
    output: ListConnectorsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List exports.
 */
export const listExports = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExportsRequest,
    output: ListExportsResponse,
    errors: [UninitializedAccountException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List imports.
 */
export const listImports = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportsRequest,
    output: ListImportsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of Jobs. Use the JobsID and fromDate and toData filters to limit which jobs are returned. The response is sorted by creationDataTime - latest date first. Jobs are normally created by the StartTest, StartCutover, and TerminateTargetInstances APIs. Jobs are also created by DiagnosticLaunch and TerminateDiagnosticInstances, which are APIs available only to *Support* and only used in response to relevant support tickets.
 */
export const describeJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeJobsRequest,
    output: DescribeJobsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a new Launch Configuration Template.
 */
export const createLaunchConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLaunchConfigurationTemplateRequest,
    output: LaunchConfigurationTemplate,
    errors: [
      AccessDeniedException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Put template post migration custom action.
 */
export const putTemplateAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTemplateActionRequest,
  output: TemplateActionDocument,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Retrieves all SourceServers or multiple SourceServers by ID.
 */
export const describeSourceServers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeSourceServersRequest,
    output: DescribeSourceServersResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List source server post migration custom actions.
 */
export const listSourceServerActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSourceServerActionsRequest,
    output: ListSourceServerActionsResponse,
    errors: [ResourceNotFoundException, UninitializedAccountException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of the installed vCenter clients.
 */
export const describeVcenterClients =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeVcenterClientsRequest,
    output: DescribeVcenterClientsResponse,
    errors: [
      ResourceNotFoundException,
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
 * Create wave.
 */
export const createWave = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWaveRequest,
  output: Wave,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
  ],
}));
/**
 * Retrieves all waves or multiple waves by ID.
 */
export const listWaves = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWavesRequest,
  output: ListWavesResponse,
  errors: [UninitializedAccountException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List all tags for your Application Migration Service resources.
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
 * Archive application.
 */
export const archiveApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ArchiveApplicationRequest,
  output: Application,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
  ],
}));
/**
 * Associate source servers to application.
 */
export const associateSourceServers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSourceServersRequest,
    output: AssociateSourceServersResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Disassociate source servers from application.
 */
export const disassociateSourceServers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateSourceServersRequest,
    output: DisassociateSourceServersResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Update application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: Application,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Job by ID.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
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
      ResourceNotFoundException,
      UninitializedAccountException,
    ],
  }));
/**
 * Deletes a single Replication Configuration Template by ID
 */
export const deleteReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteReplicationConfigurationTemplateRequest,
    output: DeleteReplicationConfigurationTemplateResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
    ],
  }));
/**
 * Deletes a single source server by ID.
 */
export const deleteSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceServerRequest,
  output: DeleteSourceServerResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Finalizes the cutover immediately for specific Source Servers. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. The AWS Replication Agent will receive a command to uninstall itself (within 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be changed to DISCONNECTED; The SourceServer.lifeCycle.state will be changed to CUTOVER; The totalStorageBytes property fo each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const finalizeCutover = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FinalizeCutoverRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Archives specific Source Servers by setting the SourceServer.isArchived property to true for specified SourceServers by ID. This command only works for SourceServers with a lifecycle. state which equals DISCONNECTED or CUTOVER.
 */
export const markAsArchived = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MarkAsArchivedRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Pause Replication.
 */
export const pauseReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseReplicationRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Resume Replication.
 */
export const resumeReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeReplicationRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Start replication for source server irrespective of its replication type.
 */
export const startReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplicationRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Stop Replication.
 */
export const stopReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Updates multiple LaunchConfigurations by Source Server ID.
 *
 * bootMode valid values are `LEGACY_BIOS | UEFI`
 */
export const updateLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLaunchConfigurationRequest,
    output: LaunchConfiguration,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Allows you to change between the AGENT_BASED replication type and the SNAPSHOT_SHIPPING replication type.
 *
 * SNAPSHOT_SHIPPING should be used for agentless replication.
 */
export const updateSourceServerReplicationType =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSourceServerReplicationTypeRequest,
    output: SourceServer,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Delete wave.
 */
export const deleteWave = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWaveRequest,
  output: DeleteWaveResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Archive wave.
 */
export const archiveWave = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ArchiveWaveRequest,
  output: Wave,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
  ],
}));
/**
 * Associate applications to wave.
 */
export const associateApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateApplicationsRequest,
    output: AssociateApplicationsResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Disassociate applications from wave.
 */
export const disassociateApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateApplicationsRequest,
    output: DisassociateApplicationsResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Update wave.
 */
export const updateWave = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWaveRequest,
  output: Wave,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Update Source Server.
 */
export const updateSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSourceServerRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Allows the user to set the SourceServer.LifeCycle.state property for specific Source Server IDs to one of the following: READY_FOR_TEST or READY_FOR_CUTOVER. This command only works if the Source Server is already launchable (dataReplicationInfo.lagDuration is not null.)
 */
export const changeServerLifeCycleState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ChangeServerLifeCycleStateRequest,
    output: SourceServer,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Put source server post migration custom action.
 */
export const putSourceServerAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutSourceServerActionRequest,
    output: SourceServerActionDocument,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Allows you to update multiple ReplicationConfigurations by Source Server ID.
 */
export const updateReplicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateReplicationConfigurationRequest,
    output: ReplicationConfiguration,
    errors: [
      AccessDeniedException,
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Launches a Test Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartTest and changes the SourceServer.lifeCycle.state property to TESTING.
 */
export const startTest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTestRequest,
  output: StartTestResponse,
  errors: [
    ConflictException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Starts a job that terminates specific launched EC2 Test and Cutover instances. This command will not work for any Source Server with a lifecycle.state of TESTING, CUTTING_OVER, or CUTOVER.
 */
export const terminateTargetInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateTargetInstancesRequest,
    output: TerminateTargetInstancesResponse,
    errors: [
      ConflictException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Create application.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: Application,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
  ],
}));
/**
 * Unarchive wave.
 */
export const unarchiveWave = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnarchiveWaveRequest,
  output: Wave,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
  ],
}));
/**
 * Update Connector.
 */
export const updateConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorRequest,
  output: Connector,
  errors: [
    ResourceNotFoundException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Launch Configuration Template by ID.
 */
export const updateLaunchConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLaunchConfigurationTemplateRequest,
    output: LaunchConfigurationTemplate,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UninitializedAccountException,
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
      ResourceNotFoundException,
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
 * Creates a new ReplicationConfigurationTemplate.
 */
export const createReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateReplicationConfigurationTemplateRequest,
    output: ReplicationConfigurationTemplate,
    errors: [
      AccessDeniedException,
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
      ResourceNotFoundException,
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
 * Lists all LaunchConfigurations available, filtered by Source Server IDs.
 */
export const getLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLaunchConfigurationRequest,
    output: LaunchConfiguration,
    errors: [ResourceNotFoundException, UninitializedAccountException],
  }),
);
/**
 * Lists all ReplicationConfigurations, filtered by Source Server ID.
 */
export const getReplicationConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetReplicationConfigurationRequest,
    output: ReplicationConfiguration,
    errors: [ResourceNotFoundException, UninitializedAccountException],
  }),
);
/**
 * Delete Connector.
 */
export const deleteConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
  errors: [
    ResourceNotFoundException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Remove template post migration custom action.
 */
export const removeTemplateAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTemplateActionRequest,
    output: RemoveTemplateActionResponse,
    errors: [
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Updates multiple ReplicationConfigurationTemplates by ID.
 */
export const updateReplicationConfigurationTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateReplicationConfigurationTemplateRequest,
    output: ReplicationConfigurationTemplate,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }));
/**
 * Remove source server post migration custom action.
 */
export const removeSourceServerAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveSourceServerActionRequest,
    output: RemoveSourceServerActionResponse,
    errors: [
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Causes the data replication initiation sequence to begin immediately upon next Handshake for specified SourceServer IDs, regardless of when the previous initiation started. This command will not work if the SourceServer is not stalled or is in a DISCONNECTED or STOPPED state.
 */
export const retryDataReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetryDataReplicationRequest,
    output: SourceServer,
    errors: [
      ResourceNotFoundException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a given vCenter client by ID.
 */
export const deleteVcenterClient = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVcenterClientRequest,
  output: DeleteVcenterClientResponse,
  errors: [
    ResourceNotFoundException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * List Managed Accounts.
 */
export const listManagedAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListManagedAccountsRequest,
    output: ListManagedAccountsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Delete application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UninitializedAccountException,
  ],
}));
/**
 * Retrieves all applications or multiple applications by ID.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: ListApplicationsResponse,
    errors: [UninitializedAccountException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Unarchive application.
 */
export const unarchiveApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UnarchiveApplicationRequest,
    output: Application,
    errors: [
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Adds or overwrites only the specified tags for the specified Application Migration Service resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
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
 * Deletes the specified set of tags from the specified set of Application Migration Service resources.
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
 * Start export.
 */
export const startExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExportRequest,
  output: StartExportResponse,
  errors: [
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * List export errors.
 */
export const listExportErrors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExportErrorsRequest,
    output: ListExportErrorsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List import errors.
 */
export const listImportErrors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportErrorsRequest,
    output: ListImportErrorsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Retrieves detailed job log items with paging.
 */
export const describeJobLogItems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeJobLogItemsRequest,
    output: DescribeJobLogItemsResponse,
    errors: [UninitializedAccountException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List template post migration custom actions.
 */
export const listTemplateActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTemplateActionsRequest,
    output: ListTemplateActionsResponse,
    errors: [ResourceNotFoundException, UninitializedAccountException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Disconnects specific Source Servers from Application Migration Service. Data replication is stopped immediately. All AWS resources created by Application Migration Service for enabling the replication of these source servers will be terminated / deleted within 90 minutes. Launched Test or Cutover instances will NOT be terminated. If the agent on the source server has not been prevented from communicating with the Application Migration Service service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const disconnectFromService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisconnectFromServiceRequest,
    output: SourceServer,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      UninitializedAccountException,
    ],
  }),
);
/**
 * Start import.
 */
export const startImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Launches a Cutover Instance for specific Source Servers. This command starts a LAUNCH job whose initiatedBy property is StartCutover and changes the SourceServer.lifeCycle.state property to CUTTING_OVER.
 */
export const startCutover = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCutoverRequest,
  output: StartCutoverResponse,
  errors: [
    ConflictException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
