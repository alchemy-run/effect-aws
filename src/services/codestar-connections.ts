import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "CodeStar connections",
  serviceShapeName: "CodeStar_connections_20191201",
});
const auth = T.AwsAuthSigv4({ name: "codestar-connections" });
const ver = T.ServiceVersion("2019-12-01");
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
              `https://codestar-connections-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://codestar-connections-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://codestar-connections.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://codestar-connections.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ConnectionName = string;
export type HostArn = string;
export type HostName = string;
export type Url = string;
export type ConnectionArn = string;
export type OwnerId = string;
export type RepositoryName = string;
export type KmsKeyArn = string;
export type BranchName = string;
export type DeploymentFilePath = string;
export type RepositoryLinkId = string;
export type ResourceName = string;
export type IamRoleArn = string;
export type MaxResults = number;
export type NextToken = string;
export type SharpNextToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type Id = string;
export type ResolvedReason = string;
export type TagValue = string;
export type VpcId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type TlsCertificate = string;
export type ErrorMessage = string;
export type HostStatus = string;
export type RepositoryLinkArn = string;
export type AccountId = string;
export type Directory = string;
export type SHA = string;
export type Target = string;
export type HostStatusMessage = string;
export type Parent = string;
export type CreatedReason = string;
export type Event = string;
export type ExternalId = string;
export type Type = string;
export type SyncBlockerContextKey = string;
export type SyncBlockerContextValue = string;

//# Schemas
export type ProviderType =
  | "Bitbucket"
  | "GitHub"
  | "GitHubEnterpriseServer"
  | "GitLab"
  | "GitLabSelfManaged"
  | (string & {});
export const ProviderType = S.String;
export type SyncConfigurationType = "CFN_STACK_SYNC" | (string & {});
export const SyncConfigurationType = S.String;
export type PublishDeploymentStatus = "ENABLED" | "DISABLED" | (string & {});
export const PublishDeploymentStatus = S.String;
export type TriggerResourceUpdateOn =
  | "ANY_CHANGE"
  | "FILE_CHANGE"
  | (string & {});
export const TriggerResourceUpdateOn = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateRepositoryLinkInput {
  ConnectionArn: string;
  OwnerId: string;
  RepositoryName: string;
  EncryptionKeyArn?: string;
  Tags?: Tag[];
}
export const CreateRepositoryLinkInput = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.String,
    OwnerId: S.String,
    RepositoryName: S.String,
    EncryptionKeyArn: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRepositoryLinkInput",
}) as any as S.Schema<CreateRepositoryLinkInput>;
export interface CreateSyncConfigurationInput {
  Branch: string;
  ConfigFile: string;
  RepositoryLinkId: string;
  ResourceName: string;
  RoleArn: string;
  SyncType: SyncConfigurationType;
  PublishDeploymentStatus?: PublishDeploymentStatus;
  TriggerResourceUpdateOn?: TriggerResourceUpdateOn;
}
export const CreateSyncConfigurationInput = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    ConfigFile: S.String,
    RepositoryLinkId: S.String,
    ResourceName: S.String,
    RoleArn: S.String,
    SyncType: SyncConfigurationType,
    PublishDeploymentStatus: S.optional(PublishDeploymentStatus),
    TriggerResourceUpdateOn: S.optional(TriggerResourceUpdateOn),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSyncConfigurationInput",
}) as any as S.Schema<CreateSyncConfigurationInput>;
export interface DeleteConnectionInput {
  ConnectionArn: string;
}
export const DeleteConnectionInput = S.suspend(() =>
  S.Struct({ ConnectionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteConnectionInput",
}) as any as S.Schema<DeleteConnectionInput>;
export interface DeleteConnectionOutput {}
export const DeleteConnectionOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteConnectionOutput" },
) as any as S.Schema<DeleteConnectionOutput>;
export interface DeleteHostInput {
  HostArn: string;
}
export const DeleteHostInput = S.suspend(() =>
  S.Struct({ HostArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteHostInput",
}) as any as S.Schema<DeleteHostInput>;
export interface DeleteHostOutput {}
export const DeleteHostOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteHostOutput",
}) as any as S.Schema<DeleteHostOutput>;
export interface DeleteRepositoryLinkInput {
  RepositoryLinkId: string;
}
export const DeleteRepositoryLinkInput = S.suspend(() =>
  S.Struct({ RepositoryLinkId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRepositoryLinkInput",
}) as any as S.Schema<DeleteRepositoryLinkInput>;
export interface DeleteRepositoryLinkOutput {}
export const DeleteRepositoryLinkOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRepositoryLinkOutput",
}) as any as S.Schema<DeleteRepositoryLinkOutput>;
export interface DeleteSyncConfigurationInput {
  SyncType: SyncConfigurationType;
  ResourceName: string;
}
export const DeleteSyncConfigurationInput = S.suspend(() =>
  S.Struct({ SyncType: SyncConfigurationType, ResourceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSyncConfigurationInput",
}) as any as S.Schema<DeleteSyncConfigurationInput>;
export interface DeleteSyncConfigurationOutput {}
export const DeleteSyncConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSyncConfigurationOutput",
}) as any as S.Schema<DeleteSyncConfigurationOutput>;
export interface GetConnectionInput {
  ConnectionArn: string;
}
export const GetConnectionInput = S.suspend(() =>
  S.Struct({ ConnectionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionInput",
}) as any as S.Schema<GetConnectionInput>;
export interface GetHostInput {
  HostArn: string;
}
export const GetHostInput = S.suspend(() =>
  S.Struct({ HostArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({ identifier: "GetHostInput" }) as any as S.Schema<GetHostInput>;
export interface GetRepositoryLinkInput {
  RepositoryLinkId: string;
}
export const GetRepositoryLinkInput = S.suspend(() =>
  S.Struct({ RepositoryLinkId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRepositoryLinkInput",
}) as any as S.Schema<GetRepositoryLinkInput>;
export interface GetRepositorySyncStatusInput {
  Branch: string;
  RepositoryLinkId: string;
  SyncType: SyncConfigurationType;
}
export const GetRepositorySyncStatusInput = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    RepositoryLinkId: S.String,
    SyncType: SyncConfigurationType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRepositorySyncStatusInput",
}) as any as S.Schema<GetRepositorySyncStatusInput>;
export interface GetResourceSyncStatusInput {
  ResourceName: string;
  SyncType: SyncConfigurationType;
}
export const GetResourceSyncStatusInput = S.suspend(() =>
  S.Struct({ ResourceName: S.String, SyncType: SyncConfigurationType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceSyncStatusInput",
}) as any as S.Schema<GetResourceSyncStatusInput>;
export interface GetSyncBlockerSummaryInput {
  SyncType: SyncConfigurationType;
  ResourceName: string;
}
export const GetSyncBlockerSummaryInput = S.suspend(() =>
  S.Struct({ SyncType: SyncConfigurationType, ResourceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSyncBlockerSummaryInput",
}) as any as S.Schema<GetSyncBlockerSummaryInput>;
export interface GetSyncConfigurationInput {
  SyncType: SyncConfigurationType;
  ResourceName: string;
}
export const GetSyncConfigurationInput = S.suspend(() =>
  S.Struct({ SyncType: SyncConfigurationType, ResourceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSyncConfigurationInput",
}) as any as S.Schema<GetSyncConfigurationInput>;
export interface ListConnectionsInput {
  ProviderTypeFilter?: ProviderType;
  HostArnFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectionsInput = S.suspend(() =>
  S.Struct({
    ProviderTypeFilter: S.optional(ProviderType),
    HostArnFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConnectionsInput",
}) as any as S.Schema<ListConnectionsInput>;
export interface ListHostsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListHostsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListHostsInput",
}) as any as S.Schema<ListHostsInput>;
export interface ListRepositoryLinksInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListRepositoryLinksInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRepositoryLinksInput",
}) as any as S.Schema<ListRepositoryLinksInput>;
export interface ListRepositorySyncDefinitionsInput {
  RepositoryLinkId: string;
  SyncType: SyncConfigurationType;
}
export const ListRepositorySyncDefinitionsInput = S.suspend(() =>
  S.Struct({
    RepositoryLinkId: S.String,
    SyncType: SyncConfigurationType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRepositorySyncDefinitionsInput",
}) as any as S.Schema<ListRepositorySyncDefinitionsInput>;
export interface ListSyncConfigurationsInput {
  MaxResults?: number;
  NextToken?: string;
  RepositoryLinkId: string;
  SyncType: SyncConfigurationType;
}
export const ListSyncConfigurationsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    RepositoryLinkId: S.String,
    SyncType: SyncConfigurationType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSyncConfigurationsInput",
}) as any as S.Schema<ListSyncConfigurationsInput>;
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface TagResourceInput {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfiguration {
  VpcId: string;
  SubnetIds: string[];
  SecurityGroupIds: string[];
  TlsCertificate?: string;
}
export const VpcConfiguration = S.suspend(() =>
  S.Struct({
    VpcId: S.String,
    SubnetIds: SubnetIds,
    SecurityGroupIds: SecurityGroupIds,
    TlsCertificate: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcConfiguration",
}) as any as S.Schema<VpcConfiguration>;
export interface UpdateHostInput {
  HostArn: string;
  ProviderEndpoint?: string;
  VpcConfiguration?: VpcConfiguration;
}
export const UpdateHostInput = S.suspend(() =>
  S.Struct({
    HostArn: S.String,
    ProviderEndpoint: S.optional(S.String),
    VpcConfiguration: S.optional(VpcConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateHostInput",
}) as any as S.Schema<UpdateHostInput>;
export interface UpdateHostOutput {}
export const UpdateHostOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateHostOutput",
}) as any as S.Schema<UpdateHostOutput>;
export interface UpdateRepositoryLinkInput {
  ConnectionArn?: string;
  EncryptionKeyArn?: string;
  RepositoryLinkId: string;
}
export const UpdateRepositoryLinkInput = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    RepositoryLinkId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRepositoryLinkInput",
}) as any as S.Schema<UpdateRepositoryLinkInput>;
export interface UpdateSyncBlockerInput {
  Id: string;
  SyncType: SyncConfigurationType;
  ResourceName: string;
  ResolvedReason: string;
}
export const UpdateSyncBlockerInput = S.suspend(() =>
  S.Struct({
    Id: S.String,
    SyncType: SyncConfigurationType,
    ResourceName: S.String,
    ResolvedReason: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSyncBlockerInput",
}) as any as S.Schema<UpdateSyncBlockerInput>;
export interface UpdateSyncConfigurationInput {
  Branch?: string;
  ConfigFile?: string;
  RepositoryLinkId?: string;
  ResourceName: string;
  RoleArn?: string;
  SyncType: SyncConfigurationType;
  PublishDeploymentStatus?: PublishDeploymentStatus;
  TriggerResourceUpdateOn?: TriggerResourceUpdateOn;
}
export const UpdateSyncConfigurationInput = S.suspend(() =>
  S.Struct({
    Branch: S.optional(S.String),
    ConfigFile: S.optional(S.String),
    RepositoryLinkId: S.optional(S.String),
    ResourceName: S.String,
    RoleArn: S.optional(S.String),
    SyncType: SyncConfigurationType,
    PublishDeploymentStatus: S.optional(PublishDeploymentStatus),
    TriggerResourceUpdateOn: S.optional(TriggerResourceUpdateOn),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSyncConfigurationInput",
}) as any as S.Schema<UpdateSyncConfigurationInput>;
export type ConnectionStatus =
  | "PENDING"
  | "AVAILABLE"
  | "ERROR"
  | (string & {});
export const ConnectionStatus = S.String;
export interface Connection {
  ConnectionName?: string;
  ConnectionArn?: string;
  ProviderType?: ProviderType;
  OwnerAccountId?: string;
  ConnectionStatus?: ConnectionStatus;
  HostArn?: string;
}
export const Connection = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    ProviderType: S.optional(ProviderType),
    OwnerAccountId: S.optional(S.String),
    ConnectionStatus: S.optional(ConnectionStatus),
    HostArn: S.optional(S.String),
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionList = Connection[];
export const ConnectionList = S.Array(Connection);
export interface RepositoryLinkInfo {
  ConnectionArn: string;
  EncryptionKeyArn?: string;
  OwnerId: string;
  ProviderType: ProviderType;
  RepositoryLinkArn: string;
  RepositoryLinkId: string;
  RepositoryName: string;
}
export const RepositoryLinkInfo = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.String,
    EncryptionKeyArn: S.optional(S.String),
    OwnerId: S.String,
    ProviderType: ProviderType,
    RepositoryLinkArn: S.String,
    RepositoryLinkId: S.String,
    RepositoryName: S.String,
  }),
).annotations({
  identifier: "RepositoryLinkInfo",
}) as any as S.Schema<RepositoryLinkInfo>;
export type RepositoryLinkList = RepositoryLinkInfo[];
export const RepositoryLinkList = S.Array(RepositoryLinkInfo);
export interface SyncConfiguration {
  Branch: string;
  ConfigFile?: string;
  OwnerId: string;
  ProviderType: ProviderType;
  RepositoryLinkId: string;
  RepositoryName: string;
  ResourceName: string;
  RoleArn: string;
  SyncType: SyncConfigurationType;
  PublishDeploymentStatus?: PublishDeploymentStatus;
  TriggerResourceUpdateOn?: TriggerResourceUpdateOn;
}
export const SyncConfiguration = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    ConfigFile: S.optional(S.String),
    OwnerId: S.String,
    ProviderType: ProviderType,
    RepositoryLinkId: S.String,
    RepositoryName: S.String,
    ResourceName: S.String,
    RoleArn: S.String,
    SyncType: SyncConfigurationType,
    PublishDeploymentStatus: S.optional(PublishDeploymentStatus),
    TriggerResourceUpdateOn: S.optional(TriggerResourceUpdateOn),
  }),
).annotations({
  identifier: "SyncConfiguration",
}) as any as S.Schema<SyncConfiguration>;
export type SyncConfigurationList = SyncConfiguration[];
export const SyncConfigurationList = S.Array(SyncConfiguration);
export interface CreateConnectionInput {
  ProviderType?: ProviderType;
  ConnectionName: string;
  Tags?: Tag[];
  HostArn?: string;
}
export const CreateConnectionInput = S.suspend(() =>
  S.Struct({
    ProviderType: S.optional(ProviderType),
    ConnectionName: S.String,
    Tags: S.optional(TagList),
    HostArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConnectionInput",
}) as any as S.Schema<CreateConnectionInput>;
export interface CreateHostInput {
  Name: string;
  ProviderType: ProviderType;
  ProviderEndpoint: string;
  VpcConfiguration?: VpcConfiguration;
  Tags?: Tag[];
}
export const CreateHostInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ProviderType: ProviderType,
    ProviderEndpoint: S.String,
    VpcConfiguration: S.optional(VpcConfiguration),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateHostInput",
}) as any as S.Schema<CreateHostInput>;
export interface GetHostOutput {
  Name?: string;
  Status?: string;
  ProviderType?: ProviderType;
  ProviderEndpoint?: string;
  VpcConfiguration?: VpcConfiguration;
}
export const GetHostOutput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    ProviderType: S.optional(ProviderType),
    ProviderEndpoint: S.optional(S.String),
    VpcConfiguration: S.optional(VpcConfiguration),
  }),
).annotations({
  identifier: "GetHostOutput",
}) as any as S.Schema<GetHostOutput>;
export interface GetRepositoryLinkOutput {
  RepositoryLinkInfo: RepositoryLinkInfo;
}
export const GetRepositoryLinkOutput = S.suspend(() =>
  S.Struct({ RepositoryLinkInfo: RepositoryLinkInfo }),
).annotations({
  identifier: "GetRepositoryLinkOutput",
}) as any as S.Schema<GetRepositoryLinkOutput>;
export interface GetSyncConfigurationOutput {
  SyncConfiguration: SyncConfiguration;
}
export const GetSyncConfigurationOutput = S.suspend(() =>
  S.Struct({ SyncConfiguration: SyncConfiguration }),
).annotations({
  identifier: "GetSyncConfigurationOutput",
}) as any as S.Schema<GetSyncConfigurationOutput>;
export interface ListConnectionsOutput {
  Connections?: Connection[];
  NextToken?: string;
}
export const ListConnectionsOutput = S.suspend(() =>
  S.Struct({
    Connections: S.optional(ConnectionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectionsOutput",
}) as any as S.Schema<ListConnectionsOutput>;
export interface ListRepositoryLinksOutput {
  RepositoryLinks: RepositoryLinkInfo[];
  NextToken?: string;
}
export const ListRepositoryLinksOutput = S.suspend(() =>
  S.Struct({
    RepositoryLinks: RepositoryLinkList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRepositoryLinksOutput",
}) as any as S.Schema<ListRepositoryLinksOutput>;
export interface ListSyncConfigurationsOutput {
  SyncConfigurations: SyncConfiguration[];
  NextToken?: string;
}
export const ListSyncConfigurationsOutput = S.suspend(() =>
  S.Struct({
    SyncConfigurations: SyncConfigurationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSyncConfigurationsOutput",
}) as any as S.Schema<ListSyncConfigurationsOutput>;
export interface ListTagsForResourceOutput {
  Tags?: Tag[];
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface UpdateRepositoryLinkOutput {
  RepositoryLinkInfo: RepositoryLinkInfo;
}
export const UpdateRepositoryLinkOutput = S.suspend(() =>
  S.Struct({ RepositoryLinkInfo: RepositoryLinkInfo }),
).annotations({
  identifier: "UpdateRepositoryLinkOutput",
}) as any as S.Schema<UpdateRepositoryLinkOutput>;
export interface UpdateSyncConfigurationOutput {
  SyncConfiguration: SyncConfiguration;
}
export const UpdateSyncConfigurationOutput = S.suspend(() =>
  S.Struct({ SyncConfiguration: SyncConfiguration }),
).annotations({
  identifier: "UpdateSyncConfigurationOutput",
}) as any as S.Schema<UpdateSyncConfigurationOutput>;
export type RepositorySyncStatus =
  | "FAILED"
  | "INITIATED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "QUEUED"
  | (string & {});
export const RepositorySyncStatus = S.String;
export type ResourceSyncStatus =
  | "FAILED"
  | "INITIATED"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | (string & {});
export const ResourceSyncStatus = S.String;
export type BlockerType = "AUTOMATED" | (string & {});
export const BlockerType = S.String;
export type BlockerStatus = "ACTIVE" | "RESOLVED" | (string & {});
export const BlockerStatus = S.String;
export interface SyncBlockerContext {
  Key: string;
  Value: string;
}
export const SyncBlockerContext = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({
  identifier: "SyncBlockerContext",
}) as any as S.Schema<SyncBlockerContext>;
export type SyncBlockerContextList = SyncBlockerContext[];
export const SyncBlockerContextList = S.Array(SyncBlockerContext);
export interface SyncBlocker {
  Id: string;
  Type: BlockerType;
  Status: BlockerStatus;
  CreatedReason: string;
  CreatedAt: Date;
  Contexts?: SyncBlockerContext[];
  ResolvedReason?: string;
  ResolvedAt?: Date;
}
export const SyncBlocker = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Type: BlockerType,
    Status: BlockerStatus,
    CreatedReason: S.String,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Contexts: S.optional(SyncBlockerContextList),
    ResolvedReason: S.optional(S.String),
    ResolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "SyncBlocker" }) as any as S.Schema<SyncBlocker>;
export type LatestSyncBlockerList = SyncBlocker[];
export const LatestSyncBlockerList = S.Array(SyncBlocker);
export interface Revision {
  Branch: string;
  Directory: string;
  OwnerId: string;
  RepositoryName: string;
  ProviderType: ProviderType;
  Sha: string;
}
export const Revision = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    Directory: S.String,
    OwnerId: S.String,
    RepositoryName: S.String,
    ProviderType: ProviderType,
    Sha: S.String,
  }),
).annotations({ identifier: "Revision" }) as any as S.Schema<Revision>;
export interface SyncBlockerSummary {
  ResourceName: string;
  ParentResourceName?: string;
  LatestBlockers?: SyncBlocker[];
}
export const SyncBlockerSummary = S.suspend(() =>
  S.Struct({
    ResourceName: S.String,
    ParentResourceName: S.optional(S.String),
    LatestBlockers: S.optional(LatestSyncBlockerList),
  }),
).annotations({
  identifier: "SyncBlockerSummary",
}) as any as S.Schema<SyncBlockerSummary>;
export interface Host {
  Name?: string;
  HostArn?: string;
  ProviderType?: ProviderType;
  ProviderEndpoint?: string;
  VpcConfiguration?: VpcConfiguration;
  Status?: string;
  StatusMessage?: string;
}
export const Host = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    HostArn: S.optional(S.String),
    ProviderType: S.optional(ProviderType),
    ProviderEndpoint: S.optional(S.String),
    VpcConfiguration: S.optional(VpcConfiguration),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "Host" }) as any as S.Schema<Host>;
export type HostList = Host[];
export const HostList = S.Array(Host);
export interface RepositorySyncDefinition {
  Branch: string;
  Directory: string;
  Parent: string;
  Target: string;
}
export const RepositorySyncDefinition = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    Directory: S.String,
    Parent: S.String,
    Target: S.String,
  }),
).annotations({
  identifier: "RepositorySyncDefinition",
}) as any as S.Schema<RepositorySyncDefinition>;
export type RepositorySyncDefinitionList = RepositorySyncDefinition[];
export const RepositorySyncDefinitionList = S.Array(RepositorySyncDefinition);
export interface CreateConnectionOutput {
  ConnectionArn: string;
  Tags?: Tag[];
}
export const CreateConnectionOutput = S.suspend(() =>
  S.Struct({ ConnectionArn: S.String, Tags: S.optional(TagList) }),
).annotations({
  identifier: "CreateConnectionOutput",
}) as any as S.Schema<CreateConnectionOutput>;
export interface CreateHostOutput {
  HostArn?: string;
  Tags?: Tag[];
}
export const CreateHostOutput = S.suspend(() =>
  S.Struct({ HostArn: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "CreateHostOutput",
}) as any as S.Schema<CreateHostOutput>;
export interface CreateRepositoryLinkOutput {
  RepositoryLinkInfo: RepositoryLinkInfo;
}
export const CreateRepositoryLinkOutput = S.suspend(() =>
  S.Struct({ RepositoryLinkInfo: RepositoryLinkInfo }),
).annotations({
  identifier: "CreateRepositoryLinkOutput",
}) as any as S.Schema<CreateRepositoryLinkOutput>;
export interface CreateSyncConfigurationOutput {
  SyncConfiguration: SyncConfiguration;
}
export const CreateSyncConfigurationOutput = S.suspend(() =>
  S.Struct({ SyncConfiguration: SyncConfiguration }),
).annotations({
  identifier: "CreateSyncConfigurationOutput",
}) as any as S.Schema<CreateSyncConfigurationOutput>;
export interface GetConnectionOutput {
  Connection?: Connection;
}
export const GetConnectionOutput = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }),
).annotations({
  identifier: "GetConnectionOutput",
}) as any as S.Schema<GetConnectionOutput>;
export interface GetSyncBlockerSummaryOutput {
  SyncBlockerSummary: SyncBlockerSummary;
}
export const GetSyncBlockerSummaryOutput = S.suspend(() =>
  S.Struct({ SyncBlockerSummary: SyncBlockerSummary }),
).annotations({
  identifier: "GetSyncBlockerSummaryOutput",
}) as any as S.Schema<GetSyncBlockerSummaryOutput>;
export interface ListHostsOutput {
  Hosts?: Host[];
  NextToken?: string;
}
export const ListHostsOutput = S.suspend(() =>
  S.Struct({ Hosts: S.optional(HostList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListHostsOutput",
}) as any as S.Schema<ListHostsOutput>;
export interface ListRepositorySyncDefinitionsOutput {
  RepositorySyncDefinitions: RepositorySyncDefinition[];
  NextToken?: string;
}
export const ListRepositorySyncDefinitionsOutput = S.suspend(() =>
  S.Struct({
    RepositorySyncDefinitions: RepositorySyncDefinitionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRepositorySyncDefinitionsOutput",
}) as any as S.Schema<ListRepositorySyncDefinitionsOutput>;
export interface RepositorySyncEvent {
  Event: string;
  ExternalId?: string;
  Time: Date;
  Type: string;
}
export const RepositorySyncEvent = S.suspend(() =>
  S.Struct({
    Event: S.String,
    ExternalId: S.optional(S.String),
    Time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Type: S.String,
  }),
).annotations({
  identifier: "RepositorySyncEvent",
}) as any as S.Schema<RepositorySyncEvent>;
export type RepositorySyncEventList = RepositorySyncEvent[];
export const RepositorySyncEventList = S.Array(RepositorySyncEvent);
export interface ResourceSyncEvent {
  Event: string;
  ExternalId?: string;
  Time: Date;
  Type: string;
}
export const ResourceSyncEvent = S.suspend(() =>
  S.Struct({
    Event: S.String,
    ExternalId: S.optional(S.String),
    Time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Type: S.String,
  }),
).annotations({
  identifier: "ResourceSyncEvent",
}) as any as S.Schema<ResourceSyncEvent>;
export type ResourceSyncEventList = ResourceSyncEvent[];
export const ResourceSyncEventList = S.Array(ResourceSyncEvent);
export interface RepositorySyncAttempt {
  StartedAt: Date;
  Status: RepositorySyncStatus;
  Events: RepositorySyncEvent[];
}
export const RepositorySyncAttempt = S.suspend(() =>
  S.Struct({
    StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: RepositorySyncStatus,
    Events: RepositorySyncEventList,
  }),
).annotations({
  identifier: "RepositorySyncAttempt",
}) as any as S.Schema<RepositorySyncAttempt>;
export interface ResourceSyncAttempt {
  Events: ResourceSyncEvent[];
  InitialRevision: Revision;
  StartedAt: Date;
  Status: ResourceSyncStatus;
  TargetRevision: Revision;
  Target: string;
}
export const ResourceSyncAttempt = S.suspend(() =>
  S.Struct({
    Events: ResourceSyncEventList,
    InitialRevision: Revision,
    StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: ResourceSyncStatus,
    TargetRevision: Revision,
    Target: S.String,
  }),
).annotations({
  identifier: "ResourceSyncAttempt",
}) as any as S.Schema<ResourceSyncAttempt>;
export interface GetRepositorySyncStatusOutput {
  LatestSync: RepositorySyncAttempt;
}
export const GetRepositorySyncStatusOutput = S.suspend(() =>
  S.Struct({ LatestSync: RepositorySyncAttempt }),
).annotations({
  identifier: "GetRepositorySyncStatusOutput",
}) as any as S.Schema<GetRepositorySyncStatusOutput>;
export interface GetResourceSyncStatusOutput {
  DesiredState?: Revision;
  LatestSuccessfulSync?: ResourceSyncAttempt;
  LatestSync: ResourceSyncAttempt;
}
export const GetResourceSyncStatusOutput = S.suspend(() =>
  S.Struct({
    DesiredState: S.optional(Revision),
    LatestSuccessfulSync: S.optional(ResourceSyncAttempt),
    LatestSync: ResourceSyncAttempt,
  }),
).annotations({
  identifier: "GetResourceSyncStatusOutput",
}) as any as S.Schema<GetResourceSyncStatusOutput>;
export interface UpdateSyncBlockerOutput {
  ResourceName: string;
  ParentResourceName?: string;
  SyncBlocker: SyncBlocker;
}
export const UpdateSyncBlockerOutput = S.suspend(() =>
  S.Struct({
    ResourceName: S.String,
    ParentResourceName: S.optional(S.String),
    SyncBlocker: SyncBlocker,
  }),
).annotations({
  identifier: "UpdateSyncBlockerOutput",
}) as any as S.Schema<UpdateSyncBlockerOutput>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConditionalCheckFailedException extends S.TaggedError<ConditionalCheckFailedException>()(
  "ConditionalCheckFailedException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class RetryLatestCommitFailedException extends S.TaggedError<RetryLatestCommitFailedException>()(
  "RetryLatestCommitFailedException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class SyncConfigurationStillExistsException extends S.TaggedError<SyncConfigurationStillExistsException>()(
  "SyncConfigurationStillExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class SyncBlockerDoesNotExistException extends S.TaggedError<SyncBlockerDoesNotExistException>()(
  "SyncBlockerDoesNotExistException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedProviderTypeException extends S.TaggedError<UnsupportedProviderTypeException>()(
  "UnsupportedProviderTypeException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UpdateOutOfSyncException extends S.TaggedError<UpdateOutOfSyncException>()(
  "UpdateOutOfSyncException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * The connection to be deleted.
 */
export const deleteConnection: (
  input: DeleteConnectionInput,
) => effect.Effect<
  DeleteConnectionOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionInput,
  output: DeleteConnectionOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the connections associated with your account.
 */
export const listConnections: {
  (
    input: ListConnectionsInput,
  ): effect.Effect<
    ListConnectionsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionsInput,
  ) => stream.Stream<
    ListConnectionsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionsInput,
  ) => stream.Stream<
    unknown,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionsInput,
  output: ListConnectionsOutput,
  errors: [ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets the set of key-value pairs (metadata) that are used to manage the resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used
 * to manage a resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  LimitExceededException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Removes tags from an Amazon Web Services resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Creates a resource that represents the infrastructure where a third-party provider is
 * installed. The host is used when you create connections to an installed third-party provider
 * type, such as GitHub Enterprise Server. You create one host for all connections to that
 * provider.
 *
 * A host created through the CLI or the SDK is in `PENDING` status by
 * default. You can make its status `AVAILABLE` by setting up the host in the console.
 */
export const createHost: (
  input: CreateHostInput,
) => effect.Effect<
  CreateHostOutput,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHostInput,
  output: CreateHostOutput,
  errors: [LimitExceededException],
}));
/**
 * Returns the host ARN and details such as status, provider type, endpoint, and, if
 * applicable, the VPC configuration.
 */
export const getHost: (
  input: GetHostInput,
) => effect.Effect<
  GetHostOutput,
  ResourceNotFoundException | ResourceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostInput,
  output: GetHostOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Lists the hosts associated with your account.
 */
export const listHosts: {
  (
    input: ListHostsInput,
  ): effect.Effect<
    ListHostsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHostsInput,
  ) => stream.Stream<
    ListHostsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHostsInput,
  ) => stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListHostsInput,
  output: ListHostsOutput,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * The host to be deleted. Before you delete a host, all connections associated to the host must be deleted.
 *
 * A host cannot be deleted if it is in the VPC_CONFIG_INITIALIZING or VPC_CONFIG_DELETING state.
 */
export const deleteHost: (
  input: DeleteHostInput,
) => effect.Effect<
  DeleteHostOutput,
  ResourceNotFoundException | ResourceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHostInput,
  output: DeleteHostOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Creates a connection that can then be given to other Amazon Web Services services like CodePipeline so
 * that it can access third-party code repositories. The connection is in pending status until
 * the third-party connection handshake is completed from the console.
 */
export const createConnection: (
  input: CreateConnectionInput,
) => effect.Effect<
  CreateConnectionOutput,
  | LimitExceededException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionInput,
  output: CreateConnectionOutput,
  errors: [
    LimitExceededException,
    ResourceNotFoundException,
    ResourceUnavailableException,
  ],
}));
/**
 * Returns the connection ARN and details such as status, owner, and provider type.
 */
export const getConnection: (
  input: GetConnectionInput,
) => effect.Effect<
  GetConnectionOutput,
  ResourceNotFoundException | ResourceUnavailableException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionInput,
  output: GetConnectionOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Updates a specified host with the provided configurations.
 */
export const updateHost: (
  input: UpdateHostInput,
) => effect.Effect<
  UpdateHostOutput,
  | ConflictException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHostInput,
  output: UpdateHostOutput,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns details about a sync configuration, including the sync type and resource name. A sync configuration allows the configuration to sync (push and pull) changes from the remote repository for a specified branch in a Git repository.
 */
export const getSyncConfiguration: (
  input: GetSyncConfigurationInput,
) => effect.Effect<
  GetSyncConfigurationOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSyncConfigurationInput,
  output: GetSyncConfigurationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a link to a specified external Git repository. A repository link allows Git sync to monitor and sync changes to files in a specified Git repository.
 */
export const createRepositoryLink: (
  input: CreateRepositoryLinkInput,
) => effect.Effect<
  CreateRepositoryLinkOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryLinkInput,
  output: CreateRepositoryLinkOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Lists the repository sync definitions for repository links in your account.
 */
export const listRepositorySyncDefinitions: (
  input: ListRepositorySyncDefinitionsInput,
) => effect.Effect<
  ListRepositorySyncDefinitionsOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRepositorySyncDefinitionsInput,
  output: ListRepositorySyncDefinitionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns details about a repository link. A repository link allows Git sync to monitor
 * and sync changes from files in a specified Git repository.
 */
export const getRepositoryLink: (
  input: GetRepositoryLinkInput,
) => effect.Effect<
  GetRepositoryLinkOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryLinkInput,
  output: GetRepositoryLinkOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the repository links created for connections in your account.
 */
export const listRepositoryLinks: {
  (
    input: ListRepositoryLinksInput,
  ): effect.Effect<
    ListRepositoryLinksOutput,
    | AccessDeniedException
    | ConcurrentModificationException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoryLinksInput,
  ) => stream.Stream<
    ListRepositoryLinksOutput,
    | AccessDeniedException
    | ConcurrentModificationException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoryLinksInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ConcurrentModificationException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRepositoryLinksInput,
  output: ListRepositoryLinksOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the sync configuration for a specified repository and connection.
 */
export const deleteSyncConfiguration: (
  input: DeleteSyncConfigurationInput,
) => effect.Effect<
  DeleteSyncConfigurationOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | LimitExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSyncConfigurationInput,
  output: DeleteSyncConfigurationOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of sync configurations for a specified repository.
 */
export const listSyncConfigurations: {
  (
    input: ListSyncConfigurationsInput,
  ): effect.Effect<
    ListSyncConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSyncConfigurationsInput,
  ) => stream.Stream<
    ListSyncConfigurationsOutput,
    | AccessDeniedException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSyncConfigurationsInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | InvalidInputException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSyncConfigurationsInput,
  output: ListSyncConfigurationsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the most recent sync blockers.
 */
export const getSyncBlockerSummary: (
  input: GetSyncBlockerSummaryInput,
) => effect.Effect<
  GetSyncBlockerSummaryOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSyncBlockerSummaryInput,
  output: GetSyncBlockerSummaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns details about the sync status for a repository. A repository sync uses Git sync
 * to push and pull changes from your remote repository.
 */
export const getRepositorySyncStatus: (
  input: GetRepositorySyncStatusInput,
) => effect.Effect<
  GetRepositorySyncStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositorySyncStatusInput,
  output: GetRepositorySyncStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the status of the sync with the Git repository for a specific Amazon Web Services
 * resource.
 */
export const getResourceSyncStatus: (
  input: GetResourceSyncStatusInput,
) => effect.Effect<
  GetResourceSyncStatusOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSyncStatusInput,
  output: GetResourceSyncStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a sync configuration which allows Amazon Web Services to sync content from a Git
 * repository to update a specified Amazon Web Services resource. Parameters for the sync
 * configuration are determined by the sync type.
 */
export const createSyncConfiguration: (
  input: CreateSyncConfigurationInput,
) => effect.Effect<
  CreateSyncConfigurationOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSyncConfigurationInput,
  output: CreateSyncConfigurationOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ThrottlingException,
  ],
}));
/**
 * Allows you to update the status of a sync blocker, resolving the blocker and allowing syncing to continue.
 */
export const updateSyncBlocker: (
  input: UpdateSyncBlockerInput,
) => effect.Effect<
  UpdateSyncBlockerOutput,
  | AccessDeniedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | RetryLatestCommitFailedException
  | SyncBlockerDoesNotExistException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSyncBlockerInput,
  output: UpdateSyncBlockerOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    RetryLatestCommitFailedException,
    SyncBlockerDoesNotExistException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the association between your connection and a specified external Git repository.
 */
export const deleteRepositoryLink: (
  input: DeleteRepositoryLinkInput,
) => effect.Effect<
  DeleteRepositoryLinkOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | SyncConfigurationStillExistsException
  | ThrottlingException
  | UnsupportedProviderTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryLinkInput,
  output: DeleteRepositoryLinkOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    SyncConfigurationStillExistsException,
    ThrottlingException,
    UnsupportedProviderTypeException,
  ],
}));
/**
 * Updates the association between your connection and a specified external Git repository.
 * A repository link allows Git sync to monitor and sync changes to files in a specified Git
 * repository.
 */
export const updateRepositoryLink: (
  input: UpdateRepositoryLinkInput,
) => effect.Effect<
  UpdateRepositoryLinkOutput,
  | AccessDeniedException
  | ConditionalCheckFailedException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | UpdateOutOfSyncException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryLinkInput,
  output: UpdateRepositoryLinkOutput,
  errors: [
    AccessDeniedException,
    ConditionalCheckFailedException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
    UpdateOutOfSyncException,
  ],
}));
/**
 * Updates the sync configuration for your connection and a specified external Git repository.
 */
export const updateSyncConfiguration: (
  input: UpdateSyncConfigurationInput,
) => effect.Effect<
  UpdateSyncConfigurationOutput,
  | AccessDeniedException
  | ConcurrentModificationException
  | InternalServerException
  | InvalidInputException
  | ResourceNotFoundException
  | ThrottlingException
  | UpdateOutOfSyncException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSyncConfigurationInput,
  output: UpdateSyncConfigurationOutput,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
    ThrottlingException,
    UpdateOutOfSyncException,
  ],
}));
