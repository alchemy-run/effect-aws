import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "WorkMail",
  serviceShapeName: "WorkMailService",
});
const auth = T.AwsAuthSigv4({ name: "workmail" });
const ver = T.ServiceVersion("2017-10-01");
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
                        url: "https://workmail-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://workmail-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://workmail.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://workmail.{Region}.{PartitionResult#dnsSuffix}",
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
export const DeviceTypeList = S.Array(S.String);
export const DeviceModelList = S.Array(S.String);
export const DeviceOperatingSystemList = S.Array(S.String);
export const DeviceUserAgentList = S.Array(S.String);
export const IpRangeList = S.Array(S.String);
export const ActionsList = S.Array(S.String);
export const UserIdList = S.Array(S.String);
export const ImpersonationRoleIdList = S.Array(S.String);
export const PermissionValues = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateDelegateToResourceRequest extends S.Class<AssociateDelegateToResourceRequest>(
  "AssociateDelegateToResourceRequest",
)(
  { OrganizationId: S.String, ResourceId: S.String, EntityId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDelegateToResourceResponse extends S.Class<AssociateDelegateToResourceResponse>(
  "AssociateDelegateToResourceResponse",
)({}) {}
export class AssociateMemberToGroupRequest extends S.Class<AssociateMemberToGroupRequest>(
  "AssociateMemberToGroupRequest",
)(
  { OrganizationId: S.String, GroupId: S.String, MemberId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateMemberToGroupResponse extends S.Class<AssociateMemberToGroupResponse>(
  "AssociateMemberToGroupResponse",
)({}) {}
export class AssumeImpersonationRoleRequest extends S.Class<AssumeImpersonationRoleRequest>(
  "AssumeImpersonationRoleRequest",
)(
  { OrganizationId: S.String, ImpersonationRoleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMailboxExportJobRequest extends S.Class<CancelMailboxExportJobRequest>(
  "CancelMailboxExportJobRequest",
)(
  { ClientToken: S.String, JobId: S.String, OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMailboxExportJobResponse extends S.Class<CancelMailboxExportJobResponse>(
  "CancelMailboxExportJobResponse",
)({}) {}
export class CreateAliasRequest extends S.Class<CreateAliasRequest>(
  "CreateAliasRequest",
)(
  { OrganizationId: S.String, EntityId: S.String, Alias: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAliasResponse extends S.Class<CreateAliasResponse>(
  "CreateAliasResponse",
)({}) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    OrganizationId: S.String,
    Name: S.String,
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIdentityCenterApplicationRequest extends S.Class<CreateIdentityCenterApplicationRequest>(
  "CreateIdentityCenterApplicationRequest",
)(
  { Name: S.String, InstanceArn: S.String, ClientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMobileDeviceAccessRuleRequest extends S.Class<CreateMobileDeviceAccessRuleRequest>(
  "CreateMobileDeviceAccessRuleRequest",
)(
  {
    OrganizationId: S.String,
    ClientToken: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    Effect: S.String,
    DeviceTypes: S.optional(DeviceTypeList),
    NotDeviceTypes: S.optional(DeviceTypeList),
    DeviceModels: S.optional(DeviceModelList),
    NotDeviceModels: S.optional(DeviceModelList),
    DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    DeviceUserAgents: S.optional(DeviceUserAgentList),
    NotDeviceUserAgents: S.optional(DeviceUserAgentList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResourceRequest extends S.Class<CreateResourceRequest>(
  "CreateResourceRequest",
)(
  {
    OrganizationId: S.String,
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    OrganizationId: S.String,
    Name: S.String,
    DisplayName: S.String,
    Password: S.optional(S.String),
    Role: S.optional(S.String),
    FirstName: S.optional(S.String),
    LastName: S.optional(S.String),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
    IdentityProviderUserId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessControlRuleRequest extends S.Class<DeleteAccessControlRuleRequest>(
  "DeleteAccessControlRuleRequest",
)(
  { OrganizationId: S.String, Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessControlRuleResponse extends S.Class<DeleteAccessControlRuleResponse>(
  "DeleteAccessControlRuleResponse",
)({}) {}
export class DeleteAliasRequest extends S.Class<DeleteAliasRequest>(
  "DeleteAliasRequest",
)(
  { OrganizationId: S.String, EntityId: S.String, Alias: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAliasResponse extends S.Class<DeleteAliasResponse>(
  "DeleteAliasResponse",
)({}) {}
export class DeleteAvailabilityConfigurationRequest extends S.Class<DeleteAvailabilityConfigurationRequest>(
  "DeleteAvailabilityConfigurationRequest",
)(
  { OrganizationId: S.String, DomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAvailabilityConfigurationResponse extends S.Class<DeleteAvailabilityConfigurationResponse>(
  "DeleteAvailabilityConfigurationResponse",
)({}) {}
export class DeleteEmailMonitoringConfigurationRequest extends S.Class<DeleteEmailMonitoringConfigurationRequest>(
  "DeleteEmailMonitoringConfigurationRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEmailMonitoringConfigurationResponse extends S.Class<DeleteEmailMonitoringConfigurationResponse>(
  "DeleteEmailMonitoringConfigurationResponse",
)({}) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { OrganizationId: S.String, GroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({}) {}
export class DeleteIdentityCenterApplicationRequest extends S.Class<DeleteIdentityCenterApplicationRequest>(
  "DeleteIdentityCenterApplicationRequest",
)(
  { ApplicationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityCenterApplicationResponse extends S.Class<DeleteIdentityCenterApplicationResponse>(
  "DeleteIdentityCenterApplicationResponse",
)({}) {}
export class DeleteIdentityProviderConfigurationRequest extends S.Class<DeleteIdentityProviderConfigurationRequest>(
  "DeleteIdentityProviderConfigurationRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityProviderConfigurationResponse extends S.Class<DeleteIdentityProviderConfigurationResponse>(
  "DeleteIdentityProviderConfigurationResponse",
)({}) {}
export class DeleteImpersonationRoleRequest extends S.Class<DeleteImpersonationRoleRequest>(
  "DeleteImpersonationRoleRequest",
)(
  { OrganizationId: S.String, ImpersonationRoleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteImpersonationRoleResponse extends S.Class<DeleteImpersonationRoleResponse>(
  "DeleteImpersonationRoleResponse",
)({}) {}
export class DeleteMailboxPermissionsRequest extends S.Class<DeleteMailboxPermissionsRequest>(
  "DeleteMailboxPermissionsRequest",
)(
  { OrganizationId: S.String, EntityId: S.String, GranteeId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMailboxPermissionsResponse extends S.Class<DeleteMailboxPermissionsResponse>(
  "DeleteMailboxPermissionsResponse",
)({}) {}
export class DeleteMobileDeviceAccessOverrideRequest extends S.Class<DeleteMobileDeviceAccessOverrideRequest>(
  "DeleteMobileDeviceAccessOverrideRequest",
)(
  { OrganizationId: S.String, UserId: S.String, DeviceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMobileDeviceAccessOverrideResponse extends S.Class<DeleteMobileDeviceAccessOverrideResponse>(
  "DeleteMobileDeviceAccessOverrideResponse",
)({}) {}
export class DeleteMobileDeviceAccessRuleRequest extends S.Class<DeleteMobileDeviceAccessRuleRequest>(
  "DeleteMobileDeviceAccessRuleRequest",
)(
  { OrganizationId: S.String, MobileDeviceAccessRuleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMobileDeviceAccessRuleResponse extends S.Class<DeleteMobileDeviceAccessRuleResponse>(
  "DeleteMobileDeviceAccessRuleResponse",
)({}) {}
export class DeleteOrganizationRequest extends S.Class<DeleteOrganizationRequest>(
  "DeleteOrganizationRequest",
)(
  {
    ClientToken: S.optional(S.String),
    OrganizationId: S.String,
    DeleteDirectory: S.Boolean,
    ForceDelete: S.optional(S.Boolean),
    DeleteIdentityCenterApplication: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePersonalAccessTokenRequest extends S.Class<DeletePersonalAccessTokenRequest>(
  "DeletePersonalAccessTokenRequest",
)(
  { OrganizationId: S.String, PersonalAccessTokenId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePersonalAccessTokenResponse extends S.Class<DeletePersonalAccessTokenResponse>(
  "DeletePersonalAccessTokenResponse",
)({}) {}
export class DeleteResourceRequest extends S.Class<DeleteResourceRequest>(
  "DeleteResourceRequest",
)(
  { OrganizationId: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourceResponse extends S.Class<DeleteResourceResponse>(
  "DeleteResourceResponse",
)({}) {}
export class DeleteRetentionPolicyRequest extends S.Class<DeleteRetentionPolicyRequest>(
  "DeleteRetentionPolicyRequest",
)(
  { OrganizationId: S.String, Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRetentionPolicyResponse extends S.Class<DeleteRetentionPolicyResponse>(
  "DeleteRetentionPolicyResponse",
)({}) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  { OrganizationId: S.String, UserId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class DeregisterFromWorkMailRequest extends S.Class<DeregisterFromWorkMailRequest>(
  "DeregisterFromWorkMailRequest",
)(
  { OrganizationId: S.String, EntityId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterFromWorkMailResponse extends S.Class<DeregisterFromWorkMailResponse>(
  "DeregisterFromWorkMailResponse",
)({}) {}
export class DeregisterMailDomainRequest extends S.Class<DeregisterMailDomainRequest>(
  "DeregisterMailDomainRequest",
)(
  { OrganizationId: S.String, DomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterMailDomainResponse extends S.Class<DeregisterMailDomainResponse>(
  "DeregisterMailDomainResponse",
)({}) {}
export class DescribeEmailMonitoringConfigurationRequest extends S.Class<DescribeEmailMonitoringConfigurationRequest>(
  "DescribeEmailMonitoringConfigurationRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntityRequest extends S.Class<DescribeEntityRequest>(
  "DescribeEntityRequest",
)(
  { OrganizationId: S.String, Email: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGroupRequest extends S.Class<DescribeGroupRequest>(
  "DescribeGroupRequest",
)(
  { OrganizationId: S.String, GroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeIdentityProviderConfigurationRequest extends S.Class<DescribeIdentityProviderConfigurationRequest>(
  "DescribeIdentityProviderConfigurationRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInboundDmarcSettingsRequest extends S.Class<DescribeInboundDmarcSettingsRequest>(
  "DescribeInboundDmarcSettingsRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMailboxExportJobRequest extends S.Class<DescribeMailboxExportJobRequest>(
  "DescribeMailboxExportJobRequest",
)(
  { JobId: S.String, OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationRequest extends S.Class<DescribeOrganizationRequest>(
  "DescribeOrganizationRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResourceRequest extends S.Class<DescribeResourceRequest>(
  "DescribeResourceRequest",
)(
  { OrganizationId: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  { OrganizationId: S.String, UserId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDelegateFromResourceRequest extends S.Class<DisassociateDelegateFromResourceRequest>(
  "DisassociateDelegateFromResourceRequest",
)(
  { OrganizationId: S.String, ResourceId: S.String, EntityId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDelegateFromResourceResponse extends S.Class<DisassociateDelegateFromResourceResponse>(
  "DisassociateDelegateFromResourceResponse",
)({}) {}
export class DisassociateMemberFromGroupRequest extends S.Class<DisassociateMemberFromGroupRequest>(
  "DisassociateMemberFromGroupRequest",
)(
  { OrganizationId: S.String, GroupId: S.String, MemberId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateMemberFromGroupResponse extends S.Class<DisassociateMemberFromGroupResponse>(
  "DisassociateMemberFromGroupResponse",
)({}) {}
export class GetAccessControlEffectRequest extends S.Class<GetAccessControlEffectRequest>(
  "GetAccessControlEffectRequest",
)(
  {
    OrganizationId: S.String,
    IpAddress: S.String,
    Action: S.String,
    UserId: S.optional(S.String),
    ImpersonationRoleId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDefaultRetentionPolicyRequest extends S.Class<GetDefaultRetentionPolicyRequest>(
  "GetDefaultRetentionPolicyRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetImpersonationRoleRequest extends S.Class<GetImpersonationRoleRequest>(
  "GetImpersonationRoleRequest",
)(
  { OrganizationId: S.String, ImpersonationRoleId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetImpersonationRoleEffectRequest extends S.Class<GetImpersonationRoleEffectRequest>(
  "GetImpersonationRoleEffectRequest",
)(
  {
    OrganizationId: S.String,
    ImpersonationRoleId: S.String,
    TargetUser: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMailboxDetailsRequest extends S.Class<GetMailboxDetailsRequest>(
  "GetMailboxDetailsRequest",
)(
  { OrganizationId: S.String, UserId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMailDomainRequest extends S.Class<GetMailDomainRequest>(
  "GetMailDomainRequest",
)(
  { OrganizationId: S.String, DomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMobileDeviceAccessEffectRequest extends S.Class<GetMobileDeviceAccessEffectRequest>(
  "GetMobileDeviceAccessEffectRequest",
)(
  {
    OrganizationId: S.String,
    DeviceType: S.optional(S.String),
    DeviceModel: S.optional(S.String),
    DeviceOperatingSystem: S.optional(S.String),
    DeviceUserAgent: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMobileDeviceAccessOverrideRequest extends S.Class<GetMobileDeviceAccessOverrideRequest>(
  "GetMobileDeviceAccessOverrideRequest",
)(
  { OrganizationId: S.String, UserId: S.String, DeviceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPersonalAccessTokenMetadataRequest extends S.Class<GetPersonalAccessTokenMetadataRequest>(
  "GetPersonalAccessTokenMetadataRequest",
)(
  { OrganizationId: S.String, PersonalAccessTokenId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccessControlRulesRequest extends S.Class<ListAccessControlRulesRequest>(
  "ListAccessControlRulesRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAliasesRequest extends S.Class<ListAliasesRequest>(
  "ListAliasesRequest",
)(
  {
    OrganizationId: S.String,
    EntityId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailabilityConfigurationsRequest extends S.Class<ListAvailabilityConfigurationsRequest>(
  "ListAvailabilityConfigurationsRequest",
)(
  {
    OrganizationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupMembersRequest extends S.Class<ListGroupMembersRequest>(
  "ListGroupMembersRequest",
)(
  {
    OrganizationId: S.String,
    GroupId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImpersonationRolesRequest extends S.Class<ListImpersonationRolesRequest>(
  "ListImpersonationRolesRequest",
)(
  {
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMailboxExportJobsRequest extends S.Class<ListMailboxExportJobsRequest>(
  "ListMailboxExportJobsRequest",
)(
  {
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMailboxPermissionsRequest extends S.Class<ListMailboxPermissionsRequest>(
  "ListMailboxPermissionsRequest",
)(
  {
    OrganizationId: S.String,
    EntityId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMailDomainsRequest extends S.Class<ListMailDomainsRequest>(
  "ListMailDomainsRequest",
)(
  {
    OrganizationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMobileDeviceAccessOverridesRequest extends S.Class<ListMobileDeviceAccessOverridesRequest>(
  "ListMobileDeviceAccessOverridesRequest",
)(
  {
    OrganizationId: S.String,
    UserId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMobileDeviceAccessRulesRequest extends S.Class<ListMobileDeviceAccessRulesRequest>(
  "ListMobileDeviceAccessRulesRequest",
)(
  { OrganizationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOrganizationsRequest extends S.Class<ListOrganizationsRequest>(
  "ListOrganizationsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPersonalAccessTokensRequest extends S.Class<ListPersonalAccessTokensRequest>(
  "ListPersonalAccessTokensRequest",
)(
  {
    OrganizationId: S.String,
    UserId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceDelegatesRequest extends S.Class<ListResourceDelegatesRequest>(
  "ListResourceDelegatesRequest",
)(
  {
    OrganizationId: S.String,
    ResourceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccessControlRuleRequest extends S.Class<PutAccessControlRuleRequest>(
  "PutAccessControlRuleRequest",
)(
  {
    Name: S.String,
    Effect: S.String,
    Description: S.String,
    IpRanges: S.optional(IpRangeList),
    NotIpRanges: S.optional(IpRangeList),
    Actions: S.optional(ActionsList),
    NotActions: S.optional(ActionsList),
    UserIds: S.optional(UserIdList),
    NotUserIds: S.optional(UserIdList),
    OrganizationId: S.String,
    ImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
    NotImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccessControlRuleResponse extends S.Class<PutAccessControlRuleResponse>(
  "PutAccessControlRuleResponse",
)({}) {}
export class PutEmailMonitoringConfigurationRequest extends S.Class<PutEmailMonitoringConfigurationRequest>(
  "PutEmailMonitoringConfigurationRequest",
)(
  {
    OrganizationId: S.String,
    RoleArn: S.optional(S.String),
    LogGroupArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEmailMonitoringConfigurationResponse extends S.Class<PutEmailMonitoringConfigurationResponse>(
  "PutEmailMonitoringConfigurationResponse",
)({}) {}
export class PutInboundDmarcSettingsRequest extends S.Class<PutInboundDmarcSettingsRequest>(
  "PutInboundDmarcSettingsRequest",
)(
  { OrganizationId: S.String, Enforced: S.Boolean },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutInboundDmarcSettingsResponse extends S.Class<PutInboundDmarcSettingsResponse>(
  "PutInboundDmarcSettingsResponse",
)({}) {}
export class PutMailboxPermissionsRequest extends S.Class<PutMailboxPermissionsRequest>(
  "PutMailboxPermissionsRequest",
)(
  {
    OrganizationId: S.String,
    EntityId: S.String,
    GranteeId: S.String,
    PermissionValues: PermissionValues,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMailboxPermissionsResponse extends S.Class<PutMailboxPermissionsResponse>(
  "PutMailboxPermissionsResponse",
)({}) {}
export class PutMobileDeviceAccessOverrideRequest extends S.Class<PutMobileDeviceAccessOverrideRequest>(
  "PutMobileDeviceAccessOverrideRequest",
)(
  {
    OrganizationId: S.String,
    UserId: S.String,
    DeviceId: S.String,
    Effect: S.String,
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMobileDeviceAccessOverrideResponse extends S.Class<PutMobileDeviceAccessOverrideResponse>(
  "PutMobileDeviceAccessOverrideResponse",
)({}) {}
export class RegisterMailDomainRequest extends S.Class<RegisterMailDomainRequest>(
  "RegisterMailDomainRequest",
)(
  {
    ClientToken: S.optional(S.String),
    OrganizationId: S.String,
    DomainName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterMailDomainResponse extends S.Class<RegisterMailDomainResponse>(
  "RegisterMailDomainResponse",
)({}) {}
export class RegisterToWorkMailRequest extends S.Class<RegisterToWorkMailRequest>(
  "RegisterToWorkMailRequest",
)(
  { OrganizationId: S.String, EntityId: S.String, Email: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterToWorkMailResponse extends S.Class<RegisterToWorkMailResponse>(
  "RegisterToWorkMailResponse",
)({}) {}
export class ResetPasswordRequest extends S.Class<ResetPasswordRequest>(
  "ResetPasswordRequest",
)(
  { OrganizationId: S.String, UserId: S.String, Password: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResetPasswordResponse extends S.Class<ResetPasswordResponse>(
  "ResetPasswordResponse",
)({}) {}
export class StartMailboxExportJobRequest extends S.Class<StartMailboxExportJobRequest>(
  "StartMailboxExportJobRequest",
)(
  {
    ClientToken: S.String,
    OrganizationId: S.String,
    EntityId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    KmsKeyArn: S.String,
    S3BucketName: S.String,
    S3Prefix: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EwsAvailabilityProvider extends S.Class<EwsAvailabilityProvider>(
  "EwsAvailabilityProvider",
)({ EwsEndpoint: S.String, EwsUsername: S.String, EwsPassword: S.String }) {}
export class LambdaAvailabilityProvider extends S.Class<LambdaAvailabilityProvider>(
  "LambdaAvailabilityProvider",
)({ LambdaArn: S.String }) {}
export class TestAvailabilityConfigurationRequest extends S.Class<TestAvailabilityConfigurationRequest>(
  "TestAvailabilityConfigurationRequest",
)(
  {
    OrganizationId: S.String,
    DomainName: S.optional(S.String),
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateAvailabilityConfigurationRequest extends S.Class<UpdateAvailabilityConfigurationRequest>(
  "UpdateAvailabilityConfigurationRequest",
)(
  {
    OrganizationId: S.String,
    DomainName: S.String,
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAvailabilityConfigurationResponse extends S.Class<UpdateAvailabilityConfigurationResponse>(
  "UpdateAvailabilityConfigurationResponse",
)({}) {}
export class UpdateDefaultMailDomainRequest extends S.Class<UpdateDefaultMailDomainRequest>(
  "UpdateDefaultMailDomainRequest",
)(
  { OrganizationId: S.String, DomainName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDefaultMailDomainResponse extends S.Class<UpdateDefaultMailDomainResponse>(
  "UpdateDefaultMailDomainResponse",
)({}) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    OrganizationId: S.String,
    GroupId: S.String,
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGroupResponse extends S.Class<UpdateGroupResponse>(
  "UpdateGroupResponse",
)({}) {}
export const TargetUsers = S.Array(S.String);
export class ImpersonationRule extends S.Class<ImpersonationRule>(
  "ImpersonationRule",
)({
  ImpersonationRuleId: S.String,
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Effect: S.String,
  TargetUsers: S.optional(TargetUsers),
  NotTargetUsers: S.optional(TargetUsers),
}) {}
export const ImpersonationRuleList = S.Array(ImpersonationRule);
export class UpdateImpersonationRoleRequest extends S.Class<UpdateImpersonationRoleRequest>(
  "UpdateImpersonationRoleRequest",
)(
  {
    OrganizationId: S.String,
    ImpersonationRoleId: S.String,
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    Rules: ImpersonationRuleList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateImpersonationRoleResponse extends S.Class<UpdateImpersonationRoleResponse>(
  "UpdateImpersonationRoleResponse",
)({}) {}
export class UpdateMailboxQuotaRequest extends S.Class<UpdateMailboxQuotaRequest>(
  "UpdateMailboxQuotaRequest",
)(
  { OrganizationId: S.String, UserId: S.String, MailboxQuota: S.Number },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMailboxQuotaResponse extends S.Class<UpdateMailboxQuotaResponse>(
  "UpdateMailboxQuotaResponse",
)({}) {}
export class UpdateMobileDeviceAccessRuleRequest extends S.Class<UpdateMobileDeviceAccessRuleRequest>(
  "UpdateMobileDeviceAccessRuleRequest",
)(
  {
    OrganizationId: S.String,
    MobileDeviceAccessRuleId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    Effect: S.String,
    DeviceTypes: S.optional(DeviceTypeList),
    NotDeviceTypes: S.optional(DeviceTypeList),
    DeviceModels: S.optional(DeviceModelList),
    NotDeviceModels: S.optional(DeviceModelList),
    DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    DeviceUserAgents: S.optional(DeviceUserAgentList),
    NotDeviceUserAgents: S.optional(DeviceUserAgentList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMobileDeviceAccessRuleResponse extends S.Class<UpdateMobileDeviceAccessRuleResponse>(
  "UpdateMobileDeviceAccessRuleResponse",
)({}) {}
export class UpdatePrimaryEmailAddressRequest extends S.Class<UpdatePrimaryEmailAddressRequest>(
  "UpdatePrimaryEmailAddressRequest",
)(
  { OrganizationId: S.String, EntityId: S.String, Email: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePrimaryEmailAddressResponse extends S.Class<UpdatePrimaryEmailAddressResponse>(
  "UpdatePrimaryEmailAddressResponse",
)({}) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    OrganizationId: S.String,
    UserId: S.String,
    Role: S.optional(S.String),
    DisplayName: S.optional(S.String),
    FirstName: S.optional(S.String),
    LastName: S.optional(S.String),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
    Initials: S.optional(S.String),
    Telephone: S.optional(S.String),
    Street: S.optional(S.String),
    JobTitle: S.optional(S.String),
    City: S.optional(S.String),
    Company: S.optional(S.String),
    ZipCode: S.optional(S.String),
    Department: S.optional(S.String),
    Country: S.optional(S.String),
    Office: S.optional(S.String),
    IdentityProviderUserId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({}) {}
export class Domain extends S.Class<Domain>("Domain")({
  DomainName: S.String,
  HostedZoneId: S.optional(S.String),
}) {}
export const Domains = S.Array(Domain);
export const AccessControlRuleNameList = S.Array(S.String);
export const PersonalAccessTokenScopeList = S.Array(S.String);
export const Aliases = S.Array(S.String);
export class ListGroupsFilters extends S.Class<ListGroupsFilters>(
  "ListGroupsFilters",
)({
  NamePrefix: S.optional(S.String),
  PrimaryEmailPrefix: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class ListGroupsForEntityFilters extends S.Class<ListGroupsForEntityFilters>(
  "ListGroupsForEntityFilters",
)({ GroupNamePrefix: S.optional(S.String) }) {}
export class ListResourcesFilters extends S.Class<ListResourcesFilters>(
  "ListResourcesFilters",
)({
  NamePrefix: S.optional(S.String),
  PrimaryEmailPrefix: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class ListUsersFilters extends S.Class<ListUsersFilters>(
  "ListUsersFilters",
)({
  UsernamePrefix: S.optional(S.String),
  DisplayNamePrefix: S.optional(S.String),
  PrimaryEmailPrefix: S.optional(S.String),
  State: S.optional(S.String),
  IdentityProviderUserIdPrefix: S.optional(S.String),
}) {}
export class IdentityCenterConfiguration extends S.Class<IdentityCenterConfiguration>(
  "IdentityCenterConfiguration",
)({ InstanceArn: S.String, ApplicationArn: S.String }) {}
export class PersonalAccessTokenConfiguration extends S.Class<PersonalAccessTokenConfiguration>(
  "PersonalAccessTokenConfiguration",
)({ Status: S.String, LifetimeInDays: S.optional(S.Number) }) {}
export class FolderConfiguration extends S.Class<FolderConfiguration>(
  "FolderConfiguration",
)({ Name: S.String, Action: S.String, Period: S.optional(S.Number) }) {}
export const FolderConfigurations = S.Array(FolderConfiguration);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class BookingOptions extends S.Class<BookingOptions>("BookingOptions")({
  AutoAcceptRequests: S.optional(S.Boolean),
  AutoDeclineRecurringRequests: S.optional(S.Boolean),
  AutoDeclineConflictingRequests: S.optional(S.Boolean),
}) {}
export class AssumeImpersonationRoleResponse extends S.Class<AssumeImpersonationRoleResponse>(
  "AssumeImpersonationRoleResponse",
)({ Token: S.optional(S.String), ExpiresIn: S.optional(S.Number) }) {}
export class CreateAvailabilityConfigurationRequest extends S.Class<CreateAvailabilityConfigurationRequest>(
  "CreateAvailabilityConfigurationRequest",
)(
  {
    ClientToken: S.optional(S.String),
    OrganizationId: S.String,
    DomainName: S.String,
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAvailabilityConfigurationResponse extends S.Class<CreateAvailabilityConfigurationResponse>(
  "CreateAvailabilityConfigurationResponse",
)({}) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({ GroupId: S.optional(S.String) }) {}
export class CreateIdentityCenterApplicationResponse extends S.Class<CreateIdentityCenterApplicationResponse>(
  "CreateIdentityCenterApplicationResponse",
)({ ApplicationArn: S.optional(S.String) }) {}
export class CreateImpersonationRoleRequest extends S.Class<CreateImpersonationRoleRequest>(
  "CreateImpersonationRoleRequest",
)(
  {
    ClientToken: S.optional(S.String),
    OrganizationId: S.String,
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    Rules: ImpersonationRuleList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMobileDeviceAccessRuleResponse extends S.Class<CreateMobileDeviceAccessRuleResponse>(
  "CreateMobileDeviceAccessRuleResponse",
)({ MobileDeviceAccessRuleId: S.optional(S.String) }) {}
export class CreateOrganizationRequest extends S.Class<CreateOrganizationRequest>(
  "CreateOrganizationRequest",
)(
  {
    DirectoryId: S.optional(S.String),
    Alias: S.String,
    ClientToken: S.optional(S.String),
    Domains: S.optional(Domains),
    KmsKeyArn: S.optional(S.String),
    EnableInteroperability: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResourceResponse extends S.Class<CreateResourceResponse>(
  "CreateResourceResponse",
)({ ResourceId: S.optional(S.String) }) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ UserId: S.optional(S.String) }) {}
export class DeleteOrganizationResponse extends S.Class<DeleteOrganizationResponse>(
  "DeleteOrganizationResponse",
)({ OrganizationId: S.optional(S.String), State: S.optional(S.String) }) {}
export class DescribeEmailMonitoringConfigurationResponse extends S.Class<DescribeEmailMonitoringConfigurationResponse>(
  "DescribeEmailMonitoringConfigurationResponse",
)({ RoleArn: S.optional(S.String), LogGroupArn: S.optional(S.String) }) {}
export class DescribeEntityResponse extends S.Class<DescribeEntityResponse>(
  "DescribeEntityResponse",
)({
  EntityId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class DescribeGroupResponse extends S.Class<DescribeGroupResponse>(
  "DescribeGroupResponse",
)({
  GroupId: S.optional(S.String),
  Name: S.optional(S.String),
  Email: S.optional(S.String),
  State: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HiddenFromGlobalAddressList: S.optional(S.Boolean),
}) {}
export class DescribeIdentityProviderConfigurationResponse extends S.Class<DescribeIdentityProviderConfigurationResponse>(
  "DescribeIdentityProviderConfigurationResponse",
)({
  AuthenticationMode: S.optional(S.String),
  IdentityCenterConfiguration: S.optional(IdentityCenterConfiguration),
  PersonalAccessTokenConfiguration: S.optional(
    PersonalAccessTokenConfiguration,
  ),
}) {}
export class DescribeInboundDmarcSettingsResponse extends S.Class<DescribeInboundDmarcSettingsResponse>(
  "DescribeInboundDmarcSettingsResponse",
)({ Enforced: S.optional(S.Boolean) }) {}
export class DescribeMailboxExportJobResponse extends S.Class<DescribeMailboxExportJobResponse>(
  "DescribeMailboxExportJobResponse",
)({
  EntityId: S.optional(S.String),
  Description: S.optional(S.String),
  RoleArn: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3Prefix: S.optional(S.String),
  S3Path: S.optional(S.String),
  EstimatedProgress: S.optional(S.Number),
  State: S.optional(S.String),
  ErrorInfo: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeOrganizationResponse extends S.Class<DescribeOrganizationResponse>(
  "DescribeOrganizationResponse",
)({
  OrganizationId: S.optional(S.String),
  Alias: S.optional(S.String),
  State: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  DirectoryType: S.optional(S.String),
  DefaultMailDomain: S.optional(S.String),
  CompletedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ErrorMessage: S.optional(S.String),
  ARN: S.optional(S.String),
  MigrationAdmin: S.optional(S.String),
  InteroperabilityEnabled: S.optional(S.Boolean),
}) {}
export class DescribeResourceResponse extends S.Class<DescribeResourceResponse>(
  "DescribeResourceResponse",
)({
  ResourceId: S.optional(S.String),
  Email: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  BookingOptions: S.optional(BookingOptions),
  State: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  HiddenFromGlobalAddressList: S.optional(S.Boolean),
}) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({
  UserId: S.optional(S.String),
  Name: S.optional(S.String),
  Email: S.optional(S.String),
  DisplayName: S.optional(S.String),
  State: S.optional(S.String),
  UserRole: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MailboxProvisionedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  MailboxDeprovisionedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  HiddenFromGlobalAddressList: S.optional(S.Boolean),
  Initials: S.optional(S.String),
  Telephone: S.optional(S.String),
  Street: S.optional(S.String),
  JobTitle: S.optional(S.String),
  City: S.optional(S.String),
  Company: S.optional(S.String),
  ZipCode: S.optional(S.String),
  Department: S.optional(S.String),
  Country: S.optional(S.String),
  Office: S.optional(S.String),
  IdentityProviderUserId: S.optional(S.String),
  IdentityProviderIdentityStoreId: S.optional(S.String),
}) {}
export class GetAccessControlEffectResponse extends S.Class<GetAccessControlEffectResponse>(
  "GetAccessControlEffectResponse",
)({
  Effect: S.optional(S.String),
  MatchedRules: S.optional(AccessControlRuleNameList),
}) {}
export class GetDefaultRetentionPolicyResponse extends S.Class<GetDefaultRetentionPolicyResponse>(
  "GetDefaultRetentionPolicyResponse",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  FolderConfigurations: S.optional(FolderConfigurations),
}) {}
export class GetImpersonationRoleResponse extends S.Class<GetImpersonationRoleResponse>(
  "GetImpersonationRoleResponse",
)({
  ImpersonationRoleId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Rules: S.optional(ImpersonationRuleList),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetMailboxDetailsResponse extends S.Class<GetMailboxDetailsResponse>(
  "GetMailboxDetailsResponse",
)({ MailboxQuota: S.optional(S.Number), MailboxSize: S.optional(S.Number) }) {}
export class GetMobileDeviceAccessOverrideResponse extends S.Class<GetMobileDeviceAccessOverrideResponse>(
  "GetMobileDeviceAccessOverrideResponse",
)({
  UserId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  Effect: S.optional(S.String),
  Description: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetPersonalAccessTokenMetadataResponse extends S.Class<GetPersonalAccessTokenMetadataResponse>(
  "GetPersonalAccessTokenMetadataResponse",
)({
  PersonalAccessTokenId: S.optional(S.String),
  UserId: S.optional(S.String),
  Name: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Scopes: S.optional(PersonalAccessTokenScopeList),
}) {}
export class ListAliasesResponse extends S.Class<ListAliasesResponse>(
  "ListAliasesResponse",
)({ Aliases: S.optional(Aliases), NextToken: S.optional(S.String) }) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListGroupsFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupsForEntityRequest extends S.Class<ListGroupsForEntityRequest>(
  "ListGroupsForEntityRequest",
)(
  {
    OrganizationId: S.String,
    EntityId: S.String,
    Filters: S.optional(ListGroupsForEntityFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesRequest extends S.Class<ListResourcesRequest>(
  "ListResourcesRequest",
)(
  {
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListResourcesFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListUsersFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutIdentityProviderConfigurationRequest extends S.Class<PutIdentityProviderConfigurationRequest>(
  "PutIdentityProviderConfigurationRequest",
)(
  {
    OrganizationId: S.String,
    AuthenticationMode: S.String,
    IdentityCenterConfiguration: IdentityCenterConfiguration,
    PersonalAccessTokenConfiguration: PersonalAccessTokenConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutIdentityProviderConfigurationResponse extends S.Class<PutIdentityProviderConfigurationResponse>(
  "PutIdentityProviderConfigurationResponse",
)({}) {}
export class PutRetentionPolicyRequest extends S.Class<PutRetentionPolicyRequest>(
  "PutRetentionPolicyRequest",
)(
  {
    OrganizationId: S.String,
    Id: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    FolderConfigurations: FolderConfigurations,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRetentionPolicyResponse extends S.Class<PutRetentionPolicyResponse>(
  "PutRetentionPolicyResponse",
)({}) {}
export class StartMailboxExportJobResponse extends S.Class<StartMailboxExportJobResponse>(
  "StartMailboxExportJobResponse",
)({ JobId: S.optional(S.String) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TestAvailabilityConfigurationResponse extends S.Class<TestAvailabilityConfigurationResponse>(
  "TestAvailabilityConfigurationResponse",
)({ TestPassed: S.optional(S.Boolean), FailureReason: S.optional(S.String) }) {}
export class UpdateResourceRequest extends S.Class<UpdateResourceRequest>(
  "UpdateResourceRequest",
)(
  {
    OrganizationId: S.String,
    ResourceId: S.String,
    Name: S.optional(S.String),
    BookingOptions: S.optional(BookingOptions),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateResourceResponse extends S.Class<UpdateResourceResponse>(
  "UpdateResourceResponse",
)({}) {}
export class ImpersonationMatchedRule extends S.Class<ImpersonationMatchedRule>(
  "ImpersonationMatchedRule",
)({ ImpersonationRuleId: S.optional(S.String), Name: S.optional(S.String) }) {}
export const ImpersonationMatchedRuleList = S.Array(ImpersonationMatchedRule);
export class DnsRecord extends S.Class<DnsRecord>("DnsRecord")({
  Type: S.optional(S.String),
  Hostname: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const DnsRecords = S.Array(DnsRecord);
export class MobileDeviceAccessMatchedRule extends S.Class<MobileDeviceAccessMatchedRule>(
  "MobileDeviceAccessMatchedRule",
)({
  MobileDeviceAccessRuleId: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const MobileDeviceAccessMatchedRuleList = S.Array(
  MobileDeviceAccessMatchedRule,
);
export class AccessControlRule extends S.Class<AccessControlRule>(
  "AccessControlRule",
)({
  Name: S.optional(S.String),
  Effect: S.optional(S.String),
  Description: S.optional(S.String),
  IpRanges: S.optional(IpRangeList),
  NotIpRanges: S.optional(IpRangeList),
  Actions: S.optional(ActionsList),
  NotActions: S.optional(ActionsList),
  UserIds: S.optional(UserIdList),
  NotUserIds: S.optional(UserIdList),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
  NotImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
}) {}
export const AccessControlRulesList = S.Array(AccessControlRule);
export class Member extends S.Class<Member>("Member")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Members = S.Array(Member);
export class ImpersonationRole extends S.Class<ImpersonationRole>(
  "ImpersonationRole",
)({
  ImpersonationRoleId: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ImpersonationRoleList = S.Array(ImpersonationRole);
export class MailboxExportJob extends S.Class<MailboxExportJob>(
  "MailboxExportJob",
)({
  JobId: S.optional(S.String),
  EntityId: S.optional(S.String),
  Description: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3Path: S.optional(S.String),
  EstimatedProgress: S.optional(S.Number),
  State: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Jobs = S.Array(MailboxExportJob);
export class Permission extends S.Class<Permission>("Permission")({
  GranteeId: S.String,
  GranteeType: S.String,
  PermissionValues: PermissionValues,
}) {}
export const Permissions = S.Array(Permission);
export class MailDomainSummary extends S.Class<MailDomainSummary>(
  "MailDomainSummary",
)({ DomainName: S.optional(S.String), DefaultDomain: S.optional(S.Boolean) }) {}
export const MailDomains = S.Array(MailDomainSummary);
export class MobileDeviceAccessOverride extends S.Class<MobileDeviceAccessOverride>(
  "MobileDeviceAccessOverride",
)({
  UserId: S.optional(S.String),
  DeviceId: S.optional(S.String),
  Effect: S.optional(S.String),
  Description: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MobileDeviceAccessOverridesList = S.Array(
  MobileDeviceAccessOverride,
);
export class MobileDeviceAccessRule extends S.Class<MobileDeviceAccessRule>(
  "MobileDeviceAccessRule",
)({
  MobileDeviceAccessRuleId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Effect: S.optional(S.String),
  DeviceTypes: S.optional(DeviceTypeList),
  NotDeviceTypes: S.optional(DeviceTypeList),
  DeviceModels: S.optional(DeviceModelList),
  NotDeviceModels: S.optional(DeviceModelList),
  DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
  NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
  DeviceUserAgents: S.optional(DeviceUserAgentList),
  NotDeviceUserAgents: S.optional(DeviceUserAgentList),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MobileDeviceAccessRulesList = S.Array(MobileDeviceAccessRule);
export class OrganizationSummary extends S.Class<OrganizationSummary>(
  "OrganizationSummary",
)({
  OrganizationId: S.optional(S.String),
  Alias: S.optional(S.String),
  DefaultMailDomain: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const OrganizationSummaries = S.Array(OrganizationSummary);
export class PersonalAccessTokenSummary extends S.Class<PersonalAccessTokenSummary>(
  "PersonalAccessTokenSummary",
)({
  PersonalAccessTokenId: S.optional(S.String),
  UserId: S.optional(S.String),
  Name: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Scopes: S.optional(PersonalAccessTokenScopeList),
}) {}
export const PersonalAccessTokenSummaryList = S.Array(
  PersonalAccessTokenSummary,
);
export class Delegate extends S.Class<Delegate>("Delegate")({
  Id: S.String,
  Type: S.String,
}) {}
export const ResourceDelegates = S.Array(Delegate);
export class CreateImpersonationRoleResponse extends S.Class<CreateImpersonationRoleResponse>(
  "CreateImpersonationRoleResponse",
)({ ImpersonationRoleId: S.optional(S.String) }) {}
export class CreateOrganizationResponse extends S.Class<CreateOrganizationResponse>(
  "CreateOrganizationResponse",
)({ OrganizationId: S.optional(S.String) }) {}
export class GetImpersonationRoleEffectResponse extends S.Class<GetImpersonationRoleEffectResponse>(
  "GetImpersonationRoleEffectResponse",
)({
  Type: S.optional(S.String),
  Effect: S.optional(S.String),
  MatchedRules: S.optional(ImpersonationMatchedRuleList),
}) {}
export class GetMailDomainResponse extends S.Class<GetMailDomainResponse>(
  "GetMailDomainResponse",
)({
  Records: S.optional(DnsRecords),
  IsTestDomain: S.optional(S.Boolean),
  IsDefault: S.optional(S.Boolean),
  OwnershipVerificationStatus: S.optional(S.String),
  DkimVerificationStatus: S.optional(S.String),
}) {}
export class GetMobileDeviceAccessEffectResponse extends S.Class<GetMobileDeviceAccessEffectResponse>(
  "GetMobileDeviceAccessEffectResponse",
)({
  Effect: S.optional(S.String),
  MatchedRules: S.optional(MobileDeviceAccessMatchedRuleList),
}) {}
export class ListAccessControlRulesResponse extends S.Class<ListAccessControlRulesResponse>(
  "ListAccessControlRulesResponse",
)({ Rules: S.optional(AccessControlRulesList) }) {}
export class ListGroupMembersResponse extends S.Class<ListGroupMembersResponse>(
  "ListGroupMembersResponse",
)({ Members: S.optional(Members), NextToken: S.optional(S.String) }) {}
export class ListImpersonationRolesResponse extends S.Class<ListImpersonationRolesResponse>(
  "ListImpersonationRolesResponse",
)({
  Roles: S.optional(ImpersonationRoleList),
  NextToken: S.optional(S.String),
}) {}
export class ListMailboxExportJobsResponse extends S.Class<ListMailboxExportJobsResponse>(
  "ListMailboxExportJobsResponse",
)({ Jobs: S.optional(Jobs), NextToken: S.optional(S.String) }) {}
export class ListMailboxPermissionsResponse extends S.Class<ListMailboxPermissionsResponse>(
  "ListMailboxPermissionsResponse",
)({ Permissions: S.optional(Permissions), NextToken: S.optional(S.String) }) {}
export class ListMailDomainsResponse extends S.Class<ListMailDomainsResponse>(
  "ListMailDomainsResponse",
)({ MailDomains: S.optional(MailDomains), NextToken: S.optional(S.String) }) {}
export class ListMobileDeviceAccessOverridesResponse extends S.Class<ListMobileDeviceAccessOverridesResponse>(
  "ListMobileDeviceAccessOverridesResponse",
)({
  Overrides: S.optional(MobileDeviceAccessOverridesList),
  NextToken: S.optional(S.String),
}) {}
export class ListMobileDeviceAccessRulesResponse extends S.Class<ListMobileDeviceAccessRulesResponse>(
  "ListMobileDeviceAccessRulesResponse",
)({ Rules: S.optional(MobileDeviceAccessRulesList) }) {}
export class ListOrganizationsResponse extends S.Class<ListOrganizationsResponse>(
  "ListOrganizationsResponse",
)({
  OrganizationSummaries: S.optional(OrganizationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListPersonalAccessTokensResponse extends S.Class<ListPersonalAccessTokensResponse>(
  "ListPersonalAccessTokensResponse",
)({
  NextToken: S.optional(S.String),
  PersonalAccessTokenSummaries: S.optional(PersonalAccessTokenSummaryList),
}) {}
export class ListResourceDelegatesResponse extends S.Class<ListResourceDelegatesResponse>(
  "ListResourceDelegatesResponse",
)({
  Delegates: S.optional(ResourceDelegates),
  NextToken: S.optional(S.String),
}) {}
export class RedactedEwsAvailabilityProvider extends S.Class<RedactedEwsAvailabilityProvider>(
  "RedactedEwsAvailabilityProvider",
)({ EwsEndpoint: S.optional(S.String), EwsUsername: S.optional(S.String) }) {}
export class AvailabilityConfiguration extends S.Class<AvailabilityConfiguration>(
  "AvailabilityConfiguration",
)({
  DomainName: S.optional(S.String),
  ProviderType: S.optional(S.String),
  EwsProvider: S.optional(RedactedEwsAvailabilityProvider),
  LambdaProvider: S.optional(LambdaAvailabilityProvider),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AvailabilityConfigurationList = S.Array(AvailabilityConfiguration);
export class Group extends S.Class<Group>("Group")({
  Id: S.optional(S.String),
  Email: S.optional(S.String),
  Name: S.optional(S.String),
  State: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Groups = S.Array(Group);
export class GroupIdentifier extends S.Class<GroupIdentifier>(
  "GroupIdentifier",
)({ GroupId: S.optional(S.String), GroupName: S.optional(S.String) }) {}
export const GroupIdentifiers = S.Array(GroupIdentifier);
export class Resource extends S.Class<Resource>("Resource")({
  Id: S.optional(S.String),
  Email: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
}) {}
export const Resources = S.Array(Resource);
export class User extends S.Class<User>("User")({
  Id: S.optional(S.String),
  Email: S.optional(S.String),
  Name: S.optional(S.String),
  DisplayName: S.optional(S.String),
  State: S.optional(S.String),
  UserRole: S.optional(S.String),
  EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IdentityProviderUserId: S.optional(S.String),
  IdentityProviderIdentityStoreId: S.optional(S.String),
}) {}
export const Users = S.Array(User);
export class ListAvailabilityConfigurationsResponse extends S.Class<ListAvailabilityConfigurationsResponse>(
  "ListAvailabilityConfigurationsResponse",
)({
  AvailabilityConfigurations: S.optional(AvailabilityConfigurationList),
  NextToken: S.optional(S.String),
}) {}
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)({ Groups: S.optional(Groups), NextToken: S.optional(S.String) }) {}
export class ListGroupsForEntityResponse extends S.Class<ListGroupsForEntityResponse>(
  "ListGroupsForEntityResponse",
)({ Groups: S.optional(GroupIdentifiers), NextToken: S.optional(S.String) }) {}
export class ListResourcesResponse extends S.Class<ListResourcesResponse>(
  "ListResourcesResponse",
)({ Resources: S.optional(Resources), NextToken: S.optional(S.String) }) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ Users: S.optional(Users), NextToken: S.optional(S.String) }) {}

//# Errors
export class EntityNotFoundException extends S.TaggedError<EntityNotFoundException>()(
  "EntityNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryServiceAuthenticationFailedException extends S.TaggedError<DirectoryServiceAuthenticationFailedException>()(
  "DirectoryServiceAuthenticationFailedException",
  { Message: S.optional(S.String) },
) {}
export class EmailAddressInUseException extends S.TaggedError<EmailAddressInUseException>()(
  "EmailAddressInUseException",
  { Message: S.optional(S.String) },
) {}
export class OrganizationNotFoundException extends S.TaggedError<OrganizationNotFoundException>()(
  "OrganizationNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class EntityStateException extends S.TaggedError<EntityStateException>()(
  "EntityStateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidCustomSesConfigurationException extends S.TaggedError<InvalidCustomSesConfigurationException>()(
  "InvalidCustomSesConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryUnavailableException extends S.TaggedError<DirectoryUnavailableException>()(
  "DirectoryUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class OrganizationStateException extends S.TaggedError<OrganizationStateException>()(
  "OrganizationStateException",
  { Message: S.optional(S.String) },
) {}
export class MailDomainInUseException extends S.TaggedError<MailDomainInUseException>()(
  "MailDomainInUseException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class MailDomainNotFoundException extends S.TaggedError<MailDomainNotFoundException>()(
  "MailDomainNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryInUseException extends S.TaggedError<DirectoryInUseException>()(
  "DirectoryInUseException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class NameAvailabilityException extends S.TaggedError<NameAvailabilityException>()(
  "NameAvailabilityException",
  { Message: S.optional(S.String) },
) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { Message: S.optional(S.String) },
) {}
export class InvalidConfigurationException extends S.TaggedError<InvalidConfigurationException>()(
  "InvalidConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class EntityAlreadyRegisteredException extends S.TaggedError<EntityAlreadyRegisteredException>()(
  "EntityAlreadyRegisteredException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}
export class MailDomainStateException extends S.TaggedError<MailDomainStateException>()(
  "MailDomainStateException",
  { Message: S.optional(S.String) },
) {}
export class ReservedNameException extends S.TaggedError<ReservedNameException>()(
  "ReservedNameException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides more information regarding a given organization based on its
 * identifier.
 */
export const describeOrganization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOrganizationRequest,
    output: DescribeOrganizationResponse,
    errors: [InvalidParameterException, OrganizationNotFoundException],
  }),
);
/**
 * Untags the specified tags from the specified WorkMail organization
 * resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Creates the WorkMail application in IAM Identity Center that can be used later in the WorkMail - IdC integration. For more information, see PutIdentityProviderConfiguration. This action does not affect the authentication settings for any WorkMail organizations.
 */
export const createIdentityCenterApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateIdentityCenterApplicationRequest,
    output: CreateIdentityCenterApplicationResponse,
    errors: [InvalidParameterException],
  }));
/**
 * Lists the tags applied to an WorkMail organization resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an access control rule for the specified WorkMail organization.
 *
 * Deleting already deleted and non-existing rules does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteAccessControlRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccessControlRuleRequest,
    output: DeleteAccessControlRuleResponse,
    errors: [OrganizationNotFoundException, OrganizationStateException],
  }),
);
/**
 * Removes a domain from WorkMail, stops email routing to WorkMail, and removes the authorization allowing WorkMail use. SES keeps the domain because other applications may use it. You must first
 * remove any email address used by WorkMail entities before you remove the domain.
 */
export const deregisterMailDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterMailDomainRequest,
    output: DeregisterMailDomainResponse,
    errors: [
      InvalidCustomSesConfigurationException,
      InvalidParameterException,
      MailDomainInUseException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Tests whether the given impersonation role can impersonate a target user.
 */
export const getImpersonationRoleEffect = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetImpersonationRoleEffectRequest,
    output: GetImpersonationRoleEffectResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Simulates the effect of the mobile device access rules for the given attributes of a sample access event. Use this method to test the effects of the current set of mobile device access
 * rules for the WorkMail organization for a particular user's attributes.
 */
export const getMobileDeviceAccessEffect = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMobileDeviceAccessEffectRequest,
    output: GetMobileDeviceAccessEffectResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Lists the access control rules for the specified organization.
 */
export const listAccessControlRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAccessControlRulesRequest,
    output: ListAccessControlRulesResponse,
    errors: [OrganizationNotFoundException, OrganizationStateException],
  }),
);
/**
 * Returns an overview of the members of a group. Users and groups can be members of a
 * group.
 */
export const listGroupMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGroupMembersRequest,
    output: ListGroupMembersResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the impersonation roles for the given WorkMail organization.
 */
export const listImpersonationRoles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListImpersonationRolesRequest,
    output: ListImpersonationRolesResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the mailbox export jobs started for the specified organization within the last
 * seven days.
 */
export const listMailboxExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMailboxExportJobsRequest,
    output: ListMailboxExportJobsResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the mailbox permissions associated with a user, group, or resource
 * mailbox.
 */
export const listMailboxPermissions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMailboxPermissionsRequest,
    output: ListMailboxPermissionsResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the mail domains in a given WorkMail organization.
 */
export const listMailDomains = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMailDomainsRequest,
    output: ListMailDomainsResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all the mobile device access overrides for any given combination of WorkMail organization, user, or device.
 */
export const listMobileDeviceAccessOverrides =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListMobileDeviceAccessOverridesRequest,
    output: ListMobileDeviceAccessOverridesResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the mobile device access rules for the specified WorkMail organization.
 */
export const listMobileDeviceAccessRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMobileDeviceAccessRulesRequest,
    output: ListMobileDeviceAccessRulesResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Returns summaries of the customer's organizations.
 */
export const listOrganizations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListOrganizationsRequest,
    output: ListOrganizationsResponse,
    errors: [InvalidParameterException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a summary of your Personal Access Tokens.
 */
export const listPersonalAccessTokens =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPersonalAccessTokensRequest,
    output: ListPersonalAccessTokensResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PersonalAccessTokenSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Puts a retention policy to the specified organization.
 */
export const putRetentionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionPolicyRequest,
  output: PutRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Provides information regarding the user.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the email monitoring configuration for a specified organization.
 */
export const deleteEmailMonitoringConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEmailMonitoringConfigurationRequest,
    output: DeleteEmailMonitoringConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Deletes an WorkMail organization and all underlying AWS resources managed by WorkMail as part of the organization. You can choose whether to delete the associated directory. For more information, see Removing an organization in the *WorkMail Administrator Guide*.
 */
export const deleteOrganization = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationRequest,
  output: DeleteOrganizationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Describes the current email monitoring configuration for a specified organization.
 */
export const describeEmailMonitoringConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEmailMonitoringConfigurationRequest,
    output: DescribeEmailMonitoringConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns basic details about an entity in WorkMail.
 */
export const describeEntity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityRequest,
  output: DescribeEntityResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Returns the data available for the group.
 */
export const describeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupRequest,
  output: DescribeGroupResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Returns detailed information on the current IdC setup for the WorkMail organization.
 */
export const describeIdentityProviderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeIdentityProviderConfigurationRequest,
    output: DescribeIdentityProviderConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Lists the settings in a DMARC policy for a specified organization.
 */
export const describeInboundDmarcSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeInboundDmarcSettingsRequest,
    output: DescribeInboundDmarcSettingsResponse,
    errors: [OrganizationNotFoundException, OrganizationStateException],
  }));
/**
 * Describes the current status of a mailbox export job.
 */
export const describeMailboxExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMailboxExportJobRequest,
    output: DescribeMailboxExportJobResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Gets the effects of an organization's access control rules as they apply to a
 * specified IPv4 address, access protocol action, and user ID or impersonation role ID. You must provide either the user ID or impersonation role ID. Impersonation role ID can only be used with Action EWS.
 */
export const getAccessControlEffect = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccessControlEffectRequest,
    output: GetAccessControlEffectResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the default retention policy details for the specified organization.
 */
export const getDefaultRetentionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDefaultRetentionPolicyRequest,
    output: GetDefaultRetentionPolicyResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Gets the impersonation role details for the given WorkMail organization.
 */
export const getImpersonationRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetImpersonationRoleRequest,
    output: GetImpersonationRoleResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Requests a user's mailbox details for a specified organization and user.
 */
export const getMailboxDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMailboxDetailsRequest,
  output: GetMailboxDetailsResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Gets the mobile device access override for the given WorkMail organization, user, and device.
 */
export const getMobileDeviceAccessOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetMobileDeviceAccessOverrideRequest,
    output: GetMobileDeviceAccessOverrideResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Requests details of a specific Personal Access Token within the WorkMail organization.
 */
export const getPersonalAccessTokenMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPersonalAccessTokenMetadataRequest,
    output: GetPersonalAccessTokenMetadataResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Creates a paginated call to list the aliases associated with a given
 * entity.
 */
export const listAliases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAliasesRequest,
    output: ListAliasesResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Enables integration between IAM Identity Center (IdC) and WorkMail to proxy authentication requests for mailbox users. You can connect your IdC directory or your external directory to WorkMail through
 * IdC and manage access to WorkMail mailboxes in a single place. For enhanced protection, you could enable Multifactor Authentication (MFA) and Personal Access Tokens.
 */
export const putIdentityProviderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutIdentityProviderConfigurationRequest,
    output: PutIdentityProviderConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Performs a test on an availability provider to ensure that access is allowed. For EWS, it verifies the provided credentials can be used to successfully log in. For Lambda, it verifies that the Lambda function can be invoked and that the resource access
 * policy was configured to deny anonymous access. An anonymous invocation is one done without providing either a `SourceArn` or `SourceAccount` header.
 *
 * The request must contain either one provider definition (`EwsProvider` or
 * `LambdaProvider`) or the `DomainName` parameter. If the
 * `DomainName` parameter is provided, the configuration stored under the
 * `DomainName` will be tested.
 */
export const testAvailabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: TestAvailabilityConfigurationRequest,
    output: TestAvailabilityConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Cancels a mailbox export job.
 *
 * If the mailbox export job is near completion, it might not be possible to cancel
 * it.
 */
export const cancelMailboxExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMailboxExportJobRequest,
    output: CancelMailboxExportJobResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Remove one or more specified aliases from a set of aliases for a given
 * user.
 */
export const deleteAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasRequest,
  output: DeleteAliasResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes permissions granted to a member (user or group).
 */
export const deleteMailboxPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMailboxPermissionsRequest,
    output: DeleteMailboxPermissionsResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Deletes the mobile device access override for the given WorkMail organization, user, and device.
 *
 * Deleting already deleted and non-existing overrides does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteMobileDeviceAccessOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMobileDeviceAccessOverrideRequest,
    output: DeleteMobileDeviceAccessOverrideResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Mark a user, group, or resource as no longer used in WorkMail. This action
 * disassociates the mailbox and schedules it for clean-up. WorkMail keeps mailboxes for 30 days
 * before they are permanently removed. The functionality in the console is
 * *Disable*.
 */
export const deregisterFromWorkMail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterFromWorkMailRequest,
    output: DeregisterFromWorkMailResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Sets permissions for a user, group, or resource. This replaces any pre-existing
 * permissions.
 */
export const putMailboxPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutMailboxPermissionsRequest,
    output: PutMailboxPermissionsResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Creates or updates a mobile device access override for the given WorkMail organization, user, and device.
 */
export const putMobileDeviceAccessOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutMobileDeviceAccessOverrideRequest,
    output: PutMobileDeviceAccessOverrideResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Updates a user's current mailbox quota for a specified organization and
 * user.
 */
export const updateMailboxQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMailboxQuotaRequest,
  output: UpdateMailboxQuotaResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Updates a mobile device access rule for the specified WorkMail organization.
 */
export const updateMobileDeviceAccessRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateMobileDeviceAccessRuleRequest,
    output: UpdateMobileDeviceAccessRuleResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Deletes the `AvailabilityConfiguration` for the given WorkMail organization and domain.
 */
export const deleteAvailabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAvailabilityConfigurationRequest,
    output: DeleteAvailabilityConfigurationResponse,
    errors: [OrganizationNotFoundException, OrganizationStateException],
  }));
/**
 * Enables or disables a DMARC policy for a given organization.
 */
export const putInboundDmarcSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutInboundDmarcSettingsRequest,
    output: PutInboundDmarcSettingsResponse,
    errors: [OrganizationNotFoundException, OrganizationStateException],
  }),
);
/**
 * Deletes the IAM Identity Center application from WorkMail. This action does not affect the authentication settings for any WorkMail organizations.
 */
export const deleteIdentityCenterApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIdentityCenterApplicationRequest,
    output: DeleteIdentityCenterApplicationResponse,
    errors: [InvalidParameterException, OrganizationStateException],
  }));
/**
 * Disables the integration between IdC and WorkMail. Authentication will continue with the directory as it was before the IdC integration. You might have to reset your directory passwords and reconfigure your desktop and mobile email clients.
 */
export const deleteIdentityProviderConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIdentityProviderConfigurationRequest,
    output: DeleteIdentityProviderConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Deletes an impersonation role for the given WorkMail organization.
 */
export const deleteImpersonationRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteImpersonationRoleRequest,
    output: DeleteImpersonationRoleResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Deletes a mobile device access rule for the specified WorkMail organization.
 *
 * Deleting already deleted and non-existing rules does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteMobileDeviceAccessRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMobileDeviceAccessRuleRequest,
    output: DeleteMobileDeviceAccessRuleResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Deletes the Personal Access Token from the provided WorkMail Organization.
 */
export const deletePersonalAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePersonalAccessTokenRequest,
    output: DeletePersonalAccessTokenResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Deletes the specified retention policy from the specified organization.
 */
export const deleteRetentionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRetentionPolicyRequest,
    output: DeleteRetentionPolicyResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Creates or updates the email monitoring configuration for a specified organization.
 */
export const putEmailMonitoringConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutEmailMonitoringConfigurationRequest,
    output: PutEmailMonitoringConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Updates an existing `AvailabilityConfiguration` for the given WorkMail
 * organization and domain.
 */
export const updateAvailabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAvailabilityConfigurationRequest,
    output: UpdateAvailabilityConfigurationResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Assumes an impersonation role for the given WorkMail organization. This method returns an
 * authentication token you can use to make impersonated calls.
 */
export const assumeImpersonationRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssumeImpersonationRoleRequest,
    output: AssumeImpersonationRoleResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Starts a mailbox export job to export MIME-format email messages and calendar items
 * from the specified mailbox to the specified Amazon Simple Storage Service (Amazon S3)
 * bucket. For more information, see Exporting mailbox content in
 * the *WorkMail Administrator Guide*.
 */
export const startMailboxExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMailboxExportJobRequest,
    output: StartMailboxExportJobResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      LimitExceededException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Adds a new access control rule for the specified organization. The rule allows or
 * denies access to the organization for the specified IPv4 addresses, access protocol
 * actions, user IDs and impersonation IDs. Adding a new rule with the same name as an existing rule replaces
 * the older rule.
 */
export const putAccessControlRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAccessControlRuleRequest,
    output: PutAccessControlRuleResponse,
    errors: [
      EntityNotFoundException,
      InvalidParameterException,
      LimitExceededException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates an impersonation role for the given WorkMail organization.
 */
export const updateImpersonationRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateImpersonationRoleRequest,
    output: UpdateImpersonationRoleResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      LimitExceededException,
      OrganizationNotFoundException,
      OrganizationStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Registers a new domain in WorkMail and SES, and configures it for use by WorkMail. Emails received by SES for this domain are routed to the specified WorkMail organization, and WorkMail has
 * permanent permission to use the specified domain for sending your users' emails.
 */
export const registerMailDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterMailDomainRequest,
  output: RegisterMailDomainResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    MailDomainInUseException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates a new mobile device access rule for the specified WorkMail organization.
 */
export const createMobileDeviceAccessRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateMobileDeviceAccessRuleRequest,
    output: CreateMobileDeviceAccessRuleResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Creates an impersonation role for the given WorkMail organization.
 *
 * *Idempotency* ensures that an API request completes no more than one
 * time. With an idempotent request, if the original request completes successfully, any
 * subsequent retries also complete successfully without performing any further
 * actions.
 */
export const createImpersonationRole = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateImpersonationRoleRequest,
    output: CreateImpersonationRoleResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      LimitExceededException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Gets details for a mail domain, including domain records required to configure your domain with recommended security.
 */
export const getMailDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMailDomainRequest,
  output: GetMailDomainResponse,
  errors: [
    InvalidParameterException,
    MailDomainNotFoundException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * List all the `AvailabilityConfiguration`'s for the given WorkMail organization.
 */
export const listAvailabilityConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAvailabilityConfigurationsRequest,
    output: ListAvailabilityConfigurationsResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AvailabilityConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns summaries of the organization's groups.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns all the groups to which an entity belongs.
 */
export const listGroupsForEntity =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListGroupsForEntityRequest,
    output: ListGroupsForEntityResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the delegates associated with a resource. Users and groups can be resource
 * delegates and answer requests on behalf of the resource.
 */
export const listResourceDelegates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceDelegatesRequest,
    output: ListResourceDelegatesResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns summaries of the organization's resources.
 */
export const listResources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListResourcesRequest,
    output: ListResourcesResponse,
    errors: [
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns summaries of the organization's users.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Applies the specified tags to the specified WorkMailorganization
 * resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    OrganizationStateException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Updates the default mail domain for an organization. The default mail domain is used by the WorkMail AWS Console to suggest an email address when enabling a mail user. You can only have one default domain.
 */
export const updateDefaultMailDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDefaultMailDomainRequest,
    output: UpdateDefaultMailDomainResponse,
    errors: [
      InvalidParameterException,
      MailDomainNotFoundException,
      MailDomainStateException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }),
);
/**
 * Deletes a group from WorkMail.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a user from WorkMail and all subsequent systems. Before you can delete a
 * user, the user state must be `DISABLED`. Use the DescribeUser
 * action to confirm the user state.
 *
 * Deleting a user is permanent and cannot be undone. WorkMail archives user mailboxes for
 * 30 days before they are permanently removed.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes a member from a group.
 */
export const disassociateMemberFromGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateMemberFromGroupRequest,
    output: DisassociateMemberFromGroupResponse,
    errors: [
      DirectoryServiceAuthenticationFailedException,
      DirectoryUnavailableException,
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Updates data for the user. To have the latest information, it must be preceded by a
 * DescribeUser call. The dataset in the request should be the one
 * expected when performing another `DescribeUser` call.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the specified resource.
 */
export const deleteResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceRequest,
  output: DeleteResourceResponse,
  errors: [
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns the data available for the resource.
 */
export const describeResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceRequest,
  output: DescribeResourceResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes a member from the resource's set of delegates.
 */
export const disassociateDelegateFromResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDelegateFromResourceRequest,
    output: DisassociateDelegateFromResourceResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Updates attributes in a group.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds a member (user or group) to the resource's set of delegates.
 */
export const associateDelegateToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDelegateToResourceRequest,
    output: AssociateDelegateToResourceResponse,
    errors: [
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Adds a member (user or group) to the group's set.
 */
export const associateMemberToGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateMemberToGroupRequest,
    output: AssociateMemberToGroupResponse,
    errors: [
      DirectoryServiceAuthenticationFailedException,
      DirectoryUnavailableException,
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Creates an `AvailabilityConfiguration` for the given WorkMail organization and domain.
 */
export const createAvailabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAvailabilityConfigurationRequest,
    output: CreateAvailabilityConfigurationResponse,
    errors: [
      InvalidParameterException,
      LimitExceededException,
      NameAvailabilityException,
      OrganizationNotFoundException,
      OrganizationStateException,
    ],
  }));
/**
 * Creates a new WorkMail organization. Optionally, you can choose to associate an existing AWS Directory Service directory with your organization. If an AWS Directory Service directory ID is specified, the organization alias must match the directory alias. If you choose not to associate an existing directory with your organization, then we create a new WorkMail directory for you. For more information, see Adding an organization in the *WorkMail Administrator Guide*.
 *
 * You can associate multiple email domains with an organization, then choose your
 * default email domain from the WorkMail console. You can also associate a domain that is managed
 * in an Amazon Route 53 public hosted zone. For more information, see Adding a
 * domain and Choosing the default domain
 * in the *WorkMail Administrator Guide*.
 *
 * Optionally, you can use a customer managed key from AWS Key Management Service (AWS
 * KMS) to encrypt email for your organization. If you don't associate an AWS KMS key, WorkMail
 * creates a default, AWS managed key for you.
 */
export const createOrganization = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrganizationRequest,
  output: CreateOrganizationResponse,
  errors: [
    DirectoryInUseException,
    DirectoryUnavailableException,
    InvalidParameterException,
    LimitExceededException,
    NameAvailabilityException,
  ],
}));
/**
 * Allows the administrator to reset the password for a user.
 */
export const resetPassword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetPasswordRequest,
  output: ResetPasswordResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    InvalidPasswordException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds an alias to the set of a given member (user or group) of WorkMail.
 */
export const createAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasRequest,
  output: CreateAliasResponse,
  errors: [
    EmailAddressInUseException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    LimitExceededException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Updates the primary email for a user, group, or resource. The current email is moved
 * into the list of aliases (or swapped between an existing alias and the current primary
 * email), and the email provided in the input is promoted as the primary.
 */
export const updatePrimaryEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePrimaryEmailAddressRequest,
    output: UpdatePrimaryEmailAddressResponse,
    errors: [
      DirectoryServiceAuthenticationFailedException,
      DirectoryUnavailableException,
      EmailAddressInUseException,
      EntityNotFoundException,
      EntityStateException,
      InvalidParameterException,
      MailDomainNotFoundException,
      MailDomainStateException,
      OrganizationNotFoundException,
      OrganizationStateException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Updates data for the resource. To have the latest information, it must be preceded by
 * a DescribeResource call. The dataset in the request should be the one
 * expected when performing another `DescribeResource` call.
 */
export const updateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceRequest,
  output: UpdateResourceResponse,
  errors: [
    DirectoryUnavailableException,
    EmailAddressInUseException,
    EntityNotFoundException,
    EntityStateException,
    InvalidConfigurationException,
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Registers an existing and disabled user, group, or resource for WorkMail use by
 * associating a mailbox and calendaring capabilities. It performs no change if the user,
 * group, or resource is enabled and fails if the user, group, or resource is deleted. This
 * operation results in the accumulation of costs. For more information, see Pricing. The equivalent console
 * functionality for this operation is *Enable*.
 *
 * Users can either be created by calling the CreateUser API operation
 * or they can be synchronized from your directory. For more information, see DeregisterFromWorkMail.
 */
export const registerToWorkMail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterToWorkMailRequest,
  output: RegisterToWorkMailResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EmailAddressInUseException,
    EntityAlreadyRegisteredException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a group that can be used in WorkMail by calling the RegisterToWorkMail operation.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a user who can be used in WorkMail by calling the RegisterToWorkMail operation.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    InvalidPasswordException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a new WorkMail resource.
 */
export const createResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceRequest,
  output: CreateResourceResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));
