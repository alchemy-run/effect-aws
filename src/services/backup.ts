import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Backup",
  serviceShapeName: "CryoControllerUserManager",
});
const auth = T.AwsAuthSigv4({ name: "backup" });
const ver = T.ServiceVersion("2018-11-15");
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
                        url: "https://backup-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://backup-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://backup.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://backup.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeGlobalSettingsInput extends S.Class<DescribeGlobalSettingsInput>(
  "DescribeGlobalSettingsInput",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/global-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRegionSettingsInput extends S.Class<DescribeRegionSettingsInput>(
  "DescribeRegionSettingsInput",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/account-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSupportedResourceTypesRequest extends S.Class<GetSupportedResourceTypesRequest>(
  "GetSupportedResourceTypesRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ResourceTypes = S.Array(S.String);
export const BackupVaultEvents = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateBackupVaultMpaApprovalTeamInput extends S.Class<AssociateBackupVaultMpaApprovalTeamInput>(
  "AssociateBackupVaultMpaApprovalTeamInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    MpaApprovalTeamArn: S.String,
    RequesterComment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/backup-vaults/{BackupVaultName}/mpaApprovalTeam",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateBackupVaultMpaApprovalTeamResponse extends S.Class<AssociateBackupVaultMpaApprovalTeamResponse>(
  "AssociateBackupVaultMpaApprovalTeamResponse",
)({}) {}
export class CancelLegalHoldInput extends S.Class<CancelLegalHoldInput>(
  "CancelLegalHoldInput",
)(
  {
    LegalHoldId: S.String.pipe(T.HttpLabel("LegalHoldId")),
    CancelDescription: S.String.pipe(T.HttpQuery("cancelDescription")),
    RetainRecordInDays: S.optional(S.Number).pipe(
      T.HttpQuery("retainRecordInDays"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/legal-holds/{LegalHoldId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelLegalHoldOutput extends S.Class<CancelLegalHoldOutput>(
  "CancelLegalHoldOutput",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateBackupVaultInput extends S.Class<CreateBackupVaultInput>(
  "CreateBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    BackupVaultTags: S.optional(Tags),
    EncryptionKeyArn: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/backup-vaults/{BackupVaultName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLogicallyAirGappedBackupVaultInput extends S.Class<CreateLogicallyAirGappedBackupVaultInput>(
  "CreateLogicallyAirGappedBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    BackupVaultTags: S.optional(Tags),
    CreatorRequestId: S.optional(S.String),
    MinRetentionDays: S.Number,
    MaxRetentionDays: S.Number,
    EncryptionKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/logically-air-gapped-backup-vaults/{BackupVaultName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRestoreAccessBackupVaultInput extends S.Class<CreateRestoreAccessBackupVaultInput>(
  "CreateRestoreAccessBackupVaultInput",
)(
  {
    SourceBackupVaultArn: S.String,
    BackupVaultName: S.optional(S.String),
    BackupVaultTags: S.optional(Tags),
    CreatorRequestId: S.optional(S.String),
    RequesterComment: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restore-access-backup-vaults" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupPlanInput extends S.Class<DeleteBackupPlanInput>(
  "DeleteBackupPlanInput",
)(
  { BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/backup/plans/{BackupPlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupSelectionInput extends S.Class<DeleteBackupSelectionInput>(
  "DeleteBackupSelectionInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    SelectionId: S.String.pipe(T.HttpLabel("SelectionId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup/plans/{BackupPlanId}/selections/{SelectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupSelectionResponse extends S.Class<DeleteBackupSelectionResponse>(
  "DeleteBackupSelectionResponse",
)({}) {}
export class DeleteBackupVaultInput extends S.Class<DeleteBackupVaultInput>(
  "DeleteBackupVaultInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/backup-vaults/{BackupVaultName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupVaultResponse extends S.Class<DeleteBackupVaultResponse>(
  "DeleteBackupVaultResponse",
)({}) {}
export class DeleteBackupVaultAccessPolicyInput extends S.Class<DeleteBackupVaultAccessPolicyInput>(
  "DeleteBackupVaultAccessPolicyInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup-vaults/{BackupVaultName}/access-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupVaultAccessPolicyResponse extends S.Class<DeleteBackupVaultAccessPolicyResponse>(
  "DeleteBackupVaultAccessPolicyResponse",
)({}) {}
export class DeleteBackupVaultLockConfigurationInput extends S.Class<DeleteBackupVaultLockConfigurationInput>(
  "DeleteBackupVaultLockConfigurationInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup-vaults/{BackupVaultName}/vault-lock",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupVaultLockConfigurationResponse extends S.Class<DeleteBackupVaultLockConfigurationResponse>(
  "DeleteBackupVaultLockConfigurationResponse",
)({}) {}
export class DeleteBackupVaultNotificationsInput extends S.Class<DeleteBackupVaultNotificationsInput>(
  "DeleteBackupVaultNotificationsInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup-vaults/{BackupVaultName}/notification-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackupVaultNotificationsResponse extends S.Class<DeleteBackupVaultNotificationsResponse>(
  "DeleteBackupVaultNotificationsResponse",
)({}) {}
export class DeleteFrameworkInput extends S.Class<DeleteFrameworkInput>(
  "DeleteFrameworkInput",
)(
  { FrameworkName: S.String.pipe(T.HttpLabel("FrameworkName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/audit/frameworks/{FrameworkName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteFrameworkResponse extends S.Class<DeleteFrameworkResponse>(
  "DeleteFrameworkResponse",
)({}) {}
export class DeleteRecoveryPointInput extends S.Class<DeleteRecoveryPointInput>(
  "DeleteRecoveryPointInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecoveryPointResponse extends S.Class<DeleteRecoveryPointResponse>(
  "DeleteRecoveryPointResponse",
)({}) {}
export class DeleteReportPlanInput extends S.Class<DeleteReportPlanInput>(
  "DeleteReportPlanInput",
)(
  { ReportPlanName: S.String.pipe(T.HttpLabel("ReportPlanName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/audit/report-plans/{ReportPlanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReportPlanResponse extends S.Class<DeleteReportPlanResponse>(
  "DeleteReportPlanResponse",
)({}) {}
export class DeleteRestoreTestingPlanInput extends S.Class<DeleteRestoreTestingPlanInput>(
  "DeleteRestoreTestingPlanInput",
)(
  {
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRestoreTestingPlanResponse extends S.Class<DeleteRestoreTestingPlanResponse>(
  "DeleteRestoreTestingPlanResponse",
)({}) {}
export class DeleteRestoreTestingSelectionInput extends S.Class<DeleteRestoreTestingSelectionInput>(
  "DeleteRestoreTestingSelectionInput",
)(
  {
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
    RestoreTestingSelectionName: S.String.pipe(
      T.HttpLabel("RestoreTestingSelectionName"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}/selections/{RestoreTestingSelectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRestoreTestingSelectionResponse extends S.Class<DeleteRestoreTestingSelectionResponse>(
  "DeleteRestoreTestingSelectionResponse",
)({}) {}
export class DeleteTieringConfigurationInput extends S.Class<DeleteTieringConfigurationInput>(
  "DeleteTieringConfigurationInput",
)(
  {
    TieringConfigurationName: S.String.pipe(
      T.HttpLabel("TieringConfigurationName"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/tiering-configurations/{TieringConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTieringConfigurationOutput extends S.Class<DeleteTieringConfigurationOutput>(
  "DeleteTieringConfigurationOutput",
)({}) {}
export class DescribeBackupJobInput extends S.Class<DescribeBackupJobInput>(
  "DescribeBackupJobInput",
)(
  { BackupJobId: S.String.pipe(T.HttpLabel("BackupJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/backup-jobs/{BackupJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBackupVaultInput extends S.Class<DescribeBackupVaultInput>(
  "DescribeBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultAccountId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup-vaults/{BackupVaultName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeCopyJobInput extends S.Class<DescribeCopyJobInput>(
  "DescribeCopyJobInput",
)(
  { CopyJobId: S.String.pipe(T.HttpLabel("CopyJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/copy-jobs/{CopyJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFrameworkInput extends S.Class<DescribeFrameworkInput>(
  "DescribeFrameworkInput",
)(
  { FrameworkName: S.String.pipe(T.HttpLabel("FrameworkName")) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/frameworks/{FrameworkName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProtectedResourceInput extends S.Class<DescribeProtectedResourceInput>(
  "DescribeProtectedResourceInput",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/resources/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRecoveryPointInput extends S.Class<DescribeRecoveryPointInput>(
  "DescribeRecoveryPointInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReportJobInput extends S.Class<DescribeReportJobInput>(
  "DescribeReportJobInput",
)(
  { ReportJobId: S.String.pipe(T.HttpLabel("ReportJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/report-jobs/{ReportJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReportPlanInput extends S.Class<DescribeReportPlanInput>(
  "DescribeReportPlanInput",
)(
  { ReportPlanName: S.String.pipe(T.HttpLabel("ReportPlanName")) },
  T.all(
    T.Http({ method: "GET", uri: "/audit/report-plans/{ReportPlanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRestoreJobInput extends S.Class<DescribeRestoreJobInput>(
  "DescribeRestoreJobInput",
)(
  { RestoreJobId: S.String.pipe(T.HttpLabel("RestoreJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/restore-jobs/{RestoreJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScanJobInput extends S.Class<DescribeScanJobInput>(
  "DescribeScanJobInput",
)(
  { ScanJobId: S.String.pipe(T.HttpLabel("ScanJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/scan/jobs/{ScanJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateBackupVaultMpaApprovalTeamInput extends S.Class<DisassociateBackupVaultMpaApprovalTeamInput>(
  "DisassociateBackupVaultMpaApprovalTeamInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RequesterComment: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/backup-vaults/{BackupVaultName}/mpaApprovalTeam?delete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateBackupVaultMpaApprovalTeamResponse extends S.Class<DisassociateBackupVaultMpaApprovalTeamResponse>(
  "DisassociateBackupVaultMpaApprovalTeamResponse",
)({}) {}
export class DisassociateRecoveryPointInput extends S.Class<DisassociateRecoveryPointInput>(
  "DisassociateRecoveryPointInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}/disassociate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateRecoveryPointResponse extends S.Class<DisassociateRecoveryPointResponse>(
  "DisassociateRecoveryPointResponse",
)({}) {}
export class DisassociateRecoveryPointFromParentInput extends S.Class<DisassociateRecoveryPointFromParentInput>(
  "DisassociateRecoveryPointFromParentInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}/parentAssociation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateRecoveryPointFromParentResponse extends S.Class<DisassociateRecoveryPointFromParentResponse>(
  "DisassociateRecoveryPointFromParentResponse",
)({}) {}
export class ExportBackupPlanTemplateInput extends S.Class<ExportBackupPlanTemplateInput>(
  "ExportBackupPlanTemplateInput",
)(
  { BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")) },
  T.all(
    T.Http({ method: "GET", uri: "/backup/plans/{BackupPlanId}/toTemplate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupPlanInput extends S.Class<GetBackupPlanInput>(
  "GetBackupPlanInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    MaxScheduledRunsPreview: S.optional(S.Number).pipe(
      T.HttpQuery("MaxScheduledRunsPreview"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup/plans/{BackupPlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupPlanFromJSONInput extends S.Class<GetBackupPlanFromJSONInput>(
  "GetBackupPlanFromJSONInput",
)(
  { BackupPlanTemplateJson: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/backup/template/json/toPlan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupPlanFromTemplateInput extends S.Class<GetBackupPlanFromTemplateInput>(
  "GetBackupPlanFromTemplateInput",
)(
  { BackupPlanTemplateId: S.String.pipe(T.HttpLabel("BackupPlanTemplateId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup/template/plans/{BackupPlanTemplateId}/toPlan",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupSelectionInput extends S.Class<GetBackupSelectionInput>(
  "GetBackupSelectionInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    SelectionId: S.String.pipe(T.HttpLabel("SelectionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup/plans/{BackupPlanId}/selections/{SelectionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupVaultAccessPolicyInput extends S.Class<GetBackupVaultAccessPolicyInput>(
  "GetBackupVaultAccessPolicyInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/access-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackupVaultNotificationsInput extends S.Class<GetBackupVaultNotificationsInput>(
  "GetBackupVaultNotificationsInput",
)(
  { BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/notification-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLegalHoldInput extends S.Class<GetLegalHoldInput>(
  "GetLegalHoldInput",
)(
  { LegalHoldId: S.String.pipe(T.HttpLabel("LegalHoldId")) },
  T.all(
    T.Http({ method: "GET", uri: "/legal-holds/{LegalHoldId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecoveryPointIndexDetailsInput extends S.Class<GetRecoveryPointIndexDetailsInput>(
  "GetRecoveryPointIndexDetailsInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}/index",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecoveryPointRestoreMetadataInput extends S.Class<GetRecoveryPointRestoreMetadataInput>(
  "GetRecoveryPointRestoreMetadataInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}/restore-metadata",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestoreJobMetadataInput extends S.Class<GetRestoreJobMetadataInput>(
  "GetRestoreJobMetadataInput",
)(
  { RestoreJobId: S.String.pipe(T.HttpLabel("RestoreJobId")) },
  T.all(
    T.Http({ method: "GET", uri: "/restore-jobs/{RestoreJobId}/metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestoreTestingInferredMetadataInput extends S.Class<GetRestoreTestingInferredMetadataInput>(
  "GetRestoreTestingInferredMetadataInput",
)(
  {
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("BackupVaultAccountId"),
    ),
    BackupVaultName: S.String.pipe(T.HttpQuery("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpQuery("RecoveryPointArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restore-testing/inferred-metadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestoreTestingPlanInput extends S.Class<GetRestoreTestingPlanInput>(
  "GetRestoreTestingPlanInput",
)(
  {
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRestoreTestingSelectionInput extends S.Class<GetRestoreTestingSelectionInput>(
  "GetRestoreTestingSelectionInput",
)(
  {
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
    RestoreTestingSelectionName: S.String.pipe(
      T.HttpLabel("RestoreTestingSelectionName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}/selections/{RestoreTestingSelectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSupportedResourceTypesOutput extends S.Class<GetSupportedResourceTypesOutput>(
  "GetSupportedResourceTypesOutput",
)({ ResourceTypes: S.optional(ResourceTypes) }) {}
export class GetTieringConfigurationInput extends S.Class<GetTieringConfigurationInput>(
  "GetTieringConfigurationInput",
)(
  {
    TieringConfigurationName: S.String.pipe(
      T.HttpLabel("TieringConfigurationName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tiering-configurations/{TieringConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupJobsInput extends S.Class<ListBackupJobsInput>(
  "ListBackupJobsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ByResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    ByState: S.optional(S.String).pipe(T.HttpQuery("state")),
    ByBackupVaultName: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultName"),
    ),
    ByCreatedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdBefore")),
    ByCreatedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAfter")),
    ByResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ByAccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ByCompleteAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeAfter")),
    ByCompleteBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeBefore")),
    ByParentJobId: S.optional(S.String).pipe(T.HttpQuery("parentJobId")),
    ByMessageCategory: S.optional(S.String).pipe(
      T.HttpQuery("messageCategory"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupJobSummariesInput extends S.Class<ListBackupJobSummariesInput>(
  "ListBackupJobSummariesInput",
)(
  {
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("ResourceType")),
    MessageCategory: S.optional(S.String).pipe(T.HttpQuery("MessageCategory")),
    AggregationPeriod: S.optional(S.String).pipe(
      T.HttpQuery("AggregationPeriod"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/backup-job-summaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupPlansInput extends S.Class<ListBackupPlansInput>(
  "ListBackupPlansInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    IncludeDeleted: S.optional(S.Boolean).pipe(T.HttpQuery("includeDeleted")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup/plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupPlanTemplatesInput extends S.Class<ListBackupPlanTemplatesInput>(
  "ListBackupPlanTemplatesInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup/template/plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupPlanVersionsInput extends S.Class<ListBackupPlanVersionsInput>(
  "ListBackupPlanVersionsInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup/plans/{BackupPlanId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupSelectionsInput extends S.Class<ListBackupSelectionsInput>(
  "ListBackupSelectionsInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup/plans/{BackupPlanId}/selections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackupVaultsInput extends S.Class<ListBackupVaultsInput>(
  "ListBackupVaultsInput",
)(
  {
    ByVaultType: S.optional(S.String).pipe(T.HttpQuery("vaultType")),
    ByShared: S.optional(S.Boolean).pipe(T.HttpQuery("shared")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/backup-vaults" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCopyJobsInput extends S.Class<ListCopyJobsInput>(
  "ListCopyJobsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ByResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    ByState: S.optional(S.String).pipe(T.HttpQuery("state")),
    ByCreatedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdBefore")),
    ByCreatedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAfter")),
    ByResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ByDestinationVaultArn: S.optional(S.String).pipe(
      T.HttpQuery("destinationVaultArn"),
    ),
    ByAccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ByCompleteBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeBefore")),
    ByCompleteAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeAfter")),
    ByParentJobId: S.optional(S.String).pipe(T.HttpQuery("parentJobId")),
    ByMessageCategory: S.optional(S.String).pipe(
      T.HttpQuery("messageCategory"),
    ),
    BySourceRecoveryPointArn: S.optional(S.String).pipe(
      T.HttpQuery("sourceRecoveryPointArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/copy-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCopyJobSummariesInput extends S.Class<ListCopyJobSummariesInput>(
  "ListCopyJobSummariesInput",
)(
  {
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("ResourceType")),
    MessageCategory: S.optional(S.String).pipe(T.HttpQuery("MessageCategory")),
    AggregationPeriod: S.optional(S.String).pipe(
      T.HttpQuery("AggregationPeriod"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/copy-job-summaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListFrameworksInput extends S.Class<ListFrameworksInput>(
  "ListFrameworksInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/frameworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListIndexedRecoveryPointsInput extends S.Class<ListIndexedRecoveryPointsInput>(
  "ListIndexedRecoveryPointsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    SourceResourceArn: S.optional(S.String).pipe(
      T.HttpQuery("sourceResourceArn"),
    ),
    CreatedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdBefore")),
    CreatedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAfter")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    IndexStatus: S.optional(S.String).pipe(T.HttpQuery("indexStatus")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/indexes/recovery-point" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLegalHoldsInput extends S.Class<ListLegalHoldsInput>(
  "ListLegalHoldsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/legal-holds" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProtectedResourcesInput extends S.Class<ListProtectedResourcesInput>(
  "ListProtectedResourcesInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProtectedResourcesByBackupVaultInput extends S.Class<ListProtectedResourcesByBackupVaultInput>(
  "ListProtectedResourcesByBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultAccountId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecoveryPointsByBackupVaultInput extends S.Class<ListRecoveryPointsByBackupVaultInput>(
  "ListRecoveryPointsByBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    BackupVaultAccountId: S.optional(S.String).pipe(
      T.HttpQuery("backupVaultAccountId"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ByResourceArn: S.optional(S.String).pipe(T.HttpQuery("resourceArn")),
    ByResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ByBackupPlanId: S.optional(S.String).pipe(T.HttpQuery("backupPlanId")),
    ByCreatedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdBefore")),
    ByCreatedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAfter")),
    ByParentRecoveryPointArn: S.optional(S.String).pipe(
      T.HttpQuery("parentRecoveryPointArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecoveryPointsByLegalHoldInput extends S.Class<ListRecoveryPointsByLegalHoldInput>(
  "ListRecoveryPointsByLegalHoldInput",
)(
  {
    LegalHoldId: S.String.pipe(T.HttpLabel("LegalHoldId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/legal-holds/{LegalHoldId}/recovery-points",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecoveryPointsByResourceInput extends S.Class<ListRecoveryPointsByResourceInput>(
  "ListRecoveryPointsByResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ManagedByAWSBackupOnly: S.optional(S.Boolean).pipe(
      T.HttpQuery("managedByAWSBackupOnly"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resources/{ResourceArn}/recovery-points" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReportJobsInput extends S.Class<ListReportJobsInput>(
  "ListReportJobsInput",
)(
  {
    ByReportPlanName: S.optional(S.String).pipe(T.HttpQuery("ReportPlanName")),
    ByCreationBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("CreationBefore")),
    ByCreationAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("CreationAfter")),
    ByStatus: S.optional(S.String).pipe(T.HttpQuery("Status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/report-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReportPlansInput extends S.Class<ListReportPlansInput>(
  "ListReportPlansInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/report-plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreAccessBackupVaultsInput extends S.Class<ListRestoreAccessBackupVaultsInput>(
  "ListRestoreAccessBackupVaultsInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/logically-air-gapped-backup-vaults/{BackupVaultName}/restore-access-backup-vaults",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreJobsInput extends S.Class<ListRestoreJobsInput>(
  "ListRestoreJobsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    ByAccountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    ByResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    ByCreatedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdBefore")),
    ByCreatedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAfter")),
    ByStatus: S.optional(S.String).pipe(T.HttpQuery("status")),
    ByCompleteBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeBefore")),
    ByCompleteAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("completeAfter")),
    ByRestoreTestingPlanArn: S.optional(S.String).pipe(
      T.HttpQuery("restoreTestingPlanArn"),
    ),
    ByParentJobId: S.optional(S.String).pipe(T.HttpQuery("parentJobId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restore-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreJobsByProtectedResourceInput extends S.Class<ListRestoreJobsByProtectedResourceInput>(
  "ListRestoreJobsByProtectedResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    ByStatus: S.optional(S.String).pipe(T.HttpQuery("status")),
    ByRecoveryPointCreationDateAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("recoveryPointCreationDateAfter")),
    ByRecoveryPointCreationDateBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("recoveryPointCreationDateBefore")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/resources/{ResourceArn}/restore-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreJobSummariesInput extends S.Class<ListRestoreJobSummariesInput>(
  "ListRestoreJobSummariesInput",
)(
  {
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("ResourceType")),
    AggregationPeriod: S.optional(S.String).pipe(
      T.HttpQuery("AggregationPeriod"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/restore-job-summaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreTestingPlansInput extends S.Class<ListRestoreTestingPlansInput>(
  "ListRestoreTestingPlansInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/restore-testing/plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRestoreTestingSelectionsInput extends S.Class<ListRestoreTestingSelectionsInput>(
  "ListRestoreTestingSelectionsInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}/selections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScanJobsInput extends S.Class<ListScanJobsInput>(
  "ListScanJobsInput",
)(
  {
    ByAccountId: S.optional(S.String).pipe(T.HttpQuery("ByAccountId")),
    ByBackupVaultName: S.optional(S.String).pipe(
      T.HttpQuery("ByBackupVaultName"),
    ),
    ByCompleteAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("ByCompleteAfter")),
    ByCompleteBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("ByCompleteBefore")),
    ByMalwareScanner: S.optional(S.String).pipe(
      T.HttpQuery("ByMalwareScanner"),
    ),
    ByRecoveryPointArn: S.optional(S.String).pipe(
      T.HttpQuery("ByRecoveryPointArn"),
    ),
    ByResourceArn: S.optional(S.String).pipe(T.HttpQuery("ByResourceArn")),
    ByResourceType: S.optional(S.String).pipe(T.HttpQuery("ByResourceType")),
    ByScanResultStatus: S.optional(S.String).pipe(
      T.HttpQuery("ByScanResultStatus"),
    ),
    ByState: S.optional(S.String).pipe(T.HttpQuery("ByState")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/scan/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListScanJobSummariesInput extends S.Class<ListScanJobSummariesInput>(
  "ListScanJobSummariesInput",
)(
  {
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("ResourceType")),
    MalwareScanner: S.optional(S.String).pipe(T.HttpQuery("MalwareScanner")),
    ScanResultStatus: S.optional(S.String).pipe(
      T.HttpQuery("ScanResultStatus"),
    ),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    AggregationPeriod: S.optional(S.String).pipe(
      T.HttpQuery("AggregationPeriod"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/audit/scan-job-summaries" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsInput extends S.Class<ListTagsInput>("ListTagsInput")(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTieringConfigurationsInput extends S.Class<ListTieringConfigurationsInput>(
  "ListTieringConfigurationsInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tiering-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutBackupVaultAccessPolicyInput extends S.Class<PutBackupVaultAccessPolicyInput>(
  "PutBackupVaultAccessPolicyInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    Policy: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/backup-vaults/{BackupVaultName}/access-policy",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutBackupVaultAccessPolicyResponse extends S.Class<PutBackupVaultAccessPolicyResponse>(
  "PutBackupVaultAccessPolicyResponse",
)({}) {}
export class PutBackupVaultLockConfigurationInput extends S.Class<PutBackupVaultLockConfigurationInput>(
  "PutBackupVaultLockConfigurationInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    MinRetentionDays: S.optional(S.Number),
    MaxRetentionDays: S.optional(S.Number),
    ChangeableForDays: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/backup-vaults/{BackupVaultName}/vault-lock",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutBackupVaultLockConfigurationResponse extends S.Class<PutBackupVaultLockConfigurationResponse>(
  "PutBackupVaultLockConfigurationResponse",
)({}) {}
export class PutBackupVaultNotificationsInput extends S.Class<PutBackupVaultNotificationsInput>(
  "PutBackupVaultNotificationsInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    SNSTopicArn: S.String,
    BackupVaultEvents: BackupVaultEvents,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/backup-vaults/{BackupVaultName}/notification-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutBackupVaultNotificationsResponse extends S.Class<PutBackupVaultNotificationsResponse>(
  "PutBackupVaultNotificationsResponse",
)({}) {}
export class PutRestoreValidationResultInput extends S.Class<PutRestoreValidationResultInput>(
  "PutRestoreValidationResultInput",
)(
  {
    RestoreJobId: S.String.pipe(T.HttpLabel("RestoreJobId")),
    ValidationStatus: S.String,
    ValidationStatusMessage: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restore-jobs/{RestoreJobId}/validations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRestoreValidationResultResponse extends S.Class<PutRestoreValidationResultResponse>(
  "PutRestoreValidationResultResponse",
)({}) {}
export class RevokeRestoreAccessBackupVaultInput extends S.Class<RevokeRestoreAccessBackupVaultInput>(
  "RevokeRestoreAccessBackupVaultInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RestoreAccessBackupVaultArn: S.String.pipe(
      T.HttpLabel("RestoreAccessBackupVaultArn"),
    ),
    RequesterComment: S.optional(S.String).pipe(
      T.HttpQuery("requesterComment"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/logically-air-gapped-backup-vaults/{BackupVaultName}/restore-access-backup-vaults/{RestoreAccessBackupVaultArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RevokeRestoreAccessBackupVaultResponse extends S.Class<RevokeRestoreAccessBackupVaultResponse>(
  "RevokeRestoreAccessBackupVaultResponse",
)({}) {}
export class Lifecycle extends S.Class<Lifecycle>("Lifecycle")({
  MoveToColdStorageAfterDays: S.optional(S.Number),
  DeleteAfterDays: S.optional(S.Number),
  OptInToArchiveForSupportedResources: S.optional(S.Boolean),
  DeleteAfterEvent: S.optional(S.String),
}) {}
export class StartCopyJobInput extends S.Class<StartCopyJobInput>(
  "StartCopyJobInput",
)(
  {
    RecoveryPointArn: S.String,
    SourceBackupVaultName: S.String,
    DestinationBackupVaultArn: S.String,
    IamRoleArn: S.String,
    IdempotencyToken: S.optional(S.String),
    Lifecycle: S.optional(Lifecycle),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/copy-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReportJobInput extends S.Class<StartReportJobInput>(
  "StartReportJobInput",
)(
  {
    ReportPlanName: S.String.pipe(T.HttpLabel("ReportPlanName")),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/report-jobs/{ReportPlanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartScanJobInput extends S.Class<StartScanJobInput>(
  "StartScanJobInput",
)(
  {
    BackupVaultName: S.String,
    IamRoleArn: S.String,
    IdempotencyToken: S.optional(S.String),
    MalwareScanner: S.String,
    RecoveryPointArn: S.String,
    ScanBaseRecoveryPointArn: S.optional(S.String),
    ScanMode: S.String,
    ScannerRoleArn: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/scan/job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBackupJobInput extends S.Class<StopBackupJobInput>(
  "StopBackupJobInput",
)(
  { BackupJobId: S.String.pipe(T.HttpLabel("BackupJobId")) },
  T.all(
    T.Http({ method: "POST", uri: "/backup-jobs/{BackupJobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBackupJobResponse extends S.Class<StopBackupJobResponse>(
  "StopBackupJobResponse",
)({}) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeyList: TagKeyList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/untag/{ResourceArn}" }),
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
export class CopyAction extends S.Class<CopyAction>("CopyAction")({
  Lifecycle: S.optional(Lifecycle),
  DestinationBackupVaultArn: S.String,
}) {}
export const CopyActions = S.Array(CopyAction);
export class IndexAction extends S.Class<IndexAction>("IndexAction")({
  ResourceTypes: S.optional(ResourceTypes),
}) {}
export const IndexActions = S.Array(IndexAction);
export class ScanAction extends S.Class<ScanAction>("ScanAction")({
  MalwareScanner: S.optional(S.String),
  ScanMode: S.optional(S.String),
}) {}
export const ScanActions = S.Array(ScanAction);
export class BackupRuleInput extends S.Class<BackupRuleInput>(
  "BackupRuleInput",
)({
  RuleName: S.String,
  TargetBackupVaultName: S.String,
  TargetLogicallyAirGappedBackupVaultArn: S.optional(S.String),
  ScheduleExpression: S.optional(S.String),
  StartWindowMinutes: S.optional(S.Number),
  CompletionWindowMinutes: S.optional(S.Number),
  Lifecycle: S.optional(Lifecycle),
  RecoveryPointTags: S.optional(Tags),
  CopyActions: S.optional(CopyActions),
  EnableContinuousBackup: S.optional(S.Boolean),
  ScheduleExpressionTimezone: S.optional(S.String),
  IndexActions: S.optional(IndexActions),
  ScanActions: S.optional(ScanActions),
}) {}
export const BackupRulesInput = S.Array(BackupRuleInput);
export const BackupOptions = S.Record({ key: S.String, value: S.String });
export class AdvancedBackupSetting extends S.Class<AdvancedBackupSetting>(
  "AdvancedBackupSetting",
)({
  ResourceType: S.optional(S.String),
  BackupOptions: S.optional(BackupOptions),
}) {}
export const AdvancedBackupSettings = S.Array(AdvancedBackupSetting);
export class ScanSetting extends S.Class<ScanSetting>("ScanSetting")({
  MalwareScanner: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypes),
  ScannerRoleArn: S.optional(S.String),
}) {}
export const ScanSettings = S.Array(ScanSetting);
export class BackupPlanInput extends S.Class<BackupPlanInput>(
  "BackupPlanInput",
)({
  BackupPlanName: S.String,
  Rules: BackupRulesInput,
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
  ScanSettings: S.optional(ScanSettings),
}) {}
export class UpdateBackupPlanInput extends S.Class<UpdateBackupPlanInput>(
  "UpdateBackupPlanInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    BackupPlan: BackupPlanInput,
  },
  T.all(
    T.Http({ method: "POST", uri: "/backup/plans/{BackupPlanId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ControlInputParameter extends S.Class<ControlInputParameter>(
  "ControlInputParameter",
)({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
}) {}
export const ControlInputParameters = S.Array(ControlInputParameter);
export const ComplianceResourceIdList = S.Array(S.String);
export const ResourceTypeList = S.Array(S.String);
export const stringMap = S.Record({ key: S.String, value: S.String });
export class ControlScope extends S.Class<ControlScope>("ControlScope")({
  ComplianceResourceIds: S.optional(ComplianceResourceIdList),
  ComplianceResourceTypes: S.optional(ResourceTypeList),
  Tags: S.optional(stringMap),
}) {}
export class FrameworkControl extends S.Class<FrameworkControl>(
  "FrameworkControl",
)({
  ControlName: S.String,
  ControlInputParameters: S.optional(ControlInputParameters),
  ControlScope: S.optional(ControlScope),
}) {}
export const FrameworkControls = S.Array(FrameworkControl);
export class UpdateFrameworkInput extends S.Class<UpdateFrameworkInput>(
  "UpdateFrameworkInput",
)(
  {
    FrameworkName: S.String.pipe(T.HttpLabel("FrameworkName")),
    FrameworkDescription: S.optional(S.String),
    FrameworkControls: S.optional(FrameworkControls),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/audit/frameworks/{FrameworkName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const GlobalSettings = S.Record({ key: S.String, value: S.String });
export class UpdateGlobalSettingsInput extends S.Class<UpdateGlobalSettingsInput>(
  "UpdateGlobalSettingsInput",
)(
  { GlobalSettings: S.optional(GlobalSettings) },
  T.all(
    T.Http({ method: "PUT", uri: "/global-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlobalSettingsResponse extends S.Class<UpdateGlobalSettingsResponse>(
  "UpdateGlobalSettingsResponse",
)({}) {}
export class UpdateRecoveryPointIndexSettingsInput extends S.Class<UpdateRecoveryPointIndexSettingsInput>(
  "UpdateRecoveryPointIndexSettingsInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
    IamRoleArn: S.optional(S.String),
    Index: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}/index",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRecoveryPointLifecycleInput extends S.Class<UpdateRecoveryPointLifecycleInput>(
  "UpdateRecoveryPointLifecycleInput",
)(
  {
    BackupVaultName: S.String.pipe(T.HttpLabel("BackupVaultName")),
    RecoveryPointArn: S.String.pipe(T.HttpLabel("RecoveryPointArn")),
    Lifecycle: S.optional(Lifecycle),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/backup-vaults/{BackupVaultName}/recovery-points/{RecoveryPointArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceTypeOptInPreference = S.Record({
  key: S.String,
  value: S.Boolean,
});
export const ResourceTypeManagementPreference = S.Record({
  key: S.String,
  value: S.Boolean,
});
export class UpdateRegionSettingsInput extends S.Class<UpdateRegionSettingsInput>(
  "UpdateRegionSettingsInput",
)(
  {
    ResourceTypeOptInPreference: S.optional(ResourceTypeOptInPreference),
    ResourceTypeManagementPreference: S.optional(
      ResourceTypeManagementPreference,
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/account-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRegionSettingsResponse extends S.Class<UpdateRegionSettingsResponse>(
  "UpdateRegionSettingsResponse",
)({}) {}
export const FormatList = S.Array(S.String);
export class ReportDeliveryChannel extends S.Class<ReportDeliveryChannel>(
  "ReportDeliveryChannel",
)({
  S3BucketName: S.String,
  S3KeyPrefix: S.optional(S.String),
  Formats: S.optional(FormatList),
}) {}
export const stringList = S.Array(S.String);
export class ReportSetting extends S.Class<ReportSetting>("ReportSetting")({
  ReportTemplate: S.String,
  FrameworkArns: S.optional(stringList),
  NumberOfFrameworks: S.optional(S.Number),
  Accounts: S.optional(stringList),
  OrganizationUnits: S.optional(stringList),
  Regions: S.optional(stringList),
}) {}
export class UpdateReportPlanInput extends S.Class<UpdateReportPlanInput>(
  "UpdateReportPlanInput",
)(
  {
    ReportPlanName: S.String.pipe(T.HttpLabel("ReportPlanName")),
    ReportPlanDescription: S.optional(S.String),
    ReportDeliveryChannel: S.optional(ReportDeliveryChannel),
    ReportSetting: S.optional(ReportSetting),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/audit/report-plans/{ReportPlanName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ResourceArns = S.Array(S.String);
export const VaultNames = S.Array(S.String);
export const ResourceIdentifiers = S.Array(S.String);
export const SensitiveStringMap = S.Record({ key: S.String, value: S.String });
export class BackupPlansListMember extends S.Class<BackupPlansListMember>(
  "BackupPlansListMember",
)({
  BackupPlanArn: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionId: S.optional(S.String),
  BackupPlanName: S.optional(S.String),
  CreatorRequestId: S.optional(S.String),
  LastExecutionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
}) {}
export const BackupPlanVersionsList = S.Array(BackupPlansListMember);
export class RecoveryPointCreator extends S.Class<RecoveryPointCreator>(
  "RecoveryPointCreator",
)({
  BackupPlanId: S.optional(S.String),
  BackupPlanArn: S.optional(S.String),
  BackupPlanName: S.optional(S.String),
  BackupPlanVersion: S.optional(S.String),
  BackupRuleId: S.optional(S.String),
  BackupRuleName: S.optional(S.String),
  BackupRuleCron: S.optional(S.String),
  BackupRuleTimezone: S.optional(S.String),
}) {}
export const CopyJobChildJobsInState = S.Record({
  key: S.String,
  value: S.Number,
});
export class CopyJob extends S.Class<CopyJob>("CopyJob")({
  AccountId: S.optional(S.String),
  CopyJobId: S.optional(S.String),
  SourceBackupVaultArn: S.optional(S.String),
  SourceRecoveryPointArn: S.optional(S.String),
  DestinationBackupVaultArn: S.optional(S.String),
  DestinationVaultType: S.optional(S.String),
  DestinationVaultLockState: S.optional(S.String),
  DestinationRecoveryPointArn: S.optional(S.String),
  DestinationEncryptionKeyArn: S.optional(S.String),
  DestinationRecoveryPointLifecycle: S.optional(Lifecycle),
  ResourceArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  BackupSizeInBytes: S.optional(S.Number),
  IamRoleArn: S.optional(S.String),
  CreatedBy: S.optional(RecoveryPointCreator),
  CreatedByBackupJobId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ParentJobId: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  CompositeMemberIdentifier: S.optional(S.String),
  NumberOfChildJobs: S.optional(S.Number),
  ChildJobsInState: S.optional(CopyJobChildJobsInState),
  ResourceName: S.optional(S.String),
  MessageCategory: S.optional(S.String),
}) {}
export const CopyJobsList = S.Array(CopyJob);
export class ReportDestination extends S.Class<ReportDestination>(
  "ReportDestination",
)({ S3BucketName: S.optional(S.String), S3Keys: S.optional(stringList) }) {}
export class ReportJob extends S.Class<ReportJob>("ReportJob")({
  ReportJobId: S.optional(S.String),
  ReportPlanArn: S.optional(S.String),
  ReportTemplate: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ReportDestination: S.optional(ReportDestination),
}) {}
export const ReportJobList = S.Array(ReportJob);
export class ReportPlan extends S.Class<ReportPlan>("ReportPlan")({
  ReportPlanArn: S.optional(S.String),
  ReportPlanName: S.optional(S.String),
  ReportPlanDescription: S.optional(S.String),
  ReportSetting: S.optional(ReportSetting),
  ReportDeliveryChannel: S.optional(ReportDeliveryChannel),
  DeploymentStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAttemptedExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastSuccessfulExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ReportPlanList = S.Array(ReportPlan);
export const Metadata = S.Record({ key: S.String, value: S.String });
export const RestoreTestingRecoveryPointTypeList = S.Array(S.String);
export class RestoreTestingRecoveryPointSelection extends S.Class<RestoreTestingRecoveryPointSelection>(
  "RestoreTestingRecoveryPointSelection",
)({
  Algorithm: S.optional(S.String),
  ExcludeVaults: S.optional(stringList),
  IncludeVaults: S.optional(stringList),
  RecoveryPointTypes: S.optional(RestoreTestingRecoveryPointTypeList),
  SelectionWindowDays: S.optional(S.Number),
}) {}
export class RestoreTestingPlanForUpdate extends S.Class<RestoreTestingPlanForUpdate>(
  "RestoreTestingPlanForUpdate",
)({
  RecoveryPointSelection: S.optional(RestoreTestingRecoveryPointSelection),
  ScheduleExpression: S.optional(S.String),
  ScheduleExpressionTimezone: S.optional(S.String),
  StartWindowHours: S.optional(S.Number),
}) {}
export class KeyValue extends S.Class<KeyValue>("KeyValue")({
  Key: S.String,
  Value: S.String,
}) {}
export const KeyValueList = S.Array(KeyValue);
export class ProtectedResourceConditions extends S.Class<ProtectedResourceConditions>(
  "ProtectedResourceConditions",
)({
  StringEquals: S.optional(KeyValueList),
  StringNotEquals: S.optional(KeyValueList),
}) {}
export class RestoreTestingSelectionForUpdate extends S.Class<RestoreTestingSelectionForUpdate>(
  "RestoreTestingSelectionForUpdate",
)({
  IamRoleArn: S.optional(S.String),
  ProtectedResourceArns: S.optional(stringList),
  ProtectedResourceConditions: S.optional(ProtectedResourceConditions),
  RestoreMetadataOverrides: S.optional(SensitiveStringMap),
  ValidationWindowHours: S.optional(S.Number),
}) {}
export class ResourceSelection extends S.Class<ResourceSelection>(
  "ResourceSelection",
)({
  Resources: ResourceArns,
  TieringDownSettingsInDays: S.Number,
  ResourceType: S.String,
}) {}
export const ResourceSelections = S.Array(ResourceSelection);
export class TieringConfigurationInputForUpdate extends S.Class<TieringConfigurationInputForUpdate>(
  "TieringConfigurationInputForUpdate",
)({ ResourceSelection: ResourceSelections, BackupVaultName: S.String }) {}
export class CreateBackupVaultOutput extends S.Class<CreateBackupVaultOutput>(
  "CreateBackupVaultOutput",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateLogicallyAirGappedBackupVaultOutput extends S.Class<CreateLogicallyAirGappedBackupVaultOutput>(
  "CreateLogicallyAirGappedBackupVaultOutput",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VaultState: S.optional(S.String),
}) {}
export class CreateReportPlanInput extends S.Class<CreateReportPlanInput>(
  "CreateReportPlanInput",
)(
  {
    ReportPlanName: S.String,
    ReportPlanDescription: S.optional(S.String),
    ReportDeliveryChannel: ReportDeliveryChannel,
    ReportSetting: ReportSetting,
    ReportPlanTags: S.optional(stringMap),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/report-plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRestoreAccessBackupVaultOutput extends S.Class<CreateRestoreAccessBackupVaultOutput>(
  "CreateRestoreAccessBackupVaultOutput",
)({
  RestoreAccessBackupVaultArn: S.optional(S.String),
  VaultState: S.optional(S.String),
  RestoreAccessBackupVaultName: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteBackupPlanOutput extends S.Class<DeleteBackupPlanOutput>(
  "DeleteBackupPlanOutput",
)({
  BackupPlanId: S.optional(S.String),
  BackupPlanArn: S.optional(S.String),
  DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionId: S.optional(S.String),
}) {}
export class DescribeFrameworkOutput extends S.Class<DescribeFrameworkOutput>(
  "DescribeFrameworkOutput",
)({
  FrameworkName: S.optional(S.String),
  FrameworkArn: S.optional(S.String),
  FrameworkDescription: S.optional(S.String),
  FrameworkControls: S.optional(FrameworkControls),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeploymentStatus: S.optional(S.String),
  FrameworkStatus: S.optional(S.String),
  IdempotencyToken: S.optional(S.String),
}) {}
export class DescribeGlobalSettingsOutput extends S.Class<DescribeGlobalSettingsOutput>(
  "DescribeGlobalSettingsOutput",
)({
  GlobalSettings: S.optional(GlobalSettings),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeProtectedResourceOutput extends S.Class<DescribeProtectedResourceOutput>(
  "DescribeProtectedResourceOutput",
)({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  LastBackupTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceName: S.optional(S.String),
  LastBackupVaultArn: S.optional(S.String),
  LastRecoveryPointArn: S.optional(S.String),
  LatestRestoreExecutionTimeMinutes: S.optional(S.Number),
  LatestRestoreJobCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestRestoreRecoveryPointCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DescribeRegionSettingsOutput extends S.Class<DescribeRegionSettingsOutput>(
  "DescribeRegionSettingsOutput",
)({
  ResourceTypeOptInPreference: S.optional(ResourceTypeOptInPreference),
  ResourceTypeManagementPreference: S.optional(
    ResourceTypeManagementPreference,
  ),
}) {}
export class ExportBackupPlanTemplateOutput extends S.Class<ExportBackupPlanTemplateOutput>(
  "ExportBackupPlanTemplateOutput",
)({ BackupPlanTemplateJson: S.optional(S.String) }) {}
export class BackupRule extends S.Class<BackupRule>("BackupRule")({
  RuleName: S.String,
  TargetBackupVaultName: S.String,
  TargetLogicallyAirGappedBackupVaultArn: S.optional(S.String),
  ScheduleExpression: S.optional(S.String),
  StartWindowMinutes: S.optional(S.Number),
  CompletionWindowMinutes: S.optional(S.Number),
  Lifecycle: S.optional(Lifecycle),
  RecoveryPointTags: S.optional(Tags),
  RuleId: S.optional(S.String),
  CopyActions: S.optional(CopyActions),
  EnableContinuousBackup: S.optional(S.Boolean),
  ScheduleExpressionTimezone: S.optional(S.String),
  IndexActions: S.optional(IndexActions),
  ScanActions: S.optional(ScanActions),
}) {}
export const BackupRules = S.Array(BackupRule);
export class BackupPlan extends S.Class<BackupPlan>("BackupPlan")({
  BackupPlanName: S.String,
  Rules: BackupRules,
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
  ScanSettings: S.optional(ScanSettings),
}) {}
export class GetBackupPlanFromJSONOutput extends S.Class<GetBackupPlanFromJSONOutput>(
  "GetBackupPlanFromJSONOutput",
)({ BackupPlan: S.optional(BackupPlan) }) {}
export class GetBackupPlanFromTemplateOutput extends S.Class<GetBackupPlanFromTemplateOutput>(
  "GetBackupPlanFromTemplateOutput",
)({ BackupPlanDocument: S.optional(BackupPlan) }) {}
export class Condition extends S.Class<Condition>("Condition")({
  ConditionType: S.String,
  ConditionKey: S.String,
  ConditionValue: S.String,
}) {}
export const ListOfTags = S.Array(Condition);
export class ConditionParameter extends S.Class<ConditionParameter>(
  "ConditionParameter",
)({
  ConditionKey: S.optional(S.String),
  ConditionValue: S.optional(S.String),
}) {}
export const ConditionParameters = S.Array(ConditionParameter);
export class Conditions extends S.Class<Conditions>("Conditions")({
  StringEquals: S.optional(ConditionParameters),
  StringNotEquals: S.optional(ConditionParameters),
  StringLike: S.optional(ConditionParameters),
  StringNotLike: S.optional(ConditionParameters),
}) {}
export class BackupSelection extends S.Class<BackupSelection>(
  "BackupSelection",
)({
  SelectionName: S.String,
  IamRoleArn: S.String,
  Resources: S.optional(ResourceArns),
  ListOfTags: S.optional(ListOfTags),
  NotResources: S.optional(ResourceArns),
  Conditions: S.optional(Conditions),
}) {}
export class GetBackupSelectionOutput extends S.Class<GetBackupSelectionOutput>(
  "GetBackupSelectionOutput",
)({
  BackupSelection: S.optional(BackupSelection),
  SelectionId: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatorRequestId: S.optional(S.String),
}) {}
export class GetBackupVaultAccessPolicyOutput extends S.Class<GetBackupVaultAccessPolicyOutput>(
  "GetBackupVaultAccessPolicyOutput",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  Policy: S.optional(S.String),
}) {}
export class GetBackupVaultNotificationsOutput extends S.Class<GetBackupVaultNotificationsOutput>(
  "GetBackupVaultNotificationsOutput",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  SNSTopicArn: S.optional(S.String),
  BackupVaultEvents: S.optional(BackupVaultEvents),
}) {}
export class DateRange extends S.Class<DateRange>("DateRange")({
  FromDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ToDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class RecoveryPointSelection extends S.Class<RecoveryPointSelection>(
  "RecoveryPointSelection",
)({
  VaultNames: S.optional(VaultNames),
  ResourceIdentifiers: S.optional(ResourceIdentifiers),
  DateRange: S.optional(DateRange),
}) {}
export class GetLegalHoldOutput extends S.Class<GetLegalHoldOutput>(
  "GetLegalHoldOutput",
)({
  Title: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  CancelDescription: S.optional(S.String),
  LegalHoldId: S.optional(S.String),
  LegalHoldArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CancellationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RetainRecordUntil: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RecoveryPointSelection: S.optional(RecoveryPointSelection),
}) {}
export class GetRecoveryPointIndexDetailsOutput extends S.Class<GetRecoveryPointIndexDetailsOutput>(
  "GetRecoveryPointIndexDetailsOutput",
)({
  RecoveryPointArn: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  IndexCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IndexDeletionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IndexCompletionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IndexStatus: S.optional(S.String),
  IndexStatusMessage: S.optional(S.String),
  TotalItemsIndexed: S.optional(S.Number),
}) {}
export class GetRecoveryPointRestoreMetadataOutput extends S.Class<GetRecoveryPointRestoreMetadataOutput>(
  "GetRecoveryPointRestoreMetadataOutput",
)({
  BackupVaultArn: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  RestoreMetadata: S.optional(Metadata),
  ResourceType: S.optional(S.String),
}) {}
export class GetRestoreJobMetadataOutput extends S.Class<GetRestoreJobMetadataOutput>(
  "GetRestoreJobMetadataOutput",
)({ RestoreJobId: S.optional(S.String), Metadata: S.optional(Metadata) }) {}
export class GetRestoreTestingInferredMetadataOutput extends S.Class<GetRestoreTestingInferredMetadataOutput>(
  "GetRestoreTestingInferredMetadataOutput",
)({ InferredMetadata: stringMap }) {}
export class ListBackupPlanVersionsOutput extends S.Class<ListBackupPlanVersionsOutput>(
  "ListBackupPlanVersionsOutput",
)({
  NextToken: S.optional(S.String),
  BackupPlanVersionsList: S.optional(BackupPlanVersionsList),
}) {}
export class ListCopyJobsOutput extends S.Class<ListCopyJobsOutput>(
  "ListCopyJobsOutput",
)({ CopyJobs: S.optional(CopyJobsList), NextToken: S.optional(S.String) }) {}
export class ProtectedResource extends S.Class<ProtectedResource>(
  "ProtectedResource",
)({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  LastBackupTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceName: S.optional(S.String),
  LastBackupVaultArn: S.optional(S.String),
  LastRecoveryPointArn: S.optional(S.String),
}) {}
export const ProtectedResourcesList = S.Array(ProtectedResource);
export class ListProtectedResourcesByBackupVaultOutput extends S.Class<ListProtectedResourcesByBackupVaultOutput>(
  "ListProtectedResourcesByBackupVaultOutput",
)({
  Results: S.optional(ProtectedResourcesList),
  NextToken: S.optional(S.String),
}) {}
export class ListReportJobsOutput extends S.Class<ListReportJobsOutput>(
  "ListReportJobsOutput",
)({ ReportJobs: S.optional(ReportJobList), NextToken: S.optional(S.String) }) {}
export class ListReportPlansOutput extends S.Class<ListReportPlansOutput>(
  "ListReportPlansOutput",
)({
  ReportPlans: S.optional(ReportPlanList),
  NextToken: S.optional(S.String),
}) {}
export class RestoreJobCreator extends S.Class<RestoreJobCreator>(
  "RestoreJobCreator",
)({ RestoreTestingPlanArn: S.optional(S.String) }) {}
export class RestoreJobsListMember extends S.Class<RestoreJobsListMember>(
  "RestoreJobsListMember",
)({
  AccountId: S.optional(S.String),
  RestoreJobId: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  PercentDone: S.optional(S.String),
  BackupSizeInBytes: S.optional(S.Number),
  IamRoleArn: S.optional(S.String),
  ExpectedCompletionTimeMinutes: S.optional(S.Number),
  CreatedResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  RecoveryPointCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IsParent: S.optional(S.Boolean),
  ParentJobId: S.optional(S.String),
  CreatedBy: S.optional(RestoreJobCreator),
  ValidationStatus: S.optional(S.String),
  ValidationStatusMessage: S.optional(S.String),
  DeletionStatus: S.optional(S.String),
  DeletionStatusMessage: S.optional(S.String),
}) {}
export const RestoreJobsList = S.Array(RestoreJobsListMember);
export class ListRestoreJobsByProtectedResourceOutput extends S.Class<ListRestoreJobsByProtectedResourceOutput>(
  "ListRestoreJobsByProtectedResourceOutput",
)({
  RestoreJobs: S.optional(RestoreJobsList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsOutput extends S.Class<ListTagsOutput>("ListTagsOutput")({
  NextToken: S.optional(S.String),
  Tags: S.optional(Tags),
}) {}
export class StartBackupJobInput extends S.Class<StartBackupJobInput>(
  "StartBackupJobInput",
)(
  {
    BackupVaultName: S.String,
    LogicallyAirGappedBackupVaultArn: S.optional(S.String),
    ResourceArn: S.String,
    IamRoleArn: S.String,
    IdempotencyToken: S.optional(S.String),
    StartWindowMinutes: S.optional(S.Number),
    CompleteWindowMinutes: S.optional(S.Number),
    Lifecycle: S.optional(Lifecycle),
    RecoveryPointTags: S.optional(Tags),
    BackupOptions: S.optional(BackupOptions),
    Index: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/backup-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCopyJobOutput extends S.Class<StartCopyJobOutput>(
  "StartCopyJobOutput",
)({
  CopyJobId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IsParent: S.optional(S.Boolean),
}) {}
export class StartReportJobOutput extends S.Class<StartReportJobOutput>(
  "StartReportJobOutput",
)({ ReportJobId: S.optional(S.String) }) {}
export class StartRestoreJobInput extends S.Class<StartRestoreJobInput>(
  "StartRestoreJobInput",
)(
  {
    RecoveryPointArn: S.String,
    Metadata: Metadata,
    IamRoleArn: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
    ResourceType: S.optional(S.String),
    CopySourceTagsToRestoredResource: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restore-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartScanJobOutput extends S.Class<StartScanJobOutput>(
  "StartScanJobOutput",
)({
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ScanJobId: S.String,
}) {}
export class UpdateBackupPlanOutput extends S.Class<UpdateBackupPlanOutput>(
  "UpdateBackupPlanOutput",
)({
  BackupPlanId: S.optional(S.String),
  BackupPlanArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionId: S.optional(S.String),
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
  ScanSettings: S.optional(ScanSettings),
}) {}
export class UpdateFrameworkOutput extends S.Class<UpdateFrameworkOutput>(
  "UpdateFrameworkOutput",
)({
  FrameworkName: S.optional(S.String),
  FrameworkArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateRecoveryPointIndexSettingsOutput extends S.Class<UpdateRecoveryPointIndexSettingsOutput>(
  "UpdateRecoveryPointIndexSettingsOutput",
)({
  BackupVaultName: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  IndexStatus: S.optional(S.String),
  Index: S.optional(S.String),
}) {}
export class CalculatedLifecycle extends S.Class<CalculatedLifecycle>(
  "CalculatedLifecycle",
)({
  MoveToColdStorageAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeleteAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateRecoveryPointLifecycleOutput extends S.Class<UpdateRecoveryPointLifecycleOutput>(
  "UpdateRecoveryPointLifecycleOutput",
)({
  BackupVaultArn: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  Lifecycle: S.optional(Lifecycle),
  CalculatedLifecycle: S.optional(CalculatedLifecycle),
}) {}
export class UpdateReportPlanOutput extends S.Class<UpdateReportPlanOutput>(
  "UpdateReportPlanOutput",
)({
  ReportPlanName: S.optional(S.String),
  ReportPlanArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateRestoreTestingPlanInput extends S.Class<UpdateRestoreTestingPlanInput>(
  "UpdateRestoreTestingPlanInput",
)(
  {
    RestoreTestingPlan: RestoreTestingPlanForUpdate,
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRestoreTestingSelectionInput extends S.Class<UpdateRestoreTestingSelectionInput>(
  "UpdateRestoreTestingSelectionInput",
)(
  {
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
    RestoreTestingSelection: RestoreTestingSelectionForUpdate,
    RestoreTestingSelectionName: S.String.pipe(
      T.HttpLabel("RestoreTestingSelectionName"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}/selections/{RestoreTestingSelectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTieringConfigurationInput extends S.Class<UpdateTieringConfigurationInput>(
  "UpdateTieringConfigurationInput",
)(
  {
    TieringConfigurationName: S.String.pipe(
      T.HttpLabel("TieringConfigurationName"),
    ),
    TieringConfiguration: TieringConfigurationInputForUpdate,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/tiering-configurations/{TieringConfigurationName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ScanFindings = S.Array(S.String);
export class RestoreTestingPlanForCreate extends S.Class<RestoreTestingPlanForCreate>(
  "RestoreTestingPlanForCreate",
)({
  RecoveryPointSelection: RestoreTestingRecoveryPointSelection,
  RestoreTestingPlanName: S.String,
  ScheduleExpression: S.String,
  ScheduleExpressionTimezone: S.optional(S.String),
  StartWindowHours: S.optional(S.Number),
}) {}
export class TieringConfigurationInputForCreate extends S.Class<TieringConfigurationInputForCreate>(
  "TieringConfigurationInputForCreate",
)({
  TieringConfigurationName: S.String,
  BackupVaultName: S.String,
  ResourceSelection: ResourceSelections,
}) {}
export const BackupJobChildJobsInState = S.Record({
  key: S.String,
  value: S.Number,
});
export class LatestMpaApprovalTeamUpdate extends S.Class<LatestMpaApprovalTeamUpdate>(
  "LatestMpaApprovalTeamUpdate",
)({
  MpaSessionArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiryDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ScanResult extends S.Class<ScanResult>("ScanResult")({
  MalwareScanner: S.optional(S.String),
  ScanJobState: S.optional(S.String),
  LastScanTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Findings: S.optional(ScanFindings),
}) {}
export const ScanResults = S.Array(ScanResult);
export class ScanJobCreator extends S.Class<ScanJobCreator>("ScanJobCreator")({
  BackupPlanArn: S.String,
  BackupPlanId: S.String,
  BackupPlanVersion: S.String,
  BackupRuleId: S.String,
}) {}
export class ScanResultInfo extends S.Class<ScanResultInfo>("ScanResultInfo")({
  ScanResultStatus: S.String,
}) {}
export class ScheduledPlanExecutionMember extends S.Class<ScheduledPlanExecutionMember>(
  "ScheduledPlanExecutionMember",
)({
  ExecutionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuleId: S.optional(S.String),
  RuleExecutionType: S.optional(S.String),
}) {}
export const ScheduledRunsPreview = S.Array(ScheduledPlanExecutionMember);
export class RestoreTestingPlanForGet extends S.Class<RestoreTestingPlanForGet>(
  "RestoreTestingPlanForGet",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatorRequestId: S.optional(S.String),
  LastExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecoveryPointSelection: RestoreTestingRecoveryPointSelection,
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
  ScheduleExpression: S.String,
  ScheduleExpressionTimezone: S.optional(S.String),
  StartWindowHours: S.optional(S.Number),
}) {}
export class RestoreTestingSelectionForGet extends S.Class<RestoreTestingSelectionForGet>(
  "RestoreTestingSelectionForGet",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreatorRequestId: S.optional(S.String),
  IamRoleArn: S.String,
  ProtectedResourceArns: S.optional(stringList),
  ProtectedResourceConditions: S.optional(ProtectedResourceConditions),
  ProtectedResourceType: S.String,
  RestoreMetadataOverrides: S.optional(SensitiveStringMap),
  RestoreTestingPlanName: S.String,
  RestoreTestingSelectionName: S.String,
  ValidationWindowHours: S.optional(S.Number),
}) {}
export class TieringConfiguration extends S.Class<TieringConfiguration>(
  "TieringConfiguration",
)({
  TieringConfigurationName: S.String,
  TieringConfigurationArn: S.optional(S.String),
  BackupVaultName: S.String,
  ResourceSelection: ResourceSelections,
  CreatorRequestId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class BackupJob extends S.Class<BackupJob>("BackupJob")({
  AccountId: S.optional(S.String),
  BackupJobId: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  VaultType: S.optional(S.String),
  VaultLockState: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  RecoveryPointLifecycle: S.optional(Lifecycle),
  EncryptionKeyArn: S.optional(S.String),
  IsEncrypted: S.optional(S.Boolean),
  ResourceArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  PercentDone: S.optional(S.String),
  BackupSizeInBytes: S.optional(S.Number),
  IamRoleArn: S.optional(S.String),
  CreatedBy: S.optional(RecoveryPointCreator),
  ExpectedCompletionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  StartBy: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceType: S.optional(S.String),
  BytesTransferred: S.optional(S.Number),
  BackupOptions: S.optional(BackupOptions),
  BackupType: S.optional(S.String),
  ParentJobId: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  ResourceName: S.optional(S.String),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MessageCategory: S.optional(S.String),
}) {}
export const BackupJobsList = S.Array(BackupJob);
export class BackupJobSummary extends S.Class<BackupJobSummary>(
  "BackupJobSummary",
)({
  Region: S.optional(S.String),
  AccountId: S.optional(S.String),
  State: S.optional(S.String),
  ResourceType: S.optional(S.String),
  MessageCategory: S.optional(S.String),
  Count: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BackupJobSummaryList = S.Array(BackupJobSummary);
export const BackupPlansList = S.Array(BackupPlansListMember);
export class BackupPlanTemplatesListMember extends S.Class<BackupPlanTemplatesListMember>(
  "BackupPlanTemplatesListMember",
)({
  BackupPlanTemplateId: S.optional(S.String),
  BackupPlanTemplateName: S.optional(S.String),
}) {}
export const BackupPlanTemplatesList = S.Array(BackupPlanTemplatesListMember);
export class BackupSelectionsListMember extends S.Class<BackupSelectionsListMember>(
  "BackupSelectionsListMember",
)({
  SelectionId: S.optional(S.String),
  SelectionName: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatorRequestId: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
}) {}
export const BackupSelectionsList = S.Array(BackupSelectionsListMember);
export class BackupVaultListMember extends S.Class<BackupVaultListMember>(
  "BackupVaultListMember",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  VaultType: S.optional(S.String),
  VaultState: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EncryptionKeyArn: S.optional(S.String),
  CreatorRequestId: S.optional(S.String),
  NumberOfRecoveryPoints: S.optional(S.Number),
  Locked: S.optional(S.Boolean),
  MinRetentionDays: S.optional(S.Number),
  MaxRetentionDays: S.optional(S.Number),
  LockDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EncryptionKeyType: S.optional(S.String),
}) {}
export const BackupVaultList = S.Array(BackupVaultListMember);
export class CopyJobSummary extends S.Class<CopyJobSummary>("CopyJobSummary")({
  Region: S.optional(S.String),
  AccountId: S.optional(S.String),
  State: S.optional(S.String),
  ResourceType: S.optional(S.String),
  MessageCategory: S.optional(S.String),
  Count: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const CopyJobSummaryList = S.Array(CopyJobSummary);
export class Framework extends S.Class<Framework>("Framework")({
  FrameworkName: S.optional(S.String),
  FrameworkArn: S.optional(S.String),
  FrameworkDescription: S.optional(S.String),
  NumberOfControls: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeploymentStatus: S.optional(S.String),
}) {}
export const FrameworkList = S.Array(Framework);
export class IndexedRecoveryPoint extends S.Class<IndexedRecoveryPoint>(
  "IndexedRecoveryPoint",
)({
  RecoveryPointArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
  BackupCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ResourceType: S.optional(S.String),
  IndexCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IndexStatus: S.optional(S.String),
  IndexStatusMessage: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
}) {}
export const IndexedRecoveryPointList = S.Array(IndexedRecoveryPoint);
export class LegalHold extends S.Class<LegalHold>("LegalHold")({
  Title: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  LegalHoldId: S.optional(S.String),
  LegalHoldArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CancellationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LegalHoldsList = S.Array(LegalHold);
export class RecoveryPointMember extends S.Class<RecoveryPointMember>(
  "RecoveryPointMember",
)({
  RecoveryPointArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
}) {}
export const RecoveryPointsList = S.Array(RecoveryPointMember);
export class AggregatedScanResult extends S.Class<AggregatedScanResult>(
  "AggregatedScanResult",
)({
  FailedScan: S.optional(S.Boolean),
  Findings: S.optional(ScanFindings),
  LastComputed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RecoveryPointByResource extends S.Class<RecoveryPointByResource>(
  "RecoveryPointByResource",
)({
  RecoveryPointArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  BackupSizeBytes: S.optional(S.Number),
  BackupVaultName: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  ParentRecoveryPointArn: S.optional(S.String),
  ResourceName: S.optional(S.String),
  VaultType: S.optional(S.String),
  IndexStatus: S.optional(S.String),
  IndexStatusMessage: S.optional(S.String),
  EncryptionKeyType: S.optional(S.String),
  AggregatedScanResult: S.optional(AggregatedScanResult),
}) {}
export const RecoveryPointByResourceList = S.Array(RecoveryPointByResource);
export class RestoreJobSummary extends S.Class<RestoreJobSummary>(
  "RestoreJobSummary",
)({
  Region: S.optional(S.String),
  AccountId: S.optional(S.String),
  State: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Count: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RestoreJobSummaryList = S.Array(RestoreJobSummary);
export class RestoreTestingPlanForList extends S.Class<RestoreTestingPlanForList>(
  "RestoreTestingPlanForList",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
  ScheduleExpression: S.String,
  ScheduleExpressionTimezone: S.optional(S.String),
  StartWindowHours: S.optional(S.Number),
}) {}
export const RestoreTestingPlans = S.Array(RestoreTestingPlanForList);
export class RestoreTestingSelectionForList extends S.Class<RestoreTestingSelectionForList>(
  "RestoreTestingSelectionForList",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IamRoleArn: S.String,
  ProtectedResourceType: S.String,
  RestoreTestingPlanName: S.String,
  RestoreTestingSelectionName: S.String,
  ValidationWindowHours: S.optional(S.Number),
}) {}
export const RestoreTestingSelections = S.Array(RestoreTestingSelectionForList);
export class ScanJob extends S.Class<ScanJob>("ScanJob")({
  AccountId: S.String,
  BackupVaultArn: S.String,
  BackupVaultName: S.String,
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: ScanJobCreator,
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IamRoleArn: S.String,
  MalwareScanner: S.String,
  RecoveryPointArn: S.String,
  ResourceArn: S.String,
  ResourceName: S.String,
  ResourceType: S.String,
  ScanBaseRecoveryPointArn: S.optional(S.String),
  ScanId: S.optional(S.String),
  ScanJobId: S.String,
  ScanMode: S.String,
  ScanResult: S.optional(ScanResultInfo),
  ScannerRoleArn: S.String,
  State: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const ScanJobs = S.Array(ScanJob);
export class ScanJobSummary extends S.Class<ScanJobSummary>("ScanJobSummary")({
  Region: S.optional(S.String),
  AccountId: S.optional(S.String),
  State: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Count: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MalwareScanner: S.optional(S.String),
  ScanResultStatus: S.optional(S.String),
}) {}
export const ScanJobSummaryList = S.Array(ScanJobSummary);
export class TieringConfigurationsListMember extends S.Class<TieringConfigurationsListMember>(
  "TieringConfigurationsListMember",
)({
  TieringConfigurationArn: S.optional(S.String),
  TieringConfigurationName: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TieringConfigurationsList = S.Array(
  TieringConfigurationsListMember,
);
export class CreateFrameworkInput extends S.Class<CreateFrameworkInput>(
  "CreateFrameworkInput",
)(
  {
    FrameworkName: S.String,
    FrameworkDescription: S.optional(S.String),
    FrameworkControls: FrameworkControls,
    IdempotencyToken: S.optional(S.String),
    FrameworkTags: S.optional(stringMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/audit/frameworks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLegalHoldInput extends S.Class<CreateLegalHoldInput>(
  "CreateLegalHoldInput",
)(
  {
    Title: S.String,
    Description: S.String,
    IdempotencyToken: S.optional(S.String),
    RecoveryPointSelection: S.optional(RecoveryPointSelection),
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/legal-holds" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateReportPlanOutput extends S.Class<CreateReportPlanOutput>(
  "CreateReportPlanOutput",
)({
  ReportPlanName: S.optional(S.String),
  ReportPlanArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateRestoreTestingPlanInput extends S.Class<CreateRestoreTestingPlanInput>(
  "CreateRestoreTestingPlanInput",
)(
  {
    CreatorRequestId: S.optional(S.String),
    RestoreTestingPlan: RestoreTestingPlanForCreate,
    Tags: S.optional(SensitiveStringMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/restore-testing/plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTieringConfigurationInput extends S.Class<CreateTieringConfigurationInput>(
  "CreateTieringConfigurationInput",
)(
  {
    TieringConfiguration: TieringConfigurationInputForCreate,
    TieringConfigurationTags: S.optional(Tags),
    CreatorRequestId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/tiering-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeBackupJobOutput extends S.Class<DescribeBackupJobOutput>(
  "DescribeBackupJobOutput",
)({
  AccountId: S.optional(S.String),
  BackupJobId: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  RecoveryPointLifecycle: S.optional(Lifecycle),
  BackupVaultArn: S.optional(S.String),
  VaultType: S.optional(S.String),
  VaultLockState: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  IsEncrypted: S.optional(S.Boolean),
  ResourceArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  PercentDone: S.optional(S.String),
  BackupSizeInBytes: S.optional(S.Number),
  IamRoleArn: S.optional(S.String),
  CreatedBy: S.optional(RecoveryPointCreator),
  ResourceType: S.optional(S.String),
  BytesTransferred: S.optional(S.Number),
  ExpectedCompletionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  StartBy: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  BackupOptions: S.optional(BackupOptions),
  BackupType: S.optional(S.String),
  ParentJobId: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  NumberOfChildJobs: S.optional(S.Number),
  ChildJobsInState: S.optional(BackupJobChildJobsInState),
  ResourceName: S.optional(S.String),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MessageCategory: S.optional(S.String),
}) {}
export class DescribeBackupVaultOutput extends S.Class<DescribeBackupVaultOutput>(
  "DescribeBackupVaultOutput",
)({
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  VaultType: S.optional(S.String),
  VaultState: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatorRequestId: S.optional(S.String),
  NumberOfRecoveryPoints: S.optional(S.Number),
  Locked: S.optional(S.Boolean),
  MinRetentionDays: S.optional(S.Number),
  MaxRetentionDays: S.optional(S.Number),
  LockDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceBackupVaultArn: S.optional(S.String),
  MpaApprovalTeamArn: S.optional(S.String),
  MpaSessionArn: S.optional(S.String),
  LatestMpaApprovalTeamUpdate: S.optional(LatestMpaApprovalTeamUpdate),
  EncryptionKeyType: S.optional(S.String),
}) {}
export class DescribeRecoveryPointOutput extends S.Class<DescribeRecoveryPointOutput>(
  "DescribeRecoveryPointOutput",
)({
  RecoveryPointArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  SourceBackupVaultArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  CreatedBy: S.optional(RecoveryPointCreator),
  IamRoleArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  BackupSizeInBytes: S.optional(S.Number),
  CalculatedLifecycle: S.optional(CalculatedLifecycle),
  Lifecycle: S.optional(Lifecycle),
  EncryptionKeyArn: S.optional(S.String),
  IsEncrypted: S.optional(S.Boolean),
  StorageClass: S.optional(S.String),
  LastRestoreTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ParentRecoveryPointArn: S.optional(S.String),
  CompositeMemberIdentifier: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  ResourceName: S.optional(S.String),
  VaultType: S.optional(S.String),
  IndexStatus: S.optional(S.String),
  IndexStatusMessage: S.optional(S.String),
  EncryptionKeyType: S.optional(S.String),
  ScanResults: S.optional(ScanResults),
}) {}
export class DescribeReportPlanOutput extends S.Class<DescribeReportPlanOutput>(
  "DescribeReportPlanOutput",
)({ ReportPlan: S.optional(ReportPlan) }) {}
export class DescribeRestoreJobOutput extends S.Class<DescribeRestoreJobOutput>(
  "DescribeRestoreJobOutput",
)({
  AccountId: S.optional(S.String),
  RestoreJobId: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  SourceResourceArn: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  PercentDone: S.optional(S.String),
  BackupSizeInBytes: S.optional(S.Number),
  IamRoleArn: S.optional(S.String),
  ExpectedCompletionTimeMinutes: S.optional(S.Number),
  CreatedResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  RecoveryPointCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreatedBy: S.optional(RestoreJobCreator),
  ValidationStatus: S.optional(S.String),
  ValidationStatusMessage: S.optional(S.String),
  DeletionStatus: S.optional(S.String),
  DeletionStatusMessage: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  ParentJobId: S.optional(S.String),
}) {}
export class DescribeScanJobOutput extends S.Class<DescribeScanJobOutput>(
  "DescribeScanJobOutput",
)({
  AccountId: S.String,
  BackupVaultArn: S.String,
  BackupVaultName: S.String,
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: ScanJobCreator,
  CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IamRoleArn: S.String,
  MalwareScanner: S.String,
  RecoveryPointArn: S.String,
  ResourceArn: S.String,
  ResourceName: S.String,
  ResourceType: S.String,
  ScanBaseRecoveryPointArn: S.optional(S.String),
  ScanId: S.optional(S.String),
  ScanJobId: S.String,
  ScanMode: S.String,
  ScanResult: S.optional(ScanResultInfo),
  ScannerRoleArn: S.String,
  State: S.String,
  StatusMessage: S.optional(S.String),
}) {}
export class GetRestoreTestingPlanOutput extends S.Class<GetRestoreTestingPlanOutput>(
  "GetRestoreTestingPlanOutput",
)({ RestoreTestingPlan: RestoreTestingPlanForGet }) {}
export class GetRestoreTestingSelectionOutput extends S.Class<GetRestoreTestingSelectionOutput>(
  "GetRestoreTestingSelectionOutput",
)({ RestoreTestingSelection: RestoreTestingSelectionForGet }) {}
export class GetTieringConfigurationOutput extends S.Class<GetTieringConfigurationOutput>(
  "GetTieringConfigurationOutput",
)({ TieringConfiguration: S.optional(TieringConfiguration) }) {}
export class ListBackupJobsOutput extends S.Class<ListBackupJobsOutput>(
  "ListBackupJobsOutput",
)({
  BackupJobs: S.optional(BackupJobsList),
  NextToken: S.optional(S.String),
}) {}
export class ListBackupJobSummariesOutput extends S.Class<ListBackupJobSummariesOutput>(
  "ListBackupJobSummariesOutput",
)({
  BackupJobSummaries: S.optional(BackupJobSummaryList),
  AggregationPeriod: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListBackupPlansOutput extends S.Class<ListBackupPlansOutput>(
  "ListBackupPlansOutput",
)({
  NextToken: S.optional(S.String),
  BackupPlansList: S.optional(BackupPlansList),
}) {}
export class ListBackupPlanTemplatesOutput extends S.Class<ListBackupPlanTemplatesOutput>(
  "ListBackupPlanTemplatesOutput",
)({
  NextToken: S.optional(S.String),
  BackupPlanTemplatesList: S.optional(BackupPlanTemplatesList),
}) {}
export class ListBackupSelectionsOutput extends S.Class<ListBackupSelectionsOutput>(
  "ListBackupSelectionsOutput",
)({
  NextToken: S.optional(S.String),
  BackupSelectionsList: S.optional(BackupSelectionsList),
}) {}
export class ListBackupVaultsOutput extends S.Class<ListBackupVaultsOutput>(
  "ListBackupVaultsOutput",
)({
  BackupVaultList: S.optional(BackupVaultList),
  NextToken: S.optional(S.String),
}) {}
export class ListCopyJobSummariesOutput extends S.Class<ListCopyJobSummariesOutput>(
  "ListCopyJobSummariesOutput",
)({
  CopyJobSummaries: S.optional(CopyJobSummaryList),
  AggregationPeriod: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListFrameworksOutput extends S.Class<ListFrameworksOutput>(
  "ListFrameworksOutput",
)({ Frameworks: S.optional(FrameworkList), NextToken: S.optional(S.String) }) {}
export class ListIndexedRecoveryPointsOutput extends S.Class<ListIndexedRecoveryPointsOutput>(
  "ListIndexedRecoveryPointsOutput",
)({
  IndexedRecoveryPoints: S.optional(IndexedRecoveryPointList),
  NextToken: S.optional(S.String),
}) {}
export class ListLegalHoldsOutput extends S.Class<ListLegalHoldsOutput>(
  "ListLegalHoldsOutput",
)({
  NextToken: S.optional(S.String),
  LegalHolds: S.optional(LegalHoldsList),
}) {}
export class ListProtectedResourcesOutput extends S.Class<ListProtectedResourcesOutput>(
  "ListProtectedResourcesOutput",
)({
  Results: S.optional(ProtectedResourcesList),
  NextToken: S.optional(S.String),
}) {}
export class ListRecoveryPointsByLegalHoldOutput extends S.Class<ListRecoveryPointsByLegalHoldOutput>(
  "ListRecoveryPointsByLegalHoldOutput",
)({
  RecoveryPoints: S.optional(RecoveryPointsList),
  NextToken: S.optional(S.String),
}) {}
export class ListRecoveryPointsByResourceOutput extends S.Class<ListRecoveryPointsByResourceOutput>(
  "ListRecoveryPointsByResourceOutput",
)({
  NextToken: S.optional(S.String),
  RecoveryPoints: S.optional(RecoveryPointByResourceList),
}) {}
export class ListRestoreJobsOutput extends S.Class<ListRestoreJobsOutput>(
  "ListRestoreJobsOutput",
)({
  RestoreJobs: S.optional(RestoreJobsList),
  NextToken: S.optional(S.String),
}) {}
export class ListRestoreJobSummariesOutput extends S.Class<ListRestoreJobSummariesOutput>(
  "ListRestoreJobSummariesOutput",
)({
  RestoreJobSummaries: S.optional(RestoreJobSummaryList),
  AggregationPeriod: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListRestoreTestingPlansOutput extends S.Class<ListRestoreTestingPlansOutput>(
  "ListRestoreTestingPlansOutput",
)({
  NextToken: S.optional(S.String),
  RestoreTestingPlans: RestoreTestingPlans,
}) {}
export class ListRestoreTestingSelectionsOutput extends S.Class<ListRestoreTestingSelectionsOutput>(
  "ListRestoreTestingSelectionsOutput",
)({
  NextToken: S.optional(S.String),
  RestoreTestingSelections: RestoreTestingSelections,
}) {}
export class ListScanJobsOutput extends S.Class<ListScanJobsOutput>(
  "ListScanJobsOutput",
)({ NextToken: S.optional(S.String), ScanJobs: ScanJobs }) {}
export class ListScanJobSummariesOutput extends S.Class<ListScanJobSummariesOutput>(
  "ListScanJobSummariesOutput",
)({
  ScanJobSummaries: S.optional(ScanJobSummaryList),
  AggregationPeriod: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListTieringConfigurationsOutput extends S.Class<ListTieringConfigurationsOutput>(
  "ListTieringConfigurationsOutput",
)({
  TieringConfigurations: S.optional(TieringConfigurationsList),
  NextToken: S.optional(S.String),
}) {}
export class StartBackupJobOutput extends S.Class<StartBackupJobOutput>(
  "StartBackupJobOutput",
)({
  BackupJobId: S.optional(S.String),
  RecoveryPointArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IsParent: S.optional(S.Boolean),
}) {}
export class StartRestoreJobOutput extends S.Class<StartRestoreJobOutput>(
  "StartRestoreJobOutput",
)({ RestoreJobId: S.optional(S.String) }) {}
export class UpdateRestoreTestingPlanOutput extends S.Class<UpdateRestoreTestingPlanOutput>(
  "UpdateRestoreTestingPlanOutput",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateRestoreTestingSelectionOutput extends S.Class<UpdateRestoreTestingSelectionOutput>(
  "UpdateRestoreTestingSelectionOutput",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
  RestoreTestingSelectionName: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateTieringConfigurationOutput extends S.Class<UpdateTieringConfigurationOutput>(
  "UpdateTieringConfigurationOutput",
)({
  TieringConfigurationArn: S.optional(S.String),
  TieringConfigurationName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class LatestRevokeRequest extends S.Class<LatestRevokeRequest>(
  "LatestRevokeRequest",
)({
  MpaSessionArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiryDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RestoreTestingSelectionForCreate extends S.Class<RestoreTestingSelectionForCreate>(
  "RestoreTestingSelectionForCreate",
)({
  IamRoleArn: S.String,
  ProtectedResourceArns: S.optional(stringList),
  ProtectedResourceConditions: S.optional(ProtectedResourceConditions),
  ProtectedResourceType: S.String,
  RestoreMetadataOverrides: S.optional(SensitiveStringMap),
  RestoreTestingSelectionName: S.String,
  ValidationWindowHours: S.optional(S.Number),
}) {}
export class RecoveryPointByBackupVault extends S.Class<RecoveryPointByBackupVault>(
  "RecoveryPointByBackupVault",
)({
  RecoveryPointArn: S.optional(S.String),
  BackupVaultName: S.optional(S.String),
  BackupVaultArn: S.optional(S.String),
  SourceBackupVaultArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  CreatedBy: S.optional(RecoveryPointCreator),
  IamRoleArn: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InitiationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  BackupSizeInBytes: S.optional(S.Number),
  CalculatedLifecycle: S.optional(CalculatedLifecycle),
  Lifecycle: S.optional(Lifecycle),
  EncryptionKeyArn: S.optional(S.String),
  IsEncrypted: S.optional(S.Boolean),
  LastRestoreTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ParentRecoveryPointArn: S.optional(S.String),
  CompositeMemberIdentifier: S.optional(S.String),
  IsParent: S.optional(S.Boolean),
  ResourceName: S.optional(S.String),
  VaultType: S.optional(S.String),
  IndexStatus: S.optional(S.String),
  IndexStatusMessage: S.optional(S.String),
  EncryptionKeyType: S.optional(S.String),
  AggregatedScanResult: S.optional(AggregatedScanResult),
}) {}
export const RecoveryPointByBackupVaultList = S.Array(
  RecoveryPointByBackupVault,
);
export class RestoreAccessBackupVaultListMember extends S.Class<RestoreAccessBackupVaultListMember>(
  "RestoreAccessBackupVaultListMember",
)({
  RestoreAccessBackupVaultArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApprovalDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VaultState: S.optional(S.String),
  LatestRevokeRequest: S.optional(LatestRevokeRequest),
}) {}
export const RestoreAccessBackupVaultList = S.Array(
  RestoreAccessBackupVaultListMember,
);
export class CreateBackupPlanInput extends S.Class<CreateBackupPlanInput>(
  "CreateBackupPlanInput",
)(
  {
    BackupPlan: BackupPlanInput,
    BackupPlanTags: S.optional(Tags),
    CreatorRequestId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/backup/plans" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBackupSelectionInput extends S.Class<CreateBackupSelectionInput>(
  "CreateBackupSelectionInput",
)(
  {
    BackupPlanId: S.String.pipe(T.HttpLabel("BackupPlanId")),
    BackupSelection: BackupSelection,
    CreatorRequestId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/backup/plans/{BackupPlanId}/selections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateFrameworkOutput extends S.Class<CreateFrameworkOutput>(
  "CreateFrameworkOutput",
)({
  FrameworkName: S.optional(S.String),
  FrameworkArn: S.optional(S.String),
}) {}
export class CreateLegalHoldOutput extends S.Class<CreateLegalHoldOutput>(
  "CreateLegalHoldOutput",
)({
  Title: S.optional(S.String),
  Status: S.optional(S.String),
  Description: S.optional(S.String),
  LegalHoldId: S.optional(S.String),
  LegalHoldArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecoveryPointSelection: S.optional(RecoveryPointSelection),
}) {}
export class CreateRestoreTestingPlanOutput extends S.Class<CreateRestoreTestingPlanOutput>(
  "CreateRestoreTestingPlanOutput",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
}) {}
export class CreateRestoreTestingSelectionInput extends S.Class<CreateRestoreTestingSelectionInput>(
  "CreateRestoreTestingSelectionInput",
)(
  {
    CreatorRequestId: S.optional(S.String),
    RestoreTestingPlanName: S.String.pipe(
      T.HttpLabel("RestoreTestingPlanName"),
    ),
    RestoreTestingSelection: RestoreTestingSelectionForCreate,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/restore-testing/plans/{RestoreTestingPlanName}/selections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTieringConfigurationOutput extends S.Class<CreateTieringConfigurationOutput>(
  "CreateTieringConfigurationOutput",
)({
  TieringConfigurationArn: S.optional(S.String),
  TieringConfigurationName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeCopyJobOutput extends S.Class<DescribeCopyJobOutput>(
  "DescribeCopyJobOutput",
)({ CopyJob: S.optional(CopyJob) }) {}
export class DescribeReportJobOutput extends S.Class<DescribeReportJobOutput>(
  "DescribeReportJobOutput",
)({ ReportJob: S.optional(ReportJob) }) {}
export class GetBackupPlanOutput extends S.Class<GetBackupPlanOutput>(
  "GetBackupPlanOutput",
)({
  BackupPlan: S.optional(BackupPlan),
  BackupPlanId: S.optional(S.String),
  BackupPlanArn: S.optional(S.String),
  VersionId: S.optional(S.String),
  CreatorRequestId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastExecutionDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
  ScheduledRunsPreview: S.optional(ScheduledRunsPreview),
}) {}
export class ListRecoveryPointsByBackupVaultOutput extends S.Class<ListRecoveryPointsByBackupVaultOutput>(
  "ListRecoveryPointsByBackupVaultOutput",
)({
  NextToken: S.optional(S.String),
  RecoveryPoints: S.optional(RecoveryPointByBackupVaultList),
}) {}
export class ListRestoreAccessBackupVaultsOutput extends S.Class<ListRestoreAccessBackupVaultsOutput>(
  "ListRestoreAccessBackupVaultsOutput",
)({
  NextToken: S.optional(S.String),
  RestoreAccessBackupVaults: S.optional(RestoreAccessBackupVaultList),
}) {}
export class CreateBackupPlanOutput extends S.Class<CreateBackupPlanOutput>(
  "CreateBackupPlanOutput",
)({
  BackupPlanId: S.optional(S.String),
  BackupPlanArn: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  VersionId: S.optional(S.String),
  AdvancedBackupSettings: S.optional(AdvancedBackupSettings),
}) {}
export class CreateBackupSelectionOutput extends S.Class<CreateBackupSelectionOutput>(
  "CreateBackupSelectionOutput",
)({
  SelectionId: S.optional(S.String),
  BackupPlanId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateRestoreTestingSelectionOutput extends S.Class<CreateRestoreTestingSelectionOutput>(
  "CreateRestoreTestingSelectionOutput",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RestoreTestingPlanArn: S.String,
  RestoreTestingPlanName: S.String,
  RestoreTestingSelectionName: S.String,
}) {}

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    CreatorRequestId: S.optional(S.String),
    Arn: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class MissingParameterValueException extends S.TaggedError<MissingParameterValueException>()(
  "MissingParameterValueException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}
export class DependencyFailureException extends S.TaggedError<DependencyFailureException>()(
  "DependencyFailureException",
  {
    Code: S.optional(S.String),
    Message: S.optional(S.String),
    Type: S.optional(S.String),
    Context: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Returns the Amazon Web Services resource types supported by Backup.
 */
export const getSupportedResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSupportedResourceTypesRequest,
    output: GetSupportedResourceTypesOutput,
    errors: [ServiceUnavailableException],
  }),
);
/**
 * Returns metadata about your copy jobs.
 */
export const listCopyJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCopyJobsInput,
    output: ListCopyJobsOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CopyJobs",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This request lists the protected resources corresponding to each backup vault.
 */
export const listProtectedResourcesByBackupVault =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProtectedResourcesByBackupVaultInput,
    output: ListProtectedResourcesByBackupVaultOutput,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns details about your report jobs.
 */
export const listReportJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportJobsInput,
    output: ListReportJobsOutput,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of your report plans. For detailed information about a single report
 * plan, use `DescribeReportPlan`.
 */
export const listReportPlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportPlansInput,
    output: ListReportPlansOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This request deletes the specified restore testing plan.
 *
 * Deletion can only successfully occur if all associated
 * restore testing selections are deleted first.
 */
export const deleteRestoreTestingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRestoreTestingPlanInput,
    output: DeleteRestoreTestingPlanResponse,
    errors: [InvalidRequestException, ServiceUnavailableException],
  }),
);
/**
 * Input the Restore Testing Plan name and Restore Testing Selection
 * name.
 *
 * All testing selections associated with a restore testing plan must
 * be deleted before the restore testing plan can be deleted.
 */
export const deleteRestoreTestingSelection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRestoreTestingSelectionInput,
    output: DeleteRestoreTestingSelectionResponse,
    errors: [ResourceNotFoundException, ServiceUnavailableException],
  }));
/**
 * Describes whether the Amazon Web Services account is opted in to cross-account backup.
 * Returns an error if the account is not a member of an Organizations organization.
 * Example: `describe-global-settings --region us-west-2`
 */
export const describeGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGlobalSettingsInput,
    output: DescribeGlobalSettingsOutput,
    errors: [InvalidRequestException, ServiceUnavailableException],
  }),
);
/**
 * Returns the current service opt-in settings for the Region. If service opt-in is enabled
 * for a service, Backup tries to protect that service's resources in this Region,
 * when the resource is included in an on-demand backup or scheduled backup plan. Otherwise,
 * Backup does not try to protect that service's resources in this
 * Region.
 */
export const describeRegionSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRegionSettingsInput,
    output: DescribeRegionSettingsOutput,
    errors: [ServiceUnavailableException],
  }),
);
/**
 * Deletes the framework specified by a framework name.
 */
export const deleteFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFrameworkInput,
  output: DeleteFrameworkResponse,
  errors: [
    ConflictException,
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns metadata about a backup vault specified by its name.
 */
export const describeBackupVault = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBackupVaultInput,
  output: DescribeBackupVaultOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns metadata associated with a recovery point, including ID, status, encryption, and
 * lifecycle.
 */
export const describeRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRecoveryPointInput,
    output: DescribeRecoveryPointOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of all report plans for an Amazon Web Services account and Amazon Web Services Region.
 */
export const describeReportPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReportPlanInput,
  output: DescribeReportPlanOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns scan job details for the specified ScanJobID.
 */
export const describeScanJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScanJobInput,
  output: DescribeScanJobOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a valid JSON document specifying a backup plan or an error.
 */
export const getBackupPlanFromJSON = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBackupPlanFromJSONInput,
    output: GetBackupPlanFromJSONOutput,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      LimitExceededException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns `RestoreTestingPlan` details for the specified
 * `RestoreTestingPlanName`. The details are the body of a restore testing plan
 * in JSON format, in addition to plan metadata.
 */
export const getRestoreTestingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRestoreTestingPlanInput,
    output: GetRestoreTestingPlanOutput,
    errors: [ResourceNotFoundException, ServiceUnavailableException],
  }),
);
/**
 * Returns RestoreTestingSelection, which displays resources
 * and elements of the restore testing plan.
 */
export const getRestoreTestingSelection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRestoreTestingSelectionInput,
    output: GetRestoreTestingSelectionOutput,
    errors: [ResourceNotFoundException, ServiceUnavailableException],
  }),
);
/**
 * Returns `TieringConfiguration` details for the specified
 * `TieringConfigurationName`. The details are the body of a tiering configuration
 * in JSON format, in addition to configuration metadata.
 */
export const getTieringConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTieringConfigurationInput,
    output: GetTieringConfigurationOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of existing backup jobs for an authenticated account for the last 30
 * days. For a longer period of time, consider using these monitoring tools.
 */
export const listBackupJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBackupJobsInput,
    output: ListBackupJobsOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupJobs",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This is a request for a summary of backup jobs created
 * or running within the most recent 30 days. You can
 * include parameters AccountID, State, ResourceType, MessageCategory,
 * AggregationPeriod, MaxResults, or NextToken to filter
 * results.
 *
 * This request returns a summary that contains
 * Region, Account, State, ResourceType, MessageCategory,
 * StartTime, EndTime, and Count of included jobs.
 */
export const listBackupJobSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBackupJobSummariesInput,
    output: ListBackupJobSummariesOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the active backup plans for the account.
 */
export const listBackupPlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBackupPlansInput,
    output: ListBackupPlansOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupPlansList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the backup plan templates.
 */
export const listBackupPlanTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBackupPlanTemplatesInput,
    output: ListBackupPlanTemplatesOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupPlanTemplatesList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns an array containing metadata of the resources associated with the target backup
 * plan.
 */
export const listBackupSelections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBackupSelectionsInput,
    output: ListBackupSelectionsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupSelectionsList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of recovery point storage containers along with information about
 * them.
 */
export const listBackupVaults = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBackupVaultsInput,
    output: ListBackupVaultsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupVaultList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This request obtains a list of copy jobs created
 * or running within the the most recent 30 days. You can
 * include parameters AccountID, State, ResourceType, MessageCategory,
 * AggregationPeriod, MaxResults, or NextToken to filter
 * results.
 *
 * This request returns a summary that contains
 * Region, Account, State, RestourceType, MessageCategory,
 * StartTime, EndTime, and Count of included jobs.
 */
export const listCopyJobSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCopyJobSummariesInput,
    output: ListCopyJobSummariesOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of all frameworks for an Amazon Web Services account and Amazon Web Services Region.
 */
export const listFrameworks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListFrameworksInput,
    output: ListFrameworksOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation returns a list of recovery points that have an
 * associated index, belonging to the specified account.
 *
 * Optional parameters you can include are: MaxResults;
 * NextToken; SourceResourceArns; CreatedBefore; CreatedAfter;
 * and ResourceType.
 */
export const listIndexedRecoveryPoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListIndexedRecoveryPointsInput,
    output: ListIndexedRecoveryPointsOutput,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "IndexedRecoveryPoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This action returns metadata about active and previous legal holds.
 */
export const listLegalHolds = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLegalHoldsInput,
    output: ListLegalHoldsOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LegalHolds",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns an array of resources successfully backed up by Backup, including
 * the time the resource was saved, an Amazon Resource Name (ARN) of the resource, and a
 * resource type.
 */
export const listProtectedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListProtectedResourcesInput,
    output: ListProtectedResourcesOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This action returns recovery point ARNs (Amazon Resource Names) of the
 * specified legal hold.
 */
export const listRecoveryPointsByLegalHold =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecoveryPointsByLegalHoldInput,
    output: ListRecoveryPointsByLegalHoldOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RecoveryPoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * The information about the recovery points of the type specified by a
 * resource Amazon Resource Name (ARN).
 *
 * For Amazon EFS and Amazon EC2, this action only lists recovery points
 * created by Backup.
 */
export const listRecoveryPointsByResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecoveryPointsByResourceInput,
    output: ListRecoveryPointsByResourceOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RecoveryPoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of jobs that Backup initiated to restore a saved resource,
 * including details about the recovery process.
 */
export const listRestoreJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRestoreJobsInput,
    output: ListRestoreJobsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RestoreJobs",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This request obtains a summary of restore jobs created
 * or running within the the most recent 30 days. You can
 * include parameters AccountID, State, ResourceType,
 * AggregationPeriod, MaxResults, or NextToken to filter
 * results.
 *
 * This request returns a summary that contains
 * Region, Account, State, RestourceType, MessageCategory,
 * StartTime, EndTime, and Count of included jobs.
 */
export const listRestoreJobSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRestoreJobSummariesInput,
    output: ListRestoreJobSummariesOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of restore testing plans.
 */
export const listRestoreTestingPlans =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRestoreTestingPlansInput,
    output: ListRestoreTestingPlansOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RestoreTestingPlans",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of restore testing selections. Can be filtered
 * by `MaxResults` and `RestoreTestingPlanName`.
 */
export const listRestoreTestingSelections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRestoreTestingSelectionsInput,
    output: ListRestoreTestingSelectionsOutput,
    errors: [
      InvalidParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RestoreTestingSelections",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of existing scan jobs for an authenticated account for the last 30 days.
 */
export const listScanJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListScanJobsInput,
    output: ListScanJobsOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScanJobs",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This is a request for a summary of scan jobs created or running within the most recent 30 days.
 */
export const listScanJobSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListScanJobSummariesInput,
    output: ListScanJobSummariesOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScanJobSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of tiering configurations.
 */
export const listTieringConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTieringConfigurationsInput,
    output: ListTieringConfigurationsOutput,
    errors: [InvalidParameterValueException, ServiceUnavailableException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TieringConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Starts an on-demand backup job for the specified resource.
 */
export const startBackupJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBackupJobInput,
  output: StartBackupJobOutput,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    LimitExceededException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Recovers the saved resource identified by an Amazon Resource Name (ARN).
 */
export const startRestoreJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRestoreJobInput,
  output: StartRestoreJobOutput,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This request will send changes to your specified restore testing
 * plan. `RestoreTestingPlanName`
 * cannot be updated after it is created.
 *
 * `RecoveryPointSelection` can contain:
 *
 * - `Algorithm`
 *
 * - `ExcludeVaults`
 *
 * - `IncludeVaults`
 *
 * - `RecoveryPointTypes`
 *
 * - `SelectionWindowDays`
 */
export const updateRestoreTestingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRestoreTestingPlanInput,
    output: UpdateRestoreTestingPlanOutput,
    errors: [
      ConflictException,
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Updates the specified restore testing selection.
 *
 * Most elements except the `RestoreTestingSelectionName`
 * can be updated with this request.
 *
 * You can use either protected resource ARNs or conditions, but not both.
 */
export const updateRestoreTestingSelection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRestoreTestingSelectionInput,
    output: UpdateRestoreTestingSelectionOutput,
    errors: [
      ConflictException,
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * This request will send changes to your specified tiering
 * configuration. `TieringConfigurationName`
 * cannot be updated after it is created.
 *
 * `ResourceSelection` can contain:
 *
 * - `Resources`
 *
 * - `TieringDownSettingsInDays`
 *
 * - `ResourceType`
 */
export const updateTieringConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTieringConfigurationInput,
    output: UpdateTieringConfigurationOutput,
    errors: [
      AlreadyExistsException,
      ConflictException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Removes the specified legal hold on a recovery point. This action can only be performed
 * by a user with sufficient permissions.
 */
export const cancelLegalHold = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelLegalHoldInput,
  output: CancelLegalHoldOutput,
  errors: [
    InvalidParameterValueException,
    InvalidResourceStateException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a logical container to where backups may be copied.
 *
 * This request includes a name, the Region, the maximum number of retention days, the
 * minimum number of retention days, and optionally can include tags and a creator request
 * ID.
 *
 * Do not include sensitive data, such as passport numbers, in the name of a backup
 * vault.
 */
export const createLogicallyAirGappedBackupVault =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLogicallyAirGappedBackupVaultInput,
    output: CreateLogicallyAirGappedBackupVaultOutput,
    errors: [
      AlreadyExistsException,
      InvalidParameterValueException,
      InvalidRequestException,
      LimitExceededException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Creates a restore access backup vault that provides temporary access to recovery points in a logically air-gapped backup vault, subject to MPA approval.
 */
export const createRestoreAccessBackupVault =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRestoreAccessBackupVaultInput,
    output: CreateRestoreAccessBackupVaultOutput,
    errors: [
      AlreadyExistsException,
      InvalidParameterValueException,
      InvalidRequestException,
      LimitExceededException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Updates the specified framework.
 */
export const updateFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFrameworkInput,
  output: UpdateFrameworkOutput,
  errors: [
    AlreadyExistsException,
    ConflictException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the framework details for the specified `FrameworkName`.
 */
export const describeFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFrameworkInput,
  output: DescribeFrameworkOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns information about a saved resource, including the last time it was backed up,
 * its Amazon Resource Name (ARN), and the Amazon Web Services service type of the saved
 * resource.
 */
export const describeProtectedResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProtectedResourceInput,
    output: DescribeProtectedResourceOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns the backup plan that is specified by the plan ID as a backup template.
 */
export const exportBackupPlanTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExportBackupPlanTemplateInput,
    output: ExportBackupPlanTemplateOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns the template specified by its `templateId` as a backup plan.
 */
export const getBackupPlanFromTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBackupPlanFromTemplateInput,
    output: GetBackupPlanFromTemplateOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns selection metadata and a document in JSON format that specifies a list of
 * resources that are associated with a backup plan.
 */
export const getBackupSelection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackupSelectionInput,
  output: GetBackupSelectionOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the access policy document that is associated with the named backup
 * vault.
 */
export const getBackupVaultAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBackupVaultAccessPolicyInput,
    output: GetBackupVaultAccessPolicyOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns event notifications for the specified backup vault.
 */
export const getBackupVaultNotifications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBackupVaultNotificationsInput,
    output: GetBackupVaultNotificationsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * This action returns details for a specified legal hold. The details are the
 * body of a legal hold in JSON format, in addition to metadata.
 */
export const getLegalHold = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLegalHoldInput,
  output: GetLegalHoldOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation returns the metadata and details specific to
 * the backup index associated with the specified recovery point.
 */
export const getRecoveryPointIndexDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRecoveryPointIndexDetailsInput,
    output: GetRecoveryPointIndexDetailsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Returns a set of metadata key-value pairs that were used to create the backup.
 */
export const getRecoveryPointRestoreMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRecoveryPointRestoreMetadataInput,
    output: GetRecoveryPointRestoreMetadataOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * This request returns the metadata for the specified restore job.
 */
export const getRestoreJobMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRestoreJobMetadataInput,
    output: GetRestoreJobMetadataOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * This request returns the minimal required set of metadata needed to
 * start a restore job with secure default settings. `BackupVaultName`
 * and `RecoveryPointArn` are required parameters.
 * `BackupVaultAccountId` is an optional parameter.
 */
export const getRestoreTestingInferredMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRestoreTestingInferredMetadataInput,
    output: GetRestoreTestingInferredMetadataOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Returns version metadata of your backup plans, including Amazon Resource Names (ARNs),
 * backup plan IDs, creation and deletion dates, plan names, and version IDs.
 */
export const listBackupPlanVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBackupPlanVersionsInput,
    output: ListBackupPlanVersionsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "BackupPlanVersionsList",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This returns restore jobs that contain the specified protected resource.
 *
 * You must include `ResourceArn`. You can optionally include
 * `NextToken`, `ByStatus`, `MaxResults`,
 * `ByRecoveryPointCreationDateAfter` , and
 * `ByRecoveryPointCreationDateBefore`.
 */
export const listRestoreJobsByProtectedResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRestoreJobsByProtectedResourceInput,
    output: ListRestoreJobsByProtectedResourceOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RestoreJobs",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the tags assigned to the resource, such as a target recovery point, backup plan,
 * or backup vault.
 *
 * This operation returns results depending on the resource type used in the value for
 * `resourceArn`. For example, recovery points of Amazon DynamoDB with
 * Advanced Settings have an ARN (Amazon Resource Name) that begins with
 * `arn:aws:backup`. Recovery points (backups) of DynamoDB without
 * Advanced Settings enabled have an ARN that begins with
 * `arn:aws:dynamodb`.
 *
 * When this operation is called and when you include values of `resourceArn`
 * that have an ARN other than `arn:aws:backup`, it may return one of the
 * exceptions listed below. To prevent this exception, include only values representing
 * resource types that are fully managed by Backup. These have an ARN that begins
 * `arn:aws:backup` and they are noted in the Feature availability by resource table.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsInput,
  output: ListTagsOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts an on-demand report job for the specified report plan.
 */
export const startReportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReportJobInput,
  output: StartReportJobOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates the specified backup plan. The new version is uniquely identified by its ID.
 */
export const updateBackupPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBackupPlanInput,
  output: UpdateBackupPlanOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * This operation updates the settings of a recovery point index.
 *
 * Required: BackupVaultName, RecoveryPointArn, and IAMRoleArn
 */
export const updateRecoveryPointIndexSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRecoveryPointIndexSettingsInput,
    output: UpdateRecoveryPointIndexSettingsOutput,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Sets the transition lifecycle of a recovery point.
 *
 * The lifecycle defines when a protected resource is transitioned to cold storage and when
 * it expires. Backup transitions and expires backups automatically according to
 * the lifecycle that you define.
 *
 * Resource types that can transition to cold storage are listed in the Feature availability by resource table. Backup ignores this expression for
 * other resource types.
 *
 * Backups transitioned to cold storage must be stored in cold storage for a minimum of 90
 * days. Therefore, the “retention” setting must be 90 days greater than the “transition to
 * cold after days” setting. The “transition to cold after days” setting cannot be changed
 * after a backup has been transitioned to cold.
 *
 * If your lifecycle currently uses the parameters `DeleteAfterDays` and
 * `MoveToColdStorageAfterDays`, include these parameters and their values when you call
 * this operation. Not including them may result in your plan updating with null values.
 *
 * This operation does not support continuous backups.
 */
export const updateRecoveryPointLifecycle =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRecoveryPointLifecycleInput,
    output: UpdateRecoveryPointLifecycleOutput,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Updates the specified report plan.
 */
export const updateReportPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReportPlanInput,
  output: UpdateReportPlanOutput,
  errors: [
    ConflictException,
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the resource selection associated with a backup plan that is specified by the
 * `SelectionId`.
 */
export const deleteBackupSelection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBackupSelectionInput,
    output: DeleteBackupSelectionResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the backup vault identified by its name. A vault can be deleted only if it is
 * empty.
 */
export const deleteBackupVault = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackupVaultInput,
  output: DeleteBackupVaultResponse,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the policy document that manages permissions on a backup vault.
 */
export const deleteBackupVaultAccessPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteBackupVaultAccessPolicyInput,
    output: DeleteBackupVaultAccessPolicyResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Deletes Backup Vault Lock from a backup vault specified by a backup vault
 * name.
 *
 * If the Vault Lock configuration is immutable, then you cannot delete Vault Lock using
 * API operations, and you will receive an `InvalidRequestException` if you attempt
 * to do so. For more information, see Vault Lock in the
 * *Backup Developer Guide*.
 */
export const deleteBackupVaultLockConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteBackupVaultLockConfigurationInput,
    output: DeleteBackupVaultLockConfigurationResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Deletes event notifications for the specified backup vault.
 */
export const deleteBackupVaultNotifications =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteBackupVaultNotificationsInput,
    output: DeleteBackupVaultNotificationsResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Deletes the tiering configuration specified by a tiering configuration name.
 */
export const deleteTieringConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTieringConfigurationInput,
    output: DeleteTieringConfigurationOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Removes the association between an MPA approval team and a backup vault, disabling the MPA approval workflow for restore operations.
 */
export const disassociateBackupVaultMpaApprovalTeam =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateBackupVaultMpaApprovalTeamInput,
    output: DisassociateBackupVaultMpaApprovalTeamResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * This action to a specific child (nested) recovery point removes the relationship
 * between the specified recovery point and its parent (composite) recovery point.
 */
export const disassociateRecoveryPointFromParent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateRecoveryPointFromParentInput,
    output: DisassociateRecoveryPointFromParentResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Sets a resource-based policy that is used to manage access permissions on the target
 * backup vault. Requires a backup vault name and an access policy document in JSON
 * format.
 */
export const putBackupVaultAccessPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutBackupVaultAccessPolicyInput,
    output: PutBackupVaultAccessPolicyResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Applies Backup Vault Lock to a backup vault, preventing attempts to delete
 * any recovery point stored in or created in a backup vault. Vault Lock also prevents
 * attempts to update the lifecycle policy that controls the retention period of any recovery
 * point currently stored in a backup vault. If specified, Vault Lock enforces a minimum and
 * maximum retention period for future backup and copy jobs that target a backup vault.
 *
 * Backup Vault Lock has been assessed by Cohasset Associates for use in environments
 * that are subject to SEC 17a-4, CFTC, and FINRA regulations. For more information about
 * how Backup Vault Lock relates to these regulations, see the
 * Cohasset Associates
 * Compliance Assessment.
 *
 * For more information, see Backup Vault Lock.
 */
export const putBackupVaultLockConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutBackupVaultLockConfigurationInput,
    output: PutBackupVaultLockConfigurationResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Turns on notifications on a backup vault for the specified topic and events.
 */
export const putBackupVaultNotifications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutBackupVaultNotificationsInput,
    output: PutBackupVaultNotificationsResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * This request allows you to send your independent self-run
 * restore test validation results.
 * `RestoreJobId` and `ValidationStatus`
 * are required. Optionally, you can input a
 * `ValidationStatusMessage`.
 */
export const putRestoreValidationResult = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRestoreValidationResultInput,
    output: PutRestoreValidationResultResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Revokes access to a restore access backup vault, removing the ability to restore from its recovery points and permanently deleting the vault.
 */
export const revokeRestoreAccessBackupVault =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RevokeRestoreAccessBackupVaultInput,
    output: RevokeRestoreAccessBackupVaultResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Attempts to cancel a job to create a one-time backup of a resource.
 *
 * This action is not supported for the following services:
 *
 * - Amazon Aurora
 *
 * - Amazon DocumentDB (with MongoDB compatibility)
 *
 * - Amazon FSx for Lustre
 *
 * - Amazon FSx for NetApp ONTAP
 *
 * - Amazon FSx for OpenZFS
 *
 * - Amazon FSx for Windows File Server
 *
 * - Amazon Neptune
 *
 * - SAP HANA databases on Amazon EC2 instances
 *
 * - Amazon RDS
 */
export const stopBackupJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBackupJobInput,
  output: StopBackupJobResponse,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Removes a set of key-value pairs from a recovery point, backup plan, or backup vault
 * identified by an Amazon Resource Name (ARN)
 *
 * This API is not supported for recovery points for resource types
 * including Aurora, Amazon DocumentDB. Amazon EBS,
 * Amazon FSx, Neptune, and Amazon RDS.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates whether the Amazon Web Services account is opted in to cross-account backup.
 * Returns an error if the account is not an Organizations management account. Use the
 * `DescribeGlobalSettings` API to determine the current settings.
 */
export const updateGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGlobalSettingsInput,
    output: UpdateGlobalSettingsResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Updates the current service opt-in settings for the Region.
 *
 * Use
 * the `DescribeRegionSettings` API to determine the resource types that are
 * supported.
 */
export const updateRegionSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRegionSettingsInput,
    output: UpdateRegionSettingsResponse,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes the report plan specified by a report plan name.
 */
export const deleteReportPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportPlanInput,
  output: DeleteReportPlanResponse,
  errors: [
    ConflictException,
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Associates an MPA approval team with a backup vault.
 */
export const associateBackupVaultMpaApprovalTeam =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateBackupVaultMpaApprovalTeamInput,
    output: AssociateBackupVaultMpaApprovalTeamResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Deletes a backup plan. A backup plan can only be deleted after all associated selections
 * of resources have been deleted. Deleting a backup plan deletes the current version of a
 * backup plan. Previous versions, if any, will still exist.
 */
export const deleteBackupPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackupPlanInput,
  output: DeleteBackupPlanOutput,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts a job to create a one-time copy of the specified resource.
 *
 * Does not support continuous backups.
 *
 * See Copy
 * job retry for information on how Backup retries copy job
 * operations.
 */
export const startCopyJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCopyJobInput,
  output: StartCopyJobOutput,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    LimitExceededException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Starts scanning jobs for specific resources.
 */
export const startScanJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartScanJobInput,
  output: StartScanJobOutput,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    LimitExceededException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Assigns a set of key-value pairs to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a logical container where backups are stored. A `CreateBackupVault`
 * request includes a name, optionally one or more resource tags, an encryption key, and a
 * request ID.
 *
 * Do not include sensitive data, such as passport numbers, in the name of a backup
 * vault.
 */
export const createBackupVault = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackupVaultInput,
  output: CreateBackupVaultOutput,
  errors: [
    AlreadyExistsException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a report plan. A report plan is a document that contains information about the
 * contents of the report and where Backup will deliver it.
 *
 * If you call `CreateReportPlan` with a plan that already exists, you receive
 * an `AlreadyExistsException` exception.
 */
export const createReportPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReportPlanInput,
  output: CreateReportPlanOutput,
  errors: [
    AlreadyExistsException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the recovery point specified by a recovery point ID.
 *
 * If the recovery point ID belongs to a continuous backup, calling this endpoint deletes
 * the existing continuous backup and stops future continuous backup.
 *
 * When an IAM role's permissions are insufficient to call this API, the service sends back
 * an HTTP 200 response with an empty HTTP body, but the recovery point is not deleted.
 * Instead, it enters an `EXPIRED` state.
 *
 * `EXPIRED` recovery points can be deleted with this API once the IAM role
 * has the `iam:CreateServiceLinkedRole` action. To learn more about adding this role, see
 *
 * Troubleshooting manual deletions.
 *
 * If the user or role is deleted or the permission within the role is removed,
 * the deletion will not be successful and will enter an `EXPIRED` state.
 */
export const deleteRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecoveryPointInput,
  output: DeleteRecoveryPointResponse,
  errors: [
    InvalidParameterValueException,
    InvalidRequestException,
    InvalidResourceStateException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified continuous backup recovery point from Backup and
 * releases control of that continuous backup to the source service, such as Amazon RDS. The source service will continue to create and retain continuous backups using the
 * lifecycle that you specified in your original backup plan.
 *
 * Does not support snapshot backup recovery points.
 */
export const disassociateRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateRecoveryPointInput,
    output: DisassociateRecoveryPointResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRequestException,
      InvalidResourceStateException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Creates a framework with one or more controls. A framework is a collection of controls
 * that you can use to evaluate your backup practices. By using pre-built customizable
 * controls to define your policies, you can evaluate whether your backup practices comply
 * with your policies and which resources are not yet in compliance.
 */
export const createFramework = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFrameworkInput,
  output: CreateFrameworkOutput,
  errors: [
    AlreadyExistsException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a legal hold on a recovery point (backup). A legal hold is a restraint on
 * altering or deleting a backup until an authorized user cancels the legal hold. Any actions
 * to delete or disassociate a recovery point will fail with an error if one or more active
 * legal holds are on the recovery point.
 */
export const createLegalHold = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLegalHoldInput,
  output: CreateLegalHoldOutput,
  errors: [
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a restore testing plan.
 *
 * The first of two steps to create a restore testing
 * plan. After this request is successful, finish the procedure using
 * CreateRestoreTestingSelection.
 */
export const createRestoreTestingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRestoreTestingPlanInput,
    output: CreateRestoreTestingPlanOutput,
    errors: [
      AlreadyExistsException,
      ConflictException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Creates a tiering configuration.
 *
 * A tiering configuration enables automatic movement of backup data to a lower-cost storage tier based on the age of backed-up objects in the backup vault.
 *
 * Each vault can only have one vault-specific tiering configuration, in addition to any global configuration that applies to all vaults.
 */
export const createTieringConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTieringConfigurationInput,
    output: CreateTieringConfigurationOutput,
    errors: [
      AlreadyExistsException,
      ConflictException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns backup job details for the specified `BackupJobId`.
 */
export const describeBackupJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBackupJobInput,
  output: DescribeBackupJobOutput,
  errors: [
    DependencyFailureException,
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns metadata associated with creating a copy of a resource.
 */
export const describeCopyJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCopyJobInput,
  output: DescribeCopyJobOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the details associated with creating a report as specified by its
 * `ReportJobId`.
 */
export const describeReportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReportJobInput,
  output: DescribeReportJobOutput,
  errors: [
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns `BackupPlan` details for the specified `BackupPlanId`. The
 * details are the body of a backup plan in JSON format, in addition to plan metadata.
 */
export const getBackupPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackupPlanInput,
  output: GetBackupPlanOutput,
  errors: [
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns detailed information about the recovery points stored in a backup vault.
 */
export const listRecoveryPointsByBackupVault =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecoveryPointsByBackupVaultInput,
    output: ListRecoveryPointsByBackupVaultOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RecoveryPoints",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of restore access backup vaults associated with a specified backup vault.
 */
export const listRestoreAccessBackupVaults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRestoreAccessBackupVaultsInput,
    output: ListRestoreAccessBackupVaultsOutput,
    errors: [
      InvalidParameterValueException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "RestoreAccessBackupVaults",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns metadata associated with a restore job that is specified by a job ID.
 */
export const describeRestoreJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRestoreJobInput,
  output: DescribeRestoreJobOutput,
  errors: [
    DependencyFailureException,
    InvalidParameterValueException,
    MissingParameterValueException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a backup plan using a backup plan name and backup rules. A backup plan is a
 * document that contains information that Backup uses to schedule tasks that
 * create recovery points for resources.
 *
 * If you call `CreateBackupPlan` with a plan that already exists, you receive
 * an `AlreadyExistsException` exception.
 */
export const createBackupPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackupPlanInput,
  output: CreateBackupPlanOutput,
  errors: [
    AlreadyExistsException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingParameterValueException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a JSON document that specifies a set of resources to assign to a backup plan.
 * For examples, see Assigning resources programmatically.
 */
export const createBackupSelection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBackupSelectionInput,
    output: CreateBackupSelectionOutput,
    errors: [
      AlreadyExistsException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingParameterValueException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * This request can be sent after CreateRestoreTestingPlan request
 * returns successfully. This is the second part of creating a resource testing
 * plan, and it must be completed sequentially.
 *
 * This consists of `RestoreTestingSelectionName`,
 * `ProtectedResourceType`, and one of the following:
 *
 * - `ProtectedResourceArns`
 *
 * - `ProtectedResourceConditions`
 *
 * Each protected resource type can have one single value.
 *
 * A restore testing selection can include a wildcard value ("*") for
 * `ProtectedResourceArns` along with `ProtectedResourceConditions`.
 * Alternatively, you can include up to 30 specific protected resource ARNs in
 * `ProtectedResourceArns`.
 *
 * Cannot select by both protected resource types AND specific ARNs.
 * Request will fail if both are included.
 */
export const createRestoreTestingSelection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRestoreTestingSelectionInput,
    output: CreateRestoreTestingSelectionOutput,
    errors: [
      AlreadyExistsException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingParameterValueException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }));
