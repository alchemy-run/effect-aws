import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SecurityHub",
  serviceShapeName: "SecurityHubAPIService",
});
const auth = T.AwsAuthSigv4({ name: "securityhub" });
const ver = T.ServiceVersion("2018-10-26");
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
                        url: "https://securityhub-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://securityhub-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://securityhub.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://securityhub.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeOrganizationConfigurationRequest extends S.Class<DescribeOrganizationConfigurationRequest>(
  "DescribeOrganizationConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/organization/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSecurityHubV2Request extends S.Class<DescribeSecurityHubV2Request>(
  "DescribeSecurityHubV2Request",
)(
  {},
  T.all(T.Http({ method: "GET", uri: "/hubv2" }), svc, auth, proto, ver, rules),
) {}
export class DisableSecurityHubRequest extends S.Class<DisableSecurityHubRequest>(
  "DisableSecurityHubRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableSecurityHubResponse extends S.Class<DisableSecurityHubResponse>(
  "DisableSecurityHubResponse",
)({}) {}
export class DisableSecurityHubV2Request extends S.Class<DisableSecurityHubV2Request>(
  "DisableSecurityHubV2Request",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/hubv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableSecurityHubV2Response extends S.Class<DisableSecurityHubV2Response>(
  "DisableSecurityHubV2Response",
)({}) {}
export class DisassociateFromAdministratorAccountRequest extends S.Class<DisassociateFromAdministratorAccountRequest>(
  "DisassociateFromAdministratorAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/administrator/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromAdministratorAccountResponse extends S.Class<DisassociateFromAdministratorAccountResponse>(
  "DisassociateFromAdministratorAccountResponse",
)({}) {}
export class DisassociateFromMasterAccountRequest extends S.Class<DisassociateFromMasterAccountRequest>(
  "DisassociateFromMasterAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/master/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromMasterAccountResponse extends S.Class<DisassociateFromMasterAccountResponse>(
  "DisassociateFromMasterAccountResponse",
)({}) {}
export class GetAdministratorAccountRequest extends S.Class<GetAdministratorAccountRequest>(
  "GetAdministratorAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/administrator" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvitationsCountRequest extends S.Class<GetInvitationsCountRequest>(
  "GetInvitationsCountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/invitations/count" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMasterAccountRequest extends S.Class<GetMasterAccountRequest>(
  "GetMasterAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/master" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AutomationRulesArnsList = S.Array(S.String);
export const StandardsSubscriptionArns = S.Array(S.String);
export const StringList = S.Array(S.String);
export const TypeList = S.Array(S.String);
export const MetadataUidList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const ArnList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AcceptAdministratorInvitationRequest extends S.Class<AcceptAdministratorInvitationRequest>(
  "AcceptAdministratorInvitationRequest",
)(
  { AdministratorId: S.String, InvitationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/administrator" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptAdministratorInvitationResponse extends S.Class<AcceptAdministratorInvitationResponse>(
  "AcceptAdministratorInvitationResponse",
)({}) {}
export class AcceptInvitationRequest extends S.Class<AcceptInvitationRequest>(
  "AcceptInvitationRequest",
)(
  { MasterId: S.String, InvitationId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/master" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptInvitationResponse extends S.Class<AcceptInvitationResponse>(
  "AcceptInvitationResponse",
)({}) {}
export class BatchDeleteAutomationRulesRequest extends S.Class<BatchDeleteAutomationRulesRequest>(
  "BatchDeleteAutomationRulesRequest",
)(
  { AutomationRulesArns: AutomationRulesArnsList },
  T.all(
    T.Http({ method: "POST", uri: "/automationrules/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisableStandardsRequest extends S.Class<BatchDisableStandardsRequest>(
  "BatchDisableStandardsRequest",
)(
  { StandardsSubscriptionArns: StandardsSubscriptionArns },
  T.all(
    T.Http({ method: "POST", uri: "/standards/deregister" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAutomationRulesRequest extends S.Class<BatchGetAutomationRulesRequest>(
  "BatchGetAutomationRulesRequest",
)(
  { AutomationRulesArns: AutomationRulesArnsList },
  T.all(
    T.Http({ method: "POST", uri: "/automationrules/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetSecurityControlsRequest extends S.Class<BatchGetSecurityControlsRequest>(
  "BatchGetSecurityControlsRequest",
)(
  { SecurityControlIds: StringList },
  T.all(
    T.Http({ method: "POST", uri: "/securityControls/batchGet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateActionTargetRequest extends S.Class<CreateActionTargetRequest>(
  "CreateActionTargetRequest",
)(
  { Name: S.String, Description: S.String, Id: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/actionTargets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFindingAggregatorRequest extends S.Class<CreateFindingAggregatorRequest>(
  "CreateFindingAggregatorRequest",
)(
  { RegionLinkingMode: S.String, Regions: S.optional(StringList) },
  T.all(
    T.Http({ method: "POST", uri: "/findingAggregator/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTicketV2Request extends S.Class<CreateTicketV2Request>(
  "CreateTicketV2Request",
)(
  {
    ConnectorId: S.String,
    FindingMetadataUid: S.String,
    ClientToken: S.optional(S.String),
    Mode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ticketsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeclineInvitationsRequest extends S.Class<DeclineInvitationsRequest>(
  "DeclineInvitationsRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/invitations/decline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteActionTargetRequest extends S.Class<DeleteActionTargetRequest>(
  "DeleteActionTargetRequest",
)(
  { ActionTargetArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/actionTargets/{ActionTargetArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAggregatorV2Request extends S.Class<DeleteAggregatorV2Request>(
  "DeleteAggregatorV2Request",
)(
  { AggregatorV2Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/aggregatorv2/delete/{AggregatorV2Arn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAggregatorV2Response extends S.Class<DeleteAggregatorV2Response>(
  "DeleteAggregatorV2Response",
)({}) {}
export class DeleteAutomationRuleV2Request extends S.Class<DeleteAutomationRuleV2Request>(
  "DeleteAutomationRuleV2Request",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/automationrulesv2/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAutomationRuleV2Response extends S.Class<DeleteAutomationRuleV2Response>(
  "DeleteAutomationRuleV2Response",
)({}) {}
export class DeleteConfigurationPolicyRequest extends S.Class<DeleteConfigurationPolicyRequest>(
  "DeleteConfigurationPolicyRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/configurationPolicy/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConfigurationPolicyResponse extends S.Class<DeleteConfigurationPolicyResponse>(
  "DeleteConfigurationPolicyResponse",
)({}) {}
export class DeleteConnectorV2Request extends S.Class<DeleteConnectorV2Request>(
  "DeleteConnectorV2Request",
)(
  { ConnectorId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/connectorsv2/{ConnectorId+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConnectorV2Response extends S.Class<DeleteConnectorV2Response>(
  "DeleteConnectorV2Response",
)({}) {}
export class DeleteFindingAggregatorRequest extends S.Class<DeleteFindingAggregatorRequest>(
  "DeleteFindingAggregatorRequest",
)(
  { FindingAggregatorArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/findingAggregator/delete/{FindingAggregatorArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFindingAggregatorResponse extends S.Class<DeleteFindingAggregatorResponse>(
  "DeleteFindingAggregatorResponse",
)({}) {}
export class DeleteInsightRequest extends S.Class<DeleteInsightRequest>(
  "DeleteInsightRequest",
)(
  { InsightArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/insights/{InsightArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInvitationsRequest extends S.Class<DeleteInvitationsRequest>(
  "DeleteInvitationsRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/invitations/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMembersRequest extends S.Class<DeleteMembersRequest>(
  "DeleteMembersRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/members/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeActionTargetsRequest extends S.Class<DescribeActionTargetsRequest>(
  "DescribeActionTargetsRequest",
)(
  {
    ActionTargetArns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/actionTargets/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeHubRequest extends S.Class<DescribeHubRequest>(
  "DescribeHubRequest",
)(
  { HubArn: S.optional(S.String).pipe(T.HttpQuery("HubArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProductsRequest extends S.Class<DescribeProductsRequest>(
  "DescribeProductsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ProductArn: S.optional(S.String).pipe(T.HttpQuery("ProductArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/products" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProductsV2Request extends S.Class<DescribeProductsV2Request>(
  "DescribeProductsV2Request",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/productsV2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSecurityHubV2Response extends S.Class<DescribeSecurityHubV2Response>(
  "DescribeSecurityHubV2Response",
)({ HubV2Arn: S.optional(S.String), SubscribedAt: S.optional(S.String) }) {}
export class DescribeStandardsRequest extends S.Class<DescribeStandardsRequest>(
  "DescribeStandardsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/standards" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeStandardsControlsRequest extends S.Class<DescribeStandardsControlsRequest>(
  "DescribeStandardsControlsRequest",
)(
  {
    StandardsSubscriptionArn: S.String.pipe(T.HttpLabel()),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/standards/controls/{StandardsSubscriptionArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableImportFindingsForProductRequest extends S.Class<DisableImportFindingsForProductRequest>(
  "DisableImportFindingsForProductRequest",
)(
  { ProductSubscriptionArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/productSubscriptions/{ProductSubscriptionArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableImportFindingsForProductResponse extends S.Class<DisableImportFindingsForProductResponse>(
  "DisableImportFindingsForProductResponse",
)({}) {}
export class DisableOrganizationAdminAccountRequest extends S.Class<DisableOrganizationAdminAccountRequest>(
  "DisableOrganizationAdminAccountRequest",
)(
  { AdminAccountId: S.String, Feature: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/organization/admin/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableOrganizationAdminAccountResponse extends S.Class<DisableOrganizationAdminAccountResponse>(
  "DisableOrganizationAdminAccountResponse",
)({}) {}
export class DisassociateMembersRequest extends S.Class<DisassociateMembersRequest>(
  "DisassociateMembersRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/members/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMembersResponse extends S.Class<DisassociateMembersResponse>(
  "DisassociateMembersResponse",
)({}) {}
export class EnableImportFindingsForProductRequest extends S.Class<EnableImportFindingsForProductRequest>(
  "EnableImportFindingsForProductRequest",
)(
  { ProductArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/productSubscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableOrganizationAdminAccountRequest extends S.Class<EnableOrganizationAdminAccountRequest>(
  "EnableOrganizationAdminAccountRequest",
)(
  { AdminAccountId: S.String, Feature: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/organization/admin/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class EnableSecurityHubRequest extends S.Class<EnableSecurityHubRequest>(
  "EnableSecurityHubRequest",
)(
  {
    Tags: S.optional(TagMap),
    EnableDefaultStandards: S.optional(S.Boolean),
    ControlFindingGenerator: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableSecurityHubResponse extends S.Class<EnableSecurityHubResponse>(
  "EnableSecurityHubResponse",
)({}) {}
export class EnableSecurityHubV2Request extends S.Class<EnableSecurityHubV2Request>(
  "EnableSecurityHubV2Request",
)(
  { Tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/hubv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAggregatorV2Request extends S.Class<GetAggregatorV2Request>(
  "GetAggregatorV2Request",
)(
  { AggregatorV2Arn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/aggregatorv2/get/{AggregatorV2Arn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomationRuleV2Request extends S.Class<GetAutomationRuleV2Request>(
  "GetAutomationRuleV2Request",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/automationrulesv2/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationPolicyRequest extends S.Class<GetConfigurationPolicyRequest>(
  "GetConfigurationPolicyRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/configurationPolicy/get/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConnectorV2Request extends S.Class<GetConnectorV2Request>(
  "GetConnectorV2Request",
)(
  { ConnectorId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/connectorsv2/{ConnectorId+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEnabledStandardsRequest extends S.Class<GetEnabledStandardsRequest>(
  "GetEnabledStandardsRequest",
)(
  {
    StandardsSubscriptionArns: S.optional(StandardsSubscriptionArns),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/standards/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingAggregatorRequest extends S.Class<GetFindingAggregatorRequest>(
  "GetFindingAggregatorRequest",
)(
  { FindingAggregatorArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/findingAggregator/get/{FindingAggregatorArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AwsSecurityFindingIdentifier extends S.Class<AwsSecurityFindingIdentifier>(
  "AwsSecurityFindingIdentifier",
)({ Id: S.String, ProductArn: S.String }) {}
export class GetFindingHistoryRequest extends S.Class<GetFindingHistoryRequest>(
  "GetFindingHistoryRequest",
)(
  {
    FindingIdentifier: AwsSecurityFindingIdentifier,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingHistory/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightResultsRequest extends S.Class<GetInsightResultsRequest>(
  "GetInsightResultsRequest",
)(
  { InsightArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/insights/results/{InsightArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightsRequest extends S.Class<GetInsightsRequest>(
  "GetInsightsRequest",
)(
  {
    InsightArns: S.optional(ArnList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/insights/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvitationsCountResponse extends S.Class<GetInvitationsCountResponse>(
  "GetInvitationsCountResponse",
)({ InvitationsCount: S.optional(S.Number) }) {}
export class Invitation extends S.Class<Invitation>("Invitation")({
  AccountId: S.optional(S.String),
  InvitationId: S.optional(S.String),
  InvitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MemberStatus: S.optional(S.String),
}) {}
export class GetMasterAccountResponse extends S.Class<GetMasterAccountResponse>(
  "GetMasterAccountResponse",
)({ Master: S.optional(Invitation) }) {}
export class GetMembersRequest extends S.Class<GetMembersRequest>(
  "GetMembersRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/members/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSecurityControlDefinitionRequest extends S.Class<GetSecurityControlDefinitionRequest>(
  "GetSecurityControlDefinitionRequest",
)(
  { SecurityControlId: S.String.pipe(T.HttpQuery("SecurityControlId")) },
  T.all(
    T.Http({ method: "GET", uri: "/securityControl/definition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InviteMembersRequest extends S.Class<InviteMembersRequest>(
  "InviteMembersRequest",
)(
  { AccountIds: AccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/members/invite" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAggregatorsV2Request extends S.Class<ListAggregatorsV2Request>(
  "ListAggregatorsV2Request",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/aggregatorv2/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomationRulesRequest extends S.Class<ListAutomationRulesRequest>(
  "ListAutomationRulesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/automationrules/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomationRulesV2Request extends S.Class<ListAutomationRulesV2Request>(
  "ListAutomationRulesV2Request",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/automationrulesv2/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConfigurationPoliciesRequest extends S.Class<ListConfigurationPoliciesRequest>(
  "ListConfigurationPoliciesRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/configurationPolicy/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListConnectorsV2Request extends S.Class<ListConnectorsV2Request>(
  "ListConnectorsV2Request",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    ProviderName: S.optional(S.String).pipe(T.HttpQuery("ProviderName")),
    ConnectorStatus: S.optional(S.String).pipe(T.HttpQuery("ConnectorStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/connectorsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnabledProductsForImportRequest extends S.Class<ListEnabledProductsForImportRequest>(
  "ListEnabledProductsForImportRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/productSubscriptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFindingAggregatorsRequest extends S.Class<ListFindingAggregatorsRequest>(
  "ListFindingAggregatorsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/findingAggregator/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvitationsRequest extends S.Class<ListInvitationsRequest>(
  "ListInvitationsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/invitations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembersRequest extends S.Class<ListMembersRequest>(
  "ListMembersRequest",
)(
  {
    OnlyAssociated: S.optional(S.Boolean).pipe(T.HttpQuery("OnlyAssociated")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationAdminAccountsRequest extends S.Class<ListOrganizationAdminAccountsRequest>(
  "ListOrganizationAdminAccountsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    Feature: S.optional(S.String).pipe(T.HttpQuery("Feature")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/organization/admin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityControlDefinitionsRequest extends S.Class<ListSecurityControlDefinitionsRequest>(
  "ListSecurityControlDefinitionsRequest",
)(
  {
    StandardsArn: S.optional(S.String).pipe(T.HttpQuery("StandardsArn")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/securityControls/definitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStandardsControlAssociationsRequest extends S.Class<ListStandardsControlAssociationsRequest>(
  "ListStandardsControlAssociationsRequest",
)(
  {
    SecurityControlId: S.String.pipe(T.HttpQuery("SecurityControlId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/associations" }),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterConnectorV2Request extends S.Class<RegisterConnectorV2Request>(
  "RegisterConnectorV2Request",
)(
  { AuthCode: S.String, AuthState: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/connectorsv2/register" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Target = S.Union(
  S.Struct({ AccountId: S.String }),
  S.Struct({ OrganizationalUnitId: S.String }),
  S.Struct({ RootId: S.String }),
);
export class StartConfigurationPolicyAssociationRequest extends S.Class<StartConfigurationPolicyAssociationRequest>(
  "StartConfigurationPolicyAssociationRequest",
)(
  { ConfigurationPolicyIdentifier: S.String, Target: Target },
  T.all(
    T.Http({
      method: "POST",
      uri: "/configurationPolicyAssociation/associate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartConfigurationPolicyDisassociationRequest extends S.Class<StartConfigurationPolicyDisassociationRequest>(
  "StartConfigurationPolicyDisassociationRequest",
)(
  { Target: S.optional(Target), ConfigurationPolicyIdentifier: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/configurationPolicyAssociation/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartConfigurationPolicyDisassociationResponse extends S.Class<StartConfigurationPolicyDisassociationResponse>(
  "StartConfigurationPolicyDisassociationResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export class UpdateActionTargetRequest extends S.Class<UpdateActionTargetRequest>(
  "UpdateActionTargetRequest",
)(
  {
    ActionTargetArn: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/actionTargets/{ActionTargetArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateActionTargetResponse extends S.Class<UpdateActionTargetResponse>(
  "UpdateActionTargetResponse",
)({}) {}
export class UpdateAggregatorV2Request extends S.Class<UpdateAggregatorV2Request>(
  "UpdateAggregatorV2Request",
)(
  {
    AggregatorV2Arn: S.String.pipe(T.HttpLabel()),
    RegionLinkingMode: S.String,
    LinkedRegions: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/aggregatorv2/update/{AggregatorV2Arn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export type CompositeFilterList = CompositeFilter[];
export const CompositeFilterList = S.Array(
  S.suspend((): S.Schema<CompositeFilter, any> => CompositeFilter),
) as any as S.Schema<CompositeFilterList>;
export class OcsfFindingFilters extends S.Class<OcsfFindingFilters>(
  "OcsfFindingFilters",
)({
  CompositeFilters: S.optional(CompositeFilterList),
  CompositeOperator: S.optional(S.String),
}) {}
export const Criteria = S.Union(
  S.Struct({ OcsfFindingCriteria: OcsfFindingFilters }),
);
export class AutomationRulesFindingFieldsUpdateV2 extends S.Class<AutomationRulesFindingFieldsUpdateV2>(
  "AutomationRulesFindingFieldsUpdateV2",
)({
  SeverityId: S.optional(S.Number),
  Comment: S.optional(S.String),
  StatusId: S.optional(S.Number),
}) {}
export class ExternalIntegrationConfiguration extends S.Class<ExternalIntegrationConfiguration>(
  "ExternalIntegrationConfiguration",
)({ ConnectorArn: S.optional(S.String) }) {}
export class AutomationRulesActionV2 extends S.Class<AutomationRulesActionV2>(
  "AutomationRulesActionV2",
)({
  Type: S.String,
  FindingFieldsUpdate: S.optional(AutomationRulesFindingFieldsUpdateV2),
  ExternalIntegrationConfiguration: S.optional(
    ExternalIntegrationConfiguration,
  ),
}) {}
export const AutomationRulesActionListV2 = S.Array(AutomationRulesActionV2);
export class UpdateAutomationRuleV2Request extends S.Class<UpdateAutomationRuleV2Request>(
  "UpdateAutomationRuleV2Request",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    RuleStatus: S.optional(S.String),
    RuleOrder: S.optional(S.Number),
    Description: S.optional(S.String),
    RuleName: S.optional(S.String),
    Criteria: S.optional(Criteria),
    Actions: S.optional(AutomationRulesActionListV2),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/automationrulesv2/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAutomationRuleV2Response extends S.Class<UpdateAutomationRuleV2Response>(
  "UpdateAutomationRuleV2Response",
)({}) {}
export const EnabledStandardIdentifierList = S.Array(S.String);
export const EnabledSecurityControlIdentifierList = S.Array(S.String);
export const DisabledSecurityControlIdentifierList = S.Array(S.String);
export const IntegerList = S.Array(S.Number);
export const ParameterValue = S.Union(
  S.Struct({ Integer: S.Number }),
  S.Struct({ IntegerList: IntegerList }),
  S.Struct({ Double: S.Number }),
  S.Struct({ String: S.String }),
  S.Struct({ StringList: StringList }),
  S.Struct({ Boolean: S.Boolean }),
  S.Struct({ Enum: S.String }),
  S.Struct({ EnumList: StringList }),
);
export class ParameterConfiguration extends S.Class<ParameterConfiguration>(
  "ParameterConfiguration",
)({ ValueType: S.String, Value: S.optional(ParameterValue) }) {}
export const Parameters = S.Record({
  key: S.String,
  value: ParameterConfiguration,
});
export class SecurityControlCustomParameter extends S.Class<SecurityControlCustomParameter>(
  "SecurityControlCustomParameter",
)({
  SecurityControlId: S.optional(S.String),
  Parameters: S.optional(Parameters),
}) {}
export const SecurityControlCustomParametersList = S.Array(
  SecurityControlCustomParameter,
);
export class SecurityControlsConfiguration extends S.Class<SecurityControlsConfiguration>(
  "SecurityControlsConfiguration",
)({
  EnabledSecurityControlIdentifiers: S.optional(
    EnabledSecurityControlIdentifierList,
  ),
  DisabledSecurityControlIdentifiers: S.optional(
    DisabledSecurityControlIdentifierList,
  ),
  SecurityControlCustomParameters: S.optional(
    SecurityControlCustomParametersList,
  ),
}) {}
export class SecurityHubPolicy extends S.Class<SecurityHubPolicy>(
  "SecurityHubPolicy",
)({
  ServiceEnabled: S.optional(S.Boolean),
  EnabledStandardIdentifiers: S.optional(EnabledStandardIdentifierList),
  SecurityControlsConfiguration: S.optional(SecurityControlsConfiguration),
}) {}
export const Policy = S.Union(S.Struct({ SecurityHub: SecurityHubPolicy }));
export class UpdateConfigurationPolicyRequest extends S.Class<UpdateConfigurationPolicyRequest>(
  "UpdateConfigurationPolicyRequest",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    UpdatedReason: S.optional(S.String),
    ConfigurationPolicy: S.optional(Policy),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/configurationPolicy/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFindingAggregatorRequest extends S.Class<UpdateFindingAggregatorRequest>(
  "UpdateFindingAggregatorRequest",
)(
  {
    FindingAggregatorArn: S.String,
    RegionLinkingMode: S.String,
    Regions: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/findingAggregator/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StringFilter extends S.Class<StringFilter>("StringFilter")({
  Value: S.optional(S.String),
  Comparison: S.optional(S.String),
}) {}
export const StringFilterList = S.Array(StringFilter);
export class DateRange extends S.Class<DateRange>("DateRange")({
  Value: S.optional(S.Number),
  Unit: S.optional(S.String),
}) {}
export class DateFilter extends S.Class<DateFilter>("DateFilter")({
  Start: S.optional(S.String),
  End: S.optional(S.String),
  DateRange: S.optional(DateRange),
}) {}
export const DateFilterList = S.Array(DateFilter);
export class NumberFilter extends S.Class<NumberFilter>("NumberFilter")({
  Gte: S.optional(S.Number),
  Lte: S.optional(S.Number),
  Eq: S.optional(S.Number),
  Gt: S.optional(S.Number),
  Lt: S.optional(S.Number),
}) {}
export const NumberFilterList = S.Array(NumberFilter);
export class MapFilter extends S.Class<MapFilter>("MapFilter")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Comparison: S.optional(S.String),
}) {}
export const MapFilterList = S.Array(MapFilter);
export class IpFilter extends S.Class<IpFilter>("IpFilter")({
  Cidr: S.optional(S.String),
}) {}
export const IpFilterList = S.Array(IpFilter);
export class KeywordFilter extends S.Class<KeywordFilter>("KeywordFilter")({
  Value: S.optional(S.String),
}) {}
export const KeywordFilterList = S.Array(KeywordFilter);
export class BooleanFilter extends S.Class<BooleanFilter>("BooleanFilter")({
  Value: S.optional(S.Boolean),
}) {}
export const BooleanFilterList = S.Array(BooleanFilter);
export class AwsSecurityFindingFilters extends S.Class<AwsSecurityFindingFilters>(
  "AwsSecurityFindingFilters",
)({
  ProductArn: S.optional(StringFilterList),
  AwsAccountId: S.optional(StringFilterList),
  Id: S.optional(StringFilterList),
  GeneratorId: S.optional(StringFilterList),
  Region: S.optional(StringFilterList),
  Type: S.optional(StringFilterList),
  FirstObservedAt: S.optional(DateFilterList),
  LastObservedAt: S.optional(DateFilterList),
  CreatedAt: S.optional(DateFilterList),
  UpdatedAt: S.optional(DateFilterList),
  SeverityProduct: S.optional(NumberFilterList),
  SeverityNormalized: S.optional(NumberFilterList),
  SeverityLabel: S.optional(StringFilterList),
  Confidence: S.optional(NumberFilterList),
  Criticality: S.optional(NumberFilterList),
  Title: S.optional(StringFilterList),
  Description: S.optional(StringFilterList),
  RecommendationText: S.optional(StringFilterList),
  SourceUrl: S.optional(StringFilterList),
  ProductFields: S.optional(MapFilterList),
  ProductName: S.optional(StringFilterList),
  CompanyName: S.optional(StringFilterList),
  UserDefinedFields: S.optional(MapFilterList),
  MalwareName: S.optional(StringFilterList),
  MalwareType: S.optional(StringFilterList),
  MalwarePath: S.optional(StringFilterList),
  MalwareState: S.optional(StringFilterList),
  NetworkDirection: S.optional(StringFilterList),
  NetworkProtocol: S.optional(StringFilterList),
  NetworkSourceIpV4: S.optional(IpFilterList),
  NetworkSourceIpV6: S.optional(IpFilterList),
  NetworkSourcePort: S.optional(NumberFilterList),
  NetworkSourceDomain: S.optional(StringFilterList),
  NetworkSourceMac: S.optional(StringFilterList),
  NetworkDestinationIpV4: S.optional(IpFilterList),
  NetworkDestinationIpV6: S.optional(IpFilterList),
  NetworkDestinationPort: S.optional(NumberFilterList),
  NetworkDestinationDomain: S.optional(StringFilterList),
  ProcessName: S.optional(StringFilterList),
  ProcessPath: S.optional(StringFilterList),
  ProcessPid: S.optional(NumberFilterList),
  ProcessParentPid: S.optional(NumberFilterList),
  ProcessLaunchedAt: S.optional(DateFilterList),
  ProcessTerminatedAt: S.optional(DateFilterList),
  ThreatIntelIndicatorType: S.optional(StringFilterList),
  ThreatIntelIndicatorValue: S.optional(StringFilterList),
  ThreatIntelIndicatorCategory: S.optional(StringFilterList),
  ThreatIntelIndicatorLastObservedAt: S.optional(DateFilterList),
  ThreatIntelIndicatorSource: S.optional(StringFilterList),
  ThreatIntelIndicatorSourceUrl: S.optional(StringFilterList),
  ResourceType: S.optional(StringFilterList),
  ResourceId: S.optional(StringFilterList),
  ResourcePartition: S.optional(StringFilterList),
  ResourceRegion: S.optional(StringFilterList),
  ResourceTags: S.optional(MapFilterList),
  ResourceAwsEc2InstanceType: S.optional(StringFilterList),
  ResourceAwsEc2InstanceImageId: S.optional(StringFilterList),
  ResourceAwsEc2InstanceIpV4Addresses: S.optional(IpFilterList),
  ResourceAwsEc2InstanceIpV6Addresses: S.optional(IpFilterList),
  ResourceAwsEc2InstanceKeyName: S.optional(StringFilterList),
  ResourceAwsEc2InstanceIamInstanceProfileArn: S.optional(StringFilterList),
  ResourceAwsEc2InstanceVpcId: S.optional(StringFilterList),
  ResourceAwsEc2InstanceSubnetId: S.optional(StringFilterList),
  ResourceAwsEc2InstanceLaunchedAt: S.optional(DateFilterList),
  ResourceAwsS3BucketOwnerId: S.optional(StringFilterList),
  ResourceAwsS3BucketOwnerName: S.optional(StringFilterList),
  ResourceAwsIamAccessKeyUserName: S.optional(StringFilterList),
  ResourceAwsIamAccessKeyPrincipalName: S.optional(StringFilterList),
  ResourceAwsIamAccessKeyStatus: S.optional(StringFilterList),
  ResourceAwsIamAccessKeyCreatedAt: S.optional(DateFilterList),
  ResourceAwsIamUserUserName: S.optional(StringFilterList),
  ResourceContainerName: S.optional(StringFilterList),
  ResourceContainerImageId: S.optional(StringFilterList),
  ResourceContainerImageName: S.optional(StringFilterList),
  ResourceContainerLaunchedAt: S.optional(DateFilterList),
  ResourceDetailsOther: S.optional(MapFilterList),
  ComplianceStatus: S.optional(StringFilterList),
  VerificationState: S.optional(StringFilterList),
  WorkflowState: S.optional(StringFilterList),
  WorkflowStatus: S.optional(StringFilterList),
  RecordState: S.optional(StringFilterList),
  RelatedFindingsProductArn: S.optional(StringFilterList),
  RelatedFindingsId: S.optional(StringFilterList),
  NoteText: S.optional(StringFilterList),
  NoteUpdatedAt: S.optional(DateFilterList),
  NoteUpdatedBy: S.optional(StringFilterList),
  Keyword: S.optional(KeywordFilterList),
  FindingProviderFieldsConfidence: S.optional(NumberFilterList),
  FindingProviderFieldsCriticality: S.optional(NumberFilterList),
  FindingProviderFieldsRelatedFindingsId: S.optional(StringFilterList),
  FindingProviderFieldsRelatedFindingsProductArn: S.optional(StringFilterList),
  FindingProviderFieldsSeverityLabel: S.optional(StringFilterList),
  FindingProviderFieldsSeverityOriginal: S.optional(StringFilterList),
  FindingProviderFieldsTypes: S.optional(StringFilterList),
  Sample: S.optional(BooleanFilterList),
  ComplianceSecurityControlId: S.optional(StringFilterList),
  ComplianceAssociatedStandardsId: S.optional(StringFilterList),
  VulnerabilitiesExploitAvailable: S.optional(StringFilterList),
  VulnerabilitiesFixAvailable: S.optional(StringFilterList),
  ComplianceSecurityControlParametersName: S.optional(StringFilterList),
  ComplianceSecurityControlParametersValue: S.optional(StringFilterList),
  AwsAccountName: S.optional(StringFilterList),
  ResourceApplicationName: S.optional(StringFilterList),
  ResourceApplicationArn: S.optional(StringFilterList),
}) {}
export class NoteUpdate extends S.Class<NoteUpdate>("NoteUpdate")({
  Text: S.String,
  UpdatedBy: S.String,
}) {}
export class UpdateFindingsRequest extends S.Class<UpdateFindingsRequest>(
  "UpdateFindingsRequest",
)(
  {
    Filters: AwsSecurityFindingFilters,
    Note: S.optional(NoteUpdate),
    RecordState: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/findings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFindingsResponse extends S.Class<UpdateFindingsResponse>(
  "UpdateFindingsResponse",
)({}) {}
export class UpdateInsightRequest extends S.Class<UpdateInsightRequest>(
  "UpdateInsightRequest",
)(
  {
    InsightArn: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    Filters: S.optional(AwsSecurityFindingFilters),
    GroupByAttribute: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/insights/{InsightArn+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInsightResponse extends S.Class<UpdateInsightResponse>(
  "UpdateInsightResponse",
)({}) {}
export class OrganizationConfiguration extends S.Class<OrganizationConfiguration>(
  "OrganizationConfiguration",
)({
  ConfigurationType: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class UpdateOrganizationConfigurationRequest extends S.Class<UpdateOrganizationConfigurationRequest>(
  "UpdateOrganizationConfigurationRequest",
)(
  {
    AutoEnable: S.Boolean,
    AutoEnableStandards: S.optional(S.String),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrganizationConfigurationResponse extends S.Class<UpdateOrganizationConfigurationResponse>(
  "UpdateOrganizationConfigurationResponse",
)({}) {}
export class UpdateSecurityHubConfigurationRequest extends S.Class<UpdateSecurityHubConfigurationRequest>(
  "UpdateSecurityHubConfigurationRequest",
)(
  {
    AutoEnableControls: S.optional(S.Boolean),
    ControlFindingGenerator: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSecurityHubConfigurationResponse extends S.Class<UpdateSecurityHubConfigurationResponse>(
  "UpdateSecurityHubConfigurationResponse",
)({}) {}
export class UpdateStandardsControlRequest extends S.Class<UpdateStandardsControlRequest>(
  "UpdateStandardsControlRequest",
)(
  {
    StandardsControlArn: S.String.pipe(T.HttpLabel()),
    ControlStatus: S.optional(S.String),
    DisabledReason: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/standards/control/{StandardsControlArn+}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStandardsControlResponse extends S.Class<UpdateStandardsControlResponse>(
  "UpdateStandardsControlResponse",
)({}) {}
export class ConfigurationPolicyAssociation extends S.Class<ConfigurationPolicyAssociation>(
  "ConfigurationPolicyAssociation",
)({ Target: S.optional(Target) }) {}
export const ConfigurationPolicyAssociationsList = S.Array(
  ConfigurationPolicyAssociation,
);
export class StandardsControlAssociationId extends S.Class<StandardsControlAssociationId>(
  "StandardsControlAssociationId",
)({ SecurityControlId: S.String, StandardsArn: S.String }) {}
export const StandardsControlAssociationIds = S.Array(
  StandardsControlAssociationId,
);
export class AutomationRulesFindingFilters extends S.Class<AutomationRulesFindingFilters>(
  "AutomationRulesFindingFilters",
)({
  ProductArn: S.optional(StringFilterList),
  AwsAccountId: S.optional(StringFilterList),
  Id: S.optional(StringFilterList),
  GeneratorId: S.optional(StringFilterList),
  Type: S.optional(StringFilterList),
  FirstObservedAt: S.optional(DateFilterList),
  LastObservedAt: S.optional(DateFilterList),
  CreatedAt: S.optional(DateFilterList),
  UpdatedAt: S.optional(DateFilterList),
  Confidence: S.optional(NumberFilterList),
  Criticality: S.optional(NumberFilterList),
  Title: S.optional(StringFilterList),
  Description: S.optional(StringFilterList),
  SourceUrl: S.optional(StringFilterList),
  ProductName: S.optional(StringFilterList),
  CompanyName: S.optional(StringFilterList),
  SeverityLabel: S.optional(StringFilterList),
  ResourceType: S.optional(StringFilterList),
  ResourceId: S.optional(StringFilterList),
  ResourcePartition: S.optional(StringFilterList),
  ResourceRegion: S.optional(StringFilterList),
  ResourceTags: S.optional(MapFilterList),
  ResourceDetailsOther: S.optional(MapFilterList),
  ComplianceStatus: S.optional(StringFilterList),
  ComplianceSecurityControlId: S.optional(StringFilterList),
  ComplianceAssociatedStandardsId: S.optional(StringFilterList),
  VerificationState: S.optional(StringFilterList),
  WorkflowStatus: S.optional(StringFilterList),
  RecordState: S.optional(StringFilterList),
  RelatedFindingsProductArn: S.optional(StringFilterList),
  RelatedFindingsId: S.optional(StringFilterList),
  NoteText: S.optional(StringFilterList),
  NoteUpdatedAt: S.optional(DateFilterList),
  NoteUpdatedBy: S.optional(StringFilterList),
  UserDefinedFields: S.optional(MapFilterList),
  ResourceApplicationArn: S.optional(StringFilterList),
  ResourceApplicationName: S.optional(StringFilterList),
  AwsAccountName: S.optional(StringFilterList),
}) {}
export class SeverityUpdate extends S.Class<SeverityUpdate>("SeverityUpdate")({
  Normalized: S.optional(S.Number),
  Product: S.optional(S.Number),
  Label: S.optional(S.String),
}) {}
export const FieldMap = S.Record({ key: S.String, value: S.String });
export class WorkflowUpdate extends S.Class<WorkflowUpdate>("WorkflowUpdate")({
  Status: S.optional(S.String),
}) {}
export class RelatedFinding extends S.Class<RelatedFinding>("RelatedFinding")({
  ProductArn: S.String,
  Id: S.String,
}) {}
export const RelatedFindingList = S.Array(RelatedFinding);
export class AutomationRulesFindingFieldsUpdate extends S.Class<AutomationRulesFindingFieldsUpdate>(
  "AutomationRulesFindingFieldsUpdate",
)({
  Note: S.optional(NoteUpdate),
  Severity: S.optional(SeverityUpdate),
  VerificationState: S.optional(S.String),
  Confidence: S.optional(S.Number),
  Criticality: S.optional(S.Number),
  Types: S.optional(TypeList),
  UserDefinedFields: S.optional(FieldMap),
  Workflow: S.optional(WorkflowUpdate),
  RelatedFindings: S.optional(RelatedFindingList),
}) {}
export class AutomationRulesAction extends S.Class<AutomationRulesAction>(
  "AutomationRulesAction",
)({
  Type: S.optional(S.String),
  FindingFieldsUpdate: S.optional(AutomationRulesFindingFieldsUpdate),
}) {}
export const ActionList = S.Array(AutomationRulesAction);
export class UpdateAutomationRulesRequestItem extends S.Class<UpdateAutomationRulesRequestItem>(
  "UpdateAutomationRulesRequestItem",
)({
  RuleArn: S.String,
  RuleStatus: S.optional(S.String),
  RuleOrder: S.optional(S.Number),
  Description: S.optional(S.String),
  RuleName: S.optional(S.String),
  IsTerminal: S.optional(S.Boolean),
  Criteria: S.optional(AutomationRulesFindingFilters),
  Actions: S.optional(ActionList),
}) {}
export const UpdateAutomationRulesRequestItemsList = S.Array(
  UpdateAutomationRulesRequestItem,
);
export const AwsSecurityFindingIdentifierList = S.Array(
  AwsSecurityFindingIdentifier,
);
export class OcsfFindingIdentifier extends S.Class<OcsfFindingIdentifier>(
  "OcsfFindingIdentifier",
)({
  CloudAccountUid: S.String,
  FindingInfoUid: S.String,
  MetadataProductUid: S.String,
}) {}
export const OcsfFindingIdentifierList = S.Array(OcsfFindingIdentifier);
export class StandardsControlAssociationUpdate extends S.Class<StandardsControlAssociationUpdate>(
  "StandardsControlAssociationUpdate",
)({
  StandardsArn: S.String,
  SecurityControlId: S.String,
  AssociationStatus: S.String,
  UpdatedReason: S.optional(S.String),
}) {}
export const StandardsControlAssociationUpdates = S.Array(
  StandardsControlAssociationUpdate,
);
export class AccountDetails extends S.Class<AccountDetails>("AccountDetails")({
  AccountId: S.String,
  Email: S.optional(S.String),
}) {}
export const AccountDetailsList = S.Array(AccountDetails);
export class SortCriterion extends S.Class<SortCriterion>("SortCriterion")({
  Field: S.optional(S.String),
  SortOrder: S.optional(S.String),
}) {}
export const SortCriteria = S.Array(SortCriterion);
export class GroupByRule extends S.Class<GroupByRule>("GroupByRule")({
  Filters: S.optional(OcsfFindingFilters),
  GroupByField: S.String,
}) {}
export const GroupByRules = S.Array(GroupByRule);
export type ResourcesCompositeFilterList = ResourcesCompositeFilter[];
export const ResourcesCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<ResourcesCompositeFilter, any> => ResourcesCompositeFilter,
  ),
) as any as S.Schema<ResourcesCompositeFilterList>;
export class ResourcesFilters extends S.Class<ResourcesFilters>(
  "ResourcesFilters",
)({
  CompositeFilters: S.optional(ResourcesCompositeFilterList),
  CompositeOperator: S.optional(S.String),
}) {}
export class ResourceGroupByRule extends S.Class<ResourceGroupByRule>(
  "ResourceGroupByRule",
)({ GroupByField: S.String, Filters: S.optional(ResourcesFilters) }) {}
export const ResourceGroupByRules = S.Array(ResourceGroupByRule);
export class AssociationFilters extends S.Class<AssociationFilters>(
  "AssociationFilters",
)({
  ConfigurationPolicyId: S.optional(S.String),
  AssociationType: S.optional(S.String),
  AssociationStatus: S.optional(S.String),
}) {}
export const ProductSubscriptionArnList = S.Array(S.String);
export const InvitationList = S.Array(Invitation);
export const CustomizableProperties = S.Array(S.String);
export class IntegerConfigurationOptions extends S.Class<IntegerConfigurationOptions>(
  "IntegerConfigurationOptions",
)({
  DefaultValue: S.optional(S.Number),
  Min: S.optional(S.Number),
  Max: S.optional(S.Number),
}) {}
export class IntegerListConfigurationOptions extends S.Class<IntegerListConfigurationOptions>(
  "IntegerListConfigurationOptions",
)({
  DefaultValue: S.optional(IntegerList),
  Min: S.optional(S.Number),
  Max: S.optional(S.Number),
  MaxItems: S.optional(S.Number),
}) {}
export class DoubleConfigurationOptions extends S.Class<DoubleConfigurationOptions>(
  "DoubleConfigurationOptions",
)({
  DefaultValue: S.optional(S.Number),
  Min: S.optional(S.Number),
  Max: S.optional(S.Number),
}) {}
export class StringConfigurationOptions extends S.Class<StringConfigurationOptions>(
  "StringConfigurationOptions",
)({
  DefaultValue: S.optional(S.String),
  Re2Expression: S.optional(S.String),
  ExpressionDescription: S.optional(S.String),
}) {}
export class StringListConfigurationOptions extends S.Class<StringListConfigurationOptions>(
  "StringListConfigurationOptions",
)({
  DefaultValue: S.optional(StringList),
  Re2Expression: S.optional(S.String),
  MaxItems: S.optional(S.Number),
  ExpressionDescription: S.optional(S.String),
}) {}
export class BooleanConfigurationOptions extends S.Class<BooleanConfigurationOptions>(
  "BooleanConfigurationOptions",
)({ DefaultValue: S.optional(S.Boolean) }) {}
export class EnumConfigurationOptions extends S.Class<EnumConfigurationOptions>(
  "EnumConfigurationOptions",
)({
  DefaultValue: S.optional(S.String),
  AllowedValues: S.optional(StringList),
}) {}
export class EnumListConfigurationOptions extends S.Class<EnumListConfigurationOptions>(
  "EnumListConfigurationOptions",
)({
  DefaultValue: S.optional(StringList),
  MaxItems: S.optional(S.Number),
  AllowedValues: S.optional(StringList),
}) {}
export const ConfigurationOptions = S.Union(
  S.Struct({ Integer: IntegerConfigurationOptions }),
  S.Struct({ IntegerList: IntegerListConfigurationOptions }),
  S.Struct({ Double: DoubleConfigurationOptions }),
  S.Struct({ String: StringConfigurationOptions }),
  S.Struct({ StringList: StringListConfigurationOptions }),
  S.Struct({ Boolean: BooleanConfigurationOptions }),
  S.Struct({ Enum: EnumConfigurationOptions }),
  S.Struct({ EnumList: EnumListConfigurationOptions }),
);
export class ParameterDefinition extends S.Class<ParameterDefinition>(
  "ParameterDefinition",
)({ Description: S.String, ConfigurationOptions: ConfigurationOptions }) {}
export const ParameterDefinitions = S.Record({
  key: S.String,
  value: ParameterDefinition,
});
export class SecurityControlDefinition extends S.Class<SecurityControlDefinition>(
  "SecurityControlDefinition",
)({
  SecurityControlId: S.String,
  Title: S.String,
  Description: S.String,
  RemediationUrl: S.String,
  SeverityRating: S.String,
  CurrentRegionAvailability: S.String,
  CustomizableProperties: S.optional(CustomizableProperties),
  ParameterDefinitions: S.optional(ParameterDefinitions),
}) {}
export const SecurityControlDefinitions = S.Array(SecurityControlDefinition);
export const RelatedRequirementsList = S.Array(S.String);
export class BatchGetConfigurationPolicyAssociationsRequest extends S.Class<BatchGetConfigurationPolicyAssociationsRequest>(
  "BatchGetConfigurationPolicyAssociationsRequest",
)(
  {
    ConfigurationPolicyAssociationIdentifiers:
      ConfigurationPolicyAssociationsList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/configurationPolicyAssociation/batchget" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetStandardsControlAssociationsRequest extends S.Class<BatchGetStandardsControlAssociationsRequest>(
  "BatchGetStandardsControlAssociationsRequest",
)(
  { StandardsControlAssociationIds: StandardsControlAssociationIds },
  T.all(
    T.Http({ method: "POST", uri: "/associations/batchGet" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateAutomationRulesRequest extends S.Class<BatchUpdateAutomationRulesRequest>(
  "BatchUpdateAutomationRulesRequest",
)(
  { UpdateAutomationRulesRequestItems: UpdateAutomationRulesRequestItemsList },
  T.all(
    T.Http({ method: "PATCH", uri: "/automationrules/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateFindingsRequest extends S.Class<BatchUpdateFindingsRequest>(
  "BatchUpdateFindingsRequest",
)(
  {
    FindingIdentifiers: AwsSecurityFindingIdentifierList,
    Note: S.optional(NoteUpdate),
    Severity: S.optional(SeverityUpdate),
    VerificationState: S.optional(S.String),
    Confidence: S.optional(S.Number),
    Criticality: S.optional(S.Number),
    Types: S.optional(TypeList),
    UserDefinedFields: S.optional(FieldMap),
    Workflow: S.optional(WorkflowUpdate),
    RelatedFindings: S.optional(RelatedFindingList),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/findings/batchupdate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateFindingsV2Request extends S.Class<BatchUpdateFindingsV2Request>(
  "BatchUpdateFindingsV2Request",
)(
  {
    MetadataUids: S.optional(MetadataUidList),
    FindingIdentifiers: S.optional(OcsfFindingIdentifierList),
    Comment: S.optional(S.String),
    SeverityId: S.optional(S.Number),
    StatusId: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/findingsv2/batchupdatev2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateStandardsControlAssociationsRequest extends S.Class<BatchUpdateStandardsControlAssociationsRequest>(
  "BatchUpdateStandardsControlAssociationsRequest",
)(
  { StandardsControlAssociationUpdates: StandardsControlAssociationUpdates },
  T.all(
    T.Http({ method: "PATCH", uri: "/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateActionTargetResponse extends S.Class<CreateActionTargetResponse>(
  "CreateActionTargetResponse",
)({ ActionTargetArn: S.String }) {}
export class CreateAggregatorV2Request extends S.Class<CreateAggregatorV2Request>(
  "CreateAggregatorV2Request",
)(
  {
    RegionLinkingMode: S.String,
    LinkedRegions: S.optional(StringList),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/aggregatorv2/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFindingAggregatorResponse extends S.Class<CreateFindingAggregatorResponse>(
  "CreateFindingAggregatorResponse",
)({
  FindingAggregatorArn: S.optional(S.String),
  FindingAggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  Regions: S.optional(StringList),
}) {}
export class CreateMembersRequest extends S.Class<CreateMembersRequest>(
  "CreateMembersRequest",
)(
  { AccountDetails: AccountDetailsList },
  T.all(
    T.Http({ method: "POST", uri: "/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTicketV2Response extends S.Class<CreateTicketV2Response>(
  "CreateTicketV2Response",
)({ TicketId: S.String, TicketSrcUrl: S.optional(S.String) }) {}
export class DeleteActionTargetResponse extends S.Class<DeleteActionTargetResponse>(
  "DeleteActionTargetResponse",
)({ ActionTargetArn: S.String }) {}
export class DeleteInsightResponse extends S.Class<DeleteInsightResponse>(
  "DeleteInsightResponse",
)({ InsightArn: S.String }) {}
export class Result extends S.Class<Result>("Result")({
  AccountId: S.optional(S.String),
  ProcessingResult: S.optional(S.String),
}) {}
export const ResultList = S.Array(Result);
export class DeleteInvitationsResponse extends S.Class<DeleteInvitationsResponse>(
  "DeleteInvitationsResponse",
)({ UnprocessedAccounts: S.optional(ResultList) }) {}
export class DeleteMembersResponse extends S.Class<DeleteMembersResponse>(
  "DeleteMembersResponse",
)({ UnprocessedAccounts: S.optional(ResultList) }) {}
export class DescribeHubResponse extends S.Class<DescribeHubResponse>(
  "DescribeHubResponse",
)({
  HubArn: S.optional(S.String),
  SubscribedAt: S.optional(S.String),
  AutoEnableControls: S.optional(S.Boolean),
  ControlFindingGenerator: S.optional(S.String),
}) {}
export class DescribeOrganizationConfigurationResponse extends S.Class<DescribeOrganizationConfigurationResponse>(
  "DescribeOrganizationConfigurationResponse",
)({
  AutoEnable: S.optional(S.Boolean),
  MemberAccountLimitReached: S.optional(S.Boolean),
  AutoEnableStandards: S.optional(S.String),
  OrganizationConfiguration: S.optional(OrganizationConfiguration),
}) {}
export class EnableImportFindingsForProductResponse extends S.Class<EnableImportFindingsForProductResponse>(
  "EnableImportFindingsForProductResponse",
)({ ProductSubscriptionArn: S.optional(S.String) }) {}
export class EnableOrganizationAdminAccountResponse extends S.Class<EnableOrganizationAdminAccountResponse>(
  "EnableOrganizationAdminAccountResponse",
)({ AdminAccountId: S.optional(S.String), Feature: S.optional(S.String) }) {}
export class EnableSecurityHubV2Response extends S.Class<EnableSecurityHubV2Response>(
  "EnableSecurityHubV2Response",
)({ HubV2Arn: S.optional(S.String) }) {}
export class GetAdministratorAccountResponse extends S.Class<GetAdministratorAccountResponse>(
  "GetAdministratorAccountResponse",
)({ Administrator: S.optional(Invitation) }) {}
export class GetAggregatorV2Response extends S.Class<GetAggregatorV2Response>(
  "GetAggregatorV2Response",
)({
  AggregatorV2Arn: S.optional(S.String),
  AggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  LinkedRegions: S.optional(StringList),
}) {}
export class GetAutomationRuleV2Response extends S.Class<GetAutomationRuleV2Response>(
  "GetAutomationRuleV2Response",
)({
  RuleArn: S.optional(S.String),
  RuleId: S.optional(S.String),
  RuleOrder: S.optional(S.Number),
  RuleName: S.optional(S.String),
  RuleStatus: S.optional(S.String),
  Description: S.optional(S.String),
  Criteria: S.optional(Criteria),
  Actions: S.optional(AutomationRulesActionListV2),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetConfigurationPolicyResponse extends S.Class<GetConfigurationPolicyResponse>(
  "GetConfigurationPolicyResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ConfigurationPolicy: S.optional(Policy),
}) {}
export class GetConfigurationPolicyAssociationRequest extends S.Class<GetConfigurationPolicyAssociationRequest>(
  "GetConfigurationPolicyAssociationRequest",
)(
  { Target: Target },
  T.all(
    T.Http({ method: "POST", uri: "/configurationPolicyAssociation/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StandardsInputParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export class StandardsStatusReason extends S.Class<StandardsStatusReason>(
  "StandardsStatusReason",
)({ StatusReasonCode: S.String }) {}
export class StandardsSubscription extends S.Class<StandardsSubscription>(
  "StandardsSubscription",
)({
  StandardsSubscriptionArn: S.String,
  StandardsArn: S.String,
  StandardsInput: StandardsInputParameterMap,
  StandardsStatus: S.String,
  StandardsControlsUpdatable: S.optional(S.String),
  StandardsStatusReason: S.optional(StandardsStatusReason),
}) {}
export const StandardsSubscriptions = S.Array(StandardsSubscription);
export class GetEnabledStandardsResponse extends S.Class<GetEnabledStandardsResponse>(
  "GetEnabledStandardsResponse",
)({
  StandardsSubscriptions: S.optional(StandardsSubscriptions),
  NextToken: S.optional(S.String),
}) {}
export class GetFindingAggregatorResponse extends S.Class<GetFindingAggregatorResponse>(
  "GetFindingAggregatorResponse",
)({
  FindingAggregatorArn: S.optional(S.String),
  FindingAggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  Regions: S.optional(StringList),
}) {}
export class GetFindingsRequest extends S.Class<GetFindingsRequest>(
  "GetFindingsRequest",
)(
  {
    Filters: S.optional(AwsSecurityFindingFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingStatisticsV2Request extends S.Class<GetFindingStatisticsV2Request>(
  "GetFindingStatisticsV2Request",
)(
  {
    GroupByRules: GroupByRules,
    SortOrder: S.optional(S.String),
    MaxStatisticResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingsv2/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcesStatisticsV2Request extends S.Class<GetResourcesStatisticsV2Request>(
  "GetResourcesStatisticsV2Request",
)(
  {
    GroupByRules: ResourceGroupByRules,
    SortOrder: S.optional(S.String),
    MaxStatisticResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourcesv2/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InviteMembersResponse extends S.Class<InviteMembersResponse>(
  "InviteMembersResponse",
)({ UnprocessedAccounts: S.optional(ResultList) }) {}
export class ListConfigurationPolicyAssociationsRequest extends S.Class<ListConfigurationPolicyAssociationsRequest>(
  "ListConfigurationPolicyAssociationsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(AssociationFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configurationPolicyAssociation/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnabledProductsForImportResponse extends S.Class<ListEnabledProductsForImportResponse>(
  "ListEnabledProductsForImportResponse",
)({
  ProductSubscriptions: S.optional(ProductSubscriptionArnList),
  NextToken: S.optional(S.String),
}) {}
export class ListInvitationsResponse extends S.Class<ListInvitationsResponse>(
  "ListInvitationsResponse",
)({
  Invitations: S.optional(InvitationList),
  NextToken: S.optional(S.String),
}) {}
export class Member extends S.Class<Member>("Member")({
  AccountId: S.optional(S.String),
  Email: S.optional(S.String),
  MasterId: S.optional(S.String),
  AdministratorId: S.optional(S.String),
  MemberStatus: S.optional(S.String),
  InvitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const MemberList = S.Array(Member);
export class ListMembersResponse extends S.Class<ListMembersResponse>(
  "ListMembersResponse",
)({ Members: S.optional(MemberList), NextToken: S.optional(S.String) }) {}
export class ListSecurityControlDefinitionsResponse extends S.Class<ListSecurityControlDefinitionsResponse>(
  "ListSecurityControlDefinitionsResponse",
)({
  SecurityControlDefinitions: SecurityControlDefinitions,
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class RegisterConnectorV2Response extends S.Class<RegisterConnectorV2Response>(
  "RegisterConnectorV2Response",
)({ ConnectorArn: S.optional(S.String), ConnectorId: S.String }) {}
export class StartConfigurationPolicyAssociationResponse extends S.Class<StartConfigurationPolicyAssociationResponse>(
  "StartConfigurationPolicyAssociationResponse",
)({
  ConfigurationPolicyId: S.optional(S.String),
  TargetId: S.optional(S.String),
  TargetType: S.optional(S.String),
  AssociationType: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AssociationStatus: S.optional(S.String),
  AssociationStatusMessage: S.optional(S.String),
}) {}
export class UpdateAggregatorV2Response extends S.Class<UpdateAggregatorV2Response>(
  "UpdateAggregatorV2Response",
)({
  AggregatorV2Arn: S.optional(S.String),
  AggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  LinkedRegions: S.optional(StringList),
}) {}
export class UpdateConfigurationPolicyResponse extends S.Class<UpdateConfigurationPolicyResponse>(
  "UpdateConfigurationPolicyResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ConfigurationPolicy: S.optional(Policy),
}) {}
export class UpdateFindingAggregatorResponse extends S.Class<UpdateFindingAggregatorResponse>(
  "UpdateFindingAggregatorResponse",
)({
  FindingAggregatorArn: S.optional(S.String),
  FindingAggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  Regions: S.optional(StringList),
}) {}
export class Severity extends S.Class<Severity>("Severity")({
  Product: S.optional(S.Number),
  Label: S.optional(S.String),
  Normalized: S.optional(S.Number),
  Original: S.optional(S.String),
}) {}
export class Malware extends S.Class<Malware>("Malware")({
  Name: S.String,
  Type: S.optional(S.String),
  Path: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const MalwareList = S.Array(Malware);
export class ProcessDetails extends S.Class<ProcessDetails>("ProcessDetails")({
  Name: S.optional(S.String),
  Path: S.optional(S.String),
  Pid: S.optional(S.Number),
  ParentPid: S.optional(S.Number),
  LaunchedAt: S.optional(S.String),
  TerminatedAt: S.optional(S.String),
}) {}
export class ThreatIntelIndicator extends S.Class<ThreatIntelIndicator>(
  "ThreatIntelIndicator",
)({
  Type: S.optional(S.String),
  Value: S.optional(S.String),
  Category: S.optional(S.String),
  LastObservedAt: S.optional(S.String),
  Source: S.optional(S.String),
  SourceUrl: S.optional(S.String),
}) {}
export const ThreatIntelIndicatorList = S.Array(ThreatIntelIndicator);
export class Workflow extends S.Class<Workflow>("Workflow")({
  Status: S.optional(S.String),
}) {}
export class Note extends S.Class<Note>("Note")({
  Text: S.String,
  UpdatedBy: S.String,
  UpdatedAt: S.String,
}) {}
export class PatchSummary extends S.Class<PatchSummary>("PatchSummary")({
  Id: S.String,
  InstalledCount: S.optional(S.Number),
  MissingCount: S.optional(S.Number),
  FailedCount: S.optional(S.Number),
  InstalledOtherCount: S.optional(S.Number),
  InstalledRejectedCount: S.optional(S.Number),
  InstalledPendingReboot: S.optional(S.Number),
  OperationStartTime: S.optional(S.String),
  OperationEndTime: S.optional(S.String),
  RebootOption: S.optional(S.String),
  Operation: S.optional(S.String),
}) {}
export class GeneratorDetails extends S.Class<GeneratorDetails>(
  "GeneratorDetails",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Labels: S.optional(TypeList),
}) {}
export class JiraCloudProviderConfiguration extends S.Class<JiraCloudProviderConfiguration>(
  "JiraCloudProviderConfiguration",
)({ ProjectKey: S.optional(S.String) }) {}
export class ServiceNowProviderConfiguration extends S.Class<ServiceNowProviderConfiguration>(
  "ServiceNowProviderConfiguration",
)({ InstanceName: S.String, SecretArn: S.String }) {}
export const CategoryList = S.Array(S.String);
export const IntegrationTypeList = S.Array(S.String);
export const IntegrationV2TypeList = S.Array(S.String);
export class JiraCloudUpdateConfiguration extends S.Class<JiraCloudUpdateConfiguration>(
  "JiraCloudUpdateConfiguration",
)({ ProjectKey: S.optional(S.String) }) {}
export class ServiceNowUpdateConfiguration extends S.Class<ServiceNowUpdateConfiguration>(
  "ServiceNowUpdateConfiguration",
)({ SecretArn: S.optional(S.String) }) {}
export class UnprocessedAutomationRule extends S.Class<UnprocessedAutomationRule>(
  "UnprocessedAutomationRule",
)({
  RuleArn: S.optional(S.String),
  ErrorCode: S.optional(S.Number),
  ErrorMessage: S.optional(S.String),
}) {}
export const UnprocessedAutomationRulesList = S.Array(
  UnprocessedAutomationRule,
);
export class StandardsSubscriptionRequest extends S.Class<StandardsSubscriptionRequest>(
  "StandardsSubscriptionRequest",
)({
  StandardsArn: S.String,
  StandardsInput: S.optional(StandardsInputParameterMap),
}) {}
export const StandardsSubscriptionRequests = S.Array(
  StandardsSubscriptionRequest,
);
export class AutomationRulesConfig extends S.Class<AutomationRulesConfig>(
  "AutomationRulesConfig",
)({
  RuleArn: S.optional(S.String),
  RuleStatus: S.optional(S.String),
  RuleOrder: S.optional(S.Number),
  RuleName: S.optional(S.String),
  Description: S.optional(S.String),
  IsTerminal: S.optional(S.Boolean),
  Criteria: S.optional(AutomationRulesFindingFilters),
  Actions: S.optional(ActionList),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedBy: S.optional(S.String),
}) {}
export const AutomationRulesConfigList = S.Array(AutomationRulesConfig);
export class SecurityControl extends S.Class<SecurityControl>(
  "SecurityControl",
)({
  SecurityControlId: S.String,
  SecurityControlArn: S.String,
  Title: S.String,
  Description: S.String,
  RemediationUrl: S.String,
  SeverityRating: S.String,
  SecurityControlStatus: S.String,
  UpdateStatus: S.optional(S.String),
  Parameters: S.optional(Parameters),
  LastUpdateReason: S.optional(S.String),
}) {}
export const SecurityControls = S.Array(SecurityControl);
export class UnprocessedSecurityControl extends S.Class<UnprocessedSecurityControl>(
  "UnprocessedSecurityControl",
)({
  SecurityControlId: S.String,
  ErrorCode: S.String,
  ErrorReason: S.optional(S.String),
}) {}
export const UnprocessedSecurityControls = S.Array(UnprocessedSecurityControl);
export const ProviderConfiguration = S.Union(
  S.Struct({ JiraCloud: JiraCloudProviderConfiguration }),
  S.Struct({ ServiceNow: ServiceNowProviderConfiguration }),
);
export class ActionTarget extends S.Class<ActionTarget>("ActionTarget")({
  ActionTargetArn: S.String,
  Name: S.String,
  Description: S.String,
}) {}
export const ActionTargetList = S.Array(ActionTarget);
export class Product extends S.Class<Product>("Product")({
  ProductArn: S.String,
  ProductName: S.optional(S.String),
  CompanyName: S.optional(S.String),
  Description: S.optional(S.String),
  Categories: S.optional(CategoryList),
  IntegrationTypes: S.optional(IntegrationTypeList),
  MarketplaceUrl: S.optional(S.String),
  ActivationUrl: S.optional(S.String),
  ProductSubscriptionResourcePolicy: S.optional(S.String),
}) {}
export const ProductsList = S.Array(Product);
export class ProductV2 extends S.Class<ProductV2>("ProductV2")({
  ProductV2Name: S.optional(S.String),
  CompanyName: S.optional(S.String),
  Description: S.optional(S.String),
  Categories: S.optional(CategoryList),
  IntegrationV2Types: S.optional(IntegrationV2TypeList),
  MarketplaceUrl: S.optional(S.String),
  ActivationUrl: S.optional(S.String),
}) {}
export const ProductsV2List = S.Array(ProductV2);
export class StandardsControl extends S.Class<StandardsControl>(
  "StandardsControl",
)({
  StandardsControlArn: S.optional(S.String),
  ControlStatus: S.optional(S.String),
  DisabledReason: S.optional(S.String),
  ControlStatusUpdatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ControlId: S.optional(S.String),
  Title: S.optional(S.String),
  Description: S.optional(S.String),
  RemediationUrl: S.optional(S.String),
  SeverityRating: S.optional(S.String),
  RelatedRequirements: S.optional(RelatedRequirementsList),
}) {}
export const StandardsControls = S.Array(StandardsControl);
export class HealthCheck extends S.Class<HealthCheck>("HealthCheck")({
  ConnectorStatus: S.String,
  Message: S.optional(S.String),
  LastCheckedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  Text: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class Remediation extends S.Class<Remediation>("Remediation")({
  Recommendation: S.optional(Recommendation),
}) {}
export class PortRange extends S.Class<PortRange>("PortRange")({
  Begin: S.optional(S.Number),
  End: S.optional(S.Number),
}) {}
export class Network extends S.Class<Network>("Network")({
  Direction: S.optional(S.String),
  Protocol: S.optional(S.String),
  OpenPortRange: S.optional(PortRange),
  SourceIpV4: S.optional(S.String),
  SourceIpV6: S.optional(S.String),
  SourcePort: S.optional(S.Number),
  SourceDomain: S.optional(S.String),
  SourceMac: S.optional(S.String),
  DestinationIpV4: S.optional(S.String),
  DestinationIpV6: S.optional(S.String),
  DestinationPort: S.optional(S.Number),
  DestinationDomain: S.optional(S.String),
}) {}
export const PortRangeList = S.Array(PortRange);
export class NetworkPathComponentDetails extends S.Class<NetworkPathComponentDetails>(
  "NetworkPathComponentDetails",
)({ Address: S.optional(StringList), PortRanges: S.optional(PortRangeList) }) {}
export class NetworkHeader extends S.Class<NetworkHeader>("NetworkHeader")({
  Protocol: S.optional(S.String),
  Destination: S.optional(NetworkPathComponentDetails),
  Source: S.optional(NetworkPathComponentDetails),
}) {}
export class NetworkPathComponent extends S.Class<NetworkPathComponent>(
  "NetworkPathComponent",
)({
  ComponentId: S.optional(S.String),
  ComponentType: S.optional(S.String),
  Egress: S.optional(NetworkHeader),
  Ingress: S.optional(NetworkHeader),
}) {}
export const NetworkPathList = S.Array(NetworkPathComponent);
export class FilePaths extends S.Class<FilePaths>("FilePaths")({
  FilePath: S.optional(S.String),
  FileName: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Hash: S.optional(S.String),
}) {}
export const FilePathList = S.Array(FilePaths);
export class Threat extends S.Class<Threat>("Threat")({
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  ItemCount: S.optional(S.Number),
  FilePaths: S.optional(FilePathList),
}) {}
export const ThreatList = S.Array(Threat);
export class ClassificationStatus extends S.Class<ClassificationStatus>(
  "ClassificationStatus",
)({ Code: S.optional(S.String), Reason: S.optional(S.String) }) {}
export class Range extends S.Class<Range>("Range")({
  Start: S.optional(S.Number),
  End: S.optional(S.Number),
  StartColumn: S.optional(S.Number),
}) {}
export const Ranges = S.Array(Range);
export class Page extends S.Class<Page>("Page")({
  PageNumber: S.optional(S.Number),
  LineRange: S.optional(Range),
  OffsetRange: S.optional(Range),
}) {}
export const Pages = S.Array(Page);
export class Record extends S.Class<Record>("Record")({
  JsonPath: S.optional(S.String),
  RecordIndex: S.optional(S.Number),
}) {}
export const Records = S.Array(Record);
export class Cell extends S.Class<Cell>("Cell")({
  Column: S.optional(S.Number),
  Row: S.optional(S.Number),
  ColumnName: S.optional(S.String),
  CellReference: S.optional(S.String),
}) {}
export const Cells = S.Array(Cell);
export class Occurrences extends S.Class<Occurrences>("Occurrences")({
  LineRanges: S.optional(Ranges),
  OffsetRanges: S.optional(Ranges),
  Pages: S.optional(Pages),
  Records: S.optional(Records),
  Cells: S.optional(Cells),
}) {}
export class SensitiveDataDetections extends S.Class<SensitiveDataDetections>(
  "SensitiveDataDetections",
)({
  Count: S.optional(S.Number),
  Type: S.optional(S.String),
  Occurrences: S.optional(Occurrences),
}) {}
export const SensitiveDataDetectionsList = S.Array(SensitiveDataDetections);
export class SensitiveDataResult extends S.Class<SensitiveDataResult>(
  "SensitiveDataResult",
)({
  Category: S.optional(S.String),
  Detections: S.optional(SensitiveDataDetectionsList),
  TotalCount: S.optional(S.Number),
}) {}
export const SensitiveDataResultList = S.Array(SensitiveDataResult);
export class CustomDataIdentifiersDetections extends S.Class<CustomDataIdentifiersDetections>(
  "CustomDataIdentifiersDetections",
)({
  Count: S.optional(S.Number),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Occurrences: S.optional(Occurrences),
}) {}
export const CustomDataIdentifiersDetectionsList = S.Array(
  CustomDataIdentifiersDetections,
);
export class CustomDataIdentifiersResult extends S.Class<CustomDataIdentifiersResult>(
  "CustomDataIdentifiersResult",
)({
  Detections: S.optional(CustomDataIdentifiersDetectionsList),
  TotalCount: S.optional(S.Number),
}) {}
export class ClassificationResult extends S.Class<ClassificationResult>(
  "ClassificationResult",
)({
  MimeType: S.optional(S.String),
  SizeClassified: S.optional(S.Number),
  AdditionalOccurrences: S.optional(S.Boolean),
  Status: S.optional(ClassificationStatus),
  SensitiveData: S.optional(SensitiveDataResultList),
  CustomDataIdentifiers: S.optional(CustomDataIdentifiersResult),
}) {}
export class DataClassificationDetails extends S.Class<DataClassificationDetails>(
  "DataClassificationDetails",
)({
  DetailedResultsLocation: S.optional(S.String),
  Result: S.optional(ClassificationResult),
}) {}
export class AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails extends S.Class<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails>(
  "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails",
)({
  OnDemandAllocationStrategy: S.optional(S.String),
  OnDemandBaseCapacity: S.optional(S.Number),
  OnDemandPercentageAboveBaseCapacity: S.optional(S.Number),
  SpotAllocationStrategy: S.optional(S.String),
  SpotInstancePools: S.optional(S.Number),
  SpotMaxPrice: S.optional(S.String),
}) {}
export class AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification extends S.Class<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification>(
  "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification",
)({
  LaunchTemplateId: S.optional(S.String),
  LaunchTemplateName: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails extends S.Class<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails>(
  "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails",
)({
  InstanceType: S.optional(S.String),
  WeightedCapacity: S.optional(S.String),
}) {}
export const AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesList =
  S.Array(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesListDetails,
  );
export class AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails extends S.Class<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails>(
  "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails",
)({
  LaunchTemplateSpecification: S.optional(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateLaunchTemplateSpecification,
  ),
  Overrides: S.optional(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateOverridesList,
  ),
}) {}
export class AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails extends S.Class<AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails>(
  "AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails",
)({
  InstancesDistribution: S.optional(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyInstancesDistributionDetails,
  ),
  LaunchTemplate: S.optional(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyLaunchTemplateDetails,
  ),
}) {}
export class AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails extends S.Class<AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails>(
  "AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails",
)({ Value: S.optional(S.String) }) {}
export const AwsAutoScalingAutoScalingGroupAvailabilityZonesList = S.Array(
  AwsAutoScalingAutoScalingGroupAvailabilityZonesListDetails,
);
export class AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification extends S.Class<AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification>(
  "AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification",
)({
  LaunchTemplateId: S.optional(S.String),
  LaunchTemplateName: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class AwsAutoScalingAutoScalingGroupDetails extends S.Class<AwsAutoScalingAutoScalingGroupDetails>(
  "AwsAutoScalingAutoScalingGroupDetails",
)({
  LaunchConfigurationName: S.optional(S.String),
  LoadBalancerNames: S.optional(StringList),
  HealthCheckType: S.optional(S.String),
  HealthCheckGracePeriod: S.optional(S.Number),
  CreatedTime: S.optional(S.String),
  MixedInstancesPolicy: S.optional(
    AwsAutoScalingAutoScalingGroupMixedInstancesPolicyDetails,
  ),
  AvailabilityZones: S.optional(
    AwsAutoScalingAutoScalingGroupAvailabilityZonesList,
  ),
  LaunchTemplate: S.optional(
    AwsAutoScalingAutoScalingGroupLaunchTemplateLaunchTemplateSpecification,
  ),
  CapacityRebalance: S.optional(S.Boolean),
}) {}
export class AwsCodeBuildProjectArtifactsDetails extends S.Class<AwsCodeBuildProjectArtifactsDetails>(
  "AwsCodeBuildProjectArtifactsDetails",
)({
  ArtifactIdentifier: S.optional(S.String),
  EncryptionDisabled: S.optional(S.Boolean),
  Location: S.optional(S.String),
  Name: S.optional(S.String),
  NamespaceType: S.optional(S.String),
  OverrideArtifactName: S.optional(S.Boolean),
  Packaging: S.optional(S.String),
  Path: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsCodeBuildProjectArtifactsList = S.Array(
  AwsCodeBuildProjectArtifactsDetails,
);
export class AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails extends S.Class<AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails>(
  "AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const AwsCodeBuildProjectEnvironmentEnvironmentVariablesList = S.Array(
  AwsCodeBuildProjectEnvironmentEnvironmentVariablesDetails,
);
export class AwsCodeBuildProjectEnvironmentRegistryCredential extends S.Class<AwsCodeBuildProjectEnvironmentRegistryCredential>(
  "AwsCodeBuildProjectEnvironmentRegistryCredential",
)({
  Credential: S.optional(S.String),
  CredentialProvider: S.optional(S.String),
}) {}
export class AwsCodeBuildProjectEnvironment extends S.Class<AwsCodeBuildProjectEnvironment>(
  "AwsCodeBuildProjectEnvironment",
)({
  Certificate: S.optional(S.String),
  EnvironmentVariables: S.optional(
    AwsCodeBuildProjectEnvironmentEnvironmentVariablesList,
  ),
  PrivilegedMode: S.optional(S.Boolean),
  ImagePullCredentialsType: S.optional(S.String),
  RegistryCredential: S.optional(
    AwsCodeBuildProjectEnvironmentRegistryCredential,
  ),
  Type: S.optional(S.String),
}) {}
export class AwsCodeBuildProjectSource extends S.Class<AwsCodeBuildProjectSource>(
  "AwsCodeBuildProjectSource",
)({
  Type: S.optional(S.String),
  Location: S.optional(S.String),
  GitCloneDepth: S.optional(S.Number),
  InsecureSsl: S.optional(S.Boolean),
}) {}
export class AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails extends S.Class<AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails>(
  "AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails",
)({
  GroupName: S.optional(S.String),
  Status: S.optional(S.String),
  StreamName: S.optional(S.String),
}) {}
export class AwsCodeBuildProjectLogsConfigS3LogsDetails extends S.Class<AwsCodeBuildProjectLogsConfigS3LogsDetails>(
  "AwsCodeBuildProjectLogsConfigS3LogsDetails",
)({
  EncryptionDisabled: S.optional(S.Boolean),
  Location: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class AwsCodeBuildProjectLogsConfigDetails extends S.Class<AwsCodeBuildProjectLogsConfigDetails>(
  "AwsCodeBuildProjectLogsConfigDetails",
)({
  CloudWatchLogs: S.optional(
    AwsCodeBuildProjectLogsConfigCloudWatchLogsDetails,
  ),
  S3Logs: S.optional(AwsCodeBuildProjectLogsConfigS3LogsDetails),
}) {}
export const NonEmptyStringList = S.Array(S.String);
export class AwsCodeBuildProjectVpcConfig extends S.Class<AwsCodeBuildProjectVpcConfig>(
  "AwsCodeBuildProjectVpcConfig",
)({
  VpcId: S.optional(S.String),
  Subnets: S.optional(NonEmptyStringList),
  SecurityGroupIds: S.optional(NonEmptyStringList),
}) {}
export class AwsCodeBuildProjectDetails extends S.Class<AwsCodeBuildProjectDetails>(
  "AwsCodeBuildProjectDetails",
)({
  EncryptionKey: S.optional(S.String),
  Artifacts: S.optional(AwsCodeBuildProjectArtifactsList),
  Environment: S.optional(AwsCodeBuildProjectEnvironment),
  Name: S.optional(S.String),
  Source: S.optional(AwsCodeBuildProjectSource),
  ServiceRole: S.optional(S.String),
  LogsConfig: S.optional(AwsCodeBuildProjectLogsConfigDetails),
  VpcConfig: S.optional(AwsCodeBuildProjectVpcConfig),
  SecondaryArtifacts: S.optional(AwsCodeBuildProjectArtifactsList),
}) {}
export class AwsCloudFrontDistributionCacheBehavior extends S.Class<AwsCloudFrontDistributionCacheBehavior>(
  "AwsCloudFrontDistributionCacheBehavior",
)({ ViewerProtocolPolicy: S.optional(S.String) }) {}
export const AwsCloudFrontDistributionCacheBehaviorsItemList = S.Array(
  AwsCloudFrontDistributionCacheBehavior,
);
export class AwsCloudFrontDistributionCacheBehaviors extends S.Class<AwsCloudFrontDistributionCacheBehaviors>(
  "AwsCloudFrontDistributionCacheBehaviors",
)({ Items: S.optional(AwsCloudFrontDistributionCacheBehaviorsItemList) }) {}
export class AwsCloudFrontDistributionDefaultCacheBehavior extends S.Class<AwsCloudFrontDistributionDefaultCacheBehavior>(
  "AwsCloudFrontDistributionDefaultCacheBehavior",
)({ ViewerProtocolPolicy: S.optional(S.String) }) {}
export class AwsCloudFrontDistributionLogging extends S.Class<AwsCloudFrontDistributionLogging>(
  "AwsCloudFrontDistributionLogging",
)({
  Bucket: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  IncludeCookies: S.optional(S.Boolean),
  Prefix: S.optional(S.String),
}) {}
export class AwsCloudFrontDistributionOriginS3OriginConfig extends S.Class<AwsCloudFrontDistributionOriginS3OriginConfig>(
  "AwsCloudFrontDistributionOriginS3OriginConfig",
)({ OriginAccessIdentity: S.optional(S.String) }) {}
export class AwsCloudFrontDistributionOriginSslProtocols extends S.Class<AwsCloudFrontDistributionOriginSslProtocols>(
  "AwsCloudFrontDistributionOriginSslProtocols",
)({ Items: S.optional(NonEmptyStringList), Quantity: S.optional(S.Number) }) {}
export class AwsCloudFrontDistributionOriginCustomOriginConfig extends S.Class<AwsCloudFrontDistributionOriginCustomOriginConfig>(
  "AwsCloudFrontDistributionOriginCustomOriginConfig",
)({
  HttpPort: S.optional(S.Number),
  HttpsPort: S.optional(S.Number),
  OriginKeepaliveTimeout: S.optional(S.Number),
  OriginProtocolPolicy: S.optional(S.String),
  OriginReadTimeout: S.optional(S.Number),
  OriginSslProtocols: S.optional(AwsCloudFrontDistributionOriginSslProtocols),
}) {}
export class AwsCloudFrontDistributionOriginItem extends S.Class<AwsCloudFrontDistributionOriginItem>(
  "AwsCloudFrontDistributionOriginItem",
)({
  DomainName: S.optional(S.String),
  Id: S.optional(S.String),
  OriginPath: S.optional(S.String),
  S3OriginConfig: S.optional(AwsCloudFrontDistributionOriginS3OriginConfig),
  CustomOriginConfig: S.optional(
    AwsCloudFrontDistributionOriginCustomOriginConfig,
  ),
}) {}
export const AwsCloudFrontDistributionOriginItemList = S.Array(
  AwsCloudFrontDistributionOriginItem,
);
export class AwsCloudFrontDistributionOrigins extends S.Class<AwsCloudFrontDistributionOrigins>(
  "AwsCloudFrontDistributionOrigins",
)({ Items: S.optional(AwsCloudFrontDistributionOriginItemList) }) {}
export const AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList =
  S.Array(S.Number);
export class AwsCloudFrontDistributionOriginGroupFailoverStatusCodes extends S.Class<AwsCloudFrontDistributionOriginGroupFailoverStatusCodes>(
  "AwsCloudFrontDistributionOriginGroupFailoverStatusCodes",
)({
  Items: S.optional(
    AwsCloudFrontDistributionOriginGroupFailoverStatusCodesItemList,
  ),
  Quantity: S.optional(S.Number),
}) {}
export class AwsCloudFrontDistributionOriginGroupFailover extends S.Class<AwsCloudFrontDistributionOriginGroupFailover>(
  "AwsCloudFrontDistributionOriginGroupFailover",
)({
  StatusCodes: S.optional(
    AwsCloudFrontDistributionOriginGroupFailoverStatusCodes,
  ),
}) {}
export class AwsCloudFrontDistributionOriginGroup extends S.Class<AwsCloudFrontDistributionOriginGroup>(
  "AwsCloudFrontDistributionOriginGroup",
)({
  FailoverCriteria: S.optional(AwsCloudFrontDistributionOriginGroupFailover),
}) {}
export const AwsCloudFrontDistributionOriginGroupsItemList = S.Array(
  AwsCloudFrontDistributionOriginGroup,
);
export class AwsCloudFrontDistributionOriginGroups extends S.Class<AwsCloudFrontDistributionOriginGroups>(
  "AwsCloudFrontDistributionOriginGroups",
)({ Items: S.optional(AwsCloudFrontDistributionOriginGroupsItemList) }) {}
export class AwsCloudFrontDistributionViewerCertificate extends S.Class<AwsCloudFrontDistributionViewerCertificate>(
  "AwsCloudFrontDistributionViewerCertificate",
)({
  AcmCertificateArn: S.optional(S.String),
  Certificate: S.optional(S.String),
  CertificateSource: S.optional(S.String),
  CloudFrontDefaultCertificate: S.optional(S.Boolean),
  IamCertificateId: S.optional(S.String),
  MinimumProtocolVersion: S.optional(S.String),
  SslSupportMethod: S.optional(S.String),
}) {}
export class AwsCloudFrontDistributionDetails extends S.Class<AwsCloudFrontDistributionDetails>(
  "AwsCloudFrontDistributionDetails",
)({
  CacheBehaviors: S.optional(AwsCloudFrontDistributionCacheBehaviors),
  DefaultCacheBehavior: S.optional(
    AwsCloudFrontDistributionDefaultCacheBehavior,
  ),
  DefaultRootObject: S.optional(S.String),
  DomainName: S.optional(S.String),
  ETag: S.optional(S.String),
  LastModifiedTime: S.optional(S.String),
  Logging: S.optional(AwsCloudFrontDistributionLogging),
  Origins: S.optional(AwsCloudFrontDistributionOrigins),
  OriginGroups: S.optional(AwsCloudFrontDistributionOriginGroups),
  ViewerCertificate: S.optional(AwsCloudFrontDistributionViewerCertificate),
  Status: S.optional(S.String),
  WebAclId: S.optional(S.String),
}) {}
export class AwsEc2InstanceNetworkInterfacesDetails extends S.Class<AwsEc2InstanceNetworkInterfacesDetails>(
  "AwsEc2InstanceNetworkInterfacesDetails",
)({ NetworkInterfaceId: S.optional(S.String) }) {}
export const AwsEc2InstanceNetworkInterfacesList = S.Array(
  AwsEc2InstanceNetworkInterfacesDetails,
);
export class AwsEc2InstanceMetadataOptions extends S.Class<AwsEc2InstanceMetadataOptions>(
  "AwsEc2InstanceMetadataOptions",
)({
  HttpEndpoint: S.optional(S.String),
  HttpProtocolIpv6: S.optional(S.String),
  HttpPutResponseHopLimit: S.optional(S.Number),
  HttpTokens: S.optional(S.String),
  InstanceMetadataTags: S.optional(S.String),
}) {}
export class AwsEc2InstanceMonitoringDetails extends S.Class<AwsEc2InstanceMonitoringDetails>(
  "AwsEc2InstanceMonitoringDetails",
)({ State: S.optional(S.String) }) {}
export class AwsEc2InstanceDetails extends S.Class<AwsEc2InstanceDetails>(
  "AwsEc2InstanceDetails",
)({
  Type: S.optional(S.String),
  ImageId: S.optional(S.String),
  IpV4Addresses: S.optional(StringList),
  IpV6Addresses: S.optional(StringList),
  KeyName: S.optional(S.String),
  IamInstanceProfileArn: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  LaunchedAt: S.optional(S.String),
  NetworkInterfaces: S.optional(AwsEc2InstanceNetworkInterfacesList),
  VirtualizationType: S.optional(S.String),
  MetadataOptions: S.optional(AwsEc2InstanceMetadataOptions),
  Monitoring: S.optional(AwsEc2InstanceMonitoringDetails),
}) {}
export class AwsEc2NetworkInterfaceAttachment extends S.Class<AwsEc2NetworkInterfaceAttachment>(
  "AwsEc2NetworkInterfaceAttachment",
)({
  AttachTime: S.optional(S.String),
  AttachmentId: S.optional(S.String),
  DeleteOnTermination: S.optional(S.Boolean),
  DeviceIndex: S.optional(S.Number),
  InstanceId: S.optional(S.String),
  InstanceOwnerId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class AwsEc2NetworkInterfaceSecurityGroup extends S.Class<AwsEc2NetworkInterfaceSecurityGroup>(
  "AwsEc2NetworkInterfaceSecurityGroup",
)({ GroupName: S.optional(S.String), GroupId: S.optional(S.String) }) {}
export const AwsEc2NetworkInterfaceSecurityGroupList = S.Array(
  AwsEc2NetworkInterfaceSecurityGroup,
);
export class AwsEc2NetworkInterfaceIpV6AddressDetail extends S.Class<AwsEc2NetworkInterfaceIpV6AddressDetail>(
  "AwsEc2NetworkInterfaceIpV6AddressDetail",
)({ IpV6Address: S.optional(S.String) }) {}
export const AwsEc2NetworkInterfaceIpV6AddressList = S.Array(
  AwsEc2NetworkInterfaceIpV6AddressDetail,
);
export class AwsEc2NetworkInterfacePrivateIpAddressDetail extends S.Class<AwsEc2NetworkInterfacePrivateIpAddressDetail>(
  "AwsEc2NetworkInterfacePrivateIpAddressDetail",
)({
  PrivateIpAddress: S.optional(S.String),
  PrivateDnsName: S.optional(S.String),
}) {}
export const AwsEc2NetworkInterfacePrivateIpAddressList = S.Array(
  AwsEc2NetworkInterfacePrivateIpAddressDetail,
);
export class AwsEc2NetworkInterfaceDetails extends S.Class<AwsEc2NetworkInterfaceDetails>(
  "AwsEc2NetworkInterfaceDetails",
)({
  Attachment: S.optional(AwsEc2NetworkInterfaceAttachment),
  NetworkInterfaceId: S.optional(S.String),
  SecurityGroups: S.optional(AwsEc2NetworkInterfaceSecurityGroupList),
  SourceDestCheck: S.optional(S.Boolean),
  IpV6Addresses: S.optional(AwsEc2NetworkInterfaceIpV6AddressList),
  PrivateIpAddresses: S.optional(AwsEc2NetworkInterfacePrivateIpAddressList),
  PublicDnsName: S.optional(S.String),
  PublicIp: S.optional(S.String),
}) {}
export class AwsEc2SecurityGroupUserIdGroupPair extends S.Class<AwsEc2SecurityGroupUserIdGroupPair>(
  "AwsEc2SecurityGroupUserIdGroupPair",
)({
  GroupId: S.optional(S.String),
  GroupName: S.optional(S.String),
  PeeringStatus: S.optional(S.String),
  UserId: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcPeeringConnectionId: S.optional(S.String),
}) {}
export const AwsEc2SecurityGroupUserIdGroupPairList = S.Array(
  AwsEc2SecurityGroupUserIdGroupPair,
);
export class AwsEc2SecurityGroupIpRange extends S.Class<AwsEc2SecurityGroupIpRange>(
  "AwsEc2SecurityGroupIpRange",
)({ CidrIp: S.optional(S.String) }) {}
export const AwsEc2SecurityGroupIpRangeList = S.Array(
  AwsEc2SecurityGroupIpRange,
);
export class AwsEc2SecurityGroupIpv6Range extends S.Class<AwsEc2SecurityGroupIpv6Range>(
  "AwsEc2SecurityGroupIpv6Range",
)({ CidrIpv6: S.optional(S.String) }) {}
export const AwsEc2SecurityGroupIpv6RangeList = S.Array(
  AwsEc2SecurityGroupIpv6Range,
);
export class AwsEc2SecurityGroupPrefixListId extends S.Class<AwsEc2SecurityGroupPrefixListId>(
  "AwsEc2SecurityGroupPrefixListId",
)({ PrefixListId: S.optional(S.String) }) {}
export const AwsEc2SecurityGroupPrefixListIdList = S.Array(
  AwsEc2SecurityGroupPrefixListId,
);
export class AwsEc2SecurityGroupIpPermission extends S.Class<AwsEc2SecurityGroupIpPermission>(
  "AwsEc2SecurityGroupIpPermission",
)({
  IpProtocol: S.optional(S.String),
  FromPort: S.optional(S.Number),
  ToPort: S.optional(S.Number),
  UserIdGroupPairs: S.optional(AwsEc2SecurityGroupUserIdGroupPairList),
  IpRanges: S.optional(AwsEc2SecurityGroupIpRangeList),
  Ipv6Ranges: S.optional(AwsEc2SecurityGroupIpv6RangeList),
  PrefixListIds: S.optional(AwsEc2SecurityGroupPrefixListIdList),
}) {}
export const AwsEc2SecurityGroupIpPermissionList = S.Array(
  AwsEc2SecurityGroupIpPermission,
);
export class AwsEc2SecurityGroupDetails extends S.Class<AwsEc2SecurityGroupDetails>(
  "AwsEc2SecurityGroupDetails",
)({
  GroupName: S.optional(S.String),
  GroupId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  VpcId: S.optional(S.String),
  IpPermissions: S.optional(AwsEc2SecurityGroupIpPermissionList),
  IpPermissionsEgress: S.optional(AwsEc2SecurityGroupIpPermissionList),
}) {}
export class AwsEc2VolumeAttachment extends S.Class<AwsEc2VolumeAttachment>(
  "AwsEc2VolumeAttachment",
)({
  AttachTime: S.optional(S.String),
  DeleteOnTermination: S.optional(S.Boolean),
  InstanceId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AwsEc2VolumeAttachmentList = S.Array(AwsEc2VolumeAttachment);
export class AwsEc2VolumeDetails extends S.Class<AwsEc2VolumeDetails>(
  "AwsEc2VolumeDetails",
)({
  CreateTime: S.optional(S.String),
  DeviceName: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  Size: S.optional(S.Number),
  SnapshotId: S.optional(S.String),
  Status: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Attachments: S.optional(AwsEc2VolumeAttachmentList),
  VolumeId: S.optional(S.String),
  VolumeType: S.optional(S.String),
  VolumeScanStatus: S.optional(S.String),
}) {}
export class CidrBlockAssociation extends S.Class<CidrBlockAssociation>(
  "CidrBlockAssociation",
)({
  AssociationId: S.optional(S.String),
  CidrBlock: S.optional(S.String),
  CidrBlockState: S.optional(S.String),
}) {}
export const CidrBlockAssociationList = S.Array(CidrBlockAssociation);
export class Ipv6CidrBlockAssociation extends S.Class<Ipv6CidrBlockAssociation>(
  "Ipv6CidrBlockAssociation",
)({
  AssociationId: S.optional(S.String),
  Ipv6CidrBlock: S.optional(S.String),
  CidrBlockState: S.optional(S.String),
}) {}
export const Ipv6CidrBlockAssociationList = S.Array(Ipv6CidrBlockAssociation);
export class AwsEc2VpcDetails extends S.Class<AwsEc2VpcDetails>(
  "AwsEc2VpcDetails",
)({
  CidrBlockAssociationSet: S.optional(CidrBlockAssociationList),
  Ipv6CidrBlockAssociationSet: S.optional(Ipv6CidrBlockAssociationList),
  DhcpOptionsId: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class AwsEc2EipDetails extends S.Class<AwsEc2EipDetails>(
  "AwsEc2EipDetails",
)({
  InstanceId: S.optional(S.String),
  PublicIp: S.optional(S.String),
  AllocationId: S.optional(S.String),
  AssociationId: S.optional(S.String),
  Domain: S.optional(S.String),
  PublicIpv4Pool: S.optional(S.String),
  NetworkBorderGroup: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  NetworkInterfaceOwnerId: S.optional(S.String),
  PrivateIpAddress: S.optional(S.String),
}) {}
export class AwsEc2SubnetDetails extends S.Class<AwsEc2SubnetDetails>(
  "AwsEc2SubnetDetails",
)({
  AssignIpv6AddressOnCreation: S.optional(S.Boolean),
  AvailabilityZone: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  AvailableIpAddressCount: S.optional(S.Number),
  CidrBlock: S.optional(S.String),
  DefaultForAz: S.optional(S.Boolean),
  MapPublicIpOnLaunch: S.optional(S.Boolean),
  OwnerId: S.optional(S.String),
  State: S.optional(S.String),
  SubnetArn: S.optional(S.String),
  SubnetId: S.optional(S.String),
  VpcId: S.optional(S.String),
  Ipv6CidrBlockAssociationSet: S.optional(Ipv6CidrBlockAssociationList),
}) {}
export class AwsEc2NetworkAclAssociation extends S.Class<AwsEc2NetworkAclAssociation>(
  "AwsEc2NetworkAclAssociation",
)({
  NetworkAclAssociationId: S.optional(S.String),
  NetworkAclId: S.optional(S.String),
  SubnetId: S.optional(S.String),
}) {}
export const AwsEc2NetworkAclAssociationList = S.Array(
  AwsEc2NetworkAclAssociation,
);
export class IcmpTypeCode extends S.Class<IcmpTypeCode>("IcmpTypeCode")({
  Code: S.optional(S.Number),
  Type: S.optional(S.Number),
}) {}
export class PortRangeFromTo extends S.Class<PortRangeFromTo>(
  "PortRangeFromTo",
)({ From: S.optional(S.Number), To: S.optional(S.Number) }) {}
export class AwsEc2NetworkAclEntry extends S.Class<AwsEc2NetworkAclEntry>(
  "AwsEc2NetworkAclEntry",
)({
  CidrBlock: S.optional(S.String),
  Egress: S.optional(S.Boolean),
  IcmpTypeCode: S.optional(IcmpTypeCode),
  Ipv6CidrBlock: S.optional(S.String),
  PortRange: S.optional(PortRangeFromTo),
  Protocol: S.optional(S.String),
  RuleAction: S.optional(S.String),
  RuleNumber: S.optional(S.Number),
}) {}
export const AwsEc2NetworkAclEntryList = S.Array(AwsEc2NetworkAclEntry);
export class AwsEc2NetworkAclDetails extends S.Class<AwsEc2NetworkAclDetails>(
  "AwsEc2NetworkAclDetails",
)({
  IsDefault: S.optional(S.Boolean),
  NetworkAclId: S.optional(S.String),
  OwnerId: S.optional(S.String),
  VpcId: S.optional(S.String),
  Associations: S.optional(AwsEc2NetworkAclAssociationList),
  Entries: S.optional(AwsEc2NetworkAclEntryList),
}) {}
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ ZoneName: S.optional(S.String), SubnetId: S.optional(S.String) }) {}
export const AvailabilityZones = S.Array(AvailabilityZone);
export const SecurityGroups = S.Array(S.String);
export class LoadBalancerState extends S.Class<LoadBalancerState>(
  "LoadBalancerState",
)({ Code: S.optional(S.String), Reason: S.optional(S.String) }) {}
export class AwsElbv2LoadBalancerAttribute extends S.Class<AwsElbv2LoadBalancerAttribute>(
  "AwsElbv2LoadBalancerAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsElbv2LoadBalancerAttributes = S.Array(
  AwsElbv2LoadBalancerAttribute,
);
export class AwsElbv2LoadBalancerDetails extends S.Class<AwsElbv2LoadBalancerDetails>(
  "AwsElbv2LoadBalancerDetails",
)({
  AvailabilityZones: S.optional(AvailabilityZones),
  CanonicalHostedZoneId: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  DNSName: S.optional(S.String),
  IpAddressType: S.optional(S.String),
  Scheme: S.optional(S.String),
  SecurityGroups: S.optional(SecurityGroups),
  State: S.optional(LoadBalancerState),
  Type: S.optional(S.String),
  VpcId: S.optional(S.String),
  LoadBalancerAttributes: S.optional(AwsElbv2LoadBalancerAttributes),
}) {}
export class AwsElasticBeanstalkEnvironmentEnvironmentLink extends S.Class<AwsElasticBeanstalkEnvironmentEnvironmentLink>(
  "AwsElasticBeanstalkEnvironmentEnvironmentLink",
)({ EnvironmentName: S.optional(S.String), LinkName: S.optional(S.String) }) {}
export const AwsElasticBeanstalkEnvironmentEnvironmentLinks = S.Array(
  AwsElasticBeanstalkEnvironmentEnvironmentLink,
);
export class AwsElasticBeanstalkEnvironmentOptionSetting extends S.Class<AwsElasticBeanstalkEnvironmentOptionSetting>(
  "AwsElasticBeanstalkEnvironmentOptionSetting",
)({
  Namespace: S.optional(S.String),
  OptionName: S.optional(S.String),
  ResourceName: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const AwsElasticBeanstalkEnvironmentOptionSettings = S.Array(
  AwsElasticBeanstalkEnvironmentOptionSetting,
);
export class AwsElasticBeanstalkEnvironmentTier extends S.Class<AwsElasticBeanstalkEnvironmentTier>(
  "AwsElasticBeanstalkEnvironmentTier",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class AwsElasticBeanstalkEnvironmentDetails extends S.Class<AwsElasticBeanstalkEnvironmentDetails>(
  "AwsElasticBeanstalkEnvironmentDetails",
)({
  ApplicationName: S.optional(S.String),
  Cname: S.optional(S.String),
  DateCreated: S.optional(S.String),
  DateUpdated: S.optional(S.String),
  Description: S.optional(S.String),
  EndpointUrl: S.optional(S.String),
  EnvironmentArn: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  EnvironmentLinks: S.optional(AwsElasticBeanstalkEnvironmentEnvironmentLinks),
  EnvironmentName: S.optional(S.String),
  OptionSettings: S.optional(AwsElasticBeanstalkEnvironmentOptionSettings),
  PlatformArn: S.optional(S.String),
  SolutionStackName: S.optional(S.String),
  Status: S.optional(S.String),
  Tier: S.optional(AwsElasticBeanstalkEnvironmentTier),
  VersionLabel: S.optional(S.String),
}) {}
export class AwsElasticsearchDomainDomainEndpointOptions extends S.Class<AwsElasticsearchDomainDomainEndpointOptions>(
  "AwsElasticsearchDomainDomainEndpointOptions",
)({
  EnforceHTTPS: S.optional(S.Boolean),
  TLSSecurityPolicy: S.optional(S.String),
}) {}
export class AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails extends S.Class<AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails>(
  "AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails",
)({ AvailabilityZoneCount: S.optional(S.Number) }) {}
export class AwsElasticsearchDomainElasticsearchClusterConfigDetails extends S.Class<AwsElasticsearchDomainElasticsearchClusterConfigDetails>(
  "AwsElasticsearchDomainElasticsearchClusterConfigDetails",
)({
  DedicatedMasterCount: S.optional(S.Number),
  DedicatedMasterEnabled: S.optional(S.Boolean),
  DedicatedMasterType: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  InstanceType: S.optional(S.String),
  ZoneAwarenessConfig: S.optional(
    AwsElasticsearchDomainElasticsearchClusterConfigZoneAwarenessConfigDetails,
  ),
  ZoneAwarenessEnabled: S.optional(S.Boolean),
}) {}
export class AwsElasticsearchDomainEncryptionAtRestOptions extends S.Class<AwsElasticsearchDomainEncryptionAtRestOptions>(
  "AwsElasticsearchDomainEncryptionAtRestOptions",
)({ Enabled: S.optional(S.Boolean), KmsKeyId: S.optional(S.String) }) {}
export class AwsElasticsearchDomainLogPublishingOptionsLogConfig extends S.Class<AwsElasticsearchDomainLogPublishingOptionsLogConfig>(
  "AwsElasticsearchDomainLogPublishingOptionsLogConfig",
)({
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
}) {}
export class AwsElasticsearchDomainLogPublishingOptions extends S.Class<AwsElasticsearchDomainLogPublishingOptions>(
  "AwsElasticsearchDomainLogPublishingOptions",
)({
  IndexSlowLogs: S.optional(
    AwsElasticsearchDomainLogPublishingOptionsLogConfig,
  ),
  SearchSlowLogs: S.optional(
    AwsElasticsearchDomainLogPublishingOptionsLogConfig,
  ),
  AuditLogs: S.optional(AwsElasticsearchDomainLogPublishingOptionsLogConfig),
}) {}
export class AwsElasticsearchDomainNodeToNodeEncryptionOptions extends S.Class<AwsElasticsearchDomainNodeToNodeEncryptionOptions>(
  "AwsElasticsearchDomainNodeToNodeEncryptionOptions",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsElasticsearchDomainServiceSoftwareOptions extends S.Class<AwsElasticsearchDomainServiceSoftwareOptions>(
  "AwsElasticsearchDomainServiceSoftwareOptions",
)({
  AutomatedUpdateDate: S.optional(S.String),
  Cancellable: S.optional(S.Boolean),
  CurrentVersion: S.optional(S.String),
  Description: S.optional(S.String),
  NewVersion: S.optional(S.String),
  UpdateAvailable: S.optional(S.Boolean),
  UpdateStatus: S.optional(S.String),
}) {}
export class AwsElasticsearchDomainVPCOptions extends S.Class<AwsElasticsearchDomainVPCOptions>(
  "AwsElasticsearchDomainVPCOptions",
)({
  AvailabilityZones: S.optional(NonEmptyStringList),
  SecurityGroupIds: S.optional(NonEmptyStringList),
  SubnetIds: S.optional(NonEmptyStringList),
  VPCId: S.optional(S.String),
}) {}
export class AwsElasticsearchDomainDetails extends S.Class<AwsElasticsearchDomainDetails>(
  "AwsElasticsearchDomainDetails",
)({
  AccessPolicies: S.optional(S.String),
  DomainEndpointOptions: S.optional(
    AwsElasticsearchDomainDomainEndpointOptions,
  ),
  DomainId: S.optional(S.String),
  DomainName: S.optional(S.String),
  Endpoint: S.optional(S.String),
  Endpoints: S.optional(FieldMap),
  ElasticsearchVersion: S.optional(S.String),
  ElasticsearchClusterConfig: S.optional(
    AwsElasticsearchDomainElasticsearchClusterConfigDetails,
  ),
  EncryptionAtRestOptions: S.optional(
    AwsElasticsearchDomainEncryptionAtRestOptions,
  ),
  LogPublishingOptions: S.optional(AwsElasticsearchDomainLogPublishingOptions),
  NodeToNodeEncryptionOptions: S.optional(
    AwsElasticsearchDomainNodeToNodeEncryptionOptions,
  ),
  ServiceSoftwareOptions: S.optional(
    AwsElasticsearchDomainServiceSoftwareOptions,
  ),
  VPCOptions: S.optional(AwsElasticsearchDomainVPCOptions),
}) {}
export class AwsS3BucketServerSideEncryptionByDefault extends S.Class<AwsS3BucketServerSideEncryptionByDefault>(
  "AwsS3BucketServerSideEncryptionByDefault",
)({
  SSEAlgorithm: S.optional(S.String),
  KMSMasterKeyID: S.optional(S.String),
}) {}
export class AwsS3BucketServerSideEncryptionRule extends S.Class<AwsS3BucketServerSideEncryptionRule>(
  "AwsS3BucketServerSideEncryptionRule",
)({
  ApplyServerSideEncryptionByDefault: S.optional(
    AwsS3BucketServerSideEncryptionByDefault,
  ),
}) {}
export const AwsS3BucketServerSideEncryptionRules = S.Array(
  AwsS3BucketServerSideEncryptionRule,
);
export class AwsS3BucketServerSideEncryptionConfiguration extends S.Class<AwsS3BucketServerSideEncryptionConfiguration>(
  "AwsS3BucketServerSideEncryptionConfiguration",
)({ Rules: S.optional(AwsS3BucketServerSideEncryptionRules) }) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails",
)({ DaysAfterInitiation: S.optional(S.Number) }) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails",
)({
  Prefix: S.optional(S.String),
  Tag: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsTagDetails,
  ),
  Type: S.optional(S.String),
}) {}
export const AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList =
  S.Array(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsDetails,
  );
export class AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails",
)({
  Operands: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateOperandsList,
  ),
  Prefix: S.optional(S.String),
  Tag: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateTagDetails,
  ),
  Type: S.optional(S.String),
}) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails",
)({
  Predicate: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesFilterPredicateDetails,
  ),
}) {}
export class AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails",
)({ Days: S.optional(S.Number), StorageClass: S.optional(S.String) }) {}
export const AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList =
  S.Array(
    AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsDetails,
  );
export class AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails",
)({
  Date: S.optional(S.String),
  Days: S.optional(S.Number),
  StorageClass: S.optional(S.String),
}) {}
export const AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList =
  S.Array(AwsS3BucketBucketLifecycleConfigurationRulesTransitionsDetails);
export class AwsS3BucketBucketLifecycleConfigurationRulesDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationRulesDetails>(
  "AwsS3BucketBucketLifecycleConfigurationRulesDetails",
)({
  AbortIncompleteMultipartUpload: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesAbortIncompleteMultipartUploadDetails,
  ),
  ExpirationDate: S.optional(S.String),
  ExpirationInDays: S.optional(S.Number),
  ExpiredObjectDeleteMarker: S.optional(S.Boolean),
  Filter: S.optional(AwsS3BucketBucketLifecycleConfigurationRulesFilterDetails),
  ID: S.optional(S.String),
  NoncurrentVersionExpirationInDays: S.optional(S.Number),
  NoncurrentVersionTransitions: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesNoncurrentVersionTransitionsList,
  ),
  Prefix: S.optional(S.String),
  Status: S.optional(S.String),
  Transitions: S.optional(
    AwsS3BucketBucketLifecycleConfigurationRulesTransitionsList,
  ),
}) {}
export const AwsS3BucketBucketLifecycleConfigurationRulesList = S.Array(
  AwsS3BucketBucketLifecycleConfigurationRulesDetails,
);
export class AwsS3BucketBucketLifecycleConfigurationDetails extends S.Class<AwsS3BucketBucketLifecycleConfigurationDetails>(
  "AwsS3BucketBucketLifecycleConfigurationDetails",
)({ Rules: S.optional(AwsS3BucketBucketLifecycleConfigurationRulesList) }) {}
export class AwsS3AccountPublicAccessBlockDetails extends S.Class<AwsS3AccountPublicAccessBlockDetails>(
  "AwsS3AccountPublicAccessBlockDetails",
)({
  BlockPublicAcls: S.optional(S.Boolean),
  BlockPublicPolicy: S.optional(S.Boolean),
  IgnorePublicAcls: S.optional(S.Boolean),
  RestrictPublicBuckets: S.optional(S.Boolean),
}) {}
export class AwsS3BucketLoggingConfiguration extends S.Class<AwsS3BucketLoggingConfiguration>(
  "AwsS3BucketLoggingConfiguration",
)({
  DestinationBucketName: S.optional(S.String),
  LogFilePrefix: S.optional(S.String),
}) {}
export class AwsS3BucketWebsiteConfigurationRedirectTo extends S.Class<AwsS3BucketWebsiteConfigurationRedirectTo>(
  "AwsS3BucketWebsiteConfigurationRedirectTo",
)({ Hostname: S.optional(S.String), Protocol: S.optional(S.String) }) {}
export class AwsS3BucketWebsiteConfigurationRoutingRuleCondition extends S.Class<AwsS3BucketWebsiteConfigurationRoutingRuleCondition>(
  "AwsS3BucketWebsiteConfigurationRoutingRuleCondition",
)({
  HttpErrorCodeReturnedEquals: S.optional(S.String),
  KeyPrefixEquals: S.optional(S.String),
}) {}
export class AwsS3BucketWebsiteConfigurationRoutingRuleRedirect extends S.Class<AwsS3BucketWebsiteConfigurationRoutingRuleRedirect>(
  "AwsS3BucketWebsiteConfigurationRoutingRuleRedirect",
)({
  Hostname: S.optional(S.String),
  HttpRedirectCode: S.optional(S.String),
  Protocol: S.optional(S.String),
  ReplaceKeyPrefixWith: S.optional(S.String),
  ReplaceKeyWith: S.optional(S.String),
}) {}
export class AwsS3BucketWebsiteConfigurationRoutingRule extends S.Class<AwsS3BucketWebsiteConfigurationRoutingRule>(
  "AwsS3BucketWebsiteConfigurationRoutingRule",
)({
  Condition: S.optional(AwsS3BucketWebsiteConfigurationRoutingRuleCondition),
  Redirect: S.optional(AwsS3BucketWebsiteConfigurationRoutingRuleRedirect),
}) {}
export const AwsS3BucketWebsiteConfigurationRoutingRules = S.Array(
  AwsS3BucketWebsiteConfigurationRoutingRule,
);
export class AwsS3BucketWebsiteConfiguration extends S.Class<AwsS3BucketWebsiteConfiguration>(
  "AwsS3BucketWebsiteConfiguration",
)({
  ErrorDocument: S.optional(S.String),
  IndexDocumentSuffix: S.optional(S.String),
  RedirectAllRequestsTo: S.optional(AwsS3BucketWebsiteConfigurationRedirectTo),
  RoutingRules: S.optional(AwsS3BucketWebsiteConfigurationRoutingRules),
}) {}
export const AwsS3BucketNotificationConfigurationEvents = S.Array(S.String);
export class AwsS3BucketNotificationConfigurationS3KeyFilterRule extends S.Class<AwsS3BucketNotificationConfigurationS3KeyFilterRule>(
  "AwsS3BucketNotificationConfigurationS3KeyFilterRule",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsS3BucketNotificationConfigurationS3KeyFilterRules = S.Array(
  AwsS3BucketNotificationConfigurationS3KeyFilterRule,
);
export class AwsS3BucketNotificationConfigurationS3KeyFilter extends S.Class<AwsS3BucketNotificationConfigurationS3KeyFilter>(
  "AwsS3BucketNotificationConfigurationS3KeyFilter",
)({
  FilterRules: S.optional(AwsS3BucketNotificationConfigurationS3KeyFilterRules),
}) {}
export class AwsS3BucketNotificationConfigurationFilter extends S.Class<AwsS3BucketNotificationConfigurationFilter>(
  "AwsS3BucketNotificationConfigurationFilter",
)({
  S3KeyFilter: S.optional(AwsS3BucketNotificationConfigurationS3KeyFilter),
}) {}
export class AwsS3BucketNotificationConfigurationDetail extends S.Class<AwsS3BucketNotificationConfigurationDetail>(
  "AwsS3BucketNotificationConfigurationDetail",
)({
  Events: S.optional(AwsS3BucketNotificationConfigurationEvents),
  Filter: S.optional(AwsS3BucketNotificationConfigurationFilter),
  Destination: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsS3BucketNotificationConfigurationDetails = S.Array(
  AwsS3BucketNotificationConfigurationDetail,
);
export class AwsS3BucketNotificationConfiguration extends S.Class<AwsS3BucketNotificationConfiguration>(
  "AwsS3BucketNotificationConfiguration",
)({
  Configurations: S.optional(AwsS3BucketNotificationConfigurationDetails),
}) {}
export class AwsS3BucketBucketVersioningConfiguration extends S.Class<AwsS3BucketBucketVersioningConfiguration>(
  "AwsS3BucketBucketVersioningConfiguration",
)({
  IsMfaDeleteEnabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
}) {}
export class AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails extends S.Class<AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails>(
  "AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails",
)({
  Days: S.optional(S.Number),
  Mode: S.optional(S.String),
  Years: S.optional(S.Number),
}) {}
export class AwsS3BucketObjectLockConfigurationRuleDetails extends S.Class<AwsS3BucketObjectLockConfigurationRuleDetails>(
  "AwsS3BucketObjectLockConfigurationRuleDetails",
)({
  DefaultRetention: S.optional(
    AwsS3BucketObjectLockConfigurationRuleDefaultRetentionDetails,
  ),
}) {}
export class AwsS3BucketObjectLockConfiguration extends S.Class<AwsS3BucketObjectLockConfiguration>(
  "AwsS3BucketObjectLockConfiguration",
)({
  ObjectLockEnabled: S.optional(S.String),
  Rule: S.optional(AwsS3BucketObjectLockConfigurationRuleDetails),
}) {}
export class AwsS3BucketDetails extends S.Class<AwsS3BucketDetails>(
  "AwsS3BucketDetails",
)({
  OwnerId: S.optional(S.String),
  OwnerName: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  CreatedAt: S.optional(S.String),
  ServerSideEncryptionConfiguration: S.optional(
    AwsS3BucketServerSideEncryptionConfiguration,
  ),
  BucketLifecycleConfiguration: S.optional(
    AwsS3BucketBucketLifecycleConfigurationDetails,
  ),
  PublicAccessBlockConfiguration: S.optional(
    AwsS3AccountPublicAccessBlockDetails,
  ),
  AccessControlList: S.optional(S.String),
  BucketLoggingConfiguration: S.optional(AwsS3BucketLoggingConfiguration),
  BucketWebsiteConfiguration: S.optional(AwsS3BucketWebsiteConfiguration),
  BucketNotificationConfiguration: S.optional(
    AwsS3BucketNotificationConfiguration,
  ),
  BucketVersioningConfiguration: S.optional(
    AwsS3BucketBucketVersioningConfiguration,
  ),
  ObjectLockConfiguration: S.optional(AwsS3BucketObjectLockConfiguration),
  Name: S.optional(S.String),
}) {}
export class AwsS3ObjectDetails extends S.Class<AwsS3ObjectDetails>(
  "AwsS3ObjectDetails",
)({
  LastModified: S.optional(S.String),
  ETag: S.optional(S.String),
  VersionId: S.optional(S.String),
  ContentType: S.optional(S.String),
  ServerSideEncryption: S.optional(S.String),
  SSEKMSKeyId: S.optional(S.String),
}) {}
export class AwsSecretsManagerSecretRotationRules extends S.Class<AwsSecretsManagerSecretRotationRules>(
  "AwsSecretsManagerSecretRotationRules",
)({ AutomaticallyAfterDays: S.optional(S.Number) }) {}
export class AwsSecretsManagerSecretDetails extends S.Class<AwsSecretsManagerSecretDetails>(
  "AwsSecretsManagerSecretDetails",
)({
  RotationRules: S.optional(AwsSecretsManagerSecretRotationRules),
  RotationOccurredWithinFrequency: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  RotationEnabled: S.optional(S.Boolean),
  RotationLambdaArn: S.optional(S.String),
  Deleted: S.optional(S.Boolean),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class AwsIamAccessKeySessionContextAttributes extends S.Class<AwsIamAccessKeySessionContextAttributes>(
  "AwsIamAccessKeySessionContextAttributes",
)({
  MfaAuthenticated: S.optional(S.Boolean),
  CreationDate: S.optional(S.String),
}) {}
export class AwsIamAccessKeySessionContextSessionIssuer extends S.Class<AwsIamAccessKeySessionContextSessionIssuer>(
  "AwsIamAccessKeySessionContextSessionIssuer",
)({
  Type: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  Arn: S.optional(S.String),
  AccountId: S.optional(S.String),
  UserName: S.optional(S.String),
}) {}
export class AwsIamAccessKeySessionContext extends S.Class<AwsIamAccessKeySessionContext>(
  "AwsIamAccessKeySessionContext",
)({
  Attributes: S.optional(AwsIamAccessKeySessionContextAttributes),
  SessionIssuer: S.optional(AwsIamAccessKeySessionContextSessionIssuer),
}) {}
export class AwsIamAccessKeyDetails extends S.Class<AwsIamAccessKeyDetails>(
  "AwsIamAccessKeyDetails",
)({
  UserName: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  PrincipalType: S.optional(S.String),
  PrincipalName: S.optional(S.String),
  AccountId: S.optional(S.String),
  AccessKeyId: S.optional(S.String),
  SessionContext: S.optional(AwsIamAccessKeySessionContext),
}) {}
export class AwsIamAttachedManagedPolicy extends S.Class<AwsIamAttachedManagedPolicy>(
  "AwsIamAttachedManagedPolicy",
)({ PolicyName: S.optional(S.String), PolicyArn: S.optional(S.String) }) {}
export const AwsIamAttachedManagedPolicyList = S.Array(
  AwsIamAttachedManagedPolicy,
);
export class AwsIamPermissionsBoundary extends S.Class<AwsIamPermissionsBoundary>(
  "AwsIamPermissionsBoundary",
)({
  PermissionsBoundaryArn: S.optional(S.String),
  PermissionsBoundaryType: S.optional(S.String),
}) {}
export class AwsIamUserPolicy extends S.Class<AwsIamUserPolicy>(
  "AwsIamUserPolicy",
)({ PolicyName: S.optional(S.String) }) {}
export const AwsIamUserPolicyList = S.Array(AwsIamUserPolicy);
export class AwsIamUserDetails extends S.Class<AwsIamUserDetails>(
  "AwsIamUserDetails",
)({
  AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
  CreateDate: S.optional(S.String),
  GroupList: S.optional(StringList),
  Path: S.optional(S.String),
  PermissionsBoundary: S.optional(AwsIamPermissionsBoundary),
  UserId: S.optional(S.String),
  UserName: S.optional(S.String),
  UserPolicyList: S.optional(AwsIamUserPolicyList),
}) {}
export class AwsIamPolicyVersion extends S.Class<AwsIamPolicyVersion>(
  "AwsIamPolicyVersion",
)({
  VersionId: S.optional(S.String),
  IsDefaultVersion: S.optional(S.Boolean),
  CreateDate: S.optional(S.String),
}) {}
export const AwsIamPolicyVersionList = S.Array(AwsIamPolicyVersion);
export class AwsIamPolicyDetails extends S.Class<AwsIamPolicyDetails>(
  "AwsIamPolicyDetails",
)({
  AttachmentCount: S.optional(S.Number),
  CreateDate: S.optional(S.String),
  DefaultVersionId: S.optional(S.String),
  Description: S.optional(S.String),
  IsAttachable: S.optional(S.Boolean),
  Path: S.optional(S.String),
  PermissionsBoundaryUsageCount: S.optional(S.Number),
  PolicyId: S.optional(S.String),
  PolicyName: S.optional(S.String),
  PolicyVersionList: S.optional(AwsIamPolicyVersionList),
  UpdateDate: S.optional(S.String),
}) {}
export class AwsApiGatewayV2RouteSettings extends S.Class<AwsApiGatewayV2RouteSettings>(
  "AwsApiGatewayV2RouteSettings",
)({
  DetailedMetricsEnabled: S.optional(S.Boolean),
  LoggingLevel: S.optional(S.String),
  DataTraceEnabled: S.optional(S.Boolean),
  ThrottlingBurstLimit: S.optional(S.Number),
  ThrottlingRateLimit: S.optional(S.Number),
}) {}
export class AwsApiGatewayAccessLogSettings extends S.Class<AwsApiGatewayAccessLogSettings>(
  "AwsApiGatewayAccessLogSettings",
)({ Format: S.optional(S.String), DestinationArn: S.optional(S.String) }) {}
export class AwsApiGatewayV2StageDetails extends S.Class<AwsApiGatewayV2StageDetails>(
  "AwsApiGatewayV2StageDetails",
)({
  ClientCertificateId: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultRouteSettings: S.optional(AwsApiGatewayV2RouteSettings),
  DeploymentId: S.optional(S.String),
  LastUpdatedDate: S.optional(S.String),
  RouteSettings: S.optional(AwsApiGatewayV2RouteSettings),
  StageName: S.optional(S.String),
  StageVariables: S.optional(FieldMap),
  AccessLogSettings: S.optional(AwsApiGatewayAccessLogSettings),
  AutoDeploy: S.optional(S.Boolean),
  LastDeploymentStatusMessage: S.optional(S.String),
  ApiGatewayManaged: S.optional(S.Boolean),
}) {}
export class AwsCorsConfiguration extends S.Class<AwsCorsConfiguration>(
  "AwsCorsConfiguration",
)({
  AllowOrigins: S.optional(NonEmptyStringList),
  AllowCredentials: S.optional(S.Boolean),
  ExposeHeaders: S.optional(NonEmptyStringList),
  MaxAge: S.optional(S.Number),
  AllowMethods: S.optional(NonEmptyStringList),
  AllowHeaders: S.optional(NonEmptyStringList),
}) {}
export class AwsApiGatewayV2ApiDetails extends S.Class<AwsApiGatewayV2ApiDetails>(
  "AwsApiGatewayV2ApiDetails",
)({
  ApiEndpoint: S.optional(S.String),
  ApiId: S.optional(S.String),
  ApiKeySelectionExpression: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Description: S.optional(S.String),
  Version: S.optional(S.String),
  Name: S.optional(S.String),
  ProtocolType: S.optional(S.String),
  RouteSelectionExpression: S.optional(S.String),
  CorsConfiguration: S.optional(AwsCorsConfiguration),
}) {}
export class AwsDynamoDbTableAttributeDefinition extends S.Class<AwsDynamoDbTableAttributeDefinition>(
  "AwsDynamoDbTableAttributeDefinition",
)({
  AttributeName: S.optional(S.String),
  AttributeType: S.optional(S.String),
}) {}
export const AwsDynamoDbTableAttributeDefinitionList = S.Array(
  AwsDynamoDbTableAttributeDefinition,
);
export class AwsDynamoDbTableBillingModeSummary extends S.Class<AwsDynamoDbTableBillingModeSummary>(
  "AwsDynamoDbTableBillingModeSummary",
)({
  BillingMode: S.optional(S.String),
  LastUpdateToPayPerRequestDateTime: S.optional(S.String),
}) {}
export class AwsDynamoDbTableKeySchema extends S.Class<AwsDynamoDbTableKeySchema>(
  "AwsDynamoDbTableKeySchema",
)({ AttributeName: S.optional(S.String), KeyType: S.optional(S.String) }) {}
export const AwsDynamoDbTableKeySchemaList = S.Array(AwsDynamoDbTableKeySchema);
export class AwsDynamoDbTableProjection extends S.Class<AwsDynamoDbTableProjection>(
  "AwsDynamoDbTableProjection",
)({
  NonKeyAttributes: S.optional(StringList),
  ProjectionType: S.optional(S.String),
}) {}
export class AwsDynamoDbTableProvisionedThroughput extends S.Class<AwsDynamoDbTableProvisionedThroughput>(
  "AwsDynamoDbTableProvisionedThroughput",
)({
  LastDecreaseDateTime: S.optional(S.String),
  LastIncreaseDateTime: S.optional(S.String),
  NumberOfDecreasesToday: S.optional(S.Number),
  ReadCapacityUnits: S.optional(S.Number),
  WriteCapacityUnits: S.optional(S.Number),
}) {}
export class AwsDynamoDbTableGlobalSecondaryIndex extends S.Class<AwsDynamoDbTableGlobalSecondaryIndex>(
  "AwsDynamoDbTableGlobalSecondaryIndex",
)({
  Backfilling: S.optional(S.Boolean),
  IndexArn: S.optional(S.String),
  IndexName: S.optional(S.String),
  IndexSizeBytes: S.optional(S.Number),
  IndexStatus: S.optional(S.String),
  ItemCount: S.optional(S.Number),
  KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
  Projection: S.optional(AwsDynamoDbTableProjection),
  ProvisionedThroughput: S.optional(AwsDynamoDbTableProvisionedThroughput),
}) {}
export const AwsDynamoDbTableGlobalSecondaryIndexList = S.Array(
  AwsDynamoDbTableGlobalSecondaryIndex,
);
export class AwsDynamoDbTableLocalSecondaryIndex extends S.Class<AwsDynamoDbTableLocalSecondaryIndex>(
  "AwsDynamoDbTableLocalSecondaryIndex",
)({
  IndexArn: S.optional(S.String),
  IndexName: S.optional(S.String),
  KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
  Projection: S.optional(AwsDynamoDbTableProjection),
}) {}
export const AwsDynamoDbTableLocalSecondaryIndexList = S.Array(
  AwsDynamoDbTableLocalSecondaryIndex,
);
export class AwsDynamoDbTableProvisionedThroughputOverride extends S.Class<AwsDynamoDbTableProvisionedThroughputOverride>(
  "AwsDynamoDbTableProvisionedThroughputOverride",
)({ ReadCapacityUnits: S.optional(S.Number) }) {}
export class AwsDynamoDbTableReplicaGlobalSecondaryIndex extends S.Class<AwsDynamoDbTableReplicaGlobalSecondaryIndex>(
  "AwsDynamoDbTableReplicaGlobalSecondaryIndex",
)({
  IndexName: S.optional(S.String),
  ProvisionedThroughputOverride: S.optional(
    AwsDynamoDbTableProvisionedThroughputOverride,
  ),
}) {}
export const AwsDynamoDbTableReplicaGlobalSecondaryIndexList = S.Array(
  AwsDynamoDbTableReplicaGlobalSecondaryIndex,
);
export class AwsDynamoDbTableReplica extends S.Class<AwsDynamoDbTableReplica>(
  "AwsDynamoDbTableReplica",
)({
  GlobalSecondaryIndexes: S.optional(
    AwsDynamoDbTableReplicaGlobalSecondaryIndexList,
  ),
  KmsMasterKeyId: S.optional(S.String),
  ProvisionedThroughputOverride: S.optional(
    AwsDynamoDbTableProvisionedThroughputOverride,
  ),
  RegionName: S.optional(S.String),
  ReplicaStatus: S.optional(S.String),
  ReplicaStatusDescription: S.optional(S.String),
}) {}
export const AwsDynamoDbTableReplicaList = S.Array(AwsDynamoDbTableReplica);
export class AwsDynamoDbTableRestoreSummary extends S.Class<AwsDynamoDbTableRestoreSummary>(
  "AwsDynamoDbTableRestoreSummary",
)({
  SourceBackupArn: S.optional(S.String),
  SourceTableArn: S.optional(S.String),
  RestoreDateTime: S.optional(S.String),
  RestoreInProgress: S.optional(S.Boolean),
}) {}
export class AwsDynamoDbTableSseDescription extends S.Class<AwsDynamoDbTableSseDescription>(
  "AwsDynamoDbTableSseDescription",
)({
  InaccessibleEncryptionDateTime: S.optional(S.String),
  Status: S.optional(S.String),
  SseType: S.optional(S.String),
  KmsMasterKeyArn: S.optional(S.String),
}) {}
export class AwsDynamoDbTableStreamSpecification extends S.Class<AwsDynamoDbTableStreamSpecification>(
  "AwsDynamoDbTableStreamSpecification",
)({
  StreamEnabled: S.optional(S.Boolean),
  StreamViewType: S.optional(S.String),
}) {}
export class AwsDynamoDbTableDetails extends S.Class<AwsDynamoDbTableDetails>(
  "AwsDynamoDbTableDetails",
)({
  AttributeDefinitions: S.optional(AwsDynamoDbTableAttributeDefinitionList),
  BillingModeSummary: S.optional(AwsDynamoDbTableBillingModeSummary),
  CreationDateTime: S.optional(S.String),
  GlobalSecondaryIndexes: S.optional(AwsDynamoDbTableGlobalSecondaryIndexList),
  GlobalTableVersion: S.optional(S.String),
  ItemCount: S.optional(S.Number),
  KeySchema: S.optional(AwsDynamoDbTableKeySchemaList),
  LatestStreamArn: S.optional(S.String),
  LatestStreamLabel: S.optional(S.String),
  LocalSecondaryIndexes: S.optional(AwsDynamoDbTableLocalSecondaryIndexList),
  ProvisionedThroughput: S.optional(AwsDynamoDbTableProvisionedThroughput),
  Replicas: S.optional(AwsDynamoDbTableReplicaList),
  RestoreSummary: S.optional(AwsDynamoDbTableRestoreSummary),
  SseDescription: S.optional(AwsDynamoDbTableSseDescription),
  StreamSpecification: S.optional(AwsDynamoDbTableStreamSpecification),
  TableId: S.optional(S.String),
  TableName: S.optional(S.String),
  TableSizeBytes: S.optional(S.Number),
  TableStatus: S.optional(S.String),
  DeletionProtectionEnabled: S.optional(S.Boolean),
}) {}
export class AwsApiGatewayMethodSettings extends S.Class<AwsApiGatewayMethodSettings>(
  "AwsApiGatewayMethodSettings",
)({
  MetricsEnabled: S.optional(S.Boolean),
  LoggingLevel: S.optional(S.String),
  DataTraceEnabled: S.optional(S.Boolean),
  ThrottlingBurstLimit: S.optional(S.Number),
  ThrottlingRateLimit: S.optional(S.Number),
  CachingEnabled: S.optional(S.Boolean),
  CacheTtlInSeconds: S.optional(S.Number),
  CacheDataEncrypted: S.optional(S.Boolean),
  RequireAuthorizationForCacheControl: S.optional(S.Boolean),
  UnauthorizedCacheControlHeaderStrategy: S.optional(S.String),
  HttpMethod: S.optional(S.String),
  ResourcePath: S.optional(S.String),
}) {}
export const AwsApiGatewayMethodSettingsList = S.Array(
  AwsApiGatewayMethodSettings,
);
export class AwsApiGatewayCanarySettings extends S.Class<AwsApiGatewayCanarySettings>(
  "AwsApiGatewayCanarySettings",
)({
  PercentTraffic: S.optional(S.Number),
  DeploymentId: S.optional(S.String),
  StageVariableOverrides: S.optional(FieldMap),
  UseStageCache: S.optional(S.Boolean),
}) {}
export class AwsApiGatewayStageDetails extends S.Class<AwsApiGatewayStageDetails>(
  "AwsApiGatewayStageDetails",
)({
  DeploymentId: S.optional(S.String),
  ClientCertificateId: S.optional(S.String),
  StageName: S.optional(S.String),
  Description: S.optional(S.String),
  CacheClusterEnabled: S.optional(S.Boolean),
  CacheClusterSize: S.optional(S.String),
  CacheClusterStatus: S.optional(S.String),
  MethodSettings: S.optional(AwsApiGatewayMethodSettingsList),
  Variables: S.optional(FieldMap),
  DocumentationVersion: S.optional(S.String),
  AccessLogSettings: S.optional(AwsApiGatewayAccessLogSettings),
  CanarySettings: S.optional(AwsApiGatewayCanarySettings),
  TracingEnabled: S.optional(S.Boolean),
  CreatedDate: S.optional(S.String),
  LastUpdatedDate: S.optional(S.String),
  WebAclArn: S.optional(S.String),
}) {}
export class AwsApiGatewayEndpointConfiguration extends S.Class<AwsApiGatewayEndpointConfiguration>(
  "AwsApiGatewayEndpointConfiguration",
)({ Types: S.optional(NonEmptyStringList) }) {}
export class AwsApiGatewayRestApiDetails extends S.Class<AwsApiGatewayRestApiDetails>(
  "AwsApiGatewayRestApiDetails",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Version: S.optional(S.String),
  BinaryMediaTypes: S.optional(NonEmptyStringList),
  MinimumCompressionSize: S.optional(S.Number),
  ApiKeySource: S.optional(S.String),
  EndpointConfiguration: S.optional(AwsApiGatewayEndpointConfiguration),
}) {}
export class AwsCloudTrailTrailDetails extends S.Class<AwsCloudTrailTrailDetails>(
  "AwsCloudTrailTrailDetails",
)({
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  CloudWatchLogsRoleArn: S.optional(S.String),
  HasCustomEventSelectors: S.optional(S.Boolean),
  HomeRegion: S.optional(S.String),
  IncludeGlobalServiceEvents: S.optional(S.Boolean),
  IsMultiRegionTrail: S.optional(S.Boolean),
  IsOrganizationTrail: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  LogFileValidationEnabled: S.optional(S.Boolean),
  Name: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3KeyPrefix: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  SnsTopicName: S.optional(S.String),
  TrailArn: S.optional(S.String),
}) {}
export class AwsSsmComplianceSummary extends S.Class<AwsSsmComplianceSummary>(
  "AwsSsmComplianceSummary",
)({
  Status: S.optional(S.String),
  CompliantCriticalCount: S.optional(S.Number),
  CompliantHighCount: S.optional(S.Number),
  CompliantMediumCount: S.optional(S.Number),
  ExecutionType: S.optional(S.String),
  NonCompliantCriticalCount: S.optional(S.Number),
  CompliantInformationalCount: S.optional(S.Number),
  NonCompliantInformationalCount: S.optional(S.Number),
  CompliantUnspecifiedCount: S.optional(S.Number),
  NonCompliantLowCount: S.optional(S.Number),
  NonCompliantHighCount: S.optional(S.Number),
  CompliantLowCount: S.optional(S.Number),
  ComplianceType: S.optional(S.String),
  PatchBaselineId: S.optional(S.String),
  OverallSeverity: S.optional(S.String),
  NonCompliantMediumCount: S.optional(S.Number),
  NonCompliantUnspecifiedCount: S.optional(S.Number),
  PatchGroup: S.optional(S.String),
}) {}
export class AwsSsmPatch extends S.Class<AwsSsmPatch>("AwsSsmPatch")({
  ComplianceSummary: S.optional(AwsSsmComplianceSummary),
}) {}
export class AwsSsmPatchComplianceDetails extends S.Class<AwsSsmPatchComplianceDetails>(
  "AwsSsmPatchComplianceDetails",
)({ Patch: S.optional(AwsSsmPatch) }) {}
export class AwsCertificateManagerCertificateResourceRecord extends S.Class<AwsCertificateManagerCertificateResourceRecord>(
  "AwsCertificateManagerCertificateResourceRecord",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export class AwsCertificateManagerCertificateDomainValidationOption extends S.Class<AwsCertificateManagerCertificateDomainValidationOption>(
  "AwsCertificateManagerCertificateDomainValidationOption",
)({
  DomainName: S.optional(S.String),
  ResourceRecord: S.optional(AwsCertificateManagerCertificateResourceRecord),
  ValidationDomain: S.optional(S.String),
  ValidationEmails: S.optional(StringList),
  ValidationMethod: S.optional(S.String),
  ValidationStatus: S.optional(S.String),
}) {}
export const AwsCertificateManagerCertificateDomainValidationOptions = S.Array(
  AwsCertificateManagerCertificateDomainValidationOption,
);
export class AwsCertificateManagerCertificateExtendedKeyUsage extends S.Class<AwsCertificateManagerCertificateExtendedKeyUsage>(
  "AwsCertificateManagerCertificateExtendedKeyUsage",
)({ Name: S.optional(S.String), OId: S.optional(S.String) }) {}
export const AwsCertificateManagerCertificateExtendedKeyUsages = S.Array(
  AwsCertificateManagerCertificateExtendedKeyUsage,
);
export class AwsCertificateManagerCertificateKeyUsage extends S.Class<AwsCertificateManagerCertificateKeyUsage>(
  "AwsCertificateManagerCertificateKeyUsage",
)({ Name: S.optional(S.String) }) {}
export const AwsCertificateManagerCertificateKeyUsages = S.Array(
  AwsCertificateManagerCertificateKeyUsage,
);
export class AwsCertificateManagerCertificateOptions extends S.Class<AwsCertificateManagerCertificateOptions>(
  "AwsCertificateManagerCertificateOptions",
)({ CertificateTransparencyLoggingPreference: S.optional(S.String) }) {}
export class AwsCertificateManagerCertificateRenewalSummary extends S.Class<AwsCertificateManagerCertificateRenewalSummary>(
  "AwsCertificateManagerCertificateRenewalSummary",
)({
  DomainValidationOptions: S.optional(
    AwsCertificateManagerCertificateDomainValidationOptions,
  ),
  RenewalStatus: S.optional(S.String),
  RenewalStatusReason: S.optional(S.String),
  UpdatedAt: S.optional(S.String),
}) {}
export class AwsCertificateManagerCertificateDetails extends S.Class<AwsCertificateManagerCertificateDetails>(
  "AwsCertificateManagerCertificateDetails",
)({
  CertificateAuthorityArn: S.optional(S.String),
  CreatedAt: S.optional(S.String),
  DomainName: S.optional(S.String),
  DomainValidationOptions: S.optional(
    AwsCertificateManagerCertificateDomainValidationOptions,
  ),
  ExtendedKeyUsages: S.optional(
    AwsCertificateManagerCertificateExtendedKeyUsages,
  ),
  FailureReason: S.optional(S.String),
  ImportedAt: S.optional(S.String),
  InUseBy: S.optional(StringList),
  IssuedAt: S.optional(S.String),
  Issuer: S.optional(S.String),
  KeyAlgorithm: S.optional(S.String),
  KeyUsages: S.optional(AwsCertificateManagerCertificateKeyUsages),
  NotAfter: S.optional(S.String),
  NotBefore: S.optional(S.String),
  Options: S.optional(AwsCertificateManagerCertificateOptions),
  RenewalEligibility: S.optional(S.String),
  RenewalSummary: S.optional(AwsCertificateManagerCertificateRenewalSummary),
  Serial: S.optional(S.String),
  SignatureAlgorithm: S.optional(S.String),
  Status: S.optional(S.String),
  Subject: S.optional(S.String),
  SubjectAlternativeNames: S.optional(StringList),
  Type: S.optional(S.String),
}) {}
export class AwsRedshiftClusterClusterNode extends S.Class<AwsRedshiftClusterClusterNode>(
  "AwsRedshiftClusterClusterNode",
)({
  NodeRole: S.optional(S.String),
  PrivateIpAddress: S.optional(S.String),
  PublicIpAddress: S.optional(S.String),
}) {}
export const AwsRedshiftClusterClusterNodes = S.Array(
  AwsRedshiftClusterClusterNode,
);
export class AwsRedshiftClusterClusterParameterStatus extends S.Class<AwsRedshiftClusterClusterParameterStatus>(
  "AwsRedshiftClusterClusterParameterStatus",
)({
  ParameterName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
  ParameterApplyErrorDescription: S.optional(S.String),
}) {}
export const AwsRedshiftClusterClusterParameterStatusList = S.Array(
  AwsRedshiftClusterClusterParameterStatus,
);
export class AwsRedshiftClusterClusterParameterGroup extends S.Class<AwsRedshiftClusterClusterParameterGroup>(
  "AwsRedshiftClusterClusterParameterGroup",
)({
  ClusterParameterStatusList: S.optional(
    AwsRedshiftClusterClusterParameterStatusList,
  ),
  ParameterApplyStatus: S.optional(S.String),
  ParameterGroupName: S.optional(S.String),
}) {}
export const AwsRedshiftClusterClusterParameterGroups = S.Array(
  AwsRedshiftClusterClusterParameterGroup,
);
export class AwsRedshiftClusterClusterSecurityGroup extends S.Class<AwsRedshiftClusterClusterSecurityGroup>(
  "AwsRedshiftClusterClusterSecurityGroup",
)({
  ClusterSecurityGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AwsRedshiftClusterClusterSecurityGroups = S.Array(
  AwsRedshiftClusterClusterSecurityGroup,
);
export class AwsRedshiftClusterClusterSnapshotCopyStatus extends S.Class<AwsRedshiftClusterClusterSnapshotCopyStatus>(
  "AwsRedshiftClusterClusterSnapshotCopyStatus",
)({
  DestinationRegion: S.optional(S.String),
  ManualSnapshotRetentionPeriod: S.optional(S.Number),
  RetentionPeriod: S.optional(S.Number),
  SnapshotCopyGrantName: S.optional(S.String),
}) {}
export class AwsRedshiftClusterDeferredMaintenanceWindow extends S.Class<AwsRedshiftClusterDeferredMaintenanceWindow>(
  "AwsRedshiftClusterDeferredMaintenanceWindow",
)({
  DeferMaintenanceEndTime: S.optional(S.String),
  DeferMaintenanceIdentifier: S.optional(S.String),
  DeferMaintenanceStartTime: S.optional(S.String),
}) {}
export const AwsRedshiftClusterDeferredMaintenanceWindows = S.Array(
  AwsRedshiftClusterDeferredMaintenanceWindow,
);
export class AwsRedshiftClusterElasticIpStatus extends S.Class<AwsRedshiftClusterElasticIpStatus>(
  "AwsRedshiftClusterElasticIpStatus",
)({ ElasticIp: S.optional(S.String), Status: S.optional(S.String) }) {}
export class AwsRedshiftClusterEndpoint extends S.Class<AwsRedshiftClusterEndpoint>(
  "AwsRedshiftClusterEndpoint",
)({ Address: S.optional(S.String), Port: S.optional(S.Number) }) {}
export class AwsRedshiftClusterHsmStatus extends S.Class<AwsRedshiftClusterHsmStatus>(
  "AwsRedshiftClusterHsmStatus",
)({
  HsmClientCertificateIdentifier: S.optional(S.String),
  HsmConfigurationIdentifier: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class AwsRedshiftClusterIamRole extends S.Class<AwsRedshiftClusterIamRole>(
  "AwsRedshiftClusterIamRole",
)({ ApplyStatus: S.optional(S.String), IamRoleArn: S.optional(S.String) }) {}
export const AwsRedshiftClusterIamRoles = S.Array(AwsRedshiftClusterIamRole);
export class AwsRedshiftClusterPendingModifiedValues extends S.Class<AwsRedshiftClusterPendingModifiedValues>(
  "AwsRedshiftClusterPendingModifiedValues",
)({
  AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
  ClusterIdentifier: S.optional(S.String),
  ClusterType: S.optional(S.String),
  ClusterVersion: S.optional(S.String),
  EncryptionType: S.optional(S.String),
  EnhancedVpcRouting: S.optional(S.Boolean),
  MaintenanceTrackName: S.optional(S.String),
  MasterUserPassword: S.optional(S.String),
  NodeType: S.optional(S.String),
  NumberOfNodes: S.optional(S.Number),
  PubliclyAccessible: S.optional(S.Boolean),
}) {}
export class AwsRedshiftClusterResizeInfo extends S.Class<AwsRedshiftClusterResizeInfo>(
  "AwsRedshiftClusterResizeInfo",
)({
  AllowCancelResize: S.optional(S.Boolean),
  ResizeType: S.optional(S.String),
}) {}
export class AwsRedshiftClusterRestoreStatus extends S.Class<AwsRedshiftClusterRestoreStatus>(
  "AwsRedshiftClusterRestoreStatus",
)({
  CurrentRestoreRateInMegaBytesPerSecond: S.optional(S.Number),
  ElapsedTimeInSeconds: S.optional(S.Number),
  EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
  ProgressInMegaBytes: S.optional(S.Number),
  SnapshotSizeInMegaBytes: S.optional(S.Number),
  Status: S.optional(S.String),
}) {}
export class AwsRedshiftClusterVpcSecurityGroup extends S.Class<AwsRedshiftClusterVpcSecurityGroup>(
  "AwsRedshiftClusterVpcSecurityGroup",
)({ Status: S.optional(S.String), VpcSecurityGroupId: S.optional(S.String) }) {}
export const AwsRedshiftClusterVpcSecurityGroups = S.Array(
  AwsRedshiftClusterVpcSecurityGroup,
);
export class AwsRedshiftClusterLoggingStatus extends S.Class<AwsRedshiftClusterLoggingStatus>(
  "AwsRedshiftClusterLoggingStatus",
)({
  BucketName: S.optional(S.String),
  LastFailureMessage: S.optional(S.String),
  LastFailureTime: S.optional(S.String),
  LastSuccessfulDeliveryTime: S.optional(S.String),
  LoggingEnabled: S.optional(S.Boolean),
  S3KeyPrefix: S.optional(S.String),
}) {}
export class AwsRedshiftClusterDetails extends S.Class<AwsRedshiftClusterDetails>(
  "AwsRedshiftClusterDetails",
)({
  AllowVersionUpgrade: S.optional(S.Boolean),
  AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  ClusterAvailabilityStatus: S.optional(S.String),
  ClusterCreateTime: S.optional(S.String),
  ClusterIdentifier: S.optional(S.String),
  ClusterNodes: S.optional(AwsRedshiftClusterClusterNodes),
  ClusterParameterGroups: S.optional(AwsRedshiftClusterClusterParameterGroups),
  ClusterPublicKey: S.optional(S.String),
  ClusterRevisionNumber: S.optional(S.String),
  ClusterSecurityGroups: S.optional(AwsRedshiftClusterClusterSecurityGroups),
  ClusterSnapshotCopyStatus: S.optional(
    AwsRedshiftClusterClusterSnapshotCopyStatus,
  ),
  ClusterStatus: S.optional(S.String),
  ClusterSubnetGroupName: S.optional(S.String),
  ClusterVersion: S.optional(S.String),
  DBName: S.optional(S.String),
  DeferredMaintenanceWindows: S.optional(
    AwsRedshiftClusterDeferredMaintenanceWindows,
  ),
  ElasticIpStatus: S.optional(AwsRedshiftClusterElasticIpStatus),
  ElasticResizeNumberOfNodeOptions: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  Endpoint: S.optional(AwsRedshiftClusterEndpoint),
  EnhancedVpcRouting: S.optional(S.Boolean),
  ExpectedNextSnapshotScheduleTime: S.optional(S.String),
  ExpectedNextSnapshotScheduleTimeStatus: S.optional(S.String),
  HsmStatus: S.optional(AwsRedshiftClusterHsmStatus),
  IamRoles: S.optional(AwsRedshiftClusterIamRoles),
  KmsKeyId: S.optional(S.String),
  MaintenanceTrackName: S.optional(S.String),
  ManualSnapshotRetentionPeriod: S.optional(S.Number),
  MasterUsername: S.optional(S.String),
  NextMaintenanceWindowStartTime: S.optional(S.String),
  NodeType: S.optional(S.String),
  NumberOfNodes: S.optional(S.Number),
  PendingActions: S.optional(StringList),
  PendingModifiedValues: S.optional(AwsRedshiftClusterPendingModifiedValues),
  PreferredMaintenanceWindow: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  ResizeInfo: S.optional(AwsRedshiftClusterResizeInfo),
  RestoreStatus: S.optional(AwsRedshiftClusterRestoreStatus),
  SnapshotScheduleIdentifier: S.optional(S.String),
  SnapshotScheduleState: S.optional(S.String),
  VpcId: S.optional(S.String),
  VpcSecurityGroups: S.optional(AwsRedshiftClusterVpcSecurityGroups),
  LoggingStatus: S.optional(AwsRedshiftClusterLoggingStatus),
}) {}
export class AwsElbLoadBalancerBackendServerDescription extends S.Class<AwsElbLoadBalancerBackendServerDescription>(
  "AwsElbLoadBalancerBackendServerDescription",
)({
  InstancePort: S.optional(S.Number),
  PolicyNames: S.optional(StringList),
}) {}
export const AwsElbLoadBalancerBackendServerDescriptions = S.Array(
  AwsElbLoadBalancerBackendServerDescription,
);
export class AwsElbLoadBalancerHealthCheck extends S.Class<AwsElbLoadBalancerHealthCheck>(
  "AwsElbLoadBalancerHealthCheck",
)({
  HealthyThreshold: S.optional(S.Number),
  Interval: S.optional(S.Number),
  Target: S.optional(S.String),
  Timeout: S.optional(S.Number),
  UnhealthyThreshold: S.optional(S.Number),
}) {}
export class AwsElbLoadBalancerInstance extends S.Class<AwsElbLoadBalancerInstance>(
  "AwsElbLoadBalancerInstance",
)({ InstanceId: S.optional(S.String) }) {}
export const AwsElbLoadBalancerInstances = S.Array(AwsElbLoadBalancerInstance);
export class AwsElbLoadBalancerListener extends S.Class<AwsElbLoadBalancerListener>(
  "AwsElbLoadBalancerListener",
)({
  InstancePort: S.optional(S.Number),
  InstanceProtocol: S.optional(S.String),
  LoadBalancerPort: S.optional(S.Number),
  Protocol: S.optional(S.String),
  SslCertificateId: S.optional(S.String),
}) {}
export class AwsElbLoadBalancerListenerDescription extends S.Class<AwsElbLoadBalancerListenerDescription>(
  "AwsElbLoadBalancerListenerDescription",
)({
  Listener: S.optional(AwsElbLoadBalancerListener),
  PolicyNames: S.optional(StringList),
}) {}
export const AwsElbLoadBalancerListenerDescriptions = S.Array(
  AwsElbLoadBalancerListenerDescription,
);
export class AwsElbLoadBalancerAccessLog extends S.Class<AwsElbLoadBalancerAccessLog>(
  "AwsElbLoadBalancerAccessLog",
)({
  EmitInterval: S.optional(S.Number),
  Enabled: S.optional(S.Boolean),
  S3BucketName: S.optional(S.String),
  S3BucketPrefix: S.optional(S.String),
}) {}
export class AwsElbLoadBalancerConnectionDraining extends S.Class<AwsElbLoadBalancerConnectionDraining>(
  "AwsElbLoadBalancerConnectionDraining",
)({ Enabled: S.optional(S.Boolean), Timeout: S.optional(S.Number) }) {}
export class AwsElbLoadBalancerConnectionSettings extends S.Class<AwsElbLoadBalancerConnectionSettings>(
  "AwsElbLoadBalancerConnectionSettings",
)({ IdleTimeout: S.optional(S.Number) }) {}
export class AwsElbLoadBalancerCrossZoneLoadBalancing extends S.Class<AwsElbLoadBalancerCrossZoneLoadBalancing>(
  "AwsElbLoadBalancerCrossZoneLoadBalancing",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsElbLoadBalancerAdditionalAttribute extends S.Class<AwsElbLoadBalancerAdditionalAttribute>(
  "AwsElbLoadBalancerAdditionalAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsElbLoadBalancerAdditionalAttributeList = S.Array(
  AwsElbLoadBalancerAdditionalAttribute,
);
export class AwsElbLoadBalancerAttributes extends S.Class<AwsElbLoadBalancerAttributes>(
  "AwsElbLoadBalancerAttributes",
)({
  AccessLog: S.optional(AwsElbLoadBalancerAccessLog),
  ConnectionDraining: S.optional(AwsElbLoadBalancerConnectionDraining),
  ConnectionSettings: S.optional(AwsElbLoadBalancerConnectionSettings),
  CrossZoneLoadBalancing: S.optional(AwsElbLoadBalancerCrossZoneLoadBalancing),
  AdditionalAttributes: S.optional(AwsElbLoadBalancerAdditionalAttributeList),
}) {}
export class AwsElbAppCookieStickinessPolicy extends S.Class<AwsElbAppCookieStickinessPolicy>(
  "AwsElbAppCookieStickinessPolicy",
)({ CookieName: S.optional(S.String), PolicyName: S.optional(S.String) }) {}
export const AwsElbAppCookieStickinessPolicies = S.Array(
  AwsElbAppCookieStickinessPolicy,
);
export class AwsElbLbCookieStickinessPolicy extends S.Class<AwsElbLbCookieStickinessPolicy>(
  "AwsElbLbCookieStickinessPolicy",
)({
  CookieExpirationPeriod: S.optional(S.Number),
  PolicyName: S.optional(S.String),
}) {}
export const AwsElbLbCookieStickinessPolicies = S.Array(
  AwsElbLbCookieStickinessPolicy,
);
export class AwsElbLoadBalancerPolicies extends S.Class<AwsElbLoadBalancerPolicies>(
  "AwsElbLoadBalancerPolicies",
)({
  AppCookieStickinessPolicies: S.optional(AwsElbAppCookieStickinessPolicies),
  LbCookieStickinessPolicies: S.optional(AwsElbLbCookieStickinessPolicies),
  OtherPolicies: S.optional(StringList),
}) {}
export class AwsElbLoadBalancerSourceSecurityGroup extends S.Class<AwsElbLoadBalancerSourceSecurityGroup>(
  "AwsElbLoadBalancerSourceSecurityGroup",
)({ GroupName: S.optional(S.String), OwnerAlias: S.optional(S.String) }) {}
export class AwsElbLoadBalancerDetails extends S.Class<AwsElbLoadBalancerDetails>(
  "AwsElbLoadBalancerDetails",
)({
  AvailabilityZones: S.optional(StringList),
  BackendServerDescriptions: S.optional(
    AwsElbLoadBalancerBackendServerDescriptions,
  ),
  CanonicalHostedZoneName: S.optional(S.String),
  CanonicalHostedZoneNameID: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  DnsName: S.optional(S.String),
  HealthCheck: S.optional(AwsElbLoadBalancerHealthCheck),
  Instances: S.optional(AwsElbLoadBalancerInstances),
  ListenerDescriptions: S.optional(AwsElbLoadBalancerListenerDescriptions),
  LoadBalancerAttributes: S.optional(AwsElbLoadBalancerAttributes),
  LoadBalancerName: S.optional(S.String),
  Policies: S.optional(AwsElbLoadBalancerPolicies),
  Scheme: S.optional(S.String),
  SecurityGroups: S.optional(StringList),
  SourceSecurityGroup: S.optional(AwsElbLoadBalancerSourceSecurityGroup),
  Subnets: S.optional(StringList),
  VpcId: S.optional(S.String),
}) {}
export class AwsIamGroupPolicy extends S.Class<AwsIamGroupPolicy>(
  "AwsIamGroupPolicy",
)({ PolicyName: S.optional(S.String) }) {}
export const AwsIamGroupPolicyList = S.Array(AwsIamGroupPolicy);
export class AwsIamGroupDetails extends S.Class<AwsIamGroupDetails>(
  "AwsIamGroupDetails",
)({
  AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
  CreateDate: S.optional(S.String),
  GroupId: S.optional(S.String),
  GroupName: S.optional(S.String),
  GroupPolicyList: S.optional(AwsIamGroupPolicyList),
  Path: S.optional(S.String),
}) {}
export class AwsIamInstanceProfileRole extends S.Class<AwsIamInstanceProfileRole>(
  "AwsIamInstanceProfileRole",
)({
  Arn: S.optional(S.String),
  AssumeRolePolicyDocument: S.optional(S.String),
  CreateDate: S.optional(S.String),
  Path: S.optional(S.String),
  RoleId: S.optional(S.String),
  RoleName: S.optional(S.String),
}) {}
export const AwsIamInstanceProfileRoles = S.Array(AwsIamInstanceProfileRole);
export class AwsIamInstanceProfile extends S.Class<AwsIamInstanceProfile>(
  "AwsIamInstanceProfile",
)({
  Arn: S.optional(S.String),
  CreateDate: S.optional(S.String),
  InstanceProfileId: S.optional(S.String),
  InstanceProfileName: S.optional(S.String),
  Path: S.optional(S.String),
  Roles: S.optional(AwsIamInstanceProfileRoles),
}) {}
export const AwsIamInstanceProfileList = S.Array(AwsIamInstanceProfile);
export class AwsIamRolePolicy extends S.Class<AwsIamRolePolicy>(
  "AwsIamRolePolicy",
)({ PolicyName: S.optional(S.String) }) {}
export const AwsIamRolePolicyList = S.Array(AwsIamRolePolicy);
export class AwsIamRoleDetails extends S.Class<AwsIamRoleDetails>(
  "AwsIamRoleDetails",
)({
  AssumeRolePolicyDocument: S.optional(S.String),
  AttachedManagedPolicies: S.optional(AwsIamAttachedManagedPolicyList),
  CreateDate: S.optional(S.String),
  InstanceProfileList: S.optional(AwsIamInstanceProfileList),
  PermissionsBoundary: S.optional(AwsIamPermissionsBoundary),
  RoleId: S.optional(S.String),
  RoleName: S.optional(S.String),
  RolePolicyList: S.optional(AwsIamRolePolicyList),
  MaxSessionDuration: S.optional(S.Number),
  Path: S.optional(S.String),
}) {}
export class AwsKmsKeyDetails extends S.Class<AwsKmsKeyDetails>(
  "AwsKmsKeyDetails",
)({
  AWSAccountId: S.optional(S.String),
  CreationDate: S.optional(S.Number),
  KeyId: S.optional(S.String),
  KeyManager: S.optional(S.String),
  KeyState: S.optional(S.String),
  Origin: S.optional(S.String),
  Description: S.optional(S.String),
  KeyRotationStatus: S.optional(S.Boolean),
}) {}
export class AwsLambdaFunctionCode extends S.Class<AwsLambdaFunctionCode>(
  "AwsLambdaFunctionCode",
)({
  S3Bucket: S.optional(S.String),
  S3Key: S.optional(S.String),
  S3ObjectVersion: S.optional(S.String),
  ZipFile: S.optional(S.String),
}) {}
export class AwsLambdaFunctionDeadLetterConfig extends S.Class<AwsLambdaFunctionDeadLetterConfig>(
  "AwsLambdaFunctionDeadLetterConfig",
)({ TargetArn: S.optional(S.String) }) {}
export class AwsLambdaFunctionEnvironmentError extends S.Class<AwsLambdaFunctionEnvironmentError>(
  "AwsLambdaFunctionEnvironmentError",
)({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }) {}
export class AwsLambdaFunctionEnvironment extends S.Class<AwsLambdaFunctionEnvironment>(
  "AwsLambdaFunctionEnvironment",
)({
  Variables: S.optional(FieldMap),
  Error: S.optional(AwsLambdaFunctionEnvironmentError),
}) {}
export class AwsLambdaFunctionLayer extends S.Class<AwsLambdaFunctionLayer>(
  "AwsLambdaFunctionLayer",
)({ Arn: S.optional(S.String), CodeSize: S.optional(S.Number) }) {}
export const AwsLambdaFunctionLayerList = S.Array(AwsLambdaFunctionLayer);
export class AwsLambdaFunctionTracingConfig extends S.Class<AwsLambdaFunctionTracingConfig>(
  "AwsLambdaFunctionTracingConfig",
)({ Mode: S.optional(S.String) }) {}
export class AwsLambdaFunctionVpcConfig extends S.Class<AwsLambdaFunctionVpcConfig>(
  "AwsLambdaFunctionVpcConfig",
)({
  SecurityGroupIds: S.optional(NonEmptyStringList),
  SubnetIds: S.optional(NonEmptyStringList),
  VpcId: S.optional(S.String),
}) {}
export class AwsLambdaFunctionDetails extends S.Class<AwsLambdaFunctionDetails>(
  "AwsLambdaFunctionDetails",
)({
  Code: S.optional(AwsLambdaFunctionCode),
  CodeSha256: S.optional(S.String),
  DeadLetterConfig: S.optional(AwsLambdaFunctionDeadLetterConfig),
  Environment: S.optional(AwsLambdaFunctionEnvironment),
  FunctionName: S.optional(S.String),
  Handler: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  LastModified: S.optional(S.String),
  Layers: S.optional(AwsLambdaFunctionLayerList),
  MasterArn: S.optional(S.String),
  MemorySize: S.optional(S.Number),
  RevisionId: S.optional(S.String),
  Role: S.optional(S.String),
  Runtime: S.optional(S.String),
  Timeout: S.optional(S.Number),
  TracingConfig: S.optional(AwsLambdaFunctionTracingConfig),
  VpcConfig: S.optional(AwsLambdaFunctionVpcConfig),
  Version: S.optional(S.String),
  Architectures: S.optional(NonEmptyStringList),
  PackageType: S.optional(S.String),
}) {}
export class AwsLambdaLayerVersionDetails extends S.Class<AwsLambdaLayerVersionDetails>(
  "AwsLambdaLayerVersionDetails",
)({
  Version: S.optional(S.Number),
  CompatibleRuntimes: S.optional(NonEmptyStringList),
  CreatedDate: S.optional(S.String),
}) {}
export class AwsRdsDbInstanceAssociatedRole extends S.Class<AwsRdsDbInstanceAssociatedRole>(
  "AwsRdsDbInstanceAssociatedRole",
)({
  RoleArn: S.optional(S.String),
  FeatureName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AwsRdsDbInstanceAssociatedRoles = S.Array(
  AwsRdsDbInstanceAssociatedRole,
);
export class AwsRdsDbInstanceEndpoint extends S.Class<AwsRdsDbInstanceEndpoint>(
  "AwsRdsDbInstanceEndpoint",
)({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
  HostedZoneId: S.optional(S.String),
}) {}
export class AwsRdsDbInstanceVpcSecurityGroup extends S.Class<AwsRdsDbInstanceVpcSecurityGroup>(
  "AwsRdsDbInstanceVpcSecurityGroup",
)({ VpcSecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const AwsRdsDbInstanceVpcSecurityGroups = S.Array(
  AwsRdsDbInstanceVpcSecurityGroup,
);
export class AwsRdsDbParameterGroup extends S.Class<AwsRdsDbParameterGroup>(
  "AwsRdsDbParameterGroup",
)({
  DbParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
}) {}
export const AwsRdsDbParameterGroups = S.Array(AwsRdsDbParameterGroup);
export class AwsRdsDbSubnetGroupSubnetAvailabilityZone extends S.Class<AwsRdsDbSubnetGroupSubnetAvailabilityZone>(
  "AwsRdsDbSubnetGroupSubnetAvailabilityZone",
)({ Name: S.optional(S.String) }) {}
export class AwsRdsDbSubnetGroupSubnet extends S.Class<AwsRdsDbSubnetGroupSubnet>(
  "AwsRdsDbSubnetGroupSubnet",
)({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AwsRdsDbSubnetGroupSubnetAvailabilityZone),
  SubnetStatus: S.optional(S.String),
}) {}
export const AwsRdsDbSubnetGroupSubnets = S.Array(AwsRdsDbSubnetGroupSubnet);
export class AwsRdsDbSubnetGroup extends S.Class<AwsRdsDbSubnetGroup>(
  "AwsRdsDbSubnetGroup",
)({
  DbSubnetGroupName: S.optional(S.String),
  DbSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(AwsRdsDbSubnetGroupSubnets),
  DbSubnetGroupArn: S.optional(S.String),
}) {}
export class AwsRdsPendingCloudWatchLogsExports extends S.Class<AwsRdsPendingCloudWatchLogsExports>(
  "AwsRdsPendingCloudWatchLogsExports",
)({
  LogTypesToEnable: S.optional(StringList),
  LogTypesToDisable: S.optional(StringList),
}) {}
export class AwsRdsDbProcessorFeature extends S.Class<AwsRdsDbProcessorFeature>(
  "AwsRdsDbProcessorFeature",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsRdsDbProcessorFeatures = S.Array(AwsRdsDbProcessorFeature);
export class AwsRdsDbPendingModifiedValues extends S.Class<AwsRdsDbPendingModifiedValues>(
  "AwsRdsDbPendingModifiedValues",
)({
  DbInstanceClass: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  MasterUserPassword: S.optional(S.String),
  Port: S.optional(S.Number),
  BackupRetentionPeriod: S.optional(S.Number),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  DbInstanceIdentifier: S.optional(S.String),
  StorageType: S.optional(S.String),
  CaCertificateIdentifier: S.optional(S.String),
  DbSubnetGroupName: S.optional(S.String),
  PendingCloudWatchLogsExports: S.optional(AwsRdsPendingCloudWatchLogsExports),
  ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
}) {}
export class AwsRdsDbOptionGroupMembership extends S.Class<AwsRdsDbOptionGroupMembership>(
  "AwsRdsDbOptionGroupMembership",
)({ OptionGroupName: S.optional(S.String), Status: S.optional(S.String) }) {}
export const AwsRdsDbOptionGroupMemberships = S.Array(
  AwsRdsDbOptionGroupMembership,
);
export class AwsRdsDbStatusInfo extends S.Class<AwsRdsDbStatusInfo>(
  "AwsRdsDbStatusInfo",
)({
  StatusType: S.optional(S.String),
  Normal: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const AwsRdsDbStatusInfos = S.Array(AwsRdsDbStatusInfo);
export class AwsRdsDbDomainMembership extends S.Class<AwsRdsDbDomainMembership>(
  "AwsRdsDbDomainMembership",
)({
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  Fqdn: S.optional(S.String),
  IamRoleName: S.optional(S.String),
}) {}
export const AwsRdsDbDomainMemberships = S.Array(AwsRdsDbDomainMembership);
export class AwsRdsDbInstanceDetails extends S.Class<AwsRdsDbInstanceDetails>(
  "AwsRdsDbInstanceDetails",
)({
  AssociatedRoles: S.optional(AwsRdsDbInstanceAssociatedRoles),
  CACertificateIdentifier: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  DBInstanceIdentifier: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  DbInstancePort: S.optional(S.Number),
  DbiResourceId: S.optional(S.String),
  DBName: S.optional(S.String),
  DeletionProtection: S.optional(S.Boolean),
  Endpoint: S.optional(AwsRdsDbInstanceEndpoint),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  InstanceCreateTime: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  StorageEncrypted: S.optional(S.Boolean),
  TdeCredentialArn: S.optional(S.String),
  VpcSecurityGroups: S.optional(AwsRdsDbInstanceVpcSecurityGroups),
  MultiAz: S.optional(S.Boolean),
  EnhancedMonitoringResourceArn: S.optional(S.String),
  DbInstanceStatus: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  PreferredBackupWindow: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  DbSecurityGroups: S.optional(StringList),
  DbParameterGroups: S.optional(AwsRdsDbParameterGroups),
  AvailabilityZone: S.optional(S.String),
  DbSubnetGroup: S.optional(AwsRdsDbSubnetGroup),
  PreferredMaintenanceWindow: S.optional(S.String),
  PendingModifiedValues: S.optional(AwsRdsDbPendingModifiedValues),
  LatestRestorableTime: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  ReadReplicaSourceDBInstanceIdentifier: S.optional(S.String),
  ReadReplicaDBInstanceIdentifiers: S.optional(StringList),
  ReadReplicaDBClusterIdentifiers: S.optional(StringList),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  OptionGroupMemberships: S.optional(AwsRdsDbOptionGroupMemberships),
  CharacterSetName: S.optional(S.String),
  SecondaryAvailabilityZone: S.optional(S.String),
  StatusInfos: S.optional(AwsRdsDbStatusInfos),
  StorageType: S.optional(S.String),
  DomainMemberships: S.optional(AwsRdsDbDomainMemberships),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  MonitoringInterval: S.optional(S.Number),
  MonitoringRoleArn: S.optional(S.String),
  PromotionTier: S.optional(S.Number),
  Timezone: S.optional(S.String),
  PerformanceInsightsEnabled: S.optional(S.Boolean),
  PerformanceInsightsKmsKeyId: S.optional(S.String),
  PerformanceInsightsRetentionPeriod: S.optional(S.Number),
  EnabledCloudWatchLogsExports: S.optional(StringList),
  ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
  ListenerEndpoint: S.optional(AwsRdsDbInstanceEndpoint),
  MaxAllocatedStorage: S.optional(S.Number),
}) {}
export class AwsSnsTopicSubscription extends S.Class<AwsSnsTopicSubscription>(
  "AwsSnsTopicSubscription",
)({ Endpoint: S.optional(S.String), Protocol: S.optional(S.String) }) {}
export const AwsSnsTopicSubscriptionList = S.Array(AwsSnsTopicSubscription);
export class AwsSnsTopicDetails extends S.Class<AwsSnsTopicDetails>(
  "AwsSnsTopicDetails",
)({
  KmsMasterKeyId: S.optional(S.String),
  Subscription: S.optional(AwsSnsTopicSubscriptionList),
  TopicName: S.optional(S.String),
  Owner: S.optional(S.String),
  SqsSuccessFeedbackRoleArn: S.optional(S.String),
  SqsFailureFeedbackRoleArn: S.optional(S.String),
  ApplicationSuccessFeedbackRoleArn: S.optional(S.String),
  FirehoseSuccessFeedbackRoleArn: S.optional(S.String),
  FirehoseFailureFeedbackRoleArn: S.optional(S.String),
  HttpSuccessFeedbackRoleArn: S.optional(S.String),
  HttpFailureFeedbackRoleArn: S.optional(S.String),
}) {}
export class AwsSqsQueueDetails extends S.Class<AwsSqsQueueDetails>(
  "AwsSqsQueueDetails",
)({
  KmsDataKeyReusePeriodSeconds: S.optional(S.Number),
  KmsMasterKeyId: S.optional(S.String),
  QueueName: S.optional(S.String),
  DeadLetterTargetArn: S.optional(S.String),
}) {}
export class WafAction extends S.Class<WafAction>("WafAction")({
  Type: S.optional(S.String),
}) {}
export class WafExcludedRule extends S.Class<WafExcludedRule>(
  "WafExcludedRule",
)({ RuleId: S.optional(S.String) }) {}
export const WafExcludedRuleList = S.Array(WafExcludedRule);
export class WafOverrideAction extends S.Class<WafOverrideAction>(
  "WafOverrideAction",
)({ Type: S.optional(S.String) }) {}
export class AwsWafWebAclRule extends S.Class<AwsWafWebAclRule>(
  "AwsWafWebAclRule",
)({
  Action: S.optional(WafAction),
  ExcludedRules: S.optional(WafExcludedRuleList),
  OverrideAction: S.optional(WafOverrideAction),
  Priority: S.optional(S.Number),
  RuleId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsWafWebAclRuleList = S.Array(AwsWafWebAclRule);
export class AwsWafWebAclDetails extends S.Class<AwsWafWebAclDetails>(
  "AwsWafWebAclDetails",
)({
  Name: S.optional(S.String),
  DefaultAction: S.optional(S.String),
  Rules: S.optional(AwsWafWebAclRuleList),
  WebAclId: S.optional(S.String),
}) {}
export class AwsRdsDbSnapshotDetails extends S.Class<AwsRdsDbSnapshotDetails>(
  "AwsRdsDbSnapshotDetails",
)({
  DbSnapshotIdentifier: S.optional(S.String),
  DbInstanceIdentifier: S.optional(S.String),
  SnapshotCreateTime: S.optional(S.String),
  Engine: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  VpcId: S.optional(S.String),
  InstanceCreateTime: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  Iops: S.optional(S.Number),
  OptionGroupName: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  SourceRegion: S.optional(S.String),
  SourceDbSnapshotIdentifier: S.optional(S.String),
  StorageType: S.optional(S.String),
  TdeCredentialArn: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  Timezone: S.optional(S.String),
  IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  ProcessorFeatures: S.optional(AwsRdsDbProcessorFeatures),
  DbiResourceId: S.optional(S.String),
}) {}
export class AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute extends S.Class<AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute>(
  "AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValues: S.optional(NonEmptyStringList),
}) {}
export const AwsRdsDbClusterSnapshotDbClusterSnapshotAttributes = S.Array(
  AwsRdsDbClusterSnapshotDbClusterSnapshotAttribute,
);
export class AwsRdsDbClusterSnapshotDetails extends S.Class<AwsRdsDbClusterSnapshotDetails>(
  "AwsRdsDbClusterSnapshotDetails",
)({
  AvailabilityZones: S.optional(StringList),
  SnapshotCreateTime: S.optional(S.String),
  Engine: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbClusterIdentifier: S.optional(S.String),
  DbClusterSnapshotIdentifier: S.optional(S.String),
  IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  DbClusterSnapshotAttributes: S.optional(
    AwsRdsDbClusterSnapshotDbClusterSnapshotAttributes,
  ),
}) {}
export class AwsRdsDbClusterAssociatedRole extends S.Class<AwsRdsDbClusterAssociatedRole>(
  "AwsRdsDbClusterAssociatedRole",
)({ RoleArn: S.optional(S.String), Status: S.optional(S.String) }) {}
export const AwsRdsDbClusterAssociatedRoles = S.Array(
  AwsRdsDbClusterAssociatedRole,
);
export class AwsRdsDbClusterOptionGroupMembership extends S.Class<AwsRdsDbClusterOptionGroupMembership>(
  "AwsRdsDbClusterOptionGroupMembership",
)({
  DbClusterOptionGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AwsRdsDbClusterOptionGroupMemberships = S.Array(
  AwsRdsDbClusterOptionGroupMembership,
);
export class AwsRdsDbClusterMember extends S.Class<AwsRdsDbClusterMember>(
  "AwsRdsDbClusterMember",
)({
  IsClusterWriter: S.optional(S.Boolean),
  PromotionTier: S.optional(S.Number),
  DbInstanceIdentifier: S.optional(S.String),
  DbClusterParameterGroupStatus: S.optional(S.String),
}) {}
export const AwsRdsDbClusterMembers = S.Array(AwsRdsDbClusterMember);
export class AwsRdsDbClusterDetails extends S.Class<AwsRdsDbClusterDetails>(
  "AwsRdsDbClusterDetails",
)({
  AllocatedStorage: S.optional(S.Number),
  AvailabilityZones: S.optional(StringList),
  BackupRetentionPeriod: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  Status: S.optional(S.String),
  Endpoint: S.optional(S.String),
  ReaderEndpoint: S.optional(S.String),
  CustomEndpoints: S.optional(StringList),
  MultiAz: S.optional(S.Boolean),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  Port: S.optional(S.Number),
  MasterUsername: S.optional(S.String),
  PreferredBackupWindow: S.optional(S.String),
  PreferredMaintenanceWindow: S.optional(S.String),
  ReadReplicaIdentifiers: S.optional(StringList),
  VpcSecurityGroups: S.optional(AwsRdsDbInstanceVpcSecurityGroups),
  HostedZoneId: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbClusterResourceId: S.optional(S.String),
  AssociatedRoles: S.optional(AwsRdsDbClusterAssociatedRoles),
  ClusterCreateTime: S.optional(S.String),
  EnabledCloudWatchLogsExports: S.optional(StringList),
  EngineMode: S.optional(S.String),
  DeletionProtection: S.optional(S.Boolean),
  HttpEndpointEnabled: S.optional(S.Boolean),
  ActivityStreamStatus: S.optional(S.String),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  CrossAccountClone: S.optional(S.Boolean),
  DomainMemberships: S.optional(AwsRdsDbDomainMemberships),
  DbClusterParameterGroup: S.optional(S.String),
  DbSubnetGroup: S.optional(S.String),
  DbClusterOptionGroupMemberships: S.optional(
    AwsRdsDbClusterOptionGroupMemberships,
  ),
  DbClusterIdentifier: S.optional(S.String),
  DbClusterMembers: S.optional(AwsRdsDbClusterMembers),
  IamDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
}) {}
export class AwsEcsClusterClusterSettingsDetails extends S.Class<AwsEcsClusterClusterSettingsDetails>(
  "AwsEcsClusterClusterSettingsDetails",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsClusterClusterSettingsList = S.Array(
  AwsEcsClusterClusterSettingsDetails,
);
export class AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails extends S.Class<AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails>(
  "AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails",
)({
  CloudWatchEncryptionEnabled: S.optional(S.Boolean),
  CloudWatchLogGroupName: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3EncryptionEnabled: S.optional(S.Boolean),
  S3KeyPrefix: S.optional(S.String),
}) {}
export class AwsEcsClusterConfigurationExecuteCommandConfigurationDetails extends S.Class<AwsEcsClusterConfigurationExecuteCommandConfigurationDetails>(
  "AwsEcsClusterConfigurationExecuteCommandConfigurationDetails",
)({
  KmsKeyId: S.optional(S.String),
  LogConfiguration: S.optional(
    AwsEcsClusterConfigurationExecuteCommandConfigurationLogConfigurationDetails,
  ),
  Logging: S.optional(S.String),
}) {}
export class AwsEcsClusterConfigurationDetails extends S.Class<AwsEcsClusterConfigurationDetails>(
  "AwsEcsClusterConfigurationDetails",
)({
  ExecuteCommandConfiguration: S.optional(
    AwsEcsClusterConfigurationExecuteCommandConfigurationDetails,
  ),
}) {}
export class AwsEcsClusterDefaultCapacityProviderStrategyDetails extends S.Class<AwsEcsClusterDefaultCapacityProviderStrategyDetails>(
  "AwsEcsClusterDefaultCapacityProviderStrategyDetails",
)({
  Base: S.optional(S.Number),
  CapacityProvider: S.optional(S.String),
  Weight: S.optional(S.Number),
}) {}
export const AwsEcsClusterDefaultCapacityProviderStrategyList = S.Array(
  AwsEcsClusterDefaultCapacityProviderStrategyDetails,
);
export class AwsEcsClusterDetails extends S.Class<AwsEcsClusterDetails>(
  "AwsEcsClusterDetails",
)({
  ClusterArn: S.optional(S.String),
  ActiveServicesCount: S.optional(S.Number),
  CapacityProviders: S.optional(NonEmptyStringList),
  ClusterSettings: S.optional(AwsEcsClusterClusterSettingsList),
  Configuration: S.optional(AwsEcsClusterConfigurationDetails),
  DefaultCapacityProviderStrategy: S.optional(
    AwsEcsClusterDefaultCapacityProviderStrategyList,
  ),
  ClusterName: S.optional(S.String),
  RegisteredContainerInstancesCount: S.optional(S.Number),
  RunningTasksCount: S.optional(S.Number),
  Status: S.optional(S.String),
}) {}
export class AwsMountPoint extends S.Class<AwsMountPoint>("AwsMountPoint")({
  SourceVolume: S.optional(S.String),
  ContainerPath: S.optional(S.String),
}) {}
export const AwsMountPointList = S.Array(AwsMountPoint);
export class AwsEcsContainerDetails extends S.Class<AwsEcsContainerDetails>(
  "AwsEcsContainerDetails",
)({
  Name: S.optional(S.String),
  Image: S.optional(S.String),
  MountPoints: S.optional(AwsMountPointList),
  Privileged: S.optional(S.Boolean),
}) {}
export class AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails",
)({ Condition: S.optional(S.String), ContainerName: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsDependsOnList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsDependsOnDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsEnvironmentDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails",
)({ Type: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesDetails);
export class AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails",
)({ Hostname: S.optional(S.String), IpAddress: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsExtraHostsDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails",
)({ Options: S.optional(FieldMap), Type: S.optional(S.String) }) {}
export class AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails",
)({
  Command: S.optional(NonEmptyStringList),
  Interval: S.optional(S.Number),
  Retries: S.optional(S.Number),
  StartPeriod: S.optional(S.Number),
  Timeout: S.optional(S.Number),
}) {}
export class AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails",
)({
  Add: S.optional(NonEmptyStringList),
  Drop: S.optional(NonEmptyStringList),
}) {}
export class AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails",
)({
  ContainerPath: S.optional(S.String),
  HostPath: S.optional(S.String),
  Permissions: S.optional(NonEmptyStringList),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList =
  S.Array(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesDetails,
  );
export class AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails",
)({
  ContainerPath: S.optional(S.String),
  MountOptions: S.optional(NonEmptyStringList),
  Size: S.optional(S.Number),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsDetails);
export class AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails",
)({
  Capabilities: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersCapabilitiesDetails,
  ),
  Devices: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDevicesList,
  ),
  InitProcessEnabled: S.optional(S.Boolean),
  MaxSwap: S.optional(S.Number),
  SharedMemorySize: S.optional(S.Number),
  Swappiness: S.optional(S.Number),
  Tmpfs: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersTmpfsList,
  ),
}) {}
export class AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails",
)({ Name: S.optional(S.String), ValueFrom: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList =
  S.Array(
    AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsDetails,
  );
export class AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails",
)({
  LogDriver: S.optional(S.String),
  Options: S.optional(FieldMap),
  SecretOptions: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationSecretOptionsList,
  ),
}) {}
export class AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails",
)({
  ContainerPath: S.optional(S.String),
  ReadOnly: S.optional(S.Boolean),
  SourceVolume: S.optional(S.String),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsMountPointsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsMountPointsDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails",
)({
  ContainerPort: S.optional(S.Number),
  HostPort: S.optional(S.Number),
  Protocol: S.optional(S.String),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsPortMappingsDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails",
)({ CredentialsParameter: S.optional(S.String) }) {}
export class AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails",
)({ Type: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsDetails);
export class AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails",
)({ Name: S.optional(S.String), ValueFrom: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsSecretsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsSecretsDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails",
)({ Namespace: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList =
  S.Array(AwsEcsTaskDefinitionContainerDefinitionsSystemControlsDetails);
export class AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails",
)({
  HardLimit: S.optional(S.Number),
  Name: S.optional(S.String),
  SoftLimit: S.optional(S.Number),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsUlimitsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsUlimitsDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails",
)({ ReadOnly: S.optional(S.Boolean), SourceContainer: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsVolumesFromDetails,
);
export class AwsEcsTaskDefinitionContainerDefinitionsDetails extends S.Class<AwsEcsTaskDefinitionContainerDefinitionsDetails>(
  "AwsEcsTaskDefinitionContainerDefinitionsDetails",
)({
  Command: S.optional(NonEmptyStringList),
  Cpu: S.optional(S.Number),
  DependsOn: S.optional(AwsEcsTaskDefinitionContainerDefinitionsDependsOnList),
  DisableNetworking: S.optional(S.Boolean),
  DnsSearchDomains: S.optional(NonEmptyStringList),
  DnsServers: S.optional(NonEmptyStringList),
  DockerLabels: S.optional(FieldMap),
  DockerSecurityOptions: S.optional(NonEmptyStringList),
  EntryPoint: S.optional(NonEmptyStringList),
  Environment: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsEnvironmentList,
  ),
  EnvironmentFiles: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsEnvironmentFilesList,
  ),
  Essential: S.optional(S.Boolean),
  ExtraHosts: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsExtraHostsList,
  ),
  FirelensConfiguration: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsFirelensConfigurationDetails,
  ),
  HealthCheck: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsHealthCheckDetails,
  ),
  Hostname: S.optional(S.String),
  Image: S.optional(S.String),
  Interactive: S.optional(S.Boolean),
  Links: S.optional(NonEmptyStringList),
  LinuxParameters: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLinuxParametersDetails,
  ),
  LogConfiguration: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsLogConfigurationDetails,
  ),
  Memory: S.optional(S.Number),
  MemoryReservation: S.optional(S.Number),
  MountPoints: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsMountPointsList,
  ),
  Name: S.optional(S.String),
  PortMappings: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsPortMappingsList,
  ),
  Privileged: S.optional(S.Boolean),
  PseudoTerminal: S.optional(S.Boolean),
  ReadonlyRootFilesystem: S.optional(S.Boolean),
  RepositoryCredentials: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsRepositoryCredentialsDetails,
  ),
  ResourceRequirements: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsResourceRequirementsList,
  ),
  Secrets: S.optional(AwsEcsTaskDefinitionContainerDefinitionsSecretsList),
  StartTimeout: S.optional(S.Number),
  StopTimeout: S.optional(S.Number),
  SystemControls: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsSystemControlsList,
  ),
  Ulimits: S.optional(AwsEcsTaskDefinitionContainerDefinitionsUlimitsList),
  User: S.optional(S.String),
  VolumesFrom: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsVolumesFromList,
  ),
  WorkingDirectory: S.optional(S.String),
}) {}
export const AwsEcsTaskDefinitionContainerDefinitionsList = S.Array(
  AwsEcsTaskDefinitionContainerDefinitionsDetails,
);
export class AwsEcsTaskDefinitionInferenceAcceleratorsDetails extends S.Class<AwsEcsTaskDefinitionInferenceAcceleratorsDetails>(
  "AwsEcsTaskDefinitionInferenceAcceleratorsDetails",
)({ DeviceName: S.optional(S.String), DeviceType: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionInferenceAcceleratorsList = S.Array(
  AwsEcsTaskDefinitionInferenceAcceleratorsDetails,
);
export class AwsEcsTaskDefinitionPlacementConstraintsDetails extends S.Class<AwsEcsTaskDefinitionPlacementConstraintsDetails>(
  "AwsEcsTaskDefinitionPlacementConstraintsDetails",
)({ Expression: S.optional(S.String), Type: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionPlacementConstraintsList = S.Array(
  AwsEcsTaskDefinitionPlacementConstraintsDetails,
);
export class AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails extends S.Class<AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails>(
  "AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList =
  S.Array(
    AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesDetails,
  );
export class AwsEcsTaskDefinitionProxyConfigurationDetails extends S.Class<AwsEcsTaskDefinitionProxyConfigurationDetails>(
  "AwsEcsTaskDefinitionProxyConfigurationDetails",
)({
  ContainerName: S.optional(S.String),
  ProxyConfigurationProperties: S.optional(
    AwsEcsTaskDefinitionProxyConfigurationProxyConfigurationPropertiesList,
  ),
  Type: S.optional(S.String),
}) {}
export class AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails extends S.Class<AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails>(
  "AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails",
)({
  Autoprovision: S.optional(S.Boolean),
  Driver: S.optional(S.String),
  DriverOpts: S.optional(FieldMap),
  Labels: S.optional(FieldMap),
  Scope: S.optional(S.String),
}) {}
export class AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails extends S.Class<AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails>(
  "AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails",
)({ AccessPointId: S.optional(S.String), Iam: S.optional(S.String) }) {}
export class AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails extends S.Class<AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails>(
  "AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails",
)({
  AuthorizationConfig: S.optional(
    AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationAuthorizationConfigDetails,
  ),
  FilesystemId: S.optional(S.String),
  RootDirectory: S.optional(S.String),
  TransitEncryption: S.optional(S.String),
  TransitEncryptionPort: S.optional(S.Number),
}) {}
export class AwsEcsTaskDefinitionVolumesHostDetails extends S.Class<AwsEcsTaskDefinitionVolumesHostDetails>(
  "AwsEcsTaskDefinitionVolumesHostDetails",
)({ SourcePath: S.optional(S.String) }) {}
export class AwsEcsTaskDefinitionVolumesDetails extends S.Class<AwsEcsTaskDefinitionVolumesDetails>(
  "AwsEcsTaskDefinitionVolumesDetails",
)({
  DockerVolumeConfiguration: S.optional(
    AwsEcsTaskDefinitionVolumesDockerVolumeConfigurationDetails,
  ),
  EfsVolumeConfiguration: S.optional(
    AwsEcsTaskDefinitionVolumesEfsVolumeConfigurationDetails,
  ),
  Host: S.optional(AwsEcsTaskDefinitionVolumesHostDetails),
  Name: S.optional(S.String),
}) {}
export const AwsEcsTaskDefinitionVolumesList = S.Array(
  AwsEcsTaskDefinitionVolumesDetails,
);
export class AwsEcsTaskDefinitionDetails extends S.Class<AwsEcsTaskDefinitionDetails>(
  "AwsEcsTaskDefinitionDetails",
)({
  ContainerDefinitions: S.optional(
    AwsEcsTaskDefinitionContainerDefinitionsList,
  ),
  Cpu: S.optional(S.String),
  ExecutionRoleArn: S.optional(S.String),
  Family: S.optional(S.String),
  InferenceAccelerators: S.optional(
    AwsEcsTaskDefinitionInferenceAcceleratorsList,
  ),
  IpcMode: S.optional(S.String),
  Memory: S.optional(S.String),
  NetworkMode: S.optional(S.String),
  PidMode: S.optional(S.String),
  PlacementConstraints: S.optional(
    AwsEcsTaskDefinitionPlacementConstraintsList,
  ),
  ProxyConfiguration: S.optional(AwsEcsTaskDefinitionProxyConfigurationDetails),
  RequiresCompatibilities: S.optional(NonEmptyStringList),
  TaskRoleArn: S.optional(S.String),
  Volumes: S.optional(AwsEcsTaskDefinitionVolumesList),
  Status: S.optional(S.String),
}) {}
export class VolumeMount extends S.Class<VolumeMount>("VolumeMount")({
  Name: S.optional(S.String),
  MountPath: S.optional(S.String),
}) {}
export const VolumeMountList = S.Array(VolumeMount);
export class ContainerDetails extends S.Class<ContainerDetails>(
  "ContainerDetails",
)({
  ContainerRuntime: S.optional(S.String),
  Name: S.optional(S.String),
  ImageId: S.optional(S.String),
  ImageName: S.optional(S.String),
  LaunchedAt: S.optional(S.String),
  VolumeMounts: S.optional(VolumeMountList),
  Privileged: S.optional(S.Boolean),
}) {}
export class AwsRdsEventSubscriptionDetails extends S.Class<AwsRdsEventSubscriptionDetails>(
  "AwsRdsEventSubscriptionDetails",
)({
  CustSubscriptionId: S.optional(S.String),
  CustomerAwsId: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  EventCategoriesList: S.optional(NonEmptyStringList),
  EventSubscriptionArn: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  SourceIdsList: S.optional(NonEmptyStringList),
  SourceType: S.optional(S.String),
  Status: S.optional(S.String),
  SubscriptionCreationTime: S.optional(S.String),
}) {}
export class AwsEcsServiceCapacityProviderStrategyDetails extends S.Class<AwsEcsServiceCapacityProviderStrategyDetails>(
  "AwsEcsServiceCapacityProviderStrategyDetails",
)({
  Base: S.optional(S.Number),
  CapacityProvider: S.optional(S.String),
  Weight: S.optional(S.Number),
}) {}
export const AwsEcsServiceCapacityProviderStrategyList = S.Array(
  AwsEcsServiceCapacityProviderStrategyDetails,
);
export class AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails extends S.Class<AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails>(
  "AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails",
)({ Enable: S.optional(S.Boolean), Rollback: S.optional(S.Boolean) }) {}
export class AwsEcsServiceDeploymentConfigurationDetails extends S.Class<AwsEcsServiceDeploymentConfigurationDetails>(
  "AwsEcsServiceDeploymentConfigurationDetails",
)({
  DeploymentCircuitBreaker: S.optional(
    AwsEcsServiceDeploymentConfigurationDeploymentCircuitBreakerDetails,
  ),
  MaximumPercent: S.optional(S.Number),
  MinimumHealthyPercent: S.optional(S.Number),
}) {}
export class AwsEcsServiceDeploymentControllerDetails extends S.Class<AwsEcsServiceDeploymentControllerDetails>(
  "AwsEcsServiceDeploymentControllerDetails",
)({ Type: S.optional(S.String) }) {}
export class AwsEcsServiceLoadBalancersDetails extends S.Class<AwsEcsServiceLoadBalancersDetails>(
  "AwsEcsServiceLoadBalancersDetails",
)({
  ContainerName: S.optional(S.String),
  ContainerPort: S.optional(S.Number),
  LoadBalancerName: S.optional(S.String),
  TargetGroupArn: S.optional(S.String),
}) {}
export const AwsEcsServiceLoadBalancersList = S.Array(
  AwsEcsServiceLoadBalancersDetails,
);
export class AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails extends S.Class<AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails>(
  "AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails",
)({
  AssignPublicIp: S.optional(S.String),
  SecurityGroups: S.optional(NonEmptyStringList),
  Subnets: S.optional(NonEmptyStringList),
}) {}
export class AwsEcsServiceNetworkConfigurationDetails extends S.Class<AwsEcsServiceNetworkConfigurationDetails>(
  "AwsEcsServiceNetworkConfigurationDetails",
)({
  AwsVpcConfiguration: S.optional(
    AwsEcsServiceNetworkConfigurationAwsVpcConfigurationDetails,
  ),
}) {}
export class AwsEcsServicePlacementConstraintsDetails extends S.Class<AwsEcsServicePlacementConstraintsDetails>(
  "AwsEcsServicePlacementConstraintsDetails",
)({ Expression: S.optional(S.String), Type: S.optional(S.String) }) {}
export const AwsEcsServicePlacementConstraintsList = S.Array(
  AwsEcsServicePlacementConstraintsDetails,
);
export class AwsEcsServicePlacementStrategiesDetails extends S.Class<AwsEcsServicePlacementStrategiesDetails>(
  "AwsEcsServicePlacementStrategiesDetails",
)({ Field: S.optional(S.String), Type: S.optional(S.String) }) {}
export const AwsEcsServicePlacementStrategiesList = S.Array(
  AwsEcsServicePlacementStrategiesDetails,
);
export class AwsEcsServiceServiceRegistriesDetails extends S.Class<AwsEcsServiceServiceRegistriesDetails>(
  "AwsEcsServiceServiceRegistriesDetails",
)({
  ContainerName: S.optional(S.String),
  ContainerPort: S.optional(S.Number),
  Port: S.optional(S.Number),
  RegistryArn: S.optional(S.String),
}) {}
export const AwsEcsServiceServiceRegistriesList = S.Array(
  AwsEcsServiceServiceRegistriesDetails,
);
export class AwsEcsServiceDetails extends S.Class<AwsEcsServiceDetails>(
  "AwsEcsServiceDetails",
)({
  CapacityProviderStrategy: S.optional(
    AwsEcsServiceCapacityProviderStrategyList,
  ),
  Cluster: S.optional(S.String),
  DeploymentConfiguration: S.optional(
    AwsEcsServiceDeploymentConfigurationDetails,
  ),
  DeploymentController: S.optional(AwsEcsServiceDeploymentControllerDetails),
  DesiredCount: S.optional(S.Number),
  EnableEcsManagedTags: S.optional(S.Boolean),
  EnableExecuteCommand: S.optional(S.Boolean),
  HealthCheckGracePeriodSeconds: S.optional(S.Number),
  LaunchType: S.optional(S.String),
  LoadBalancers: S.optional(AwsEcsServiceLoadBalancersList),
  Name: S.optional(S.String),
  NetworkConfiguration: S.optional(AwsEcsServiceNetworkConfigurationDetails),
  PlacementConstraints: S.optional(AwsEcsServicePlacementConstraintsList),
  PlacementStrategies: S.optional(AwsEcsServicePlacementStrategiesList),
  PlatformVersion: S.optional(S.String),
  PropagateTags: S.optional(S.String),
  Role: S.optional(S.String),
  SchedulingStrategy: S.optional(S.String),
  ServiceArn: S.optional(S.String),
  ServiceName: S.optional(S.String),
  ServiceRegistries: S.optional(AwsEcsServiceServiceRegistriesList),
  TaskDefinition: S.optional(S.String),
}) {}
export class AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails extends S.Class<AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails>(
  "AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails",
)({
  DeleteOnTermination: S.optional(S.Boolean),
  Encrypted: S.optional(S.Boolean),
  Iops: S.optional(S.Number),
  SnapshotId: S.optional(S.String),
  VolumeSize: S.optional(S.Number),
  VolumeType: S.optional(S.String),
}) {}
export class AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails extends S.Class<AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails>(
  "AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails",
)({
  DeviceName: S.optional(S.String),
  Ebs: S.optional(
    AwsAutoScalingLaunchConfigurationBlockDeviceMappingsEbsDetails,
  ),
  NoDevice: S.optional(S.Boolean),
  VirtualName: S.optional(S.String),
}) {}
export const AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList = S.Array(
  AwsAutoScalingLaunchConfigurationBlockDeviceMappingsDetails,
);
export class AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails extends S.Class<AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails>(
  "AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsAutoScalingLaunchConfigurationMetadataOptions extends S.Class<AwsAutoScalingLaunchConfigurationMetadataOptions>(
  "AwsAutoScalingLaunchConfigurationMetadataOptions",
)({
  HttpEndpoint: S.optional(S.String),
  HttpPutResponseHopLimit: S.optional(S.Number),
  HttpTokens: S.optional(S.String),
}) {}
export class AwsAutoScalingLaunchConfigurationDetails extends S.Class<AwsAutoScalingLaunchConfigurationDetails>(
  "AwsAutoScalingLaunchConfigurationDetails",
)({
  AssociatePublicIpAddress: S.optional(S.Boolean),
  BlockDeviceMappings: S.optional(
    AwsAutoScalingLaunchConfigurationBlockDeviceMappingsList,
  ),
  ClassicLinkVpcId: S.optional(S.String),
  ClassicLinkVpcSecurityGroups: S.optional(NonEmptyStringList),
  CreatedTime: S.optional(S.String),
  EbsOptimized: S.optional(S.Boolean),
  IamInstanceProfile: S.optional(S.String),
  ImageId: S.optional(S.String),
  InstanceMonitoring: S.optional(
    AwsAutoScalingLaunchConfigurationInstanceMonitoringDetails,
  ),
  InstanceType: S.optional(S.String),
  KernelId: S.optional(S.String),
  KeyName: S.optional(S.String),
  LaunchConfigurationName: S.optional(S.String),
  PlacementTenancy: S.optional(S.String),
  RamdiskId: S.optional(S.String),
  SecurityGroups: S.optional(NonEmptyStringList),
  SpotPrice: S.optional(S.String),
  UserData: S.optional(S.String),
  MetadataOptions: S.optional(AwsAutoScalingLaunchConfigurationMetadataOptions),
}) {}
export class AwsEc2VpnConnectionVgwTelemetryDetails extends S.Class<AwsEc2VpnConnectionVgwTelemetryDetails>(
  "AwsEc2VpnConnectionVgwTelemetryDetails",
)({
  AcceptedRouteCount: S.optional(S.Number),
  CertificateArn: S.optional(S.String),
  LastStatusChange: S.optional(S.String),
  OutsideIpAddress: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const AwsEc2VpnConnectionVgwTelemetryList = S.Array(
  AwsEc2VpnConnectionVgwTelemetryDetails,
);
export class AwsEc2VpnConnectionOptionsTunnelOptionsDetails extends S.Class<AwsEc2VpnConnectionOptionsTunnelOptionsDetails>(
  "AwsEc2VpnConnectionOptionsTunnelOptionsDetails",
)({
  DpdTimeoutSeconds: S.optional(S.Number),
  IkeVersions: S.optional(NonEmptyStringList),
  OutsideIpAddress: S.optional(S.String),
  Phase1DhGroupNumbers: S.optional(IntegerList),
  Phase1EncryptionAlgorithms: S.optional(NonEmptyStringList),
  Phase1IntegrityAlgorithms: S.optional(NonEmptyStringList),
  Phase1LifetimeSeconds: S.optional(S.Number),
  Phase2DhGroupNumbers: S.optional(IntegerList),
  Phase2EncryptionAlgorithms: S.optional(NonEmptyStringList),
  Phase2IntegrityAlgorithms: S.optional(NonEmptyStringList),
  Phase2LifetimeSeconds: S.optional(S.Number),
  PreSharedKey: S.optional(S.String),
  RekeyFuzzPercentage: S.optional(S.Number),
  RekeyMarginTimeSeconds: S.optional(S.Number),
  ReplayWindowSize: S.optional(S.Number),
  TunnelInsideCidr: S.optional(S.String),
}) {}
export const AwsEc2VpnConnectionOptionsTunnelOptionsList = S.Array(
  AwsEc2VpnConnectionOptionsTunnelOptionsDetails,
);
export class AwsEc2VpnConnectionOptionsDetails extends S.Class<AwsEc2VpnConnectionOptionsDetails>(
  "AwsEc2VpnConnectionOptionsDetails",
)({
  StaticRoutesOnly: S.optional(S.Boolean),
  TunnelOptions: S.optional(AwsEc2VpnConnectionOptionsTunnelOptionsList),
}) {}
export class AwsEc2VpnConnectionRoutesDetails extends S.Class<AwsEc2VpnConnectionRoutesDetails>(
  "AwsEc2VpnConnectionRoutesDetails",
)({
  DestinationCidrBlock: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const AwsEc2VpnConnectionRoutesList = S.Array(
  AwsEc2VpnConnectionRoutesDetails,
);
export class AwsEc2VpnConnectionDetails extends S.Class<AwsEc2VpnConnectionDetails>(
  "AwsEc2VpnConnectionDetails",
)({
  VpnConnectionId: S.optional(S.String),
  State: S.optional(S.String),
  CustomerGatewayId: S.optional(S.String),
  CustomerGatewayConfiguration: S.optional(S.String),
  Type: S.optional(S.String),
  VpnGatewayId: S.optional(S.String),
  Category: S.optional(S.String),
  VgwTelemetry: S.optional(AwsEc2VpnConnectionVgwTelemetryList),
  Options: S.optional(AwsEc2VpnConnectionOptionsDetails),
  Routes: S.optional(AwsEc2VpnConnectionRoutesList),
  TransitGatewayId: S.optional(S.String),
}) {}
export class AwsEcrContainerImageDetails extends S.Class<AwsEcrContainerImageDetails>(
  "AwsEcrContainerImageDetails",
)({
  RegistryId: S.optional(S.String),
  RepositoryName: S.optional(S.String),
  Architecture: S.optional(S.String),
  ImageDigest: S.optional(S.String),
  ImageTags: S.optional(NonEmptyStringList),
  ImagePublishedAt: S.optional(S.String),
}) {}
export class AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails extends S.Class<AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails>(
  "AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails",
)({ Enabled: S.optional(S.Boolean), KmsKeyId: S.optional(S.String) }) {}
export class AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails extends S.Class<AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails>(
  "AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails extends S.Class<AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails>(
  "AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails",
)({
  AutomatedUpdateDate: S.optional(S.String),
  Cancellable: S.optional(S.Boolean),
  CurrentVersion: S.optional(S.String),
  Description: S.optional(S.String),
  NewVersion: S.optional(S.String),
  UpdateAvailable: S.optional(S.Boolean),
  UpdateStatus: S.optional(S.String),
  OptionalDeployment: S.optional(S.Boolean),
}) {}
export class AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails extends S.Class<AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails>(
  "AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails",
)({ AvailabilityZoneCount: S.optional(S.Number) }) {}
export class AwsOpenSearchServiceDomainClusterConfigDetails extends S.Class<AwsOpenSearchServiceDomainClusterConfigDetails>(
  "AwsOpenSearchServiceDomainClusterConfigDetails",
)({
  InstanceCount: S.optional(S.Number),
  WarmEnabled: S.optional(S.Boolean),
  WarmCount: S.optional(S.Number),
  DedicatedMasterEnabled: S.optional(S.Boolean),
  ZoneAwarenessConfig: S.optional(
    AwsOpenSearchServiceDomainClusterConfigZoneAwarenessConfigDetails,
  ),
  DedicatedMasterCount: S.optional(S.Number),
  InstanceType: S.optional(S.String),
  WarmType: S.optional(S.String),
  ZoneAwarenessEnabled: S.optional(S.Boolean),
  DedicatedMasterType: S.optional(S.String),
}) {}
export class AwsOpenSearchServiceDomainDomainEndpointOptionsDetails extends S.Class<AwsOpenSearchServiceDomainDomainEndpointOptionsDetails>(
  "AwsOpenSearchServiceDomainDomainEndpointOptionsDetails",
)({
  CustomEndpointCertificateArn: S.optional(S.String),
  CustomEndpointEnabled: S.optional(S.Boolean),
  EnforceHTTPS: S.optional(S.Boolean),
  CustomEndpoint: S.optional(S.String),
  TLSSecurityPolicy: S.optional(S.String),
}) {}
export class AwsOpenSearchServiceDomainVpcOptionsDetails extends S.Class<AwsOpenSearchServiceDomainVpcOptionsDetails>(
  "AwsOpenSearchServiceDomainVpcOptionsDetails",
)({
  SecurityGroupIds: S.optional(NonEmptyStringList),
  SubnetIds: S.optional(NonEmptyStringList),
}) {}
export class AwsOpenSearchServiceDomainLogPublishingOption extends S.Class<AwsOpenSearchServiceDomainLogPublishingOption>(
  "AwsOpenSearchServiceDomainLogPublishingOption",
)({
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
}) {}
export class AwsOpenSearchServiceDomainLogPublishingOptionsDetails extends S.Class<AwsOpenSearchServiceDomainLogPublishingOptionsDetails>(
  "AwsOpenSearchServiceDomainLogPublishingOptionsDetails",
)({
  IndexSlowLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
  SearchSlowLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
  AuditLogs: S.optional(AwsOpenSearchServiceDomainLogPublishingOption),
}) {}
export class AwsOpenSearchServiceDomainMasterUserOptionsDetails extends S.Class<AwsOpenSearchServiceDomainMasterUserOptionsDetails>(
  "AwsOpenSearchServiceDomainMasterUserOptionsDetails",
)({
  MasterUserArn: S.optional(S.String),
  MasterUserName: S.optional(S.String),
  MasterUserPassword: S.optional(S.String),
}) {}
export class AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails extends S.Class<AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails>(
  "AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails",
)({
  Enabled: S.optional(S.Boolean),
  InternalUserDatabaseEnabled: S.optional(S.Boolean),
  MasterUserOptions: S.optional(
    AwsOpenSearchServiceDomainMasterUserOptionsDetails,
  ),
}) {}
export class AwsOpenSearchServiceDomainDetails extends S.Class<AwsOpenSearchServiceDomainDetails>(
  "AwsOpenSearchServiceDomainDetails",
)({
  Arn: S.optional(S.String),
  AccessPolicies: S.optional(S.String),
  DomainName: S.optional(S.String),
  Id: S.optional(S.String),
  DomainEndpoint: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  EncryptionAtRestOptions: S.optional(
    AwsOpenSearchServiceDomainEncryptionAtRestOptionsDetails,
  ),
  NodeToNodeEncryptionOptions: S.optional(
    AwsOpenSearchServiceDomainNodeToNodeEncryptionOptionsDetails,
  ),
  ServiceSoftwareOptions: S.optional(
    AwsOpenSearchServiceDomainServiceSoftwareOptionsDetails,
  ),
  ClusterConfig: S.optional(AwsOpenSearchServiceDomainClusterConfigDetails),
  DomainEndpointOptions: S.optional(
    AwsOpenSearchServiceDomainDomainEndpointOptionsDetails,
  ),
  VpcOptions: S.optional(AwsOpenSearchServiceDomainVpcOptionsDetails),
  LogPublishingOptions: S.optional(
    AwsOpenSearchServiceDomainLogPublishingOptionsDetails,
  ),
  DomainEndpoints: S.optional(FieldMap),
  AdvancedSecurityOptions: S.optional(
    AwsOpenSearchServiceDomainAdvancedSecurityOptionsDetails,
  ),
}) {}
export class AwsEc2VpcEndpointServiceServiceTypeDetails extends S.Class<AwsEc2VpcEndpointServiceServiceTypeDetails>(
  "AwsEc2VpcEndpointServiceServiceTypeDetails",
)({ ServiceType: S.optional(S.String) }) {}
export const AwsEc2VpcEndpointServiceServiceTypeList = S.Array(
  AwsEc2VpcEndpointServiceServiceTypeDetails,
);
export class AwsEc2VpcEndpointServiceDetails extends S.Class<AwsEc2VpcEndpointServiceDetails>(
  "AwsEc2VpcEndpointServiceDetails",
)({
  AcceptanceRequired: S.optional(S.Boolean),
  AvailabilityZones: S.optional(NonEmptyStringList),
  BaseEndpointDnsNames: S.optional(NonEmptyStringList),
  ManagesVpcEndpoints: S.optional(S.Boolean),
  GatewayLoadBalancerArns: S.optional(NonEmptyStringList),
  NetworkLoadBalancerArns: S.optional(NonEmptyStringList),
  PrivateDnsName: S.optional(S.String),
  ServiceId: S.optional(S.String),
  ServiceName: S.optional(S.String),
  ServiceState: S.optional(S.String),
  ServiceType: S.optional(AwsEc2VpcEndpointServiceServiceTypeList),
}) {}
export class AwsXrayEncryptionConfigDetails extends S.Class<AwsXrayEncryptionConfigDetails>(
  "AwsXrayEncryptionConfigDetails",
)({
  KeyId: S.optional(S.String),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class AwsWafRateBasedRuleMatchPredicate extends S.Class<AwsWafRateBasedRuleMatchPredicate>(
  "AwsWafRateBasedRuleMatchPredicate",
)({
  DataId: S.optional(S.String),
  Negated: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const AwsWafRateBasedRuleMatchPredicateList = S.Array(
  AwsWafRateBasedRuleMatchPredicate,
);
export class AwsWafRateBasedRuleDetails extends S.Class<AwsWafRateBasedRuleDetails>(
  "AwsWafRateBasedRuleDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  RateKey: S.optional(S.String),
  RateLimit: S.optional(S.Number),
  RuleId: S.optional(S.String),
  MatchPredicates: S.optional(AwsWafRateBasedRuleMatchPredicateList),
}) {}
export class AwsWafRegionalRateBasedRuleMatchPredicate extends S.Class<AwsWafRegionalRateBasedRuleMatchPredicate>(
  "AwsWafRegionalRateBasedRuleMatchPredicate",
)({
  DataId: S.optional(S.String),
  Negated: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const AwsWafRegionalRateBasedRuleMatchPredicateList = S.Array(
  AwsWafRegionalRateBasedRuleMatchPredicate,
);
export class AwsWafRegionalRateBasedRuleDetails extends S.Class<AwsWafRegionalRateBasedRuleDetails>(
  "AwsWafRegionalRateBasedRuleDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  RateKey: S.optional(S.String),
  RateLimit: S.optional(S.Number),
  RuleId: S.optional(S.String),
  MatchPredicates: S.optional(AwsWafRegionalRateBasedRuleMatchPredicateList),
}) {}
export class AwsEcrRepositoryImageScanningConfigurationDetails extends S.Class<AwsEcrRepositoryImageScanningConfigurationDetails>(
  "AwsEcrRepositoryImageScanningConfigurationDetails",
)({ ScanOnPush: S.optional(S.Boolean) }) {}
export class AwsEcrRepositoryLifecyclePolicyDetails extends S.Class<AwsEcrRepositoryLifecyclePolicyDetails>(
  "AwsEcrRepositoryLifecyclePolicyDetails",
)({
  LifecyclePolicyText: S.optional(S.String),
  RegistryId: S.optional(S.String),
}) {}
export class AwsEcrRepositoryDetails extends S.Class<AwsEcrRepositoryDetails>(
  "AwsEcrRepositoryDetails",
)({
  Arn: S.optional(S.String),
  ImageScanningConfiguration: S.optional(
    AwsEcrRepositoryImageScanningConfigurationDetails,
  ),
  ImageTagMutability: S.optional(S.String),
  LifecyclePolicy: S.optional(AwsEcrRepositoryLifecyclePolicyDetails),
  RepositoryName: S.optional(S.String),
  RepositoryPolicyText: S.optional(S.String),
}) {}
export class AwsEksClusterResourcesVpcConfigDetails extends S.Class<AwsEksClusterResourcesVpcConfigDetails>(
  "AwsEksClusterResourcesVpcConfigDetails",
)({
  SecurityGroupIds: S.optional(NonEmptyStringList),
  SubnetIds: S.optional(NonEmptyStringList),
  EndpointPublicAccess: S.optional(S.Boolean),
}) {}
export class AwsEksClusterLoggingClusterLoggingDetails extends S.Class<AwsEksClusterLoggingClusterLoggingDetails>(
  "AwsEksClusterLoggingClusterLoggingDetails",
)({ Enabled: S.optional(S.Boolean), Types: S.optional(NonEmptyStringList) }) {}
export const AwsEksClusterLoggingClusterLoggingList = S.Array(
  AwsEksClusterLoggingClusterLoggingDetails,
);
export class AwsEksClusterLoggingDetails extends S.Class<AwsEksClusterLoggingDetails>(
  "AwsEksClusterLoggingDetails",
)({ ClusterLogging: S.optional(AwsEksClusterLoggingClusterLoggingList) }) {}
export class AwsEksClusterDetails extends S.Class<AwsEksClusterDetails>(
  "AwsEksClusterDetails",
)({
  Arn: S.optional(S.String),
  CertificateAuthorityData: S.optional(S.String),
  ClusterStatus: S.optional(S.String),
  Endpoint: S.optional(S.String),
  Name: S.optional(S.String),
  ResourcesVpcConfig: S.optional(AwsEksClusterResourcesVpcConfigDetails),
  RoleArn: S.optional(S.String),
  Version: S.optional(S.String),
  Logging: S.optional(AwsEksClusterLoggingDetails),
}) {}
export class FirewallPolicyStatefulRuleGroupReferencesDetails extends S.Class<FirewallPolicyStatefulRuleGroupReferencesDetails>(
  "FirewallPolicyStatefulRuleGroupReferencesDetails",
)({ ResourceArn: S.optional(S.String) }) {}
export const FirewallPolicyStatefulRuleGroupReferencesList = S.Array(
  FirewallPolicyStatefulRuleGroupReferencesDetails,
);
export class StatelessCustomPublishMetricActionDimension extends S.Class<StatelessCustomPublishMetricActionDimension>(
  "StatelessCustomPublishMetricActionDimension",
)({ Value: S.optional(S.String) }) {}
export const StatelessCustomPublishMetricActionDimensionsList = S.Array(
  StatelessCustomPublishMetricActionDimension,
);
export class StatelessCustomPublishMetricAction extends S.Class<StatelessCustomPublishMetricAction>(
  "StatelessCustomPublishMetricAction",
)({
  Dimensions: S.optional(StatelessCustomPublishMetricActionDimensionsList),
}) {}
export class StatelessCustomActionDefinition extends S.Class<StatelessCustomActionDefinition>(
  "StatelessCustomActionDefinition",
)({ PublishMetricAction: S.optional(StatelessCustomPublishMetricAction) }) {}
export class FirewallPolicyStatelessCustomActionsDetails extends S.Class<FirewallPolicyStatelessCustomActionsDetails>(
  "FirewallPolicyStatelessCustomActionsDetails",
)({
  ActionDefinition: S.optional(StatelessCustomActionDefinition),
  ActionName: S.optional(S.String),
}) {}
export const FirewallPolicyStatelessCustomActionsList = S.Array(
  FirewallPolicyStatelessCustomActionsDetails,
);
export class FirewallPolicyStatelessRuleGroupReferencesDetails extends S.Class<FirewallPolicyStatelessRuleGroupReferencesDetails>(
  "FirewallPolicyStatelessRuleGroupReferencesDetails",
)({ Priority: S.optional(S.Number), ResourceArn: S.optional(S.String) }) {}
export const FirewallPolicyStatelessRuleGroupReferencesList = S.Array(
  FirewallPolicyStatelessRuleGroupReferencesDetails,
);
export class FirewallPolicyDetails extends S.Class<FirewallPolicyDetails>(
  "FirewallPolicyDetails",
)({
  StatefulRuleGroupReferences: S.optional(
    FirewallPolicyStatefulRuleGroupReferencesList,
  ),
  StatelessCustomActions: S.optional(FirewallPolicyStatelessCustomActionsList),
  StatelessDefaultActions: S.optional(NonEmptyStringList),
  StatelessFragmentDefaultActions: S.optional(NonEmptyStringList),
  StatelessRuleGroupReferences: S.optional(
    FirewallPolicyStatelessRuleGroupReferencesList,
  ),
}) {}
export class AwsNetworkFirewallFirewallPolicyDetails extends S.Class<AwsNetworkFirewallFirewallPolicyDetails>(
  "AwsNetworkFirewallFirewallPolicyDetails",
)({
  FirewallPolicy: S.optional(FirewallPolicyDetails),
  FirewallPolicyArn: S.optional(S.String),
  FirewallPolicyId: S.optional(S.String),
  FirewallPolicyName: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class AwsNetworkFirewallFirewallSubnetMappingsDetails extends S.Class<AwsNetworkFirewallFirewallSubnetMappingsDetails>(
  "AwsNetworkFirewallFirewallSubnetMappingsDetails",
)({ SubnetId: S.optional(S.String) }) {}
export const AwsNetworkFirewallFirewallSubnetMappingsList = S.Array(
  AwsNetworkFirewallFirewallSubnetMappingsDetails,
);
export class AwsNetworkFirewallFirewallDetails extends S.Class<AwsNetworkFirewallFirewallDetails>(
  "AwsNetworkFirewallFirewallDetails",
)({
  DeleteProtection: S.optional(S.Boolean),
  Description: S.optional(S.String),
  FirewallArn: S.optional(S.String),
  FirewallId: S.optional(S.String),
  FirewallName: S.optional(S.String),
  FirewallPolicyArn: S.optional(S.String),
  FirewallPolicyChangeProtection: S.optional(S.Boolean),
  SubnetChangeProtection: S.optional(S.Boolean),
  SubnetMappings: S.optional(AwsNetworkFirewallFirewallSubnetMappingsList),
  VpcId: S.optional(S.String),
}) {}
export class RuleGroupVariablesIpSetsDetails extends S.Class<RuleGroupVariablesIpSetsDetails>(
  "RuleGroupVariablesIpSetsDetails",
)({ Definition: S.optional(NonEmptyStringList) }) {}
export class RuleGroupVariablesPortSetsDetails extends S.Class<RuleGroupVariablesPortSetsDetails>(
  "RuleGroupVariablesPortSetsDetails",
)({ Definition: S.optional(NonEmptyStringList) }) {}
export class RuleGroupVariables extends S.Class<RuleGroupVariables>(
  "RuleGroupVariables",
)({
  IpSets: S.optional(RuleGroupVariablesIpSetsDetails),
  PortSets: S.optional(RuleGroupVariablesPortSetsDetails),
}) {}
export class RuleGroupSourceListDetails extends S.Class<RuleGroupSourceListDetails>(
  "RuleGroupSourceListDetails",
)({
  GeneratedRulesType: S.optional(S.String),
  TargetTypes: S.optional(NonEmptyStringList),
  Targets: S.optional(NonEmptyStringList),
}) {}
export class RuleGroupSourceStatefulRulesHeaderDetails extends S.Class<RuleGroupSourceStatefulRulesHeaderDetails>(
  "RuleGroupSourceStatefulRulesHeaderDetails",
)({
  Destination: S.optional(S.String),
  DestinationPort: S.optional(S.String),
  Direction: S.optional(S.String),
  Protocol: S.optional(S.String),
  Source: S.optional(S.String),
  SourcePort: S.optional(S.String),
}) {}
export const RuleGroupSourceStatefulRulesRuleOptionsSettingsList = S.Array(
  S.String,
);
export class RuleGroupSourceStatefulRulesOptionsDetails extends S.Class<RuleGroupSourceStatefulRulesOptionsDetails>(
  "RuleGroupSourceStatefulRulesOptionsDetails",
)({
  Keyword: S.optional(S.String),
  Settings: S.optional(RuleGroupSourceStatefulRulesRuleOptionsSettingsList),
}) {}
export const RuleGroupSourceStatefulRulesOptionsList = S.Array(
  RuleGroupSourceStatefulRulesOptionsDetails,
);
export class RuleGroupSourceStatefulRulesDetails extends S.Class<RuleGroupSourceStatefulRulesDetails>(
  "RuleGroupSourceStatefulRulesDetails",
)({
  Action: S.optional(S.String),
  Header: S.optional(RuleGroupSourceStatefulRulesHeaderDetails),
  RuleOptions: S.optional(RuleGroupSourceStatefulRulesOptionsList),
}) {}
export const RuleGroupSourceStatefulRulesList = S.Array(
  RuleGroupSourceStatefulRulesDetails,
);
export class RuleGroupSourceCustomActionsDetails extends S.Class<RuleGroupSourceCustomActionsDetails>(
  "RuleGroupSourceCustomActionsDetails",
)({
  ActionDefinition: S.optional(StatelessCustomActionDefinition),
  ActionName: S.optional(S.String),
}) {}
export const RuleGroupSourceCustomActionsList = S.Array(
  RuleGroupSourceCustomActionsDetails,
);
export class RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts extends S.Class<RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts>(
  "RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts",
)({ FromPort: S.optional(S.Number), ToPort: S.optional(S.Number) }) {}
export const RuleGroupSourceStatelessRuleMatchAttributesDestinationPortsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesDestinationPorts);
export class RuleGroupSourceStatelessRuleMatchAttributesDestinations extends S.Class<RuleGroupSourceStatelessRuleMatchAttributesDestinations>(
  "RuleGroupSourceStatelessRuleMatchAttributesDestinations",
)({ AddressDefinition: S.optional(S.String) }) {}
export const RuleGroupSourceStatelessRuleMatchAttributesDestinationsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesDestinations);
export const RuleGroupSourceStatelessRuleMatchAttributesProtocolsList = S.Array(
  S.Number,
);
export class RuleGroupSourceStatelessRuleMatchAttributesSourcePorts extends S.Class<RuleGroupSourceStatelessRuleMatchAttributesSourcePorts>(
  "RuleGroupSourceStatelessRuleMatchAttributesSourcePorts",
)({ FromPort: S.optional(S.Number), ToPort: S.optional(S.Number) }) {}
export const RuleGroupSourceStatelessRuleMatchAttributesSourcePortsList =
  S.Array(RuleGroupSourceStatelessRuleMatchAttributesSourcePorts);
export class RuleGroupSourceStatelessRuleMatchAttributesSources extends S.Class<RuleGroupSourceStatelessRuleMatchAttributesSources>(
  "RuleGroupSourceStatelessRuleMatchAttributesSources",
)({ AddressDefinition: S.optional(S.String) }) {}
export const RuleGroupSourceStatelessRuleMatchAttributesSourcesList = S.Array(
  RuleGroupSourceStatelessRuleMatchAttributesSources,
);
export class RuleGroupSourceStatelessRuleMatchAttributesTcpFlags extends S.Class<RuleGroupSourceStatelessRuleMatchAttributesTcpFlags>(
  "RuleGroupSourceStatelessRuleMatchAttributesTcpFlags",
)({
  Flags: S.optional(NonEmptyStringList),
  Masks: S.optional(NonEmptyStringList),
}) {}
export const RuleGroupSourceStatelessRuleMatchAttributesTcpFlagsList = S.Array(
  RuleGroupSourceStatelessRuleMatchAttributesTcpFlags,
);
export class RuleGroupSourceStatelessRuleMatchAttributes extends S.Class<RuleGroupSourceStatelessRuleMatchAttributes>(
  "RuleGroupSourceStatelessRuleMatchAttributes",
)({
  DestinationPorts: S.optional(
    RuleGroupSourceStatelessRuleMatchAttributesDestinationPortsList,
  ),
  Destinations: S.optional(
    RuleGroupSourceStatelessRuleMatchAttributesDestinationsList,
  ),
  Protocols: S.optional(
    RuleGroupSourceStatelessRuleMatchAttributesProtocolsList,
  ),
  SourcePorts: S.optional(
    RuleGroupSourceStatelessRuleMatchAttributesSourcePortsList,
  ),
  Sources: S.optional(RuleGroupSourceStatelessRuleMatchAttributesSourcesList),
  TcpFlags: S.optional(RuleGroupSourceStatelessRuleMatchAttributesTcpFlagsList),
}) {}
export class RuleGroupSourceStatelessRuleDefinition extends S.Class<RuleGroupSourceStatelessRuleDefinition>(
  "RuleGroupSourceStatelessRuleDefinition",
)({
  Actions: S.optional(NonEmptyStringList),
  MatchAttributes: S.optional(RuleGroupSourceStatelessRuleMatchAttributes),
}) {}
export class RuleGroupSourceStatelessRulesDetails extends S.Class<RuleGroupSourceStatelessRulesDetails>(
  "RuleGroupSourceStatelessRulesDetails",
)({
  Priority: S.optional(S.Number),
  RuleDefinition: S.optional(RuleGroupSourceStatelessRuleDefinition),
}) {}
export const RuleGroupSourceStatelessRulesList = S.Array(
  RuleGroupSourceStatelessRulesDetails,
);
export class RuleGroupSourceStatelessRulesAndCustomActionsDetails extends S.Class<RuleGroupSourceStatelessRulesAndCustomActionsDetails>(
  "RuleGroupSourceStatelessRulesAndCustomActionsDetails",
)({
  CustomActions: S.optional(RuleGroupSourceCustomActionsList),
  StatelessRules: S.optional(RuleGroupSourceStatelessRulesList),
}) {}
export class RuleGroupSource extends S.Class<RuleGroupSource>(
  "RuleGroupSource",
)({
  RulesSourceList: S.optional(RuleGroupSourceListDetails),
  RulesString: S.optional(S.String),
  StatefulRules: S.optional(RuleGroupSourceStatefulRulesList),
  StatelessRulesAndCustomActions: S.optional(
    RuleGroupSourceStatelessRulesAndCustomActionsDetails,
  ),
}) {}
export class RuleGroupDetails extends S.Class<RuleGroupDetails>(
  "RuleGroupDetails",
)({
  RuleVariables: S.optional(RuleGroupVariables),
  RulesSource: S.optional(RuleGroupSource),
}) {}
export class AwsNetworkFirewallRuleGroupDetails extends S.Class<AwsNetworkFirewallRuleGroupDetails>(
  "AwsNetworkFirewallRuleGroupDetails",
)({
  Capacity: S.optional(S.Number),
  Description: S.optional(S.String),
  RuleGroup: S.optional(RuleGroupDetails),
  RuleGroupArn: S.optional(S.String),
  RuleGroupId: S.optional(S.String),
  RuleGroupName: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class AwsRdsDbSecurityGroupEc2SecurityGroup extends S.Class<AwsRdsDbSecurityGroupEc2SecurityGroup>(
  "AwsRdsDbSecurityGroupEc2SecurityGroup",
)({
  Ec2SecurityGroupId: S.optional(S.String),
  Ec2SecurityGroupName: S.optional(S.String),
  Ec2SecurityGroupOwnerId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AwsRdsDbSecurityGroupEc2SecurityGroups = S.Array(
  AwsRdsDbSecurityGroupEc2SecurityGroup,
);
export class AwsRdsDbSecurityGroupIpRange extends S.Class<AwsRdsDbSecurityGroupIpRange>(
  "AwsRdsDbSecurityGroupIpRange",
)({ CidrIp: S.optional(S.String), Status: S.optional(S.String) }) {}
export const AwsRdsDbSecurityGroupIpRanges = S.Array(
  AwsRdsDbSecurityGroupIpRange,
);
export class AwsRdsDbSecurityGroupDetails extends S.Class<AwsRdsDbSecurityGroupDetails>(
  "AwsRdsDbSecurityGroupDetails",
)({
  DbSecurityGroupArn: S.optional(S.String),
  DbSecurityGroupDescription: S.optional(S.String),
  DbSecurityGroupName: S.optional(S.String),
  Ec2SecurityGroups: S.optional(AwsRdsDbSecurityGroupEc2SecurityGroups),
  IpRanges: S.optional(AwsRdsDbSecurityGroupIpRanges),
  OwnerId: S.optional(S.String),
  VpcId: S.optional(S.String),
}) {}
export class AwsKinesisStreamStreamEncryptionDetails extends S.Class<AwsKinesisStreamStreamEncryptionDetails>(
  "AwsKinesisStreamStreamEncryptionDetails",
)({ EncryptionType: S.optional(S.String), KeyId: S.optional(S.String) }) {}
export class AwsKinesisStreamDetails extends S.Class<AwsKinesisStreamDetails>(
  "AwsKinesisStreamDetails",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  StreamEncryption: S.optional(AwsKinesisStreamStreamEncryptionDetails),
  ShardCount: S.optional(S.Number),
  RetentionPeriodHours: S.optional(S.Number),
}) {}
export class AwsEc2TransitGatewayDetails extends S.Class<AwsEc2TransitGatewayDetails>(
  "AwsEc2TransitGatewayDetails",
)({
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultRouteTablePropagation: S.optional(S.String),
  AutoAcceptSharedAttachments: S.optional(S.String),
  DefaultRouteTableAssociation: S.optional(S.String),
  TransitGatewayCidrBlocks: S.optional(NonEmptyStringList),
  AssociationDefaultRouteTableId: S.optional(S.String),
  PropagationDefaultRouteTableId: S.optional(S.String),
  VpnEcmpSupport: S.optional(S.String),
  DnsSupport: S.optional(S.String),
  MulticastSupport: S.optional(S.String),
  AmazonSideAsn: S.optional(S.Number),
}) {}
export class AwsEfsAccessPointPosixUserDetails extends S.Class<AwsEfsAccessPointPosixUserDetails>(
  "AwsEfsAccessPointPosixUserDetails",
)({
  Gid: S.optional(S.String),
  SecondaryGids: S.optional(NonEmptyStringList),
  Uid: S.optional(S.String),
}) {}
export class AwsEfsAccessPointRootDirectoryCreationInfoDetails extends S.Class<AwsEfsAccessPointRootDirectoryCreationInfoDetails>(
  "AwsEfsAccessPointRootDirectoryCreationInfoDetails",
)({
  OwnerGid: S.optional(S.String),
  OwnerUid: S.optional(S.String),
  Permissions: S.optional(S.String),
}) {}
export class AwsEfsAccessPointRootDirectoryDetails extends S.Class<AwsEfsAccessPointRootDirectoryDetails>(
  "AwsEfsAccessPointRootDirectoryDetails",
)({
  CreationInfo: S.optional(AwsEfsAccessPointRootDirectoryCreationInfoDetails),
  Path: S.optional(S.String),
}) {}
export class AwsEfsAccessPointDetails extends S.Class<AwsEfsAccessPointDetails>(
  "AwsEfsAccessPointDetails",
)({
  AccessPointId: S.optional(S.String),
  Arn: S.optional(S.String),
  ClientToken: S.optional(S.String),
  FileSystemId: S.optional(S.String),
  PosixUser: S.optional(AwsEfsAccessPointPosixUserDetails),
  RootDirectory: S.optional(AwsEfsAccessPointRootDirectoryDetails),
}) {}
export class AwsCloudFormationStackDriftInformationDetails extends S.Class<AwsCloudFormationStackDriftInformationDetails>(
  "AwsCloudFormationStackDriftInformationDetails",
)({ StackDriftStatus: S.optional(S.String) }) {}
export class AwsCloudFormationStackOutputsDetails extends S.Class<AwsCloudFormationStackOutputsDetails>(
  "AwsCloudFormationStackOutputsDetails",
)({
  Description: S.optional(S.String),
  OutputKey: S.optional(S.String),
  OutputValue: S.optional(S.String),
}) {}
export const AwsCloudFormationStackOutputsList = S.Array(
  AwsCloudFormationStackOutputsDetails,
);
export class AwsCloudFormationStackDetails extends S.Class<AwsCloudFormationStackDetails>(
  "AwsCloudFormationStackDetails",
)({
  Capabilities: S.optional(NonEmptyStringList),
  CreationTime: S.optional(S.String),
  Description: S.optional(S.String),
  DisableRollback: S.optional(S.Boolean),
  DriftInformation: S.optional(AwsCloudFormationStackDriftInformationDetails),
  EnableTerminationProtection: S.optional(S.Boolean),
  LastUpdatedTime: S.optional(S.String),
  NotificationArns: S.optional(NonEmptyStringList),
  Outputs: S.optional(AwsCloudFormationStackOutputsList),
  RoleArn: S.optional(S.String),
  StackId: S.optional(S.String),
  StackName: S.optional(S.String),
  StackStatus: S.optional(S.String),
  StackStatusReason: S.optional(S.String),
  TimeoutInMinutes: S.optional(S.Number),
}) {}
export class AwsCloudWatchAlarmDimensionsDetails extends S.Class<AwsCloudWatchAlarmDimensionsDetails>(
  "AwsCloudWatchAlarmDimensionsDetails",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsCloudWatchAlarmDimensionsList = S.Array(
  AwsCloudWatchAlarmDimensionsDetails,
);
export class AwsCloudWatchAlarmDetails extends S.Class<AwsCloudWatchAlarmDetails>(
  "AwsCloudWatchAlarmDetails",
)({
  ActionsEnabled: S.optional(S.Boolean),
  AlarmActions: S.optional(NonEmptyStringList),
  AlarmArn: S.optional(S.String),
  AlarmConfigurationUpdatedTimestamp: S.optional(S.String),
  AlarmDescription: S.optional(S.String),
  AlarmName: S.optional(S.String),
  ComparisonOperator: S.optional(S.String),
  DatapointsToAlarm: S.optional(S.Number),
  Dimensions: S.optional(AwsCloudWatchAlarmDimensionsList),
  EvaluateLowSampleCountPercentile: S.optional(S.String),
  EvaluationPeriods: S.optional(S.Number),
  ExtendedStatistic: S.optional(S.String),
  InsufficientDataActions: S.optional(NonEmptyStringList),
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
  OkActions: S.optional(NonEmptyStringList),
  Period: S.optional(S.Number),
  Statistic: S.optional(S.String),
  Threshold: S.optional(S.Number),
  ThresholdMetricId: S.optional(S.String),
  TreatMissingData: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export class VpcInfoCidrBlockSetDetails extends S.Class<VpcInfoCidrBlockSetDetails>(
  "VpcInfoCidrBlockSetDetails",
)({ CidrBlock: S.optional(S.String) }) {}
export const VpcInfoCidrBlockSetList = S.Array(VpcInfoCidrBlockSetDetails);
export class VpcInfoIpv6CidrBlockSetDetails extends S.Class<VpcInfoIpv6CidrBlockSetDetails>(
  "VpcInfoIpv6CidrBlockSetDetails",
)({ Ipv6CidrBlock: S.optional(S.String) }) {}
export const VpcInfoIpv6CidrBlockSetList = S.Array(
  VpcInfoIpv6CidrBlockSetDetails,
);
export class VpcInfoPeeringOptionsDetails extends S.Class<VpcInfoPeeringOptionsDetails>(
  "VpcInfoPeeringOptionsDetails",
)({
  AllowDnsResolutionFromRemoteVpc: S.optional(S.Boolean),
  AllowEgressFromLocalClassicLinkToRemoteVpc: S.optional(S.Boolean),
  AllowEgressFromLocalVpcToRemoteClassicLink: S.optional(S.Boolean),
}) {}
export class AwsEc2VpcPeeringConnectionVpcInfoDetails extends S.Class<AwsEc2VpcPeeringConnectionVpcInfoDetails>(
  "AwsEc2VpcPeeringConnectionVpcInfoDetails",
)({
  CidrBlock: S.optional(S.String),
  CidrBlockSet: S.optional(VpcInfoCidrBlockSetList),
  Ipv6CidrBlockSet: S.optional(VpcInfoIpv6CidrBlockSetList),
  OwnerId: S.optional(S.String),
  PeeringOptions: S.optional(VpcInfoPeeringOptionsDetails),
  Region: S.optional(S.String),
  VpcId: S.optional(S.String),
}) {}
export class AwsEc2VpcPeeringConnectionStatusDetails extends S.Class<AwsEc2VpcPeeringConnectionStatusDetails>(
  "AwsEc2VpcPeeringConnectionStatusDetails",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class AwsEc2VpcPeeringConnectionDetails extends S.Class<AwsEc2VpcPeeringConnectionDetails>(
  "AwsEc2VpcPeeringConnectionDetails",
)({
  AccepterVpcInfo: S.optional(AwsEc2VpcPeeringConnectionVpcInfoDetails),
  ExpirationTime: S.optional(S.String),
  RequesterVpcInfo: S.optional(AwsEc2VpcPeeringConnectionVpcInfoDetails),
  Status: S.optional(AwsEc2VpcPeeringConnectionStatusDetails),
  VpcPeeringConnectionId: S.optional(S.String),
}) {}
export class AwsWafRegionalRuleGroupRulesActionDetails extends S.Class<AwsWafRegionalRuleGroupRulesActionDetails>(
  "AwsWafRegionalRuleGroupRulesActionDetails",
)({ Type: S.optional(S.String) }) {}
export class AwsWafRegionalRuleGroupRulesDetails extends S.Class<AwsWafRegionalRuleGroupRulesDetails>(
  "AwsWafRegionalRuleGroupRulesDetails",
)({
  Action: S.optional(AwsWafRegionalRuleGroupRulesActionDetails),
  Priority: S.optional(S.Number),
  RuleId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsWafRegionalRuleGroupRulesList = S.Array(
  AwsWafRegionalRuleGroupRulesDetails,
);
export class AwsWafRegionalRuleGroupDetails extends S.Class<AwsWafRegionalRuleGroupDetails>(
  "AwsWafRegionalRuleGroupDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  RuleGroupId: S.optional(S.String),
  Rules: S.optional(AwsWafRegionalRuleGroupRulesList),
}) {}
export class AwsWafRegionalRulePredicateListDetails extends S.Class<AwsWafRegionalRulePredicateListDetails>(
  "AwsWafRegionalRulePredicateListDetails",
)({
  DataId: S.optional(S.String),
  Negated: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const AwsWafRegionalRulePredicateList = S.Array(
  AwsWafRegionalRulePredicateListDetails,
);
export class AwsWafRegionalRuleDetails extends S.Class<AwsWafRegionalRuleDetails>(
  "AwsWafRegionalRuleDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  PredicateList: S.optional(AwsWafRegionalRulePredicateList),
  RuleId: S.optional(S.String),
}) {}
export class AwsWafRegionalWebAclRulesListActionDetails extends S.Class<AwsWafRegionalWebAclRulesListActionDetails>(
  "AwsWafRegionalWebAclRulesListActionDetails",
)({ Type: S.optional(S.String) }) {}
export class AwsWafRegionalWebAclRulesListOverrideActionDetails extends S.Class<AwsWafRegionalWebAclRulesListOverrideActionDetails>(
  "AwsWafRegionalWebAclRulesListOverrideActionDetails",
)({ Type: S.optional(S.String) }) {}
export class AwsWafRegionalWebAclRulesListDetails extends S.Class<AwsWafRegionalWebAclRulesListDetails>(
  "AwsWafRegionalWebAclRulesListDetails",
)({
  Action: S.optional(AwsWafRegionalWebAclRulesListActionDetails),
  OverrideAction: S.optional(
    AwsWafRegionalWebAclRulesListOverrideActionDetails,
  ),
  Priority: S.optional(S.Number),
  RuleId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsWafRegionalWebAclRulesList = S.Array(
  AwsWafRegionalWebAclRulesListDetails,
);
export class AwsWafRegionalWebAclDetails extends S.Class<AwsWafRegionalWebAclDetails>(
  "AwsWafRegionalWebAclDetails",
)({
  DefaultAction: S.optional(S.String),
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  RulesList: S.optional(AwsWafRegionalWebAclRulesList),
  WebAclId: S.optional(S.String),
}) {}
export class AwsWafRulePredicateListDetails extends S.Class<AwsWafRulePredicateListDetails>(
  "AwsWafRulePredicateListDetails",
)({
  DataId: S.optional(S.String),
  Negated: S.optional(S.Boolean),
  Type: S.optional(S.String),
}) {}
export const AwsWafRulePredicateList = S.Array(AwsWafRulePredicateListDetails);
export class AwsWafRuleDetails extends S.Class<AwsWafRuleDetails>(
  "AwsWafRuleDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  PredicateList: S.optional(AwsWafRulePredicateList),
  RuleId: S.optional(S.String),
}) {}
export class AwsWafRuleGroupRulesActionDetails extends S.Class<AwsWafRuleGroupRulesActionDetails>(
  "AwsWafRuleGroupRulesActionDetails",
)({ Type: S.optional(S.String) }) {}
export class AwsWafRuleGroupRulesDetails extends S.Class<AwsWafRuleGroupRulesDetails>(
  "AwsWafRuleGroupRulesDetails",
)({
  Action: S.optional(AwsWafRuleGroupRulesActionDetails),
  Priority: S.optional(S.Number),
  RuleId: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const AwsWafRuleGroupRulesList = S.Array(AwsWafRuleGroupRulesDetails);
export class AwsWafRuleGroupDetails extends S.Class<AwsWafRuleGroupDetails>(
  "AwsWafRuleGroupDetails",
)({
  MetricName: S.optional(S.String),
  Name: S.optional(S.String),
  RuleGroupId: S.optional(S.String),
  Rules: S.optional(AwsWafRuleGroupRulesList),
}) {}
export class AwsEcsTaskVolumeHostDetails extends S.Class<AwsEcsTaskVolumeHostDetails>(
  "AwsEcsTaskVolumeHostDetails",
)({ SourcePath: S.optional(S.String) }) {}
export class AwsEcsTaskVolumeDetails extends S.Class<AwsEcsTaskVolumeDetails>(
  "AwsEcsTaskVolumeDetails",
)({
  Name: S.optional(S.String),
  Host: S.optional(AwsEcsTaskVolumeHostDetails),
}) {}
export const AwsEcsTaskVolumeDetailsList = S.Array(AwsEcsTaskVolumeDetails);
export const AwsEcsContainerDetailsList = S.Array(AwsEcsContainerDetails);
export class AwsEcsTaskDetails extends S.Class<AwsEcsTaskDetails>(
  "AwsEcsTaskDetails",
)({
  ClusterArn: S.optional(S.String),
  TaskDefinitionArn: S.optional(S.String),
  Version: S.optional(S.String),
  CreatedAt: S.optional(S.String),
  StartedAt: S.optional(S.String),
  StartedBy: S.optional(S.String),
  Group: S.optional(S.String),
  Volumes: S.optional(AwsEcsTaskVolumeDetailsList),
  Containers: S.optional(AwsEcsContainerDetailsList),
}) {}
export class AwsBackupBackupVaultNotificationsDetails extends S.Class<AwsBackupBackupVaultNotificationsDetails>(
  "AwsBackupBackupVaultNotificationsDetails",
)({
  BackupVaultEvents: S.optional(NonEmptyStringList),
  SnsTopicArn: S.optional(S.String),
}) {}
export class AwsBackupBackupVaultDetails extends S.Class<AwsBackupBackupVaultDetails>(
  "AwsBackupBackupVaultDetails",
)({
  BackupVaultArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  Notifications: S.optional(AwsBackupBackupVaultNotificationsDetails),
  AccessPolicy: S.optional(S.String),
}) {}
export class AwsBackupBackupPlanAdvancedBackupSettingsDetails extends S.Class<AwsBackupBackupPlanAdvancedBackupSettingsDetails>(
  "AwsBackupBackupPlanAdvancedBackupSettingsDetails",
)({
  BackupOptions: S.optional(FieldMap),
  ResourceType: S.optional(S.String),
}) {}
export const AwsBackupBackupPlanAdvancedBackupSettingsList = S.Array(
  AwsBackupBackupPlanAdvancedBackupSettingsDetails,
);
export class AwsBackupBackupPlanLifecycleDetails extends S.Class<AwsBackupBackupPlanLifecycleDetails>(
  "AwsBackupBackupPlanLifecycleDetails",
)({
  DeleteAfterDays: S.optional(S.Number),
  MoveToColdStorageAfterDays: S.optional(S.Number),
}) {}
export class AwsBackupBackupPlanRuleCopyActionsDetails extends S.Class<AwsBackupBackupPlanRuleCopyActionsDetails>(
  "AwsBackupBackupPlanRuleCopyActionsDetails",
)({
  DestinationBackupVaultArn: S.optional(S.String),
  Lifecycle: S.optional(AwsBackupBackupPlanLifecycleDetails),
}) {}
export const AwsBackupBackupPlanRuleCopyActionsList = S.Array(
  AwsBackupBackupPlanRuleCopyActionsDetails,
);
export class AwsBackupBackupPlanRuleDetails extends S.Class<AwsBackupBackupPlanRuleDetails>(
  "AwsBackupBackupPlanRuleDetails",
)({
  TargetBackupVault: S.optional(S.String),
  StartWindowMinutes: S.optional(S.Number),
  ScheduleExpression: S.optional(S.String),
  RuleName: S.optional(S.String),
  RuleId: S.optional(S.String),
  EnableContinuousBackup: S.optional(S.Boolean),
  CompletionWindowMinutes: S.optional(S.Number),
  CopyActions: S.optional(AwsBackupBackupPlanRuleCopyActionsList),
  Lifecycle: S.optional(AwsBackupBackupPlanLifecycleDetails),
}) {}
export const AwsBackupBackupPlanRuleList = S.Array(
  AwsBackupBackupPlanRuleDetails,
);
export class AwsBackupBackupPlanBackupPlanDetails extends S.Class<AwsBackupBackupPlanBackupPlanDetails>(
  "AwsBackupBackupPlanBackupPlanDetails",
)({
  BackupPlanName: S.optional(S.String),
  AdvancedBackupSettings: S.optional(
    AwsBackupBackupPlanAdvancedBackupSettingsList,
  ),
  BackupPlanRule: S.optional(AwsBackupBackupPlanRuleList),
}) {}
export class AwsBackupBackupPlanDetails extends S.Class<AwsBackupBackupPlanDetails>(
  "AwsBackupBackupPlanDetails",
)({
  BackupPlan: S.optional(AwsBackupBackupPlanBackupPlanDetails),
  BackupPlanArn: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  VersionId: S.optional(S.String),
}) {}
export class AwsBackupRecoveryPointCalculatedLifecycleDetails extends S.Class<AwsBackupRecoveryPointCalculatedLifecycleDetails>(
  "AwsBackupRecoveryPointCalculatedLifecycleDetails",
)({
  DeleteAt: S.optional(S.String),
  MoveToColdStorageAt: S.optional(S.String),
}) {}
export class AwsBackupRecoveryPointCreatedByDetails extends S.Class<AwsBackupRecoveryPointCreatedByDetails>(
  "AwsBackupRecoveryPointCreatedByDetails",
)({
  BackupPlanArn: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  BackupPlanVersion: S.optional(S.String),
  BackupRuleId: S.optional(S.String),
}) {}
export class AwsBackupRecoveryPointLifecycleDetails extends S.Class<AwsBackupRecoveryPointLifecycleDetails>(
  "AwsBackupRecoveryPointLifecycleDetails",
)({
  DeleteAfterDays: S.optional(S.Number),
  MoveToColdStorageAfterDays: S.optional(S.Number),
}) {}
export class AwsBackupRecoveryPointDetails extends S.Class<AwsBackupRecoveryPointDetails>(
  "AwsBackupRecoveryPointDetails",
)({
  BackupSizeInBytes: S.optional(S.Number),
  BackupVaultArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  CalculatedLifecycle: S.optional(
    AwsBackupRecoveryPointCalculatedLifecycleDetails,
  ),
  CompletionDate: S.optional(S.String),
  CreatedBy: S.optional(AwsBackupRecoveryPointCreatedByDetails),
  CreationDate: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
  IsEncrypted: S.optional(S.Boolean),
  LastRestoreTime: S.optional(S.String),
  Lifecycle: S.optional(AwsBackupRecoveryPointLifecycleDetails),
  RecoveryPointArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  SourceBackupVaultArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  StorageClass: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails extends S.Class<AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails>(
  "AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails",
)({
  DeleteOnTermination: S.optional(S.Boolean),
  Encrypted: S.optional(S.Boolean),
  Iops: S.optional(S.Number),
  KmsKeyId: S.optional(S.String),
  SnapshotId: S.optional(S.String),
  Throughput: S.optional(S.Number),
  VolumeSize: S.optional(S.Number),
  VolumeType: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails extends S.Class<AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails>(
  "AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails",
)({
  DeviceName: S.optional(S.String),
  Ebs: S.optional(AwsEc2LaunchTemplateDataBlockDeviceMappingSetEbsDetails),
  NoDevice: S.optional(S.String),
  VirtualName: S.optional(S.String),
}) {}
export const AwsEc2LaunchTemplateDataBlockDeviceMappingSetList = S.Array(
  AwsEc2LaunchTemplateDataBlockDeviceMappingSetDetails,
);
export class AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails extends S.Class<AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails>(
  "AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails",
)({
  CapacityReservationId: S.optional(S.String),
  CapacityReservationResourceGroupArn: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails extends S.Class<AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails>(
  "AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails",
)({
  CapacityReservationPreference: S.optional(S.String),
  CapacityReservationTarget: S.optional(
    AwsEc2LaunchTemplateDataCapacityReservationSpecificationCapacityReservationTargetDetails,
  ),
}) {}
export class AwsEc2LaunchTemplateDataCpuOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataCpuOptionsDetails>(
  "AwsEc2LaunchTemplateDataCpuOptionsDetails",
)({ CoreCount: S.optional(S.Number), ThreadsPerCore: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataCreditSpecificationDetails extends S.Class<AwsEc2LaunchTemplateDataCreditSpecificationDetails>(
  "AwsEc2LaunchTemplateDataCreditSpecificationDetails",
)({ CpuCredits: S.optional(S.String) }) {}
export class AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails extends S.Class<AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails>(
  "AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails",
)({ Type: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataElasticGpuSpecificationSetList = S.Array(
  AwsEc2LaunchTemplateDataElasticGpuSpecificationSetDetails,
);
export class AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails extends S.Class<AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails>(
  "AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails",
)({ Count: S.optional(S.Number), Type: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetList =
  S.Array(AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetDetails);
export class AwsEc2LaunchTemplateDataEnclaveOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataEnclaveOptionsDetails>(
  "AwsEc2LaunchTemplateDataEnclaveOptionsDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsEc2LaunchTemplateDataHibernationOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataHibernationOptionsDetails>(
  "AwsEc2LaunchTemplateDataHibernationOptionsDetails",
)({ Configured: S.optional(S.Boolean) }) {}
export class AwsEc2LaunchTemplateDataIamInstanceProfileDetails extends S.Class<AwsEc2LaunchTemplateDataIamInstanceProfileDetails>(
  "AwsEc2LaunchTemplateDataIamInstanceProfileDetails",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export class AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails>(
  "AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails",
)({
  BlockDurationMinutes: S.optional(S.Number),
  InstanceInterruptionBehavior: S.optional(S.String),
  MaxPrice: S.optional(S.String),
  SpotInstanceType: S.optional(S.String),
  ValidUntil: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails>(
  "AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails",
)({
  MarketType: S.optional(S.String),
  SpotOptions: S.optional(
    AwsEc2LaunchTemplateDataInstanceMarketOptionsSpotOptionsDetails,
  ),
}) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails",
)({ Max: S.optional(S.Number), Min: S.optional(S.Number) }) {}
export class AwsEc2LaunchTemplateDataInstanceRequirementsDetails extends S.Class<AwsEc2LaunchTemplateDataInstanceRequirementsDetails>(
  "AwsEc2LaunchTemplateDataInstanceRequirementsDetails",
)({
  AcceleratorCount: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorCountDetails,
  ),
  AcceleratorManufacturers: S.optional(NonEmptyStringList),
  AcceleratorNames: S.optional(NonEmptyStringList),
  AcceleratorTotalMemoryMiB: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsAcceleratorTotalMemoryMiBDetails,
  ),
  AcceleratorTypes: S.optional(NonEmptyStringList),
  BareMetal: S.optional(S.String),
  BaselineEbsBandwidthMbps: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsBaselineEbsBandwidthMbpsDetails,
  ),
  BurstablePerformance: S.optional(S.String),
  CpuManufacturers: S.optional(NonEmptyStringList),
  ExcludedInstanceTypes: S.optional(NonEmptyStringList),
  InstanceGenerations: S.optional(NonEmptyStringList),
  LocalStorage: S.optional(S.String),
  LocalStorageTypes: S.optional(NonEmptyStringList),
  MemoryGiBPerVCpu: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsMemoryGiBPerVCpuDetails,
  ),
  MemoryMiB: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsMemoryMiBDetails,
  ),
  NetworkInterfaceCount: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsNetworkInterfaceCountDetails,
  ),
  OnDemandMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  RequireHibernateSupport: S.optional(S.Boolean),
  SpotMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  TotalLocalStorageGB: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsTotalLocalStorageGBDetails,
  ),
  VCpuCount: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsVCpuCountDetails,
  ),
}) {}
export class AwsEc2LaunchTemplateDataLicenseSetDetails extends S.Class<AwsEc2LaunchTemplateDataLicenseSetDetails>(
  "AwsEc2LaunchTemplateDataLicenseSetDetails",
)({ LicenseConfigurationArn: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataLicenseSetList = S.Array(
  AwsEc2LaunchTemplateDataLicenseSetDetails,
);
export class AwsEc2LaunchTemplateDataMaintenanceOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataMaintenanceOptionsDetails>(
  "AwsEc2LaunchTemplateDataMaintenanceOptionsDetails",
)({ AutoRecovery: S.optional(S.String) }) {}
export class AwsEc2LaunchTemplateDataMetadataOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataMetadataOptionsDetails>(
  "AwsEc2LaunchTemplateDataMetadataOptionsDetails",
)({
  HttpEndpoint: S.optional(S.String),
  HttpProtocolIpv6: S.optional(S.String),
  HttpTokens: S.optional(S.String),
  HttpPutResponseHopLimit: S.optional(S.Number),
  InstanceMetadataTags: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataMonitoringDetails extends S.Class<AwsEc2LaunchTemplateDataMonitoringDetails>(
  "AwsEc2LaunchTemplateDataMonitoringDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails extends S.Class<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails>(
  "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails",
)({ Ipv4Prefix: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesDetails);
export class AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails extends S.Class<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails>(
  "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails",
)({ Ipv6Address: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesDetails);
export class AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails extends S.Class<AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails>(
  "AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails",
)({ Ipv6Prefix: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesDetails);
export class AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails extends S.Class<AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails>(
  "AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails",
)({ Primary: S.optional(S.Boolean), PrivateIpAddress: S.optional(S.String) }) {}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesList =
  S.Array(AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesDetails);
export class AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails extends S.Class<AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails>(
  "AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails",
)({
  AssociateCarrierIpAddress: S.optional(S.Boolean),
  AssociatePublicIpAddress: S.optional(S.Boolean),
  DeleteOnTermination: S.optional(S.Boolean),
  Description: S.optional(S.String),
  DeviceIndex: S.optional(S.Number),
  Groups: S.optional(NonEmptyStringList),
  InterfaceType: S.optional(S.String),
  Ipv4PrefixCount: S.optional(S.Number),
  Ipv4Prefixes: S.optional(
    AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv4PrefixesList,
  ),
  Ipv6AddressCount: S.optional(S.Number),
  Ipv6Addresses: S.optional(
    AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6AddressesList,
  ),
  Ipv6PrefixCount: S.optional(S.Number),
  Ipv6Prefixes: S.optional(
    AwsEc2LaunchTemplateDataNetworkInterfaceSetIpv6PrefixesList,
  ),
  NetworkCardIndex: S.optional(S.Number),
  NetworkInterfaceId: S.optional(S.String),
  PrivateIpAddress: S.optional(S.String),
  PrivateIpAddresses: S.optional(
    AwsEc2LaunchTemplateDataNetworkInterfaceSetPrivateIpAddressesList,
  ),
  SecondaryPrivateIpAddressCount: S.optional(S.Number),
  SubnetId: S.optional(S.String),
}) {}
export const AwsEc2LaunchTemplateDataNetworkInterfaceSetList = S.Array(
  AwsEc2LaunchTemplateDataNetworkInterfaceSetDetails,
);
export class AwsEc2LaunchTemplateDataPlacementDetails extends S.Class<AwsEc2LaunchTemplateDataPlacementDetails>(
  "AwsEc2LaunchTemplateDataPlacementDetails",
)({
  Affinity: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  GroupName: S.optional(S.String),
  HostId: S.optional(S.String),
  HostResourceGroupArn: S.optional(S.String),
  PartitionNumber: S.optional(S.Number),
  SpreadDomain: S.optional(S.String),
  Tenancy: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails extends S.Class<AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails>(
  "AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails",
)({
  EnableResourceNameDnsAAAARecord: S.optional(S.Boolean),
  EnableResourceNameDnsARecord: S.optional(S.Boolean),
  HostnameType: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDataDetails extends S.Class<AwsEc2LaunchTemplateDataDetails>(
  "AwsEc2LaunchTemplateDataDetails",
)({
  BlockDeviceMappingSet: S.optional(
    AwsEc2LaunchTemplateDataBlockDeviceMappingSetList,
  ),
  CapacityReservationSpecification: S.optional(
    AwsEc2LaunchTemplateDataCapacityReservationSpecificationDetails,
  ),
  CpuOptions: S.optional(AwsEc2LaunchTemplateDataCpuOptionsDetails),
  CreditSpecification: S.optional(
    AwsEc2LaunchTemplateDataCreditSpecificationDetails,
  ),
  DisableApiStop: S.optional(S.Boolean),
  DisableApiTermination: S.optional(S.Boolean),
  EbsOptimized: S.optional(S.Boolean),
  ElasticGpuSpecificationSet: S.optional(
    AwsEc2LaunchTemplateDataElasticGpuSpecificationSetList,
  ),
  ElasticInferenceAcceleratorSet: S.optional(
    AwsEc2LaunchTemplateDataElasticInferenceAcceleratorSetList,
  ),
  EnclaveOptions: S.optional(AwsEc2LaunchTemplateDataEnclaveOptionsDetails),
  HibernationOptions: S.optional(
    AwsEc2LaunchTemplateDataHibernationOptionsDetails,
  ),
  IamInstanceProfile: S.optional(
    AwsEc2LaunchTemplateDataIamInstanceProfileDetails,
  ),
  ImageId: S.optional(S.String),
  InstanceInitiatedShutdownBehavior: S.optional(S.String),
  InstanceMarketOptions: S.optional(
    AwsEc2LaunchTemplateDataInstanceMarketOptionsDetails,
  ),
  InstanceRequirements: S.optional(
    AwsEc2LaunchTemplateDataInstanceRequirementsDetails,
  ),
  InstanceType: S.optional(S.String),
  KernelId: S.optional(S.String),
  KeyName: S.optional(S.String),
  LicenseSet: S.optional(AwsEc2LaunchTemplateDataLicenseSetList),
  MaintenanceOptions: S.optional(
    AwsEc2LaunchTemplateDataMaintenanceOptionsDetails,
  ),
  MetadataOptions: S.optional(AwsEc2LaunchTemplateDataMetadataOptionsDetails),
  Monitoring: S.optional(AwsEc2LaunchTemplateDataMonitoringDetails),
  NetworkInterfaceSet: S.optional(
    AwsEc2LaunchTemplateDataNetworkInterfaceSetList,
  ),
  Placement: S.optional(AwsEc2LaunchTemplateDataPlacementDetails),
  PrivateDnsNameOptions: S.optional(
    AwsEc2LaunchTemplateDataPrivateDnsNameOptionsDetails,
  ),
  RamDiskId: S.optional(S.String),
  SecurityGroupIdSet: S.optional(NonEmptyStringList),
  SecurityGroupSet: S.optional(NonEmptyStringList),
  UserData: S.optional(S.String),
}) {}
export class AwsEc2LaunchTemplateDetails extends S.Class<AwsEc2LaunchTemplateDetails>(
  "AwsEc2LaunchTemplateDetails",
)({
  LaunchTemplateName: S.optional(S.String),
  Id: S.optional(S.String),
  LaunchTemplateData: S.optional(AwsEc2LaunchTemplateDataDetails),
  DefaultVersionNumber: S.optional(S.Number),
  LatestVersionNumber: S.optional(S.Number),
}) {}
export class AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails extends S.Class<AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails>(
  "AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails",
)({ MinimumInstanceMetadataServiceVersion: S.optional(S.String) }) {}
export class AwsSageMakerNotebookInstanceDetails extends S.Class<AwsSageMakerNotebookInstanceDetails>(
  "AwsSageMakerNotebookInstanceDetails",
)({
  AcceleratorTypes: S.optional(NonEmptyStringList),
  AdditionalCodeRepositories: S.optional(NonEmptyStringList),
  DefaultCodeRepository: S.optional(S.String),
  DirectInternetAccess: S.optional(S.String),
  FailureReason: S.optional(S.String),
  InstanceMetadataServiceConfiguration: S.optional(
    AwsSageMakerNotebookInstanceMetadataServiceConfigurationDetails,
  ),
  InstanceType: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  NotebookInstanceArn: S.optional(S.String),
  NotebookInstanceLifecycleConfigName: S.optional(S.String),
  NotebookInstanceName: S.optional(S.String),
  NotebookInstanceStatus: S.optional(S.String),
  PlatformIdentifier: S.optional(S.String),
  RoleArn: S.optional(S.String),
  RootAccess: S.optional(S.String),
  SecurityGroups: S.optional(NonEmptyStringList),
  SubnetId: S.optional(S.String),
  Url: S.optional(S.String),
  VolumeSizeInGB: S.optional(S.Number),
}) {}
export class AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails extends S.Class<AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails>(
  "AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails",
)({ ImmunityTime: S.optional(S.Number) }) {}
export class AwsWafv2WebAclCaptchaConfigDetails extends S.Class<AwsWafv2WebAclCaptchaConfigDetails>(
  "AwsWafv2WebAclCaptchaConfigDetails",
)({
  ImmunityTimeProperty: S.optional(
    AwsWafv2WebAclCaptchaConfigImmunityTimePropertyDetails,
  ),
}) {}
export class AwsWafv2CustomHttpHeader extends S.Class<AwsWafv2CustomHttpHeader>(
  "AwsWafv2CustomHttpHeader",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AwsWafv2InsertHeadersList = S.Array(AwsWafv2CustomHttpHeader);
export class AwsWafv2CustomRequestHandlingDetails extends S.Class<AwsWafv2CustomRequestHandlingDetails>(
  "AwsWafv2CustomRequestHandlingDetails",
)({ InsertHeaders: S.optional(AwsWafv2InsertHeadersList) }) {}
export class AwsWafv2ActionAllowDetails extends S.Class<AwsWafv2ActionAllowDetails>(
  "AwsWafv2ActionAllowDetails",
)({
  CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
}) {}
export class AwsWafv2CustomResponseDetails extends S.Class<AwsWafv2CustomResponseDetails>(
  "AwsWafv2CustomResponseDetails",
)({
  CustomResponseBodyKey: S.optional(S.String),
  ResponseCode: S.optional(S.Number),
  ResponseHeaders: S.optional(AwsWafv2InsertHeadersList),
}) {}
export class AwsWafv2ActionBlockDetails extends S.Class<AwsWafv2ActionBlockDetails>(
  "AwsWafv2ActionBlockDetails",
)({ CustomResponse: S.optional(AwsWafv2CustomResponseDetails) }) {}
export class AwsWafv2WebAclActionDetails extends S.Class<AwsWafv2WebAclActionDetails>(
  "AwsWafv2WebAclActionDetails",
)({
  Allow: S.optional(AwsWafv2ActionAllowDetails),
  Block: S.optional(AwsWafv2ActionBlockDetails),
}) {}
export class AwsWafv2RulesActionCaptchaDetails extends S.Class<AwsWafv2RulesActionCaptchaDetails>(
  "AwsWafv2RulesActionCaptchaDetails",
)({
  CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
}) {}
export class AwsWafv2RulesActionCountDetails extends S.Class<AwsWafv2RulesActionCountDetails>(
  "AwsWafv2RulesActionCountDetails",
)({
  CustomRequestHandling: S.optional(AwsWafv2CustomRequestHandlingDetails),
}) {}
export class AwsWafv2RulesActionDetails extends S.Class<AwsWafv2RulesActionDetails>(
  "AwsWafv2RulesActionDetails",
)({
  Allow: S.optional(AwsWafv2ActionAllowDetails),
  Block: S.optional(AwsWafv2ActionBlockDetails),
  Captcha: S.optional(AwsWafv2RulesActionCaptchaDetails),
  Count: S.optional(AwsWafv2RulesActionCountDetails),
}) {}
export class AwsWafv2VisibilityConfigDetails extends S.Class<AwsWafv2VisibilityConfigDetails>(
  "AwsWafv2VisibilityConfigDetails",
)({
  CloudWatchMetricsEnabled: S.optional(S.Boolean),
  MetricName: S.optional(S.String),
  SampledRequestsEnabled: S.optional(S.Boolean),
}) {}
export class AwsWafv2RulesDetails extends S.Class<AwsWafv2RulesDetails>(
  "AwsWafv2RulesDetails",
)({
  Action: S.optional(AwsWafv2RulesActionDetails),
  Name: S.optional(S.String),
  OverrideAction: S.optional(S.String),
  Priority: S.optional(S.Number),
  VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
}) {}
export const AwsWafv2RulesList = S.Array(AwsWafv2RulesDetails);
export class AwsWafv2WebAclDetails extends S.Class<AwsWafv2WebAclDetails>(
  "AwsWafv2WebAclDetails",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  ManagedbyFirewallManager: S.optional(S.Boolean),
  Id: S.optional(S.String),
  Capacity: S.optional(S.Number),
  CaptchaConfig: S.optional(AwsWafv2WebAclCaptchaConfigDetails),
  DefaultAction: S.optional(AwsWafv2WebAclActionDetails),
  Description: S.optional(S.String),
  Rules: S.optional(AwsWafv2RulesList),
  VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
}) {}
export class AwsWafv2RuleGroupDetails extends S.Class<AwsWafv2RuleGroupDetails>(
  "AwsWafv2RuleGroupDetails",
)({
  Capacity: S.optional(S.Number),
  Description: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Rules: S.optional(AwsWafv2RulesList),
  Scope: S.optional(S.String),
  VisibilityConfig: S.optional(AwsWafv2VisibilityConfigDetails),
}) {}
export class AssociationStateDetails extends S.Class<AssociationStateDetails>(
  "AssociationStateDetails",
)({ State: S.optional(S.String), StatusMessage: S.optional(S.String) }) {}
export class AssociationSetDetails extends S.Class<AssociationSetDetails>(
  "AssociationSetDetails",
)({
  AssociationState: S.optional(AssociationStateDetails),
  GatewayId: S.optional(S.String),
  Main: S.optional(S.Boolean),
  RouteTableAssociationId: S.optional(S.String),
  RouteTableId: S.optional(S.String),
  SubnetId: S.optional(S.String),
}) {}
export const AssociationSetList = S.Array(AssociationSetDetails);
export class PropagatingVgwSetDetails extends S.Class<PropagatingVgwSetDetails>(
  "PropagatingVgwSetDetails",
)({ GatewayId: S.optional(S.String) }) {}
export const PropagatingVgwSetList = S.Array(PropagatingVgwSetDetails);
export class RouteSetDetails extends S.Class<RouteSetDetails>(
  "RouteSetDetails",
)({
  CarrierGatewayId: S.optional(S.String),
  CoreNetworkArn: S.optional(S.String),
  DestinationCidrBlock: S.optional(S.String),
  DestinationIpv6CidrBlock: S.optional(S.String),
  DestinationPrefixListId: S.optional(S.String),
  EgressOnlyInternetGatewayId: S.optional(S.String),
  GatewayId: S.optional(S.String),
  InstanceId: S.optional(S.String),
  InstanceOwnerId: S.optional(S.String),
  LocalGatewayId: S.optional(S.String),
  NatGatewayId: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  Origin: S.optional(S.String),
  State: S.optional(S.String),
  TransitGatewayId: S.optional(S.String),
  VpcPeeringConnectionId: S.optional(S.String),
}) {}
export const RouteSetList = S.Array(RouteSetDetails);
export class AwsEc2RouteTableDetails extends S.Class<AwsEc2RouteTableDetails>(
  "AwsEc2RouteTableDetails",
)({
  AssociationSet: S.optional(AssociationSetList),
  OwnerId: S.optional(S.String),
  PropagatingVgwSet: S.optional(PropagatingVgwSetList),
  RouteTableId: S.optional(S.String),
  RouteSet: S.optional(RouteSetList),
  VpcId: S.optional(S.String),
}) {}
export class AwsAmazonMqBrokerEncryptionOptionsDetails extends S.Class<AwsAmazonMqBrokerEncryptionOptionsDetails>(
  "AwsAmazonMqBrokerEncryptionOptionsDetails",
)({ KmsKeyId: S.optional(S.String), UseAwsOwnedKey: S.optional(S.Boolean) }) {}
export class AwsAmazonMqBrokerLdapServerMetadataDetails extends S.Class<AwsAmazonMqBrokerLdapServerMetadataDetails>(
  "AwsAmazonMqBrokerLdapServerMetadataDetails",
)({
  Hosts: S.optional(StringList),
  RoleBase: S.optional(S.String),
  RoleName: S.optional(S.String),
  RoleSearchMatching: S.optional(S.String),
  RoleSearchSubtree: S.optional(S.Boolean),
  ServiceAccountUsername: S.optional(S.String),
  UserBase: S.optional(S.String),
  UserRoleName: S.optional(S.String),
  UserSearchMatching: S.optional(S.String),
  UserSearchSubtree: S.optional(S.Boolean),
}) {}
export class AwsAmazonMqBrokerLogsPendingDetails extends S.Class<AwsAmazonMqBrokerLogsPendingDetails>(
  "AwsAmazonMqBrokerLogsPendingDetails",
)({ Audit: S.optional(S.Boolean), General: S.optional(S.Boolean) }) {}
export class AwsAmazonMqBrokerLogsDetails extends S.Class<AwsAmazonMqBrokerLogsDetails>(
  "AwsAmazonMqBrokerLogsDetails",
)({
  Audit: S.optional(S.Boolean),
  General: S.optional(S.Boolean),
  AuditLogGroup: S.optional(S.String),
  GeneralLogGroup: S.optional(S.String),
  Pending: S.optional(AwsAmazonMqBrokerLogsPendingDetails),
}) {}
export class AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails extends S.Class<AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails>(
  "AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails",
)({
  DayOfWeek: S.optional(S.String),
  TimeOfDay: S.optional(S.String),
  TimeZone: S.optional(S.String),
}) {}
export class AwsAmazonMqBrokerUsersDetails extends S.Class<AwsAmazonMqBrokerUsersDetails>(
  "AwsAmazonMqBrokerUsersDetails",
)({ PendingChange: S.optional(S.String), Username: S.optional(S.String) }) {}
export const AwsAmazonMqBrokerUsersList = S.Array(
  AwsAmazonMqBrokerUsersDetails,
);
export class AwsAmazonMqBrokerDetails extends S.Class<AwsAmazonMqBrokerDetails>(
  "AwsAmazonMqBrokerDetails",
)({
  AuthenticationStrategy: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  BrokerArn: S.optional(S.String),
  BrokerName: S.optional(S.String),
  DeploymentMode: S.optional(S.String),
  EncryptionOptions: S.optional(AwsAmazonMqBrokerEncryptionOptionsDetails),
  EngineType: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  HostInstanceType: S.optional(S.String),
  BrokerId: S.optional(S.String),
  LdapServerMetadata: S.optional(AwsAmazonMqBrokerLdapServerMetadataDetails),
  Logs: S.optional(AwsAmazonMqBrokerLogsDetails),
  MaintenanceWindowStartTime: S.optional(
    AwsAmazonMqBrokerMaintenanceWindowStartTimeDetails,
  ),
  PubliclyAccessible: S.optional(S.Boolean),
  SecurityGroups: S.optional(StringList),
  StorageType: S.optional(S.String),
  SubnetIds: S.optional(StringList),
  Users: S.optional(AwsAmazonMqBrokerUsersList),
}) {}
export class AwsAppSyncGraphQlApiOpenIdConnectConfigDetails extends S.Class<AwsAppSyncGraphQlApiOpenIdConnectConfigDetails>(
  "AwsAppSyncGraphQlApiOpenIdConnectConfigDetails",
)({
  AuthTtL: S.optional(S.Number),
  ClientId: S.optional(S.String),
  IatTtL: S.optional(S.Number),
  Issuer: S.optional(S.String),
}) {}
export class AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails extends S.Class<AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails>(
  "AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails",
)({
  AuthorizerResultTtlInSeconds: S.optional(S.Number),
  AuthorizerUri: S.optional(S.String),
  IdentityValidationExpression: S.optional(S.String),
}) {}
export class AwsAppSyncGraphQlApiUserPoolConfigDetails extends S.Class<AwsAppSyncGraphQlApiUserPoolConfigDetails>(
  "AwsAppSyncGraphQlApiUserPoolConfigDetails",
)({
  AppIdClientRegex: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  DefaultAction: S.optional(S.String),
  UserPoolId: S.optional(S.String),
}) {}
export class AwsAppSyncGraphQlApiLogConfigDetails extends S.Class<AwsAppSyncGraphQlApiLogConfigDetails>(
  "AwsAppSyncGraphQlApiLogConfigDetails",
)({
  CloudWatchLogsRoleArn: S.optional(S.String),
  ExcludeVerboseContent: S.optional(S.Boolean),
  FieldLogLevel: S.optional(S.String),
}) {}
export class AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails extends S.Class<AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails>(
  "AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails",
)({
  AuthenticationType: S.optional(S.String),
  LambdaAuthorizerConfig: S.optional(
    AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails,
  ),
  OpenIdConnectConfig: S.optional(
    AwsAppSyncGraphQlApiOpenIdConnectConfigDetails,
  ),
  UserPoolConfig: S.optional(AwsAppSyncGraphQlApiUserPoolConfigDetails),
}) {}
export const AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersList =
  S.Array(AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersDetails);
export class AwsAppSyncGraphQlApiDetails extends S.Class<AwsAppSyncGraphQlApiDetails>(
  "AwsAppSyncGraphQlApiDetails",
)({
  ApiId: S.optional(S.String),
  Id: S.optional(S.String),
  OpenIdConnectConfig: S.optional(
    AwsAppSyncGraphQlApiOpenIdConnectConfigDetails,
  ),
  Name: S.optional(S.String),
  LambdaAuthorizerConfig: S.optional(
    AwsAppSyncGraphQlApiLambdaAuthorizerConfigDetails,
  ),
  XrayEnabled: S.optional(S.Boolean),
  Arn: S.optional(S.String),
  UserPoolConfig: S.optional(AwsAppSyncGraphQlApiUserPoolConfigDetails),
  AuthenticationType: S.optional(S.String),
  LogConfig: S.optional(AwsAppSyncGraphQlApiLogConfigDetails),
  AdditionalAuthenticationProviders: S.optional(
    AwsAppSyncGraphQlApiAdditionalAuthenticationProvidersList,
  ),
  WafWebAclArn: S.optional(S.String),
}) {}
export class AwsEventSchemasRegistryDetails extends S.Class<AwsEventSchemasRegistryDetails>(
  "AwsEventSchemasRegistryDetails",
)({
  Description: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
}) {}
export class AwsGuardDutyDetectorDataSourcesCloudTrailDetails extends S.Class<AwsGuardDutyDetectorDataSourcesCloudTrailDetails>(
  "AwsGuardDutyDetectorDataSourcesCloudTrailDetails",
)({ Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesDnsLogsDetails extends S.Class<AwsGuardDutyDetectorDataSourcesDnsLogsDetails>(
  "AwsGuardDutyDetectorDataSourcesDnsLogsDetails",
)({ Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesFlowLogsDetails extends S.Class<AwsGuardDutyDetectorDataSourcesFlowLogsDetails>(
  "AwsGuardDutyDetectorDataSourcesFlowLogsDetails",
)({ Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails extends S.Class<AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails>(
  "AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails",
)({ Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesKubernetesDetails extends S.Class<AwsGuardDutyDetectorDataSourcesKubernetesDetails>(
  "AwsGuardDutyDetectorDataSourcesKubernetesDetails",
)({
  AuditLogs: S.optional(
    AwsGuardDutyDetectorDataSourcesKubernetesAuditLogsDetails,
  ),
}) {}
export class AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails extends S.Class<AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails>(
  "AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails",
)({ Reason: S.optional(S.String), Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails extends S.Class<AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails>(
  "AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails",
)({
  EbsVolumes: S.optional(
    AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsEbsVolumesDetails,
  ),
}) {}
export class AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails extends S.Class<AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails>(
  "AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails",
)({
  ScanEc2InstanceWithFindings: S.optional(
    AwsGuardDutyDetectorDataSourcesMalwareProtectionScanEc2InstanceWithFindingsDetails,
  ),
  ServiceRole: S.optional(S.String),
}) {}
export class AwsGuardDutyDetectorDataSourcesS3LogsDetails extends S.Class<AwsGuardDutyDetectorDataSourcesS3LogsDetails>(
  "AwsGuardDutyDetectorDataSourcesS3LogsDetails",
)({ Status: S.optional(S.String) }) {}
export class AwsGuardDutyDetectorDataSourcesDetails extends S.Class<AwsGuardDutyDetectorDataSourcesDetails>(
  "AwsGuardDutyDetectorDataSourcesDetails",
)({
  CloudTrail: S.optional(AwsGuardDutyDetectorDataSourcesCloudTrailDetails),
  DnsLogs: S.optional(AwsGuardDutyDetectorDataSourcesDnsLogsDetails),
  FlowLogs: S.optional(AwsGuardDutyDetectorDataSourcesFlowLogsDetails),
  Kubernetes: S.optional(AwsGuardDutyDetectorDataSourcesKubernetesDetails),
  MalwareProtection: S.optional(
    AwsGuardDutyDetectorDataSourcesMalwareProtectionDetails,
  ),
  S3Logs: S.optional(AwsGuardDutyDetectorDataSourcesS3LogsDetails),
}) {}
export class AwsGuardDutyDetectorFeaturesDetails extends S.Class<AwsGuardDutyDetectorFeaturesDetails>(
  "AwsGuardDutyDetectorFeaturesDetails",
)({ Name: S.optional(S.String), Status: S.optional(S.String) }) {}
export const AwsGuardDutyDetectorFeaturesList = S.Array(
  AwsGuardDutyDetectorFeaturesDetails,
);
export class AwsGuardDutyDetectorDetails extends S.Class<AwsGuardDutyDetectorDetails>(
  "AwsGuardDutyDetectorDetails",
)({
  DataSources: S.optional(AwsGuardDutyDetectorDataSourcesDetails),
  Features: S.optional(AwsGuardDutyDetectorFeaturesList),
  FindingPublishingFrequency: S.optional(S.String),
  ServiceRole: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails extends S.Class<AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails>(
  "AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails",
)({ LogGroupArn: S.optional(S.String) }) {}
export class AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails extends S.Class<AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails>(
  "AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails",
)({
  CloudWatchLogsLogGroup: S.optional(
    AwsStepFunctionStateMachineLoggingConfigurationDestinationsCloudWatchLogsLogGroupDetails,
  ),
}) {}
export const AwsStepFunctionStateMachineLoggingConfigurationDestinationsList =
  S.Array(AwsStepFunctionStateMachineLoggingConfigurationDestinationsDetails);
export class AwsStepFunctionStateMachineLoggingConfigurationDetails extends S.Class<AwsStepFunctionStateMachineLoggingConfigurationDetails>(
  "AwsStepFunctionStateMachineLoggingConfigurationDetails",
)({
  Destinations: S.optional(
    AwsStepFunctionStateMachineLoggingConfigurationDestinationsList,
  ),
  IncludeExecutionData: S.optional(S.Boolean),
  Level: S.optional(S.String),
}) {}
export class AwsStepFunctionStateMachineTracingConfigurationDetails extends S.Class<AwsStepFunctionStateMachineTracingConfigurationDetails>(
  "AwsStepFunctionStateMachineTracingConfigurationDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsStepFunctionStateMachineDetails extends S.Class<AwsStepFunctionStateMachineDetails>(
  "AwsStepFunctionStateMachineDetails",
)({
  Label: S.optional(S.String),
  LoggingConfiguration: S.optional(
    AwsStepFunctionStateMachineLoggingConfigurationDetails,
  ),
  Name: S.optional(S.String),
  RoleArn: S.optional(S.String),
  StateMachineArn: S.optional(S.String),
  Status: S.optional(S.String),
  TracingConfiguration: S.optional(
    AwsStepFunctionStateMachineTracingConfigurationDetails,
  ),
  Type: S.optional(S.String),
}) {}
export class AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails extends S.Class<AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails>(
  "AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails",
)({ EncryptionOption: S.optional(S.String), KmsKey: S.optional(S.String) }) {}
export class AwsAthenaWorkGroupConfigurationResultConfigurationDetails extends S.Class<AwsAthenaWorkGroupConfigurationResultConfigurationDetails>(
  "AwsAthenaWorkGroupConfigurationResultConfigurationDetails",
)({
  EncryptionConfiguration: S.optional(
    AwsAthenaWorkGroupConfigurationResultConfigurationEncryptionConfigurationDetails,
  ),
}) {}
export class AwsAthenaWorkGroupConfigurationDetails extends S.Class<AwsAthenaWorkGroupConfigurationDetails>(
  "AwsAthenaWorkGroupConfigurationDetails",
)({
  ResultConfiguration: S.optional(
    AwsAthenaWorkGroupConfigurationResultConfigurationDetails,
  ),
}) {}
export class AwsAthenaWorkGroupDetails extends S.Class<AwsAthenaWorkGroupDetails>(
  "AwsAthenaWorkGroupDetails",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  State: S.optional(S.String),
  Configuration: S.optional(AwsAthenaWorkGroupConfigurationDetails),
}) {}
export class AwsEventsEventbusDetails extends S.Class<AwsEventsEventbusDetails>(
  "AwsEventsEventbusDetails",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Policy: S.optional(S.String),
}) {}
export class AwsDmsEndpointDetails extends S.Class<AwsDmsEndpointDetails>(
  "AwsDmsEndpointDetails",
)({
  CertificateArn: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  EndpointArn: S.optional(S.String),
  EndpointIdentifier: S.optional(S.String),
  EndpointType: S.optional(S.String),
  EngineName: S.optional(S.String),
  ExternalId: S.optional(S.String),
  ExtraConnectionAttributes: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  SslMode: S.optional(S.String),
  Username: S.optional(S.String),
}) {}
export class AwsEventsEndpointEventBusesDetails extends S.Class<AwsEventsEndpointEventBusesDetails>(
  "AwsEventsEndpointEventBusesDetails",
)({ EventBusArn: S.optional(S.String) }) {}
export const AwsEventsEndpointEventBusesList = S.Array(
  AwsEventsEndpointEventBusesDetails,
);
export class AwsEventsEndpointReplicationConfigDetails extends S.Class<AwsEventsEndpointReplicationConfigDetails>(
  "AwsEventsEndpointReplicationConfigDetails",
)({ State: S.optional(S.String) }) {}
export class AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails extends S.Class<AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails>(
  "AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails",
)({ HealthCheck: S.optional(S.String) }) {}
export class AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails extends S.Class<AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails>(
  "AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails",
)({ Route: S.optional(S.String) }) {}
export class AwsEventsEndpointRoutingConfigFailoverConfigDetails extends S.Class<AwsEventsEndpointRoutingConfigFailoverConfigDetails>(
  "AwsEventsEndpointRoutingConfigFailoverConfigDetails",
)({
  Primary: S.optional(
    AwsEventsEndpointRoutingConfigFailoverConfigPrimaryDetails,
  ),
  Secondary: S.optional(
    AwsEventsEndpointRoutingConfigFailoverConfigSecondaryDetails,
  ),
}) {}
export class AwsEventsEndpointRoutingConfigDetails extends S.Class<AwsEventsEndpointRoutingConfigDetails>(
  "AwsEventsEndpointRoutingConfigDetails",
)({
  FailoverConfig: S.optional(
    AwsEventsEndpointRoutingConfigFailoverConfigDetails,
  ),
}) {}
export class AwsEventsEndpointDetails extends S.Class<AwsEventsEndpointDetails>(
  "AwsEventsEndpointDetails",
)({
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  EndpointId: S.optional(S.String),
  EndpointUrl: S.optional(S.String),
  EventBuses: S.optional(AwsEventsEndpointEventBusesList),
  Name: S.optional(S.String),
  ReplicationConfig: S.optional(AwsEventsEndpointReplicationConfigDetails),
  RoleArn: S.optional(S.String),
  RoutingConfig: S.optional(AwsEventsEndpointRoutingConfigDetails),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
}) {}
export class AwsDmsReplicationTaskDetails extends S.Class<AwsDmsReplicationTaskDetails>(
  "AwsDmsReplicationTaskDetails",
)({
  CdcStartPosition: S.optional(S.String),
  CdcStartTime: S.optional(S.String),
  CdcStopPosition: S.optional(S.String),
  MigrationType: S.optional(S.String),
  Id: S.optional(S.String),
  ResourceIdentifier: S.optional(S.String),
  ReplicationInstanceArn: S.optional(S.String),
  ReplicationTaskIdentifier: S.optional(S.String),
  ReplicationTaskSettings: S.optional(S.String),
  SourceEndpointArn: S.optional(S.String),
  TableMappings: S.optional(S.String),
  TargetEndpointArn: S.optional(S.String),
  TaskData: S.optional(S.String),
}) {}
export class AwsDmsReplicationInstanceReplicationSubnetGroupDetails extends S.Class<AwsDmsReplicationInstanceReplicationSubnetGroupDetails>(
  "AwsDmsReplicationInstanceReplicationSubnetGroupDetails",
)({ ReplicationSubnetGroupIdentifier: S.optional(S.String) }) {}
export class AwsDmsReplicationInstanceVpcSecurityGroupsDetails extends S.Class<AwsDmsReplicationInstanceVpcSecurityGroupsDetails>(
  "AwsDmsReplicationInstanceVpcSecurityGroupsDetails",
)({ VpcSecurityGroupId: S.optional(S.String) }) {}
export const AwsDmsReplicationInstanceVpcSecurityGroupsList = S.Array(
  AwsDmsReplicationInstanceVpcSecurityGroupsDetails,
);
export class AwsDmsReplicationInstanceDetails extends S.Class<AwsDmsReplicationInstanceDetails>(
  "AwsDmsReplicationInstanceDetails",
)({
  AllocatedStorage: S.optional(S.Number),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  AvailabilityZone: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  MultiAZ: S.optional(S.Boolean),
  PreferredMaintenanceWindow: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  ReplicationInstanceClass: S.optional(S.String),
  ReplicationInstanceIdentifier: S.optional(S.String),
  ReplicationSubnetGroup: S.optional(
    AwsDmsReplicationInstanceReplicationSubnetGroupDetails,
  ),
  VpcSecurityGroups: S.optional(AwsDmsReplicationInstanceVpcSecurityGroupsList),
}) {}
export class AwsRoute53HostedZoneConfigDetails extends S.Class<AwsRoute53HostedZoneConfigDetails>(
  "AwsRoute53HostedZoneConfigDetails",
)({ Comment: S.optional(S.String) }) {}
export class AwsRoute53HostedZoneObjectDetails extends S.Class<AwsRoute53HostedZoneObjectDetails>(
  "AwsRoute53HostedZoneObjectDetails",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Config: S.optional(AwsRoute53HostedZoneConfigDetails),
}) {}
export class AwsRoute53HostedZoneVpcDetails extends S.Class<AwsRoute53HostedZoneVpcDetails>(
  "AwsRoute53HostedZoneVpcDetails",
)({ Id: S.optional(S.String), Region: S.optional(S.String) }) {}
export const AwsRoute53HostedZoneVpcsList = S.Array(
  AwsRoute53HostedZoneVpcDetails,
);
export const AwsRoute53HostedZoneNameServersList = S.Array(S.String);
export class CloudWatchLogsLogGroupArnConfigDetails extends S.Class<CloudWatchLogsLogGroupArnConfigDetails>(
  "CloudWatchLogsLogGroupArnConfigDetails",
)({
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  HostedZoneId: S.optional(S.String),
  Id: S.optional(S.String),
}) {}
export class AwsRoute53QueryLoggingConfigDetails extends S.Class<AwsRoute53QueryLoggingConfigDetails>(
  "AwsRoute53QueryLoggingConfigDetails",
)({
  CloudWatchLogsLogGroupArn: S.optional(CloudWatchLogsLogGroupArnConfigDetails),
}) {}
export class AwsRoute53HostedZoneDetails extends S.Class<AwsRoute53HostedZoneDetails>(
  "AwsRoute53HostedZoneDetails",
)({
  HostedZone: S.optional(AwsRoute53HostedZoneObjectDetails),
  Vpcs: S.optional(AwsRoute53HostedZoneVpcsList),
  NameServers: S.optional(AwsRoute53HostedZoneNameServersList),
  QueryLoggingConfig: S.optional(AwsRoute53QueryLoggingConfigDetails),
}) {}
export class AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails extends S.Class<AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails>(
  "AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails",
)({ InCluster: S.optional(S.Boolean), ClientBroker: S.optional(S.String) }) {}
export class AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails extends S.Class<AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails>(
  "AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails",
)({ DataVolumeKMSKeyId: S.optional(S.String) }) {}
export class AwsMskClusterClusterInfoEncryptionInfoDetails extends S.Class<AwsMskClusterClusterInfoEncryptionInfoDetails>(
  "AwsMskClusterClusterInfoEncryptionInfoDetails",
)({
  EncryptionInTransit: S.optional(
    AwsMskClusterClusterInfoEncryptionInfoEncryptionInTransitDetails,
  ),
  EncryptionAtRest: S.optional(
    AwsMskClusterClusterInfoEncryptionInfoEncryptionAtRestDetails,
  ),
}) {}
export class AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsMskClusterClusterInfoClientAuthenticationSaslDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationSaslDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationSaslDetails",
)({
  Iam: S.optional(AwsMskClusterClusterInfoClientAuthenticationSaslIamDetails),
  Scram: S.optional(
    AwsMskClusterClusterInfoClientAuthenticationSaslScramDetails,
  ),
}) {}
export class AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails",
)({ Enabled: S.optional(S.Boolean) }) {}
export class AwsMskClusterClusterInfoClientAuthenticationTlsDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationTlsDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationTlsDetails",
)({
  CertificateAuthorityArnList: S.optional(StringList),
  Enabled: S.optional(S.Boolean),
}) {}
export class AwsMskClusterClusterInfoClientAuthenticationDetails extends S.Class<AwsMskClusterClusterInfoClientAuthenticationDetails>(
  "AwsMskClusterClusterInfoClientAuthenticationDetails",
)({
  Sasl: S.optional(AwsMskClusterClusterInfoClientAuthenticationSaslDetails),
  Unauthenticated: S.optional(
    AwsMskClusterClusterInfoClientAuthenticationUnauthenticatedDetails,
  ),
  Tls: S.optional(AwsMskClusterClusterInfoClientAuthenticationTlsDetails),
}) {}
export class AwsMskClusterClusterInfoDetails extends S.Class<AwsMskClusterClusterInfoDetails>(
  "AwsMskClusterClusterInfoDetails",
)({
  EncryptionInfo: S.optional(AwsMskClusterClusterInfoEncryptionInfoDetails),
  CurrentVersion: S.optional(S.String),
  NumberOfBrokerNodes: S.optional(S.Number),
  ClusterName: S.optional(S.String),
  ClientAuthentication: S.optional(
    AwsMskClusterClusterInfoClientAuthenticationDetails,
  ),
  EnhancedMonitoring: S.optional(S.String),
}) {}
export class AwsMskClusterDetails extends S.Class<AwsMskClusterDetails>(
  "AwsMskClusterDetails",
)({ ClusterInfo: S.optional(AwsMskClusterClusterInfoDetails) }) {}
export class AwsS3AccessPointVpcConfigurationDetails extends S.Class<AwsS3AccessPointVpcConfigurationDetails>(
  "AwsS3AccessPointVpcConfigurationDetails",
)({ VpcId: S.optional(S.String) }) {}
export class AwsS3AccessPointDetails extends S.Class<AwsS3AccessPointDetails>(
  "AwsS3AccessPointDetails",
)({
  AccessPointArn: S.optional(S.String),
  Alias: S.optional(S.String),
  Bucket: S.optional(S.String),
  BucketAccountId: S.optional(S.String),
  Name: S.optional(S.String),
  NetworkOrigin: S.optional(S.String),
  PublicAccessBlockConfiguration: S.optional(
    AwsS3AccountPublicAccessBlockDetails,
  ),
  VpcConfiguration: S.optional(AwsS3AccessPointVpcConfigurationDetails),
}) {}
export class AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails extends S.Class<AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails>(
  "AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails",
)({ DirectoryId: S.optional(S.String) }) {}
export class AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails extends S.Class<AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails>(
  "AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails",
)({ ClientRootCertificateChain: S.optional(S.String) }) {}
export class AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails extends S.Class<AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails>(
  "AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails",
)({
  SamlProviderArn: S.optional(S.String),
  SelfServiceSamlProviderArn: S.optional(S.String),
}) {}
export class AwsEc2ClientVpnEndpointAuthenticationOptionsDetails extends S.Class<AwsEc2ClientVpnEndpointAuthenticationOptionsDetails>(
  "AwsEc2ClientVpnEndpointAuthenticationOptionsDetails",
)({
  Type: S.optional(S.String),
  ActiveDirectory: S.optional(
    AwsEc2ClientVpnEndpointAuthenticationOptionsActiveDirectoryDetails,
  ),
  MutualAuthentication: S.optional(
    AwsEc2ClientVpnEndpointAuthenticationOptionsMutualAuthenticationDetails,
  ),
  FederatedAuthentication: S.optional(
    AwsEc2ClientVpnEndpointAuthenticationOptionsFederatedAuthenticationDetails,
  ),
}) {}
export const AwsEc2ClientVpnEndpointAuthenticationOptionsList = S.Array(
  AwsEc2ClientVpnEndpointAuthenticationOptionsDetails,
);
export class AwsEc2ClientVpnEndpointConnectionLogOptionsDetails extends S.Class<AwsEc2ClientVpnEndpointConnectionLogOptionsDetails>(
  "AwsEc2ClientVpnEndpointConnectionLogOptionsDetails",
)({
  Enabled: S.optional(S.Boolean),
  CloudwatchLogGroup: S.optional(S.String),
  CloudwatchLogStream: S.optional(S.String),
}) {}
export class AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails extends S.Class<AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails>(
  "AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails",
)({ Code: S.optional(S.String), Message: S.optional(S.String) }) {}
export class AwsEc2ClientVpnEndpointClientConnectOptionsDetails extends S.Class<AwsEc2ClientVpnEndpointClientConnectOptionsDetails>(
  "AwsEc2ClientVpnEndpointClientConnectOptionsDetails",
)({
  Enabled: S.optional(S.Boolean),
  LambdaFunctionArn: S.optional(S.String),
  Status: S.optional(AwsEc2ClientVpnEndpointClientConnectOptionsStatusDetails),
}) {}
export class AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails extends S.Class<AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails>(
  "AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails",
)({ Enabled: S.optional(S.Boolean), BannerText: S.optional(S.String) }) {}
export class AwsEc2ClientVpnEndpointDetails extends S.Class<AwsEc2ClientVpnEndpointDetails>(
  "AwsEc2ClientVpnEndpointDetails",
)({
  ClientVpnEndpointId: S.optional(S.String),
  Description: S.optional(S.String),
  ClientCidrBlock: S.optional(S.String),
  DnsServer: S.optional(StringList),
  SplitTunnel: S.optional(S.Boolean),
  TransportProtocol: S.optional(S.String),
  VpnPort: S.optional(S.Number),
  ServerCertificateArn: S.optional(S.String),
  AuthenticationOptions: S.optional(
    AwsEc2ClientVpnEndpointAuthenticationOptionsList,
  ),
  ConnectionLogOptions: S.optional(
    AwsEc2ClientVpnEndpointConnectionLogOptionsDetails,
  ),
  SecurityGroupIdSet: S.optional(StringList),
  VpcId: S.optional(S.String),
  SelfServicePortalUrl: S.optional(S.String),
  ClientConnectOptions: S.optional(
    AwsEc2ClientVpnEndpointClientConnectOptionsDetails,
  ),
  SessionTimeoutHours: S.optional(S.Number),
  ClientLoginBannerOptions: S.optional(
    AwsEc2ClientVpnEndpointClientLoginBannerOptionsDetails,
  ),
}) {}
export class CodeRepositoryDetails extends S.Class<CodeRepositoryDetails>(
  "CodeRepositoryDetails",
)({
  ProviderType: S.optional(S.String),
  ProjectName: S.optional(S.String),
  CodeSecurityIntegrationArn: S.optional(S.String),
}) {}
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({
  AwsAutoScalingAutoScalingGroup: S.optional(
    AwsAutoScalingAutoScalingGroupDetails,
  ),
  AwsCodeBuildProject: S.optional(AwsCodeBuildProjectDetails),
  AwsCloudFrontDistribution: S.optional(AwsCloudFrontDistributionDetails),
  AwsEc2Instance: S.optional(AwsEc2InstanceDetails),
  AwsEc2NetworkInterface: S.optional(AwsEc2NetworkInterfaceDetails),
  AwsEc2SecurityGroup: S.optional(AwsEc2SecurityGroupDetails),
  AwsEc2Volume: S.optional(AwsEc2VolumeDetails),
  AwsEc2Vpc: S.optional(AwsEc2VpcDetails),
  AwsEc2Eip: S.optional(AwsEc2EipDetails),
  AwsEc2Subnet: S.optional(AwsEc2SubnetDetails),
  AwsEc2NetworkAcl: S.optional(AwsEc2NetworkAclDetails),
  AwsElbv2LoadBalancer: S.optional(AwsElbv2LoadBalancerDetails),
  AwsElasticBeanstalkEnvironment: S.optional(
    AwsElasticBeanstalkEnvironmentDetails,
  ),
  AwsElasticsearchDomain: S.optional(AwsElasticsearchDomainDetails),
  AwsS3Bucket: S.optional(AwsS3BucketDetails),
  AwsS3AccountPublicAccessBlock: S.optional(
    AwsS3AccountPublicAccessBlockDetails,
  ),
  AwsS3Object: S.optional(AwsS3ObjectDetails),
  AwsSecretsManagerSecret: S.optional(AwsSecretsManagerSecretDetails),
  AwsIamAccessKey: S.optional(AwsIamAccessKeyDetails),
  AwsIamUser: S.optional(AwsIamUserDetails),
  AwsIamPolicy: S.optional(AwsIamPolicyDetails),
  AwsApiGatewayV2Stage: S.optional(AwsApiGatewayV2StageDetails),
  AwsApiGatewayV2Api: S.optional(AwsApiGatewayV2ApiDetails),
  AwsDynamoDbTable: S.optional(AwsDynamoDbTableDetails),
  AwsApiGatewayStage: S.optional(AwsApiGatewayStageDetails),
  AwsApiGatewayRestApi: S.optional(AwsApiGatewayRestApiDetails),
  AwsCloudTrailTrail: S.optional(AwsCloudTrailTrailDetails),
  AwsSsmPatchCompliance: S.optional(AwsSsmPatchComplianceDetails),
  AwsCertificateManagerCertificate: S.optional(
    AwsCertificateManagerCertificateDetails,
  ),
  AwsRedshiftCluster: S.optional(AwsRedshiftClusterDetails),
  AwsElbLoadBalancer: S.optional(AwsElbLoadBalancerDetails),
  AwsIamGroup: S.optional(AwsIamGroupDetails),
  AwsIamRole: S.optional(AwsIamRoleDetails),
  AwsKmsKey: S.optional(AwsKmsKeyDetails),
  AwsLambdaFunction: S.optional(AwsLambdaFunctionDetails),
  AwsLambdaLayerVersion: S.optional(AwsLambdaLayerVersionDetails),
  AwsRdsDbInstance: S.optional(AwsRdsDbInstanceDetails),
  AwsSnsTopic: S.optional(AwsSnsTopicDetails),
  AwsSqsQueue: S.optional(AwsSqsQueueDetails),
  AwsWafWebAcl: S.optional(AwsWafWebAclDetails),
  AwsRdsDbSnapshot: S.optional(AwsRdsDbSnapshotDetails),
  AwsRdsDbClusterSnapshot: S.optional(AwsRdsDbClusterSnapshotDetails),
  AwsRdsDbCluster: S.optional(AwsRdsDbClusterDetails),
  AwsEcsCluster: S.optional(AwsEcsClusterDetails),
  AwsEcsContainer: S.optional(AwsEcsContainerDetails),
  AwsEcsTaskDefinition: S.optional(AwsEcsTaskDefinitionDetails),
  Container: S.optional(ContainerDetails),
  Other: S.optional(FieldMap),
  AwsRdsEventSubscription: S.optional(AwsRdsEventSubscriptionDetails),
  AwsEcsService: S.optional(AwsEcsServiceDetails),
  AwsAutoScalingLaunchConfiguration: S.optional(
    AwsAutoScalingLaunchConfigurationDetails,
  ),
  AwsEc2VpnConnection: S.optional(AwsEc2VpnConnectionDetails),
  AwsEcrContainerImage: S.optional(AwsEcrContainerImageDetails),
  AwsOpenSearchServiceDomain: S.optional(AwsOpenSearchServiceDomainDetails),
  AwsEc2VpcEndpointService: S.optional(AwsEc2VpcEndpointServiceDetails),
  AwsXrayEncryptionConfig: S.optional(AwsXrayEncryptionConfigDetails),
  AwsWafRateBasedRule: S.optional(AwsWafRateBasedRuleDetails),
  AwsWafRegionalRateBasedRule: S.optional(AwsWafRegionalRateBasedRuleDetails),
  AwsEcrRepository: S.optional(AwsEcrRepositoryDetails),
  AwsEksCluster: S.optional(AwsEksClusterDetails),
  AwsNetworkFirewallFirewallPolicy: S.optional(
    AwsNetworkFirewallFirewallPolicyDetails,
  ),
  AwsNetworkFirewallFirewall: S.optional(AwsNetworkFirewallFirewallDetails),
  AwsNetworkFirewallRuleGroup: S.optional(AwsNetworkFirewallRuleGroupDetails),
  AwsRdsDbSecurityGroup: S.optional(AwsRdsDbSecurityGroupDetails),
  AwsKinesisStream: S.optional(AwsKinesisStreamDetails),
  AwsEc2TransitGateway: S.optional(AwsEc2TransitGatewayDetails),
  AwsEfsAccessPoint: S.optional(AwsEfsAccessPointDetails),
  AwsCloudFormationStack: S.optional(AwsCloudFormationStackDetails),
  AwsCloudWatchAlarm: S.optional(AwsCloudWatchAlarmDetails),
  AwsEc2VpcPeeringConnection: S.optional(AwsEc2VpcPeeringConnectionDetails),
  AwsWafRegionalRuleGroup: S.optional(AwsWafRegionalRuleGroupDetails),
  AwsWafRegionalRule: S.optional(AwsWafRegionalRuleDetails),
  AwsWafRegionalWebAcl: S.optional(AwsWafRegionalWebAclDetails),
  AwsWafRule: S.optional(AwsWafRuleDetails),
  AwsWafRuleGroup: S.optional(AwsWafRuleGroupDetails),
  AwsEcsTask: S.optional(AwsEcsTaskDetails),
  AwsBackupBackupVault: S.optional(AwsBackupBackupVaultDetails),
  AwsBackupBackupPlan: S.optional(AwsBackupBackupPlanDetails),
  AwsBackupRecoveryPoint: S.optional(AwsBackupRecoveryPointDetails),
  AwsEc2LaunchTemplate: S.optional(AwsEc2LaunchTemplateDetails),
  AwsSageMakerNotebookInstance: S.optional(AwsSageMakerNotebookInstanceDetails),
  AwsWafv2WebAcl: S.optional(AwsWafv2WebAclDetails),
  AwsWafv2RuleGroup: S.optional(AwsWafv2RuleGroupDetails),
  AwsEc2RouteTable: S.optional(AwsEc2RouteTableDetails),
  AwsAmazonMqBroker: S.optional(AwsAmazonMqBrokerDetails),
  AwsAppSyncGraphQlApi: S.optional(AwsAppSyncGraphQlApiDetails),
  AwsEventSchemasRegistry: S.optional(AwsEventSchemasRegistryDetails),
  AwsGuardDutyDetector: S.optional(AwsGuardDutyDetectorDetails),
  AwsStepFunctionStateMachine: S.optional(AwsStepFunctionStateMachineDetails),
  AwsAthenaWorkGroup: S.optional(AwsAthenaWorkGroupDetails),
  AwsEventsEventbus: S.optional(AwsEventsEventbusDetails),
  AwsDmsEndpoint: S.optional(AwsDmsEndpointDetails),
  AwsEventsEndpoint: S.optional(AwsEventsEndpointDetails),
  AwsDmsReplicationTask: S.optional(AwsDmsReplicationTaskDetails),
  AwsDmsReplicationInstance: S.optional(AwsDmsReplicationInstanceDetails),
  AwsRoute53HostedZone: S.optional(AwsRoute53HostedZoneDetails),
  AwsMskCluster: S.optional(AwsMskClusterDetails),
  AwsS3AccessPoint: S.optional(AwsS3AccessPointDetails),
  AwsEc2ClientVpnEndpoint: S.optional(AwsEc2ClientVpnEndpointDetails),
  CodeRepository: S.optional(CodeRepositoryDetails),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  Type: S.String,
  Id: S.String,
  Partition: S.optional(S.String),
  Region: S.optional(S.String),
  ResourceRole: S.optional(S.String),
  Tags: S.optional(FieldMap),
  DataClassification: S.optional(DataClassificationDetails),
  Details: S.optional(ResourceDetails),
  ApplicationName: S.optional(S.String),
  ApplicationArn: S.optional(S.String),
}) {}
export const ResourceList = S.Array(Resource);
export class StatusReason extends S.Class<StatusReason>("StatusReason")({
  ReasonCode: S.String,
  Description: S.optional(S.String),
}) {}
export const StatusReasonsList = S.Array(StatusReason);
export class AssociatedStandard extends S.Class<AssociatedStandard>(
  "AssociatedStandard",
)({ StandardsId: S.optional(S.String) }) {}
export const AssociatedStandardsList = S.Array(AssociatedStandard);
export class SecurityControlParameter extends S.Class<SecurityControlParameter>(
  "SecurityControlParameter",
)({ Name: S.optional(S.String), Value: S.optional(TypeList) }) {}
export const SecurityControlParametersList = S.Array(SecurityControlParameter);
export class Compliance extends S.Class<Compliance>("Compliance")({
  Status: S.optional(S.String),
  RelatedRequirements: S.optional(RelatedRequirementsList),
  StatusReasons: S.optional(StatusReasonsList),
  SecurityControlId: S.optional(S.String),
  AssociatedStandards: S.optional(AssociatedStandardsList),
  SecurityControlParameters: S.optional(SecurityControlParametersList),
}) {}
export class SoftwarePackage extends S.Class<SoftwarePackage>(
  "SoftwarePackage",
)({
  Name: S.optional(S.String),
  Version: S.optional(S.String),
  Epoch: S.optional(S.String),
  Release: S.optional(S.String),
  Architecture: S.optional(S.String),
  PackageManager: S.optional(S.String),
  FilePath: S.optional(S.String),
  FixedInVersion: S.optional(S.String),
  Remediation: S.optional(S.String),
  SourceLayerHash: S.optional(S.String),
  SourceLayerArn: S.optional(S.String),
}) {}
export const SoftwarePackageList = S.Array(SoftwarePackage);
export class Adjustment extends S.Class<Adjustment>("Adjustment")({
  Metric: S.optional(S.String),
  Reason: S.optional(S.String),
}) {}
export const AdjustmentList = S.Array(Adjustment);
export class Cvss extends S.Class<Cvss>("Cvss")({
  Version: S.optional(S.String),
  BaseScore: S.optional(S.Number),
  BaseVector: S.optional(S.String),
  Source: S.optional(S.String),
  Adjustments: S.optional(AdjustmentList),
}) {}
export const CvssList = S.Array(Cvss);
export class VulnerabilityVendor extends S.Class<VulnerabilityVendor>(
  "VulnerabilityVendor",
)({
  Name: S.String,
  Url: S.optional(S.String),
  VendorSeverity: S.optional(S.String),
  VendorCreatedAt: S.optional(S.String),
  VendorUpdatedAt: S.optional(S.String),
}) {}
export class CodeVulnerabilitiesFilePath extends S.Class<CodeVulnerabilitiesFilePath>(
  "CodeVulnerabilitiesFilePath",
)({
  EndLine: S.optional(S.Number),
  FileName: S.optional(S.String),
  FilePath: S.optional(S.String),
  StartLine: S.optional(S.Number),
}) {}
export class VulnerabilityCodeVulnerabilities extends S.Class<VulnerabilityCodeVulnerabilities>(
  "VulnerabilityCodeVulnerabilities",
)({
  Cwes: S.optional(TypeList),
  FilePath: S.optional(CodeVulnerabilitiesFilePath),
  SourceArn: S.optional(S.String),
}) {}
export const VulnerabilityCodeVulnerabilitiesList = S.Array(
  VulnerabilityCodeVulnerabilities,
);
export class Vulnerability extends S.Class<Vulnerability>("Vulnerability")({
  Id: S.String,
  VulnerablePackages: S.optional(SoftwarePackageList),
  Cvss: S.optional(CvssList),
  RelatedVulnerabilities: S.optional(StringList),
  Vendor: S.optional(VulnerabilityVendor),
  ReferenceUrls: S.optional(StringList),
  FixAvailable: S.optional(S.String),
  EpssScore: S.optional(S.Number),
  ExploitAvailable: S.optional(S.String),
  LastKnownExploitAt: S.optional(S.String),
  CodeVulnerabilities: S.optional(VulnerabilityCodeVulnerabilitiesList),
}) {}
export const VulnerabilityList = S.Array(Vulnerability);
export class IpOrganizationDetails extends S.Class<IpOrganizationDetails>(
  "IpOrganizationDetails",
)({
  Asn: S.optional(S.Number),
  AsnOrg: S.optional(S.String),
  Isp: S.optional(S.String),
  Org: S.optional(S.String),
}) {}
export class Country extends S.Class<Country>("Country")({
  CountryCode: S.optional(S.String),
  CountryName: S.optional(S.String),
}) {}
export class City extends S.Class<City>("City")({
  CityName: S.optional(S.String),
}) {}
export class GeoLocation extends S.Class<GeoLocation>("GeoLocation")({
  Lon: S.optional(S.Number),
  Lat: S.optional(S.Number),
}) {}
export class ActionRemoteIpDetails extends S.Class<ActionRemoteIpDetails>(
  "ActionRemoteIpDetails",
)({
  IpAddressV4: S.optional(S.String),
  Organization: S.optional(IpOrganizationDetails),
  Country: S.optional(Country),
  City: S.optional(City),
  GeoLocation: S.optional(GeoLocation),
}) {}
export class ActionRemotePortDetails extends S.Class<ActionRemotePortDetails>(
  "ActionRemotePortDetails",
)({ Port: S.optional(S.Number), PortName: S.optional(S.String) }) {}
export class ActionLocalPortDetails extends S.Class<ActionLocalPortDetails>(
  "ActionLocalPortDetails",
)({ Port: S.optional(S.Number), PortName: S.optional(S.String) }) {}
export class NetworkConnectionAction extends S.Class<NetworkConnectionAction>(
  "NetworkConnectionAction",
)({
  ConnectionDirection: S.optional(S.String),
  RemoteIpDetails: S.optional(ActionRemoteIpDetails),
  RemotePortDetails: S.optional(ActionRemotePortDetails),
  LocalPortDetails: S.optional(ActionLocalPortDetails),
  Protocol: S.optional(S.String),
  Blocked: S.optional(S.Boolean),
}) {}
export class AwsApiCallActionDomainDetails extends S.Class<AwsApiCallActionDomainDetails>(
  "AwsApiCallActionDomainDetails",
)({ Domain: S.optional(S.String) }) {}
export class AwsApiCallAction extends S.Class<AwsApiCallAction>(
  "AwsApiCallAction",
)({
  Api: S.optional(S.String),
  ServiceName: S.optional(S.String),
  CallerType: S.optional(S.String),
  RemoteIpDetails: S.optional(ActionRemoteIpDetails),
  DomainDetails: S.optional(AwsApiCallActionDomainDetails),
  AffectedResources: S.optional(FieldMap),
  FirstSeen: S.optional(S.String),
  LastSeen: S.optional(S.String),
}) {}
export class DnsRequestAction extends S.Class<DnsRequestAction>(
  "DnsRequestAction",
)({
  Domain: S.optional(S.String),
  Protocol: S.optional(S.String),
  Blocked: S.optional(S.Boolean),
}) {}
export class ActionLocalIpDetails extends S.Class<ActionLocalIpDetails>(
  "ActionLocalIpDetails",
)({ IpAddressV4: S.optional(S.String) }) {}
export class PortProbeDetail extends S.Class<PortProbeDetail>(
  "PortProbeDetail",
)({
  LocalPortDetails: S.optional(ActionLocalPortDetails),
  LocalIpDetails: S.optional(ActionLocalIpDetails),
  RemoteIpDetails: S.optional(ActionRemoteIpDetails),
}) {}
export const PortProbeDetailList = S.Array(PortProbeDetail);
export class PortProbeAction extends S.Class<PortProbeAction>(
  "PortProbeAction",
)({
  PortProbeDetails: S.optional(PortProbeDetailList),
  Blocked: S.optional(S.Boolean),
}) {}
export class Action extends S.Class<Action>("Action")({
  ActionType: S.optional(S.String),
  NetworkConnectionAction: S.optional(NetworkConnectionAction),
  AwsApiCallAction: S.optional(AwsApiCallAction),
  DnsRequestAction: S.optional(DnsRequestAction),
  PortProbeAction: S.optional(PortProbeAction),
}) {}
export class FindingProviderSeverity extends S.Class<FindingProviderSeverity>(
  "FindingProviderSeverity",
)({ Label: S.optional(S.String), Original: S.optional(S.String) }) {}
export class FindingProviderFields extends S.Class<FindingProviderFields>(
  "FindingProviderFields",
)({
  Confidence: S.optional(S.Number),
  Criticality: S.optional(S.Number),
  RelatedFindings: S.optional(RelatedFindingList),
  Severity: S.optional(FindingProviderSeverity),
  Types: S.optional(TypeList),
}) {}
export class UserAccount extends S.Class<UserAccount>("UserAccount")({
  Uid: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export class ActorUser extends S.Class<ActorUser>("ActorUser")({
  Name: S.optional(S.String),
  Uid: S.optional(S.String),
  Type: S.optional(S.String),
  CredentialUid: S.optional(S.String),
  Account: S.optional(UserAccount),
}) {}
export class ActorSession extends S.Class<ActorSession>("ActorSession")({
  Uid: S.optional(S.String),
  MfaStatus: S.optional(S.String),
  CreatedTime: S.optional(S.Number),
  Issuer: S.optional(S.String),
}) {}
export class Actor extends S.Class<Actor>("Actor")({
  Id: S.optional(S.String),
  User: S.optional(ActorUser),
  Session: S.optional(ActorSession),
}) {}
export const ActorsList = S.Array(Actor);
export class NetworkGeoLocation extends S.Class<NetworkGeoLocation>(
  "NetworkGeoLocation",
)({
  City: S.optional(S.String),
  Country: S.optional(S.String),
  Lat: S.optional(S.Number),
  Lon: S.optional(S.Number),
}) {}
export class NetworkAutonomousSystem extends S.Class<NetworkAutonomousSystem>(
  "NetworkAutonomousSystem",
)({ Name: S.optional(S.String), Number: S.optional(S.Number) }) {}
export class NetworkConnection extends S.Class<NetworkConnection>(
  "NetworkConnection",
)({ Direction: S.optional(S.String) }) {}
export class NetworkEndpoint extends S.Class<NetworkEndpoint>(
  "NetworkEndpoint",
)({
  Id: S.optional(S.String),
  Ip: S.optional(S.String),
  Domain: S.optional(S.String),
  Port: S.optional(S.Number),
  Location: S.optional(NetworkGeoLocation),
  AutonomousSystem: S.optional(NetworkAutonomousSystem),
  Connection: S.optional(NetworkConnection),
}) {}
export const NetworkEndpointsList = S.Array(NetworkEndpoint);
export class Indicator extends S.Class<Indicator>("Indicator")({
  Key: S.optional(S.String),
  Values: S.optional(NonEmptyStringList),
  Title: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const IndicatorsList = S.Array(Indicator);
export class Signal extends S.Class<Signal>("Signal")({
  Type: S.optional(S.String),
  Id: S.optional(S.String),
  Title: S.optional(S.String),
  ProductArn: S.optional(S.String),
  ResourceIds: S.optional(NonEmptyStringList),
  SignalIndicators: S.optional(IndicatorsList),
  Name: S.optional(S.String),
  CreatedAt: S.optional(S.Number),
  UpdatedAt: S.optional(S.Number),
  FirstSeenAt: S.optional(S.Number),
  LastSeenAt: S.optional(S.Number),
  Severity: S.optional(S.Number),
  Count: S.optional(S.Number),
  ActorIds: S.optional(NonEmptyStringList),
  EndpointIds: S.optional(NonEmptyStringList),
}) {}
export const SignalsList = S.Array(Signal);
export class Sequence extends S.Class<Sequence>("Sequence")({
  Uid: S.optional(S.String),
  Actors: S.optional(ActorsList),
  Endpoints: S.optional(NetworkEndpointsList),
  Signals: S.optional(SignalsList),
  SequenceIndicators: S.optional(IndicatorsList),
}) {}
export class Detection extends S.Class<Detection>("Detection")({
  Sequence: S.optional(Sequence),
}) {}
export class AwsSecurityFinding extends S.Class<AwsSecurityFinding>(
  "AwsSecurityFinding",
)({
  SchemaVersion: S.String,
  Id: S.String,
  ProductArn: S.String,
  ProductName: S.optional(S.String),
  CompanyName: S.optional(S.String),
  Region: S.optional(S.String),
  GeneratorId: S.String,
  AwsAccountId: S.String,
  Types: S.optional(TypeList),
  FirstObservedAt: S.optional(S.String),
  LastObservedAt: S.optional(S.String),
  CreatedAt: S.String,
  UpdatedAt: S.String,
  Severity: S.optional(Severity),
  Confidence: S.optional(S.Number),
  Criticality: S.optional(S.Number),
  Title: S.String,
  Description: S.String,
  Remediation: S.optional(Remediation),
  SourceUrl: S.optional(S.String),
  ProductFields: S.optional(FieldMap),
  UserDefinedFields: S.optional(FieldMap),
  Malware: S.optional(MalwareList),
  Network: S.optional(Network),
  NetworkPath: S.optional(NetworkPathList),
  Process: S.optional(ProcessDetails),
  Threats: S.optional(ThreatList),
  ThreatIntelIndicators: S.optional(ThreatIntelIndicatorList),
  Resources: ResourceList,
  Compliance: S.optional(Compliance),
  VerificationState: S.optional(S.String),
  WorkflowState: S.optional(S.String),
  Workflow: S.optional(Workflow),
  RecordState: S.optional(S.String),
  RelatedFindings: S.optional(RelatedFindingList),
  Note: S.optional(Note),
  Vulnerabilities: S.optional(VulnerabilityList),
  PatchSummary: S.optional(PatchSummary),
  Action: S.optional(Action),
  FindingProviderFields: S.optional(FindingProviderFields),
  Sample: S.optional(S.Boolean),
  GeneratorDetails: S.optional(GeneratorDetails),
  ProcessedAt: S.optional(S.String),
  AwsAccountName: S.optional(S.String),
  Detection: S.optional(Detection),
}) {}
export const AwsSecurityFindingList = S.Array(AwsSecurityFinding);
export class Insight extends S.Class<Insight>("Insight")({
  InsightArn: S.String,
  Name: S.String,
  Filters: AwsSecurityFindingFilters,
  GroupByAttribute: S.String,
}) {}
export const InsightList = S.Array(Insight);
export class AggregatorV2 extends S.Class<AggregatorV2>("AggregatorV2")({
  AggregatorV2Arn: S.optional(S.String),
}) {}
export const AggregatorV2List = S.Array(AggregatorV2);
export class AutomationRulesMetadata extends S.Class<AutomationRulesMetadata>(
  "AutomationRulesMetadata",
)({
  RuleArn: S.optional(S.String),
  RuleStatus: S.optional(S.String),
  RuleOrder: S.optional(S.Number),
  RuleName: S.optional(S.String),
  Description: S.optional(S.String),
  IsTerminal: S.optional(S.Boolean),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedBy: S.optional(S.String),
}) {}
export const AutomationRulesMetadataList = S.Array(AutomationRulesMetadata);
export class ConfigurationPolicySummary extends S.Class<ConfigurationPolicySummary>(
  "ConfigurationPolicySummary",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceEnabled: S.optional(S.Boolean),
}) {}
export const ConfigurationPolicySummaryList = S.Array(
  ConfigurationPolicySummary,
);
export class ConfigurationPolicyAssociationSummary extends S.Class<ConfigurationPolicyAssociationSummary>(
  "ConfigurationPolicyAssociationSummary",
)({
  ConfigurationPolicyId: S.optional(S.String),
  TargetId: S.optional(S.String),
  TargetType: S.optional(S.String),
  AssociationType: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AssociationStatus: S.optional(S.String),
  AssociationStatusMessage: S.optional(S.String),
}) {}
export const ConfigurationPolicyAssociationSummaryList = S.Array(
  ConfigurationPolicyAssociationSummary,
);
export class FindingAggregator extends S.Class<FindingAggregator>(
  "FindingAggregator",
)({ FindingAggregatorArn: S.optional(S.String) }) {}
export const FindingAggregatorList = S.Array(FindingAggregator);
export class AdminAccount extends S.Class<AdminAccount>("AdminAccount")({
  AccountId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const AdminAccounts = S.Array(AdminAccount);
export class StandardsControlAssociationSummary extends S.Class<StandardsControlAssociationSummary>(
  "StandardsControlAssociationSummary",
)({
  StandardsArn: S.String,
  SecurityControlId: S.String,
  SecurityControlArn: S.String,
  AssociationStatus: S.String,
  RelatedRequirements: S.optional(RelatedRequirementsList),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedReason: S.optional(S.String),
  StandardsControlTitle: S.optional(S.String),
  StandardsControlDescription: S.optional(S.String),
}) {}
export const StandardsControlAssociationSummaries = S.Array(
  StandardsControlAssociationSummary,
);
export const ProviderUpdateConfiguration = S.Union(
  S.Struct({ JiraCloud: JiraCloudUpdateConfiguration }),
  S.Struct({ ServiceNow: ServiceNowUpdateConfiguration }),
);
export class FindingsTrendsStringFilter extends S.Class<FindingsTrendsStringFilter>(
  "FindingsTrendsStringFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(StringFilter) }) {}
export const FindingsTrendsStringFilterList = S.Array(
  FindingsTrendsStringFilter,
);
export class OcsfStringFilter extends S.Class<OcsfStringFilter>(
  "OcsfStringFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(StringFilter) }) {}
export const OcsfStringFilterList = S.Array(OcsfStringFilter);
export class OcsfDateFilter extends S.Class<OcsfDateFilter>("OcsfDateFilter")({
  FieldName: S.optional(S.String),
  Filter: S.optional(DateFilter),
}) {}
export const OcsfDateFilterList = S.Array(OcsfDateFilter);
export class OcsfBooleanFilter extends S.Class<OcsfBooleanFilter>(
  "OcsfBooleanFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(BooleanFilter) }) {}
export const OcsfBooleanFilterList = S.Array(OcsfBooleanFilter);
export class OcsfNumberFilter extends S.Class<OcsfNumberFilter>(
  "OcsfNumberFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(NumberFilter) }) {}
export const OcsfNumberFilterList = S.Array(OcsfNumberFilter);
export class OcsfMapFilter extends S.Class<OcsfMapFilter>("OcsfMapFilter")({
  FieldName: S.optional(S.String),
  Filter: S.optional(MapFilter),
}) {}
export const OcsfMapFilterList = S.Array(OcsfMapFilter);
export class OcsfIpFilter extends S.Class<OcsfIpFilter>("OcsfIpFilter")({
  FieldName: S.optional(S.String),
  Filter: S.optional(IpFilter),
}) {}
export const OcsfIpFilterList = S.Array(OcsfIpFilter);
export class ResourcesTrendsStringFilter extends S.Class<ResourcesTrendsStringFilter>(
  "ResourcesTrendsStringFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(StringFilter) }) {}
export const ResourcesTrendsStringFilterList = S.Array(
  ResourcesTrendsStringFilter,
);
export class ResourcesStringFilter extends S.Class<ResourcesStringFilter>(
  "ResourcesStringFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(StringFilter) }) {}
export const ResourcesStringFilterList = S.Array(ResourcesStringFilter);
export class ResourcesDateFilter extends S.Class<ResourcesDateFilter>(
  "ResourcesDateFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(DateFilter) }) {}
export const ResourcesDateFilterList = S.Array(ResourcesDateFilter);
export class ResourcesNumberFilter extends S.Class<ResourcesNumberFilter>(
  "ResourcesNumberFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(NumberFilter) }) {}
export const ResourcesNumberFilterList = S.Array(ResourcesNumberFilter);
export class ResourcesMapFilter extends S.Class<ResourcesMapFilter>(
  "ResourcesMapFilter",
)({ FieldName: S.optional(S.String), Filter: S.optional(MapFilter) }) {}
export const ResourcesMapFilterList = S.Array(ResourcesMapFilter);
export class BatchDeleteAutomationRulesResponse extends S.Class<BatchDeleteAutomationRulesResponse>(
  "BatchDeleteAutomationRulesResponse",
)({
  ProcessedAutomationRules: S.optional(AutomationRulesArnsList),
  UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
}) {}
export class BatchEnableStandardsRequest extends S.Class<BatchEnableStandardsRequest>(
  "BatchEnableStandardsRequest",
)(
  { StandardsSubscriptionRequests: StandardsSubscriptionRequests },
  T.all(
    T.Http({ method: "POST", uri: "/standards/register" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAutomationRulesResponse extends S.Class<BatchGetAutomationRulesResponse>(
  "BatchGetAutomationRulesResponse",
)({
  Rules: S.optional(AutomationRulesConfigList),
  UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
}) {}
export class BatchGetSecurityControlsResponse extends S.Class<BatchGetSecurityControlsResponse>(
  "BatchGetSecurityControlsResponse",
)({
  SecurityControls: SecurityControls,
  UnprocessedIds: S.optional(UnprocessedSecurityControls),
}) {}
export class BatchUpdateAutomationRulesResponse extends S.Class<BatchUpdateAutomationRulesResponse>(
  "BatchUpdateAutomationRulesResponse",
)({
  ProcessedAutomationRules: S.optional(AutomationRulesArnsList),
  UnprocessedAutomationRules: S.optional(UnprocessedAutomationRulesList),
}) {}
export class CreateAggregatorV2Response extends S.Class<CreateAggregatorV2Response>(
  "CreateAggregatorV2Response",
)({
  AggregatorV2Arn: S.optional(S.String),
  AggregationRegion: S.optional(S.String),
  RegionLinkingMode: S.optional(S.String),
  LinkedRegions: S.optional(StringList),
}) {}
export class CreateAutomationRuleV2Request extends S.Class<CreateAutomationRuleV2Request>(
  "CreateAutomationRuleV2Request",
)(
  {
    RuleName: S.String,
    RuleStatus: S.optional(S.String),
    Description: S.String,
    RuleOrder: S.Number,
    Criteria: Criteria,
    Actions: AutomationRulesActionListV2,
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/automationrulesv2/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateConnectorV2Request extends S.Class<CreateConnectorV2Request>(
  "CreateConnectorV2Request",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Provider: ProviderConfiguration,
    KmsKeyArn: S.optional(S.String),
    Tags: S.optional(TagMap),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/connectorsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInsightRequest extends S.Class<CreateInsightRequest>(
  "CreateInsightRequest",
)(
  {
    Name: S.String,
    Filters: AwsSecurityFindingFilters,
    GroupByAttribute: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/insights" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMembersResponse extends S.Class<CreateMembersResponse>(
  "CreateMembersResponse",
)({ UnprocessedAccounts: S.optional(ResultList) }) {}
export class DeclineInvitationsResponse extends S.Class<DeclineInvitationsResponse>(
  "DeclineInvitationsResponse",
)({ UnprocessedAccounts: S.optional(ResultList) }) {}
export class DescribeActionTargetsResponse extends S.Class<DescribeActionTargetsResponse>(
  "DescribeActionTargetsResponse",
)({ ActionTargets: ActionTargetList, NextToken: S.optional(S.String) }) {}
export class DescribeProductsResponse extends S.Class<DescribeProductsResponse>(
  "DescribeProductsResponse",
)({ Products: ProductsList, NextToken: S.optional(S.String) }) {}
export class DescribeProductsV2Response extends S.Class<DescribeProductsV2Response>(
  "DescribeProductsV2Response",
)({ ProductsV2: ProductsV2List, NextToken: S.optional(S.String) }) {}
export class DescribeStandardsControlsResponse extends S.Class<DescribeStandardsControlsResponse>(
  "DescribeStandardsControlsResponse",
)({
  Controls: S.optional(StandardsControls),
  NextToken: S.optional(S.String),
}) {}
export class GetConfigurationPolicyAssociationResponse extends S.Class<GetConfigurationPolicyAssociationResponse>(
  "GetConfigurationPolicyAssociationResponse",
)({
  ConfigurationPolicyId: S.optional(S.String),
  TargetId: S.optional(S.String),
  TargetType: S.optional(S.String),
  AssociationType: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AssociationStatus: S.optional(S.String),
  AssociationStatusMessage: S.optional(S.String),
}) {}
export class GetFindingsResponse extends S.Class<GetFindingsResponse>(
  "GetFindingsResponse",
)({ Findings: AwsSecurityFindingList, NextToken: S.optional(S.String) }) {}
export class GetInsightsResponse extends S.Class<GetInsightsResponse>(
  "GetInsightsResponse",
)({ Insights: InsightList, NextToken: S.optional(S.String) }) {}
export class GetMembersResponse extends S.Class<GetMembersResponse>(
  "GetMembersResponse",
)({
  Members: S.optional(MemberList),
  UnprocessedAccounts: S.optional(ResultList),
}) {}
export class GroupByValue extends S.Class<GroupByValue>("GroupByValue")({
  FieldValue: S.optional(S.String),
  Count: S.optional(S.Number),
}) {}
export const GroupByValues = S.Array(GroupByValue);
export class GroupByResult extends S.Class<GroupByResult>("GroupByResult")({
  GroupByField: S.optional(S.String),
  GroupByValues: S.optional(GroupByValues),
}) {}
export const GroupByResults = S.Array(GroupByResult);
export class GetResourcesStatisticsV2Response extends S.Class<GetResourcesStatisticsV2Response>(
  "GetResourcesStatisticsV2Response",
)({ GroupByResults: GroupByResults }) {}
export class ListAggregatorsV2Response extends S.Class<ListAggregatorsV2Response>(
  "ListAggregatorsV2Response",
)({
  AggregatorsV2: S.optional(AggregatorV2List),
  NextToken: S.optional(S.String),
}) {}
export class ListAutomationRulesResponse extends S.Class<ListAutomationRulesResponse>(
  "ListAutomationRulesResponse",
)({
  AutomationRulesMetadata: S.optional(AutomationRulesMetadataList),
  NextToken: S.optional(S.String),
}) {}
export class ListConfigurationPoliciesResponse extends S.Class<ListConfigurationPoliciesResponse>(
  "ListConfigurationPoliciesResponse",
)({
  ConfigurationPolicySummaries: S.optional(ConfigurationPolicySummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListConfigurationPolicyAssociationsResponse extends S.Class<ListConfigurationPolicyAssociationsResponse>(
  "ListConfigurationPolicyAssociationsResponse",
)({
  ConfigurationPolicyAssociationSummaries: S.optional(
    ConfigurationPolicyAssociationSummaryList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListFindingAggregatorsResponse extends S.Class<ListFindingAggregatorsResponse>(
  "ListFindingAggregatorsResponse",
)({
  FindingAggregators: S.optional(FindingAggregatorList),
  NextToken: S.optional(S.String),
}) {}
export class ListOrganizationAdminAccountsResponse extends S.Class<ListOrganizationAdminAccountsResponse>(
  "ListOrganizationAdminAccountsResponse",
)({
  AdminAccounts: S.optional(AdminAccounts),
  NextToken: S.optional(S.String),
  Feature: S.optional(S.String),
}) {}
export class ListStandardsControlAssociationsResponse extends S.Class<ListStandardsControlAssociationsResponse>(
  "ListStandardsControlAssociationsResponse",
)({
  StandardsControlAssociationSummaries: StandardsControlAssociationSummaries,
  NextToken: S.optional(S.String),
}) {}
export class UpdateConnectorV2Request extends S.Class<UpdateConnectorV2Request>(
  "UpdateConnectorV2Request",
)(
  {
    ConnectorId: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    Provider: S.optional(ProviderUpdateConfiguration),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/connectorsv2/{ConnectorId+}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConnectorV2Response extends S.Class<UpdateConnectorV2Response>(
  "UpdateConnectorV2Response",
)({}) {}
export const StandardsControlArnList = S.Array(S.String);
export class StandardsManagedBy extends S.Class<StandardsManagedBy>(
  "StandardsManagedBy",
)({ Company: S.optional(S.String), Product: S.optional(S.String) }) {}
export class JiraCloudDetail extends S.Class<JiraCloudDetail>(
  "JiraCloudDetail",
)({
  CloudId: S.optional(S.String),
  ProjectKey: S.optional(S.String),
  Domain: S.optional(S.String),
  AuthUrl: S.optional(S.String),
  AuthStatus: S.optional(S.String),
}) {}
export class ServiceNowDetail extends S.Class<ServiceNowDetail>(
  "ServiceNowDetail",
)({
  InstanceName: S.optional(S.String),
  SecretArn: S.String,
  AuthStatus: S.String,
}) {}
export class FindingHistoryUpdateSource extends S.Class<FindingHistoryUpdateSource>(
  "FindingHistoryUpdateSource",
)({ Type: S.optional(S.String), Identity: S.optional(S.String) }) {}
export class FindingHistoryUpdate extends S.Class<FindingHistoryUpdate>(
  "FindingHistoryUpdate",
)({
  UpdatedField: S.optional(S.String),
  OldValue: S.optional(S.String),
  NewValue: S.optional(S.String),
}) {}
export const FindingHistoryUpdatesList = S.Array(FindingHistoryUpdate);
export class FindingsTrendsCompositeFilter extends S.Class<FindingsTrendsCompositeFilter>(
  "FindingsTrendsCompositeFilter",
)({
  StringFilters: S.optional(FindingsTrendsStringFilterList),
  NestedCompositeFilters: S.optional(
    S.suspend(() => FindingsTrendsCompositeFilterList),
  ),
  Operator: S.optional(S.String),
}) {}
export type FindingsTrendsCompositeFilterList = FindingsTrendsCompositeFilter[];
export const FindingsTrendsCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<FindingsTrendsCompositeFilter, any> =>
      FindingsTrendsCompositeFilter,
  ),
) as any as S.Schema<FindingsTrendsCompositeFilterList>;
export class CompositeFilter extends S.Class<CompositeFilter>(
  "CompositeFilter",
)({
  StringFilters: S.optional(OcsfStringFilterList),
  DateFilters: S.optional(OcsfDateFilterList),
  BooleanFilters: S.optional(OcsfBooleanFilterList),
  NumberFilters: S.optional(OcsfNumberFilterList),
  MapFilters: S.optional(OcsfMapFilterList),
  IpFilters: S.optional(OcsfIpFilterList),
  NestedCompositeFilters: S.optional(S.suspend(() => CompositeFilterList)),
  Operator: S.optional(S.String),
}) {}
export class InsightResultValue extends S.Class<InsightResultValue>(
  "InsightResultValue",
)({ GroupByAttributeValue: S.String, Count: S.Number }) {}
export const InsightResultValueList = S.Array(InsightResultValue);
export class ResourcesTrendsCompositeFilter extends S.Class<ResourcesTrendsCompositeFilter>(
  "ResourcesTrendsCompositeFilter",
)({
  StringFilters: S.optional(ResourcesTrendsStringFilterList),
  NestedCompositeFilters: S.optional(
    S.suspend(() => ResourcesTrendsCompositeFilterList),
  ),
  Operator: S.optional(S.String),
}) {}
export type ResourcesTrendsCompositeFilterList =
  ResourcesTrendsCompositeFilter[];
export const ResourcesTrendsCompositeFilterList = S.Array(
  S.suspend(
    (): S.Schema<ResourcesTrendsCompositeFilter, any> =>
      ResourcesTrendsCompositeFilter,
  ),
) as any as S.Schema<ResourcesTrendsCompositeFilterList>;
export class ResourcesCompositeFilter extends S.Class<ResourcesCompositeFilter>(
  "ResourcesCompositeFilter",
)({
  StringFilters: S.optional(ResourcesStringFilterList),
  DateFilters: S.optional(ResourcesDateFilterList),
  NumberFilters: S.optional(ResourcesNumberFilterList),
  MapFilters: S.optional(ResourcesMapFilterList),
  NestedCompositeFilters: S.optional(
    S.suspend(() => ResourcesCompositeFilterList),
  ),
  Operator: S.optional(S.String),
}) {}
export class AutomationRulesActionTypeObjectV2 extends S.Class<AutomationRulesActionTypeObjectV2>(
  "AutomationRulesActionTypeObjectV2",
)({ Type: S.optional(S.String) }) {}
export const AutomationRulesActionTypeListV2 = S.Array(
  AutomationRulesActionTypeObjectV2,
);
export class ProviderSummary extends S.Class<ProviderSummary>(
  "ProviderSummary",
)({
  ProviderName: S.optional(S.String),
  ConnectorStatus: S.optional(S.String),
}) {}
export const ConfigurationPolicyAssociationList = S.Array(
  ConfigurationPolicyAssociationSummary,
);
export class UnprocessedConfigurationPolicyAssociation extends S.Class<UnprocessedConfigurationPolicyAssociation>(
  "UnprocessedConfigurationPolicyAssociation",
)({
  ConfigurationPolicyAssociationIdentifiers: S.optional(
    ConfigurationPolicyAssociation,
  ),
  ErrorCode: S.optional(S.String),
  ErrorReason: S.optional(S.String),
}) {}
export const UnprocessedConfigurationPolicyAssociationList = S.Array(
  UnprocessedConfigurationPolicyAssociation,
);
export class StandardsControlAssociationDetail extends S.Class<StandardsControlAssociationDetail>(
  "StandardsControlAssociationDetail",
)({
  StandardsArn: S.String,
  SecurityControlId: S.String,
  SecurityControlArn: S.String,
  AssociationStatus: S.String,
  RelatedRequirements: S.optional(RelatedRequirementsList),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedReason: S.optional(S.String),
  StandardsControlTitle: S.optional(S.String),
  StandardsControlDescription: S.optional(S.String),
  StandardsControlArns: S.optional(StandardsControlArnList),
}) {}
export const StandardsControlAssociationDetails = S.Array(
  StandardsControlAssociationDetail,
);
export class UnprocessedStandardsControlAssociation extends S.Class<UnprocessedStandardsControlAssociation>(
  "UnprocessedStandardsControlAssociation",
)({
  StandardsControlAssociationId: StandardsControlAssociationId,
  ErrorCode: S.String,
  ErrorReason: S.optional(S.String),
}) {}
export const UnprocessedStandardsControlAssociations = S.Array(
  UnprocessedStandardsControlAssociation,
);
export class BatchUpdateFindingsUnprocessedFinding extends S.Class<BatchUpdateFindingsUnprocessedFinding>(
  "BatchUpdateFindingsUnprocessedFinding",
)({
  FindingIdentifier: AwsSecurityFindingIdentifier,
  ErrorCode: S.String,
  ErrorMessage: S.String,
}) {}
export const BatchUpdateFindingsUnprocessedFindingsList = S.Array(
  BatchUpdateFindingsUnprocessedFinding,
);
export class BatchUpdateFindingsV2ProcessedFinding extends S.Class<BatchUpdateFindingsV2ProcessedFinding>(
  "BatchUpdateFindingsV2ProcessedFinding",
)({
  FindingIdentifier: S.optional(OcsfFindingIdentifier),
  MetadataUid: S.optional(S.String),
}) {}
export const BatchUpdateFindingsV2ProcessedFindingsList = S.Array(
  BatchUpdateFindingsV2ProcessedFinding,
);
export class BatchUpdateFindingsV2UnprocessedFinding extends S.Class<BatchUpdateFindingsV2UnprocessedFinding>(
  "BatchUpdateFindingsV2UnprocessedFinding",
)({
  FindingIdentifier: S.optional(OcsfFindingIdentifier),
  MetadataUid: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const BatchUpdateFindingsV2UnprocessedFindingsList = S.Array(
  BatchUpdateFindingsV2UnprocessedFinding,
);
export class UnprocessedStandardsControlAssociationUpdate extends S.Class<UnprocessedStandardsControlAssociationUpdate>(
  "UnprocessedStandardsControlAssociationUpdate",
)({
  StandardsControlAssociationUpdate: StandardsControlAssociationUpdate,
  ErrorCode: S.String,
  ErrorReason: S.optional(S.String),
}) {}
export const UnprocessedStandardsControlAssociationUpdates = S.Array(
  UnprocessedStandardsControlAssociationUpdate,
);
export class Standard extends S.Class<Standard>("Standard")({
  StandardsArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EnabledByDefault: S.optional(S.Boolean),
  StandardsManagedBy: S.optional(StandardsManagedBy),
}) {}
export const Standards = S.Array(Standard);
export const ProviderDetail = S.Union(
  S.Struct({ JiraCloud: JiraCloudDetail }),
  S.Struct({ ServiceNow: ServiceNowDetail }),
);
export class FindingHistoryRecord extends S.Class<FindingHistoryRecord>(
  "FindingHistoryRecord",
)({
  FindingIdentifier: S.optional(AwsSecurityFindingIdentifier),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  FindingCreated: S.optional(S.Boolean),
  UpdateSource: S.optional(FindingHistoryUpdateSource),
  Updates: S.optional(FindingHistoryUpdatesList),
  NextToken: S.optional(S.String),
}) {}
export const FindingHistoryRecordList = S.Array(FindingHistoryRecord);
export class FindingsTrendsFilters extends S.Class<FindingsTrendsFilters>(
  "FindingsTrendsFilters",
)({
  CompositeFilters: S.optional(FindingsTrendsCompositeFilterList),
  CompositeOperator: S.optional(S.String),
}) {}
export class InsightResults extends S.Class<InsightResults>("InsightResults")({
  InsightArn: S.String,
  GroupByAttribute: S.String,
  ResultValues: InsightResultValueList,
}) {}
export class ResourcesTrendsFilters extends S.Class<ResourcesTrendsFilters>(
  "ResourcesTrendsFilters",
)({
  CompositeFilters: S.optional(ResourcesTrendsCompositeFilterList),
  CompositeOperator: S.optional(S.String),
}) {}
export class AutomationRulesMetadataV2 extends S.Class<AutomationRulesMetadataV2>(
  "AutomationRulesMetadataV2",
)({
  RuleArn: S.optional(S.String),
  RuleId: S.optional(S.String),
  RuleOrder: S.optional(S.Number),
  RuleName: S.optional(S.String),
  RuleStatus: S.optional(S.String),
  Description: S.optional(S.String),
  Actions: S.optional(AutomationRulesActionTypeListV2),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const AutomationRulesMetadataListV2 = S.Array(AutomationRulesMetadataV2);
export class ConnectorSummary extends S.Class<ConnectorSummary>(
  "ConnectorSummary",
)({
  ConnectorArn: S.optional(S.String),
  ConnectorId: S.String,
  Name: S.String,
  Description: S.optional(S.String),
  ProviderSummary: ProviderSummary,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ConnectorSummaryList = S.Array(ConnectorSummary);
export class BatchDisableStandardsResponse extends S.Class<BatchDisableStandardsResponse>(
  "BatchDisableStandardsResponse",
)({ StandardsSubscriptions: S.optional(StandardsSubscriptions) }) {}
export class BatchEnableStandardsResponse extends S.Class<BatchEnableStandardsResponse>(
  "BatchEnableStandardsResponse",
)({ StandardsSubscriptions: S.optional(StandardsSubscriptions) }) {}
export class BatchGetConfigurationPolicyAssociationsResponse extends S.Class<BatchGetConfigurationPolicyAssociationsResponse>(
  "BatchGetConfigurationPolicyAssociationsResponse",
)({
  ConfigurationPolicyAssociations: S.optional(
    ConfigurationPolicyAssociationList,
  ),
  UnprocessedConfigurationPolicyAssociations: S.optional(
    UnprocessedConfigurationPolicyAssociationList,
  ),
}) {}
export class BatchGetStandardsControlAssociationsResponse extends S.Class<BatchGetStandardsControlAssociationsResponse>(
  "BatchGetStandardsControlAssociationsResponse",
)({
  StandardsControlAssociationDetails: StandardsControlAssociationDetails,
  UnprocessedAssociations: S.optional(UnprocessedStandardsControlAssociations),
}) {}
export class BatchUpdateFindingsResponse extends S.Class<BatchUpdateFindingsResponse>(
  "BatchUpdateFindingsResponse",
)({
  ProcessedFindings: AwsSecurityFindingIdentifierList,
  UnprocessedFindings: BatchUpdateFindingsUnprocessedFindingsList,
}) {}
export class BatchUpdateFindingsV2Response extends S.Class<BatchUpdateFindingsV2Response>(
  "BatchUpdateFindingsV2Response",
)({
  ProcessedFindings: BatchUpdateFindingsV2ProcessedFindingsList,
  UnprocessedFindings: BatchUpdateFindingsV2UnprocessedFindingsList,
}) {}
export class BatchUpdateStandardsControlAssociationsResponse extends S.Class<BatchUpdateStandardsControlAssociationsResponse>(
  "BatchUpdateStandardsControlAssociationsResponse",
)({
  UnprocessedAssociationUpdates: S.optional(
    UnprocessedStandardsControlAssociationUpdates,
  ),
}) {}
export class CreateAutomationRuleRequest extends S.Class<CreateAutomationRuleRequest>(
  "CreateAutomationRuleRequest",
)(
  {
    Tags: S.optional(TagMap),
    RuleStatus: S.optional(S.String),
    RuleOrder: S.Number,
    RuleName: S.String,
    Description: S.String,
    IsTerminal: S.optional(S.Boolean),
    Criteria: AutomationRulesFindingFilters,
    Actions: ActionList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/automationrules/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAutomationRuleV2Response extends S.Class<CreateAutomationRuleV2Response>(
  "CreateAutomationRuleV2Response",
)({ RuleArn: S.optional(S.String), RuleId: S.optional(S.String) }) {}
export class CreateConnectorV2Response extends S.Class<CreateConnectorV2Response>(
  "CreateConnectorV2Response",
)({
  ConnectorArn: S.String,
  ConnectorId: S.String,
  AuthUrl: S.optional(S.String),
  ConnectorStatus: S.optional(S.String),
}) {}
export class CreateInsightResponse extends S.Class<CreateInsightResponse>(
  "CreateInsightResponse",
)({ InsightArn: S.String }) {}
export class DescribeStandardsResponse extends S.Class<DescribeStandardsResponse>(
  "DescribeStandardsResponse",
)({ Standards: S.optional(Standards), NextToken: S.optional(S.String) }) {}
export class GetConnectorV2Response extends S.Class<GetConnectorV2Response>(
  "GetConnectorV2Response",
)({
  ConnectorArn: S.optional(S.String),
  ConnectorId: S.String,
  Name: S.String,
  Description: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  Health: HealthCheck,
  ProviderDetail: ProviderDetail,
}) {}
export class GetFindingHistoryResponse extends S.Class<GetFindingHistoryResponse>(
  "GetFindingHistoryResponse",
)({
  Records: S.optional(FindingHistoryRecordList),
  NextToken: S.optional(S.String),
}) {}
export class GetFindingsTrendsV2Request extends S.Class<GetFindingsTrendsV2Request>(
  "GetFindingsTrendsV2Request",
)(
  {
    Filters: S.optional(FindingsTrendsFilters),
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingsTrendsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsV2Request extends S.Class<GetFindingsV2Request>(
  "GetFindingsV2Request",
)(
  {
    Filters: S.optional(OcsfFindingFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInsightResultsResponse extends S.Class<GetInsightResultsResponse>(
  "GetInsightResultsResponse",
)({ InsightResults: InsightResults }) {}
export class GetResourcesTrendsV2Request extends S.Class<GetResourcesTrendsV2Request>(
  "GetResourcesTrendsV2Request",
)(
  {
    Filters: S.optional(ResourcesTrendsFilters),
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourcesTrendsv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcesV2Request extends S.Class<GetResourcesV2Request>(
  "GetResourcesV2Request",
)(
  {
    Filters: S.optional(ResourcesFilters),
    SortCriteria: S.optional(SortCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resourcesv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomationRulesV2Response extends S.Class<ListAutomationRulesV2Response>(
  "ListAutomationRulesV2Response",
)({
  Rules: S.optional(AutomationRulesMetadataListV2),
  NextToken: S.optional(S.String),
}) {}
export class ListConnectorsV2Response extends S.Class<ListConnectorsV2Response>(
  "ListConnectorsV2Response",
)({ NextToken: S.optional(S.String), Connectors: ConnectorSummaryList }) {}
export class UpdateSecurityControlRequest extends S.Class<UpdateSecurityControlRequest>(
  "UpdateSecurityControlRequest",
)(
  {
    SecurityControlId: S.String,
    Parameters: Parameters,
    LastUpdateReason: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/securityControl/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSecurityControlResponse extends S.Class<UpdateSecurityControlResponse>(
  "UpdateSecurityControlResponse",
)({}) {}
export const OcsfFindingsList = S.Array(S.Any);
export class CreateAutomationRuleResponse extends S.Class<CreateAutomationRuleResponse>(
  "CreateAutomationRuleResponse",
)({ RuleArn: S.optional(S.String) }) {}
export class CreateConfigurationPolicyRequest extends S.Class<CreateConfigurationPolicyRequest>(
  "CreateConfigurationPolicyRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ConfigurationPolicy: Policy,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configurationPolicy/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingStatisticsV2Response extends S.Class<GetFindingStatisticsV2Response>(
  "GetFindingStatisticsV2Response",
)({ GroupByResults: S.optional(GroupByResults) }) {}
export class GetFindingsV2Response extends S.Class<GetFindingsV2Response>(
  "GetFindingsV2Response",
)({
  Findings: S.optional(OcsfFindingsList),
  NextToken: S.optional(S.String),
}) {}
export class CreateConfigurationPolicyResponse extends S.Class<CreateConfigurationPolicyResponse>(
  "CreateConfigurationPolicyResponse",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ConfigurationPolicy: S.optional(Policy),
}) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class SeverityTrendsCount extends S.Class<SeverityTrendsCount>(
  "SeverityTrendsCount",
)({
  Unknown: S.Number,
  Informational: S.Number,
  Low: S.Number,
  Medium: S.Number,
  High: S.Number,
  Critical: S.Number,
  Fatal: S.Number,
  Other: S.Number,
}) {}
export class ResourcesCount extends S.Class<ResourcesCount>("ResourcesCount")({
  AllResources: S.Number,
}) {}
export class ResourceSeverityBreakdown extends S.Class<ResourceSeverityBreakdown>(
  "ResourceSeverityBreakdown",
)({
  Other: S.optional(S.Number),
  Fatal: S.optional(S.Number),
  Critical: S.optional(S.Number),
  High: S.optional(S.Number),
  Medium: S.optional(S.Number),
  Low: S.optional(S.Number),
  Informational: S.optional(S.Number),
  Unknown: S.optional(S.Number),
}) {}
export class GetSecurityControlDefinitionResponse extends S.Class<GetSecurityControlDefinitionResponse>(
  "GetSecurityControlDefinitionResponse",
)({ SecurityControlDefinition: SecurityControlDefinition }) {}
export class TrendsValues extends S.Class<TrendsValues>("TrendsValues")({
  SeverityTrends: SeverityTrendsCount,
}) {}
export class ResourcesTrendsValues extends S.Class<ResourcesTrendsValues>(
  "ResourcesTrendsValues",
)({ ResourcesCount: ResourcesCount }) {}
export class ResourceFindingsSummary extends S.Class<ResourceFindingsSummary>(
  "ResourceFindingsSummary",
)({
  FindingType: S.String,
  ProductName: S.String,
  TotalFindings: S.Number,
  Severities: S.optional(ResourceSeverityBreakdown),
}) {}
export const ResourceFindingsSummaryList = S.Array(ResourceFindingsSummary);
export class TrendsMetricsResult extends S.Class<TrendsMetricsResult>(
  "TrendsMetricsResult",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  TrendsValues: TrendsValues,
}) {}
export const TrendsMetrics = S.Array(TrendsMetricsResult);
export class ResourcesTrendsMetricsResult extends S.Class<ResourcesTrendsMetricsResult>(
  "ResourcesTrendsMetricsResult",
)({
  Timestamp: S.Date.pipe(T.TimestampFormat("date-time")),
  TrendsValues: ResourcesTrendsValues,
}) {}
export const ResourcesTrendsMetrics = S.Array(ResourcesTrendsMetricsResult);
export class ResourceResult extends S.Class<ResourceResult>("ResourceResult")({
  ResourceGuid: S.optional(S.String),
  ResourceId: S.String,
  AccountId: S.String,
  Region: S.String,
  ResourceCategory: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceName: S.optional(S.String),
  ResourceCreationTimeDt: S.optional(S.String),
  ResourceDetailCaptureTimeDt: S.String,
  FindingsSummary: S.optional(ResourceFindingsSummaryList),
  ResourceTags: S.optional(ResourceTagList),
  ResourceConfig: S.Any,
}) {}
export const Resources = S.Array(ResourceResult);
export class GetFindingsTrendsV2Response extends S.Class<GetFindingsTrendsV2Response>(
  "GetFindingsTrendsV2Response",
)({
  Granularity: S.String,
  TrendsMetrics: TrendsMetrics,
  NextToken: S.optional(S.String),
}) {}
export class GetResourcesTrendsV2Response extends S.Class<GetResourcesTrendsV2Response>(
  "GetResourcesTrendsV2Response",
)({
  Granularity: S.String,
  TrendsMetrics: ResourcesTrendsMetrics,
  NextToken: S.optional(S.String),
}) {}
export class GetResourcesV2Response extends S.Class<GetResourcesV2Response>(
  "GetResourcesV2Response",
)({ Resources: Resources, NextToken: S.optional(S.String) }) {}
export const BatchImportFindingsRequestFindingList =
  S.Array(AwsSecurityFinding);
export class BatchImportFindingsRequest extends S.Class<BatchImportFindingsRequest>(
  "BatchImportFindingsRequest",
)(
  { Findings: BatchImportFindingsRequestFindingList },
  T.all(
    T.Http({ method: "POST", uri: "/findings/import" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportFindingsError extends S.Class<ImportFindingsError>(
  "ImportFindingsError",
)({ Id: S.String, ErrorCode: S.String, ErrorMessage: S.String }) {}
export const ImportFindingsErrorList = S.Array(ImportFindingsError);
export class BatchImportFindingsResponse extends S.Class<BatchImportFindingsResponse>(
  "BatchImportFindingsResponse",
)({
  FailedCount: S.Number,
  SuccessCount: S.Number,
  FailedFindings: S.optional(ImportFindingsErrorList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  {},
) {}
export class InvalidAccessException extends S.TaggedError<InvalidAccessException>()(
  "InvalidAccessException",
  {},
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}

//# Operations
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Deletes a finding aggregator. When you delete the finding aggregator, you stop cross-Region aggregation. Finding replication stops
 * occurring from the linked Regions to the home Region.
 *
 * When you stop cross-Region aggregation, findings that were already replicated and sent to the home Region are still visible from
 * the home Region. However, new findings and finding updates are no longer replicated and sent to the home Region.
 */
export const deleteFindingAggregator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFindingAggregatorRequest,
    output: DeleteFindingAggregatorResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disables the integration of the specified product with Security Hub. After the integration is
 * disabled, findings from that product are no longer sent to Security Hub.
 */
export const disableImportFindingsForProduct =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableImportFindingsForProductRequest,
    output: DisableImportFindingsForProductResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Disables a Security Hub administrator account. Can only be called by the organization
 * management account.
 */
export const disableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOrganizationAdminAccountRequest,
    output: DisableOrganizationAdminAccountResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Disables Security Hub in your account only in the current Amazon Web Services Region. To disable Security Hub in all
 * Regions, you must submit one request per Region where you have enabled Security Hub.
 *
 * You can't disable Security Hub in an account that is currently the Security Hub administrator.
 *
 * When you disable Security Hub, your existing findings and insights and any Security Hub configuration
 * settings are deleted after 90 days and cannot be recovered. Any standards that were enabled
 * are disabled, and your administrator and member account associations are removed.
 *
 * If you want to save your existing findings, you must export them before you disable
 * Security Hub.
 */
export const disableSecurityHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSecurityHubRequest,
  output: DisableSecurityHubResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disable the service for the current Amazon Web Services Region or specified Amazon Web Services Region.
 */
export const disableSecurityHubV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableSecurityHubV2Request,
    output: DisableSecurityHubV2Response,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Disassociates the current Security Hub member account from the associated administrator
 * account.
 *
 * This operation is only used by accounts that are not part of an organization. For
 * organization accounts, only the administrator account can
 * disassociate a member account.
 */
export const disassociateFromAdministratorAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromAdministratorAccountRequest,
    output: DisassociateFromAdministratorAccountResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * This method is deprecated. Instead, use `DisassociateFromAdministratorAccount`.
 *
 * The Security Hub console continues to use `DisassociateFromMasterAccount`. It will eventually change to use `DisassociateFromAdministratorAccount`. Any IAM policies that specifically control access to this function must continue to use `DisassociateFromMasterAccount`. You should also add `DisassociateFromAdministratorAccount` to your policies to ensure that the correct permissions are in place after the console begins to use `DisassociateFromAdministratorAccount`.
 *
 * Disassociates the current Security Hub member account from the associated administrator
 * account.
 *
 * This operation is only used by accounts that are not part of an organization. For
 * organization accounts, only the administrator account can
 * disassociate a member account.
 */
export const disassociateFromMasterAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromMasterAccountRequest,
    output: DisassociateFromMasterAccountResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Disassociates the specified member accounts from the associated administrator account.
 *
 * Can be used to disassociate both accounts that are managed using Organizations and accounts that
 * were invited manually.
 */
export const disassociateMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMembersRequest,
  output: DisassociateMembersResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables Security Hub for your account in the current Region or the Region you specify in the
 * request.
 *
 * When you enable Security Hub, you grant to Security Hub the permissions necessary to gather findings
 * from other services that are integrated with Security Hub.
 *
 * When you use the `EnableSecurityHub` operation to enable Security Hub, you also
 * automatically enable the following standards:
 *
 * - Center for Internet Security (CIS) Amazon Web Services Foundations Benchmark v1.2.0
 *
 * - Amazon Web Services Foundational Security Best Practices
 *
 * Other standards are not automatically enabled.
 *
 * To opt out of automatically enabled standards, set
 * `EnableDefaultStandards` to `false`.
 *
 * After you enable Security Hub, to enable a standard, use the `BatchEnableStandards` operation. To disable a standard, use the
 * `BatchDisableStandards` operation.
 *
 * To learn more, see the setup information in the *Security Hub User Guide*.
 */
export const enableSecurityHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSecurityHubRequest,
  output: EnableSecurityHubResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Returns the count of all Security Hub membership invitations that were sent to the
 * calling member account, not including the currently accepted invitation.
 */
export const getInvitationsCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * This method is deprecated. Instead, use `GetAdministratorAccount`.
 *
 * The Security Hub console continues to use `GetMasterAccount`. It will eventually change to use `GetAdministratorAccount`. Any IAM policies that specifically control access to this function must continue to use `GetMasterAccount`. You should also add `GetAdministratorAccount` to your policies to ensure that the correct permissions are in place after the console begins to use `GetAdministratorAccount`.
 *
 * Provides the details for the Security Hub administrator account for the current member account.
 *
 * Can be used by both member accounts that are managed using Organizations and accounts that were
 * invited manually.
 */
export const getMasterAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disassociates a target account, organizational unit, or the root from a specified configuration. When you
 * disassociate a configuration from its target, the target inherits the configuration of the closest parent. If there’s no
 * configuration to inherit, the target retains its settings but becomes a self-managed account. A target can be disassociated from
 * a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can invoke this
 * operation from the home Region.
 */
export const startConfigurationPolicyDisassociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartConfigurationPolicyDisassociationRequest,
    output: StartConfigurationPolicyDisassociationResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Adds one or more tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * Removes one or more tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * Updates the name and description of a custom action target in Security Hub.
 */
export const updateActionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActionTargetRequest,
  output: UpdateActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a V2 automation rule.
 */
export const updateAutomationRuleV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAutomationRuleV2Request,
    output: UpdateAutomationRuleV2Response,
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
 * `UpdateFindings` is a deprecated operation. Instead of `UpdateFindings`, use
 * the `BatchUpdateFindings` operation.
 *
 * The `UpdateFindings` operation updates the `Note` and `RecordState` of the Security Hub aggregated
 * findings that the filter attributes specify. Any member account that can view the finding
 * can also see the update to the finding.
 *
 * Finding updates made with `UpdateFindings` aren't persisted if the same finding is later updated by the
 * finding provider through the `BatchImportFindings` operation. In addition, Security Hub doesn't
 * record updates made with `UpdateFindings` in the finding history.
 */
export const updateFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingsRequest,
  output: UpdateFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the Security Hub insight identified by the specified insight ARN.
 */
export const updateInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInsightRequest,
  output: UpdateInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the configuration of your organization in Security Hub. Only the
 * Security Hub administrator account can invoke this operation.
 */
export const updateOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrganizationConfigurationRequest,
    output: UpdateOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceConflictException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Updates configuration options for Security Hub.
 */
export const updateSecurityHubConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSecurityHubConfigurationRequest,
    output: UpdateSecurityHubConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Used to control whether an individual security standard control is enabled or
 * disabled.
 *
 * Calls to this operation return a `RESOURCE_NOT_FOUND_EXCEPTION` error when the standard subscription for the control has `StandardsControlsUpdatable` value `NOT_READY_FOR_UPDATES`.
 */
export const updateStandardsControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStandardsControlRequest,
    output: UpdateStandardsControlResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Accepts the invitation to be a member account and be monitored by the Security Hub administrator
 * account that the invitation was sent from.
 *
 * This operation is only used by member accounts that are not added through
 * Organizations.
 *
 * When the member account accepts the invitation, permission is granted to the administrator
 * account to view findings generated in the member account.
 */
export const acceptAdministratorInvitation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptAdministratorInvitationRequest,
    output: AcceptAdministratorInvitationResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * This method is deprecated. Instead, use `AcceptAdministratorInvitation`.
 *
 * The Security Hub console continues to use `AcceptInvitation`. It will eventually change to use `AcceptAdministratorInvitation`. Any IAM policies that specifically control access to this function must continue to use `AcceptInvitation`. You should also add `AcceptAdministratorInvitation` to your policies to ensure that the correct permissions are in place after the console begins to use `AcceptAdministratorInvitation`.
 *
 * Accepts the invitation to be a member account and be monitored by the Security Hub administrator
 * account that the invitation was sent from.
 *
 * This operation is only used by member accounts that are not added through
 * Organizations.
 *
 * When the member account accepts the invitation, permission is granted to the administrator
 * account to view findings generated in the member account.
 */
export const acceptInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a custom action target in Security Hub.
 *
 * You can use custom actions on findings and insights in Security Hub to trigger target actions
 * in Amazon CloudWatch Events.
 */
export const createActionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActionTargetRequest,
  output: CreateActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Used to enable cross-Region aggregation. This operation can be invoked from the home Region only.
 *
 * For information about how cross-Region aggregation works, see Understanding cross-Region aggregation in Security Hub in the *Security Hub User Guide*.
 */
export const createFindingAggregator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFindingAggregatorRequest,
    output: CreateFindingAggregatorResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Grants permission to create a ticket in the chosen ITSM based on finding information for the provided finding metadata UID.
 */
export const createTicketV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTicketV2Request,
  output: CreateTicketV2Response,
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
 * Deletes a custom action target from Security Hub.
 *
 * Deleting a custom action target does not affect any findings or insights that were
 * already sent to Amazon CloudWatch Events using the custom action.
 */
export const deleteActionTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActionTargetRequest,
  output: DeleteActionTargetResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the Aggregator V2.
 */
export const deleteAggregatorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAggregatorV2Request,
  output: DeleteAggregatorV2Response,
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
 * Deletes a V2 automation rule.
 */
export const deleteAutomationRuleV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAutomationRuleV2Request,
    output: DeleteAutomationRuleV2Response,
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
 * Deletes a configuration policy. Only the Security Hub delegated administrator can invoke this operation
 * from the home Region. For the deletion to succeed, you must first disassociate a configuration policy from target accounts,
 * organizational units, or the root by invoking the `StartConfigurationPolicyDisassociation` operation.
 */
export const deleteConfigurationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationPolicyRequest,
    output: DeleteConfigurationPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceConflictException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Grants permission to delete a connectorV2.
 */
export const deleteConnectorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorV2Request,
  output: DeleteConnectorV2Response,
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
 * Deletes the insight specified by the `InsightArn`.
 */
export const deleteInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInsightRequest,
  output: DeleteInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Deletes invitations to become a Security Hub member account.
 *
 * A Security Hub administrator account can use this operation to delete invitations sent to one or more prospective member accounts.
 *
 * This operation is only used to delete invitations that are sent to prospective member accounts that aren't part of an Amazon Web Services organization.
 * Organization accounts don't receive invitations.
 */
export const deleteInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified member accounts from Security Hub.
 *
 * You can invoke this API only to delete accounts that became members through invitation. You can't invoke this
 * API to delete accounts that belong to an Organizations organization.
 */
export const deleteMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMembersRequest,
  output: DeleteMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns details about the Hub resource in your account, including the
 * `HubArn` and the time when you enabled Security Hub.
 */
export const describeHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHubRequest,
  output: DescribeHubResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the way your organization is configured in Security Hub. Only the
 * Security Hub administrator account can invoke this operation.
 */
export const describeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConfigurationRequest,
    output: DescribeOrganizationConfigurationResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Returns details about the service resource in your account.
 */
export const describeSecurityHubV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSecurityHubV2Request,
    output: DescribeSecurityHubV2Response,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables the integration of a partner product with Security Hub. Integrated products send
 * findings to Security Hub.
 *
 * When you enable a product integration, a permissions policy that grants permission for
 * the product to send findings to Security Hub is applied.
 */
export const enableImportFindingsForProduct =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableImportFindingsForProductRequest,
    output: EnableImportFindingsForProductResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceConflictException,
    ],
  }));
/**
 * Designates the Security Hub administrator account for an organization. Can only be called by
 * the organization management account.
 */
export const enableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOrganizationAdminAccountRequest,
    output: EnableOrganizationAdminAccountResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Enables the service in account for the current Amazon Web Services Region or specified Amazon Web Services Region.
 */
export const enableSecurityHubV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSecurityHubV2Request,
  output: EnableSecurityHubV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the details for the Security Hub administrator account for the current member account.
 *
 * Can be used by both member accounts that are managed using Organizations and accounts that were
 * invited manually.
 */
export const getAdministratorAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAdministratorAccountRequest,
    output: GetAdministratorAccountResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns the configuration of the specified Aggregator V2.
 */
export const getAggregatorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAggregatorV2Request,
  output: GetAggregatorV2Response,
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
 * Returns an automation rule for the V2 service.
 */
export const getAutomationRuleV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomationRuleV2Request,
  output: GetAutomationRuleV2Response,
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
 * Provides information about a configuration policy. Only the Security Hub delegated administrator can invoke
 * this operation from the home Region.
 */
export const getConfigurationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetConfigurationPolicyRequest,
    output: GetConfigurationPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a list of the standards that are currently enabled.
 */
export const getEnabledStandards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnabledStandardsRequest,
  output: GetEnabledStandardsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Returns the current configuration in the calling account for cross-Region aggregation. A finding aggregator is a resource that establishes
 * the home Region and any linked Regions.
 */
export const getFindingAggregator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingAggregatorRequest,
    output: GetFindingAggregatorResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Invites other Amazon Web Services accounts to become member accounts for the Security Hub administrator account that
 * the invitation is sent from.
 *
 * This operation is only used to invite accounts that don't belong to an Amazon Web Services organization.
 * Organization accounts don't receive invitations.
 *
 * Before you can use this action to invite a member, you must first use the `CreateMembers` action to create the member account in Security Hub.
 *
 * When the account owner enables Security Hub and accepts the invitation to become a member
 * account, the administrator account can view the findings generated in the member account.
 */
export const inviteMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteMembersRequest,
  output: InviteMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists all findings-generating solutions (products) that you are subscribed to receive
 * findings from in Security Hub.
 */
export const listEnabledProductsForImport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEnabledProductsForImportRequest,
    output: ListEnabledProductsForImportResponse,
    errors: [InternalException, InvalidAccessException, LimitExceededException],
  }));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Lists all Security Hub membership invitations that were sent to the calling account.
 *
 * Only accounts that are managed by invitation can use this operation.
 * Accounts that are managed using the integration with Organizations don't receive invitations.
 */
export const listInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInvitationsRequest,
  output: ListInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists details about all member accounts for the current Security Hub administrator
 * account.
 *
 * The results include both member accounts that belong to an organization and member
 * accounts that were invited manually.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists all of the security controls that apply to a specified standard.
 */
export const listSecurityControlDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSecurityControlDefinitionsRequest,
    output: ListSecurityControlDefinitionsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Returns a list of tags associated with a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, InvalidInputException, ResourceNotFoundException],
}));
/**
 * Grants permission to complete the authorization based on input parameters.
 */
export const registerConnectorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterConnectorV2Request,
  output: RegisterConnectorV2Response,
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
 * Associates a target account, organizational unit, or the root with a specified configuration. The target can be
 * associated with a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can
 * invoke this operation from the home Region.
 */
export const startConfigurationPolicyAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartConfigurationPolicyAssociationRequest,
    output: StartConfigurationPolicyAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Udpates the configuration for the Aggregator V2.
 */
export const updateAggregatorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAggregatorV2Request,
  output: UpdateAggregatorV2Response,
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
 * Updates a configuration policy. Only the Security Hub delegated
 * administrator can invoke this operation from the home Region.
 */
export const updateConfigurationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConfigurationPolicyRequest,
    output: UpdateConfigurationPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceConflictException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * The *aggregation Region* is now called the *home Region*.
 *
 * Updates cross-Region aggregation settings. You can use this operation to update the Region linking mode and the list
 * of included or excluded Amazon Web Services Regions. However, you can't use this operation to change the home Region.
 *
 * You can invoke this operation from the current home Region only.
 */
export const updateFindingAggregator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFindingAggregatorRequest,
    output: UpdateFindingAggregatorResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes one or more automation rules.
 */
export const batchDeleteAutomationRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteAutomationRulesRequest,
    output: BatchDeleteAutomationRulesResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves a list of details for automation rules based on rule Amazon Resource Names
 * (ARNs).
 */
export const batchGetAutomationRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetAutomationRulesRequest,
    output: BatchGetAutomationRulesResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Provides details about a batch of security controls for the current Amazon Web Services account and Amazon Web Services Region.
 */
export const batchGetSecurityControls = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetSecurityControlsRequest,
    output: BatchGetSecurityControlsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Updates one or more automation rules based on rule Amazon Resource Names (ARNs)
 * and input parameters.
 */
export const batchUpdateAutomationRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateAutomationRulesRequest,
    output: BatchUpdateAutomationRulesResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a member association in Security Hub between the specified accounts and the account
 * used to make the request, which is the administrator account. If you are integrated with
 * Organizations, then the administrator account is designated by the organization management account.
 *
 * `CreateMembers` is always used to add accounts that are not organization
 * members.
 *
 * For accounts that are managed using Organizations, `CreateMembers` is only used
 * in the following cases:
 *
 * - Security Hub is not configured to automatically add new organization accounts.
 *
 * - The account was disassociated or deleted in Security Hub.
 *
 * This action can only be used by an account that has Security Hub enabled. To enable Security Hub, you
 * can use the `EnableSecurityHub` operation.
 *
 * For accounts that are not organization members, you create the account association and
 * then send an invitation to the member account. To send the invitation, you use the
 * `InviteMembers` operation. If the account owner accepts
 * the invitation, the account becomes a member account in Security Hub.
 *
 * Accounts that are managed using Organizations don't receive an invitation. They
 * automatically become a member account in Security Hub.
 *
 * - If the organization account does not have Security Hub enabled, then Security Hub and the default standards are automatically enabled. Note that Security Hub cannot be enabled automatically for the organization management account. The organization management account must enable Security Hub before the administrator account enables it as a member account.
 *
 * - For organization accounts that already have Security Hub enabled, Security Hub does not make any other changes to those accounts. It does not change their enabled standards or controls.
 *
 * A permissions policy is added that permits the administrator account to view the findings
 * generated in the member account.
 *
 * To remove the association between the administrator and member accounts, use the `DisassociateFromMasterAccount` or `DisassociateMembers` operation.
 */
export const createMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMembersRequest,
  output: CreateMembersResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * We recommend using Organizations instead of Security Hub invitations to manage your member accounts.
 * For information, see Managing Security Hub administrator and member accounts with Organizations
 * in the *Security Hub User Guide*.
 *
 * Declines invitations to become a Security Hub member account.
 *
 * A prospective member account uses this operation to decline an invitation to become a member.
 *
 * Only member accounts that aren't part of an Amazon Web Services organization should use this operation.
 * Organization accounts don't receive invitations.
 */
export const declineInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of the custom action targets in Security Hub in your account.
 */
export const describeActionTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeActionTargetsRequest,
    output: DescribeActionTargetsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns information about product integrations in Security Hub.
 *
 * You can optionally provide an integration ARN. If you provide an integration ARN, then
 * the results only include that integration.
 *
 * If you don't provide an integration ARN, then the results include all of the available
 * product integrations.
 */
export const describeProducts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductsRequest,
  output: DescribeProductsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Gets information about the product integration.
 */
export const describeProductsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProductsV2Request,
  output: DescribeProductsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of security standards controls.
 *
 * For each control, the results include information about whether it is currently enabled,
 * the severity, and a link to remediation information.
 *
 * This operation returns an empty list for standard subscriptions where `StandardsControlsUpdatable` has value `NOT_READY_FOR_UPDATES`.
 */
export const describeStandardsControls = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStandardsControlsRequest,
    output: DescribeStandardsControlsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns the association between a configuration and a target account, organizational unit, or the root. The
 * configuration can be a configuration policy or self-managed behavior. Only the Security Hub delegated administrator can
 * invoke this operation from the home Region.
 */
export const getConfigurationPolicyAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConfigurationPolicyAssociationRequest,
    output: GetConfigurationPolicyAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns a list of findings that match the specified criteria.
 *
 * If cross-Region aggregation is enabled, then when you call `GetFindings` from the home Region, the results include all of the matching findings from both the home Region and linked Regions.
 */
export const getFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsRequest,
  output: GetFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists and describes insights for the specified insight ARNs.
 */
export const getInsights = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightsRequest,
  output: GetInsightsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the details for the Security Hub member accounts for the specified account IDs.
 *
 * An administrator account can be either the delegated Security Hub administrator account for an
 * organization or an administrator account that enabled Security Hub manually.
 *
 * The results include both member accounts that are managed using Organizations and accounts that
 * were invited manually.
 */
export const getMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMembersRequest,
  output: GetMembersResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves statistical information about Amazon Web Services resources and their associated security findings.
 */
export const getResourcesStatisticsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourcesStatisticsV2Request,
    output: GetResourcesStatisticsV2Response,
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
 * Retrieves a list of V2 aggregators.
 */
export const listAggregatorsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAggregatorsV2Request,
  output: ListAggregatorsV2Response,
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
 * A list of automation rules and their metadata for the calling account.
 */
export const listAutomationRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAutomationRulesRequest,
  output: ListAutomationRulesResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists the configuration policies that the Security Hub delegated administrator has created for your
 * organization. Only the delegated administrator can invoke this operation from the home Region.
 */
export const listConfigurationPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationPoliciesRequest,
    output: ListConfigurationPoliciesResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Provides information about the associations for your configuration policies and self-managed behavior. Only the
 * Security Hub delegated administrator can invoke this operation from the home Region.
 */
export const listConfigurationPolicyAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConfigurationPolicyAssociationsRequest,
    output: ListConfigurationPolicyAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * If cross-Region aggregation is enabled, then `ListFindingAggregators` returns the Amazon Resource Name (ARN)
 * of the finding aggregator. You can run this operation from any Amazon Web Services Region.
 */
export const listFindingAggregators = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFindingAggregatorsRequest,
    output: ListFindingAggregatorsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Lists the Security Hub administrator accounts. Can only be called by the organization
 * management account.
 */
export const listOrganizationAdminAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListOrganizationAdminAccountsRequest,
    output: ListOrganizationAdminAccountsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Specifies whether a control is currently enabled or disabled in each enabled standard in the calling account.
 *
 * This operation omits standards control associations for standard subscriptions where `StandardsControlsUpdatable` has value `NOT_READY_FOR_UPDATES`.
 */
export const listStandardsControlAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListStandardsControlAssociationsRequest,
    output: ListStandardsControlAssociationsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Grants permission to update a connectorV2 based on its id and input parameters.
 */
export const updateConnectorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorV2Request,
  output: UpdateConnectorV2Response,
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
 * Disables the standards specified by the provided
 * `StandardsSubscriptionArns`.
 *
 * For more information, see Security Standards section of the Security Hub User
 * Guide.
 */
export const batchDisableStandards = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDisableStandardsRequest,
    output: BatchDisableStandardsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Enables the standards specified by the provided `StandardsArn`. To obtain the
 * ARN for a standard, use the `DescribeStandards`
 * operation.
 *
 * For more information, see the Security Standards
 * section of the *Security Hub User Guide*.
 */
export const batchEnableStandards = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchEnableStandardsRequest,
    output: BatchEnableStandardsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Returns associations between an Security Hub configuration and a batch of target accounts, organizational units, or the root.
 * Only the Security Hub delegated administrator can invoke this operation from the home Region. A configuration
 * can refer to a configuration policy or to a self-managed configuration.
 */
export const batchGetConfigurationPolicyAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetConfigurationPolicyAssociationsRequest,
    output: BatchGetConfigurationPolicyAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * For a batch of security controls and standards, identifies whether each control is currently enabled or disabled in a standard.
 *
 * Calls to this operation return a `RESOURCE_NOT_FOUND_EXCEPTION` error when the standard subscription for the association has a `NOT_READY_FOR_UPDATES` value for `StandardsControlsUpdatable`.
 */
export const batchGetStandardsControlAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetStandardsControlAssociationsRequest,
    output: BatchGetStandardsControlAssociationsResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Used by Security Hub customers to update information about their investigation into one or more findings.
 * Requested by administrator accounts or member accounts.
 * Administrator accounts can update findings for their account and their member accounts.
 * A member account can update findings only for their own account.
 * Administrator and member accounts can use this operation to update the following fields and objects for one or more findings:
 *
 * - `Confidence`
 *
 * - `Criticality`
 *
 * - `Note`
 *
 * - `RelatedFindings`
 *
 * - `Severity`
 *
 * - `Types`
 *
 * - `UserDefinedFields`
 *
 * - `VerificationState`
 *
 * - `Workflow`
 *
 * If you use this operation to update a finding, your updates don’t affect the value for the `UpdatedAt` field of the finding.
 * Also note that it can take several minutes for Security Hub to process your request and update each finding specified in the request.
 *
 * You can configure IAM policies to restrict access to fields and field values.
 * For example, you might not want member accounts to be able to suppress findings or change the finding severity.
 * For more information see Configuring access to BatchUpdateFindings in the *Security Hub User Guide*.
 */
export const batchUpdateFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateFindingsRequest,
  output: BatchUpdateFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Used by customers to update information about their investigation into a finding.
 * Requested by delegated administrator accounts or member accounts.
 * Delegated administrator accounts can update findings for their account and their member accounts.
 * Member accounts can update findings for their account. `BatchUpdateFindings` and `BatchUpdateFindingV2` both use `securityhub:BatchUpdateFindings` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `securityhub:BatchUpdateFindings` action.
 * Updates from `BatchUpdateFindingsV2` don't affect the value of f`inding_info.modified_time`, `finding_info.modified_time_dt`, `time`, `time_dt for a finding`.
 */
export const batchUpdateFindingsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateFindingsV2Request,
    output: BatchUpdateFindingsV2Response,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * For a batch of security controls and standards, this operation updates the enablement status of a control in a standard.
 */
export const batchUpdateStandardsControlAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateStandardsControlAssociationsRequest,
    output: BatchUpdateStandardsControlAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }));
/**
 * Enables aggregation across Amazon Web Services Regions.
 */
export const createAggregatorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAggregatorV2Request,
  output: CreateAggregatorV2Response,
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
 * Creates a V2 automation rule.
 */
export const createAutomationRuleV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAutomationRuleV2Request,
    output: CreateAutomationRuleV2Response,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Grants permission to create a connectorV2 based on input parameters.
 */
export const createConnectorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorV2Request,
  output: CreateConnectorV2Response,
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
 * Creates a custom insight in Security Hub. An insight is a consolidation of findings that relate
 * to a security issue that requires attention or remediation.
 *
 * To group the related findings in the insight, use the
 * `GroupByAttribute`.
 */
export const createInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInsightRequest,
  output: CreateInsightResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceConflictException,
  ],
}));
/**
 * Returns a list of the available standards in Security Hub.
 *
 * For each standard, the results include the standard ARN, the name, and a description.
 */
export const describeStandards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStandardsRequest,
  output: DescribeStandardsResponse,
  errors: [InternalException, InvalidAccessException, InvalidInputException],
}));
/**
 * Grants permission to retrieve details for a connectorV2 based on connector id.
 */
export const getConnectorV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorV2Request,
  output: GetConnectorV2Response,
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
 * Returns the history of a Security Hub finding. The history includes changes made to any fields in
 * the Amazon Web Services Security Finding Format (ASFF) except top-level timestamp fields, such as the `CreatedAt` and
 * `UpdatedAt` fields.
 *
 * This operation might return fewer results than the maximum number of results (`MaxResults`) specified in a request, even
 * when more results are available. If this occurs, the response includes a `NextToken` value, which you should use to retrieve
 * the next set of results in the response. The presence of a `NextToken` value in a response doesn't necessarily indicate
 * that the results are incomplete. However, you should continue to specify a `NextToken` value until you receive a
 * response that doesn't include this value.
 */
export const getFindingHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingHistoryRequest,
  output: GetFindingHistoryResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
/**
 * Lists the results of the Security Hub insight specified by the insight ARN.
 */
export const getInsightResults = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightResultsRequest,
  output: GetInsightResultsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of automation rules and metadata for the calling account.
 */
export const listAutomationRulesV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAutomationRulesV2Request,
    output: ListAutomationRulesV2Response,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Grants permission to retrieve a list of connectorsV2 and their metadata for the calling account.
 */
export const listConnectorsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectorsV2Request,
  output: ListConnectorsV2Response,
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
 * Creates an automation rule based on input parameters.
 */
export const createAutomationRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAutomationRuleRequest,
    output: CreateAutomationRuleResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
    ],
  }),
);
/**
 * Returns aggregated statistical data about findings.
 * `GetFindingStatisticsV2` use `securityhub:GetAdhocInsightResults` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `s` action.
 */
export const getFindingStatisticsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingStatisticsV2Request,
    output: GetFindingStatisticsV2Response,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Return a list of findings that match the specified criteria.
 * `GetFindings` and `GetFindingsV2` both use `securityhub:GetFindings` in the `Action` element of an IAM policy statement.
 * You must have permission to perform the `securityhub:GetFindings` action.
 */
export const getFindingsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsV2Request,
  output: GetFindingsV2Response,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of a security control.
 */
export const updateSecurityControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSecurityControlRequest,
    output: UpdateSecurityControlResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a configuration policy with the defined configuration. Only the Security Hub delegated administrator
 * can invoke this operation from the home Region.
 */
export const createConfigurationPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationPolicyRequest,
    output: CreateConfigurationPolicyResponse,
    errors: [
      AccessDeniedException,
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceConflictException,
    ],
  }),
);
/**
 * Retrieves the definition of a security control. The definition includes the control title, description, Region availability, parameter definitions, and other details.
 */
export const getSecurityControlDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSecurityControlDefinitionRequest,
    output: GetSecurityControlDefinitionResponse,
    errors: [
      InternalException,
      InvalidAccessException,
      InvalidInputException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns findings trend data based on the specified criteria. This operation helps you analyze patterns and changes in findings over time.
 */
export const getFindingsTrendsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsTrendsV2Request,
  output: GetFindingsTrendsV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns resource trend data based on the specified criteria. This operation helps you analyze patterns and changes in resource compliance over time.
 */
export const getResourcesTrendsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourcesTrendsV2Request,
    output: GetResourcesTrendsV2Response,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of resources.
 */
export const getResourcesV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcesV2Request,
  output: GetResourcesV2Response,
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
 * Imports security findings generated by a finding provider into Security Hub.
 * This action is requested by the finding provider to import its findings into
 * Security Hub.
 *
 * `BatchImportFindings` must be called by one of the following:
 *
 * - The Amazon Web Services account that is associated with a finding if you are using
 * the default product ARN
 * or are a partner sending findings from within a customer's Amazon Web Services account.
 * In these cases, the identifier of the account that you are calling `BatchImportFindings`
 * from needs to be the same as the `AwsAccountId` attribute for the finding.
 *
 * - An Amazon Web Services account that Security Hub has allow-listed for an official partner
 * integration. In this case, you can call `BatchImportFindings` from the allow-listed
 * account and send findings from different customer accounts in the same batch.
 *
 * The maximum allowed size for a finding is 240 Kb. An error is returned for any finding
 * larger than 240 Kb.
 *
 * After a finding is created, `BatchImportFindings` cannot be used to update
 * the following finding fields and objects, which Security Hub customers use to manage their
 * investigation workflow.
 *
 * - `Note`
 *
 * - `UserDefinedFields`
 *
 * - `VerificationState`
 *
 * - `Workflow`
 *
 * Finding providers also should not use `BatchImportFindings` to update the following attributes.
 *
 * - `Confidence`
 *
 * - `Criticality`
 *
 * - `RelatedFindings`
 *
 * - `Severity`
 *
 * - `Types`
 *
 * Instead, finding providers use `FindingProviderFields` to provide values for these attributes.
 */
export const batchImportFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchImportFindingsRequest,
  output: BatchImportFindingsResponse,
  errors: [
    InternalException,
    InvalidAccessException,
    InvalidInputException,
    LimitExceededException,
  ],
}));
