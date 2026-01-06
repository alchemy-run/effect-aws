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
  sdkId: "CodeConnections",
  serviceShapeName: "CodeConnections_20231201",
});
const auth = T.AwsAuthSigv4({ name: "codeconnections" });
const ver = T.ServiceVersion("2023-12-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeconnections-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeconnections-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://codeconnections.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://codeconnections.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
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
  Tags?: TagList;
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
  SyncType: string;
  PublishDeploymentStatus?: string;
  TriggerResourceUpdateOn?: string;
  PullRequestComment?: string;
}
export const CreateSyncConfigurationInput = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    ConfigFile: S.String,
    RepositoryLinkId: S.String,
    ResourceName: S.String,
    RoleArn: S.String,
    SyncType: S.String,
    PublishDeploymentStatus: S.optional(S.String),
    TriggerResourceUpdateOn: S.optional(S.String),
    PullRequestComment: S.optional(S.String),
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
  SyncType: string;
  ResourceName: string;
}
export const DeleteSyncConfigurationInput = S.suspend(() =>
  S.Struct({ SyncType: S.String, ResourceName: S.String }).pipe(
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
  SyncType: string;
}
export const GetRepositorySyncStatusInput = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    RepositoryLinkId: S.String,
    SyncType: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRepositorySyncStatusInput",
}) as any as S.Schema<GetRepositorySyncStatusInput>;
export interface GetResourceSyncStatusInput {
  ResourceName: string;
  SyncType: string;
}
export const GetResourceSyncStatusInput = S.suspend(() =>
  S.Struct({ ResourceName: S.String, SyncType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceSyncStatusInput",
}) as any as S.Schema<GetResourceSyncStatusInput>;
export interface GetSyncBlockerSummaryInput {
  SyncType: string;
  ResourceName: string;
}
export const GetSyncBlockerSummaryInput = S.suspend(() =>
  S.Struct({ SyncType: S.String, ResourceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSyncBlockerSummaryInput",
}) as any as S.Schema<GetSyncBlockerSummaryInput>;
export interface GetSyncConfigurationInput {
  SyncType: string;
  ResourceName: string;
}
export const GetSyncConfigurationInput = S.suspend(() =>
  S.Struct({ SyncType: S.String, ResourceName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSyncConfigurationInput",
}) as any as S.Schema<GetSyncConfigurationInput>;
export interface ListConnectionsInput {
  ProviderTypeFilter?: string;
  HostArnFilter?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectionsInput = S.suspend(() =>
  S.Struct({
    ProviderTypeFilter: S.optional(S.String),
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
  SyncType: string;
}
export const ListRepositorySyncDefinitionsInput = S.suspend(() =>
  S.Struct({ RepositoryLinkId: S.String, SyncType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRepositorySyncDefinitionsInput",
}) as any as S.Schema<ListRepositorySyncDefinitionsInput>;
export interface ListSyncConfigurationsInput {
  MaxResults?: number;
  NextToken?: string;
  RepositoryLinkId: string;
  SyncType: string;
}
export const ListSyncConfigurationsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    RepositoryLinkId: S.String,
    SyncType: S.String,
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
  Tags: TagList;
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
  TagKeys: TagKeyList;
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
  SubnetIds: SubnetIds;
  SecurityGroupIds: SecurityGroupIds;
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
  SyncType: string;
  ResourceName: string;
  ResolvedReason: string;
}
export const UpdateSyncBlockerInput = S.suspend(() =>
  S.Struct({
    Id: S.String,
    SyncType: S.String,
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
  SyncType: string;
  PublishDeploymentStatus?: string;
  TriggerResourceUpdateOn?: string;
  PullRequestComment?: string;
}
export const UpdateSyncConfigurationInput = S.suspend(() =>
  S.Struct({
    Branch: S.optional(S.String),
    ConfigFile: S.optional(S.String),
    RepositoryLinkId: S.optional(S.String),
    ResourceName: S.String,
    RoleArn: S.optional(S.String),
    SyncType: S.String,
    PublishDeploymentStatus: S.optional(S.String),
    TriggerResourceUpdateOn: S.optional(S.String),
    PullRequestComment: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSyncConfigurationInput",
}) as any as S.Schema<UpdateSyncConfigurationInput>;
export interface Connection {
  ConnectionName?: string;
  ConnectionArn?: string;
  ProviderType?: string;
  OwnerAccountId?: string;
  ConnectionStatus?: string;
  HostArn?: string;
}
export const Connection = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    ProviderType: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    ConnectionStatus: S.optional(S.String),
    HostArn: S.optional(S.String),
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionList = Connection[];
export const ConnectionList = S.Array(Connection);
export interface RepositoryLinkInfo {
  ConnectionArn: string;
  EncryptionKeyArn?: string;
  OwnerId: string;
  ProviderType: string;
  RepositoryLinkArn: string;
  RepositoryLinkId: string;
  RepositoryName: string;
}
export const RepositoryLinkInfo = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.String,
    EncryptionKeyArn: S.optional(S.String),
    OwnerId: S.String,
    ProviderType: S.String,
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
  ProviderType: string;
  RepositoryLinkId: string;
  RepositoryName: string;
  ResourceName: string;
  RoleArn: string;
  SyncType: string;
  PublishDeploymentStatus?: string;
  TriggerResourceUpdateOn?: string;
  PullRequestComment?: string;
}
export const SyncConfiguration = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    ConfigFile: S.optional(S.String),
    OwnerId: S.String,
    ProviderType: S.String,
    RepositoryLinkId: S.String,
    RepositoryName: S.String,
    ResourceName: S.String,
    RoleArn: S.String,
    SyncType: S.String,
    PublishDeploymentStatus: S.optional(S.String),
    TriggerResourceUpdateOn: S.optional(S.String),
    PullRequestComment: S.optional(S.String),
  }),
).annotations({
  identifier: "SyncConfiguration",
}) as any as S.Schema<SyncConfiguration>;
export type SyncConfigurationList = SyncConfiguration[];
export const SyncConfigurationList = S.Array(SyncConfiguration);
export interface CreateConnectionInput {
  ProviderType?: string;
  ConnectionName: string;
  Tags?: TagList;
  HostArn?: string;
}
export const CreateConnectionInput = S.suspend(() =>
  S.Struct({
    ProviderType: S.optional(S.String),
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
  ProviderType: string;
  ProviderEndpoint: string;
  VpcConfiguration?: VpcConfiguration;
  Tags?: TagList;
}
export const CreateHostInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ProviderType: S.String,
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
  ProviderType?: string;
  ProviderEndpoint?: string;
  VpcConfiguration?: VpcConfiguration;
}
export const GetHostOutput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    ProviderType: S.optional(S.String),
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
  Connections?: ConnectionList;
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
  RepositoryLinks: RepositoryLinkList;
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
  SyncConfigurations: SyncConfigurationList;
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
  Tags?: TagList;
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
  Type: string;
  Status: string;
  CreatedReason: string;
  CreatedAt: Date;
  Contexts?: SyncBlockerContextList;
  ResolvedReason?: string;
  ResolvedAt?: Date;
}
export const SyncBlocker = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Type: S.String,
    Status: S.String,
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
  ProviderType: string;
  Sha: string;
}
export const Revision = S.suspend(() =>
  S.Struct({
    Branch: S.String,
    Directory: S.String,
    OwnerId: S.String,
    RepositoryName: S.String,
    ProviderType: S.String,
    Sha: S.String,
  }),
).annotations({ identifier: "Revision" }) as any as S.Schema<Revision>;
export interface SyncBlockerSummary {
  ResourceName: string;
  ParentResourceName?: string;
  LatestBlockers?: LatestSyncBlockerList;
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
  ProviderType?: string;
  ProviderEndpoint?: string;
  VpcConfiguration?: VpcConfiguration;
  Status?: string;
  StatusMessage?: string;
}
export const Host = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    HostArn: S.optional(S.String),
    ProviderType: S.optional(S.String),
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
  Tags?: TagList;
}
export const CreateConnectionOutput = S.suspend(() =>
  S.Struct({ ConnectionArn: S.String, Tags: S.optional(TagList) }),
).annotations({
  identifier: "CreateConnectionOutput",
}) as any as S.Schema<CreateConnectionOutput>;
export interface CreateHostOutput {
  HostArn?: string;
  Tags?: TagList;
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
  Hosts?: HostList;
  NextToken?: string;
}
export const ListHostsOutput = S.suspend(() =>
  S.Struct({ Hosts: S.optional(HostList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListHostsOutput",
}) as any as S.Schema<ListHostsOutput>;
export interface ListRepositorySyncDefinitionsOutput {
  RepositorySyncDefinitions: RepositorySyncDefinitionList;
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
  Status: string;
  Events: RepositorySyncEventList;
}
export const RepositorySyncAttempt = S.suspend(() =>
  S.Struct({
    StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    Events: RepositorySyncEventList,
  }),
).annotations({
  identifier: "RepositorySyncAttempt",
}) as any as S.Schema<RepositorySyncAttempt>;
export interface ResourceSyncAttempt {
  Events: ResourceSyncEventList;
  InitialRevision: Revision;
  StartedAt: Date;
  Status: string;
  TargetRevision: Revision;
  Target: string;
}
export const ResourceSyncAttempt = S.suspend(() =>
  S.Struct({
    Events: ResourceSyncEventList,
    InitialRevision: Revision,
    StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListConnectionsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionsInput,
  ) => Stream.Stream<
    ListConnectionsOutput,
    ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
    ListHostsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListHostsInput,
  ) => Stream.Stream<
    ListHostsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListHostsInput,
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
