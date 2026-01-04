import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace(
  "https://license-manager.amazonaws.com/doc/2018_08_01",
);
const svc = T.AwsApiService({
  sdkId: "License Manager",
  serviceShapeName: "AWSLicenseManager",
});
const auth = T.AwsAuthSigv4({ name: "license-manager" });
const ver = T.ServiceVersion("2018-08-01");
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
                        url: "https://license-manager-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://license-manager-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://license-manager.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://license-manager.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetServiceSettingsRequest extends S.Class<GetServiceSettingsRequest>(
  "GetServiceSettingsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PrincipalArnList = S.Array(S.String);
export const AllowedOperationList = S.Array(S.String);
export const LicenseAssetRulesetArnList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const ReportTypeList = S.Array(S.String);
export const ArnList = S.Array(S.String);
export const MaxSize3StringList = S.Array(S.String);
export const FilterValues = S.Array(S.String.pipe(T.XmlName("item")));
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(FilterValues),
}) {}
export const Filters = S.Array(Filter.pipe(T.XmlName("item")));
export const TagKeyList = S.Array(S.String);
export class AcceptGrantRequest extends S.Class<AcceptGrantRequest>(
  "AcceptGrantRequest",
)(
  { GrantArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckInLicenseRequest extends S.Class<CheckInLicenseRequest>(
  "CheckInLicenseRequest",
)(
  { LicenseConsumptionToken: S.String, Beneficiary: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckInLicenseResponse extends S.Class<CheckInLicenseResponse>(
  "CheckInLicenseResponse",
)({}, ns) {}
export class EntitlementData extends S.Class<EntitlementData>(
  "EntitlementData",
)({ Name: S.String, Value: S.optional(S.String), Unit: S.String }) {}
export const EntitlementDataList = S.Array(EntitlementData);
export class CheckoutLicenseRequest extends S.Class<CheckoutLicenseRequest>(
  "CheckoutLicenseRequest",
)(
  {
    ProductSKU: S.String,
    CheckoutType: S.String,
    KeyFingerprint: S.String,
    Entitlements: EntitlementDataList,
    ClientToken: S.String,
    Beneficiary: S.optional(S.String),
    NodeId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Issuer extends S.Class<Issuer>("Issuer")({
  Name: S.String,
  SignKey: S.optional(S.String),
}) {}
export class DatetimeRange extends S.Class<DatetimeRange>("DatetimeRange")({
  Begin: S.String,
  End: S.optional(S.String),
}) {}
export class Metadata extends S.Class<Metadata>("Metadata")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const MetadataList = S.Array(Metadata);
export class Entitlement extends S.Class<Entitlement>("Entitlement")({
  Name: S.String,
  Value: S.optional(S.String),
  MaxCount: S.optional(S.Number),
  Overage: S.optional(S.Boolean),
  Unit: S.String,
  AllowCheckIn: S.optional(S.Boolean),
}) {}
export const EntitlementList = S.Array(Entitlement);
export class ProvisionalConfiguration extends S.Class<ProvisionalConfiguration>(
  "ProvisionalConfiguration",
)({ MaxTimeToLiveInMinutes: S.Number }) {}
export class BorrowConfiguration extends S.Class<BorrowConfiguration>(
  "BorrowConfiguration",
)({ AllowEarlyCheckIn: S.Boolean, MaxTimeToLiveInMinutes: S.Number }) {}
export class ConsumptionConfiguration extends S.Class<ConsumptionConfiguration>(
  "ConsumptionConfiguration",
)({
  RenewType: S.optional(S.String),
  ProvisionalConfiguration: S.optional(ProvisionalConfiguration),
  BorrowConfiguration: S.optional(BorrowConfiguration),
}) {}
export class CreateLicenseVersionRequest extends S.Class<CreateLicenseVersionRequest>(
  "CreateLicenseVersionRequest",
)(
  {
    LicenseArn: S.String,
    LicenseName: S.String,
    ProductName: S.String,
    Issuer: Issuer,
    HomeRegion: S.String,
    Validity: DatetimeRange,
    LicenseMetadata: S.optional(MetadataList),
    Entitlements: EntitlementList,
    ConsumptionConfiguration: ConsumptionConfiguration,
    Status: S.String,
    ClientToken: S.String,
    SourceVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTokenRequest extends S.Class<CreateTokenRequest>(
  "CreateTokenRequest",
)(
  {
    LicenseArn: S.String,
    RoleArns: S.optional(ArnList),
    ExpirationInDays: S.optional(S.Number),
    TokenProperties: S.optional(MaxSize3StringList),
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGrantRequest extends S.Class<DeleteGrantRequest>(
  "DeleteGrantRequest",
)(
  { GrantArn: S.String, StatusReason: S.optional(S.String), Version: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseRequest extends S.Class<DeleteLicenseRequest>(
  "DeleteLicenseRequest",
)(
  { LicenseArn: S.String, SourceVersion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseAssetGroupRequest extends S.Class<DeleteLicenseAssetGroupRequest>(
  "DeleteLicenseAssetGroupRequest",
)(
  { LicenseAssetGroupArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseAssetRulesetRequest extends S.Class<DeleteLicenseAssetRulesetRequest>(
  "DeleteLicenseAssetRulesetRequest",
)(
  { LicenseAssetRulesetArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseAssetRulesetResponse extends S.Class<DeleteLicenseAssetRulesetResponse>(
  "DeleteLicenseAssetRulesetResponse",
)({}, ns) {}
export class DeleteLicenseConfigurationRequest extends S.Class<DeleteLicenseConfigurationRequest>(
  "DeleteLicenseConfigurationRequest",
)(
  { LicenseConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseConfigurationResponse extends S.Class<DeleteLicenseConfigurationResponse>(
  "DeleteLicenseConfigurationResponse",
)({}, ns) {}
export class DeleteLicenseManagerReportGeneratorRequest extends S.Class<DeleteLicenseManagerReportGeneratorRequest>(
  "DeleteLicenseManagerReportGeneratorRequest",
)(
  { LicenseManagerReportGeneratorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLicenseManagerReportGeneratorResponse extends S.Class<DeleteLicenseManagerReportGeneratorResponse>(
  "DeleteLicenseManagerReportGeneratorResponse",
)({}, ns) {}
export class DeleteTokenRequest extends S.Class<DeleteTokenRequest>(
  "DeleteTokenRequest",
)(
  { TokenId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTokenResponse extends S.Class<DeleteTokenResponse>(
  "DeleteTokenResponse",
)({}, ns) {}
export class ExtendLicenseConsumptionRequest extends S.Class<ExtendLicenseConsumptionRequest>(
  "ExtendLicenseConsumptionRequest",
)(
  { LicenseConsumptionToken: S.String, DryRun: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccessTokenRequest extends S.Class<GetAccessTokenRequest>(
  "GetAccessTokenRequest",
)(
  { Token: S.String, TokenProperties: S.optional(MaxSize3StringList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGrantRequest extends S.Class<GetGrantRequest>(
  "GetGrantRequest",
)(
  { GrantArn: S.String, Version: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseRequest extends S.Class<GetLicenseRequest>(
  "GetLicenseRequest",
)(
  { LicenseArn: S.String, Version: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseAssetGroupRequest extends S.Class<GetLicenseAssetGroupRequest>(
  "GetLicenseAssetGroupRequest",
)(
  { LicenseAssetGroupArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseAssetRulesetRequest extends S.Class<GetLicenseAssetRulesetRequest>(
  "GetLicenseAssetRulesetRequest",
)(
  { LicenseAssetRulesetArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseConfigurationRequest extends S.Class<GetLicenseConfigurationRequest>(
  "GetLicenseConfigurationRequest",
)(
  { LicenseConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseConversionTaskRequest extends S.Class<GetLicenseConversionTaskRequest>(
  "GetLicenseConversionTaskRequest",
)(
  { LicenseConversionTaskId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseManagerReportGeneratorRequest extends S.Class<GetLicenseManagerReportGeneratorRequest>(
  "GetLicenseManagerReportGeneratorRequest",
)(
  { LicenseManagerReportGeneratorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLicenseUsageRequest extends S.Class<GetLicenseUsageRequest>(
  "GetLicenseUsageRequest",
)(
  { LicenseArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAssetsForLicenseAssetGroupRequest extends S.Class<ListAssetsForLicenseAssetGroupRequest>(
  "ListAssetsForLicenseAssetGroupRequest",
)(
  {
    LicenseAssetGroupArn: S.String,
    AssetType: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAssociationsForLicenseConfigurationRequest extends S.Class<ListAssociationsForLicenseConfigurationRequest>(
  "ListAssociationsForLicenseConfigurationRequest",
)(
  {
    LicenseConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFailuresForLicenseConfigurationOperationsRequest extends S.Class<ListFailuresForLicenseConfigurationOperationsRequest>(
  "ListFailuresForLicenseConfigurationOperationsRequest",
)(
  {
    LicenseConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseAssetGroupsRequest extends S.Class<ListLicenseAssetGroupsRequest>(
  "ListLicenseAssetGroupsRequest",
)(
  {
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseAssetRulesetsRequest extends S.Class<ListLicenseAssetRulesetsRequest>(
  "ListLicenseAssetRulesetsRequest",
)(
  {
    Filters: S.optional(Filters),
    ShowAWSManagedLicenseAssetRulesets: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseConfigurationsRequest extends S.Class<ListLicenseConfigurationsRequest>(
  "ListLicenseConfigurationsRequest",
)(
  {
    LicenseConfigurationArns: S.optional(StringList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseConfigurationsForOrganizationRequest extends S.Class<ListLicenseConfigurationsForOrganizationRequest>(
  "ListLicenseConfigurationsForOrganizationRequest",
)(
  {
    LicenseConfigurationArns: S.optional(StringList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseConversionTasksRequest extends S.Class<ListLicenseConversionTasksRequest>(
  "ListLicenseConversionTasksRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterList = S.Array(Filter);
export class ListLicenseManagerReportGeneratorsRequest extends S.Class<ListLicenseManagerReportGeneratorsRequest>(
  "ListLicenseManagerReportGeneratorsRequest",
)(
  {
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicensesRequest extends S.Class<ListLicensesRequest>(
  "ListLicensesRequest",
)(
  {
    LicenseArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseSpecificationsForResourceRequest extends S.Class<ListLicenseSpecificationsForResourceRequest>(
  "ListLicenseSpecificationsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseVersionsRequest extends S.Class<ListLicenseVersionsRequest>(
  "ListLicenseVersionsRequest",
)(
  {
    LicenseArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceivedGrantsRequest extends S.Class<ListReceivedGrantsRequest>(
  "ListReceivedGrantsRequest",
)(
  {
    GrantArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceivedGrantsForOrganizationRequest extends S.Class<ListReceivedGrantsForOrganizationRequest>(
  "ListReceivedGrantsForOrganizationRequest",
)(
  {
    LicenseArn: S.String,
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceivedLicensesRequest extends S.Class<ListReceivedLicensesRequest>(
  "ListReceivedLicensesRequest",
)(
  {
    LicenseArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceivedLicensesForOrganizationRequest extends S.Class<ListReceivedLicensesForOrganizationRequest>(
  "ListReceivedLicensesForOrganizationRequest",
)(
  {
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTokensRequest extends S.Class<ListTokensRequest>(
  "ListTokensRequest",
)(
  {
    TokenIds: S.optional(StringList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUsageForLicenseConfigurationRequest extends S.Class<ListUsageForLicenseConfigurationRequest>(
  "ListUsageForLicenseConfigurationRequest",
)(
  {
    LicenseConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectGrantRequest extends S.Class<RejectGrantRequest>(
  "RejectGrantRequest",
)(
  { GrantArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class LicenseAssetGroupConfiguration extends S.Class<LicenseAssetGroupConfiguration>(
  "LicenseAssetGroupConfiguration",
)({ UsageDimension: S.optional(S.String) }) {}
export const LicenseAssetGroupConfigurationList = S.Array(
  LicenseAssetGroupConfiguration,
);
export class LicenseAssetGroupProperty extends S.Class<LicenseAssetGroupProperty>(
  "LicenseAssetGroupProperty",
)({ Key: S.String, Value: S.String }) {}
export const LicenseAssetGroupPropertyList = S.Array(LicenseAssetGroupProperty);
export class UpdateLicenseAssetGroupRequest extends S.Class<UpdateLicenseAssetGroupRequest>(
  "UpdateLicenseAssetGroupRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LicenseAssetGroupConfigurations: S.optional(
      LicenseAssetGroupConfigurationList,
    ),
    AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
    Properties: S.optional(LicenseAssetGroupPropertyList),
    LicenseAssetGroupArn: S.String,
    Status: S.optional(S.String),
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MatchingRuleStatement extends S.Class<MatchingRuleStatement>(
  "MatchingRuleStatement",
)({ KeyToMatch: S.String, Constraint: S.String, ValueToMatch: StringList }) {}
export const MatchingRuleStatementList = S.Array(MatchingRuleStatement);
export class ScriptRuleStatement extends S.Class<ScriptRuleStatement>(
  "ScriptRuleStatement",
)({ KeyToMatch: S.String, Script: S.String }) {}
export const ScriptRuleStatementList = S.Array(ScriptRuleStatement);
export class AndRuleStatement extends S.Class<AndRuleStatement>(
  "AndRuleStatement",
)({
  MatchingRuleStatements: S.optional(MatchingRuleStatementList),
  ScriptRuleStatements: S.optional(ScriptRuleStatementList),
}) {}
export class OrRuleStatement extends S.Class<OrRuleStatement>(
  "OrRuleStatement",
)({
  MatchingRuleStatements: S.optional(MatchingRuleStatementList),
  ScriptRuleStatements: S.optional(ScriptRuleStatementList),
}) {}
export class LicenseConfigurationRuleStatement extends S.Class<LicenseConfigurationRuleStatement>(
  "LicenseConfigurationRuleStatement",
)({
  AndRuleStatement: S.optional(AndRuleStatement),
  OrRuleStatement: S.optional(OrRuleStatement),
  MatchingRuleStatement: S.optional(MatchingRuleStatement),
}) {}
export class LicenseRuleStatement extends S.Class<LicenseRuleStatement>(
  "LicenseRuleStatement",
)({
  AndRuleStatement: S.optional(AndRuleStatement),
  OrRuleStatement: S.optional(OrRuleStatement),
  MatchingRuleStatement: S.optional(MatchingRuleStatement),
}) {}
export class InstanceRuleStatement extends S.Class<InstanceRuleStatement>(
  "InstanceRuleStatement",
)({
  AndRuleStatement: S.optional(AndRuleStatement),
  OrRuleStatement: S.optional(OrRuleStatement),
  MatchingRuleStatement: S.optional(MatchingRuleStatement),
  ScriptRuleStatement: S.optional(ScriptRuleStatement),
}) {}
export class RuleStatement extends S.Class<RuleStatement>("RuleStatement")({
  LicenseConfigurationRuleStatement: S.optional(
    LicenseConfigurationRuleStatement,
  ),
  LicenseRuleStatement: S.optional(LicenseRuleStatement),
  InstanceRuleStatement: S.optional(InstanceRuleStatement),
}) {}
export class LicenseAssetRule extends S.Class<LicenseAssetRule>(
  "LicenseAssetRule",
)({ RuleStatement: RuleStatement }) {}
export const LicenseAssetRuleList = S.Array(LicenseAssetRule);
export class UpdateLicenseAssetRulesetRequest extends S.Class<UpdateLicenseAssetRulesetRequest>(
  "UpdateLicenseAssetRulesetRequest",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Rules: LicenseAssetRuleList,
    LicenseAssetRulesetArn: S.String,
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProductInformationFilter extends S.Class<ProductInformationFilter>(
  "ProductInformationFilter",
)({
  ProductInformationFilterName: S.String,
  ProductInformationFilterValue: S.optional(StringList),
  ProductInformationFilterComparator: S.String,
}) {}
export const ProductInformationFilterList = S.Array(ProductInformationFilter);
export class ProductInformation extends S.Class<ProductInformation>(
  "ProductInformation",
)({
  ResourceType: S.String,
  ProductInformationFilterList: ProductInformationFilterList,
}) {}
export const ProductInformationList = S.Array(ProductInformation);
export class UpdateLicenseConfigurationRequest extends S.Class<UpdateLicenseConfigurationRequest>(
  "UpdateLicenseConfigurationRequest",
)(
  {
    LicenseConfigurationArn: S.String,
    LicenseConfigurationStatus: S.optional(S.String),
    LicenseRules: S.optional(StringList),
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ProductInformationList: S.optional(ProductInformationList),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    LicenseExpiry: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLicenseConfigurationResponse extends S.Class<UpdateLicenseConfigurationResponse>(
  "UpdateLicenseConfigurationResponse",
)({}, ns) {}
export class ReportContext extends S.Class<ReportContext>("ReportContext")({
  licenseConfigurationArns: S.optional(ArnList),
  licenseAssetGroupArns: S.optional(ArnList),
  reportStartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  reportEndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ReportFrequency extends S.Class<ReportFrequency>(
  "ReportFrequency",
)({ value: S.optional(S.Number), period: S.optional(S.String) }) {}
export class UpdateLicenseManagerReportGeneratorRequest extends S.Class<UpdateLicenseManagerReportGeneratorRequest>(
  "UpdateLicenseManagerReportGeneratorRequest",
)(
  {
    LicenseManagerReportGeneratorArn: S.String,
    ReportGeneratorName: S.String,
    Type: ReportTypeList,
    ReportContext: ReportContext,
    ReportFrequency: ReportFrequency,
    ClientToken: S.String,
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLicenseManagerReportGeneratorResponse extends S.Class<UpdateLicenseManagerReportGeneratorResponse>(
  "UpdateLicenseManagerReportGeneratorResponse",
)({}, ns) {}
export class OrganizationConfiguration extends S.Class<OrganizationConfiguration>(
  "OrganizationConfiguration",
)({ EnableIntegration: S.Boolean }) {}
export class UpdateServiceSettingsRequest extends S.Class<UpdateServiceSettingsRequest>(
  "UpdateServiceSettingsRequest",
)(
  {
    S3BucketArn: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
    EnableCrossAccountsDiscovery: S.optional(S.Boolean),
    EnabledDiscoverySourceRegions: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceSettingsResponse extends S.Class<UpdateServiceSettingsResponse>(
  "UpdateServiceSettingsResponse",
)({}, ns) {}
export class Options extends S.Class<Options>("Options")({
  ActivationOverrideBehavior: S.optional(S.String),
}) {}
export class LicenseAssetGroup extends S.Class<LicenseAssetGroup>(
  "LicenseAssetGroup",
)({
  Name: S.String,
  Description: S.optional(S.String),
  LicenseAssetGroupConfigurations: S.optional(
    LicenseAssetGroupConfigurationList,
  ),
  AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
  Properties: S.optional(LicenseAssetGroupPropertyList),
  LicenseAssetGroupArn: S.String,
  Status: S.String,
  StatusMessage: S.optional(S.String),
  LatestUsageAnalysisTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestResourceDiscoveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const LicenseAssetGroupList = S.Array(LicenseAssetGroup);
export class LicenseAssetRuleset extends S.Class<LicenseAssetRuleset>(
  "LicenseAssetRuleset",
)({
  Name: S.String,
  Description: S.optional(S.String),
  Rules: LicenseAssetRuleList,
  LicenseAssetRulesetArn: S.String,
}) {}
export const LicenseAssetRulesetList = S.Array(LicenseAssetRuleset);
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.optional(S.String),
  keyPrefix: S.optional(S.String),
}) {}
export class ReportGenerator extends S.Class<ReportGenerator>(
  "ReportGenerator",
)({
  ReportGeneratorName: S.optional(S.String),
  ReportType: S.optional(ReportTypeList),
  ReportContext: S.optional(ReportContext),
  ReportFrequency: S.optional(ReportFrequency),
  LicenseManagerReportGeneratorArn: S.optional(S.String),
  LastRunStatus: S.optional(S.String),
  LastRunFailureReason: S.optional(S.String),
  LastReportGenerationTime: S.optional(S.String),
  ReportCreatorAccount: S.optional(S.String),
  Description: S.optional(S.String),
  S3Location: S.optional(S3Location),
  CreateTime: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const ReportGeneratorList = S.Array(ReportGenerator);
export class IssuerDetails extends S.Class<IssuerDetails>("IssuerDetails")({
  Name: S.optional(S.String),
  SignKey: S.optional(S.String),
  KeyFingerprint: S.optional(S.String),
}) {}
export class License extends S.Class<License>("License")({
  LicenseArn: S.optional(S.String),
  LicenseName: S.optional(S.String),
  ProductName: S.optional(S.String),
  ProductSKU: S.optional(S.String),
  Issuer: S.optional(IssuerDetails),
  HomeRegion: S.optional(S.String),
  Status: S.optional(S.String),
  Validity: S.optional(DatetimeRange),
  Beneficiary: S.optional(S.String),
  Entitlements: S.optional(EntitlementList),
  ConsumptionConfiguration: S.optional(ConsumptionConfiguration),
  LicenseMetadata: S.optional(MetadataList),
  CreateTime: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export const LicenseList = S.Array(License);
export class Grant extends S.Class<Grant>("Grant")({
  GrantArn: S.String,
  GrantName: S.String,
  ParentArn: S.String,
  LicenseArn: S.String,
  GranteePrincipalArn: S.String,
  HomeRegion: S.String,
  GrantStatus: S.String,
  StatusReason: S.optional(S.String),
  Version: S.String,
  GrantedOperations: AllowedOperationList,
  Options: S.optional(Options),
}) {}
export const GrantList = S.Array(Grant);
export class InventoryFilter extends S.Class<InventoryFilter>(
  "InventoryFilter",
)({ Name: S.String, Condition: S.String, Value: S.optional(S.String) }) {}
export const InventoryFilterList = S.Array(InventoryFilter);
export class LicenseSpecification extends S.Class<LicenseSpecification>(
  "LicenseSpecification",
)({
  LicenseConfigurationArn: S.String,
  AmiAssociationScope: S.optional(S.String),
}) {}
export const LicenseSpecifications = S.Array(LicenseSpecification);
export class AcceptGrantResponse extends S.Class<AcceptGrantResponse>(
  "AcceptGrantResponse",
)(
  {
    GrantArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class CheckoutBorrowLicenseRequest extends S.Class<CheckoutBorrowLicenseRequest>(
  "CheckoutBorrowLicenseRequest",
)(
  {
    LicenseArn: S.String,
    Entitlements: EntitlementDataList,
    DigitalSignatureMethod: S.String,
    NodeId: S.optional(S.String),
    CheckoutMetadata: S.optional(MetadataList),
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckoutLicenseResponse extends S.Class<CheckoutLicenseResponse>(
  "CheckoutLicenseResponse",
)(
  {
    CheckoutType: S.optional(S.String),
    LicenseConsumptionToken: S.optional(S.String),
    EntitlementsAllowed: S.optional(EntitlementDataList),
    SignedToken: S.optional(S.String),
    NodeId: S.optional(S.String),
    IssuedAt: S.optional(S.String),
    Expiration: S.optional(S.String),
    LicenseArn: S.optional(S.String),
  },
  ns,
) {}
export class CreateGrantRequest extends S.Class<CreateGrantRequest>(
  "CreateGrantRequest",
)(
  {
    ClientToken: S.String,
    GrantName: S.String,
    LicenseArn: S.String,
    Principals: PrincipalArnList,
    HomeRegion: S.String,
    AllowedOperations: AllowedOperationList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGrantVersionRequest extends S.Class<CreateGrantVersionRequest>(
  "CreateGrantVersionRequest",
)(
  {
    ClientToken: S.String,
    GrantArn: S.String,
    GrantName: S.optional(S.String),
    AllowedOperations: S.optional(AllowedOperationList),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    SourceVersion: S.optional(S.String),
    Options: S.optional(Options),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseAssetGroupRequest extends S.Class<CreateLicenseAssetGroupRequest>(
  "CreateLicenseAssetGroupRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    LicenseAssetGroupConfigurations: LicenseAssetGroupConfigurationList,
    AssociatedLicenseAssetRulesetARNs: LicenseAssetRulesetArnList,
    Properties: S.optional(LicenseAssetGroupPropertyList),
    Tags: S.optional(TagList),
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseManagerReportGeneratorRequest extends S.Class<CreateLicenseManagerReportGeneratorRequest>(
  "CreateLicenseManagerReportGeneratorRequest",
)(
  {
    ReportGeneratorName: S.String,
    Type: ReportTypeList,
    ReportContext: ReportContext,
    ReportFrequency: ReportFrequency,
    ClientToken: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseVersionResponse extends S.Class<CreateLicenseVersionResponse>(
  "CreateLicenseVersionResponse",
)(
  {
    LicenseArn: S.optional(S.String),
    Version: S.optional(S.String),
    Status: S.optional(S.String),
  },
  ns,
) {}
export class CreateTokenResponse extends S.Class<CreateTokenResponse>(
  "CreateTokenResponse",
)(
  {
    TokenId: S.optional(S.String),
    TokenType: S.optional(S.String),
    Token: S.optional(S.String),
  },
  ns,
) {}
export class DeleteGrantResponse extends S.Class<DeleteGrantResponse>(
  "DeleteGrantResponse",
)(
  {
    GrantArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class DeleteLicenseResponse extends S.Class<DeleteLicenseResponse>(
  "DeleteLicenseResponse",
)({ Status: S.optional(S.String), DeletionDate: S.optional(S.String) }, ns) {}
export class DeleteLicenseAssetGroupResponse extends S.Class<DeleteLicenseAssetGroupResponse>(
  "DeleteLicenseAssetGroupResponse",
)({ Status: S.String }, ns) {}
export class ExtendLicenseConsumptionResponse extends S.Class<ExtendLicenseConsumptionResponse>(
  "ExtendLicenseConsumptionResponse",
)(
  {
    LicenseConsumptionToken: S.optional(S.String),
    Expiration: S.optional(S.String),
  },
  ns,
) {}
export class GetAccessTokenResponse extends S.Class<GetAccessTokenResponse>(
  "GetAccessTokenResponse",
)({ AccessToken: S.optional(S.String) }, ns) {}
export class ProductCodeListItem extends S.Class<ProductCodeListItem>(
  "ProductCodeListItem",
)({ ProductCodeId: S.String, ProductCodeType: S.String }) {}
export const ProductCodeList = S.Array(ProductCodeListItem);
export class LicenseConversionContext extends S.Class<LicenseConversionContext>(
  "LicenseConversionContext",
)({
  UsageOperation: S.optional(S.String),
  ProductCodes: S.optional(ProductCodeList),
}) {}
export class GetLicenseConversionTaskResponse extends S.Class<GetLicenseConversionTaskResponse>(
  "GetLicenseConversionTaskResponse",
)(
  {
    LicenseConversionTaskId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    SourceLicenseContext: S.optional(LicenseConversionContext),
    DestinationLicenseContext: S.optional(LicenseConversionContext),
    StatusMessage: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LicenseConversionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class ListDistributedGrantsRequest extends S.Class<ListDistributedGrantsRequest>(
  "ListDistributedGrantsRequest",
)(
  {
    GrantArns: S.optional(ArnList),
    Filters: S.optional(FilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLicenseAssetGroupsResponse extends S.Class<ListLicenseAssetGroupsResponse>(
  "ListLicenseAssetGroupsResponse",
)(
  {
    LicenseAssetGroups: S.optional(LicenseAssetGroupList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicenseAssetRulesetsResponse extends S.Class<ListLicenseAssetRulesetsResponse>(
  "ListLicenseAssetRulesetsResponse",
)(
  {
    LicenseAssetRulesets: S.optional(LicenseAssetRulesetList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ConsumedLicenseSummary extends S.Class<ConsumedLicenseSummary>(
  "ConsumedLicenseSummary",
)({
  ResourceType: S.optional(S.String),
  ConsumedLicenses: S.optional(S.Number),
}) {}
export const ConsumedLicenseSummaryList = S.Array(ConsumedLicenseSummary);
export class ManagedResourceSummary extends S.Class<ManagedResourceSummary>(
  "ManagedResourceSummary",
)({
  ResourceType: S.optional(S.String),
  AssociationCount: S.optional(S.Number),
}) {}
export const ManagedResourceSummaryList = S.Array(ManagedResourceSummary);
export class AutomatedDiscoveryInformation extends S.Class<AutomatedDiscoveryInformation>(
  "AutomatedDiscoveryInformation",
)({
  LastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class LicenseConfiguration extends S.Class<LicenseConfiguration>(
  "LicenseConfiguration",
)({
  LicenseConfigurationId: S.optional(S.String),
  LicenseConfigurationArn: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  LicenseCountingType: S.optional(S.String),
  LicenseRules: S.optional(StringList),
  LicenseCount: S.optional(S.Number),
  LicenseCountHardLimit: S.optional(S.Boolean),
  DisassociateWhenNotFound: S.optional(S.Boolean),
  ConsumedLicenses: S.optional(S.Number),
  Status: S.optional(S.String),
  OwnerAccountId: S.optional(S.String),
  ConsumedLicenseSummaryList: S.optional(ConsumedLicenseSummaryList),
  ManagedResourceSummaryList: S.optional(ManagedResourceSummaryList),
  ProductInformationList: S.optional(ProductInformationList),
  AutomatedDiscoveryInformation: S.optional(AutomatedDiscoveryInformation),
  LicenseExpiry: S.optional(S.Number),
}) {}
export const LicenseConfigurations = S.Array(LicenseConfiguration);
export class ListLicenseConfigurationsForOrganizationResponse extends S.Class<ListLicenseConfigurationsForOrganizationResponse>(
  "ListLicenseConfigurationsForOrganizationResponse",
)(
  {
    LicenseConfigurations: S.optional(LicenseConfigurations),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicenseManagerReportGeneratorsResponse extends S.Class<ListLicenseManagerReportGeneratorsResponse>(
  "ListLicenseManagerReportGeneratorsResponse",
)(
  {
    ReportGenerators: S.optional(ReportGeneratorList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicensesResponse extends S.Class<ListLicensesResponse>(
  "ListLicensesResponse",
)({ Licenses: S.optional(LicenseList), NextToken: S.optional(S.String) }, ns) {}
export class ListLicenseSpecificationsForResourceResponse extends S.Class<ListLicenseSpecificationsForResourceResponse>(
  "ListLicenseSpecificationsForResourceResponse",
)(
  {
    LicenseSpecifications: S.optional(LicenseSpecifications),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicenseVersionsResponse extends S.Class<ListLicenseVersionsResponse>(
  "ListLicenseVersionsResponse",
)({ Licenses: S.optional(LicenseList), NextToken: S.optional(S.String) }, ns) {}
export class ListReceivedGrantsResponse extends S.Class<ListReceivedGrantsResponse>(
  "ListReceivedGrantsResponse",
)({ Grants: S.optional(GrantList), NextToken: S.optional(S.String) }, ns) {}
export class ListReceivedGrantsForOrganizationResponse extends S.Class<ListReceivedGrantsForOrganizationResponse>(
  "ListReceivedGrantsForOrganizationResponse",
)({ Grants: S.optional(GrantList), NextToken: S.optional(S.String) }, ns) {}
export class ReceivedMetadata extends S.Class<ReceivedMetadata>(
  "ReceivedMetadata",
)({
  ReceivedStatus: S.optional(S.String),
  ReceivedStatusReason: S.optional(S.String),
  AllowedOperations: S.optional(AllowedOperationList),
}) {}
export class GrantedLicense extends S.Class<GrantedLicense>("GrantedLicense")({
  LicenseArn: S.optional(S.String),
  LicenseName: S.optional(S.String),
  ProductName: S.optional(S.String),
  ProductSKU: S.optional(S.String),
  Issuer: S.optional(IssuerDetails),
  HomeRegion: S.optional(S.String),
  Status: S.optional(S.String),
  Validity: S.optional(DatetimeRange),
  Beneficiary: S.optional(S.String),
  Entitlements: S.optional(EntitlementList),
  ConsumptionConfiguration: S.optional(ConsumptionConfiguration),
  LicenseMetadata: S.optional(MetadataList),
  CreateTime: S.optional(S.String),
  Version: S.optional(S.String),
  ReceivedMetadata: S.optional(ReceivedMetadata),
}) {}
export const GrantedLicenseList = S.Array(GrantedLicense);
export class ListReceivedLicensesForOrganizationResponse extends S.Class<ListReceivedLicensesForOrganizationResponse>(
  "ListReceivedLicensesForOrganizationResponse",
)(
  { Licenses: S.optional(GrantedLicenseList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListResourceInventoryRequest extends S.Class<ListResourceInventoryRequest>(
  "ListResourceInventoryRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(InventoryFilterList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class RejectGrantResponse extends S.Class<RejectGrantResponse>(
  "RejectGrantResponse",
)(
  {
    GrantArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class UpdateLicenseAssetGroupResponse extends S.Class<UpdateLicenseAssetGroupResponse>(
  "UpdateLicenseAssetGroupResponse",
)({ LicenseAssetGroupArn: S.String, Status: S.String }, ns) {}
export class UpdateLicenseAssetRulesetResponse extends S.Class<UpdateLicenseAssetRulesetResponse>(
  "UpdateLicenseAssetRulesetResponse",
)({ LicenseAssetRulesetArn: S.String }, ns) {}
export class UpdateLicenseSpecificationsForResourceRequest extends S.Class<UpdateLicenseSpecificationsForResourceRequest>(
  "UpdateLicenseSpecificationsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    AddLicenseSpecifications: S.optional(LicenseSpecifications),
    RemoveLicenseSpecifications: S.optional(LicenseSpecifications),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLicenseSpecificationsForResourceResponse extends S.Class<UpdateLicenseSpecificationsForResourceResponse>(
  "UpdateLicenseSpecificationsForResourceResponse",
)({}, ns) {}
export class CrossAccountDiscoveryServiceStatus extends S.Class<CrossAccountDiscoveryServiceStatus>(
  "CrossAccountDiscoveryServiceStatus",
)({ Message: S.optional(S.String) }) {}
export class Asset extends S.Class<Asset>("Asset")({
  AssetArn: S.optional(S.String),
  LatestAssetDiscoveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const AssetList = S.Array(Asset);
export class LicenseConfigurationAssociation extends S.Class<LicenseConfigurationAssociation>(
  "LicenseConfigurationAssociation",
)({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceOwnerId: S.optional(S.String),
  AssociationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AmiAssociationScope: S.optional(S.String),
}) {}
export const LicenseConfigurationAssociations = S.Array(
  LicenseConfigurationAssociation,
);
export class LicenseOperationFailure extends S.Class<LicenseOperationFailure>(
  "LicenseOperationFailure",
)({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  FailureTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OperationName: S.optional(S.String),
  ResourceOwnerId: S.optional(S.String),
  OperationRequestedBy: S.optional(S.String),
  MetadataList: S.optional(MetadataList),
}) {}
export const LicenseOperationFailureList = S.Array(LicenseOperationFailure);
export class LicenseConversionTask extends S.Class<LicenseConversionTask>(
  "LicenseConversionTask",
)({
  LicenseConversionTaskId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  SourceLicenseContext: S.optional(LicenseConversionContext),
  DestinationLicenseContext: S.optional(LicenseConversionContext),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LicenseConversionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LicenseConversionTasks = S.Array(LicenseConversionTask);
export class TokenData extends S.Class<TokenData>("TokenData")({
  TokenId: S.optional(S.String),
  TokenType: S.optional(S.String),
  LicenseArn: S.optional(S.String),
  ExpirationTime: S.optional(S.String),
  TokenProperties: S.optional(MaxSize3StringList),
  RoleArns: S.optional(ArnList),
  Status: S.optional(S.String),
}) {}
export const TokenList = S.Array(TokenData);
export class LicenseConfigurationUsage extends S.Class<LicenseConfigurationUsage>(
  "LicenseConfigurationUsage",
)({
  ResourceArn: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceStatus: S.optional(S.String),
  ResourceOwnerId: S.optional(S.String),
  AssociationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ConsumedLicenses: S.optional(S.Number),
}) {}
export const LicenseConfigurationUsageList = S.Array(LicenseConfigurationUsage);
export class CheckoutBorrowLicenseResponse extends S.Class<CheckoutBorrowLicenseResponse>(
  "CheckoutBorrowLicenseResponse",
)(
  {
    LicenseArn: S.optional(S.String),
    LicenseConsumptionToken: S.optional(S.String),
    EntitlementsAllowed: S.optional(EntitlementDataList),
    NodeId: S.optional(S.String),
    SignedToken: S.optional(S.String),
    IssuedAt: S.optional(S.String),
    Expiration: S.optional(S.String),
    CheckoutMetadata: S.optional(MetadataList),
  },
  ns,
) {}
export class CreateGrantResponse extends S.Class<CreateGrantResponse>(
  "CreateGrantResponse",
)(
  {
    GrantArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class CreateGrantVersionResponse extends S.Class<CreateGrantVersionResponse>(
  "CreateGrantVersionResponse",
)(
  {
    GrantArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class CreateLicenseRequest extends S.Class<CreateLicenseRequest>(
  "CreateLicenseRequest",
)(
  {
    LicenseName: S.String,
    ProductName: S.String,
    ProductSKU: S.String,
    Issuer: Issuer,
    HomeRegion: S.String,
    Validity: DatetimeRange,
    Entitlements: EntitlementList,
    Beneficiary: S.String,
    ConsumptionConfiguration: ConsumptionConfiguration,
    LicenseMetadata: S.optional(MetadataList),
    ClientToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseAssetGroupResponse extends S.Class<CreateLicenseAssetGroupResponse>(
  "CreateLicenseAssetGroupResponse",
)({ LicenseAssetGroupArn: S.String, Status: S.String }, ns) {}
export class CreateLicenseConfigurationRequest extends S.Class<CreateLicenseConfigurationRequest>(
  "CreateLicenseConfigurationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    LicenseCountingType: S.String,
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    LicenseRules: S.optional(StringList),
    Tags: S.optional(TagList),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    ProductInformationList: S.optional(ProductInformationList),
    LicenseExpiry: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseConversionTaskForResourceRequest extends S.Class<CreateLicenseConversionTaskForResourceRequest>(
  "CreateLicenseConversionTaskForResourceRequest",
)(
  {
    ResourceArn: S.String,
    SourceLicenseContext: LicenseConversionContext,
    DestinationLicenseContext: LicenseConversionContext,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLicenseManagerReportGeneratorResponse extends S.Class<CreateLicenseManagerReportGeneratorResponse>(
  "CreateLicenseManagerReportGeneratorResponse",
)({ LicenseManagerReportGeneratorArn: S.optional(S.String) }, ns) {}
export class GetGrantResponse extends S.Class<GetGrantResponse>(
  "GetGrantResponse",
)({ Grant: S.optional(Grant) }, ns) {}
export class GetLicenseAssetGroupResponse extends S.Class<GetLicenseAssetGroupResponse>(
  "GetLicenseAssetGroupResponse",
)({ LicenseAssetGroup: LicenseAssetGroup }, ns) {}
export class GetLicenseAssetRulesetResponse extends S.Class<GetLicenseAssetRulesetResponse>(
  "GetLicenseAssetRulesetResponse",
)({ LicenseAssetRuleset: LicenseAssetRuleset }, ns) {}
export class GetLicenseConfigurationResponse extends S.Class<GetLicenseConfigurationResponse>(
  "GetLicenseConfigurationResponse",
)(
  {
    LicenseConfigurationId: S.optional(S.String),
    LicenseConfigurationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    LicenseCountingType: S.optional(S.String),
    LicenseRules: S.optional(StringList),
    LicenseCount: S.optional(S.Number),
    LicenseCountHardLimit: S.optional(S.Boolean),
    ConsumedLicenses: S.optional(S.Number),
    Status: S.optional(S.String),
    OwnerAccountId: S.optional(S.String),
    ConsumedLicenseSummaryList: S.optional(ConsumedLicenseSummaryList),
    ManagedResourceSummaryList: S.optional(ManagedResourceSummaryList),
    Tags: S.optional(TagList),
    ProductInformationList: S.optional(ProductInformationList),
    AutomatedDiscoveryInformation: S.optional(AutomatedDiscoveryInformation),
    DisassociateWhenNotFound: S.optional(S.Boolean),
    LicenseExpiry: S.optional(S.Number),
  },
  ns,
) {}
export class ListAssetsForLicenseAssetGroupResponse extends S.Class<ListAssetsForLicenseAssetGroupResponse>(
  "ListAssetsForLicenseAssetGroupResponse",
)({ Assets: S.optional(AssetList), NextToken: S.optional(S.String) }, ns) {}
export class ListAssociationsForLicenseConfigurationResponse extends S.Class<ListAssociationsForLicenseConfigurationResponse>(
  "ListAssociationsForLicenseConfigurationResponse",
)(
  {
    LicenseConfigurationAssociations: S.optional(
      LicenseConfigurationAssociations,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDistributedGrantsResponse extends S.Class<ListDistributedGrantsResponse>(
  "ListDistributedGrantsResponse",
)({ Grants: S.optional(GrantList), NextToken: S.optional(S.String) }, ns) {}
export class ListFailuresForLicenseConfigurationOperationsResponse extends S.Class<ListFailuresForLicenseConfigurationOperationsResponse>(
  "ListFailuresForLicenseConfigurationOperationsResponse",
)(
  {
    LicenseOperationFailureList: S.optional(LicenseOperationFailureList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicenseConfigurationsResponse extends S.Class<ListLicenseConfigurationsResponse>(
  "ListLicenseConfigurationsResponse",
)(
  {
    LicenseConfigurations: S.optional(LicenseConfigurations),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLicenseConversionTasksResponse extends S.Class<ListLicenseConversionTasksResponse>(
  "ListLicenseConversionTasksResponse",
)(
  {
    LicenseConversionTasks: S.optional(LicenseConversionTasks),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTokensResponse extends S.Class<ListTokensResponse>(
  "ListTokensResponse",
)({ Tokens: S.optional(TokenList), NextToken: S.optional(S.String) }, ns) {}
export class ListUsageForLicenseConfigurationResponse extends S.Class<ListUsageForLicenseConfigurationResponse>(
  "ListUsageForLicenseConfigurationResponse",
)(
  {
    LicenseConfigurationUsageList: S.optional(LicenseConfigurationUsageList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class EntitlementUsage extends S.Class<EntitlementUsage>(
  "EntitlementUsage",
)({
  Name: S.String,
  ConsumedValue: S.String,
  MaxCount: S.optional(S.String),
  Unit: S.String,
}) {}
export const EntitlementUsageList = S.Array(EntitlementUsage);
export class RegionStatus extends S.Class<RegionStatus>("RegionStatus")({
  Status: S.optional(S.String),
}) {}
export class LicenseUsage extends S.Class<LicenseUsage>("LicenseUsage")({
  EntitlementUsages: S.optional(EntitlementUsageList),
}) {}
export class ResourceInventory extends S.Class<ResourceInventory>(
  "ResourceInventory",
)({
  ResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Platform: S.optional(S.String),
  PlatformVersion: S.optional(S.String),
  ResourceOwningAccountId: S.optional(S.String),
  MarketplaceProductCodes: S.optional(StringList),
  UsageOperation: S.optional(S.String),
  AmiId: S.optional(S.String),
  HostId: S.optional(S.String),
  Region: S.optional(S.String),
  InstanceType: S.optional(S.String),
}) {}
export const ResourceInventoryList = S.Array(ResourceInventory);
export const RegionStatusMap = S.Record({ key: S.String, value: RegionStatus });
export class CreateLicenseResponse extends S.Class<CreateLicenseResponse>(
  "CreateLicenseResponse",
)(
  {
    LicenseArn: S.optional(S.String),
    Status: S.optional(S.String),
    Version: S.optional(S.String),
  },
  ns,
) {}
export class CreateLicenseConfigurationResponse extends S.Class<CreateLicenseConfigurationResponse>(
  "CreateLicenseConfigurationResponse",
)({ LicenseConfigurationArn: S.optional(S.String) }, ns) {}
export class CreateLicenseConversionTaskForResourceResponse extends S.Class<CreateLicenseConversionTaskForResourceResponse>(
  "CreateLicenseConversionTaskForResourceResponse",
)({ LicenseConversionTaskId: S.optional(S.String) }, ns) {}
export class GetLicenseResponse extends S.Class<GetLicenseResponse>(
  "GetLicenseResponse",
)({ License: S.optional(License) }, ns) {}
export class GetLicenseManagerReportGeneratorResponse extends S.Class<GetLicenseManagerReportGeneratorResponse>(
  "GetLicenseManagerReportGeneratorResponse",
)({ ReportGenerator: S.optional(ReportGenerator) }, ns) {}
export class GetLicenseUsageResponse extends S.Class<GetLicenseUsageResponse>(
  "GetLicenseUsageResponse",
)({ LicenseUsage: S.optional(LicenseUsage) }, ns) {}
export class ListReceivedLicensesResponse extends S.Class<ListReceivedLicensesResponse>(
  "ListReceivedLicensesResponse",
)(
  { Licenses: S.optional(GrantedLicenseList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListResourceInventoryResponse extends S.Class<ListResourceInventoryResponse>(
  "ListResourceInventoryResponse",
)(
  {
    ResourceInventoryList: S.optional(ResourceInventoryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class CrossRegionDiscoveryStatus extends S.Class<CrossRegionDiscoveryStatus>(
  "CrossRegionDiscoveryStatus",
)({ Message: S.optional(RegionStatusMap) }) {}
export class ServiceStatus extends S.Class<ServiceStatus>("ServiceStatus")({
  CrossAccountDiscovery: S.optional(CrossAccountDiscoveryServiceStatus),
  CrossRegionDiscovery: S.optional(CrossRegionDiscoveryStatus),
}) {}
export class CreateLicenseAssetRulesetRequest extends S.Class<CreateLicenseAssetRulesetRequest>(
  "CreateLicenseAssetRulesetRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Rules: LicenseAssetRuleList,
    Tags: S.optional(TagList),
    ClientToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceSettingsResponse extends S.Class<GetServiceSettingsResponse>(
  "GetServiceSettingsResponse",
)(
  {
    S3BucketArn: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    OrganizationConfiguration: S.optional(OrganizationConfiguration),
    EnableCrossAccountsDiscovery: S.optional(S.Boolean),
    LicenseManagerResourceShareArn: S.optional(S.String),
    CrossRegionDiscoveryHomeRegion: S.optional(S.String),
    CrossRegionDiscoverySourceRegions: S.optional(StringList),
    ServiceStatus: S.optional(ServiceStatus),
  },
  ns,
) {}
export class CreateLicenseAssetRulesetResponse extends S.Class<CreateLicenseAssetRulesetResponse>(
  "CreateLicenseAssetRulesetResponse",
)({ LicenseAssetRulesetArn: S.String }, ns) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
  T.AwsQueryError({ code: "ServiceAccessDenied", httpResponseCode: 401 }),
) {}
export class AuthorizationException extends S.TaggedError<AuthorizationException>()(
  "AuthorizationException",
  {},
  T.AwsQueryError({ code: "AuthorizationFailure", httpResponseCode: 403 }),
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
  T.AwsQueryError({
    code: "InvalidParameterValueProvided",
    httpResponseCode: 400,
  }),
) {}
export class RateLimitExceededException extends S.TaggedError<RateLimitExceededException>()(
  "RateLimitExceededException",
  {},
  T.AwsQueryError({ code: "RateLimitExceeded", httpResponseCode: 429 }),
) {}
export class ServerInternalException extends S.TaggedError<ServerInternalException>()(
  "ServerInternalException",
  {},
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {},
  T.AwsQueryError({ code: "ResourceLimitExceeded", httpResponseCode: 400 }),
) {}
export class RedirectException extends S.TaggedError<RedirectException>()(
  "RedirectException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "InvalidResource.NotFound", httpResponseCode: 400 }),
) {}
export class NoEntitlementsAllowedException extends S.TaggedError<NoEntitlementsAllowedException>()(
  "NoEntitlementsAllowedException",
  { Message: S.optional(S.String) },
) {}
export class FilterLimitExceededException extends S.TaggedError<FilterLimitExceededException>()(
  "FilterLimitExceededException",
  {},
  T.AwsQueryError({ code: "FilterLimitExceeded", httpResponseCode: 400 }),
) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidResourceState", httpResponseCode: 400 }),
) {}
export class EntitlementNotAllowedException extends S.TaggedError<EntitlementNotAllowedException>()(
  "EntitlementNotAllowedException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedDigitalSignatureMethodException extends S.TaggedError<UnsupportedDigitalSignatureMethodException>()(
  "UnsupportedDigitalSignatureMethodException",
  {},
) {}
export class LicenseUsageException extends S.TaggedError<LicenseUsageException>()(
  "LicenseUsageException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LicenseUsageFailure", httpResponseCode: 412 }),
) {}
export class FailedDependencyException extends S.TaggedError<FailedDependencyException>()(
  "FailedDependencyException",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
  T.AwsQueryError({ code: "FailedDependency", httpResponseCode: 424 }),
) {}

//# Operations
/**
 * Updates License Manager settings for the current Region.
 */
export const updateServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceSettingsRequest,
    output: UpdateServiceSettingsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      ConflictException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Accepts the specified grant.
 */
export const acceptGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptGrantRequest,
  output: AcceptGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of the specified license.
 */
export const createLicenseVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseVersionRequest,
    output: CreateLicenseVersionResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      ConflictException,
      RateLimitExceededException,
      RedirectException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a long-lived token.
 *
 * A refresh token is a JWT token used to get an access token. With an access token,
 * you can call AssumeRoleWithWebIdentity to get role credentials that you can use to
 * call License Manager to manage the specified license.
 */
export const createToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTokenRequest,
  output: CreateTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    RedirectException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified grant.
 */
export const deleteGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGrantRequest,
  output: DeleteGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified license.
 */
export const deleteLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLicenseRequest,
  output: DeleteLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    RedirectException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Deletes a license asset group.
 */
export const deleteLicenseAssetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLicenseAssetGroupRequest,
    output: DeleteLicenseAssetGroupResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a license asset ruleset.
 */
export const deleteLicenseAssetRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLicenseAssetRulesetRequest,
    output: DeleteLicenseAssetRulesetResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the specified license configuration.
 *
 * You cannot delete a license configuration that is in use.
 */
export const deleteLicenseConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLicenseConfigurationRequest,
    output: DeleteLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Deletes the specified report generator.
 *
 * This action deletes the report generator, which stops it from generating future reports.
 * The action cannot be reversed. It has no effect on the previous reports from this generator.
 */
export const deleteLicenseManagerReportGenerator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteLicenseManagerReportGeneratorRequest,
    output: DeleteLicenseManagerReportGeneratorResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Deletes the specified token. Must be called in the license home Region.
 */
export const deleteToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTokenRequest,
  output: DeleteTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Extends the expiration date for license consumption.
 */
export const extendLicenseConsumption = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExtendLicenseConsumptionRequest,
    output: ExtendLicenseConsumptionResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a temporary access token to use with AssumeRoleWithWebIdentity. Access tokens
 * are valid for one hour.
 */
export const getAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessTokenRequest,
  output: GetAccessTokenResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified license type conversion task.
 */
export const getLicenseConversionTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLicenseConversionTaskRequest,
    output: GetLicenseConversionTaskResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Lists license asset groups.
 */
export const listLicenseAssetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLicenseAssetGroupsRequest,
    output: ListLicenseAssetGroupsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Lists license asset rulesets.
 */
export const listLicenseAssetRulesets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLicenseAssetRulesetsRequest,
    output: ListLicenseAssetRulesetsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the report generators for your account.
 */
export const listLicenseManagerReportGenerators =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListLicenseManagerReportGeneratorsRequest,
    output: ListLicenseManagerReportGeneratorsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Lists the licenses for your account.
 */
export const listLicenses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicensesRequest,
  output: ListLicensesResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Describes the license configurations for the specified resource.
 */
export const listLicenseSpecificationsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListLicenseSpecificationsForResourceRequest,
    output: ListLicenseSpecificationsForResourceResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Lists all versions of the specified license.
 */
export const listLicenseVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLicenseVersionsRequest,
  output: ListLicenseVersionsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists grants that are received. Received grants are grants created while specifying the
 * recipient as this Amazon Web Services account, your organization, or an organizational unit
 * (OU) to which this member account belongs.
 */
export const listReceivedGrants = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceivedGrantsRequest,
  output: ListReceivedGrantsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists the grants received for all accounts in the organization.
 */
export const listReceivedGrantsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListReceivedGrantsForOrganizationRequest,
    output: ListReceivedGrantsForOrganizationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Lists the licenses received for all accounts in the organization.
 */
export const listReceivedLicensesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListReceivedLicensesForOrganizationRequest,
    output: ListReceivedLicensesForOrganizationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Lists the tags for the specified resource. For more information about tagging support in
 * License Manager, see the TagResource operation.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Rejects the specified grant.
 */
export const rejectGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectGrantRequest,
  output: RejectGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Adds the specified tags to the specified resource. The following resources support
 * tagging in License Manager:
 *
 * - Licenses
 *
 * - Grants
 *
 * - License configurations
 *
 * - Report generators
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Updates a license asset group.
 */
export const updateLicenseAssetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLicenseAssetGroupRequest,
    output: UpdateLicenseAssetGroupResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a license asset ruleset.
 */
export const updateLicenseAssetRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLicenseAssetRulesetRequest,
    output: UpdateLicenseAssetRulesetResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Modifies the attributes of an existing license configuration.
 */
export const updateLicenseConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLicenseConfigurationRequest,
    output: UpdateLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      ConflictException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Updates a report generator.
 *
 * After you make changes to a report generator, it starts generating new reports within 60 minutes of being updated.
 */
export const updateLicenseManagerReportGenerator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLicenseManagerReportGeneratorRequest,
    output: UpdateLicenseManagerReportGeneratorResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Checks in the specified license. Check in a license when it is no longer in use.
 */
export const checkInLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckInLicenseRequest,
  output: CheckInLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    ConflictException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceNotFoundException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a grant for the specified license. A grant shares the use of license
 * entitlements with a specific Amazon Web Services account, an organization, or an
 * organizational unit (OU). For more information, see Granted licenses in License Manager in the *License Manager User Guide*.
 */
export const createGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGrantRequest,
  output: CreateGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of the specified grant. For more information, see
 * Granted licenses in License Manager in the *License Manager User Guide*.
 */
export const createGrantVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGrantVersionRequest,
  output: CreateGrantVersionResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a license asset group.
 */
export const createLicenseAssetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseAssetGroupRequest,
    output: CreateLicenseAssetGroupResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a report generator.
 */
export const createLicenseManagerReportGenerator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLicenseManagerReportGeneratorRequest,
    output: CreateLicenseManagerReportGeneratorResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Gets detailed information about the specified grant.
 */
export const getGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGrantRequest,
  output: GetGrantResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ResourceLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets a license asset group.
 */
export const getLicenseAssetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLicenseAssetGroupRequest,
    output: GetLicenseAssetGroupResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a license asset ruleset.
 */
export const getLicenseAssetRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLicenseAssetRulesetRequest,
    output: GetLicenseAssetRulesetResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Gets detailed information about the specified license configuration.
 */
export const getLicenseConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLicenseConfigurationRequest,
    output: GetLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Lists assets for a license asset group.
 */
export const listAssetsForLicenseAssetGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssetsForLicenseAssetGroupRequest,
    output: ListAssetsForLicenseAssetGroupResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Lists the resource associations for the specified license configuration.
 *
 * Resource associations need not consume licenses from a license configuration.
 * For example, an AMI or a stopped instance might not consume a license (depending on
 * the license rules).
 */
export const listAssociationsForLicenseConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAssociationsForLicenseConfigurationRequest,
    output: ListAssociationsForLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      FilterLimitExceededException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Lists the grants distributed for the specified license.
 */
export const listDistributedGrants = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDistributedGrantsRequest,
    output: ListDistributedGrantsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the license configuration operations that failed.
 */
export const listFailuresForLicenseConfigurationOperations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListFailuresForLicenseConfigurationOperationsRequest,
    output: ListFailuresForLicenseConfigurationOperationsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Lists the license configurations for your account.
 */
export const listLicenseConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLicenseConfigurationsRequest,
    output: ListLicenseConfigurationsResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      FilterLimitExceededException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Lists license configurations for an organization.
 */
export const listLicenseConfigurationsForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListLicenseConfigurationsForOrganizationRequest,
    output: ListLicenseConfigurationsForOrganizationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      FilterLimitExceededException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Lists the license type conversion tasks for your account.
 */
export const listLicenseConversionTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLicenseConversionTasksRequest,
    output: ListLicenseConversionTasksResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Lists your tokens.
 */
export const listTokens = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTokensRequest,
  output: ListTokensResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists all license usage records for a license configuration, displaying license
 * consumption details by resource at a selected point in time. Use this action to audit the
 * current license consumption for any license inventory and configuration.
 */
export const listUsageForLicenseConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListUsageForLicenseConfigurationRequest,
    output: ListUsageForLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      FilterLimitExceededException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Checks out the specified license for offline use.
 */
export const checkoutBorrowLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckoutBorrowLicenseRequest,
    output: CheckoutBorrowLicenseResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      EntitlementNotAllowedException,
      InvalidParameterValueException,
      NoEntitlementsAllowedException,
      RateLimitExceededException,
      RedirectException,
      ResourceNotFoundException,
      ServerInternalException,
      UnsupportedDigitalSignatureMethodException,
      ValidationException,
    ],
  }),
);
/**
 * Checks out the specified license.
 *
 * If the account that created the license is the same that is performing the check out, you must
 * specify the account as the beneficiary.
 */
export const checkoutLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckoutLicenseRequest,
  output: CheckoutLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    NoEntitlementsAllowedException,
    RateLimitExceededException,
    RedirectException,
    ResourceNotFoundException,
    ServerInternalException,
    UnsupportedDigitalSignatureMethodException,
    ValidationException,
  ],
}));
/**
 * Creates a license.
 */
export const createLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLicenseRequest,
  output: CreateLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    RedirectException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Creates a license configuration.
 *
 * A license configuration is an abstraction of a customer license agreement that can be
 * consumed and enforced by License Manager. Components include specifications for the license
 * type (licensing by instance, socket, CPU, or vCPU), allowed tenancy (shared tenancy,
 * Dedicated Instance, Dedicated Host, or all of these), license affinity to host (how long a
 * license must be associated with a host), and the number of licenses purchased and used.
 */
export const createLicenseConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseConfigurationRequest,
    output: CreateLicenseConfigurationResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Creates a new license conversion task.
 */
export const createLicenseConversionTaskForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLicenseConversionTaskForResourceRequest,
    output: CreateLicenseConversionTaskForResourceResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Gets detailed information about the specified license.
 */
export const getLicense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseRequest,
  output: GetLicenseResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Gets information about the specified report generator.
 */
export const getLicenseManagerReportGenerator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetLicenseManagerReportGeneratorRequest,
    output: GetLicenseManagerReportGeneratorResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ResourceNotFoundException,
      ServerInternalException,
      ValidationException,
    ],
  }));
/**
 * Gets detailed information about the usage of the specified license.
 */
export const getLicenseUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseUsageRequest,
  output: GetLicenseUsageResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    InvalidParameterValueException,
    RateLimitExceededException,
    ServerInternalException,
    ValidationException,
  ],
}));
/**
 * Lists received licenses.
 */
export const listReceivedLicenses = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListReceivedLicensesRequest,
    output: ListReceivedLicensesResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ResourceLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
/**
 * Adds or removes the specified license configurations for the specified Amazon Web Services resource.
 *
 * You can update the license specifications of AMIs, instances, and hosts.
 * You cannot update the license specifications for launch templates and CloudFormation templates,
 * as they send license configurations to the operation that creates the resource.
 */
export const updateLicenseSpecificationsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateLicenseSpecificationsForResourceRequest,
    output: UpdateLicenseSpecificationsForResourceResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      ConflictException,
      InvalidParameterValueException,
      InvalidResourceStateException,
      LicenseUsageException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }));
/**
 * Gets the License Manager settings for the current Region.
 */
export const getServiceSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceSettingsRequest,
  output: GetServiceSettingsResponse,
  errors: [
    AccessDeniedException,
    AuthorizationException,
    RateLimitExceededException,
    ServerInternalException,
  ],
}));
/**
 * Lists resources managed using Systems Manager inventory.
 */
export const listResourceInventory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceInventoryRequest,
    output: ListResourceInventoryResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      FailedDependencyException,
      FilterLimitExceededException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
    ],
  }),
);
/**
 * Creates a license asset ruleset.
 */
export const createLicenseAssetRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLicenseAssetRulesetRequest,
    output: CreateLicenseAssetRulesetResponse,
    errors: [
      AccessDeniedException,
      AuthorizationException,
      InvalidParameterValueException,
      RateLimitExceededException,
      ServerInternalException,
      ValidationException,
    ],
  }),
);
