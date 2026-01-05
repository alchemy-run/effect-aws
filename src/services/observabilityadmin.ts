import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ObservabilityAdmin",
  serviceShapeName: "ObservabilityAdmin",
});
const auth = T.AwsAuthSigv4({ name: "observabilityadmin" });
const ver = T.ServiceVersion("2018-05-10");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://observabilityadmin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://observabilityadmin-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://observabilityadmin.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://observabilityadmin.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export class GetTelemetryEnrichmentStatusRequest extends S.Class<GetTelemetryEnrichmentStatusRequest>(
  "GetTelemetryEnrichmentStatusRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTelemetryEvaluationStatusRequest extends S.Class<GetTelemetryEvaluationStatusRequest>(
  "GetTelemetryEvaluationStatusRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTelemetryEvaluationStatusForOrganizationRequest extends S.Class<GetTelemetryEvaluationStatusForOrganizationRequest>(
  "GetTelemetryEvaluationStatusForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTelemetryEnrichmentRequest extends S.Class<StartTelemetryEnrichmentRequest>(
  "StartTelemetryEnrichmentRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTelemetryEvaluationRequest extends S.Class<StartTelemetryEvaluationRequest>(
  "StartTelemetryEvaluationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTelemetryEvaluationResponse extends S.Class<StartTelemetryEvaluationResponse>(
  "StartTelemetryEvaluationResponse",
)({}) {}
export class StartTelemetryEvaluationForOrganizationRequest extends S.Class<StartTelemetryEvaluationForOrganizationRequest>(
  "StartTelemetryEvaluationForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTelemetryEvaluationForOrganizationResponse extends S.Class<StartTelemetryEvaluationForOrganizationResponse>(
  "StartTelemetryEvaluationForOrganizationResponse",
)({}) {}
export class StopTelemetryEnrichmentRequest extends S.Class<StopTelemetryEnrichmentRequest>(
  "StopTelemetryEnrichmentRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTelemetryEvaluationRequest extends S.Class<StopTelemetryEvaluationRequest>(
  "StopTelemetryEvaluationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTelemetryEvaluationResponse extends S.Class<StopTelemetryEvaluationResponse>(
  "StopTelemetryEvaluationResponse",
)({}) {}
export class StopTelemetryEvaluationForOrganizationRequest extends S.Class<StopTelemetryEvaluationForOrganizationRequest>(
  "StopTelemetryEvaluationForOrganizationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTelemetryEvaluationForOrganizationResponse extends S.Class<StopTelemetryEvaluationForOrganizationResponse>(
  "StopTelemetryEvaluationForOrganizationResponse",
)({}) {}
export const ResourceTypes = S.Array(S.String);
export const AccountIdentifiers = S.Array(S.String);
export const OrganizationUnitIdentifiers = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const TelemetrySourceTypes = S.Array(S.String);
export class VPCFlowLogParameters extends S.Class<VPCFlowLogParameters>(
  "VPCFlowLogParameters",
)({
  LogFormat: S.optional(S.String),
  TrafficType: S.optional(S.String),
  MaxAggregationInterval: S.optional(S.Number),
}) {}
export const StringList = S.Array(S.String);
export class AdvancedFieldSelector extends S.Class<AdvancedFieldSelector>(
  "AdvancedFieldSelector",
)({
  Field: S.String,
  Equals: S.optional(StringList),
  StartsWith: S.optional(StringList),
  EndsWith: S.optional(StringList),
  NotEquals: S.optional(StringList),
  NotStartsWith: S.optional(StringList),
  NotEndsWith: S.optional(StringList),
}) {}
export const FieldSelectors = S.Array(AdvancedFieldSelector);
export class AdvancedEventSelector extends S.Class<AdvancedEventSelector>(
  "AdvancedEventSelector",
)({ Name: S.optional(S.String), FieldSelectors: FieldSelectors }) {}
export const AdvancedEventSelectors = S.Array(AdvancedEventSelector);
export class CloudtrailParameters extends S.Class<CloudtrailParameters>(
  "CloudtrailParameters",
)({ AdvancedEventSelectors: AdvancedEventSelectors }) {}
export class ELBLoadBalancerLoggingParameters extends S.Class<ELBLoadBalancerLoggingParameters>(
  "ELBLoadBalancerLoggingParameters",
)({
  OutputFormat: S.optional(S.String),
  FieldDelimiter: S.optional(S.String),
}) {}
export class SingleHeader extends S.Class<SingleHeader>("SingleHeader")({
  Name: S.optional(S.String),
}) {}
export class FieldToMatch extends S.Class<FieldToMatch>("FieldToMatch")({
  SingleHeader: S.optional(SingleHeader),
  UriPath: S.optional(S.String),
  QueryString: S.optional(S.String),
  Method: S.optional(S.String),
}) {}
export const RedactedFields = S.Array(FieldToMatch);
export class ActionCondition extends S.Class<ActionCondition>(
  "ActionCondition",
)({ Action: S.optional(S.String) }) {}
export class LabelNameCondition extends S.Class<LabelNameCondition>(
  "LabelNameCondition",
)({ LabelName: S.optional(S.String) }) {}
export class Condition extends S.Class<Condition>("Condition")({
  ActionCondition: S.optional(ActionCondition),
  LabelNameCondition: S.optional(LabelNameCondition),
}) {}
export const Conditions = S.Array(Condition);
export class Filter extends S.Class<Filter>("Filter")({
  Behavior: S.optional(S.String),
  Requirement: S.optional(S.String),
  Conditions: S.optional(Conditions),
}) {}
export const Filters = S.Array(Filter);
export class LoggingFilter extends S.Class<LoggingFilter>("LoggingFilter")({
  Filters: S.optional(Filters),
  DefaultBehavior: S.optional(S.String),
}) {}
export class WAFLoggingParameters extends S.Class<WAFLoggingParameters>(
  "WAFLoggingParameters",
)({
  RedactedFields: S.optional(RedactedFields),
  LoggingFilter: S.optional(LoggingFilter),
  LogType: S.optional(S.String),
}) {}
export const LogTypes = S.Array(S.String);
export class LogDeliveryParameters extends S.Class<LogDeliveryParameters>(
  "LogDeliveryParameters",
)({ LogTypes: S.optional(LogTypes) }) {}
export class TelemetryDestinationConfiguration extends S.Class<TelemetryDestinationConfiguration>(
  "TelemetryDestinationConfiguration",
)({
  DestinationType: S.optional(S.String),
  DestinationPattern: S.optional(S.String),
  RetentionInDays: S.optional(S.Number),
  VPCFlowLogParameters: S.optional(VPCFlowLogParameters),
  CloudtrailParameters: S.optional(CloudtrailParameters),
  ELBLoadBalancerLoggingParameters: S.optional(
    ELBLoadBalancerLoggingParameters,
  ),
  WAFLoggingParameters: S.optional(WAFLoggingParameters),
  LogDeliveryParameters: S.optional(LogDeliveryParameters),
}) {}
export class TelemetryRule extends S.Class<TelemetryRule>("TelemetryRule")({
  ResourceType: S.optional(S.String),
  TelemetryType: S.String,
  TelemetrySourceTypes: S.optional(TelemetrySourceTypes),
  DestinationConfiguration: S.optional(TelemetryDestinationConfiguration),
  Scope: S.optional(S.String),
  SelectionCriteria: S.optional(S.String),
}) {}
export const TagMapInput = S.Record({ key: S.String, value: S.String });
export class CreateTelemetryRuleForOrganizationInput extends S.Class<CreateTelemetryRuleForOrganizationInput>(
  "CreateTelemetryRuleForOrganizationInput",
)(
  { RuleName: S.String, Rule: TelemetryRule, Tags: S.optional(TagMapInput) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateTelemetryRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCentralizationRuleForOrganizationInput extends S.Class<DeleteCentralizationRuleForOrganizationInput>(
  "DeleteCentralizationRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteCentralizationRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCentralizationRuleForOrganizationResponse extends S.Class<DeleteCentralizationRuleForOrganizationResponse>(
  "DeleteCentralizationRuleForOrganizationResponse",
)({}) {}
export class DeleteS3TableIntegrationInput extends S.Class<DeleteS3TableIntegrationInput>(
  "DeleteS3TableIntegrationInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteS3TableIntegration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteS3TableIntegrationResponse extends S.Class<DeleteS3TableIntegrationResponse>(
  "DeleteS3TableIntegrationResponse",
)({}) {}
export class DeleteTelemetryRuleInput extends S.Class<DeleteTelemetryRuleInput>(
  "DeleteTelemetryRuleInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteTelemetryRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTelemetryRuleResponse extends S.Class<DeleteTelemetryRuleResponse>(
  "DeleteTelemetryRuleResponse",
)({}) {}
export class DeleteTelemetryRuleForOrganizationInput extends S.Class<DeleteTelemetryRuleForOrganizationInput>(
  "DeleteTelemetryRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteTelemetryRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTelemetryRuleForOrganizationResponse extends S.Class<DeleteTelemetryRuleForOrganizationResponse>(
  "DeleteTelemetryRuleForOrganizationResponse",
)({}) {}
export class GetCentralizationRuleForOrganizationInput extends S.Class<GetCentralizationRuleForOrganizationInput>(
  "GetCentralizationRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetCentralizationRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetS3TableIntegrationInput extends S.Class<GetS3TableIntegrationInput>(
  "GetS3TableIntegrationInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetS3TableIntegration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTelemetryEnrichmentStatusOutput extends S.Class<GetTelemetryEnrichmentStatusOutput>(
  "GetTelemetryEnrichmentStatusOutput",
)({
  Status: S.optional(S.String),
  AwsResourceExplorerManagedViewArn: S.optional(S.String),
}) {}
export class GetTelemetryEvaluationStatusOutput extends S.Class<GetTelemetryEvaluationStatusOutput>(
  "GetTelemetryEvaluationStatusOutput",
)({ Status: S.optional(S.String), FailureReason: S.optional(S.String) }) {}
export class GetTelemetryEvaluationStatusForOrganizationOutput extends S.Class<GetTelemetryEvaluationStatusForOrganizationOutput>(
  "GetTelemetryEvaluationStatusForOrganizationOutput",
)({ Status: S.optional(S.String), FailureReason: S.optional(S.String) }) {}
export class GetTelemetryRuleInput extends S.Class<GetTelemetryRuleInput>(
  "GetTelemetryRuleInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetTelemetryRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTelemetryRuleForOrganizationInput extends S.Class<GetTelemetryRuleForOrganizationInput>(
  "GetTelemetryRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetTelemetryRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCentralizationRulesForOrganizationInput extends S.Class<ListCentralizationRulesForOrganizationInput>(
  "ListCentralizationRulesForOrganizationInput",
)(
  {
    RuleNamePrefix: S.optional(S.String),
    AllRegions: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListCentralizationRulesForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TelemetryConfigurationState = S.Record({
  key: S.String,
  value: S.String,
});
export class ListResourceTelemetryForOrganizationInput extends S.Class<ListResourceTelemetryForOrganizationInput>(
  "ListResourceTelemetryForOrganizationInput",
)(
  {
    AccountIdentifiers: S.optional(AccountIdentifiers),
    ResourceIdentifierPrefix: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypes),
    TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
    ResourceTags: S.optional(TagMapInput),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListResourceTelemetryForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListS3TableIntegrationsInput extends S.Class<ListS3TableIntegrationsInput>(
  "ListS3TableIntegrationsInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListS3TableIntegrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { ResourceARN: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTelemetryRulesInput extends S.Class<ListTelemetryRulesInput>(
  "ListTelemetryRulesInput",
)(
  {
    RuleNamePrefix: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListTelemetryRules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTelemetryRulesForOrganizationInput extends S.Class<ListTelemetryRulesForOrganizationInput>(
  "ListTelemetryRulesForOrganizationInput",
)(
  {
    RuleNamePrefix: S.optional(S.String),
    SourceAccountIds: S.optional(AccountIdentifiers),
    SourceOrganizationUnitIds: S.optional(OrganizationUnitIdentifiers),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListTelemetryRulesForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartTelemetryEnrichmentOutput extends S.Class<StartTelemetryEnrichmentOutput>(
  "StartTelemetryEnrichmentOutput",
)({
  Status: S.optional(S.String),
  AwsResourceExplorerManagedViewArn: S.optional(S.String),
}) {}
export class StopTelemetryEnrichmentOutput extends S.Class<StopTelemetryEnrichmentOutput>(
  "StopTelemetryEnrichmentOutput",
)({ Status: S.optional(S.String) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceARN: S.String, Tags: TagMapInput },
  T.all(
    T.Http({ method: "POST", uri: "/TagResource" }),
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
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/UntagResource" }),
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
export const Regions = S.Array(S.String);
export class SourceLogsConfiguration extends S.Class<SourceLogsConfiguration>(
  "SourceLogsConfiguration",
)({
  LogGroupSelectionCriteria: S.String,
  EncryptedLogGroupStrategy: S.String,
}) {}
export class CentralizationRuleSource extends S.Class<CentralizationRuleSource>(
  "CentralizationRuleSource",
)({
  Regions: Regions,
  Scope: S.optional(S.String),
  SourceLogsConfiguration: S.optional(SourceLogsConfiguration),
}) {}
export class LogsEncryptionConfiguration extends S.Class<LogsEncryptionConfiguration>(
  "LogsEncryptionConfiguration",
)({
  EncryptionStrategy: S.String,
  KmsKeyArn: S.optional(S.String),
  EncryptionConflictResolutionStrategy: S.optional(S.String),
}) {}
export class LogsBackupConfiguration extends S.Class<LogsBackupConfiguration>(
  "LogsBackupConfiguration",
)({ Region: S.String, KmsKeyArn: S.optional(S.String) }) {}
export class DestinationLogsConfiguration extends S.Class<DestinationLogsConfiguration>(
  "DestinationLogsConfiguration",
)({
  LogsEncryptionConfiguration: S.optional(LogsEncryptionConfiguration),
  BackupConfiguration: S.optional(LogsBackupConfiguration),
}) {}
export class CentralizationRuleDestination extends S.Class<CentralizationRuleDestination>(
  "CentralizationRuleDestination",
)({
  Region: S.String,
  Account: S.optional(S.String),
  DestinationLogsConfiguration: S.optional(DestinationLogsConfiguration),
}) {}
export class CentralizationRule extends S.Class<CentralizationRule>(
  "CentralizationRule",
)({
  Source: CentralizationRuleSource,
  Destination: CentralizationRuleDestination,
}) {}
export class UpdateCentralizationRuleForOrganizationInput extends S.Class<UpdateCentralizationRuleForOrganizationInput>(
  "UpdateCentralizationRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String, Rule: CentralizationRule },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateCentralizationRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTelemetryRuleInput extends S.Class<UpdateTelemetryRuleInput>(
  "UpdateTelemetryRuleInput",
)(
  { RuleIdentifier: S.String, Rule: TelemetryRule },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateTelemetryRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTelemetryRuleForOrganizationInput extends S.Class<UpdateTelemetryRuleForOrganizationInput>(
  "UpdateTelemetryRuleForOrganizationInput",
)(
  { RuleIdentifier: S.String, Rule: TelemetryRule },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateTelemetryRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TelemetryPipelineConfiguration extends S.Class<TelemetryPipelineConfiguration>(
  "TelemetryPipelineConfiguration",
)({ Body: S.String }) {}
export class ValidateTelemetryPipelineConfigurationInput extends S.Class<ValidateTelemetryPipelineConfigurationInput>(
  "ValidateTelemetryPipelineConfigurationInput",
)(
  { Configuration: TelemetryPipelineConfiguration },
  T.all(
    T.Http({ method: "POST", uri: "/ValidateTelemetryPipelineConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTelemetryPipelineInput extends S.Class<CreateTelemetryPipelineInput>(
  "CreateTelemetryPipelineInput",
)(
  {
    Name: S.String,
    Configuration: TelemetryPipelineConfiguration,
    Tags: S.optional(TagMapInput),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateTelemetryPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTelemetryPipelineInput extends S.Class<GetTelemetryPipelineInput>(
  "GetTelemetryPipelineInput",
)(
  { PipelineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetTelemetryPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTelemetryPipelineInput extends S.Class<UpdateTelemetryPipelineInput>(
  "UpdateTelemetryPipelineInput",
)(
  {
    PipelineIdentifier: S.String,
    Configuration: TelemetryPipelineConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateTelemetryPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTelemetryPipelineOutput extends S.Class<UpdateTelemetryPipelineOutput>(
  "UpdateTelemetryPipelineOutput",
)({}) {}
export class DeleteTelemetryPipelineInput extends S.Class<DeleteTelemetryPipelineInput>(
  "DeleteTelemetryPipelineInput",
)(
  { PipelineIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteTelemetryPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTelemetryPipelineOutput extends S.Class<DeleteTelemetryPipelineOutput>(
  "DeleteTelemetryPipelineOutput",
)({}) {}
export class ListTelemetryPipelinesInput extends S.Class<ListTelemetryPipelinesInput>(
  "ListTelemetryPipelinesInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListTelemetryPipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Encryption extends S.Class<Encryption>("Encryption")({
  SseAlgorithm: S.String,
  KmsKeyArn: S.optional(S.String),
}) {}
export class Record extends S.Class<Record>("Record")({
  Data: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const Records = S.Array(Record);
export class CreateS3TableIntegrationInput extends S.Class<CreateS3TableIntegrationInput>(
  "CreateS3TableIntegrationInput",
)(
  { Encryption: Encryption, RoleArn: S.String, Tags: S.optional(TagMapInput) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateS3TableIntegration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTelemetryRuleForOrganizationOutput extends S.Class<CreateTelemetryRuleForOrganizationOutput>(
  "CreateTelemetryRuleForOrganizationOutput",
)({ RuleArn: S.optional(S.String) }) {}
export class GetCentralizationRuleForOrganizationOutput extends S.Class<GetCentralizationRuleForOrganizationOutput>(
  "GetCentralizationRuleForOrganizationOutput",
)({
  RuleName: S.optional(S.String),
  RuleArn: S.optional(S.String),
  CreatorAccountId: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
  CreatedRegion: S.optional(S.String),
  LastUpdateTimeStamp: S.optional(S.Number),
  RuleHealth: S.optional(S.String),
  FailureReason: S.optional(S.String),
  CentralizationRule: S.optional(CentralizationRule),
}) {}
export class GetS3TableIntegrationOutput extends S.Class<GetS3TableIntegrationOutput>(
  "GetS3TableIntegrationOutput",
)({
  Arn: S.optional(S.String),
  RoleArn: S.optional(S.String),
  Status: S.optional(S.String),
  Encryption: S.optional(Encryption),
  DestinationTableBucketArn: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
}) {}
export class GetTelemetryRuleOutput extends S.Class<GetTelemetryRuleOutput>(
  "GetTelemetryRuleOutput",
)({
  RuleName: S.optional(S.String),
  RuleArn: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
  LastUpdateTimeStamp: S.optional(S.Number),
  TelemetryRule: S.optional(TelemetryRule),
}) {}
export class GetTelemetryRuleForOrganizationOutput extends S.Class<GetTelemetryRuleForOrganizationOutput>(
  "GetTelemetryRuleForOrganizationOutput",
)({
  RuleName: S.optional(S.String),
  RuleArn: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
  LastUpdateTimeStamp: S.optional(S.Number),
  TelemetryRule: S.optional(TelemetryRule),
}) {}
export class ListResourceTelemetryInput extends S.Class<ListResourceTelemetryInput>(
  "ListResourceTelemetryInput",
)(
  {
    ResourceIdentifierPrefix: S.optional(S.String),
    ResourceTypes: S.optional(ResourceTypes),
    TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
    ResourceTags: S.optional(TagMapInput),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListResourceTelemetry" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TelemetryRuleSummary extends S.Class<TelemetryRuleSummary>(
  "TelemetryRuleSummary",
)({
  RuleName: S.optional(S.String),
  RuleArn: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
  LastUpdateTimeStamp: S.optional(S.Number),
  ResourceType: S.optional(S.String),
  TelemetryType: S.optional(S.String),
  TelemetrySourceTypes: S.optional(TelemetrySourceTypes),
}) {}
export const TelemetryRuleSummaries = S.Array(TelemetryRuleSummary);
export class ListTelemetryRulesForOrganizationOutput extends S.Class<ListTelemetryRulesForOrganizationOutput>(
  "ListTelemetryRulesForOrganizationOutput",
)({
  TelemetryRuleSummaries: S.optional(TelemetryRuleSummaries),
  NextToken: S.optional(S.String),
}) {}
export class TestTelemetryPipelineInput extends S.Class<TestTelemetryPipelineInput>(
  "TestTelemetryPipelineInput",
)(
  { Records: Records, Configuration: TelemetryPipelineConfiguration },
  T.all(
    T.Http({ method: "POST", uri: "/TestTelemetryPipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCentralizationRuleForOrganizationOutput extends S.Class<UpdateCentralizationRuleForOrganizationOutput>(
  "UpdateCentralizationRuleForOrganizationOutput",
)({ RuleArn: S.optional(S.String) }) {}
export class UpdateTelemetryRuleOutput extends S.Class<UpdateTelemetryRuleOutput>(
  "UpdateTelemetryRuleOutput",
)({ RuleArn: S.optional(S.String) }) {}
export class UpdateTelemetryRuleForOrganizationOutput extends S.Class<UpdateTelemetryRuleForOrganizationOutput>(
  "UpdateTelemetryRuleForOrganizationOutput",
)({ RuleArn: S.optional(S.String) }) {}
export class CreateTelemetryPipelineOutput extends S.Class<CreateTelemetryPipelineOutput>(
  "CreateTelemetryPipelineOutput",
)({ Arn: S.optional(S.String) }) {}
export class CentralizationRuleSummary extends S.Class<CentralizationRuleSummary>(
  "CentralizationRuleSummary",
)({
  RuleName: S.optional(S.String),
  RuleArn: S.optional(S.String),
  CreatorAccountId: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Number),
  CreatedRegion: S.optional(S.String),
  LastUpdateTimeStamp: S.optional(S.Number),
  RuleHealth: S.optional(S.String),
  FailureReason: S.optional(S.String),
  DestinationAccountId: S.optional(S.String),
  DestinationRegion: S.optional(S.String),
}) {}
export const CentralizationRuleSummaries = S.Array(CentralizationRuleSummary);
export const TagMapOutput = S.Record({ key: S.String, value: S.String });
export class TelemetryConfiguration extends S.Class<TelemetryConfiguration>(
  "TelemetryConfiguration",
)({
  AccountIdentifier: S.optional(S.String),
  TelemetryConfigurationState: S.optional(TelemetryConfigurationState),
  ResourceType: S.optional(S.String),
  ResourceIdentifier: S.optional(S.String),
  ResourceTags: S.optional(TagMapOutput),
  LastUpdateTimeStamp: S.optional(S.Number),
}) {}
export const TelemetryConfigurations = S.Array(TelemetryConfiguration);
export class IntegrationSummary extends S.Class<IntegrationSummary>(
  "IntegrationSummary",
)({ Arn: S.optional(S.String), Status: S.optional(S.String) }) {}
export const IntegrationSummaries = S.Array(IntegrationSummary);
export const Processors = S.Array(S.String);
export const Sinks = S.Array(S.String);
export class CreateS3TableIntegrationOutput extends S.Class<CreateS3TableIntegrationOutput>(
  "CreateS3TableIntegrationOutput",
)({ Arn: S.optional(S.String) }) {}
export class ListCentralizationRulesForOrganizationOutput extends S.Class<ListCentralizationRulesForOrganizationOutput>(
  "ListCentralizationRulesForOrganizationOutput",
)({
  CentralizationRuleSummaries: S.optional(CentralizationRuleSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListResourceTelemetryOutput extends S.Class<ListResourceTelemetryOutput>(
  "ListResourceTelemetryOutput",
)({
  TelemetryConfigurations: S.optional(TelemetryConfigurations),
  NextToken: S.optional(S.String),
}) {}
export class ListResourceTelemetryForOrganizationOutput extends S.Class<ListResourceTelemetryForOrganizationOutput>(
  "ListResourceTelemetryForOrganizationOutput",
)({
  TelemetryConfigurations: S.optional(TelemetryConfigurations),
  NextToken: S.optional(S.String),
}) {}
export class ListS3TableIntegrationsOutput extends S.Class<ListS3TableIntegrationsOutput>(
  "ListS3TableIntegrationsOutput",
)({
  IntegrationSummaries: S.optional(IntegrationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: TagMapOutput }) {}
export class ListTelemetryRulesOutput extends S.Class<ListTelemetryRulesOutput>(
  "ListTelemetryRulesOutput",
)({
  TelemetryRuleSummaries: S.optional(TelemetryRuleSummaries),
  NextToken: S.optional(S.String),
}) {}
export const FieldMap = S.Record({ key: S.String, value: S.String });
export class TelemetryPipelineStatusReason extends S.Class<TelemetryPipelineStatusReason>(
  "TelemetryPipelineStatusReason",
)({ Description: S.optional(S.String) }) {}
export class ValidationError extends S.Class<ValidationError>(
  "ValidationError",
)({
  Message: S.optional(S.String),
  Reason: S.optional(S.String),
  FieldMap: S.optional(FieldMap),
}) {}
export const ValidationErrors = S.Array(ValidationError);
export class TelemetryPipeline extends S.Class<TelemetryPipeline>(
  "TelemetryPipeline",
)({
  CreatedTimeStamp: S.optional(S.Number),
  LastUpdateTimeStamp: S.optional(S.Number),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Configuration: S.optional(TelemetryPipelineConfiguration),
  Status: S.optional(S.String),
  StatusReason: S.optional(TelemetryPipelineStatusReason),
  Tags: S.optional(TagMapOutput),
}) {}
export class Source extends S.Class<Source>("Source")({
  Type: S.optional(S.String),
}) {}
export const Sources = S.Array(Source);
export class DataSource extends S.Class<DataSource>("DataSource")({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const DataSources = S.Array(DataSource);
export class ValidateTelemetryPipelineConfigurationOutput extends S.Class<ValidateTelemetryPipelineConfigurationOutput>(
  "ValidateTelemetryPipelineConfigurationOutput",
)({ Errors: S.optional(ValidationErrors) }) {}
export class GetTelemetryPipelineOutput extends S.Class<GetTelemetryPipelineOutput>(
  "GetTelemetryPipelineOutput",
)({ Pipeline: S.optional(TelemetryPipeline) }) {}
export class PipelineOutputError extends S.Class<PipelineOutputError>(
  "PipelineOutputError",
)({ Message: S.optional(S.String) }) {}
export class ConfigurationSummary extends S.Class<ConfigurationSummary>(
  "ConfigurationSummary",
)({
  Sources: S.optional(Sources),
  DataSources: S.optional(DataSources),
  Processors: S.optional(Processors),
  ProcessorCount: S.optional(S.Number),
  Sinks: S.optional(Sinks),
}) {}
export class PipelineOutput extends S.Class<PipelineOutput>("PipelineOutput")({
  Record: S.optional(Record),
  Error: S.optional(PipelineOutputError),
}) {}
export const PipelineOutputs = S.Array(PipelineOutput);
export class TelemetryPipelineSummary extends S.Class<TelemetryPipelineSummary>(
  "TelemetryPipelineSummary",
)({
  CreatedTimeStamp: S.optional(S.Number),
  LastUpdateTimeStamp: S.optional(S.Number),
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Tags: S.optional(TagMapOutput),
  ConfigurationSummary: S.optional(ConfigurationSummary),
}) {}
export const TelemetryPipelineSummaries = S.Array(TelemetryPipelineSummary);
export class CreateCentralizationRuleForOrganizationInput extends S.Class<CreateCentralizationRuleForOrganizationInput>(
  "CreateCentralizationRuleForOrganizationInput",
)(
  {
    RuleName: S.String,
    Rule: CentralizationRule,
    Tags: S.optional(TagMapInput),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateCentralizationRuleForOrganization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TestTelemetryPipelineOutput extends S.Class<TestTelemetryPipelineOutput>(
  "TestTelemetryPipelineOutput",
)({ Results: S.optional(PipelineOutputs) }) {}
export class ListTelemetryPipelinesOutput extends S.Class<ListTelemetryPipelinesOutput>(
  "ListTelemetryPipelinesOutput",
)({
  PipelineSummaries: S.optional(TelemetryPipelineSummaries),
  NextToken: S.optional(S.String),
}) {}
export class CreateCentralizationRuleForOrganizationOutput extends S.Class<CreateCentralizationRuleForOrganizationOutput>(
  "CreateCentralizationRuleForOrganizationOutput",
)({ RuleArn: S.optional(S.String) }) {}
export class CreateTelemetryRuleInput extends S.Class<CreateTelemetryRuleInput>(
  "CreateTelemetryRuleInput",
)(
  { RuleName: S.String, Rule: TelemetryRule, Tags: S.optional(TagMapInput) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateTelemetryRule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTelemetryRuleOutput extends S.Class<CreateTelemetryRuleOutput>(
  "CreateTelemetryRuleOutput",
)({ RuleArn: S.optional(S.String) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    amznErrorType: S.optional(S.String).pipe(T.HttpHeader("x-amzn-ErrorType")),
  },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Errors: S.optional(ValidationErrors) },
) {}

//# Operations
/**
 * Disables the resource tags for telemetry feature for your account, stopping the enhancement of telemetry data with additional resource metadata.
 */
export const stopTelemetryEnrichment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopTelemetryEnrichmentRequest,
    output: StopTelemetryEnrichmentOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Returns the current onboarding status of the telemetry config feature, including the status of the feature and reason the feature failed to start or stop.
 */
export const getTelemetryEvaluationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTelemetryEvaluationStatusRequest,
    output: GetTelemetryEvaluationStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
    ],
  }));
/**
 * Enables the resource tags for telemetry feature for your account, which enhances telemetry data with additional resource metadata from Resource Explorer to provide richer context for monitoring and observability.
 */
export const startTelemetryEnrichment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTelemetryEnrichmentRequest,
    output: StartTelemetryEnrichmentOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Returns the current status of the resource tags for telemetry feature, which enhances telemetry data with additional resource metadata from Resource Explorer.
 */
export const getTelemetryEnrichmentStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTelemetryEnrichmentStatusRequest,
    output: GetTelemetryEnrichmentStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * This action begins onboarding the caller Amazon Web Services account to the telemetry config feature.
 */
export const startTelemetryEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartTelemetryEvaluationRequest,
    output: StartTelemetryEvaluationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Validates a pipeline configuration without creating the pipeline. This operation checks the configuration for syntax errors and compatibility issues.
 */
export const validateTelemetryPipelineConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ValidateTelemetryPipelineConfigurationInput,
    output: ValidateTelemetryPipelineConfigurationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about a specific telemetry pipeline, including its configuration, status, and metadata.
 */
export const getTelemetryPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTelemetryPipelineInput,
    output: GetTelemetryPipelineOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a telemetry pipeline for processing and transforming telemetry data. The pipeline defines how data flows from sources through processors to destinations, enabling data transformation and delivering capabilities.
 */
export const createTelemetryPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTelemetryPipelineInput,
    output: CreateTelemetryPipelineOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an S3 Table integration and its associated data. This operation removes the connection between CloudWatch Observability Admin and S3 Tables.
 */
export const deleteS3TableIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteS3TableIntegrationInput,
    output: DeleteS3TableIntegrationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidStateException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * This actions begins onboarding the organization and all member accounts to the telemetry config feature.
 */
export const startTelemetryEvaluationForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartTelemetryEvaluationForOrganizationRequest,
    output: StartTelemetryEvaluationForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * This action begins offboarding the caller Amazon Web Services account from the telemetry config feature.
 */
export const stopTelemetryEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopTelemetryEvaluationRequest,
    output: StopTelemetryEvaluationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * This action offboards the Organization of the caller Amazon Web Services account from the telemetry config feature.
 */
export const stopTelemetryEvaluationForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopTelemetryEvaluationForOrganizationRequest,
    output: StopTelemetryEvaluationForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * This returns the onboarding status of the telemetry configuration feature for the organization. It can only be called by a Management Account of an Amazon Web Services Organization or an assigned Delegated Admin Account of Amazon CloudWatch telemetry config.
 */
export const getTelemetryEvaluationStatusForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTelemetryEvaluationStatusForOrganizationRequest,
    output: GetTelemetryEvaluationStatusForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Lists all telemetry rules in your organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const listTelemetryRulesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTelemetryRulesForOrganizationInput,
    output: ListTelemetryRulesForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TelemetryRuleSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all centralization rules in your organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const listCentralizationRulesForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCentralizationRulesForOrganizationInput,
    output: ListCentralizationRulesForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CentralizationRuleSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of telemetry configurations for Amazon Web Services resources supported by telemetry config. For more information, see Auditing CloudWatch telemetry configurations.
 */
export const listResourceTelemetry =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceTelemetryInput,
    output: ListResourceTelemetryOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TelemetryConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of telemetry configurations for Amazon Web Services resources supported by telemetry config in the organization.
 */
export const listResourceTelemetryForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceTelemetryForOrganizationInput,
    output: ListResourceTelemetryForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TelemetryConfigurations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all S3 Table integrations in your account. We recommend using pagination to ensure that the operation returns quickly and successfully.
 */
export const listS3TableIntegrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListS3TableIntegrationsInput,
    output: ListS3TableIntegrationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "IntegrationSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all telemetry rules in your account. You can filter the results by specifying a rule name prefix.
 */
export const listTelemetryRules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTelemetryRulesInput,
    output: ListTelemetryRulesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TelemetryRuleSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates an existing telemetry rule in your account. If multiple users attempt to modify the same telemetry rule simultaneously, a ConflictException is returned to provide specific error information for concurrent modification scenarios.
 */
export const updateTelemetryRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTelemetryRuleInput,
  output: UpdateTelemetryRuleOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Updates an existing telemetry rule that applies across an Amazon Web Services Organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const updateTelemetryRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateTelemetryRuleForOrganizationInput,
    output: UpdateTelemetryRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Adds or updates tags for a resource. Supports telemetry rule resources and telemetry pipeline resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource. Supports telemetry rule resources and telemetry pipeline resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing telemetry pipeline.
 *
 * The following attributes cannot be updated after pipeline creation:
 *
 * - **Pipeline name** - The pipeline name is immutable
 *
 * - **Pipeline ARN** - The ARN is automatically generated and cannot be changed
 *
 * - **Source type** - Once a pipeline is created with a specific source type (such as S3, CloudWatch Logs, GitHub, or third-party sources), it cannot be changed to a different source type
 *
 * Processors can be added, removed, or modified. However, some processors are not supported for third-party pipelines and cannot be added through updates.
 *
 * **Source-Specific Update Rules**
 *
 * ### CloudWatch Logs Sources (Vended and Custom)
 *
 * **Updatable:** `sts_role_arn`
 *
 * **Fixed:** `data_source_name`, `data_source_type`, sink (must remain `@original`)
 *
 * ### S3 Sources (Crowdstrike, Zscaler, SentinelOne, Custom)
 *
 * **Updatable:** All SQS configuration parameters, `sts_role_arn`, codec settings, compression type, bucket ownership settings, sink log group
 *
 * **Fixed:** `notification_type`, `aws.region`
 *
 * ### GitHub Audit Logs
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `scope` (can switch between ORGANIZATION/ENTERPRISE), `organization` or `enterprise` name, `range`, authentication credentials (PAT or GitHub App)
 *
 * ### Microsoft Sources (Entra ID, Office365, Windows)
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `tenant_id`, `workspace_id` (Windows only), OAuth2 credentials (`client_id`, `client_secret`)
 *
 * ### Okta Sources (SSO, Auth0)
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `domain`, `range` (SSO only), OAuth2 credentials (`client_id`, `client_secret`)
 *
 * ### Palo Alto Networks
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `hostname`, basic authentication credentials (`username`, `password`)
 *
 * ### ServiceNow CMDB
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `instance_url`, `range`, OAuth2 credentials (`client_id`, `client_secret`)
 *
 * ### Wiz CNAPP
 *
 * **Updatable:** All Amazon Web Services Secrets Manager attributes, `region`, `range`, OAuth2 credentials (`client_id`, `client_secret`)
 */
export const updateTelemetryPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTelemetryPipelineInput,
    output: UpdateTelemetryPipelineOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an organization-wide centralization rule. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const deleteCentralizationRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCentralizationRuleForOrganizationInput,
    output: DeleteCentralizationRuleForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Deletes a telemetry rule from your account. Any telemetry configurations previously created by the rule will remain but no new resources will be configured by this rule.
 */
export const deleteTelemetryRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTelemetryRuleInput,
  output: DeleteTelemetryRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Deletes an organization-wide telemetry rule. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const deleteTelemetryRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTelemetryRuleForOrganizationInput,
    output: DeleteTelemetryRuleForOrganizationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details of a specific organization centralization rule. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const getCentralizationRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCentralizationRuleForOrganizationInput,
    output: GetCentralizationRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Retrieves information about a specific S3 Table integration, including its configuration, status, and metadata.
 */
export const getS3TableIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetS3TableIntegrationInput,
    output: GetS3TableIntegrationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the details of a specific telemetry rule in your account.
 */
export const getTelemetryRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTelemetryRuleInput,
  output: GetTelemetryRuleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details of a specific organization telemetry rule. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const getTelemetryRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTelemetryRuleForOrganizationInput,
    output: GetTelemetryRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Deletes a telemetry pipeline and its associated resources. This operation stops data processing and removes the pipeline configuration.
 */
export const deleteTelemetryPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTelemetryPipelineInput,
    output: DeleteTelemetryPipelineOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Lists all tags attached to the specified resource. Supports telemetry rule resources and telemetry pipeline resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
/**
 * Creates a telemetry rule that applies across an Amazon Web Services Organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const createTelemetryRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTelemetryRuleForOrganizationInput,
    output: CreateTelemetryRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Creates an integration between CloudWatch and S3 Tables for analytics. This integration enables querying CloudWatch telemetry data using analytics engines like Amazon Athena, Amazon Redshift, and Apache Spark.
 */
export const createS3TableIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateS3TableIntegrationInput,
    output: CreateS3TableIntegrationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing centralization rule that applies across an Amazon Web Services Organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const updateCentralizationRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCentralizationRuleForOrganizationInput,
    output: UpdateCentralizationRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Tests a pipeline configuration with sample records to validate data processing before deployment. This operation helps ensure your pipeline configuration works as expected.
 */
export const testTelemetryPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestTelemetryPipelineInput,
    output: TestTelemetryPipelineOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of telemetry pipelines in your account. Returns up to 100 results. If more than 100 telemetry pipelines exist, include the `NextToken` value from the response to retrieve the next set of results.
 */
export const listTelemetryPipelines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTelemetryPipelinesInput,
    output: ListTelemetryPipelinesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      TooManyRequestsException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PipelineSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Creates a centralization rule that applies across an Amazon Web Services Organization. This operation can only be called by the organization's management account or a delegated administrator account.
 */
export const createCentralizationRuleForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCentralizationRuleForOrganizationInput,
    output: CreateCentralizationRuleForOrganizationOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      TooManyRequestsException,
      ValidationException,
    ],
  }));
/**
 * Creates a telemetry rule that defines how telemetry should be configured for Amazon Web Services resources in your account. The rule specifies which resources should have telemetry enabled and how that telemetry data should be collected based on resource type, telemetry type, and selection criteria.
 */
export const createTelemetryRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTelemetryRuleInput,
  output: CreateTelemetryRuleOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    TooManyRequestsException,
    ValidationException,
  ],
}));
