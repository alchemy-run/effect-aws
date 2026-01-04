import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "Macie2", serviceShapeName: "Macie2" });
const auth = T.AwsAuthSigv4({ name: "macie2" });
const ver = T.ServiceVersion("2020-01-01");
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
                        url: "https://macie2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://macie2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://macie2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://macie2.{Region}.{PartitionResult#dnsSuffix}",
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
    T.Http({ method: "GET", uri: "/admin/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableMacieRequest extends S.Class<DisableMacieRequest>(
  "DisableMacieRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/macie" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableMacieResponse extends S.Class<DisableMacieResponse>(
  "DisableMacieResponse",
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
export class GetAutomatedDiscoveryConfigurationRequest extends S.Class<GetAutomatedDiscoveryConfigurationRequest>(
  "GetAutomatedDiscoveryConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/automated-discovery/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClassificationExportConfigurationRequest extends S.Class<GetClassificationExportConfigurationRequest>(
  "GetClassificationExportConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/classification-export-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsPublicationConfigurationRequest extends S.Class<GetFindingsPublicationConfigurationRequest>(
  "GetFindingsPublicationConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/findings-publication-configuration" }),
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
export class GetMacieSessionRequest extends S.Class<GetMacieSessionRequest>(
  "GetMacieSessionRequest",
)(
  {},
  T.all(T.Http({ method: "GET", uri: "/macie" }), svc, auth, proto, ver, rules),
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
export class GetRevealConfigurationRequest extends S.Class<GetRevealConfigurationRequest>(
  "GetRevealConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/reveal-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__string = S.Array(S.String);
export const __listOfFindingType = S.Array(S.String);
export class AcceptInvitationRequest extends S.Class<AcceptInvitationRequest>(
  "AcceptInvitationRequest",
)(
  {
    administratorAccountId: S.optional(S.String).pipe(
      T.JsonName("administratorAccountId"),
    ),
    invitationId: S.String.pipe(T.JsonName("invitationId")),
    masterAccount: S.optional(S.String).pipe(T.JsonName("masterAccount")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/invitations/accept" }),
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
export class BatchGetCustomDataIdentifiersRequest extends S.Class<BatchGetCustomDataIdentifiersRequest>(
  "BatchGetCustomDataIdentifiersRequest",
)(
  { ids: S.optional(__listOf__string).pipe(T.JsonName("ids")) },
  T.all(
    T.Http({ method: "POST", uri: "/custom-data-identifiers/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInvitationsRequest extends S.Class<CreateInvitationsRequest>(
  "CreateInvitationsRequest",
)(
  {
    accountIds: __listOf__string.pipe(T.JsonName("accountIds")),
    disableEmailNotification: S.optional(S.Boolean).pipe(
      T.JsonName("disableEmailNotification"),
    ),
    message: S.optional(S.String).pipe(T.JsonName("message")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/invitations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSampleFindingsRequest extends S.Class<CreateSampleFindingsRequest>(
  "CreateSampleFindingsRequest",
)(
  {
    findingTypes: S.optional(__listOfFindingType).pipe(
      T.JsonName("findingTypes"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings/sample" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSampleFindingsResponse extends S.Class<CreateSampleFindingsResponse>(
  "CreateSampleFindingsResponse",
)({}) {}
export class DeclineInvitationsRequest extends S.Class<DeclineInvitationsRequest>(
  "DeclineInvitationsRequest",
)(
  { accountIds: __listOf__string.pipe(T.JsonName("accountIds")) },
  T.all(
    T.Http({ method: "POST", uri: "/invitations/decline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAllowListRequest extends S.Class<DeleteAllowListRequest>(
  "DeleteAllowListRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    ignoreJobChecks: S.optional(S.String).pipe(T.HttpQuery("ignoreJobChecks")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/allow-lists/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAllowListResponse extends S.Class<DeleteAllowListResponse>(
  "DeleteAllowListResponse",
)({}) {}
export class DeleteCustomDataIdentifierRequest extends S.Class<DeleteCustomDataIdentifierRequest>(
  "DeleteCustomDataIdentifierRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/custom-data-identifiers/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCustomDataIdentifierResponse extends S.Class<DeleteCustomDataIdentifierResponse>(
  "DeleteCustomDataIdentifierResponse",
)({}) {}
export class DeleteFindingsFilterRequest extends S.Class<DeleteFindingsFilterRequest>(
  "DeleteFindingsFilterRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/findingsfilters/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFindingsFilterResponse extends S.Class<DeleteFindingsFilterResponse>(
  "DeleteFindingsFilterResponse",
)({}) {}
export class DeleteInvitationsRequest extends S.Class<DeleteInvitationsRequest>(
  "DeleteInvitationsRequest",
)(
  { accountIds: __listOf__string.pipe(T.JsonName("accountIds")) },
  T.all(
    T.Http({ method: "POST", uri: "/invitations/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemberRequest extends S.Class<DeleteMemberRequest>(
  "DeleteMemberRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/members/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemberResponse extends S.Class<DeleteMemberResponse>(
  "DeleteMemberResponse",
)({}) {}
export class DescribeClassificationJobRequest extends S.Class<DescribeClassificationJobRequest>(
  "DescribeClassificationJobRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOrganizationConfigurationResponse extends S.Class<DescribeOrganizationConfigurationResponse>(
  "DescribeOrganizationConfigurationResponse",
)({
  autoEnable: S.optional(S.Boolean).pipe(T.JsonName("autoEnable")),
  maxAccountLimitReached: S.optional(S.Boolean).pipe(
    T.JsonName("maxAccountLimitReached"),
  ),
}) {}
export class DisableOrganizationAdminAccountRequest extends S.Class<DisableOrganizationAdminAccountRequest>(
  "DisableOrganizationAdminAccountRequest",
)(
  { adminAccountId: S.String.pipe(T.HttpQuery("adminAccountId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/admin" }),
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
export class DisassociateMemberRequest extends S.Class<DisassociateMemberRequest>(
  "DisassociateMemberRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/members/disassociate/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberResponse extends S.Class<DisassociateMemberResponse>(
  "DisassociateMemberResponse",
)({}) {}
export class EnableMacieRequest extends S.Class<EnableMacieRequest>(
  "EnableMacieRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    findingPublishingFrequency: S.optional(S.String).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    status: S.optional(S.String).pipe(T.JsonName("status")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/macie" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableMacieResponse extends S.Class<EnableMacieResponse>(
  "EnableMacieResponse",
)({}) {}
export class EnableOrganizationAdminAccountRequest extends S.Class<EnableOrganizationAdminAccountRequest>(
  "EnableOrganizationAdminAccountRequest",
)(
  {
    adminAccountId: S.String.pipe(T.JsonName("adminAccountId")),
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/admin" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableOrganizationAdminAccountResponse extends S.Class<EnableOrganizationAdminAccountResponse>(
  "EnableOrganizationAdminAccountResponse",
)({}) {}
export class GetAllowListRequest extends S.Class<GetAllowListRequest>(
  "GetAllowListRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/allow-lists/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAutomatedDiscoveryConfigurationResponse extends S.Class<GetAutomatedDiscoveryConfigurationResponse>(
  "GetAutomatedDiscoveryConfigurationResponse",
)({
  autoEnableOrganizationMembers: S.optional(S.String).pipe(
    T.JsonName("autoEnableOrganizationMembers"),
  ),
  classificationScopeId: S.optional(S.String).pipe(
    T.JsonName("classificationScopeId"),
  ),
  disabledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("disabledAt"),
  ),
  firstEnabledAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("firstEnabledAt"),
  ),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdatedAt"),
  ),
  sensitivityInspectionTemplateId: S.optional(S.String).pipe(
    T.JsonName("sensitivityInspectionTemplateId"),
  ),
  status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class GetBucketStatisticsRequest extends S.Class<GetBucketStatisticsRequest>(
  "GetBucketStatisticsRequest",
)(
  { accountId: S.optional(S.String).pipe(T.JsonName("accountId")) },
  T.all(
    T.Http({ method: "POST", uri: "/datasources/s3/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetClassificationScopeRequest extends S.Class<GetClassificationScopeRequest>(
  "GetClassificationScopeRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/classification-scopes/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCustomDataIdentifierRequest extends S.Class<GetCustomDataIdentifierRequest>(
  "GetCustomDataIdentifierRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/custom-data-identifiers/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsFilterRequest extends S.Class<GetFindingsFilterRequest>(
  "GetFindingsFilterRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/findingsfilters/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInvitationsCountResponse extends S.Class<GetInvitationsCountResponse>(
  "GetInvitationsCountResponse",
)({
  invitationsCount: S.optional(S.Number).pipe(T.JsonName("invitationsCount")),
}) {}
export class GetMacieSessionResponse extends S.Class<GetMacieSessionResponse>(
  "GetMacieSessionResponse",
)({
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  findingPublishingFrequency: S.optional(S.String).pipe(
    T.JsonName("findingPublishingFrequency"),
  ),
  serviceRole: S.optional(S.String).pipe(T.JsonName("serviceRole")),
  status: S.optional(S.String).pipe(T.JsonName("status")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export class Invitation extends S.Class<Invitation>("Invitation")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  invitationId: S.optional(S.String).pipe(T.JsonName("invitationId")),
  invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("invitedAt"),
  ),
  relationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
}) {}
export class GetMasterAccountResponse extends S.Class<GetMasterAccountResponse>(
  "GetMasterAccountResponse",
)({ master: S.optional(Invitation).pipe(T.JsonName("master")) }) {}
export class GetMemberRequest extends S.Class<GetMemberRequest>(
  "GetMemberRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/members/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceProfileRequest extends S.Class<GetResourceProfileRequest>(
  "GetResourceProfileRequest",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resource-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSensitiveDataOccurrencesRequest extends S.Class<GetSensitiveDataOccurrencesRequest>(
  "GetSensitiveDataOccurrencesRequest",
)(
  { findingId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/findings/{findingId}/reveal" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSensitiveDataOccurrencesAvailabilityRequest extends S.Class<GetSensitiveDataOccurrencesAvailabilityRequest>(
  "GetSensitiveDataOccurrencesAvailabilityRequest",
)(
  { findingId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/findings/{findingId}/reveal/availability" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSensitivityInspectionTemplateRequest extends S.Class<GetSensitivityInspectionTemplateRequest>(
  "GetSensitivityInspectionTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/templates/sensitivity-inspections/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUsageTotalsRequest extends S.Class<GetUsageTotalsRequest>(
  "GetUsageTotalsRequest",
)(
  { timeRange: S.optional(S.String).pipe(T.HttpQuery("timeRange")) },
  T.all(T.Http({ method: "GET", uri: "/usage" }), svc, auth, proto, ver, rules),
) {}
export class ListAllowListsRequest extends S.Class<ListAllowListsRequest>(
  "ListAllowListsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/allow-lists" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAutomatedDiscoveryAccountsRequest extends S.Class<ListAutomatedDiscoveryAccountsRequest>(
  "ListAutomatedDiscoveryAccountsRequest",
)(
  {
    accountIds: S.optional(__listOf__string).pipe(T.HttpQuery("accountIds")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/automated-discovery/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClassificationScopesRequest extends S.Class<ListClassificationScopesRequest>(
  "ListClassificationScopesRequest",
)(
  {
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/classification-scopes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomDataIdentifiersRequest extends S.Class<ListCustomDataIdentifiersRequest>(
  "ListCustomDataIdentifiersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/custom-data-identifiers/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CriterionAdditionalProperties extends S.Class<CriterionAdditionalProperties>(
  "CriterionAdditionalProperties",
)({
  eq: S.optional(__listOf__string).pipe(T.JsonName("eq")),
  eqExactMatch: S.optional(__listOf__string).pipe(T.JsonName("eqExactMatch")),
  gt: S.optional(S.Number).pipe(T.JsonName("gt")),
  gte: S.optional(S.Number).pipe(T.JsonName("gte")),
  lt: S.optional(S.Number).pipe(T.JsonName("lt")),
  lte: S.optional(S.Number).pipe(T.JsonName("lte")),
  neq: S.optional(__listOf__string).pipe(T.JsonName("neq")),
}) {}
export const Criterion = S.Record({
  key: S.String,
  value: CriterionAdditionalProperties,
});
export class FindingCriteria extends S.Class<FindingCriteria>(
  "FindingCriteria",
)({ criterion: S.optional(Criterion).pipe(T.JsonName("criterion")) }) {}
export class SortCriteria extends S.Class<SortCriteria>("SortCriteria")({
  attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class ListFindingsRequest extends S.Class<ListFindingsRequest>(
  "ListFindingsRequest",
)(
  {
    findingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
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
export class ListFindingsFiltersRequest extends S.Class<ListFindingsFiltersRequest>(
  "ListFindingsFiltersRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/findingsfilters" }),
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
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
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
export class ListManagedDataIdentifiersRequest extends S.Class<ListManagedDataIdentifiersRequest>(
  "ListManagedDataIdentifiersRequest",
)(
  { nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")) },
  T.all(
    T.Http({ method: "POST", uri: "/managed-data-identifiers/list" }),
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
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    onlyAssociated: S.optional(S.String).pipe(T.HttpQuery("onlyAssociated")),
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
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "GET", uri: "/admin" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceProfileArtifactsRequest extends S.Class<ListResourceProfileArtifactsRequest>(
  "ListResourceProfileArtifactsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resource-profiles/artifacts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceProfileDetectionsRequest extends S.Class<ListResourceProfileDetectionsRequest>(
  "ListResourceProfileDetectionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resource-profiles/detections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSensitivityInspectionTemplatesRequest extends S.Class<ListSensitivityInspectionTemplatesRequest>(
  "ListSensitivityInspectionTemplatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templates/sensitivity-inspections" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  bucketName: S.String.pipe(T.JsonName("bucketName")),
  keyPrefix: S.optional(S.String).pipe(T.JsonName("keyPrefix")),
  kmsKeyArn: S.String.pipe(T.JsonName("kmsKeyArn")),
}) {}
export class ClassificationExportConfiguration extends S.Class<ClassificationExportConfiguration>(
  "ClassificationExportConfiguration",
)({
  s3Destination: S.optional(S3Destination).pipe(T.JsonName("s3Destination")),
}) {}
export class PutClassificationExportConfigurationRequest extends S.Class<PutClassificationExportConfigurationRequest>(
  "PutClassificationExportConfigurationRequest",
)(
  {
    configuration: ClassificationExportConfiguration.pipe(
      T.JsonName("configuration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/classification-export-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SecurityHubConfiguration extends S.Class<SecurityHubConfiguration>(
  "SecurityHubConfiguration",
)({
  publishClassificationFindings: S.Boolean.pipe(
    T.JsonName("publishClassificationFindings"),
  ),
  publishPolicyFindings: S.Boolean.pipe(T.JsonName("publishPolicyFindings")),
}) {}
export class PutFindingsPublicationConfigurationRequest extends S.Class<PutFindingsPublicationConfigurationRequest>(
  "PutFindingsPublicationConfigurationRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    securityHubConfiguration: S.optional(SecurityHubConfiguration).pipe(
      T.JsonName("securityHubConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/findings-publication-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutFindingsPublicationConfigurationResponse extends S.Class<PutFindingsPublicationConfigurationResponse>(
  "PutFindingsPublicationConfigurationResponse",
)({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tags: TagMap.pipe(T.JsonName("tags")),
  },
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
export class TestCustomDataIdentifierRequest extends S.Class<TestCustomDataIdentifierRequest>(
  "TestCustomDataIdentifierRequest",
)(
  {
    ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
    keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
    maximumMatchDistance: S.optional(S.Number).pipe(
      T.JsonName("maximumMatchDistance"),
    ),
    regex: S.String.pipe(T.JsonName("regex")),
    sampleText: S.String.pipe(T.JsonName("sampleText")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/custom-data-identifiers/test" }),
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
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
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
export class S3WordsList extends S.Class<S3WordsList>("S3WordsList")({
  bucketName: S.String.pipe(T.JsonName("bucketName")),
  objectKey: S.String.pipe(T.JsonName("objectKey")),
}) {}
export class AllowListCriteria extends S.Class<AllowListCriteria>(
  "AllowListCriteria",
)({
  regex: S.optional(S.String).pipe(T.JsonName("regex")),
  s3WordsList: S.optional(S3WordsList).pipe(T.JsonName("s3WordsList")),
}) {}
export class UpdateAllowListRequest extends S.Class<UpdateAllowListRequest>(
  "UpdateAllowListRequest",
)(
  {
    criteria: AllowListCriteria.pipe(T.JsonName("criteria")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    id: S.String.pipe(T.HttpLabel()),
    name: S.String.pipe(T.JsonName("name")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/allow-lists/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAutomatedDiscoveryConfigurationRequest extends S.Class<UpdateAutomatedDiscoveryConfigurationRequest>(
  "UpdateAutomatedDiscoveryConfigurationRequest",
)(
  {
    autoEnableOrganizationMembers: S.optional(S.String).pipe(
      T.JsonName("autoEnableOrganizationMembers"),
    ),
    status: S.String.pipe(T.JsonName("status")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/automated-discovery/configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAutomatedDiscoveryConfigurationResponse extends S.Class<UpdateAutomatedDiscoveryConfigurationResponse>(
  "UpdateAutomatedDiscoveryConfigurationResponse",
)({}) {}
export class UpdateClassificationJobRequest extends S.Class<UpdateClassificationJobRequest>(
  "UpdateClassificationJobRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    jobStatus: S.String.pipe(T.JsonName("jobStatus")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/jobs/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClassificationJobResponse extends S.Class<UpdateClassificationJobResponse>(
  "UpdateClassificationJobResponse",
)({}) {}
export class UpdateFindingsFilterRequest extends S.Class<UpdateFindingsFilterRequest>(
  "UpdateFindingsFilterRequest",
)(
  {
    action: S.optional(S.String).pipe(T.JsonName("action")),
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    findingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
    id: S.String.pipe(T.HttpLabel()),
    name: S.optional(S.String).pipe(T.JsonName("name")),
    position: S.optional(S.Number).pipe(T.JsonName("position")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/findingsfilters/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMacieSessionRequest extends S.Class<UpdateMacieSessionRequest>(
  "UpdateMacieSessionRequest",
)(
  {
    findingPublishingFrequency: S.optional(S.String).pipe(
      T.JsonName("findingPublishingFrequency"),
    ),
    status: S.optional(S.String).pipe(T.JsonName("status")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/macie" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMacieSessionResponse extends S.Class<UpdateMacieSessionResponse>(
  "UpdateMacieSessionResponse",
)({}) {}
export class UpdateMemberSessionRequest extends S.Class<UpdateMemberSessionRequest>(
  "UpdateMemberSessionRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    status: S.String.pipe(T.JsonName("status")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/macie/members/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMemberSessionResponse extends S.Class<UpdateMemberSessionResponse>(
  "UpdateMemberSessionResponse",
)({}) {}
export class UpdateOrganizationConfigurationRequest extends S.Class<UpdateOrganizationConfigurationRequest>(
  "UpdateOrganizationConfigurationRequest",
)(
  { autoEnable: S.Boolean.pipe(T.JsonName("autoEnable")) },
  T.all(
    T.Http({ method: "PATCH", uri: "/admin/configuration" }),
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
export class UpdateResourceProfileRequest extends S.Class<UpdateResourceProfileRequest>(
  "UpdateResourceProfileRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    sensitivityScoreOverride: S.optional(S.Number).pipe(
      T.JsonName("sensitivityScoreOverride"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/resource-profiles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceProfileResponse extends S.Class<UpdateResourceProfileResponse>(
  "UpdateResourceProfileResponse",
)({}) {}
export class DailySchedule extends S.Class<DailySchedule>("DailySchedule")(
  {},
) {}
export class AutomatedDiscoveryAccountUpdate extends S.Class<AutomatedDiscoveryAccountUpdate>(
  "AutomatedDiscoveryAccountUpdate",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const __listOfAutomatedDiscoveryAccountUpdate = S.Array(
  AutomatedDiscoveryAccountUpdate,
);
export class SeverityLevel extends S.Class<SeverityLevel>("SeverityLevel")({
  occurrencesThreshold: S.Number.pipe(T.JsonName("occurrencesThreshold")),
  severity: S.String.pipe(T.JsonName("severity")),
}) {}
export const SeverityLevelList = S.Array(SeverityLevel);
export class AccountDetail extends S.Class<AccountDetail>("AccountDetail")({
  accountId: S.String.pipe(T.JsonName("accountId")),
  email: S.String.pipe(T.JsonName("email")),
}) {}
export class BucketSortCriteria extends S.Class<BucketSortCriteria>(
  "BucketSortCriteria",
)({
  attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class FindingStatisticsSortCriteria extends S.Class<FindingStatisticsSortCriteria>(
  "FindingStatisticsSortCriteria",
)({
  attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class RevealConfiguration extends S.Class<RevealConfiguration>(
  "RevealConfiguration",
)({
  kmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")),
  status: S.String.pipe(T.JsonName("status")),
}) {}
export class RetrievalConfiguration extends S.Class<RetrievalConfiguration>(
  "RetrievalConfiguration",
)({
  externalId: S.optional(S.String).pipe(T.JsonName("externalId")),
  retrievalMode: S.String.pipe(T.JsonName("retrievalMode")),
  roleName: S.optional(S.String).pipe(T.JsonName("roleName")),
}) {}
export const __listOfUnavailabilityReasonCode = S.Array(S.String);
export class UsageStatisticsFilter extends S.Class<UsageStatisticsFilter>(
  "UsageStatisticsFilter",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  values: S.optional(__listOf__string).pipe(T.JsonName("values")),
}) {}
export const __listOfUsageStatisticsFilter = S.Array(UsageStatisticsFilter);
export class UsageStatisticsSortBy extends S.Class<UsageStatisticsSortBy>(
  "UsageStatisticsSortBy",
)({
  key: S.optional(S.String).pipe(T.JsonName("key")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class ListJobsSortCriteria extends S.Class<ListJobsSortCriteria>(
  "ListJobsSortCriteria",
)({
  attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export const __listOfInvitation = S.Array(Invitation);
export class SearchResourcesSortCriteria extends S.Class<SearchResourcesSortCriteria>(
  "SearchResourcesSortCriteria",
)({
  attributeName: S.optional(S.String).pipe(T.JsonName("attributeName")),
  orderBy: S.optional(S.String).pipe(T.JsonName("orderBy")),
}) {}
export class SuppressDataIdentifier extends S.Class<SuppressDataIdentifier>(
  "SuppressDataIdentifier",
)({
  id: S.optional(S.String).pipe(T.JsonName("id")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfSuppressDataIdentifier = S.Array(SuppressDataIdentifier);
export class UpdateRetrievalConfiguration extends S.Class<UpdateRetrievalConfiguration>(
  "UpdateRetrievalConfiguration",
)({
  retrievalMode: S.String.pipe(T.JsonName("retrievalMode")),
  roleName: S.optional(S.String).pipe(T.JsonName("roleName")),
}) {}
export class SensitivityInspectionTemplateExcludes extends S.Class<SensitivityInspectionTemplateExcludes>(
  "SensitivityInspectionTemplateExcludes",
)({
  managedDataIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("managedDataIdentifierIds"),
  ),
}) {}
export class SensitivityInspectionTemplateIncludes extends S.Class<SensitivityInspectionTemplateIncludes>(
  "SensitivityInspectionTemplateIncludes",
)({
  allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
  customDataIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("customDataIdentifierIds"),
  ),
  managedDataIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("managedDataIdentifierIds"),
  ),
}) {}
export const __listOfS3BucketName = S.Array(S.String);
export class BatchUpdateAutomatedDiscoveryAccountsRequest extends S.Class<BatchUpdateAutomatedDiscoveryAccountsRequest>(
  "BatchUpdateAutomatedDiscoveryAccountsRequest",
)(
  {
    accounts: S.optional(__listOfAutomatedDiscoveryAccountUpdate).pipe(
      T.JsonName("accounts"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/automated-discovery/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomDataIdentifierRequest extends S.Class<CreateCustomDataIdentifierRequest>(
  "CreateCustomDataIdentifierRequest",
)(
  {
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
    keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
    maximumMatchDistance: S.optional(S.Number).pipe(
      T.JsonName("maximumMatchDistance"),
    ),
    name: S.String.pipe(T.JsonName("name")),
    regex: S.String.pipe(T.JsonName("regex")),
    severityLevels: S.optional(SeverityLevelList).pipe(
      T.JsonName("severityLevels"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/custom-data-identifiers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMemberRequest extends S.Class<CreateMemberRequest>(
  "CreateMemberRequest",
)(
  {
    account: AccountDetail.pipe(T.JsonName("account")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UnprocessedAccount extends S.Class<UnprocessedAccount>(
  "UnprocessedAccount",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  errorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
}) {}
export const __listOfUnprocessedAccount = S.Array(UnprocessedAccount);
export class DeclineInvitationsResponse extends S.Class<DeclineInvitationsResponse>(
  "DeclineInvitationsResponse",
)({
  unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class DeleteInvitationsResponse extends S.Class<DeleteInvitationsResponse>(
  "DeleteInvitationsResponse",
)({
  unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class GetAdministratorAccountResponse extends S.Class<GetAdministratorAccountResponse>(
  "GetAdministratorAccountResponse",
)({
  administrator: S.optional(Invitation).pipe(T.JsonName("administrator")),
}) {}
export class GetCustomDataIdentifierResponse extends S.Class<GetCustomDataIdentifierResponse>(
  "GetCustomDataIdentifierResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  deleted: S.optional(S.Boolean).pipe(T.JsonName("deleted")),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  ignoreWords: S.optional(__listOf__string).pipe(T.JsonName("ignoreWords")),
  keywords: S.optional(__listOf__string).pipe(T.JsonName("keywords")),
  maximumMatchDistance: S.optional(S.Number).pipe(
    T.JsonName("maximumMatchDistance"),
  ),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  regex: S.optional(S.String).pipe(T.JsonName("regex")),
  severityLevels: S.optional(SeverityLevelList).pipe(
    T.JsonName("severityLevels"),
  ),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetFindingsRequest extends S.Class<GetFindingsRequest>(
  "GetFindingsRequest",
)(
  {
    findingIds: __listOf__string.pipe(T.JsonName("findingIds")),
    sortCriteria: S.optional(SortCriteria).pipe(T.JsonName("sortCriteria")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsFilterResponse extends S.Class<GetFindingsFilterResponse>(
  "GetFindingsFilterResponse",
)({
  action: S.optional(S.String).pipe(T.JsonName("action")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  findingCriteria: S.optional(FindingCriteria).pipe(
    T.JsonName("findingCriteria"),
  ),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  position: S.optional(S.Number).pipe(T.JsonName("position")),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetFindingsPublicationConfigurationResponse extends S.Class<GetFindingsPublicationConfigurationResponse>(
  "GetFindingsPublicationConfigurationResponse",
)({
  securityHubConfiguration: S.optional(SecurityHubConfiguration).pipe(
    T.JsonName("securityHubConfiguration"),
  ),
}) {}
export class GetFindingStatisticsRequest extends S.Class<GetFindingStatisticsRequest>(
  "GetFindingStatisticsRequest",
)(
  {
    findingCriteria: S.optional(FindingCriteria).pipe(
      T.JsonName("findingCriteria"),
    ),
    groupBy: S.String.pipe(T.JsonName("groupBy")),
    size: S.optional(S.Number).pipe(T.JsonName("size")),
    sortCriteria: S.optional(FindingStatisticsSortCriteria).pipe(
      T.JsonName("sortCriteria"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemberResponse extends S.Class<GetMemberResponse>(
  "GetMemberResponse",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  administratorAccountId: S.optional(S.String).pipe(
    T.JsonName("administratorAccountId"),
  ),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  email: S.optional(S.String).pipe(T.JsonName("email")),
  invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("invitedAt"),
  ),
  masterAccountId: S.optional(S.String).pipe(T.JsonName("masterAccountId")),
  relationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export class GetRevealConfigurationResponse extends S.Class<GetRevealConfigurationResponse>(
  "GetRevealConfigurationResponse",
)({
  configuration: S.optional(RevealConfiguration).pipe(
    T.JsonName("configuration"),
  ),
  retrievalConfiguration: S.optional(RetrievalConfiguration).pipe(
    T.JsonName("retrievalConfiguration"),
  ),
}) {}
export class GetSensitiveDataOccurrencesAvailabilityResponse extends S.Class<GetSensitiveDataOccurrencesAvailabilityResponse>(
  "GetSensitiveDataOccurrencesAvailabilityResponse",
)({
  code: S.optional(S.String).pipe(T.JsonName("code")),
  reasons: S.optional(__listOfUnavailabilityReasonCode).pipe(
    T.JsonName("reasons"),
  ),
}) {}
export class GetSensitivityInspectionTemplateResponse extends S.Class<GetSensitivityInspectionTemplateResponse>(
  "GetSensitivityInspectionTemplateResponse",
)({
  description: S.optional(S.String).pipe(T.JsonName("description")),
  excludes: S.optional(SensitivityInspectionTemplateExcludes).pipe(
    T.JsonName("excludes"),
  ),
  includes: S.optional(SensitivityInspectionTemplateIncludes).pipe(
    T.JsonName("includes"),
  ),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  sensitivityInspectionTemplateId: S.optional(S.String).pipe(
    T.JsonName("sensitivityInspectionTemplateId"),
  ),
}) {}
export class GetUsageStatisticsRequest extends S.Class<GetUsageStatisticsRequest>(
  "GetUsageStatisticsRequest",
)(
  {
    filterBy: S.optional(__listOfUsageStatisticsFilter).pipe(
      T.JsonName("filterBy"),
    ),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortBy: S.optional(UsageStatisticsSortBy).pipe(T.JsonName("sortBy")),
    timeRange: S.optional(S.String).pipe(T.JsonName("timeRange")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/usage/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFindingsResponse extends S.Class<ListFindingsResponse>(
  "ListFindingsResponse",
)({
  findingIds: S.optional(__listOf__string).pipe(T.JsonName("findingIds")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListInvitationsResponse extends S.Class<ListInvitationsResponse>(
  "ListInvitationsResponse",
)({
  invitations: S.optional(__listOfInvitation).pipe(T.JsonName("invitations")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap).pipe(T.JsonName("tags")) }) {}
export class PutClassificationExportConfigurationResponse extends S.Class<PutClassificationExportConfigurationResponse>(
  "PutClassificationExportConfigurationResponse",
)({
  configuration: S.optional(ClassificationExportConfiguration).pipe(
    T.JsonName("configuration"),
  ),
}) {}
export class TestCustomDataIdentifierResponse extends S.Class<TestCustomDataIdentifierResponse>(
  "TestCustomDataIdentifierResponse",
)({ matchCount: S.optional(S.Number).pipe(T.JsonName("matchCount")) }) {}
export class UpdateAllowListResponse extends S.Class<UpdateAllowListResponse>(
  "UpdateAllowListResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class UpdateFindingsFilterResponse extends S.Class<UpdateFindingsFilterResponse>(
  "UpdateFindingsFilterResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class UpdateResourceProfileDetectionsRequest extends S.Class<UpdateResourceProfileDetectionsRequest>(
  "UpdateResourceProfileDetectionsRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    suppressDataIdentifiers: S.optional(__listOfSuppressDataIdentifier).pipe(
      T.JsonName("suppressDataIdentifiers"),
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/resource-profiles/detections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceProfileDetectionsResponse extends S.Class<UpdateResourceProfileDetectionsResponse>(
  "UpdateResourceProfileDetectionsResponse",
)({}) {}
export class UpdateRevealConfigurationRequest extends S.Class<UpdateRevealConfigurationRequest>(
  "UpdateRevealConfigurationRequest",
)(
  {
    configuration: RevealConfiguration.pipe(T.JsonName("configuration")),
    retrievalConfiguration: S.optional(UpdateRetrievalConfiguration).pipe(
      T.JsonName("retrievalConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/reveal-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSensitivityInspectionTemplateRequest extends S.Class<UpdateSensitivityInspectionTemplateRequest>(
  "UpdateSensitivityInspectionTemplateRequest",
)(
  {
    description: S.optional(S.String).pipe(T.JsonName("description")),
    excludes: S.optional(SensitivityInspectionTemplateExcludes).pipe(
      T.JsonName("excludes"),
    ),
    id: S.String.pipe(T.HttpLabel()),
    includes: S.optional(SensitivityInspectionTemplateIncludes).pipe(
      T.JsonName("includes"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/templates/sensitivity-inspections/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSensitivityInspectionTemplateResponse extends S.Class<UpdateSensitivityInspectionTemplateResponse>(
  "UpdateSensitivityInspectionTemplateResponse",
)({}) {}
export class S3BucketDefinitionForJob extends S.Class<S3BucketDefinitionForJob>(
  "S3BucketDefinitionForJob",
)({
  accountId: S.String.pipe(T.JsonName("accountId")),
  buckets: __listOf__string.pipe(T.JsonName("buckets")),
}) {}
export const __listOfS3BucketDefinitionForJob = S.Array(
  S3BucketDefinitionForJob,
);
export class MonthlySchedule extends S.Class<MonthlySchedule>(
  "MonthlySchedule",
)({ dayOfMonth: S.optional(S.Number).pipe(T.JsonName("dayOfMonth")) }) {}
export class WeeklySchedule extends S.Class<WeeklySchedule>("WeeklySchedule")({
  dayOfWeek: S.optional(S.String).pipe(T.JsonName("dayOfWeek")),
}) {}
export class BucketCriteriaAdditionalProperties extends S.Class<BucketCriteriaAdditionalProperties>(
  "BucketCriteriaAdditionalProperties",
)({
  eq: S.optional(__listOf__string).pipe(T.JsonName("eq")),
  gt: S.optional(S.Number).pipe(T.JsonName("gt")),
  gte: S.optional(S.Number).pipe(T.JsonName("gte")),
  lt: S.optional(S.Number).pipe(T.JsonName("lt")),
  lte: S.optional(S.Number).pipe(T.JsonName("lte")),
  neq: S.optional(__listOf__string).pipe(T.JsonName("neq")),
  prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
}) {}
export class ListJobsFilterTerm extends S.Class<ListJobsFilterTerm>(
  "ListJobsFilterTerm",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  values: S.optional(__listOf__string).pipe(T.JsonName("values")),
}) {}
export const __listOfListJobsFilterTerm = S.Array(ListJobsFilterTerm);
export class S3ClassificationScopeExclusionUpdate extends S.Class<S3ClassificationScopeExclusionUpdate>(
  "S3ClassificationScopeExclusionUpdate",
)({
  bucketNames: __listOfS3BucketName.pipe(T.JsonName("bucketNames")),
  operation: S.String.pipe(T.JsonName("operation")),
}) {}
export class BatchGetCustomDataIdentifierSummary extends S.Class<BatchGetCustomDataIdentifierSummary>(
  "BatchGetCustomDataIdentifierSummary",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  deleted: S.optional(S.Boolean).pipe(T.JsonName("deleted")),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfBatchGetCustomDataIdentifierSummary = S.Array(
  BatchGetCustomDataIdentifierSummary,
);
export class JobScheduleFrequency extends S.Class<JobScheduleFrequency>(
  "JobScheduleFrequency",
)({
  dailySchedule: S.optional(DailySchedule).pipe(T.JsonName("dailySchedule")),
  monthlySchedule: S.optional(MonthlySchedule).pipe(
    T.JsonName("monthlySchedule"),
  ),
  weeklySchedule: S.optional(WeeklySchedule).pipe(T.JsonName("weeklySchedule")),
}) {}
export const BucketCriteria = S.Record({
  key: S.String,
  value: BucketCriteriaAdditionalProperties,
});
export class LastRunErrorStatus extends S.Class<LastRunErrorStatus>(
  "LastRunErrorStatus",
)({ code: S.optional(S.String).pipe(T.JsonName("code")) }) {}
export class Statistics extends S.Class<Statistics>("Statistics")({
  approximateNumberOfObjectsToProcess: S.optional(S.Number).pipe(
    T.JsonName("approximateNumberOfObjectsToProcess"),
  ),
  numberOfRuns: S.optional(S.Number).pipe(T.JsonName("numberOfRuns")),
}) {}
export class UserPausedDetails extends S.Class<UserPausedDetails>(
  "UserPausedDetails",
)({
  jobExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("jobExpiresAt"),
  ),
  jobImminentExpirationHealthEventArn: S.optional(S.String).pipe(
    T.JsonName("jobImminentExpirationHealthEventArn"),
  ),
  jobPausedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("jobPausedAt"),
  ),
}) {}
export class AllowListStatus extends S.Class<AllowListStatus>(
  "AllowListStatus",
)({
  code: S.String.pipe(T.JsonName("code")),
  description: S.optional(S.String).pipe(T.JsonName("description")),
}) {}
export class BucketCountByEffectivePermission extends S.Class<BucketCountByEffectivePermission>(
  "BucketCountByEffectivePermission",
)({
  publiclyAccessible: S.optional(S.Number).pipe(
    T.JsonName("publiclyAccessible"),
  ),
  publiclyReadable: S.optional(S.Number).pipe(T.JsonName("publiclyReadable")),
  publiclyWritable: S.optional(S.Number).pipe(T.JsonName("publiclyWritable")),
  unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
}) {}
export class BucketCountByEncryptionType extends S.Class<BucketCountByEncryptionType>(
  "BucketCountByEncryptionType",
)({
  kmsManaged: S.optional(S.Number).pipe(T.JsonName("kmsManaged")),
  s3Managed: S.optional(S.Number).pipe(T.JsonName("s3Managed")),
  unencrypted: S.optional(S.Number).pipe(T.JsonName("unencrypted")),
  unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
}) {}
export class BucketCountPolicyAllowsUnencryptedObjectUploads extends S.Class<BucketCountPolicyAllowsUnencryptedObjectUploads>(
  "BucketCountPolicyAllowsUnencryptedObjectUploads",
)({
  allowsUnencryptedObjectUploads: S.optional(S.Number).pipe(
    T.JsonName("allowsUnencryptedObjectUploads"),
  ),
  deniesUnencryptedObjectUploads: S.optional(S.Number).pipe(
    T.JsonName("deniesUnencryptedObjectUploads"),
  ),
  unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
}) {}
export class BucketCountBySharedAccessType extends S.Class<BucketCountBySharedAccessType>(
  "BucketCountBySharedAccessType",
)({
  external: S.optional(S.Number).pipe(T.JsonName("external")),
  internal: S.optional(S.Number).pipe(T.JsonName("internal")),
  notShared: S.optional(S.Number).pipe(T.JsonName("notShared")),
  unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
}) {}
export class ObjectLevelStatistics extends S.Class<ObjectLevelStatistics>(
  "ObjectLevelStatistics",
)({
  fileType: S.optional(S.Number).pipe(T.JsonName("fileType")),
  storageClass: S.optional(S.Number).pipe(T.JsonName("storageClass")),
  total: S.optional(S.Number).pipe(T.JsonName("total")),
}) {}
export class ResourceStatistics extends S.Class<ResourceStatistics>(
  "ResourceStatistics",
)({
  totalBytesClassified: S.optional(S.Number).pipe(
    T.JsonName("totalBytesClassified"),
  ),
  totalDetections: S.optional(S.Number).pipe(T.JsonName("totalDetections")),
  totalDetectionsSuppressed: S.optional(S.Number).pipe(
    T.JsonName("totalDetectionsSuppressed"),
  ),
  totalItemsClassified: S.optional(S.Number).pipe(
    T.JsonName("totalItemsClassified"),
  ),
  totalItemsSensitive: S.optional(S.Number).pipe(
    T.JsonName("totalItemsSensitive"),
  ),
  totalItemsSkipped: S.optional(S.Number).pipe(T.JsonName("totalItemsSkipped")),
  totalItemsSkippedInvalidEncryption: S.optional(S.Number).pipe(
    T.JsonName("totalItemsSkippedInvalidEncryption"),
  ),
  totalItemsSkippedInvalidKms: S.optional(S.Number).pipe(
    T.JsonName("totalItemsSkippedInvalidKms"),
  ),
  totalItemsSkippedPermissionDenied: S.optional(S.Number).pipe(
    T.JsonName("totalItemsSkippedPermissionDenied"),
  ),
}) {}
export class UsageTotal extends S.Class<UsageTotal>("UsageTotal")({
  currency: S.optional(S.String).pipe(T.JsonName("currency")),
  estimatedCost: S.optional(S.String).pipe(T.JsonName("estimatedCost")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfUsageTotal = S.Array(UsageTotal);
export class AllowListSummary extends S.Class<AllowListSummary>(
  "AllowListSummary",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const __listOfAllowListSummary = S.Array(AllowListSummary);
export class AutomatedDiscoveryAccount extends S.Class<AutomatedDiscoveryAccount>(
  "AutomatedDiscoveryAccount",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const __listOfAutomatedDiscoveryAccount = S.Array(
  AutomatedDiscoveryAccount,
);
export class ListJobsFilterCriteria extends S.Class<ListJobsFilterCriteria>(
  "ListJobsFilterCriteria",
)({
  excludes: S.optional(__listOfListJobsFilterTerm).pipe(T.JsonName("excludes")),
  includes: S.optional(__listOfListJobsFilterTerm).pipe(T.JsonName("includes")),
}) {}
export class ClassificationScopeSummary extends S.Class<ClassificationScopeSummary>(
  "ClassificationScopeSummary",
)({
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfClassificationScopeSummary = S.Array(
  ClassificationScopeSummary,
);
export class CustomDataIdentifierSummary extends S.Class<CustomDataIdentifierSummary>(
  "CustomDataIdentifierSummary",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfCustomDataIdentifierSummary = S.Array(
  CustomDataIdentifierSummary,
);
export class FindingsFilterListItem extends S.Class<FindingsFilterListItem>(
  "FindingsFilterListItem",
)({
  action: S.optional(S.String).pipe(T.JsonName("action")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export const __listOfFindingsFilterListItem = S.Array(FindingsFilterListItem);
export class ManagedDataIdentifierSummary extends S.Class<ManagedDataIdentifierSummary>(
  "ManagedDataIdentifierSummary",
)({
  category: S.optional(S.String).pipe(T.JsonName("category")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export const __listOfManagedDataIdentifierSummary = S.Array(
  ManagedDataIdentifierSummary,
);
export class Member extends S.Class<Member>("Member")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  administratorAccountId: S.optional(S.String).pipe(
    T.JsonName("administratorAccountId"),
  ),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  email: S.optional(S.String).pipe(T.JsonName("email")),
  invitedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("invitedAt"),
  ),
  masterAccountId: S.optional(S.String).pipe(T.JsonName("masterAccountId")),
  relationshipStatus: S.optional(S.String).pipe(
    T.JsonName("relationshipStatus"),
  ),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const __listOfMember = S.Array(Member);
export class AdminAccount extends S.Class<AdminAccount>("AdminAccount")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export const __listOfAdminAccount = S.Array(AdminAccount);
export class ResourceProfileArtifact extends S.Class<ResourceProfileArtifact>(
  "ResourceProfileArtifact",
)({
  arn: S.String.pipe(T.JsonName("arn")),
  classificationResultStatus: S.String.pipe(
    T.JsonName("classificationResultStatus"),
  ),
  sensitive: S.optional(S.Boolean).pipe(T.JsonName("sensitive")),
}) {}
export const __listOfResourceProfileArtifact = S.Array(ResourceProfileArtifact);
export class Detection extends S.Class<Detection>("Detection")({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  count: S.optional(S.Number).pipe(T.JsonName("count")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  suppressed: S.optional(S.Boolean).pipe(T.JsonName("suppressed")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfDetection = S.Array(Detection);
export class SensitivityInspectionTemplatesEntry extends S.Class<SensitivityInspectionTemplatesEntry>(
  "SensitivityInspectionTemplatesEntry",
)({
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfSensitivityInspectionTemplatesEntry = S.Array(
  SensitivityInspectionTemplatesEntry,
);
export class S3ClassificationScopeUpdate extends S.Class<S3ClassificationScopeUpdate>(
  "S3ClassificationScopeUpdate",
)({
  excludes: S3ClassificationScopeExclusionUpdate.pipe(T.JsonName("excludes")),
}) {}
export class BatchGetCustomDataIdentifiersResponse extends S.Class<BatchGetCustomDataIdentifiersResponse>(
  "BatchGetCustomDataIdentifiersResponse",
)({
  customDataIdentifiers: S.optional(
    __listOfBatchGetCustomDataIdentifierSummary,
  ).pipe(T.JsonName("customDataIdentifiers")),
  notFoundIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("notFoundIdentifierIds"),
  ),
}) {}
export class CreateAllowListRequest extends S.Class<CreateAllowListRequest>(
  "CreateAllowListRequest",
)(
  {
    clientToken: S.String.pipe(T.JsonName("clientToken")),
    criteria: AllowListCriteria.pipe(T.JsonName("criteria")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    name: S.String.pipe(T.JsonName("name")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/allow-lists" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCustomDataIdentifierResponse extends S.Class<CreateCustomDataIdentifierResponse>(
  "CreateCustomDataIdentifierResponse",
)({
  customDataIdentifierId: S.optional(S.String).pipe(
    T.JsonName("customDataIdentifierId"),
  ),
}) {}
export class CreateInvitationsResponse extends S.Class<CreateInvitationsResponse>(
  "CreateInvitationsResponse",
)({
  unprocessedAccounts: S.optional(__listOfUnprocessedAccount).pipe(
    T.JsonName("unprocessedAccounts"),
  ),
}) {}
export class CreateMemberResponse extends S.Class<CreateMemberResponse>(
  "CreateMemberResponse",
)({ arn: S.optional(S.String).pipe(T.JsonName("arn")) }) {}
export class DescribeBucketsRequest extends S.Class<DescribeBucketsRequest>(
  "DescribeBucketsRequest",
)(
  {
    criteria: S.optional(BucketCriteria).pipe(T.JsonName("criteria")),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(BucketSortCriteria).pipe(
      T.JsonName("sortCriteria"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasources/s3" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SimpleCriterionForJob extends S.Class<SimpleCriterionForJob>(
  "SimpleCriterionForJob",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  values: S.optional(__listOf__string).pipe(T.JsonName("values")),
}) {}
export class TagCriterionPairForJob extends S.Class<TagCriterionPairForJob>(
  "TagCriterionPairForJob",
)({
  key: S.optional(S.String).pipe(T.JsonName("key")),
  value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const __listOfTagCriterionPairForJob = S.Array(TagCriterionPairForJob);
export class TagCriterionForJob extends S.Class<TagCriterionForJob>(
  "TagCriterionForJob",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  tagValues: S.optional(__listOfTagCriterionPairForJob).pipe(
    T.JsonName("tagValues"),
  ),
}) {}
export class CriteriaForJob extends S.Class<CriteriaForJob>("CriteriaForJob")({
  simpleCriterion: S.optional(SimpleCriterionForJob).pipe(
    T.JsonName("simpleCriterion"),
  ),
  tagCriterion: S.optional(TagCriterionForJob).pipe(T.JsonName("tagCriterion")),
}) {}
export const __listOfCriteriaForJob = S.Array(CriteriaForJob);
export class CriteriaBlockForJob extends S.Class<CriteriaBlockForJob>(
  "CriteriaBlockForJob",
)({ and: S.optional(__listOfCriteriaForJob).pipe(T.JsonName("and")) }) {}
export class S3BucketCriteriaForJob extends S.Class<S3BucketCriteriaForJob>(
  "S3BucketCriteriaForJob",
)({
  excludes: S.optional(CriteriaBlockForJob).pipe(T.JsonName("excludes")),
  includes: S.optional(CriteriaBlockForJob).pipe(T.JsonName("includes")),
}) {}
export class SimpleScopeTerm extends S.Class<SimpleScopeTerm>(
  "SimpleScopeTerm",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  values: S.optional(__listOf__string).pipe(T.JsonName("values")),
}) {}
export class TagValuePair extends S.Class<TagValuePair>("TagValuePair")({
  key: S.optional(S.String).pipe(T.JsonName("key")),
  value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const __listOfTagValuePair = S.Array(TagValuePair);
export class TagScopeTerm extends S.Class<TagScopeTerm>("TagScopeTerm")({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  tagValues: S.optional(__listOfTagValuePair).pipe(T.JsonName("tagValues")),
  target: S.optional(S.String).pipe(T.JsonName("target")),
}) {}
export class JobScopeTerm extends S.Class<JobScopeTerm>("JobScopeTerm")({
  simpleScopeTerm: S.optional(SimpleScopeTerm).pipe(
    T.JsonName("simpleScopeTerm"),
  ),
  tagScopeTerm: S.optional(TagScopeTerm).pipe(T.JsonName("tagScopeTerm")),
}) {}
export const __listOfJobScopeTerm = S.Array(JobScopeTerm);
export class JobScopingBlock extends S.Class<JobScopingBlock>(
  "JobScopingBlock",
)({ and: S.optional(__listOfJobScopeTerm).pipe(T.JsonName("and")) }) {}
export class Scoping extends S.Class<Scoping>("Scoping")({
  excludes: S.optional(JobScopingBlock).pipe(T.JsonName("excludes")),
  includes: S.optional(JobScopingBlock).pipe(T.JsonName("includes")),
}) {}
export class S3JobDefinition extends S.Class<S3JobDefinition>(
  "S3JobDefinition",
)({
  bucketCriteria: S.optional(S3BucketCriteriaForJob).pipe(
    T.JsonName("bucketCriteria"),
  ),
  bucketDefinitions: S.optional(__listOfS3BucketDefinitionForJob).pipe(
    T.JsonName("bucketDefinitions"),
  ),
  scoping: S.optional(Scoping).pipe(T.JsonName("scoping")),
}) {}
export class DescribeClassificationJobResponse extends S.Class<DescribeClassificationJobResponse>(
  "DescribeClassificationJobResponse",
)({
  allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
  clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  customDataIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("customDataIdentifierIds"),
  ),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  initialRun: S.optional(S.Boolean).pipe(T.JsonName("initialRun")),
  jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
  jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  jobStatus: S.optional(S.String).pipe(T.JsonName("jobStatus")),
  jobType: S.optional(S.String).pipe(T.JsonName("jobType")),
  lastRunErrorStatus: S.optional(LastRunErrorStatus).pipe(
    T.JsonName("lastRunErrorStatus"),
  ),
  lastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastRunTime"),
  ),
  managedDataIdentifierIds: S.optional(__listOf__string).pipe(
    T.JsonName("managedDataIdentifierIds"),
  ),
  managedDataIdentifierSelector: S.optional(S.String).pipe(
    T.JsonName("managedDataIdentifierSelector"),
  ),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  s3JobDefinition: S.optional(S3JobDefinition).pipe(
    T.JsonName("s3JobDefinition"),
  ),
  samplingPercentage: S.optional(S.Number).pipe(
    T.JsonName("samplingPercentage"),
  ),
  scheduleFrequency: S.optional(JobScheduleFrequency).pipe(
    T.JsonName("scheduleFrequency"),
  ),
  statistics: S.optional(Statistics).pipe(T.JsonName("statistics")),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  userPausedDetails: S.optional(UserPausedDetails).pipe(
    T.JsonName("userPausedDetails"),
  ),
}) {}
export class GetAllowListResponse extends S.Class<GetAllowListResponse>(
  "GetAllowListResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  criteria: S.optional(AllowListCriteria).pipe(T.JsonName("criteria")),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  status: S.optional(AllowListStatus).pipe(T.JsonName("status")),
  tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export class GetClassificationExportConfigurationResponse extends S.Class<GetClassificationExportConfigurationResponse>(
  "GetClassificationExportConfigurationResponse",
)({
  configuration: S.optional(ClassificationExportConfiguration).pipe(
    T.JsonName("configuration"),
  ),
}) {}
export class GetResourceProfileResponse extends S.Class<GetResourceProfileResponse>(
  "GetResourceProfileResponse",
)({
  profileUpdatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("profileUpdatedAt")),
  sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
  sensitivityScoreOverridden: S.optional(S.Boolean).pipe(
    T.JsonName("sensitivityScoreOverridden"),
  ),
  statistics: S.optional(ResourceStatistics).pipe(T.JsonName("statistics")),
}) {}
export class GetUsageTotalsResponse extends S.Class<GetUsageTotalsResponse>(
  "GetUsageTotalsResponse",
)({
  timeRange: S.optional(S.String).pipe(T.JsonName("timeRange")),
  usageTotals: S.optional(__listOfUsageTotal).pipe(T.JsonName("usageTotals")),
}) {}
export class ListAllowListsResponse extends S.Class<ListAllowListsResponse>(
  "ListAllowListsResponse",
)({
  allowLists: S.optional(__listOfAllowListSummary).pipe(
    T.JsonName("allowLists"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListAutomatedDiscoveryAccountsResponse extends S.Class<ListAutomatedDiscoveryAccountsResponse>(
  "ListAutomatedDiscoveryAccountsResponse",
)({
  items: S.optional(__listOfAutomatedDiscoveryAccount).pipe(
    T.JsonName("items"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClassificationJobsRequest extends S.Class<ListClassificationJobsRequest>(
  "ListClassificationJobsRequest",
)(
  {
    filterCriteria: S.optional(ListJobsFilterCriteria).pipe(
      T.JsonName("filterCriteria"),
    ),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(ListJobsSortCriteria).pipe(
      T.JsonName("sortCriteria"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/jobs/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClassificationScopesResponse extends S.Class<ListClassificationScopesResponse>(
  "ListClassificationScopesResponse",
)({
  classificationScopes: S.optional(__listOfClassificationScopeSummary).pipe(
    T.JsonName("classificationScopes"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListCustomDataIdentifiersResponse extends S.Class<ListCustomDataIdentifiersResponse>(
  "ListCustomDataIdentifiersResponse",
)({
  items: S.optional(__listOfCustomDataIdentifierSummary).pipe(
    T.JsonName("items"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListFindingsFiltersResponse extends S.Class<ListFindingsFiltersResponse>(
  "ListFindingsFiltersResponse",
)({
  findingsFilterListItems: S.optional(__listOfFindingsFilterListItem).pipe(
    T.JsonName("findingsFilterListItems"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListManagedDataIdentifiersResponse extends S.Class<ListManagedDataIdentifiersResponse>(
  "ListManagedDataIdentifiersResponse",
)({
  items: S.optional(__listOfManagedDataIdentifierSummary).pipe(
    T.JsonName("items"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListMembersResponse extends S.Class<ListMembersResponse>(
  "ListMembersResponse",
)({
  members: S.optional(__listOfMember).pipe(T.JsonName("members")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListOrganizationAdminAccountsResponse extends S.Class<ListOrganizationAdminAccountsResponse>(
  "ListOrganizationAdminAccountsResponse",
)({
  adminAccounts: S.optional(__listOfAdminAccount).pipe(
    T.JsonName("adminAccounts"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListResourceProfileArtifactsResponse extends S.Class<ListResourceProfileArtifactsResponse>(
  "ListResourceProfileArtifactsResponse",
)({
  artifacts: S.optional(__listOfResourceProfileArtifact).pipe(
    T.JsonName("artifacts"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListResourceProfileDetectionsResponse extends S.Class<ListResourceProfileDetectionsResponse>(
  "ListResourceProfileDetectionsResponse",
)({
  detections: S.optional(__listOfDetection).pipe(T.JsonName("detections")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListSensitivityInspectionTemplatesResponse extends S.Class<ListSensitivityInspectionTemplatesResponse>(
  "ListSensitivityInspectionTemplatesResponse",
)({
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  sensitivityInspectionTemplates: S.optional(
    __listOfSensitivityInspectionTemplatesEntry,
  ).pipe(T.JsonName("sensitivityInspectionTemplates")),
}) {}
export class UpdateClassificationScopeRequest extends S.Class<UpdateClassificationScopeRequest>(
  "UpdateClassificationScopeRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    s3: S.optional(S3ClassificationScopeUpdate).pipe(T.JsonName("s3")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/classification-scopes/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateClassificationScopeResponse extends S.Class<UpdateClassificationScopeResponse>(
  "UpdateClassificationScopeResponse",
)({}) {}
export class UpdateRevealConfigurationResponse extends S.Class<UpdateRevealConfigurationResponse>(
  "UpdateRevealConfigurationResponse",
)({
  configuration: S.optional(RevealConfiguration).pipe(
    T.JsonName("configuration"),
  ),
  retrievalConfiguration: S.optional(RetrievalConfiguration).pipe(
    T.JsonName("retrievalConfiguration"),
  ),
}) {}
export class SensitivityAggregations extends S.Class<SensitivityAggregations>(
  "SensitivityAggregations",
)({
  classifiableSizeInBytes: S.optional(S.Number).pipe(
    T.JsonName("classifiableSizeInBytes"),
  ),
  publiclyAccessibleCount: S.optional(S.Number).pipe(
    T.JsonName("publiclyAccessibleCount"),
  ),
  totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
  totalSizeInBytes: S.optional(S.Number).pipe(T.JsonName("totalSizeInBytes")),
}) {}
export class S3ClassificationScopeExclusion extends S.Class<S3ClassificationScopeExclusion>(
  "S3ClassificationScopeExclusion",
)({ bucketNames: __listOfS3BucketName.pipe(T.JsonName("bucketNames")) }) {}
export class DetectedDataDetails extends S.Class<DetectedDataDetails>(
  "DetectedDataDetails",
)({ value: S.String.pipe(T.JsonName("value")) }) {}
export const __listOfDetectedDataDetails = S.Array(DetectedDataDetails);
export class SearchResourcesSimpleCriterion extends S.Class<SearchResourcesSimpleCriterion>(
  "SearchResourcesSimpleCriterion",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  values: S.optional(__listOf__string).pipe(T.JsonName("values")),
}) {}
export class AutomatedDiscoveryAccountUpdateError extends S.Class<AutomatedDiscoveryAccountUpdateError>(
  "AutomatedDiscoveryAccountUpdateError",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  errorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
}) {}
export const __listOfAutomatedDiscoveryAccountUpdateError = S.Array(
  AutomatedDiscoveryAccountUpdateError,
);
export class BucketStatisticsBySensitivity extends S.Class<BucketStatisticsBySensitivity>(
  "BucketStatisticsBySensitivity",
)({
  classificationError: S.optional(SensitivityAggregations).pipe(
    T.JsonName("classificationError"),
  ),
  notClassified: S.optional(SensitivityAggregations).pipe(
    T.JsonName("notClassified"),
  ),
  notSensitive: S.optional(SensitivityAggregations).pipe(
    T.JsonName("notSensitive"),
  ),
  sensitive: S.optional(SensitivityAggregations).pipe(T.JsonName("sensitive")),
}) {}
export class S3ClassificationScope extends S.Class<S3ClassificationScope>(
  "S3ClassificationScope",
)({ excludes: S3ClassificationScopeExclusion.pipe(T.JsonName("excludes")) }) {}
export class GroupCount extends S.Class<GroupCount>("GroupCount")({
  count: S.optional(S.Number).pipe(T.JsonName("count")),
  groupKey: S.optional(S.String).pipe(T.JsonName("groupKey")),
}) {}
export const __listOfGroupCount = S.Array(GroupCount);
export const SensitiveDataOccurrences = S.Record({
  key: S.String,
  value: __listOfDetectedDataDetails,
});
export class BatchUpdateAutomatedDiscoveryAccountsResponse extends S.Class<BatchUpdateAutomatedDiscoveryAccountsResponse>(
  "BatchUpdateAutomatedDiscoveryAccountsResponse",
)({
  errors: S.optional(__listOfAutomatedDiscoveryAccountUpdateError).pipe(
    T.JsonName("errors"),
  ),
}) {}
export class CreateAllowListResponse extends S.Class<CreateAllowListResponse>(
  "CreateAllowListResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class CreateFindingsFilterRequest extends S.Class<CreateFindingsFilterRequest>(
  "CreateFindingsFilterRequest",
)(
  {
    action: S.String.pipe(T.JsonName("action")),
    clientToken: S.optional(S.String).pipe(T.JsonName("clientToken")),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    findingCriteria: FindingCriteria.pipe(T.JsonName("findingCriteria")),
    name: S.String.pipe(T.JsonName("name")),
    position: S.optional(S.Number).pipe(T.JsonName("position")),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingsfilters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBucketStatisticsResponse extends S.Class<GetBucketStatisticsResponse>(
  "GetBucketStatisticsResponse",
)({
  bucketCount: S.optional(S.Number).pipe(T.JsonName("bucketCount")),
  bucketCountByEffectivePermission: S.optional(
    BucketCountByEffectivePermission,
  ).pipe(T.JsonName("bucketCountByEffectivePermission")),
  bucketCountByEncryptionType: S.optional(BucketCountByEncryptionType).pipe(
    T.JsonName("bucketCountByEncryptionType"),
  ),
  bucketCountByObjectEncryptionRequirement: S.optional(
    BucketCountPolicyAllowsUnencryptedObjectUploads,
  ).pipe(T.JsonName("bucketCountByObjectEncryptionRequirement")),
  bucketCountBySharedAccessType: S.optional(BucketCountBySharedAccessType).pipe(
    T.JsonName("bucketCountBySharedAccessType"),
  ),
  bucketStatisticsBySensitivity: S.optional(BucketStatisticsBySensitivity).pipe(
    T.JsonName("bucketStatisticsBySensitivity"),
  ),
  classifiableObjectCount: S.optional(S.Number).pipe(
    T.JsonName("classifiableObjectCount"),
  ),
  classifiableSizeInBytes: S.optional(S.Number).pipe(
    T.JsonName("classifiableSizeInBytes"),
  ),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdated"),
  ),
  objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
  sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
  sizeInBytesCompressed: S.optional(S.Number).pipe(
    T.JsonName("sizeInBytesCompressed"),
  ),
  unclassifiableObjectCount: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectCount"),
  ),
  unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectSizeInBytes"),
  ),
}) {}
export class GetClassificationScopeResponse extends S.Class<GetClassificationScopeResponse>(
  "GetClassificationScopeResponse",
)({
  id: S.optional(S.String).pipe(T.JsonName("id")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  s3: S.optional(S3ClassificationScope).pipe(T.JsonName("s3")),
}) {}
export class GetFindingStatisticsResponse extends S.Class<GetFindingStatisticsResponse>(
  "GetFindingStatisticsResponse",
)({
  countsByGroup: S.optional(__listOfGroupCount).pipe(
    T.JsonName("countsByGroup"),
  ),
}) {}
export class GetSensitiveDataOccurrencesResponse extends S.Class<GetSensitiveDataOccurrencesResponse>(
  "GetSensitiveDataOccurrencesResponse",
)({
  error: S.optional(S.String).pipe(T.JsonName("error")),
  sensitiveDataOccurrences: S.optional(SensitiveDataOccurrences).pipe(
    T.JsonName("sensitiveDataOccurrences"),
  ),
  status: S.optional(S.String).pipe(T.JsonName("status")),
}) {}
export class SearchResourcesTagCriterionPair extends S.Class<SearchResourcesTagCriterionPair>(
  "SearchResourcesTagCriterionPair",
)({
  key: S.optional(S.String).pipe(T.JsonName("key")),
  value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const __listOfSearchResourcesTagCriterionPair = S.Array(
  SearchResourcesTagCriterionPair,
);
export class Severity extends S.Class<Severity>("Severity")({
  description: S.optional(S.String).pipe(T.JsonName("description")),
  score: S.optional(S.Number).pipe(T.JsonName("score")),
}) {}
export class KeyValuePair extends S.Class<KeyValuePair>("KeyValuePair")({
  key: S.optional(S.String).pipe(T.JsonName("key")),
  value: S.optional(S.String).pipe(T.JsonName("value")),
}) {}
export const KeyValuePairList = S.Array(KeyValuePair);
export class SearchResourcesTagCriterion extends S.Class<SearchResourcesTagCriterion>(
  "SearchResourcesTagCriterion",
)({
  comparator: S.optional(S.String).pipe(T.JsonName("comparator")),
  tagValues: S.optional(__listOfSearchResourcesTagCriterionPair).pipe(
    T.JsonName("tagValues"),
  ),
}) {}
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  bucketCriteria: S.optional(S3BucketCriteriaForJob).pipe(
    T.JsonName("bucketCriteria"),
  ),
  bucketDefinitions: S.optional(__listOfS3BucketDefinitionForJob).pipe(
    T.JsonName("bucketDefinitions"),
  ),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  jobStatus: S.optional(S.String).pipe(T.JsonName("jobStatus")),
  jobType: S.optional(S.String).pipe(T.JsonName("jobType")),
  lastRunErrorStatus: S.optional(LastRunErrorStatus).pipe(
    T.JsonName("lastRunErrorStatus"),
  ),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  userPausedDetails: S.optional(UserPausedDetails).pipe(
    T.JsonName("userPausedDetails"),
  ),
}) {}
export const __listOfJobSummary = S.Array(JobSummary);
export class ServerSideEncryption extends S.Class<ServerSideEncryption>(
  "ServerSideEncryption",
)({
  encryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  kmsMasterKeyId: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyId")),
}) {}
export class S3Object extends S.Class<S3Object>("S3Object")({
  bucketArn: S.optional(S.String).pipe(T.JsonName("bucketArn")),
  eTag: S.optional(S.String).pipe(T.JsonName("eTag")),
  extension: S.optional(S.String).pipe(T.JsonName("extension")),
  key: S.optional(S.String).pipe(T.JsonName("key")),
  lastModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastModified"),
  ),
  path: S.optional(S.String).pipe(T.JsonName("path")),
  publicAccess: S.optional(S.Boolean).pipe(T.JsonName("publicAccess")),
  serverSideEncryption: S.optional(ServerSideEncryption).pipe(
    T.JsonName("serverSideEncryption"),
  ),
  size: S.optional(S.Number).pipe(T.JsonName("size")),
  storageClass: S.optional(S.String).pipe(T.JsonName("storageClass")),
  tags: S.optional(KeyValuePairList).pipe(T.JsonName("tags")),
  versionId: S.optional(S.String).pipe(T.JsonName("versionId")),
}) {}
export class ServiceLimit extends S.Class<ServiceLimit>("ServiceLimit")({
  isServiceLimited: S.optional(S.Boolean).pipe(T.JsonName("isServiceLimited")),
  unit: S.optional(S.String).pipe(T.JsonName("unit")),
  value: S.optional(S.Number).pipe(T.JsonName("value")),
}) {}
export class SearchResourcesCriteria extends S.Class<SearchResourcesCriteria>(
  "SearchResourcesCriteria",
)({
  simpleCriterion: S.optional(SearchResourcesSimpleCriterion).pipe(
    T.JsonName("simpleCriterion"),
  ),
  tagCriterion: S.optional(SearchResourcesTagCriterion).pipe(
    T.JsonName("tagCriterion"),
  ),
}) {}
export const __listOfSearchResourcesCriteria = S.Array(SearchResourcesCriteria);
export class CreateFindingsFilterResponse extends S.Class<CreateFindingsFilterResponse>(
  "CreateFindingsFilterResponse",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class ListClassificationJobsResponse extends S.Class<ListClassificationJobsResponse>(
  "ListClassificationJobsResponse",
)({
  items: S.optional(__listOfJobSummary).pipe(T.JsonName("items")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class JobDetails extends S.Class<JobDetails>("JobDetails")({
  isDefinedInJob: S.optional(S.String).pipe(T.JsonName("isDefinedInJob")),
  isMonitoredByJob: S.optional(S.String).pipe(T.JsonName("isMonitoredByJob")),
  lastJobId: S.optional(S.String).pipe(T.JsonName("lastJobId")),
  lastJobRunTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastJobRunTime"),
  ),
}) {}
export class ObjectCountByEncryptionType extends S.Class<ObjectCountByEncryptionType>(
  "ObjectCountByEncryptionType",
)({
  customerManaged: S.optional(S.Number).pipe(T.JsonName("customerManaged")),
  kmsManaged: S.optional(S.Number).pipe(T.JsonName("kmsManaged")),
  s3Managed: S.optional(S.Number).pipe(T.JsonName("s3Managed")),
  unencrypted: S.optional(S.Number).pipe(T.JsonName("unencrypted")),
  unknown: S.optional(S.Number).pipe(T.JsonName("unknown")),
}) {}
export class ReplicationDetails extends S.Class<ReplicationDetails>(
  "ReplicationDetails",
)({
  replicated: S.optional(S.Boolean).pipe(T.JsonName("replicated")),
  replicatedExternally: S.optional(S.Boolean).pipe(
    T.JsonName("replicatedExternally"),
  ),
  replicationAccounts: S.optional(__listOf__string).pipe(
    T.JsonName("replicationAccounts"),
  ),
}) {}
export class BucketServerSideEncryption extends S.Class<BucketServerSideEncryption>(
  "BucketServerSideEncryption",
)({
  kmsMasterKeyId: S.optional(S.String).pipe(T.JsonName("kmsMasterKeyId")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfKeyValuePair = S.Array(KeyValuePair);
export class UsageByAccount extends S.Class<UsageByAccount>("UsageByAccount")({
  currency: S.optional(S.String).pipe(T.JsonName("currency")),
  estimatedCost: S.optional(S.String).pipe(T.JsonName("estimatedCost")),
  serviceLimit: S.optional(ServiceLimit).pipe(T.JsonName("serviceLimit")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfUsageByAccount = S.Array(UsageByAccount);
export class SearchResourcesCriteriaBlock extends S.Class<SearchResourcesCriteriaBlock>(
  "SearchResourcesCriteriaBlock",
)({
  and: S.optional(__listOfSearchResourcesCriteria).pipe(T.JsonName("and")),
}) {}
export class ClassificationResultStatus extends S.Class<ClassificationResultStatus>(
  "ClassificationResultStatus",
)({
  code: S.optional(S.String).pipe(T.JsonName("code")),
  reason: S.optional(S.String).pipe(T.JsonName("reason")),
}) {}
export class ApiCallDetails extends S.Class<ApiCallDetails>("ApiCallDetails")({
  api: S.optional(S.String).pipe(T.JsonName("api")),
  apiServiceName: S.optional(S.String).pipe(T.JsonName("apiServiceName")),
  firstSeen: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("firstSeen"),
  ),
  lastSeen: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastSeen"),
  ),
}) {}
export class DomainDetails extends S.Class<DomainDetails>("DomainDetails")({
  domainName: S.optional(S.String).pipe(T.JsonName("domainName")),
}) {}
export class S3BucketOwner extends S.Class<S3BucketOwner>("S3BucketOwner")({
  displayName: S.optional(S.String).pipe(T.JsonName("displayName")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
}) {}
export class UsageRecord extends S.Class<UsageRecord>("UsageRecord")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  automatedDiscoveryFreeTrialStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("automatedDiscoveryFreeTrialStartDate")),
  freeTrialStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("freeTrialStartDate")),
  usage: S.optional(__listOfUsageByAccount).pipe(T.JsonName("usage")),
}) {}
export const __listOfUsageRecord = S.Array(UsageRecord);
export class SearchResourcesBucketCriteria extends S.Class<SearchResourcesBucketCriteria>(
  "SearchResourcesBucketCriteria",
)({
  excludes: S.optional(SearchResourcesCriteriaBlock).pipe(
    T.JsonName("excludes"),
  ),
  includes: S.optional(SearchResourcesCriteriaBlock).pipe(
    T.JsonName("includes"),
  ),
}) {}
export class FindingAction extends S.Class<FindingAction>("FindingAction")({
  actionType: S.optional(S.String).pipe(T.JsonName("actionType")),
  apiCallDetails: S.optional(ApiCallDetails).pipe(T.JsonName("apiCallDetails")),
}) {}
export class BlockPublicAccess extends S.Class<BlockPublicAccess>(
  "BlockPublicAccess",
)({
  blockPublicAcls: S.optional(S.Boolean).pipe(T.JsonName("blockPublicAcls")),
  blockPublicPolicy: S.optional(S.Boolean).pipe(
    T.JsonName("blockPublicPolicy"),
  ),
  ignorePublicAcls: S.optional(S.Boolean).pipe(T.JsonName("ignorePublicAcls")),
  restrictPublicBuckets: S.optional(S.Boolean).pipe(
    T.JsonName("restrictPublicBuckets"),
  ),
}) {}
export class AccountLevelPermissions extends S.Class<AccountLevelPermissions>(
  "AccountLevelPermissions",
)({
  blockPublicAccess: S.optional(BlockPublicAccess).pipe(
    T.JsonName("blockPublicAccess"),
  ),
}) {}
export class AccessControlList extends S.Class<AccessControlList>(
  "AccessControlList",
)({
  allowsPublicReadAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicReadAccess"),
  ),
  allowsPublicWriteAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicWriteAccess"),
  ),
}) {}
export class BucketPolicy extends S.Class<BucketPolicy>("BucketPolicy")({
  allowsPublicReadAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicReadAccess"),
  ),
  allowsPublicWriteAccess: S.optional(S.Boolean).pipe(
    T.JsonName("allowsPublicWriteAccess"),
  ),
}) {}
export class BucketLevelPermissions extends S.Class<BucketLevelPermissions>(
  "BucketLevelPermissions",
)({
  accessControlList: S.optional(AccessControlList).pipe(
    T.JsonName("accessControlList"),
  ),
  blockPublicAccess: S.optional(BlockPublicAccess).pipe(
    T.JsonName("blockPublicAccess"),
  ),
  bucketPolicy: S.optional(BucketPolicy).pipe(T.JsonName("bucketPolicy")),
}) {}
export class BucketPermissionConfiguration extends S.Class<BucketPermissionConfiguration>(
  "BucketPermissionConfiguration",
)({
  accountLevelPermissions: S.optional(AccountLevelPermissions).pipe(
    T.JsonName("accountLevelPermissions"),
  ),
  bucketLevelPermissions: S.optional(BucketLevelPermissions).pipe(
    T.JsonName("bucketLevelPermissions"),
  ),
}) {}
export class BucketPublicAccess extends S.Class<BucketPublicAccess>(
  "BucketPublicAccess",
)({
  effectivePermission: S.optional(S.String).pipe(
    T.JsonName("effectivePermission"),
  ),
  permissionConfiguration: S.optional(BucketPermissionConfiguration).pipe(
    T.JsonName("permissionConfiguration"),
  ),
}) {}
export class S3Bucket extends S.Class<S3Bucket>("S3Bucket")({
  allowsUnencryptedObjectUploads: S.optional(S.String).pipe(
    T.JsonName("allowsUnencryptedObjectUploads"),
  ),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  defaultServerSideEncryption: S.optional(ServerSideEncryption).pipe(
    T.JsonName("defaultServerSideEncryption"),
  ),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  owner: S.optional(S3BucketOwner).pipe(T.JsonName("owner")),
  publicAccess: S.optional(BucketPublicAccess).pipe(T.JsonName("publicAccess")),
  tags: S.optional(KeyValuePairList).pipe(T.JsonName("tags")),
}) {}
export class Cell extends S.Class<Cell>("Cell")({
  cellReference: S.optional(S.String).pipe(T.JsonName("cellReference")),
  column: S.optional(S.Number).pipe(T.JsonName("column")),
  columnName: S.optional(S.String).pipe(T.JsonName("columnName")),
  row: S.optional(S.Number).pipe(T.JsonName("row")),
}) {}
export const Cells = S.Array(Cell);
export class Range extends S.Class<Range>("Range")({
  end: S.optional(S.Number).pipe(T.JsonName("end")),
  start: S.optional(S.Number).pipe(T.JsonName("start")),
  startColumn: S.optional(S.Number).pipe(T.JsonName("startColumn")),
}) {}
export const Ranges = S.Array(Range);
export class Page extends S.Class<Page>("Page")({
  lineRange: S.optional(Range).pipe(T.JsonName("lineRange")),
  offsetRange: S.optional(Range).pipe(T.JsonName("offsetRange")),
  pageNumber: S.optional(S.Number).pipe(T.JsonName("pageNumber")),
}) {}
export const Pages = S.Array(Page);
export class Record extends S.Class<Record>("Record")({
  jsonPath: S.optional(S.String).pipe(T.JsonName("jsonPath")),
  recordIndex: S.optional(S.Number).pipe(T.JsonName("recordIndex")),
}) {}
export const Records = S.Array(Record);
export class Occurrences extends S.Class<Occurrences>("Occurrences")({
  cells: S.optional(Cells).pipe(T.JsonName("cells")),
  lineRanges: S.optional(Ranges).pipe(T.JsonName("lineRanges")),
  offsetRanges: S.optional(Ranges).pipe(T.JsonName("offsetRanges")),
  pages: S.optional(Pages).pipe(T.JsonName("pages")),
  records: S.optional(Records).pipe(T.JsonName("records")),
}) {}
export class DefaultDetection extends S.Class<DefaultDetection>(
  "DefaultDetection",
)({
  count: S.optional(S.Number).pipe(T.JsonName("count")),
  occurrences: S.optional(Occurrences).pipe(T.JsonName("occurrences")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const DefaultDetections = S.Array(DefaultDetection);
export class IpCity extends S.Class<IpCity>("IpCity")({
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class IpCountry extends S.Class<IpCountry>("IpCountry")({
  code: S.optional(S.String).pipe(T.JsonName("code")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export class IpGeoLocation extends S.Class<IpGeoLocation>("IpGeoLocation")({
  lat: S.optional(S.Number).pipe(T.JsonName("lat")),
  lon: S.optional(S.Number).pipe(T.JsonName("lon")),
}) {}
export class IpOwner extends S.Class<IpOwner>("IpOwner")({
  asn: S.optional(S.String).pipe(T.JsonName("asn")),
  asnOrg: S.optional(S.String).pipe(T.JsonName("asnOrg")),
  isp: S.optional(S.String).pipe(T.JsonName("isp")),
  org: S.optional(S.String).pipe(T.JsonName("org")),
}) {}
export class AwsAccount extends S.Class<AwsAccount>("AwsAccount")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
}) {}
export class AwsService extends S.Class<AwsService>("AwsService")({
  invokedBy: S.optional(S.String).pipe(T.JsonName("invokedBy")),
}) {}
export class SessionContextAttributes extends S.Class<SessionContextAttributes>(
  "SessionContextAttributes",
)({
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("creationDate"),
  ),
  mfaAuthenticated: S.optional(S.Boolean).pipe(T.JsonName("mfaAuthenticated")),
}) {}
export class SessionIssuer extends S.Class<SessionIssuer>("SessionIssuer")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
  userName: S.optional(S.String).pipe(T.JsonName("userName")),
}) {}
export class SessionContext extends S.Class<SessionContext>("SessionContext")({
  attributes: S.optional(SessionContextAttributes).pipe(
    T.JsonName("attributes"),
  ),
  sessionIssuer: S.optional(SessionIssuer).pipe(T.JsonName("sessionIssuer")),
}) {}
export class FederatedUser extends S.Class<FederatedUser>("FederatedUser")({
  accessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  sessionContext: S.optional(SessionContext).pipe(T.JsonName("sessionContext")),
}) {}
export class IamUser extends S.Class<IamUser>("IamUser")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  userName: S.optional(S.String).pipe(T.JsonName("userName")),
}) {}
export class UserIdentityRoot extends S.Class<UserIdentityRoot>(
  "UserIdentityRoot",
)({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
}) {}
export class GetUsageStatisticsResponse extends S.Class<GetUsageStatisticsResponse>(
  "GetUsageStatisticsResponse",
)({
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  records: S.optional(__listOfUsageRecord).pipe(T.JsonName("records")),
  timeRange: S.optional(S.String).pipe(T.JsonName("timeRange")),
}) {}
export class SearchResourcesRequest extends S.Class<SearchResourcesRequest>(
  "SearchResourcesRequest",
)(
  {
    bucketCriteria: S.optional(SearchResourcesBucketCriteria).pipe(
      T.JsonName("bucketCriteria"),
    ),
    maxResults: S.optional(S.Number).pipe(T.JsonName("maxResults")),
    nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
    sortCriteria: S.optional(SearchResourcesSortCriteria).pipe(
      T.JsonName("sortCriteria"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasources/search-resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResourcesAffected extends S.Class<ResourcesAffected>(
  "ResourcesAffected",
)({
  s3Bucket: S.optional(S3Bucket).pipe(T.JsonName("s3Bucket")),
  s3Object: S.optional(S3Object).pipe(T.JsonName("s3Object")),
}) {}
export class SensitiveDataItem extends S.Class<SensitiveDataItem>(
  "SensitiveDataItem",
)({
  category: S.optional(S.String).pipe(T.JsonName("category")),
  detections: S.optional(DefaultDetections).pipe(T.JsonName("detections")),
  totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
}) {}
export const SensitiveData = S.Array(SensitiveDataItem);
export class IpAddressDetails extends S.Class<IpAddressDetails>(
  "IpAddressDetails",
)({
  ipAddressV4: S.optional(S.String).pipe(T.JsonName("ipAddressV4")),
  ipCity: S.optional(IpCity).pipe(T.JsonName("ipCity")),
  ipCountry: S.optional(IpCountry).pipe(T.JsonName("ipCountry")),
  ipGeoLocation: S.optional(IpGeoLocation).pipe(T.JsonName("ipGeoLocation")),
  ipOwner: S.optional(IpOwner).pipe(T.JsonName("ipOwner")),
}) {}
export class CreateClassificationJobRequest extends S.Class<CreateClassificationJobRequest>(
  "CreateClassificationJobRequest",
)(
  {
    allowListIds: S.optional(__listOf__string).pipe(T.JsonName("allowListIds")),
    clientToken: S.String.pipe(T.JsonName("clientToken")),
    customDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("customDataIdentifierIds"),
    ),
    description: S.optional(S.String).pipe(T.JsonName("description")),
    initialRun: S.optional(S.Boolean).pipe(T.JsonName("initialRun")),
    jobType: S.String.pipe(T.JsonName("jobType")),
    managedDataIdentifierIds: S.optional(__listOf__string).pipe(
      T.JsonName("managedDataIdentifierIds"),
    ),
    managedDataIdentifierSelector: S.optional(S.String).pipe(
      T.JsonName("managedDataIdentifierSelector"),
    ),
    name: S.String.pipe(T.JsonName("name")),
    s3JobDefinition: S3JobDefinition.pipe(T.JsonName("s3JobDefinition")),
    samplingPercentage: S.optional(S.Number).pipe(
      T.JsonName("samplingPercentage"),
    ),
    scheduleFrequency: S.optional(JobScheduleFrequency).pipe(
      T.JsonName("scheduleFrequency"),
    ),
    tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  },
  T.all(T.Http({ method: "POST", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class CreateClassificationJobResponse extends S.Class<CreateClassificationJobResponse>(
  "CreateClassificationJobResponse",
)({
  jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
  jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
}) {}
export class CustomDetection extends S.Class<CustomDetection>(
  "CustomDetection",
)({
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  count: S.optional(S.Number).pipe(T.JsonName("count")),
  name: S.optional(S.String).pipe(T.JsonName("name")),
  occurrences: S.optional(Occurrences).pipe(T.JsonName("occurrences")),
}) {}
export const CustomDetections = S.Array(CustomDetection);
export class AssumedRole extends S.Class<AssumedRole>("AssumedRole")({
  accessKeyId: S.optional(S.String).pipe(T.JsonName("accessKeyId")),
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  arn: S.optional(S.String).pipe(T.JsonName("arn")),
  principalId: S.optional(S.String).pipe(T.JsonName("principalId")),
  sessionContext: S.optional(SessionContext).pipe(T.JsonName("sessionContext")),
}) {}
export class MatchingBucket extends S.Class<MatchingBucket>("MatchingBucket")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  automatedDiscoveryMonitoringStatus: S.optional(S.String).pipe(
    T.JsonName("automatedDiscoveryMonitoringStatus"),
  ),
  bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
  classifiableObjectCount: S.optional(S.Number).pipe(
    T.JsonName("classifiableObjectCount"),
  ),
  classifiableSizeInBytes: S.optional(S.Number).pipe(
    T.JsonName("classifiableSizeInBytes"),
  ),
  errorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  jobDetails: S.optional(JobDetails).pipe(T.JsonName("jobDetails")),
  lastAutomatedDiscoveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastAutomatedDiscoveryTime")),
  objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
  objectCountByEncryptionType: S.optional(ObjectCountByEncryptionType).pipe(
    T.JsonName("objectCountByEncryptionType"),
  ),
  sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
  sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
  sizeInBytesCompressed: S.optional(S.Number).pipe(
    T.JsonName("sizeInBytesCompressed"),
  ),
  unclassifiableObjectCount: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectCount"),
  ),
  unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectSizeInBytes"),
  ),
}) {}
export class CustomDataIdentifiers extends S.Class<CustomDataIdentifiers>(
  "CustomDataIdentifiers",
)({
  detections: S.optional(CustomDetections).pipe(T.JsonName("detections")),
  totalCount: S.optional(S.Number).pipe(T.JsonName("totalCount")),
}) {}
export class UserIdentity extends S.Class<UserIdentity>("UserIdentity")({
  assumedRole: S.optional(AssumedRole).pipe(T.JsonName("assumedRole")),
  awsAccount: S.optional(AwsAccount).pipe(T.JsonName("awsAccount")),
  awsService: S.optional(AwsService).pipe(T.JsonName("awsService")),
  federatedUser: S.optional(FederatedUser).pipe(T.JsonName("federatedUser")),
  iamUser: S.optional(IamUser).pipe(T.JsonName("iamUser")),
  root: S.optional(UserIdentityRoot).pipe(T.JsonName("root")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class BucketMetadata extends S.Class<BucketMetadata>("BucketMetadata")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  allowsUnencryptedObjectUploads: S.optional(S.String).pipe(
    T.JsonName("allowsUnencryptedObjectUploads"),
  ),
  automatedDiscoveryMonitoringStatus: S.optional(S.String).pipe(
    T.JsonName("automatedDiscoveryMonitoringStatus"),
  ),
  bucketArn: S.optional(S.String).pipe(T.JsonName("bucketArn")),
  bucketCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("bucketCreatedAt"),
  ),
  bucketName: S.optional(S.String).pipe(T.JsonName("bucketName")),
  classifiableObjectCount: S.optional(S.Number).pipe(
    T.JsonName("classifiableObjectCount"),
  ),
  classifiableSizeInBytes: S.optional(S.Number).pipe(
    T.JsonName("classifiableSizeInBytes"),
  ),
  errorCode: S.optional(S.String).pipe(T.JsonName("errorCode")),
  errorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  jobDetails: S.optional(JobDetails).pipe(T.JsonName("jobDetails")),
  lastAutomatedDiscoveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastAutomatedDiscoveryTime")),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("lastUpdated"),
  ),
  objectCount: S.optional(S.Number).pipe(T.JsonName("objectCount")),
  objectCountByEncryptionType: S.optional(ObjectCountByEncryptionType).pipe(
    T.JsonName("objectCountByEncryptionType"),
  ),
  publicAccess: S.optional(BucketPublicAccess).pipe(T.JsonName("publicAccess")),
  region: S.optional(S.String).pipe(T.JsonName("region")),
  replicationDetails: S.optional(ReplicationDetails).pipe(
    T.JsonName("replicationDetails"),
  ),
  sensitivityScore: S.optional(S.Number).pipe(T.JsonName("sensitivityScore")),
  serverSideEncryption: S.optional(BucketServerSideEncryption).pipe(
    T.JsonName("serverSideEncryption"),
  ),
  sharedAccess: S.optional(S.String).pipe(T.JsonName("sharedAccess")),
  sizeInBytes: S.optional(S.Number).pipe(T.JsonName("sizeInBytes")),
  sizeInBytesCompressed: S.optional(S.Number).pipe(
    T.JsonName("sizeInBytesCompressed"),
  ),
  tags: S.optional(__listOfKeyValuePair).pipe(T.JsonName("tags")),
  unclassifiableObjectCount: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectCount"),
  ),
  unclassifiableObjectSizeInBytes: S.optional(ObjectLevelStatistics).pipe(
    T.JsonName("unclassifiableObjectSizeInBytes"),
  ),
  versioning: S.optional(S.Boolean).pipe(T.JsonName("versioning")),
}) {}
export const __listOfBucketMetadata = S.Array(BucketMetadata);
export class MatchingResource extends S.Class<MatchingResource>(
  "MatchingResource",
)({
  matchingBucket: S.optional(MatchingBucket).pipe(T.JsonName("matchingBucket")),
}) {}
export const __listOfMatchingResource = S.Array(MatchingResource);
export class ClassificationResult extends S.Class<ClassificationResult>(
  "ClassificationResult",
)({
  additionalOccurrences: S.optional(S.Boolean).pipe(
    T.JsonName("additionalOccurrences"),
  ),
  customDataIdentifiers: S.optional(CustomDataIdentifiers).pipe(
    T.JsonName("customDataIdentifiers"),
  ),
  mimeType: S.optional(S.String).pipe(T.JsonName("mimeType")),
  sensitiveData: S.optional(SensitiveData).pipe(T.JsonName("sensitiveData")),
  sizeClassified: S.optional(S.Number).pipe(T.JsonName("sizeClassified")),
  status: S.optional(ClassificationResultStatus).pipe(T.JsonName("status")),
}) {}
export class FindingActor extends S.Class<FindingActor>("FindingActor")({
  domainDetails: S.optional(DomainDetails).pipe(T.JsonName("domainDetails")),
  ipAddressDetails: S.optional(IpAddressDetails).pipe(
    T.JsonName("ipAddressDetails"),
  ),
  userIdentity: S.optional(UserIdentity).pipe(T.JsonName("userIdentity")),
}) {}
export class DescribeBucketsResponse extends S.Class<DescribeBucketsResponse>(
  "DescribeBucketsResponse",
)({
  buckets: S.optional(__listOfBucketMetadata).pipe(T.JsonName("buckets")),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class SearchResourcesResponse extends S.Class<SearchResourcesResponse>(
  "SearchResourcesResponse",
)({
  matchingResources: S.optional(__listOfMatchingResource).pipe(
    T.JsonName("matchingResources"),
  ),
  nextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ClassificationDetails extends S.Class<ClassificationDetails>(
  "ClassificationDetails",
)({
  detailedResultsLocation: S.optional(S.String).pipe(
    T.JsonName("detailedResultsLocation"),
  ),
  jobArn: S.optional(S.String).pipe(T.JsonName("jobArn")),
  jobId: S.optional(S.String).pipe(T.JsonName("jobId")),
  originType: S.optional(S.String).pipe(T.JsonName("originType")),
  result: S.optional(ClassificationResult).pipe(T.JsonName("result")),
}) {}
export class PolicyDetails extends S.Class<PolicyDetails>("PolicyDetails")({
  action: S.optional(FindingAction).pipe(T.JsonName("action")),
  actor: S.optional(FindingActor).pipe(T.JsonName("actor")),
}) {}
export class Finding extends S.Class<Finding>("Finding")({
  accountId: S.optional(S.String).pipe(T.JsonName("accountId")),
  archived: S.optional(S.Boolean).pipe(T.JsonName("archived")),
  category: S.optional(S.String).pipe(T.JsonName("category")),
  classificationDetails: S.optional(ClassificationDetails).pipe(
    T.JsonName("classificationDetails"),
  ),
  count: S.optional(S.Number).pipe(T.JsonName("count")),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  description: S.optional(S.String).pipe(T.JsonName("description")),
  id: S.optional(S.String).pipe(T.JsonName("id")),
  partition: S.optional(S.String).pipe(T.JsonName("partition")),
  policyDetails: S.optional(PolicyDetails).pipe(T.JsonName("policyDetails")),
  region: S.optional(S.String).pipe(T.JsonName("region")),
  resourcesAffected: S.optional(ResourcesAffected).pipe(
    T.JsonName("resourcesAffected"),
  ),
  sample: S.optional(S.Boolean).pipe(T.JsonName("sample")),
  schemaVersion: S.optional(S.String).pipe(T.JsonName("schemaVersion")),
  severity: S.optional(Severity).pipe(T.JsonName("severity")),
  title: S.optional(S.String).pipe(T.JsonName("title")),
  type: S.optional(S.String).pipe(T.JsonName("type")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("updatedAt"),
  ),
}) {}
export const __listOfFinding = S.Array(Finding);
export class GetFindingsResponse extends S.Class<GetFindingsResponse>(
  "GetFindingsResponse",
)({ findings: S.optional(__listOfFinding).pipe(T.JsonName("findings")) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
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
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
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
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { message: S.String.pipe(T.JsonName("message")) },
) {}

//# Operations
/**
 * Deletes a findings filter.
 */
export const deleteFindingsFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFindingsFilterRequest,
    output: DeleteFindingsFilterResponse,
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
 * Deletes the association between an Amazon Macie administrator account and an account.
 */
export const deleteMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemberRequest,
  output: DeleteMemberResponse,
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
 * Retrieves the Amazon Macie configuration settings for an organization in Organizations.
 */
export const describeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConfigurationRequest,
    output: DescribeOrganizationConfigurationResponse,
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
 * Disables Amazon Macie and deletes all settings and resources for a Macie account.
 */
export const disableMacie = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableMacieRequest,
  output: DisableMacieResponse,
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
 * Disables an account as the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const disableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableOrganizationAdminAccountRequest,
    output: DisableOrganizationAdminAccountResponse,
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
 * Disassociates a member account from its Amazon Macie administrator account.
 */
export const disassociateFromAdministratorAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromAdministratorAccountRequest,
    output: DisassociateFromAdministratorAccountResponse,
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
 * (Deprecated) Disassociates a member account from its Amazon Macie administrator account. This operation has been replaced by the DisassociateFromAdministratorAccount operation.
 */
export const disassociateFromMasterAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromMasterAccountRequest,
    output: DisassociateFromMasterAccountResponse,
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
 * Disassociates an Amazon Macie administrator account from a member account.
 */
export const disassociateMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMemberRequest,
  output: DisassociateMemberResponse,
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
 * Enables Amazon Macie and specifies the configuration settings for a Macie account.
 */
export const enableMacie = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableMacieRequest,
  output: EnableMacieResponse,
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
 * Designates an account as the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const enableOrganizationAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableOrganizationAdminAccountRequest,
    output: EnableOrganizationAdminAccountResponse,
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
 * Retrieves the configuration settings and status of automated sensitive data discovery for an organization or standalone account.
 */
export const getAutomatedDiscoveryConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutomatedDiscoveryConfigurationRequest,
    output: GetAutomatedDiscoveryConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the count of Amazon Macie membership invitations that were received by an account.
 */
export const getInvitationsCount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInvitationsCountRequest,
  output: GetInvitationsCountResponse,
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
 * Retrieves the status and configuration settings for an Amazon Macie account.
 */
export const getMacieSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMacieSessionRequest,
  output: GetMacieSessionResponse,
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
 * (Deprecated) Retrieves information about the Amazon Macie administrator account for an account. This operation has been replaced by the GetAdministratorAccount operation.
 */
export const getMasterAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMasterAccountRequest,
  output: GetMasterAccountResponse,
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
 * Updates the configuration settings for publishing findings to Security Hub.
 */
export const putFindingsPublicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutFindingsPublicationConfigurationRequest,
    output: PutFindingsPublicationConfigurationResponse,
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
 * Adds or updates one or more tags (keys and values) that are associated with an Amazon Macie resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Removes one or more tags (keys and values) from an Amazon Macie resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Changes the configuration settings and status of automated sensitive data discovery for an organization or standalone account.
 */
export const updateAutomatedDiscoveryConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateAutomatedDiscoveryConfigurationRequest,
    output: UpdateAutomatedDiscoveryConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Changes the status of a classification job.
 */
export const updateClassificationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClassificationJobRequest,
    output: UpdateClassificationJobResponse,
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
 * Suspends or re-enables Amazon Macie, or updates the configuration settings for a Macie account.
 */
export const updateMacieSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMacieSessionRequest,
  output: UpdateMacieSessionResponse,
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
 * Enables an Amazon Macie administrator to suspend or re-enable Macie for a member account.
 */
export const updateMemberSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMemberSessionRequest,
  output: UpdateMemberSessionResponse,
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
 * Updates the Amazon Macie configuration settings for an organization in Organizations.
 */
export const updateOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrganizationConfigurationRequest,
    output: UpdateOrganizationConfigurationResponse,
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
 * Updates the sensitivity score for an S3 bucket.
 */
export const updateResourceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourceProfileRequest,
    output: UpdateResourceProfileResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Accepts an Amazon Macie membership invitation that was received from a specific account.
 */
export const acceptInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptInvitationRequest,
  output: AcceptInvitationResponse,
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
 * Creates sample findings.
 */
export const createSampleFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSampleFindingsRequest,
    output: CreateSampleFindingsResponse,
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
 * Declines Amazon Macie membership invitations that were received from specific accounts.
 */
export const declineInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeclineInvitationsRequest,
  output: DeclineInvitationsResponse,
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
 * Deletes an allow list.
 */
export const deleteAllowList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAllowListRequest,
  output: DeleteAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Soft deletes a custom data identifier.
 */
export const deleteCustomDataIdentifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomDataIdentifierRequest,
    output: DeleteCustomDataIdentifierResponse,
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
 * Deletes Amazon Macie membership invitations that were received from specific accounts.
 */
export const deleteInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInvitationsRequest,
  output: DeleteInvitationsResponse,
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
 * Retrieves information about the Amazon Macie administrator account for an account.
 */
export const getAdministratorAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAdministratorAccountRequest,
    output: GetAdministratorAccountResponse,
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
 * Retrieves the criteria and other settings for a custom data identifier.
 */
export const getCustomDataIdentifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCustomDataIdentifierRequest,
    output: GetCustomDataIdentifierResponse,
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
 * Retrieves the criteria and other settings for a findings filter.
 */
export const getFindingsFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsFilterRequest,
  output: GetFindingsFilterResponse,
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
 * Retrieves the configuration settings for publishing findings to Security Hub.
 */
export const getFindingsPublicationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetFindingsPublicationConfigurationRequest,
    output: GetFindingsPublicationConfigurationResponse,
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
 * Retrieves information about an account that's associated with an Amazon Macie administrator account.
 */
export const getMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberRequest,
  output: GetMemberResponse,
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
 * Retrieves the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
 */
export const getRevealConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRevealConfigurationRequest,
    output: GetRevealConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Checks whether occurrences of sensitive data can be retrieved for a finding.
 */
export const getSensitiveDataOccurrencesAvailability =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSensitiveDataOccurrencesAvailabilityRequest,
    output: GetSensitiveDataOccurrencesAvailabilityResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the settings for the sensitivity inspection template for an account.
 */
export const getSensitivityInspectionTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSensitivityInspectionTemplateRequest,
    output: GetSensitivityInspectionTemplateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a subset of information about one or more findings.
 */
export const listFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
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
 * Retrieves information about Amazon Macie membership invitations that were received by an account.
 */
export const listInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInvitationsRequest,
  output: ListInvitationsResponse,
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
 * Retrieves the tags (keys and values) that are associated with an Amazon Macie resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Adds or updates the configuration settings for storing data classification results.
 */
export const putClassificationExportConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutClassificationExportConfigurationRequest,
    output: PutClassificationExportConfigurationResponse,
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
 * Tests criteria for a custom data identifier.
 */
export const testCustomDataIdentifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestCustomDataIdentifierRequest,
    output: TestCustomDataIdentifierResponse,
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
 * Updates the settings for an allow list.
 */
export const updateAllowList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAllowListRequest,
  output: UpdateAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the criteria and other settings for a findings filter.
 */
export const updateFindingsFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFindingsFilterRequest,
    output: UpdateFindingsFilterResponse,
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
 * Updates the sensitivity scoring settings for an S3 bucket.
 */
export const updateResourceProfileDetections =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateResourceProfileDetectionsRequest,
    output: UpdateResourceProfileDetectionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the settings for the sensitivity inspection template for an account.
 */
export const updateSensitivityInspectionTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSensitivityInspectionTemplateRequest,
    output: UpdateSensitivityInspectionTemplateResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about one or more custom data identifiers.
 */
export const batchGetCustomDataIdentifiers =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetCustomDataIdentifiersRequest,
    output: BatchGetCustomDataIdentifiersResponse,
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
 * Creates and defines the criteria and other settings for a custom data identifier.
 */
export const createCustomDataIdentifier = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomDataIdentifierRequest,
    output: CreateCustomDataIdentifierResponse,
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
 * Sends an Amazon Macie membership invitation to one or more accounts.
 */
export const createInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInvitationsRequest,
  output: CreateInvitationsResponse,
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
 * Associates an account with an Amazon Macie administrator account.
 */
export const createMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMemberRequest,
  output: CreateMemberResponse,
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
 * Retrieves the status and settings for a classification job.
 */
export const describeClassificationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClassificationJobRequest,
    output: DescribeClassificationJobResponse,
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
 * Retrieves the settings and status of an allow list.
 */
export const getAllowList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAllowListRequest,
  output: GetAllowListResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the configuration settings for storing data classification results.
 */
export const getClassificationExportConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetClassificationExportConfigurationRequest,
    output: GetClassificationExportConfigurationResponse,
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
 * Retrieves (queries) sensitive data discovery statistics and the sensitivity score for an S3 bucket.
 */
export const getResourceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceProfileRequest,
  output: GetResourceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves (queries) aggregated usage data for an account.
 */
export const getUsageTotals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageTotalsRequest,
  output: GetUsageTotalsResponse,
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
 * Retrieves a subset of information about all the allow lists for an account.
 */
export const listAllowLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAllowListsRequest,
  output: ListAllowListsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status of automated sensitive data discovery for one or more accounts.
 */
export const listAutomatedDiscoveryAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAutomatedDiscoveryAccountsRequest,
    output: ListAutomatedDiscoveryAccountsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a subset of information about the classification scope for an account.
 */
export const listClassificationScopes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClassificationScopesRequest,
    output: ListClassificationScopesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a subset of information about the custom data identifiers for an account.
 */
export const listCustomDataIdentifiers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCustomDataIdentifiersRequest,
    output: ListCustomDataIdentifiersResponse,
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
 * Retrieves a subset of information about all the findings filters for an account.
 */
export const listFindingsFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsFiltersRequest,
  output: ListFindingsFiltersResponse,
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
 * Retrieves information about all the managed data identifiers that Amazon Macie currently provides.
 */
export const listManagedDataIdentifiers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListManagedDataIdentifiersRequest,
    output: ListManagedDataIdentifiersResponse,
    errors: [],
  }),
);
/**
 * Retrieves information about the accounts that are associated with an Amazon Macie administrator account.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
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
 * Retrieves information about the delegated Amazon Macie administrator account for an organization in Organizations.
 */
export const listOrganizationAdminAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListOrganizationAdminAccountsRequest,
    output: ListOrganizationAdminAccountsResponse,
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
 * Retrieves information about objects that Amazon Macie selected from an S3 bucket for automated sensitive data discovery.
 */
export const listResourceProfileArtifacts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourceProfileArtifactsRequest,
    output: ListResourceProfileArtifactsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the types and amount of sensitive data that Amazon Macie found in an S3 bucket.
 */
export const listResourceProfileDetections =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourceProfileDetectionsRequest,
    output: ListResourceProfileDetectionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a subset of information about the sensitivity inspection template for an account.
 */
export const listSensitivityInspectionTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListSensitivityInspectionTemplatesRequest,
    output: ListSensitivityInspectionTemplatesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the classification scope settings for an account.
 */
export const updateClassificationScope = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClassificationScopeRequest,
    output: UpdateClassificationScopeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the status and configuration settings for retrieving occurrences of sensitive data reported by findings.
 */
export const updateRevealConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRevealConfigurationRequest,
    output: UpdateRevealConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Changes the status of automated sensitive data discovery for one or more accounts.
 */
export const batchUpdateAutomatedDiscoveryAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateAutomatedDiscoveryAccountsRequest,
    output: BatchUpdateAutomatedDiscoveryAccountsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates and defines the settings for an allow list.
 */
export const createAllowList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAllowListRequest,
  output: CreateAllowListResponse,
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
 * Retrieves (queries) aggregated statistical data about all the S3 buckets that Amazon Macie monitors and analyzes for an account.
 */
export const getBucketStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBucketStatisticsRequest,
  output: GetBucketStatisticsResponse,
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
 * Retrieves the classification scope settings for an account.
 */
export const getClassificationScope = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetClassificationScopeRequest,
    output: GetClassificationScopeResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves (queries) aggregated statistical data about findings.
 */
export const getFindingStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingStatisticsRequest,
    output: GetFindingStatisticsResponse,
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
 * Creates and defines the criteria and other settings for a findings filter.
 */
export const createFindingsFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFindingsFilterRequest,
    output: CreateFindingsFilterResponse,
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
 * Retrieves occurrences of sensitive data reported by a finding.
 */
export const getSensitiveDataOccurrences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSensitiveDataOccurrencesRequest,
    output: GetSensitiveDataOccurrencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Retrieves a subset of information about one or more classification jobs.
 */
export const listClassificationJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClassificationJobsRequest,
    output: ListClassificationJobsResponse,
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
 * Retrieves (queries) quotas and aggregated usage data for one or more accounts.
 */
export const getUsageStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageStatisticsRequest,
  output: GetUsageStatisticsResponse,
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
 * Creates and defines the settings for a classification job.
 */
export const createClassificationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClassificationJobRequest,
    output: CreateClassificationJobResponse,
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
 * Retrieves (queries) statistical data and other information about one or more S3 buckets that Amazon Macie monitors and analyzes for an account.
 */
export const describeBuckets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBucketsRequest,
  output: DescribeBucketsResponse,
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
 * Retrieves (queries) statistical data and other information about Amazon Web Services resources that Amazon Macie monitors and analyzes for an account.
 */
export const searchResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchResourcesRequest,
  output: SearchResourcesResponse,
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
 * Retrieves the details of one or more findings.
 */
export const getFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingsRequest,
  output: GetFindingsResponse,
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
