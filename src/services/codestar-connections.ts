import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CodeStar connections",
  serviceShapeName: "CodeStar_connections_20191201",
});
const auth = T.AwsAuthSigv4({ name: "codestar-connections" });
const ver = T.ServiceVersion("2019-12-01");
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
                        url: "https://codestar-connections-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codestar-connections-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codestar-connections.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codestar-connections.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateRepositoryLinkInput extends S.Class<CreateRepositoryLinkInput>(
  "CreateRepositoryLinkInput",
)(
  {
    ConnectionArn: S.String,
    OwnerId: S.String,
    RepositoryName: S.String,
    EncryptionKeyArn: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSyncConfigurationInput extends S.Class<CreateSyncConfigurationInput>(
  "CreateSyncConfigurationInput",
)(
  {
    Branch: S.String,
    ConfigFile: S.String,
    RepositoryLinkId: S.String,
    ResourceName: S.String,
    RoleArn: S.String,
    SyncType: S.String,
    PublishDeploymentStatus: S.optional(S.String),
    TriggerResourceUpdateOn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionInput extends S.Class<DeleteConnectionInput>(
  "DeleteConnectionInput",
)(
  { ConnectionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionOutput extends S.Class<DeleteConnectionOutput>(
  "DeleteConnectionOutput",
)({}) {}
export class DeleteHostInput extends S.Class<DeleteHostInput>(
  "DeleteHostInput",
)(
  { HostArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHostOutput extends S.Class<DeleteHostOutput>(
  "DeleteHostOutput",
)({}) {}
export class DeleteRepositoryLinkInput extends S.Class<DeleteRepositoryLinkInput>(
  "DeleteRepositoryLinkInput",
)(
  { RepositoryLinkId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryLinkOutput extends S.Class<DeleteRepositoryLinkOutput>(
  "DeleteRepositoryLinkOutput",
)({}) {}
export class DeleteSyncConfigurationInput extends S.Class<DeleteSyncConfigurationInput>(
  "DeleteSyncConfigurationInput",
)(
  { SyncType: S.String, ResourceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSyncConfigurationOutput extends S.Class<DeleteSyncConfigurationOutput>(
  "DeleteSyncConfigurationOutput",
)({}) {}
export class GetConnectionInput extends S.Class<GetConnectionInput>(
  "GetConnectionInput",
)(
  { ConnectionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHostInput extends S.Class<GetHostInput>("GetHostInput")(
  { HostArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryLinkInput extends S.Class<GetRepositoryLinkInput>(
  "GetRepositoryLinkInput",
)(
  { RepositoryLinkId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositorySyncStatusInput extends S.Class<GetRepositorySyncStatusInput>(
  "GetRepositorySyncStatusInput",
)(
  { Branch: S.String, RepositoryLinkId: S.String, SyncType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceSyncStatusInput extends S.Class<GetResourceSyncStatusInput>(
  "GetResourceSyncStatusInput",
)(
  { ResourceName: S.String, SyncType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSyncBlockerSummaryInput extends S.Class<GetSyncBlockerSummaryInput>(
  "GetSyncBlockerSummaryInput",
)(
  { SyncType: S.String, ResourceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSyncConfigurationInput extends S.Class<GetSyncConfigurationInput>(
  "GetSyncConfigurationInput",
)(
  { SyncType: S.String, ResourceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionsInput extends S.Class<ListConnectionsInput>(
  "ListConnectionsInput",
)(
  {
    ProviderTypeFilter: S.optional(S.String),
    HostArnFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHostsInput extends S.Class<ListHostsInput>("ListHostsInput")(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositoryLinksInput extends S.Class<ListRepositoryLinksInput>(
  "ListRepositoryLinksInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositorySyncDefinitionsInput extends S.Class<ListRepositorySyncDefinitionsInput>(
  "ListRepositorySyncDefinitionsInput",
)(
  { RepositoryLinkId: S.String, SyncType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSyncConfigurationsInput extends S.Class<ListSyncConfigurationsInput>(
  "ListSyncConfigurationsInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    RepositoryLinkId: S.String,
    SyncType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({
  VpcId: S.String,
  SubnetIds: SubnetIds,
  SecurityGroupIds: SecurityGroupIds,
  TlsCertificate: S.optional(S.String),
}) {}
export class UpdateHostInput extends S.Class<UpdateHostInput>(
  "UpdateHostInput",
)(
  {
    HostArn: S.String,
    ProviderEndpoint: S.optional(S.String),
    VpcConfiguration: S.optional(VpcConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHostOutput extends S.Class<UpdateHostOutput>(
  "UpdateHostOutput",
)({}) {}
export class UpdateRepositoryLinkInput extends S.Class<UpdateRepositoryLinkInput>(
  "UpdateRepositoryLinkInput",
)(
  {
    ConnectionArn: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    RepositoryLinkId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSyncBlockerInput extends S.Class<UpdateSyncBlockerInput>(
  "UpdateSyncBlockerInput",
)(
  {
    Id: S.String,
    SyncType: S.String,
    ResourceName: S.String,
    ResolvedReason: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSyncConfigurationInput extends S.Class<UpdateSyncConfigurationInput>(
  "UpdateSyncConfigurationInput",
)(
  {
    Branch: S.optional(S.String),
    ConfigFile: S.optional(S.String),
    RepositoryLinkId: S.optional(S.String),
    ResourceName: S.String,
    RoleArn: S.optional(S.String),
    SyncType: S.String,
    PublishDeploymentStatus: S.optional(S.String),
    TriggerResourceUpdateOn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Connection extends S.Class<Connection>("Connection")({
  ConnectionName: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  ProviderType: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  ConnectionStatus: S.optional(S.String),
  HostArn: S.optional(S.String),
}) {}
export const ConnectionList = S.Array(Connection);
export class RepositoryLinkInfo extends S.Class<RepositoryLinkInfo>(
  "RepositoryLinkInfo",
)({
  ConnectionArn: S.String,
  EncryptionKeyArn: S.optional(S.String),
  OwnerId: S.String,
  ProviderType: S.String,
  RepositoryLinkArn: S.String,
  RepositoryLinkId: S.String,
  RepositoryName: S.String,
}) {}
export const RepositoryLinkList = S.Array(RepositoryLinkInfo);
export class SyncConfiguration extends S.Class<SyncConfiguration>(
  "SyncConfiguration",
)({
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
}) {}
export const SyncConfigurationList = S.Array(SyncConfiguration);
export class CreateConnectionInput extends S.Class<CreateConnectionInput>(
  "CreateConnectionInput",
)(
  {
    ProviderType: S.optional(S.String),
    ConnectionName: S.String,
    Tags: S.optional(TagList),
    HostArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHostInput extends S.Class<CreateHostInput>(
  "CreateHostInput",
)(
  {
    Name: S.String,
    ProviderType: S.String,
    ProviderEndpoint: S.String,
    VpcConfiguration: S.optional(VpcConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetHostOutput extends S.Class<GetHostOutput>("GetHostOutput")({
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  ProviderType: S.optional(S.String),
  ProviderEndpoint: S.optional(S.String),
  VpcConfiguration: S.optional(VpcConfiguration),
}) {}
export class GetRepositoryLinkOutput extends S.Class<GetRepositoryLinkOutput>(
  "GetRepositoryLinkOutput",
)({ RepositoryLinkInfo: RepositoryLinkInfo }) {}
export class GetSyncConfigurationOutput extends S.Class<GetSyncConfigurationOutput>(
  "GetSyncConfigurationOutput",
)({ SyncConfiguration: SyncConfiguration }) {}
export class ListConnectionsOutput extends S.Class<ListConnectionsOutput>(
  "ListConnectionsOutput",
)({
  Connections: S.optional(ConnectionList),
  NextToken: S.optional(S.String),
}) {}
export class ListRepositoryLinksOutput extends S.Class<ListRepositoryLinksOutput>(
  "ListRepositoryLinksOutput",
)({ RepositoryLinks: RepositoryLinkList, NextToken: S.optional(S.String) }) {}
export class ListSyncConfigurationsOutput extends S.Class<ListSyncConfigurationsOutput>(
  "ListSyncConfigurationsOutput",
)({
  SyncConfigurations: SyncConfigurationList,
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList) }) {}
export class UpdateRepositoryLinkOutput extends S.Class<UpdateRepositoryLinkOutput>(
  "UpdateRepositoryLinkOutput",
)({ RepositoryLinkInfo: RepositoryLinkInfo }) {}
export class UpdateSyncConfigurationOutput extends S.Class<UpdateSyncConfigurationOutput>(
  "UpdateSyncConfigurationOutput",
)({ SyncConfiguration: SyncConfiguration }) {}
export class SyncBlockerContext extends S.Class<SyncBlockerContext>(
  "SyncBlockerContext",
)({ Key: S.String, Value: S.String }) {}
export const SyncBlockerContextList = S.Array(SyncBlockerContext);
export class SyncBlocker extends S.Class<SyncBlocker>("SyncBlocker")({
  Id: S.String,
  Type: S.String,
  Status: S.String,
  CreatedReason: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Contexts: S.optional(SyncBlockerContextList),
  ResolvedReason: S.optional(S.String),
  ResolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LatestSyncBlockerList = S.Array(SyncBlocker);
export class Revision extends S.Class<Revision>("Revision")({
  Branch: S.String,
  Directory: S.String,
  OwnerId: S.String,
  RepositoryName: S.String,
  ProviderType: S.String,
  Sha: S.String,
}) {}
export class SyncBlockerSummary extends S.Class<SyncBlockerSummary>(
  "SyncBlockerSummary",
)({
  ResourceName: S.String,
  ParentResourceName: S.optional(S.String),
  LatestBlockers: S.optional(LatestSyncBlockerList),
}) {}
export class Host extends S.Class<Host>("Host")({
  Name: S.optional(S.String),
  HostArn: S.optional(S.String),
  ProviderType: S.optional(S.String),
  ProviderEndpoint: S.optional(S.String),
  VpcConfiguration: S.optional(VpcConfiguration),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const HostList = S.Array(Host);
export class RepositorySyncDefinition extends S.Class<RepositorySyncDefinition>(
  "RepositorySyncDefinition",
)({
  Branch: S.String,
  Directory: S.String,
  Parent: S.String,
  Target: S.String,
}) {}
export const RepositorySyncDefinitionList = S.Array(RepositorySyncDefinition);
export class CreateConnectionOutput extends S.Class<CreateConnectionOutput>(
  "CreateConnectionOutput",
)({ ConnectionArn: S.String, Tags: S.optional(TagList) }) {}
export class CreateHostOutput extends S.Class<CreateHostOutput>(
  "CreateHostOutput",
)({ HostArn: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class CreateRepositoryLinkOutput extends S.Class<CreateRepositoryLinkOutput>(
  "CreateRepositoryLinkOutput",
)({ RepositoryLinkInfo: RepositoryLinkInfo }) {}
export class CreateSyncConfigurationOutput extends S.Class<CreateSyncConfigurationOutput>(
  "CreateSyncConfigurationOutput",
)({ SyncConfiguration: SyncConfiguration }) {}
export class GetConnectionOutput extends S.Class<GetConnectionOutput>(
  "GetConnectionOutput",
)({ Connection: S.optional(Connection) }) {}
export class GetSyncBlockerSummaryOutput extends S.Class<GetSyncBlockerSummaryOutput>(
  "GetSyncBlockerSummaryOutput",
)({ SyncBlockerSummary: SyncBlockerSummary }) {}
export class ListHostsOutput extends S.Class<ListHostsOutput>(
  "ListHostsOutput",
)({ Hosts: S.optional(HostList), NextToken: S.optional(S.String) }) {}
export class ListRepositorySyncDefinitionsOutput extends S.Class<ListRepositorySyncDefinitionsOutput>(
  "ListRepositorySyncDefinitionsOutput",
)({
  RepositorySyncDefinitions: RepositorySyncDefinitionList,
  NextToken: S.optional(S.String),
}) {}
export class RepositorySyncEvent extends S.Class<RepositorySyncEvent>(
  "RepositorySyncEvent",
)({
  Event: S.String,
  ExternalId: S.optional(S.String),
  Time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Type: S.String,
}) {}
export const RepositorySyncEventList = S.Array(RepositorySyncEvent);
export class ResourceSyncEvent extends S.Class<ResourceSyncEvent>(
  "ResourceSyncEvent",
)({
  Event: S.String,
  ExternalId: S.optional(S.String),
  Time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Type: S.String,
}) {}
export const ResourceSyncEventList = S.Array(ResourceSyncEvent);
export class RepositorySyncAttempt extends S.Class<RepositorySyncAttempt>(
  "RepositorySyncAttempt",
)({
  StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.String,
  Events: RepositorySyncEventList,
}) {}
export class ResourceSyncAttempt extends S.Class<ResourceSyncAttempt>(
  "ResourceSyncAttempt",
)({
  Events: ResourceSyncEventList,
  InitialRevision: Revision,
  StartedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.String,
  TargetRevision: Revision,
  Target: S.String,
}) {}
export class GetRepositorySyncStatusOutput extends S.Class<GetRepositorySyncStatusOutput>(
  "GetRepositorySyncStatusOutput",
)({ LatestSync: RepositorySyncAttempt }) {}
export class GetResourceSyncStatusOutput extends S.Class<GetResourceSyncStatusOutput>(
  "GetResourceSyncStatusOutput",
)({
  DesiredState: S.optional(Revision),
  LatestSuccessfulSync: S.optional(ResourceSyncAttempt),
  LatestSync: ResourceSyncAttempt,
}) {}
export class UpdateSyncBlockerOutput extends S.Class<UpdateSyncBlockerOutput>(
  "UpdateSyncBlockerOutput",
)({
  ResourceName: S.String,
  ParentResourceName: S.optional(S.String),
  SyncBlocker: SyncBlocker,
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConditionalCheckFailedException extends S.TaggedError<ConditionalCheckFailedException>()(
  "ConditionalCheckFailedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class RetryLatestCommitFailedException extends S.TaggedError<RetryLatestCommitFailedException>()(
  "RetryLatestCommitFailedException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}
export class SyncConfigurationStillExistsException extends S.TaggedError<SyncConfigurationStillExistsException>()(
  "SyncConfigurationStillExistsException",
  { Message: S.optional(S.String) },
) {}
export class SyncBlockerDoesNotExistException extends S.TaggedError<SyncBlockerDoesNotExistException>()(
  "SyncBlockerDoesNotExistException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedProviderTypeException extends S.TaggedError<UnsupportedProviderTypeException>()(
  "UnsupportedProviderTypeException",
  { Message: S.optional(S.String) },
) {}
export class UpdateOutOfSyncException extends S.TaggedError<UpdateOutOfSyncException>()(
  "UpdateOutOfSyncException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * The connection to be deleted.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionInput,
  output: DeleteConnectionOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the connections associated with your account.
 */
export const listConnections = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectionsInput,
    output: ListConnectionsOutput,
    errors: [ResourceNotFoundException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Gets the set of key-value pairs (metadata) that are used to manage the resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used
 * to manage a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Removes tags from an Amazon Web Services resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createHost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHostInput,
  output: CreateHostOutput,
  errors: [LimitExceededException],
}));
/**
 * Returns the host ARN and details such as status, provider type, endpoint, and, if
 * applicable, the VPC configuration.
 */
export const getHost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHostInput,
  output: GetHostOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Lists the hosts associated with your account.
 */
export const listHosts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteHost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHostInput,
  output: DeleteHostOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Creates a connection that can then be given to other Amazon Web Services services like CodePipeline so
 * that it can access third-party code repositories. The connection is in pending status until
 * the third-party connection handshake is completed from the console.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionInput,
  output: GetConnectionOutput,
  errors: [ResourceNotFoundException, ResourceUnavailableException],
}));
/**
 * Updates a specified host with the provided configurations.
 */
export const updateHost = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSyncConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSyncConfigurationInput,
    output: GetSyncConfigurationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a link to a specified external Git repository. A repository link allows Git sync to monitor and sync changes to files in a specified Git repository.
 */
export const createRepositoryLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the repository sync definitions for repository links in your account.
 */
export const listRepositorySyncDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRepositoryLink = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRepositoryLinks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteSyncConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a list of sync configurations for a specified repository.
 */
export const listSyncConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getSyncBlockerSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSyncBlockerSummaryInput,
    output: GetSyncBlockerSummaryOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns details about the sync status for a repository. A repository sync uses Git sync
 * to push and pull changes from your remote repository.
 */
export const getRepositorySyncStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRepositorySyncStatusInput,
    output: GetRepositorySyncStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the status of the sync with the Git repository for a specific Amazon Web Services
 * resource.
 */
export const getResourceSyncStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceSyncStatusInput,
    output: GetResourceSyncStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a sync configuration which allows Amazon Web Services to sync content from a Git
 * repository to update a specified Amazon Web Services resource. Parameters for the sync
 * configuration are determined by the sync type.
 */
export const createSyncConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Allows you to update the status of a sync blocker, resolving the blocker and allowing syncing to continue.
 */
export const updateSyncBlocker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRepositoryLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the association between your connection and a specified external Git repository.
 * A repository link allows Git sync to monitor and sync changes to files in a specified Git
 * repository.
 */
export const updateRepositoryLink = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the sync configuration for your connection and a specified external Git repository.
 */
export const updateSyncConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
