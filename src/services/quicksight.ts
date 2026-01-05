import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "QuickSight",
  serviceShapeName: "QuickSight_20180401",
});
const auth = T.AwsAuthSigv4({ name: "quicksight" });
const ver = T.ServiceVersion("2018-04-01");
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
                        url: "https://quicksight-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://quicksight-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://quicksight.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://quicksight.{Region}.{PartitionResult#dnsSuffix}",
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
export const AnswerIds = S.Array(S.String);
export const GroupsList = S.Array(S.String);
export const FolderArnList = S.Array(S.String);
export const LinkEntityArnList = S.Array(S.String);
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const DnsResolverList = S.Array(S.String);
export const ArnList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const AdditionalDashboardIdList = S.Array(S.String);
export const AssetBundleResourceArns = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const ActionList = S.Array(S.String);
export class ResourcePermission extends S.Class<ResourcePermission>(
  "ResourcePermission",
)({ Principal: S.String, Actions: ActionList }) {}
export const UpdateResourcePermissionList = S.Array(ResourcePermission);
export const UpdateLinkPermissionList = S.Array(ResourcePermission);
export const ActionsList = S.Array(S.String);
export class Permission extends S.Class<Permission>("Permission")({
  Actions: ActionsList,
  Principal: S.String,
}) {}
export const UpdateFlowPermissionsInputRevokePermissionsList =
  S.Array(Permission);
export const AuthorizedTargetsList = S.Array(S.String);
export class BatchDeleteTopicReviewedAnswerRequest extends S.Class<BatchDeleteTopicReviewedAnswerRequest>(
  "BatchDeleteTopicReviewedAnswerRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    AnswerIds: S.optional(AnswerIds),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/batch-delete-reviewed-answers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelIngestionRequest extends S.Class<CancelIngestionRequest>(
  "CancelIngestionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    IngestionId: S.String.pipe(T.HttpLabel("IngestionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/ingestions/{IngestionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAccountSubscriptionRequest extends S.Class<CreateAccountSubscriptionRequest>(
  "CreateAccountSubscriptionRequest",
)(
  {
    Edition: S.optional(S.String),
    AuthenticationMethod: S.String,
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AccountName: S.String,
    NotificationEmail: S.String,
    ActiveDirectoryName: S.optional(S.String),
    Realm: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    AdminGroup: S.optional(GroupsList),
    AuthorGroup: S.optional(GroupsList),
    ReaderGroup: S.optional(GroupsList),
    AdminProGroup: S.optional(GroupsList),
    AuthorProGroup: S.optional(GroupsList),
    ReaderProGroup: S.optional(GroupsList),
    FirstName: S.optional(S.String),
    LastName: S.optional(S.String),
    EmailAddress: S.optional(S.String),
    ContactNumber: S.optional(S.String),
    IAMIdentityCenterInstanceArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/account/{AwsAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourcePermissionList = S.Array(ResourcePermission);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateFolderRequest extends S.Class<CreateFolderRequest>(
  "CreateFolderRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Name: S.optional(S.String),
    FolderType: S.optional(S.String),
    ParentFolderArn: S.optional(S.String),
    Permissions: S.optional(ResourcePermissionList),
    Tags: S.optional(TagList),
    SharingModel: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFolderMembershipRequest extends S.Class<CreateFolderMembershipRequest>(
  "CreateFolderMembershipRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
    MemberType: S.String.pipe(T.HttpLabel("MemberType")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/members/{MemberType}/{MemberId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    GroupName: S.String,
    Description: S.optional(S.String),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateGroupMembershipRequest extends S.Class<CreateGroupMembershipRequest>(
  "CreateGroupMembershipRequest",
)(
  {
    MemberName: S.String.pipe(T.HttpLabel("MemberName")),
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}/members/{MemberName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIngestionRequest extends S.Class<CreateIngestionRequest>(
  "CreateIngestionRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    IngestionId: S.String.pipe(T.HttpLabel("IngestionId")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    IngestionType: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/ingestions/{IngestionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNamespaceRequest extends S.Class<CreateNamespaceRequest>(
  "CreateNamespaceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String,
    IdentityStore: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoleMembershipRequest extends S.Class<CreateRoleMembershipRequest>(
  "CreateRoleMembershipRequest",
)(
  {
    MemberName: S.String.pipe(T.HttpLabel("MemberName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    Role: S.String.pipe(T.HttpLabel("Role")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/members/{MemberName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTemplateAliasRequest extends S.Class<CreateTemplateAliasRequest>(
  "CreateTemplateAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
    TemplateVersionNumber: S.Number,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThemeAliasRequest extends S.Class<CreateThemeAliasRequest>(
  "CreateThemeAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
    ThemeVersionNumber: S.Number,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVPCConnectionRequest extends S.Class<CreateVPCConnectionRequest>(
  "CreateVPCConnectionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    VPCConnectionId: S.String,
    Name: S.String,
    SubnetIds: SubnetIdList,
    SecurityGroupIds: SecurityGroupIdList,
    DnsResolvers: S.optional(DnsResolverList),
    RoleArn: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/vpc-connections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountCustomizationRequest extends S.Class<DeleteAccountCustomizationRequest>(
  "DeleteAccountCustomizationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/customizations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountCustomPermissionRequest extends S.Class<DeleteAccountCustomPermissionRequest>(
  "DeleteAccountCustomPermissionRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountSubscriptionRequest extends S.Class<DeleteAccountSubscriptionRequest>(
  "DeleteAccountSubscriptionRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/account/{AwsAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteActionConnectorRequest extends S.Class<DeleteActionConnectorRequest>(
  "DeleteActionConnectorRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String.pipe(T.HttpLabel("ActionConnectorId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/action-connectors/{ActionConnectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAnalysisRequest extends S.Class<DeleteAnalysisRequest>(
  "DeleteAnalysisRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
    RecoveryWindowInDays: S.optional(S.Number).pipe(
      T.HttpQuery("recovery-window-in-days"),
    ),
    ForceDeleteWithoutRecovery: S.optional(S.Boolean).pipe(
      T.HttpQuery("force-delete-without-recovery"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrandRequest extends S.Class<DeleteBrandRequest>(
  "DeleteBrandRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/brands/{BrandId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBrandAssignmentRequest extends S.Class<DeleteBrandAssignmentRequest>(
  "DeleteBrandAssignmentRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/brandassignments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomPermissionsRequest extends S.Class<DeleteCustomPermissionsRequest>(
  "DeleteCustomPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    CustomPermissionsName: S.String.pipe(T.HttpLabel("CustomPermissionsName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/custom-permissions/{CustomPermissionsName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDashboardRequest extends S.Class<DeleteDashboardRequest>(
  "DeleteDashboardRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSetRequest extends S.Class<DeleteDataSetRequest>(
  "DeleteDataSetRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSetRefreshPropertiesRequest extends S.Class<DeleteDataSetRefreshPropertiesRequest>(
  "DeleteDataSetRefreshPropertiesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-properties",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataSourceRequest extends S.Class<DeleteDataSourceRequest>(
  "DeleteDataSourceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String.pipe(T.HttpLabel("DataSourceId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/data-sources/{DataSourceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDefaultQBusinessApplicationRequest extends S.Class<DeleteDefaultQBusinessApplicationRequest>(
  "DeleteDefaultQBusinessApplicationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/default-qbusiness-application",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFolderRequest extends S.Class<DeleteFolderRequest>(
  "DeleteFolderRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFolderMembershipRequest extends S.Class<DeleteFolderMembershipRequest>(
  "DeleteFolderMembershipRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
    MemberType: S.String.pipe(T.HttpLabel("MemberType")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/members/{MemberType}/{MemberId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  {
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupMembershipRequest extends S.Class<DeleteGroupMembershipRequest>(
  "DeleteGroupMembershipRequest",
)(
  {
    MemberName: S.String.pipe(T.HttpLabel("MemberName")),
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}/members/{MemberName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIAMPolicyAssignmentRequest extends S.Class<DeleteIAMPolicyAssignmentRequest>(
  "DeleteIAMPolicyAssignmentRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssignmentName: S.String.pipe(T.HttpLabel("AssignmentName")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespace/{Namespace}/iam-policy-assignments/{AssignmentName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteIdentityPropagationConfigRequest extends S.Class<DeleteIdentityPropagationConfigRequest>(
  "DeleteIdentityPropagationConfigRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Service: S.String.pipe(T.HttpLabel("Service")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/identity-propagation-config/{Service}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNamespaceRequest extends S.Class<DeleteNamespaceRequest>(
  "DeleteNamespaceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRefreshScheduleRequest extends S.Class<DeleteRefreshScheduleRequest>(
  "DeleteRefreshScheduleRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ScheduleId: S.String.pipe(T.HttpLabel("ScheduleId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-schedules/{ScheduleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoleCustomPermissionRequest extends S.Class<DeleteRoleCustomPermissionRequest>(
  "DeleteRoleCustomPermissionRequest",
)(
  {
    Role: S.String.pipe(T.HttpLabel("Role")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoleMembershipRequest extends S.Class<DeleteRoleMembershipRequest>(
  "DeleteRoleMembershipRequest",
)(
  {
    MemberName: S.String.pipe(T.HttpLabel("MemberName")),
    Role: S.String.pipe(T.HttpLabel("Role")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/members/{MemberName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateRequest extends S.Class<DeleteTemplateRequest>(
  "DeleteTemplateRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateAliasRequest extends S.Class<DeleteTemplateAliasRequest>(
  "DeleteTemplateAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThemeRequest extends S.Class<DeleteThemeRequest>(
  "DeleteThemeRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteThemeAliasRequest extends S.Class<DeleteThemeAliasRequest>(
  "DeleteThemeAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTopicRequest extends S.Class<DeleteTopicRequest>(
  "DeleteTopicRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTopicRefreshScheduleRequest extends S.Class<DeleteTopicRefreshScheduleRequest>(
  "DeleteTopicRefreshScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    DatasetId: S.String.pipe(T.HttpLabel("DatasetId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/schedules/{DatasetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserByPrincipalIdRequest extends S.Class<DeleteUserByPrincipalIdRequest>(
  "DeleteUserByPrincipalIdRequest",
)(
  {
    PrincipalId: S.String.pipe(T.HttpLabel("PrincipalId")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/user-principals/{PrincipalId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserCustomPermissionRequest extends S.Class<DeleteUserCustomPermissionRequest>(
  "DeleteUserCustomPermissionRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVPCConnectionRequest extends S.Class<DeleteVPCConnectionRequest>(
  "DeleteVPCConnectionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    VPCConnectionId: S.String.pipe(T.HttpLabel("VPCConnectionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/accounts/{AwsAccountId}/vpc-connections/{VPCConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccountCustomizationRequest extends S.Class<DescribeAccountCustomizationRequest>(
  "DescribeAccountCustomizationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    Resolved: S.optional(S.Boolean).pipe(T.HttpQuery("resolved")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/customizations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccountCustomPermissionRequest extends S.Class<DescribeAccountCustomPermissionRequest>(
  "DescribeAccountCustomPermissionRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccountSettingsRequest extends S.Class<DescribeAccountSettingsRequest>(
  "DescribeAccountSettingsRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAccountSubscriptionRequest extends S.Class<DescribeAccountSubscriptionRequest>(
  "DescribeAccountSubscriptionRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({ method: "GET", uri: "/account/{AwsAccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeActionConnectorRequest extends S.Class<DescribeActionConnectorRequest>(
  "DescribeActionConnectorRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String.pipe(T.HttpLabel("ActionConnectorId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/action-connectors/{ActionConnectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeActionConnectorPermissionsRequest extends S.Class<DescribeActionConnectorPermissionsRequest>(
  "DescribeActionConnectorPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String.pipe(T.HttpLabel("ActionConnectorId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/action-connectors/{ActionConnectorId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnalysisRequest extends S.Class<DescribeAnalysisRequest>(
  "DescribeAnalysisRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnalysisDefinitionRequest extends S.Class<DescribeAnalysisDefinitionRequest>(
  "DescribeAnalysisDefinitionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnalysisPermissionsRequest extends S.Class<DescribeAnalysisPermissionsRequest>(
  "DescribeAnalysisPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetBundleExportJobRequest extends S.Class<DescribeAssetBundleExportJobRequest>(
  "DescribeAssetBundleExportJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssetBundleExportJobId: S.String.pipe(
      T.HttpLabel("AssetBundleExportJobId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/asset-bundle-export-jobs/{AssetBundleExportJobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAssetBundleImportJobRequest extends S.Class<DescribeAssetBundleImportJobRequest>(
  "DescribeAssetBundleImportJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssetBundleImportJobId: S.String.pipe(
      T.HttpLabel("AssetBundleImportJobId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/asset-bundle-import-jobs/{AssetBundleImportJobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrandRequest extends S.Class<DescribeBrandRequest>(
  "DescribeBrandRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/brands/{BrandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrandAssignmentRequest extends S.Class<DescribeBrandAssignmentRequest>(
  "DescribeBrandAssignmentRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/brandassignments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrandPublishedVersionRequest extends S.Class<DescribeBrandPublishedVersionRequest>(
  "DescribeBrandPublishedVersionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/brands/{BrandId}/publishedversion",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCustomPermissionsRequest extends S.Class<DescribeCustomPermissionsRequest>(
  "DescribeCustomPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    CustomPermissionsName: S.String.pipe(T.HttpLabel("CustomPermissionsName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/custom-permissions/{CustomPermissionsName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardRequest extends S.Class<DescribeDashboardRequest>(
  "DescribeDashboardRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
    AliasName: S.optional(S.String).pipe(T.HttpQuery("alias-name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardDefinitionRequest extends S.Class<DescribeDashboardDefinitionRequest>(
  "DescribeDashboardDefinitionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
    AliasName: S.optional(S.String).pipe(T.HttpQuery("alias-name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardPermissionsRequest extends S.Class<DescribeDashboardPermissionsRequest>(
  "DescribeDashboardPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardSnapshotJobRequest extends S.Class<DescribeDashboardSnapshotJobRequest>(
  "DescribeDashboardSnapshotJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    SnapshotJobId: S.String.pipe(T.HttpLabel("SnapshotJobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/snapshot-jobs/{SnapshotJobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardSnapshotJobResultRequest extends S.Class<DescribeDashboardSnapshotJobResultRequest>(
  "DescribeDashboardSnapshotJobResultRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    SnapshotJobId: S.String.pipe(T.HttpLabel("SnapshotJobId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/snapshot-jobs/{SnapshotJobId}/result",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDashboardsQAConfigurationRequest extends S.Class<DescribeDashboardsQAConfigurationRequest>(
  "DescribeDashboardsQAConfigurationRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards-qa-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataSetRequest extends S.Class<DescribeDataSetRequest>(
  "DescribeDataSetRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataSetPermissionsRequest extends S.Class<DescribeDataSetPermissionsRequest>(
  "DescribeDataSetPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataSetRefreshPropertiesRequest extends S.Class<DescribeDataSetRefreshPropertiesRequest>(
  "DescribeDataSetRefreshPropertiesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-properties",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataSourceRequest extends S.Class<DescribeDataSourceRequest>(
  "DescribeDataSourceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String.pipe(T.HttpLabel("DataSourceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sources/{DataSourceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDataSourcePermissionsRequest extends S.Class<DescribeDataSourcePermissionsRequest>(
  "DescribeDataSourcePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String.pipe(T.HttpLabel("DataSourceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sources/{DataSourceId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDefaultQBusinessApplicationRequest extends S.Class<DescribeDefaultQBusinessApplicationRequest>(
  "DescribeDefaultQBusinessApplicationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/default-qbusiness-application",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFolderRequest extends S.Class<DescribeFolderRequest>(
  "DescribeFolderRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFolderPermissionsRequest extends S.Class<DescribeFolderPermissionsRequest>(
  "DescribeFolderPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFolderResolvedPermissionsRequest extends S.Class<DescribeFolderResolvedPermissionsRequest>(
  "DescribeFolderResolvedPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/resolved-permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGroupRequest extends S.Class<DescribeGroupRequest>(
  "DescribeGroupRequest",
)(
  {
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGroupMembershipRequest extends S.Class<DescribeGroupMembershipRequest>(
  "DescribeGroupMembershipRequest",
)(
  {
    MemberName: S.String.pipe(T.HttpLabel("MemberName")),
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}/members/{MemberName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIAMPolicyAssignmentRequest extends S.Class<DescribeIAMPolicyAssignmentRequest>(
  "DescribeIAMPolicyAssignmentRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssignmentName: S.String.pipe(T.HttpLabel("AssignmentName")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/iam-policy-assignments/{AssignmentName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIngestionRequest extends S.Class<DescribeIngestionRequest>(
  "DescribeIngestionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    IngestionId: S.String.pipe(T.HttpLabel("IngestionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/ingestions/{IngestionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeIpRestrictionRequest extends S.Class<DescribeIpRestrictionRequest>(
  "DescribeIpRestrictionRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/ip-restriction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeKeyRegistrationRequest extends S.Class<DescribeKeyRegistrationRequest>(
  "DescribeKeyRegistrationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DefaultKeyOnly: S.optional(S.Boolean).pipe(T.HttpQuery("default-key-only")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/key-registration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNamespaceRequest extends S.Class<DescribeNamespaceRequest>(
  "DescribeNamespaceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeQPersonalizationConfigurationRequest extends S.Class<DescribeQPersonalizationConfigurationRequest>(
  "DescribeQPersonalizationConfigurationRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/q-personalization-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeQuickSightQSearchConfigurationRequest extends S.Class<DescribeQuickSightQSearchConfigurationRequest>(
  "DescribeQuickSightQSearchConfigurationRequest",
)(
  { AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/quicksight-q-search-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRefreshScheduleRequest extends S.Class<DescribeRefreshScheduleRequest>(
  "DescribeRefreshScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    ScheduleId: S.String.pipe(T.HttpLabel("ScheduleId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-schedules/{ScheduleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRoleCustomPermissionRequest extends S.Class<DescribeRoleCustomPermissionRequest>(
  "DescribeRoleCustomPermissionRequest",
)(
  {
    Role: S.String.pipe(T.HttpLabel("Role")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSelfUpgradeConfigurationRequest extends S.Class<DescribeSelfUpgradeConfigurationRequest>(
  "DescribeSelfUpgradeConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/self-upgrade-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTemplateRequest extends S.Class<DescribeTemplateRequest>(
  "DescribeTemplateRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
    AliasName: S.optional(S.String).pipe(T.HttpQuery("alias-name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTemplateAliasRequest extends S.Class<DescribeTemplateAliasRequest>(
  "DescribeTemplateAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTemplateDefinitionRequest extends S.Class<DescribeTemplateDefinitionRequest>(
  "DescribeTemplateDefinitionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
    AliasName: S.optional(S.String).pipe(T.HttpQuery("alias-name")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/definition",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTemplatePermissionsRequest extends S.Class<DescribeTemplatePermissionsRequest>(
  "DescribeTemplatePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThemeRequest extends S.Class<DescribeThemeRequest>(
  "DescribeThemeRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    VersionNumber: S.optional(S.Number).pipe(T.HttpQuery("version-number")),
    AliasName: S.optional(S.String).pipe(T.HttpQuery("alias-name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/themes/{ThemeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThemeAliasRequest extends S.Class<DescribeThemeAliasRequest>(
  "DescribeThemeAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThemePermissionsRequest extends S.Class<DescribeThemePermissionsRequest>(
  "DescribeThemePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicRequest extends S.Class<DescribeTopicRequest>(
  "DescribeTopicRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/topics/{TopicId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicPermissionsRequest extends S.Class<DescribeTopicPermissionsRequest>(
  "DescribeTopicPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicRefreshRequest extends S.Class<DescribeTopicRefreshRequest>(
  "DescribeTopicRefreshRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    RefreshId: S.String.pipe(T.HttpLabel("RefreshId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/refresh/{RefreshId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTopicRefreshScheduleRequest extends S.Class<DescribeTopicRefreshScheduleRequest>(
  "DescribeTopicRefreshScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    DatasetId: S.String.pipe(T.HttpLabel("DatasetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/schedules/{DatasetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVPCConnectionRequest extends S.Class<DescribeVPCConnectionRequest>(
  "DescribeVPCConnectionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    VPCConnectionId: S.String.pipe(T.HttpLabel("VPCConnectionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/vpc-connections/{VPCConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StatePersistenceConfigurations extends S.Class<StatePersistenceConfigurations>(
  "StatePersistenceConfigurations",
)({ Enabled: S.Boolean }) {}
export class SharedViewConfigurations extends S.Class<SharedViewConfigurations>(
  "SharedViewConfigurations",
)({ Enabled: S.Boolean }) {}
export class BookmarksConfigurations extends S.Class<BookmarksConfigurations>(
  "BookmarksConfigurations",
)({ Enabled: S.Boolean }) {}
export class ExecutiveSummaryConfigurations extends S.Class<ExecutiveSummaryConfigurations>(
  "ExecutiveSummaryConfigurations",
)({ Enabled: S.Boolean }) {}
export class AmazonQInQuickSightDashboardConfigurations extends S.Class<AmazonQInQuickSightDashboardConfigurations>(
  "AmazonQInQuickSightDashboardConfigurations",
)({ ExecutiveSummary: S.optional(ExecutiveSummaryConfigurations) }) {}
export class SchedulesConfigurations extends S.Class<SchedulesConfigurations>(
  "SchedulesConfigurations",
)({ Enabled: S.Boolean }) {}
export class RecentSnapshotsConfigurations extends S.Class<RecentSnapshotsConfigurations>(
  "RecentSnapshotsConfigurations",
)({ Enabled: S.Boolean }) {}
export class ThresholdAlertsConfigurations extends S.Class<ThresholdAlertsConfigurations>(
  "ThresholdAlertsConfigurations",
)({ Enabled: S.Boolean }) {}
export class RegisteredUserDashboardFeatureConfigurations extends S.Class<RegisteredUserDashboardFeatureConfigurations>(
  "RegisteredUserDashboardFeatureConfigurations",
)({
  StatePersistence: S.optional(StatePersistenceConfigurations),
  SharedView: S.optional(SharedViewConfigurations),
  Bookmarks: S.optional(BookmarksConfigurations),
  AmazonQInQuickSight: S.optional(AmazonQInQuickSightDashboardConfigurations),
  Schedules: S.optional(SchedulesConfigurations),
  RecentSnapshots: S.optional(RecentSnapshotsConfigurations),
  ThresholdAlerts: S.optional(ThresholdAlertsConfigurations),
}) {}
export class RegisteredUserDashboardEmbeddingConfiguration extends S.Class<RegisteredUserDashboardEmbeddingConfiguration>(
  "RegisteredUserDashboardEmbeddingConfiguration",
)({
  InitialDashboardId: S.String,
  FeatureConfigurations: S.optional(
    RegisteredUserDashboardFeatureConfigurations,
  ),
}) {}
export class DataQnAConfigurations extends S.Class<DataQnAConfigurations>(
  "DataQnAConfigurations",
)({ Enabled: S.Boolean }) {}
export class GenerativeAuthoringConfigurations extends S.Class<GenerativeAuthoringConfigurations>(
  "GenerativeAuthoringConfigurations",
)({ Enabled: S.Boolean }) {}
export class DataStoriesConfigurations extends S.Class<DataStoriesConfigurations>(
  "DataStoriesConfigurations",
)({ Enabled: S.Boolean }) {}
export class AmazonQInQuickSightConsoleConfigurations extends S.Class<AmazonQInQuickSightConsoleConfigurations>(
  "AmazonQInQuickSightConsoleConfigurations",
)({
  DataQnA: S.optional(DataQnAConfigurations),
  GenerativeAuthoring: S.optional(GenerativeAuthoringConfigurations),
  ExecutiveSummary: S.optional(ExecutiveSummaryConfigurations),
  DataStories: S.optional(DataStoriesConfigurations),
}) {}
export class RegisteredUserConsoleFeatureConfigurations extends S.Class<RegisteredUserConsoleFeatureConfigurations>(
  "RegisteredUserConsoleFeatureConfigurations",
)({
  StatePersistence: S.optional(StatePersistenceConfigurations),
  SharedView: S.optional(SharedViewConfigurations),
  AmazonQInQuickSight: S.optional(AmazonQInQuickSightConsoleConfigurations),
  Schedules: S.optional(SchedulesConfigurations),
  RecentSnapshots: S.optional(RecentSnapshotsConfigurations),
  ThresholdAlerts: S.optional(ThresholdAlertsConfigurations),
}) {}
export class RegisteredUserQuickSightConsoleEmbeddingConfiguration extends S.Class<RegisteredUserQuickSightConsoleEmbeddingConfiguration>(
  "RegisteredUserQuickSightConsoleEmbeddingConfiguration",
)({
  InitialPath: S.optional(S.String),
  FeatureConfigurations: S.optional(RegisteredUserConsoleFeatureConfigurations),
}) {}
export class RegisteredUserQSearchBarEmbeddingConfiguration extends S.Class<RegisteredUserQSearchBarEmbeddingConfiguration>(
  "RegisteredUserQSearchBarEmbeddingConfiguration",
)({ InitialTopicId: S.optional(S.String) }) {}
export class DashboardVisualId extends S.Class<DashboardVisualId>(
  "DashboardVisualId",
)({ DashboardId: S.String, SheetId: S.String, VisualId: S.String }) {}
export class RegisteredUserDashboardVisualEmbeddingConfiguration extends S.Class<RegisteredUserDashboardVisualEmbeddingConfiguration>(
  "RegisteredUserDashboardVisualEmbeddingConfiguration",
)({ InitialDashboardVisualId: DashboardVisualId }) {}
export class RegisteredUserGenerativeQnAEmbeddingConfiguration extends S.Class<RegisteredUserGenerativeQnAEmbeddingConfiguration>(
  "RegisteredUserGenerativeQnAEmbeddingConfiguration",
)({ InitialTopicId: S.optional(S.String) }) {}
export class RegisteredUserQuickChatEmbeddingConfiguration extends S.Class<RegisteredUserQuickChatEmbeddingConfiguration>(
  "RegisteredUserQuickChatEmbeddingConfiguration",
)({}) {}
export class RegisteredUserEmbeddingExperienceConfiguration extends S.Class<RegisteredUserEmbeddingExperienceConfiguration>(
  "RegisteredUserEmbeddingExperienceConfiguration",
)({
  Dashboard: S.optional(RegisteredUserDashboardEmbeddingConfiguration),
  QuickSightConsole: S.optional(
    RegisteredUserQuickSightConsoleEmbeddingConfiguration,
  ),
  QSearchBar: S.optional(RegisteredUserQSearchBarEmbeddingConfiguration),
  DashboardVisual: S.optional(
    RegisteredUserDashboardVisualEmbeddingConfiguration,
  ),
  GenerativeQnA: S.optional(RegisteredUserGenerativeQnAEmbeddingConfiguration),
  QuickChat: S.optional(RegisteredUserQuickChatEmbeddingConfiguration),
}) {}
export class GenerateEmbedUrlForRegisteredUserWithIdentityRequest extends S.Class<GenerateEmbedUrlForRegisteredUserWithIdentityRequest>(
  "GenerateEmbedUrlForRegisteredUserWithIdentityRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    SessionLifetimeInMinutes: S.optional(S.Number),
    ExperienceConfiguration: RegisteredUserEmbeddingExperienceConfiguration,
    AllowedDomains: S.optional(StringList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/embed-url/registered-user-with-identity",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDashboardEmbedUrlRequest extends S.Class<GetDashboardEmbedUrlRequest>(
  "GetDashboardEmbedUrlRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    IdentityType: S.String.pipe(T.HttpQuery("creds-type")),
    SessionLifetimeInMinutes: S.optional(S.Number).pipe(
      T.HttpQuery("session-lifetime"),
    ),
    UndoRedoDisabled: S.optional(S.Boolean).pipe(
      T.HttpQuery("undo-redo-disabled"),
    ),
    ResetDisabled: S.optional(S.Boolean).pipe(T.HttpQuery("reset-disabled")),
    StatePersistenceEnabled: S.optional(S.Boolean).pipe(
      T.HttpQuery("state-persistence-enabled"),
    ),
    UserArn: S.optional(S.String).pipe(T.HttpQuery("user-arn")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    AdditionalDashboardIds: S.optional(AdditionalDashboardIdList).pipe(
      T.HttpQuery("additional-dashboard-ids"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/embed-url",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowMetadataInput extends S.Class<GetFlowMetadataInput>(
  "GetFlowMetadataInput",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FlowId: S.String.pipe(T.HttpLabel("FlowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/flows/{FlowId}/metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFlowPermissionsInput extends S.Class<GetFlowPermissionsInput>(
  "GetFlowPermissionsInput",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FlowId: S.String.pipe(T.HttpLabel("FlowId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/flows/{FlowId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionEmbedUrlRequest extends S.Class<GetSessionEmbedUrlRequest>(
  "GetSessionEmbedUrlRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    EntryPoint: S.optional(S.String).pipe(T.HttpQuery("entry-point")),
    SessionLifetimeInMinutes: S.optional(S.Number).pipe(
      T.HttpQuery("session-lifetime"),
    ),
    UserArn: S.optional(S.String).pipe(T.HttpQuery("user-arn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/session-embed-url",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListActionConnectorsRequest extends S.Class<ListActionConnectorsRequest>(
  "ListActionConnectorsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/action-connectors",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnalysesRequest extends S.Class<ListAnalysesRequest>(
  "ListAnalysesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/analyses" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetBundleExportJobsRequest extends S.Class<ListAssetBundleExportJobsRequest>(
  "ListAssetBundleExportJobsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/asset-bundle-export-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssetBundleImportJobsRequest extends S.Class<ListAssetBundleImportJobsRequest>(
  "ListAssetBundleImportJobsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/asset-bundle-import-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBrandsRequest extends S.Class<ListBrandsRequest>(
  "ListBrandsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/brands" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomPermissionsRequest extends S.Class<ListCustomPermissionsRequest>(
  "ListCustomPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/custom-permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDashboardsRequest extends S.Class<ListDashboardsRequest>(
  "ListDashboardsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/dashboards" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDashboardVersionsRequest extends S.Class<ListDashboardVersionsRequest>(
  "ListDashboardVersionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetsRequest extends S.Class<ListDataSetsRequest>(
  "ListDataSetsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/data-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSourcesRequest extends S.Class<ListDataSourcesRequest>(
  "ListDataSourcesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/data-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFlowsInput extends S.Class<ListFlowsInput>("ListFlowsInput")(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/flows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFolderMembersRequest extends S.Class<ListFolderMembersRequest>(
  "ListFolderMembersRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFoldersRequest extends S.Class<ListFoldersRequest>(
  "ListFoldersRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/folders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFoldersForResourceRequest extends S.Class<ListFoldersForResourceRequest>(
  "ListFoldersForResourceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/resource/{ResourceArn}/folders",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupMembershipsRequest extends S.Class<ListGroupMembershipsRequest>(
  "ListGroupMembershipsRequest",
)(
  {
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIAMPolicyAssignmentsRequest extends S.Class<ListIAMPolicyAssignmentsRequest>(
  "ListIAMPolicyAssignmentsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssignmentStatus: S.optional(S.String).pipe(
      T.HttpQuery("assignment-status"),
    ),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/v2/iam-policy-assignments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIAMPolicyAssignmentsForUserRequest extends S.Class<ListIAMPolicyAssignmentsForUserRequest>(
  "ListIAMPolicyAssignmentsForUserRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}/iam-policy-assignments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIdentityPropagationConfigsRequest extends S.Class<ListIdentityPropagationConfigsRequest>(
  "ListIdentityPropagationConfigsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/identity-propagation-config",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIngestionsRequest extends S.Class<ListIngestionsRequest>(
  "ListIngestionsRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/ingestions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNamespacesRequest extends S.Class<ListNamespacesRequest>(
  "ListNamespacesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/namespaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRefreshSchedulesRequest extends S.Class<ListRefreshSchedulesRequest>(
  "ListRefreshSchedulesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-schedules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoleMembershipsRequest extends S.Class<ListRoleMembershipsRequest>(
  "ListRoleMembershipsRequest",
)(
  {
    Role: S.String.pipe(T.HttpLabel("Role")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/members",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSelfUpgradesRequest extends S.Class<ListSelfUpgradesRequest>(
  "ListSelfUpgradesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/self-upgrade-requests",
    }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resources/{ResourceArn}/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplateAliasesRequest extends S.Class<ListTemplateAliasesRequest>(
  "ListTemplateAliasesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-result")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/aliases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplatesRequest extends S.Class<ListTemplatesRequest>(
  "ListTemplatesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-result")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplateVersionsRequest extends S.Class<ListTemplateVersionsRequest>(
  "ListTemplateVersionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThemeAliasesRequest extends S.Class<ListThemeAliasesRequest>(
  "ListThemeAliasesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-result")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/aliases",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThemesRequest extends S.Class<ListThemesRequest>(
  "ListThemesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    Type: S.optional(S.String).pipe(T.HttpQuery("type")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/themes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListThemeVersionsRequest extends S.Class<ListThemeVersionsRequest>(
  "ListThemeVersionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/versions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicRefreshSchedulesRequest extends S.Class<ListTopicRefreshSchedulesRequest>(
  "ListTopicRefreshSchedulesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/schedules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicReviewedAnswersRequest extends S.Class<ListTopicReviewedAnswersRequest>(
  "ListTopicReviewedAnswersRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/reviewed-answers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTopicsRequest extends S.Class<ListTopicsRequest>(
  "ListTopicsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/topics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUserGroupsRequest extends S.Class<ListUserGroupsRequest>(
  "ListUserGroupsRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}/groups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVPCConnectionsRequest extends S.Class<ListVPCConnectionsRequest>(
  "ListVPCConnectionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AwsAccountId}/vpc-connections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PredictQAResultsRequest extends S.Class<PredictQAResultsRequest>(
  "PredictQAResultsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    QueryText: S.String,
    IncludeQuickSightQIndex: S.optional(S.String),
    IncludeGeneratedAnswer: S.optional(S.String),
    MaxTopicsToConsider: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/qa/predict" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterUserRequest extends S.Class<RegisterUserRequest>(
  "RegisterUserRequest",
)(
  {
    IdentityType: S.String,
    Email: S.String,
    UserRole: S.String,
    IamArn: S.optional(S.String),
    SessionName: S.optional(S.String),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    UserName: S.optional(S.String),
    CustomPermissionsName: S.optional(S.String),
    ExternalLoginFederationProviderType: S.optional(S.String),
    CustomFederationProviderUrl: S.optional(S.String),
    ExternalLoginId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestoreAnalysisRequest extends S.Class<RestoreAnalysisRequest>(
  "RestoreAnalysisRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
    RestoreToFolders: S.optional(S.Boolean).pipe(
      T.HttpQuery("restore-to-folders"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/restore/analyses/{AnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDashboardSnapshotJobScheduleRequest extends S.Class<StartDashboardSnapshotJobScheduleRequest>(
  "StartDashboardSnapshotJobScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    ScheduleId: S.String.pipe(T.HttpLabel("ScheduleId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/schedules/{ScheduleId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/resources/{ResourceArn}/tags" }),
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
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("keys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/resources/{ResourceArn}/tags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccountCustomization extends S.Class<AccountCustomization>(
  "AccountCustomization",
)({
  DefaultTheme: S.optional(S.String),
  DefaultEmailCustomizationTemplate: S.optional(S.String),
}) {}
export class UpdateAccountCustomizationRequest extends S.Class<UpdateAccountCustomizationRequest>(
  "UpdateAccountCustomizationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    AccountCustomization: AccountCustomization,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/customizations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountCustomPermissionRequest extends S.Class<UpdateAccountCustomPermissionRequest>(
  "UpdateAccountCustomPermissionRequest",
)(
  {
    CustomPermissionsName: S.String,
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountSettingsRequest extends S.Class<UpdateAccountSettingsRequest>(
  "UpdateAccountSettingsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DefaultNamespace: S.String,
    NotificationEmail: S.optional(S.String),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AuthorizationCodeGrantDetails extends S.Class<AuthorizationCodeGrantDetails>(
  "AuthorizationCodeGrantDetails",
)({
  ClientId: S.String,
  ClientSecret: S.String,
  TokenEndpoint: S.String,
  AuthorizationEndpoint: S.String,
}) {}
export const AuthorizationCodeGrantCredentialsDetails = S.Union(
  S.Struct({ AuthorizationCodeGrantDetails: AuthorizationCodeGrantDetails }),
);
export class AuthorizationCodeGrantMetadata extends S.Class<AuthorizationCodeGrantMetadata>(
  "AuthorizationCodeGrantMetadata",
)({
  BaseEndpoint: S.String,
  RedirectUrl: S.String,
  AuthorizationCodeGrantCredentialsSource: S.optional(S.String),
  AuthorizationCodeGrantCredentialsDetails: S.optional(
    AuthorizationCodeGrantCredentialsDetails,
  ),
}) {}
export class ClientCredentialsGrantDetails extends S.Class<ClientCredentialsGrantDetails>(
  "ClientCredentialsGrantDetails",
)({ ClientId: S.String, ClientSecret: S.String, TokenEndpoint: S.String }) {}
export const ClientCredentialsDetails = S.Union(
  S.Struct({ ClientCredentialsGrantDetails: ClientCredentialsGrantDetails }),
);
export class ClientCredentialsGrantMetadata extends S.Class<ClientCredentialsGrantMetadata>(
  "ClientCredentialsGrantMetadata",
)({
  BaseEndpoint: S.String,
  ClientCredentialsSource: S.optional(S.String),
  ClientCredentialsDetails: S.optional(ClientCredentialsDetails),
}) {}
export class BasicAuthConnectionMetadata extends S.Class<BasicAuthConnectionMetadata>(
  "BasicAuthConnectionMetadata",
)({ BaseEndpoint: S.String, Username: S.String, Password: S.String }) {}
export class APIKeyConnectionMetadata extends S.Class<APIKeyConnectionMetadata>(
  "APIKeyConnectionMetadata",
)({ BaseEndpoint: S.String, ApiKey: S.String, Email: S.optional(S.String) }) {}
export class NoneConnectionMetadata extends S.Class<NoneConnectionMetadata>(
  "NoneConnectionMetadata",
)({ BaseEndpoint: S.String }) {}
export class IAMConnectionMetadata extends S.Class<IAMConnectionMetadata>(
  "IAMConnectionMetadata",
)({ RoleArn: S.String }) {}
export const AuthenticationMetadata = S.Union(
  S.Struct({ AuthorizationCodeGrantMetadata: AuthorizationCodeGrantMetadata }),
  S.Struct({ ClientCredentialsGrantMetadata: ClientCredentialsGrantMetadata }),
  S.Struct({ BasicAuthConnectionMetadata: BasicAuthConnectionMetadata }),
  S.Struct({ ApiKeyConnectionMetadata: APIKeyConnectionMetadata }),
  S.Struct({ NoneConnectionMetadata: NoneConnectionMetadata }),
  S.Struct({ IamConnectionMetadata: IAMConnectionMetadata }),
);
export class AuthConfig extends S.Class<AuthConfig>("AuthConfig")({
  AuthenticationType: S.String,
  AuthenticationMetadata: AuthenticationMetadata,
}) {}
export class UpdateActionConnectorRequest extends S.Class<UpdateActionConnectorRequest>(
  "UpdateActionConnectorRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String.pipe(T.HttpLabel("ActionConnectorId")),
    Name: S.String,
    AuthenticationConfig: AuthConfig,
    Description: S.optional(S.String),
    VpcConnectionArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/action-connectors/{ActionConnectorId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateActionConnectorPermissionsRequest extends S.Class<UpdateActionConnectorPermissionsRequest>(
  "UpdateActionConnectorPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String.pipe(T.HttpLabel("ActionConnectorId")),
    GrantPermissions: S.optional(ResourcePermissionList),
    RevokePermissions: S.optional(ResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/action-connectors/{ActionConnectorId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SensitiveStringList = S.Array(S.String);
export class StringParameter extends S.Class<StringParameter>(
  "StringParameter",
)({ Name: S.String, Values: SensitiveStringList }) {}
export const StringParameterList = S.Array(StringParameter);
export const SensitiveLongList = S.Array(S.Number);
export class IntegerParameter extends S.Class<IntegerParameter>(
  "IntegerParameter",
)({ Name: S.String, Values: SensitiveLongList }) {}
export const IntegerParameterList = S.Array(IntegerParameter);
export const SensitiveDoubleList = S.Array(S.Number);
export class DecimalParameter extends S.Class<DecimalParameter>(
  "DecimalParameter",
)({ Name: S.String, Values: SensitiveDoubleList }) {}
export const DecimalParameterList = S.Array(DecimalParameter);
export const SensitiveTimestampList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export class DateTimeParameter extends S.Class<DateTimeParameter>(
  "DateTimeParameter",
)({ Name: S.String, Values: SensitiveTimestampList }) {}
export const DateTimeParameterList = S.Array(DateTimeParameter);
export class Parameters extends S.Class<Parameters>("Parameters")({
  StringParameters: S.optional(StringParameterList),
  IntegerParameters: S.optional(IntegerParameterList),
  DecimalParameters: S.optional(DecimalParameterList),
  DateTimeParameters: S.optional(DateTimeParameterList),
}) {}
export class DataSetReference extends S.Class<DataSetReference>(
  "DataSetReference",
)({ DataSetPlaceholder: S.String, DataSetArn: S.String }) {}
export const DataSetReferenceList = S.Array(DataSetReference);
export class AnalysisSourceTemplate extends S.Class<AnalysisSourceTemplate>(
  "AnalysisSourceTemplate",
)({ DataSetReferences: DataSetReferenceList, Arn: S.String }) {}
export class AnalysisSourceEntity extends S.Class<AnalysisSourceEntity>(
  "AnalysisSourceEntity",
)({ SourceTemplate: S.optional(AnalysisSourceTemplate) }) {}
export class DataSetIdentifierDeclaration extends S.Class<DataSetIdentifierDeclaration>(
  "DataSetIdentifierDeclaration",
)({ Identifier: S.String, DataSetArn: S.String }) {}
export const DataSetIdentifierDeclarationList = S.Array(
  DataSetIdentifierDeclaration,
);
export class FontSize extends S.Class<FontSize>("FontSize")({
  Relative: S.optional(S.String),
  Absolute: S.optional(S.String),
}) {}
export class FontWeight extends S.Class<FontWeight>("FontWeight")({
  Name: S.optional(S.String),
}) {}
export class FontConfiguration extends S.Class<FontConfiguration>(
  "FontConfiguration",
)({
  FontSize: S.optional(FontSize),
  FontDecoration: S.optional(S.String),
  FontColor: S.optional(S.String),
  FontWeight: S.optional(FontWeight),
  FontStyle: S.optional(S.String),
  FontFamily: S.optional(S.String),
}) {}
export class LabelOptions extends S.Class<LabelOptions>("LabelOptions")({
  Visibility: S.optional(S.String),
  FontConfiguration: S.optional(FontConfiguration),
  CustomLabel: S.optional(S.String),
}) {}
export class SheetControlInfoIconLabelOptions extends S.Class<SheetControlInfoIconLabelOptions>(
  "SheetControlInfoIconLabelOptions",
)({ Visibility: S.optional(S.String), InfoIconText: S.optional(S.String) }) {}
export class DateTimePickerControlDisplayOptions extends S.Class<DateTimePickerControlDisplayOptions>(
  "DateTimePickerControlDisplayOptions",
)({
  TitleOptions: S.optional(LabelOptions),
  DateTimeFormat: S.optional(S.String),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
  HelperTextVisibility: S.optional(S.String),
  DateIconVisibility: S.optional(S.String),
}) {}
export class ParameterDateTimePickerControl extends S.Class<ParameterDateTimePickerControl>(
  "ParameterDateTimePickerControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  DisplayOptions: S.optional(DateTimePickerControlDisplayOptions),
}) {}
export class ListControlSearchOptions extends S.Class<ListControlSearchOptions>(
  "ListControlSearchOptions",
)({ Visibility: S.optional(S.String) }) {}
export class ListControlSelectAllOptions extends S.Class<ListControlSelectAllOptions>(
  "ListControlSelectAllOptions",
)({ Visibility: S.optional(S.String) }) {}
export class ListControlDisplayOptions extends S.Class<ListControlDisplayOptions>(
  "ListControlDisplayOptions",
)({
  SearchOptions: S.optional(ListControlSearchOptions),
  SelectAllOptions: S.optional(ListControlSelectAllOptions),
  TitleOptions: S.optional(LabelOptions),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export const ParameterSelectableValueList = S.Array(S.String);
export class ColumnIdentifier extends S.Class<ColumnIdentifier>(
  "ColumnIdentifier",
)({ DataSetIdentifier: S.String, ColumnName: S.String }) {}
export class ParameterSelectableValues extends S.Class<ParameterSelectableValues>(
  "ParameterSelectableValues",
)({
  Values: S.optional(ParameterSelectableValueList),
  LinkToDataSetColumn: S.optional(ColumnIdentifier),
}) {}
export class CascadingControlSource extends S.Class<CascadingControlSource>(
  "CascadingControlSource",
)({
  SourceSheetControlId: S.optional(S.String),
  ColumnToMatch: S.optional(ColumnIdentifier),
}) {}
export const CascadingControlSourceList = S.Array(CascadingControlSource);
export class CascadingControlConfiguration extends S.Class<CascadingControlConfiguration>(
  "CascadingControlConfiguration",
)({ SourceControls: S.optional(CascadingControlSourceList) }) {}
export class ParameterListControl extends S.Class<ParameterListControl>(
  "ParameterListControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  DisplayOptions: S.optional(ListControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(ParameterSelectableValues),
  CascadingControlConfiguration: S.optional(CascadingControlConfiguration),
}) {}
export class DropDownControlDisplayOptions extends S.Class<DropDownControlDisplayOptions>(
  "DropDownControlDisplayOptions",
)({
  SelectAllOptions: S.optional(ListControlSelectAllOptions),
  TitleOptions: S.optional(LabelOptions),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export class ParameterDropDownControl extends S.Class<ParameterDropDownControl>(
  "ParameterDropDownControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  DisplayOptions: S.optional(DropDownControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(ParameterSelectableValues),
  CascadingControlConfiguration: S.optional(CascadingControlConfiguration),
  CommitMode: S.optional(S.String),
}) {}
export class TextControlPlaceholderOptions extends S.Class<TextControlPlaceholderOptions>(
  "TextControlPlaceholderOptions",
)({ Visibility: S.optional(S.String) }) {}
export class TextFieldControlDisplayOptions extends S.Class<TextFieldControlDisplayOptions>(
  "TextFieldControlDisplayOptions",
)({
  TitleOptions: S.optional(LabelOptions),
  PlaceholderOptions: S.optional(TextControlPlaceholderOptions),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export class ParameterTextFieldControl extends S.Class<ParameterTextFieldControl>(
  "ParameterTextFieldControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  DisplayOptions: S.optional(TextFieldControlDisplayOptions),
}) {}
export class TextAreaControlDisplayOptions extends S.Class<TextAreaControlDisplayOptions>(
  "TextAreaControlDisplayOptions",
)({
  TitleOptions: S.optional(LabelOptions),
  PlaceholderOptions: S.optional(TextControlPlaceholderOptions),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export class ParameterTextAreaControl extends S.Class<ParameterTextAreaControl>(
  "ParameterTextAreaControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  Delimiter: S.optional(S.String),
  DisplayOptions: S.optional(TextAreaControlDisplayOptions),
}) {}
export class SliderControlDisplayOptions extends S.Class<SliderControlDisplayOptions>(
  "SliderControlDisplayOptions",
)({
  TitleOptions: S.optional(LabelOptions),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export class ParameterSliderControl extends S.Class<ParameterSliderControl>(
  "ParameterSliderControl",
)({
  ParameterControlId: S.String,
  Title: S.String,
  SourceParameterName: S.String,
  DisplayOptions: S.optional(SliderControlDisplayOptions),
  MaximumValue: S.Number,
  MinimumValue: S.Number,
  StepSize: S.Number,
}) {}
export class ParameterControl extends S.Class<ParameterControl>(
  "ParameterControl",
)({
  DateTimePicker: S.optional(ParameterDateTimePickerControl),
  List: S.optional(ParameterListControl),
  Dropdown: S.optional(ParameterDropDownControl),
  TextField: S.optional(ParameterTextFieldControl),
  TextArea: S.optional(ParameterTextAreaControl),
  Slider: S.optional(ParameterSliderControl),
}) {}
export const ParameterControlList = S.Array(ParameterControl);
export class FilterDateTimePickerControl extends S.Class<FilterDateTimePickerControl>(
  "FilterDateTimePickerControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(DateTimePickerControlDisplayOptions),
  Type: S.optional(S.String),
  CommitMode: S.optional(S.String),
}) {}
export class FilterSelectableValues extends S.Class<FilterSelectableValues>(
  "FilterSelectableValues",
)({ Values: S.optional(ParameterSelectableValueList) }) {}
export class FilterListControl extends S.Class<FilterListControl>(
  "FilterListControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(ListControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(FilterSelectableValues),
  CascadingControlConfiguration: S.optional(CascadingControlConfiguration),
}) {}
export class FilterDropDownControl extends S.Class<FilterDropDownControl>(
  "FilterDropDownControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(DropDownControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(FilterSelectableValues),
  CascadingControlConfiguration: S.optional(CascadingControlConfiguration),
  CommitMode: S.optional(S.String),
}) {}
export class FilterTextFieldControl extends S.Class<FilterTextFieldControl>(
  "FilterTextFieldControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(TextFieldControlDisplayOptions),
}) {}
export class FilterTextAreaControl extends S.Class<FilterTextAreaControl>(
  "FilterTextAreaControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  Delimiter: S.optional(S.String),
  DisplayOptions: S.optional(TextAreaControlDisplayOptions),
}) {}
export class FilterSliderControl extends S.Class<FilterSliderControl>(
  "FilterSliderControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(SliderControlDisplayOptions),
  Type: S.optional(S.String),
  MaximumValue: S.Number,
  MinimumValue: S.Number,
  StepSize: S.Number,
}) {}
export class RelativeDateTimeControlDisplayOptions extends S.Class<RelativeDateTimeControlDisplayOptions>(
  "RelativeDateTimeControlDisplayOptions",
)({
  TitleOptions: S.optional(LabelOptions),
  DateTimeFormat: S.optional(S.String),
  InfoIconLabelOptions: S.optional(SheetControlInfoIconLabelOptions),
}) {}
export class FilterRelativeDateTimeControl extends S.Class<FilterRelativeDateTimeControl>(
  "FilterRelativeDateTimeControl",
)({
  FilterControlId: S.String,
  Title: S.String,
  SourceFilterId: S.String,
  DisplayOptions: S.optional(RelativeDateTimeControlDisplayOptions),
  CommitMode: S.optional(S.String),
}) {}
export class FilterCrossSheetControl extends S.Class<FilterCrossSheetControl>(
  "FilterCrossSheetControl",
)({
  FilterControlId: S.String,
  SourceFilterId: S.String,
  CascadingControlConfiguration: S.optional(CascadingControlConfiguration),
}) {}
export class FilterControl extends S.Class<FilterControl>("FilterControl")({
  DateTimePicker: S.optional(FilterDateTimePickerControl),
  List: S.optional(FilterListControl),
  Dropdown: S.optional(FilterDropDownControl),
  TextField: S.optional(FilterTextFieldControl),
  TextArea: S.optional(FilterTextAreaControl),
  Slider: S.optional(FilterSliderControl),
  RelativeDateTime: S.optional(FilterRelativeDateTimeControl),
  CrossSheet: S.optional(FilterCrossSheetControl),
}) {}
export const FilterControlList = S.Array(FilterControl);
export class ShortFormatText extends S.Class<ShortFormatText>(
  "ShortFormatText",
)({ PlainText: S.optional(S.String), RichText: S.optional(S.String) }) {}
export class VisualTitleLabelOptions extends S.Class<VisualTitleLabelOptions>(
  "VisualTitleLabelOptions",
)({
  Visibility: S.optional(S.String),
  FormatText: S.optional(ShortFormatText),
}) {}
export class LongFormatText extends S.Class<LongFormatText>("LongFormatText")({
  PlainText: S.optional(S.String),
  RichText: S.optional(S.String),
}) {}
export class VisualSubtitleLabelOptions extends S.Class<VisualSubtitleLabelOptions>(
  "VisualSubtitleLabelOptions",
)({
  Visibility: S.optional(S.String),
  FormatText: S.optional(LongFormatText),
}) {}
export class ThousandSeparatorOptions extends S.Class<ThousandSeparatorOptions>(
  "ThousandSeparatorOptions",
)({
  Symbol: S.optional(S.String),
  Visibility: S.optional(S.String),
  GroupingStyle: S.optional(S.String),
}) {}
export class NumericSeparatorConfiguration extends S.Class<NumericSeparatorConfiguration>(
  "NumericSeparatorConfiguration",
)({
  DecimalSeparator: S.optional(S.String),
  ThousandsSeparator: S.optional(ThousandSeparatorOptions),
}) {}
export class DecimalPlacesConfiguration extends S.Class<DecimalPlacesConfiguration>(
  "DecimalPlacesConfiguration",
)({ DecimalPlaces: S.Number }) {}
export class NegativeValueConfiguration extends S.Class<NegativeValueConfiguration>(
  "NegativeValueConfiguration",
)({ DisplayMode: S.String }) {}
export class NullValueFormatConfiguration extends S.Class<NullValueFormatConfiguration>(
  "NullValueFormatConfiguration",
)({ NullString: S.String }) {}
export class NumberDisplayFormatConfiguration extends S.Class<NumberDisplayFormatConfiguration>(
  "NumberDisplayFormatConfiguration",
)({
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
  SeparatorConfiguration: S.optional(NumericSeparatorConfiguration),
  DecimalPlacesConfiguration: S.optional(DecimalPlacesConfiguration),
  NumberScale: S.optional(S.String),
  NegativeValueConfiguration: S.optional(NegativeValueConfiguration),
  NullValueFormatConfiguration: S.optional(NullValueFormatConfiguration),
}) {}
export class CurrencyDisplayFormatConfiguration extends S.Class<CurrencyDisplayFormatConfiguration>(
  "CurrencyDisplayFormatConfiguration",
)({
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
  SeparatorConfiguration: S.optional(NumericSeparatorConfiguration),
  Symbol: S.optional(S.String),
  DecimalPlacesConfiguration: S.optional(DecimalPlacesConfiguration),
  NumberScale: S.optional(S.String),
  NegativeValueConfiguration: S.optional(NegativeValueConfiguration),
  NullValueFormatConfiguration: S.optional(NullValueFormatConfiguration),
}) {}
export class PercentageDisplayFormatConfiguration extends S.Class<PercentageDisplayFormatConfiguration>(
  "PercentageDisplayFormatConfiguration",
)({
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
  SeparatorConfiguration: S.optional(NumericSeparatorConfiguration),
  DecimalPlacesConfiguration: S.optional(DecimalPlacesConfiguration),
  NegativeValueConfiguration: S.optional(NegativeValueConfiguration),
  NullValueFormatConfiguration: S.optional(NullValueFormatConfiguration),
}) {}
export class NumericFormatConfiguration extends S.Class<NumericFormatConfiguration>(
  "NumericFormatConfiguration",
)({
  NumberDisplayFormatConfiguration: S.optional(
    NumberDisplayFormatConfiguration,
  ),
  CurrencyDisplayFormatConfiguration: S.optional(
    CurrencyDisplayFormatConfiguration,
  ),
  PercentageDisplayFormatConfiguration: S.optional(
    PercentageDisplayFormatConfiguration,
  ),
}) {}
export class NumberFormatConfiguration extends S.Class<NumberFormatConfiguration>(
  "NumberFormatConfiguration",
)({ FormatConfiguration: S.optional(NumericFormatConfiguration) }) {}
export class NumericalDimensionField extends S.Class<NumericalDimensionField>(
  "NumericalDimensionField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  HierarchyId: S.optional(S.String),
  FormatConfiguration: S.optional(NumberFormatConfiguration),
}) {}
export class StringFormatConfiguration extends S.Class<StringFormatConfiguration>(
  "StringFormatConfiguration",
)({
  NullValueFormatConfiguration: S.optional(NullValueFormatConfiguration),
  NumericFormatConfiguration: S.optional(NumericFormatConfiguration),
}) {}
export class CategoricalDimensionField extends S.Class<CategoricalDimensionField>(
  "CategoricalDimensionField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  HierarchyId: S.optional(S.String),
  FormatConfiguration: S.optional(StringFormatConfiguration),
}) {}
export class DateTimeFormatConfiguration extends S.Class<DateTimeFormatConfiguration>(
  "DateTimeFormatConfiguration",
)({
  DateTimeFormat: S.optional(S.String),
  NullValueFormatConfiguration: S.optional(NullValueFormatConfiguration),
  NumericFormatConfiguration: S.optional(NumericFormatConfiguration),
}) {}
export class DateDimensionField extends S.Class<DateDimensionField>(
  "DateDimensionField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  DateGranularity: S.optional(S.String),
  HierarchyId: S.optional(S.String),
  FormatConfiguration: S.optional(DateTimeFormatConfiguration),
}) {}
export class DimensionField extends S.Class<DimensionField>("DimensionField")({
  NumericalDimensionField: S.optional(NumericalDimensionField),
  CategoricalDimensionField: S.optional(CategoricalDimensionField),
  DateDimensionField: S.optional(DateDimensionField),
}) {}
export const DimensionFieldList = S.Array(DimensionField);
export class PercentileAggregation extends S.Class<PercentileAggregation>(
  "PercentileAggregation",
)({ PercentileValue: S.optional(S.Number) }) {}
export class NumericalAggregationFunction extends S.Class<NumericalAggregationFunction>(
  "NumericalAggregationFunction",
)({
  SimpleNumericalAggregation: S.optional(S.String),
  PercentileAggregation: S.optional(PercentileAggregation),
}) {}
export class NumericalMeasureField extends S.Class<NumericalMeasureField>(
  "NumericalMeasureField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  AggregationFunction: S.optional(NumericalAggregationFunction),
  FormatConfiguration: S.optional(NumberFormatConfiguration),
}) {}
export class CategoricalMeasureField extends S.Class<CategoricalMeasureField>(
  "CategoricalMeasureField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  AggregationFunction: S.optional(S.String),
  FormatConfiguration: S.optional(StringFormatConfiguration),
}) {}
export class DateMeasureField extends S.Class<DateMeasureField>(
  "DateMeasureField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  AggregationFunction: S.optional(S.String),
  FormatConfiguration: S.optional(DateTimeFormatConfiguration),
}) {}
export class CalculatedMeasureField extends S.Class<CalculatedMeasureField>(
  "CalculatedMeasureField",
)({ FieldId: S.String, Expression: S.String }) {}
export class MeasureField extends S.Class<MeasureField>("MeasureField")({
  NumericalMeasureField: S.optional(NumericalMeasureField),
  CategoricalMeasureField: S.optional(CategoricalMeasureField),
  DateMeasureField: S.optional(DateMeasureField),
  CalculatedMeasureField: S.optional(CalculatedMeasureField),
}) {}
export const MeasureFieldList = S.Array(MeasureField);
export class TableAggregatedFieldWells extends S.Class<TableAggregatedFieldWells>(
  "TableAggregatedFieldWells",
)({
  GroupBy: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
}) {}
export class FormatConfiguration extends S.Class<FormatConfiguration>(
  "FormatConfiguration",
)({
  StringFormatConfiguration: S.optional(StringFormatConfiguration),
  NumberFormatConfiguration: S.optional(NumberFormatConfiguration),
  DateTimeFormatConfiguration: S.optional(DateTimeFormatConfiguration),
}) {}
export class UnaggregatedField extends S.Class<UnaggregatedField>(
  "UnaggregatedField",
)({
  FieldId: S.String,
  Column: ColumnIdentifier,
  FormatConfiguration: S.optional(FormatConfiguration),
}) {}
export const TableUnaggregatedFieldList = S.Array(UnaggregatedField);
export class TableUnaggregatedFieldWells extends S.Class<TableUnaggregatedFieldWells>(
  "TableUnaggregatedFieldWells",
)({ Values: S.optional(TableUnaggregatedFieldList) }) {}
export class TableFieldWells extends S.Class<TableFieldWells>(
  "TableFieldWells",
)({
  TableAggregatedFieldWells: S.optional(TableAggregatedFieldWells),
  TableUnaggregatedFieldWells: S.optional(TableUnaggregatedFieldWells),
}) {}
export class FieldSort extends S.Class<FieldSort>("FieldSort")({
  FieldId: S.String,
  Direction: S.String,
}) {}
export class AttributeAggregationFunction extends S.Class<AttributeAggregationFunction>(
  "AttributeAggregationFunction",
)({
  SimpleAttributeAggregation: S.optional(S.String),
  ValueForMultipleValues: S.optional(S.String),
}) {}
export class AggregationFunction extends S.Class<AggregationFunction>(
  "AggregationFunction",
)({
  NumericalAggregationFunction: S.optional(NumericalAggregationFunction),
  CategoricalAggregationFunction: S.optional(S.String),
  DateAggregationFunction: S.optional(S.String),
  AttributeAggregationFunction: S.optional(AttributeAggregationFunction),
}) {}
export class ColumnSort extends S.Class<ColumnSort>("ColumnSort")({
  SortBy: ColumnIdentifier,
  Direction: S.String,
  AggregationFunction: S.optional(AggregationFunction),
}) {}
export class FieldSortOptions extends S.Class<FieldSortOptions>(
  "FieldSortOptions",
)({ FieldSort: S.optional(FieldSort), ColumnSort: S.optional(ColumnSort) }) {}
export const RowSortList = S.Array(FieldSortOptions);
export class PaginationConfiguration extends S.Class<PaginationConfiguration>(
  "PaginationConfiguration",
)({ PageSize: S.Number, PageNumber: S.Number }) {}
export class TableSortConfiguration extends S.Class<TableSortConfiguration>(
  "TableSortConfiguration",
)({
  RowSort: S.optional(RowSortList),
  PaginationConfiguration: S.optional(PaginationConfiguration),
}) {}
export class TableBorderOptions extends S.Class<TableBorderOptions>(
  "TableBorderOptions",
)({
  Color: S.optional(S.String),
  Thickness: S.optional(S.Number),
  Style: S.optional(S.String),
}) {}
export class TableSideBorderOptions extends S.Class<TableSideBorderOptions>(
  "TableSideBorderOptions",
)({
  InnerVertical: S.optional(TableBorderOptions),
  InnerHorizontal: S.optional(TableBorderOptions),
  Left: S.optional(TableBorderOptions),
  Right: S.optional(TableBorderOptions),
  Top: S.optional(TableBorderOptions),
  Bottom: S.optional(TableBorderOptions),
}) {}
export class GlobalTableBorderOptions extends S.Class<GlobalTableBorderOptions>(
  "GlobalTableBorderOptions",
)({
  UniformBorder: S.optional(TableBorderOptions),
  SideSpecificBorder: S.optional(TableSideBorderOptions),
}) {}
export class TableCellStyle extends S.Class<TableCellStyle>("TableCellStyle")({
  Visibility: S.optional(S.String),
  FontConfiguration: S.optional(FontConfiguration),
  TextWrap: S.optional(S.String),
  HorizontalTextAlignment: S.optional(S.String),
  VerticalTextAlignment: S.optional(S.String),
  BackgroundColor: S.optional(S.String),
  Height: S.optional(S.Number),
  Border: S.optional(GlobalTableBorderOptions),
}) {}
export const RowAlternateColorList = S.Array(S.String);
export class RowAlternateColorOptions extends S.Class<RowAlternateColorOptions>(
  "RowAlternateColorOptions",
)({
  Status: S.optional(S.String),
  RowAlternateColors: S.optional(RowAlternateColorList),
  UsePrimaryBackgroundColor: S.optional(S.String),
}) {}
export class TableOptions extends S.Class<TableOptions>("TableOptions")({
  Orientation: S.optional(S.String),
  HeaderStyle: S.optional(TableCellStyle),
  CellStyle: S.optional(TableCellStyle),
  RowAlternateColorOptions: S.optional(RowAlternateColorOptions),
}) {}
export class TotalAggregationFunction extends S.Class<TotalAggregationFunction>(
  "TotalAggregationFunction",
)({ SimpleTotalAggregationFunction: S.optional(S.String) }) {}
export class TotalAggregationOption extends S.Class<TotalAggregationOption>(
  "TotalAggregationOption",
)({ FieldId: S.String, TotalAggregationFunction: TotalAggregationFunction }) {}
export const TotalAggregationOptionList = S.Array(TotalAggregationOption);
export class TotalOptions extends S.Class<TotalOptions>("TotalOptions")({
  TotalsVisibility: S.optional(S.String),
  Placement: S.optional(S.String),
  ScrollStatus: S.optional(S.String),
  CustomLabel: S.optional(S.String),
  TotalCellStyle: S.optional(TableCellStyle),
  TotalAggregationOptions: S.optional(TotalAggregationOptionList),
}) {}
export class TableFieldCustomTextContent extends S.Class<TableFieldCustomTextContent>(
  "TableFieldCustomTextContent",
)({ Value: S.optional(S.String), FontConfiguration: FontConfiguration }) {}
export class TableFieldCustomIconContent extends S.Class<TableFieldCustomIconContent>(
  "TableFieldCustomIconContent",
)({ Icon: S.optional(S.String) }) {}
export class TableFieldLinkContentConfiguration extends S.Class<TableFieldLinkContentConfiguration>(
  "TableFieldLinkContentConfiguration",
)({
  CustomTextContent: S.optional(TableFieldCustomTextContent),
  CustomIconContent: S.optional(TableFieldCustomIconContent),
}) {}
export class TableFieldLinkConfiguration extends S.Class<TableFieldLinkConfiguration>(
  "TableFieldLinkConfiguration",
)({ Target: S.String, Content: TableFieldLinkContentConfiguration }) {}
export class TableCellImageSizingConfiguration extends S.Class<TableCellImageSizingConfiguration>(
  "TableCellImageSizingConfiguration",
)({ TableCellImageScalingConfiguration: S.optional(S.String) }) {}
export class TableFieldImageConfiguration extends S.Class<TableFieldImageConfiguration>(
  "TableFieldImageConfiguration",
)({ SizingOptions: S.optional(TableCellImageSizingConfiguration) }) {}
export class TableFieldURLConfiguration extends S.Class<TableFieldURLConfiguration>(
  "TableFieldURLConfiguration",
)({
  LinkConfiguration: S.optional(TableFieldLinkConfiguration),
  ImageConfiguration: S.optional(TableFieldImageConfiguration),
}) {}
export class TableFieldOption extends S.Class<TableFieldOption>(
  "TableFieldOption",
)({
  FieldId: S.String,
  Width: S.optional(S.String),
  CustomLabel: S.optional(S.String),
  Visibility: S.optional(S.String),
  URLStyling: S.optional(TableFieldURLConfiguration),
}) {}
export const TableFieldOptionList = S.Array(TableFieldOption);
export const FieldOrderList = S.Array(S.String);
export const TableFieldOrderList = S.Array(S.String);
export class TablePinnedFieldOptions extends S.Class<TablePinnedFieldOptions>(
  "TablePinnedFieldOptions",
)({ PinnedLeftFields: S.optional(TableFieldOrderList) }) {}
export class TransposedTableOption extends S.Class<TransposedTableOption>(
  "TransposedTableOption",
)({
  ColumnIndex: S.optional(S.Number),
  ColumnWidth: S.optional(S.String),
  ColumnType: S.String,
}) {}
export const TransposedTableOptionList = S.Array(TransposedTableOption);
export class TableFieldOptions extends S.Class<TableFieldOptions>(
  "TableFieldOptions",
)({
  SelectedFieldOptions: S.optional(TableFieldOptionList),
  Order: S.optional(FieldOrderList),
  PinnedFieldOptions: S.optional(TablePinnedFieldOptions),
  TransposedTableOptions: S.optional(TransposedTableOptionList),
}) {}
export class TablePaginatedReportOptions extends S.Class<TablePaginatedReportOptions>(
  "TablePaginatedReportOptions",
)({
  VerticalOverflowVisibility: S.optional(S.String),
  OverflowColumnHeaderVisibility: S.optional(S.String),
}) {}
export class DataBarsOptions extends S.Class<DataBarsOptions>(
  "DataBarsOptions",
)({
  FieldId: S.String,
  PositiveColor: S.optional(S.String),
  NegativeColor: S.optional(S.String),
}) {}
export class TableInlineVisualization extends S.Class<TableInlineVisualization>(
  "TableInlineVisualization",
)({ DataBars: S.optional(DataBarsOptions) }) {}
export const TableInlineVisualizationList = S.Array(TableInlineVisualization);
export const VisualCustomizationAdditionalFieldsList =
  S.Array(ColumnIdentifier);
export class VisualCustomizationFieldsConfiguration extends S.Class<VisualCustomizationFieldsConfiguration>(
  "VisualCustomizationFieldsConfiguration",
)({
  Status: S.optional(S.String),
  AdditionalFields: S.optional(VisualCustomizationAdditionalFieldsList),
}) {}
export class DashboardCustomizationVisualOptions extends S.Class<DashboardCustomizationVisualOptions>(
  "DashboardCustomizationVisualOptions",
)({
  FieldsConfiguration: S.optional(VisualCustomizationFieldsConfiguration),
}) {}
export class VisualMenuOption extends S.Class<VisualMenuOption>(
  "VisualMenuOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class ContextMenuOption extends S.Class<ContextMenuOption>(
  "ContextMenuOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class VisualInteractionOptions extends S.Class<VisualInteractionOptions>(
  "VisualInteractionOptions",
)({
  VisualMenuOption: S.optional(VisualMenuOption),
  ContextMenuOption: S.optional(ContextMenuOption),
}) {}
export class TableConfiguration extends S.Class<TableConfiguration>(
  "TableConfiguration",
)({
  FieldWells: S.optional(TableFieldWells),
  SortConfiguration: S.optional(TableSortConfiguration),
  TableOptions: S.optional(TableOptions),
  TotalOptions: S.optional(TotalOptions),
  FieldOptions: S.optional(TableFieldOptions),
  PaginatedReportOptions: S.optional(TablePaginatedReportOptions),
  TableInlineVisualizations: S.optional(TableInlineVisualizationList),
  DashboardCustomizationVisualOptions: S.optional(
    DashboardCustomizationVisualOptions,
  ),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class ConditionalFormattingSolidColor extends S.Class<ConditionalFormattingSolidColor>(
  "ConditionalFormattingSolidColor",
)({ Expression: S.String, Color: S.optional(S.String) }) {}
export class GradientStop extends S.Class<GradientStop>("GradientStop")({
  GradientOffset: S.Number,
  DataValue: S.optional(S.Number),
  Color: S.optional(S.String),
}) {}
export const GradientStopList = S.Array(GradientStop);
export class GradientColor extends S.Class<GradientColor>("GradientColor")({
  Stops: S.optional(GradientStopList),
}) {}
export class ConditionalFormattingGradientColor extends S.Class<ConditionalFormattingGradientColor>(
  "ConditionalFormattingGradientColor",
)({ Expression: S.String, Color: GradientColor }) {}
export class ConditionalFormattingColor extends S.Class<ConditionalFormattingColor>(
  "ConditionalFormattingColor",
)({
  Solid: S.optional(ConditionalFormattingSolidColor),
  Gradient: S.optional(ConditionalFormattingGradientColor),
}) {}
export class ConditionalFormattingIconSet extends S.Class<ConditionalFormattingIconSet>(
  "ConditionalFormattingIconSet",
)({ Expression: S.String, IconSetType: S.optional(S.String) }) {}
export class ConditionalFormattingCustomIconOptions extends S.Class<ConditionalFormattingCustomIconOptions>(
  "ConditionalFormattingCustomIconOptions",
)({ Icon: S.optional(S.String), UnicodeIcon: S.optional(S.String) }) {}
export class ConditionalFormattingIconDisplayConfiguration extends S.Class<ConditionalFormattingIconDisplayConfiguration>(
  "ConditionalFormattingIconDisplayConfiguration",
)({ IconDisplayOption: S.optional(S.String) }) {}
export class ConditionalFormattingCustomIconCondition extends S.Class<ConditionalFormattingCustomIconCondition>(
  "ConditionalFormattingCustomIconCondition",
)({
  Expression: S.String,
  IconOptions: ConditionalFormattingCustomIconOptions,
  Color: S.optional(S.String),
  DisplayConfiguration: S.optional(
    ConditionalFormattingIconDisplayConfiguration,
  ),
}) {}
export class ConditionalFormattingIcon extends S.Class<ConditionalFormattingIcon>(
  "ConditionalFormattingIcon",
)({
  IconSet: S.optional(ConditionalFormattingIconSet),
  CustomCondition: S.optional(ConditionalFormattingCustomIconCondition),
}) {}
export class TextConditionalFormat extends S.Class<TextConditionalFormat>(
  "TextConditionalFormat",
)({
  BackgroundColor: S.optional(ConditionalFormattingColor),
  TextColor: S.optional(ConditionalFormattingColor),
  Icon: S.optional(ConditionalFormattingIcon),
}) {}
export class TableCellConditionalFormatting extends S.Class<TableCellConditionalFormatting>(
  "TableCellConditionalFormatting",
)({ FieldId: S.String, TextFormat: S.optional(TextConditionalFormat) }) {}
export class TableRowConditionalFormatting extends S.Class<TableRowConditionalFormatting>(
  "TableRowConditionalFormatting",
)({
  BackgroundColor: S.optional(ConditionalFormattingColor),
  TextColor: S.optional(ConditionalFormattingColor),
}) {}
export class TableConditionalFormattingOption extends S.Class<TableConditionalFormattingOption>(
  "TableConditionalFormattingOption",
)({
  Cell: S.optional(TableCellConditionalFormatting),
  Row: S.optional(TableRowConditionalFormatting),
}) {}
export const TableConditionalFormattingOptionList = S.Array(
  TableConditionalFormattingOption,
);
export class TableConditionalFormatting extends S.Class<TableConditionalFormatting>(
  "TableConditionalFormatting",
)({
  ConditionalFormattingOptions: S.optional(
    TableConditionalFormattingOptionList,
  ),
}) {}
export const SelectedFieldList = S.Array(S.String);
export const CustomActionColumnList = S.Array(ColumnIdentifier);
export class FilterOperationSelectedFieldsConfiguration extends S.Class<FilterOperationSelectedFieldsConfiguration>(
  "FilterOperationSelectedFieldsConfiguration",
)({
  SelectedFields: S.optional(SelectedFieldList),
  SelectedFieldOptions: S.optional(S.String),
  SelectedColumns: S.optional(CustomActionColumnList),
}) {}
export const TargetVisualList = S.Array(S.String);
export class SameSheetTargetVisualConfiguration extends S.Class<SameSheetTargetVisualConfiguration>(
  "SameSheetTargetVisualConfiguration",
)({
  TargetVisuals: S.optional(TargetVisualList),
  TargetVisualOptions: S.optional(S.String),
}) {}
export class FilterOperationTargetVisualsConfiguration extends S.Class<FilterOperationTargetVisualsConfiguration>(
  "FilterOperationTargetVisualsConfiguration",
)({
  SameSheetTargetVisualConfiguration: S.optional(
    SameSheetTargetVisualConfiguration,
  ),
}) {}
export class CustomActionFilterOperation extends S.Class<CustomActionFilterOperation>(
  "CustomActionFilterOperation",
)({
  SelectedFieldsConfiguration: FilterOperationSelectedFieldsConfiguration,
  TargetVisualsConfiguration: FilterOperationTargetVisualsConfiguration,
}) {}
export class LocalNavigationConfiguration extends S.Class<LocalNavigationConfiguration>(
  "LocalNavigationConfiguration",
)({ TargetSheetId: S.String }) {}
export class CustomActionNavigationOperation extends S.Class<CustomActionNavigationOperation>(
  "CustomActionNavigationOperation",
)({ LocalNavigationConfiguration: S.optional(LocalNavigationConfiguration) }) {}
export class CustomActionURLOperation extends S.Class<CustomActionURLOperation>(
  "CustomActionURLOperation",
)({ URLTemplate: S.String, URLTarget: S.String }) {}
export const StringDefaultValueList = S.Array(S.String);
export const IntegerDefaultValueList = S.Array(S.Number);
export const DecimalDefaultValueList = S.Array(S.Number);
export const DateTimeDefaultValueList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export class CustomParameterValues extends S.Class<CustomParameterValues>(
  "CustomParameterValues",
)({
  StringValues: S.optional(StringDefaultValueList),
  IntegerValues: S.optional(IntegerDefaultValueList),
  DecimalValues: S.optional(DecimalDefaultValueList),
  DateTimeValues: S.optional(DateTimeDefaultValueList),
}) {}
export class CustomValuesConfiguration extends S.Class<CustomValuesConfiguration>(
  "CustomValuesConfiguration",
)({
  IncludeNullValue: S.optional(S.Boolean),
  CustomValues: CustomParameterValues,
}) {}
export class DestinationParameterValueConfiguration extends S.Class<DestinationParameterValueConfiguration>(
  "DestinationParameterValueConfiguration",
)({
  CustomValuesConfiguration: S.optional(CustomValuesConfiguration),
  SelectAllValueOptions: S.optional(S.String),
  SourceParameterName: S.optional(S.String),
  SourceField: S.optional(S.String),
  SourceColumn: S.optional(ColumnIdentifier),
}) {}
export class SetParameterValueConfiguration extends S.Class<SetParameterValueConfiguration>(
  "SetParameterValueConfiguration",
)({
  DestinationParameterName: S.String,
  Value: DestinationParameterValueConfiguration,
}) {}
export const SetParameterValueConfigurationList = S.Array(
  SetParameterValueConfiguration,
);
export class CustomActionSetParametersOperation extends S.Class<CustomActionSetParametersOperation>(
  "CustomActionSetParametersOperation",
)({ ParameterValueConfigurations: SetParameterValueConfigurationList }) {}
export class VisualCustomActionOperation extends S.Class<VisualCustomActionOperation>(
  "VisualCustomActionOperation",
)({
  FilterOperation: S.optional(CustomActionFilterOperation),
  NavigationOperation: S.optional(CustomActionNavigationOperation),
  URLOperation: S.optional(CustomActionURLOperation),
  SetParametersOperation: S.optional(CustomActionSetParametersOperation),
}) {}
export const VisualCustomActionOperationList = S.Array(
  VisualCustomActionOperation,
);
export class VisualCustomAction extends S.Class<VisualCustomAction>(
  "VisualCustomAction",
)({
  CustomActionId: S.String,
  Name: S.String,
  Status: S.optional(S.String),
  Trigger: S.String,
  ActionOperations: VisualCustomActionOperationList,
}) {}
export const VisualCustomActionList = S.Array(VisualCustomAction);
export class TableVisual extends S.Class<TableVisual>("TableVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(TableConfiguration),
  ConditionalFormatting: S.optional(TableConditionalFormatting),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const PivotTableDimensionList = S.Array(DimensionField);
export const PivotMeasureFieldList = S.Array(MeasureField);
export class PivotTableAggregatedFieldWells extends S.Class<PivotTableAggregatedFieldWells>(
  "PivotTableAggregatedFieldWells",
)({
  Rows: S.optional(PivotTableDimensionList),
  Columns: S.optional(PivotTableDimensionList),
  Values: S.optional(PivotMeasureFieldList),
}) {}
export class PivotTableFieldWells extends S.Class<PivotTableFieldWells>(
  "PivotTableFieldWells",
)({
  PivotTableAggregatedFieldWells: S.optional(PivotTableAggregatedFieldWells),
}) {}
export class DataPathType extends S.Class<DataPathType>("DataPathType")({
  PivotTableDataPathType: S.optional(S.String),
}) {}
export class DataPathValue extends S.Class<DataPathValue>("DataPathValue")({
  FieldId: S.optional(S.String),
  FieldValue: S.optional(S.String),
  DataPathType: S.optional(DataPathType),
}) {}
export const DataPathValueList = S.Array(DataPathValue);
export class DataPathSort extends S.Class<DataPathSort>("DataPathSort")({
  Direction: S.String,
  SortPaths: DataPathValueList,
}) {}
export class PivotTableSortBy extends S.Class<PivotTableSortBy>(
  "PivotTableSortBy",
)({
  Field: S.optional(FieldSort),
  Column: S.optional(ColumnSort),
  DataPath: S.optional(DataPathSort),
}) {}
export class PivotFieldSortOptions extends S.Class<PivotFieldSortOptions>(
  "PivotFieldSortOptions",
)({ FieldId: S.String, SortBy: PivotTableSortBy }) {}
export const PivotFieldSortOptionsList = S.Array(PivotFieldSortOptions);
export class PivotTableSortConfiguration extends S.Class<PivotTableSortConfiguration>(
  "PivotTableSortConfiguration",
)({ FieldSortOptions: S.optional(PivotFieldSortOptionsList) }) {}
export class PivotTableRowsLabelOptions extends S.Class<PivotTableRowsLabelOptions>(
  "PivotTableRowsLabelOptions",
)({ Visibility: S.optional(S.String), CustomLabel: S.optional(S.String) }) {}
export class PivotTableOptions extends S.Class<PivotTableOptions>(
  "PivotTableOptions",
)({
  MetricPlacement: S.optional(S.String),
  SingleMetricVisibility: S.optional(S.String),
  ColumnNamesVisibility: S.optional(S.String),
  ToggleButtonsVisibility: S.optional(S.String),
  ColumnHeaderStyle: S.optional(TableCellStyle),
  RowHeaderStyle: S.optional(TableCellStyle),
  CellStyle: S.optional(TableCellStyle),
  RowFieldNamesStyle: S.optional(TableCellStyle),
  RowAlternateColorOptions: S.optional(RowAlternateColorOptions),
  CollapsedRowDimensionsVisibility: S.optional(S.String),
  RowsLayout: S.optional(S.String),
  RowsLabelOptions: S.optional(PivotTableRowsLabelOptions),
  DefaultCellWidth: S.optional(S.String),
}) {}
export class PivotTableFieldSubtotalOptions extends S.Class<PivotTableFieldSubtotalOptions>(
  "PivotTableFieldSubtotalOptions",
)({ FieldId: S.optional(S.String) }) {}
export const PivotTableFieldSubtotalOptionsList = S.Array(
  PivotTableFieldSubtotalOptions,
);
export class TableStyleTarget extends S.Class<TableStyleTarget>(
  "TableStyleTarget",
)({ CellType: S.String }) {}
export const TableStyleTargetList = S.Array(TableStyleTarget);
export class SubtotalOptions extends S.Class<SubtotalOptions>(
  "SubtotalOptions",
)({
  TotalsVisibility: S.optional(S.String),
  CustomLabel: S.optional(S.String),
  FieldLevel: S.optional(S.String),
  FieldLevelOptions: S.optional(PivotTableFieldSubtotalOptionsList),
  TotalCellStyle: S.optional(TableCellStyle),
  ValueCellStyle: S.optional(TableCellStyle),
  MetricHeaderCellStyle: S.optional(TableCellStyle),
  StyleTargets: S.optional(TableStyleTargetList),
}) {}
export class PivotTotalOptions extends S.Class<PivotTotalOptions>(
  "PivotTotalOptions",
)({
  TotalsVisibility: S.optional(S.String),
  Placement: S.optional(S.String),
  ScrollStatus: S.optional(S.String),
  CustomLabel: S.optional(S.String),
  TotalCellStyle: S.optional(TableCellStyle),
  ValueCellStyle: S.optional(TableCellStyle),
  MetricHeaderCellStyle: S.optional(TableCellStyle),
  TotalAggregationOptions: S.optional(TotalAggregationOptionList),
}) {}
export class PivotTableTotalOptions extends S.Class<PivotTableTotalOptions>(
  "PivotTableTotalOptions",
)({
  RowSubtotalOptions: S.optional(SubtotalOptions),
  ColumnSubtotalOptions: S.optional(SubtotalOptions),
  RowTotalOptions: S.optional(PivotTotalOptions),
  ColumnTotalOptions: S.optional(PivotTotalOptions),
}) {}
export class PivotTableFieldOption extends S.Class<PivotTableFieldOption>(
  "PivotTableFieldOption",
)({
  FieldId: S.String,
  CustomLabel: S.optional(S.String),
  Visibility: S.optional(S.String),
}) {}
export const PivotTableFieldOptionList = S.Array(PivotTableFieldOption);
export class PivotTableDataPathOption extends S.Class<PivotTableDataPathOption>(
  "PivotTableDataPathOption",
)({ DataPathList: DataPathValueList, Width: S.optional(S.String) }) {}
export const PivotTableDataPathOptionList = S.Array(PivotTableDataPathOption);
export class PivotTableFieldCollapseStateTarget extends S.Class<PivotTableFieldCollapseStateTarget>(
  "PivotTableFieldCollapseStateTarget",
)({
  FieldId: S.optional(S.String),
  FieldDataPathValues: S.optional(DataPathValueList),
}) {}
export class PivotTableFieldCollapseStateOption extends S.Class<PivotTableFieldCollapseStateOption>(
  "PivotTableFieldCollapseStateOption",
)({
  Target: PivotTableFieldCollapseStateTarget,
  State: S.optional(S.String),
}) {}
export const PivotTableFieldCollapseStateOptionList = S.Array(
  PivotTableFieldCollapseStateOption,
);
export class PivotTableFieldOptions extends S.Class<PivotTableFieldOptions>(
  "PivotTableFieldOptions",
)({
  SelectedFieldOptions: S.optional(PivotTableFieldOptionList),
  DataPathOptions: S.optional(PivotTableDataPathOptionList),
  CollapseStateOptions: S.optional(PivotTableFieldCollapseStateOptionList),
}) {}
export class PivotTablePaginatedReportOptions extends S.Class<PivotTablePaginatedReportOptions>(
  "PivotTablePaginatedReportOptions",
)({
  VerticalOverflowVisibility: S.optional(S.String),
  OverflowColumnHeaderVisibility: S.optional(S.String),
}) {}
export class PivotTableConfiguration extends S.Class<PivotTableConfiguration>(
  "PivotTableConfiguration",
)({
  FieldWells: S.optional(PivotTableFieldWells),
  SortConfiguration: S.optional(PivotTableSortConfiguration),
  TableOptions: S.optional(PivotTableOptions),
  TotalOptions: S.optional(PivotTableTotalOptions),
  FieldOptions: S.optional(PivotTableFieldOptions),
  PaginatedReportOptions: S.optional(PivotTablePaginatedReportOptions),
  DashboardCustomizationVisualOptions: S.optional(
    DashboardCustomizationVisualOptions,
  ),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class PivotTableConditionalFormattingScope extends S.Class<PivotTableConditionalFormattingScope>(
  "PivotTableConditionalFormattingScope",
)({ Role: S.optional(S.String) }) {}
export const PivotTableConditionalFormattingScopeList = S.Array(
  PivotTableConditionalFormattingScope,
);
export class PivotTableCellConditionalFormatting extends S.Class<PivotTableCellConditionalFormatting>(
  "PivotTableCellConditionalFormatting",
)({
  FieldId: S.String,
  TextFormat: S.optional(TextConditionalFormat),
  Scope: S.optional(PivotTableConditionalFormattingScope),
  Scopes: S.optional(PivotTableConditionalFormattingScopeList),
}) {}
export class PivotTableConditionalFormattingOption extends S.Class<PivotTableConditionalFormattingOption>(
  "PivotTableConditionalFormattingOption",
)({ Cell: S.optional(PivotTableCellConditionalFormatting) }) {}
export const PivotTableConditionalFormattingOptionList = S.Array(
  PivotTableConditionalFormattingOption,
);
export class PivotTableConditionalFormatting extends S.Class<PivotTableConditionalFormatting>(
  "PivotTableConditionalFormatting",
)({
  ConditionalFormattingOptions: S.optional(
    PivotTableConditionalFormattingOptionList,
  ),
}) {}
export class PivotTableVisual extends S.Class<PivotTableVisual>(
  "PivotTableVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(PivotTableConfiguration),
  ConditionalFormatting: S.optional(PivotTableConditionalFormatting),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const SmallMultiplesDimensionFieldList = S.Array(DimensionField);
export class BarChartAggregatedFieldWells extends S.Class<BarChartAggregatedFieldWells>(
  "BarChartAggregatedFieldWells",
)({
  Category: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
  Colors: S.optional(DimensionFieldList),
  SmallMultiples: S.optional(SmallMultiplesDimensionFieldList),
}) {}
export class BarChartFieldWells extends S.Class<BarChartFieldWells>(
  "BarChartFieldWells",
)({ BarChartAggregatedFieldWells: S.optional(BarChartAggregatedFieldWells) }) {}
export const FieldSortOptionsList = S.Array(FieldSortOptions);
export class ItemsLimitConfiguration extends S.Class<ItemsLimitConfiguration>(
  "ItemsLimitConfiguration",
)({
  ItemsLimit: S.optional(S.Number),
  OtherCategories: S.optional(S.String),
}) {}
export class BarChartSortConfiguration extends S.Class<BarChartSortConfiguration>(
  "BarChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
  ColorSort: S.optional(FieldSortOptionsList),
  ColorItemsLimit: S.optional(ItemsLimitConfiguration),
  SmallMultiplesSort: S.optional(FieldSortOptionsList),
  SmallMultiplesLimitConfiguration: S.optional(ItemsLimitConfiguration),
}) {}
export class DataPathColor extends S.Class<DataPathColor>("DataPathColor")({
  Element: DataPathValue,
  Color: S.String,
  TimeGranularity: S.optional(S.String),
}) {}
export const DataPathColorList = S.Array(DataPathColor);
export class VisualPalette extends S.Class<VisualPalette>("VisualPalette")({
  ChartColor: S.optional(S.String),
  ColorMap: S.optional(DataPathColorList),
}) {}
export class PanelTitleOptions extends S.Class<PanelTitleOptions>(
  "PanelTitleOptions",
)({
  Visibility: S.optional(S.String),
  FontConfiguration: S.optional(FontConfiguration),
  HorizontalTextAlignment: S.optional(S.String),
}) {}
export class PanelConfiguration extends S.Class<PanelConfiguration>(
  "PanelConfiguration",
)({
  Title: S.optional(PanelTitleOptions),
  BorderVisibility: S.optional(S.String),
  BorderThickness: S.optional(S.String),
  BorderStyle: S.optional(S.String),
  BorderColor: S.optional(S.String),
  GutterVisibility: S.optional(S.String),
  GutterSpacing: S.optional(S.String),
  BackgroundVisibility: S.optional(S.String),
  BackgroundColor: S.optional(S.String),
}) {}
export class SmallMultiplesAxisProperties extends S.Class<SmallMultiplesAxisProperties>(
  "SmallMultiplesAxisProperties",
)({ Scale: S.optional(S.String), Placement: S.optional(S.String) }) {}
export class SmallMultiplesOptions extends S.Class<SmallMultiplesOptions>(
  "SmallMultiplesOptions",
)({
  MaxVisibleRows: S.optional(S.Number),
  MaxVisibleColumns: S.optional(S.Number),
  PanelConfiguration: S.optional(PanelConfiguration),
  XAxis: S.optional(SmallMultiplesAxisProperties),
  YAxis: S.optional(SmallMultiplesAxisProperties),
}) {}
export class AxisTickLabelOptions extends S.Class<AxisTickLabelOptions>(
  "AxisTickLabelOptions",
)({
  LabelOptions: S.optional(LabelOptions),
  RotationAngle: S.optional(S.Number),
}) {}
export class AxisLinearScale extends S.Class<AxisLinearScale>(
  "AxisLinearScale",
)({ StepCount: S.optional(S.Number), StepSize: S.optional(S.Number) }) {}
export class AxisLogarithmicScale extends S.Class<AxisLogarithmicScale>(
  "AxisLogarithmicScale",
)({ Base: S.optional(S.Number) }) {}
export class AxisScale extends S.Class<AxisScale>("AxisScale")({
  Linear: S.optional(AxisLinearScale),
  Logarithmic: S.optional(AxisLogarithmicScale),
}) {}
export class AxisDisplayMinMaxRange extends S.Class<AxisDisplayMinMaxRange>(
  "AxisDisplayMinMaxRange",
)({ Minimum: S.optional(S.Number), Maximum: S.optional(S.Number) }) {}
export class AxisDisplayDataDrivenRange extends S.Class<AxisDisplayDataDrivenRange>(
  "AxisDisplayDataDrivenRange",
)({}) {}
export class AxisDisplayRange extends S.Class<AxisDisplayRange>(
  "AxisDisplayRange",
)({
  MinMax: S.optional(AxisDisplayMinMaxRange),
  DataDriven: S.optional(AxisDisplayDataDrivenRange),
}) {}
export class NumericAxisOptions extends S.Class<NumericAxisOptions>(
  "NumericAxisOptions",
)({ Scale: S.optional(AxisScale), Range: S.optional(AxisDisplayRange) }) {}
export class DateAxisOptions extends S.Class<DateAxisOptions>(
  "DateAxisOptions",
)({ MissingDateVisibility: S.optional(S.String) }) {}
export class AxisDataOptions extends S.Class<AxisDataOptions>(
  "AxisDataOptions",
)({
  NumericAxisOptions: S.optional(NumericAxisOptions),
  DateAxisOptions: S.optional(DateAxisOptions),
}) {}
export class PercentVisibleRange extends S.Class<PercentVisibleRange>(
  "PercentVisibleRange",
)({ From: S.optional(S.Number), To: S.optional(S.Number) }) {}
export class VisibleRangeOptions extends S.Class<VisibleRangeOptions>(
  "VisibleRangeOptions",
)({ PercentRange: S.optional(PercentVisibleRange) }) {}
export class ScrollBarOptions extends S.Class<ScrollBarOptions>(
  "ScrollBarOptions",
)({
  Visibility: S.optional(S.String),
  VisibleRange: S.optional(VisibleRangeOptions),
}) {}
export class AxisDisplayOptions extends S.Class<AxisDisplayOptions>(
  "AxisDisplayOptions",
)({
  TickLabelOptions: S.optional(AxisTickLabelOptions),
  AxisLineVisibility: S.optional(S.String),
  GridLineVisibility: S.optional(S.String),
  DataOptions: S.optional(AxisDataOptions),
  ScrollbarOptions: S.optional(ScrollBarOptions),
  AxisOffset: S.optional(S.String),
}) {}
export class AxisLabelReferenceOptions extends S.Class<AxisLabelReferenceOptions>(
  "AxisLabelReferenceOptions",
)({ FieldId: S.String, Column: ColumnIdentifier }) {}
export class AxisLabelOptions extends S.Class<AxisLabelOptions>(
  "AxisLabelOptions",
)({
  FontConfiguration: S.optional(FontConfiguration),
  CustomLabel: S.optional(S.String),
  ApplyTo: S.optional(AxisLabelReferenceOptions),
}) {}
export const AxisLabelOptionsList = S.Array(AxisLabelOptions);
export class ChartAxisLabelOptions extends S.Class<ChartAxisLabelOptions>(
  "ChartAxisLabelOptions",
)({
  Visibility: S.optional(S.String),
  SortIconVisibility: S.optional(S.String),
  AxisLabelOptions: S.optional(AxisLabelOptionsList),
}) {}
export class DecalSettings extends S.Class<DecalSettings>("DecalSettings")({
  ElementValue: S.optional(S.String),
  DecalVisibility: S.optional(S.String),
  DecalColor: S.optional(S.String),
  DecalPatternType: S.optional(S.String),
  DecalStyleType: S.optional(S.String),
}) {}
export class BorderSettings extends S.Class<BorderSettings>("BorderSettings")({
  BorderVisibility: S.optional(S.String),
  BorderWidth: S.optional(S.String),
  BorderColor: S.optional(S.String),
}) {}
export class BarChartDefaultSeriesSettings extends S.Class<BarChartDefaultSeriesSettings>(
  "BarChartDefaultSeriesSettings",
)({
  DecalSettings: S.optional(DecalSettings),
  BorderSettings: S.optional(BorderSettings),
}) {}
export class BarChartSeriesSettings extends S.Class<BarChartSeriesSettings>(
  "BarChartSeriesSettings",
)({
  DecalSettings: S.optional(DecalSettings),
  BorderSettings: S.optional(BorderSettings),
}) {}
export class FieldBarSeriesItem extends S.Class<FieldBarSeriesItem>(
  "FieldBarSeriesItem",
)({ FieldId: S.String, Settings: S.optional(BarChartSeriesSettings) }) {}
export class DataFieldBarSeriesItem extends S.Class<DataFieldBarSeriesItem>(
  "DataFieldBarSeriesItem",
)({
  FieldId: S.String,
  FieldValue: S.optional(S.String),
  Settings: S.optional(BarChartSeriesSettings),
}) {}
export class BarSeriesItem extends S.Class<BarSeriesItem>("BarSeriesItem")({
  FieldBarSeriesItem: S.optional(FieldBarSeriesItem),
  DataFieldBarSeriesItem: S.optional(DataFieldBarSeriesItem),
}) {}
export const BarSeriesItemList = S.Array(BarSeriesItem);
export class LegendOptions extends S.Class<LegendOptions>("LegendOptions")({
  Visibility: S.optional(S.String),
  Title: S.optional(LabelOptions),
  Position: S.optional(S.String),
  Width: S.optional(S.String),
  Height: S.optional(S.String),
  ValueFontConfiguration: S.optional(FontConfiguration),
}) {}
export class FieldLabelType extends S.Class<FieldLabelType>("FieldLabelType")({
  FieldId: S.optional(S.String),
  Visibility: S.optional(S.String),
}) {}
export class DataPathLabelType extends S.Class<DataPathLabelType>(
  "DataPathLabelType",
)({
  FieldId: S.optional(S.String),
  FieldValue: S.optional(S.String),
  Visibility: S.optional(S.String),
}) {}
export class RangeEndsLabelType extends S.Class<RangeEndsLabelType>(
  "RangeEndsLabelType",
)({ Visibility: S.optional(S.String) }) {}
export class MinimumLabelType extends S.Class<MinimumLabelType>(
  "MinimumLabelType",
)({ Visibility: S.optional(S.String) }) {}
export class MaximumLabelType extends S.Class<MaximumLabelType>(
  "MaximumLabelType",
)({ Visibility: S.optional(S.String) }) {}
export class DataLabelType extends S.Class<DataLabelType>("DataLabelType")({
  FieldLabelType: S.optional(FieldLabelType),
  DataPathLabelType: S.optional(DataPathLabelType),
  RangeEndsLabelType: S.optional(RangeEndsLabelType),
  MinimumLabelType: S.optional(MinimumLabelType),
  MaximumLabelType: S.optional(MaximumLabelType),
}) {}
export const DataLabelTypes = S.Array(DataLabelType);
export class DataLabelOptions extends S.Class<DataLabelOptions>(
  "DataLabelOptions",
)({
  Visibility: S.optional(S.String),
  CategoryLabelVisibility: S.optional(S.String),
  MeasureLabelVisibility: S.optional(S.String),
  DataLabelTypes: S.optional(DataLabelTypes),
  Position: S.optional(S.String),
  LabelContent: S.optional(S.String),
  LabelFontConfiguration: S.optional(FontConfiguration),
  LabelColor: S.optional(S.String),
  Overlap: S.optional(S.String),
  TotalsVisibility: S.optional(S.String),
}) {}
export class FieldTooltipItem extends S.Class<FieldTooltipItem>(
  "FieldTooltipItem",
)({
  FieldId: S.String,
  Label: S.optional(S.String),
  Visibility: S.optional(S.String),
  TooltipTarget: S.optional(S.String),
}) {}
export class ColumnTooltipItem extends S.Class<ColumnTooltipItem>(
  "ColumnTooltipItem",
)({
  Column: ColumnIdentifier,
  Label: S.optional(S.String),
  Visibility: S.optional(S.String),
  Aggregation: S.optional(AggregationFunction),
  TooltipTarget: S.optional(S.String),
}) {}
export class TooltipItem extends S.Class<TooltipItem>("TooltipItem")({
  FieldTooltipItem: S.optional(FieldTooltipItem),
  ColumnTooltipItem: S.optional(ColumnTooltipItem),
}) {}
export const TooltipItemList = S.Array(TooltipItem);
export class FieldBasedTooltip extends S.Class<FieldBasedTooltip>(
  "FieldBasedTooltip",
)({
  AggregationVisibility: S.optional(S.String),
  TooltipTitleType: S.optional(S.String),
  TooltipFields: S.optional(TooltipItemList),
}) {}
export class TooltipOptions extends S.Class<TooltipOptions>("TooltipOptions")({
  TooltipVisibility: S.optional(S.String),
  SelectedTooltipType: S.optional(S.String),
  FieldBasedTooltip: S.optional(FieldBasedTooltip),
}) {}
export class ReferenceLineStaticDataConfiguration extends S.Class<ReferenceLineStaticDataConfiguration>(
  "ReferenceLineStaticDataConfiguration",
)({ Value: S.Number }) {}
export class ReferenceLineDynamicDataConfiguration extends S.Class<ReferenceLineDynamicDataConfiguration>(
  "ReferenceLineDynamicDataConfiguration",
)({
  Column: ColumnIdentifier,
  MeasureAggregationFunction: S.optional(AggregationFunction),
  Calculation: NumericalAggregationFunction,
}) {}
export class ReferenceLineDataConfiguration extends S.Class<ReferenceLineDataConfiguration>(
  "ReferenceLineDataConfiguration",
)({
  StaticConfiguration: S.optional(ReferenceLineStaticDataConfiguration),
  DynamicConfiguration: S.optional(ReferenceLineDynamicDataConfiguration),
  AxisBinding: S.optional(S.String),
  SeriesType: S.optional(S.String),
}) {}
export class ReferenceLineStyleConfiguration extends S.Class<ReferenceLineStyleConfiguration>(
  "ReferenceLineStyleConfiguration",
)({ Pattern: S.optional(S.String), Color: S.optional(S.String) }) {}
export class ReferenceLineValueLabelConfiguration extends S.Class<ReferenceLineValueLabelConfiguration>(
  "ReferenceLineValueLabelConfiguration",
)({
  RelativePosition: S.optional(S.String),
  FormatConfiguration: S.optional(NumericFormatConfiguration),
}) {}
export class ReferenceLineCustomLabelConfiguration extends S.Class<ReferenceLineCustomLabelConfiguration>(
  "ReferenceLineCustomLabelConfiguration",
)({ CustomLabel: S.String }) {}
export class ReferenceLineLabelConfiguration extends S.Class<ReferenceLineLabelConfiguration>(
  "ReferenceLineLabelConfiguration",
)({
  ValueLabelConfiguration: S.optional(ReferenceLineValueLabelConfiguration),
  CustomLabelConfiguration: S.optional(ReferenceLineCustomLabelConfiguration),
  FontConfiguration: S.optional(FontConfiguration),
  FontColor: S.optional(S.String),
  HorizontalPosition: S.optional(S.String),
  VerticalPosition: S.optional(S.String),
}) {}
export class ReferenceLine extends S.Class<ReferenceLine>("ReferenceLine")({
  Status: S.optional(S.String),
  DataConfiguration: ReferenceLineDataConfiguration,
  StyleConfiguration: S.optional(ReferenceLineStyleConfiguration),
  LabelConfiguration: S.optional(ReferenceLineLabelConfiguration),
}) {}
export const ReferenceLineList = S.Array(ReferenceLine);
export const ContributorDimensionList = S.Array(ColumnIdentifier);
export class ContributionAnalysisDefault extends S.Class<ContributionAnalysisDefault>(
  "ContributionAnalysisDefault",
)({
  MeasureFieldId: S.String,
  ContributorDimensions: ContributorDimensionList,
}) {}
export const ContributionAnalysisDefaultList = S.Array(
  ContributionAnalysisDefault,
);
export class BarChartConfiguration extends S.Class<BarChartConfiguration>(
  "BarChartConfiguration",
)({
  FieldWells: S.optional(BarChartFieldWells),
  SortConfiguration: S.optional(BarChartSortConfiguration),
  Orientation: S.optional(S.String),
  BarsArrangement: S.optional(S.String),
  VisualPalette: S.optional(VisualPalette),
  SmallMultiplesOptions: S.optional(SmallMultiplesOptions),
  CategoryAxis: S.optional(AxisDisplayOptions),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  ValueAxis: S.optional(AxisDisplayOptions),
  ValueLabelOptions: S.optional(ChartAxisLabelOptions),
  ColorLabelOptions: S.optional(ChartAxisLabelOptions),
  DefaultSeriesSettings: S.optional(BarChartDefaultSeriesSettings),
  Series: S.optional(BarSeriesItemList),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  ReferenceLines: S.optional(ReferenceLineList),
  ContributionAnalysisDefaults: S.optional(ContributionAnalysisDefaultList),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export const ExplicitHierarchyColumnList = S.Array(ColumnIdentifier);
export class NumericEqualityDrillDownFilter extends S.Class<NumericEqualityDrillDownFilter>(
  "NumericEqualityDrillDownFilter",
)({ Column: ColumnIdentifier, Value: S.Number }) {}
export const CategoryValueList = S.Array(S.String);
export class CategoryDrillDownFilter extends S.Class<CategoryDrillDownFilter>(
  "CategoryDrillDownFilter",
)({ Column: ColumnIdentifier, CategoryValues: CategoryValueList }) {}
export class TimeRangeDrillDownFilter extends S.Class<TimeRangeDrillDownFilter>(
  "TimeRangeDrillDownFilter",
)({
  Column: ColumnIdentifier,
  RangeMinimum: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RangeMaximum: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  TimeGranularity: S.String,
}) {}
export class DrillDownFilter extends S.Class<DrillDownFilter>(
  "DrillDownFilter",
)({
  NumericEqualityFilter: S.optional(NumericEqualityDrillDownFilter),
  CategoryFilter: S.optional(CategoryDrillDownFilter),
  TimeRangeFilter: S.optional(TimeRangeDrillDownFilter),
}) {}
export const DrillDownFilterList = S.Array(DrillDownFilter);
export class ExplicitHierarchy extends S.Class<ExplicitHierarchy>(
  "ExplicitHierarchy",
)({
  HierarchyId: S.String,
  Columns: ExplicitHierarchyColumnList,
  DrillDownFilters: S.optional(DrillDownFilterList),
}) {}
export class DateTimeHierarchy extends S.Class<DateTimeHierarchy>(
  "DateTimeHierarchy",
)({
  HierarchyId: S.String,
  DrillDownFilters: S.optional(DrillDownFilterList),
}) {}
export const PredefinedHierarchyColumnList = S.Array(ColumnIdentifier);
export class PredefinedHierarchy extends S.Class<PredefinedHierarchy>(
  "PredefinedHierarchy",
)({
  HierarchyId: S.String,
  Columns: PredefinedHierarchyColumnList,
  DrillDownFilters: S.optional(DrillDownFilterList),
}) {}
export class ColumnHierarchy extends S.Class<ColumnHierarchy>(
  "ColumnHierarchy",
)({
  ExplicitHierarchy: S.optional(ExplicitHierarchy),
  DateTimeHierarchy: S.optional(DateTimeHierarchy),
  PredefinedHierarchy: S.optional(PredefinedHierarchy),
}) {}
export const ColumnHierarchyList = S.Array(ColumnHierarchy);
export class BarChartVisual extends S.Class<BarChartVisual>("BarChartVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(BarChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class KPIFieldWells extends S.Class<KPIFieldWells>("KPIFieldWells")({
  Values: S.optional(MeasureFieldList),
  TargetValues: S.optional(MeasureFieldList),
  TrendGroups: S.optional(DimensionFieldList),
}) {}
export class KPISortConfiguration extends S.Class<KPISortConfiguration>(
  "KPISortConfiguration",
)({ TrendGroupSort: S.optional(FieldSortOptionsList) }) {}
export class ProgressBarOptions extends S.Class<ProgressBarOptions>(
  "ProgressBarOptions",
)({ Visibility: S.optional(S.String) }) {}
export class TrendArrowOptions extends S.Class<TrendArrowOptions>(
  "TrendArrowOptions",
)({ Visibility: S.optional(S.String) }) {}
export class SecondaryValueOptions extends S.Class<SecondaryValueOptions>(
  "SecondaryValueOptions",
)({ Visibility: S.optional(S.String) }) {}
export class ComparisonFormatConfiguration extends S.Class<ComparisonFormatConfiguration>(
  "ComparisonFormatConfiguration",
)({
  NumberDisplayFormatConfiguration: S.optional(
    NumberDisplayFormatConfiguration,
  ),
  PercentageDisplayFormatConfiguration: S.optional(
    PercentageDisplayFormatConfiguration,
  ),
}) {}
export class ComparisonConfiguration extends S.Class<ComparisonConfiguration>(
  "ComparisonConfiguration",
)({
  ComparisonMethod: S.optional(S.String),
  ComparisonFormat: S.optional(ComparisonFormatConfiguration),
}) {}
export class KPISparklineOptions extends S.Class<KPISparklineOptions>(
  "KPISparklineOptions",
)({
  Visibility: S.optional(S.String),
  Type: S.String,
  Color: S.optional(S.String),
  TooltipVisibility: S.optional(S.String),
}) {}
export class KPIVisualStandardLayout extends S.Class<KPIVisualStandardLayout>(
  "KPIVisualStandardLayout",
)({ Type: S.String }) {}
export class KPIVisualLayoutOptions extends S.Class<KPIVisualLayoutOptions>(
  "KPIVisualLayoutOptions",
)({ StandardLayout: S.optional(KPIVisualStandardLayout) }) {}
export class KPIOptions extends S.Class<KPIOptions>("KPIOptions")({
  ProgressBar: S.optional(ProgressBarOptions),
  TrendArrows: S.optional(TrendArrowOptions),
  SecondaryValue: S.optional(SecondaryValueOptions),
  Comparison: S.optional(ComparisonConfiguration),
  PrimaryValueDisplayType: S.optional(S.String),
  PrimaryValueFontConfiguration: S.optional(FontConfiguration),
  SecondaryValueFontConfiguration: S.optional(FontConfiguration),
  Sparkline: S.optional(KPISparklineOptions),
  VisualLayoutOptions: S.optional(KPIVisualLayoutOptions),
}) {}
export class KPIConfiguration extends S.Class<KPIConfiguration>(
  "KPIConfiguration",
)({
  FieldWells: S.optional(KPIFieldWells),
  SortConfiguration: S.optional(KPISortConfiguration),
  KPIOptions: S.optional(KPIOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class KPIPrimaryValueConditionalFormatting extends S.Class<KPIPrimaryValueConditionalFormatting>(
  "KPIPrimaryValueConditionalFormatting",
)({
  TextColor: S.optional(ConditionalFormattingColor),
  Icon: S.optional(ConditionalFormattingIcon),
}) {}
export class KPIProgressBarConditionalFormatting extends S.Class<KPIProgressBarConditionalFormatting>(
  "KPIProgressBarConditionalFormatting",
)({ ForegroundColor: S.optional(ConditionalFormattingColor) }) {}
export class KPIActualValueConditionalFormatting extends S.Class<KPIActualValueConditionalFormatting>(
  "KPIActualValueConditionalFormatting",
)({
  TextColor: S.optional(ConditionalFormattingColor),
  Icon: S.optional(ConditionalFormattingIcon),
}) {}
export class KPIComparisonValueConditionalFormatting extends S.Class<KPIComparisonValueConditionalFormatting>(
  "KPIComparisonValueConditionalFormatting",
)({
  TextColor: S.optional(ConditionalFormattingColor),
  Icon: S.optional(ConditionalFormattingIcon),
}) {}
export class KPIConditionalFormattingOption extends S.Class<KPIConditionalFormattingOption>(
  "KPIConditionalFormattingOption",
)({
  PrimaryValue: S.optional(KPIPrimaryValueConditionalFormatting),
  ProgressBar: S.optional(KPIProgressBarConditionalFormatting),
  ActualValue: S.optional(KPIActualValueConditionalFormatting),
  ComparisonValue: S.optional(KPIComparisonValueConditionalFormatting),
}) {}
export const KPIConditionalFormattingOptionList = S.Array(
  KPIConditionalFormattingOption,
);
export class KPIConditionalFormatting extends S.Class<KPIConditionalFormatting>(
  "KPIConditionalFormatting",
)({
  ConditionalFormattingOptions: S.optional(KPIConditionalFormattingOptionList),
}) {}
export class KPIVisual extends S.Class<KPIVisual>("KPIVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(KPIConfiguration),
  ConditionalFormatting: S.optional(KPIConditionalFormatting),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class PieChartAggregatedFieldWells extends S.Class<PieChartAggregatedFieldWells>(
  "PieChartAggregatedFieldWells",
)({
  Category: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
  SmallMultiples: S.optional(SmallMultiplesDimensionFieldList),
}) {}
export class PieChartFieldWells extends S.Class<PieChartFieldWells>(
  "PieChartFieldWells",
)({ PieChartAggregatedFieldWells: S.optional(PieChartAggregatedFieldWells) }) {}
export class PieChartSortConfiguration extends S.Class<PieChartSortConfiguration>(
  "PieChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
  SmallMultiplesSort: S.optional(FieldSortOptionsList),
  SmallMultiplesLimitConfiguration: S.optional(ItemsLimitConfiguration),
}) {}
export class ArcOptions extends S.Class<ArcOptions>("ArcOptions")({
  ArcThickness: S.optional(S.String),
}) {}
export class DonutCenterOptions extends S.Class<DonutCenterOptions>(
  "DonutCenterOptions",
)({ LabelVisibility: S.optional(S.String) }) {}
export class DonutOptions extends S.Class<DonutOptions>("DonutOptions")({
  ArcOptions: S.optional(ArcOptions),
  DonutCenterOptions: S.optional(DonutCenterOptions),
}) {}
export class PieChartConfiguration extends S.Class<PieChartConfiguration>(
  "PieChartConfiguration",
)({
  FieldWells: S.optional(PieChartFieldWells),
  SortConfiguration: S.optional(PieChartSortConfiguration),
  DonutOptions: S.optional(DonutOptions),
  SmallMultiplesOptions: S.optional(SmallMultiplesOptions),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  ValueLabelOptions: S.optional(ChartAxisLabelOptions),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  VisualPalette: S.optional(VisualPalette),
  ContributionAnalysisDefaults: S.optional(ContributionAnalysisDefaultList),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class PieChartVisual extends S.Class<PieChartVisual>("PieChartVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(PieChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class GaugeChartFieldWells extends S.Class<GaugeChartFieldWells>(
  "GaugeChartFieldWells",
)({
  Values: S.optional(MeasureFieldList),
  TargetValues: S.optional(MeasureFieldList),
}) {}
export class ArcAxisDisplayRange extends S.Class<ArcAxisDisplayRange>(
  "ArcAxisDisplayRange",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export class ArcAxisConfiguration extends S.Class<ArcAxisConfiguration>(
  "ArcAxisConfiguration",
)({
  Range: S.optional(ArcAxisDisplayRange),
  ReserveRange: S.optional(S.Number),
}) {}
export class ArcConfiguration extends S.Class<ArcConfiguration>(
  "ArcConfiguration",
)({ ArcAngle: S.optional(S.Number), ArcThickness: S.optional(S.String) }) {}
export class GaugeChartOptions extends S.Class<GaugeChartOptions>(
  "GaugeChartOptions",
)({
  PrimaryValueDisplayType: S.optional(S.String),
  Comparison: S.optional(ComparisonConfiguration),
  ArcAxis: S.optional(ArcAxisConfiguration),
  Arc: S.optional(ArcConfiguration),
  PrimaryValueFontConfiguration: S.optional(FontConfiguration),
}) {}
export class GaugeChartColorConfiguration extends S.Class<GaugeChartColorConfiguration>(
  "GaugeChartColorConfiguration",
)({
  ForegroundColor: S.optional(S.String),
  BackgroundColor: S.optional(S.String),
}) {}
export class GaugeChartConfiguration extends S.Class<GaugeChartConfiguration>(
  "GaugeChartConfiguration",
)({
  FieldWells: S.optional(GaugeChartFieldWells),
  GaugeChartOptions: S.optional(GaugeChartOptions),
  DataLabels: S.optional(DataLabelOptions),
  TooltipOptions: S.optional(TooltipOptions),
  VisualPalette: S.optional(VisualPalette),
  ColorConfiguration: S.optional(GaugeChartColorConfiguration),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class GaugeChartPrimaryValueConditionalFormatting extends S.Class<GaugeChartPrimaryValueConditionalFormatting>(
  "GaugeChartPrimaryValueConditionalFormatting",
)({
  TextColor: S.optional(ConditionalFormattingColor),
  Icon: S.optional(ConditionalFormattingIcon),
}) {}
export class GaugeChartArcConditionalFormatting extends S.Class<GaugeChartArcConditionalFormatting>(
  "GaugeChartArcConditionalFormatting",
)({ ForegroundColor: S.optional(ConditionalFormattingColor) }) {}
export class GaugeChartConditionalFormattingOption extends S.Class<GaugeChartConditionalFormattingOption>(
  "GaugeChartConditionalFormattingOption",
)({
  PrimaryValue: S.optional(GaugeChartPrimaryValueConditionalFormatting),
  Arc: S.optional(GaugeChartArcConditionalFormatting),
}) {}
export const GaugeChartConditionalFormattingOptionList = S.Array(
  GaugeChartConditionalFormattingOption,
);
export class GaugeChartConditionalFormatting extends S.Class<GaugeChartConditionalFormatting>(
  "GaugeChartConditionalFormatting",
)({
  ConditionalFormattingOptions: S.optional(
    GaugeChartConditionalFormattingOptionList,
  ),
}) {}
export class GaugeChartVisual extends S.Class<GaugeChartVisual>(
  "GaugeChartVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(GaugeChartConfiguration),
  ConditionalFormatting: S.optional(GaugeChartConditionalFormatting),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class LineChartAggregatedFieldWells extends S.Class<LineChartAggregatedFieldWells>(
  "LineChartAggregatedFieldWells",
)({
  Category: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
  Colors: S.optional(DimensionFieldList),
  SmallMultiples: S.optional(SmallMultiplesDimensionFieldList),
}) {}
export class LineChartFieldWells extends S.Class<LineChartFieldWells>(
  "LineChartFieldWells",
)({
  LineChartAggregatedFieldWells: S.optional(LineChartAggregatedFieldWells),
}) {}
export class LineChartSortConfiguration extends S.Class<LineChartSortConfiguration>(
  "LineChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimitConfiguration: S.optional(ItemsLimitConfiguration),
  ColorItemsLimitConfiguration: S.optional(ItemsLimitConfiguration),
  SmallMultiplesSort: S.optional(FieldSortOptionsList),
  SmallMultiplesLimitConfiguration: S.optional(ItemsLimitConfiguration),
}) {}
export class TimeBasedForecastProperties extends S.Class<TimeBasedForecastProperties>(
  "TimeBasedForecastProperties",
)({
  PeriodsForward: S.optional(S.Number),
  PeriodsBackward: S.optional(S.Number),
  UpperBoundary: S.optional(S.Number),
  LowerBoundary: S.optional(S.Number),
  PredictionInterval: S.optional(S.Number),
  Seasonality: S.optional(S.Number),
}) {}
export class WhatIfPointScenario extends S.Class<WhatIfPointScenario>(
  "WhatIfPointScenario",
)({ Date: S.Date.pipe(T.TimestampFormat("epoch-seconds")), Value: S.Number }) {}
export class WhatIfRangeScenario extends S.Class<WhatIfRangeScenario>(
  "WhatIfRangeScenario",
)({
  StartDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Value: S.Number,
}) {}
export class ForecastScenario extends S.Class<ForecastScenario>(
  "ForecastScenario",
)({
  WhatIfPointScenario: S.optional(WhatIfPointScenario),
  WhatIfRangeScenario: S.optional(WhatIfRangeScenario),
}) {}
export class ForecastConfiguration extends S.Class<ForecastConfiguration>(
  "ForecastConfiguration",
)({
  ForecastProperties: S.optional(TimeBasedForecastProperties),
  Scenario: S.optional(ForecastScenario),
}) {}
export const ForecastConfigurationList = S.Array(ForecastConfiguration);
export class MissingDataConfiguration extends S.Class<MissingDataConfiguration>(
  "MissingDataConfiguration",
)({ TreatmentOption: S.optional(S.String) }) {}
export const MissingDataConfigurationList = S.Array(MissingDataConfiguration);
export class LineSeriesAxisDisplayOptions extends S.Class<LineSeriesAxisDisplayOptions>(
  "LineSeriesAxisDisplayOptions",
)({
  AxisOptions: S.optional(AxisDisplayOptions),
  MissingDataConfigurations: S.optional(MissingDataConfigurationList),
}) {}
export class YAxisOptions extends S.Class<YAxisOptions>("YAxisOptions")({
  YAxis: S.String,
}) {}
export class SingleAxisOptions extends S.Class<SingleAxisOptions>(
  "SingleAxisOptions",
)({ YAxisOptions: S.optional(YAxisOptions) }) {}
export class LineChartLineStyleSettings extends S.Class<LineChartLineStyleSettings>(
  "LineChartLineStyleSettings",
)({
  LineVisibility: S.optional(S.String),
  LineInterpolation: S.optional(S.String),
  LineStyle: S.optional(S.String),
  LineWidth: S.optional(S.String),
}) {}
export class LineChartMarkerStyleSettings extends S.Class<LineChartMarkerStyleSettings>(
  "LineChartMarkerStyleSettings",
)({
  MarkerVisibility: S.optional(S.String),
  MarkerShape: S.optional(S.String),
  MarkerSize: S.optional(S.String),
  MarkerColor: S.optional(S.String),
}) {}
export class LineChartDefaultSeriesSettings extends S.Class<LineChartDefaultSeriesSettings>(
  "LineChartDefaultSeriesSettings",
)({
  AxisBinding: S.optional(S.String),
  LineStyleSettings: S.optional(LineChartLineStyleSettings),
  MarkerStyleSettings: S.optional(LineChartMarkerStyleSettings),
  DecalSettings: S.optional(DecalSettings),
}) {}
export class LineChartSeriesSettings extends S.Class<LineChartSeriesSettings>(
  "LineChartSeriesSettings",
)({
  LineStyleSettings: S.optional(LineChartLineStyleSettings),
  MarkerStyleSettings: S.optional(LineChartMarkerStyleSettings),
  DecalSettings: S.optional(DecalSettings),
}) {}
export class FieldSeriesItem extends S.Class<FieldSeriesItem>(
  "FieldSeriesItem",
)({
  FieldId: S.String,
  AxisBinding: S.String,
  Settings: S.optional(LineChartSeriesSettings),
}) {}
export class DataFieldSeriesItem extends S.Class<DataFieldSeriesItem>(
  "DataFieldSeriesItem",
)({
  FieldId: S.String,
  FieldValue: S.optional(S.String),
  AxisBinding: S.String,
  Settings: S.optional(LineChartSeriesSettings),
}) {}
export class SeriesItem extends S.Class<SeriesItem>("SeriesItem")({
  FieldSeriesItem: S.optional(FieldSeriesItem),
  DataFieldSeriesItem: S.optional(DataFieldSeriesItem),
}) {}
export const SeriesItemList = S.Array(SeriesItem);
export class LineChartConfiguration extends S.Class<LineChartConfiguration>(
  "LineChartConfiguration",
)({
  FieldWells: S.optional(LineChartFieldWells),
  SortConfiguration: S.optional(LineChartSortConfiguration),
  ForecastConfigurations: S.optional(ForecastConfigurationList),
  Type: S.optional(S.String),
  SmallMultiplesOptions: S.optional(SmallMultiplesOptions),
  XAxisDisplayOptions: S.optional(AxisDisplayOptions),
  XAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  PrimaryYAxisDisplayOptions: S.optional(LineSeriesAxisDisplayOptions),
  PrimaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  SecondaryYAxisDisplayOptions: S.optional(LineSeriesAxisDisplayOptions),
  SecondaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  SingleAxisOptions: S.optional(SingleAxisOptions),
  DefaultSeriesSettings: S.optional(LineChartDefaultSeriesSettings),
  Series: S.optional(SeriesItemList),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  ReferenceLines: S.optional(ReferenceLineList),
  Tooltip: S.optional(TooltipOptions),
  ContributionAnalysisDefaults: S.optional(ContributionAnalysisDefaultList),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class LineChartVisual extends S.Class<LineChartVisual>(
  "LineChartVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(LineChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const HeatMapDimensionFieldList = S.Array(DimensionField);
export const HeatMapMeasureFieldList = S.Array(MeasureField);
export class HeatMapAggregatedFieldWells extends S.Class<HeatMapAggregatedFieldWells>(
  "HeatMapAggregatedFieldWells",
)({
  Rows: S.optional(HeatMapDimensionFieldList),
  Columns: S.optional(HeatMapDimensionFieldList),
  Values: S.optional(HeatMapMeasureFieldList),
}) {}
export class HeatMapFieldWells extends S.Class<HeatMapFieldWells>(
  "HeatMapFieldWells",
)({ HeatMapAggregatedFieldWells: S.optional(HeatMapAggregatedFieldWells) }) {}
export class HeatMapSortConfiguration extends S.Class<HeatMapSortConfiguration>(
  "HeatMapSortConfiguration",
)({
  HeatMapRowSort: S.optional(FieldSortOptionsList),
  HeatMapColumnSort: S.optional(FieldSortOptionsList),
  HeatMapRowItemsLimitConfiguration: S.optional(ItemsLimitConfiguration),
  HeatMapColumnItemsLimitConfiguration: S.optional(ItemsLimitConfiguration),
}) {}
export class DataColor extends S.Class<DataColor>("DataColor")({
  Color: S.optional(S.String),
  DataValue: S.optional(S.Number),
}) {}
export const ColorScaleColorList = S.Array(DataColor);
export class ColorScale extends S.Class<ColorScale>("ColorScale")({
  Colors: ColorScaleColorList,
  ColorFillType: S.String,
  NullValueColor: S.optional(DataColor),
}) {}
export class HeatMapConfiguration extends S.Class<HeatMapConfiguration>(
  "HeatMapConfiguration",
)({
  FieldWells: S.optional(HeatMapFieldWells),
  SortConfiguration: S.optional(HeatMapSortConfiguration),
  RowAxisDisplayOptions: S.optional(AxisDisplayOptions),
  RowLabelOptions: S.optional(ChartAxisLabelOptions),
  ColumnAxisDisplayOptions: S.optional(AxisDisplayOptions),
  ColumnLabelOptions: S.optional(ChartAxisLabelOptions),
  ColorScale: S.optional(ColorScale),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class HeatMapVisual extends S.Class<HeatMapVisual>("HeatMapVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(HeatMapConfiguration),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const TreeMapDimensionFieldList = S.Array(DimensionField);
export const TreeMapMeasureFieldList = S.Array(MeasureField);
export class TreeMapAggregatedFieldWells extends S.Class<TreeMapAggregatedFieldWells>(
  "TreeMapAggregatedFieldWells",
)({
  Groups: S.optional(TreeMapDimensionFieldList),
  Sizes: S.optional(TreeMapMeasureFieldList),
  Colors: S.optional(TreeMapMeasureFieldList),
}) {}
export class TreeMapFieldWells extends S.Class<TreeMapFieldWells>(
  "TreeMapFieldWells",
)({ TreeMapAggregatedFieldWells: S.optional(TreeMapAggregatedFieldWells) }) {}
export class TreeMapSortConfiguration extends S.Class<TreeMapSortConfiguration>(
  "TreeMapSortConfiguration",
)({
  TreeMapSort: S.optional(FieldSortOptionsList),
  TreeMapGroupItemsLimitConfiguration: S.optional(ItemsLimitConfiguration),
}) {}
export class TreeMapConfiguration extends S.Class<TreeMapConfiguration>(
  "TreeMapConfiguration",
)({
  FieldWells: S.optional(TreeMapFieldWells),
  SortConfiguration: S.optional(TreeMapSortConfiguration),
  GroupLabelOptions: S.optional(ChartAxisLabelOptions),
  SizeLabelOptions: S.optional(ChartAxisLabelOptions),
  ColorLabelOptions: S.optional(ChartAxisLabelOptions),
  ColorScale: S.optional(ColorScale),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class TreeMapVisual extends S.Class<TreeMapVisual>("TreeMapVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(TreeMapConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class GeospatialMapAggregatedFieldWells extends S.Class<GeospatialMapAggregatedFieldWells>(
  "GeospatialMapAggregatedFieldWells",
)({
  Geospatial: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
  Colors: S.optional(DimensionFieldList),
}) {}
export class GeospatialMapFieldWells extends S.Class<GeospatialMapFieldWells>(
  "GeospatialMapFieldWells",
)({
  GeospatialMapAggregatedFieldWells: S.optional(
    GeospatialMapAggregatedFieldWells,
  ),
}) {}
export class GeospatialCoordinateBounds extends S.Class<GeospatialCoordinateBounds>(
  "GeospatialCoordinateBounds",
)({ North: S.Number, South: S.Number, West: S.Number, East: S.Number }) {}
export class GeospatialWindowOptions extends S.Class<GeospatialWindowOptions>(
  "GeospatialWindowOptions",
)({
  Bounds: S.optional(GeospatialCoordinateBounds),
  MapZoomMode: S.optional(S.String),
}) {}
export class GeospatialMapStyleOptions extends S.Class<GeospatialMapStyleOptions>(
  "GeospatialMapStyleOptions",
)({ BaseMapStyle: S.optional(S.String) }) {}
export class SimpleClusterMarker extends S.Class<SimpleClusterMarker>(
  "SimpleClusterMarker",
)({ Color: S.optional(S.String) }) {}
export class ClusterMarker extends S.Class<ClusterMarker>("ClusterMarker")({
  SimpleClusterMarker: S.optional(SimpleClusterMarker),
}) {}
export class ClusterMarkerConfiguration extends S.Class<ClusterMarkerConfiguration>(
  "ClusterMarkerConfiguration",
)({ ClusterMarker: S.optional(ClusterMarker) }) {}
export class GeospatialHeatmapDataColor extends S.Class<GeospatialHeatmapDataColor>(
  "GeospatialHeatmapDataColor",
)({ Color: S.String }) {}
export const GeospatialHeatmapDataColorList = S.Array(
  GeospatialHeatmapDataColor,
);
export class GeospatialHeatmapColorScale extends S.Class<GeospatialHeatmapColorScale>(
  "GeospatialHeatmapColorScale",
)({ Colors: S.optional(GeospatialHeatmapDataColorList) }) {}
export class GeospatialHeatmapConfiguration extends S.Class<GeospatialHeatmapConfiguration>(
  "GeospatialHeatmapConfiguration",
)({ HeatmapColor: S.optional(GeospatialHeatmapColorScale) }) {}
export class GeospatialPointStyleOptions extends S.Class<GeospatialPointStyleOptions>(
  "GeospatialPointStyleOptions",
)({
  SelectedPointStyle: S.optional(S.String),
  ClusterMarkerConfiguration: S.optional(ClusterMarkerConfiguration),
  HeatmapConfiguration: S.optional(GeospatialHeatmapConfiguration),
}) {}
export class GeospatialMapConfiguration extends S.Class<GeospatialMapConfiguration>(
  "GeospatialMapConfiguration",
)({
  FieldWells: S.optional(GeospatialMapFieldWells),
  Legend: S.optional(LegendOptions),
  Tooltip: S.optional(TooltipOptions),
  WindowOptions: S.optional(GeospatialWindowOptions),
  MapStyleOptions: S.optional(GeospatialMapStyleOptions),
  PointStyleOptions: S.optional(GeospatialPointStyleOptions),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class GeocoderHierarchy extends S.Class<GeocoderHierarchy>(
  "GeocoderHierarchy",
)({
  Country: S.optional(S.String),
  State: S.optional(S.String),
  County: S.optional(S.String),
  City: S.optional(S.String),
  PostCode: S.optional(S.String),
}) {}
export class Coordinate extends S.Class<Coordinate>("Coordinate")({
  Latitude: S.Number,
  Longitude: S.Number,
}) {}
export const GeocodePreferenceValue = S.Union(
  S.Struct({ GeocoderHierarchy: GeocoderHierarchy }),
  S.Struct({ Coordinate: Coordinate }),
);
export class GeocodePreference extends S.Class<GeocodePreference>(
  "GeocodePreference",
)({ RequestKey: GeocoderHierarchy, Preference: GeocodePreferenceValue }) {}
export const GeocodePreferenceList = S.Array(GeocodePreference);
export class GeospatialMapVisual extends S.Class<GeospatialMapVisual>(
  "GeospatialMapVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(GeospatialMapConfiguration),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
  GeocodingPreferences: S.optional(GeocodePreferenceList),
}) {}
export const FilledMapDimensionFieldList = S.Array(DimensionField);
export const FilledMapMeasureFieldList = S.Array(MeasureField);
export class FilledMapAggregatedFieldWells extends S.Class<FilledMapAggregatedFieldWells>(
  "FilledMapAggregatedFieldWells",
)({
  Geospatial: S.optional(FilledMapDimensionFieldList),
  Values: S.optional(FilledMapMeasureFieldList),
}) {}
export class FilledMapFieldWells extends S.Class<FilledMapFieldWells>(
  "FilledMapFieldWells",
)({
  FilledMapAggregatedFieldWells: S.optional(FilledMapAggregatedFieldWells),
}) {}
export class FilledMapSortConfiguration extends S.Class<FilledMapSortConfiguration>(
  "FilledMapSortConfiguration",
)({ CategorySort: S.optional(FieldSortOptionsList) }) {}
export class FilledMapConfiguration extends S.Class<FilledMapConfiguration>(
  "FilledMapConfiguration",
)({
  FieldWells: S.optional(FilledMapFieldWells),
  SortConfiguration: S.optional(FilledMapSortConfiguration),
  Legend: S.optional(LegendOptions),
  Tooltip: S.optional(TooltipOptions),
  WindowOptions: S.optional(GeospatialWindowOptions),
  MapStyleOptions: S.optional(GeospatialMapStyleOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class ShapeConditionalFormat extends S.Class<ShapeConditionalFormat>(
  "ShapeConditionalFormat",
)({ BackgroundColor: ConditionalFormattingColor }) {}
export class FilledMapShapeConditionalFormatting extends S.Class<FilledMapShapeConditionalFormatting>(
  "FilledMapShapeConditionalFormatting",
)({ FieldId: S.String, Format: S.optional(ShapeConditionalFormat) }) {}
export class FilledMapConditionalFormattingOption extends S.Class<FilledMapConditionalFormattingOption>(
  "FilledMapConditionalFormattingOption",
)({ Shape: FilledMapShapeConditionalFormatting }) {}
export const FilledMapConditionalFormattingOptionList = S.Array(
  FilledMapConditionalFormattingOption,
);
export class FilledMapConditionalFormatting extends S.Class<FilledMapConditionalFormatting>(
  "FilledMapConditionalFormatting",
)({ ConditionalFormattingOptions: FilledMapConditionalFormattingOptionList }) {}
export class FilledMapVisual extends S.Class<FilledMapVisual>(
  "FilledMapVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(FilledMapConfiguration),
  ConditionalFormatting: S.optional(FilledMapConditionalFormatting),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
  GeocodingPreferences: S.optional(GeocodePreferenceList),
}) {}
export class GeospatialStaticFileSource extends S.Class<GeospatialStaticFileSource>(
  "GeospatialStaticFileSource",
)({ StaticFileId: S.String }) {}
export class GeospatialDataSourceItem extends S.Class<GeospatialDataSourceItem>(
  "GeospatialDataSourceItem",
)({ StaticFileDataSource: S.optional(GeospatialStaticFileSource) }) {}
export class GeospatialSolidColor extends S.Class<GeospatialSolidColor>(
  "GeospatialSolidColor",
)({ Color: S.String, State: S.optional(S.String) }) {}
export class GeospatialGradientStepColor extends S.Class<GeospatialGradientStepColor>(
  "GeospatialGradientStepColor",
)({ Color: S.String, DataValue: S.Number }) {}
export const GeospatialGradientStepColorList = S.Array(
  GeospatialGradientStepColor,
);
export class GeospatialNullSymbolStyle extends S.Class<GeospatialNullSymbolStyle>(
  "GeospatialNullSymbolStyle",
)({
  FillColor: S.optional(S.String),
  StrokeColor: S.optional(S.String),
  StrokeWidth: S.optional(S.Number),
}) {}
export class GeospatialNullDataSettings extends S.Class<GeospatialNullDataSettings>(
  "GeospatialNullDataSettings",
)({ SymbolStyle: GeospatialNullSymbolStyle }) {}
export class GeospatialGradientColor extends S.Class<GeospatialGradientColor>(
  "GeospatialGradientColor",
)({
  StepColors: GeospatialGradientStepColorList,
  NullDataVisibility: S.optional(S.String),
  NullDataSettings: S.optional(GeospatialNullDataSettings),
  DefaultOpacity: S.optional(S.Number),
}) {}
export class GeospatialCategoricalDataColor extends S.Class<GeospatialCategoricalDataColor>(
  "GeospatialCategoricalDataColor",
)({ Color: S.String, DataValue: S.String }) {}
export const GeospatialCategoricalDataColorList = S.Array(
  GeospatialCategoricalDataColor,
);
export class GeospatialCategoricalColor extends S.Class<GeospatialCategoricalColor>(
  "GeospatialCategoricalColor",
)({
  CategoryDataColors: GeospatialCategoricalDataColorList,
  NullDataVisibility: S.optional(S.String),
  NullDataSettings: S.optional(GeospatialNullDataSettings),
  DefaultOpacity: S.optional(S.Number),
}) {}
export class GeospatialColor extends S.Class<GeospatialColor>(
  "GeospatialColor",
)({
  Solid: S.optional(GeospatialSolidColor),
  Gradient: S.optional(GeospatialGradientColor),
  Categorical: S.optional(GeospatialCategoricalColor),
}) {}
export class GeospatialLineWidth extends S.Class<GeospatialLineWidth>(
  "GeospatialLineWidth",
)({ LineWidth: S.optional(S.Number) }) {}
export class GeospatialCircleRadius extends S.Class<GeospatialCircleRadius>(
  "GeospatialCircleRadius",
)({ Radius: S.optional(S.Number) }) {}
export class GeospatialCircleSymbolStyle extends S.Class<GeospatialCircleSymbolStyle>(
  "GeospatialCircleSymbolStyle",
)({
  FillColor: S.optional(GeospatialColor),
  StrokeColor: S.optional(GeospatialColor),
  StrokeWidth: S.optional(GeospatialLineWidth),
  CircleRadius: S.optional(GeospatialCircleRadius),
}) {}
export class GeospatialPointStyle extends S.Class<GeospatialPointStyle>(
  "GeospatialPointStyle",
)({ CircleSymbolStyle: S.optional(GeospatialCircleSymbolStyle) }) {}
export class GeospatialPointLayer extends S.Class<GeospatialPointLayer>(
  "GeospatialPointLayer",
)({ Style: GeospatialPointStyle }) {}
export class GeospatialLineSymbolStyle extends S.Class<GeospatialLineSymbolStyle>(
  "GeospatialLineSymbolStyle",
)({
  FillColor: S.optional(GeospatialColor),
  LineWidth: S.optional(GeospatialLineWidth),
}) {}
export class GeospatialLineStyle extends S.Class<GeospatialLineStyle>(
  "GeospatialLineStyle",
)({ LineSymbolStyle: S.optional(GeospatialLineSymbolStyle) }) {}
export class GeospatialLineLayer extends S.Class<GeospatialLineLayer>(
  "GeospatialLineLayer",
)({ Style: GeospatialLineStyle }) {}
export class GeospatialPolygonSymbolStyle extends S.Class<GeospatialPolygonSymbolStyle>(
  "GeospatialPolygonSymbolStyle",
)({
  FillColor: S.optional(GeospatialColor),
  StrokeColor: S.optional(GeospatialColor),
  StrokeWidth: S.optional(GeospatialLineWidth),
}) {}
export class GeospatialPolygonStyle extends S.Class<GeospatialPolygonStyle>(
  "GeospatialPolygonStyle",
)({ PolygonSymbolStyle: S.optional(GeospatialPolygonSymbolStyle) }) {}
export class GeospatialPolygonLayer extends S.Class<GeospatialPolygonLayer>(
  "GeospatialPolygonLayer",
)({ Style: GeospatialPolygonStyle }) {}
export class GeospatialLayerDefinition extends S.Class<GeospatialLayerDefinition>(
  "GeospatialLayerDefinition",
)({
  PointLayer: S.optional(GeospatialPointLayer),
  LineLayer: S.optional(GeospatialLineLayer),
  PolygonLayer: S.optional(GeospatialPolygonLayer),
}) {}
export const GeospatialLayerDimensionFieldList = S.Array(DimensionField);
export const GeospatialLayerMeasureFieldList = S.Array(MeasureField);
export class GeospatialLayerColorField extends S.Class<GeospatialLayerColorField>(
  "GeospatialLayerColorField",
)({
  ColorDimensionsFields: S.optional(GeospatialLayerDimensionFieldList),
  ColorValuesFields: S.optional(GeospatialLayerMeasureFieldList),
}) {}
export class GeospatialLayerJoinDefinition extends S.Class<GeospatialLayerJoinDefinition>(
  "GeospatialLayerJoinDefinition",
)({
  ShapeKeyField: S.optional(S.String),
  DatasetKeyField: S.optional(UnaggregatedField),
  ColorField: S.optional(GeospatialLayerColorField),
}) {}
export class LayerCustomActionOperation extends S.Class<LayerCustomActionOperation>(
  "LayerCustomActionOperation",
)({
  FilterOperation: S.optional(CustomActionFilterOperation),
  NavigationOperation: S.optional(CustomActionNavigationOperation),
  URLOperation: S.optional(CustomActionURLOperation),
  SetParametersOperation: S.optional(CustomActionSetParametersOperation),
}) {}
export const LayerCustomActionOperationList = S.Array(
  LayerCustomActionOperation,
);
export class LayerCustomAction extends S.Class<LayerCustomAction>(
  "LayerCustomAction",
)({
  CustomActionId: S.String,
  Name: S.String,
  Status: S.optional(S.String),
  Trigger: S.String,
  ActionOperations: LayerCustomActionOperationList,
}) {}
export const LayerCustomActionList = S.Array(LayerCustomAction);
export class GeospatialLayerItem extends S.Class<GeospatialLayerItem>(
  "GeospatialLayerItem",
)({
  LayerId: S.String,
  LayerType: S.optional(S.String),
  DataSource: S.optional(GeospatialDataSourceItem),
  Label: S.optional(S.String),
  Visibility: S.optional(S.String),
  LayerDefinition: S.optional(GeospatialLayerDefinition),
  Tooltip: S.optional(TooltipOptions),
  JoinDefinition: S.optional(GeospatialLayerJoinDefinition),
  Actions: S.optional(LayerCustomActionList),
}) {}
export const GeospatialMapLayerList = S.Array(GeospatialLayerItem);
export class GeospatialMapState extends S.Class<GeospatialMapState>(
  "GeospatialMapState",
)({
  Bounds: S.optional(GeospatialCoordinateBounds),
  MapNavigation: S.optional(S.String),
}) {}
export class GeospatialMapStyle extends S.Class<GeospatialMapStyle>(
  "GeospatialMapStyle",
)({
  BaseMapStyle: S.optional(S.String),
  BackgroundColor: S.optional(S.String),
  BaseMapVisibility: S.optional(S.String),
}) {}
export class GeospatialLayerMapConfiguration extends S.Class<GeospatialLayerMapConfiguration>(
  "GeospatialLayerMapConfiguration",
)({
  Legend: S.optional(LegendOptions),
  MapLayers: S.optional(GeospatialMapLayerList),
  MapState: S.optional(GeospatialMapState),
  MapStyle: S.optional(GeospatialMapStyle),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class LayerMapVisual extends S.Class<LayerMapVisual>("LayerMapVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(GeospatialLayerMapConfiguration),
  DataSetIdentifier: S.String,
  VisualContentAltText: S.optional(S.String),
}) {}
export const FunnelChartDimensionFieldList = S.Array(DimensionField);
export const FunnelChartMeasureFieldList = S.Array(MeasureField);
export class FunnelChartAggregatedFieldWells extends S.Class<FunnelChartAggregatedFieldWells>(
  "FunnelChartAggregatedFieldWells",
)({
  Category: S.optional(FunnelChartDimensionFieldList),
  Values: S.optional(FunnelChartMeasureFieldList),
}) {}
export class FunnelChartFieldWells extends S.Class<FunnelChartFieldWells>(
  "FunnelChartFieldWells",
)({
  FunnelChartAggregatedFieldWells: S.optional(FunnelChartAggregatedFieldWells),
}) {}
export class FunnelChartSortConfiguration extends S.Class<FunnelChartSortConfiguration>(
  "FunnelChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
}) {}
export class FunnelChartDataLabelOptions extends S.Class<FunnelChartDataLabelOptions>(
  "FunnelChartDataLabelOptions",
)({
  Visibility: S.optional(S.String),
  CategoryLabelVisibility: S.optional(S.String),
  MeasureLabelVisibility: S.optional(S.String),
  Position: S.optional(S.String),
  LabelFontConfiguration: S.optional(FontConfiguration),
  LabelColor: S.optional(S.String),
  MeasureDataLabelStyle: S.optional(S.String),
}) {}
export class FunnelChartConfiguration extends S.Class<FunnelChartConfiguration>(
  "FunnelChartConfiguration",
)({
  FieldWells: S.optional(FunnelChartFieldWells),
  SortConfiguration: S.optional(FunnelChartSortConfiguration),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  ValueLabelOptions: S.optional(ChartAxisLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  DataLabelOptions: S.optional(FunnelChartDataLabelOptions),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class FunnelChartVisual extends S.Class<FunnelChartVisual>(
  "FunnelChartVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(FunnelChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class ScatterPlotCategoricallyAggregatedFieldWells extends S.Class<ScatterPlotCategoricallyAggregatedFieldWells>(
  "ScatterPlotCategoricallyAggregatedFieldWells",
)({
  XAxis: S.optional(MeasureFieldList),
  YAxis: S.optional(MeasureFieldList),
  Category: S.optional(DimensionFieldList),
  Size: S.optional(MeasureFieldList),
  Label: S.optional(DimensionFieldList),
}) {}
export class ScatterPlotUnaggregatedFieldWells extends S.Class<ScatterPlotUnaggregatedFieldWells>(
  "ScatterPlotUnaggregatedFieldWells",
)({
  XAxis: S.optional(DimensionFieldList),
  YAxis: S.optional(DimensionFieldList),
  Size: S.optional(MeasureFieldList),
  Category: S.optional(DimensionFieldList),
  Label: S.optional(DimensionFieldList),
}) {}
export class ScatterPlotFieldWells extends S.Class<ScatterPlotFieldWells>(
  "ScatterPlotFieldWells",
)({
  ScatterPlotCategoricallyAggregatedFieldWells: S.optional(
    ScatterPlotCategoricallyAggregatedFieldWells,
  ),
  ScatterPlotUnaggregatedFieldWells: S.optional(
    ScatterPlotUnaggregatedFieldWells,
  ),
}) {}
export class ScatterPlotSortConfiguration extends S.Class<ScatterPlotSortConfiguration>(
  "ScatterPlotSortConfiguration",
)({ ScatterPlotLimitConfiguration: S.optional(ItemsLimitConfiguration) }) {}
export class ScatterPlotConfiguration extends S.Class<ScatterPlotConfiguration>(
  "ScatterPlotConfiguration",
)({
  FieldWells: S.optional(ScatterPlotFieldWells),
  SortConfiguration: S.optional(ScatterPlotSortConfiguration),
  XAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  XAxisDisplayOptions: S.optional(AxisDisplayOptions),
  YAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  YAxisDisplayOptions: S.optional(AxisDisplayOptions),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class ScatterPlotVisual extends S.Class<ScatterPlotVisual>(
  "ScatterPlotVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(ScatterPlotConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class ComboChartAggregatedFieldWells extends S.Class<ComboChartAggregatedFieldWells>(
  "ComboChartAggregatedFieldWells",
)({
  Category: S.optional(DimensionFieldList),
  BarValues: S.optional(MeasureFieldList),
  Colors: S.optional(DimensionFieldList),
  LineValues: S.optional(MeasureFieldList),
}) {}
export class ComboChartFieldWells extends S.Class<ComboChartFieldWells>(
  "ComboChartFieldWells",
)({
  ComboChartAggregatedFieldWells: S.optional(ComboChartAggregatedFieldWells),
}) {}
export class ComboChartSortConfiguration extends S.Class<ComboChartSortConfiguration>(
  "ComboChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
  ColorSort: S.optional(FieldSortOptionsList),
  ColorItemsLimit: S.optional(ItemsLimitConfiguration),
}) {}
export class ComboChartDefaultSeriesSettings extends S.Class<ComboChartDefaultSeriesSettings>(
  "ComboChartDefaultSeriesSettings",
)({
  LineStyleSettings: S.optional(LineChartLineStyleSettings),
  MarkerStyleSettings: S.optional(LineChartMarkerStyleSettings),
  DecalSettings: S.optional(DecalSettings),
  BorderSettings: S.optional(BorderSettings),
}) {}
export class ComboChartSeriesSettings extends S.Class<ComboChartSeriesSettings>(
  "ComboChartSeriesSettings",
)({
  LineStyleSettings: S.optional(LineChartLineStyleSettings),
  MarkerStyleSettings: S.optional(LineChartMarkerStyleSettings),
  DecalSettings: S.optional(DecalSettings),
  BorderSettings: S.optional(BorderSettings),
}) {}
export class FieldComboSeriesItem extends S.Class<FieldComboSeriesItem>(
  "FieldComboSeriesItem",
)({ FieldId: S.String, Settings: S.optional(ComboChartSeriesSettings) }) {}
export class DataFieldComboSeriesItem extends S.Class<DataFieldComboSeriesItem>(
  "DataFieldComboSeriesItem",
)({
  FieldId: S.String,
  FieldValue: S.optional(S.String),
  Settings: S.optional(ComboChartSeriesSettings),
}) {}
export class ComboSeriesItem extends S.Class<ComboSeriesItem>(
  "ComboSeriesItem",
)({
  FieldComboSeriesItem: S.optional(FieldComboSeriesItem),
  DataFieldComboSeriesItem: S.optional(DataFieldComboSeriesItem),
}) {}
export const ComboSeriesItemList = S.Array(ComboSeriesItem);
export class ComboChartConfiguration extends S.Class<ComboChartConfiguration>(
  "ComboChartConfiguration",
)({
  FieldWells: S.optional(ComboChartFieldWells),
  SortConfiguration: S.optional(ComboChartSortConfiguration),
  BarsArrangement: S.optional(S.String),
  CategoryAxis: S.optional(AxisDisplayOptions),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  PrimaryYAxisDisplayOptions: S.optional(AxisDisplayOptions),
  PrimaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  SecondaryYAxisDisplayOptions: S.optional(AxisDisplayOptions),
  SecondaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  SingleAxisOptions: S.optional(SingleAxisOptions),
  ColorLabelOptions: S.optional(ChartAxisLabelOptions),
  DefaultSeriesSettings: S.optional(ComboChartDefaultSeriesSettings),
  Series: S.optional(ComboSeriesItemList),
  Legend: S.optional(LegendOptions),
  BarDataLabels: S.optional(DataLabelOptions),
  LineDataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  ReferenceLines: S.optional(ReferenceLineList),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class ComboChartVisual extends S.Class<ComboChartVisual>(
  "ComboChartVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(ComboChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const BoxPlotDimensionFieldList = S.Array(DimensionField);
export const BoxPlotMeasureFieldList = S.Array(MeasureField);
export class BoxPlotAggregatedFieldWells extends S.Class<BoxPlotAggregatedFieldWells>(
  "BoxPlotAggregatedFieldWells",
)({
  GroupBy: S.optional(BoxPlotDimensionFieldList),
  Values: S.optional(BoxPlotMeasureFieldList),
}) {}
export class BoxPlotFieldWells extends S.Class<BoxPlotFieldWells>(
  "BoxPlotFieldWells",
)({ BoxPlotAggregatedFieldWells: S.optional(BoxPlotAggregatedFieldWells) }) {}
export class BoxPlotSortConfiguration extends S.Class<BoxPlotSortConfiguration>(
  "BoxPlotSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  PaginationConfiguration: S.optional(PaginationConfiguration),
}) {}
export class BoxPlotStyleOptions extends S.Class<BoxPlotStyleOptions>(
  "BoxPlotStyleOptions",
)({ FillStyle: S.optional(S.String) }) {}
export class BoxPlotOptions extends S.Class<BoxPlotOptions>("BoxPlotOptions")({
  StyleOptions: S.optional(BoxPlotStyleOptions),
  OutlierVisibility: S.optional(S.String),
  AllDataPointsVisibility: S.optional(S.String),
}) {}
export class BoxPlotChartConfiguration extends S.Class<BoxPlotChartConfiguration>(
  "BoxPlotChartConfiguration",
)({
  FieldWells: S.optional(BoxPlotFieldWells),
  SortConfiguration: S.optional(BoxPlotSortConfiguration),
  BoxPlotOptions: S.optional(BoxPlotOptions),
  CategoryAxis: S.optional(AxisDisplayOptions),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  PrimaryYAxisDisplayOptions: S.optional(AxisDisplayOptions),
  PrimaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  Legend: S.optional(LegendOptions),
  Tooltip: S.optional(TooltipOptions),
  ReferenceLines: S.optional(ReferenceLineList),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class BoxPlotVisual extends S.Class<BoxPlotVisual>("BoxPlotVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(BoxPlotChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class WaterfallChartAggregatedFieldWells extends S.Class<WaterfallChartAggregatedFieldWells>(
  "WaterfallChartAggregatedFieldWells",
)({
  Categories: S.optional(DimensionFieldList),
  Values: S.optional(MeasureFieldList),
  Breakdowns: S.optional(DimensionFieldList),
}) {}
export class WaterfallChartFieldWells extends S.Class<WaterfallChartFieldWells>(
  "WaterfallChartFieldWells",
)({
  WaterfallChartAggregatedFieldWells: S.optional(
    WaterfallChartAggregatedFieldWells,
  ),
}) {}
export class WaterfallChartSortConfiguration extends S.Class<WaterfallChartSortConfiguration>(
  "WaterfallChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  BreakdownItemsLimit: S.optional(ItemsLimitConfiguration),
}) {}
export class WaterfallChartOptions extends S.Class<WaterfallChartOptions>(
  "WaterfallChartOptions",
)({ TotalBarLabel: S.optional(S.String) }) {}
export class WaterfallChartGroupColorConfiguration extends S.Class<WaterfallChartGroupColorConfiguration>(
  "WaterfallChartGroupColorConfiguration",
)({
  PositiveBarColor: S.optional(S.String),
  NegativeBarColor: S.optional(S.String),
  TotalBarColor: S.optional(S.String),
}) {}
export class WaterfallChartColorConfiguration extends S.Class<WaterfallChartColorConfiguration>(
  "WaterfallChartColorConfiguration",
)({
  GroupColorConfiguration: S.optional(WaterfallChartGroupColorConfiguration),
}) {}
export class WaterfallChartConfiguration extends S.Class<WaterfallChartConfiguration>(
  "WaterfallChartConfiguration",
)({
  FieldWells: S.optional(WaterfallChartFieldWells),
  SortConfiguration: S.optional(WaterfallChartSortConfiguration),
  WaterfallChartOptions: S.optional(WaterfallChartOptions),
  CategoryAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  CategoryAxisDisplayOptions: S.optional(AxisDisplayOptions),
  PrimaryYAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  PrimaryYAxisDisplayOptions: S.optional(AxisDisplayOptions),
  Legend: S.optional(LegendOptions),
  DataLabels: S.optional(DataLabelOptions),
  VisualPalette: S.optional(VisualPalette),
  ColorConfiguration: S.optional(WaterfallChartColorConfiguration),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class WaterfallVisual extends S.Class<WaterfallVisual>(
  "WaterfallVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(WaterfallChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const HistogramMeasureFieldList = S.Array(MeasureField);
export class HistogramAggregatedFieldWells extends S.Class<HistogramAggregatedFieldWells>(
  "HistogramAggregatedFieldWells",
)({ Values: S.optional(HistogramMeasureFieldList) }) {}
export class HistogramFieldWells extends S.Class<HistogramFieldWells>(
  "HistogramFieldWells",
)({
  HistogramAggregatedFieldWells: S.optional(HistogramAggregatedFieldWells),
}) {}
export class BinCountOptions extends S.Class<BinCountOptions>(
  "BinCountOptions",
)({ Value: S.optional(S.Number) }) {}
export class BinWidthOptions extends S.Class<BinWidthOptions>(
  "BinWidthOptions",
)({ Value: S.optional(S.Number), BinCountLimit: S.optional(S.Number) }) {}
export class HistogramBinOptions extends S.Class<HistogramBinOptions>(
  "HistogramBinOptions",
)({
  SelectedBinType: S.optional(S.String),
  BinCount: S.optional(BinCountOptions),
  BinWidth: S.optional(BinWidthOptions),
  StartValue: S.optional(S.Number),
}) {}
export class HistogramConfiguration extends S.Class<HistogramConfiguration>(
  "HistogramConfiguration",
)({
  FieldWells: S.optional(HistogramFieldWells),
  XAxisDisplayOptions: S.optional(AxisDisplayOptions),
  XAxisLabelOptions: S.optional(ChartAxisLabelOptions),
  YAxisDisplayOptions: S.optional(AxisDisplayOptions),
  BinOptions: S.optional(HistogramBinOptions),
  DataLabels: S.optional(DataLabelOptions),
  Tooltip: S.optional(TooltipOptions),
  VisualPalette: S.optional(VisualPalette),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class HistogramVisual extends S.Class<HistogramVisual>(
  "HistogramVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(HistogramConfiguration),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const WordCloudDimensionFieldList = S.Array(DimensionField);
export const WordCloudMeasureFieldList = S.Array(MeasureField);
export class WordCloudAggregatedFieldWells extends S.Class<WordCloudAggregatedFieldWells>(
  "WordCloudAggregatedFieldWells",
)({
  GroupBy: S.optional(WordCloudDimensionFieldList),
  Size: S.optional(WordCloudMeasureFieldList),
}) {}
export class WordCloudFieldWells extends S.Class<WordCloudFieldWells>(
  "WordCloudFieldWells",
)({
  WordCloudAggregatedFieldWells: S.optional(WordCloudAggregatedFieldWells),
}) {}
export class WordCloudSortConfiguration extends S.Class<WordCloudSortConfiguration>(
  "WordCloudSortConfiguration",
)({
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
  CategorySort: S.optional(FieldSortOptionsList),
}) {}
export class WordCloudOptions extends S.Class<WordCloudOptions>(
  "WordCloudOptions",
)({
  WordOrientation: S.optional(S.String),
  WordScaling: S.optional(S.String),
  CloudLayout: S.optional(S.String),
  WordCasing: S.optional(S.String),
  WordPadding: S.optional(S.String),
  MaximumStringLength: S.optional(S.Number),
}) {}
export class WordCloudChartConfiguration extends S.Class<WordCloudChartConfiguration>(
  "WordCloudChartConfiguration",
)({
  FieldWells: S.optional(WordCloudFieldWells),
  SortConfiguration: S.optional(WordCloudSortConfiguration),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  WordCloudOptions: S.optional(WordCloudOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class WordCloudVisual extends S.Class<WordCloudVisual>(
  "WordCloudVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(WordCloudChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class TopBottomRankedComputation extends S.Class<TopBottomRankedComputation>(
  "TopBottomRankedComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Category: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  ResultSize: S.optional(S.Number),
  Type: S.String,
}) {}
export class TopBottomMoversComputation extends S.Class<TopBottomMoversComputation>(
  "TopBottomMoversComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Category: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  MoverSize: S.optional(S.Number),
  SortOrder: S.optional(S.String),
  Type: S.String,
}) {}
export class TotalAggregationComputation extends S.Class<TotalAggregationComputation>(
  "TotalAggregationComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Value: S.optional(MeasureField),
}) {}
export class MaximumMinimumComputation extends S.Class<MaximumMinimumComputation>(
  "MaximumMinimumComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  Type: S.String,
}) {}
export class MetricComparisonComputation extends S.Class<MetricComparisonComputation>(
  "MetricComparisonComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  FromValue: S.optional(MeasureField),
  TargetValue: S.optional(MeasureField),
}) {}
export class PeriodOverPeriodComputation extends S.Class<PeriodOverPeriodComputation>(
  "PeriodOverPeriodComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Value: S.optional(MeasureField),
}) {}
export class PeriodToDateComputation extends S.Class<PeriodToDateComputation>(
  "PeriodToDateComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  PeriodTimeGranularity: S.optional(S.String),
}) {}
export class GrowthRateComputation extends S.Class<GrowthRateComputation>(
  "GrowthRateComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  PeriodSize: S.optional(S.Number),
}) {}
export class UniqueValuesComputation extends S.Class<UniqueValuesComputation>(
  "UniqueValuesComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Category: S.optional(DimensionField),
}) {}
export class ForecastComputation extends S.Class<ForecastComputation>(
  "ForecastComputation",
)({
  ComputationId: S.String,
  Name: S.optional(S.String),
  Time: S.optional(DimensionField),
  Value: S.optional(MeasureField),
  PeriodsForward: S.optional(S.Number),
  PeriodsBackward: S.optional(S.Number),
  UpperBoundary: S.optional(S.Number),
  LowerBoundary: S.optional(S.Number),
  PredictionInterval: S.optional(S.Number),
  Seasonality: S.optional(S.String),
  CustomSeasonalityValue: S.optional(S.Number),
}) {}
export class Computation extends S.Class<Computation>("Computation")({
  TopBottomRanked: S.optional(TopBottomRankedComputation),
  TopBottomMovers: S.optional(TopBottomMoversComputation),
  TotalAggregation: S.optional(TotalAggregationComputation),
  MaximumMinimum: S.optional(MaximumMinimumComputation),
  MetricComparison: S.optional(MetricComparisonComputation),
  PeriodOverPeriod: S.optional(PeriodOverPeriodComputation),
  PeriodToDate: S.optional(PeriodToDateComputation),
  GrowthRate: S.optional(GrowthRateComputation),
  UniqueValues: S.optional(UniqueValuesComputation),
  Forecast: S.optional(ForecastComputation),
}) {}
export const ComputationList = S.Array(Computation);
export class CustomNarrativeOptions extends S.Class<CustomNarrativeOptions>(
  "CustomNarrativeOptions",
)({ Narrative: S.String }) {}
export class InsightConfiguration extends S.Class<InsightConfiguration>(
  "InsightConfiguration",
)({
  Computations: S.optional(ComputationList),
  CustomNarrative: S.optional(CustomNarrativeOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class InsightVisual extends S.Class<InsightVisual>("InsightVisual")({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  InsightConfiguration: S.optional(InsightConfiguration),
  Actions: S.optional(VisualCustomActionList),
  DataSetIdentifier: S.String,
  VisualContentAltText: S.optional(S.String),
}) {}
export class SankeyDiagramAggregatedFieldWells extends S.Class<SankeyDiagramAggregatedFieldWells>(
  "SankeyDiagramAggregatedFieldWells",
)({
  Source: S.optional(DimensionFieldList),
  Destination: S.optional(DimensionFieldList),
  Weight: S.optional(MeasureFieldList),
}) {}
export class SankeyDiagramFieldWells extends S.Class<SankeyDiagramFieldWells>(
  "SankeyDiagramFieldWells",
)({
  SankeyDiagramAggregatedFieldWells: S.optional(
    SankeyDiagramAggregatedFieldWells,
  ),
}) {}
export class SankeyDiagramSortConfiguration extends S.Class<SankeyDiagramSortConfiguration>(
  "SankeyDiagramSortConfiguration",
)({
  WeightSort: S.optional(FieldSortOptionsList),
  SourceItemsLimit: S.optional(ItemsLimitConfiguration),
  DestinationItemsLimit: S.optional(ItemsLimitConfiguration),
}) {}
export class SankeyDiagramChartConfiguration extends S.Class<SankeyDiagramChartConfiguration>(
  "SankeyDiagramChartConfiguration",
)({
  FieldWells: S.optional(SankeyDiagramFieldWells),
  SortConfiguration: S.optional(SankeyDiagramSortConfiguration),
  DataLabels: S.optional(DataLabelOptions),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class SankeyDiagramVisual extends S.Class<SankeyDiagramVisual>(
  "SankeyDiagramVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(SankeyDiagramChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class CustomContentConfiguration extends S.Class<CustomContentConfiguration>(
  "CustomContentConfiguration",
)({
  ContentUrl: S.optional(S.String),
  ContentType: S.optional(S.String),
  ImageScaling: S.optional(S.String),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class CustomContentVisual extends S.Class<CustomContentVisual>(
  "CustomContentVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(CustomContentConfiguration),
  Actions: S.optional(VisualCustomActionList),
  DataSetIdentifier: S.String,
  VisualContentAltText: S.optional(S.String),
}) {}
export class EmptyVisual extends S.Class<EmptyVisual>("EmptyVisual")({
  VisualId: S.String,
  DataSetIdentifier: S.String,
  Actions: S.optional(VisualCustomActionList),
}) {}
export const RadarChartCategoryFieldList = S.Array(DimensionField);
export const RadarChartColorFieldList = S.Array(DimensionField);
export const RadarChartValuesFieldList = S.Array(MeasureField);
export class RadarChartAggregatedFieldWells extends S.Class<RadarChartAggregatedFieldWells>(
  "RadarChartAggregatedFieldWells",
)({
  Category: S.optional(RadarChartCategoryFieldList),
  Color: S.optional(RadarChartColorFieldList),
  Values: S.optional(RadarChartValuesFieldList),
}) {}
export class RadarChartFieldWells extends S.Class<RadarChartFieldWells>(
  "RadarChartFieldWells",
)({
  RadarChartAggregatedFieldWells: S.optional(RadarChartAggregatedFieldWells),
}) {}
export class RadarChartSortConfiguration extends S.Class<RadarChartSortConfiguration>(
  "RadarChartSortConfiguration",
)({
  CategorySort: S.optional(FieldSortOptionsList),
  CategoryItemsLimit: S.optional(ItemsLimitConfiguration),
  ColorSort: S.optional(FieldSortOptionsList),
  ColorItemsLimit: S.optional(ItemsLimitConfiguration),
}) {}
export class RadarChartAreaStyleSettings extends S.Class<RadarChartAreaStyleSettings>(
  "RadarChartAreaStyleSettings",
)({ Visibility: S.optional(S.String) }) {}
export class RadarChartSeriesSettings extends S.Class<RadarChartSeriesSettings>(
  "RadarChartSeriesSettings",
)({ AreaStyleSettings: S.optional(RadarChartAreaStyleSettings) }) {}
export class RadarChartConfiguration extends S.Class<RadarChartConfiguration>(
  "RadarChartConfiguration",
)({
  FieldWells: S.optional(RadarChartFieldWells),
  SortConfiguration: S.optional(RadarChartSortConfiguration),
  Shape: S.optional(S.String),
  BaseSeriesSettings: S.optional(RadarChartSeriesSettings),
  StartAngle: S.optional(S.Number),
  VisualPalette: S.optional(VisualPalette),
  AlternateBandColorsVisibility: S.optional(S.String),
  AlternateBandEvenColor: S.optional(S.String),
  AlternateBandOddColor: S.optional(S.String),
  CategoryAxis: S.optional(AxisDisplayOptions),
  CategoryLabelOptions: S.optional(ChartAxisLabelOptions),
  ColorAxis: S.optional(AxisDisplayOptions),
  ColorLabelOptions: S.optional(ChartAxisLabelOptions),
  Legend: S.optional(LegendOptions),
  AxesRangeScale: S.optional(S.String),
  Interactions: S.optional(VisualInteractionOptions),
}) {}
export class RadarChartVisual extends S.Class<RadarChartVisual>(
  "RadarChartVisual",
)({
  VisualId: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(RadarChartConfiguration),
  Actions: S.optional(VisualCustomActionList),
  ColumnHierarchies: S.optional(ColumnHierarchyList),
  VisualContentAltText: S.optional(S.String),
}) {}
export const UnaggregatedFieldList = S.Array(UnaggregatedField);
export class PluginVisualFieldWell extends S.Class<PluginVisualFieldWell>(
  "PluginVisualFieldWell",
)({
  AxisName: S.optional(S.String),
  Dimensions: S.optional(DimensionFieldList),
  Measures: S.optional(MeasureFieldList),
  Unaggregated: S.optional(UnaggregatedFieldList),
}) {}
export const PluginVisualFieldWells = S.Array(PluginVisualFieldWell);
export class PluginVisualProperty extends S.Class<PluginVisualProperty>(
  "PluginVisualProperty",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const PluginVisualPropertiesList = S.Array(PluginVisualProperty);
export class PluginVisualOptions extends S.Class<PluginVisualOptions>(
  "PluginVisualOptions",
)({ VisualProperties: S.optional(PluginVisualPropertiesList) }) {}
export class PluginVisualItemsLimitConfiguration extends S.Class<PluginVisualItemsLimitConfiguration>(
  "PluginVisualItemsLimitConfiguration",
)({ ItemsLimit: S.optional(S.Number) }) {}
export class PluginVisualTableQuerySort extends S.Class<PluginVisualTableQuerySort>(
  "PluginVisualTableQuerySort",
)({
  RowSort: S.optional(RowSortList),
  ItemsLimitConfiguration: S.optional(PluginVisualItemsLimitConfiguration),
}) {}
export class PluginVisualSortConfiguration extends S.Class<PluginVisualSortConfiguration>(
  "PluginVisualSortConfiguration",
)({ PluginVisualTableQuerySort: S.optional(PluginVisualTableQuerySort) }) {}
export class PluginVisualConfiguration extends S.Class<PluginVisualConfiguration>(
  "PluginVisualConfiguration",
)({
  FieldWells: S.optional(PluginVisualFieldWells),
  VisualOptions: S.optional(PluginVisualOptions),
  SortConfiguration: S.optional(PluginVisualSortConfiguration),
}) {}
export class PluginVisual extends S.Class<PluginVisual>("PluginVisual")({
  VisualId: S.String,
  PluginArn: S.String,
  Title: S.optional(VisualTitleLabelOptions),
  Subtitle: S.optional(VisualSubtitleLabelOptions),
  ChartConfiguration: S.optional(PluginVisualConfiguration),
  Actions: S.optional(VisualCustomActionList),
  VisualContentAltText: S.optional(S.String),
}) {}
export class Visual extends S.Class<Visual>("Visual")({
  TableVisual: S.optional(TableVisual),
  PivotTableVisual: S.optional(PivotTableVisual),
  BarChartVisual: S.optional(BarChartVisual),
  KPIVisual: S.optional(KPIVisual),
  PieChartVisual: S.optional(PieChartVisual),
  GaugeChartVisual: S.optional(GaugeChartVisual),
  LineChartVisual: S.optional(LineChartVisual),
  HeatMapVisual: S.optional(HeatMapVisual),
  TreeMapVisual: S.optional(TreeMapVisual),
  GeospatialMapVisual: S.optional(GeospatialMapVisual),
  FilledMapVisual: S.optional(FilledMapVisual),
  LayerMapVisual: S.optional(LayerMapVisual),
  FunnelChartVisual: S.optional(FunnelChartVisual),
  ScatterPlotVisual: S.optional(ScatterPlotVisual),
  ComboChartVisual: S.optional(ComboChartVisual),
  BoxPlotVisual: S.optional(BoxPlotVisual),
  WaterfallVisual: S.optional(WaterfallVisual),
  HistogramVisual: S.optional(HistogramVisual),
  WordCloudVisual: S.optional(WordCloudVisual),
  InsightVisual: S.optional(InsightVisual),
  SankeyDiagramVisual: S.optional(SankeyDiagramVisual),
  CustomContentVisual: S.optional(CustomContentVisual),
  EmptyVisual: S.optional(EmptyVisual),
  RadarChartVisual: S.optional(RadarChartVisual),
  PluginVisual: S.optional(PluginVisual),
}) {}
export const VisualList = S.Array(Visual);
export class TextBoxMenuOption extends S.Class<TextBoxMenuOption>(
  "TextBoxMenuOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class TextBoxInteractionOptions extends S.Class<TextBoxInteractionOptions>(
  "TextBoxInteractionOptions",
)({ TextBoxMenuOption: S.optional(TextBoxMenuOption) }) {}
export class SheetTextBox extends S.Class<SheetTextBox>("SheetTextBox")({
  SheetTextBoxId: S.String,
  Content: S.optional(S.String),
  Interactions: S.optional(TextBoxInteractionOptions),
}) {}
export const SheetTextBoxList = S.Array(SheetTextBox);
export class SheetImageStaticFileSource extends S.Class<SheetImageStaticFileSource>(
  "SheetImageStaticFileSource",
)({ StaticFileId: S.String }) {}
export class SheetImageSource extends S.Class<SheetImageSource>(
  "SheetImageSource",
)({ SheetImageStaticFileSource: S.optional(SheetImageStaticFileSource) }) {}
export class SheetImageScalingConfiguration extends S.Class<SheetImageScalingConfiguration>(
  "SheetImageScalingConfiguration",
)({ ScalingType: S.optional(S.String) }) {}
export class SheetImageTooltipText extends S.Class<SheetImageTooltipText>(
  "SheetImageTooltipText",
)({ PlainText: S.optional(S.String) }) {}
export class SheetImageTooltipConfiguration extends S.Class<SheetImageTooltipConfiguration>(
  "SheetImageTooltipConfiguration",
)({
  TooltipText: S.optional(SheetImageTooltipText),
  Visibility: S.optional(S.String),
}) {}
export class ImageMenuOption extends S.Class<ImageMenuOption>(
  "ImageMenuOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class ImageInteractionOptions extends S.Class<ImageInteractionOptions>(
  "ImageInteractionOptions",
)({ ImageMenuOption: S.optional(ImageMenuOption) }) {}
export class ImageCustomActionOperation extends S.Class<ImageCustomActionOperation>(
  "ImageCustomActionOperation",
)({
  NavigationOperation: S.optional(CustomActionNavigationOperation),
  URLOperation: S.optional(CustomActionURLOperation),
  SetParametersOperation: S.optional(CustomActionSetParametersOperation),
}) {}
export const ImageCustomActionOperationList = S.Array(
  ImageCustomActionOperation,
);
export class ImageCustomAction extends S.Class<ImageCustomAction>(
  "ImageCustomAction",
)({
  CustomActionId: S.String,
  Name: S.String,
  Status: S.optional(S.String),
  Trigger: S.String,
  ActionOperations: ImageCustomActionOperationList,
}) {}
export const ImageCustomActionList = S.Array(ImageCustomAction);
export class SheetImage extends S.Class<SheetImage>("SheetImage")({
  SheetImageId: S.String,
  Source: SheetImageSource,
  Scaling: S.optional(SheetImageScalingConfiguration),
  Tooltip: S.optional(SheetImageTooltipConfiguration),
  ImageContentAltText: S.optional(S.String),
  Interactions: S.optional(ImageInteractionOptions),
  Actions: S.optional(ImageCustomActionList),
}) {}
export const SheetImageList = S.Array(SheetImage);
export class GridLayoutElementBorderStyle extends S.Class<GridLayoutElementBorderStyle>(
  "GridLayoutElementBorderStyle",
)({
  Visibility: S.optional(S.String),
  Color: S.optional(S.String),
  Width: S.optional(S.String),
}) {}
export class GridLayoutElementBackgroundStyle extends S.Class<GridLayoutElementBackgroundStyle>(
  "GridLayoutElementBackgroundStyle",
)({ Visibility: S.optional(S.String), Color: S.optional(S.String) }) {}
export class LoadingAnimation extends S.Class<LoadingAnimation>(
  "LoadingAnimation",
)({ Visibility: S.optional(S.String) }) {}
export class GridLayoutElement extends S.Class<GridLayoutElement>(
  "GridLayoutElement",
)({
  ElementId: S.String,
  ElementType: S.String,
  ColumnIndex: S.optional(S.Number),
  ColumnSpan: S.Number,
  RowIndex: S.optional(S.Number),
  RowSpan: S.Number,
  BorderStyle: S.optional(GridLayoutElementBorderStyle),
  SelectedBorderStyle: S.optional(GridLayoutElementBorderStyle),
  BackgroundStyle: S.optional(GridLayoutElementBackgroundStyle),
  LoadingAnimation: S.optional(LoadingAnimation),
  BorderRadius: S.optional(S.String),
  Padding: S.optional(S.String),
}) {}
export const GridLayoutElementList = S.Array(GridLayoutElement);
export class GridLayoutScreenCanvasSizeOptions extends S.Class<GridLayoutScreenCanvasSizeOptions>(
  "GridLayoutScreenCanvasSizeOptions",
)({ ResizeOption: S.String, OptimizedViewPortWidth: S.optional(S.String) }) {}
export class GridLayoutCanvasSizeOptions extends S.Class<GridLayoutCanvasSizeOptions>(
  "GridLayoutCanvasSizeOptions",
)({ ScreenCanvasSizeOptions: S.optional(GridLayoutScreenCanvasSizeOptions) }) {}
export class GridLayoutConfiguration extends S.Class<GridLayoutConfiguration>(
  "GridLayoutConfiguration",
)({
  Elements: GridLayoutElementList,
  CanvasSizeOptions: S.optional(GridLayoutCanvasSizeOptions),
}) {}
export class SheetElementConfigurationOverrides extends S.Class<SheetElementConfigurationOverrides>(
  "SheetElementConfigurationOverrides",
)({ Visibility: S.optional(S.String) }) {}
export class SheetElementRenderingRule extends S.Class<SheetElementRenderingRule>(
  "SheetElementRenderingRule",
)({
  Expression: S.String,
  ConfigurationOverrides: SheetElementConfigurationOverrides,
}) {}
export const SheetElementRenderingRuleList = S.Array(SheetElementRenderingRule);
export class FreeFormLayoutElementBorderStyle extends S.Class<FreeFormLayoutElementBorderStyle>(
  "FreeFormLayoutElementBorderStyle",
)({
  Visibility: S.optional(S.String),
  Color: S.optional(S.String),
  Width: S.optional(S.String),
}) {}
export class FreeFormLayoutElementBackgroundStyle extends S.Class<FreeFormLayoutElementBackgroundStyle>(
  "FreeFormLayoutElementBackgroundStyle",
)({ Visibility: S.optional(S.String), Color: S.optional(S.String) }) {}
export class FreeFormLayoutElement extends S.Class<FreeFormLayoutElement>(
  "FreeFormLayoutElement",
)({
  ElementId: S.String,
  ElementType: S.String,
  XAxisLocation: S.String,
  YAxisLocation: S.String,
  Width: S.String,
  Height: S.String,
  Visibility: S.optional(S.String),
  RenderingRules: S.optional(SheetElementRenderingRuleList),
  BorderStyle: S.optional(FreeFormLayoutElementBorderStyle),
  SelectedBorderStyle: S.optional(FreeFormLayoutElementBorderStyle),
  BackgroundStyle: S.optional(FreeFormLayoutElementBackgroundStyle),
  LoadingAnimation: S.optional(LoadingAnimation),
  BorderRadius: S.optional(S.String),
  Padding: S.optional(S.String),
}) {}
export const FreeFromLayoutElementList = S.Array(FreeFormLayoutElement);
export class FreeFormLayoutScreenCanvasSizeOptions extends S.Class<FreeFormLayoutScreenCanvasSizeOptions>(
  "FreeFormLayoutScreenCanvasSizeOptions",
)({ OptimizedViewPortWidth: S.String }) {}
export class FreeFormLayoutCanvasSizeOptions extends S.Class<FreeFormLayoutCanvasSizeOptions>(
  "FreeFormLayoutCanvasSizeOptions",
)({
  ScreenCanvasSizeOptions: S.optional(FreeFormLayoutScreenCanvasSizeOptions),
}) {}
export class FreeFormLayoutConfiguration extends S.Class<FreeFormLayoutConfiguration>(
  "FreeFormLayoutConfiguration",
)({
  Elements: FreeFromLayoutElementList,
  CanvasSizeOptions: S.optional(FreeFormLayoutCanvasSizeOptions),
}) {}
export class FreeFormSectionLayoutConfiguration extends S.Class<FreeFormSectionLayoutConfiguration>(
  "FreeFormSectionLayoutConfiguration",
)({ Elements: FreeFromLayoutElementList }) {}
export class SectionLayoutConfiguration extends S.Class<SectionLayoutConfiguration>(
  "SectionLayoutConfiguration",
)({ FreeFormLayout: FreeFormSectionLayoutConfiguration }) {}
export class Spacing extends S.Class<Spacing>("Spacing")({
  Top: S.optional(S.String),
  Bottom: S.optional(S.String),
  Left: S.optional(S.String),
  Right: S.optional(S.String),
}) {}
export class SectionStyle extends S.Class<SectionStyle>("SectionStyle")({
  Height: S.optional(S.String),
  Padding: S.optional(Spacing),
}) {}
export class HeaderFooterSectionConfiguration extends S.Class<HeaderFooterSectionConfiguration>(
  "HeaderFooterSectionConfiguration",
)({
  SectionId: S.String,
  Layout: SectionLayoutConfiguration,
  Style: S.optional(SectionStyle),
}) {}
export const HeaderFooterSectionConfigurationList = S.Array(
  HeaderFooterSectionConfiguration,
);
export class BodySectionContent extends S.Class<BodySectionContent>(
  "BodySectionContent",
)({ Layout: S.optional(SectionLayoutConfiguration) }) {}
export class SectionAfterPageBreak extends S.Class<SectionAfterPageBreak>(
  "SectionAfterPageBreak",
)({ Status: S.optional(S.String) }) {}
export class SectionPageBreakConfiguration extends S.Class<SectionPageBreakConfiguration>(
  "SectionPageBreakConfiguration",
)({ After: S.optional(SectionAfterPageBreak) }) {}
export const BodySectionDynamicDimensionSortConfigurationList =
  S.Array(ColumnSort);
export class BodySectionDynamicCategoryDimensionConfiguration extends S.Class<BodySectionDynamicCategoryDimensionConfiguration>(
  "BodySectionDynamicCategoryDimensionConfiguration",
)({
  Column: ColumnIdentifier,
  Limit: S.optional(S.Number),
  SortByMetrics: S.optional(BodySectionDynamicDimensionSortConfigurationList),
}) {}
export class BodySectionDynamicNumericDimensionConfiguration extends S.Class<BodySectionDynamicNumericDimensionConfiguration>(
  "BodySectionDynamicNumericDimensionConfiguration",
)({
  Column: ColumnIdentifier,
  Limit: S.optional(S.Number),
  SortByMetrics: S.optional(BodySectionDynamicDimensionSortConfigurationList),
}) {}
export class BodySectionRepeatDimensionConfiguration extends S.Class<BodySectionRepeatDimensionConfiguration>(
  "BodySectionRepeatDimensionConfiguration",
)({
  DynamicCategoryDimensionConfiguration: S.optional(
    BodySectionDynamicCategoryDimensionConfiguration,
  ),
  DynamicNumericDimensionConfiguration: S.optional(
    BodySectionDynamicNumericDimensionConfiguration,
  ),
}) {}
export const BodySectionRepeatDimensionConfigurationList = S.Array(
  BodySectionRepeatDimensionConfiguration,
);
export class BodySectionRepeatPageBreakConfiguration extends S.Class<BodySectionRepeatPageBreakConfiguration>(
  "BodySectionRepeatPageBreakConfiguration",
)({ After: S.optional(SectionAfterPageBreak) }) {}
export const NonRepeatingVisualsList = S.Array(S.String);
export class BodySectionRepeatConfiguration extends S.Class<BodySectionRepeatConfiguration>(
  "BodySectionRepeatConfiguration",
)({
  DimensionConfigurations: S.optional(
    BodySectionRepeatDimensionConfigurationList,
  ),
  PageBreakConfiguration: S.optional(BodySectionRepeatPageBreakConfiguration),
  NonRepeatingVisuals: S.optional(NonRepeatingVisualsList),
}) {}
export class BodySectionConfiguration extends S.Class<BodySectionConfiguration>(
  "BodySectionConfiguration",
)({
  SectionId: S.String,
  Content: BodySectionContent,
  Style: S.optional(SectionStyle),
  PageBreakConfiguration: S.optional(SectionPageBreakConfiguration),
  RepeatConfiguration: S.optional(BodySectionRepeatConfiguration),
}) {}
export const BodySectionConfigurationList = S.Array(BodySectionConfiguration);
export class SectionBasedLayoutPaperCanvasSizeOptions extends S.Class<SectionBasedLayoutPaperCanvasSizeOptions>(
  "SectionBasedLayoutPaperCanvasSizeOptions",
)({
  PaperSize: S.optional(S.String),
  PaperOrientation: S.optional(S.String),
  PaperMargin: S.optional(Spacing),
}) {}
export class SectionBasedLayoutCanvasSizeOptions extends S.Class<SectionBasedLayoutCanvasSizeOptions>(
  "SectionBasedLayoutCanvasSizeOptions",
)({
  PaperCanvasSizeOptions: S.optional(SectionBasedLayoutPaperCanvasSizeOptions),
}) {}
export class SectionBasedLayoutConfiguration extends S.Class<SectionBasedLayoutConfiguration>(
  "SectionBasedLayoutConfiguration",
)({
  HeaderSections: HeaderFooterSectionConfigurationList,
  BodySections: BodySectionConfigurationList,
  FooterSections: HeaderFooterSectionConfigurationList,
  CanvasSizeOptions: SectionBasedLayoutCanvasSizeOptions,
}) {}
export class LayoutConfiguration extends S.Class<LayoutConfiguration>(
  "LayoutConfiguration",
)({
  GridLayout: S.optional(GridLayoutConfiguration),
  FreeFormLayout: S.optional(FreeFormLayoutConfiguration),
  SectionBasedLayout: S.optional(SectionBasedLayoutConfiguration),
}) {}
export class Layout extends S.Class<Layout>("Layout")({
  Configuration: LayoutConfiguration,
}) {}
export const LayoutList = S.Array(Layout);
export class SheetControlLayoutConfiguration extends S.Class<SheetControlLayoutConfiguration>(
  "SheetControlLayoutConfiguration",
)({ GridLayout: S.optional(GridLayoutConfiguration) }) {}
export class SheetControlLayout extends S.Class<SheetControlLayout>(
  "SheetControlLayout",
)({ Configuration: SheetControlLayoutConfiguration }) {}
export const SheetControlLayoutList = S.Array(SheetControlLayout);
export class VisualHighlightOperation extends S.Class<VisualHighlightOperation>(
  "VisualHighlightOperation",
)({ Trigger: S.String }) {}
export class VisualCustomActionDefaults extends S.Class<VisualCustomActionDefaults>(
  "VisualCustomActionDefaults",
)({ highlightOperation: S.optional(VisualHighlightOperation) }) {}
export class SheetDefinition extends S.Class<SheetDefinition>(
  "SheetDefinition",
)({
  SheetId: S.String,
  Title: S.optional(S.String),
  Description: S.optional(S.String),
  Name: S.optional(S.String),
  ParameterControls: S.optional(ParameterControlList),
  FilterControls: S.optional(FilterControlList),
  Visuals: S.optional(VisualList),
  TextBoxes: S.optional(SheetTextBoxList),
  Images: S.optional(SheetImageList),
  Layouts: S.optional(LayoutList),
  SheetControlLayouts: S.optional(SheetControlLayoutList),
  ContentType: S.optional(S.String),
  CustomActionDefaults: S.optional(VisualCustomActionDefaults),
}) {}
export const SheetDefinitionList = S.Array(SheetDefinition);
export class CalculatedField extends S.Class<CalculatedField>(
  "CalculatedField",
)({ DataSetIdentifier: S.String, Name: S.String, Expression: S.String }) {}
export const CalculatedFields = S.Array(CalculatedField);
export class DynamicDefaultValue extends S.Class<DynamicDefaultValue>(
  "DynamicDefaultValue",
)({
  UserNameColumn: S.optional(ColumnIdentifier),
  GroupNameColumn: S.optional(ColumnIdentifier),
  DefaultValueColumn: ColumnIdentifier,
}) {}
export class StringDefaultValues extends S.Class<StringDefaultValues>(
  "StringDefaultValues",
)({
  DynamicValue: S.optional(DynamicDefaultValue),
  StaticValues: S.optional(StringDefaultValueList),
}) {}
export class StringValueWhenUnsetConfiguration extends S.Class<StringValueWhenUnsetConfiguration>(
  "StringValueWhenUnsetConfiguration",
)({
  ValueWhenUnsetOption: S.optional(S.String),
  CustomValue: S.optional(S.String),
}) {}
export class MappedDataSetParameter extends S.Class<MappedDataSetParameter>(
  "MappedDataSetParameter",
)({ DataSetIdentifier: S.String, DataSetParameterName: S.String }) {}
export const MappedDataSetParameters = S.Array(MappedDataSetParameter);
export class StringParameterDeclaration extends S.Class<StringParameterDeclaration>(
  "StringParameterDeclaration",
)({
  ParameterValueType: S.String,
  Name: S.String,
  DefaultValues: S.optional(StringDefaultValues),
  ValueWhenUnset: S.optional(StringValueWhenUnsetConfiguration),
  MappedDataSetParameters: S.optional(MappedDataSetParameters),
}) {}
export class DecimalDefaultValues extends S.Class<DecimalDefaultValues>(
  "DecimalDefaultValues",
)({
  DynamicValue: S.optional(DynamicDefaultValue),
  StaticValues: S.optional(DecimalDefaultValueList),
}) {}
export class DecimalValueWhenUnsetConfiguration extends S.Class<DecimalValueWhenUnsetConfiguration>(
  "DecimalValueWhenUnsetConfiguration",
)({
  ValueWhenUnsetOption: S.optional(S.String),
  CustomValue: S.optional(S.Number),
}) {}
export class DecimalParameterDeclaration extends S.Class<DecimalParameterDeclaration>(
  "DecimalParameterDeclaration",
)({
  ParameterValueType: S.String,
  Name: S.String,
  DefaultValues: S.optional(DecimalDefaultValues),
  ValueWhenUnset: S.optional(DecimalValueWhenUnsetConfiguration),
  MappedDataSetParameters: S.optional(MappedDataSetParameters),
}) {}
export class IntegerDefaultValues extends S.Class<IntegerDefaultValues>(
  "IntegerDefaultValues",
)({
  DynamicValue: S.optional(DynamicDefaultValue),
  StaticValues: S.optional(IntegerDefaultValueList),
}) {}
export class IntegerValueWhenUnsetConfiguration extends S.Class<IntegerValueWhenUnsetConfiguration>(
  "IntegerValueWhenUnsetConfiguration",
)({
  ValueWhenUnsetOption: S.optional(S.String),
  CustomValue: S.optional(S.Number),
}) {}
export class IntegerParameterDeclaration extends S.Class<IntegerParameterDeclaration>(
  "IntegerParameterDeclaration",
)({
  ParameterValueType: S.String,
  Name: S.String,
  DefaultValues: S.optional(IntegerDefaultValues),
  ValueWhenUnset: S.optional(IntegerValueWhenUnsetConfiguration),
  MappedDataSetParameters: S.optional(MappedDataSetParameters),
}) {}
export class RollingDateConfiguration extends S.Class<RollingDateConfiguration>(
  "RollingDateConfiguration",
)({ DataSetIdentifier: S.optional(S.String), Expression: S.String }) {}
export class DateTimeDefaultValues extends S.Class<DateTimeDefaultValues>(
  "DateTimeDefaultValues",
)({
  DynamicValue: S.optional(DynamicDefaultValue),
  StaticValues: S.optional(DateTimeDefaultValueList),
  RollingDate: S.optional(RollingDateConfiguration),
}) {}
export class DateTimeValueWhenUnsetConfiguration extends S.Class<DateTimeValueWhenUnsetConfiguration>(
  "DateTimeValueWhenUnsetConfiguration",
)({
  ValueWhenUnsetOption: S.optional(S.String),
  CustomValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DateTimeParameterDeclaration extends S.Class<DateTimeParameterDeclaration>(
  "DateTimeParameterDeclaration",
)({
  Name: S.String,
  DefaultValues: S.optional(DateTimeDefaultValues),
  TimeGranularity: S.optional(S.String),
  ValueWhenUnset: S.optional(DateTimeValueWhenUnsetConfiguration),
  MappedDataSetParameters: S.optional(MappedDataSetParameters),
}) {}
export class ParameterDeclaration extends S.Class<ParameterDeclaration>(
  "ParameterDeclaration",
)({
  StringParameterDeclaration: S.optional(StringParameterDeclaration),
  DecimalParameterDeclaration: S.optional(DecimalParameterDeclaration),
  IntegerParameterDeclaration: S.optional(IntegerParameterDeclaration),
  DateTimeParameterDeclaration: S.optional(DateTimeParameterDeclaration),
}) {}
export const ParameterDeclarationList = S.Array(ParameterDeclaration);
export class FilterListConfiguration extends S.Class<FilterListConfiguration>(
  "FilterListConfiguration",
)({
  MatchOperator: S.String,
  CategoryValues: S.optional(CategoryValueList),
  SelectAllOptions: S.optional(S.String),
  NullOption: S.optional(S.String),
}) {}
export class CustomFilterListConfiguration extends S.Class<CustomFilterListConfiguration>(
  "CustomFilterListConfiguration",
)({
  MatchOperator: S.String,
  CategoryValues: S.optional(CategoryValueList),
  SelectAllOptions: S.optional(S.String),
  NullOption: S.String,
}) {}
export class CustomFilterConfiguration extends S.Class<CustomFilterConfiguration>(
  "CustomFilterConfiguration",
)({
  MatchOperator: S.String,
  CategoryValue: S.optional(S.String),
  SelectAllOptions: S.optional(S.String),
  ParameterName: S.optional(S.String),
  NullOption: S.String,
}) {}
export class CategoryFilterConfiguration extends S.Class<CategoryFilterConfiguration>(
  "CategoryFilterConfiguration",
)({
  FilterListConfiguration: S.optional(FilterListConfiguration),
  CustomFilterListConfiguration: S.optional(CustomFilterListConfiguration),
  CustomFilterConfiguration: S.optional(CustomFilterConfiguration),
}) {}
export class DefaultDateTimePickerControlOptions extends S.Class<DefaultDateTimePickerControlOptions>(
  "DefaultDateTimePickerControlOptions",
)({
  Type: S.optional(S.String),
  DisplayOptions: S.optional(DateTimePickerControlDisplayOptions),
  CommitMode: S.optional(S.String),
}) {}
export class DefaultFilterListControlOptions extends S.Class<DefaultFilterListControlOptions>(
  "DefaultFilterListControlOptions",
)({
  DisplayOptions: S.optional(ListControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(FilterSelectableValues),
}) {}
export class DefaultFilterDropDownControlOptions extends S.Class<DefaultFilterDropDownControlOptions>(
  "DefaultFilterDropDownControlOptions",
)({
  DisplayOptions: S.optional(DropDownControlDisplayOptions),
  Type: S.optional(S.String),
  SelectableValues: S.optional(FilterSelectableValues),
  CommitMode: S.optional(S.String),
}) {}
export class DefaultTextFieldControlOptions extends S.Class<DefaultTextFieldControlOptions>(
  "DefaultTextFieldControlOptions",
)({ DisplayOptions: S.optional(TextFieldControlDisplayOptions) }) {}
export class DefaultTextAreaControlOptions extends S.Class<DefaultTextAreaControlOptions>(
  "DefaultTextAreaControlOptions",
)({
  Delimiter: S.optional(S.String),
  DisplayOptions: S.optional(TextAreaControlDisplayOptions),
}) {}
export class DefaultSliderControlOptions extends S.Class<DefaultSliderControlOptions>(
  "DefaultSliderControlOptions",
)({
  DisplayOptions: S.optional(SliderControlDisplayOptions),
  Type: S.optional(S.String),
  MaximumValue: S.Number,
  MinimumValue: S.Number,
  StepSize: S.Number,
}) {}
export class DefaultRelativeDateTimeControlOptions extends S.Class<DefaultRelativeDateTimeControlOptions>(
  "DefaultRelativeDateTimeControlOptions",
)({
  DisplayOptions: S.optional(RelativeDateTimeControlDisplayOptions),
  CommitMode: S.optional(S.String),
}) {}
export class DefaultFilterControlOptions extends S.Class<DefaultFilterControlOptions>(
  "DefaultFilterControlOptions",
)({
  DefaultDateTimePickerOptions: S.optional(DefaultDateTimePickerControlOptions),
  DefaultListOptions: S.optional(DefaultFilterListControlOptions),
  DefaultDropdownOptions: S.optional(DefaultFilterDropDownControlOptions),
  DefaultTextFieldOptions: S.optional(DefaultTextFieldControlOptions),
  DefaultTextAreaOptions: S.optional(DefaultTextAreaControlOptions),
  DefaultSliderOptions: S.optional(DefaultSliderControlOptions),
  DefaultRelativeDateTimeOptions: S.optional(
    DefaultRelativeDateTimeControlOptions,
  ),
}) {}
export class DefaultFilterControlConfiguration extends S.Class<DefaultFilterControlConfiguration>(
  "DefaultFilterControlConfiguration",
)({ Title: S.String, ControlOptions: DefaultFilterControlOptions }) {}
export class CategoryFilter extends S.Class<CategoryFilter>("CategoryFilter")({
  FilterId: S.String,
  Column: ColumnIdentifier,
  Configuration: CategoryFilterConfiguration,
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class NumericRangeFilterValue extends S.Class<NumericRangeFilterValue>(
  "NumericRangeFilterValue",
)({ StaticValue: S.optional(S.Number), Parameter: S.optional(S.String) }) {}
export class NumericRangeFilter extends S.Class<NumericRangeFilter>(
  "NumericRangeFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  IncludeMinimum: S.optional(S.Boolean),
  IncludeMaximum: S.optional(S.Boolean),
  RangeMinimum: S.optional(NumericRangeFilterValue),
  RangeMaximum: S.optional(NumericRangeFilterValue),
  SelectAllOptions: S.optional(S.String),
  AggregationFunction: S.optional(AggregationFunction),
  NullOption: S.String,
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class NumericEqualityFilter extends S.Class<NumericEqualityFilter>(
  "NumericEqualityFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  Value: S.optional(S.Number),
  SelectAllOptions: S.optional(S.String),
  MatchOperator: S.String,
  AggregationFunction: S.optional(AggregationFunction),
  ParameterName: S.optional(S.String),
  NullOption: S.String,
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class TimeEqualityFilter extends S.Class<TimeEqualityFilter>(
  "TimeEqualityFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  Value: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ParameterName: S.optional(S.String),
  TimeGranularity: S.optional(S.String),
  RollingDate: S.optional(RollingDateConfiguration),
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class TimeRangeFilterValue extends S.Class<TimeRangeFilterValue>(
  "TimeRangeFilterValue",
)({
  StaticValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RollingDate: S.optional(RollingDateConfiguration),
  Parameter: S.optional(S.String),
}) {}
export class ExcludePeriodConfiguration extends S.Class<ExcludePeriodConfiguration>(
  "ExcludePeriodConfiguration",
)({ Amount: S.Number, Granularity: S.String, Status: S.optional(S.String) }) {}
export class TimeRangeFilter extends S.Class<TimeRangeFilter>(
  "TimeRangeFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  IncludeMinimum: S.optional(S.Boolean),
  IncludeMaximum: S.optional(S.Boolean),
  RangeMinimumValue: S.optional(TimeRangeFilterValue),
  RangeMaximumValue: S.optional(TimeRangeFilterValue),
  NullOption: S.String,
  ExcludePeriodConfiguration: S.optional(ExcludePeriodConfiguration),
  TimeGranularity: S.optional(S.String),
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class AnchorDateConfiguration extends S.Class<AnchorDateConfiguration>(
  "AnchorDateConfiguration",
)({
  AnchorOption: S.optional(S.String),
  ParameterName: S.optional(S.String),
}) {}
export class RelativeDatesFilter extends S.Class<RelativeDatesFilter>(
  "RelativeDatesFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  AnchorDateConfiguration: AnchorDateConfiguration,
  MinimumGranularity: S.optional(S.String),
  TimeGranularity: S.String,
  RelativeDateType: S.String,
  RelativeDateValue: S.optional(S.Number),
  ParameterName: S.optional(S.String),
  NullOption: S.String,
  ExcludePeriodConfiguration: S.optional(ExcludePeriodConfiguration),
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class AggregationSortConfiguration extends S.Class<AggregationSortConfiguration>(
  "AggregationSortConfiguration",
)({
  Column: ColumnIdentifier,
  SortDirection: S.String,
  AggregationFunction: S.optional(AggregationFunction),
}) {}
export const AggregationSortConfigurationList = S.Array(
  AggregationSortConfiguration,
);
export class TopBottomFilter extends S.Class<TopBottomFilter>(
  "TopBottomFilter",
)({
  FilterId: S.String,
  Column: ColumnIdentifier,
  Limit: S.optional(S.Number),
  AggregationSortConfigurations: AggregationSortConfigurationList,
  TimeGranularity: S.optional(S.String),
  ParameterName: S.optional(S.String),
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class CategoryInnerFilter extends S.Class<CategoryInnerFilter>(
  "CategoryInnerFilter",
)({
  Column: ColumnIdentifier,
  Configuration: CategoryFilterConfiguration,
  DefaultFilterControlConfiguration: S.optional(
    DefaultFilterControlConfiguration,
  ),
}) {}
export class InnerFilter extends S.Class<InnerFilter>("InnerFilter")({
  CategoryInnerFilter: S.optional(CategoryInnerFilter),
}) {}
export class NestedFilter extends S.Class<NestedFilter>("NestedFilter")({
  FilterId: S.String,
  Column: ColumnIdentifier,
  IncludeInnerSet: S.Boolean,
  InnerFilter: InnerFilter,
}) {}
export class Filter extends S.Class<Filter>("Filter")({
  CategoryFilter: S.optional(CategoryFilter),
  NumericRangeFilter: S.optional(NumericRangeFilter),
  NumericEqualityFilter: S.optional(NumericEqualityFilter),
  TimeEqualityFilter: S.optional(TimeEqualityFilter),
  TimeRangeFilter: S.optional(TimeRangeFilter),
  RelativeDatesFilter: S.optional(RelativeDatesFilter),
  TopBottomFilter: S.optional(TopBottomFilter),
  NestedFilter: S.optional(NestedFilter),
}) {}
export const FilterList = S.Array(Filter);
export const FilteredVisualsList = S.Array(S.String);
export class SheetVisualScopingConfiguration extends S.Class<SheetVisualScopingConfiguration>(
  "SheetVisualScopingConfiguration",
)({
  SheetId: S.String,
  Scope: S.String,
  VisualIds: S.optional(FilteredVisualsList),
}) {}
export const SheetVisualScopingConfigurations = S.Array(
  SheetVisualScopingConfiguration,
);
export class SelectedSheetsFilterScopeConfiguration extends S.Class<SelectedSheetsFilterScopeConfiguration>(
  "SelectedSheetsFilterScopeConfiguration",
)({
  SheetVisualScopingConfigurations: S.optional(
    SheetVisualScopingConfigurations,
  ),
}) {}
export class AllSheetsFilterScopeConfiguration extends S.Class<AllSheetsFilterScopeConfiguration>(
  "AllSheetsFilterScopeConfiguration",
)({}) {}
export class FilterScopeConfiguration extends S.Class<FilterScopeConfiguration>(
  "FilterScopeConfiguration",
)({
  SelectedSheets: S.optional(SelectedSheetsFilterScopeConfiguration),
  AllSheets: S.optional(AllSheetsFilterScopeConfiguration),
}) {}
export class FilterGroup extends S.Class<FilterGroup>("FilterGroup")({
  FilterGroupId: S.String,
  Filters: FilterList,
  ScopeConfiguration: FilterScopeConfiguration,
  Status: S.optional(S.String),
  CrossDataset: S.String,
}) {}
export const FilterGroupList = S.Array(FilterGroup);
export class CustomColor extends S.Class<CustomColor>("CustomColor")({
  FieldValue: S.optional(S.String),
  Color: S.String,
  SpecialValue: S.optional(S.String),
}) {}
export const CustomColorsList = S.Array(CustomColor);
export class ColorsConfiguration extends S.Class<ColorsConfiguration>(
  "ColorsConfiguration",
)({ CustomColors: S.optional(CustomColorsList) }) {}
export const DecalSettingsList = S.Array(DecalSettings);
export class DecalSettingsConfiguration extends S.Class<DecalSettingsConfiguration>(
  "DecalSettingsConfiguration",
)({ CustomDecalSettings: S.optional(DecalSettingsList) }) {}
export class ColumnConfiguration extends S.Class<ColumnConfiguration>(
  "ColumnConfiguration",
)({
  Column: ColumnIdentifier,
  FormatConfiguration: S.optional(FormatConfiguration),
  Role: S.optional(S.String),
  ColorsConfiguration: S.optional(ColorsConfiguration),
  DecalSettingsConfiguration: S.optional(DecalSettingsConfiguration),
}) {}
export const ColumnConfigurationList = S.Array(ColumnConfiguration);
export class DefaultGridLayoutConfiguration extends S.Class<DefaultGridLayoutConfiguration>(
  "DefaultGridLayoutConfiguration",
)({ CanvasSizeOptions: GridLayoutCanvasSizeOptions }) {}
export class DefaultFreeFormLayoutConfiguration extends S.Class<DefaultFreeFormLayoutConfiguration>(
  "DefaultFreeFormLayoutConfiguration",
)({ CanvasSizeOptions: FreeFormLayoutCanvasSizeOptions }) {}
export class DefaultInteractiveLayoutConfiguration extends S.Class<DefaultInteractiveLayoutConfiguration>(
  "DefaultInteractiveLayoutConfiguration",
)({
  Grid: S.optional(DefaultGridLayoutConfiguration),
  FreeForm: S.optional(DefaultFreeFormLayoutConfiguration),
}) {}
export class DefaultSectionBasedLayoutConfiguration extends S.Class<DefaultSectionBasedLayoutConfiguration>(
  "DefaultSectionBasedLayoutConfiguration",
)({ CanvasSizeOptions: SectionBasedLayoutCanvasSizeOptions }) {}
export class DefaultPaginatedLayoutConfiguration extends S.Class<DefaultPaginatedLayoutConfiguration>(
  "DefaultPaginatedLayoutConfiguration",
)({ SectionBased: S.optional(DefaultSectionBasedLayoutConfiguration) }) {}
export class DefaultNewSheetConfiguration extends S.Class<DefaultNewSheetConfiguration>(
  "DefaultNewSheetConfiguration",
)({
  InteractiveLayoutConfiguration: S.optional(
    DefaultInteractiveLayoutConfiguration,
  ),
  PaginatedLayoutConfiguration: S.optional(DefaultPaginatedLayoutConfiguration),
  SheetContentType: S.optional(S.String),
}) {}
export class AnalysisDefaults extends S.Class<AnalysisDefaults>(
  "AnalysisDefaults",
)({ DefaultNewSheetConfiguration: DefaultNewSheetConfiguration }) {}
export const DataSetArnsList = S.Array(S.String);
export class AssetOptions extends S.Class<AssetOptions>("AssetOptions")({
  Timezone: S.optional(S.String),
  WeekStart: S.optional(S.String),
  QBusinessInsightsStatus: S.optional(S.String),
  ExcludedDataSetArns: S.optional(DataSetArnsList),
  CustomActionDefaults: S.optional(VisualCustomActionDefaults),
}) {}
export class QueryExecutionOptions extends S.Class<QueryExecutionOptions>(
  "QueryExecutionOptions",
)({ QueryExecutionMode: S.optional(S.String) }) {}
export class StaticFileUrlSourceOptions extends S.Class<StaticFileUrlSourceOptions>(
  "StaticFileUrlSourceOptions",
)({ Url: S.String }) {}
export class StaticFileS3SourceOptions extends S.Class<StaticFileS3SourceOptions>(
  "StaticFileS3SourceOptions",
)({ BucketName: S.String, ObjectKey: S.String, Region: S.String }) {}
export class StaticFileSource extends S.Class<StaticFileSource>(
  "StaticFileSource",
)({
  UrlOptions: S.optional(StaticFileUrlSourceOptions),
  S3Options: S.optional(StaticFileS3SourceOptions),
}) {}
export class ImageStaticFile extends S.Class<ImageStaticFile>(
  "ImageStaticFile",
)({ StaticFileId: S.String, Source: S.optional(StaticFileSource) }) {}
export class SpatialStaticFile extends S.Class<SpatialStaticFile>(
  "SpatialStaticFile",
)({ StaticFileId: S.String, Source: S.optional(StaticFileSource) }) {}
export class StaticFile extends S.Class<StaticFile>("StaticFile")({
  ImageStaticFile: S.optional(ImageStaticFile),
  SpatialStaticFile: S.optional(SpatialStaticFile),
}) {}
export const StaticFileList = S.Array(StaticFile);
export class AnalysisDefinition extends S.Class<AnalysisDefinition>(
  "AnalysisDefinition",
)({
  DataSetIdentifierDeclarations: DataSetIdentifierDeclarationList,
  Sheets: S.optional(SheetDefinitionList),
  CalculatedFields: S.optional(CalculatedFields),
  ParameterDeclarations: S.optional(ParameterDeclarationList),
  FilterGroups: S.optional(FilterGroupList),
  ColumnConfigurations: S.optional(ColumnConfigurationList),
  AnalysisDefaults: S.optional(AnalysisDefaults),
  Options: S.optional(AssetOptions),
  QueryExecutionOptions: S.optional(QueryExecutionOptions),
  StaticFiles: S.optional(StaticFileList),
}) {}
export class ValidationStrategy extends S.Class<ValidationStrategy>(
  "ValidationStrategy",
)({ Mode: S.String }) {}
export class UpdateAnalysisRequest extends S.Class<UpdateAnalysisRequest>(
  "UpdateAnalysisRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
    Name: S.String,
    Parameters: S.optional(Parameters),
    SourceEntity: S.optional(AnalysisSourceEntity),
    ThemeArn: S.optional(S.String),
    Definition: S.optional(AnalysisDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAnalysisPermissionsRequest extends S.Class<UpdateAnalysisPermissionsRequest>(
  "UpdateAnalysisPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
    GrantPermissions: S.optional(UpdateResourcePermissionList),
    RevokePermissions: S.optional(UpdateResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationWithTokenExchangeGrantRequest extends S.Class<UpdateApplicationWithTokenExchangeGrantRequest>(
  "UpdateApplicationWithTokenExchangeGrantRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpQuery("namespace")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/application-with-token-exchange-grant",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Palette extends S.Class<Palette>("Palette")({
  Foreground: S.optional(S.String),
  Background: S.optional(S.String),
}) {}
export class BrandColorPalette extends S.Class<BrandColorPalette>(
  "BrandColorPalette",
)({
  Primary: S.optional(Palette),
  Secondary: S.optional(Palette),
  Accent: S.optional(Palette),
  Measure: S.optional(Palette),
  Dimension: S.optional(Palette),
  Success: S.optional(Palette),
  Info: S.optional(Palette),
  Warning: S.optional(Palette),
  Danger: S.optional(Palette),
}) {}
export class ContextualAccentPalette extends S.Class<ContextualAccentPalette>(
  "ContextualAccentPalette",
)({
  Connection: S.optional(Palette),
  Visualization: S.optional(Palette),
  Insight: S.optional(Palette),
  Automation: S.optional(Palette),
}) {}
export class NavbarStyle extends S.Class<NavbarStyle>("NavbarStyle")({
  GlobalNavbar: S.optional(Palette),
  ContextualNavbar: S.optional(Palette),
}) {}
export class BrandElementStyle extends S.Class<BrandElementStyle>(
  "BrandElementStyle",
)({ NavbarStyle: S.optional(NavbarStyle) }) {}
export class ApplicationTheme extends S.Class<ApplicationTheme>(
  "ApplicationTheme",
)({
  BrandColorPalette: S.optional(BrandColorPalette),
  ContextualAccentPalette: S.optional(ContextualAccentPalette),
  BrandElementStyle: S.optional(BrandElementStyle),
}) {}
export const ImageSource = S.Union(
  S.Struct({ PublicUrl: S.String }),
  S.Struct({ S3Uri: S.String }),
);
export class ImageConfiguration extends S.Class<ImageConfiguration>(
  "ImageConfiguration",
)({ Source: S.optional(ImageSource) }) {}
export class ImageSetConfiguration extends S.Class<ImageSetConfiguration>(
  "ImageSetConfiguration",
)({ Original: ImageConfiguration }) {}
export class LogoSetConfiguration extends S.Class<LogoSetConfiguration>(
  "LogoSetConfiguration",
)({
  Primary: ImageSetConfiguration,
  Favicon: S.optional(ImageSetConfiguration),
}) {}
export class LogoConfiguration extends S.Class<LogoConfiguration>(
  "LogoConfiguration",
)({ AltText: S.String, LogoSet: LogoSetConfiguration }) {}
export class BrandDefinition extends S.Class<BrandDefinition>(
  "BrandDefinition",
)({
  BrandName: S.String,
  Description: S.optional(S.String),
  ApplicationTheme: S.optional(ApplicationTheme),
  LogoConfiguration: S.optional(LogoConfiguration),
}) {}
export class UpdateBrandRequest extends S.Class<UpdateBrandRequest>(
  "UpdateBrandRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
    BrandDefinition: S.optional(BrandDefinition),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/brands/{BrandId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBrandAssignmentRequest extends S.Class<UpdateBrandAssignmentRequest>(
  "UpdateBrandAssignmentRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandArn: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/brandassignments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBrandPublishedVersionRequest extends S.Class<UpdateBrandPublishedVersionRequest>(
  "UpdateBrandPublishedVersionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
    VersionId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/brands/{BrandId}/publishedversion",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Capabilities extends S.Class<Capabilities>("Capabilities")({
  ExportToCsv: S.optional(S.String),
  ExportToExcel: S.optional(S.String),
  ExportToPdf: S.optional(S.String),
  PrintReports: S.optional(S.String),
  CreateAndUpdateThemes: S.optional(S.String),
  AddOrRunAnomalyDetectionForAnalyses: S.optional(S.String),
  ShareAnalyses: S.optional(S.String),
  CreateAndUpdateDatasets: S.optional(S.String),
  ShareDatasets: S.optional(S.String),
  SubscribeDashboardEmailReports: S.optional(S.String),
  CreateAndUpdateDashboardEmailReports: S.optional(S.String),
  ShareDashboards: S.optional(S.String),
  CreateAndUpdateThresholdAlerts: S.optional(S.String),
  RenameSharedFolders: S.optional(S.String),
  CreateSharedFolders: S.optional(S.String),
  CreateAndUpdateDataSources: S.optional(S.String),
  ShareDataSources: S.optional(S.String),
  ViewAccountSPICECapacity: S.optional(S.String),
  CreateSPICEDataset: S.optional(S.String),
  ExportToPdfInScheduledReports: S.optional(S.String),
  ExportToCsvInScheduledReports: S.optional(S.String),
  ExportToExcelInScheduledReports: S.optional(S.String),
  IncludeContentInScheduledReportsEmail: S.optional(S.String),
  Dashboard: S.optional(S.String),
  Analysis: S.optional(S.String),
  Automate: S.optional(S.String),
  Flow: S.optional(S.String),
  PublishWithoutApproval: S.optional(S.String),
  UseBedrockModels: S.optional(S.String),
  PerformFlowUiTask: S.optional(S.String),
  UseAgentWebSearch: S.optional(S.String),
  KnowledgeBase: S.optional(S.String),
  Action: S.optional(S.String),
  Space: S.optional(S.String),
  ChatAgent: S.optional(S.String),
  CreateChatAgents: S.optional(S.String),
  Research: S.optional(S.String),
  SelfUpgradeUserRole: S.optional(S.String),
}) {}
export class UpdateCustomPermissionsRequest extends S.Class<UpdateCustomPermissionsRequest>(
  "UpdateCustomPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    CustomPermissionsName: S.String.pipe(T.HttpLabel("CustomPermissionsName")),
    Capabilities: S.optional(Capabilities),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/custom-permissions/{CustomPermissionsName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DashboardSourceTemplate extends S.Class<DashboardSourceTemplate>(
  "DashboardSourceTemplate",
)({ DataSetReferences: DataSetReferenceList, Arn: S.String }) {}
export class DashboardSourceEntity extends S.Class<DashboardSourceEntity>(
  "DashboardSourceEntity",
)({ SourceTemplate: S.optional(DashboardSourceTemplate) }) {}
export class AdHocFilteringOption extends S.Class<AdHocFilteringOption>(
  "AdHocFilteringOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class ExportToCSVOption extends S.Class<ExportToCSVOption>(
  "ExportToCSVOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class SheetControlsOption extends S.Class<SheetControlsOption>(
  "SheetControlsOption",
)({ VisibilityState: S.optional(S.String) }) {}
export class ExportHiddenFieldsOption extends S.Class<ExportHiddenFieldsOption>(
  "ExportHiddenFieldsOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DashboardVisualPublishOptions extends S.Class<DashboardVisualPublishOptions>(
  "DashboardVisualPublishOptions",
)({ ExportHiddenFieldsOption: S.optional(ExportHiddenFieldsOption) }) {}
export class SheetLayoutElementMaximizationOption extends S.Class<SheetLayoutElementMaximizationOption>(
  "SheetLayoutElementMaximizationOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class VisualAxisSortOption extends S.Class<VisualAxisSortOption>(
  "VisualAxisSortOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class ExportWithHiddenFieldsOption extends S.Class<ExportWithHiddenFieldsOption>(
  "ExportWithHiddenFieldsOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DataPointDrillUpDownOption extends S.Class<DataPointDrillUpDownOption>(
  "DataPointDrillUpDownOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DataPointMenuLabelOption extends S.Class<DataPointMenuLabelOption>(
  "DataPointMenuLabelOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DataPointTooltipOption extends S.Class<DataPointTooltipOption>(
  "DataPointTooltipOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DataQAEnabledOption extends S.Class<DataQAEnabledOption>(
  "DataQAEnabledOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class QuickSuiteActionsOption extends S.Class<QuickSuiteActionsOption>(
  "QuickSuiteActionsOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class ExecutiveSummaryOption extends S.Class<ExecutiveSummaryOption>(
  "ExecutiveSummaryOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DataStoriesSharingOption extends S.Class<DataStoriesSharingOption>(
  "DataStoriesSharingOption",
)({ AvailabilityStatus: S.optional(S.String) }) {}
export class DashboardPublishOptions extends S.Class<DashboardPublishOptions>(
  "DashboardPublishOptions",
)({
  AdHocFilteringOption: S.optional(AdHocFilteringOption),
  ExportToCSVOption: S.optional(ExportToCSVOption),
  SheetControlsOption: S.optional(SheetControlsOption),
  VisualPublishOptions: S.optional(DashboardVisualPublishOptions),
  SheetLayoutElementMaximizationOption: S.optional(
    SheetLayoutElementMaximizationOption,
  ),
  VisualMenuOption: S.optional(VisualMenuOption),
  VisualAxisSortOption: S.optional(VisualAxisSortOption),
  ExportWithHiddenFieldsOption: S.optional(ExportWithHiddenFieldsOption),
  DataPointDrillUpDownOption: S.optional(DataPointDrillUpDownOption),
  DataPointMenuLabelOption: S.optional(DataPointMenuLabelOption),
  DataPointTooltipOption: S.optional(DataPointTooltipOption),
  DataQAEnabledOption: S.optional(DataQAEnabledOption),
  QuickSuiteActionsOption: S.optional(QuickSuiteActionsOption),
  ExecutiveSummaryOption: S.optional(ExecutiveSummaryOption),
  DataStoriesSharingOption: S.optional(DataStoriesSharingOption),
}) {}
export class DashboardVersionDefinition extends S.Class<DashboardVersionDefinition>(
  "DashboardVersionDefinition",
)({
  DataSetIdentifierDeclarations: DataSetIdentifierDeclarationList,
  Sheets: S.optional(SheetDefinitionList),
  CalculatedFields: S.optional(CalculatedFields),
  ParameterDeclarations: S.optional(ParameterDeclarationList),
  FilterGroups: S.optional(FilterGroupList),
  ColumnConfigurations: S.optional(ColumnConfigurationList),
  AnalysisDefaults: S.optional(AnalysisDefaults),
  Options: S.optional(AssetOptions),
  StaticFiles: S.optional(StaticFileList),
}) {}
export class UpdateDashboardRequest extends S.Class<UpdateDashboardRequest>(
  "UpdateDashboardRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    Name: S.String,
    SourceEntity: S.optional(DashboardSourceEntity),
    Parameters: S.optional(Parameters),
    VersionDescription: S.optional(S.String),
    DashboardPublishOptions: S.optional(DashboardPublishOptions),
    ThemeArn: S.optional(S.String),
    Definition: S.optional(DashboardVersionDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardLinksRequest extends S.Class<UpdateDashboardLinksRequest>(
  "UpdateDashboardLinksRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    LinkEntities: LinkEntityArnList,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/linked-entities",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardPermissionsRequest extends S.Class<UpdateDashboardPermissionsRequest>(
  "UpdateDashboardPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    GrantPermissions: S.optional(UpdateResourcePermissionList),
    RevokePermissions: S.optional(UpdateResourcePermissionList),
    GrantLinkPermissions: S.optional(UpdateLinkPermissionList),
    RevokeLinkPermissions: S.optional(UpdateLinkPermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardPublishedVersionRequest extends S.Class<UpdateDashboardPublishedVersionRequest>(
  "UpdateDashboardPublishedVersionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    VersionNumber: S.Number.pipe(T.HttpLabel("VersionNumber")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/versions/{VersionNumber}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDashboardsQAConfigurationRequest extends S.Class<UpdateDashboardsQAConfigurationRequest>(
  "UpdateDashboardsQAConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardsQAStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/dashboards-qa-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InputColumn extends S.Class<InputColumn>("InputColumn")({
  Name: S.String,
  Id: S.optional(S.String),
  Type: S.String,
  SubType: S.optional(S.String),
}) {}
export const InputColumnList = S.Array(InputColumn);
export class RelationalTable extends S.Class<RelationalTable>(
  "RelationalTable",
)({
  DataSourceArn: S.String,
  Catalog: S.optional(S.String),
  Schema: S.optional(S.String),
  Name: S.String,
  InputColumns: InputColumnList,
}) {}
export class CustomSql extends S.Class<CustomSql>("CustomSql")({
  DataSourceArn: S.String,
  Name: S.String,
  SqlQuery: S.String,
  Columns: S.optional(InputColumnList),
}) {}
export class UploadSettings extends S.Class<UploadSettings>("UploadSettings")({
  Format: S.optional(S.String),
  StartFromRow: S.optional(S.Number),
  ContainsHeader: S.optional(S.Boolean),
  TextQualifier: S.optional(S.String),
  Delimiter: S.optional(S.String),
  CustomCellAddressRange: S.optional(S.String),
}) {}
export class S3Source extends S.Class<S3Source>("S3Source")({
  DataSourceArn: S.String,
  UploadSettings: S.optional(UploadSettings),
  InputColumns: InputColumnList,
}) {}
export class TablePathElement extends S.Class<TablePathElement>(
  "TablePathElement",
)({ Name: S.optional(S.String), Id: S.optional(S.String) }) {}
export const TablePathElementList = S.Array(TablePathElement);
export class SaaSTable extends S.Class<SaaSTable>("SaaSTable")({
  DataSourceArn: S.String,
  TablePath: TablePathElementList,
  InputColumns: InputColumnList,
}) {}
export const PhysicalTable = S.Union(
  S.Struct({ RelationalTable: RelationalTable }),
  S.Struct({ CustomSql: CustomSql }),
  S.Struct({ S3Source: S3Source }),
  S.Struct({ SaaSTable: SaaSTable }),
);
export const PhysicalTableMap = S.Record({
  key: S.String,
  value: PhysicalTable,
});
export class DataSetColumnIdMapping extends S.Class<DataSetColumnIdMapping>(
  "DataSetColumnIdMapping",
)({ SourceColumnId: S.String, TargetColumnId: S.String }) {}
export const DataSetColumnIdMappingList = S.Array(DataSetColumnIdMapping);
export class TransformOperationSource extends S.Class<TransformOperationSource>(
  "TransformOperationSource",
)({
  TransformOperationId: S.String,
  ColumnIdMappings: S.optional(DataSetColumnIdMappingList),
}) {}
export const ProjectedColumnNameList = S.Array(S.String);
export class ProjectOperation extends S.Class<ProjectOperation>(
  "ProjectOperation",
)({
  Alias: S.optional(S.String),
  Source: S.optional(TransformOperationSource),
  ProjectedColumns: ProjectedColumnNameList,
}) {}
export class DataSetStringFilterValue extends S.Class<DataSetStringFilterValue>(
  "DataSetStringFilterValue",
)({ StaticValue: S.optional(S.String) }) {}
export class DataSetStringComparisonFilterCondition extends S.Class<DataSetStringComparisonFilterCondition>(
  "DataSetStringComparisonFilterCondition",
)({ Operator: S.String, Value: S.optional(DataSetStringFilterValue) }) {}
export const DataSetStringFilterStaticValueList = S.Array(S.String);
export class DataSetStringListFilterValue extends S.Class<DataSetStringListFilterValue>(
  "DataSetStringListFilterValue",
)({ StaticValues: S.optional(DataSetStringFilterStaticValueList) }) {}
export class DataSetStringListFilterCondition extends S.Class<DataSetStringListFilterCondition>(
  "DataSetStringListFilterCondition",
)({ Operator: S.String, Values: S.optional(DataSetStringListFilterValue) }) {}
export class DataSetStringFilterCondition extends S.Class<DataSetStringFilterCondition>(
  "DataSetStringFilterCondition",
)({
  ColumnName: S.optional(S.String),
  ComparisonFilterCondition: S.optional(DataSetStringComparisonFilterCondition),
  ListFilterCondition: S.optional(DataSetStringListFilterCondition),
}) {}
export class DataSetNumericFilterValue extends S.Class<DataSetNumericFilterValue>(
  "DataSetNumericFilterValue",
)({ StaticValue: S.optional(S.Number) }) {}
export class DataSetNumericComparisonFilterCondition extends S.Class<DataSetNumericComparisonFilterCondition>(
  "DataSetNumericComparisonFilterCondition",
)({ Operator: S.String, Value: S.optional(DataSetNumericFilterValue) }) {}
export class DataSetNumericRangeFilterCondition extends S.Class<DataSetNumericRangeFilterCondition>(
  "DataSetNumericRangeFilterCondition",
)({
  RangeMinimum: S.optional(DataSetNumericFilterValue),
  RangeMaximum: S.optional(DataSetNumericFilterValue),
  IncludeMinimum: S.optional(S.Boolean),
  IncludeMaximum: S.optional(S.Boolean),
}) {}
export class DataSetNumericFilterCondition extends S.Class<DataSetNumericFilterCondition>(
  "DataSetNumericFilterCondition",
)({
  ColumnName: S.optional(S.String),
  ComparisonFilterCondition: S.optional(
    DataSetNumericComparisonFilterCondition,
  ),
  RangeFilterCondition: S.optional(DataSetNumericRangeFilterCondition),
}) {}
export class DataSetDateFilterValue extends S.Class<DataSetDateFilterValue>(
  "DataSetDateFilterValue",
)({
  StaticValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataSetDateComparisonFilterCondition extends S.Class<DataSetDateComparisonFilterCondition>(
  "DataSetDateComparisonFilterCondition",
)({ Operator: S.String, Value: S.optional(DataSetDateFilterValue) }) {}
export class DataSetDateRangeFilterCondition extends S.Class<DataSetDateRangeFilterCondition>(
  "DataSetDateRangeFilterCondition",
)({
  RangeMinimum: S.optional(DataSetDateFilterValue),
  RangeMaximum: S.optional(DataSetDateFilterValue),
  IncludeMinimum: S.optional(S.Boolean),
  IncludeMaximum: S.optional(S.Boolean),
}) {}
export class DataSetDateFilterCondition extends S.Class<DataSetDateFilterCondition>(
  "DataSetDateFilterCondition",
)({
  ColumnName: S.optional(S.String),
  ComparisonFilterCondition: S.optional(DataSetDateComparisonFilterCondition),
  RangeFilterCondition: S.optional(DataSetDateRangeFilterCondition),
}) {}
export class FilterOperation extends S.Class<FilterOperation>(
  "FilterOperation",
)({
  ConditionExpression: S.optional(S.String),
  StringFilterCondition: S.optional(DataSetStringFilterCondition),
  NumericFilterCondition: S.optional(DataSetNumericFilterCondition),
  DateFilterCondition: S.optional(DataSetDateFilterCondition),
}) {}
export class CalculatedColumn extends S.Class<CalculatedColumn>(
  "CalculatedColumn",
)({ ColumnName: S.String, ColumnId: S.String, Expression: S.String }) {}
export const CalculatedColumnList = S.Array(CalculatedColumn);
export class CreateColumnsOperation extends S.Class<CreateColumnsOperation>(
  "CreateColumnsOperation",
)({
  Alias: S.optional(S.String),
  Source: S.optional(TransformOperationSource),
  Columns: CalculatedColumnList,
}) {}
export class RenameColumnOperation extends S.Class<RenameColumnOperation>(
  "RenameColumnOperation",
)({ ColumnName: S.String, NewColumnName: S.String }) {}
export class CastColumnTypeOperation extends S.Class<CastColumnTypeOperation>(
  "CastColumnTypeOperation",
)({
  ColumnName: S.String,
  NewColumnType: S.String,
  SubType: S.optional(S.String),
  Format: S.optional(S.String),
}) {}
export class ColumnDescription extends S.Class<ColumnDescription>(
  "ColumnDescription",
)({ Text: S.optional(S.String) }) {}
export class ColumnTag extends S.Class<ColumnTag>("ColumnTag")({
  ColumnGeographicRole: S.optional(S.String),
  ColumnDescription: S.optional(ColumnDescription),
}) {}
export const ColumnTagList = S.Array(ColumnTag);
export class TagColumnOperation extends S.Class<TagColumnOperation>(
  "TagColumnOperation",
)({ ColumnName: S.String, Tags: ColumnTagList }) {}
export const ColumnTagNames = S.Array(S.String);
export class UntagColumnOperation extends S.Class<UntagColumnOperation>(
  "UntagColumnOperation",
)({ ColumnName: S.String, TagNames: ColumnTagNames }) {}
export const StringDatasetParameterValueList = S.Array(S.String);
export const DecimalDatasetParameterValueList = S.Array(S.Number);
export const DateTimeDatasetParameterValueList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const IntegerDatasetParameterValueList = S.Array(S.Number);
export class NewDefaultValues extends S.Class<NewDefaultValues>(
  "NewDefaultValues",
)({
  StringStaticValues: S.optional(StringDatasetParameterValueList),
  DecimalStaticValues: S.optional(DecimalDatasetParameterValueList),
  DateTimeStaticValues: S.optional(DateTimeDatasetParameterValueList),
  IntegerStaticValues: S.optional(IntegerDatasetParameterValueList),
}) {}
export class OverrideDatasetParameterOperation extends S.Class<OverrideDatasetParameterOperation>(
  "OverrideDatasetParameterOperation",
)({
  ParameterName: S.String,
  NewParameterName: S.optional(S.String),
  NewDefaultValues: S.optional(NewDefaultValues),
}) {}
export const TransformOperation = S.Union(
  S.Struct({ ProjectOperation: ProjectOperation }),
  S.Struct({ FilterOperation: FilterOperation }),
  S.Struct({ CreateColumnsOperation: CreateColumnsOperation }),
  S.Struct({ RenameColumnOperation: RenameColumnOperation }),
  S.Struct({ CastColumnTypeOperation: CastColumnTypeOperation }),
  S.Struct({ TagColumnOperation: TagColumnOperation }),
  S.Struct({ UntagColumnOperation: UntagColumnOperation }),
  S.Struct({
    OverrideDatasetParameterOperation: OverrideDatasetParameterOperation,
  }),
);
export const TransformOperationList = S.Array(TransformOperation);
export class JoinKeyProperties extends S.Class<JoinKeyProperties>(
  "JoinKeyProperties",
)({ UniqueKey: S.optional(S.Boolean) }) {}
export class JoinInstruction extends S.Class<JoinInstruction>(
  "JoinInstruction",
)({
  LeftOperand: S.String,
  RightOperand: S.String,
  LeftJoinKeyProperties: S.optional(JoinKeyProperties),
  RightJoinKeyProperties: S.optional(JoinKeyProperties),
  Type: S.String,
  OnClause: S.String,
}) {}
export class LogicalTableSource extends S.Class<LogicalTableSource>(
  "LogicalTableSource",
)({
  JoinInstruction: S.optional(JoinInstruction),
  PhysicalTableId: S.optional(S.String),
  DataSetArn: S.optional(S.String),
}) {}
export class LogicalTable extends S.Class<LogicalTable>("LogicalTable")({
  Alias: S.String,
  DataTransforms: S.optional(TransformOperationList),
  Source: LogicalTableSource,
}) {}
export const LogicalTableMap = S.Record({ key: S.String, value: LogicalTable });
export const ColumnList = S.Array(S.String);
export class GeoSpatialColumnGroup extends S.Class<GeoSpatialColumnGroup>(
  "GeoSpatialColumnGroup",
)({ Name: S.String, CountryCode: S.optional(S.String), Columns: ColumnList }) {}
export class ColumnGroup extends S.Class<ColumnGroup>("ColumnGroup")({
  GeoSpatialColumnGroup: S.optional(GeoSpatialColumnGroup),
}) {}
export const ColumnGroupList = S.Array(ColumnGroup);
export const FolderColumnList = S.Array(S.String);
export class FieldFolder extends S.Class<FieldFolder>("FieldFolder")({
  description: S.optional(S.String),
  columns: S.optional(FolderColumnList),
}) {}
export const FieldFolderMap = S.Record({ key: S.String, value: FieldFolder });
export class RowLevelPermissionDataSet extends S.Class<RowLevelPermissionDataSet>(
  "RowLevelPermissionDataSet",
)({
  Namespace: S.optional(S.String),
  Arn: S.String,
  PermissionPolicy: S.String,
  FormatVersion: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class RowLevelPermissionTagRule extends S.Class<RowLevelPermissionTagRule>(
  "RowLevelPermissionTagRule",
)({
  TagKey: S.String,
  ColumnName: S.String,
  TagMultiValueDelimiter: S.optional(S.String),
  MatchAllValue: S.optional(S.String),
}) {}
export const RowLevelPermissionTagRuleList = S.Array(RowLevelPermissionTagRule);
export const RowLevelPermissionTagRuleConfiguration = S.Array(S.String);
export const RowLevelPermissionTagRuleConfigurationList = S.Array(
  RowLevelPermissionTagRuleConfiguration,
);
export class RowLevelPermissionTagConfiguration extends S.Class<RowLevelPermissionTagConfiguration>(
  "RowLevelPermissionTagConfiguration",
)({
  Status: S.optional(S.String),
  TagRules: RowLevelPermissionTagRuleList,
  TagRuleConfigurations: S.optional(RowLevelPermissionTagRuleConfigurationList),
}) {}
export const PrincipalList = S.Array(S.String);
export const ColumnLevelPermissionRuleColumnNameList = S.Array(S.String);
export class ColumnLevelPermissionRule extends S.Class<ColumnLevelPermissionRule>(
  "ColumnLevelPermissionRule",
)({
  Principals: S.optional(PrincipalList),
  ColumnNames: S.optional(ColumnLevelPermissionRuleColumnNameList),
}) {}
export const ColumnLevelPermissionRuleList = S.Array(ColumnLevelPermissionRule);
export class DataSetUsageConfiguration extends S.Class<DataSetUsageConfiguration>(
  "DataSetUsageConfiguration",
)({
  DisableUseAsDirectQuerySource: S.optional(S.Boolean),
  DisableUseAsImportedSource: S.optional(S.Boolean),
}) {}
export class StringDatasetParameterDefaultValues extends S.Class<StringDatasetParameterDefaultValues>(
  "StringDatasetParameterDefaultValues",
)({ StaticValues: S.optional(StringDatasetParameterValueList) }) {}
export class StringDatasetParameter extends S.Class<StringDatasetParameter>(
  "StringDatasetParameter",
)({
  Id: S.String,
  Name: S.String,
  ValueType: S.String,
  DefaultValues: S.optional(StringDatasetParameterDefaultValues),
}) {}
export class DecimalDatasetParameterDefaultValues extends S.Class<DecimalDatasetParameterDefaultValues>(
  "DecimalDatasetParameterDefaultValues",
)({ StaticValues: S.optional(DecimalDatasetParameterValueList) }) {}
export class DecimalDatasetParameter extends S.Class<DecimalDatasetParameter>(
  "DecimalDatasetParameter",
)({
  Id: S.String,
  Name: S.String,
  ValueType: S.String,
  DefaultValues: S.optional(DecimalDatasetParameterDefaultValues),
}) {}
export class IntegerDatasetParameterDefaultValues extends S.Class<IntegerDatasetParameterDefaultValues>(
  "IntegerDatasetParameterDefaultValues",
)({ StaticValues: S.optional(IntegerDatasetParameterValueList) }) {}
export class IntegerDatasetParameter extends S.Class<IntegerDatasetParameter>(
  "IntegerDatasetParameter",
)({
  Id: S.String,
  Name: S.String,
  ValueType: S.String,
  DefaultValues: S.optional(IntegerDatasetParameterDefaultValues),
}) {}
export class DateTimeDatasetParameterDefaultValues extends S.Class<DateTimeDatasetParameterDefaultValues>(
  "DateTimeDatasetParameterDefaultValues",
)({ StaticValues: S.optional(DateTimeDatasetParameterValueList) }) {}
export class DateTimeDatasetParameter extends S.Class<DateTimeDatasetParameter>(
  "DateTimeDatasetParameter",
)({
  Id: S.String,
  Name: S.String,
  ValueType: S.String,
  TimeGranularity: S.optional(S.String),
  DefaultValues: S.optional(DateTimeDatasetParameterDefaultValues),
}) {}
export class DatasetParameter extends S.Class<DatasetParameter>(
  "DatasetParameter",
)({
  StringDatasetParameter: S.optional(StringDatasetParameter),
  DecimalDatasetParameter: S.optional(DecimalDatasetParameter),
  IntegerDatasetParameter: S.optional(IntegerDatasetParameter),
  DateTimeDatasetParameter: S.optional(DateTimeDatasetParameter),
}) {}
export const DatasetParameterList = S.Array(DatasetParameter);
export const UniqueKeyColumnNameList = S.Array(S.String);
export class UniqueKey extends S.Class<UniqueKey>("UniqueKey")({
  ColumnNames: UniqueKeyColumnNameList,
}) {}
export const UniqueKeyList = S.Array(UniqueKey);
export class PerformanceConfiguration extends S.Class<PerformanceConfiguration>(
  "PerformanceConfiguration",
)({ UniqueKeys: S.optional(UniqueKeyList) }) {}
export class ParentDataSet extends S.Class<ParentDataSet>("ParentDataSet")({
  DataSetArn: S.String,
  InputColumns: InputColumnList,
}) {}
export class SourceTable extends S.Class<SourceTable>("SourceTable")({
  PhysicalTableId: S.optional(S.String),
  DataSet: S.optional(ParentDataSet),
}) {}
export const SourceTableMap = S.Record({ key: S.String, value: SourceTable });
export class ImportTableOperationSource extends S.Class<ImportTableOperationSource>(
  "ImportTableOperationSource",
)({
  SourceTableId: S.String,
  ColumnIdMappings: S.optional(DataSetColumnIdMappingList),
}) {}
export class ImportTableOperation extends S.Class<ImportTableOperation>(
  "ImportTableOperation",
)({ Alias: S.String, Source: ImportTableOperationSource }) {}
export const FilterOperationList = S.Array(FilterOperation);
export class FiltersOperation extends S.Class<FiltersOperation>(
  "FiltersOperation",
)({
  Alias: S.String,
  Source: TransformOperationSource,
  FilterOperations: FilterOperationList,
}) {}
export const RenameColumnOperationList = S.Array(RenameColumnOperation);
export class RenameColumnsOperation extends S.Class<RenameColumnsOperation>(
  "RenameColumnsOperation",
)({
  Alias: S.String,
  Source: TransformOperationSource,
  RenameColumnOperations: RenameColumnOperationList,
}) {}
export const CastColumnTypeOperationList = S.Array(CastColumnTypeOperation);
export class CastColumnTypesOperation extends S.Class<CastColumnTypesOperation>(
  "CastColumnTypesOperation",
)({
  Alias: S.String,
  Source: TransformOperationSource,
  CastColumnTypeOperations: CastColumnTypeOperationList,
}) {}
export class OutputColumnNameOverride extends S.Class<OutputColumnNameOverride>(
  "OutputColumnNameOverride",
)({ SourceColumnName: S.optional(S.String), OutputColumnName: S.String }) {}
export const OutputColumnNameOverrideList = S.Array(OutputColumnNameOverride);
export class JoinOperandProperties extends S.Class<JoinOperandProperties>(
  "JoinOperandProperties",
)({ OutputColumnNameOverrides: OutputColumnNameOverrideList }) {}
export class JoinOperation extends S.Class<JoinOperation>("JoinOperation")({
  Alias: S.String,
  LeftOperand: TransformOperationSource,
  RightOperand: TransformOperationSource,
  Type: S.String,
  OnClause: S.String,
  LeftOperandProperties: S.optional(JoinOperandProperties),
  RightOperandProperties: S.optional(JoinOperandProperties),
}) {}
export const GroupByColumnNameList = S.Array(S.String);
export class DataPrepSimpleAggregationFunction extends S.Class<DataPrepSimpleAggregationFunction>(
  "DataPrepSimpleAggregationFunction",
)({ InputColumnName: S.optional(S.String), FunctionType: S.String }) {}
export class DataPrepListAggregationFunction extends S.Class<DataPrepListAggregationFunction>(
  "DataPrepListAggregationFunction",
)({
  InputColumnName: S.optional(S.String),
  Separator: S.String,
  Distinct: S.Boolean,
}) {}
export class DataPrepAggregationFunction extends S.Class<DataPrepAggregationFunction>(
  "DataPrepAggregationFunction",
)({
  SimpleAggregation: S.optional(DataPrepSimpleAggregationFunction),
  ListAggregation: S.optional(DataPrepListAggregationFunction),
}) {}
export class Aggregation extends S.Class<Aggregation>("Aggregation")({
  AggregationFunction: DataPrepAggregationFunction,
  NewColumnName: S.String,
  NewColumnId: S.String,
}) {}
export const AggregationList = S.Array(Aggregation);
export class AggregateOperation extends S.Class<AggregateOperation>(
  "AggregateOperation",
)({
  Alias: S.String,
  Source: TransformOperationSource,
  GroupByColumnNames: S.optional(GroupByColumnNameList),
  Aggregations: AggregationList,
}) {}
export const PivotGroupByColumnNameList = S.Array(S.String);
export class ValueColumnConfiguration extends S.Class<ValueColumnConfiguration>(
  "ValueColumnConfiguration",
)({ AggregationFunction: S.optional(DataPrepAggregationFunction) }) {}
export class PivotedLabel extends S.Class<PivotedLabel>("PivotedLabel")({
  LabelName: S.String,
  NewColumnName: S.String,
  NewColumnId: S.String,
}) {}
export const PivotedLabelList = S.Array(PivotedLabel);
export class PivotConfiguration extends S.Class<PivotConfiguration>(
  "PivotConfiguration",
)({ LabelColumnName: S.optional(S.String), PivotedLabels: PivotedLabelList }) {}
export class PivotOperation extends S.Class<PivotOperation>("PivotOperation")({
  Alias: S.String,
  Source: TransformOperationSource,
  GroupByColumnNames: S.optional(PivotGroupByColumnNameList),
  ValueColumnConfiguration: ValueColumnConfiguration,
  PivotConfiguration: PivotConfiguration,
}) {}
export class ColumnToUnpivot extends S.Class<ColumnToUnpivot>(
  "ColumnToUnpivot",
)({ ColumnName: S.optional(S.String), NewValue: S.optional(S.String) }) {}
export const ColumnToUnpivotList = S.Array(ColumnToUnpivot);
export class UnpivotOperation extends S.Class<UnpivotOperation>(
  "UnpivotOperation",
)({
  Alias: S.String,
  Source: TransformOperationSource,
  ColumnsToUnpivot: ColumnToUnpivotList,
  UnpivotedLabelColumnName: S.String,
  UnpivotedLabelColumnId: S.String,
  UnpivotedValueColumnName: S.String,
  UnpivotedValueColumnId: S.String,
}) {}
export class AppendedColumn extends S.Class<AppendedColumn>("AppendedColumn")({
  ColumnName: S.String,
  NewColumnId: S.String,
}) {}
export const AppendedColumnList = S.Array(AppendedColumn);
export class AppendOperation extends S.Class<AppendOperation>(
  "AppendOperation",
)({
  Alias: S.String,
  FirstSource: S.optional(TransformOperationSource),
  SecondSource: S.optional(TransformOperationSource),
  AppendedColumns: AppendedColumnList,
}) {}
export class TransformStep extends S.Class<TransformStep>("TransformStep")({
  ImportTableStep: S.optional(ImportTableOperation),
  ProjectStep: S.optional(ProjectOperation),
  FiltersStep: S.optional(FiltersOperation),
  CreateColumnsStep: S.optional(CreateColumnsOperation),
  RenameColumnsStep: S.optional(RenameColumnsOperation),
  CastColumnTypesStep: S.optional(CastColumnTypesOperation),
  JoinStep: S.optional(JoinOperation),
  AggregateStep: S.optional(AggregateOperation),
  PivotStep: S.optional(PivotOperation),
  UnpivotStep: S.optional(UnpivotOperation),
  AppendStep: S.optional(AppendOperation),
}) {}
export const TransformStepMap = S.Record({
  key: S.String,
  value: TransformStep,
});
export class DestinationTableSource extends S.Class<DestinationTableSource>(
  "DestinationTableSource",
)({ TransformOperationId: S.String }) {}
export class DestinationTable extends S.Class<DestinationTable>(
  "DestinationTable",
)({ Alias: S.String, Source: DestinationTableSource }) {}
export const DestinationTableMap = S.Record({
  key: S.String,
  value: DestinationTable,
});
export class DataPrepConfiguration extends S.Class<DataPrepConfiguration>(
  "DataPrepConfiguration",
)({
  SourceTableMap: SourceTableMap,
  TransformStepMap: TransformStepMap,
  DestinationTableMap: DestinationTableMap,
}) {}
export class RowLevelPermissionConfiguration extends S.Class<RowLevelPermissionConfiguration>(
  "RowLevelPermissionConfiguration",
)({
  TagConfiguration: S.optional(RowLevelPermissionTagConfiguration),
  RowLevelPermissionDataSet: S.optional(RowLevelPermissionDataSet),
}) {}
export class SemanticTable extends S.Class<SemanticTable>("SemanticTable")({
  Alias: S.String,
  DestinationTableId: S.String,
  RowLevelPermissionConfiguration: S.optional(RowLevelPermissionConfiguration),
}) {}
export const SemanticTableMap = S.Record({
  key: S.String,
  value: SemanticTable,
});
export class SemanticModelConfiguration extends S.Class<SemanticModelConfiguration>(
  "SemanticModelConfiguration",
)({ TableMap: S.optional(SemanticTableMap) }) {}
export class UpdateDataSetRequest extends S.Class<UpdateDataSetRequest>(
  "UpdateDataSetRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    Name: S.String,
    PhysicalTableMap: PhysicalTableMap,
    LogicalTableMap: S.optional(LogicalTableMap),
    ImportMode: S.String,
    ColumnGroups: S.optional(ColumnGroupList),
    FieldFolders: S.optional(FieldFolderMap),
    RowLevelPermissionDataSet: S.optional(RowLevelPermissionDataSet),
    RowLevelPermissionTagConfiguration: S.optional(
      RowLevelPermissionTagConfiguration,
    ),
    ColumnLevelPermissionRules: S.optional(ColumnLevelPermissionRuleList),
    DataSetUsageConfiguration: S.optional(DataSetUsageConfiguration),
    DatasetParameters: S.optional(DatasetParameterList),
    PerformanceConfiguration: S.optional(PerformanceConfiguration),
    DataPrepConfiguration: S.optional(DataPrepConfiguration),
    SemanticModelConfiguration: S.optional(SemanticModelConfiguration),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataSetPermissionsRequest extends S.Class<UpdateDataSetPermissionsRequest>(
  "UpdateDataSetPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    GrantPermissions: S.optional(ResourcePermissionList),
    RevokePermissions: S.optional(ResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AmazonElasticsearchParameters extends S.Class<AmazonElasticsearchParameters>(
  "AmazonElasticsearchParameters",
)({ Domain: S.String }) {}
export class IdentityCenterConfiguration extends S.Class<IdentityCenterConfiguration>(
  "IdentityCenterConfiguration",
)({ EnableIdentityPropagation: S.optional(S.Boolean) }) {}
export class AthenaParameters extends S.Class<AthenaParameters>(
  "AthenaParameters",
)({
  WorkGroup: S.optional(S.String),
  RoleArn: S.optional(S.String),
  IdentityCenterConfiguration: S.optional(IdentityCenterConfiguration),
}) {}
export class AuroraParameters extends S.Class<AuroraParameters>(
  "AuroraParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class AuroraPostgreSqlParameters extends S.Class<AuroraPostgreSqlParameters>(
  "AuroraPostgreSqlParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class AwsIotAnalyticsParameters extends S.Class<AwsIotAnalyticsParameters>(
  "AwsIotAnalyticsParameters",
)({ DataSetName: S.String }) {}
export class JiraParameters extends S.Class<JiraParameters>("JiraParameters")({
  SiteBaseUrl: S.String,
}) {}
export class MariaDbParameters extends S.Class<MariaDbParameters>(
  "MariaDbParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class MySqlParameters extends S.Class<MySqlParameters>(
  "MySqlParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class OracleParameters extends S.Class<OracleParameters>(
  "OracleParameters",
)({
  Host: S.String,
  Port: S.Number,
  Database: S.String,
  UseServiceName: S.optional(S.Boolean),
}) {}
export class PostgreSqlParameters extends S.Class<PostgreSqlParameters>(
  "PostgreSqlParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class PrestoParameters extends S.Class<PrestoParameters>(
  "PrestoParameters",
)({ Host: S.String, Port: S.Number, Catalog: S.String }) {}
export class RdsParameters extends S.Class<RdsParameters>("RdsParameters")({
  InstanceId: S.String,
  Database: S.String,
}) {}
export const DatabaseGroupList = S.Array(S.String);
export class RedshiftIAMParameters extends S.Class<RedshiftIAMParameters>(
  "RedshiftIAMParameters",
)({
  RoleArn: S.String,
  DatabaseUser: S.optional(S.String),
  DatabaseGroups: S.optional(DatabaseGroupList),
  AutoCreateDatabaseUser: S.optional(S.Boolean),
}) {}
export class RedshiftParameters extends S.Class<RedshiftParameters>(
  "RedshiftParameters",
)({
  Host: S.optional(S.String),
  Port: S.optional(S.Number),
  Database: S.String,
  ClusterId: S.optional(S.String),
  IAMParameters: S.optional(RedshiftIAMParameters),
  IdentityCenterConfiguration: S.optional(IdentityCenterConfiguration),
}) {}
export class ManifestFileLocation extends S.Class<ManifestFileLocation>(
  "ManifestFileLocation",
)({ Bucket: S.String, Key: S.String }) {}
export class S3Parameters extends S.Class<S3Parameters>("S3Parameters")({
  ManifestFileLocation: ManifestFileLocation,
  RoleArn: S.optional(S.String),
}) {}
export class S3KnowledgeBaseParameters extends S.Class<S3KnowledgeBaseParameters>(
  "S3KnowledgeBaseParameters",
)({
  RoleArn: S.optional(S.String),
  BucketUrl: S.String,
  MetadataFilesLocation: S.optional(S.String),
}) {}
export class ServiceNowParameters extends S.Class<ServiceNowParameters>(
  "ServiceNowParameters",
)({ SiteBaseUrl: S.String }) {}
export class VpcConnectionProperties extends S.Class<VpcConnectionProperties>(
  "VpcConnectionProperties",
)({ VpcConnectionArn: S.String }) {}
export class OAuthParameters extends S.Class<OAuthParameters>(
  "OAuthParameters",
)({
  TokenProviderUrl: S.String,
  OAuthScope: S.optional(S.String),
  IdentityProviderVpcConnectionProperties: S.optional(VpcConnectionProperties),
  IdentityProviderResourceUri: S.optional(S.String),
}) {}
export class SnowflakeParameters extends S.Class<SnowflakeParameters>(
  "SnowflakeParameters",
)({
  Host: S.String,
  Database: S.String,
  Warehouse: S.String,
  AuthenticationType: S.optional(S.String),
  DatabaseAccessControlRole: S.optional(S.String),
  OAuthParameters: S.optional(OAuthParameters),
}) {}
export class SparkParameters extends S.Class<SparkParameters>(
  "SparkParameters",
)({ Host: S.String, Port: S.Number }) {}
export class SqlServerParameters extends S.Class<SqlServerParameters>(
  "SqlServerParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class TeradataParameters extends S.Class<TeradataParameters>(
  "TeradataParameters",
)({ Host: S.String, Port: S.Number, Database: S.String }) {}
export class TwitterParameters extends S.Class<TwitterParameters>(
  "TwitterParameters",
)({ Query: S.String, MaxRows: S.Number }) {}
export class AmazonOpenSearchParameters extends S.Class<AmazonOpenSearchParameters>(
  "AmazonOpenSearchParameters",
)({ Domain: S.String }) {}
export class ExasolParameters extends S.Class<ExasolParameters>(
  "ExasolParameters",
)({ Host: S.String, Port: S.Number }) {}
export class DatabricksParameters extends S.Class<DatabricksParameters>(
  "DatabricksParameters",
)({ Host: S.String, Port: S.Number, SqlEndpointPath: S.String }) {}
export class StarburstParameters extends S.Class<StarburstParameters>(
  "StarburstParameters",
)({
  Host: S.String,
  Port: S.Number,
  Catalog: S.String,
  ProductType: S.optional(S.String),
  DatabaseAccessControlRole: S.optional(S.String),
  AuthenticationType: S.optional(S.String),
  OAuthParameters: S.optional(OAuthParameters),
}) {}
export class TrinoParameters extends S.Class<TrinoParameters>(
  "TrinoParameters",
)({ Host: S.String, Port: S.Number, Catalog: S.String }) {}
export class BigQueryParameters extends S.Class<BigQueryParameters>(
  "BigQueryParameters",
)({ ProjectId: S.String, DataSetRegion: S.optional(S.String) }) {}
export class ImpalaParameters extends S.Class<ImpalaParameters>(
  "ImpalaParameters",
)({
  Host: S.String,
  Port: S.Number,
  Database: S.optional(S.String),
  SqlEndpointPath: S.String,
}) {}
export class CustomConnectionParameters extends S.Class<CustomConnectionParameters>(
  "CustomConnectionParameters",
)({ ConnectionType: S.optional(S.String) }) {}
export class WebCrawlerParameters extends S.Class<WebCrawlerParameters>(
  "WebCrawlerParameters",
)({
  WebCrawlerAuthType: S.String,
  UsernameFieldXpath: S.optional(S.String),
  PasswordFieldXpath: S.optional(S.String),
  UsernameButtonXpath: S.optional(S.String),
  PasswordButtonXpath: S.optional(S.String),
  LoginPageUrl: S.optional(S.String),
  WebProxyHostName: S.optional(S.String),
  WebProxyPortNumber: S.optional(S.Number),
}) {}
export class ConfluenceParameters extends S.Class<ConfluenceParameters>(
  "ConfluenceParameters",
)({ ConfluenceUrl: S.String }) {}
export class QBusinessParameters extends S.Class<QBusinessParameters>(
  "QBusinessParameters",
)({ ApplicationArn: S.String }) {}
export const DataSourceParameters = S.Union(
  S.Struct({ AmazonElasticsearchParameters: AmazonElasticsearchParameters }),
  S.Struct({ AthenaParameters: AthenaParameters }),
  S.Struct({ AuroraParameters: AuroraParameters }),
  S.Struct({ AuroraPostgreSqlParameters: AuroraPostgreSqlParameters }),
  S.Struct({ AwsIotAnalyticsParameters: AwsIotAnalyticsParameters }),
  S.Struct({ JiraParameters: JiraParameters }),
  S.Struct({ MariaDbParameters: MariaDbParameters }),
  S.Struct({ MySqlParameters: MySqlParameters }),
  S.Struct({ OracleParameters: OracleParameters }),
  S.Struct({ PostgreSqlParameters: PostgreSqlParameters }),
  S.Struct({ PrestoParameters: PrestoParameters }),
  S.Struct({ RdsParameters: RdsParameters }),
  S.Struct({ RedshiftParameters: RedshiftParameters }),
  S.Struct({ S3Parameters: S3Parameters }),
  S.Struct({ S3KnowledgeBaseParameters: S3KnowledgeBaseParameters }),
  S.Struct({ ServiceNowParameters: ServiceNowParameters }),
  S.Struct({ SnowflakeParameters: SnowflakeParameters }),
  S.Struct({ SparkParameters: SparkParameters }),
  S.Struct({ SqlServerParameters: SqlServerParameters }),
  S.Struct({ TeradataParameters: TeradataParameters }),
  S.Struct({ TwitterParameters: TwitterParameters }),
  S.Struct({ AmazonOpenSearchParameters: AmazonOpenSearchParameters }),
  S.Struct({ ExasolParameters: ExasolParameters }),
  S.Struct({ DatabricksParameters: DatabricksParameters }),
  S.Struct({ StarburstParameters: StarburstParameters }),
  S.Struct({ TrinoParameters: TrinoParameters }),
  S.Struct({ BigQueryParameters: BigQueryParameters }),
  S.Struct({ ImpalaParameters: ImpalaParameters }),
  S.Struct({ CustomConnectionParameters: CustomConnectionParameters }),
  S.Struct({ WebCrawlerParameters: WebCrawlerParameters }),
  S.Struct({ ConfluenceParameters: ConfluenceParameters }),
  S.Struct({ QBusinessParameters: QBusinessParameters }),
);
export const DataSourceParametersList = S.Array(DataSourceParameters);
export class CredentialPair extends S.Class<CredentialPair>("CredentialPair")({
  Username: S.String,
  Password: S.String,
  AlternateDataSourceParameters: S.optional(DataSourceParametersList),
}) {}
export class KeyPairCredentials extends S.Class<KeyPairCredentials>(
  "KeyPairCredentials",
)({
  KeyPairUsername: S.String,
  PrivateKey: S.String,
  PrivateKeyPassphrase: S.optional(S.String),
}) {}
export class WebProxyCredentials extends S.Class<WebProxyCredentials>(
  "WebProxyCredentials",
)({ WebProxyUsername: S.String, WebProxyPassword: S.String }) {}
export class DataSourceCredentials extends S.Class<DataSourceCredentials>(
  "DataSourceCredentials",
)({
  CredentialPair: S.optional(CredentialPair),
  CopySourceArn: S.optional(S.String),
  SecretArn: S.optional(S.String),
  KeyPairCredentials: S.optional(KeyPairCredentials),
  WebProxyCredentials: S.optional(WebProxyCredentials),
}) {}
export class SslProperties extends S.Class<SslProperties>("SslProperties")({
  DisableSsl: S.optional(S.Boolean),
}) {}
export class UpdateDataSourceRequest extends S.Class<UpdateDataSourceRequest>(
  "UpdateDataSourceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String.pipe(T.HttpLabel("DataSourceId")),
    Name: S.String,
    DataSourceParameters: S.optional(DataSourceParameters),
    Credentials: S.optional(DataSourceCredentials),
    VpcConnectionProperties: S.optional(VpcConnectionProperties),
    SslProperties: S.optional(SslProperties),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/data-sources/{DataSourceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataSourcePermissionsRequest extends S.Class<UpdateDataSourcePermissionsRequest>(
  "UpdateDataSourcePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String.pipe(T.HttpLabel("DataSourceId")),
    GrantPermissions: S.optional(ResourcePermissionList),
    RevokePermissions: S.optional(ResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/data-sources/{DataSourceId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDefaultQBusinessApplicationRequest extends S.Class<UpdateDefaultQBusinessApplicationRequest>(
  "UpdateDefaultQBusinessApplicationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    ApplicationId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/default-qbusiness-application",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFolderRequest extends S.Class<UpdateFolderRequest>(
  "UpdateFolderRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    Name: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFolderPermissionsRequest extends S.Class<UpdateFolderPermissionsRequest>(
  "UpdateFolderPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FolderId: S.String.pipe(T.HttpLabel("FolderId")),
    GrantPermissions: S.optional(ResourcePermissionList),
    RevokePermissions: S.optional(ResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/folders/{FolderId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    GroupName: S.String.pipe(T.HttpLabel("GroupName")),
    Description: S.optional(S.String),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups/{GroupName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const IdentityNameList = S.Array(S.String);
export const IdentityMap = S.Record({ key: S.String, value: IdentityNameList });
export class UpdateIAMPolicyAssignmentRequest extends S.Class<UpdateIAMPolicyAssignmentRequest>(
  "UpdateIAMPolicyAssignmentRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssignmentName: S.String.pipe(T.HttpLabel("AssignmentName")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    AssignmentStatus: S.optional(S.String),
    PolicyArn: S.optional(S.String),
    Identities: S.optional(IdentityMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/iam-policy-assignments/{AssignmentName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateIdentityPropagationConfigRequest extends S.Class<UpdateIdentityPropagationConfigRequest>(
  "UpdateIdentityPropagationConfigRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Service: S.String.pipe(T.HttpLabel("Service")),
    AuthorizedTargets: S.optional(AuthorizedTargetsList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/identity-propagation-config/{Service}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePublicSharingSettingsRequest extends S.Class<UpdatePublicSharingSettingsRequest>(
  "UpdatePublicSharingSettingsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    PublicSharingEnabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/public-sharing-settings",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQPersonalizationConfigurationRequest extends S.Class<UpdateQPersonalizationConfigurationRequest>(
  "UpdateQPersonalizationConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    PersonalizationMode: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/q-personalization-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQuickSightQSearchConfigurationRequest extends S.Class<UpdateQuickSightQSearchConfigurationRequest>(
  "UpdateQuickSightQSearchConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    QSearchStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/quicksight-q-search-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScheduleRefreshOnEntity extends S.Class<ScheduleRefreshOnEntity>(
  "ScheduleRefreshOnEntity",
)({ DayOfWeek: S.optional(S.String), DayOfMonth: S.optional(S.String) }) {}
export class RefreshFrequency extends S.Class<RefreshFrequency>(
  "RefreshFrequency",
)({
  Interval: S.String,
  RefreshOnDay: S.optional(ScheduleRefreshOnEntity),
  Timezone: S.optional(S.String),
  TimeOfTheDay: S.optional(S.String),
}) {}
export class RefreshSchedule extends S.Class<RefreshSchedule>(
  "RefreshSchedule",
)({
  ScheduleId: S.String,
  ScheduleFrequency: RefreshFrequency,
  StartAfterDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RefreshType: S.String,
  Arn: S.optional(S.String),
}) {}
export class UpdateRefreshScheduleRequest extends S.Class<UpdateRefreshScheduleRequest>(
  "UpdateRefreshScheduleRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Schedule: RefreshSchedule,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-schedules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoleCustomPermissionRequest extends S.Class<UpdateRoleCustomPermissionRequest>(
  "UpdateRoleCustomPermissionRequest",
)(
  {
    CustomPermissionsName: S.String,
    Role: S.String.pipe(T.HttpLabel("Role")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/roles/{Role}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSelfUpgradeRequest extends S.Class<UpdateSelfUpgradeRequest>(
  "UpdateSelfUpgradeRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    UpgradeRequestId: S.String,
    Action: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/update-self-upgrade-request",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSelfUpgradeConfigurationRequest extends S.Class<UpdateSelfUpgradeConfigurationRequest>(
  "UpdateSelfUpgradeConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    SelfUpgradeStatus: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/self-upgrade-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSPICECapacityConfigurationRequest extends S.Class<UpdateSPICECapacityConfigurationRequest>(
  "UpdateSPICECapacityConfigurationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    PurchaseMode: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/spice-capacity-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TemplateSourceAnalysis extends S.Class<TemplateSourceAnalysis>(
  "TemplateSourceAnalysis",
)({ Arn: S.String, DataSetReferences: DataSetReferenceList }) {}
export class TemplateSourceTemplate extends S.Class<TemplateSourceTemplate>(
  "TemplateSourceTemplate",
)({ Arn: S.String }) {}
export class TemplateSourceEntity extends S.Class<TemplateSourceEntity>(
  "TemplateSourceEntity",
)({
  SourceAnalysis: S.optional(TemplateSourceAnalysis),
  SourceTemplate: S.optional(TemplateSourceTemplate),
}) {}
export class ColumnSchema extends S.Class<ColumnSchema>("ColumnSchema")({
  Name: S.optional(S.String),
  DataType: S.optional(S.String),
  GeographicRole: S.optional(S.String),
}) {}
export const ColumnSchemaList = S.Array(ColumnSchema);
export class DataSetSchema extends S.Class<DataSetSchema>("DataSetSchema")({
  ColumnSchemaList: S.optional(ColumnSchemaList),
}) {}
export class ColumnGroupColumnSchema extends S.Class<ColumnGroupColumnSchema>(
  "ColumnGroupColumnSchema",
)({ Name: S.optional(S.String) }) {}
export const ColumnGroupColumnSchemaList = S.Array(ColumnGroupColumnSchema);
export class ColumnGroupSchema extends S.Class<ColumnGroupSchema>(
  "ColumnGroupSchema",
)({
  Name: S.optional(S.String),
  ColumnGroupColumnSchemaList: S.optional(ColumnGroupColumnSchemaList),
}) {}
export const ColumnGroupSchemaList = S.Array(ColumnGroupSchema);
export class DataSetConfiguration extends S.Class<DataSetConfiguration>(
  "DataSetConfiguration",
)({
  Placeholder: S.optional(S.String),
  DataSetSchema: S.optional(DataSetSchema),
  ColumnGroupSchemaList: S.optional(ColumnGroupSchemaList),
}) {}
export const DataSetConfigurationList = S.Array(DataSetConfiguration);
export class TemplateVersionDefinition extends S.Class<TemplateVersionDefinition>(
  "TemplateVersionDefinition",
)({
  DataSetConfigurations: DataSetConfigurationList,
  Sheets: S.optional(SheetDefinitionList),
  CalculatedFields: S.optional(CalculatedFields),
  ParameterDeclarations: S.optional(ParameterDeclarationList),
  FilterGroups: S.optional(FilterGroupList),
  ColumnConfigurations: S.optional(ColumnConfigurationList),
  AnalysisDefaults: S.optional(AnalysisDefaults),
  Options: S.optional(AssetOptions),
  QueryExecutionOptions: S.optional(QueryExecutionOptions),
  StaticFiles: S.optional(StaticFileList),
}) {}
export class UpdateTemplateRequest extends S.Class<UpdateTemplateRequest>(
  "UpdateTemplateRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    SourceEntity: S.optional(TemplateSourceEntity),
    VersionDescription: S.optional(S.String),
    Name: S.optional(S.String),
    Definition: S.optional(TemplateVersionDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateAliasRequest extends S.Class<UpdateTemplateAliasRequest>(
  "UpdateTemplateAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
    TemplateVersionNumber: S.Number,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplatePermissionsRequest extends S.Class<UpdateTemplatePermissionsRequest>(
  "UpdateTemplatePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    GrantPermissions: S.optional(UpdateResourcePermissionList),
    RevokePermissions: S.optional(UpdateResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ColorList = S.Array(S.String);
export class DataColorPalette extends S.Class<DataColorPalette>(
  "DataColorPalette",
)({
  Colors: S.optional(ColorList),
  MinMaxGradient: S.optional(ColorList),
  EmptyFillColor: S.optional(S.String),
}) {}
export class UIColorPalette extends S.Class<UIColorPalette>("UIColorPalette")({
  PrimaryForeground: S.optional(S.String),
  PrimaryBackground: S.optional(S.String),
  SecondaryForeground: S.optional(S.String),
  SecondaryBackground: S.optional(S.String),
  Accent: S.optional(S.String),
  AccentForeground: S.optional(S.String),
  Danger: S.optional(S.String),
  DangerForeground: S.optional(S.String),
  Warning: S.optional(S.String),
  WarningForeground: S.optional(S.String),
  Success: S.optional(S.String),
  SuccessForeground: S.optional(S.String),
  Dimension: S.optional(S.String),
  DimensionForeground: S.optional(S.String),
  Measure: S.optional(S.String),
  MeasureForeground: S.optional(S.String),
}) {}
export class BorderStyle extends S.Class<BorderStyle>("BorderStyle")({
  Color: S.optional(S.String),
  Show: S.optional(S.Boolean),
  Width: S.optional(S.String),
}) {}
export class TileStyle extends S.Class<TileStyle>("TileStyle")({
  BackgroundColor: S.optional(S.String),
  Border: S.optional(BorderStyle),
  BorderRadius: S.optional(S.String),
  Padding: S.optional(S.String),
}) {}
export class GutterStyle extends S.Class<GutterStyle>("GutterStyle")({
  Show: S.optional(S.Boolean),
}) {}
export class MarginStyle extends S.Class<MarginStyle>("MarginStyle")({
  Show: S.optional(S.Boolean),
}) {}
export class TileLayoutStyle extends S.Class<TileLayoutStyle>(
  "TileLayoutStyle",
)({ Gutter: S.optional(GutterStyle), Margin: S.optional(MarginStyle) }) {}
export class SheetBackgroundStyle extends S.Class<SheetBackgroundStyle>(
  "SheetBackgroundStyle",
)({ Color: S.optional(S.String), Gradient: S.optional(S.String) }) {}
export class SheetStyle extends S.Class<SheetStyle>("SheetStyle")({
  Tile: S.optional(TileStyle),
  TileLayout: S.optional(TileLayoutStyle),
  Background: S.optional(SheetBackgroundStyle),
}) {}
export class Font extends S.Class<Font>("Font")({
  FontFamily: S.optional(S.String),
}) {}
export const FontList = S.Array(Font);
export class VisualTitleFontConfiguration extends S.Class<VisualTitleFontConfiguration>(
  "VisualTitleFontConfiguration",
)({
  FontConfiguration: S.optional(FontConfiguration),
  TextAlignment: S.optional(S.String),
  TextTransform: S.optional(S.String),
}) {}
export class VisualSubtitleFontConfiguration extends S.Class<VisualSubtitleFontConfiguration>(
  "VisualSubtitleFontConfiguration",
)({
  FontConfiguration: S.optional(FontConfiguration),
  TextAlignment: S.optional(S.String),
  TextTransform: S.optional(S.String),
}) {}
export class Typography extends S.Class<Typography>("Typography")({
  FontFamilies: S.optional(FontList),
  AxisTitleFontConfiguration: S.optional(FontConfiguration),
  AxisLabelFontConfiguration: S.optional(FontConfiguration),
  LegendTitleFontConfiguration: S.optional(FontConfiguration),
  LegendValueFontConfiguration: S.optional(FontConfiguration),
  DataLabelFontConfiguration: S.optional(FontConfiguration),
  VisualTitleFontConfiguration: S.optional(VisualTitleFontConfiguration),
  VisualSubtitleFontConfiguration: S.optional(VisualSubtitleFontConfiguration),
}) {}
export class ThemeConfiguration extends S.Class<ThemeConfiguration>(
  "ThemeConfiguration",
)({
  DataColorPalette: S.optional(DataColorPalette),
  UIColorPalette: S.optional(UIColorPalette),
  Sheet: S.optional(SheetStyle),
  Typography: S.optional(Typography),
}) {}
export class UpdateThemeRequest extends S.Class<UpdateThemeRequest>(
  "UpdateThemeRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    Name: S.optional(S.String),
    BaseThemeId: S.String,
    VersionDescription: S.optional(S.String),
    Configuration: S.optional(ThemeConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/themes/{ThemeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThemeAliasRequest extends S.Class<UpdateThemeAliasRequest>(
  "UpdateThemeAliasRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    AliasName: S.String.pipe(T.HttpLabel("AliasName")),
    ThemeVersionNumber: S.Number,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/aliases/{AliasName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateThemePermissionsRequest extends S.Class<UpdateThemePermissionsRequest>(
  "UpdateThemePermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    GrantPermissions: S.optional(UpdateResourcePermissionList),
    RevokePermissions: S.optional(UpdateResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataAggregation extends S.Class<DataAggregation>(
  "DataAggregation",
)({
  DatasetRowDateGranularity: S.optional(S.String),
  DefaultDateColumnName: S.optional(S.String),
}) {}
export const Synonyms = S.Array(S.String);
export class CollectiveConstant extends S.Class<CollectiveConstant>(
  "CollectiveConstant",
)({ ValueList: S.optional(StringList) }) {}
export class TopicCategoryFilterConstant extends S.Class<TopicCategoryFilterConstant>(
  "TopicCategoryFilterConstant",
)({
  ConstantType: S.optional(S.String),
  SingularConstant: S.optional(S.String),
  CollectiveConstant: S.optional(CollectiveConstant),
}) {}
export class TopicCategoryFilter extends S.Class<TopicCategoryFilter>(
  "TopicCategoryFilter",
)({
  CategoryFilterFunction: S.optional(S.String),
  CategoryFilterType: S.optional(S.String),
  Constant: S.optional(TopicCategoryFilterConstant),
  Inverse: S.optional(S.Boolean),
}) {}
export class TopicSingularFilterConstant extends S.Class<TopicSingularFilterConstant>(
  "TopicSingularFilterConstant",
)({
  ConstantType: S.optional(S.String),
  SingularConstant: S.optional(S.String),
}) {}
export class TopicNumericEqualityFilter extends S.Class<TopicNumericEqualityFilter>(
  "TopicNumericEqualityFilter",
)({
  Constant: S.optional(TopicSingularFilterConstant),
  Aggregation: S.optional(S.String),
}) {}
export class RangeConstant extends S.Class<RangeConstant>("RangeConstant")({
  Minimum: S.optional(S.String),
  Maximum: S.optional(S.String),
}) {}
export class TopicRangeFilterConstant extends S.Class<TopicRangeFilterConstant>(
  "TopicRangeFilterConstant",
)({
  ConstantType: S.optional(S.String),
  RangeConstant: S.optional(RangeConstant),
}) {}
export class TopicNumericRangeFilter extends S.Class<TopicNumericRangeFilter>(
  "TopicNumericRangeFilter",
)({
  Inclusive: S.optional(S.Boolean),
  Constant: S.optional(TopicRangeFilterConstant),
  Aggregation: S.optional(S.String),
}) {}
export class TopicDateRangeFilter extends S.Class<TopicDateRangeFilter>(
  "TopicDateRangeFilter",
)({
  Inclusive: S.optional(S.Boolean),
  Constant: S.optional(TopicRangeFilterConstant),
}) {}
export class TopicRelativeDateFilter extends S.Class<TopicRelativeDateFilter>(
  "TopicRelativeDateFilter",
)({
  TimeGranularity: S.optional(S.String),
  RelativeDateFilterFunction: S.optional(S.String),
  Constant: S.optional(TopicSingularFilterConstant),
}) {}
export class TopicNullFilter extends S.Class<TopicNullFilter>(
  "TopicNullFilter",
)({
  NullFilterType: S.optional(S.String),
  Constant: S.optional(TopicSingularFilterConstant),
  Inverse: S.optional(S.Boolean),
}) {}
export class TopicFilter extends S.Class<TopicFilter>("TopicFilter")({
  FilterDescription: S.optional(S.String),
  FilterClass: S.optional(S.String),
  FilterName: S.String,
  FilterSynonyms: S.optional(Synonyms),
  OperandFieldName: S.String,
  FilterType: S.optional(S.String),
  CategoryFilter: S.optional(TopicCategoryFilter),
  NumericEqualityFilter: S.optional(TopicNumericEqualityFilter),
  NumericRangeFilter: S.optional(TopicNumericRangeFilter),
  DateRangeFilter: S.optional(TopicDateRangeFilter),
  RelativeDateFilter: S.optional(TopicRelativeDateFilter),
  NullFilter: S.optional(TopicNullFilter),
}) {}
export const TopicFilters = S.Array(TopicFilter);
export class ComparativeOrder extends S.Class<ComparativeOrder>(
  "ComparativeOrder",
)({
  UseOrdering: S.optional(S.String),
  SpecifedOrder: S.optional(StringList),
  TreatUndefinedSpecifiedValues: S.optional(S.String),
}) {}
export const TypeParameters = S.Record({ key: S.String, value: S.String });
export class SemanticType extends S.Class<SemanticType>("SemanticType")({
  TypeName: S.optional(S.String),
  SubTypeName: S.optional(S.String),
  TypeParameters: S.optional(TypeParameters),
  TruthyCellValue: S.optional(S.String),
  TruthyCellValueSynonyms: S.optional(SensitiveStringList),
  FalseyCellValue: S.optional(S.String),
  FalseyCellValueSynonyms: S.optional(SensitiveStringList),
}) {}
export const AuthorSpecifiedAggregations = S.Array(S.String);
export class NegativeFormat extends S.Class<NegativeFormat>("NegativeFormat")({
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
}) {}
export class DisplayFormatOptions extends S.Class<DisplayFormatOptions>(
  "DisplayFormatOptions",
)({
  UseBlankCellFormat: S.optional(S.Boolean),
  BlankCellFormat: S.optional(S.String),
  DateFormat: S.optional(S.String),
  DecimalSeparator: S.optional(S.String),
  GroupingSeparator: S.optional(S.String),
  UseGrouping: S.optional(S.Boolean),
  FractionDigits: S.optional(S.Number),
  Prefix: S.optional(S.String),
  Suffix: S.optional(S.String),
  UnitScaler: S.optional(S.String),
  NegativeFormat: S.optional(NegativeFormat),
  CurrencySymbol: S.optional(S.String),
}) {}
export class DefaultFormatting extends S.Class<DefaultFormatting>(
  "DefaultFormatting",
)({
  DisplayFormat: S.optional(S.String),
  DisplayFormatOptions: S.optional(DisplayFormatOptions),
}) {}
export class CellValueSynonym extends S.Class<CellValueSynonym>(
  "CellValueSynonym",
)({ CellValue: S.optional(S.String), Synonyms: S.optional(StringList) }) {}
export const CellValueSynonyms = S.Array(CellValueSynonym);
export class TopicColumn extends S.Class<TopicColumn>("TopicColumn")({
  ColumnName: S.String,
  ColumnFriendlyName: S.optional(S.String),
  ColumnDescription: S.optional(S.String),
  ColumnSynonyms: S.optional(Synonyms),
  ColumnDataRole: S.optional(S.String),
  Aggregation: S.optional(S.String),
  IsIncludedInTopic: S.optional(S.Boolean),
  DisableIndexing: S.optional(S.Boolean),
  ComparativeOrder: S.optional(ComparativeOrder),
  SemanticType: S.optional(SemanticType),
  TimeGranularity: S.optional(S.String),
  AllowedAggregations: S.optional(AuthorSpecifiedAggregations),
  NotAllowedAggregations: S.optional(AuthorSpecifiedAggregations),
  DefaultFormatting: S.optional(DefaultFormatting),
  NeverAggregateInFilter: S.optional(S.Boolean),
  CellValueSynonyms: S.optional(CellValueSynonyms),
  NonAdditive: S.optional(S.Boolean),
}) {}
export const TopicColumns = S.Array(TopicColumn);
export class TopicCalculatedField extends S.Class<TopicCalculatedField>(
  "TopicCalculatedField",
)({
  CalculatedFieldName: S.String,
  CalculatedFieldDescription: S.optional(S.String),
  Expression: S.String,
  CalculatedFieldSynonyms: S.optional(Synonyms),
  IsIncludedInTopic: S.optional(S.Boolean),
  DisableIndexing: S.optional(S.Boolean),
  ColumnDataRole: S.optional(S.String),
  TimeGranularity: S.optional(S.String),
  DefaultFormatting: S.optional(DefaultFormatting),
  Aggregation: S.optional(S.String),
  ComparativeOrder: S.optional(ComparativeOrder),
  SemanticType: S.optional(SemanticType),
  AllowedAggregations: S.optional(AuthorSpecifiedAggregations),
  NotAllowedAggregations: S.optional(AuthorSpecifiedAggregations),
  NeverAggregateInFilter: S.optional(S.Boolean),
  CellValueSynonyms: S.optional(CellValueSynonyms),
  NonAdditive: S.optional(S.Boolean),
}) {}
export const TopicCalculatedFields = S.Array(TopicCalculatedField);
export class SemanticEntityType extends S.Class<SemanticEntityType>(
  "SemanticEntityType",
)({
  TypeName: S.optional(S.String),
  SubTypeName: S.optional(S.String),
  TypeParameters: S.optional(TypeParameters),
}) {}
export const AggregationFunctionParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class NamedEntityDefinitionMetric extends S.Class<NamedEntityDefinitionMetric>(
  "NamedEntityDefinitionMetric",
)({
  Aggregation: S.optional(S.String),
  AggregationFunctionParameters: S.optional(AggregationFunctionParameters),
}) {}
export class NamedEntityDefinition extends S.Class<NamedEntityDefinition>(
  "NamedEntityDefinition",
)({
  FieldName: S.optional(S.String),
  PropertyName: S.optional(S.String),
  PropertyRole: S.optional(S.String),
  PropertyUsage: S.optional(S.String),
  Metric: S.optional(NamedEntityDefinitionMetric),
}) {}
export const NamedEntityDefinitions = S.Array(NamedEntityDefinition);
export class TopicNamedEntity extends S.Class<TopicNamedEntity>(
  "TopicNamedEntity",
)({
  EntityName: S.String,
  EntityDescription: S.optional(S.String),
  EntitySynonyms: S.optional(Synonyms),
  SemanticEntityType: S.optional(SemanticEntityType),
  Definition: S.optional(NamedEntityDefinitions),
}) {}
export const TopicNamedEntities = S.Array(TopicNamedEntity);
export class DatasetMetadata extends S.Class<DatasetMetadata>(
  "DatasetMetadata",
)({
  DatasetArn: S.String,
  DatasetName: S.optional(S.String),
  DatasetDescription: S.optional(S.String),
  DataAggregation: S.optional(DataAggregation),
  Filters: S.optional(TopicFilters),
  Columns: S.optional(TopicColumns),
  CalculatedFields: S.optional(TopicCalculatedFields),
  NamedEntities: S.optional(TopicNamedEntities),
}) {}
export const Datasets = S.Array(DatasetMetadata);
export class TopicConfigOptions extends S.Class<TopicConfigOptions>(
  "TopicConfigOptions",
)({ QBusinessInsightsEnabled: S.optional(S.Boolean) }) {}
export class TopicDetails extends S.Class<TopicDetails>("TopicDetails")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  UserExperienceVersion: S.optional(S.String),
  DataSets: S.optional(Datasets),
  ConfigOptions: S.optional(TopicConfigOptions),
}) {}
export class CustomInstructions extends S.Class<CustomInstructions>(
  "CustomInstructions",
)({ CustomInstructionsString: S.String }) {}
export class UpdateTopicRequest extends S.Class<UpdateTopicRequest>(
  "UpdateTopicRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    Topic: TopicDetails,
    CustomInstructions: S.optional(CustomInstructions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AwsAccountId}/topics/{TopicId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTopicPermissionsRequest extends S.Class<UpdateTopicPermissionsRequest>(
  "UpdateTopicPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    GrantPermissions: S.optional(UpdateResourcePermissionList),
    RevokePermissions: S.optional(UpdateResourcePermissionList),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TopicRefreshSchedule extends S.Class<TopicRefreshSchedule>(
  "TopicRefreshSchedule",
)({
  IsEnabled: S.Boolean,
  BasedOnSpiceSchedule: S.Boolean,
  StartingAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Timezone: S.optional(S.String),
  RepeatAt: S.optional(S.String),
  TopicScheduleType: S.optional(S.String),
}) {}
export class UpdateTopicRefreshScheduleRequest extends S.Class<UpdateTopicRefreshScheduleRequest>(
  "UpdateTopicRefreshScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    DatasetId: S.String.pipe(T.HttpLabel("DatasetId")),
    RefreshSchedule: TopicRefreshSchedule,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/schedules/{DatasetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    Email: S.String,
    Role: S.String,
    CustomPermissionsName: S.optional(S.String),
    UnapplyCustomPermissions: S.optional(S.Boolean),
    ExternalLoginFederationProviderType: S.optional(S.String),
    CustomFederationProviderUrl: S.optional(S.String),
    ExternalLoginId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserCustomPermissionRequest extends S.Class<UpdateUserCustomPermissionRequest>(
  "UpdateUserCustomPermissionRequest",
)(
  {
    UserName: S.String.pipe(T.HttpLabel("UserName")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    CustomPermissionsName: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/users/{UserName}/custom-permission",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateVPCConnectionRequest extends S.Class<UpdateVPCConnectionRequest>(
  "UpdateVPCConnectionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    VPCConnectionId: S.String.pipe(T.HttpLabel("VPCConnectionId")),
    Name: S.String,
    SubnetIds: SubnetIdList,
    SecurityGroupIds: SecurityGroupIdList,
    DnsResolvers: S.optional(DnsResolverList),
    RoleArn: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/vpc-connections/{VPCConnectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LinkSharingConfiguration extends S.Class<LinkSharingConfiguration>(
  "LinkSharingConfiguration",
)({ Permissions: S.optional(ResourcePermissionList) }) {}
export class SessionTag extends S.Class<SessionTag>("SessionTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const SessionTagList = S.Array(SessionTag);
export const PermissionsList = S.Array(Permission);
export const UserIdentifier = S.Union(
  S.Struct({ UserName: S.String }),
  S.Struct({ Email: S.String }),
  S.Struct({ UserArn: S.String }),
);
export class CustomPermissions extends S.Class<CustomPermissions>(
  "CustomPermissions",
)({
  Arn: S.optional(S.String),
  CustomPermissionsName: S.optional(S.String),
  Capabilities: S.optional(Capabilities),
}) {}
export const CustomPermissionsList = S.Array(CustomPermissions);
export class DataSourceErrorInfo extends S.Class<DataSourceErrorInfo>(
  "DataSourceErrorInfo",
)({ Type: S.optional(S.String), Message: S.optional(S.String) }) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  Arn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataSourceParameters: S.optional(DataSourceParameters),
  AlternateDataSourceParameters: S.optional(DataSourceParametersList),
  VpcConnectionProperties: S.optional(VpcConnectionProperties),
  SslProperties: S.optional(SslProperties),
  ErrorInfo: S.optional(DataSourceErrorInfo),
  SecretArn: S.optional(S.String),
}) {}
export const DataSourceList = S.Array(DataSource);
export const FoldersForResourceArnList = S.Array(S.String);
export class GroupMember extends S.Class<GroupMember>("GroupMember")({
  Arn: S.optional(S.String),
  MemberName: S.optional(S.String),
}) {}
export const GroupMemberList = S.Array(GroupMember);
export class Group extends S.Class<Group>("Group")({
  Arn: S.optional(S.String),
  GroupName: S.optional(S.String),
  Description: S.optional(S.String),
  PrincipalId: S.optional(S.String),
}) {}
export const GroupList = S.Array(Group);
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class RowInfo extends S.Class<RowInfo>("RowInfo")({
  RowsIngested: S.optional(S.Number),
  RowsDropped: S.optional(S.Number),
  TotalRowsInDataset: S.optional(S.Number),
}) {}
export class QueueInfo extends S.Class<QueueInfo>("QueueInfo")({
  WaitingOnIngestion: S.String,
  QueuedIngestion: S.String,
}) {}
export class Ingestion extends S.Class<Ingestion>("Ingestion")({
  Arn: S.String,
  IngestionId: S.optional(S.String),
  IngestionStatus: S.String,
  ErrorInfo: S.optional(ErrorInfo),
  RowInfo: S.optional(RowInfo),
  QueueInfo: S.optional(QueueInfo),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IngestionTimeInSeconds: S.optional(S.Number),
  IngestionSizeInBytes: S.optional(S.Number),
  RequestSource: S.optional(S.String),
  RequestType: S.optional(S.String),
}) {}
export const Ingestions = S.Array(Ingestion);
export class NamespaceError extends S.Class<NamespaceError>("NamespaceError")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class NamespaceInfoV2 extends S.Class<NamespaceInfoV2>(
  "NamespaceInfoV2",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  CapacityRegion: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  IdentityStore: S.optional(S.String),
  NamespaceError: S.optional(NamespaceError),
  IamIdentityCenterApplicationArn: S.optional(S.String),
  IamIdentityCenterInstanceArn: S.optional(S.String),
}) {}
export const Namespaces = S.Array(NamespaceInfoV2);
export const RefreshSchedules = S.Array(RefreshSchedule);
export class TemplateAlias extends S.Class<TemplateAlias>("TemplateAlias")({
  AliasName: S.optional(S.String),
  Arn: S.optional(S.String),
  TemplateVersionNumber: S.optional(S.Number),
}) {}
export const TemplateAliasList = S.Array(TemplateAlias);
export class ThemeAlias extends S.Class<ThemeAlias>("ThemeAlias")({
  Arn: S.optional(S.String),
  AliasName: S.optional(S.String),
  ThemeVersionNumber: S.optional(S.Number),
}) {}
export const ThemeAliasList = S.Array(ThemeAlias);
export class User extends S.Class<User>("User")({
  Arn: S.optional(S.String),
  UserName: S.optional(S.String),
  Email: S.optional(S.String),
  Role: S.optional(S.String),
  IdentityType: S.optional(S.String),
  Active: S.optional(S.Boolean),
  PrincipalId: S.optional(S.String),
  CustomPermissionsName: S.optional(S.String),
  ExternalLoginFederationProviderType: S.optional(S.String),
  ExternalLoginFederationProviderUrl: S.optional(S.String),
  ExternalLoginId: S.optional(S.String),
}) {}
export const UserList = S.Array(User);
export class DashboardVisualResult extends S.Class<DashboardVisualResult>(
  "DashboardVisualResult",
)({
  DashboardId: S.optional(S.String),
  DashboardName: S.optional(S.String),
  SheetId: S.optional(S.String),
  SheetName: S.optional(S.String),
  VisualId: S.optional(S.String),
  VisualTitle: S.optional(S.String),
  VisualSubtitle: S.optional(S.String),
  DashboardUrl: S.optional(S.String),
}) {}
export class GeneratedAnswerResult extends S.Class<GeneratedAnswerResult>(
  "GeneratedAnswerResult",
)({
  QuestionText: S.optional(S.String),
  AnswerStatus: S.optional(S.String),
  TopicId: S.optional(S.String),
  TopicName: S.optional(S.String),
  Restatement: S.optional(S.String),
  QuestionId: S.optional(S.String),
  AnswerId: S.optional(S.String),
  QuestionUrl: S.optional(S.String),
}) {}
export class QAResult extends S.Class<QAResult>("QAResult")({
  ResultType: S.optional(S.String),
  DashboardVisual: S.optional(DashboardVisualResult),
  GeneratedAnswer: S.optional(GeneratedAnswerResult),
}) {}
export const QAResults = S.Array(QAResult);
export class ActionConnectorSearchFilter extends S.Class<ActionConnectorSearchFilter>(
  "ActionConnectorSearchFilter",
)({ Name: S.String, Operator: S.String, Value: S.String }) {}
export const ActionConnectorSearchFilterList = S.Array(
  ActionConnectorSearchFilter,
);
export class AnalysisSearchFilter extends S.Class<AnalysisSearchFilter>(
  "AnalysisSearchFilter",
)({
  Operator: S.optional(S.String),
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const AnalysisSearchFilterList = S.Array(AnalysisSearchFilter);
export class DashboardSearchFilter extends S.Class<DashboardSearchFilter>(
  "DashboardSearchFilter",
)({
  Operator: S.String,
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const DashboardSearchFilterList = S.Array(DashboardSearchFilter);
export class DataSetSearchFilter extends S.Class<DataSetSearchFilter>(
  "DataSetSearchFilter",
)({ Operator: S.String, Name: S.String, Value: S.String }) {}
export const DataSetSearchFilterList = S.Array(DataSetSearchFilter);
export class DataSourceSearchFilter extends S.Class<DataSourceSearchFilter>(
  "DataSourceSearchFilter",
)({ Operator: S.String, Name: S.String, Value: S.String }) {}
export const DataSourceSearchFilterList = S.Array(DataSourceSearchFilter);
export class SearchFlowsFilter extends S.Class<SearchFlowsFilter>(
  "SearchFlowsFilter",
)({ Name: S.String, Operator: S.String, Value: S.String }) {}
export const SearchFlowsFilterList = S.Array(SearchFlowsFilter);
export class FolderSearchFilter extends S.Class<FolderSearchFilter>(
  "FolderSearchFilter",
)({
  Operator: S.optional(S.String),
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const FolderSearchFilterList = S.Array(FolderSearchFilter);
export class GroupSearchFilter extends S.Class<GroupSearchFilter>(
  "GroupSearchFilter",
)({ Operator: S.String, Name: S.String, Value: S.String }) {}
export const GroupSearchFilterList = S.Array(GroupSearchFilter);
export class TopicSearchFilter extends S.Class<TopicSearchFilter>(
  "TopicSearchFilter",
)({ Operator: S.String, Name: S.String, Value: S.String }) {}
export const TopicSearchFilterList = S.Array(TopicSearchFilter);
export class AssetBundleExportJobValidationStrategy extends S.Class<AssetBundleExportJobValidationStrategy>(
  "AssetBundleExportJobValidationStrategy",
)({ StrictModeForAllResources: S.optional(S.Boolean) }) {}
export class AssetBundleImportSource extends S.Class<AssetBundleImportSource>(
  "AssetBundleImportSource",
)({ Body: S.optional(T.Blob), S3Uri: S.optional(S.String) }) {}
export class AssetBundleImportJobOverrideValidationStrategy extends S.Class<AssetBundleImportJobOverrideValidationStrategy>(
  "AssetBundleImportJobOverrideValidationStrategy",
)({ StrictModeForAllResources: S.optional(S.Boolean) }) {}
export const UpdateFlowPermissionsInputGrantPermissionsList =
  S.Array(Permission);
export const IpRestrictionRuleMap = S.Record({
  key: S.String,
  value: S.String,
});
export const VpcIdRestrictionRuleMap = S.Record({
  key: S.String,
  value: S.String,
});
export const VpcEndpointIdRestrictionRuleMap = S.Record({
  key: S.String,
  value: S.String,
});
export class RegisteredCustomerManagedKey extends S.Class<RegisteredCustomerManagedKey>(
  "RegisteredCustomerManagedKey",
)({ KeyArn: S.optional(S.String), DefaultKey: S.optional(S.Boolean) }) {}
export const KeyRegistration = S.Array(RegisteredCustomerManagedKey);
export type TopicVisuals = TopicVisual[];
export const TopicVisuals = S.Array(
  S.suspend((): S.Schema<TopicVisual, any> => TopicVisual),
) as any as S.Schema<TopicVisuals>;
export const AnonymousUserDashboardEmbeddingConfigurationEnabledFeatures =
  S.Array(S.String);
export const AnonymousUserDashboardEmbeddingConfigurationDisabledFeatures =
  S.Array(S.String);
export const AssetBundleExportJobVPCConnectionPropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobRefreshSchedulePropertyToOverrideList =
  S.Array(S.String);
export const AssetBundleExportJobDataSourcePropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobDataSetPropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobThemePropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobAnalysisPropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobDashboardPropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleExportJobFolderPropertyToOverrideList = S.Array(
  S.String,
);
export const AssetBundleRestrictiveResourceIdList = S.Array(S.String);
export class CancelIngestionResponse extends S.Class<CancelIngestionResponse>(
  "CancelIngestionResponse",
)({
  Arn: S.optional(S.String),
  IngestionId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateAccountCustomizationRequest extends S.Class<CreateAccountCustomizationRequest>(
  "CreateAccountCustomizationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Namespace: S.optional(S.String).pipe(T.HttpQuery("namespace")),
    AccountCustomization: AccountCustomization,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/customizations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomPermissionsRequest extends S.Class<CreateCustomPermissionsRequest>(
  "CreateCustomPermissionsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    CustomPermissionsName: S.String,
    Capabilities: S.optional(Capabilities),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/custom-permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFolderResponse extends S.Class<CreateFolderResponse>(
  "CreateFolderResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  FolderId: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class CreateIAMPolicyAssignmentRequest extends S.Class<CreateIAMPolicyAssignmentRequest>(
  "CreateIAMPolicyAssignmentRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssignmentName: S.String,
    AssignmentStatus: S.String,
    PolicyArn: S.optional(S.String),
    Identities: S.optional(IdentityMap),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/iam-policy-assignments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateIngestionResponse extends S.Class<CreateIngestionResponse>(
  "CreateIngestionResponse",
)({
  Arn: S.optional(S.String),
  IngestionId: S.optional(S.String),
  IngestionStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateNamespaceResponse extends S.Class<CreateNamespaceResponse>(
  "CreateNamespaceResponse",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  CapacityRegion: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  IdentityStore: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateRoleMembershipResponse extends S.Class<CreateRoleMembershipResponse>(
  "CreateRoleMembershipResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateTopicRefreshScheduleRequest extends S.Class<CreateTopicRefreshScheduleRequest>(
  "CreateTopicRefreshScheduleRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    DatasetArn: S.String,
    DatasetName: S.optional(S.String),
    RefreshSchedule: TopicRefreshSchedule,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/schedules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateVPCConnectionResponse extends S.Class<CreateVPCConnectionResponse>(
  "CreateVPCConnectionResponse",
)({
  Arn: S.optional(S.String),
  VPCConnectionId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  AvailabilityStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteAccountCustomizationResponse extends S.Class<DeleteAccountCustomizationResponse>(
  "DeleteAccountCustomizationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteAccountCustomPermissionResponse extends S.Class<DeleteAccountCustomPermissionResponse>(
  "DeleteAccountCustomPermissionResponse",
)({ RequestId: S.optional(S.String), Status: S.optional(S.Number) }) {}
export class DeleteAccountSubscriptionResponse extends S.Class<DeleteAccountSubscriptionResponse>(
  "DeleteAccountSubscriptionResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteActionConnectorResponse extends S.Class<DeleteActionConnectorResponse>(
  "DeleteActionConnectorResponse",
)({
  Arn: S.optional(S.String),
  ActionConnectorId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteAnalysisResponse extends S.Class<DeleteAnalysisResponse>(
  "DeleteAnalysisResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  DeletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RequestId: S.optional(S.String),
}) {}
export class DeleteBrandResponse extends S.Class<DeleteBrandResponse>(
  "DeleteBrandResponse",
)({ RequestId: S.optional(S.String) }) {}
export class DeleteBrandAssignmentResponse extends S.Class<DeleteBrandAssignmentResponse>(
  "DeleteBrandAssignmentResponse",
)({ RequestId: S.optional(S.String) }) {}
export class DeleteCustomPermissionsResponse extends S.Class<DeleteCustomPermissionsResponse>(
  "DeleteCustomPermissionsResponse",
)({
  Status: S.optional(S.Number),
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class DeleteDashboardResponse extends S.Class<DeleteDashboardResponse>(
  "DeleteDashboardResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  DashboardId: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class DeleteDataSetResponse extends S.Class<DeleteDataSetResponse>(
  "DeleteDataSetResponse",
)({
  Arn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteDataSetRefreshPropertiesResponse extends S.Class<DeleteDataSetRefreshPropertiesResponse>(
  "DeleteDataSetRefreshPropertiesResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteDataSourceResponse extends S.Class<DeleteDataSourceResponse>(
  "DeleteDataSourceResponse",
)({
  Arn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteDefaultQBusinessApplicationResponse extends S.Class<DeleteDefaultQBusinessApplicationResponse>(
  "DeleteDefaultQBusinessApplicationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteFolderResponse extends S.Class<DeleteFolderResponse>(
  "DeleteFolderResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  FolderId: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class DeleteFolderMembershipResponse extends S.Class<DeleteFolderMembershipResponse>(
  "DeleteFolderMembershipResponse",
)({ Status: S.optional(S.Number), RequestId: S.optional(S.String) }) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteGroupMembershipResponse extends S.Class<DeleteGroupMembershipResponse>(
  "DeleteGroupMembershipResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteIAMPolicyAssignmentResponse extends S.Class<DeleteIAMPolicyAssignmentResponse>(
  "DeleteIAMPolicyAssignmentResponse",
)({
  AssignmentName: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteIdentityPropagationConfigResponse extends S.Class<DeleteIdentityPropagationConfigResponse>(
  "DeleteIdentityPropagationConfigResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteNamespaceResponse extends S.Class<DeleteNamespaceResponse>(
  "DeleteNamespaceResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteRefreshScheduleResponse extends S.Class<DeleteRefreshScheduleResponse>(
  "DeleteRefreshScheduleResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  ScheduleId: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class DeleteRoleCustomPermissionResponse extends S.Class<DeleteRoleCustomPermissionResponse>(
  "DeleteRoleCustomPermissionResponse",
)({ RequestId: S.optional(S.String), Status: S.optional(S.Number) }) {}
export class DeleteRoleMembershipResponse extends S.Class<DeleteRoleMembershipResponse>(
  "DeleteRoleMembershipResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteTemplateResponse extends S.Class<DeleteTemplateResponse>(
  "DeleteTemplateResponse",
)({
  RequestId: S.optional(S.String),
  Arn: S.optional(S.String),
  TemplateId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteTemplateAliasResponse extends S.Class<DeleteTemplateAliasResponse>(
  "DeleteTemplateAliasResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  TemplateId: S.optional(S.String),
  AliasName: S.optional(S.String),
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class DeleteThemeResponse extends S.Class<DeleteThemeResponse>(
  "DeleteThemeResponse",
)({
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  ThemeId: S.optional(S.String),
}) {}
export class DeleteThemeAliasResponse extends S.Class<DeleteThemeAliasResponse>(
  "DeleteThemeAliasResponse",
)({
  AliasName: S.optional(S.String),
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  ThemeId: S.optional(S.String),
}) {}
export class DeleteTopicResponse extends S.Class<DeleteTopicResponse>(
  "DeleteTopicResponse",
)({
  Arn: S.optional(S.String),
  TopicId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteTopicRefreshScheduleResponse extends S.Class<DeleteTopicRefreshScheduleResponse>(
  "DeleteTopicRefreshScheduleResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteUserByPrincipalIdResponse extends S.Class<DeleteUserByPrincipalIdResponse>(
  "DeleteUserByPrincipalIdResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteUserCustomPermissionResponse extends S.Class<DeleteUserCustomPermissionResponse>(
  "DeleteUserCustomPermissionResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DeleteVPCConnectionResponse extends S.Class<DeleteVPCConnectionResponse>(
  "DeleteVPCConnectionResponse",
)({
  Arn: S.optional(S.String),
  VPCConnectionId: S.optional(S.String),
  DeletionStatus: S.optional(S.String),
  AvailabilityStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeAccountCustomizationResponse extends S.Class<DescribeAccountCustomizationResponse>(
  "DescribeAccountCustomizationResponse",
)({
  Arn: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  Namespace: S.optional(S.String),
  AccountCustomization: S.optional(AccountCustomization),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeAccountCustomPermissionResponse extends S.Class<DescribeAccountCustomPermissionResponse>(
  "DescribeAccountCustomPermissionResponse",
)({
  CustomPermissionsName: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number),
}) {}
export class DescribeActionConnectorPermissionsResponse extends S.Class<DescribeActionConnectorPermissionsResponse>(
  "DescribeActionConnectorPermissionsResponse",
)({
  Arn: S.optional(S.String),
  ActionConnectorId: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeAnalysisPermissionsResponse extends S.Class<DescribeAnalysisPermissionsResponse>(
  "DescribeAnalysisPermissionsResponse",
)({
  AnalysisId: S.optional(S.String),
  AnalysisArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeBrandAssignmentResponse extends S.Class<DescribeBrandAssignmentResponse>(
  "DescribeBrandAssignmentResponse",
)({ RequestId: S.optional(S.String), BrandArn: S.optional(S.String) }) {}
export const ErrorList = S.Array(S.String);
export class Image extends S.Class<Image>("Image")({
  Source: S.optional(ImageSource),
  GeneratedImageUrl: S.optional(S.String),
}) {}
export class ImageSet extends S.Class<ImageSet>("ImageSet")({
  Original: Image,
  Height64: S.optional(Image),
  Height32: S.optional(Image),
}) {}
export class LogoSet extends S.Class<LogoSet>("LogoSet")({
  Primary: ImageSet,
  Favicon: S.optional(ImageSet),
}) {}
export class Logo extends S.Class<Logo>("Logo")({
  AltText: S.String,
  LogoSet: LogoSet,
}) {}
export class BrandDetail extends S.Class<BrandDetail>("BrandDetail")({
  BrandId: S.String,
  Arn: S.optional(S.String),
  BrandStatus: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionId: S.optional(S.String),
  VersionStatus: S.optional(S.String),
  Errors: S.optional(ErrorList),
  Logo: S.optional(Logo),
}) {}
export class DescribeBrandPublishedVersionResponse extends S.Class<DescribeBrandPublishedVersionResponse>(
  "DescribeBrandPublishedVersionResponse",
)({
  RequestId: S.optional(S.String),
  BrandDetail: S.optional(BrandDetail),
  BrandDefinition: S.optional(BrandDefinition),
}) {}
export class DescribeDashboardPermissionsResponse extends S.Class<DescribeDashboardPermissionsResponse>(
  "DescribeDashboardPermissionsResponse",
)({
  DashboardId: S.optional(S.String),
  DashboardArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  LinkSharingConfiguration: S.optional(LinkSharingConfiguration),
}) {}
export class DescribeDashboardsQAConfigurationResponse extends S.Class<DescribeDashboardsQAConfigurationResponse>(
  "DescribeDashboardsQAConfigurationResponse",
)({
  DashboardsQAStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeDataSetPermissionsResponse extends S.Class<DescribeDataSetPermissionsResponse>(
  "DescribeDataSetPermissionsResponse",
)({
  DataSetArn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class LookbackWindow extends S.Class<LookbackWindow>("LookbackWindow")({
  ColumnName: S.String,
  Size: S.Number,
  SizeUnit: S.String,
}) {}
export class IncrementalRefresh extends S.Class<IncrementalRefresh>(
  "IncrementalRefresh",
)({ LookbackWindow: LookbackWindow }) {}
export class RefreshConfiguration extends S.Class<RefreshConfiguration>(
  "RefreshConfiguration",
)({ IncrementalRefresh: IncrementalRefresh }) {}
export class RefreshFailureEmailAlert extends S.Class<RefreshFailureEmailAlert>(
  "RefreshFailureEmailAlert",
)({ AlertStatus: S.optional(S.String) }) {}
export class RefreshFailureConfiguration extends S.Class<RefreshFailureConfiguration>(
  "RefreshFailureConfiguration",
)({ EmailAlert: S.optional(RefreshFailureEmailAlert) }) {}
export class DataSetRefreshProperties extends S.Class<DataSetRefreshProperties>(
  "DataSetRefreshProperties",
)({
  RefreshConfiguration: S.optional(RefreshConfiguration),
  FailureConfiguration: S.optional(RefreshFailureConfiguration),
}) {}
export class DescribeDataSetRefreshPropertiesResponse extends S.Class<DescribeDataSetRefreshPropertiesResponse>(
  "DescribeDataSetRefreshPropertiesResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  DataSetRefreshProperties: S.optional(DataSetRefreshProperties),
}) {}
export class DescribeDataSourcePermissionsResponse extends S.Class<DescribeDataSourcePermissionsResponse>(
  "DescribeDataSourcePermissionsResponse",
)({
  DataSourceArn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeDefaultQBusinessApplicationResponse extends S.Class<DescribeDefaultQBusinessApplicationResponse>(
  "DescribeDefaultQBusinessApplicationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  ApplicationId: S.optional(S.String),
}) {}
export class DescribeFolderPermissionsResponse extends S.Class<DescribeFolderPermissionsResponse>(
  "DescribeFolderPermissionsResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  FolderId: S.optional(S.String),
  Arn: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class DescribeFolderResolvedPermissionsResponse extends S.Class<DescribeFolderResolvedPermissionsResponse>(
  "DescribeFolderResolvedPermissionsResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  FolderId: S.optional(S.String),
  Arn: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class DescribeGroupResponse extends S.Class<DescribeGroupResponse>(
  "DescribeGroupResponse",
)({
  Group: S.optional(Group),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeGroupMembershipResponse extends S.Class<DescribeGroupMembershipResponse>(
  "DescribeGroupMembershipResponse",
)({
  GroupMember: S.optional(GroupMember),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeIpRestrictionResponse extends S.Class<DescribeIpRestrictionResponse>(
  "DescribeIpRestrictionResponse",
)({
  AwsAccountId: S.optional(S.String),
  IpRestrictionRuleMap: S.optional(IpRestrictionRuleMap),
  VpcIdRestrictionRuleMap: S.optional(VpcIdRestrictionRuleMap),
  VpcEndpointIdRestrictionRuleMap: S.optional(VpcEndpointIdRestrictionRuleMap),
  Enabled: S.optional(S.Boolean),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeQPersonalizationConfigurationResponse extends S.Class<DescribeQPersonalizationConfigurationResponse>(
  "DescribeQPersonalizationConfigurationResponse",
)({
  PersonalizationMode: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeQuickSightQSearchConfigurationResponse extends S.Class<DescribeQuickSightQSearchConfigurationResponse>(
  "DescribeQuickSightQSearchConfigurationResponse",
)({
  QSearchStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeRefreshScheduleResponse extends S.Class<DescribeRefreshScheduleResponse>(
  "DescribeRefreshScheduleResponse",
)({
  RefreshSchedule: S.optional(RefreshSchedule),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class DescribeRoleCustomPermissionResponse extends S.Class<DescribeRoleCustomPermissionResponse>(
  "DescribeRoleCustomPermissionResponse",
)({
  CustomPermissionsName: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number),
}) {}
export class DescribeTemplateAliasResponse extends S.Class<DescribeTemplateAliasResponse>(
  "DescribeTemplateAliasResponse",
)({
  TemplateAlias: S.optional(TemplateAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeTemplatePermissionsResponse extends S.Class<DescribeTemplatePermissionsResponse>(
  "DescribeTemplatePermissionsResponse",
)({
  TemplateId: S.optional(S.String),
  TemplateArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeThemeAliasResponse extends S.Class<DescribeThemeAliasResponse>(
  "DescribeThemeAliasResponse",
)({
  ThemeAlias: S.optional(ThemeAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeThemePermissionsResponse extends S.Class<DescribeThemePermissionsResponse>(
  "DescribeThemePermissionsResponse",
)({
  ThemeId: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeTopicResponse extends S.Class<DescribeTopicResponse>(
  "DescribeTopicResponse",
)({
  Arn: S.optional(S.String),
  TopicId: S.optional(S.String),
  Topic: S.optional(TopicDetails),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  CustomInstructions: S.optional(CustomInstructions),
}) {}
export class DescribeTopicPermissionsResponse extends S.Class<DescribeTopicPermissionsResponse>(
  "DescribeTopicPermissionsResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeTopicRefreshScheduleResponse extends S.Class<DescribeTopicRefreshScheduleResponse>(
  "DescribeTopicRefreshScheduleResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  RefreshSchedule: S.optional(TopicRefreshSchedule),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class GenerateEmbedUrlForRegisteredUserWithIdentityResponse extends S.Class<GenerateEmbedUrlForRegisteredUserWithIdentityResponse>(
  "GenerateEmbedUrlForRegisteredUserWithIdentityResponse",
)({
  EmbedUrl: S.String,
  Status: S.Number.pipe(T.HttpResponseCode()),
  RequestId: S.String,
}) {}
export class GetDashboardEmbedUrlResponse extends S.Class<GetDashboardEmbedUrlResponse>(
  "GetDashboardEmbedUrlResponse",
)({
  EmbedUrl: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class GetFlowMetadataOutput extends S.Class<GetFlowMetadataOutput>(
  "GetFlowMetadataOutput",
)({
  Arn: S.String,
  FlowId: S.String,
  Name: S.String,
  Description: S.optional(S.String),
  PublishState: S.optional(S.String),
  UserCount: S.optional(S.Number),
  RunCount: S.optional(S.Number),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class GetFlowPermissionsOutput extends S.Class<GetFlowPermissionsOutput>(
  "GetFlowPermissionsOutput",
)({
  Arn: S.String,
  FlowId: S.String,
  Permissions: PermissionsList,
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class GetIdentityContextRequest extends S.Class<GetIdentityContextRequest>(
  "GetIdentityContextRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    UserIdentifier: UserIdentifier,
    Namespace: S.optional(S.String),
    SessionExpiresAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/identity-context",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionEmbedUrlResponse extends S.Class<GetSessionEmbedUrlResponse>(
  "GetSessionEmbedUrlResponse",
)({
  EmbedUrl: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListCustomPermissionsResponse extends S.Class<ListCustomPermissionsResponse>(
  "ListCustomPermissionsResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  CustomPermissionsList: S.optional(CustomPermissionsList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class ListDataSourcesResponse extends S.Class<ListDataSourcesResponse>(
  "ListDataSourcesResponse",
)({
  DataSources: S.optional(DataSourceList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListFoldersForResourceResponse extends S.Class<ListFoldersForResourceResponse>(
  "ListFoldersForResourceResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Folders: S.optional(FoldersForResourceArnList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class ListGroupMembershipsResponse extends S.Class<ListGroupMembershipsResponse>(
  "ListGroupMembershipsResponse",
)({
  GroupMemberList: S.optional(GroupMemberList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)({
  GroupList: S.optional(GroupList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListIngestionsResponse extends S.Class<ListIngestionsResponse>(
  "ListIngestionsResponse",
)({
  Ingestions: S.optional(Ingestions),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListNamespacesResponse extends S.Class<ListNamespacesResponse>(
  "ListNamespacesResponse",
)({
  Namespaces: S.optional(Namespaces),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListRefreshSchedulesResponse extends S.Class<ListRefreshSchedulesResponse>(
  "ListRefreshSchedulesResponse",
)({
  RefreshSchedules: S.optional(RefreshSchedules),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListRoleMembershipsResponse extends S.Class<ListRoleMembershipsResponse>(
  "ListRoleMembershipsResponse",
)({
  MembersList: S.optional(GroupsList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({
  Tags: S.optional(TagList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListTemplateAliasesResponse extends S.Class<ListTemplateAliasesResponse>(
  "ListTemplateAliasesResponse",
)({
  TemplateAliasList: S.optional(TemplateAliasList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListThemeAliasesResponse extends S.Class<ListThemeAliasesResponse>(
  "ListThemeAliasesResponse",
)({
  ThemeAliasList: S.optional(ThemeAliasList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListUserGroupsResponse extends S.Class<ListUserGroupsResponse>(
  "ListUserGroupsResponse",
)({
  GroupList: S.optional(GroupList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({
  UserList: S.optional(UserList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class RegisterUserResponse extends S.Class<RegisterUserResponse>(
  "RegisterUserResponse",
)({
  User: S.optional(User),
  UserInvitationUrl: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class RestoreAnalysisResponse extends S.Class<RestoreAnalysisResponse>(
  "RestoreAnalysisResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  RequestId: S.optional(S.String),
  RestorationFailedFolderArns: S.optional(FolderArnList),
}) {}
export class SearchActionConnectorsRequest extends S.Class<SearchActionConnectorsRequest>(
  "SearchActionConnectorsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    Filters: ActionConnectorSearchFilterList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/search/action-connectors",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchAnalysesRequest extends S.Class<SearchAnalysesRequest>(
  "SearchAnalysesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: AnalysisSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/search/analyses" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchDashboardsRequest extends S.Class<SearchDashboardsRequest>(
  "SearchDashboardsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: DashboardSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/search/dashboards",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchDataSetsRequest extends S.Class<SearchDataSetsRequest>(
  "SearchDataSetsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: DataSetSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/search/data-sets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchDataSourcesRequest extends S.Class<SearchDataSourcesRequest>(
  "SearchDataSourcesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: DataSourceSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/search/data-sources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchFlowsInput extends S.Class<SearchFlowsInput>(
  "SearchFlowsInput",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: SearchFlowsFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/flows/searchFlows",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchFoldersRequest extends S.Class<SearchFoldersRequest>(
  "SearchFoldersRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: FolderSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/search/folders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchGroupsRequest extends S.Class<SearchGroupsRequest>(
  "SearchGroupsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    Namespace: S.String.pipe(T.HttpLabel("Namespace")),
    Filters: GroupSearchFilterList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/namespaces/{Namespace}/groups-search",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchTopicsRequest extends S.Class<SearchTopicsRequest>(
  "SearchTopicsRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Filters: TopicSearchFilterList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/search/topics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDashboardSnapshotJobScheduleResponse extends S.Class<StartDashboardSnapshotJobScheduleResponse>(
  "StartDashboardSnapshotJobScheduleResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateAccountCustomizationResponse extends S.Class<UpdateAccountCustomizationResponse>(
  "UpdateAccountCustomizationResponse",
)({
  Arn: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  Namespace: S.optional(S.String),
  AccountCustomization: S.optional(AccountCustomization),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateAccountCustomPermissionResponse extends S.Class<UpdateAccountCustomPermissionResponse>(
  "UpdateAccountCustomPermissionResponse",
)({ RequestId: S.optional(S.String), Status: S.optional(S.Number) }) {}
export class UpdateAccountSettingsResponse extends S.Class<UpdateAccountSettingsResponse>(
  "UpdateAccountSettingsResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateActionConnectorResponse extends S.Class<UpdateActionConnectorResponse>(
  "UpdateActionConnectorResponse",
)({
  Arn: S.optional(S.String),
  ActionConnectorId: S.optional(S.String),
  RequestId: S.optional(S.String),
  UpdateStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateActionConnectorPermissionsResponse extends S.Class<UpdateActionConnectorPermissionsResponse>(
  "UpdateActionConnectorPermissionsResponse",
)({
  Arn: S.optional(S.String),
  ActionConnectorId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Permissions: S.optional(ResourcePermissionList),
}) {}
export class UpdateAnalysisResponse extends S.Class<UpdateAnalysisResponse>(
  "UpdateAnalysisResponse",
)({
  Arn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  UpdateStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateAnalysisPermissionsResponse extends S.Class<UpdateAnalysisPermissionsResponse>(
  "UpdateAnalysisPermissionsResponse",
)({
  AnalysisArn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateApplicationWithTokenExchangeGrantResponse extends S.Class<UpdateApplicationWithTokenExchangeGrantResponse>(
  "UpdateApplicationWithTokenExchangeGrantResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateBrandResponse extends S.Class<UpdateBrandResponse>(
  "UpdateBrandResponse",
)({
  RequestId: S.optional(S.String),
  BrandDetail: S.optional(BrandDetail),
  BrandDefinition: S.optional(BrandDefinition),
}) {}
export class UpdateBrandAssignmentResponse extends S.Class<UpdateBrandAssignmentResponse>(
  "UpdateBrandAssignmentResponse",
)({ RequestId: S.optional(S.String), BrandArn: S.optional(S.String) }) {}
export class UpdateBrandPublishedVersionResponse extends S.Class<UpdateBrandPublishedVersionResponse>(
  "UpdateBrandPublishedVersionResponse",
)({ RequestId: S.optional(S.String), VersionId: S.optional(S.String) }) {}
export class UpdateCustomPermissionsResponse extends S.Class<UpdateCustomPermissionsResponse>(
  "UpdateCustomPermissionsResponse",
)({
  Status: S.optional(S.Number),
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class UpdateDashboardResponse extends S.Class<UpdateDashboardResponse>(
  "UpdateDashboardResponse",
)({
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  DashboardId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number),
  RequestId: S.optional(S.String),
}) {}
export class UpdateDashboardLinksResponse extends S.Class<UpdateDashboardLinksResponse>(
  "UpdateDashboardLinksResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  DashboardArn: S.optional(S.String),
  LinkEntities: S.optional(LinkEntityArnList),
}) {}
export class UpdateDashboardPermissionsResponse extends S.Class<UpdateDashboardPermissionsResponse>(
  "UpdateDashboardPermissionsResponse",
)({
  DashboardArn: S.optional(S.String),
  DashboardId: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  LinkSharingConfiguration: S.optional(LinkSharingConfiguration),
}) {}
export class UpdateDashboardPublishedVersionResponse extends S.Class<UpdateDashboardPublishedVersionResponse>(
  "UpdateDashboardPublishedVersionResponse",
)({
  DashboardId: S.optional(S.String),
  DashboardArn: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateDashboardsQAConfigurationResponse extends S.Class<UpdateDashboardsQAConfigurationResponse>(
  "UpdateDashboardsQAConfigurationResponse",
)({
  DashboardsQAStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateDataSetResponse extends S.Class<UpdateDataSetResponse>(
  "UpdateDataSetResponse",
)({
  Arn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  IngestionArn: S.optional(S.String),
  IngestionId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateDataSetPermissionsResponse extends S.Class<UpdateDataSetPermissionsResponse>(
  "UpdateDataSetPermissionsResponse",
)({
  DataSetArn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateDataSourceResponse extends S.Class<UpdateDataSourceResponse>(
  "UpdateDataSourceResponse",
)({
  Arn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  UpdateStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateDataSourcePermissionsResponse extends S.Class<UpdateDataSourcePermissionsResponse>(
  "UpdateDataSourcePermissionsResponse",
)({
  DataSourceArn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateDefaultQBusinessApplicationResponse extends S.Class<UpdateDefaultQBusinessApplicationResponse>(
  "UpdateDefaultQBusinessApplicationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateFlowPermissionsInput extends S.Class<UpdateFlowPermissionsInput>(
  "UpdateFlowPermissionsInput",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    FlowId: S.String.pipe(T.HttpLabel("FlowId")),
    GrantPermissions: S.optional(
      UpdateFlowPermissionsInputGrantPermissionsList,
    ),
    RevokePermissions: S.optional(
      UpdateFlowPermissionsInputRevokePermissionsList,
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/flows/{FlowId}/permissions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFolderResponse extends S.Class<UpdateFolderResponse>(
  "UpdateFolderResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.optional(S.String),
  FolderId: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class UpdateFolderPermissionsResponse extends S.Class<UpdateFolderPermissionsResponse>(
  "UpdateFolderPermissionsResponse",
)({
  Status: S.optional(S.Number),
  Arn: S.optional(S.String),
  FolderId: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  RequestId: S.optional(S.String),
}) {}
export class UpdateGroupResponse extends S.Class<UpdateGroupResponse>(
  "UpdateGroupResponse",
)({
  Group: S.optional(Group),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateIAMPolicyAssignmentResponse extends S.Class<UpdateIAMPolicyAssignmentResponse>(
  "UpdateIAMPolicyAssignmentResponse",
)({
  AssignmentName: S.optional(S.String),
  AssignmentId: S.optional(S.String),
  PolicyArn: S.optional(S.String),
  Identities: S.optional(IdentityMap),
  AssignmentStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateIdentityPropagationConfigResponse extends S.Class<UpdateIdentityPropagationConfigResponse>(
  "UpdateIdentityPropagationConfigResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateIpRestrictionRequest extends S.Class<UpdateIpRestrictionRequest>(
  "UpdateIpRestrictionRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    IpRestrictionRuleMap: S.optional(IpRestrictionRuleMap),
    VpcIdRestrictionRuleMap: S.optional(VpcIdRestrictionRuleMap),
    VpcEndpointIdRestrictionRuleMap: S.optional(
      VpcEndpointIdRestrictionRuleMap,
    ),
    Enabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/ip-restriction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateKeyRegistrationRequest extends S.Class<UpdateKeyRegistrationRequest>(
  "UpdateKeyRegistrationRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    KeyRegistration: KeyRegistration,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/key-registration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePublicSharingSettingsResponse extends S.Class<UpdatePublicSharingSettingsResponse>(
  "UpdatePublicSharingSettingsResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateQPersonalizationConfigurationResponse extends S.Class<UpdateQPersonalizationConfigurationResponse>(
  "UpdateQPersonalizationConfigurationResponse",
)({
  PersonalizationMode: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateQuickSightQSearchConfigurationResponse extends S.Class<UpdateQuickSightQSearchConfigurationResponse>(
  "UpdateQuickSightQSearchConfigurationResponse",
)({
  QSearchStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateRefreshScheduleResponse extends S.Class<UpdateRefreshScheduleResponse>(
  "UpdateRefreshScheduleResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  ScheduleId: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class UpdateRoleCustomPermissionResponse extends S.Class<UpdateRoleCustomPermissionResponse>(
  "UpdateRoleCustomPermissionResponse",
)({ RequestId: S.optional(S.String), Status: S.optional(S.Number) }) {}
export class SelfUpgradeRequestDetail extends S.Class<SelfUpgradeRequestDetail>(
  "SelfUpgradeRequestDetail",
)({
  UpgradeRequestId: S.optional(S.String),
  UserName: S.optional(S.String),
  OriginalRole: S.optional(S.String),
  RequestedRole: S.optional(S.String),
  RequestNote: S.optional(S.String),
  CreationTime: S.optional(S.Number),
  RequestStatus: S.optional(S.String),
  lastUpdateAttemptTime: S.optional(S.Number),
  lastUpdateFailureReason: S.optional(S.String),
}) {}
export class UpdateSelfUpgradeResponse extends S.Class<UpdateSelfUpgradeResponse>(
  "UpdateSelfUpgradeResponse",
)({
  SelfUpgradeRequestDetail: S.optional(SelfUpgradeRequestDetail),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateSelfUpgradeConfigurationResponse extends S.Class<UpdateSelfUpgradeConfigurationResponse>(
  "UpdateSelfUpgradeConfigurationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateSPICECapacityConfigurationResponse extends S.Class<UpdateSPICECapacityConfigurationResponse>(
  "UpdateSPICECapacityConfigurationResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateTemplateResponse extends S.Class<UpdateTemplateResponse>(
  "UpdateTemplateResponse",
)({
  TemplateId: S.optional(S.String),
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateTemplateAliasResponse extends S.Class<UpdateTemplateAliasResponse>(
  "UpdateTemplateAliasResponse",
)({
  TemplateAlias: S.optional(TemplateAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateTemplatePermissionsResponse extends S.Class<UpdateTemplatePermissionsResponse>(
  "UpdateTemplatePermissionsResponse",
)({
  TemplateId: S.optional(S.String),
  TemplateArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateThemeResponse extends S.Class<UpdateThemeResponse>(
  "UpdateThemeResponse",
)({
  ThemeId: S.optional(S.String),
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateThemeAliasResponse extends S.Class<UpdateThemeAliasResponse>(
  "UpdateThemeAliasResponse",
)({
  ThemeAlias: S.optional(ThemeAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateThemePermissionsResponse extends S.Class<UpdateThemePermissionsResponse>(
  "UpdateThemePermissionsResponse",
)({
  ThemeId: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Permissions: S.optional(UpdateResourcePermissionList),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateTopicResponse extends S.Class<UpdateTopicResponse>(
  "UpdateTopicResponse",
)({
  TopicId: S.optional(S.String),
  Arn: S.optional(S.String),
  RefreshArn: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateTopicPermissionsResponse extends S.Class<UpdateTopicPermissionsResponse>(
  "UpdateTopicPermissionsResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  Permissions: S.optional(ResourcePermissionList),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateTopicRefreshScheduleResponse extends S.Class<UpdateTopicRefreshScheduleResponse>(
  "UpdateTopicRefreshScheduleResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({
  User: S.optional(User),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateUserCustomPermissionResponse extends S.Class<UpdateUserCustomPermissionResponse>(
  "UpdateUserCustomPermissionResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateVPCConnectionResponse extends S.Class<UpdateVPCConnectionResponse>(
  "UpdateVPCConnectionResponse",
)({
  Arn: S.optional(S.String),
  VPCConnectionId: S.optional(S.String),
  UpdateStatus: S.optional(S.String),
  AvailabilityStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class Identifier extends S.Class<Identifier>("Identifier")({
  Identity: S.String,
}) {}
export const AggFunctionParamMap = S.Record({ key: S.String, value: S.String });
export class AggFunction extends S.Class<AggFunction>("AggFunction")({
  Aggregation: S.optional(S.String),
  AggregationFunctionParameters: S.optional(AggFunctionParamMap),
  Period: S.optional(S.String),
  PeriodField: S.optional(S.String),
}) {}
export const OperandList = S.Array(Identifier);
export class TopicIRComparisonMethod extends S.Class<TopicIRComparisonMethod>(
  "TopicIRComparisonMethod",
)({
  Type: S.optional(S.String),
  Period: S.optional(S.String),
  WindowSize: S.optional(S.Number),
}) {}
export const CalculatedFieldReferenceList = S.Array(Identifier);
export class NamedEntityRef extends S.Class<NamedEntityRef>("NamedEntityRef")({
  NamedEntityName: S.optional(S.String),
}) {}
export class TopicIRMetric extends S.Class<TopicIRMetric>("TopicIRMetric")({
  MetricId: S.optional(Identifier),
  Function: S.optional(AggFunction),
  Operands: S.optional(OperandList),
  ComparisonMethod: S.optional(TopicIRComparisonMethod),
  Expression: S.optional(S.String),
  CalculatedFieldReferences: S.optional(CalculatedFieldReferenceList),
  DisplayFormat: S.optional(S.String),
  DisplayFormatOptions: S.optional(DisplayFormatOptions),
  NamedEntity: S.optional(NamedEntityRef),
}) {}
export const TopicIRMetricList = S.Array(TopicIRMetric);
export class TopicSortClause extends S.Class<TopicSortClause>(
  "TopicSortClause",
)({ Operand: S.optional(Identifier), SortDirection: S.optional(S.String) }) {}
export class TopicIRGroupBy extends S.Class<TopicIRGroupBy>("TopicIRGroupBy")({
  FieldName: S.optional(Identifier),
  TimeGranularity: S.optional(S.String),
  Sort: S.optional(TopicSortClause),
  DisplayFormat: S.optional(S.String),
  DisplayFormatOptions: S.optional(DisplayFormatOptions),
  NamedEntity: S.optional(NamedEntityRef),
}) {}
export const TopicIRGroupByList = S.Array(TopicIRGroupBy);
export class CollectiveConstantEntry extends S.Class<CollectiveConstantEntry>(
  "CollectiveConstantEntry",
)({ ConstantType: S.optional(S.String), Value: S.optional(S.String) }) {}
export const CollectiveConstantEntryList = S.Array(CollectiveConstantEntry);
export class TopicConstantValue extends S.Class<TopicConstantValue>(
  "TopicConstantValue",
)({
  ConstantType: S.optional(S.String),
  Value: S.optional(S.String),
  Minimum: S.optional(S.String),
  Maximum: S.optional(S.String),
  ValueList: S.optional(CollectiveConstantEntryList),
}) {}
export class AggregationPartitionBy extends S.Class<AggregationPartitionBy>(
  "AggregationPartitionBy",
)({ FieldName: S.optional(S.String), TimeGranularity: S.optional(S.String) }) {}
export const AggregationPartitionByList = S.Array(AggregationPartitionBy);
export class FilterAggMetrics extends S.Class<FilterAggMetrics>(
  "FilterAggMetrics",
)({
  MetricOperand: S.optional(Identifier),
  Function: S.optional(S.String),
  SortDirection: S.optional(S.String),
}) {}
export const FilterAggMetricsList = S.Array(FilterAggMetrics);
export class Anchor extends S.Class<Anchor>("Anchor")({
  AnchorType: S.optional(S.String),
  TimeGranularity: S.optional(S.String),
  Offset: S.optional(S.Number),
}) {}
export class TopicIRFilterOption extends S.Class<TopicIRFilterOption>(
  "TopicIRFilterOption",
)({
  FilterType: S.optional(S.String),
  FilterClass: S.optional(S.String),
  OperandField: S.optional(Identifier),
  Function: S.optional(S.String),
  Constant: S.optional(TopicConstantValue),
  Inverse: S.optional(S.Boolean),
  NullFilter: S.optional(S.String),
  Aggregation: S.optional(S.String),
  AggregationFunctionParameters: S.optional(AggFunctionParamMap),
  AggregationPartitionBy: S.optional(AggregationPartitionByList),
  Range: S.optional(TopicConstantValue),
  Inclusive: S.optional(S.Boolean),
  TimeGranularity: S.optional(S.String),
  LastNextOffset: S.optional(TopicConstantValue),
  AggMetrics: S.optional(FilterAggMetricsList),
  TopBottomLimit: S.optional(TopicConstantValue),
  SortDirection: S.optional(S.String),
  Anchor: S.optional(Anchor),
}) {}
export const TopicIRFilterEntry = S.Array(TopicIRFilterOption);
export const TopicIRFilterList = S.Array(TopicIRFilterEntry);
export class ContributionAnalysisFactor extends S.Class<ContributionAnalysisFactor>(
  "ContributionAnalysisFactor",
)({ FieldName: S.optional(S.String) }) {}
export const ContributionAnalysisFactorsList = S.Array(
  ContributionAnalysisFactor,
);
export class ContributionAnalysisTimeRanges extends S.Class<ContributionAnalysisTimeRanges>(
  "ContributionAnalysisTimeRanges",
)({
  StartRange: S.optional(TopicIRFilterOption),
  EndRange: S.optional(TopicIRFilterOption),
}) {}
export class TopicIRContributionAnalysis extends S.Class<TopicIRContributionAnalysis>(
  "TopicIRContributionAnalysis",
)({
  Factors: S.optional(ContributionAnalysisFactorsList),
  TimeRanges: S.optional(ContributionAnalysisTimeRanges),
  Direction: S.optional(S.String),
  SortType: S.optional(S.String),
}) {}
export class VisualOptions extends S.Class<VisualOptions>("VisualOptions")({
  type: S.optional(S.String),
}) {}
export class TopicIR extends S.Class<TopicIR>("TopicIR")({
  Metrics: S.optional(TopicIRMetricList),
  GroupByList: S.optional(TopicIRGroupByList),
  Filters: S.optional(TopicIRFilterList),
  Sort: S.optional(TopicSortClause),
  ContributionAnalysis: S.optional(TopicIRContributionAnalysis),
  Visual: S.optional(VisualOptions),
}) {}
export class TopicVisual extends S.Class<TopicVisual>("TopicVisual")({
  VisualId: S.optional(S.String),
  Role: S.optional(S.String),
  Ir: S.optional(TopicIR),
  SupportingVisuals: S.optional(S.suspend(() => TopicVisuals)),
}) {}
export const ActionIdList = S.Array(S.String);
export const Path = S.Array(S.String);
export class AnonymousUserQSearchBarEmbeddingConfiguration extends S.Class<AnonymousUserQSearchBarEmbeddingConfiguration>(
  "AnonymousUserQSearchBarEmbeddingConfiguration",
)({ InitialTopicId: S.String }) {}
export class AnonymousUserGenerativeQnAEmbeddingConfiguration extends S.Class<AnonymousUserGenerativeQnAEmbeddingConfiguration>(
  "AnonymousUserGenerativeQnAEmbeddingConfiguration",
)({ InitialTopicId: S.String }) {}
export class AssetBundleExportJobResourceIdOverrideConfiguration extends S.Class<AssetBundleExportJobResourceIdOverrideConfiguration>(
  "AssetBundleExportJobResourceIdOverrideConfiguration",
)({ PrefixForAllResources: S.optional(S.Boolean) }) {}
export class AssetBundleExportJobVPCConnectionOverrideProperties extends S.Class<AssetBundleExportJobVPCConnectionOverrideProperties>(
  "AssetBundleExportJobVPCConnectionOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobVPCConnectionPropertyToOverrideList,
}) {}
export const AssetBundleExportJobVPCConnectionOverridePropertiesList = S.Array(
  AssetBundleExportJobVPCConnectionOverrideProperties,
);
export class AssetBundleExportJobRefreshScheduleOverrideProperties extends S.Class<AssetBundleExportJobRefreshScheduleOverrideProperties>(
  "AssetBundleExportJobRefreshScheduleOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobRefreshSchedulePropertyToOverrideList,
}) {}
export const AssetBundleExportJobRefreshScheduleOverridePropertiesList =
  S.Array(AssetBundleExportJobRefreshScheduleOverrideProperties);
export class AssetBundleExportJobDataSourceOverrideProperties extends S.Class<AssetBundleExportJobDataSourceOverrideProperties>(
  "AssetBundleExportJobDataSourceOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobDataSourcePropertyToOverrideList,
}) {}
export const AssetBundleExportJobDataSourceOverridePropertiesList = S.Array(
  AssetBundleExportJobDataSourceOverrideProperties,
);
export class AssetBundleExportJobDataSetOverrideProperties extends S.Class<AssetBundleExportJobDataSetOverrideProperties>(
  "AssetBundleExportJobDataSetOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobDataSetPropertyToOverrideList,
}) {}
export const AssetBundleExportJobDataSetOverridePropertiesList = S.Array(
  AssetBundleExportJobDataSetOverrideProperties,
);
export class AssetBundleExportJobThemeOverrideProperties extends S.Class<AssetBundleExportJobThemeOverrideProperties>(
  "AssetBundleExportJobThemeOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobThemePropertyToOverrideList,
}) {}
export const AssetBundleExportJobThemeOverridePropertiesList = S.Array(
  AssetBundleExportJobThemeOverrideProperties,
);
export class AssetBundleExportJobAnalysisOverrideProperties extends S.Class<AssetBundleExportJobAnalysisOverrideProperties>(
  "AssetBundleExportJobAnalysisOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobAnalysisPropertyToOverrideList,
}) {}
export const AssetBundleExportJobAnalysisOverridePropertiesList = S.Array(
  AssetBundleExportJobAnalysisOverrideProperties,
);
export class AssetBundleExportJobDashboardOverrideProperties extends S.Class<AssetBundleExportJobDashboardOverrideProperties>(
  "AssetBundleExportJobDashboardOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobDashboardPropertyToOverrideList,
}) {}
export const AssetBundleExportJobDashboardOverridePropertiesList = S.Array(
  AssetBundleExportJobDashboardOverrideProperties,
);
export class AssetBundleExportJobFolderOverrideProperties extends S.Class<AssetBundleExportJobFolderOverrideProperties>(
  "AssetBundleExportJobFolderOverrideProperties",
)({
  Arn: S.String,
  Properties: AssetBundleExportJobFolderPropertyToOverrideList,
}) {}
export const AssetBundleExportJobFolderOverridePropertiesList = S.Array(
  AssetBundleExportJobFolderOverrideProperties,
);
export class AssetBundleImportJobResourceIdOverrideConfiguration extends S.Class<AssetBundleImportJobResourceIdOverrideConfiguration>(
  "AssetBundleImportJobResourceIdOverrideConfiguration",
)({ PrefixForAllResources: S.optional(S.String) }) {}
export class AssetBundleImportJobVPCConnectionOverrideParameters extends S.Class<AssetBundleImportJobVPCConnectionOverrideParameters>(
  "AssetBundleImportJobVPCConnectionOverrideParameters",
)({
  VPCConnectionId: S.String,
  Name: S.optional(S.String),
  SubnetIds: S.optional(SubnetIdList),
  SecurityGroupIds: S.optional(SecurityGroupIdList),
  DnsResolvers: S.optional(DnsResolverList),
  RoleArn: S.optional(S.String),
}) {}
export const AssetBundleImportJobVPCConnectionOverrideParametersList = S.Array(
  AssetBundleImportJobVPCConnectionOverrideParameters,
);
export class AssetBundleImportJobRefreshScheduleOverrideParameters extends S.Class<AssetBundleImportJobRefreshScheduleOverrideParameters>(
  "AssetBundleImportJobRefreshScheduleOverrideParameters",
)({
  DataSetId: S.String,
  ScheduleId: S.String,
  StartAfterDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AssetBundleImportJobRefreshScheduleOverrideParametersList =
  S.Array(AssetBundleImportJobRefreshScheduleOverrideParameters);
export class AssetBundleImportJobDataSetOverrideParameters extends S.Class<AssetBundleImportJobDataSetOverrideParameters>(
  "AssetBundleImportJobDataSetOverrideParameters",
)({
  DataSetId: S.String,
  Name: S.optional(S.String),
  DataSetRefreshProperties: S.optional(DataSetRefreshProperties),
}) {}
export const AssetBundleImportJobDataSetOverrideParametersList = S.Array(
  AssetBundleImportJobDataSetOverrideParameters,
);
export class AssetBundleImportJobThemeOverrideParameters extends S.Class<AssetBundleImportJobThemeOverrideParameters>(
  "AssetBundleImportJobThemeOverrideParameters",
)({ ThemeId: S.String, Name: S.optional(S.String) }) {}
export const AssetBundleImportJobThemeOverrideParametersList = S.Array(
  AssetBundleImportJobThemeOverrideParameters,
);
export class AssetBundleImportJobAnalysisOverrideParameters extends S.Class<AssetBundleImportJobAnalysisOverrideParameters>(
  "AssetBundleImportJobAnalysisOverrideParameters",
)({ AnalysisId: S.String, Name: S.optional(S.String) }) {}
export const AssetBundleImportJobAnalysisOverrideParametersList = S.Array(
  AssetBundleImportJobAnalysisOverrideParameters,
);
export class AssetBundleImportJobDashboardOverrideParameters extends S.Class<AssetBundleImportJobDashboardOverrideParameters>(
  "AssetBundleImportJobDashboardOverrideParameters",
)({ DashboardId: S.String, Name: S.optional(S.String) }) {}
export const AssetBundleImportJobDashboardOverrideParametersList = S.Array(
  AssetBundleImportJobDashboardOverrideParameters,
);
export class AssetBundleImportJobFolderOverrideParameters extends S.Class<AssetBundleImportJobFolderOverrideParameters>(
  "AssetBundleImportJobFolderOverrideParameters",
)({
  FolderId: S.String,
  Name: S.optional(S.String),
  ParentFolderArn: S.optional(S.String),
}) {}
export const AssetBundleImportJobFolderOverrideParametersList = S.Array(
  AssetBundleImportJobFolderOverrideParameters,
);
export const AssetBundlePrincipalList = S.Array(S.String);
export class AssetBundleResourcePermissions extends S.Class<AssetBundleResourcePermissions>(
  "AssetBundleResourcePermissions",
)({ Principals: AssetBundlePrincipalList, Actions: ActionList }) {}
export class AssetBundleImportJobDataSetOverridePermissions extends S.Class<AssetBundleImportJobDataSetOverridePermissions>(
  "AssetBundleImportJobDataSetOverridePermissions",
)({
  DataSetIds: AssetBundleRestrictiveResourceIdList,
  Permissions: AssetBundleResourcePermissions,
}) {}
export const AssetBundleImportJobDataSetOverridePermissionsList = S.Array(
  AssetBundleImportJobDataSetOverridePermissions,
);
export class AssetBundleImportJobThemeOverridePermissions extends S.Class<AssetBundleImportJobThemeOverridePermissions>(
  "AssetBundleImportJobThemeOverridePermissions",
)({
  ThemeIds: AssetBundleRestrictiveResourceIdList,
  Permissions: AssetBundleResourcePermissions,
}) {}
export const AssetBundleImportJobThemeOverridePermissionsList = S.Array(
  AssetBundleImportJobThemeOverridePermissions,
);
export class AssetBundleImportJobAnalysisOverridePermissions extends S.Class<AssetBundleImportJobAnalysisOverridePermissions>(
  "AssetBundleImportJobAnalysisOverridePermissions",
)({
  AnalysisIds: AssetBundleRestrictiveResourceIdList,
  Permissions: AssetBundleResourcePermissions,
}) {}
export const AssetBundleImportJobAnalysisOverridePermissionsList = S.Array(
  AssetBundleImportJobAnalysisOverridePermissions,
);
export class AssetBundleImportJobFolderOverridePermissions extends S.Class<AssetBundleImportJobFolderOverridePermissions>(
  "AssetBundleImportJobFolderOverridePermissions",
)({
  FolderIds: AssetBundleRestrictiveResourceIdList,
  Permissions: S.optional(AssetBundleResourcePermissions),
}) {}
export const AssetBundleImportJobFolderOverridePermissionsList = S.Array(
  AssetBundleImportJobFolderOverridePermissions,
);
export class AssetBundleImportJobVPCConnectionOverrideTags extends S.Class<AssetBundleImportJobVPCConnectionOverrideTags>(
  "AssetBundleImportJobVPCConnectionOverrideTags",
)({ VPCConnectionIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobVPCConnectionOverrideTagsList = S.Array(
  AssetBundleImportJobVPCConnectionOverrideTags,
);
export class AssetBundleImportJobDataSourceOverrideTags extends S.Class<AssetBundleImportJobDataSourceOverrideTags>(
  "AssetBundleImportJobDataSourceOverrideTags",
)({ DataSourceIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobDataSourceOverrideTagsList = S.Array(
  AssetBundleImportJobDataSourceOverrideTags,
);
export class AssetBundleImportJobDataSetOverrideTags extends S.Class<AssetBundleImportJobDataSetOverrideTags>(
  "AssetBundleImportJobDataSetOverrideTags",
)({ DataSetIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobDataSetOverrideTagsList = S.Array(
  AssetBundleImportJobDataSetOverrideTags,
);
export class AssetBundleImportJobThemeOverrideTags extends S.Class<AssetBundleImportJobThemeOverrideTags>(
  "AssetBundleImportJobThemeOverrideTags",
)({ ThemeIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobThemeOverrideTagsList = S.Array(
  AssetBundleImportJobThemeOverrideTags,
);
export class AssetBundleImportJobAnalysisOverrideTags extends S.Class<AssetBundleImportJobAnalysisOverrideTags>(
  "AssetBundleImportJobAnalysisOverrideTags",
)({ AnalysisIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobAnalysisOverrideTagsList = S.Array(
  AssetBundleImportJobAnalysisOverrideTags,
);
export class AssetBundleImportJobDashboardOverrideTags extends S.Class<AssetBundleImportJobDashboardOverrideTags>(
  "AssetBundleImportJobDashboardOverrideTags",
)({ DashboardIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobDashboardOverrideTagsList = S.Array(
  AssetBundleImportJobDashboardOverrideTags,
);
export class AssetBundleImportJobFolderOverrideTags extends S.Class<AssetBundleImportJobFolderOverrideTags>(
  "AssetBundleImportJobFolderOverrideTags",
)({ FolderIds: AssetBundleRestrictiveResourceIdList, Tags: TagList }) {}
export const AssetBundleImportJobFolderOverrideTagsList = S.Array(
  AssetBundleImportJobFolderOverrideTags,
);
export class SnapshotAnonymousUser extends S.Class<SnapshotAnonymousUser>(
  "SnapshotAnonymousUser",
)({ RowLevelPermissionTags: S.optional(SessionTagList) }) {}
export const SnapshotAnonymousUserList = S.Array(SnapshotAnonymousUser);
export class SucceededTopicReviewedAnswer extends S.Class<SucceededTopicReviewedAnswer>(
  "SucceededTopicReviewedAnswer",
)({ AnswerId: S.optional(S.String) }) {}
export const SucceededTopicReviewedAnswers = S.Array(
  SucceededTopicReviewedAnswer,
);
export class InvalidTopicReviewedAnswer extends S.Class<InvalidTopicReviewedAnswer>(
  "InvalidTopicReviewedAnswer",
)({ AnswerId: S.optional(S.String), Error: S.optional(S.String) }) {}
export const InvalidTopicReviewedAnswers = S.Array(InvalidTopicReviewedAnswer);
export class SignupResponse extends S.Class<SignupResponse>("SignupResponse")({
  IAMUser: S.optional(S.Boolean),
  userLoginName: S.optional(S.String),
  accountName: S.optional(S.String),
  directoryType: S.optional(S.String),
}) {}
export class FolderMember extends S.Class<FolderMember>("FolderMember")({
  MemberId: S.optional(S.String),
  MemberType: S.optional(S.String),
}) {}
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({
  AccountName: S.optional(S.String),
  Edition: S.optional(S.String),
  DefaultNamespace: S.optional(S.String),
  NotificationEmail: S.optional(S.String),
  PublicSharingEnabled: S.optional(S.Boolean),
  TerminationProtectionEnabled: S.optional(S.Boolean),
}) {}
export class AccountInfo extends S.Class<AccountInfo>("AccountInfo")({
  AccountName: S.optional(S.String),
  Edition: S.optional(S.String),
  NotificationEmail: S.optional(S.String),
  AuthenticationType: S.optional(S.String),
  AccountSubscriptionStatus: S.optional(S.String),
  IAMIdentityCenterInstanceArn: S.optional(S.String),
}) {}
export class AssetBundleExportJobError extends S.Class<AssetBundleExportJobError>(
  "AssetBundleExportJobError",
)({
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const AssetBundleExportJobErrorList = S.Array(AssetBundleExportJobError);
export class AssetBundleExportJobWarning extends S.Class<AssetBundleExportJobWarning>(
  "AssetBundleExportJobWarning",
)({ Arn: S.optional(S.String), Message: S.optional(S.String) }) {}
export const AssetBundleExportJobWarningList = S.Array(
  AssetBundleExportJobWarning,
);
export class AssetBundleImportJobError extends S.Class<AssetBundleImportJobError>(
  "AssetBundleImportJobError",
)({
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const AssetBundleImportJobErrorList = S.Array(AssetBundleImportJobError);
export class AssetBundleImportSourceDescription extends S.Class<AssetBundleImportSourceDescription>(
  "AssetBundleImportSourceDescription",
)({ Body: S.optional(S.String), S3Uri: S.optional(S.String) }) {}
export class AssetBundleImportJobWarning extends S.Class<AssetBundleImportJobWarning>(
  "AssetBundleImportJobWarning",
)({ Arn: S.optional(S.String), Message: S.optional(S.String) }) {}
export const AssetBundleImportJobWarningList = S.Array(
  AssetBundleImportJobWarning,
);
export class Entity extends S.Class<Entity>("Entity")({
  Path: S.optional(S.String),
}) {}
export const EntityList = S.Array(Entity);
export class DashboardError extends S.Class<DashboardError>("DashboardError")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
  ViolatedEntities: S.optional(EntityList),
}) {}
export const DashboardErrorList = S.Array(DashboardError);
export class SnapshotJobErrorInfo extends S.Class<SnapshotJobErrorInfo>(
  "SnapshotJobErrorInfo",
)({ ErrorMessage: S.optional(S.String), ErrorType: S.optional(S.String) }) {}
export class Folder extends S.Class<Folder>("Folder")({
  FolderId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  FolderType: S.optional(S.String),
  FolderPath: S.optional(Path),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SharingModel: S.optional(S.String),
}) {}
export class IAMPolicyAssignment extends S.Class<IAMPolicyAssignment>(
  "IAMPolicyAssignment",
)({
  AwsAccountId: S.optional(S.String),
  AssignmentId: S.optional(S.String),
  AssignmentName: S.optional(S.String),
  PolicyArn: S.optional(S.String),
  Identities: S.optional(IdentityMap),
  AssignmentStatus: S.optional(S.String),
}) {}
export class QDataKey extends S.Class<QDataKey>("QDataKey")({
  QDataKeyArn: S.optional(S.String),
  QDataKeyType: S.optional(S.String),
}) {}
export class SelfUpgradeConfiguration extends S.Class<SelfUpgradeConfiguration>(
  "SelfUpgradeConfiguration",
)({ SelfUpgradeStatus: S.optional(S.String) }) {}
export class TemplateError extends S.Class<TemplateError>("TemplateError")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
  ViolatedEntities: S.optional(EntityList),
}) {}
export const TemplateErrorList = S.Array(TemplateError);
export class TopicRefreshDetails extends S.Class<TopicRefreshDetails>(
  "TopicRefreshDetails",
)({
  RefreshArn: S.optional(S.String),
  RefreshId: S.optional(S.String),
  RefreshStatus: S.optional(S.String),
}) {}
export class ActionConnectorError extends S.Class<ActionConnectorError>(
  "ActionConnectorError",
)({ Message: S.optional(S.String), Type: S.optional(S.String) }) {}
export class ActionConnectorSummary extends S.Class<ActionConnectorSummary>(
  "ActionConnectorSummary",
)({
  Arn: S.String,
  ActionConnectorId: S.String,
  Type: S.String,
  Name: S.String,
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.optional(S.String),
  Error: S.optional(ActionConnectorError),
}) {}
export const ActionConnectorSummaryList = S.Array(ActionConnectorSummary);
export class AnalysisSummary extends S.Class<AnalysisSummary>(
  "AnalysisSummary",
)({
  Arn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AnalysisSummaryList = S.Array(AnalysisSummary);
export class AssetBundleExportJobSummary extends S.Class<AssetBundleExportJobSummary>(
  "AssetBundleExportJobSummary",
)({
  JobStatus: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssetBundleExportJobId: S.optional(S.String),
  IncludeAllDependencies: S.optional(S.Boolean),
  ExportFormat: S.optional(S.String),
  IncludePermissions: S.optional(S.Boolean),
  IncludeTags: S.optional(S.Boolean),
}) {}
export const AssetBundleExportJobSummaryList = S.Array(
  AssetBundleExportJobSummary,
);
export class AssetBundleImportJobSummary extends S.Class<AssetBundleImportJobSummary>(
  "AssetBundleImportJobSummary",
)({
  JobStatus: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssetBundleImportJobId: S.optional(S.String),
  FailureAction: S.optional(S.String),
}) {}
export const AssetBundleImportJobSummaryList = S.Array(
  AssetBundleImportJobSummary,
);
export class BrandSummary extends S.Class<BrandSummary>("BrandSummary")({
  Arn: S.optional(S.String),
  BrandId: S.optional(S.String),
  BrandName: S.optional(S.String),
  Description: S.optional(S.String),
  BrandStatus: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BrandSummaryList = S.Array(BrandSummary);
export class DashboardSummary extends S.Class<DashboardSummary>(
  "DashboardSummary",
)({
  Arn: S.optional(S.String),
  DashboardId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PublishedVersionNumber: S.optional(S.Number),
  LastPublishedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const DashboardSummaryList = S.Array(DashboardSummary);
export class DashboardVersionSummary extends S.Class<DashboardVersionSummary>(
  "DashboardVersionSummary",
)({
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
  SourceEntityArn: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const DashboardVersionSummaryList = S.Array(DashboardVersionSummary);
export class FlowSummary extends S.Class<FlowSummary>("FlowSummary")({
  Arn: S.String,
  FlowId: S.String,
  Name: S.String,
  Description: S.optional(S.String),
  CreatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatedBy: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedBy: S.optional(S.String),
  PublishState: S.optional(S.String),
  RunCount: S.optional(S.Number),
  UserCount: S.optional(S.Number),
  LastPublishedBy: S.optional(S.String),
  LastPublishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FlowSummaryList = S.Array(FlowSummary);
export class MemberIdArnPair extends S.Class<MemberIdArnPair>(
  "MemberIdArnPair",
)({ MemberId: S.optional(S.String), MemberArn: S.optional(S.String) }) {}
export const FolderMemberList = S.Array(MemberIdArnPair);
export class FolderSummary extends S.Class<FolderSummary>("FolderSummary")({
  Arn: S.optional(S.String),
  FolderId: S.optional(S.String),
  Name: S.optional(S.String),
  FolderType: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SharingModel: S.optional(S.String),
}) {}
export const FolderSummaryList = S.Array(FolderSummary);
export class IAMPolicyAssignmentSummary extends S.Class<IAMPolicyAssignmentSummary>(
  "IAMPolicyAssignmentSummary",
)({
  AssignmentName: S.optional(S.String),
  AssignmentStatus: S.optional(S.String),
}) {}
export const IAMPolicyAssignmentSummaryList = S.Array(
  IAMPolicyAssignmentSummary,
);
export class ActiveIAMPolicyAssignment extends S.Class<ActiveIAMPolicyAssignment>(
  "ActiveIAMPolicyAssignment",
)({ AssignmentName: S.optional(S.String), PolicyArn: S.optional(S.String) }) {}
export const ActiveIAMPolicyAssignmentList = S.Array(ActiveIAMPolicyAssignment);
export class AuthorizedTargetsByService extends S.Class<AuthorizedTargetsByService>(
  "AuthorizedTargetsByService",
)({
  Service: S.optional(S.String),
  AuthorizedTargets: S.optional(AuthorizedTargetsList),
}) {}
export const AuthorizedTargetsByServices = S.Array(AuthorizedTargetsByService);
export const SelfUpgradeRequestDetailList = S.Array(SelfUpgradeRequestDetail);
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  Arn: S.optional(S.String),
  TemplateId: S.optional(S.String),
  Name: S.optional(S.String),
  LatestVersionNumber: S.optional(S.Number),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TemplateSummaryList = S.Array(TemplateSummary);
export class TemplateVersionSummary extends S.Class<TemplateVersionSummary>(
  "TemplateVersionSummary",
)({
  Arn: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const TemplateVersionSummaryList = S.Array(TemplateVersionSummary);
export class ThemeSummary extends S.Class<ThemeSummary>("ThemeSummary")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ThemeId: S.optional(S.String),
  LatestVersionNumber: S.optional(S.Number),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ThemeSummaryList = S.Array(ThemeSummary);
export class ThemeVersionSummary extends S.Class<ThemeVersionSummary>(
  "ThemeVersionSummary",
)({
  VersionNumber: S.optional(S.Number),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
}) {}
export const ThemeVersionSummaryList = S.Array(ThemeVersionSummary);
export class TopicRefreshScheduleSummary extends S.Class<TopicRefreshScheduleSummary>(
  "TopicRefreshScheduleSummary",
)({
  DatasetId: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  DatasetName: S.optional(S.String),
  RefreshSchedule: S.optional(TopicRefreshSchedule),
}) {}
export const TopicRefreshScheduleSummaries = S.Array(
  TopicRefreshScheduleSummary,
);
export class Slot extends S.Class<Slot>("Slot")({
  SlotId: S.optional(S.String),
  VisualId: S.optional(S.String),
}) {}
export const Slots = S.Array(Slot);
export class TopicTemplate extends S.Class<TopicTemplate>("TopicTemplate")({
  TemplateType: S.optional(S.String),
  Slots: S.optional(Slots),
}) {}
export class TopicReviewedAnswer extends S.Class<TopicReviewedAnswer>(
  "TopicReviewedAnswer",
)({
  Arn: S.optional(S.String),
  AnswerId: S.String,
  DatasetArn: S.String,
  Question: S.String,
  Mir: S.optional(TopicIR),
  PrimaryVisual: S.optional(TopicVisual),
  Template: S.optional(TopicTemplate),
}) {}
export const TopicReviewedAnswers = S.Array(TopicReviewedAnswer);
export class TopicSummary extends S.Class<TopicSummary>("TopicSummary")({
  Arn: S.optional(S.String),
  TopicId: S.optional(S.String),
  Name: S.optional(S.String),
  UserExperienceVersion: S.optional(S.String),
}) {}
export const TopicSummaries = S.Array(TopicSummary);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  SubnetId: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  Status: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
}) {}
export const NetworkInterfaceList = S.Array(NetworkInterface);
export class VPCConnectionSummary extends S.Class<VPCConnectionSummary>(
  "VPCConnectionSummary",
)({
  VPCConnectionId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  VPCId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIdList),
  DnsResolvers: S.optional(StringList),
  Status: S.optional(S.String),
  AvailabilityStatus: S.optional(S.String),
  NetworkInterfaces: S.optional(NetworkInterfaceList),
  RoleArn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const VPCConnectionSummaryList = S.Array(VPCConnectionSummary);
export class AssetBundleCloudFormationOverridePropertyConfiguration extends S.Class<AssetBundleCloudFormationOverridePropertyConfiguration>(
  "AssetBundleCloudFormationOverridePropertyConfiguration",
)({
  ResourceIdOverrideConfiguration: S.optional(
    AssetBundleExportJobResourceIdOverrideConfiguration,
  ),
  VPCConnections: S.optional(
    AssetBundleExportJobVPCConnectionOverridePropertiesList,
  ),
  RefreshSchedules: S.optional(
    AssetBundleExportJobRefreshScheduleOverridePropertiesList,
  ),
  DataSources: S.optional(AssetBundleExportJobDataSourceOverridePropertiesList),
  DataSets: S.optional(AssetBundleExportJobDataSetOverridePropertiesList),
  Themes: S.optional(AssetBundleExportJobThemeOverridePropertiesList),
  Analyses: S.optional(AssetBundleExportJobAnalysisOverridePropertiesList),
  Dashboards: S.optional(AssetBundleExportJobDashboardOverridePropertiesList),
  Folders: S.optional(AssetBundleExportJobFolderOverridePropertiesList),
}) {}
export class AssetBundleImportJobOverrideTags extends S.Class<AssetBundleImportJobOverrideTags>(
  "AssetBundleImportJobOverrideTags",
)({
  VPCConnections: S.optional(AssetBundleImportJobVPCConnectionOverrideTagsList),
  DataSources: S.optional(AssetBundleImportJobDataSourceOverrideTagsList),
  DataSets: S.optional(AssetBundleImportJobDataSetOverrideTagsList),
  Themes: S.optional(AssetBundleImportJobThemeOverrideTagsList),
  Analyses: S.optional(AssetBundleImportJobAnalysisOverrideTagsList),
  Dashboards: S.optional(AssetBundleImportJobDashboardOverrideTagsList),
  Folders: S.optional(AssetBundleImportJobFolderOverrideTagsList),
}) {}
export class SnapshotUserConfiguration extends S.Class<SnapshotUserConfiguration>(
  "SnapshotUserConfiguration",
)({ AnonymousUsers: S.optional(SnapshotAnonymousUserList) }) {}
export const SessionTagKeyList = S.Array(S.String);
export class AssetBundleResourceLinkSharingConfiguration extends S.Class<AssetBundleResourceLinkSharingConfiguration>(
  "AssetBundleResourceLinkSharingConfiguration",
)({ Permissions: S.optional(AssetBundleResourcePermissions) }) {}
export class BatchDeleteTopicReviewedAnswerResponse extends S.Class<BatchDeleteTopicReviewedAnswerResponse>(
  "BatchDeleteTopicReviewedAnswerResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  SucceededAnswers: S.optional(SucceededTopicReviewedAnswers),
  InvalidAnswers: S.optional(InvalidTopicReviewedAnswers),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateAccountCustomizationResponse extends S.Class<CreateAccountCustomizationResponse>(
  "CreateAccountCustomizationResponse",
)({
  Arn: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  Namespace: S.optional(S.String),
  AccountCustomization: S.optional(AccountCustomization),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateAccountSubscriptionResponse extends S.Class<CreateAccountSubscriptionResponse>(
  "CreateAccountSubscriptionResponse",
)({
  SignupResponse: S.optional(SignupResponse),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateCustomPermissionsResponse extends S.Class<CreateCustomPermissionsResponse>(
  "CreateCustomPermissionsResponse",
)({
  Status: S.optional(S.Number),
  Arn: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class CreateFolderMembershipResponse extends S.Class<CreateFolderMembershipResponse>(
  "CreateFolderMembershipResponse",
)({
  Status: S.optional(S.Number),
  FolderMember: S.optional(FolderMember),
  RequestId: S.optional(S.String),
}) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({
  Group: S.optional(Group),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateGroupMembershipResponse extends S.Class<CreateGroupMembershipResponse>(
  "CreateGroupMembershipResponse",
)({
  GroupMember: S.optional(GroupMember),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateIAMPolicyAssignmentResponse extends S.Class<CreateIAMPolicyAssignmentResponse>(
  "CreateIAMPolicyAssignmentResponse",
)({
  AssignmentName: S.optional(S.String),
  AssignmentId: S.optional(S.String),
  AssignmentStatus: S.optional(S.String),
  PolicyArn: S.optional(S.String),
  Identities: S.optional(IdentityMap),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateTemplateAliasResponse extends S.Class<CreateTemplateAliasResponse>(
  "CreateTemplateAliasResponse",
)({
  TemplateAlias: S.optional(TemplateAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateThemeAliasResponse extends S.Class<CreateThemeAliasResponse>(
  "CreateThemeAliasResponse",
)({
  ThemeAlias: S.optional(ThemeAlias),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateTopicRefreshScheduleResponse extends S.Class<CreateTopicRefreshScheduleResponse>(
  "CreateTopicRefreshScheduleResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeAccountSettingsResponse extends S.Class<DescribeAccountSettingsResponse>(
  "DescribeAccountSettingsResponse",
)({
  AccountSettings: S.optional(AccountSettings),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeAccountSubscriptionResponse extends S.Class<DescribeAccountSubscriptionResponse>(
  "DescribeAccountSubscriptionResponse",
)({
  AccountInfo: S.optional(AccountInfo),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeAssetBundleExportJobResponse extends S.Class<DescribeAssetBundleExportJobResponse>(
  "DescribeAssetBundleExportJobResponse",
)({
  JobStatus: S.optional(S.String),
  DownloadUrl: S.optional(S.String),
  Errors: S.optional(AssetBundleExportJobErrorList),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssetBundleExportJobId: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  ResourceArns: S.optional(AssetBundleResourceArns),
  IncludeAllDependencies: S.optional(S.Boolean),
  ExportFormat: S.optional(S.String),
  CloudFormationOverridePropertyConfiguration: S.optional(
    AssetBundleCloudFormationOverridePropertyConfiguration,
  ),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  IncludePermissions: S.optional(S.Boolean),
  IncludeTags: S.optional(S.Boolean),
  ValidationStrategy: S.optional(AssetBundleExportJobValidationStrategy),
  Warnings: S.optional(AssetBundleExportJobWarningList),
  IncludeFolderMemberships: S.optional(S.Boolean),
  IncludeFolderMembers: S.optional(S.String),
}) {}
export class AssetBundleImportJobDataSourceCredentialPair extends S.Class<AssetBundleImportJobDataSourceCredentialPair>(
  "AssetBundleImportJobDataSourceCredentialPair",
)({ Username: S.String, Password: S.String }) {}
export class AssetBundleImportJobDataSourceCredentials extends S.Class<AssetBundleImportJobDataSourceCredentials>(
  "AssetBundleImportJobDataSourceCredentials",
)({
  CredentialPair: S.optional(AssetBundleImportJobDataSourceCredentialPair),
  SecretArn: S.optional(S.String),
}) {}
export class AssetBundleImportJobDataSourceOverrideParameters extends S.Class<AssetBundleImportJobDataSourceOverrideParameters>(
  "AssetBundleImportJobDataSourceOverrideParameters",
)({
  DataSourceId: S.String,
  Name: S.optional(S.String),
  DataSourceParameters: S.optional(DataSourceParameters),
  VpcConnectionProperties: S.optional(VpcConnectionProperties),
  SslProperties: S.optional(SslProperties),
  Credentials: S.optional(AssetBundleImportJobDataSourceCredentials),
}) {}
export const AssetBundleImportJobDataSourceOverrideParametersList = S.Array(
  AssetBundleImportJobDataSourceOverrideParameters,
);
export class AssetBundleImportJobOverrideParameters extends S.Class<AssetBundleImportJobOverrideParameters>(
  "AssetBundleImportJobOverrideParameters",
)({
  ResourceIdOverrideConfiguration: S.optional(
    AssetBundleImportJobResourceIdOverrideConfiguration,
  ),
  VPCConnections: S.optional(
    AssetBundleImportJobVPCConnectionOverrideParametersList,
  ),
  RefreshSchedules: S.optional(
    AssetBundleImportJobRefreshScheduleOverrideParametersList,
  ),
  DataSources: S.optional(AssetBundleImportJobDataSourceOverrideParametersList),
  DataSets: S.optional(AssetBundleImportJobDataSetOverrideParametersList),
  Themes: S.optional(AssetBundleImportJobThemeOverrideParametersList),
  Analyses: S.optional(AssetBundleImportJobAnalysisOverrideParametersList),
  Dashboards: S.optional(AssetBundleImportJobDashboardOverrideParametersList),
  Folders: S.optional(AssetBundleImportJobFolderOverrideParametersList),
}) {}
export class AssetBundleImportJobDataSourceOverridePermissions extends S.Class<AssetBundleImportJobDataSourceOverridePermissions>(
  "AssetBundleImportJobDataSourceOverridePermissions",
)({
  DataSourceIds: AssetBundleRestrictiveResourceIdList,
  Permissions: AssetBundleResourcePermissions,
}) {}
export const AssetBundleImportJobDataSourceOverridePermissionsList = S.Array(
  AssetBundleImportJobDataSourceOverridePermissions,
);
export class AssetBundleImportJobDashboardOverridePermissions extends S.Class<AssetBundleImportJobDashboardOverridePermissions>(
  "AssetBundleImportJobDashboardOverridePermissions",
)({
  DashboardIds: AssetBundleRestrictiveResourceIdList,
  Permissions: S.optional(AssetBundleResourcePermissions),
  LinkSharingConfiguration: S.optional(
    AssetBundleResourceLinkSharingConfiguration,
  ),
}) {}
export const AssetBundleImportJobDashboardOverridePermissionsList = S.Array(
  AssetBundleImportJobDashboardOverridePermissions,
);
export class AssetBundleImportJobOverridePermissions extends S.Class<AssetBundleImportJobOverridePermissions>(
  "AssetBundleImportJobOverridePermissions",
)({
  DataSources: S.optional(
    AssetBundleImportJobDataSourceOverridePermissionsList,
  ),
  DataSets: S.optional(AssetBundleImportJobDataSetOverridePermissionsList),
  Themes: S.optional(AssetBundleImportJobThemeOverridePermissionsList),
  Analyses: S.optional(AssetBundleImportJobAnalysisOverridePermissionsList),
  Dashboards: S.optional(AssetBundleImportJobDashboardOverridePermissionsList),
  Folders: S.optional(AssetBundleImportJobFolderOverridePermissionsList),
}) {}
export class DescribeAssetBundleImportJobResponse extends S.Class<DescribeAssetBundleImportJobResponse>(
  "DescribeAssetBundleImportJobResponse",
)({
  JobStatus: S.optional(S.String),
  Errors: S.optional(AssetBundleImportJobErrorList),
  RollbackErrors: S.optional(AssetBundleImportJobErrorList),
  Arn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssetBundleImportJobId: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  AssetBundleImportSource: S.optional(AssetBundleImportSourceDescription),
  OverrideParameters: S.optional(AssetBundleImportJobOverrideParameters),
  FailureAction: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  OverridePermissions: S.optional(AssetBundleImportJobOverridePermissions),
  OverrideTags: S.optional(AssetBundleImportJobOverrideTags),
  OverrideValidationStrategy: S.optional(
    AssetBundleImportJobOverrideValidationStrategy,
  ),
  Warnings: S.optional(AssetBundleImportJobWarningList),
}) {}
export class DescribeCustomPermissionsResponse extends S.Class<DescribeCustomPermissionsResponse>(
  "DescribeCustomPermissionsResponse",
)({
  Status: S.optional(S.Number),
  CustomPermissions: S.optional(CustomPermissions),
  RequestId: S.optional(S.String),
}) {}
export class DescribeDashboardDefinitionResponse extends S.Class<DescribeDashboardDefinitionResponse>(
  "DescribeDashboardDefinitionResponse",
)({
  DashboardId: S.optional(S.String),
  Errors: S.optional(DashboardErrorList),
  Name: S.optional(S.String),
  ResourceStatus: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Definition: S.optional(DashboardVersionDefinition),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  DashboardPublishOptions: S.optional(DashboardPublishOptions),
}) {}
export class DescribeFolderResponse extends S.Class<DescribeFolderResponse>(
  "DescribeFolderResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Folder: S.optional(Folder),
  RequestId: S.optional(S.String),
}) {}
export class DescribeIAMPolicyAssignmentResponse extends S.Class<DescribeIAMPolicyAssignmentResponse>(
  "DescribeIAMPolicyAssignmentResponse",
)({
  IAMPolicyAssignment: S.optional(IAMPolicyAssignment),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeKeyRegistrationResponse extends S.Class<DescribeKeyRegistrationResponse>(
  "DescribeKeyRegistrationResponse",
)({
  AwsAccountId: S.optional(S.String),
  KeyRegistration: S.optional(KeyRegistration),
  QDataKey: S.optional(QDataKey),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number),
}) {}
export class DescribeSelfUpgradeConfigurationResponse extends S.Class<DescribeSelfUpgradeConfigurationResponse>(
  "DescribeSelfUpgradeConfigurationResponse",
)({
  SelfUpgradeConfiguration: S.optional(SelfUpgradeConfiguration),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeTemplateDefinitionResponse extends S.Class<DescribeTemplateDefinitionResponse>(
  "DescribeTemplateDefinitionResponse",
)({
  Name: S.optional(S.String),
  TemplateId: S.optional(S.String),
  Errors: S.optional(TemplateErrorList),
  ResourceStatus: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Definition: S.optional(TemplateVersionDefinition),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeTopicRefreshResponse extends S.Class<DescribeTopicRefreshResponse>(
  "DescribeTopicRefreshResponse",
)({
  RefreshDetails: S.optional(TopicRefreshDetails),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({
  User: S.optional(User),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class GetIdentityContextResponse extends S.Class<GetIdentityContextResponse>(
  "GetIdentityContextResponse",
)({
  Status: S.Number.pipe(T.HttpResponseCode()),
  RequestId: S.String,
  Context: S.optional(S.String),
}) {}
export class ListActionConnectorsResponse extends S.Class<ListActionConnectorsResponse>(
  "ListActionConnectorsResponse",
)({
  ActionConnectorSummaries: ActionConnectorSummaryList,
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListAnalysesResponse extends S.Class<ListAnalysesResponse>(
  "ListAnalysesResponse",
)({
  AnalysisSummaryList: S.optional(AnalysisSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListAssetBundleExportJobsResponse extends S.Class<ListAssetBundleExportJobsResponse>(
  "ListAssetBundleExportJobsResponse",
)({
  AssetBundleExportJobSummaryList: S.optional(AssetBundleExportJobSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListAssetBundleImportJobsResponse extends S.Class<ListAssetBundleImportJobsResponse>(
  "ListAssetBundleImportJobsResponse",
)({
  AssetBundleImportJobSummaryList: S.optional(AssetBundleImportJobSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListBrandsResponse extends S.Class<ListBrandsResponse>(
  "ListBrandsResponse",
)({ NextToken: S.optional(S.String), Brands: S.optional(BrandSummaryList) }) {}
export class ListDashboardsResponse extends S.Class<ListDashboardsResponse>(
  "ListDashboardsResponse",
)({
  DashboardSummaryList: S.optional(DashboardSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListDashboardVersionsResponse extends S.Class<ListDashboardVersionsResponse>(
  "ListDashboardVersionsResponse",
)({
  DashboardVersionSummaryList: S.optional(DashboardVersionSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListFlowsOutput extends S.Class<ListFlowsOutput>(
  "ListFlowsOutput",
)({
  FlowSummaryList: S.optional(FlowSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListFolderMembersResponse extends S.Class<ListFolderMembersResponse>(
  "ListFolderMembersResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  FolderMemberList: S.optional(FolderMemberList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class ListFoldersResponse extends S.Class<ListFoldersResponse>(
  "ListFoldersResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  FolderSummaryList: S.optional(FolderSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class ListIAMPolicyAssignmentsResponse extends S.Class<ListIAMPolicyAssignmentsResponse>(
  "ListIAMPolicyAssignmentsResponse",
)({
  IAMPolicyAssignments: S.optional(IAMPolicyAssignmentSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListIAMPolicyAssignmentsForUserResponse extends S.Class<ListIAMPolicyAssignmentsForUserResponse>(
  "ListIAMPolicyAssignmentsForUserResponse",
)({
  ActiveAssignments: S.optional(ActiveIAMPolicyAssignmentList),
  RequestId: S.optional(S.String),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListIdentityPropagationConfigsResponse extends S.Class<ListIdentityPropagationConfigsResponse>(
  "ListIdentityPropagationConfigsResponse",
)({
  Services: S.optional(AuthorizedTargetsByServices),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListSelfUpgradesResponse extends S.Class<ListSelfUpgradesResponse>(
  "ListSelfUpgradesResponse",
)({
  SelfUpgradeRequestDetails: S.optional(SelfUpgradeRequestDetailList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListTemplatesResponse extends S.Class<ListTemplatesResponse>(
  "ListTemplatesResponse",
)({
  TemplateSummaryList: S.optional(TemplateSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListTemplateVersionsResponse extends S.Class<ListTemplateVersionsResponse>(
  "ListTemplateVersionsResponse",
)({
  TemplateVersionSummaryList: S.optional(TemplateVersionSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListThemesResponse extends S.Class<ListThemesResponse>(
  "ListThemesResponse",
)({
  ThemeSummaryList: S.optional(ThemeSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListThemeVersionsResponse extends S.Class<ListThemeVersionsResponse>(
  "ListThemeVersionsResponse",
)({
  ThemeVersionSummaryList: S.optional(ThemeVersionSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListTopicRefreshSchedulesResponse extends S.Class<ListTopicRefreshSchedulesResponse>(
  "ListTopicRefreshSchedulesResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  RefreshSchedules: S.optional(TopicRefreshScheduleSummaries),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListTopicReviewedAnswersResponse extends S.Class<ListTopicReviewedAnswersResponse>(
  "ListTopicReviewedAnswersResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  Answers: S.optional(TopicReviewedAnswers),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class ListTopicsResponse extends S.Class<ListTopicsResponse>(
  "ListTopicsResponse",
)({
  TopicsSummaries: S.optional(TopicSummaries),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class ListVPCConnectionsResponse extends S.Class<ListVPCConnectionsResponse>(
  "ListVPCConnectionsResponse",
)({
  VPCConnectionSummaries: S.optional(VPCConnectionSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class SearchActionConnectorsResponse extends S.Class<SearchActionConnectorsResponse>(
  "SearchActionConnectorsResponse",
)({
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  ActionConnectorSummaries: S.optional(ActionConnectorSummaryList),
}) {}
export class SearchAnalysesResponse extends S.Class<SearchAnalysesResponse>(
  "SearchAnalysesResponse",
)({
  AnalysisSummaryList: S.optional(AnalysisSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class SearchDashboardsResponse extends S.Class<SearchDashboardsResponse>(
  "SearchDashboardsResponse",
)({
  DashboardSummaryList: S.optional(DashboardSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export const RowLevelPermissionDataSetMap = S.Record({
  key: S.String,
  value: RowLevelPermissionDataSet,
});
export class DataSetSummary extends S.Class<DataSetSummary>("DataSetSummary")({
  Arn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImportMode: S.optional(S.String),
  RowLevelPermissionDataSet: S.optional(RowLevelPermissionDataSet),
  RowLevelPermissionDataSetMap: S.optional(RowLevelPermissionDataSetMap),
  RowLevelPermissionTagConfigurationApplied: S.optional(S.Boolean),
  ColumnLevelPermissionRulesApplied: S.optional(S.Boolean),
  UseAs: S.optional(S.String),
}) {}
export const DataSetSummaryList = S.Array(DataSetSummary);
export class SearchDataSetsResponse extends S.Class<SearchDataSetsResponse>(
  "SearchDataSetsResponse",
)({
  DataSetSummaries: S.optional(DataSetSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class SearchFlowsOutput extends S.Class<SearchFlowsOutput>(
  "SearchFlowsOutput",
)({
  FlowSummaryList: FlowSummaryList,
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class SearchFoldersResponse extends S.Class<SearchFoldersResponse>(
  "SearchFoldersResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  FolderSummaryList: S.optional(FolderSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
}) {}
export class SearchGroupsResponse extends S.Class<SearchGroupsResponse>(
  "SearchGroupsResponse",
)({
  GroupList: S.optional(GroupList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class SearchTopicsResponse extends S.Class<SearchTopicsResponse>(
  "SearchTopicsResponse",
)({
  TopicSummaryList: S.optional(TopicSummaries),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class StartAssetBundleExportJobRequest extends S.Class<StartAssetBundleExportJobRequest>(
  "StartAssetBundleExportJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssetBundleExportJobId: S.String,
    ResourceArns: AssetBundleResourceArns,
    IncludeAllDependencies: S.optional(S.Boolean),
    ExportFormat: S.String,
    CloudFormationOverridePropertyConfiguration: S.optional(
      AssetBundleCloudFormationOverridePropertyConfiguration,
    ),
    IncludePermissions: S.optional(S.Boolean),
    IncludeTags: S.optional(S.Boolean),
    ValidationStrategy: S.optional(AssetBundleExportJobValidationStrategy),
    IncludeFolderMemberships: S.optional(S.Boolean),
    IncludeFolderMembers: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/asset-bundle-export-jobs/export",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SnapshotFileSheetSelectionVisualIdList = S.Array(S.String);
export class UpdateFlowPermissionsOutput extends S.Class<UpdateFlowPermissionsOutput>(
  "UpdateFlowPermissionsOutput",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  Arn: S.String,
  Permissions: PermissionsList,
  RequestId: S.String,
  FlowId: S.String,
}) {}
export class UpdateIpRestrictionResponse extends S.Class<UpdateIpRestrictionResponse>(
  "UpdateIpRestrictionResponse",
)({
  AwsAccountId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class Sheet extends S.Class<Sheet>("Sheet")({
  SheetId: S.optional(S.String),
  Name: S.optional(S.String),
  Images: S.optional(SheetImageList),
}) {}
export const SheetList = S.Array(Sheet);
export class DashboardVersion extends S.Class<DashboardVersion>(
  "DashboardVersion",
)({
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Errors: S.optional(DashboardErrorList),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
  Arn: S.optional(S.String),
  SourceEntityArn: S.optional(S.String),
  DataSetArns: S.optional(DataSetArnsList),
  Description: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Sheets: S.optional(SheetList),
}) {}
export class SnapshotAnonymousUserRedacted extends S.Class<SnapshotAnonymousUserRedacted>(
  "SnapshotAnonymousUserRedacted",
)({ RowLevelPermissionTagKeys: S.optional(SessionTagKeyList) }) {}
export const SnapshotAnonymousUserRedactedList = S.Array(
  SnapshotAnonymousUserRedacted,
);
export class SnapshotFileSheetSelection extends S.Class<SnapshotFileSheetSelection>(
  "SnapshotFileSheetSelection",
)({
  SheetId: S.String,
  SelectionScope: S.String,
  VisualIds: S.optional(SnapshotFileSheetSelectionVisualIdList),
}) {}
export const SnapshotFileSheetSelectionList = S.Array(
  SnapshotFileSheetSelection,
);
export class SnapshotFile extends S.Class<SnapshotFile>("SnapshotFile")({
  SheetSelections: SnapshotFileSheetSelectionList,
  FormatType: S.String,
}) {}
export const SnapshotFileList = S.Array(SnapshotFile);
export class S3BucketConfiguration extends S.Class<S3BucketConfiguration>(
  "S3BucketConfiguration",
)({ BucketName: S.String, BucketPrefix: S.String, BucketRegion: S.String }) {}
export class SnapshotS3DestinationConfiguration extends S.Class<SnapshotS3DestinationConfiguration>(
  "SnapshotS3DestinationConfiguration",
)({ BucketConfiguration: S3BucketConfiguration }) {}
export class SnapshotJobResultErrorInfo extends S.Class<SnapshotJobResultErrorInfo>(
  "SnapshotJobResultErrorInfo",
)({ ErrorMessage: S.optional(S.String), ErrorType: S.optional(S.String) }) {}
export const SnapshotJobResultErrorInfoList = S.Array(
  SnapshotJobResultErrorInfo,
);
export class SnapshotJobS3Result extends S.Class<SnapshotJobS3Result>(
  "SnapshotJobS3Result",
)({
  S3DestinationConfiguration: S.optional(SnapshotS3DestinationConfiguration),
  S3Uri: S.optional(S.String),
  ErrorInfo: S.optional(SnapshotJobResultErrorInfoList),
}) {}
export const SnapshotJobS3ResultList = S.Array(SnapshotJobS3Result);
export class SnapshotJobResultFileGroup extends S.Class<SnapshotJobResultFileGroup>(
  "SnapshotJobResultFileGroup",
)({
  Files: S.optional(SnapshotFileList),
  S3Results: S.optional(SnapshotJobS3ResultList),
}) {}
export const SnapshotJobResultFileGroupList = S.Array(
  SnapshotJobResultFileGroup,
);
export class RegisteredUserSnapshotJobResult extends S.Class<RegisteredUserSnapshotJobResult>(
  "RegisteredUserSnapshotJobResult",
)({ FileGroups: S.optional(SnapshotJobResultFileGroupList) }) {}
export const RegisteredUserSnapshotJobResultList = S.Array(
  RegisteredUserSnapshotJobResult,
);
export class OutputColumn extends S.Class<OutputColumn>("OutputColumn")({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  SubType: S.optional(S.String),
}) {}
export const OutputColumnList = S.Array(OutputColumn);
export class TemplateVersion extends S.Class<TemplateVersion>(
  "TemplateVersion",
)({
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Errors: S.optional(TemplateErrorList),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
  DataSetConfigurations: S.optional(DataSetConfigurationList),
  Description: S.optional(S.String),
  SourceEntityArn: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Sheets: S.optional(SheetList),
}) {}
export class AnonymousUserDashboardVisualEmbeddingConfiguration extends S.Class<AnonymousUserDashboardVisualEmbeddingConfiguration>(
  "AnonymousUserDashboardVisualEmbeddingConfiguration",
)({ InitialDashboardVisualId: DashboardVisualId }) {}
export class AnalysisError extends S.Class<AnalysisError>("AnalysisError")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
  ViolatedEntities: S.optional(EntityList),
}) {}
export const AnalysisErrorList = S.Array(AnalysisError);
export class Analysis extends S.Class<Analysis>("Analysis")({
  AnalysisId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Errors: S.optional(AnalysisErrorList),
  DataSetArns: S.optional(DataSetArnsList),
  ThemeArn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Sheets: S.optional(SheetList),
}) {}
export class Dashboard extends S.Class<Dashboard>("Dashboard")({
  DashboardId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(DashboardVersion),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastPublishedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LinkEntities: S.optional(LinkEntityArnList),
}) {}
export class SnapshotUserConfigurationRedacted extends S.Class<SnapshotUserConfigurationRedacted>(
  "SnapshotUserConfigurationRedacted",
)({ AnonymousUsers: S.optional(SnapshotAnonymousUserRedactedList) }) {}
export class DataSet extends S.Class<DataSet>("DataSet")({
  Arn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  Name: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PhysicalTableMap: S.optional(PhysicalTableMap),
  LogicalTableMap: S.optional(LogicalTableMap),
  OutputColumns: S.optional(OutputColumnList),
  ImportMode: S.optional(S.String),
  ConsumedSpiceCapacityInBytes: S.optional(S.Number),
  ColumnGroups: S.optional(ColumnGroupList),
  FieldFolders: S.optional(FieldFolderMap),
  RowLevelPermissionDataSet: S.optional(RowLevelPermissionDataSet),
  RowLevelPermissionTagConfiguration: S.optional(
    RowLevelPermissionTagConfiguration,
  ),
  ColumnLevelPermissionRules: S.optional(ColumnLevelPermissionRuleList),
  DataSetUsageConfiguration: S.optional(DataSetUsageConfiguration),
  DatasetParameters: S.optional(DatasetParameterList),
  PerformanceConfiguration: S.optional(PerformanceConfiguration),
  UseAs: S.optional(S.String),
  DataPrepConfiguration: S.optional(DataPrepConfiguration),
  SemanticModelConfiguration: S.optional(SemanticModelConfiguration),
}) {}
export class Template extends S.Class<Template>("Template")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(TemplateVersion),
  TemplateId: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class VPCConnection extends S.Class<VPCConnection>("VPCConnection")({
  VPCConnectionId: S.optional(S.String),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  VPCId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIdList),
  DnsResolvers: S.optional(StringList),
  Status: S.optional(S.String),
  AvailabilityStatus: S.optional(S.String),
  NetworkInterfaces: S.optional(NetworkInterfaceList),
  RoleArn: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataSourceSummary extends S.Class<DataSourceSummary>(
  "DataSourceSummary",
)({
  Arn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DataSourceSummaryList = S.Array(DataSourceSummary);
export class FailedKeyRegistrationEntry extends S.Class<FailedKeyRegistrationEntry>(
  "FailedKeyRegistrationEntry",
)({
  KeyArn: S.optional(S.String),
  Message: S.String,
  StatusCode: S.Number,
  SenderFault: S.Boolean,
}) {}
export const FailedKeyRegistrationEntries = S.Array(FailedKeyRegistrationEntry);
export class SuccessfulKeyRegistrationEntry extends S.Class<SuccessfulKeyRegistrationEntry>(
  "SuccessfulKeyRegistrationEntry",
)({ KeyArn: S.String, StatusCode: S.Number }) {}
export const SuccessfulKeyRegistrationEntries = S.Array(
  SuccessfulKeyRegistrationEntry,
);
export class ThemeError extends S.Class<ThemeError>("ThemeError")({
  Type: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const ThemeErrorList = S.Array(ThemeError);
export class AnonymousUserDashboardFeatureConfigurations extends S.Class<AnonymousUserDashboardFeatureConfigurations>(
  "AnonymousUserDashboardFeatureConfigurations",
)({ SharedView: S.optional(SharedViewConfigurations) }) {}
export const SnapshotS3DestinationConfigurationList = S.Array(
  SnapshotS3DestinationConfiguration,
);
export class CreateDashboardRequest extends S.Class<CreateDashboardRequest>(
  "CreateDashboardRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    Name: S.String,
    Parameters: S.optional(Parameters),
    Permissions: S.optional(ResourcePermissionList),
    SourceEntity: S.optional(DashboardSourceEntity),
    Tags: S.optional(TagList),
    VersionDescription: S.optional(S.String),
    DashboardPublishOptions: S.optional(DashboardPublishOptions),
    ThemeArn: S.optional(S.String),
    Definition: S.optional(DashboardVersionDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
    FolderArns: S.optional(FolderArnList),
    LinkSharingConfiguration: S.optional(LinkSharingConfiguration),
    LinkEntities: S.optional(LinkEntityArnList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataSourceRequest extends S.Class<CreateDataSourceRequest>(
  "CreateDataSourceRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSourceId: S.String,
    Name: S.String,
    Type: S.String,
    DataSourceParameters: S.optional(DataSourceParameters),
    Credentials: S.optional(DataSourceCredentials),
    Permissions: S.optional(ResourcePermissionList),
    VpcConnectionProperties: S.optional(VpcConnectionProperties),
    SslProperties: S.optional(SslProperties),
    Tags: S.optional(TagList),
    FolderArns: S.optional(FolderArnList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/data-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRefreshScheduleRequest extends S.Class<CreateRefreshScheduleRequest>(
  "CreateRefreshScheduleRequest",
)(
  {
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    Schedule: RefreshSchedule,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-schedules",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnalysisResponse extends S.Class<DescribeAnalysisResponse>(
  "DescribeAnalysisResponse",
)({
  Analysis: S.optional(Analysis),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeAnalysisDefinitionResponse extends S.Class<DescribeAnalysisDefinitionResponse>(
  "DescribeAnalysisDefinitionResponse",
)({
  AnalysisId: S.optional(S.String),
  Name: S.optional(S.String),
  Errors: S.optional(AnalysisErrorList),
  ResourceStatus: S.optional(S.String),
  ThemeArn: S.optional(S.String),
  Definition: S.optional(AnalysisDefinition),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeDashboardResponse extends S.Class<DescribeDashboardResponse>(
  "DescribeDashboardResponse",
)({
  Dashboard: S.optional(Dashboard),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class SnapshotFileGroup extends S.Class<SnapshotFileGroup>(
  "SnapshotFileGroup",
)({ Files: S.optional(SnapshotFileList) }) {}
export const SnapshotFileGroupList = S.Array(SnapshotFileGroup);
export class SnapshotDestinationConfiguration extends S.Class<SnapshotDestinationConfiguration>(
  "SnapshotDestinationConfiguration",
)({ S3Destinations: S.optional(SnapshotS3DestinationConfigurationList) }) {}
export class SnapshotConfiguration extends S.Class<SnapshotConfiguration>(
  "SnapshotConfiguration",
)({
  FileGroups: SnapshotFileGroupList,
  DestinationConfiguration: S.optional(SnapshotDestinationConfiguration),
  Parameters: S.optional(Parameters),
}) {}
export class DescribeDashboardSnapshotJobResponse extends S.Class<DescribeDashboardSnapshotJobResponse>(
  "DescribeDashboardSnapshotJobResponse",
)({
  AwsAccountId: S.optional(S.String),
  DashboardId: S.optional(S.String),
  SnapshotJobId: S.optional(S.String),
  UserConfiguration: S.optional(SnapshotUserConfigurationRedacted),
  SnapshotConfiguration: S.optional(SnapshotConfiguration),
  Arn: S.optional(S.String),
  JobStatus: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number),
}) {}
export class DescribeDataSetResponse extends S.Class<DescribeDataSetResponse>(
  "DescribeDataSetResponse",
)({
  DataSet: S.optional(DataSet),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeDataSourceResponse extends S.Class<DescribeDataSourceResponse>(
  "DescribeDataSourceResponse",
)({
  DataSource: S.optional(DataSource),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeIngestionResponse extends S.Class<DescribeIngestionResponse>(
  "DescribeIngestionResponse",
)({
  Ingestion: S.optional(Ingestion),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeNamespaceResponse extends S.Class<DescribeNamespaceResponse>(
  "DescribeNamespaceResponse",
)({
  Namespace: S.optional(NamespaceInfoV2),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeTemplateResponse extends S.Class<DescribeTemplateResponse>(
  "DescribeTemplateResponse",
)({
  Template: S.optional(Template),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class DescribeVPCConnectionResponse extends S.Class<DescribeVPCConnectionResponse>(
  "DescribeVPCConnectionResponse",
)({
  VPCConnection: S.optional(VPCConnection),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number),
}) {}
export class ListDataSetsResponse extends S.Class<ListDataSetsResponse>(
  "ListDataSetsResponse",
)({
  DataSetSummaries: S.optional(DataSetSummaryList),
  NextToken: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class PredictQAResultsResponse extends S.Class<PredictQAResultsResponse>(
  "PredictQAResultsResponse",
)({
  PrimaryResult: S.optional(QAResult),
  AdditionalResults: S.optional(QAResults),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class SearchDataSourcesResponse extends S.Class<SearchDataSourcesResponse>(
  "SearchDataSourcesResponse",
)({
  DataSourceSummaries: S.optional(DataSourceSummaryList),
  NextToken: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class StartAssetBundleExportJobResponse extends S.Class<StartAssetBundleExportJobResponse>(
  "StartAssetBundleExportJobResponse",
)({
  Arn: S.optional(S.String),
  AssetBundleExportJobId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class UpdateKeyRegistrationResponse extends S.Class<UpdateKeyRegistrationResponse>(
  "UpdateKeyRegistrationResponse",
)({
  FailedKeyRegistration: S.optional(FailedKeyRegistrationEntries),
  SuccessfulKeyRegistration: S.optional(SuccessfulKeyRegistrationEntries),
  RequestId: S.optional(S.String),
}) {}
export class ThemeVersion extends S.Class<ThemeVersion>("ThemeVersion")({
  VersionNumber: S.optional(S.Number),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  BaseThemeId: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Configuration: S.optional(ThemeConfiguration),
  Errors: S.optional(ThemeErrorList),
  Status: S.optional(S.String),
}) {}
export class AnonymousUserDashboardEmbeddingConfiguration extends S.Class<AnonymousUserDashboardEmbeddingConfiguration>(
  "AnonymousUserDashboardEmbeddingConfiguration",
)({
  InitialDashboardId: S.String,
  EnabledFeatures: S.optional(
    AnonymousUserDashboardEmbeddingConfigurationEnabledFeatures,
  ),
  DisabledFeatures: S.optional(
    AnonymousUserDashboardEmbeddingConfigurationDisabledFeatures,
  ),
  FeatureConfigurations: S.optional(
    AnonymousUserDashboardFeatureConfigurations,
  ),
}) {}
export class ReadBasicAuthConnectionMetadata extends S.Class<ReadBasicAuthConnectionMetadata>(
  "ReadBasicAuthConnectionMetadata",
)({ BaseEndpoint: S.String, Username: S.String }) {}
export class ReadAPIKeyConnectionMetadata extends S.Class<ReadAPIKeyConnectionMetadata>(
  "ReadAPIKeyConnectionMetadata",
)({ BaseEndpoint: S.String, Email: S.optional(S.String) }) {}
export class ReadNoneConnectionMetadata extends S.Class<ReadNoneConnectionMetadata>(
  "ReadNoneConnectionMetadata",
)({ BaseEndpoint: S.String }) {}
export class ReadIamConnectionMetadata extends S.Class<ReadIamConnectionMetadata>(
  "ReadIamConnectionMetadata",
)({ RoleArn: S.String, SourceArn: S.String }) {}
export class Theme extends S.Class<Theme>("Theme")({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  ThemeId: S.optional(S.String),
  Version: S.optional(ThemeVersion),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Type: S.optional(S.String),
}) {}
export class AnonymousUserEmbeddingExperienceConfiguration extends S.Class<AnonymousUserEmbeddingExperienceConfiguration>(
  "AnonymousUserEmbeddingExperienceConfiguration",
)({
  Dashboard: S.optional(AnonymousUserDashboardEmbeddingConfiguration),
  DashboardVisual: S.optional(
    AnonymousUserDashboardVisualEmbeddingConfiguration,
  ),
  QSearchBar: S.optional(AnonymousUserQSearchBarEmbeddingConfiguration),
  GenerativeQnA: S.optional(AnonymousUserGenerativeQnAEmbeddingConfiguration),
}) {}
export class CreateDashboardResponse extends S.Class<CreateDashboardResponse>(
  "CreateDashboardResponse",
)({
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  DashboardId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateDataSourceResponse extends S.Class<CreateDataSourceResponse>(
  "CreateDataSourceResponse",
)({
  Arn: S.optional(S.String),
  DataSourceId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateRefreshScheduleResponse extends S.Class<CreateRefreshScheduleResponse>(
  "CreateRefreshScheduleResponse",
)({
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
  ScheduleId: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export class CreateTemplateRequest extends S.Class<CreateTemplateRequest>(
  "CreateTemplateRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TemplateId: S.String.pipe(T.HttpLabel("TemplateId")),
    Name: S.optional(S.String),
    Permissions: S.optional(ResourcePermissionList),
    SourceEntity: S.optional(TemplateSourceEntity),
    Tags: S.optional(TagList),
    VersionDescription: S.optional(S.String),
    Definition: S.optional(TemplateVersionDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/templates/{TemplateId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateThemeRequest extends S.Class<CreateThemeRequest>(
  "CreateThemeRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ThemeId: S.String.pipe(T.HttpLabel("ThemeId")),
    Name: S.String,
    BaseThemeId: S.String,
    VersionDescription: S.optional(S.String),
    Configuration: ThemeConfiguration,
    Permissions: S.optional(ResourcePermissionList),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/themes/{ThemeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThemeResponse extends S.Class<DescribeThemeResponse>(
  "DescribeThemeResponse",
)({
  Theme: S.optional(Theme),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class GenerateEmbedUrlForAnonymousUserRequest extends S.Class<GenerateEmbedUrlForAnonymousUserRequest>(
  "GenerateEmbedUrlForAnonymousUserRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    SessionLifetimeInMinutes: S.optional(S.Number),
    Namespace: S.String,
    SessionTags: S.optional(SessionTagList),
    AuthorizedResourceArns: ArnList,
    ExperienceConfiguration: AnonymousUserEmbeddingExperienceConfiguration,
    AllowedDomains: S.optional(StringList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/embed-url/anonymous-user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDataSetRefreshPropertiesRequest extends S.Class<PutDataSetRefreshPropertiesRequest>(
  "PutDataSetRefreshPropertiesRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String.pipe(T.HttpLabel("DataSetId")),
    DataSetRefreshProperties: DataSetRefreshProperties,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/accounts/{AwsAccountId}/data-sets/{DataSetId}/refresh-properties",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartAssetBundleImportJobRequest extends S.Class<StartAssetBundleImportJobRequest>(
  "StartAssetBundleImportJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AssetBundleImportJobId: S.String,
    AssetBundleImportSource: AssetBundleImportSource,
    OverrideParameters: S.optional(AssetBundleImportJobOverrideParameters),
    FailureAction: S.optional(S.String),
    OverridePermissions: S.optional(AssetBundleImportJobOverridePermissions),
    OverrideTags: S.optional(AssetBundleImportJobOverrideTags),
    OverrideValidationStrategy: S.optional(
      AssetBundleImportJobOverrideValidationStrategy,
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/asset-bundle-import-jobs/import",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDashboardSnapshotJobRequest extends S.Class<StartDashboardSnapshotJobRequest>(
  "StartDashboardSnapshotJobRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DashboardId: S.String.pipe(T.HttpLabel("DashboardId")),
    SnapshotJobId: S.String,
    UserConfiguration: S.optional(SnapshotUserConfiguration),
    SnapshotConfiguration: SnapshotConfiguration,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/dashboards/{DashboardId}/snapshot-jobs",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicReviewedAnswer extends S.Class<CreateTopicReviewedAnswer>(
  "CreateTopicReviewedAnswer",
)({
  AnswerId: S.String,
  DatasetArn: S.String,
  Question: S.String,
  Mir: S.optional(TopicIR),
  PrimaryVisual: S.optional(TopicVisual),
  Template: S.optional(TopicTemplate),
}) {}
export const CreateTopicReviewedAnswers = S.Array(CreateTopicReviewedAnswer);
export class ReadAuthorizationCodeGrantDetails extends S.Class<ReadAuthorizationCodeGrantDetails>(
  "ReadAuthorizationCodeGrantDetails",
)({
  ClientId: S.String,
  TokenEndpoint: S.String,
  AuthorizationEndpoint: S.String,
}) {}
export class ReadClientCredentialsGrantDetails extends S.Class<ReadClientCredentialsGrantDetails>(
  "ReadClientCredentialsGrantDetails",
)({ ClientId: S.String, TokenEndpoint: S.String }) {}
export class BatchCreateTopicReviewedAnswerRequest extends S.Class<BatchCreateTopicReviewedAnswerRequest>(
  "BatchCreateTopicReviewedAnswerRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String.pipe(T.HttpLabel("TopicId")),
    Answers: CreateTopicReviewedAnswers,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/topics/{TopicId}/batch-create-reviewed-answers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateActionConnectorRequest extends S.Class<CreateActionConnectorRequest>(
  "CreateActionConnectorRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    ActionConnectorId: S.String,
    Name: S.String,
    Type: S.String,
    AuthenticationConfig: AuthConfig,
    Description: S.optional(S.String),
    Permissions: S.optional(ResourcePermissionList),
    VpcConnectionArn: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/action-connectors",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTemplateResponse extends S.Class<CreateTemplateResponse>(
  "CreateTemplateResponse",
)({
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  TemplateId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateThemeResponse extends S.Class<CreateThemeResponse>(
  "CreateThemeResponse",
)({
  Arn: S.optional(S.String),
  VersionArn: S.optional(S.String),
  ThemeId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export const ReadAuthorizationCodeGrantCredentialsDetails = S.Union(
  S.Struct({
    ReadAuthorizationCodeGrantDetails: ReadAuthorizationCodeGrantDetails,
  }),
);
export const ReadClientCredentialsDetails = S.Union(
  S.Struct({
    ReadClientCredentialsGrantDetails: ReadClientCredentialsGrantDetails,
  }),
);
export class GenerateEmbedUrlForAnonymousUserResponse extends S.Class<GenerateEmbedUrlForAnonymousUserResponse>(
  "GenerateEmbedUrlForAnonymousUserResponse",
)({
  EmbedUrl: S.String,
  Status: S.Number.pipe(T.HttpResponseCode()),
  RequestId: S.String,
  AnonymousUserArn: S.String,
}) {}
export class GenerateEmbedUrlForRegisteredUserRequest extends S.Class<GenerateEmbedUrlForRegisteredUserRequest>(
  "GenerateEmbedUrlForRegisteredUserRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    SessionLifetimeInMinutes: S.optional(S.Number),
    UserArn: S.String,
    ExperienceConfiguration: RegisteredUserEmbeddingExperienceConfiguration,
    AllowedDomains: S.optional(StringList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/embed-url/registered-user",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutDataSetRefreshPropertiesResponse extends S.Class<PutDataSetRefreshPropertiesResponse>(
  "PutDataSetRefreshPropertiesResponse",
)({
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class StartAssetBundleImportJobResponse extends S.Class<StartAssetBundleImportJobResponse>(
  "StartAssetBundleImportJobResponse",
)({
  Arn: S.optional(S.String),
  AssetBundleImportJobId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class StartDashboardSnapshotJobResponse extends S.Class<StartDashboardSnapshotJobResponse>(
  "StartDashboardSnapshotJobResponse",
)({
  Arn: S.optional(S.String),
  SnapshotJobId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class AnonymousUserSnapshotJobResult extends S.Class<AnonymousUserSnapshotJobResult>(
  "AnonymousUserSnapshotJobResult",
)({ FileGroups: S.optional(SnapshotJobResultFileGroupList) }) {}
export const AnonymousUserSnapshotJobResultList = S.Array(
  AnonymousUserSnapshotJobResult,
);
export class ReadAuthorizationCodeGrantMetadata extends S.Class<ReadAuthorizationCodeGrantMetadata>(
  "ReadAuthorizationCodeGrantMetadata",
)({
  BaseEndpoint: S.String,
  RedirectUrl: S.String,
  ReadAuthorizationCodeGrantCredentialsDetails: S.optional(
    ReadAuthorizationCodeGrantCredentialsDetails,
  ),
  AuthorizationCodeGrantCredentialsSource: S.optional(S.String),
}) {}
export class ReadClientCredentialsGrantMetadata extends S.Class<ReadClientCredentialsGrantMetadata>(
  "ReadClientCredentialsGrantMetadata",
)({
  BaseEndpoint: S.String,
  ReadClientCredentialsDetails: S.optional(ReadClientCredentialsDetails),
  ClientCredentialsSource: S.optional(S.String),
}) {}
export class SnapshotJobResult extends S.Class<SnapshotJobResult>(
  "SnapshotJobResult",
)({
  AnonymousUsers: S.optional(AnonymousUserSnapshotJobResultList),
  RegisteredUsers: S.optional(RegisteredUserSnapshotJobResultList),
}) {}
export const ReadAuthenticationMetadata = S.Union(
  S.Struct({
    AuthorizationCodeGrantMetadata: ReadAuthorizationCodeGrantMetadata,
  }),
  S.Struct({
    ClientCredentialsGrantMetadata: ReadClientCredentialsGrantMetadata,
  }),
  S.Struct({ BasicAuthConnectionMetadata: ReadBasicAuthConnectionMetadata }),
  S.Struct({ ApiKeyConnectionMetadata: ReadAPIKeyConnectionMetadata }),
  S.Struct({ NoneConnectionMetadata: ReadNoneConnectionMetadata }),
  S.Struct({ IamConnectionMetadata: ReadIamConnectionMetadata }),
);
export class BatchCreateTopicReviewedAnswerResponse extends S.Class<BatchCreateTopicReviewedAnswerResponse>(
  "BatchCreateTopicReviewedAnswerResponse",
)({
  TopicId: S.optional(S.String),
  TopicArn: S.optional(S.String),
  SucceededAnswers: S.optional(SucceededTopicReviewedAnswers),
  InvalidAnswers: S.optional(InvalidTopicReviewedAnswers),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}
export class CreateActionConnectorResponse extends S.Class<CreateActionConnectorResponse>(
  "CreateActionConnectorResponse",
)({
  Arn: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  ActionConnectorId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateBrandRequest extends S.Class<CreateBrandRequest>(
  "CreateBrandRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    BrandId: S.String.pipe(T.HttpLabel("BrandId")),
    BrandDefinition: S.optional(BrandDefinition),
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/brands/{BrandId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicRequest extends S.Class<CreateTopicRequest>(
  "CreateTopicRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    TopicId: S.String,
    Topic: TopicDetails,
    Tags: S.optional(TagList),
    FolderArns: S.optional(FolderArnList),
    CustomInstructions: S.optional(CustomInstructions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/topics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBrandResponse extends S.Class<DescribeBrandResponse>(
  "DescribeBrandResponse",
)({
  RequestId: S.optional(S.String),
  BrandDetail: S.optional(BrandDetail),
  BrandDefinition: S.optional(BrandDefinition),
}) {}
export class DescribeDashboardSnapshotJobResultResponse extends S.Class<DescribeDashboardSnapshotJobResultResponse>(
  "DescribeDashboardSnapshotJobResultResponse",
)({
  Arn: S.optional(S.String),
  JobStatus: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Result: S.optional(SnapshotJobResult),
  ErrorInfo: S.optional(SnapshotJobErrorInfo),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class GenerateEmbedUrlForRegisteredUserResponse extends S.Class<GenerateEmbedUrlForRegisteredUserResponse>(
  "GenerateEmbedUrlForRegisteredUserResponse",
)({
  EmbedUrl: S.String,
  Status: S.Number.pipe(T.HttpResponseCode()),
  RequestId: S.String,
}) {}
export class ReadAuthConfig extends S.Class<ReadAuthConfig>("ReadAuthConfig")({
  AuthenticationType: S.String,
  AuthenticationMetadata: ReadAuthenticationMetadata,
}) {}
export class ActionConnector extends S.Class<ActionConnector>(
  "ActionConnector",
)({
  Arn: S.String,
  ActionConnectorId: S.String,
  Type: S.String,
  Name: S.String,
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Status: S.optional(S.String),
  Error: S.optional(ActionConnectorError),
  Description: S.optional(S.String),
  AuthenticationConfig: S.optional(ReadAuthConfig),
  EnabledActions: S.optional(ActionIdList),
  VpcConnectionArn: S.optional(S.String),
}) {}
export class CreateBrandResponse extends S.Class<CreateBrandResponse>(
  "CreateBrandResponse",
)({
  RequestId: S.optional(S.String),
  BrandDetail: S.optional(BrandDetail),
  BrandDefinition: S.optional(BrandDefinition),
}) {}
export class CreateDataSetRequest extends S.Class<CreateDataSetRequest>(
  "CreateDataSetRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    DataSetId: S.String,
    Name: S.String,
    PhysicalTableMap: PhysicalTableMap,
    LogicalTableMap: S.optional(LogicalTableMap),
    ImportMode: S.String,
    ColumnGroups: S.optional(ColumnGroupList),
    FieldFolders: S.optional(FieldFolderMap),
    Permissions: S.optional(ResourcePermissionList),
    RowLevelPermissionDataSet: S.optional(RowLevelPermissionDataSet),
    RowLevelPermissionTagConfiguration: S.optional(
      RowLevelPermissionTagConfiguration,
    ),
    ColumnLevelPermissionRules: S.optional(ColumnLevelPermissionRuleList),
    Tags: S.optional(TagList),
    DataSetUsageConfiguration: S.optional(DataSetUsageConfiguration),
    DatasetParameters: S.optional(DatasetParameterList),
    FolderArns: S.optional(FolderArnList),
    PerformanceConfiguration: S.optional(PerformanceConfiguration),
    UseAs: S.optional(S.String),
    DataPrepConfiguration: S.optional(DataPrepConfiguration),
    SemanticModelConfiguration: S.optional(SemanticModelConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AwsAccountId}/data-sets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTopicResponse extends S.Class<CreateTopicResponse>(
  "CreateTopicResponse",
)({
  Arn: S.optional(S.String),
  TopicId: S.optional(S.String),
  RefreshArn: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class DescribeActionConnectorResponse extends S.Class<DescribeActionConnectorResponse>(
  "DescribeActionConnectorResponse",
)({
  ActionConnector: S.optional(ActionConnector),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateDataSetResponse extends S.Class<CreateDataSetResponse>(
  "CreateDataSetResponse",
)({
  Arn: S.optional(S.String),
  DataSetId: S.optional(S.String),
  IngestionArn: S.optional(S.String),
  IngestionId: S.optional(S.String),
  RequestId: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class CreateAnalysisRequest extends S.Class<CreateAnalysisRequest>(
  "CreateAnalysisRequest",
)(
  {
    AwsAccountId: S.String.pipe(T.HttpLabel("AwsAccountId")),
    AnalysisId: S.String.pipe(T.HttpLabel("AnalysisId")),
    Name: S.String,
    Parameters: S.optional(Parameters),
    Permissions: S.optional(ResourcePermissionList),
    SourceEntity: S.optional(AnalysisSourceEntity),
    ThemeArn: S.optional(S.String),
    Tags: S.optional(TagList),
    Definition: S.optional(AnalysisDefinition),
    ValidationStrategy: S.optional(ValidationStrategy),
    FolderArns: S.optional(FolderArnList),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/accounts/{AwsAccountId}/analyses/{AnalysisId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAnalysisResponse extends S.Class<CreateAnalysisResponse>(
  "CreateAnalysisResponse",
)({
  Arn: S.optional(S.String),
  AnalysisId: S.optional(S.String),
  CreationStatus: S.optional(S.String),
  Status: S.optional(S.Number).pipe(T.HttpResponseCode()),
  RequestId: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConcurrentUpdatingException extends S.TaggedError<ConcurrentUpdatingException>()(
  "ConcurrentUpdatingException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DomainNotWhitelistedException extends S.TaggedError<DomainNotWhitelistedException>()(
  "DomainNotWhitelistedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidDataSetParameterValueException extends S.TaggedError<InvalidDataSetParameterValueException>()(
  "InvalidDataSetParameterValueException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class CustomerManagedKeyUnavailableException extends S.TaggedError<CustomerManagedKeyUnavailableException>()(
  "CustomerManagedKeyUnavailableException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class PreconditionNotMetException extends S.TaggedError<PreconditionNotMetException>()(
  "PreconditionNotMetException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class IdentityTypeNotSupportedException extends S.TaggedError<IdentityTypeNotSupportedException>()(
  "IdentityTypeNotSupportedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class QuickSightUserNotFoundException extends S.TaggedError<QuickSightUserNotFoundException>()(
  "QuickSightUserNotFoundException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class UnsupportedUserEditionException extends S.TaggedError<UnsupportedUserEditionException>()(
  "UnsupportedUserEditionException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class SessionLifetimeInMinutesInvalidException extends S.TaggedError<SessionLifetimeInMinutesInvalidException>()(
  "SessionLifetimeInMinutesInvalidException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class UnsupportedPricingPlanException extends S.TaggedError<UnsupportedPricingPlanException>()(
  "UnsupportedPricingPlanException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes a SPICE ingestion.
 */
export const describeIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIngestionRequest,
  output: DescribeIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the current namespace.
 */
export const describeNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNamespaceRequest,
  output: DescribeNamespaceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Describes the self-upgrade configuration for a Quick Suite account.
 */
export const describeSelfUpgradeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSelfUpgradeConfigurationRequest,
    output: DescribeSelfUpgradeConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all brands in an Quick Sight account.
 */
export const listBrands = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBrandsRequest,
  output: ListBrandsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Describes a dataset. This operation doesn't support datasets that include uploaded
 * files as a source.
 */
export const describeDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataSetRequest,
  output: DescribeDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes a data source.
 */
export const describeDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataSourceRequest,
  output: DescribeDataSourceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes an existing IAM policy assignment, as specified by the
 * assignment name.
 */
export const describeIAMPolicyAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIAMPolicyAssignmentRequest,
    output: DescribeIAMPolicyAssignmentResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all of the datasets belonging to the current Amazon Web Services account in an
 * Amazon Web Services Region.
 *
 * The permissions resource is
 * `arn:aws:quicksight:region:aws-account-id:dataset/*`.
 */
export const listDataSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSetsRequest,
  output: ListDataSetsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Predicts existing visuals or generates new visuals to answer a given query.
 *
 * This API uses trusted identity propagation to ensure that an end user is authenticated and receives the embed URL that is specific to that user. The IAM Identity Center application that the user has logged into needs to have trusted Identity Propagation enabled for Quick Suite with the scope value set to `quicksight:read`. Before you use this action, make sure that you have configured the relevant Quick Suite resource and permissions.
 *
 * We recommend enabling the `QSearchStatus` API to unlock the full potential of `PredictQnA`. When `QSearchStatus` is enabled, it first checks the specified dashboard for any existing visuals that match the question. If no matching visuals are found, `PredictQnA` uses generative Q&A to provide an answer. To update the `QSearchStatus`, see UpdateQuickSightQSearchConfiguration.
 */
export const predictQAResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PredictQAResultsRequest,
  output: PredictQAResultsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Use the `SearchDataSources` operation to search for data sources that
 * belong to an account.
 */
export const searchDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchDataSourcesRequest,
  output: SearchDataSourcesResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a customer managed key in a Quick Sight account.
 */
export const updateKeyRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateKeyRegistrationRequest,
    output: UpdateKeyRegistrationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a data source.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceRequest,
  output: UpdateDataSourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    CustomerManagedKeyUnavailableException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes all customer managed key registrations in a Quick Sight account.
 */
export const describeKeyRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeKeyRegistrationRequest,
    output: DescribeKeyRegistrationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the status of a topic refresh.
 */
export const describeTopicRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTopicRefreshRequest,
    output: DescribeTopicRefreshResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists flows in an Amazon Web Services account.
 */
export const listFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFlowsInput,
  output: ListFlowsOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Lists all services and authorized targets that the Quick Sight IAM Identity Center application can access.
 *
 * This operation is only supported for Quick Sight accounts that use IAM Identity Center.
 */
export const listIdentityPropagationConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListIdentityPropagationConfigsRequest,
    output: ListIdentityPropagationConfigsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all reviewed answers for a Q Topic.
 */
export const listTopicReviewedAnswers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTopicReviewedAnswersRequest,
    output: ListTopicReviewedAnswersResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Search for the flows in an Amazon Web Services account.
 */
export const searchFlows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchFlowsInput,
  output: SearchFlowsOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Updates permissions against principals on a flow.
 */
export const updateFlowPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFlowPermissionsInput,
    output: UpdateFlowPermissionsOutput,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the content and status of IP rules. Traffic from a source is allowed when the source satisfies either the `IpRestrictionRule`, `VpcIdRestrictionRule`, or `VpcEndpointIdRestrictionRule`. To use this operation, you must provide the entire map of rules. You can use the `DescribeIpRestriction` operation to get the current rule map.
 */
export const updateIpRestriction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIpRestrictionRequest,
  output: UpdateIpRestrictionResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Unapplies a custom permissions profile from an account.
 */
export const deleteAccountCustomPermission =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAccountCustomPermissionRequest,
    output: DeleteAccountCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Hard deletes an action connector, making it unrecoverable. This operation removes the connector and all its associated configurations. Any resources currently using this action connector will no longer be able to perform actions through it.
 */
export const deleteActionConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteActionConnectorRequest,
    output: DeleteActionConnectorResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a dataset.
 */
export const deleteDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSetRequest,
  output: DeleteDataSetResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the dataset refresh properties of the dataset.
 */
export const deleteDataSetRefreshProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataSetRefreshPropertiesRequest,
    output: DeleteDataSetRefreshPropertiesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the data source permanently. This operation breaks all the datasets that
 * reference the deleted data source.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceRequest,
  output: DeleteDataSourceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes all access scopes and authorized targets that are associated with a service from the Quick Sight IAM Identity Center application.
 *
 * This operation is only supported for Quick Sight accounts that use IAM Identity Center.
 */
export const deleteIdentityPropagationConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIdentityPropagationConfigRequest,
    output: DeleteIdentityPropagationConfigResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a refresh schedule from a dataset.
 */
export const deleteRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRefreshScheduleRequest,
    output: DeleteRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a topic.
 */
export const deleteTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTopicRequest,
  output: DeleteTopicResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the custom permissions profile that is applied to an account.
 */
export const describeAccountCustomPermission =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountCustomPermissionRequest,
    output: DescribeAccountCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the permissions configuration for an action connector, showing which users, groups, and namespaces have access and what operations they can perform.
 */
export const describeActionConnectorPermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeActionConnectorPermissionsRequest,
    output: DescribeActionConnectorPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes an existing dashboard QA configuration.
 */
export const describeDashboardsQAConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDashboardsQAConfigurationRequest,
    output: DescribeDashboardsQAConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes the permissions on a dataset.
 *
 * The permissions resource is
 * `arn:aws:quicksight:region:aws-account-id:dataset/data-set-id`.
 */
export const describeDataSetPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDataSetPermissionsRequest,
    output: DescribeDataSetPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the resource permissions for a data source.
 */
export const describeDataSourcePermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDataSourcePermissionsRequest,
    output: DescribeDataSourcePermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes a Amazon Q Business application that is linked to an Quick Sight account.
 */
export const describeDefaultQBusinessApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDefaultQBusinessApplicationRequest,
    output: DescribeDefaultQBusinessApplicationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Provides a summary and status of IP rules.
 */
export const describeIpRestriction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIpRestrictionRequest,
    output: DescribeIpRestrictionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a personalization configuration.
 */
export const describeQPersonalizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeQPersonalizationConfigurationRequest,
    output: DescribeQPersonalizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Describes the state of a Quick Sight Q Search configuration.
 */
export const describeQuickSightQSearchConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeQuickSightQSearchConfigurationRequest,
    output: DescribeQuickSightQSearchConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Provides a summary of a refresh schedule.
 */
export const describeRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRefreshScheduleRequest,
    output: DescribeRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a topic.
 */
export const describeTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTopicRequest,
  output: DescribeTopicResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the permissions of a topic.
 */
export const describeTopicPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTopicPermissionsRequest,
    output: DescribeTopicPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves the metadata of a flow, not including its definition specifying the steps.
 */
export const getFlowMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowMetadataInput,
  output: GetFlowMetadataOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Get permissions for a flow.
 */
export const getFlowPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFlowPermissionsInput,
  output: GetFlowPermissionsOutput,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Lists the refresh schedules of a dataset. Each dataset can have up to 5 schedules.
 */
export const listRefreshSchedules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRefreshSchedulesRequest,
    output: ListRefreshSchedulesResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the tags assigned to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified Amazon Quick Sight
 * resource.
 *
 * Tags can help you organize and categorize your resources. You can also use them to
 * scope user permissions, by granting a user permission to access or change only resources
 * with certain tag values. You can use the `TagResource` operation with a
 * resource that already has tags. If you specify a new tag key for the resource, this tag
 * is appended to the list of tags associated with the resource. If you specify a tag key
 * that is already associated with the resource, the new tag value that you specify
 * replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource. Amazon Quick Sight supports
 * tagging on data set, data source, dashboard, template, topic, and user.
 *
 * Tagging for Amazon Quick Sight works in a similar way to tagging for other Amazon Web Services services, except for the following:
 *
 * - Tags are used to track costs for users in Amazon Quick Sight. You can't
 * tag other resources that Amazon Quick Sight costs are based on, such as storage
 * capacoty (SPICE), session usage, alert consumption, or reporting units.
 *
 * - Amazon Quick Sight doesn't currently support the tag editor for Resource Groups.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Applies a custom permissions profile to an account.
 */
export const updateAccountCustomPermission =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAccountCustomPermissionRequest,
    output: UpdateAccountCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates an existing action connector with new configuration details, authentication settings, or enabled actions.
 * You can modify the connector's name, description, authentication configuration, and which actions are enabled. For more information,
 * https://docs.aws.amazon.com/quicksuite/latest/userguide/quick-action-auth.html.
 */
export const updateActionConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateActionConnectorRequest,
    output: UpdateActionConnectorResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a Dashboard QA configuration.
 */
export const updateDashboardsQAConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDashboardsQAConfigurationRequest,
    output: UpdateDashboardsQAConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the permissions on a dataset.
 *
 * The permissions resource is
 * `arn:aws:quicksight:region:aws-account-id:dataset/data-set-id`.
 */
export const updateDataSetPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataSetPermissionsRequest,
    output: UpdateDataSetPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the permissions to a data source.
 */
export const updateDataSourcePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataSourcePermissionsRequest,
    output: UpdateDataSourcePermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a Amazon Q Business application that is linked to a Quick Sight account.
 */
export const updateDefaultQBusinessApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDefaultQBusinessApplicationRequest,
    output: UpdateDefaultQBusinessApplicationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Adds or updates services and authorized targets to configure what the Quick Sight IAM Identity Center application can access.
 *
 * This operation is only supported for Quick Sight accounts using IAM Identity Center
 */
export const updateIdentityPropagationConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateIdentityPropagationConfigRequest,
    output: UpdateIdentityPropagationConfigResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the state of a Quick Sight Q Search configuration.
 */
export const updateQuickSightQSearchConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQuickSightQSearchConfigurationRequest,
    output: UpdateQuickSightQSearchConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates the SPICE capacity configuration for a Quick Sight account.
 */
export const updateSPICECapacityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSPICECapacityConfigurationRequest,
    output: UpdateSPICECapacityConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes reviewed answers for Q Topic.
 */
export const batchDeleteTopicReviewedAnswer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteTopicReviewedAnswerRequest,
    output: BatchDeleteTopicReviewedAnswerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a linked Amazon Q Business application from an Quick Sight account
 */
export const deleteDefaultQBusinessApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDefaultQBusinessApplicationRequest,
    output: DeleteDefaultQBusinessApplicationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Lists all action connectors in the specified Amazon Web Services account. Returns summary information for each connector including its name, type, creation time, and status.
 */
export const listActionConnectors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListActionConnectorsRequest,
    output: ListActionConnectorsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the
 * IAM policy assignments in the current Amazon Quick Sight
 * account.
 */
export const listIAMPolicyAssignments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIAMPolicyAssignmentsRequest,
    output: ListIAMPolicyAssignmentsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all of the topics within an account.
 */
export const listTopics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTopicsRequest,
  output: ListTopicsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Searches for action connectors in the specified Amazon Web Services account using filters. You can search by connector name, type, or user permissions.
 */
export const searchActionConnectors = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchActionConnectorsRequest,
    output: SearchActionConnectorsResponse,
    errors: [
      AccessDeniedException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ThrottlingException,
    ],
  }),
);
/**
 * Use the `SearchDataSets` operation to search for datasets that belong to an
 * account.
 */
export const searchDataSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchDataSetsRequest,
  output: SearchDataSetsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists data sources in current Amazon Web Services Region that belong to this Amazon Web Services account.
 */
export const listDataSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataSourcesRequest,
  output: ListDataSourcesResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of
 * the IAM policy assignments, including the Amazon
 * Resource Names
 * (ARNs),
 * for the IAM policies assigned to the specified user and
 * group,
 * or groups that the user belongs to.
 */
export const listIAMPolicyAssignmentsForUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListIAMPolicyAssignmentsForUserRequest,
    output: ListIAMPolicyAssignmentsForUserResponse,
    errors: [
      AccessDeniedException,
      ConcurrentUpdatingException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes an existing IAM policy assignment.
 */
export const deleteIAMPolicyAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIAMPolicyAssignmentRequest,
    output: DeleteIAMPolicyAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConcurrentUpdatingException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates an existing IAM policy assignment. This operation updates only
 * the optional parameter or parameters that are specified in the request. This overwrites
 * all of the users included in `Identities`.
 */
export const updateIAMPolicyAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateIAMPolicyAssignmentRequest,
    output: UpdateIAMPolicyAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConcurrentUpdatingException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all of the refresh schedules for a topic.
 */
export const listTopicRefreshSchedules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTopicRefreshSchedulesRequest,
    output: ListTopicRefreshSchedulesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates and starts a new SPICE ingestion for a dataset. You can manually refresh datasets in
 * an Enterprise edition account 32 times in a 24-hour period. You can manually refresh
 * datasets in a Standard edition account 8 times in a 24-hour period. Each 24-hour period
 * is measured starting 24 hours before the current date and time.
 *
 * Any ingestions operating on tagged datasets inherit the same tags automatically for use in
 * access control. For an example, see How do I create an IAM policy to control access to Amazon EC2 resources using
 * tags? in the Amazon Web Services Knowledge Center. Tags are visible on the tagged dataset, but not on the ingestion resource.
 */
export const createIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIngestionRequest,
  output: CreateIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a topic refresh schedule.
 */
export const deleteTopicRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTopicRefreshScheduleRequest,
    output: DeleteTopicRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a topic refresh schedule.
 */
export const describeTopicRefreshSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTopicRefreshScheduleRequest,
    output: DescribeTopicRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates a topic.
 */
export const updateTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTopicRequest,
  output: UpdateTopicResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a topic refresh schedule.
 */
export const updateTopicRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTopicRefreshScheduleRequest,
    output: UpdateTopicRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates Amazon Quick Sight customizations. Currently, you can add a custom default theme by using the
 * `CreateAccountCustomization` or `UpdateAccountCustomization`
 * API operation. To further customize Amazon Quick Sight by removing Amazon Quick Sight
 * sample assets and videos for all new users, see Customizing Quick Sight in the *Amazon Quick Sight User Guide.*
 *
 * You can create customizations for your Amazon Web Services account or, if you specify a namespace, for
 * a Quick Sight namespace instead. Customizations that apply to a namespace always override
 * customizations that apply to an Amazon Web Services account. To find out which customizations apply, use
 * the `DescribeAccountCustomization` API operation.
 *
 * Before you use the `CreateAccountCustomization` API operation to add a theme
 * as the namespace default, make sure that you first share the theme with the namespace.
 * If you don't share it with the namespace, the theme isn't visible to your users
 * even if you make it the default theme.
 * To check if the theme is shared, view the current permissions by using the
 *
 * DescribeThemePermissions
 *
 * API operation.
 * To share the theme, grant permissions by using the
 *
 * UpdateThemePermissions
 *
 * API operation.
 */
export const createAccountCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAccountCustomizationRequest,
    output: CreateAccountCustomizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a topic refresh schedule.
 */
export const createTopicRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTopicRefreshScheduleRequest,
    output: CreateTopicRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Cancels an ongoing ingestion of data into SPICE.
 */
export const cancelIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelIngestionRequest,
  output: CancelIngestionResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates an assignment with one specified IAM policy, identified by its
 * Amazon Resource Name (ARN). This policy assignment is attached to the specified groups
 * or users of Amazon Quick Sight. Assignment names are unique per Amazon Web Services
 * account. To avoid overwriting rules in other namespaces, use assignment names that are
 * unique.
 */
export const createIAMPolicyAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateIAMPolicyAssignmentRequest,
    output: CreateIAMPolicyAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConcurrentUpdatingException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the history of SPICE ingestions for a dataset. Limited to 5 TPS per user and 25 TPS per account.
 */
export const listIngestions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIngestionsRequest,
  output: ListIngestionsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a data source.
 */
export const createDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSourceRequest,
  output: CreateDataSourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    CustomerManagedKeyUnavailableException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the customizations associated with the provided Amazon Web Services account and Amazon
 * Quick Sight namespace. The Quick Sight console evaluates which
 * customizations to apply by running this API operation with the `Resolved` flag
 * included.
 *
 * To determine what customizations display when you run this command, it can help to
 * visualize the relationship of the entities involved.
 *
 * - `Amazon Web Services account` - The Amazon Web Services account exists at the top of the hierarchy.
 * It has the potential to use all of the Amazon Web Services Regions and Amazon Web Services Services. When you
 * subscribe to Quick Sight, you choose one Amazon Web Services Region to use as your home Region.
 * That's where your free SPICE capacity is located. You can use Quick Sight in any
 * supported Amazon Web Services Region.
 *
 * - `Amazon Web Services Region` - You can sign in to Quick Sight in any Amazon Web Services Region. If
 * you have a user directory, it resides in us-east-1, which is US East (N.
 * Virginia). Generally speaking, these users have access to Quick Sight in any
 * Amazon Web Services Region, unless they are constrained to a namespace.
 *
 * To run the command in a different Amazon Web Services Region, you change your Region settings.
 * If you're using the CLI, you can use one of the following options:
 *
 * - Use command line options.
 *
 * - Use named profiles.
 *
 * - Run `aws configure` to change your default Amazon Web Services Region. Use
 * Enter to key the same settings for your keys. For more information, see
 * Configuring the CLI.
 *
 * - `Namespace` - A Quick Sight namespace is a partition that contains
 * users and assets (data sources, datasets, dashboards, and so on). To access
 * assets that are in a specific namespace, users and groups must also be part of
 * the same namespace. People who share a namespace are completely isolated from
 * users and assets in other namespaces, even if they are in the same Amazon Web Services account
 * and Amazon Web Services Region.
 *
 * - `Applied customizations` - Quick Sight customizations can apply to an Amazon Web Services account or to a namespace.
 * Settings that you apply to a namespace override settings that you apply to an
 * Amazon Web Services account.
 */
export const describeAccountCustomization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountCustomizationRequest,
    output: DescribeAccountCustomizationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Updates Amazon Quick Sight customizations. Currently, the only customization that you can use is a theme.
 *
 * You can use customizations for your Amazon Web Services account or, if you specify a namespace, for a
 * Quick Sight namespace instead. Customizations that apply to a namespace override
 * customizations that apply to an Amazon Web Services account. To find out which customizations apply, use
 * the `DescribeAccountCustomization` API operation.
 */
export const updateAccountCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountCustomizationRequest,
    output: UpdateAccountCustomizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the Amazon Quick Sight settings in your Amazon Web Services account.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsRequest,
    output: UpdateAccountSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates a personalization configuration.
 */
export const updateQPersonalizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateQPersonalizationConfigurationRequest,
    output: UpdateQPersonalizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Describes the settings that were used when your Quick Sight subscription was first
 * created in this Amazon Web Services account.
 */
export const describeAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountSettingsRequest,
    output: DescribeAccountSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Use the DescribeAccountSubscription operation to receive a description of an Quick Sight account's subscription. A successful API call returns an `AccountInfo` object that includes an account's name, subscription status, authentication type, edition, and notification email address.
 */
export const describeAccountSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountSubscriptionRequest,
    output: DescribeAccountSubscriptionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a custom permissions profile.
 */
export const describeCustomPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCustomPermissionsRequest,
    output: DescribeCustomPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns information about a user, given the user name.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the identity context for a Quick Sight user in a specified namespace, allowing you to obtain identity tokens that can be used with identity-enhanced IAM role sessions to call identity-aware APIs.
 *
 * Currently, you can call the following APIs with identity-enhanced Credentials
 *
 * - StartDashboardSnapshotJob
 *
 * - DescribeDashboardSnapshotJob
 *
 * - DescribeDashboardSnapshotJobResult
 *
 * **Supported Authentication Methods**
 *
 * This API supports Quick Sight native users, IAM federated users, and Active Directory users. For Quick Sight users authenticated by Amazon Web Services Identity Center, see Identity Center documentation on identity-enhanced IAM role sessions.
 *
 * **Getting Identity-Enhanced Credentials**
 *
 * To obtain identity-enhanced credentials, follow these steps:
 *
 * - Call the GetIdentityContext API to retrieve an identity token for the specified user.
 *
 * - Use the identity token with the STS AssumeRole API to obtain identity-enhanced IAM role session credentials.
 *
 * **Usage with STS AssumeRole**
 *
 * The identity token returned by this API should be used with the STS AssumeRole API to obtain credentials for an identity-enhanced IAM role session. When calling AssumeRole, include the identity token in the `ProvidedContexts` parameter with `ProviderArn` set to `arn:aws:iam::aws:contextProvider/QuickSight` and `ContextAssertion` set to the identity token received from this API.
 *
 * The assumed role must allow the `sts:SetContext` action in addition to `sts:AssumeRole` in its trust relationship policy. The trust policy should include both actions for the principal that will be assuming the role.
 */
export const getIdentityContext = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityContextRequest,
  output: GetIdentityContextResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * (Enterprise edition only) Creates a new namespace for you to use with Amazon Quick Sight.
 *
 * A namespace allows you to isolate the Quick Sight users and groups that are registered
 * for that namespace. Users that access the namespace can share assets only with other
 * users or groups in the same namespace. They can't see users and groups in other
 * namespaces. You can create a namespace after your Amazon Web Services account is subscribed to
 * Quick Sight. The namespace must be unique within the Amazon Web Services account. By default, there is a
 * limit of 100 namespaces per Amazon Web Services account. To increase your limit, create a ticket with
 * Amazon Web Services Support.
 */
export const createNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamespaceRequest,
  output: CreateNamespaceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceExistsException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Use `CreateRoleMembership` to add an existing Quick Sight group to an existing role.
 */
export const createRoleMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRoleMembershipRequest,
    output: CreateRoleMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * This API permanently deletes all Quick Sight customizations for the specified Amazon Web Services account and namespace. When you delete account customizations:
 *
 * - All customizations are removed including themes, branding, and visual settings
 *
 * - This action cannot be undone through the API
 *
 * - Users will see default Quick Sight styling after customizations are deleted
 *
 * **Before proceeding:** Ensure you have backups of any custom themes or branding elements you may want to recreate.
 *
 * Deletes all Amazon Quick Sight customizations for the specified Amazon Web Services account and Quick Sight namespace.
 */
export const deleteAccountCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountCustomizationRequest,
    output: DeleteAccountCustomizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deleting your Quick Sight account subscription has permanent, irreversible consequences across all Amazon Web Services regions:
 *
 * - Global deletion – Running this operation from any single region will delete your Quick Sight account and all data in every Amazon Web Services region where you have Quick Sight resources.
 *
 * - Complete data loss – All dashboards, analyses, datasets, data sources, and custom visuals will be permanently deleted across all regions.
 *
 * - Embedded content failure – All embedded dashboards and visuals in your applications will immediately stop working and display errors to end users.
 *
 * - Shared resources removed – All shared dashboards, folders, and resources will become inaccessible to other users and external recipients.
 *
 * - User access terminated – All Quick Sight users in your account will lose access immediately, including authors, readers, and administrators.
 *
 * - **No recovery possible** – Once deleted, your Quick Sight account and all associated data cannot be restored.
 *
 * Consider exporting critical dashboards and data before proceeding with account deletion.
 *
 * Use the `DeleteAccountSubscription` operation to delete an Quick Sight account. This operation will result in an error message if you have configured your account termination protection settings to `True`. To change this setting and delete your account, call the `UpdateAccountSettings` API and set the value of the `TerminationProtectionEnabled` parameter to `False`, then make another call to the `DeleteAccountSubscription` API.
 */
export const deleteAccountSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountSubscriptionRequest,
    output: DeleteAccountSubscriptionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a custom permissions profile.
 */
export const deleteCustomPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomPermissionsRequest,
    output: DeleteCustomPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceExistsException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes a user group from Amazon Quick Sight.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes a user from a group so that the user is no longer a member of the group.
 */
export const deleteGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGroupMembershipRequest,
    output: DeleteGroupMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a namespace and the users and groups that are associated with the namespace.
 * This is an asynchronous process. Assets including dashboards, analyses, datasets and data sources are not
 * deleted. To delete these assets, you use the API operations for the relevant asset.
 */
export const deleteNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamespaceRequest,
  output: DeleteNamespaceResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Removes custom permissions from the role.
 */
export const deleteRoleCustomPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRoleCustomPermissionRequest,
    output: DeleteRoleCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Removes a group from a role.
 */
export const deleteRoleMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRoleMembershipRequest,
    output: DeleteRoleMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the Amazon Quick Sight user that is associated with the identity of the
 * IAM user or role that's making the call. The IAM user
 * isn't deleted as a result of this call.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a user identified by its principal ID.
 */
export const deleteUserByPrincipalId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteUserByPrincipalIdRequest,
    output: DeleteUserByPrincipalIdResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a custom permissions profile from a user.
 */
export const deleteUserCustomPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteUserCustomPermissionRequest,
    output: DeleteUserCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the refresh properties of a dataset.
 */
export const describeDataSetRefreshProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDataSetRefreshPropertiesRequest,
    output: DescribeDataSetRefreshPropertiesResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Returns an Amazon Quick Sight group's description and Amazon Resource Name (ARN).
 */
export const describeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupRequest,
  output: DescribeGroupResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Use the `DescribeGroupMembership` operation to determine if a user is a
 * member of the specified group. If the user exists and is a member of the specified
 * group, an associated `GroupMember` object is returned.
 */
export const describeGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGroupMembershipRequest,
    output: DescribeGroupMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes all custom permissions that are mapped to a role.
 */
export const describeRoleCustomPermission =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRoleCustomPermissionRequest,
    output: DescribeRoleCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns a list of all the custom permissions profiles.
 */
export const listCustomPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCustomPermissionsRequest,
    output: ListCustomPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists the Amazon Quick Sight groups that an Amazon Quick Sight user is a member of.
 */
export const listUserGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUserGroupsRequest,
  output: ListUserGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates an Amazon Quick Sight user whose identity is associated with the Identity and Access Management (IAM) identity or role specified in the request. When you register a new user from the Quick Sight API, Quick Sight generates a registration URL. The user accesses this registration URL to create their account. Quick Sight doesn't send a registration email to users who are registered from the Quick Sight API. If you want new users to receive a registration email, then add those users in the Quick Sight console. For more information on registering a new user in the Quick Sight console, see Inviting users to access Quick Sight.
 */
export const registerUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterUserRequest,
  output: RegisterUserResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceExistsException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a custom permissions profile.
 */
export const updateCustomPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCustomPermissionsRequest,
    output: UpdateCustomPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Changes a group description.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a refresh schedule for a dataset.
 */
export const updateRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRefreshScheduleRequest,
    output: UpdateRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the custom permissions that are associated with a role.
 */
export const updateRoleCustomPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRoleCustomPermissionRequest,
    output: UpdateRoleCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates an Amazon Quick Sight user.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a custom permissions profile for a user.
 */
export const updateUserCustomPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserCustomPermissionRequest,
    output: UpdateUserCustomPermissionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an Amazon Quick Sight account, or subscribes to Amazon Quick Sight Q.
 *
 * The Amazon Web Services Region for the account is derived from what is configured in the
 * CLI or SDK.
 *
 * Before you use this operation, make sure that you can connect to an existing Amazon Web Services account. If you don't have an Amazon Web Services account, see Sign
 * up for Amazon Web Services in the Amazon Quick Sight User
 * Guide. The person who signs up for Amazon Quick Sight needs to have the
 * correct Identity and Access Management (IAM) permissions. For more information,
 * see IAM Policy Examples for Amazon Quick Sight in the
 * *Amazon Quick Sight User Guide*.
 *
 * If your IAM policy includes both the `Subscribe` and
 * `CreateAccountSubscription` actions, make sure that both actions are set
 * to `Allow`. If either action is set to `Deny`, the
 * `Deny` action prevails and your API call fails.
 *
 * You can't pass an existing IAM role to access other Amazon Web Services services using this API operation. To pass your existing IAM role to
 * Amazon Quick Sight, see Passing IAM roles to Amazon Quick Sight in the
 * *Amazon Quick Sight User Guide*.
 *
 * You can't set default resource access on the new account from the Amazon Quick Sight
 * API. Instead, add default resource access from the Amazon Quick Sight console. For more
 * information about setting default resource access to Amazon Web Services services, see
 * Setting default resource
 * access to Amazon Web Services services in the Amazon Quick Sight
 * User Guide.
 */
export const createAccountSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAccountSubscriptionRequest,
    output: CreateAccountSubscriptionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceExistsException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a custom permissions profile.
 */
export const createCustomPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomPermissionsRequest,
    output: CreateCustomPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceExistsException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Use the `CreateGroup` operation to create a group in Quick Sight. You can create up to 10,000 groups in a namespace. If you want to create more than 10,000 groups in a namespace, contact Amazon Web Services Support.
 *
 * The permissions resource is
 * arn:aws:quicksight::**:group/default/**
 * .
 *
 * The response is a group object.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceExistsException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Adds an Amazon Quick Sight user to an Amazon Quick Sight group.
 */
export const createGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGroupMembershipRequest,
    output: CreateGroupMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all self-upgrade requests for a Quick Suite account.
 */
export const listSelfUpgrades = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSelfUpgradesRequest,
  output: ListSelfUpgradesResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Use the `SearchGroups` operation to search groups in a specified Quick Sight namespace using the supplied filters.
 */
export const searchGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchGroupsRequest,
  output: SearchGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists member users in a group.
 */
export const listGroupMemberships = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListGroupMembershipsRequest,
    output: ListGroupMembershipsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all user groups in Amazon Quick Sight.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the namespaces for the specified Amazon Web Services account. This operation doesn't list deleted namespaces.
 */
export const listNamespaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNamespacesRequest,
  output: ListNamespacesResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists all groups that are associated with a role.
 */
export const listRoleMemberships = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRoleMembershipsRequest,
  output: ListRoleMembershipsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of all of the Amazon Quick Sight users belonging to this account.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates a self-upgrade request for a Quick Suite user by approving, denying, or verifying the request.
 */
export const updateSelfUpgrade = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSelfUpgradeRequest,
  output: UpdateSelfUpgradeResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the self-upgrade configuration for a Quick Suite account.
 */
export const updateSelfUpgradeConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSelfUpgradeConfigurationRequest,
    output: UpdateSelfUpgradeConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ResourceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Creates a refresh schedule for a dataset. You can create up to 5 different schedules for a single dataset.
 */
export const createRefreshSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRefreshScheduleRequest,
    output: CreateRefreshScheduleResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates an Quick Suite application with a token exchange grant. This operation only supports Quick Suite applications that are registered with IAM Identity Center.
 */
export const updateApplicationWithTokenExchangeGrant =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateApplicationWithTokenExchangeGrantRequest,
    output: UpdateApplicationWithTokenExchangeGrantResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * This API permanently deletes the specified Quick Sight brand. When you delete a brand:
 *
 * - The brand and all its associated branding elements are permanently removed
 *
 * - Any applications or dashboards using this brand will revert to default styling
 *
 * - This action cannot be undone through the API
 *
 * **Before proceeding:** Verify that the brand is no longer needed and consider the impact on any applications currently using this brand.
 *
 * Deletes an Quick Sight brand.
 */
export const deleteBrand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBrandRequest,
  output: DeleteBrandResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a brand assignment.
 */
export const deleteBrandAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBrandAssignmentRequest,
    output: DeleteBrandAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a brand assignment.
 */
export const describeBrandAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBrandAssignmentRequest,
    output: DescribeBrandAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the published version of the brand.
 */
export const describeBrandPublishedVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeBrandPublishedVersionRequest,
    output: DescribeBrandPublishedVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Updates a brand.
 */
export const updateBrand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrandRequest,
  output: UpdateBrandResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates a brand assignment.
 */
export const updateBrandAssignment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBrandAssignmentRequest,
    output: UpdateBrandAssignmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Updates the published version of a brand.
 */
export const updateBrandPublishedVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBrandPublishedVersionRequest,
    output: UpdateBrandPublishedVersionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes an existing export job.
 *
 * Poll job descriptions after a job starts to know the status of the job. When a job
 * succeeds, a URL is provided to download the exported assets' data from. Download URLs
 * are valid for five minutes after they are generated. You can call the
 * `DescribeAssetBundleExportJob` API for a new download URL as needed.
 *
 * Job descriptions are available for 14 days after the job starts.
 */
export const describeAssetBundleExportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAssetBundleExportJobRequest,
    output: DescribeAssetBundleExportJobResponse,
    errors: [
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Creates or updates the dataset refresh properties for the dataset.
 */
export const putDataSetRefreshProperties = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDataSetRefreshPropertiesRequest,
    output: PutDataSetRefreshPropertiesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Starts an Asset Bundle import job.
 *
 * An Asset Bundle import job imports specified Amazon Quick Sight assets into an Amazon Quick
 * Sight account. You can also choose to import a naming prefix and specified configuration
 * overrides. The assets that are contained in the bundle file that you provide are used to
 * create or update a new or existing asset in your Amazon Quick Sight account. Each Amazon
 * Quick Sight account can run up to 5 import jobs concurrently.
 *
 * The API caller must have the necessary `"create"`, `"describe"`,
 * and `"update"` permissions in their IAM role to access each
 * resource type that is contained in the bundle file before the resources can be
 * imported.
 */
export const startAssetBundleImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAssetBundleImportJobRequest,
    output: StartAssetBundleImportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * This API controls public sharing settings for your entire Quick Sight account, affecting
 * data security and access. When you enable public sharing:
 *
 * - Dashboards can be shared publicly
 *
 * - This setting affects your entire Amazon Web Services account and all Quick Sight
 * users
 *
 * **Before proceeding:** Ensure you understand the
 * security implications and have proper IAM permissions
 * configured.
 *
 * Use the `UpdatePublicSharingSettings` operation to turn on or turn off the
 * public sharing settings of an Amazon Quick Sight dashboard.
 *
 * To use this operation, turn on session capacity pricing for your Amazon Quick Sight
 * account.
 *
 * Before you can turn on public sharing on your account, make sure to give public
 * sharing permissions to an administrative user in the Identity and Access Management (IAM) console. For more information on using IAM with Amazon
 * Quick Sight, see Using Quick Suite with IAM in the Amazon Quick Sight
 * User Guide.
 */
export const updatePublicSharingSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePublicSharingSettingsRequest,
    output: UpdatePublicSharingSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedPricingPlanException,
    ],
  }),
);
/**
 * Describes a theme.
 */
export const describeTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThemeRequest,
  output: DescribeThemeResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Provides a summary for a dashboard.
 */
export const describeDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDashboardRequest,
  output: DescribeDashboardResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes an existing snapshot job.
 *
 * Poll job descriptions after a job starts to know the status of the job. For information on available status codes, see `JobStatus`.
 *
 * **Registered user support**
 *
 * This API can be called as before to get status of a job started by the same Quick Sight user.
 *
 * **Possible error scenarios**
 *
 * Request will fail with an Access Denied error in the following scenarios:
 *
 * - The credentials have expired.
 *
 * - Job has been started by a different user.
 *
 * - Impersonated Quick Sight user doesn't have access to the specified dashboard in the job.
 */
export const describeDashboardSnapshotJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDashboardSnapshotJobRequest,
    output: DescribeDashboardSnapshotJobResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Describes a VPC connection.
 */
export const describeVPCConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVPCConnectionRequest,
    output: DescribeVPCConnectionResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Describes a folder.
 */
export const describeFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFolderRequest,
  output: DescribeFolderResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Removes an asset, such as a dashboard, analysis, or dataset, from a folder.
 */
export const deleteFolderMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFolderMembershipRequest,
    output: DeleteFolderMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Deletes a theme.
 */
export const deleteTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThemeRequest,
  output: DeleteThemeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Deletes a VPC connection.
 */
export const deleteVPCConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVPCConnectionRequest,
  output: DeleteVPCConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes the read and write permissions for a theme.
 */
export const describeThemePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeThemePermissionsRequest,
    output: DescribeThemePermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Starts an asynchronous job that runs an existing dashboard schedule and sends the dashboard snapshot through email.
 *
 * Only one job can run simultaneously in a given schedule. Repeated requests are skipped with a `202` HTTP status code.
 *
 * For more information, see Scheduling and sending Amazon Quick Sight reports by email and Configuring email report settings for a Amazon Quick Sight dashboard in the *Amazon Quick Sight User Guide*.
 */
export const startDashboardSnapshotJobSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDashboardSnapshotJobScheduleRequest,
    output: StartDashboardSnapshotJobScheduleResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Updates the permissions for an action connector by granting or revoking access for specific users and groups. You can control who can view, use, or manage the action connector.
 */
export const updateActionConnectorPermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateActionConnectorPermissionsRequest,
    output: UpdateActionConnectorPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Updates the linked analyses on a dashboard.
 */
export const updateDashboardLinks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDashboardLinksRequest,
    output: UpdateDashboardLinksResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates permissions of a folder.
 */
export const updateFolderPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFolderPermissionsRequest,
    output: UpdateFolderPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates the resource permissions for a theme. Permissions apply to the action to grant or
 * revoke permissions on, for example `"quicksight:DescribeTheme"`.
 *
 * Theme permissions apply in groupings. Valid groupings include the following for the three
 * levels of permissions, which are user, owner, or no permissions:
 *
 * - User
 *
 * - `"quicksight:DescribeTheme"`
 *
 * - `"quicksight:DescribeThemeAlias"`
 *
 * - `"quicksight:ListThemeAliases"`
 *
 * - `"quicksight:ListThemeVersions"`
 *
 * - Owner
 *
 * - `"quicksight:DescribeTheme"`
 *
 * - `"quicksight:DescribeThemeAlias"`
 *
 * - `"quicksight:ListThemeAliases"`
 *
 * - `"quicksight:ListThemeVersions"`
 *
 * - `"quicksight:DeleteTheme"`
 *
 * - `"quicksight:UpdateTheme"`
 *
 * - `"quicksight:CreateThemeAlias"`
 *
 * - `"quicksight:DeleteThemeAlias"`
 *
 * - `"quicksight:UpdateThemeAlias"`
 *
 * - `"quicksight:UpdateThemePermissions"`
 *
 * - `"quicksight:DescribeThemePermissions"`
 *
 * - To specify no permissions, omit the permissions list.
 */
export const updateThemePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateThemePermissionsRequest,
    output: UpdateThemePermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates the permissions of a topic.
 */
export const updateTopicPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTopicPermissionsRequest,
    output: UpdateTopicPermissionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates a VPC connection.
 */
export const updateVPCConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVPCConnectionRequest,
  output: UpdateVPCConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Deletes a dashboard.
 */
export const deleteDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Deletes a template.
 */
export const deleteTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Deletes the version of the theme that the specified theme alias points to.
 * If you provide a specific alias, you delete the version of the theme
 * that the alias points to.
 */
export const deleteThemeAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteThemeAliasRequest,
  output: DeleteThemeAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes read and write permissions on a template.
 */
export const describeTemplatePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTemplatePermissionsRequest,
    output: DescribeTemplatePermissionsResponse,
    errors: [
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Describes the alias for a theme.
 */
export const describeThemeAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThemeAliasRequest,
  output: DescribeThemeAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates the read and write permissions for an analysis.
 */
export const updateAnalysisPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAnalysisPermissionsRequest,
    output: UpdateAnalysisPermissionsResponse,
    errors: [
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates a dashboard in an Amazon Web Services account.
 *
 * Updating a Dashboard creates a new dashboard version but does not immediately
 * publish the new version. You can update the published version of a dashboard by
 * using the
 * UpdateDashboardPublishedVersion
 * API operation.
 */
export const updateDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates read and write permissions on a dashboard.
 */
export const updateDashboardPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDashboardPermissionsRequest,
    output: UpdateDashboardPermissionsResponse,
    errors: [
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates the published version of a dashboard.
 */
export const updateDashboardPublishedVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDashboardPublishedVersionRequest,
    output: UpdateDashboardPublishedVersionResponse,
    errors: [
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Updates the resource permissions for a template.
 */
export const updateTemplatePermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTemplatePermissionsRequest,
    output: UpdateTemplatePermissionsResponse,
    errors: [
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Describes read and write permissions for a dashboard.
 */
export const describeDashboardPermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDashboardPermissionsRequest,
    output: DescribeDashboardPermissionsResponse,
    errors: [
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Deletes an analysis from Amazon Quick Sight. You can optionally include a recovery window during
 * which you can restore the analysis. If you don't specify a recovery window value, the
 * operation defaults to 30 days. Amazon Quick Sight attaches a `DeletionTime` stamp to
 * the response that specifies the end of the recovery window. At the end of the recovery
 * window, Amazon Quick Sight deletes the analysis permanently.
 *
 * At any time before recovery window ends, you can use the `RestoreAnalysis`
 * API operation to remove the `DeletionTime` stamp and cancel the deletion of
 * the analysis. The analysis remains visible in the API until it's deleted, so you can
 * describe it but you can't make a template from it.
 *
 * An analysis that's scheduled for deletion isn't accessible in the Amazon Quick Sight console.
 * To access it in the console, restore it. Deleting an analysis doesn't delete the
 * dashboards that you publish from it.
 */
export const deleteAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnalysisRequest,
  output: DeleteAnalysisResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Provides a summary of the metadata for an analysis.
 */
export const describeAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAnalysisRequest,
  output: DescribeAnalysisResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes an existing import job.
 *
 * Poll job descriptions after starting a job to know when it has succeeded or failed. Job
 * descriptions are available for 14 days after job starts.
 */
export const describeAssetBundleImportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAssetBundleImportJobRequest,
    output: DescribeAssetBundleImportJobResponse,
    errors: [
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Deletes the item that the specified template alias points to. If you provide a specific
 * alias, you delete the version of the template that the alias points to.
 */
export const deleteTemplateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateAliasRequest,
  output: DeleteTemplateAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates the template alias of a template.
 */
export const updateTemplateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateAliasRequest,
  output: UpdateTemplateAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes the template alias for a template.
 */
export const describeTemplateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTemplateAliasRequest,
    output: DescribeTemplateAliasResponse,
    errors: [
      InternalFailureException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Provides the read and write permissions for an analysis.
 */
export const describeAnalysisPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAnalysisPermissionsRequest,
    output: DescribeAnalysisPermissionsResponse,
    errors: [
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Lists Amazon Quick Sight analyses that exist in the specified Amazon Web Services account.
 */
export const listAnalyses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAnalysesRequest,
  output: ListAnalysesResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all asset bundle export jobs that have been taken place in the last 14 days. Jobs
 * created more than 14 days ago are deleted forever and are not returned. If you are using
 * the same job ID for multiple jobs, `ListAssetBundleExportJobs` only returns the
 * most recent job that uses the repeated job ID.
 */
export const listAssetBundleExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssetBundleExportJobsRequest,
    output: ListAssetBundleExportJobsResponse,
    errors: [
      AccessDeniedException,
      InvalidNextTokenException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Lists all asset bundle import jobs that have taken place in the last 14 days. Jobs
 * created more than 14 days ago are deleted forever and are not returned. If you are using
 * the same job ID for multiple jobs, `ListAssetBundleImportJobs` only returns the
 * most recent job that uses the repeated job ID.
 */
export const listAssetBundleImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAssetBundleImportJobsRequest,
    output: ListAssetBundleImportJobsResponse,
    errors: [
      AccessDeniedException,
      InvalidNextTokenException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Lists dashboards in an Amazon Web Services account.
 */
export const listDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all the versions of the dashboards in the Amazon Quick Sight subscription.
 */
export const listDashboardVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDashboardVersionsRequest,
    output: ListDashboardVersionsResponse,
    errors: [
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * List all assets (`DASHBOARD`, `ANALYSIS`, and `DATASET`) in a folder.
 */
export const listFolderMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFolderMembersRequest,
  output: ListFolderMembersResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all folders in an account.
 */
export const listFolders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFoldersRequest,
  output: ListFoldersResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all the templates in the current Amazon Quick Sight account.
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTemplatesRequest,
  output: ListTemplatesResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all the versions of the templates in the current Amazon Quick Sight account.
 */
export const listTemplateVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTemplateVersionsRequest,
    output: ListTemplateVersionsResponse,
    errors: [
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Lists all the themes in the current Amazon Web Services account.
 */
export const listThemes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThemesRequest,
  output: ListThemesResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all the versions of the themes in the current Amazon Web Services account.
 */
export const listThemeVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThemeVersionsRequest,
  output: ListThemeVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all of the VPC connections in the current set Amazon Web Services Region of an
 * Amazon Web Services account.
 */
export const listVPCConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVPCConnectionsRequest,
  output: ListVPCConnectionsResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Searches for analyses that belong to the user specified in the filter.
 *
 * This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes.
 */
export const searchAnalyses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchAnalysesRequest,
  output: SearchAnalysesResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Searches for dashboards that belong to a user.
 *
 * This operation is eventually consistent. The results are best effort and may not
 * reflect very recent updates and changes.
 */
export const searchDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchDashboardsRequest,
  output: SearchDashboardsResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Searches for any Q topic that exists in an Quick Suite account.
 */
export const searchTopics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchTopicsRequest,
  output: SearchTopicsResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes permissions for a folder.
 */
export const describeFolderPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFolderPermissionsRequest,
    output: DescribeFolderPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Describes the folder resolved permissions. Permissions consists of both folder direct permissions and the inherited permissions from the ancestor folders.
 */
export const describeFolderResolvedPermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeFolderResolvedPermissionsRequest,
    output: DescribeFolderResolvedPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * List all folders that a resource is a member of.
 */
export const listFoldersForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFoldersForResourceRequest,
    output: ListFoldersForResourceResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Lists all the aliases of a theme.
 */
export const listThemeAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListThemeAliasesRequest,
  output: ListThemeAliasesResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Lists all the aliases of a template.
 */
export const listTemplateAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTemplateAliasesRequest,
  output: ListTemplateAliasesResponse,
  errors: [
    InternalFailureException,
    InvalidNextTokenException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Starts an Asset Bundle export job.
 *
 * An Asset Bundle export job exports specified Amazon Quick Sight assets. You can also choose to
 * export any asset dependencies in the same job. Export jobs run asynchronously and can be
 * polled with a `DescribeAssetBundleExportJob` API call. When a job is
 * successfully completed, a download URL that contains the exported assets is returned. The
 * URL is valid for 5 minutes and can be refreshed with a
 * `DescribeAssetBundleExportJob` API call. Each Amazon Quick Sight account can
 * run up to 5 export jobs concurrently.
 *
 * The API caller must have the necessary permissions in their IAM role to
 * access each resource before the resources can be exported.
 */
export const startAssetBundleExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartAssetBundleExportJobRequest,
    output: StartAssetBundleExportJobResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Updates a dataset. This operation doesn't support datasets that include uploaded files
 * as a source. Partial updates are not supported by this operation.
 */
export const updateDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSetRequest,
  output: UpdateDataSetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidDataSetParameterValueException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Describes a template's metadata.
 */
export const describeTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTemplateRequest,
  output: DescribeTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates a template alias for a template.
 */
export const createTemplateAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateAliasRequest,
  output: CreateTemplateAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Provides a detailed description of the definition of a dashboard.
 *
 * If you do not need to know details about the content of a dashboard, for instance
 * if you are trying to check the status of a recently created or updated dashboard,
 * use the
 * `DescribeDashboard`
 * instead.
 */
export const describeDashboardDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDashboardDefinitionRequest,
    output: DescribeDashboardDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Provides a detailed description of the definition of a template.
 *
 * If you do not need to know details about the content of a template, for instance if you
 * are trying to check the status of a recently created or updated template, use the
 *
 * `DescribeTemplate`
 * instead.
 */
export const describeTemplateDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTemplateDefinitionRequest,
    output: DescribeTemplateDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Creates an empty shared folder.
 */
export const createFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFolderRequest,
  output: CreateFolderResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates a new VPC connection.
 */
export const createVPCConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVPCConnectionRequest,
  output: CreateVPCConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates the name of a folder.
 */
export const updateFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFolderRequest,
  output: UpdateFolderResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates a theme.
 */
export const updateTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThemeRequest,
  output: UpdateThemeResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates an analysis in Amazon Quick Sight
 */
export const updateAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnalysisRequest,
  output: UpdateAnalysisResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates a template from an existing Amazon Quick Sight analysis or another template.
 */
export const updateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Updates an alias of a theme.
 */
export const updateThemeAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateThemeAliasRequest,
  output: UpdateThemeAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates a theme alias for a theme.
 */
export const createThemeAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThemeAliasRequest,
  output: CreateThemeAliasResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Adds an asset, such as a dashboard, analysis, or dataset into a folder.
 */
export const createFolderMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFolderMembershipRequest,
    output: CreateFolderMembershipResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Provides a detailed description of the definition of an analysis.
 *
 * If you do not need to know details about the content of an Analysis, for instance if you
 * are trying to check the status of a recently created or updated Analysis, use the
 *
 * `DescribeAnalysis`
 * instead.
 */
export const describeAnalysisDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAnalysisDefinitionRequest,
    output: DescribeAnalysisDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Creates a dashboard from either a template or directly with a
 * `DashboardDefinition`. To first create a template, see the
 * CreateTemplate
 * API operation.
 *
 * A dashboard is an entity in Amazon Quick Sight that identifies Amazon Quick Sight
 * reports, created from analyses. You can share Amazon Quick Sight dashboards. With the
 * right permissions, you can create scheduled email reports from them. If you have the
 * correct permissions, you can create a dashboard from a template that exists in a
 * different Amazon Web Services account.
 */
export const createDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Deletes an empty folder.
 */
export const deleteFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFolderRequest,
  output: DeleteFolderResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Restores an analysis.
 */
export const restoreAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreAnalysisRequest,
  output: RestoreAnalysisResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Searches the subfolders in a folder.
 */
export const searchFolders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchFoldersRequest,
  output: SearchFoldersResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidNextTokenException,
    InvalidParameterValueException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates a template either from a `TemplateDefinition` or from an existing Quick Sight analysis or template. You can use the resulting
 * template to create additional dashboards, templates, or analyses.
 *
 * A *template* is an entity in Quick Sight that encapsulates the metadata
 * required to create an analysis and that you can use to create s dashboard. A template adds
 * a layer of abstraction by using placeholders to replace the dataset associated with the
 * analysis. You can use templates to create dashboards by replacing dataset placeholders
 * with datasets that follow the same schema that was used to create the source analysis
 * and template.
 */
export const createTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates a theme.
 *
 * A *theme* is set of configuration options for color and layout.
 * Themes apply to analyses and dashboards. For more information, see Using
 * Themes in Amazon Quick Sight in the *Amazon Quick Sight User Guide*.
 */
export const createTheme = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateThemeRequest,
  output: CreateThemeResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Generates a session URL and authorization code that you can use to embed the Amazon
 * Amazon Quick Sight console in your web server code. Use
 * `GetSessionEmbedUrl` where you want to provide an authoring portal that
 * allows users to create data sources, datasets, analyses, and dashboards. The users who
 * access an embedded Amazon Quick Sight console need belong to the author or admin security
 * cohort. If you want to restrict permissions to some of these features, add a custom
 * permissions profile to the user with the
 * UpdateUser
 * API operation. Use
 * RegisterUser
 * API operation to add a new user with a custom
 * permission profile attached. For more information, see the following sections in the
 * *Amazon Quick Suite User Guide*:
 *
 * - Embedding
 * Analytics
 *
 * - Customizing Access to the Amazon Quick Suite Console
 */
export const getSessionEmbedUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionEmbedUrlRequest,
  output: GetSessionEmbedUrlResponse,
  errors: [
    AccessDeniedException,
    InternalFailureException,
    InvalidParameterValueException,
    QuickSightUserNotFoundException,
    ResourceExistsException,
    ResourceNotFoundException,
    SessionLifetimeInMinutesInvalidException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Generates a temporary session URL and authorization code(bearer token) that you can
 * use to embed an Amazon Quick Sight read-only dashboard in your website or application.
 * Before you use this command, make sure that you have configured the dashboards and
 * permissions.
 *
 * Currently, you can use `GetDashboardEmbedURL` only from the server, not
 * from the user's browser. The following rules apply to the generated URL:
 *
 * - They must be used together.
 *
 * - They can be used one time only.
 *
 * - They are valid for 5 minutes after you run this command.
 *
 * - You are charged only when the URL is used or there is interaction with Quick Suite.
 *
 * - The resulting user session is valid for 15 minutes (default) up to 10 hours
 * (maximum). You can use the optional `SessionLifetimeInMinutes`
 * parameter to customize session duration.
 *
 * For more information, see Embedding Analytics
 * Using GetDashboardEmbedUrl in the Amazon Quick Suite User
 * Guide.
 *
 * For more information about the high-level steps for embedding and for an interactive
 * demo of the ways you can customize embedding, visit the Amazon Quick Suite
 * Developer Portal.
 */
export const getDashboardEmbedUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDashboardEmbedUrlRequest,
    output: GetDashboardEmbedUrlResponse,
    errors: [
      AccessDeniedException,
      DomainNotWhitelistedException,
      IdentityTypeNotSupportedException,
      InternalFailureException,
      InvalidParameterValueException,
      QuickSightUserNotFoundException,
      ResourceExistsException,
      ResourceNotFoundException,
      SessionLifetimeInMinutesInvalidException,
      ThrottlingException,
      UnsupportedPricingPlanException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Generates an embed URL that you can use to embed an Amazon Quick Suite dashboard or
 * visual in your website, without having to register any reader users. Before you use this
 * action, make sure that you have configured the dashboards and permissions.
 *
 * The following rules apply to the generated URL:
 *
 * - It contains a temporary bearer token. It is valid for 5 minutes after it is
 * generated. Once redeemed within this period, it cannot be re-used again.
 *
 * - The URL validity period should not be confused with the actual session
 * lifetime that can be customized using the
 * SessionLifetimeInMinutes
 * parameter. The resulting user
 * session is valid for 15 minutes (minimum) to 10 hours (maximum). The default
 * session duration is 10 hours.
 *
 * - You are charged only when the URL is used or there is interaction with Amazon Quick Suite.
 *
 * For more information, see Embedded Analytics in
 * the *Amazon Quick Suite User Guide*.
 *
 * For more information about the high-level steps for embedding and for an interactive
 * demo of the ways you can customize embedding, visit the Amazon Quick Suite
 * Developer Portal.
 */
export const generateEmbedUrlForAnonymousUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateEmbedUrlForAnonymousUserRequest,
    output: GenerateEmbedUrlForAnonymousUserResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      SessionLifetimeInMinutesInvalidException,
      ThrottlingException,
      UnsupportedPricingPlanException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Starts an asynchronous job that generates a snapshot of a dashboard's output. You can request one or several of the following format configurations in each API call.
 *
 * - 1 Paginated PDF
 *
 * - 1 Excel workbook that includes up to 5 table or pivot table visuals
 *
 * - 5 CSVs from table or pivot table visuals
 *
 * The status of a submitted job can be polled with the `DescribeDashboardSnapshotJob` API. When you call the `DescribeDashboardSnapshotJob` API, check the `JobStatus` field in the response. Once the job reaches a `COMPLETED` or `FAILED` status, use the `DescribeDashboardSnapshotJobResult` API to obtain the URLs for the generated files. If the job fails, the `DescribeDashboardSnapshotJobResult` API returns detailed information about the error that occurred.
 *
 * **StartDashboardSnapshotJob API throttling**
 *
 * Quick Sight utilizes API throttling to create a more consistent user experience within a time span for customers when they call the `StartDashboardSnapshotJob`. By default, 12 jobs can run simlutaneously in one Amazon Web Services account and users can submit up 10 API requests per second before an account is throttled. If an overwhelming number of API requests are made by the same user in a short period of time, Quick Sight throttles the API calls to maintin an optimal experience and reliability for all Quick Sight users.
 *
 * **Common throttling scenarios**
 *
 * The following list provides information about the most commin throttling scenarios that can occur.
 *
 * - **A large number of `SnapshotExport` API jobs are running simultaneously on an Amazon Web Services account.** When a new `StartDashboardSnapshotJob` is created and there are already 12 jobs with the `RUNNING` status, the new job request fails and returns a `LimitExceededException` error. Wait for a current job to comlpete before you resubmit the new job.
 *
 * - **A large number of API requests are submitted on an Amazon Web Services account.** When a user makes more than 10 API calls to the Quick Sight API in one second, a `ThrottlingException` is returned.
 *
 * If your use case requires a higher throttling limit, contact your account admin or Amazon Web ServicesSupport to explore options to tailor a more optimal expereince for your account.
 *
 * **Best practices to handle throttling**
 *
 * If your use case projects high levels of API traffic, try to reduce the degree of frequency and parallelism of API calls as much as you can to avoid throttling. You can also perform a timing test to calculate an estimate for the total processing time of your projected load that stays within the throttling limits of the Quick Sight APIs. For example, if your projected traffic is 100 snapshot jobs before 12:00 PM per day, start 12 jobs in parallel and measure the amount of time it takes to proccess all 12 jobs. Once you obtain the result, multiply the duration by 9, for example `(12 minutes * 9 = 108 minutes)`. Use the new result to determine the latest time at which the jobs need to be started to meet your target deadline.
 *
 * The time that it takes to process a job can be impacted by the following factors:
 *
 * - The dataset type (Direct Query or SPICE).
 *
 * - The size of the dataset.
 *
 * - The complexity of the calculated fields that are used in the dashboard.
 *
 * - The number of visuals that are on a sheet.
 *
 * - The types of visuals that are on the sheet.
 *
 * - The number of formats and snapshots that are requested in the job configuration.
 *
 * - The size of the generated snapshots.
 *
 * **Registered user support**
 *
 * You can generate snapshots for registered Quick Sight users by using the Snapshot Job APIs with identity-enhanced IAM role session credentials. This approach allows you to create snapshots on behalf of specific Quick Sight users while respecting their row-level security (RLS), column-level security (CLS), dynamic default parameters and dashboard parameter/filter settings.
 *
 * To generate snapshots for registered Quick Sight users, you need to:
 *
 * - Obtain identity-enhanced IAM role session credentials from Amazon Web Services Security Token Service (STS).
 *
 * - Use these credentials to call the Snapshot Job APIs.
 *
 * Identity-enhanced credentials are credentials that contain information about the end user (e.g., registered Quick Sight user).
 *
 * If your Quick Sight users are backed by Amazon Web Services Identity Center, then you need to set up a trusted token issuer. Then, getting identity-enhanced IAM credentials for a Quick Sight user will look like the following:
 *
 * - Authenticate user with your OIDC compliant Identity Provider. You should get auth tokens back.
 *
 * - Use the OIDC API, CreateTokenWithIAM, to exchange auth tokens to IAM tokens. One of the resulted tokens will be identity token.
 *
 * - Call STS AssumeRole API as you normally would, but provide an extra `ProvidedContexts` parameter in the API request. The list of contexts must have a single trusted context assertion. The `ProviderArn` should be `arn:aws:iam::aws:contextProvider/IdentityCenter` while `ContextAssertion` will be the identity token you received in response from CreateTokenWithIAM
 *
 * For more details, see IdC documentation on Identity-enhanced IAM role sessions.
 *
 * To obtain Identity-enhanced credentials for Quick Sight native users, IAM federated users, or Active Directory users, follow the steps below:
 *
 * - Call Quick Sight GetIdentityContext API to get identity token.
 *
 * - Call STS AssumeRole API as you normally would, but provide extra `ProvidedContexts` parameter in the API request. The list of contexts must have a single trusted context assertion. The `ProviderArn` should be `arn:aws:iam::aws:contextProvider/QuickSight` while `ContextAssertion` will be the identity token you received in response from GetIdentityContext
 *
 * After obtaining the identity-enhanced IAM role session credentials, you can use them to start a job, describe the job and describe job result. You can use the same credentials as long as they haven't expired. All API requests made with these credentials are considered to be made by the impersonated Quick Sight user.
 *
 * When using identity-enhanced session credentials, set the UserConfiguration request attribute to null. Otherwise, the request will be invalid.
 *
 * **Possible error scenarios**
 *
 * The request fails with an Access Denied error in the following scenarios:
 *
 * - The credentials have expired.
 *
 * - The impersonated Quick Sight user doesn't have access to the specified dashboard.
 *
 * - The impersonated Quick Sight user is restricted from exporting data in the selected formats. For more information about export restrictions, see Customizing access to Amazon Quick Sight capabilities.
 */
export const startDashboardSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDashboardSnapshotJobRequest,
    output: StartDashboardSnapshotJobResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      LimitExceededException,
      ResourceExistsException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedPricingPlanException,
      UnsupportedUserEditionException,
    ],
  }),
);
/**
 * Generates an embed URL that you can use to embed an Amazon Quick Sight experience in
 * your website. This action can be used for any type of user that is registered in an
 * Amazon Quick Sight account that uses IAM Identity Center for authentication. This API
 * requires identity-enhanced IAM Role sessions for the authenticated
 * user that the API call is being made for.
 *
 * This API uses trusted identity
 * propagation to ensure that an end user is authenticated and receives the
 * embed URL that is specific to that user. The IAM Identity Center application that the
 * user has logged into needs to have trusted Identity Propagation enabled for Amazon Quick Sight with the scope
 * value set to `quicksight:read`. Before you use this action, make sure that
 * you have configured the relevant Amazon Quick Sight resource and permissions.
 */
export const generateEmbedUrlForRegisteredUserWithIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateEmbedUrlForRegisteredUserWithIdentityRequest,
    output: GenerateEmbedUrlForRegisteredUserWithIdentityResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      QuickSightUserNotFoundException,
      ResourceNotFoundException,
      SessionLifetimeInMinutesInvalidException,
      ThrottlingException,
      UnsupportedPricingPlanException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Creates new reviewed answers for a Q Topic.
 */
export const batchCreateTopicReviewedAnswer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateTopicReviewedAnswerRequest,
    output: BatchCreateTopicReviewedAnswerResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates an action connector that enables Amazon Quick Sight to connect to external services and perform actions.
 * Action connectors support various authentication methods and can be configured with specific actions from supported connector types
 * like Amazon S3, Salesforce, JIRA.
 */
export const createActionConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateActionConnectorRequest,
    output: CreateActionConnectorResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceExistsException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes a brand.
 */
export const describeBrand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBrandRequest,
  output: DescribeBrandResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the result of an existing snapshot job that has finished running.
 *
 * A finished snapshot job will return a `COMPLETED` or `FAILED` status when you poll the job with a `DescribeDashboardSnapshotJob` API call.
 *
 * If the job has not finished running, this operation returns a message that says `Dashboard Snapshot Job with id has not reached a terminal state.`.
 *
 * **Registered user support**
 *
 * This API can be called as before to get the result of a job started by the same Quick Sight user. The result for the user will be returned in `RegisteredUsers` response attribute. The attribute will contain a list with at most one object in it.
 *
 * **Possible error scenarios**
 *
 * The request fails with an Access Denied error in the following scenarios:
 *
 * - The credentials have expired.
 *
 * - The job was started by a different user.
 *
 * - The registered user doesn't have access to the specified dashboard.
 *
 * The request succeeds but the job fails in the following scenarios:
 *
 * - `DASHBOARD_ACCESS_DENIED` - The registered user lost access to the dashboard.
 *
 * - `CAPABILITY_RESTRICTED` - The registered user is restricted from exporting data in **all** selected formats.
 *
 * The request succeeds but the response contains an error code in the following scenarios:
 *
 * - `CAPABILITY_RESTRICTED` - The registered user is restricted from exporting data in **some** selected formats.
 *
 * - `RLS_CHANGED` - Row-level security settings have changed. Re-run the job with current settings.
 *
 * - `CLS_CHANGED` - Column-level security settings have changed. Re-run the job with current settings.
 *
 * - `DATASET_DELETED` - The dataset has been deleted. Verify the dataset exists before re-running the job.
 */
export const describeDashboardSnapshotJobResult =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDashboardSnapshotJobResultRequest,
    output: DescribeDashboardSnapshotJobResultResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      PreconditionNotMetException,
      ResourceNotFoundException,
      ThrottlingException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Generates an embed URL that you can use to embed an Amazon Quick Suite experience
 * in your website. This action can be used for any type of user registered in an Amazon Quick Suite account. Before you use this action, make sure that you have
 * configured the relevant Amazon Quick Suite resource and permissions.
 *
 * The following rules apply to the generated URL:
 *
 * - It contains a temporary bearer token. It is valid for 5 minutes after it is
 * generated. Once redeemed within this period, it cannot be re-used again.
 *
 * - The URL validity period should not be confused with the actual session
 * lifetime that can be customized using the
 * SessionLifetimeInMinutes
 * parameter.
 *
 * The resulting user session is valid for 15 minutes (minimum) to 10 hours
 * (maximum). The default session duration is 10 hours.
 *
 * - You are charged only when the URL is used or there is interaction with Amazon Quick Suite.
 *
 * For more information, see Embedded Analytics in
 * the *Amazon Quick Suite User Guide*.
 *
 * For more information about the high-level steps for embedding and for an interactive
 * demo of the ways you can customize embedding, visit the Amazon Quick Suite
 * Developer Portal.
 */
export const generateEmbedUrlForRegisteredUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateEmbedUrlForRegisteredUserRequest,
    output: GenerateEmbedUrlForRegisteredUserResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      QuickSightUserNotFoundException,
      ResourceNotFoundException,
      SessionLifetimeInMinutesInvalidException,
      ThrottlingException,
      UnsupportedPricingPlanException,
      UnsupportedUserEditionException,
    ],
  }));
/**
 * Creates an Quick Sight brand.
 */
export const createBrand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBrandRequest,
  output: CreateBrandResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidRequestException,
    LimitExceededException,
    ThrottlingException,
  ],
}));
/**
 * Creates a new Q topic.
 */
export const createTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTopicRequest,
  output: CreateTopicResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves detailed information about an action connector, including its configuration, authentication settings, enabled actions, and current status.
 */
export const describeActionConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeActionConnectorRequest,
    output: DescribeActionConnectorResponse,
    errors: [
      AccessDeniedException,
      InternalFailureException,
      InvalidParameterValueException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates a dataset. This operation doesn't support datasets that include uploaded files
 * as a source.
 */
export const createDataSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataSetRequest,
  output: CreateDataSetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalFailureException,
    InvalidDataSetParameterValueException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
/**
 * Creates an analysis in Amazon Quick Sight. Analyses can be created either from a template or from an `AnalysisDefinition`.
 */
export const createAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnalysisRequest,
  output: CreateAnalysisResponse,
  errors: [
    ConflictException,
    InternalFailureException,
    InvalidParameterValueException,
    LimitExceededException,
    ResourceExistsException,
    ResourceNotFoundException,
    ThrottlingException,
    UnsupportedUserEditionException,
  ],
}));
