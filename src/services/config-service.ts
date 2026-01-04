import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://config.amazonaws.com/doc/2014-11-12/");
const svc = T.AwsApiService({
  sdkId: "Config Service",
  serviceShapeName: "StarlingDoveService",
});
const auth = T.AwsAuthSigv4({ name: "config" });
const ver = T.ServiceVersion("2014-11-12");
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
                        url: "https://config-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://config.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://config-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://config.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://config.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetComplianceSummaryByConfigRuleRequest extends S.Class<GetComplianceSummaryByConfigRuleRequest>(
  "GetComplianceSummaryByConfigRuleRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ResourceTypeList = S.Array(S.String);
export const ConfigRuleNames = S.Array(S.String);
export const ComplianceTypes = S.Array(S.String);
export const ConfigurationAggregatorNameList = S.Array(S.String);
export const AggregatedSourceStatusTypeList = S.Array(S.String);
export const ConfigurationRecorderNameList = S.Array(S.String);
export const ConformancePackNamesList = S.Array(S.String);
export const DeliveryChannelNameList = S.Array(S.String);
export const OrganizationConfigRuleNames = S.Array(S.String);
export const OrganizationConformancePackNames = S.Array(S.String);
export const RetentionConfigurationNameList = S.Array(S.String);
export const ResourceTypes = S.Array(S.String);
export const ConformancePackNamesToSummarizeList = S.Array(S.String);
export const ResourceIdList = S.Array(S.String);
export const ExcludedAccounts = S.Array(S.String);
export const ReevaluateConfigRuleNames = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export const TagKeyList = S.Array(S.String);
export class AssociateResourceTypesRequest extends S.Class<AssociateResourceTypesRequest>(
  "AssociateResourceTypesRequest",
)(
  { ConfigurationRecorderArn: S.String, ResourceTypes: ResourceTypeList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAggregationAuthorizationRequest extends S.Class<DeleteAggregationAuthorizationRequest>(
  "DeleteAggregationAuthorizationRequest",
)(
  { AuthorizedAccountId: S.String, AuthorizedAwsRegion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAggregationAuthorizationResponse extends S.Class<DeleteAggregationAuthorizationResponse>(
  "DeleteAggregationAuthorizationResponse",
)({}, ns) {}
export class DeleteConfigRuleRequest extends S.Class<DeleteConfigRuleRequest>(
  "DeleteConfigRuleRequest",
)(
  { ConfigRuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigRuleResponse extends S.Class<DeleteConfigRuleResponse>(
  "DeleteConfigRuleResponse",
)({}, ns) {}
export class DeleteConfigurationAggregatorRequest extends S.Class<DeleteConfigurationAggregatorRequest>(
  "DeleteConfigurationAggregatorRequest",
)(
  { ConfigurationAggregatorName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigurationAggregatorResponse extends S.Class<DeleteConfigurationAggregatorResponse>(
  "DeleteConfigurationAggregatorResponse",
)({}, ns) {}
export class DeleteConfigurationRecorderRequest extends S.Class<DeleteConfigurationRecorderRequest>(
  "DeleteConfigurationRecorderRequest",
)(
  { ConfigurationRecorderName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigurationRecorderResponse extends S.Class<DeleteConfigurationRecorderResponse>(
  "DeleteConfigurationRecorderResponse",
)({}, ns) {}
export class DeleteConformancePackRequest extends S.Class<DeleteConformancePackRequest>(
  "DeleteConformancePackRequest",
)(
  { ConformancePackName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConformancePackResponse extends S.Class<DeleteConformancePackResponse>(
  "DeleteConformancePackResponse",
)({}, ns) {}
export class DeleteDeliveryChannelRequest extends S.Class<DeleteDeliveryChannelRequest>(
  "DeleteDeliveryChannelRequest",
)(
  { DeliveryChannelName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeliveryChannelResponse extends S.Class<DeleteDeliveryChannelResponse>(
  "DeleteDeliveryChannelResponse",
)({}, ns) {}
export class DeleteEvaluationResultsRequest extends S.Class<DeleteEvaluationResultsRequest>(
  "DeleteEvaluationResultsRequest",
)(
  { ConfigRuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEvaluationResultsResponse extends S.Class<DeleteEvaluationResultsResponse>(
  "DeleteEvaluationResultsResponse",
)({}, ns) {}
export class DeleteOrganizationConfigRuleRequest extends S.Class<DeleteOrganizationConfigRuleRequest>(
  "DeleteOrganizationConfigRuleRequest",
)(
  { OrganizationConfigRuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOrganizationConfigRuleResponse extends S.Class<DeleteOrganizationConfigRuleResponse>(
  "DeleteOrganizationConfigRuleResponse",
)({}, ns) {}
export class DeleteOrganizationConformancePackRequest extends S.Class<DeleteOrganizationConformancePackRequest>(
  "DeleteOrganizationConformancePackRequest",
)(
  { OrganizationConformancePackName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOrganizationConformancePackResponse extends S.Class<DeleteOrganizationConformancePackResponse>(
  "DeleteOrganizationConformancePackResponse",
)({}, ns) {}
export class DeletePendingAggregationRequestRequest extends S.Class<DeletePendingAggregationRequestRequest>(
  "DeletePendingAggregationRequestRequest",
)(
  { RequesterAccountId: S.String, RequesterAwsRegion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePendingAggregationRequestResponse extends S.Class<DeletePendingAggregationRequestResponse>(
  "DeletePendingAggregationRequestResponse",
)({}, ns) {}
export class DeleteRemediationConfigurationRequest extends S.Class<DeleteRemediationConfigurationRequest>(
  "DeleteRemediationConfigurationRequest",
)(
  { ConfigRuleName: S.String, ResourceType: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRemediationConfigurationResponse extends S.Class<DeleteRemediationConfigurationResponse>(
  "DeleteRemediationConfigurationResponse",
)({}, ns) {}
export class DeleteResourceConfigRequest extends S.Class<DeleteResourceConfigRequest>(
  "DeleteResourceConfigRequest",
)(
  { ResourceType: S.String, ResourceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourceConfigResponse extends S.Class<DeleteResourceConfigResponse>(
  "DeleteResourceConfigResponse",
)({}, ns) {}
export class DeleteRetentionConfigurationRequest extends S.Class<DeleteRetentionConfigurationRequest>(
  "DeleteRetentionConfigurationRequest",
)(
  { RetentionConfigurationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRetentionConfigurationResponse extends S.Class<DeleteRetentionConfigurationResponse>(
  "DeleteRetentionConfigurationResponse",
)({}, ns) {}
export class DeleteServiceLinkedConfigurationRecorderRequest extends S.Class<DeleteServiceLinkedConfigurationRecorderRequest>(
  "DeleteServiceLinkedConfigurationRecorderRequest",
)(
  { ServicePrincipal: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStoredQueryRequest extends S.Class<DeleteStoredQueryRequest>(
  "DeleteStoredQueryRequest",
)(
  { QueryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStoredQueryResponse extends S.Class<DeleteStoredQueryResponse>(
  "DeleteStoredQueryResponse",
)({}, ns) {}
export class DeliverConfigSnapshotRequest extends S.Class<DeliverConfigSnapshotRequest>(
  "DeliverConfigSnapshotRequest",
)(
  { deliveryChannelName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAggregationAuthorizationsRequest extends S.Class<DescribeAggregationAuthorizationsRequest>(
  "DescribeAggregationAuthorizationsRequest",
)(
  { Limit: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComplianceByConfigRuleRequest extends S.Class<DescribeComplianceByConfigRuleRequest>(
  "DescribeComplianceByConfigRuleRequest",
)(
  {
    ConfigRuleNames: S.optional(ConfigRuleNames),
    ComplianceTypes: S.optional(ComplianceTypes),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComplianceByResourceRequest extends S.Class<DescribeComplianceByResourceRequest>(
  "DescribeComplianceByResourceRequest",
)(
  {
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ComplianceTypes: S.optional(ComplianceTypes),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigRuleEvaluationStatusRequest extends S.Class<DescribeConfigRuleEvaluationStatusRequest>(
  "DescribeConfigRuleEvaluationStatusRequest",
)(
  {
    ConfigRuleNames: S.optional(ConfigRuleNames),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationAggregatorsRequest extends S.Class<DescribeConfigurationAggregatorsRequest>(
  "DescribeConfigurationAggregatorsRequest",
)(
  {
    ConfigurationAggregatorNames: S.optional(ConfigurationAggregatorNameList),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationAggregatorSourcesStatusRequest extends S.Class<DescribeConfigurationAggregatorSourcesStatusRequest>(
  "DescribeConfigurationAggregatorSourcesStatusRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    UpdateStatus: S.optional(AggregatedSourceStatusTypeList),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationRecordersRequest extends S.Class<DescribeConfigurationRecordersRequest>(
  "DescribeConfigurationRecordersRequest",
)(
  {
    ConfigurationRecorderNames: S.optional(ConfigurationRecorderNameList),
    ServicePrincipal: S.optional(S.String),
    Arn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationRecorderStatusRequest extends S.Class<DescribeConfigurationRecorderStatusRequest>(
  "DescribeConfigurationRecorderStatusRequest",
)(
  {
    ConfigurationRecorderNames: S.optional(ConfigurationRecorderNameList),
    ServicePrincipal: S.optional(S.String),
    Arn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConformancePacksRequest extends S.Class<DescribeConformancePacksRequest>(
  "DescribeConformancePacksRequest",
)(
  {
    ConformancePackNames: S.optional(ConformancePackNamesList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConformancePackStatusRequest extends S.Class<DescribeConformancePackStatusRequest>(
  "DescribeConformancePackStatusRequest",
)(
  {
    ConformancePackNames: S.optional(ConformancePackNamesList),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliveryChannelsRequest extends S.Class<DescribeDeliveryChannelsRequest>(
  "DescribeDeliveryChannelsRequest",
)(
  { DeliveryChannelNames: S.optional(DeliveryChannelNameList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliveryChannelStatusRequest extends S.Class<DescribeDeliveryChannelStatusRequest>(
  "DescribeDeliveryChannelStatusRequest",
)(
  { DeliveryChannelNames: S.optional(DeliveryChannelNameList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationConfigRulesRequest extends S.Class<DescribeOrganizationConfigRulesRequest>(
  "DescribeOrganizationConfigRulesRequest",
)(
  {
    OrganizationConfigRuleNames: S.optional(OrganizationConfigRuleNames),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationConfigRuleStatusesRequest extends S.Class<DescribeOrganizationConfigRuleStatusesRequest>(
  "DescribeOrganizationConfigRuleStatusesRequest",
)(
  {
    OrganizationConfigRuleNames: S.optional(OrganizationConfigRuleNames),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationConformancePacksRequest extends S.Class<DescribeOrganizationConformancePacksRequest>(
  "DescribeOrganizationConformancePacksRequest",
)(
  {
    OrganizationConformancePackNames: S.optional(
      OrganizationConformancePackNames,
    ),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrganizationConformancePackStatusesRequest extends S.Class<DescribeOrganizationConformancePackStatusesRequest>(
  "DescribeOrganizationConformancePackStatusesRequest",
)(
  {
    OrganizationConformancePackNames: S.optional(
      OrganizationConformancePackNames,
    ),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePendingAggregationRequestsRequest extends S.Class<DescribePendingAggregationRequestsRequest>(
  "DescribePendingAggregationRequestsRequest",
)(
  { Limit: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRemediationConfigurationsRequest extends S.Class<DescribeRemediationConfigurationsRequest>(
  "DescribeRemediationConfigurationsRequest",
)(
  { ConfigRuleNames: ConfigRuleNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemediationExceptionResourceKey extends S.Class<RemediationExceptionResourceKey>(
  "RemediationExceptionResourceKey",
)({ ResourceType: S.optional(S.String), ResourceId: S.optional(S.String) }) {}
export const RemediationExceptionResourceKeys = S.Array(
  RemediationExceptionResourceKey,
);
export class DescribeRemediationExceptionsRequest extends S.Class<DescribeRemediationExceptionsRequest>(
  "DescribeRemediationExceptionsRequest",
)(
  {
    ConfigRuleName: S.String,
    ResourceKeys: S.optional(RemediationExceptionResourceKeys),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceKey extends S.Class<ResourceKey>("ResourceKey")({
  resourceType: S.String,
  resourceId: S.String,
}) {}
export const ResourceKeys = S.Array(ResourceKey);
export class DescribeRemediationExecutionStatusRequest extends S.Class<DescribeRemediationExecutionStatusRequest>(
  "DescribeRemediationExecutionStatusRequest",
)(
  {
    ConfigRuleName: S.String,
    ResourceKeys: S.optional(ResourceKeys),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRetentionConfigurationsRequest extends S.Class<DescribeRetentionConfigurationsRequest>(
  "DescribeRetentionConfigurationsRequest",
)(
  {
    RetentionConfigurationNames: S.optional(RetentionConfigurationNameList),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateResourceTypesRequest extends S.Class<DisassociateResourceTypesRequest>(
  "DisassociateResourceTypesRequest",
)(
  { ConfigurationRecorderArn: S.String, ResourceTypes: ResourceTypeList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAggregateComplianceDetailsByConfigRuleRequest extends S.Class<GetAggregateComplianceDetailsByConfigRuleRequest>(
  "GetAggregateComplianceDetailsByConfigRuleRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    ConfigRuleName: S.String,
    AccountId: S.String,
    AwsRegion: S.String,
    ComplianceType: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AggregateResourceIdentifier extends S.Class<AggregateResourceIdentifier>(
  "AggregateResourceIdentifier",
)({
  SourceAccountId: S.String,
  SourceRegion: S.String,
  ResourceId: S.String,
  ResourceType: S.String,
  ResourceName: S.optional(S.String),
}) {}
export class GetAggregateResourceConfigRequest extends S.Class<GetAggregateResourceConfigRequest>(
  "GetAggregateResourceConfigRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    ResourceIdentifier: AggregateResourceIdentifier,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComplianceDetailsByConfigRuleRequest extends S.Class<GetComplianceDetailsByConfigRuleRequest>(
  "GetComplianceDetailsByConfigRuleRequest",
)(
  {
    ConfigRuleName: S.String,
    ComplianceTypes: S.optional(ComplianceTypes),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComplianceDetailsByResourceRequest extends S.Class<GetComplianceDetailsByResourceRequest>(
  "GetComplianceDetailsByResourceRequest",
)(
  {
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ComplianceTypes: S.optional(ComplianceTypes),
    NextToken: S.optional(S.String),
    ResourceEvaluationId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComplianceSummaryByResourceTypeRequest extends S.Class<GetComplianceSummaryByResourceTypeRequest>(
  "GetComplianceSummaryByResourceTypeRequest",
)(
  { ResourceTypes: S.optional(ResourceTypes) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConformancePackComplianceSummaryRequest extends S.Class<GetConformancePackComplianceSummaryRequest>(
  "GetConformancePackComplianceSummaryRequest",
)(
  {
    ConformancePackNames: ConformancePackNamesToSummarizeList,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCustomRulePolicyRequest extends S.Class<GetCustomRulePolicyRequest>(
  "GetCustomRulePolicyRequest",
)(
  { ConfigRuleName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDiscoveredResourceCountsRequest extends S.Class<GetDiscoveredResourceCountsRequest>(
  "GetDiscoveredResourceCountsRequest",
)(
  {
    resourceTypes: S.optional(ResourceTypes),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOrganizationCustomRulePolicyRequest extends S.Class<GetOrganizationCustomRulePolicyRequest>(
  "GetOrganizationCustomRulePolicyRequest",
)(
  { OrganizationConfigRuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceConfigHistoryRequest extends S.Class<GetResourceConfigHistoryRequest>(
  "GetResourceConfigHistoryRequest",
)(
  {
    resourceType: S.String,
    resourceId: S.String,
    laterTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    earlierTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    chronologicalOrder: S.optional(S.String),
    limit: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceEvaluationSummaryRequest extends S.Class<GetResourceEvaluationSummaryRequest>(
  "GetResourceEvaluationSummaryRequest",
)(
  { ResourceEvaluationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStoredQueryRequest extends S.Class<GetStoredQueryRequest>(
  "GetStoredQueryRequest",
)(
  { QueryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDiscoveredResourcesRequest extends S.Class<ListDiscoveredResourcesRequest>(
  "ListDiscoveredResourcesRequest",
)(
  {
    resourceType: S.String,
    resourceIds: S.optional(ResourceIdList),
    resourceName: S.optional(S.String),
    limit: S.optional(S.Number),
    includeDeletedResources: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStoredQueriesRequest extends S.Class<ListStoredQueriesRequest>(
  "ListStoredQueriesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConformancePackInputParameter extends S.Class<ConformancePackInputParameter>(
  "ConformancePackInputParameter",
)({ ParameterName: S.String, ParameterValue: S.String }) {}
export const ConformancePackInputParameters = S.Array(
  ConformancePackInputParameter,
);
export class PutOrganizationConformancePackRequest extends S.Class<PutOrganizationConformancePackRequest>(
  "PutOrganizationConformancePackRequest",
)(
  {
    OrganizationConformancePackName: S.String,
    TemplateS3Uri: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    ExcludedAccounts: S.optional(ExcludedAccounts),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRemediationExceptionsRequest extends S.Class<PutRemediationExceptionsRequest>(
  "PutRemediationExceptionsRequest",
)(
  {
    ConfigRuleName: S.String,
    ResourceKeys: RemediationExceptionResourceKeys,
    Message: S.optional(S.String),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRetentionConfigurationRequest extends S.Class<PutRetentionConfigurationRequest>(
  "PutRetentionConfigurationRequest",
)(
  { RetentionPeriodInDays: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagsList = S.Array(Tag);
export class PutServiceLinkedConfigurationRecorderRequest extends S.Class<PutServiceLinkedConfigurationRecorderRequest>(
  "PutServiceLinkedConfigurationRecorderRequest",
)(
  { ServicePrincipal: S.String, Tags: S.optional(TagsList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SelectAggregateResourceConfigRequest extends S.Class<SelectAggregateResourceConfigRequest>(
  "SelectAggregateResourceConfigRequest",
)(
  {
    Expression: S.String,
    ConfigurationAggregatorName: S.String,
    Limit: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SelectResourceConfigRequest extends S.Class<SelectResourceConfigRequest>(
  "SelectResourceConfigRequest",
)(
  {
    Expression: S.String,
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartConfigRulesEvaluationRequest extends S.Class<StartConfigRulesEvaluationRequest>(
  "StartConfigRulesEvaluationRequest",
)(
  { ConfigRuleNames: S.optional(ReevaluateConfigRuleNames) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartConfigRulesEvaluationResponse extends S.Class<StartConfigRulesEvaluationResponse>(
  "StartConfigRulesEvaluationResponse",
)({}, ns) {}
export class StartConfigurationRecorderRequest extends S.Class<StartConfigurationRecorderRequest>(
  "StartConfigurationRecorderRequest",
)(
  { ConfigurationRecorderName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartConfigurationRecorderResponse extends S.Class<StartConfigurationRecorderResponse>(
  "StartConfigurationRecorderResponse",
)({}, ns) {}
export class StartRemediationExecutionRequest extends S.Class<StartRemediationExecutionRequest>(
  "StartRemediationExecutionRequest",
)(
  { ConfigRuleName: S.String, ResourceKeys: ResourceKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopConfigurationRecorderRequest extends S.Class<StopConfigurationRecorderRequest>(
  "StopConfigurationRecorderRequest",
)(
  { ConfigurationRecorderName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopConfigurationRecorderResponse extends S.Class<StopConfigurationRecorderResponse>(
  "StopConfigurationRecorderResponse",
)({}, ns) {}
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
export const ConformancePackConfigRuleNames = S.Array(S.String);
export const ConformancePackComplianceResourceIds = S.Array(S.String);
export const ConfigurationRecorderFilterValues = S.Array(S.String);
export const ConformancePackNameFilter = S.Array(S.String);
export const AccountAggregationSourceAccountList = S.Array(S.String);
export const AggregatorRegionList = S.Array(S.String);
export const ResourceTypesScope = S.Array(S.String);
export const OrganizationConfigRuleTriggerTypes = S.Array(S.String);
export const OrganizationConfigRuleTriggerTypeNoSNs = S.Array(S.String);
export const DebugLogDeliveryAccounts = S.Array(S.String);
export const ResourceIdentifiersList = S.Array(AggregateResourceIdentifier);
export class ConfigRuleComplianceFilters extends S.Class<ConfigRuleComplianceFilters>(
  "ConfigRuleComplianceFilters",
)({
  ConfigRuleName: S.optional(S.String),
  ComplianceType: S.optional(S.String),
  AccountId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
}) {}
export class AggregateConformancePackComplianceFilters extends S.Class<AggregateConformancePackComplianceFilters>(
  "AggregateConformancePackComplianceFilters",
)({
  ConformancePackName: S.optional(S.String),
  ComplianceType: S.optional(S.String),
  AccountId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
}) {}
export class DescribeConfigRulesFilters extends S.Class<DescribeConfigRulesFilters>(
  "DescribeConfigRulesFilters",
)({ EvaluationMode: S.optional(S.String) }) {}
export class ExclusionByResourceTypes extends S.Class<ExclusionByResourceTypes>(
  "ExclusionByResourceTypes",
)({ resourceTypes: S.optional(ResourceTypeList) }) {}
export class RecordingStrategy extends S.Class<RecordingStrategy>(
  "RecordingStrategy",
)({ useOnly: S.optional(S.String) }) {}
export class RecordingGroup extends S.Class<RecordingGroup>("RecordingGroup")({
  allSupported: S.optional(S.Boolean),
  includeGlobalResourceTypes: S.optional(S.Boolean),
  resourceTypes: S.optional(ResourceTypeList),
  exclusionByResourceTypes: S.optional(ExclusionByResourceTypes),
  recordingStrategy: S.optional(RecordingStrategy),
}) {}
export const RecordingModeResourceTypesList = S.Array(S.String);
export class RecordingModeOverride extends S.Class<RecordingModeOverride>(
  "RecordingModeOverride",
)({
  description: S.optional(S.String),
  resourceTypes: RecordingModeResourceTypesList,
  recordingFrequency: S.String,
}) {}
export const RecordingModeOverrides = S.Array(RecordingModeOverride);
export class RecordingMode extends S.Class<RecordingMode>("RecordingMode")({
  recordingFrequency: S.String,
  recordingModeOverrides: S.optional(RecordingModeOverrides),
}) {}
export class ConfigurationRecorder extends S.Class<ConfigurationRecorder>(
  "ConfigurationRecorder",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  roleARN: S.optional(S.String),
  recordingGroup: S.optional(RecordingGroup),
  recordingMode: S.optional(RecordingMode),
  recordingScope: S.optional(S.String),
  servicePrincipal: S.optional(S.String),
}) {}
export const ConfigurationRecorderList = S.Array(ConfigurationRecorder);
export class ConformancePackComplianceFilters extends S.Class<ConformancePackComplianceFilters>(
  "ConformancePackComplianceFilters",
)({
  ConfigRuleNames: S.optional(ConformancePackConfigRuleNames),
  ComplianceType: S.optional(S.String),
}) {}
export class ConfigSnapshotDeliveryProperties extends S.Class<ConfigSnapshotDeliveryProperties>(
  "ConfigSnapshotDeliveryProperties",
)({ deliveryFrequency: S.optional(S.String) }) {}
export class DeliveryChannel extends S.Class<DeliveryChannel>(
  "DeliveryChannel",
)({
  name: S.optional(S.String),
  s3BucketName: S.optional(S.String),
  s3KeyPrefix: S.optional(S.String),
  s3KmsKeyArn: S.optional(S.String),
  snsTopicARN: S.optional(S.String),
  configSnapshotDeliveryProperties: S.optional(
    ConfigSnapshotDeliveryProperties,
  ),
}) {}
export const DeliveryChannelList = S.Array(DeliveryChannel);
export class ConfigRuleComplianceSummaryFilters extends S.Class<ConfigRuleComplianceSummaryFilters>(
  "ConfigRuleComplianceSummaryFilters",
)({ AccountId: S.optional(S.String), AwsRegion: S.optional(S.String) }) {}
export class AggregateConformancePackComplianceSummaryFilters extends S.Class<AggregateConformancePackComplianceSummaryFilters>(
  "AggregateConformancePackComplianceSummaryFilters",
)({ AccountId: S.optional(S.String), AwsRegion: S.optional(S.String) }) {}
export class ResourceCountFilters extends S.Class<ResourceCountFilters>(
  "ResourceCountFilters",
)({
  ResourceType: S.optional(S.String),
  AccountId: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export class ConformancePackEvaluationFilters extends S.Class<ConformancePackEvaluationFilters>(
  "ConformancePackEvaluationFilters",
)({
  ConfigRuleNames: S.optional(ConformancePackConfigRuleNames),
  ComplianceType: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceIds: S.optional(ConformancePackComplianceResourceIds),
}) {}
export class StatusDetailFilters extends S.Class<StatusDetailFilters>(
  "StatusDetailFilters",
)({
  AccountId: S.optional(S.String),
  MemberAccountRuleStatus: S.optional(S.String),
}) {}
export class OrganizationResourceDetailedStatusFilters extends S.Class<OrganizationResourceDetailedStatusFilters>(
  "OrganizationResourceDetailedStatusFilters",
)({ AccountId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export const RelatedEventList = S.Array(S.String);
export class Relationship extends S.Class<Relationship>("Relationship")({
  resourceType: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceName: S.optional(S.String),
  relationshipName: S.optional(S.String),
}) {}
export const RelationshipList = S.Array(Relationship);
export const SupplementaryConfiguration = S.Record({
  key: S.String,
  value: S.String,
});
export class ConfigurationItem extends S.Class<ConfigurationItem>(
  "ConfigurationItem",
)({
  version: S.optional(S.String),
  accountId: S.optional(S.String),
  configurationItemCaptureTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  configurationItemStatus: S.optional(S.String),
  configurationStateId: S.optional(S.String),
  configurationItemMD5Hash: S.optional(S.String),
  arn: S.optional(S.String),
  resourceType: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceName: S.optional(S.String),
  awsRegion: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  resourceCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(Tags),
  relatedEvents: S.optional(RelatedEventList),
  relationships: S.optional(RelationshipList),
  configuration: S.optional(S.String),
  supplementaryConfiguration: S.optional(SupplementaryConfiguration),
  recordingFrequency: S.optional(S.String),
  configurationItemDeliveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ConfigurationItemList = S.Array(ConfigurationItem);
export class ResourceFilters extends S.Class<ResourceFilters>(
  "ResourceFilters",
)({
  AccountId: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceName: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export class ConfigurationRecorderFilter extends S.Class<ConfigurationRecorderFilter>(
  "ConfigurationRecorderFilter",
)({
  filterName: S.optional(S.String),
  filterValue: S.optional(ConfigurationRecorderFilterValues),
}) {}
export const ConfigurationRecorderFilterList = S.Array(
  ConfigurationRecorderFilter,
);
export class ConformancePackComplianceScoresFilters extends S.Class<ConformancePackComplianceScoresFilters>(
  "ConformancePackComplianceScoresFilters",
)({ ConformancePackNames: ConformancePackNameFilter }) {}
export class AccountAggregationSource extends S.Class<AccountAggregationSource>(
  "AccountAggregationSource",
)({
  AccountIds: AccountAggregationSourceAccountList,
  AllAwsRegions: S.optional(S.Boolean),
  AwsRegions: S.optional(AggregatorRegionList),
}) {}
export const AccountAggregationSourceList = S.Array(AccountAggregationSource);
export class OrganizationAggregationSource extends S.Class<OrganizationAggregationSource>(
  "OrganizationAggregationSource",
)({
  RoleArn: S.String,
  AwsRegions: S.optional(AggregatorRegionList),
  AllAwsRegions: S.optional(S.Boolean),
}) {}
export class TemplateSSMDocumentDetails extends S.Class<TemplateSSMDocumentDetails>(
  "TemplateSSMDocumentDetails",
)({ DocumentName: S.String, DocumentVersion: S.optional(S.String) }) {}
export class Evaluation extends S.Class<Evaluation>("Evaluation")({
  ComplianceResourceType: S.String,
  ComplianceResourceId: S.String,
  ComplianceType: S.String,
  Annotation: S.optional(S.String),
  OrderingTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Evaluations = S.Array(Evaluation);
export class ExternalEvaluation extends S.Class<ExternalEvaluation>(
  "ExternalEvaluation",
)({
  ComplianceResourceType: S.String,
  ComplianceResourceId: S.String,
  ComplianceType: S.String,
  Annotation: S.optional(S.String),
  OrderingTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class OrganizationManagedRuleMetadata extends S.Class<OrganizationManagedRuleMetadata>(
  "OrganizationManagedRuleMetadata",
)({
  Description: S.optional(S.String),
  RuleIdentifier: S.String,
  InputParameters: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
  ResourceTypesScope: S.optional(ResourceTypesScope),
  ResourceIdScope: S.optional(S.String),
  TagKeyScope: S.optional(S.String),
  TagValueScope: S.optional(S.String),
}) {}
export class OrganizationCustomRuleMetadata extends S.Class<OrganizationCustomRuleMetadata>(
  "OrganizationCustomRuleMetadata",
)({
  Description: S.optional(S.String),
  LambdaFunctionArn: S.String,
  OrganizationConfigRuleTriggerTypes: OrganizationConfigRuleTriggerTypes,
  InputParameters: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
  ResourceTypesScope: S.optional(ResourceTypesScope),
  ResourceIdScope: S.optional(S.String),
  TagKeyScope: S.optional(S.String),
  TagValueScope: S.optional(S.String),
}) {}
export class OrganizationCustomPolicyRuleMetadata extends S.Class<OrganizationCustomPolicyRuleMetadata>(
  "OrganizationCustomPolicyRuleMetadata",
)({
  Description: S.optional(S.String),
  OrganizationConfigRuleTriggerTypes: S.optional(
    OrganizationConfigRuleTriggerTypeNoSNs,
  ),
  InputParameters: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
  ResourceTypesScope: S.optional(ResourceTypesScope),
  ResourceIdScope: S.optional(S.String),
  TagKeyScope: S.optional(S.String),
  TagValueScope: S.optional(S.String),
  PolicyRuntime: S.String,
  PolicyText: S.String,
  DebugLogDeliveryAccounts: S.optional(DebugLogDeliveryAccounts),
}) {}
export class StoredQuery extends S.Class<StoredQuery>("StoredQuery")({
  QueryId: S.optional(S.String),
  QueryArn: S.optional(S.String),
  QueryName: S.String,
  Description: S.optional(S.String),
  Expression: S.optional(S.String),
}) {}
export const Results = S.Array(S.String);
export class ResourceDetails extends S.Class<ResourceDetails>(
  "ResourceDetails",
)({
  ResourceId: S.String,
  ResourceType: S.String,
  ResourceConfiguration: S.String,
  ResourceConfigurationSchemaType: S.optional(S.String),
}) {}
export class EvaluationContext extends S.Class<EvaluationContext>(
  "EvaluationContext",
)({ EvaluationContextIdentifier: S.optional(S.String) }) {}
export const ComplianceResourceTypes = S.Array(S.String);
export const ResourceTypeValueList = S.Array(S.String);
export const ServicePrincipalValueList = S.Array(S.String);
export class AssociateResourceTypesResponse extends S.Class<AssociateResourceTypesResponse>(
  "AssociateResourceTypesResponse",
)({ ConfigurationRecorder: ConfigurationRecorder }, ns) {}
export class BatchGetAggregateResourceConfigRequest extends S.Class<BatchGetAggregateResourceConfigRequest>(
  "BatchGetAggregateResourceConfigRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    ResourceIdentifiers: ResourceIdentifiersList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetResourceConfigRequest extends S.Class<BatchGetResourceConfigRequest>(
  "BatchGetResourceConfigRequest",
)(
  { resourceKeys: ResourceKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRemediationExceptionsRequest extends S.Class<DeleteRemediationExceptionsRequest>(
  "DeleteRemediationExceptionsRequest",
)(
  { ConfigRuleName: S.String, ResourceKeys: RemediationExceptionResourceKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceLinkedConfigurationRecorderResponse extends S.Class<DeleteServiceLinkedConfigurationRecorderResponse>(
  "DeleteServiceLinkedConfigurationRecorderResponse",
)({ Arn: S.String, Name: S.String }, ns) {}
export class DeliverConfigSnapshotResponse extends S.Class<DeliverConfigSnapshotResponse>(
  "DeliverConfigSnapshotResponse",
)({ configSnapshotId: S.optional(S.String) }, ns) {}
export class DescribeAggregateComplianceByConfigRulesRequest extends S.Class<DescribeAggregateComplianceByConfigRulesRequest>(
  "DescribeAggregateComplianceByConfigRulesRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ConfigRuleComplianceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAggregateComplianceByConformancePacksRequest extends S.Class<DescribeAggregateComplianceByConformancePacksRequest>(
  "DescribeAggregateComplianceByConformancePacksRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(AggregateConformancePackComplianceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigRulesRequest extends S.Class<DescribeConfigRulesRequest>(
  "DescribeConfigRulesRequest",
)(
  {
    ConfigRuleNames: S.optional(ConfigRuleNames),
    NextToken: S.optional(S.String),
    Filters: S.optional(DescribeConfigRulesFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConfigurationRecordersResponse extends S.Class<DescribeConfigurationRecordersResponse>(
  "DescribeConfigurationRecordersResponse",
)({ ConfigurationRecorders: S.optional(ConfigurationRecorderList) }, ns) {}
export class DescribeConformancePackComplianceRequest extends S.Class<DescribeConformancePackComplianceRequest>(
  "DescribeConformancePackComplianceRequest",
)(
  {
    ConformancePackName: S.String,
    Filters: S.optional(ConformancePackComplianceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeliveryChannelsResponse extends S.Class<DescribeDeliveryChannelsResponse>(
  "DescribeDeliveryChannelsResponse",
)({ DeliveryChannels: S.optional(DeliveryChannelList) }, ns) {}
export class ResourceValue extends S.Class<ResourceValue>("ResourceValue")({
  Value: S.String,
}) {}
export const StaticParameterValues = S.Array(S.String);
export class StaticValue extends S.Class<StaticValue>("StaticValue")({
  Values: StaticParameterValues,
}) {}
export class RemediationParameterValue extends S.Class<RemediationParameterValue>(
  "RemediationParameterValue",
)({
  ResourceValue: S.optional(ResourceValue),
  StaticValue: S.optional(StaticValue),
}) {}
export const RemediationParameters = S.Record({
  key: S.String,
  value: RemediationParameterValue,
});
export class SsmControls extends S.Class<SsmControls>("SsmControls")({
  ConcurrentExecutionRatePercentage: S.optional(S.Number),
  ErrorPercentage: S.optional(S.Number),
}) {}
export class ExecutionControls extends S.Class<ExecutionControls>(
  "ExecutionControls",
)({ SsmControls: S.optional(SsmControls) }) {}
export class RemediationConfiguration extends S.Class<RemediationConfiguration>(
  "RemediationConfiguration",
)({
  ConfigRuleName: S.String,
  TargetType: S.String,
  TargetId: S.String,
  TargetVersion: S.optional(S.String),
  Parameters: S.optional(RemediationParameters),
  ResourceType: S.optional(S.String),
  Automatic: S.optional(S.Boolean),
  ExecutionControls: S.optional(ExecutionControls),
  MaximumAutomaticAttempts: S.optional(S.Number),
  RetryAttemptSeconds: S.optional(S.Number),
  Arn: S.optional(S.String),
  CreatedByService: S.optional(S.String),
}) {}
export const RemediationConfigurations = S.Array(RemediationConfiguration);
export class DescribeRemediationConfigurationsResponse extends S.Class<DescribeRemediationConfigurationsResponse>(
  "DescribeRemediationConfigurationsResponse",
)({ RemediationConfigurations: S.optional(RemediationConfigurations) }, ns) {}
export class DisassociateResourceTypesResponse extends S.Class<DisassociateResourceTypesResponse>(
  "DisassociateResourceTypesResponse",
)({ ConfigurationRecorder: ConfigurationRecorder }, ns) {}
export class GetAggregateConfigRuleComplianceSummaryRequest extends S.Class<GetAggregateConfigRuleComplianceSummaryRequest>(
  "GetAggregateConfigRuleComplianceSummaryRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ConfigRuleComplianceSummaryFilters),
    GroupByKey: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAggregateConformancePackComplianceSummaryRequest extends S.Class<GetAggregateConformancePackComplianceSummaryRequest>(
  "GetAggregateConformancePackComplianceSummaryRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(AggregateConformancePackComplianceSummaryFilters),
    GroupByKey: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAggregateDiscoveredResourceCountsRequest extends S.Class<GetAggregateDiscoveredResourceCountsRequest>(
  "GetAggregateDiscoveredResourceCountsRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    Filters: S.optional(ResourceCountFilters),
    GroupByKey: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EvaluationResultQualifier extends S.Class<EvaluationResultQualifier>(
  "EvaluationResultQualifier",
)({
  ConfigRuleName: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  EvaluationMode: S.optional(S.String),
}) {}
export class EvaluationResultIdentifier extends S.Class<EvaluationResultIdentifier>(
  "EvaluationResultIdentifier",
)({
  EvaluationResultQualifier: S.optional(EvaluationResultQualifier),
  OrderingTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ResourceEvaluationId: S.optional(S.String),
}) {}
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({
  EvaluationResultIdentifier: S.optional(EvaluationResultIdentifier),
  ComplianceType: S.optional(S.String),
  ResultRecordedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ConfigRuleInvokedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Annotation: S.optional(S.String),
  ResultToken: S.optional(S.String),
}) {}
export const EvaluationResults = S.Array(EvaluationResult);
export class GetComplianceDetailsByResourceResponse extends S.Class<GetComplianceDetailsByResourceResponse>(
  "GetComplianceDetailsByResourceResponse",
)(
  {
    EvaluationResults: S.optional(EvaluationResults),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetConformancePackComplianceDetailsRequest extends S.Class<GetConformancePackComplianceDetailsRequest>(
  "GetConformancePackComplianceDetailsRequest",
)(
  {
    ConformancePackName: S.String,
    Filters: S.optional(ConformancePackEvaluationFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCustomRulePolicyResponse extends S.Class<GetCustomRulePolicyResponse>(
  "GetCustomRulePolicyResponse",
)({ PolicyText: S.optional(S.String) }, ns) {}
export class GetOrganizationConfigRuleDetailedStatusRequest extends S.Class<GetOrganizationConfigRuleDetailedStatusRequest>(
  "GetOrganizationConfigRuleDetailedStatusRequest",
)(
  {
    OrganizationConfigRuleName: S.String,
    Filters: S.optional(StatusDetailFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOrganizationConformancePackDetailedStatusRequest extends S.Class<GetOrganizationConformancePackDetailedStatusRequest>(
  "GetOrganizationConformancePackDetailedStatusRequest",
)(
  {
    OrganizationConformancePackName: S.String,
    Filters: S.optional(OrganizationResourceDetailedStatusFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetOrganizationCustomRulePolicyResponse extends S.Class<GetOrganizationCustomRulePolicyResponse>(
  "GetOrganizationCustomRulePolicyResponse",
)({ PolicyText: S.optional(S.String) }, ns) {}
export class GetResourceConfigHistoryResponse extends S.Class<GetResourceConfigHistoryResponse>(
  "GetResourceConfigHistoryResponse",
)(
  {
    configurationItems: S.optional(ConfigurationItemList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetStoredQueryResponse extends S.Class<GetStoredQueryResponse>(
  "GetStoredQueryResponse",
)({ StoredQuery: S.optional(StoredQuery) }, ns) {}
export class ListAggregateDiscoveredResourcesRequest extends S.Class<ListAggregateDiscoveredResourcesRequest>(
  "ListAggregateDiscoveredResourcesRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    ResourceType: S.String,
    Filters: S.optional(ResourceFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConfigurationRecordersRequest extends S.Class<ListConfigurationRecordersRequest>(
  "ListConfigurationRecordersRequest",
)(
  {
    Filters: S.optional(ConfigurationRecorderFilterList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConformancePackComplianceScoresRequest extends S.Class<ListConformancePackComplianceScoresRequest>(
  "ListConformancePackComplianceScoresRequest",
)(
  {
    Filters: S.optional(ConformancePackComplianceScoresFilters),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }, ns) {}
export class PutAggregationAuthorizationRequest extends S.Class<PutAggregationAuthorizationRequest>(
  "PutAggregationAuthorizationRequest",
)(
  {
    AuthorizedAccountId: S.String,
    AuthorizedAwsRegion: S.String,
    Tags: S.optional(TagsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutConformancePackRequest extends S.Class<PutConformancePackRequest>(
  "PutConformancePackRequest",
)(
  {
    ConformancePackName: S.String,
    TemplateS3Uri: S.optional(S.String),
    TemplateBody: S.optional(S.String),
    DeliveryS3Bucket: S.optional(S.String),
    DeliveryS3KeyPrefix: S.optional(S.String),
    ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
    TemplateSSMDocumentDetails: S.optional(TemplateSSMDocumentDetails),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEvaluationsRequest extends S.Class<PutEvaluationsRequest>(
  "PutEvaluationsRequest",
)(
  {
    Evaluations: S.optional(Evaluations),
    ResultToken: S.String,
    TestMode: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutExternalEvaluationRequest extends S.Class<PutExternalEvaluationRequest>(
  "PutExternalEvaluationRequest",
)(
  { ConfigRuleName: S.String, ExternalEvaluation: ExternalEvaluation },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutExternalEvaluationResponse extends S.Class<PutExternalEvaluationResponse>(
  "PutExternalEvaluationResponse",
)({}, ns) {}
export class PutOrganizationConfigRuleRequest extends S.Class<PutOrganizationConfigRuleRequest>(
  "PutOrganizationConfigRuleRequest",
)(
  {
    OrganizationConfigRuleName: S.String,
    OrganizationManagedRuleMetadata: S.optional(
      OrganizationManagedRuleMetadata,
    ),
    OrganizationCustomRuleMetadata: S.optional(OrganizationCustomRuleMetadata),
    ExcludedAccounts: S.optional(ExcludedAccounts),
    OrganizationCustomPolicyRuleMetadata: S.optional(
      OrganizationCustomPolicyRuleMetadata,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutOrganizationConformancePackResponse extends S.Class<PutOrganizationConformancePackResponse>(
  "PutOrganizationConformancePackResponse",
)({ OrganizationConformancePackArn: S.optional(S.String) }, ns) {}
export class PutResourceConfigRequest extends S.Class<PutResourceConfigRequest>(
  "PutResourceConfigRequest",
)(
  {
    ResourceType: S.String,
    SchemaVersionId: S.String,
    ResourceId: S.String,
    ResourceName: S.optional(S.String),
    Configuration: S.String,
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourceConfigResponse extends S.Class<PutResourceConfigResponse>(
  "PutResourceConfigResponse",
)({}, ns) {}
export class RetentionConfiguration extends S.Class<RetentionConfiguration>(
  "RetentionConfiguration",
)({ Name: S.String, RetentionPeriodInDays: S.Number }) {}
export class PutRetentionConfigurationResponse extends S.Class<PutRetentionConfigurationResponse>(
  "PutRetentionConfigurationResponse",
)({ RetentionConfiguration: S.optional(RetentionConfiguration) }, ns) {}
export class PutServiceLinkedConfigurationRecorderResponse extends S.Class<PutServiceLinkedConfigurationRecorderResponse>(
  "PutServiceLinkedConfigurationRecorderResponse",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }, ns) {}
export class PutStoredQueryRequest extends S.Class<PutStoredQueryRequest>(
  "PutStoredQueryRequest",
)(
  { StoredQuery: StoredQuery, Tags: S.optional(TagsList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FieldInfo extends S.Class<FieldInfo>("FieldInfo")({
  Name: S.optional(S.String),
}) {}
export const FieldInfoList = S.Array(FieldInfo);
export class QueryInfo extends S.Class<QueryInfo>("QueryInfo")({
  SelectFields: S.optional(FieldInfoList),
}) {}
export class SelectResourceConfigResponse extends S.Class<SelectResourceConfigResponse>(
  "SelectResourceConfigResponse",
)(
  {
    Results: S.optional(Results),
    QueryInfo: S.optional(QueryInfo),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartRemediationExecutionResponse extends S.Class<StartRemediationExecutionResponse>(
  "StartRemediationExecutionResponse",
)(
  {
    FailureMessage: S.optional(S.String),
    FailedItems: S.optional(ResourceKeys),
  },
  ns,
) {}
export class StartResourceEvaluationRequest extends S.Class<StartResourceEvaluationRequest>(
  "StartResourceEvaluationRequest",
)(
  {
    ResourceDetails: ResourceDetails,
    EvaluationContext: S.optional(EvaluationContext),
    EvaluationMode: S.String,
    EvaluationTimeout: S.optional(S.Number),
    ClientToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ComplianceContributorCount extends S.Class<ComplianceContributorCount>(
  "ComplianceContributorCount",
)({ CappedCount: S.optional(S.Number), CapExceeded: S.optional(S.Boolean) }) {}
export class TimeWindow extends S.Class<TimeWindow>("TimeWindow")({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Scope extends S.Class<Scope>("Scope")({
  ComplianceResourceTypes: S.optional(ComplianceResourceTypes),
  TagKey: S.optional(S.String),
  TagValue: S.optional(S.String),
  ComplianceResourceId: S.optional(S.String),
}) {}
export class EvaluationModeConfiguration extends S.Class<EvaluationModeConfiguration>(
  "EvaluationModeConfiguration",
)({ Mode: S.optional(S.String) }) {}
export const EvaluationModes = S.Array(EvaluationModeConfiguration);
export class AggregatorFilterResourceType extends S.Class<AggregatorFilterResourceType>(
  "AggregatorFilterResourceType",
)({ Type: S.optional(S.String), Value: S.optional(ResourceTypeValueList) }) {}
export class AggregatorFilterServicePrincipal extends S.Class<AggregatorFilterServicePrincipal>(
  "AggregatorFilterServicePrincipal",
)({
  Type: S.optional(S.String),
  Value: S.optional(ServicePrincipalValueList),
}) {}
export const UnprocessedResourceIdentifierList = S.Array(
  AggregateResourceIdentifier,
);
export class AggregationAuthorization extends S.Class<AggregationAuthorization>(
  "AggregationAuthorization",
)({
  AggregationAuthorizationArn: S.optional(S.String),
  AuthorizedAccountId: S.optional(S.String),
  AuthorizedAwsRegion: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AggregationAuthorizationList = S.Array(AggregationAuthorization);
export class Compliance extends S.Class<Compliance>("Compliance")({
  ComplianceType: S.optional(S.String),
  ComplianceContributorCount: S.optional(ComplianceContributorCount),
}) {}
export class ComplianceByResource extends S.Class<ComplianceByResource>(
  "ComplianceByResource",
)({
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  Compliance: S.optional(Compliance),
}) {}
export const ComplianceByResources = S.Array(ComplianceByResource);
export class ConfigRuleEvaluationStatus extends S.Class<ConfigRuleEvaluationStatus>(
  "ConfigRuleEvaluationStatus",
)({
  ConfigRuleName: S.optional(S.String),
  ConfigRuleArn: S.optional(S.String),
  ConfigRuleId: S.optional(S.String),
  LastSuccessfulInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastFailedInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastSuccessfulEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastFailedEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FirstActivatedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastDeactivatedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastErrorCode: S.optional(S.String),
  LastErrorMessage: S.optional(S.String),
  FirstEvaluationStarted: S.optional(S.Boolean),
  LastDebugLogDeliveryStatus: S.optional(S.String),
  LastDebugLogDeliveryStatusReason: S.optional(S.String),
  LastDebugLogDeliveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ConfigRuleEvaluationStatusList = S.Array(
  ConfigRuleEvaluationStatus,
);
export class SourceDetail extends S.Class<SourceDetail>("SourceDetail")({
  EventSource: S.optional(S.String),
  MessageType: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
}) {}
export const SourceDetails = S.Array(SourceDetail);
export class CustomPolicyDetails extends S.Class<CustomPolicyDetails>(
  "CustomPolicyDetails",
)({
  PolicyRuntime: S.String,
  PolicyText: S.String,
  EnableDebugLogDelivery: S.optional(S.Boolean),
}) {}
export class Source extends S.Class<Source>("Source")({
  Owner: S.String,
  SourceIdentifier: S.optional(S.String),
  SourceDetails: S.optional(SourceDetails),
  CustomPolicyDetails: S.optional(CustomPolicyDetails),
}) {}
export class ConfigRule extends S.Class<ConfigRule>("ConfigRule")({
  ConfigRuleName: S.optional(S.String),
  ConfigRuleArn: S.optional(S.String),
  ConfigRuleId: S.optional(S.String),
  Description: S.optional(S.String),
  Scope: S.optional(Scope),
  Source: Source,
  InputParameters: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
  ConfigRuleState: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  EvaluationModes: S.optional(EvaluationModes),
}) {}
export const ConfigRules = S.Array(ConfigRule);
export class AggregatorFilters extends S.Class<AggregatorFilters>(
  "AggregatorFilters",
)({
  ResourceType: S.optional(AggregatorFilterResourceType),
  ServicePrincipal: S.optional(AggregatorFilterServicePrincipal),
}) {}
export class ConfigurationAggregator extends S.Class<ConfigurationAggregator>(
  "ConfigurationAggregator",
)({
  ConfigurationAggregatorName: S.optional(S.String),
  ConfigurationAggregatorArn: S.optional(S.String),
  AccountAggregationSources: S.optional(AccountAggregationSourceList),
  OrganizationAggregationSource: S.optional(OrganizationAggregationSource),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  AggregatorFilters: S.optional(AggregatorFilters),
}) {}
export const ConfigurationAggregatorList = S.Array(ConfigurationAggregator);
export class AggregatedSourceStatus extends S.Class<AggregatedSourceStatus>(
  "AggregatedSourceStatus",
)({
  SourceId: S.optional(S.String),
  SourceType: S.optional(S.String),
  AwsRegion: S.optional(S.String),
  LastUpdateStatus: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastErrorCode: S.optional(S.String),
  LastErrorMessage: S.optional(S.String),
}) {}
export const AggregatedSourceStatusList = S.Array(AggregatedSourceStatus);
export class ConfigurationRecorderStatus extends S.Class<ConfigurationRecorderStatus>(
  "ConfigurationRecorderStatus",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastStopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  recording: S.optional(S.Boolean),
  lastStatus: S.optional(S.String),
  lastErrorCode: S.optional(S.String),
  lastErrorMessage: S.optional(S.String),
  lastStatusChangeTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  servicePrincipal: S.optional(S.String),
}) {}
export const ConfigurationRecorderStatusList = S.Array(
  ConfigurationRecorderStatus,
);
export class ConformancePackDetail extends S.Class<ConformancePackDetail>(
  "ConformancePackDetail",
)({
  ConformancePackName: S.String,
  ConformancePackArn: S.String,
  ConformancePackId: S.String,
  DeliveryS3Bucket: S.optional(S.String),
  DeliveryS3KeyPrefix: S.optional(S.String),
  ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
  LastUpdateRequestedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreatedBy: S.optional(S.String),
  TemplateSSMDocumentDetails: S.optional(TemplateSSMDocumentDetails),
}) {}
export const ConformancePackDetailList = S.Array(ConformancePackDetail);
export class ConformancePackStatusDetail extends S.Class<ConformancePackStatusDetail>(
  "ConformancePackStatusDetail",
)({
  ConformancePackName: S.String,
  ConformancePackId: S.String,
  ConformancePackArn: S.String,
  ConformancePackState: S.String,
  StackArn: S.String,
  ConformancePackStatusReason: S.optional(S.String),
  LastUpdateRequestedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastUpdateCompletedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ConformancePackStatusDetailsList = S.Array(
  ConformancePackStatusDetail,
);
export class OrganizationConfigRuleStatus extends S.Class<OrganizationConfigRuleStatus>(
  "OrganizationConfigRuleStatus",
)({
  OrganizationConfigRuleName: S.String,
  OrganizationRuleStatus: S.String,
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OrganizationConfigRuleStatuses = S.Array(
  OrganizationConfigRuleStatus,
);
export class OrganizationConformancePack extends S.Class<OrganizationConformancePack>(
  "OrganizationConformancePack",
)({
  OrganizationConformancePackName: S.String,
  OrganizationConformancePackArn: S.String,
  DeliveryS3Bucket: S.optional(S.String),
  DeliveryS3KeyPrefix: S.optional(S.String),
  ConformancePackInputParameters: S.optional(ConformancePackInputParameters),
  ExcludedAccounts: S.optional(ExcludedAccounts),
  LastUpdateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const OrganizationConformancePacks = S.Array(
  OrganizationConformancePack,
);
export class OrganizationConformancePackStatus extends S.Class<OrganizationConformancePackStatus>(
  "OrganizationConformancePackStatus",
)({
  OrganizationConformancePackName: S.String,
  Status: S.String,
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OrganizationConformancePackStatuses = S.Array(
  OrganizationConformancePackStatus,
);
export class PendingAggregationRequest extends S.Class<PendingAggregationRequest>(
  "PendingAggregationRequest",
)({
  RequesterAccountId: S.optional(S.String),
  RequesterAwsRegion: S.optional(S.String),
}) {}
export const PendingAggregationRequestList = S.Array(PendingAggregationRequest);
export class RemediationException extends S.Class<RemediationException>(
  "RemediationException",
)({
  ConfigRuleName: S.String,
  ResourceType: S.String,
  ResourceId: S.String,
  Message: S.optional(S.String),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RemediationExceptions = S.Array(RemediationException);
export const RetentionConfigurationList = S.Array(RetentionConfiguration);
export class ComplianceSummary extends S.Class<ComplianceSummary>(
  "ComplianceSummary",
)({
  CompliantResourceCount: S.optional(ComplianceContributorCount),
  NonCompliantResourceCount: S.optional(ComplianceContributorCount),
  ComplianceSummaryTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ComplianceSummaryByResourceType extends S.Class<ComplianceSummaryByResourceType>(
  "ComplianceSummaryByResourceType",
)({
  ResourceType: S.optional(S.String),
  ComplianceSummary: S.optional(ComplianceSummary),
}) {}
export const ComplianceSummariesByResourceType = S.Array(
  ComplianceSummaryByResourceType,
);
export class ConformancePackComplianceSummary extends S.Class<ConformancePackComplianceSummary>(
  "ConformancePackComplianceSummary",
)({
  ConformancePackName: S.String,
  ConformancePackComplianceStatus: S.String,
}) {}
export const ConformancePackComplianceSummaryList = S.Array(
  ConformancePackComplianceSummary,
);
export class ResourceCount extends S.Class<ResourceCount>("ResourceCount")({
  resourceType: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const ResourceCounts = S.Array(ResourceCount);
export class EvaluationStatus extends S.Class<EvaluationStatus>(
  "EvaluationStatus",
)({ Status: S.String, FailureReason: S.optional(S.String) }) {}
export const DiscoveredResourceIdentifierList = S.Array(
  AggregateResourceIdentifier,
);
export class ResourceIdentifier extends S.Class<ResourceIdentifier>(
  "ResourceIdentifier",
)({
  resourceType: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceName: S.optional(S.String),
  resourceDeletionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ResourceIdentifierList = S.Array(ResourceIdentifier);
export class ResourceEvaluationFilters extends S.Class<ResourceEvaluationFilters>(
  "ResourceEvaluationFilters",
)({
  EvaluationMode: S.optional(S.String),
  TimeWindow: S.optional(TimeWindow),
  EvaluationContextIdentifier: S.optional(S.String),
}) {}
export class StoredQueryMetadata extends S.Class<StoredQueryMetadata>(
  "StoredQueryMetadata",
)({
  QueryId: S.String,
  QueryArn: S.String,
  QueryName: S.String,
  Description: S.optional(S.String),
}) {}
export const StoredQueryMetadataList = S.Array(StoredQueryMetadata);
export class FailedRemediationExceptionBatch extends S.Class<FailedRemediationExceptionBatch>(
  "FailedRemediationExceptionBatch",
)({
  FailureMessage: S.optional(S.String),
  FailedItems: S.optional(RemediationExceptions),
}) {}
export const FailedRemediationExceptionBatches = S.Array(
  FailedRemediationExceptionBatch,
);
export class BaseConfigurationItem extends S.Class<BaseConfigurationItem>(
  "BaseConfigurationItem",
)({
  version: S.optional(S.String),
  accountId: S.optional(S.String),
  configurationItemCaptureTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  configurationItemStatus: S.optional(S.String),
  configurationStateId: S.optional(S.String),
  arn: S.optional(S.String),
  resourceType: S.optional(S.String),
  resourceId: S.optional(S.String),
  resourceName: S.optional(S.String),
  awsRegion: S.optional(S.String),
  availabilityZone: S.optional(S.String),
  resourceCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  configuration: S.optional(S.String),
  supplementaryConfiguration: S.optional(SupplementaryConfiguration),
  recordingFrequency: S.optional(S.String),
  configurationItemDeliveryTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BaseConfigurationItems = S.Array(BaseConfigurationItem);
export class BatchGetResourceConfigResponse extends S.Class<BatchGetResourceConfigResponse>(
  "BatchGetResourceConfigResponse",
)(
  {
    baseConfigurationItems: S.optional(BaseConfigurationItems),
    unprocessedResourceKeys: S.optional(ResourceKeys),
  },
  ns,
) {}
export class DescribeAggregationAuthorizationsResponse extends S.Class<DescribeAggregationAuthorizationsResponse>(
  "DescribeAggregationAuthorizationsResponse",
)(
  {
    AggregationAuthorizations: S.optional(AggregationAuthorizationList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeComplianceByResourceResponse extends S.Class<DescribeComplianceByResourceResponse>(
  "DescribeComplianceByResourceResponse",
)(
  {
    ComplianceByResources: S.optional(ComplianceByResources),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConfigRuleEvaluationStatusResponse extends S.Class<DescribeConfigRuleEvaluationStatusResponse>(
  "DescribeConfigRuleEvaluationStatusResponse",
)(
  {
    ConfigRulesEvaluationStatus: S.optional(ConfigRuleEvaluationStatusList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConfigRulesResponse extends S.Class<DescribeConfigRulesResponse>(
  "DescribeConfigRulesResponse",
)(
  { ConfigRules: S.optional(ConfigRules), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeConfigurationAggregatorsResponse extends S.Class<DescribeConfigurationAggregatorsResponse>(
  "DescribeConfigurationAggregatorsResponse",
)(
  {
    ConfigurationAggregators: S.optional(ConfigurationAggregatorList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConfigurationAggregatorSourcesStatusResponse extends S.Class<DescribeConfigurationAggregatorSourcesStatusResponse>(
  "DescribeConfigurationAggregatorSourcesStatusResponse",
)(
  {
    AggregatedSourceStatusList: S.optional(AggregatedSourceStatusList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConfigurationRecorderStatusResponse extends S.Class<DescribeConfigurationRecorderStatusResponse>(
  "DescribeConfigurationRecorderStatusResponse",
)(
  { ConfigurationRecordersStatus: S.optional(ConfigurationRecorderStatusList) },
  ns,
) {}
export class DescribeConformancePacksResponse extends S.Class<DescribeConformancePacksResponse>(
  "DescribeConformancePacksResponse",
)(
  {
    ConformancePackDetails: S.optional(ConformancePackDetailList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConformancePackStatusResponse extends S.Class<DescribeConformancePackStatusResponse>(
  "DescribeConformancePackStatusResponse",
)(
  {
    ConformancePackStatusDetails: S.optional(ConformancePackStatusDetailsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeOrganizationConfigRuleStatusesResponse extends S.Class<DescribeOrganizationConfigRuleStatusesResponse>(
  "DescribeOrganizationConfigRuleStatusesResponse",
)(
  {
    OrganizationConfigRuleStatuses: S.optional(OrganizationConfigRuleStatuses),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeOrganizationConformancePacksResponse extends S.Class<DescribeOrganizationConformancePacksResponse>(
  "DescribeOrganizationConformancePacksResponse",
)(
  {
    OrganizationConformancePacks: S.optional(OrganizationConformancePacks),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeOrganizationConformancePackStatusesResponse extends S.Class<DescribeOrganizationConformancePackStatusesResponse>(
  "DescribeOrganizationConformancePackStatusesResponse",
)(
  {
    OrganizationConformancePackStatuses: S.optional(
      OrganizationConformancePackStatuses,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribePendingAggregationRequestsResponse extends S.Class<DescribePendingAggregationRequestsResponse>(
  "DescribePendingAggregationRequestsResponse",
)(
  {
    PendingAggregationRequests: S.optional(PendingAggregationRequestList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRemediationExceptionsResponse extends S.Class<DescribeRemediationExceptionsResponse>(
  "DescribeRemediationExceptionsResponse",
)(
  {
    RemediationExceptions: S.optional(RemediationExceptions),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRetentionConfigurationsResponse extends S.Class<DescribeRetentionConfigurationsResponse>(
  "DescribeRetentionConfigurationsResponse",
)(
  {
    RetentionConfigurations: S.optional(RetentionConfigurationList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetComplianceDetailsByConfigRuleResponse extends S.Class<GetComplianceDetailsByConfigRuleResponse>(
  "GetComplianceDetailsByConfigRuleResponse",
)(
  {
    EvaluationResults: S.optional(EvaluationResults),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetComplianceSummaryByConfigRuleResponse extends S.Class<GetComplianceSummaryByConfigRuleResponse>(
  "GetComplianceSummaryByConfigRuleResponse",
)({ ComplianceSummary: S.optional(ComplianceSummary) }, ns) {}
export class GetComplianceSummaryByResourceTypeResponse extends S.Class<GetComplianceSummaryByResourceTypeResponse>(
  "GetComplianceSummaryByResourceTypeResponse",
)(
  {
    ComplianceSummariesByResourceType: S.optional(
      ComplianceSummariesByResourceType,
    ),
  },
  ns,
) {}
export class GetConformancePackComplianceSummaryResponse extends S.Class<GetConformancePackComplianceSummaryResponse>(
  "GetConformancePackComplianceSummaryResponse",
)(
  {
    ConformancePackComplianceSummaryList: S.optional(
      ConformancePackComplianceSummaryList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetDiscoveredResourceCountsResponse extends S.Class<GetDiscoveredResourceCountsResponse>(
  "GetDiscoveredResourceCountsResponse",
)(
  {
    totalDiscoveredResources: S.optional(S.Number),
    resourceCounts: S.optional(ResourceCounts),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetResourceEvaluationSummaryResponse extends S.Class<GetResourceEvaluationSummaryResponse>(
  "GetResourceEvaluationSummaryResponse",
)(
  {
    ResourceEvaluationId: S.optional(S.String),
    EvaluationMode: S.optional(S.String),
    EvaluationStatus: S.optional(EvaluationStatus),
    EvaluationStartTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Compliance: S.optional(S.String),
    EvaluationContext: S.optional(EvaluationContext),
    ResourceDetails: S.optional(ResourceDetails),
  },
  ns,
) {}
export class ListAggregateDiscoveredResourcesResponse extends S.Class<ListAggregateDiscoveredResourcesResponse>(
  "ListAggregateDiscoveredResourcesResponse",
)(
  {
    ResourceIdentifiers: S.optional(DiscoveredResourceIdentifierList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDiscoveredResourcesResponse extends S.Class<ListDiscoveredResourcesResponse>(
  "ListDiscoveredResourcesResponse",
)(
  {
    resourceIdentifiers: S.optional(ResourceIdentifierList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListResourceEvaluationsRequest extends S.Class<ListResourceEvaluationsRequest>(
  "ListResourceEvaluationsRequest",
)(
  {
    Filters: S.optional(ResourceEvaluationFilters),
    Limit: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStoredQueriesResponse extends S.Class<ListStoredQueriesResponse>(
  "ListStoredQueriesResponse",
)(
  {
    StoredQueryMetadata: S.optional(StoredQueryMetadataList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutAggregationAuthorizationResponse extends S.Class<PutAggregationAuthorizationResponse>(
  "PutAggregationAuthorizationResponse",
)({ AggregationAuthorization: S.optional(AggregationAuthorization) }, ns) {}
export class PutConfigurationAggregatorRequest extends S.Class<PutConfigurationAggregatorRequest>(
  "PutConfigurationAggregatorRequest",
)(
  {
    ConfigurationAggregatorName: S.String,
    AccountAggregationSources: S.optional(AccountAggregationSourceList),
    OrganizationAggregationSource: S.optional(OrganizationAggregationSource),
    Tags: S.optional(TagsList),
    AggregatorFilters: S.optional(AggregatorFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutConformancePackResponse extends S.Class<PutConformancePackResponse>(
  "PutConformancePackResponse",
)({ ConformancePackArn: S.optional(S.String) }, ns) {}
export class PutDeliveryChannelRequest extends S.Class<PutDeliveryChannelRequest>(
  "PutDeliveryChannelRequest",
)(
  { DeliveryChannel: DeliveryChannel },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDeliveryChannelResponse extends S.Class<PutDeliveryChannelResponse>(
  "PutDeliveryChannelResponse",
)({}, ns) {}
export class PutEvaluationsResponse extends S.Class<PutEvaluationsResponse>(
  "PutEvaluationsResponse",
)({ FailedEvaluations: S.optional(Evaluations) }, ns) {}
export class PutOrganizationConfigRuleResponse extends S.Class<PutOrganizationConfigRuleResponse>(
  "PutOrganizationConfigRuleResponse",
)({ OrganizationConfigRuleArn: S.optional(S.String) }, ns) {}
export class PutRemediationExceptionsResponse extends S.Class<PutRemediationExceptionsResponse>(
  "PutRemediationExceptionsResponse",
)({ FailedBatches: S.optional(FailedRemediationExceptionBatches) }, ns) {}
export class PutStoredQueryResponse extends S.Class<PutStoredQueryResponse>(
  "PutStoredQueryResponse",
)({ QueryArn: S.optional(S.String) }, ns) {}
export class StartResourceEvaluationResponse extends S.Class<StartResourceEvaluationResponse>(
  "StartResourceEvaluationResponse",
)({ ResourceEvaluationId: S.optional(S.String) }, ns) {}
export const ControlsList = S.Array(S.String);
export class ConfigExportDeliveryInfo extends S.Class<ConfigExportDeliveryInfo>(
  "ConfigExportDeliveryInfo",
)({
  lastStatus: S.optional(S.String),
  lastErrorCode: S.optional(S.String),
  lastErrorMessage: S.optional(S.String),
  lastAttemptTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastSuccessfulTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  nextDeliveryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ConfigStreamDeliveryInfo extends S.Class<ConfigStreamDeliveryInfo>(
  "ConfigStreamDeliveryInfo",
)({
  lastStatus: S.optional(S.String),
  lastErrorCode: S.optional(S.String),
  lastErrorMessage: S.optional(S.String),
  lastStatusChangeTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class OrganizationCustomPolicyRuleMetadataNoPolicy extends S.Class<OrganizationCustomPolicyRuleMetadataNoPolicy>(
  "OrganizationCustomPolicyRuleMetadataNoPolicy",
)({
  Description: S.optional(S.String),
  OrganizationConfigRuleTriggerTypes: S.optional(
    OrganizationConfigRuleTriggerTypeNoSNs,
  ),
  InputParameters: S.optional(S.String),
  MaximumExecutionFrequency: S.optional(S.String),
  ResourceTypesScope: S.optional(ResourceTypesScope),
  ResourceIdScope: S.optional(S.String),
  TagKeyScope: S.optional(S.String),
  TagValueScope: S.optional(S.String),
  PolicyRuntime: S.optional(S.String),
  DebugLogDeliveryAccounts: S.optional(DebugLogDeliveryAccounts),
}) {}
export class RemediationExecutionStep extends S.Class<RemediationExecutionStep>(
  "RemediationExecutionStep",
)({
  Name: S.optional(S.String),
  State: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RemediationExecutionSteps = S.Array(RemediationExecutionStep);
export class FailedDeleteRemediationExceptionsBatch extends S.Class<FailedDeleteRemediationExceptionsBatch>(
  "FailedDeleteRemediationExceptionsBatch",
)({
  FailureMessage: S.optional(S.String),
  FailedItems: S.optional(RemediationExceptionResourceKeys),
}) {}
export const FailedDeleteRemediationExceptionsBatches = S.Array(
  FailedDeleteRemediationExceptionsBatch,
);
export class AggregateComplianceByConfigRule extends S.Class<AggregateComplianceByConfigRule>(
  "AggregateComplianceByConfigRule",
)({
  ConfigRuleName: S.optional(S.String),
  Compliance: S.optional(Compliance),
  AccountId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
}) {}
export const AggregateComplianceByConfigRuleList = S.Array(
  AggregateComplianceByConfigRule,
);
export class ComplianceByConfigRule extends S.Class<ComplianceByConfigRule>(
  "ComplianceByConfigRule",
)({
  ConfigRuleName: S.optional(S.String),
  Compliance: S.optional(Compliance),
}) {}
export const ComplianceByConfigRules = S.Array(ComplianceByConfigRule);
export class ConformancePackRuleCompliance extends S.Class<ConformancePackRuleCompliance>(
  "ConformancePackRuleCompliance",
)({
  ConfigRuleName: S.optional(S.String),
  ComplianceType: S.optional(S.String),
  Controls: S.optional(ControlsList),
}) {}
export const ConformancePackRuleComplianceList = S.Array(
  ConformancePackRuleCompliance,
);
export class DeliveryChannelStatus extends S.Class<DeliveryChannelStatus>(
  "DeliveryChannelStatus",
)({
  name: S.optional(S.String),
  configSnapshotDeliveryInfo: S.optional(ConfigExportDeliveryInfo),
  configHistoryDeliveryInfo: S.optional(ConfigExportDeliveryInfo),
  configStreamDeliveryInfo: S.optional(ConfigStreamDeliveryInfo),
}) {}
export const DeliveryChannelStatusList = S.Array(DeliveryChannelStatus);
export class OrganizationConfigRule extends S.Class<OrganizationConfigRule>(
  "OrganizationConfigRule",
)({
  OrganizationConfigRuleName: S.String,
  OrganizationConfigRuleArn: S.String,
  OrganizationManagedRuleMetadata: S.optional(OrganizationManagedRuleMetadata),
  OrganizationCustomRuleMetadata: S.optional(OrganizationCustomRuleMetadata),
  ExcludedAccounts: S.optional(ExcludedAccounts),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OrganizationCustomPolicyRuleMetadata: S.optional(
    OrganizationCustomPolicyRuleMetadataNoPolicy,
  ),
}) {}
export const OrganizationConfigRules = S.Array(OrganizationConfigRule);
export class RemediationExecutionStatus extends S.Class<RemediationExecutionStatus>(
  "RemediationExecutionStatus",
)({
  ResourceKey: S.optional(ResourceKey),
  State: S.optional(S.String),
  StepDetails: S.optional(RemediationExecutionSteps),
  InvocationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const RemediationExecutionStatuses = S.Array(RemediationExecutionStatus);
export class AggregateComplianceCount extends S.Class<AggregateComplianceCount>(
  "AggregateComplianceCount",
)({
  GroupName: S.optional(S.String),
  ComplianceSummary: S.optional(ComplianceSummary),
}) {}
export const AggregateComplianceCountList = S.Array(AggregateComplianceCount);
export class GroupedResourceCount extends S.Class<GroupedResourceCount>(
  "GroupedResourceCount",
)({ GroupName: S.String, ResourceCount: S.Number }) {}
export const GroupedResourceCountList = S.Array(GroupedResourceCount);
export class ConformancePackEvaluationResult extends S.Class<ConformancePackEvaluationResult>(
  "ConformancePackEvaluationResult",
)({
  ComplianceType: S.String,
  EvaluationResultIdentifier: EvaluationResultIdentifier,
  ConfigRuleInvokedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ResultRecordedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Annotation: S.optional(S.String),
}) {}
export const ConformancePackRuleEvaluationResultsList = S.Array(
  ConformancePackEvaluationResult,
);
export class MemberAccountStatus extends S.Class<MemberAccountStatus>(
  "MemberAccountStatus",
)({
  AccountId: S.String,
  ConfigRuleName: S.String,
  MemberAccountRuleStatus: S.String,
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OrganizationConfigRuleDetailedStatus =
  S.Array(MemberAccountStatus);
export class OrganizationConformancePackDetailedStatus extends S.Class<OrganizationConformancePackDetailedStatus>(
  "OrganizationConformancePackDetailedStatus",
)({
  AccountId: S.String,
  ConformancePackName: S.String,
  Status: S.String,
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OrganizationConformancePackDetailedStatuses = S.Array(
  OrganizationConformancePackDetailedStatus,
);
export class ConfigurationRecorderSummary extends S.Class<ConfigurationRecorderSummary>(
  "ConfigurationRecorderSummary",
)({
  arn: S.String,
  name: S.String,
  servicePrincipal: S.optional(S.String),
  recordingScope: S.String,
}) {}
export const ConfigurationRecorderSummaries = S.Array(
  ConfigurationRecorderSummary,
);
export class ConformancePackComplianceScore extends S.Class<ConformancePackComplianceScore>(
  "ConformancePackComplianceScore",
)({
  Score: S.optional(S.String),
  ConformancePackName: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ConformancePackComplianceScores = S.Array(
  ConformancePackComplianceScore,
);
export class BatchGetAggregateResourceConfigResponse extends S.Class<BatchGetAggregateResourceConfigResponse>(
  "BatchGetAggregateResourceConfigResponse",
)(
  {
    BaseConfigurationItems: S.optional(BaseConfigurationItems),
    UnprocessedResourceIdentifiers: S.optional(
      UnprocessedResourceIdentifierList,
    ),
  },
  ns,
) {}
export class DeleteRemediationExceptionsResponse extends S.Class<DeleteRemediationExceptionsResponse>(
  "DeleteRemediationExceptionsResponse",
)(
  { FailedBatches: S.optional(FailedDeleteRemediationExceptionsBatches) },
  ns,
) {}
export class DescribeAggregateComplianceByConfigRulesResponse extends S.Class<DescribeAggregateComplianceByConfigRulesResponse>(
  "DescribeAggregateComplianceByConfigRulesResponse",
)(
  {
    AggregateComplianceByConfigRules: S.optional(
      AggregateComplianceByConfigRuleList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeComplianceByConfigRuleResponse extends S.Class<DescribeComplianceByConfigRuleResponse>(
  "DescribeComplianceByConfigRuleResponse",
)(
  {
    ComplianceByConfigRules: S.optional(ComplianceByConfigRules),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConformancePackComplianceResponse extends S.Class<DescribeConformancePackComplianceResponse>(
  "DescribeConformancePackComplianceResponse",
)(
  {
    ConformancePackName: S.String,
    ConformancePackRuleComplianceList: ConformancePackRuleComplianceList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDeliveryChannelStatusResponse extends S.Class<DescribeDeliveryChannelStatusResponse>(
  "DescribeDeliveryChannelStatusResponse",
)({ DeliveryChannelsStatus: S.optional(DeliveryChannelStatusList) }, ns) {}
export class DescribeOrganizationConfigRulesResponse extends S.Class<DescribeOrganizationConfigRulesResponse>(
  "DescribeOrganizationConfigRulesResponse",
)(
  {
    OrganizationConfigRules: S.optional(OrganizationConfigRules),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRemediationExecutionStatusResponse extends S.Class<DescribeRemediationExecutionStatusResponse>(
  "DescribeRemediationExecutionStatusResponse",
)(
  {
    RemediationExecutionStatuses: S.optional(RemediationExecutionStatuses),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetAggregateConfigRuleComplianceSummaryResponse extends S.Class<GetAggregateConfigRuleComplianceSummaryResponse>(
  "GetAggregateConfigRuleComplianceSummaryResponse",
)(
  {
    GroupByKey: S.optional(S.String),
    AggregateComplianceCounts: S.optional(AggregateComplianceCountList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetAggregateDiscoveredResourceCountsResponse extends S.Class<GetAggregateDiscoveredResourceCountsResponse>(
  "GetAggregateDiscoveredResourceCountsResponse",
)(
  {
    TotalDiscoveredResources: S.Number,
    GroupByKey: S.optional(S.String),
    GroupedResourceCounts: S.optional(GroupedResourceCountList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetAggregateResourceConfigResponse extends S.Class<GetAggregateResourceConfigResponse>(
  "GetAggregateResourceConfigResponse",
)({ ConfigurationItem: S.optional(ConfigurationItem) }, ns) {}
export class GetConformancePackComplianceDetailsResponse extends S.Class<GetConformancePackComplianceDetailsResponse>(
  "GetConformancePackComplianceDetailsResponse",
)(
  {
    ConformancePackName: S.String,
    ConformancePackRuleEvaluationResults: S.optional(
      ConformancePackRuleEvaluationResultsList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetOrganizationConfigRuleDetailedStatusResponse extends S.Class<GetOrganizationConfigRuleDetailedStatusResponse>(
  "GetOrganizationConfigRuleDetailedStatusResponse",
)(
  {
    OrganizationConfigRuleDetailedStatus: S.optional(
      OrganizationConfigRuleDetailedStatus,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetOrganizationConformancePackDetailedStatusResponse extends S.Class<GetOrganizationConformancePackDetailedStatusResponse>(
  "GetOrganizationConformancePackDetailedStatusResponse",
)(
  {
    OrganizationConformancePackDetailedStatuses: S.optional(
      OrganizationConformancePackDetailedStatuses,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListConfigurationRecordersResponse extends S.Class<ListConfigurationRecordersResponse>(
  "ListConfigurationRecordersResponse",
)(
  {
    ConfigurationRecorderSummaries: ConfigurationRecorderSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListConformancePackComplianceScoresResponse extends S.Class<ListConformancePackComplianceScoresResponse>(
  "ListConformancePackComplianceScoresResponse",
)(
  {
    NextToken: S.optional(S.String),
    ConformancePackComplianceScores: ConformancePackComplianceScores,
  },
  ns,
) {}
export class PutConfigRuleRequest extends S.Class<PutConfigRuleRequest>(
  "PutConfigRuleRequest",
)(
  { ConfigRule: ConfigRule, Tags: S.optional(TagsList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutConfigRuleResponse extends S.Class<PutConfigRuleResponse>(
  "PutConfigRuleResponse",
)({}, ns) {}
export class PutConfigurationAggregatorResponse extends S.Class<PutConfigurationAggregatorResponse>(
  "PutConfigurationAggregatorResponse",
)({ ConfigurationAggregator: S.optional(ConfigurationAggregator) }, ns) {}
export class PutConfigurationRecorderRequest extends S.Class<PutConfigurationRecorderRequest>(
  "PutConfigurationRecorderRequest",
)(
  { ConfigurationRecorder: ConfigurationRecorder, Tags: S.optional(TagsList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutConfigurationRecorderResponse extends S.Class<PutConfigurationRecorderResponse>(
  "PutConfigurationRecorderResponse",
)({}, ns) {}
export class SelectAggregateResourceConfigResponse extends S.Class<SelectAggregateResourceConfigResponse>(
  "SelectAggregateResourceConfigResponse",
)(
  {
    Results: S.optional(Results),
    QueryInfo: S.optional(QueryInfo),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class AggregateConformancePackCompliance extends S.Class<AggregateConformancePackCompliance>(
  "AggregateConformancePackCompliance",
)({
  ComplianceType: S.optional(S.String),
  CompliantRuleCount: S.optional(S.Number),
  NonCompliantRuleCount: S.optional(S.Number),
  TotalRuleCount: S.optional(S.Number),
}) {}
export class AggregateConformancePackComplianceCount extends S.Class<AggregateConformancePackComplianceCount>(
  "AggregateConformancePackComplianceCount",
)({
  CompliantConformancePackCount: S.optional(S.Number),
  NonCompliantConformancePackCount: S.optional(S.Number),
}) {}
export class AggregateComplianceByConformancePack extends S.Class<AggregateComplianceByConformancePack>(
  "AggregateComplianceByConformancePack",
)({
  ConformancePackName: S.optional(S.String),
  Compliance: S.optional(AggregateConformancePackCompliance),
  AccountId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
}) {}
export const AggregateComplianceByConformancePackList = S.Array(
  AggregateComplianceByConformancePack,
);
export class AggregateEvaluationResult extends S.Class<AggregateEvaluationResult>(
  "AggregateEvaluationResult",
)({
  EvaluationResultIdentifier: S.optional(EvaluationResultIdentifier),
  ComplianceType: S.optional(S.String),
  ResultRecordedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ConfigRuleInvokedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Annotation: S.optional(S.String),
  AccountId: S.optional(S.String),
  AwsRegion: S.optional(S.String),
}) {}
export const AggregateEvaluationResultList = S.Array(AggregateEvaluationResult);
export class AggregateConformancePackComplianceSummary extends S.Class<AggregateConformancePackComplianceSummary>(
  "AggregateConformancePackComplianceSummary",
)({
  ComplianceSummary: S.optional(AggregateConformancePackComplianceCount),
  GroupName: S.optional(S.String),
}) {}
export const AggregateConformancePackComplianceSummaryList = S.Array(
  AggregateConformancePackComplianceSummary,
);
export class ResourceEvaluation extends S.Class<ResourceEvaluation>(
  "ResourceEvaluation",
)({
  ResourceEvaluationId: S.optional(S.String),
  EvaluationMode: S.optional(S.String),
  EvaluationStartTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ResourceEvaluations = S.Array(ResourceEvaluation);
export class DescribeAggregateComplianceByConformancePacksResponse extends S.Class<DescribeAggregateComplianceByConformancePacksResponse>(
  "DescribeAggregateComplianceByConformancePacksResponse",
)(
  {
    AggregateComplianceByConformancePacks: S.optional(
      AggregateComplianceByConformancePackList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetAggregateComplianceDetailsByConfigRuleResponse extends S.Class<GetAggregateComplianceDetailsByConfigRuleResponse>(
  "GetAggregateComplianceDetailsByConfigRuleResponse",
)(
  {
    AggregateEvaluationResults: S.optional(AggregateEvaluationResultList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetAggregateConformancePackComplianceSummaryResponse extends S.Class<GetAggregateConformancePackComplianceSummaryResponse>(
  "GetAggregateConformancePackComplianceSummaryResponse",
)(
  {
    AggregateConformancePackComplianceSummaries: S.optional(
      AggregateConformancePackComplianceSummaryList,
    ),
    GroupByKey: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListResourceEvaluationsResponse extends S.Class<ListResourceEvaluationsResponse>(
  "ListResourceEvaluationsResponse",
)(
  {
    ResourceEvaluations: S.optional(ResourceEvaluations),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutRemediationConfigurationsRequest extends S.Class<PutRemediationConfigurationsRequest>(
  "PutRemediationConfigurationsRequest",
)(
  { RemediationConfigurations: RemediationConfigurations },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailedRemediationBatch extends S.Class<FailedRemediationBatch>(
  "FailedRemediationBatch",
)({
  FailureMessage: S.optional(S.String),
  FailedItems: S.optional(RemediationConfigurations),
}) {}
export const FailedRemediationBatches = S.Array(FailedRemediationBatch);
export class PutRemediationConfigurationsResponse extends S.Class<PutRemediationConfigurationsResponse>(
  "PutRemediationConfigurationsResponse",
)({ FailedBatches: S.optional(FailedRemediationBatches) }, ns) {}

//# Errors
export class NoSuchConfigRuleException extends S.TaggedError<NoSuchConfigRuleException>()(
  "NoSuchConfigRuleException",
  {},
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
) {}
export class NoSuchConfigurationRecorderException extends S.TaggedError<NoSuchConfigurationRecorderException>()(
  "NoSuchConfigurationRecorderException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class NoSuchConfigurationAggregatorException extends S.TaggedError<NoSuchConfigurationAggregatorException>()(
  "NoSuchConfigurationAggregatorException",
  { message: S.optional(S.String) },
) {}
export class UnmodifiableEntityException extends S.TaggedError<UnmodifiableEntityException>()(
  "UnmodifiableEntityException",
  {},
) {}
export class NoSuchConformancePackException extends S.TaggedError<NoSuchConformancePackException>()(
  "NoSuchConformancePackException",
  { message: S.optional(S.String) },
) {}
export class LastDeliveryChannelDeleteFailedException extends S.TaggedError<LastDeliveryChannelDeleteFailedException>()(
  "LastDeliveryChannelDeleteFailedException",
  { message: S.optional(S.String) },
) {}
export class NoSuchOrganizationConfigRuleException extends S.TaggedError<NoSuchOrganizationConfigRuleException>()(
  "NoSuchOrganizationConfigRuleException",
  { message: S.optional(S.String) },
) {}
export class NoSuchOrganizationConformancePackException extends S.TaggedError<NoSuchOrganizationConformancePackException>()(
  "NoSuchOrganizationConformancePackException",
  { message: S.optional(S.String) },
) {}
export class OrganizationAccessDeniedException extends S.TaggedError<OrganizationAccessDeniedException>()(
  "OrganizationAccessDeniedException",
  {},
) {}
export class InsufficientPermissionsException extends S.TaggedError<InsufficientPermissionsException>()(
  "InsufficientPermissionsException",
  { message: S.optional(S.String) },
) {}
export class NoRunningConfigurationRecorderException extends S.TaggedError<NoRunningConfigurationRecorderException>()(
  "NoRunningConfigurationRecorderException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class NoSuchRetentionConfigurationException extends S.TaggedError<NoSuchRetentionConfigurationException>()(
  "NoSuchRetentionConfigurationException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class NoSuchDeliveryChannelException extends S.TaggedError<NoSuchDeliveryChannelException>()(
  "NoSuchDeliveryChannelException",
  {},
) {}
export class InvalidLimitException extends S.TaggedError<InvalidLimitException>()(
  "InvalidLimitException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class NoAvailableDeliveryChannelException extends S.TaggedError<NoAvailableDeliveryChannelException>()(
  "NoAvailableDeliveryChannelException",
  { message: S.optional(S.String) },
) {}
export class NoSuchRemediationConfigurationException extends S.TaggedError<NoSuchRemediationConfigurationException>()(
  "NoSuchRemediationConfigurationException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class NoAvailableConfigurationRecorderException extends S.TaggedError<NoAvailableConfigurationRecorderException>()(
  "NoAvailableConfigurationRecorderException",
  {},
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  {},
) {}
export class MaxNumberOfOrganizationConformancePacksExceededException extends S.TaggedError<MaxNumberOfOrganizationConformancePacksExceededException>()(
  "MaxNumberOfOrganizationConformancePacksExceededException",
  { message: S.optional(S.String) },
) {}
export class MaxActiveResourcesExceededException extends S.TaggedError<MaxActiveResourcesExceededException>()(
  "MaxActiveResourcesExceededException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfRetentionConfigurationsExceededException extends S.TaggedError<MaxNumberOfRetentionConfigurationsExceededException>()(
  "MaxNumberOfRetentionConfigurationsExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidExpressionException extends S.TaggedError<InvalidExpressionException>()(
  "InvalidExpressionException",
  { message: S.optional(S.String) },
) {}
export class RemediationInProgressException extends S.TaggedError<RemediationInProgressException>()(
  "RemediationInProgressException",
  { message: S.optional(S.String) },
) {}
export class NoSuchConfigRuleInConformancePackException extends S.TaggedError<NoSuchConfigRuleInConformancePackException>()(
  "NoSuchConfigRuleInConformancePackException",
  {},
) {}
export class InvalidTimeRangeException extends S.TaggedError<InvalidTimeRangeException>()(
  "InvalidTimeRangeException",
  { message: S.optional(S.String) },
) {}
export class ConformancePackTemplateValidationException extends S.TaggedError<ConformancePackTemplateValidationException>()(
  "ConformancePackTemplateValidationException",
  { message: S.optional(S.String) },
) {}
export class InsufficientDeliveryPolicyException extends S.TaggedError<InsufficientDeliveryPolicyException>()(
  "InsufficientDeliveryPolicyException",
  { message: S.optional(S.String) },
) {}
export class InvalidResultTokenException extends S.TaggedError<InvalidResultTokenException>()(
  "InvalidResultTokenException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfOrganizationConfigRulesExceededException extends S.TaggedError<MaxNumberOfOrganizationConfigRulesExceededException>()(
  "MaxNumberOfOrganizationConfigRulesExceededException",
  { message: S.optional(S.String) },
) {}
export class NoAvailableOrganizationException extends S.TaggedError<NoAvailableOrganizationException>()(
  "NoAvailableOrganizationException",
  {},
) {}
export class OrganizationAllFeaturesNotEnabledException extends S.TaggedError<OrganizationAllFeaturesNotEnabledException>()(
  "OrganizationAllFeaturesNotEnabledException",
  {},
) {}
export class ResourceConcurrentModificationException extends S.TaggedError<ResourceConcurrentModificationException>()(
  "ResourceConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatch extends S.TaggedError<IdempotentParameterMismatch>()(
  "IdempotentParameterMismatch",
  { message: S.optional(S.String) },
) {}
export class NoSuchRemediationExceptionException extends S.TaggedError<NoSuchRemediationExceptionException>()(
  "NoSuchRemediationExceptionException",
  { message: S.optional(S.String) },
) {}
export class OversizedConfigurationItemException extends S.TaggedError<OversizedConfigurationItemException>()(
  "OversizedConfigurationItemException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotDiscoveredException extends S.TaggedError<ResourceNotDiscoveredException>()(
  "ResourceNotDiscoveredException",
  {},
) {}
export class MaxNumberOfConfigRulesExceededException extends S.TaggedError<MaxNumberOfConfigRulesExceededException>()(
  "MaxNumberOfConfigRulesExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidRoleException extends S.TaggedError<InvalidRoleException>()(
  "InvalidRoleException",
  { message: S.optional(S.String) },
) {}
export class InvalidConfigurationRecorderNameException extends S.TaggedError<InvalidConfigurationRecorderNameException>()(
  "InvalidConfigurationRecorderNameException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfConformancePacksExceededException extends S.TaggedError<MaxNumberOfConformancePacksExceededException>()(
  "MaxNumberOfConformancePacksExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeliveryChannelNameException extends S.TaggedError<InvalidDeliveryChannelNameException>()(
  "InvalidDeliveryChannelNameException",
  { message: S.optional(S.String) },
) {}
export class OrganizationConformancePackTemplateValidationException extends S.TaggedError<OrganizationConformancePackTemplateValidationException>()(
  "OrganizationConformancePackTemplateValidationException",
  { message: S.optional(S.String) },
) {}
export class InvalidRecordingGroupException extends S.TaggedError<InvalidRecordingGroupException>()(
  "InvalidRecordingGroupException",
  { message: S.optional(S.String) },
) {}
export class InvalidS3KeyPrefixException extends S.TaggedError<InvalidS3KeyPrefixException>()(
  "InvalidS3KeyPrefixException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfConfigurationRecordersExceededException extends S.TaggedError<MaxNumberOfConfigurationRecordersExceededException>()(
  "MaxNumberOfConfigurationRecordersExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidS3KmsKeyArnException extends S.TaggedError<InvalidS3KmsKeyArnException>()(
  "InvalidS3KmsKeyArnException",
  { message: S.optional(S.String) },
) {}
export class InvalidSNSTopicARNException extends S.TaggedError<InvalidSNSTopicARNException>()(
  "InvalidSNSTopicARNException",
  { message: S.optional(S.String) },
) {}
export class MaxNumberOfDeliveryChannelsExceededException extends S.TaggedError<MaxNumberOfDeliveryChannelsExceededException>()(
  "MaxNumberOfDeliveryChannelsExceededException",
  { message: S.optional(S.String) },
) {}
export class NoSuchBucketException extends S.TaggedError<NoSuchBucketException>()(
  "NoSuchBucketException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes pending authorization requests for a specified
 * aggregator account in a specified region.
 */
export const deletePendingAggregationRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePendingAggregationRequestRequest,
    output: DeletePendingAggregationRequestResponse,
    errors: [InvalidParameterValueException],
  }));
/**
 * Deletes the authorization granted to the specified
 * configuration aggregator account in a specified region.
 */
export const deleteAggregationAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAggregationAuthorizationRequest,
    output: DeleteAggregationAuthorizationResponse,
    errors: [InvalidParameterValueException],
  }));
/**
 * Deletes the specified Config rule and all of its evaluation
 * results.
 *
 * Config sets the state of a rule to `DELETING`
 * until the deletion is complete. You cannot update a rule while it is
 * in this state. If you make a `PutConfigRule` or
 * `DeleteConfigRule` request for the rule, you will
 * receive a `ResourceInUseException`.
 *
 * You can check the state of a rule by using the
 * `DescribeConfigRules` request.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteConfigRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigRuleRequest,
  output: DeleteConfigRuleResponse,
  errors: [NoSuchConfigRuleException, ResourceInUseException],
}));
/**
 * Deletes the specified configuration aggregator and the
 * aggregated data associated with the aggregator.
 */
export const deleteConfigurationAggregator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfigurationAggregatorRequest,
    output: DeleteConfigurationAggregatorResponse,
    errors: [NoSuchConfigurationAggregatorException],
  }));
/**
 * Deletes the customer managed configuration recorder.
 *
 * This operation does not delete the configuration information that
 * was previously recorded. You will be able to access the previously
 * recorded information by using the
 * GetResourceConfigHistory operation, but you will not
 * be able to access this information in the Config console until
 * you have created a new customer managed configuration recorder.
 */
export const deleteConfigurationRecorder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationRecorderRequest,
    output: DeleteConfigurationRecorderResponse,
    errors: [NoSuchConfigurationRecorderException, UnmodifiableEntityException],
  }),
);
/**
 * Deletes the specified conformance pack and all the Config rules, remediation actions, and all evaluation results within that
 * conformance pack.
 *
 * Config sets the conformance pack to `DELETE_IN_PROGRESS` until the deletion is complete.
 * You cannot update a conformance pack while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteConformancePack = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConformancePackRequest,
    output: DeleteConformancePackResponse,
    errors: [NoSuchConformancePackException, ResourceInUseException],
  }),
);
/**
 * Deletes the evaluation results for the specified Config
 * rule. You can specify one Config rule per request. After you
 * delete the evaluation results, you can call the StartConfigRulesEvaluation API to start evaluating
 * your Amazon Web Services resources against the rule.
 */
export const deleteEvaluationResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEvaluationResultsRequest,
    output: DeleteEvaluationResultsResponse,
    errors: [NoSuchConfigRuleException, ResourceInUseException],
  }),
);
/**
 * Deletes the specified organization conformance pack and all of the Config rules and remediation actions from
 * all member accounts in that organization.
 *
 * Only a management account or a delegated administrator account can delete an organization conformance pack.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added.
 *
 * Config sets the state of a conformance pack to DELETE_IN_PROGRESS until the deletion is complete.
 * You cannot update a conformance pack while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteOrganizationConformancePack =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteOrganizationConformancePackRequest,
    output: DeleteOrganizationConformancePackResponse,
    errors: [
      NoSuchOrganizationConformancePackException,
      OrganizationAccessDeniedException,
      ResourceInUseException,
    ],
  }));
/**
 * Records the configuration state for a custom resource that has been deleted. This API records a new ConfigurationItem with a ResourceDeleted status. You can retrieve the ConfigurationItems recorded for this resource in your Config History.
 */
export const deleteResourceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourceConfigRequest,
    output: DeleteResourceConfigResponse,
    errors: [NoRunningConfigurationRecorderException, ValidationException],
  }),
);
/**
 * Deletes the retention configuration.
 */
export const deleteRetentionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRetentionConfigurationRequest,
    output: DeleteRetentionConfigurationResponse,
    errors: [
      InvalidParameterValueException,
      NoSuchRetentionConfigurationException,
    ],
  }));
/**
 * Deletes an existing service-linked configuration recorder.
 *
 * This operation does not delete the configuration information that was previously recorded. You will be able to access the previously
 * recorded information by using the
 * GetResourceConfigHistory operation, but you will not
 * be able to access this information in the Config console until
 * you have created a new service-linked configuration recorder for the same service.
 *
 * **The recording scope determines if you receive configuration items**
 *
 * The recording scope is set by the service that is linked to the configuration recorder and determines whether you receive configuration items (CIs) in the delivery channel. If the recording scope is internal, you will not receive CIs in the delivery channel.
 */
export const deleteServiceLinkedConfigurationRecorder =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceLinkedConfigurationRecorderRequest,
    output: DeleteServiceLinkedConfigurationRecorderResponse,
    errors: [
      ConflictException,
      NoSuchConfigurationRecorderException,
      ValidationException,
    ],
  }));
/**
 * Deletes the stored query for a single Amazon Web Services account and a single Amazon Web Services Region.
 */
export const deleteStoredQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStoredQueryRequest,
  output: DeleteStoredQueryResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns details for the configuration recorder you specify.
 *
 * If a configuration recorder is not specified, this operation returns details for the customer managed configuration recorder configured for the
 * account, if applicable.
 *
 * When making a request to this operation, you can only specify one configuration recorder.
 */
export const describeConfigurationRecorders =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationRecordersRequest,
    output: DescribeConfigurationRecordersResponse,
    errors: [NoSuchConfigurationRecorderException, ValidationException],
  }));
/**
 * Returns details about the specified delivery channel. If a
 * delivery channel is not specified, this operation returns the details
 * of all delivery channels associated with the account.
 *
 * Currently, you can specify only one delivery channel per
 * region in your account.
 */
export const describeDeliveryChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDeliveryChannelsRequest,
    output: DescribeDeliveryChannelsResponse,
    errors: [NoSuchDeliveryChannelException],
  }),
);
/**
 * Returns the details of one or more remediation configurations.
 */
export const describeRemediationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRemediationConfigurationsRequest,
    output: DescribeRemediationConfigurationsResponse,
    errors: [],
  }));
/**
 * Removes all resource types specified in the `ResourceTypes` list from the RecordingGroup of configuration recorder and excludes these resource types when recording.
 *
 * For this operation, the configuration recorder must use a RecordingStrategy that is either `INCLUSION_BY_RESOURCE_TYPES` or `EXCLUSION_BY_RESOURCE_TYPES`.
 */
export const disassociateResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateResourceTypesRequest,
    output: DisassociateResourceTypesResponse,
    errors: [
      ConflictException,
      NoSuchConfigurationRecorderException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the evaluation results for the specified Amazon Web Services resource.
 * The results indicate which Config rules were used to evaluate
 * the resource, when each rule was last invoked, and whether the resource
 * complies with each rule.
 */
export const getComplianceDetailsByResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetComplianceDetailsByResourceRequest,
    output: GetComplianceDetailsByResourceResponse,
    errors: [InvalidParameterValueException],
  }));
/**
 * Returns the policy definition containing the logic for your Config Custom Policy rule.
 */
export const getCustomRulePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomRulePolicyRequest,
  output: GetCustomRulePolicyResponse,
  errors: [NoSuchConfigRuleException],
}));
/**
 * Returns the policy definition containing the logic for your organization Config Custom Policy rule.
 */
export const getOrganizationCustomRulePolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOrganizationCustomRulePolicyRequest,
    output: GetOrganizationCustomRulePolicyResponse,
    errors: [
      NoSuchOrganizationConfigRuleException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Returns the details of a specific stored query.
 */
export const getStoredQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStoredQueryRequest,
  output: GetStoredQueryResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Add or updates the evaluations for process checks.
 * This API checks if the rule is a process check when the name of the Config rule is provided.
 */
export const putExternalEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutExternalEvaluationRequest,
    output: PutExternalEvaluationResponse,
    errors: [InvalidParameterValueException, NoSuchConfigRuleException],
  }),
);
/**
 * Creates a service-linked configuration recorder that is linked to a specific Amazon Web Services service based on the `ServicePrincipal` you specify.
 *
 * The configuration recorder's `name`, `recordingGroup`, `recordingMode`, and `recordingScope` is set by the service that is linked to the configuration recorder.
 *
 * For more information and a list of supported services/service principals, see
 * **Working with the Configuration Recorder**
 * in the *Config Developer Guide*.
 *
 * This API creates a service-linked role `AWSServiceRoleForConfig` in your account. The service-linked role is created only when the role does not exist in your account.
 *
 * **The recording scope determines if you receive configuration items**
 *
 * The recording scope is set by the service that is linked to the configuration recorder and determines whether you receive configuration items (CIs) in the delivery channel. If the recording scope is internal, you will not receive CIs in the delivery channel.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putServiceLinkedConfigurationRecorder =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutServiceLinkedConfigurationRecorderRequest,
    output: PutServiceLinkedConfigurationRecorderResponse,
    errors: [
      ConflictException,
      InsufficientPermissionsException,
      LimitExceededException,
      ValidationException,
    ],
  }));
/**
 * Runs an on-demand evaluation for the specified Config rules
 * against the last known configuration state of the resources. Use
 * `StartConfigRulesEvaluation` when you want to test
 * that a rule you updated is working as expected.
 * `StartConfigRulesEvaluation` does not re-record the
 * latest configuration state for your resources. It re-runs an
 * evaluation against the last known state of your resources.
 *
 * You can specify up to 25 Config rules per request.
 *
 * An existing `StartConfigRulesEvaluation` call for
 * the specified rules must complete before you can call the API again.
 * If you chose to have Config stream to an Amazon SNS topic, you
 * will receive a `ConfigRuleEvaluationStarted` notification
 * when the evaluation starts.
 *
 * You don't need to call the
 * `StartConfigRulesEvaluation` API to run an
 * evaluation for a new rule. When you create a rule, Config
 * evaluates your resources against the rule automatically.
 *
 * The `StartConfigRulesEvaluation` API is useful if
 * you want to run on-demand evaluations, such as the following
 * example:
 *
 * - You have a custom rule that evaluates your IAM
 * resources every 24 hours.
 *
 * - You update your Lambda function to add additional
 * conditions to your rule.
 *
 * - Instead of waiting for the next periodic evaluation,
 * you call the `StartConfigRulesEvaluation`
 * API.
 *
 * - Config invokes your Lambda function and evaluates
 * your IAM resources.
 *
 * - Your custom rule will still run periodic evaluations
 * every 24 hours.
 */
export const startConfigRulesEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartConfigRulesEvaluationRequest,
    output: StartConfigRulesEvaluationResponse,
    errors: [
      InvalidParameterValueException,
      LimitExceededException,
      NoSuchConfigRuleException,
      ResourceInUseException,
    ],
  }),
);
/**
 * Starts the customer managed configuration recorder. The customer managed configuration recorder will begin recording configuration changes for the resource types you specify.
 *
 * You must have created a delivery channel to
 * successfully start the customer managed configuration recorder. You can use the PutDeliveryChannel operation to create a delivery channel.
 */
export const startConfigurationRecorder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartConfigurationRecorderRequest,
    output: StartConfigurationRecorderResponse,
    errors: [
      NoAvailableDeliveryChannelException,
      NoSuchConfigurationRecorderException,
      UnmodifiableEntityException,
    ],
  }),
);
/**
 * Runs an on-demand remediation for the specified Config rules against the last known remediation configuration. It runs an execution against the current state of your resources. Remediation execution is asynchronous.
 *
 * You can specify up to 100 resource keys per request. An existing StartRemediationExecution call for the specified resource keys must complete before you can call the API again.
 */
export const startRemediationExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartRemediationExecutionRequest,
    output: StartRemediationExecutionResponse,
    errors: [
      InsufficientPermissionsException,
      InvalidParameterValueException,
      NoSuchRemediationConfigurationException,
    ],
  }),
);
/**
 * Stops the customer managed configuration recorder. The customer managed configuration recorder will stop recording configuration changes for the resource types you have specified.
 */
export const stopConfigurationRecorder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopConfigurationRecorderRequest,
    output: StopConfigurationRecorderResponse,
    errors: [NoSuchConfigurationRecorderException, UnmodifiableEntityException],
  }),
);
/**
 * Associates the specified tags to a resource with the specified `ResourceArn`. If existing tags on a resource are not specified in the request parameters, they are not changed.
 * If existing tags are specified, however, then their values will be updated. When a resource is deleted, the tags associated with that resource are deleted as well.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds all resource types specified in the `ResourceTypes` list to the RecordingGroup of specified configuration recorder and includes those resource types when recording.
 *
 * For this operation, the specified configuration recorder must use a RecordingStrategy that is either `INCLUSION_BY_RESOURCE_TYPES` or `EXCLUSION_BY_RESOURCE_TYPES`.
 */
export const associateResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateResourceTypesRequest,
    output: AssociateResourceTypesResponse,
    errors: [
      ConflictException,
      NoSuchConfigurationRecorderException,
      ValidationException,
    ],
  }),
);
/**
 * Returns the `BaseConfigurationItem` for one or more requested resources.
 * The operation also returns a list of resources that are
 * not processed in the current request. If there are no unprocessed
 * resources, the operation returns an empty unprocessedResourceKeys
 * list.
 *
 * - The API does not return results for deleted
 * resources.
 *
 * - The API does not return any tags for the requested
 * resources. This information is filtered out of the
 * supplementaryConfiguration section of the API
 * response.
 */
export const batchGetResourceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetResourceConfigRequest,
    output: BatchGetResourceConfigResponse,
    errors: [NoAvailableConfigurationRecorderException, ValidationException],
  }),
);
/**
 * Deletes the delivery channel.
 *
 * Before you can delete the delivery channel, you must stop the customer managed configuration recorder. You can use the StopConfigurationRecorder operation to stop the customer managed configuration recorder.
 */
export const deleteDeliveryChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDeliveryChannelRequest,
    output: DeleteDeliveryChannelResponse,
    errors: [
      LastDeliveryChannelDeleteFailedException,
      NoSuchDeliveryChannelException,
    ],
  }),
);
/**
 * Deletes the specified organization Config rule and all of its evaluation results from all member accounts in that organization.
 *
 * Only a management account and a delegated administrator account can delete an organization Config rule.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added.
 *
 * Config sets the state of a rule to DELETE_IN_PROGRESS until the deletion is complete.
 * You cannot update a rule while it is in this state.
 *
 * **Recommendation: Consider excluding the `AWS::Config::ResourceCompliance` resource type from recording before deleting rules**
 *
 * Deleting rules creates configuration items (CIs) for `AWS::Config::ResourceCompliance`
 * that can affect your costs for the configuration recorder. If you are deleting rules which evaluate a large number of resource types,
 * this can lead to a spike in the number of CIs recorded.
 *
 * To avoid the associated costs, you can opt to disable recording
 * for the `AWS::Config::ResourceCompliance` resource type before deleting rules, and re-enable recording after the rules have been deleted.
 *
 * However, since deleting rules is an asynchronous process, it might take an hour or more to complete. During the time
 * when recording is disabled for `AWS::Config::ResourceCompliance`, rule evaluations will not be recorded in the associated resource’s history.
 */
export const deleteOrganizationConfigRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteOrganizationConfigRuleRequest,
    output: DeleteOrganizationConfigRuleResponse,
    errors: [
      NoSuchOrganizationConfigRuleException,
      OrganizationAccessDeniedException,
      ResourceInUseException,
    ],
  }));
/**
 * Schedules delivery of a configuration snapshot to the Amazon S3
 * bucket in the specified delivery channel. After the delivery has
 * started, Config sends the following notifications using an
 * Amazon SNS topic that you have specified.
 *
 * - Notification of the start of the delivery.
 *
 * - Notification of the completion of the delivery, if the
 * delivery was successfully completed.
 *
 * - Notification of delivery failure, if the delivery
 * failed.
 */
export const deliverConfigSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeliverConfigSnapshotRequest,
    output: DeliverConfigSnapshotResponse,
    errors: [
      NoAvailableConfigurationRecorderException,
      NoRunningConfigurationRecorderException,
      NoSuchDeliveryChannelException,
    ],
  }),
);
/**
 * Returns a list of authorizations granted to various aggregator
 * accounts and regions.
 */
export const describeAggregationAuthorizations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAggregationAuthorizationsRequest,
    output: DescribeAggregationAuthorizationsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Indicates whether the specified Amazon Web Services resources are compliant. If
 * a resource is noncompliant, this operation returns the number of Config rules that the resource does not comply with.
 *
 * A resource is compliant if it complies with all the Config
 * rules that evaluate it. It is noncompliant if it does not comply
 * with one or more of these rules.
 *
 * If Config has no current evaluation results for the
 * resource, it returns `INSUFFICIENT_DATA`. This result
 * might indicate one of the following conditions about the rules that
 * evaluate the resource:
 *
 * - Config has never invoked an evaluation for the
 * rule. To check whether it has, use the
 * `DescribeConfigRuleEvaluationStatus` action
 * to get the `LastSuccessfulInvocationTime` and
 * `LastFailedInvocationTime`.
 *
 * - The rule's Lambda function is failing to send
 * evaluation results to Config. Verify that the role that
 * you assigned to your configuration recorder includes the
 * `config:PutEvaluations` permission. If the
 * rule is a custom rule, verify that the Lambda execution
 * role includes the `config:PutEvaluations`
 * permission.
 *
 * - The rule's Lambda function has returned
 * `NOT_APPLICABLE` for all evaluation results.
 * This can occur if the resources were deleted or removed from
 * the rule's scope.
 */
export const describeComplianceByResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeComplianceByResourceRequest,
    output: DescribeComplianceByResourceResponse,
    errors: [InvalidNextTokenException, InvalidParameterValueException],
  }));
/**
 * Returns status information for each of your Config managed rules. The status includes information such as the last time Config invoked the rule, the last time Config failed to invoke
 * the rule, and the related error for the last failure.
 */
export const describeConfigRuleEvaluationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigRuleEvaluationStatusRequest,
    output: DescribeConfigRuleEvaluationStatusResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigRuleException,
    ],
  }));
/**
 * Returns details about your Config rules.
 */
export const describeConfigRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigRulesRequest,
  output: DescribeConfigRulesResponse,
  errors: [
    InvalidNextTokenException,
    InvalidParameterValueException,
    NoSuchConfigRuleException,
  ],
}));
/**
 * Returns the details of one or more configuration aggregators.
 * If the configuration aggregator is not specified, this operation
 * returns the details for all the configuration aggregators associated
 * with the account.
 */
export const describeConfigurationAggregators =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationAggregatorsRequest,
    output: DescribeConfigurationAggregatorsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigurationAggregatorException,
    ],
  }));
/**
 * Returns status information for sources within an aggregator.
 * The status includes information about the last time Config verified authorization between the source account and an aggregator account. In case of a failure, the status contains the related error code or message.
 */
export const describeConfigurationAggregatorSourcesStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationAggregatorSourcesStatusRequest,
    output: DescribeConfigurationAggregatorSourcesStatusResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigurationAggregatorException,
    ],
  }));
/**
 * Returns the current status of the configuration
 * recorder you specify as well as the status of the last recording event for the configuration recorders.
 *
 * For a detailed status of recording events over time, add your Config events to Amazon CloudWatch metrics and use CloudWatch metrics.
 *
 * If a configuration recorder is not specified, this operation returns the status for the customer managed configuration recorder configured for the
 * account, if applicable.
 *
 * When making a request to this operation, you can only specify one configuration recorder.
 */
export const describeConfigurationRecorderStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConfigurationRecorderStatusRequest,
    output: DescribeConfigurationRecorderStatusResponse,
    errors: [NoSuchConfigurationRecorderException, ValidationException],
  }));
/**
 * Returns a list of one or more conformance packs.
 */
export const describeConformancePacks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConformancePacksRequest,
    output: DescribeConformancePacksResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConformancePackException,
    ],
  }),
);
/**
 * Provides one or more conformance packs deployment status.
 *
 * If there are no conformance packs then you will see an empty result.
 */
export const describeConformancePackStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConformancePackStatusRequest,
    output: DescribeConformancePackStatusResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Provides organization Config rule deployment status for an organization.
 *
 * The status is not considered successful until organization Config rule is successfully deployed in all the member
 * accounts with an exception of excluded accounts.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 * Limit and next token are not applicable if you specify organization Config rule names.
 * It is only applicable, when you request all the organization Config rules.
 */
export const describeOrganizationConfigRuleStatuses =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConfigRuleStatusesRequest,
    output: DescribeOrganizationConfigRuleStatusesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConfigRuleException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Returns a list of organization conformance packs.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you specify organization conformance packs names. They are only applicable,
 * when you request all the organization conformance packs.
 *
 * *For accounts within an organization*
 *
 * If you deploy an organizational rule or conformance pack in an organization
 * administrator account, and then establish a delegated administrator and deploy an
 * organizational rule or conformance pack in the delegated administrator account, you
 * won't be able to see the organizational rule or conformance pack in the organization
 * administrator account from the delegated administrator account or see the organizational
 * rule or conformance pack in the delegated administrator account from organization
 * administrator account. The `DescribeOrganizationConfigRules` and
 * `DescribeOrganizationConformancePacks` APIs can only see and interact with
 * the organization-related resource that were deployed from within the account calling
 * those APIs.
 */
export const describeOrganizationConformancePacks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConformancePacksRequest,
    output: DescribeOrganizationConformancePacksResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConformancePackException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Provides organization conformance pack deployment status for an organization.
 *
 * The status is not considered successful until organization conformance pack is successfully
 * deployed in all the member accounts with an exception of excluded accounts.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 * Limit and next token are not applicable if you specify organization conformance pack names.
 * They are only applicable, when you request all the organization conformance packs.
 */
export const describeOrganizationConformancePackStatuses =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConformancePackStatusesRequest,
    output: DescribeOrganizationConformancePackStatusesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConformancePackException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Returns a list of all pending aggregation requests.
 */
export const describePendingAggregationRequests =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePendingAggregationRequestsRequest,
    output: DescribePendingAggregationRequestsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Returns the details of one or more remediation exceptions. A detailed view of a remediation exception for a set of resources that includes an explanation of an exception and the time when the exception will be deleted.
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you request resources in batch. It is only applicable, when you request all resources.
 */
export const describeRemediationExceptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRemediationExceptionsRequest,
    output: DescribeRemediationExceptionsResponse,
    errors: [InvalidNextTokenException, InvalidParameterValueException],
  }));
/**
 * Returns the details of one or more retention configurations. If
 * the retention configuration name is not specified, this operation
 * returns the details for all the retention configurations for that
 * account.
 *
 * Currently, Config supports only one retention
 * configuration per region in your account.
 */
export const describeRetentionConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRetentionConfigurationsRequest,
    output: DescribeRetentionConfigurationsResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchRetentionConfigurationException,
    ],
  }));
/**
 * Returns the evaluation results for the specified Config
 * rule. The results indicate which Amazon Web Services resources were evaluated by the
 * rule, when each resource was last evaluated, and whether each
 * resource complies with the rule.
 */
export const getComplianceDetailsByConfigRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetComplianceDetailsByConfigRuleRequest,
    output: GetComplianceDetailsByConfigRuleResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigRuleException,
    ],
  }));
/**
 * Returns the number of Config rules that are compliant and
 * noncompliant, up to a maximum of 25 for each.
 */
export const getComplianceSummaryByConfigRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetComplianceSummaryByConfigRuleRequest,
    output: GetComplianceSummaryByConfigRuleResponse,
    errors: [],
  }));
/**
 * Returns the number of resources that are compliant and the
 * number that are noncompliant. You can specify one or more resource
 * types to get these numbers for each resource type. The maximum
 * number returned is 100.
 */
export const getComplianceSummaryByResourceType =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetComplianceSummaryByResourceTypeRequest,
    output: GetComplianceSummaryByResourceTypeResponse,
    errors: [InvalidParameterValueException],
  }));
/**
 * Returns compliance details for the conformance pack based on the cumulative compliance results of all the rules in that conformance pack.
 */
export const getConformancePackComplianceSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConformancePackComplianceSummaryRequest,
    output: GetConformancePackComplianceSummaryResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConformancePackException,
    ],
  }));
/**
 * Returns the resource types, the number of each resource type,
 * and the total number of resources that Config is recording in
 * this region for your Amazon Web Services account.
 *
 * **Example**
 *
 * - Config is recording three resource types in the US
 * East (Ohio) Region for your account: 25 EC2 instances, 20
 * IAM users, and 15 S3 buckets.
 *
 * - You make a call to the
 * `GetDiscoveredResourceCounts` action and
 * specify that you want all resource types.
 *
 * - Config returns the following:
 *
 * - The resource types (EC2 instances, IAM users,
 * and S3 buckets).
 *
 * - The number of each resource type (25, 20, and
 * 15).
 *
 * - The total number of all resources
 * (60).
 *
 * The response is paginated. By default, Config lists 100
 * ResourceCount objects on each page. You can
 * customize this number with the `limit` parameter. The
 * response includes a `nextToken` string. To get the next
 * page of results, run the request again and specify the string for
 * the `nextToken` parameter.
 *
 * If you make a call to the GetDiscoveredResourceCounts action, you might
 * not immediately receive resource counts in the following
 * situations:
 *
 * - You are a new Config customer.
 *
 * - You just enabled resource recording.
 *
 * It might take a few minutes for Config to record and
 * count your resources. Wait a few minutes and then retry the
 * GetDiscoveredResourceCounts action.
 */
export const getDiscoveredResourceCounts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDiscoveredResourceCountsRequest,
    output: GetDiscoveredResourceCountsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a summary of resource evaluation for the specified resource evaluation ID from the proactive rules that were run.
 * The results indicate which evaluation context was used to evaluate the rules, which resource details were evaluated,
 * the evaluation mode that was run, and whether the resource details comply with the configuration of the proactive rules.
 *
 * To see additional information about the evaluation result, such as which rule flagged a resource as NON_COMPLIANT, use the GetComplianceDetailsByResource API.
 * For more information, see the Examples section.
 */
export const getResourceEvaluationSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetResourceEvaluationSummaryRequest,
    output: GetResourceEvaluationSummaryResponse,
    errors: [ResourceNotFoundException],
  }));
/**
 * Accepts a resource type and returns a list of resource identifiers that are aggregated for a specific resource type across accounts and regions.
 * A resource identifier includes the resource type, ID, (if available) the custom resource name, source account, and source region.
 * You can narrow the results to include only resources that have specific resource IDs, or a resource name, or source account ID, or source region.
 *
 * For example, if the input consists of accountID 12345678910 and the region is us-east-1 for resource type `AWS::EC2::Instance` then the API returns all the EC2 instance identifiers of accountID 12345678910 and region us-east-1.
 */
export const listAggregateDiscoveredResources =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAggregateDiscoveredResourcesRequest,
    output: ListAggregateDiscoveredResourcesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns a list of resource
 * resource identifiers for the specified resource types for the resources of that type. A *resource identifier*
 * includes the resource type, ID, and (if available) the custom
 * resource name.
 *
 * The results consist of resources that Config has
 * *discovered*, including those that Config is not currently
 * recording. You can narrow the results to include only resources that
 * have specific resource IDs or a resource name.
 *
 * You can specify either resource IDs or a resource name, but
 * not both, in the same request.
 *
 * *CloudFormation stack recording behavior in Config*
 *
 * When a CloudFormation stack fails to create (for example, it enters the `ROLLBACK_FAILED` state),
 * Config does not record a configuration item (CI) for that stack. Configuration items are only recorded for stacks that reach
 * the following states:
 *
 * - `CREATE_COMPLETE`
 *
 * - `UPDATE_COMPLETE`
 *
 * - `UPDATE_ROLLBACK_COMPLETE`
 *
 * - `UPDATE_ROLLBACK_FAILED`
 *
 * - `DELETE_FAILED`
 *
 * - `DELETE_COMPLETE`
 *
 * Because no CI is created for a failed stack creation, you won't see configuration history
 * for that stack in Config, even after the stack is deleted. This helps make sure that Config only
 * tracks resources that were successfully provisioned.
 */
export const listDiscoveredResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDiscoveredResourcesRequest,
    output: ListDiscoveredResourcesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoAvailableConfigurationRecorderException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the stored queries for a single Amazon Web Services account and a single Amazon Web Services Region. The default is 100.
 */
export const listStoredQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStoredQueriesRequest,
  output: ListStoredQueriesResponse,
  errors: [InvalidNextTokenException, ValidationException],
}));
/**
 * List the tags for Config resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidLimitException,
    InvalidNextTokenException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Authorizes the aggregator account and region to collect data
 * from the source account and region.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutAggregationAuthorization` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putAggregationAuthorization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAggregationAuthorizationRequest,
    output: PutAggregationAuthorizationResponse,
    errors: [InvalidParameterValueException],
  }),
);
/**
 * A remediation exception is when a specified resource is no longer considered for auto-remediation.
 * This API adds a new exception or updates an existing exception for a specified resource with a specified Config rule.
 *
 * **Exceptions block auto remediation**
 *
 * Config generates a remediation exception when a problem occurs running a remediation action for a specified resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 *
 * **Manual remediation is recommended when placing an exception**
 *
 * When placing an exception on an Amazon Web Services resource, it is recommended that remediation is set as manual remediation until
 * the given Config rule for the specified resource evaluates the resource as `NON_COMPLIANT`.
 * Once the resource has been evaluated as `NON_COMPLIANT`, you can add remediation exceptions and change the remediation type back from Manual to Auto if you want to use auto-remediation.
 * Otherwise, using auto-remediation before a `NON_COMPLIANT` evaluation result can delete resources before the exception is applied.
 *
 * **Exceptions can only be performed on non-compliant resources**
 *
 * Placing an exception can only be performed on resources that are `NON_COMPLIANT`.
 * If you use this API for `COMPLIANT` resources or resources that are `NOT_APPLICABLE`, a remediation exception will not be generated.
 * For more information on the conditions that initiate the possible Config evaluation results,
 * see Concepts | Config Rules in the *Config Developer Guide*.
 *
 * **Exceptions cannot be placed on service-linked remediation actions**
 *
 * You cannot place an exception on service-linked remediation actions, such as remediation actions put by an organizational conformance pack.
 *
 * **Auto remediation can be initiated even for compliant resources**
 *
 * If you enable auto remediation for a specific Config rule using the PutRemediationConfigurations API or the Config console,
 * it initiates the remediation process for all non-compliant resources for that specific rule.
 * The auto remediation process relies on the compliance data snapshot which is captured on a periodic basis.
 * Any non-compliant resource that is updated between the snapshot schedule will continue to be remediated based on the last known compliance data snapshot.
 *
 * This means that in some cases auto remediation can be initiated even for compliant resources, since the bootstrap processor uses a database that can have stale evaluation results based on the last known compliance data snapshot.
 */
export const putRemediationExceptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRemediationExceptionsRequest,
    output: PutRemediationExceptionsResponse,
    errors: [InsufficientPermissionsException, InvalidParameterValueException],
  }),
);
/**
 * Records the configuration state for the resource provided in the request.
 *
 * The configuration state of a resource is represented in Config as Configuration Items.
 * Once this API records the configuration item, you can retrieve the list of configuration items for the custom resource type using existing Config APIs.
 *
 * The custom resource type must be registered with CloudFormation. This API accepts the configuration item registered with CloudFormation.
 *
 * When you call this API, Config only stores configuration state of the resource provided in the request. This API does not change or remediate the configuration of the resource.
 *
 * Write-only schema properites are not recorded as part of the published configuration item.
 */
export const putResourceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourceConfigRequest,
  output: PutResourceConfigResponse,
  errors: [
    InsufficientPermissionsException,
    MaxActiveResourcesExceededException,
    NoRunningConfigurationRecorderException,
    ValidationException,
  ],
}));
/**
 * Creates and updates the retention configuration with details
 * about retention period (number of days) that Config stores your
 * historical information. The API creates the
 * `RetentionConfiguration` object and names the object
 * as **default**. When you have a
 * `RetentionConfiguration` object named **default**, calling the API modifies the
 * default object.
 *
 * Currently, Config supports only one retention
 * configuration per region in your account.
 */
export const putRetentionConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRetentionConfigurationRequest,
    output: PutRetentionConfigurationResponse,
    errors: [
      InvalidParameterValueException,
      MaxNumberOfRetentionConfigurationsExceededException,
    ],
  }),
);
/**
 * Accepts a structured query language (SQL) `SELECT` command, performs the corresponding search, and returns resource configurations matching the properties.
 *
 * For more information about query components, see the
 *
 * **Query Components**
 * section in the *Config Developer Guide*.
 */
export const selectResourceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SelectResourceConfigRequest,
    output: SelectResourceConfigResponse,
    errors: [
      InvalidExpressionException,
      InvalidLimitException,
      InvalidNextTokenException,
    ],
  }),
);
/**
 * Returns the current configuration items for resources that are present in your Config aggregator. The operation also returns a list of resources that are not processed in the current request.
 * If there are no unprocessed resources, the operation returns an empty `unprocessedResourceIdentifiers` list.
 *
 * - The API does not return results for deleted resources.
 *
 * - The API does not return tags and relationships.
 */
export const batchGetAggregateResourceConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchGetAggregateResourceConfigRequest,
    output: BatchGetAggregateResourceConfigResponse,
    errors: [NoSuchConfigurationAggregatorException, ValidationException],
  }));
/**
 * Deletes the remediation configuration.
 */
export const deleteRemediationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRemediationConfigurationRequest,
    output: DeleteRemediationConfigurationResponse,
    errors: [
      InsufficientPermissionsException,
      InvalidParameterValueException,
      NoSuchRemediationConfigurationException,
      RemediationInProgressException,
    ],
  }));
/**
 * Returns a list of compliant and noncompliant rules with the
 * number of resources for compliant and noncompliant rules. Does not display rules that do not have compliance results.
 *
 * The results can return an empty result page, but if you
 * have a `nextToken`, the results are displayed on the next
 * page.
 */
export const describeAggregateComplianceByConfigRules =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAggregateComplianceByConfigRulesRequest,
    output: DescribeAggregateComplianceByConfigRulesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Indicates whether the specified Config rules are compliant.
 * If a rule is noncompliant, this operation returns the number of Amazon Web Services
 * resources that do not comply with the rule.
 *
 * A rule is compliant if all of the evaluated resources comply
 * with it. It is noncompliant if any of these resources do not
 * comply.
 *
 * If Config has no current evaluation results for the rule,
 * it returns `INSUFFICIENT_DATA`. This result might
 * indicate one of the following conditions:
 *
 * - Config has never invoked an evaluation for the
 * rule. To check whether it has, use the
 * `DescribeConfigRuleEvaluationStatus` action
 * to get the `LastSuccessfulInvocationTime` and
 * `LastFailedInvocationTime`.
 *
 * - The rule's Lambda function is failing to send
 * evaluation results to Config. Verify that the role you
 * assigned to your configuration recorder includes the
 * `config:PutEvaluations` permission. If the
 * rule is a custom rule, verify that the Lambda execution
 * role includes the `config:PutEvaluations`
 * permission.
 *
 * - The rule's Lambda function has returned
 * `NOT_APPLICABLE` for all evaluation results.
 * This can occur if the resources were deleted or removed from
 * the rule's scope.
 */
export const describeComplianceByConfigRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeComplianceByConfigRuleRequest,
    output: DescribeComplianceByConfigRuleResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigRuleException,
    ],
  }));
/**
 * Returns the current status of the specified delivery channel.
 * If a delivery channel is not specified, this operation returns the
 * current status of all delivery channels associated with the
 * account.
 *
 * Currently, you can specify only one delivery channel per
 * region in your account.
 */
export const describeDeliveryChannelStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDeliveryChannelStatusRequest,
    output: DescribeDeliveryChannelStatusResponse,
    errors: [NoSuchDeliveryChannelException],
  }));
/**
 * Returns a list of organization Config rules.
 *
 * When you specify the limit and the next token, you receive a paginated response.
 *
 * Limit and next token are not applicable if you specify organization Config rule names.
 * It is only applicable, when you request all the organization Config rules.
 *
 * *For accounts within an organization*
 *
 * If you deploy an organizational rule or conformance pack in an organization
 * administrator account, and then establish a delegated administrator and deploy an
 * organizational rule or conformance pack in the delegated administrator account, you
 * won't be able to see the organizational rule or conformance pack in the organization
 * administrator account from the delegated administrator account or see the organizational
 * rule or conformance pack in the delegated administrator account from organization
 * administrator account. The `DescribeOrganizationConfigRules` and
 * `DescribeOrganizationConformancePacks` APIs can only see and interact with
 * the organization-related resource that were deployed from within the account calling
 * those APIs.
 */
export const describeOrganizationConfigRules =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrganizationConfigRulesRequest,
    output: DescribeOrganizationConfigRulesResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConfigRuleException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Provides a detailed view of a Remediation Execution for a set of resources including state, timestamps for when steps for the remediation execution occur, and any error messages for steps that have failed.
 * When you specify the limit and the next token, you receive a paginated response.
 */
export const describeRemediationExecutionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRemediationExecutionStatusRequest,
    output: DescribeRemediationExecutionStatusResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchRemediationConfigurationException,
    ],
  }));
/**
 * Returns the number of compliant and noncompliant rules for one
 * or more accounts and regions in an aggregator.
 *
 * The results can return an empty result page, but if you
 * have a nextToken, the results are displayed on the next
 * page.
 */
export const getAggregateConfigRuleComplianceSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAggregateConfigRuleComplianceSummaryRequest,
    output: GetAggregateConfigRuleComplianceSummaryResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns the resource counts across accounts and regions that are present in your Config aggregator. You can request the resource counts by providing filters and GroupByKey.
 *
 * For example, if the input contains accountID 12345678910 and region us-east-1 in filters, the API returns the count of resources in account ID 12345678910 and region us-east-1.
 * If the input contains ACCOUNT_ID as a GroupByKey, the API returns resource counts for all source accounts that are present in your aggregator.
 */
export const getAggregateDiscoveredResourceCounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAggregateDiscoveredResourceCountsRequest,
    output: GetAggregateDiscoveredResourceCountsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns compliance details of a conformance pack for all Amazon Web Services resources that are monitered by conformance pack.
 */
export const getConformancePackComplianceDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetConformancePackComplianceDetailsRequest,
    output: GetConformancePackComplianceDetailsResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigRuleInConformancePackException,
      NoSuchConformancePackException,
    ],
  }));
/**
 * Returns detailed status for each member account within an organization for a given organization Config rule.
 */
export const getOrganizationConfigRuleDetailedStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOrganizationConfigRuleDetailedStatusRequest,
    output: GetOrganizationConfigRuleDetailedStatusResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConfigRuleException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Returns detailed status for each member account within an organization for a given organization conformance pack.
 */
export const getOrganizationConformancePackDetailedStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOrganizationConformancePackDetailedStatusRequest,
    output: GetOrganizationConformancePackDetailedStatusResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchOrganizationConformancePackException,
      OrganizationAccessDeniedException,
    ],
  }));
/**
 * Returns a list of configuration recorders depending on the filters you specify.
 */
export const listConfigurationRecorders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationRecordersRequest,
    output: ListConfigurationRecordersResponse,
    errors: [ValidationException],
  }),
);
/**
 * Returns a list of conformance pack compliance scores.
 * A compliance score is the percentage of the number of compliant rule-resource combinations in a conformance pack compared to the number of total possible rule-resource combinations in the conformance pack.
 * This metric provides you with a high-level view of the compliance state of your conformance packs. You can use it to identify, investigate, and understand
 * the level of compliance in your conformance packs.
 *
 * Conformance packs with no evaluation results will have a compliance score of `INSUFFICIENT_DATA`.
 */
export const listConformancePackComplianceScores =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListConformancePackComplianceScoresRequest,
    output: ListConformancePackComplianceScoresResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Used by an Lambda function to deliver evaluation results to
 * Config. This operation is required in every Lambda function
 * that is invoked by an Config rule.
 */
export const putEvaluations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEvaluationsRequest,
  output: PutEvaluationsResponse,
  errors: [
    InvalidParameterValueException,
    InvalidResultTokenException,
    NoSuchConfigRuleException,
  ],
}));
/**
 * Saves a new query or updates an existing saved query. The `QueryName` must be unique for a single Amazon Web Services account and a single Amazon Web Services Region.
 * You can create upto 300 queries in a single Amazon Web Services account and a single Amazon Web Services Region.
 *
 * **Tags are added at creation and cannot be updated**
 *
 * `PutStoredQuery` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 */
export const putStoredQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutStoredQueryRequest,
  output: PutStoredQueryResponse,
  errors: [
    ResourceConcurrentModificationException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Accepts a structured query language (SQL) SELECT command and an aggregator to query configuration state of Amazon Web Services resources across multiple accounts and regions,
 * performs the corresponding search, and returns resource configurations matching the properties.
 *
 * For more information about query components, see the
 *
 * **Query Components**
 * section in the *Config Developer Guide*.
 *
 * If you run an aggregation query (i.e., using `GROUP BY` or using aggregate functions such as `COUNT`; e.g., `SELECT resourceId, COUNT(*) WHERE resourceType = 'AWS::IAM::Role' GROUP BY resourceId`)
 * and do not specify the `MaxResults` or the `Limit` query parameters, the default page size is set to 500.
 *
 * If you run a non-aggregation query (i.e., not using `GROUP BY` or aggregate function; e.g., `SELECT * WHERE resourceType = 'AWS::IAM::Role'`)
 * and do not specify the `MaxResults` or the `Limit` query parameters, the default page size is set to 25.
 */
export const selectAggregateResourceConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SelectAggregateResourceConfigRequest,
    output: SelectAggregateResourceConfigResponse,
    errors: [
      InvalidExpressionException,
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
    ],
  }));
/**
 * Runs an on-demand evaluation for the specified resource to determine whether the resource details will comply with configured Config rules.
 * You can also use it for evaluation purposes. Config recommends using an evaluation context. It runs an execution against the resource details with all
 * of the Config rules in your account that match with the specified proactive mode and resource type.
 *
 * Ensure you have the `cloudformation:DescribeType` role setup to validate the resource type schema.
 *
 * You can find the
 * Resource type schema in "*Amazon Web Services public extensions*" within the CloudFormation registry or with the following CLI commmand:
 * `aws cloudformation describe-type --type-name "AWS::S3::Bucket" --type RESOURCE`.
 *
 * For more information, see Managing extensions through the CloudFormation registry
 * and Amazon Web Services resource and property types reference in the CloudFormation User Guide.
 */
export const startResourceEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartResourceEvaluationRequest,
    output: StartResourceEvaluationResponse,
    errors: [IdempotentParameterMismatch, InvalidParameterValueException],
  }),
);
/**
 * Deletes one or more remediation exceptions mentioned in the resource keys.
 *
 * Config generates a remediation exception when a problem occurs executing a remediation action to a specific resource.
 * Remediation exceptions blocks auto-remediation until the exception is cleared.
 */
export const deleteRemediationExceptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRemediationExceptionsRequest,
    output: DeleteRemediationExceptionsResponse,
    errors: [NoSuchRemediationExceptionException],
  }),
);
/**
 * Returns a list of the existing and deleted conformance packs and their associated compliance status with the count of compliant and noncompliant Config rules within each
 * conformance pack. Also returns the total rule count which includes compliant rules, noncompliant rules, and rules that cannot be evaluated due to insufficient data.
 *
 * The results can return an empty result page, but if you have a `nextToken`, the results are displayed on the next page.
 */
export const describeAggregateComplianceByConformancePacks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAggregateComplianceByConformancePacksRequest,
    output: DescribeAggregateComplianceByConformancePacksResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns compliance details for each rule in that conformance pack.
 *
 * You must provide exact rule names.
 */
export const describeConformancePackCompliance =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConformancePackComplianceRequest,
    output: DescribeConformancePackComplianceResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidParameterValueException,
      NoSuchConfigRuleInConformancePackException,
      NoSuchConformancePackException,
    ],
  }));
/**
 * Returns the evaluation results for the specified Config
 * rule for a specific resource in a rule. The results indicate which
 * Amazon Web Services resources were evaluated by the rule, when each resource was
 * last evaluated, and whether each resource complies with the rule.
 *
 * The results can return an empty result page. But if you
 * have a `nextToken`, the results are displayed on the next
 * page.
 */
export const getAggregateComplianceDetailsByConfigRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAggregateComplianceDetailsByConfigRuleRequest,
    output: GetAggregateComplianceDetailsByConfigRuleResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns the count of compliant and noncompliant conformance packs across all Amazon Web Services accounts and Amazon Web Services Regions in an aggregator. You can filter based on Amazon Web Services account ID or Amazon Web Services Region.
 *
 * The results can return an empty result page, but if you have a nextToken, the results are displayed on the next page.
 */
export const getAggregateConformancePackComplianceSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetAggregateConformancePackComplianceSummaryRequest,
    output: GetAggregateConformancePackComplianceSummaryResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      NoSuchConfigurationAggregatorException,
      ValidationException,
    ],
  }));
/**
 * Returns configuration item that is aggregated for your specific resource in a specific source account and region.
 *
 * The API does not return results for deleted resources.
 */
export const getAggregateResourceConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAggregateResourceConfigRequest,
    output: GetAggregateResourceConfigResponse,
    errors: [
      NoSuchConfigurationAggregatorException,
      OversizedConfigurationItemException,
      ResourceNotDiscoveredException,
      ValidationException,
    ],
  }),
);
/**
 * For accurate reporting on the compliance status, you must record the `AWS::Config::ResourceCompliance` resource type.
 *
 * For more information, see Recording Amazon Web Services Resources in the *Config Resources Developer Guide*.
 *
 * Returns a list of configurations items (CIs) for the specified resource.
 *
 * **Contents**
 *
 * The list contains details about each state of the resource
 * during the specified time interval. If you specified a retention
 * period to retain your CIs between a
 * minimum of 30 days and a maximum of 7 years (2557 days), Config
 * returns the CIs for the specified
 * retention period.
 *
 * **Pagination**
 *
 * The response is paginated. By default, Config returns a
 * limit of 10 configuration items per page. You can customize this
 * number with the `limit` parameter. The response includes
 * a `nextToken` string. To get the next page of results,
 * run the request again and specify the string for the
 * `nextToken` parameter.
 *
 * Each call to the API is limited to span a duration of seven
 * days. It is likely that the number of records returned is
 * smaller than the specified `limit`. In such cases,
 * you can make another call, using the
 * `nextToken`.
 */
export const getResourceConfigHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceConfigHistoryRequest,
    output: GetResourceConfigHistoryResponse,
    errors: [
      InvalidLimitException,
      InvalidNextTokenException,
      InvalidTimeRangeException,
      NoAvailableConfigurationRecorderException,
      ResourceNotDiscoveredException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of proactive resource evaluations.
 */
export const listResourceEvaluations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceEvaluationsRequest,
    output: ListResourceEvaluationsResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterValueException,
      InvalidTimeRangeException,
    ],
  }),
);
/**
 * Adds or updates an Config rule to evaluate if your
 * Amazon Web Services resources comply with your desired configurations. For information on how many Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * There are two types of rules: *Config Managed Rules* and *Config Custom Rules*.
 * You can use `PutConfigRule` to create both Config Managed Rules and Config Custom Rules.
 *
 * Config Managed Rules are predefined,
 * customizable rules created by Config. For a list of managed rules, see
 * List of Config
 * Managed Rules. If you are adding an Config managed rule, you must specify the
 * rule's identifier for the `SourceIdentifier` key.
 *
 * Config Custom Rules are rules that you create from scratch. There are two ways to create Config custom rules: with Lambda functions
 * ( Lambda Developer Guide) and with Guard (Guard GitHub
 * Repository), a policy-as-code language.
 *
 * Config custom rules created with Lambda
 * are called *Config Custom Lambda Rules* and Config custom rules created with
 * Guard are called *Config Custom Policy Rules*.
 *
 * If you are adding a new Config Custom Lambda rule,
 * you first need to create an Lambda function that the rule invokes to evaluate
 * your resources. When you use `PutConfigRule` to add a Custom Lambda rule to Config, you must specify the Amazon Resource
 * Name (ARN) that Lambda assigns to the function. You specify the ARN
 * in the `SourceIdentifier` key. This key is part of the
 * `Source` object, which is part of the
 * `ConfigRule` object.
 *
 * For any new Config rule that you add, specify the
 * `ConfigRuleName` in the `ConfigRule`
 * object. Do not specify the `ConfigRuleArn` or the
 * `ConfigRuleId`. These values are generated by Config for new rules.
 *
 * If you are updating a rule that you added previously, you can
 * specify the rule by `ConfigRuleName`,
 * `ConfigRuleId`, or `ConfigRuleArn` in the
 * `ConfigRule` data type that you use in this
 * request.
 *
 * For more information about developing and using Config
 * rules, see Evaluating Resources with Config Rules
 * in the *Config Developer Guide*.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutConfigRule` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigRuleRequest,
  output: PutConfigRuleResponse,
  errors: [
    InsufficientPermissionsException,
    InvalidParameterValueException,
    MaxNumberOfConfigRulesExceededException,
    NoAvailableConfigurationRecorderException,
    ResourceInUseException,
  ],
}));
/**
 * Creates and updates the configuration aggregator with the
 * selected source accounts and regions. The source account can be
 * individual account(s) or an organization.
 *
 * `accountIds` that are passed will be replaced with existing accounts.
 * If you want to add additional accounts into the aggregator, call `DescribeConfigurationAggregators` to get the previous accounts and then append new ones.
 *
 * Config should be enabled in source accounts and regions
 * you want to aggregate.
 *
 * If your source type is an organization, you must be signed in to the management account or a registered delegated administrator and all the features must be enabled in your organization.
 * If the caller is a management account, Config calls `EnableAwsServiceAccess` API to enable integration between Config and Organizations.
 * If the caller is a registered delegated administrator, Config calls `ListDelegatedAdministrators` API to verify whether the caller is a valid delegated administrator.
 *
 * To register a delegated administrator, see Register a Delegated Administrator in the *Config developer guide*.
 *
 * **Tags are added at creation and cannot be updated with this operation**
 *
 * `PutConfigurationAggregator` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different `tags` values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, `tags` will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigurationAggregator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutConfigurationAggregatorRequest,
    output: PutConfigurationAggregatorResponse,
    errors: [
      InvalidParameterValueException,
      InvalidRoleException,
      LimitExceededException,
      NoAvailableOrganizationException,
      OrganizationAccessDeniedException,
      OrganizationAllFeaturesNotEnabledException,
    ],
  }),
);
/**
 * Creates or updates a conformance pack. A conformance pack is a collection of Config rules that can be easily deployed in an account and a region and across an organization.
 * For information on how many conformance packs you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * When you use `PutConformancePack` to deploy conformance packs in your account,
 * the operation can create Config rules and remediation actions without
 * requiring `config:PutConfigRule` or
 * `config:PutRemediationConfigurations` permissions in your account IAM
 * policies.
 *
 * This API uses the `AWSServiceRoleForConfigConforms` service-linked role in your
 * account to create conformance pack resources. This service-linked role includes the
 * permissions to create Config rules and remediation configurations, even
 * if your account IAM policies explicitly deny these actions.
 *
 * This API creates a service-linked role `AWSServiceRoleForConfigConforms` in your account.
 * The service-linked role is created only when the role does not exist in your account.
 *
 * You must specify only one of the follow parameters: `TemplateS3Uri`, `TemplateBody` or `TemplateSSMDocumentDetails`.
 */
export const putConformancePack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConformancePackRequest,
  output: PutConformancePackResponse,
  errors: [
    ConformancePackTemplateValidationException,
    InsufficientPermissionsException,
    InvalidParameterValueException,
    MaxNumberOfConformancePacksExceededException,
    ResourceInUseException,
  ],
}));
/**
 * Adds or updates an Config rule for your entire organization to evaluate if your Amazon Web Services resources comply with your
 * desired configurations. For information on how many organization Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * Only a management account and a delegated administrator can create or update an organization Config rule.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * This API enables organization service access through the `EnableAWSServiceAccess` action and creates a service-linked
 * role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization.
 * The service-linked role is created only when the role does not exist in the caller account.
 * Config verifies the existence of role with `GetRole` action.
 *
 * To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization
 * `register-delegated-administrator` for `config-multiaccountsetup.amazonaws.com`.
 *
 * There are two types of rules: *Config Managed Rules* and *Config Custom Rules*.
 * You can use `PutOrganizationConfigRule` to create both Config Managed Rules and Config Custom Rules.
 *
 * Config Managed Rules are predefined,
 * customizable rules created by Config. For a list of managed rules, see
 * List of Config
 * Managed Rules. If you are adding an Config managed rule, you must specify the rule's identifier for the `RuleIdentifier` key.
 *
 * Config Custom Rules are rules that you create from scratch. There are two ways to create Config custom rules: with Lambda functions
 * ( Lambda Developer Guide) and with Guard (Guard GitHub
 * Repository), a policy-as-code language.
 *
 * Config custom rules created with Lambda
 * are called *Config Custom Lambda Rules* and Config custom rules created with
 * Guard are called *Config Custom Policy Rules*.
 *
 * If you are adding a new Config Custom Lambda rule, you first need to create an Lambda function in the management account or a delegated
 * administrator that the rule invokes to evaluate your resources. You also need to create an IAM role in the managed account that can be assumed by the Lambda function.
 * When you use `PutOrganizationConfigRule` to add a Custom Lambda rule to Config, you must
 * specify the Amazon Resource Name (ARN) that Lambda assigns to the function.
 *
 * Prerequisite: Ensure you call `EnableAllFeatures` API to enable all features in an organization.
 *
 * Make sure to specify one of either `OrganizationCustomPolicyRuleMetadata` for Custom Policy rules, `OrganizationCustomRuleMetadata` for Custom Lambda rules, or `OrganizationManagedRuleMetadata` for managed rules.
 */
export const putOrganizationConfigRule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutOrganizationConfigRuleRequest,
    output: PutOrganizationConfigRuleResponse,
    errors: [
      InsufficientPermissionsException,
      InvalidParameterValueException,
      MaxNumberOfOrganizationConfigRulesExceededException,
      NoAvailableOrganizationException,
      OrganizationAccessDeniedException,
      OrganizationAllFeaturesNotEnabledException,
      ResourceInUseException,
      ValidationException,
    ],
  }),
);
/**
 * Deploys conformance packs across member accounts in an Amazon Web Services Organization. For information on how many organization conformance packs and how many Config rules you can have per account,
 * see
 * **Service Limits**
 * in the *Config Developer Guide*.
 *
 * Only a management account and a delegated administrator can call this API.
 * When calling this API with a delegated administrator, you must ensure Organizations
 * `ListDelegatedAdministrator` permissions are added. An organization can have up to 3 delegated administrators.
 *
 * When you use `PutOrganizationConformancePack` to deploy conformance packs across
 * member accounts, the operation can create Config rules and remediation
 * actions without requiring `config:PutConfigRule` or
 * `config:PutRemediationConfigurations` permissions in member account
 * IAM policies.
 *
 * This API uses the `AWSServiceRoleForConfigConforms` service-linked role in each
 * member account to create conformance pack resources. This service-linked role
 * includes the permissions to create Config rules and remediation
 * configurations, even if member account IAM policies explicitly deny these
 * actions.
 *
 * This API enables organization service access for `config-multiaccountsetup.amazonaws.com`
 * through the `EnableAWSServiceAccess` action and creates a
 * service-linked role `AWSServiceRoleForConfigMultiAccountSetup` in the management or delegated administrator account of your organization.
 * The service-linked role is created only when the role does not exist in the caller account.
 * To use this API with delegated administrator, register a delegated administrator by calling Amazon Web Services Organization
 * `register-delegate-admin` for `config-multiaccountsetup.amazonaws.com`.
 *
 * Prerequisite: Ensure you call `EnableAllFeatures` API to enable all features in an organization.
 *
 * You must specify either the `TemplateS3Uri` or the `TemplateBody` parameter, but not both.
 * If you provide both Config uses the `TemplateS3Uri` parameter and ignores the `TemplateBody` parameter.
 *
 * Config sets the state of a conformance pack to CREATE_IN_PROGRESS and UPDATE_IN_PROGRESS until the conformance pack is created or updated.
 * You cannot update a conformance pack while it is in this state.
 */
export const putOrganizationConformancePack =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutOrganizationConformancePackRequest,
    output: PutOrganizationConformancePackResponse,
    errors: [
      InsufficientPermissionsException,
      MaxNumberOfOrganizationConformancePacksExceededException,
      NoAvailableOrganizationException,
      OrganizationAccessDeniedException,
      OrganizationAllFeaturesNotEnabledException,
      OrganizationConformancePackTemplateValidationException,
      ResourceInUseException,
      ValidationException,
    ],
  }));
/**
 * Creates or updates the customer managed configuration recorder.
 *
 * You can use this operation to create a new customer managed configuration recorder or to update the `roleARN` and the `recordingGroup` for an existing customer managed configuration recorder.
 *
 * To start the customer managed configuration recorder and begin recording configuration changes for the resource types you specify,
 * use the StartConfigurationRecorder operation.
 *
 * For more information, see
 * **Working with the Configuration Recorder**
 * in the *Config Developer Guide*.
 *
 * **One customer managed configuration recorder per account per Region**
 *
 * You can create only one customer managed configuration recorder for each account for each Amazon Web Services Region.
 *
 * **Default is to record all supported resource types, excluding the global IAM resource types**
 *
 * If you have not specified values for the `recordingGroup` field, the default for the customer managed configuration recorder is to record all supported resource
 * types, excluding the global IAM resource types: `AWS::IAM::Group`, `AWS::IAM::Policy`, `AWS::IAM::Role`, and `AWS::IAM::User`.
 *
 * **Tags are added at creation and cannot be updated**
 *
 * `PutConfigurationRecorder` is an idempotent API. Subsequent requests won’t create a duplicate resource if one was already created. If a following request has different tags values,
 * Config will ignore these differences and treat it as an idempotent request of the previous. In this case, tags will not be updated, even if they are different.
 *
 * Use TagResource and UntagResource to update tags after creation.
 */
export const putConfigurationRecorder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutConfigurationRecorderRequest,
    output: PutConfigurationRecorderResponse,
    errors: [
      InvalidConfigurationRecorderNameException,
      InvalidRecordingGroupException,
      InvalidRoleException,
      MaxNumberOfConfigurationRecordersExceededException,
      UnmodifiableEntityException,
      ValidationException,
    ],
  }),
);
/**
 * Adds or updates the remediation configuration with a specific Config rule with the
 * selected target or action.
 * The API creates the `RemediationConfiguration` object for the Config rule.
 * The Config rule must already exist for you to add a remediation configuration.
 * The target (SSM document) must exist and have permissions to use the target.
 *
 * **Be aware of backward incompatible changes**
 *
 * If you make backward incompatible changes to the SSM document,
 * you must call this again to ensure the remediations can run.
 *
 * This API does not support adding remediation configurations for service-linked Config Rules such as Organization Config rules,
 * the rules deployed by conformance packs, and rules deployed by Amazon Web Services Security Hub.
 *
 * **Required fields**
 *
 * For manual remediation configuration, you need to provide a value for `automationAssumeRole` or use a value in the `assumeRole`field to remediate your resources. The SSM automation document can use either as long as it maps to a valid parameter.
 *
 * However, for automatic remediation configuration, the only valid `assumeRole` field value is `AutomationAssumeRole` and you need to provide a value for `AutomationAssumeRole` to remediate your resources.
 *
 * **Auto remediation can be initiated even for compliant resources**
 *
 * If you enable auto remediation for a specific Config rule using the PutRemediationConfigurations API or the Config console,
 * it initiates the remediation process for all non-compliant resources for that specific rule.
 * The auto remediation process relies on the compliance data snapshot which is captured on a periodic basis.
 * Any non-compliant resource that is updated between the snapshot schedule will continue to be remediated based on the last known compliance data snapshot.
 *
 * This means that in some cases auto remediation can be initiated even for compliant resources, since the bootstrap processor uses a database that can have stale evaluation results based on the last known compliance data snapshot.
 */
export const putRemediationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutRemediationConfigurationsRequest,
    output: PutRemediationConfigurationsResponse,
    errors: [InsufficientPermissionsException, InvalidParameterValueException],
  }));
/**
 * Creates or updates a delivery channel to deliver configuration
 * information and other compliance information.
 *
 * You can use this operation to create a new delivery channel or to update the Amazon S3 bucket and the
 * Amazon SNS topic of an existing delivery channel.
 *
 * For more information, see
 * **Working with the Delivery Channel**
 * in the *Config Developer Guide.*
 *
 * **One delivery channel per account per Region**
 *
 * You can have only one delivery channel for each account for each Amazon Web Services Region.
 */
export const putDeliveryChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDeliveryChannelRequest,
  output: PutDeliveryChannelResponse,
  errors: [
    InsufficientDeliveryPolicyException,
    InvalidDeliveryChannelNameException,
    InvalidS3KeyPrefixException,
    InvalidS3KmsKeyArnException,
    InvalidSNSTopicARNException,
    MaxNumberOfDeliveryChannelsExceededException,
    NoAvailableConfigurationRecorderException,
    NoSuchBucketException,
  ],
}));
