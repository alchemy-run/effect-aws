import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Inspector2",
  serviceShapeName: "Inspector2",
});
const auth = T.AwsAuthSigv4({ name: "inspector2" });
const ver = T.ServiceVersion("2020-06-08");
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
                        url: "https://inspector2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://inspector2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://inspector2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://inspector2.{Region}.{PartitionResult#dnsSuffix}",
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
    T.Http({ method: "POST", uri: "/organizationconfiguration/describe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetConfigurationRequest extends S.Class<GetConfigurationRequest>(
  "GetConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/configuration/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDelegatedAdminAccountRequest extends S.Class<GetDelegatedAdminAccountRequest>(
  "GetDelegatedAdminAccountRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/delegatedadminaccounts/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEc2DeepInspectionConfigurationRequest extends S.Class<GetEc2DeepInspectionConfigurationRequest>(
  "GetEc2DeepInspectionConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/ec2deepinspectionconfiguration/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AccountIdSet = S.Array(S.String);
export const FindingArns = S.Array(S.String);
export const FindingArnList = S.Array(S.String);
export const MeteringAccountIdList = S.Array(S.String);
export const DisableResourceTypeList = S.Array(S.String);
export const EnableResourceTypeList = S.Array(S.String);
export const ReportTargetAccounts = S.Array(S.String);
export const PathList = S.Array(S.String);
export const FilterArnList = S.Array(S.String);
export const UsageAccountIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateMemberRequest extends S.Class<AssociateMemberRequest>(
  "AssociateMemberRequest",
)(
  { accountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/members/associate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetAccountStatusRequest extends S.Class<BatchGetAccountStatusRequest>(
  "BatchGetAccountStatusRequest",
)(
  { accountIds: S.optional(AccountIdSet) },
  T.all(
    T.Http({ method: "POST", uri: "/status/batch/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetCodeSnippetRequest extends S.Class<BatchGetCodeSnippetRequest>(
  "BatchGetCodeSnippetRequest",
)(
  { findingArns: FindingArns },
  T.all(
    T.Http({ method: "POST", uri: "/codesnippet/batchget" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetFindingDetailsRequest extends S.Class<BatchGetFindingDetailsRequest>(
  "BatchGetFindingDetailsRequest",
)(
  { findingArns: FindingArnList },
  T.all(
    T.Http({ method: "POST", uri: "/findings/details/batch/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetFreeTrialInfoRequest extends S.Class<BatchGetFreeTrialInfoRequest>(
  "BatchGetFreeTrialInfoRequest",
)(
  { accountIds: MeteringAccountIdList },
  T.all(
    T.Http({ method: "POST", uri: "/freetrialinfo/batchget" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetMemberEc2DeepInspectionStatusRequest extends S.Class<BatchGetMemberEc2DeepInspectionStatusRequest>(
  "BatchGetMemberEc2DeepInspectionStatusRequest",
)(
  { accountIds: S.optional(AccountIdSet) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ec2deepinspectionstatus/member/batch/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelFindingsReportRequest extends S.Class<CancelFindingsReportRequest>(
  "CancelFindingsReportRequest",
)(
  { reportId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/reporting/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelSbomExportRequest extends S.Class<CancelSbomExportRequest>(
  "CancelSbomExportRequest",
)(
  { reportId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/sbomexport/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCisScanConfigurationRequest extends S.Class<DeleteCisScanConfigurationRequest>(
  "DeleteCisScanConfigurationRequest",
)(
  { scanConfigurationArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-configuration/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCodeSecurityIntegrationRequest extends S.Class<DeleteCodeSecurityIntegrationRequest>(
  "DeleteCodeSecurityIntegrationRequest",
)(
  { integrationArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/integration/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCodeSecurityScanConfigurationRequest extends S.Class<DeleteCodeSecurityScanConfigurationRequest>(
  "DeleteCodeSecurityScanConfigurationRequest",
)(
  { scanConfigurationArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan-configuration/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFilterRequest extends S.Class<DeleteFilterRequest>(
  "DeleteFilterRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/filters/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableRequest extends S.Class<DisableRequest>("DisableRequest")(
  {
    accountIds: S.optional(AccountIdSet),
    resourceTypes: S.optional(DisableResourceTypeList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableDelegatedAdminAccountRequest extends S.Class<DisableDelegatedAdminAccountRequest>(
  "DisableDelegatedAdminAccountRequest",
)(
  { delegatedAdminAccountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/delegatedadminaccounts/disable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateMemberRequest extends S.Class<DisassociateMemberRequest>(
  "DisassociateMemberRequest",
)(
  { accountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/members/disassociate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableRequest extends S.Class<EnableRequest>("EnableRequest")(
  {
    accountIds: S.optional(AccountIdSet),
    resourceTypes: EnableResourceTypeList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EnableDelegatedAdminAccountRequest extends S.Class<EnableDelegatedAdminAccountRequest>(
  "EnableDelegatedAdminAccountRequest",
)(
  { delegatedAdminAccountId: S.String, clientToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delegatedadminaccounts/enable" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCisScanReportRequest extends S.Class<GetCisScanReportRequest>(
  "GetCisScanReportRequest",
)(
  {
    scanArn: S.String,
    targetAccounts: S.optional(ReportTargetAccounts),
    reportFormat: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan/report/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class GetCodeSecurityIntegrationRequest extends S.Class<GetCodeSecurityIntegrationRequest>(
  "GetCodeSecurityIntegrationRequest",
)(
  { integrationArn: S.String, tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/integration/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeSecurityScanConfigurationRequest extends S.Class<GetCodeSecurityScanConfigurationRequest>(
  "GetCodeSecurityScanConfigurationRequest",
)(
  { scanConfigurationArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan-configuration/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEc2DeepInspectionConfigurationResponse extends S.Class<GetEc2DeepInspectionConfigurationResponse>(
  "GetEc2DeepInspectionConfigurationResponse",
)({
  packagePaths: S.optional(PathList),
  orgPackagePaths: S.optional(PathList),
  status: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class GetEncryptionKeyRequest extends S.Class<GetEncryptionKeyRequest>(
  "GetEncryptionKeyRequest",
)(
  {
    scanType: S.String.pipe(T.HttpQuery("scanType")),
    resourceType: S.String.pipe(T.HttpQuery("resourceType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/encryptionkey/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsReportStatusRequest extends S.Class<GetFindingsReportStatusRequest>(
  "GetFindingsReportStatusRequest",
)(
  { reportId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/reporting/status/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemberRequest extends S.Class<GetMemberRequest>(
  "GetMemberRequest",
)(
  { accountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/members/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSbomExportRequest extends S.Class<GetSbomExportRequest>(
  "GetSbomExportRequest",
)(
  { reportId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/sbomexport/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccountPermissionsRequest extends S.Class<ListAccountPermissionsRequest>(
  "ListAccountPermissionsRequest",
)(
  {
    service: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accountpermissions/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeSecurityIntegrationsRequest extends S.Class<ListCodeSecurityIntegrationsRequest>(
  "ListCodeSecurityIntegrationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/integration/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeSecurityScanConfigurationAssociationsRequest extends S.Class<ListCodeSecurityScanConfigurationAssociationsRequest>(
  "ListCodeSecurityScanConfigurationAssociationsRequest",
)(
  {
    scanConfigurationArn: S.String,
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/codesecurity/scan-configuration/associations/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeSecurityScanConfigurationsRequest extends S.Class<ListCodeSecurityScanConfigurationsRequest>(
  "ListCodeSecurityScanConfigurationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan-configuration/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CoverageStringFilter extends S.Class<CoverageStringFilter>(
  "CoverageStringFilter",
)({ comparison: S.String, value: S.String }) {}
export const CoverageStringFilterList = S.Array(CoverageStringFilter);
export class CoverageMapFilter extends S.Class<CoverageMapFilter>(
  "CoverageMapFilter",
)({ comparison: S.String, key: S.String, value: S.optional(S.String) }) {}
export const CoverageMapFilterList = S.Array(CoverageMapFilter);
export class CoverageDateFilter extends S.Class<CoverageDateFilter>(
  "CoverageDateFilter",
)({
  startInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CoverageDateFilterList = S.Array(CoverageDateFilter);
export class CoverageNumberFilter extends S.Class<CoverageNumberFilter>(
  "CoverageNumberFilter",
)({
  upperInclusive: S.optional(S.Number),
  lowerInclusive: S.optional(S.Number),
}) {}
export const CoverageNumberFilterList = S.Array(CoverageNumberFilter);
export class CoverageFilterCriteria extends S.Class<CoverageFilterCriteria>(
  "CoverageFilterCriteria",
)({
  scanStatusCode: S.optional(CoverageStringFilterList),
  scanStatusReason: S.optional(CoverageStringFilterList),
  accountId: S.optional(CoverageStringFilterList),
  resourceId: S.optional(CoverageStringFilterList),
  resourceType: S.optional(CoverageStringFilterList),
  scanType: S.optional(CoverageStringFilterList),
  ecrRepositoryName: S.optional(CoverageStringFilterList),
  ecrImageTags: S.optional(CoverageStringFilterList),
  ec2InstanceTags: S.optional(CoverageMapFilterList),
  lambdaFunctionName: S.optional(CoverageStringFilterList),
  lambdaFunctionTags: S.optional(CoverageMapFilterList),
  lambdaFunctionRuntime: S.optional(CoverageStringFilterList),
  lastScannedAt: S.optional(CoverageDateFilterList),
  scanMode: S.optional(CoverageStringFilterList),
  imagePulledAt: S.optional(CoverageDateFilterList),
  ecrImageLastInUseAt: S.optional(CoverageDateFilterList),
  ecrImageInUseCount: S.optional(CoverageNumberFilterList),
  codeRepositoryProjectName: S.optional(CoverageStringFilterList),
  codeRepositoryProviderType: S.optional(CoverageStringFilterList),
  codeRepositoryProviderTypeVisibility: S.optional(CoverageStringFilterList),
  lastScannedCommitId: S.optional(CoverageStringFilterList),
}) {}
export class ListCoverageStatisticsRequest extends S.Class<ListCoverageStatisticsRequest>(
  "ListCoverageStatisticsRequest",
)(
  {
    filterCriteria: S.optional(CoverageFilterCriteria),
    groupBy: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/coverage/statistics/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDelegatedAdminAccountsRequest extends S.Class<ListDelegatedAdminAccountsRequest>(
  "ListDelegatedAdminAccountsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/delegatedadminaccounts/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFiltersRequest extends S.Class<ListFiltersRequest>(
  "ListFiltersRequest",
)(
  {
    arns: S.optional(FilterArnList),
    action: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/filters/list" }),
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
    onlyAssociated: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/members/list" }),
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
export class ListUsageTotalsRequest extends S.Class<ListUsageTotalsRequest>(
  "ListUsageTotalsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    accountIds: S.optional(UsageAccountIdList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/usage/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEncryptionKeyRequest extends S.Class<ResetEncryptionKeyRequest>(
  "ResetEncryptionKeyRequest",
)(
  { scanType: S.String, resourceType: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/encryptionkey/reset" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResetEncryptionKeyResponse extends S.Class<ResetEncryptionKeyResponse>(
  "ResetEncryptionKeyResponse",
)({}) {}
export class SendCisSessionHealthRequest extends S.Class<SendCisSessionHealthRequest>(
  "SendCisSessionHealthRequest",
)(
  { scanJobId: S.String, sessionToken: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/cissession/health/send" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendCisSessionHealthResponse extends S.Class<SendCisSessionHealthResponse>(
  "SendCisSessionHealthResponse",
)({}) {}
export const CodeSecurityResource = S.Union(S.Struct({ projectId: S.String }));
export class StartCodeSecurityScanRequest extends S.Class<StartCodeSecurityScanRequest>(
  "StartCodeSecurityScanRequest",
)(
  { clientToken: S.optional(S.String), resource: CodeSecurityResource },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan/start" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class PeriodicScanConfiguration extends S.Class<PeriodicScanConfiguration>(
  "PeriodicScanConfiguration",
)({
  frequency: S.optional(S.String),
  frequencyExpression: S.optional(S.String),
}) {}
export const ContinuousIntegrationScanSupportedEvents = S.Array(S.String);
export class ContinuousIntegrationScanConfiguration extends S.Class<ContinuousIntegrationScanConfiguration>(
  "ContinuousIntegrationScanConfiguration",
)({ supportedEvents: ContinuousIntegrationScanSupportedEvents }) {}
export const RuleSetCategories = S.Array(S.String);
export class CodeSecurityScanConfiguration extends S.Class<CodeSecurityScanConfiguration>(
  "CodeSecurityScanConfiguration",
)({
  periodicScanConfiguration: S.optional(PeriodicScanConfiguration),
  continuousIntegrationScanConfiguration: S.optional(
    ContinuousIntegrationScanConfiguration,
  ),
  ruleSetCategories: RuleSetCategories,
}) {}
export class UpdateCodeSecurityScanConfigurationRequest extends S.Class<UpdateCodeSecurityScanConfigurationRequest>(
  "UpdateCodeSecurityScanConfigurationRequest",
)(
  {
    scanConfigurationArn: S.String,
    configuration: CodeSecurityScanConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan-configuration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEc2DeepInspectionConfigurationRequest extends S.Class<UpdateEc2DeepInspectionConfigurationRequest>(
  "UpdateEc2DeepInspectionConfigurationRequest",
)(
  {
    activateDeepInspection: S.optional(S.Boolean),
    packagePaths: S.optional(PathList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ec2deepinspectionconfiguration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEncryptionKeyRequest extends S.Class<UpdateEncryptionKeyRequest>(
  "UpdateEncryptionKeyRequest",
)(
  { kmsKeyId: S.String, scanType: S.String, resourceType: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/encryptionkey/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEncryptionKeyResponse extends S.Class<UpdateEncryptionKeyResponse>(
  "UpdateEncryptionKeyResponse",
)({}) {}
export class StringFilter extends S.Class<StringFilter>("StringFilter")({
  comparison: S.String,
  value: S.String,
}) {}
export const StringFilterList = S.Array(StringFilter);
export class DateFilter extends S.Class<DateFilter>("DateFilter")({
  startInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DateFilterList = S.Array(DateFilter);
export class NumberFilter extends S.Class<NumberFilter>("NumberFilter")({
  upperInclusive: S.optional(S.Number),
  lowerInclusive: S.optional(S.Number),
}) {}
export const NumberFilterList = S.Array(NumberFilter);
export class MapFilter extends S.Class<MapFilter>("MapFilter")({
  comparison: S.String,
  key: S.String,
  value: S.optional(S.String),
}) {}
export const MapFilterList = S.Array(MapFilter);
export class PortRangeFilter extends S.Class<PortRangeFilter>(
  "PortRangeFilter",
)({
  beginInclusive: S.optional(S.Number),
  endInclusive: S.optional(S.Number),
}) {}
export const PortRangeFilterList = S.Array(PortRangeFilter);
export class PackageFilter extends S.Class<PackageFilter>("PackageFilter")({
  name: S.optional(StringFilter),
  version: S.optional(StringFilter),
  epoch: S.optional(NumberFilter),
  release: S.optional(StringFilter),
  architecture: S.optional(StringFilter),
  sourceLayerHash: S.optional(StringFilter),
  sourceLambdaLayerArn: S.optional(StringFilter),
  filePath: S.optional(StringFilter),
}) {}
export const PackageFilterList = S.Array(PackageFilter);
export class FilterCriteria extends S.Class<FilterCriteria>("FilterCriteria")({
  findingArn: S.optional(StringFilterList),
  awsAccountId: S.optional(StringFilterList),
  findingType: S.optional(StringFilterList),
  severity: S.optional(StringFilterList),
  firstObservedAt: S.optional(DateFilterList),
  lastObservedAt: S.optional(DateFilterList),
  updatedAt: S.optional(DateFilterList),
  findingStatus: S.optional(StringFilterList),
  title: S.optional(StringFilterList),
  inspectorScore: S.optional(NumberFilterList),
  resourceType: S.optional(StringFilterList),
  resourceId: S.optional(StringFilterList),
  resourceTags: S.optional(MapFilterList),
  ec2InstanceImageId: S.optional(StringFilterList),
  ec2InstanceVpcId: S.optional(StringFilterList),
  ec2InstanceSubnetId: S.optional(StringFilterList),
  ecrImagePushedAt: S.optional(DateFilterList),
  ecrImageArchitecture: S.optional(StringFilterList),
  ecrImageRegistry: S.optional(StringFilterList),
  ecrImageRepositoryName: S.optional(StringFilterList),
  ecrImageTags: S.optional(StringFilterList),
  ecrImageHash: S.optional(StringFilterList),
  ecrImageLastInUseAt: S.optional(DateFilterList),
  ecrImageInUseCount: S.optional(NumberFilterList),
  portRange: S.optional(PortRangeFilterList),
  networkProtocol: S.optional(StringFilterList),
  componentId: S.optional(StringFilterList),
  componentType: S.optional(StringFilterList),
  vulnerabilityId: S.optional(StringFilterList),
  vulnerabilitySource: S.optional(StringFilterList),
  vendorSeverity: S.optional(StringFilterList),
  vulnerablePackages: S.optional(PackageFilterList),
  relatedVulnerabilities: S.optional(StringFilterList),
  fixAvailable: S.optional(StringFilterList),
  lambdaFunctionName: S.optional(StringFilterList),
  lambdaFunctionLayers: S.optional(StringFilterList),
  lambdaFunctionRuntime: S.optional(StringFilterList),
  lambdaFunctionLastModifiedAt: S.optional(DateFilterList),
  lambdaFunctionExecutionRoleArn: S.optional(StringFilterList),
  exploitAvailable: S.optional(StringFilterList),
  codeVulnerabilityDetectorName: S.optional(StringFilterList),
  codeVulnerabilityDetectorTags: S.optional(StringFilterList),
  codeVulnerabilityFilePath: S.optional(StringFilterList),
  epssScore: S.optional(NumberFilterList),
  codeRepositoryProjectName: S.optional(StringFilterList),
  codeRepositoryProviderType: S.optional(StringFilterList),
}) {}
export class UpdateFilterRequest extends S.Class<UpdateFilterRequest>(
  "UpdateFilterRequest",
)(
  {
    action: S.optional(S.String),
    description: S.optional(S.String),
    filterCriteria: S.optional(FilterCriteria),
    name: S.optional(S.String),
    filterArn: S.String,
    reason: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/filters/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AutoEnable extends S.Class<AutoEnable>("AutoEnable")({
  ec2: S.Boolean,
  ecr: S.Boolean,
  lambda: S.optional(S.Boolean),
  lambdaCode: S.optional(S.Boolean),
  codeRepository: S.optional(S.Boolean),
}) {}
export class UpdateOrganizationConfigurationRequest extends S.Class<UpdateOrganizationConfigurationRequest>(
  "UpdateOrganizationConfigurationRequest",
)(
  { autoEnable: AutoEnable },
  T.all(
    T.Http({ method: "POST", uri: "/organizationconfiguration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrgEc2DeepInspectionConfigurationRequest extends S.Class<UpdateOrgEc2DeepInspectionConfigurationRequest>(
  "UpdateOrgEc2DeepInspectionConfigurationRequest",
)(
  { orgPackagePaths: PathList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ec2deepinspectionconfiguration/org/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrgEc2DeepInspectionConfigurationResponse extends S.Class<UpdateOrgEc2DeepInspectionConfigurationResponse>(
  "UpdateOrgEc2DeepInspectionConfigurationResponse",
)({}) {}
export class OneTimeSchedule extends S.Class<OneTimeSchedule>(
  "OneTimeSchedule",
)({}) {}
export const TargetAccountList = S.Array(S.String);
export class CisStringFilter extends S.Class<CisStringFilter>(
  "CisStringFilter",
)({ comparison: S.String, value: S.String }) {}
export const TitleFilterList = S.Array(CisStringFilter);
export const CisFindingArnFilterList = S.Array(CisStringFilter);
export const CisScanNameFilterList = S.Array(CisStringFilter);
export const CisScanConfigurationArnFilterList = S.Array(CisStringFilter);
export const OneAccountIdFilterList = S.Array(CisStringFilter);
export const PlatformFilterList = S.Array(CisStringFilter);
export const AccountIdFilterList = S.Array(CisStringFilter);
export const ResourceIdFilterList = S.Array(CisStringFilter);
export const CisScanArnFilterList = S.Array(CisStringFilter);
export const CisScheduledByFilterList = S.Array(CisStringFilter);
export const VulnIdList = S.Array(S.String);
export class AssociateConfigurationRequest extends S.Class<AssociateConfigurationRequest>(
  "AssociateConfigurationRequest",
)({ scanConfigurationArn: S.String, resource: CodeSecurityResource }) {}
export const AssociateConfigurationRequestList = S.Array(
  AssociateConfigurationRequest,
);
export class DisassociateConfigurationRequest extends S.Class<DisassociateConfigurationRequest>(
  "DisassociateConfigurationRequest",
)({ scanConfigurationArn: S.String, resource: CodeSecurityResource }) {}
export const DisassociateConfigurationRequestList = S.Array(
  DisassociateConfigurationRequest,
);
export class MemberAccountEc2DeepInspectionStatus extends S.Class<MemberAccountEc2DeepInspectionStatus>(
  "MemberAccountEc2DeepInspectionStatus",
)({ accountId: S.String, activateDeepInspection: S.Boolean }) {}
export const MemberAccountEc2DeepInspectionStatusList = S.Array(
  MemberAccountEc2DeepInspectionStatus,
);
export const CisTagMap = S.Record({ key: S.String, value: S.String });
export class ScopeSettings extends S.Class<ScopeSettings>("ScopeSettings")({
  projectSelectionScope: S.optional(S.String),
}) {}
export class Destination extends S.Class<Destination>("Destination")({
  bucketName: S.String,
  keyPrefix: S.optional(S.String),
  kmsKeyArn: S.String,
}) {}
export class ClusterForImageFilterCriteria extends S.Class<ClusterForImageFilterCriteria>(
  "ClusterForImageFilterCriteria",
)({ resourceId: S.String }) {}
export class DelegatedAdmin extends S.Class<DelegatedAdmin>("DelegatedAdmin")({
  accountId: S.optional(S.String),
  relationshipStatus: S.optional(S.String),
}) {}
export class SortCriteria extends S.Class<SortCriteria>("SortCriteria")({
  field: S.String,
  sortOrder: S.String,
}) {}
export class Member extends S.Class<Member>("Member")({
  accountId: S.optional(S.String),
  relationshipStatus: S.optional(S.String),
  delegatedAdminAccountId: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MemberList = S.Array(Member);
export class SearchVulnerabilitiesFilterCriteria extends S.Class<SearchVulnerabilitiesFilterCriteria>(
  "SearchVulnerabilitiesFilterCriteria",
)({ vulnerabilityIds: VulnIdList }) {}
export class CisSessionMessage extends S.Class<CisSessionMessage>(
  "CisSessionMessage",
)({ ruleId: S.String, status: S.String, cisRuleDetails: T.Blob }) {}
export const CisSessionMessages = S.Array(CisSessionMessage);
export class StartCisSessionMessage extends S.Class<StartCisSessionMessage>(
  "StartCisSessionMessage",
)({ sessionToken: S.String }) {}
export const TagValueList = S.Array(S.String);
export const TargetResourceTags = S.Record({
  key: S.String,
  value: TagValueList,
});
export class UpdateCisTargets extends S.Class<UpdateCisTargets>(
  "UpdateCisTargets",
)({
  accountIds: S.optional(TargetAccountList),
  targetResourceTags: S.optional(TargetResourceTags),
}) {}
export class EcrConfiguration extends S.Class<EcrConfiguration>(
  "EcrConfiguration",
)({
  rescanDuration: S.String,
  pullDateRescanDuration: S.optional(S.String),
  pullDateRescanMode: S.optional(S.String),
}) {}
export class Ec2Configuration extends S.Class<Ec2Configuration>(
  "Ec2Configuration",
)({ scanMode: S.String }) {}
export const DaysList = S.Array(S.String);
export class AssociateMemberResponse extends S.Class<AssociateMemberResponse>(
  "AssociateMemberResponse",
)({ accountId: S.String }) {}
export class BatchAssociateCodeSecurityScanConfigurationRequest extends S.Class<BatchAssociateCodeSecurityScanConfigurationRequest>(
  "BatchAssociateCodeSecurityScanConfigurationRequest",
)(
  { associateConfigurationRequests: AssociateConfigurationRequestList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/codesecurity/scan-configuration/batch/associate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDisassociateCodeSecurityScanConfigurationRequest extends S.Class<BatchDisassociateCodeSecurityScanConfigurationRequest>(
  "BatchDisassociateCodeSecurityScanConfigurationRequest",
)(
  { disassociateConfigurationRequests: DisassociateConfigurationRequestList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/codesecurity/scan-configuration/batch/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateMemberEc2DeepInspectionStatusRequest extends S.Class<BatchUpdateMemberEc2DeepInspectionStatusRequest>(
  "BatchUpdateMemberEc2DeepInspectionStatusRequest",
)(
  { accountIds: MemberAccountEc2DeepInspectionStatusList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/ec2deepinspectionstatus/member/batch/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelFindingsReportResponse extends S.Class<CancelFindingsReportResponse>(
  "CancelFindingsReportResponse",
)({ reportId: S.String }) {}
export class CancelSbomExportResponse extends S.Class<CancelSbomExportResponse>(
  "CancelSbomExportResponse",
)({ reportId: S.optional(S.String) }) {}
export class CreateFindingsReportRequest extends S.Class<CreateFindingsReportRequest>(
  "CreateFindingsReportRequest",
)(
  {
    filterCriteria: S.optional(FilterCriteria),
    reportFormat: S.String,
    s3Destination: Destination,
  },
  T.all(
    T.Http({ method: "POST", uri: "/reporting/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCisScanConfigurationResponse extends S.Class<DeleteCisScanConfigurationResponse>(
  "DeleteCisScanConfigurationResponse",
)({ scanConfigurationArn: S.String }) {}
export class DeleteCodeSecurityIntegrationResponse extends S.Class<DeleteCodeSecurityIntegrationResponse>(
  "DeleteCodeSecurityIntegrationResponse",
)({ integrationArn: S.optional(S.String) }) {}
export class DeleteCodeSecurityScanConfigurationResponse extends S.Class<DeleteCodeSecurityScanConfigurationResponse>(
  "DeleteCodeSecurityScanConfigurationResponse",
)({ scanConfigurationArn: S.optional(S.String) }) {}
export class DeleteFilterResponse extends S.Class<DeleteFilterResponse>(
  "DeleteFilterResponse",
)({ arn: S.String }) {}
export class DescribeOrganizationConfigurationResponse extends S.Class<DescribeOrganizationConfigurationResponse>(
  "DescribeOrganizationConfigurationResponse",
)({
  autoEnable: S.optional(AutoEnable),
  maxAccountLimitReached: S.optional(S.Boolean),
}) {}
export class DisableDelegatedAdminAccountResponse extends S.Class<DisableDelegatedAdminAccountResponse>(
  "DisableDelegatedAdminAccountResponse",
)({ delegatedAdminAccountId: S.String }) {}
export class DisassociateMemberResponse extends S.Class<DisassociateMemberResponse>(
  "DisassociateMemberResponse",
)({ accountId: S.String }) {}
export class ResourceStatus extends S.Class<ResourceStatus>("ResourceStatus")({
  ec2: S.String,
  ecr: S.String,
  lambda: S.optional(S.String),
  lambdaCode: S.optional(S.String),
  codeRepository: S.optional(S.String),
}) {}
export class Account extends S.Class<Account>("Account")({
  accountId: S.String,
  status: S.String,
  resourceStatus: ResourceStatus,
}) {}
export const AccountList = S.Array(Account);
export class FailedAccount extends S.Class<FailedAccount>("FailedAccount")({
  accountId: S.String,
  status: S.optional(S.String),
  resourceStatus: S.optional(ResourceStatus),
  errorCode: S.String,
  errorMessage: S.String,
}) {}
export const FailedAccountList = S.Array(FailedAccount);
export class EnableResponse extends S.Class<EnableResponse>("EnableResponse")({
  accounts: AccountList,
  failedAccounts: S.optional(FailedAccountList),
}) {}
export class EnableDelegatedAdminAccountResponse extends S.Class<EnableDelegatedAdminAccountResponse>(
  "EnableDelegatedAdminAccountResponse",
)({ delegatedAdminAccountId: S.String }) {}
export class GetCisScanReportResponse extends S.Class<GetCisScanReportResponse>(
  "GetCisScanReportResponse",
)({ url: S.optional(S.String), status: S.optional(S.String) }) {}
export class GetClustersForImageRequest extends S.Class<GetClustersForImageRequest>(
  "GetClustersForImageRequest",
)(
  {
    filter: ClusterForImageFilterCriteria,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cluster/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeSecurityIntegrationResponse extends S.Class<GetCodeSecurityIntegrationResponse>(
  "GetCodeSecurityIntegrationResponse",
)({
  integrationArn: S.String,
  name: S.String,
  type: S.String,
  status: S.String,
  statusReason: S.String,
  createdOn: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateOn: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
  authorizationUrl: S.optional(S.String),
}) {}
export class GetCodeSecurityScanRequest extends S.Class<GetCodeSecurityScanRequest>(
  "GetCodeSecurityScanRequest",
)(
  { resource: CodeSecurityResource, scanId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeSecurityScanConfigurationResponse extends S.Class<GetCodeSecurityScanConfigurationResponse>(
  "GetCodeSecurityScanConfigurationResponse",
)({
  scanConfigurationArn: S.optional(S.String),
  name: S.optional(S.String),
  configuration: S.optional(CodeSecurityScanConfiguration),
  level: S.optional(S.String),
  scopeSettings: S.optional(ScopeSettings),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class GetDelegatedAdminAccountResponse extends S.Class<GetDelegatedAdminAccountResponse>(
  "GetDelegatedAdminAccountResponse",
)({ delegatedAdmin: S.optional(DelegatedAdmin) }) {}
export class GetEncryptionKeyResponse extends S.Class<GetEncryptionKeyResponse>(
  "GetEncryptionKeyResponse",
)({ kmsKeyId: S.String }) {}
export class GetFindingsReportStatusResponse extends S.Class<GetFindingsReportStatusResponse>(
  "GetFindingsReportStatusResponse",
)({
  reportId: S.optional(S.String),
  status: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
  destination: S.optional(Destination),
  filterCriteria: S.optional(FilterCriteria),
}) {}
export class ResourceStringFilter extends S.Class<ResourceStringFilter>(
  "ResourceStringFilter",
)({ comparison: S.String, value: S.String }) {}
export const ResourceStringFilterList = S.Array(ResourceStringFilter);
export class ResourceMapFilter extends S.Class<ResourceMapFilter>(
  "ResourceMapFilter",
)({ comparison: S.String, key: S.String, value: S.optional(S.String) }) {}
export const ResourceMapFilterList = S.Array(ResourceMapFilter);
export class ResourceFilterCriteria extends S.Class<ResourceFilterCriteria>(
  "ResourceFilterCriteria",
)({
  accountId: S.optional(ResourceStringFilterList),
  resourceId: S.optional(ResourceStringFilterList),
  resourceType: S.optional(ResourceStringFilterList),
  ecrRepositoryName: S.optional(ResourceStringFilterList),
  lambdaFunctionName: S.optional(ResourceStringFilterList),
  ecrImageTags: S.optional(ResourceStringFilterList),
  ec2InstanceTags: S.optional(ResourceMapFilterList),
  lambdaFunctionTags: S.optional(ResourceMapFilterList),
}) {}
export class GetSbomExportResponse extends S.Class<GetSbomExportResponse>(
  "GetSbomExportResponse",
)({
  reportId: S.optional(S.String),
  format: S.optional(S.String),
  status: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
  s3Destination: S.optional(Destination),
  filterCriteria: S.optional(ResourceFilterCriteria),
}) {}
export class ListFindingsRequest extends S.Class<ListFindingsRequest>(
  "ListFindingsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filterCriteria: S.optional(FilterCriteria),
    sortCriteria: S.optional(SortCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembersResponse extends S.Class<ListMembersResponse>(
  "ListMembersResponse",
)({ members: S.optional(MemberList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class SearchVulnerabilitiesRequest extends S.Class<SearchVulnerabilitiesRequest>(
  "SearchVulnerabilitiesRequest",
)(
  {
    filterCriteria: SearchVulnerabilitiesFilterCriteria,
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vulnerabilities/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendCisSessionTelemetryRequest extends S.Class<SendCisSessionTelemetryRequest>(
  "SendCisSessionTelemetryRequest",
)(
  { scanJobId: S.String, sessionToken: S.String, messages: CisSessionMessages },
  T.all(
    T.Http({ method: "PUT", uri: "/cissession/telemetry/send" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendCisSessionTelemetryResponse extends S.Class<SendCisSessionTelemetryResponse>(
  "SendCisSessionTelemetryResponse",
)({}) {}
export class StartCisSessionRequest extends S.Class<StartCisSessionRequest>(
  "StartCisSessionRequest",
)(
  { scanJobId: S.String, message: StartCisSessionMessage },
  T.all(
    T.Http({ method: "PUT", uri: "/cissession/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCisSessionResponse extends S.Class<StartCisSessionResponse>(
  "StartCisSessionResponse",
)({}) {}
export class StartCodeSecurityScanResponse extends S.Class<StartCodeSecurityScanResponse>(
  "StartCodeSecurityScanResponse",
)({ scanId: S.optional(S.String), status: S.optional(S.String) }) {}
export class Time extends S.Class<Time>("Time")({
  timeOfDay: S.String,
  timezone: S.String,
}) {}
export class DailySchedule extends S.Class<DailySchedule>("DailySchedule")({
  startTime: Time,
}) {}
export class WeeklySchedule extends S.Class<WeeklySchedule>("WeeklySchedule")({
  startTime: Time,
  days: DaysList,
}) {}
export class MonthlySchedule extends S.Class<MonthlySchedule>(
  "MonthlySchedule",
)({ startTime: Time, day: S.String }) {}
export const Schedule = S.Union(
  S.Struct({ oneTime: OneTimeSchedule }),
  S.Struct({ daily: DailySchedule }),
  S.Struct({ weekly: WeeklySchedule }),
  S.Struct({ monthly: MonthlySchedule }),
);
export class UpdateCisScanConfigurationRequest extends S.Class<UpdateCisScanConfigurationRequest>(
  "UpdateCisScanConfigurationRequest",
)(
  {
    scanConfigurationArn: S.String,
    scanName: S.optional(S.String),
    securityLevel: S.optional(S.String),
    schedule: S.optional(Schedule),
    targets: S.optional(UpdateCisTargets),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-configuration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCodeSecurityScanConfigurationResponse extends S.Class<UpdateCodeSecurityScanConfigurationResponse>(
  "UpdateCodeSecurityScanConfigurationResponse",
)({ scanConfigurationArn: S.optional(S.String) }) {}
export class UpdateConfigurationRequest extends S.Class<UpdateConfigurationRequest>(
  "UpdateConfigurationRequest",
)(
  {
    ecrConfiguration: S.optional(EcrConfiguration),
    ec2Configuration: S.optional(Ec2Configuration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/configuration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConfigurationResponse extends S.Class<UpdateConfigurationResponse>(
  "UpdateConfigurationResponse",
)({}) {}
export class UpdateEc2DeepInspectionConfigurationResponse extends S.Class<UpdateEc2DeepInspectionConfigurationResponse>(
  "UpdateEc2DeepInspectionConfigurationResponse",
)({
  packagePaths: S.optional(PathList),
  orgPackagePaths: S.optional(PathList),
  status: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class UpdateFilterResponse extends S.Class<UpdateFilterResponse>(
  "UpdateFilterResponse",
)({ arn: S.String }) {}
export class UpdateOrganizationConfigurationResponse extends S.Class<UpdateOrganizationConfigurationResponse>(
  "UpdateOrganizationConfigurationResponse",
)({ autoEnable: AutoEnable }) {}
export const Ttps = S.Array(S.String);
export const Tools = S.Array(S.String);
export const VulnerabilityReferenceUrls = S.Array(S.String);
export const Cwes = S.Array(S.String);
export class CreateGitLabSelfManagedIntegrationDetail extends S.Class<CreateGitLabSelfManagedIntegrationDetail>(
  "CreateGitLabSelfManagedIntegrationDetail",
)({ instanceUrl: S.String, accessToken: S.String }) {}
export class CisFindingStatusFilter extends S.Class<CisFindingStatusFilter>(
  "CisFindingStatusFilter",
)({ comparison: S.String, value: S.String }) {}
export const CisFindingStatusFilterList = S.Array(CisFindingStatusFilter);
export const CheckIdFilterList = S.Array(CisStringFilter);
export class CisSecurityLevelFilter extends S.Class<CisSecurityLevelFilter>(
  "CisSecurityLevelFilter",
)({ comparison: S.String, value: S.String }) {}
export const CisSecurityLevelFilterList = S.Array(CisSecurityLevelFilter);
export class EcrRescanDurationState extends S.Class<EcrRescanDurationState>(
  "EcrRescanDurationState",
)({
  rescanDuration: S.optional(S.String),
  status: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  pullDateRescanDuration: S.optional(S.String),
  pullDateRescanMode: S.optional(S.String),
}) {}
export class Ec2ScanModeState extends S.Class<Ec2ScanModeState>(
  "Ec2ScanModeState",
)({ scanMode: S.optional(S.String), scanModeStatus: S.optional(S.String) }) {}
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  comparison: S.String,
  key: S.String,
  value: S.String,
}) {}
export const ResourceTagFilterList = S.Array(TagFilter);
export class CisNumberFilter extends S.Class<CisNumberFilter>(
  "CisNumberFilter",
)({
  upperInclusive: S.optional(S.Number),
  lowerInclusive: S.optional(S.Number),
}) {}
export const CisNumberFilterList = S.Array(CisNumberFilter);
export class CisResultStatusFilter extends S.Class<CisResultStatusFilter>(
  "CisResultStatusFilter",
)({ comparison: S.String, value: S.String }) {}
export const CisResultStatusFilterList = S.Array(CisResultStatusFilter);
export class CisTargetStatusFilter extends S.Class<CisTargetStatusFilter>(
  "CisTargetStatusFilter",
)({ comparison: S.String, value: S.String }) {}
export const TargetStatusFilterList = S.Array(CisTargetStatusFilter);
export class CisTargetStatusReasonFilter extends S.Class<CisTargetStatusReasonFilter>(
  "CisTargetStatusReasonFilter",
)({ comparison: S.String, value: S.String }) {}
export const TargetStatusReasonFilterList = S.Array(
  CisTargetStatusReasonFilter,
);
export class CisScanStatusFilter extends S.Class<CisScanStatusFilter>(
  "CisScanStatusFilter",
)({ comparison: S.String, value: S.String }) {}
export const CisScanStatusFilterList = S.Array(CisScanStatusFilter);
export class CisDateFilter extends S.Class<CisDateFilter>("CisDateFilter")({
  earliestScanStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  latestScanStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const CisScanDateFilterList = S.Array(CisDateFilter);
export class AccountAggregation extends S.Class<AccountAggregation>(
  "AccountAggregation",
)({
  findingType: S.optional(S.String),
  resourceType: S.optional(S.String),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class AmiAggregation extends S.Class<AmiAggregation>("AmiAggregation")({
  amis: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class AwsEcrContainerAggregation extends S.Class<AwsEcrContainerAggregation>(
  "AwsEcrContainerAggregation",
)({
  resourceIds: S.optional(StringFilterList),
  imageShas: S.optional(StringFilterList),
  repositories: S.optional(StringFilterList),
  architectures: S.optional(StringFilterList),
  imageTags: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
  lastInUseAt: S.optional(DateFilterList),
  inUseCount: S.optional(NumberFilterList),
}) {}
export class Ec2InstanceAggregation extends S.Class<Ec2InstanceAggregation>(
  "Ec2InstanceAggregation",
)({
  amis: S.optional(StringFilterList),
  operatingSystems: S.optional(StringFilterList),
  instanceIds: S.optional(StringFilterList),
  instanceTags: S.optional(MapFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class FindingTypeAggregation extends S.Class<FindingTypeAggregation>(
  "FindingTypeAggregation",
)({
  findingType: S.optional(S.String),
  resourceType: S.optional(S.String),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class ImageLayerAggregation extends S.Class<ImageLayerAggregation>(
  "ImageLayerAggregation",
)({
  repositories: S.optional(StringFilterList),
  resourceIds: S.optional(StringFilterList),
  layerHashes: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class PackageAggregation extends S.Class<PackageAggregation>(
  "PackageAggregation",
)({
  packageNames: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class RepositoryAggregation extends S.Class<RepositoryAggregation>(
  "RepositoryAggregation",
)({
  repositories: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class TitleAggregation extends S.Class<TitleAggregation>(
  "TitleAggregation",
)({
  titles: S.optional(StringFilterList),
  vulnerabilityIds: S.optional(StringFilterList),
  resourceType: S.optional(S.String),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
  findingType: S.optional(S.String),
}) {}
export class LambdaLayerAggregation extends S.Class<LambdaLayerAggregation>(
  "LambdaLayerAggregation",
)({
  functionNames: S.optional(StringFilterList),
  resourceIds: S.optional(StringFilterList),
  layerArns: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class LambdaFunctionAggregation extends S.Class<LambdaFunctionAggregation>(
  "LambdaFunctionAggregation",
)({
  resourceIds: S.optional(StringFilterList),
  functionNames: S.optional(StringFilterList),
  runtimes: S.optional(StringFilterList),
  functionTags: S.optional(MapFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
}) {}
export class CodeRepositoryAggregation extends S.Class<CodeRepositoryAggregation>(
  "CodeRepositoryAggregation",
)({
  projectNames: S.optional(StringFilterList),
  providerTypes: S.optional(StringFilterList),
  sortOrder: S.optional(S.String),
  sortBy: S.optional(S.String),
  resourceIds: S.optional(StringFilterList),
}) {}
export class StopCisMessageProgress extends S.Class<StopCisMessageProgress>(
  "StopCisMessageProgress",
)({
  totalChecks: S.optional(S.Number),
  successfulChecks: S.optional(S.Number),
  failedChecks: S.optional(S.Number),
  notEvaluatedChecks: S.optional(S.Number),
  unknownChecks: S.optional(S.Number),
  notApplicableChecks: S.optional(S.Number),
  informationalChecks: S.optional(S.Number),
  errorChecks: S.optional(S.Number),
}) {}
export class ComputePlatform extends S.Class<ComputePlatform>(
  "ComputePlatform",
)({
  vendor: S.optional(S.String),
  product: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export class UpdateGitLabSelfManagedIntegrationDetail extends S.Class<UpdateGitLabSelfManagedIntegrationDetail>(
  "UpdateGitLabSelfManagedIntegrationDetail",
)({ authCode: S.String }) {}
export class UpdateGitHubIntegrationDetail extends S.Class<UpdateGitHubIntegrationDetail>(
  "UpdateGitHubIntegrationDetail",
)({ code: S.String, installationId: S.String }) {}
export class CodeSnippetError extends S.Class<CodeSnippetError>(
  "CodeSnippetError",
)({ findingArn: S.String, errorCode: S.String, errorMessage: S.String }) {}
export const CodeSnippetErrorList = S.Array(CodeSnippetError);
export class FindingDetailsError extends S.Class<FindingDetailsError>(
  "FindingDetailsError",
)({ findingArn: S.String, errorCode: S.String, errorMessage: S.String }) {}
export const FindingDetailsErrorList = S.Array(FindingDetailsError);
export class FreeTrialInfoError extends S.Class<FreeTrialInfoError>(
  "FreeTrialInfoError",
)({ accountId: S.String, code: S.String, message: S.String }) {}
export const FreeTrialInfoErrorList = S.Array(FreeTrialInfoError);
export class MemberAccountEc2DeepInspectionStatusState extends S.Class<MemberAccountEc2DeepInspectionStatusState>(
  "MemberAccountEc2DeepInspectionStatusState",
)({
  accountId: S.String,
  status: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const MemberAccountEc2DeepInspectionStatusStateList = S.Array(
  MemberAccountEc2DeepInspectionStatusState,
);
export class FailedMemberAccountEc2DeepInspectionStatusState extends S.Class<FailedMemberAccountEc2DeepInspectionStatusState>(
  "FailedMemberAccountEc2DeepInspectionStatusState",
)({
  accountId: S.String,
  ec2ScanStatus: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const FailedMemberAccountEc2DeepInspectionStatusStateList = S.Array(
  FailedMemberAccountEc2DeepInspectionStatusState,
);
export class CreateCisTargets extends S.Class<CreateCisTargets>(
  "CreateCisTargets",
)({ accountIds: TargetAccountList, targetResourceTags: TargetResourceTags }) {}
export const CreateIntegrationDetail = S.Union(
  S.Struct({ gitlabSelfManaged: CreateGitLabSelfManagedIntegrationDetail }),
);
export class CisScanResultDetailsFilterCriteria extends S.Class<CisScanResultDetailsFilterCriteria>(
  "CisScanResultDetailsFilterCriteria",
)({
  findingStatusFilters: S.optional(CisFindingStatusFilterList),
  checkIdFilters: S.optional(CheckIdFilterList),
  titleFilters: S.optional(TitleFilterList),
  securityLevelFilters: S.optional(CisSecurityLevelFilterList),
  findingArnFilters: S.optional(CisFindingArnFilterList),
}) {}
export class EcrConfigurationState extends S.Class<EcrConfigurationState>(
  "EcrConfigurationState",
)({ rescanDurationState: S.optional(EcrRescanDurationState) }) {}
export class Ec2ConfigurationState extends S.Class<Ec2ConfigurationState>(
  "Ec2ConfigurationState",
)({ scanModeState: S.optional(Ec2ScanModeState) }) {}
export class Permission extends S.Class<Permission>("Permission")({
  service: S.String,
  operation: S.String,
}) {}
export const Permissions = S.Array(Permission);
export class ListCisScanConfigurationsFilterCriteria extends S.Class<ListCisScanConfigurationsFilterCriteria>(
  "ListCisScanConfigurationsFilterCriteria",
)({
  scanNameFilters: S.optional(CisScanNameFilterList),
  targetResourceTagFilters: S.optional(ResourceTagFilterList),
  scanConfigurationArnFilters: S.optional(CisScanConfigurationArnFilterList),
}) {}
export class CisScanResultsAggregatedByChecksFilterCriteria extends S.Class<CisScanResultsAggregatedByChecksFilterCriteria>(
  "CisScanResultsAggregatedByChecksFilterCriteria",
)({
  accountIdFilters: S.optional(OneAccountIdFilterList),
  checkIdFilters: S.optional(CheckIdFilterList),
  titleFilters: S.optional(TitleFilterList),
  platformFilters: S.optional(PlatformFilterList),
  failedResourcesFilters: S.optional(CisNumberFilterList),
  securityLevelFilters: S.optional(CisSecurityLevelFilterList),
}) {}
export class CisScanResultsAggregatedByTargetResourceFilterCriteria extends S.Class<CisScanResultsAggregatedByTargetResourceFilterCriteria>(
  "CisScanResultsAggregatedByTargetResourceFilterCriteria",
)({
  accountIdFilters: S.optional(AccountIdFilterList),
  statusFilters: S.optional(CisResultStatusFilterList),
  checkIdFilters: S.optional(CheckIdFilterList),
  targetResourceIdFilters: S.optional(ResourceIdFilterList),
  targetResourceTagFilters: S.optional(ResourceTagFilterList),
  platformFilters: S.optional(PlatformFilterList),
  targetStatusFilters: S.optional(TargetStatusFilterList),
  targetStatusReasonFilters: S.optional(TargetStatusReasonFilterList),
  failedChecksFilters: S.optional(CisNumberFilterList),
}) {}
export class ListCisScansFilterCriteria extends S.Class<ListCisScansFilterCriteria>(
  "ListCisScansFilterCriteria",
)({
  scanNameFilters: S.optional(CisScanNameFilterList),
  targetResourceTagFilters: S.optional(ResourceTagFilterList),
  targetResourceIdFilters: S.optional(ResourceIdFilterList),
  scanStatusFilters: S.optional(CisScanStatusFilterList),
  scanAtFilters: S.optional(CisScanDateFilterList),
  scanConfigurationArnFilters: S.optional(CisScanConfigurationArnFilterList),
  scanArnFilters: S.optional(CisScanArnFilterList),
  scheduledByFilters: S.optional(CisScheduledByFilterList),
  failedChecksFilters: S.optional(CisNumberFilterList),
  targetAccountIdFilters: S.optional(AccountIdFilterList),
}) {}
export class CodeSecurityIntegrationSummary extends S.Class<CodeSecurityIntegrationSummary>(
  "CodeSecurityIntegrationSummary",
)({
  integrationArn: S.String,
  name: S.String,
  type: S.String,
  status: S.String,
  statusReason: S.String,
  createdOn: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdateOn: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  tags: S.optional(TagMap),
}) {}
export const IntegrationSummaries = S.Array(CodeSecurityIntegrationSummary);
export class CodeSecurityScanConfigurationAssociationSummary extends S.Class<CodeSecurityScanConfigurationAssociationSummary>(
  "CodeSecurityScanConfigurationAssociationSummary",
)({ resource: S.optional(CodeSecurityResource) }) {}
export const CodeSecurityScanConfigurationAssociationSummaries = S.Array(
  CodeSecurityScanConfigurationAssociationSummary,
);
export class CodeSecurityScanConfigurationSummary extends S.Class<CodeSecurityScanConfigurationSummary>(
  "CodeSecurityScanConfigurationSummary",
)({
  scanConfigurationArn: S.String,
  name: S.String,
  ownerAccountId: S.String,
  periodicScanFrequency: S.optional(S.String),
  frequencyExpression: S.optional(S.String),
  continuousIntegrationScanSupportedEvents: S.optional(
    ContinuousIntegrationScanSupportedEvents,
  ),
  ruleSetCategories: RuleSetCategories,
  scopeSettings: S.optional(ScopeSettings),
  tags: S.optional(TagMap),
}) {}
export const CodeSecurityScanConfigurationSummaries = S.Array(
  CodeSecurityScanConfigurationSummary,
);
export class Counts extends S.Class<Counts>("Counts")({
  count: S.optional(S.Number),
  groupKey: S.optional(S.String),
}) {}
export const CountsList = S.Array(Counts);
export class DelegatedAdminAccount extends S.Class<DelegatedAdminAccount>(
  "DelegatedAdminAccount",
)({ accountId: S.optional(S.String), status: S.optional(S.String) }) {}
export const DelegatedAdminAccountList = S.Array(DelegatedAdminAccount);
export class Filter extends S.Class<Filter>("Filter")({
  arn: S.String,
  ownerId: S.String,
  name: S.String,
  criteria: FilterCriteria,
  action: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  description: S.optional(S.String),
  reason: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const FilterList = S.Array(Filter);
export const AggregationRequest = S.Union(
  S.Struct({ accountAggregation: AccountAggregation }),
  S.Struct({ amiAggregation: AmiAggregation }),
  S.Struct({ awsEcrContainerAggregation: AwsEcrContainerAggregation }),
  S.Struct({ ec2InstanceAggregation: Ec2InstanceAggregation }),
  S.Struct({ findingTypeAggregation: FindingTypeAggregation }),
  S.Struct({ imageLayerAggregation: ImageLayerAggregation }),
  S.Struct({ packageAggregation: PackageAggregation }),
  S.Struct({ repositoryAggregation: RepositoryAggregation }),
  S.Struct({ titleAggregation: TitleAggregation }),
  S.Struct({ lambdaLayerAggregation: LambdaLayerAggregation }),
  S.Struct({ lambdaFunctionAggregation: LambdaFunctionAggregation }),
  S.Struct({ codeRepositoryAggregation: CodeRepositoryAggregation }),
);
export class StopCisSessionMessage extends S.Class<StopCisSessionMessage>(
  "StopCisSessionMessage",
)({
  status: S.String,
  reason: S.optional(S.String),
  progress: StopCisMessageProgress,
  computePlatform: S.optional(ComputePlatform),
  benchmarkVersion: S.optional(S.String),
  benchmarkProfile: S.optional(S.String),
}) {}
export const UpdateIntegrationDetails = S.Union(
  S.Struct({ gitlabSelfManaged: UpdateGitLabSelfManagedIntegrationDetail }),
  S.Struct({ github: UpdateGitHubIntegrationDetail }),
);
export class FailedAssociationResult extends S.Class<FailedAssociationResult>(
  "FailedAssociationResult",
)({
  scanConfigurationArn: S.optional(S.String),
  resource: S.optional(CodeSecurityResource),
  statusCode: S.optional(S.String),
  statusMessage: S.optional(S.String),
}) {}
export const FailedAssociationResultList = S.Array(FailedAssociationResult);
export class SuccessfulAssociationResult extends S.Class<SuccessfulAssociationResult>(
  "SuccessfulAssociationResult",
)({
  scanConfigurationArn: S.optional(S.String),
  resource: S.optional(CodeSecurityResource),
}) {}
export const SuccessfulAssociationResultList = S.Array(
  SuccessfulAssociationResult,
);
export class BatchDisassociateCodeSecurityScanConfigurationResponse extends S.Class<BatchDisassociateCodeSecurityScanConfigurationResponse>(
  "BatchDisassociateCodeSecurityScanConfigurationResponse",
)({
  failedAssociations: S.optional(FailedAssociationResultList),
  successfulAssociations: S.optional(SuccessfulAssociationResultList),
}) {}
export class BatchGetMemberEc2DeepInspectionStatusResponse extends S.Class<BatchGetMemberEc2DeepInspectionStatusResponse>(
  "BatchGetMemberEc2DeepInspectionStatusResponse",
)({
  accountIds: S.optional(MemberAccountEc2DeepInspectionStatusStateList),
  failedAccountIds: S.optional(
    FailedMemberAccountEc2DeepInspectionStatusStateList,
  ),
}) {}
export class BatchUpdateMemberEc2DeepInspectionStatusResponse extends S.Class<BatchUpdateMemberEc2DeepInspectionStatusResponse>(
  "BatchUpdateMemberEc2DeepInspectionStatusResponse",
)({
  accountIds: S.optional(MemberAccountEc2DeepInspectionStatusStateList),
  failedAccountIds: S.optional(
    FailedMemberAccountEc2DeepInspectionStatusStateList,
  ),
}) {}
export class CreateCodeSecurityIntegrationRequest extends S.Class<CreateCodeSecurityIntegrationRequest>(
  "CreateCodeSecurityIntegrationRequest",
)(
  {
    name: S.String,
    type: S.String,
    details: S.optional(CreateIntegrationDetail),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/integration/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCodeSecurityScanConfigurationRequest extends S.Class<CreateCodeSecurityScanConfigurationRequest>(
  "CreateCodeSecurityScanConfigurationRequest",
)(
  {
    name: S.String,
    level: S.String,
    configuration: CodeSecurityScanConfiguration,
    scopeSettings: S.optional(ScopeSettings),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/scan-configuration/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFilterRequest extends S.Class<CreateFilterRequest>(
  "CreateFilterRequest",
)(
  {
    action: S.String,
    description: S.optional(S.String),
    filterCriteria: FilterCriteria,
    name: S.String,
    tags: S.optional(TagMap),
    reason: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/filters/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFindingsReportResponse extends S.Class<CreateFindingsReportResponse>(
  "CreateFindingsReportResponse",
)({ reportId: S.optional(S.String) }) {}
export class CreateSbomExportRequest extends S.Class<CreateSbomExportRequest>(
  "CreateSbomExportRequest",
)(
  {
    resourceFilterCriteria: S.optional(ResourceFilterCriteria),
    reportFormat: S.String,
    s3Destination: Destination,
  },
  T.all(
    T.Http({ method: "POST", uri: "/sbomexport/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableResponse extends S.Class<DisableResponse>(
  "DisableResponse",
)({ accounts: AccountList, failedAccounts: S.optional(FailedAccountList) }) {}
export class GetCisScanResultDetailsRequest extends S.Class<GetCisScanResultDetailsRequest>(
  "GetCisScanResultDetailsRequest",
)(
  {
    scanArn: S.String,
    targetResourceId: S.String,
    accountId: S.String,
    filterCriteria: S.optional(CisScanResultDetailsFilterCriteria),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-result/details/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeSecurityScanResponse extends S.Class<GetCodeSecurityScanResponse>(
  "GetCodeSecurityScanResponse",
)({
  scanId: S.optional(S.String),
  resource: S.optional(CodeSecurityResource),
  accountId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastCommitId: S.optional(S.String),
}) {}
export class GetConfigurationResponse extends S.Class<GetConfigurationResponse>(
  "GetConfigurationResponse",
)({
  ecrConfiguration: S.optional(EcrConfigurationState),
  ec2Configuration: S.optional(Ec2ConfigurationState),
}) {}
export class GetMemberResponse extends S.Class<GetMemberResponse>(
  "GetMemberResponse",
)({ member: S.optional(Member) }) {}
export class ListAccountPermissionsResponse extends S.Class<ListAccountPermissionsResponse>(
  "ListAccountPermissionsResponse",
)({ permissions: Permissions, nextToken: S.optional(S.String) }) {}
export class ListCisScanConfigurationsRequest extends S.Class<ListCisScanConfigurationsRequest>(
  "ListCisScanConfigurationsRequest",
)(
  {
    filterCriteria: S.optional(ListCisScanConfigurationsFilterCriteria),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-configuration/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCisScanResultsAggregatedByChecksRequest extends S.Class<ListCisScanResultsAggregatedByChecksRequest>(
  "ListCisScanResultsAggregatedByChecksRequest",
)(
  {
    scanArn: S.String,
    filterCriteria: S.optional(CisScanResultsAggregatedByChecksFilterCriteria),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-result/check/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCisScanResultsAggregatedByTargetResourceRequest extends S.Class<ListCisScanResultsAggregatedByTargetResourceRequest>(
  "ListCisScanResultsAggregatedByTargetResourceRequest",
)(
  {
    scanArn: S.String,
    filterCriteria: S.optional(
      CisScanResultsAggregatedByTargetResourceFilterCriteria,
    ),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-result/resource/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCisScansRequest extends S.Class<ListCisScansRequest>(
  "ListCisScansRequest",
)(
  {
    filterCriteria: S.optional(ListCisScansFilterCriteria),
    detailLevel: S.optional(S.String),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeSecurityIntegrationsResponse extends S.Class<ListCodeSecurityIntegrationsResponse>(
  "ListCodeSecurityIntegrationsResponse",
)({
  integrations: S.optional(IntegrationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListCodeSecurityScanConfigurationAssociationsResponse extends S.Class<ListCodeSecurityScanConfigurationAssociationsResponse>(
  "ListCodeSecurityScanConfigurationAssociationsResponse",
)({
  associations: S.optional(CodeSecurityScanConfigurationAssociationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListCodeSecurityScanConfigurationsResponse extends S.Class<ListCodeSecurityScanConfigurationsResponse>(
  "ListCodeSecurityScanConfigurationsResponse",
)({
  configurations: S.optional(CodeSecurityScanConfigurationSummaries),
  nextToken: S.optional(S.String),
}) {}
export class ListCoverageRequest extends S.Class<ListCoverageRequest>(
  "ListCoverageRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filterCriteria: S.optional(CoverageFilterCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/coverage/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCoverageStatisticsResponse extends S.Class<ListCoverageStatisticsResponse>(
  "ListCoverageStatisticsResponse",
)({
  countsByGroup: S.optional(CountsList),
  totalCounts: S.Number,
  nextToken: S.optional(S.String),
}) {}
export class ListDelegatedAdminAccountsResponse extends S.Class<ListDelegatedAdminAccountsResponse>(
  "ListDelegatedAdminAccountsResponse",
)({
  delegatedAdminAccounts: S.optional(DelegatedAdminAccountList),
  nextToken: S.optional(S.String),
}) {}
export class ListFiltersResponse extends S.Class<ListFiltersResponse>(
  "ListFiltersResponse",
)({ filters: FilterList, nextToken: S.optional(S.String) }) {}
export class ListFindingAggregationsRequest extends S.Class<ListFindingAggregationsRequest>(
  "ListFindingAggregationsRequest",
)(
  {
    aggregationType: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    accountIds: S.optional(StringFilterList),
    aggregationRequest: S.optional(AggregationRequest),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findings/aggregation/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCisSessionRequest extends S.Class<StopCisSessionRequest>(
  "StopCisSessionRequest",
)(
  {
    scanJobId: S.String,
    sessionToken: S.String,
    message: StopCisSessionMessage,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cissession/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCisSessionResponse extends S.Class<StopCisSessionResponse>(
  "StopCisSessionResponse",
)({}) {}
export class UpdateCisScanConfigurationResponse extends S.Class<UpdateCisScanConfigurationResponse>(
  "UpdateCisScanConfigurationResponse",
)({ scanConfigurationArn: S.String }) {}
export class UpdateCodeSecurityIntegrationRequest extends S.Class<UpdateCodeSecurityIntegrationRequest>(
  "UpdateCodeSecurityIntegrationRequest",
)(
  { integrationArn: S.String, details: UpdateIntegrationDetails },
  T.all(
    T.Http({ method: "POST", uri: "/codesecurity/integration/update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class State extends S.Class<State>("State")({
  status: S.String,
  errorCode: S.String,
  errorMessage: S.String,
}) {}
export class ResourceState extends S.Class<ResourceState>("ResourceState")({
  ec2: State,
  ecr: State,
  lambda: S.optional(State),
  lambdaCode: S.optional(State),
  codeRepository: S.optional(State),
}) {}
export class CodeLine extends S.Class<CodeLine>("CodeLine")({
  content: S.String,
  lineNumber: S.Number,
}) {}
export const CodeLineList = S.Array(CodeLine);
export class SuggestedFix extends S.Class<SuggestedFix>("SuggestedFix")({
  description: S.optional(S.String),
  code: S.optional(S.String),
}) {}
export const SuggestedFixes = S.Array(SuggestedFix);
export class CisaData extends S.Class<CisaData>("CisaData")({
  dateAdded: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dateDue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  action: S.optional(S.String),
}) {}
export class Evidence extends S.Class<Evidence>("Evidence")({
  evidenceRule: S.optional(S.String),
  evidenceDetail: S.optional(S.String),
  severity: S.optional(S.String),
}) {}
export const EvidenceList = S.Array(Evidence);
export class ExploitObserved extends S.Class<ExploitObserved>(
  "ExploitObserved",
)({
  lastSeen: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  firstSeen: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class FreeTrialInfo extends S.Class<FreeTrialInfo>("FreeTrialInfo")({
  type: S.String,
  start: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  end: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
}) {}
export const FreeTrialInfoList = S.Array(FreeTrialInfo);
export class Usage extends S.Class<Usage>("Usage")({
  type: S.optional(S.String),
  total: S.optional(S.Number),
  estimatedMonthlyCost: S.optional(S.Number),
  currency: S.optional(S.String),
}) {}
export const UsageList = S.Array(Usage);
export const RelatedVulnerabilities = S.Array(S.String);
export const DetectionPlatforms = S.Array(S.String);
export class AccountState extends S.Class<AccountState>("AccountState")({
  accountId: S.String,
  state: State,
  resourceState: ResourceState,
}) {}
export const AccountStateList = S.Array(AccountState);
export class CodeSnippetResult extends S.Class<CodeSnippetResult>(
  "CodeSnippetResult",
)({
  findingArn: S.optional(S.String),
  startLine: S.optional(S.Number),
  endLine: S.optional(S.Number),
  codeSnippet: S.optional(CodeLineList),
  suggestedFixes: S.optional(SuggestedFixes),
}) {}
export const CodeSnippetResultList = S.Array(CodeSnippetResult);
export class FindingDetail extends S.Class<FindingDetail>("FindingDetail")({
  findingArn: S.optional(S.String),
  cisaData: S.optional(CisaData),
  riskScore: S.optional(S.Number),
  evidences: S.optional(EvidenceList),
  ttps: S.optional(Ttps),
  tools: S.optional(Tools),
  exploitObserved: S.optional(ExploitObserved),
  referenceUrls: S.optional(VulnerabilityReferenceUrls),
  cwes: S.optional(Cwes),
  epssScore: S.optional(S.Number),
}) {}
export const FindingDetails = S.Array(FindingDetail);
export class FreeTrialAccountInfo extends S.Class<FreeTrialAccountInfo>(
  "FreeTrialAccountInfo",
)({ accountId: S.String, freeTrialInfo: FreeTrialInfoList }) {}
export const FreeTrialAccountInfoList = S.Array(FreeTrialAccountInfo);
export class UsageTotal extends S.Class<UsageTotal>("UsageTotal")({
  accountId: S.optional(S.String),
  usage: S.optional(UsageList),
}) {}
export const UsageTotalList = S.Array(UsageTotal);
export const VulnerabilityIdList = S.Array(S.String);
export const NonEmptyStringList = S.Array(S.String);
export const DetectorTagList = S.Array(S.String);
export const ReferenceUrls = S.Array(S.String);
export const CweList = S.Array(S.String);
export const Targets = S.Array(S.String);
export class BatchAssociateCodeSecurityScanConfigurationResponse extends S.Class<BatchAssociateCodeSecurityScanConfigurationResponse>(
  "BatchAssociateCodeSecurityScanConfigurationResponse",
)({
  failedAssociations: S.optional(FailedAssociationResultList),
  successfulAssociations: S.optional(SuccessfulAssociationResultList),
}) {}
export class BatchGetAccountStatusResponse extends S.Class<BatchGetAccountStatusResponse>(
  "BatchGetAccountStatusResponse",
)({
  accounts: AccountStateList,
  failedAccounts: S.optional(FailedAccountList),
}) {}
export class BatchGetCodeSnippetResponse extends S.Class<BatchGetCodeSnippetResponse>(
  "BatchGetCodeSnippetResponse",
)({
  codeSnippetResults: S.optional(CodeSnippetResultList),
  errors: S.optional(CodeSnippetErrorList),
}) {}
export class BatchGetFindingDetailsResponse extends S.Class<BatchGetFindingDetailsResponse>(
  "BatchGetFindingDetailsResponse",
)({
  findingDetails: S.optional(FindingDetails),
  errors: S.optional(FindingDetailsErrorList),
}) {}
export class BatchGetFreeTrialInfoResponse extends S.Class<BatchGetFreeTrialInfoResponse>(
  "BatchGetFreeTrialInfoResponse",
)({
  accounts: FreeTrialAccountInfoList,
  failedAccounts: FreeTrialInfoErrorList,
}) {}
export class CreateCisScanConfigurationRequest extends S.Class<CreateCisScanConfigurationRequest>(
  "CreateCisScanConfigurationRequest",
)(
  {
    scanName: S.String,
    securityLevel: S.String,
    schedule: Schedule,
    targets: CreateCisTargets,
    tags: S.optional(CisTagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/cis/scan-configuration/create" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCodeSecurityIntegrationResponse extends S.Class<CreateCodeSecurityIntegrationResponse>(
  "CreateCodeSecurityIntegrationResponse",
)({
  integrationArn: S.String,
  status: S.String,
  authorizationUrl: S.optional(S.String),
}) {}
export class CreateCodeSecurityScanConfigurationResponse extends S.Class<CreateCodeSecurityScanConfigurationResponse>(
  "CreateCodeSecurityScanConfigurationResponse",
)({ scanConfigurationArn: S.String }) {}
export class CreateFilterResponse extends S.Class<CreateFilterResponse>(
  "CreateFilterResponse",
)({ arn: S.String }) {}
export class CreateSbomExportResponse extends S.Class<CreateSbomExportResponse>(
  "CreateSbomExportResponse",
)({ reportId: S.optional(S.String) }) {}
export class ListUsageTotalsResponse extends S.Class<ListUsageTotalsResponse>(
  "ListUsageTotalsResponse",
)({ nextToken: S.optional(S.String), totals: S.optional(UsageTotalList) }) {}
export class UpdateCodeSecurityIntegrationResponse extends S.Class<UpdateCodeSecurityIntegrationResponse>(
  "UpdateCodeSecurityIntegrationResponse",
)({ integrationArn: S.String, status: S.String }) {}
export class ExploitabilityDetails extends S.Class<ExploitabilityDetails>(
  "ExploitabilityDetails",
)({
  lastKnownExploitAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class EpssDetails extends S.Class<EpssDetails>("EpssDetails")({
  score: S.optional(S.Number),
}) {}
export class AtigData extends S.Class<AtigData>("AtigData")({
  firstSeen: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastSeen: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  targets: S.optional(Targets),
  ttps: S.optional(Ttps),
}) {}
export class Cvss4 extends S.Class<Cvss4>("Cvss4")({
  baseScore: S.optional(S.Number),
  scoringVector: S.optional(S.String),
}) {}
export class Cvss3 extends S.Class<Cvss3>("Cvss3")({
  baseScore: S.optional(S.Number),
  scoringVector: S.optional(S.String),
}) {}
export class Cvss2 extends S.Class<Cvss2>("Cvss2")({
  baseScore: S.optional(S.Number),
  scoringVector: S.optional(S.String),
}) {}
export class Epss extends S.Class<Epss>("Epss")({
  score: S.optional(S.Number),
}) {}
export class CisScanResultDetails extends S.Class<CisScanResultDetails>(
  "CisScanResultDetails",
)({
  scanArn: S.String,
  accountId: S.optional(S.String),
  targetResourceId: S.optional(S.String),
  platform: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  checkId: S.optional(S.String),
  title: S.optional(S.String),
  checkDescription: S.optional(S.String),
  remediation: S.optional(S.String),
  level: S.optional(S.String),
  findingArn: S.optional(S.String),
}) {}
export const CisScanResultDetailsList = S.Array(CisScanResultDetails);
export class StatusCounts extends S.Class<StatusCounts>("StatusCounts")({
  failed: S.optional(S.Number),
  skipped: S.optional(S.Number),
  passed: S.optional(S.Number),
}) {}
export class CisTargetResourceAggregation extends S.Class<CisTargetResourceAggregation>(
  "CisTargetResourceAggregation",
)({
  scanArn: S.String,
  targetResourceId: S.optional(S.String),
  accountId: S.optional(S.String),
  targetResourceTags: S.optional(TargetResourceTags),
  statusCounts: S.optional(StatusCounts),
  platform: S.optional(S.String),
  targetStatus: S.optional(S.String),
  targetStatusReason: S.optional(S.String),
}) {}
export const CisTargetResourceAggregationList = S.Array(
  CisTargetResourceAggregation,
);
export const CisAccountIdList = S.Array(S.String);
export class CisTargets extends S.Class<CisTargets>("CisTargets")({
  accountIds: S.optional(CisAccountIdList),
  targetResourceTags: S.optional(TargetResourceTags),
}) {}
export class CisScan extends S.Class<CisScan>("CisScan")({
  scanArn: S.String,
  scanConfigurationArn: S.String,
  status: S.optional(S.String),
  scanName: S.optional(S.String),
  scanDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  failedChecks: S.optional(S.Number),
  totalChecks: S.optional(S.Number),
  targets: S.optional(CisTargets),
  scheduledBy: S.optional(S.String),
  securityLevel: S.optional(S.String),
}) {}
export const CisScanList = S.Array(CisScan);
export class Vulnerability extends S.Class<Vulnerability>("Vulnerability")({
  id: S.String,
  cwes: S.optional(Cwes),
  cisaData: S.optional(CisaData),
  source: S.optional(S.String),
  description: S.optional(S.String),
  atigData: S.optional(AtigData),
  vendorSeverity: S.optional(S.String),
  cvss4: S.optional(Cvss4),
  cvss3: S.optional(Cvss3),
  relatedVulnerabilities: S.optional(RelatedVulnerabilities),
  cvss2: S.optional(Cvss2),
  vendorCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vendorUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  sourceUrl: S.optional(S.String),
  referenceUrls: S.optional(VulnerabilityReferenceUrls),
  exploitObserved: S.optional(ExploitObserved),
  detectionPlatforms: S.optional(DetectionPlatforms),
  epss: S.optional(Epss),
}) {}
export const Vulnerabilities = S.Array(Vulnerability);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFields = S.Array(ValidationExceptionField);
export const StringList = S.Array(S.String);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  text: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export class PortRange extends S.Class<PortRange>("PortRange")({
  begin: S.Number,
  end: S.Number,
}) {}
export class VulnerablePackage extends S.Class<VulnerablePackage>(
  "VulnerablePackage",
)({
  name: S.String,
  version: S.String,
  sourceLayerHash: S.optional(S.String),
  epoch: S.optional(S.Number),
  release: S.optional(S.String),
  arch: S.optional(S.String),
  packageManager: S.optional(S.String),
  filePath: S.optional(S.String),
  fixedInVersion: S.optional(S.String),
  remediation: S.optional(S.String),
  sourceLambdaLayerArn: S.optional(S.String),
}) {}
export const VulnerablePackageList = S.Array(VulnerablePackage);
export class CvssScore extends S.Class<CvssScore>("CvssScore")({
  baseScore: S.Number,
  scoringVector: S.String,
  version: S.String,
  source: S.String,
}) {}
export const CvssScoreList = S.Array(CvssScore);
export class CodeFilePath extends S.Class<CodeFilePath>("CodeFilePath")({
  fileName: S.String,
  filePath: S.String,
  startLine: S.Number,
  endLine: S.Number,
}) {}
export class CreateCisScanConfigurationResponse extends S.Class<CreateCisScanConfigurationResponse>(
  "CreateCisScanConfigurationResponse",
)({ scanConfigurationArn: S.optional(S.String) }) {}
export class GetCisScanResultDetailsResponse extends S.Class<GetCisScanResultDetailsResponse>(
  "GetCisScanResultDetailsResponse",
)({
  scanResultDetails: S.optional(CisScanResultDetailsList),
  nextToken: S.optional(S.String),
}) {}
export class ListCisScanResultsAggregatedByTargetResourceResponse extends S.Class<ListCisScanResultsAggregatedByTargetResourceResponse>(
  "ListCisScanResultsAggregatedByTargetResourceResponse",
)({
  targetResourceAggregations: S.optional(CisTargetResourceAggregationList),
  nextToken: S.optional(S.String),
}) {}
export class ListCisScansResponse extends S.Class<ListCisScansResponse>(
  "ListCisScansResponse",
)({ scans: S.optional(CisScanList), nextToken: S.optional(S.String) }) {}
export const IpV4AddressList = S.Array(S.String);
export const IpV6AddressList = S.Array(S.String);
export const ImageTagList = S.Array(S.String);
export const LayerList = S.Array(S.String);
export const ArchitectureList = S.Array(S.String);
export class SearchVulnerabilitiesResponse extends S.Class<SearchVulnerabilitiesResponse>(
  "SearchVulnerabilitiesResponse",
)({ vulnerabilities: Vulnerabilities, nextToken: S.optional(S.String) }) {}
export class ScanStatus extends S.Class<ScanStatus>("ScanStatus")({
  statusCode: S.String,
  reason: S.String,
}) {}
export class SeverityCounts extends S.Class<SeverityCounts>("SeverityCounts")({
  all: S.optional(S.Number),
  medium: S.optional(S.Number),
  high: S.optional(S.Number),
  critical: S.optional(S.Number),
}) {}
export class AmiAggregationResponse extends S.Class<AmiAggregationResponse>(
  "AmiAggregationResponse",
)({
  ami: S.String,
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  affectedInstances: S.optional(S.Number),
}) {}
export class AwsEcrContainerAggregationResponse extends S.Class<AwsEcrContainerAggregationResponse>(
  "AwsEcrContainerAggregationResponse",
)({
  resourceId: S.String,
  imageSha: S.optional(S.String),
  repository: S.optional(S.String),
  architecture: S.optional(S.String),
  imageTags: S.optional(StringList),
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  lastInUseAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inUseCount: S.optional(S.Number),
}) {}
export class Ec2InstanceAggregationResponse extends S.Class<Ec2InstanceAggregationResponse>(
  "Ec2InstanceAggregationResponse",
)({
  instanceId: S.String,
  ami: S.optional(S.String),
  operatingSystem: S.optional(S.String),
  instanceTags: S.optional(TagMap),
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  networkFindings: S.optional(S.Number),
}) {}
export class FindingTypeAggregationResponse extends S.Class<FindingTypeAggregationResponse>(
  "FindingTypeAggregationResponse",
)({
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  exploitAvailableCount: S.optional(S.Number),
  fixAvailableCount: S.optional(S.Number),
}) {}
export class ImageLayerAggregationResponse extends S.Class<ImageLayerAggregationResponse>(
  "ImageLayerAggregationResponse",
)({
  repository: S.String,
  resourceId: S.String,
  layerHash: S.String,
  accountId: S.String,
  severityCounts: S.optional(SeverityCounts),
}) {}
export class PackageAggregationResponse extends S.Class<PackageAggregationResponse>(
  "PackageAggregationResponse",
)({
  packageName: S.String,
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class RepositoryAggregationResponse extends S.Class<RepositoryAggregationResponse>(
  "RepositoryAggregationResponse",
)({
  repository: S.String,
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  affectedImages: S.optional(S.Number),
}) {}
export class TitleAggregationResponse extends S.Class<TitleAggregationResponse>(
  "TitleAggregationResponse",
)({
  title: S.String,
  vulnerabilityId: S.optional(S.String),
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class LambdaLayerAggregationResponse extends S.Class<LambdaLayerAggregationResponse>(
  "LambdaLayerAggregationResponse",
)({
  functionName: S.String,
  resourceId: S.String,
  layerArn: S.String,
  accountId: S.String,
  severityCounts: S.optional(SeverityCounts),
}) {}
export class LambdaFunctionAggregationResponse extends S.Class<LambdaFunctionAggregationResponse>(
  "LambdaFunctionAggregationResponse",
)({
  resourceId: S.String,
  functionName: S.optional(S.String),
  runtime: S.optional(S.String),
  lambdaTags: S.optional(TagMap),
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CodeRepositoryAggregationResponse extends S.Class<CodeRepositoryAggregationResponse>(
  "CodeRepositoryAggregationResponse",
)({
  projectNames: S.String,
  providerType: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  exploitAvailableActiveFindingsCount: S.optional(S.Number),
  fixAvailableActiveFindingsCount: S.optional(S.Number),
  accountId: S.optional(S.String),
  resourceId: S.optional(S.String),
}) {}
export class Remediation extends S.Class<Remediation>("Remediation")({
  recommendation: S.optional(Recommendation),
}) {}
export class PackageVulnerabilityDetails extends S.Class<PackageVulnerabilityDetails>(
  "PackageVulnerabilityDetails",
)({
  vulnerabilityId: S.String,
  vulnerablePackages: S.optional(VulnerablePackageList),
  source: S.String,
  cvss: S.optional(CvssScoreList),
  relatedVulnerabilities: S.optional(VulnerabilityIdList),
  sourceUrl: S.optional(S.String),
  vendorSeverity: S.optional(S.String),
  vendorCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vendorUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  referenceUrls: S.optional(NonEmptyStringList),
}) {}
export class CodeVulnerabilityDetails extends S.Class<CodeVulnerabilityDetails>(
  "CodeVulnerabilityDetails",
)({
  filePath: CodeFilePath,
  detectorTags: S.optional(DetectorTagList),
  referenceUrls: S.optional(ReferenceUrls),
  ruleId: S.optional(S.String),
  sourceLambdaLayerArn: S.optional(S.String),
  detectorId: S.String,
  detectorName: S.String,
  cwes: CweList,
}) {}
export class AwsEcsMetadataDetails extends S.Class<AwsEcsMetadataDetails>(
  "AwsEcsMetadataDetails",
)({ detailsGroup: S.String, taskDefinitionArn: S.String }) {}
export const TagList = S.Array(S.String);
export const LambdaLayerList = S.Array(S.String);
export class AwsEc2InstanceDetails extends S.Class<AwsEc2InstanceDetails>(
  "AwsEc2InstanceDetails",
)({
  type: S.optional(S.String),
  imageId: S.optional(S.String),
  ipV4Addresses: S.optional(IpV4AddressList),
  ipV6Addresses: S.optional(IpV6AddressList),
  keyName: S.optional(S.String),
  iamInstanceProfileArn: S.optional(S.String),
  vpcId: S.optional(S.String),
  subnetId: S.optional(S.String),
  launchedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  platform: S.optional(S.String),
}) {}
export class AwsEcrContainerImageDetails extends S.Class<AwsEcrContainerImageDetails>(
  "AwsEcrContainerImageDetails",
)({
  repositoryName: S.String,
  imageTags: S.optional(ImageTagList),
  pushedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  author: S.optional(S.String),
  architecture: S.optional(S.String),
  imageHash: S.String,
  registry: S.String,
  platform: S.optional(S.String),
  lastInUseAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inUseCount: S.optional(S.Number),
}) {}
export class CodeRepositoryDetails extends S.Class<CodeRepositoryDetails>(
  "CodeRepositoryDetails",
)({
  projectName: S.optional(S.String),
  integrationArn: S.optional(S.String),
  providerType: S.optional(S.String),
}) {}
export class CvssScoreAdjustment extends S.Class<CvssScoreAdjustment>(
  "CvssScoreAdjustment",
)({ metric: S.String, reason: S.String }) {}
export const CvssScoreAdjustmentList = S.Array(CvssScoreAdjustment);
export class Step extends S.Class<Step>("Step")({
  componentId: S.String,
  componentType: S.String,
  componentArn: S.optional(S.String),
}) {}
export const StepList = S.Array(Step);
export class CisScanConfiguration extends S.Class<CisScanConfiguration>(
  "CisScanConfiguration",
)({
  scanConfigurationArn: S.String,
  ownerId: S.optional(S.String),
  scanName: S.optional(S.String),
  securityLevel: S.optional(S.String),
  schedule: S.optional(Schedule),
  targets: S.optional(CisTargets),
  tags: S.optional(CisTagMap),
}) {}
export const CisScanConfigurationList = S.Array(CisScanConfiguration);
export class CisCheckAggregation extends S.Class<CisCheckAggregation>(
  "CisCheckAggregation",
)({
  scanArn: S.String,
  checkId: S.optional(S.String),
  title: S.optional(S.String),
  checkDescription: S.optional(S.String),
  level: S.optional(S.String),
  accountId: S.optional(S.String),
  statusCounts: S.optional(StatusCounts),
  platform: S.optional(S.String),
}) {}
export const CisCheckAggregationList = S.Array(CisCheckAggregation);
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export class EcrRepositoryMetadata extends S.Class<EcrRepositoryMetadata>(
  "EcrRepositoryMetadata",
)({ name: S.optional(S.String), scanFrequency: S.optional(S.String) }) {}
export class EcrContainerImageMetadata extends S.Class<EcrContainerImageMetadata>(
  "EcrContainerImageMetadata",
)({
  tags: S.optional(TagList),
  imagePulledAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastInUseAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inUseCount: S.optional(S.Number),
}) {}
export class Ec2Metadata extends S.Class<Ec2Metadata>("Ec2Metadata")({
  tags: S.optional(TagMap),
  amiId: S.optional(S.String),
  platform: S.optional(S.String),
}) {}
export class LambdaFunctionMetadata extends S.Class<LambdaFunctionMetadata>(
  "LambdaFunctionMetadata",
)({
  functionTags: S.optional(TagMap),
  layers: S.optional(LambdaLayerList),
  functionName: S.optional(S.String),
  runtime: S.optional(S.String),
}) {}
export class CvssScoreDetails extends S.Class<CvssScoreDetails>(
  "CvssScoreDetails",
)({
  scoreSource: S.String,
  cvssSource: S.optional(S.String),
  version: S.String,
  score: S.Number,
  scoringVector: S.String,
  adjustments: S.optional(CvssScoreAdjustmentList),
}) {}
export class NetworkPath extends S.Class<NetworkPath>("NetworkPath")({
  steps: S.optional(StepList),
}) {}
export class AwsEksWorkloadInfo extends S.Class<AwsEksWorkloadInfo>(
  "AwsEksWorkloadInfo",
)({ name: S.String, type: S.String }) {}
export const AwsEksWorkloadInfoList = S.Array(AwsEksWorkloadInfo);
export class ListCisScanConfigurationsResponse extends S.Class<ListCisScanConfigurationsResponse>(
  "ListCisScanConfigurationsResponse",
)({
  scanConfigurations: S.optional(CisScanConfigurationList),
  nextToken: S.optional(S.String),
}) {}
export class ListCisScanResultsAggregatedByChecksResponse extends S.Class<ListCisScanResultsAggregatedByChecksResponse>(
  "ListCisScanResultsAggregatedByChecksResponse",
)({
  checkAggregations: S.optional(CisCheckAggregationList),
  nextToken: S.optional(S.String),
}) {}
export class LambdaVpcConfig extends S.Class<LambdaVpcConfig>(
  "LambdaVpcConfig",
)({
  subnetIds: S.optional(SubnetIdList),
  securityGroupIds: S.optional(SecurityGroupIdList),
  vpcId: S.optional(S.String),
}) {}
export class AccountAggregationResponse extends S.Class<AccountAggregationResponse>(
  "AccountAggregationResponse",
)({
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
  exploitAvailableCount: S.optional(S.Number),
  fixAvailableCount: S.optional(S.Number),
}) {}
export class InspectorScoreDetails extends S.Class<InspectorScoreDetails>(
  "InspectorScoreDetails",
)({ adjustedCvss: S.optional(CvssScoreDetails) }) {}
export class NetworkReachabilityDetails extends S.Class<NetworkReachabilityDetails>(
  "NetworkReachabilityDetails",
)({ openPortRange: PortRange, protocol: S.String, networkPath: NetworkPath }) {}
export class AwsEksMetadataDetails extends S.Class<AwsEksMetadataDetails>(
  "AwsEksMetadataDetails",
)({
  namespace: S.optional(S.String),
  workloadInfoList: S.optional(AwsEksWorkloadInfoList),
}) {}
export class CodeRepositoryOnDemandScan extends S.Class<CodeRepositoryOnDemandScan>(
  "CodeRepositoryOnDemandScan",
)({
  lastScannedCommitId: S.optional(S.String),
  lastScanAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  scanStatus: S.optional(ScanStatus),
}) {}
export class AwsLambdaFunctionDetails extends S.Class<AwsLambdaFunctionDetails>(
  "AwsLambdaFunctionDetails",
)({
  functionName: S.String,
  runtime: S.String,
  codeSha256: S.String,
  version: S.String,
  executionRoleArn: S.String,
  layers: S.optional(LayerList),
  vpcConfig: S.optional(LambdaVpcConfig),
  packageType: S.optional(S.String),
  architectures: S.optional(ArchitectureList),
  lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AggregationResponse = S.Union(
  S.Struct({ accountAggregation: AccountAggregationResponse }),
  S.Struct({ amiAggregation: AmiAggregationResponse }),
  S.Struct({ awsEcrContainerAggregation: AwsEcrContainerAggregationResponse }),
  S.Struct({ ec2InstanceAggregation: Ec2InstanceAggregationResponse }),
  S.Struct({ findingTypeAggregation: FindingTypeAggregationResponse }),
  S.Struct({ imageLayerAggregation: ImageLayerAggregationResponse }),
  S.Struct({ packageAggregation: PackageAggregationResponse }),
  S.Struct({ repositoryAggregation: RepositoryAggregationResponse }),
  S.Struct({ titleAggregation: TitleAggregationResponse }),
  S.Struct({ lambdaLayerAggregation: LambdaLayerAggregationResponse }),
  S.Struct({ lambdaFunctionAggregation: LambdaFunctionAggregationResponse }),
  S.Struct({ codeRepositoryAggregation: CodeRepositoryAggregationResponse }),
);
export const AggregationResponseList = S.Array(AggregationResponse);
export const ClusterMetadata = S.Union(
  S.Struct({ awsEcsMetadataDetails: AwsEcsMetadataDetails }),
  S.Struct({ awsEksMetadataDetails: AwsEksMetadataDetails }),
);
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({
  awsEc2Instance: S.optional(AwsEc2InstanceDetails),
  awsEcrContainerImage: S.optional(AwsEcrContainerImageDetails),
  awsLambdaFunction: S.optional(AwsLambdaFunctionDetails),
  codeRepository: S.optional(CodeRepositoryDetails),
}) {}
export class ProjectPeriodicScanConfiguration extends S.Class<ProjectPeriodicScanConfiguration>(
  "ProjectPeriodicScanConfiguration",
)({
  frequencyExpression: S.optional(S.String),
  ruleSetCategories: S.optional(RuleSetCategories),
}) {}
export const ProjectPeriodicScanConfigurationList = S.Array(
  ProjectPeriodicScanConfiguration,
);
export class ProjectContinuousIntegrationScanConfiguration extends S.Class<ProjectContinuousIntegrationScanConfiguration>(
  "ProjectContinuousIntegrationScanConfiguration",
)({
  supportedEvent: S.optional(S.String),
  ruleSetCategories: S.optional(RuleSetCategories),
}) {}
export const ProjectContinuousIntegrationScanConfigurationList = S.Array(
  ProjectContinuousIntegrationScanConfiguration,
);
export class ListFindingAggregationsResponse extends S.Class<ListFindingAggregationsResponse>(
  "ListFindingAggregationsResponse",
)({
  aggregationType: S.String,
  responses: S.optional(AggregationResponseList),
  nextToken: S.optional(S.String),
}) {}
export class ClusterDetails extends S.Class<ClusterDetails>("ClusterDetails")({
  lastInUse: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  runningUnitCount: S.optional(S.Number),
  stoppedUnitCount: S.optional(S.Number),
  clusterMetadata: ClusterMetadata,
}) {}
export const ClusterDetailsList = S.Array(ClusterDetails);
export class Resource extends S.Class<Resource>("Resource")({
  type: S.String,
  id: S.String,
  partition: S.optional(S.String),
  region: S.optional(S.String),
  tags: S.optional(TagMap),
  details: S.optional(ResourceDetails),
}) {}
export const ResourceList = S.Array(Resource);
export class ProjectCodeSecurityScanConfiguration extends S.Class<ProjectCodeSecurityScanConfiguration>(
  "ProjectCodeSecurityScanConfiguration",
)({
  periodicScanConfigurations: S.optional(ProjectPeriodicScanConfigurationList),
  continuousIntegrationScanConfigurations: S.optional(
    ProjectContinuousIntegrationScanConfigurationList,
  ),
}) {}
export class ClusterInformation extends S.Class<ClusterInformation>(
  "ClusterInformation",
)({ clusterArn: S.String, clusterDetails: S.optional(ClusterDetailsList) }) {}
export const ClusterInformationList = S.Array(ClusterInformation);
export class Finding extends S.Class<Finding>("Finding")({
  findingArn: S.String,
  awsAccountId: S.String,
  type: S.String,
  description: S.String,
  title: S.optional(S.String),
  remediation: Remediation,
  severity: S.String,
  firstObservedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastObservedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.String,
  resources: ResourceList,
  inspectorScore: S.optional(S.Number),
  inspectorScoreDetails: S.optional(InspectorScoreDetails),
  networkReachabilityDetails: S.optional(NetworkReachabilityDetails),
  packageVulnerabilityDetails: S.optional(PackageVulnerabilityDetails),
  fixAvailable: S.optional(S.String),
  exploitAvailable: S.optional(S.String),
  exploitabilityDetails: S.optional(ExploitabilityDetails),
  codeVulnerabilityDetails: S.optional(CodeVulnerabilityDetails),
  epss: S.optional(EpssDetails),
}) {}
export const FindingList = S.Array(Finding);
export class CodeRepositoryMetadata extends S.Class<CodeRepositoryMetadata>(
  "CodeRepositoryMetadata",
)({
  projectName: S.String,
  integrationArn: S.optional(S.String),
  providerType: S.String,
  providerTypeVisibility: S.String,
  lastScannedCommitId: S.optional(S.String),
  scanConfiguration: S.optional(ProjectCodeSecurityScanConfiguration),
  onDemandScan: S.optional(CodeRepositoryOnDemandScan),
}) {}
export class GetClustersForImageResponse extends S.Class<GetClustersForImageResponse>(
  "GetClustersForImageResponse",
)({ cluster: ClusterInformationList, nextToken: S.optional(S.String) }) {}
export class ListFindingsResponse extends S.Class<ListFindingsResponse>(
  "ListFindingsResponse",
)({ nextToken: S.optional(S.String), findings: S.optional(FindingList) }) {}
export class ResourceScanMetadata extends S.Class<ResourceScanMetadata>(
  "ResourceScanMetadata",
)({
  ecrRepository: S.optional(EcrRepositoryMetadata),
  ecrImage: S.optional(EcrContainerImageMetadata),
  ec2: S.optional(Ec2Metadata),
  lambdaFunction: S.optional(LambdaFunctionMetadata),
  codeRepository: S.optional(CodeRepositoryMetadata),
}) {}
export class CoveredResource extends S.Class<CoveredResource>(
  "CoveredResource",
)({
  resourceType: S.String,
  resourceId: S.String,
  accountId: S.String,
  scanType: S.String,
  scanStatus: S.optional(ScanStatus),
  resourceMetadata: S.optional(ResourceScanMetadata),
  lastScannedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  scanMode: S.optional(S.String),
}) {}
export const CoveredResources = S.Array(CoveredResource);
export class ListCoverageResponse extends S.Class<ListCoverageResponse>(
  "ListCoverageResponse",
)({
  nextToken: S.optional(S.String),
  coveredResources: S.optional(CoveredResources),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
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
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, resourceId: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fields: S.optional(ValidationExceptionFields),
  },
) {}

//# Operations
/**
 * Retrieves the activation status of Amazon Inspector deep inspection and custom paths associated
 * with your account.
 */
export const getEc2DeepInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEc2DeepInspectionConfigurationRequest,
    output: GetEc2DeepInspectionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves setting configurations for Inspector scans.
 */
export const getConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfigurationRequest,
  output: GetConfigurationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates setting configurations for your Amazon Inspector account. When you use this API as an Amazon Inspector
 * delegated administrator this updates the setting for all accounts you manage. Member
 * accounts in an organization cannot update this setting.
 */
export const updateConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationRequest,
  output: UpdateConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates an Amazon Web Services account with an Amazon Inspector delegated administrator. An HTTP 200 response
 * indicates the association was successfully started, but doesn’t indicate whether it was
 * completed. You can check if the association completed by using ListMembers for multiple
 * accounts or GetMembers for a single account.
 */
export const associateMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateMemberRequest,
  output: AssociateMemberResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a CIS session. This API is used by the Amazon Inspector SSM plugin to
 * communicate with the Amazon Inspector service. The Amazon Inspector SSM plugin calls
 * this API to start a CIS scan session for the scan ID supplied by the service.
 */
export const startCisSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCisSessionRequest,
  output: StartCisSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Initiates a code security scan on a specified repository.
 */
export const startCodeSecurityScan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCodeSecurityScanRequest,
    output: StartCodeSecurityScanResponse,
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
 * Updates an existing code security scan configuration.
 */
export const updateCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCodeSecurityScanConfigurationRequest,
    output: UpdateCodeSecurityScanConfigurationResponse,
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
 * Sends a CIS session health. This API is used by the Amazon Inspector SSM plugin to
 * communicate with the Amazon Inspector service. The Amazon Inspector SSM plugin calls
 * this API to start a CIS scan session for the scan ID supplied by the service.
 */
export const sendCisSessionHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendCisSessionHealthRequest,
    output: SendCisSessionHealthResponse,
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
 * Disables the Amazon Inspector delegated administrator for your organization.
 */
export const disableDelegatedAdminAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableDelegatedAdminAccountRequest,
    output: DisableDelegatedAdminAccountResponse,
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
 * Enables the Amazon Inspector delegated administrator for your Organizations organization.
 */
export const enableDelegatedAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableDelegatedAdminAccountRequest,
    output: EnableDelegatedAdminAccountResponse,
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
 * Disassociates multiple code repositories from an Amazon Inspector code security scan
 * configuration.
 */
export const batchDisassociateCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDisassociateCodeSecurityScanConfigurationRequest,
    output: BatchDisassociateCodeSecurityScanConfigurationResponse,
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
 * Retrieves information about a specific code security scan.
 */
export const getCodeSecurityScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodeSecurityScanRequest,
  output: GetCodeSecurityScanResponse,
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
 * Specifies the action that is to be applied to the findings that match the filter.
 */
export const updateFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFilterRequest,
  output: UpdateFilterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Resets an encryption key. After the key is reset your resources will be encrypted by an
 * Amazon Web Services owned key.
 */
export const resetEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetEncryptionKeyRequest,
  output: ResetEncryptionKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an encryption key. A `ResourceNotFoundException` means that an
 * Amazon Web Services owned key is being used for encryption.
 */
export const updateEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEncryptionKeyRequest,
  output: UpdateEncryptionKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels the given findings report.
 */
export const cancelFindingsReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelFindingsReportRequest,
    output: CancelFindingsReportResponse,
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
 * Cancels a software bill of materials (SBOM) report.
 */
export const cancelSbomExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSbomExportRequest,
  output: CancelSbomExportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a CIS scan configuration.
 */
export const deleteCisScanConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCisScanConfigurationRequest,
    output: DeleteCisScanConfigurationResponse,
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
 * Deletes a code security integration.
 */
export const deleteCodeSecurityIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCodeSecurityIntegrationRequest,
    output: DeleteCodeSecurityIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a code security scan configuration.
 */
export const deleteCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCodeSecurityScanConfigurationRequest,
    output: DeleteCodeSecurityScanConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes a filter resource.
 */
export const deleteFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFilterRequest,
  output: DeleteFilterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables Amazon Inspector scans for one or more Amazon Web Services accounts.
 */
export const enable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableRequest,
  output: EnableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a CIS scan report.
 */
export const getCisScanReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCisScanReportRequest,
  output: GetCisScanReportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a code security integration.
 */
export const getCodeSecurityIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCodeSecurityIntegrationRequest,
    output: GetCodeSecurityIntegrationResponse,
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
 * Retrieves information about a code security scan configuration.
 */
export const getCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCodeSecurityScanConfigurationRequest,
    output: GetCodeSecurityScanConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about the Amazon Inspector delegated administrator for your
 * organization.
 */
export const getDelegatedAdminAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDelegatedAdminAccountRequest,
    output: GetDelegatedAdminAccountResponse,
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
 * Gets an encryption key.
 */
export const getEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEncryptionKeyRequest,
  output: GetEncryptionKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the status of a findings report.
 */
export const getFindingsReportStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingsReportStatusRequest,
    output: GetFindingsReportStatusResponse,
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
 * Gets details of a software bill of materials (SBOM) report.
 */
export const getSbomExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSbomExportRequest,
  output: GetSbomExportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags attached to a given resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a finding report. By default only `ACTIVE` findings are returned in
 * the report. To see `SUPRESSED` or `CLOSED` findings you must specify
 * a value for the `findingStatus` filter criteria.
 */
export const createFindingsReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFindingsReportRequest,
    output: CreateFindingsReportResponse,
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
 * Disables Amazon Inspector scans for one or more Amazon Web Services accounts. Disabling all scan types in an
 * account disables the Amazon Inspector service.
 */
export const disable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableRequest,
  output: DisableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets member information for your organization.
 */
export const getMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberRequest,
  output: GetMemberResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the associations between code repositories and Amazon Inspector code security scan
 * configurations.
 */
export const listCodeSecurityScanConfigurationAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCodeSecurityScanConfigurationAssociationsRequest,
    output: ListCodeSecurityScanConfigurationAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all code security scan configurations in your account.
 */
export const listCodeSecurityScanConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCodeSecurityScanConfigurationsRequest,
    output: ListCodeSecurityScanConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Activates, deactivates Amazon Inspector deep inspection, or updates custom paths for your account.
 */
export const updateEc2DeepInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEc2DeepInspectionConfigurationRequest,
    output: UpdateEc2DeepInspectionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the configurations for your Amazon Inspector organization.
 */
export const updateOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrganizationConfigurationRequest,
    output: UpdateOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the Amazon Inspector deep inspection custom paths for your organization. You must be an
 * Amazon Inspector delegated administrator to use this API.
 */
export const updateOrgEc2DeepInspectionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrgEc2DeepInspectionConfigurationRequest,
    output: UpdateOrgEc2DeepInspectionConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describe Amazon Inspector configuration settings for an Amazon Web Services organization.
 */
export const describeOrganizationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConfigurationRequest,
    output: DescribeOrganizationConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociates a member account from an Amazon Inspector delegated administrator.
 */
export const disassociateMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMemberRequest,
  output: DisassociateMemberResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List members associated with the Amazon Inspector delegated administrator for your
 * organization.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMembersRequest,
  output: ListMembersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves Amazon Inspector deep inspection activation status of multiple member accounts within
 * your organization. You must be the delegated administrator of an organization in Amazon Inspector to
 * use this API.
 */
export const batchGetMemberEc2DeepInspectionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetMemberEc2DeepInspectionStatusRequest,
    output: BatchGetMemberEc2DeepInspectionStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Activates or deactivates Amazon Inspector deep inspection for the provided member accounts in your
 * organization. You must be the delegated administrator of an organization in Amazon Inspector to use
 * this API.
 */
export const batchUpdateMemberEc2DeepInspectionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateMemberEc2DeepInspectionStatusRequest,
    output: BatchUpdateMemberEc2DeepInspectionStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the permissions an account has to configure Amazon Inspector.
 * If the account is a member account or standalone account with resources managed by an Organizations policy, the operation returns fewer permissions.
 */
export const listAccountPermissions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAccountPermissionsRequest,
    output: ListAccountPermissionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all code security integrations in your account.
 */
export const listCodeSecurityIntegrations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCodeSecurityIntegrationsRequest,
    output: ListCodeSecurityIntegrationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists Amazon Inspector coverage statistics for your environment.
 */
export const listCoverageStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCoverageStatisticsRequest,
    output: ListCoverageStatisticsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }),
);
/**
 * Lists information about the Amazon Inspector delegated administrator of your organization.
 */
export const listDelegatedAdminAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDelegatedAdminAccountsRequest,
    output: ListDelegatedAdminAccountsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the filters associated with your account.
 */
export const listFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFiltersRequest,
  output: ListFiltersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends a CIS session telemetry. This API is used by the Amazon Inspector SSM plugin to
 * communicate with the Amazon Inspector service. The Amazon Inspector SSM plugin calls
 * this API to start a CIS scan session for the scan ID supplied by the service.
 */
export const sendCisSessionTelemetry = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendCisSessionTelemetryRequest,
    output: SendCisSessionTelemetryResponse,
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
 * Stops a CIS session. This API is used by the Amazon Inspector SSM plugin to
 * communicate with the Amazon Inspector service. The Amazon Inspector SSM plugin calls
 * this API to stop a CIS scan session for the scan ID supplied by the service.
 */
export const stopCisSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCisSessionRequest,
  output: StopCisSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a CIS scan configuration.
 */
export const updateCisScanConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCisScanConfigurationRequest,
    output: UpdateCisScanConfigurationResponse,
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
 * Associates multiple code repositories with an Amazon Inspector code security scan
 * configuration.
 */
export const batchAssociateCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAssociateCodeSecurityScanConfigurationRequest,
    output: BatchAssociateCodeSecurityScanConfigurationResponse,
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
 * Retrieves the Amazon Inspector status of multiple Amazon Web Services accounts within your environment.
 */
export const batchGetAccountStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetAccountStatusRequest,
    output: BatchGetAccountStatusResponse,
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
 * Retrieves code snippets from findings that Amazon Inspector detected code vulnerabilities
 * in.
 */
export const batchGetCodeSnippet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCodeSnippetRequest,
  output: BatchGetCodeSnippetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets vulnerability details for findings.
 */
export const batchGetFindingDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetFindingDetailsRequest,
    output: BatchGetFindingDetailsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets free trial status for multiple Amazon Web Services accounts.
 */
export const batchGetFreeTrialInfo = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetFreeTrialInfoRequest,
    output: BatchGetFreeTrialInfoResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a code security integration with a source code repository provider.
 *
 * After calling the `CreateCodeSecurityIntegration` operation, you complete
 * authentication and authorization with your provider. Next you call the
 * `UpdateCodeSecurityIntegration` operation to provide the `details`
 * to complete the integration setup
 */
export const createCodeSecurityIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCodeSecurityIntegrationRequest,
    output: CreateCodeSecurityIntegrationResponse,
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
 * Creates a scan configuration for code security scanning.
 */
export const createCodeSecurityScanConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCodeSecurityScanConfigurationRequest,
    output: CreateCodeSecurityScanConfigurationResponse,
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
 * Creates a filter resource using specified filter criteria. When the filter action is set
 * to `SUPPRESS` this action creates a suppression rule.
 */
export const createFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFilterRequest,
  output: CreateFilterResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a software bill of materials (SBOM) report.
 */
export const createSbomExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSbomExportRequest,
  output: CreateSbomExportResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the Amazon Inspector usage totals over the last 30 days.
 */
export const listUsageTotals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsageTotalsRequest,
  output: ListUsageTotalsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing code security integration.
 *
 * After calling the `CreateCodeSecurityIntegration` operation, you complete
 * authentication and authorization with your provider. Next you call the
 * `UpdateCodeSecurityIntegration` operation to provide the `details`
 * to complete the integration setup
 */
export const updateCodeSecurityIntegration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCodeSecurityIntegrationRequest,
    output: UpdateCodeSecurityIntegrationResponse,
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
 * Creates a CIS scan configuration.
 */
export const createCisScanConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCisScanConfigurationRequest,
    output: CreateCisScanConfigurationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves CIS scan result details.
 */
export const getCisScanResultDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCisScanResultDetailsRequest,
    output: GetCisScanResultDetailsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists scan results aggregated by a target resource.
 */
export const listCisScanResultsAggregatedByTargetResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCisScanResultsAggregatedByTargetResourceRequest,
    output: ListCisScanResultsAggregatedByTargetResourceResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns a CIS scan list.
 */
export const listCisScans = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCisScansRequest,
  output: ListCisScansResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists Amazon Inspector coverage details for a specific vulnerability.
 */
export const searchVulnerabilities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchVulnerabilitiesRequest,
    output: SearchVulnerabilitiesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists CIS scan configurations.
 */
export const listCisScanConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCisScanConfigurationsRequest,
    output: ListCisScanConfigurationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists scan results aggregated by checks.
 */
export const listCisScanResultsAggregatedByChecks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCisScanResultsAggregatedByChecksRequest,
    output: ListCisScanResultsAggregatedByChecksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists aggregated finding data for your environment based on specific criteria.
 */
export const listFindingAggregations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFindingAggregationsRequest,
    output: ListFindingAggregationsResponse,
    errors: [InternalServerException, ThrottlingException, ValidationException],
  }),
);
/**
 * Returns a list of clusters and metadata associated with an image.
 */
export const getClustersForImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClustersForImageRequest,
  output: GetClustersForImageResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists findings for your environment.
 */
export const listFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists coverage details for your environment.
 */
export const listCoverage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCoverageRequest,
  output: ListCoverageResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
