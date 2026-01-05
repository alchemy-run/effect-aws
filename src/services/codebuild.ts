import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CodeBuild",
  serviceShapeName: "CodeBuild_20161006",
});
const auth = T.AwsAuthSigv4({ name: "codebuild" });
const ver = T.ServiceVersion("2016-10-06");
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
                        url: "https://codebuild-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codebuild-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codebuild.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codebuild.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListCuratedEnvironmentImagesInput extends S.Class<ListCuratedEnvironmentImagesInput>(
  "ListCuratedEnvironmentImagesInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSourceCredentialsInput extends S.Class<ListSourceCredentialsInput>(
  "ListSourceCredentialsInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const BuildIds = S.Array(S.String);
export const BuildBatchIds = S.Array(S.String);
export const CommandExecutionIds = S.Array(S.String);
export const FleetNames = S.Array(S.String);
export const ProjectNames = S.Array(S.String);
export const ReportGroupArns = S.Array(S.String);
export const ReportArns = S.Array(S.String);
export const SandboxIds = S.Array(S.String);
export class GitSubmodulesConfig extends S.Class<GitSubmodulesConfig>(
  "GitSubmodulesConfig",
)({ fetchSubmodules: S.Boolean }) {}
export class SourceAuth extends S.Class<SourceAuth>("SourceAuth")({
  type: S.String,
  resource: S.optional(S.String),
}) {}
export class BuildStatusConfig extends S.Class<BuildStatusConfig>(
  "BuildStatusConfig",
)({ context: S.optional(S.String), targetUrl: S.optional(S.String) }) {}
export class ProjectSource extends S.Class<ProjectSource>("ProjectSource")({
  type: S.String,
  location: S.optional(S.String),
  gitCloneDepth: S.optional(S.Number),
  gitSubmodulesConfig: S.optional(GitSubmodulesConfig),
  buildspec: S.optional(S.String),
  auth: S.optional(SourceAuth),
  reportBuildStatus: S.optional(S.Boolean),
  buildStatusConfig: S.optional(BuildStatusConfig),
  insecureSsl: S.optional(S.Boolean),
  sourceIdentifier: S.optional(S.String),
}) {}
export const ProjectSources = S.Array(ProjectSource);
export class ProjectArtifacts extends S.Class<ProjectArtifacts>(
  "ProjectArtifacts",
)({
  type: S.String,
  location: S.optional(S.String),
  path: S.optional(S.String),
  namespaceType: S.optional(S.String),
  name: S.optional(S.String),
  packaging: S.optional(S.String),
  overrideArtifactName: S.optional(S.Boolean),
  encryptionDisabled: S.optional(S.Boolean),
  artifactIdentifier: S.optional(S.String),
  bucketOwnerAccess: S.optional(S.String),
}) {}
export const ProjectArtifactsList = S.Array(ProjectArtifacts);
export class BatchDeleteBuildsInput extends S.Class<BatchDeleteBuildsInput>(
  "BatchDeleteBuildsInput",
)(
  { ids: BuildIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetBuildBatchesInput extends S.Class<BatchGetBuildBatchesInput>(
  "BatchGetBuildBatchesInput",
)(
  { ids: BuildBatchIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetBuildsInput extends S.Class<BatchGetBuildsInput>(
  "BatchGetBuildsInput",
)(
  { ids: BuildIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetCommandExecutionsInput extends S.Class<BatchGetCommandExecutionsInput>(
  "BatchGetCommandExecutionsInput",
)(
  { sandboxId: S.String, commandExecutionIds: CommandExecutionIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetFleetsInput extends S.Class<BatchGetFleetsInput>(
  "BatchGetFleetsInput",
)(
  { names: FleetNames },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetProjectsInput extends S.Class<BatchGetProjectsInput>(
  "BatchGetProjectsInput",
)(
  { names: ProjectNames },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetReportGroupsInput extends S.Class<BatchGetReportGroupsInput>(
  "BatchGetReportGroupsInput",
)(
  { reportGroupArns: ReportGroupArns },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetReportsInput extends S.Class<BatchGetReportsInput>(
  "BatchGetReportsInput",
)(
  { reportArns: ReportArns },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetSandboxesInput extends S.Class<BatchGetSandboxesInput>(
  "BatchGetSandboxesInput",
)(
  { ids: SandboxIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBuildBatchInput extends S.Class<DeleteBuildBatchInput>(
  "DeleteBuildBatchInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFleetInput extends S.Class<DeleteFleetInput>(
  "DeleteFleetInput",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFleetOutput extends S.Class<DeleteFleetOutput>(
  "DeleteFleetOutput",
)({}) {}
export class DeleteProjectInput extends S.Class<DeleteProjectInput>(
  "DeleteProjectInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectOutput extends S.Class<DeleteProjectOutput>(
  "DeleteProjectOutput",
)({}) {}
export class DeleteReportInput extends S.Class<DeleteReportInput>(
  "DeleteReportInput",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReportOutput extends S.Class<DeleteReportOutput>(
  "DeleteReportOutput",
)({}) {}
export class DeleteReportGroupInput extends S.Class<DeleteReportGroupInput>(
  "DeleteReportGroupInput",
)(
  { arn: S.String, deleteReports: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReportGroupOutput extends S.Class<DeleteReportGroupOutput>(
  "DeleteReportGroupOutput",
)({}) {}
export class DeleteResourcePolicyInput extends S.Class<DeleteResourcePolicyInput>(
  "DeleteResourcePolicyInput",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyOutput extends S.Class<DeleteResourcePolicyOutput>(
  "DeleteResourcePolicyOutput",
)({}) {}
export class DeleteSourceCredentialsInput extends S.Class<DeleteSourceCredentialsInput>(
  "DeleteSourceCredentialsInput",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWebhookInput extends S.Class<DeleteWebhookInput>(
  "DeleteWebhookInput",
)(
  { projectName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWebhookOutput extends S.Class<DeleteWebhookOutput>(
  "DeleteWebhookOutput",
)({}) {}
export class DescribeCodeCoveragesInput extends S.Class<DescribeCodeCoveragesInput>(
  "DescribeCodeCoveragesInput",
)(
  {
    reportArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    minLineCoveragePercentage: S.optional(S.Number),
    maxLineCoveragePercentage: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReportGroupTrendInput extends S.Class<GetReportGroupTrendInput>(
  "GetReportGroupTrendInput",
)(
  {
    reportGroupArn: S.String,
    numOfReports: S.optional(S.Number),
    trendField: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyInput extends S.Class<GetResourcePolicyInput>(
  "GetResourcePolicyInput",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportSourceCredentialsInput extends S.Class<ImportSourceCredentialsInput>(
  "ImportSourceCredentialsInput",
)(
  {
    username: S.optional(S.String),
    token: S.String,
    serverType: S.String,
    authType: S.String,
    shouldOverwrite: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InvalidateProjectCacheInput extends S.Class<InvalidateProjectCacheInput>(
  "InvalidateProjectCacheInput",
)(
  { projectName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InvalidateProjectCacheOutput extends S.Class<InvalidateProjectCacheOutput>(
  "InvalidateProjectCacheOutput",
)({}) {}
export class BuildBatchFilter extends S.Class<BuildBatchFilter>(
  "BuildBatchFilter",
)({ status: S.optional(S.String) }) {}
export class ListBuildBatchesForProjectInput extends S.Class<ListBuildBatchesForProjectInput>(
  "ListBuildBatchesForProjectInput",
)(
  {
    projectName: S.optional(S.String),
    filter: S.optional(BuildBatchFilter),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBuildsInput extends S.Class<ListBuildsInput>(
  "ListBuildsInput",
)(
  { sortOrder: S.optional(S.String), nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBuildsForProjectInput extends S.Class<ListBuildsForProjectInput>(
  "ListBuildsForProjectInput",
)(
  {
    projectName: S.String,
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCommandExecutionsForSandboxInput extends S.Class<ListCommandExecutionsForSandboxInput>(
  "ListCommandExecutionsForSandboxInput",
)(
  {
    sandboxId: S.String,
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFleetsInput extends S.Class<ListFleetsInput>(
  "ListFleetsInput",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProjectsInput extends S.Class<ListProjectsInput>(
  "ListProjectsInput",
)(
  {
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReportGroupsInput extends S.Class<ListReportGroupsInput>(
  "ListReportGroupsInput",
)(
  {
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReportFilter extends S.Class<ReportFilter>("ReportFilter")({
  status: S.optional(S.String),
}) {}
export class ListReportsForReportGroupInput extends S.Class<ListReportsForReportGroupInput>(
  "ListReportsForReportGroupInput",
)(
  {
    reportGroupArn: S.String,
    nextToken: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(ReportFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSandboxesInput extends S.Class<ListSandboxesInput>(
  "ListSandboxesInput",
)(
  {
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSandboxesForProjectInput extends S.Class<ListSandboxesForProjectInput>(
  "ListSandboxesForProjectInput",
)(
  {
    projectName: S.String,
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSharedProjectsInput extends S.Class<ListSharedProjectsInput>(
  "ListSharedProjectsInput",
)(
  {
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSharedReportGroupsInput extends S.Class<ListSharedReportGroupsInput>(
  "ListSharedReportGroupsInput",
)(
  {
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyInput extends S.Class<PutResourcePolicyInput>(
  "PutResourcePolicyInput",
)(
  { policy: S.String, resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetryBuildInput extends S.Class<RetryBuildInput>(
  "RetryBuildInput",
)(
  { id: S.optional(S.String), idempotencyToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetryBuildBatchInput extends S.Class<RetryBuildBatchInput>(
  "RetryBuildBatchInput",
)(
  {
    id: S.optional(S.String),
    idempotencyToken: S.optional(S.String),
    retryType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProjectSourceVersion extends S.Class<ProjectSourceVersion>(
  "ProjectSourceVersion",
)({ sourceIdentifier: S.String, sourceVersion: S.String }) {}
export const ProjectSecondarySourceVersions = S.Array(ProjectSourceVersion);
export class EnvironmentVariable extends S.Class<EnvironmentVariable>(
  "EnvironmentVariable",
)({ name: S.String, value: S.String, type: S.optional(S.String) }) {}
export const EnvironmentVariables = S.Array(EnvironmentVariable);
export const ProjectCacheModes = S.Array(S.String);
export class ProjectCache extends S.Class<ProjectCache>("ProjectCache")({
  type: S.String,
  location: S.optional(S.String),
  modes: S.optional(ProjectCacheModes),
  cacheNamespace: S.optional(S.String),
}) {}
export class CloudWatchLogsConfig extends S.Class<CloudWatchLogsConfig>(
  "CloudWatchLogsConfig",
)({
  status: S.String,
  groupName: S.optional(S.String),
  streamName: S.optional(S.String),
}) {}
export class S3LogsConfig extends S.Class<S3LogsConfig>("S3LogsConfig")({
  status: S.String,
  location: S.optional(S.String),
  encryptionDisabled: S.optional(S.Boolean),
  bucketOwnerAccess: S.optional(S.String),
}) {}
export class LogsConfig extends S.Class<LogsConfig>("LogsConfig")({
  cloudWatchLogs: S.optional(CloudWatchLogsConfig),
  s3Logs: S.optional(S3LogsConfig),
}) {}
export class RegistryCredential extends S.Class<RegistryCredential>(
  "RegistryCredential",
)({ credential: S.String, credentialProvider: S.String }) {}
export const ComputeTypesAllowed = S.Array(S.String);
export const FleetsAllowed = S.Array(S.String);
export class BatchRestrictions extends S.Class<BatchRestrictions>(
  "BatchRestrictions",
)({
  maximumBuildsAllowed: S.optional(S.Number),
  computeTypesAllowed: S.optional(ComputeTypesAllowed),
  fleetsAllowed: S.optional(FleetsAllowed),
}) {}
export class ProjectBuildBatchConfig extends S.Class<ProjectBuildBatchConfig>(
  "ProjectBuildBatchConfig",
)({
  serviceRole: S.optional(S.String),
  combineArtifacts: S.optional(S.Boolean),
  restrictions: S.optional(BatchRestrictions),
  timeoutInMins: S.optional(S.Number),
  batchReportMode: S.optional(S.String),
}) {}
export class StartBuildBatchInput extends S.Class<StartBuildBatchInput>(
  "StartBuildBatchInput",
)(
  {
    projectName: S.String,
    secondarySourcesOverride: S.optional(ProjectSources),
    secondarySourcesVersionOverride: S.optional(ProjectSecondarySourceVersions),
    sourceVersion: S.optional(S.String),
    artifactsOverride: S.optional(ProjectArtifacts),
    secondaryArtifactsOverride: S.optional(ProjectArtifactsList),
    environmentVariablesOverride: S.optional(EnvironmentVariables),
    sourceTypeOverride: S.optional(S.String),
    sourceLocationOverride: S.optional(S.String),
    sourceAuthOverride: S.optional(SourceAuth),
    gitCloneDepthOverride: S.optional(S.Number),
    gitSubmodulesConfigOverride: S.optional(GitSubmodulesConfig),
    buildspecOverride: S.optional(S.String),
    insecureSslOverride: S.optional(S.Boolean),
    reportBuildBatchStatusOverride: S.optional(S.Boolean),
    environmentTypeOverride: S.optional(S.String),
    imageOverride: S.optional(S.String),
    computeTypeOverride: S.optional(S.String),
    certificateOverride: S.optional(S.String),
    cacheOverride: S.optional(ProjectCache),
    serviceRoleOverride: S.optional(S.String),
    privilegedModeOverride: S.optional(S.Boolean),
    buildTimeoutInMinutesOverride: S.optional(S.Number),
    queuedTimeoutInMinutesOverride: S.optional(S.Number),
    encryptionKeyOverride: S.optional(S.String),
    idempotencyToken: S.optional(S.String),
    logsConfigOverride: S.optional(LogsConfig),
    registryCredentialOverride: S.optional(RegistryCredential),
    imagePullCredentialsTypeOverride: S.optional(S.String),
    buildBatchConfigOverride: S.optional(ProjectBuildBatchConfig),
    debugSessionEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartCommandExecutionInput extends S.Class<StartCommandExecutionInput>(
  "StartCommandExecutionInput",
)(
  { sandboxId: S.String, command: S.String, type: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSandboxInput extends S.Class<StartSandboxInput>(
  "StartSandboxInput",
)(
  { projectName: S.optional(S.String), idempotencyToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartSandboxConnectionInput extends S.Class<StartSandboxConnectionInput>(
  "StartSandboxConnectionInput",
)(
  { sandboxId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopBuildInput extends S.Class<StopBuildInput>("StopBuildInput")(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopBuildBatchInput extends S.Class<StopBuildBatchInput>(
  "StopBuildBatchInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopSandboxInput extends S.Class<StopSandboxInput>(
  "StopSandboxInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ComputeConfiguration extends S.Class<ComputeConfiguration>(
  "ComputeConfiguration",
)({
  vCpu: S.optional(S.Number),
  memory: S.optional(S.Number),
  disk: S.optional(S.Number),
  machineType: S.optional(S.String),
  instanceType: S.optional(S.String),
}) {}
export class TargetTrackingScalingConfiguration extends S.Class<TargetTrackingScalingConfiguration>(
  "TargetTrackingScalingConfiguration",
)({ metricType: S.optional(S.String), targetValue: S.optional(S.Number) }) {}
export const TargetTrackingScalingConfigurations = S.Array(
  TargetTrackingScalingConfiguration,
);
export class ScalingConfigurationInput extends S.Class<ScalingConfigurationInput>(
  "ScalingConfigurationInput",
)({
  scalingType: S.optional(S.String),
  targetTrackingScalingConfigs: S.optional(TargetTrackingScalingConfigurations),
  maxCapacity: S.optional(S.Number),
}) {}
export const Subnets = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  vpcId: S.optional(S.String),
  subnets: S.optional(Subnets),
  securityGroupIds: S.optional(SecurityGroupIds),
}) {}
export const FleetProxyRuleEntities = S.Array(S.String);
export class FleetProxyRule extends S.Class<FleetProxyRule>("FleetProxyRule")({
  type: S.String,
  effect: S.String,
  entities: FleetProxyRuleEntities,
}) {}
export const FleetProxyRules = S.Array(FleetProxyRule);
export class ProxyConfiguration extends S.Class<ProxyConfiguration>(
  "ProxyConfiguration",
)({
  defaultBehavior: S.optional(S.String),
  orderedProxyRules: S.optional(FleetProxyRules),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class UpdateFleetInput extends S.Class<UpdateFleetInput>(
  "UpdateFleetInput",
)(
  {
    arn: S.String,
    baseCapacity: S.optional(S.Number),
    environmentType: S.optional(S.String),
    computeType: S.optional(S.String),
    computeConfiguration: S.optional(ComputeConfiguration),
    scalingConfiguration: S.optional(ScalingConfigurationInput),
    overflowBehavior: S.optional(S.String),
    vpcConfig: S.optional(VpcConfig),
    proxyConfiguration: S.optional(ProxyConfiguration),
    imageId: S.optional(S.String),
    fleetServiceRole: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProjectFleet extends S.Class<ProjectFleet>("ProjectFleet")({
  fleetArn: S.optional(S.String),
}) {}
export class DockerServerStatus extends S.Class<DockerServerStatus>(
  "DockerServerStatus",
)({ status: S.optional(S.String), message: S.optional(S.String) }) {}
export class DockerServer extends S.Class<DockerServer>("DockerServer")({
  computeType: S.String,
  securityGroupIds: S.optional(SecurityGroupIds),
  status: S.optional(DockerServerStatus),
}) {}
export class ProjectEnvironment extends S.Class<ProjectEnvironment>(
  "ProjectEnvironment",
)({
  type: S.String,
  image: S.String,
  computeType: S.String,
  computeConfiguration: S.optional(ComputeConfiguration),
  fleet: S.optional(ProjectFleet),
  environmentVariables: S.optional(EnvironmentVariables),
  privilegedMode: S.optional(S.Boolean),
  certificate: S.optional(S.String),
  registryCredential: S.optional(RegistryCredential),
  imagePullCredentialsType: S.optional(S.String),
  dockerServer: S.optional(DockerServer),
}) {}
export class ProjectFileSystemLocation extends S.Class<ProjectFileSystemLocation>(
  "ProjectFileSystemLocation",
)({
  type: S.optional(S.String),
  location: S.optional(S.String),
  mountPoint: S.optional(S.String),
  identifier: S.optional(S.String),
  mountOptions: S.optional(S.String),
}) {}
export const ProjectFileSystemLocations = S.Array(ProjectFileSystemLocation);
export class UpdateProjectInput extends S.Class<UpdateProjectInput>(
  "UpdateProjectInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    source: S.optional(ProjectSource),
    secondarySources: S.optional(ProjectSources),
    sourceVersion: S.optional(S.String),
    secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
    artifacts: S.optional(ProjectArtifacts),
    secondaryArtifacts: S.optional(ProjectArtifactsList),
    cache: S.optional(ProjectCache),
    environment: S.optional(ProjectEnvironment),
    serviceRole: S.optional(S.String),
    timeoutInMinutes: S.optional(S.Number),
    queuedTimeoutInMinutes: S.optional(S.Number),
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
    vpcConfig: S.optional(VpcConfig),
    badgeEnabled: S.optional(S.Boolean),
    logsConfig: S.optional(LogsConfig),
    fileSystemLocations: S.optional(ProjectFileSystemLocations),
    buildBatchConfig: S.optional(ProjectBuildBatchConfig),
    concurrentBuildLimit: S.optional(S.Number),
    autoRetryLimit: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProjectVisibilityInput extends S.Class<UpdateProjectVisibilityInput>(
  "UpdateProjectVisibilityInput",
)(
  {
    projectArn: S.String,
    projectVisibility: S.String,
    resourceAccessRole: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3ReportExportConfig extends S.Class<S3ReportExportConfig>(
  "S3ReportExportConfig",
)({
  bucket: S.optional(S.String),
  bucketOwner: S.optional(S.String),
  path: S.optional(S.String),
  packaging: S.optional(S.String),
  encryptionKey: S.optional(S.String),
  encryptionDisabled: S.optional(S.Boolean),
}) {}
export class ReportExportConfig extends S.Class<ReportExportConfig>(
  "ReportExportConfig",
)({
  exportConfigType: S.optional(S.String),
  s3Destination: S.optional(S3ReportExportConfig),
}) {}
export class UpdateReportGroupInput extends S.Class<UpdateReportGroupInput>(
  "UpdateReportGroupInput",
)(
  {
    arn: S.String,
    exportConfig: S.optional(ReportExportConfig),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class WebhookFilter extends S.Class<WebhookFilter>("WebhookFilter")({
  type: S.String,
  pattern: S.String,
  excludeMatchedPattern: S.optional(S.Boolean),
}) {}
export const FilterGroup = S.Array(WebhookFilter);
export const FilterGroups = S.Array(FilterGroup);
export const PullRequestBuildApproverRoles = S.Array(S.String);
export class PullRequestBuildPolicy extends S.Class<PullRequestBuildPolicy>(
  "PullRequestBuildPolicy",
)({
  requiresCommentApproval: S.String,
  approverRoles: S.optional(PullRequestBuildApproverRoles),
}) {}
export class UpdateWebhookInput extends S.Class<UpdateWebhookInput>(
  "UpdateWebhookInput",
)(
  {
    projectName: S.String,
    branchFilter: S.optional(S.String),
    rotateSecret: S.optional(S.Boolean),
    filterGroups: S.optional(FilterGroups),
    buildType: S.optional(S.String),
    pullRequestBuildPolicy: S.optional(PullRequestBuildPolicy),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ScopeConfiguration extends S.Class<ScopeConfiguration>(
  "ScopeConfiguration",
)({ name: S.String, domain: S.optional(S.String), scope: S.String }) {}
export class TestCaseFilter extends S.Class<TestCaseFilter>("TestCaseFilter")({
  status: S.optional(S.String),
  keyword: S.optional(S.String),
}) {}
export const FleetArns = S.Array(S.String);
export const ProjectArns = S.Array(S.String);
export class SourceCredentialsInfo extends S.Class<SourceCredentialsInfo>(
  "SourceCredentialsInfo",
)({
  arn: S.optional(S.String),
  serverType: S.optional(S.String),
  authType: S.optional(S.String),
  resource: S.optional(S.String),
}) {}
export const SourceCredentialsInfos = S.Array(SourceCredentialsInfo);
export class CreateWebhookInput extends S.Class<CreateWebhookInput>(
  "CreateWebhookInput",
)(
  {
    projectName: S.String,
    branchFilter: S.optional(S.String),
    filterGroups: S.optional(FilterGroups),
    buildType: S.optional(S.String),
    manualCreation: S.optional(S.Boolean),
    scopeConfiguration: S.optional(ScopeConfiguration),
    pullRequestBuildPolicy: S.optional(PullRequestBuildPolicy),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BuildNotDeleted extends S.Class<BuildNotDeleted>(
  "BuildNotDeleted",
)({ id: S.optional(S.String), statusCode: S.optional(S.String) }) {}
export const BuildsNotDeleted = S.Array(BuildNotDeleted);
export class DeleteBuildBatchOutput extends S.Class<DeleteBuildBatchOutput>(
  "DeleteBuildBatchOutput",
)({
  statusCode: S.optional(S.String),
  buildsDeleted: S.optional(BuildIds),
  buildsNotDeleted: S.optional(BuildsNotDeleted),
}) {}
export class DeleteSourceCredentialsOutput extends S.Class<DeleteSourceCredentialsOutput>(
  "DeleteSourceCredentialsOutput",
)({ arn: S.optional(S.String) }) {}
export class DescribeTestCasesInput extends S.Class<DescribeTestCasesInput>(
  "DescribeTestCasesInput",
)(
  {
    reportArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(TestCaseFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyOutput extends S.Class<GetResourcePolicyOutput>(
  "GetResourcePolicyOutput",
)({ policy: S.optional(S.String) }) {}
export class ImportSourceCredentialsOutput extends S.Class<ImportSourceCredentialsOutput>(
  "ImportSourceCredentialsOutput",
)({ arn: S.optional(S.String) }) {}
export class ListBuildBatchesInput extends S.Class<ListBuildBatchesInput>(
  "ListBuildBatchesInput",
)(
  {
    filter: S.optional(BuildBatchFilter),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBuildBatchesForProjectOutput extends S.Class<ListBuildBatchesForProjectOutput>(
  "ListBuildBatchesForProjectOutput",
)({ ids: S.optional(BuildBatchIds), nextToken: S.optional(S.String) }) {}
export class ListBuildsOutput extends S.Class<ListBuildsOutput>(
  "ListBuildsOutput",
)({ ids: S.optional(BuildIds), nextToken: S.optional(S.String) }) {}
export class ListBuildsForProjectOutput extends S.Class<ListBuildsForProjectOutput>(
  "ListBuildsForProjectOutput",
)({ ids: S.optional(BuildIds), nextToken: S.optional(S.String) }) {}
export class LogsLocation extends S.Class<LogsLocation>("LogsLocation")({
  groupName: S.optional(S.String),
  streamName: S.optional(S.String),
  deepLink: S.optional(S.String),
  s3DeepLink: S.optional(S.String),
  cloudWatchLogsArn: S.optional(S.String),
  s3LogsArn: S.optional(S.String),
  cloudWatchLogs: S.optional(CloudWatchLogsConfig),
  s3Logs: S.optional(S3LogsConfig),
}) {}
export class CommandExecution extends S.Class<CommandExecution>(
  "CommandExecution",
)({
  id: S.optional(S.String),
  sandboxId: S.optional(S.String),
  submitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  command: S.optional(S.String),
  type: S.optional(S.String),
  exitCode: S.optional(S.String),
  standardOutputContent: S.optional(S.String),
  standardErrContent: S.optional(S.String),
  logs: S.optional(LogsLocation),
  sandboxArn: S.optional(S.String),
}) {}
export const CommandExecutions = S.Array(CommandExecution);
export class ListCommandExecutionsForSandboxOutput extends S.Class<ListCommandExecutionsForSandboxOutput>(
  "ListCommandExecutionsForSandboxOutput",
)({
  commandExecutions: S.optional(CommandExecutions),
  nextToken: S.optional(S.String),
}) {}
export class ListFleetsOutput extends S.Class<ListFleetsOutput>(
  "ListFleetsOutput",
)({ nextToken: S.optional(S.String), fleets: S.optional(FleetArns) }) {}
export class ListProjectsOutput extends S.Class<ListProjectsOutput>(
  "ListProjectsOutput",
)({ nextToken: S.optional(S.String), projects: S.optional(ProjectNames) }) {}
export class ListReportGroupsOutput extends S.Class<ListReportGroupsOutput>(
  "ListReportGroupsOutput",
)({
  nextToken: S.optional(S.String),
  reportGroups: S.optional(ReportGroupArns),
}) {}
export class ListReportsInput extends S.Class<ListReportsInput>(
  "ListReportsInput",
)(
  {
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(ReportFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReportsForReportGroupOutput extends S.Class<ListReportsForReportGroupOutput>(
  "ListReportsForReportGroupOutput",
)({ nextToken: S.optional(S.String), reports: S.optional(ReportArns) }) {}
export class ListSandboxesOutput extends S.Class<ListSandboxesOutput>(
  "ListSandboxesOutput",
)({ ids: S.optional(SandboxIds), nextToken: S.optional(S.String) }) {}
export class ListSandboxesForProjectOutput extends S.Class<ListSandboxesForProjectOutput>(
  "ListSandboxesForProjectOutput",
)({ ids: S.optional(SandboxIds), nextToken: S.optional(S.String) }) {}
export class ListSharedProjectsOutput extends S.Class<ListSharedProjectsOutput>(
  "ListSharedProjectsOutput",
)({ nextToken: S.optional(S.String), projects: S.optional(ProjectArns) }) {}
export class ListSharedReportGroupsOutput extends S.Class<ListSharedReportGroupsOutput>(
  "ListSharedReportGroupsOutput",
)({
  nextToken: S.optional(S.String),
  reportGroups: S.optional(ReportGroupArns),
}) {}
export class ListSourceCredentialsOutput extends S.Class<ListSourceCredentialsOutput>(
  "ListSourceCredentialsOutput",
)({ sourceCredentialsInfos: S.optional(SourceCredentialsInfos) }) {}
export class PutResourcePolicyOutput extends S.Class<PutResourcePolicyOutput>(
  "PutResourcePolicyOutput",
)({ resourceArn: S.optional(S.String) }) {}
export class PhaseContext extends S.Class<PhaseContext>("PhaseContext")({
  statusCode: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const PhaseContexts = S.Array(PhaseContext);
export class BuildPhase extends S.Class<BuildPhase>("BuildPhase")({
  phaseType: S.optional(S.String),
  phaseStatus: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  durationInSeconds: S.optional(S.Number),
  contexts: S.optional(PhaseContexts),
}) {}
export const BuildPhases = S.Array(BuildPhase);
export class BuildArtifacts extends S.Class<BuildArtifacts>("BuildArtifacts")({
  location: S.optional(S.String),
  sha256sum: S.optional(S.String),
  md5sum: S.optional(S.String),
  overrideArtifactName: S.optional(S.Boolean),
  encryptionDisabled: S.optional(S.Boolean),
  artifactIdentifier: S.optional(S.String),
  bucketOwnerAccess: S.optional(S.String),
}) {}
export const BuildArtifactsList = S.Array(BuildArtifacts);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  subnetId: S.optional(S.String),
  networkInterfaceId: S.optional(S.String),
}) {}
export class ExportedEnvironmentVariable extends S.Class<ExportedEnvironmentVariable>(
  "ExportedEnvironmentVariable",
)({ name: S.optional(S.String), value: S.optional(S.String) }) {}
export const ExportedEnvironmentVariables = S.Array(
  ExportedEnvironmentVariable,
);
export const BuildReportArns = S.Array(S.String);
export class DebugSession extends S.Class<DebugSession>("DebugSession")({
  sessionEnabled: S.optional(S.Boolean),
  sessionTarget: S.optional(S.String),
}) {}
export class AutoRetryConfig extends S.Class<AutoRetryConfig>(
  "AutoRetryConfig",
)({
  autoRetryLimit: S.optional(S.Number),
  autoRetryNumber: S.optional(S.Number),
  nextAutoRetry: S.optional(S.String),
  previousAutoRetry: S.optional(S.String),
}) {}
export class Build extends S.Class<Build>("Build")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  buildNumber: S.optional(S.Number),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  currentPhase: S.optional(S.String),
  buildStatus: S.optional(S.String),
  sourceVersion: S.optional(S.String),
  resolvedSourceVersion: S.optional(S.String),
  projectName: S.optional(S.String),
  phases: S.optional(BuildPhases),
  source: S.optional(ProjectSource),
  secondarySources: S.optional(ProjectSources),
  secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
  artifacts: S.optional(BuildArtifacts),
  secondaryArtifacts: S.optional(BuildArtifactsList),
  cache: S.optional(ProjectCache),
  environment: S.optional(ProjectEnvironment),
  serviceRole: S.optional(S.String),
  logs: S.optional(LogsLocation),
  timeoutInMinutes: S.optional(S.Number),
  queuedTimeoutInMinutes: S.optional(S.Number),
  buildComplete: S.optional(S.Boolean),
  initiator: S.optional(S.String),
  vpcConfig: S.optional(VpcConfig),
  networkInterface: S.optional(NetworkInterface),
  encryptionKey: S.optional(S.String),
  exportedEnvironmentVariables: S.optional(ExportedEnvironmentVariables),
  reportArns: S.optional(BuildReportArns),
  fileSystemLocations: S.optional(ProjectFileSystemLocations),
  debugSession: S.optional(DebugSession),
  buildBatchArn: S.optional(S.String),
  autoRetryConfig: S.optional(AutoRetryConfig),
}) {}
export class RetryBuildOutput extends S.Class<RetryBuildOutput>(
  "RetryBuildOutput",
)({ build: S.optional(Build) }) {}
export class BuildBatchPhase extends S.Class<BuildBatchPhase>(
  "BuildBatchPhase",
)({
  phaseType: S.optional(S.String),
  phaseStatus: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  durationInSeconds: S.optional(S.Number),
  contexts: S.optional(PhaseContexts),
}) {}
export const BuildBatchPhases = S.Array(BuildBatchPhase);
export const Identifiers = S.Array(S.String);
export class ResolvedArtifact extends S.Class<ResolvedArtifact>(
  "ResolvedArtifact",
)({
  type: S.optional(S.String),
  location: S.optional(S.String),
  identifier: S.optional(S.String),
}) {}
export const ResolvedSecondaryArtifacts = S.Array(ResolvedArtifact);
export class BuildSummary extends S.Class<BuildSummary>("BuildSummary")({
  arn: S.optional(S.String),
  requestedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  buildStatus: S.optional(S.String),
  primaryArtifact: S.optional(ResolvedArtifact),
  secondaryArtifacts: S.optional(ResolvedSecondaryArtifacts),
}) {}
export const BuildSummaries = S.Array(BuildSummary);
export class BuildGroup extends S.Class<BuildGroup>("BuildGroup")({
  identifier: S.optional(S.String),
  dependsOn: S.optional(Identifiers),
  ignoreFailure: S.optional(S.Boolean),
  currentBuildSummary: S.optional(BuildSummary),
  priorBuildSummaryList: S.optional(BuildSummaries),
}) {}
export const BuildGroups = S.Array(BuildGroup);
export class BuildBatch extends S.Class<BuildBatch>("BuildBatch")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  currentPhase: S.optional(S.String),
  buildBatchStatus: S.optional(S.String),
  sourceVersion: S.optional(S.String),
  resolvedSourceVersion: S.optional(S.String),
  projectName: S.optional(S.String),
  phases: S.optional(BuildBatchPhases),
  source: S.optional(ProjectSource),
  secondarySources: S.optional(ProjectSources),
  secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
  artifacts: S.optional(BuildArtifacts),
  secondaryArtifacts: S.optional(BuildArtifactsList),
  cache: S.optional(ProjectCache),
  environment: S.optional(ProjectEnvironment),
  serviceRole: S.optional(S.String),
  logConfig: S.optional(LogsConfig),
  buildTimeoutInMinutes: S.optional(S.Number),
  queuedTimeoutInMinutes: S.optional(S.Number),
  complete: S.optional(S.Boolean),
  initiator: S.optional(S.String),
  vpcConfig: S.optional(VpcConfig),
  encryptionKey: S.optional(S.String),
  buildBatchNumber: S.optional(S.Number),
  fileSystemLocations: S.optional(ProjectFileSystemLocations),
  buildBatchConfig: S.optional(ProjectBuildBatchConfig),
  buildGroups: S.optional(BuildGroups),
  debugSessionEnabled: S.optional(S.Boolean),
  reportArns: S.optional(BuildReportArns),
}) {}
export class RetryBuildBatchOutput extends S.Class<RetryBuildBatchOutput>(
  "RetryBuildBatchOutput",
)({ buildBatch: S.optional(BuildBatch) }) {}
export class StartBuildInput extends S.Class<StartBuildInput>(
  "StartBuildInput",
)(
  {
    projectName: S.String,
    secondarySourcesOverride: S.optional(ProjectSources),
    secondarySourcesVersionOverride: S.optional(ProjectSecondarySourceVersions),
    sourceVersion: S.optional(S.String),
    artifactsOverride: S.optional(ProjectArtifacts),
    secondaryArtifactsOverride: S.optional(ProjectArtifactsList),
    environmentVariablesOverride: S.optional(EnvironmentVariables),
    sourceTypeOverride: S.optional(S.String),
    sourceLocationOverride: S.optional(S.String),
    sourceAuthOverride: S.optional(SourceAuth),
    gitCloneDepthOverride: S.optional(S.Number),
    gitSubmodulesConfigOverride: S.optional(GitSubmodulesConfig),
    buildspecOverride: S.optional(S.String),
    insecureSslOverride: S.optional(S.Boolean),
    reportBuildStatusOverride: S.optional(S.Boolean),
    buildStatusConfigOverride: S.optional(BuildStatusConfig),
    environmentTypeOverride: S.optional(S.String),
    imageOverride: S.optional(S.String),
    computeTypeOverride: S.optional(S.String),
    certificateOverride: S.optional(S.String),
    cacheOverride: S.optional(ProjectCache),
    serviceRoleOverride: S.optional(S.String),
    privilegedModeOverride: S.optional(S.Boolean),
    timeoutInMinutesOverride: S.optional(S.Number),
    queuedTimeoutInMinutesOverride: S.optional(S.Number),
    encryptionKeyOverride: S.optional(S.String),
    idempotencyToken: S.optional(S.String),
    logsConfigOverride: S.optional(LogsConfig),
    registryCredentialOverride: S.optional(RegistryCredential),
    imagePullCredentialsTypeOverride: S.optional(S.String),
    debugSessionEnabled: S.optional(S.Boolean),
    fleetOverride: S.optional(ProjectFleet),
    autoRetryLimitOverride: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBuildBatchOutput extends S.Class<StartBuildBatchOutput>(
  "StartBuildBatchOutput",
)({ buildBatch: S.optional(BuildBatch) }) {}
export class StartCommandExecutionOutput extends S.Class<StartCommandExecutionOutput>(
  "StartCommandExecutionOutput",
)({ commandExecution: S.optional(CommandExecution) }) {}
export class SandboxSessionPhase extends S.Class<SandboxSessionPhase>(
  "SandboxSessionPhase",
)({
  phaseType: S.optional(S.String),
  phaseStatus: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  durationInSeconds: S.optional(S.Number),
  contexts: S.optional(PhaseContexts),
}) {}
export const SandboxSessionPhases = S.Array(SandboxSessionPhase);
export class SandboxSession extends S.Class<SandboxSession>("SandboxSession")({
  id: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  currentPhase: S.optional(S.String),
  phases: S.optional(SandboxSessionPhases),
  resolvedSourceVersion: S.optional(S.String),
  logs: S.optional(LogsLocation),
  networkInterface: S.optional(NetworkInterface),
}) {}
export class Sandbox extends S.Class<Sandbox>("Sandbox")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  projectName: S.optional(S.String),
  requestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  source: S.optional(ProjectSource),
  sourceVersion: S.optional(S.String),
  secondarySources: S.optional(ProjectSources),
  secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
  environment: S.optional(ProjectEnvironment),
  fileSystemLocations: S.optional(ProjectFileSystemLocations),
  timeoutInMinutes: S.optional(S.Number),
  queuedTimeoutInMinutes: S.optional(S.Number),
  vpcConfig: S.optional(VpcConfig),
  logConfig: S.optional(LogsConfig),
  encryptionKey: S.optional(S.String),
  serviceRole: S.optional(S.String),
  currentSession: S.optional(SandboxSession),
}) {}
export class StartSandboxOutput extends S.Class<StartSandboxOutput>(
  "StartSandboxOutput",
)({ sandbox: S.optional(Sandbox) }) {}
export class StopBuildOutput extends S.Class<StopBuildOutput>(
  "StopBuildOutput",
)({ build: S.optional(Build) }) {}
export class StopBuildBatchOutput extends S.Class<StopBuildBatchOutput>(
  "StopBuildBatchOutput",
)({ buildBatch: S.optional(BuildBatch) }) {}
export class StopSandboxOutput extends S.Class<StopSandboxOutput>(
  "StopSandboxOutput",
)({ sandbox: S.optional(Sandbox) }) {}
export class FleetStatus extends S.Class<FleetStatus>("FleetStatus")({
  statusCode: S.optional(S.String),
  context: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class ScalingConfigurationOutput extends S.Class<ScalingConfigurationOutput>(
  "ScalingConfigurationOutput",
)({
  scalingType: S.optional(S.String),
  targetTrackingScalingConfigs: S.optional(TargetTrackingScalingConfigurations),
  maxCapacity: S.optional(S.Number),
  desiredCapacity: S.optional(S.Number),
}) {}
export class Fleet extends S.Class<Fleet>("Fleet")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(FleetStatus),
  baseCapacity: S.optional(S.Number),
  environmentType: S.optional(S.String),
  computeType: S.optional(S.String),
  computeConfiguration: S.optional(ComputeConfiguration),
  scalingConfiguration: S.optional(ScalingConfigurationOutput),
  overflowBehavior: S.optional(S.String),
  vpcConfig: S.optional(VpcConfig),
  proxyConfiguration: S.optional(ProxyConfiguration),
  imageId: S.optional(S.String),
  fleetServiceRole: S.optional(S.String),
  tags: S.optional(TagList),
}) {}
export class UpdateFleetOutput extends S.Class<UpdateFleetOutput>(
  "UpdateFleetOutput",
)({ fleet: S.optional(Fleet) }) {}
export class Webhook extends S.Class<Webhook>("Webhook")({
  url: S.optional(S.String),
  payloadUrl: S.optional(S.String),
  secret: S.optional(S.String),
  branchFilter: S.optional(S.String),
  filterGroups: S.optional(FilterGroups),
  buildType: S.optional(S.String),
  manualCreation: S.optional(S.Boolean),
  lastModifiedSecret: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  scopeConfiguration: S.optional(ScopeConfiguration),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  pullRequestBuildPolicy: S.optional(PullRequestBuildPolicy),
}) {}
export class ProjectBadge extends S.Class<ProjectBadge>("ProjectBadge")({
  badgeEnabled: S.optional(S.Boolean),
  badgeRequestUrl: S.optional(S.String),
}) {}
export class Project extends S.Class<Project>("Project")({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  source: S.optional(ProjectSource),
  secondarySources: S.optional(ProjectSources),
  sourceVersion: S.optional(S.String),
  secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
  artifacts: S.optional(ProjectArtifacts),
  secondaryArtifacts: S.optional(ProjectArtifactsList),
  cache: S.optional(ProjectCache),
  environment: S.optional(ProjectEnvironment),
  serviceRole: S.optional(S.String),
  timeoutInMinutes: S.optional(S.Number),
  queuedTimeoutInMinutes: S.optional(S.Number),
  encryptionKey: S.optional(S.String),
  tags: S.optional(TagList),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  webhook: S.optional(Webhook),
  vpcConfig: S.optional(VpcConfig),
  badge: S.optional(ProjectBadge),
  logsConfig: S.optional(LogsConfig),
  fileSystemLocations: S.optional(ProjectFileSystemLocations),
  buildBatchConfig: S.optional(ProjectBuildBatchConfig),
  concurrentBuildLimit: S.optional(S.Number),
  projectVisibility: S.optional(S.String),
  publicProjectAlias: S.optional(S.String),
  resourceAccessRole: S.optional(S.String),
  autoRetryLimit: S.optional(S.Number),
}) {}
export class UpdateProjectOutput extends S.Class<UpdateProjectOutput>(
  "UpdateProjectOutput",
)({ project: S.optional(Project) }) {}
export class UpdateProjectVisibilityOutput extends S.Class<UpdateProjectVisibilityOutput>(
  "UpdateProjectVisibilityOutput",
)({
  projectArn: S.optional(S.String),
  publicProjectAlias: S.optional(S.String),
  projectVisibility: S.optional(S.String),
}) {}
export class ReportGroup extends S.Class<ReportGroup>("ReportGroup")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  exportConfig: S.optional(ReportExportConfig),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagList),
  status: S.optional(S.String),
}) {}
export class UpdateReportGroupOutput extends S.Class<UpdateReportGroupOutput>(
  "UpdateReportGroupOutput",
)({ reportGroup: S.optional(ReportGroup) }) {}
export const ImageVersions = S.Array(S.String);
export const ReportGroups = S.Array(ReportGroup);
export class CodeCoverage extends S.Class<CodeCoverage>("CodeCoverage")({
  id: S.optional(S.String),
  reportARN: S.optional(S.String),
  filePath: S.optional(S.String),
  lineCoveragePercentage: S.optional(S.Number),
  linesCovered: S.optional(S.Number),
  linesMissed: S.optional(S.Number),
  branchCoveragePercentage: S.optional(S.Number),
  branchesCovered: S.optional(S.Number),
  branchesMissed: S.optional(S.Number),
  expired: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CodeCoverages = S.Array(CodeCoverage);
export class ReportGroupTrendStats extends S.Class<ReportGroupTrendStats>(
  "ReportGroupTrendStats",
)({
  average: S.optional(S.String),
  max: S.optional(S.String),
  min: S.optional(S.String),
}) {}
export class ReportWithRawData extends S.Class<ReportWithRawData>(
  "ReportWithRawData",
)({ reportArn: S.optional(S.String), data: S.optional(S.String) }) {}
export const ReportGroupTrendRawDataList = S.Array(ReportWithRawData);
export class SSMSession extends S.Class<SSMSession>("SSMSession")({
  sessionId: S.optional(S.String),
  tokenValue: S.optional(S.String),
  streamUrl: S.optional(S.String),
}) {}
export class EnvironmentImage extends S.Class<EnvironmentImage>(
  "EnvironmentImage",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  versions: S.optional(ImageVersions),
}) {}
export const EnvironmentImages = S.Array(EnvironmentImage);
export class BatchDeleteBuildsOutput extends S.Class<BatchDeleteBuildsOutput>(
  "BatchDeleteBuildsOutput",
)({
  buildsDeleted: S.optional(BuildIds),
  buildsNotDeleted: S.optional(BuildsNotDeleted),
}) {}
export class BatchGetCommandExecutionsOutput extends S.Class<BatchGetCommandExecutionsOutput>(
  "BatchGetCommandExecutionsOutput",
)({
  commandExecutions: S.optional(CommandExecutions),
  commandExecutionsNotFound: S.optional(CommandExecutionIds),
}) {}
export class BatchGetReportGroupsOutput extends S.Class<BatchGetReportGroupsOutput>(
  "BatchGetReportGroupsOutput",
)({
  reportGroups: S.optional(ReportGroups),
  reportGroupsNotFound: S.optional(ReportGroupArns),
}) {}
export class CreateFleetInput extends S.Class<CreateFleetInput>(
  "CreateFleetInput",
)(
  {
    name: S.String,
    baseCapacity: S.Number,
    environmentType: S.String,
    computeType: S.String,
    computeConfiguration: S.optional(ComputeConfiguration),
    scalingConfiguration: S.optional(ScalingConfigurationInput),
    overflowBehavior: S.optional(S.String),
    vpcConfig: S.optional(VpcConfig),
    proxyConfiguration: S.optional(ProxyConfiguration),
    imageId: S.optional(S.String),
    fleetServiceRole: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReportGroupInput extends S.Class<CreateReportGroupInput>(
  "CreateReportGroupInput",
)(
  {
    name: S.String,
    type: S.String,
    exportConfig: ReportExportConfig,
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWebhookOutput extends S.Class<CreateWebhookOutput>(
  "CreateWebhookOutput",
)({ webhook: S.optional(Webhook) }) {}
export class DescribeCodeCoveragesOutput extends S.Class<DescribeCodeCoveragesOutput>(
  "DescribeCodeCoveragesOutput",
)({
  nextToken: S.optional(S.String),
  codeCoverages: S.optional(CodeCoverages),
}) {}
export class GetReportGroupTrendOutput extends S.Class<GetReportGroupTrendOutput>(
  "GetReportGroupTrendOutput",
)({
  stats: S.optional(ReportGroupTrendStats),
  rawData: S.optional(ReportGroupTrendRawDataList),
}) {}
export class ListBuildBatchesOutput extends S.Class<ListBuildBatchesOutput>(
  "ListBuildBatchesOutput",
)({ ids: S.optional(BuildBatchIds), nextToken: S.optional(S.String) }) {}
export class ListReportsOutput extends S.Class<ListReportsOutput>(
  "ListReportsOutput",
)({ nextToken: S.optional(S.String), reports: S.optional(ReportArns) }) {}
export class StartBuildOutput extends S.Class<StartBuildOutput>(
  "StartBuildOutput",
)({ build: S.optional(Build) }) {}
export class StartSandboxConnectionOutput extends S.Class<StartSandboxConnectionOutput>(
  "StartSandboxConnectionOutput",
)({ ssmSession: S.optional(SSMSession) }) {}
export class UpdateWebhookOutput extends S.Class<UpdateWebhookOutput>(
  "UpdateWebhookOutput",
)({ webhook: S.optional(Webhook) }) {}
export class CodeCoverageReportSummary extends S.Class<CodeCoverageReportSummary>(
  "CodeCoverageReportSummary",
)({
  lineCoveragePercentage: S.optional(S.Number),
  linesCovered: S.optional(S.Number),
  linesMissed: S.optional(S.Number),
  branchCoveragePercentage: S.optional(S.Number),
  branchesCovered: S.optional(S.Number),
  branchesMissed: S.optional(S.Number),
}) {}
export class EnvironmentLanguage extends S.Class<EnvironmentLanguage>(
  "EnvironmentLanguage",
)({ language: S.optional(S.String), images: S.optional(EnvironmentImages) }) {}
export const EnvironmentLanguages = S.Array(EnvironmentLanguage);
export const Builds = S.Array(Build);
export const Fleets = S.Array(Fleet);
export const Projects = S.Array(Project);
export class TestCase extends S.Class<TestCase>("TestCase")({
  reportArn: S.optional(S.String),
  testRawDataPath: S.optional(S.String),
  prefix: S.optional(S.String),
  name: S.optional(S.String),
  status: S.optional(S.String),
  durationInNanoSeconds: S.optional(S.Number),
  message: S.optional(S.String),
  expired: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  testSuiteName: S.optional(S.String),
}) {}
export const TestCases = S.Array(TestCase);
export class EnvironmentPlatform extends S.Class<EnvironmentPlatform>(
  "EnvironmentPlatform",
)({
  platform: S.optional(S.String),
  languages: S.optional(EnvironmentLanguages),
}) {}
export const EnvironmentPlatforms = S.Array(EnvironmentPlatform);
export const ReportStatusCounts = S.Record({ key: S.String, value: S.Number });
export class BatchGetBuildsOutput extends S.Class<BatchGetBuildsOutput>(
  "BatchGetBuildsOutput",
)({ builds: S.optional(Builds), buildsNotFound: S.optional(BuildIds) }) {}
export class BatchGetFleetsOutput extends S.Class<BatchGetFleetsOutput>(
  "BatchGetFleetsOutput",
)({ fleets: S.optional(Fleets), fleetsNotFound: S.optional(FleetNames) }) {}
export class BatchGetProjectsOutput extends S.Class<BatchGetProjectsOutput>(
  "BatchGetProjectsOutput",
)({
  projects: S.optional(Projects),
  projectsNotFound: S.optional(ProjectNames),
}) {}
export class CreateFleetOutput extends S.Class<CreateFleetOutput>(
  "CreateFleetOutput",
)({ fleet: S.optional(Fleet) }) {}
export class CreateProjectInput extends S.Class<CreateProjectInput>(
  "CreateProjectInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    source: ProjectSource,
    secondarySources: S.optional(ProjectSources),
    sourceVersion: S.optional(S.String),
    secondarySourceVersions: S.optional(ProjectSecondarySourceVersions),
    artifacts: ProjectArtifacts,
    secondaryArtifacts: S.optional(ProjectArtifactsList),
    cache: S.optional(ProjectCache),
    environment: ProjectEnvironment,
    serviceRole: S.String,
    timeoutInMinutes: S.optional(S.Number),
    queuedTimeoutInMinutes: S.optional(S.Number),
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
    vpcConfig: S.optional(VpcConfig),
    badgeEnabled: S.optional(S.Boolean),
    logsConfig: S.optional(LogsConfig),
    fileSystemLocations: S.optional(ProjectFileSystemLocations),
    buildBatchConfig: S.optional(ProjectBuildBatchConfig),
    concurrentBuildLimit: S.optional(S.Number),
    autoRetryLimit: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReportGroupOutput extends S.Class<CreateReportGroupOutput>(
  "CreateReportGroupOutput",
)({ reportGroup: S.optional(ReportGroup) }) {}
export class DescribeTestCasesOutput extends S.Class<DescribeTestCasesOutput>(
  "DescribeTestCasesOutput",
)({ nextToken: S.optional(S.String), testCases: S.optional(TestCases) }) {}
export class ListCuratedEnvironmentImagesOutput extends S.Class<ListCuratedEnvironmentImagesOutput>(
  "ListCuratedEnvironmentImagesOutput",
)({ platforms: S.optional(EnvironmentPlatforms) }) {}
export class TestReportSummary extends S.Class<TestReportSummary>(
  "TestReportSummary",
)({
  total: S.Number,
  statusCounts: ReportStatusCounts,
  durationInNanoSeconds: S.Number,
}) {}
export class Report extends S.Class<Report>("Report")({
  arn: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  reportGroupArn: S.optional(S.String),
  executionId: S.optional(S.String),
  status: S.optional(S.String),
  created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  expired: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  exportConfig: S.optional(ReportExportConfig),
  truncated: S.optional(S.Boolean),
  testSummary: S.optional(TestReportSummary),
  codeCoverageSummary: S.optional(CodeCoverageReportSummary),
}) {}
export const Reports = S.Array(Report);
export const Sandboxes = S.Array(Sandbox);
export class BatchGetReportsOutput extends S.Class<BatchGetReportsOutput>(
  "BatchGetReportsOutput",
)({ reports: S.optional(Reports), reportsNotFound: S.optional(ReportArns) }) {}
export class BatchGetSandboxesOutput extends S.Class<BatchGetSandboxesOutput>(
  "BatchGetSandboxesOutput",
)({
  sandboxes: S.optional(Sandboxes),
  sandboxesNotFound: S.optional(SandboxIds),
}) {}
export class CreateProjectOutput extends S.Class<CreateProjectOutput>(
  "CreateProjectOutput",
)({ project: S.optional(Project) }) {}
export const BuildBatches = S.Array(BuildBatch);
export class BatchGetBuildBatchesOutput extends S.Class<BatchGetBuildBatchesOutput>(
  "BatchGetBuildBatchesOutput",
)({
  buildBatches: S.optional(BuildBatches),
  buildBatchesNotFound: S.optional(BuildBatchIds),
}) {}

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class AccountLimitExceededException extends S.TaggedError<AccountLimitExceededException>()(
  "AccountLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class AccountSuspendedException extends S.TaggedError<AccountSuspendedException>()(
  "AccountSuspendedException",
  { message: S.optional(S.String) },
) {}
export class OAuthProviderException extends S.TaggedError<OAuthProviderException>()(
  "OAuthProviderException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a compute fleet. When you delete a compute fleet, its builds are not deleted.
 */
export const deleteFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetInput,
  output: DeleteFleetOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets a list of build IDs, with each build ID representing a single build.
 */
export const listBuilds = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBuildsInput,
  output: ListBuildsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ids",
  } as const,
}));
/**
 * Gets a list of compute fleet names with each compute fleet name representing a single compute fleet.
 */
export const listFleets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFleetsInput,
  output: ListFleetsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of build project names, with each build project name representing a single
 * build project.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProjectsInput,
    output: ListProjectsOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "projects",
    } as const,
  }),
);
/**
 * Gets a list ARNs for the report groups in the current Amazon Web Services account.
 */
export const listReportGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportGroupsInput,
    output: ListReportGroupsOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reportGroups",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets a list of sandboxes.
 */
export const listSandboxes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSandboxesInput,
    output: ListSandboxesOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ids",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets a list of projects that are shared with other Amazon Web Services accounts or users.
 */
export const listSharedProjects = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSharedProjectsInput,
    output: ListSharedProjectsOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "projects",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets a list of report groups that are shared with other Amazon Web Services accounts or users.
 */
export const listSharedReportGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSharedReportGroupsInput,
    output: ListSharedReportGroupsOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reportGroups",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of `SourceCredentialsInfo` objects.
 */
export const listSourceCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSourceCredentialsInput,
    output: ListSourceCredentialsOutput,
    errors: [InvalidInputException],
  }),
);
/**
 * Deletes a build project. When you delete a project, its builds are not deleted.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectInput,
  output: DeleteProjectOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a report.
 */
export const deleteReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportInput,
  output: DeleteReportOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a report group. Before you delete a report group, you must delete its reports.
 */
export const deleteReportGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportGroupInput,
  output: DeleteReportGroupOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a resource policy that is identified by its resource ARN.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyInput,
    output: DeleteResourcePolicyOutput,
    errors: [InvalidInputException],
  }),
);
/**
 * Deletes a batch build.
 */
export const deleteBuildBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBuildBatchInput,
  output: DeleteBuildBatchOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes one or more builds.
 */
export const batchDeleteBuilds = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteBuildsInput,
  output: BatchDeleteBuildsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about the command executions.
 */
export const batchGetCommandExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetCommandExecutionsInput,
    output: BatchGetCommandExecutionsOutput,
    errors: [InvalidInputException],
  }),
);
/**
 * Returns an array of report groups.
 */
export const batchGetReportGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetReportGroupsInput,
    output: BatchGetReportGroupsOutput,
    errors: [InvalidInputException],
  }),
);
/**
 * Deletes a set of GitHub, GitHub Enterprise, or Bitbucket source credentials.
 */
export const deleteSourceCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSourceCredentialsInput,
    output: DeleteSourceCredentialsOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Retrieves one or more code coverage reports.
 */
export const describeCodeCoverages =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeCodeCoveragesInput,
    output: DescribeCodeCoveragesOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "codeCoverages",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Analyzes and accumulates test report values for the specified test reports.
 */
export const getReportGroupTrend = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportGroupTrendInput,
  output: GetReportGroupTrendOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Retrieves the identifiers of your build batches in the current region.
 */
export const listBuildBatches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBuildBatchesInput,
    output: ListBuildBatchesOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ids",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of ARNs for the reports in the current Amazon Web Services account.
 */
export const listReports = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportsInput,
    output: ListReportsOutput,
    errors: [InvalidInputException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reports",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Starts running a build with the settings defined in the project. These setting include: how to run a build,
 * where to get the source code, which build environment to use, which build commands to run, and where to store the build output.
 *
 * You can also start a build run by overriding some of the build settings in the project. The overrides only apply for that
 * specific start build request. The settings in the project are unaltered.
 */
export const startBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBuildInput,
  output: StartBuildOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a sandbox.
 */
export const startSandbox = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSandboxInput,
  output: StartSandboxOutput,
  errors: [
    AccountSuspendedException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a sandbox connection.
 */
export const startSandboxConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartSandboxConnectionInput,
    output: StartSandboxConnectionOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * For an existing CodeBuild build project that has its source code stored in a GitHub or
 * Bitbucket repository, stops CodeBuild from rebuilding the source code every time a code
 * change is pushed to the repository.
 */
export const deleteWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebhookInput,
  output: DeleteWebhookOutput,
  errors: [
    InvalidInputException,
    OAuthProviderException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets a resource policy that is identified by its resource ARN.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Retrieves the identifiers of the build batches for a specific project.
 */
export const listBuildBatchesForProject =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBuildBatchesForProjectInput,
    output: ListBuildBatchesForProjectOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ids",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a list of build identifiers for the specified build project, with each build
 * identifier representing a single build.
 */
export const listBuildsForProject =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBuildsForProjectInput,
    output: ListBuildsForProjectOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ids",
    } as const,
  }));
/**
 * Gets a list of command executions for a sandbox.
 */
export const listCommandExecutionsForSandbox =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCommandExecutionsForSandboxInput,
    output: ListCommandExecutionsForSandboxOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "commandExecutions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of ARNs for the reports that belong to a `ReportGroup`.
 */
export const listReportsForReportGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReportsForReportGroupInput,
    output: ListReportsForReportGroupOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reports",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a list of sandboxes for a given project.
 */
export const listSandboxesForProject =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSandboxesForProjectInput,
    output: ListSandboxesForProjectOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "ids",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Stores a resource policy for the ARN of a `Project` or
 * `ReportGroup` object.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Restarts a failed batch build. Only batch builds that have failed can be retried.
 */
export const retryBuildBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryBuildBatchInput,
  output: RetryBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Starts a batch build for a project.
 */
export const startBuildBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBuildBatchInput,
  output: StartBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Starts a command execution.
 */
export const startCommandExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCommandExecutionInput,
    output: StartCommandExecutionOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Attempts to stop running a build.
 */
export const stopBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBuildInput,
  output: StopBuildOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Stops a running batch build.
 */
export const stopBuildBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBuildBatchInput,
  output: StopBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Stops a sandbox.
 */
export const stopSandbox = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSandboxInput,
  output: StopSandboxOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Changes the settings of a build project.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectInput,
  output: UpdateProjectOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Changes the public visibility for a project. The project's build results, logs, and
 * artifacts are available to the general public. For more information, see Public build
 * projects in the *CodeBuild User Guide*.
 *
 * The following should be kept in mind when making your projects public:
 *
 * - All of a project's build results, logs, and artifacts, including builds that were run
 * when the project was private, are available to the general public.
 *
 * - All build logs and artifacts are available to the public. Environment variables, source
 * code, and other sensitive information may have been output to the build logs and artifacts.
 * You must be careful about what information is output to the build logs. Some best practice
 * are:
 *
 * - Do not store sensitive values in environment variables. We recommend that you use an Amazon EC2 Systems Manager Parameter Store
 * or Secrets Manager to store sensitive values.
 *
 * - Follow Best
 * practices for using webhooks in the CodeBuild User
 * Guide to limit which entities can trigger a build, and do
 * not store the buildspec in the project itself, to ensure that your webhooks are as
 * secure as possible.
 *
 * - A malicious user can use public builds to distribute malicious artifacts. We recommend
 * that you review all pull requests to verify that the pull request is a legitimate change. We
 * also recommend that you validate any artifacts with their checksums to make sure that the
 * correct artifacts are being downloaded.
 */
export const updateProjectVisibility = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProjectVisibilityInput,
    output: UpdateProjectVisibilityOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Updates a report group.
 */
export const updateReportGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReportGroupInput,
  output: UpdateReportGroupOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Resets the cache for a project.
 */
export const invalidateProjectCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: InvalidateProjectCacheInput,
    output: InvalidateProjectCacheOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Restarts a build.
 */
export const retryBuild = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryBuildInput,
  output: RetryBuildOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a compute fleet.
 */
export const updateFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFleetInput,
  output: UpdateFleetOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the webhook associated with an CodeBuild build project.
 *
 * If you use Bitbucket for your repository, `rotateSecret` is ignored.
 */
export const updateWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebhookInput,
  output: UpdateWebhookOutput,
  errors: [
    InvalidInputException,
    OAuthProviderException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets information about one or more builds.
 */
export const batchGetBuilds = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetBuildsInput,
  output: BatchGetBuildsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about one or more compute fleets.
 */
export const batchGetFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetFleetsInput,
  output: BatchGetFleetsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about one or more build projects.
 */
export const batchGetProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetProjectsInput,
  output: BatchGetProjectsOutput,
  errors: [InvalidInputException],
}));
/**
 * Returns a list of details about test cases for a report.
 */
export const describeTestCases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeTestCasesInput,
    output: DescribeTestCasesOutput,
    errors: [InvalidInputException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "testCases",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Imports the source repository credentials for an CodeBuild project that has its
 * source code stored in a GitHub, GitHub Enterprise, GitLab, GitLab Self Managed, or Bitbucket repository.
 */
export const importSourceCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportSourceCredentialsInput,
    output: ImportSourceCredentialsOutput,
    errors: [
      AccountLimitExceededException,
      InvalidInputException,
      ResourceAlreadyExistsException,
    ],
  }),
);
/**
 * Gets information about Docker images that are managed by CodeBuild.
 */
export const listCuratedEnvironmentImages =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCuratedEnvironmentImagesInput,
    output: ListCuratedEnvironmentImagesOutput,
    errors: [],
  }));
/**
 * For an existing CodeBuild build project that has its source code stored in a GitHub or
 * Bitbucket repository, enables CodeBuild to start rebuilding the source code every time a
 * code change is pushed to the repository.
 *
 * If you enable webhooks for an CodeBuild project, and the project is used as a build
 * step in CodePipeline, then two identical builds are created for each commit. One build is
 * triggered through webhooks, and one through CodePipeline. Because billing is on a per-build
 * basis, you are billed for both builds. Therefore, if you are using CodePipeline, we
 * recommend that you disable webhooks in CodeBuild. In the CodeBuild console, clear the
 * Webhook box. For more information, see step 5 in Change a Build Project's Settings.
 */
export const createWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebhookInput,
  output: CreateWebhookOutput,
  errors: [
    InvalidInputException,
    OAuthProviderException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a compute fleet.
 */
export const createFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFleetInput,
  output: CreateFleetOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Creates a report group. A report group contains a collection of reports.
 */
export const createReportGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReportGroupInput,
  output: CreateReportGroupOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Returns an array of reports.
 */
export const batchGetReports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetReportsInput,
  output: BatchGetReportsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about the sandbox status.
 */
export const batchGetSandboxes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSandboxesInput,
  output: BatchGetSandboxesOutput,
  errors: [InvalidInputException],
}));
/**
 * Creates a build project.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectInput,
  output: CreateProjectOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Retrieves information about one or more batch builds.
 */
export const batchGetBuildBatches = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetBuildBatchesInput,
    output: BatchGetBuildBatchesOutput,
    errors: [InvalidInputException],
  }),
);
