import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Compute Optimizer",
  serviceShapeName: "ComputeOptimizerService",
});
const auth = T.AwsAuthSigv4({ name: "compute-optimizer" });
const ver = T.ServiceVersion("2019-11-01");
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
                        url: "https://compute-optimizer-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://compute-optimizer-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://compute-optimizer.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://compute-optimizer.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetEnrollmentStatusRequest extends S.Class<GetEnrollmentStatusRequest>(
  "GetEnrollmentStatusRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RecommendationPreferenceNames = S.Array(S.String);
export const JobIds = S.Array(S.String);
export const AccountIds = S.Array(S.String);
export const ExportableAutoScalingGroupFields = S.Array(S.String);
export const ExportableVolumeFields = S.Array(S.String);
export const ExportableInstanceFields = S.Array(S.String);
export const ExportableECSServiceFields = S.Array(S.String);
export const ExportableIdleFields = S.Array(S.String);
export const ExportableLambdaFunctionFields = S.Array(S.String);
export const ExportableLicenseFields = S.Array(S.String);
export const ExportableRDSDBFields = S.Array(S.String);
export const AutoScalingGroupArns = S.Array(S.String);
export const VolumeArns = S.Array(S.String);
export const InstanceArns = S.Array(S.String);
export const ServiceArns = S.Array(S.String);
export const ResourceArns = S.Array(S.String);
export const FunctionArns = S.Array(S.String);
export const FilterValues = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  name: S.optional(S.String),
  values: S.optional(FilterValues),
}) {}
export const Filters = S.Array(Filter);
export class S3DestinationConfig extends S.Class<S3DestinationConfig>(
  "S3DestinationConfig",
)({ bucket: S.optional(S.String), keyPrefix: S.optional(S.String) }) {}
export const CpuVendorArchitectures = S.Array(S.String);
export class RecommendationPreferences extends S.Class<RecommendationPreferences>(
  "RecommendationPreferences",
)({ cpuVendorArchitectures: S.optional(CpuVendorArchitectures) }) {}
export class ExportEC2InstanceRecommendationsRequest extends S.Class<ExportEC2InstanceRecommendationsRequest>(
  "ExportEC2InstanceRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(Filters),
    fieldsToExport: S.optional(ExportableInstanceFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAutoScalingGroupRecommendationsRequest extends S.Class<GetAutoScalingGroupRecommendationsRequest>(
  "GetAutoScalingGroupRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    autoScalingGroupArns: S.optional(AutoScalingGroupArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(Filters),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EBSFilter extends S.Class<EBSFilter>("EBSFilter")({
  name: S.optional(S.String),
  values: S.optional(FilterValues),
}) {}
export const EBSFilters = S.Array(EBSFilter);
export class GetEBSVolumeRecommendationsRequest extends S.Class<GetEBSVolumeRecommendationsRequest>(
  "GetEBSVolumeRecommendationsRequest",
)(
  {
    volumeArns: S.optional(VolumeArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(EBSFilters),
    accountIds: S.optional(AccountIds),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEC2InstanceRecommendationsRequest extends S.Class<GetEC2InstanceRecommendationsRequest>(
  "GetEC2InstanceRecommendationsRequest",
)(
  {
    instanceArns: S.optional(InstanceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(Filters),
    accountIds: S.optional(AccountIds),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEC2RecommendationProjectedMetricsRequest extends S.Class<GetEC2RecommendationProjectedMetricsRequest>(
  "GetEC2RecommendationProjectedMetricsRequest",
)(
  {
    instanceArn: S.String,
    stat: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetECSServiceRecommendationProjectedMetricsRequest extends S.Class<GetECSServiceRecommendationProjectedMetricsRequest>(
  "GetECSServiceRecommendationProjectedMetricsRequest",
)(
  {
    serviceArn: S.String,
    stat: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ECSServiceRecommendationFilter extends S.Class<ECSServiceRecommendationFilter>(
  "ECSServiceRecommendationFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const ECSServiceRecommendationFilters = S.Array(
  ECSServiceRecommendationFilter,
);
export class GetECSServiceRecommendationsRequest extends S.Class<GetECSServiceRecommendationsRequest>(
  "GetECSServiceRecommendationsRequest",
)(
  {
    serviceArns: S.optional(ServiceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ECSServiceRecommendationFilters),
    accountIds: S.optional(AccountIds),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEffectiveRecommendationPreferencesRequest extends S.Class<GetEffectiveRecommendationPreferencesRequest>(
  "GetEffectiveRecommendationPreferencesRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnrollmentStatusResponse extends S.Class<GetEnrollmentStatusResponse>(
  "GetEnrollmentStatusResponse",
)({
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  memberAccountsEnrolled: S.optional(S.Boolean),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  numberOfMemberAccountsOptedIn: S.optional(S.Number),
}) {}
export class LambdaFunctionRecommendationFilter extends S.Class<LambdaFunctionRecommendationFilter>(
  "LambdaFunctionRecommendationFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const LambdaFunctionRecommendationFilters = S.Array(
  LambdaFunctionRecommendationFilter,
);
export class GetLambdaFunctionRecommendationsRequest extends S.Class<GetLambdaFunctionRecommendationsRequest>(
  "GetLambdaFunctionRecommendationsRequest",
)(
  {
    functionArns: S.optional(FunctionArns),
    accountIds: S.optional(AccountIds),
    filters: S.optional(LambdaFunctionRecommendationFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LicenseRecommendationFilter extends S.Class<LicenseRecommendationFilter>(
  "LicenseRecommendationFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const LicenseRecommendationFilters = S.Array(
  LicenseRecommendationFilter,
);
export class GetLicenseRecommendationsRequest extends S.Class<GetLicenseRecommendationsRequest>(
  "GetLicenseRecommendationsRequest",
)(
  {
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(LicenseRecommendationFilters),
    accountIds: S.optional(AccountIds),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRDSDatabaseRecommendationProjectedMetricsRequest extends S.Class<GetRDSDatabaseRecommendationProjectedMetricsRequest>(
  "GetRDSDatabaseRecommendationProjectedMetricsRequest",
)(
  {
    resourceArn: S.String,
    stat: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RDSDBRecommendationFilter extends S.Class<RDSDBRecommendationFilter>(
  "RDSDBRecommendationFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const RDSDBRecommendationFilters = S.Array(RDSDBRecommendationFilter);
export class GetRDSDatabaseRecommendationsRequest extends S.Class<GetRDSDatabaseRecommendationsRequest>(
  "GetRDSDatabaseRecommendationsRequest",
)(
  {
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(RDSDBRecommendationFilters),
    accountIds: S.optional(AccountIds),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Scope extends S.Class<Scope>("Scope")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export class GetRecommendationPreferencesRequest extends S.Class<GetRecommendationPreferencesRequest>(
  "GetRecommendationPreferencesRequest",
)(
  {
    resourceType: S.String,
    scope: S.optional(Scope),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRecommendationSummariesRequest extends S.Class<GetRecommendationSummariesRequest>(
  "GetRecommendationSummariesRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnrollmentStatusRequest extends S.Class<UpdateEnrollmentStatusRequest>(
  "UpdateEnrollmentStatusRequest",
)(
  { status: S.String, includeMemberAccounts: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PreferredResourceValues = S.Array(S.String);
export class JobFilter extends S.Class<JobFilter>("JobFilter")({
  name: S.optional(S.String),
  values: S.optional(FilterValues),
}) {}
export const JobFilters = S.Array(JobFilter);
export class IdleRecommendationFilter extends S.Class<IdleRecommendationFilter>(
  "IdleRecommendationFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const IdleRecommendationFilters = S.Array(IdleRecommendationFilter);
export class EnrollmentFilter extends S.Class<EnrollmentFilter>(
  "EnrollmentFilter",
)({ name: S.optional(S.String), values: S.optional(FilterValues) }) {}
export const EnrollmentFilters = S.Array(EnrollmentFilter);
export class OrderBy extends S.Class<OrderBy>("OrderBy")({
  dimension: S.optional(S.String),
  order: S.optional(S.String),
}) {}
export class ExternalMetricsPreference extends S.Class<ExternalMetricsPreference>(
  "ExternalMetricsPreference",
)({ source: S.optional(S.String) }) {}
export class PreferredResource extends S.Class<PreferredResource>(
  "PreferredResource",
)({
  name: S.optional(S.String),
  includeList: S.optional(PreferredResourceValues),
  excludeList: S.optional(PreferredResourceValues),
}) {}
export const PreferredResources = S.Array(PreferredResource);
export class DeleteRecommendationPreferencesRequest extends S.Class<DeleteRecommendationPreferencesRequest>(
  "DeleteRecommendationPreferencesRequest",
)(
  {
    resourceType: S.String,
    scope: S.optional(Scope),
    recommendationPreferenceNames: RecommendationPreferenceNames,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRecommendationPreferencesResponse extends S.Class<DeleteRecommendationPreferencesResponse>(
  "DeleteRecommendationPreferencesResponse",
)({}) {}
export class DescribeRecommendationExportJobsRequest extends S.Class<DescribeRecommendationExportJobsRequest>(
  "DescribeRecommendationExportJobsRequest",
)(
  {
    jobIds: S.optional(JobIds),
    filters: S.optional(JobFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportAutoScalingGroupRecommendationsRequest extends S.Class<ExportAutoScalingGroupRecommendationsRequest>(
  "ExportAutoScalingGroupRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(Filters),
    fieldsToExport: S.optional(ExportableAutoScalingGroupFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportEBSVolumeRecommendationsRequest extends S.Class<ExportEBSVolumeRecommendationsRequest>(
  "ExportEBSVolumeRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(EBSFilters),
    fieldsToExport: S.optional(ExportableVolumeFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportECSServiceRecommendationsRequest extends S.Class<ExportECSServiceRecommendationsRequest>(
  "ExportECSServiceRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(ECSServiceRecommendationFilters),
    fieldsToExport: S.optional(ExportableECSServiceFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportIdleRecommendationsRequest extends S.Class<ExportIdleRecommendationsRequest>(
  "ExportIdleRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(IdleRecommendationFilters),
    fieldsToExport: S.optional(ExportableIdleFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportLambdaFunctionRecommendationsRequest extends S.Class<ExportLambdaFunctionRecommendationsRequest>(
  "ExportLambdaFunctionRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(LambdaFunctionRecommendationFilters),
    fieldsToExport: S.optional(ExportableLambdaFunctionFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportLicenseRecommendationsRequest extends S.Class<ExportLicenseRecommendationsRequest>(
  "ExportLicenseRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(LicenseRecommendationFilters),
    fieldsToExport: S.optional(ExportableLicenseFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportRDSDatabaseRecommendationsRequest extends S.Class<ExportRDSDatabaseRecommendationsRequest>(
  "ExportRDSDatabaseRecommendationsRequest",
)(
  {
    accountIds: S.optional(AccountIds),
    filters: S.optional(RDSDBRecommendationFilters),
    fieldsToExport: S.optional(ExportableRDSDBFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnrollmentStatusesForOrganizationRequest extends S.Class<GetEnrollmentStatusesForOrganizationRequest>(
  "GetEnrollmentStatusesForOrganizationRequest",
)(
  {
    filters: S.optional(EnrollmentFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdleRecommendationsRequest extends S.Class<GetIdleRecommendationsRequest>(
  "GetIdleRecommendationsRequest",
)(
  {
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(IdleRecommendationFilters),
    accountIds: S.optional(AccountIds),
    orderBy: S.optional(OrderBy),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnrollmentStatusResponse extends S.Class<UpdateEnrollmentStatusResponse>(
  "UpdateEnrollmentStatusResponse",
)({ status: S.optional(S.String), statusReason: S.optional(S.String) }) {}
export const InferredWorkloadTypes = S.Array(S.String);
export const InstanceRecommendationFindingReasonCodes = S.Array(S.String);
export const ECSServiceRecommendationFindingReasonCodes = S.Array(S.String);
export const LambdaFunctionRecommendationFindingReasonCodes = S.Array(S.String);
export const LicenseFindingReasonCodes = S.Array(S.String);
export const RDSInstanceFindingReasonCodes = S.Array(S.String);
export const RDSStorageFindingReasonCodes = S.Array(S.String);
export class CustomizableMetricParameters extends S.Class<CustomizableMetricParameters>(
  "CustomizableMetricParameters",
)({ threshold: S.optional(S.String), headroom: S.optional(S.String) }) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  bucket: S.optional(S.String),
  key: S.optional(S.String),
  metadataKey: S.optional(S.String),
}) {}
export class GetRecommendationError extends S.Class<GetRecommendationError>(
  "GetRecommendationError",
)({
  identifier: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const GetRecommendationErrors = S.Array(GetRecommendationError);
export class EffectivePreferredResource extends S.Class<EffectivePreferredResource>(
  "EffectivePreferredResource",
)({
  name: S.optional(S.String),
  includeList: S.optional(PreferredResourceValues),
  effectiveIncludeList: S.optional(PreferredResourceValues),
  excludeList: S.optional(PreferredResourceValues),
}) {}
export const EffectivePreferredResources = S.Array(EffectivePreferredResource);
export class UtilizationPreference extends S.Class<UtilizationPreference>(
  "UtilizationPreference",
)({
  metricName: S.optional(S.String),
  metricParameters: S.optional(CustomizableMetricParameters),
}) {}
export const UtilizationPreferences = S.Array(UtilizationPreference);
export class RecommendationPreferencesDetail extends S.Class<RecommendationPreferencesDetail>(
  "RecommendationPreferencesDetail",
)({
  scope: S.optional(Scope),
  resourceType: S.optional(S.String),
  enhancedInfrastructureMetrics: S.optional(S.String),
  inferredWorkloadTypes: S.optional(S.String),
  externalMetricsPreference: S.optional(ExternalMetricsPreference),
  lookBackPeriod: S.optional(S.String),
  utilizationPreferences: S.optional(UtilizationPreferences),
  preferredResources: S.optional(EffectivePreferredResources),
  savingsEstimationMode: S.optional(S.String),
}) {}
export const RecommendationPreferencesDetails = S.Array(
  RecommendationPreferencesDetail,
);
export const MixedInstanceTypes = S.Array(S.String);
export class UtilizationMetric extends S.Class<UtilizationMetric>(
  "UtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const ProjectedUtilizationMetrics = S.Array(UtilizationMetric);
export const PlatformDifferences = S.Array(S.String);
export const Timestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const MetricValues = S.Array(S.Number);
export class RDSDBUtilizationMetric extends S.Class<RDSDBUtilizationMetric>(
  "RDSDBUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const RDSDBProjectedUtilizationMetrics = S.Array(RDSDBUtilizationMetric);
export class ExportAutoScalingGroupRecommendationsResponse extends S.Class<ExportAutoScalingGroupRecommendationsResponse>(
  "ExportAutoScalingGroupRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportEBSVolumeRecommendationsResponse extends S.Class<ExportEBSVolumeRecommendationsResponse>(
  "ExportEBSVolumeRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportEC2InstanceRecommendationsResponse extends S.Class<ExportEC2InstanceRecommendationsResponse>(
  "ExportEC2InstanceRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportECSServiceRecommendationsResponse extends S.Class<ExportECSServiceRecommendationsResponse>(
  "ExportECSServiceRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportIdleRecommendationsResponse extends S.Class<ExportIdleRecommendationsResponse>(
  "ExportIdleRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportLambdaFunctionRecommendationsResponse extends S.Class<ExportLambdaFunctionRecommendationsResponse>(
  "ExportLambdaFunctionRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportLicenseRecommendationsResponse extends S.Class<ExportLicenseRecommendationsResponse>(
  "ExportLicenseRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class ExportRDSDatabaseRecommendationsResponse extends S.Class<ExportRDSDatabaseRecommendationsResponse>(
  "ExportRDSDatabaseRecommendationsResponse",
)({ jobId: S.optional(S.String), s3Destination: S.optional(S3Destination) }) {}
export class GetEffectiveRecommendationPreferencesResponse extends S.Class<GetEffectiveRecommendationPreferencesResponse>(
  "GetEffectiveRecommendationPreferencesResponse",
)({
  enhancedInfrastructureMetrics: S.optional(S.String),
  externalMetricsPreference: S.optional(ExternalMetricsPreference),
  lookBackPeriod: S.optional(S.String),
  utilizationPreferences: S.optional(UtilizationPreferences),
  preferredResources: S.optional(EffectivePreferredResources),
}) {}
export class GetRecommendationPreferencesResponse extends S.Class<GetRecommendationPreferencesResponse>(
  "GetRecommendationPreferencesResponse",
)({
  nextToken: S.optional(S.String),
  recommendationPreferencesDetails: S.optional(
    RecommendationPreferencesDetails,
  ),
}) {}
export class PutRecommendationPreferencesRequest extends S.Class<PutRecommendationPreferencesRequest>(
  "PutRecommendationPreferencesRequest",
)(
  {
    resourceType: S.String,
    scope: S.optional(Scope),
    enhancedInfrastructureMetrics: S.optional(S.String),
    inferredWorkloadTypes: S.optional(S.String),
    externalMetricsPreference: S.optional(ExternalMetricsPreference),
    lookBackPeriod: S.optional(S.String),
    utilizationPreferences: S.optional(UtilizationPreferences),
    preferredResources: S.optional(PreferredResources),
    savingsEstimationMode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRecommendationPreferencesResponse extends S.Class<PutRecommendationPreferencesResponse>(
  "PutRecommendationPreferencesResponse",
)({}) {}
export const UtilizationMetrics = S.Array(UtilizationMetric);
export class AutoScalingGroupConfiguration extends S.Class<AutoScalingGroupConfiguration>(
  "AutoScalingGroupConfiguration",
)({
  desiredCapacity: S.optional(S.Number),
  minSize: S.optional(S.Number),
  maxSize: S.optional(S.Number),
  instanceType: S.optional(S.String),
  allocationStrategy: S.optional(S.String),
  estimatedInstanceHourReductionPercentage: S.optional(S.Number),
  type: S.optional(S.String),
  mixedInstanceTypes: S.optional(MixedInstanceTypes),
}) {}
export class VolumeConfiguration extends S.Class<VolumeConfiguration>(
  "VolumeConfiguration",
)({
  volumeType: S.optional(S.String),
  volumeSize: S.optional(S.Number),
  volumeBaselineIOPS: S.optional(S.Number),
  volumeBurstIOPS: S.optional(S.Number),
  volumeBaselineThroughput: S.optional(S.Number),
  volumeBurstThroughput: S.optional(S.Number),
  rootVolume: S.optional(S.Boolean),
}) {}
export class EBSUtilizationMetric extends S.Class<EBSUtilizationMetric>(
  "EBSUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const EBSUtilizationMetrics = S.Array(EBSUtilizationMetric);
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const Tags = S.Array(Tag);
export class RecommendationSource extends S.Class<RecommendationSource>(
  "RecommendationSource",
)({
  recommendationSourceArn: S.optional(S.String),
  recommendationSourceType: S.optional(S.String),
}) {}
export const RecommendationSources = S.Array(RecommendationSource);
export class ExternalMetricStatus extends S.Class<ExternalMetricStatus>(
  "ExternalMetricStatus",
)({ statusCode: S.optional(S.String), statusReason: S.optional(S.String) }) {}
export class ProjectedMetric extends S.Class<ProjectedMetric>(
  "ProjectedMetric",
)({
  name: S.optional(S.String),
  timestamps: S.optional(Timestamps),
  values: S.optional(MetricValues),
}) {}
export const ProjectedMetrics = S.Array(ProjectedMetric);
export class ECSServiceProjectedMetric extends S.Class<ECSServiceProjectedMetric>(
  "ECSServiceProjectedMetric",
)({
  name: S.optional(S.String),
  timestamps: S.optional(Timestamps),
  upperBoundValues: S.optional(MetricValues),
  lowerBoundValues: S.optional(MetricValues),
}) {}
export const ECSServiceProjectedMetrics = S.Array(ECSServiceProjectedMetric);
export class ECSServiceUtilizationMetric extends S.Class<ECSServiceUtilizationMetric>(
  "ECSServiceUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const ECSServiceUtilizationMetrics = S.Array(
  ECSServiceUtilizationMetric,
);
export class LambdaFunctionUtilizationMetric extends S.Class<LambdaFunctionUtilizationMetric>(
  "LambdaFunctionUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const LambdaFunctionUtilizationMetrics = S.Array(
  LambdaFunctionUtilizationMetric,
);
export class EstimatedMonthlySavings extends S.Class<EstimatedMonthlySavings>(
  "EstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class SavingsOpportunity extends S.Class<SavingsOpportunity>(
  "SavingsOpportunity",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export class LicenseRecommendationOption extends S.Class<LicenseRecommendationOption>(
  "LicenseRecommendationOption",
)({
  rank: S.optional(S.Number),
  operatingSystem: S.optional(S.String),
  licenseEdition: S.optional(S.String),
  licenseModel: S.optional(S.String),
  savingsOpportunity: S.optional(SavingsOpportunity),
}) {}
export const LicenseRecommendationOptions = S.Array(
  LicenseRecommendationOption,
);
export class RDSDatabaseProjectedMetric extends S.Class<RDSDatabaseProjectedMetric>(
  "RDSDatabaseProjectedMetric",
)({
  name: S.optional(S.String),
  timestamps: S.optional(Timestamps),
  values: S.optional(MetricValues),
}) {}
export const RDSDatabaseProjectedMetrics = S.Array(RDSDatabaseProjectedMetric);
export class DBStorageConfiguration extends S.Class<DBStorageConfiguration>(
  "DBStorageConfiguration",
)({
  storageType: S.optional(S.String),
  allocatedStorage: S.optional(S.Number),
  iops: S.optional(S.Number),
  maxAllocatedStorage: S.optional(S.Number),
  storageThroughput: S.optional(S.Number),
}) {}
export const RDSDBUtilizationMetrics = S.Array(RDSDBUtilizationMetric);
export class IdleSummary extends S.Class<IdleSummary>("IdleSummary")({
  name: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const IdleSummaries = S.Array(IdleSummary);
export class CurrentPerformanceRiskRatings extends S.Class<CurrentPerformanceRiskRatings>(
  "CurrentPerformanceRiskRatings",
)({
  high: S.optional(S.Number),
  medium: S.optional(S.Number),
  low: S.optional(S.Number),
  veryLow: S.optional(S.Number),
}) {}
export class InferredWorkloadSaving extends S.Class<InferredWorkloadSaving>(
  "InferredWorkloadSaving",
)({
  inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
  estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
}) {}
export const InferredWorkloadSavings = S.Array(InferredWorkloadSaving);
export class RecommendedOptionProjectedMetric extends S.Class<RecommendedOptionProjectedMetric>(
  "RecommendedOptionProjectedMetric",
)({
  recommendedInstanceType: S.optional(S.String),
  rank: S.optional(S.Number),
  projectedMetrics: S.optional(ProjectedMetrics),
}) {}
export const RecommendedOptionProjectedMetrics = S.Array(
  RecommendedOptionProjectedMetric,
);
export class ECSServiceRecommendedOptionProjectedMetric extends S.Class<ECSServiceRecommendedOptionProjectedMetric>(
  "ECSServiceRecommendedOptionProjectedMetric",
)({
  recommendedCpuUnits: S.optional(S.Number),
  recommendedMemorySize: S.optional(S.Number),
  projectedMetrics: S.optional(ECSServiceProjectedMetrics),
}) {}
export const ECSServiceRecommendedOptionProjectedMetrics = S.Array(
  ECSServiceRecommendedOptionProjectedMetric,
);
export class AccountEnrollmentStatus extends S.Class<AccountEnrollmentStatus>(
  "AccountEnrollmentStatus",
)({
  accountId: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AccountEnrollmentStatuses = S.Array(AccountEnrollmentStatus);
export class IdleRecommendationError extends S.Class<IdleRecommendationError>(
  "IdleRecommendationError",
)({
  identifier: S.optional(S.String),
  code: S.optional(S.String),
  message: S.optional(S.String),
  resourceType: S.optional(S.String),
}) {}
export const IdleRecommendationErrors = S.Array(IdleRecommendationError);
export class RDSDatabaseRecommendedOptionProjectedMetric extends S.Class<RDSDatabaseRecommendedOptionProjectedMetric>(
  "RDSDatabaseRecommendedOptionProjectedMetric",
)({
  recommendedDBInstanceClass: S.optional(S.String),
  rank: S.optional(S.Number),
  projectedMetrics: S.optional(RDSDatabaseProjectedMetrics),
}) {}
export const RDSDatabaseRecommendedOptionProjectedMetrics = S.Array(
  RDSDatabaseRecommendedOptionProjectedMetric,
);
export class Gpu extends S.Class<Gpu>("Gpu")({
  gpuCount: S.optional(S.Number),
  gpuMemorySizeInMiB: S.optional(S.Number),
}) {}
export const Gpus = S.Array(Gpu);
export class InstanceSavingsEstimationMode extends S.Class<InstanceSavingsEstimationMode>(
  "InstanceSavingsEstimationMode",
)({ source: S.optional(S.String) }) {}
export class EBSSavingsEstimationMode extends S.Class<EBSSavingsEstimationMode>(
  "EBSSavingsEstimationMode",
)({ source: S.optional(S.String) }) {}
export class ECSServiceProjectedUtilizationMetric extends S.Class<ECSServiceProjectedUtilizationMetric>(
  "ECSServiceProjectedUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  lowerBoundValue: S.optional(S.Number),
  upperBoundValue: S.optional(S.Number),
}) {}
export const ECSServiceProjectedUtilizationMetrics = S.Array(
  ECSServiceProjectedUtilizationMetric,
);
export class MemorySizeConfiguration extends S.Class<MemorySizeConfiguration>(
  "MemorySizeConfiguration",
)({ memory: S.optional(S.Number), memoryReservation: S.optional(S.Number) }) {}
export class ContainerRecommendation extends S.Class<ContainerRecommendation>(
  "ContainerRecommendation",
)({
  containerName: S.optional(S.String),
  memorySizeConfiguration: S.optional(MemorySizeConfiguration),
  cpu: S.optional(S.Number),
}) {}
export const ContainerRecommendations = S.Array(ContainerRecommendation);
export class ECSSavingsEstimationMode extends S.Class<ECSSavingsEstimationMode>(
  "ECSSavingsEstimationMode",
)({ source: S.optional(S.String) }) {}
export class LambdaFunctionMemoryProjectedMetric extends S.Class<LambdaFunctionMemoryProjectedMetric>(
  "LambdaFunctionMemoryProjectedMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const LambdaFunctionMemoryProjectedMetrics = S.Array(
  LambdaFunctionMemoryProjectedMetric,
);
export class LambdaSavingsEstimationMode extends S.Class<LambdaSavingsEstimationMode>(
  "LambdaSavingsEstimationMode",
)({ source: S.optional(S.String) }) {}
export class MetricSource extends S.Class<MetricSource>("MetricSource")({
  provider: S.optional(S.String),
  providerArn: S.optional(S.String),
}) {}
export const MetricsSource = S.Array(MetricSource);
export class RDSSavingsEstimationMode extends S.Class<RDSSavingsEstimationMode>(
  "RDSSavingsEstimationMode",
)({ source: S.optional(S.String) }) {}
export class ReasonCodeSummary extends S.Class<ReasonCodeSummary>(
  "ReasonCodeSummary",
)({ name: S.optional(S.String), value: S.optional(S.Number) }) {}
export const ReasonCodeSummaries = S.Array(ReasonCodeSummary);
export class GetEC2RecommendationProjectedMetricsResponse extends S.Class<GetEC2RecommendationProjectedMetricsResponse>(
  "GetEC2RecommendationProjectedMetricsResponse",
)({
  recommendedOptionProjectedMetrics: S.optional(
    RecommendedOptionProjectedMetrics,
  ),
}) {}
export class GetECSServiceRecommendationProjectedMetricsResponse extends S.Class<GetECSServiceRecommendationProjectedMetricsResponse>(
  "GetECSServiceRecommendationProjectedMetricsResponse",
)({
  recommendedOptionProjectedMetrics: S.optional(
    ECSServiceRecommendedOptionProjectedMetrics,
  ),
}) {}
export class GetEnrollmentStatusesForOrganizationResponse extends S.Class<GetEnrollmentStatusesForOrganizationResponse>(
  "GetEnrollmentStatusesForOrganizationResponse",
)({
  accountEnrollmentStatuses: S.optional(AccountEnrollmentStatuses),
  nextToken: S.optional(S.String),
}) {}
export class GetRDSDatabaseRecommendationProjectedMetricsResponse extends S.Class<GetRDSDatabaseRecommendationProjectedMetricsResponse>(
  "GetRDSDatabaseRecommendationProjectedMetricsResponse",
)({
  recommendedOptionProjectedMetrics: S.optional(
    RDSDatabaseRecommendedOptionProjectedMetrics,
  ),
}) {}
export class ExportDestination extends S.Class<ExportDestination>(
  "ExportDestination",
)({ s3: S.optional(S3Destination) }) {}
export class GpuInfo extends S.Class<GpuInfo>("GpuInfo")({
  gpus: S.optional(Gpus),
}) {}
export class EffectiveRecommendationPreferences extends S.Class<EffectiveRecommendationPreferences>(
  "EffectiveRecommendationPreferences",
)({
  cpuVendorArchitectures: S.optional(CpuVendorArchitectures),
  enhancedInfrastructureMetrics: S.optional(S.String),
  inferredWorkloadTypes: S.optional(S.String),
  externalMetricsPreference: S.optional(ExternalMetricsPreference),
  lookBackPeriod: S.optional(S.String),
  utilizationPreferences: S.optional(UtilizationPreferences),
  preferredResources: S.optional(EffectivePreferredResources),
  savingsEstimationMode: S.optional(InstanceSavingsEstimationMode),
}) {}
export class EBSEffectiveRecommendationPreferences extends S.Class<EBSEffectiveRecommendationPreferences>(
  "EBSEffectiveRecommendationPreferences",
)({ savingsEstimationMode: S.optional(EBSSavingsEstimationMode) }) {}
export class ECSEffectiveRecommendationPreferences extends S.Class<ECSEffectiveRecommendationPreferences>(
  "ECSEffectiveRecommendationPreferences",
)({ savingsEstimationMode: S.optional(ECSSavingsEstimationMode) }) {}
export class IdleEstimatedMonthlySavings extends S.Class<IdleEstimatedMonthlySavings>(
  "IdleEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class IdleSavingsOpportunityAfterDiscounts extends S.Class<IdleSavingsOpportunityAfterDiscounts>(
  "IdleSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(IdleEstimatedMonthlySavings),
}) {}
export class IdleUtilizationMetric extends S.Class<IdleUtilizationMetric>(
  "IdleUtilizationMetric",
)({
  name: S.optional(S.String),
  statistic: S.optional(S.String),
  value: S.optional(S.Number),
}) {}
export const IdleUtilizationMetrics = S.Array(IdleUtilizationMetric);
export class LambdaEffectiveRecommendationPreferences extends S.Class<LambdaEffectiveRecommendationPreferences>(
  "LambdaEffectiveRecommendationPreferences",
)({ savingsEstimationMode: S.optional(LambdaSavingsEstimationMode) }) {}
export class LicenseConfiguration extends S.Class<LicenseConfiguration>(
  "LicenseConfiguration",
)({
  numberOfCores: S.optional(S.Number),
  instanceType: S.optional(S.String),
  operatingSystem: S.optional(S.String),
  licenseEdition: S.optional(S.String),
  licenseName: S.optional(S.String),
  licenseModel: S.optional(S.String),
  licenseVersion: S.optional(S.String),
  metricsSource: S.optional(MetricsSource),
}) {}
export class RDSEffectiveRecommendationPreferences extends S.Class<RDSEffectiveRecommendationPreferences>(
  "RDSEffectiveRecommendationPreferences",
)({
  cpuVendorArchitectures: S.optional(CpuVendorArchitectures),
  enhancedInfrastructureMetrics: S.optional(S.String),
  lookBackPeriod: S.optional(S.String),
  savingsEstimationMode: S.optional(RDSSavingsEstimationMode),
}) {}
export class Summary extends S.Class<Summary>("Summary")({
  name: S.optional(S.String),
  value: S.optional(S.Number),
  reasonCodeSummaries: S.optional(ReasonCodeSummaries),
}) {}
export const Summaries = S.Array(Summary);
export class AutoScalingGroupEstimatedMonthlySavings extends S.Class<AutoScalingGroupEstimatedMonthlySavings>(
  "AutoScalingGroupEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class EBSEstimatedMonthlySavings extends S.Class<EBSEstimatedMonthlySavings>(
  "EBSEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class InstanceEstimatedMonthlySavings extends S.Class<InstanceEstimatedMonthlySavings>(
  "InstanceEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class ECSEstimatedMonthlySavings extends S.Class<ECSEstimatedMonthlySavings>(
  "ECSEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class LambdaEstimatedMonthlySavings extends S.Class<LambdaEstimatedMonthlySavings>(
  "LambdaEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class RDSInstanceEstimatedMonthlySavings extends S.Class<RDSInstanceEstimatedMonthlySavings>(
  "RDSInstanceEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class RDSStorageEstimatedMonthlySavings extends S.Class<RDSStorageEstimatedMonthlySavings>(
  "RDSStorageEstimatedMonthlySavings",
)({ currency: S.optional(S.String), value: S.optional(S.Number) }) {}
export class RecommendationExportJob extends S.Class<RecommendationExportJob>(
  "RecommendationExportJob",
)({
  jobId: S.optional(S.String),
  destination: S.optional(ExportDestination),
  resourceType: S.optional(S.String),
  status: S.optional(S.String),
  creationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const RecommendationExportJobs = S.Array(RecommendationExportJob);
export class LicenseRecommendation extends S.Class<LicenseRecommendation>(
  "LicenseRecommendation",
)({
  resourceArn: S.optional(S.String),
  accountId: S.optional(S.String),
  currentLicenseConfiguration: S.optional(LicenseConfiguration),
  lookbackPeriodInDays: S.optional(S.Number),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  finding: S.optional(S.String),
  findingReasonCodes: S.optional(LicenseFindingReasonCodes),
  licenseRecommendationOptions: S.optional(LicenseRecommendationOptions),
  tags: S.optional(Tags),
}) {}
export const LicenseRecommendations = S.Array(LicenseRecommendation);
export class RecommendationSummary extends S.Class<RecommendationSummary>(
  "RecommendationSummary",
)({
  summaries: S.optional(Summaries),
  idleSummaries: S.optional(IdleSummaries),
  recommendationResourceType: S.optional(S.String),
  accountId: S.optional(S.String),
  savingsOpportunity: S.optional(SavingsOpportunity),
  idleSavingsOpportunity: S.optional(SavingsOpportunity),
  aggregatedSavingsOpportunity: S.optional(SavingsOpportunity),
  currentPerformanceRiskRatings: S.optional(CurrentPerformanceRiskRatings),
  inferredWorkloadSavings: S.optional(InferredWorkloadSavings),
}) {}
export const RecommendationSummaries = S.Array(RecommendationSummary);
export class AutoScalingGroupSavingsOpportunityAfterDiscounts extends S.Class<AutoScalingGroupSavingsOpportunityAfterDiscounts>(
  "AutoScalingGroupSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(AutoScalingGroupEstimatedMonthlySavings),
}) {}
export class EBSSavingsOpportunityAfterDiscounts extends S.Class<EBSSavingsOpportunityAfterDiscounts>(
  "EBSSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(EBSEstimatedMonthlySavings),
}) {}
export class InstanceSavingsOpportunityAfterDiscounts extends S.Class<InstanceSavingsOpportunityAfterDiscounts>(
  "InstanceSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(InstanceEstimatedMonthlySavings),
}) {}
export class ContainerConfiguration extends S.Class<ContainerConfiguration>(
  "ContainerConfiguration",
)({
  containerName: S.optional(S.String),
  memorySizeConfiguration: S.optional(MemorySizeConfiguration),
  cpu: S.optional(S.Number),
}) {}
export const ContainerConfigurations = S.Array(ContainerConfiguration);
export class ECSSavingsOpportunityAfterDiscounts extends S.Class<ECSSavingsOpportunityAfterDiscounts>(
  "ECSSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(ECSEstimatedMonthlySavings),
}) {}
export class LambdaSavingsOpportunityAfterDiscounts extends S.Class<LambdaSavingsOpportunityAfterDiscounts>(
  "LambdaSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(LambdaEstimatedMonthlySavings),
}) {}
export class RDSInstanceSavingsOpportunityAfterDiscounts extends S.Class<RDSInstanceSavingsOpportunityAfterDiscounts>(
  "RDSInstanceSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(RDSInstanceEstimatedMonthlySavings),
}) {}
export class RDSStorageSavingsOpportunityAfterDiscounts extends S.Class<RDSStorageSavingsOpportunityAfterDiscounts>(
  "RDSStorageSavingsOpportunityAfterDiscounts",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(RDSStorageEstimatedMonthlySavings),
}) {}
export class DescribeRecommendationExportJobsResponse extends S.Class<DescribeRecommendationExportJobsResponse>(
  "DescribeRecommendationExportJobsResponse",
)({
  recommendationExportJobs: S.optional(RecommendationExportJobs),
  nextToken: S.optional(S.String),
}) {}
export class GetLicenseRecommendationsResponse extends S.Class<GetLicenseRecommendationsResponse>(
  "GetLicenseRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  licenseRecommendations: S.optional(LicenseRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}
export class GetRecommendationSummariesResponse extends S.Class<GetRecommendationSummariesResponse>(
  "GetRecommendationSummariesResponse",
)({
  nextToken: S.optional(S.String),
  recommendationSummaries: S.optional(RecommendationSummaries),
}) {}
export class AutoScalingGroupRecommendationOption extends S.Class<AutoScalingGroupRecommendationOption>(
  "AutoScalingGroupRecommendationOption",
)({
  configuration: S.optional(AutoScalingGroupConfiguration),
  instanceGpuInfo: S.optional(GpuInfo),
  projectedUtilizationMetrics: S.optional(ProjectedUtilizationMetrics),
  performanceRisk: S.optional(S.Number),
  rank: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    AutoScalingGroupSavingsOpportunityAfterDiscounts,
  ),
  migrationEffort: S.optional(S.String),
}) {}
export const AutoScalingGroupRecommendationOptions = S.Array(
  AutoScalingGroupRecommendationOption,
);
export class VolumeRecommendationOption extends S.Class<VolumeRecommendationOption>(
  "VolumeRecommendationOption",
)({
  configuration: S.optional(VolumeConfiguration),
  performanceRisk: S.optional(S.Number),
  rank: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    EBSSavingsOpportunityAfterDiscounts,
  ),
}) {}
export const VolumeRecommendationOptions = S.Array(VolumeRecommendationOption);
export class InstanceRecommendationOption extends S.Class<InstanceRecommendationOption>(
  "InstanceRecommendationOption",
)({
  instanceType: S.optional(S.String),
  instanceGpuInfo: S.optional(GpuInfo),
  projectedUtilizationMetrics: S.optional(ProjectedUtilizationMetrics),
  platformDifferences: S.optional(PlatformDifferences),
  performanceRisk: S.optional(S.Number),
  rank: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    InstanceSavingsOpportunityAfterDiscounts,
  ),
  migrationEffort: S.optional(S.String),
}) {}
export const RecommendationOptions = S.Array(InstanceRecommendationOption);
export class ServiceConfiguration extends S.Class<ServiceConfiguration>(
  "ServiceConfiguration",
)({
  memory: S.optional(S.Number),
  cpu: S.optional(S.Number),
  containerConfigurations: S.optional(ContainerConfigurations),
  autoScalingConfiguration: S.optional(S.String),
  taskDefinitionArn: S.optional(S.String),
}) {}
export class ECSServiceRecommendationOption extends S.Class<ECSServiceRecommendationOption>(
  "ECSServiceRecommendationOption",
)({
  memory: S.optional(S.Number),
  cpu: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    ECSSavingsOpportunityAfterDiscounts,
  ),
  projectedUtilizationMetrics: S.optional(
    ECSServiceProjectedUtilizationMetrics,
  ),
  containerRecommendations: S.optional(ContainerRecommendations),
}) {}
export const ECSServiceRecommendationOptions = S.Array(
  ECSServiceRecommendationOption,
);
export class IdleSavingsOpportunity extends S.Class<IdleSavingsOpportunity>(
  "IdleSavingsOpportunity",
)({
  savingsOpportunityPercentage: S.optional(S.Number),
  estimatedMonthlySavings: S.optional(IdleEstimatedMonthlySavings),
}) {}
export class LambdaFunctionMemoryRecommendationOption extends S.Class<LambdaFunctionMemoryRecommendationOption>(
  "LambdaFunctionMemoryRecommendationOption",
)({
  rank: S.optional(S.Number),
  memorySize: S.optional(S.Number),
  projectedUtilizationMetrics: S.optional(LambdaFunctionMemoryProjectedMetrics),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    LambdaSavingsOpportunityAfterDiscounts,
  ),
}) {}
export const LambdaFunctionMemoryRecommendationOptions = S.Array(
  LambdaFunctionMemoryRecommendationOption,
);
export class RDSDBInstanceRecommendationOption extends S.Class<RDSDBInstanceRecommendationOption>(
  "RDSDBInstanceRecommendationOption",
)({
  dbInstanceClass: S.optional(S.String),
  projectedUtilizationMetrics: S.optional(RDSDBProjectedUtilizationMetrics),
  performanceRisk: S.optional(S.Number),
  rank: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    RDSInstanceSavingsOpportunityAfterDiscounts,
  ),
}) {}
export const RDSDBInstanceRecommendationOptions = S.Array(
  RDSDBInstanceRecommendationOption,
);
export class RDSDBStorageRecommendationOption extends S.Class<RDSDBStorageRecommendationOption>(
  "RDSDBStorageRecommendationOption",
)({
  storageConfiguration: S.optional(DBStorageConfiguration),
  rank: S.optional(S.Number),
  savingsOpportunity: S.optional(SavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    RDSStorageSavingsOpportunityAfterDiscounts,
  ),
  estimatedMonthlyVolumeIOPsCostVariation: S.optional(S.String),
}) {}
export const RDSDBStorageRecommendationOptions = S.Array(
  RDSDBStorageRecommendationOption,
);
export class AutoScalingGroupRecommendation extends S.Class<AutoScalingGroupRecommendation>(
  "AutoScalingGroupRecommendation",
)({
  accountId: S.optional(S.String),
  autoScalingGroupArn: S.optional(S.String),
  autoScalingGroupName: S.optional(S.String),
  finding: S.optional(S.String),
  utilizationMetrics: S.optional(UtilizationMetrics),
  lookBackPeriodInDays: S.optional(S.Number),
  currentConfiguration: S.optional(AutoScalingGroupConfiguration),
  currentInstanceGpuInfo: S.optional(GpuInfo),
  recommendationOptions: S.optional(AutoScalingGroupRecommendationOptions),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  currentPerformanceRisk: S.optional(S.String),
  effectiveRecommendationPreferences: S.optional(
    EffectiveRecommendationPreferences,
  ),
  inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
}) {}
export const AutoScalingGroupRecommendations = S.Array(
  AutoScalingGroupRecommendation,
);
export class VolumeRecommendation extends S.Class<VolumeRecommendation>(
  "VolumeRecommendation",
)({
  volumeArn: S.optional(S.String),
  accountId: S.optional(S.String),
  currentConfiguration: S.optional(VolumeConfiguration),
  finding: S.optional(S.String),
  utilizationMetrics: S.optional(EBSUtilizationMetrics),
  lookBackPeriodInDays: S.optional(S.Number),
  volumeRecommendationOptions: S.optional(VolumeRecommendationOptions),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  currentPerformanceRisk: S.optional(S.String),
  effectiveRecommendationPreferences: S.optional(
    EBSEffectiveRecommendationPreferences,
  ),
  tags: S.optional(Tags),
}) {}
export const VolumeRecommendations = S.Array(VolumeRecommendation);
export class InstanceRecommendation extends S.Class<InstanceRecommendation>(
  "InstanceRecommendation",
)({
  instanceArn: S.optional(S.String),
  accountId: S.optional(S.String),
  instanceName: S.optional(S.String),
  currentInstanceType: S.optional(S.String),
  finding: S.optional(S.String),
  findingReasonCodes: S.optional(InstanceRecommendationFindingReasonCodes),
  utilizationMetrics: S.optional(UtilizationMetrics),
  lookBackPeriodInDays: S.optional(S.Number),
  recommendationOptions: S.optional(RecommendationOptions),
  recommendationSources: S.optional(RecommendationSources),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  currentPerformanceRisk: S.optional(S.String),
  effectiveRecommendationPreferences: S.optional(
    EffectiveRecommendationPreferences,
  ),
  inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
  instanceState: S.optional(S.String),
  tags: S.optional(Tags),
  externalMetricStatus: S.optional(ExternalMetricStatus),
  currentInstanceGpuInfo: S.optional(GpuInfo),
  idle: S.optional(S.String),
}) {}
export const InstanceRecommendations = S.Array(InstanceRecommendation);
export class ECSServiceRecommendation extends S.Class<ECSServiceRecommendation>(
  "ECSServiceRecommendation",
)({
  serviceArn: S.optional(S.String),
  accountId: S.optional(S.String),
  currentServiceConfiguration: S.optional(ServiceConfiguration),
  utilizationMetrics: S.optional(ECSServiceUtilizationMetrics),
  lookbackPeriodInDays: S.optional(S.Number),
  launchType: S.optional(S.String),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  finding: S.optional(S.String),
  findingReasonCodes: S.optional(ECSServiceRecommendationFindingReasonCodes),
  serviceRecommendationOptions: S.optional(ECSServiceRecommendationOptions),
  currentPerformanceRisk: S.optional(S.String),
  effectiveRecommendationPreferences: S.optional(
    ECSEffectiveRecommendationPreferences,
  ),
  tags: S.optional(Tags),
}) {}
export const ECSServiceRecommendations = S.Array(ECSServiceRecommendation);
export class IdleRecommendation extends S.Class<IdleRecommendation>(
  "IdleRecommendation",
)({
  resourceArn: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceType: S.optional(S.String),
  accountId: S.optional(S.String),
  finding: S.optional(S.String),
  findingDescription: S.optional(S.String),
  savingsOpportunity: S.optional(IdleSavingsOpportunity),
  savingsOpportunityAfterDiscounts: S.optional(
    IdleSavingsOpportunityAfterDiscounts,
  ),
  utilizationMetrics: S.optional(IdleUtilizationMetrics),
  lookBackPeriodInDays: S.optional(S.Number),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(Tags),
}) {}
export const IdleRecommendations = S.Array(IdleRecommendation);
export class LambdaFunctionRecommendation extends S.Class<LambdaFunctionRecommendation>(
  "LambdaFunctionRecommendation",
)({
  functionArn: S.optional(S.String),
  functionVersion: S.optional(S.String),
  accountId: S.optional(S.String),
  currentMemorySize: S.optional(S.Number),
  numberOfInvocations: S.optional(S.Number),
  utilizationMetrics: S.optional(LambdaFunctionUtilizationMetrics),
  lookbackPeriodInDays: S.optional(S.Number),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  finding: S.optional(S.String),
  findingReasonCodes: S.optional(
    LambdaFunctionRecommendationFindingReasonCodes,
  ),
  memorySizeRecommendationOptions: S.optional(
    LambdaFunctionMemoryRecommendationOptions,
  ),
  currentPerformanceRisk: S.optional(S.String),
  effectiveRecommendationPreferences: S.optional(
    LambdaEffectiveRecommendationPreferences,
  ),
  tags: S.optional(Tags),
}) {}
export const LambdaFunctionRecommendations = S.Array(
  LambdaFunctionRecommendation,
);
export class RDSDBRecommendation extends S.Class<RDSDBRecommendation>(
  "RDSDBRecommendation",
)({
  resourceArn: S.optional(S.String),
  accountId: S.optional(S.String),
  engine: S.optional(S.String),
  engineVersion: S.optional(S.String),
  promotionTier: S.optional(S.Number),
  currentDBInstanceClass: S.optional(S.String),
  currentStorageConfiguration: S.optional(DBStorageConfiguration),
  dbClusterIdentifier: S.optional(S.String),
  idle: S.optional(S.String),
  instanceFinding: S.optional(S.String),
  storageFinding: S.optional(S.String),
  instanceFindingReasonCodes: S.optional(RDSInstanceFindingReasonCodes),
  currentInstancePerformanceRisk: S.optional(S.String),
  currentStorageEstimatedMonthlyVolumeIOPsCostVariation: S.optional(S.String),
  storageFindingReasonCodes: S.optional(RDSStorageFindingReasonCodes),
  instanceRecommendationOptions: S.optional(RDSDBInstanceRecommendationOptions),
  storageRecommendationOptions: S.optional(RDSDBStorageRecommendationOptions),
  utilizationMetrics: S.optional(RDSDBUtilizationMetrics),
  effectiveRecommendationPreferences: S.optional(
    RDSEffectiveRecommendationPreferences,
  ),
  lookbackPeriodInDays: S.optional(S.Number),
  lastRefreshTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(Tags),
}) {}
export const RDSDBRecommendations = S.Array(RDSDBRecommendation);
export class GetAutoScalingGroupRecommendationsResponse extends S.Class<GetAutoScalingGroupRecommendationsResponse>(
  "GetAutoScalingGroupRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  autoScalingGroupRecommendations: S.optional(AutoScalingGroupRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}
export class GetEBSVolumeRecommendationsResponse extends S.Class<GetEBSVolumeRecommendationsResponse>(
  "GetEBSVolumeRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  volumeRecommendations: S.optional(VolumeRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}
export class GetEC2InstanceRecommendationsResponse extends S.Class<GetEC2InstanceRecommendationsResponse>(
  "GetEC2InstanceRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  instanceRecommendations: S.optional(InstanceRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}
export class GetECSServiceRecommendationsResponse extends S.Class<GetECSServiceRecommendationsResponse>(
  "GetECSServiceRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  ecsServiceRecommendations: S.optional(ECSServiceRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}
export class GetIdleRecommendationsResponse extends S.Class<GetIdleRecommendationsResponse>(
  "GetIdleRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  idleRecommendations: S.optional(IdleRecommendations),
  errors: S.optional(IdleRecommendationErrors),
}) {}
export class GetLambdaFunctionRecommendationsResponse extends S.Class<GetLambdaFunctionRecommendationsResponse>(
  "GetLambdaFunctionRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  lambdaFunctionRecommendations: S.optional(LambdaFunctionRecommendations),
}) {}
export class GetRDSDatabaseRecommendationsResponse extends S.Class<GetRDSDatabaseRecommendationsResponse>(
  "GetRDSDatabaseRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  rdsDBRecommendations: S.optional(RDSDBRecommendations),
  errors: S.optional(GetRecommendationErrors),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
) {}
export class MissingAuthenticationToken extends S.TaggedError<MissingAuthenticationToken>()(
  "MissingAuthenticationToken",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class OptInRequiredException extends S.TaggedError<OptInRequiredException>()(
  "OptInRequiredException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the enrollment (opt in) status of an account to the Compute Optimizer
 * service.
 *
 * If the account is the management account of an organization, this action also confirms
 * the enrollment status of member accounts of the organization. Use the GetEnrollmentStatusesForOrganization action to get detailed information
 * about the enrollment status of member accounts of an organization.
 */
export const getEnrollmentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnrollmentStatusRequest,
  output: GetEnrollmentStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns license recommendations for Amazon EC2 instances that run on a specific license.
 *
 * Compute Optimizer generates recommendations for licenses that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getLicenseRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLicenseRecommendationsRequest,
    output: GetLicenseRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the Compute Optimizer enrollment (opt-in) status of organization member
 * accounts, if your account is an organization management account.
 *
 * To get the enrollment status of standalone accounts, use the GetEnrollmentStatus action.
 */
export const getEnrollmentStatusesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetEnrollmentStatusesForOrganizationRequest,
    output: GetEnrollmentStatusesForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      ServiceUnavailableException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "accountEnrollmentStatuses",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates the enrollment (opt in and opt out) status of an account to the Compute Optimizer service.
 *
 * If the account is a management account of an organization, this action can also be
 * used to enroll member accounts of the organization.
 *
 * You must have the appropriate permissions to opt in to Compute Optimizer, to view its
 * recommendations, and to opt out. For more information, see Controlling access with Amazon Web Services Identity and Access Management in the *Compute Optimizer User Guide*.
 *
 * When you opt in, Compute Optimizer automatically creates a service-linked role in your
 * account to access its data. For more information, see Using
 * Service-Linked Roles for Compute Optimizer in the *Compute Optimizer User Guide*.
 */
export const updateEnrollmentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnrollmentStatusRequest,
    output: UpdateEnrollmentStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns the optimization findings for an account.
 *
 * It returns the number of:
 *
 * - Amazon EC2 instances in an account that are
 * `Underprovisioned`, `Overprovisioned`, or
 * `Optimized`.
 *
 * - EC2Amazon EC2 Auto Scaling groups in an account that are `NotOptimized`, or
 * `Optimized`.
 *
 * - Amazon EBS volumes in an account that are `NotOptimized`,
 * or `Optimized`.
 *
 * - Lambda functions in an account that are `NotOptimized`,
 * or `Optimized`.
 *
 * - Amazon ECS services in an account that are `Underprovisioned`,
 * `Overprovisioned`, or `Optimized`.
 *
 * - Commercial software licenses in an account that are `InsufficientMetrics`,
 * `NotOptimized` or `Optimized`.
 *
 * - Amazon Aurora and Amazon RDS databases in an account that are `Underprovisioned`,
 * `Overprovisioned`, `Optimized`, or `NotOptimized`.
 */
export const getRecommendationSummaries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetRecommendationSummariesRequest,
    output: GetRecommendationSummariesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "recommendationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Exports optimization recommendations for Amazon EC2 Auto Scaling groups.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EC2 Auto Scaling group export job in progress per Amazon Web Services Region.
 */
export const exportAutoScalingGroupRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportAutoScalingGroupRecommendationsRequest,
    output: ExportAutoScalingGroupRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Exports optimization recommendations for Amazon EBS volumes.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EBS volume export job in progress per Amazon Web Services Region.
 */
export const exportEBSVolumeRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportEBSVolumeRecommendationsRequest,
    output: ExportEBSVolumeRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Exports optimization recommendations for Amazon EC2 instances.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EC2 instance export job in progress per Amazon Web Services Region.
 */
export const exportEC2InstanceRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportEC2InstanceRecommendationsRequest,
    output: ExportEC2InstanceRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Exports optimization recommendations for Amazon ECS services on Fargate.
 *
 * Recommendations are exported in a CSV file, and its metadata
 * in a JSON file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can only have one Amazon ECS service export job in progress per Amazon Web Services Region.
 */
export const exportECSServiceRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportECSServiceRecommendationsRequest,
    output: ExportECSServiceRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Export optimization recommendations for your idle resources.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one idle resource export job in progress per Amazon Web Services Region.
 */
export const exportIdleRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExportIdleRecommendationsRequest,
    output: ExportIdleRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Exports optimization recommendations for Lambda functions.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Lambda function export job in progress per Amazon Web Services Region.
 */
export const exportLambdaFunctionRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportLambdaFunctionRecommendationsRequest,
    output: ExportLambdaFunctionRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Export optimization recommendations for your licenses.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one license export job in progress per Amazon Web Services Region.
 */
export const exportLicenseRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportLicenseRecommendationsRequest,
    output: ExportLicenseRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Export optimization recommendations for your Amazon Aurora and Amazon Relational Database Service (Amazon RDS) databases.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon Aurora or RDS export job in progress per Amazon Web Services Region.
 */
export const exportRDSDatabaseRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportRDSDatabaseRecommendationsRequest,
    output: ExportRDSDatabaseRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns Lambda function recommendations.
 *
 * Compute Optimizer generates recommendations for functions that meet a specific set
 * of requirements. For more information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getLambdaFunctionRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetLambdaFunctionRecommendationsRequest,
    output: GetLambdaFunctionRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      LimitExceededException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "lambdaFunctionRecommendations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns Amazon Aurora and RDS database recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon Aurora and RDS databases that
 * meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getRDSDatabaseRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRDSDatabaseRecommendationsRequest,
    output: GetRDSDatabaseRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the projected metrics of Aurora and RDS database recommendations.
 */
export const getRDSDatabaseRecommendationProjectedMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRDSDatabaseRecommendationProjectedMetricsRequest,
    output: GetRDSDatabaseRecommendationProjectedMetricsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns existing recommendation preferences, such as enhanced infrastructure
 * metrics.
 *
 * Use the `scope` parameter to specify which preferences to return. You can
 * specify to return preferences for an organization, a specific account ID, or a specific
 * EC2 instance or Amazon EC2 Auto Scaling group Amazon Resource Name (ARN).
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const getRecommendationPreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetRecommendationPreferencesRequest,
    output: GetRecommendationPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "recommendationPreferencesDetails",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a new recommendation preference or updates an existing recommendation
 * preference, such as enhanced infrastructure metrics.
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const putRecommendationPreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutRecommendationPreferencesRequest,
    output: PutRecommendationPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes a recommendation preference, such as enhanced infrastructure metrics.
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const deleteRecommendationPreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRecommendationPreferencesRequest,
    output: DeleteRecommendationPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the recommendation preferences that are in effect for a given resource, such
 * as enhanced infrastructure metrics. Considers all applicable preferences that you might
 * have set at the resource, account, and organization level.
 *
 * When you create a recommendation preference, you can set its status to
 * `Active` or `Inactive`. Use this action to view the
 * recommendation preferences that are in effect, or `Active`.
 */
export const getEffectiveRecommendationPreferences =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEffectiveRecommendationPreferencesRequest,
    output: GetEffectiveRecommendationPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the projected utilization metrics of Amazon EC2 instance
 * recommendations.
 *
 * The `Cpu` and `Memory` metrics are the only projected
 * utilization metrics returned when you run this action. Additionally, the
 * `Memory` metric is returned only for resources that have the unified
 * CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent.
 */
export const getEC2RecommendationProjectedMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEC2RecommendationProjectedMetricsRequest,
    output: GetEC2RecommendationProjectedMetricsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns the projected metrics of Amazon ECS service recommendations.
 */
export const getECSServiceRecommendationProjectedMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetECSServiceRecommendationProjectedMetricsRequest,
    output: GetECSServiceRecommendationProjectedMetricsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Describes recommendation export jobs created in the last seven days.
 *
 * Use the ExportAutoScalingGroupRecommendations or ExportEC2InstanceRecommendations actions to request an export of your
 * recommendations. Then use the DescribeRecommendationExportJobs action
 * to view your export jobs.
 */
export const describeRecommendationExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeRecommendationExportJobsRequest,
    output: DescribeRecommendationExportJobsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "recommendationExportJobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns Amazon EC2 Auto Scaling group recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon EC2 Auto Scaling groups that
 * meet a specific set of requirements. For more information, see the Supported
 * resources and requirements in the Compute Optimizer User
 * Guide.
 */
export const getAutoScalingGroupRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAutoScalingGroupRecommendationsRequest,
    output: GetAutoScalingGroupRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns Amazon Elastic Block Store (Amazon EBS) volume recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon EBS volumes that
 * meet a specific set of requirements. For more information, see the Supported
 * resources and requirements in the Compute Optimizer User
 * Guide.
 */
export const getEBSVolumeRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEBSVolumeRecommendationsRequest,
    output: GetEBSVolumeRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Returns Amazon EC2 instance recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon Elastic Compute Cloud (Amazon EC2) instances that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getEC2InstanceRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEC2InstanceRecommendationsRequest,
    output: GetEC2InstanceRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns Amazon ECS service recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon ECS services on
 * Fargate that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getECSServiceRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetECSServiceRecommendationsRequest,
    output: GetECSServiceRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }));
/**
 * Returns idle resource recommendations. Compute Optimizer generates recommendations for
 * idle resources that meet a specific set of requirements. For more information, see
 * Resource requirements in the
 * *Compute Optimizer User Guide*
 */
export const getIdleRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdleRecommendationsRequest,
    output: GetIdleRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterValueException,
      MissingAuthenticationToken,
      OptInRequiredException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
