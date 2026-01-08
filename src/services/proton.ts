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
  sdkId: "Proton",
  serviceShapeName: "AwsProton20200720",
});
const auth = T.AwsAuthSigv4({ name: "proton" });
const ver = T.ServiceVersion("2020-07-20");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://proton-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://proton-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://proton.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://proton.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceName = string;
export type RepositoryName = string;
export type RepositoryProvider = string;
export type GitBranchName = string;
export type SyncType = string;
export type TemplateType = string;
export type TemplateVersionPart = string;
export type EmptyNextToken = string;
export type Arn = string;
export type MaxPageResults = number;
export type ResourceDeploymentStatus = string;
export type DeploymentId = string;
export type StatusMessage = string | Redacted.Redacted<string>;
export type TagKey = string;
export type RoleArnOrEmptyString = string;
export type Description = string | Redacted.Redacted<string>;
export type TemplateFileContents = string | Redacted.Redacted<string>;
export type TemplateManifestContents = string | Redacted.Redacted<string>;
export type SpecContents = string | Redacted.Redacted<string>;
export type ClientToken = string;
export type ComponentDeploymentUpdateType = string;
export type ResourceNameOrEmpty = string;
export type NextToken = string;
export type AwsAccountId = string;
export type RoleArn = string;
export type EnvironmentAccountConnectionId = string;
export type EnvironmentAccountConnectionRequesterAccountType = string;
export type EnvironmentAccountConnectionStatus = string;
export type DeploymentUpdateType = string;
export type DisplayName = string | Redacted.Redacted<string>;
export type Provisioning = string;
export type TemplateVersionStatus = string;
export type ListServiceInstancesSortBy = string;
export type SortOrder = string;
export type RepositoryId = string;
export type OpsFilePath = string;
export type ServiceTemplateSupportedComponentSourceType = string;
export type Subdirectory = string;
export type OutputKey = string;
export type OutputValueString = string;
export type TagValue = string;
export type ListServiceInstancesFilterBy = string;
export type ListServiceInstancesFilterValue = string;
export type ErrorMessage = string | Redacted.Redacted<string>;
export type RepositoryArn = string;
export type S3Bucket = string;
export type S3Key = string;
export type ComponentArn = string;
export type DeploymentStatus = string;
export type EnvironmentArn = string;
export type ServiceInstanceArn = string;
export type RepositorySyncStatus = string;
export type ResourceSyncStatus = string;
export type SHA = string;
export type ProvisionedResourceName = string;
export type ProvisionedResourceIdentifier = string;
export type ProvisionedResourceEngine = string;
export type DeploymentArn = string;
export type DeploymentTargetResourceType = string;
export type EnvironmentAccountConnectionArn = string;
export type EnvironmentTemplateArn = string;
export type FullTemplateVersionNumber = string;
export type EnvironmentTemplateVersionArn = string;
export type TemplateSchema = string | Redacted.Redacted<string>;
export type ServiceArn = string;
export type ServiceStatus = string;
export type BlockerType = string;
export type BlockerStatus = string;
export type ServiceTemplateArn = string;
export type ServiceTemplateVersionArn = string;

//# Schemas
export interface GetResourcesSummaryInput {}
export const GetResourcesSummaryInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcesSummaryInput",
}) as any as S.Schema<GetResourcesSummaryInput>;
export interface GetAccountSettingsInput {}
export const GetAccountSettingsInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccountSettingsInput",
}) as any as S.Schema<GetAccountSettingsInput>;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type EnvironmentAccountConnectionStatusList = string[];
export const EnvironmentAccountConnectionStatusList = S.Array(S.String);
export type ServiceTemplateSupportedComponentSourceInputList = string[];
export const ServiceTemplateSupportedComponentSourceInputList = S.Array(
  S.String,
);
export interface CancelComponentDeploymentInput {
  componentName: string;
}
export const CancelComponentDeploymentInput = S.suspend(() =>
  S.Struct({ componentName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelComponentDeploymentInput",
}) as any as S.Schema<CancelComponentDeploymentInput>;
export interface CancelEnvironmentDeploymentInput {
  environmentName: string;
}
export const CancelEnvironmentDeploymentInput = S.suspend(() =>
  S.Struct({ environmentName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelEnvironmentDeploymentInput",
}) as any as S.Schema<CancelEnvironmentDeploymentInput>;
export interface CancelServiceInstanceDeploymentInput {
  serviceInstanceName: string;
  serviceName: string;
}
export const CancelServiceInstanceDeploymentInput = S.suspend(() =>
  S.Struct({ serviceInstanceName: S.String, serviceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelServiceInstanceDeploymentInput",
}) as any as S.Schema<CancelServiceInstanceDeploymentInput>;
export interface CancelServicePipelineDeploymentInput {
  serviceName: string;
}
export const CancelServicePipelineDeploymentInput = S.suspend(() =>
  S.Struct({ serviceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelServicePipelineDeploymentInput",
}) as any as S.Schema<CancelServicePipelineDeploymentInput>;
export interface GetRepositorySyncStatusInput {
  repositoryName: string;
  repositoryProvider: string;
  branch: string;
  syncType: string;
}
export const GetRepositorySyncStatusInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    repositoryProvider: S.String,
    branch: S.String,
    syncType: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRepositorySyncStatusInput",
}) as any as S.Schema<GetRepositorySyncStatusInput>;
export interface GetServiceInstanceSyncStatusInput {
  serviceName: string;
  serviceInstanceName: string;
}
export const GetServiceInstanceSyncStatusInput = S.suspend(() =>
  S.Struct({ serviceName: S.String, serviceInstanceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceInstanceSyncStatusInput",
}) as any as S.Schema<GetServiceInstanceSyncStatusInput>;
export interface GetTemplateSyncStatusInput {
  templateName: string;
  templateType: string;
  templateVersion: string;
}
export const GetTemplateSyncStatusInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    templateType: S.String,
    templateVersion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTemplateSyncStatusInput",
}) as any as S.Schema<GetTemplateSyncStatusInput>;
export interface ListRepositorySyncDefinitionsInput {
  repositoryName: string;
  repositoryProvider: string;
  syncType: string;
  nextToken?: string;
}
export const ListRepositorySyncDefinitionsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    repositoryProvider: S.String,
    syncType: S.String,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRepositorySyncDefinitionsInput",
}) as any as S.Schema<ListRepositorySyncDefinitionsInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface ListComponentOutputsInput {
  componentName: string;
  nextToken?: string;
  deploymentId?: string;
}
export const ListComponentOutputsInput = S.suspend(() =>
  S.Struct({
    componentName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComponentOutputsInput",
}) as any as S.Schema<ListComponentOutputsInput>;
export interface ListComponentProvisionedResourcesInput {
  componentName: string;
  nextToken?: string;
}
export const ListComponentProvisionedResourcesInput = S.suspend(() =>
  S.Struct({ componentName: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComponentProvisionedResourcesInput",
}) as any as S.Schema<ListComponentProvisionedResourcesInput>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateComponentInput {
  name: string;
  description?: string | Redacted.Redacted<string>;
  serviceName?: string;
  serviceInstanceName?: string;
  environmentName?: string;
  templateFile: string | Redacted.Redacted<string>;
  manifest: string | Redacted.Redacted<string>;
  serviceSpec?: string | Redacted.Redacted<string>;
  tags?: TagList;
  clientToken?: string;
}
export const CreateComponentInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    environmentName: S.optional(S.String),
    templateFile: SensitiveString,
    manifest: SensitiveString,
    serviceSpec: S.optional(SensitiveString),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateComponentInput",
}) as any as S.Schema<CreateComponentInput>;
export interface GetComponentInput {
  name: string;
}
export const GetComponentInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetComponentInput",
}) as any as S.Schema<GetComponentInput>;
export interface UpdateComponentInput {
  name: string;
  deploymentType: string;
  description?: string | Redacted.Redacted<string>;
  serviceName?: string;
  serviceInstanceName?: string;
  serviceSpec?: string | Redacted.Redacted<string>;
  templateFile?: string | Redacted.Redacted<string>;
  clientToken?: string;
}
export const UpdateComponentInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    deploymentType: S.String,
    description: S.optional(SensitiveString),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    serviceSpec: S.optional(SensitiveString),
    templateFile: S.optional(SensitiveString),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComponentInput",
}) as any as S.Schema<UpdateComponentInput>;
export interface DeleteComponentInput {
  name: string;
}
export const DeleteComponentInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteComponentInput",
}) as any as S.Schema<DeleteComponentInput>;
export interface ListComponentsInput {
  nextToken?: string;
  environmentName?: string;
  serviceName?: string;
  serviceInstanceName?: string;
  maxResults?: number;
}
export const ListComponentsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComponentsInput",
}) as any as S.Schema<ListComponentsInput>;
export interface GetDeploymentInput {
  id: string;
  environmentName?: string;
  serviceName?: string;
  serviceInstanceName?: string;
  componentName?: string;
}
export const GetDeploymentInput = S.suspend(() =>
  S.Struct({
    id: S.String,
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDeploymentInput",
}) as any as S.Schema<GetDeploymentInput>;
export interface DeleteDeploymentInput {
  id: string;
}
export const DeleteDeploymentInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDeploymentInput",
}) as any as S.Schema<DeleteDeploymentInput>;
export interface ListDeploymentsInput {
  nextToken?: string;
  environmentName?: string;
  serviceName?: string;
  serviceInstanceName?: string;
  componentName?: string;
  maxResults?: number;
}
export const ListDeploymentsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDeploymentsInput",
}) as any as S.Schema<ListDeploymentsInput>;
export interface CreateEnvironmentAccountConnectionInput {
  clientToken?: string;
  managementAccountId: string;
  roleArn?: string;
  environmentName: string;
  tags?: TagList;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
}
export const CreateEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    managementAccountId: S.String,
    roleArn: S.optional(S.String),
    environmentName: S.String,
    tags: S.optional(TagList),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentAccountConnectionInput",
}) as any as S.Schema<CreateEnvironmentAccountConnectionInput>;
export interface GetEnvironmentAccountConnectionInput {
  id: string;
}
export const GetEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnvironmentAccountConnectionInput",
}) as any as S.Schema<GetEnvironmentAccountConnectionInput>;
export interface UpdateEnvironmentAccountConnectionInput {
  id: string;
  roleArn?: string;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
}
export const UpdateEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({
    id: S.String,
    roleArn: S.optional(S.String),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentAccountConnectionInput",
}) as any as S.Schema<UpdateEnvironmentAccountConnectionInput>;
export interface DeleteEnvironmentAccountConnectionInput {
  id: string;
}
export const DeleteEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentAccountConnectionInput",
}) as any as S.Schema<DeleteEnvironmentAccountConnectionInput>;
export interface ListEnvironmentAccountConnectionsInput {
  requestedBy: string;
  environmentName?: string;
  statuses?: EnvironmentAccountConnectionStatusList;
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentAccountConnectionsInput = S.suspend(() =>
  S.Struct({
    requestedBy: S.String,
    environmentName: S.optional(S.String),
    statuses: S.optional(EnvironmentAccountConnectionStatusList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentAccountConnectionsInput",
}) as any as S.Schema<ListEnvironmentAccountConnectionsInput>;
export interface AcceptEnvironmentAccountConnectionInput {
  id: string;
}
export const AcceptEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AcceptEnvironmentAccountConnectionInput",
}) as any as S.Schema<AcceptEnvironmentAccountConnectionInput>;
export interface RejectEnvironmentAccountConnectionInput {
  id: string;
}
export const RejectEnvironmentAccountConnectionInput = S.suspend(() =>
  S.Struct({ id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RejectEnvironmentAccountConnectionInput",
}) as any as S.Schema<RejectEnvironmentAccountConnectionInput>;
export interface ListEnvironmentOutputsInput {
  environmentName: string;
  nextToken?: string;
  deploymentId?: string;
}
export const ListEnvironmentOutputsInput = S.suspend(() =>
  S.Struct({
    environmentName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentOutputsInput",
}) as any as S.Schema<ListEnvironmentOutputsInput>;
export interface ListEnvironmentProvisionedResourcesInput {
  environmentName: string;
  nextToken?: string;
}
export const ListEnvironmentProvisionedResourcesInput = S.suspend(() =>
  S.Struct({ environmentName: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentProvisionedResourcesInput",
}) as any as S.Schema<ListEnvironmentProvisionedResourcesInput>;
export interface RepositoryBranchInput {
  provider: string;
  name: string;
  branch: string;
}
export const RepositoryBranchInput = S.suspend(() =>
  S.Struct({ provider: S.String, name: S.String, branch: S.String }),
).annotations({
  identifier: "RepositoryBranchInput",
}) as any as S.Schema<RepositoryBranchInput>;
export interface CreateEnvironmentInput {
  name: string;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion?: string;
  description?: string | Redacted.Redacted<string>;
  spec: string | Redacted.Redacted<string>;
  protonServiceRoleArn?: string;
  environmentAccountConnectionId?: string;
  tags?: TagList;
  provisioningRepository?: RepositoryBranchInput;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
}
export const CreateEnvironmentInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.optional(S.String),
    description: S.optional(SensitiveString),
    spec: SensitiveString,
    protonServiceRoleArn: S.optional(S.String),
    environmentAccountConnectionId: S.optional(S.String),
    tags: S.optional(TagList),
    provisioningRepository: S.optional(RepositoryBranchInput),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentInput",
}) as any as S.Schema<CreateEnvironmentInput>;
export interface GetEnvironmentInput {
  name: string;
}
export const GetEnvironmentInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnvironmentInput",
}) as any as S.Schema<GetEnvironmentInput>;
export interface UpdateEnvironmentInput {
  name: string;
  description?: string | Redacted.Redacted<string>;
  spec?: string | Redacted.Redacted<string>;
  templateMajorVersion?: string;
  templateMinorVersion?: string;
  protonServiceRoleArn?: string;
  deploymentType: string;
  environmentAccountConnectionId?: string;
  provisioningRepository?: RepositoryBranchInput;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
}
export const UpdateEnvironmentInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    spec: S.optional(SensitiveString),
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    protonServiceRoleArn: S.optional(S.String),
    deploymentType: S.String,
    environmentAccountConnectionId: S.optional(S.String),
    provisioningRepository: S.optional(RepositoryBranchInput),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentInput",
}) as any as S.Schema<UpdateEnvironmentInput>;
export interface DeleteEnvironmentInput {
  name: string;
}
export const DeleteEnvironmentInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentInput",
}) as any as S.Schema<DeleteEnvironmentInput>;
export interface CreateEnvironmentTemplateInput {
  name: string;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  encryptionKey?: string;
  provisioning?: string;
  tags?: TagList;
}
export const CreateEnvironmentTemplateInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    encryptionKey: S.optional(S.String),
    provisioning: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentTemplateInput",
}) as any as S.Schema<CreateEnvironmentTemplateInput>;
export interface GetEnvironmentTemplateInput {
  name: string;
}
export const GetEnvironmentTemplateInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnvironmentTemplateInput",
}) as any as S.Schema<GetEnvironmentTemplateInput>;
export interface UpdateEnvironmentTemplateInput {
  name: string;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
}
export const UpdateEnvironmentTemplateInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentTemplateInput",
}) as any as S.Schema<UpdateEnvironmentTemplateInput>;
export interface DeleteEnvironmentTemplateInput {
  name: string;
}
export const DeleteEnvironmentTemplateInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentTemplateInput",
}) as any as S.Schema<DeleteEnvironmentTemplateInput>;
export interface ListEnvironmentTemplatesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentTemplatesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentTemplatesInput",
}) as any as S.Schema<ListEnvironmentTemplatesInput>;
export interface GetEnvironmentTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
}
export const GetEnvironmentTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnvironmentTemplateVersionInput",
}) as any as S.Schema<GetEnvironmentTemplateVersionInput>;
export interface UpdateEnvironmentTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
}
export const UpdateEnvironmentTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentTemplateVersionInput",
}) as any as S.Schema<UpdateEnvironmentTemplateVersionInput>;
export interface DeleteEnvironmentTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
}
export const DeleteEnvironmentTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentTemplateVersionInput",
}) as any as S.Schema<DeleteEnvironmentTemplateVersionInput>;
export interface ListEnvironmentTemplateVersionsInput {
  nextToken?: string;
  maxResults?: number;
  templateName: string;
  majorVersion?: string;
}
export const ListEnvironmentTemplateVersionsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    templateName: S.String,
    majorVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentTemplateVersionsInput",
}) as any as S.Schema<ListEnvironmentTemplateVersionsInput>;
export interface CreateRepositoryInput {
  provider: string;
  name: string;
  connectionArn: string;
  encryptionKey?: string;
  tags?: TagList;
}
export const CreateRepositoryInput = S.suspend(() =>
  S.Struct({
    provider: S.String,
    name: S.String,
    connectionArn: S.String,
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRepositoryInput",
}) as any as S.Schema<CreateRepositoryInput>;
export interface GetRepositoryInput {
  provider: string;
  name: string;
}
export const GetRepositoryInput = S.suspend(() =>
  S.Struct({ provider: S.String, name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRepositoryInput",
}) as any as S.Schema<GetRepositoryInput>;
export interface DeleteRepositoryInput {
  provider: string;
  name: string;
}
export const DeleteRepositoryInput = S.suspend(() =>
  S.Struct({ provider: S.String, name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRepositoryInput",
}) as any as S.Schema<DeleteRepositoryInput>;
export interface ListRepositoriesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListRepositoriesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRepositoriesInput",
}) as any as S.Schema<ListRepositoriesInput>;
export interface ListServiceInstanceOutputsInput {
  serviceInstanceName: string;
  serviceName: string;
  nextToken?: string;
  deploymentId?: string;
}
export const ListServiceInstanceOutputsInput = S.suspend(() =>
  S.Struct({
    serviceInstanceName: S.String,
    serviceName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceInstanceOutputsInput",
}) as any as S.Schema<ListServiceInstanceOutputsInput>;
export interface ListServiceInstanceProvisionedResourcesInput {
  serviceName: string;
  serviceInstanceName: string;
  nextToken?: string;
}
export const ListServiceInstanceProvisionedResourcesInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    serviceInstanceName: S.String,
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceInstanceProvisionedResourcesInput",
}) as any as S.Schema<ListServiceInstanceProvisionedResourcesInput>;
export interface CreateServiceInstanceInput {
  name: string;
  serviceName: string;
  spec: string | Redacted.Redacted<string>;
  templateMajorVersion?: string;
  templateMinorVersion?: string;
  tags?: TagList;
  clientToken?: string;
}
export const CreateServiceInstanceInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    serviceName: S.String,
    spec: SensitiveString,
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceInstanceInput",
}) as any as S.Schema<CreateServiceInstanceInput>;
export interface GetServiceInstanceInput {
  name: string;
  serviceName: string;
}
export const GetServiceInstanceInput = S.suspend(() =>
  S.Struct({ name: S.String, serviceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceInstanceInput",
}) as any as S.Schema<GetServiceInstanceInput>;
export interface UpdateServiceInstanceInput {
  name: string;
  serviceName: string;
  deploymentType: string;
  spec?: string | Redacted.Redacted<string>;
  templateMajorVersion?: string;
  templateMinorVersion?: string;
  clientToken?: string;
}
export const UpdateServiceInstanceInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    serviceName: S.String,
    deploymentType: S.String,
    spec: S.optional(SensitiveString),
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceInstanceInput",
}) as any as S.Schema<UpdateServiceInstanceInput>;
export interface ListServicePipelineOutputsInput {
  serviceName: string;
  nextToken?: string;
  deploymentId?: string;
}
export const ListServicePipelineOutputsInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServicePipelineOutputsInput",
}) as any as S.Schema<ListServicePipelineOutputsInput>;
export interface ListServicePipelineProvisionedResourcesInput {
  serviceName: string;
  nextToken?: string;
}
export const ListServicePipelineProvisionedResourcesInput = S.suspend(() =>
  S.Struct({ serviceName: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServicePipelineProvisionedResourcesInput",
}) as any as S.Schema<ListServicePipelineProvisionedResourcesInput>;
export interface UpdateServicePipelineInput {
  serviceName: string;
  spec: string | Redacted.Redacted<string>;
  deploymentType: string;
  templateMajorVersion?: string;
  templateMinorVersion?: string;
}
export const UpdateServicePipelineInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    spec: SensitiveString,
    deploymentType: S.String,
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServicePipelineInput",
}) as any as S.Schema<UpdateServicePipelineInput>;
export interface CreateServiceInput {
  name: string;
  description?: string | Redacted.Redacted<string>;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion?: string;
  spec: string | Redacted.Redacted<string>;
  repositoryConnectionArn?: string;
  repositoryId?: string;
  branchName?: string;
  tags?: TagList;
}
export const CreateServiceInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.optional(S.String),
    spec: SensitiveString,
    repositoryConnectionArn: S.optional(S.String),
    repositoryId: S.optional(S.String),
    branchName: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceInput",
}) as any as S.Schema<CreateServiceInput>;
export interface GetServiceInput {
  name: string;
}
export const GetServiceInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceInput",
}) as any as S.Schema<GetServiceInput>;
export interface UpdateServiceInput {
  name: string;
  description?: string | Redacted.Redacted<string>;
  spec?: string | Redacted.Redacted<string>;
}
export const UpdateServiceInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    spec: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceInput",
}) as any as S.Schema<UpdateServiceInput>;
export interface DeleteServiceInput {
  name: string;
}
export const DeleteServiceInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceInput",
}) as any as S.Schema<DeleteServiceInput>;
export interface ListServicesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListServicesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServicesInput",
}) as any as S.Schema<ListServicesInput>;
export interface GetServiceSyncBlockerSummaryInput {
  serviceName: string;
  serviceInstanceName?: string;
}
export const GetServiceSyncBlockerSummaryInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    serviceInstanceName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceSyncBlockerSummaryInput",
}) as any as S.Schema<GetServiceSyncBlockerSummaryInput>;
export interface UpdateServiceSyncBlockerInput {
  id: string;
  resolvedReason: string;
}
export const UpdateServiceSyncBlockerInput = S.suspend(() =>
  S.Struct({ id: S.String, resolvedReason: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceSyncBlockerInput",
}) as any as S.Schema<UpdateServiceSyncBlockerInput>;
export interface CreateServiceSyncConfigInput {
  serviceName: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  filePath: string;
}
export const CreateServiceSyncConfigInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    filePath: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceSyncConfigInput",
}) as any as S.Schema<CreateServiceSyncConfigInput>;
export interface GetServiceSyncConfigInput {
  serviceName: string;
}
export const GetServiceSyncConfigInput = S.suspend(() =>
  S.Struct({ serviceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceSyncConfigInput",
}) as any as S.Schema<GetServiceSyncConfigInput>;
export interface UpdateServiceSyncConfigInput {
  serviceName: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  filePath: string;
}
export const UpdateServiceSyncConfigInput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    filePath: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceSyncConfigInput",
}) as any as S.Schema<UpdateServiceSyncConfigInput>;
export interface DeleteServiceSyncConfigInput {
  serviceName: string;
}
export const DeleteServiceSyncConfigInput = S.suspend(() =>
  S.Struct({ serviceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceSyncConfigInput",
}) as any as S.Schema<DeleteServiceSyncConfigInput>;
export interface CreateServiceTemplateInput {
  name: string;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  encryptionKey?: string;
  pipelineProvisioning?: string;
  tags?: TagList;
}
export const CreateServiceTemplateInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    encryptionKey: S.optional(S.String),
    pipelineProvisioning: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceTemplateInput",
}) as any as S.Schema<CreateServiceTemplateInput>;
export interface GetServiceTemplateInput {
  name: string;
}
export const GetServiceTemplateInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceTemplateInput",
}) as any as S.Schema<GetServiceTemplateInput>;
export interface UpdateServiceTemplateInput {
  name: string;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
}
export const UpdateServiceTemplateInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceTemplateInput",
}) as any as S.Schema<UpdateServiceTemplateInput>;
export interface DeleteServiceTemplateInput {
  name: string;
}
export const DeleteServiceTemplateInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceTemplateInput",
}) as any as S.Schema<DeleteServiceTemplateInput>;
export interface ListServiceTemplatesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListServiceTemplatesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceTemplatesInput",
}) as any as S.Schema<ListServiceTemplatesInput>;
export interface GetServiceTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
}
export const GetServiceTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetServiceTemplateVersionInput",
}) as any as S.Schema<GetServiceTemplateVersionInput>;
export interface CompatibleEnvironmentTemplateInput {
  templateName: string;
  majorVersion: string;
}
export const CompatibleEnvironmentTemplateInput = S.suspend(() =>
  S.Struct({ templateName: S.String, majorVersion: S.String }),
).annotations({
  identifier: "CompatibleEnvironmentTemplateInput",
}) as any as S.Schema<CompatibleEnvironmentTemplateInput>;
export type CompatibleEnvironmentTemplateInputList =
  CompatibleEnvironmentTemplateInput[];
export const CompatibleEnvironmentTemplateInputList = S.Array(
  CompatibleEnvironmentTemplateInput,
);
export interface UpdateServiceTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  description?: string | Redacted.Redacted<string>;
  status?: string;
  compatibleEnvironmentTemplates?: CompatibleEnvironmentTemplateInputList;
  supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
}
export const UpdateServiceTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    description: S.optional(SensitiveString),
    status: S.optional(S.String),
    compatibleEnvironmentTemplates: S.optional(
      CompatibleEnvironmentTemplateInputList,
    ),
    supportedComponentSources: S.optional(
      ServiceTemplateSupportedComponentSourceInputList,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServiceTemplateVersionInput",
}) as any as S.Schema<UpdateServiceTemplateVersionInput>;
export interface DeleteServiceTemplateVersionInput {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
}
export const DeleteServiceTemplateVersionInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServiceTemplateVersionInput",
}) as any as S.Schema<DeleteServiceTemplateVersionInput>;
export interface ListServiceTemplateVersionsInput {
  nextToken?: string;
  maxResults?: number;
  templateName: string;
  majorVersion?: string;
}
export const ListServiceTemplateVersionsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    templateName: S.String,
    majorVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceTemplateVersionsInput",
}) as any as S.Schema<ListServiceTemplateVersionsInput>;
export interface CreateTemplateSyncConfigInput {
  templateName: string;
  templateType: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  subdirectory?: string;
}
export const CreateTemplateSyncConfigInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    templateType: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    subdirectory: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTemplateSyncConfigInput",
}) as any as S.Schema<CreateTemplateSyncConfigInput>;
export interface GetTemplateSyncConfigInput {
  templateName: string;
  templateType: string;
}
export const GetTemplateSyncConfigInput = S.suspend(() =>
  S.Struct({ templateName: S.String, templateType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTemplateSyncConfigInput",
}) as any as S.Schema<GetTemplateSyncConfigInput>;
export interface UpdateTemplateSyncConfigInput {
  templateName: string;
  templateType: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  subdirectory?: string;
}
export const UpdateTemplateSyncConfigInput = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    templateType: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    subdirectory: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTemplateSyncConfigInput",
}) as any as S.Schema<UpdateTemplateSyncConfigInput>;
export interface DeleteTemplateSyncConfigInput {
  templateName: string;
  templateType: string;
}
export const DeleteTemplateSyncConfigInput = S.suspend(() =>
  S.Struct({ templateName: S.String, templateType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTemplateSyncConfigInput",
}) as any as S.Schema<DeleteTemplateSyncConfigInput>;
export interface Output {
  key?: string;
  valueString?: string;
}
export const Output = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), valueString: S.optional(S.String) }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type OutputsList = Output[];
export const OutputsList = S.Array(Output);
export interface EnvironmentTemplateFilter {
  templateName: string;
  majorVersion: string;
}
export const EnvironmentTemplateFilter = S.suspend(() =>
  S.Struct({ templateName: S.String, majorVersion: S.String }),
).annotations({
  identifier: "EnvironmentTemplateFilter",
}) as any as S.Schema<EnvironmentTemplateFilter>;
export type EnvironmentTemplateFilterList = EnvironmentTemplateFilter[];
export const EnvironmentTemplateFilterList = S.Array(EnvironmentTemplateFilter);
export interface ListServiceInstancesFilter {
  key?: string;
  value?: string;
}
export const ListServiceInstancesFilter = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "ListServiceInstancesFilter",
}) as any as S.Schema<ListServiceInstancesFilter>;
export type ListServiceInstancesFilterList = ListServiceInstancesFilter[];
export const ListServiceInstancesFilterList = S.Array(
  ListServiceInstancesFilter,
);
export interface Revision {
  repositoryName: string;
  repositoryProvider: string;
  sha: string;
  directory: string;
  branch: string;
}
export const Revision = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    repositoryProvider: S.String,
    sha: S.String,
    directory: S.String,
    branch: S.String,
  }),
).annotations({ identifier: "Revision" }) as any as S.Schema<Revision>;
export interface ResourceSyncEvent {
  type: string;
  externalId?: string;
  time: Date;
  event: string;
}
export const ResourceSyncEvent = S.suspend(() =>
  S.Struct({
    type: S.String,
    externalId: S.optional(S.String),
    time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    event: S.String,
  }),
).annotations({
  identifier: "ResourceSyncEvent",
}) as any as S.Schema<ResourceSyncEvent>;
export type ResourceSyncEvents = ResourceSyncEvent[];
export const ResourceSyncEvents = S.Array(ResourceSyncEvent);
export interface ResourceSyncAttempt {
  initialRevision: Revision;
  targetRevision: Revision;
  target: string;
  startedAt: Date;
  status: string;
  events: ResourceSyncEvents;
}
export const ResourceSyncAttempt = S.suspend(() =>
  S.Struct({
    initialRevision: Revision,
    targetRevision: Revision,
    target: S.String,
    startedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    events: ResourceSyncEvents,
  }),
).annotations({
  identifier: "ResourceSyncAttempt",
}) as any as S.Schema<ResourceSyncAttempt>;
export interface GetTemplateSyncStatusOutput {
  latestSync?: ResourceSyncAttempt;
  latestSuccessfulSync?: ResourceSyncAttempt;
  desiredState?: Revision;
}
export const GetTemplateSyncStatusOutput = S.suspend(() =>
  S.Struct({
    latestSync: S.optional(ResourceSyncAttempt),
    latestSuccessfulSync: S.optional(ResourceSyncAttempt),
    desiredState: S.optional(Revision),
  }),
).annotations({
  identifier: "GetTemplateSyncStatusOutput",
}) as any as S.Schema<GetTemplateSyncStatusOutput>;
export interface ListTagsForResourceOutput {
  tags: TagList;
  nextToken?: string;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: TagList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface NotifyResourceDeploymentStatusChangeInput {
  resourceArn: string;
  status?: string;
  outputs?: OutputsList;
  deploymentId?: string;
  statusMessage?: string | Redacted.Redacted<string>;
}
export const NotifyResourceDeploymentStatusChangeInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    status: S.optional(S.String),
    outputs: S.optional(OutputsList),
    deploymentId: S.optional(S.String),
    statusMessage: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "NotifyResourceDeploymentStatusChangeInput",
}) as any as S.Schema<NotifyResourceDeploymentStatusChangeInput>;
export interface NotifyResourceDeploymentStatusChangeOutput {}
export const NotifyResourceDeploymentStatusChangeOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "NotifyResourceDeploymentStatusChangeOutput",
}) as any as S.Schema<NotifyResourceDeploymentStatusChangeOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tags: TagList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UpdateAccountSettingsInput {
  pipelineServiceRoleArn?: string;
  pipelineProvisioningRepository?: RepositoryBranchInput;
  deletePipelineProvisioningRepository?: boolean;
  pipelineCodebuildRoleArn?: string;
}
export const UpdateAccountSettingsInput = S.suspend(() =>
  S.Struct({
    pipelineServiceRoleArn: S.optional(S.String),
    pipelineProvisioningRepository: S.optional(RepositoryBranchInput),
    deletePipelineProvisioningRepository: S.optional(S.Boolean),
    pipelineCodebuildRoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAccountSettingsInput",
}) as any as S.Schema<UpdateAccountSettingsInput>;
export interface ListComponentOutputsOutput {
  nextToken?: string;
  outputs: OutputsList;
}
export const ListComponentOutputsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), outputs: OutputsList }),
).annotations({
  identifier: "ListComponentOutputsOutput",
}) as any as S.Schema<ListComponentOutputsOutput>;
export interface Component {
  name: string;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  environmentName: string;
  serviceName?: string;
  serviceInstanceName?: string;
  createdAt: Date;
  lastModifiedAt: Date;
  lastDeploymentAttemptedAt?: Date;
  lastDeploymentSucceededAt?: Date;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  serviceSpec?: string | Redacted.Redacted<string>;
  lastClientRequestToken?: string;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const Component = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    arn: S.String,
    environmentName: S.String,
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastDeploymentSucceededAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    serviceSpec: S.optional(SensitiveString),
    lastClientRequestToken: S.optional(S.String),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({ identifier: "Component" }) as any as S.Schema<Component>;
export interface CreateComponentOutput {
  component: Component;
}
export const CreateComponentOutput = S.suspend(() =>
  S.Struct({ component: Component }),
).annotations({
  identifier: "CreateComponentOutput",
}) as any as S.Schema<CreateComponentOutput>;
export interface GetComponentOutput {
  component?: Component;
}
export const GetComponentOutput = S.suspend(() =>
  S.Struct({ component: S.optional(Component) }),
).annotations({
  identifier: "GetComponentOutput",
}) as any as S.Schema<GetComponentOutput>;
export interface UpdateComponentOutput {
  component: Component;
}
export const UpdateComponentOutput = S.suspend(() =>
  S.Struct({ component: Component }),
).annotations({
  identifier: "UpdateComponentOutput",
}) as any as S.Schema<UpdateComponentOutput>;
export interface DeleteComponentOutput {
  component?: Component;
}
export const DeleteComponentOutput = S.suspend(() =>
  S.Struct({ component: S.optional(Component) }),
).annotations({
  identifier: "DeleteComponentOutput",
}) as any as S.Schema<DeleteComponentOutput>;
export type ComponentDeploymentIdList = string[];
export const ComponentDeploymentIdList = S.Array(S.String);
export interface ServiceInstanceState {
  spec: string | Redacted.Redacted<string>;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  lastSuccessfulComponentDeploymentIds?: ComponentDeploymentIdList;
  lastSuccessfulEnvironmentDeploymentId?: string;
  lastSuccessfulServicePipelineDeploymentId?: string;
}
export const ServiceInstanceState = S.suspend(() =>
  S.Struct({
    spec: SensitiveString,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    lastSuccessfulComponentDeploymentIds: S.optional(ComponentDeploymentIdList),
    lastSuccessfulEnvironmentDeploymentId: S.optional(S.String),
    lastSuccessfulServicePipelineDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceInstanceState",
}) as any as S.Schema<ServiceInstanceState>;
export interface EnvironmentState {
  spec?: string | Redacted.Redacted<string>;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
}
export const EnvironmentState = S.suspend(() =>
  S.Struct({
    spec: S.optional(SensitiveString),
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
  }),
).annotations({
  identifier: "EnvironmentState",
}) as any as S.Schema<EnvironmentState>;
export interface ServicePipelineState {
  spec?: string | Redacted.Redacted<string>;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
}
export const ServicePipelineState = S.suspend(() =>
  S.Struct({
    spec: S.optional(SensitiveString),
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
  }),
).annotations({
  identifier: "ServicePipelineState",
}) as any as S.Schema<ServicePipelineState>;
export interface ComponentState {
  serviceName?: string;
  serviceInstanceName?: string;
  serviceSpec?: string | Redacted.Redacted<string>;
  templateFile?: string | Redacted.Redacted<string>;
}
export const ComponentState = S.suspend(() =>
  S.Struct({
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    serviceSpec: S.optional(SensitiveString),
    templateFile: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ComponentState",
}) as any as S.Schema<ComponentState>;
export type DeploymentState =
  | { serviceInstance: ServiceInstanceState }
  | { environment: EnvironmentState }
  | { servicePipeline: ServicePipelineState }
  | { component: ComponentState };
export const DeploymentState = S.Union(
  S.Struct({ serviceInstance: ServiceInstanceState }),
  S.Struct({ environment: EnvironmentState }),
  S.Struct({ servicePipeline: ServicePipelineState }),
  S.Struct({ component: ComponentState }),
);
export interface Deployment {
  id: string;
  arn: string;
  targetArn: string;
  targetResourceCreatedAt: Date;
  targetResourceType: string;
  environmentName: string;
  serviceName?: string;
  serviceInstanceName?: string;
  componentName?: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  createdAt: Date;
  lastModifiedAt: Date;
  completedAt?: Date;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
  initialState?: (typeof DeploymentState)["Type"];
  targetState?: (typeof DeploymentState)["Type"];
}
export const Deployment = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    targetArn: S.String,
    targetResourceCreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    targetResourceType: S.String,
    environmentName: S.String,
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
    initialState: S.optional(DeploymentState),
    targetState: S.optional(DeploymentState),
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export interface DeleteDeploymentOutput {
  deployment?: Deployment;
}
export const DeleteDeploymentOutput = S.suspend(() =>
  S.Struct({ deployment: S.optional(Deployment) }),
).annotations({
  identifier: "DeleteDeploymentOutput",
}) as any as S.Schema<DeleteDeploymentOutput>;
export interface EnvironmentAccountConnection {
  id: string;
  arn: string;
  managementAccountId: string;
  environmentAccountId: string;
  roleArn: string;
  environmentName: string;
  requestedAt: Date;
  lastModifiedAt: Date;
  status: string;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
}
export const EnvironmentAccountConnection = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    managementAccountId: S.String,
    environmentAccountId: S.String,
    roleArn: S.String,
    environmentName: S.String,
    requestedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentAccountConnection",
}) as any as S.Schema<EnvironmentAccountConnection>;
export interface GetEnvironmentAccountConnectionOutput {
  environmentAccountConnection: EnvironmentAccountConnection;
}
export const GetEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({ environmentAccountConnection: EnvironmentAccountConnection }),
).annotations({
  identifier: "GetEnvironmentAccountConnectionOutput",
}) as any as S.Schema<GetEnvironmentAccountConnectionOutput>;
export interface UpdateEnvironmentAccountConnectionOutput {
  environmentAccountConnection: EnvironmentAccountConnection;
}
export const UpdateEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({ environmentAccountConnection: EnvironmentAccountConnection }),
).annotations({
  identifier: "UpdateEnvironmentAccountConnectionOutput",
}) as any as S.Schema<UpdateEnvironmentAccountConnectionOutput>;
export interface DeleteEnvironmentAccountConnectionOutput {
  environmentAccountConnection?: EnvironmentAccountConnection;
}
export const DeleteEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({
    environmentAccountConnection: S.optional(EnvironmentAccountConnection),
  }),
).annotations({
  identifier: "DeleteEnvironmentAccountConnectionOutput",
}) as any as S.Schema<DeleteEnvironmentAccountConnectionOutput>;
export interface AcceptEnvironmentAccountConnectionOutput {
  environmentAccountConnection: EnvironmentAccountConnection;
}
export const AcceptEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({ environmentAccountConnection: EnvironmentAccountConnection }),
).annotations({
  identifier: "AcceptEnvironmentAccountConnectionOutput",
}) as any as S.Schema<AcceptEnvironmentAccountConnectionOutput>;
export interface RejectEnvironmentAccountConnectionOutput {
  environmentAccountConnection: EnvironmentAccountConnection;
}
export const RejectEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({ environmentAccountConnection: EnvironmentAccountConnection }),
).annotations({
  identifier: "RejectEnvironmentAccountConnectionOutput",
}) as any as S.Schema<RejectEnvironmentAccountConnectionOutput>;
export interface ListEnvironmentOutputsOutput {
  nextToken?: string;
  outputs: OutputsList;
}
export const ListEnvironmentOutputsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), outputs: OutputsList }),
).annotations({
  identifier: "ListEnvironmentOutputsOutput",
}) as any as S.Schema<ListEnvironmentOutputsOutput>;
export interface ProvisionedResource {
  name?: string;
  identifier?: string;
  provisioningEngine?: string;
}
export const ProvisionedResource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    identifier: S.optional(S.String),
    provisioningEngine: S.optional(S.String),
  }),
).annotations({
  identifier: "ProvisionedResource",
}) as any as S.Schema<ProvisionedResource>;
export type ProvisionedResourceList = ProvisionedResource[];
export const ProvisionedResourceList = S.Array(ProvisionedResource);
export interface ListEnvironmentProvisionedResourcesOutput {
  nextToken?: string;
  provisionedResources: ProvisionedResourceList;
}
export const ListEnvironmentProvisionedResourcesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    provisionedResources: ProvisionedResourceList,
  }),
).annotations({
  identifier: "ListEnvironmentProvisionedResourcesOutput",
}) as any as S.Schema<ListEnvironmentProvisionedResourcesOutput>;
export interface RepositoryBranch {
  arn: string;
  provider: string;
  name: string;
  branch: string;
}
export const RepositoryBranch = S.suspend(() =>
  S.Struct({
    arn: S.String,
    provider: S.String,
    name: S.String,
    branch: S.String,
  }),
).annotations({
  identifier: "RepositoryBranch",
}) as any as S.Schema<RepositoryBranch>;
export interface Environment {
  name: string;
  description?: string | Redacted.Redacted<string>;
  createdAt: Date;
  lastDeploymentAttemptedAt: Date;
  lastDeploymentSucceededAt: Date;
  arn: string;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  protonServiceRoleArn?: string;
  environmentAccountConnectionId?: string;
  environmentAccountId?: string;
  spec?: string | Redacted.Redacted<string>;
  provisioning?: string;
  provisioningRepository?: RepositoryBranch;
  componentRoleArn?: string;
  codebuildRoleArn?: string;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const Environment = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    arn: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    protonServiceRoleArn: S.optional(S.String),
    environmentAccountConnectionId: S.optional(S.String),
    environmentAccountId: S.optional(S.String),
    spec: S.optional(SensitiveString),
    provisioning: S.optional(S.String),
    provisioningRepository: S.optional(RepositoryBranch),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export interface CreateEnvironmentOutput {
  environment: Environment;
}
export const CreateEnvironmentOutput = S.suspend(() =>
  S.Struct({ environment: Environment }),
).annotations({
  identifier: "CreateEnvironmentOutput",
}) as any as S.Schema<CreateEnvironmentOutput>;
export interface GetEnvironmentOutput {
  environment: Environment;
}
export const GetEnvironmentOutput = S.suspend(() =>
  S.Struct({ environment: Environment }),
).annotations({
  identifier: "GetEnvironmentOutput",
}) as any as S.Schema<GetEnvironmentOutput>;
export interface UpdateEnvironmentOutput {
  environment: Environment;
}
export const UpdateEnvironmentOutput = S.suspend(() =>
  S.Struct({ environment: Environment }),
).annotations({
  identifier: "UpdateEnvironmentOutput",
}) as any as S.Schema<UpdateEnvironmentOutput>;
export interface DeleteEnvironmentOutput {
  environment?: Environment;
}
export const DeleteEnvironmentOutput = S.suspend(() =>
  S.Struct({ environment: S.optional(Environment) }),
).annotations({
  identifier: "DeleteEnvironmentOutput",
}) as any as S.Schema<DeleteEnvironmentOutput>;
export interface ListEnvironmentsInput {
  nextToken?: string;
  maxResults?: number;
  environmentTemplates?: EnvironmentTemplateFilterList;
}
export const ListEnvironmentsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    environmentTemplates: S.optional(EnvironmentTemplateFilterList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentsInput",
}) as any as S.Schema<ListEnvironmentsInput>;
export interface EnvironmentTemplate {
  name: string;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  recommendedVersion?: string;
  encryptionKey?: string;
  provisioning?: string;
}
export const EnvironmentTemplate = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    recommendedVersion: S.optional(S.String),
    encryptionKey: S.optional(S.String),
    provisioning: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentTemplate",
}) as any as S.Schema<EnvironmentTemplate>;
export interface GetEnvironmentTemplateOutput {
  environmentTemplate: EnvironmentTemplate;
}
export const GetEnvironmentTemplateOutput = S.suspend(() =>
  S.Struct({ environmentTemplate: EnvironmentTemplate }),
).annotations({
  identifier: "GetEnvironmentTemplateOutput",
}) as any as S.Schema<GetEnvironmentTemplateOutput>;
export interface UpdateEnvironmentTemplateOutput {
  environmentTemplate: EnvironmentTemplate;
}
export const UpdateEnvironmentTemplateOutput = S.suspend(() =>
  S.Struct({ environmentTemplate: EnvironmentTemplate }),
).annotations({
  identifier: "UpdateEnvironmentTemplateOutput",
}) as any as S.Schema<UpdateEnvironmentTemplateOutput>;
export interface DeleteEnvironmentTemplateOutput {
  environmentTemplate?: EnvironmentTemplate;
}
export const DeleteEnvironmentTemplateOutput = S.suspend(() =>
  S.Struct({ environmentTemplate: S.optional(EnvironmentTemplate) }),
).annotations({
  identifier: "DeleteEnvironmentTemplateOutput",
}) as any as S.Schema<DeleteEnvironmentTemplateOutput>;
export interface EnvironmentTemplateVersion {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  recommendedMinorVersion?: string;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  schema?: string | Redacted.Redacted<string>;
}
export const EnvironmentTemplateVersion = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    recommendedMinorVersion: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    schema: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EnvironmentTemplateVersion",
}) as any as S.Schema<EnvironmentTemplateVersion>;
export interface UpdateEnvironmentTemplateVersionOutput {
  environmentTemplateVersion: EnvironmentTemplateVersion;
}
export const UpdateEnvironmentTemplateVersionOutput = S.suspend(() =>
  S.Struct({ environmentTemplateVersion: EnvironmentTemplateVersion }),
).annotations({
  identifier: "UpdateEnvironmentTemplateVersionOutput",
}) as any as S.Schema<UpdateEnvironmentTemplateVersionOutput>;
export interface DeleteEnvironmentTemplateVersionOutput {
  environmentTemplateVersion?: EnvironmentTemplateVersion;
}
export const DeleteEnvironmentTemplateVersionOutput = S.suspend(() =>
  S.Struct({
    environmentTemplateVersion: S.optional(EnvironmentTemplateVersion),
  }),
).annotations({
  identifier: "DeleteEnvironmentTemplateVersionOutput",
}) as any as S.Schema<DeleteEnvironmentTemplateVersionOutput>;
export interface Repository {
  arn: string;
  provider: string;
  name: string;
  connectionArn: string;
  encryptionKey?: string;
}
export const Repository = S.suspend(() =>
  S.Struct({
    arn: S.String,
    provider: S.String,
    name: S.String,
    connectionArn: S.String,
    encryptionKey: S.optional(S.String),
  }),
).annotations({ identifier: "Repository" }) as any as S.Schema<Repository>;
export interface GetRepositoryOutput {
  repository: Repository;
}
export const GetRepositoryOutput = S.suspend(() =>
  S.Struct({ repository: Repository }),
).annotations({
  identifier: "GetRepositoryOutput",
}) as any as S.Schema<GetRepositoryOutput>;
export interface DeleteRepositoryOutput {
  repository?: Repository;
}
export const DeleteRepositoryOutput = S.suspend(() =>
  S.Struct({ repository: S.optional(Repository) }),
).annotations({
  identifier: "DeleteRepositoryOutput",
}) as any as S.Schema<DeleteRepositoryOutput>;
export interface ListServiceInstanceOutputsOutput {
  nextToken?: string;
  outputs: OutputsList;
}
export const ListServiceInstanceOutputsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), outputs: OutputsList }),
).annotations({
  identifier: "ListServiceInstanceOutputsOutput",
}) as any as S.Schema<ListServiceInstanceOutputsOutput>;
export interface ListServiceInstanceProvisionedResourcesOutput {
  nextToken?: string;
  provisionedResources: ProvisionedResourceList;
}
export const ListServiceInstanceProvisionedResourcesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    provisionedResources: ProvisionedResourceList,
  }),
).annotations({
  identifier: "ListServiceInstanceProvisionedResourcesOutput",
}) as any as S.Schema<ListServiceInstanceProvisionedResourcesOutput>;
export interface ServiceInstance {
  name: string;
  arn: string;
  createdAt: Date;
  lastDeploymentAttemptedAt: Date;
  lastDeploymentSucceededAt: Date;
  serviceName: string;
  environmentName: string;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  spec?: string | Redacted.Redacted<string>;
  lastClientRequestToken?: string;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const ServiceInstance = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    serviceName: S.String,
    environmentName: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    spec: S.optional(SensitiveString),
    lastClientRequestToken: S.optional(S.String),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceInstance",
}) as any as S.Schema<ServiceInstance>;
export interface CreateServiceInstanceOutput {
  serviceInstance: ServiceInstance;
}
export const CreateServiceInstanceOutput = S.suspend(() =>
  S.Struct({ serviceInstance: ServiceInstance }),
).annotations({
  identifier: "CreateServiceInstanceOutput",
}) as any as S.Schema<CreateServiceInstanceOutput>;
export interface GetServiceInstanceOutput {
  serviceInstance: ServiceInstance;
}
export const GetServiceInstanceOutput = S.suspend(() =>
  S.Struct({ serviceInstance: ServiceInstance }),
).annotations({
  identifier: "GetServiceInstanceOutput",
}) as any as S.Schema<GetServiceInstanceOutput>;
export interface UpdateServiceInstanceOutput {
  serviceInstance: ServiceInstance;
}
export const UpdateServiceInstanceOutput = S.suspend(() =>
  S.Struct({ serviceInstance: ServiceInstance }),
).annotations({
  identifier: "UpdateServiceInstanceOutput",
}) as any as S.Schema<UpdateServiceInstanceOutput>;
export interface ListServiceInstancesInput {
  serviceName?: string;
  nextToken?: string;
  maxResults?: number;
  filters?: ListServiceInstancesFilterList;
  sortBy?: string;
  sortOrder?: string;
}
export const ListServiceInstancesInput = S.suspend(() =>
  S.Struct({
    serviceName: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ListServiceInstancesFilterList),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServiceInstancesInput",
}) as any as S.Schema<ListServiceInstancesInput>;
export interface ListServicePipelineOutputsOutput {
  nextToken?: string;
  outputs: OutputsList;
}
export const ListServicePipelineOutputsOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), outputs: OutputsList }),
).annotations({
  identifier: "ListServicePipelineOutputsOutput",
}) as any as S.Schema<ListServicePipelineOutputsOutput>;
export interface ListServicePipelineProvisionedResourcesOutput {
  nextToken?: string;
  provisionedResources: ProvisionedResourceList;
}
export const ListServicePipelineProvisionedResourcesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    provisionedResources: ProvisionedResourceList,
  }),
).annotations({
  identifier: "ListServicePipelineProvisionedResourcesOutput",
}) as any as S.Schema<ListServicePipelineProvisionedResourcesOutput>;
export interface ServicePipeline {
  arn: string;
  createdAt: Date;
  lastDeploymentAttemptedAt: Date;
  lastDeploymentSucceededAt: Date;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  spec?: string | Redacted.Redacted<string>;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const ServicePipeline = S.suspend(() =>
  S.Struct({
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    spec: S.optional(SensitiveString),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServicePipeline",
}) as any as S.Schema<ServicePipeline>;
export interface UpdateServicePipelineOutput {
  pipeline: ServicePipeline;
}
export const UpdateServicePipelineOutput = S.suspend(() =>
  S.Struct({ pipeline: ServicePipeline }),
).annotations({
  identifier: "UpdateServicePipelineOutput",
}) as any as S.Schema<UpdateServicePipelineOutput>;
export interface Service {
  name: string;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  templateName: string;
  createdAt: Date;
  lastModifiedAt: Date;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
  spec: string | Redacted.Redacted<string>;
  pipeline?: ServicePipeline;
  repositoryConnectionArn?: string;
  repositoryId?: string;
  branchName?: string;
}
export const Service = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    arn: S.String,
    templateName: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
    spec: SensitiveString,
    pipeline: S.optional(ServicePipeline),
    repositoryConnectionArn: S.optional(S.String),
    repositoryId: S.optional(S.String),
    branchName: S.optional(S.String),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export interface GetServiceOutput {
  service?: Service;
}
export const GetServiceOutput = S.suspend(() =>
  S.Struct({ service: S.optional(Service) }),
).annotations({
  identifier: "GetServiceOutput",
}) as any as S.Schema<GetServiceOutput>;
export interface UpdateServiceOutput {
  service: Service;
}
export const UpdateServiceOutput = S.suspend(() =>
  S.Struct({ service: Service }),
).annotations({
  identifier: "UpdateServiceOutput",
}) as any as S.Schema<UpdateServiceOutput>;
export interface DeleteServiceOutput {
  service?: Service;
}
export const DeleteServiceOutput = S.suspend(() =>
  S.Struct({ service: S.optional(Service) }),
).annotations({
  identifier: "DeleteServiceOutput",
}) as any as S.Schema<DeleteServiceOutput>;
export interface ServiceSyncConfig {
  serviceName: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  filePath: string;
}
export const ServiceSyncConfig = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    filePath: S.String,
  }),
).annotations({
  identifier: "ServiceSyncConfig",
}) as any as S.Schema<ServiceSyncConfig>;
export interface GetServiceSyncConfigOutput {
  serviceSyncConfig?: ServiceSyncConfig;
}
export const GetServiceSyncConfigOutput = S.suspend(() =>
  S.Struct({ serviceSyncConfig: S.optional(ServiceSyncConfig) }),
).annotations({
  identifier: "GetServiceSyncConfigOutput",
}) as any as S.Schema<GetServiceSyncConfigOutput>;
export interface UpdateServiceSyncConfigOutput {
  serviceSyncConfig?: ServiceSyncConfig;
}
export const UpdateServiceSyncConfigOutput = S.suspend(() =>
  S.Struct({ serviceSyncConfig: S.optional(ServiceSyncConfig) }),
).annotations({
  identifier: "UpdateServiceSyncConfigOutput",
}) as any as S.Schema<UpdateServiceSyncConfigOutput>;
export interface DeleteServiceSyncConfigOutput {
  serviceSyncConfig?: ServiceSyncConfig;
}
export const DeleteServiceSyncConfigOutput = S.suspend(() =>
  S.Struct({ serviceSyncConfig: S.optional(ServiceSyncConfig) }),
).annotations({
  identifier: "DeleteServiceSyncConfigOutput",
}) as any as S.Schema<DeleteServiceSyncConfigOutput>;
export interface ServiceTemplate {
  name: string;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  recommendedVersion?: string;
  encryptionKey?: string;
  pipelineProvisioning?: string;
}
export const ServiceTemplate = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    recommendedVersion: S.optional(S.String),
    encryptionKey: S.optional(S.String),
    pipelineProvisioning: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceTemplate",
}) as any as S.Schema<ServiceTemplate>;
export interface GetServiceTemplateOutput {
  serviceTemplate: ServiceTemplate;
}
export const GetServiceTemplateOutput = S.suspend(() =>
  S.Struct({ serviceTemplate: ServiceTemplate }),
).annotations({
  identifier: "GetServiceTemplateOutput",
}) as any as S.Schema<GetServiceTemplateOutput>;
export interface UpdateServiceTemplateOutput {
  serviceTemplate: ServiceTemplate;
}
export const UpdateServiceTemplateOutput = S.suspend(() =>
  S.Struct({ serviceTemplate: ServiceTemplate }),
).annotations({
  identifier: "UpdateServiceTemplateOutput",
}) as any as S.Schema<UpdateServiceTemplateOutput>;
export interface DeleteServiceTemplateOutput {
  serviceTemplate?: ServiceTemplate;
}
export const DeleteServiceTemplateOutput = S.suspend(() =>
  S.Struct({ serviceTemplate: S.optional(ServiceTemplate) }),
).annotations({
  identifier: "DeleteServiceTemplateOutput",
}) as any as S.Schema<DeleteServiceTemplateOutput>;
export interface S3ObjectSource {
  bucket: string;
  key: string;
}
export const S3ObjectSource = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String }),
).annotations({
  identifier: "S3ObjectSource",
}) as any as S.Schema<S3ObjectSource>;
export type TemplateVersionSourceInput = { s3: S3ObjectSource };
export const TemplateVersionSourceInput = S.Union(
  S.Struct({ s3: S3ObjectSource }),
);
export interface CreateServiceTemplateVersionInput {
  clientToken?: string;
  templateName: string;
  description?: string | Redacted.Redacted<string>;
  majorVersion?: string;
  source: (typeof TemplateVersionSourceInput)["Type"];
  compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateInputList;
  tags?: TagList;
  supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
}
export const CreateServiceTemplateVersionInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    templateName: S.String,
    description: S.optional(SensitiveString),
    majorVersion: S.optional(S.String),
    source: TemplateVersionSourceInput,
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateInputList,
    tags: S.optional(TagList),
    supportedComponentSources: S.optional(
      ServiceTemplateSupportedComponentSourceInputList,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServiceTemplateVersionInput",
}) as any as S.Schema<CreateServiceTemplateVersionInput>;
export interface CompatibleEnvironmentTemplate {
  templateName: string;
  majorVersion: string;
}
export const CompatibleEnvironmentTemplate = S.suspend(() =>
  S.Struct({ templateName: S.String, majorVersion: S.String }),
).annotations({
  identifier: "CompatibleEnvironmentTemplate",
}) as any as S.Schema<CompatibleEnvironmentTemplate>;
export type CompatibleEnvironmentTemplateList = CompatibleEnvironmentTemplate[];
export const CompatibleEnvironmentTemplateList = S.Array(
  CompatibleEnvironmentTemplate,
);
export interface ServiceTemplateVersion {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  recommendedMinorVersion?: string;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateList;
  schema?: string | Redacted.Redacted<string>;
  supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
}
export const ServiceTemplateVersion = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    recommendedMinorVersion: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateList,
    schema: S.optional(SensitiveString),
    supportedComponentSources: S.optional(
      ServiceTemplateSupportedComponentSourceInputList,
    ),
  }),
).annotations({
  identifier: "ServiceTemplateVersion",
}) as any as S.Schema<ServiceTemplateVersion>;
export interface UpdateServiceTemplateVersionOutput {
  serviceTemplateVersion: ServiceTemplateVersion;
}
export const UpdateServiceTemplateVersionOutput = S.suspend(() =>
  S.Struct({ serviceTemplateVersion: ServiceTemplateVersion }),
).annotations({
  identifier: "UpdateServiceTemplateVersionOutput",
}) as any as S.Schema<UpdateServiceTemplateVersionOutput>;
export interface DeleteServiceTemplateVersionOutput {
  serviceTemplateVersion?: ServiceTemplateVersion;
}
export const DeleteServiceTemplateVersionOutput = S.suspend(() =>
  S.Struct({ serviceTemplateVersion: S.optional(ServiceTemplateVersion) }),
).annotations({
  identifier: "DeleteServiceTemplateVersionOutput",
}) as any as S.Schema<DeleteServiceTemplateVersionOutput>;
export interface TemplateSyncConfig {
  templateName: string;
  templateType: string;
  repositoryProvider: string;
  repositoryName: string;
  branch: string;
  subdirectory?: string;
}
export const TemplateSyncConfig = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    templateType: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    subdirectory: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateSyncConfig",
}) as any as S.Schema<TemplateSyncConfig>;
export interface GetTemplateSyncConfigOutput {
  templateSyncConfig?: TemplateSyncConfig;
}
export const GetTemplateSyncConfigOutput = S.suspend(() =>
  S.Struct({ templateSyncConfig: S.optional(TemplateSyncConfig) }),
).annotations({
  identifier: "GetTemplateSyncConfigOutput",
}) as any as S.Schema<GetTemplateSyncConfigOutput>;
export interface UpdateTemplateSyncConfigOutput {
  templateSyncConfig?: TemplateSyncConfig;
}
export const UpdateTemplateSyncConfigOutput = S.suspend(() =>
  S.Struct({ templateSyncConfig: S.optional(TemplateSyncConfig) }),
).annotations({
  identifier: "UpdateTemplateSyncConfigOutput",
}) as any as S.Schema<UpdateTemplateSyncConfigOutput>;
export interface DeleteTemplateSyncConfigOutput {
  templateSyncConfig?: TemplateSyncConfig;
}
export const DeleteTemplateSyncConfigOutput = S.suspend(() =>
  S.Struct({ templateSyncConfig: S.optional(TemplateSyncConfig) }),
).annotations({
  identifier: "DeleteTemplateSyncConfigOutput",
}) as any as S.Schema<DeleteTemplateSyncConfigOutput>;
export interface ResourceCountsSummary {
  total: number;
  failed?: number;
  upToDate?: number;
  behindMajor?: number;
  behindMinor?: number;
}
export const ResourceCountsSummary = S.suspend(() =>
  S.Struct({
    total: S.Number,
    failed: S.optional(S.Number),
    upToDate: S.optional(S.Number),
    behindMajor: S.optional(S.Number),
    behindMinor: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourceCountsSummary",
}) as any as S.Schema<ResourceCountsSummary>;
export interface SyncBlockerContext {
  key: string;
  value: string;
}
export const SyncBlockerContext = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({
  identifier: "SyncBlockerContext",
}) as any as S.Schema<SyncBlockerContext>;
export type SyncBlockerContexts = SyncBlockerContext[];
export const SyncBlockerContexts = S.Array(SyncBlockerContext);
export interface SyncBlocker {
  id: string;
  type: string;
  status: string;
  createdReason: string;
  createdAt: Date;
  contexts?: SyncBlockerContexts;
  resolvedReason?: string;
  resolvedAt?: Date;
}
export const SyncBlocker = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: S.String,
    status: S.String,
    createdReason: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    contexts: S.optional(SyncBlockerContexts),
    resolvedReason: S.optional(S.String),
    resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "SyncBlocker" }) as any as S.Schema<SyncBlocker>;
export type LatestSyncBlockers = SyncBlocker[];
export const LatestSyncBlockers = S.Array(SyncBlocker);
export interface CountsSummary {
  components?: ResourceCountsSummary;
  environments?: ResourceCountsSummary;
  environmentTemplates?: ResourceCountsSummary;
  serviceInstances?: ResourceCountsSummary;
  services?: ResourceCountsSummary;
  serviceTemplates?: ResourceCountsSummary;
  pipelines?: ResourceCountsSummary;
}
export const CountsSummary = S.suspend(() =>
  S.Struct({
    components: S.optional(ResourceCountsSummary),
    environments: S.optional(ResourceCountsSummary),
    environmentTemplates: S.optional(ResourceCountsSummary),
    serviceInstances: S.optional(ResourceCountsSummary),
    services: S.optional(ResourceCountsSummary),
    serviceTemplates: S.optional(ResourceCountsSummary),
    pipelines: S.optional(ResourceCountsSummary),
  }),
).annotations({
  identifier: "CountsSummary",
}) as any as S.Schema<CountsSummary>;
export interface RepositorySyncDefinition {
  target: string;
  parent: string;
  branch: string;
  directory: string;
}
export const RepositorySyncDefinition = S.suspend(() =>
  S.Struct({
    target: S.String,
    parent: S.String,
    branch: S.String,
    directory: S.String,
  }),
).annotations({
  identifier: "RepositorySyncDefinition",
}) as any as S.Schema<RepositorySyncDefinition>;
export type RepositorySyncDefinitionList = RepositorySyncDefinition[];
export const RepositorySyncDefinitionList = S.Array(RepositorySyncDefinition);
export interface AccountSettings {
  pipelineServiceRoleArn?: string;
  pipelineProvisioningRepository?: RepositoryBranch;
  pipelineCodebuildRoleArn?: string;
}
export const AccountSettings = S.suspend(() =>
  S.Struct({
    pipelineServiceRoleArn: S.optional(S.String),
    pipelineProvisioningRepository: S.optional(RepositoryBranch),
    pipelineCodebuildRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountSettings",
}) as any as S.Schema<AccountSettings>;
export interface ComponentSummary {
  name: string;
  arn: string;
  environmentName: string;
  serviceName?: string;
  serviceInstanceName?: string;
  createdAt: Date;
  lastModifiedAt: Date;
  lastDeploymentAttemptedAt?: Date;
  lastDeploymentSucceededAt?: Date;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const ComponentSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    environmentName: S.String,
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastDeploymentSucceededAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ComponentSummary",
}) as any as S.Schema<ComponentSummary>;
export type ComponentSummaryList = ComponentSummary[];
export const ComponentSummaryList = S.Array(ComponentSummary);
export interface DeploymentSummary {
  id: string;
  arn: string;
  targetArn: string;
  targetResourceCreatedAt: Date;
  targetResourceType: string;
  createdAt: Date;
  lastModifiedAt: Date;
  completedAt?: Date;
  environmentName: string;
  serviceName?: string;
  serviceInstanceName?: string;
  componentName?: string;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
  deploymentStatus: string;
}
export const DeploymentSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    targetArn: S.String,
    targetResourceCreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    targetResourceType: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    environmentName: S.String,
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
    deploymentStatus: S.String,
  }),
).annotations({
  identifier: "DeploymentSummary",
}) as any as S.Schema<DeploymentSummary>;
export type DeploymentSummaryList = DeploymentSummary[];
export const DeploymentSummaryList = S.Array(DeploymentSummary);
export interface EnvironmentAccountConnectionSummary {
  id: string;
  arn: string;
  managementAccountId: string;
  environmentAccountId: string;
  roleArn: string;
  environmentName: string;
  requestedAt: Date;
  lastModifiedAt: Date;
  status: string;
  componentRoleArn?: string;
}
export const EnvironmentAccountConnectionSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    managementAccountId: S.String,
    environmentAccountId: S.String,
    roleArn: S.String,
    environmentName: S.String,
    requestedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    componentRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentAccountConnectionSummary",
}) as any as S.Schema<EnvironmentAccountConnectionSummary>;
export type EnvironmentAccountConnectionSummaryList =
  EnvironmentAccountConnectionSummary[];
export const EnvironmentAccountConnectionSummaryList = S.Array(
  EnvironmentAccountConnectionSummary,
);
export interface EnvironmentTemplateSummary {
  name: string;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  recommendedVersion?: string;
  provisioning?: string;
}
export const EnvironmentTemplateSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    recommendedVersion: S.optional(S.String),
    provisioning: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentTemplateSummary",
}) as any as S.Schema<EnvironmentTemplateSummary>;
export type EnvironmentTemplateSummaryList = EnvironmentTemplateSummary[];
export const EnvironmentTemplateSummaryList = S.Array(
  EnvironmentTemplateSummary,
);
export interface EnvironmentTemplateVersionSummary {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  recommendedMinorVersion?: string;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
}
export const EnvironmentTemplateVersionSummary = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    recommendedMinorVersion: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "EnvironmentTemplateVersionSummary",
}) as any as S.Schema<EnvironmentTemplateVersionSummary>;
export type EnvironmentTemplateVersionSummaryList =
  EnvironmentTemplateVersionSummary[];
export const EnvironmentTemplateVersionSummaryList = S.Array(
  EnvironmentTemplateVersionSummary,
);
export interface RepositorySummary {
  arn: string;
  provider: string;
  name: string;
  connectionArn: string;
}
export const RepositorySummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    provider: S.String,
    name: S.String,
    connectionArn: S.String,
  }),
).annotations({
  identifier: "RepositorySummary",
}) as any as S.Schema<RepositorySummary>;
export type RepositorySummaryList = RepositorySummary[];
export const RepositorySummaryList = S.Array(RepositorySummary);
export interface ServiceSummary {
  name: string;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  templateName: string;
  createdAt: Date;
  lastModifiedAt: Date;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
}
export const ServiceSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    arn: S.String,
    templateName: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ServiceSummary",
}) as any as S.Schema<ServiceSummary>;
export type ServiceSummaryList = ServiceSummary[];
export const ServiceSummaryList = S.Array(ServiceSummary);
export interface ServiceSyncBlockerSummary {
  serviceName: string;
  serviceInstanceName?: string;
  latestBlockers?: LatestSyncBlockers;
}
export const ServiceSyncBlockerSummary = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    serviceInstanceName: S.optional(S.String),
    latestBlockers: S.optional(LatestSyncBlockers),
  }),
).annotations({
  identifier: "ServiceSyncBlockerSummary",
}) as any as S.Schema<ServiceSyncBlockerSummary>;
export interface ServiceTemplateSummary {
  name: string;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
  displayName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  recommendedVersion?: string;
  pipelineProvisioning?: string;
}
export const ServiceTemplateSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    displayName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    recommendedVersion: S.optional(S.String),
    pipelineProvisioning: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceTemplateSummary",
}) as any as S.Schema<ServiceTemplateSummary>;
export type ServiceTemplateSummaryList = ServiceTemplateSummary[];
export const ServiceTemplateSummaryList = S.Array(ServiceTemplateSummary);
export interface ServiceTemplateVersionSummary {
  templateName: string;
  majorVersion: string;
  minorVersion: string;
  recommendedMinorVersion?: string;
  status: string;
  statusMessage?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  arn: string;
  createdAt: Date;
  lastModifiedAt: Date;
}
export const ServiceTemplateVersionSummary = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    recommendedMinorVersion: S.optional(S.String),
    status: S.String,
    statusMessage: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ServiceTemplateVersionSummary",
}) as any as S.Schema<ServiceTemplateVersionSummary>;
export type ServiceTemplateVersionSummaryList = ServiceTemplateVersionSummary[];
export const ServiceTemplateVersionSummaryList = S.Array(
  ServiceTemplateVersionSummary,
);
export interface CancelComponentDeploymentOutput {
  component: Component;
}
export const CancelComponentDeploymentOutput = S.suspend(() =>
  S.Struct({ component: Component }),
).annotations({
  identifier: "CancelComponentDeploymentOutput",
}) as any as S.Schema<CancelComponentDeploymentOutput>;
export interface CancelEnvironmentDeploymentOutput {
  environment: Environment;
}
export const CancelEnvironmentDeploymentOutput = S.suspend(() =>
  S.Struct({ environment: Environment }),
).annotations({
  identifier: "CancelEnvironmentDeploymentOutput",
}) as any as S.Schema<CancelEnvironmentDeploymentOutput>;
export interface CancelServiceInstanceDeploymentOutput {
  serviceInstance: ServiceInstance;
}
export const CancelServiceInstanceDeploymentOutput = S.suspend(() =>
  S.Struct({ serviceInstance: ServiceInstance }),
).annotations({
  identifier: "CancelServiceInstanceDeploymentOutput",
}) as any as S.Schema<CancelServiceInstanceDeploymentOutput>;
export interface CancelServicePipelineDeploymentOutput {
  pipeline: ServicePipeline;
}
export const CancelServicePipelineDeploymentOutput = S.suspend(() =>
  S.Struct({ pipeline: ServicePipeline }),
).annotations({
  identifier: "CancelServicePipelineDeploymentOutput",
}) as any as S.Schema<CancelServicePipelineDeploymentOutput>;
export interface GetResourcesSummaryOutput {
  counts: CountsSummary;
}
export const GetResourcesSummaryOutput = S.suspend(() =>
  S.Struct({ counts: CountsSummary }),
).annotations({
  identifier: "GetResourcesSummaryOutput",
}) as any as S.Schema<GetResourcesSummaryOutput>;
export interface ListRepositorySyncDefinitionsOutput {
  nextToken?: string;
  syncDefinitions: RepositorySyncDefinitionList;
}
export const ListRepositorySyncDefinitionsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    syncDefinitions: RepositorySyncDefinitionList,
  }),
).annotations({
  identifier: "ListRepositorySyncDefinitionsOutput",
}) as any as S.Schema<ListRepositorySyncDefinitionsOutput>;
export interface GetAccountSettingsOutput {
  accountSettings?: AccountSettings;
}
export const GetAccountSettingsOutput = S.suspend(() =>
  S.Struct({ accountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "GetAccountSettingsOutput",
}) as any as S.Schema<GetAccountSettingsOutput>;
export interface UpdateAccountSettingsOutput {
  accountSettings: AccountSettings;
}
export const UpdateAccountSettingsOutput = S.suspend(() =>
  S.Struct({ accountSettings: AccountSettings }),
).annotations({
  identifier: "UpdateAccountSettingsOutput",
}) as any as S.Schema<UpdateAccountSettingsOutput>;
export interface ListComponentProvisionedResourcesOutput {
  nextToken?: string;
  provisionedResources: ProvisionedResourceList;
}
export const ListComponentProvisionedResourcesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    provisionedResources: ProvisionedResourceList,
  }),
).annotations({
  identifier: "ListComponentProvisionedResourcesOutput",
}) as any as S.Schema<ListComponentProvisionedResourcesOutput>;
export interface ListComponentsOutput {
  nextToken?: string;
  components: ComponentSummaryList;
}
export const ListComponentsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    components: ComponentSummaryList,
  }),
).annotations({
  identifier: "ListComponentsOutput",
}) as any as S.Schema<ListComponentsOutput>;
export interface ListDeploymentsOutput {
  nextToken?: string;
  deployments: DeploymentSummaryList;
}
export const ListDeploymentsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    deployments: DeploymentSummaryList,
  }),
).annotations({
  identifier: "ListDeploymentsOutput",
}) as any as S.Schema<ListDeploymentsOutput>;
export interface CreateEnvironmentAccountConnectionOutput {
  environmentAccountConnection: EnvironmentAccountConnection;
}
export const CreateEnvironmentAccountConnectionOutput = S.suspend(() =>
  S.Struct({ environmentAccountConnection: EnvironmentAccountConnection }),
).annotations({
  identifier: "CreateEnvironmentAccountConnectionOutput",
}) as any as S.Schema<CreateEnvironmentAccountConnectionOutput>;
export interface ListEnvironmentAccountConnectionsOutput {
  environmentAccountConnections: EnvironmentAccountConnectionSummaryList;
  nextToken?: string;
}
export const ListEnvironmentAccountConnectionsOutput = S.suspend(() =>
  S.Struct({
    environmentAccountConnections: EnvironmentAccountConnectionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentAccountConnectionsOutput",
}) as any as S.Schema<ListEnvironmentAccountConnectionsOutput>;
export interface CreateEnvironmentTemplateOutput {
  environmentTemplate: EnvironmentTemplate;
}
export const CreateEnvironmentTemplateOutput = S.suspend(() =>
  S.Struct({ environmentTemplate: EnvironmentTemplate }),
).annotations({
  identifier: "CreateEnvironmentTemplateOutput",
}) as any as S.Schema<CreateEnvironmentTemplateOutput>;
export interface ListEnvironmentTemplatesOutput {
  nextToken?: string;
  templates: EnvironmentTemplateSummaryList;
}
export const ListEnvironmentTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templates: EnvironmentTemplateSummaryList,
  }),
).annotations({
  identifier: "ListEnvironmentTemplatesOutput",
}) as any as S.Schema<ListEnvironmentTemplatesOutput>;
export interface CreateEnvironmentTemplateVersionInput {
  clientToken?: string;
  templateName: string;
  description?: string | Redacted.Redacted<string>;
  majorVersion?: string;
  source: (typeof TemplateVersionSourceInput)["Type"];
  tags?: TagList;
}
export const CreateEnvironmentTemplateVersionInput = S.suspend(() =>
  S.Struct({
    clientToken: S.optional(S.String),
    templateName: S.String,
    description: S.optional(SensitiveString),
    majorVersion: S.optional(S.String),
    source: TemplateVersionSourceInput,
    tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentTemplateVersionInput",
}) as any as S.Schema<CreateEnvironmentTemplateVersionInput>;
export interface GetEnvironmentTemplateVersionOutput {
  environmentTemplateVersion: EnvironmentTemplateVersion;
}
export const GetEnvironmentTemplateVersionOutput = S.suspend(() =>
  S.Struct({ environmentTemplateVersion: EnvironmentTemplateVersion }),
).annotations({
  identifier: "GetEnvironmentTemplateVersionOutput",
}) as any as S.Schema<GetEnvironmentTemplateVersionOutput>;
export interface ListEnvironmentTemplateVersionsOutput {
  nextToken?: string;
  templateVersions: EnvironmentTemplateVersionSummaryList;
}
export const ListEnvironmentTemplateVersionsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templateVersions: EnvironmentTemplateVersionSummaryList,
  }),
).annotations({
  identifier: "ListEnvironmentTemplateVersionsOutput",
}) as any as S.Schema<ListEnvironmentTemplateVersionsOutput>;
export interface CreateRepositoryOutput {
  repository: Repository;
}
export const CreateRepositoryOutput = S.suspend(() =>
  S.Struct({ repository: Repository }),
).annotations({
  identifier: "CreateRepositoryOutput",
}) as any as S.Schema<CreateRepositoryOutput>;
export interface ListRepositoriesOutput {
  nextToken?: string;
  repositories: RepositorySummaryList;
}
export const ListRepositoriesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    repositories: RepositorySummaryList,
  }),
).annotations({
  identifier: "ListRepositoriesOutput",
}) as any as S.Schema<ListRepositoriesOutput>;
export interface CreateServiceOutput {
  service: Service;
}
export const CreateServiceOutput = S.suspend(() =>
  S.Struct({ service: Service }),
).annotations({
  identifier: "CreateServiceOutput",
}) as any as S.Schema<CreateServiceOutput>;
export interface ListServicesOutput {
  nextToken?: string;
  services: ServiceSummaryList;
}
export const ListServicesOutput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), services: ServiceSummaryList }),
).annotations({
  identifier: "ListServicesOutput",
}) as any as S.Schema<ListServicesOutput>;
export interface GetServiceSyncBlockerSummaryOutput {
  serviceSyncBlockerSummary?: ServiceSyncBlockerSummary;
}
export const GetServiceSyncBlockerSummaryOutput = S.suspend(() =>
  S.Struct({
    serviceSyncBlockerSummary: S.optional(ServiceSyncBlockerSummary),
  }),
).annotations({
  identifier: "GetServiceSyncBlockerSummaryOutput",
}) as any as S.Schema<GetServiceSyncBlockerSummaryOutput>;
export interface CreateServiceSyncConfigOutput {
  serviceSyncConfig?: ServiceSyncConfig;
}
export const CreateServiceSyncConfigOutput = S.suspend(() =>
  S.Struct({ serviceSyncConfig: S.optional(ServiceSyncConfig) }),
).annotations({
  identifier: "CreateServiceSyncConfigOutput",
}) as any as S.Schema<CreateServiceSyncConfigOutput>;
export interface CreateServiceTemplateOutput {
  serviceTemplate: ServiceTemplate;
}
export const CreateServiceTemplateOutput = S.suspend(() =>
  S.Struct({ serviceTemplate: ServiceTemplate }),
).annotations({
  identifier: "CreateServiceTemplateOutput",
}) as any as S.Schema<CreateServiceTemplateOutput>;
export interface ListServiceTemplatesOutput {
  nextToken?: string;
  templates: ServiceTemplateSummaryList;
}
export const ListServiceTemplatesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templates: ServiceTemplateSummaryList,
  }),
).annotations({
  identifier: "ListServiceTemplatesOutput",
}) as any as S.Schema<ListServiceTemplatesOutput>;
export interface CreateServiceTemplateVersionOutput {
  serviceTemplateVersion: ServiceTemplateVersion;
}
export const CreateServiceTemplateVersionOutput = S.suspend(() =>
  S.Struct({ serviceTemplateVersion: ServiceTemplateVersion }),
).annotations({
  identifier: "CreateServiceTemplateVersionOutput",
}) as any as S.Schema<CreateServiceTemplateVersionOutput>;
export interface ListServiceTemplateVersionsOutput {
  nextToken?: string;
  templateVersions: ServiceTemplateVersionSummaryList;
}
export const ListServiceTemplateVersionsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templateVersions: ServiceTemplateVersionSummaryList,
  }),
).annotations({
  identifier: "ListServiceTemplateVersionsOutput",
}) as any as S.Schema<ListServiceTemplateVersionsOutput>;
export interface CreateTemplateSyncConfigOutput {
  templateSyncConfig?: TemplateSyncConfig;
}
export const CreateTemplateSyncConfigOutput = S.suspend(() =>
  S.Struct({ templateSyncConfig: S.optional(TemplateSyncConfig) }),
).annotations({
  identifier: "CreateTemplateSyncConfigOutput",
}) as any as S.Schema<CreateTemplateSyncConfigOutput>;
export interface RepositorySyncEvent {
  type: string;
  externalId?: string;
  time: Date;
  event: string;
}
export const RepositorySyncEvent = S.suspend(() =>
  S.Struct({
    type: S.String,
    externalId: S.optional(S.String),
    time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    event: S.String,
  }),
).annotations({
  identifier: "RepositorySyncEvent",
}) as any as S.Schema<RepositorySyncEvent>;
export type RepositorySyncEvents = RepositorySyncEvent[];
export const RepositorySyncEvents = S.Array(RepositorySyncEvent);
export interface RepositorySyncAttempt {
  startedAt: Date;
  status: string;
  events: RepositorySyncEvents;
}
export const RepositorySyncAttempt = S.suspend(() =>
  S.Struct({
    startedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: S.String,
    events: RepositorySyncEvents,
  }),
).annotations({
  identifier: "RepositorySyncAttempt",
}) as any as S.Schema<RepositorySyncAttempt>;
export interface EnvironmentSummary {
  name: string;
  description?: string | Redacted.Redacted<string>;
  createdAt: Date;
  lastDeploymentAttemptedAt: Date;
  lastDeploymentSucceededAt: Date;
  arn: string;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  protonServiceRoleArn?: string;
  environmentAccountConnectionId?: string;
  environmentAccountId?: string;
  provisioning?: string;
  componentRoleArn?: string;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    arn: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    protonServiceRoleArn: S.optional(S.String),
    environmentAccountConnectionId: S.optional(S.String),
    environmentAccountId: S.optional(S.String),
    provisioning: S.optional(S.String),
    componentRoleArn: S.optional(S.String),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export type EnvironmentSummaryList = EnvironmentSummary[];
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export interface ServiceInstanceSummary {
  name: string;
  arn: string;
  createdAt: Date;
  lastDeploymentAttemptedAt: Date;
  lastDeploymentSucceededAt: Date;
  serviceName: string;
  environmentName: string;
  templateName: string;
  templateMajorVersion: string;
  templateMinorVersion: string;
  deploymentStatus: string;
  deploymentStatusMessage?: string | Redacted.Redacted<string>;
  lastAttemptedDeploymentId?: string;
  lastSucceededDeploymentId?: string;
}
export const ServiceInstanceSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    serviceName: S.String,
    environmentName: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.String,
    deploymentStatus: S.String,
    deploymentStatusMessage: S.optional(SensitiveString),
    lastAttemptedDeploymentId: S.optional(S.String),
    lastSucceededDeploymentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceInstanceSummary",
}) as any as S.Schema<ServiceInstanceSummary>;
export type ServiceInstanceSummaryList = ServiceInstanceSummary[];
export const ServiceInstanceSummaryList = S.Array(ServiceInstanceSummary);
export interface GetRepositorySyncStatusOutput {
  latestSync?: RepositorySyncAttempt;
}
export const GetRepositorySyncStatusOutput = S.suspend(() =>
  S.Struct({ latestSync: S.optional(RepositorySyncAttempt) }),
).annotations({
  identifier: "GetRepositorySyncStatusOutput",
}) as any as S.Schema<GetRepositorySyncStatusOutput>;
export interface GetServiceInstanceSyncStatusOutput {
  latestSync?: ResourceSyncAttempt;
  latestSuccessfulSync?: ResourceSyncAttempt;
  desiredState?: Revision;
}
export const GetServiceInstanceSyncStatusOutput = S.suspend(() =>
  S.Struct({
    latestSync: S.optional(ResourceSyncAttempt),
    latestSuccessfulSync: S.optional(ResourceSyncAttempt),
    desiredState: S.optional(Revision),
  }),
).annotations({
  identifier: "GetServiceInstanceSyncStatusOutput",
}) as any as S.Schema<GetServiceInstanceSyncStatusOutput>;
export interface ListEnvironmentsOutput {
  nextToken?: string;
  environments: EnvironmentSummaryList;
}
export const ListEnvironmentsOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environments: EnvironmentSummaryList,
  }),
).annotations({
  identifier: "ListEnvironmentsOutput",
}) as any as S.Schema<ListEnvironmentsOutput>;
export interface CreateEnvironmentTemplateVersionOutput {
  environmentTemplateVersion: EnvironmentTemplateVersion;
}
export const CreateEnvironmentTemplateVersionOutput = S.suspend(() =>
  S.Struct({ environmentTemplateVersion: EnvironmentTemplateVersion }),
).annotations({
  identifier: "CreateEnvironmentTemplateVersionOutput",
}) as any as S.Schema<CreateEnvironmentTemplateVersionOutput>;
export interface ListServiceInstancesOutput {
  nextToken?: string;
  serviceInstances: ServiceInstanceSummaryList;
}
export const ListServiceInstancesOutput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    serviceInstances: ServiceInstanceSummaryList,
  }),
).annotations({
  identifier: "ListServiceInstancesOutput",
}) as any as S.Schema<ListServiceInstancesOutput>;
export interface UpdateServiceSyncBlockerOutput {
  serviceName: string;
  serviceInstanceName?: string;
  serviceSyncBlocker: SyncBlocker;
}
export const UpdateServiceSyncBlockerOutput = S.suspend(() =>
  S.Struct({
    serviceName: S.String,
    serviceInstanceName: S.optional(S.String),
    serviceSyncBlocker: SyncBlocker,
  }),
).annotations({
  identifier: "UpdateServiceSyncBlockerOutput",
}) as any as S.Schema<UpdateServiceSyncBlockerOutput>;
export interface GetServiceTemplateVersionOutput {
  serviceTemplateVersion: ServiceTemplateVersion;
}
export const GetServiceTemplateVersionOutput = S.suspend(() =>
  S.Struct({ serviceTemplateVersion: ServiceTemplateVersion }),
).annotations({
  identifier: "GetServiceTemplateVersionOutput",
}) as any as S.Schema<GetServiceTemplateVersionOutput>;
export interface GetDeploymentOutput {
  deployment?: Deployment;
}
export const GetDeploymentOutput = S.suspend(() =>
  S.Struct({ deployment: S.optional(Deployment) }),
).annotations({
  identifier: "GetDeploymentOutput",
}) as any as S.Schema<GetDeploymentOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: SensitiveString },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: SensitiveString },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: SensitiveString },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: SensitiveString },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: SensitiveString },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: SensitiveString },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: SensitiveString },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List components with summary data. You can filter the result list by environment, service, or a single service instance.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponents: {
  (
    input: ListComponentsInput,
  ): Effect.Effect<
    ListComponentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsInput,
  ) => Stream.Stream<
    ListComponentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsInput,
  ) => Stream.Stream<
    ComponentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsInput,
  output: ListComponentsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "components",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get detailed data for a deployment.
 */
export const getDeployment: (
  input: GetDeploymentInput,
) => Effect.Effect<
  GetDeploymentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentInput,
  output: GetDeploymentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment
 * account from a management account.
 *
 * An environment account connection is a secure bi-directional connection between a *management account* and an environment
 * account that maintains authorization and permissions. For more information, see Environment account connections in the Proton User
 * guide.
 */
export const createEnvironmentAccountConnection: (
  input: CreateEnvironmentAccountConnectionInput,
) => Effect.Effect<
  CreateEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentAccountConnectionInput,
  output: CreateEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List environments with detail data summaries.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsInput,
  ): Effect.Effect<
    ListEnvironmentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsInput,
  ) => Stream.Stream<
    ListEnvironmentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsInput,
  ) => Stream.Stream<
    EnvironmentSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsInput,
  output: ListEnvironmentsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create a new major or minor version of an environment template. A major version of an environment template is a version that
 * *isn't* backwards compatible. A minor version of an environment template is a version that's backwards compatible within its major
 * version.
 */
export const createEnvironmentTemplateVersion: (
  input: CreateEnvironmentTemplateVersionInput,
) => Effect.Effect<
  CreateEnvironmentTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentTemplateVersionInput,
  output: CreateEnvironmentTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List service instances with summary data. This action lists service instances of all
 * services in the Amazon Web Services account.
 */
export const listServiceInstances: {
  (
    input: ListServiceInstancesInput,
  ): Effect.Effect<
    ListServiceInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceInstancesInput,
  ) => Stream.Stream<
    ListServiceInstancesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceInstancesInput,
  ) => Stream.Stream<
    ServiceInstanceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceInstancesInput,
  output: ListServiceInstancesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "serviceInstances",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Update the service sync blocker by resolving it.
 */
export const updateServiceSyncBlocker: (
  input: UpdateServiceSyncBlockerInput,
) => Effect.Effect<
  UpdateServiceSyncBlockerOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSyncBlockerInput,
  output: UpdateServiceSyncBlockerOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for a major or minor version of a service template.
 */
export const getServiceTemplateVersion: (
  input: GetServiceTemplateVersionInput,
) => Effect.Effect<
  GetServiceTemplateVersionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceTemplateVersionInput,
  output: GetServiceTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List provisioned resources for a component with details.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponentProvisionedResources: {
  (
    input: ListComponentProvisionedResourcesInput,
  ): Effect.Effect<
    ListComponentProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentProvisionedResourcesInput,
  ) => Stream.Stream<
    ListComponentProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentProvisionedResourcesInput,
  ) => Stream.Stream<
    ProvisionedResource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentProvisionedResourcesInput,
  output: ListComponentProvisionedResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "provisionedResources",
  } as const,
}));
/**
 * List deployments. You can filter the result list by environment, service, or a single service instance.
 */
export const listDeployments: {
  (
    input: ListDeploymentsInput,
  ): Effect.Effect<
    ListDeploymentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    ListDeploymentsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentsInput,
  ) => Stream.Stream<
    DeploymentSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeploymentsInput,
  output: ListDeploymentsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "deployments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get detailed data for a major or minor version of an environment template.
 */
export const getEnvironmentTemplateVersion: (
  input: GetEnvironmentTemplateVersionInput,
) => Effect.Effect<
  GetEnvironmentTemplateVersionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentTemplateVersionInput,
  output: GetEnvironmentTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List major or minor versions of an environment template with detail data.
 */
export const listEnvironmentTemplateVersions: {
  (
    input: ListEnvironmentTemplateVersionsInput,
  ): Effect.Effect<
    ListEnvironmentTemplateVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentTemplateVersionsInput,
  ) => Stream.Stream<
    ListEnvironmentTemplateVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentTemplateVersionsInput,
  ) => Stream.Stream<
    EnvironmentTemplateVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentTemplateVersionsInput,
  output: ListEnvironmentTemplateVersionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templateVersions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List linked repositories with detail data.
 */
export const listRepositories: {
  (
    input: ListRepositoriesInput,
  ): Effect.Effect<
    ListRepositoriesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoriesInput,
  ) => Stream.Stream<
    ListRepositoriesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoriesInput,
  ) => Stream.Stream<
    RepositorySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRepositoriesInput,
  output: ListRepositoriesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "repositories",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create an Proton service. An Proton service is an instantiation of a service
 * template and often includes several service instances and pipeline. For more information, see
 * Services
 * in the *Proton User Guide*.
 */
export const createService: (
  input: CreateServiceInput,
) => Effect.Effect<
  CreateServiceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceInput,
  output: CreateServiceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for the service sync blocker summary.
 */
export const getServiceSyncBlockerSummary: (
  input: GetServiceSyncBlockerSummaryInput,
) => Effect.Effect<
  GetServiceSyncBlockerSummaryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSyncBlockerSummaryInput,
  output: GetServiceSyncBlockerSummaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a new major or minor version of a service template. A major version of a service
 * template is a version that *isn't* backward compatible. A minor version of
 * a service template is a version that's backward compatible within its major version.
 */
export const createServiceTemplateVersion: (
  input: CreateServiceTemplateVersionInput,
) => Effect.Effect<
  CreateServiceTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceTemplateVersionInput,
  output: CreateServiceTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List major or minor versions of a service template with detail data.
 */
export const listServiceTemplateVersions: {
  (
    input: ListServiceTemplateVersionsInput,
  ): Effect.Effect<
    ListServiceTemplateVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceTemplateVersionsInput,
  ) => Stream.Stream<
    ListServiceTemplateVersionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceTemplateVersionsInput,
  ) => Stream.Stream<
    ServiceTemplateVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceTemplateVersionsInput,
  output: ListServiceTemplateVersionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templateVersions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create an Proton component. A component is an infrastructure extension for a service instance.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const createComponent: (
  input: CreateComponentInput,
) => Effect.Effect<
  CreateComponentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentInput,
  output: CreateComponentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a component.
 *
 * There are a few modes for updating a component. The `deploymentType` field defines the mode.
 *
 * You can't update a component while its deployment status, or the deployment status of a service instance attached to it, is
 * `IN_PROGRESS`.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateComponent: (
  input: UpdateComponentInput,
) => Effect.Effect<
  UpdateComponentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentInput,
  output: UpdateComponentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an Proton component resource.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const deleteComponent: (
  input: DeleteComponentInput,
) => Effect.Effect<
  DeleteComponentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentInput,
  output: DeleteComponentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In an environment account, update an environment account connection to use a new IAM role.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const updateEnvironmentAccountConnection: (
  input: UpdateEnvironmentAccountConnectionInput,
) => Effect.Effect<
  UpdateEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentAccountConnectionInput,
  output: UpdateEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In an environment account, delete an environment account connection.
 *
 * After you delete an environment account connection that’s in use by an Proton environment, Proton *can’t* manage the
 * environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're
 * responsible for cleaning up provisioned resources that remain without an environment connection.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const deleteEnvironmentAccountConnection: (
  input: DeleteEnvironmentAccountConnectionInput,
) => Effect.Effect<
  DeleteEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentAccountConnectionInput,
  output: DeleteEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, Proton
 * can use the associated IAM role to provision environment infrastructure resources in the associated environment account.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const acceptEnvironmentAccountConnection: (
  input: AcceptEnvironmentAccountConnectionInput,
) => Effect.Effect<
  AcceptEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptEnvironmentAccountConnectionInput,
  output: AcceptEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In a management account, reject an environment account connection from another environment account.
 *
 * After you reject an environment account connection request, you *can't* accept or use the rejected environment account
 * connection.
 *
 * You *can’t* reject an environment account connection that's connected to an environment.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const rejectEnvironmentAccountConnection: (
  input: RejectEnvironmentAccountConnectionInput,
) => Effect.Effect<
  RejectEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectEnvironmentAccountConnectionInput,
  output: RejectEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deploy a new environment. An Proton environment is created from an environment template that defines infrastructure and resources that can be
 * shared across services.
 *
 * **You can provision environments using the following methods:**
 *
 * - Amazon Web Services-managed provisioning: Proton makes direct calls to provision your resources.
 *
 * - Self-managed provisioning: Proton makes pull requests on your repository to provide compiled infrastructure as code (IaC) files that your IaC
 * engine uses to provision resources.
 *
 * For more information, see Environments and Provisioning methods in the Proton User
 * Guide.
 */
export const createEnvironment: (
  input: CreateEnvironmentInput,
) => Effect.Effect<
  CreateEnvironmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an environment.
 *
 * If the environment is associated with an environment account connection, *don't* update or include the
 * `protonServiceRoleArn` and `provisioningRepository` parameter to update or connect to an environment account connection.
 *
 * You can only update to a new environment account connection if that connection was created in the same environment account that the current
 * environment account connection was created in. The account connection must also be associated with the current environment.
 *
 * If the environment *isn't* associated with an environment account connection, *don't* update or include the
 * `environmentAccountConnectionId` parameter. You *can't* update or connect the environment to an environment account
 * connection if it *isn't* already associated with an environment connection.
 *
 * You can update either the `environmentAccountConnectionId` or `protonServiceRoleArn` parameter and value. You can’t update
 * both.
 *
 * If the environment was configured for Amazon Web Services-managed provisioning, omit the `provisioningRepository` parameter.
 *
 * If the environment was configured for self-managed provisioning, specify the `provisioningRepository` parameter and omit the
 * `protonServiceRoleArn` and `environmentAccountConnectionId` parameters.
 *
 * For more information, see Environments and Provisioning methods in the Proton User
 * Guide.
 *
 * There are four modes for updating an environment. The `deploymentType` field defines the mode.
 *
 * `NONE`
 *
 * In this mode, a deployment *doesn't* occur. Only the requested metadata parameters are updated.
 *
 * `CURRENT_VERSION`
 *
 * In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated.
 * *Don’t* include minor or major version parameters when you use this `deployment-type`.
 *
 * `MINOR_VERSION`
 *
 * In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in
 * use, by default. You can also specify a different minor version of the current major version in use.
 *
 * `MAJOR_VERSION`
 *
 * In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template,
 * by default. You can also specify a different major version that's higher than the major version in use and a minor version.
 */
export const updateEnvironment: (
  input: UpdateEnvironmentInput,
) => Effect.Effect<
  UpdateEnvironmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an environment.
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentInput,
) => Effect.Effect<
  DeleteEnvironmentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update an environment template.
 */
export const updateEnvironmentTemplate: (
  input: UpdateEnvironmentTemplateInput,
) => Effect.Effect<
  UpdateEnvironmentTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentTemplateInput,
  output: UpdateEnvironmentTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * If no other major or minor versions of an environment template exist, delete the environment template.
 */
export const deleteEnvironmentTemplate: (
  input: DeleteEnvironmentTemplateInput,
) => Effect.Effect<
  DeleteEnvironmentTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentTemplateInput,
  output: DeleteEnvironmentTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a major or minor version of an environment template.
 */
export const updateEnvironmentTemplateVersion: (
  input: UpdateEnvironmentTemplateVersionInput,
) => Effect.Effect<
  UpdateEnvironmentTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentTemplateVersionInput,
  output: UpdateEnvironmentTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the
 * `Recommended` version. Delete the `Recommended` version of the environment template if no other major versions or minor versions
 * of the environment template exist. A major version of an environment template is a version that's not backward compatible.
 *
 * Delete a minor version of an environment template if it *isn't* the `Recommended` version. Delete a
 * `Recommended` minor version of the environment template if no other minor versions of the environment template exist. A minor version of an
 * environment template is a version that's backward compatible.
 */
export const deleteEnvironmentTemplateVersion: (
  input: DeleteEnvironmentTemplateVersionInput,
) => Effect.Effect<
  DeleteEnvironmentTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentTemplateVersionInput,
  output: DeleteEnvironmentTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * De-register and unlink your repository.
 */
export const deleteRepository: (
  input: DeleteRepositoryInput,
) => Effect.Effect<
  DeleteRepositoryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryInput,
  output: DeleteRepositoryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a service instance.
 */
export const createServiceInstance: (
  input: CreateServiceInstanceInput,
) => Effect.Effect<
  CreateServiceInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceInstanceInput,
  output: CreateServiceInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a service instance.
 *
 * There are a few modes for updating a service instance. The `deploymentType`
 * field defines the mode.
 *
 * You can't update a service instance while its deployment status, or the deployment
 * status of a component attached to it, is `IN_PROGRESS`.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateServiceInstance: (
  input: UpdateServiceInstanceInput,
) => Effect.Effect<
  UpdateServiceInstanceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceInstanceInput,
  output: UpdateServiceInstanceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the service pipeline.
 *
 * There are four modes for updating a service pipeline. The `deploymentType`
 * field defines the mode.
 *
 * `NONE`
 *
 * In this mode, a deployment *doesn't* occur. Only the requested
 * metadata parameters are updated.
 *
 * `CURRENT_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the new spec that
 * you provide. Only requested parameters are updated. *Don’t* include
 * major or minor version parameters when you use this `deployment-type`.
 *
 * `MINOR_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the published,
 * recommended (latest) minor version of the current major version in use, by default. You
 * can specify a different minor version of the current major version in use.
 *
 * `MAJOR_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the published,
 * recommended (latest) major and minor version of the current template by default. You can
 * specify a different major version that's higher than the major version in use and a
 * minor version.
 */
export const updateServicePipeline: (
  input: UpdateServicePipelineInput,
) => Effect.Effect<
  UpdateServicePipelineOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServicePipelineInput,
  output: UpdateServicePipelineOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Edit a service description or use a spec to add and delete service instances.
 *
 * Existing service instances and the service pipeline *can't* be edited
 * using this API. They can only be deleted.
 *
 * Use the `description` parameter to modify the description.
 *
 * Edit the `spec` parameter to add or delete instances.
 *
 * You can't delete a service instance (remove it from the spec) if it has an attached
 * component.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateService: (
  input: UpdateServiceInput,
) => Effect.Effect<
  UpdateServiceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceInput,
  output: UpdateServiceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a service, with its instances and pipeline.
 *
 * You can't delete a service if it has any service instances that have components attached
 * to them.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const deleteService: (
  input: DeleteServiceInput,
) => Effect.Effect<
  DeleteServiceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceInput,
  output: DeleteServiceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the Proton Ops config file.
 */
export const updateServiceSyncConfig: (
  input: UpdateServiceSyncConfigInput,
) => Effect.Effect<
  UpdateServiceSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceSyncConfigInput,
  output: UpdateServiceSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete the Proton Ops file.
 */
export const deleteServiceSyncConfig: (
  input: DeleteServiceSyncConfigInput,
) => Effect.Effect<
  DeleteServiceSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceSyncConfigInput,
  output: DeleteServiceSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a service template.
 */
export const updateServiceTemplate: (
  input: UpdateServiceTemplateInput,
) => Effect.Effect<
  UpdateServiceTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceTemplateInput,
  output: UpdateServiceTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * If no other major or minor versions of the service template exist, delete the service
 * template.
 */
export const deleteServiceTemplate: (
  input: DeleteServiceTemplateInput,
) => Effect.Effect<
  DeleteServiceTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceTemplateInput,
  output: DeleteServiceTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a major or minor version of a service template.
 */
export const updateServiceTemplateVersion: (
  input: UpdateServiceTemplateVersionInput,
) => Effect.Effect<
  UpdateServiceTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceTemplateVersionInput,
  output: UpdateServiceTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * If no other minor versions of a service template exist, delete a major version of the
 * service template if it's not the `Recommended` version. Delete the
 * `Recommended` version of the service template if no other major versions or minor
 * versions of the service template exist. A major version of a service template is a version
 * that *isn't* backwards compatible.
 *
 * Delete a minor version of a service template if it's not the `Recommended`
 * version. Delete a `Recommended` minor version of the service template if no other
 * minor versions of the service template exist. A minor version of a service template is a
 * version that's backwards compatible.
 */
export const deleteServiceTemplateVersion: (
  input: DeleteServiceTemplateVersionInput,
) => Effect.Effect<
  DeleteServiceTemplateVersionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceTemplateVersionInput,
  output: DeleteServiceTemplateVersionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update template sync configuration parameters, except for the `templateName` and `templateType`. Repository details
 * (branch, name, and provider) should be of a linked repository. A linked repository is a repository that has been registered with Proton. For
 * more information, see CreateRepository.
 */
export const updateTemplateSyncConfig: (
  input: UpdateTemplateSyncConfigInput,
) => Effect.Effect<
  UpdateTemplateSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateSyncConfigInput,
  output: UpdateTemplateSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a template sync configuration.
 */
export const deleteTemplateSyncConfig: (
  input: DeleteTemplateSyncConfigInput,
) => Effect.Effect<
  DeleteTemplateSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateSyncConfigInput,
  output: DeleteTemplateSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Notify Proton of status changes to a provisioned resource when you use self-managed provisioning.
 *
 * For more information, see Self-managed provisioning in the *Proton User Guide*.
 */
export const notifyResourceDeploymentStatusChange: (
  input: NotifyResourceDeploymentStatusChangeInput,
) => Effect.Effect<
  NotifyResourceDeploymentStatusChangeOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyResourceDeploymentStatusChangeInput,
  output: NotifyResourceDeploymentStatusChangeOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tag a resource. A tag is a key-value pair of metadata that you associate with an Proton resource.
 *
 * For more information, see Proton resources and tagging in
 * the *Proton User Guide*.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attempts to cancel a component deployment (for a component that is in the `IN_PROGRESS` deployment status).
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const cancelComponentDeployment: (
  input: CancelComponentDeploymentInput,
) => Effect.Effect<
  CancelComponentDeploymentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelComponentDeploymentInput,
  output: CancelComponentDeploymentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is `IN_PROGRESS`. For more
 * information, see Update an environment in the Proton
 * User guide.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is `FAILED`.
 *
 * - If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is
 * `SUCCEEDED` and the cancellation attempt has no effect.
 */
export const cancelEnvironmentDeployment: (
  input: CancelEnvironmentDeploymentInput,
) => Effect.Effect<
  CancelEnvironmentDeploymentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelEnvironmentDeploymentInput,
  output: CancelEnvironmentDeploymentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is `IN_PROGRESS`. For
 * more information, see Update a service instance
 * in the *Proton User guide*.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is
 * `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is
 * `FAILED`.
 *
 * - If the current UpdateServiceInstance action succeeds before the
 * cancellation attempt starts, the resulting deployment state is `SUCCEEDED` and
 * the cancellation attempt has no effect.
 */
export const cancelServiceInstanceDeployment: (
  input: CancelServiceInstanceDeploymentInput,
) => Effect.Effect<
  CancelServiceInstanceDeploymentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelServiceInstanceDeploymentInput,
  output: CancelServiceInstanceDeploymentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is `IN_PROGRESS`. For
 * more information, see Update a service pipeline
 * in the *Proton User guide*.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is
 * `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is
 * `FAILED`.
 *
 * - If the current UpdateServicePipeline action succeeds before the
 * cancellation attempt starts, the resulting deployment state is `SUCCEEDED` and
 * the cancellation attempt has no effect.
 */
export const cancelServicePipelineDeployment: (
  input: CancelServicePipelineDeploymentInput,
) => Effect.Effect<
  CancelServicePipelineDeploymentOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelServicePipelineDeploymentInput,
  output: CancelServicePipelineDeploymentOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for a component.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const getComponent: (
  input: GetComponentInput,
) => Effect.Effect<
  GetComponentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentInput,
  output: GetComponentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete the deployment.
 */
export const deleteDeployment: (
  input: DeleteDeploymentInput,
) => Effect.Effect<
  DeleteDeploymentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentInput,
  output: DeleteDeploymentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In an environment account, get the detailed data for an environment account connection.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const getEnvironmentAccountConnection: (
  input: GetEnvironmentAccountConnectionInput,
) => Effect.Effect<
  GetEnvironmentAccountConnectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentAccountConnectionInput,
  output: GetEnvironmentAccountConnectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the infrastructure as code outputs for your environment.
 */
export const listEnvironmentOutputs: {
  (
    input: ListEnvironmentOutputsInput,
  ): Effect.Effect<
    ListEnvironmentOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentOutputsInput,
  ) => Stream.Stream<
    ListEnvironmentOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentOutputsInput,
  ) => Stream.Stream<
    Output,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentOutputsInput,
  output: ListEnvironmentOutputsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "outputs",
  } as const,
}));
/**
 * List the provisioned resources for your environment.
 */
export const listEnvironmentProvisionedResources: {
  (
    input: ListEnvironmentProvisionedResourcesInput,
  ): Effect.Effect<
    ListEnvironmentProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentProvisionedResourcesInput,
  ) => Stream.Stream<
    ListEnvironmentProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentProvisionedResourcesInput,
  ) => Stream.Stream<
    ProvisionedResource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentProvisionedResourcesInput,
  output: ListEnvironmentProvisionedResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "provisionedResources",
  } as const,
}));
/**
 * Get detailed data for an environment.
 */
export const getEnvironment: (
  input: GetEnvironmentInput,
) => Effect.Effect<
  GetEnvironmentOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for an environment template.
 */
export const getEnvironmentTemplate: (
  input: GetEnvironmentTemplateInput,
) => Effect.Effect<
  GetEnvironmentTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentTemplateInput,
  output: GetEnvironmentTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detail data for a linked repository.
 */
export const getRepository: (
  input: GetRepositoryInput,
) => Effect.Effect<
  GetRepositoryOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryInput,
  output: GetRepositoryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list service of instance Infrastructure as Code (IaC) outputs.
 */
export const listServiceInstanceOutputs: {
  (
    input: ListServiceInstanceOutputsInput,
  ): Effect.Effect<
    ListServiceInstanceOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceInstanceOutputsInput,
  ) => Stream.Stream<
    ListServiceInstanceOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceInstanceOutputsInput,
  ) => Stream.Stream<
    Output,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceInstanceOutputsInput,
  output: ListServiceInstanceOutputsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "outputs",
  } as const,
}));
/**
 * List provisioned resources for a service instance with details.
 */
export const listServiceInstanceProvisionedResources: {
  (
    input: ListServiceInstanceProvisionedResourcesInput,
  ): Effect.Effect<
    ListServiceInstanceProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceInstanceProvisionedResourcesInput,
  ) => Stream.Stream<
    ListServiceInstanceProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceInstanceProvisionedResourcesInput,
  ) => Stream.Stream<
    ProvisionedResource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceInstanceProvisionedResourcesInput,
  output: ListServiceInstanceProvisionedResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "provisionedResources",
  } as const,
}));
/**
 * Get detailed data for a service instance. A service instance is an instantiation of
 * service template and it runs in a specific environment.
 */
export const getServiceInstance: (
  input: GetServiceInstanceInput,
) => Effect.Effect<
  GetServiceInstanceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInstanceInput,
  output: GetServiceInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of service pipeline Infrastructure as Code (IaC) outputs.
 */
export const listServicePipelineOutputs: {
  (
    input: ListServicePipelineOutputsInput,
  ): Effect.Effect<
    ListServicePipelineOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicePipelineOutputsInput,
  ) => Stream.Stream<
    ListServicePipelineOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicePipelineOutputsInput,
  ) => Stream.Stream<
    Output,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicePipelineOutputsInput,
  output: ListServicePipelineOutputsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "outputs",
  } as const,
}));
/**
 * List provisioned resources for a service and pipeline with details.
 */
export const listServicePipelineProvisionedResources: {
  (
    input: ListServicePipelineProvisionedResourcesInput,
  ): Effect.Effect<
    ListServicePipelineProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicePipelineProvisionedResourcesInput,
  ) => Stream.Stream<
    ListServicePipelineProvisionedResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicePipelineProvisionedResourcesInput,
  ) => Stream.Stream<
    ProvisionedResource,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicePipelineProvisionedResourcesInput,
  output: ListServicePipelineProvisionedResourcesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "provisionedResources",
  } as const,
}));
/**
 * Get detailed data for a service.
 */
export const getService: (
  input: GetServiceInput,
) => Effect.Effect<
  GetServiceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInput,
  output: GetServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed information for the service sync configuration.
 */
export const getServiceSyncConfig: (
  input: GetServiceSyncConfigInput,
) => Effect.Effect<
  GetServiceSyncConfigOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSyncConfigInput,
  output: GetServiceSyncConfigOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for a service template.
 */
export const getServiceTemplate: (
  input: GetServiceTemplateInput,
) => Effect.Effect<
  GetServiceTemplateOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceTemplateInput,
  output: GetServiceTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detail data for a template sync configuration.
 */
export const getTemplateSyncConfig: (
  input: GetTemplateSyncConfigInput,
) => Effect.Effect<
  GetTemplateSyncConfigOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateSyncConfigInput,
  output: GetTemplateSyncConfigOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the status of a template sync.
 */
export const getTemplateSyncStatus: (
  input: GetTemplateSyncStatusInput,
) => Effect.Effect<
  GetTemplateSyncStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateSyncStatusInput,
  output: GetTemplateSyncStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List tags for a resource. For more information, see Proton
 * resources and tagging in the *Proton User Guide*.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceInput,
  ): Effect.Effect<
    ListTagsForResourceOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceInput,
  ) => Stream.Stream<
    ListTagsForResourceOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceInput,
  ) => Stream.Stream<
    Tag,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tags",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Remove a customer tag from a resource. A tag is a key-value pair of metadata associated with an Proton resource.
 *
 * For more information, see Proton resources and tagging in
 * the *Proton User Guide*.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detail data for Proton account-wide settings.
 */
export const getAccountSettings: (
  input: GetAccountSettingsInput,
) => Effect.Effect<
  GetAccountSettingsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsInput,
  output: GetAccountSettingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the sync status of a repository used for Proton template sync. For more information about template sync, see .
 *
 * A repository sync status isn't tied to the Proton Repository resource (or any other Proton resource). Therefore, tags on an Proton Repository resource
 * have no effect on this action. Specifically, you can't use these tags to control access to this action using Attribute-based access control
 * (ABAC).
 *
 * For more information about ABAC, see ABAC in the Proton User
 * Guide.
 */
export const getRepositorySyncStatus: (
  input: GetRepositorySyncStatusInput,
) => Effect.Effect<
  GetRepositorySyncStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositorySyncStatusInput,
  output: GetRepositorySyncStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the status of the synced service instance.
 */
export const getServiceInstanceSyncStatus: (
  input: GetServiceInstanceSyncStatusInput,
) => Effect.Effect<
  GetServiceInstanceSyncStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInstanceSyncStatusInput,
  output: GetServiceInstanceSyncStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * View a list of environment account connections.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const listEnvironmentAccountConnections: {
  (
    input: ListEnvironmentAccountConnectionsInput,
  ): Effect.Effect<
    ListEnvironmentAccountConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentAccountConnectionsInput,
  ) => Stream.Stream<
    ListEnvironmentAccountConnectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentAccountConnectionsInput,
  ) => Stream.Stream<
    EnvironmentAccountConnectionSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentAccountConnectionsInput,
  output: ListEnvironmentAccountConnectionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "environmentAccountConnections",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List environment templates.
 */
export const listEnvironmentTemplates: {
  (
    input: ListEnvironmentTemplatesInput,
  ): Effect.Effect<
    ListEnvironmentTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentTemplatesInput,
  ) => Stream.Stream<
    ListEnvironmentTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentTemplatesInput,
  ) => Stream.Stream<
    EnvironmentTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentTemplatesInput,
  output: ListEnvironmentTemplatesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List services with summaries of detail data.
 */
export const listServices: {
  (
    input: ListServicesInput,
  ): Effect.Effect<
    ListServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesInput,
  ) => Stream.Stream<
    ListServicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesInput,
  ) => Stream.Stream<
    ServiceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesInput,
  output: ListServicesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "services",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List service templates with detail data.
 */
export const listServiceTemplates: {
  (
    input: ListServiceTemplatesInput,
  ): Effect.Effect<
    ListServiceTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceTemplatesInput,
  ) => Stream.Stream<
    ListServiceTemplatesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceTemplatesInput,
  ) => Stream.Stream<
    ServiceTemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceTemplatesInput,
  output: ListServiceTemplatesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get counts of Proton resources.
 *
 * For infrastructure-provisioning resources (environments, services, service instances, pipelines), the action returns staleness counts. A
 * resource is stale when it's behind the recommended version of the Proton template that it uses and it needs an update to become current.
 *
 * The action returns staleness counts (counts of resources that are up-to-date, behind a template major version, or behind a template minor
 * version), the total number of resources, and the number of resources that are in a failed state, grouped by resource type. Components,
 * environments, and service templates return less information - see the `components`, `environments`, and
 * `serviceTemplates` field descriptions.
 *
 * For context, the action also returns the total number of each type of Proton template in the Amazon Web Services account.
 *
 * For more information, see Proton dashboard in the
 * *Proton User Guide*.
 */
export const getResourcesSummary: (
  input: GetResourcesSummaryInput,
) => Effect.Effect<
  GetResourcesSummaryOutput,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcesSummaryInput,
  output: GetResourcesSummaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List repository sync definitions with detail data.
 */
export const listRepositorySyncDefinitions: {
  (
    input: ListRepositorySyncDefinitionsInput,
  ): Effect.Effect<
    ListRepositorySyncDefinitionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositorySyncDefinitionsInput,
  ) => Stream.Stream<
    ListRepositorySyncDefinitionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositorySyncDefinitionsInput,
  ) => Stream.Stream<
    RepositorySyncDefinition,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRepositorySyncDefinitionsInput,
  output: ListRepositorySyncDefinitionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "syncDefinitions",
  } as const,
}));
/**
 * Update Proton settings that are used for multiple services in the Amazon Web Services account.
 */
export const updateAccountSettings: (
  input: UpdateAccountSettingsInput,
) => Effect.Effect<
  UpdateAccountSettingsOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSettingsInput,
  output: UpdateAccountSettingsOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of component Infrastructure as Code (IaC) outputs.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponentOutputs: {
  (
    input: ListComponentOutputsInput,
  ): Effect.Effect<
    ListComponentOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentOutputsInput,
  ) => Stream.Stream<
    ListComponentOutputsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentOutputsInput,
  ) => Stream.Stream<
    Output,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentOutputsInput,
  output: ListComponentOutputsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "outputs",
  } as const,
}));
/**
 * Create an environment template for Proton. For more information, see Environment Templates in the *Proton User Guide*.
 *
 * You can create an environment template in one of the two following ways:
 *
 * - Register and publish a *standard* environment template that instructs Proton to deploy and manage environment
 * infrastructure.
 *
 * - Register and publish a *customer managed* environment template that connects Proton to your existing provisioned
 * infrastructure that you manage. Proton *doesn't* manage your existing provisioned infrastructure. To create an environment
 * template for customer provisioned and managed infrastructure, include the `provisioning` parameter and set the value to
 * `CUSTOMER_MANAGED`. For more information, see Register
 * and publish an environment template in the *Proton User Guide*.
 */
export const createEnvironmentTemplate: (
  input: CreateEnvironmentTemplateInput,
) => Effect.Effect<
  CreateEnvironmentTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentTemplateInput,
  output: CreateEnvironmentTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create and register a link to a repository. Proton uses the link to repeatedly access the repository, to either push to it (self-managed
 * provisioning) or pull from it (template sync). You can share a linked repository across multiple resources (like environments using self-managed
 * provisioning, or synced templates). When you create a repository link, Proton creates a service-linked role for you.
 *
 * For more information, see Self-managed provisioning, Template bundles, and
 * Template sync configurations in the Proton
 * User Guide.
 */
export const createRepository: (
  input: CreateRepositoryInput,
) => Effect.Effect<
  CreateRepositoryOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryInput,
  output: CreateRepositoryOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create the Proton Ops configuration file.
 */
export const createServiceSyncConfig: (
  input: CreateServiceSyncConfigInput,
) => Effect.Effect<
  CreateServiceSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceSyncConfigInput,
  output: CreateServiceSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a service template. The administrator creates a service template to define
 * standardized infrastructure and an optional CI/CD service pipeline. Developers, in turn,
 * select the service template from Proton. If the selected service template includes a
 * service pipeline definition, they provide a link to their source code repository. Proton
 * then deploys and manages the infrastructure defined by the selected service template. For more
 * information, see Proton templates in the *Proton User Guide*.
 */
export const createServiceTemplate: (
  input: CreateServiceTemplateInput,
) => Effect.Effect<
  CreateServiceTemplateOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceTemplateInput,
  output: CreateServiceTemplateOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set up a template to create new template versions automatically by tracking a linked repository. A linked repository is a repository that has
 * been registered with Proton. For more information, see CreateRepository.
 *
 * When a commit is pushed to your linked repository, Proton checks for changes to your repository template bundles. If it detects a template
 * bundle change, a new major or minor version of its template is created, if the version doesn’t already exist. For more information, see Template sync configurations in the Proton
 * User Guide.
 */
export const createTemplateSyncConfig: (
  input: CreateTemplateSyncConfigInput,
) => Effect.Effect<
  CreateTemplateSyncConfigOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateSyncConfigInput,
  output: CreateTemplateSyncConfigOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
