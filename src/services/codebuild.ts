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
const svc = T.AwsApiService({
  sdkId: "CodeBuild",
  serviceShapeName: "CodeBuild_20161006",
});
const auth = T.AwsAuthSigv4({ name: "codebuild" });
const ver = T.ServiceVersion("2016-10-06");
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
              `https://codebuild-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://codebuild-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://codebuild.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://codebuild.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NonEmptyString = string;
export type FleetName = string;
export type FleetCapacity = number;
export type ProjectName = string;
export type ProjectDescription = string;
export type BuildTimeOut = number;
export type TimeOut = number;
export type WrapperInt = number;
export type ReportGroupName = string;
export type PageSize = number;
export type Percentage = number;
export type SensitiveNonEmptyString = string | Redacted.Redacted<string>;
export type SensitiveString = string | Redacted.Redacted<string>;
export type GitCloneDepth = number;
export type WrapperLong = number;
export type KeyInput = string;
export type ValueInput = string;
export type WrapperDouble = number;
export type NonNegativeInt = number;

//# Schemas
export interface ListCuratedEnvironmentImagesInput {}
export const ListCuratedEnvironmentImagesInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCuratedEnvironmentImagesInput",
}) as any as S.Schema<ListCuratedEnvironmentImagesInput>;
export interface ListSourceCredentialsInput {}
export const ListSourceCredentialsInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSourceCredentialsInput",
}) as any as S.Schema<ListSourceCredentialsInput>;
export type BuildIds = string[];
export const BuildIds = S.Array(S.String);
export type BuildBatchIds = string[];
export const BuildBatchIds = S.Array(S.String);
export type CommandExecutionIds = string[];
export const CommandExecutionIds = S.Array(S.String);
export type FleetNames = string[];
export const FleetNames = S.Array(S.String);
export type ProjectNames = string[];
export const ProjectNames = S.Array(S.String);
export type ReportGroupArns = string[];
export const ReportGroupArns = S.Array(S.String);
export type ReportArns = string[];
export const ReportArns = S.Array(S.String);
export type SandboxIds = string[];
export const SandboxIds = S.Array(S.String);
export interface GitSubmodulesConfig {
  fetchSubmodules: boolean;
}
export const GitSubmodulesConfig = S.suspend(() =>
  S.Struct({ fetchSubmodules: S.Boolean }),
).annotations({
  identifier: "GitSubmodulesConfig",
}) as any as S.Schema<GitSubmodulesConfig>;
export interface SourceAuth {
  type: string;
  resource?: string;
}
export const SourceAuth = S.suspend(() =>
  S.Struct({ type: S.String, resource: S.optional(S.String) }),
).annotations({ identifier: "SourceAuth" }) as any as S.Schema<SourceAuth>;
export interface BuildStatusConfig {
  context?: string;
  targetUrl?: string;
}
export const BuildStatusConfig = S.suspend(() =>
  S.Struct({ context: S.optional(S.String), targetUrl: S.optional(S.String) }),
).annotations({
  identifier: "BuildStatusConfig",
}) as any as S.Schema<BuildStatusConfig>;
export interface ProjectSource {
  type: string;
  location?: string;
  gitCloneDepth?: number;
  gitSubmodulesConfig?: GitSubmodulesConfig;
  buildspec?: string;
  auth?: SourceAuth;
  reportBuildStatus?: boolean;
  buildStatusConfig?: BuildStatusConfig;
  insecureSsl?: boolean;
  sourceIdentifier?: string;
}
export const ProjectSource = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ProjectSource",
}) as any as S.Schema<ProjectSource>;
export type ProjectSources = ProjectSource[];
export const ProjectSources = S.Array(ProjectSource);
export interface ProjectArtifacts {
  type: string;
  location?: string;
  path?: string;
  namespaceType?: string;
  name?: string;
  packaging?: string;
  overrideArtifactName?: boolean;
  encryptionDisabled?: boolean;
  artifactIdentifier?: string;
  bucketOwnerAccess?: string;
}
export const ProjectArtifacts = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ProjectArtifacts",
}) as any as S.Schema<ProjectArtifacts>;
export type ProjectArtifactsList = ProjectArtifacts[];
export const ProjectArtifactsList = S.Array(ProjectArtifacts);
export interface BatchDeleteBuildsInput {
  ids: BuildIds;
}
export const BatchDeleteBuildsInput = S.suspend(() =>
  S.Struct({ ids: BuildIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteBuildsInput",
}) as any as S.Schema<BatchDeleteBuildsInput>;
export interface BatchGetBuildBatchesInput {
  ids: BuildBatchIds;
}
export const BatchGetBuildBatchesInput = S.suspend(() =>
  S.Struct({ ids: BuildBatchIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetBuildBatchesInput",
}) as any as S.Schema<BatchGetBuildBatchesInput>;
export interface BatchGetBuildsInput {
  ids: BuildIds;
}
export const BatchGetBuildsInput = S.suspend(() =>
  S.Struct({ ids: BuildIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetBuildsInput",
}) as any as S.Schema<BatchGetBuildsInput>;
export interface BatchGetCommandExecutionsInput {
  sandboxId: string;
  commandExecutionIds: CommandExecutionIds;
}
export const BatchGetCommandExecutionsInput = S.suspend(() =>
  S.Struct({
    sandboxId: S.String,
    commandExecutionIds: CommandExecutionIds,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetCommandExecutionsInput",
}) as any as S.Schema<BatchGetCommandExecutionsInput>;
export interface BatchGetFleetsInput {
  names: FleetNames;
}
export const BatchGetFleetsInput = S.suspend(() =>
  S.Struct({ names: FleetNames }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetFleetsInput",
}) as any as S.Schema<BatchGetFleetsInput>;
export interface BatchGetProjectsInput {
  names: ProjectNames;
}
export const BatchGetProjectsInput = S.suspend(() =>
  S.Struct({ names: ProjectNames }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetProjectsInput",
}) as any as S.Schema<BatchGetProjectsInput>;
export interface BatchGetReportGroupsInput {
  reportGroupArns: ReportGroupArns;
}
export const BatchGetReportGroupsInput = S.suspend(() =>
  S.Struct({ reportGroupArns: ReportGroupArns }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetReportGroupsInput",
}) as any as S.Schema<BatchGetReportGroupsInput>;
export interface BatchGetReportsInput {
  reportArns: ReportArns;
}
export const BatchGetReportsInput = S.suspend(() =>
  S.Struct({ reportArns: ReportArns }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetReportsInput",
}) as any as S.Schema<BatchGetReportsInput>;
export interface BatchGetSandboxesInput {
  ids: SandboxIds;
}
export const BatchGetSandboxesInput = S.suspend(() =>
  S.Struct({ ids: SandboxIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetSandboxesInput",
}) as any as S.Schema<BatchGetSandboxesInput>;
export interface DeleteBuildBatchInput {
  id: string;
}
export const DeleteBuildBatchInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBuildBatchInput",
}) as any as S.Schema<DeleteBuildBatchInput>;
export interface DeleteFleetInput {
  arn: string;
}
export const DeleteFleetInput = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFleetInput",
}) as any as S.Schema<DeleteFleetInput>;
export interface DeleteFleetOutput {}
export const DeleteFleetOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFleetOutput",
}) as any as S.Schema<DeleteFleetOutput>;
export interface DeleteProjectInput {
  name: string;
}
export const DeleteProjectInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProjectInput",
}) as any as S.Schema<DeleteProjectInput>;
export interface DeleteProjectOutput {}
export const DeleteProjectOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProjectOutput",
}) as any as S.Schema<DeleteProjectOutput>;
export interface DeleteReportInput {
  arn: string;
}
export const DeleteReportInput = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteReportInput",
}) as any as S.Schema<DeleteReportInput>;
export interface DeleteReportOutput {}
export const DeleteReportOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteReportOutput",
}) as any as S.Schema<DeleteReportOutput>;
export interface DeleteReportGroupInput {
  arn: string;
  deleteReports?: boolean;
}
export const DeleteReportGroupInput = S.suspend(() =>
  S.Struct({ arn: S.String, deleteReports: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteReportGroupInput",
}) as any as S.Schema<DeleteReportGroupInput>;
export interface DeleteReportGroupOutput {}
export const DeleteReportGroupOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReportGroupOutput",
}) as any as S.Schema<DeleteReportGroupOutput>;
export interface DeleteResourcePolicyInput {
  resourceArn: string;
}
export const DeleteResourcePolicyInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyInput",
}) as any as S.Schema<DeleteResourcePolicyInput>;
export interface DeleteResourcePolicyOutput {}
export const DeleteResourcePolicyOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyOutput",
}) as any as S.Schema<DeleteResourcePolicyOutput>;
export interface DeleteSourceCredentialsInput {
  arn: string;
}
export const DeleteSourceCredentialsInput = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSourceCredentialsInput",
}) as any as S.Schema<DeleteSourceCredentialsInput>;
export interface DeleteWebhookInput {
  projectName: string;
}
export const DeleteWebhookInput = S.suspend(() =>
  S.Struct({ projectName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWebhookInput",
}) as any as S.Schema<DeleteWebhookInput>;
export interface DeleteWebhookOutput {}
export const DeleteWebhookOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteWebhookOutput",
}) as any as S.Schema<DeleteWebhookOutput>;
export interface DescribeCodeCoveragesInput {
  reportArn: string;
  nextToken?: string;
  maxResults?: number;
  sortOrder?: string;
  sortBy?: string;
  minLineCoveragePercentage?: number;
  maxLineCoveragePercentage?: number;
}
export const DescribeCodeCoveragesInput = S.suspend(() =>
  S.Struct({
    reportArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    minLineCoveragePercentage: S.optional(S.Number),
    maxLineCoveragePercentage: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCodeCoveragesInput",
}) as any as S.Schema<DescribeCodeCoveragesInput>;
export interface GetReportGroupTrendInput {
  reportGroupArn: string;
  numOfReports?: number;
  trendField: string;
}
export const GetReportGroupTrendInput = S.suspend(() =>
  S.Struct({
    reportGroupArn: S.String,
    numOfReports: S.optional(S.Number),
    trendField: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReportGroupTrendInput",
}) as any as S.Schema<GetReportGroupTrendInput>;
export interface GetResourcePolicyInput {
  resourceArn: string;
}
export const GetResourcePolicyInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyInput",
}) as any as S.Schema<GetResourcePolicyInput>;
export interface ImportSourceCredentialsInput {
  username?: string;
  token: string | Redacted.Redacted<string>;
  serverType: string;
  authType: string;
  shouldOverwrite?: boolean;
}
export const ImportSourceCredentialsInput = S.suspend(() =>
  S.Struct({
    username: S.optional(S.String),
    token: SensitiveString,
    serverType: S.String,
    authType: S.String,
    shouldOverwrite: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportSourceCredentialsInput",
}) as any as S.Schema<ImportSourceCredentialsInput>;
export interface InvalidateProjectCacheInput {
  projectName: string;
}
export const InvalidateProjectCacheInput = S.suspend(() =>
  S.Struct({ projectName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "InvalidateProjectCacheInput",
}) as any as S.Schema<InvalidateProjectCacheInput>;
export interface InvalidateProjectCacheOutput {}
export const InvalidateProjectCacheOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "InvalidateProjectCacheOutput",
}) as any as S.Schema<InvalidateProjectCacheOutput>;
export interface BuildBatchFilter {
  status?: string;
}
export const BuildBatchFilter = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "BuildBatchFilter",
}) as any as S.Schema<BuildBatchFilter>;
export interface ListBuildBatchesForProjectInput {
  projectName?: string;
  filter?: BuildBatchFilter;
  maxResults?: number;
  sortOrder?: string;
  nextToken?: string;
}
export const ListBuildBatchesForProjectInput = S.suspend(() =>
  S.Struct({
    projectName: S.optional(S.String),
    filter: S.optional(BuildBatchFilter),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBuildBatchesForProjectInput",
}) as any as S.Schema<ListBuildBatchesForProjectInput>;
export interface ListBuildsInput {
  sortOrder?: string;
  nextToken?: string;
}
export const ListBuildsInput = S.suspend(() =>
  S.Struct({
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBuildsInput",
}) as any as S.Schema<ListBuildsInput>;
export interface ListBuildsForProjectInput {
  projectName: string;
  sortOrder?: string;
  nextToken?: string;
}
export const ListBuildsForProjectInput = S.suspend(() =>
  S.Struct({
    projectName: S.String,
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBuildsForProjectInput",
}) as any as S.Schema<ListBuildsForProjectInput>;
export interface ListCommandExecutionsForSandboxInput {
  sandboxId: string;
  maxResults?: number;
  sortOrder?: string;
  nextToken?: string | Redacted.Redacted<string>;
}
export const ListCommandExecutionsForSandboxInput = S.suspend(() =>
  S.Struct({
    sandboxId: S.String,
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCommandExecutionsForSandboxInput",
}) as any as S.Schema<ListCommandExecutionsForSandboxInput>;
export interface ListFleetsInput {
  nextToken?: string | Redacted.Redacted<string>;
  maxResults?: number;
  sortOrder?: string;
  sortBy?: string;
}
export const ListFleetsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(SensitiveString),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFleetsInput",
}) as any as S.Schema<ListFleetsInput>;
export interface ListProjectsInput {
  sortBy?: string;
  sortOrder?: string;
  nextToken?: string;
}
export const ListProjectsInput = S.suspend(() =>
  S.Struct({
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProjectsInput",
}) as any as S.Schema<ListProjectsInput>;
export interface ListReportGroupsInput {
  sortOrder?: string;
  sortBy?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListReportGroupsInput = S.suspend(() =>
  S.Struct({
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListReportGroupsInput",
}) as any as S.Schema<ListReportGroupsInput>;
export interface ReportFilter {
  status?: string;
}
export const ReportFilter = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({ identifier: "ReportFilter" }) as any as S.Schema<ReportFilter>;
export interface ListReportsForReportGroupInput {
  reportGroupArn: string;
  nextToken?: string;
  sortOrder?: string;
  maxResults?: number;
  filter?: ReportFilter;
}
export const ListReportsForReportGroupInput = S.suspend(() =>
  S.Struct({
    reportGroupArn: S.String,
    nextToken: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(ReportFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListReportsForReportGroupInput",
}) as any as S.Schema<ListReportsForReportGroupInput>;
export interface ListSandboxesInput {
  maxResults?: number;
  sortOrder?: string;
  nextToken?: string;
}
export const ListSandboxesInput = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSandboxesInput",
}) as any as S.Schema<ListSandboxesInput>;
export interface ListSandboxesForProjectInput {
  projectName: string;
  maxResults?: number;
  sortOrder?: string;
  nextToken?: string | Redacted.Redacted<string>;
}
export const ListSandboxesForProjectInput = S.suspend(() =>
  S.Struct({
    projectName: S.String,
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSandboxesForProjectInput",
}) as any as S.Schema<ListSandboxesForProjectInput>;
export interface ListSharedProjectsInput {
  sortBy?: string;
  sortOrder?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSharedProjectsInput = S.suspend(() =>
  S.Struct({
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSharedProjectsInput",
}) as any as S.Schema<ListSharedProjectsInput>;
export interface ListSharedReportGroupsInput {
  sortOrder?: string;
  sortBy?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSharedReportGroupsInput = S.suspend(() =>
  S.Struct({
    sortOrder: S.optional(S.String),
    sortBy: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSharedReportGroupsInput",
}) as any as S.Schema<ListSharedReportGroupsInput>;
export interface PutResourcePolicyInput {
  policy: string;
  resourceArn: string;
}
export const PutResourcePolicyInput = S.suspend(() =>
  S.Struct({ policy: S.String, resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyInput",
}) as any as S.Schema<PutResourcePolicyInput>;
export interface RetryBuildInput {
  id?: string;
  idempotencyToken?: string;
}
export const RetryBuildInput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    idempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RetryBuildInput",
}) as any as S.Schema<RetryBuildInput>;
export interface RetryBuildBatchInput {
  id?: string;
  idempotencyToken?: string;
  retryType?: string;
}
export const RetryBuildBatchInput = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    idempotencyToken: S.optional(S.String),
    retryType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RetryBuildBatchInput",
}) as any as S.Schema<RetryBuildBatchInput>;
export interface ProjectSourceVersion {
  sourceIdentifier: string;
  sourceVersion: string;
}
export const ProjectSourceVersion = S.suspend(() =>
  S.Struct({ sourceIdentifier: S.String, sourceVersion: S.String }),
).annotations({
  identifier: "ProjectSourceVersion",
}) as any as S.Schema<ProjectSourceVersion>;
export type ProjectSecondarySourceVersions = ProjectSourceVersion[];
export const ProjectSecondarySourceVersions = S.Array(ProjectSourceVersion);
export interface EnvironmentVariable {
  name: string;
  value: string;
  type?: string;
}
export const EnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String, type: S.optional(S.String) }),
).annotations({
  identifier: "EnvironmentVariable",
}) as any as S.Schema<EnvironmentVariable>;
export type EnvironmentVariables = EnvironmentVariable[];
export const EnvironmentVariables = S.Array(EnvironmentVariable);
export type ProjectCacheModes = string[];
export const ProjectCacheModes = S.Array(S.String);
export interface ProjectCache {
  type: string;
  location?: string;
  modes?: ProjectCacheModes;
  cacheNamespace?: string;
}
export const ProjectCache = S.suspend(() =>
  S.Struct({
    type: S.String,
    location: S.optional(S.String),
    modes: S.optional(ProjectCacheModes),
    cacheNamespace: S.optional(S.String),
  }),
).annotations({ identifier: "ProjectCache" }) as any as S.Schema<ProjectCache>;
export interface CloudWatchLogsConfig {
  status: string;
  groupName?: string;
  streamName?: string;
}
export const CloudWatchLogsConfig = S.suspend(() =>
  S.Struct({
    status: S.String,
    groupName: S.optional(S.String),
    streamName: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchLogsConfig",
}) as any as S.Schema<CloudWatchLogsConfig>;
export interface S3LogsConfig {
  status: string;
  location?: string;
  encryptionDisabled?: boolean;
  bucketOwnerAccess?: string;
}
export const S3LogsConfig = S.suspend(() =>
  S.Struct({
    status: S.String,
    location: S.optional(S.String),
    encryptionDisabled: S.optional(S.Boolean),
    bucketOwnerAccess: S.optional(S.String),
  }),
).annotations({ identifier: "S3LogsConfig" }) as any as S.Schema<S3LogsConfig>;
export interface LogsConfig {
  cloudWatchLogs?: CloudWatchLogsConfig;
  s3Logs?: S3LogsConfig;
}
export const LogsConfig = S.suspend(() =>
  S.Struct({
    cloudWatchLogs: S.optional(CloudWatchLogsConfig),
    s3Logs: S.optional(S3LogsConfig),
  }),
).annotations({ identifier: "LogsConfig" }) as any as S.Schema<LogsConfig>;
export interface RegistryCredential {
  credential: string;
  credentialProvider: string;
}
export const RegistryCredential = S.suspend(() =>
  S.Struct({ credential: S.String, credentialProvider: S.String }),
).annotations({
  identifier: "RegistryCredential",
}) as any as S.Schema<RegistryCredential>;
export type ComputeTypesAllowed = string[];
export const ComputeTypesAllowed = S.Array(S.String);
export type FleetsAllowed = string[];
export const FleetsAllowed = S.Array(S.String);
export interface BatchRestrictions {
  maximumBuildsAllowed?: number;
  computeTypesAllowed?: ComputeTypesAllowed;
  fleetsAllowed?: FleetsAllowed;
}
export const BatchRestrictions = S.suspend(() =>
  S.Struct({
    maximumBuildsAllowed: S.optional(S.Number),
    computeTypesAllowed: S.optional(ComputeTypesAllowed),
    fleetsAllowed: S.optional(FleetsAllowed),
  }),
).annotations({
  identifier: "BatchRestrictions",
}) as any as S.Schema<BatchRestrictions>;
export interface ProjectBuildBatchConfig {
  serviceRole?: string;
  combineArtifacts?: boolean;
  restrictions?: BatchRestrictions;
  timeoutInMins?: number;
  batchReportMode?: string;
}
export const ProjectBuildBatchConfig = S.suspend(() =>
  S.Struct({
    serviceRole: S.optional(S.String),
    combineArtifacts: S.optional(S.Boolean),
    restrictions: S.optional(BatchRestrictions),
    timeoutInMins: S.optional(S.Number),
    batchReportMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectBuildBatchConfig",
}) as any as S.Schema<ProjectBuildBatchConfig>;
export interface StartBuildBatchInput {
  projectName: string;
  secondarySourcesOverride?: ProjectSources;
  secondarySourcesVersionOverride?: ProjectSecondarySourceVersions;
  sourceVersion?: string;
  artifactsOverride?: ProjectArtifacts;
  secondaryArtifactsOverride?: ProjectArtifactsList;
  environmentVariablesOverride?: EnvironmentVariables;
  sourceTypeOverride?: string;
  sourceLocationOverride?: string;
  sourceAuthOverride?: SourceAuth;
  gitCloneDepthOverride?: number;
  gitSubmodulesConfigOverride?: GitSubmodulesConfig;
  buildspecOverride?: string;
  insecureSslOverride?: boolean;
  reportBuildBatchStatusOverride?: boolean;
  environmentTypeOverride?: string;
  imageOverride?: string;
  computeTypeOverride?: string;
  certificateOverride?: string;
  cacheOverride?: ProjectCache;
  serviceRoleOverride?: string;
  privilegedModeOverride?: boolean;
  buildTimeoutInMinutesOverride?: number;
  queuedTimeoutInMinutesOverride?: number;
  encryptionKeyOverride?: string;
  idempotencyToken?: string;
  logsConfigOverride?: LogsConfig;
  registryCredentialOverride?: RegistryCredential;
  imagePullCredentialsTypeOverride?: string;
  buildBatchConfigOverride?: ProjectBuildBatchConfig;
  debugSessionEnabled?: boolean;
}
export const StartBuildBatchInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartBuildBatchInput",
}) as any as S.Schema<StartBuildBatchInput>;
export interface StartCommandExecutionInput {
  sandboxId: string;
  command: string | Redacted.Redacted<string>;
  type?: string;
}
export const StartCommandExecutionInput = S.suspend(() =>
  S.Struct({
    sandboxId: S.String,
    command: SensitiveString,
    type: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCommandExecutionInput",
}) as any as S.Schema<StartCommandExecutionInput>;
export interface StartSandboxInput {
  projectName?: string;
  idempotencyToken?: string | Redacted.Redacted<string>;
}
export const StartSandboxInput = S.suspend(() =>
  S.Struct({
    projectName: S.optional(S.String),
    idempotencyToken: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSandboxInput",
}) as any as S.Schema<StartSandboxInput>;
export interface StartSandboxConnectionInput {
  sandboxId: string;
}
export const StartSandboxConnectionInput = S.suspend(() =>
  S.Struct({ sandboxId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSandboxConnectionInput",
}) as any as S.Schema<StartSandboxConnectionInput>;
export interface StopBuildInput {
  id: string;
}
export const StopBuildInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopBuildInput",
}) as any as S.Schema<StopBuildInput>;
export interface StopBuildBatchInput {
  id: string;
}
export const StopBuildBatchInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopBuildBatchInput",
}) as any as S.Schema<StopBuildBatchInput>;
export interface StopSandboxInput {
  id: string;
}
export const StopSandboxInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopSandboxInput",
}) as any as S.Schema<StopSandboxInput>;
export interface ComputeConfiguration {
  vCpu?: number;
  memory?: number;
  disk?: number;
  machineType?: string;
  instanceType?: string;
}
export const ComputeConfiguration = S.suspend(() =>
  S.Struct({
    vCpu: S.optional(S.Number),
    memory: S.optional(S.Number),
    disk: S.optional(S.Number),
    machineType: S.optional(S.String),
    instanceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeConfiguration",
}) as any as S.Schema<ComputeConfiguration>;
export interface TargetTrackingScalingConfiguration {
  metricType?: string;
  targetValue?: number;
}
export const TargetTrackingScalingConfiguration = S.suspend(() =>
  S.Struct({
    metricType: S.optional(S.String),
    targetValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "TargetTrackingScalingConfiguration",
}) as any as S.Schema<TargetTrackingScalingConfiguration>;
export type TargetTrackingScalingConfigurations =
  TargetTrackingScalingConfiguration[];
export const TargetTrackingScalingConfigurations = S.Array(
  TargetTrackingScalingConfiguration,
);
export interface ScalingConfigurationInput {
  scalingType?: string;
  targetTrackingScalingConfigs?: TargetTrackingScalingConfigurations;
  maxCapacity?: number;
}
export const ScalingConfigurationInput = S.suspend(() =>
  S.Struct({
    scalingType: S.optional(S.String),
    targetTrackingScalingConfigs: S.optional(
      TargetTrackingScalingConfigurations,
    ),
    maxCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScalingConfigurationInput",
}) as any as S.Schema<ScalingConfigurationInput>;
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfig {
  vpcId?: string;
  subnets?: Subnets;
  securityGroupIds?: SecurityGroupIds;
}
export const VpcConfig = S.suspend(() =>
  S.Struct({
    vpcId: S.optional(S.String),
    subnets: S.optional(Subnets),
    securityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export type FleetProxyRuleEntities = string[];
export const FleetProxyRuleEntities = S.Array(S.String);
export interface FleetProxyRule {
  type: string;
  effect: string;
  entities: FleetProxyRuleEntities;
}
export const FleetProxyRule = S.suspend(() =>
  S.Struct({
    type: S.String,
    effect: S.String,
    entities: FleetProxyRuleEntities,
  }),
).annotations({
  identifier: "FleetProxyRule",
}) as any as S.Schema<FleetProxyRule>;
export type FleetProxyRules = FleetProxyRule[];
export const FleetProxyRules = S.Array(FleetProxyRule);
export interface ProxyConfiguration {
  defaultBehavior?: string;
  orderedProxyRules?: FleetProxyRules;
}
export const ProxyConfiguration = S.suspend(() =>
  S.Struct({
    defaultBehavior: S.optional(S.String),
    orderedProxyRules: S.optional(FleetProxyRules),
  }),
).annotations({
  identifier: "ProxyConfiguration",
}) as any as S.Schema<ProxyConfiguration>;
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface UpdateFleetInput {
  arn: string;
  baseCapacity?: number;
  environmentType?: string;
  computeType?: string;
  computeConfiguration?: ComputeConfiguration;
  scalingConfiguration?: ScalingConfigurationInput;
  overflowBehavior?: string;
  vpcConfig?: VpcConfig;
  proxyConfiguration?: ProxyConfiguration;
  imageId?: string;
  fleetServiceRole?: string;
  tags?: TagList;
}
export const UpdateFleetInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFleetInput",
}) as any as S.Schema<UpdateFleetInput>;
export interface ProjectFleet {
  fleetArn?: string;
}
export const ProjectFleet = S.suspend(() =>
  S.Struct({ fleetArn: S.optional(S.String) }),
).annotations({ identifier: "ProjectFleet" }) as any as S.Schema<ProjectFleet>;
export interface DockerServerStatus {
  status?: string;
  message?: string;
}
export const DockerServerStatus = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "DockerServerStatus",
}) as any as S.Schema<DockerServerStatus>;
export interface DockerServer {
  computeType: string;
  securityGroupIds?: SecurityGroupIds;
  status?: DockerServerStatus;
}
export const DockerServer = S.suspend(() =>
  S.Struct({
    computeType: S.String,
    securityGroupIds: S.optional(SecurityGroupIds),
    status: S.optional(DockerServerStatus),
  }),
).annotations({ identifier: "DockerServer" }) as any as S.Schema<DockerServer>;
export interface ProjectEnvironment {
  type: string;
  image: string;
  computeType: string;
  computeConfiguration?: ComputeConfiguration;
  fleet?: ProjectFleet;
  environmentVariables?: EnvironmentVariables;
  privilegedMode?: boolean;
  certificate?: string;
  registryCredential?: RegistryCredential;
  imagePullCredentialsType?: string;
  dockerServer?: DockerServer;
}
export const ProjectEnvironment = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ProjectEnvironment",
}) as any as S.Schema<ProjectEnvironment>;
export interface ProjectFileSystemLocation {
  type?: string;
  location?: string;
  mountPoint?: string;
  identifier?: string;
  mountOptions?: string;
}
export const ProjectFileSystemLocation = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    location: S.optional(S.String),
    mountPoint: S.optional(S.String),
    identifier: S.optional(S.String),
    mountOptions: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectFileSystemLocation",
}) as any as S.Schema<ProjectFileSystemLocation>;
export type ProjectFileSystemLocations = ProjectFileSystemLocation[];
export const ProjectFileSystemLocations = S.Array(ProjectFileSystemLocation);
export interface UpdateProjectInput {
  name: string;
  description?: string;
  source?: ProjectSource;
  secondarySources?: ProjectSources;
  sourceVersion?: string;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  artifacts?: ProjectArtifacts;
  secondaryArtifacts?: ProjectArtifactsList;
  cache?: ProjectCache;
  environment?: ProjectEnvironment;
  serviceRole?: string;
  timeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  encryptionKey?: string;
  tags?: TagList;
  vpcConfig?: VpcConfig;
  badgeEnabled?: boolean;
  logsConfig?: LogsConfig;
  fileSystemLocations?: ProjectFileSystemLocations;
  buildBatchConfig?: ProjectBuildBatchConfig;
  concurrentBuildLimit?: number;
  autoRetryLimit?: number;
}
export const UpdateProjectInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProjectInput",
}) as any as S.Schema<UpdateProjectInput>;
export interface UpdateProjectVisibilityInput {
  projectArn: string;
  projectVisibility: string;
  resourceAccessRole?: string;
}
export const UpdateProjectVisibilityInput = S.suspend(() =>
  S.Struct({
    projectArn: S.String,
    projectVisibility: S.String,
    resourceAccessRole: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProjectVisibilityInput",
}) as any as S.Schema<UpdateProjectVisibilityInput>;
export interface S3ReportExportConfig {
  bucket?: string;
  bucketOwner?: string;
  path?: string;
  packaging?: string;
  encryptionKey?: string;
  encryptionDisabled?: boolean;
}
export const S3ReportExportConfig = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    bucketOwner: S.optional(S.String),
    path: S.optional(S.String),
    packaging: S.optional(S.String),
    encryptionKey: S.optional(S.String),
    encryptionDisabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "S3ReportExportConfig",
}) as any as S.Schema<S3ReportExportConfig>;
export interface ReportExportConfig {
  exportConfigType?: string;
  s3Destination?: S3ReportExportConfig;
}
export const ReportExportConfig = S.suspend(() =>
  S.Struct({
    exportConfigType: S.optional(S.String),
    s3Destination: S.optional(S3ReportExportConfig),
  }),
).annotations({
  identifier: "ReportExportConfig",
}) as any as S.Schema<ReportExportConfig>;
export interface UpdateReportGroupInput {
  arn: string;
  exportConfig?: ReportExportConfig;
  tags?: TagList;
}
export const UpdateReportGroupInput = S.suspend(() =>
  S.Struct({
    arn: S.String,
    exportConfig: S.optional(ReportExportConfig),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateReportGroupInput",
}) as any as S.Schema<UpdateReportGroupInput>;
export interface WebhookFilter {
  type: string;
  pattern: string;
  excludeMatchedPattern?: boolean;
}
export const WebhookFilter = S.suspend(() =>
  S.Struct({
    type: S.String,
    pattern: S.String,
    excludeMatchedPattern: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "WebhookFilter",
}) as any as S.Schema<WebhookFilter>;
export type FilterGroup = WebhookFilter[];
export const FilterGroup = S.Array(WebhookFilter);
export type FilterGroups = FilterGroup[];
export const FilterGroups = S.Array(FilterGroup);
export type PullRequestBuildApproverRoles = string[];
export const PullRequestBuildApproverRoles = S.Array(S.String);
export interface PullRequestBuildPolicy {
  requiresCommentApproval: string;
  approverRoles?: PullRequestBuildApproverRoles;
}
export const PullRequestBuildPolicy = S.suspend(() =>
  S.Struct({
    requiresCommentApproval: S.String,
    approverRoles: S.optional(PullRequestBuildApproverRoles),
  }),
).annotations({
  identifier: "PullRequestBuildPolicy",
}) as any as S.Schema<PullRequestBuildPolicy>;
export interface UpdateWebhookInput {
  projectName: string;
  branchFilter?: string;
  rotateSecret?: boolean;
  filterGroups?: FilterGroups;
  buildType?: string;
  pullRequestBuildPolicy?: PullRequestBuildPolicy;
}
export const UpdateWebhookInput = S.suspend(() =>
  S.Struct({
    projectName: S.String,
    branchFilter: S.optional(S.String),
    rotateSecret: S.optional(S.Boolean),
    filterGroups: S.optional(FilterGroups),
    buildType: S.optional(S.String),
    pullRequestBuildPolicy: S.optional(PullRequestBuildPolicy),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWebhookInput",
}) as any as S.Schema<UpdateWebhookInput>;
export interface ScopeConfiguration {
  name: string;
  domain?: string;
  scope: string;
}
export const ScopeConfiguration = S.suspend(() =>
  S.Struct({ name: S.String, domain: S.optional(S.String), scope: S.String }),
).annotations({
  identifier: "ScopeConfiguration",
}) as any as S.Schema<ScopeConfiguration>;
export interface TestCaseFilter {
  status?: string;
  keyword?: string;
}
export const TestCaseFilter = S.suspend(() =>
  S.Struct({ status: S.optional(S.String), keyword: S.optional(S.String) }),
).annotations({
  identifier: "TestCaseFilter",
}) as any as S.Schema<TestCaseFilter>;
export type FleetArns = string[];
export const FleetArns = S.Array(S.String);
export type ProjectArns = string[];
export const ProjectArns = S.Array(S.String);
export interface SourceCredentialsInfo {
  arn?: string;
  serverType?: string;
  authType?: string;
  resource?: string;
}
export const SourceCredentialsInfo = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    serverType: S.optional(S.String),
    authType: S.optional(S.String),
    resource: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceCredentialsInfo",
}) as any as S.Schema<SourceCredentialsInfo>;
export type SourceCredentialsInfos = SourceCredentialsInfo[];
export const SourceCredentialsInfos = S.Array(SourceCredentialsInfo);
export interface CreateWebhookInput {
  projectName: string;
  branchFilter?: string;
  filterGroups?: FilterGroups;
  buildType?: string;
  manualCreation?: boolean;
  scopeConfiguration?: ScopeConfiguration;
  pullRequestBuildPolicy?: PullRequestBuildPolicy;
}
export const CreateWebhookInput = S.suspend(() =>
  S.Struct({
    projectName: S.String,
    branchFilter: S.optional(S.String),
    filterGroups: S.optional(FilterGroups),
    buildType: S.optional(S.String),
    manualCreation: S.optional(S.Boolean),
    scopeConfiguration: S.optional(ScopeConfiguration),
    pullRequestBuildPolicy: S.optional(PullRequestBuildPolicy),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWebhookInput",
}) as any as S.Schema<CreateWebhookInput>;
export interface BuildNotDeleted {
  id?: string;
  statusCode?: string;
}
export const BuildNotDeleted = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), statusCode: S.optional(S.String) }),
).annotations({
  identifier: "BuildNotDeleted",
}) as any as S.Schema<BuildNotDeleted>;
export type BuildsNotDeleted = BuildNotDeleted[];
export const BuildsNotDeleted = S.Array(BuildNotDeleted);
export interface DeleteBuildBatchOutput {
  statusCode?: string;
  buildsDeleted?: BuildIds;
  buildsNotDeleted?: BuildsNotDeleted;
}
export const DeleteBuildBatchOutput = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.String),
    buildsDeleted: S.optional(BuildIds),
    buildsNotDeleted: S.optional(BuildsNotDeleted),
  }),
).annotations({
  identifier: "DeleteBuildBatchOutput",
}) as any as S.Schema<DeleteBuildBatchOutput>;
export interface DeleteSourceCredentialsOutput {
  arn?: string;
}
export const DeleteSourceCredentialsOutput = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteSourceCredentialsOutput",
}) as any as S.Schema<DeleteSourceCredentialsOutput>;
export interface DescribeTestCasesInput {
  reportArn: string;
  nextToken?: string;
  maxResults?: number;
  filter?: TestCaseFilter;
}
export const DescribeTestCasesInput = S.suspend(() =>
  S.Struct({
    reportArn: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(TestCaseFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTestCasesInput",
}) as any as S.Schema<DescribeTestCasesInput>;
export interface GetResourcePolicyOutput {
  policy?: string;
}
export const GetResourcePolicyOutput = S.suspend(() =>
  S.Struct({ policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyOutput",
}) as any as S.Schema<GetResourcePolicyOutput>;
export interface ImportSourceCredentialsOutput {
  arn?: string;
}
export const ImportSourceCredentialsOutput = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
).annotations({
  identifier: "ImportSourceCredentialsOutput",
}) as any as S.Schema<ImportSourceCredentialsOutput>;
export interface ListBuildBatchesInput {
  filter?: BuildBatchFilter;
  maxResults?: number;
  sortOrder?: string;
  nextToken?: string;
}
export const ListBuildBatchesInput = S.suspend(() =>
  S.Struct({
    filter: S.optional(BuildBatchFilter),
    maxResults: S.optional(S.Number),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBuildBatchesInput",
}) as any as S.Schema<ListBuildBatchesInput>;
export interface ListBuildBatchesForProjectOutput {
  ids?: BuildBatchIds;
  nextToken?: string;
}
export const ListBuildBatchesForProjectOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(BuildBatchIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBuildBatchesForProjectOutput",
}) as any as S.Schema<ListBuildBatchesForProjectOutput>;
export interface ListBuildsOutput {
  ids?: BuildIds;
  nextToken?: string;
}
export const ListBuildsOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(BuildIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBuildsOutput",
}) as any as S.Schema<ListBuildsOutput>;
export interface ListBuildsForProjectOutput {
  ids?: BuildIds;
  nextToken?: string;
}
export const ListBuildsForProjectOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(BuildIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBuildsForProjectOutput",
}) as any as S.Schema<ListBuildsForProjectOutput>;
export interface LogsLocation {
  groupName?: string;
  streamName?: string;
  deepLink?: string;
  s3DeepLink?: string;
  cloudWatchLogsArn?: string;
  s3LogsArn?: string;
  cloudWatchLogs?: CloudWatchLogsConfig;
  s3Logs?: S3LogsConfig;
}
export const LogsLocation = S.suspend(() =>
  S.Struct({
    groupName: S.optional(S.String),
    streamName: S.optional(S.String),
    deepLink: S.optional(S.String),
    s3DeepLink: S.optional(S.String),
    cloudWatchLogsArn: S.optional(S.String),
    s3LogsArn: S.optional(S.String),
    cloudWatchLogs: S.optional(CloudWatchLogsConfig),
    s3Logs: S.optional(S3LogsConfig),
  }),
).annotations({ identifier: "LogsLocation" }) as any as S.Schema<LogsLocation>;
export interface CommandExecution {
  id?: string;
  sandboxId?: string;
  submitTime?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  command?: string | Redacted.Redacted<string>;
  type?: string;
  exitCode?: string;
  standardOutputContent?: string | Redacted.Redacted<string>;
  standardErrContent?: string | Redacted.Redacted<string>;
  logs?: LogsLocation;
  sandboxArn?: string;
}
export const CommandExecution = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    sandboxId: S.optional(S.String),
    submitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    command: S.optional(SensitiveString),
    type: S.optional(S.String),
    exitCode: S.optional(S.String),
    standardOutputContent: S.optional(SensitiveString),
    standardErrContent: S.optional(SensitiveString),
    logs: S.optional(LogsLocation),
    sandboxArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CommandExecution",
}) as any as S.Schema<CommandExecution>;
export type CommandExecutions = CommandExecution[];
export const CommandExecutions = S.Array(CommandExecution);
export interface ListCommandExecutionsForSandboxOutput {
  commandExecutions?: CommandExecutions;
  nextToken?: string;
}
export const ListCommandExecutionsForSandboxOutput = S.suspend(() =>
  S.Struct({
    commandExecutions: S.optional(CommandExecutions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCommandExecutionsForSandboxOutput",
}) as any as S.Schema<ListCommandExecutionsForSandboxOutput>;
export interface ListFleetsOutput {
  nextToken?: string;
  fleets?: FleetArns;
}
export const ListFleetsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), fleets: S.optional(FleetArns) }),
).annotations({
  identifier: "ListFleetsOutput",
}) as any as S.Schema<ListFleetsOutput>;
export interface ListProjectsOutput {
  nextToken?: string;
  projects?: ProjectNames;
}
export const ListProjectsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    projects: S.optional(ProjectNames),
  }),
).annotations({
  identifier: "ListProjectsOutput",
}) as any as S.Schema<ListProjectsOutput>;
export interface ListReportGroupsOutput {
  nextToken?: string;
  reportGroups?: ReportGroupArns;
}
export const ListReportGroupsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    reportGroups: S.optional(ReportGroupArns),
  }),
).annotations({
  identifier: "ListReportGroupsOutput",
}) as any as S.Schema<ListReportGroupsOutput>;
export interface ListReportsInput {
  sortOrder?: string;
  nextToken?: string;
  maxResults?: number;
  filter?: ReportFilter;
}
export const ListReportsInput = S.suspend(() =>
  S.Struct({
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filter: S.optional(ReportFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListReportsInput",
}) as any as S.Schema<ListReportsInput>;
export interface ListReportsForReportGroupOutput {
  nextToken?: string;
  reports?: ReportArns;
}
export const ListReportsForReportGroupOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    reports: S.optional(ReportArns),
  }),
).annotations({
  identifier: "ListReportsForReportGroupOutput",
}) as any as S.Schema<ListReportsForReportGroupOutput>;
export interface ListSandboxesOutput {
  ids?: SandboxIds;
  nextToken?: string;
}
export const ListSandboxesOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(SandboxIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSandboxesOutput",
}) as any as S.Schema<ListSandboxesOutput>;
export interface ListSandboxesForProjectOutput {
  ids?: SandboxIds;
  nextToken?: string;
}
export const ListSandboxesForProjectOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(SandboxIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSandboxesForProjectOutput",
}) as any as S.Schema<ListSandboxesForProjectOutput>;
export interface ListSharedProjectsOutput {
  nextToken?: string;
  projects?: ProjectArns;
}
export const ListSharedProjectsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    projects: S.optional(ProjectArns),
  }),
).annotations({
  identifier: "ListSharedProjectsOutput",
}) as any as S.Schema<ListSharedProjectsOutput>;
export interface ListSharedReportGroupsOutput {
  nextToken?: string;
  reportGroups?: ReportGroupArns;
}
export const ListSharedReportGroupsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    reportGroups: S.optional(ReportGroupArns),
  }),
).annotations({
  identifier: "ListSharedReportGroupsOutput",
}) as any as S.Schema<ListSharedReportGroupsOutput>;
export interface ListSourceCredentialsOutput {
  sourceCredentialsInfos?: SourceCredentialsInfos;
}
export const ListSourceCredentialsOutput = S.suspend(() =>
  S.Struct({ sourceCredentialsInfos: S.optional(SourceCredentialsInfos) }),
).annotations({
  identifier: "ListSourceCredentialsOutput",
}) as any as S.Schema<ListSourceCredentialsOutput>;
export interface PutResourcePolicyOutput {
  resourceArn?: string;
}
export const PutResourcePolicyOutput = S.suspend(() =>
  S.Struct({ resourceArn: S.optional(S.String) }),
).annotations({
  identifier: "PutResourcePolicyOutput",
}) as any as S.Schema<PutResourcePolicyOutput>;
export interface PhaseContext {
  statusCode?: string;
  message?: string;
}
export const PhaseContext = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "PhaseContext" }) as any as S.Schema<PhaseContext>;
export type PhaseContexts = PhaseContext[];
export const PhaseContexts = S.Array(PhaseContext);
export interface BuildPhase {
  phaseType?: string;
  phaseStatus?: string;
  startTime?: Date;
  endTime?: Date;
  durationInSeconds?: number;
  contexts?: PhaseContexts;
}
export const BuildPhase = S.suspend(() =>
  S.Struct({
    phaseType: S.optional(S.String),
    phaseStatus: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    durationInSeconds: S.optional(S.Number),
    contexts: S.optional(PhaseContexts),
  }),
).annotations({ identifier: "BuildPhase" }) as any as S.Schema<BuildPhase>;
export type BuildPhases = BuildPhase[];
export const BuildPhases = S.Array(BuildPhase);
export interface BuildArtifacts {
  location?: string;
  sha256sum?: string;
  md5sum?: string;
  overrideArtifactName?: boolean;
  encryptionDisabled?: boolean;
  artifactIdentifier?: string;
  bucketOwnerAccess?: string;
}
export const BuildArtifacts = S.suspend(() =>
  S.Struct({
    location: S.optional(S.String),
    sha256sum: S.optional(S.String),
    md5sum: S.optional(S.String),
    overrideArtifactName: S.optional(S.Boolean),
    encryptionDisabled: S.optional(S.Boolean),
    artifactIdentifier: S.optional(S.String),
    bucketOwnerAccess: S.optional(S.String),
  }),
).annotations({
  identifier: "BuildArtifacts",
}) as any as S.Schema<BuildArtifacts>;
export type BuildArtifactsList = BuildArtifacts[];
export const BuildArtifactsList = S.Array(BuildArtifacts);
export interface NetworkInterface {
  subnetId?: string;
  networkInterfaceId?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    subnetId: S.optional(S.String),
    networkInterfaceId: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export interface ExportedEnvironmentVariable {
  name?: string;
  value?: string;
}
export const ExportedEnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "ExportedEnvironmentVariable",
}) as any as S.Schema<ExportedEnvironmentVariable>;
export type ExportedEnvironmentVariables = ExportedEnvironmentVariable[];
export const ExportedEnvironmentVariables = S.Array(
  ExportedEnvironmentVariable,
);
export type BuildReportArns = string[];
export const BuildReportArns = S.Array(S.String);
export interface DebugSession {
  sessionEnabled?: boolean;
  sessionTarget?: string;
}
export const DebugSession = S.suspend(() =>
  S.Struct({
    sessionEnabled: S.optional(S.Boolean),
    sessionTarget: S.optional(S.String),
  }),
).annotations({ identifier: "DebugSession" }) as any as S.Schema<DebugSession>;
export interface AutoRetryConfig {
  autoRetryLimit?: number;
  autoRetryNumber?: number;
  nextAutoRetry?: string;
  previousAutoRetry?: string;
}
export const AutoRetryConfig = S.suspend(() =>
  S.Struct({
    autoRetryLimit: S.optional(S.Number),
    autoRetryNumber: S.optional(S.Number),
    nextAutoRetry: S.optional(S.String),
    previousAutoRetry: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoRetryConfig",
}) as any as S.Schema<AutoRetryConfig>;
export interface Build {
  id?: string;
  arn?: string;
  buildNumber?: number;
  startTime?: Date;
  endTime?: Date;
  currentPhase?: string;
  buildStatus?: string;
  sourceVersion?: string;
  resolvedSourceVersion?: string;
  projectName?: string;
  phases?: BuildPhases;
  source?: ProjectSource;
  secondarySources?: ProjectSources;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  artifacts?: BuildArtifacts;
  secondaryArtifacts?: BuildArtifactsList;
  cache?: ProjectCache;
  environment?: ProjectEnvironment;
  serviceRole?: string;
  logs?: LogsLocation;
  timeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  buildComplete?: boolean;
  initiator?: string;
  vpcConfig?: VpcConfig;
  networkInterface?: NetworkInterface;
  encryptionKey?: string;
  exportedEnvironmentVariables?: ExportedEnvironmentVariables;
  reportArns?: BuildReportArns;
  fileSystemLocations?: ProjectFileSystemLocations;
  debugSession?: DebugSession;
  buildBatchArn?: string;
  autoRetryConfig?: AutoRetryConfig;
}
export const Build = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Build" }) as any as S.Schema<Build>;
export interface RetryBuildOutput {
  build?: Build;
}
export const RetryBuildOutput = S.suspend(() =>
  S.Struct({ build: S.optional(Build) }),
).annotations({
  identifier: "RetryBuildOutput",
}) as any as S.Schema<RetryBuildOutput>;
export interface BuildBatchPhase {
  phaseType?: string;
  phaseStatus?: string;
  startTime?: Date;
  endTime?: Date;
  durationInSeconds?: number;
  contexts?: PhaseContexts;
}
export const BuildBatchPhase = S.suspend(() =>
  S.Struct({
    phaseType: S.optional(S.String),
    phaseStatus: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    durationInSeconds: S.optional(S.Number),
    contexts: S.optional(PhaseContexts),
  }),
).annotations({
  identifier: "BuildBatchPhase",
}) as any as S.Schema<BuildBatchPhase>;
export type BuildBatchPhases = BuildBatchPhase[];
export const BuildBatchPhases = S.Array(BuildBatchPhase);
export type Identifiers = string[];
export const Identifiers = S.Array(S.String);
export interface ResolvedArtifact {
  type?: string;
  location?: string;
  identifier?: string;
}
export const ResolvedArtifact = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    location: S.optional(S.String),
    identifier: S.optional(S.String),
  }),
).annotations({
  identifier: "ResolvedArtifact",
}) as any as S.Schema<ResolvedArtifact>;
export type ResolvedSecondaryArtifacts = ResolvedArtifact[];
export const ResolvedSecondaryArtifacts = S.Array(ResolvedArtifact);
export interface BuildSummary {
  arn?: string;
  requestedOn?: Date;
  buildStatus?: string;
  primaryArtifact?: ResolvedArtifact;
  secondaryArtifacts?: ResolvedSecondaryArtifacts;
}
export const BuildSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    requestedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    buildStatus: S.optional(S.String),
    primaryArtifact: S.optional(ResolvedArtifact),
    secondaryArtifacts: S.optional(ResolvedSecondaryArtifacts),
  }),
).annotations({ identifier: "BuildSummary" }) as any as S.Schema<BuildSummary>;
export type BuildSummaries = BuildSummary[];
export const BuildSummaries = S.Array(BuildSummary);
export interface BuildGroup {
  identifier?: string;
  dependsOn?: Identifiers;
  ignoreFailure?: boolean;
  currentBuildSummary?: BuildSummary;
  priorBuildSummaryList?: BuildSummaries;
}
export const BuildGroup = S.suspend(() =>
  S.Struct({
    identifier: S.optional(S.String),
    dependsOn: S.optional(Identifiers),
    ignoreFailure: S.optional(S.Boolean),
    currentBuildSummary: S.optional(BuildSummary),
    priorBuildSummaryList: S.optional(BuildSummaries),
  }),
).annotations({ identifier: "BuildGroup" }) as any as S.Schema<BuildGroup>;
export type BuildGroups = BuildGroup[];
export const BuildGroups = S.Array(BuildGroup);
export interface BuildBatch {
  id?: string;
  arn?: string;
  startTime?: Date;
  endTime?: Date;
  currentPhase?: string;
  buildBatchStatus?: string;
  sourceVersion?: string;
  resolvedSourceVersion?: string;
  projectName?: string;
  phases?: BuildBatchPhases;
  source?: ProjectSource;
  secondarySources?: ProjectSources;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  artifacts?: BuildArtifacts;
  secondaryArtifacts?: BuildArtifactsList;
  cache?: ProjectCache;
  environment?: ProjectEnvironment;
  serviceRole?: string;
  logConfig?: LogsConfig;
  buildTimeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  complete?: boolean;
  initiator?: string;
  vpcConfig?: VpcConfig;
  encryptionKey?: string;
  buildBatchNumber?: number;
  fileSystemLocations?: ProjectFileSystemLocations;
  buildBatchConfig?: ProjectBuildBatchConfig;
  buildGroups?: BuildGroups;
  debugSessionEnabled?: boolean;
  reportArns?: BuildReportArns;
}
export const BuildBatch = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "BuildBatch" }) as any as S.Schema<BuildBatch>;
export interface RetryBuildBatchOutput {
  buildBatch?: BuildBatch;
}
export const RetryBuildBatchOutput = S.suspend(() =>
  S.Struct({ buildBatch: S.optional(BuildBatch) }),
).annotations({
  identifier: "RetryBuildBatchOutput",
}) as any as S.Schema<RetryBuildBatchOutput>;
export interface StartBuildInput {
  projectName: string;
  secondarySourcesOverride?: ProjectSources;
  secondarySourcesVersionOverride?: ProjectSecondarySourceVersions;
  sourceVersion?: string;
  artifactsOverride?: ProjectArtifacts;
  secondaryArtifactsOverride?: ProjectArtifactsList;
  environmentVariablesOverride?: EnvironmentVariables;
  sourceTypeOverride?: string;
  sourceLocationOverride?: string;
  sourceAuthOverride?: SourceAuth;
  gitCloneDepthOverride?: number;
  gitSubmodulesConfigOverride?: GitSubmodulesConfig;
  buildspecOverride?: string;
  insecureSslOverride?: boolean;
  reportBuildStatusOverride?: boolean;
  buildStatusConfigOverride?: BuildStatusConfig;
  environmentTypeOverride?: string;
  imageOverride?: string;
  computeTypeOverride?: string;
  certificateOverride?: string;
  cacheOverride?: ProjectCache;
  serviceRoleOverride?: string;
  privilegedModeOverride?: boolean;
  timeoutInMinutesOverride?: number;
  queuedTimeoutInMinutesOverride?: number;
  encryptionKeyOverride?: string;
  idempotencyToken?: string;
  logsConfigOverride?: LogsConfig;
  registryCredentialOverride?: RegistryCredential;
  imagePullCredentialsTypeOverride?: string;
  debugSessionEnabled?: boolean;
  fleetOverride?: ProjectFleet;
  autoRetryLimitOverride?: number;
}
export const StartBuildInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartBuildInput",
}) as any as S.Schema<StartBuildInput>;
export interface StartBuildBatchOutput {
  buildBatch?: BuildBatch;
}
export const StartBuildBatchOutput = S.suspend(() =>
  S.Struct({ buildBatch: S.optional(BuildBatch) }),
).annotations({
  identifier: "StartBuildBatchOutput",
}) as any as S.Schema<StartBuildBatchOutput>;
export interface StartCommandExecutionOutput {
  commandExecution?: CommandExecution;
}
export const StartCommandExecutionOutput = S.suspend(() =>
  S.Struct({ commandExecution: S.optional(CommandExecution) }),
).annotations({
  identifier: "StartCommandExecutionOutput",
}) as any as S.Schema<StartCommandExecutionOutput>;
export interface SandboxSessionPhase {
  phaseType?: string;
  phaseStatus?: string;
  startTime?: Date;
  endTime?: Date;
  durationInSeconds?: number;
  contexts?: PhaseContexts;
}
export const SandboxSessionPhase = S.suspend(() =>
  S.Struct({
    phaseType: S.optional(S.String),
    phaseStatus: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    durationInSeconds: S.optional(S.Number),
    contexts: S.optional(PhaseContexts),
  }),
).annotations({
  identifier: "SandboxSessionPhase",
}) as any as S.Schema<SandboxSessionPhase>;
export type SandboxSessionPhases = SandboxSessionPhase[];
export const SandboxSessionPhases = S.Array(SandboxSessionPhase);
export interface SandboxSession {
  id?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  currentPhase?: string;
  phases?: SandboxSessionPhases;
  resolvedSourceVersion?: string;
  logs?: LogsLocation;
  networkInterface?: NetworkInterface;
}
export const SandboxSession = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    currentPhase: S.optional(S.String),
    phases: S.optional(SandboxSessionPhases),
    resolvedSourceVersion: S.optional(S.String),
    logs: S.optional(LogsLocation),
    networkInterface: S.optional(NetworkInterface),
  }),
).annotations({
  identifier: "SandboxSession",
}) as any as S.Schema<SandboxSession>;
export interface Sandbox {
  id?: string;
  arn?: string;
  projectName?: string;
  requestTime?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: string;
  source?: ProjectSource;
  sourceVersion?: string;
  secondarySources?: ProjectSources;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  environment?: ProjectEnvironment;
  fileSystemLocations?: ProjectFileSystemLocations;
  timeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  vpcConfig?: VpcConfig;
  logConfig?: LogsConfig;
  encryptionKey?: string;
  serviceRole?: string;
  currentSession?: SandboxSession;
}
export const Sandbox = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Sandbox" }) as any as S.Schema<Sandbox>;
export interface StartSandboxOutput {
  sandbox?: Sandbox;
}
export const StartSandboxOutput = S.suspend(() =>
  S.Struct({ sandbox: S.optional(Sandbox) }),
).annotations({
  identifier: "StartSandboxOutput",
}) as any as S.Schema<StartSandboxOutput>;
export interface StopBuildOutput {
  build?: Build;
}
export const StopBuildOutput = S.suspend(() =>
  S.Struct({ build: S.optional(Build) }),
).annotations({
  identifier: "StopBuildOutput",
}) as any as S.Schema<StopBuildOutput>;
export interface StopBuildBatchOutput {
  buildBatch?: BuildBatch;
}
export const StopBuildBatchOutput = S.suspend(() =>
  S.Struct({ buildBatch: S.optional(BuildBatch) }),
).annotations({
  identifier: "StopBuildBatchOutput",
}) as any as S.Schema<StopBuildBatchOutput>;
export interface StopSandboxOutput {
  sandbox?: Sandbox;
}
export const StopSandboxOutput = S.suspend(() =>
  S.Struct({ sandbox: S.optional(Sandbox) }),
).annotations({
  identifier: "StopSandboxOutput",
}) as any as S.Schema<StopSandboxOutput>;
export interface FleetStatus {
  statusCode?: string;
  context?: string;
  message?: string;
}
export const FleetStatus = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.String),
    context: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "FleetStatus" }) as any as S.Schema<FleetStatus>;
export interface ScalingConfigurationOutput {
  scalingType?: string;
  targetTrackingScalingConfigs?: TargetTrackingScalingConfigurations;
  maxCapacity?: number;
  desiredCapacity?: number;
}
export const ScalingConfigurationOutput = S.suspend(() =>
  S.Struct({
    scalingType: S.optional(S.String),
    targetTrackingScalingConfigs: S.optional(
      TargetTrackingScalingConfigurations,
    ),
    maxCapacity: S.optional(S.Number),
    desiredCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScalingConfigurationOutput",
}) as any as S.Schema<ScalingConfigurationOutput>;
export interface Fleet {
  arn?: string;
  name?: string;
  id?: string;
  created?: Date;
  lastModified?: Date;
  status?: FleetStatus;
  baseCapacity?: number;
  environmentType?: string;
  computeType?: string;
  computeConfiguration?: ComputeConfiguration;
  scalingConfiguration?: ScalingConfigurationOutput;
  overflowBehavior?: string;
  vpcConfig?: VpcConfig;
  proxyConfiguration?: ProxyConfiguration;
  imageId?: string;
  fleetServiceRole?: string;
  tags?: TagList;
}
export const Fleet = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Fleet" }) as any as S.Schema<Fleet>;
export interface UpdateFleetOutput {
  fleet?: Fleet;
}
export const UpdateFleetOutput = S.suspend(() =>
  S.Struct({ fleet: S.optional(Fleet) }),
).annotations({
  identifier: "UpdateFleetOutput",
}) as any as S.Schema<UpdateFleetOutput>;
export interface Webhook {
  url?: string;
  payloadUrl?: string;
  secret?: string;
  branchFilter?: string;
  filterGroups?: FilterGroups;
  buildType?: string;
  manualCreation?: boolean;
  lastModifiedSecret?: Date;
  scopeConfiguration?: ScopeConfiguration;
  status?: string;
  statusMessage?: string;
  pullRequestBuildPolicy?: PullRequestBuildPolicy;
}
export const Webhook = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Webhook" }) as any as S.Schema<Webhook>;
export interface ProjectBadge {
  badgeEnabled?: boolean;
  badgeRequestUrl?: string;
}
export const ProjectBadge = S.suspend(() =>
  S.Struct({
    badgeEnabled: S.optional(S.Boolean),
    badgeRequestUrl: S.optional(S.String),
  }),
).annotations({ identifier: "ProjectBadge" }) as any as S.Schema<ProjectBadge>;
export interface Project {
  name?: string;
  arn?: string;
  description?: string;
  source?: ProjectSource;
  secondarySources?: ProjectSources;
  sourceVersion?: string;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  artifacts?: ProjectArtifacts;
  secondaryArtifacts?: ProjectArtifactsList;
  cache?: ProjectCache;
  environment?: ProjectEnvironment;
  serviceRole?: string;
  timeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  encryptionKey?: string;
  tags?: TagList;
  created?: Date;
  lastModified?: Date;
  webhook?: Webhook;
  vpcConfig?: VpcConfig;
  badge?: ProjectBadge;
  logsConfig?: LogsConfig;
  fileSystemLocations?: ProjectFileSystemLocations;
  buildBatchConfig?: ProjectBuildBatchConfig;
  concurrentBuildLimit?: number;
  projectVisibility?: string;
  publicProjectAlias?: string;
  resourceAccessRole?: string;
  autoRetryLimit?: number;
}
export const Project = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export interface UpdateProjectOutput {
  project?: Project;
}
export const UpdateProjectOutput = S.suspend(() =>
  S.Struct({ project: S.optional(Project) }),
).annotations({
  identifier: "UpdateProjectOutput",
}) as any as S.Schema<UpdateProjectOutput>;
export interface UpdateProjectVisibilityOutput {
  projectArn?: string;
  publicProjectAlias?: string;
  projectVisibility?: string;
}
export const UpdateProjectVisibilityOutput = S.suspend(() =>
  S.Struct({
    projectArn: S.optional(S.String),
    publicProjectAlias: S.optional(S.String),
    projectVisibility: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProjectVisibilityOutput",
}) as any as S.Schema<UpdateProjectVisibilityOutput>;
export interface ReportGroup {
  arn?: string;
  name?: string;
  type?: string;
  exportConfig?: ReportExportConfig;
  created?: Date;
  lastModified?: Date;
  tags?: TagList;
  status?: string;
}
export const ReportGroup = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(S.String),
    type: S.optional(S.String),
    exportConfig: S.optional(ReportExportConfig),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(TagList),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "ReportGroup" }) as any as S.Schema<ReportGroup>;
export interface UpdateReportGroupOutput {
  reportGroup?: ReportGroup;
}
export const UpdateReportGroupOutput = S.suspend(() =>
  S.Struct({ reportGroup: S.optional(ReportGroup) }),
).annotations({
  identifier: "UpdateReportGroupOutput",
}) as any as S.Schema<UpdateReportGroupOutput>;
export type ImageVersions = string[];
export const ImageVersions = S.Array(S.String);
export type ReportGroups = ReportGroup[];
export const ReportGroups = S.Array(ReportGroup);
export interface CodeCoverage {
  id?: string;
  reportARN?: string;
  filePath?: string;
  lineCoveragePercentage?: number;
  linesCovered?: number;
  linesMissed?: number;
  branchCoveragePercentage?: number;
  branchesCovered?: number;
  branchesMissed?: number;
  expired?: Date;
}
export const CodeCoverage = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "CodeCoverage" }) as any as S.Schema<CodeCoverage>;
export type CodeCoverages = CodeCoverage[];
export const CodeCoverages = S.Array(CodeCoverage);
export interface ReportGroupTrendStats {
  average?: string;
  max?: string;
  min?: string;
}
export const ReportGroupTrendStats = S.suspend(() =>
  S.Struct({
    average: S.optional(S.String),
    max: S.optional(S.String),
    min: S.optional(S.String),
  }),
).annotations({
  identifier: "ReportGroupTrendStats",
}) as any as S.Schema<ReportGroupTrendStats>;
export interface ReportWithRawData {
  reportArn?: string;
  data?: string;
}
export const ReportWithRawData = S.suspend(() =>
  S.Struct({ reportArn: S.optional(S.String), data: S.optional(S.String) }),
).annotations({
  identifier: "ReportWithRawData",
}) as any as S.Schema<ReportWithRawData>;
export type ReportGroupTrendRawDataList = ReportWithRawData[];
export const ReportGroupTrendRawDataList = S.Array(ReportWithRawData);
export interface SSMSession {
  sessionId?: string;
  tokenValue?: string;
  streamUrl?: string;
}
export const SSMSession = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    tokenValue: S.optional(S.String),
    streamUrl: S.optional(S.String),
  }),
).annotations({ identifier: "SSMSession" }) as any as S.Schema<SSMSession>;
export interface EnvironmentImage {
  name?: string;
  description?: string;
  versions?: ImageVersions;
}
export const EnvironmentImage = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    versions: S.optional(ImageVersions),
  }),
).annotations({
  identifier: "EnvironmentImage",
}) as any as S.Schema<EnvironmentImage>;
export type EnvironmentImages = EnvironmentImage[];
export const EnvironmentImages = S.Array(EnvironmentImage);
export interface BatchDeleteBuildsOutput {
  buildsDeleted?: BuildIds;
  buildsNotDeleted?: BuildsNotDeleted;
}
export const BatchDeleteBuildsOutput = S.suspend(() =>
  S.Struct({
    buildsDeleted: S.optional(BuildIds),
    buildsNotDeleted: S.optional(BuildsNotDeleted),
  }),
).annotations({
  identifier: "BatchDeleteBuildsOutput",
}) as any as S.Schema<BatchDeleteBuildsOutput>;
export interface BatchGetCommandExecutionsOutput {
  commandExecutions?: CommandExecutions;
  commandExecutionsNotFound?: CommandExecutionIds;
}
export const BatchGetCommandExecutionsOutput = S.suspend(() =>
  S.Struct({
    commandExecutions: S.optional(CommandExecutions),
    commandExecutionsNotFound: S.optional(CommandExecutionIds),
  }),
).annotations({
  identifier: "BatchGetCommandExecutionsOutput",
}) as any as S.Schema<BatchGetCommandExecutionsOutput>;
export interface BatchGetReportGroupsOutput {
  reportGroups?: ReportGroups;
  reportGroupsNotFound?: ReportGroupArns;
}
export const BatchGetReportGroupsOutput = S.suspend(() =>
  S.Struct({
    reportGroups: S.optional(ReportGroups),
    reportGroupsNotFound: S.optional(ReportGroupArns),
  }),
).annotations({
  identifier: "BatchGetReportGroupsOutput",
}) as any as S.Schema<BatchGetReportGroupsOutput>;
export interface CreateFleetInput {
  name: string;
  baseCapacity: number;
  environmentType: string;
  computeType: string;
  computeConfiguration?: ComputeConfiguration;
  scalingConfiguration?: ScalingConfigurationInput;
  overflowBehavior?: string;
  vpcConfig?: VpcConfig;
  proxyConfiguration?: ProxyConfiguration;
  imageId?: string;
  fleetServiceRole?: string;
  tags?: TagList;
}
export const CreateFleetInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFleetInput",
}) as any as S.Schema<CreateFleetInput>;
export interface CreateReportGroupInput {
  name: string;
  type: string;
  exportConfig: ReportExportConfig;
  tags?: TagList;
}
export const CreateReportGroupInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    exportConfig: ReportExportConfig,
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateReportGroupInput",
}) as any as S.Schema<CreateReportGroupInput>;
export interface CreateWebhookOutput {
  webhook?: Webhook;
}
export const CreateWebhookOutput = S.suspend(() =>
  S.Struct({ webhook: S.optional(Webhook) }),
).annotations({
  identifier: "CreateWebhookOutput",
}) as any as S.Schema<CreateWebhookOutput>;
export interface DescribeCodeCoveragesOutput {
  nextToken?: string;
  codeCoverages?: CodeCoverages;
}
export const DescribeCodeCoveragesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    codeCoverages: S.optional(CodeCoverages),
  }),
).annotations({
  identifier: "DescribeCodeCoveragesOutput",
}) as any as S.Schema<DescribeCodeCoveragesOutput>;
export interface GetReportGroupTrendOutput {
  stats?: ReportGroupTrendStats;
  rawData?: ReportGroupTrendRawDataList;
}
export const GetReportGroupTrendOutput = S.suspend(() =>
  S.Struct({
    stats: S.optional(ReportGroupTrendStats),
    rawData: S.optional(ReportGroupTrendRawDataList),
  }),
).annotations({
  identifier: "GetReportGroupTrendOutput",
}) as any as S.Schema<GetReportGroupTrendOutput>;
export interface ListBuildBatchesOutput {
  ids?: BuildBatchIds;
  nextToken?: string;
}
export const ListBuildBatchesOutput = S.suspend(() =>
  S.Struct({ ids: S.optional(BuildBatchIds), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBuildBatchesOutput",
}) as any as S.Schema<ListBuildBatchesOutput>;
export interface ListReportsOutput {
  nextToken?: string;
  reports?: ReportArns;
}
export const ListReportsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    reports: S.optional(ReportArns),
  }),
).annotations({
  identifier: "ListReportsOutput",
}) as any as S.Schema<ListReportsOutput>;
export interface StartBuildOutput {
  build?: Build;
}
export const StartBuildOutput = S.suspend(() =>
  S.Struct({ build: S.optional(Build) }),
).annotations({
  identifier: "StartBuildOutput",
}) as any as S.Schema<StartBuildOutput>;
export interface StartSandboxConnectionOutput {
  ssmSession?: SSMSession;
}
export const StartSandboxConnectionOutput = S.suspend(() =>
  S.Struct({ ssmSession: S.optional(SSMSession) }),
).annotations({
  identifier: "StartSandboxConnectionOutput",
}) as any as S.Schema<StartSandboxConnectionOutput>;
export interface UpdateWebhookOutput {
  webhook?: Webhook;
}
export const UpdateWebhookOutput = S.suspend(() =>
  S.Struct({ webhook: S.optional(Webhook) }),
).annotations({
  identifier: "UpdateWebhookOutput",
}) as any as S.Schema<UpdateWebhookOutput>;
export interface CodeCoverageReportSummary {
  lineCoveragePercentage?: number;
  linesCovered?: number;
  linesMissed?: number;
  branchCoveragePercentage?: number;
  branchesCovered?: number;
  branchesMissed?: number;
}
export const CodeCoverageReportSummary = S.suspend(() =>
  S.Struct({
    lineCoveragePercentage: S.optional(S.Number),
    linesCovered: S.optional(S.Number),
    linesMissed: S.optional(S.Number),
    branchCoveragePercentage: S.optional(S.Number),
    branchesCovered: S.optional(S.Number),
    branchesMissed: S.optional(S.Number),
  }),
).annotations({
  identifier: "CodeCoverageReportSummary",
}) as any as S.Schema<CodeCoverageReportSummary>;
export interface EnvironmentLanguage {
  language?: string;
  images?: EnvironmentImages;
}
export const EnvironmentLanguage = S.suspend(() =>
  S.Struct({
    language: S.optional(S.String),
    images: S.optional(EnvironmentImages),
  }),
).annotations({
  identifier: "EnvironmentLanguage",
}) as any as S.Schema<EnvironmentLanguage>;
export type EnvironmentLanguages = EnvironmentLanguage[];
export const EnvironmentLanguages = S.Array(EnvironmentLanguage);
export type Builds = Build[];
export const Builds = S.Array(Build);
export type Fleets = Fleet[];
export const Fleets = S.Array(Fleet);
export type Projects = Project[];
export const Projects = S.Array(Project);
export interface TestCase {
  reportArn?: string;
  testRawDataPath?: string;
  prefix?: string;
  name?: string;
  status?: string;
  durationInNanoSeconds?: number;
  message?: string;
  expired?: Date;
  testSuiteName?: string;
}
export const TestCase = S.suspend(() =>
  S.Struct({
    reportArn: S.optional(S.String),
    testRawDataPath: S.optional(S.String),
    prefix: S.optional(S.String),
    name: S.optional(S.String),
    status: S.optional(S.String),
    durationInNanoSeconds: S.optional(S.Number),
    message: S.optional(S.String),
    expired: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    testSuiteName: S.optional(S.String),
  }),
).annotations({ identifier: "TestCase" }) as any as S.Schema<TestCase>;
export type TestCases = TestCase[];
export const TestCases = S.Array(TestCase);
export interface EnvironmentPlatform {
  platform?: string;
  languages?: EnvironmentLanguages;
}
export const EnvironmentPlatform = S.suspend(() =>
  S.Struct({
    platform: S.optional(S.String),
    languages: S.optional(EnvironmentLanguages),
  }),
).annotations({
  identifier: "EnvironmentPlatform",
}) as any as S.Schema<EnvironmentPlatform>;
export type EnvironmentPlatforms = EnvironmentPlatform[];
export const EnvironmentPlatforms = S.Array(EnvironmentPlatform);
export type ReportStatusCounts = { [key: string]: number };
export const ReportStatusCounts = S.Record({ key: S.String, value: S.Number });
export interface BatchGetBuildsOutput {
  builds?: Builds;
  buildsNotFound?: BuildIds;
}
export const BatchGetBuildsOutput = S.suspend(() =>
  S.Struct({
    builds: S.optional(Builds),
    buildsNotFound: S.optional(BuildIds),
  }),
).annotations({
  identifier: "BatchGetBuildsOutput",
}) as any as S.Schema<BatchGetBuildsOutput>;
export interface BatchGetFleetsOutput {
  fleets?: Fleets;
  fleetsNotFound?: FleetNames;
}
export const BatchGetFleetsOutput = S.suspend(() =>
  S.Struct({
    fleets: S.optional(Fleets),
    fleetsNotFound: S.optional(FleetNames),
  }),
).annotations({
  identifier: "BatchGetFleetsOutput",
}) as any as S.Schema<BatchGetFleetsOutput>;
export interface BatchGetProjectsOutput {
  projects?: Projects;
  projectsNotFound?: ProjectNames;
}
export const BatchGetProjectsOutput = S.suspend(() =>
  S.Struct({
    projects: S.optional(Projects),
    projectsNotFound: S.optional(ProjectNames),
  }),
).annotations({
  identifier: "BatchGetProjectsOutput",
}) as any as S.Schema<BatchGetProjectsOutput>;
export interface CreateFleetOutput {
  fleet?: Fleet;
}
export const CreateFleetOutput = S.suspend(() =>
  S.Struct({ fleet: S.optional(Fleet) }),
).annotations({
  identifier: "CreateFleetOutput",
}) as any as S.Schema<CreateFleetOutput>;
export interface CreateProjectInput {
  name: string;
  description?: string;
  source: ProjectSource;
  secondarySources?: ProjectSources;
  sourceVersion?: string;
  secondarySourceVersions?: ProjectSecondarySourceVersions;
  artifacts: ProjectArtifacts;
  secondaryArtifacts?: ProjectArtifactsList;
  cache?: ProjectCache;
  environment: ProjectEnvironment;
  serviceRole: string;
  timeoutInMinutes?: number;
  queuedTimeoutInMinutes?: number;
  encryptionKey?: string;
  tags?: TagList;
  vpcConfig?: VpcConfig;
  badgeEnabled?: boolean;
  logsConfig?: LogsConfig;
  fileSystemLocations?: ProjectFileSystemLocations;
  buildBatchConfig?: ProjectBuildBatchConfig;
  concurrentBuildLimit?: number;
  autoRetryLimit?: number;
}
export const CreateProjectInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProjectInput",
}) as any as S.Schema<CreateProjectInput>;
export interface CreateReportGroupOutput {
  reportGroup?: ReportGroup;
}
export const CreateReportGroupOutput = S.suspend(() =>
  S.Struct({ reportGroup: S.optional(ReportGroup) }),
).annotations({
  identifier: "CreateReportGroupOutput",
}) as any as S.Schema<CreateReportGroupOutput>;
export interface DescribeTestCasesOutput {
  nextToken?: string;
  testCases?: TestCases;
}
export const DescribeTestCasesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    testCases: S.optional(TestCases),
  }),
).annotations({
  identifier: "DescribeTestCasesOutput",
}) as any as S.Schema<DescribeTestCasesOutput>;
export interface ListCuratedEnvironmentImagesOutput {
  platforms?: EnvironmentPlatforms;
}
export const ListCuratedEnvironmentImagesOutput = S.suspend(() =>
  S.Struct({ platforms: S.optional(EnvironmentPlatforms) }),
).annotations({
  identifier: "ListCuratedEnvironmentImagesOutput",
}) as any as S.Schema<ListCuratedEnvironmentImagesOutput>;
export interface TestReportSummary {
  total: number;
  statusCounts: ReportStatusCounts;
  durationInNanoSeconds: number;
}
export const TestReportSummary = S.suspend(() =>
  S.Struct({
    total: S.Number,
    statusCounts: ReportStatusCounts,
    durationInNanoSeconds: S.Number,
  }),
).annotations({
  identifier: "TestReportSummary",
}) as any as S.Schema<TestReportSummary>;
export interface Report {
  arn?: string;
  type?: string;
  name?: string;
  reportGroupArn?: string;
  executionId?: string;
  status?: string;
  created?: Date;
  expired?: Date;
  exportConfig?: ReportExportConfig;
  truncated?: boolean;
  testSummary?: TestReportSummary;
  codeCoverageSummary?: CodeCoverageReportSummary;
}
export const Report = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Report" }) as any as S.Schema<Report>;
export type Reports = Report[];
export const Reports = S.Array(Report);
export type Sandboxes = Sandbox[];
export const Sandboxes = S.Array(Sandbox);
export interface BatchGetReportsOutput {
  reports?: Reports;
  reportsNotFound?: ReportArns;
}
export const BatchGetReportsOutput = S.suspend(() =>
  S.Struct({
    reports: S.optional(Reports),
    reportsNotFound: S.optional(ReportArns),
  }),
).annotations({
  identifier: "BatchGetReportsOutput",
}) as any as S.Schema<BatchGetReportsOutput>;
export interface BatchGetSandboxesOutput {
  sandboxes?: Sandboxes;
  sandboxesNotFound?: SandboxIds;
}
export const BatchGetSandboxesOutput = S.suspend(() =>
  S.Struct({
    sandboxes: S.optional(Sandboxes),
    sandboxesNotFound: S.optional(SandboxIds),
  }),
).annotations({
  identifier: "BatchGetSandboxesOutput",
}) as any as S.Schema<BatchGetSandboxesOutput>;
export interface CreateProjectOutput {
  project?: Project;
}
export const CreateProjectOutput = S.suspend(() =>
  S.Struct({ project: S.optional(Project) }),
).annotations({
  identifier: "CreateProjectOutput",
}) as any as S.Schema<CreateProjectOutput>;
export type BuildBatches = BuildBatch[];
export const BuildBatches = S.Array(BuildBatch);
export interface BatchGetBuildBatchesOutput {
  buildBatches?: BuildBatches;
  buildBatchesNotFound?: BuildBatchIds;
}
export const BatchGetBuildBatchesOutput = S.suspend(() =>
  S.Struct({
    buildBatches: S.optional(BuildBatches),
    buildBatchesNotFound: S.optional(BuildBatchIds),
  }),
).annotations({
  identifier: "BatchGetBuildBatchesOutput",
}) as any as S.Schema<BatchGetBuildBatchesOutput>;

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
export const deleteFleet: (
  input: DeleteFleetInput,
) => Effect.Effect<
  DeleteFleetOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFleetInput,
  output: DeleteFleetOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets a list of build IDs, with each build ID representing a single build.
 */
export const listBuilds: {
  (
    input: ListBuildsInput,
  ): Effect.Effect<
    ListBuildsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuildsInput,
  ) => Stream.Stream<
    ListBuildsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuildsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFleets: {
  (
    input: ListFleetsInput,
  ): Effect.Effect<
    ListFleetsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFleetsInput,
  ) => Stream.Stream<
    ListFleetsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFleetsInput,
  ) => Stream.Stream<
    unknown,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listProjects: {
  (
    input: ListProjectsInput,
  ): Effect.Effect<
    ListProjectsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsInput,
  ) => Stream.Stream<
    ListProjectsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsInput,
  output: ListProjectsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projects",
  } as const,
}));
/**
 * Gets a list ARNs for the report groups in the current Amazon Web Services account.
 */
export const listReportGroups: {
  (
    input: ListReportGroupsInput,
  ): Effect.Effect<
    ListReportGroupsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportGroupsInput,
  ) => Stream.Stream<
    ListReportGroupsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportGroupsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReportGroupsInput,
  output: ListReportGroupsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "reportGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of sandboxes.
 */
export const listSandboxes: {
  (
    input: ListSandboxesInput,
  ): Effect.Effect<
    ListSandboxesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSandboxesInput,
  ) => Stream.Stream<
    ListSandboxesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSandboxesInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSandboxesInput,
  output: ListSandboxesOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ids",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of projects that are shared with other Amazon Web Services accounts or users.
 */
export const listSharedProjects: {
  (
    input: ListSharedProjectsInput,
  ): Effect.Effect<
    ListSharedProjectsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSharedProjectsInput,
  ) => Stream.Stream<
    ListSharedProjectsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSharedProjectsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSharedProjectsInput,
  output: ListSharedProjectsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projects",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of report groups that are shared with other Amazon Web Services accounts or users.
 */
export const listSharedReportGroups: {
  (
    input: ListSharedReportGroupsInput,
  ): Effect.Effect<
    ListSharedReportGroupsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSharedReportGroupsInput,
  ) => Stream.Stream<
    ListSharedReportGroupsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSharedReportGroupsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSourceCredentials: (
  input: ListSourceCredentialsInput,
) => Effect.Effect<
  ListSourceCredentialsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSourceCredentialsInput,
  output: ListSourceCredentialsOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a build project. When you delete a project, its builds are not deleted.
 */
export const deleteProject: (
  input: DeleteProjectInput,
) => Effect.Effect<
  DeleteProjectOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectInput,
  output: DeleteProjectOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a report.
 */
export const deleteReport: (
  input: DeleteReportInput,
) => Effect.Effect<
  DeleteReportOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportInput,
  output: DeleteReportOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a report group. Before you delete a report group, you must delete its reports.
 */
export const deleteReportGroup: (
  input: DeleteReportGroupInput,
) => Effect.Effect<
  DeleteReportGroupOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportGroupInput,
  output: DeleteReportGroupOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a resource policy that is identified by its resource ARN.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyInput,
) => Effect.Effect<
  DeleteResourcePolicyOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyInput,
  output: DeleteResourcePolicyOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a batch build.
 */
export const deleteBuildBatch: (
  input: DeleteBuildBatchInput,
) => Effect.Effect<
  DeleteBuildBatchOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBuildBatchInput,
  output: DeleteBuildBatchOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes one or more builds.
 */
export const batchDeleteBuilds: (
  input: BatchDeleteBuildsInput,
) => Effect.Effect<
  BatchDeleteBuildsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteBuildsInput,
  output: BatchDeleteBuildsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about the command executions.
 */
export const batchGetCommandExecutions: (
  input: BatchGetCommandExecutionsInput,
) => Effect.Effect<
  BatchGetCommandExecutionsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCommandExecutionsInput,
  output: BatchGetCommandExecutionsOutput,
  errors: [InvalidInputException],
}));
/**
 * Returns an array of report groups.
 */
export const batchGetReportGroups: (
  input: BatchGetReportGroupsInput,
) => Effect.Effect<
  BatchGetReportGroupsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetReportGroupsInput,
  output: BatchGetReportGroupsOutput,
  errors: [InvalidInputException],
}));
/**
 * Deletes a set of GitHub, GitHub Enterprise, or Bitbucket source credentials.
 */
export const deleteSourceCredentials: (
  input: DeleteSourceCredentialsInput,
) => Effect.Effect<
  DeleteSourceCredentialsOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceCredentialsInput,
  output: DeleteSourceCredentialsOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Retrieves one or more code coverage reports.
 */
export const describeCodeCoverages: {
  (
    input: DescribeCodeCoveragesInput,
  ): Effect.Effect<
    DescribeCodeCoveragesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCodeCoveragesInput,
  ) => Stream.Stream<
    DescribeCodeCoveragesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCodeCoveragesInput,
  ) => Stream.Stream<
    CodeCoverage,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getReportGroupTrend: (
  input: GetReportGroupTrendInput,
) => Effect.Effect<
  GetReportGroupTrendOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportGroupTrendInput,
  output: GetReportGroupTrendOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Retrieves the identifiers of your build batches in the current region.
 */
export const listBuildBatches: {
  (
    input: ListBuildBatchesInput,
  ): Effect.Effect<
    ListBuildBatchesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuildBatchesInput,
  ) => Stream.Stream<
    ListBuildBatchesOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuildBatchesInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBuildBatchesInput,
  output: ListBuildBatchesOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ids",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of ARNs for the reports in the current Amazon Web Services account.
 */
export const listReports: {
  (
    input: ListReportsInput,
  ): Effect.Effect<
    ListReportsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportsInput,
  ) => Stream.Stream<
    ListReportsOutput,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportsInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReportsInput,
  output: ListReportsOutput,
  errors: [InvalidInputException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "reports",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts running a build with the settings defined in the project. These setting include: how to run a build,
 * where to get the source code, which build environment to use, which build commands to run, and where to store the build output.
 *
 * You can also start a build run by overriding some of the build settings in the project. The overrides only apply for that
 * specific start build request. The settings in the project are unaltered.
 */
export const startBuild: (
  input: StartBuildInput,
) => Effect.Effect<
  StartBuildOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSandbox: (
  input: StartSandboxInput,
) => Effect.Effect<
  StartSandboxOutput,
  | AccountSuspendedException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startSandboxConnection: (
  input: StartSandboxConnectionInput,
) => Effect.Effect<
  StartSandboxConnectionOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSandboxConnectionInput,
  output: StartSandboxConnectionOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * For an existing CodeBuild build project that has its source code stored in a GitHub or
 * Bitbucket repository, stops CodeBuild from rebuilding the source code every time a code
 * change is pushed to the repository.
 */
export const deleteWebhook: (
  input: DeleteWebhookInput,
) => Effect.Effect<
  DeleteWebhookOutput,
  | InvalidInputException
  | OAuthProviderException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicy: (
  input: GetResourcePolicyInput,
) => Effect.Effect<
  GetResourcePolicyOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Retrieves the identifiers of the build batches for a specific project.
 */
export const listBuildBatchesForProject: {
  (
    input: ListBuildBatchesForProjectInput,
  ): Effect.Effect<
    ListBuildBatchesForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuildBatchesForProjectInput,
  ) => Stream.Stream<
    ListBuildBatchesForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuildBatchesForProjectInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBuildsForProject: {
  (
    input: ListBuildsForProjectInput,
  ): Effect.Effect<
    ListBuildsForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBuildsForProjectInput,
  ) => Stream.Stream<
    ListBuildsForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBuildsForProjectInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listCommandExecutionsForSandbox: {
  (
    input: ListCommandExecutionsForSandboxInput,
  ): Effect.Effect<
    ListCommandExecutionsForSandboxOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommandExecutionsForSandboxInput,
  ) => Stream.Stream<
    ListCommandExecutionsForSandboxOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommandExecutionsForSandboxInput,
  ) => Stream.Stream<
    CommandExecution,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listReportsForReportGroup: {
  (
    input: ListReportsForReportGroupInput,
  ): Effect.Effect<
    ListReportsForReportGroupOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportsForReportGroupInput,
  ) => Stream.Stream<
    ListReportsForReportGroupOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportsForReportGroupInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSandboxesForProject: {
  (
    input: ListSandboxesForProjectInput,
  ): Effect.Effect<
    ListSandboxesForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSandboxesForProjectInput,
  ) => Stream.Stream<
    ListSandboxesForProjectOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSandboxesForProjectInput,
  ) => Stream.Stream<
    NonEmptyString,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putResourcePolicy: (
  input: PutResourcePolicyInput,
) => Effect.Effect<
  PutResourcePolicyOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyInput,
  output: PutResourcePolicyOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Restarts a failed batch build. Only batch builds that have failed can be retried.
 */
export const retryBuildBatch: (
  input: RetryBuildBatchInput,
) => Effect.Effect<
  RetryBuildBatchOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryBuildBatchInput,
  output: RetryBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Starts a batch build for a project.
 */
export const startBuildBatch: (
  input: StartBuildBatchInput,
) => Effect.Effect<
  StartBuildBatchOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBuildBatchInput,
  output: StartBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Starts a command execution.
 */
export const startCommandExecution: (
  input: StartCommandExecutionInput,
) => Effect.Effect<
  StartCommandExecutionOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCommandExecutionInput,
  output: StartCommandExecutionOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Attempts to stop running a build.
 */
export const stopBuild: (
  input: StopBuildInput,
) => Effect.Effect<
  StopBuildOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBuildInput,
  output: StopBuildOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Stops a running batch build.
 */
export const stopBuildBatch: (
  input: StopBuildBatchInput,
) => Effect.Effect<
  StopBuildBatchOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBuildBatchInput,
  output: StopBuildBatchOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Stops a sandbox.
 */
export const stopSandbox: (
  input: StopSandboxInput,
) => Effect.Effect<
  StopSandboxOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSandboxInput,
  output: StopSandboxOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Changes the settings of a build project.
 */
export const updateProject: (
  input: UpdateProjectInput,
) => Effect.Effect<
  UpdateProjectOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProjectVisibility: (
  input: UpdateProjectVisibilityInput,
) => Effect.Effect<
  UpdateProjectVisibilityOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectVisibilityInput,
  output: UpdateProjectVisibilityOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Updates a report group.
 */
export const updateReportGroup: (
  input: UpdateReportGroupInput,
) => Effect.Effect<
  UpdateReportGroupOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReportGroupInput,
  output: UpdateReportGroupOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Resets the cache for a project.
 */
export const invalidateProjectCache: (
  input: InvalidateProjectCacheInput,
) => Effect.Effect<
  InvalidateProjectCacheOutput,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvalidateProjectCacheInput,
  output: InvalidateProjectCacheOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Restarts a build.
 */
export const retryBuild: (
  input: RetryBuildInput,
) => Effect.Effect<
  RetryBuildOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFleet: (
  input: UpdateFleetInput,
) => Effect.Effect<
  UpdateFleetOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWebhook: (
  input: UpdateWebhookInput,
) => Effect.Effect<
  UpdateWebhookOutput,
  | InvalidInputException
  | OAuthProviderException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetBuilds: (
  input: BatchGetBuildsInput,
) => Effect.Effect<
  BatchGetBuildsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetBuildsInput,
  output: BatchGetBuildsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about one or more compute fleets.
 */
export const batchGetFleets: (
  input: BatchGetFleetsInput,
) => Effect.Effect<
  BatchGetFleetsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetFleetsInput,
  output: BatchGetFleetsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about one or more build projects.
 */
export const batchGetProjects: (
  input: BatchGetProjectsInput,
) => Effect.Effect<
  BatchGetProjectsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetProjectsInput,
  output: BatchGetProjectsOutput,
  errors: [InvalidInputException],
}));
/**
 * Returns a list of details about test cases for a report.
 */
export const describeTestCases: {
  (
    input: DescribeTestCasesInput,
  ): Effect.Effect<
    DescribeTestCasesOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTestCasesInput,
  ) => Stream.Stream<
    DescribeTestCasesOutput,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTestCasesInput,
  ) => Stream.Stream<
    TestCase,
    InvalidInputException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTestCasesInput,
  output: DescribeTestCasesOutput,
  errors: [InvalidInputException, ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "testCases",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Imports the source repository credentials for an CodeBuild project that has its
 * source code stored in a GitHub, GitHub Enterprise, GitLab, GitLab Self Managed, or Bitbucket repository.
 */
export const importSourceCredentials: (
  input: ImportSourceCredentialsInput,
) => Effect.Effect<
  ImportSourceCredentialsOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportSourceCredentialsInput,
  output: ImportSourceCredentialsOutput,
  errors: [
    AccountLimitExceededException,
    InvalidInputException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Gets information about Docker images that are managed by CodeBuild.
 */
export const listCuratedEnvironmentImages: (
  input: ListCuratedEnvironmentImagesInput,
) => Effect.Effect<
  ListCuratedEnvironmentImagesOutput,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWebhook: (
  input: CreateWebhookInput,
) => Effect.Effect<
  CreateWebhookOutput,
  | InvalidInputException
  | OAuthProviderException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFleet: (
  input: CreateFleetInput,
) => Effect.Effect<
  CreateFleetOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createReportGroup: (
  input: CreateReportGroupInput,
) => Effect.Effect<
  CreateReportGroupOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetReports: (
  input: BatchGetReportsInput,
) => Effect.Effect<
  BatchGetReportsOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetReportsInput,
  output: BatchGetReportsOutput,
  errors: [InvalidInputException],
}));
/**
 * Gets information about the sandbox status.
 */
export const batchGetSandboxes: (
  input: BatchGetSandboxesInput,
) => Effect.Effect<
  BatchGetSandboxesOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetSandboxesInput,
  output: BatchGetSandboxesOutput,
  errors: [InvalidInputException],
}));
/**
 * Creates a build project.
 */
export const createProject: (
  input: CreateProjectInput,
) => Effect.Effect<
  CreateProjectOutput,
  | AccountLimitExceededException
  | InvalidInputException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetBuildBatches: (
  input: BatchGetBuildBatchesInput,
) => Effect.Effect<
  BatchGetBuildBatchesOutput,
  InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetBuildBatchesInput,
  output: BatchGetBuildBatchesOutput,
  errors: [InvalidInputException],
}));
