import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "FMS",
  serviceShapeName: "AWSFMS_20180101",
});
const auth = T.AwsAuthSigv4({ name: "fms" });
const ver = T.ServiceVersion("2018-01-01");
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
                        url: "https://fms-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://fms-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://fms.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://fms.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteNotificationChannelRequest extends S.Class<DeleteNotificationChannelRequest>(
  "DeleteNotificationChannelRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotificationChannelResponse extends S.Class<DeleteNotificationChannelResponse>(
  "DeleteNotificationChannelResponse",
)({}) {}
export class DisassociateAdminAccountRequest extends S.Class<DisassociateAdminAccountRequest>(
  "DisassociateAdminAccountRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateAdminAccountResponse extends S.Class<DisassociateAdminAccountResponse>(
  "DisassociateAdminAccountResponse",
)({}) {}
export class GetAdminAccountRequest extends S.Class<GetAdminAccountRequest>(
  "GetAdminAccountRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNotificationChannelRequest extends S.Class<GetNotificationChannelRequest>(
  "GetNotificationChannelRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const IdentifierList = S.Array(S.String);
export const AWSAccountIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateAdminAccountRequest extends S.Class<AssociateAdminAccountRequest>(
  "AssociateAdminAccountRequest",
)(
  { AdminAccount: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateAdminAccountResponse extends S.Class<AssociateAdminAccountResponse>(
  "AssociateAdminAccountResponse",
)({}) {}
export class AssociateThirdPartyFirewallRequest extends S.Class<AssociateThirdPartyFirewallRequest>(
  "AssociateThirdPartyFirewallRequest",
)(
  { ThirdPartyFirewall: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchAssociateResourceRequest extends S.Class<BatchAssociateResourceRequest>(
  "BatchAssociateResourceRequest",
)(
  { ResourceSetIdentifier: S.String, Items: IdentifierList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDisassociateResourceRequest extends S.Class<BatchDisassociateResourceRequest>(
  "BatchDisassociateResourceRequest",
)(
  { ResourceSetIdentifier: S.String, Items: IdentifierList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAppsListRequest extends S.Class<DeleteAppsListRequest>(
  "DeleteAppsListRequest",
)(
  { ListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAppsListResponse extends S.Class<DeleteAppsListResponse>(
  "DeleteAppsListResponse",
)({}) {}
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  { PolicyId: S.String, DeleteAllPolicyResources: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}) {}
export class DeleteProtocolsListRequest extends S.Class<DeleteProtocolsListRequest>(
  "DeleteProtocolsListRequest",
)(
  { ListId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProtocolsListResponse extends S.Class<DeleteProtocolsListResponse>(
  "DeleteProtocolsListResponse",
)({}) {}
export class DeleteResourceSetRequest extends S.Class<DeleteResourceSetRequest>(
  "DeleteResourceSetRequest",
)(
  { Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourceSetResponse extends S.Class<DeleteResourceSetResponse>(
  "DeleteResourceSetResponse",
)({}) {}
export class DisassociateThirdPartyFirewallRequest extends S.Class<DisassociateThirdPartyFirewallRequest>(
  "DisassociateThirdPartyFirewallRequest",
)(
  { ThirdPartyFirewall: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAdminAccountResponse extends S.Class<GetAdminAccountResponse>(
  "GetAdminAccountResponse",
)({ AdminAccount: S.optional(S.String), RoleStatus: S.optional(S.String) }) {}
export class GetAdminScopeRequest extends S.Class<GetAdminScopeRequest>(
  "GetAdminScopeRequest",
)(
  { AdminAccount: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAppsListRequest extends S.Class<GetAppsListRequest>(
  "GetAppsListRequest",
)(
  { ListId: S.String, DefaultList: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComplianceDetailRequest extends S.Class<GetComplianceDetailRequest>(
  "GetComplianceDetailRequest",
)(
  { PolicyId: S.String, MemberAccount: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNotificationChannelResponse extends S.Class<GetNotificationChannelResponse>(
  "GetNotificationChannelResponse",
)({ SnsTopicArn: S.optional(S.String), SnsRoleName: S.optional(S.String) }) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  { PolicyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProtectionStatusRequest extends S.Class<GetProtectionStatusRequest>(
  "GetProtectionStatusRequest",
)(
  {
    PolicyId: S.String,
    MemberAccountId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProtocolsListRequest extends S.Class<GetProtocolsListRequest>(
  "GetProtocolsListRequest",
)(
  { ListId: S.String, DefaultList: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceSetRequest extends S.Class<GetResourceSetRequest>(
  "GetResourceSetRequest",
)(
  { Identifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetThirdPartyFirewallAssociationStatusRequest extends S.Class<GetThirdPartyFirewallAssociationStatusRequest>(
  "GetThirdPartyFirewallAssociationStatusRequest",
)(
  { ThirdPartyFirewall: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetViolationDetailsRequest extends S.Class<GetViolationDetailsRequest>(
  "GetViolationDetailsRequest",
)(
  {
    PolicyId: S.String,
    MemberAccount: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAdminAccountsForOrganizationRequest extends S.Class<ListAdminAccountsForOrganizationRequest>(
  "ListAdminAccountsForOrganizationRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAdminsManagingAccountRequest extends S.Class<ListAdminsManagingAccountRequest>(
  "ListAdminsManagingAccountRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAppsListsRequest extends S.Class<ListAppsListsRequest>(
  "ListAppsListsRequest",
)(
  {
    DefaultLists: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComplianceStatusRequest extends S.Class<ListComplianceStatusRequest>(
  "ListComplianceStatusRequest",
)(
  {
    PolicyId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDiscoveredResourcesRequest extends S.Class<ListDiscoveredResourcesRequest>(
  "ListDiscoveredResourcesRequest",
)(
  {
    MemberAccountIds: AWSAccountIdList,
    ResourceType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMemberAccountsRequest extends S.Class<ListMemberAccountsRequest>(
  "ListMemberAccountsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPoliciesRequest extends S.Class<ListPoliciesRequest>(
  "ListPoliciesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProtocolsListsRequest extends S.Class<ListProtocolsListsRequest>(
  "ListProtocolsListsRequest",
)(
  {
    DefaultLists: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceSetResourcesRequest extends S.Class<ListResourceSetResourcesRequest>(
  "ListResourceSetResourcesRequest",
)(
  {
    Identifier: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceSetsRequest extends S.Class<ListResourceSetsRequest>(
  "ListResourceSetsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListThirdPartyFirewallFirewallPoliciesRequest extends S.Class<ListThirdPartyFirewallFirewallPoliciesRequest>(
  "ListThirdPartyFirewallFirewallPoliciesRequest",
)(
  {
    ThirdPartyFirewall: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.Number,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutNotificationChannelRequest extends S.Class<PutNotificationChannelRequest>(
  "PutNotificationChannelRequest",
)(
  { SnsTopicArn: S.String, SnsRoleName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutNotificationChannelResponse extends S.Class<PutNotificationChannelResponse>(
  "PutNotificationChannelResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, TagList: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const ResourceTypeList = S.Array(S.String);
export const ResourceSetIds = S.Array(S.String);
export const ProtocolsList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const MemberAccounts = S.Array(S.String);
export class ResourceSet extends S.Class<ResourceSet>("ResourceSet")({
  Id: S.optional(S.String),
  Name: S.String,
  Description: S.optional(S.String),
  UpdateToken: S.optional(S.String),
  ResourceTypeList: ResourceTypeList,
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceSetStatus: S.optional(S.String),
}) {}
export const OrganizationalUnitIdList = S.Array(S.String);
export const AWSRegionList = S.Array(S.String);
export const SecurityServiceTypeList = S.Array(S.String);
export const CustomerPolicyScopeIdList = S.Array(S.String);
export class AssociateThirdPartyFirewallResponse extends S.Class<AssociateThirdPartyFirewallResponse>(
  "AssociateThirdPartyFirewallResponse",
)({ ThirdPartyFirewallStatus: S.optional(S.String) }) {}
export class FailedItem extends S.Class<FailedItem>("FailedItem")({
  URI: S.optional(S.String),
  Reason: S.optional(S.String),
}) {}
export const FailedItemList = S.Array(FailedItem);
export class BatchDisassociateResourceResponse extends S.Class<BatchDisassociateResourceResponse>(
  "BatchDisassociateResourceResponse",
)({ ResourceSetIdentifier: S.String, FailedItems: FailedItemList }) {}
export class DisassociateThirdPartyFirewallResponse extends S.Class<DisassociateThirdPartyFirewallResponse>(
  "DisassociateThirdPartyFirewallResponse",
)({ ThirdPartyFirewallStatus: S.optional(S.String) }) {}
export class AccountScope extends S.Class<AccountScope>("AccountScope")({
  Accounts: S.optional(AccountIdList),
  AllAccountsEnabled: S.optional(S.Boolean),
  ExcludeSpecifiedAccounts: S.optional(S.Boolean),
}) {}
export class OrganizationalUnitScope extends S.Class<OrganizationalUnitScope>(
  "OrganizationalUnitScope",
)({
  OrganizationalUnits: S.optional(OrganizationalUnitIdList),
  AllOrganizationalUnitsEnabled: S.optional(S.Boolean),
  ExcludeSpecifiedOrganizationalUnits: S.optional(S.Boolean),
}) {}
export class RegionScope extends S.Class<RegionScope>("RegionScope")({
  Regions: S.optional(AWSRegionList),
  AllRegionsEnabled: S.optional(S.Boolean),
}) {}
export class PolicyTypeScope extends S.Class<PolicyTypeScope>(
  "PolicyTypeScope",
)({
  PolicyTypes: S.optional(SecurityServiceTypeList),
  AllPolicyTypesEnabled: S.optional(S.Boolean),
}) {}
export class AdminScope extends S.Class<AdminScope>("AdminScope")({
  AccountScope: S.optional(AccountScope),
  OrganizationalUnitScope: S.optional(OrganizationalUnitScope),
  RegionScope: S.optional(RegionScope),
  PolicyTypeScope: S.optional(PolicyTypeScope),
}) {}
export class GetAdminScopeResponse extends S.Class<GetAdminScopeResponse>(
  "GetAdminScopeResponse",
)({ AdminScope: S.optional(AdminScope), Status: S.optional(S.String) }) {}
export class App extends S.Class<App>("App")({
  AppName: S.String,
  Protocol: S.String,
  Port: S.Number,
}) {}
export const AppsList = S.Array(App);
export const PreviousAppsList = S.Record({ key: S.String, value: AppsList });
export class AppsListData extends S.Class<AppsListData>("AppsListData")({
  ListId: S.optional(S.String),
  ListName: S.String,
  ListUpdateToken: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AppsList: AppsList,
  PreviousAppsList: S.optional(PreviousAppsList),
}) {}
export class GetAppsListResponse extends S.Class<GetAppsListResponse>(
  "GetAppsListResponse",
)({ AppsList: S.optional(AppsListData), AppsListArn: S.optional(S.String) }) {}
export class NetworkFirewallPolicy extends S.Class<NetworkFirewallPolicy>(
  "NetworkFirewallPolicy",
)({ FirewallDeploymentModel: S.optional(S.String) }) {}
export class ThirdPartyFirewallPolicy extends S.Class<ThirdPartyFirewallPolicy>(
  "ThirdPartyFirewallPolicy",
)({ FirewallDeploymentModel: S.optional(S.String) }) {}
export class NetworkAclIcmpTypeCode extends S.Class<NetworkAclIcmpTypeCode>(
  "NetworkAclIcmpTypeCode",
)({ Code: S.optional(S.Number), Type: S.optional(S.Number) }) {}
export class NetworkAclPortRange extends S.Class<NetworkAclPortRange>(
  "NetworkAclPortRange",
)({ From: S.optional(S.Number), To: S.optional(S.Number) }) {}
export class NetworkAclEntry extends S.Class<NetworkAclEntry>(
  "NetworkAclEntry",
)({
  IcmpTypeCode: S.optional(NetworkAclIcmpTypeCode),
  Protocol: S.String,
  PortRange: S.optional(NetworkAclPortRange),
  CidrBlock: S.optional(S.String),
  Ipv6CidrBlock: S.optional(S.String),
  RuleAction: S.String,
  Egress: S.Boolean,
}) {}
export const NetworkAclEntries = S.Array(NetworkAclEntry);
export class NetworkAclEntrySet extends S.Class<NetworkAclEntrySet>(
  "NetworkAclEntrySet",
)({
  FirstEntries: S.optional(NetworkAclEntries),
  ForceRemediateForFirstEntries: S.Boolean,
  LastEntries: S.optional(NetworkAclEntries),
  ForceRemediateForLastEntries: S.Boolean,
}) {}
export class NetworkAclCommonPolicy extends S.Class<NetworkAclCommonPolicy>(
  "NetworkAclCommonPolicy",
)({ NetworkAclEntrySet: NetworkAclEntrySet }) {}
export class PolicyOption extends S.Class<PolicyOption>("PolicyOption")({
  NetworkFirewallPolicy: S.optional(NetworkFirewallPolicy),
  ThirdPartyFirewallPolicy: S.optional(ThirdPartyFirewallPolicy),
  NetworkAclCommonPolicy: S.optional(NetworkAclCommonPolicy),
}) {}
export class SecurityServicePolicyData extends S.Class<SecurityServicePolicyData>(
  "SecurityServicePolicyData",
)({
  Type: S.String,
  ManagedServiceData: S.optional(S.String),
  PolicyOption: S.optional(PolicyOption),
}) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const ResourceTags = S.Array(ResourceTag);
export const CustomerPolicyScopeMap = S.Record({
  key: S.String,
  value: CustomerPolicyScopeIdList,
});
export class Policy extends S.Class<Policy>("Policy")({
  PolicyId: S.optional(S.String),
  PolicyName: S.String,
  PolicyUpdateToken: S.optional(S.String),
  SecurityServicePolicyData: SecurityServicePolicyData,
  ResourceType: S.String,
  ResourceTypeList: S.optional(ResourceTypeList),
  ResourceTags: S.optional(ResourceTags),
  ExcludeResourceTags: S.Boolean,
  RemediationEnabled: S.Boolean,
  DeleteUnusedFMManagedResources: S.optional(S.Boolean),
  IncludeMap: S.optional(CustomerPolicyScopeMap),
  ExcludeMap: S.optional(CustomerPolicyScopeMap),
  ResourceSetIds: S.optional(ResourceSetIds),
  PolicyDescription: S.optional(S.String),
  PolicyStatus: S.optional(S.String),
  ResourceTagLogicalOperator: S.optional(S.String),
}) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ Policy: S.optional(Policy), PolicyArn: S.optional(S.String) }) {}
export class GetProtectionStatusResponse extends S.Class<GetProtectionStatusResponse>(
  "GetProtectionStatusResponse",
)({
  AdminAccountId: S.optional(S.String),
  ServiceType: S.optional(S.String),
  Data: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export const PreviousProtocolsList = S.Record({
  key: S.String,
  value: ProtocolsList,
});
export class ProtocolsListData extends S.Class<ProtocolsListData>(
  "ProtocolsListData",
)({
  ListId: S.optional(S.String),
  ListName: S.String,
  ListUpdateToken: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProtocolsList: ProtocolsList,
  PreviousProtocolsList: S.optional(PreviousProtocolsList),
}) {}
export class GetProtocolsListResponse extends S.Class<GetProtocolsListResponse>(
  "GetProtocolsListResponse",
)({
  ProtocolsList: S.optional(ProtocolsListData),
  ProtocolsListArn: S.optional(S.String),
}) {}
export class GetResourceSetResponse extends S.Class<GetResourceSetResponse>(
  "GetResourceSetResponse",
)({ ResourceSet: ResourceSet, ResourceSetArn: S.String }) {}
export class GetThirdPartyFirewallAssociationStatusResponse extends S.Class<GetThirdPartyFirewallAssociationStatusResponse>(
  "GetThirdPartyFirewallAssociationStatusResponse",
)({
  ThirdPartyFirewallStatus: S.optional(S.String),
  MarketplaceOnboardingStatus: S.optional(S.String),
}) {}
export class ListAdminsManagingAccountResponse extends S.Class<ListAdminsManagingAccountResponse>(
  "ListAdminsManagingAccountResponse",
)({
  AdminAccounts: S.optional(AccountIdList),
  NextToken: S.optional(S.String),
}) {}
export class ListMemberAccountsResponse extends S.Class<ListMemberAccountsResponse>(
  "ListMemberAccountsResponse",
)({
  MemberAccounts: S.optional(MemberAccounts),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ TagList: S.optional(TagList) }) {}
export class PutResourceSetRequest extends S.Class<PutResourceSetRequest>(
  "PutResourceSetRequest",
)(
  { ResourceSet: ResourceSet, TagList: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AdminAccountSummary extends S.Class<AdminAccountSummary>(
  "AdminAccountSummary",
)({
  AdminAccount: S.optional(S.String),
  DefaultAdmin: S.optional(S.Boolean),
  Status: S.optional(S.String),
}) {}
export const AdminAccountSummaryList = S.Array(AdminAccountSummary);
export class AppsListDataSummary extends S.Class<AppsListDataSummary>(
  "AppsListDataSummary",
)({
  ListArn: S.optional(S.String),
  ListId: S.optional(S.String),
  ListName: S.optional(S.String),
  AppsList: S.optional(AppsList),
}) {}
export const AppsListsData = S.Array(AppsListDataSummary);
export class DiscoveredResource extends S.Class<DiscoveredResource>(
  "DiscoveredResource",
)({
  URI: S.optional(S.String),
  AccountId: S.optional(S.String),
  Type: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const DiscoveredResourceList = S.Array(DiscoveredResource);
export class PolicySummary extends S.Class<PolicySummary>("PolicySummary")({
  PolicyArn: S.optional(S.String),
  PolicyId: S.optional(S.String),
  PolicyName: S.optional(S.String),
  ResourceType: S.optional(S.String),
  SecurityServiceType: S.optional(S.String),
  RemediationEnabled: S.optional(S.Boolean),
  DeleteUnusedFMManagedResources: S.optional(S.Boolean),
  PolicyStatus: S.optional(S.String),
}) {}
export const PolicySummaryList = S.Array(PolicySummary);
export class ProtocolsListDataSummary extends S.Class<ProtocolsListDataSummary>(
  "ProtocolsListDataSummary",
)({
  ListArn: S.optional(S.String),
  ListId: S.optional(S.String),
  ListName: S.optional(S.String),
  ProtocolsList: S.optional(ProtocolsList),
}) {}
export const ProtocolsListsData = S.Array(ProtocolsListDataSummary);
export class Resource extends S.Class<Resource>("Resource")({
  URI: S.String,
  AccountId: S.optional(S.String),
}) {}
export const ResourceList = S.Array(Resource);
export class ResourceSetSummary extends S.Class<ResourceSetSummary>(
  "ResourceSetSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceSetStatus: S.optional(S.String),
}) {}
export const ResourceSetSummaryList = S.Array(ResourceSetSummary);
export class ThirdPartyFirewallFirewallPolicy extends S.Class<ThirdPartyFirewallFirewallPolicy>(
  "ThirdPartyFirewallFirewallPolicy",
)({
  FirewallPolicyId: S.optional(S.String),
  FirewallPolicyName: S.optional(S.String),
}) {}
export const ThirdPartyFirewallFirewallPolicies = S.Array(
  ThirdPartyFirewallFirewallPolicy,
);
export class BatchAssociateResourceResponse extends S.Class<BatchAssociateResourceResponse>(
  "BatchAssociateResourceResponse",
)({ ResourceSetIdentifier: S.String, FailedItems: FailedItemList }) {}
export class ListAdminAccountsForOrganizationResponse extends S.Class<ListAdminAccountsForOrganizationResponse>(
  "ListAdminAccountsForOrganizationResponse",
)({
  AdminAccounts: S.optional(AdminAccountSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppsListsResponse extends S.Class<ListAppsListsResponse>(
  "ListAppsListsResponse",
)({ AppsLists: S.optional(AppsListsData), NextToken: S.optional(S.String) }) {}
export class ListDiscoveredResourcesResponse extends S.Class<ListDiscoveredResourcesResponse>(
  "ListDiscoveredResourcesResponse",
)({
  Items: S.optional(DiscoveredResourceList),
  NextToken: S.optional(S.String),
}) {}
export class ListPoliciesResponse extends S.Class<ListPoliciesResponse>(
  "ListPoliciesResponse",
)({
  PolicyList: S.optional(PolicySummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListProtocolsListsResponse extends S.Class<ListProtocolsListsResponse>(
  "ListProtocolsListsResponse",
)({
  ProtocolsLists: S.optional(ProtocolsListsData),
  NextToken: S.optional(S.String),
}) {}
export class ListResourceSetResourcesResponse extends S.Class<ListResourceSetResourcesResponse>(
  "ListResourceSetResourcesResponse",
)({ Items: ResourceList, NextToken: S.optional(S.String) }) {}
export class ListResourceSetsResponse extends S.Class<ListResourceSetsResponse>(
  "ListResourceSetsResponse",
)({
  ResourceSets: S.optional(ResourceSetSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListThirdPartyFirewallFirewallPoliciesResponse extends S.Class<ListThirdPartyFirewallFirewallPoliciesResponse>(
  "ListThirdPartyFirewallFirewallPoliciesResponse",
)({
  ThirdPartyFirewallFirewallPolicies: S.optional(
    ThirdPartyFirewallFirewallPolicies,
  ),
  NextToken: S.optional(S.String),
}) {}
export class PutAdminAccountRequest extends S.Class<PutAdminAccountRequest>(
  "PutAdminAccountRequest",
)(
  { AdminAccount: S.String, AdminScope: S.optional(AdminScope) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAdminAccountResponse extends S.Class<PutAdminAccountResponse>(
  "PutAdminAccountResponse",
)({}) {}
export class PutAppsListRequest extends S.Class<PutAppsListRequest>(
  "PutAppsListRequest",
)(
  { AppsList: AppsListData, TagList: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutProtocolsListRequest extends S.Class<PutProtocolsListRequest>(
  "PutProtocolsListRequest",
)(
  { ProtocolsList: ProtocolsListData, TagList: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourceSetResponse extends S.Class<PutResourceSetResponse>(
  "PutResourceSetResponse",
)({ ResourceSet: ResourceSet, ResourceSetArn: S.String }) {}
export const IssueInfoMap = S.Record({ key: S.String, value: S.String });
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({
  ComplianceStatus: S.optional(S.String),
  ViolatorCount: S.optional(S.Number),
  EvaluationLimitExceeded: S.optional(S.Boolean),
}) {}
export const EvaluationResults = S.Array(EvaluationResult);
export const ResourceIdList = S.Array(S.String);
export class AwsEc2NetworkInterfaceViolation extends S.Class<AwsEc2NetworkInterfaceViolation>(
  "AwsEc2NetworkInterfaceViolation",
)({
  ViolationTarget: S.optional(S.String),
  ViolatingSecurityGroups: S.optional(ResourceIdList),
}) {}
export const AwsEc2NetworkInterfaceViolations = S.Array(
  AwsEc2NetworkInterfaceViolation,
);
export const DnsRuleGroupPriorities = S.Array(S.Number);
export const ResourceArnList = S.Array(S.String);
export class PolicyComplianceStatus extends S.Class<PolicyComplianceStatus>(
  "PolicyComplianceStatus",
)({
  PolicyOwner: S.optional(S.String),
  PolicyId: S.optional(S.String),
  PolicyName: S.optional(S.String),
  MemberAccount: S.optional(S.String),
  EvaluationResults: S.optional(EvaluationResults),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IssueInfoMap: S.optional(IssueInfoMap),
}) {}
export const PolicyComplianceStatusList = S.Array(PolicyComplianceStatus);
export const ComplianceViolatorMetadata = S.Record({
  key: S.String,
  value: S.String,
});
export class AwsEc2InstanceViolation extends S.Class<AwsEc2InstanceViolation>(
  "AwsEc2InstanceViolation",
)({
  ViolationTarget: S.optional(S.String),
  AwsEc2NetworkInterfaceViolations: S.optional(
    AwsEc2NetworkInterfaceViolations,
  ),
}) {}
export class NetworkFirewallMissingFirewallViolation extends S.Class<NetworkFirewallMissingFirewallViolation>(
  "NetworkFirewallMissingFirewallViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  TargetViolationReason: S.optional(S.String),
}) {}
export class NetworkFirewallMissingSubnetViolation extends S.Class<NetworkFirewallMissingSubnetViolation>(
  "NetworkFirewallMissingSubnetViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  TargetViolationReason: S.optional(S.String),
}) {}
export class NetworkFirewallMissingExpectedRTViolation extends S.Class<NetworkFirewallMissingExpectedRTViolation>(
  "NetworkFirewallMissingExpectedRTViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  CurrentRouteTable: S.optional(S.String),
  ExpectedRouteTable: S.optional(S.String),
}) {}
export class Route extends S.Class<Route>("Route")({
  DestinationType: S.optional(S.String),
  TargetType: S.optional(S.String),
  Destination: S.optional(S.String),
  Target: S.optional(S.String),
}) {}
export const LengthBoundedStringList = S.Array(S.String);
export class ExpectedRoute extends S.Class<ExpectedRoute>("ExpectedRoute")({
  IpV4Cidr: S.optional(S.String),
  PrefixListId: S.optional(S.String),
  IpV6Cidr: S.optional(S.String),
  ContributingSubnets: S.optional(ResourceIdList),
  AllowedTargets: S.optional(LengthBoundedStringList),
  RouteTableId: S.optional(S.String),
}) {}
export const ExpectedRoutes = S.Array(ExpectedRoute);
export const Routes = S.Array(Route);
export class NetworkFirewallInvalidRouteConfigurationViolation extends S.Class<NetworkFirewallInvalidRouteConfigurationViolation>(
  "NetworkFirewallInvalidRouteConfigurationViolation",
)({
  AffectedSubnets: S.optional(ResourceIdList),
  RouteTableId: S.optional(S.String),
  IsRouteTableUsedInDifferentAZ: S.optional(S.Boolean),
  ViolatingRoute: S.optional(Route),
  CurrentFirewallSubnetRouteTable: S.optional(S.String),
  ExpectedFirewallEndpoint: S.optional(S.String),
  ActualFirewallEndpoint: S.optional(S.String),
  ExpectedFirewallSubnetId: S.optional(S.String),
  ActualFirewallSubnetId: S.optional(S.String),
  ExpectedFirewallSubnetRoutes: S.optional(ExpectedRoutes),
  ActualFirewallSubnetRoutes: S.optional(Routes),
  InternetGatewayId: S.optional(S.String),
  CurrentInternetGatewayRouteTable: S.optional(S.String),
  ExpectedInternetGatewayRoutes: S.optional(ExpectedRoutes),
  ActualInternetGatewayRoutes: S.optional(Routes),
  VpcId: S.optional(S.String),
}) {}
export class NetworkFirewallBlackHoleRouteDetectedViolation extends S.Class<NetworkFirewallBlackHoleRouteDetectedViolation>(
  "NetworkFirewallBlackHoleRouteDetectedViolation",
)({
  ViolationTarget: S.optional(S.String),
  RouteTableId: S.optional(S.String),
  VpcId: S.optional(S.String),
  ViolatingRoutes: S.optional(Routes),
}) {}
export class NetworkFirewallUnexpectedFirewallRoutesViolation extends S.Class<NetworkFirewallUnexpectedFirewallRoutesViolation>(
  "NetworkFirewallUnexpectedFirewallRoutesViolation",
)({
  FirewallSubnetId: S.optional(S.String),
  ViolatingRoutes: S.optional(Routes),
  RouteTableId: S.optional(S.String),
  FirewallEndpoint: S.optional(S.String),
  VpcId: S.optional(S.String),
}) {}
export class NetworkFirewallUnexpectedGatewayRoutesViolation extends S.Class<NetworkFirewallUnexpectedGatewayRoutesViolation>(
  "NetworkFirewallUnexpectedGatewayRoutesViolation",
)({
  GatewayId: S.optional(S.String),
  ViolatingRoutes: S.optional(Routes),
  RouteTableId: S.optional(S.String),
  VpcId: S.optional(S.String),
}) {}
export class NetworkFirewallMissingExpectedRoutesViolation extends S.Class<NetworkFirewallMissingExpectedRoutesViolation>(
  "NetworkFirewallMissingExpectedRoutesViolation",
)({
  ViolationTarget: S.optional(S.String),
  ExpectedRoutes: S.optional(ExpectedRoutes),
  VpcId: S.optional(S.String),
}) {}
export class DnsRuleGroupPriorityConflictViolation extends S.Class<DnsRuleGroupPriorityConflictViolation>(
  "DnsRuleGroupPriorityConflictViolation",
)({
  ViolationTarget: S.optional(S.String),
  ViolationTargetDescription: S.optional(S.String),
  ConflictingPriority: S.optional(S.Number),
  ConflictingPolicyId: S.optional(S.String),
  UnavailablePriorities: S.optional(DnsRuleGroupPriorities),
}) {}
export class DnsDuplicateRuleGroupViolation extends S.Class<DnsDuplicateRuleGroupViolation>(
  "DnsDuplicateRuleGroupViolation",
)({
  ViolationTarget: S.optional(S.String),
  ViolationTargetDescription: S.optional(S.String),
}) {}
export class DnsRuleGroupLimitExceededViolation extends S.Class<DnsRuleGroupLimitExceededViolation>(
  "DnsRuleGroupLimitExceededViolation",
)({
  ViolationTarget: S.optional(S.String),
  ViolationTargetDescription: S.optional(S.String),
  NumberOfRuleGroupsAlreadyAssociated: S.optional(S.Number),
}) {}
export class FirewallSubnetIsOutOfScopeViolation extends S.Class<FirewallSubnetIsOutOfScopeViolation>(
  "FirewallSubnetIsOutOfScopeViolation",
)({
  FirewallSubnetId: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(S.String),
  SubnetAvailabilityZoneId: S.optional(S.String),
  VpcEndpointId: S.optional(S.String),
}) {}
export class RouteHasOutOfScopeEndpointViolation extends S.Class<RouteHasOutOfScopeEndpointViolation>(
  "RouteHasOutOfScopeEndpointViolation",
)({
  SubnetId: S.optional(S.String),
  VpcId: S.optional(S.String),
  RouteTableId: S.optional(S.String),
  ViolatingRoutes: S.optional(Routes),
  SubnetAvailabilityZone: S.optional(S.String),
  SubnetAvailabilityZoneId: S.optional(S.String),
  CurrentFirewallSubnetRouteTable: S.optional(S.String),
  FirewallSubnetId: S.optional(S.String),
  FirewallSubnetRoutes: S.optional(Routes),
  InternetGatewayId: S.optional(S.String),
  CurrentInternetGatewayRouteTable: S.optional(S.String),
  InternetGatewayRoutes: S.optional(Routes),
}) {}
export class ThirdPartyFirewallMissingFirewallViolation extends S.Class<ThirdPartyFirewallMissingFirewallViolation>(
  "ThirdPartyFirewallMissingFirewallViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  TargetViolationReason: S.optional(S.String),
}) {}
export class ThirdPartyFirewallMissingSubnetViolation extends S.Class<ThirdPartyFirewallMissingSubnetViolation>(
  "ThirdPartyFirewallMissingSubnetViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  TargetViolationReason: S.optional(S.String),
}) {}
export class ThirdPartyFirewallMissingExpectedRouteTableViolation extends S.Class<ThirdPartyFirewallMissingExpectedRouteTableViolation>(
  "ThirdPartyFirewallMissingExpectedRouteTableViolation",
)({
  ViolationTarget: S.optional(S.String),
  VPC: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  CurrentRouteTable: S.optional(S.String),
  ExpectedRouteTable: S.optional(S.String),
}) {}
export class FirewallSubnetMissingVPCEndpointViolation extends S.Class<FirewallSubnetMissingVPCEndpointViolation>(
  "FirewallSubnetMissingVPCEndpointViolation",
)({
  FirewallSubnetId: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(S.String),
  SubnetAvailabilityZoneId: S.optional(S.String),
}) {}
export class WebACLHasIncompatibleConfigurationViolation extends S.Class<WebACLHasIncompatibleConfigurationViolation>(
  "WebACLHasIncompatibleConfigurationViolation",
)({ WebACLArn: S.optional(S.String), Description: S.optional(S.String) }) {}
export class WebACLHasOutOfScopeResourcesViolation extends S.Class<WebACLHasOutOfScopeResourcesViolation>(
  "WebACLHasOutOfScopeResourcesViolation",
)({
  WebACLArn: S.optional(S.String),
  OutOfScopeResourceList: S.optional(ResourceArnList),
}) {}
export const TargetViolationReasons = S.Array(S.String);
export const NetworkFirewallActionList = S.Array(S.String);
export class EntryDescription extends S.Class<EntryDescription>(
  "EntryDescription",
)({
  EntryDetail: S.optional(NetworkAclEntry),
  EntryRuleNumber: S.optional(S.Number),
  EntryType: S.optional(S.String),
}) {}
export const EntriesWithConflicts = S.Array(EntryDescription);
export const EntryViolationReasons = S.Array(S.String);
export class ListComplianceStatusResponse extends S.Class<ListComplianceStatusResponse>(
  "ListComplianceStatusResponse",
)({
  PolicyComplianceStatusList: S.optional(PolicyComplianceStatusList),
  NextToken: S.optional(S.String),
}) {}
export class PutAppsListResponse extends S.Class<PutAppsListResponse>(
  "PutAppsListResponse",
)({ AppsList: S.optional(AppsListData), AppsListArn: S.optional(S.String) }) {}
export class PutProtocolsListResponse extends S.Class<PutProtocolsListResponse>(
  "PutProtocolsListResponse",
)({
  ProtocolsList: S.optional(ProtocolsListData),
  ProtocolsListArn: S.optional(S.String),
}) {}
export class ComplianceViolator extends S.Class<ComplianceViolator>(
  "ComplianceViolator",
)({
  ResourceId: S.optional(S.String),
  ViolationReason: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Metadata: S.optional(ComplianceViolatorMetadata),
}) {}
export const ComplianceViolators = S.Array(ComplianceViolator);
export class PartialMatch extends S.Class<PartialMatch>("PartialMatch")({
  Reference: S.optional(S.String),
  TargetViolationReasons: S.optional(TargetViolationReasons),
}) {}
export const PartialMatches = S.Array(PartialMatch);
export class PolicyComplianceDetail extends S.Class<PolicyComplianceDetail>(
  "PolicyComplianceDetail",
)({
  PolicyOwner: S.optional(S.String),
  PolicyId: S.optional(S.String),
  MemberAccount: S.optional(S.String),
  Violators: S.optional(ComplianceViolators),
  EvaluationLimitExceeded: S.optional(S.Boolean),
  ExpiredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IssueInfoMap: S.optional(IssueInfoMap),
}) {}
export class NetworkFirewallInternetTrafficNotInspectedViolation extends S.Class<NetworkFirewallInternetTrafficNotInspectedViolation>(
  "NetworkFirewallInternetTrafficNotInspectedViolation",
)({
  SubnetId: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(S.String),
  RouteTableId: S.optional(S.String),
  ViolatingRoutes: S.optional(Routes),
  IsRouteTableUsedInDifferentAZ: S.optional(S.Boolean),
  CurrentFirewallSubnetRouteTable: S.optional(S.String),
  ExpectedFirewallEndpoint: S.optional(S.String),
  FirewallSubnetId: S.optional(S.String),
  ExpectedFirewallSubnetRoutes: S.optional(ExpectedRoutes),
  ActualFirewallSubnetRoutes: S.optional(Routes),
  InternetGatewayId: S.optional(S.String),
  CurrentInternetGatewayRouteTable: S.optional(S.String),
  ExpectedInternetGatewayRoutes: S.optional(ExpectedRoutes),
  ActualInternetGatewayRoutes: S.optional(Routes),
  VpcId: S.optional(S.String),
}) {}
export class GetComplianceDetailResponse extends S.Class<GetComplianceDetailResponse>(
  "GetComplianceDetailResponse",
)({ PolicyComplianceDetail: S.optional(PolicyComplianceDetail) }) {}
export class SecurityGroupRuleDescription extends S.Class<SecurityGroupRuleDescription>(
  "SecurityGroupRuleDescription",
)({
  IPV4Range: S.optional(S.String),
  IPV6Range: S.optional(S.String),
  PrefixListId: S.optional(S.String),
  Protocol: S.optional(S.String),
  FromPort: S.optional(S.Number),
  ToPort: S.optional(S.Number),
}) {}
export class StatelessRuleGroup extends S.Class<StatelessRuleGroup>(
  "StatelessRuleGroup",
)({
  RuleGroupName: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const StatelessRuleGroupList = S.Array(StatelessRuleGroup);
export class StatefulEngineOptions extends S.Class<StatefulEngineOptions>(
  "StatefulEngineOptions",
)({
  RuleOrder: S.optional(S.String),
  StreamExceptionPolicy: S.optional(S.String),
}) {}
export class SecurityGroupRemediationAction extends S.Class<SecurityGroupRemediationAction>(
  "SecurityGroupRemediationAction",
)({
  RemediationActionType: S.optional(S.String),
  Description: S.optional(S.String),
  RemediationResult: S.optional(SecurityGroupRuleDescription),
  IsDefaultAction: S.optional(S.Boolean),
}) {}
export const SecurityGroupRemediationActions = S.Array(
  SecurityGroupRemediationAction,
);
export class EntryViolation extends S.Class<EntryViolation>("EntryViolation")({
  ExpectedEntry: S.optional(EntryDescription),
  ExpectedEvaluationOrder: S.optional(S.String),
  ActualEvaluationOrder: S.optional(S.String),
  EntryAtExpectedEvaluationOrder: S.optional(EntryDescription),
  EntriesWithConflicts: S.optional(EntriesWithConflicts),
  EntryViolationReasons: S.optional(EntryViolationReasons),
}) {}
export const EntryViolations = S.Array(EntryViolation);
export class NetworkFirewallStatefulRuleGroupOverride extends S.Class<NetworkFirewallStatefulRuleGroupOverride>(
  "NetworkFirewallStatefulRuleGroupOverride",
)({ Action: S.optional(S.String) }) {}
export class AwsVPCSecurityGroupViolation extends S.Class<AwsVPCSecurityGroupViolation>(
  "AwsVPCSecurityGroupViolation",
)({
  ViolationTarget: S.optional(S.String),
  ViolationTargetDescription: S.optional(S.String),
  PartialMatches: S.optional(PartialMatches),
  PossibleSecurityGroupRemediationActions: S.optional(
    SecurityGroupRemediationActions,
  ),
}) {}
export class InvalidNetworkAclEntriesViolation extends S.Class<InvalidNetworkAclEntriesViolation>(
  "InvalidNetworkAclEntriesViolation",
)({
  Vpc: S.optional(S.String),
  Subnet: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(S.String),
  CurrentAssociatedNetworkAcl: S.optional(S.String),
  EntryViolations: S.optional(EntryViolations),
}) {}
export const EntriesDescription = S.Array(EntryDescription);
export class StatefulRuleGroup extends S.Class<StatefulRuleGroup>(
  "StatefulRuleGroup",
)({
  RuleGroupName: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Priority: S.optional(S.Number),
  Override: S.optional(NetworkFirewallStatefulRuleGroupOverride),
}) {}
export const StatefulRuleGroupList = S.Array(StatefulRuleGroup);
export class ActionTarget extends S.Class<ActionTarget>("ActionTarget")({
  ResourceId: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class EC2ReplaceRouteAction extends S.Class<EC2ReplaceRouteAction>(
  "EC2ReplaceRouteAction",
)({
  Description: S.optional(S.String),
  DestinationCidrBlock: S.optional(S.String),
  DestinationPrefixListId: S.optional(S.String),
  DestinationIpv6CidrBlock: S.optional(S.String),
  GatewayId: S.optional(ActionTarget),
  RouteTableId: ActionTarget,
}) {}
export class EC2DeleteRouteAction extends S.Class<EC2DeleteRouteAction>(
  "EC2DeleteRouteAction",
)({
  Description: S.optional(S.String),
  DestinationCidrBlock: S.optional(S.String),
  DestinationPrefixListId: S.optional(S.String),
  DestinationIpv6CidrBlock: S.optional(S.String),
  RouteTableId: ActionTarget,
}) {}
export class EC2CopyRouteTableAction extends S.Class<EC2CopyRouteTableAction>(
  "EC2CopyRouteTableAction",
)({
  Description: S.optional(S.String),
  VpcId: ActionTarget,
  RouteTableId: ActionTarget,
}) {}
export class EC2ReplaceRouteTableAssociationAction extends S.Class<EC2ReplaceRouteTableAssociationAction>(
  "EC2ReplaceRouteTableAssociationAction",
)({
  Description: S.optional(S.String),
  AssociationId: ActionTarget,
  RouteTableId: ActionTarget,
}) {}
export class EC2AssociateRouteTableAction extends S.Class<EC2AssociateRouteTableAction>(
  "EC2AssociateRouteTableAction",
)({
  Description: S.optional(S.String),
  RouteTableId: ActionTarget,
  SubnetId: S.optional(ActionTarget),
  GatewayId: S.optional(ActionTarget),
}) {}
export class EC2CreateRouteTableAction extends S.Class<EC2CreateRouteTableAction>(
  "EC2CreateRouteTableAction",
)({ Description: S.optional(S.String), VpcId: ActionTarget }) {}
export class FMSPolicyUpdateFirewallCreationConfigAction extends S.Class<FMSPolicyUpdateFirewallCreationConfigAction>(
  "FMSPolicyUpdateFirewallCreationConfigAction",
)({
  Description: S.optional(S.String),
  FirewallCreationConfig: S.optional(S.String),
}) {}
export class CreateNetworkAclAction extends S.Class<CreateNetworkAclAction>(
  "CreateNetworkAclAction",
)({
  Description: S.optional(S.String),
  Vpc: S.optional(ActionTarget),
  FMSCanRemediate: S.optional(S.Boolean),
}) {}
export class ReplaceNetworkAclAssociationAction extends S.Class<ReplaceNetworkAclAssociationAction>(
  "ReplaceNetworkAclAssociationAction",
)({
  Description: S.optional(S.String),
  AssociationId: S.optional(ActionTarget),
  NetworkAclId: S.optional(ActionTarget),
  FMSCanRemediate: S.optional(S.Boolean),
}) {}
export class CreateNetworkAclEntriesAction extends S.Class<CreateNetworkAclEntriesAction>(
  "CreateNetworkAclEntriesAction",
)({
  Description: S.optional(S.String),
  NetworkAclId: S.optional(ActionTarget),
  NetworkAclEntriesToBeCreated: S.optional(EntriesDescription),
  FMSCanRemediate: S.optional(S.Boolean),
}) {}
export class DeleteNetworkAclEntriesAction extends S.Class<DeleteNetworkAclEntriesAction>(
  "DeleteNetworkAclEntriesAction",
)({
  Description: S.optional(S.String),
  NetworkAclId: S.optional(ActionTarget),
  NetworkAclEntriesToBeDeleted: S.optional(EntriesDescription),
  FMSCanRemediate: S.optional(S.Boolean),
}) {}
export class NetworkFirewallPolicyDescription extends S.Class<NetworkFirewallPolicyDescription>(
  "NetworkFirewallPolicyDescription",
)({
  StatelessRuleGroups: S.optional(StatelessRuleGroupList),
  StatelessDefaultActions: S.optional(NetworkFirewallActionList),
  StatelessFragmentDefaultActions: S.optional(NetworkFirewallActionList),
  StatelessCustomActions: S.optional(NetworkFirewallActionList),
  StatefulRuleGroups: S.optional(StatefulRuleGroupList),
  StatefulDefaultActions: S.optional(NetworkFirewallActionList),
  StatefulEngineOptions: S.optional(StatefulEngineOptions),
}) {}
export class NetworkFirewallPolicyModifiedViolation extends S.Class<NetworkFirewallPolicyModifiedViolation>(
  "NetworkFirewallPolicyModifiedViolation",
)({
  ViolationTarget: S.optional(S.String),
  CurrentPolicyDescription: S.optional(NetworkFirewallPolicyDescription),
  ExpectedPolicyDescription: S.optional(NetworkFirewallPolicyDescription),
}) {}
export class EC2CreateRouteAction extends S.Class<EC2CreateRouteAction>(
  "EC2CreateRouteAction",
)({
  Description: S.optional(S.String),
  DestinationCidrBlock: S.optional(S.String),
  DestinationPrefixListId: S.optional(S.String),
  DestinationIpv6CidrBlock: S.optional(S.String),
  VpcEndpointId: S.optional(ActionTarget),
  GatewayId: S.optional(ActionTarget),
  RouteTableId: ActionTarget,
}) {}
export class RemediationAction extends S.Class<RemediationAction>(
  "RemediationAction",
)({
  Description: S.optional(S.String),
  EC2CreateRouteAction: S.optional(EC2CreateRouteAction),
  EC2ReplaceRouteAction: S.optional(EC2ReplaceRouteAction),
  EC2DeleteRouteAction: S.optional(EC2DeleteRouteAction),
  EC2CopyRouteTableAction: S.optional(EC2CopyRouteTableAction),
  EC2ReplaceRouteTableAssociationAction: S.optional(
    EC2ReplaceRouteTableAssociationAction,
  ),
  EC2AssociateRouteTableAction: S.optional(EC2AssociateRouteTableAction),
  EC2CreateRouteTableAction: S.optional(EC2CreateRouteTableAction),
  FMSPolicyUpdateFirewallCreationConfigAction: S.optional(
    FMSPolicyUpdateFirewallCreationConfigAction,
  ),
  CreateNetworkAclAction: S.optional(CreateNetworkAclAction),
  ReplaceNetworkAclAssociationAction: S.optional(
    ReplaceNetworkAclAssociationAction,
  ),
  CreateNetworkAclEntriesAction: S.optional(CreateNetworkAclEntriesAction),
  DeleteNetworkAclEntriesAction: S.optional(DeleteNetworkAclEntriesAction),
}) {}
export class RemediationActionWithOrder extends S.Class<RemediationActionWithOrder>(
  "RemediationActionWithOrder",
)({
  RemediationAction: S.optional(RemediationAction),
  Order: S.optional(S.Number),
}) {}
export const OrderedRemediationActions = S.Array(RemediationActionWithOrder);
export class PutPolicyRequest extends S.Class<PutPolicyRequest>(
  "PutPolicyRequest",
)(
  { Policy: Policy, TagList: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PossibleRemediationAction extends S.Class<PossibleRemediationAction>(
  "PossibleRemediationAction",
)({
  Description: S.optional(S.String),
  OrderedRemediationActions: OrderedRemediationActions,
  IsDefaultAction: S.optional(S.Boolean),
}) {}
export const PossibleRemediationActionList = S.Array(PossibleRemediationAction);
export class PossibleRemediationActions extends S.Class<PossibleRemediationActions>(
  "PossibleRemediationActions",
)({
  Description: S.optional(S.String),
  Actions: S.optional(PossibleRemediationActionList),
}) {}
export class PutPolicyResponse extends S.Class<PutPolicyResponse>(
  "PutPolicyResponse",
)({ Policy: S.optional(Policy), PolicyArn: S.optional(S.String) }) {}
export class ResourceViolation extends S.Class<ResourceViolation>(
  "ResourceViolation",
)({
  AwsVPCSecurityGroupViolation: S.optional(AwsVPCSecurityGroupViolation),
  AwsEc2NetworkInterfaceViolation: S.optional(AwsEc2NetworkInterfaceViolation),
  AwsEc2InstanceViolation: S.optional(AwsEc2InstanceViolation),
  NetworkFirewallMissingFirewallViolation: S.optional(
    NetworkFirewallMissingFirewallViolation,
  ),
  NetworkFirewallMissingSubnetViolation: S.optional(
    NetworkFirewallMissingSubnetViolation,
  ),
  NetworkFirewallMissingExpectedRTViolation: S.optional(
    NetworkFirewallMissingExpectedRTViolation,
  ),
  NetworkFirewallPolicyModifiedViolation: S.optional(
    NetworkFirewallPolicyModifiedViolation,
  ),
  NetworkFirewallInternetTrafficNotInspectedViolation: S.optional(
    NetworkFirewallInternetTrafficNotInspectedViolation,
  ),
  NetworkFirewallInvalidRouteConfigurationViolation: S.optional(
    NetworkFirewallInvalidRouteConfigurationViolation,
  ),
  NetworkFirewallBlackHoleRouteDetectedViolation: S.optional(
    NetworkFirewallBlackHoleRouteDetectedViolation,
  ),
  NetworkFirewallUnexpectedFirewallRoutesViolation: S.optional(
    NetworkFirewallUnexpectedFirewallRoutesViolation,
  ),
  NetworkFirewallUnexpectedGatewayRoutesViolation: S.optional(
    NetworkFirewallUnexpectedGatewayRoutesViolation,
  ),
  NetworkFirewallMissingExpectedRoutesViolation: S.optional(
    NetworkFirewallMissingExpectedRoutesViolation,
  ),
  DnsRuleGroupPriorityConflictViolation: S.optional(
    DnsRuleGroupPriorityConflictViolation,
  ),
  DnsDuplicateRuleGroupViolation: S.optional(DnsDuplicateRuleGroupViolation),
  DnsRuleGroupLimitExceededViolation: S.optional(
    DnsRuleGroupLimitExceededViolation,
  ),
  FirewallSubnetIsOutOfScopeViolation: S.optional(
    FirewallSubnetIsOutOfScopeViolation,
  ),
  RouteHasOutOfScopeEndpointViolation: S.optional(
    RouteHasOutOfScopeEndpointViolation,
  ),
  ThirdPartyFirewallMissingFirewallViolation: S.optional(
    ThirdPartyFirewallMissingFirewallViolation,
  ),
  ThirdPartyFirewallMissingSubnetViolation: S.optional(
    ThirdPartyFirewallMissingSubnetViolation,
  ),
  ThirdPartyFirewallMissingExpectedRouteTableViolation: S.optional(
    ThirdPartyFirewallMissingExpectedRouteTableViolation,
  ),
  FirewallSubnetMissingVPCEndpointViolation: S.optional(
    FirewallSubnetMissingVPCEndpointViolation,
  ),
  InvalidNetworkAclEntriesViolation: S.optional(
    InvalidNetworkAclEntriesViolation,
  ),
  PossibleRemediationActions: S.optional(PossibleRemediationActions),
  WebACLHasIncompatibleConfigurationViolation: S.optional(
    WebACLHasIncompatibleConfigurationViolation,
  ),
  WebACLHasOutOfScopeResourcesViolation: S.optional(
    WebACLHasOutOfScopeResourcesViolation,
  ),
}) {}
export const ResourceViolations = S.Array(ResourceViolation);
export class ViolationDetail extends S.Class<ViolationDetail>(
  "ViolationDetail",
)({
  PolicyId: S.String,
  MemberAccount: S.String,
  ResourceId: S.String,
  ResourceType: S.String,
  ResourceViolations: ResourceViolations,
  ResourceTags: S.optional(TagList),
  ResourceDescription: S.optional(S.String),
}) {}
export class GetViolationDetailsResponse extends S.Class<GetViolationDetailsResponse>(
  "GetViolationDetailsResponse",
)({ ViolationDetail: S.optional(ViolationDetail) }) {}

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidTypeException extends S.TaggedError<InvalidTypeException>()(
  "InvalidTypeException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes an Firewall Manager association with the IAM role and the Amazon Simple
 * Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
 */
export const deleteNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteNotificationChannelRequest,
    output: DeleteNotificationChannelResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Permanently deletes an Firewall Manager policy.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified Firewall Manager policy.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidTypeException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a `AdminAccounts` object that lists the Firewall Manager administrators within the organization that are onboarded to Firewall Manager by AssociateAdminAccount.
 *
 * This operation can be called only from the organization's management account.
 */
export const listAdminAccountsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAdminAccountsForOrganizationRequest,
    output: ListAdminAccountsForOrganizationResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns an array of `AppsListDataSummary` objects.
 */
export const listAppsLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppsListsRequest,
  output: ListAppsListsResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of resources in the organization's accounts that are available to be associated with a resource set.
 */
export const listDiscoveredResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDiscoveredResourcesRequest,
    output: ListDiscoveredResourcesResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
    ],
  }),
);
/**
 * Returns an array of `PolicySummary` objects.
 */
export const listPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPoliciesRequest,
  output: ListPoliciesResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of `ProtocolsListDataSummary` objects.
 */
export const listProtocolsLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProtocolsListsRequest,
  output: ListProtocolsListsResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an array of resources that are currently associated to a resource set.
 */
export const listResourceSetResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceSetResourcesRequest,
    output: ListResourceSetResourcesResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns an array of `ResourceSetSummary` objects.
 */
export const listResourceSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourceSetsRequest,
  output: ListResourceSetsResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
  ],
}));
/**
 * Retrieves a list of all of the third-party firewall policies that are associated with the third-party firewall administrator's account.
 */
export const listThirdPartyFirewallFirewallPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListThirdPartyFirewallFirewallPoliciesRequest,
    output: ListThirdPartyFirewallFirewallPoliciesResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Creates or updates an Firewall Manager administrator account. The account must be a member of the organization that was onboarded to Firewall Manager by AssociateAdminAccount. Only the organization's management account can create an Firewall Manager administrator account. When you create an Firewall Manager administrator account, the service checks to see if the account is already a delegated administrator within Organizations. If the account isn't a delegated administrator, Firewall Manager calls Organizations to delegate the account within Organizations. For more information about administrator accounts within Organizations, see
 * Managing the Amazon Web Services Accounts in Your Organization.
 */
export const putAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAdminAccountRequest,
  output: PutAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
  ],
}));
/**
 * Creates the resource set.
 *
 * An Firewall Manager resource set defines the resources to import into an Firewall Manager policy from another Amazon Web Services service.
 */
export const putResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceSetRequest,
  output: PutResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
  ],
}));
/**
 * Disassociates a Firewall Manager policy administrator from a third-party firewall tenant. When you call `DisassociateThirdPartyFirewall`, the third-party firewall vendor deletes all of the firewalls that are associated with the account.
 */
export const disassociateThirdPartyFirewall =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateThirdPartyFirewallRequest,
    output: DisassociateThirdPartyFirewallResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns information about the specified Firewall Manager applications list.
 */
export const getAppsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppsListRequest,
  output: GetAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * If you created a Shield Advanced policy, returns policy-level attack summary information
 * in the event of a potential DDoS attack. Other policy types are currently unsupported.
 */
export const getProtectionStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtectionStatusRequest,
  output: GetProtectionStatusResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the specified Firewall Manager protocols list.
 */
export const getProtocolsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProtocolsListRequest,
  output: GetProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets information about a specific resource set.
 */
export const getResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSetRequest,
  output: GetResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * The onboarding status of a Firewall Manager admin account to third-party firewall vendor tenant.
 */
export const getThirdPartyFirewallAssociationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetThirdPartyFirewallAssociationStatusRequest,
    output: GetThirdPartyFirewallAssociationStatusResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Lists the accounts that are managing the specified Organizations member account. This is useful for any member account so that they can view the accounts who are managing their account. This operation only returns the managing administrators that have the requested account within their AdminScope.
 */
export const listAdminsManagingAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAdminsManagingAccountRequest,
    output: ListAdminsManagingAccountResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a `MemberAccounts` object that lists the member accounts in the
 * administrator's Amazon Web Services organization.
 *
 * Either an Firewall Manager administrator or the organization's management account can make this request.
 */
export const listMemberAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMemberAccountsRequest,
  output: ListMemberAccountsResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));
/**
 * Retrieves the list of tags for the specified Amazon Web Services resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Permanently deletes an Firewall Manager protocols list.
 */
export const deleteProtocolsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProtocolsListRequest,
  output: DeleteProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the Organizations account that is associated with Firewall Manager
 * as the Firewall Manager default administrator.
 */
export const getAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdminAccountRequest,
  output: GetAdminAccountResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Information
 * about the Amazon Simple Notification Service (SNS) topic that is used to
 * record Firewall Manager SNS logs.
 */
export const getNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetNotificationChannelRequest,
    output: GetNotificationChannelResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Designates the IAM role and Amazon Simple Notification Service (SNS) topic that
 * Firewall Manager uses to record SNS logs.
 *
 * To perform this action outside of the console, you must first configure the SNS topic's access policy to allow the `SnsRoleName` to publish SNS logs. If the `SnsRoleName` provided is a role other than the `AWSServiceRoleForFMS` service-linked role, this role must have a trust relationship configured to allow the Firewall Manager service principal `fms.amazonaws.com` to assume this role. For information about configuring an SNS access policy, see
 * Service roles for Firewall Manager in the *Firewall Manager Developer Guide*.
 */
export const putNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutNotificationChannelRequest,
    output: PutNotificationChannelResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disassociates an Firewall Manager administrator account. To set a different account as an Firewall Manager administrator, submit a PutAdminAccount request. To set an account as a default administrator account, you must submit an AssociateAdminAccount request.
 *
 * Disassociation of the default administrator account follows the first in, last out principle. If you are the default administrator, all Firewall Manager administrators within the organization must first disassociate their accounts before you can disassociate your account.
 */
export const disassociateAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateAdminAccountRequest,
    output: DisassociateAdminAccountResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Permanently deletes an Firewall Manager applications list.
 */
export const deleteAppsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppsListRequest,
  output: DeleteAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified ResourceSet.
 */
export const deleteResourceSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceSetRequest,
  output: DeleteResourceSetResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from an Amazon Web Services resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Sets the Firewall Manager policy administrator as a tenant administrator of a third-party firewall service. A tenant is an instance of the third-party firewall service that's associated with your Amazon Web Services customer account.
 */
export const associateThirdPartyFirewall = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateThirdPartyFirewallRequest,
    output: AssociateThirdPartyFirewallResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disassociates resources from a Firewall Manager resource set.
 */
export const batchDisassociateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDisassociateResourceRequest,
    output: BatchDisassociateResourceResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns information about the specified account's administrative scope. The administrative scope defines the resources that an Firewall Manager administrator can manage.
 */
export const getAdminScope = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdminScopeRequest,
  output: GetAdminScopeResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more tags to an Amazon Web Services resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Sets a Firewall Manager default administrator account. The Firewall Manager default administrator account can manage third-party firewalls and has full administrative scope that allows administration of all policy types, accounts, organizational units, and Regions. This account must be a member account of the organization in Organizations whose resources you want to protect.
 *
 * For information about working with Firewall Manager administrator accounts, see Managing Firewall Manager administrators in the *Firewall Manager Developer Guide*.
 */
export const associateAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateAdminAccountRequest,
    output: AssociateAdminAccountResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Associate resources to a Firewall Manager resource set.
 */
export const batchAssociateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchAssociateResourceRequest,
    output: BatchAssociateResourceResponse,
    errors: [
      InternalErrorException,
      InvalidInputException,
      InvalidOperationException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns an array of `PolicyComplianceStatus` objects. Use
 * `PolicyComplianceStatus` to get a summary of which member accounts are protected
 * by the specified policy.
 */
export const listComplianceStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListComplianceStatusRequest,
    output: ListComplianceStatusResponse,
    errors: [InternalErrorException, ResourceNotFoundException],
  }),
);
/**
 * Creates an Firewall Manager applications list.
 */
export const putAppsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAppsListRequest,
  output: PutAppsListResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Firewall Manager protocols list.
 */
export const putProtocolsList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProtocolsListRequest,
  output: PutProtocolsListResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns detailed compliance information about the specified member account. Details
 * include resources that are in and out of compliance with the specified policy.
 *
 * The reasons for resources being considered compliant depend on the Firewall Manager policy type.
 */
export const getComplianceDetail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComplianceDetailRequest,
  output: GetComplianceDetailResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Firewall Manager policy.
 *
 * A Firewall Manager policy is specific to the individual policy type. If you want to enforce multiple
 * policy types across accounts, you can create multiple policies. You can create more than one
 * policy for each type.
 *
 * If you add a new account to an organization that you created with Organizations, Firewall Manager
 * automatically applies the policy to the resources in that account that are within scope of
 * the policy.
 *
 * Firewall Manager provides the following types of policies:
 *
 * - **WAF policy** - This policy applies WAF web ACL
 * protections to specified accounts and resources.
 *
 * - **Shield Advanced policy** - This policy applies Shield Advanced
 * protection to specified accounts and resources.
 *
 * - **Security Groups policy** - This type of policy gives you
 * control over security groups that are in use throughout your organization in
 * Organizations and lets you enforce a baseline set of rules across your organization.
 *
 * - **Network ACL policy** - This type of policy gives you
 * control over the network ACLs that are in use throughout your organization in
 * Organizations and lets you enforce a baseline set of first and last network ACL rules across your organization.
 *
 * - **Network Firewall policy** - This policy applies
 * Network Firewall protection to your organization's VPCs.
 *
 * - **DNS Firewall policy** - This policy applies
 * Amazon Route 53 Resolver DNS Firewall protections to your organization's VPCs.
 *
 * - **Third-party firewall policy** - This policy applies third-party firewall protections. Third-party firewalls are available by subscription through the Amazon Web Services Marketplace console at Amazon Web Services Marketplace.
 *
 * - **Palo Alto Networks Cloud NGFW policy** - This policy applies Palo Alto Networks Cloud Next Generation Firewall (NGFW) protections and Palo Alto Networks Cloud NGFW rulestacks to your organization's VPCs.
 *
 * - **Fortigate CNF policy** - This policy applies
 * Fortigate Cloud Native Firewall (CNF) protections. Fortigate CNF is a cloud-centered solution that blocks Zero-Day threats and secures cloud infrastructures with industry-leading advanced threat prevention, smart web application firewalls (WAF), and API protection.
 */
export const putPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyRequest,
  output: PutPolicyResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    InvalidOperationException,
    InvalidTypeException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves violations for a resource based on the specified Firewall Manager policy and Amazon Web Services account.
 */
export const getViolationDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetViolationDetailsRequest,
  output: GetViolationDetailsResponse,
  errors: [
    InternalErrorException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
