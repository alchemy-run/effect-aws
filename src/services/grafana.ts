import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "grafana",
  serviceShapeName: "AWSGrafanaControlPlane",
});
const auth = T.AwsAuthSigv4({ name: "grafana" });
const ver = T.ServiceVersion("2020-08-18");
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
                        url: "https://grafana-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://grafana-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://grafana.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://grafana.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const AuthenticationProviders = S.Array(S.String);
export const DataSourceTypesList = S.Array(S.String);
export const NotificationDestinationsList = S.Array(S.String);
export const OrganizationalUnitList = S.Array(S.String);
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
export class ListVersionsRequest extends S.Class<ListVersionsRequest>(
  "ListVersionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    workspaceId: S.optional(S.String).pipe(T.HttpQuery("workspace-id")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/versions" }),
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
export class CreateWorkspaceApiKeyRequest extends S.Class<CreateWorkspaceApiKeyRequest>(
  "CreateWorkspaceApiKeyRequest",
)(
  {
    keyName: S.String,
    keyRole: S.String,
    secondsToLive: S.Number,
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/apikeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceApiKeyRequest extends S.Class<DeleteWorkspaceApiKeyRequest>(
  "DeleteWorkspaceApiKeyRequest",
)(
  {
    keyName: S.String.pipe(T.HttpLabel("keyName")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/apikeys/{keyName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceAuthenticationRequest extends S.Class<DescribeWorkspaceAuthenticationRequest>(
  "DescribeWorkspaceAuthenticationRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/authentication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceConfigurationRequest extends S.Class<DescribeWorkspaceConfigurationRequest>(
  "DescribeWorkspaceConfigurationRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceConfigurationRequest extends S.Class<UpdateWorkspaceConfigurationRequest>(
  "UpdateWorkspaceConfigurationRequest",
)(
  {
    configuration: S.String,
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    grafanaVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkspaceConfigurationResponse extends S.Class<UpdateWorkspaceConfigurationResponse>(
  "UpdateWorkspaceConfigurationResponse",
)({}) {}
export class AssociateLicenseRequest extends S.Class<AssociateLicenseRequest>(
  "AssociateLicenseRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    licenseType: S.String.pipe(T.HttpLabel("licenseType")),
    grafanaToken: S.optional(S.String).pipe(T.HttpHeader("Grafana-Token")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/licenses/{licenseType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateLicenseRequest extends S.Class<DisassociateLicenseRequest>(
  "DisassociateLicenseRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    licenseType: S.String.pipe(T.HttpLabel("licenseType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/licenses/{licenseType}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPermissionsRequest extends S.Class<ListPermissionsRequest>(
  "ListPermissionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    userType: S.optional(S.String).pipe(T.HttpQuery("userType")),
    userId: S.optional(S.String).pipe(T.HttpQuery("userId")),
    groupId: S.optional(S.String).pipe(T.HttpQuery("groupId")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/permissions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkspaceServiceAccountRequest extends S.Class<CreateWorkspaceServiceAccountRequest>(
  "CreateWorkspaceServiceAccountRequest",
)(
  {
    name: S.String,
    grafanaRole: S.String,
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/serviceaccounts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceServiceAccountRequest extends S.Class<DeleteWorkspaceServiceAccountRequest>(
  "DeleteWorkspaceServiceAccountRequest",
)(
  {
    serviceAccountId: S.String.pipe(T.HttpLabel("serviceAccountId")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/serviceaccounts/{serviceAccountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspaceServiceAccountsRequest extends S.Class<ListWorkspaceServiceAccountsRequest>(
  "ListWorkspaceServiceAccountsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}/serviceaccounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkspaceServiceAccountTokenRequest extends S.Class<CreateWorkspaceServiceAccountTokenRequest>(
  "CreateWorkspaceServiceAccountTokenRequest",
)(
  {
    name: S.String,
    secondsToLive: S.Number,
    serviceAccountId: S.String.pipe(T.HttpLabel("serviceAccountId")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/workspaces/{workspaceId}/serviceaccounts/{serviceAccountId}/tokens",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceServiceAccountTokenRequest extends S.Class<DeleteWorkspaceServiceAccountTokenRequest>(
  "DeleteWorkspaceServiceAccountTokenRequest",
)(
  {
    tokenId: S.String.pipe(T.HttpLabel("tokenId")),
    serviceAccountId: S.String.pipe(T.HttpLabel("serviceAccountId")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/workspaces/{workspaceId}/serviceaccounts/{serviceAccountId}/tokens/{tokenId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspaceServiceAccountTokensRequest extends S.Class<ListWorkspaceServiceAccountTokensRequest>(
  "ListWorkspaceServiceAccountTokensRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    serviceAccountId: S.String.pipe(T.HttpLabel("serviceAccountId")),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workspaces/{workspaceId}/serviceaccounts/{serviceAccountId}/tokens",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceRequest extends S.Class<DescribeWorkspaceRequest>(
  "DescribeWorkspaceRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces/{workspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SecurityGroupIds = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({ securityGroupIds: SecurityGroupIds, subnetIds: SubnetIds }) {}
export const PrefixListIds = S.Array(S.String);
export const VpceIds = S.Array(S.String);
export class NetworkAccessConfiguration extends S.Class<NetworkAccessConfiguration>(
  "NetworkAccessConfiguration",
)({ prefixListIds: PrefixListIds, vpceIds: VpceIds }) {}
export class UpdateWorkspaceRequest extends S.Class<UpdateWorkspaceRequest>(
  "UpdateWorkspaceRequest",
)(
  {
    accountAccessType: S.optional(S.String),
    organizationRoleName: S.optional(S.String),
    permissionType: S.optional(S.String),
    stackSetName: S.optional(S.String),
    workspaceDataSources: S.optional(DataSourceTypesList),
    workspaceDescription: S.optional(S.String),
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    workspaceName: S.optional(S.String),
    workspaceNotificationDestinations: S.optional(NotificationDestinationsList),
    workspaceOrganizationalUnits: S.optional(OrganizationalUnitList),
    workspaceRoleArn: S.optional(S.String),
    vpcConfiguration: S.optional(VpcConfiguration),
    removeVpcConfiguration: S.optional(S.Boolean),
    networkAccessControl: S.optional(NetworkAccessConfiguration),
    removeNetworkAccessConfiguration: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/workspaces/{workspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkspaceRequest extends S.Class<DeleteWorkspaceRequest>(
  "DeleteWorkspaceRequest",
)(
  { workspaceId: S.String.pipe(T.HttpLabel("workspaceId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/workspaces/{workspaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspacesRequest extends S.Class<ListWorkspacesRequest>(
  "ListWorkspacesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AllowedOrganizations = S.Array(S.String);
export const GrafanaVersionList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export const RoleValueList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ListVersionsResponse extends S.Class<ListVersionsResponse>(
  "ListVersionsResponse",
)({
  nextToken: S.optional(S.String),
  grafanaVersions: S.optional(GrafanaVersionList),
}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
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
export class CreateWorkspaceApiKeyResponse extends S.Class<CreateWorkspaceApiKeyResponse>(
  "CreateWorkspaceApiKeyResponse",
)({ keyName: S.String, key: S.String, workspaceId: S.String }) {}
export class DeleteWorkspaceApiKeyResponse extends S.Class<DeleteWorkspaceApiKeyResponse>(
  "DeleteWorkspaceApiKeyResponse",
)({ keyName: S.String, workspaceId: S.String }) {}
export class DescribeWorkspaceConfigurationResponse extends S.Class<DescribeWorkspaceConfigurationResponse>(
  "DescribeWorkspaceConfigurationResponse",
)({ configuration: S.String, grafanaVersion: S.optional(S.String) }) {}
export class AuthenticationSummary extends S.Class<AuthenticationSummary>(
  "AuthenticationSummary",
)({
  providers: AuthenticationProviders,
  samlConfigurationStatus: S.optional(S.String),
}) {}
export class WorkspaceDescription extends S.Class<WorkspaceDescription>(
  "WorkspaceDescription",
)({
  accountAccessType: S.optional(S.String),
  created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  dataSources: DataSourceTypesList,
  description: S.optional(S.String),
  endpoint: S.String,
  grafanaVersion: S.String,
  id: S.String,
  modified: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  name: S.optional(S.String),
  organizationRoleName: S.optional(S.String),
  notificationDestinations: S.optional(NotificationDestinationsList),
  organizationalUnits: S.optional(OrganizationalUnitList),
  permissionType: S.optional(S.String),
  stackSetName: S.optional(S.String),
  status: S.String,
  workspaceRoleArn: S.optional(S.String),
  licenseType: S.optional(S.String),
  freeTrialConsumed: S.optional(S.Boolean),
  licenseExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  freeTrialExpiration: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  authentication: AuthenticationSummary,
  tags: S.optional(TagMap),
  vpcConfiguration: S.optional(VpcConfiguration),
  networkAccessControl: S.optional(NetworkAccessConfiguration),
  grafanaToken: S.optional(S.String),
}) {}
export class DisassociateLicenseResponse extends S.Class<DisassociateLicenseResponse>(
  "DisassociateLicenseResponse",
)({ workspace: WorkspaceDescription }) {}
export class CreateWorkspaceServiceAccountResponse extends S.Class<CreateWorkspaceServiceAccountResponse>(
  "CreateWorkspaceServiceAccountResponse",
)({
  id: S.String,
  name: S.String,
  grafanaRole: S.String,
  workspaceId: S.String,
}) {}
export class DeleteWorkspaceServiceAccountResponse extends S.Class<DeleteWorkspaceServiceAccountResponse>(
  "DeleteWorkspaceServiceAccountResponse",
)({ serviceAccountId: S.String, workspaceId: S.String }) {}
export class DeleteWorkspaceServiceAccountTokenResponse extends S.Class<DeleteWorkspaceServiceAccountTokenResponse>(
  "DeleteWorkspaceServiceAccountTokenResponse",
)({ tokenId: S.String, serviceAccountId: S.String, workspaceId: S.String }) {}
export class CreateWorkspaceRequest extends S.Class<CreateWorkspaceRequest>(
  "CreateWorkspaceRequest",
)(
  {
    accountAccessType: S.String,
    clientToken: S.optional(S.String),
    organizationRoleName: S.optional(S.String),
    permissionType: S.String,
    stackSetName: S.optional(S.String),
    workspaceDataSources: S.optional(DataSourceTypesList),
    workspaceDescription: S.optional(S.String),
    workspaceName: S.optional(S.String),
    workspaceNotificationDestinations: S.optional(NotificationDestinationsList),
    workspaceOrganizationalUnits: S.optional(OrganizationalUnitList),
    workspaceRoleArn: S.optional(S.String),
    authenticationProviders: AuthenticationProviders,
    tags: S.optional(TagMap),
    vpcConfiguration: S.optional(VpcConfiguration),
    configuration: S.optional(S.String),
    networkAccessControl: S.optional(NetworkAccessConfiguration),
    grafanaVersion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkspaceResponse extends S.Class<DescribeWorkspaceResponse>(
  "DescribeWorkspaceResponse",
)({ workspace: WorkspaceDescription }) {}
export class UpdateWorkspaceResponse extends S.Class<UpdateWorkspaceResponse>(
  "UpdateWorkspaceResponse",
)({ workspace: WorkspaceDescription }) {}
export class DeleteWorkspaceResponse extends S.Class<DeleteWorkspaceResponse>(
  "DeleteWorkspaceResponse",
)({ workspace: WorkspaceDescription }) {}
export const IdpMetadata = S.Union(
  S.Struct({ url: S.String }),
  S.Struct({ xml: S.String }),
);
export class AssertionAttributes extends S.Class<AssertionAttributes>(
  "AssertionAttributes",
)({
  name: S.optional(S.String),
  login: S.optional(S.String),
  email: S.optional(S.String),
  groups: S.optional(S.String),
  role: S.optional(S.String),
  org: S.optional(S.String),
}) {}
export class RoleValues extends S.Class<RoleValues>("RoleValues")({
  editor: S.optional(RoleValueList),
  admin: S.optional(RoleValueList),
}) {}
export class User extends S.Class<User>("User")({
  id: S.String,
  type: S.String,
}) {}
export const UserList = S.Array(User);
export class SamlConfiguration extends S.Class<SamlConfiguration>(
  "SamlConfiguration",
)({
  idpMetadata: IdpMetadata,
  assertionAttributes: S.optional(AssertionAttributes),
  roleValues: S.optional(RoleValues),
  allowedOrganizations: S.optional(AllowedOrganizations),
  loginValidityDuration: S.optional(S.Number),
}) {}
export class PermissionEntry extends S.Class<PermissionEntry>(
  "PermissionEntry",
)({ user: User, role: S.String }) {}
export const PermissionEntryList = S.Array(PermissionEntry);
export class UpdateInstruction extends S.Class<UpdateInstruction>(
  "UpdateInstruction",
)({ action: S.String, role: S.String, users: UserList }) {}
export const UpdateInstructionBatch = S.Array(UpdateInstruction);
export class ServiceAccountSummary extends S.Class<ServiceAccountSummary>(
  "ServiceAccountSummary",
)({
  id: S.String,
  name: S.String,
  isDisabled: S.String,
  grafanaRole: S.String,
}) {}
export const ServiceAccountList = S.Array(ServiceAccountSummary);
export class ServiceAccountTokenSummaryWithKey extends S.Class<ServiceAccountTokenSummaryWithKey>(
  "ServiceAccountTokenSummaryWithKey",
)({ id: S.String, name: S.String, key: S.String }) {}
export class ServiceAccountTokenSummary extends S.Class<ServiceAccountTokenSummary>(
  "ServiceAccountTokenSummary",
)({
  id: S.String,
  name: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  expiresAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUsedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ServiceAccountTokenList = S.Array(ServiceAccountTokenSummary);
export class WorkspaceSummary extends S.Class<WorkspaceSummary>(
  "WorkspaceSummary",
)({
  created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  description: S.optional(S.String),
  endpoint: S.String,
  grafanaVersion: S.String,
  id: S.String,
  modified: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  name: S.optional(S.String),
  notificationDestinations: S.optional(NotificationDestinationsList),
  status: S.String,
  authentication: AuthenticationSummary,
  tags: S.optional(TagMap),
  licenseType: S.optional(S.String),
  grafanaToken: S.optional(S.String),
}) {}
export const WorkspaceList = S.Array(WorkspaceSummary);
export class UpdateWorkspaceAuthenticationRequest extends S.Class<UpdateWorkspaceAuthenticationRequest>(
  "UpdateWorkspaceAuthenticationRequest",
)(
  {
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
    authenticationProviders: AuthenticationProviders,
    samlConfiguration: S.optional(SamlConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workspaces/{workspaceId}/authentication" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPermissionsResponse extends S.Class<ListPermissionsResponse>(
  "ListPermissionsResponse",
)({ nextToken: S.optional(S.String), permissions: PermissionEntryList }) {}
export class UpdatePermissionsRequest extends S.Class<UpdatePermissionsRequest>(
  "UpdatePermissionsRequest",
)(
  {
    updateInstructionBatch: UpdateInstructionBatch,
    workspaceId: S.String.pipe(T.HttpLabel("workspaceId")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/workspaces/{workspaceId}/permissions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkspaceServiceAccountsResponse extends S.Class<ListWorkspaceServiceAccountsResponse>(
  "ListWorkspaceServiceAccountsResponse",
)({
  nextToken: S.optional(S.String),
  serviceAccounts: ServiceAccountList,
  workspaceId: S.String,
}) {}
export class CreateWorkspaceServiceAccountTokenResponse extends S.Class<CreateWorkspaceServiceAccountTokenResponse>(
  "CreateWorkspaceServiceAccountTokenResponse",
)({
  serviceAccountToken: ServiceAccountTokenSummaryWithKey,
  serviceAccountId: S.String,
  workspaceId: S.String,
}) {}
export class ListWorkspaceServiceAccountTokensResponse extends S.Class<ListWorkspaceServiceAccountTokensResponse>(
  "ListWorkspaceServiceAccountTokensResponse",
)({
  nextToken: S.optional(S.String),
  serviceAccountTokens: ServiceAccountTokenList,
  serviceAccountId: S.String,
  workspaceId: S.String,
}) {}
export class CreateWorkspaceResponse extends S.Class<CreateWorkspaceResponse>(
  "CreateWorkspaceResponse",
)({ workspace: WorkspaceDescription }) {}
export class ListWorkspacesResponse extends S.Class<ListWorkspacesResponse>(
  "ListWorkspacesResponse",
)({ workspaces: WorkspaceList, nextToken: S.optional(S.String) }) {}
export class SamlAuthentication extends S.Class<SamlAuthentication>(
  "SamlAuthentication",
)({ status: S.String, configuration: S.optional(SamlConfiguration) }) {}
export class AwsSsoAuthentication extends S.Class<AwsSsoAuthentication>(
  "AwsSsoAuthentication",
)({ ssoClientId: S.optional(S.String) }) {}
export class AuthenticationDescription extends S.Class<AuthenticationDescription>(
  "AuthenticationDescription",
)({
  providers: AuthenticationProviders,
  saml: S.optional(SamlAuthentication),
  awsSso: S.optional(AwsSsoAuthentication),
}) {}
export class DescribeWorkspaceAuthenticationResponse extends S.Class<DescribeWorkspaceAuthenticationResponse>(
  "DescribeWorkspaceAuthenticationResponse",
)({ authentication: AuthenticationDescription }) {}
export class UpdateWorkspaceAuthenticationResponse extends S.Class<UpdateWorkspaceAuthenticationResponse>(
  "UpdateWorkspaceAuthenticationResponse",
)({ authentication: AuthenticationDescription }) {}
export class AssociateLicenseResponse extends S.Class<AssociateLicenseResponse>(
  "AssociateLicenseResponse",
)({ workspace: WorkspaceDescription }) {}
export class UpdateError extends S.Class<UpdateError>("UpdateError")({
  code: S.Number,
  message: S.String,
  causedBy: UpdateInstruction,
}) {}
export const UpdateErrorList = S.Array(UpdateError);
export class UpdatePermissionsResponse extends S.Class<UpdatePermissionsResponse>(
  "UpdatePermissionsResponse",
)({ errors: UpdateErrorList }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Returns a list of Amazon Managed Grafana workspaces in the account, with some information
 * about each workspace. For more complete information about one workspace, use DescribeWorkspace.
 */
export const listWorkspaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkspacesRequest,
    output: ListWorkspacesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workspaces",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets the current configuration string for the given workspace.
 */
export const describeWorkspaceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeWorkspaceConfigurationRequest,
    output: DescribeWorkspaceConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a Grafana API key for the workspace. This key can be used to authenticate
 * requests sent to the workspace's HTTP API. See https://docs.aws.amazon.com/grafana/latest/userguide/Using-Grafana-APIs.html
 * for available APIs and example requests.
 *
 * In workspaces compatible with Grafana version 9 or above, use workspace service
 * accounts instead of API keys. API keys will be removed in a future release.
 */
export const createWorkspaceApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkspaceApiKeyRequest,
    output: CreateWorkspaceApiKeyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the users and groups who have the Grafana `Admin` and
 * `Editor` roles in this workspace. If you use this operation without
 * specifying `userId` or `groupId`, the operation returns the roles
 * of all users and groups. If you specify a `userId` or a `groupId`,
 * only the roles for that user or group are returned. If you do this, you can specify only
 * one `userId` or one `groupId`.
 */
export const listPermissions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPermissionsRequest,
    output: ListPermissionsResponse,
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
      items: "permissions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of service accounts for a workspace.
 *
 * Service accounts are only available for workspaces that are compatible with Grafana
 * version 9 and above.
 */
export const listWorkspaceServiceAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkspaceServiceAccountsRequest,
    output: ListWorkspaceServiceAccountsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "serviceAccounts",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a token that can be used to authenticate and authorize Grafana HTTP API
 * operations for the given workspace service
 * account. The service account acts as a user for the API operations, and
 * defines the permissions that are used by the API.
 *
 * When you create the service account token, you will receive a key that is used
 * when calling Grafana APIs. Do not lose this key, as it will not be retrievable
 * again.
 *
 * If you do lose the key, you can delete the token and recreate it to receive a
 * new key. This will disable the initial key.
 *
 * Service accounts are only available for workspaces that are compatible with Grafana
 * version 9 and above.
 */
export const createWorkspaceServiceAccountToken =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWorkspaceServiceAccountTokenRequest,
    output: CreateWorkspaceServiceAccountTokenResponse,
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
 * Returns a list of tokens for a workspace service account.
 *
 * This does not return the key for each token. You cannot access keys after they
 * are created. To create a new key, delete the token and recreate it.
 *
 * Service accounts are only available for workspaces that are compatible with Grafana
 * version 9 and above.
 */
export const listWorkspaceServiceAccountTokens =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkspaceServiceAccountTokensRequest,
    output: ListWorkspaceServiceAccountTokensResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "serviceAccountTokens",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Removes the Grafana Enterprise license from a workspace.
 */
export const disassociateLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateLicenseRequest,
  output: DisassociateLicenseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays information about one Amazon Managed Grafana workspace.
 */
export const describeWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkspaceRequest,
  output: DescribeWorkspaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The `ListTagsForResource` operation returns the tags that are associated
 * with the Amazon Managed Service for Grafana resource specified by the
 * `resourceArn`. Currently, the only resource that can be tagged is a
 * workspace.
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
 * Lists available versions of Grafana. These are available when calling
 * `CreateWorkspace`. Optionally, include a workspace to list the versions
 * to which it can be upgraded.
 */
export const listVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListVersionsRequest,
    output: ListVersionsResponse,
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
      items: "grafanaVersions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * The `TagResource` operation associates tags with an Amazon Managed Grafana
 * resource. Currently, the only resource that can be tagged is workspaces.
 *
 * If you specify a new tag key for the resource, this tag is appended to the list of
 * tags associated with the resource. If you specify a tag key that is already associated
 * with the resource, the new tag value that you specify replaces the previous value for
 * that tag.
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
 * Deletes a Grafana API key for the workspace.
 *
 * In workspaces compatible with Grafana version 9 or above, use workspace service
 * accounts instead of API keys. API keys will be removed in a future release.
 */
export const deleteWorkspaceApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkspaceApiKeyRequest,
    output: DeleteWorkspaceApiKeyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a service account for the workspace. A service account can be used to call
 * Grafana HTTP APIs, and run automated workloads. After creating the service account with
 * the correct `GrafanaRole` for your use case, use
 * `CreateWorkspaceServiceAccountToken` to create a token that can be used to
 * authenticate and authorize Grafana HTTP API calls.
 *
 * You can only create service accounts for workspaces that are compatible with Grafana
 * version 9 and above.
 *
 * For more information about service accounts, see Service accounts in
 * the *Amazon Managed Grafana User Guide*.
 *
 * For more information about the Grafana HTTP APIs, see Using Grafana HTTP
 * APIs in the *Amazon Managed Grafana User Guide*.
 */
export const createWorkspaceServiceAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateWorkspaceServiceAccountRequest,
    output: CreateWorkspaceServiceAccountResponse,
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
 * Deletes a workspace service account from the workspace.
 *
 * This will delete any tokens created for the service account, as well. If the tokens
 * are currently in use, the will fail to authenticate / authorize after they are
 * deleted.
 *
 * Service accounts are only available for workspaces that are compatible with Grafana
 * version 9 and above.
 */
export const deleteWorkspaceServiceAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteWorkspaceServiceAccountRequest,
    output: DeleteWorkspaceServiceAccountResponse,
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
 * Deletes a token for the workspace service account.
 *
 * This will disable the key associated with the token. If any automation is currently
 * using the key, it will no longer be authenticated or authorized to perform actions with
 * the Grafana HTTP APIs.
 *
 * Service accounts are only available for workspaces that are compatible with Grafana
 * version 9 and above.
 */
export const deleteWorkspaceServiceAccountToken =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteWorkspaceServiceAccountTokenRequest,
    output: DeleteWorkspaceServiceAccountTokenResponse,
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
 * Modifies an existing Amazon Managed Grafana workspace. If you use this operation and omit
 * any optional parameters, the existing values of those parameters are not changed.
 *
 * To modify the user authentication methods that the workspace uses, such as SAML or
 * IAM Identity Center, use UpdateWorkspaceAuthentication.
 *
 * To modify which users in the workspace have the `Admin` and
 * `Editor` Grafana roles, use UpdatePermissions.
 */
export const updateWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkspaceRequest,
  output: UpdateWorkspaceResponse,
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
 * Deletes an Amazon Managed Grafana workspace.
 */
export const deleteWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkspaceRequest,
  output: DeleteWorkspaceResponse,
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
 * Updates the configuration string for the given workspace
 */
export const updateWorkspaceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateWorkspaceConfigurationRequest,
    output: UpdateWorkspaceConfigurationResponse,
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
 * The `UntagResource` operation removes the association of the tag with the
 * Amazon Managed Grafana resource.
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
 * Displays information about the authentication methods used in one Amazon Managed Grafana
 * workspace.
 */
export const describeWorkspaceAuthentication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeWorkspaceAuthenticationRequest,
    output: DescribeWorkspaceAuthenticationResponse,
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
 * Use this operation to define the identity provider (IdP) that this workspace
 * authenticates users from, using SAML. You can also map SAML assertion attributes to
 * workspace user information and define which groups in the assertion attribute are to
 * have the `Admin` and `Editor` roles in the workspace.
 *
 * Changes to the authentication method for a workspace may take a few minutes to
 * take effect.
 */
export const updateWorkspaceAuthentication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateWorkspaceAuthenticationRequest,
    output: UpdateWorkspaceAuthenticationResponse,
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
 * Assigns a Grafana Enterprise license to a workspace. To upgrade, you must use
 * `ENTERPRISE` for the `licenseType`, and pass in a valid
 * Grafana Labs token for the `grafanaToken`. Upgrading to Grafana Enterprise
 * incurs additional fees. For more information, see Upgrade a
 * workspace to Grafana Enterprise.
 */
export const associateLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateLicenseRequest,
  output: AssociateLicenseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a *workspace*. In a workspace, you can create Grafana
 * dashboards and visualizations to analyze your metrics, logs, and traces. You don't have
 * to build, package, or deploy any hardware to run the Grafana server.
 *
 * Don't use `CreateWorkspace` to modify an existing workspace. Instead, use
 * UpdateWorkspace.
 */
export const createWorkspace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkspaceRequest,
  output: CreateWorkspaceResponse,
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
 * Updates which users in a workspace have the Grafana `Admin` or
 * `Editor` roles.
 */
export const updatePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePermissionsRequest,
  output: UpdatePermissionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
